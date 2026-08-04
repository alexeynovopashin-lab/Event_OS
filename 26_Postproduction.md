# 26_Postproduction.md

````markdown
# Postproduction

**Document:** `26_Postproduction.md`  
**Version:** `0.1.0`  
**Status:** Draft

---

## 1. Назначение

Postproduction описывает часть рабочего процесса, которая продолжается после окончания физического события.

Для фотографа и видеографа работа не заканчивается в момент завершения свадьбы.

Система должна рассматривать производство и постпродакшн как единый непрерывный процесс:

```text
Подготовка
    ↓
Событие
    ↓
Съёмка
    ↓
Передача материала
    ↓
Постпродакшн
    ↓
Проверка
    ↓
Доставка
    ↓
Коммуникация с клиентом
    ↓
Дополнительные услуги
````

Организатору не нужно управлять процессом обработки. Ему необходимо понимать состояние результата.

Фотографу и исполнителям необходима более подробная информация.

---

## 2. Главный принцип

> Событие заканчивается для клиента раньше, чем для создателя результата.

Для организатора достаточно:

```text
Материал получен?
Обработка идёт?
Результат готов?
Клиент получил фотографии?
```

Для фотографа:

```text
Что передано?
Кому?
На каком этапе обработка?
Кто сейчас работает?
Что требует проверки?
Что уже передано клиенту?
```

Каждый участник получает только необходимый ему уровень контекста.

---

# 3. Postproduction как граф

Постпродакшн не является одной задачей.

Это последовательность связанных сущностей:

```text
Event
  ↓
Capture
  ↓
Media
  ↓
Transfer
  ↓
Postproduction Job
  ↓
Editor / Retoucher
  ↓
Review
  ↓
Approval
  ↓
Delivery
  ↓
Client
```

Для фотографии:

```text
Съёмка
 ↓
RAW
 ↓
Backup
 ↓
Отбор
 ↓
Цвет
 ↓
Ретушь
 ↓
Экспорт
 ↓
Галерея
 ↓
Клиент
```

Для видео:

```text
Съёмка
 ↓
Ingest
 ↓
Backup
 ↓
Sync
 ↓
Assembly
 ↓
Editing
 ↓
Color
 ↓
Sound
 ↓
Review
 ↓
Master
 ↓
Delivery
```

---

# 4. Не превращать постпродакшн в таск-менеджер

Система не должна показывать пользователю сотни технических операций.

Плохо:

```text
Создать папку
Скопировать файлы
Проверить файлы
Переименовать
Открыть Lightroom
Экспортировать JPEG
Загрузить JPEG
Отправить ссылку
```

Правильно:

```text
Материал получен
 ↓
Отбор
 ↓
Обработка
 ↓
Проверка
 ↓
Доставка
```

Внутри этих этапов могут существовать технические задачи, но они не должны перегружать основной интерфейс.

---

# 5. Роли

В постпродакшне могут участвовать:

```text
Фотограф
Оператор
Фотограф-редактор
Colorist
Ретушёр
Видеомонтажёр
Звукорежиссёр
Motion Designer
Дизайнер фотокниги
Менеджер фотокниги
QA / Проверяющий
Менеджер доставки
```

Не каждый проект использует все роли.

Один человек может одновременно выполнять несколько ролей.

---

# 6. Простая модель

Фотограф может сделать всё самостоятельно:

```text
Фотограф
 ├── Съёмка
 ├── Отбор
 ├── Цвет
 ├── Ретушь
 ├── Экспорт
 └── Доставка
```

Профессиональная команда:

```text
Фотограф
 ↓
Transfer
 ↓
Culler
 ↓
Colorist
 ↓
Retoucher
 ↓
QA
 ↓
Delivery
 ↓
