---
title: "Appointments Calendar: Month Grid and Day Panel"
product: "client"
module: "appointments"
channel: "calendar"
route: "/appointments (Calendar tab)"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | APPOINTMENTS |
| Route | `/appointments` (Calendar tab) |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Calendar** tab of Appointments. A month grid on the left and a **Scheduled** panel for the selected day on the right. Only the Month view exists. |
| **Who uses it** | Front-desk Staff (find a day, book, move a visit). Care Coordinator (check how busy a day is). Physician (filter to their own visits). No role is checked: every signed-in user sees every provider's appointments. |
| **Where you start it** | **Appointments** in the sidebar (`/appointments`), then the **Calendar** tab. The page opens on the **List** tab. |
| **Where the result goes** | The same appointment store as the List tab. A reschedule adds an activity entry to the client's timeline and emits an "appointment rescheduled" event for Automation. |
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
| Companion | Patient self-booking | A visit booked in the patient portal (source "MA-Client") is saved to the same store and appears on the calendar on its date. The "real-time slot locking" the earlier PRD promised is not built: no lock and no conflict check at save. | [View Companion Appointments](/companion/appointments) |
| AI Receptionist | Kiosk walk-in and kiosk booking | Kiosk bookings are also written to the appointment store and appear on the calendar. The kiosk keeps its own copy with a different id. | [View Kiosk Scheduled Check-in](/ai-receptionist/checkin/scheduled) |
| Client (Automation) | Reschedule event | Rescheduling emits an "appointment rescheduled" event. A message reaches the patient only if an automation is set up on it. | [View Automation](/client/automation) |
| Client (Invoices) | Cancelled visits | A cancelled appointment stays on the calendar with the same look as an active one. Cancelling voids the linked invoice, even a paid one. | [View Invoices](/client/invoices) |

## 1. Module Summary

### The story in one minute

Meera Iyer opens **Appointments** at the front desk and switches to the **Calendar** tab. The month grid shows today highlighted and a few appointment titles in each day. She clicks Friday. The **Scheduled** panel lists Dr. Anita Rao's visits for that day, each with a time range, the provider and the location. Sarah Johnson phones to move her 10:30 visit. Meera clicks Sarah's card and the **Reschedule** drawer opens, not a detail view. She picks a new slot and saves. An activity entry records the old time. On a quiet Monday she clicks **Book for this day** and the booking drawer opens with that date filled in. Meera cannot see providers side by side, because the Day and Week views of the earlier PRD do not exist.

### What is real and what is not

- **Real in the prototype:** the month grid with Previous, Today and Next, the day cells with "+N more", the selected-day panel with its count, the provider filter, **Book for this day**, opening Reschedule from a card, the activity entry on reschedule, and room auto-allocation in the booking drawer.
- **Simulated:** every panel badge reads "CONFIRMED" whatever the status. Dot colours follow list position, not status. End times use a duration that is always 60 minutes for staff bookings.
- **Not built:** Day and Week views, provider columns, the current-time line, slot granularity, drag-and-drop with a confirmation modal, the patient message on reschedule, manual room choice, a room double-booking warning, equipment tags and slot locking.

### Journey position

```
Booking (staff, portal, kiosk, AI rule) ─▶ Calendar day ─▶ Day panel ─▶ Reschedule drawer ─▶ Activity entry + event
```

## 2. Feature Requests

### F-1: Month grid and day panel

