---
title: "Sections & Fields: Fields Tab (Global Custom Field Registry)"
product: "admin"
module: "custom-fields"
channel: "fields"
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
| **What it is** | The **Fields** tab of the **Sections & Fields** page. A table of custom fields for one record module at a time, with an **Add Field** drawer where a field gets its type, scope rules and tenant permissions. |
| **Who uses it** | Platform Admin (defines fields for tenants). No role is checked on the page: any signed-in user who types the URL can use it. |
| **Where you start it** | **Sections/Fields** in the admin sidebar. `/admin` and `/admin/custom-fields` both open it, on the Fields tab. |
| **Where the result goes** | One field registry kept in the browser. Client Settings Custom Fields, record profiles and drawers, the Form Builder and variable pickers read it. |
| **How real is it** | 0 features work, 4 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Settings) | Custom Fields tab | The client Settings tab reuses the same drawers in tenant mode and reads the same registry. A field shows to a tenant when a scope rule matches, or when it has no rules. | [View Custom Fields](/client/settings/custom-fields) |
| Client (Clients) | Record profiles | Client profile, process, appointment, invoice, claim, team member, organisation and service drawers read the registry. | [View Clients](/client/clients) |
| Client (Web Forms) | Form Builder fields | The Form Builder and variable pickers read the same registry. | [View Web Forms](/client/web-forms) |
| Admin (Sections) | Fields grouped into sections | A section lists fields from this registry. Deleting a field removes its key from every section. | [View Sections](/admin/custom-fields/sections) |
| Admin (Industries) | Scope pickers | Scope rules pick an industry category, industries and a country from fixed reference lists, not from the Industries screen. | [View Industries](/admin/industry-category/industries) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Sections/Fields** and lands on the **Fields** tab with the **Contact** module selected. He sees the fields as rows with Label, Key, Type, Required and Scope. He wants a blood type field for eye clinics. He presses **Add Field**, picks Contact, types the name "Blood Type" and chooses the List type. He adds the options, sets a scope of one industry category and saves. The drawer closes with no message, and the new row is in the table. The key reads `blood_type`, made from the name. He cannot change it. Clinics in that category now see the field on their contact profiles.

### What is real and what is not

- **Real in the prototype:** the module and Contact Category switchers, the table with search and its filters, the create and edit drawer with 15 field types, scope rules, delete with a confirmation, the lock on deleting system fields, and the registry that tenant screens read.
- **Simulated:** edits to built-in (system) fields open in an editable drawer and are then silently discarded. Field keys are not checked for uniqueness. Tenant permissions are stored on the field, but a tenant can still edit or delete an admin-created field because the registry has no owner marker.
- **Not built:** a Task module, editable keys, an enforced validation formula across tenants, Field Status and Validation columns, a success message on save, and loading and error states.

### Journey position

```
Define field ─▶ Set scope and permissions ─▶ Registry ─┬▶ Client Settings Custom Fields
                                                       ├▶ Record profiles and drawers
                                                       └▶ Form Builder pickers
```

## 2. Feature Requests

### F-1: Browse the field list

#### 1. What it does
Leo opens the page and sees the **Fields | Sections** switch, a **Module** dropdown and a **Contact Category** dropdown. He picks a module. The table shows its fields. He types in the search box or presses a preset chip. The scope column says things like "2 industries, 1 countries". A new Contact Category can be added from the dropdown.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Module dropdown | Select | Contact, Call Logs, Processes, Appointments, Services, Invoices, Insurance & Claims, Organizations, Team Members. Contact is the default | ● Works | Task is not a module. The earlier PRD named Client, Appointment, Process and Task (G13-CF-07) |
| F-1.2: Contact Category | Select | Lead (default), Client, custom categories and **+ Add Category** | ● Works | The earlier PRD did not mention it (G13-CF-10) |
| F-1.3: Fields table | Table | Label, Key, Type, Process (Processes module only), Required or Optional, Scope | ● Works | Entity, Validation and Status columns of the earlier PRD are absent (G13-CF-01, G13-CF-18) |
| F-1.4: Search | Search | Filters the table by text | ● Works | |
| F-1.5: Presets All and Text | Chips | Filter the list | ● Works | |
| F-1.6: Required preset | Chip | Types the word "required" into the search box | ◐ Simulated | It does not filter on the Required flag (G13-E-27) |
| F-1.7: Empty state | State | A message shows when no field matches | ● Works | |
| F-1.8: Loading and error states | State | None exist | ○ Not built | Data is browser-local, so nothing loads or fails |
| F-1.9: Sorting by entity | Table | Described in the earlier PRD | ○ Not built | The table has no sort control |
| F-1.10: Role control | Rule | Any signed-in user can open and use the page | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo checks what a clinic sees on its contacts.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The page opens on Contact | Presses the **Text** chip | **Only Text fields are listed** |
| 2 | He wants required fields | Presses the **Required** chip | **The word "required" appears in the search box. The list is not filtered on the Required flag** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I review the data model, I want to see every field of one module with its type and scope, so that I know what tenants collect. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the page opens, **then** the Fields tab shows with the Contact module and the Lead category selected. |
| F-1-2 | **Given** a module is picked, **then** the table lists that module's fields with Label, Key, Type, Required or Optional and Scope. |
| F-1-3 | **Given** the Required chip is pressed, **then** the text "required" is typed into search. No Required filter is applied. |
| F-1-4 | **Given** no field matches, **then** the empty message shows. |

