---
title: "Admin: Knowledge Base Templates"
product: "admin"
module: "admin-knowledge-base"
route: "/admin/knowledge-base"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | ADMIN-KNOWLEDGE-BASE |
| Route | `/admin/knowledge-base` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A list of master knowledge items (Text or FAQ, File, URL) meant for AI agents, tagged and scoped by industry. This screen has no PRD page in the earlier PRD. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user who opens the address can add and delete items. |
| **Where you start it** | **Knowledge Base** in the admin sidebar (`/admin/knowledge-base`). The alias `/admin/knowledge` shows the same page. |
| **Where the result goes** | Only the admin knowledge store. The client Knowledge Base and the AI agents use different keys, so nothing reaches them (G13-E-61). See [Knowledge Base](/client/knowledge-base). |
| **How real is it** | 0 features work, 2 are partly simulated, 1 is not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Knowledge Base) | Tenant knowledge and AI agents | Not connected. Admin items are kept in their own store and are never read by the client Knowledge Base or by AI agents (G13-E-61). Decision needed: D-50. | [View Knowledge Base](/client/knowledge-base) |
| Admin (Workflows) | Applicable workflows | The item drawer offers a hardcoded list of 14 workflows, not the list on the admin Workflows page (G13-E-59). | [View Admin Workflows](/admin/admin-workflows) |

## 1. Module Summary

### The story in one minute

Leo Martin is a Platform Admin. He opens **Knowledge Base** and presses **Add Knowledge Item**. He types the name "HIPAA FAQ" and the tag Compliance and picks type Text. He picks the workflows it applies to and sets a scope for Healthcare. He leaves **Publish as Active Knowledge Template** on and saves. The item appears in the table with its tags and scope. He then adds a File item and forgets to attach a file. The item saves with a made-up file named "new_document.pdf" of 1.0 MB. The clinics and their AI agents never see any of it.

### What is real and what is not

- **Real in the prototype:** the items table with search and filters, creating and editing items of three types, tags, scope rules, duplicate and the Scope summary.
- **Simulated:** the file name and size when no file is attached, the hardcoded workflow list, the Active flag that is saved but unused, and delete without confirmation.
- **Not built:** delivery of items to tenant knowledge bases and AI agents, a Location filter, and loading and error states.

### Journey position

```
Admin item ─▶ Admin store (browser only) ─✕─▶ Tenant Knowledge Base and AI agents (not connected)
```

## 2. Feature Requests

### F-1: Knowledge items list

#### 1. What it does
Leo opens **Knowledge Base** and sees a table with Name / Question, Type, Applicable Workflows, Admin Scope, Tags and Created. He searches and filters by Category, Industry and Type. A row menu has **Edit**, **Duplicate** and **Delete**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Search and filters | Controls | Search plus Category, Industry and Type filters | ● Works | There is no Location filter, see F-1.7 |
| F-1.2: Items table | Table | Name / Question, Type, Applicable Workflows, Admin Scope, Tags, Created | ● Works | |
| F-1.3: Active status | Column | Each item carries an Active flag | ◐ Simulated | The flag is saved but not shown or used (G13-E-60) |
| F-1.4: Duplicate | Row action | Adds a copy of the item | ● Works | |
| F-1.5: Delete | Row action | Removes the item at once | ◐ Simulated | No confirmation and system items are not protected (G13-E-57). Decision needed: D-06 |
| F-1.6: Scope summary | Display | Counts the industries and countries named by the scope rules | ● Works | |
| F-1.7: Location filter | Filter | Filter items by location | ○ Not built | Only Category, Industry and Type exist |
| F-1.8: Loading and error states | State | None exist | ○ Not built | See G13-X-05 |

#### 3. Worked example
Leo cleans up the master list.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants only FAQs | Sets the Type filter to Text | **Only text items are listed** |
| 2 | He no longer needs a seeded item | Presses **Delete** | **The item is removed at once with no confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I manage shared knowledge, I want to see each item with its type, tags and scope, so that I know what clinics would get. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the Type filter, **when** a type is chosen, **then** only items of that type are listed. |
| F-1-2 | **Given** Delete, **then** the item is removed with no confirmation, including system items. |
| F-1-3 | **Given** an item, **then** its Active flag is not shown in the table. |

### F-2: Create and edit an item

