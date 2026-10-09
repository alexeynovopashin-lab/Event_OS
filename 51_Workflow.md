# 51_Workflow.md

````markdown
# Workflow

**Document:** `51_Workflow.md`
**Version:** `0.1.0`
**Status:** Draft
**Depends on:**

* `11_Graph_Model.md`
* `12_Context_Engine.md`
* `13_Timeline_Canvas.md`
* `21_Projects.md`
* `26_Postproduction.md`
* `50_Event_Lifecycle.md`

---

## 1. Назначение

Workflow описывает, как конкретная роль выполняет свою работу внутри одной стадии Project Lifecycle.

`26_Postproduction.md` уже вводит понятие Workflow как графа стадий постпродакшна (`Workflow Templates`, `Workflow Graph`). Этот документ обобщает то же понятие на весь Project, а не только на постпродакшн.

```text
Event Lifecycle (50) → крупные стадии всего проекта
Workflow (51)         → детальные шаги роли внутри стадии
Tasks (52)             → отдельные единицы работы внутри шага Workflow
```

---

## 2. Главный принцип

> Проект не является Kanban-доской с одинаковыми колонками для всех. Это набор разных, параллельных путей работы, объединённых одним Project Graph.

Как уже зафиксировано в `21_Projects.md §17`: основная модель — Graph + Timeline + Context, а не Backlog + Sprint + Task Board.

---

## 3. Workflow как граф, а не список

```text
Workflow
├── id
├── name
├── applies_to_role
├── stages
├── transitions
└── project_type
```

Каждая стадия Workflow — узел графа. Переход между стадиями — рёбра `PRECEDES` / `DEPENDS_ON` (см. `11_Graph_Model.md`).

---

## 4. Пример: Workflow фотографа

```text
Order
 ↓
Planning
 ↓
Preparation
 ↓
Event
 ↓
File Transfer
 ↓
Postproduction    (детализирован отдельно в 26_Postproduction.md)
 ↓
Client Communication
 ↓
Additional Services
 ↓
Completion
```

---

## 5. Пример: Workflow водителя

```text
Assignment
 ↓
Pickup
 ↓
Transfer
 ↓
Drop-off
 ↓
Complete
```

Короткий Workflow — не упрощённая версия длинного. Это полноценный, самостоятельный путь, соответствующий реальной работе роли.

---

## 6. Пример: Workflow ведущего

```text
Assignment
 ↓
Script Preparation
 ↓
Coordination with Vendors
 ↓
Event
 ↓
Completion
```

---

## 7. Пример: Workflow декоратора / флориста

```text
Order
 ↓
Concept
 ↓
Client Approval
 ↓
Procurement
 ↓
Setup
 ↓
Event
 ↓
Teardown
 ↓
Completion
```

---

## 8. Разные Workflow — одна архитектура

Система не должна проектировать отдельный интерфейс под каждую роль. Все Workflow используют одну и ту же модель узлов и переходов графа.

```text
WorkflowStage
├── id
├── workflow_id
├── name
├── status
├── depends_on
├── assignee_role
└── project_id
```

---

## 9. Статусы стадии Workflow

Переиспользуется словарь из `26_Postproduction.md §9`, как единый платформенный стандарт:

```text
Waiting
Ready
In Progress
Blocked
Review
Approved
Completed
Cancelled
```

Не вводится отдельный набор статусов для Workflow — Job (Postproduction) является частным случаем WorkflowStage с более узкой специализацией.

---

## 10. Workflow Templates

Организация может создавать шаблоны Workflow для типов ролей или типов проектов.

```text
WorkflowTemplate
├── id
├── organization_id
├── name
├── role
├── project_type
└── stages
```

Пример: у организации есть свой стандартный Workflow для "Wedding Photographer", отличный от дефолтного платформенного.

---

## 11. Workflow не обязателен

Исполнитель, работающий в одиночку, может использовать минимальный Workflow из двух-трёх стадий.

```text
Order → Event → Delivery
```

Система не должна навязывать детальный многостадийный процесс тем, кому он не нужен.

---

## 12. Workflow и Roles

Каждая стадия Workflow привязана к роли (`22_Roles.md`), а не к конкретному человеку.

```text
Retouch Stage
 → assignee_role: Retoucher
 → фактический assignee определяется через Assignment (см. §16)
```

