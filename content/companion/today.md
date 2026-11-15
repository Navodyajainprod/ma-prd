---
title: "Today: Visit, Care Pathway and Check-in"
product: "companion"
module: "today"
route: "/patient/status"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | COMPANION |
| Module | TODAY |
| Route | `/patient/status` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The patient's landing page: a greeting, today's visit (time, doctor, room), recent tasks, the care-pathway stage card with guidance, and shortcut rows. It also answers `/patient`, `/patient/checkin` and `/patient/<client id>`. |
| **Who uses it** | Patient. Meera Iyer and Dr. Anita Rao act on the clinic side: moving the patient on the process board changes what Today shows. Nothing on `/patient` is protected (G12-E-01, G12-E-02). |
| **Where you start it** | **Today** in the portal drawer, `/patient`, or the stage-to-route link after sign-in. |
| **Where the result goes** | Nothing is saved from this page. It reads appointments, invoices, tasks and process stages from the shared stores. |
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
| Client (Appointments) | Visit pill and next appointment | The patient's appointments, matched by client id, phone or exact name, feed the visit pill and the next-appointment row. | [View Appointments](/client/appointments/list) |
| Client (Invoices) | Balance and Pay button | Unpaid balance and the Pay Invoice or View Paid Receipt button come from invoices. With none for the patient, other patients' invoices are used. | [View Invoices](/client/invoices) |
| Client (Processes) | Care pathway stage | The stage card shows the stage the clinic moved the patient to, with the stage's authored content. | [View Process Kanban](/client/processes/kanban) |
| Companion | Tasks | The three most recent tasks are summarised on Today. | [View Companion Tasks](/companion/tasks) |
| Companion | Billing | The balance row and the Pay button open the Billing and Pay screens. | [View Companion Billing](/companion/billing) |
| AI Receptionist | Kiosk check-in | Phone check-in is not connected. The kiosk issues a token and marks the appointment checked in. Today has no equivalent. | [View Kiosk Scheduled Check-in](/ai-receptionist/checkin/scheduled) |
| Companion | Care Bot check-in | The bot's **Check in** shortcut says the patient is checked in without checking in. | [View Companion Messages](/companion/chat/chat) |

## 1. Module Summary

### The story in one minute

Sarah Johnson opens **Today** on her phone on the morning of her cataract visit. The page says "Hello, Sarah" with the date and clinic name. A pill shows her visit time, Dr. Anita Rao and the room. Below it sit her three newest tasks with progress rings. The big card shows her care pathway as a stepper. Meera Iyer moves Sarah's card on the clinic board, and the stage card changes. After the visit the card button becomes **Pay Invoice**. Sarah taps it and lands on the payment page. She looks for an **I Have Arrived** button and a queue number. Neither exists.

**Naming note:** the sidebar says "Today". The earlier PRD called this "Today's Visit Agenda, Live Queue & Doctor ETA". Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the greeting, the visit pill, the care-pathway card and stage drawer, other pathways, the recent tasks card and the shortcut rows.
- **Simulated:** the balance and the pay button, which borrow another patient's invoice when the patient has none and can show an invented $78.75. The bot's check-in reply.
- **Not built:** the **I Have Arrived** button, the queue ticket, now serving, patients ahead, doctor ETA, the full-screen "your turn" notice, room directions, and consent signing in the stage drawer.

### Journey position

```
Booking ─▶ Stage set ─▶ Today (visit pill, stage card) ─▶ Visit done ─▶ Pay Invoice ─▶ Billing and Pay
```

## 2. Feature Requests

### F-1: Visit card and shortcuts

#### 1. What it does
Sarah opens Today. The header says "Hello, Sarah" with the date and the clinic name. A pill shows today's visit time, doctor and room. If she has no visit today the pill is hidden and her next appointment appears in a shortcut row. Rows for documents, forms and the Care Bot sit below.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Greeting header | Header | "Hello, <first name>" with date and clinic name | ● Works | |
| F-1.2: Visit pill | Badge | Time, doctor and room of today's visit. The room comes from the appointment or the clinic's room rules | ● Works | |
| F-1.3: Which visit is shown | Rule | The first appointment today that is not completed or cancelled, else a completed one, else any | ● Works | |
| F-1.4: Patient identity | Rule | The page shows whoever the link names: the id in the path, `?clientId=`, the stored id, else `CL-001`, else the first client | ◐ Simulated | No sign-in guard. A visitor with no session becomes the first client (G12-E-01, G12-E-02). Decision needed: D-46 |
| F-1.5: Next appointment row | Row | With no visit today, shows the next scheduled visit and opens Visits | ● Works | |
| F-1.6: Shortcut rows | Rows | Documents, Forms and Care Bot open their screens | ● Works | |
| F-1.7: No visit today | State | The pill is hidden | ● Works | |
| F-1.8: No active patient | State | "No Patient Profile Active" with a Sign In link | ○ Not built | The code exists but can never show (G12-E-01) |
| F-1.9: Room direction text | Text | Walking direction to the room | ○ Not built | Computed but never shown (G12-E-14). Decision needed: D-123 |
| F-1.10: Doctor avatar, specialty, suite, clinic address | Card | Described in the earlier PRD | ○ Not built | The pill shows time, doctor and room only. Decision needed: D-123 |

