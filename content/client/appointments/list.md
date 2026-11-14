---
title: "Appointments List: Workflow Table, Stage Moves, Import and Export"
product: "client"
module: "appointments"
channel: "list"
route: "/appointments (List tab)"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | APPOINTMENTS |
| Route | `/appointments` (List tab) |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **List** tab of Appointments, the tab the page opens on. A table of appointments for one appointment workflow, with stage pills, search, a provider filter, row actions, a stage bar on every row, an Import drawer and an Export modal. |
| **Who uses it** | Front-desk Staff (find a visit, move its stage, cancel, complete, mark no-show). Practice Manager (import and export). No role is checked: every signed-in user sees and can cancel every provider's appointments. |
| **Where you start it** | **Appointments** in the sidebar (`/appointments`). Deep links: `?processId=` or `?process=` locks the table to one workflow, `?id=` filters to that appointment's client. |
| **Where the result goes** | The appointment store, the client's activity timeline and stage-move log, events for Automation, and the linked invoice when an appointment is cancelled. |
| **How real is it** | 0 features work, 4 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| AI Receptionist | Kiosk check-in | The earlier PRD said the List switches to "Arrived" with a green arrival badge. Not delivered. The kiosk never reaches a staff-booked appointment, and even a successful call stores only a check-in time that no column shows. | [View Kiosk Scheduled Check-in](/ai-receptionist/checkin/scheduled) |
| Companion | Portal bookings | A visit booked in the portal (source "MA-Client") appears in the List. The portal lists a no-show visit as upcoming. | [View Companion Appointments](/companion/appointments) |
| Client (Invoices) | Invoice at booking, void on cancel | Booking with the invoice option creates one invoice. Cancelling voids the linked invoice even when it is paid. | [View Invoices](/client/invoices) |
| Client (Workflows) | Appointment workflows | The table is scoped to one appointment workflow and the stage pills are that workflow's stages. The gear menu opens the workflow. | [View Workflows](/client/workflows) |
| Client (Processes) | Appointment stages | Stage moves use the same stages as the process board. | [View Process List](/client/processes/list) |
| Client (Automation) | Lifecycle events | Booked, rescheduled, cancelled, completed, no-show and checked-in events are emitted for automation rules. | [View Automation](/client/automation) |
| Client (Scribe) | AI Scribe from an appointment | The detail drawer has an **AI Scribe** fill. The session stores the appointment only as a generic record id. | [View Scribe](/client/scribe) |
| Client (Clients) | Activity timeline | Every stage move and lifecycle action adds an activity entry to the client. | [View Clients](/client/clients) |
| Client (Call Logs) | Calls tab in the detail drawer | Shows the client's call logs, or two invented calls when there are none. | [View Call Logs](/client/call-logs) |

## 1. Module Summary

### The story in one minute

Meera Iyer opens **Appointments** and lands on the **List** tab. The workflow selector shows the appointment workflow and the stage pills read All, Booked, Reminder, Completed, Reschedule and No-show. She types "Johnson" and Sarah's visit with Dr. Anita Rao appears. She clicks **Completed** on the stage bar of another row and the visit moves at once, with a toast and an activity entry. Sarah calls to cancel. Meera opens the row menu, chooses **Cancel / Delete** and the visit is cancelled with no question asked. The invoice linked to the visit is voided, even though Sarah had paid it. Meera looks for a **Mark Arrived** button when a patient walks in and finds none. Later Asha exports the list to CSV.

**Naming note:** the earlier PRD filtered by Confirmed, Arrived, In Progress, Completed, Cancelled and No-Show. The screen shows the workflow's own stages: Booked, Reminder, Completed, Reschedule and No-show. Decision needed: D-114.

### What is real and what is not

- **Real in the prototype:** the workflow-scoped table, search, the provider filter, the stage pills, inline stage moves with a log, View Details, Reschedule, Mark as Complete, No Show, Cancel, CSV import and export with a status filter.
- **Simulated:** pill counts that do not match the rows, stage and status drift, Edit Details that opens the same drawer as View, a CSV import that ignores service, duration and provider, and cancelling that voids even a paid invoice. The Calls tab shows invented calls and the Invoices tab matches by client name.
- **Not built:** Mark Arrived, arrival time, Wait Time and queue token, the kiosk making a visit Arrived, a date range filter, sortable columns, provider-name search, bulk reschedule, room, visit reason and copay columns, and role-based scoping.

