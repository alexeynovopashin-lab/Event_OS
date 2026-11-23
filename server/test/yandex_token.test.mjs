import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createTokenSource, METADATA_URL } from "../yandex/token.mjs";

test("токен из контекста вызова: берётся сразу, без сети", async () => {
  let calls = 0;
  const t = createTokenSource({ fetchImpl: async () => { calls++; throw new Error("no network"); }, now: () => 0 });
  assert.equal(t.getToken(), undefined);
  t.offer({ token: { access_token: "T1", expires_in: 3600, token_type: "Bearer" } });
  assert.equal(t.getToken(), "T1");
  await t.initialize();
  assert.equal(calls, 0);
});

test("без контекста — сервис метаданных с заголовком Metadata-Flavor; просроченный токен обновляется", async () => {
  let clock = 0;
  const seen = [];
  const t = createTokenSource({
    now: () => clock,
    fetchImpl: async (url, opts) => { seen.push([url, opts.headers["Metadata-Flavor"]]); return { ok: true, json: async () => ({ access_token: "M" + seen.length, expires_in: 600 }) }; },
  });
  t.offer(undefined);
  t.offer({});
  await t.initialize();
  assert.equal(t.getToken(), "M1");
  assert.deepEqual(seen[0], [METADATA_URL, "Google"]);
  clock += 560_000; // за минуту до конца срока — уже не свежий
  assert.equal(t.getToken(), undefined);
  await t.initialize();
  assert.equal(t.getToken(), "M2");
});

test("сервис метаданных отказал — ошибка, а не пустой токен", async () => {
  const t = createTokenSource({ fetchImpl: async () => ({ ok: false, status: 404 }) });
  await assert.rejects(() => t.initialize(), /metadata_status_404/);
});

const require = createRequire(import.meta.url);
let ydbAvailable = true;
try { require("../yandex/node_modules/ydb-sdk"); } catch { ydbAvailable = false; }

test("ydb-sdk берёт наш токен и НЕ подгружает @yandex-cloud/nodejs-sdk", { skip: !ydbAvailable && "ydb-sdk не установлен" }, async () => {
  const { MetadataAuthService } = require("../yandex/node_modules/ydb-sdk");
  const t = createTokenSource({ fetchImpl: async () => ({ ok: true, json: async () => ({ access_token: "SECRET-T", expires_in: 600 }) }) });
  const auth = new MetadataAuthService(t);
  const md = await auth.getAuthMetadata();
  assert.equal(md.get("x-ydb-auth-ticket")[0], "SECRET-T");
  assert.throws(() => require.resolve("@yandex-cloud/nodejs-sdk", { paths: [new URL("../yandex/", import.meta.url).pathname] }));
});
