---
title: "Reception Kiosk Settings"
product: "client"
module: "settings"
channel: "reception"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | Client (Clinic Practice Management) |
| :--- | :--- |
| Module | Settings & Administration - Reception Kiosk |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| AI Receptionist | Clinic Stations & Stage Guidance | Rooms, station types, and provider assignments configured here power the kiosk's zone directory, doctor check-in cards, and wayfinding routes. | [View in AI Receptionist](/ai-receptionist/settings/stations) |
| AI Receptionist | Queue Rules & Intake Defaults | Token numbering prefixes, grace windows, aging caps, and onboarding process settings governed here control live kiosk queue issuance. | [View in AI Receptionist](/ai-receptionist/settings/queue) |
| AI Receptionist | Live Clinic Sync & Reliability | Every station update, queue change, and kiosk configuration saved here syncs live to waiting-room terminals without manual refresh. | [View in AI Receptionist](/ai-receptionist/settings/architecture) |
| AI Receptionist | Walk-In Registration & Booking | Newly enrolled lobby walk-ins enter whichever Default Onboarding Process is selected in Reception Kiosk Settings. | [View in AI Receptionist](/ai-receptionist/checkin/walk-in) |
| Client | Process Kanban Pipelines | Configures the care pipelines selectable inside Default Onboarding Process and tracks newly registered kiosk walk-ins. | [View in Client](/client/processes/kanban) |
| Client | Facility Availability & Services | Coordinates active clinic services and provider coverage alongside physical kiosk stations. | [View in Client](/client/services) |

## 1. Module Summary
- **Reception Kiosk Settings** inside the Client Portal's Settings area gives practice managers full control over how waiting-room AI Receptionist terminals route visitors, label queues, enforce arrival fairness, and onboard new walk-in patients.
- Instead of maintaining separate spreadsheet directories for kiosk screens, admins manage physical **Clinic Rooms & Desks**, **Token Numbering Prefixes**, **Late Arrival Window**, **Anti-Starvation Queue Aging Cap**, and **Default Onboarding Process** from one clean settings workspace that keeps lobby kiosks synchronized live.

## 2. Feature Requests

### F-1: **Clinic Rooms & Desks** Inventory (`Add Room` & `Delete Room`)
#### 1. What it does
Allows administrators to register, edit, activate/deactivate, and remove every physical destination served by waiting-room kiosks across five station categories:
- `Doctor Room`
- `Pharmacy`
- `Diagnostic Lab`
- `Billing Desk`
- `Front Desk`
Selecting **Add Room** opens a clean form requesting Station Name (required — empty submissions prompt `"Please enter a room name"`), Room Number, Station Type, Assigned Provider, and Active status. Confirming adds the station immediately (`"Room added successfully"` toast); inline edits trigger `"Room updated successfully"`; and **Delete Room** retires obsolete stations permanently.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Five Station Categories | Location Taxonomy | Classifies points of care into Doctor Room, Pharmacy, Diagnostic Lab, Billing Desk, or Front Desk | Maps rooms automatically to kiosk directories |
| F-1.2: **Add Room** & Inline Edit | Station Manager | Captures room name, number, provider assignment, and active state with validation toasts | Validates non-empty room name before save |
| F-1.3: **Delete Room** Control | Removal Action | Retires temporary desks or closed rooms from self-service visitor routing | Reflects live across active kiosks |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic adds `Pediatrics Suite 105` | Opens Client Settings -> **Reception**, clicks **Add Room**, chooses `Doctor Room`, assigns Dr. Iyer, marks Active | **Toast `"Room added successfully"` confirms; lobby kiosks immediately offer Pediatrics Suite 105 in Directions & Check-In** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When adding a new consultation suite or pharmacy counter, I want to configure it once in Client Settings, so that every lobby kiosk updates its directory immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-AC1 | Saving an empty room name inside **Add Room** surfaces `"Please enter a room name"`; valid add/edit operations surface `"Room added successfully"` / `"Room updated successfully"`. |

---

