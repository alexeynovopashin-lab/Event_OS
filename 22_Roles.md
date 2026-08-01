Roles
Document: 22_Roles.md
Version: 0.1.0
Status: Draft
Depends on:
00_North_Star.md
10_Architecture.md
11_Graph_Model.md
20_Workspaces.md
21_Projects.md
1. Purpose
Role — это описание функции участника в конкретном контексте.
Role определяет:
что пользователь делает;
какие сущности ему необходимы;
какие действия он может выполнять;
какой контекст он получает;
с кем он взаимодействует;
в каких проектах и командах участвует.
Role не должна быть равна User.
Один User может иметь несколько ролей.
2. Core Principle
User ≠ Role ≠ Permission ≠ Team
Это четыре разных понятия.
User
Конкретный человек или учетная запись.
Role
Функция человека в конкретном Project.
Team
Группа участников, работающих вместе.
Permission
Разрешение на конкретное действие или доступ к данным.
3. Example
Один человек:
User:
Алексей
может иметь:
Project A → Photographer
Project B → Organizer
Project C → Second Photographer
При этом набор доступных действий в каждом Project различается.
4. Role Is Contextual
Роль существует внутри контекста.
User
  ↓
Organization
  ↓
Project
  ↓
Role
  ↓
Permissions
Нельзя считать, что человек является фотографом во всей системе только потому, что он зарегистрирован как фотограф.
5. Role Categories
Базовые категории:
Management
Production
Creative
Technical
Service
Client
External
6. Event Management Roles
6.1 Organizer
Основная роль управления мероприятием.
Ответственность:
клиент;
Project;
команды;
подрядчики;
Timeline;
документы;
коммуникация;
изменения;
контроль подготовки.
Organizer имеет наиболее широкий контекст.
6.2 Event Coordinator
Координатор отвечает за исполнение плана.
Основные задачи:
контроль Timeline;
координация исполнителей;
контроль прибытия;
оперативные изменения;
коммуникация во время мероприятия.
Координатор может иметь почти такой же операционный контекст, как организатор, но не обязательно имеет доступ к коммерческой части Project.
6.3 Event Manager
Роль для более крупных мероприятий.
Может отвечать за:
несколько команд;
площадку;
подрядчиков;
техническое исполнение;
оперативные решения.
6.4 Assistant
Помощник организатора.
Доступ ограничивается конкретными задачами и контекстами.
7. Photography Roles
7.1 Photographer
Фотограф отвечает за:
съемку;
Timeline съемки;
взаимодействие с клиентом;
работу с локациями;
свет;
shot list;
передачу материалов;
постпродакшен.
Фотограф может продолжать работу после Event.
7.2 Lead Photographer
Главный фотограф команды.
Может иметь дополнительные полномочия:
распределение работы;
координация второго фотографа;
контроль материала;
взаимодействие с организатором.
7.3 Second Photographer
Второй фотограф.
Получает только необходимый ему контекст:
собственные сцены;
позиции;
Timeline;
контакты;
технические указания.
7.4 Photo Assistant
Помогает фотографу:
оборудование;
свет;
организация съемки;
перемещение;
подготовка сцены.
Не обязательно получает доступ к клиентским данным.
7.5 Retoucher
Работает после съемки.
Основной контекст:
Files
↓
Retouch Task
↓
Requirements
↓
Delivery
Ретушеру не требуется полный Timeline свадьбы.
7.6 Colorist
Работает с цветокоррекцией.
Получает:
материалы;
референсы;
требования;
дедлайн;
статус производства.
7.7 Photo Editor / Curator
Может отвечать за:
отбор;
последовательность;
контроль качества;
подготовку галереи.
8. Video Roles
8.1 Videographer
Отвечает за видеосъемку.
8.2 Lead Videographer
Руководит видеокомандой.
8.3 Second Videographer
Работает с отдельными сценами.
8.4 Video Assistant
Помогает с оборудованием и организацией съемки.
8.5 Video Editor
Получает post-event контекст.
8.6 Sound Editor
Работает с аудио.
8.7 Colorist
Отдельная роль для видеопостпродакшена.
9. Ceremony and Program Roles
9.1 Host / MC
Ведущий.
Основной контекст:
сценарий;
Timeline;
выходы;
участники;
музыка;
технические сигналы;
изменения программы.
Ему не нужен полный граф проекта.
9.2 Ceremony Coordinator
Отвечает за конкретную церемонию.
9.3 Registrar / Official Representative
Если мероприятие включает официальную регистрацию, представитель соответствующей организации может иметь ограниченный временный доступ.
Это типичный temporary role.
10. Music and Entertainment Roles
10.1 DJ
Получает:
Timeline;
музыкальные блоки;
сигналы ведущего;
технические требования;
контакты.
10.2 Live Band
Команда музыкантов.
10.3 Musician
Отдельный исполнитель.
Например:
саксофонист;
пианист;
скрипач;
вокалист.
10.4 Artist / Performer
Артист, шоу-группа или отдельный номер.
10.5 Entertainment Manager
Координатор артистов.
11. Decoration Roles
11.1 Decorator
Отвечает за концепцию и оформление.
11.2 Florist
Работает с флористикой.
11.3 Decor Installation Team
Команда монтажа.
Часто это temporary role.
11.4 Designer
Создает визуальные материалы:
приглашения;
полиграфию;
навигацию;
схемы;
элементы оформления.
12. Venue and Catering Roles
12.1 Venue Manager
Представитель площадки.
12.2 Restaurant Manager
Ответственный со стороны ресторана.
12.3 Banquet Manager
Управляет банкетной частью.
12.4 Catering Manager
Если используется выездной кейтеринг.
12.5 Chef
Может иметь ограниченный доступ к:
меню;
времени подачи;
количеству гостей;
ограничениям.
12.6 Waitstaff / Service Team
Обычно temporary roles.
Им не нужен полный Project.
13. Technical Roles
13.1 Technical Director
Руководит техническим исполнением.
13.2 Sound Engineer
Отвечает за звук.
13.3 Lighting Engineer
Отвечает за свет.
13.4 Stage Manager
Контролирует сцену.
13.5 AV Operator
Работает с:
экранами;
проекцией;
видео;
презентациями.
13.6 Technician
Универсальная техническая роль.
13.7 Rigging / Installation Team
Монтаж и демонтаж технического оборудования.
14. Transport Roles
14.1 Driver
Получает:
точки;
время;
пассажиров;
контакты;
изменения маршрута.
Не получает полный Project.
14.2 Transport Coordinator
Координирует несколько автомобилей и водителей.
14.3 Shuttle Driver
Для групповой перевозки гостей.
15. Special Effects
15.1 Pyrotechnics Operator
Работа с пиротехническими эффектами.
Получает только необходимую информацию:
место;
время;
разрешенные зоны;
ответственные лица;
технические условия.
15.2 Special Effects Operator
Другие эффекты:
дым;
конфетти;
CO₂;
сценические эффекты.
16. Guest Experience Roles
16.1 Guest Manager
Отвечает за гостей.
16.2 Guest Coordinator
Помогает гостям ориентироваться во время мероприятия.
16.3 Hostess
Встречает гостей.
16.4 Security
Доступ только к информации, необходимой для безопасности и работы.
17. Beauty Roles
Для свадеб и других мероприятий:
17.1 Makeup Artist
17.2 Hair Stylist
17.3 Stylist
17.4 Dressing Assistant
Эти роли могут иметь Timeline конкретного клиента, но не полный Project.
18. Wedding-Specific Roles
В свадебном Project могут присутствовать:
свадебный координатор;
распорядитель;
церемониймейстер;
стилист;
визажист;
парикмахер;
фотограф;
видеограф;
второй фотограф;
ведущий;
DJ;
музыканты;
декоратор;
флорист;
кондитер;
ресторан;
кейтеринг;
водитель;
технический директор;
звукорежиссер;
светотехник;
пиротехник;
артист;
охрана;
координатор гостей.
19. Roles Are Extensible
Система не должна иметь закрытый список ролей.
Новая роль должна создаваться без изменения ядра.
Например:
Role
├── name
├── category
├── permissions
├── context_profile
├── timeline_profile
└── workspace_profile
20. Role Profile
Каждая роль имеет профиль.
Role Profile
│
├── Identity
├── Responsibilities
├── Permissions
├── Context
├── Timeline
├── Notifications
├── Workspace
└── Communication
21. Role Context Profile
Role Context Profile определяет, какая информация обычно нужна роли.
Например:
Photographer
│
├── Client
├── Locations
├── Timeline
├── Light
├── Weather
├── Route
├── Shot List
├── Contacts
└── Production
Ведущий:
Host
│
├── Timeline
├── Program
├── Speakers
├── Music
├── Stage
└── Signals
Водитель:
Driver
│
├── Route
├── Pickup
├── Dropoff
├── Time
├── Passengers
└── Contact
22. Role Does Not Define Everything
Role Profile — базовая модель.
Фактический контекст определяется:
Role
+
Project
+
Team
+
Scene
+
Time
+
Permissions
+
Dependencies
+
Changes
Поэтому два фотографа могут получить разный контекст.
23. Role Permissions
Role может предоставлять базовые разрешения.
Но фактический доступ вычисляется контекстно.
Role Permissions
        +
