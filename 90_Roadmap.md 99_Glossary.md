# 90_Roadmap.md

````markdown
# Roadmap

**Document:** `90_Roadmap.md`  
**Version:** `0.1.0`  
**Status:** Draft

---

## 1. Purpose

This roadmap defines the development sequence for the system.

The roadmap is organized around the evolution of the product model, not around a list of UI features.

The central principle:

> Build the operational core first. Add intelligence, automation and scale only after the underlying project model is reliable.

---

# 2. Product Evolution

The system evolves through several major stages:

```text
Foundation
    ↓
Project Model
    ↓
Timeline
    ↓
Context Engine
    ↓
Roles & Permissions
    ↓
Communication
    ↓
Execution
    ↓
Postproduction
    ↓
Finance
    ↓
Multi-project / Agency
    ↓
Intelligence
````

---

# 3. Phase 0 — Foundation

## Goal

Establish the technical foundation for a multi-platform PWA.

### Platforms

* Desktop web
* iOS PWA
* Android PWA

### Core requirements

* authentication;
* organizations;
* users;
* projects;
* basic permissions;
* responsive application shell;
* offline-capable architecture;
* synchronization;
* notifications.

### Result

A user can enter the system, belong to an organization and access a project.

---

# 4. Phase 1 — Project Model

## Goal

Replace scattered tables, documents and chats with a connected project model.

### Core entities

* Organization
* Project
* Client
* Person
* Team
* Role
* Event
* Location
* Service
* Contractor
* Document
* Communication

### Requirements

Every object must have:

* unique identity;
* state;
* relationships;
* permissions;
* history.

### Result

The system becomes a structured project environment rather than a collection of pages.

---

# 5. Phase 2 — Timeline

## Goal

Make time the primary operational representation of the project.

### Features

* project timeline;
* events;
* milestones;
* locations;
* participants;
* dependencies;
* planned time;
* actual time;
* changes;
* role-specific timeline views.

### Example

```text
10:00
Preparation

12:30
Transfer

13:00
Ceremony

14:00
Portraits

18:00
Reception

22:00
End
```

### Result

The project becomes understandable as a sequence of events.

---

# 6. Phase 3 — Context Engine

## Goal

Generate a relevant view of the project for each person.

### Inputs

```text
Role
Project
Time
Location
Timeline
Relationships
Changes
Permissions
Current state
```

### Output

```text
Current context
Next relevant information
Required actions
Important changes
```

### Result

Different users see different projections of the same project graph.

---

# 7. Phase 4 — Navigator

## Goal

Turn the timeline and context engine into an operational interface.

The Navigator should answer:

> What do I need to know right now?

### Core states

```text
NOW
NEXT
ATTENTION
LATER
```

### Features

* current event;
* next event;
* route;
* location;
* relevant people;
* current changes;
* weather when relevant;
* quick actions.

### Result

A user can participate in a complex event without knowing the entire project.

---

# 8. Phase 5 — Roles & Permissions

## Goal

Support different types of users without exposing the entire project.

### Roles

Examples:

* organizer;
* coordinator;
* photographer;
* videographer;
* driver;
* florist;
* decorator;
* DJ;
* host;
* musician;
* venue;
* catering;
* technician;
* retoucher;
* client.

### Features

* role-based permissions;
* project-level access;
* team access;
* temporary access;
* one-day users;
* client access;
* organization-level permissions.

### Result

The same project can safely serve many different participants.

---

# 9. Phase 6 — Communication

## Goal

Integrate communication into the project graph.

### Features

* project chat;
* contextual chat;
* direct messages;
* team conversations;
* mentions;
* attachments;
* system messages;
* change notifications;
* message-to-object relationships.

### Important principle

Chat is not the source of truth.

Important decisions should update structured project state.

### Result

Communication becomes connected to the project instead of existing beside it.

---

# 10. Phase 7 — Change Propagation

## Goal

Make changes travel automatically through the system.

### Example

```text
Ceremony
13:00 → 13:30
```

The system determines affected participants:

```text
Photographer
Videographer
Coordinator
Driver
Venue
```

and updates their relevant contexts.

### Requirements

* impact detection;
* affected-user calculation;
* notifications;
* timeline update;
* audit history.

### Result

The organizer no longer has to manually tell everyone about every change.

---

# 11. Phase 8 — Documents

## Goal

Make documents part of the project graph.

### Document types

* contracts;
* briefs;
* route sheets;
* estimates;
* technical requirements;
* schedules;
* invoices;
* client documents;
* vendor documents.

### Features

* versions;
* permissions;
* contextual attachments;
* document status;
* change history.

### Result

The system knows which document belongs to which project, person, event or job.

---

# 12. Phase 9 — Execution

## Goal

Support the event day itself.

The system changes from planning mode to operational mode.

### Priorities

```text
NOW
NEXT
CHANGE
ATTENTION
CONTACT
NAVIGATION
```

### Features

* live timeline;
* current location;
* route;
* participant status;
* real-time changes;
* quick communication;
* incident information;
* actual event times.

### Result

The system becomes an operational navigator during the event.

---

# 13. Phase 10 — Postproduction

## Goal

Support work that continues after the event.

This is particularly important for photographers and videographers.

### Workflow

```text
Event
 ↓