#### 3. Worked example
Sarah checks her visit at 9 a.m.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visit at 10:30 with Dr. Rao | Opens **Today** | **The pill shows 10:30, Dr. Rao and the room** |
| 2 | A day with no visit | Opens **Today** | **The pill is hidden and the next appointment shows in a row** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | On the day of my visit, I want to see the time, doctor and room at a glance, so that I know where to go. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a visit dated today, **when** Today opens, **then** the pill shows its time, doctor and room. |
| F-1-2 | **Given** no visit today, **when** Today opens, **then** the pill is hidden and the next scheduled visit shows in a row. |
| F-1-3 | **Given** a link with another client id, **when** Today opens, **then** that patient's page is shown with no check. |

### F-2: Care pathway card and stage guidance

#### 1. What it does
The hero card shows Sarah's main care pathway with a mini stepper, the stage headline, a description and optional video guides. Other pathways sit in a collapsible list. One tap on a stage previews it. A second tap opens its full content in a drawer. The pathway the clinic moved most recently is shown first.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Stage card and stepper | Card | Done, current and upcoming stages from the clinic's stage. Current stage is the latest process log entry, else the per-process stage, else the client's stage, else the first | ● Works | |
| F-2.2: Pathway order | Rule | The pathway most recently moved on the clinic board comes first | ● Works | Decision needed: D-121 |
| F-2.3: Other Care Pathways | List | A collapsible list of the other visible pathways | ● Works | |
| F-2.4: Stage drawer | Drawer | Authored guidance and video guides for the stage | ● Works | Content is set in the process builder |
| F-2.5: Pay button | Button | After a completed visit in "Patient Care Journey": **Pay Invoice ($x)**, or **View Paid Receipt** when paid | ◐ Simulated | With no invoice of her own the amount can come from another patient's invoice or fall back to $78.75 (G12-E-10, G12-E-11) |
| F-2.6: Consent signing in the drawer | Step | The drawer should capture a consent signature | ○ Not built | Never wired (G12-E-13). Decision needed: D-147 |
| F-2.7: Progress percent | Display | Stage number divided by stage count | ○ Not built | Computed, never shown (G12-E-14) |

#### 3. Worked example
Meera moves Sarah on the board after the visit.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visit completed, invoice open | Sarah opens **Today** | **The hero button reads Pay Invoice with the amount** |
| 2 | Sarah wants guidance | Taps the stage twice | **The stage drawer opens with the authored content** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | During my care journey, I want to know the current stage and what to do next, so that I am prepared. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the clinic moves the patient to a stage, **when** Today opens, **then** the stage card shows that stage. |
| F-2-2 | **Given** a completed visit and an unpaid invoice, **when** Today opens, **then** the button reads Pay Invoice with an amount and opens the pay page. |
| F-2-3 | **Given** the patient has no invoice, **when** Today opens, **then** another patient's invoice may be used. |

### F-3: Tasks and balance

#### 1. What it does
Sarah sees up to three recent tasks with progress rings. Rows below show her account balance. If a balance exists the row opens Pay. If not it opens Billing.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Recent tasks card | Card | Up to three newest tasks with a progress ring, same rules as My Tasks | ◐ Simulated | Inherits the name matching of My Tasks (G12-E-36) |
| F-3.2: Account balance row | Metric | Sum of unpaid balance on the invoices found | ◐ Simulated | Includes other patients' invoices when she has none (G12-E-10) |
| F-3.3: No tasks | State | The task card is hidden | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | One invoice open | Taps the balance row | **The payment page opens** |
| 2 | Sarah has no invoice | Opens **Today** | **The balance row shows another patient's unpaid amount** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I open the app, I want quick access to my tasks and balance, so that I act on what needs attention. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** invoices that are not paid or void, **then** the balance is the sum of total minus paid, never below 0. |
| F-3-2 | **Given** the patient has no invoice, **then** invoices of other patients are used. |

### F-4: Phone check-in and queue