### F-2: Create and edit a field

#### 1. What it does
Leo presses **Add Field** and a drawer opens. He picks the module (several modules make a shared field), names the field and chooses its type from 15 types in four groups. Type settings appear below. He adds a placeholder, a tool tip and a default value, then the field settings. He saves. The key is made from the name and is locked after creation.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Module and Workflow | Multi-select | Module is required. Process, Appointment, Invoice or Claim Workflow can also be picked | ● Works | |
| F-2.2: Field Name | Text | Required. The drawer rejects an empty name | ● Works | |
| F-2.3: Field Key | Rule | Made from the name: lowercase, underscores, letters and digits only. Not editable and locked after creation | ◐ Simulated | No uniqueness check. A name made only of symbols gives an empty key (G13-E-24). The earlier PRD said the key is typed and validated (G13-CF-03). Decision needed: D-30 |
| F-2.4: Field Type | Picker | Text, String, Phone Number, Email, Link or URL, Number, Money or Currency, Date and Time, Rating or Score, List, Yes or No, Group Field, Link to Mantra Entities, Media Attach, Digital Signature | ● Works | The earlier PRD listed fewer types (G13-CF-05) |
| F-2.5: List type | Setting | Basic or Advance (multi-column) list | ◐ Simulated | The second advance list cannot be chosen for a new field (G13-E-29) |
| F-2.6: Type settings | Settings | Formula for String, Number and Money. Currency, min and max. Date capture, format, min and max. Media category, formats and size. Group sub-fields | ● Works | |
| F-2.7: Number checks | Rule | Min must not exceed max. The default must be inside the range | ● Works | |
| F-2.8: Placeholder, Tool tip, Default Value | Fields | Placeholder is suggested when left blank | ● Works | |
| F-2.9: Required and Required at Stages | Setting | Required flag. Per process, a count such as "x of y" stages | ● Works | |
| F-2.10: Show always and User Visibility | Setting | Show the field to everyone, or limit it to chosen team members | ● Works | |
| F-2.11: Validation formula across tenants | Rule | The earlier PRD said validation formulas are enforced in all tenant schemas | ○ Not built | The drawer holds a formula setting. Nothing enforces it across tenants (G13-CF-06) |
| F-2.12: Success message | State | Saving closes the drawer with no message | ○ Not built | (G13-E-28) |

#### 3. Worked example
Leo adds Blood Type.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer is open on Contact | Types **Blood Type** and picks the **List** type | **The key shows as `blood_type`** |
| 2 | Options added | Presses save | **The drawer closes with no message and the row appears** |
| 3 | He creates a second field named "!!!" | Saves | **A field with an empty key is saved** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When I standardise clinical data, I want to define a typed field once, so that every tenant collects it the same way. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** Field Name is empty, **when** the user saves, **then** the drawer shows a validation message and nothing is saved. |
| F-2-2 | **Given** Number min is larger than max, **when** the user saves, **then** the drawer refuses. |
| F-2-3 | **Given** a new field, **then** its key is made from the name and cannot be edited. Two fields can end up with the same key. |
| F-2-4 | **Given** a field is saved, **then** no success message shows. |

### F-3: Scope, permissions and who sees a field

#### 1. What it does
In the drawer's **Admin Control** section Leo adds **Scope Rules**: Industry Category, Industries and, if he likes, a Country. A tenant sees the field when any rule matches. With no rules, every tenant sees it. He also ticks **Permissions**: Hide, Edit, Add Options and Delete. In the client's Settings the same drawer opens in tenant mode.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Scope Rules | Rules | Each rule picks an industry category, industries and an optional country. Any matching rule shows the field. No rules means all tenants | ● Works | The industry and country lists are fixed reference data, not the Industries screen (G13-CF-09). Decision needed: D-50 |
| F-3.2: Visibility to tenants | Rule | System fields always show. Process assignment is enforced inside a process. The contact category filter applies | ● Works | (G13-CF-08) |
| F-3.3: Tenant Permissions | Checkboxes | Hide, Edit, Add Options, Delete | ◐ Simulated | Stored on the field. A tenant can edit or delete admin-created fields because the registry has no owner marker (G13-CF-12, G10-E-29). Decision needed: D-30 |
| F-3.4: One shared registry | Rule | Admin and client fields live in one browser-held registry with no owner marker. Open tabs stay in sync | ◐ Simulated | Only system fields are locked (G10-E-29) |
| F-3.5: Client Settings tab | Cross-product | The client Settings Custom Fields tab reuses the drawers and reads the registry | ● Works | (G13-CF-19) |

