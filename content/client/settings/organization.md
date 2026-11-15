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
| **What it is** | The Organization tab of Settings. A searchable table of organizations, a Create Organization form, and an organization drawer with General, Availability and Security tabs. Availability holds one card per location with its details, timezone and weekly time slots. |
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

Rohan Mehta opens **Settings** and lands on **Organization**. A table lists the organizations with name, email, industry, preferred time, users and created on. He types "Metro" in the search box and opens Metro Health. A drawer slides in with **General**, **Availability** and **Security** tabs. On **Availability** he presses **Add Location**, renames the new card Westside, picks its timezone and gives Saturday two time slots. The hours are written to the browser as he edits, so staff and booking screens offer Westside straight away. He then presses **Save Changes** on the drawer. Nothing visible happens: the drawer stays open, no message shows and the table is unchanged. He also uploads a logo. It shows in the drawer but is never stored.

**Naming note:** the earlier PRD called this "Practice Profile" for one clinic. The screen is a list of organizations. Decision needed: D-44.

### What is real and what is not

- **Real in the prototype:** the organization list with search and industry-category filter, Create Organization, the drawer's General fields, and the Availability tab with per-location details, primary flag, Online type, timezone and weekly time slots.
- **Simulated:** the Users, Created On and Preferred time columns are fixed values. The drawer's **Save Changes** fails in code, so the table never gets drawer edits. The Security tab holds browser-only settings that are saved nowhere. Locations live in the browser only.
- **Not built:** brand primary colour, legal entity name, medical director and tax ID on receipts, the Business Profile screen (code exists, no control opens it), the logo in the top bar, invoices and the portal, and days off for a location (the control was removed on 2026-11-14).

### Journey position

```
Settings ─▶ Organization ─┬▶ Drawer General / Security ─▶ Table (Save Changes fails)
                          ├▶ Drawer Availability ─▶ Team, Appointments, Services, Portal booking
                          └▶ Industry category ─▶ Billing plan choice
```

## 2. Feature Requests

### F-1: Organization list, create and edit

#### 1. What it does
Rohan sees a table of organizations. He searches by name and filters by industry category. **Create Organization** opens a form. Clicking a name opens the drawer. **General** holds **Basic Info** (name, industry category, industry, location) and **Billing Info** (billing address, billing contact name and email), plus custom fields and custom sections from the field registry. A card on the left shows the logo, status, industry, org ID, phone, email and location as read-only text, with **Copy Org ID**. Phone, email and status can no longer be edited in the drawer. **Save Changes** checks that the name is filled and then throws an error in code, so nothing is saved.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Organization table | Table | Name, email, industry, preferred time, users, created on | ◐ Simulated | Users is always 1, Created On is a fixed string and Preferred time is fixed for every row. Hardcoded, formula undefined (G10-E-02). Decision needed: D-44 |
| F-1.2: Search and industry-category filter | Search, filter | Narrows the table | ● Works | |
| F-1.3: Create Organization | Modal | Name and email are required. Category, industry and location are chosen. The organization is added to the list | ● Works | |
| F-1.4: Organization drawer | Drawer | General, Availability and Security tabs. **Save Changes** requires a name | ◐ Simulated | After the name check, the save code reads a variable that is never defined, so it fails: the drawer stays open, no message shows and the table keeps its old values. New on 2026-11-14, no analysis id. The location hours are already stored before the failure. Decision needed: D-44 |
| F-1.5: Loading and error states | State | None exist | ○ Not built | Data is browser-local, so nothing loads or fails |
| F-1.6: Role control | Rule | Only the System Admin role opens Settings. No finer rule exists | ○ Not built | Decision needed: D-12 |
| F-1.7: General tab fields | Form | **Basic Info**: name, industry category, industry (follows the category) and a location list. **Billing Info**: street, city, state, ZIP, billing contact name and email. Custom fields and sections can be added | ◐ Simulated | Edits are held in the drawer only. Billing values and custom-field values are never stored (G10-E-01). The location list holds a fixed set of place names |
| F-1.8: Security tab | Cards | Five cards: Robo Call Detection and Shielding, Blocked Phone Numbers (two sample entries, add and remove), two-factor enforcement with a grace period, Session Inactivity Timeout with Lock Screen on Idle, Password Complexity Policy | ◐ Simulated | Every setting is browser-memory only. Nothing is saved or read by any other screen. Toasts confirm only the blocklist changes |

