Projects
Document: 21_Projects.md
Version: 0.1.0
Status: Draft
Depends on:
00_North_Star.md
10_Architecture.md
11_Graph_Model.md
12_Context_Engine.md
13_Timeline_Canvas.md
14_Navigator.md
20_Workspaces.md
1. Purpose
Project — основной контейнер рабочего процесса в Event OS.
Project объединяет:
клиента;
мероприятие;
команды;
подрядчиков;
документы;
Timeline;
коммуникацию;
задачи;
финансовые статусы;
файлы;
изменения;
пост-ивент процессы.
Project не является просто карточкой CRM.
Это операционная модель конкретного заказа или мероприятия.
2. Project vs Event
В архитектуре необходимо различать:
Project — весь жизненный цикл работы;
Event — само мероприятие как событие во времени.
Например:
Project: Wedding — Ivan & Anna
│
├── Preparation
├── Event Day
├── Photo Production
├── Video Production
├── Delivery
└── Post-event
Внутри Project находится Event:
Project
   │
   └── Event
        └── Timeline
Это позволяет продолжать работу после окончания мероприятия.
Для фотографа это особенно важно:
Event Day
    ↓
File Transfer
    ↓
Retouch
    ↓
Color Correction
    ↓
Review
    ↓
Gallery
    ↓
Client Delivery
    ↓
Feedback
    ↓
Photobook
    ↓
Additional Orders
3. Project Lifecycle
Project существует значительно дольше, чем само мероприятие.
Базовый жизненный цикл:
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
Не каждый Project обязан проходить все состояния.
3.1 Lead
Потенциальный заказ.
Минимальная информация:
клиент;
тип мероприятия;
предполагаемая дата;
источник обращения;
ответственный.
3.2 Planning
Заказ находится в процессе подготовки.
Формируются:
участники;
подрядчики;
Timeline;
бюджет;
документы;
требования;
команды.
3.3 Confirmed
Основные договоренности подтверждены.
Project становится рабочим.
3.4 Preparation
Основная фаза подготовки.
В этот момент активно изменяются:
Timeline;
подрядчики;
маршруты;
документы;
сценарий;
локации;
технические требования.
3.5 Event
Наступил день мероприятия.
Navigator становится основным интерфейсом для исполнителей.
3.6 Production
После мероприятия продолжаются связанные процессы.
Например:
Фотограф
→ передача файлов
→ ретушь
→ цветокоррекция
→ проверка
→ публикация
3.7 Delivery
Результаты передаются клиенту.
Например:
фотографии;
видео;
альбом;
фотокнига;
документы;
другие материалы.
3.8 Completed
Основная работа завершена.
Project может оставаться доступным для:
обратной связи;
повторных заказов;
фотокниги;
дополнительных услуг;
архива.
3.9 Archived
Project больше не находится в активной работе.
Данные сохраняются в соответствии с политикой хранения.
4. Project Types
Event OS не должна ограничиваться свадьбами.
Тип Project определяется типом мероприятия и набором процессов.
Примеры:
Wedding;
Birthday;
Corporate Event;
Conference;
Concert;
Festival;
Private Party;
Graduation;
Exhibition;
Brand Event;
Corporate Shooting;
Family Event;
Other.
Тип влияет на шаблоны, но не должен менять фундаментальную архитектуру.
5. Project as Graph Container
Project является одним из верхних уровней Graph Model.
graph TD
    Project --> Client
    Project --> Event
    Project --> Team
    Project --> Contractors
    Project --> Timeline
    Project --> Documents
    Project --> Communication
    Project --> FinancialStatus
    Project --> Files
    Project --> PostProduction
    Связи между сущностями важнее самой структуры папок.
6. Project Participants
Project может содержать:
клиента;
организатора;
координатора;
фотографа;
видеографа;
ведущего;
декоратора;
флориста;
водителя;
ресторан;
кейтеринг;
техническую команду;
артистов;
подрядчиков;
временных исполнителей.
Участник не обязательно является постоянным пользователем системы.
7. Project Roles
Роль существует в контексте Project.
Один пользователь может иметь разные роли в разных проектах.
Например:
User
│
├── Project A → Photographer
├── Project B → Photographer
├── Project C → Organizer
└── Project D → Assistant
Поэтому роль не должна быть жестко привязана к аккаунту.
8. Project Teams
Project может содержать несколько команд.
Например:
Project
│
├── Organizer Team
├── Photo Team
├── Video Team
├── Technical Team
├── Catering Team
└── Entertainment Team
Команды могут взаимодействовать через общий граф, сохраняя собственные права доступа.
9. Project Timeline
Timeline является центральным инструментом Project.
Он связывает:
время;
сцены;
локации;
участников;
задачи;
зависимости;
транспорт;
погоду;
свет;
изменения.
Пример:
10:00             12:00              14:00              18:00
│------------------│-------------------│-------------------│
Сборы              Церемония           Прогулка            Банкет
│                  │                   │                   │
Погода             Погода              Погода              Погода
│                  │                   │                   │
Фотограф           Команда             Фото/Видео         Ведущий
Project может иметь несколько Timeline, но они должны быть связаны с общей временной моделью.
10. Project Timeline vs Personal Timeline
Полный Timeline принадлежит Project.
Каждый Workspace получает его персональную проекцию.
Project Timeline
       │
       ├── Organizer Timeline
       ├── Photographer Timeline
       ├── Driver Timeline
       ├── Host Timeline
       └── Client Timeline
