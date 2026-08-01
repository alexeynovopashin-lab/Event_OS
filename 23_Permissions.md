Permissions
Document: 23_Permissions.md
Version: 0.1.0
Status: Draft
Depends on:
10_Architecture.md
11_Graph_Model.md
12_Context_Engine.md
20_Workspaces.md
21_Projects.md
22_Roles.md
1. Purpose
Permissions определяют, что пользователь имеет право видеть и делать в системе.
Permissions не определяют роль пользователя.
User
  ↓
Role Assignment
  ↓
Role
  ↓
Permissions
  ↓
Access
Но фактический доступ дополнительно зависит от:
Project;
Team;
конкретного объекта;
контекста;
времени;
временного доступа;
организационных ограничений;
состояния объекта.
2. Core Principle
Главный принцип:
Пользователь должен иметь минимальный доступ, необходимый для выполнения своей работы.
Система не должна работать по принципу:
"Ты фотограф → видишь весь проект"
Она должна работать:
"Ты фотограф → видишь то, что необходимо тебе как фотографу
в данном проекте, команде, сцене и текущий момент."
3. Permission Is Not Visibility
Важно различать:
Permission
и
Context
Permission отвечает:
Может ли пользователь получить доступ к объекту или выполнить действие?
Context отвечает:
Нужно ли показывать этот объект пользователю сейчас?
Например, фотограф может иметь право читать Timeline целиком, но Navigator показывает ему только ближайшие сцены.
4. Permission Layers
Система должна учитывать несколько уровней.
Global
   ↓
Organization
   ↓
Project
   ↓
Team
   ↓
Object
   ↓
Scene
   ↓
Task
   ↓
Temporary Access
Более высокий уровень не должен автоматически давать полный доступ к нижнему.
5. Permission Types
Минимальный набор:
READ
CREATE
UPDATE
DELETE
Дополнительные:
ASSIGN
INVITE
APPROVE
PUBLISH
SHARE
EXPORT
ARCHIVE
TRANSFER
COMMENT
MESSAGE
Набор должен быть расширяемым.
6. READ
Разрешение на чтение объекта.
Примеры:
READ_PROJECT
READ_CLIENT
READ_TIMELINE
READ_SCENE
READ_DOCUMENT
READ_FILE
READ_TASK
READ_FINANCIAL_STATUS
READ_MESSAGE
7. CREATE
Создание объектов.
Например:
CREATE_TASK
CREATE_MESSAGE
CREATE_DOCUMENT
CREATE_NOTE
CREATE_SCENE
CREATE_FILE
8. UPDATE
Изменение существующих объектов.
Например:
UPDATE_TIMELINE
UPDATE_SCENE
UPDATE_TASK
UPDATE_DOCUMENT
UPDATE_PROJECT
UPDATE_STATUS
9. DELETE
Удаление.
DELETE должен быть наиболее ограниченным действием.
В большинстве случаев предпочтительнее:
Archive
или:
Deactivate
вместо физического удаления.
10. ASSIGN
Назначение пользователей или команд.
Например:
ASSIGN_PHOTOGRAPHER
ASSIGN_DRIVER
ASSIGN_TASK
ASSIGN_TEAM
Обычно доступно организатору или менеджеру.
11. INVITE
Добавление участников.
Например:
INVITE_CONTRACTOR
INVITE_CLIENT
INVITE_TEAM_MEMBER
12. APPROVE
Подтверждение состояния.
Например:
APPROVE_TIMELINE
APPROVE_DELIVERY
APPROVE_DOCUMENT
APPROVE_PRODUCTION
13. PUBLISH
Публикация информации наружу.
Например:
PUBLISH_TIMELINE
PUBLISH_GALLERY
PUBLISH_CLIENT_DOCUMENT
14. SHARE
Предоставление объекта другому пользователю.
Например:
SHARE_DOCUMENT
SHARE_FILE
SHARE_GALLERY
SHARE_TIMELINE
15. EXPORT
Выгрузка данных за пределы системы.
Например:
EXPORT_TIMELINE
EXPORT_CONTACTS
EXPORT_DOCUMENTS
EXPORT_FILES
EXPORT должен контролироваться отдельно от READ.
Возможность прочитать данные не означает право выгрузить их.
16. ARCHIVE
Перевод объекта в архив.
Например:
ARCHIVE_PROJECT
ARCHIVE_DOCUMENT
ARCHIVE_TASK
17. TRANSFER
Передача ответственности или объекта.
Например:
TRANSFER_PROJECT
TRANSFER_TASK
TRANSFER_FILE
18. COMMENT
Добавление комментариев.
COMMENT_PROJECT
COMMENT_SCENE
COMMENT_TASK
COMMENT_FILE
19. MESSAGE
Отправка сообщений.
MESSAGE_PROJECT
MESSAGE_TEAM
MESSAGE_SCENE
MESSAGE_DIRECT
20. Permission Scope
Permission должна иметь Scope.
Global
Organization
Project
Team
Scene
Task
Object
Например:
UPDATE_TIMELINE
само по себе недостаточно.
Нужно знать:
UPDATE_TIMELINE
scope: project:123
21. Object-Level Permissions
В некоторых случаях доступ должен назначаться конкретному объекту.
Например:
Photographer
READ
Scene: Wedding Ceremony
но:
Photographer
READ
Scene: Internal Budget Meeting
не имеет.
22. Team-Level Permissions
Команда может иметь общий доступ.
Например:
Photo Team
READ
Project Timeline
Все участники команды получают этот доступ, если нет дополнительных ограничений.
23. Individual Overrides
Права отдельного пользователя могут быть расширены или ограничены.
Team Permission
       ↓
