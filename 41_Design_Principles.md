# 41_Design_Principles.md

````markdown
# Design Principles

**Document:** `41_Design_Principles.md`  
**Version:** `0.1.0`  
**Status:** Draft

---

## 1. Purpose

This document defines the principles that guide the visual and interaction design of the system.

These principles are not a component library and not a list of visual styles.

They define how the interface should behave when designing:

- screens;
- cards;
- timelines;
- navigation;
- forms;
- dashboards;
- mobile interfaces;
- desktop interfaces;
- notifications;
- statuses;
- actions;
- empty states;
- system feedback.

The purpose is to ensure that new features do not gradually turn the product into a conventional CRM, task manager, ERP, or project-management application.

---

# 2. Design the Work, Not the Database

The system contains many entities:

```text
Projects
Clients
People
Teams
Roles
Tasks
Events
Documents
Messages
Finance
Jobs
Locations
Contracts
Files
Permissions
````

The interface should not reproduce this structure literally.

The database describes how the system stores information.

The interface describes how people work.

```text
Database:
"What exists?"

UI:
"What does the person need to do?"
```

---

# 3. Complexity Belongs in the System

The system may contain a very complex graph.

The user should experience a simple interface.

```text
Complex Graph
      ↓
Context Engine
      ↓
Role
      ↓
Current Situation
      ↓
Simple Interface
```

Never expose complexity merely because the architecture contains it.

---

# 4. One Person, One Context

Every user operates inside a particular context.

Context consists of:

```text
Who
Where
When
Role
Project
Current Event
Next Event
Changes
Required Actions
```

The interface should construct the current context automatically whenever possible.

---

# 5. The Interface Is a Cognitive Filter

The system should filter information before presenting it.

The user should not have to perform the filtering manually.

Bad:

```text
100 events
50 tasks
20 documents
15 contractors
10 conversations
```

Good:

```text
Now:
Portrait session

Next:
Transfer to restaurant

Attention:
Rain expected in 25 minutes
```

---

# 6. Information Has a Time Value

Information is not equally useful at all times.

The same information can be:

```text
Critical now
Useful later
Irrelevant now
```

The UI should reflect this.

Example:

```text
Tomorrow:
Weather forecast
```

During the event:

```text
Rain in 15 minutes
Move portrait session
```

The second is operationally more important.

---

# 7. Show the Next Relevant Thing

The default UI should answer:

> What do I need to know or do next?

This is more important than showing the complete project.

```text
NOW
 ↓
NEXT
 ↓
LATER
```

The system knows `LATER`.

The user usually needs `NOW` and `NEXT`.

---

# 8. Progressive Disclosure

Information should be revealed in layers.

```text
Layer 1
Summary

Layer 2
Context

Layer 3
Details

Layer 4
Full history / data
```

Never put all available information on the first screen.

---

# 9. Details on Demand

A compact card should remain compact.

If the user needs more information:

```text
Card
 ↓
Detail
 ↓
Full Object
```

Do not solve every information problem by making the card larger.

---

# 10. Timeline Is the Primary Spatial Model

The event exists in time.

The timeline is therefore one of the primary interfaces of the system.

```text
Start ───── Event ───── Event ───── Event ───── End
```

The timeline provides the temporal skeleton.

Other information attaches to it.

---

# 11. Everything Important Has a Place in Time

Where appropriate, information should be associated with:

```text
Before
During
After
```

Examples:

```text
Payment due
 ↓
Event
 ↓
Postproduction
 ↓
Delivery
```

This makes otherwise abstract information operational.

---

# 12. Timeline Is a Projection of the Graph

The timeline is not the database.

It is a temporal projection of the project graph.

```text
Graph
  ↓
Time
  ↓
Timeline
```

The same graph can produce different timelines for different users.

---

# 13. Every Role Gets Its Own Timeline View

There is one project timeline.

There are many role-specific views.

```text
Project Timeline
       ↓
   Role Filter
       ↓
Relevant Timeline
```

A driver does not need the photographer's workflow.

A DJ does not need the restaurant's preparation schedule.

---

# 14. Don't Make Everyone Manage Everything

A common failure of project-management software is forcing every participant to understand the whole project.

This system should do the opposite.

```text
Organizer:
Full context

