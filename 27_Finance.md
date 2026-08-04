# 27_Finance.md

````markdown
# Finance

**Document:** `27_Finance.md`  
**Version:** `0.1.0`  
**Status:** Draft

---

## 1. Назначение

Finance — необязательный слой системы, предназначенный для учёта финансовой стороны проектов.

Система не является:

- банком;
- платёжным оператором;
- эквайрингом;
- налоговой системой;
- бухгалтерской системой;
- сервисом формирования обязательной бухгалтерской отчётности.

Финансовый модуль помогает организатору понимать:

```text
Что стоит проект?
Кому должны заплатить?
Кто должен заплатить нам?
Что уже оплачено?
Что ещё необходимо оплатить?
Как меняется бюджет?
````

---

# 2. Главный принцип

> Финансовый учёт должен быть встроен в проект, но не должен быть условием работы проекта.

Организация может использовать систему:

```text
без Finance
```

или:

```text
Project
+
Finance
```

Остальная система не должна ломаться, если финансовый модуль отключён.

---

# 3. Никаких платежей

Система не принимает деньги.

Не реализуются:

```text
Payment Gateway
Acquiring
Bank Processing
Card Payments
Online Cash Register
```

Система только фиксирует состояние финансовых обязательств.

Например:

```text
Фотограф
Стоимость: 80 000 ₽
Статус: Оплачено
```

или:

```text
Ресторан
Стоимость: 150 000 ₽
Статус: Нужно оплатить
```

---

# 4. Finance как часть Project Graph

Финансовая информация является частью графа проекта.

```text
Project
 ├── Client
 ├── Teams
 ├── Contractors
 ├── Documents
 ├── Timeline
 ├── Communication
 ├── Postproduction
 └── Finance
```

Finance не является отдельной CRM.

Он связан с конкретными объектами проекта.

---

# 5. Основные финансовые сущности

```text
Budget
BudgetItem
FinancialObligation
Expense
Income
PaymentStatus
Invoice
FinancialDocument
```

---

# 6. Budget

Budget описывает плановую финансовую модель проекта.

```text
Budget
├── id
├── project_id
├── currency
├── planned_income
├── planned_expenses
├── actual_income
├── actual_expenses
└── status
```

---

# 7. Budget Item

Каждая статья бюджета является отдельным объектом.

```text
BudgetItem
├── id
├── budget_id
├── category
├── name
├── type
├── planned_amount
├── actual_amount
├── status
├── contractor
└── notes
```

---

# 8. Типы Budget Item

Минимально:

```text
Income
Expense
```

Дополнительно:

```text
Internal
External
Optional
Estimated
Actual
```

---

# 9. Категории расходов

Типичные категории свадебного проекта:

```text
Venue
Catering
Photography
Video
Decoration
Floristics
Host
DJ
Music
Transport
Lighting
Sound
Cake
Bar
Fireworks
Printing
Stationery
Accommodation
Staff
Rent
Other
```

Список категорий должен быть настраиваемым.

---

# 10. Доходы

Для организатора доходами могут быть:

```text
Client Contract
Additional Services
Additional Hours
Additional Guests
Album
Prints
Decor Upgrade
Transport Upgrade
Other
```

---

# 11. Расходы

Расход может быть связан с:

```text
Contractor
Supplier
Venue
Employee
Service
Material
Transport
Equipment
Other
```

---

# 12. Финансовая связь с исполнителем

Если в проекте есть:

```text
Photographer
```

и его стоимость:

```text
80 000 ₽
```

Finance связывает:

```text
Project
 ↓
Role / Contractor
 ↓
Financial Obligation
```

Это позволяет видеть не просто сумму, а её источник.

---

# 13. Financial Obligation

Обязательство — это обещание одной стороны другой стороне выполнить финансовое действие.

Например:

```text
Project
 ↓
Photographer
 ↓
80 000 ₽
 ↓
Need to Pay
```

Или:

```text
Project
 ↓
Client
 ↓
250 000 ₽
 ↓