Individual Override
Например:
Photo Team
READ → Client Contact

Assistant
DENY → Client Contact
24. Deny Rules
Explicit deny должен иметь более высокий приоритет, чем обычное разрешение.
Пример:
Role:
READ_FINANCIAL_STATUS

Project:
DENY_FINANCIAL_STATUS
Результат:
DENY
25. Permission Resolution
Общая модель:
Effective Permission =
Role
+
Organization
+
Project
+
Team
+
Object
+
Temporary Access
+
Explicit Deny
Но разрешения должны вычисляться не как простая сумма.
Необходимо учитывать приоритет ограничений.
26. Recommended Priority
От более общего к более конкретному:
Global
↓
Organization
↓
Project
↓
Team
↓
Role Assignment
↓
Object
↓
Temporary Restriction
↓
Explicit Deny
Чем конкретнее правило, тем выше его приоритет.
27. Example
Пользователь:
Photographer
Имеет:
Role:
READ_PROJECT
Но Project содержит:
DENY_FINANCIAL_DATA
Результат:
Project
    READ

Financial Data
    DENY
28. Permission Matrix
Базовая модель:
Resource	Organizer	Photographer	Driver	Host	Client	Retoucher
Project	RW	R	R*	R*	R*	R*
Timeline	RW	R	R*	R*	R*	—
Scene	RW	RW*	R*	RW*	R*	—
Client	RW	R*	R*	R*	—	—
Documents	RW	R*	R*	R*	R*	R*
Files	RW	RW*	—	—	R*	RW*
Tasks	RW	RW*	RW*	RW*	—	RW*
Financial Status	RW	—	—	—	R*	—
Project Chat	RW	RW*	RW*	RW*	R*	—
* означает контекстное ограничение.
Это не окончательная матрица.
Фактический доступ должен вычисляться Permission Engine.
29. Resource Model
Permissions применяются к ресурсам.
Базовые ресурсы:
Organization
Project
Event
Client
Team
User
Role
Timeline
Scene
Location
Task
Document
File
Message
FinancialStatus
Production
Gallery
Архитектура должна позволять добавлять новые ресурсы.
30. Permission Naming
Рекомендуемый формат:
ACTION_RESOURCE
Например:
READ_PROJECT
UPDATE_PROJECT
CREATE_TASK
DELETE_TASK
READ_TIMELINE
UPDATE_TIMELINE
MESSAGE_PROJECT
SHARE_FILE
Внутренние идентификаторы не зависят от языка интерфейса.
31. Resource Ownership
Некоторые объекты имеют владельца.
Например:
Personal Note
может быть доступна только создателю.
Или:
Project
может принадлежать организации.
Ownership является дополнительным фактором разрешения.
32. Shared Resources
Некоторые ресурсы принадлежат Project и используются несколькими участниками.
Например:
Timeline
Venue Plan
Route
Shot List
Доступ к ним контролируется через Project и Object Permissions.
33. Personal Resources
Некоторые объекты являются персональными:
Personal Notes
Personal Preferences
Saved Filters
Workspace State
Они не должны автоматически становиться частью Project.
34. Client Permissions
Client Workspace является отдельным permission scope.
Клиент может:
READ:
    Project Status
    Selected Timeline
    Documents
    Gallery
    Own Communication

CREATE:
    Message
    Feedback

UPDATE:
    Limited Personal Information
Клиент не получает внутренний доступ к Project.
35. Temporary Contractor Permissions
Временный исполнитель получает ограниченный набор прав.
Например:
Driver

