---
title: "Process Instances Data Table & SLA Indicators"
product: "client"
module: "processes"
channel: "list"
route: "/deals"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | PROCESSES |
| Channel | LIST |
| Route | `/deals` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The List view of the Process page. A table of process records for one process, with a clickable stage bar, an Alert count of missing required fields, a filter modal and bulk call actions. A row opens a detail drawer. |
| **Who uses it** | Care Coordinator (moves stages, fills missing fields). Practice Manager (watches progress). No role is checked: any signed-in user can do everything. |
| **Where you start it** | **Process** in the sidebar (`/deals`), then the **List** toggle. The Workflows gear menu opens it for one named process (`/deals?process=<name>`). |
| **Where the result goes** | The process record, the client's stage and process list, the client timeline, an audit entry, Workflows automations, the Companion status stepper and the Call Logs row. |
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
| Companion | Patient workflow stage stepper | A stage move on the List updates the process record. The patient status screen re-reads it and shows the new stage. | [View Companion Today](/companion/today) |
| Client (Workflows) | Stage automations and process setup | Each move emits stage events and the rule engine runs matching automations. The gear menu opens the process in Workflows. A move from the drawer ribbon is logged twice, so automations run twice. | [View Workflows](/client/workflows) |
| Client (Clients) | Client stage and profile | A move overwrites the client's single stage and adds the process to the client's list. The client name opens the profile. | [View Clients](/client/clients) |
| Client (Call Logs) | Scheduled calls and call rows | Process records and Call Log rows share one store. Bulk **Trigger Calls** from this table shows a toast and creates no call. | [View Call Logs](/client/call-logs) |
| Client (Web Forms) | Form-created client | Not connected. A form that places a client in a process writes a text label only, so no row appears here. | [View Web Forms](/client/web-forms) |
| Client (Process Kanban) | Other view of the page | The Kanban reads a different, separately seeded deals list. | [View Process Kanban](/client/processes/kanban) |

## 1. Module Summary

### The story in one minute

Priya Nair opens **Process** and the table of Client Intake records appears. Each row shows a process ID, a title, a stage bar, the client, a created date, the last activity, the responsible person and an alert number. Sarah Johnson's row has an Alert of 2. Priya clicks a stage on the bar. A **Required Fields Needed** modal asks for two values. She fills them and presses **Save & Move Stage**. A toast says "Stage moved to ... ✓". The row's Created date now shows the time of the move. She clicks the process ID and a detail drawer opens. She searches for another client by name. She tries the filter and nothing changes.

### What is real and what is not

- **Real in the prototype:** the table for one process, search by client name, the stage bar with its required-field gate, the Alert count, the detail drawer opening, automation events and the Companion stepper.
- **Simulated:** the filter modal and its saved presets (they apply nothing), bulk Trigger Calls (a toast only), the Created date (overwritten on every move), the required-field check (a hardcoded phone and email can satisfy it) and the record set (different from the Kanban).
- **Not built:** sortable columns, Days in Stage, Deal Value and Process Name columns, the SLA badge, the responsible filter with Unassigned, bulk reassignment, and row Edit and Delete.

**Naming note:** the sidebar says "Process", the badge says "Pipeline", the empty message says "deals or processes" and the route is `/deals`. The earlier PRD said "Process Instances" and "Instances List". Decision needed: D-01.

### Journey position

```
Stage bar click ─▶ Required fields ─▶ Process record + client stage ─┬▶ Workflows automations
                                                                      ├▶ Companion status stepper
                                                                      └▶ Detail drawer (History)
```

## 2. Feature Requests

### F-1: Process records table

#### 1. What it does
Priya opens `/deals` on the **List** toggle. The page shows exactly one process at a time, chosen from the switcher or from the Workflows gear menu. The table lists that process's records. Columns are **Process ID** (shown as `PRC-…`), **Title** (`<client>_Process_<date>`), **Stage**, **Client**, **Created**, **Activity**, **Responsible** and **Alert**. Search matches the client name. Clicking a row or a process ID opens a detail drawer.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Records table | Table | Process ID, Title, Stage bar, Client (opens the profile), Created, Activity, Responsible, Alert | ● Works | Activity reads "Last contact – date · stage", or "Scheduled call · Follow up needed" in red when pending |
| F-1.2: Created column | Date | Shows the record's date | ◐ Simulated | A stage move overwrites it with the time of the move (G5-E-10) |
| F-1.3: Responsible column | Display | The client record's owner, else "Unassigned" | ● Works | Two processes for one client share one owner. Decision needed: D-104 |
| F-1.4: Search | Search box | Matches client name | ● Works | Name only |
| F-1.5: One process at a time | Rule | Process switcher, remembered for the session. Fixed-process mode hides the switcher | ● Works | No All processes list. Decision needed: D-100 |
| F-1.6: Record set | Data | The table reads process records | ◐ Simulated | The Kanban reads a different seeded list, so the two views disagree (G5-E-01). Decision needed: D-100 |
| F-1.7: Detail drawer | Drawer | A row or process ID opens a detail drawer | ● Works | The drawer is described on its own page |
| F-1.8: Empty state | State | "No deals or processes found matching your filters." | ● Works | |
| F-1.9: Loading and error states | State | None exist | ○ Not built | All data is browser-local |
| F-1.10: Client filter banner | Banner | A "Showing deals for <client>" banner is coded | ○ Not built | No screen sends a client to it (G5-E-31) |
| F-1.11: Sortable columns | Table | Described in the earlier PRD | ○ Not built | The table has no sorting |
| F-1.12: Process Name, Days in Stage and Deal Value columns | Table | Described in the earlier PRD | ○ Not built | Decision needed: D-100, D-101, D-102 |
| F-1.13: SLA timer and red SLA Overdue badge | Badge | Described in the earlier PRD | ○ Not built | Stages have no SLA setting. Decision needed: D-102 |

