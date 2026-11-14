---
title: "Scheduled Check-In & Token Issuance"
product: "ai-receptionist"
module: "checkin"
channel: "scheduled"
route: "/reception/appointment"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | CHECK-IN: SCHEDULED CHECK-IN |
| Route | `/reception/appointment` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The steps after a visitor is verified: find the appointment, show a 3-card Visit Summary, confirm, and issue a queue token with directions and an SMS button. |
| **Who uses it** | Patient (the arriving visitor). Front-desk Staff expect to see the arrival. No sign-in and no role is checked. |
| **Where you start it** | After a face match and **Yes, that's me**, or after phone and code verification, on `/reception/appointment`. |
| **Where the result goes** | A queue ticket at the room's station, and the kiosk's own copy of the appointment. The clinic's appointment record is not updated. |
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
| Client (Appointments) | Appointment lookup | The kiosk reads the clinic's appointments plus its own copy. It matches by patient id, phone ending or exact name with no date or status filter, so the visitor can be shown an old, cancelled or namesake booking (G11-E-20). | [View Appointments](/client/appointments/calendar) |
| Client (Appointments) | Arrived status | Not connected. Kiosk check-in does not update the clinic's appointment record. A staff-booked appointment is never found in the kiosk's copy. A kiosk-booked one has a different id and the call fails silently. Even a matching id records only a check-in time, not the status (G11-E-42, XM-02, G6-E-07). | [View Appointments List](/client/appointments/list) |
| Client (Clients) | Timeline and audit entry | The check-in audit entry is saved only in the kiosk browser. No entry reaches the client's timeline (G11-E-13). | [View Clients](/client/clients) |
| Client (Workflows and Automation) | Check-in event | The kiosk emits check-in events, but any saved rule that fires on check-in is deleted when rules load, so nothing reacts (G8-E-11). No front-desk broadcast exists. | [View Automation](/client/automation) |
| Client (Reception settings) | Rooms and station prefixes | Doctor-to-room pairing and the queue station come from the rooms in Reception Settings. Early and late arrival windows are stored there and never enforced (G11-I-44). | [View Reception Settings](/client/settings/reception) |
| Companion | Token and queue status | No hand-off was found. A token issued at the kiosk does not appear on Companion Today. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson has an appointment with Dr. Anita Rao. She verifies by face and the kiosk finds a visit. The **Visit Summary & Room Assignment** screen shows three cards: who she is, with a masked phone number, what the appointment is, and which room and wait apply. She presses **Confirm check-in & Print Token**. A **Token Issued** screen shows a large token, the room and walking directions. She can press **SMS Pass**, which announces that a text was sent. None was. Meera Iyer looks at the calendar and sees Sarah's appointment unchanged. It does not say Arrived. Meera only learns Sarah is here from the queue.

### What is real and what is not

- **Real in the prototype:** the three summary cards with a masked phone, doctor-to-room pairing, the walk-in fallback for a patient with no appointment, and a queue ticket at the room's station.
- **Simulated:** the appointment lookup (no date or status filter, and an invented visit when none exists), the wait numbers, the token number, the token screen, the SMS pass and the audit entry.
- **Not built:** marking the clinic's appointment Arrived, double-tap protection, a WhatsApp pass, and early and late arrival rules.

**Correction (2026-11-13):** the earlier PRD promised that kiosk check-in switches the calendar slot to Arrived. The prototype does not do this.

### Journey position

```
Verified visitor ─▶ Appointment lookup ─▶ Visit Summary ─▶ Confirm ─▶ Queue ticket ─▶ Token Issued ─▶ SMS (log only)      Clinic appointment: not updated
```

## 2. Feature Requests

### F-1: Appointment lookup, room and wait

