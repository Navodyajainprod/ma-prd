---
title: "Team Members, Roles, Departments & Seat Usage"
product: "client"
module: "settings"
channel: "team"
route: "/settings/team"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS |
| Route | `/settings/team` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The Team tab of Settings with three sub-tabs: Users, Roles and Departments. It also holds a member drawer and an unlinked manage-member page at `/settings/team/:id`. |
| **Who uses it** | Practice Admin. Only the System Admin role passes the Settings guard. Nothing on this tab checks any other role. |
| **Where you start it** | **Settings** in the sidebar, then **Team**. `/roles` redirects to the Roles sub-tab. |
| **Where the result goes** | Members flagged "can book appointments" appear in Appointments. Assigned services sync to the Services catalogue. Seats are shown in Billing. |
| **How real is it** | 1 feature works, 2 are partly simulated, 1 is not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Plan seats and role templates | Plan seat quotas come from the admin catalogue. The tenant Team tab never compares team size with them. | [View Admin Plans](/admin/plans/plans) |
| Client (Billing) | Seats | Included plus extra seats are shown in Billing. Nothing blocks or warns when a member is added past that number (G10-E-05). | [View Billing](/client/settings/billing) |
| Client (Appointments) | Bookable members | Members flagged "can book appointments" appear as bookable users. | [View Appointments](/client/appointments/list) |
| Client (Services) | Member services | Services assigned to a member sync to the services catalogue. | [View Services](/client/services) |
| Client (Claims) | Provider NPI | Not connected. No NPI or licence field exists, so nothing reaches a claim. | [View Claims](/client/claims) |
| Client (Organization) | Locations | A member who takes appointments must have at least one location from the Organization tab. | [View Organization](/client/settings/organization) |

## 1. Module Summary

### The story in one minute

Rohan Mehta opens **Team**. The Users table shows each member with role, email, created at, status, credits and usage balance. He presses **Add User** and types a name, an email, a department and a role. He turns on "can book appointments" and picks Downtown. He saves. The new member shows as Active at once. No email is sent and there is no Pending state. He then makes Priya an administrator with one click and removes a former employee after a confirmation. On the Roles sub-tab he creates a role with a permission matrix and saves it. Nothing in the app reads that matrix, and the roles vanish when the tab closes.

**Naming note:** the earlier PRD said "Team & Roles", with roles Admin, Doctor, Nurse, Coordinator and Billing. The Add User drawer offers Admin, Manager, Specialist, Reception, Sales and Agent. Decision needed: D-11.

### What is real and what is not

- **Real in the prototype:** the Users table with filters and search, adding a member, Make or Remove Administrator, removal with confirmation, the member drawer, and the Departments sub-tab.
- **Simulated:** the Credits and Usage Balance columns, Created At fallback, roles kept in session storage only, the permission matrix that nothing enforces, a second unsynchronised `/users` page outside the Settings guard, and an Add User flow that adds instantly and ignores plan seats.
- **Not built:** emailed invitations with Pending, resend and 7-day expiry, an active toggle, a seat check, NPI and state licence registry, and the manage-member page link.

### Journey position

```
Settings ─▶ Team ─▶ Add User ─▶ Active member ─┬▶ Appointments (bookable)
                                               ├▶ Services catalogue
                                               └▶ Seats in Billing (not checked)
```

## 2. Feature Requests

### F-1: Users