Client
```

Система должна поддерживать обе модели.

---

# 7. Postproduction Job

Каждая значимая единица работы представляется объектом:

```text
PostproductionJob
├── id
├── project_id
├── source
├── type
├── assignee
├── stage
├── status
├── priority
├── deadline
├── input
├── output
├── created_at
├── started_at
├── completed_at
└── metadata
```

---

# 8. Типы Job

Минимальный набор:

```text
Cull
Color
Retouch
VideoEdit
Sound
Motion
Album
Export
QA
Delivery
```

Архитектура должна позволять добавлять новые типы без изменения базовой модели.

---

# 9. Статусы

Базовая модель:

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

---

## 9.1 Waiting

Работа существует, но пока не может начаться.

Например:

```text
Waiting for files
```

---

## 9.2 Ready

Все необходимые входные данные доступны.

Исполнитель может начать работу.

---

## 9.3 In Progress

Исполнитель приступил к работе.

---

## 9.4 Blocked

Работа остановлена из-за внешнего обстоятельства.

Например:

```text
Не хватает файлов
Не хватает референса
Нужно решение клиента
Предыдущий этап не завершён
Техническая проблема
```

Причина блокировки должна быть структурированной.

---

## 9.5 Review

Исполнитель передал результат на проверку.

```text
Retoucher
 ↓
Submit
 ↓
Photographer Review
```

---

## 9.6 Approved

Результат принят.

---

## 9.7 Completed

Этап полностью завершён, его результат доступен следующему этапу.

---

## 9.8 Cancelled

Работа больше не требуется.

Причина отмены сохраняется.

---

# 10. Input / Output

Каждая производственная операция должна иметь вход и выход.

Пример:

```text
Input:
RAW

Output:
Selected JPEG
```

Следующий этап:

```text
Input:
Selected JPEG

Output:
Color Corrected JPEG
```

Следующий:

```text
Input:
Color Corrected JPEG

Output:
Retouched JPEG
```

---

# 11. Material

Проект может содержать несколько наборов материала:

```text
MediaSet
├── id
├── project_id
├── creator
├── captured_at
├── source
├── type
├── count
├── storage
└── status
```

Например:

```text
Основной фотограф
Второй фотограф
Основная камера оператора
Вторая камера
Drone
Audio
Ceremony
Reception
Portrait Session
```

---

# 12. Несколько исполнителей

Один проект может иметь:

```text
Photographer A
Photographer B
Videographer A
Videographer B
Drone Operator
Sound Operator
```

Каждый создаёт собственные MediaSet.

Все они связаны с одним Project.

---

# 13. Жизненный цикл материала

```text
Captured
 ↓
Transferred
 ↓
Verified
 ↓
Processing
 ↓
Processed
 ↓
Approved
 ↓
Delivered
```

Важно различать:

```text
Материал существует
```

и:

```text
Работа с материалом завершена
```

---

# 14. Передача файлов

Transfer является самостоятельной операцией.

```text
Photographer
 ↓
Transfer
 ↓
Postproduction Job
```

Система должна знать не просто о наличии папки, а о факте передачи материала.

---

# 15. P2P

Существующая система фотографа может передавать материал напрямую ретушёру.

Архитектура должна допускать разные способы передачи:

```text
P2P
Local Network
Cloud
External Storage
```

Postproduction не должен зависеть от конкретного транспорта.

---

# 16. Состояния передачи

```text
Preparing
Transferring
Paused
Failed
Completed
Verified
```

---

# 17. Проверка передачи

Успешное соединение не означает успешную передачу.

Система должна по возможности подтверждать результат:

```text
Expected: 4 821 files
Received: 4 821 files
Integrity: Verified
```

Конкретный механизм проверки определяется технической реализацией.

---

# 18. Handoff

Передача работы между исполнителями является отдельным событием.

```text
Colorist
 ↓
Submit
 ↓
Retoucher
```

Получатель получает:

```text
Job
Input
Instructions
Deadline
References
```

Не должно быть необходимости искать это вручную в общей папке или истории сообщений.

---

# 19. Явная передача ответственности

Система не должна полагаться на сообщения вроде:

```text
«Файлы лежат в папке»
```

Вместо этого:

```text
Job:
Retouch

Input:
Color v3

Status:
Ready

Assignee:
Retoucher
```

---

# 20. Зависимости

Работа может зависеть от другой работы.

Например:

```text
Retouch
depends_on
Color
```

Если Color ещё не завершён:

```text
Retouch = Waiting
```

---

# 21. Параллельная работа

Граф должен поддерживать параллельные ветки:

```text
                 ┌── Photo Color
Transfer ────────┤
                 └── Video Ingest
```

---

# 22. Условные ветки

Некоторые процессы возникают только при определённых условиях.

Например, фотокнига:

```text
Delivery
 ├── Gallery
 └── Album
       ↓
   Album Design
       ↓
   Client Approval
       ↓
   Print