#### 1. What it does
Meera opens the **Calendar** tab and sees the current month. Weekday headers run across the top and today is highlighted. Each day shows up to three appointment titles and "+N more". **Previous**, **Today** and **Next** move the month. She clicks a day and the **Scheduled** panel lists that day's appointments with title, time range, provider and location. The panel header shows "N appointments" for the day after the provider filter. The provider filter in the toolbar limits both the grid and the panel. The earlier PRD described Day, Week and Month views, provider columns, a current-time line and slot granularity. Only Month is built. Decision needed: D-115.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Month grid | Grid | Weekday headers, today highlighted, up to 3 titles per day and "+N more" | ● Works | (G6-C-01) |
| F-1.2: Previous / Today / Next | Buttons | Moves the month. Today also selects today | ● Works | |
| F-1.3: Day selection | Grid cell | Clicking a day selects it and fills the day panel | ● Works | |
| F-1.4: Day panel list | Panel | Title, time range (start plus duration), provider and location for each appointment of the day | ◐ Simulated | The end time is wrong for staff bookings, because every one is saved as 60 minutes (G6-E-17) |
| F-1.5: Day count | Metric | "N appointments" = appointments on that date that pass the provider filter | ◐ Simulated | Cancelled and no-show visits are counted (G6-E-02) |
| F-1.6: Status badge | Badge | Every panel card shows "✓ CONFIRMED" | ◐ Simulated | Cancelled, completed and no-show visits also read Confirmed (G6-E-01) |
| F-1.7: Dot colours | Display | Dots are blue, green, purple and amber by list position | ◐ Simulated | Colour does not follow status (G6-E-02). Decision needed: D-116 |
| F-1.8: Provider filter | Filter | Limits the grid and panel to one provider | ● Works | The same filter as on the List tab (G6-C-05) |
| F-1.9: Empty day | State | The panel says "No appointments scheduled" and offers a book button | ● Works | |
| F-1.10: Day and Week views, provider columns | View | Described in the earlier PRD: side-by-side provider columns | ○ Not built | The view state exists but nothing renders it (G6-C-02). Decision needed: D-115 |
| F-1.11: Current-time line | Indicator | A red line tracking the wall clock | ○ Not built | (G6-C-03) |
| F-1.12: 15, 30 and 60-minute granularity | Dropdown | Slot grid selector | ○ Not built | (G6-C-04) |
| F-1.13: View remembered across sessions | Rule | The earlier PRD said the chosen view persists | ○ Not built | The page always opens on the List tab |

#### 3. Worked example
Meera checks how busy Friday is for Dr. Rao.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Month grid is open | Clicks **Friday** | **The Scheduled panel lists Friday's visits with time ranges, provider and location** |
| 2 | Wants only one doctor | Picks Dr. Anita Rao in the provider filter | **The grid and the panel show only Dr. Rao's visits** |
| 3 | A visit on that day was cancelled | Looks at the panel | **The cancelled visit still reads "CONFIRMED" and is counted** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When reviewing clinic capacity, I want to see the month at a glance and open any day, so that I can spot busy and empty days. |
| F-1-J2 | Physician | When starting my clinic day, I want to filter to my own appointments, so that I can prepare patient charts in advance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the month grid, **when** a day is clicked, **then** the panel lists that date's appointments that pass the provider filter. |
| F-1-2 | **Given** a provider filter, **when** it is set, **then** only that provider's appointments appear in the grid and the panel. |
| F-1-3 | **Given** a cancelled, completed or no-show appointment, **when** it is shown in the panel, **then** its badge still reads "CONFIRMED" and it counts toward the day total. |
| F-1-4 | **Given** the Calendar tab, **then** it offers no Day or Week view, no provider columns and no current-time line. |

### F-2: Book and move appointments from the calendar

