// core/registry.test.js — проверки реестра мест (16_Place_Registry.md,
// «Сценарии проверки»). Запуск из папки app/:  node --test core/registry.test.js
//
// Ничего не читает из сети и часов: даты передаются явно.

import test from "node:test";
import assert from "node:assert/strict";

import { PlaceRegistry, CATALOG, VERIFICATION, LIFE, placeRef } from "./registry.js";
import { appId } from "./id.js";
import { Graph } from "./graph.js";
import { seedDemoProject, seedPlaceRegistry } from "./seed.js";

const D1 = "2026-01-01";
const D2 = "2026-03-01";
const D3 = "2026-06-01";
const D4 = "2026-09-01";

function studio(registry, name = "Студия «Свет»", address = "ул. Ленина, 10") {
  return registry.issue({ name, address, city: "Томск", timezone: "Asia/Tomsk" }, D1);
}

// 1. Переименование
test("1. переименование: номер тот же, два имени с датами, поиск находит по обоим", () => {
  const r = new PlaceRegistry();
  const p = studio(r);
  r.rename(p.placeId, "Студия «Луч»", D2);

  assert.equal(r.places.size, 1);
  assert.equal(p.names.length, 2);
  assert.deepEqual(p.names.map((n) => [n.value, n.from, n.to]), [
    ["Студия «Свет»", D1, D2],
    ["Студия «Луч»", D2, null],
  ]);
  assert.deepEqual(r.find("свет"), [p.placeId]);
  assert.deepEqual(r.find("луч"), [p.placeId]);
});

// 2. Переезд
test("2. переезд: новое место с moved_from, старое закрыто, старый номер отвечает «переехала в»", () => {
  const r = new PlaceRegistry();
  const old = studio(r);
  r.addHall(old.placeId, { name: "Белый", windows: 3, azimuth: 180 }, D1);

  const fresh = r.moveTo(old.placeId, { address: "пр. Мира, 5" }, D2);

  assert.notEqual(fresh.placeId, old.placeId);
  assert.deepEqual(fresh.links, [{ type: "moved_from", id: old.placeId, since: D2 }]);
  assert.equal(r.isActive(old.placeId), false);
  assert.equal(r.isActive(fresh.placeId), true);
  assert.equal(fresh.halls.length, 0, "окна и азимут заводятся заново, залы не копируются");

  const answer = r.lookup(old.placeId);
  assert.equal(answer.kind, "moved");
  assert.equal(answer.to, fresh.placeId);

  // старые данные остаются на старом номере
  assert.equal(old.halls.length, 1);
  assert.equal(r.acceptsBooking(old.placeId, "2026-02-15"), true, "до переезда бронь была возможна");
  assert.equal(r.acceptsBooking(old.placeId, D3), false);
});

// 3. Цепочка A → B → C
test("3. цепочка переездов: от A читается путь до C", () => {
  const r = new PlaceRegistry();
  const a = studio(r);
  const b = r.moveTo(a.placeId, { address: "адрес B" }, D2);
  const c = r.moveTo(b.placeId, { address: "адрес C" }, D3);

  assert.deepEqual(r.movedChain(a.placeId), [a.placeId, b.placeId, c.placeId]);
  assert.equal(r.lookup(a.placeId).to, c.placeId);
  assert.equal(r.lookup(b.placeId).to, c.placeId);
  assert.equal(r.lookup(c.placeId).kind, "active");
});

// 4. Поправка адреса
test("4. поправка адреса: номер тот же, новое значение с датой, связи «переехала из» нет", () => {
  const r = new PlaceRegistry();
  const p = studio(r, "Студия", "ул. Лениная, 10"); // опечатка
  r.correctAddress(p.placeId, "ул. Ленина, 10", D2);

  assert.equal(r.places.size, 1);
  assert.equal(p.addresses.length, 2);
  assert.equal(p.addresses[1].value, "ул. Ленина, 10");
  assert.deepEqual(p.links, []);
  assert.equal(r.lookup(p.placeId).kind, "active");
  assert.equal(r.lookup(p.placeId).place.address, "ул. Ленина, 10");
});

