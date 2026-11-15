---
title: "Sidebar Navigation Templates"
product: "admin"
module: "sidebar-config"
route: "/admin/sidebar-config"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | SIDEBAR CONFIG |
| Route | `/admin/sidebar-config` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A list of default client sidebar templates and a drawer to edit one. A template has sections, item order, visibility, featured items, pinned workflows and scope rules by industry category, industry and location. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user can open and edit templates. |
| **Where you start it** | **Sidebar Navigation** under TEMPLATES in the admin sidebar (`/admin/sidebar-config`, also `/admin/sidebar` and `/admin/sidebar-templates`). |
| **Where the result goes** | The client sidebar. It picks the best-scoring active template for the active organisation, live. The admin sidebar is hardcoded and not configurable. |
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
| Client (all pages) | Client sidebar | The client sidebar resolves the template live for the active organisation and caches it per organisation. A layout the user customised on the same template is kept. | [View Overview](/client/overview) |
| Admin (Organizations) | Template choice | The organisation's industry, category and location pick the template. | [View Organizations](/admin/organizations) |
| Admin (shell) | Admin sidebar | Not connected. The admin sidebar is hardcoded and templates do not change it. | [View Roles and Permissions](/admin/roles) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Sidebar Navigation**. The table lists "Standard Organization Baseline" and the templates he made before. He presses **Add Sidebar Template** and a drawer opens with a **Config Studio** and a **Live Preview**. He names the template, sets a scope rule for one industry and drags the Reports item into another section. He hides one item with the eye icon and features another. He saves. A clinic in that industry opens its app and the new layout is already in its sidebar. Later he deletes a template that is no longer needed. It is removed at once with no confirmation. The baseline cannot be deleted.

### What is real and what is not

- **Real in the prototype:** the template list with filters, the drag-and-drop editor, visibility and featured toggles, pinned workflows, scope rules and best-match scoring, duplicate, delete with baseline protection, and the live effect on the client sidebar.
- **Simulated:** nothing is wrongly shown as live. Delete has no confirmation. The template's Active flag and default start page exist in data but have no control.
- **Not built:** visibility by plan tier, a role filter per link, a next-session delay (changes are live) and audit entries.

### Journey position

```
Add Sidebar Template ─▶ Scope rules ─▶ Best-match scoring ─▶ Client sidebar (live)
```

## 2. Feature Requests

### F-1: Template list and scope

#### 1. What it does
Leo sees a table of Name, Scope, Sections, Pinned Workflows and Items. He searches and filters by category, industry and location. The row menu holds **Edit Layout & Items**, **Configure Scope Rules**, **Duplicate** and **Delete** (disabled for the baseline). Scope rules open in a modal.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Template table | Table | Name, scope summary, section count, pinned workflows, items (total and visible) | ● Works | |
| F-1.2: Filters and search | Filter | Category, industry, location and a search box | ● Works | |
| F-1.3: Scope rules | Modal | Scope a template by industry category, industry and location | ● Works | |
| F-1.4: Duplicate | Action | Copies a template | ● Works | |
| F-1.5: Delete | Action | Removes a template. The baseline shows "Cannot delete the system fallback baseline template" | ◐ Simulated | No confirmation (G13-E-36). Decision needed: D-06 |
| F-1.6: Empty state | State | Shown when no template matches | ● Works | |
| F-1.7: Loading, error and permission states | State | None exist | ○ Not built | |
| F-1.8: Active flag and default start page | Field | Present in data but no control sets them | ○ Not built | (G13-E-37) |
| F-1.9: Audit entries | Log | Template changes write nothing | ○ Not built | Decision needed: D-42 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Leo wants to find the dental template | Filters by the dental industry | **Only matching templates are listed** |
| 2 | An old template is not needed | Chooses **Delete** | **It is removed at once with no confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When managing many templates, I want to find and scope them, so that each kind of clinic gets the right menu. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a filter, **then** only templates whose scope matches are listed. |
| F-1-2 | **Given** the baseline template, **when** Delete is attempted, **then** it is refused with a message. |
| F-1-3 | **Given** another template, **when** Delete is chosen, **then** it is removed at once with no confirmation. |

