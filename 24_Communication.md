Communication
Document: 24_Communication.md
Version: 0.1.0
Status: Draft
Depends on:
10_Architecture.md
11_Graph_Model.md
12_Context_Engine.md
20_Workspaces.md
21_Projects.md
22_Roles.md
23_Permissions.md
1. Purpose
Communication — это встроенный слой общения между участниками проекта.
Он должен заменить разрозненные:
Telegram-чаты;
WhatsApp;
звонки;
личные сообщения;
комментарии в документах;
сообщения в ботах;
сообщения в общих папках.
Но система не должна превращаться в очередной универсальный мессенджер.
Главная задача:
Связать сообщение с контекстом работы.
2. Core Principle
Сообщение должно существовать не само по себе, а в контексте графа.
User
 ↓
Message
 ↓
Context
 ↓
Project / Team / Scene / Task / Object
Например:
«В 17:30 переносим прогулку на другую локацию»
не должно быть просто сообщением.
Оно связано с:
Project
Scene: Couple Walk
Timeline
Location
Weather Change
Photographer
Coordinator
3. Communication Is Contextual
В системе существует несколько уровней общения:
Organization
Project
Team
Scene
Task
Object
Direct
Client
Каждый канал имеет собственный scope.
4. Communication Types
Минимальная модель:
Project Chat
Team Chat
Scene Chat
Task Discussion
Direct Message
Client Chat
Announcement
System Message
5. Project Chat
Главный коммуникационный канал проекта.
Участники:
организатор;
координатор;
руководители команд;
необходимые подрядчики.
Project Chat не обязан быть доступен всем участникам проекта.
6. Team Chat
Чат команды.
Например:
Photo Team
Video Team
Decoration Team
Technical Team
Transport Team
Команда может обсуждать внутренние вопросы, не создавая шум для остальных участников.
7. Scene Chat
Чат конкретной сцены Timeline.
Например:
Scene:
Outdoor Ceremony
В него могут входить:
организатор;
ведущий;
фотограф;
видеограф;
декоратор;
технический специалист.
После завершения сцены коммуникация сохраняется в истории.
8. Task Discussion
Каждая Task может иметь обсуждение.
Например:
Retouch Task #482
Сообщения:
Photographer:
Нужно убрать отражение в очках.

Retoucher:
Принял.

Retoucher:
Готово.
Это лучше, чем искать эту информацию в общем чате.
9. Direct Messages
Пользователи могут общаться напрямую.
Но Direct Message не должен заменять проектную коммуникацию.
Если информация относится к Project, пользователь должен иметь возможность:
Convert to Project Context
или:
Attach to Scene
Attach to Task
Attach to Object
10. Client Chat
Клиент получает отдельный communication scope.
Например:
Organizer
Photographer
Client
Клиент не должен видеть:
внутренние чаты;
финансовые обсуждения;
внутренние заметки;
обсуждение подрядчиков;
технические конфликты.
11. Temporary Client Access
Молодожены получают временный аккаунт или access link.
Project
 ↓
Client Workspace
 ↓
Temporary Access
После завершения проекта доступ может:
завершиться;
перейти в архив;
остаться только для просмотра результатов.
12. Communication and Permissions
Каждый канал является объектом permission system.
Минимально:
READ_CHAT
MESSAGE_CHAT
ADD_MEMBER
REMOVE_MEMBER
ARCHIVE_CHAT
13. Channel Membership
Доступ к чату может определяться:
Role
+
Project
+
Team
+
Scene
+
Task
+
Explicit Membership
Например:
Driver
может автоматически попасть в:
Transport Chat
но не в:
Decorator Internal Chat
14. Contextual Membership
Участник может быть добавлен в чат автоматически из графа.
Например:
Scene:
Transfer to Venue