---

## 13. Workflow и Permissions

Доступ к просмотру и изменению стадии Workflow подчиняется той же иерархии, что описана в `23_Permissions.md`.

```text
Global → Organization → Project → Team → Role → Object (WorkflowStage)
```

Workflow не создаёт собственную систему прав.

---

## 14. Workflow и Timeline

Стадии Workflow, привязанные к конкретному времени (например, `Pickup` для водителя), отображаются на Timeline как Scene или как атрибуты Scene.

Стадии, не привязанные к конкретному времени (например, `Client Communication` после Delivery), существуют вне Timeline, но остаются частью графа проекта.

```text
Timeline: то, что происходит в конкретный момент
Workflow: то, что происходит в конкретном порядке
```

Не каждая стадия Workflow — Scene. Не каждая Scene — стадия чьего-то Workflow.

---

## 15. Зависимости между стадиями

```text
Retouch depends_on Color
Delivery depends_on QA
```

Если зависимость не выполнена, стадия остаётся в статусе `Waiting` (см. `26_Postproduction.md §20`).

---

## 16. Assignment

Стадия Workflow может быть назначена:

```text
User
Team
Role
```

```text
Retouch Stage
 ↓
Retouch Team
 ↓
Available Retoucher
```

Правила назначения и переназначения идентичны описанным в `26_Postproduction.md §30–31`.

---

## 17. Параллельные Workflow одной роли

Одна роль может одновременно вести несколько Workflow в разных проектах.

```text
Photographer
 ├── Wedding Smith    → stage: Production
 ├── Wedding Ivanov   → stage: Preparation
 └── Portrait Petrov  → stage: Delivery
```

Navigator показывает не все Workflow сразу, а следующий релевантный шаг (см. `14_Navigator.md`).

---

## 18. Взаимодействие нескольких ролей в одном Workflow

Workflow может передавать работу от одной роли к другой.

```text
Decorator: Setup
 ↓
Photographer: Event
 ↓
Driver: Transfer
```

Каждая передача — точка перехода ответственности (Handoff), формализованная так же, как в `26_Postproduction.md §18–19`.

---

## 19. Handoff между Workflow

```text
Handoff
├── from_role
├── to_role
├── from_stage
├── to_stage
├── payload        (Job, Input, Instructions, Deadline, References)
└── timestamp
```

Получатель не должен искать контекст вручную — он приходит вместе с Handoff.

---

## 20. Workflow и Event Lifecycle

Каждая стадия Workflow принадлежит одной или нескольким стадиям Project Lifecycle (`50_Event_Lifecycle.md`).

```text
Photographer Workflow
 Order            → Lifecycle: Lead / Planning
 Planning         → Lifecycle: Planning
 Preparation      → Lifecycle: Preparation
 Event            → Lifecycle: Event
 File Transfer    → Lifecycle: Event / Production
 Postproduction   → Lifecycle: Production
 Delivery         → Lifecycle: Delivery
 Completion       → Lifecycle: Completed
```

Это связывает крупный жизненный цикл проекта с детальной работой конкретной роли.

---

## 21. Условные ветки Workflow

Некоторые стадии появляются только при определённых условиях, как в `26_Postproduction.md §22`.

```text
Delivery
 ├── Gallery
 └── Album (только если заказан)
       ↓
   Album Design
       ↓
   Client Approval
       ↓
   Print
```

---

## 22. Относительные сроки

Стадии Workflow могут иметь сроки, вычисляемые относительно других дат, а не заданные вручную:

```text
Setup Deadline = Event Start - 3 hours
Teardown Deadline = Event End + 2 hours
Retouch Deadline = Gallery Delivery - 3 days
```

Изменение опорной даты пересчитывает зависимые сроки (см. `26_Postproduction.md §26–27`).

---

## 23. Workload и Availability

Переиспользуются модели из `26_Postproduction.md §28–29` без изменений:

```text
Assigned Stages
Estimated Work
Deadlines
Current Load
```

```text
Available
Busy
Unavailable
Vacation
```

### Карта часов (Алексей, 09.10.2026)

Решение Алексея: **лёгкая необязательная карта часов, без Scrum.** Это продолжение
Workload, а не отдельная подсистема.