Project Permissions
        +
Team Permissions
        +
Object Permissions
        +
Temporary Restrictions
24. Read vs Write
Каждая permission должна различать как минимум:
READ
CREATE
UPDATE
DELETE
Дополнительно могут существовать:
ASSIGN
APPROVE
PUBLISH
INVITE
EXPORT
SHARE
25. Example: Photographer
Фотограф может:
READ:
    Timeline
    Client Contact
    Locations
    Weather
    Shot List

UPDATE:
    Own Tasks
    Own Production Status

CREATE:
    Notes
    Messages

UPLOAD:
    Files

SHARE:
    Delivery Link
Но не обязательно может:
DELETE Project
EDIT Contract
CHANGE Financial Status
REMOVE Organizer
26. Example: Temporary Driver
Водитель может:
READ:
    Route
    Pickup
    Dropoff
    Time
    Passenger Contact

UPDATE:
    Arrival Status
    Trip Status

MESSAGE:
    Organizer
После завершения Project доступ прекращается.
27. Temporary Roles
Temporary Role является полноценной ролью с ограниченным lifecycle.
Role Assignment
│
├── role
├── project
├── user
├── start_at
├── end_at
└── permissions
Пример:
Driver
Project: Wedding #2048
Start: 13:00
End: 23:00
28. Role Assignment
Роль назначается не пользователю глобально, а в контексте.
User
    ↓
