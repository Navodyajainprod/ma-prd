---
title: "Appointments: Booking Drawer and Lifecycle"
product: "client"
module: "appointments"
channel: "booking"
route: "/appointments"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | APPOINTMENTS |
| Route | `/appointments` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The drawer that books or reschedules an appointment, the actions that move it through its life (reschedule, cancel, complete, no-show, check-in, stage move), and the detail drawer that shows one appointment. |
| **Who uses it** | Front-desk Staff (book, reschedule, cancel). Billing Specialist (read the Invoices tab). No role is checked: every signed-in user sees all providers' appointments and can cancel any of them. |
| **Where you start it** | The booking button on `/appointments` (List and Calendar modes), a row or ID click for the detail drawer, or an appointment link such as `/appointments?id=...`. |
| **Where the result goes** | The appointment store (List and Calendar), the client's activity timeline, an invoice when one is requested, and events that Automation listens to. |
| **How real is it** | 0 features work, 5 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Services) | Bookable services | Only services marked as available for appointment are offered. Price, tax, duration, prepaid flag, seats, locations and assigned staff come from the service. | [View Services](/client/services) |
| Client (Invoices) | Invoice at booking | Booking with the invoice option on, or with an appointment-to-invoice rule present, creates one invoice for the appointment. Cancelling voids it, even when paid. | [View Invoices](/client/invoices) |
| Client (Appointments) | List and Calendar | A saved booking appears in the List and the Calendar. | [View Appointments List](/client/appointments/list) |
| Client (Appointments) | Availability | Slots come from the provider's weekly hours and days off set on the Availability tab. | [View Availability](/client/appointments/availability) |
| Client (Scribe) | AI Scribe fill | The detail drawer can start Scribe, and the appointment's notes are replaced by the Scribe summary. | [View Scribe](/client/scribe) |
| Client (Workflows) | Stage and events | The appointment enters its workflow's first stage. Booked, rescheduled, cancelled, completed, no-show and checked-in events are emitted for automations. | [View Workflows](/client/workflows) |
| Companion | Patient booking | The patient portal saves into the same appointment store, with no conflict check. A prepaid portal booking asks for the invoice with a placeholder line. | [View Companion Appointments](/companion/appointments) |
| AI Receptionist | Kiosk booking and check-in | A kiosk walk-in or booking is force-created here with a different id. Kiosk check-in records a check-in time only. | [View Companion Appointments](/companion/appointments) |

## 1. Module Summary

### The story in one minute

Meera Iyer is at the front desk when Sarah Johnson calls for a follow-up. Meera opens **Appointments** and presses the booking button. The drawer asks for a service, then a location. She picks the client, chooses Dr. Anita Rao as the responsible provider and sees a grid of open slots. The first open slot is already selected. She presses **Book Appointment**. A toast says the appointment is scheduled and names the invoice that was created. The appointment appears in the first stage of its workflow. The next week Sarah cancels. Meera cancels the appointment from the row. The status becomes cancelled, the reason is written into the notes and the invoice is voided, even though Sarah had already paid it.

**Naming note:** the old appointment pages and the prototype disagree on status words. The earlier Appointments PRD used Confirmed, Arrived, In Progress, Completed, Cancelled and No-Show. The prototype uses workflow stages Booked, Reminder, Completed, Reschedule and No-show. Decision needed: D-114.

### What is real and what is not

- **Real in the prototype:** the four-section drawer with its required fields, the service, location and provider filters, specialist and service-seat slots, workflow routing, the invoice at booking, the lifecycle actions and their activity entries and events, and the detail drawer with its Overview, Documents and Invoices tabs.
- **Simulated:** a booking can be saved with no valid slot. Staff bookings are always 60 minutes and always labelled "Inbound Call". The conflict check only catches identical start times and portal and kiosk bookings skip it. Reschedule saves only date, time and note. The Calls tab invents two calls. Cancel voids a paid invoice.
- **Not built:** buttons for Complete, No-show, Cancel and Reschedule inside the detail drawer, a Cancelled stage in the default workflow, a prepaid deposit, a time-based reminder, refunds on cancel, and role rules.

### Journey position

