---
title: "Clinical Process Pipeline Kanban Board"
product: "client"
module: "processes"
channel: "kanban"
route: "/deals"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | PROCESSES |
| Channel | KANBAN |
| Route | `/deals` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The Kanban view of the Process page. One process at a time is shown as stage columns with a card for each client. Dragging a card moves it to another stage. |
| **Who uses it** | Care Coordinator (moves cards, works the caseload). Practice Manager (reads the board). No role is checked: any signed-in user can move and delete cards. |
| **Where you start it** | **Process** in the sidebar (`/deals`), then the **Kanban** toggle. The Workflows gear menu opens it for one named process (`/deals?process=<name>`). |
| **Where the result goes** | The client's stage and process list, the process record, the client timeline, an audit entry for each move, Workflows automations and the Companion status stepper. |
| **How real is it** | 0 features work, 3 are partly simulated, 1 is not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient workflow stage stepper | When staff move a card, the patient's status screen in the portal re-reads the process records and shows the new stage. | [View Companion Today](/companion/today) |
| Client (Workflows) | Stage automations | Every move emits stage entered, stage exited and type-specific events. The rule engine runs any matching automation. Stages and colours come from the Workflows process. The gear menu opens the process in Workflows. | [View Workflows](/client/workflows) |
| Client (Clients) | Client stage and process list | A move overwrites the client's single current stage and adds the process to the client's process list. The client name on a card opens the profile. | [View Clients](/client/clients) |
| Client (Call Logs) | Call Log row | Process records and Call Log rows share one store. A stage move updates the client's row in Call Logs. | [View Call Logs](/client/call-logs) |
| AI Receptionist (kiosk) | Walk-in deal | A walk-in approval creates a deal in the default onboarding process. The amount is a fixed 150 whatever the service, and the deal is matched by client name. | [View Kiosk Walk-in](/ai-receptionist/checkin/walk-in) |
| Client (Web Forms) | Form-created client | Not connected. A client placed in a process by a web form is a text label only. No deal and no process record is written, so the card never appears. | [View Web Forms](/client/web-forms) |

## 1. Module Summary

### The story in one minute

Priya Nair opens **Process** and switches to **Kanban**. The page shows "Process" with a **Pipeline** badge. She picks Client Intake from the switcher. Columns run left to right, each with a stage name, a card count and the process name. Sarah Johnson's card sits under Insurance Verification. Priya has checked the insurance, so she drags the card to the next column. A modal asks for two required fields. She fills them and presses **Save & Move Stage**. A toast says "Deal moved to ... ✓". Sarah's portal now shows the new stage. A workflow automation sends her a message. Priya notices that a process created yesterday in Workflows shows empty columns.

**Naming note:** the sidebar says "Process", the page badge says "Pipeline", the toasts say "Deal moved" and "Deal deleted", the route is `/deals`, and "Workflows" is a different screen at `/process`. The earlier PRD said "Process & Deals" and "deal cards". Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the process switcher, fixed-process mode, stage columns from Workflows with card counts, dragging a card to any column, the required-field gate, the stage move written to the client and the process record, automation events, and the Companion stepper.
- **Simulated:** the cards come from a separately seeded deals list, not from the List's records. Each move rewrites every deal for the same client name. The Activity line always reads "No activities". Card Delete has no confirmation. The required-field check can be satisfied by a hardcoded phone and email.
- **Not built:** days in stage, avatar and deal value on the card, the column revenue total, the weighted forecast, Edit and Call on the card, and a notice to the physician on a move.

### Journey position

```
Stage move (drag) ─▶ Required fields ─▶ Client stage + record ─┬▶ Workflows automations
                                                                ├▶ Companion status stepper
                                                                └▶ Call Log row
```

## 2. Feature Requests

### F-1: Process board and stage columns

