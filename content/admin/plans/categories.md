---
title: "Plan Categories: Grouping Plans by Product Line"
product: "admin"
module: "plans"
channel: "categories"
route: "/admin/plans"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | PLANS |
| Route | `/admin/plans` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Plan Categories** tab of **Plans & Credits**: a table of categories with a drawer to create or edit one. A plan must belong to a category. |
| **Who uses it** | Platform Admin (organises the plan catalogue). No role is checked. |
| **Where you start it** | **Plans & Credits** in the admin sidebar (`/admin/plans`), then **Plan Categories** in the tab dropdown. |
| **Where the result goes** | The category list in the plan drawer. Inactive categories disappear from it. Categories do not drive any pricing page layout. |
| **How real is it** | 0 features work, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin (Industry Plans) | Category on a plan | Each plan picks a category in its drawer. The list is filtered by the plan's scope and hides inactive categories. | [View Industry Plans](/admin/plans/plans) |
| Client (Billing) | Badges on pricing and upgrade screens | The Popular highlight comes from a flag on the plan, not from a category. The public Pricing page reads plans. Category display groups and sort order are not connected (G13-PCAT-10). | [View Billing](/client/settings/billing) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Plan Categories** and sees the categories with a description, an Admin Scope, a count of Plans Using it and a status. He adds a new category, gives it a name and description, sets a scope and leaves **Active** on. He then tries to delete an old category and a message says it cannot be deleted because plans use it. He deactivates it instead. The category no longer appears when he builds a plan. The earlier PRD pictured categories as pricing display groups with a Most Popular ribbon and a sort order. The screen has none of that: categories only group plans.

### What is real and what is not

- **Real in the prototype:** the categories table, the create and edit drawer with scope and Active, the delete block while plans use a category, and the hiding of inactive categories in the plan drawer.
- **Simulated:** the Plans Using count and the delete block match by name, so one name can match another. When every category is deleted the six defaults come back.
- **Not built:** a promotional badge on a category, a display sort order, a list of linked plans, and audit entries.

### Journey position

```
Category created ─▶ Chosen in plan drawer ─▶ Plans Using count ─▶ Delete blocked while in use
```

## 2. Feature Requests

### F-1: Category registry

#### 1. What it does
Leo opens **Plan Categories**. Each row has the Category Name with its description, the Admin Scope, Plans Using and Status. He adds or edits a category in a drawer with a name, a description, a scope and an **Active** switch. Categories group plans by product line, for example by what the plan covers. They are not pricing display groups.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Categories table | Table | Category Name with description, Admin Scope, Plans Using, Status | ● Works | |
| F-1.2: Create and edit drawer | Drawer | Name (required), description, scope, Active | ● Works | |
| F-1.3: Plans Using | Count | Number of plans in the category | ◐ Simulated | Counted by name match, so a similar name can match (G13-E-20) |
| F-1.4: Delete block | Rule | Refused with "Cannot delete category … used by N plan(s)" | ◐ Simulated | Uses the same fuzzy name match (G13-E-20) |
| F-1.5: Inactive categories | Rule | An inactive category is hidden from the plan drawer | ● Works | |
| F-1.6: Default categories | Rule | Six defaults exist | ◐ Simulated | Deleting every category brings the six back on the next load (G13-E-14). Decision needed: D-32 |
| F-1.7: Loading and error states | State | None exist | ○ Not built | All data is browser-local (G13-X-05) |
| F-1.8: Role control and audit | Rule | Any signed-in user can change categories and no entry is written | ○ Not built | Decision needed: D-12, D-42 |

#### 3. Worked example
Leo retires a category.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Three plans use it | Chooses **Delete** | **A message says it cannot be deleted because 3 plans use it** |
| 2 | He switches it off instead | Turns **Active** off | **It disappears from the category list in the plan drawer** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When the catalogue grows, I want to group plans into categories, so that I can manage and scope them together. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** plans use a category, **when** Delete is chosen, **then** it is refused with the number of plans. |
| F-1-2 | **Given** a category is inactive, **when** a plan drawer opens, **then** it is not in the category list. |
| F-1-3 | **Given** every category is deleted, **when** the app reloads, **then** the six defaults return. |

### F-2: Display groups, badges and sort order

#### 1. What it does
The earlier PRD described categories as display groups on public signup and checkout pages, with promotional tags such as Most Popular and a sort order. The prototype keeps these ideas elsewhere or not at all. A plan has a **Highlight as Popular** flag. A pack has a badge. A category has neither.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Popular highlight | Flag | Set on a plan in its drawer, not on a category | ◐ Simulated | The public Pricing page reads plans. How the highlight renders there is not confirmed (G13-PCAT-10) |
| F-2.2: Promotional badge on a category | Dropdown | Popular, New, Enterprise Exclusive assigned to a category | ○ Not built | The badge list belongs to plan flags and pack badges (G13-PCAT-02) |
| F-2.3: Display sort order | Field | Order in which categories display | ○ Not built | (G13-PCAT-04) |
| F-2.4: Linked plans list | List | Names the plans in each category | ○ Not built | Only a count shows (G13-PCAT-03) |

#### 3. Worked example
Leo wants a Most Popular ribbon on Growth.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He opens the category drawer | Looks for a badge field | **There is none. The Popular flag is on the plan itself** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When launching new tiers, I want display groups and badges, so that checkout pages guide buyers to the recommended plan. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the category drawer, **then** it has name, description, scope and Active only. No badge and no sort order. |
| F-2-2 | **Given** a plan is set to Highlight as Popular, **then** the flag is stored on the plan. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Category registry | F-1.1 – F-1.8 | ● / ◐ / ○ | Table and drawer work; counts match by name. |
| F-2 | Display groups, badges, sort order | F-2.1 – F-2.4 | ◐ / ○ | Popular lives on the plan; no category badge or order. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Group plans into categories | F-1 |
| 2 | Platform Admin | Guide buyers with display groups and badges | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/plans` and create, edit and delete categories | Deleting a category that plans use |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named a Marketing Lead and said nothing about access. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Plans Using | Categories table | Plans whose category name matches this category (fuzzy match) |
| N categories available | Plan drawer | Count of active categories for the plan's scope |

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-32 | Can seeded categories be deleted for good once referenced, or only deactivated? | F-1.6 |
| D-12 | Must permissions block direct URL access and each action? | F-1.8 |
| D-42 | Which admin actions must be audited? | F-1.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
