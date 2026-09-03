# Event OS — app skeleton

Первая рабочая реализация архитектуры «общее ядро + отдельные лёгкие PWA»,
описанной в `50_Event_Lifecycle.md`–`54_Changes.md`.

```text
app/
├── core/                shared: Project Graph + Context Engine, без UI
│   ├── graph.js          Graph, Node, Edge, Change (11_Graph_Model.md, 54_Changes.md)
│   ├── context.js        computeContext() — Rescue Room per role (12_Context_Engine.md)
│   ├── seed.js            демо-проект "Smith Wedding" — общий для всех ролей
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
