# 31_AI_Skills.md

````markdown
# AI Skills

**Document:** `31_AI_Skills.md`  
**Version:** `0.1.0`  
**Status:** Draft

---

## 1. Purpose

This document defines the capabilities, boundaries and operating rules for AI agents working inside the system.

AI Skills are not product features by themselves.

A Skill is a reusable capability that allows an AI agent to perform a specific class of work using the project's structured data, graph, timeline, context and available tools.

The system must remain fully functional without AI.

---

# 2. Core Principle

> An AI agent should operate on the project's reality, not invent its own version of reality.

The agent must:

1. retrieve relevant context;
2. understand the user's role;
3. respect permissions;
4. use structured project data as the source of truth;
5. distinguish facts from assumptions;
6. propose changes when appropriate;
7. obtain confirmation before important writes;
8. preserve traceability.

---

# 3. Skill Architecture

AI Skills sit above the core system.

```text
User
  ↓
AI Agent
  ↓
Skills
  ↓
Tools
  ↓
Context Engine
  ↓
Project Graph
  ↓
Project State
````

A Skill defines **what the agent can do**.

A Tool defines **how the agent accesses or changes the system**.

---

# 4. Skill vs Tool

## Skill

A higher-level capability.

Examples:

```text
Summarize Project
Prepare Role Briefing
Detect Schedule Conflict
Analyze Change Impact
Draft Message
Prepare Event Day Briefing
```

## Tool

A concrete system operation.

Examples:

```text
get_project()
get_timeline()
get_event()
get_person()
get_messages()
get_weather()
update_event()
create_task()
send_message()
```

A Skill may use multiple Tools.

---

# 5. Skill Design Principles

Every Skill must be:

* contextual;
* permission-aware;
* deterministic where possible;
* explainable;
* reversible when it changes state;
* scoped;
* auditable;
* independent from a specific AI model.

---

# 6. Skill Input

A Skill may receive:

```text
User
Role
Organization
Project
Current time
Current location
Current event
Relevant graph nodes
Timeline
Changes
Permissions
User request
```

The Skill should request only the information it needs.

---

# 7. Skill Output

A Skill should produce one or more of:

```text
Answer
Summary
Warning
Recommendation
Draft
Structured proposal
Action
Question
```

The output should indicate whether it is:

```text
Fact
Inference
Recommendation
Unconfirmed information
```

---

# 8. Skill Categories

Skills are grouped into:

```text
01. Orientation
02. Context
03. Timeline
04. Coordination
05. Communication
06. Documents
07. Planning
08. Risk
09. Weather & Environment
10. Navigation
11. Postproduction
12. Finance
13. Client
14. Organization
15. Analytics
16. Administration
```

---

# 9. Orientation Skills

## SKILL: Project Overview

### Purpose

Provide a concise understanding of a project.

### Input

```text
Project
```

### Output

```text
Client
Event
Date
Location
Current status
Important upcoming events
Outstanding issues
```

### Example

```text
This is the Ivanov–Petrova wedding.

Tomorrow:
10:00 preparation
13:30 ceremony
18:00 reception

Two unresolved items:
- transport confirmation
- rain plan
```

---

## SKILL: What Changed

### Purpose

Identify important changes since a specified point in time.

### Input

```text
Project
Timestamp
Role
```

### Output

```text
Changes
Affected participants
Current state
```

---

## SKILL: What Matters Now

### Purpose

Answer the fundamental Navigator question:

> What matters to me right now?

### Input

```text
Role
Current time
Current location
Project
Timeline
```

### Output

```text
NOW
NEXT
ATTENTION
```

This Skill should be extremely concise.

---

## SKILL: Middle of the Movie

### Purpose

Brief a person who has joined a project late.

### Input

```text
Project
Role
Current time
```

### Output

```text
What is happening
My role
What has already happened
What changed
What happens next
Who matters
```

---

# 10. Context Skills

## SKILL: Build Role Context

### Purpose

Generate the information relevant to a specific role.

### Example

Photographer:

```text
Timeline
Locations
Light
Weather
Clients
Route
Photography assignments
Relevant contacts
Changes
```

Driver:

```text
Pickup
Destination
Passengers
Route
Timing
Vehicle requirements
Changes
```

The project is shared.

The context is not.

---

## SKILL: Build Current Context

### Purpose

Generate the smallest useful context for the current situation.

```text
Current event
Current location
Next event
Relevant people
Recent changes
Warnings
```

---

## SKILL: Context Compression

### Purpose

Reduce a large project into a concise operational briefing.

### Rule

Do not summarize everything.

Summarize what is relevant to the user.

---

# 11. Timeline Skills

## SKILL: Explain Timeline

Explain a timeline in natural language.

Example:

```text
You finish preparation at 12:20.

