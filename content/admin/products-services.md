---
title: "Admin: Product / Services Catalogue"
product: "admin"
module: "products-services"
route: "/admin/services"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | PRODUCTS-SERVICES |
| Route | `/admin/services` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A master catalogue of services with a service code, price, tax, duration, optional deposit and a tenant scope. This screen has no page in the earlier PRD. |
| **Who uses it** | Platform Admin (builds the master catalogue). No role is checked: any signed-in user who opens the address can use it. |
| **Where you start it** | **Product / Services** in the admin sidebar (`/admin/services`). The aliases `/admin/products-services`, `/admin/product-services` and `/admin/industry-services` show the same page. |
| **Where the result goes** | Only the admin catalogue itself. Tenant catalogues use a separate store, so nothing reaches `/client/services` (G13-E-43). |
| **How real is it** | 0 features work, 2 are partly simulated, 0 are not built. Provisioning to tenants is a Not built row under F-1. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Services) | Tenant catalogue | Not connected. The admin catalogue is kept in its own browser store and tenants read a different one, although the drawer says active templates are provisioned to client workspaces (G13-E-43). Decision needed: D-50. | [View Services](/client/services) |
| Admin (Workflows) | Products and Services on a workflow | The workflow settings panel has a Products & Services section. | [View Admin Workflows](/admin/admin-workflows) |

## 1. Module Summary

### The story in one minute

Leo Martin is a Platform Admin. He opens **Product / Services** to set up the standard offers for dental clinics. The table lists 14 seeded services with their code, category, duration, price, tax and scope. He presses **Add Service** and types "Root Canal", a service code, 450 as the price and 60 minutes. He asks for a fixed deposit of 100. In the Admin Control panel he sets a scope rule for Dental. He leaves **Publish as Active Template** on and saves. The new row appears at the top of the table with its scope summary. The drawer says active templates are provisioned to clinic workspaces. They are not. The clinic's own Services page does not change.

### What is real and what is not

- **Real in the prototype:** the catalogue table, search and filters, the add and edit drawer with its required name, duplicate, delete, the deposit setting and the Admin Scope summary.
- **Simulated:** the Permissions panel and the Add Field links do nothing, the Active Template toggle promises provisioning that does not happen, and a blank scope silently becomes Healthcare / General Physician.
- **Not built:** delivery of the catalogue to tenants, a status column, loading and error states.

### Journey position

```
Admin catalogue ─▶ Add or edit service ─▶ Admin store (browser only) ─✕─▶ Tenant Services (not connected)
```

## 2. Feature Requests

### F-1: Master service catalogue

#### 1. What it does
Leo opens **Product / Services** and sees a table of master services. He searches by name and filters by Industry Category, Industry and Status. A line under the toolbar sums up the Admin Scope as a number of industries and countries. Each row has a menu with **Edit**, **Duplicate** and **Delete**. The first time the page opens it holds 14 seeded services. If the list is ever emptied, the 14 come back.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Services table | Table | Product / Service with its code, Category, Duration, Price, Tax and Admin Scope | ● Works | Newest first. The 14 seeds return when the list is empty |
| F-1.2: Search and filters | Search, selects | Search plus Industry Category, Industry and Status filters | ◐ Simulated | The Status filter exists but the table has no status column (G13-E-42) |
| F-1.3: Admin Scope summary | Display | Counts the industries and countries named by the scope rules | ● Works | |
| F-1.4: Duplicate | Row action | Adds a copy named "<name> (Copy)" at the top, marked as not a system record | ● Works | |
| F-1.5: Delete | Row action | Removes the service and shows a toast | ◐ Simulated | No confirmation. Seeded system services can be deleted (G13-E-40). Decision needed: D-32 |
| F-1.6: Provisioning to tenants | Hand-off | Active services should appear in tenant catalogues | ○ Not built | The tenant catalogue is a separate store (G13-E-43). Decision needed: D-50 |
| F-1.7: Empty, loading and error states | State | The table has no loading or error state, and an empty list is refilled with the seeds | ○ Not built | See G13-X-05 |

