---
title: "Queue Rules, Token Prefixes & Intake Defaults"
product: "ai-receptionist"
module: "settings"
channel: "queue"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Settings & Configuration - Queue Rules, Token Prefixes & Intake Defaults |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Reception Settings Console | Clinic managers configure grace sliders, anti-starvation caps, and onboarding defaults centrally from Reception Settings. | [View in Client](/client/settings/reception) |
| Client | Onboarding Process Pipeline | Walk-in and newly arrived patients enter whichever Default Onboarding Process is selected here on the clinic Kanban board. | [View in Client](/client/processes/kanban) |
| Client | Appointment Schedule Matching | Late Arrival Window and Early Arrival Buffer policies determine whether arriving visitors are treated as on-time check-ins or offered walk-in handling. | [View in Client](/client/appointments/list) |
| AI Receptionist | Scheduled Check-In Token Issuance | Issues station-prefixed queue tickets and validates arrival timing rules at check-in. | [View in AI Receptionist](/ai-receptionist/checkin/scheduled) |
| AI Receptionist | Active Visit & Queue Tracker | Displays prefixed tickets, calculates People Ahead counts, and honors aged-priority ordering in real time. | [View in AI Receptionist](/ai-receptionist/my-visit/tracker) |
| Companion | Mobile Queue Number Parity | Shows the exact prefixed queue token issued under clinic numbering rules inside the patient's mobile companion view. | [View in Companion](/companion/today) |

## 1. Module Summary
- **Queue Rules, Token Prefixes & Intake Defaults** configures the operational fairness rules that govern every ticket printed or displayed in the lobby: who receives which letter prefix, how early or late a scheduled patient may check in smoothly, how long older waiting tickets can wait before priority protection kicks in, and which onboarding care process automatically picks up newly registered walk-ins.
- Every parameter adjusts from clean visual sliders and selectors inside Reception Settings and governs live kiosk check-ins immediately.

## 2. Feature Requests

### F-1: Configurable **Token Numbering Prefixes** (`D-`, `P-`, `L-`, `B-`, `R-`)
#### 1. What it does
Separates waiting room flow into clear color-coded and letter-prefixed queues so patients and staff recognize destination departments at a glance:
- **Doctor Room Prefix (default `D-`):** Generates `D-001`, `D-002`, and so on for clinical consultations.
- **Pharmacy Prefix (default `P-`):** Generates `P-001`, `P-002` for medication pickup counters.
- **Diagnostic Lab Prefix (default `L-`):** Generates `L-001`, `L-002` for specimen collection and imaging desks.
- **Billing Desk (`B-`) & Front Desk (`R-`):** Supports configurable prefixes for financial counters (`B-`) and general reception triage (`R-`).
Admins can customize prefixes to match local signage, and each queue tracks clean zero-padded three-digit sequences per station type.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Core Department Prefixing | Automatic Prefixes | Applies standardized station prefixes (`D-`, `P-`, `L-`) without requiring manual configuration | Applied consistently across waiting-room displays |
| F-1.2: Extended Desk Prefixes | Station Defaults | Assigns `B-` to Billing Desk and `R-` to Front Desk tickets | Ensures every department issues distinct tokens |
| F-1.3: Sequential Ticket Formatting | Token Generator | Formats incremented daily numbers cleanly as `PREFIX-###` (e.g., `D-014`) | Matches wall displays and verbal voice announcements |

#### 3. Worked example
| # | Situation | What the system does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic keeps standard `D-`, `P-`, and `L-` defaults | Next scheduled cardiology visit gets `D-012`; lab walk-in gets `L-004` | **Patients and nurses immediately distinguish consulting room queues from lab draw lines** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Waiting Room Coordinator | When patients sit across shared lobbies, I want distinct letter prefixes per department, so that calling `L-004` never confuses neurology patients holding `D-` tokens. |
| F-1-J2 | Clinic Administrator | When tailoring signage conventions for a multi-specialty branch, I want configurable department prefixes, so that kiosk tickets match wall TV boards. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-AC1 | Token prefixes configured in Reception Settings immediately format newly issued kiosk tickets across check-in and walk-in flows. |

---

### F-2: **Late Arrival Window** & Early Buffer Fairness Controls
#### 1. What it does
Defines forgiving time windows around scheduled appointment slots so minor traffic delays never create unnecessary front-desk arguments while severe lateness routes cleanly:
- **Late Arrival Window (`5–45m`, step `5`, default `15m`):** Adjustable slider controlling how many minutes past slot start time a patient can still self-check in seamlessly on the kiosk without coordinator override.
- **Early Arrival Buffer (`30m` default):** Lets patients arriving up to 30 minutes early check into the lobby queue comfortably and appear as waiting ahead of their slot.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Late Grace Slider | Range Setting | Tunes grace tolerance from `5` to `45` minutes in `5`-minute steps (`15m` default) | Balanced for urban vs specialty clinics |
| F-2.2: Early Arrival Window | Arrival Policy | Permits self-service arrival verification up to `30` minutes prior to scheduled slot | Prevents "too early to check in" frustration |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic sets **Late Arrival Window** to `20m`; patient with `10:00 AM` slot arrives at `10:14 AM` | Arrival falls inside the `20`-minute tolerance window | **Kiosk welcomes the patient smoothly and issues their scheduled queue token** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinic Manager | When traffic delays hit morning clinics, I want an adjustable late arrival grace window, so that slightly delayed patients check in automatically without flooding the front desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-AC1 | **Late Arrival Window** slider spans `5` to `45` minutes in `5`-minute increments with `15` minutes as default. |