#### 1. What it does
After Sarah is verified, the kiosk looks for her appointment. It pairs the doctor with a room from the clinic's rooms and estimates a wait. If she has no appointment, it welcomes her and opens walk-in service selection instead of an error.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Same-day lookup | Rule | Finds the patient's appointment from desk, phone, web and kiosk bookings | ◐ Simulated | No filter for today or for active status, and an equal name can attach another person's booking (G11-E-20) |
| F-1.2: Doctor and room pairing | Rule | Maps the booked doctor to a room from the clinic's rooms | ● Works | Stations are rebuilt from the Rooms setting each time |
| F-1.3: Wait estimate | Metric | Ticket wait is `max(5, (waiting + 1) x 10)` minutes. The summary uses a factor of 8 | ◐ Simulated | Two rules for one number (G11-E-22). Decision needed: D-123 |
| F-1.4: Walk-in fallback | Branch | With no appointment, opens walk-in service selection | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah booked 11:00 with Dr. Rao | Verifies at the kiosk | **The kiosk finds a visit and opens the Visit Summary** |
| 2 | A registered patient has no booking | Verifies by phone | **The kiosk opens walk-in service selection** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I check in for a booked visit, I want the kiosk to find it, so that I do not repeat my details. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a verified patient, **when** the kiosk looks up appointments, **then** it does not limit the result to today or to open bookings. |
| F-1-2 | **Given** a verified patient with no appointment found, **then** walk-in service selection opens. |

### F-2: Three-card Visit Summary

#### 1. What it does
Before a token is issued, the screen **Visit Summary & Room Assignment** shows three cards. The first shows Sarah's identity with a masked phone number. The second shows the appointment. The third shows the room and the wait. A button reads **Confirm check-in & Print Token**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Three cards | Display | Identity, appointment, and room and wait | ● Works | |
| F-2.2: Masked phone | Rule | Shows a masked phone number on the identity card | ● Works | The walk-in summary shows the raw phone (G11-E-34) |
| F-2.3: Real visit data | Data | With no appointment the summary invents one: Cardiology Checkup, Dr. Rajesh Patel, a fixed token, 11:00 AM. An unknown patient id becomes a made-up client | ◐ Simulated | G11-E-21 |
| F-2.4: Confirm button | Action | **Confirm check-in & Print Token** starts check-in. It also answers by voice | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah reads the three cards | Checks name, doctor, room and wait | **She presses Confirm check-in & Print Token** |
| 2 | A visitor with no appointment reaches the summary | Reads the cards | **An invented Cardiology visit shows (G11-E-21)** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I confirm my visit, I want to see my doctor, room and wait together, so that I can catch a mix-up before I join the queue. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the summary loads, **then** three cards and **Confirm check-in & Print Token** show. |
| F-2-2 | **Given** no appointment exists, **then** the summary shows an invented appointment. |

### F-3: Confirmation, token and pass