#### 1. What it does
Priya opens `/deals` and chooses the **Kanban** toggle. The switcher lists every client process plus two built-in ones, Client Intake and Client Reactivation. Her last choice is remembered for the browser session. When she arrives from the Workflows gear menu, the switcher is replaced by a process badge and the title becomes the process name. Columns come from the process's stages in Workflows. Each card shows the client name, the process name, a status pill (In Progress, Won or Lost), the created date, an Activity line and the responsible person's first name.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Process switcher | Dropdown | Lists client processes and the two defaults. Filters the board. The choice is remembered for the session | ● Works | One process at a time. There is no All processes option (G5-Q-05) |
| F-1.2: Fixed-process mode | Mode | `/deals?process=<name>` hides the switcher, shows a process badge and uses the process name as the title | ● Works | |
| F-1.3: Gear menu | Menu | Opens the process configuration in Workflows | ● Works | |
| F-1.4: Stage columns | Board | Columns use the stage name, colour and final-stage flag from Workflows. Header shows the name, a card-count badge and the process name | ● Works | Falls back to built-in default stages |
| F-1.5: Card | Card | Client name (opens the client profile), process name, status pill, created date, Activity line, responsible first name | ◐ Simulated | The Activity line always reads "No activities" (G5-E-05) |
| F-1.6: Card source | Data | Cards come from a separately seeded deals list | ◐ Simulated | List uses process records. A process created in Workflows shows empty columns. A record moved in List shows here only if a deal with the same client name exists (G5-E-01). Decision needed: D-100 |
| F-1.7: Client processes only | Rule | Only processes of type client are shown. Appointment, invoice, insurance, claim and task processes live in their own screens | ● Works | |
| F-1.8: Empty column | State | A column with no cards shows nothing | ○ Not built | No placeholder |
| F-1.9: Loading and error states | State | None exist | ○ Not built | All data is browser-local |
| F-1.10: Client filter banner | Banner | A "Showing deals for <client>" banner is coded | ○ Not built | No screen sends a client to it (G5-E-31) |
| F-1.11: Avatar, days in stage and deal value on the card | Card | Described in the earlier PRD | ○ Not built | Decision needed: D-101, D-102 |
| F-1.12: Quick process switcher examples | Dropdown | The earlier PRD named Bariatric Care, Dental Implant and General Intake | ○ Not built | The processes shown are those configured in Workflows |

#### 3. Worked example
Priya opens the board in the morning.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The page loads | Picks **Client Intake** | **Columns show the stages from Workflows with a count on each** |
| 2 | She opens a process created yesterday in Workflows | Picks it from the switcher | **The columns are there and all of them are empty** |
| 3 | She wants the client | Clicks **Sarah Johnson** on a card | **The client profile opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When reviewing my patient caseload, I want to see where each patient is in their care journey, so that I can clear bottlenecks. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a process is chosen, **then** the columns are that process's stages and each header shows a card count. |
| F-1-2 | **Given** the page is opened with `?process=<name>`, **then** the switcher is hidden and the title is the process name. |
| F-1-3 | **Given** a process created in Workflows, **then** its columns show no cards until a deal exists for it. |

### F-2: Move a card to another stage

#### 1. What it does
Priya drags Sarah's card onto another column. Any column is allowed, not only the next one. If the new stage has required fields that are empty, a **Required Fields Needed** modal lists them. She fills each one and presses **Save & Move Stage**. **Cancel** leaves the card where it was. The move is saved and a toast reads "Deal moved to ... ✓".

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Drag and drop | Interaction | Dropping on any column moves the card. The same rule applies from the List stage bar and the drawer ribbon | ● Works | No adjacent-stage limit. Decision needed: D-103 |
| F-2.2: Required-field gate | Modal | Blocks the move until every field required for that stage has a value ("<label> is required.") | ◐ Simulated | A hardcoded phone and email fill in for any client without one and can satisfy the check (G5-E-11) |
| F-2.3: What a move writes | Rule | Updates the deal, the matching process record (or creates one), the client's stage and process list, a stage-change entry on the client timeline and an audit entry (latest 500 kept) | ◐ Simulated | Every Kanban deal for the same client name is rewritten to this process and stage, and the record's date is overwritten (G5-E-02, G5-E-10) |
| F-2.4: One current stage per client | Rule | The client keeps a single stage, overwritten by the latest move in any process | ● Works | A client in two processes shows only the last-moved stage |
| F-2.5: Stage events and automations | Event | A move emits stage entered, stage exited and type-specific events. The rule engine runs any matching automation | ● Works | What runs belongs to Workflows. A stage move from the drawer ribbon is logged twice, so automations fire twice (G5-E-13) |
| F-2.6: Toast | Message | "Deal moved to <stage> ✓" | ● Works | |
| F-2.7: Companion stepper | Hand-off | The patient status screen re-reads process records on change | ● Works | Detail belongs to the Companion pages |
| F-2.8: Notice to the physician | Notification | The earlier PRD said the attending physician is notified | ○ Not built | Nothing is sent unless a workflow automation is set on that stage. Decision needed: D-128 |
| F-2.9: Locked final stages | Rule | The earlier PRD implied adjacent moves only | ○ Not built | Won and Lost stages are not locked. Decision needed: D-103 |

