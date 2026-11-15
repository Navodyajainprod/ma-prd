---
title: "Custom Fields, Dynamic Layout & Data Dictionary"
product: "client"
module: "settings"
channel: "custom-fields"
route: "/settings/sections-fields"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS: SECTIONS / FIELDS |
| Route | `/settings/sections-fields` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Sections / Fields** tab of Client Settings. One screen with a **Fields** mode and a **Sections** mode, an entity picker, a table and an add and edit drawer. It edits the same field registry as the admin Fields Master. |
| **Who uses it** | Practice Admin (adds fields and groups them in sections). Only the SystemAdmin role passes the Settings guard. |
| **Where you start it** | **Settings**, then **Sections / Fields** (`/settings/sections-fields`). The addresses `custom-fields` and `layout` open the same tab. |
| **Where the result goes** | A shared browser registry. Forms and drawers of the chosen entity read it. The admin Fields Master reads and writes the same registry. |
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
| Admin | Fields Master | Admin and workspace fields live in one registry with no owner marker. Fields the admin scopes to this organisation appear here, and this tab can edit or delete them (G10-E-29). | [View Admin Fields](/admin/custom-fields/fields) |
| Admin | Sections | The same sections registry. System sections are locked, others can be edited here. | [View Admin Sections](/admin/custom-fields/sections) |
| Client (Clients) | Contact fields and categories | The **Contact** entity has a contact-category filter. A field scoped to a category only lists under it. | [View Clients](/client/clients) |
| Client (Appointments) | Appointment fields | Fields and sections of the Appointments entity are read by appointment forms and drawers. Not re-checked on every screen. | [View Appointments](/client/appointments/list) |
| Client (Invoices) | Invoice fields | The Invoices entity has its own fields and sections here. | [View Invoices](/client/invoices) |
| Client (Claims) | Insurance and claim fields | The **Insurance & Claims** entity lists its fields here. | [View Claims](/client/claims) |
| Client (Services) | Service fields | The Services entity lists its fields here. | [View Services](/client/services) |
| Client (Web Forms) | Form fields | The Forms entity lists its fields here. | [View Web Forms](/client/web-forms) |
| AI Receptionist | Stage card placeholders | Not connected. The kiosk field picker offers a fixed list and no custom fields. | [View Stations](/ai-receptionist/settings/stations) |

## 1. Module Summary

### The story in one minute

Rohan Mehta, the Practice Admin, opens **Settings** and **Sections / Fields**. The screen opens on **Fields**. He picks **Appointments** in the entity drop-down and sees a table with Label, Key, Type, Field Type and Required. Rows marked System are locked. He presses **Add Field** and a drawer opens. He names a number field "Tooth Number", assigns it to a section and saves. The field appears in the table as Custom. He then opens **Sections**, adds a section called "Dental Details" and drops the new field into it. Later he notices a field he never made. The platform admin created it for his industry. The row has no owner label, and Rohan can edit or delete it.

### What is real and what is not

- **Real in the prototype:** the entity picker with ten entities, the Fields and Sections tables, Add and Edit drawers, system rows locked, scoping by organisation and contact category, copy key, delete with confirmation and bulk delete.
- **Simulated:** the field key (made from the label, not editable, and not checked for uniqueness), the **Required Fields** preset (it only types the word into search), and the edit and delete of admin-made fields, which is allowed without any owner marker.
- **Not built:** entering the key by hand, intake validation of required fields, a separate patient-portal visibility flag, drag order of options with badge colours, and an owner marker on fields.

### Journey position

```
Admin Fields Master ─┐
                     ├▶ shared field registry ─▶ Settings: Sections / Fields ─▶ entity forms and drawers
Settings (this tab) ─┘
```

## 2. Feature Requests

### F-1: Browse and filter fields and sections