```
Call or portal ─▶ Book drawer ─▶ Workflow stage ─┬▶ Invoice (placeholder lines)
                                                 ├▶ Activity timeline and events
                                                 └▶ Cancel ─▶ Invoice voided
```

## 2. Feature Requests

### F-1: Schedule Appointment drawer

#### 1. What it does
Meera presses the booking button and a drawer opens with four sections: **Service**, **Location**, **Participants** and **Schedule**. She picks a service. The service sets the title, adds an invoice line at the service price and tax, and swaps the provider if the current one does not do that service. Only the locations where the service is enabled are listed. If only one qualifies it is picked for her. She picks the client under **Schedule For**. **Responsible (Optional)** lists providers who do that service at that location and are active there. When she picks one, a box shows the room that was allocated, or "No room mapped". The same drawer is used to reschedule.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Service | Select | Required. Lists services marked available for appointment, with a prepaid marker, price and duration. Sets the title, adds an invoice line and may turn on invoice generation | ● Works | |
| F-1.2: Location | Select | Required. Only locations where the service is enabled. One option is auto-picked. A virtual or "Online" location means a video session, anything else is in person | ● Works | |
| F-1.3: Schedule For | Select | Required. The client | ● Works | |
| F-1.4: Responsible (Optional) | Select | Providers filtered by the service's staff for the location, the service's assigned staff and the provider's active locations. Choosing one means specialist mode, leaving it empty means service mode | ● Works | |
| F-1.5: Room box | Display | Shows the auto-allocated room or "No room mapped" once a provider is chosen | ● Works | Decision needed: D-116 |
| F-1.6: Book Appointment / Save Changes | Button | Disabled until service, location, client and date are filled. In create mode it also needs an appointment automation to exist | ◐ Simulated | A slot is not required, so a booking can be saved with no valid time (G6-E-16) |
| F-1.7: Booking source | Field | The drawer has no source field. Every staff booking is saved with source "Inbound Call" | ◐ Simulated | Skews reports and source rules (G6-E-18). Decision needed: D-119 |
| F-1.8: Duration | Rule | Every staff booking is saved as 60 minutes whatever the service | ◐ Simulated | Wrong end times, and the seat maths blocks later slots (G6-E-17) |
| F-1.9: Missing selections | State | Prompts show until service, location and date are filled. With no slots an amber message gives the reason | ● Works | |
| F-1.10: Role control | Rule | Any signed-in user can book for any provider | ○ Not built | Decision needed: D-20 |

#### 3. Worked example
Meera books Sarah's follow-up.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer is open | Picks a service and the only location | **The title and invoice line are set and the location is chosen for her** |
| 2 | Needs the client and doctor | Picks **Sarah Johnson** and Dr. Rao | **The room box shows the mapped room and slots appear** |
| 3 | Service is 30 minutes | Presses **Book Appointment** | **The appointment is saved for 60 minutes with source "Inbound Call"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front-desk Staff | When a patient calls to book, I want to pick the service, place, person and time in one drawer, so that I do not switch screens. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the drawer, **when** service, location, client or date is empty, **then** the save button is disabled. |
| F-1-2 | **Given** only one location offers the chosen service, **then** it is picked automatically. |
| F-1-3 | **Given** a staff booking is saved, **then** its duration is 60 minutes and its source is "Inbound Call", whatever the service. |
| F-1-4 | **Given** no appointment automation exists, **when** the drawer is in create mode, **then** the save button stays disabled. |

### F-2: Slots and conflicts