READ:
    Assigned Route
    Pickup
    Dropoff
    Relevant Contacts

UPDATE:
    Arrival Status
    Trip Status

MESSAGE:
    Organizer
После окончания срока:
DENY ALL ACTIVE PROJECT ACCESS
История действий сохраняется.
36. Temporary Access Token
Временный доступ может быть представлен:
TemporaryAccess
│
├── user_id
├── project_id
├── role_id
├── scope
├── permissions
├── starts_at
├── expires_at
└── revoked_at
37. Permission Expiration
Permission может иметь срок действия.
Например:
READ_ROUTE
valid:
2026-08-24 12:00
→
2026-08-24 23:00
После этого permission автоматически становится недействительной.
38. Scene Permissions
Иногда пользователю нужна информация только о конкретной сцене.
Например:
Makeup Artist
получает:
READ
Bride Preparation
но не получает доступ к:
Technical Setup
Dinner
Afterparty
39. Task Permissions
Task может иметь собственный scope.
Например:
Retouch Task #482
доступна:
Photographer
Retoucher
Organizer
но не:
Driver
40. Document Permissions
Документ может иметь отдельные права.
Например:
Contract
доступен:
Organizer
Client
но:
Photographer
DENY
41. Financial Permissions
Финансовая информация должна быть выделена в отдельный permission domain.
Например:
READ_FINANCIAL_STATUS
UPDATE_FINANCIAL_STATUS
READ_ACCOUNTING_DATA
EXPORT_ACCOUNTING_DATA
Наличие:
READ_PROJECT
не должно автоматически давать:
READ_ACCOUNTING_DATA
42. Legal Permissions
Юридические документы также должны иметь отдельный scope.
READ_CONTRACT
CREATE_CONTRACT
UPDATE_CONTRACT
SIGN_CONTRACT
SHARE_CONTRACT
При этом система не должна автоматически трактовать наличие документа как юридическое подтверждение.
43. Chat Permissions
Чат имеет собственный permission model.
READ_CHAT
MESSAGE_CHAT
ADD_MEMBER
REMOVE_MEMBER
ARCHIVE_CHAT
Доступ к Project не означает автоматический доступ ко всем чатам.
44. Notification Permission
Уведомления не должны быть равны permissions.
Например:
User:
READ_TIMELINE = true
не означает:
NOTIFY_ON_EVERY_TIMELINE_CHANGE = true
Notification Policy является отдельным слоем.
45. Permission and Context Engine
Permission Engine отвечает:
Что пользователь может получить?
Context Engine отвечает:
Что пользователю нужно показать сейчас?
Graph
 ↓
Permission Engine
 ↓
Allowed Graph
 ↓
Context Engine
 ↓
Relevant Context
 ↓
Workspace
Это фундаментальное разделение.
46. Permission and Navigator
Navigator никогда не должен самостоятельно решать, имеет ли пользователь право видеть объект.
Permission Engine
        ↓
Allowed Objects
        ↓
Context Engine
        ↓
Navigator
Navigator работает только с разрешенным контекстом.
47. Permission and Search
Search также должен работать только по разрешенному графу.
Нельзя:
Search
 ↓
All Database
 ↓
Filter UI
Это создает риск утечки данных.
Правильно:
Search
 ↓
Permission Scope
 ↓
Allowed Graph
 ↓
Search
48. Permission and AI
AI также не должен иметь отдельный обход permission system.
AI получает только тот контекст, который разрешен пользователю.
User
 ↓
Permissions
 ↓
Context
 ↓
AI
Нельзя:
User
 ↓
AI
 ↓
Entire Project Database
49. AI Example
Фотограф спрашивает:
Что изменилось сегодня?
AI должен анализировать только изменения, доступные фотографу.
Он не должен случайно сообщить:
Организатор изменил бюджет на 400 000 ₽.
если фотограф не имеет доступа к финансовым данным.
50. P2P File Permissions
Передача файлов между участниками должна учитывать permissions.
Например:
Photographer
    ↓
P2P Transfer
    ↓
Retoucher
Retoucher получает только файлы, связанные с назначенной задачей.
51. Delivery Permissions
Передача результата клиенту является отдельным действием.
Например:
Photographer
    CREATE_DELIVERY

Client
    READ_DELIVERY