#### 1. What it does
Rohan sees every member in a table. Presets **All**, **Admins** and **Members & Staff** show counts. A search box matches name or email. A row menu holds **Edit**, **Make Administrator** or **Remove Administrator**, and **Remove**. **Add User** opens a drawer. Editing opens the member drawer with **Personal info**, **Calendar**, **Availability**, **Days off**, **Services** and **Security** tabs.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Users table | Table | Name, Role, Email, Created At, Status, Credits, Usage Balance | ◐ Simulated | Credits shows "0 / 0", Usage Balance is 0 percent and Created At falls back to a fixed date. Hardcoded, formula undefined (G10-E-08). Decision needed: D-30 |
| F-1.2: Presets and search | Chips, search | All, Admins, Members & Staff with counts. Search by name or email | ● Works | Admin count is the users whose role text contains "admin" |
| F-1.3: Add User | Drawer | Name, email, department, role, "can book appointments", locations. Saves the member as Active at once | ◐ Simulated | No email is sent. The role list is fixed and unrelated to the Roles tab (G10-E-11). A second older Add User drawer opens on the same button (G10-E-10). Decision needed: D-11 |
| F-1.4: Add User validation | State | Name and email are required, email must match a pattern, and at least one location is needed when booking is on | ● Works | |
| F-1.5: Seat limit check | Rule | Adding a member does not compare team size with plan seats | ○ Not built | Invites ignore plan seat limits (G10-E-05). Decision needed: D-55 |
| F-1.6: Email invitation, Pending, resend, 7-day expiry | Flow | Described in the earlier PRD | ○ Not built | Pending exists in the data model and is never set (G10-I-12). Decision needed: D-47 |
| F-1.7: Make or Remove Administrator | Row action | Switches the role text between Admin and Member with a toast | ● Works | No confirmation |
| F-1.8: Remove user | Row action | Opens a confirmation modal. Confirm deletes the user | ● Works | |
| F-1.9: Active toggle that revokes sessions | Switch | Described in the earlier PRD | ○ Not built | A handler exists but no control calls it. The status badge is always green (G10-E-06) |
| F-1.10: Member drawer | Drawer | Personal info, calendar, availability, days off, services and security tabs. Changes persist to the team store | ● Works | Assigned services sync to the Services catalogue |
| F-1.11: Manage member page | Page | `/settings/team/:id` with calendar, availability, days off, services and a coarse view-or-write permission list | ○ Not built | Nothing links to it. Opened directly it redirects away (G10-E-07) |
| F-1.12: Second user manager | Page | `/users` lists users with credits, add, edit, permissions and credit modals | ◐ Simulated | Outside the Settings guard, with its own session-storage list seeded with sample users (G10-E-09). Decision needed: D-05 |

#### 3. Worked example
Rohan adds a coordinator.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A coordinator joins | Presses **Add User**, enters name, email, role and one location, saves | **The member is Active in the table. No email is sent** |
| 2 | Priya needs admin rights | Chooses **Make Administrator** | **Her role reads Admin at once with no confirmation** |
| 3 | The plan covers 5 seats and 5 are used | Adds a sixth member | **The member is added. No warning appears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I hire staff, I want to add them with the right role and location, so that they can start work. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a missing name or email, or an invalid email, **when** the user saves, **then** save is blocked. |
| F-1-2 | **Given** "can book appointments" with no location, **when** the user saves, **then** save is blocked. |
| F-1-3 | **Given** a valid form, **when** the user saves, **then** the member is Active at once. No invitation email is sent. |
| F-1-4 | **Given** Remove and Confirm, **then** the user disappears. **Given** Cancel, **then** nothing changes. |
| F-1-5 | **Given** a team already at the plan's seat count, **when** a member is added, **then** the add succeeds with no check. |

### F-2: Roles and permissions

#### 1. What it does
On the Roles sub-tab Rohan sees a table of roles. **Create Role** opens a drawer with a module-by-action matrix (read, add, edit, delete, export, import) with scope choices. Seed roles are Admin, Manager and Executive. Saving keeps the role. Nothing then reads it.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Roles table | Table | Role name and description | ◐ Simulated | Roles live in session storage and vanish when the tab closes (G10-E-04) |
| F-2.2: Create or edit role | Drawer | A permission matrix per module | ◐ Simulated | Saved but never checked by any page or action (G10-E-03) |
| F-2.3: Permissions panels | Panels | Per-user permission controls in the member screens and the `/users` page | ◐ Simulated | Not wired to anything (G10-E-03) |
| F-2.4: Enforcement | Rule | A role set to deny blocks that module | ○ Not built | A deny-all role has no effect. Decision needed: D-12 |

