---
title: "Admin: Form Templates"
product: "admin"
module: "form-templates"
route: "/admin/forms"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | FORM-TEMPLATES |
| Route | `/admin/forms` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A list of form templates and of Form Flows (ordered sequences of forms), each with a scope, allowed roles and permissions. Forms are built in the shared Form Builder. This screen has no PRD page in the earlier PRD. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user who opens the address can create, publish and delete forms. |
| **Where you start it** | **Forms** in the admin sidebar (`/admin/forms`). The alias `/admin/form-templates` shows the same page. The old `/admin/form-builder` addresses redirect here. |
| **Where the result goes** | The stored forms and flows that the client Web Forms page and the patient forms screen also read. See [Web Forms](/client/web-forms). Scope, roles and permissions are not applied there (G13-E-55). |
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
| Client (Web Forms) | Shared form store | The client Web Forms page and the patient form screens read the same stored forms and flows. | [View Web Forms](/client/web-forms) |
| Client (Web Forms) | Scope, roles and permissions | Not applied. The client page ignores scope, allowed roles and permissions (G13-E-55). Decision needed: D-17. | [View Web Forms](/client/web-forms) |

## 1. Module Summary

### The story in one minute

Leo Martin is a Platform Admin. He opens **Forms** and sees two tabs: **Forms** and **Form Flows**, each with a count. He presses **New Form**, names it "Dental Intake" and the Form Builder opens. The form is saved as a draft. Back on the list he switches it to Live. He then opens **Scope & Permissions** and picks Allowed Roles and what each role can view, edit, share and delete. He expects only dental clinics and the right roles to see the form. The clinic's Web Forms page shows it to everyone, whatever he ticked. In Form Flows he chains three forms into a "New-patient packet".

### What is real and what is not

- **Real in the prototype:** the two tabs and counts, creating a form that starts as a draft, duplicate, the Live and Draft toggle, the Scope & Permissions modal, and building Form Flows with steps.
- **Simulated:** the status (not shown in the table), Edit in Flow Builder (opens the Form Builder), delete without confirmation, the seed forms that return when all forms are deleted, and the scope, roles and permissions that tenants ignore.
- **Not built:** import, export and versioning, and loading and error states.

### Journey position

```
Admin form or flow ─▶ Stored forms ─▶ Client Web Forms and patient forms (scope and roles ignored)
```

## 2. Feature Requests

### F-1: Form templates

#### 1. What it does
On the **Forms** tab Leo searches and filters by Category, Industry, Location and Status. The table shows Template Name, Scope, Fields and Created or Updated. The row menu has **Edit in Flow Builder**, **Scope & Permissions**, **Duplicate**, a Live and Draft toggle and **Delete**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Tabs and counts | Tabs | Forms (N) and Form Flows (N) with a count badge in the header | ● Works | |
| F-1.2: Forms table | Table | Template Name, Scope, Fields count, Created or Updated | ◐ Simulated | The Live or Draft status is not shown in the table (G13-E-53) |
| F-1.3: Search and filters | Controls | Search plus Category, Industry, Location and Status filters | ● Works | |
| F-1.4: New Form | Drawer | The name is required. The form is saved as a draft and the Form Builder opens | ● Works | |
| F-1.5: Edit in Flow Builder | Row action | Intended to edit the form | ◐ Simulated | Opens the Form Builder (G13-E-56) |
| F-1.6: Duplicate | Row action | Adds a copy of the form | ● Works | |
| F-1.7: Toggle Live or Draft | Row action | Switches the form's status | ● Works | |
| F-1.8: Delete | Row action | Removes the form at once | ◐ Simulated | No confirmation (G13-E-52). Decision needed: D-06 |
| F-1.9: Deleted forms stay deleted | Rule | A deleted form should stay deleted | ◐ Simulated | Deleting every form brings the seed forms back (G13-E-54). Decision needed: D-32 |
| F-1.10: Scope & Permissions | Modal | Allowed Roles (Admin, Manager, Reception, Staff / Provider, Client / Public) and Can View, Edit, Share, Delete | ● Works | Saved with the form. Tenants do not apply it, see F-3 |