Participants:
Driver
Organizer
Photographer
Videographer
Система может автоматически создать или активировать коммуникационный контекст.
15. Communication Graph
Project
│
├── Project Chat
│
├── Team
│   └── Team Chat
│
├── Scene
│   └── Scene Chat
│
├── Task
│   └── Task Discussion
│
├── Client
│   └── Client Chat
│
└── Direct Messages
16. Message Model
Концептуально:
Message
│
├── id
├── author
├── channel
├── timestamp
├── content
├── attachments
├── references
├── mentions
├── reactions
├── status
└── context
17. Message Context
Сообщение может быть связано с:
Project
Team
Scene
Task
Timeline Event
Location
Document
File
Client
Contractor
18. Context Attachment
Например:
Message:
«Здесь нужно быть на 15 минут раньше»

Context:
Scene #18
Location: Restaurant
Time: 18:15
При открытии сообщения пользователь может перейти непосредственно к Scene.
19. Message References
Сообщение может ссылаться на объекты.
Например:
«Посмотри маршрут»
может содержать:
[Route]
или:
[Timeline 14:30 → 15:10]
20. Mentions
Поддерживаются:
@Алексей
@Фотографы
@Организаторы
@Team
Но массовые mentions должны использоваться осторожно.
21. Role-Based Mentions
Полезный механизм:
@photographers
@drivers
@decorators
@organizers
Система автоматически определяет участников соответствующей роли.
22. Context Mentions
Можно упоминать участников текущей сцены:
@scene
или:
@participants
Система уведомляет только релевантных участников.
23. Smart Mention
При вводе:
@фотограф
система может предложить:
Иван — фотограф
Алексей — второй фотограф
24. Message Types
Не все сообщения должны быть обычным текстом.
Минимально:
TEXT
IMAGE
FILE
VOICE
LINK
SYSTEM
CHANGE
TASK
LOCATION
25. System Messages
Система сама создаёт сообщения о значимых событиях.
Например:
Timeline изменён
или:
Фотограф назначен на сцену
или:
Ретушь завершена
26. System Message ≠ Notification
System Message записывается в коммуникационный контекст.
Notification доставляет информацию пользователю.
Один System Event может привести к:
Chat Message
+
Push Notification
+
Timeline Update
или только к одному из них.
27. Change Messages
Особенно важны сообщения об изменениях.
Например:
14:30
Ceremony
изменилось на:
15:00
Ceremony
Система должна создать структурированное событие:
Timeline changed
14:30 → 15:00
28. Change Propagation
После изменения система определяет затронутых участников.
Timeline Change
 ↓
Graph
 ↓
Affected Nodes
 ↓
Permissions
 ↓
Relevant Users
 ↓
Notifications
Не все участники проекта должны получать сообщение.
29. Example
Изменился маршрут фотографа.
Затронуты:
Photographer
Videographer
Driver
Organizer
Coordinator
Не обязательно затронуты:
Retoucher
Florist
Cake
Client
если изменение не влияет на них.
30. Communication as Event Stream
Коммуникационный слой должен уметь отображать историю событий:
Timeline changed
Location changed
Driver assigned
Photographer arrived
Weather warning
Task completed
Gallery delivered
Это превращает чат из простой переписки в историю проекта.
31. Human Message vs Event
Нужно различать:
Human Message
и:
System Event
Пример:
Алексей:
«Ребята, после дождя сразу едем в ресторан»
и:
SYSTEM:
Weather alert triggered.
Outdoor Scene moved to Indoor Location.
32. Event Explanation
Системное событие должно быть понятно человеку.
Не:
NODE_UPDATE_38482
а:
Прогулка перенесена в интерьер из-за дождя.
33. Communication and Timeline
Timeline является главным объектом коммуникации.
Любое важное изменение Timeline может порождать communication event.
Timeline
 ↓
Change
 ↓
Affected Participants
 ↓
