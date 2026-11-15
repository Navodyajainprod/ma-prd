---
title: "Industries: Industries Tab"
product: "admin"
module: "industry-category"
channel: "industries"
route: "/admin/industries"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | INDUSTRY-CATEGORY |
| Route | `/admin/industries` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Industries** tab of the **Industries** page. A table of 51 seeded industries with a category filter and search, and a drawer to create, edit, duplicate or delete an industry. |
| **Who uses it** | Platform Admin (maintains the list of specialties). No role is checked on the page. |
| **Where you start it** | **Industries** in the admin sidebar, then the **Industries** tab. `/admin/industries` opens this tab. The sidebar link itself opens the Industry Category tab. |
| **Where the result goes** | Nowhere outside the page. All edits are kept in page memory only and are lost on reload. |
| **How real is it** | 0 features work, 2 are partly simulated, 1 is not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Organization settings) | Organisation industry picker | Not connected. The client organisation forms read a fixed seed list, not these edits. | [View Organization](/client/settings/organization) |
| Admin (Organizations) | Provisioning and onboarding | Not connected. The Add Organization drawer and onboarding read the seed list. | [View Organizations](/admin/organizations) |
| Admin (Industry Category tab) | Category link | Each industry names a category. The category's chip list holds the industry's name. | [View Categories](/admin/industry-category/categories) |
| Admin (Fields, Sections) | Scope Rules pickers | Not connected. Scope Rules use fixed industry and country lists. | [View Fields](/admin/custom-fields/fields) |
| Client (all pages) | Blueprints, terminology and presets | Not connected. No industry sets fields, forms, workflows or labels for a tenant. | [View Custom Fields](/client/settings/custom-fields) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Industries** and switches to the **Industries** tab. A table lists Industry Name, Industry Category, ID, Record Type, Status and actions. He filters by a category and searches for sleep. A new specialty is signing up, so he presses **New Industry**. He types "Sleep Medicine", picks a category, leaves **Active** on and saves. A toast says the industry was created, and the row shows Custom. He tries to delete a seeded industry and finds that only Custom ones can be deleted. Then he reloads. Sleep Medicine is gone, and onboarding never offered it.

**Naming note:** the earlier PRD called this tab "Vertical Industries" and described blueprint cards. The screen says "Industries" and shows a table. Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the table of 51 seeded industries, the category filter and search, System and Custom record types, and the on-screen create, edit, duplicate and delete with its confirmation.
- **Simulated:** every change. The page keeps its lists in memory only. A reload restores the seed, and no other screen reads the edits.
- **Not built:** blueprint cards with tenant counts, terminology overrides, module and workflow presets, and a tenant inheriting fields from an industry.

### Journey position

```
New Industry ─▶ Pick category ─▶ Page memory only ─X▶ onboarding, organisation forms, scope pickers
```

## 2. Feature Requests

### F-1: Browse and filter industries

#### 1. What it does
Leo opens the tab and sees "Industries (N)". Each row shows an industry with its category, a generated ID, a record type of System or Custom, and a status. He narrows the list with the category filter and the shared search box. Both filters can be used together.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Industries table | Table | Industry Name, Industry Category, ID, Record Type (System or Custom), Status, Actions | ● Works | The earlier PRD described a card grid with tenant counts (G13-IND-01) |
| F-1.2: Seeded data | Data | 51 industries, all System and Active | ● Works | |
| F-1.3: Category filter | Select | "All Categories (N)" or one category | ● Works | (G13-IND-10) |
| F-1.4: Search | Search | Filters the table by text | ● Works | |
| F-1.5: Empty state | State | A message shows when nothing matches | ● Works | |
| F-1.6: Loading and error states | State | None exist | ○ Not built | The data is in memory |
| F-1.7: Blueprint cards with tenant counts | Grid | Described in the earlier PRD | ○ Not built | The tab is a table with no tenant counts |
| F-1.8: Role control | Rule | Any signed-in user can open and use the page | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo looks for sleep specialties.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The tab lists 51 industries | Picks a category in the filter | **Only industries of that category are listed** |
| 2 | He types a word | Searches | **The list narrows to matching names** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I check the specialty list, I want to filter by category and search by name, so that I find an industry fast. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the page opens at `/admin/industries`, **then** the Industries tab shows 51 seeded industries, all System. |
| F-1-2 | **Given** a category filter and a search text, **then** the table shows only rows that match both. |
| F-1-3 | **Given** nothing matches, **then** an empty message shows. |

### F-2: Create, edit, duplicate and delete an industry

