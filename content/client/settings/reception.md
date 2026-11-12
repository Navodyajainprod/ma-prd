---
title: "AI Receptionist Settings"
product: "client"
module: "settings"
channel: "reception"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | Client (Clinic Practice Management) |
| :--- | :--- |
| Module | Settings & Administration - AI Receptionist |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| AI Receptionist | Kiosk Shell & Ambient Greeting | Clinic Name, Greeting Phrase, and Primary Color saved here customize the waiting-room kiosk header, voice greeting, and brand color immediately. | [View in AI Receptionist](/ai-receptionist/avatar/ambient-presence) |
| AI Receptionist | Clinic Stations & Stage Guidance | Both standalone rooms created here and service-linked rooms from Products & Services appear in the unified rooms table and power kiosk directories. | [View in AI Receptionist](/ai-receptionist/settings/stations) |
| AI Receptionist | Queue Rules & Intake Defaults | Late Arrival Window, Anti-Starvation Queue Aging Cap, and Default Onboarding Process configured in Kiosk & Terminals control live kiosk queue fairness. | [View in AI Receptionist](/ai-receptionist/settings/queue) |
| AI Receptionist | Live Clinic Sync & Reliability | Multi-terminal setups, kiosk feature toggles, and room updates saved here sync centrally across dedicated lobby and floor terminal sessions. | [View in AI Receptionist](/ai-receptionist/settings/architecture) |
| AI Receptionist | Walk-In Registration & Booking | Enabling the Walk-in toggle displays walk-in registration on kiosks, enrolling first-time visitors into whichever Default Onboarding Process is selected here. | [View in AI Receptionist](/ai-receptionist/checkin/walk-in) |
| Client | Products & Services Rooms Visibility | Displays rooms configured inside Products & Services alongside their attached service badge inside the unified AI Receptionist Rooms table. | [View in Client](/client/services) |
| Client | Process Kanban Pipelines | Configures the care pipelines selectable inside Default Onboarding Process and tracks newly registered kiosk walk-ins. | [View in Client](/client/processes/kanban) |

## 1. Module Summary
- **AI Receptionist** inside the Client sidebar's **Settings** section (positioned above **AI Voices / Models**) uses the standard MantraAssist page width, standard section spacing, and a single unified **Topbar** switching between **Kiosk & Terminals** and **Clinic Rooms & Desks**.
- **Kiosk & Terminals** displays **Refresh**, **Save settings**, and any **Unsaved changes** badge directly inside the right side of the unified topbar and stacks four full-width **horizontal sections** underneath: **Clinic & persona**, **Kiosk features**, **Queue & Onboarding Rules**, and **Receptionist terminals**.
- **Clinic Rooms & Desks** activates the unified topbar's search field, source filter presets, and **Add Room** action above a cleanly spaced full-width data table uniting rooms created in **Products & Services** (with their attached Product / Service badge) and standalone rooms created in **AI Receptionist** (which have no product or service attached).

## 2. Feature Requests