Photographer:
Photography context

Driver:
Transport context

DJ:
Music / schedule context

Retoucher:
Postproduction context
```

---

# 15. The Right Amount of Information

The goal is not:

```text
Minimum Information
```

and not:

```text
Maximum Information
```

The goal is:

```text
Minimum Information
required for correct action
```

---

# 16. Optimize for Decisions

Every important piece of information should support one of:

```text
Understand
Decide
Act
Verify
```

If information does none of these, question whether it belongs in the current context.

---

# 17. Action Should Be Obvious

When an action is required, the UI should make it visually obvious.

```text
Retouching complete

[Review photos]
```

is better than:

```text
Retouching complete

Open Jobs
→ Find Project
→ Find Photographer
→ Find Retouching
→ Open Task
```

---

# 18. One Primary Action

A screen should usually have one dominant action.

Secondary actions should remain secondary.

```text
[Confirm Route]

Edit
Details
Share
```

not:

```text
[Confirm]
[Edit]
[Share]
[Delete]
[Move]
[Duplicate]
[Export]
[Archive]
```

all competing for attention.

---

# 19. Status Must Be Understandable Without Color

Never communicate state through color alone.

Bad:

```text
Green = Ready
Yellow = Waiting
Red = Problem
```

Good:

```text
✓ Ready
◷ Waiting
⚠ Problem
```

Color can reinforce meaning but should not be the only carrier.

---

# 20. Status Should Describe Reality

Avoid abstract internal statuses when a human-readable state exists.

Bad:

```text
PROCESSING_03
```

Good:

```text
Waiting for client confirmation
```

---

# 21. Status Should Lead to Action

A status without an implication is often useless.

Instead of:

```text
Payment:
Pending
```

prefer:

```text
Payment needed
Due tomorrow
```

when that information is relevant.

---

# 22. Don't Turn Everything Into a Task

Not every piece of information needs:

```text
Task
Assignee
Deadline
Priority
Status
```

Some information is simply context.

Examples:

```text
Weather
Location
Contact
Route
Schedule
```

The system should distinguish:

```text
Context
Event
Task
Decision
Document
Message
```

---

# 23. Don't Turn the Product Into a Task Manager

The event is the central object.

Tasks exist because work must be performed.

The system should not make task management the dominant interaction model.

```text
Event
 ↓
Required Work
 ↓
Tasks
```

not:

```text
Tasks
 ↓
Somehow produce an event
```

---

# 24. Don't Turn the Product Into a CRM

The user is not managing records.

The user is managing real-world work.

Contacts, clients and contractors exist within projects and relationships.

```text
Person
 ↓
Role
 ↓
Project
 ↓
Context
```

rather than:

```text
Contact Database
 ↓
Contact Record
 ↓
Activities
```

---

# 25. Don't Turn the Product Into a Messenger

Communication is important, but chat is not the system's source of truth.

Structured information should become structured information.

Example:

```text
Chat:
"Let's move the ceremony to 13:30."
```

After confirmation:

```text
Timeline:
Ceremony → 13:30
```

---

# 26. Don't Make Users Search Through Chat

If a decision affects the project, the system should extract or record the resulting state.

Users should not need to remember:

> "I think this was somewhere in the chat."

---

# 27. Chat Is Contextual

Messages should be attachable to:

```text
Project
Event
Task
Document
Person
Job
Decision
```

This creates a connection between communication and the project graph.

---

# 28. Changes Are First-Class Information

A changed route, time, location, contractor or document is often more important than the object itself.

The system should understand:

```text
Before
→
Change
→
After
```

Example:

```text
Ceremony

13:00
↓
changed
↓
13:30
```

---

# 29. Show Changes to the People They Affect

If the route changes, notify:

```text
Driver
Photographer
Coordinator
```

Do not notify:

```text
DJ
Cake Supplier
Retoucher
```

unless the change affects them.

---

# 30. Don't Broadcast Everything

A global announcement system creates noise.

Use graph relationships to determine impact.

```text
Change
 ↓
Affected Nodes
 ↓
Relevant Users
```

---

# 31. Exception-First Design

When everything is normal, stay quiet.

When something deviates, become explicit.

```text
Normal:
✓ Everything on schedule

