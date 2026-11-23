import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { makeCore, req, parse } from "./helpers.mjs";
import { createMemoryStore } from "../core/memory_store.mjs";
import { processJpeg, MAX_BYTES } from "../core/jpeg.mjs";
import { sha256Hex } from "../core/util.mjs";

const fx = (n) => new Uint8Array(readFileSync(new URL("./fixtures/" + n, import.meta.url)));
const auth = (pass) => ({ authorization: "Bearer " + pass });
const text = (u8) => Buffer.from(u8).toString("latin1");

async function setup() {
  const store = createMemoryStore();
  const t = makeCore({ store });
  const r = await t.core.handle(req("POST", "/v1/devices", { body: { appId: "id79130000001", country: "RU", appVersion: "1" } }));
  return { ...t, store, pass: parse(r).pass };
}
const put = (core, pass, body, ct = "image/jpeg") =>
  core.handle(req("PUT", "/v1/me/avatar", { headers: { ...auth(pass), "content-type": ct }, body }));
const get = (core, pass, headers = {}) => core.handle(req("GET", "/v1/me/avatar", { headers: { ...auth(pass), ...headers } }));

test("512×512: загрузка и GET отдаёт тот же sha256 (по ответу сервера)", async () => {
  const { core, pass } = await setup();
  const original = fx("square512_plain.jpg");
  const up = await put(core, pass, original);
  assert.equal(up.status, 200);
  const res = await get(core, pass);
  assert.equal(res.status, 200);
  assert.equal(res.headers["content-type"], "image/jpeg");
  assert.equal(parse(up).sha256, await sha256Hex(res.body));
  assert.equal(res.headers.etag, '"' + parse(up).sha256 + '"');
  // файл без метаданных не меняется ни на байт
  assert.deepEqual(new Uint8Array(res.body), original);
});

test("304 на If-None-Match; 404 пока аватарки нет", async () => {
  const { core, pass } = await setup();
  assert.equal((await get(core, pass)).status, 404);
  await put(core, pass, fx("square512_plain.jpg"));
  const first = await get(core, pass);
  assert.equal((await get(core, pass, { "if-none-match": first.headers.etag })).status, 304);
  assert.equal((await get(core, pass, { "if-none-match": 'W/' + first.headers.etag })).status, 304);
  assert.equal((await get(core, pass, { "if-none-match": '"other"' })).status, 200);
});

test("отказы: 2 МБ — 413, PNG — 415, 400×300 — 422, 200×200 — 422, обрезанный — 422", async () => {
  const { core, pass } = await setup();
  assert.equal((await put(core, pass, new Uint8Array(2 * 1024 * 1024))).status, 413);
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  assert.equal((await put(core, pass, png, "image/png")).status, 415);
  const rect = await put(core, pass, fx("rect400x300.jpg"));
  assert.equal(rect.status, 422);
  assert.equal(parse(rect).error, "bad_size");
  assert.equal((await put(core, pass, fx("square200.jpg"))).status, 422);
  const whole = fx("square512_plain.jpg");
  assert.equal((await put(core, pass, whole.subarray(0, whole.length - 10))).status, 422);
  assert.equal((await put(core, pass, new Uint8Array(0))).status, 415);
  assert.equal((await get(core, pass)).status, 404, "после отказов ничего не записано");
});

test("метаданные: EXIF с геометкой вырезан, пиксельные данные те же байты", async () => {
  const { core, pass } = await setup();
  const dirty = fx("square512_exif_gps.jpg");
  assert.ok(text(dirty).includes("Exif") && text(dirty).includes("TestCamera"));
  const res = (await put(core, pass, dirty), await get(core, pass));
  const out = new Uint8Array(res.body);
  assert.ok(!text(out).includes("Exif") && !text(out).includes("TestCamera"));
  assert.ok(out.length < dirty.length);
  // всё после начала скана (FF DA) совпадает побайтно — картинка не пережималась
  const tail = (u) => { const t = text(u); return t.slice(t.lastIndexOf("\xff\xda")); };
  assert.equal(tail(out), tail(dirty));
  // и результат снова проходит разбор с теми же размерами
  assert.deepEqual([processJpeg(out).width, processJpeg(out).height], [512, 512]);
});

