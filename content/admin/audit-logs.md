---
title: "Audit Logs: Platform Admin Activity"
product: "admin"
module: "audit-logs"
route: "/admin/settings/logs"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | AUDIT-LOGS |
| Route | `/admin/settings/logs` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A read-only log of changes made on the admin screens. Each entry has a timestamp, actor, action, module, target, summary and IP. A drawer shows a before and after view. This screen has no PRD page in the earlier PRD. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user who opens the URL can read it. |
| **Where you start it** | **Audit Logs** under SETTINGS in the admin sidebar (`/admin/settings/logs`, also `/admin/logs`). |
| **Where the result goes** | Nowhere. It is a viewer with CSV export. The same log is also shown to every tenant in Settings, Audit Logs (`/client/settings/audit-logs`). |
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
| Client (Settings Audit Logs) | Tenant audit tab | The tenant's Audit Logs tab renders this same platform-wide log. A tenant sees other organizations' names, staff emails and IPs. There is no organization filter (G13-E-96, G10-E-15). | [View Client Audit Logs](/client/settings/audit-logs) |
| Admin (Users and Roles) | Admin user and role changes | Invites, role changes, suspensions, resets and removals write entries. | [View Users](/admin/users) |
| Admin (Telephony) | Number and secret events | Reveal, assign and release write entries, some with the wrong action name. | [View Telephony](/admin/telephony) |
| Admin (Workspace Billing) | Orders and subscriptions | Order and subscription actions write entries. Workspace Billing changes write none. | [View Workspace Billing](/admin/workspace-billing) |
| Admin (Organizations) | Organization changes | Not connected. Organization changes write no entry. | [View Organizations](/admin/organizations) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Audit Logs** to find out who suspended an admin user last week. The table lists newest entries with the actor, action, module, target and summary. He filters Module to Users and searches for the person's name. He finds the entry and opens its drawer. The drawer shows a before and after view. The action reads "deleted", not "suspended", because the page rewrites every suspension on read. The actor reads "Alexander Vance / SystemAdmin", the same name on every entry. He exports the filtered rows as a CSV. He then learns that every clinic can open the same list from its own Settings.

### What is real and what is not

- **Real in the prototype:** the table, search, the Module and Actor filters, the time range, the detail drawer with a before and after view, the CSV export, and the fact that entries cannot be edited or deleted.
- **Simulated:** the actor and IP columns (fixed values), the Action filter (8 of 12 action types), and the "suspended" entries that read as "deleted". The eight starting entries are seed data.
- **Not built:** entries for organizations, plans, templates, role templates, sign-ins and exports, a per-organization view for tenants, loading and error states, and role control.

### Journey position

```
Admin screens ─▶ Audit entry ─▶ Admin Audit Logs   ─▶   Tenant Settings Audit Logs (same platform-wide list)
```

## 2. Feature Requests

### F-1: Audit log viewer

#### 1. What it does
Leo opens `/admin/settings/logs`. A search box matches actor, entity, summary and IP. Filters hold Module, Action, Actor and a time range. The table shows **Timestamp**, **Actor**, **Action**, **Module**, **Target Entity**, **Summary** and **IP**. Clicking a row opens a drawer with the before and after view and a **Navigate to** link for the module. **Export** downloads a CSV. The page offers no way to edit or delete an entry.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Log table | Table | Timestamp, Actor, Action, Module, Target Entity, Summary, IP | ● Works | Starts with eight seed entries |
| F-1.2: Search | Search | Matches actor, entity, summary and IP | ● Works | |
| F-1.3: Module, Actor and time filters | Filters | Module and Actor lists, and a time range where Today means the last 24 hours | ● Works | |
| F-1.4: Action filter | Filter | Offers 8 of the 12 action types | ◐ Simulated | Suspended, Reactivated, Export and Refunded are missing (G13-E-97) |
| F-1.5: Detail drawer | Drawer | Summary, actor, target, network context, a before and after view and a Navigate to link | ● Works | |
| F-1.6: Export | Button | Exports the filtered entries as a CSV | ● Works | |
| F-1.7: Read-only log | Rule | The page has no edit or delete control | ● Works | The subtitle says "Immutable", but entries are rewritten on read (G13-E-94) |
| F-1.8: Empty state | State | An empty message when no entry matches | ● Works | |
| F-1.9: Loading, error and role control | State | None exist. Any signed-in user can read the log | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo investigates a suspension.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | An admin user was suspended last week | Filters Module to Users and searches for the name | **The entry is listed** |
| 2 | He opens it | Clicks the row | **The drawer shows a before and after view** |
| 3 | He looks for the action | Reads the Action column | **It says "deleted", not "suspended"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When auditing, I want to find who changed what and when, so that I can answer a compliance question. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the Action filter, **then** it offers 8 of the 12 action types. |
| F-1-2 | **Given** a row is clicked, **then** a drawer shows the before and after view. |
| F-1-3 | **Given** the page, **then** no entry can be edited or deleted from it. |
| F-1-4 | **Given** a "suspended" entry, **when** the log is read, **then** it is shown as "deleted" with a new summary. |