#### 3. Worked example
Rohan limits a new role.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants a billing-only role | Creates a role and sets every other module to deny | **The role is saved** |
| 2 | A member holds that role | Signs in and opens Clients | **Clients opens as normal** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When a new role is needed, I want to define what it may do, so that staff only reach what they should. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a saved role, **when** the tab is closed and reopened, **then** the role is gone. |
| F-2-2 | **Given** a role with a module set to deny, **when** a member with that role opens the module, **then** it opens. Nothing is blocked. |

### F-3: Departments

#### 1. What it does
The **Departments** sub-tab lists departments with a count badge. A drawer creates or edits one.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Departments table | Table | Lists departments with a count badge | ● Works | |
| F-3.2: Department drawer | Drawer | Creates or edits a department | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A new Imaging team forms | Creates the department in the drawer | **It is listed and the count badge rises** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When teams change, I want to keep departments up to date, so that members are grouped correctly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a new department, **when** it is saved, **then** it appears in the Departments table. |

### F-4: Practitioner credentials

#### 1. What it does
The earlier PRD wanted a clinician's NPI and state licence on the team record. Nothing in the prototype stores them.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: 10-digit NPI field | Input | Described in the earlier PRD | ○ Not built | No NPI field exists. Decision needed: D-78 |
| F-4.2: State licence number, expiry and 30-day warning | Input | Described in the earlier PRD | ○ Not built | No licence, taxonomy or expiry field exists |
| F-4.3: Credentials on claims and prescription footers | Hand-off | Described in the earlier PRD | ○ Not built | Decision needed: D-78 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dr. Anita Rao needs her NPI on claims | Opens her member drawer | **No NPI or licence field is offered** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Physician | When onboarding, I want to store my NPI and medical licence, so that documentation and billing carry my verified credentials. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a member drawer, **then** it has no NPI, licence or taxonomy field. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Users | F-1.1 – F-1.12 | ● / ◐ / ○ | Add, promote and remove work; no invite email, seat check or active toggle. |
| F-2 | Roles and permissions | F-2.1 – F-2.4 | ◐ / ○ | Matrix is saved in session storage and enforced nowhere. |
| F-3 | Departments | F-3.1 – F-3.2 | ● Works | Create, edit and list departments. |
| F-4 | Practitioner credentials | F-4.1 – F-4.3 | ○ Not built | No NPI or licence fields. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Add staff with the right role and location | F-1 |
| 2 | Practice Admin | Define what a role may do | F-2 |
| 3 | Practice Admin | Keep departments up to date | F-3 |
| 4 | Physician | Store my NPI and licence | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| System Admin (the default role, read from browser storage) | Everything on this tab | Nothing |
| Any other role | Sees Settings in the menu | Opening it. A click shows a message and returns to the home page |
| Any signed-in user | Open `/users` and edit users and credits there | Nothing (outside the Settings guard, G10-E-09) |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names the Practice Administrator and the Physician and says nothing about seat limits, permissions or who may invite. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Sub-tab and preset counts | Team tabs | Count of users, roles or departments |
| Admins count | Preset chip | Users whose role text contains "admin" |
| Credits | Users table | Shows "0 / 0". **Hardcoded, formula undefined** (G10-E-08) |
| Usage Balance | Users table | Percent shown as 0. **Hardcoded, formula undefined** |
| Created At | Users table | Falls back to a fixed date. **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys. Its bookable members and services feed Appointments and Services.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-05 | Is the client `/users` page kept or retired in favour of Team? | F-1.12 |
| D-11 | What is the source of truth for role names and the role model? | F-1.3 |
| D-12 | Where is the role matrix enforced, and who may manage the team? | F-2.4 |
| D-30 | What is the formula for the per-user credits and usage columns? | F-1.1 |
| D-47 | Emailed invitation with Pending, resend and expiry, or instant add? | F-1.3, F-1.6 |
| D-55 | Should adding a member block, warn or auto-bill at the plan seat limit? | F-1.5 |
| D-78 | Are NPI, licence and taxonomy in scope, and are they used on claims? | F-4.1, F-4.3 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
