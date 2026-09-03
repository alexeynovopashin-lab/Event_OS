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