Role Assignment
    ↓
Project
29. Multiple Roles
Один человек может иметь несколько ролей в одном Project.
Например:
User
│
├── Photographer
└── Photo Team Lead
Или:
User
│
├── DJ
└── Sound Engineer
Система должна объединять разрешения без создания второго аккаунта.
30. Role Conflict
Если две роли имеют конфликтующие permissions, действует более ограничительное правило.
Пример:
Role A → READ
Role B → READ + WRITE
Project restriction → READ
Результат:
READ
Ограничение уровня Project имеет приоритет.
31. Team Roles
Роль может назначаться:
человеку;
команде.
Например:
Photo Team
Role: Photography
А внутри:
Lead Photographer
Second Photographer
Assistant
32. Organization Roles
Отдельно существуют роли внутри организации:
Owner;
Administrator;
Manager;
Member.
Они не должны смешиваться с Event Roles.
Например:
User
│
├── Organization Role: Member
└── Project Role: Photographer
33. Organization Role
Organization Role отвечает за управление самой организацией:
Owner
Administrator
Manager
Member
Он не определяет, что человек делает на конкретном мероприятии.
34. Event Role
Event Role определяет работу человека в конкретном мероприятии.
Photographer
Driver
Host
Florist
Retoucher
35. Role Hierarchy
Необходимо различать иерархию ответственности.
Например:
Photography Team
│
├── Lead Photographer
├── Photographer
├── Second Photographer
└── Assistant
Но это не обязательно означает наследование permissions.
Иерархия ответственности и технические права должны быть независимыми.
36. Responsibility vs Permission
Например, Lead Photographer отвечает за команду.
Но это не значит, что он автоматически получает доступ ко всей бухгалтерии Project.
Responsibility ≠ Permission
37. Role and Navigator
Role определяет базовый профиль Navigator.
Role
  ↓
Context Profile
  ↓
Navigator
Например:
Photographer
→ current scene
→ next location
→ light
→ weather
→ shot list
38. Role and Timeline
Role определяет персональную проекцию Timeline.
Полный Timeline:
10:00
12:00
14:00
16:00
18:00
20:00
22:00
Timeline фотографа:
10:00
12:00
14:00
16:00
18:30 Golden Hour
Timeline водителя:
12:30 Pickup
13:00 Venue
15:30 Transfer
39. Role and Context Engine
Context Engine использует Role как один из основных факторов:
Context =
f(
    User,
    Role,
    Project,
    Team,
    Scene,
    Time,
    Location,
    Dependencies,
    Changes
)
Role не определяет контекст полностью.
Она задает его начальную модель.
40. Role and Chat
Role влияет на доступ к коммуникации.
Например:
Organizer
Может иметь доступ к большинству Project-level чатов.
Photographer
Получает:
organizer;
photo team;
client;
relevant scene chats.
Driver
Получает:
organizer;
transport;
relevant passenger communication.
Client
Получает:
organizer;
own communication;
разрешенные Project channels.
41. Role and Documents
Role влияет на релевантность документов.
Например:
Photographer
→ Shot List
→ Route
→ Venue Plan
Sound Engineer
→ Technical Rider
→ Stage Plan
→ Input List
Driver
→ Route Sheet
→ Pickup List
42. Role and Notifications
Notifications должны учитывать роль.
Одно изменение может:
Organizer → immediate notification
Photographer → immediate notification
Driver → immediate notification
Client → no notification
если изменение затрагивает только операционную часть.
43. Role and Temporary Access
Temporary Role должна иметь:
начало;
конец;
scope;
permissions;
Workspace;
notification policy.
После завершения доступа:
Active
  ↓