You leave at 12:25.

Ceremony starts at 13:30.

The new location is approximately 15 minutes away.
```

---

## SKILL: Generate Timeline

### Purpose

Create a proposed schedule from project constraints.

### Inputs

```text
Event
People
Locations
Durations
Dependencies
Travel
Requirements
```

### Output

A proposed timeline.

The timeline must be marked as:

```text
PROPOSED
```

until confirmed.

---

## SKILL: Validate Timeline

Check:

* overlapping assignments;
* impossible travel;
* insufficient setup time;
* missing buffers;
* unavailable participants;
* venue restrictions;
* dependency violations.

---

## SKILL: Find Timeline Conflicts

Return:

```text
Conflict
Reason
Affected people
Severity
Possible solutions
```

---

## SKILL: Explain Timeline Change

Explain:

```text
What changed
Why it changed
Who is affected
What the user needs to do
```

---

# 12. Coordination Skills

## SKILL: Impact Analysis

### Purpose

Determine which graph nodes are affected by a change.

Example:

```text
Ceremony moved 30 minutes.

Affected:
Photographer
Videographer
Driver
Venue

Unaffected:
Retoucher
Cake delivery
Florist
```

The graph determines relationships.

The Skill explains the result.

---

## SKILL: Identify People to Notify

Determine which participants should receive information about a change.

Never notify everyone by default.

---

## SKILL: Prepare Change Briefing

Generate a role-specific explanation of a confirmed change.

Example:

```text
Photographer:

Ceremony moved from 13:00 to 13:30.
Location unchanged.
Your portrait session remains at 14:30.
```

---

## SKILL: Detect Missing Assignment

Identify required roles without assigned participants.

Example:

```text
The project has a confirmed ceremony venue,
but no sound technician is assigned.
```

---

## SKILL: Detect Missing Confirmation

Identify important information that remains tentative.

---

# 13. Communication Skills

## SKILL: Draft Message

Create a message for a specific recipient.

Inputs:

```text
Recipient
Purpose
Context
Tone
Relevant project state
```

---

## SKILL: Rewrite Message

Improve clarity while preserving meaning.

The Skill must not introduce new facts.

---

## SKILL: Summarize Chat

Summarize a conversation into:

```text
Decisions
Changes
Tasks
Questions
Unresolved issues
```

---

## SKILL: Extract Decision

Identify a potential decision from communication.

Example:

```text
Message:
"Let's move the ceremony to the garden at 13:30."

Detected:

Potential decision:
Ceremony location → Garden
Ceremony time → 13:30
```

The change remains unconfirmed until explicitly accepted.

---

## SKILL: Extract Task

Identify actionable work from communication.

Example:

```text
"Can you send the updated route to the driver?"

Task:
Send updated route

Assignee:
Coordinator
```

---

## SKILL: Communication Digest

Create a concise digest of important communications.

Do not summarize every message.

---

# 14. Document Skills

## SKILL: Summarize Document

Extract:

```text
Purpose
Important dates
People
Locations
Requirements
Financial information
Restrictions
Potential conflicts
```

---

## SKILL: Extract Structured Data

Convert document information into candidate project objects.

Example:

```text
Document
 ↓
Detected event
 ↓
Time
 ↓
Location
 ↓