### F-1: Unified Topbar & Horizontal **Clinic & Persona** Branding
#### 1. What it does
Uses the standard MantraAssist topbar component as the unified mode switcher (**Kiosk & Terminals** / **Clinic Rooms & Desks**) with contextual actions (**Unsaved changes**, **Refresh**, and **Save settings** on **Kiosk & Terminals**), spaced cleanly above the full-width horizontal **Clinic & persona** section:
- **Top Horizontal Row (4 columns on wide screens):** **Clinic Name**, **Support Phone**, **Support Email**, and **Primary Color** (interactive color swatch picker paired with hex code input `#2f2447`).
- **Second Horizontal Row (Full width):** Multi-line **Greeting Phrase** spoken by Aria when welcoming a visitor (for example, `"Welcome to Navodya Eye Clinic. How can I help you today?"`).
All changes persist centrally per organization and sync live to waiting-room kiosk screens.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Top Bar Save & Refresh Controls | Action Controls | Places **Refresh**, **Save settings**, and **Unsaved changes** beside the sub-tab bar | Removes extra header banner bloat |
| F-1.2: 4-Column Branding & Contact Row | Horizontal Inputs | Arranges **Clinic Name**, **Support Phone**, **Support Email**, and **Primary Color** side by side | Full product-width alignment |
| F-1.3: Greeting Phrase Field | Full-Width Input | Captures Aria's spoken welcome phrase across the full card width | Updates dedicated terminal greetings live |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic configures `Navodya Eye Clinic` | Opens Sidebar -> Settings -> **AI Receptionist**, updates Clinic Name, Support contacts, Primary Color `#2f2447`, and Greeting Phrase in the horizontal **Clinic & persona** section, clicks **Save settings** | **Settings save per organization and launched kiosks immediately speak the custom greeting with branded styling** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When setting up a clinic location, I want kiosk identity fields laid out cleanly horizontally without duplicate summary banners, so every core field fits clearly above the fold. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-AC1 | Saving changes under **Clinic & persona** persists centrally per organization and updates launched kiosk headers and spoken greetings immediately. |

---

### F-2: Horizontal **Kiosk Features** Workflow Grid
#### 1. What it does
Arranges all six self-service workflow toggles in a clean horizontal 3-column grid inside the full-width **Kiosk features** section:
- **Walk-in:** `"Allow walk-in registration from the kiosk"` — enables or hides self-service walk-in registration.
- **Face check-in:** `"Show face recognition check-in"` — toggles biometric face recognition during check-in.
- **QR check-in:** `"Allow scanning appointment QR codes"` — enables QR code check-in scanning.
- **Voice:** `"Enable voice intents on the avatar"` — toggles spoken voice intent listening on Aria.
- **Payments:** `"Show pay-my-bill entry points"` — shows or hides bill payment entry points on kiosks.
- **Print token:** `"Offer printed queue tokens"` — enables physical queue ticket printing.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: 3-Column Feature Switch Grid | Feature Switches | Horizontally arranges all 6 kiosk toggles (`Walk-in`, `Face check-in`, `QR check-in`, `Voice`, `Payments`, `Print token`) | Saves vertical scrolling cleanly |
| F-2.2: Live Kiosk Enforcement | Session Behavior | Applies enabled/disabled workflow states directly to waiting-room kiosk UIs | Syncs across dedicated terminal sessions |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic runs kiosks without a receipt printer and wants bill pay hidden | Turns off **Print token** and **Payments** in **Kiosk features** and clicks **Save settings** | **Kiosks hide bill-pay entry points while keeping Walk-in, Face check-in, QR check-in, and Voice active** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Operations Lead | When configuring kiosks with different hardware setups, I want toggle switches arranged in a compact horizontal grid, so I can inspect and configure every workflow in seconds. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-AC1 | All six **Kiosk features** toggles render horizontally across the card and persist per organization upon **Save settings**. |

---