Но клиент не получает доступ к исходным RAW-файлам.
52. Permission Audit
Каждое значимое действие должно записываться.
AuditLog
│
├── timestamp
├── user
├── role
├── organization
├── project
├── resource
├── resource_id
├── action
├── result
└── source
Например:
2026-08-24 18:42
Photographer
Project #2048
READ
Scene #14
ALLOW
Для чувствительных действий audit является обязательным.
53. Security Events
Отдельно следует фиксировать:
неудачные попытки доступа;
попытки доступа после expiration;
попытки получить запрещенный объект;
массовый export;
изменение permissions;
отзыв доступа;
передачу ownership.
54. Permission Changes
Изменение permissions само является защищенным действием.
UPDATE_PERMISSIONS
Оно должно иметь строгий контроль.
Изменение прав должно фиксироваться в Audit Log.
55. Permission Delegation
Организатор может делегировать часть доступа.
Например:
Organizer
    ↓
Coordinator
    ↓
Temporary Permissions
Но делегирование не должно позволять передавать права выше собственных.
56. No Privilege Escalation
Пользователь не может предоставить другому пользователю permission, которой сам не обладает.
User A:
READ + UPDATE

User A → User B:
READ + UPDATE
но не:
User A → User B:
ADMIN
57. Permission Inheritance
Наследование допустимо, но должно быть явным.
Например:
Team
 ↓
Team Members
может наследовать:
READ_SCENE
Но персональный deny должен иметь приоритет.
58. Default Deny
По умолчанию:
NO PERMISSION
Пользователь не получает доступ только потому, что объект существует в Project.
59. Least Privilege
Каждая роль должна получать минимально необходимый набор прав.
Особенно:
Client;
Temporary Contractor;
External Agency;
One-Day Worker.
60. Permissions and Multi-Agency
Если один Project объединяет несколько организаций:
Agency A
Agency B
Agency C
Independent Contractor
доступ должен определяться не только Project Membership.
Каждая организация получает собственный scope.
61. Cross-Organization Access
Пример:
Agency A
Photographer
может иметь:
READ Project
READ Timeline
READ Client Contact
UPLOAD Files
но не:
READ Agency B Internal Notes
READ Agency B Financial Data
62. Permission Model for Large Events
Для больших мероприятий рекомендуется:
Organization
    ↓
Project
    ↓
Team
    ↓
Role
    ↓
Object Scope
Это позволяет избежать ручной настройки каждого пользователя.
63. Permission Model for Small Events
Для небольшой свадьбы система должна работать проще.
Организатор может:
Invite
 ↓
Select Role
 ↓
System suggests permissions
Большинство пользователей никогда не должны видеть сложную permission matrix.
64. Permission UX
Permissions — инфраструктурная система.
Пользователь не должен постоянно управлять ими вручную.
Интерфейс должен работать через понятные действия:
Добавить фотографа
Добавить водителя
Пригласить клиента
Дать доступ к документу
Ограничить доступ
Система сама переводит это в permissions.
65. Permission Presets
Можно использовать готовые пресеты.
Например:
Photographer
Driver
Host
Client
Retoucher
Coordinator
Administrator
Пресет задает базовые permissions.
66. Custom Permission Overrides
Опытный пользователь может изменить конкретное правило.
Например:
Photographer
Preset

+ READ_VENUE_PLAN
+ READ_TECHNICAL_RIDER
- READ_FINANCIAL_STATUS
67. Permission Graph
Permissions сами могут быть представлены как граф зависимостей.
Role
 ↓
Permission
 ↓
Resource
 ↓
Object
 ↓
Context
Это позволяет системе вычислять effective access.
68. Permission Architecture
flowchart TD
    User --> Assignment
    Assignment --> Role
    Assignment --> Project
    Assignment --> Team

    Role --> BasePermissions
    Project --> ProjectPermissions
    Team --> TeamPermissions
    Assignment --> Overrides
    Object --> ObjectPermissions

    BasePermissions --> Resolver
    ProjectPermissions --> Resolver
    TeamPermissions --> Resolver
    Overrides --> Resolver
    ObjectPermissions --> Resolver

    Resolver --> EffectivePermissions
    EffectivePermissions --> ContextEngine
    ContextEngine --> Workspace
    Workspace --> Navigator
flowchart TD
    User --> Assignment
    Assignment --> Role
    Assignment --> Project
    Assignment --> Team

    Role --> BasePermissions
    Project --> ProjectPermissions
    Team --> TeamPermissions
    Assignment --> Overrides
    Object --> ObjectPermissions

    BasePermissions --> Resolver
    ProjectPermissions --> Resolver
    TeamPermissions --> Resolver
    Overrides --> Resolver
    ObjectPermissions --> Resolver

    Resolver --> EffectivePermissions
    EffectivePermissions --> ContextEngine
    ContextEngine --> Workspace
    Workspace --> Navigator
