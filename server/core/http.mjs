// Запрос и ответ в одной форме для обоих домов (Яндекс, позже Cloudflare).
//   запрос:  { method, path, query, headers (ключи в нижнем регистре), body: Uint8Array }
//   ответ:   { status, headers, body: Uint8Array | string | null }

export const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

export function json(status, obj, extra = {}) {
  return { status, headers: { ...JSON_HEADERS, ...extra }, body: JSON.stringify(obj) };
}

export function fail(status, code, extra = {}) {
  return json(status, { error: code }, extra);
}

export function parseJsonBody(req) {
  if (!req.body || req.body.length === 0) return null;
  try {
    const v = JSON.parse(new TextDecoder().decode(req.body));
    return v && typeof v === "object" && !Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}
