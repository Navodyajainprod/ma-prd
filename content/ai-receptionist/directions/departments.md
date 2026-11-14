---
title: "Clinic Zones & Department Directory"
product: "ai-receptionist"
module: "directions"
channel: "departments"
route: "/reception/directions"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | DIRECTIONS: CLINIC ZONES AND DEPARTMENTS (`/reception/directions`) |
| Route | `/reception/directions` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A touch screen on the lobby kiosk that lists the clinic's departments as large cards with room counts, and opens a list of rooms when a card is tapped. |
| **Who uses it** | Patient (any visitor at the lobby kiosk). No sign-in and no identity check: the kiosk routes are open to anyone. |
| **Where you start it** | The **Directions** tile on the kiosk home screen, the **Directions** button on the floating dock, or by asking Aria for directions. The URL `/reception/directions` also opens it. |
| **Where the result goes** | Nowhere. It only shows information. A view is written to the kiosk browser's own audit list. |
| **How real is it** | 1 feature works, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Reception Settings) | Rooms feed the department cards | The rooms an admin configures in Reception Settings are grouped into the kiosk's categories. The kiosk reads the same browser store. A running kiosk does not refresh when a room is edited. | [View Reception Settings](/client/settings/reception) |
| Client (Services) | Service names decide the category | A room lands in Dental, Diagnostics & Imaging or Consultation & Clinics by keywords in its service name. Everything else goes to Other. | [View Services](/client/services) |
| Companion | Room names in the patient app | Companion does not read the kiosk's room list. No shared directions screen exists. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson walks into the lobby for her cataract check and does not know where the diagnostic lab is. She taps **Directions** on the home screen. Aria says that these are all clinic departments and asks her to pick one. The screen shows large cards, each with a room count. Sarah taps **Diagnostics & Imaging** and the room list opens. If she changes her mind she taps **Back to Categories**. If the clinic has not set up any rooms, the kiosk shows built-in example zones instead, with invented staff names. Sarah does not know the difference. Meera Iyer, at the front desk, sets the rooms in Reception Settings, but her edits reach a running kiosk only after it reloads.

**Naming note:** the old PRD called the cards Clinical & Doctors, Pharmacy & Labs and Facilities & Restrooms. The screen shows Consultation & Clinics, Dental, Diagnostics & Imaging and Other. The old names appear only in the fallback zones. Decision needed: D-125.

### What is real and what is not

- **Real in the prototype:** the category grid built from the clinic's rooms, room counts per card, hidden empty categories, the room list, the Back control, the spoken welcome in English or Hindi, and the dock shortcuts to Home and Check-In.
- **Simulated:** with no rooms configured, or when rooms fail to load, the kiosk shows built-in example zones with invented doctors (G11-E-35).
- **Not built:** live refresh when an admin edits a room (G11-E-36), a visible load-error message, and an explicit department field on a room.

### Journey position

```
Home / dock / voice ─▶ Department cards ─▶ Room list ─▶ Room directions (see Rooms page)
```

## 2. Feature Requests

### F-1: Department grid

#### 1. What it does
Sarah taps **Directions** and the **Clinic Departments** grid opens. The cards come from the rooms the clinic has configured. Each card shows its name and how many rooms it holds. Empty categories are hidden. Aria speaks a short welcome in the language on screen.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Category cards | Grid | Groups the clinic's rooms into Consultation & Clinics, Dental, Diagnostics & Imaging and Other, chosen by keywords in each room's service name | ● Works | Differs from the old PRD names (G11-I-82). A room with an unrelated service name lands in Other (G11-I-83). Decision needed: D-125 |
| F-1.2: Room count | Label | Each card shows the number of rooms, for example "3 rooms & locations" | ● Works | |
| F-1.3: Hidden empty categories | Rule | A category with no rooms is not shown | ● Works | |
| F-1.4: Spoken welcome | Audio | Aria says all departments are shown and asks the visitor to pick one, in English or Hindi | ● Works | Muted when the kiosk is muted |
| F-1.5: Fallback zones | State | With no rooms, or if rooms fail to load, built-in example zones appear as if real | ◐ Simulated | Invented staff such as a cardiologist and a paediatrician (G11-E-35) |
| F-1.6: Live room sync | Rule | Rooms are read once when the screen opens | ◐ Simulated | An admin's room edit does not reach a running kiosk until reload (G11-E-36) |
| F-1.7: Load error message | State | None exists | ○ Not built | The kiosk silently shows the fallback zones |
| F-1.8: Fixed zones Clinical & Doctors, Pharmacy & Labs, Facilities & Restrooms always present | Rule | Described in the earlier PRD | ○ Not built | They appear only as the fallback when no rooms exist. Decision needed: D-125 |

