// tools/import_catalog.js — импорт чернового справочника студий в реестр мест.
//
// Читает файлы каталога BroniOS (docs/cross-project/studio_catalog_*), заводит
// каждое место в PlaceRegistry (номер выдаёт реестр) и пишет два файла:
//   registry.json — полный реестр (с номерами, внешними ключами, связями);
//   served_places.json — отдаваемый файл для приложений (16_Place_Registry.md).
// Оба файла кладутся ВНЕ репозитория (по слову Алексея 05.11: «Яндекс, не в git»).
//
// Запуск из папки app/:
//   node tools/import_catalog.js --from <папка с json каталога> --out <папка вывода>
//        [--registry <registry.json прошлого запуска>] [--phones <файл1,файл2,…>]
//   --phones: файлы с телефонами вне репозитория; номера пишутся только в registry.json.
//
// Повторный запуск с --registry ничего не выдаёт заново: место находится по
// внешнему ключу (studiogo:/2gis:/gorko:/bronios:) и только обновляется.
// Телефонов импорт не читает и не пишет: в справочнике их нет.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

import { PlaceRegistry, CATALOG, VERIFICATION } from "../core/registry.js";

const SOURCE_KEY = /^(studiogo|2gis|gorko):(\S+)/;
const DISPUTED_NOTE = /возможно, то же место|Алексей уточнит/;

// Файл города ({city, studios, closed}) или файл Томска ({studios, closedStudios}).
function readCatalogFiles(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  const lists = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    if (!Array.isArray(data.studios)) continue;
    const tomsk = "closedStudios" in data;
    lists.push({
      file,
      city: tomsk ? "Томск" : data.city,
      timezone: data.timezone ?? null,
      collected: data.collected ?? null,
      studios: data.studios,
      closed: tomsk ? data.closedStudios?.items ?? [] : data.closed ?? [],
      first: tomsk, // Томск идёт первым: номера этого города — самые маленькие
    });
  }
  // Порядок выдачи номеров не зависит от порядка файлов в папке.
  return lists.sort((a, b) => Number(b.first) - Number(a.first) || a.file.localeCompare(b.file));
}

function sha(text) {
  return crypto.createHash("sha1").update(text).digest("hex").slice(0, 8);
}

// Внешний ключ записи: id BroniOS, иначе первый id источника, иначе хеш названия и адреса.
function baseKey(s) {
  if (s.id) return `bronios:${s.id}`;
  for (const src of s.src ?? []) {
    const m = SOURCE_KEY.exec(src);
    if (m) return `${m[1]}:${m[2]}`;
  }
  return null;
}

function keyOf(s, city, repeated) {
  const base = baseKey(s) ?? `scrape:${sha(`${city}|${s.name}`)}`;
  // Один id источника на несколько адресов (три филиала в одной карточке): добавляем адрес.
  return repeated.has(base) ? `${base}#${sha(s.address ?? "")}` : base;
}

export function importCatalog(registry, lists, { date }) {
  // Какие базовые ключи встречаются в входе больше одного раза.
  const seen = new Map();
  for (const l of lists) {
    for (const s of [...l.studios, ...l.closed]) {
      const b = baseKey(s) ?? `scrape:${sha(`${l.city}|${s.name}`)}`;
      seen.set(b, (seen.get(b) ?? 0) + 1);
    }
  }
  const repeated = new Set([...seen].filter(([, n]) => n > 1).map(([k]) => k));

  const byAlias = new Map();
  for (const p of registry.places.values()) for (const a of p.aliases) byAlias.set(a, p.placeId);

  const stats = { issued: 0, existing: 0, renamed: 0, readdressed: 0, closed: 0, halls: 0, disputed: 0, human: 0, connected: 0 };

  for (const l of lists) {
    const since = l.collected ?? date;
    const add = (s, closed) => {
      const key = keyOf(s, l.city, repeated);
      const known = byAlias.get(key);
      if (known) {
        stats.existing++;
        const place = registry.places.get(known);
        if (s.name && place.names[place.names.length - 1].value !== s.name) {
          registry.rename(known, s.name, since);
          stats.renamed++;
        }
        if (s.address && place.addresses[place.addresses.length - 1]?.value !== s.address) {
          registry.correctAddress(known, s.address, since);
          stats.readdressed++;
        }
        return;
      }
      const disputed = DISPUTED_NOTE.test(s.note ?? "");
      const human = s.connectedToBroniOS === true; // хозяин на связи (сейчас только Томсон, студия Алексея): запись подтверждена человеком
      const aliases = [
        key,
        ...(s.src ?? []).map((x) => SOURCE_KEY.exec(x)).filter(Boolean).map((m) => `${m[1]}:${m[2]}`),
        ...(s.id ? [`bronios:${s.id}`] : []),
        ...(s.formerNames ?? []),
      ].filter((a, i, all) => a && all.indexOf(a) === i);
      const place = registry.issue(
        {
          name: s.name,
          address: s.address ?? "",
          city: l.city,
          timezone: l.timezone,
          aliases,
          catalog: s.connectedToBroniOS ? CATALOG.CONNECTED : CATALOG.NOT_CONNECTED,
          verification: human ? VERIFICATION.HUMAN : disputed ? VERIFICATION.DISPUTED : VERIFICATION.SCRAPED,
          note: s.note ?? null,
          hallsCount: s.hallsCount ?? null,
        },
        since
      );
      for (const a of aliases) byAlias.set(a, place.placeId);
      for (const h of s.halls ?? []) {
        if (!h.name) continue;
        registry.addHall(place.placeId, { name: h.name, windows: h.hasWindows ?? null, azimuth: h.windowsAzimuth ?? null }, since);
        stats.halls++;
      }
      if (closed) {
        registry.close(place.placeId, since); // дата — день записи в справочник, не день закрытия
        stats.closed++;
      }
      stats.issued++;
      if (disputed) stats.disputed++;
      if (human) stats.human++;
      if (s.connectedToBroniOS) stats.connected++;
    };
    for (const s of l.studios) add(s, false);
    for (const s of l.closed) add(s, true);
  }
  return stats;
}

