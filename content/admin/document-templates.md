---
title: "Document Templates: Master Registry"
product: "admin"
module: "document-templates"
route: "/admin/document-templates"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | DOCUMENT-TEMPLATES |
| Route | `/admin/document-templates` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A list of standard document templates with an entity filter, an Add Document Template drawer (Word upload or HTML with placeholders) and a scope modal. |
| **Who uses it** | Platform Admin (builds the templates). Tenants use the same store: they can see and change the same templates. No role is checked. |
| **Where you start it** | **Document Templates** in the admin sidebar (`/admin/document-templates`, also `/admin/document-template`). |
| **Where the result goes** | Client document generation for a Client, Process, Appointment or Invoice record, the Documents tab on a client, and the automation step picker. Client generation ignores the admin scope rules. |
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
| Client (Clients) | Generate a document | The client Documents tab reads the same template store. It filters only by record type and category and ignores the admin scope rules. Unfilled placeholders become blank (G13-E-33). | [View Clients](/client/clients) |
| Client (Workflows) | Automation step picker | The process automation step picker applies the scope rules. | [View Workflows](/client/workflows) |
| Client (Invoices) | Invoice documents | Invoice is one of the four record types a template can be made available for. | [View Invoices](/client/invoices) |
| Client (all pages) | Shared template store | Admin and tenant screens share one store kept in the browser tab. There is no separation between tenants (G13-E-31). | [View Clients](/client/clients) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Document Templates**. The **Client** filter is selected and the table lists templates with Name, Entity, Category, Scope and Fillable Fields. He presses **Add Document Template**. He names it, picks a category and chooses **Import Word Doc**. The drawer extracts the content and lists the placeholders it found, each mapped to a client field. He saves. Then he opens **Configure Scope & Entities** and limits the template to one industry. A physician in a clinic generates a document from the client's Documents tab. The template is offered there whatever the scope says, and the placeholders are filled from the client record. If Leo deletes a seed template, it returns the next time the app loads.

**Naming note:** the earlier PRD named the categories Consent, Referral and Discharge and used merge tags such as `{{patient.name}}`. The screen uses the categories Invoices, Prescription, Session Notes, Consent forms, Patient Intake form and General, and tags without dots. Decision needed: D-09.

### What is real and what is not

- **Real in the prototype:** the entity filters, the Word import with placeholder detection, the HTML editor with a preview, duplicate, the scope modal, and filling placeholders at generation.
- **Simulated:** the templates live in browser tab storage shared with tenants. Delete has no confirmation and seeds come back. Template Users, Auto-Numbering and the Permissions panel do nothing. The client ignores scope.
- **Not built:** a formatting toolbar and page breaks, version and status columns, a check for unfilled tags, dotted merge tags, and the referral, discharge, telehealth consent and HIPAA masters.

### Journey position

```
Template built ─▶ Scope set ─▶ Client generates document ─▶ Client Documents
                          └▶ Automation step picker (scope applied)
```

## 2. Feature Requests

### F-1: Template list and filters

#### 1. What it does
Leo opens the page and sees an entity filter with counts: **Client**, **Process**, **Appointment** and **Invoice**. Client is selected by default and there is no All option. He can also filter by Category, Industry and Location, and search. The table shows Name, Entity, Category, Scope and Fillable Fields. A row menu holds **Configure Scope & Entities**, **Edit Template**, **Duplicate** and **Delete**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Entity filter | Tabs | Client, Process, Appointment, Invoice with counts. Default Client | ● Works | No All option |
| F-1.2: Category, Industry, Location filters and search | Filters | Narrow the list | ● Works | |
| F-1.3: Templates table | Table | Name, Entity, Category, Scope, Fillable Fields | ● Works | Fillable Fields is the number of placeholders found |
| F-1.4: Category list | Rule | Invoices, Prescription, Session Notes, Consent forms, Patient Intake form, General | ◐ Simulated | The earlier PRD named Consent, Referral and Discharge (G13-DOC-02). Decision needed: D-09 |
| F-1.5: Duplicate | Row action | Copies the template with "(Copy)" | ● Works | |
| F-1.6: Empty state | State | Handled | ● Works | |
| F-1.7: Version and Status columns | Columns | Described in the earlier PRD | ○ Not built | (G13-DOC-08, G13-DOC-09) |
| F-1.8: Loading and permission states | State | None exist | ○ Not built | Only the upload shows a loading state. Decision needed: D-12 |