#### 3. Worked example
Sarah looks for the lab.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Home screen is showing | Taps **Directions** | **The department grid opens with a room count on each card and Aria speaks a welcome** |
| 2 | The clinic has no Dental rooms | Looks at the grid | **There is no Dental card** |
| 3 | The clinic has set up no rooms at all | Opens Directions | **Built-in example zones are shown as if they were real** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I look for a department in an unfamiliar building, I want clear categories showing how many rooms each holds, so that I can find where to go without queuing at the desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** rooms are configured, **when** Directions opens, **then** one card per non-empty category is shown with its room count. |
| F-1-2 | **Given** a category has no rooms, **then** its card is not shown. |
| F-1-3 | **Given** no rooms are configured, **when** Directions opens, **then** built-in example zones are shown and no message says they are examples. |
| F-1-4 | **Given** an admin edits a room while the kiosk is open, **then** the cards do not change until the screen is reopened. |

### F-2: Room list for a department

#### 1. What it does
Sarah taps a card. The route changes to `/reception/directions/<category>` and the list of rooms in that category opens. Aria asks her to choose a destination. **Back to Categories** returns to the grid.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Room cards | List | Lists the rooms in the chosen category with their floor or wing | ● Works | The clinician name on the card is not shown here (see Rooms page G11-I-93) |
| F-2.2: Back to Categories | Button | Returns to the grid | ● Works | |
| F-2.3: URL-synced route | Route | The address follows the visitor, and an unknown category or room in the address falls back to the category or room list | ● Works | G11-I-87 |
| F-2.4: Audit entry | Log | Each category view adds an entry to the kiosk's own browser audit list | ◐ Simulated | Not in the clinic audit log (G11-E-13). Decision needed: D-42 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah is on the grid | Taps **Diagnostics & Imaging** | **The room list for that category opens and the address shows its category** |
| 2 | She opened a bad link | Loads an address with an unknown category | **The category list opens instead of an error** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | After tapping a zone, I want to see each room's name and floor, so that I pick the right one before I read the walking steps. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a category card is tapped, **then** only rooms in that category are listed and Back to Categories returns to the grid. |
| F-2-2 | **Given** an unknown category in the address, **then** the category list is shown. |

### F-3: Leave directions or switch to Check-In

#### 1. What it does
Sarah can leave at any time. The dock stays on screen, so she can jump to Check-In or Billing in one tap. **Start over** and the 60-second inactivity timer return the kiosk to the home screen.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Dock shortcuts | Buttons | Go to Home, Check-In or Billing from the grid or the room list | ● Works | G11-I-86 |
| F-3.2: Privacy reset | Rule | Inactivity or **Start over** returns to home | ● Works | The reset does not clear every piece of kiosk state (G11-E-10) |
| F-3.3: Camera | Rule | The camera stream is stopped when Directions opens | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah found the lab, now wants to check in | Taps **Appointment** on the dock | **Check-In opens without going Home first** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | After I see where a room is, I want to go to Check-In in one tap, so that I do not retrace my steps. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the grid or room list is open, **when** the visitor taps a dock button, **then** the matching flow opens. |
| F-3-2 | **Given** no touch for 60 seconds, **then** the kiosk returns to the home screen. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Department grid | F-1.1 – F-1.8 | ● / ◐ / ○ | Cards and counts work; fallback zones are invented and edits do not refresh. |
| F-2 | Room list | F-2.1 – F-2.4 | ● / ◐ | Room list and route work; audit entry stays in the kiosk browser. |
| F-3 | Leave or switch | F-3.1 – F-3.3 | ● Works | Dock and reset work. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Find a department without queuing at the desk | F-1 |
| 2 | Patient | See each room's name and floor before the walking steps | F-2 |
| 3 | Patient | Go to Check-In in one tap after finding a room | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor at the kiosk | Open Directions, browse categories and rooms | Nothing. The kiosk routes sit outside sign-in |
| Front-desk Staff (Meera) | Set rooms in Reception Settings | Nothing is checked. Any signed-in user can edit rooms |

The old PRD named the visitor only and set no access rules. Decision needed: D-46.

## 5. Metrics and definitions

The screen shows one number: the room count on each card. It is the count of rooms in that category.

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys. Directions is an information screen with no hand-off to Appointments or Billing.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-125 | Should kiosk departments come from an explicit field on a room, and should Pharmacy, Labs and Restrooms always appear? | F-1.1, F-1.8 |
| D-42 | Which kiosk events must be audited, and where are they stored? | F-2.4 |
| D-46 | What is the kiosk and patient access model? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
