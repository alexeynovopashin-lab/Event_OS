import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCore, req, parse } from "./helpers.mjs";
import { createCore } from "../core/index.mjs";
import { eventToRequest, responseToEvent, resolvePath } from "../yandex/adapter.mjs";

test("health: ok, свой дом, время", async () => {
  const { core } = makeCore();
  const res = await core.handle(req("GET", "/v1/health"));
  assert.equal(res.status, 200);
  const b = parse(res);
  assert.equal(b.ok, true);
  assert.equal(b.core, "0.1.0");
  assert.equal(b.home, "ru");
  assert.equal(b.time, "2026-11-23T12:00:00.000Z");
  assert.ok(Array.isArray(b.api));
});

test("health не требует пропуска; чужой метод — 405; неизвестный путь — 404", async () => {
  const { core } = makeCore();
  assert.equal((await core.handle(req("POST", "/v1/health"))).status, 405);
  assert.equal((await core.handle(req("GET", "/v1/nope"))).status, 404);
  assert.equal((await core.handle(req("GET", "/v1/health/"))).status, 200);
});

test("без соли ядро не запускается", () => {
  assert.throws(() => createCore({ store: null, passSalt: "", home: "ru" }));
  assert.throws(() => createCore({ store: null, passSalt: "x".repeat(32), home: "mars" }));
});

test("журнал: маршрут, код, время — и ничего личного", async () => {
  const { core, logs } = makeCore();
  await core.handle(req("GET", "/v1/health"));
  assert.deepEqual(Object.keys(logs[0]).sort(), ["deviceId", "ms", "route", "status"]);
  assert.equal(logs[0].route, "GET /v1/health");
});

test("yandex adapter: путь из event.path, из event.url и запасной ?op=", () => {
  assert.equal(resolvePath({ path: "/v1/health" }), "/v1/health");
  assert.equal(resolvePath({ url: "/d4eabc/v1/devices/me?x=1" }), "/v1/devices/me");
  assert.equal(resolvePath({ queryStringParameters: { op: "health" } }), "/v1/health");
  assert.equal(resolvePath({ queryStringParameters: { op: "devices/me" }, path: "/" }), "/v1/devices/me");
  assert.equal(resolvePath({ queryStringParameters: { op: "../etc" } }), "/");
  assert.equal(resolvePath({}), "/");
});

test("yandex adapter: тело base64 и текстовое, заголовки в нижнем регистре, бинарный ответ", () => {
  const r1 = eventToRequest({ httpMethod: "put", path: "/v1/me/avatar", headers: { Authorization: "Bearer x", "Content-Type": "image/jpeg" },
    body: Buffer.from([0xff, 0xd8, 1]).toString("base64"), isBase64Encoded: true });
  assert.equal(r1.method, "PUT");
  assert.equal(r1.headers.authorization, "Bearer x");
  assert.deepEqual([...r1.body], [0xff, 0xd8, 1]);
  const r2 = eventToRequest({ httpMethod: "POST", path: "/v1/devices", body: '{"a":1}' });
  assert.equal(new TextDecoder().decode(r2.body), '{"a":1}');
  const out = responseToEvent({ status: 200, headers: { a: "b" }, body: new Uint8Array([1, 2]) });
  assert.equal(out.isBase64Encoded, true);
  assert.equal(out.body, "AQI=");
  assert.equal(responseToEvent({ status: 204, headers: {}, body: null }).body, "");
});
