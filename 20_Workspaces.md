Workspaces
Document: 20_Workspaces.md
Version: 0.1.0
Status: Draft
Depends on:
00_North_Star.md
10_Architecture.md
11_Graph_Model.md
12_Context_Engine.md
13_Timeline_Canvas.md
14_Navigator.md
1. Purpose
Workspace — это рабочая среда пользователя внутри Event OS.
Workspace не является отдельной копией проекта.
Это персональная проекция общего графа события, адаптированная под:
роль пользователя;
команду;
текущий проект;
текущую сцену;
права доступа;
текущий момент;
рабочие задачи;
доступный контекст.
Один Event может иметь множество Workspace.
                         EVENT
                           │
                           ▼
                         GRAPH
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
       Organizer       Photographer     Client
       Workspace       Workspace        Workspace
2. Workspace Is Not a Project
Проект — это объект реальности.
Workspace — способ работать с этим объектом.
Project
│
├── Timeline
├── People
├── Locations
├── Documents
├── Tasks
├── Communication
├── Files
└── Financial Status
Workspace определяет, какая часть этой структуры доступна пользователю и как она представлена.
3. One Graph, Many Workspaces
В системе не должно существовать отдельных копий проекта для разных участников.
Все работают с одним графом.
graph TD
    Event[Event Graph]

    Event --> Organizer[Organizer Workspace]
    Event --> Photographer[Photographer Workspace]
    Event --> Videographer[Videographer Workspace]
    Event --> Host[Host Workspace]
    Event --> Driver[Driver Workspace]
    Event --> Florist[Florist Workspace]
    Event --> Restaurant[Restaurant Workspace]
    Event --> Client[Client Workspace]
Изменение в графе автоматически отражается в соответствующих Workspace.
4. Workspace Composition
Workspace состоит из нескольких слоев.
Workspace
│
├── Identity
├── Navigation
├── Timeline
├── Context
├── Communication
├── Tasks
├── Documents
├── Files
└── Settings
Не каждый Workspace должен содержать все слои.
5. Workspace Types
Базовые типы:
Organizer Workspace
Photographer Workspace
Videographer Workspace
Coordinator Workspace
Contractor Workspace
Team Workspace
Client Workspace
Agency Workspace
Organization Workspace
Архитектура должна позволять добавлять новые типы без изменения ядра.
6. Organizer Workspace
Organizer Workspace — основная операционная среда организатора.
Организатор работает не с одной задачей, а с большим количеством взаимосвязанных событий и участников.
Поэтому его Workspace является наиболее широким.
Organizer
│
├── Events
├── Clients
├── Teams
├── Contractors
├── Timeline
├── Communication
├── Documents
├── Financial Status
└── Organization
6.1 Organizer Home
Главный экран должен отвечать на вопросы:
Что происходит сейчас?

Что требует моего внимания?

Что изменилось?

Какие мероприятия приближаются?

Где есть проблема?
Это не классический CRM Dashboard.
Главный акцент — на событиях и контексте.
6.2 Event Overview
Организатор может открыть конкретное мероприятие и получить:
Timeline;
команды;
участников;
подрядчиков;
документы;
коммуникацию;
статусы;
финансовую информацию;
историю изменений.
6.3 Multi-Event View
Организатор может одновременно вести множество мероприятий.
Workspace должен поддерживать:
Event A
Event B
Event C
Event D
...
Но информация не должна превращаться в бесконечную таблицу.
Главным объектом остается событие.
7. Photographer Workspace
Фотограф работает иначе, чем организатор.
Ему не нужен весь граф мероприятия.
Основные элементы:
Navigator
Timeline
Current Scene
Shot List
Client
Files
Postproduction
Communication
7.1 Before Event
Фотограф видит:
дату;
адреса;
маршрут;
время;
участников;
контакты;
погодные условия;
свет;
изменения;
документы;
требования клиента.
7.2 Event Day
Основным экраном становится Navigator.
NOW

Current Scene

↓

Next Scene

↓

Route

↓

Changes
Фотограф не должен постоянно контролировать весь проект.
7.3 After Event
Workspace автоматически меняет контекст.
Wedding Day
    ↓
File Transfer
    ↓
Selection
    ↓
Retouch
    ↓
Review
    ↓
Gallery
    ↓
Client Delivery
Это особенно важно для фотографов и видеографов.
Их участие в событии заканчивается не в момент завершения праздника.
8. Contractor Workspace
Большинство подрядчиков не нуждаются в полноценном CRM.
Например:
флорист;
декоратор;
водитель;
кондитер;
музыкант;
звукорежиссер;
осветитель;
ведущий.
Им необходима ограниченная рабочая среда.
My Events
│
├── Current
├── Upcoming
└── Completed
8.1 Contractor Principle
Подрядчик должен видеть:
Всё, что необходимо для моей работы.
Но не:
Всё, что знает организатор.
9. Temporary Workspace
Особенно важный тип Workspace — временный.
Некоторые исполнители используют систему только один день.
Например:
водитель;
официант;
дополнительный фотограф;
ассистент;
музыкант;
технический специалист;
монтажник декораций.
Создание полноценного аккаунта не должно быть обязательным условием работы.
9.1 Temporary Access
Организатор может предоставить временный доступ.
Invite
   ↓
