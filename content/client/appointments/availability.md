---
title: "Appointments Availability: Weekly Hours and Days Off"
product: "client"
module: "appointments"
channel: "availability"
route: "/appointments (Availability tab)"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | APPOINTMENTS |
| Route | `/appointments` (Availability tab) |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Availability** tab of Appointments. A team member picker and a location picker, with two sub-tabs: **Manage Slots** (weekly hours) and **Days Off**. Hours are set per member and per location. |
| **Who uses it** | Practice Manager (sets hours and leave). Physician (sets their own hours). No role is checked: any signed-in user can edit any member's availability. |
| **Where you start it** | **Appointments** in the sidebar (`/appointments`), then the **Availability** tab. |
| **Where the result goes** | The booking drawer's specialist slots (staff) and the patient portal's provider slots. Nothing else reads it. |
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
| Client (Settings) | Locations, hours and closures | A member's hours are limited to the location's weekly hours, set per location on the Organization drawer Availability tab. A closed day cannot be switched on. The drawer no longer has a control to add location closures. | [View Organization Settings](/client/settings/organization) |
| Client (Settings) | Team members | The member picker lists the team. | [View Team Settings](/client/settings/team) |
| Companion | Provider slots | The portal's specialist slots use the same hours and days off. Service mode ignores provider hours by design. | [View Companion Appointments](/companion/appointments) |
| Client (Appointments) | Booking drawer | In specialist mode, slots start from the provider's first shift for that location and step by the service duration. | [View Appointments List](/client/appointments/list) |

## 1. Module Summary

### The story in one minute

Asha Verma opens **Appointments** and switches to the **Availability** tab. She picks Dr. Anita Rao and the Main Clinic. The week shows Monday to Friday, 09:00 to 17:00, copied from the clinic's hours. Dr. Rao works Tuesday afternoons elsewhere, so Asha turns Tuesday off. Saturday is closed at the clinic, and turning it on shows an error. She presses **Save Availability** and a success message appears. On the **Days Off** sub-tab she adds a leave range for December and saves. Meera Iyer then books Dr. Rao for a Wednesday and sees slots only inside her hours. Asha also adds a second shift on Thursday and later finds that booking offers only the first shift.

### What is real and what is not

- **Real in the prototype:** the per-member, per-location weekly schedule, day toggles, shifts with no cap, clamping to location hours, the overlap check across a member's locations on save, the active switch per location, single-day days off and their removal.
- **Simulated:** booking uses only the first shift of a day, inverted shifts save, day-off ranges and "Repeat yearly" are stored as text and never block anything, a partial day off becomes a half day, and a hidden override treats some providers as working on disabled days.
- **Not built:** pre-visit and post-visit buffers, slot quantisation to fixed marks, lunch-break shading on the calendar, and a cap of 3 shifts.

### Journey position

```
Location hours ─▶ Member weekly hours + Days Off ─▶ Specialist slots ─┬▶ Staff booking drawer
                                                                      └▶ Patient portal booking
```

## 2. Feature Requests

### F-1: Weekly hours per member and location

#### 1. What it does
Asha picks a team member and a location. Each pair has its own weekly schedule. The default copies the location's hours, Monday to Friday 09:00 to 17:00. She turns days on or off, sets start and end times and adds or removes shifts for a split day. Times come from 30-minute options between 06:00 and 22:00. A start before the location opens, or an end after it closes, is pulled back to the location's hours with an info toast. **Save Availability** checks the member's other locations for overlapping shifts and blocks the save with an error naming the overlap. A per-member "active at location" switch sits in the location bar. Decision needed: D-118, D-20.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Member and location pickers | Dropdowns | Choose whose schedule and at which location | ● Works | (G6-A-01) |
| F-1.2: Active at location | Switch | Marks the member active or inactive at the location | ● Works | Booking shows a notice for an inactive member (G6-A-13) |
| F-1.3: Default schedule | Rule | Copies the location's hours, Monday to Friday 09:00 to 17:00 | ● Works | |
| F-1.4: Day toggles | Switches | Turns each weekday on or off | ● Works | Turning on a day the location is closed shows an error |
| F-1.5: Shift times | Selects | Start and end from 30-minute options, 06:00 to 22:00 | ● Works | The earlier PRD said 15-minute steps (G6-A-02). Decision needed: D-118 |
| F-1.6: Clamp to location hours | Rule | A start before opening or an end after closing is pulled back with an info toast | ● Works | (G6-A-12) |
| F-1.7: Add or remove shifts | Button | Any number of shifts per day | ● Works | The earlier PRD capped it at 3 (G6-A-03). Decision needed: D-118 |
| F-1.8: End after start | Validation | Not checked | ◐ Simulated | An inverted shift saves and silently gives no slots (G6-E-10) |
| F-1.9: Save Availability with overlap check | Button | Blocks the save with an error naming an overlap with the member's shift at another location, otherwise saves and shows a success toast | ● Works | (G6-A-11) |
| F-1.10: Slots from the hours | Rule | Disabled days and times outside the hours give no specialist slots in the staff drawer or the portal | ◐ Simulated | Only the first shift of the day is used, so a second shift offers no slots (G6-E-11). Service mode ignores provider hours by design |
| F-1.11: Hidden admin override | Rule | A provider whose name contains "admin", or whose ID is 1, is treated as working on days they have disabled | ◐ Simulated | (G6-E-14) |
| F-1.12: Lunch break shading on the calendar | Display | Described in the earlier PRD | ○ Not built | The Calendar tab has no such shading (G6-A-05) |
| F-1.13: Role control | Rule | Only the member or an admin edits a schedule | ○ Not built | Any signed-in user edits anyone. Decision needed: D-20 |

