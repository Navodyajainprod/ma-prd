---
title: "Active Visit & Live Queue Tracker"
product: "ai-receptionist"
module: "my-visit"
channel: "tracker"
route: "/reception/my-visit"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | MY VISIT: ACTIVE VISIT AND QUEUE TRACKER (`/reception/my-visit`) |
| Route | `/reception/my-visit` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A kiosk card that shows a queue ticket: token, station, status, an estimated wait and directions. When no ticket exists it says so and offers Check-in. |
| **Who uses it** | Patient (at the lobby kiosk). Front-desk Staff (move tickets from the client profile). The kiosk asks no one who they are before it shows a ticket. |
| **Where you start it** | The **My Visit** button on the kiosk dock, or by asking Aria to check the queue. |
| **Where the result goes** | Nowhere. It only displays. Staff buttons on the client profile change the tickets it reads. |
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
| Client (Clients) | Send to Pharmacy and Complete Visit | The client profile has a visit card with **Send to Pharmacy** and **Complete Visit**. They change the queue tickets the kiosk reads. The kiosk does not subscribe, so it shows the change the next time My Visit is opened. | [View Clients](/client/clients) |
| Client (Appointments) | Today's visits | Kiosk tickets are not linked to the appointment calendar. Check-in does not mark the appointment Arrived (XM-02). | [View Appointments](/client/appointments/list) |
| Companion | Queue status on the phone | Not connected from this screen. The kiosk tracker and Companion Today do not share a live queue number. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson checked in at 10:15 and stepped out for a coffee. Back in the lobby she taps **My Visit** on the dock. Aria says she is checking the visit status. The kiosk does not ask who she is. It looks at the clinic's stations, takes the first station that has a queue and shows its first ticket. The **Active Clinic Visit** card appears with a token, the station, a status and an estimated wait. Sarah reads it and taps **Close Visit Tracker**. If the queue is empty she sees **No Active Token Today** and a **Go to Check-in** button. Meera Iyer, at the desk, can press **Send to Pharmacy** on a client's profile. That moves the ticket, but a visitor sees it only after reopening My Visit.

### What is real and what is not