### Journey position

```
Booking ─▶ List row ─▶ Stage move / Complete / No Show / Cancel ─┬▶ Activity timeline
                                                                 ├▶ Event for Automation
                                                                 └▶ Invoice (voided on cancel)
```

## 2. Feature Requests

### F-1: Workflow-scoped appointments table

#### 1. What it does
Meera opens `/appointments` and sees one row per appointment. Columns are **Appointment ID** (APT-0000), **Title**, **Stages**, **Client**, **Date**, **Time** with duration, **Provider** and **Service**. A workflow selector picks the appointment workflow and defaults to the first. Pills for **All** and each stage of that workflow show counts. A search box and a provider filter narrow the rows. Clicking a row, the ID or the client name opens the detail drawer. The date range filter, sorting and the room, visit reason and copay columns of the earlier PRD are not built. Decision needed: D-114.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Workflow selector | Dropdown | Lists the appointment workflows of the organisation and defaults to the first. A URL naming a process shows a fixed badge instead | ● Works | (G6-L-08) |
| F-1.2: Columns | Table | ID, Title (`<client>_Appointment_<date>`), Stages, Client, Date, Time with duration, Provider, Service | ◐ Simulated | Duration is always 60 minutes for staff bookings (G6-E-17) |
| F-1.3: Stage pills | Filter | All plus one pill per stage, each with a count | ◐ Simulated | Counts cover all workflows, the table shows one, so counts and rows disagree (G6-E-03). Decision needed: D-114 |
| F-1.4: Search | Input | Matches appointment ID, client name, email, phone, notes and title, instantly | ● Works | (G6-L-04) |
| F-1.5: Provider filter | Filter | Filters > Provider limits rows to one provider | ● Works | (G6-L-09) |
| F-1.6: Deep links | URL | `?processId=` or `?process=` locks the workflow. `?id=` filters to that appointment's client | ● Works | (G6-L-24) |
| F-1.7: Empty state | State | "No appointments found. Adjust your filters or book a new appointment." | ● Works | |
| F-1.8: Loading state | State | Data loads at once from browser storage, so no loading state exists | ○ Not built | |
| F-1.9: Detail drawer | Drawer | Opens on a row click. Stage ribbon, Overview, Documents, Invoices and Calls tabs, activity feed and an AI Scribe fill | ◐ Simulated | Invoices tab matches invoices by client name, so a namesake's invoices and totals show (G6-E-26). Calls tab shows two invented calls when none exist (G6-E-25). Editing date or time there reschedules with no availability check (G6-E-24). Complete, No-show, Cancel and Reschedule have no buttons in it (G6-E-27) |
| F-1.10: Booking blocked without automation | Rule | An amber banner locks booking when no appointment automation exists | ◐ Simulated | The default workflow counts as automation, so it is never locked (G6-L-25) |
| F-1.11: Help text | Modal | "How Appointments Works" | ◐ Simulated | Promises Upcoming, Done and Pending filters that do not exist (G6-E-09) |
| F-1.12: Arrived, In Progress and Cancelled pills | Filter | The earlier PRD's status vocabulary | ○ Not built | Decision needed: D-114 (G6-L-02) |
| F-1.13: Date range filter, default Today | Filter | Today, Tomorrow, This Week, This Month, custom | ○ Not built | The list shows every date (G6-L-06) |
| F-1.14: Sortable columns | Header | Sort by time, name or status | ○ Not built | (G6-L-07) |
| F-1.15: Search by provider name | Input | Described in the earlier PRD | ○ Not built | Use the provider filter (G6-L-05) |
| F-1.16: Room, Visit Reason, Copay and Wait Time columns | Columns | Described in the earlier PRD | ○ Not built | (G6-L-01) |
| F-1.17: Role-based scoping | Rule | A provider sees only their own visits | ○ Not built | The view exists in code but is unreachable (G6-E-28). Decision needed: D-20 |

