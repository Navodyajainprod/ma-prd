---
title: "AI Receptionist Settings"
product: "client"
module: "settings"
channel: "reception"
route: "/settings/reception"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS: AI RECEPTIONIST |
| Route | `/settings/reception` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **AI Receptionist** tab of Client Settings, placed above **AI Voices / Models**. One topbar switches between **Kiosk & Terminals** and **Clinic Rooms & Desks**. The first mode holds four stacked sections. The second holds one table of rooms with an add and edit drawer. |
| **Who uses it** | Practice Admin (sets up the kiosk and the rooms). Front-desk Staff and Patients meet the result on the kiosk. Only the SystemAdmin role passes the Settings guard. |
| **Where you start it** | **Settings**, then **AI Receptionist** (`/settings/reception`). The addresses `/receptionist`, `/settings/ai-receptionist` and `/settings/receptionist` open the same tab. |
| **Where the result goes** | A saved kiosk configuration in the browser, the shared rooms list used by Products & Services and appointments, and the kiosk opened by **Launch**. Only the same browser is reached. |
| **How real is it** | 0 features work, 5 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| AI Receptionist | Kiosk shell and greeting | Clinic Name, Primary Color and the English Greeting Phrase saved here brand the kiosk header and greeting. The Hindi greeting ignores the phrase. Support Phone and Email are saved and never shown. | [View Ambient Presence](/ai-receptionist/avatar/ambient-presence) |
| AI Receptionist | Rooms and stage guidance | Service rooms and standalone rooms appear in the unified table. The kiosk directory reads service rooms and uses standalone rooms only when none exist. | [View Stations](/ai-receptionist/settings/stations) |
| AI Receptionist | Queue rules | The Late Arrival Window and Aging Cap are saved and never read. The Default Onboarding Process is used for kiosk walk-ins. | [View Queue Rules](/ai-receptionist/settings/queue) |
| AI Receptionist | Live sync | Saving tells open kiosk tabs in the same browser. Other devices are not reached. | [View Architecture](/ai-receptionist/settings/architecture) |
| AI Receptionist | Walk-in registration | The Walk-in toggle is saved but the kiosk does not read it. A walk-in is enrolled in the Default Onboarding Process. | [View Walk-in](/ai-receptionist/checkin/walk-in) |
| Client (Services) | Products & Services rooms | Service rooms show in the table. Editing one writes back to the service. Deleting one deletes it from Products & Services. | [View Services](/client/services) |
| Client (Process Kanban) | Onboarding pipelines | The picker lists four fixed names, not the live processes. A walk-in lands in the first stage of the chosen one. | [View Process Kanban](/client/processes/kanban) |
| Client (Settings, Organization) | Default clinic details | A new configuration starts from the organisation's name, phone and email. | [View Organization Settings](/client/settings/organization) |

## 1. Module Summary

### The story in one minute

Rohan Mehta, the Practice Admin, opens **Settings** and **AI Receptionist**. The topbar shows **Kiosk & Terminals**, and on the right **Refresh** and **Save settings**. He types the clinic name, support contacts and a primary colour in **Clinic & persona**, and a greeting for the avatar. In **Kiosk features** he switches off **Payments**. An **Unsaved changes** pill appears. He presses **Save settings** and sees "AI Receptionist settings saved". He presses **Launch** on the OPD Desk terminal and a kiosk opens in a new tab with the clinic's name and "OPD Desk (Floor 1)". The bill-pay entry is gone, as he asked. Later he finds that Walk-in, Face check-in, QR check-in and Print token change nothing. He switches to **Clinic Rooms & Desks** and adds a pharmacy counter. It is saved but the kiosk does not list it.

### What is real and what is not

- **Real in the prototype:** the unified topbar, the Clinic & persona fields, branding and the English greeting on the kiosk, the Voice and Payments toggles, the Default Onboarding Process, terminals with Add, Remove and Launch, Save and Refresh, and the unified rooms table with its drawer.
- **Simulated:** four of the six kiosk toggles and the Support Phone and Email do nothing on the kiosk. The Late Arrival Window and Aging Cap are saved and never enforced. Settings share storage keys with no organisation separation. Deleting a room here deletes the Products & Services room. Standalone rooms do not reach kiosk directions.
- **Not built:** field validation, a separate Queue tab, token prefix editing, a source badge and a Product / Service column in the rooms table, and live sync across devices.