### F-2: **Token Numbering Prefixes** & Queue Fairness Sliders
#### 1. What it does
Provides self-service sliders and prefix fields governing how kiosk queue tokens are numbered and ordered:
- **Token Numbering Prefixes:** Configurable prefixes for Doctor Room (`D-`), Pharmacy (`P-`), and Diagnostic Lab (`L-`), alongside built-in Billing Desk (`B-`) and Front Desk (`R-`) series.
- **Late Arrival Window (`5–45m`, step `5`, default `15m`):** Sets how many minutes after slot start a late patient may self-check in smoothly at the kiosk alongside a `30m` early arrival buffer.
- **Anti-Starvation Queue Aging Cap (`20–90m`, step `5`, default `45m`):** Caps maximum walk-in or rescheduled wait time before aged tickets receive priority protection over fresh routine arrivals.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Department Prefixes | Prefix Inputs | Sets distinct queue prefixes (`D-`, `P-`, `L-`, `B-`, `R-`) per station family | Keeps lobby announcements unambiguous |
| F-2.2: Arrival Window Policy | Range Control | Configures late check-in tolerance (`5–45m`, def `15m`) paired with `30m` early window | Reduces unnecessary front-desk escalations |
| F-2.3: Anti-Starvation Cap | Fairness Slider | Configures max queue aging wait threshold (`20–90m`, def `45m`) | Protects waiting walk-ins during rush hours |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic shifts from a busy winter schedule to normal staffing | Adjusts **Late Arrival Window** from `25m` back to `15m` and sets **Anti-Starvation Cap** to `40m` | **Active waiting-room queues adopt updated fairness rules right away** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Operations Director | When peak hours cause walk-in queues to back up, I want an aging cap slider in settings, so that waiting patients are never pushed back indefinitely. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-AC1 | **Late Arrival Window** runs `5–45` minutes (`15m` default) and **Anti-Starvation Queue Aging Cap** runs `20–90` minutes (`45m` default), both in `5`-minute steps. |

---

### F-3: **Default Onboarding Process** Mapping
#### 1. What it does
Selects which clinical onboarding workflow automatically receives brand-new patients who register through the AI Receptionist walk-in flow. Practice managers pick from four clinic pipelines:
- `Appointment Scheduling (Default)`
- `Patient Intake`
- `Follow-up Calls`
- `Clinical Visit Journey`
Upon walk-in confirmation, the patient enters Stage 1 of that selected workflow and gains full visibility on coordinator Kanban boards and kiosk Next Step cards.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Workflow Selector | Process Picker | Assigns default pipeline from the four clinical tracks | Syncs directly with Client Processes |
| F-3.2: Stage Guidance Compatibility | Kiosk Handoff | Pairs with **Stage Portal & Reception Settings** so new patients see stage-appropriate next steps on kiosks | Zero manual desk enrollment required |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin selects `Clinical Visit Journey` | Saves setting in **Reception** settings | **Subsequent first-time walk-in visitors on `/reception/walk-in` enroll directly into `Clinical Visit Journey`** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Clinical Intake Lead | When designing intake workflows, I want kiosk walk-ins dropped directly into the active onboarding track, so that staff never re-enter kiosk demographics into our care board. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-AC1 | Setting **Default Onboarding Process** routes subsequent kiosk walk-ins into Stage 1 of the chosen process automatically. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Clinic Rooms & Desks Inventory | F-1.1 to F-1.3 | Adds, edits, toggles, and deletes physical rooms across all 5 kiosk destination categories with validation toasts. |
| F-2 | Token Numbering Prefixes & Queue Fairness Sliders | F-2.1 to F-2.3 | Tunes department prefixes (`D-`, `P-`, `L-`, `B-`, `R-`), `5–45m` late tolerance, and `20–90m` aging cap. |
| F-3 | Default Onboarding Process Mapping | F-3.1 to F-3.2 | Assigns newly registered lobby walk-ins automatically into the clinic's active intake pipeline. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Configure clinic rooms, queue prefixes, and arrival fairness rules once inside Client Settings for all kiosks. | F-1, F-2 |
| 2 | Clinical Intake Lead | Route newly self-registered kiosk walk-ins directly into Stage 1 of our active onboarding workflow. | F-3 |
