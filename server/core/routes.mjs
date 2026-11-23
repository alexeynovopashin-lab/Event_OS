// Маршруты. Каждый раздел добавляется своим шагом (см. docs: core_server_howto, раздел 3).

import { json } from "./http.mjs";

export function buildRoutes(ctx) {
  const api = []; // разделы, которые уже работают: приложение не зовёт то, чего нет
  const routes = [];

  routes.push({
    method: "GET",
    path: "/v1/health",
    run: async () =>
      json(200, { ok: true, core: ctx.version, home: ctx.home, time: new Date(ctx.now()).toISOString(), api: [...api] }),
  });

  return routes;
}
