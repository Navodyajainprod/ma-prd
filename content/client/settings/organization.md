---
title: "Organizations, Business Profile & Operating Locations"
product: "client"
module: "settings"
channel: "organization"
route: "/settings/organization"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS |
| Route | `/settings/organization` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The Organization tab of Settings. A searchable table of organizations, a Create Organization form, an organization drawer to edit one, and a locations editor with hours and days off. |
| **Who uses it** | Practice Admin. Only the System Admin role passes the Settings guard. Any other role is sent back to the home page. |
| **Where you start it** | **Settings** in the sidebar, then **Organization**. It is the default Settings tab. `/settings/security` also lands here. |
| **Where the result goes** | The organization table, the staff and booking screens that read locations, and plan selection in Billing. |
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
| Admin | Organizations | Organizations created or edited by platform staff appear in the same list. The tab behaves as a multi-organization manager, not a single practice profile. | [View Admin Organizations](/admin/organizations) |
| Client (Billing) | Plan choice | The organization's industry category and location decide which plans it can choose. | [View Billing](/client/settings/billing) |
| Client (Team) | Locations for staff | Locations defined here are offered when adding a team member. A member who takes appointments needs at least one. | [View Team](/client/settings/team) |
| Client (Appointments) | Locations in booking | Appointment, services and portal booking screens read the saved locations. Room-level filtering is not verified. | [View Appointments](/client/appointments/list) |
| Client (Custom Fields) | Organization fields | Custom-field values for an organization sit in the drawer. They are lost on Save (G10-E-01). | [View Custom Fields](/client/settings/custom-fields) |

## 1. Module Summary

### The story in one minute

Rohan Mehta opens **Settings** and lands on **Organization**. A table lists the organizations with name, email, industry, preferred time, users and created on. He types "Metro" in the search box and opens Metro Health. A drawer slides in with **General**, **Availability** and **Security** tabs. He changes the phone number and the status and presses Save. A success message shows and the table has the new values. He also uploads a logo and sets a timezone. Both appear in the drawer, but neither is written on Save. Then he adds a second location, Westside, with weekday hours and a day off. Staff and booking screens offer Westside straight away.

**Naming note:** the earlier PRD called this "Practice Profile" for one clinic. The screen is a list of organizations. Decision needed: D-44.

### What is real and what is not

- **Real in the prototype:** the organization list with search and industry-category filter, Create Organization, editing name, email, phone, industry, location and status, and the locations editor with primary flag, Online location, hours and days off.
- **Simulated:** the Users, Created On and Preferred time columns are fixed values. Save shows success but drops the logo, timezone, hours and custom-field values. Locations live in the browser only.
- **Not built:** brand primary colour, legal entity name, medical director and tax ID on receipts, the Business Profile screen (code exists, no control opens it), and the logo in the top bar, invoices and the portal.

### Journey position

```
Settings ─▶ Organization ─┬▶ Drawer edit ─▶ Table
                          ├▶ Locations ─▶ Team, Appointments, Services, Portal booking
                          └▶ Industry category ─▶ Billing plan choice
```

## 2. Feature Requests

### F-1: Organization list, create and edit

#### 1. What it does
Rohan sees a table of organizations. He searches by name and filters by industry category. **Create Organization** opens a form. Clicking a name opens the drawer. Save checks only that the name is filled, then updates the table.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Organization table | Table | Name, email, industry, preferred time, users, created on | ◐ Simulated | Users is always 1, Created On is a fixed string and Preferred time is fixed for every row. Hardcoded, formula undefined (G10-E-02). Decision needed: D-44 |
| F-1.2: Search and industry-category filter | Search, filter | Narrows the table | ● Works | |
| F-1.3: Create Organization | Modal | Name and email are required. Category, industry and location are chosen. The organization is added to the list | ● Works | |
| F-1.4: Organization drawer | Drawer | General, Availability and Security tabs. Save requires a name | ◐ Simulated | Save writes only name, email, phone, industry category, industry, location and status. A success message still shows (G10-E-01). Decision needed: D-44 |
| F-1.5: Loading and error states | State | None exist | ○ Not built | Data is browser-local, so nothing loads or fails |
| F-1.6: Role control | Rule | Only the System Admin role opens Settings. No finer rule exists | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Rohan updates Metro Health.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Metro Health has a new phone number | Opens the drawer, edits the phone and status, presses Save | **The table shows the new phone and status** |
| 2 | He clears the name | Presses Save | **Save is blocked with an error** |
| 3 | He also set a timezone | Presses Save | **A success message shows. The timezone is not stored** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When my organization details change, I want to update them, so that records stay accurate. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a changed name, email, phone, industry, location or status, **when** the user presses Save, **then** the table shows the new values. |
| F-1-2 | **Given** an empty name, **when** the user presses Save, **then** save is blocked with an error. |
| F-1-3 | **Given** a changed logo, timezone, hours or custom-field value, **when** the user presses Save, **then** a success message shows and those values are not stored. |

### F-2: Logo, business profile and branding

