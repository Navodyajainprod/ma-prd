---
title: "Workspace Billing, Orders & Subscriptions"
product: "admin"
module: "workspace-billing"
route: "/admin/billing"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | WORKSPACE-BILLING |
| Route | `/admin/billing` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | Three billing screens for Mantra platform staff. **Workspace Billing** shows each organization's plan, price and credit balance and lets staff change the plan or add credits. **Orders** is a ledger of purchase orders with Mark as Paid, Issue Refund and Cancel Order. **Subscriptions** lists recurring subscriptions with plan change, bonus credits, trial extension, pause and cancel. These screens have no PRD page in the earlier PRD. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user who opens the URL can do everything on all three screens. |
| **Where you start it** | **Orders** and **Subscriptions** under BILLING & ORDERS in the admin sidebar (`/admin/billing/orders`, `/admin/billing/subscriptions`). **Workspace Billing** has no sidebar entry: open `/admin/billing` by URL. |
| **Where the result goes** | Browser storage. Workspace Billing writes the same workspace subscription data that the tenant's Settings Billing tab reads. Orders and Subscriptions each keep their own separate data. Orders and subscription actions write audit entries. Workspace Billing writes none. |
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
| Client (Settings Billing) | Shared workspace subscription | Change Plan and + Credits on `/admin/billing` write the workspace subscription data that the tenant's Billing tab reads. A plan change does not update the organization's assigned plan, so the tenant side can silently revert it. | [View Client Billing](/client/settings/billing) |
| Client (Settings Billing) | Tenant purchases | Plans, credit packs and seats bought by a tenant never create an order in Orders. The ledger holds six seed orders only. | [View Client Billing](/client/settings/billing) |
| Admin (Plans) | Plan catalogue | Workspace Billing offers every plan, including inactive and staff-only ones. Subscriptions ignores the catalogue and offers three fixed plans. | [View Plans](/admin/plans/plans) |
| Admin (Organizations) | Organization list | Workspace Billing has one row per organization. An organization with no subscription shows an invented "Global Starter" row. | [View Organizations](/admin/organizations) |
| Admin (Audit Logs) | Audit entries | Order and subscription actions write entries. Workspace Billing changes write none. Every entry carries the same hardcoded actor. | [View Audit Logs](/admin/audit-logs) |
| Admin (Product Analytics) | Revenue figures | Revenue & Invoices shows hardcoded cards that do not match these screens. | [View Product Analytics](/admin/product-analytics) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Orders** on Monday to reconcile a bank transfer. Four capsules sit on top: Total Orders, Settled Amount, Pending Orders and Refunded. He finds the pending order for a clinic, opens the row menu and presses **Mark as Paid**. He confirms in the browser prompt and the order turns Paid. Next he types `/admin/billing` into the address bar, because Workspace Billing has no menu entry. He finds the clinic, presses **Change Plan** and picks a bigger plan. A toast says the plan is assigned. Later the clinic's own Billing tab may show the old plan again, because the organization record never changed. On **Subscriptions** he extends a trial by 14 days. He then notices the clinic appears on all three screens with figures that do not agree.

### What is real and what is not

- **Real in the prototype:** the order ledger with search, filters and export, Mark as Paid, full refund, the Active, Trials Running and Past Due counts, bonus credits, pause, the credit balance bars and the list of workspaces.
- **Simulated:** the Change Plan on Workspace Billing (can be reverted), allocated credits (lost on the next plan change), the Estimated MRR (mixed currencies shown as "$"), the "All connected" caption, the Renewal Rate, the plan list on Subscriptions, cancel on a Paid order, cancel on a subscription (logged as a deletion), and the status column (always "Active"). The three screens use three separate datasets.
- **Not built:** confirmation and an audit entry for workspace billing changes, orders created from tenant purchases, partial refunds, resume for a paused subscription, a visible Total MRR, and role control.

### Journey position

```
Plans catalogue ─▶ Workspace Billing ─▶ Tenant Settings Billing (can revert)   |   Orders (seed data)   |   Subscriptions (own data)
```

## 2. Feature Requests

### F-1: Workspace Billing

