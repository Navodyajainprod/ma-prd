---
title: "Industries: Industry Category Tab"
product: "admin"
module: "industry-category"
channel: "categories"
route: "/admin/industry-category"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | INDUSTRY-CATEGORY |
| Route | `/admin/industry-category` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Industry Category** tab of the **Industries** page. A table of seven seeded categories, each with chips for the industries attached to it, and a drawer to create, edit, duplicate or delete a category. |
| **Who uses it** | Platform Admin (groups industries). No role is checked on the page. |
| **Where you start it** | **Industries** in the admin sidebar. `/admin/industry-category` opens this tab and is the default. `/admin/industries` opens the Industries tab. |
| **Where the result goes** | Nowhere outside the page. All edits are kept in page memory only and are lost on reload. Onboarding, organisation forms and scope pickers read fixed seed lists. |
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
| Client (Organization settings) | Organisation industry and category lists | Not connected. The organisation forms in client Settings read fixed seed lists. A category created or renamed here does not appear there. | [View Organization](/client/settings/organization) |
| Admin (Organizations) | Provisioning forms | Not connected. The Add Organization drawer and onboarding read the seed lists, not this screen. | [View Organizations](/admin/organizations) |
| Admin (Industries tab) | Attached industries | Industries are linked to a category by name. Creating an industry adds its name to the category's chips. | [View Industries](/admin/industry-category/industries) |
| Admin (Fields, Sections) | Scope Rules pickers | Not connected. Scope Rules pick a category from fixed reference data, so a new category here is not offered. | [View Fields](/admin/custom-fields/fields) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Industries** and lands on the **Industry Category** tab. Seven categories are listed, each with its first two industries as chips and a "+N more" link. He wants a new group. He presses **New Category**, types "Allied Health", leaves **Active** on and saves. A toast says the category was created and the row appears. He presses the **+** on that row and adds Physiotherapy. The chip shows. Then he reloads the page. The new category and the chip are gone. Later he checks Add Organization and finds that it never listed Allied Health.

### What is real and what is not

- **Real in the prototype:** the seven seeded categories, search, the chip lists with "+N more", the Active flag, create, edit, duplicate and delete on screen, and the delete confirmation.
- **Simulated:** every change. The page keeps its lists in memory only. A reload restores the seed. No other screen reads the edits.
- **Not built:** a taxonomy code, a numeric sub-industry count, tenant counts, cleanup of industries when a category is deleted, and checks for duplicate names.

### Journey position

```
New Category ─▶ Attach industries ─▶ Page memory only ─X▶ onboarding, organisation forms, scope pickers
```

## 2. Feature Requests

### F-1: Browse and search categories

#### 1. What it does
Leo opens the tab and sees "Industry Category (N)" with a table. Each row has the Category Name, Attached Industries, an ID, a Status and row actions. The search box is shared with the Industries tab. An empty result shows a message.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Categories table | Table | Category Name, Attached Industries, ID, Status, Actions | ● Works | The earlier PRD named Code and Sub-Industries Count columns. The table shows chips instead (G13-ICAT-01) |
| F-1.2: Seeded data | Data | 7 categories, all System and Active | ● Works | |
| F-1.3: Attached industry chips | Chips | The first two industries show. "+N more" counts the rest | ● Works | (G13-ICAT-04) |
| F-1.4: Search | Search | Filters categories by text | ● Works | (G13-ICAT-08) |
| F-1.5: Active status | Badge | Shows whether the category is enabled | ● Works | (G13-ICAT-05) |
| F-1.6: Tab count | KPI | "Industry Category (N)" is the number of rows in the list | ● Works | |
| F-1.7: Empty state | State | A message shows when nothing matches | ● Works | |
| F-1.8: Loading and error states | State | None exist | ○ Not built | The data is in memory |
| F-1.9: Taxonomy code | Column | Described in the earlier PRD | ○ Not built | No code is generated (G13-ICAT-02) |
| F-1.10: Tenant clinic counts | Column | Described in the earlier PRD | ○ Not built | No tenant counts are shown |
| F-1.11: Role control | Rule | Any signed-in user can open and use the page | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo looks for the dental group.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The tab lists seven categories | Types **dental** in search | **Only categories that match are listed** |
| 2 | A category has many industries | Reads its chips | **Two chips show and a "+N more" count shows the rest** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I review the vertical list, I want to see each category with its industries, so that I know how the catalogue is grouped. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the page opens at `/admin/industry-category`, **then** the Industry Category tab shows seven seeded categories. |
| F-1-2 | **Given** a category has more than two industries, **then** two chips show and "+N more" shows the rest. |
| F-1-3 | **Given** search matches nothing, **then** an empty message shows. |