Expired
История действий сохраняется.
44. Role Audit
Все значимые действия должны быть связаны с:
User
Role
Project
Timestamp
Action
Object
Например:
2026-08-24 13:42
User: Ivan
Role: Organizer
Action: UPDATE
Object: Timeline / Ceremony
Это необходимо для:
аудита;
разрешения конфликтов;
истории изменений;
безопасности.
45. Role Templates
Организация может создавать собственные Role Templates.
Например:
Agency Photographer
Agency Coordinator
Agency Assistant
Шаблон может задавать:
permissions;
context;
notifications;
Workspace;
стандартные процессы.
46. Custom Roles
Пользователь должен иметь возможность создать роль:
Role:
Wedding Content Creator
с набором необходимых возможностей.
Это особенно важно для новых профессий и нестандартных мероприятий.
47. Role Naming
Название роли является отображаемым значением.
Внутренний идентификатор не должен зависеть от языка.
Например:
role_id:
photographer

display_name:
Фотограф
В другой локали:
Photographer
48. Role Localization
Названия и описания ролей должны поддерживать локализацию.
Архитектура не должна быть привязана к одному языку.
49. Role Data Model
Концептуально:
Role
│
├── id
├── name
├── category
├── description
├── context_profile
├── workspace_profile
├── timeline_profile
├── notification_profile
└── permissions
Назначение:
RoleAssignment
│
├── user_id
├── role_id
├── organization_id
├── project_id
├── team_id
├── starts_at
├── ends_at
├── scope
└── permissions_override
50. Role Architecture
flowchart TD
    User --> RoleAssignment
    RoleAssignment --> Role
    RoleAssignment --> Project
    RoleAssignment --> Team

    Role --> Permissions
    Role --> ContextProfile
    Role --> WorkspaceProfile
    Role --> TimelineProfile
    Role --> NotificationProfile

    Permissions --> Access
    ContextProfile --> ContextEngine
    WorkspaceProfile --> Workspace
    TimelineProfile --> Timeline
    NotificationProfile --> Notifications
51. Role Rules
User is not a role
Роль назначается в контексте.
Role is contextual
Один пользователь может иметь разные роли.
Role does not equal permission
Ответственность и доступ разделены.
Temporary roles are first-class
Однодневный исполнитель — нормальный сценарий.
Roles are extensible
Новые профессии не требуют изменения ядра.
Organization roles and event roles are separate
Управление организацией не смешивается с работой на мероприятии.
One user can have multiple roles
Не требуется создавать несколько аккаунтов.
Role affects context
Но не определяет его полностью.
Role affects navigation
Персональный Timeline и Navigator строятся с учетом роли.
Restrictive permissions win
Более строгие ограничения имеют приоритет.
52. Success Criteria
Система ролей считается корректной, если:
Один пользователь может иметь несколько ролей.
Роль назначается в контексте Project.
Организационные и event-роли разделены.
Права не выводятся только из названия роли.
Однодневные исполнители поддерживаются без полноценного аккаунта.
Роли могут быть пользовательскими.
Роль влияет на Workspace.
Роль влияет на Navigator.
Роль влияет на персональный Timeline.
Роль влияет на релевантность уведомлений.
Роль влияет на доступ к чатам и документам.
Все действия можно связать с User + Role + Project.
Система не ограничена только свадебными профессиями.
Добавление новой роли не требует изменения ядра.
53. Role Statement
Role — это контекстная функция пользователя внутри проекта. Она определяет ответственность, базовый контекст и рабочую проекцию, но не является ни самим пользователем, ни командой, ни набором прав доступа. Благодаря этому один человек может участвовать в разных проектах в разных ролях, а система может одинаково работать с постоянными сотрудниками, агентствами и однодневными исполнителями.