#### 1. What it does
**Add Knowledge Item** opens a drawer. Leo gives the item a Name, Tags and a Type: Text or FAQ, File or URL. He picks the Applicable Processes, sets the scope in the Admin Control panel and chooses **Publish as Active Knowledge Template**. Editing reuses the same drawer.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Name | Field | Required. It is the only field that is validated | ● Works | |
| F-2.2: Tags | Field | Free tags on the item | ● Works | |
| F-2.3: Type and content | Fields | Text or FAQ content, a file, or a URL | ● Works | |
| F-2.4: File attachment | Field | A File item should hold the file | ◐ Simulated | Saving without a file stores the placeholder "new_document.pdf", 1.0 MB (G13-E-58) |
| F-2.5: Applicable workflows list | Select | All, or chosen workflows and stages | ◐ Simulated | A hardcoded list of 14, not the Workflows screen (G13-E-59) |
| F-2.6: Applicable Processes required | Rule | The field is marked required | ◐ Simulated | Not checked on save (G13-E-60) |
| F-2.7: Scope Rules | Panel | Rule N with Industry Category, Industries and an optional Country. No rules means all tenants | ● Works | |
| F-2.8: Publish as Active Knowledge Template | Toggle | Marks the item active | ◐ Simulated | The flag is saved but not shown or used, and nothing is provisioned (G13-E-60, G13-E-61). Decision needed: D-50 |

#### 3. Worked example
Leo adds a HIPAA FAQ.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The drawer is open | Leaves **Name** empty and saves | **Saving is refused until a name is given** |
| 2 | He adds a File item | Saves with no file | **The item is stored with the made-up file "new_document.pdf", 1.0 MB** |
| 3 | He leaves Applicable Processes empty | Saves | **The item is saved anyway** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When AI agents need shared facts, I want to write master knowledge items with a scope, so that every clinic starts with correct answers. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the drawer, **when** Name is empty, **then** the item is not saved. |
| F-2-2 | **Given** a File item with no file, **when** it is saved, **then** the placeholder "new_document.pdf", 1.0 MB is stored. |
| F-2-3 | **Given** Applicable Processes is empty, **when** the item is saved, **then** it is saved with no error. |
| F-2-4 | **Given** the workflow picker, **then** it lists a fixed set of 14 workflows. |

### F-3: Delivery to tenants and AI agents

#### 1. What it does
The idea is that master items feed each clinic's knowledge base and its AI agents. Nothing like that happens. For the clinic side, see [Knowledge Base](/client/knowledge-base).

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Items in tenant Knowledge Base | Hand-off | Active items should appear in tenant knowledge bases | ○ Not built | Separate stores (G13-E-61). Decision needed: D-50 |
| F-3.2: Items used by AI agents | Hand-off | Items should answer AI agent questions for workflows in scope | ○ Not built | Decision needed: D-50 |

#### 3. Worked example
Leo publishes a HIPAA FAQ.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The item is saved as active | A clinic opens its Knowledge Base | **The item is not there** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | After I publish a knowledge item, I want clinics and their AI agents to use it, so that answers are consistent. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an active admin item, **then** the client Knowledge Base does not list it and no AI agent reads it. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Knowledge items list | F-1.1 – F-1.8 | ● / ◐ / ○ | List works; delete is unguarded; Active flag unused. |
| F-2 | Create and edit an item | F-2.1 – F-2.8 | ● / ◐ | Fields work; placeholder file and fixed workflow list. |
| F-3 | Delivery to tenants and AI agents | F-3.1 – F-3.2 | ○ Not built | Admin items reach no one. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | See each master item with its type, tags and scope | F-1 |
| 2 | Platform Admin | Write master knowledge items with a scope | F-2 |
| 3 | Platform Admin | Have clinics and AI agents use published items | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/knowledge-base`, add, edit, duplicate and delete items | Nothing. The admin routes only check sign-in |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The role comes from browser storage and defaults to SystemAdmin. The earlier PRD has no page for this screen. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Admin Scope summary | Under the toolbar and in the Admin Scope column | Number of distinct industries and countries named by the item's scope rules |

## 6. Cross-module journeys this module appears in

This screen appears in none of the four journeys on the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-50 | Should admin Knowledge Base items be provisioned to tenants (on onboarding, via plan templates or on demand)? | F-2.8, F-3.1, F-3.2 |
| D-06 | Should every destructive action ask for confirmation? | F-1.5 |
| D-12 | Must permissions block direct URL access and each action, not only hide sidebar items? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
