// Маршруты. Каждый раздел добавляется своим шагом (core_server_howto, раздел 3).

import { json, fail, parseJsonBody } from "./http.mjs";
import { parseAppId, homeOfCountry } from "./id.mjs";
import { issue, authenticate, idKey, avatarKey } from "./pass.mjs";

export const RATE_PER_MINUTE = 30; // на один пропуск; счётчик в хранилище

export function buildRoutes(ctx) {
  const { store, passSalt: salt } = ctx;
  const api = []; // разделы, которые уже работают: приложение не зовёт то, чего нет
  const routes = [];
  const add = (method, path, run) => routes.push({ method, path, run });

  // Любой запрос с пропуском: пропуск → 401, лимит → 429.
  const authed = (handler) => async (req, state) => {
    const device = await authenticate(store, salt, req.headers);
    if (!device) return fail(401, "bad_pass");
    state.deviceId = device.deviceId;
    const minute = Math.floor(ctx.now() / 60000);
    if ((await store.hit(device.deviceId, minute)) > RATE_PER_MINUTE) {
      return fail(429, "rate_limited", { "retry-after": String(60 - Math.floor((ctx.now() % 60000) / 1000)) });
    }
    return handler(req, device, state);
  };

  add("GET", "/v1/health", async () =>
    json(200, { ok: true, core: ctx.version, home: ctx.home, time: new Date(ctx.now()).toISOString(), api: [...api] }));

  // ---- Шаг 1: пропуск устройства (CORE-01) ----
  api.push("devices");

  add("POST", "/v1/devices", async (req, state) => {
    const b = parseJsonBody(req);
    if (!b) return fail(400, "bad_request");
    const id = parseAppId(b.appId);
    if (!id) return fail(400, "bad_id");
    const country = typeof b.country === "string" ? b.country.toUpperCase() : "";
    if (!/^[A-Z]{2}$/.test(country)) return fail(400, "bad_request");
    if (homeOfCountry(country) !== ctx.home) return fail(400, "wrong_home");
    const name = typeof b.name === "string" ? b.name.trim().slice(0, 80) : "";
    const appVersion = typeof b.appVersion === "string" ? b.appVersion.slice(0, 32) : "";

    const { deviceId, pass, passHash } = await issue(salt);
    await store.putDevice({
      deviceId,
      idKey: await idKey(salt, id.id),
      avatarKey: await avatarKey(salt, id.id),
      passHash,
      country,
      home: ctx.home,
      appVersion,
      name,
      createdAt: ctx.now(),
    });
    state.deviceId = deviceId;
    // Единственный раз, когда пропуск уходит с сервера.
    return json(201, { deviceId, pass, idState: "unconfirmed", home: ctx.home });
  });

  add("DELETE", "/v1/devices/me", authed(async (req, device) => {
    await store.deleteDevice(device.deviceId);
    const others = await store.listDevicesByIdKey(device.idKey);
    if (others.length === 0) await store.deleteAvatar(device.avatarKey);
    return { status: 204, headers: { "cache-control": "no-store" }, body: null };
  }));

  return routes;
}