#### 3. Worked example
Priya looks for one client.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Client Intake is selected | Types **Sarah** in search | **Only Sarah Johnson's record remains** |
| 2 | She wants the overdue ones | Looks for a Days in Stage column | **There is none. No SLA badge appears on any row** |
| 3 | She opens a record | Clicks **PRC-…** | **The detail drawer opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When working my caseload, I want a table of every record in a process with its stage and owner, so that I can find the one that needs me. |
| F-1-J2 | Practice Manager | When monitoring care protocol compliance, I want to spot records stuck in a stage, so that patients are not left waiting. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a process is selected, **then** the table lists only that process's records. |
| F-1-2 | **Given** text in the search box, **then** rows are narrowed by client name only. |
| F-1-3 | **Given** a record that has stayed in a stage for any time, **then** no SLA warning is shown. |
| F-1-4 | **Given** no record matches, **then** the empty message is shown. |

### F-2: Move a record to another stage

#### 1. What it does
Priya clicks a stage on a row's segmented bar. If the target stage has required fields that are empty, a **Required Fields Needed** modal lists them. She fills each one and presses **Save & Move Stage**. **Cancel** leaves the stage unchanged. The **Alert** number on each row counts the required fields that are still empty, and clicking it opens the same modal.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Stage bar | Control | Click a stage to move the record to it, in any direction | ● Works | Decision needed: D-103 |
| F-2.2: Required-field gate | Modal | Blocks the move until every required field has a value | ◐ Simulated | A hardcoded phone and email fill in for any client without one and can satisfy the check (G5-E-11) |
| F-2.3: Alert column | Count | Number of required fields empty for the current stage. Click to fill | ● Works | |
| F-2.4: What a move writes | Rule | Saves the stage on the record, sets the client's single stage, adds the process to the client's list, adds a client timeline entry and an audit entry | ◐ Simulated | Every Kanban deal for the same client name is rewritten to this process and stage (G5-E-02) |
| F-2.5: Stage events and automations | Event | Emits stage entered, stage exited and type-specific events. The rule engine runs matching automations | ● Works | What runs belongs to Workflows |
| F-2.6: Move from the drawer ribbon | Hand-off | The detail drawer has its own stage ribbon with the same gate | ◐ Simulated | The move is logged twice, once by the drawer and once by the page, so automations run twice and History shows duplicates (G5-E-13) |
| F-2.7: Toast | Message | "Stage moved to <stage> ✓" | ● Works | |
| F-2.8: Companion stepper | Hand-off | The patient status screen re-reads the record | ● Works | Detail belongs to the Companion pages |
| F-2.9: Cross-process hand-off | Action | The drawer computes the next process, but no control triggers it | ○ Not built | (G5-E-14). Decision needed: D-100 |

#### 3. Worked example
Priya advances Sarah's record.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Alert shows 2 for Sarah | Clicks the next stage on the bar | **The modal lists two required fields** |
| 2 | She fills them | Presses **Save & Move Stage** | **"Stage moved to ... ✓" shows. The Created column now shows the time of the move** |
| 3 | The drawer is open on the same record | Clicks a stage on the ribbon | **The stage changes and the move is logged twice. Automations run twice** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When a patient completes a step, I want to move the record and capture the fields the next stage needs, so that the next team has what it needs. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a stage with empty required fields, **when** the user clicks it on the bar, **then** the modal lists them and the stage does not change until they are filled. |
| F-2-2 | **Given** a completed move, **then** the record, the client's stage, the client timeline and the audit log are updated. |
| F-2-3 | **Given** a move, **then** the record's Created date shows the time of the move. |
| F-2-4 | **Given** a move from the drawer ribbon, **then** it is logged twice and matching automations run twice. |

### F-3: Filter, row actions and bulk calls