// 5. Филиал
test("5. филиал: одно название на двух адресах — два номера и связь branch_of", () => {
  const r = new PlaceRegistry();
  const main = studio(r, "Студия «Свет»", "ул. Ленина, 10");
  const branch = r.addBranch(main.placeId, { name: "Студия «Свет»", address: "пр. Мира, 5" }, D2);

  assert.notEqual(main.placeId, branch.placeId);
  assert.deepEqual(branch.links, [{ type: "branch_of", id: main.placeId, since: D2 }]);
  assert.deepEqual(r.find("свет"), [main.placeId, branch.placeId]);
  assert.equal(r.isActive(main.placeId) && r.isActive(branch.placeId), true);
});

// 6. Закрытие и повторное открытие
test("6. закрытие и повторное открытие: два периода «действует» на одном номере, бронь в закрытый период отвергается", () => {
  const r = new PlaceRegistry();
  const p = studio(r);
  r.close(p.placeId, D2);
  r.reopen(p.placeId, D3);

  assert.equal(r.places.size, 1);
  assert.deepEqual(p.lifePeriods.map((x) => x.value), [LIFE.ACTIVE, LIFE.CLOSED, LIFE.ACTIVE]);
  assert.equal(r.acceptsBooking(p.placeId, "2026-02-01"), true);
  assert.equal(r.acceptsBooking(p.placeId, "2026-04-15"), false, "в закрытый период");
  assert.equal(r.acceptsBooking(p.placeId, "2026-07-01"), true);

  // хозяин и название в новом периоде могут быть другими
  r.rename(p.placeId, "Новая студия", D3);
  r.setOperator(p.placeId, { org: { inn: "0000000000", name: "ИП Новый" } }, D3);
  assert.equal(p.operatorPeriods.length, 1);
  assert.equal(r.lookup(p.placeId).place.name, "Новая студия");
});

// 7. Снятие по просьбе
test("7. снятие по просьбе: из файла и поиска запись исчезает, в реестре остаётся призрак без людей, телефонов, денег, фото и цен", () => {
  const r = new PlaceRegistry();
  const p = r.issue(
    { name: "Студия «Свет»", address: "ул. Ленина, 10", city: "Томск", timezone: "Asia/Tomsk", contactPhone: "79990001122", verification: VERIFICATION.HUMAN, note: "заметка хозяина" },
    D1
  );
  r.setCatalog(p.placeId, CATALOG.CONNECTED, D1);
  r.setOperator(p.placeId, { org: { inn: "1234567890", name: "ИП Старый" }, people: [{ id: "id79990001122", role: "хозяин" }] }, D1);
  r.addHall(p.placeId, { name: "Белый", windows: 3, azimuth: 180, description: "Описание", photos: ["a.jpg"], prices: { hour: 1500 } }, D1);

  const ghost = r.remove(p.placeId, D3);

  assert.equal(r.servedFile().places.some((x) => x.placeId === p.placeId), false);
  assert.deepEqual(r.find("свет"), []);
  assert.equal(r.lookup(p.placeId).kind, "removed");
  assert.equal(r.acceptsBooking(p.placeId, D4), false);

  // призрак: белый список полей
  assert.deepEqual(Object.keys(ghost).sort(), [
    "addresses", "city", "halls", "lifePeriods", "links", "names", "placeId", "removedSince", "timezone",
  ]);
  assert.deepEqual(ghost.halls, [
    { number: 1, names: [{ from: D1, to: null, value: "Белый" }], windows: 3, azimuth: 180, archived: null },
  ]);
  const dumped = JSON.stringify(ghost) + JSON.stringify(r.places.get(p.placeId));
  for (const secret of ["79990001122", "ИП Старый", "1234567890", "a.jpg", "1500", "Описание", "заметка хозяина"]) {
    assert.equal(dumped.includes(secret), false, `в призраке не должно быть: ${secret}`);
  }
});

