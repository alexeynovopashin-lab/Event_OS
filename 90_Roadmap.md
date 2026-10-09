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
* contractor availability;
* hours map (light, optional): planned hours from fixed-time items and roles,
  actual hours entered by the person, rolled up through the event shell
  (Alexey, 09.10.2026; details and open questions: `51_Workflow.md §23`).
  No Scrum backlog or sprints.

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

---

# 31. Studio Catalogue — Venue as a Connected Participant

**Status: idea, recorded 2026-08-30. Not part of the MVP. Nothing implemented.**

Origin: Alexey, working across three of his projects — BroniOS (a booking
system for a photo studio, and in the future a catalogue of studios), Light Plan
(the photographer's PWA that plans light and the shooting day), and Event OS
itself, which is what connects the PWAs.

### The idea

A photo studio that lists itself in the catalogue publishes where it is on the
map — **which building, and which side of it**. Event OS can then add the studio
as a contractor on a project. Studio administrators can push information into
the photographer's app. The equipment list becomes tangible: a studio keeps its
own inventory of rental and additional lighting. The photographer gains not only
a planning tool but a line to the studio: extend the booked time, call the
administrator, and predict where the sun will fall on the cyclorama.

### Why it matters to this architecture

* The venue stops being a text field on a timeline and becomes a participant
  with its own data, its own inventory, and someone answering on the other end.
* `22_Roles.md` §12.1 already defines `Venue Manager` — the vocabulary exists.
  What does not exist is the path by which a venue joins a project **from a
  catalogue** rather than by invitation from an organizer.
* Phase 13 already names `shared contractors` and `contractor pools`. A studio
  catalogue is that concept seen from the other side: contractors that exist
  before, and independently of, any project.

### Open questions this raises for Event OS

1. **How is a studio addressed?** `BRIDGE_LIGHT_PLAN.md` §6 concluded that an
   organization gets no address at all — a legal entity cannot be sent anything;
   the human beside it can. A catalogue changes the setting rather than the
   conclusion: a registry with a keeper is exactly how LEI and DUNS assign
   identifiers. Unresolved: does the administrator answer with a personal ID, or
   does the studio receive an assigned address of its own?
2. **Consent for writes.** "Administrators can push information into Light Plan"
   is the same unresolved question already recorded for organizers writing into
   a photographer's timeline (`23_Permissions.md` grants `ASSIGN`/`INVITE`/`RW`
   but never states whether the recipient must agree). One answer should cover
   both.
3. **Requests that need a reply.** Extending a booking is not a notification —
   it is a request that must be answered before the paid hour ends.
   `53_Notifications.md` describes delivery, not negotiation.
4. **Catalogue is not marketplace.** §22 lists `marketplace` among things that
   must stay out of the MVP, and that stands. A catalogue here means a directory
   plus a channel — no transaction, no commission, no ranking. If that line ever
   blurs, the §22 exclusion applies.

5. **Two channels, not one.** A photographer booking a studio for a portrait
   session has no event in the Event OS sense — that is topology 1 in
   `BRIDGE_LIGHT_PLAN.md` §4, and it is the most common case. Extending a
   booking or calling an administrator must work without Event OS at all. Event
   OS enters only where the studio is a contractor **on an event**: an agency
   running a wedding that also holds the venue. Direct `photographer ↔ studio`
   and `event ↔ studio` are separate channels and should stay separate.

### Levels of abstraction

The three systems answer different questions about the same reality, and none
of them should try to answer all three:

```text
Event OS       who, with whom, when
Studio system  where, and how to book it
Light Plan     what the light will be like there
```

The Russian-language discussion, with the wording as Alexey gave it, is in
`BRIDGE_LIGHT_PLAN.md` §9 and in the Light Plan repository, `ROADMAP.md`,
section «Студия в каталоге: место, которое отвечает».

````