#### 1. What it does
**New Industry** opens a drawer. Leo enters the Industry Name and Industry Category, an optional description and an Active switch. The new record gets a random ID and is marked Custom. Its name is added to the category's chip list. A row menu offers edit, duplicate and delete. Only Custom industries can be deleted, after a **Delete Permanently** confirmation. All of it lives in memory.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Industry drawer | Drawer | Industry Name and Industry Category are required. Description (blank becomes "No description provided."), Active | ◐ Simulated | A toast confirms. The change is held in memory only and is lost on reload (G13-E-21). Decision needed: D-50 |
| F-2.2: Name check | State | An empty name shows "Industry name is required" | ● Works | No uniqueness check |
| F-2.3: Random ID and Custom type | Rule | A random ID from 10 to 909 and record type Custom | ◐ Simulated | IDs can repeat. No check (unverified) |
| F-2.4: Edit | Drawer | Renames or moves an industry | ◐ Simulated | The category's chip list keeps the old name (G13-E-22) |
| F-2.5: Duplicate | Row action | Adds "(Copy)" and a toast | ◐ Simulated | In memory only |
| F-2.6: Delete Custom industry | Modal | Confirms with **Delete Permanently** and removes the row | ◐ Simulated | The category's chip is not cleaned up (G13-E-22). Decision needed: D-32 |
| F-2.7: System industries cannot be deleted | Rule | The delete action is offered for Custom rows only | ● Works | (G13-IND-06) |
| F-2.8: Unique names within a category | Rule | Not checked | ○ Not built | |

#### 3. Worked example
Leo adds a specialty.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer open | Types **Sleep Medicine**, picks a category and saves | **A toast says the industry was created. The row shows Custom** |
| 2 | He renames it | Edits and saves | **The row changes. The category's chip keeps the old name** |
| 3 | He reloads | Opens the tab | **Sleep Medicine is gone. Only the 51 seeded industries show** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When a new specialty signs up, I want to add it to the industry list, so that it can be used for provisioning. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a name and a category, **when** the user saves, **then** a Custom row is added and a toast shows. |
| F-2-2 | **Given** the page reloads, **then** the list is the 51 seeded industries. |
| F-2-3 | **Given** a System industry, **then** no delete action is offered. |
| F-2-4 | **Given** a rename, **then** the category's chip list keeps the old name. |

### F-3: What an industry does for tenants

#### 1. What it does
The earlier PRD said an industry is a blueprint. It would carry fields, forms, workflows, terminology and modules, and a new tenant would inherit them. The prototype stores a name, a category, a description and an Active flag, and nothing reads them.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Feed onboarding, organisation forms and scope pickers | Hand-off | Intended master list | ○ Not built | These screens read fixed seed lists (G13-IND-11, G13-E-21). Decision needed: D-50 |
| F-3.2: Terminology overrides | Dictionary | Described in the earlier PRD. Labels such as Patient or Client | ○ Not built | (G13-IND-02). Decision needed: D-50 |
| F-3.3: Module and workflow presets | Toggles | Described in the earlier PRD. Pre-select modules for a new tenant | ○ Not built | (G13-IND-03). Decision needed: D-50 |
| F-3.4: Tenant inheritance of fields | Rule | Described in the earlier PRD | ○ Not built | (G13-IND-04) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A dental clinic signs up | Leo provisions it | **No dental fields, forms or workflows are applied because of its industry** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When I provision a specialty clinic, I want a ready-made industry profile, so that the clinic is configured out of the box. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an organisation is provisioned, **then** nothing from its industry record is applied to it. |
| F-3-2 | **Given** onboarding opens, **then** its industry list comes from the seed, not from edits on this page. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Browse and filter industries | F-1.1 – F-1.8 | ● / ○ | Table, filter and search work; no cards or tenant counts. |
| F-2 | Create, edit, duplicate and delete | F-2.1 – F-2.8 | ◐ / ● / ○ | Works on screen; held in memory only. |
| F-3 | What an industry does for tenants | F-3.1 – F-3.4 | ○ Not built | Nothing reads an industry record. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Find an industry fast by category and name | F-1 |
| 2 | Platform Admin | Add a new specialty to the list | F-2 |
| 3 | Platform Admin | Provision a clinic from a ready-made industry profile | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/industries`, create, edit and duplicate industries, delete Custom ones | Deleting System industries |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named an Onboarding Lead as the user and no access rule. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Industries (N) | Tab label | Number of rows in the industry list |
| All Categories (N) | Category filter | Number of categories |

No tenant count is shown. The earlier PRD promised one.

## 6. Cross-module journeys this module appears in

This module is not a step in the four journeys on the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical for this tab and its records? | Naming note |
| D-50 | Is Industries the master for onboarding and scope pickers, and are terminology overrides and presets still wanted? | F-2.1, F-3.1, F-3.2, F-3.3 |
| D-32 | May a referenced industry be deleted, or only deactivated? | F-2.6 |
| D-12 | Must permissions block direct URL access and each action? | F-1.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
