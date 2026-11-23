// Локальный запуск для проверки curl-ом: хранилище в памяти, ничего не уходит в сеть.
//   PASS_SALT=<любая длинная строка> node dev.mjs [порт] [ru|world]
// Данные пропадают при остановке. В Яндекс/Cloudflare этот файл не попадает.
import http from "node:http";
import { createCore } from "./core/index.mjs";
import { createMemoryStore } from "./core/memory_store.mjs";

const port = Number(process.argv[2] || 8800);
const home = process.argv[3] || "ru";
const salt = process.env.PASS_SALT || "dev-only-salt-" + Math.random().toString(36).slice(2).repeat(3);
const core = createCore({ store: createMemoryStore(), passSalt: salt, home, log: (l) => console.log(JSON.stringify(l)) });

http.createServer(async (rq, rs) => {
  const chunks = [];
  for await (const c of rq) chunks.push(c);
  const url = new URL(rq.url, "http://x");
  const op = url.searchParams.get("op");
  const res = await core.handle({
    method: rq.method, path: op ? "/v1/" + op : url.pathname, query: Object.fromEntries(url.searchParams),
    headers: Object.fromEntries(Object.entries(rq.headers).map(([k, v]) => [k, String(v)])), body: new Uint8Array(Buffer.concat(chunks)),
  });
  rs.writeHead(res.status, res.headers);
  rs.end(res.body == null ? undefined : typeof res.body === "string" ? res.body : Buffer.from(res.body));
}).listen(port, () => console.log(`core dev: http://127.0.0.1:${port} home=${home}`));