#### 1. What it does
Under **Schedule**, Meera picks a date and sees **Available Slots**. With a provider chosen, slots start from the provider's hours at that location and step by the service duration. Without a provider, slots run across the location's open hours and each shows how many seats are left. The first open slot is selected for her. A notice says whether the provider is available, off or not scheduled.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Specialist slots | Logic | Provider hours for the location (first shift only), clamped to location hours, stepping by service duration. A full day off, closure, disabled weekday or service not offered gives no slots and a reason. A half day off removes morning or afternoon | ◐ Simulated | Second and third shifts are ignored (G6-E-11). A day-off range never blocks anything (G6-E-12). A partial absence blocks half a day (G6-E-13). Providers named "admin" or id 1 work on disabled days (G6-E-14). Decision needed: D-118 |
| F-2.2: Service-mode seats | Logic | Seats are the location override, else the service maximum, else 1. Each slot shows "N left". Every overlapping non-cancelled service-mode booking takes a seat | ● Works | |
| F-2.3: Auto-pick | Rule | The first open slot is selected | ● Works | |
| F-2.4: Provider conflict | Logic | A slot is disabled when the same provider has a non-cancelled appointment starting at exactly that time | ◐ Simulated | Overlaps are not caught. A 09:00 visit does not block 09:30. Completed and no-show visits count as booked. Rooms are never checked (G6-E-15). Decision needed: D-117 |
| F-2.5: Every channel checked | Rule | The same check on staff, portal, kiosk, AI and import bookings | ◐ Simulated | The service layer saves any time. Portal and kiosk bookings are force-created (G6-E-19) |
| F-2.6: Provider notice | Display | Shows day off, inactive at location, not scheduled, or available | ● Works | |
| F-2.7: Buffers | Rule | No buffer time is applied | ○ Not built | Decision needed: D-118 |

#### 3. Worked example
Meera books a provider who has a visit already.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dr. Rao has a 60-minute visit at 09:00 | Opens the date | **The 09:00 slot is disabled** |
| 2 | She wants 09:30 | Selects the 09:30 slot | **It is allowed, and the two visits overlap** |
| 3 | Dr. Rao has a day off | Opens that date | **No slots, and a message gives the reason. The save button stays enabled and the old time is kept** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When bookings come from many channels, I want one set of rules, so that no channel overbooks. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a provider with a non-cancelled appointment at 09:00, **when** the grid is shown, **then** only the 09:00 slot is disabled. |
| F-2-2 | **Given** a service-mode slot with 5 seats and 3 bookings, **then** it shows "2 left". |
| F-2-3 | **Given** a portal or kiosk booking, **when** it is saved, **then** no conflict or capacity check runs. |
| F-2-4 | **Given** a day with no slots, **when** the user saves, **then** the appointment is saved with the default or last-picked time. |

### F-3: Workflow, invoice and prepaid

#### 1. What it does
On save, the appointment goes to a workflow. A matching booking rule wins, then the workflow assigned to the service, then the one chosen in the drawer. It enters that workflow's first stage. The client is matched by email, name or phone. If the invoice option is on, one invoice is created and the toast names it. The option is on by default for a prepaid service or when an appointment-to-invoice automation exists.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Workflow routing | Rule | Booking rule, then service workflow, then chosen workflow. Enters the initial stage | ● Works | |
| F-3.2: Client match | Rule | Matches an existing client by email, name or phone | ● Works | |
| F-3.3: Activity and event | Log | Logs "appointment booked" and "stage set" and emits `appointment.booked` | ● Works | |
| F-3.4: Invoice at booking | Hand-off | One invoice per appointment from the line items in the drawer. The toast shows the invoice number | ◐ Simulated | With no line items the invoice gets a placeholder price of 150 and the default 8 percent tax. An unknown client lands on client "c-1" (G6-E-21, G7-E-10). Decision needed: D-72 |
| F-3.5: Prepaid deposit | Rule | The service's deposit type and amount are not used. The invoice is for the full price | ○ Not built | (G6-E-20). Decision needed: D-64 |
| F-3.6: Payment before confirmation | Rule | No payment is taken before the booking is saved | ○ Not built | Decision needed: D-64 |

#### 3. Worked example
Meera books a prepaid consultation.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Service is prepaid | Picks the service | **Invoice generation is switched on** |
| 2 | She saves | Presses **Book Appointment** | **A toast names the new invoice. The appointment is in the first stage of its workflow** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Billing Specialist | When a prepaid service is booked, I want the invoice created at once, so that payment can be collected. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a booking with the invoice option on, **then** one invoice is created and its number is in the toast. |
| F-3-2 | **Given** a booking with no line items, **then** the invoice has a 150 placeholder line and 8 percent tax. |
| F-3-3 | **Given** a booking, **then** it enters the initial stage of the workflow chosen by rule, service or drawer. |

### F-4: Reschedule, cancel and status changes