Participants
```

---

## SKILL: Compare Documents

Compare versions and identify:

```text
Added
Removed
Changed
```

---

## SKILL: Detect Document Conflicts

Example:

```text
Venue schedule:
Ceremony 13:00

Project timeline:
Ceremony 13:30
```

Return the conflict instead of choosing silently.

---

## SKILL: Document Checklist

Identify missing required documents.

---

# 15. Planning Skills

## SKILL: Planning Assistant

Help construct a project plan.

The Skill should consider:

```text
Dependencies
Availability
Timeline
Resources
Locations
Roles
Deadlines
```

---

## SKILL: Preparation Checklist

Generate a checklist for a specific role or event.

Example:

```text
Photographer

Before departure:
[ ] Batteries
[ ] Cards
[ ] Cameras
[ ] Flash
[ ] Route
[ ] Client contact
```

The checklist may be customized from the project.

---

## SKILL: Pre-Event Briefing

Generate a briefing shortly before the event.

---

## SKILL: Post-Event Checklist

Generate tasks after the event.

Example for photographer:

```text
Transfer files
Backup
Create postproduction job
Send files
Review
Delivery
Client communication
Follow-up
```

---

# 16. Risk Skills

## SKILL: Risk Detection

Identify potential operational risks.

Examples:

```text
Tight transfer
Unconfirmed location
Weather risk
Missing contractor
Overlapping assignment
Missing document
```

---

## SKILL: Risk Prioritization

Classify risks by:

```text
Severity
Probability
Time sensitivity
Affected participants
```

---

## SKILL: Mitigation Proposal

Suggest practical alternatives.

Example:

```text
Risk:
Rain during outdoor ceremony.

Options:
1. Move ceremony indoors.
2. Prepare covered location.
3. Prepare umbrellas and shorten outdoor segment.
```

The Skill does not make the final decision.

---

# 17. Weather & Environment Skills

## SKILL: Weather Summary

Provide concise weather information relevant to the current project.

---

## SKILL: Weather Impact

Determine which events may be affected.

Example:

```text
Rain:
16:30–17:20

Affected:
Outdoor portraits

Not affected:
Indoor reception
```

---

## SKILL: Weather Scenario

Suggest operational alternatives.

---

## SKILL: Light Analysis

For photography-related projects:

```text
Sunrise
Sunset
Golden hour
Blue hour
Light direction
Relevant location
```

The Skill should use actual astronomical/weather data where available.

---

# 18. Navigation Skills

## SKILL: Route Context

Provide route information relevant to the current assignment.

---

## SKILL: Travel Feasibility

Determine whether travel fits inside the available time.

---

## SKILL: Route Change Impact

Identify users whose schedules are affected by a route change.

---

## SKILL: Navigator Explanation

Explain why the user is going somewhere.

Example:

```text
You are heading to the ceremony venue.

The location changed at 11:40.
Your previous destination is no longer relevant.
```

---

# 19. Postproduction Skills

## SKILL: Postproduction Status

Summarize the state of postproduction.

Example:

```text
Files transferred.
Retouching completed.
Color grading in progress.
Client delivery not started.
```

---

## SKILL: Detect Postproduction Blocker

Examples:

```text
Missing files
Missing brief
Retoucher unavailable
Overdue job
Unapproved result
```

---

## SKILL: Postproduction Brief

Generate instructions for a retoucher, colorist or editor.

---

## SKILL: Delivery Readiness

Determine whether the project is ready for client delivery.

---

## SKILL: Client Follow-Up

Suggest appropriate follow-up after delivery.

Possible topics:

```text
Feedback
Photo book
Additional services
Referral
```

The system must avoid aggressive sales automation.

---

# 20. Finance Skills

## SKILL: Financial Summary

Summarize project financial state.

---

## SKILL: Payment Status

Explain:

```text
Paid
Partially paid
Needs payment
Overdue
```

---

## SKILL: Financial Anomaly

Identify inconsistencies.

Example:

```text
Contract:
€4,000