// 8. Восстановление
test("8. восстановление: тот же номер и номера залов, период хозяина пуст, чужие данные не возвращаются", () => {
  const r = new PlaceRegistry();
  const p = studio(r);
  r.addHall(p.placeId, { name: "Белый", windows: 3, azimuth: 180, photos: ["a.jpg"], prices: { hour: 1500 } }, D1);
  r.addHall(p.placeId, { name: "Чёрный" }, D1);
  r.remove(p.placeId, D2);

  const back = r.restore(p.placeId, { org: { inn: "1", name: "ИП Новый" } }, D3);

  assert.equal(back.placeId, p.placeId);
  assert.deepEqual(back.halls.map((h) => h.number), [1, 2]);
  assert.equal(back.halls[0].windows, 3);
  assert.deepEqual(back.halls[0].photos, []);
  assert.equal(back.halls[0].prices, null);
  assert.equal(back.operatorPeriods.length, 1);
  assert.deepEqual(back.operatorPeriods[0].people, []);
  assert.equal(back.catalog.state, CATALOG.CONNECTED);
  assert.equal(r.servedFile().places.some((x) => x.placeId === p.placeId), true);
  assert.equal(r.next, 100002, "новый номер не выдавался");
});

// 9. Склейка дублей
test("9. склейка дублей: старый номер отвечает как оставшийся и не выдаётся повторно", () => {
  const r = new PlaceRegistry();
  const keep = studio(r, "Студия «Свет»", "ул. Ленина, 10");
  const dup = studio(r, "Свет (дубль)", "ул. Ленина, 10, офис 2");
  r.merge(dup.placeId, keep.placeId, D2);

  assert.equal(r.resolve(dup.placeId), keep.placeId);
  const answer = r.lookup(dup.placeId);
  assert.equal(answer.placeId, keep.placeId);
  assert.equal(answer.mergedFrom, dup.placeId);
  assert.equal(r.acceptsBooking(dup.placeId, D3), true);
  assert.deepEqual(r.find("дубль"), [keep.placeId]);

  const entry = r.servedFile().places.find((x) => x.placeId === dup.placeId);
  assert.equal(entry.mergedInto, keep.placeId);

  const next = studio(r, "Другая", "другой адрес");
  assert.notEqual(next.placeId, dup.placeId);
  assert.notEqual(next.placeId, keep.placeId);

  assert.throws(() => r.merge(keep.placeId, dup.placeId, D3), /цикл/);
  assert.throws(() => r.merge(dup.placeId, next.placeId, D3), /уже склеено/);
});

// 10. Сомнительная пара
test("10. сомнительная пара: «спорная» попадает в файл с признаком и note и сама не склеивается", () => {
  const r = new PlaceRegistry();
  const a = studio(r, "Студия «Свет»", "ул. Ленина, 10");
  const b = r.issue(
    { name: "Свет", address: "ул. Ленина, 10, офис 2", verification: VERIFICATION.DISPUTED, note: "возможно, то же место, что pl100001" },
    D1
  );

  const file = r.servedFile();
  const entry = file.places.find((x) => x.placeId === b.placeId);
  assert.equal(entry.verification, VERIFICATION.DISPUTED);
  assert.equal(entry.note, "возможно, то же место, что pl100001");
  assert.equal(file.places.length, 2, "оба места на месте");
  assert.equal(r.resolve(a.placeId), a.placeId);
  assert.equal(r.resolve(b.placeId), b.placeId);
});

// Общее: выдача номеров
test("номер не выдаётся второй раз и не связан с телефоном", () => {
  const r = new PlaceRegistry();
  const ids = [];
  for (let i = 0; i < 20; i++) {
    const p = r.issue({ name: `Место ${i}`, address: `Адрес ${i}`, contactPhone: "79161234567" }, D1);
    ids.push(p.placeId);
    if (i % 3 === 0) r.remove(p.placeId, D2);
  }
  assert.equal(new Set(ids).size, 20);
  for (const id of ids) {
    assert.match(id, /^pl\d+$/);
    assert.equal(id.includes("9161234567"), false);
  }
  const after = r.issue({ name: "Ещё", address: "Ещё адрес" }, D3);
  assert.equal(ids.includes(after.placeId), false, "номер снятого места не выдаётся снова");
});