```

Фотокнига не должна появляться в каждом проекте автоматически.

---

# 23. Workflow Templates

Организация может создавать шаблоны.

Например:

```text
Wedding Photography
```

```text
Capture
 ↓
Transfer
 ↓
Cull
 ↓
Color
 ↓
Retouch
 ↓
QA
 ↓
Gallery
 ↓
Delivery
```

Другой проект:

```text
Corporate Video
```

```text
Capture
 ↓
Ingest
 ↓
Assembly
 ↓
Edit
 ↓
Sound
 ↓
Color
 ↓
Review
 ↓
Master
 ↓
Delivery
```

---

# 24. Workflow не должен быть обязательным

Фотограф, работающий один, может использовать:

```text
Capture
 ↓
Import
 ↓
Edit
 ↓
Export
 ↓
Delivery
```

Система не должна заставлять его создавать отдельные задачи для каждого технического действия.

---

# 25. Deadlines

Postproduction Job может иметь:

```text
Due Date
Due Time
Priority
SLA
```

Но срок должен по возможности вычисляться из проекта.

Например:

```text
Event Date
 ↓
Gallery Delivery
 ↓
Retouch Deadline
```

---

# 26. Относительные сроки

Workflow может определять сроки относительно события:

```text
Gallery Delivery = Event + 14 days
```

Затем:

```text
Retouch Deadline = Gallery Delivery - 3 days
```

Это позволяет менять дату доставки без ручного редактирования всех задач.

---

# 27. Изменение срока

Если меняется:

```text
Gallery Delivery
```

система должна пересчитать связанные сроки и показать затронутые элементы.

---

# 28. Workload

Исполнитель может работать сразу с несколькими проектами.

Система должна учитывать:

```text
Assigned Jobs
Estimated Work
Deadlines
Current Load
```

Это позволяет обнаруживать перегрузку.

---

# 29. Availability

Availability исполнителя отделён от статуса конкретной задачи.

```text
Available
Busy
Unavailable
Vacation
```

---

# 30. Assignment

Работа может быть назначена:

```text
User
Team
Role
```

Например:

```text
Retouch Job
 ↓
Retouch Team
 ↓
Available Retoucher
```

---

# 31. Reassignment

Работа может быть передана другому исполнителю.

Сохраняется:

```text
Previous Assignee
New Assignee
Reason
Timestamp
```

---

# 32. References

Для работы могут понадобиться:

```text
Client Brief
Photographer Notes
Style Reference
Previous Work
Moodboard
Selected Images
```

Они должны быть связаны с Job как объекты системы, а не потеряны среди сообщений.

---

# 33. Коммуникация

Каждый Job может иметь собственный контекст общения.

```text
Retouch Job
 ├── Job Status
 ├── Files
 ├── Instructions
 └── Chat
```

Работник не должен искать инструкции в общем чате проекта.

---

# 34. Job Chat

Job Chat является частью рабочего контекста.

Например:

```text
Photographer
Retoucher
```

Организатор получает доступ только при необходимости и наличии соответствующих прав.

---

# 35. События

Система фиксирует значимые события:

```text
Job Created
Job Assigned
Files Received
Job Started
Comment Added
Job Blocked
Job Submitted
Job Approved
Job Rejected
Job Completed
```

---

# 36. Review

Результат может быть:

```text
Approved
Approved with Notes
Changes Required
Rejected
```

---

# 37. Rejection

При отклонении результата должна сохраняться причина.

```text
Review
 ↓
Rejected
 ↓
Retoucher
```

Причина должна быть доступна исполнителю в контексте Job.

---

# 38. Версии

Результаты должны быть версионируемыми:

```text
Retouch
├── v1
├── v2
└── v3
```

Текущая утверждённая версия определяется явно.

---

# 39. Версия не уничтожает предыдущую

При создании новой версии:

```text
v1 → Superseded
v2 → Current
```

Предыдущая версия сохраняется согласно политике хранения.

---

# 40. QA

QA является опциональным этапом.

Одиночный фотограф может его не использовать.

Студия:

```text
Retouch
 ↓
QA
 ↓
Approved
```

---

# 41. QA Checklist

Может содержать:

```text
Skin
Color
Exposure
Artifacts
Cropping
Consistency
Export
File Naming
```

Чек-лист должен быть настраиваемым.

---

# 42. Delivery

Delivery является отдельным этапом.

Важно различать:

```text
Export
```

и:

```text
Delivery
```

Export создаёт готовые файлы.

Delivery передаёт результат клиенту.

```text
Export
 ↓