Project record:
€4,500
```

The Skill should flag the difference.

---

## SKILL: Finance Briefing

Prepare a concise organizer-level financial overview.

AI must not perform accounting or tax decisions.

---

# 21. Client Skills

## SKILL: Client Status Summary

Generate a client-facing project status.

It must exclude internal information.

---

## SKILL: Client Update

Draft a clear client message about:

* schedule;
* documents;
* delivery;
* next steps.

---

## SKILL: Client Onboarding

Explain:

```text
What happens next
What the client needs to provide
Important dates
Who to contact
```

---

## SKILL: Feedback Request

Prepare a post-delivery feedback request.

---

# 22. Organization Skills

## SKILL: Agency Overview

Summarize operational state across projects.

Example:

```text
Today:

8 active projects

2 conflicts
1 missing contractor
3 payments due
1 weather risk
```

---

## SKILL: Workload Analysis

Identify overloaded participants or teams.

---

## SKILL: Availability Analysis

Find availability conflicts.

---

## SKILL: Contractor Matching

Suggest suitable available contractors.

The Skill must respect:

```text
Availability
Role
Location
Permissions
Organization
Existing assignments
```

---

# 23. Analytics Skills

## SKILL: Project Retrospective

After an event, summarize:

```text
What went well
What changed
What caused delays
What remained unresolved
```

---

## SKILL: Timeline Accuracy

Compare:

```text
Planned
Actual
```

and identify patterns.

---

## SKILL: Operational Bottleneck

Identify repeated problems across projects.

---

## SKILL: Contractor Reliability

Analyze project history where sufficient data exists.

The Skill must avoid unsupported judgments from insufficient samples.

---

# 24. Administration Skills

## SKILL: Permission Explanation

Explain why a user can or cannot access something.

---

## SKILL: Access Review

Identify temporary users whose access should expire.

---

## SKILL: Organization Cleanup

Identify:

* inactive users;
* obsolete projects;
* expired access;
* duplicate records.

Any destructive action requires confirmation.

---

# 25. Skill Execution Model

A Skill should follow this pattern:

```text
REQUEST
   ↓
IDENTIFY USER
   ↓
CHECK PERMISSIONS
   ↓
BUILD CONTEXT
   ↓
RETRIEVE DATA
   ↓
EXECUTE SKILL
   ↓
VALIDATE RESULT
   ↓
RETURN OUTPUT
   ↓
OPTIONAL ACTION
```

---

# 26. Read Skills

Read-only Skills may generally execute without confirmation.

Examples:

```text
Project Overview
What Changed
What Matters Now
Timeline Summary
Weather Summary
Postproduction Status
Financial Summary
```

They must still respect permissions.

---

# 27. Proposal Skills

Proposal Skills generate possible actions.

Examples:

```text
Generate Timeline
Suggest Alternative
Prepare Message
Recommend Schedule Change
Mitigation Proposal
```

They do not modify authoritative project state.

---

# 28. Write Skills

Write Skills modify project state.

Examples:

```text
Create Event
Update Event
Assign Person
Change Time
Create Task
Update Status
```

Important writes require explicit confirmation.

---

# 29. Communication Writes

Sending a message is a write operation.

Default behavior:

```text
AI drafts
 ↓
User reviews
 ↓
User sends
```

Automatic sending may be introduced later for explicitly configured low-risk automations.

---

# 30. Destructive Skills

Destructive operations require explicit confirmation.

Examples:

```text
Delete Event
Remove Participant
Cancel Assignment
Delete Document
Revoke Access
```

AI must never perform destructive actions merely because they appear logical.

---

# 31. Skill Safety Levels

```text
L0 — Informational
L1 — Suggestion
L2 — Draft
L3 — Confirmed Write
L4 — Automated Low-Risk Action
L5 — Restricted / Human Only
```

Recommended initial implementation:

```text
L0
L1
L2
L3
```

---

# 32. Skill Output Contract

Every Skill should conceptually return:

```text
{
  result,
  type,
  confidence,
  sources,
  affected_objects,
  proposed_actions,
  requires_confirmation
}
```

The implementation may differ, but the semantic model should remain.

---

# 33. Facts vs Inference

Skills must distinguish:

### Fact

```text
Ceremony is scheduled for 13:30.
```

### Inference

```text
The photographer may need to adjust the transfer.
```

### Recommendation

```text
Consider leaving 10 minutes earlier.
```

### Unknown

```text
The rain plan has not been confirmed.
```

---

# 34. Skill Provenance

Where possible, Skills should identify the source of important claims.

Example:

```text
Ceremony:
13:30

