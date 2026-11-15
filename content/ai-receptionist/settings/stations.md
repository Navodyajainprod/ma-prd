---
title: "Clinic Rooms & Desks and Stage Guidance Cards"
product: "ai-receptionist"
module: "settings"
channel: "stations"
route: "/settings/reception"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | SETTINGS: CLINIC ROOMS & DESKS AND STAGE GUIDANCE |
| Route | `/settings/reception` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Clinic Rooms & Desks** mode of the AI Receptionist tab in Client Settings: one table of every room the kiosk can route to, with a drawer to add and edit. It also covers the stage guidance card that a Process stage shows on the kiosk. |
| **Who uses it** | Practice Admin (maintains rooms and writes stage cards). Front-desk Staff and Patients see the effect on the kiosk. Only the SystemAdmin role passes the Settings guard. |
| **Where you start it** | **Settings**, then the **AI Receptionist** tab, then **Clinic Rooms & Desks** at `/settings/reception`. Stage cards start from a Process stage, in **Stage Portal & Reception Settings**. |
| **Where the result goes** | The Products & Services room list, appointment room allocation, the kiosk directions directory and the kiosk Next Step card. |
| **How real is it** | 0 features work, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Settings) | Host screen | The rooms table is one mode of the AI Receptionist tab. The other mode, Kiosk & Terminals, is described on its own page. | [View Reception Settings](/client/settings/reception) |
| Client (Services) | Products & Services rooms | Rooms of services appear in this table. Editing one writes back to the service's room. Deleting one deletes it from Products & Services. | [View Services](/client/services) |
| Client (Appointments) | Room allocation | Appointment room allocation reads the same shared rooms list. | [View Appointments](/client/appointments/list) |
| Client (Workflows) | Stage guidance card | The card is written inside a Process stage and shown on the kiosk Next Step screen. | [View Workflows](/client/workflows) |
| AI Receptionist (Directions) | Department and room directory | Built from active Products & Services rooms. Standalone rooms from this screen appear only when no service room exists. | [View Departments](/ai-receptionist/directions/departments) |
| AI Receptionist (My Visit) | Next Step card | Shows the stage card for the verified patient's stage. | [View Next Step](/ai-receptionist/my-visit/next-step) |
| Client (Custom Fields) | Variables in cards | Not connected. The field picker offers a fixed list and no custom fields. | [View Custom Fields](/client/settings/custom-fields) |

## 1. Module Summary

### The story in one minute

Rohan Mehta, the Practice Admin, opens **Settings**, the **AI Receptionist** tab, and switches to **Clinic Rooms & Desks**. The badge on the switch shows how many rooms there are. He sees one table with rooms from Products & Services and rooms made only for the kiosk. He presses **Add Room**, names a new lab bay and marks it active. A success toast appears and the row is in the table. Then he opens a service room and changes its direction text. The change is saved on the service too. In Workflows he opens a stage and writes a short guidance card for patients. At the desk, Meera Iyer watches a patient read that card on the kiosk. The lab bay Rohan added is not in the kiosk directions, because the kiosk reads service rooms first.

### What is real and what is not

- **Real in the prototype:** the unified table, search and presets, the Add and Edit drawer, activate and disable, delete, the stage card editor with preview, and the kiosk reading service rooms and stage cards.
- **Simulated:** the kiosk effect of standalone rooms. They are saved but do not reach kiosk directions or ticket routing (G9-E-15). Delete also removes a room from Products & Services (G9-E-14).
- **Not built:** separation of rooms by organisation, a source badge, and a service column in the table.

### Journey position

```
Settings rooms ─▶ shared rooms list ─┬▶ Products & Services rooms
                                     ├▶ Appointment room allocation
                                     └▶ Kiosk directions (service rooms only)
Process stage ─▶ guidance card ─▶ Kiosk Next Step
```

## 2. Feature Requests

