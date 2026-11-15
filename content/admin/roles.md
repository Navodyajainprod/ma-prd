---
title: "Roles and Permissions: Tenant Role Templates and Departments"
product: "admin"
module: "roles"
route: "/admin/roles"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | ROLES |
| Route | `/admin/roles` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A page that defines tenant role templates (clinic staff roles) as an industry-scoped set of module permissions, plus departments. These are not the admin-portal roles. Those live in User Management. |
| **Who uses it** | Platform Admin. No action is checked: any signed-in user who opens the URL can do everything. |
| **Where you start it** | **Roles & Permissions** under TEMPLATES in the admin sidebar (`/admin/roles`, also `/admin/roles-permissions`). |
| **Where the result goes** | Browser storage. Departments are shared with Client Settings. The client team-member drawer and the task quick-create drawer read role names. Nothing applies a template to an organisation. |
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
| Client (Team) | Team-member roles | The team-member drawer reads the template store but checks only a legacy delete flag that new or edited templates never set (G13-E-11). Templates are not applied to organisations. | [View Team](/client/settings/team) |
| Client (Departments) | Departments | The department list is stored under the same key as client Settings, so both read the same departments. | [View Team](/client/settings/team) |
| Client (Tasks) | Task quick-create | The task quick-create drawer reads role names and categories from this store. | [View Tasks](/client/tasks) |
| Admin (User Management) | Admin roles | A separate role system with 21 modules. One module id is shared, so one admin permission controls both screens. | [View User Management](/admin/users) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Roles & Permissions**. Two tabs read "Roles" and "Departments", each with a count. He presses **Create Role**, names it "Front Desk Lead", picks a department and sets the **Admin Scope** to one industry. In the matrix he gives Clients Read and Write at the Own Records level and sets Billing to Deny. He saves and the role joins the table with the Permitted Scope "Custom Matrix Assigned". He duplicates a role and then deletes the copy. It disappears with no confirmation. No clinic staff member is affected by any of this, because nothing in the tenant app applies or checks these templates.

### What is real and what is not

- **Real in the prototype:** the Roles and Departments tabs, create, edit, duplicate and delete, filters by category and industry, the 19-module matrix with levels and per-workflow rows, and the protection of system roles.
- **Simulated:** the matrix is saved but never checked. The Permitted Scope column shows a fixed label. The drawer's older seed matrix is ignored.
- **Not built:** applying templates to organisations, enforcing permissions in the UI or API, the PHI export gate with re-authentication, audit entries, export and any role check on the page.

**Security note:** any signed-in user can edit roles, the matrix is never enforced, template changes write no audit entry and deletions need no confirmation.

### Journey position

```
Create Role ─▶ Matrix (19 modules) ─▶ Saved template ─┬▶ Team-member drawer (legacy flag only)
                                                       └▶ Task quick-create (role names)
```

## 2. Feature Requests

### F-1: Role templates

#### 1. What it does
Leo opens the **Roles** tab. The table shows Role Name, Description, Admin Scope, Permitted Scope and Created Date. He searches and filters by category and industry. The row menu holds **Configure Permissions**, **Duplicate Role** and **Delete** (disabled for system roles). Eight roles are seeded: "Super Administrator" (system) and seven industry roles.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Role table | Table | Name, description, Admin Scope ("N industries, M countries"), Permitted Scope, Created. Roles (n) counts roles after filters | ◐ Simulated | Permitted Scope is a fixed label, "Global (Full Access)" for a system role else "Custom Matrix Assigned" (G13-E-10). Decision needed: D-11 |
| F-1.2: Create and edit role | Drawer | Role Name* (required), Department, Description, Admin Scope. Category and industry come from the first scope rule, else Healthcare and General Physician | ● Works | No name uniqueness check (G13-E-06) |
| F-1.3: Duplicate Role | Action | Copies the role as "(Copy)" | ● Works | Cloning with named overrides is limited to this |
| F-1.4: Delete role | Action | Removes the role. System roles show "System roles cannot be deleted." | ◐ Simulated | No confirmation (G13-E-09). Decision needed: D-06 |
| F-1.5: Category and industry filters | Filter | Narrow the table | ● Works | |
| F-1.6: Empty state | State | Shown when no role matches | ● Works | |
| F-1.7: Loading, error and permission states | State | None exist | ○ Not built | |
| F-1.8: Export and audit | Log | No export and no audit entry for template changes | ○ Not built | Decision needed: D-42 |

#### 3. Worked example
Leo adds a role for a dental clinic.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Role needed | Presses **Create Role**, enters a name and saves | **The role appears with Permitted Scope "Custom Matrix Assigned"** |
| 2 | He no longer needs a copy | Chooses **Delete** | **The role is removed at once with no confirmation and no audit entry** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When defining clinic roles, I want a template per industry, so that tenants start with sensible staff roles. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** Create Role, **when** the name is empty, **then** the role is not saved. |
| F-1-2 | **Given** a custom role, **when** Delete is chosen, **then** it is removed at once with no confirmation. A system role is refused. |
| F-1-3 | **Given** any role, **then** Permitted Scope shows one of two fixed labels, not a summary of the matrix. |