Source:
Confirmed timeline
```

or:

```text
Rain risk:
High

Source:
Weather forecast
```

---

# 35. Skill Memory

Skills must not maintain hidden project facts.

Persistent information belongs in:

```text
Project Graph
```

Temporary reasoning belongs in:

```text
AI Context
```

---

# 36. Skill Composability

Skills should be composable.

Example:

```text
"What should I tell the photographer?"

        ↓

What Changed
        ↓
Impact Analysis
        ↓
Prepare Change Briefing
        ↓
Draft Message
```

Another example:

```text
"Can we move the portraits?"

        ↓

Timeline Validation
        ↓
Weather Impact
        ↓
Travel Feasibility
        ↓
Conflict Detection
        ↓
Alternative Generation
```

---

# 37. Skill Chaining

The AI agent may chain Skills when necessary.

The chain should remain bounded and explainable.

Avoid:

```text
AI → AI → AI → AI → ...
```

Prefer:

```text
Context
 ↓
Skill
 ↓
Validation
 ↓
Action
```

---

# 38. Skill Failure

If a Skill cannot produce a reliable result, it should fail explicitly.

Examples:

```text
Insufficient information.

Permission denied.

Conflicting sources.

Data is outdated.

External service unavailable.
```

Never replace missing information with fabricated information.

---

# 39. Skill and External Data

Some Skills may require external information:

```text
Weather
Maps
Astronomy
Travel time
```

External data must be clearly distinguished from project data.

---

# 40. Skill Freshness

Time-sensitive Skills should verify freshness.

Especially:

```text
Weather
Traffic
Travel time
Availability
Current event status
```

---

# 41. Skill Localization

Skills should support:

* language;
* local date formats;
* local time zones;
* local currency;
* local units.

The project should store canonical values.

Presentation may be localized.

---

# 42. Skill for One-Day Users

Skills must be especially useful for temporary participants.

A one-day user should be able to ask:

```text
"What do I need to know?"

"Where do I go?"

"Who do I contact?"

"What changed?"

"What happens next?"
```

without learning the entire system.

---

# 43. Skill for Organizers

Organizer Skills may have broader context.

Examples:

```text
Project Overview
Agency Overview
Conflict Detection
Impact Analysis
Missing Information
Workload Analysis
Financial Summary
Client Follow-Up
```

The organizer can operate across many projects.

---

# 44. Skill for Photographers

Example Skills:

```text
Daily Briefing
Light Analysis
Weather Impact
Route Context
Timeline Explanation
Client Briefing
Postproduction Status
Delivery Readiness
Client Follow-Up
```

The system should support the photographer's long lifecycle:

```text
Preparation
 ↓
Event
 ↓
Transfer
 ↓
Postproduction
 ↓
Delivery
 ↓