#### 1. What it does
Rohan opens **Sections / Fields**. A top bar has two modes, **Fields** and **Sections**. A drop-down chooses the entity: **Organizations**, **Contact**, **Call Logs**, **Processes**, **Appointments**, **Services**, **Invoices**, **Insurance & Claims**, **Forms** or **Team**. For **Contact** a second drop-down chooses the contact category and offers **+ Add Category**. A search box and the presets **All Fields**, **Required Fields**, **Text Fields** and **Dropdowns & Choices** narrow the table. Sections has **All Sections**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Entity picker | Select | Ten entities as listed above | ● Works | The old PRD named only Patients, Appointments, Processes and Tasks. There is no Task entity (G13-CF-07). Decision needed: D-30 |
| F-1.2: Fields table | Table | Columns Label, Key, Type (System, Template or Custom), Field Type and Required or Optional. Search covers label, key and type | ● Works | |
| F-1.3: Sections table | Table | Columns Section, Type, Fields and Description | ● Works | |
| F-1.4: Scoping | Rule | Only fields and sections whose scope matches the active organisation are listed. System rows are always listed | ● Works | Scope is industry category, industry, location and process (G13-CF-09) |
| F-1.5: Contact category filter | Select | For **Contact**, only fields and sections of the chosen category are listed. **+ Add Category** opens a modal | ● Works | G13-CF-10 |
| F-1.6: Presets | Chips | **All Fields** clears the search. **Required Fields**, **Text Fields** and **Dropdowns & Choices** type the word into the search box | ◐ Simulated | The Required Fields preset matches the word "required" in text, not the Required flag (G13-E-27) |
| F-1.7: Empty state | State | "No fields found for this entity." and "No sections found for this entity." | ● Works | |
| F-1.8: Field status and validation formulas | Column | Described in the earlier admin PRD | ○ Not built | G13-CF-18, G13-CF-06 |
| F-1.9: Loading and error states | State | None. The registry is read from the browser at once | ○ Not built | |

#### 3. Worked example
Rohan checks what exists before adding anything.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants appointment fields | Picks **Appointments** in the entity drop-down | **The table lists system fields (locked) and any custom fields for his organisation** |
| 2 | He wants contact fields for one category | Picks **Contact**, then a contact category | **Only fields of that category are listed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | Before adding a field, I want to see what already exists for an entity, so that I do not create a duplicate. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a field scoped to another industry, **when** Rohan opens the entity, **then** the field is not listed. |
| F-1-2 | **Given** the **Required Fields** preset, **when** it is pressed, **then** the word "required" is typed into the search box. |
| F-1-3 | **Given** an entity with no matching field, **then** "No fields found for this entity." is shown. |

### F-2: Add and edit a field

#### 1. What it does
**Add Field** opens the same drawer the admin uses. It starts with the type **String / Text**, **Show always** on and two sample options. Rohan sets the label, the type, the section and whether the field is required. For a drop-down he edits the option list. Edit field reopens the drawer. The new field appears in the table as Custom.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Add Field drawer | Drawer | Label, type, section, required, multiple, tooltip, options and, for table types, columns. Types include text, number, money, dropdown, table and list | ● Works | G10-I-75 |
| F-2.2: Key | Rule | The key is made from the label and cannot be typed in | ◐ Simulated | Uniqueness is not checked and a label of only symbols gives an empty key (G13-E-24). Decision needed: D-30 |
| F-2.3: Dropdown options | List | Add and edit options with a label and a value | ◐ Simulated | Badge colours and drag order not verified in code |
| F-2.4: Required flag | Toggle | Marks the field required | ◐ Simulated | Stored and shown in the table. No intake form refuses a blank value (G10-I-78). Decision needed: D-30 |
| F-2.5: Visible to selected | Toggle | Limits who sees the field to chosen team members | ● Works | The old PRD called this "visible on patient portal" (G13-CF-13) |
| F-2.6: Edit field | Row action | Opens the drawer for a Custom or Template field | ◐ Simulated | System fields offer no edit. Edits to a system field made through other paths are silently discarded (G13-E-25) |
| F-2.7: Copy key | Row action | Copies the key and toasts `Copied key "<key>"` | ● Works | |
| F-2.8: Field appears on entity forms | Hand-off | Forms and drawers of the entity read the registry by scope | ◐ Simulated | Not re-checked on each screen (G13-CF-08) |
| F-2.9: Save feedback | State | The drawer closes with no success toast | ◐ Simulated | G13-E-28 |
| F-2.10: Mandatory-on-intake enforcement and a separate patient-portal flag | Rule | Described in the earlier PRD | ○ Not built | Decision needed: D-30 |
| F-2.11: Typing the field key by hand | Field | Described in the earlier PRD | ○ Not built | |

#### 3. Worked example
Rohan adds a tooth number for a dental clinic.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Entity is **Appointments** | Presses **Add Field**, enters "Tooth Number", chooses a number type and a section, saves | **The field is listed as Custom with an Optional flag. No success toast shows** |
| 2 | He adds "Tooth Number" a second time | Saves again | **A second field is created. The key is not checked for duplicates** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When tracking specialty data, I want to add a field to an entity, so that our records match our specialty. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the Add Field drawer, **when** a label is saved, **then** a Custom field is added to the chosen entity. |
| F-2-2 | **Given** two fields with the same label, **then** both are saved. No duplicate-key check runs. |
| F-2-3 | **Given** a field is marked required, **then** the table shows Required. No other screen blocks a blank value. |

