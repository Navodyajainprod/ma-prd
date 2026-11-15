---
title: "Sections & Fields: Sections Tab (Field Groups on Record Profiles)"
product: "admin"
module: "custom-fields"
channel: "sections"
route: "/admin/custom-fields"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | CUSTOM-FIELDS |
| Route | `/admin/custom-fields` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Sections** tab of the **Sections & Fields** page. A table of sections for one record module, and a drawer that names a section, scopes it and arranges the fields inside it. |
| **Who uses it** | Platform Admin (groups fields for tenants). No role is checked on the page. |
| **Where you start it** | **Sections/Fields** in the admin sidebar (`/admin` or `/admin/custom-fields`), then the **Sections** switch. The switch is page state: the URL does not change. |
| **Where the result goes** | The same browser-held registry as the Fields tab. Client Settings Custom Fields and record profiles read it. |
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
| Client (Settings) | Custom Fields tab | The client Settings tab reuses the section drawer in tenant mode and reads the same section registry. | [View Custom Fields](/client/settings/custom-fields) |
| Client (Clients) | Record profiles | Profile drawers read the registry. The profile layout shows the sections and the order of fields set here. Section order is not set here. | [View Clients](/client/clients) |
| Admin (Fields) | Fields inside sections | The section picker lists fields from the Fields tab that match the section's category and scope. Deleting a field removes it from every section. | [View Fields](/admin/custom-fields/fields) |
| Admin (Industries) | Scope pickers | Scope rules use fixed industry and country lists, not the Industries screen. | [View Industries](/admin/industry-category/industries) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Sections/Fields** and presses the **Sections** switch. The Contact module lists its sections with a description, a scope and a count such as "4 fields". He wants an Insurance Details section. He presses **Add Section** and the drawer opens. He picks the module, names the section and adds a short description. In the field picker he adds three fields and drags the policy number to the top. He adds one scope rule and saves. The drawer closes with no message. The row reads "3 fields". He cannot set the section to open expanded, and he cannot reorder the sections themselves.

### What is real and what is not

- **Real in the prototype:** the sections table, the create and edit drawer, the field picker with drag to reorder inside a section, scope rules, delete with a confirmation, and the lock on deleting system sections.
- **Simulated:** edits to built-in (system) sections open in an editable drawer and are silently discarded. Tenant permissions are stored but a tenant can still edit admin sections, because admin and client share one registry with no owner marker.
- **Not built:** reordering sections, default expanded or collapsed, a role-based section gate, duplicate, status, import and export, and a success message on save.

### Journey position

```
Pick module ─▶ Name section ─▶ Add and order fields ─▶ Set scope ─▶ Registry ─┬▶ Client Settings
                                                                              └▶ Record profiles
```

## 2. Feature Requests

### F-1: Browse and delete sections

#### 1. What it does
Leo switches to **Sections** and picks a module. The table shows Section, Description, Process, Scope and Fields. The Contact Category dropdown and search work as on the Fields tab. A row menu offers **Edit** and, for non-system sections, **Delete Section**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Sections table | Table | Section, Description, Process, Scope, and a "N fields" count | ● Works | (G13-CS-02) |
| F-1.2: Fields / Sections switch | Toggle | Changes the table and the Add button between Add Field and Add Section | ● Works | |
| F-1.3: Delete Section | Modal | Asks to confirm, then removes the section | ● Works | Hidden for system sections. No toast. Decision needed: D-06 |
| F-1.4: System sections cannot be deleted | Rule | The row menu has no delete item | ● Works | (G13-CS-09) |
| F-1.5: Empty state | State | A message shows when the module has no sections | ● Works | |
| F-1.6: Loading and error states | State | None exist | ○ Not built | Data is browser-local |
| F-1.7: Reorder sections | Drag list | Described in the earlier PRD. Drag handles, a saved order shown on entity drawers | ○ Not built | No section reorder exists (G13-CS-01) |
| F-1.8: Duplicate, status, import and export | Row action | Not offered | ○ Not built | |
| F-1.9: Role control | Rule | Any signed-in user can open, create and delete | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo removes a section he no longer needs.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A custom section row | Chooses **Delete Section** | **A modal asks to confirm. The section is removed. No message shows** |
| 2 | A system section row | Opens the row menu | **There is no delete item** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When a layout is no longer needed, I want to remove a section, so that profiles stay tidy. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a module with sections, **then** each row shows its field count. |
| F-1-2 | **Given** a system section, **then** the table offers no delete action. |
| F-1-3 | **Given** a custom section, **when** the user confirms delete, **then** it is removed. |

### F-2: Create and edit a section and arrange its fields