#### 3. Worked example
Leo wants the catalogue to start clean for a new region.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The table shows 14 seeded services | Opens a row menu and presses **Delete** | **The service disappears at once with no confirmation** |
| 2 | He removes every service | Reloads the page | **The 14 seeded services are back** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I standardise what clinics offer, I want one master list of services with codes and prices, so that every clinic starts from a correct catalogue. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the catalogue, **when** Delete is chosen, **then** the service is removed at once with no confirmation, including seeded system services. |
| F-1-2 | **Given** the Status filter is used, **then** the list is filtered but no status is shown in any column. |
| F-1-3 | **Given** a service is saved as active, **then** it is stored in the admin catalogue only. The tenant Services page does not change. |

### F-2: Add and edit a service

#### 1. What it does
Leo presses **Add Service** and a drawer opens. The defaults are category General, price 100 USD and duration 45 minutes. He fills in the name, service code, description, currency, price, tax percent, duration and slot duration. He chooses a deposit: 100 percent upfront or a fixed amount. He sets the scope in the Admin Control panel and saves. Editing reuses the same drawer.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Service fields | Form | Service Name, service code, Description, Currency, Price, Tax, Duration, Slot Duration | ● Works | Service Name is required: the toast reads "Service Name is required." |
| F-2.2: Duration and slot duration | Rule | Changing Duration also changes Slot Duration while the two are equal | ● Works | |
| F-2.3: Prepaid deposit | Choice | Upfront payment of 100 percent, or a fixed deposit amount | ● Works | |
| F-2.4: Scope Rules | Panel | Rule N with Industry Category, Industries and an optional Country. No rules means all tenants | ◐ Simulated | A service saved with no scope silently becomes Healthcare / General Physician (G13-E-41). Decision needed: D-50 |
| F-2.5: Permissions panel | Panel | Hide, Edit, Add and Delete tick boxes for tenants | ◐ Simulated | The boxes are always ticked and clicks do nothing (G13-E-34). Decision needed: D-51 |
| F-2.6: Add Field links | Link | Open a custom field flow | ◐ Simulated | They only show a toast (G13-E-34) |
| F-2.7: Publish as Active Template | Toggle | Marks the service active and says it is provisioned to client workspaces | ◐ Simulated | The flag is saved but nothing is provisioned (G13-E-43). Decision needed: D-50 |

#### 3. Worked example
Leo adds the Root Canal service.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The drawer opens with the defaults | Types **Root Canal**, price 450, duration 60 | **Slot Duration follows to 60** |
| 2 | He wants a deposit | Chooses a fixed deposit of 100 | **The deposit is saved with the service** |
| 3 | He leaves the scope empty by mistake | Presses save | **The service is saved with Healthcare / General Physician as its scope** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When I add a standard service, I want to set its price, deposit and which tenants it is for, so that only the right clinics are offered it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the drawer, **when** Service Name is empty and the user saves, **then** the toast "Service Name is required." shows and nothing is saved. |
| F-2-2 | **Given** Duration equals Slot Duration, **when** Duration changes, **then** Slot Duration changes with it. |
| F-2-3 | **Given** no scope rule, **when** the service is saved, **then** its scope becomes Healthcare / General Physician. |
| F-2-4 | **Given** the Permissions panel, **when** a box is clicked, **then** nothing changes. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Master service catalogue | F-1.1 – F-1.7 | ● / ◐ / ○ | Table works; delete is unguarded; nothing reaches tenants. |
| F-2 | Add and edit a service | F-2.1 – F-2.7 | ● / ◐ | Fields and deposit work; scope default and permissions are unsound. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Keep one master list of services with codes and prices | F-1 |
| 2 | Platform Admin | Set price, deposit and tenant scope for a standard service | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/services` and add, edit, duplicate and delete services | Nothing. The admin routes only check sign-in |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The role comes from browser storage and defaults to SystemAdmin. The sidebar item is hidden for admin roles without the module, but the address still opens (G13-E-98). The earlier PRD has no page for this screen. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Admin Scope summary | Under the toolbar and in the Admin Scope column | Number of distinct industries and countries named by the service's scope rules |

## 6. Cross-module journeys this module appears in

This screen appears in none of the four journeys on the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-50 | Should admin Products / Services be provisioned to tenants (on onboarding, via plan templates or on demand), and what is the scope default? | F-1.6, F-2.4, F-2.7 |
| D-32 | Can a catalogue item, including seeded ones, be deleted once referenced, or only deactivated? | F-1.5 |
| D-51 | What does the Admin Control Hide tick mean for tenants, and what do the other permissions do? | F-2.5 |
| D-12 | Must permissions block direct URL access and each action, not only hide sidebar items? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
