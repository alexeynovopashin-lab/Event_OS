# Event OS — app skeleton

Первая рабочая реализация архитектуры «общее ядро + отдельные лёгкие PWA»,
описанной в `50_Event_Lifecycle.md`–`54_Changes.md`.

```text
app/
├── core/                shared: Project Graph + Context Engine, без UI
│   ├── graph.js          Graph, Node, Edge, Change (11_Graph_Model.md, 54_Changes.md)
│   ├── context.js        computeContext() — Rescue Room per role (12_Context_Engine.md)
│   ├── seed.js            демо-проект "Smith Wedding" — общий для всех ролей
│   ├── id.js              appId() — вычисление ID из номера (11_Graph_Model.md)
│   └── navigator.css      общий минимальный стиль Navigator-экрана
│
├── organizer/            = Light Plan (см. ниже, пока bridge-страница)
├── photographer/         лёгкое ролевое PWA
├── driver/                лёгкое ролевое PWA
└── client/                лёгкое ролевое PWA, изолированный доступ
```

## Как открыть

Каждая папка — самостоятельная PWA, можно открывать `index.html` напрямую
(ES-модули требуют `http://`, не `file://`) или через любой статический сервер:

```bash
npx serve "Event OS/app"
```

Затем: `/photographer/`, `/driver/`, `/client/`, `/organizer/`.

## Что уже работает

Все четыре PWA читают **один и тот же** демо-проект (`core/seed.js`) через
`localStorage` (`eventos:project:demo-smith-wedding`). Открой `photographer/`
и `driver/` — у обоих есть одна и та же карточка "Изменилось: Парк → Зимний
сад", потому что оба назначены (`ASSIGNED_TO`) на сцену "Фотосессия" и оба
входят в `Affected Roles` одного и того же `Change`. `client/` эту карточку не
видит — клиент не входит в `Affected Roles` этого изменения (пример из
`54_Changes.md §34`, "Change и клиент").

**Согласие адресата перед записью (`BRIDGE_LIGHT_PLAN.md §3/§9`, решено
3 сентября 2026).** Открой `photographer/` — вторая карточка: организатор
предложил добавить съёмку деталей напрямую в календарь фотографа. Сцена
`scene-detail-shoot` при этом **не существует в графе** — не появится ни в
`nodesByType("Scene")`, ни у кого другого — пока фотограф не нажмёт
«Подтвердить» (`Graph.confirmChange`) или «Отклонить» (`Graph.declineChange`).
Механизм — `Graph.proposeNode()` для новой записи и `meta.consentFrom` в
`Graph.updateNode()` для правки существующей: обе создают `Change` со
`status: "Pending"` и не трогают сам узел до ответа адресата.

**Граф приглашений произвольной глубины (`BRIDGE_LIGHT_PLAN.md §2/§4`,
решено 3 сентября 2026).** `core/seed.js` заводит `person-assistant`
(зависит от `person-photographer` через `DEPENDS_ON`) и
`person-second-assistant` (зависит от `person-assistant`) — два уровня
рекурсии без единой строчки специального кода под каждый уровень:
`Graph.dependentsOf('person-photographer')` обходит цепочку рекурсивно и
возвращает обоих. Ни у ассистента, ни у его ассистента нет ребра к
`person-organizer` — структурно, а не как ограничение прав: организатор не
обязан знать про эту ветку, потому что запрашивать её ему неоткуда.

**Участник из справочника, а не по инвайту (`BRIDGE_LIGHT_PLAN.md §9`,
решено 3 сентября 2026).** `core/seed.js` заводит администратора ресторана
через `appId(phone, "place")` (`core/id.js`) — `pl79161234567`, не по
личному ID и не по инвайту от организатора. Один общий префикс на все
площадки: тип (студия/банкетный зал) — атрибут карточки, не часть адреса,
иначе один и тот же номер, заведённый в каталог как разные "типы", давал бы
два разных узла графа об одном месте. Единственное ребро у площадки —
`ASSIGNED_TO` на сцену «Банкет»; попав в неё, площадка автоматически
участвует в `Graph.affectedRoles()` наравне с приглашёнными — проверено:
`affectedRoles({ objectId: 'scene-reception' })` возвращает `venue_manager`
без единой строчки специального кода.

**Event Root (`11_Graph_Model.md`, до сих пор не проверялось).** Документ
требует: «каждый граф имеет один корневой объект; все остальные вершины
должны иметь путь к нему; если объект невозможно связать с Event, он не
принадлежит системе» — а узла `Event` в графе не было вовсе, `projectId`
был просто строкой-ключом `localStorage`. Теперь `core/seed.js` заводит
`event-smith-wedding`, организатор связан с ним напрямую
(`RESPONSIBLE_FOR`), три сцены — через `BELONGS_TO`; все остальные узлы
(фотограф, ассистенты, площадка) достижимы через них без отдельных рёбер.
`Graph.orphanNodes()` — не декларация, а проверка: с текущим сидом список
пуст (все 11 узлов достижимы), а если убрать ребро организатора —
немедленно возвращает `person-organizer`. Проверено в браузере.

## organizer/ — статус

`organizer/index.html` сейчас не полноценное приложение, а bridge-страница:
полный интерфейс организатора — это **Light Plan**
(`/Light_Plan/Light_Plan/beta/index.html`, ~8000 строк), не переписывается
заново. План миграции — в самой странице и в `50_Event_Lifecycle.md`.

## Что дальше (не сделано в этом скелете)

```text
Синхронизация между вкладками/устройствами (сейчас — только localStorage)
Реальный backend вместо localStorage
Permissions (23_Permissions.md) — сейчас роль передаётся напрямую, без проверки прав
Notification Policy (53_Notifications.md) — сейчас Change просто фильтруется по affectedRoles
Перевод модели данных Light Plan на core/graph.js
```