---

### F-3: **Anti-Starvation Queue Aging Cap** (`20–90m`, default `45m`)
#### 1. What it does
Protects walk-in or rescheduled visitors from getting pushed back indefinitely during busy hours when continuous on-time scheduled appointments keep arriving. Once a waiting visitor's wait duration approaches or exceeds the configured **Anti-Starvation Queue Aging Cap** (`20–90` minutes, step `5`, default `45m`), queue ordering prioritizes their overdue ticket so no patient is stuck waiting behind an endless stream of fresh arrivals.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Aging Cap Slider | Fairness Control | Tunes wait-time escalation cap between `20` and `90` minutes (`5`-minute steps, default `45m`) | Visible directly inside Queue & Buffer Rules |
| F-3.2: Priority Promotion | Queue Ordering | Prevents indefinite starvation of walk-ins and accommodated late arrivals | Ensures equitable lobby throughput |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Morning walk-in has waited `46` minutes under a `45m` cap while scheduled patients arrive | Ticket crosses the aging threshold | **Queue promotes the aged walk-in ahead of fresh routine arrivals so they see the next available clinician promptly** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Walk-In Patient | When clinics prioritize pre-booked appointments, I want a fair upper limit on how long I can be bumped back, so that I am eventually called in for care. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-AC1 | **Anti-Starvation Queue Aging Cap** slider spans `20` to `90` minutes in `5`-minute increments with `45` minutes as default. |

---

### F-4: **Default Onboarding Process** Assignment
#### 1. What it does
Links kiosk self-registration directly into the clinic's care workflow automation by letting managers choose a **Default Onboarding Process** from four built-in clinical tracks:
- `Appointment Scheduling (Default)`
- `Patient Intake`
- `Follow-up Calls`
- `Clinical Visit Journey`
Whenever a brand-new walk-in registers on the kiosk and confirms arrival, their newly created client record enters Stage 1 of the chosen onboarding pipeline automatically—giving coordinators instant Kanban visibility, checklist tasks, and matching stage instructions in **My Visit**.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Onboarding Track Picker | Pipeline Selector | Assigns `Appointment Scheduling (Default)`, `Patient Intake`, `Follow-up Calls`, or `Clinical Visit Journey` | Governs every walk-in patient enrollment |
| F-4.2: Automatic Enrollment | Workflow Handoff | Enrolls confirmed kiosk walk-ins into the selected process without manual desk entry | Populates team Kanban boards instantly |

#### 3. Worked example
| # | Situation | What the admin and visitor do | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic switches **Default Onboarding Process** to `Patient Intake`; walk-in completes registration | Visitor confirms booking and gets token `D-009` | **Staff Kanban board shows the new patient inside the opening stage of `Patient Intake` immediately** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-Desk Lead | When a new patient registers themselves at the lobby screen, I want them automatically placed into our clinic's intake workflow, so that nurses see all onboarding tasks immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-AC1 | Changing **Default Onboarding Process** among the four supported tracks immediately routes subsequent kiosk walk-ins into that selected workflow. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Configurable Token Numbering Prefixes | F-1.1 to F-1.3 | Separates waiting lines cleanly using `D-`, `P-`, `L-`, `B-`, and `R-` station prefixes. |
| F-2 | Late Arrival Window & Early Buffer Controls | F-2.1 to F-2.2 | Configures a `5–45m` (`15m` default) late check-in grace slider and `30m` early arrival allowance. |
| F-3 | Anti-Starvation Queue Aging Cap | F-3.1 to F-3.2 | Prevents walk-ins from waiting indefinitely via a `20–90m` (`45m` default) priority escalation cap. |
| F-4 | Default Onboarding Process Assignment | F-4.1 to F-4.2 | Routes newly registered kiosk walk-ins directly into the clinic's selected onboarding workflow. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Waiting Room Coordinator | Separate clinic queues visually with clear prefixes and accommodate slightly early or late arrivals smoothly. | F-1, F-2 |
| 2 | Walk-In Patient | Receive fair queue progression without getting bumped endlessly behind fresh scheduled visits. | F-3 |
| 3 | Front-Desk Lead | Route newly registered kiosk walk-ins straight into our clinic's default intake pipeline automatically. | F-4 |