**Naming note:** the old PRD called the first mode "Kiosk & Terminals" with "Queue & Onboarding Rules" inside it. The screen still does. The old PRD also promised a source badge and a "None attached" column that the table does not have. Decision needed: D-125.

### Journey position

```
Settings (this tab) ─▶ saved config ─┬▶ Kiosk header, greeting, Voice and Payments
                                     ├▶ Walk-in: Default Onboarding Process
                                     └▶ Launch: kiosk tab per terminal
Rooms table ─▶ shared rooms list ─┬▶ Products & Services ─▶ Appointment rooms
                                  └▶ Kiosk directions (service rooms only)
```

## 2. Feature Requests

### F-1: Topbar and Clinic & persona

#### 1. What it does
The standard topbar holds a mode switch, **Kiosk & Terminals** and **Clinic Rooms & Desks**. The second shows a room-count badge. In the first mode the right side shows an **Unsaved changes** pill, **Refresh** and **Save settings**. Below it the **Clinic & persona** section has one row with **Clinic Name**, **Support Phone**, **Support Email** and **Primary Color** (a swatch and a hex field, default `#2f2447`). A second row has a multi-line **Greeting Phrase** that Aria speaks to a visitor, for example "Welcome to Navodya Eye Clinic. How can I help you today?".

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Topbar controls | Topbar | Mode switch, Unsaved changes pill, Refresh and Save settings. The pill shows after any edit | ● Works | The pill stays after Launch writes the draft (G9-E-11) |
| F-1.2: Four-field branding row | Inputs | Clinic Name, Support Phone, Support Email, Primary Color with swatch and hex | ● Works | An invalid hex falls back to `#2f2447` for the swatch. No field is validated. Decision needed: D-130 |
| F-1.3: Greeting Phrase | Textarea | Aria's welcome. Used for the English greeting | ◐ Simulated | The Hindi greeting ignores it and always uses a generated phrase. Decision needed: D-130 |
| F-1.4: Clinic Name and Primary Color on the kiosk | Branding | The kiosk header and colour follow the saved values | ● Works | |
| F-1.5: Support Phone and Email on the kiosk | Display | Saved with the configuration | ◐ Simulated | No kiosk screen shows them (G9-KT-06). Decision needed: D-130 |
| F-1.6: Save settings | Button | Saves under the organisation's key and under one shared "last saved" key, and tells open kiosks. Toast "AI Receptionist settings saved" | ◐ Simulated | A kiosk opened with no or an unknown organisation shows whichever organisation saved last, including branding, contacts and terminals (G9-E-13). Decision needed: D-02 |
| F-1.7: Save failure | State | Toast "Failed to save settings" | ● Works | |
| F-1.8: Refresh | Button | Reloads from storage, discards edits, toast "AI Receptionist settings refreshed" | ◐ Simulated | No confirmation and no warning when leaving with edits (G9-E-12) |
| F-1.9: Starting values | Rule | A new configuration starts from the organisation's name, phone and email | ● Works | |
| F-1.10: Loading and error screen | State | None. The page reads storage at once | ○ Not built | |
| F-1.11: Per-organisation configuration | Rule | Earlier intent: settings persist centrally per organisation | ○ Not built | The shared key breaks this on the kiosk side (G9-E-13). Decision needed: D-02 |

#### 3. Worked example
Rohan brands the kiosk for Navodya Eye Clinic.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Settings opened | Enters the clinic name, contacts, colour `#2f2447` and the greeting, then presses **Save settings** | **Toast "AI Receptionist settings saved". A kiosk in the same browser shows the name and colour and speaks the English greeting** |
| 2 | He edits two fields | Presses **Refresh** | **Edits are discarded with no question** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When setting up a clinic location, I want kiosk identity fields in one clear row, so that every core field is visible at once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** edits under Clinic & persona, **when** Save settings is pressed, **then** the toast "AI Receptionist settings saved" shows and open kiosks in the same browser update. |
| F-1-2 | **Given** a Support Phone or Email, **then** no kiosk screen displays it. |
| F-1-3 | **Given** a hex that is not valid, **then** the swatch shows `#2f2447` and the value is still saved. |