11. Project Changes
Любое существенное изменение должно иметь источник и историю.
Например:
Ceremony
14:00
становится:
Ceremony
14:20
Система должна знать:
what changed
when
who changed it
why
who is affected
12. Change Propagation
Изменение Project распространяется через Graph.
flowchart TD
    Change[Timeline Change]
    Change --> Graph[Project Graph]

    Graph --> Photographer
    Graph --> Videographer
    Graph --> Driver
    Graph --> Host
    Graph --> Organizer

    Graph --> ContextEngine
    ContextEngine --> Navigator
    flowchart TD
    Change[Timeline Change]
    Change --> Graph[Project Graph]

    Graph --> Photographer
    Graph --> Videographer
    Graph --> Driver
    Graph --> Host
    Graph --> Organizer

    Graph --> ContextEngine
    ContextEngine --> Navigator
Но уведомление получают не все.
Только участники, которых изменение затрагивает.
13. Project Context
Project должен иметь общий контекст:
текущий статус;
ближайшее событие;
критические изменения;
проблемы;
незавершенные процессы;
важные документы;
состояние подрядчиков.
Context Engine преобразует этот общий контекст в персональный.
14. Project Dashboard
Project Dashboard не должен быть главным интерфейсом исполнителя.
Он предназначен прежде всего для организатора.
Может содержать:
Project
│
├── Overview
├── Timeline
├── People
├── Teams
├── Contractors
├── Documents
├── Communication
├── Financial Status
├── Files
├── Changes
└── Settings
15. Project Overview
Overview должен показывать состояние проекта, а не превращаться в набор метрик.
Например:
Иван + Анна

24 августа

Свадьба

Подготовка: 82%

Подрядчики:
14 / 15 подтверждены

Следующее:
финальная встреча

⚠ Изменение маршрута
Процент выполнения не является обязательным.
Если он не отражает реальное состояние, его не следует показывать.
16. Project Tasks
Tasks существуют внутри Project, но Project не является таск-менеджером.
Задача должна существовать только тогда, когда существует конкретный результат.
Пример:
Получить финальный тайминг ресторана.
Но не:
Подумать о ресторане.
17. Scrum Compatibility
Event OS может использовать принципы Scrum и других agile-подходов, но не должна превращать мероприятие в обычный software backlog.
Event имеет:
долгую подготовку;
большое количество зависимостей;
жесткую дату;
короткое окно исполнения;
большое количество участников;
динамические изменения.
Поэтому основная модель:
Graph + Timeline + Context
а не:
Backlog + Sprint + Task Board
18. Project Dependencies
Project может содержать зависимости.
Пример:
Restaurant Confirmation
        ↓
Final Menu
        ↓
Catering
        ↓
Timeline
        ↓
Host Script
Другой пример:
Weather
   ↓
Outdoor Ceremony
   ↓
Rain Plan
   ↓
Decoration
   ↓
Photography
   ↓
Timeline
19. Critical Dependencies
Некоторые зависимости являются критическими.
Если одна сущность изменяется, это может повлиять на множество участников.
Например:
Venue Change
     ↓
Route
     ↓
Transport
     ↓
Timeline
     ↓
Photographer
     ↓
Videographer
     ↓
Host
     ↓
Guests
Graph Model должен позволять определить affected nodes.
20. Project Documents
Документы являются частью Project Graph.
Типы:
договор;
смета;
техническое задание;
маршрутный лист;
сценарий;
список гостей;
схема площадки;
технический райдер;
shot list;
документы подрядчиков;
дополнительные материалы.
Документ должен иметь контекст.
Не просто:
file.pdf
а:
Venue
→ Technical Rider
→ Updated 14 August
→ Relevant for Technical Team
21. Project Communication
Коммуникация привязана к контексту.
Возможны:
Project Chat;
Team Chat;
Scene Chat;
Direct Chat;
Task Discussion.
Сообщение должно по возможности иметь связь с сущностью.
Например:
«Свет перенесли сюда»