#### 1. What it does
Rohan uploads a logo in the drawer and sees it in the drawer preview. A toast confirms the upload or the removal. The wider branding intent of the earlier PRD is not delivered.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Logo upload | Uploader | Rejects a file over 2 MB. Shows a toast on success or removal | ◐ Simulated | The earlier PRD said 5 MB and PNG or SVG. No format check was found. The logo is not saved (G10-E-01). Decision needed: D-44 |
| F-2.2: Business Profile | Modal | A read-only sheet of fixed sample values (business name, type, industry, region, registration ID type) | ○ Not built | The code exists but nothing opens it from this tab. Decision needed: D-44 |
| F-2.3: Brand primary colour | Colour input | A hex colour for patient-facing surfaces | ○ Not built | No colour field exists (G10-I-03) |
| F-2.4: Legal entity name, medical director and tax ID on receipts | Fields | Described in the earlier PRD | ○ Not built | Decision needed: D-44 |
| F-2.5: Logo in the top bar, invoices and the patient portal | Branding | Described in the earlier PRD | ○ Not built | The invoice document does not use the organization logo (G7-I-38) |

#### 3. Worked example
Rohan brands Metro Health.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He has a 1 MB PNG | Uploads it in the drawer | **The logo shows in the drawer with a success toast** |
| 2 | He has a 3 MB file | Uploads it | **The upload is rejected with a message** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When configuring our workspace, I want our official branding and legal details recorded, so that invoices and communications look professional. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a file above 2 MB, **when** it is chosen, **then** the upload is rejected with a message. |
| F-2-2 | **Given** an uploaded logo, **when** the drawer is saved, **then** the logo is not stored and no other screen shows it. |

### F-3: Operating locations

#### 1. What it does
Inside the organization, Rohan adds Downtown and Westside. Name is required. Address, city, state and ZIP are optional. He can add an **Online** location. He marks one primary, sets hours per day and adds days off. A shortcut applies 9:00 AM to 5:00 PM Monday to Friday. Staff, appointments and services read the saved list.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Add location | Form | Name is required. Address parts are optional. An Online variant exists. A toast confirms | ● Works | |
| F-3.2: Primary location | Toggle | One location is primary | ● Works | |
| F-3.3: Hours and days off | Editor | Hours per day, dated days off and the Mon-Fri 9-5 shortcut | ● Works | A repeat day off is rejected with a message |
| F-3.4: Delete location | Action | Asks for confirmation. The last location cannot be deleted | ● Works | |
| F-3.5: Use in staff and booking | Logic | Add User needs at least one location when "can book appointments" is on. Appointments, Services and portal booking read the list | ● Works | Room-level filtering is not verified (G10-I-05) |
| F-3.6: Storage | Rule | Locations are saved per organization in browser storage | ◐ Simulated | They exist only in this browser |
| F-3.7: Location phone number | Field | Described in the earlier PRD | ○ Not built | No phone field exists at location level (G10-I-04) |

#### 3. Worked example
Rohan opens a branch.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A second clinic opens | Adds **Westside** with its address | **Westside is listed and offered when adding a team member** |
| 2 | Westside is closed on a holiday | Adds the date as a day off, then adds it again | **The second attempt is rejected** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When I open a satellite clinic, I want to add its location and hours, so that appointments can be scheduled specifically for that site. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a location with no name, **when** the user saves, **then** save is blocked with a message. |
| F-3-2 | **Given** a day already marked off, **when** the user adds it again, **then** it is rejected. |
| F-3-3 | **Given** only one location, **when** the user deletes it, **then** a message says an organization needs at least one. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Organization list, create and edit | F-1.1 – F-1.6 | ● / ◐ / ○ | List, search and create work; Save drops most drawer fields. |
| F-2 | Logo, business profile and branding | F-2.1 – F-2.5 | ◐ / ○ | Logo upload is not saved; colour and legal details absent. |
| F-3 | Operating locations | F-3.1 – F-3.7 | ● / ◐ / ○ | Locations, hours and days off work in the browser only. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Update organization details so records stay accurate | F-1 |
| 2 | Practice Admin | Record official branding and legal details | F-2 |
| 3 | Practice Admin | Add a branch location with hours | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| System Admin (the default role, read from browser storage) | Open the tab, create and edit organizations, edit locations | Nothing |
| Any other role | Sees Settings in the menu | Opening it. A click shows a message and returns to the home page |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names the Practice Administrator and says nothing about other organizations. The prototype lists every organization visible to the workspace. Decision needed: D-12, D-44.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Users | Organization table | Always 1. **Hardcoded, formula undefined** (G10-E-02) |
| Created On | Organization table | A fixed string. **Hardcoded, formula undefined** |
| Preferred time | Organization table | A fixed value. **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys. Its locations and industry category feed the staff, booking and plan screens.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-12 | Where is access enforced, and who may open Settings besides the System Admin role? | F-1.6 |
| D-44 | Are the logo (size, formats), brand colour and tax ID on receipts in scope, and may a client administrator see or create other organizations? | F-1.1, F-1.4, F-2.1, F-2.2, F-2.4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