#### 3. Worked example
Asha sets Dr. Rao's Tuesday at the Main Clinic.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dr. Rao and Main Clinic are picked | Sets Tuesday shifts 09:00 to 12:30 and 13:30 to 17:00 | **Both shifts are saved** |
| 2 | Meera books Dr. Rao for Tuesday | Opens the booking drawer | **Slots appear only in the morning shift. The afternoon shift offers none** |
| 3 | Dr. Rao already works Tuesday mornings at Branch B | Saves a Tuesday 09:00 shift at Main Clinic | **Save is blocked with an error naming the overlap** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Physician | When setting my clinic hours, I want to block out lunch breaks and hospital rounds, so that patients cannot book when I am unavailable. |
| F-1-J2 | Practice Manager | When a member works at several sites, I want overlapping shifts caught, so that no one is double-scheduled. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a day the location is closed, **when** the user turns it on, **then** an error is shown. |
| F-1-2 | **Given** a shift outside the location's hours, **when** it is set, **then** it is pulled back to the location's hours with an info toast. |
| F-1-3 | **Given** a shift that overlaps the member's shift at another location, **when** Save Availability is pressed, **then** the save is blocked with an error naming the overlap. |
| F-1-4 | **Given** a shift whose end is before its start, **when** saved, **then** it saves without an error and gives no slots. |
| F-1-5 | **Given** a day with two shifts, **when** a specialist is booked, **then** slots come from the first shift only. |
| F-1-6 | **Given** a disabled day, **when** a specialist is booked in the staff drawer or the portal, **then** no slots are offered, except for a provider matched by the hidden admin override. |

### F-2: Days off

#### 1. What it does
On the **Days Off** sub-tab Asha records a member's absence. She adds a start date, an optional end date, a time window, a reason and **Repeat yearly**. The start date is required and duplicates are rejected. The time window becomes **All Day**, **Morning (Until 1 PM)** or **Afternoon (After 1 PM)**. A full-day off on a single date stops specialist slots on that date and the drawer shows the reason. Removing a day off runs with no confirmation. A range is saved as the text "A to B" and booking matches only the exact date. Decision needed: D-118.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Add a day off | Form | Start date required, duplicates rejected, **Save Day Off** | ● Works | (G6-A-08) |
| F-2.2: Single full-day off | Rule | No specialist slots on that date, with the reason shown in the booking drawer | ● Works | |
| F-2.3: Date range | Date inputs | Optional end date | ◐ Simulated | Saved as text "A to B", so ranges never block anything (G6-E-12) |
| F-2.4: Repeat yearly | Checkbox | Saved only as text in the reason | ◐ Simulated | Never applied (G6-E-12) |
| F-2.5: Time window | Select | All Day, Morning (Until 1 PM) or Afternoon (After 1 PM) | ◐ Simulated | A one-hour absence blocks half a day, or the wrong half (G6-E-13). Decision needed: D-118 |
| F-2.6: Reason | Text | Optional | ● Works | |
| F-2.7: Remove | Action | Deletes the day off | ● Works | No confirmation |
| F-2.8: Confirmation before remove | Rule | Ask before deleting | ○ Not built | |
| F-2.9: Holiday blackouts | Rule | Named in the earlier PRD summary | ○ Not built | No holiday list exists. Days off are per member |