#### 1. What it does
Above the table sits a filter button. Priya opens it and sees saved presets and many fields. She presses **Search** and the modal closes with no change. Each row has a menu: **View**, **Edit** and **Delete**. After she selects rows, **Trigger Calls** and **Cancel Scheduled Calls** appear.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Filter modal | Modal | Name, Responsible person, Stage group, Created on and optional fields such as Call type, Status, Duration, Phone and Email, with Add field, Restore default and Reset | ◐ Simulated | Search only closes the modal. No filter is applied (G5-E-06) |
| F-3.2: Saved presets | Buttons | Process in progress, Test process, Closed process, MC EAP, Save filter | ◐ Simulated | Static buttons with no action (G5-E-07) |
| F-3.3: View | Row action | Opens the detail drawer | ● Works | |
| F-3.4: Edit | Row action | Shows an "Edit coming soon" toast | ○ Not built | (G5-E-08). Decision needed: D-104 |
| F-3.5: Delete | Row action | Shows a "Delete coming soon" error toast | ○ Not built | (G5-E-08). Decision needed: D-104 |
| F-3.6: Trigger Calls | Bulk action | Choose immediate or scheduled with a date and time, then confirm | ◐ Simulated | Shows "N calls triggered successfully" and creates no call (G5-E-09). Decision needed: D-104 |
| F-3.7: Cancel Scheduled Calls | Bulk action | Shown only if a selected row has a scheduled call. Clears that flag after confirmation | ◐ Simulated | Whether the change is saved was not re-checked (unverified) |
| F-3.8: Responsible filter with Unassigned, bulk reassignment | Filter, action | Described in the earlier PRD | ○ Not built | Decision needed: D-104 |
| F-3.9: Import, Export, quick-add deal | Action | Handlers exist in code | ○ Not built | No control reaches them (G5-E-15) |

#### 3. Worked example
Priya tries to find her own records.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She wants only her records | Opens the filter, chooses herself and presses **Search** | **The modal closes and every row is still listed** |
| 2 | She selects three rows | Presses **Trigger Calls**, chooses Start Immediately and confirms | **A success toast shows and no call is created** |
| 3 | She wants to remove a test row | Chooses **Delete** | **An error toast says "Delete coming soon"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator | When my caseload is long, I want to filter by responsible person and reassign records in bulk, so that no record is left unowned. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the filter modal, **when** Search is pressed, **then** the modal closes and no filter is applied. |
| F-3-2 | **Given** selected rows, **when** Trigger Calls is confirmed, **then** a toast shows and no call is created. |
| F-3-3 | **Given** a row, **when** Edit or Delete is chosen, **then** a "coming soon" toast shows. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Process records table | F-1.1 – F-1.13 | ● / ◐ / ○ | Table and search work; no sorting, SLA or value columns. |
| F-2 | Move a record to another stage | F-2.1 – F-2.9 | ● / ◐ / ○ | Stage bar and gate work; drawer moves are logged twice. |
| F-3 | Filter, row actions and bulk calls | F-3.1 – F-3.9 | ◐ / ○ / ● | Filter applies nothing; Edit, Delete and bulk calls are placeholders. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | Find the record that needs me in a table | F-1 |
| 2 | Practice Manager | Spot records stuck in a stage | F-1 |
| 3 | Care Coordinator | Move a record and capture the next stage's fields | F-2 |
| 4 | Care Coordinator | Filter by responsible person and reassign in bulk | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Switch process, search, move any record to any stage, open the drawer, trigger calls (toast only) | Moving into a stage with empty required fields |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named a Clinic Supervisor and said nothing about access. Decision needed: D-104 for which row and bulk actions are in scope.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Alert | Alert column | Number of fields required for the current stage that are empty |
| Total records (pagination) | Not used by the visible table | **Hardcoded, formula undefined** (5380) |
| SLA timer, Days in Stage | Not built | **Hardcoded, formula undefined**. Decision needed: D-102 |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Web form → Client → Process → Task | Client placed in a process by the form | Text label only. No process record, so no row on the List. |
| | Widget bot moves a visitor to a stage | A process record is created if none exists. It appears on the List only, not on the Kanban. |
| | Process to Task | Not connected. No automation creates a task. |
| Kiosk check-in → Appointment → Billing | Walk-in approval | The client enters the default onboarding process and a Call Log row is written. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical: Process, Workflows, Deals or Pipeline? | Naming note |
| D-100 | Do Kanban and List share one record set, should there be an All processes list with a Process Name column, and should the drawer get its own page? | F-1.5, F-1.6, F-1.12, F-2.9 |
| D-101 | Does a process record carry a monetary value? | F-1.12 |
| D-102 | What starts the days-in-stage clock and is the SLA set per stage? | F-1.12, F-1.13 |
| D-103 | Can a record move to any stage or only adjacent ones? | F-2.1 |
| D-104 | Is Responsible per record or per client, and which row and bulk actions are in scope? | F-1.3, F-3.4, F-3.5, F-3.6, F-3.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