#### 3. Worked example
Leo looks for invoice templates.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The page opens on Client | Selects **Invoice** | **Only invoice templates are listed, with their counts beside each entity** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I manage standard documents, I want to browse them by record type and category, so that I can find the one to change. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the page opens, **then** the Client entity is selected. There is no All option. |
| F-1-2 | **Given** an entity is chosen, **then** the list shows templates available for that record type. |

### F-2: Create and edit a template

#### 1. What it does
**Add Document Template** opens a drawer. Leo enters a Template Name and a category, with a way to create a new category. He chooses a source: **Import Word Doc**, **Import WebForm** or **Use Template Builder**. A Word file is read and its tables, headings and bold text are kept. The drawer shows "Extracting document content..." and then a table of placeholders, each mapped to a client field. The builder offers an **HTML** tab and a **Preview** tab with a **Select Fields** button. Editing reopens the same drawer.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Name and category | Fields | Name and category are required. Default category is Prescription. A new category can be created | ● Works | |
| F-2.2: Import Word Doc | Upload | Extracts HTML keeping tables, headings and bold. Shows a loading text and inline errors | ● Works | |
| F-2.3: Placeholder detection and mapping | Table | Placeholders are detected on every change and mapped by name. The default is "Client Full Name" | ● Works | |
| F-2.4: HTML editor and Preview | Editor | Two tabs. Select Fields adds a placeholder at the end of the content | ● Works | |
| F-2.5: Formatting toolbar, page breaks | Toolbar | Bold, Italic, Tables, Headers, Page Breaks in the editor | ○ Not built | The editor is HTML code with a preview (G13-DOC-03) |
| F-2.6: Template Users and Auto-Numbering | Settings | Under Advance Settings | ◐ Simulated | Not saved (G13-E-32) |
| F-2.7: Drawer title | Label | Reads "Add Document Template" | ◐ Simulated | Also when editing (G13-E-35) |
| F-2.8: Validation | State | Name and content are required | ● Works | |
| F-2.9: Referral, discharge, telehealth consent and HIPAA masters | Templates | Named in the earlier PRD | ○ Not built | The ten seed templates are invoices, receipts, prescriptions, notes, consent, intake, KYC, contract, SOP and appointment guide |

#### 3. Worked example
Leo imports a Word contract.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The drawer is open | Chooses **Import Word Doc** and picks a file | **"Extracting document content..." shows, then the placeholders appear mapped to client fields** |
| 2 | He edits the title later | Opens **Edit Template** | **The drawer still reads "Add Document Template"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When authoring a standard form, I want to import a Word file and map its placeholders, so that clinics get the same wording everywhere. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a Word file is chosen, **then** its content is extracted and placeholders are listed and mapped by name. |
| F-2-2 | **Given** no name or no content, **when** Save is pressed, **then** the save is refused. |
| F-2-3 | **Given** Template Users or Auto-Numbering is set, **when** the template is saved, **then** neither setting is stored. |

### F-3: Placeholders and document generation

#### 1. What it does
A placeholder is a field name in brackets. When a clinic generates a document, each placeholder is filled from the record. A Word template is filled in place and keeps its formatting. A placeholder with no value becomes blank.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Placeholder forms | Rule | Accepts `{field}`, `{{field}}`, «field» and [Field], without dots | ● Works | |
| F-3.2: Auto-populate at generation | Logic | Replaces placeholders with client and record values | ● Works | (G13-DOC-06) |
| F-3.3: Word output | Document | Word templates are filled in place preserving formatting | ● Works | |
| F-3.4: PDF or Word download | Output | The generation drawer offers PDF and Word download | ◐ Simulated | Seen in code, not re-checked end to end (unverified) |
| F-3.5: Unfilled-tag check | Rule | Warns when a tag has no value | ○ Not built | Unfilled tags become blank (G13-DOC-07) |
| F-3.6: Dotted merge tags | Syntax | `{{patient.name}}` style | ○ Not built | Decision needed: D-09 |

