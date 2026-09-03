# 53_Notifications.md

````markdown
# Notifications

**Document:** `53_Notifications.md`
**Version:** `0.1.0`
**Status:** Draft
**Depends on:**

* `11_Graph_Model.md`
* `12_Context_Engine.md`
* `14_Navigator.md`
* `21_Projects.md`
* `22_Roles.md`
* `23_Permissions.md`
* `24_Communication.md`
* `52_Tasks.md`

---

## 1. Назначение

Notifications — отдельный компонент архитектуры, уже упомянутый (но не формализованный) в нескольких документах:

```text
10_Architecture.md    → Notifications как отдельный домен платформы
11_Graph_Model.md     → Notification Graph
14_Navigator.md       → Notification System как отдельный компонент, доставляющий критические изменения
21_Projects.md        → Project Events vs Notifications
23_Permissions.md     → Notification Permission как отдельный слой
24_Communication.md   → System Message ≠ Notification
```

Этот документ собирает эти фрагменты в единую модель.

---

## 2. Главный принцип

> Уведомление не означает «в системе что-то произошло». Оно означает «это касается тебя».

Это прямое продолжение принципа из `14_Navigator.md §16`: Notification отвечает на вопрос "что изменилось", Navigator — на вопрос "что это значит для тебя сейчас".

---

## 3. Notification ≠ Message ≠ System Message ≠ Change

Как зафиксировано в `24_Communication.md §26`:

```text
System Message  → записывается в коммуникационный контекст
Notification    → доставляет информацию пользователю
```

Один System Event может привести к:

```text
Chat Message
+
Push Notification
+
Timeline Update
```

или только к одному из них. Notification — это механизм доставки, а не первичное событие.

---

## 4. Источник Notification

Notification никогда не создаётся сама по себе. Она всегда является следствием другого объекта:

```text
Change            (54_Changes.md)
Decision          (24_Communication.md)
Task event        (52_Tasks.md)
Workflow event    (51_Workflow.md)
Lifecycle transition (50_Event_Lifecycle.md)
System condition  (например: Overdue, Blocked)
```

---

## 5. Канонический конвейер

Единая цепочка, уже используемая (в разных формулировках) в `11_Graph_Model.md`, `21_Projects.md`, `24_Communication.md`, `25_Documents.md`:

```text
Change / Event
      ↓
Graph Update
      ↓
Affected Nodes
      ↓
Affected Roles
      ↓
Affected Users
      ↓
Permission Check
      ↓
Notification Policy
      ↓
Notification
```

Этот документ формализует последние два шага: `Notification Policy` и `Notification`.

---

## 6. Permission ≠ Notification Policy

Как явно указано в `23_Permissions.md §44`:

```text
READ_TIMELINE = true
```

не означает

```text
NOTIFY_ON_EVERY_TIMELINE_CHANGE = true
```

Permission определяет, что пользователь МОЖЕТ увидеть. Notification Policy определяет, что ему АКТИВНО сообщат.

---

## 7. Notification Policy

```text
NotificationPolicy
├── id
├── organization_id / project_id
├── role
├── event_type
├── delivery_channels     (Push | In-App | Navigator Only | Email | None)
├── priority_threshold
└── quiet_hours
```

Policy отвечает на вопрос: для данной роли, для данного типа события — нужно ли вообще уведомление, и если да, то как оно доставляется.

---

## 8. Notification как объект

```text
Notification
├── id
├── project_id
├── source_type      (Change | Decision | Task | Workflow | Lifecycle | System)
├── source_id
├── recipient_id
├── priority
├── title
├── summary
├── created_at
├── delivered_at
├── read_at
├── acknowledged_at
└── requires_ack
```

---

## 9. Приоритеты

По платформе встречаются разные словари приоритета (`Critical/High/Normal/Low/Hidden` в Context Engine, `Critical/High/Normal/Informational` в Postproduction, `NORMAL/IMPORTANT/URGENT` в Communication). Этот документ фиксирует единый канонический словарь для Notification:

```text
Critical
High
Normal
Low
```

Существующие локальные обозначения в других документах трактуются как более ранние формулировки того же принципа и не противоречат этому словарю.

---

## 10. Critical

Требует немедленного внимания, обычно во время активного мероприятия.

```text
Ceremony перенесена на 30 минут раньше
Оборудование не доставлено
Ключевой подрядчик не отвечает
```

Всегда доставляется push-уведомлением, независимо от общих настроек пользователя.

---

## 11. High

Важно, но не требует немедленной реакции в моменте.

```text
Клиент запросил изменение в галерее
Подрядчик подтвердил участие
```

---

## 12. Normal

Стандартное информационное обновление.

```text
Task завершена
Документ обновлён
```

Обычно достаточно отображения в Navigator / истории, без push.

---

## 13. Low

Информация, полезная для истории, но не требующая отдельного внимания.

```text
Комментарий добавлен в Task Discussion
Второстепенный статус изменился
```

Не доставляется push. Доступна в истории и в Timeline Changes Layer (`13_Timeline_Canvas.md`).

---

## 14. Каналы доставки

```text
Push Notification
In-App Notification
Navigator Update (без отдельного пуша)
Timeline Changes Layer
Email (опционально, для клиентов и внешних сторон)
```

Не каждое уведомление требует push. Часть событий достаточно отразить только на Timeline или в Navigator (`14_Navigator.md §16`).

---

## 15. Что требует push, что — только Navigator

```text
Push:
Critical, всегда
High, если затрагивает пользователя напрямую и требует действия

Navigator only:
Normal — отображается как обновлённый контекст при следующем открытии

Timeline / History only:
Low — доступно при просмотре, не прерывает пользователя
```