Need to Receive
```

---

# 14. Статусы оплаты

Минимальная модель:

```text
Not Set
Need to Pay
Partially Paid
Paid
Overdue
Cancelled
```

Для входящих средств:

```text
Expected
Partially Received
Received
Overdue
Cancelled
```

---

# 15. Payment Status ≠ Payment

Система хранит:

```text
status = Paid
```

но это не означает, что система сама провела платёж.

Фактический платёж мог произойти:

```text
наличными
банковским переводом
через внешний сервис
через бухгалтерию
другим способом
```

---

# 16. Дата оплаты

Если пользователь хочет вести подробный учёт, Payment Record может содержать:

```text
Payment
├── id
├── obligation_id
├── amount
├── date
├── method
├── reference
└── notes
```

Но Payment Record означает фиксацию факта, а не проведение платежа.

---

# 17. Частичная оплата

Например:

```text
Обязательство:
100 000 ₽

Оплачено:
50 000 ₽

Осталось:
50 000 ₽
```

Статус:

```text
Partially Paid
```

---

# 18. Несколько платежей

```text
100 000 ₽
```

может быть оплачено:

```text
30 000 ₽
+
30 000 ₽
+
40 000 ₽
```

Система должна уметь хранить несколько Payment Records.

---

# 19. Предоплата

Предоплата является частью финансового обязательства.

```text
Contract
 ↓
Total: 200 000 ₽
 ↓
Deposit: 50 000 ₽
 ↓
Remaining: 150 000 ₽
```

---

# 20. Этапы оплаты

Для проекта можно определить:

```text
Deposit
Intermediate Payment
Final Payment
```

Например:

```text
Booking
 ↓
50% Deposit
 ↓
Event
 ↓
50% Final Payment
```

---

# 21. Дедлайны оплаты

Financial Obligation может иметь:

```text
Due Date
Due Time
```

Например:

```text
Ресторан
150 000 ₽
Оплатить до 15 августа
```

---

# 22. Финансовые напоминания

Система может создавать:

```text
Payment Reminder
```

Например:

```text
Через 3 дня необходимо оплатить ресторан.
```

Уведомление получает только пользователь с соответствующими правами.

---

# 23. Финансы и Timeline

Финансовые события могут быть связаны с Timeline.

```text
01.08
Договор

10.08
Предоплата

25.08
Финальный платёж

30.08
Свадьба
```

Finance не заменяет Timeline.

Он добавляет в него финансовые точки, если это необходимо пользователю.

---

# 24. Finance и Navigator

Navigator не должен показывать весь бюджет.

В нужный момент:

```text
Сегодня:
Оплатить транспорт — 35 000 ₽
```

После выполнения:

```text
Следующее:
Получить остаток от клиента — 70 000 ₽
```

Финансовая информация должна появляться контекстно.

---

# 25. Бюджет проекта

Организатор может видеть:

```text
Budget

Доход:
1 250 000 ₽

Расход:
930 000 ₽

Планируемый остаток:
320 000 ₽
```

---

# 26. Planned vs Actual

Важно разделять:

```text
Planned
```

и:

```text
Actual
```

Например:

```text
Декор

План:
150 000 ₽

Факт:
172 000 ₽
```

---

# 27. Отклонения

Система может показывать:

```text
Planned: 150 000 ₽
Actual: 172 000 ₽
Difference: +22 000 ₽
```

Это помогает организатору замечать изменения бюджета.

---

# 28. Бюджет как граф

Расход связан с объектом проекта:

```text
Budget
 ↓
Photography
 ↓
Photographer
 ↓
Contract
 ↓
80 000 ₽
```

или:

```text
Budget
 ↓
Transport
 ↓
Driver
 ↓
Transfer
 ↓
35 000 ₽
```

Это важнее простой таблицы.

---

# 29. Finance и Contractor

Исполнитель может иметь финансовую карточку:

```text
Contractor
├── Service
├── Amount
├── Payment Status
├── Due Date
└── Documents
```

Но исполнитель не обязательно получает доступ ко всему бюджету проекта.

---

# 30. Разделение видимости

Организатор:

```text
Видит:
Стоимость подрядчиков
Оплаты
Бюджет
Отклонения
```

Фотограф:

```text
Видит:
Только свои финансовые условия
```

Ретушёр:

```text
Видит:
Свои финансовые условия
```

Клиент:

```text
Видит:
Только клиентские обязательства
```

---

# 31. Клиентский доступ

Молодожёны могут видеть:

```text
Стоимость проекта
Согласованные услуги
Статус оплаты
Оставшуюся сумму
```

если организатор разрешил это.

Они не должны автоматически видеть:

```text
Стоимость фотографа
Маржу организатора
Стоимость работы подрядчиков
Внутренние расходы
```

---

# 32. Маржа

Организатору может быть полезно видеть:

```text
Revenue
-
Expenses
=
Gross Margin
```

Например:

```text
Доход:
1 250 000 ₽