#### 1. What it does
Meera reschedules from a row: the same drawer opens in **Save Changes** mode. Only the new date, time and a note are saved. If Sarah cancels, the row action runs at once with no confirmation. Status becomes cancelled, the reason goes into the notes, an event is emitted and the linked invoice is voided. The default workflow has no Cancelled stage, so the stage does not change.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Reschedule | Action | Saves new date, time and note. Appends the note, logs "rescheduled (was ...)" and emits `appointment.rescheduled` | ◐ Simulated | Service, location or provider changes in the drawer are dropped (G6-E-22). Decision needed: D-117 |
| F-4.2: Cancel | Action | Sets status cancelled, adds the reason to notes, logs activity, emits `appointment.cancelled`, voids the linked invoice | ◐ Simulated | The invoice is voided even when paid and no refund is recorded (G6-E-23). No confirmation (G6-E-06). Decision needed: D-65 |
| F-4.3: Complete | Action | Moves to the stage chosen by a completion rule, else the completed or final stage. Logs and emits `appointment.completed` | ● Works | |
| F-4.4: No-show | Action | Status and stage become no-show. Logs and emits `appointment.no_show`. Invoice untouched | ● Works | No fee. Decision needed: D-65 |
| F-4.5: Check-in | Action | Records the check-in time and emits `appointment.checked_in` | ◐ Simulated | Status does not change, and the List and Calendar never show the time (G6-E-07). Decision needed: D-122 |
| F-4.6: Move to stage | Action | Sets the stage. Status becomes completed or cancelled only for those categories, every other stage sets "scheduled" | ◐ Simulated | Stage and status drift apart (G6-E-04). Decision needed: D-114 |
| F-4.7: Reminder stage | Rule | Entering the Reminder stage runs a WhatsApp step | ◐ Simulated | No time-based schedule. Decision needed: D-120 |
| F-4.8: Reschedule notification | Rule | No automatic message to the patient | ○ Not built | Decision needed: D-128 |

#### 3. Worked example
Sarah cancels a prepaid visit.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah had paid by portal | Meera cancels the row | **Status is cancelled at once with no confirmation** |
| 2 | Daniel opens Invoice | Looks for the invoice | **It is void. The payment stays and no refund is recorded** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-desk Staff | When a visit changes, I want one place to update it, so that billing and automations stay in step. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a cancel, **then** the status is cancelled, the invoice is voided whether or not it is paid, and the stage is unchanged. |
| F-4-2 | **Given** a reschedule, **then** only date, time and note are saved. |
| F-4-3 | **Given** a check-in, **then** only the check-in time is stored and the status is unchanged. |
| F-4-4 | **Given** each lifecycle action, **then** an activity entry and an event are produced. |

### F-5: Appointment detail drawer

#### 1. What it does
Meera clicks an appointment id. A drawer opens with a stage ribbon and the tabs **Overview**, **Documents**, **Invoices** and **Calls**. Clicking a stage moves the appointment there. Overview has editable sections, an activity feed and an AI Scribe fill. Changing the date or time reschedules at once.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Stage ribbon | Control | Click a stage to move the appointment there | ◐ Simulated | Same drift as F-4.6 (G6-E-04) |
| F-5.2: Overview edits | Sections | Notes, name, email and phone are saved. Date and time reschedule immediately | ◐ Simulated | No slot, day-off or conflict check (G6-E-24) |
| F-5.3: Activity feed and AI Scribe | Timeline, action | Shows activity. Scribe fills the notes | ● Works | |
| F-5.4: Documents | Tab | The shared documents tab | ● Works | |
| F-5.5: Invoices tab | Tab | Search, status filter, create invoice (needs an invoice automation), view, record payment. KPIs: Total Invoiced is non-void totals, Paid is paid totals, Outstanding is sent, viewed and overdue totals | ◐ Simulated | Includes any invoice whose client name matches, so a same-name patient's invoices appear (G6-E-26) |
| F-5.6: Calls tab | Tab | The client's call logs | ◐ Simulated | With no calls it shows two made-up completed calls (G6-E-25) |
| F-5.7: Complete, No-show, Cancel, Reschedule buttons | Buttons | The drawer receives the handlers but has no control that calls them | ○ Not built | (G6-E-27) |