#### 1. What it does
**Add Section** opens a drawer. Leo picks the module, a Contact Category and, where it applies, a Process Workflow. He types the Section Name and a description. A picker lists fields that match the section's category and scope. He adds them and drags them into order. He saves.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Module, Contact Category, Process Workflow | Selects | Module is required | ● Works | |
| F-2.2: Section Name and Description | Text | Name is required | ● Works | |
| F-2.3: Fields in this section | Picker | Adds, removes and drags fields into order. The picker shows only fields that match the section's category and scope | ● Works | (G13-CS-05, G13-CS-06) |
| F-2.4: Global Rules | Setting | Show always, and User Visibility by team member | ● Works | The earlier PRD said role-based visibility (G13-CS-04). Decision needed: D-12 |
| F-2.5: Edit a custom section | Drawer | Changes are saved to the registry | ● Works | |
| F-2.6: Edit a system section | Drawer | Opens editable. Changes are silently discarded | ◐ Simulated | (G13-E-25). Decision needed: D-30 |
| F-2.7: Success message | State | Saving closes the drawer with no message | ○ Not built | (G13-E-28) |
| F-2.8: Default expanded | Toggle | Described in the earlier PRD | ○ Not built | No such setting (G13-CS-03) |
| F-2.9: Role-based section gate | Matrix | Described in the earlier PRD. Hide a section from a role | ○ Not built | Visibility is by team member instead. Decision needed: D-12 |

#### 3. Worked example
Leo builds Insurance Details.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer open on Contact | Names it **Insurance Details** and adds three fields | **The picker lists only fields that match the section's category and scope** |
| 2 | Fields are in the list | Drags the policy number first | **The order is kept** |
| 3 | He saves | Presses save | **The drawer closes with no message. The table shows "3 fields"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When forms are dense, I want fields grouped into named sections in a set order, so that staff are not overwhelmed. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** Section Name is empty, **when** the user saves, **then** the section is not saved. |
| F-2-2 | **Given** fields are dragged into an order, **when** saved, **then** the order is kept. |
| F-2-3 | **Given** a system section is edited, **when** saved, **then** the registry is unchanged. |

### F-3: Scope and tenant permissions on a section

#### 1. What it does
In the drawer's **Admin Control** section Leo adds **Scope Rules** (Industry Category, Industries, optional Country) and ticks **Permissions**: Hide, Edit, Add and Delete. No rules means every tenant sees the section.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Scope Rules | Rules | Any matching rule shows the section. No rules means all tenants | ● Works | Industry and country lists are fixed reference data (G13-CS-07). Decision needed: D-50 |
| F-3.2: Tenant Permissions | Checkboxes | Hide, Edit, Add, Delete | ◐ Simulated | Stored only. A tenant can still edit admin sections (G13-CS-08, G10-E-29). Decision needed: D-30 |
| F-3.3: Shared registry | Rule | Admin and client sections live in one browser-held registry with no owner marker | ◐ Simulated | (G10-E-29) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A section for one industry | Adds one scope rule | **Only matching tenants see it** |
| 2 | He leaves the rules empty | Saves | **All tenants see it** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When a section only suits some clinics, I want to scope it, so that other tenants do not see it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a section with no scope rules, **then** all tenants see it. |
| F-3-2 | **Given** Permissions are ticked, **then** they are stored. A tenant can still edit the section. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Browse and delete sections | F-1.1 – F-1.9 | ● / ○ | Table and delete work; no section reorder. |
| F-2 | Create, edit and arrange | F-2.1 – F-2.9 | ● / ◐ / ○ | Drawer and field order work; system edits are discarded. |
| F-3 | Scope and permissions | F-3.1 – F-3.3 | ● / ◐ | Scope works; permissions are stored only. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Remove a section no longer needed | F-1 |
| 2 | Platform Admin | Group fields into named sections in order | F-2 |
| 3 | Platform Admin | Scope a section to some clinics | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/custom-fields`, create, edit and delete custom sections | Deleting system sections. System edits are discarded |
| Tenant user in Client Settings | Edit admin-created sections in the shared registry | Deleting system sections |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD described a role gate that hides sections from roles such as Nurses. The prototype has none. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Fields count | Sections table | Number of fields in the section, shown as "N fields" |
| Scope | Sections table | "N industries, M countries" from the section's scope rules |

## 6. Cross-module journeys this module appears in

This module is not a step in the four journeys on the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-12 | Must permissions block direct URL access and each action, and should sections gate by role? | F-1.9, F-2.4, F-2.9 |
| D-30 | Can system sections be edited, and may a tenant edit or delete admin-defined sections? | F-2.6, F-3.2 |
| D-50 | Is Industries the master for scope pickers? | F-3.1 |
| D-06 | Should every destructive action ask for confirmation in one consistent way? | F-1.3 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