Files
 ↓
Transfer
 ↓
Retouching
 ↓
Color
 ↓
Review
 ↓
Delivery
 ↓
Client
```

### Features

* jobs;
* file transfer;
* P2P transfer;
* retoucher access;
* status;
* completion;
* review;
* delivery;
* client notification.

### Result

The event does not end when the wedding ends.

---

# 14. Phase 11 — Client Portal

## Goal

Give clients controlled temporary access.

### Client can see

* project status;
* preparation progress;
* selected information;
* documents;
* communication;
* delivery;
* approved milestones.

### Client should not see

* internal discussions;
* private financial information;
* unrelated contractors;
* internal tasks;
* organizational data.

### Result

Clients receive transparency without gaining access to the internal operating system.

---

# 15. Phase 12 — Finance

## Goal

Provide financial context without becoming an accounting or payment system.

### Features

* planned amount;
* agreed amount;
* paid;
* partially paid;
* needs payment;
* payment deadline;
* expenses;
* financial notes;
* documents.

### Explicit non-goals

The system does not require:

* acquiring;
* payment processing;
* bank integration;
* tax reporting.

### Result

Financial state becomes part of the project without turning the product into accounting software.

---

# 16. Phase 13 — Organization & Agency

## Goal

Support professional agencies and multiple teams.

### Features

* organizations;
* multiple teams;
* multiple cities;
* multiple agencies;
* shared contractors;
* contractor pools;
* availability;
* workload;
* organization-level dashboards.

### Example

```text
Agency
├── Tomsk
│   ├── Team A
│   └── Team B
│
├── Moscow
│   └── Team C
│
└── Novosibirsk
    └── Team D
```

### Result

The same architecture works for an individual organizer and a large agency.

---

# 17. Phase 14 — Workload & Availability

## Goal

Allow participants to understand their own workload.

### Features

* personal schedule;
* availability;
* project workload;
* overlapping events;
* team workload;
* contractor availability.

### Important principle

The user sees their workload.

They do not need to browse the entire organization's calendar.

---

# 18. Phase 15 — Intelligence

## Goal

Add optional AI and automation after the underlying system is mature.

### Possible capabilities

* summarize project;
* generate briefing;
* detect conflicts;
* identify affected participants;
* suggest schedule changes;
* summarize communication;
* detect missing information;
* generate documents;
* answer contextual questions;
* prepare role-specific instructions.

### Example

```text
Organizer:
"What changed since yesterday?"
```

System:

```text
3 important changes:

1. Ceremony moved to 13:30.
2. Photographer route changed.
3. Rain expected during portraits.

Affected:
Photographer
Videographer
Driver
Coordinator
```

---

# 19. AI Must Remain Optional

The system must remain fully usable without AI.

AI is an additional layer:

```text
Core System
    ↓
Context
    ↓
Structured Data
    ↓
Optional AI
```

not:

```text
AI
 ↓
Everything
```

---

# 20. Phase Dependencies

The phases should not be implemented independently.

```text
Project Model
      ↓
Timeline
      ↓
Graph
      ↓
Context Engine
      ↓
Roles / Permissions
      ↓