Access
   ↓
Event
   ↓
Relevant Scenes
   ↓
Expiration
Доступ может автоматически завершиться после события.
9.2 Minimal Onboarding
Однодневный исполнитель должен получить:
Что это за мероприятие?

Где я нужен?

Когда?

Что я должен сделать?

Кому звонить?

Что изменилось?
Необходимо избегать:
длинной регистрации;
сложной настройки профиля;
обучения системе;
заполнения лишних данных.
10. Client Workspace
Client Workspace предназначен для клиента мероприятия.
Для свадьбы это могут быть молодожены.
Доступ является ограниченным и может быть временным.
10.1 Client Access
Клиент получает:
статус подготовки;
ближайшие этапы;
документы;
коммуникацию;
контакты;
информацию о подрядчиках в необходимом объеме;
результаты работы;
фотографии;
дополнительные услуги.
10.2 Client Does Not See Internal Operations
Клиент не должен видеть:
внутренние задачи;
служебные комментарии;
внутренние финансовые детали;
проблемы команды, не требующие его участия;
внутренние обсуждения подрядчиков.
10.3 Client Timeline
Timeline клиента является упрощенной проекцией.
✓ Подготовка

✓ Подрядчики

● День мероприятия

○ Фото

○ Видео

○ Фотокнига
11. Team Workspace
Workspace команды используется группой исполнителей.
Например:
Photo Team
│
├── Photographer
├── Second Photographer
├── Assistant
└── Retoucher
Команда получает общий контекст, но каждый участник сохраняет собственную персональную проекцию.
11.1 Team vs Person
Команда — не пользователь.
Team
│
├── Members
├── Roles
├── Responsibilities
└── Shared Resources
Каждый участник получает собственный Workspace.
12. Agency Workspace
Event OS должна поддерживать работу нескольких агентств.
Agency A
│
├── Teams
├── Events
└── Contractors

Agency B
│
├── Teams
├── Events
└── Contractors
Один пользователь может работать с несколькими организациями.
12.1 Cross-Organization Collaboration
Подрядчик может сотрудничать с разными агентствами.
Например:
Photographer
│
├── Agency A
├── Agency B
└── Direct Clients
Это не должно требовать создания нескольких аккаунтов.
13. Organization Workspace
Organization Workspace является верхним уровнем управления.
Используется для:
пользователей;
команд;
ролей;
проектов;
брендинга;
политики доступа;
настроек;
городов;
партнеров.
14. Multi-City
Система должна поддерживать работу одной организации в разных городах.
Organization
│
├── Tomsk
├── Moscow
├── Saint Petersburg
└── Other Cities
Город не должен быть частью жесткой архитектуры пользователя.
Пользователь может участвовать в мероприятиях в разных городах.
15. Workspace Switching
Пользователь может иметь несколько контекстов.
Например:
Alex

├── Photographer
├── Studio
└── Agency
Переключение между Workspace не должно создавать новые аккаунты.
16. Access Model
Workspace получает доступ к данным через Graph Permissions.
flowchart LR
    User --> Identity
    Identity --> Role
    Role --> Permissions
    Permissions --> Graph
    Graph --> Workspace
    Workspace --> Context
Workspace не определяет права самостоятельно.
Он получает уже разрешенную проекцию графа.
17. Workspace and Context Engine
Workspace является потребителем Context Engine.
Graph
   ↓
Permissions
   ↓
Context Engine
   ↓
Workspace
   ↓
Navigator / Timeline / Objects
Один и тот же Context Engine может сформировать разные представления.
18. Workspace and Navigator
Navigator является динамическим слоем Workspace.
Workspace
│
├── Timeline
├── Navigator
├── Objects
├── Communication
└── Documents
Для мобильного исполнителя Navigator может быть главным экраном.
Для организатора — одним из нескольких инструментов.
19. Workspace and Timeline
Timeline присутствует в большинстве Workspace, но имеет разную глубину.
Organizer
Полный Timeline.
Photographer
Персональный Timeline.
Driver
Только маршруты и связанные сцены.
Host
Сценарная последовательность.
Client
Упрощенная версия.
20. Workspace and Chat
Каждый Workspace имеет доступ к коммуникации в соответствии с правами.
Чат может быть:
event-level;
team-level;
scene-level;
task-level;
direct.
Workspace не должен автоматически показывать все чаты.
21. Workspace and Documents
Документы отображаются по релевантности.
Например, фотографу:
Сегодня