Communication
34. Communication and Navigator
Navigator должен использовать коммуникационные события.
Например:
Навигатор:
Через 20 минут переезд.
Маршрут изменён.
Новая точка — ресторан.
Пользователю не нужно искать это сообщение в чате.
35. Chat Is Not the Primary Interface
Чат не должен становиться главным интерфейсом системы.
Основные интерфейсы:
Timeline
Navigator
Workspace
Context
Чат — коммуникационный слой поверх них.
36. The Rescue Room Principle
Communication должна поддерживать принцип:
Это выручай-комната, где каждый находит то, что ему нужно именно сейчас.
Поэтому система должна извлекать информацию из сообщений и привязывать её к графу.
37. Information Extraction
Из сообщения:
«Если будет дождь, переносим фотосессию в ресторан»
система может определить:
Condition:
Weather = Rain

Action:
Move Scene

Scene:
Photo Session

Alternative:
Restaurant
Это может быть предложено пользователю как структурированное изменение.
Но AI не должен самостоятельно менять критические данные без подтверждения.
38. AI Is Optional
Communication должна работать без AI.
Без AI пользователь может:
писать сообщения;
создавать чаты;
прикреплять объекты;
отправлять файлы;
менять Timeline;
получать уведомления.
AI добавляет:
классификацию;
резюме;
извлечение задач;
поиск изменений;
ответы по контексту.
39. AI Suggestions
AI может предложить:
«Похоже, сообщение относится к сцене "Прогулка".
Привязать?»
или:
«В сообщении указано изменение времени.
Изменить Timeline с 16:00 на 16:30?»
Пользователь подтверждает действие.
40. AI Must Not Become the Gatekeeper
Нельзя требовать AI для понимания коммуникации.
Все критические данные должны существовать структурированно.
Message
+
Structured Event
а не только:
Message
41. Structured Communication
Важные изменения должны превращаться в структурированные объекты.
Например:
Message
 ↓
"Фотограф приедет на час позже"
 ↓
Potential Change
 ↓
Organizer confirms
 ↓
Timeline Update
42. Message-to-Object
Сообщение может создавать:
Task
Change
Scene Note
Location
Reminder
Decision
Но критические действия требуют подтверждения.
43. Decisions
Особый тип коммуникационного объекта:
Decision
Например:
Decision:
Outdoor ceremony moved indoors.

Made by:
Organizer

Timestamp:
14:32

Affected:
Ceremony
Decoration
Photography
Video
Sound
Это значительно важнее обычной переписки.
44. Decision Log
Project должен иметь журнал решений.
Decision Log
│
├── Timeline changes
├── Location changes
├── Vendor changes
├── Client decisions
├── Production decisions
└── Emergency decisions
45. Why Decision Log Matters
Через неделю невозможно восстановить:
Почему мы перенесли фотосессию?
Decision Log должен ответить:
Что?
Почему?
Кто?
Когда?
Кого затронуло?
46. Communication Search
Поиск должен искать не только текст.
Пользователь должен иметь возможность найти:
Сообщения о ресторане
Изменения маршрута
Решения организатора
Все сообщения фотографа
Обсуждения конкретной сцены
47. Context Search
Например:
"дождь"
может вернуть:
Weather Alert
Timeline Change
Messages
Decisions
Location Changes
48. Search by Object
Пользователь может открыть:
Scene: Couple Walk
и увидеть:
Timeline
Weather
Location
Messages
Changes
Tasks
Files
в одном контексте.
49. Communication History
История должна сохраняться после завершения события.
Это особенно важно для:
клиента;
фотографа;
видеографа;
постпродакшена;
юридических вопросов;
повторных заказов.
50. Post-Event Communication
После мероприятия коммуникация меняет характер.
Event
 ↓
Production
 ↓
Post-production
 ↓
Delivery
 ↓
Feedback
 ↓
Upsell
Например, для фотографа:
Съемка завершена
 ↓
Файлы переданы
 ↓
Ретушь завершена
 ↓
Галерея готова
 ↓
Клиент получил
 ↓
Feedback
 ↓
Фотокнига
51. Photographer Client Communication
После передачи фотографий система должна помогать продолжить отношения с клиентом.
Например:
Gallery delivered
 ↓