Client relationship
```

---

# 45. Skill for Retouchers

Useful Skills:

```text
Job Brief
Missing Information
Job Status
Deadline
Client Requirements
Completion Summary
```

The retoucher should not need access to the whole wedding project.

---

# 46. Skill for Drivers

Useful Skills:

```text
Current Assignment
Pickup
Destination
Route Context
Schedule Change
Passenger Information
Next Assignment
```

A driver should not need to know the entire event plan.

---

# 47. Skill for Venue

Useful Skills:

```text
Arrival Schedule
Setup Requirements
Technical Requirements
Guest Flow
Vendor Schedule
Changes
```

---

# 48. Skill for Technical Crew

Useful Skills:

```text
Equipment Requirements
Setup Time
Location
Power Requirements
Sound Requirements
Lighting Requirements
Schedule Changes
```

---

# 49. Skill for Client

Client-facing Skills must be heavily restricted.

Examples:

```text
Project Status
Next Step
Schedule
Documents
Delivery
Questions
```

Client AI must never expose internal operational context.

---

# 50. AI Skill Registry

The system should maintain a registry of available Skills.

Conceptually:

```text
Skill
├── name
├── description
├── required_context
├── allowed_roles
├── required_permissions
├── tools
├── output_type
├── risk_level
└── confirmation_policy
```

---

# 51. Skill Discovery

An AI agent should select Skills based on the user's intent.

Example:

```text
User:
"Why is the photographer going to the old venue?"
```

Possible chain:

```text
Navigator Explanation
        ↓
Recent Changes
        ↓
Timeline
        ↓
Location History
```

---

# 52. Skill Selection Rule

Choose the smallest Skill or Skill chain that can reliably answer the request.

Do not invoke unnecessary capabilities.

---

# 53. Skill Priority

When several Skills could answer a request:

1. use structured project state;
2. use deterministic system functions;
3. use specialized Skills;
4. use general reasoning last.

---

# 54. Deterministic First

If the answer can be obtained directly from structured data, do not ask an LLM to guess it.

Example:

```text
Question:
"When is the ceremony?"

Correct:
Read Event.start_time.

Incorrect:
Ask AI to infer it from several documents.
```

---

# 55. AI for Ambiguity

AI is especially useful when information is:

* natural language;
* distributed across messages;
* contained in documents;
* ambiguous;
* incomplete;
* relational.

---

# 56. Skill Testing

Every Skill should have tests for:

### Normal case

Expected information exists.

### Missing data

Required information is absent.

### Conflicting data

Two sources disagree.

### Permission boundary

User cannot access required information.

### Stale data

Information may be outdated.

### Adversarial input

User attempts to obtain unauthorized information.

---

# 57. Skill Evaluation

Evaluate Skills using:

```text
Accuracy
Relevance
Context correctness
Permission correctness
Action correctness
False-positive rate
False-negative rate
Latency
```

---

# 58. Skill Quality Rule

A Skill that produces a confident wrong answer is worse than a Skill that says:

```text
"I don't have enough information."
```

---

# 59. Initial Skill Set

The first AI implementation should not contain every Skill in this document.

Recommended initial set:

```text
Project Overview
What Changed
What Matters Now
Middle of the Movie
Role Briefing
Timeline Explanation
Conflict Detection
Impact Analysis
Prepare Change Briefing
Draft Message
Chat Summary
Document Summary
Weather Impact
Pre-Event Briefing
Postproduction Status
```

These Skills validate the central AI hypothesis.

---

# 60. Second-Wave Skills

After the core system is stable:

```text
Timeline Generation
Timeline Validation
Missing Information
Risk Detection
Risk Prioritization
Meeting Summary
Document Extraction
Client Update
Delivery Readiness
Workload Analysis
```

---

# 61. Later Skills

Only after sufficient project data exists:

```text
Contractor Matching
Operational Analytics
Timeline Accuracy
Contractor Reliability
Cross-Project Analysis
Predictive Risk
Automated Follow-Up
```

---

# 62. AI Skill North Star

The purpose of Skills is not to create an impressive chatbot.

The purpose is to make the operational system easier to understand and operate.

```text
Complex Project
      ↓
Structured Graph
      ↓
Context
      ↓
Relevant Skill
      ↓
Clear Understanding
      ↓
Correct Action
```

---

# 63. Final Rule

> **The AI agent should never make the user understand the whole system.**

The system already contains:

```text
People
Events
Timeline
Locations
Documents
Communication
Jobs
Finance
Changes
Relationships
```

Skills transform this complexity into the smallest useful piece of information for the person who needs it now.

```text
The system knows everything it is allowed to know.

The user sees what matters.

The AI helps bridge the two.
```
