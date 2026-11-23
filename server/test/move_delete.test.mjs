import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { makeCore, req, parse } from "./helpers.mjs";
import { createMemoryStore } from "../core/memory_store.mjs";
import { RATE_PER_MINUTE } from "../core/routes.mjs";

const jpeg = new Uint8Array(readFileSync(new URL("./fixtures/square512_plain.jpg", import.meta.url)));
const auth = (pass) => ({ authorization: "Bearer " + pass });
const A = "id79130000001", B = "id79130000002", C = "id79130000003";

async function start() {
  const store = createMemoryStore();
  const t = makeCore({ store });
  const register = async (appId) => parse(await t.core.handle(req("POST", "/v1/devices", { body: { appId, country: "RU" } })));
  const put = (pass) => t.core.handle(req("PUT", "/v1/me/avatar", { headers: { ...auth(pass), "content-type": "image/jpeg" }, body: jpeg }));
  const get = (pass) => t.core.handle(req("GET", "/v1/me/avatar", { headers: auth(pass) }));
  const patch = (pass, body) => t.core.handle(req("PATCH", "/v1/devices/me", { headers: auth(pass), body }));
  const delMe = (pass) => t.core.handle(req("DELETE", "/v1/me", { headers: pass ? auth(pass) : {} }));
  return { ...t, store, register, put, get, patch, delMe };
}

test("смена номера переносит аватарку; у старого ID пометка «переехал»", async () => {
  const s = await start();
  const d = await s.register(A);
  await s.put(d.pass);
  const before = await s.get(d.pass);
  const res = await s.patch(d.pass, { appId: B, previous: A, at: "2026-11-23T12:00:00Z" });
  assert.equal(res.status, 200);
  const after = await s.get(d.pass);
  assert.equal(after.status, 200);
  assert.equal(after.headers.etag, before.headers.etag);
  const dump = s.store._dump();
  assert.equal(dump.avatarKeys.length, 1, "аватарка одна, на новом ключе");
  assert.equal(dump.moved.length, 1);
  assert.ok(!JSON.stringify(dump).includes("7913"), "номеров в хранилище нет");
  // тот же номер повторно — ничего не меняется
  assert.equal((await s.patch(d.pass, { appId: B, previous: B })).status, 200);
  assert.equal(s.store._dump().moved.length, 1);
});

test("смена номера: другое устройство того же старого ID оставляет старую аватарку у себя", async () => {
  const s = await start();
  const d1 = await s.register(A);
  const d2 = await s.register(A);
  await s.put(d1.pass);
  assert.equal((await s.patch(d1.pass, { appId: B, previous: A })).status, 200);
  assert.equal((await s.get(d2.pass)).status, 200, "второй телефон со старым номером по-прежнему видит аватарку");
  assert.equal(s.store._dump().avatarKeys.length, 2);
});

test("смена номера: отказы — 400 bad_id, 409 previous_mismatch, 409 id_taken", async () => {
  const s = await start();
  const d = await s.register(A);
  const other = await s.register(B);
  await s.put(d.pass);
  await s.put(other.pass);
  assert.equal(parse(await s.patch(d.pass, { appId: "id73822000001", previous: A })).error, "bad_id");
  assert.equal(parse(await s.patch(d.pass, { appId: C, previous: B })).error, "previous_mismatch");
  assert.equal(parse(await s.patch(d.pass, { appId: B, previous: A })).error, "id_taken");
  assert.equal((await s.get(other.pass)).status, 200, "чужая аватарка цела");
  assert.equal((await s.get(d.pass)).status, 200, "своя осталась на месте");
});

test("DELETE /v1/me: после него 401 и 404; повтор — 204", async () => {
  const s = await start();
  const d = await s.register(A);
  const second = await s.register(A);
  await s.put(d.pass);
  assert.equal((await s.delMe(d.pass)).status, 204);
  assert.equal((await s.get(d.pass)).status, 401);
  assert.equal((await s.get(second.pass)).status, 401, "второе устройство того же номера тоже стёрто");
  assert.equal((await s.delMe(d.pass)).status, 204);
  const lookup = await s.core.handle(req("POST", "/v1/avatars/lookup", { body: { id: A } }));
  assert.equal(lookup.status, 404);
  const dump = s.store._dump();
  assert.deepEqual([dump.devices.length, dump.avatarKeys.length, dump.moved.length], [0, 0, 0]);
});

test("DELETE /v1/me: цепочка прежних номеров стирается; чужое не трогается", async () => {
  const s = await start();
  const d = await s.register(A);
  const stranger = await s.register("id79130000008");
  await s.put(d.pass);
  await s.put(stranger.pass);
  await s.patch(d.pass, { appId: B, previous: A });
  await s.patch(d.pass, { appId: C, previous: B });
  assert.equal(s.store._dump().moved.length, 2);
  assert.equal((await s.delMe(d.pass)).status, 204);
  const dump = s.store._dump();
  assert.equal(dump.moved.length, 0);
  assert.equal(dump.devices.length, 1);
  assert.equal(dump.avatarKeys.length, 1);
  assert.equal((await s.get(stranger.pass)).status, 200);
});

test("DELETE /v1/me: испорченный пропуск живого устройства и пустой запрос — 401", async () => {
  const s = await start();
  const d = await s.register(A);
  assert.equal((await s.delMe(d.pass.slice(0, -2) + "xx")).status, 401);
  assert.equal((await s.delMe(null)).status, 401);
  assert.equal((await s.get(d.pass)).status, 404, "устройство живо");
});

test("лимит: 31-й запрос с одним пропуском за минуту — 429, через минуту снова можно", async () => {
  const s = await start();
  const d = await s.register(A);
  let last;
  for (let i = 0; i < RATE_PER_MINUTE; i++) last = await s.get(d.pass);
  assert.equal(last.status, 404);
  const over = await s.get(d.pass);
  assert.equal(over.status, 429);
  assert.ok(over.headers["retry-after"]);
  // другой пропуск этого лимита не делит
  const e = await s.register(B);
  assert.equal((await s.get(e.pass)).status, 404);
  s.clock.t += 60000;
  assert.equal((await s.get(d.pass)).status, 404);
});