→ Scene: First Dance
→ Location: Main Hall
→ Time: 21:30
Это позволяет Context Engine учитывать коммуникацию.
22. Project Files
Файлы могут принадлежать:
Project;
Event;
Scene;
Task;
User;
Team;
Post-production stage.
Для фотографии особенно важна цепочка:
Camera Files
    ↓
Transfer
    ↓
Retouch
    ↓
Color
    ↓
Review
    ↓
Gallery
23. Post-Event Project
Project не заканчивается после последней сцены Event.
Для фотографа:
Event
 ↓
File Transfer
 ↓
Retouch
 ↓
Color
 ↓
Quality Control
 ↓
Gallery
 ↓
Client Delivery
Для видеографа:
Event
 ↓
Media Backup
 ↓
Editing
 ↓
Color
 ↓
Sound
 ↓
Review
 ↓
Delivery
24. Client Relationship After Event
После передачи результата Project может продолжать существовать как CRM-контекст.
Например:
Delivery
   ↓
Feedback
   ↓
Photobook
   ↓
Additional Session
   ↓
Anniversary
Это важная часть бизнес-модели.
Система не должна считать клиента потерянным сразу после завершения мероприятия.
25. Project and CRM
Event OS может содержать CRM-функции, но Project не должен превращаться в традиционную CRM-карточку.
CRM отвечает на вопрос:
Кто этот клиент и какие у нас отношения?
Project отвечает:
Что мы сейчас делаем для этого клиента?
26. Project Financial Status
Project может хранить финансовые статусы:
Не оплачено
Нужно оплатить
Оплачено
Частично оплачено
Не требуется
Финансовые статусы являются операционной информацией.
Event OS не обязана:
принимать платежи;
проводить эквайринг;
быть бухгалтерией;
быть налоговой системой.
27. Accounting Integration
Бухгалтерия является опциональным внешним контуром.
Возможная архитектура:
Project
   │
   ├── Financial Status
   │
   └── Accounting Integration
            │
            └── External Accounting System
Интеграция не должна быть обязательной для создания Project.
28. Legal Information
Project может содержать юридически значимые данные:
договор;
стороны договора;
согласия;
реквизиты;
сроки;
условия;
права использования материалов.
Система должна хранить такие данные структурированно, если они используются внутри сервиса.
При этом Event OS не должна автоматически становиться юридической или бухгалтерской системой.
29. Project Access
Доступ определяется комбинацией:
User
+
Organization
+
Role
+
Team
+
Project Membership
+
Permissions
Временный исполнитель может иметь:
Project Access
+
Limited Role
+
Limited Time
30. Project Ownership
Project должен иметь владельца или ответственную организацию.
Например:
Organization
    ↓
Project
    ↓
Responsible Organizer
При этом Project может включать внешних подрядчиков.
31. Cross-Agency Projects
Project может объединять участников из разных организаций.
Agency A
    │
    ├── Organizer
    │
    └── Project
          │
          ├── Agency B → Photographer
          ├── Agency C → Decorator
          └── Independent → Driver
Участники получают только необходимый контекст.
32. Project Templates
Проекты могут создаваться на основе шаблонов.
Например:
Wedding Template
Corporate Event Template
Birthday Template
Photo Production Template
Шаблон может содержать:
типовые роли;
типовые сцены;
Timeline;
документы;
процессы;
зависимости;
чек-листы.
Шаблон не должен создавать жесткую структуру.
После создания Project его граф может изменяться.
33. Project Creation
Минимальный процесс:
Create Project
      ↓
Select Type
      ↓
Add Client
      ↓
Set Date
      ↓
Create Event
      ↓
Add Initial Team
      ↓
Project Ready
Дальнейшая информация добавляется постепенно.
34. Project Creation Should Be Progressive
Организатор не должен заполнять огромную форму перед созданием проекта.
Система должна позволять начать с минимума:
Клиент
Дата
Тип мероприятия
Ответственный
После этого Project уже существует.
Остальные сущности добавляются по мере подготовки.
35. Project Search
Поиск должен поддерживать:
клиента;
название;
дату;
город;
тип мероприятия;
участника;
подрядчика;
статус.
Но поиск не должен быть единственным способом навигации.
Основной доступ — через Workspace и контекст.
36. Project Archive
После завершения Project может быть архивирован.
Архив должен сохранять:
историю изменений;
документы;
Timeline;
участников;
результаты;
коммуникацию;
финансовые статусы;
связанные проекты.
37. Project Reuse
Архивный Project может быть использован как источник для нового проекта.
Например:
Wedding 2026
     ↓