Exception:
⚠ Ceremony delayed 20 min
```

The system should spend visual attention where reality diverges from the plan.

---

# 32. The System Should Adapt to Reality

The plan is a model of the future.

Reality can change it.

```text
Plan
 ↓
Reality
 ↓
Deviation
 ↓
New State
 ↓
Updated Context
```

The interface must represent the current state rather than stubbornly preserving the original plan.

---

# 33. Never Hide the Difference Between Plan and Reality

Important changes should be traceable.

```text
Planned:
13:00

Current:
13:30

Reason:
Traffic
```

This is more useful than silently changing the time.

---

# 34. Don't Over-Automate

Automation is useful when the outcome is predictable.

Do not automate decisions that require human judgement without making the decision explicit.

Good:

```text
Route changed
→
Affected users identified
```

Potentially dangerous:

```text
Weather detected
→
System automatically cancels portrait session
```

The system can recommend.

The responsible human decides.

---

# 35. Automation Should Be Explainable

Whenever possible:

```text
Why did this happen?
```

should have an answer.

Example:

```text
Route changed because:
Rain forecast exceeded threshold.
Organizer confirmed alternative location.
```

---

# 36. Automation Should Be Reversible

If the system performs an automatic action, users should be able to inspect and, where safe, undo it.

```text
Auto-updated route

[Undo]
[View changes]
```

---

# 37. AI Is Not the Foundation

The core system must work without AI.

```text
Core
├── Graph
├── Timeline
├── Context
├── Permissions
├── Communication
└── State

Optional
└── AI
```

AI can improve interaction but must not become a dependency.

---

# 38. AI Should Use Structured Reality

AI should operate on:

```text
Project Graph
Timeline
Documents
Messages
States
Permissions
```

It should not invent project state.

---

# 39. AI Should Not Become the UI

Avoid building the product around a giant:

```text
Ask AI anything
```

chat window.

The primary interface remains:

```text
Timeline
Context
Navigator
Cards
Actions
```

AI is an additional interface.

---

# 40. Design for Temporary Users

Some participants use the system once.

Examples:

```text
Driver
Musician
Decorator
Fireworks operator
Temporary assistant
One-day technician
```

They should not need to learn the entire product.

---

# 41. One-Day Users Need Zero-Friction Entry

The temporary user should receive:

```text
Role
Project
Current Context
Schedule
Relevant Contacts
Required Actions
```

and nothing unnecessary.

---

# 42. Temporary Access Is a Product Feature

Temporary access should be designed intentionally.

```text
Invite
 ↓
Accept
 ↓
Context Brief
 ↓
Work
 ↓
Complete
 ↓
Access Expires
```

---

# 43. Don't Make Temporary Users Build Profiles

If a person only needs to drive a car for one wedding, they should not need:

```text
Company profile
Portfolio
CRM history
Full onboarding
```

unless the organization explicitly wants it.

---

# 44. Minimize Memory Requirements

A user should not need to remember:

* where the latest route is;
* who changed it;
* where the document is;
* which version is current;
* who is responsible;
* what happens next.

The system should remember these things.

---

# 45. Externalize Memory

The product is an external memory system.

```text
Human Memory
+
Project Memory
```

The project memory belongs to the system.

---

# 46. "Sit Down in the Middle of the Movie"

A user can enter a project at any time.

The system should reconstruct enough context to make the user operational immediately.

```text
What is this?
What is my role?
What has happened?
What changed?
What happens next?
```

---

# 47. Context Brief Should Be Short

The context brief is not a project history.

It is a compressed operational briefing.

Bad:

```text
37 messages
12 documents
8 meetings
```

Good:

```text
You are the photographer.

Today's wedding:
Ivanov + Petrova

Your schedule:
10:00–22:00

Important:
Ceremony moved to 13:30.

Next:
Preparation at 10:00.

