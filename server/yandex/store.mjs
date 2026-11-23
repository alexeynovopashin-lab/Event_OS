// Хранилище дома ru: YDB serverless. Реализует «розетку» из ../core/memory_store.mjs.
// Аватарки лежат в той же базе (колонка body, ≤ 1 МБ на строку) — отдельный бакет и ключи доступа к нему
// для среза 1 не нужны. Если аватарок станет много, их можно вынести в Object Storage, не трогая core/.
//
// НЕ ПРОВЕРЕНО на живой YDB: код написан по документации ydb-sdk 5.11 и проверен только тестом на подставном
// драйвере (имена параметров запросов совпадают с DECLARE). Первая настоящая проверка — шаги 1–2 из README.

import { createRequire } from "node:module";

// Берём CommonJS-сборку ydb-sdk: в архив ES-копия не кладётся (см. build.sh).
const ydb = createRequire(import.meta.url)("ydb-sdk");
const { Driver, MetadataAuthService, TypedValues, TypedData } = ydb;

export const DEFAULT_ENDPOINT = "grpcs://ydb.serverless.yandexcloud.net:2135";

export async function connectYdb({ endpoint = DEFAULT_ENDPOINT, database }) {
  if (!database) throw new Error("YDB_DATABASE is required");
  const driver = new Driver({ endpoint, database, authService: new MetadataAuthService() });
  if (!(await driver.ready(10000))) throw new Error("YDB is not ready");
  return driver;
}

const num = (v) => (v == null ? 0 : typeof v === "number" ? v : v.toNumber());

const DEVICE_COLS = "deviceId, idKey, avatarKey, passHash, country, home, appVersion, personName, createdAt";
const toDevice = (r) => ({
  deviceId: r.deviceId, idKey: r.idKey, avatarKey: r.avatarKey, passHash: r.passHash, country: r.country,
  home: r.home, appVersion: r.appVersion, name: r.personName, createdAt: num(r.createdAt),
});

export function createYdbStore(driver) {
  async function run(yql, params = {}) {
    return driver.tableClient.withSessionRetry(async (session) => {
      const res = await session.executeQuery(yql, params);
      const rs = res.resultSets && res.resultSets[0];
      return rs ? TypedData.createNativeObjects(rs) : [];
    });
  }
  const u = TypedValues.utf8;

  return {
    async getDevice(id) {
      const rows = await run(`DECLARE $id AS Utf8;
        SELECT ${DEVICE_COLS} FROM devices WHERE deviceId = $id;`, { $id: u(id) });
      return rows.length ? toDevice(rows[0]) : null;
    },

    async putDevice(d) {
      await run(`DECLARE $deviceId AS Utf8; DECLARE $idKey AS Utf8; DECLARE $avatarKey AS Utf8; DECLARE $passHash AS Utf8;
        DECLARE $country AS Utf8; DECLARE $home AS Utf8; DECLARE $appVersion AS Utf8; DECLARE $personName AS Utf8; DECLARE $createdAt AS Int64;
        UPSERT INTO devices (${DEVICE_COLS})
        VALUES ($deviceId, $idKey, $avatarKey, $passHash, $country, $home, $appVersion, $personName, $createdAt);`, {
        $deviceId: u(d.deviceId), $idKey: u(d.idKey), $avatarKey: u(d.avatarKey), $passHash: u(d.passHash),
        $country: u(d.country || ""), $home: u(d.home || ""), $appVersion: u(d.appVersion || ""), $personName: u(d.name || ""),
        $createdAt: TypedValues.int64(d.createdAt),
      });
    },

    async deleteDevice(id) {
      await run(`DECLARE $id AS Utf8;
        DELETE FROM devices WHERE deviceId = $id;
        DELETE FROM rate WHERE deviceId = $id;`, { $id: u(id) });
    },

    async listDevicesByIdKey(idKey) {
      const rows = await run(`DECLARE $k AS Utf8;
        SELECT ${DEVICE_COLS} FROM devices VIEW idx_id WHERE idKey = $k;`, { $k: u(idKey) });
      return rows.map(toDevice);
    },

    async getAvatar(avatarKey) {
      const rows = await run(`DECLARE $k AS Utf8;
        SELECT ver, sha256, bytesLen, updatedAt, body FROM avatars WHERE avatarKey = $k;`, { $k: u(avatarKey) });
      if (!rows.length) return null;
      const r = rows[0];
      return {
        bytes: new Uint8Array(r.body),
        meta: { version: num(r.ver), sha256: r.sha256, size: num(r.bytesLen), updatedAt: num(r.updatedAt) },
      };
    },

    // Одна строка на аватарку: UPSERT заменяет её целиком и атомарно — старой версии не остаётся нигде.
    async putAvatar(avatarKey, bytes, meta) {
      await run(`DECLARE $k AS Utf8; DECLARE $ver AS Uint32; DECLARE $sha AS Utf8; DECLARE $len AS Uint32;
        DECLARE $at AS Int64; DECLARE $body AS String;
        UPSERT INTO avatars (avatarKey, ver, sha256, bytesLen, updatedAt, body) VALUES ($k, $ver, $sha, $len, $at, $body);`, {
        $k: u(avatarKey), $ver: TypedValues.uint32(meta.version), $sha: u(meta.sha256), $len: TypedValues.uint32(meta.size),
        $at: TypedValues.int64(meta.updatedAt), $body: TypedValues.bytes(Buffer.from(bytes)),
      });
    },

    async deleteAvatar(avatarKey) {
      await run(`DECLARE $k AS Utf8; DELETE FROM avatars WHERE avatarKey = $k;`, { $k: u(avatarKey) });
    },

    async putMoved(m) {
      await run(`DECLARE $f AS Utf8; DECLARE $t AS Utf8; DECLARE $at AS Int64;
        UPSERT INTO moved (fromKey, toKey, movedAt) VALUES ($f, $t, $at);`, {
        $f: u(m.fromKey), $t: u(m.toKey), $at: TypedValues.int64(m.at),
      });
    },

    async listMovedTo(toKey) {
      const rows = await run(`DECLARE $t AS Utf8;
        SELECT fromKey, toKey, movedAt FROM moved VIEW idx_to WHERE toKey = $t;`, { $t: u(toKey) });
      return rows.map((r) => ({ fromKey: r.fromKey, toKey: r.toKey, at: num(r.movedAt) }));
    },

    async deleteMoved(fromKey) {
      await run(`DECLARE $f AS Utf8; DELETE FROM moved WHERE fromKey = $f;`, { $f: u(fromKey) });
    },

    // Счётчик запросов в минуту: одна строка на устройство, один запрос = одна транзакция.
    async hit(deviceId, minute) {
      const rows = await run(`DECLARE $id AS Utf8; DECLARE $m AS Int64;
        $cur = (SELECT IF(minuteNo = $m, n + 1, 1) FROM rate WHERE deviceId = $id);
        $next = CAST(COALESCE($cur, 1) AS Int32);
        UPSERT INTO rate (deviceId, minuteNo, n) VALUES ($id, $m, $next);
        SELECT $next AS n;`, { $id: u(deviceId), $m: TypedValues.int64(minute) });
      return num(rows[0].n);
    },
  };
}