### F-2: Permission matrix

#### 1. What it does
**Configure Permissions** opens a drawer with a matrix of 19 modules. Each row has a permission (read, write, delete, import, export) and a level: **All Records**, **Role**, **Own Records** or **Deny**. Rows expand into per-workflow permissions with an inherit toggle. The option labelled Role stores department-level scope.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Module matrix | Matrix | 19 modules with permission and level per module | ◐ Simulated | Saved but never checked by any screen or action (G13-E-100 for admin roles, same pattern here). Decision needed: D-12 |
| F-2.2: Level labelled Role | Option | Stores department-level scope | ◐ Simulated | The label and stored meaning differ (G13-E-08) |
| F-2.3: Per-workflow rows with inherit | Rows | Expand a module to set workflow permissions | ● Works | |
| F-2.4: Scope rules | Rule | Templates are scoped by industry category, industry and location | ● Works | No code applies a template to an organisation |
| F-2.5: Old seed matrix | Data | Seeds carry an older 9-module Read, Add, Edit, Delete, Export, Import matrix | ○ Not built | The UI ignores it |
| F-2.6: PHI export gate | Security gate | Described in the earlier PRD, re-authentication to grant Export | ○ Not built | Nothing like it exists |
| F-2.7: Hidden buttons and blocked API | Rule | Described in the earlier PRD | ○ Not built | A user without a permission still sees and uses every button. Decision needed: D-12 |

#### 3. Worked example
Leo restricts delete on clients.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist role should not delete clients | Sets Clients delete off and saves | **The matrix is saved** |
| 2 | A receptionist uses the client app | Opens a client | **The delete button is still there. Nothing reads the matrix** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When defining a role, I want fine-grained permissions per module and workflow, so that staff only do what their job needs. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the matrix, **then** it lists 19 modules with five permissions and four levels. |
| F-2-2 | **Given** a saved role, **when** a tenant user acts, **then** no permission from this matrix is checked. |
| F-2-3 | **Given** a role without Export, **then** the export button still shows and works. |

### F-3: Departments

#### 1. What it does
The **Departments** tab lists Department Name, Description and Assigned Roles. **Add Department** creates one. Departments are shared with Client Settings.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Department table | Table | Name, description and Assigned Roles (roles whose department matches) | ● Works | Count in the tab is the total |
| F-3.2: Add, edit department | Drawer | Creates or changes a department | ● Works | Shared with client Settings |
| F-3.3: Delete department | Action | Removes it | ◐ Simulated | No confirmation (G13-E-09). Decision needed: D-06 |
| F-3.4: Empty state | State | Shown when none match | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A new Billing department is needed | Presses **Add Department** | **It appears and can be chosen in the role drawer** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When organising roles, I want departments to group them, so that roles are easy to find. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a department, **then** Assigned Roles counts roles whose department matches. |
| F-3-2 | **Given** Delete, **then** the department is removed with no confirmation. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Role templates | F-1.1 – F-1.8 | ● / ◐ / ○ | Roles work; Permitted Scope is fixed text; no confirm or audit. |
| F-2 | Permission matrix | F-2.1 – F-2.7 | ◐ / ● / ○ | Matrix is saved but never enforced. |
| F-3 | Departments | F-3.1 – F-3.4 | ● / ◐ | Departments work; delete has no confirmation. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Offer industry role templates to tenants | F-1 |
| 2 | Platform Admin | Set fine-grained permissions per module and workflow | F-2 |
| 3 | Platform Admin | Group roles into departments | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/roles` and create, edit, duplicate and delete roles and departments | Deleting a system role |
| Admin role without the Roles module | Nothing extra: the sidebar item is hidden, the URL still works | Seeing the sidebar item |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

There are two role systems: admin-portal roles (21 modules, in User Management) and these tenant role templates (19 modules). The signed-in role comes from browser storage and defaults to SystemAdmin. The earlier PRD described 18 modules, 6 roles and Read, Add, Edit, Delete, Export, Import, and said missing permissions hide buttons and block the API. Decision needed: D-11 and D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Roles (n) | Tab | Roles after filters |
| Departments (n) | Tab | Total departments |
| Admin Scope | Role table | "N industries, M countries" from scope rules |
| Permitted Scope | Role table | **Hardcoded, formula undefined** (system role: Global, else Custom Matrix Assigned) |
| Assigned Roles | Department table | Roles whose department matches |

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys in the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-06 | Should every destructive admin action ask for confirmation? | F-1.4, F-3.3 |
| D-11 | What is the role model (admin roles vs tenant templates) and what should Permitted Scope summarise? | F-1.1 |
| D-12 | Must permissions block direct URLs and each action, and where is the matrix enforced? | F-2.1, F-2.7 |
| D-42 | Which admin actions must be audited, including role template changes? | F-1.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
