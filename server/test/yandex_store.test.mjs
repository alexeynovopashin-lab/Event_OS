import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// Магазин YDB без настоящей YDB: подставной драйвер ловит запросы, тест сверяет,
// что у каждого запроса объявлены (DECLARE) ровно те параметры, которые ему передают.
// Это ловит опечатки в именах; правильность самого YQL проверяется только на живой базе (README, шаги проверки).
const require = createRequire(import.meta.url);
let ydbAvailable = true;
try { require("../yandex/node_modules/ydb-sdk"); } catch { ydbAvailable = false; }

test("YDB-хранилище: параметры запросов совпадают с DECLARE", { skip: !ydbAvailable && "ydb-sdk не установлен (npm ci в server/yandex)" }, async () => {
  const { createYdbStore } = await import("../yandex/store.mjs");
  const seen = [];
  const driver = { tableClient: { withSessionRetry: async (cb) => cb({ executeQuery: async (yql, params) => { seen.push({ yql, params }); return { resultSets: [] }; } }) } };
  const store = createYdbStore(driver);
  const dev = { deviceId: "dv_1", idKey: "k", avatarKey: "a", passHash: "h", country: "RU", home: "ru", appVersion: "1", name: "", createdAt: 1 };
  await store.getDevice("dv_1");
  await store.putDevice(dev);
  await store.deleteDevice("dv_1");
  await store.listDevicesByIdKey("k");
  await store.getAvatar("a");
  await store.putAvatar("a", new Uint8Array([1]), { version: 1, sha256: "s", size: 1, updatedAt: 1 });
  await store.deleteAvatar("a");
  await store.putMoved({ fromKey: "f", toKey: "t", at: 1 });
  await store.listMovedTo("t");
  await store.deleteMoved("f");
  await store.hit("dv_1", 5).catch(() => {}); // пустой ответ подставного драйвера: читать нечего
  assert.equal(seen.length, 11);
  for (const { yql, params } of seen) {
    const declared = [...yql.matchAll(/DECLARE\s+(\$\w+)\s+AS/g)].map((m) => m[1]).sort();
    assert.deepEqual(Object.keys(params).sort(), declared, yql.slice(0, 60));
    const used = new Set([...yql.matchAll(/\$\w+/g)].map((m) => m[0]));
    for (const d of declared) assert.ok(used.has(d));
  }
});

test("YDB-хранилище: строки превращаются в записи ядра", { skip: !ydbAvailable && "ydb-sdk не установлен" }, async () => {
  const { createYdbStore } = await import("../yandex/store.mjs");
  const { Ydb, Types } = require("../yandex/node_modules/ydb-sdk");
  const rs = Ydb.ResultSet.create({
    columns: ["deviceId", "idKey", "avatarKey", "passHash", "country", "home", "appVersion", "personName"].map((name) => ({ name, type: Types.UTF8 }))
      .concat([{ name: "createdAt", type: Types.INT64 }]),
    rows: [{ items: [..."abcdefgh"].map((c) => ({ textValue: c })).concat([{ int64Value: 1700000000123 }]) }],
  });
  const driver = { tableClient: { withSessionRetry: async (cb) => cb({ executeQuery: async () => ({ resultSets: [rs] }) }) } };
  const d = await createYdbStore(driver).getDevice("x");
  assert.deepEqual(d, { deviceId: "a", idKey: "b", avatarKey: "c", passHash: "d", country: "e", home: "f", appVersion: "g", name: "h", createdAt: 1700000000123 });
});