Gallery
 ↓
Delivery
 ↓
Client
```

---

# 43. Внешние сервисы

Система может интегрироваться с внешними сервисами доставки.

Например:

```text
Postproduction
 ↓
Gallery
 ↓
External Gallery
 ↓
Client Link
```

Внешний сервис является интеграцией, а не источником истины проекта.

---

# 44. Delivery Status

```text
Preparing
Ready
Sent
Opened
Completed
```

Если внешний сервис предоставляет информацию об открытии, она может использоваться системой.

---

# 45. Клиентская коммуникация

После доставки начинается отдельный этап взаимодействия:

```text
Gallery Delivered
 ↓
Client Conversation
 ↓
Feedback
 ↓
Additional Services
```

Это важная часть жизненного цикла заказа.

---

# 46. Дополнительные продукты

После основной доставки могут возникать:

```text
Photo Book
Prints
Additional Retouch
Additional Photos
Slideshow
Anniversary Session
```

Они должны быть отдельными ветками проекта.

---

# 47. Фотокнига

Пример:

```text
Client
 ↓
Photo Book
 ↓
Album Design
 ↓
Client Approval
 ↓
Print
 ↓
Delivery
```

---

# 48. Нет эквайринга

Система может хранить коммерческий статус:

```text
Offered
Ordered
Paid
Unpaid
```

но не обязана принимать платежи.

```text
CRM ≠ Payment Gateway
```

---

# 49. Обратная связь

Feedback должен быть связан с результатом:

```text
Gallery
 ↓
Feedback
 ↓
Project
```

---

# 50. Feedback ≠ Task

Сообщение:

```text
«Нам очень нравится!»
```

является коммуникацией.

Сообщение:

```text
«Можно убрать человека на фотографии 142?»
```

может породить Change Request.

---

# 51. Change Request

```text
Client Request
 ↓
Review
 ↓
Approval
 ↓
Postproduction Job
 ↓
Delivery
```

Не каждое сообщение автоматически превращается в задачу.

---

# 52. Организатор

Организатор не должен видеть каждую операцию ретуши.

На уровне проекта ему достаточно:

```text
Photography

✓ Shoot completed
✓ Files transferred
◐ Processing
○ Delivery pending
```

---

# 53. События для организатора

Организатору могут быть доступны:

```text
Files Received
Postproduction Started
Postproduction Completed
Gallery Delivered
```

---

# 54. Организатор не управляет обработкой

По умолчанию организатор не становится:

```text
Retouch Manager
Color Supervisor
File Transfer Operator
```

если ему специально не назначена такая роль.

---

# 55. Project Status

На уровне проекта:

```text
Event Completed
 ↓
Postproduction Active
 ↓
Delivery Pending
 ↓
Project Completed
```

---

# 56. Event Completed ≠ Project Completed

Свадьба закончилась физически, но проект может продолжаться.

```text
Event Date ≠ Project End
```

---

# 57. Длинный хвост

Например:

```text
Wedding
 ↓
Gallery
 ↓
Album
 ↓
Album Revision
 ↓
Print
```

Поэтому завершение события не должно автоматически закрывать проект.

---

# 58. Project Completion

Возможны независимые состояния:

```text
Event Completed
Production Completed
Delivery Completed
Commercially Completed
Archived
```

Не следует сводить их к одному boolean:

```text
completed = true
```

---

# 59. Архив

После завершения проект переходит в:

```text
Archive
```

но остаётся доступным для поиска согласно правам пользователя.

---

# 60. Mobile

На iOS и Android исполнитель должен иметь возможность:

```text
View Jobs
Accept Assignment
Read Instructions
Open Documents
Communicate
Change Status
Submit Completion
Receive Notifications
```

Телефон не обязан выполнять тяжёлые операции с медиаданными.

---

# 61. Desktop / Web

На компьютере нужны:

```text
Large File Handling
Detailed Review
Batch Operations
Timeline
Project Overview
Multiple Jobs
File Management
```

---

# 62. PWA

Основной интерфейс системы должен работать как PWA.

Общий слой:

```text
Desktop
iOS
Android
```

При необходимости используются платформенные возможности.

---

# 63. Core System ≠ Photo Editor

Система не должна превращаться в:

```text
Lightroom
Photoshop
Premiere
DaVinci Resolve
```

Она координирует работу вокруг этих инструментов.

---

# 64. Интеграции

Архитектура должна предусматривать интеграции с:

```text
Photo Editors
Video Editors
Storage
Gallery Services
Calendar
Communication
```

Конкретный список интеграций определяется отдельно.

---

# 65. Source of Truth

Для постпродакшна:

```text
Media
→ Media Set