### F-2: Kiosk features

#### 1. What it does
**Kiosk features** shows six switches in a three-column grid. Each has fixed copy: **Walk-in** ("Allow walk-in registration from the kiosk"), **Face check-in** ("Show face recognition check-in"), **QR check-in** ("Allow scanning appointment QR codes"), **Voice** ("Enable voice intents on the avatar"), **Payments** ("Show pay-my-bill entry points") and **Print token** ("Offer printed queue tokens"). All are on by default except Print token. Only Voice and Payments change the kiosk.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Six-switch grid | Switches | Six switches with the copy above, saved with Save settings | ● Works | |
| F-2.2: Voice | Switch | Off: the kiosk does not start listening after the greeting | ● Works | |
| F-2.3: Payments | Switch | Off: the kiosk hides its billing entry points | ● Works | |
| F-2.4: Walk-in, Face check-in, QR check-in, Print token | Switches | Saved but no kiosk code reads them | ◐ Simulated | Four of six toggles do nothing (G9-E-08). Decision needed: D-122 |
| F-2.5: Live enforcement across terminals | Sync | Open kiosks in the same browser pick up the change | ◐ Simulated | Other devices are not reached (G9-AR-02). Decision needed: D-02 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | No receipt printer, bill pay not wanted | Turns off **Print token** and **Payments**, then presses **Save settings** | **The kiosk hides bill pay. Print token changes nothing because no kiosk code reads it** |
| 2 | He turns off **Face check-in** | Saves | **The kiosk still offers face check-in** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When kiosks have different hardware, I want to switch each workflow on or off, so that visitors only see what works. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** all six toggles, **then** they render in a three-column grid and persist on Save settings. |
| F-2-2 | **Given** Payments is off, **then** the kiosk hides its billing entry points. |
| F-2-3 | **Given** Walk-in, Face check-in, QR check-in or Print token is off, **then** the kiosk behaves as before. |

### F-3: Queue & Onboarding Rules

#### 1. What it does
**Queue & Onboarding Rules** is a three-column section inside **Kiosk & Terminals**, with no separate Queue tab. **Late Arrival Window** is a slider from 5 to 45 minutes in steps of 5, default 15. **Anti-Starvation Queue Aging Cap** is a slider from 20 to 90 in steps of 5, default 45. **Default Onboarding Process** picks one of four names. The sliders are saved and never enforced. The details are on the kiosk-side Queue Rules page.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Late Arrival Window | Slider | 5 to 45, step 5, default 15. The help text says later patients are downgraded to Priority 0 | ◐ Simulated | Saved, never read by check-in or the queue (G9-E-09). Decision needed: D-122 |
| F-3.2: Anti-Starvation Queue Aging Cap | Slider | 20 to 90, step 5, default 45. The help text promises an automatic priority boost | ◐ Simulated | Saved, never read (G9-E-09). Decision needed: D-123 |
| F-3.3: Default Onboarding Process | Select | **Appointment Scheduling (Default)**, **Patient Intake**, **Follow-up Calls**, **Clinical Visit Journey**. A kiosk walk-in is placed in the first stage | ◐ Simulated | The list is fixed, not live processes. An appointment default process, when set, silently wins (G9-E-10). Decision needed: D-126 |
| F-3.4: Token Numbering Prefixes inputs | Fields | The section has none | ○ Not built | Prefixes are fixed defaults. Decision needed: D-124 |
| F-3.5: Separate Queue tab | Tab | The section sits inside Kiosk & Terminals | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Peak-hour rules | Sets **Late Arrival Window** 15, **Aging Cap** 40 and **Clinical Visit Journey**, then **Save settings** | **All settings save in one pass. Only the onboarding choice changes kiosk behaviour** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When setting up reception behaviour, I want arrival windows, the aging cap and the onboarding default on one screen, so that I save everything in one go. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** Kiosk & Terminals, **then** Queue & Onboarding Rules is a three-column section with no Queue tab and no prefix inputs. |
| F-3-2 | **Given** saved sliders, **when** a patient checks in late or waits long, **then** nothing is applied. |
| F-3-3 | **Given** a walk-in is approved, **then** the patient enters the chosen process unless an appointment default exists. |