Navigator
      ↓
Communication
      ↓
Change Propagation
```

Postproduction, finance and client access depend on the same underlying model.

---

# 21. MVP

The MVP should prove the central product hypothesis.

It does not need every feature.

### MVP must contain

```text
Organization
Project
People
Roles
Timeline
Permissions
Context
Navigator
Communication
Changes
PWA
```

### MVP must demonstrate

```text
Organizer creates project
        ↓
Adds participants
        ↓
Builds timeline
        ↓
Participant receives access
        ↓
Participant sees relevant context
        ↓
Timeline changes
        ↓
Affected users receive updated information
```

This is the core product.

---

# 22. What Should NOT Be in MVP

Avoid early implementation of:

* complex accounting;
* acquiring;
* advanced AI;
* large CRM automation;
* elaborate analytics;
* marketplace;
* loyalty systems;
* social features;
* excessive customization;
* complex reporting.

These features do not prove the central hypothesis.

---

# 23. First Vertical Slice

The first complete workflow should be:

```text
Organizer
    ↓
Creates wedding
    ↓
Creates timeline
    ↓
Adds photographer
    ↓
Photographer receives access
    ↓
Photographer sees personal timeline
    ↓
Organizer changes ceremony time
    ↓
System detects impact
    ↓
Photographer receives update
    ↓
Photographer sees new next action
```

If this workflow feels natural, the core architecture is working.

---

# 24. Second Vertical Slice

```text
Organizer
    ↓
Adds photographer
    ↓
Event happens
    ↓
Photographer uploads/transfers work
    ↓
Retoucher receives job
    ↓
Retoucher completes job
    ↓
Photographer receives notification
    ↓
Photographer delivers photos
    ↓
Organizer sees delivery status
    ↓
Client receives access
```

---

# 25. Third Vertical Slice

```text
Organizer
    ↓
Creates event
    ↓
Adds multiple contractors
    ↓
Each receives role-specific context
    ↓
Schedule changes
    ↓
System identifies affected roles
    ↓
Relevant users receive updates
    ↓
Everyone continues from the new state
```

This validates the graph model.

---

# 26. Technical Priorities

The technical architecture should prioritize:

1. data model;
2. graph relationships;
3. permissions;
4. synchronization;
5. timeline engine;
6. context engine;
7. event/change system;
8. offline behavior;
9. notifications;
10. UI.

Do not optimize visual details before the underlying state model is stable.

---

# 27. Product Priorities

The product should prioritize:

```text
1. Clarity
2. Reliability
3. Context
4. Speed
5. Change propagation
6. Communication
7. Automation
8. Intelligence
```

---

# 28. Roadmap Rule

Every proposed feature should answer:

```text
Which problem does this solve?
Who needs it?
When do they need it?
What context does it require?
What existing object does it connect to?
```

If the feature cannot answer these questions, it should not automatically enter the roadmap.

---

# 29. Roadmap North Star

The product is successful when:

> An organizer can coordinate a complex event without manually transmitting every change, while every participant can arrive at any moment, understand their role and immediately know what matters now.

```text
Organizer sees the whole system.

Each participant sees their part.

The system connects both.
```

---

# 30. Definition of Product Maturity

### Level 1 — Repository

The system stores information.

### Level 2 — Project Management

The system organizes information.

### Level 3 — Coordination

The system connects participants.

### Level 4 — Context

The system shows relevant information.

### Level 5 — Navigation

The system guides users through the event.

### Level 6 — Intelligence

The system anticipates problems and helps resolve them.

The desired product is Level 5 with optional Level 6 intelligence.

````


---

# 99_Glossary.md

```markdown
# Glossary

**Document:** `99_Glossary.md`  
**Version:** `0.1.0`  
**Status:** Draft

---

## A

### Access

Permission for a person to enter a project, workspace, team or specific object.

Access may be:

- permanent;
- temporary;
- role-based;
- project-specific;
- organization-wide.

---

### Agency

An organization that coordinates multiple projects, teams and contractors.

---

### Actual

The real state or value recorded after an event has happened.

Example:

```text
Planned: 13:00
Actual: 13:27
````

---

## C

### Client

A customer or participant who receives controlled access to a project.

In a wedding project this is usually the couple.

---

### Context

The subset of project information relevant to a specific person at a specific moment.

Context depends on:

```text
Person
Role
Project
Time
Location
Current state
Relationships
Changes
Permissions
```

---

### Context Engine

The system responsible for determining which information is relevant to a user.

```text
Project Graph
    ↓
Context Engine
    ↓
Role
    ↓
Current Situation
    ↓
Relevant Information
```

---

### Contractor

An external person or organization providing a service to a project.

Examples:

* photographer;
* DJ;
* florist;
* decorator;
* driver;
* musician.

---

## D

### Decision

A confirmed choice that affects the project.

Examples:

* ceremony moved to another location;
* photographer confirmed;
* menu approved;
* route changed.

A decision may originate in communication but should become structured project information when appropriate.

---

### Dependency

A relationship in which one event, task or object depends on another.

Example:

```text
Ceremony
    ↓
Portraits
    ↓
Reception
```

---

## E

### Event

A scheduled occurrence in the real world.

Examples:

* ceremony;
* preparation;
* portrait session;
* dinner;
* transfer;
* concert;
* corporate presentation.

An event has temporal and often spatial properties.

---

### Event Day

The period during which the planned event is actually taking place.

The system shifts into operational mode during this period.

---

## G

### Graph

The connected model of the project.

Nodes represent entities.

Edges represent relationships.

```text
Project
├── Client
├── Event
├── Person
├── Team
├── Location
├── Document
└── Job
```

---

### Graph Node

An object represented in the project graph.

Examples:

* person;
* event;
* project;
* document;
* location;
* job.

---

### Graph Edge

A relationship between two nodes.

Examples:

```text
Person → assigned to → Event
Person → belongs to → Team
Event → occurs at → Location
Job → belongs to → Project
Document → describes → Event
```

---

## J

### Job

A unit of professional work that must be performed.

Examples:

* retouching;
* color grading;
* video editing;
* album design.

A job is more specific than a generic project task.

---

## M

### Milestone

A significant point in the project.

Examples:

* contract signed;
* event confirmed;
* final schedule approved;
* photos delivered.

---

### Navigator

The operational interface that answers:

> What do I need to know or do now?

The Navigator is a projection of the timeline and project graph for a specific user.

Typical structure:

```text
NOW
NEXT
ATTENTION
```

---

## O

### Organization

The top-level operational entity representing a business, agency or independent professional.

An organization may contain:

* users;
* teams;
* projects;
* contractors;
* clients;
* locations.

---

### Organizer

The person responsible for coordinating the event.

The organizer generally has the broadest operational context.

---

## P

### Participant

Any person or organization involved in a project.

A participant may have one or more roles.

---

### Permission

A rule determining what a user may:

* see;
* create;
* edit;
* delete;
* communicate;
* administer.

Permissions are separate from roles, although roles may determine default permissions.

---

### Planned

A value or state defined as part of the intended future plan.

Example:

```text
Planned ceremony:
13:00
```

---

### Project

The central container for a real-world event and all related information.

A project may contain:

```text
Client
People
Teams
Events
Timeline
Locations
Documents
Communication
Finance
Jobs
```

---

### Project Graph

The complete network of relationships inside a project.

It represents how people, events, locations, documents, tasks and other entities relate to one another.

---

### PWA

Progressive Web App.

The primary delivery model allowing the same application to operate across:

* desktop;
* iOS;
* Android.

---

## R

### Role

The function a person performs within a project.

Examples:

* organizer;
* photographer;
* videographer;
* driver;
* DJ;
* florist;
* decorator;
* retoucher.

A role determines the default context and permissions of a participant.

---

### Role Context

The project information relevant to a specific role.

Example:

```text
Photographer:
Timeline
Locations
Light
Weather
Clients
Route
Photography jobs
```

---

## S

### Service

A professional service provided within a project.

Examples:

* photography;
* catering;
* decoration;
* transportation;
* sound;
* lighting.

---

### State

The current condition of an object.

Examples:

```text
Draft
Confirmed
In Progress
Completed
Cancelled
```

State should represent reality, not merely database implementation.

---

### Status

A human-readable representation of the current state of an object or process.

---

### Sync

Synchronization of project state between devices and users.

The system should minimize the need for users to think about synchronization.

---

## T

### Task

A discrete piece of work that can be assigned and completed.

Tasks exist within the broader project model.

The product should not reduce every piece of information to a task.

---

### Temporary Access

Access granted to a participant for a limited period or purpose.

Typical users:

* one-day drivers;
* musicians;
* temporary assistants;
* event technicians.

---

### Timeline

The temporal representation of a project.

It describes:

```text
When
What
Where
Who
```

and may additionally contain:

* dependencies;
* changes;
* actual times;
* weather;
* navigation;
* status.

The timeline is one of the primary interfaces of the system.

---

### Timeline Projection

A role-specific or context-specific representation of the main project timeline.

The underlying timeline is shared.

The visible projection differs by user.

---

## W

### Workspace

A structured environment for working with a particular area of the system.

Examples:

* project workspace;
* postproduction workspace;
* organization workspace.

A workspace is an interface concept, not necessarily an independent data entity.

---

## Contextual Terms

### "Now"

Information required for the user's immediate situation.

---

### "Next"

The next relevant event, action or decision.

---

### "Attention"

Something that deviates from the expected plan or requires awareness.

Examples:

* delay;
* weather change;
* missing confirmation;
* route change.

---

### "Later"

Relevant information that does not require attention yet.

---

### "One-Day User"

A participant who needs the system only for a specific event or short period.

The product should minimize onboarding and interface complexity for this user type.

---

### "Middle of the Movie"

The condition in which a person joins an already-running project without previous knowledge.

The system must provide enough context for immediate understanding.

---

### "Shared Operational Memory"

The project memory maintained by the system instead of being distributed across individual people's heads, chats, documents and private notes.

---

### "Navigator Model"

The principle that a participant does not need to understand the whole route.

They need to know:

```text
Where am I?
What is next?
Where do I go?
What changed?
```

---

### "Graph Projection"

A filtered representation of the project graph shown according to:

```text
Role
Time
Location
Permissions
Current state
```

---

### "Contextual Information"

Information that becomes relevant because of the user's current role, location, time or situation.

---

### "Exception"

A deviation from the expected plan.

Examples:

* delay;
* weather change;
* missing contractor;
* location change;
* schedule conflict.

Exceptions should receive more attention than normal operations.

---

## Product Vocabulary Rules

The following terminology should remain consistent across the product.

### Prefer

```text
Project
Event
Role
Participant
Context
Timeline
Navigator
Job
Status
Change
Decision
```

### Avoid when a more precise term exists

```text
Ticket
Lead
Deal
Pipeline
Record
Case
Card
Issue
```

These terms tend to push the product toward generic CRM or task-management semantics.

---

## Core Vocabulary Model

```text
Organization
    ↓