New Anniversary Project 2027
Но данные не должны автоматически смешиваться.
Создается новый Project с отдельным Graph.
38. Project Identity
Project должен иметь устойчивый идентификатор.
Пример:
project_id
Название может изменяться.
Идентификатор — нет.
39. Project State vs Entity State
Важно различать состояние Project и состояние отдельных сущностей.
Например:
Project:
Preparation

Photographer:
Confirmed

Florist:
Completed

Retouch:
In Progress

Invoice:
Paid
Нельзя выводить состояние всего Project только из одной задачи.
40. Project Health
Project Health — агрегированное состояние проекта.
Оно может учитывать:
критические изменения;
неподтвержденных участников;
просроченные процессы;
нарушения Timeline;
отсутствие документов;
проблемы с подрядчиками.
Пример:
Project Health

● Normal
или:
Project Health

⚠ Attention Required

2 critical dependencies
1 unconfirmed contractor
Это инструмент организатора, а не исполнителя.
41. Project Events vs Notifications
Не каждое изменение Project является уведомлением.
Project Event
     ↓
Impact Analysis
     ↓
Affected Users
     ↓
Notification Policy
     ↓
Notifications
Это позволяет не превращать систему в поток бессмысленных push-сообщений.
42. Project and AI
AI является опциональным слоем.
Project должен полноценно работать без AI.
AI может помогать:
анализировать зависимости;
искать противоречия;
предлагать изменения;
составлять документы;
резюмировать коммуникацию;
находить потенциальные проблемы;
готовить персональный контекст.
AI не является владельцем Project.
43. Project Without AI
Без AI должны работать:
создание Project;
Timeline;
Graph;
Workspace;
Permissions;
Communication;
Documents;
Tasks;
Notifications;
Statuses;
Navigator;
Files.
AI улучшает систему, но не является фундаментом.
44. Project Data Model
Концептуальная модель:
Project
│
├── Client
├── Organization
├── Event
├── Teams
├── Members
├── Contractors
├── Timeline
├── Scenes
├── Locations
├── Tasks
├── Documents
├── Communication
├── Files
├── Financial Status
├── Changes
└── Post-Event Processes
45. Project Architecture
flowchart TD
    Project --> Event
    Project --> Client
    Project --> Organization

    Event --> Timeline
    Timeline --> Scenes
    Scenes --> Locations

    Project --> Teams
    Teams --> Members
    Project --> Contractors

    Project --> Tasks
    Project --> Documents
    Project --> Communication
    Project --> Files
    Project --> FinancialStatus
    Project --> Changes

    Changes --> Graph
    Graph --> ContextEngine
    ContextEngine --> Navigator
46. Project Rules
Project is a lifecycle
Project существует до, во время и после мероприятия.
Event is not the whole Project
Мероприятие является центральным событием, но не границей проекта.
One Project, one graph
Все участники работают с общей моделью.
Many Workspaces
Каждый пользователь получает собственную проекцию.
Timeline is central
Временная модель является основным способом организации Event.
Changes propagate through the graph
Изменения должны распространяться автоматически.
Access is contextual
Участник видит только необходимую ему информацию.
Temporary participants are supported
Однодневные исполнители являются нормальным сценарием.
Project is not a task manager
Задачи существуют внутри более широкой модели.
Project is not accounting software
Финансовые статусы допустимы, обязательная бухгалтерия — нет.
Project is not a payment system
Эквайринг и проведение платежей не являются частью ядра.
AI is optional
Project должен работать без AI.
47. Success Criteria
Project считается корректно реализованным, если:
Проект можно создать с минимальным количеством данных.
Проект существует до, во время и после мероприятия.
Event является частью Project, но не заменяет его.
Все участники работают с единым Graph.
Каждый Workspace получает свою проекцию.
Timeline является центральной временной моделью.
Изменения распространяются через Graph.
Система различает Project State и Entity State.
Временные исполнители могут подключаться без полноценного onboarding.
Поддерживаются несколько организаций и агентств.
Поддерживается работа в разных городах.
Финансовые статусы существуют независимо от платежной системы.
Бухгалтерская интеграция является опциональной.
AI является опциональным.
Project может продолжаться после Event.
Архивный Project может использоваться как основа для нового, не смешивая данные.
48. Project Statement
Project — это единая операционная модель заказа, которая связывает клиента, мероприятие, команды, подрядчиков, Timeline, документы, коммуникацию, производство и последующую работу в один живой граф. Project не заканчивается последним событием дня: он сопровождает весь жизненный цикл работы от первого контакта до результата и дальнейших отношений с клиентом.