#### 1. What it does
Sarah expects to tap **I Have Arrived** and see a ticket and a wait time. Today has no such button. `/patient/checkin` only shows the Today page. A full check-in screen exists in the code but is not routed.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: I Have Arrived button | Button | One-tap arrival | ○ Not built | (G12-E-12). Decision needed: D-122 |
| F-4.2: `/patient/checkin` | Route | Shows the Today page | ○ Not built | The check-in screen is unreachable (G12-E-12) |
| F-4.3: Care Bot Check in | Shortcut | The Messages bot says "Check In Confirmed". The full-page bot only moves the client's stage | ◐ Simulated | No appointment is checked in and no ticket exists (G12-E-26) |
| F-4.4: Arrival to Arrived status | Sync | Appointment becomes Arrived and the doctor is told | ○ Not built | Decision needed: D-122 |
| F-4.5: Geofence | Rule | Button active only near the clinic | ○ Not built | Decision needed: D-122 |
| F-4.6: Queue ticket, now serving, patients ahead | Display | Described in the earlier PRD | ○ Not built | Decision needed: D-123 |
| F-4.7: Doctor ETA and wait counter | Metric | Described in the earlier PRD | ○ Not built | No formula exists. Decision needed: D-123 |
| F-4.8: Full-screen "your turn" notice | Notice | Shown when the clinic calls the token | ○ Not built | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah is in the lobby | Opens `/patient/checkin` | **The Today page opens. She is not checked in** |
| 2 | She taps **Check in** in the bot | Reads the reply | **It says she is checked in. The appointment is unchanged** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | On the day of my appointment, I want to check in from my phone, so that I do not wait in line at the desk. |
| F-4-J2 | Patient | While waiting for the doctor, I want to see my queue progress, so that I know when it is my turn. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** Today, **when** the patient looks for an arrival control, **then** none exists. |
| F-4-2 | **Given** `/patient/checkin`, **when** it opens, **then** the Today page shows and no appointment changes. |
| F-4-3 | **Given** the Messages bot **Check in**, **when** pressed, **then** a confirmation text shows and no check-in is recorded. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Visit card and shortcuts | F-1.1 – F-1.10 | ● / ◐ / ○ | Visit pill works; identity unchecked; extras absent. |
| F-2 | Care pathway card | F-2.1 – F-2.7 | ● / ◐ / ○ | Clinic-driven stage works; pay button can borrow an invoice. |
| F-3 | Tasks and balance | F-3.1 – F-3.3 | ◐ / ● | Balance can include other patients' invoices. |
| F-4 | Phone check-in and queue | F-4.1 – F-4.8 | ○ / ◐ | No arrival button, ticket or ETA. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | See time, doctor and room at a glance | F-1 |
| 2 | Patient | Know my stage and next step | F-2 |
| 3 | Patient | Reach tasks and balance quickly | F-3 |
| 4 | Patient | Check in from my phone | F-4 |
| 5 | Patient | See my queue progress | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Anyone with the link | Open Today for any patient by changing the path or `?clientId=` | Nothing |
| Visitor with no session | Sees the first client's page | Nothing |
| Clinic staff | Move a patient's stage on the board, which changes Today | Nothing on this page |

The earlier PRD named the patient only. Decision needed: D-46.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Account balance row | Quick rows | Sum over the invoices found that are not paid or void of total minus paid, never below 0 |
| Pipeline percent | Not shown | Current stage number divided by stage count, times 100. Computed, never displayed |
| Task progress ring | Task rows | Patient's completed deliverables divided by total |
| Doctor ETA, queue position | Not built | **Hardcoded, formula undefined** |
| Fallback pay amount | Pay button | $78.75. **Hardcoded, formula undefined** (G12-E-11) |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal with Appointments and Invoices | Booking confirmed | The booking sets the stage to "Client Checked In" or "Payment Done", so Today looks checked in early (G12-E-15). |
| | Patient arrives | No arrival control. Phone check-in is not connected. |
| | Staff creates an invoice | Today borrows other patients' invoices when the patient has none. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical for this screen? | Naming note |
| D-46 | What is the patient authentication model? | F-1.4, F-1.8 |
| D-121 | Does Today show every pathway or the most recently moved one first? | F-2.2 |
| D-122 | Should phone check-in mark the appointment Arrived, create a token and use a geofence? | F-4.1 – F-4.5 |
| D-123 | Who owns queue position, now serving and ETA, and what is the formula? | F-1.9, F-1.10, F-4.6, F-4.7 |
| D-147 | Does consent signing belong in the stage drawer or in Forms? | F-2.6 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
