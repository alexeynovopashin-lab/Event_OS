# 54_Changes.md

````markdown
# Changes

**Document:** `54_Changes.md`
**Version:** `0.1.0`
**Status:** Draft
**Depends on:**

* `11_Graph_Model.md`
* `12_Context_Engine.md`
* `13_Timeline_Canvas.md`
* `14_Navigator.md`
* `21_Projects.md`
* `22_Roles.md`
* `23_Permissions.md`
* `24_Communication.md`
* `25_Documents.md`
* `30_AI.md`
* `41_Design_Principles.md`
* `53_Notifications.md`

---

## 1. Назначение

Change — центральная механика Event OS.

Система не является CRM и не является task-менеджером. Она — это цепочка:

```text
Изменение реальности
      ↓
Граф определяет затронутые узлы
      ↓
Context Engine определяет, что каждому нужно знать
      ↓
Navigator показывает это в нужный момент
```

Этот документ формализует объект `Change`, его жизненный цикл и его отношение к уже существующим сущностям: `Decision`, `System Message`, `Notification`, `Task`.

Change уже упоминается почти в каждом документе платформы, но нигде не определён как единая структура. Этот документ не изобретает новую архитектуру — он собирает уже существующую договорённость в одно место.

---

## 2. Главный принцип

> Проект не ломается от изменений. Он ломается от того, что изменения не доходят до нужных людей вовремя.

Организатор не может держать в голове все последствия каждого решения. Система должна делать это за него.

---

## 3. Что является изменением

Change — это любая зафиксированная мутация состояния Project Graph, которая может повлиять на то, что видит или делает хотя бы один пользователь.

```text
Изменение времени Scene
Изменение локации
Изменение маршрута
Изменение состава участников
Изменение статуса Task / Workflow Stage / Lifecycle
Изменение документа
Изменение финансового статуса
Отмена или добавление узла графа
```

---

## 4. Что НЕ является изменением

```text
Просмотр объекта              → не изменение
Комментарий в чате             → Message, не Change
Черновик, не сохранённый как факт → не Change
Личная заметка пользователя    → Personal Task, не Change
```

Change — это факт, зафиксированный в графе, а не намерение или обсуждение.

---

## 5. Change ≠ Message

```text
Message:
«Давайте перенесём церемонию на 13:30»

Change:
Ceremony.starts_at: 13:00 → 13:30
```

Message может привести к Change, но само по себе изменением не является. Оно живёт в `24_Communication.md`.

---

## 6. Change ≠ Decision

`24_Communication.md` уже вводит `Decision` — зафиксированный человеческий выбор (`Made by, Timestamp, Affected`), хранящийся в `Decision Log`.

```text
Decision  → человеческий выбор, источник изменения
Change    → сама мутация графа, следствие Decision (или другого источника)
```

Не каждый Change имеет Decision в качестве источника — часть изменений происходит автоматически (см. §9) или как следствие внешних факторов (погода, задержка). Но каждый Decision, который меняет граф, порождает Change.

```text
Decision: "Переносим церемонию на 13:30"
      ↓
Change: Ceremony.starts_at 13:00 → 13:30
      ↓
Decision Log записывает Decision
Change History записывает Change
```

`Decision Log` и история Change — не дублирующие друг друга журналы. `Decision Log` фиксирует, кто и почему выбрал; история Change фиксирует, что именно и где изменилось в графе.

---

## 7. Change ≠ Task

```text
Change:
Ceremony 13:00 → 13:30

Task (возможное следствие):
"Обновить маршрут водителя"
```

Change описывает факт изменения состояния. Task описывает работу, которую нужно сделать в ответ. Не каждый Change порождает Task; не каждая Task является следствием Change.

---

## 8. Change ≠ Notification

Change — источник. Notification (`53_Notifications.md`) — один из возможных способов довести Change до пользователя.

```text
Change
 ↓
Affected Users
 ↓
Notification Policy
 ↓
Notification (может не быть, если приоритет слишком низкий)
```

Change фиксируется в графе независимо от того, был ли кто-то уведомлён.

---

## 9. Кто может создать Change

```text
User        → явное действие (перенос времени, редактирование поля)
System      → автоматический переход (Lifecycle transition, истечение срока)
Integration → внешняя система (погодный сервис, календарь)
AI          → только Proposed Change, требующий подтверждения человеком
```

