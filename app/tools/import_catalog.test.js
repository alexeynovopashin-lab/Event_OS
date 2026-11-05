// tools/import_catalog.test.js — проверки импорта справочника студий в реестр мест.
// Запуск из папки app/:  node --test tools/import_catalog.test.js
// Вход — маленький выдуманный каталог; реальные данные тест не читает.

import test from "node:test";
import assert from "node:assert/strict";

import { PlaceRegistry, CATALOG, VERIFICATION, LIFE } from "../core/registry.js";
import { importCatalog } from "./import_catalog.js";

function lists() {
  return [
    {
      file: "tomsk.json",
      city: "Томск",
      timezone: "Asia/Tomsk",
      collected: "2026-11-04",
      first: true,
      studios: [
        {
          id: "mystudio",
          name: "Моя студия",
          address: "Томск, ул. Первая, 1",
          connectedToBroniOS: true,
          halls: [{ key: "a", name: "Белый", hasWindows: true, windowsAzimuth: 180 }],
          src: ["own (слова владельца)"],
        },
      ],
      closed: [{ name: "Старая", address: "Томск, ул. Вторая, 2", halls: [], src: ["gorko:77 (залы)"] }],
    },
    {
      file: "kazan.json",
      city: "Казань",
      timezone: null,
      collected: "2026-11-04",
      first: false,
      studios: [
        { name: "Свет", address: "Казань, ул. А, 3", halls: [], src: ["studiogo:1"], formerNames: ["Луч"] },
        {
          name: "Свет 2",
          address: "Казань, ул. Б, 4",
          halls: [],
          src: ["studiogo:2"],
          note: "возможно, то же место, что «Свет»",
        },
        { name: "Без адреса", address: "", halls: [], src: ["studiogo:3"], hallsCount: 3 },
        // одна карточка источника на два адреса: ключи не должны совпасть
        { name: "Сеть", address: "Казань, ул. В, 5", halls: [], src: ["studiogo:9"], note: "филиал" },
        { name: "Сеть", address: "Казань, ул. Г, 6", halls: [], src: ["studiogo:9"], note: "филиал" },
      ],
      closed: [],
    },
  ];
}

test("номера выдаёт реестр, Томск идёт первым, порядок не зависит от входа", () => {
  const r = new PlaceRegistry();
  importCatalog(r, lists(), { date: "2026-11-05" });
  const served = r.servedFile().places;
  assert.equal(served.length, 7);
  assert.equal(served[0].name, "Моя студия");
  assert.equal(served[0].placeId, "pl100001");
  assert.ok(served.every((p) => /^pl\d{6}$/.test(p.placeId)));
});

test("признаки: проверена — только своя студия, «возможно, то же место» — спорная, остальное из сбора", () => {
  const r = new PlaceRegistry();
  importCatalog(r, lists(), { date: "2026-11-05" });
  const byName = Object.fromEntries(r.servedFile().places.map((p) => [p.name, p]));
  assert.equal(byName["Моя студия"].verification, VERIFICATION.HUMAN);
  assert.equal(byName["Моя студия"].catalog, CATALOG.CONNECTED);
  assert.equal(byName["Свет 2"].verification, VERIFICATION.DISPUTED);
  assert.equal(byName["Свет 2"].note, "возможно, то же место, что «Свет»");
  assert.equal(byName["Свет"].verification, VERIFICATION.SCRAPED);
  assert.equal(byName["Свет"].catalog, CATALOG.NOT_CONNECTED);
  assert.equal(byName["Свет 2"].links.length, 0, "скрипт сам ничего не склеивает");
});

test("закрытая студия получает номер и остаётся в файле с life «закрыта»; залы и окна переносятся", () => {
  const r = new PlaceRegistry();
  importCatalog(r, lists(), { date: "2026-11-05" });
  const byName = Object.fromEntries(r.servedFile().places.map((p) => [p.name, p]));
  assert.equal(byName["Старая"].life, LIFE.CLOSED);
  assert.deepEqual(byName["Моя студия"].halls, [
    { number: 1, name: "Белый", windows: true, azimuth: 180, archived: null },
  ]);
});

test("адрес не найден — null, а не выдуманная строка; число залов без названий сохраняется", () => {
  const r = new PlaceRegistry();
  importCatalog(r, lists(), { date: "2026-11-05" });
  const p = r.servedFile().places.find((x) => x.name === "Без адреса");
  assert.equal(p.address, null);
  assert.equal(p.hallsCount, 3);
  assert.equal(p.halls.length, 0);
});

test("одна карточка источника на два адреса — два места", () => {
  const r = new PlaceRegistry();
  importCatalog(r, lists(), { date: "2026-11-05" });
  assert.equal(r.servedFile().places.filter((p) => p.name === "Сеть").length, 2);
});

test("прежние названия находятся поиском, но в отдаваемый файл не попадают внешние ключи", () => {
  const r = new PlaceRegistry();
  importCatalog(r, lists(), { date: "2026-11-05" });
  assert.equal(r.find("луч").length, 1);
  assert.equal(r.find("studiogo:1").length, 1);
  assert.ok(!JSON.stringify(r.servedFile()).includes("studiogo"));
});

test("повторный импорт ничего не выдаёт заново и не меняет номера", () => {
  const r = new PlaceRegistry();
  importCatalog(r, lists(), { date: "2026-11-05" });
  const before = JSON.stringify(r.toJSON());
  const again = PlaceRegistry.fromJSON(JSON.parse(before));
  const stats = importCatalog(again, lists(), { date: "2026-11-06" });
  assert.equal(stats.issued, 0);
  assert.equal(stats.existing, 7);
  assert.equal(JSON.stringify(again.toJSON()), before);
});

test("повторный импорт с новым названием и адресом правит место под тем же номером", () => {
  const r = new PlaceRegistry();
  importCatalog(r, lists(), { date: "2026-11-05" });
  const l = lists();
  l[1].studios[0].name = "Свет и тень";
  l[1].studios[0].address = "Казань, ул. А, 3Б";
  l[1].collected = "2026-12-01";
  const stats = importCatalog(r, l, { date: "2026-12-01" });
  assert.equal(stats.issued, 0);
  assert.equal(stats.renamed, 1);
  assert.equal(stats.readdressed, 1);
  const p = r.servedFile().places.find((x) => x.name === "Свет и тень");
  assert.equal(p.address, "Казань, ул. А, 3Б");
  assert.equal(r.find("свет").length >= 1, true);
});

test("в отдаваемом файле нет людей, телефонов, цен и фото", () => {
  const r = new PlaceRegistry();
  importCatalog(r, lists(), { date: "2026-11-05" });
  const text = JSON.stringify(r.servedFile());
  for (const bad of ["contactPhone", "operator", "people", "prices", "photos", "description", "aliases", "tel:"]) {
    assert.ok(!text.includes(bad), `в файле не должно быть «${bad}»`);
  }
  assert.ok(!/\+?\d[\d\s()-]{9,}\d/.test(text.replace(/pl\d+/g, "").replace(/\d{4}-\d{2}-\d{2}/g, "")), "похожего на телефон нет");
});
