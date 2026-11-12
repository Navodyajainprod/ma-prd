---
title: "Live Clinic Sync, Duplicate Protection & Reliability"
product: "ai-receptionist"
module: "settings"
channel: "architecture"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Settings & Configuration - Live Clinic Sync, Duplicate Protection & Reliability |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Live Schedule & Arrival Sync | Kiosk check-ins and walk-in bookings flip today's clinic appointment statuses to Arrived immediately for front-desk staff. | [View in Client](/client/appointments/list) |
| Client | Real-Time Invoice Settlement | Touchless kiosk QR payments reconcile open patient invoices in Client Billing immediately with zero manual posting. | [View in Client](/client/invoices) |
| Client | Reception Settings Console | Room edits, queue thresholds, and onboarding defaults saved in Client propagate immediately across running lobby kiosks. | [View in Client](/client/settings/reception) |
| Client | Audit Trail & Activity Governance | Facial enrollments, check-ins, walk-ins, and kiosk QR settlements emit structured clinic audit entries. | [View in Client](/client/settings/audit-logs) |
| Client | Voice & Staff Alert Notifications | `"Call Staff"` lobby alerts notify receptionists and feed clinic communication logs cleanly. | [View in Client](/client/call-logs) |
| Companion | Unified Patient App Consistency | Queue numbers, visit status updates, and paid invoice receipts match across kiosk displays and the patient's mobile Companion app. | [View in Companion](/companion/today) |

## 1. Module Summary
- **Live Clinic Sync, Duplicate Protection & Reliability** ensures the AI Receptionist kiosk acts as an integrated clinical workstation rather than an isolated lobby display—keeping appointments, queues, billing, rooms, and audit trails synchronized in real time across kiosk terminals and front-desk browsers.
- Built-in safeguards protect busy shared screens against double taps, race conditions, stalled waits, and abrupt walk-aways through 24-hour duplicate-action protection, live multi-screen sync, ordered ticket advancement, and clean kiosk reset hygiene.

## 2. Feature Requests

### F-1: Unified Clinical System Sync (`CRM`, `Schedule`, `Billing`, `Facilities`)
#### 1. What it does
Every patient action taken at `/reception` reads from and writes directly into the practice's shared operational state so desk staff, clinicians, and patients see one consistent truth:
- **Patient Profiles:** Looks up verified families across stored phone records and saves newly enrolled walk-ins and optional biometric profiles right back to the clinic CRM.
- **Appointments & Arrivals:** Fetches today's bookings for verified profiles, creates new walk-in slots, and flips scheduled visits cleanly from Scheduled to Arrived.
- **Queue & Room Alignment:** Synchronizes station counts, token increments, and room directories continuously with clinic room settings.
- **Invoices & Payments:** Retrieves outstanding account balances and reconciles contactless QR settlements directly inside billing.
- **Audit Events:** Logs major milestones (biometric captures, arrivals, walk-in sign-ups, staff alerts, and payments) into clinic audit visibility.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Single Clinic Source of Truth | Sync Engine | Keeps patient CRM, schedule, billing, rooms, and workflows unified without batch delays | Prevents out-of-sync duplicate spreadsheets |
| F-1.2: Instant Multi-Screen Broadcast | Cross-Window Sync | Propagates room updates, arrivals, token progress, and payments instantaneously to open staff tabs | No manual browser refresh required |
| F-1.3: Non-Disruptive Activity Feed | Operational Notifications | Surfacing check-ins, completed payments, and `"Call Staff"` alerts cleanly to reception staff | Includes arrival time and ticket reference |

#### 3. Worked example
| # | Situation | What happens across screens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist edits `Room 104` to `Cardiology Suite` on desk workstation; patient pays a bill on kiosk | Room name updates immediately on the lobby screen; settled invoice turns Paid immediately on the desk screen | **Both kiosk and staff console remain synchronized in real time** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front-Desk Receptionist | When a visitor checks in or pays at the lobby kiosk, I want my desk schedule and billing ledger to update instantly, so that I never double-charge or call someone already checked in. |
| F-1-J2 | Clinic Owner | When expanding self-service kiosks, I want every check-in, consent, and payment tracked under one clinic system, so that operational reporting stays complete. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-AC1 | Checking in a scheduled patient, booking a walk-in, updating a station, or settling an invoice on the kiosk reflects immediately in open staff views. |

---

### F-2: 24-Hour Duplicate Action & Double-Tap Protection
#### 1. What it does
Shared lobby touchscreens often receive accidental double taps or repeat submissions when a patient taps **Confirm** twice on slow reflexes. Key actions (appointment arrival check-in, new walk-in slot booking, queue token creation, and invoice payment reconciliation) are protected by a **24-hour duplicate-action safeguard**: matching repeat requests return the already-created ticket or payment receipt cleanly rather than printing a second queue number, creating twin appointments, or recording a duplicate payment.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Check-In Double-Tap Guard | Duplicate Protection | Returns the original confirmation and queue ticket if arrival confirm fires twice | Prevents inflated waiting counts |
| F-2.2: Walk-In & Payment Guard | Transaction Safety | Prevents duplicate walk-in bookings or double payment entries over a 24-hour safety window | Shows the settled receipt instead of re-charging |

