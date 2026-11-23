import { createCore } from "../core/index.mjs";

export const SALT = "test-salt-test-salt-test-salt-0123";

export function makeCore(opts = {}) {
  const logs = [];
  const clock = { t: Date.UTC(2026, 10, 23, 12, 0, 0) };
  const core = createCore({
    store: opts.store ?? null,
    passSalt: SALT,
    home: opts.home ?? "ru",
    log: (l) => logs.push(l),
    now: () => clock.t,
  });
  return { core, logs, clock };
}

export function req(method, path, { body, headers = {} } = {}) {
  let bytes = new Uint8Array(0);
  const h = {};
  for (const [k, v] of Object.entries(headers)) h[k.toLowerCase()] = v;
  if (body instanceof Uint8Array) bytes = body;
  else if (body !== undefined) {
    bytes = new TextEncoder().encode(JSON.stringify(body));
    h["content-type"] = "application/json";
  }
  return { method, path, query: {}, headers: h, body: bytes };
}

export function parse(res) {
  return JSON.parse(typeof res.body === "string" ? res.body : new TextDecoder().decode(res.body));
}
