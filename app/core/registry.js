// core/registry.js — реестр мест (16_Place_Registry.md).
//
// Справочник площадок: выдаёт номер месту, хранит его паспорт, историю,
// связи между местами и «призрак» после снятия по просьбе. Реестр НЕ часть
// графа проекта (11_Graph_Model.md): граф хранит только ссылку на место
// (placeRef) — номер и название на день записи.
//
// Скелет: всё в памяти, без облака, без UI. Даты — строки «ГГГГ-ММ-ДД»,
// часы не читаются: результат зависит только от переданных аргументов.
// Хранилище Яндекса, процесс выдачи номеров и импорт справочника — позже,
// по отдельному слову Алексея.

export const VERIFICATION = {
  HUMAN: "проверена человеком",
  SCRAPED: "из сбора",
  DISPUTED: "спорная",
};

export const CATALOG = {
  NOT_CONNECTED: "не подключена",
  CONNECTED: "подключена",
  REMOVED: "снята по просьбе",
};

export const LIFE = { ACTIVE: "действует", CLOSED: "закрыта" };

const FIRST_NUMBER = 100001;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function requireDate(value, what = "since") {
  if (typeof value !== "string" || !DATE.test(value)) {
    throw new Error(`${what}: ожидается дата «ГГГГ-ММ-ДД», получено ${JSON.stringify(value)}`);
  }
  return value;
}

// --- Периоды «с … по …» -------------------------------------------------

function current(periods) {
  return periods.length > 0 && periods[periods.length - 1].to === null
    ? periods[periods.length - 1]
    : null;
}

function startPeriod(periods, value, since) {
  const open = current(periods);
  if (open) {
    if (open.from > since) throw new Error("новый период начинается раньше текущего");
    open.to = since;
  }
  periods.push({ from: since, to: null, value });
}

function valueAt(periods, date) {
  const hit = periods.find((p) => p.from <= date && (p.to === null || date < p.to));
  return hit ? hit.value : null;
}

// --- Реестр -------------------------------------------------------------

export class PlaceRegistry {
  constructor(snapshot = null) {
    this.next = FIRST_NUMBER; // счётчик выдачи; назад не идёт, номера не выдаются повторно
    this.rev = 0; // растёт с каждым изменением; ETag отдаваемого файла
    this.places = new Map();
    if (snapshot) {
      this.next = snapshot.next;
      this.rev = snapshot.rev;
      this.places = new Map(snapshot.places.map((p) => [p.placeId, p]));
    }
  }

  toJSON() {
    return { next: this.next, rev: this.rev, places: [...this.places.values()] };
  }

  static fromJSON(json) {
    return new PlaceRegistry(JSON.parse(JSON.stringify(json)));
  }

  // --- Выдача -----------------------------------------------------------

  // Номер = «pl» + число из счётчика. Не связан ни с телефоном, ни с названием.
  issue(data, since) {
    requireDate(since);
    if (!data?.name || typeof data.address !== "string") throw new Error("для места нужны name и address (адрес может быть пустым: «не найден при сборе»)");
    const placeId = "pl" + this.next++;
    const place = {
      placeId,
      names: [{ from: since, to: null, value: data.name }],
      addresses: data.address ? [{ from: since, to: null, value: data.address }] : [], // пусто = адрес не найден
      city: data.city ?? null,
      timezone: data.timezone ?? null,
      operatorPeriods: [],
      contactPhone: [],
      halls: [],
      nextHall: 1,
      aliases: [...(data.aliases ?? [])],
      lifePeriods: [{ from: since, to: null, value: LIFE.ACTIVE }],
      catalog: { state: data.catalog ?? CATALOG.NOT_CONNECTED, since },
      verification: data.verification ?? VERIFICATION.SCRAPED,
      note: data.note ?? null,
      hallsCount: data.hallsCount ?? null, // залов известно сколько, а названий нет (сбор)
      links: [],
      updatedAt: since,
    };
    if (data.contactPhone) startPeriod(place.contactPhone, data.contactPhone, since);
    this.places.set(placeId, place);
    this._touch(place, since);
    return place;
  }