AI никогда не создаёт Confirmed Change напрямую — это прямое продолжение `30_AI.md`, "AI Must Not Silently Apply Important Changes".

---

## 10. Объект Change

```text
Change
├── id
├── project_id
├── object_type        (Scene | Task | Document | Finance | Role | Lifecycle | ...)
├── object_id
├── field
├── before
├── after
├── source             (User | System | Integration | AI)
├── created_by
├── created_at
├── reason
├── decision_ref        (опционально, ссылка на Decision)
├── status
├── affected_nodes
├── affected_roles
├── affected_users
└── requires_confirmation
```

---

## 11. Жизненный цикл Change

Не всякий Change проходит все стадии — простой, малозначимый Change (например, обновление второстепенного поля) может сразу оказаться в `Applied`. Полная модель для значимых изменений:

```text
Detected
   ↓
Proposed
   ↓
Reviewed          (опционально)
   ↓
Confirmed
   ↓
Applied
   ↓
Propagated
   ↓
Acknowledged
```

---

## 12. Detected

Изменение реальности зафиксировано, но ещё не отражено в графе как решённый факт.

```text
Погодный сервис сообщает: дождь в 15:00
```

Это ещё не Change объекта Scene — это входной сигнал, который может привести к Proposed Change.

---

## 13. Proposed

Изменение предложено, но не подтверждено.

```text
Proposed Change:
Photo Session: outdoor → indoor
Reason: дождь ожидается в 15:00
Proposed by: AI / Organizer
```

Proposed Change не влияет на то, что видят другие пользователи, кроме того, кто должен его подтвердить.

---

## 14. Reviewed

Для части изменений требуется рассмотрение перед подтверждением — например, изменение, затрагивающее несколько ролей одновременно.

```text
Organizer просматривает:
Affected: Photographer, Driver, Coordinator
No impact detected for: Florist, DJ
```

Это соответствует паттерну Impact Analysis из `30_AI.md §21`.

---

## 15. Confirmed

Ответственный человек подтвердил изменение. С этого момента Change становится фактом графа.

```text
Confirmed by: Organizer
Confirmed at: 2026-08-09 14:02
```

Автоматические Change (§9, System) могут переходить из `Detected` сразу в `Confirmed`, минуя `Proposed`/`Reviewed`, если так сконфигурировано правилом и Change не относится к категории значимых (см. §21).

---

## 16. Applied

Изменение записано в граф. Затронутые узлы обновлены.

```text
Scene("Photo Session").location: "Park" → "Winter Garden"
```

С этого момента любой, кто читает объект, видит новое состояние.

---

## 17. Propagated

Определены Affected Nodes, Affected Roles, Affected Users; запущен конвейер уведомления (см. `53_Notifications.md §5`).

```text
Change → Graph → Affected Nodes → Affected Roles → Affected Users → Permission Check → Notification Policy → Notification
```

---

## 18. Acknowledged

Затронутый пользователь ознакомился с изменением. Для Critical Change это фиксируется явно (см. `53_Notifications.md §17`), для остальных приоритетов — достаточно факта прочтения.

```text
Photographer: Acknowledged at 14:05
Driver: не подтвердил → организатор видит открытый риск
```

---

## 19. Определение Affected Nodes

Affected Nodes определяются через граф связей, а не вручную.

```text
Change: Scene("Ceremony").starts_at изменилось
      ↓
Graph traversal по рёбрам ASSIGNED_TO, LOCATED_AT, PRECEDES, FOLLOWS
      ↓
Affected Nodes:
  Scene("Photo Session")   — FOLLOWS Ceremony
  Route("Church → Venue")  — LOCATED_AT Ceremony
  Vehicle("Car 1")         — ASSIGNED_TO Route
```

---

## 20. От Affected Nodes к Affected Roles и Affected Users

```text
Affected Nodes
      ↓
для каждого узла: кто ASSIGNED_TO / RESPONSIBLE_FOR / PARTICIPATES_IN
      ↓
Affected Roles: Photographer, Driver, Coordinator
      ↓
Affected Users: конкретные люди, назначенные на эти роли в этом проекте сейчас
```

Affected Roles — это функции. Affected Users — это конкретные люди в данный момент времени (важно для временных исполнителей: роль может быть назначена только сегодня).

---

## 21. Значимость изменения