#### 3. Worked example
Leo limits a field to one industry category.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Field drawer, Admin Control | Adds one scope rule for an industry category | **Only matching tenants see the field** |
| 2 | He removes the rule | Saves | **Every tenant sees the field** |
| 3 | A clinic admin opens its own Custom Fields | Edits Leo's field | **The edit is allowed. Nothing marks the field as owned by the platform** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When a field only suits some clinics, I want to scope it by industry and country, so that other tenants do not see it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a field with no scope rules, **then** all tenants see it. |
| F-3-2 | **Given** a field with several rules, **when** any one matches the tenant, **then** the field shows. |
| F-3-3 | **Given** a tenant opens Client Settings Custom Fields, **then** admin-created fields appear and can be edited or deleted. |

### F-4: Edit and delete a field

#### 1. What it does
Leo opens a row menu and chooses **Edit Field** or **Delete Field**. System fields show **View Details** and have no delete item. A built-in field opens in an editable drawer, and his changes disappear. A custom field asks for confirmation before it is deleted.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Row actions | Menu | Edit Field or View Details for system fields, and Delete Field for the others | ● Works | |
| F-4.2: Edit custom field | Drawer | Changes are saved to the registry | ● Works | |
| F-4.3: Edit system field | Drawer | Opens editable. Changes are silently discarded | ◐ Simulated | (G13-E-25). Decision needed: D-30 |
| F-4.4: Delete from the table | Modal | Asks to confirm, removes the field and its key from every section. No toast | ◐ Simulated | The drawer has a second delete path that differs (G13-E-26). Decision needed: D-06 |
| F-4.5: Delete from the drawer | Button | Browser confirm, then a success toast | ◐ Simulated | On system fields the toast shows although nothing is deleted (G13-E-26) |
| F-4.6: System fields cannot be deleted | Rule | The table hides Delete Field for system fields | ● Works | |
| F-4.7: Deleting a field in use | Rule | The field is removed with no check for data held in it | ○ Not built | Decision needed: D-32 |

#### 3. Worked example
Leo removes a test field.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A custom field row | Chooses **Delete Field** in the row menu | **A modal asks to confirm. After confirming the row and its section entries are gone** |
| 2 | A built-in field | Opens it, changes the label and saves | **The drawer closes. The label is unchanged** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Platform Admin | When a field is retired, I want to delete it everywhere it is used, so that tenants stop seeing it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a system field, **then** the table offers no Delete Field action. |
| F-4-2 | **Given** a deleted field, **then** its key is removed from every section. |
| F-4-3 | **Given** edits on a system field, **when** saved, **then** the registry is unchanged. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Browse the field list | F-1.1 – F-1.10 | ● / ◐ / ○ | Table works; Required chip is only a text search. |
| F-2 | Create and edit a field | F-2.1 – F-2.12 | ● / ◐ / ○ | Drawer works; keys unchecked and no save message. |
| F-3 | Scope, permissions and visibility | F-3.1 – F-3.5 | ● / ◐ | Scope works; tenants can still edit admin fields. |
| F-4 | Edit and delete a field | F-4.1 – F-4.7 | ● / ◐ / ○ | System edits are discarded; two delete paths differ. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | See every field of one module with its type and scope | F-1 |
| 2 | Platform Admin | Define a typed field once for every tenant | F-2 |
| 3 | Platform Admin | Scope a field by industry and country | F-3 |
| 4 | Platform Admin | Delete a retired field everywhere | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/custom-fields`, create, edit and delete custom fields | Deleting system fields. System edits are discarded |
| Tenant user in Client Settings | Edit or delete admin-created fields in the shared registry | Deleting system fields |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The admin sidebar hides the item from roles that cannot read the Custom Fields module, but the URL still opens. The earlier PRD said superadmins configure fields and did not name roles. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Scope | Fields table | "N industries, M countries" from the field's scope rules |
| N Processes | Fields table | Count of processes the field is assigned to |
| Required at Stages (x of y) | Field drawer | Stages marked required out of the process's stages |

## 6. Cross-module journeys this module appears in

This module is not a step in the four journeys on the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-30 | Should field keys be editable, can system fields be edited, may a tenant edit or delete admin-defined fields, and what defines a unique key? | F-2.3, F-3.3, F-4.3 |
| D-12 | Must permissions block direct URL access and each action, not only hide sidebar items? | F-1.10 |
| D-50 | Is Industries the master for scope pickers? | F-3.1 |
| D-06 | Should every destructive action ask for confirmation in one consistent way? | F-4.4 |
| D-32 | May a field be deleted once it holds data, or only deactivated? | F-4.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