---

## 16. Роль определяет чувствительность

Одно и то же событие может иметь разный приоритет для разных ролей (`22_Roles.md §42`).

```text
Change: Ceremony 13:00 → 13:30

Photographer  → Critical (влияет на съёмку)
Driver        → Critical (влияет на маршрут)
Florist       → Low (уже всё расставлено, не требует действия)
Client        → Normal (информативно)
```

---

## 17. Acknowledgement

Для Critical и части High уведомлений недостаточно факта доставки — нужно подтверждение получения.

```text
Notification.requires_ack = true
 ↓
Delivered
 ↓
Read
 ↓
Acknowledged
```

Пока Critical Notification не подтверждена затронутой ролью, организатор должен видеть это как открытый риск.

---

## 18. Escalation

Если Critical Notification не подтверждена в течение установленного времени, система может эскалировать:

```text
Driver не подтвердил изменение маршрута за 10 минут
 ↓
Организатор получает Escalation Notification:
"Driver не подтвердил изменение маршрута"
```

Эскалация — это отдельное Notification, а не изменение исходного.

---

## 19. Notification Fatigue

Named anti-pattern, уже введённый в `14_Navigator.md §17`, `24_Communication.md §67`, `26_Postproduction.md §69–70`. Этот документ фиксирует конкретные правила против него:

```text
Правило 1: Normal и Low события никогда не доставляются push.
Правило 2: Однотипные события за короткий период группируются в одно уведомление.
Правило 3: Роль, для которой событие не релевантно, не получает уведомление вовсе — не "тихую" версию, а никакую.
Правило 4: Пользователь не может быть уведомлён дважды об одном Change через разные каналы без явной необходимости.
```

---

## 20. Батчинг

```text
5 отдельных Task завершены в течение 10 минут
 ↓
Одно уведомление:
"5 задач завершено"
```

Батчинг применяется только к Normal/Low приоритету. Critical никогда не батчится и не задерживается.

---

## 21. Quiet Hours

```text
NotificationPolicy.quiet_hours = 23:00–08:00
```

Critical всё равно доставляется. High/Normal — откладываются до окончания quiet hours, если явно не помечены как срочные пользователем/ролью.

---

## 22. Клиент как получатель

Клиент получает существенно более узкий набор уведомлений, чем внутренняя команда (`24_Communication.md`, "Client is isolated").

```text
Client получает:
Подтверждение бронирования
Ключевые даты
Готовность галереи
Запрос на согласование

Client НЕ получает:
Внутренние операционные изменения
Изменения между подрядчиками, не влияющие на него напрямую
```

---

## 23. Однодневные пользователи

Временный участник должен получать уведомления только по своей зоне ответственности, ограниченной сроком доступа (`23_Permissions.md`, `TemporaryAccess`).

```text
Driver (доступ только на день мероприятия)
 → уведомления начинаются при активации доступа
 → уведомления прекращаются при истечении доступа
```

---

## 24. Notification и Navigator

Notification является триггером обновления Navigator, но не заменяет его.

```text
Notification: "Ceremony перенесена на 13:30"
      ↓
Navigator (при следующем открытии приложения):
"Церемония начнётся в 13:30 (было 13:00). Следующий шаг: подготовка к 13:15."
```

Notification сообщает о факте. Navigator объясняет, что делать дальше.

---

## 25. Notification и история

Каждое Notification сохраняется в истории проекта независимо от того, было ли оно прочитано.

```text
Notification History
├── Все уведомления пользователя
├── Все уведомления по проекту (для организатора, согласно правам)
└── Статус: Delivered / Read / Acknowledged
```

---

## 26. Кто может инициировать Notification

```text
System  → автоматически, из Change / Task / Workflow / Lifecycle событий
User    → явно, например organizer отправляет ручное объявление
AI      → только предложение уведомления, требующее подтверждения
```

AI не может самостоятельно решить разослать критическое уведомление всем участникам без правила или подтверждения человека (`30_AI.md`).

---

## 27. Ручные уведомления (Announcement)

```text
Announcement
├── created_by
├── project_id / scope
├── priority
├── message
└── target_roles
```

Ручное объявление организатора проходит тот же конвейер Affected Roles → Affected Users → Permission Check, что и системное уведомление.

---

## 28. События Notification

```text
NotificationCreated
NotificationDelivered
NotificationRead
NotificationAcknowledged
NotificationEscalated
NotificationBatched
```

---

## 29. MVP

Минимальная реализация должна поддерживать:

1. `Notification` как объект с полями из §8.
2. Четыре уровня приоритета (§9).
3. Разделение Permission и Notification Policy (§6–7).
4. Push только для Critical/High.
5. Acknowledgement для Critical.
6. Ролевую чувствительность одного события (§16).
7. Историю уведомлений на уровне пользователя и проекта.

---

## 30. Поздние возможности

```text
Настраиваемые пользователем Notification Policy (в рамках разрешённого организацией)
Умный батчинг на основе поведения пользователя
Эскалационные цепочки с несколькими уровнями
AI-суммаризация пропущенных уведомлений ("Catch-up", 24_Communication.md)
Аналитика по времени реакции на Critical Notification
```

---

## 31. Итоговое утверждение

> **Notification — не журнал событий и не поток шума. Это последний, самый узкий фильтр в конвейере Change → Affected Users, отвечающий не на вопрос "что произошло в системе", а на вопрос "что из этого действительно должно прервать конкретного человека прямо сейчас".**

```
```