### F-1: Manage Clinic Rooms & Desks

#### 1. What it does
Rohan opens **Clinic Rooms & Desks**. One table lists rooms from two sources. Products & Services rooms always show. Standalone **AI Receptionist** rooms show unless one has the same id or room number as a service room. Standalone rows come first. He searches, filters with the presets **All Rooms**, **Products & Services**, **AI Receptionist** and **Active Only**, and presses **Add Room** to open a side drawer. Clicking a row opens Edit.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Mode switch | Topbar | Switches between Kiosk & Terminals and Clinic Rooms & Desks. The second shows a room-count badge | ● Works | |
| F-1.2: Unified table | Table | Merges service rooms and standalone rooms. A standalone room with the same id or number as a service room is hidden | ● Works | Two rooms with one number from different sources collapse silently (G9-RM-02) |
| F-1.3: Columns | Table | Room Label, Room Number as a `#n` chip, Direction (falls back to Location), Responsible, Active pill. Column customisation is on. 20 rows a page | ● Works | No source badge and no service column (see F-1.15) |
| F-1.4: Search and presets | Filter | Search covers name, number, direction, location, responsible and service. Presets show counts | ● Works | |
| F-1.5: Add Room drawer | Drawer | Fields: Room Label, Type, Room Number, Direction, Location / Floor Wing, Responsible, Active. Subtitle reads "AI Receptionist room · No product or service attached". Toast "AI Receptionist room added (no service attached)" | ● Works | The kiosk effect is in F-2 |
| F-1.6: Type | Select | Doctor Room, Pharmacy, Diagnostic Lab, Billing Desk, Front Desk | ● Works | Hidden when editing a service room (G9-RM-10) |
| F-1.7: Name check | State | A whitespace-only label shows "Please enter a room name" | ● Works | An empty field is stopped first by the browser's own required prompt (G9-RM-09) |
| F-1.8: Edit standalone room | Drawer | Updates the station. Toast "Room updated successfully" | ● Works | |
| F-1.9: Edit service room | Drawer | Saving writes back to the Products & Services room (name, number, location, direction, responsible, active) | ◐ Simulated | An emptied number, location or direction keeps its old value, so these cannot be cleared (G9-E-18) |
| F-1.10: Activate / Disable | Pill and row action | Toggles Active. Toast "Room activated" or "Room disabled" | ● Works | |
| F-1.11: Delete Room | Row action | Native browser confirm "Remove …?" then removes the room | ◐ Simulated | For a service room it permanently deletes it from Products & Services (G9-E-14). Decision needed: D-32 |
| F-1.12: Empty search | State | "No rooms match your filter. Click Add Room to configure an AI Receptionist room." | ● Works | |
| F-1.13: Access | State | Only the SystemAdmin role opens the tab. Others are sent to the home page with a toast | ● Works | Decision needed: D-16 |
| F-1.14: Per-organisation rooms | Rule | Rooms and stations are kept in shared browser storage, not by organisation | ○ Not built | Every organisation's rooms show in the table (G9-E-17) |
| F-1.15: Source badge and Product / Service column | Column | Earlier intent: show where a room comes from and what is attached | ○ Not built | Decision needed: D-125 |
| F-1.16: Station types as kiosk zone cards | Rule | Earlier intent: each type maps to a kiosk zone card | ○ Not built | See F-2.5 |

