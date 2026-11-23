// Точка входа функции Yandex Cloud (Node.js 22): `index.handler`.
// Обычный CommonJS-файл, всё остальное подгружается через import() — так работает в любой настройке пакета
// и не зависит от того, умеет ли среда выполнения require() для ES-модулей.
// Настройка функции (переменные окружения; значения Алексей вводит сам, в репозитории их нет):
//   PASS_SALT     — длинная случайная строка (openssl rand -hex 32), обязательна
//   YDB_DATABASE  — путь базы YDB из консоли (вида /ru-central1/b1g…/etn…), не секрет
//   YDB_ENDPOINT  — не нужна: по умолчанию grpcs://ydb.serverless.yandexcloud.net:2135

// Фоновые ошибки драйвера базы (например, повторное подключение после сбоя) не должны ронять
// экземпляр функции: пишем код ошибки в журнал, следующий вызов соберёт подключение заново.
process.on("unhandledRejection", (e) => {
  readyPromise = undefined;
  console.log(JSON.stringify({ route: "-", error: "background", kind: e && e.name, code: e && e.code }));
});

let readyPromise;
let tokensPromise;

// Переменные, без которых функция не работает. Имена безопасно показывать в ответе, значения — нет.
const REQUIRED = ["PASS_SALT", "YDB_DATABASE"];

async function build(tokens) {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) throw Object.assign(new Error("not_configured"), { missing });
  const { eventToRequest, responseToEvent } = await import("./adapter.mjs");
  const { createCore } = await import("./core/index.mjs");
  const { connectYdb, createYdbStore } = await import("./store.mjs");
  const driver = await connectYdb({ endpoint: process.env.YDB_ENDPOINT || undefined, database: process.env.YDB_DATABASE, tokens });
  const core = createCore({
    store: createYdbStore(driver),
    passSalt: process.env.PASS_SALT || "",
    home: "ru",
    // В журнал уходит одна строка JSON без личного: маршрут, deviceId, код, время.
    log: (line) => console.log(JSON.stringify(line)),
  });
  return { core, eventToRequest, responseToEvent };
}

exports.handler = async function handler(event, context) {
  try {
    // Токен сервисного аккаунта из контекста вызова — до подключения к базе (оно его и просит).
    tokensPromise = tokensPromise || import("./token.mjs").then((m) => m.createTokenSource());
    const tokens = await tokensPromise;
    tokens.offer(context);
    readyPromise = readyPromise || build(tokens);
    const { core, eventToRequest, responseToEvent } = await readyPromise;
    return responseToEvent(await core.handle(eventToRequest(event)));
  } catch (e) {
    readyPromise = undefined; // следующий вызов соберёт заново
    if (e && e.missing) {
      // 503: приложение понимает это как «ядра сейчас нет» и просто повторит позже.
      return { statusCode: 503, headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: false, error: "not_configured", missing: e.missing }) };
    }
    // Текст ошибки не пишем целиком: в нём может быть путь базы. Только название.
    // Код ошибки (например MODULE_NOT_FOUND) и первые слова сообщения без путей и адресов.
    const msg = String((e && e.message) || "").replace(/\/[^\s'"]+/g, "<путь>").slice(0, 120);
    console.log(JSON.stringify({ route: "-", status: 500, error: "init_failed", kind: e && e.name, code: e && e.code, msg }));
    return { statusCode: 500, headers: { "content-type": "application/json" }, body: '{"error":"server_error"}' };
  }
};