#### 3. Worked example
Meera opens a detail drawer for a new client.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Client has no call logs | Opens **Calls** | **Two invented completed calls are listed** |
| 2 | She edits the time | Changes the time on **Overview** | **The appointment moves at once with no availability check** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Front-desk Staff | When a patient asks about a visit, I want its stage, notes, invoices and calls in one place, so that I can answer at once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** a client with no call logs, **when** Calls opens, **then** two invented calls show. |
| F-5-2 | **Given** a date edit on Overview, **then** the appointment is rescheduled with no check. |
| F-5-3 | **Given** the drawer, **then** it has no Complete, No-show or Cancel button. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Schedule Appointment drawer | F-1.1 – F-1.10 | ● / ◐ / ○ | Four sections work; slot not required, 60 minutes, fixed source. |
| F-2 | Slots and conflicts | F-2.1 – F-2.7 | ● / ◐ / ○ | Seats work; conflict check catches identical starts only. |
| F-3 | Workflow, invoice, prepaid | F-3.1 – F-3.6 | ● / ◐ / ○ | Routing works; placeholder invoice lines; no deposit. |
| F-4 | Reschedule, cancel, status | F-4.1 – F-4.8 | ● / ◐ / ○ | Cancel voids a paid invoice; reschedule keeps date and time only. |
| F-5 | Detail drawer | F-5.1 – F-5.7 | ● / ◐ / ○ | Tabs work; invented calls; no action buttons. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front-desk Staff | Pick service, place, person and time in one drawer | F-1 |
| 2 | Practice Manager | One set of booking rules for every channel | F-2 |
| 3 | Billing Specialist | Get the invoice created when a prepaid service is booked | F-3 |
| 4 | Front-desk Staff | Update a visit in one place | F-4 |
| 5 | Front-desk Staff | See stage, notes, invoices and calls in one place | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Book for any provider, reschedule, cancel any appointment, move stages, see every provider's appointments and invoices | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The provider-only view (own appointments only) exists as a fixed internal value that cannot be turned on (G6-E-28). The earlier Appointments PRDs name no roles for booking. Decision needed: D-20.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Seats left | Service-mode slot | Seats (location override, else service maximum, else 1) minus overlapping non-cancelled service-mode bookings |
| Total Invoiced | Detail drawer, Invoices tab | Sum of totals of non-void invoices |
| Paid | Detail drawer, Invoices tab | Sum of totals of paid invoices |
| Outstanding | Detail drawer, Invoices tab | Sum of totals of sent, viewed and overdue invoices |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Call → Receptionist → **Appointment** → Scribe → Invoice → Claim | Booking | Saves with 60 minutes and source "Inbound Call". Creates one invoice with placeholder price, client and tax when no lines are passed. |
| | Appointment to Scribe | Scribe replaces the appointment's notes with its summary. |
| Kiosk check-in → **Appointment** → Billing | Check-in | Records a check-in time only. The status does not change. |
| Patient portal ↔ **Appointments** / Invoices | Portal booking | Saved with no conflict check. A prepaid booking asks for an invoice with a placeholder line. |
| | Staff cancels a prepaid appointment | The invoice is voided even when paid. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-114 | What is the canonical appointment status list, and should the default workflow have a Cancelled stage? | Naming note, F-4.6, F-5.1 |
| D-116 | Rooms: keep auto-allocation, add a manual override, or both? | F-1.5 |
| D-20 | Which roles may see other providers' appointments, book for others and cancel? | F-1.10 |
| D-119 | Which booking sources can staff choose? | F-1.7 |
| D-118 | Buffers, slot step, shift cap and partial days off: what are the rules? | F-2.1, F-2.7 |
| D-117 | Is overlap the conflict rule, can staff override, and may reschedule change provider, service or location? | F-2.4, F-4.1 |
| D-72 | Should invoice creation be gated by an invoice automation, and should portal bookings follow the setting? | F-3.4 |
| D-64 | Prepaid: invoice the full price or the deposit, and must payment come before confirmation? | F-3.5, F-3.6 |
| D-65 | What happens on cancelling a paid appointment, and does a no-show create a fee? | F-4.2, F-4.4 |
| D-122 | Should check-in set the status to Arrived? | F-4.5 |
| D-120 | Is a time-based reminder required? | F-4.7 |
| D-128 | Is a reschedule notification automatic, opt-in or automation-only? | F-4.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