Project
    ↓
Graph
    ├── People
    ├── Roles
    ├── Teams
    ├── Events
    ├── Locations
    ├── Documents
    ├── Jobs
    ├── Communication
    └── Finance

Graph
    ↓
Timeline
    ↓
Context Engine
    ↓
Navigator
    ↓
Person
```

---

## Fundamental Distinctions

### Project vs Event

A project contains the entire engagement.

An event is a specific occurrence within the project.

---

### Role vs Person

A person is an individual.

A role describes what that person does within a project.

One person may have multiple roles.

---

### Task vs Event

An event happens at a particular time.

A task represents work that must be performed.

---

### Status vs State

State is the underlying condition.

Status is the human-readable representation of that condition.

---

### Plan vs Actual

Plan describes intended future reality.

Actual describes what really happened.

---

### Chat vs Decision

Chat is communication.

A decision is a confirmed project state resulting from communication or another action.

---

### Document vs Information

A document is an artifact.

Information may exist independently of a document.

---

### Context vs Project

The project contains the whole system.

Context is the part relevant to one person at one moment.

---

## Final Definition

The product can be summarized by the following vocabulary chain:

```text
REAL WORLD
    ↓
PROJECT
    ↓
GRAPH
    ↓
TIMELINE
    ↓
CONTEXT
    ↓
NAVIGATOR
    ↓
ACTION
```

The system stores the whole project.

The user receives only the part necessary to act correctly.

```
```