Не каждый Change одинаково важен. Значимость определяет, требуется ли `Reviewed`/`Confirmed` явно, или Change может применяться сразу.

```text
Значимый Change:
  время Scene, локация, состав ключевых ролей, финансовый статус, отмена узла

Малозначимый Change:
  описание, второстепенная заметка, некритичное поле документа
```

Значимость конфигурируется на уровне `object_type` + `field`, а не решается индивидуально для каждого изменения.

---

## 22. Требуется ли подтверждение

```text
requires_confirmation = true, если:
  Change значим (§21)
  И источник — AI или Integration
  ИЛИ Change затрагивает более одной роли
  ИЛИ Change необратим в бизнес-смысле (например, отмена подрядчика)

requires_confirmation = false, если:
  Change малозначим
  И источник — User, действующий в рамках своих прав
```

---

## 23. No Silent Changes

Принцип, уже зафиксированный в `24_Communication.md`: обычное сообщение или AI-действие никогда не должно молча менять Timeline, бюджет, контракт, назначение или данные клиента без подтверждения.

```text
Плохо:
AI читает сообщение "перенесём на 13:30" и сразу меняет Scene

Хорошо:
AI создаёт Proposed Change → Organizer подтверждает → Change становится Confirmed
```

---

## 24. Plan vs Reality

Как зафиксировано в `41_Design_Principles.md §32–33`, система никогда не должна скрывать разницу между планом и фактом.

```text
Planned:  13:00
Current:  13:30
Reason:   Traffic
```

Change хранит обе стороны (`before`/`after`) именно для того, чтобы эта разница всегда была доступна, а не заменялась одним значением.

---

## 25. Несколько изменений подряд

Изменения могут приходить пачкой, особенно во время активного мероприятия.

```text
14:00  Ceremony delayed 30 min
14:02  Photo Session delayed 30 min (следствие)
14:05  Route delayed 30 min (следствие)
```

Система должна группировать связанные Change в единую цепочку (`caused_by` ссылка на исходный Change), а не показывать пользователю три независимых уведомления об одном и том же событии.

---

## 26. Каскадные изменения

```text
Change A: Ceremony.starts_at 13:00 → 13:30
      ↓ (caused_by A)
Change B: Photo Session.starts_at 14:00 → 14:30
      ↓ (caused_by B)
Change C: Route.departure_time 14:30 → 15:00
```

Affected Users получают одно консолидированное сообщение о цепочке, а не серию разрозненных.

```text
Navigator (для фотографа):
"Церемония перенесена на 13:30. Ваша фотосессия автоматически сдвинута на 14:30."
```

---

## 27. Конфликтующие изменения

Два изменения конфликтуют, если они одновременно затрагивают один и тот же объект несовместимым образом.

```text
Change A: Photo Session location → Park
Change B: Photo Session location → Winter Garden
(оба Proposed, не подтверждены)
```

```text
Conflict detected
      ↓
Оба Change показываются ответственному за подтверждение
      ↓
Только один может стать Confirmed
      ↓
Второй переходит в Rejected с указанием причины (конфликт с Change A)
```

Система не должна автоматически выбирать "победителя" без участия человека, если оба изменения значимы (§21).

---

## 28. Откат изменения

Change может быть отменён после применения.

```text
Change (Applied)
      ↓
Rollback Change (новый Change, before/after поменяны местами)
```

Откат — это новый Change, а не удаление старого. История никогда не переписывается (`03_Principles.md`, "Everything Has History").

```text
Change #142: Location Park → Winter Garden   (Applied, 14:00)
Change #148: Location Winter Garden → Park   (Applied, 14:20, rollback_of: #142)
```

---

## 29. История изменений

Каждый Change хранится бессрочно (согласно политике хранения организации) и доступен для просмотра согласно правам.

```text
Change History (Scene: Photo Session)
14:00  location: Park → Winter Garden       (reason: дождь)
14:20  location: Winter Garden → Park       (reason: дождь прекратился, rollback_of #142)
```

---

## 30. Change и Timeline

Изменения, затрагивающие время или место Scene, отображаются в Changes Layer Timeline (`13_Timeline_Canvas.md`): `✓ Planned`, `⚠ Changed`, `✕ Cancelled`, `+ Added`.

```text
Scene("Photo Session")
  ⚠ Changed: 14:00 → 14:30
```

