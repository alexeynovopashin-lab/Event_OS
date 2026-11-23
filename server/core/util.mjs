// Мелкие помощники общего модуля. Только Web Crypto (globalThis.crypto): он есть и в Node 22, и в Cloudflare Worker.

const enc = new TextEncoder();

export function toHex(bytes) {
  let s = "";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return s;
}

export function toB64Url(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function randomBytes(n) {
  return globalThis.crypto.getRandomValues(new Uint8Array(n));
}

export async function sha256Hex(bytes) {
  const data = typeof bytes === "string" ? enc.encode(bytes) : bytes;
  return toHex(new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", data)));
}

// HMAC-SHA256 с солью: соль приходит только из окружения функции, в репозитории её нет.
export async function hmacHex(salt, message) {
  const key = await globalThis.crypto.subtle.importKey(
    "raw", enc.encode(salt), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(new Uint8Array(sig));
}

// Сравнение за постоянное время (строки одинаковой длины — хеши).
export function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