#### 3. Worked example
| # | Situation | What the visitor does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor taps **Confirm & Check In** rapidly twice before the confirmation screen finishes animating | First tap transitions status to Arrived and mints `D-008`; second tap hits duplicate safeguard | **Visitor sees single ticket `D-008` with zero duplicate queue entries in staff tools** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Elderly Visitor | When I accidentally tap a kiosk confirm button twice, I want only one check-in and one token created, so that my visit doesn't get duplicated in the clinic queue. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-AC1 | Rapid duplicate triggers of check-in, walk-in booking, or QR payment settlement produce a single ticket/receipt and prevent double-counting. |

---

### F-3: Queue State Progression & Automatic **People Ahead** Recalculation
#### 1. What it does
Coordinates clean queue movement as nurses and desk coordinators manage patient visits throughout the day:
- When staff advance an active ticket (`Waiting` -> `In Service` -> `Completed`), or mark an absent visitor as `No Show` or `Left`, remaining tickets in that station queue recalculate their `People Ahead` positions and estimated wait times automatically.
- Whenever a lobby screen opens **My Visit**, or checks status by voice, it always pulls fresh live ordering rather than stale wait estimates.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Ordered Status Lifecycle | Queue Governance | Supports `Waiting`, `In Service`, `Completed`, `No Show`, and `Left` ticket outcomes | Drives clean lobby wait transparency |
| F-3.2: Automatic Offset Recalculation | Wait-Time Math | Recomputes ahead-of-you counts immediately whenever upstream visits finish or cancel | Prevents inflated estimated wait displays |

#### 3. Worked example
| # | Situation | What staff do | Result |
| :--- | :--- | :--- | :--- |
| 1 | Three patients hold `D-005`, `D-006`, `D-007`; patient `D-005` leaves before consultation | Coordinator marks `D-005` as `Left` | **`D-006` advances immediately to "Next up" and `D-007` drops from 2 ahead to 1 ahead** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Waiting Patient | When someone ahead of me goes in with the doctor or cancels, I want my queue count to drop immediately, so that I stay close to the consultation door on time. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-AC1 | Marking any waiting ticket `Completed`, `No Show`, or `Left` reduces downstream `People Ahead` counts immediately on refreshed or synced views. |

---

### F-4: Automated Privacy Reset & Hardware Resilience
#### 1. What it does
Safeguards public waiting-room privacy and keeps unattended terminals reliable during all-day operation:
- **60-Second Activity Countdown:** Displays a visible countdown timer once any patient opens an authenticated check-in, walk-in, visit, or billing screen, extending cleanly upon touch/voice interaction and automatically wiping sensitive state back to `/reception` Welcome on expiry.
- **Voice Fallback Continuity:** If cloud speech transcription is temporarily slow (`8s` timeout) or unreachable, Aria transitions automatically to native browser speech recognition and device speech synthesis without stalling the kiosk.
- **Non-blocking Biometrics:** If camera hardware is unavailable or camera permission is declined, visitors immediately proceed with `Enter Mobile Number` without broken screens or dead ends.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Automatic Privacy Wipe | Walk-Away Hygiene | Clears active patient name, OTP session, bookings, and billing balances at `0s` | Protects subsequent lobby visitors' privacy |
| F-4.2: Speech & Camera Graceful Degradation | Fault Tolerance | Keeps touch + fallback voice working seamlessly even without camera or fast Whisper response | Zero dead-end error states |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient checks remaining `$45.00` balance, gets called into exam room, and forgets to press Start Over | Countdown finishes at `0s` and resets session cleanly | **All personal details and invoice cards clear automatically; Lobby returns to Welcome Screen for the next patient** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Healthcare Privacy Officer | When patients leave the lobby screen abruptly, I want personal and billing details wiped automatically within 60 seconds, so that stranger walk-ups never view private clinical data. |
| F-4-J2 | Clinic IT Support | When a lobby camera is unplugged or Wi-Fi briefly slows, I want visitors to smoothly complete touch/phone check-in anyway, so that the reception kiosk stays usable. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-AC1 | Letting the `60s` inactivity timer expire returns the kiosk cleanly to Welcome with zero residual patient session data. |
| F-4-AC2 | Unreachable camera or cloud speech endpoints never block manual Phone + OTP check-in, wayfinding, or billing settlement. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Unified Clinical System Sync | F-1.1 to F-1.3 | Synchronizes kiosk activity, arrivals, billing, rooms, and staff alerts live across all practice screens. |
| F-2 | 24-Hour Duplicate Action & Double-Tap Protection | F-2.1 to F-2.2 | Guards check-ins, walk-in bookings, and QR settlements against accidental double taps over a 24h window. |
| F-3 | Queue State Progression & Position Recalculation | F-3.1 to F-3.2 | Advances tickets (`Waiting` -> `In Service` -> `Completed` / `No Show` / `Left`) and recomputes People Ahead live. |
| F-4 | Automated Privacy Reset & Hardware Resilience | F-4.1 to F-4.2 | Wipes unattended visitor sessions at `60s` and maintains touch/speech continuity without hardware stalls. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front-Desk Receptionist | See kiosk check-ins, room changes, and QR settlements update my desk console immediately with zero manual refresh. | F-1, F-3 |
| 2 | Elderly Lobby Visitor | Tap twice accidentally or pause mid-flow without creating duplicate tickets or losing usable check-in options. | F-2, F-4 |
| 3 | Healthcare Privacy Officer | Guarantee sensitive patient info resets automatically within 60 seconds when visitors walk away from shared lobby screens. | F-4 |