#### 3. Worked example
Rohan opens a second blood collection bay.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New bay | Presses **Add Room**, enters "Lab Bay B", `#204`, type **Diagnostic Lab**, Active, and saves | **Toast "AI Receptionist room added (no service attached)" and the row appears at the top** |
| 2 | Typo in the label | Clears the label to spaces and saves | **"Please enter a room name" and nothing is saved** |
| 3 | Old pop-up booth | Presses **Delete Room** on a service room and accepts the browser prompt | **The room is gone from this table and from Products & Services** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I open or reassign rooms, I want one table to maintain rooms and covering doctors, so that the clinic list stays correct. |
| F-1-J2 | Practice Admin | When I retire a room, I want to switch it off without losing it, so that nothing else is broken. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a label of spaces, **when** the user saves, **then** "Please enter a room name" shows and nothing is saved. |
| F-1-2 | **Given** a new standalone room is saved, **then** the toast reads "AI Receptionist room added (no service attached)" and it is listed first. |
| F-1-3 | **Given** a service room is edited and a number is cleared, **when** the user saves, **then** the old number is kept. |
| F-1-4 | **Given** Delete Room is accepted on a service room, **then** the room is removed from Products & Services too. |

### F-2: Rooms on the kiosk (visibility)

#### 1. What it does
The idea is one shared room list for booking, queue and directions. As built, the kiosk reads service rooms. Meera sees a service room renamed here show on the kiosk. A room made only here does not.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Hide inactive rooms | Rule | Rooms switched off are left out of the kiosk directory | ● Works | |
| F-2.2: Directions directory | Source | Built from active Products & Services rooms | ◐ Simulated | Standalone rooms are used only when no service room exists. Five are seeded, so they never appear (G9-E-15) |
| F-2.3: Standalone rooms in directions | Rule | Rooms added with Add Room appear in kiosk directions | ○ Not built | The kiosk station list also drops rooms saved under a real organisation id (G9-E-15) |
| F-2.4: Walk-in doctor booking and ticket pairing | Rule | Earlier intent: active Doctor Room entries pair each ticket with its room | ○ Not built | Same cause as F-2.3. Only service rooms are read |
| F-2.5: Station type to ticket prefix | Rule | Every service room becomes a Doctor Room station, so its tickets use the `D-` prefix | ◐ Simulated | Directory grouping is guessed from the service name (G9-E-16). Decision needed: D-124 |
| F-2.6: Room edits reach the kiosk | Sync | The kiosk re-reads rooms whenever it asks for stations or directions | ◐ Simulated | Same browser profile only. Service rooms only (G9-AR-02) |
| F-2.7: Shared with Products & Services and appointments | Rule | The rooms store is the same one used by Products & Services and appointment room allocation | ● Works | Cross-module write path (G9-RM-11) |

#### 3. Worked example
Rohan renames a service room.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Room 102 becomes "Eye Suite 102" | Edits the label and saves | **The service shows the new name, and the kiosk shows it when it next reads rooms** |
| 2 | Lab Bay B added here | Meera asks the kiosk for directions to the lab | **Lab Bay B is not listed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | After I rename a room once, I want the kiosk and the desk to use the same name, so that I never re-enter it. |
| F-2-J2 | Patient | When I ask the kiosk for directions, I want the room number to match the door, so that I walk to the right place. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a service room is switched off, **when** the kiosk builds its directory, **then** the room is not listed. |
| F-2-2 | **Given** service rooms exist, **when** a standalone room is added, **then** the kiosk directory does not list it. |
| F-2-3 | **Given** any service room, **then** its kiosk tickets use the `D-` prefix. |

### F-3: Stage guidance cards

