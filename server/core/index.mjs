// Общий модуль сервера ядра. Не знает про облако: хранилище («розетка») и соль приходят снаружи.
//
//   const core = createCore({ store, passSalt, home: "ru", log })
//   const res  = await core.handle({ method, path, query, headers, body })
//
// Договор: `light_plan:Light_Plan/docs/core_requirements_2026-11-19.md` (CORE-01, 02, 03, вопрос 4.7),
// клиент — `light_plan:Packages/LightPlanData/Sources/LightPlanData/Core/CoreLink.swift`.

import { fail } from "./http.mjs";
import { buildRoutes } from "./routes.mjs";

export const CORE_VERSION = "0.1.0";
export const HOMES = ["ru", "world"];

export function createCore({ store, passSalt, home, log = () => {}, now = () => Date.now() }) {
  if (!HOMES.includes(home)) throw new Error("home must be 'ru' or 'world'");
  if (typeof passSalt !== "string" || passSalt.length < 16) throw new Error("PASS_SALT is required (at least 16 chars)");
  const ctx = { store, passSalt, home, now, version: CORE_VERSION };
  const routes = buildRoutes(ctx);

  async function handle(req) {
    const started = now();
    let res;
    let route = "-";
    let deviceId;
    try {
      const path = req.path.replace(/\/+$/, "") || "/";
      const hits = routes.filter((r) => r.path === path);
      if (hits.length === 0) {
        res = fail(404, "not_found");
      } else {
        const hit = hits.find((r) => r.method === req.method);
        if (!hit) {
          res = fail(405, "method_not_allowed", { allow: hits.map((r) => r.method).join(", ") });
        } else {
          route = hit.method + " " + hit.path;
          const state = {};
          res = await hit.run(req, state);
          deviceId = state.deviceId;
        }
      }
    } catch {
      // Причину не пишем: в ней могут оказаться телефон или пропуск.
      res = fail(500, "server_error");
    }
    // В журнале нет телефонов, ID и пропусков: только маршрут, deviceId, код и время.
    log({ route, deviceId, status: res.status, ms: now() - started });
    return res;
  }

  return { handle, ctx };
}
