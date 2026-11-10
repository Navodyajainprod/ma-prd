---
title: "My Visit & Real-Time Queue Status Monitor"
product: "ai-receptionist"
module: "my-visit"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | MY-VISIT |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Queue Call & Complete Events | When the provider clicks 'Call Next' or 'Mark Complete' in Client, the kiosk queue display immediately updates the current serving token in real time. | [View in Client](/client/overview) |

## 1. Module Summary
- The My Visit module displays the patient's active queue position, current serving ticket, estimated wait time, attending provider details, and stage progression. It allows waiting patients to re-check their status at any kiosk terminal by tapping their token or entering their phone number.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Live Queue Monitor & Ticket Tracking Card
#### 1. What it does
Presents a prominent, high-contrast display of the patient's issued ticket (e.g. 'D-042') alongside the token currently inside the consultation room ('Now Serving: D-038'). Highlights queue differential (e.g. '4 patients ahead') and updates dynamically. To confirm: How frequently should the kiosk queue poll the backend WebSocket server for ticket position updates (e.g. 3-second heartbeat vs real-time SSE)?

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Active Patient Token Badge | Hero Badge | Large high-visibility badge showing patient's assigned token number | Pulsing border when next |
| F-1.2: Current Serving Token Indicator | Status Card | Real-time indicator showing token currently in doctor's office | Audible chime on change |
| F-1.3: Patients Ahead Counter | Count Metric | Displays exact number of patients in queue ahead of current ticket | Calculates dynamic wait |
| F-1.4: Estimated Wait Time Countdown | Timer Display | Projected wait time in minutes based on provider average consultation duration | Updates dynamically |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient checks kiosk screen in waiting area | Taps 'Track My Visit' and enters token 'D-042' | **Screen shows: 'Now Serving D-040 | 1 patient ahead | Est. wait: 6 minutes'** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Waiting Patient | While in the waiting room, I want to see how many people are ahead of me, so that I know when to approach the doctor's door. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | When doctor advances queue, screen updates within 2 seconds without page refresh. |
| F-1-2 | When patient's token is called, display turns green and sounds an arrival chime. |

### F-2: Multi-Stage Journey Progress Tracker
#### 1. What it does
Tracks the patient across their complete clinical visit journey: Check-In -> Vitals / Triage -> Doctor Consultation -> Diagnostic Tests -> Pharmacy / Billing -> Discharge. Displays completed stages and highlights the current pending station.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Multi-Step Clinical Stepper | Horizontal Stepper | Visual progress bar showing past, active, and upcoming journey milestones | Completed steps checked |
| F-2.2: Next Station Guidance Card | Action Card | Directs patient to their next destination once consultation finishes (e.g. 'Proceed to Pharmacy Counter A') | Includes room wing |
| F-2.3: Re-Send SMS Update Button | Button | Allows patient to trigger an updated SMS alert with their latest queue position | Delivered in seconds |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor completes consultation and orders lab work | Patient checks kiosk monitor | **Stepper shows Doctor Consultation as 'Done' and activates 'Diagnostic Lab 1' as next station** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | After seeing the doctor, I want to know where to go next for my tests, so that I don't leave without completing my visit. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Journey stepper automatically highlights the active station linked to patient's journey ID. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Live Queue Monitor & Ticket Tracking Card | F-1.1, F-1.2, F-1.3, F-1.4 | Presents a prominent, high-contrast display of the patient's issued ticket (e. |
| F-2 | Multi-Stage Journey Progress Tracker | F-2.1, F-2.2, F-2.3 | Tracks the patient across their complete clinical visit journey: Check-In -> Vitals / Triage -> Doctor Consultation -> Diagnostic Tests -> Pharmacy / Billing -> Discharge. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Waiting Patient | While in the waiting room, I want to see how many people are ahead of me, so that I know when to approach the doctor's door. | F-1 |
| 2 | Patient | After seeing the doctor, I want to know where to go next for my tests, so that I don't leave without completing my visit. | F-2 |