Contact:
Anna, coordinator.
```

---

# 48. Mobile First for the Moment

Mobile is primarily for execution.

The mobile interface should prioritize:

```text
Now
Next
Navigation
Communication
Quick Actions
```

---

# 49. Desktop First for Planning

Desktop is primarily for building and managing the project.

Priorities:

```text
Timeline
Projects
Documents
People
Communication
Postproduction
Finance
```

---

# 50. Same System, Different Density

iOS, Android and desktop should not become separate products.

They share:

```text
Data
Graph
Permissions
State
Design Language
```

They differ in:

```text
Density
Navigation
Interaction
Layout
```

---

# 51. PWA Is a Delivery Mechanism

PWA should allow the same system to work across:

```text
Desktop
iOS
Android
```

The architecture should not be built around a single device.

---

# 52. Offline Matters

Event work happens in places with unreliable connectivity.

Important information should remain available locally:

```text
Current Timeline
Current Context
Contacts
Locations
Recent Changes
Critical Documents
```

---

# 53. Sync Must Be Invisible When Possible

The user should not constantly think about synchronization.

The system should communicate sync problems only when they affect work.

---

# 54. Design for Attention Constraints

During a wedding, a photographer may:

* hold a camera;
* move between locations;
* talk to clients;
* work under time pressure;
* have little opportunity to read.

Therefore the interface must be:

```text
Glanceable
Fast
Readable
Predictable
```

---

# 55. Glanceability

A user should understand the current state with a quick look.

Important information should be recognizable in:

```text
< 2 seconds
```

This is a design target, not a strict technical requirement.

---

# 56. Don't Require Deep Interaction During Critical Moments

During active work:

```text
Tap
Confirm
Navigate
Call
Message
```

should be easy.

Complex editing belongs in calmer contexts.

---

# 57. Use the Environment

The interface can incorporate:

```text
Time
Weather
Location
Light
Travel
Availability
```

but only when these factors affect the current context.

---

# 58. Weather Is Context, Not a Dashboard

Don't show:

```text
Humidity
Wind
Pressure
UV
Cloud cover
```

just because the API provides them.

Show:

```text
Rain in 25 min
Golden hour at 19:42
Temperature 24°
```

when relevant to the role.

---

# 59. Same Data, Different Meaning

Example:

```text
Golden Hour 19:42
```

For photographer:

```text
Important
```

For accountant:

```text
Irrelevant
```

The UI must reflect role relevance.

---

# 60. The System Should Know What Not to Show

Good UX is partly the ability to suppress information.

```text
Relevance
=
Importance
×
Context
×
Time
×
Role
```

This is a conceptual model, not a literal required formula.

---

# 61. Don't Abuse Badges

Every badge creates visual competition.

Avoid:

```text
NEW
3
12
IMPORTANT
URGENT
2 updates
```

unless the badge has operational value.

---

# 62. Don't Abuse Red

Red should indicate genuine risk or destructive action.

Not:

```text
Unread
New
Interesting
```

---

# 63. Don't Abuse Animation

Animation should communicate:

```text
Transition
State Change
Spatial Relationship
Feedback
```

not decoration.

---

# 64. Motion Should Preserve Context

When opening details, the user should understand where the detail came from.

Example:

```text
Timeline Event
 ↓
Detail Panel
```

The transition should preserve spatial continuity.

---

# 65. Preserve Position

When navigating back from details, the user should return to the same:

```text
Project
Timeline Position
Scroll Position
Filter
```

where practical.

---

# 66. Don't Make Users Reconstruct Their Place

Bad:

```text
Open event
→ back
→ timeline reset
→ search for event again
```

Good:

```text
Open event
→ back
→ same position
```

---

# 67. Forms Should Be Short

The system should collect only information needed for the current stage.

Avoid huge forms like:

```text
Client creation
+
Project creation
+
Contract
+
Budget
+
Timeline
+
Team
```

in one screen.

---

# 68. Progressive Data Collection

Information can be added over time.

```text
Lead
 ↓
Project
 ↓
Confirmed Event
 ↓
Detailed Planning
 ↓
Execution
 ↓