#### 3. Worked example
Meera looks for Sarah Johnson's visit.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | List is open on the first workflow | Types **Johnson** in the search box | **Rows narrow to matching client, email, phone, notes, title or ID** |
| 2 | Wants one doctor | Picks Dr. Anita Rao in Filters > Provider | **Only her rows remain** |
| 3 | Looks at the Completed pill | Compares count to rows | **The count includes appointments from other workflows and can disagree with the rows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front-desk Staff | When managing the day, I want to filter by stage and provider, so that I can work the right queue. |
| F-1-J2 | Front-desk Staff | When managing the waiting area, I want to filter by Arrived, so that I know which patients are ready for nursing triage. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a stage pill, **when** it is clicked, **then** only appointments at that stage in the selected workflow remain. |
| F-1-2 | **Given** any pill, **then** its count may differ from the rows shown, because it counts all workflows. |
| F-1-3 | **Given** a search term, **when** typed, **then** rows are filtered by ID, client name, email, phone, notes and title. Provider name is not searched. |
| F-1-4 | **Given** no matching appointments, **then** the empty message is shown. |
| F-1-5 | **Given** the table, **then** no column can be sorted and there is no date range filter. |
| F-1-6 | **Given** a signed-in user of any role, **then** every provider's appointments are listed. |

### F-2: Row actions and stage moves

#### 1. What it does
Meera moves a visit through its life from the table. Clicking a stage on the row's stage bar moves the appointment there at once, with no confirmation. The system saves it, logs a stage move and an activity entry and shows a toast. The row menu holds **View Details**, **Edit Details**, **Reschedule**, **Mark as Complete**, **No Show** and **Cancel / Delete**. The default workflow runs Booked, Reminder (which sends a WhatsApp reminder step on entry), then Completed, Reschedule or No-show. It has no Cancelled stage. Decision needed: D-114, D-65.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Stage bar | Inline control | Moves the appointment to the clicked stage, logs a stage move and an activity entry, shows a toast | ◐ Simulated | Status can drift from stage: No-show or Reminder from the row leaves the old status (G6-E-04) |
| F-2.2: View Details | Action | Opens the detail drawer | ● Works | |
| F-2.3: Edit Details | Action | Opens the same drawer as View Details | ◐ Simulated | (G6-E-05) |
| F-2.4: Reschedule | Action | Opens the booking drawer in reschedule mode. Saves date, time and note | ◐ Simulated | Service, location or provider changes are dropped (G6-E-22). Only an identical start time counts as a conflict (G6-E-15). Decision needed: D-117 |
| F-2.5: Mark as Complete | Action | Moves to the completed stage chosen by a completion rule, else the process's completed or final stage. Emits `appointment.completed` | ● Works | Hidden when already complete (G6-L-12) |
| F-2.6: No Show | Action | Sets status and stage to no-show, logs it and emits `appointment.no_show` | ● Works | The invoice is untouched. Decision needed: D-65 (G6-B-22) |
| F-2.7: Cancel / Delete | Action | Sets cancelled, adds a reason to the notes, logs it, emits `appointment.cancelled` and voids the linked invoice | ◐ Simulated | Runs with no confirmation (G6-E-06). Voids the invoice even when it is paid (G6-E-23). No Cancelled stage exists. Decision needed: D-65 |
| F-2.8: Reminder stage | Rule | Entering the Reminder stage sends a WhatsApp reminder step | ◐ Simulated | Stage-entry only, no time-based schedule. Decision needed: D-120 (G6-B-30). The step runner is unverified |
| F-2.9: Confirmation before Cancel | Rule | Ask before cancelling | ○ Not built | (G6-E-06) |
| F-2.10: Refund or credit for a paid cancelled visit | Rule | Described nowhere in the earlier PRD | ○ Not built | Decision needed: D-65 |

