import { test } from "node:test";
import assert from "node:assert/strict";
import { makeCore, req, parse } from "./helpers.mjs";
import { createMemoryStore } from "../core/memory_store.mjs";
import { parseAppId } from "../core/id.mjs";

// Все номера выдуманные.
const GOOD = "id79130000001";
const reg = (core, over = {}) =>
  core.handle(req("POST", "/v1/devices", { body: { app: "lightplan", appId: GOOD, country: "RU", appVersion: "31.13", ...over } }));
const auth = (pass) => ({ authorization: "Bearer " + pass });

test("ID: форма и городские номера +7", () => {
  assert.ok(parseAppId("id79130000001"));
  assert.ok(parseAppId("id77010000001")); // Казахстан
  assert.ok(parseAppId("id14155550123"));
  assert.equal(parseAppId("id73822000001"), null); // +7 3822 — городской (Томск)
  assert.equal(parseAppId("id74951234567"), null);
  assert.equal(parseAppId("79130000001"), null);
  assert.equal(parseAppId("id0123456789"), null);
  assert.equal(parseAppId("id123"), null);
  assert.equal(parseAppId("id7913000000112345"), null);
  assert.equal(parseAppId(7913), null);
});

test("регистрация: 201, пропуск, дом; на сервере только хеш", async () => {
  const store = createMemoryStore();
  const { core } = makeCore({ store });
  const res = await reg(core, { name: "  Аня " });
  assert.equal(res.status, 201);
  const b = parse(res);
  assert.match(b.deviceId, /^dv_[0-9a-f]{32}$/);
  assert.ok(b.pass.startsWith(b.deviceId + "."));
  assert.equal(b.idState, "unconfirmed");
  assert.equal(b.home, "ru");
  const dump = JSON.stringify(store._dump());
  assert.ok(!dump.includes(b.pass), "пропуск не хранится");
  assert.ok(!dump.includes("79130000001"), "номер не хранится");
  assert.equal(store._dump().devices[0].name, "Аня");
});

test("регистрация: городской номер и мусор — 400", async () => {
  const { core } = makeCore({ store: createMemoryStore() });
  const bad = await reg(core, { appId: "id73822000001" });
  assert.equal(bad.status, 400);
  assert.equal(parse(bad).error, "bad_id");
  assert.equal(parse(await reg(core, { appId: undefined })).error, "bad_id");
  assert.equal(parse(await reg(core, { country: "Россия" })).error, "bad_request");
  assert.equal((await core.handle(req("POST", "/v1/devices", { body: new TextEncoder().encode("не json") }))).status, 400);
});

test("дом ru не принимает чужую страну (она пойдёт в world)", async () => {
  const { core } = makeCore({ store: createMemoryStore() });
  const res = await reg(core, { appId: "id14155550123", country: "US" });
  assert.equal(res.status, 400);
  assert.equal(parse(res).error, "wrong_home");
  const world = makeCore({ store: createMemoryStore(), home: "world" }).core;
  assert.equal((await reg(world, { appId: "id14155550123", country: "US" })).status, 201);
});

test("пропуск: испорченный и чужой — 401; без заголовка — 401; после DELETE — 401", async () => {
  const { core } = makeCore({ store: createMemoryStore() });
  const a = parse(await reg(core));
  const b = parse(await reg(core, { appId: "id79130000002" }));
  const del = (pass) => core.handle(req("DELETE", "/v1/devices/me", { headers: pass ? auth(pass) : {} }));
  assert.equal((await del(null)).status, 401);
  assert.equal((await del(a.pass.slice(0, -1) + (a.pass.endsWith("A") ? "B" : "A"))).status, 401);
  assert.equal((await del(a.deviceId + "." + b.pass.split(".")[1])).status, 401); // секрет от другого устройства
  assert.equal((await del("мусор")).status, 401);
  assert.equal((await del(a.pass)).status, 204);
  assert.equal((await del(a.pass)).status, 401);
  assert.equal((await del(b.pass)).status, 204);
});

test("health перечисляет только работающие разделы", async () => {
  const { core } = makeCore({ store: createMemoryStore() });
  assert.deepEqual(parse(await core.handle(req("GET", "/v1/health"))).api, ["devices"]);
});

test("DELETE устройства: у ID остались другие устройства — всё общее остаётся", async () => {
  const store = createMemoryStore();
  const { core } = makeCore({ store });
  const a = parse(await reg(core));
  const b = parse(await reg(core)); // тот же номер, второй телефон
  await store.putAvatar(store._dump().devices[0].avatarKey, new Uint8Array([1]), { version: 1 });
  assert.equal((await core.handle(req("DELETE", "/v1/devices/me", { headers: auth(a.pass) }))).status, 204);
  assert.equal(store._dump().avatarKeys.length, 1);
  assert.equal((await core.handle(req("DELETE", "/v1/devices/me", { headers: auth(b.pass) }))).status, 204);
  assert.equal(store._dump().avatarKeys.length, 0, "последнее устройство — аватарка стёрта");
});

test("журнал после регистрации: deviceId есть, номера и пропуска нет", async () => {
  const { core, logs } = makeCore({ store: createMemoryStore() });
  const a = parse(await reg(core));
  const line = JSON.stringify(logs.at(-1));
  assert.ok(line.includes(a.deviceId));
  assert.ok(!line.includes("7913") && !line.includes(a.pass.split(".")[1]));
});
