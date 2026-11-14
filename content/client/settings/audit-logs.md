---
title: "Audit Logs"
product: "client"
module: "settings"
channel: "audit-logs"
route: "/settings/audit-logs"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS |
| Route | `/settings/audit-logs` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A searchable table of activity entries with filters, a detail drawer showing before and after values, and a CSV export. It is the platform admin log, shown inside the tenant Settings. |
| **Who uses it** | Practice Admin. Only the System Admin role passes the Settings guard. The platform page `/admin/settings/logs` is open to any signed-in user. |
| **Where you start it** | **Settings** in the sidebar, then **Audit Logs**. |
| **Where the result goes** | A CSV file on the user's computer. Nothing else. |
| **How real is it** | 0 features work, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Platform audit log | The tenant tab renders the same component as the platform console. It shows other organizations' entries, platform staff names and emails, and billing worker orders. There is no organization filter (G10-E-15, G13-E-96). | [View Admin Users](/admin/users) |
| Admin | Where entries come from | Entries are written only by admin-side stores: users, roles, telephony, orders and subscriptions. | [View Admin Organizations](/admin/organizations) |
| Client (Team, Patients) | Patient access events | Not connected. Nothing records chart views, sign-ins or exports by clinic staff (G10-I-42). | [View Team](/client/settings/team) |

## 1. Module Summary

### The story in one minute

Rohan Mehta wants to see who changed what on his organization. He opens **Audit Logs** and a table fills with entries. He expects his own clinic. He sees Metro Health, but also other clinics, a billing worker's orders and platform staff with their emails. He types a clinic name in the search box and narrows the list. He opens a row and a drawer shows the before and after values. The **Navigate to** link takes him to a platform admin page. He presses export and a CSV downloads with every row he filtered, including other organizations'. He cannot filter by patient. No chart view was ever recorded.

### What is real and what is not

- **Real in the prototype:** search, the Module, Action, Actor and Date filters, the detail drawer with before and after values, CSV export of the filtered rows, and the empty messages.
- **Simulated:** the data. It is a platform-wide list seeded in the browser, with platform staff and other organizations. The actor and IP of new entries are hardcoded. The log is not isolated per organization and not immutable.
- **Not built:** limiting the log to this organization, patient access events and a patient filter, an immutable ledger, a signed export and an entry for the export itself.

### Journey position

```
Admin-side change ─▶ Entry in browser list ─▶ Audit Logs tab ─┬▶ Filter and search
                                                              ├▶ Detail drawer ─▶ /admin page
                                                              └▶ CSV export
```

## 2. Feature Requests

### F-1: Review the activity log

#### 1. What it does
Rohan sees a table with time, actor, role, action, module, target, summary and IP. A search box matches actor, email, target, entity id, summary and IP. Four filters narrow it: **Module**, **Action**, **Actor** and **Date** (all time, today, last 7 days, last 30 days). Clicking a row opens a drawer.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Event table | Table | Time, actor, role, action, module, target, summary, IP | ◐ Simulated | Shows the platform-wide list, not this organization's (G10-E-15, G13-E-96). Decision needed: D-43 |
| F-1.2: Search | Search | Matches actor, email, target, entity id, summary and IP | ● Works | |
| F-1.3: Filters | Controls | Module, Action, Actor and Date | ◐ Simulated | The Action list offers 8 of the 12 action types (G13-E-97) |
| F-1.4: Detail drawer | Drawer | Before and after values and a **Navigate to** link | ◐ Simulated | The link opens a platform admin page, not a tenant page (G10-E-19) |
| F-1.5: Empty state | State | "No audit logs matched your active filters." | ● Works | |
| F-1.6: Data source | State | A list in browser storage, seeded with platform events and named clinics | ◐ Simulated | New entries use a hardcoded actor and IP. "Suspended" entries are rewritten as "deleted" (G13-E-95, G13-E-94) |
| F-1.7: Limit to this organization | Rule | Show only this organization's events | ○ Not built | Decision needed: D-43 |
| F-1.8: Patient access events and patient filter | Event | LOGIN, PHI_VIEW, RECORD_EXPORT and a filter by patient (earlier PRD) | ○ Not built | Only admin-side changes are recorded (G10-I-42). Decision needed: D-42 |

#### 3. Worked example
Rohan reviews recent changes.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants this week's changes | Sets **Date** to Last 7 Days | **Only entries from the last 7 days are listed. Other organizations' entries are still there** |
| 2 | He wants to know who changed a user | Opens the row | **The drawer shows before and after values** |
| 3 | He searches for Sarah Johnson | Types the name | **No result. Patient access is not logged** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When something changes on our account, I want to see who did it and what changed, so that I can account for it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** any organization, **when** the tab opens, **then** it lists the platform-wide entries, including other organizations' and platform staff. |
| F-1-2 | **Given** a filter or search, **then** only matching rows are shown. |
| F-1-3 | **Given** no matching rows, **then** "No audit logs matched your active filters." shows. |
| F-1-4 | **Given** a clinic user opens a chart, **then** no entry is created. |

### F-2: Export and integrity

#### 1. What it does
**Export** writes the filtered rows to a CSV. The earlier PRD wanted an immutable, signed ledger. The prototype keeps an editable browser list.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: CSV export | Button | Writes the filtered rows to `mantra_admin_audit_logs_<time>.csv` and toasts the count | ◐ Simulated | The file name says "admin". It exports whatever is filtered, including other organizations (G10-E-18). Decision needed: D-42 |
| F-2.2: Nothing to export | State | A toast says "No logs to export" | ● Works | |
| F-2.3: Immutable ledger | Rule | Entries cannot be edited or cleared | ○ Not built | The list sits in browser storage, can be edited or cleared and is re-seeded when empty (G10-E-17). Decision needed: D-42 |
| F-2.4: Signed export and an entry for the export | Rule | Described in the earlier PRD | ○ Not built | Export writes no entry and is unsigned (G10-E-18) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A compliance request arrives | Filters and presses export | **A CSV downloads. Nothing records that it was exported** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When an auditor asks for records, I want an exported trail that cannot be altered, so that I can demonstrate compliance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a filtered list, **when** the user presses export, **then** a CSV of those rows downloads and no audit entry is written. |
| F-2-2 | **Given** no rows, **when** the user presses export, **then** the toast "No logs to export" shows. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Review the activity log | F-1.1 – F-1.8 | ● / ◐ / ○ | Search and filters work on platform-wide data; no tenant scope or patient events. |
| F-2 | Export and integrity | F-2.1 – F-2.4 | ◐ / ● / ○ | CSV works; unsigned, not logged, not immutable. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | See who changed what on our account | F-1 |
| 2 | Practice Admin | Export a trail that cannot be altered | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| System Admin (the default role, read from browser storage) | Read every entry, including other organizations', filter and export | Nothing |
| Any other role | Sees Settings in the menu | Opening the tab. A click returns to the home page |
| Any signed-in user | Open `/admin/settings/logs`, the same platform log | Nothing (G10-E-16) |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names a Compliance Officer and does not say whether the log is per organization or platform-wide. Decision needed: D-43.

## 5. Metrics and definitions

No metric is shown on the Audit Logs tab.

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-42 | Which events must be audited, and must the log be immutable with a signed export? | F-1.8, F-2.1, F-2.3 |
| D-43 | Should the tenant log show only this organization's events, and what may a tenant see about platform staff? | F-1.1, F-1.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
