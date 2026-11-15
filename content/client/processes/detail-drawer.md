---
title: "Process: Record Detail Drawer"
product: "client"
module: "processes"
channel: "detail-drawer"
route: "/deals"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | PROCESSES |
| Route | `/deals` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A right-side drawer for one process record. It has a stage ribbon, three tabs (Overview, History, Documents), inline field edits and an activity feed. |
| **Who uses it** | Care Coordinator (moves the record and updates fields). Physician (reads it). No role is checked: any signed-in user can open it and move any record. |
| **Where you start it** | A row or the Process ID on the Process List at `/deals`. |
| **Where the result goes** | The process record, the client's stage, the process log, Workflows automations (through stage events) and the Companion status stepper. |
| **How real is it** | 0 features work, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Process List) | Opening point | The drawer opens from a List row or Process ID. A stage move shows on the List. | [View Process List](/client/processes/list) |
| Client (Process Kanban) | Stage rewrite | A stage move from the drawer rewrites the stage of every Kanban deal that has the same client name (G5-E-02). | [View Process Kanban](/client/processes/kanban) |
| Client (Workflows) | Stage automations | Each logged stage move emits stage events that automations listen to. The drawer logs the move twice, so they run twice (G5-E-13). | [View Workflows](/client/workflows) |
| Client (Chats) | Activity drill-through | A WhatsApp, SMS or email activity item opens the chat with the client and channel. | [View Chat](/client/chat/chat) |
| Client (Appointments) | Activity drill-through | An appointment activity item opens `/appointments`. | [View Appointments](/client/appointments/list) |
| Client (Call Logs) | Activity drill-through | A call activity item opens the call detail drawer. | [View Call Logs](/client/call-logs) |
| Client (Scribe) | Prefill fields | AI Scribe can pre-fill process fields from the drawer. | [View Scribe](/client/scribe) |
| Companion | Status stepper | The patient's status screen re-reads process records when they change, so a stage move shows there. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Priya Nair is a Care Coordinator. She opens **Process** and finds Sarah Johnson's record in the List. She clicks the Process ID and a drawer opens with the record title and a row of stage chevrons. The Overview tab shows Sarah's fields. Priya edits one inline and sees a "Saved" toast. She clicks the next stage on the ribbon. A required-fields window asks for two missing values. She fills them and confirms. The record moves. The History tab now lists the move, and it lists it twice. The Activity feed on Overview shows what Sarah has done, and for a record with no real activity it shows seven entries that never happened. Priya clicks a WhatsApp entry and lands in Sarah's chat.

**Naming note:** the sidebar and page say "Process". The route is `/deals`, the page badge says "Pipeline" and some toasts say "Deal". Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** opening the drawer, the stage ribbon with its required-field gate, the three tabs, inline field edits saved to the record, and the activity drill-through links.
- **Simulated:** the stage move is logged twice, the activity feed invents seven entries when empty, and the move also rewrites matching Kanban deals.
- **Not built:** triggering the configured next-process hand-off, and roles.

### Journey position

```
Process List ─▶ Detail drawer ─▶ Stage ribbon ─▶ Required fields ─┬▶ Process record and client stage
                                                                   ├▶ Workflows automations (twice)
                                                                   └▶ Companion status stepper
```

## 2. Feature Requests

### F-1: Open the record and edit its fields

#### 1. What it does
Priya clicks a List row or its Process ID. The drawer opens. The header shows the record title and its `#ID`. **Overview** has a two-column field view. She can edit a field inline, add a field or pick one from the list. She can add an activity or note. **Documents** shows the record's documents with a count. AI Scribe can pre-fill process fields.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Open from List | Navigation | Opens from a row or the Process ID. The header shows the title and `#ID` | ● Works | |
| F-1.2: Overview fields | Fields | Two-column field view with inline edit. Add or select fields | ● Works | |
| F-1.3: Inline save | Action | An edit is saved to the process record and a "Saved" toast shows | ● Works | |
| F-1.4: Add activity or note | Action | Adds an entry from Overview | ● Works | |
| F-1.5: Documents tab | Tab | Documents with a count | ● Works | |
| F-1.6: AI Scribe prefill | Action | Scribe can pre-fill process fields | ● Works | |
| F-1.7: Role control | Rule | Any signed-in user can open and edit any record | ○ Not built | Decision needed: D-14 |

#### 3. Worked example
Priya updates a field.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer is open on **Overview** | Edits a field and leaves it | **The value is saved to the record and a "Saved" toast shows** |
| 2 | She wants to add a note | Adds a note | **The note appears in the feed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When I work on a client's process, I want to see and update every field in one place, so that the record stays current. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a List row, **when** the user clicks the row or the Process ID, **then** the drawer opens with the title and `#ID`. |
| F-1-2 | **Given** an inline edit, **then** the value is saved to the process record and a toast shows. |
| F-1-3 | **Given** any signed-in user, **then** the drawer opens and edits with no role check. |

### F-2: Move the record through its stages