Client viewed
 ↓
Feedback
 ↓
Photo book offer
 ↓
Additional shoot
Это не должно быть агрессивным маркетингом.
52. Communication and CRM
Communication является частью CRM-графа.
Она позволяет увидеть:
Client
 ↓
Project
 ↓
Messages
 ↓
Decisions
 ↓
Orders
 ↓
Future opportunities
53. Cross-Project Communication
По умолчанию Project isolation.
Но один User может участвовать в нескольких проектах.
User
├── Project A
├── Project B
└── Project C
Система не должна смешивать их чаты.
54. Organization Communication
Организация может иметь внутренние каналы:
Agency
├── Management
├── Photography
├── Video
├── Production
└── General
Они не относятся к конкретной свадьбе.
55. External Communication
Некоторые исполнители могут не иметь постоянного аккаунта.
Система должна позволять:
Invite
 ↓
Temporary Access
 ↓
Project Chat
 ↓
Complete Work
 ↓
Access Expires
56. One-Day Worker
Однодневный водитель:
10:00
Invite

10:05
Receives access

10:30
Reads route

14:00
Updates arrival

23:00
Access expires
Ему не нужен:
полноценный CRM;
список всех проектов;
организация;
долгосрочный профиль.
57. Communication UX for One-Day Workers
Интерфейс должен быть максимально простым:
TODAY
│
├── Current Task
├── Next Point
├── Chat
└── Contact Organizer
58. Unread Model
Unread должен учитывать контекст.
Необходимо различать:
Unread Project Messages
Unread Scene Messages
Unread Direct Messages
Unread Important Changes
59. Priority
Сообщения могут иметь priority:
NORMAL
IMPORTANT
URGENT
URGENT используется редко.
60. Urgent Communication
Urgent сообщение может:
вызвать push;
появиться в Navigator;
показать баннер;
временно закрепиться в Workspace.
Но даже urgent сообщение должно проходить permission filtering.
61. Communication States
Message:
SENT
DELIVERED
READ
EDITED
DELETED
Для системных событий:
CREATED
ACKNOWLEDGED
RESOLVED
62. Acknowledgement
Для критических изменений можно использовать:
ACK
Например:
ORGANIZER:
Маршрут изменился.
Фотограф → ACK
Водитель → ACK
Это полезнее обычного "прочитано".
63. Critical Change
Для некоторых изменений требуется подтверждение.
Например:
Change:
Ceremony location changed.
Система может показывать:
Требуется подтверждение:
Photographer
Videographer
Host
Sound
64. Communication and Graph
Каждое сообщение является потенциальным ребром графа.
User
 ↕
Message
 ↕
Context Object
Например:
Photographer
  ↓
Message
  ↓
Scene
  ↓
Location
  ↓
Driver
65. Communication Graph Example
flowchart LR
    Photographer --> Message
    Organizer --> Message
    Driver --> Message

    Message --> Scene
    Scene --> Timeline
    Scene --> Location

    Timeline --> Photographer
    Location --> Driver
    66. Communication and Changes
Изменение должно иметь propagation graph.
Change
 ↓
Affected Objects
 ↓
Affected Roles
 ↓
Affected Users
 ↓
Communication Channels
 ↓
Notifications
67. Avoid Notification Spam
Главная проблема системы:
если всё уведомляет обо всём, пользователь перестает воспринимать уведомления.
Поэтому:
Event
 ↓
Relevance Calculation
 ↓
Priority
 ↓
Notification Policy
68. Role-Aware Communication
Фотограф получает:
Изменение времени съемки
Изменение маршрута
Изменение света
Изменение локации
Ретушер получает:
Изменение требований к обработке
Изменение дедлайна
Новые файлы
Водитель получает:
Изменение маршрута
Изменение времени
Новый пассажир
69. Context Compression
Пользователю не обязательно показывать всю историю.
Например, фотограф утром получает:
TODAY

09:30
Makeup

11:00
Ceremony