Postproduction
```

The interface should follow the project's maturity.

---

# 69. Don't Ask for Information Too Early

If the system does not need a value yet, don't request it.

---

# 70. Don't Ask the Same Question Twice

Information should propagate through the graph.

Example:

```text
Client phone
```

entered once should become available wherever permissions allow:

```text
Project
Organizer
Photographer
Driver
Coordinator
```

---

# 71. One Source of Truth

If a piece of information has one canonical source, other interfaces should reference it.

For example:

```text
Event Time
```

should not exist independently in:

```text
Calendar
Task
Chat
Contractor Card
Navigator
```

They should all reference the same event state.

---

# 72. Avoid Duplicate Data

Duplicate data creates contradictions.

Bad:

```text
Timeline: 13:00
Chat: 13:30
Task: 14:00
```

Good:

```text
Timeline Event
13:30

Other views reference it.
```

---

# 73. History Is Important, But Secondary

The system should preserve history.

The UI should not constantly display it.

Current state first.

History on demand.

---

# 74. Auditability

When something important changes, the system should be able to answer:

```text
Who changed it?
When?
What changed?
Why?
Who was affected?
```

---

# 75. Trust

The system must create confidence.

Users should be able to trust:

```text
Current time
Current location
Current responsibility
Current version
Current status
```

---

# 76. Never Fake Certainty

If data is uncertain:

```text
Estimated
Unconfirmed
Tentative
Unknown
```

should be represented explicitly.

---

# 77. Separate Plan, Estimate and Fact

These are different states:

```text
Planned
Estimated
Confirmed
Actual
```

Do not visually merge them.

---

# 78. Example

```text
Transfer

Planned:
15:00

Estimated:
20 min

Actual:
15:12

Status:
In progress
```

---

# 79. Design for Change

Events are not static.

A wedding may change:

```text
Time
Location
Weather
Participants
Transport
Services
Budget
```

The UI must make change cheap and understandable.

---

# 80. Change Should Propagate

One change should update relevant projections automatically.

```text
Event changed
 ↓
Timeline
 ↓
Navigator
 ↓
Affected Roles
 ↓
Notifications
 ↓
Documents / Jobs if relevant
```

---

# 81. But Don't Propagate Blindly

Propagation must respect:

```text
Permissions
Role
Context
Data Sensitivity
```

---

# 82. Design for Scale

The system must work for:

```text
1 project
```

and:

```text
100 projects
```

without becoming visually overwhelming.

The organizer's interface should summarize at the organization level and focus on one project at a time.

---

# 83. Organization-Level UI

For agencies:

```text
Today
Projects
People
Exceptions
Capacity
```

rather than showing every project simultaneously.

---

# 84. Cross-Project Context

A photographer working on ten weddings should not need to open ten projects to understand their day.

The system can provide:

```text
My Day

10:00
Wedding A

14:00
Wedding B

18:00
Wedding C
```

Each item opens the relevant context.

---

# 85. Personal Workload

Every user should be able to see their own relevant workload.

Not the entire organization's workload.

```text
My Projects
My Events
My Jobs
My Deadlines
```

---

# 86. Teams

Teams should provide context and permissions.

They should not create unnecessary interface complexity.

A user should understand:

```text
Who am I working with?
Who is responsible?
Who do I contact?
```

without navigating an organizational chart.

---

# 87. Responsibility Must Be Visible

Every important piece of work should make ownership clear.

```text
Responsible:
Photographer

Support:
Coordinator
```

Avoid ambiguous states where everyone assumes someone else is responsible.

---

# 88. Don't Overuse Avatars

Avatars should identify people when necessary.

They should not become decoration.

---

# 89. Empty Space Is Hierarchy

Whitespace separates:

```text
Now
Next
Context
Details
```

Use spacing to communicate structure before adding visual decoration.

---

# 90. Visual Hierarchy Before Decoration

Before adding:

```text
color
shadow
gradient
illustration
animation
```

solve:

```text
hierarchy
spacing
typography
alignment
grouping
```

---

# 91. Consistency Over Novelty

The product should be predictable.

If:

```text
Card A
```

opens details one way,

```text
Card B
```

should behave similarly unless there is a strong reason otherwise.

---

# 92. But Don't Force Uniformity

Different information can require different presentation.

Timeline:

```text
Temporal
```

Document:

```text
Content
```

Person:

```text
Identity
```

Finance:

```text
Numbers
```

The system should have a coherent language without making every object look identical.

---

# 93. Design for Recognition

Prefer:

```text
recognition
```

over:

```text
recall
```

The user should recognize:

```text
location
person
status
next action
```

instead of remembering where it is hidden.

---

# 94. Minimize Navigation Depth

Important actions should not require many levels of navigation.

Target:

```text
Context
 ↓