#### 1. What it does
Leo opens `/admin/billing` by URL. Four figures sit on top: **Total Workspaces**, **Active Subscriptions**, **Total Available Credits** and **Estimated MRR**. Below is a search box, a category filter, a tier filter and a table with one row per organization. Each row shows the plan, the price and a credit bar. Leo presses **Change Plan** to assign another plan with a Monthly or Annual cycle, or **+ Credits** to allocate a credit pack. A toast confirms. Nothing asks him to confirm first and no audit entry is written.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Total Workspaces, Active Subscriptions, Total Available Credits | KPI | Count of organizations. Organizations with stored status Active, with a coverage percentage. Sum of remaining credits | ● Works | Active Subscriptions counts the stored subscription status |
| F-1.2: "All connected" caption | Display | Static caption under Total Workspaces | ◐ Simulated | Hardcoded, formula undefined (G13-BILL-03). Decision needed: D-60 |
| F-1.3: Estimated MRR | KPI | Sum of subscription amounts, with yearly amounts divided by 12 | ◐ Simulated | Mixed currencies are added and shown as "$" (G13-E-62). Decision needed: D-60 |
| F-1.4: Search and filters | Search, filters | Search box, a category filter and a tier filter | ◐ Simulated | The tier filter lists only Starter, Professional and Custom, fixed in the page |
| F-1.5: Workspaces table | Table | Workspace and client, category and scope, assigned plan, billing and price, credits balance, status, actions | ◐ Simulated | The Status column always reads "Active". An organization with no subscription shows an invented "Global Starter $49, 380/500" row (G13-E-65) |
| F-1.6: Credit balance bar | Display | Red under 20 percent, amber under 50 percent | ● Works | |
| F-1.7: Change Plan | Modal | Lists plans, picks Monthly or Annual, carries over add-on credits, used credits and extra seats, shows "Assigned ... to ..." | ◐ Simulated | Lists inactive and staff-only plans. The organization's assigned plan is not updated, so the tenant side can silently revert the change (G13-E-63). Decision needed: D-54 |
| F-1.8: + Credits | Modal | Allocates a credit pack and adds it to total and remaining credits | ◐ Simulated | Lists staff-only packs. The add-on counter is not increased, so the credits are lost on the next plan change (G13-E-64) |
| F-1.9: Confirmation and audit entry | Rule | Change Plan and + Credits save at once and write no audit entry | ○ Not built | (G13-E-66). Decision needed: D-42, D-06 |
| F-1.10: Empty state | State | No message when no organization matches | ○ Not built | Empty state not handled |
| F-1.11: Role control | Rule | Any signed-in user can change plans and allocate credits | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo gives a clinic goodwill credits and moves it to a bigger plan.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The clinic ran low on credits | Presses **+ Credits**, picks a pack and confirms | **The total and remaining credits rise. No audit entry is written** |
| 2 | The clinic upgrades | Presses **Change Plan** and picks a larger plan | **A toast says the plan is assigned. The organization record keeps its old plan** |
| 3 | The tenant opens Settings Billing | Looks at the plan | **The tenant may see the old plan again, and the goodwill credits are gone** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When a deal changes, I want to switch an organization's plan or add credits, so that the tenant sees the right plan and balance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a plan is chosen in Change Plan, **when** it is saved, **then** the workspace subscription changes and a toast is shown. The organization's assigned plan does not change. |
| F-1-2 | **Given** a credit pack is allocated, **then** total and remaining credits rise. The add-on counter does not. |
| F-1-3 | **Given** Change Plan or + Credits is used, **then** no confirmation is asked and no audit entry is written. |
| F-1-4 | **Given** an organization has no subscription, **then** its row shows an invented Global Starter plan. |

### F-2: Orders

#### 1. What it does
Leo opens **Orders**. Four capsules show Total Orders, Settled Amount, Pending Orders and Refunded. He searches, filters by Type, Payment Status or Order Status, and exports a CSV. A row menu holds **View**, **Mark as Paid**, **Issue Refund** and **Cancel Order**. The detail drawer shows line items and an "Audit & Settlement Timeline". The ledger holds six seed orders from 2024. No tenant purchase adds to it.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Capsules | KPI | Total Orders is a count. Settled Amount is the sum of Paid orders. Pending Orders is a count. Refunded is a sum | ◐ Simulated | They ignore the filters. Amounts always show "$" (G13-E-69) |
| F-2.2: Orders table | Table | Order ID, Date, Org ID, Organization, Order Type, Items, Amount, Payment, Payment Method | ● Works | |
| F-2.3: Search and filters | Search, filters | Search, Type, Payment Status, Order Status | ● Works | Types are New plan, Plan upgrade, Credits top-up, Team member package and Add-on |
| F-2.4: Export | Button | Exports a CSV | ● Works | |
| F-2.5: Order detail | Drawer | Line items, Audit & Settlement Timeline, PDF receipt link | ◐ Simulated | The status pill is always green. The receipt link is a mock (G13-E-69) |
| F-2.6: Mark as Paid | Row action | Asks a browser confirm, then sets Paid and Completed and adds a timeline entry | ● Works | |
| F-2.7: Issue Refund | Row action | Paid orders only. A reason is required. Full refund only. Sets Refunded and Cancelled | ● Works | |
| F-2.8: Cancel Order | Row action | A reason is required. The payment status is left as is | ◐ Simulated | Cancelling a Paid order leaves it Paid with no refund (G13-E-67). Decision needed: D-59 |
| F-2.9: Audit entries from order actions | Rule | Mark as Paid, refund and cancel write audit entries | ◐ Simulated | The actor is hardcoded (G13-E-95) |
| F-2.10: Orders from tenant purchases | Hand-off | Plans, packs and seats bought by a tenant should appear here | ○ Not built | The ledger is seed data only (G13-E-68). Decision needed: D-59 |
| F-2.11: Create, edit, partial refund | Action | No create, edit or partial refund exists | ○ Not built | |
| F-2.12: Empty state | State | Shows the generic "No records found." | ● Works | |
| F-2.13: Loading, error and role control | State | None exist. Any signed-in user can settle, refund and cancel | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo reconciles a bank transfer.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A bank transfer arrived for a pending order | Opens the row menu and presses **Mark as Paid**, then confirms | **The order is Paid and Completed and the timeline shows the change** |
| 2 | The customer asks for money back | Presses **Issue Refund** and enters a reason | **The order is Refunded and Cancelled for the full amount** |
| 3 | Another Paid order is cancelled | Presses **Cancel Order** and enters a reason | **The order is Cancelled but still reads Paid and no refund is recorded** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When reconciling payments, I want to settle, refund or cancel an order, so that the ledger matches the bank. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a Pending order, **when** Mark as Paid is confirmed, **then** it becomes Paid and Completed. |
| F-2-2 | **Given** an order that is not Paid, **then** Issue Refund is not offered. A refund is always for the full amount. |
| F-2-3 | **Given** a Paid order, **when** it is cancelled, **then** its payment status stays Paid and no refund is made. |
| F-2-4 | **Given** a tenant buys a plan, pack or seat, **then** no order is created. |