Маршрут
Shot List
Контакты
Схема площадки
Организатору:
Договоры
Сметы
Таймлайн
Технические документы
Подрядчики
Клиенту:
Договор
Программа
Рекомендации
Результаты
22. Workspace and Financial Information
Финансовая информация является отдельным доменом.
Workspace может отображать статусы:
Оплачено

Нужно оплатить

Ожидается

Не требуется
Event OS не является платежной системой.
Workspace не должен требовать:
эквайринг;
платежный шлюз;
проведение платежа через платформу.
Финансовая информация является справочной и операционной.
23. Workspace Branding
Организация может иметь минимальную айдентику:
логотип;
корпоративный цвет;
название;
базовые визуальные параметры.
Branding не должен менять архитектуру Workspace.
24. Workspace on Desktop
Desktop Workspace предназначен для:
планирования;
управления;
просмотра полного Timeline;
работы с документами;
коммуникации;
управления командами;
просмотра нескольких мероприятий.
Desktop предоставляет большую информационную плотность.
25. Workspace on Mobile
Mobile Workspace предназначен для:
Navigator;
текущего контекста;
Timeline;
коммуникации;
быстрых действий;
документов;
уведомлений.
Информация должна раскрываться постепенно.
26. PWA
Workspace должен быть доступен через PWA.
Целевые платформы:
iOS;
Android;
macOS;
Windows;
Linux;
desktop browsers.
Основная архитектура не должна зависеть от конкретной операционной системы.
27. Offline Workspace
Workspace должен сохранять минимально необходимый локальный контекст.
В offline доступны:
текущий Event;
текущая сцена;
ближайшие сцены;
контакты;
маршрут;
локальные документы;
последние изменения.
После восстановления соединения происходит синхронизация.
28. Workspace Lifecycle
Workspace может быть:
Created
   ↓
Invited
   ↓
Active
   ↓
Restricted
   ↓
Expired
   ↓
Archived
Для постоянного пользователя Workspace может существовать постоянно.
Для временного исполнителя срок жизни ограничен.
29. Temporary Access Lifecycle
flowchart LR
    Invite --> Accept
    Accept --> Active
    Active --> EventCompleted
    EventCompleted --> Restricted
    Restricted --> Expired
Организатор может досрочно отозвать доступ.
30. Workspace Security
Workspace должен соблюдать принцип минимально необходимого доступа.
Пользователь получает:
минимум данных, необходимых для выполнения его роли.
Особенно это важно для:
временных исполнителей;
клиентов;
внешних подрядчиков;
межагентского сотрудничества.
31. Workspace Does Not Duplicate Data
Workspace не хранит отдельную копию:
клиента;
события;
Timeline;
подрядчика;
задачи;
документа.
Он хранит пользовательские настройки и состояние интерфейса.
Все основные данные принадлежат доменным сущностям графа.
32. Workspace State
Допустимо сохранять персональное состояние:
Last opened scene
Pinned objects
Personal notes
UI preferences
Filters
Notification preferences
Это состояние принадлежит пользователю, а не событию.
33. Workspace as Projection
Основная архитектурная модель:
                    EVENT GRAPH
                         │
                         ▼
                   PERMISSIONS
                         │
                         ▼
                  CONTEXT ENGINE
                         │
                         ▼
                    WORKSPACE
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
          Navigator   Timeline    Objects
Workspace — это проекция графа.
Не копия графа.
34. Workspace Rules
One account, multiple contexts
Пользователь не должен создавать отдельный аккаунт для каждой организации или роли.
One graph, many projections
Все участники работают с одной моделью события.
Minimum necessary access
Каждый Workspace получает только необходимую информацию.
Temporary users are first-class
Однодневные исполнители должны поддерживаться архитектурой наравне с постоянными пользователями.
No forced onboarding
Чтобы выполнить работу, не нужно изучать всю систему.
Role changes the interface
Одна и та же информация может иметь разное значение для разных ролей.
Workspace follows the user
Workspace должен быть доступен на desktop, iOS и Android через единую PWA-архитектуру.
Workspace does not become another CRM
Workspace является рабочей средой над Event Graph, а не отдельной системой учета.
35. Success Criteria
Workspace считается правильно спроектированным, если:
Пользователь понимает, где он работает.
Пользователь видит только релевантную информацию.
Пользователь может быстро перейти к текущей сцене.
Пользователь может увидеть изменения.
Пользователь может выполнить свою работу без изучения всей системы.
Временный исполнитель может подключиться с минимальным onboarding.
Один пользователь может работать с несколькими организациями.
Один Event может иметь множество разных Workspace.
Все Workspace синхронизированы через общий граф.
Workspace не создает дубликатов данных.
36. Workspace Statement
Workspace — это персональная рабочая среда над единым графом мероприятия. Она соединяет пользователя с необходимой частью системы, учитывает его роль, команду, права доступа и текущий контекст и позволяет выполнять работу без необходимости держать в голове весь проект.