13:40
Transfer

14:00
Photo Session

17:30
Golden Hour
А не 127 сообщений из проекта.
70. Communication Summary
Workspace может показывать:
3 important changes
2 unread messages
1 decision
1 task requiring response
71. Communication Inbox
Inbox — это не список всех сообщений.
Это список коммуникаций, которые требуют внимания пользователя.
Например:
ATTENTION
│
├── Маршрут изменён
├── Организатор ждёт подтверждения
├── Ретушер задал вопрос
└── Клиент оставил сообщение
72. Navigator Integration
Вместо:
12 unread messages
Navigator может показать:
Через 20 минут:
новая локация.

Организатор изменил маршрут.
73. Communication and "Movie From the Middle"
Новая роль может подключиться к проекту поздно.
Например:
Photographer
joined 2 days before wedding.
Система должна дать ему:
What happened?
What matters to me?
What changed?
What do I need to know?
What happens next?
а не заставлять читать всю историю чата.
74. Catch-Up
Специальный механизм:
Catch Up
может показать:
Since you joined:
3 important decisions
2 timeline changes
1 location change
4 relevant messages
75. Role-Specific Catch-Up
Фотограф получает:
Photography changes
Timeline
Locations
Client
Weather
Водитель:
Routes
Passengers
Times
Pickup changes
Ведущий:
Program
Speakers
Music
Stage
Timing
76. Communication Lifecycle
Message Created
 ↓
Delivered
 ↓
Read
 ↓
Referenced / Resolved
 ↓
Archived
Но сообщение не должно исчезать из истории.
77. Archive
После завершения Project коммуникация становится архивной.
Архив должен сохранять:
сообщения;
решения;
изменения;
файлы;
связи с объектами.
78. Legal and Audit Considerations
Communication может иметь юридическое значение.
Поэтому система должна сохранять:
Author
Timestamp
Project
Context
Edit History
Deletion State
Но наличие сообщения само по себе не должно автоматически трактоваться системой как юридически значимое соглашение.
79. Editing Messages
Измененное сообщение должно сохранять:
original
edited
edited_at
edited_by
Для обычной коммуникации можно показывать:
edited
Для критических решений желательно сохранять полную историю.
80. Deleting Messages
Удаление должно быть логическим.
deleted = true
История может сохраняться в Audit Log в зависимости от типа сообщения и политики организации.
81. Attachments
Сообщения могут содержать:
изображения;
документы;
видео;
аудио;
файлы;
ссылки;
объекты системы.
Attachment должен иметь собственные permissions.
82. Communication and Files
Если фотограф отправляет ретушеру файл через сообщение:
Message
 ↓
File
 ↓
Retouch Task
файл не должен автоматически становиться доступным всему Project.
83. External Links
Система может разрешать внешние ссылки:
Wfolio
Google Maps
Drive
Website
Contractor website
Но внешний ресурс не считается частью permission system, пока он не интегрирован.
84. Wfolio Integration
Для фотографа:
Gallery Ready
 ↓
Wfolio
 ↓
Client Delivery
 ↓
Communication
Система может отправить клиенту сообщение:
Ваши фотографии готовы.
Но сама не обязана становиться системой хранения фотографий.
85. Communication Integrations
Архитектура должна предусматривать интеграции:
Email
SMS
Telegram
WhatsApp
Push
Но внутренний Communication Layer остается источником проектного контекста.
Внешние каналы являются транспортами.
86. Transport vs Source of Truth
Важно:
Communication Layer
        ↓
Source of Context
а:
Telegram
WhatsApp
Email
SMS
        ↓
Transport
Внешнее сообщение не должно автоматически считаться структурированным изменением проекта.
87. External Message Import
В будущем система может принимать внешние сообщения.
Например:
WhatsApp:
"Мы задержимся на 20 минут"
Система может предложить:
Похоже, это влияет на Scene #12.
Создать изменение Timeline?
88. Confirmation
Критические изменения:
External Message
 ↓