### F-3: Subscriptions

#### 1. What it does
Leo opens **Subscriptions**. Capsules show Active Subscriptions, Renewal Rate, Trials Running and Past Due. A table lists each organization with plan, cycle, status, MRR, credits usage and renewal or trial end. A row menu holds **Change Plan**, **Add Bonus Credits**, **Extend Free Trial** (Trial only), **Pause** and **Cancel**. There is no Resume. The data is five seed subscriptions in a store of its own.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Active, Trials Running, Past Due | KPI | Counts of subscriptions by status | ● Works | |
| F-3.2: Renewal Rate | KPI | A synthetic percentage that moves with past-due and cancelled counts | ◐ Simulated | Hardcoded, formula undefined (G13-E-70). Decision needed: D-98 |
| F-3.3: Total MRR | KPI | Computed in code but not shown | ○ Not built | (G13-E-75) |
| F-3.4: Table, search, filters | Table | Org ID, Organization, Current Plan, Cycle, Status, MRR, Credits Usage, Renewal or Trial End. Status and Cycle filters | ● Works | |
| F-3.5: Export | Button | Exports a CSV | ● Works | |
| F-3.6: Change Plan | Modal | Offers three fixed plans at $149, $299 and $499 and sets the subscription Active | ◐ Simulated | Not the Plans catalogue (G13-E-71). Decision needed: D-54 |
| F-3.7: Add Bonus Credits | Modal | A whole number above 0 | ● Works | |
| F-3.8: Extend Free Trial | Modal | Days above 0 move the trial end | ◐ Simulated | The 1 to 90 day limit is not enforced (G13-E-72) |
| F-3.9: Pause | Row action | Asks a browser confirm, then pauses | ● Works | |
| F-3.10: Cancel | Row action | Asks a browser confirm, then cancels at once | ◐ Simulated | Audited as "deleted" (G13-E-73) |
| F-3.11: Resume | Row action | A paused subscription cannot be resumed | ○ Not built | (G13-E-73) |
| F-3.12: Empty, loading, error and role control | State | None handled. Any signed-in user can act | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo gives a trial more time.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A clinic's trial ends tomorrow | Opens the row menu, presses **Extend Free Trial** and enters 14 | **The trial end moves by 14 days** |
| 2 | He enters 400 by mistake | Saves | **The 400 days are accepted. No limit is applied** |
| 3 | A customer leaves | Presses **Cancel** and confirms | **The subscription is cancelled at once and the audit log says "deleted"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When a subscription needs attention, I want to adjust it in place, so that I do not edit records by hand. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** Add Bonus Credits, **when** the value is not a whole number above 0, **then** it is refused. |
| F-3-2 | **Given** Extend Free Trial, **when** the days exceed 90, **then** the value is still accepted. |
| F-3-3 | **Given** a paused subscription, **then** no Resume action exists. |
| F-3-4 | **Given** Change Plan, **then** only the three fixed plans are offered. |

### F-4: One billing picture across the three screens