### F-4: Receptionist terminals

#### 1. What it does
**Receptionist terminals** lets a clinic name several kiosks. Two rows exist by default, Front Desk in Lobby and OPD Desk on Floor 1. **+ Add terminal** appends "Reception Terminal N" at "Desk N". **Terminal Name** and **Location Label** are edited in the row. **Launch** writes the current draft and opens a kiosk tab for that terminal. **Remove** deletes the row.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: + Add terminal | Button | Adds a row with no limit | ● Works | |
| F-4.2: Terminal Name and Location Label | Inputs | Edited inline. The launched kiosk header reads "AI Receptionist, Name (Location)" | ● Works | |
| F-4.3: Launch | Button | Writes the draft and opens `/reception` with the terminal, location and organisation in the address | ◐ Simulated | Publishes the draft without Save, and the pill stays (G9-E-11) |
| F-4.4: Remove | Button | Removes the row from the draft with no confirmation | ◐ Simulated | G9-E-12 |
| F-4.5: Empty state | State | "No terminals configured yet. Click "+ Add terminal" to provision a kiosk station." | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Lobby and Floor 1 desks | Presses **Launch** on **OPD Desk** | **A kiosk tab opens with the clinic branding and "OPD Desk (Floor 1)"** |
| 2 | An extra row is not needed | Presses **Remove** | **The row is gone at once** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-desk Staff | When we run kiosks in the lobby and on a floor, I want a Launch button per terminal, so that the right kiosk opens at once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** + Add terminal is pressed, **then** an editable row is added. Remove deletes it with no confirmation. |
| F-4-2 | **Given** Launch is pressed, **then** the draft is written and a kiosk tab opens with the terminal's name and location. |

### F-5: Clinic Rooms & Desks