AI / Rule Detection
 ↓
Suggested Change
 ↓
Organizer Confirmation
 ↓
Graph Update
 ↓
Notifications
89. No Silent Changes
Нельзя позволять обычному сообщению автоматически менять:
Timeline;
Budget;
Contract;
Assignment;
Client data.
без соответствующего подтверждения.
90. Communication Data Model
Channel
│
├── id
├── type
├── project_id
├── scope
├── participants
└── permissions
Message
│
├── id
├── channel_id
├── author_id
├── content
├── type
├── created_at
├── edited_at
├── deleted_at
├── references
└── attachments
91. Event Model
CommunicationEvent
│
├── id
├── project_id
├── source
├── type
├── actor
├── object
├── timestamp
├── affected_nodes
└── metadata
92. Architecture
flowchart TD
    User --> CommunicationLayer

    CommunicationLayer --> Channel
    CommunicationLayer --> Message
    CommunicationLayer --> Event

    Channel --> Permissions
    Message --> Context
    Event --> Graph

    Graph --> AffectedUsers
    AffectedUsers --> NotificationEngine
    Context --> ContextEngine

    ContextEngine --> Workspace
    ContextEngine --> Navigator
93. Communication Flow
User sends message
        ↓
Authentication
        ↓
Permission Check
        ↓
Message Created
        ↓
Context Resolution
        ↓
References / Mentions
        ↓
Affected Participants
        ↓
Notification Policy
        ↓
Delivery
94. Change Communication Flow
Timeline Changed
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
Communication Event
        ↓
Notification
        ↓
Navigator / Workspace
95. Communication Rules
Communication is contextual
Сообщение должно иметь возможность быть связано с объектом работы.
Chat is not the system
Чат — только один из интерфейсов коммуникации.
Timeline is central
Изменения Timeline являются одним из главных источников коммуникационных событий.
Role matters
Разные роли получают разные сообщения.
Permissions always apply
Чат никогда не обходят permission system.
Client is isolated
Клиент видит только разрешенную коммуникацию.
Temporary users are first-class
Однодневный исполнитель должен иметь нормальный коммуникационный контур без создания сложного аккаунта.
Important changes become structured events
Критические изменения не должны оставаться только текстом.
AI is optional
Без AI коммуникация должна полностью работать.
AI cannot silently change data
AI предлагает изменения, но критические изменения подтверждаются.
External messengers are transports
Они не должны становиться источником истины проекта.
Avoid notification spam
Пользователь получает только релевантные события.
Catch-up is mandatory
Новый участник должен быстро понять, что произошло до его подключения.
96. Success Criteria
Communication System считается корректной, если:
Каждый пользователь имеет доступ только к релевантным каналам.
Каналы могут быть связаны с Project, Team, Scene и Task.
Сообщения могут ссылаться на объекты системы.
Timeline Changes могут становиться Communication Events.
Communication учитывает Role.
Communication учитывает Permissions.
Client имеет отдельный communication scope.
Temporary Workers могут пользоваться чатами без полноценного аккаунта.
Есть Direct Messages.
Есть Project и Team Chats.
Есть Scene и Task Discussions.
Есть Decision Log.
Есть Catch-Up для новых участников.
Есть контекстный Inbox.
Navigator может использовать коммуникационные события.
Notifications не раскрывают запрещенную информацию.
AI не имеет обхода permissions.
Критические изменения требуют подтверждения.
Внешние мессенджеры не являются source of truth.
История коммуникации сохраняется после завершения Project.
97. Communication Statement
Communication — это не встроенный мессенджер, а слой связей между людьми, событиями и объектами проекта. Сообщение должно знать, к чему оно относится, а система должна знать, кого это сообщение действительно касается. Project, Timeline, Scene, Task, Role и Permission образуют единый коммуникационный граф. Пользователь не должен читать сотню сообщений, чтобы понять, что происходит: система должна доставить ему именно тот контекст, который нужен сейчас.
