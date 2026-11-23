// Пропуск устройства (CORE-01).
//
// Пропуск = "<deviceId>.<32 случайных байта в base64url>". Сервер хранит только HMAC-SHA256(PASS_SALT, пропуск);
// сам пропуск уходит с сервера один раз — в ответе 201 на регистрацию.
// deviceId внутри пропуска — не секрет (он есть в журнале): он нужен, чтобы найти запись по ключу,
// а не искать по хешу. Это отличие от инструкции (там «найти устройство по хешу»), результат тот же.

import { randomBytes, toHex, toB64Url, hmacHex, constantTimeEqual } from "./util.mjs";

const PASS_RE = /^(dv_[0-9a-f]{32})\.([A-Za-z0-9_-]{43})$/;

export async function issue(salt) {
  const deviceId = "dv_" + toHex(randomBytes(16));
  const pass = deviceId + "." + toB64Url(randomBytes(32));
  return { deviceId, pass, passHash: await hmacHex(salt, "pass:" + pass) };
}

export function bearer(headers) {
  const h = headers.authorization || "";
  const m = /^Bearer\s+(\S+)$/i.exec(h);
  return m ? m[1] : null;
}

// Возвращает запись устройства или null.
export async function authenticate(store, salt, headers) {
  const pass = bearer(headers);
  if (!pass) return null;
  const m = PASS_RE.exec(pass);
  if (!m) return null;
  const device = await store.getDevice(m[1]);
  // Хеш считаем и когда устройства нет — время ответа не выдаёт, существует ли оно.
  const hash = await hmacHex(salt, "pass:" + pass);
  if (!device) return null;
  return constantTimeEqual(hash, device.passHash) ? device : null;
}

// Ключи, по которым хранилище знает человека. Сам номер в хранилище не попадает.
export const idKey = (salt, appId) => hmacHex(salt, "id:" + appId);
export const avatarKey = (salt, appId) => hmacHex(salt, "avatar:" + appId);