#### 3. Worked example
Asha records Dr. Rao's leave of 20 to 22 December.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Days Off sub-tab is open | Enters 20 Dec as start, 22 Dec as end, ticks nothing else, presses **Save Day Off** | **The day off is saved as the text "20 Dec to 22 Dec"** |
| 2 | Meera books Dr. Rao for 21 December | Opens the booking drawer | **Slots are still offered. Only an exact single date blocks** |
| 3 | Asha adds 20 December alone | Saves it | **No slots are offered on 20 December and the drawer shows the reason** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When staff take leave, I want their calendar blocked, so that no one is booked by mistake. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a day off without a start date, **when** saved, **then** it is rejected. A duplicate is also rejected. |
| F-2-2 | **Given** a single full-day off, **then** no specialist slots are offered that date. |
| F-2-3 | **Given** a day-off range or Repeat yearly, **then** no other date is blocked. |
| F-2-4 | **Given** Remove, **when** pressed, **then** the day off is deleted at once. |

### F-3: Buffers and slot rules

#### 1. What it does
The earlier PRD promised buffers before and after a visit and slots that snap to fixed marks. None is built. Slots are generated by stepping through the shift by the service duration, so a 45-minute service gives 09:00, 09:45 and 10:30. Slots are also limited by the location's hours and closures. Back-to-back slots are offered. Decision needed: D-118.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Slots step by service duration | Rule | Slots start at the shift start and step by the service duration | ● Works | Not fixed :00, :15, :30, :45 marks (G6-A-07). Decision needed: D-118 |
| F-3.2: Location hours and closures | Rule | A location closure, or a day the location is closed, gives no slots and a reason | ● Works | (G6-A-12). The Organization drawer no longer offers a way to add a location closure, so only closures saved earlier apply |
| F-3.3: Pre-visit buffer | Dropdown | 0, 5, 10 or 15 minutes before a visit | ○ Not built | (G6-A-06). Decision needed: D-118 |
| F-3.4: Post-visit buffer | Dropdown | 0, 5, 10, 15 or 30 minutes after a visit | ○ Not built | Back-to-back slots are generated (G6-A-06) |
| F-3.5: Slot quantisation interval | Dropdown | Round slot starts to :00, :15, :30, :45 | ○ Not built | (G6-A-07) |

#### 3. Worked example
The clinic wants 10 minutes after each visit for room cleaning.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Looks for a buffer setting | Opens the Availability tab | **No buffer setting exists** |
| 2 | A 30-minute visit is booked at 10:00 | Opens the booking drawer for the same provider | **10:30 is offered at once, with no buffer** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When configuring appointment slots, I want automated sanitization buffers, so that providers have time to clean exam rooms between patients. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a 45-minute service and a shift from 09:00, **then** slots start at 09:00, 09:45 and 10:30. |
| F-3-2 | **Given** a booked visit, **then** the next slot is offered straight after it. No buffer is applied. |
| F-3-3 | **Given** a location closure, **then** no slots are offered at that location on that day. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Weekly hours per member and location | F-1.1 – F-1.13 | ● / ◐ / ○ | Hours, clamping and overlap check work; second shift ignored; no lunch shading. |
| F-2 | Days off | F-2.1 – F-2.9 | ● / ◐ / ○ | Single days block; ranges and yearly repeat do not. |
| F-3 | Buffers and slot rules | F-3.1 – F-3.5 | ● / ○ | Slots step by service duration; buffers and snapping absent. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Physician | Block out lunch and rounds so no one books me | F-1 |
| 2 | Practice Manager | Catch overlapping shifts across sites | F-1 |
| 3 | Practice Manager | Block calendars during leave | F-2 |
| 4 | Practice Manager | Add automatic sanitization buffers | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Edit any member's hours and days off at any location | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named Doctor and Practice Manager and set no permissions. Decision needed: D-20.

## 5. Metrics and definitions

No metric is shown on the Availability tab.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal ↔ **Appointments** and Invoices | Patient picks a provider slot | The portal uses the same specialist hours and days off, in its own copy of the slot logic. No conflict check at save. |
| Call → Receptionist → **Appointment** → Scribe → Invoice → Claim | Staff or rule books an appointment | Staff specialist slots follow these hours. A rule or kiosk booking skips the slot check. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-118 | Are buffers per provider, service or location; do slots step by duration or fixed marks; keep a cap of 3 shifts; are partial days off stored as time windows; 15 or 30-minute pickers? | F-1.5, F-1.7, F-2.5, F-3.1, F-3.3, F-3.4, F-3.5 |
| D-20 | Which roles may edit availability and see other providers? | F-1.13 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
