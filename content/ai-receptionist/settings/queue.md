---
title: "Queue Rules, Token Prefixes & Onboarding Default"
product: "ai-receptionist"
module: "settings"
channel: "queue"
route: "/settings/reception"
status: "In Review"
build_status: "Simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | SETTINGS: QUEUE RULES, TOKEN PREFIXES & ONBOARDING DEFAULT |
| Route | `/settings/reception` |
| Status | In Review |
| Build status | Simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Queue & Onboarding Rules** section of the **Kiosk & Terminals** mode of the AI Receptionist tab: two sliders, a Default Onboarding Process picker and the Save, Refresh and unsaved-changes controls. Token prefixes have no screen. |
| **Who uses it** | Practice Admin (sets the rules). Front-desk Staff and Patients meet the tokens. Only the SystemAdmin role passes the Settings guard. |
| **Where you start it** | **Settings**, then the **AI Receptionist** tab at `/settings/reception`, then the **Queue & Onboarding Rules** section. |
| **Where the result goes** | The saved configuration. The kiosk reads the onboarding default for walk-ins. The two sliders are saved but nothing reads them. |
| **How real is it** | 0 features work, 4 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Settings) | Host screen | The sliders and picker are part of the AI Receptionist tab. Terminals and kiosk toggles are described on that page. | [View Reception Settings](/client/settings/reception) |
| Client (Workflows) | Onboarding process | The picker lists four fixed names. It is not linked to the live Workflows list. | [View Workflows](/client/workflows) |
| Client (Process Kanban) | Walk-in enrolment | A kiosk walk-in is placed in the chosen process. An appointment-level default can override it. | [View Process Kanban](/client/processes/kanban) |
| Client (Appointments) | Late and early arrival rules | Not connected. The windows are saved and never read when a patient checks in. | [View Appointments](/client/appointments/list) |
| AI Receptionist (Check-in) | Scheduled check-in token | Issues the token. It does not use the late window or the aging cap. | [View Scheduled Check-in](/ai-receptionist/checkin/scheduled) |
| AI Receptionist (My Visit) | Queue tracker | Shows the token and a wait saved at issue time. It does not reorder by aging. | [View Tracker](/ai-receptionist/my-visit/tracker) |
| Companion | Queue number on the phone | Not connected to these settings. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Rohan Mehta, the Practice Admin, opens **Settings**, then the **AI Receptionist** tab. He scrolls to **Queue & Onboarding Rules**. He drags **Late Arrival Window** to 20 minutes and **Anti-Starvation Queue Aging Cap** to 40. He picks **Patient Intake** as the **Default Onboarding Process**. An **Unsaved changes** pill appears. He presses **Save settings** and sees "AI Receptionist settings saved". At the desk, Meera Iyer sees a walk-in register on the kiosk, and the new patient lands in the first stage of the chosen process. A patient who arrives thirty minutes late is still checked in as normal. The two sliders change nothing yet. Token prefixes stay `D-`, `P-`, `L-`, `B-` and `R-`, because no screen edits them.

### What is real and what is not

- **Real in the prototype:** both sliders with their ranges and defaults, the four-name process picker, and Save, Refresh and the unsaved-changes pill. The picker value is used when a kiosk walk-in is enrolled.
- **Simulated:** the sliders look like live rules but are saved and never read. Prefixes exist as fixed values and tokens do not follow them cleanly.
- **Not built:** editing token prefixes, the Early Arrival Buffer, and the late and aging rules themselves.

### Journey position

```
Settings sliders ─▶ saved config ─┬▶ (late window, aging cap: never read)
                                  └▶ Kiosk walk-in ─▶ Default Onboarding Process
```

## 2. Feature Requests

### F-1: Token numbering prefixes