#### 3. Worked example
Leo builds an intake form for dental clinics.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He presses **New Form** and names it **Dental Intake** | Saves | **The form is created as a draft and the Form Builder opens** |
| 2 | He returns to the list | Looks for the status | **The table has no status column** |
| 3 | He opens a row menu | Presses **Delete** | **The form is removed at once with no confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I standardise intake, I want shared form templates with a scope and allowed roles, so that every clinic gets the right forms. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** New Form, **when** the name is given, **then** the form is saved as a draft and the Form Builder opens. |
| F-1-2 | **Given** the forms table, **then** it shows no Live or Draft status. |
| F-1-3 | **Given** Delete on a form, **then** it is removed with no confirmation. |
| F-1-4 | **Given** every form is deleted, **then** the seed forms return. |

### F-2: Form Flows

#### 1. What it does
On **Form Flows** Leo sees Flow Name with its number of steps, Category, Status and Created. **Configure Steps** lets him add and remove forms, mark each required and reorder them. He can preview, duplicate, toggle and delete a flow.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Flows table | Table | Flow Name with step count, Category, Status (Live or Draft), Created | ● Works | |
| F-2.2: Configure Steps | Editor | Add and remove steps, mark them required, reorder | ● Works | |
| F-2.3: Preview | Drawer | Shows the flow | ● Works | |
| F-2.4: Duplicate and toggle | Row action | Copies a flow, switches Live and Draft | ● Works | |
| F-2.5: Delete flow | Row action | Asks "Are you sure you want to delete form flow" in a browser confirmation | ● Works | |
| F-2.6: Import, export and versioning | Action | No such controls exist | ○ Not built | |

#### 3. Worked example
Leo builds the new-patient packet.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He opens **Configure Steps** | Adds three forms in order | **The flow shows "3 Steps"** |
| 2 | He deletes the flow | Presses **Delete** | **A confirmation shows before it is removed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When patients need several forms, I want them in a fixed sequence, so that none is missed. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a flow with three forms, **then** its row shows three steps. |
| F-2-2 | **Given** Delete on a flow, **then** a browser confirmation shows before it is removed. |

### F-3: Effect on tenants

#### 1. What it does
Admin forms and flows live in the same stores that the client Web Forms page and the patient form screens read. The scope, allowed roles and permissions that Leo sets are saved, but the client page does not check them. For how that page works, see [Web Forms](/client/web-forms).

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Shared form store | Rule | The client Web Forms page and the patient form screens read the same stored forms and flows | ● Works | |
| F-3.2: Scope, roles and permissions on the client | Rule | Only forms in scope, for allowed roles, with the right permissions should show | ◐ Simulated | The client ignores all three (G13-E-55). Decision needed: D-17 |
| F-3.3: Loading and error states | State | None exist | ○ Not built | See G13-X-05 |

#### 3. Worked example
Leo restricts a form to dental clinics.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The form has a dental scope and limited roles | A non-dental clinic opens Web Forms | **The form is listed anyway** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When I restrict a form, I want clinics outside its scope and roles not to see it, so that the wrong forms are not used. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a form with a scope, allowed roles and permissions, **when** a tenant opens Web Forms, **then** the form is shown whatever those settings say. |
| F-3-2 | **Given** a form is Live or Draft, **then** both the admin and the client read the same stored status. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Form templates | F-1.1 – F-1.10 | ● / ◐ | List and builder work; no status column and unguarded delete. |
| F-2 | Form Flows | F-2.1 – F-2.6 | ● / ○ | Flows and steps work; delete confirms. |
| F-3 | Effect on tenants | F-3.1 – F-3.3 | ● / ◐ / ○ | Tenants read the forms but ignore scope and roles. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Share form templates with a scope and allowed roles | F-1 |
| 2 | Platform Admin | Put several forms in a fixed sequence | F-2 |
| 3 | Platform Admin | Keep out-of-scope clinics from seeing a form | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/forms`, create, publish, edit and delete forms and flows | Nothing. The admin routes only check sign-in |
| Tenant user | Open every form on the client Web Forms page | Nothing. Allowed roles and permissions are not checked (G13-E-55) |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The role comes from browser storage and defaults to SystemAdmin. The earlier PRD has no page for this screen. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Tab and header counts | Tabs | Number of stored forms and of flows |
| Fields | Forms table | Number of fields in the form |
| Scope summary | Scope column | Industries and countries named by the scope rules |

## 6. Cross-module journeys this module appears in

This screen appears in none of the four journeys on the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-17 | Which roles may edit forms, and must tenants respect scope, allowed roles and permissions? | F-3.2 |
| D-06 | Should every destructive action ask for confirmation? | F-1.8 |
| D-32 | Can seeded forms be deleted for good, or only deactivated? | F-1.9 |
| D-12 | Must permissions block direct URL access and each action, not only hide sidebar items? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