#### 1. What it does
Meera books or moves a visit without leaving the calendar. **Book for this day** is always shown in the panel and opens the booking drawer with the date filled in. An empty day offers the same button. Clicking an appointment card opens the **Reschedule** drawer, not a detail view. In that drawer she picks a new date and slot and saves. The system appends the note, writes an activity entry "rescheduled (was ...)" and emits an "appointment rescheduled" event. Dragging a card does nothing, because drag-and-drop is not built. Decision needed: D-115, D-117.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Book for this day | Button | Opens the booking drawer with the selected date filled in | ● Works | (G6-C-06) |
| F-2.2: Appointment card to Reschedule | Click | Opens the Reschedule drawer pre-filled with the visit | ● Works | Not the detail drawer. Decision needed: D-115 (G6-C-09) |
| F-2.3: Reschedule save | Drawer | Saves the new date, time and note | ◐ Simulated | Service, location or provider edited in the drawer are silently dropped (G6-E-22). Decision needed: D-117 |
| F-2.4: Activity entry and event | Logic | "Rescheduled (was ...)" entry on the client's timeline and an "appointment rescheduled" event | ● Works | (G6-C-18) |
| F-2.5: Slot and conflict check on reschedule | Rule | Slots come from the provider's hours, days off and location | ◐ Simulated | Only a visit starting at exactly the same time blocks a slot (G6-E-15). A booking can also be saved with no valid slot (G6-E-16) |
| F-2.6: Portal bookings appear | Sync | A portal booking shows on its date | ● Works | Same store (G6-C-16) |
| F-2.7: Drag-and-drop with snapping | Interaction | Described in the earlier PRD | ○ Not built | Rescheduling is by drawer only (G6-C-13) |
| F-2.8: Reschedule confirmation modal with notify checkbox | Modal | Before-and-after times and a "notify patient" box | ○ Not built | (G6-C-14) |
| F-2.9: SMS or WhatsApp message on reschedule | Message | Described in the earlier PRD, logged in the patient thread | ○ Not built | Only the event is emitted. Decision needed: D-128 (G6-C-15) |
| F-2.10: Real-time slot locking for portal bookings | Rule | Described in the earlier PRD | ○ Not built | No lock and no check at save (G6-C-17, G6-E-19) |

#### 3. Worked example
Sarah Johnson phones to move her 10:30 visit with Dr. Rao to 11:30.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Meera has the day open | Clicks Sarah's card in the panel | **The Reschedule drawer opens, pre-filled** |
| 2 | Picks a new slot | Chooses 11:30 and presses **Save Changes** | **The visit moves to 11:30 and the timeline records the old time** |
| 3 | Sarah asks for a text confirmation | Meera looks for a notify option | **There is none. A message is sent only if an automation listens to the event** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When a patient asks for a new time, I want to reschedule from the calendar, so that the change is quick and recorded. |
| F-2-J2 | Front-desk Staff | When a day is empty, I want to book straight onto it, so that the date is already filled in. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a day in the panel, **when** the user presses Book for this day, **then** the booking drawer opens with that date. |
| F-2-2 | **Given** an appointment card, **when** it is clicked, **then** the Reschedule drawer opens. |
| F-2-3 | **Given** a saved reschedule, **then** the new date and time are stored, an activity entry records the previous ones and an event is emitted. No patient message is sent by the screen. |
| F-2-4 | **Given** a provider with a visit at 09:00, **when** the user picks 09:30 on a reschedule, **then** the slot is not blocked. Only 09:00 is. |
| F-2-5 | **Given** an appointment card, **when** it is dragged, **then** nothing happens. |

### F-3: Room allocation

#### 1. What it does
The earlier PRD had a manual room dropdown with a double-booking warning. As built, rooms are filled in for the user. When a physical location, a service and a provider are chosen in the booking drawer, an **Auto-allocated Room** box shows the room from the rooms mapping. With no match the box says "No room mapped" and booking still goes ahead. The user cannot pick a room, and the calendar does not show the room. Decision needed: D-116.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Auto-allocated room | Read-only box | Shows the room found through the service, location and provider mapping, and saves it on the appointment | ● Works | Shown only once all three are chosen (G6-C-10) |
| F-3.2: No room mapped | State | A notice when nothing matches | ● Works | Booking is still allowed |
| F-3.3: Online location | Rule | No room is allocated for an online or virtual location | ● Works | |
| F-3.4: Manual room selector with availability | Dropdown | Described in the earlier PRD | ○ Not built | Decision needed: D-116 |
| F-3.5: Room double-booking warning | Modal | Described in the earlier PRD: blocks save unless overridden | ○ Not built | No time-based room check exists (G6-C-11, G6-E-15) |
| F-3.6: Equipment tags | Tag | ECG, Dermatoscope and similar tags on the card | ○ Not built | (G6-C-12) |
| F-3.7: Room badge on the calendar card | Badge | Described in the earlier PRD | ○ Not built | The panel shows provider and location only |