Timeline показывает факт изменения. История Change (§29) хранит его полную структуру.

---

## 31. Change и Context Engine

Текущие непризнанные (не Acknowledged) Change — один из входов формулы Context Engine.

```text
Context = f(..., Changes)
```

```text
Организатор открывает проект:
Context Engine приоритизирует непризнанные Critical Change выше рутинного статуса
```

---

## 32. Change и Navigator

Navigator — основная поверхность, где пользователь узнаёт об изменении в контексте своей текущей задачи, а не в отдельном журнале.

```text
Navigator (для фотографа, режим Changes, см. 14_Navigator.md):
"Изменилось: фотосессия перенесена на 14:30, новая точка — зимний сад."
```

---

## 33. Change и Permissions

Видимость самого факта Change подчиняется той же модели прав, что и объект, к которому он относится.

```text
Change к Task, доступной только команде постпродакшна
 → виден только участникам этой команды и организатору
```

Change не создаёт отдельный, более широкий уровень видимости, чем у объекта, который он меняет.

---

## 34. Change и клиент

Клиент видит только те Change, которые явно помечены как видимые клиенту.

```text
Change: внутреннее перераспределение ролей между ассистентами фотографа
 → клиенту не показывается

Change: дата мероприятия перенесена
 → клиенту показывается
```

---

## 35. Change и однодневные пользователи

Временный участник видит только Change, произошедшие в период его доступа и относящиеся к его роли.

```text
Driver (доступ на день мероприятия)
 → видит: изменения маршрута, времени, связанные с его назначением
 → не видит: историю изменений проекта до его подключения
```

Ему не нужно "прочитать всю историю проекта" — это прямое воплощение критерия качества: подрядчик, подключившийся за два дня до мероприятия, должен понять свою ситуацию за 30 секунд.

---

## 36. События Change

```text
ChangeDetected
ChangeProposed
ChangeReviewed
ChangeConfirmed
ChangeApplied
ChangePropagated
ChangeAcknowledged
ChangeRejected
ChangeRolledBack
```

---

## 37. Пример полной цепочки

```text
Погода: дождь ожидается в 15:00        (Detected)
      ↓
AI: предлагает перенести фотосессию в помещение   (Proposed)
      ↓
Organizer: рассматривает Affected — Photographer, Driver   (Reviewed)
      ↓
Organizer: подтверждает                (Confirmed)
      ↓
Scene("Photo Session").location обновлена   (Applied)
      ↓
Affected Roles → Affected Users определены   (Propagated)
      ↓
Notification Policy: Critical для Photographer и Driver, Low для остальных
      ↓
Photographer открывает Navigator:
"Фотосессия перенесена на 15:30. Новая точка — зимний сад."   (Acknowledged)

Driver открывает Navigator:
"После ЗАГСа везёшь пару не в парк, а в зимний сад."           (Acknowledged)

Organizer видит:
"Из-за дождя изменён маршрут и фотосессия. Затронуты: Photographer, Driver."
```

---

## 38. MVP

Минимальная реализация должна поддерживать:

1. `Change` как объект с полями из §10.
2. Упрощённый жизненный цикл: `Proposed → Confirmed → Applied → Propagated → Acknowledged` (без обязательного `Reviewed` на старте).
3. Вычисление Affected Nodes через существующие рёбра графа.
4. Вычисление Affected Roles → Affected Users.
5. Разделение значимых и малозначимых изменений (§21).
6. Rollback как новый Change.
7. Историю изменений на уровне объекта и проекта.
8. Отображение Change в Timeline Changes Layer и в Navigator.

---

## 39. Поздние возможности

```text
Автоматическое обнаружение конфликтующих изменений в реальном времени
Каскадный пересчёт зависимых Change с предпросмотром до подтверждения
AI-объяснение цепочки Change простым языком для конкретной роли
Аналитика по частоте и источникам изменений в проекте
Групповые Change (пакетное подтверждение нескольких связанных изменений сразу)
```

---

## 40. Итоговое утверждение

> **Change — это не журнал правок и не техническая деталь синхронизации данных. Это механизм, который превращает изменение реальности в персональный, минимально необходимый контекст для каждого затронутого человека — и именно поэтому организатор может вести десять свадеб одновременно, не удерживая все изменения в голове.**

```
```