// Телефоны: файлы вида {"phones": {"studiogo:<ID>": "+7…"}, …} лежат ВНЕ репозитория.
// Связь с местом — по внешнему ключу в aliases. Номера никуда не печатаются:
// возвращаются только счётчики. Номер попадает только в contactPhone закрытого реестра
// (в отдаваемый файл он не идёт) и ключом места не служит.
// Три вида файлов телефонов: {phones:{ключ: "номер"}} (ключ без префикса = id BroniOS),
// {cities:{город:{phones:{ключ:{phone,…}}}}} и {phones:{ключ:{phone,…}}}. Возвращает пары [внешний ключ, номер].
export function flattenPhones(map) {
  const out = [];
  const take = (phones) => {
    for (const [key, value] of Object.entries(phones ?? {})) {
      const ext = key.includes(":") ? key : `bronios:${key}`;
      if (!/^(studiogo|2gis|gorko|bronios):/.test(ext)) continue;
      out.push([ext, value && typeof value === "object" ? value.phone : value]);
    }
  };
  if (map?.cities && typeof map.cities === "object") {
    for (const city of Object.values(map.cities)) take(city?.phones);
  } else {
    take(map?.phones ?? map);
  }
  return out;
}

export function applyPhones(registry, phoneMaps, { date }) {
  const byAlias = new Map();
  for (const p of registry.places.values()) for (const a of p.aliases) {
    if (!byAlias.has(a)) byAlias.set(a, []);
    byAlias.get(a).push(p.placeId);
  }
  const stats = { keys: 0, unmatchedKeys: 0, skippedValues: 0, placesWithPhone: 0, changed: 0, sharedGroups: 0 };
  const forPlace = new Map();
  for (const map of phoneMaps) {
    for (const [key, value] of flattenPhones(map)) {
      stats.keys++;
      if (typeof value !== "string" || !value.trim()) { stats.skippedValues++; continue; }
      const ids = byAlias.get(key);
      if (!ids) { stats.unmatchedKeys++; continue; }
      for (const id of ids) if (!forPlace.has(id)) forPlace.set(id, value.trim());
    }
  }
  const owners = new Map();
  for (const [id, phone] of forPlace) {
    const place = registry.places.get(id);
    const open = place.contactPhone[place.contactPhone.length - 1];
    if (!open || open.to !== null || open.value !== phone) {
      registry.setContactPhone(id, phone, date);
      stats.changed++;
    }
    owners.set(phone, (owners.get(phone) ?? 0) + 1);
  }
  stats.placesWithPhone = forPlace.size;
  stats.sharedGroups = [...owners.values()].filter((n) => n > 1).length; // один номер у нескольких мест: только подсказка, не склейка
  return stats;
}

function main(argv) {
  const arg = (name) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : null;
  };
  const from = arg("from");
  const out = arg("out");
  const date = arg("date");
  if (!from || !out || !date) {
    console.error("нужно: --from <папка json> --out <папка вывода> --date ГГГГ-ММ-ДД [--registry registry.json]");
    process.exit(2);
  }
  const prev = arg("registry");
  const registry = prev ? PlaceRegistry.fromJSON(JSON.parse(fs.readFileSync(prev, "utf8"))) : new PlaceRegistry();
  const stats = importCatalog(registry, readCatalogFiles(from), { date });
  const phoneFiles = (arg("phones") ?? "").split(",").filter(Boolean);
  if (phoneFiles.length) {
    const maps = phoneFiles.map((f) => JSON.parse(fs.readFileSync(f, "utf8")));
    stats.phones = applyPhones(registry, maps, { date });
  }

  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "registry.json"), JSON.stringify(registry.toJSON(), null, 1) + "\n");
  const served = registry.servedFile();
  const file = {
    format: 1,
    etag: served.etag,
    asOf: date,
    count: served.places.length,
    places: served.places,
  };
  fs.writeFileSync(path.join(out, "served_places.json"), JSON.stringify(file) + "\n");
  console.log(JSON.stringify({ ...stats, places: registry.places.size, served: served.places.length, etag: served.etag }, null, 1));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