### F-2: Create, edit, duplicate and delete a category

#### 1. What it does
Leo presses **New Category**. A drawer asks for the Category Name, a description and an Active switch ("Enable category for new registrations"). A row menu offers edit, duplicate and delete. Delete asks for confirmation. Every change lives in the page's memory.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Category drawer | Drawer | Category Name (required), description, Active | ◐ Simulated | A toast says "Created category" or "Updated category". The change is held in memory only and is lost on reload (G13-E-21). Decision needed: D-50 |
| F-2.2: Name check | State | An empty name is refused with a message | ● Works | No uniqueness check |
| F-2.3: Duplicate | Row action | Copies the category and its chip list. A toast confirms | ◐ Simulated | In memory only (G13-E-21) |
| F-2.4: Delete | Modal | Asks to confirm, then removes any category, including seeded ones | ◐ Simulated | The industries of that category keep pointing at it (G13-E-23). Decision needed: D-32 |
| F-2.5: Category selectable for industries | Rule | A category created here is offered in the Industries tab | ● Works | Within the same page only (G13-ICAT-03) |
| F-2.6: Generated code | Rule | Described in the earlier PRD | ○ Not built | (G13-ICAT-02) |
| F-2.7: Confirmation on every destructive action | Rule | Duplicate and edit have none | ○ Not built | Decision needed: D-06 |

#### 3. Worked example
Leo adds Allied Health and then reloads.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer open | Types **Allied Health** and saves | **A toast says the category was created and the row shows** |
| 2 | He reloads the page | Opens the tab again | **The category is gone. Only the seven seeded categories show** |
| 3 | He deletes a seeded category | Confirms | **It is removed. Its industries still name it** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When we expand to a new vertical, I want to add a category, so that industries are grouped logically. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a name is entered, **when** the user saves, **then** a category is added to the on-screen list and a toast shows. |
| F-2-2 | **Given** the page is reloaded, **then** the list returns to the seven seeded categories. |
| F-2-3 | **Given** a category is deleted, **then** its industries are not changed or removed. |
| F-2-4 | **Given** the name is empty, **when** the user saves, **then** "Category name is required" shows. |

### F-3: Attach industries from the category row

#### 1. What it does
On a category row Leo presses **+** to add an industry. The industry is linked to the category by its name text, in both directions. A rename later does not update the chips.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Add industry from the row | Action | Opens the industry drawer for this category | ◐ Simulated | Held in memory only (G13-E-21) |
| F-3.2: Link by name | Rule | The industry and its category point to each other by name text | ◐ Simulated | A rename or a move leaves stale chips (G13-E-22) |
| F-3.3: Feeds onboarding, organisation forms and scope pickers | Hand-off | Intended master list | ○ Not built | These screens read fixed seed lists. Decision needed: D-50 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Allied Health row | Presses **+** and adds Physiotherapy | **A chip shows on the row** |
| 2 | Leo renames the industry | Saves | **The chip keeps the old name** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When a new specialty appears, I want to add it under its category, so that the catalogue stays organised. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an industry is added from a row, **then** its name shows as a chip on that category. |
| F-3-2 | **Given** an industry is renamed, **then** the chip on its category keeps the old name. |
| F-3-3 | **Given** onboarding opens, **then** it lists the seed categories, not the edits made here. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Browse and search categories | F-1.1 – F-1.11 | ● / ○ | Table and search work; no code or tenant counts. |
| F-2 | Create, edit, duplicate and delete | F-2.1 – F-2.7 | ◐ / ● / ○ | Works on screen; held in memory only. |
| F-3 | Attach industries | F-3.1 – F-3.3 | ◐ / ○ | Name-based link drifts; no downstream feed. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | See each category with its industries | F-1 |
| 2 | Platform Admin | Add a category for a new vertical | F-2 |
| 3 | Platform Admin | Add a new specialty under its category | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/industry-category`, create, edit, duplicate and delete categories | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The admin sidebar hides the item from roles that cannot read the Industries module, but the URL still opens. The earlier PRD named a Platform Architect and no access rule. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Industry Category (N) | Tab label | Number of rows in the category list |
| All Categories (N) | Category filter | Number of categories |
| +N more | Chip list | Number of attached industries minus 2 |

No tenant count is shown.

## 6. Cross-module journeys this module appears in

This module is not a step in the four journeys on the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-50 | Is Industries the master for onboarding and scope pickers, and what happens when a category is deleted? | F-2.1, F-3.3 |
| D-32 | May a seeded category be deleted once referenced, or only deactivated? | F-2.4 |
| D-06 | Should every destructive action ask for confirmation? | F-2.7 |
| D-12 | Must permissions block direct URL access and each action? | F-1.11 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