Расход:
930 000 ₽

Валовая маржа:
320 000 ₽
```

Этот показатель является внутренним.

Клиенту он не показывается.

---

# 33. Наценка

Budget Item может содержать:

```text
Cost
Sell Price
```

Например:

```text
Флорист

Cost:
100 000 ₽

Sell:
130 000 ₽
```

Разница:

```text
30 000 ₽
```

---

# 34. Внутренняя и клиентская стоимость

Необходимо разделять:

```text
Internal Cost
```

и:

```text
Client Price
```

Это особенно важно для агентств.

---

# 35. Агентства

Для агентства финансовая модель может быть:

```text
Client
 ↓
Agency
 ↓
Contract
 ↓
Revenue
 ↓
Contractors
 ↓
Costs
```

Finance работает на уровне конкретного Project и Organization.

---

# 36. Несколько агентств

Система должна поддерживать работу одного пользователя с несколькими организациями.

```text
Agency A
 └── Project 1

Agency B
 └── Project 2
```

Финансовые данные одной организации не должны смешиваться с другой.

---

# 37. Несколько городов

Finance не должен зависеть от конкретного города.

Проект может иметь:

```text
City
Currency
Tax Context
```

при необходимости.

---

# 38. Валюта

Проект должен иметь основную валюту:

```text
currency = RUB
```

или другую поддерживаемую валюту.

Не следует автоматически конвертировать суммы без явного указания курса и источника.

---

# 39. Мультивалютность

Если проект использует несколько валют:

```text
Venue
EUR

Photographer
RUB

Hotel
USD
```

каждая сумма хранится вместе со своей валютой.

Конвертированная сумма является производным значением.

---

# 40. Документы

Finance может ссылаться на:

```text
Contract
Invoice
Act
Receipt
Estimate
Commercial Offer
Payment Confirmation
```

Но наличие финансового документа не должно быть обязательным для работы проекта.

---

# 41. Договор

Contract может быть связан с:

```text
Project
Client
Contractor
Financial Obligation
Documents
```

Пример:

```text
Project
 ↓
Photographer Contract
 ↓
80 000 ₽
 ↓
Paid
```

---

# 42. Бухгалтерия

Бухгалтерия является отдельным слоем.

```text
Project Finance
        ↓
Accounting
```

Но:

```text
Project Finance ≠ Accounting
```

Система не должна претендовать на полноценную бухгалтерскую систему.

---

# 43. Добровольность

Организация может не использовать бухгалтерский модуль.

При этом должны продолжать работать:

```text
Projects
Timeline
Communication
Tasks
Postproduction
Documents
```

---

# 44. Бухгалтерский экспорт

В будущем может существовать экспорт:

```text
CSV
Excel
PDF
API
```

для передачи данных в бухгалтерскую систему.

Система не обязана сама вести весь бухгалтерский цикл.

---

# 45. Юридические документы

Юридически значимые документы должны быть отдельными сущностями.

Например:

```text
Contract
Consent
Act
Invoice
```

Finance только связывает их с финансовыми объектами.

---

# 46. Юридическая определённость

Система должна хранить:

```text
Document Status
Document Date
Parties
Amount
Currency
Version
```

Но не должна самостоятельно определять юридическую действительность документа.

---

# 47. Версионирование документов

Финансовые документы должны поддерживать версии:

```text
Contract v1
Contract v2
Contract v3
```

Актуальная версия определяется явно.

---

# 48. Audit Trail

Изменения финансовых данных требуют повышенной прозрачности.

Сохраняется:

```text
Who
What
When
Before
After
```

Например:

```text
Amount:
80 000 ₽ → 90 000 ₽

Changed by:
Organizer

Reason:
Additional shooting hours
```

---

# 49. Изменение стоимости

Изменение цены не должно уничтожать предыдущую информацию.

Вместо:

```text
80 000 → 90 000
```

система должна понимать:

```text
Original:
80 000 ₽