#### 3. Worked example
Priya moves Sarah forward.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Insurance is verified | Drags Sarah's card to **Clinical Consultation** | **A modal lists the missing required fields** |
| 2 | She fills them | Presses **Save & Move Stage** | **The card moves and "Deal moved to Clinical Consultation ✓" shows** |
| 3 | Sarah opens her portal | Looks at her status | **The stepper shows the new stage** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When a patient completes a step, I want to move their card and have the next actions start, so that nothing waits on me. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a card dropped on any column, **when** the target stage has empty required fields, **then** the modal lists them and the card does not move until they are filled. |
| F-2-2 | **Given** a completed move, **then** the client's stage, the process record and the client timeline are updated and the toast shows. |
| F-2-3 | **Given** a move, **then** stage events are emitted once for the Kanban path and any matching automation runs. |
| F-2-4 | **Given** a move, **then** the patient's Companion stepper shows the new stage. No physician is notified unless an automation is set. |

### F-3: Card menu

#### 1. What it does
Each card has a **⋯** menu with Edit, Call and Delete. Priya presses Delete on a test card and it disappears at once.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Delete | Menu action | Removes the deal immediately and shows "Deal deleted" | ◐ Simulated | No confirmation and no undo (G5-E-03) |
| F-3.2: Edit | Menu action | Nothing happens | ○ Not built | (G5-E-04). Decision needed: D-100 |
| F-3.3: Call | Menu action | Nothing happens | ○ Not built | (G5-E-04). Decision needed: D-100 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A test card is no longer needed | Chooses **Delete** on the card | **The card vanishes with no confirmation** |
| 2 | She wants to phone the client | Chooses **Call** | **Nothing happens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator | When a patient needs a quick follow-up, I want to call or edit from the card, so that I do not leave the board. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a card, **when** Delete is chosen, **then** it is removed at once with no confirmation. |
| F-3-2 | **Given** a card, **when** Edit or Call is chosen, **then** nothing happens. |

### F-4: Stage value and revenue forecast

#### 1. What it does
The earlier PRD promised a revenue total on each column and a weighted forecast. Priya sees only a card count. A column total is computed in code but never shown.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Column total revenue header | Badge | Sum of deal values in the column | ○ Not built | Computed, never displayed. Records on the List side have no value field (G5-K-07). Decision needed: D-101 |
| F-4.2: Stage probability weighting | Metric | Column value multiplied by a stage conversion probability | ○ Not built | Stages carry no probability. Decision needed: D-101 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Asha Verma wants the surgical pipeline value | Opens the board | **Headers show a card count only. No dollar figure appears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Manager | When forecasting monthly clinic revenue, I want treatment values grouped by stage, so that I can track pending surgical conversions. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** any column, **then** the header shows a card count and no revenue total. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Process board and stage columns | F-1.1 – F-1.12 | ● / ◐ / ○ | Switcher and columns work; cards come from a separate deals list. |
| F-2 | Move a card to another stage | F-2.1 – F-2.9 | ● / ◐ / ○ | Drag works and fires automations; no physician notice. |
| F-3 | Card menu | F-3.1 – F-3.3 | ◐ / ○ | Delete has no confirmation; Edit and Call do nothing. |
| F-4 | Stage value and revenue forecast | F-4.1 – F-4.2 | ○ Not built | No value, total or forecast. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | See where each patient is in their care journey | F-1 |
| 2 | Care Coordinator | Move a card and start the next actions | F-2 |
| 3 | Care Coordinator | Call or edit from the card | F-3 |
| 4 | Practice Manager | See treatment values grouped by stage | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Switch process, drag any card to any column, delete any card | Moving into a stage with empty required fields |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named the Care Coordinator and Practice Manager as users and said nothing about access. Decision needed: D-103 for stage movement rules.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Column card count | Column header | Number of deals whose stage equals the column |
| Column total value | Not shown | Sum of deal amounts in the column, computed and never displayed. Decision needed: D-101 |
| Stage probability, weighted forecast | Not built | **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → Billing | Walk-in approval | A deal is created in the default onboarding process with a fixed amount of 150, matched by client name. |
| Web form → Client → Process → Task | Client placed in a process by the form | Text label only. No deal and no process record, so no card. |
| | Widget bot moves a visitor to a stage | A process record is created. It appears on the List only, not on the Kanban. |
| | Process to Task | Not connected. No automation creates a task. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical: Process, Workflows, Deals or Pipeline? | Naming note |
| D-100 | Do Kanban and List share one set of process records, and what do card Edit and Call do? | F-1.6, F-3.2, F-3.3 |
| D-101 | Does a process record carry a monetary value, column totals and a weighted forecast? | F-1.11, F-4.1, F-4.2 |
| D-102 | What starts the days-in-stage clock? | F-1.11 |
| D-103 | Can a card move to any stage or only adjacent ones, and are final stages locked? | F-2.1, F-2.9 |
| D-128 | Should a stage move notify anyone by default or only through automations? | F-2.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