#### 3. Worked example
Meera books Dr. Rao at the Main Clinic for a cataract consultation.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A room is mapped to Dr. Rao at Main Clinic | Chooses service, location and provider | **An Auto-allocated Room box appears and the room is saved with the visit** |
| 2 | Another provider is mapped to the same room at the same time | Books that provider | **No warning appears. Both visits keep the room** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When scheduling procedures, I want a room filled in and conflicts caught, so that doctors do not arrive to an occupied exam room. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a room mapped to the service, location and provider, **when** the visit is booked, **then** that room is stored. |
| F-3-2 | **Given** an online location, **then** no room is allocated. |
| F-3-3 | **Given** two visits in the same room at overlapping times, **then** no warning is raised. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Month grid and day panel | F-1.1 – F-1.13 | ● / ◐ / ○ | Month view works; badge and colours ignore status; no Day or Week view. |
| F-2 | Book and move from the calendar | F-2.1 – F-2.10 | ● / ◐ / ○ | Book-for-day and Reschedule work; drag-and-drop and patient message absent. |
| F-3 | Room allocation | F-3.1 – F-3.7 | ● / ○ | Rooms are auto-filled; no manual choice, warning or tags. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | See the month at a glance and open any day | F-1 |
| 2 | Physician | Filter to my own appointments | F-1 |
| 3 | Care Coordinator | Reschedule quickly with a record of the change | F-2 |
| 4 | Front-desk Staff | Book straight onto an empty day | F-2 |
| 5 | Practice Admin | Have the room filled in and conflicts caught | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | See every provider's appointments, filter by provider, book, reschedule | Nothing |
| Provider-only view | Exists in code with own visits only and no provider filter | Not reachable: it is a fixed internal value no screen can change (G6-E-28) |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named Practice Coordinator, Doctor, Clinic Administrator and Medical Assistant and set no permissions. Decision needed: D-20.

## 5. Metrics and definitions

- **N appointments** (day panel): the number of appointments on the selected date that pass the provider filter. Computed. It includes cancelled and no-show visits.

No other figure is shown on the Calendar tab.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Call → Receptionist → **Appointment** → Scribe → Invoice → Claim | AI or rule books an appointment | Possible only if a rule fires. Placeholder client details, no service or location, no conflict check. |
| | Staff books with the invoice option | One invoice is created. Price, tax and client fall back to placeholders. |
| Kiosk check-in → **Appointment** → Billing | Kiosk walk-in or booking | Written to the appointment store with a different id from the kiosk's own copy. |
| Patient portal ↔ **Appointments** and Invoices | Patient confirms a booking | Appears on the calendar. No conflict check or slot lock at save. |
| | Patient cancels or reschedules | No control exists in the portal. |
| | Staff cancels a prepaid visit | The linked invoice is voided even when paid. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-115 | Are Day and Week views with provider columns required for MVP, and does clicking an appointment open Details or Reschedule? | F-1.10, F-1.11, F-1.12, F-2.2 |
| D-116 | Rooms: keep auto-allocation, add manual override or both; is a room double-booking warning required; how do cancelled and no-show visits look? | F-1.7, F-3.4, F-3.5 |
| D-117 | Is overlap the conflict rule, may a reschedule change provider, service or location? | F-2.3, F-2.5 |
| D-128 | Is the reschedule notification automatic, opt-in or automation-only? | F-2.8, F-2.9 |
| D-20 | Which roles may see other providers' appointments, book for others, cancel and edit availability? | F-1.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