#### 3. Worked example
A physician generates a consent form.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The client record has no phone | Generates the document | **The phone placeholder is left blank. No warning appears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When a clinic generates a letter, I want placeholders filled from the record, so that nothing is typed by hand. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a template with placeholders, **when** a document is generated, **then** each is filled from the record. |
| F-3-2 | **Given** a placeholder has no value, **then** it becomes blank with no warning. |

### F-4: Scope, sharing and deletion

#### 1. What it does
**Configure Scope & Entities** saves rules for which tenants and record types a template is for. The allowed record types are the union of the rules. A template with no record types is for all four. A template with no rules is global. Leo can also delete a template.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Scope modal | Modal | Saves scope rules and entities | ● Works | |
| F-4.2: Scope used by automation | Hand-off | The automation step picker applies the scope | ● Works | |
| F-4.3: Scope used by client generation | Hand-off | Client generation filters only by record type and category | ◐ Simulated | Admin scope is ignored (G13-E-33) |
| F-4.4: Shared store | Rule | Templates live in tab session storage shared by admin and tenants | ◐ Simulated | Lost when the tab closes. No tenant separation (G13-E-31). Decision needed: D-12 |
| F-4.5: Delete | Row action | Removes the template at once | ◐ Simulated | No confirmation and the ten seed templates return on the next load (G13-E-30). Decision needed: D-06, D-32 |
| F-4.6: Admin Control permissions | Panel | Ticked checkboxes | ◐ Simulated | Clicks do nothing (G13-E-34) |
| F-4.7: Audit and role control | Rule | Changes are logged and role-limited | ○ Not built | Decision needed: D-42, D-12 |

#### 3. Worked example
Leo restricts a template to one industry.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The scope is saved | A clinic outside that industry opens its client Documents tab | **The template is still offered. Client generation ignores scope** |
| 2 | Leo deletes a seed template | Chooses **Delete** | **It goes at once and returns on the next load** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Platform Admin | When a template suits only some clinics, I want to scope it, so that other clinics do not see it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a scope is saved, **when** an automation step lists templates, **then** the scope applies. |
| F-4-2 | **Given** a scope is saved, **when** a client generates a document, **then** the scope is not applied. |
| F-4-3 | **Given** Delete is chosen, **then** the template is removed at once and a seed template returns on the next load. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Template list and filters | F-1.1 – F-1.8 | ● / ◐ / ○ | Filters and table work; no version or status. |
| F-2 | Create and edit a template | F-2.1 – F-2.9 | ● / ◐ / ○ | Word import and placeholders work; no toolbar; some settings unsaved. |
| F-3 | Placeholders and generation | F-3.1 – F-3.6 | ● / ◐ / ○ | Filling works; no unfilled-tag check. |
| F-4 | Scope, sharing and deletion | F-4.1 – F-4.7 | ● / ◐ / ○ | Client ignores scope; delete is undone on reload. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Browse standard documents by record type and category | F-1 |
| 2 | Platform Admin | Import a Word file and map its placeholders | F-2 |
| 3 | Platform Admin | Fill placeholders from the record | F-3 |
| 4 | Platform Admin | Scope a template to some clinics | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/document-templates` and add, edit, duplicate, scope and delete templates | Nothing |
| Tenant user | Use and change the same template store from client screens | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named a Clinical Content Lead and said nothing about access. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Entity counts | Entity filter | Templates available for each record type |
| Fillable Fields | Table | Number of placeholders found in the template |
| Scope summary | Table | Summary of the saved scope rules |

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-09 | Which document tag syntax and category list is canonical? | F-1.4, F-3.6, Naming note |
| D-06 | Should every destructive action ask for confirmation? | F-4.5 |
| D-32 | Can seeded templates be deleted for good, or only deactivated? | F-4.5 |
| D-12 | Must permissions block direct URL access and each action, and be separated per tenant? | F-1.8, F-4.4, F-4.7 |
| D-42 | Which admin actions must be audited? | F-4.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