#### 1. What it does
Leo expects one clinic to look the same on every billing screen. It does not. Workspace Billing and the tenant's Billing tab share one workspace subscription store. Subscriptions and Orders each keep a separate store with seed rows and different status spellings.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Workspace subscription store | Data | Shared by Workspace Billing and the tenant's Billing tab | ◐ Simulated | A plan change here can be reverted because the organization record is not updated (G13-E-63) |
| F-4.2: Admin subscriptions store | Data | Five seed subscriptions used by Subscriptions only | ◐ Simulated | A separate dataset with different status spellings (G13-E-74). Decision needed: D-59 |
| F-4.3: Admin orders store | Data | Six seed orders used by Orders only | ◐ Simulated | Tenant purchases never reach it (G13-E-68) |
| F-4.4: One canonical dataset | Rule | One source of truth for subscriptions and orders | ○ Not built | Decision needed: D-59 |
| F-4.5: Currency model | Rule | One currency for MRR and amounts | ○ Not built | Amounts show "$" even when the organization is billed in INR. Decision needed: D-60 |

#### 3. Worked example
Leo checks one clinic on three screens.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He changes the clinic's plan on Workspace Billing | Opens the clinic on **Subscriptions** | **Subscriptions shows its own plan and status, not the change** |
| 2 | The clinic buys a credit pack in its own Billing tab | Opens **Orders** | **No order exists for the purchase** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Platform Admin | When I look up a clinic's billing, I want the plan, credits and orders to agree on every screen, so that I can trust what I see. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a plan change on Workspace Billing, **then** the Subscriptions screen is not updated. |
| F-4-2 | **Given** a tenant purchase, **then** the Orders ledger is not updated. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Workspace Billing | F-1.1 – F-1.11 | ● / ◐ / ○ | Plan and credit changes work on screen; the plan change can be reverted and nothing is audited. |
| F-2 | Orders | F-2.1 – F-2.13 | ● / ◐ / ○ | Ledger actions work; tenant purchases never create orders. |
| F-3 | Subscriptions | F-3.1 – F-3.12 | ● / ◐ / ○ | Counts and actions work; plan list is fixed and there is no Resume. |
| F-4 | One billing picture | F-4.1 – F-4.5 | ◐ / ○ | Three separate datasets that do not agree. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Switch a plan or add credits so the tenant sees the right balance | F-1 |
| 2 | Platform Admin | Settle, refund or cancel an order so the ledger matches the bank | F-2 |
| 3 | Platform Admin | Adjust a subscription in place | F-3 |
| 4 | Platform Admin | See the same billing facts on every screen | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open all three screens by URL, change plans, allocate credits, mark paid, refund, cancel, pause, export | Nothing. The role is read from browser storage and defaults to SystemAdmin |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The admin sidebar hides entries by role, but a hidden screen still opens by URL and no action is checked (G13-E-98, G13-E-100). The earlier PRD has no page for these screens. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Total Workspaces | Workspace Billing | Count of organizations |
| Total Workspaces caption "All connected" | Workspace Billing | **Hardcoded, formula undefined** |
| Active Subscriptions and coverage | Workspace Billing | Count of organizations with stored status Active. Coverage is active divided by total times 100 |
| Total Available Credits | Workspace Billing | Sum of remaining credits |
| Estimated MRR | Workspace Billing | Sum of subscription amounts with yearly divided by 12. Currencies are mixed and shown as "$" (G13-E-62) |
| Total Orders, Pending Orders | Orders | Count of orders, count of Pending orders. Filters are ignored |
| Settled Amount, Refunded | Orders | Sum of Paid orders, sum of Refunded orders. Filters are ignored |
| Active, Trials Running, Past Due | Subscriptions | Count of subscriptions with that status |
| Renewal Rate | Subscriptions | **Hardcoded, formula undefined.** A synthetic value that falls with past-due and cancelled counts and is held between 88 and 99.5 (G13-E-70) |
| Total MRR | Subscriptions | Computed but not displayed (G13-E-75) |

## 6. Cross-module journeys this module appears in

These screens are not a step in any of the four journeys: Call to Claim, Kiosk check-in to Billing, Web form to Task, and Patient portal with Appointments and Invoices. Invoices in those journeys are the clinic's own client invoices, not the platform's orders.

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-06 | Should every destructive action ask for confirmation? | F-1.9 |
| D-12 | Must permissions block direct URL access and each action, and who may open `/admin/*`? | F-1.11, F-2.13, F-3.12 |
| D-42 | Which admin actions must be audited? | F-1.9 |
| D-54 | What are the plan change rules (confirmation, proration, effective date) and which plan names are canonical? | F-1.7, F-3.6 |
| D-59 | Which subscription dataset is canonical, must tenant purchases create orders, and may a Paid order be cancelled without refund? | F-2.8, F-2.10, F-4.2, F-4.4 |
| D-60 | What is the currency model for MRR and amounts, and what does "All connected" mean? | F-1.2, F-1.3, F-4.5 |
| D-98 | What is the formula for the Subscriptions Renewal Rate? | F-3.2 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