### F-3: Delete fields and manage sections

#### 1. What it does
Rohan removes a field with a row action. A browser prompt asks him to confirm. A bulk **Delete Selected** removes several custom fields. In **Sections** he adds, edits and deletes sections and chooses which fields sit in each.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Delete field | Row action | Browser confirm `Delete field "<label>"?`, then removes it. Toast "Field deleted" | ● Works | Offered for non-system rows only |
| F-3.2: Delete Selected | Bulk action | Deletes selected custom fields after a confirm. Selected system fields are skipped with a toast | ● Works | |
| F-3.3: Add and edit Section | Drawer | Title, description and the fields it holds | ● Works | G10-I-79 |
| F-3.4: Delete section and Delete Selected | Row and bulk | Browser confirm, then removes custom sections. System sections are skipped | ● Works | |
| F-3.5: Assign fields to a section | Drawer | Pick fields into the section. Fields can be ordered inside it | ● Works | G13-CS-05, G13-CS-06 |
| F-3.6: System fields and sections | Rule | Always shown. Edit and delete are not offered | ● Works | G13-CF-14, G13-CS-09 |
| F-3.7: Admin-made fields and sections | Rule | Editable and deletable here like Custom ones. No owner marker separates them | ◐ Simulated | Security finding (G10-E-29). Decision needed: D-30 |
| F-3.8: Section reorder and default expanded | Control | Described in the earlier admin PRD | ○ Not built | G13-CS-01, G13-CS-03 |
| F-3.9: Role-based section gate | Rule | Earlier intent: limit a section by role | ○ Not built | Built as team-member visibility instead (G13-CS-04). Decision needed: D-12 |

#### 3. Worked example
Rohan tidies up.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | An unused custom field | Chooses **Delete field** and presses Cancel | **Nothing changes** |
| 2 | He repeats and accepts | Chooses **Delete field** and accepts | **The field is removed and a toast says "Field deleted"** |
| 3 | A field the platform admin made for his industry | Chooses **Delete field** and accepts | **It is deleted from the shared registry. The admin Fields Master loses it too** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When a form feels long, I want to group fields into sections and remove unused ones, so that staff see a tidy layout. |
| F-3-J2 | Platform Admin | When I publish a field to workspaces, I want tenants unable to delete it, so that every clinic keeps the same data dictionary. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a system field, **then** edit and delete are not offered. |
| F-3-2 | **Given** Delete and Cancel, **then** nothing changes. |
| F-3-3 | **Given** a field made in Admin, **when** Rohan deletes it here, **then** it is removed from the shared registry. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Browse and filter | F-1.1 – F-1.9 | ● / ◐ / ○ | Ten entities, scoping and contact category work. One preset is only a text search. |
| F-2 | Add and edit a field | F-2.1 – F-2.11 | ● / ◐ / ○ | Drawer works. Key unchecked and required flag not enforced. |
| F-3 | Delete and sections | F-3.1 – F-3.9 | ● / ◐ / ○ | Delete and sections work. Admin fields are not protected. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | See what exists before adding a field | F-1 |
| 2 | Practice Admin | Add a specialty field to an entity | F-2 |
| 3 | Practice Admin | Group fields and remove unused ones | F-3 |
| 4 | Platform Admin | Keep published fields safe from tenant deletion | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| SystemAdmin | Open the tab, add, edit and delete custom and admin-made fields and sections | Editing or deleting System fields and sections |
| Admin, Manager, Agent, Reception | See Settings in the menu | Opening it. A click sends them home with "Access restricted: Settings requires System Admin privileges." |

The role comes from browser storage and defaults to SystemAdmin. The earlier PRD named a Clinic Administrator and said nothing about admin-made fields. Decision needed: D-12.

## 5. Metrics and definitions

No metric is shown. The Fields column on the Sections table is a plain count of assigned fields.

## 6. Cross-module journeys this module appears in

The tab is not a step in the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-30 | Should field keys be editable, can system fields be edited, may a tenant edit or delete admin-defined fields, and what defines a unique key? | F-1.1, F-2.2, F-2.4, F-2.10, F-3.7 |
| D-12 | Must roles block direct access and each action, and where is the role matrix enforced? | F-3.9, Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