```text
Planned hours → берутся из гвоздиков (длительность) и ролей, ручной ввод не нужен
Actual hours  → вносит сам человек, если хочет; без внесения карта работает по плану
Rollup        → часы вложенных элементов суммируются в оболочку (матрёшка, BRIDGE_LIGHT_PLAN §12)
```

Пример: свадьба «Иванов, 14 июня» — ЗАГС 2 ч и съёмка 6 ч дают плановые часы
фотографа; факт он вносит сам.

Границы:

* карта необязательна и не условие работы проекта (по образцу `27_Finance.md §2`);
* Scrum (бэклог, спринты, Story Points) не добавляется: `21_Projects.md §17`;
* это не учёт рабочего времени сотрудников и не ERP (`00_North_Star.md`).

**Открыто (не решено, не додумывать):**

* ~~кто видит часы~~ **решено (Алексей, 09.10): «Сам и организатор»** — человек видит
  свои часы, организатор видит часы всех на своём событии; сводка по всем событиям
  агентства целиком не входит;
* ~~нужна ли ставка за час~~ **решено (Алексей, 09.10): «Да, ставка за час нужна»**:
  «Почасово работают многие специалисты, от водителя до фотографа». Остаётся
  открытым: кто задаёт ставку и кто её видит, как часы связаны с суммами в
  `27_Finance.md` (План/Факт), единая ставка на человека или своя на роль/событие;
* как соотносится с учётом платных событий платформы: это разные вещи (деньги платформы
  и часы людей), смешивать нельзя.

---

## 24. Отклонения от Workflow

Workflow — ожидаемый путь, а не жёсткий контракт. Реальность может отличаться.

```text
Planned:  Setup → Event → Teardown
Actual:   Setup → Delay → Event → Teardown
```

Отклонение фиксируется как Change (`54_Changes.md`), а не как поломка Workflow.

---

## 25. Workflow не диктует бизнес-логику

Как и Timeline (`13_Timeline_Canvas.md §…`, "Timeline Does Not Own Business Logic"), Workflow не владеет разрешениями, финансами или уведомлениями.

```text
Workflow Stage меняет статус
 ↓
Change создаётся
 ↓
Permissions проверяются отдельно
 ↓
Notification Policy решает, кого уведомить
```

---

## 26. Контекст для каждой роли

Context Engine показывает только релевантную часть Workflow.

### Фотограф

```text
Текущая стадия
Следующая стадия
Заблокированные зависимости
```

### Организатор

```text
Агрегированное состояние всех Workflow всех ролей проекта
```

### Клиент

```text
Только стадии, видимые клиенту (например: Preparation, Event, Delivery)
```

---

## 27. События Workflow

```text
WorkflowStageCreated
WorkflowStageAssigned
WorkflowStageStarted
WorkflowStageBlocked
WorkflowStageUnblocked
WorkflowStageSubmitted
WorkflowStageApproved
WorkflowStageRejected
WorkflowStageCompleted
WorkflowHandoffCreated
```

---

## 28. Workflow и Tasks

Внутри одной стадии Workflow может существовать несколько конкретных Task (см. `52_Tasks.md`).

```text
Workflow Stage: Setup
 ├── Task: Привезти оборудование
 ├── Task: Расставить стулья
 └── Task: Проверить свет
```

Workflow описывает крупные, именованные этапы процесса. Task — минимальную единицу конкретной работы внутри этапа.

---

## 29. MVP

Минимальная реализация должна поддерживать:

1. `WorkflowTemplate` для нескольких ролей (Photographer, Driver, минимум).
2. `WorkflowStage` со статусами из §9.
3. Зависимости между стадиями (`depends_on`).
4. Assignment на User / Team / Role.
5. Связь стадии Workflow с Project Lifecycle.
6. Ролевую проекцию Workflow в Navigator (следующий шаг, не весь граф).

---

## 30. Поздние возможности

```text
Визуальный конструктор Workflow Templates
Библиотека готовых шаблонов по типу мероприятия
Автоматическое обнаружение отклонений от Workflow
AI-рекомендации по назначению исполнителей на стадию
Аналитика длительности стадий по организации
```

---

## 31. Итоговое утверждение

> **Workflow — не доска задач и не единый процесс для всех. Это набор разных, признанных системой путей работы, каждый из которых принадлежит своей роли, вложен в общий жизненный цикл проекта и связан с остальными через один и тот же Project Graph.**

```
```
