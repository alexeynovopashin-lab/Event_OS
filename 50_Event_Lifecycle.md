# 50_Event_Lifecycle.md

````markdown
# Event Lifecycle

**Document:** `50_Event_Lifecycle.md`
**Version:** `0.1.0`
**Status:** Draft
**Depends on:**

* `10_Architecture.md`
* `11_Graph_Model.md`
* `12_Context_Engine.md`
* `13_Timeline_Canvas.md`
* `20_Workspaces.md`
* `21_Projects.md`
* `26_Postproduction.md`

---

## 1. Назначение

Event Lifecycle описывает полный путь Project от первого контакта с клиентом до завершения работы.

Это не отдельная новая модель. Это связующий документ, который собирает вместе стадии, уже упомянутые в других документах:

```text
21_Projects.md      → Lead → Planning → Confirmed → Preparation → Event → Production → Delivery → Completed → Archived
11_Graph_Model.md   → Created → Planned → Confirmed → In Progress → Completed → Archived
13_Timeline_Canvas.md → Planned → Confirmed → Approaching → Active → Completed → Archived
26_Postproduction.md → Event Completed → Production Completed → Delivery Completed → Commercially Completed → Archived
```

Задача этого документа — не изобрести новую последовательность, а объяснить, как эти вложенные жизненные циклы соотносятся друг с другом.

---

## 2. Главный принцип

> Мероприятие заканчивается в одной точке времени. Проект заканчивается тогда, когда завершены все его независимые ветки.

Organizer не должен думать в терминах одного глобального статуса. Он должен видеть несколько параллельных треков, каждый со своим состоянием.

---

## 3. Три уровня жизненного цикла

```text
Level 1 — Engagement Lifecycle
(отношения с клиентом: от лида до окончания сотрудничества)

Level 2 — Project Lifecycle
(конкретный заказ: от планирования до архива)

Level 3 — Event Lifecycle
(само мероприятие: от начала дня до его конца)
```

Каждый уровень имеет собственное состояние и собственную скорость изменения.

---

## 4. Engagement Lifecycle

```text
Lead
 ↓
Qualified
 ↓
Client
 ↓
Active Project(s)
 ↓
Past Client
 ↓
Repeat Client (опционально)
```

Engagement — это не Project. Один Client может иметь несколько Project в течение времени (свадьба, а через год — корпоратив компании супруга).

---

## 5. Project Lifecycle (базовый, из 21_Projects.md)

```text
Lead
 ↓
Planning
 ↓
Confirmed
 ↓
Preparation
 ↓
Event
 ↓
Production
 ↓
Delivery
 ↓
Completed
 ↓
Archived
```

Этот документ не изменяет данную последовательность. Он уточняет, что каждая стадия может состоять из нескольких параллельных подпроцессов.

---

## 6. Event Lifecycle (само мероприятие)

Внутри стадии `Event` Project Lifecycle разворачивается собственный, более короткий цикл:

```text
Upcoming
 ↓
Approaching
 ↓
Active
 ↓
Wrapping Up
 ↓
Event Completed
```

Это соответствует состояниям Scene из `13_Timeline_Canvas.md`, но применяется к мероприятию в целом, а не к отдельной сцене.

---

## 7. Upcoming

Мероприятие подтверждено, но ещё далеко по времени.

```text
Timeline: Draft / Confirmed
Context Priority: Normal
```

---

## 8. Approaching

Мероприятие приближается. Начинается более плотная подготовка.

```text
Финальные подтверждения
Логистика
Погода становится релевантной
Финальный briefing участников
```

Точный порог перехода (`72 часа`, `24 часа`) определяется на уровне конфигурации, не архитектуры.

---

## 9. Active

Мероприятие идёт прямо сейчас.

```text
Timeline: Active
Navigator: Current / Approaching states активны
Context Priority: Critical для затронутых ролей
```

Это единственная стадия, где Navigator работает в режиме реального времени.

---

## 10. Wrapping Up

Основная программа завершена, но часть участников ещё занята (демонтаж, выезд, передача оборудования).

```text
Ceremony → Completed
Reception → Completed
Load-out → In Progress
```

---

## 11. Event Completed

Физическое мероприятие завершено для всех участников на площадке.

```text
Event Completed ≠ Project Completed
```

Это утверждение уже зафиксировано в `26_Postproduction.md` и остаётся в силе.

---

## 12. Параллельные треки после Event Completed

После завершения мероприятия Project не переходит в единое состояние. Он распадается на независимые треки:

```text
Event Completed
      │
      ├── Production Track     (см. 26_Postproduction.md)
      ├── Delivery Track       (см. 26_Postproduction.md)
      ├── Financial Track      (см. 27_Finance.md)
      ├── Legal / Contract Track
      └── Feedback Track
```

Каждый трек имеет собственное состояние и собственный владелец.