### F-3: **Queue & Onboarding Rules** Section (Inside **Kiosk & Terminals**)
#### 1. What it does
Included directly inside **Kiosk & Terminals** as a full-width horizontal 3-column section (with no separate Queue tab and no Token Numbering Prefixes configuration):
- **Late Arrival Window (`5–45m`, step `5`, default `15m`):** Slider setting how many minutes past slot start a late patient may check in smoothly before automatic priority adjustment.
- **Anti-Starvation Queue Aging Cap (`20–90m`, step `5`, default `45m`):** Slider capping maximum wait time before waiting walk-in tickets receive an automatic priority boost.
- **Default Onboarding Process:** Process selector (`Appointment Scheduling (Default)`, `Patient Intake`, `Follow-up Calls`, `Clinical Visit Journey`) automatically enrolling newly registered walk-in visitors.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Late Arrival Window Card | Range Control | Configures late tolerance (`5–45m`, def `15m`) | Placed in column 1 of horizontal grid |
| F-3.2: Anti-Starvation Cap Card | Fairness Slider | Configures max queue aging wait threshold (`20–90m`, def `45m`) | Placed in column 2 of horizontal grid |
| F-3.3: Default Onboarding Process Card | Process Picker | Assigns Stage 1 intake pipeline for new walk-ins | Placed in column 3 of horizontal grid |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic adjusts peak-hour fairness rules alongside kiosk settings | Scrolls to the horizontal **Queue & Onboarding Rules** section inside **Kiosk & Terminals**, sets **Late Arrival Window** to `15m`, **Anti-Starvation Cap** to `40m`, and selects `Clinical Visit Journey`, then clicks topbar **Save settings** | **All kiosk branding, toggles, terminals, and queue fairness rules save together in one pass** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Operations Director | When setting up AI Receptionist behavior, I want arrival windows, anti-starvation queue caps, and default onboarding process right inside Kiosk & Terminals as a horizontal section, so I save everything from one screen. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-AC1 | **Queue & Onboarding Rules** renders directly inside **Kiosk & Terminals** as a 3-column horizontal section without a separate Queue sub-tab or Token Numbering Prefixes inputs. |

---

### F-4: Horizontal **Receptionist Terminals** Provisioning & **Launch**
#### 1. What it does
Allows clinics operating multiple lobby desks, OPD counters, or floors to provision and name multiple kiosk terminals horizontally across the page:
- Selecting **+ Add terminal** appends a horizontal terminal row containing **Terminal Name** (for example, `Front Desk`, `OPD Desk`), **Location Label** (for example, `Lobby`, `Floor 1`), **Launch**, and **Remove**.
- Clicking **Launch** persists active settings and opens a dedicated browser tab tagged with that terminal's identity and location.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: **+ Add terminal** Action | Multi-Kiosk Creator | Adds named terminal rows per clinic without limits | Ideal for multi-floor or multi-desk clinics |
| F-4.2: Terminal Name & Location Label | Horizontal Row Inputs | Identifies each physical kiosk screen (`Front Desk` / `Lobby`) | Displayed inside the launched kiosk header |
| F-4.3: **Launch** & **Remove** Row Controls | Session Actions | Opens a dedicated session tab for that terminal or removes the row | Syncs latest settings before launching |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic runs desks at the Lobby and 1st-floor OPD | Provisions `Front Desk` (`Lobby`) and `OPD Desk` (`Floor 1`), then clicks **Launch** on `OPD Desk` | **Dedicated kiosk tab opens displaying the organization branding and `OPD Desk (Floor 1)` terminal label** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-Desk Supervisor | When running separate kiosks across lobby and floor desks, I want each terminal row configured horizontally with a Launch button, so staff can open the right kiosk session immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-AC1 | Clicking **+ Add terminal** adds a new editable row, **Remove** removes it, and **Launch** opens a dedicated terminal kiosk session. |

---