test("processJpeg: вырезает APP1–APP15 и COM, оставляет APP0", () => {
  const seg = (m, payload) => [0xff, m, (payload.length + 2) >> 8, (payload.length + 2) & 255, ...payload];
  const sof = (w, h) => seg(0xc0, [8, h >> 8, h & 255, w >> 8, w & 255, 1, 1, 0x11, 0]);
  const parts = [0xff, 0xd8, ...seg(0xe0, [0x4a, 0x46, 0x49, 0x46, 0]), ...seg(0xe1, [1, 2, 3]), ...seg(0xe2, [4]), ...seg(0xed, [5]), ...seg(0xef, [6]),
    ...seg(0xfe, [7, 7]), ...seg(0xdb, [0, 1]), ...sof(256, 256), ...seg(0xda, [1, 1, 0]), 0x12, 0xff, 0x00, 0x34, 0xff, 0xd9];
  const r = processJpeg(new Uint8Array(parts));
  assert.ok(r.ok);
  const markers = [];
  for (let i = 2; i < r.clean.length - 1;) { if (r.clean[i] === 0xff && r.clean[i + 1] === 0xda) { markers.push(0xda); break; } markers.push(r.clean[i + 1]); i += 2 + ((r.clean[i + 2] << 8) | r.clean[i + 3]); }
  assert.deepEqual(markers, [0xe0, 0xdb, 0xc0, 0xda]);
  // байты после SOS (включая 0xFF 0x00) не тронуты
  assert.deepEqual([...r.clean.slice(-6)], [0x12, 0xff, 0x00, 0x34, 0xff, 0xd9]);
  assert.equal(processJpeg(new Uint8Array(MAX_BYTES + 1)).status, 413);
});

test("замена: старой версии нет ни под каким ключом («Стирать сразу»)", async () => {
  const { core, pass, store } = await setup();
  await put(core, pass, fx("square512_plain.jpg"));
  const keys1 = store._dump().avatarKeys;
  assert.equal(keys1.length, 1);
  const up2 = await put(core, pass, fx("square512_exif_gps.jpg"));
  const keys2 = store._dump().avatarKeys;
  assert.equal(keys2.length, 1);
  assert.notEqual(keys1[0], keys2[0]);
  assert.equal(parse(up2).size, (await get(core, pass)).body.length);
});

test("DELETE аватарки: 204, повтор 204, потом 404", async () => {
  const { core, pass } = await setup();
  await put(core, pass, fx("square512_plain.jpg"));
  const del = () => core.handle(req("DELETE", "/v1/me/avatar", { headers: auth(pass) }));
  assert.equal((await del()).status, 204);
  assert.equal((await del()).status, 204);
  assert.equal((await get(core, pass)).status, 404);
});

test("аватарка только по пропуску; чужой пропуск не видит чужую", async () => {
  const { core, pass } = await setup();
  await put(core, pass, fx("square512_plain.jpg"));
  assert.equal((await core.handle(req("GET", "/v1/me/avatar"))).status, 401);
  const other = parse(await core.handle(req("POST", "/v1/devices", { body: { appId: "id79130000009", country: "RU" } })));
  assert.equal((await get(core, other.pass)).status, 404);
});

test("lookup по ID: до CORE-05 всегда 404, что бы ни пришло", async () => {
  const { core, pass } = await setup();
  await put(core, pass, fx("square512_plain.jpg"));
  for (const body of [{ id: "id79130000001" }, { id: "id00" }, {}]) {
    const r = await core.handle(req("POST", "/v1/avatars/lookup", { body }));
    assert.equal(r.status, 404);
    assert.equal(parse(r).error, "none");
  }
  assert.equal((await core.handle(req("POST", "/v1/avatars/lookup", { body: new Uint8Array([1, 2]) }))).status, 404);
  assert.equal((await core.handle(req("GET", "/v1/avatars/lookup"))).status, 405);
});

test("health: теперь devices и avatar", async () => {
  const { core } = await setup();
  assert.deepEqual(parse(await core.handle(req("GET", "/v1/health"))).api, ["devices", "avatar"]);
});