#### 1. What it does
Every token should read like `P-007` or `L-004`, so patients and staff tell queues apart. There is no prefix editor. The defaults are fixed in the saved configuration: Doctor Room `D-`, Pharmacy `P-`, Diagnostic Lab `L-`, Billing Desk `B-` and Front Desk `R-`. Meera sees tokens on the kiosk and on a patient's ticket.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Default prefixes | Config | `D-`, `P-`, `L-`, `B-`, `R-` are held as fixed defaults | ◐ Simulated | Used only when a ticket has no number yet. A scheduled token is built as `D-` plus the count of all reception appointments plus one, not a per-station daily sequence (G11-E-24). Decision needed: D-124 |
| F-1.2: Prefix editor | Fields | Earlier intent: admins set a prefix per station type | ○ Not built | No inputs exist. Decision needed: D-124 |
| F-1.3: Three-digit daily sequence per station | Rule | Earlier intent: `PREFIX-###` that restarts each day for each station | ○ Not built | See F-1.1 |
| F-1.4: Prefix by room type | Rule | Every service room is a Doctor Room, so it issues `D-` | ◐ Simulated | G9-E-16 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rohan wants `LAB-` on lab tickets | Looks for a prefix field in **Queue & Onboarding Rules** | **There is none. Prefixes cannot be changed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front-desk Staff | When patients share a lobby, I want each department to have its own letter, so that calling a token never confuses two queues. |
| F-1-J2 | Practice Admin | When signage uses local letters, I want to set the prefixes, so that kiosk tokens match the wall display. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** Queue & Onboarding Rules, **then** it shows no token prefix input. |
| F-1-2 | **Given** a scheduled check-in, **then** the token is `D-` plus a number from the count of reception appointments. |

### F-2: Late Arrival Window and Early Arrival Buffer

#### 1. What it does
**Late Arrival Window** is a slider from 5 to 45 minutes in steps of 5, default 15. The help text says patients later than the value are "automatically downgraded to Priority 0". Rohan sets 20 and saves. Nothing on the kiosk or the desk changes. There is no early-arrival input at all.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Late Arrival Window slider | Slider | 5 to 45, step 5, default 15. The value is saved | ◐ Simulated | No check-in or queue logic reads it (G9-E-09). Decision needed: D-122 |
| F-2.2: Priority downgrade for late patients | Rule | Patients later than the window drop to Priority 0 | ○ Not built | The help text promises it (G9-E-09) |
| F-2.3: Early Arrival Buffer, 30 minutes | Rule | Earlier intent: patients up to 30 minutes early may check in | ○ Not built | A default value is stored. No input, no enforcement (G9-KT-16) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Window set to 20, slot at 10:00, patient arrives at 10:14 | Checks in at the kiosk | **The visit is handled as for any patient. The window is not consulted** |
| 2 | Same window, patient arrives at 11:00 | Checks in at the kiosk | **No downgrade happens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When morning traffic delays patients, I want a late window, so that small delays do not flood the front desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the slider, **then** it spans 5 to 45 minutes in steps of 5 and starts at 15. |
| F-2-2 | **Given** a saved window, **when** a patient checks in late, **then** nothing is applied. |

### F-3: Anti-Starvation Queue Aging Cap

#### 1. What it does
**Anti-Starvation Queue Aging Cap** is a slider from 20 to 90 minutes in steps of 5, default 45. Its help text says walk-in tickets waiting longer than the value "receive an automatic priority boost". The value is saved. No queue ordering reads it.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Aging Cap slider | Slider | 20 to 90, step 5, default 45. The value is saved | ◐ Simulated | Never read (G9-E-09) |
| F-3.2: Priority boost for aged walk-ins | Rule | Walk-ins that wait past the cap move up | ○ Not built | Decision needed: D-123 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A walk-in has waited 46 minutes under a cap of 45 | Meera watches the queue | **The ticket keeps its place. No boost happens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When the clinic favours booked visits, I want a limit on how long I can be pushed back, so that I am eventually called. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the slider, **then** it spans 20 to 90 minutes in steps of 5 and starts at 45. |
| F-3-2 | **Given** a saved cap, **when** a ticket waits longer, **then** its order does not change. |

### F-4: Default Onboarding Process

#### 1. What it does
Rohan picks one of four names in the **Default Onboarding Process** drop-down: **Appointment Scheduling (Default)**, **Patient Intake**, **Follow-up Calls** or **Clinical Visit Journey**. When a new walk-in is approved on the kiosk, the patient is placed in the first stage of the chosen process. Meera sees the patient on the board.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Onboarding picker | Select | Four fixed names. The choice is saved | ● Works | The list is fixed, not the live Workflows (G9-KT-14). Decision needed: D-126 |
| F-4.2: Walk-in enrolment | Rule | A kiosk walk-in enters the chosen process | ◐ Simulated | A separate appointment-default-process value, when set, silently wins (G9-E-10). Decision needed: D-126 |
| F-4.3: Live Workflows in the picker | Select | Earlier intent: managers pick from the clinic's own processes | ○ Not built | Decision needed: D-126 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Setting is **Patient Intake**, no appointment default is set | A walk-in is approved on the kiosk | **The new patient enters Patient Intake** |
| 2 | An appointment default process is set | The same walk-in is approved | **That value is used instead** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-desk Staff | When a new patient registers at the lobby screen, I want them placed in our intake workflow, so that the team sees the tasks at once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** the picker, **then** it offers exactly four names. |
| F-4-2 | **Given** an appointment-default-process value exists, **when** a walk-in is approved, **then** that value is used over the picker. |