#### 1. What it does
Priya clicks a stage on the chevron ribbon. A required-fields window opens first if the new stage needs values. She fills them and confirms. The drawer logs the move and the activity, then hands the move to the page. The page logs it again. Workflows automations run on each log. The move also rewrites the stage of every Kanban deal for the same client name.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Stage ribbon | Chevrons | Shows the process stages. Click a stage to move the record | ◐ Simulated | Any stage can be picked. Decision needed: D-103 |
| F-2.2: Required-field gate | Modal | Runs before the move. Asks for the fields the stage needs | ◐ Simulated | A client with no phone or email is prefilled with a hardcoded phone and email that satisfy the check (G5-E-11) |
| F-2.3: Stage-move log | Log | The drawer logs the move and an activity entry | ◐ Simulated | The page logs the move a second time. History shows duplicates and automations run twice (G5-E-13) |
| F-2.4: Client and Kanban update | Rule | The move updates the client record and the process list | ◐ Simulated | Rewrites every Kanban deal with the same client name, including other processes (G5-E-02). Overwrites the record date with the current time (G5-E-10) |
| F-2.5: Companion status | Hand-off | The Companion status screen re-reads process records on change | ● Works | |
| F-2.6: Next-process hand-off | Action | The next-process transition is computed but no control triggers it | ○ Not built | (G5-E-14). Decision needed: D-100 |

#### 3. Worked example
Priya moves Sarah's record to the next stage.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Next stage needs two fields | Clicks the stage | **The required-fields window opens** |
| 2 | She fills them | Confirms | **The record moves. History lists the move twice and automations run twice** |
| 3 | Sarah opens Companion | Opens her status screen | **The stepper shows the new stage** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When a client reaches the next step, I want to move the record and capture what that stage needs, so that automations start once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a stage click, **when** the stage has required fields, **then** the required-fields window opens before the move. |
| F-2-2 | **Given** a stage move from the drawer, **then** two stage-move logs are written and stage events are emitted twice. |
| F-2-3 | **Given** a stage move, **then** every Kanban deal with the same client name takes the new process and stage. |
| F-2-4 | **Given** a next-process transition exists, **then** nothing in the drawer triggers it. |

### F-3: History and activity

#### 1. What it does
**History** shows the stage and field timeline with filters. The Overview activity feed shows real activity for the client and process. Priya clicks an item to go to its source. If the record has no real activity, the feed fills itself with seven made-up entries.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: History tab | Timeline | Stage and field timeline with filters | ◐ Simulated | Stage moves from the ribbon appear twice (G5-E-13) |
| F-3.2: Activity feed | Timeline | Real activity for the client and process | ◐ Simulated | With none, it shows seven invented entries: WhatsApp, call, email, appointment and process completed (G5-E-12) |
| F-3.3: Drill-through | Links | Call opens the call detail. WhatsApp, SMS or email opens `/chats` with client and channel. Appointment opens `/appointments`. Stage entries open the History tab | ● Works | |
| F-3.4: Empty state | State | No empty message exists for an empty feed | ○ Not built | Invented entries appear instead (G5-E-12) |

#### 3. Worked example
Priya checks a new record.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Record has no real activity | Opens **Overview** | **Seven invented entries are listed as if real** |
| 2 | She clicks a WhatsApp entry | Clicks it | **The chat opens for the client on WhatsApp** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator | When I pick up a client, I want the real history of contacts and stage moves, so that I know what happened before. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a record with no activity, **when** Overview opens, **then** seven invented entries are shown. |
| F-3-2 | **Given** a WhatsApp, SMS or email entry, **when** it is clicked, **then** `/chats` opens for that client and channel. |
| F-3-3 | **Given** a stage entry, **when** it is clicked, **then** the History tab opens. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Open and edit | F-1.1 – F-1.7 | ● / ○ | Opens and saves inline edits; no role check. |
| F-2 | Move stages | F-2.1 – F-2.6 | ◐ / ● / ○ | Gate works; move is logged twice; hand-off not reachable. |
| F-3 | History and activity | F-3.1 – F-3.4 | ◐ / ● / ○ | Drill-through works; invented entries when empty. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | See and update every field in one place | F-1 |
| 2 | Care Coordinator | Move the record and capture what the stage needs | F-2 |
| 3 | Care Coordinator | See the real history of contacts and moves | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open any record, edit fields, move any record to any stage | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

No earlier PRD covers the drawer. The Process PRDs name Practice Manager and Care Coordinator as users and say nothing about access. Decision needed: D-14.

## 5. Metrics and definitions

The drawer shows no metric. The List behind it shows a missing-required-fields count in its Alert column, described on the Process List page.

## 6. Cross-module journeys this module appears in

This drawer is not a step in the four journeys. A web form that places a client in a process does not create the record this drawer opens (XM-05).

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical: Process, Workflows, Deals or Pipeline? | Naming note |
| D-14 | Which roles may open, edit and move process records? | F-1.7 |
| D-103 | Can a record move to any stage or only adjacent ones, and are final stages locked? | F-2.1 |
| D-100 | Should the drawer get its own PRD and can staff trigger the next-process hand-off? | F-2.6 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