  _get(id) {
    const place = this.places.get(id);
    if (!place) throw new Error(`неизвестное место: ${id}`);
    return place;
  }

  _touch(place, since) {
    place.updatedAt = since;
    this.rev++;
  }

  // --- Правки полей -----------------------------------------------------

  rename(id, name, since) {
    requireDate(since);
    const place = this._get(id);
    if (current(place.names).value === name) return place;
    startPeriod(place.names, name, since);
    this._touch(place, since);
    return place;
  }

  // Поправка адреса: опечатка, переименованная улица, новая нумерация, этаж
  // внутри того же помещения. Номер тот же, связи «переехала из» нет.
  correctAddress(id, address, since) {
    requireDate(since);
    const place = this._get(id);
    startPeriod(place.addresses, address, since);
    this._touch(place, since);
    return place;
  }

  setContactPhone(id, phone, since) {
    requireDate(since);
    const place = this._get(id);
    startPeriod(place.contactPhone, phone, since);
    this._touch(place, since);
    return place;
  }

  setOperator(id, operator, since) {
    requireDate(since);
    const place = this._get(id);
    const open = current(place.operatorPeriods); // период хозяина: {from, to, org, people}
    if (open) open.to = since;
    place.operatorPeriods.push({
      from: since,
      to: null,
      org: operator?.org ?? null,
      people: [...(operator?.people ?? [])],
    });
    this._touch(place, since);
    return place;
  }

  verify(id, verification, note = null) {
    if (!Object.values(VERIFICATION).includes(verification)) {
      throw new Error(`неизвестный признак проверки: ${verification}`);
    }
    const place = this._get(id);
    place.verification = verification;
    place.note = note;
    this.rev++;
    return place;
  }

  setCatalog(id, state, since) {
    requireDate(since);
    if (state === CATALOG.REMOVED) throw new Error("снятие — через remove(): оно стирает данные периода");
    if (!Object.values(CATALOG).includes(state)) throw new Error(`неизвестное состояние: ${state}`);
    const place = this._get(id);
    if (place.catalog.state === CATALOG.REMOVED) throw new Error("снятое место возвращается через restore()");
    place.catalog = { state, since };
    this._touch(place, since);
    return place;
  }

  // --- Залы -------------------------------------------------------------

  // Номер зала стабилен внутри места и не выдаётся повторно; название — подпись.
  addHall(id, hall, since) {
    requireDate(since);
    const place = this._get(id);
    const created = {
      number: place.nextHall++,
      names: [{ from: since, to: null, value: hall.name }],
      windows: hall.windows ?? null,
      azimuth: hall.azimuth ?? null,
      archived: null,
      // поля периода хозяина — при снятии стираются:
      description: hall.description ?? null,
      photos: hall.photos ? [...hall.photos] : [],
      prices: hall.prices ? { ...hall.prices } : null,
    };
    place.halls.push(created);
    this._touch(place, since);
    return created;
  }

  archiveHall(id, number, since) {
    requireDate(since);
    const place = this._get(id);
    const hall = place.halls.find((h) => h.number === number);
    if (!hall) throw new Error(`нет зала ${number} в ${id}`);
    hall.archived = since; // архив вместо удаления
    this._touch(place, since);
    return hall;
  }

  // --- Жизнь помещения (ось 1) -------------------------------------------

  close(id, since) {
    requireDate(since);
    const place = this._get(id);
    if (current(place.lifePeriods).value === LIFE.CLOSED) throw new Error("место уже закрыто");
    startPeriod(place.lifePeriods, LIFE.CLOSED, since);
    this._touch(place, since);
    return place;
  }

  // Открылось снова: новый период на том же номере.
  reopen(id, since) {
    requireDate(since);
    const place = this._get(id);
    if (current(place.lifePeriods).value === LIFE.ACTIVE) throw new Error("место и так действует");
    startPeriod(place.lifePeriods, LIFE.ACTIVE, since);
    this._touch(place, since);
    return place;
  }

  isActive(id) {
    return current(this._get(id).lifePeriods).value === LIFE.ACTIVE;
  }