- **Real in the prototype:** the card with token, station, status, wait and directions, the empty state with Go to Check-in, and the staff buttons that move tickets.
- **Simulated:** which ticket appears (the first of the first non-empty station, not the visitor's own), and the wait, which is the value saved at check-in or a default of 5 minutes.
- **Not built:** an identity check before the card, ticket priority (In Service, then Waiting, then Completed), Currently Serving, Patients Ahead, Send to Phone and live updates.

### Journey position

```
Check-in (token issued) ─▶ My Visit (dock) ─▶ Ticket card ─▶ Staff: Send to Pharmacy / Complete Visit
```

## 2. Feature Requests

### F-1: Open My Visit and find a ticket

#### 1. What it does
Sarah taps **My Visit**. The kiosk reads every station's queue and shows the first ticket of the first station that has one. It does not match the ticket to her. If no ticket exists, a card says **No Active Token Today** with a **Go to Check-in** button. Opening the address `/reception/my-visit` directly does not run the lookup.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: My Visit lookup | Action | Shows the first ticket of the first station with a queue | ◐ Simulated | Not tied to the visitor, so anyone sees someone else's token (G11-E-06). Decision needed: D-41 |
| F-1.2: Identity check before the card | Rule | Described in the earlier PRD: verify by face or phone first | ○ Not built | The kiosk asks nothing. Decision needed: D-41 |
| F-1.3: Ticket priority | Rule | Described in the earlier PRD: In Service, then Waiting, then Completed | ○ Not built | The built order is station order (G11-I-126). Decision needed: D-123 |
| F-1.4: No Active Token Today | State | Shows the message and a **Go to Check-in** button that opens Check-In | ● Works | G11-I-134 |
| F-1.5: Direct address | Route | Opening `/reception/my-visit` shows the empty state without a lookup | ◐ Simulated | The lookup runs only from the dock or by voice |

#### 3. Worked example
Sarah returns from the cafe.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The queue has tickets | Taps **My Visit** | **A ticket card opens. It is the first ticket of the first station, not necessarily hers** |
| 2 | The queues are empty | Taps **My Visit** | **"No Active Token Today" with a Go to Check-in button** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | After I step out while waiting, I want to check how close my turn is, so that I do not interrupt the front desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** any station has a queue, **when** My Visit is tapped, **then** the first ticket of the first such station is shown, with no identity check. |
| F-1-2 | **Given** no station has a queue, **when** My Visit is tapped, **then** No Active Token Today and Go to Check-in appear. |

### F-2: The Active Clinic Visit card

#### 1. What it does
The card is headed **Active Clinic Visit** with a token pill. Below are the current station, the queue status and an estimated wait. A directions block gives the room's walking text, or "<station>. Please take a seat in the waiting area." **Close Visit Tracker** ends the session.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Token, station, status | Display | Shows the ticket's token label, station name and status | ● Works | |
| F-2.2: Estimated wait | Metric | Shows "about N min" from the value saved at check-in, or 5 | ◐ Simulated | Never recalculated. **Hardcoded, formula undefined** (G11-E-22). Decision needed: D-123 |
| F-2.3: Directions block | Display | Room walking text or a generic waiting-area sentence | ● Works | |
| F-2.4: Close Visit Tracker | Button | Clears the session and returns home | ● Works | |
| F-2.5: Currently Serving, Patients Ahead | Metric | Described in the earlier PRD | ○ Not built | Only the token screen at check-in shows placeholder values (G11-E-22). Decision needed: D-123 |
| F-2.6: Send to Phone | Action | Described in the earlier PRD | ○ Not built | |
| F-2.7: Live refresh | Rule | Described in the earlier PRD | ○ Not built | The kiosk never subscribes to queue changes (G11-I-131) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A ticket card is open | Reads it | **Token, station, status, a wait of the saved value or 5 minutes and directions. No Currently Serving or Patients Ahead** |
| 2 | Staff complete a ticket | Looks at the card | **It does not change until My Visit is opened again** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | While I wait, I want to see my token, station and wait, so that waiting feels predictable. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a ticket card is open, **then** it shows token, station, status, estimated wait and directions. It shows no Currently Serving and no Patients Ahead. |
| F-2-2 | **Given** staff move the ticket while the card is open, **then** the card does not update. |

### F-3: Staff hand-offs from the client profile

#### 1. What it does
Meera opens a client's profile and sees **Reception Visit Status** with the steps Doctor, Pharmacy and Completed. **Send to Pharmacy** moves the patient on to the next station. **Complete Visit** marks the visit completed. The kiosk reads the result the next time a visitor opens My Visit.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Send to Pharmacy | Staff action | Completes the current ticket and opens a new one at the first pharmacy or billing station | ◐ Simulated | The new ticket reuses the same token label, not a new pharmacy token such as P-014 (G11-I-132). Decision needed: D-124 |
| F-3.2: Complete Visit | Staff action | Marks the visit completed and shows a toast | ● Works | |
| F-3.3: No Show or Left recalculation | Rule | Described in the earlier PRD: waits drop for others behind | ○ Not built | The status changes, but nothing recalculates (G11-I-133). Decision needed: D-123 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The doctor has finished with Sarah | Meera presses **Send to Pharmacy** on Sarah's profile | **A new ticket opens at the pharmacy with the same token label. The kiosk shows it when My Visit is next opened** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Front-desk Staff | When a consultation ends and the patient needs medicine, I want one click to move them to the pharmacy queue, so that they are not lost. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** Send to Pharmacy is pressed, **then** the current ticket completes and a ticket at the pharmacy or billing station is created with the same token label. |
| F-3-2 | **Given** a ticket is marked No Show or Left, **then** no wait estimate on any screen is recalculated. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Open My Visit and find a ticket | F-1.1 – F-1.5 | ◐ / ○ / ● | Shows the first ticket of any visitor; no identity check; empty state works. |
| F-2 | Active Clinic Visit card | F-2.1 – F-2.7 | ● / ◐ / ○ | Token, station and directions show; wait is fixed; no Currently Serving or live refresh. |
| F-3 | Staff hand-offs | F-3.1 – F-3.3 | ◐ / ● / ○ | Buttons work; token label is reused. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Check how close my turn is without bothering staff | F-1 |
| 2 | Patient | See token, station and wait while I wait | F-2 |
| 3 | Front-desk Staff | Move a patient to the pharmacy queue in one click | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor at the kiosk | Open My Visit and read the first ticket in the clinic | Nothing. No identity is checked (G11-E-06) |
| Front-desk Staff (Meera) | Send to Pharmacy and Complete Visit from a client profile | Nothing is checked. Any signed-in user can |

The old PRD said the kiosk verifies identity by face or phone before showing the ticket. Decision needed: D-41.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Estimated Wait | My Visit card | The wait saved on the ticket at check-in, else 5 minutes. **Hardcoded, formula undefined** |
| Currently Serving, Patients Ahead | Check-in token screen only | Token minus 4 and at least 1. **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys. Its tickets are created by Check-In and read here.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-41 | What may a successful verification authorise, for how long, and is it bound to one patient? | F-1.1, F-1.2 |
| D-123 | How are Currently Serving, Patients Ahead, Estimated Wait and ticket priority defined, and do they update live? | F-1.3, F-2.2, F-2.5, F-3.3 |
| D-124 | Is the token one sequence per station per day with station prefixes? | F-3.1 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