### F-5: Save, refresh and unsaved changes

#### 1. What it does
The topbar of the Kiosk & Terminals mode holds the **Unsaved changes** pill, **Refresh** and **Save settings**. Every edit marks the draft dirty.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Save settings | Button | Saves under the organisation's key and under one shared "last saved" key, and tells open kiosks. Toast "AI Receptionist settings saved" | ◐ Simulated | The shared key can show one organisation's settings to a kiosk of another (G9-E-13). Decision needed: D-02 |
| F-5.2: Save failure | State | Toast "Failed to save settings" | ● Works | |
| F-5.3: Refresh | Button | Reloads from storage, discards edits, toast "AI Receptionist settings refreshed" | ◐ Simulated | No confirmation before edits are lost. No warning when leaving the page (G9-E-12) |
| F-5.4: Loading and error screen | State | None. The page reads storage at once | ○ Not built | |
| F-5.5: Unsaved changes pill | Badge | Shows after any edit | ● Works | It stays after Launch writes the draft (G9-E-11) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Edited two sliders | Presses **Refresh** | **Edits are discarded with no question and a refreshed toast shows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | After I change queue rules, I want to save them in one step, so that the kiosks use them. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** edits, **when** Save settings is pressed, **then** the toast "AI Receptionist settings saved" shows. |
| F-5-2 | **Given** edits, **when** Refresh is pressed, **then** the edits are discarded without a prompt. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Token numbering prefixes | F-1.1 – F-1.4 | ◐ / ○ | Fixed defaults only. No editor. |
| F-2 | Late and early arrival | F-2.1 – F-2.3 | ◐ / ○ | Slider saved, never enforced. No early buffer. |
| F-3 | Aging cap | F-3.1 – F-3.2 | ◐ / ○ | Slider saved, never enforced. |
| F-4 | Default Onboarding Process | F-4.1 – F-4.3 | ● / ◐ / ○ | Four fixed names. Walk-ins use the choice unless an appointment default exists. |
| F-5 | Save, refresh, unsaved | F-5.1 – F-5.5 | ● / ◐ / ○ | Save works. Shared key and no warnings. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front-desk Staff | Keep department queues apart with letters | F-1 |
| 2 | Practice Admin | Match prefixes to local signage | F-1 |
| 3 | Practice Manager | Allow for late arrivals | F-2 |
| 4 | Patient | Be called in eventually | F-3 |
| 5 | Front-desk Staff | Place new patients in the intake workflow | F-4 |
| 6 | Practice Admin | Save rules in one step | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| SystemAdmin | Open the tab, edit and save every setting | Nothing |
| Admin, Manager, Agent, Reception | See Settings in the menu | Opening it. A click sends them home with "Access restricted: Settings requires System Admin privileges." |

The earlier PRD named clinic managers, waiting-room coordinators and front-desk leads as the users. They are locked out today. Decision needed: D-16.

## 5. Metrics and definitions

No metric is shown. The wait time on a ticket is not computed by these settings.

## 6. Cross-module journeys this module appears in

The settings are not a step in the four journeys. The onboarding default is read at one step of the kiosk journey.

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in to Billing | Walk-in registration approved | The patient enters the Default Onboarding Process unless an appointment default is set. |
| | Late or early arrival | The saved windows are never applied. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-02 | Does the PRD state backend needs such as per-organisation configuration? | F-5.1 |
| D-16 | Should Admin and Manager roles reach AI Receptionist settings? | Section 4 |
| D-122 | Should check-in enforce early and late arrival windows? | F-2.1, F-2.2 |
| D-123 | How are queue position and wait defined, including the aging boost? | F-3.2 |
| D-124 | Are prefixes fixed or editable, and how does the sequence reset? | F-1.1 – F-1.4 |
| D-126 | Should the picker list live Workflows, and which default wins? | F-4.1 – F-4.3 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