### F-2: What gets recorded

#### 1. What it does
Leo trusts the log to show every admin change. It shows some of them. Five areas write entries. Others do not. Each entry carries a fixed actor and a default IP.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Entries from admin users, admin roles, telephony, orders and subscriptions | Rule | These screens write an entry for their changes | ● Works | Decision needed: D-42 |
| F-2.2: Entries for organizations, plans, templates, role templates, sign-ins, exports and workspace billing | Rule | These write no entry | ○ Not built | Decision needed: D-42 (G13-E-66) |
| F-2.3: Actor | Field | Every entry shows "Alexander Vance / SystemAdmin" | ◐ Simulated | Not the signed-in user (G13-E-95) |
| F-2.4: IP | Field | Defaults to 192.168.1.145 when none is supplied | ◐ Simulated | (G13-E-95) |
| F-2.5: Suspension entries | Rule | Every "suspended" entry is rewritten to "deleted" with a new summary each time the log is read | ◐ Simulated | (G13-E-94). Decision needed: D-42 |
| F-2.6: Action names from telephony | Rule | Revealing a secret is logged as "login". Releasing a number is logged as "deleted" | ◐ Simulated | (G13-E-86, G13-E-91) |
| F-2.7: Immutable, signed log | Rule | A log that cannot be altered and has a signed export | ○ Not built | Entries are stored in browser storage. Decision needed: D-42 |

#### 3. Worked example
Leo reviews who did what.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Another admin changes a plan | Leo opens the log | **No entry exists for the plan change** |
| 2 | A colleague reveals a SIP secret | Leo reads the entry | **The action says "login" and the actor is the fixed name** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | After a sensitive change, I want an entry with the real person and the real action, so that I can prove what happened. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** any entry written by the admin code, **then** its actor is "Alexander Vance / SystemAdmin". |
| F-2-2 | **Given** an organization or plan change, **then** no entry is written. |
| F-2-3 | **Given** a release of a phone number, **then** the audit action is "deleted". |

### F-3: Tenant view of the same log

#### 1. What it does
A clinic's staff open Settings and then the Audit Logs tab. The tab shows this platform-wide log. Another clinic's name, platform staff emails and IPs are visible. There is no organization filter.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Tenant Settings Audit Logs tab | Display | Renders the same platform-wide log | ◐ Simulated | Shows other organizations' names, staff emails and IPs (G13-E-96, G10-E-15). Decision needed: D-43 |
| F-3.2: Per-organization scoping | Rule | A tenant sees only its own organization's entries | ○ Not built | Decision needed: D-43 |
| F-3.3: Tenant-visible platform staff actions | Rule | A rule for what a tenant may see about platform staff | ○ Not built | Decision needed: D-43 |

#### 3. Worked example
A clinic manager opens the audit tab.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A tenant checks its own activity | Opens Settings and then Audit Logs | **The list includes other organizations' entries and platform staff emails** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When a tenant reviews its log, I want it to show only that tenant's entries, so that no organization sees another's data. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a tenant opens Settings, Audit Logs, **then** the platform-wide log is shown with no organization filter. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Audit log viewer | F-1.1 – F-1.9 | ● / ◐ / ○ | Viewer, search, drawer and export work; the Action filter is partial. |
| F-2 | What gets recorded | F-2.1 – F-2.7 | ● / ◐ / ○ | Five areas write entries; actor is fixed and suspensions read as deleted. |
| F-3 | Tenant view of the same log | F-3.1 – F-3.3 | ◐ / ○ | Tenants see the platform-wide log. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Find who changed what and when | F-1 |
| 2 | Platform Admin | Have real actors and actions on every entry | F-2 |
| 3 | Platform Admin | Keep each tenant's view to its own entries | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Read, search, filter and export the platform log | Editing or deleting entries (no control exists) |
| Tenant staff | Read the same platform log in Settings, Audit Logs | Nothing further. They are not limited to their own organization |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The role is read from browser storage and defaults to SystemAdmin. The seeded ReadonlyAuditor role is not enforced (G13-E-98, G13-E-100). The earlier PRD has no page for this screen. Decision needed: D-12.

## 5. Metrics and definitions

The page shows no metric. Only an export count is produced.

## 6. Cross-module journeys this module appears in

This page is not a step in any of the four journeys: Call to Claim, Kiosk check-in to Billing, Web form to Task, and Patient portal with Appointments and Invoices. Those journeys write their own events elsewhere.

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-12 | Must permissions block direct URL access, and who may open `/admin/*`? | F-1.9 |
| D-42 | Which events must be audited, and must the log be immutable with a signed export? | F-2.1, F-2.2, F-2.5, F-2.7 |
| D-43 | What may a tenant see about platform staff actions, and must tenants never see other organizations' entries? | F-3.1, F-3.2, F-3.3 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