Change:
+10 000 ₽

Reason:
Additional Hours

Current:
90 000 ₽
```

---

# 50. Additional Services

Дополнительная услуга может автоматически создавать финансовую связь.

Например:

```text
Client
 ↓
Requests Photo Book
 ↓
Additional Service
 ↓
Price: 25 000 ₽
 ↓
Financial Obligation
```

---

# 51. Finance и Communication

Финансовая договорённость может возникнуть в коммуникации:

```text
Client Chat
 ↓
«Добавляем ещё 2 часа съёмки»
 ↓
Additional Service
 ↓
Financial Obligation
```

Но сообщение само по себе не должно автоматически считаться финансовым обязательством.

Нуждается в подтверждении.

---

# 52. Подтверждение

Для важных финансовых изменений:

```text
Draft
 ↓
Confirmed
 ↓
Active
```

---

# 53. Financial Object Lifecycle

```text
Draft
 ↓
Confirmed
 ↓
Due
 ↓
Partially Paid
 ↓
Paid
```

Альтернативные состояния:

```text
Cancelled
Disputed
Overdue
```

---

# 54. Disputed

Если сумма оспаривается:

```text
Financial Obligation
 ↓
Disputed
```

Это не должно автоматически менять сумму.

---

# 55. Forecast

Finance может строить прогноз:

```text
Expected Income
Expected Expenses
Expected Balance
```

Пример:

```text
Expected Income:
1 250 000 ₽

Expected Expenses:
930 000 ₽

Expected Balance:
320 000 ₽
```

---

# 56. Cash Flow

Для более продвинутого уровня:

```text
Date
 ↓
Expected Income
 ↓
Expected Expenses
 ↓
Balance
```

Это позволяет видеть будущие кассовые разрывы.

---

# 57. Финансовые исключения

Система должна показывать исключения:

```text
Payment Overdue
Budget Exceeded
Unexpected Expense
Missing Financial Document
Unconfirmed Price
Client Balance Outstanding
```

---

# 58. Finance Dashboard

Для организатора:

```text
Finance

Revenue
1 250 000 ₽

Expenses
930 000 ₽

Expected Margin
320 000 ₽

Receivables
70 000 ₽

Payables
120 000 ₽
```

---

# 59. Project Finance Dashboard

Внутри конкретного проекта:

```text
Project Finance

Income
├── Client Contract       900 000 ₽
├── Additional Services   150 000 ₽
└── Album                  50 000 ₽

Expenses
├── Venue                350 000 ₽
├── Photography            80 000 ₽
├── Video                  90 000 ₽
├── Decor                 150 000 ₽
├── Music                  70 000 ₽
└── Other                  40 000 ₽
```

---

# 60. Finance Navigator

Пользователь не должен открывать финансовый раздел ради каждой мелочи.

Система может показать:

```text
Сегодня

Нужно оплатить:
Флорист — 50 000 ₽

Ожидается:
Оплата от клиента — 100 000 ₽
```

---

# 61. Notifications

Уведомления:

```text
Payment Due Soon
Payment Overdue
Budget Exceeded
Client Payment Received
Contractor Payment Due
```

Количество уведомлений должно быть ограничено.

---

# 62. Finance и права

Финансовые права должны быть отдельными.

Пример:

```text
finance.view
finance.create
finance.edit
finance.confirm
finance.export
finance.manage
```

---

# 63. Sensitive Finance

Некоторые данные являются внутренними:

```text
Margin
Markup
Internal Cost
Contractor Rate
Agency Profit
```

Они требуют отдельного permission layer.

---

# 64. Client Finance

Клиентский интерфейс может быть минимальным:

```text
Ваш заказ

Стоимость:
250 000 ₽

Оплачено:
180 000 ₽

Осталось:
70 000 ₽

