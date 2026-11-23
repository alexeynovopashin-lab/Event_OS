// Точка входа функции Yandex Cloud (Node.js 22): `index.handler`.
// Обычный CommonJS-файл, ядро подгружается через import() — так работает в любой настройке пакета.
// Настройка функции (переменные окружения; значения Алексей вводит сам, в репозитории их нет):
//   PASS_SALT  — длинная случайная строка (openssl rand -hex 32), обязательна
const { eventToRequest, responseToEvent } = require("./adapter.mjs");

let corePromise;

async function build() {
  const { createCore } = await import("./core/index.mjs");
  return createCore({
    store: null, // шаг 1 подключит YDB
    passSalt: process.env.PASS_SALT || "",
    home: "ru",
    // В журнал уходит одна строка JSON без личного: маршрут, deviceId, код, время.
    log: (line) => console.log(JSON.stringify(line)),
  });
}

exports.handler = async function handler(event) {
  try {
    corePromise = corePromise || build();
    const core = await corePromise;
    return responseToEvent(await core.handle(eventToRequest(event)));
  } catch (e) {
    corePromise = undefined; // следующий вызов соберёт заново
    console.log(JSON.stringify({ route: "-", status: 500, error: "init_failed" }));
    return { statusCode: 500, headers: { "content-type": "application/json" }, body: '{"error":"server_error"}' };
  }
};