test("отдаваемый файл не содержит людей, телефонов, цен и фото; etag растёт", () => {
  const r = new PlaceRegistry();
  const p = r.issue({ name: "Студия", address: "Адрес", contactPhone: "79990001122" }, D1);
  r.setOperator(p.placeId, { org: { inn: "1234567890", name: "ИП" }, people: [{ id: "id79990001122", role: "хозяин" }] }, D1);
  r.addHall(p.placeId, { name: "Зал", windows: 2, azimuth: 90, photos: ["x.jpg"], prices: { hour: 999 }, description: "Текст" }, D1);

  const before = r.servedFile();
  const text = JSON.stringify(before);
  for (const secret of ["79990001122", "1234567890", "x.jpg", "999", "Текст", "хозяин"]) {
    assert.equal(text.includes(secret), false, `в файле не должно быть: ${secret}`);
  }
  r.rename(p.placeId, "Студия 2", D2);
  assert.ok(r.servedFile().etag > before.etag);
});

test("реестр сохраняется и читается обратно без потерь", () => {
  const r = new PlaceRegistry();
  const a = studio(r);
  r.moveTo(a.placeId, { address: "Новый" }, D2);
  const copy = PlaceRegistry.fromJSON(JSON.parse(JSON.stringify(r)));
  assert.deepEqual(copy.servedFile(), r.servedFile());
  const next = copy.issue({ name: "Х", address: "Y" }, D3);
  assert.equal(next.placeId, "pl" + r.next);
});

test("даты проверяются: часы и объекты Date не принимаются", () => {
  const r = new PlaceRegistry();
  assert.throws(() => r.issue({ name: "А", address: "Б" }, new Date()), /ГГГГ-ММ-ДД/);
  assert.throws(() => r.issue({ name: "А", address: "Б" }, "05.11.2026"), /ГГГГ-ММ-ДД/);
});

// Граф проекта
test("граф проекта: ссылка на место не теряет связности, название — снимок на день записи", () => {
  const r = new PlaceRegistry();
  const p = studio(r);
  const graph = new Graph("registry-test");
  graph.addNode({ id: "event-1", type: "Event", title: "Событие" });
  graph.addNode({ id: "scene-1", type: "Scene", title: "Съёмка" });
  graph.addEdge("BELONGS_TO", "scene-1", "event-1");

  const ref = placeRef(r, p.placeId, D1);
  graph.addNode(ref);
  graph.addEdge("LOCATED_AT", "scene-1", ref.id);
  assert.deepEqual(graph.orphanNodes(), []);

  r.rename(p.placeId, "Студия «Луч»", D2);
  assert.equal(graph.getNode(ref.id).name, "Студия «Свет»", "прошлая запись не переписывается");
  assert.equal(placeRef(r, p.placeId, D3).name, "Студия «Луч»");
});

test("демо-проект: ресторан — ссылка на место из реестра, администратор — человек с ID по телефону", () => {
  const graph = seedDemoProject();
  assert.deepEqual(graph.orphanNodes(), []);
  const refs = graph.nodesByType("PlaceRef");
  assert.equal(refs.length, 1);
  assert.match(refs[0].placeId, /^pl\d+$/);
  assert.equal(graph.getNode("id79161234567")?.role, "venue_manager");
  assert.equal(graph.getNode("pl79161234567"), null, "старого адреса из телефона больше нет");
  assert.equal(seedPlaceRegistry().find("Терраса").length, 1);
});

test("appId: для людей работает, номер места из телефона не вычисляется", () => {
  assert.equal(appId("79161234567"), "id79161234567");
  assert.equal(appId("79161234567", "person"), "id79161234567");
  assert.throws(() => appId("79161234567", "place"), /реестр/);
  assert.throws(() => appId("+7916"), /normalized/);
});