#### 1. What it does
In Workflows, Rohan opens a stage and presses **Stage Portal & Reception Settings**. He types a **Card Title**, a **Card Description** and the card body in an **HTML** tab. The **Preview** tab shows it with sample patient values. A **Select Fields** picker inserts placeholders. He presses **APPLY**. When a verified patient later asks the kiosk "what is my next step", the card appears.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Card Title and Card Description | Fields | Title is required. If left empty the stage name is used | ● Works | |
| F-3.2: HTML and Preview tabs | Editor | HTML authoring and a rendered preview | ● Works | The preview uses a fixed sample patient, "Priya Sharma" |
| F-3.3: Select Fields picker | Picker | Searchable, grouped under CLIENTS, APPOINTMENTS, INVOICES and STAGE. Inserts a placeholder token and a toast | ● Works | A fixed list of 18 fields. No custom fields |
| F-3.4: Apply | Action | Saves the card on the stage. Toast `Settings saved for stage "<stage>"` | ● Works | |
| F-3.5: Card on the kiosk | Display | The verified patient's Next Step shows title, description and a View Details sheet | ◐ Simulated | Appointment and invoice placeholders are replaced with fixed sample values, so patients see invented data. Other placeholders stay as typed (G11-E-32). A staff-only stage can show (G11-E-33). Guidance HTML is shown unfiltered (G11-E-09). Decision needed: D-126 |
| F-3.6: Cancel | Action | Closes without saving | ● Works | |
| F-3.7: Custom fields as placeholders | Picker | Earlier intent: placeholders resolve from custom fields | ○ Not built | |

#### 3. Worked example
Rohan prepares a pre-lab card.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Diagnostics stage | Enters the title "Pre-Lab Verification", inserts **Client First Name** and **Appointment Time**, checks **Preview**, presses **APPLY** | **The toast confirms the stage is saved** |
| 2 | Verified patient at the kiosk | Asks "what is my next step" | **The card appears. The appointment time and doctor come from fixed sample values, not from the patient's booking** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When I build care stages, I want a preview and a field picker, so that every patient gets clear next-step text. |
| F-3-J2 | Patient | When I move through care, I want the kiosk to tell me what my stage needs, so that I do not wait confused. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the card editor, **when** the title is empty and the user presses APPLY, **then** the stage name is used as the title. |
| F-3-2 | **Given** a placeholder is inserted, **when** the Preview tab opens, **then** it shows the fixed sample patient's value. |
| F-3-3 | **Given** a card is applied, **when** a verified patient opens Next Step, **then** the card is shown. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Manage Clinic Rooms & Desks | F-1.1 – F-1.16 | ● / ◐ / ○ | Table, drawer and toggle work. Delete reaches Products & Services. |
| F-2 | Rooms on the kiosk | F-2.1 – F-2.7 | ◐ / ○ | Service rooms reach the kiosk. Standalone rooms do not. |
| F-3 | Stage guidance cards | F-3.1 – F-3.7 | ● / ◐ | Editor works. Kiosk fills booking and invoice placeholders with sample values. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Maintain rooms and doctors in one table | F-1 |
| 2 | Practice Admin | Retire a room without losing it | F-1 |
| 3 | Practice Admin | Rename once and keep the kiosk aligned | F-2 |
| 4 | Patient | Find the right room from the kiosk | F-2 |
| 5 | Practice Admin | Write next-step cards with preview and fields | F-3 |
| 6 | Patient | See what my stage needs | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| SystemAdmin | Open the tab, add, edit, disable and delete rooms, edit service rooms, write stage cards | Nothing |
| Admin, Manager, Agent, Reception | See Settings in the menu | Opening it. A click sends them home with "Access restricted: Settings requires System Admin privileges." |
| Kiosk visitor | Read the directory and cards | Everything else |

The earlier PRD named practice managers, care coordinators and operations leads as the users. They are locked out today. Decision needed: D-16.

## 5. Metrics and definitions

The room-count badge and the preset counts (All, Products & Services, AI Receptionist, Active) are plain counts of the merged table. No other metric is shown.

## 6. Cross-module journeys this module appears in

The rooms and cards sit behind the kiosk but are not a step in the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-16 | Should Admin and Manager roles reach AI Receptionist settings, perhaps Rooms only? | F-1.13 |
| D-32 | May a room used by a service be deleted, or only deactivated? | F-1.11 |
| D-124 | How is station type set for service rooms, and how do prefixes follow it? | F-2.5 |
| D-125 | Should the table and kiosk show a source badge and the attached service? | F-1.15 |
| D-126 | What should Next Step show for a patient in no AI-connected process? | F-3.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