  // Принимает ли место бронь на дату: в закрытый период и у снятого — нет.
  acceptsBooking(id, date) {
    requireDate(date, "date");
    const place = this._get(this.resolve(id));
    if (place.catalog.state === CATALOG.REMOVED) return false;
    return valueAt(place.lifePeriods, date) === LIFE.ACTIVE;
  }

  // --- Связи (3 вида) ----------------------------------------------------

  // Переезд: новое место (новый номер) со ссылкой moved_from; старое закрыто.
  moveTo(oldId, data, since) {
    requireDate(since);
    const old = this._get(oldId);
    const fresh = this.issue(
      { name: current(old.names).value, city: old.city, timezone: old.timezone, ...data },
      since
    );
    fresh.links.push({ type: "moved_from", id: oldId, since });
    if (current(old.lifePeriods).value === LIFE.ACTIVE) this.close(oldId, since);
    this._touch(fresh, since);
    return fresh;
  }

  // Филиал: отдельное место со своим номером; связь branch_of.
  addBranch(fromId, data, since) {
    requireDate(since);
    this._get(fromId);
    const fresh = this.issue(data, since);
    fresh.links.push({ type: "branch_of", id: fromId, since });
    return fresh;
  }

  // Склейка дубля: старый номер остаётся и продолжает отвечать (resolve).
  merge(dupId, keepId, since) {
    requireDate(since);
    if (dupId === keepId) throw new Error("нельзя склеить место с самим собой");
    const dup = this._get(dupId);
    this._get(keepId);
    if (dup.links.some((l) => l.type === "duplicate_of")) throw new Error(`${dupId} уже склеено`);
    if (this.resolve(keepId) === dupId) throw new Error("склейка замкнула бы цикл");
    dup.links.push({ type: "duplicate_of", id: keepId, since });
    this._touch(dup, since);
    return dup;
  }

  // Номер, на который в итоге ведёт id (по цепочке склеек).
  resolve(id) {
    const seen = new Set();
    let at = id;
    while (true) {
      if (seen.has(at)) throw new Error("цикл склеек");
      seen.add(at);
      const link = this._get(at).links.find((l) => l.type === "duplicate_of");
      if (!link) return at;
      at = link.id;
    }
  }

  // Места, переехавшие ИЗ id (обычно одно).
  movedTo(id) {
    return [...this.places.values()]
      .filter((p) => p.links.some((l) => l.type === "moved_from" && l.id === id))
      .sort((a, b) => a.placeId.localeCompare(b.placeId, "en", { numeric: true }))
      .map((p) => p.placeId);
  }

  // A → B → C: путь от id вперёд до последнего места.
  movedChain(id) {
    const chain = [id];
    const seen = new Set(chain);
    for (let at = id; ; ) {
      const [next] = this.movedTo(at);
      if (!next || seen.has(next)) return chain;
      chain.push(next);
      seen.add(next);
      at = next;
    }
  }

  // --- Ответ на запрос по номеру -------------------------------------------

  lookup(id) {
    const canon = this.resolve(id);
    const place = this._get(canon);
    const via = canon !== id ? { mergedFrom: id } : {};
    if (place.catalog.state === CATALOG.REMOVED) {
      return { kind: "removed", placeId: canon, since: place.catalog.since, ...via };
    }
    if (!this.isActive(canon)) {
      const chain = this.movedChain(canon);
      if (chain.length > 1) {
        return { kind: "moved", placeId: canon, to: chain[chain.length - 1], chain, ...via };
      }
      return { kind: "closed", placeId: canon, ...via };
    }
    return { kind: "active", placeId: canon, place: this._view(place), ...via };
  }

  // Поиск по любому названию, прежнему и текущему, и по внешним номерам.
  // Снятые места в поиске не показываются.
  find(query) {
    const q = String(query).trim().toLowerCase();
    if (!q) return [];
    const hits = new Set();
    for (const place of this.places.values()) {
      const texts = [
        ...place.names.map((n) => n.value),
        ...place.addresses.map((a) => a.value),
        ...place.aliases,
      ];
      if (!texts.some((t) => String(t).toLowerCase().includes(q))) continue;
      const canon = this.resolve(place.placeId);
      if (this._get(canon).catalog.state === CATALOG.REMOVED) continue;
      hits.add(canon);
    }
    return [...hits].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  }

