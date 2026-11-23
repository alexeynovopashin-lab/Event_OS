// Токен сервисного аккаунта функции для входа в YDB — без пакета @yandex-cloud/nodejs-sdk.
//
// Почему свой: MetadataAuthService из ydb-sdk без аргумента подгружает @yandex-cloud/nodejs-sdk,
// а ydb-sdk помечает его необязательным — в архиве его нет, и функция падала с MODULE_NOT_FOUND
// (найдено на первом развёртывании 23.11). Пакет большой, архив не пролез бы в прямую загрузку.
//
// Откуда берётся токен, по порядку:
//   1) из контекста вызова функции: context.token.access_token (Яндекс кладёт его туда,
//      когда у функции есть сервисный аккаунт);
//   2) из сервиса метаданных: http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token
//      с заголовком Metadata-Flavor: Google.
// НЕ ПРОВЕРЕНО на живом Яндексе: оба пути взяты из документации Cloud Functions.
// Сам токен никогда не пишется в журнал.

export const METADATA_URL = "http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token";
const MARGIN_MS = 60_000; // обновляем за минуту до конца срока

export function createTokenSource({ fetchImpl = globalThis.fetch, now = () => Date.now() } = {}) {
  let token = null;
  let expiresAt = 0;

  const fresh = () => token && now() < expiresAt - MARGIN_MS;

  return {
    // Токен из контекста вызова: свежий на каждый вызов.
    offer(context) {
      const t = context && context.token;
      if (t && typeof t.access_token === "string" && t.access_token) {
        token = t.access_token;
        const sec = Number(t.expires_in);
        expiresAt = now() + (Number.isFinite(sec) && sec > 0 ? sec * 1000 : 10 * 60_000);
      }
    },
    // ydb-sdk (MetadataAuthService с внешним tokenService) зовёт getToken() синхронно,
    // а если вернулось пусто — initialize() и снова getToken().
    getToken() {
      return fresh() ? token : undefined;
    },
    async initialize() {
      if (fresh()) return;
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 3000);
      try {
        const res = await fetchImpl(METADATA_URL, { headers: { "Metadata-Flavor": "Google" }, signal: ctl.signal });
        if (!res.ok) throw new Error("metadata_status_" + res.status);
        const body = await res.json();
        if (!body || typeof body.access_token !== "string") throw new Error("metadata_no_token");
        token = body.access_token;
        const sec = Number(body.expires_in);
        expiresAt = now() + (Number.isFinite(sec) && sec > 0 ? sec * 1000 : 10 * 60_000);
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