Work
→ Postproduction Job

Workflow
→ Workflow Graph

Current State
→ Job Status

Result
→ Output Version

Client Delivery
→ Delivery Object

Conversation
→ Communication
```

---

# 66. Event Model

Ключевые события:

```text
MediaCaptured
MediaTransferred
MediaVerified

JobCreated
JobAssigned
JobStarted
JobBlocked
JobSubmitted
JobReviewed
JobRejected
JobApproved
JobCompleted

DeliveryCreated
DeliverySent
DeliveryOpened

ClientFeedbackReceived
ChangeRequestCreated
```

---

# 67. Пример цепочки

```text
MediaTransferred
        ↓
JobCreated
        ↓
JobAssigned
        ↓
JobStarted
        ↓
JobSubmitted
        ↓
JobApproved
        ↓
DeliveryCreated
        ↓
DeliverySent
```

---

# 68. Context Engine

Context Engine определяет, какую часть процесса должен видеть конкретный пользователь.

### Ретушёр

```text
Current Job
Input Files
Instructions
References
Deadline
Relevant Chat
```

### Фотограф

```text
Jobs
Review Requests
Delivery Status
Client Messages
```

### Организатор

```text
Project Postproduction Status
Delivery Status
Exceptions
```

### Клиент

```text
Delivery
Feedback
Additional Services
```

---

# 69. Exceptions

Система должна прежде всего показывать отклонения от нормального процесса.

Например:

```text
Transfer Failed
Job Overdue
Missing Files
Retoucher Blocked
Client Requested Changes
Gallery Not Delivered
```

Нормальный процесс не должен генерировать поток уведомлений.

---

# 70. Приоритеты

```text
Critical
High
Normal
Informational
```

Уведомление получает только пользователь, для которого событие действительно важно.

---

# 71. Automation

Система может автоматически создавать следующие состояния:

```text
Transfer Verified
 ↓
Create Job

Job Completed
 ↓
Create Next Job

Gallery Delivered
 ↓
Notify Client

Client Requests Correction
 ↓
Create Change Request
```

---

# 72. Automation должна быть прозрачной

Автоматическое действие должно быть понятно пользователю и отражаться в истории.

---

# 73. Manual Override

Пользователь с соответствующими правами может:

```text
Skip
Pause
Reassign
Cancel
Restart
Change Deadline
```

---

# 74. Audit Trail

Для важных операций сохраняется:

```text
Who
What
When
Before
After
```

Пример:

```text
Retouch Job

Status:
Review → Approved

Changed by:
Photographer

Time:
2026-08-01 14:32
```

---

# 75. Dashboard организации

```text
Postproduction

Active Projects: 12
Jobs in Progress: 28
Waiting: 7
Review: 4
Overdue: 2
Delivered This Week: 18
```

Dashboard является ролевым интерфейсом.

---

# 76. Dashboard фотографа

```text
Postproduction

Waiting for me
├── 3 reviews

In progress
├── Smith Wedding
└── Ivanov Wedding

Delivery
└── Petrova Wedding
```

---

# 77. Dashboard ретушёра

```text
My Jobs

Ready
├── Smith Wedding

In Progress
├── Ivanov Wedding

Review
└── Petrova Wedding

Due Today
├── ...
```

---

# 78. Dashboard организатора

Максимально простой:

```text
Projects

Smith Wedding
✓ Event
✓ Files received
◐ Postproduction
○ Delivery

Ivanov Wedding
✓ Event
✓ Postproduction
✓ Delivered
```

---

# 79. Dashboard клиента

```text
Your Event

Event completed

Photography
✓ Photos received
◐ Processing
○ Gallery ready
```

После готовности:

```text
[Open Gallery]
```

---

# 80. Безопасность

Постпродакшн содержит персональные данные и исходные материалы клиента.

Доступ строится через:

```text
Organization
 ↓
Project
 ↓
Team
 ↓
