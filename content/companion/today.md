---
title: "Today's Visit Agenda, Live Queue & Doctor ETA"
product: "companion"
module: "today"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | COMPANION |
| Module | TODAY |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Patient Arrival Synchronization | When the patient taps 'I Have Arrived' on their Today visit card, the appointment updates to 'Arrived' on the clinic's appointments schedule in Client. | [View in Client](/client/appointments/list) |

## 1. Module Summary
- The Today tab serves as the patient's personal appointment command center on visit day. It displays their upcoming consultation time, attending physician details, live queue ticket number, current serving token, and clear consultation room wayfinding directions.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Patient Daily Visit Card & Doctor ETA Tracker
#### 1. What it does
Displays today's appointment card with appointment time, attending doctor name, clinic address, and dynamic estimated wait time.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Appointment Header Card | UI Card | Shows Doctor Avatar, Doctor Name, Specialty, Clinic Suite, and Scheduled Time | Highlighted in blue |
| F-1.2: One-Tap 'I Have Arrived' Button | Button | Allows patient to confirm arrival from clinic parking lot or lobby | Activates within geofence |
| F-1.3: Doctor ETA & Wait Time Counter | Time Indicator | Displays live estimate of minutes remaining until consultation begins | Updates dynamically |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient arrives at clinic building | Opens Companion app on phone and taps 'I Have Arrived' | **Appointment card confirms arrival, issues ticket 'D-104', and notifies Dr. Jenkins** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | On the day of my appointment, I want to check in from my phone, so that I don't have to wait in line at the physical reception desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Tapping 'I Have Arrived' changes status to checked-in and triggers the queue token card. |

### F-2: Real-Time Queue Position & Current Serving Ticket
#### 1. What it does
Renders the patient's queue ticket number (e.g. 'D-104') alongside the ticket currently being served (e.g. 'D-102') and how many patients are ahead in line.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Queue Ticket Display | Badge Card | Large prominent ticket badge e.g. 'D-104' with animated pulse when next in line | Clear high-contrast display |
| F-2.2: Current Serving Counter | Counter Card | Displays current ticket number being examined by the physician | Refreshes in real time |
| F-2.3: Consultation Room Wayfinding Banner | Banner | Displays clear destination instruction: 'Please proceed to Room 204 on 2nd Floor' | Shows room number |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient waits in lobby | Screen updates: 'Now Serving: D-103 (1 patient ahead)' | **Patient prepares to walk to exam room when their number is called** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | While waiting for the doctor, I want to see my queue progress, so that I know exactly when it is my turn. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | When the clinic calls the patient's token, the Companion app displays a full-screen notification with room directions. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Patient Daily Visit Card & Doctor ETA Tracker | F-1.1, F-1.2, F-1.3 | Displays today's appointment card with appointment time, attending doctor name, clinic address, and dynamic estimated wait time. |
| F-2 | Real-Time Queue Position & Current Serving Ticket | F-2.1, F-2.2, F-2.3 | Renders the patient's queue ticket number (e. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | On the day of my appointment, I want to check in from my phone, so that I don't have to wait in line at the physical reception desk. | F-1 |
| 2 | Patient | While waiting for the doctor, I want to see my queue progress, so that I know exactly when it is my turn. | F-2 |
