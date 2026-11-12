---
title: "Active Visit & Live Queue Tracker"
product: "ai-receptionist"
module: "my-visit"
channel: "tracker"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | My Visit & Process Guidance - Active Visit & Queue Tracker (`/reception/my-visit`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Client Visit Journey Handoffs | Staff actions inside a patient's profile ("Send to Pharmacy", "Complete Visit") immediately advance the patient's active station queue and reflect live on the kiosk tracker. | [View in Client](/client/clients) |
| Client | Appointments List & Arrival Sync | Queue numbers issued and progressed across consultation, pharmacy, and lab stay synchronized with the clinic's today visit list. | [View in Client](/client/appointments/list) |
| Companion | Mobile Live Queue & Status | Patients tracking their token (`D-042`, `P-014`) on the kiosk see matching queue position and stage updates on Companion Today. | [View in Companion](/companion/today) |

## 1. Module Summary
- The **Active Visit & Live Queue Tracker** lets checked-in patients and waiting family members check their live queue position, **Currently Serving** counter number, **Patients Ahead**, and **Estimated Wait** anytime at `/reception/my-visit` via the Floating Right Dock **My Visit** button or by asking Aria aloud.
- Beyond Doctor consultation queues, the tracker stays continuously synchronized with clinical staff actions across MantraAssist — reflecting multi-station handoffs (`Doctor Room -> Pharmacy`) in real time and presenting a clear check-in call to action when no active token exists today.

## 2. Feature Requests

### F-1: Secure Visit Lookup & Live Priority Ticket Selection
#### 1. What it does
When a visitor taps **My Visit** on the Right Dock or asks *"Check my queue position"*:
- If they have already verified in the current session, **Active Clinic Visit** loads immediately showing their live ticket; otherwise, Aria verifies their identity first via Face or Phone/OTP before unlocking queue details.
- When finding today's queue record across clinic stations, the tracker prioritizes showing an **In-Service** token first, then an active **Waiting** token, and otherwise a **Completed** token from earlier in the visit.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Session-Aware Entry | Auth Guard | Loads live ticket directly within active session or prompts verification if unauthenticated | Protects waiting-room privacy |
| F-1.2: Priority Ticket Lookup | Resolution Order | Surfaces `In-Service` ahead of `Waiting` ahead of `Completed` tickets for today | Always highlights the most actionable station |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Checked-in patient returns from cafe 15 minutes later | Taps **My Visit**, verifies Phone & OTP | **Loads Active Clinic Visit card showing token `D-042` and live wait status immediately** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Waiting Patient | After stepping out briefly while waiting, I want to check how close my turn is on the kiosk without interrupting the front desk staff. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a visitor opens **My Visit** without active session verification, then the kiosk MUST verify identity before rendering active ticket details. |

---

### F-2: Live **Active Clinic Visit** Dashboard (`Currently Serving`, `Patients Ahead`, `Estimated Wait`)
#### 1. What it does
For an active ticket, **Active Clinic Visit** displays a crisp live summary card containing:
- **Patient Token Badge:** Highlighted ticket number (`D-042`) paired with live station status (`Waiting`, `In Service`, or `Completed`) and assigned room/station name (`Dr. Sharma's Consultation Room`).
- **Currently Serving Counter:** Shows whichever ticket number is currently being seen in that station (`Serving Now` — or indicates when the station is ready to call next).
- **Patients Ahead & Wait Time:** Live count of patients queued ahead plus dynamic estimated wait minutes (`at least 5 minutes`, scaling cleanly by active queue length), plus a **Send to Phone** / SMS action so visitors can carry live updates in their pocket and an easy **Back to Home** option.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Active Clinic Visit Header | Ticket Card | Displays Token label (`D-042`), status pill, and assigned room/station | Updates reactively as station queues move |
| F-2.2: Currently Serving & Ahead Metrics | Live Queue Panel | Shows token currently inside the room, number of waiting patients ahead, and estimated wait minutes | Recalculates automatically on every completion or skip |
| F-2.3: Real-Time Queue Subscription | Live Sync | Refreshes on-screen wait counts instantaneously whenever staff advance or skip tickets | No manual screen reload needed |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient checks `D-044` while `D-042` is in consultation and `D-043` is waiting | Opens **My Visit** tracker | **Screen shows Active Clinic Visit for `D-044`, Currently Serving `D-042`, `1` Patient Ahead, and `~10m` Estimated Wait** |
| 2 | Nurse finishes `D-042` and calls `D-043` | Nurse clicks Next / Complete in front desk | **Kiosk tracker immediately updates `Currently Serving: D-043` and drops `Patients Ahead` to `0`** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Waiting Patient / Family | I want to see the current token being served and exactly how many people are ahead of me, so that waiting feels transparent and predictable. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a waiting ticket sits behind `N` earlier waiting tickets at its station, then **Patients Ahead** MUST display `N` and recalculate immediately when a preceding ticket completes or skips. |

---

### F-3: Multi-Station Clinical Handoffs (`Doctor Room -> Pharmacy`) & **Complete Visit**
#### 1. What it does
Patient journeys often involve sequential stations (Consultation Room -> Pharmacy Pickup -> Billing). From the patient's profile inside MantraAssist, clinical staff tap **Send to Pharmacy** or **Complete Visit**:
- **Send to Pharmacy:** Completes the active doctor consultation ticket and automatically generates a new station ticket at the **Pharmacy** (`P-014`). Next time the patient checks **My Visit** on the kiosk (or Companion), the tracker switches smoothly to the Pharmacy token and dispensary counter directions!
- **Complete Visit:** Finalizes all remaining clinic stations and updates **Active Clinic Visit** cleanly to **Completed**.
- **No-Show / Left Handling:** If staff mark an absent waiting ticket as *No Show* or *Left*, remaining waiting visitors behind them immediately see their queue count and wait estimate drop.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Desk Handoff (`Send to Pharmacy`) | Stage Transition | Closes Doctor ticket and spawns next station token (`P-...`) automatically | Visible live across kiosk and Companion |
| F-3.2: **Complete Visit** Action | Finalization | Marks journey and active ticket Completed across clinic systems | Moves patient cleanly out of active wait queues |
| F-3.3: Exception Recalculation | Wait Fairness | Drops skipped *No Show* / *Left* tickets out of active wait counts immediately | Keeps remaining estimates honest |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor finishes seeing patient and prescribes medication | Staff taps **Send to Pharmacy** in patient profile | **`D-042` marks Completed; kiosk My Visit automatically shows new Pharmacy ticket (`P-004`) and Pharmacy directions** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator / Doctor | When a consultation wraps up and the patient needs medicine pickup, I want one click to issue their Pharmacy queue number automatically. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given staff trigger **Send to Pharmacy** on a checked-in patient, then the consultation ticket MUST complete and a Pharmacy token MUST appear in the patient's **My Visit** tracker. |

---

### F-4: Clear **No Active Token Today** Empty State & Check-In Shortcut
#### 1. What it does
If an unbooked or not-yet-checked-in patient opens **My Visit**, the screen avoids cryptic blanks and displays **No Active Token Today** with a clear message explaining no queue ticket has been issued for this session yet, paired with a prominent **Go to Check-in** button that launches Face/Phone check-in immediately.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: **No Active Token Today** Card | Empty State | Explains clearly that the patient isn't checked into an active station queue yet | Never shows broken `undefined` counters |
| F-4.2: **Go to Check-in** Shortcut | Conversion CTA | Launches unified Check-In immediately from the empty tracker | Saves returning to Home |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient taps My Visit upon arriving at clinic before checking in | Opens `/reception/my-visit` with no active ticket | **Displays "No Active Token Today" and one-tap Go to Check-in button** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Arriving Visitor | If I accidentally open Visit Tracking before checking in, I want a clear button that takes me straight to Check-In. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given a visitor opens **My Visit** with zero active tokens today, then **No Active Token Today** and a functional **Go to Check-in** button MUST appear. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Secure Lookup & Priority Ticket Resolution | F-1.1 to F-1.2 | Authenticates access and surfaces In-Service, then Waiting, then Completed station tickets. |
| F-2 | Active Clinic Visit Live Queue Card | F-2.1 to F-2.3 | Shows patient token, room name, Currently Serving number, Patients Ahead, and wait time live. |
| F-3 | Multi-Station Staff Handoffs & Skips | F-3.1 to F-3.3 | Automatically advances tickets (`Send to Pharmacy`, `Complete Visit`) and recalculates skipped queues. |
| F-4 | Empty State & Go to Check-in CTA | F-4.1 to F-4.2 | Guides un-checked visitors smoothly into Check-In via **No Active Token Today**. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Waiting Patient | Check my current station queue position, room, and wait estimate on the kiosk without bothering staff. | F-1, F-2, F-4 |
| 2 | Clinical Staff | Hand patients off seamlessly from consultation to pharmacy and keep lobby queues accurate in real time. | F-3 |
