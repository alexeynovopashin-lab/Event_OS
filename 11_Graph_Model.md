# Graph Model

**Document:** 11_Graph_Model.md  
**Version:** 0.1.0  
**Status:** Draft  
**Depends on:** 10_Architecture.md

---

# Purpose

Данный документ описывает графовую модель данных Event OS.

Graph Model является фундаментом всей платформы.

Timeline.

Контекст.

Навигация.

Уведомления.

Права доступа.

ИИ.

Все эти компоненты работают поверх графа.

Граф является единственным представлением реальности внутри системы.

---

# Why Graph

Традиционные CRM строятся вокруг таблиц.

```
Client

↓

Order

↓

Task

↓

Invoice
```

Такая модель хорошо хранит данные.

Но плохо описывает реальные связи между объектами.

---

Реальное мероприятие выглядит иначе.

```
Фотограф

↓

Снимает

↓

Сцену

↓

В определенной локации

↓

В определенное время

↓

При определенной погоде

↓

Совместно с видеографом

↓

По договору

↓

Для клиента
```

Это уже не таблица.

Это сеть взаимосвязей.

---

# Event Graph

Каждый проект представляет собой ориентированный граф.

```
                Event
                  │
      ┌───────────┼────────────┐
      │           │            │
 Timeline      People     Documents
      │           │            │
    Scene       Roles        Files
      │           │            │
 Locations    Teams       Communication
      │
   Weather
```

Все вершины графа принадлежат одному событию.

---

# Nodes

Каждый объект системы является вершиной графа.

Например:

```
Event

Scene

Timeline

Organization

Team

Person

Role

Client

Location

Route

Weather

Equipment

Vehicle

Contract

Invoice

Document

Gallery

Task

Media

Notification

Chat

Comment

AI Recommendation
```

Список может расширяться.

Новые типы узлов не должны менять архитектуру.

---

# Edges

Связи являются сущностями первого класса.

Примеры:

```
ASSIGNED_TO

PARTICIPATES_IN

LOCATED_AT

PRECEDES

FOLLOWS

BELONGS_TO

CREATED_BY

DEPENDS_ON

USES

DELIVERS_TO

RELATED_TO

RESPONSIBLE_FOR

HAS_STATUS

ATTACHED_TO
```

Связи имеют собственные свойства.

Например:

```
Photographer

ASSIGNED_TO

Scene

from

09:00

to

13:00
```

---

# Event Root

Каждый граф имеет один корневой объект.

```
Event
```

Все остальные вершины должны иметь путь к нему.

Если объект невозможно связать с Event, он не принадлежит системе.

---

# Timeline Graph

Timeline также является графом.

```
Scene A

↓

Scene B

↓

Scene C

↓

Scene D
```

Но это только один из возможных маршрутов.

Граф допускает альтернативные сценарии.

Например.

```
Outdoor Ceremony

↓

Rain

↓

Indoor Ceremony
```

Или

```
Route A

↓

Traffic

↓

Route B
```

Timeline представляет собой предпочтительный путь через граф.

---

# Scene

Scene — ключевой узел системы.

```
Scene

├── Time
├── Location
├── Weather
├── Participants
├── Files
├── Documents
├── Equipment
├── Notes
├── Chat
├── Tasks
└── History
```

Практически весь пользовательский опыт строится вокруг сцен.

---

# Person

Каждый пользователь представлен отдельным узлом.

```
Person
```

Один человек может одновременно иметь несколько ролей.

Например.

```
Person

↓

Photographer

↓

Agency Owner

↓

Retoucher
```

Роль является отдельной сущностью.

---

# Organization

Организация является независимым графом верхнего уровня.

```
Organization

↓

Projects

↓

Events
```

Пользователь может состоять сразу в нескольких организациях.

---

# Team

Команда объединяет участников события.

```
Photo Team

Video Team

Decor Team

Music Team

Logistics Team

Restaurant

Client Team
```

Каждый пользователь может одновременно состоять в нескольких командах.

---

# Documents

Документ никогда не существует самостоятельно.

Например.

```
Contract

↓

belongs_to

↓

Client
```

или

```
Moodboard

↓

belongs_to

↓

Scene
```

или

```
Checklist

↓

belongs_to

↓

Timeline
```

---

# Communication

Сообщения принадлежат объектам.

```
Scene

↓

Discussion
```

или

```
Task

↓

Comments
```

или

```
Gallery

↓

Feedback
```

Общий чат является исключением.

Основной способ общения — обсуждение конкретного объекта.

---

# Media Graph

Жизненный цикл фотографий также описывается графом.

```
RAW

↓

Selection

↓

Retouch

↓

Review

↓

Approved

↓

Gallery

↓

Delivered

↓

Archived
```

Каждая стадия является отдельным состоянием одного объекта.

---

# Notification Graph

Уведомление не хранится заранее.

Оно вычисляется.

```
Object changed

↓

Graph updated

↓

Affected users

↓

Context recalculated

↓

Notification created
```

Таким образом система исключает лишние уведомления.

---

# Dependency Graph

Любой объект может зависеть от другого.

Например.

```
Outdoor Ceremony

↓

depends_on

↓

Weather
```

или

```
Portrait Session

↓

depends_on

↓

Golden Hour
```

или

```
Fireworks

↓

depends_on

↓

Venue Permission
```

Изменение одной вершины автоматически влияет на связанные объекты.

---

# State Graph

Каждый объект имеет жизненный цикл.

Например.

```
Created

↓

Planned

↓

Confirmed

↓

In Progress

↓

Completed

↓

Archived
```

Состояния являются частью графа.

---

# Context Graph

Контекст не хранится.

Он вычисляется.

Например.

```
Photographer

+

Current Time

+

Current Scene

+

Weather

+

Latest Changes

↓

Context
```

Таким образом один и тот же граф порождает разные представления для разных пользователей.

---

# Permissions

Права доступа также вычисляются через граф.

Например.

```
Organization

↓

Project

↓

Photo Team

↓

Photographer

↓

Gallery
```

Если путь существует — доступ разрешен.

Если нет — запрещен.

---

# AI

ИИ никогда не создает собственную модель данных.

Он работает поверх существующего графа.

```
Graph

↓

Context

↓

AI Analysis

↓

Recommendation
```

ИИ не изменяет граф напрямую.

Любые изменения подтверждает пользователь.

---

# Design Rules

При создании новых сущностей необходимо соблюдать следующие правила.

## Every object is a node.

Любая новая сущность становится вершиной графа.

---

## Every relationship is explicit.

Любая связь описывается явно.

Не допускаются "скрытые" зависимости.

---

## Every node belongs to an Event.

Любой объект должен иметь путь к событию.

---

## Every node has history.

Любое изменение сохраняется.

---

## Every node can be referenced.

Любой объект может использоваться другими объектами.

---

## Graph first.

Никакая бизнес-логика не должна обходить графовую модель.

---

# Why This Matters

Большинство систем хранят данные.

Event OS хранит взаимосвязи.

Именно связи позволяют платформе понимать контекст, автоматически распространять изменения, вычислять релевантную информацию и сопровождать пользователя через событие.

---

# Graph Model Statement

> **Graph Model — это цифровое представление мероприятия, в котором каждый объект является вершиной, каждая взаимосвязь имеет явное описание, а весь пользовательский опыт строится на вычислении контекста поверх этого графа.**