---

## 13. Множественные состояния завершения

Повторяя принцип из `26_Postproduction.md §58`:

```text
Event Completed
Production Completed
Delivery Completed
Financially Completed
Commercially Completed
Archived
```

Project не должен сводиться к одному boolean `completed = true`. Каждый трек завершается независимо и в своём темпе.

---

## 14. Project Completed

Project считается завершённым только тогда, когда завершены все обязательные треки для данного типа проекта.

```text
Wedding Photography Project
 ├── Event Completed         ✓
 ├── Production Completed    ✓
 ├── Delivery Completed      ✓
 ├── Financially Completed   ✓
 └── Project Completed       ✓
```

Опциональные треки (например Photo Book) не блокируют переход в `Completed`, если они явно помечены как опциональные.

---

## 15. Не каждый Project проходит все стадии

```text
Corporate Conference
 ├── Lead
 ├── Planning
 ├── Confirmed
 ├── Preparation
 ├── Event
 ├── Delivery (отчёт, фотоотчёт)
 └── Completed
```

Стадия `Production` может отсутствовать, если проект не предполагает постпродакшн.

Архитектура должна позволять пропускать необязательные стадии, а не эмулировать их пустыми состояниями.

---

## 16. Модель для разных типов мероприятий

```text
Wedding        → Lead → Planning → Confirmed → Preparation → Event → Production → Delivery → Completed
Corporate      → Lead → Planning → Confirmed → Preparation → Event → Delivery → Completed
Concert        → Lead → Planning → Confirmed → Preparation → Event → Completed
Conference     → Lead → Planning → Confirmed → Preparation → Event → Delivery → Completed
Private Event  → Lead → Planning → Confirmed → Preparation → Event → Completed
```

Общая структура одна. Набор активных стадий определяется типом Project.

---

## 17. Project Type как конфигурация, а не новая модель

```text
ProjectType
├── id
├── name
├── enabled_stages
├── default_workflow_template   (см. 51_Workflow.md)
├── required_tracks
└── optional_tracks
```

`ProjectType` не создаёт новую архитектуру жизненного цикла — он лишь включает или отключает уже существующие стадии и треки.

---

## 18. Lifecycle и Graph

Каждая стадия Project Lifecycle является состоянием корневого узла `Event` (или `Project`) в графе, а не отдельной сущностью.

```text
Project (Node)
 └── state: Planning | Confirmed | Preparation | Event | Production | Delivery | Completed | Archived
```

Переход состояния — это `Change` (см. `54_Changes.md`), затрагивающий affected roles точно так же, как любое другое изменение в графе.

---

## 19. Lifecycle и Context Engine

Текущая стадия Project — один из входов формулы Context Engine:

```text
Context = f(Event, Graph, Timeline, Scene, Role, Time, Location, State, History, Changes)
```

`State` в этой формуле — это, в частности, стадия Lifecycle. Она определяет, какая информация приоритетна для организатора прямо сейчас: во время `Preparation` приоритетны подтверждения подрядчиков, во время `Active` — операционные детали, во время `Delivery` — статус доставки.

---

## 20. Lifecycle и Navigator

Navigator не показывает пользователю весь Lifecycle Project целиком.

```text
Organizer видит:
Текущая стадия + ближайший переход

Contractor видит:
Только те стадии, где он участвует
```

Пример для фотографа:

```text
Preparation → Event → Production → Delivery
```

Стадии `Lead` и `Planning` фотографу нерелевантны и не показываются.

---

## 21. Роль-специфичные проекции Lifecycle

### Организатор

```text
Полный Lifecycle всех своих проектов одновременно
```

### Фотограф

```text
Preparation → Event → Production → Delivery
(для каждого своего проекта отдельно)
```

### Водитель

```text
Preparation → Event
```

### Клиент

```text
Planning → Confirmation → Preparation → Event → Delivery
(без внутренних операционных стадий)
```

---

## 22. Переходы между стадиями

Переход между стадиями — это Change с типом `LifecycleTransition`.

```text
LifecycleTransition
├── project_id
├── from_stage
├── to_stage
├── triggered_by     (User | System | Automation Rule)
├── triggered_at
├── requires_confirmation
└── conditions_met
```

---

## 23. Условия перехода

Не каждый переход происходит автоматически.

```text
Planning → Confirmed
требует: контракт подписан, аванс получен (опционально)

Preparation → Event
происходит: автоматически, по времени начала мероприятия

Event → Production
требует: Event Completed = true

Production → Delivery
требует: все обязательные Postproduction Job = Completed

Delivery → Completed
требует: Client Delivery Confirmed + Financially Completed
```

Конкретные условия конфигурируются на уровне `ProjectType`, но сама модель "переход = событие с условиями" — часть архитектуры.

---

## 24. Автоматические переходы

Некоторые переходы система может выполнять сама:

```text
Event Date наступила
 ↓
Preparation → Event (автоматически)

Event время закончилось
 ↓
Event → Production (автоматически, если есть Production Track)
```

Автоматический переход — это Change, инициированный System, и он подчиняется тем же правилам прозрачности, что и любой другой Change (см. `54_Changes.md`).

---

## 25. Переходы, требующие подтверждения

```text
Production → Delivery
Delivery → Completed
```

Эти переходы, как правило, требуют явного действия организатора, потому что они необратимы в бизнес-смысле (клиенту передан результат, проект закрыт для отчётности).

---

## 26. Откат стадии

Стадия может быть возвращена назад, если это отражает реальность.

```text
Delivery → Production
```

Пример: клиент запросил правки после доставки галереи. Проект возвращается в Production для конкретного трека, не теряя историю о том, что Delivery уже случался однажды.

---

## 27. История переходов

Каждый Project хранит полную историю:

```text
Lead           2026-01-10
Planning       2026-01-15
Confirmed      2026-02-01
Preparation    2026-07-20
Event          2026-08-09
Production     2026-08-09
Delivery       2026-08-23
Completed      2026-09-01
```

Это конкретизация принципа "Everything Has History" (`03_Principles.md`) применительно к Lifecycle.

---

## 28. Здоровье проекта на протяжении Lifecycle

`Project Health`, введённый в `21_Projects.md`, вычисляется на каждой стадии по-разному:

```text
Planning     → есть ли неподтверждённые ключевые роли
Preparation  → есть ли незакрытые критичные задачи (см. 52_Tasks.md)
Event        → есть ли активные Change, требующие внимания
Production   → есть ли просроченные Postproduction Job
Delivery     → доставлен ли результат в срок
```

---

## 29. Несколько мероприятий в одном Project

Один Project может содержать несколько Event.

```text
Project: Corporate Anniversary
 ├── Event: Rehearsal Day
 └── Event: Main Event Day
```

Каждый Event проходит собственный Event Lifecycle (§6–11); Project Lifecycle остаётся общим контейнером.

---

## 30. Несколько Project у одного Client одновременно

```text
Client: Ivan & Anna
 ├── Project: Engagement Photoshoot   (Completed)
 └── Project: Wedding                (Preparation)
```

Lifecycle каждого Project независим. Общая история Client складывается из истории всех его Project (Engagement Lifecycle, §4).

---

## 31. Однодневные участники и Lifecycle

Временный исполнитель не должен видеть полный Lifecycle Project.

```text
Driver, назначенный только на Event День
 ↓
видит только: Preparation (за день до) → Event
```

Как только соответствующий трек завершён, доступ временного участника истекает согласно `23_Permissions.md`.

---

## 32. Lifecycle не заменяет Workflow

Project Lifecycle описывает крупные, редкие переходы всего проекта.

`Workflow` (см. `51_Workflow.md`) описывает детальные, частые шаги внутри одной стадии, специфичные для роли.

```text
Lifecycle: Production               (одна стадия, недели)
Workflow внутри Production:
  Capture → Transfer → Cull → Color → Retouch → QA → Delivery
```

---

## 33. Lifecycle не заменяет Timeline

Timeline описывает конкретное время конкретных Scene внутри дня мероприятия.

Lifecycle описывает, на каком крупном этапе находится весь Project — до, во время и после этого дня.

```text
Lifecycle: Preparation → Event → Production
Timeline:  (существует только внутри стадии Event, детализируя день по часам)
```

---

## 34. Успех определяется не одной датой

```text
Плохо:
Project Success = Event прошёл без проблем

Хорошо:
Project Success =
  Event Completed
  + Production Completed в срок
  + Delivery Completed в срок
  + Client Satisfied
  + Financially Completed
```

---

## 35. MVP

Минимальная реализация должна поддерживать:

1. Базовый Project Lifecycle (`21_Projects.md`).
2. Event Lifecycle внутри стадии Event.
3. Независимые треки завершения (Production, Delivery, Financial).
4. Историю переходов стадий.
5. Условия перехода (даже если проверяются вручную).
6. Ролевые проекции Lifecycle (организатор видит всё, подрядчик — свою часть).
7. `ProjectType` с включением/выключением стадий.

---

## 36. Поздние возможности

```text
Автоматическое определение условий перехода
Прогнозирование задержек между стадиями
Аналитика по длительности стадий между проектами
Настраиваемые Lifecycle-шаблоны по типу мероприятия
AI-предупреждения о риске срыва стадии
```

---

## 37. Итоговое утверждение

> **Event Lifecycle не вводит новую модель состояний. Он объясняет, как уже существующие уровни — отношения с клиентом, жизненный цикл проекта и жизнь самого мероприятия — вложены друг в друга и завершаются независимо, каждый в своём темпе.**

```
```