#### 1. What it does
Sarah presses **Confirm check-in & Print Token**. The kiosk creates a journey and a queue ticket at the room's station and marks its own copy of the appointment as checked in. It then tries to check the appointment in at the clinic store, and the call is skipped or fails silently. A **Token Issued** screen shows the token, the room, directions and the wait. Buttons offer an SMS pass and a map.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Double-tap protection | Guard | The button is never disabled and no idempotency key is sent, so a double tap makes two journeys and tickets | ○ Not built | G11-E-23 |
| F-3.2: Queue ticket and journey | Action | Creates a journey and a ticket at the room's station and marks the kiosk's own copy checked in | ● Works | |
| F-3.3: Audit entry | Log | Writes an audit entry for the check-in | ◐ Simulated | Kept in the kiosk browser only (G11-E-13). Decision needed: D-42 |
| F-3.4: Check-in event | Event | Emits check-in events | ◐ Simulated | Check-in rules are deleted when rules load, so nothing reacts (G8-E-11) |
| F-3.5: Arrived in the clinic record | Sync | The earlier PRD said the clinic appointment becomes Arrived with its token | ○ Not built | The kiosk does not update the clinic's appointment record (G11-E-42, XM-02, G6-E-07). Decision needed: D-122 |
| F-3.6: Token number | Rule | "D-" plus the count of all reception appointments plus 1. Not per station or per day | ◐ Simulated | G11-E-24. Decision needed: D-124 |
| F-3.7: Token Issued screen | Display | Shows the token, room, directions, wait and a map button | ◐ Simulated | Currently Serving, Patients Ahead and the wait are placeholders (G11-E-22). Decision needed: D-123 |
| F-3.8: SMS pass | Action | Announces that a pass was sent | ◐ Simulated | Only a console line is written. With no phone it falls back to fixed numbers (G11-E-25) |
| F-3.9: WhatsApp pass | Action | Only SMS exists | ○ Not built | |
| F-3.10: Early and late arrival rules | Rule | Settings hold the windows. Check-in never enforces them | ○ Not built | Decision needed: D-122 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah confirms her visit | Presses **Confirm check-in & Print Token** | **A token shows with the room and directions. The clinic calendar still shows her appointment unchanged** |
| 2 | Sarah presses the button twice | Double-taps | **Two tickets can be created** |
| 3 | Sarah asks for the SMS pass | Presses **SMS Pass** | **The screen says it was sent. No text message goes out** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Front-desk Staff | When a patient checks in at the kiosk, I want the calendar to show them Arrived with their token, so that I do not ask who is waiting. |
| F-3-J2 | Patient | When my token is issued, I want a copy on my phone and the walking directions, so that I know my number and where to sit. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** **Confirm check-in & Print Token** is pressed, **then** a queue ticket is issued at the room's station and the Token Issued screen shows. |
| F-3-2 | **Given** the button is pressed twice quickly, **then** two tickets can be issued. |
| F-3-3 | **Given** a check-in, **then** the clinic's appointment record is not changed and no Arrived status shows. |
| F-3-4 | **Given** **SMS Pass** is pressed, **then** a confirmation shows and no message is delivered. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Appointment lookup, room and wait | F-1.1 – F-1.4 | ● / ◐ | Room pairing and walk-in fallback work; the lookup is unfiltered. |
| F-2 | Three-card Visit Summary | F-2.1 – F-2.4 | ● / ◐ | Cards work; an invented visit shows when none exists. |
| F-3 | Confirmation, token and pass | F-3.1 – F-3.10 | ● / ◐ / ○ | Ticket is issued; Arrived, double-tap and WhatsApp are not built. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Have the kiosk find my booked visit | F-1 |
| 2 | Patient | See doctor, room and wait together | F-2 |
| 3 | Front-desk Staff | See patients marked Arrived with a token | F-3 |
| 4 | Patient | Get my token on my phone with directions | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor with the kiosk URL | Check in and receive a token for a patient found by the lookup | Nothing |
| Front-desk Staff | Nothing here. They see no arrival in the calendar | Not applicable |

The earlier PRD named the patient and the front desk and no access rule. Decision needed: D-41.

## 5. Metrics and definitions

| Metric | Formula |
| :--- | :--- |
| Ticket wait | `max(5, (waiting + 1) x 10)` minutes. The visit summary uses a factor of 8 instead of 10 |
| Currently Serving, Patients Ahead and Estimated Wait on the Token Issued screen | **Hardcoded, formula undefined** (G11-E-22) |
| Token number | "D-" plus the count of all reception appointments plus 1 |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → Billing | Find the appointment (2.2) | No date or status filter; an invented visit can show. |
| | Confirm check-in (2.3) | Token and ticket are made; invented summary when no appointment. |
| | Mark the appointment (2.4) | Not connected. The clinic's record is not updated. |
| | Audit and timeline (2.5) | Audit stays in the kiosk browser. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-122 | Should kiosk check-in set the appointment to Arrived, and should it enforce early and late arrival windows? | F-3.5, F-3.10 |
| D-123 | How are Currently Serving, Patients Ahead and Estimated Wait defined? | F-1.3, F-3.7 |
| D-124 | Is the token one sequence per station per day with prefixes from settings? | F-3.6 |
| D-42 | Which events must be audited, and where is the log kept? | F-3.3 |
| D-41 | What may a successful verification authorise? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