### F-2: Layout editor

#### 1. What it does
**Edit Layout & Items** opens a drawer with **Config Studio** and **Live Preview**. Leo names the template, sets scope rules and drags sections and items, including across sections. The eye icon hides an item and a toggle features it. He can add, rename and remove sections and add items and pinned workflows.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Drag-and-drop tree | Drag tree | Reorder sections and items, also across sections | ● Works | Layout is saved with the template |
| F-2.2: Visibility switch | Toggle | Shows or hides an item | ● Works | Per template, not per plan tier |
| F-2.3: Featured items and pinned workflows | Toggle, picker | Mark an item featured and pin workflows | ● Works | |
| F-2.4: Sections | Control | Add, rename and remove sections | ● Works | |
| F-2.5: Validation | Rule | Name is required. Nav paths and pinned workflows must be unique within a template | ● Works | |
| F-2.6: Live Preview | Preview | Shows the sidebar as configured | ● Works | |
| F-2.7: Visibility per plan tier | Rule | Described in the earlier PRD | ○ Not built | Visibility is per template and scope. Decision needed: D-12 |
| F-2.8: Role access filter per link | Rule | Described in the earlier PRD | ○ Not built | No role field exists per link. Decision needed: D-12 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | AI Scribe should be less prominent | Drags it down and toggles the eye | **The Live Preview shows it hidden. Saving applies it** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When releasing new modules, I want to control which menu items a kind of clinic sees, so that only fitting links appear. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the drawer, **when** the name is empty, **then** the template is not saved. |
| F-2-2 | **Given** two items with the same path in a template, **then** the save is refused. |
| F-2-3 | **Given** the editor, **then** there is no per-plan-tier or per-role control. |

### F-3: Effect on the client sidebar

#### 1. What it does
When a clinic opens its app, the client sidebar picks the best template for that organisation. It scores industry (+30), category (+20), location (+20), an unconstrained rule (0.1) and the baseline (0). Edits apply live, not next session.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Best-match scoring | Rule | The highest-scoring active template wins, the baseline is the fallback | ● Works | |
| F-3.2: Live apply and cache | Rule | The client resolves the template live and caches it per organisation | ● Works | The earlier PRD said next session |
| F-3.3: User customisation kept | Rule | A layout the user customised on the same template is kept | ● Works | |
| F-3.4: Admin sidebar | Rule | The admin sidebar is hardcoded | ○ Not built | Not configurable. Decision needed: D-12 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Leo saves a dental template | A dental clinic user opens the app | **The clinic sees the new layout, unless they customised their own** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | After saving a template, I want clinics to see it, so that default menus stay current. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** several templates, **then** the one with the highest match score is used and the baseline is the fallback. |
| F-3-2 | **Given** a saved edit, **then** the client sidebar reflects it without a new session. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Template list and scope | F-1.1 – F-1.9 | ● / ◐ / ○ | List and scope work; delete has no confirmation. |
| F-2 | Layout editor | F-2.1 – F-2.8 | ● / ○ | Editor works; no tier or role filter. |
| F-3 | Effect on client sidebar | F-3.1 – F-3.4 | ● / ○ | Client sidebar follows templates live. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Find and scope templates | F-1 |
| 2 | Platform Admin | Control which items a kind of clinic sees | F-2 |
| 3 | Platform Admin | Have clinics see the saved template | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/sidebar-config`, create, edit and delete templates | Deleting the baseline |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD said a role filter per link enforces navigation access. It does not exist. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Sections, items (total and visible), pinned workflows | Template table | Counts from the template |
| Scope summary | Template table | Text built from the scope rules |
| Match score | Client sidebar | Industry +30, category +20, location +20, unconstrained rule 0.1, baseline 0 |

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys in the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-06 | Should every destructive admin action ask for confirmation? | F-1.5 |
| D-12 | Is sidebar visibility by plan tier and role wanted, and should the admin sidebar be configurable? | F-2.7, F-2.8, F-3.4 |
| D-42 | Which admin actions must be audited, including template changes? | F-1.9 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