Статус:
Нужно оплатить
```

---

# 65. Не показывать бухгалтерию клиенту

Клиент не должен видеть:

```text
Internal Accounting
Agency Margin
Contractor Cost
Tax Calculations
Internal Notes
```

---

# 66. Taxes

Налоговые данные не являются обязательной частью MVP.

Если они появляются:

```text
Tax Data
```

должны быть отделены от базового финансового учёта.

Система не должна самостоятельно определять налоговые обязательства пользователя.

---

# 67. Legal Context

Юридические требования зависят от:

```text
Country
Organization Type
Contract Type
Tax Regime
```

Поэтому архитектура не должна содержать жёстко зашитую юридическую модель одной страны.

---

# 68. Financial Graph

Пример:

```text
Project
 │
 ├── Client
 │    └── Contract
 │         └── Receivable
 │
 ├── Photographer
 │    └── Contract
 │         └── Payable
 │
 ├── Florist
 │    └── Contract
 │         └── Payable
 │
 └── Venue
      └── Contract
           └── Payable
```

---

# 69. Связь с другими модулями

Finance связан с:

```text
Projects
Clients
Roles
Teams
Documents
Communication
Timeline
Navigator
Postproduction
```

Но не должен поглощать их.

---

# 70. Source of Truth

```text
Budget
→ Planned Financial State

BudgetItem
→ Budget Line

FinancialObligation
→ Commitment

Payment
→ Recorded Payment

FinancialDocument
→ Supporting Document

Finance Event
→ Financial History
```

---

# 71. Event Model

Финансовые события:

```text
BudgetCreated
BudgetUpdated

FinancialItemCreated
FinancialItemUpdated

ObligationCreated
ObligationConfirmed
ObligationCancelled

PaymentRecorded
PaymentUpdated

PaymentStatusChanged

BudgetExceeded
PaymentOverdue

FinancialDocumentAttached
FinancialDocumentUpdated
```

---

# 72. Automation

Возможны автоматические действия:

```text
Contract Confirmed
 ↓
Create Financial Obligation

Due Date Approaching
 ↓
Create Reminder

Payment Recorded
 ↓
Update Balance

Additional Service Confirmed
 ↓
Update Budget
```

---

# 73. Automation должна быть отключаемой

Организация может предпочитать ручной финансовый учёт.

Поэтому автоматические правила:

```text
optional
```

а не обязательная часть системы.

---

# 74. MVP

Минимальный Finance должен поддерживать:

1. Budget.
2. Budget Items.
3. Income.
4. Expenses.
5. Financial Obligations.
6. Payment Status.
7. Partial Payments.
8. Due Dates.
9. Basic Financial Documents.
10. Project-level Financial Overview.
11. Permissions.
12. Audit Trail.
13. Optional Client Financial View.

---

# 75. Не входит в MVP

```text
Payment Gateway
Acquiring
Bank Integration
Full Accounting
Tax Reporting
Payroll
Cash Register
Automatic Tax Calculation
```

---

# 76. Будущие возможности

```text
Accounting Integrations
Bank Import
Advanced Cash Flow
Multi-Currency Reporting
Budget Forecasting
Financial Analytics
Contract Automation
Invoice Generation
Advanced Financial Reports
```

---

# 77. Основной UX-принцип

Finance должен отвечать на три вопроса:

```text
Сколько стоит проект?
Кому и сколько мы должны?
Кто и сколько должен нам?
```

Организатору не нужна бухгалтерская программа.

Ему нужен финансовый слой проекта.

---

# 78. Итоговая модель

```text
                         PROJECT
                            │
             ┌──────────────┼──────────────┐
             │              │              │
           CLIENT       CONTRACTORS      BUDGET
             │              │              │
             ↓              ↓              ↓
        RECEIVABLE       PAYABLE       BUDGET ITEMS
             │              │              │
             └──────────────┼──────────────┘
                            ↓
                       PAYMENTS
                            │
                            ↓
                         BALANCE
                            │
                            ↓
                     FINANCIAL STATE
```

---

# 79. Финальный принцип

> **Finance — это финансовый контекст проекта, а не бухгалтерская система.**

Он должен позволять организатору видеть:

```text
план
→ обязательства
→ оплаты
→ отклонения
→ прогноз
```

не заставляя его пользоваться эквайрингом, банковской системой или полноценной бухгалтерией.

Финансовый модуль должен быть таким же, как остальные модули системы:

```text
контекстным
ролевым
связанным с графом проекта
и необязательным.
```

Система должна работать без Finance.

Но если Finance включён, он должен естественно связываться с:

```text
Client
Contract
Contractor
Project
Timeline
Documents
Communication
Additional Services
```

и становиться частью единой модели проекта.

```
```