  // --- Снятие по просьбе, призрак, восстановление --------------------------

  // Стирает данные периода хозяина; остаётся призрак (список разрешённых полей).
  remove(id, since) {
    requireDate(since);
    const place = this._get(id);
    if (place.catalog.state === CATALOG.REMOVED) throw new Error("место уже снято");
    place.operatorPeriods = [];
    place.contactPhone = [];
    place.note = null;
    for (const hall of place.halls) {
      hall.description = null;
      hall.photos = [];
      hall.prices = null;
    }
    place.catalog = { state: CATALOG.REMOVED, since };
    this._touch(place, since);
    return this.ghost(id);
  }

  // Призрак: только номер, адрес, названия, залы (номера, названия, окна, азимут),
  // связи, статус. Белый список — новое поле в призрак само не попадёт.
  ghost(id) {
    const place = this._get(id);
    if (place.catalog.state !== CATALOG.REMOVED) throw new Error(`${id} не снято: призрака нет`);
    return {
      placeId: place.placeId,
      names: copy(place.names),
      addresses: copy(place.addresses),
      city: place.city,
      timezone: place.timezone,
      halls: place.halls.map((h) => ({
        number: h.number,
        names: copy(h.names),
        windows: h.windows,
        azimuth: h.azimuth,
        archived: h.archived,
      })),
      lifePeriods: copy(place.lifePeriods),
      links: copy(place.links),
      removedSince: place.catalog.since,
    };
  }

  // Новый хозяин заявил права (код на номер и почта проверяются вне реестра).
  // Тот же номер, те же номера залов; период хозяина начинается пустым.
  restore(id, claim, since) {
    requireDate(since);
    const place = this._get(id);
    if (place.catalog.state !== CATALOG.REMOVED) throw new Error(`${id} не снято: восстанавливать нечего`);
    place.operatorPeriods = [
      { from: since, to: null, org: claim?.org ?? null, people: [...(claim?.people ?? [])] },
    ];
    place.catalog = { state: CATALOG.CONNECTED, since };
    this._touch(place, since);
    return place;
  }

  // --- Отдаваемый файл ------------------------------------------------------

  // Все записи, кроме снятых по просьбе; с признаком проверки. Без людей,
  // телефонов, цен, фото и текстов. etag растёт с каждым изменением реестра.
  servedFile() {
    const places = [...this.places.values()]
      .filter((p) => p.catalog.state !== CATALOG.REMOVED)
      .sort((a, b) => a.placeId.localeCompare(b.placeId, "en", { numeric: true }))
      .map((p) => {
        const entry = this._view(p);
        const merged = p.links.find((l) => l.type === "duplicate_of");
        if (merged) entry.mergedInto = merged.id;
        const [next] = this.movedTo(p.placeId);
        if (next) entry.movedTo = next;
        return entry;
      });
    return { etag: this.rev, places };
  }

  _view(place) {
    const view = {
      placeId: place.placeId,
      name: current(place.names)?.value ?? null,
      names: copy(place.names),
      address: current(place.addresses)?.value ?? null,
      city: place.city,
      timezone: place.timezone,
      halls: place.halls.map((h) => ({
        number: h.number,
        name: current(h.names)?.value ?? null,
        windows: h.windows,
        azimuth: h.azimuth,
        archived: h.archived,
      })),
      life: current(place.lifePeriods).value,
      catalog: place.catalog.state,
      verification: place.verification,
      links: copy(place.links),
      updatedAt: place.updatedAt,
    };
    if (place.note) view.note = place.note;
    if (place.hallsCount) view.hallsCount = place.hallsCount;
    return view;
  }
}

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

// Узел-ссылка для графа проекта: номер места и название на день записи.
// Название и адрес в ссылке — снимок; изменение места в реестре прошлые
// события не переписывает.
export function placeRef(registry, id, onDate) {
  requireDate(onDate, "onDate");
  const place = registry._get(id);
  return {
    id: `placeref-${id}`,
    type: "PlaceRef",
    placeId: id,
    name: valueAt(place.names, onDate) ?? current(place.names).value,
    snapshotAt: onDate,
  };
}