#### 3. Worked example
Sarah Johnson cancels a prepaid consultation by phone.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Row for Sarah is on screen | Opens the row menu and chooses **Cancel / Delete** | **The visit is cancelled at once with no confirmation** |
| 2 | Sarah had paid the invoice | Meera opens Invoices | **The invoice is Void even though it was paid. No refund is recorded** |
| 3 | Another visit finished | Clicks **Completed** on its stage bar | **The visit moves to Completed, a toast shows and an activity entry is written** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Front-desk Staff | When a visit ends or is missed, I want to update it in one click, so that records and billing stay right. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a stage on the row's stage bar, **when** it is clicked, **then** the appointment moves there at once, a stage move and an activity entry are logged and a toast shows. |
| F-2-2 | **Given** Cancel / Delete, **when** chosen, **then** the appointment is cancelled with no confirmation and the linked invoice is voided, including a paid one. |
| F-2-3 | **Given** a complete or cancelled appointment, **then** Mark as Complete or No Show is hidden as described. Nothing else hides actions. |
| F-2-4 | **Given** Edit Details, **when** chosen, **then** the same drawer as View Details opens. |

### F-3: Import and export

#### 1. What it does
Asha Verma brings in bookings from another system or takes them out. The **Import** drawer has three tabs: **CSV** (download a template, upload, Import), **Webhook** (an endpoint URL and a sample payload) and **Integration** (the shared integrations tab). **Export** opens the shared export modal with a status filter (Scheduled, Completed, Cancelled, No-Show, Pending Accept) and 12 fields.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: CSV import | Upload | Template download, upload, Import. Errors for no file, no data rows and a parse failure | ◐ Simulated | Ignores the service and duration columns, has no provider column, gives every row the first provider and first service. Template time "10:00 AM" does not match the HH:MM the slot logic expects (G6-E-08) |
| F-3.2: Webhook tab | Info | Shows an endpoint URL and a sample payload | ◐ Simulated | Whether anything receives data is unverified |
| F-3.3: Integration tab | Tab | The shared integrations tab | ◐ Simulated | Unverified |
| F-3.4: Export | Modal | Status options and 12 fields | ● Works | (G6-L-22) |
| F-3.5: Bulk reschedule | Action | Described in the earlier PRD | ○ Not built | A row selection state exists but is unused (G6-L-23) |

#### 3. Worked example
Asha exports the cancelled visits.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | List is open | Presses **Export** and picks **Cancelled** | **A file with the chosen fields is produced** |
| 2 | Migrating bookings | Uploads the CSV template with services and providers | **Rows import, but each gets the first provider and first service** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When onboarding, I want to import my existing bookings, so that I do not re-key them. |
| F-3-J2 | Practice Manager | When reporting, I want to export appointments by status, so that I can analyse them elsewhere. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a CSV with no file or no data rows, **when** Import is pressed, **then** an error is shown. |
| F-3-2 | **Given** a CSV row with a service and a provider, **when** imported, **then** the first provider and first service are used instead. |
| F-3-3 | **Given** Export, **when** a status and fields are chosen, **then** matching appointments are exported. |

### F-4: Check-in and arrival

#### 1. What it does
The earlier PRD promised a **Mark Arrived** button, an arrival time, a Wait Time column, a queue token and a doctor alert, and said the kiosk would make a visit Arrived. None of this exists on the List. The appointment service can record a check-in time and emit `appointment.checked_in` and `client.checked_in`, but the status never changes and nothing shows the time. Decision needed: D-122.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Check-in time | Service | Records the check-in time and emits the check-in events | ◐ Simulated | The status does not change and the List and Calendar never show the time (G6-E-07) |
| F-4.2: Kiosk check-in makes the visit Arrived | Hand-off | Corrected 2026-11-13: the kiosk looks in its own store, never reaches a staff-booked appointment, and a kiosk walk-in id is unknown here | ○ Not built | (G6-E-07, G11-E-42, XM-02). Decision needed: D-122 |
| F-4.3: Mark Arrived button | Button | Moves a Confirmed visit to Arrived | ○ Not built | (G6-L-15) |
| F-4.4: Arrival time and Wait Time column | Column | Arrival time against the scheduled time | ○ Not built | (G6-L-16) |
| F-4.5: Clinician notification | Toast | "Patient has arrived" with a chime | ○ Not built | (G6-L-17) |
| F-4.6: Queue token in the List | Display | A token on check-in | ○ Not built | A token exists only in the kiosk store (G6-L-18) |

