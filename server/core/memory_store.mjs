// Подложное хранилище: всё в памяти. Для тестов и для локального запуска (dev.mjs).
// Задаёт «розетку», которую реализует каждый дом (Яндекс — YDB, позже Cloudflare — KV + R2):
//
//   getDevice(deviceId)                 → запись | null
//   putDevice(rec)                      — создать или заменить
//   deleteDevice(deviceId)              — вместе со счётчиком запросов
//   listDevicesByIdKey(idKey)           → [запись]
//   getAvatar(avatarKey)                → { bytes, meta } | null
//   putAvatar(avatarKey, bytes, meta)   — сначала записать новую версию, потом стереть старую
//   deleteAvatar(avatarKey)
//   putMoved({ fromKey, toKey, at })    — пометка «переехал»
//   listMovedTo(toKey)                  → [{ fromKey, toKey, at }]
//   deleteMoved(fromKey)
//   hit(deviceId, minute)               → сколько запросов в эту минуту (с учётом текущего)
//
// Запись устройства: { deviceId, idKey, avatarKey, passHash, country, home, appVersion, name, createdAt }.
// В хранилище нет ни номера, ни пропуска: только HMAC-ключи и хеш пропуска.

export function createMemoryStore() {
  const devices = new Map();
  const avatars = new Map(); // "<avatarKey>/<версия>" → { bytes, meta }
  const moved = new Map();
  const rate = new Map();
  const clone = (o) => structuredClone(o);

  return {
    async getDevice(id) { const d = devices.get(id); return d ? clone(d) : null; },
    async putDevice(rec) { devices.set(rec.deviceId, clone(rec)); },
    async deleteDevice(id) { devices.delete(id); rate.delete(id); },
    async listDevicesByIdKey(idKey) { return [...devices.values()].filter((d) => d.idKey === idKey).map(clone); },

    async getAvatar(avatarKey) {
      let best = null;
      for (const [k, v] of avatars) {
        if (k.startsWith(avatarKey + "/") && (!best || v.meta.version > best.meta.version)) best = v;
      }
      return best ? { bytes: new Uint8Array(best.bytes), meta: { ...best.meta } } : null;
    },
    async putAvatar(avatarKey, bytes, meta) {
      const fresh = avatarKey + "/" + meta.version;
      avatars.set(fresh, { bytes: new Uint8Array(bytes), meta: { ...meta } });
      for (const k of [...avatars.keys()]) if (k.startsWith(avatarKey + "/") && k !== fresh) avatars.delete(k);
    },
    async deleteAvatar(avatarKey) {
      for (const k of [...avatars.keys()]) if (k.startsWith(avatarKey + "/")) avatars.delete(k);
    },

    async putMoved(m) { moved.set(m.fromKey, { ...m }); },
    async listMovedTo(toKey) { return [...moved.values()].filter((m) => m.toKey === toKey).map((m) => ({ ...m })); },
    async deleteMoved(fromKey) { moved.delete(fromKey); },

    async hit(deviceId, minute) {
      const r = rate.get(deviceId);
      const n = r && r.minute === minute ? r.n + 1 : 1;
      rate.set(deviceId, { minute, n });
      return n;
    },

    // Только для тестов: что лежит в хранилище.
    _dump: () => ({ devices: [...devices.values()], avatarKeys: [...avatars.keys()], moved: [...moved.values()] }),
  };
}