#### 3. Worked example
Rohan updates Metro Health.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Metro Health changes industry | Opens the drawer, picks a new industry category and industry, presses **Save Changes** | **Nothing visible happens. The table keeps the old values** |
| 2 | He clears the name | Presses **Save Changes** | **Save is blocked with an error** |
| 3 | He wants to change the phone number | Looks for a phone field in the drawer | **There is none. Phone is read-only on the left card** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When my organization details change, I want to update them, so that records stay accurate. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a changed name, industry category, industry or location, **when** the user presses **Save Changes**, **then** the drawer stays open, no message shows and the table does not change. |
| F-1-2 | **Given** an empty name, **when** the user presses **Save Changes**, **then** save is blocked with the error "Organization name is required". |
| F-1-3 | **Given** a changed logo, billing value or custom-field value, **when** the user presses **Save Changes**, **then** those values are not stored. |
| F-1-4 | **Given** the Security tab, **when** the user changes a setting, **then** it holds only until the drawer closes and affects no other screen. |

### F-2: Logo, business profile and branding

#### 1. What it does
Rohan clicks the logo on the left card, or its camera button, and uploads an image. He sees it in the card and the drawer header. A toast confirms the upload or the removal, and **Remove logo** clears it. The wider branding intent of the earlier PRD is not delivered.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Logo upload | Uploader | Rejects a file over 2 MB. Any image type is accepted. Shows a toast on success or removal | ◐ Simulated | The earlier PRD said 5 MB and PNG or SVG. The logo is not saved (G10-E-01). Decision needed: D-44 |
| F-2.2: Business Profile | Modal | A read-only sheet of fixed sample values (business name, type, industry, region, registration ID type) | ○ Not built | The code exists but nothing opens it from this tab. Decision needed: D-44 |
| F-2.3: Brand primary colour | Colour input | A hex colour for patient-facing surfaces | ○ Not built | No colour field exists (G10-I-03) |
| F-2.4: Legal entity name, medical director and tax ID on receipts | Fields | Described in the earlier PRD | ○ Not built | Decision needed: D-44 |
| F-2.5: Logo in the top bar, invoices and the patient portal | Branding | Described in the earlier PRD | ○ Not built | The invoice document does not use the organization logo (G7-I-38) |

#### 3. Worked example
Rohan brands Metro Health.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He has a 1 MB PNG | Uploads it in the drawer | **The logo shows on the card with a success toast** |
| 2 | He has a 3 MB file | Uploads it | **The upload is rejected with a message** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When configuring our workspace, I want our official branding and legal details recorded, so that invoices and communications look professional. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a file above 2 MB, **when** it is chosen, **then** the upload is rejected with a message. |
| F-2-2 | **Given** an uploaded logo, **when** the drawer is closed, **then** the logo is not stored and no other screen shows it. |

### F-3: Operating locations