#### 1. What it does
Rohan switches to **Clinic Rooms & Desks**. The topbar becomes a search box, the presets **All Rooms**, **Products & Services**, **AI Receptionist**, **Active Only** with counts, and **Add Room**. One table lists service rooms from Products & Services and standalone rooms made here. **Add Room** and a click on a row open a side drawer. Rooms made here never carry a product or service. The room screens are described in full on the kiosk-side Stations page.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Search, presets, Add Room | Topbar | Search covers name, number, direction, location, responsible and service | ● Works | |
| F-5.2: Unified table | Table | **Room Label**, **Room Number**, **Direction** (falls back to Location), **Responsible**, **Active**. Standalone rooms first. A standalone room with the same id or number as a service room is hidden | ● Works | No stacked subtext. Two rooms with one number collapse silently (G9-RM-02) |
| F-5.3: Add and Edit drawer | Drawer | **Room Label**, **Type**, **Room Number**, **Direction**, **Location / Floor Wing**, **Responsible**, **Active**. Subtitle "AI Receptionist room · No product or service attached" | ● Works | A whitespace-only label shows "Please enter a room name" |
| F-5.4: Edit a service room | Drawer | Saving writes back to the Products & Services room | ◐ Simulated | An emptied number, location or direction keeps its old value (G9-E-18) |
| F-5.5: Activate, disable, delete | Row actions | Toasts "Room activated" or "Room disabled". Delete asks the browser to confirm | ◐ Simulated | Deleting a service room deletes it from Products & Services (G9-E-14). Decision needed: D-32 |
| F-5.6: Kiosk effect of standalone rooms | Hand-off | Added rooms are meant to reach kiosk directions | ◐ Simulated | The directory reads service rooms and uses standalone rooms only when none exist (G9-E-15). Decision needed: D-124 |
| F-5.7: Empty search | State | "No rooms match your filter. Click Add Room to configure an AI Receptionist room." | ● Works | |
| F-5.8: Per-organisation rooms | Rule | Rooms are kept in shared browser storage | ○ Not built | Every organisation's rooms show here (G9-E-17) |
| F-5.9: Source badge and Product / Service column | Column | Earlier intent: show the source and "None attached" | ○ Not built | The table has five columns. Decision needed: D-125 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Room 101 is a service room. A pharmacy counter is needed | Presses **Add Room**, enters "Main Pharmacy Counter" and saves | **The counter is listed first. Room 101 shows its service only in the edit drawer** |
| 2 | An old booth | Chooses **Delete Room** on a service room and accepts | **It is gone here and from Products & Services** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | When reviewing the rooms the kiosk uses, I want service rooms and standalone desks in one searchable table, so that nothing is out of sync. |
| F-5-J2 | Practice Admin | When adding wayfinding spots such as a pharmacy desk, I want rooms with no billable service, so that non-service destinations stay clean. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** Add Room, **then** the drawer opens and the new room has no product or service. |
| F-5-2 | **Given** a service room is deleted here, **then** it is removed from Products & Services too. |
| F-5-3 | **Given** a standalone room is added, **then** the kiosk directory does not list it while service rooms exist. |
| F-5-4 | **Given** the table, **then** it shows five columns with no source badge. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Topbar and Clinic & persona | F-1.1 – F-1.11 | ● / ◐ / ○ | Branding works. Contacts unused. Shared save key. |
| F-2 | Kiosk features | F-2.1 – F-2.5 | ● / ◐ | Voice and Payments work. Four toggles do nothing. |
| F-3 | Queue & Onboarding Rules | F-3.1 – F-3.5 | ● / ◐ / ○ | Sliders saved, never enforced. Onboarding default used. |
| F-4 | Receptionist terminals | F-4.1 – F-4.5 | ● / ◐ | Add, Launch, Remove work. No confirmations. |
| F-5 | Clinic Rooms & Desks | F-5.1 – F-5.9 | ● / ◐ / ○ | Table and drawer work. Delete reaches services. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Set kiosk identity fields in one clear row | F-1 |
| 2 | Practice Manager | Switch kiosk workflows on or off | F-2 |
| 3 | Practice Manager | Set arrival rules and onboarding default on one screen | F-3 |
| 4 | Front-desk Staff | Launch the right kiosk per terminal | F-4 |
| 5 | Practice Admin | See service and standalone rooms in one table | F-5 |
| 6 | Practice Admin | Add non-service wayfinding rooms | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| SystemAdmin | Open the tab, edit and save every setting, launch kiosks, add, edit, disable and delete rooms | Nothing |
| Admin, Manager, Agent, Reception | See Settings in the menu | Opening it. A click sends them home with "Access restricted: Settings requires System Admin privileges." |
| Kiosk visitor | See the saved branding, features and rooms on the kiosk | Everything else |

The role comes from browser storage and defaults to SystemAdmin. The earlier PRD named practice managers, operations leads and front-desk supervisors as the users. They are locked out today. Decision needed: D-16.

## 5. Metrics and definitions

The room-count badge and the preset counts (All Rooms, Products & Services, AI Receptionist, Active Only) are plain counts of the merged table. No other metric is shown.

## 6. Cross-module journeys this module appears in

The tab is not a step in the four journeys. Its onboarding default is read at one step of the kiosk journey.

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → Billing | Walk-in registration approved | The patient enters the Default Onboarding Process unless an appointment default is set. |
| | Billing entry points | Hidden when **Payments** is off. The other toggles are not read. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-02 | Is the PRD prototype-only, or must it state backend needs such as per-organisation configuration and live cross-device sync? | F-1.6, F-1.11, F-2.5 |
| D-16 | Should Admin and Manager roles reach AI Receptionist settings, perhaps Rooms only? | Section 4 |
| D-32 | May a room used by a service be deleted, or only deactivated? | F-5.5 |
| D-122 | Should check-in enforce early and late arrival windows,? | F-2.4, F-3.1 |
| D-123 | How are queue position and wait defined, including the aging boost? | F-3.2 |
| D-124 | Are token prefixes fixed or editable, and how is station type set for service rooms? | F-3.4, F-5.6 |
| D-125 | Should the table and kiosk show a source badge and the attached service? | F-5.9 |
| D-126 | Should the picker list live Workflows, and which default wins? | F-3.3 |
| D-130 | Should Greeting Phrase have per-language versions, where do Support Phone and Email show, and what validation applies? | F-1.2, F-1.3, F-1.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