Action
```

rather than:

```text
Home
 ↓
Projects
 ↓
Project
 ↓
Timeline
 ↓
Event
 ↓
Task
 ↓
Action
```

---

# 95. Contextual Navigation

Navigation can adapt to the current context.

When inside an event:

```text
Overview
Timeline
People
Documents
Chat
```

When inside postproduction:

```text
Jobs
Files
Review
Delivery
```

---

# 96. Don't Hide the Back Path

Users should always understand:

```text
Where am I?
How did I get here?
How do I return?
```

---

# 97. System Feedback Must Be Immediate

After an action:

```text
Save
Send
Confirm
Complete
```

the UI should provide immediate feedback.

The user should never wonder whether the action worked.

---

# 98. Optimistic UI Where Safe

For low-risk actions:

```text
Message sent
Status changed
Task completed
```

the interface can update immediately and synchronize in the background.

---

# 99. High-Risk Actions Need Confirmation

Examples:

```text
Delete project
Cancel contract
Change financial obligation
Remove participant
```

should use stronger confirmation.

---

# 100. Design for Recovery

Mistakes will happen.

The system should help users recover:

```text
Undo
History
Version
Restore
Conflict Resolution
```

---

# 101. Visual Language Should Be Quiet

The product is used in stressful operational situations.

The interface should reduce stress rather than increase it.

Prefer:

```text
clear
calm
precise
```

over:

```text
loud
dense
gamified
decorative
```

---

# 102. The UI Should Feel Like a Tool

The product should feel closer to:

```text
Navigation instrument
```

than:

```text
Social feed
```

or:

```text
Corporate dashboard
```

---

# 103. Design Around Reality

The real world is messy.

The system should not force reality into an artificial project-management structure.

Instead:

```text
Reality
 ↓
Events
 ↓
Relationships
 ↓
Graph
 ↓
Context
 ↓
Interface
```

---

# 104. The System Is a Shared Operational Memory

Different people hold different pieces of information.

The system connects them.

```text
Organizer
Photographer
Videographer
Driver
Florist
Venue
DJ
Client
```

Each sees the information necessary for their work.

---

# 105. Information Should Flow Automatically

The user should not become the messenger between every participant.

Bad:

```text
Organizer
 ↓
messages photographer
 ↓
photographer updates schedule
 ↓
photographer messages driver
```

Good:

```text
Timeline change
 ↓
Graph
 ↓
Affected users
 ↓
Updated context
```

---

# 106. Human Communication Remains Human

Automation should distribute information.

It should not replace necessary human communication.

The system can say:

```text
Маршрут изменён.
```

but people can still discuss:

```text
Почему?
Есть ли альтернативы?
Клиенты согласны?
```

---

# 107. Don't Hide the Human

The product coordinates people.

It should always remain possible to:

```text
Call
Message
Open Contact
See Responsible Person
```

---

# 108. The System Should Reduce Coordination Cost

The product's value is not simply:

```text
Store information
```

but:

```text
Reduce the number of coordination actions humans must perform.
```

---

# 109. The Most Important Design Test

For any new feature ask:

```text
Does this reduce cognitive load?
```

If not:

```text
Does it create meaningful operational value?
```

If not:

```text
Do we need it?
```

---

# 110. Final Principle

The product should make a complex event feel simple to the person doing one specific job.

The organizer may see:

```text
The whole system.
```

The photographer sees:

```text
His route.
His time.
His clients.
His next action.
```

The driver sees:

```text
His passengers.
His destinations.
His next pickup.
```

The retoucher sees:

```text
His jobs.
His files.
His deadlines.
```

The newlyweds see:

```text
Their wedding.
Its preparation.
Its current status.
```

Nobody needs to carry the whole project in their head.

---

# 111. Design North Star

> **The system knows the whole story so that each person only has to understand the next scene.**

```text
Whole Project
      ↓
Complex Graph
      ↓
Context
      ↓
Role
      ↓
Current Moment
      ↓
Next Relevant Action
```

This is the fundamental design model of the product.

```
```