### F-5: Unified **Clinic Rooms & Desks** Table (`Products & Services` + Standalone `AI Receptionist`)
#### 1. What it does
Available from the **Clinic Rooms & Desks** mode inside the unified topbar (with contextual search, source presets, and **Add Room**) separated by standard vertical spacing above the full-width data table:
- **Unified Visibility:** Displays **all rooms configured in Products & Services** (showing their `Products & Services` source badge and attached **Product / Service** badge) alongside **standalone rooms configured in AI Receptionist** (showing the `AI Receptionist` source badge).
- **No Service Attachment for AI Receptionist Rooms:** Rooms added directly from the topbar **Add Room** action represent standalone wayfinding rooms or desks (`Doctor Room`, `Pharmacy`, `Diagnostic Lab`, `Billing Desk`, `Front Desk`) and **never attach a Product or Service** (`None attached` in the **Product / Service** column).
- **Filtering & Quick Actions:** Topbar presets filter `All Rooms`, `Products & Services`, `AI Receptionist`, or `Active Only`, while search and table row actions support live editing, activation toggles, and removal.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Unified Topbar Search + **Add Room** | Standard Topbar | Switches cleanly to search, source filter presets (`All Rooms`, `Products & Services`, `AI Receptionist`, `Active Only`), and **Add Room** button inside the main page topbar | Spaced cleanly above the table like standard Settings & product views |
| F-5.2: Full-Width Unified Data Table | Standard Table View | Shows clean single-line **Room Label**, **Room Number**, **Direction**, **Responsible**, and **Active** columns with no extra subtext | Combines Products & Services rooms and AI Receptionist rooms cleanly |
| F-5.3: Standalone AI Receptionist Room Slide-Over Drawer | Side Drawer Form | Opens from the right when clicking **Add Room** or editing a room, collecting **Room Label**, **Type**, **Room Number**, **Direction**, **Location / Floor Wing**, **Responsible**, and **Active** | Never attaches any Product or Service when added from AI Receptionist |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic wants `Room 101` (`Initial Consultation` from Products & Services) and a standalone `Main Pharmacy Counter` | Opens **Clinic Rooms & Desks**, filters between **Products & Services** and **AI Receptionist**, and clicks **Add Room** in the topbar to add `Main Pharmacy Counter` without attaching a service | **Table displays `Room 101` with `Initial Consultation` alongside `Main Pharmacy Counter` showing `None attached`** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Manager | When reviewing all clinic rooms used by kiosks, I want to see service-linked rooms from Products & Services and standalone reception desks together in one full-width searchable table, so nothing is cut off or out of sync. |
| F-5-J2 | Facilities Lead | When adding general wayfinding spots like restrooms or pharmacy desks on the AI Receptionist, I want to create standalone rooms without attaching a billable service, so non-service destinations remain clean. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-AC1 | Both **Products & Services** rooms and standalone **AI Receptionist** rooms render in the clean 5-column table (**Room Label**, **Room Number**, **Direction**, **Responsible**, **Active**) without stacked subtext, and **Add Room** / **Edit Room** opens inside a side drawer where rooms created in AI Receptionist never attach a Product or Service. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Horizontal Clinic & Persona Branding & Action Bar | F-1.1 to F-1.3 | Configures Clinic Name, contacts, Primary Color, and Greeting Phrase horizontally with topbar Save/Refresh controls. |
| F-2 | Horizontal Kiosk Features Workflow Grid | F-2.1 to F-2.2 | Controls 6 kiosk workflows in a compact 3-column horizontal toggle grid. |
| F-3 | Queue & Onboarding Rules Section (In Kiosk & Terminals) | F-3.1 to F-3.3 | Configures arrival tolerance, anti-starvation queue cap, and default onboarding workflow as a 3-column horizontal section inside Kiosk & Terminals. |
| F-4 | Horizontal Receptionist Terminals Provisioning & Launch | F-4.1 to F-4.3 | Provisions named location terminals and launches dedicated kiosk sessions per desk or floor. |
| F-5 | Unified Clinic Rooms & Desks Table & Drawer | F-5.1 to F-5.3 | Displays Products & Services rooms and standalone AI Receptionist rooms across Room Label, Room Number, Direction, Responsible, and Active columns with a slide-over Add/Edit Room drawer. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Manage kiosk persona branding, contacts, and unified room inventory centrally across full product width. | F-1, F-5 |
| 2 | Operations Director | Control kiosk feature toggles, arrival fairness sliders, and onboarding routing inside one unified Kiosk & Terminals view. | F-2, F-3 |
| 3 | Front-Desk Supervisor | Provision multiple named Receptionist terminals across desks and launch dedicated kiosk sessions cleanly. | F-4 |
| 4 | Facilities Lead | Add standalone AI Receptionist destinations without forcing a Product or Service link, while still viewing service rooms in the same table. | F-5 |