#### 1. What it does
On the **Availability** tab, Rohan sees one card per location. A new organization starts with California Branch, New York Branch and Online. He presses **Add Location** and a card called Branch 4 appears below the primary one, already open. He renames it Westside and picks **Physical Clinic** or **Online / Virtual**. A physical clinic has street, city, state and ZIP. He picks a **Location Timezone** from eleven options. The weekly grid has one row per day, Monday to Sunday, with a checkbox. A new location is open Monday to Friday, 09:00 to 17:00, and closed at the weekend. A day can hold several time slots, each with a start and end time. **Apply Mon-Fri** copies Monday to Tuesday through Friday. **Save Westside Availability** shows a toast. Every edit is already written to the browser, and staff, appointments and services read that list.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Add location | Button | **Add Location** inserts a card named Branch N below the primary one, open, with default hours. A toast confirms | ● Works | Replaces the old add form. Seeded locations appear for any organization with none saved |
| F-3.2: Location details | Form | Name, type (**Physical Clinic** or **Online / Virtual**), street, city, state and ZIP (physical only), **Location Timezone** | ● Works | The timezone is stored per location. A toast shows on change |
| F-3.3: Primary location | Button | **Set as Primary** moves the Primary badge. One location is primary | ● Works | |
| F-3.4: Weekly time slots | Editor | Day checkbox, then one or more start and end times. A plus adds a slot, a bin removes one. A day with no slots shows Location Closed | ● Works | New slot starts 30 minutes after the last. No check that an end is after a start or that slots do not overlap was found |
| F-3.5: Apply Mon-Fri | Button | Copies Monday's slots to Tuesday through Friday and shows a toast | ● Works | Replaces the old Monday to Friday 9 to 5 shortcut |
| F-3.6: Delete location | Action | A bin icon on a non-primary card removes it at once. The primary location and the last location cannot be deleted | ● Works | No confirmation step. The earlier confirm dialog is gone |
| F-3.7: Use in staff and booking | Logic | Add User needs at least one location when "can book appointments" is on. Appointments, Services and portal booking read the list | ● Works | Other screens read the first start and last end of each day. A gap between two slots is not honoured there. Room-level filtering is not verified (G10-I-05) |
| F-3.8: Storage | Rule | Locations are saved per organization in browser storage on every edit | ◐ Simulated | They exist only in this browser. The organization record keeps only location names and only through **Save Changes**, which fails (F-1.4) |
| F-3.9: Days off for a location | Editor | Dated closures with a duplicate check | ○ Not built | Removed on 2026-11-14. Stored closures from earlier sessions are still read by booking |
| F-3.10: Location phone number | Field | Described in the earlier PRD | ○ Not built | No phone field exists at location level (G10-I-04) |
| F-3.11: Location name check | State | A blank location name is rejected | ○ Not built | The name field accepts an empty value |

#### 3. Worked example
Rohan opens a branch.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A second clinic opens | Presses **Add Location**, renames it **Westside**, fills the address and timezone | **Westside is listed and offered when adding a team member** |
| 2 | Westside runs a split Saturday | Ticks Saturday and adds a second slot | **Saturday shows two slots and Open with both times** |
| 3 | He wants to close Westside on a holiday | Looks for a days-off control | **There is none on this tab** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When I open a satellite clinic, I want to add its location and weekly hours, so that appointments can be scheduled specifically for that site. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the Availability tab, **when** the user presses **Add Location**, **then** a Branch N card opens below the primary one with Monday to Friday 09:00 to 17:00. |
| F-3-2 | **Given** a day with slots, **when** the user unticks it, **then** the day shows Location Closed and Unavailable. |
| F-3-3 | **Given** the primary location, **when** the user looks for a delete control, **then** none is shown. |
| F-3-4 | **Given** a location, **when** the user looks for a way to add a closure date, **then** no such control exists. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Organization list, create and edit | F-1.1 – F-1.8 | ● / ◐ / ○ | List, search and create work; drawer Save Changes fails and Security is browser-only. |
| F-2 | Logo, business profile and branding | F-2.1 – F-2.5 | ◐ / ○ | Logo upload is not saved; colour and legal details absent. |
| F-3 | Operating locations | F-3.1 – F-3.11 | ● / ◐ / ○ | Per-location details, timezone and weekly slots work in the browser only; days off removed. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Update organization details so records stay accurate | F-1 |
| 2 | Practice Admin | Record official branding and legal details | F-2 |
| 3 | Practice Admin | Add a branch location with weekly hours | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| System Admin (the default role, read from browser storage) | Open the tab, create organizations, open the drawer, edit locations and their hours | Saving drawer edits to the table (F-1.4) |
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
| 2026-11-14 | Updated to the prototype changes of 2026-11-13 and 2026-11-14 (organization drawer rebuilt with per-location weekly slots, Security tab, days off removed, Save Changes fails). |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