#### 3. Worked example
Sarah Johnson arrives at reception.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah is at the desk | Meera looks for **Mark Arrived** on her row | **No such button exists** |
| 2 | Sarah had used the kiosk | Meera checks the status | **It has not changed to Arrived** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-desk Staff | When a patient walks in, I want to mark them arrived with one click, so that their waiting timer starts and the doctor is notified. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a visit on the List, **then** no Mark Arrived action exists in the row menu. |
| F-4-2 | **Given** a kiosk check-in, **then** the appointment's status does not become Arrived. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Workflow-scoped table | F-1.1 – F-1.17 | ● / ◐ / ○ | Table, search and filters work; counts, detail tabs and missing filters. |
| F-2 | Row actions and stage moves | F-2.1 – F-2.10 | ● / ◐ / ○ | Complete and No Show work; cancel is unconfirmed and voids paid invoices. |
| F-3 | Import and export | F-3.1 – F-3.5 | ◐ / ● / ○ | Export works; CSV import ignores service and provider. |
| F-4 | Check-in and arrival | F-4.1 – F-4.6 | ◐ / ○ | No Mark Arrived and no Arrived status. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front-desk Staff | Filter by stage and provider | F-1 |
| 2 | Front-desk Staff | Filter by Arrived to see who is ready for triage | F-1 |
| 3 | Front-desk Staff | Update visits in one click | F-2 |
| 4 | Practice Manager | Import existing bookings | F-3 |
| 5 | Practice Manager | Export appointments by status | F-3 |
| 6 | Front-desk Staff | Mark a walk-in arrived with one click | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | See every provider's appointments, filter, move stages, complete, mark no-show, cancel any appointment, import, export | Nothing |
| Provider-only view | Exists in code with own visits only and no provider filter | Not reachable: a fixed internal value no screen can change (G6-E-28) |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named Receptionist and Front Desk Staff and set no permissions. Decision needed: D-20.

## 5. Metrics and definitions

- **Stage pill count**: the number of appointments, across all workflows, whose current stage is that stage or whose status equals the stage's system category. **All** is the total number of appointments. Computed, but the table is filtered by workflow, so counts and rows can differ (G6-E-03).
- **Invoices tab figures** in the detail drawer: Total Invoiced is the sum of non-void totals, Paid the sum of paid totals, Outstanding the sum of sent, viewed and overdue totals. Invoices are matched by client name (G6-E-26).
- **Wait Time** of the earlier PRD: not shown. **Hardcoded, formula undefined** in the old text.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Call → Receptionist → **Appointment** → Scribe → Invoice → Claim | Staff books with invoice option | One invoice per appointment. Price 150 and client "c-1" are fallbacks. |
| | Staff opens AI Scribe from the appointment | Patient and process prefilled. The appointment is stored as a generic record id. |
| | Scribe finishes in the drawer | The appointment's notes are replaced by the Scribe summary. |
| | Calls tab | Shows two invented calls when the client has none. |
| Kiosk check-in → **Appointment** → Billing | Check-in marks the appointment | Not delivered. No status change, even for kiosk-booked or staff-booked visits. |
| Patient portal ↔ **Appointments** and Invoices | Portal booking | Appears in the List. No conflict check at save. |
| | Portal lists staff-booked visits | Matched by name too. A no-show shows as upcoming. |
| | Staff cancels a prepaid visit | The invoice is voided even when paid. The portal and kiosk still list it as payable. |
| | Patient checks in on the phone | No control exists. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-114 | What is the canonical appointment status list, should a default Cancelled stage exist, and which List columns are required? | F-1.2, F-1.3, F-1.12, F-1.16, F-2 |
| D-20 | Which roles may see other providers' appointments, book for others, cancel and edit availability? | F-1.17 |
| D-65 | What happens on cancelling a paid or prepaid appointment, and does a no-show create a fee? | F-2.6, F-2.7, F-2.10 |
| D-117 | Is overlap the conflict rule, may a reschedule change provider, service or location? | F-2.4 |
| D-120 | Is a time-based reminder required, or is the stage-entry WhatsApp step enough? | F-2.8 |
| D-122 | Should kiosk or phone check-in set the appointment to Arrived, with arrival time, wait time, token and a Mark Arrived button? | F-4.1 – F-4.6 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