Role
 ↓
Permission
 ↓
Resource
```

---

# 81. Клиентская изоляция

Клиент не должен видеть:

```text
Internal Jobs
Internal Comments
Retoucher Information
Internal Costs
Other Clients
```

если эти данные явно не предоставлены.

---

# 82. Временные исполнители

Однодневный или временный исполнитель может получить:

```text
Project Access
+
Postproduction Job
+
Required Files
+
Required Documents
+
Job Chat
```

и ничего лишнего.

---

# 83. Expiration

Доступ временного исполнителя может иметь срок:

```text
Access Granted
 ↓
Job Completed
 ↓
Access Expires
```

История действий сохраняется.

---

# 84. Postproduction Templates

Организация может создавать:

```text
Wedding Photo
Wedding Video
Corporate Photo
Corporate Video
Portrait Session
Event Photography
```

Шаблон определяет:

```text
Stages
Dependencies
Roles
Deadlines
Documents
Notifications
```

---

# 85. MVP

Минимальная реализация должна поддерживать:

1. Postproduction Job.
2. Assignment.
3. Status.
4. Deadline.
5. Input / Output.
6. Transfer State.
7. Job Chat.
8. Notifications.
9. Completion Event.
10. Project-level status для организатора.
11. Client Delivery Status.
12. Basic Versioning.
13. Permissions.
14. Temporary Worker Access.

---

# 86. Поздние возможности

После MVP:

```text
Advanced Workflow Builder
Automatic Assignment
Workload Balancing
AI Assistance
Advanced QA
Media Fingerprinting
Storage Integrations
Editor Integrations
Automatic Delivery
Client Proofing
Album Workflow
Print Workflow
Analytics
```

---

# 87. AI

AI является опцией.

Возможные функции:

```text
Extract Instructions
Summarize Client Feedback
Detect Missing Information
Compare Versions
Generate Job Brief
Detect Conflicts
Suggest Assignment
Summarize Project
```

Основная система должна полностью работать без AI.

---

# 88. AI не является источником истины

AI может предложить:

```text
Retoucher X may be suitable.
```

Но не должен без явно заданного правила:

```text
назначать критическую работу
менять сроки
отправлять результат клиенту
удалять файлы
```

---

# 89. Навигатор

Принцип Navigator распространяется и на постпродакшн.

Пользователю не нужен список из 37 задач.

Ему нужно:

```text
Next:
Smith Wedding — Retouch Review
Due Today
```

После выполнения:

```text
Next:
Ivanov Wedding — Color
Due Tomorrow
```

Система показывает следующий важный шаг, а не весь граф одновременно.

---

# 90. Постпродакшн как продолжение Project Graph

```text
                         PROJECT GRAPH
                              │
               ┌──────────────┴──────────────┐
               │                             │
             EVENT                       CLIENT
               │                             │
               ↓                             │
            CAPTURE                           │
               │                             │
               ↓                             │
          MEDIA SETS                          │
               │                             │
               ↓                             │
           TRANSFER                           │
               │                             │
               ↓                             │
       POSTPRODUCTION GRAPH                   │
               │                             │
       ┌───────┼────────┐                    │
       ↓       ↓        ↓                    │
      CULL    COLOR   RETOUCH                │
       │       │        │                    │
       └───────┼────────┘                    │
               ↓                             │
              QA                             │
               ↓                             │
            DELIVERY ────────────────────────┘
               │
               ↓
          CLIENT FEEDBACK
               │
        ┌──────┴──────┐
        ↓             ↓
   CHANGE REQUEST   ADDITIONAL
                    SERVICES
```

---

# 91. Основная идея

Postproduction — не набор задач после свадьбы.

Это продолжение общего графа проекта после того, как физическое событие завершилось.

Система отслеживает движение:

```text
материала
    +
работы
    +
ответственности
    +
результата
```

от момента съёмки до получения результата клиентом.

При этом:

```text
Фотограф
→ видит свою производственную работу

Ретушёр
→ видит только необходимые ему материалы и задачи

Организатор
→ видит состояние проекта

Клиент
→ видит результат и коммуникацию

Система
→ связывает всё это в единый граф
```

Главный принцип:

> **Система не заставляет всех работать одинаково. Она соединяет разные рабочие процессы в одном проекте и показывает каждому участнику только тот контекст, который нужен ему сейчас.**

```
```
