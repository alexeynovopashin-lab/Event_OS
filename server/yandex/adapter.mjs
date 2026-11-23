// Перевод между событием Yandex Cloud Functions и формой запроса/ответа общего модуля.
// Здесь нет ни облака, ни ядра: только разбор — чтобы это можно было проверить тестом.
//
// НЕ ПРОВЕРЕНО в Яндексе: приходит ли путь после адреса функции
// (https://functions.yandexcloud.net/<id>/v1/health) в событии и в каком поле.
// Поэтому путь ищется в нескольких полях, а запасной вариант — параметр ?op=health
// (то же самое, что /v1/health; ?op=devices/me — то же, что /v1/devices/me).
// Остальные поля (httpMethod, headers, body, isBase64Encoded) подтверждены
// боевыми функциями tomsonadmin и tomsonform.

const OP_RE = /^[a-z][a-z/_-]{0,40}$/;

function cleanPath(p) {
  if (typeof p !== "string") return null;
  const noQuery = p.split("?")[0];
  const i = noQuery.indexOf("/v1/");
  if (i >= 0) return noQuery.slice(i);
  if (noQuery.endsWith("/v1")) return "/v1";
  return null;
}

export function resolvePath(event) {
  const op = event.queryStringParameters && event.queryStringParameters.op;
  if (typeof op === "string" && OP_RE.test(op)) return "/v1/" + op;
  const candidates = [event.path, event.url, event.requestContext && event.requestContext.http && event.requestContext.http.path,
    event.requestContext && event.requestContext.path];
  for (const c of candidates) {
    const p = cleanPath(c);
    if (p) return p;
  }
  return "/";
}

export function eventToRequest(event) {
  const headers = {};
  for (const [k, v] of Object.entries(event.headers || {})) headers[k.toLowerCase()] = Array.isArray(v) ? v[0] : v;
  let body;
  if (event.body == null || event.body === "") body = new Uint8Array(0);
  else if (event.isBase64Encoded) body = new Uint8Array(Buffer.from(event.body, "base64"));
  else body = new Uint8Array(Buffer.from(event.body, "utf8"));
  const query = { ...(event.queryStringParameters || {}) };
  delete query.op;
  return { method: String(event.httpMethod || "GET").toUpperCase(), path: resolvePath(event), query, headers, body };
}

export function responseToEvent(res) {
  const out = { statusCode: res.status, headers: res.headers || {} };
  if (res.body == null) {
    out.body = "";
  } else if (typeof res.body === "string") {
    out.body = res.body;
  } else {
    out.body = Buffer.from(res.body).toString("base64");
    out.isBase64Encoded = true;
  }
  return out;
}
