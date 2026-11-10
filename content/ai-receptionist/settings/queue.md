---
title: "Queue Taxonomy, Token Prefixes & Buffer Rules"
product: "ai-receptionist"
module: "settings"
channel: "queue"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | SETTINGS |
| Channel | QUEUE |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Global Practice Queue Policy | Queue timing buffers set here govern the appointment check-in eligibility rules enforced across Client front-desk triage and kiosk check-in. | [View in Client](/client/processes/stages) |

## 1. Module Summary
- The Queue Configuration PRD defines the operational rules governing ticket generation, early arrival check-in buffers, late arrival grace periods, aging caps, and token taxonomy across doctor rooms, labs, billing counters, and pharmacies.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Token Prefix Taxonomy & Arrival Buffer Configuration
#### 1. What it does
Configures single-letter token prefixes for clinic departments (Doctor: 'D-', Pharmacy: 'P-', Lab: 'L-', Billing: 'B-', Desk: 'R-') and sets strict timing buffer windows for patient arrivals. To confirm: When a patient arrives later than the 15-minute late grace window, should the queue manager automatically re-sequence them to the end of the line or require manual receptionist triage?

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Token Prefix Taxonomy Form | Input Grid | Configurable prefix inputs for Doctor (D-), Pharmacy (P-), Lab (L-), Billing (B-), Desk (R-) | Enforces unique single letter |
| F-1.2: Early Arrival Buffer Slider | Time Input | Configures how early a patient can check in prior to appointment (Default: 30 minutes) | Min 10m / Max 120m |
| F-1.3: Late Arrival Grace Period | Time Input | Configures grace window for delayed patients before slot forfeiture (Default: 15 minutes) | Min 5m / Max 60m |
| F-1.4: Queue Aging Cap Setting | Time Input | Configures maximum wait threshold before ticket priority automatically escalates (Default: 45m) | Prevents patient neglect |
| F-1.5: Supported Kiosk Languages | Multi-Select | Checkboxes for enabled kiosk languages (English, Hindi, Spanish, Arabic) | Controls Aria language options |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient arrives 40 minutes prior to appointment | Kiosk checks early arrival buffer (30m) | **Kiosk displays friendly message: 'Check-in opens at 2:00 PM (30 min before your appointment)'** |
| 2 | Administrator sets Doctor Prefix to 'D-' | Clicks 'Save Queue Configuration' | **All subsequent doctor consultation tickets format as D-001, D-002, etc.** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Operations Director | I want to set arrival buffers and queue prefix rules, so that our patient queue runs orderly and avoids crowded waiting areas. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Patients arriving earlier than earlyArrivalBufferMin cannot issue a token until the window opens. |
| F-1-2 | Tokens increment sequentially per department prefix and reset daily at midnight. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Token Prefix Taxonomy & Arrival Buffer Configuration | F-1.1, F-1.2, F-1.3, F-1.4, F-1.5 | Configures single-letter token prefixes for clinic departments (Doctor: 'D-', Pharmacy: 'P-', Lab: 'L-', Billing: 'B-', Desk: 'R-') and sets strict timing buffer windows for patient arrivals. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Operations Director | I want to set arrival buffers and queue prefix rules, so that our patient queue runs orderly and avoids crowded waiting areas. | F-1 |
