---
title: "Industry Plans: Subscription Plan Catalogue"
product: "admin"
module: "plans"
channel: "plans"
route: "/admin/plans"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | PLANS |
| Route | `/admin/plans` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Industry Plans** tab of **Plans & Credits**. A table of subscription plans and a four-tab drawer to create or edit one: General & Quotas, Modules & Features, Templates and Country Pricing. |
| **Who uses it** | Platform Admin (builds the catalogue tenants buy). No role is checked: any signed-in user who opens the address can do everything. |
| **Where you start it** | **Plans & Credits** in the admin sidebar (`/admin/plans`, also `/admin/plans-credits` and `/admin/credits`), then the **Industry Plans** option in the tab dropdown. |
| **Where the result goes** | The plans a tenant sees in Client Settings Billing, the public Pricing page, and the plan copied into a workspace subscription when a plan is assigned. Features, seats and credits are stored but never enforced. |
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
| Client (Billing) | Plans a tenant can choose | The Plans tab of Client Settings Billing reads this catalogue. A tenant sees a plan when it is active, not staff-only and its scope matches the tenant's industry category, industry and location. | [View Billing](/client/settings/billing) |
| Client (Billing) | Plan snapshot | Assigning a plan copies its price, seats and credits into the workspace subscription. Later plan edits do not reach it (G13-PLAN-17). | [View Billing](/client/settings/billing) |
| Client (Billing) | Feature gates, seats and credit renewal | Not connected. No tenant screen reads the module or feature toggles, the seat quota is not enforced and credits are never reset monthly (G13-PLAN-04, G13-PLAN-06). | [View Billing](/client/settings/billing) |
| Admin (Organizations) | Assign or change a plan | Plans are assigned from the Organizations row menu and from signup, invite acceptance and onboarding. | [View Organizations](/admin/organizations) |
| Admin (Workspace Billing) | Change plan | Changing a plan in `/admin/billing` lists inactive and staff-only plans and can be silently reverted from the tenant side because a second billing dataset is not updated (G13-E-63). | [View Organizations](/admin/organizations) |
| Public site | Pricing page | The public Pricing page is built from these plans. The currency and a 20 percent yearly discount are hardcoded there. | [View Billing](/client/settings/billing) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Plans & Credits** to prepare a new Growth plan. The **Industry Plans** table shows each plan with its category, tier, scope, seats, credits and status. He presses **Duplicate** on an existing plan and opens the copy. On **General & Quotas** he sets seats to 10 and monthly credits to 2,500, and the yearly credits fill in as 30,000. On **Modules & Features** he ticks the modules and features the plan advertises. On **Country Pricing** he sets a monthly and a yearly price for India. He saves and the plan appears in the table. Tenants whose industry and location match the plan's scope can now see it on their Billing page. Nothing stops a tenant from using a feature the plan leaves unticked.

**Naming note:** the earlier PRD named three tiers, Starter, Growth and Enterprise. The screen offers Free, Starter, Growth and Professional. The data also holds Custom and Scale. Decision needed: D-54.

### What is real and what is not

- **Real in the prototype:** the plans table with filters, the create and edit drawer, duplicate, active toggle, country prices, the scope rule that decides which tenants see a plan, and the plan snapshot copied on assignment.
- **Simulated:** monthly credits say "Renewed every month" but nothing renews them. Module and feature toggles are saved but read by no tenant screen. Delete and Delete All are undone on the next load.
- **Not built:** feature gates with an upgrade prompt, seat and storage limits, a Multi-Location toggle, price and Active Tenants columns, a status filter control, and audit entries.

### Journey position

```
Plan built ─▶ Scope matched ─▶ Tenant sees plan ─▶ Plan assigned (snapshot) ─┬▶ Billing page
                                                                             └▶ Limits (not enforced)
```

## 2. Feature Requests

### F-1: Plans table and filters

#### 1. What it does
Leo opens the **Industry Plans** tab and sees a table with 20 rows a page and customisable columns. Each row shows Plan Name (with a "Popular" tag), Category, Tier, Admin Scope, Included Seats, Included Credits per month and per year, and Status. Status reads Staff Only, Active or Inactive. He narrows the list with the **Tier** and **Scope** filters. A row menu holds **Edit**, **Duplicate**, **Toggle Active** and **Delete**. This is the catalogue of plans, not a tenant's own subscription: that lives in Client Settings Billing.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Plans table | Table | Plan Name, Category, Tier, Admin Scope, Included Seats, Included Credits (monthly and yearly), Status. 20 rows a page, customisable columns | ● Works | |
| F-1.2: Tier filter | Filter | Free (Onboarding), Starter, Growth, Professional | ◐ Simulated | The data also holds Custom and Scale, which cannot be filtered (G13-E-12). Decision needed: D-54 |
| F-1.3: Scope filter | Filter | Filters plans by Admin Scope | ● Works | |
| F-1.4: Status filter | Filter | The filter logic exists | ○ Not built | No control is shown (G13-E-15) |
| F-1.5: Row menu | Menu | Edit, Duplicate, Toggle Active, Delete | ● Works | Behaviour of each action is in F-3 |
| F-1.6: Monthly and annual price, Active Tenants columns | Columns | Described in the earlier PRD | ○ Not built | Prices are set per country in the drawer. The table has no price column and no tenant count (G13-PLAN-01) |
| F-1.7: Loading and error states | State | None exist | ○ Not built | All data is browser-local (G13-X-05) |
| F-1.8: Role control | Rule | Any signed-in user can open and change plans | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo looks for plans a new clinic can start on.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants only Growth plans | Opens **Tier** and picks **Growth** | **Only Growth plans are listed** |
| 2 | He looks for a price column | Scans the table | **No price column exists. Prices are inside each plan under Country Pricing** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When reviewing our commercial catalogue, I want to see every plan with its tier, scope, seats and credits, so that I can spot gaps before tenants do. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** plans exist, **when** the tab opens, **then** the table lists them 20 a page with Plan Name, Category, Tier, Admin Scope, seats, credits and Status. |
| F-1-2 | **Given** the Tier filter is set, **when** the list refreshes, **then** only plans of that tier remain. Plans with tier Custom or Scale cannot be selected. |
| F-1-3 | **Given** the table, **then** it has no price column, no Active Tenants column and no status filter control. |

### F-2: Create and edit a plan

#### 1. What it does
Leo presses the add button and a drawer opens with four tabs. **General & Quotas** takes the name, tier, category, description, scope, seats, credits and three flags. **Modules & Features** takes the modules and features the plan offers. **Templates** picks processes, workflows, documents and web forms to provision. **Country Pricing** holds a monthly and a yearly price per country. A new plan starts as Starter, AI Receptionist, Global scope, 2 seats and 1,000 monthly and 12,000 yearly credits.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Name, tier, category, description | Fields | Name and tier are required. The category list is filtered by the plan's scope and hides inactive categories | ● Works | |
| F-2.2: Admin Scope | Panel | Chooses which tenants see the plan, by industry category, industry and country | ● Works | The Industries admin screen is not the source of these lists (G13-E-21) |
| F-2.3: Included Seats | Number | 1 to 500 | ◐ Simulated | Stored only. Nothing limits the tenant's team (G13-PLAN-18). Decision needed: D-55 |
| F-2.4: Monthly and Yearly Credits | Number | Monthly credits carry the label "Renewed every month". Entering monthly credits fills yearly as 12 times | ◐ Simulated | No monthly renewal exists (G13-PLAN-06). Decision needed: D-56 |
| F-2.5: Flags | Toggle | Active, Highlight as Popular, Internal-Staff Only | ● Works | Staff Only hides the plan from tenants |
| F-2.6: Modules & Features | Checklist | Module checkboxes with feature checkboxes and a plan display feature list. Ticking a module pre-checks its features. A count such as "x/y enabled" shows | ◐ Simulated | No tenant screen reads these toggles (G13-PLAN-03). Decision needed: D-55 |
| F-2.7: Templates | Picker | Chooses processes, workflows, documents and web forms provisioned with the plan | ◐ Simulated | The industry filter lists only four industries (G13-E-13). Whether onboarding applies the choice is unverified |
| F-2.8: Country Pricing | Table | A monthly and a yearly price per country. A duplicate country is refused, the last country cannot be removed, a new country starts at 99 and 950 | ● Works | Tenant price comes from the tenant's country row, else US, else the first row |
| F-2.9: Required checks | State | A name and at least one feature line are required | ● Works | |
| F-2.10: Multi-Location toggle and storage limit | Fields | Described in the earlier PRD | ○ Not built | No such toggle or limit exists (G13-PLAN-03, G13-PLAN-19) |
| F-2.11: Tier list | Select | Offers Free, Starter, Growth, Professional | ◐ Simulated | Seeds use Starter, Professional, Custom and Free. A stored Scale is renamed Professional on read (G13-E-12). Decision needed: D-54 |

#### 3. Worked example
Leo builds a Growth plan.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The drawer is open on General & Quotas | Enters 2,500 monthly credits | **Yearly credits fill in as 30,000** |
| 2 | He ticks AI Scribe on Modules & Features | Saves the plan | **The plan is stored with the toggle. No tenant screen checks it** |
| 3 | He adds India on Country Pricing | Adds the country twice | **The second add is refused as a duplicate** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When packaging a tier, I want to set seats, credits, features and country prices in one place, so that the plan is complete before tenants see it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a new plan, **when** it is saved with no name or no feature line, **then** it is refused. |
| F-2-2 | **Given** monthly credits are typed, **then** yearly credits become 12 times that value. No renewal runs at the start of a month. |
| F-2-3 | **Given** a feature is unticked on a plan, **when** a tenant on that plan opens that feature, **then** it opens as before. No upgrade prompt appears. |
| F-2-4 | **Given** Country Pricing, **when** a country is added twice or the last one is removed, **then** the action is refused. |

### F-3: Plan lifecycle and who sees a plan

#### 1. What it does
Leo duplicates a plan, switches it off, or deletes it. He sets an **Admin Scope** so only matching tenants see it. When a plan is assigned to a workspace, its price, seats and credits are copied into that workspace's subscription. New workspaces start on the first active Free plan, or on a built-in Free Plan with 1 seat and 500 credits.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Duplicate | Row action | Makes a copy named with "(Copy)" | ● Works | |
| F-3.2: Toggle Active | Row action | Switches the plan on or off with no confirmation | ● Works | |
| F-3.3: Delete | Row action | Browser confirm, then removes the plan | ◐ Simulated | No check for workspaces on the plan. The seed plan returns on the next load (G13-E-14). Decision needed: D-55, D-32 |
| F-3.4: Delete All | Bulk action | Removes every plan | ◐ Simulated | Undone on the next load because empty lists are re-seeded (G13-E-14). Decision needed: D-32 |
| F-3.5: Tenant visibility | Rule | A tenant sees a plan only when it is active, not staff-only and its scope matches their industry category, industry and location | ● Works | |
| F-3.6: Plan assignment | Rule | Copies price, seats and credits into the workspace subscription | ◐ Simulated | A snapshot: later plan edits do not reach existing subscribers (G13-PLAN-17). Decision needed: D-55 |
| F-3.7: Default plan for new workspaces | Rule | First active Free plan, else a built-in Free Plan with 1 seat and 500 credits | ● Works | |
| F-3.8: Change plan from Workspace Billing | Hand-off | `/admin/billing` lists inactive and staff-only plans, ignores scope and does not update the assigned plan | ◐ Simulated | The tenant side can silently revert the change (G13-E-63). Decision needed: D-59 |
| F-3.9: Client and public consumers | Hand-off | Client Billing (Plans, Overview, Credit Usage), the public Pricing page, signup, invite, payment and onboarding read the catalogue | ◐ Simulated | The Pricing page hardcodes the currency and a 20 percent yearly discount (G13-PLAN-20) |
| F-3.10: Audit trail | Rule | No plan change writes an audit entry | ○ Not built | Decision needed: D-42 |
| F-3.11: Delete and downgrade protection | Rule | A plan with subscribed workspaces cannot be deleted, or the tenant is told | ○ Not built | Decision needed: D-55 |

#### 3. Worked example
Leo retires an old plan.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The plan has subscribers | Chooses **Delete** and accepts the browser confirm | **The plan is removed. Subscribers are not checked or warned** |
| 2 | Later the app reloads | Opens Plans & Credits | **A seed plan that was deleted is back** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When a plan is no longer sold, I want to hide or retire it safely, so that tenants are not left on a broken plan. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a plan is inactive or staff-only, **then** a tenant does not see it on the Plans tab. |
| F-3-2 | **Given** a plan is assigned, **when** the plan is edited later, **then** the existing subscription keeps the copied price, seats and credits. |
| F-3-3 | **Given** a plan with subscribers, **when** Delete is confirmed, **then** it is removed with no warning and a seed plan reappears on the next load. |

### F-4: Plan limits and entitlements

#### 1. What it does
The earlier PRD promised that a feature switched off on a plan is inaccessible, that seats are capped and that credits are replenished on the first of each month. Leo can set all of these values, but nothing in a tenant workspace acts on them. Credit totals are only computed: plan credits plus add-on credits, minus used, never below zero.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Feature gates | Rule | Features disabled on a plan are inaccessible and show an upgrade prompt | ○ Not built | Tenant code never reads the toggles (G13-PLAN-04). Decision needed: D-55 |
| F-4.2: Seat limit | Rule | Adding a team member beyond the seat quota is blocked, warned or billed | ○ Not built | Decision needed: D-55 |
| F-4.3: Monthly credit renewal | Rule | Credits replenished on the first of the month | ○ Not built | Nothing resets credits (G13-PLAN-06). Decision needed: D-56 |
| F-4.4: Credit balance | Calculation | Total is plan plus add-on credits. Remaining is total minus used, never below zero | ● Works | The only deduction caller is the client usage simulator (G13-CACT-08) |
| F-4.5: Out-of-credit behaviour | Rule | What happens at zero credits | ○ Not built | Decision needed: D-56 |
| F-4.6: Storage limit | Rule | A storage quota per plan | ○ Not built | (G13-PLAN-19) |

#### 3. Worked example
Leo turns AI Scribe off on a Free plan.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A Free workspace opens Scribe | Uses it as normal | **It works. No upgrade prompt appears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Platform Admin | When I gate features by tier, I want tenants to be limited by their plan, so that enterprise features drive upgrades. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a feature is off on a plan, **when** a tenant on that plan uses it, **then** it is available. Gating is not built. |
| F-4-2 | **Given** a new month starts, **then** no credits are added. |
| F-4-3 | **Given** credits are used, **then** remaining credits are the total minus used and never below zero. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Plans table and filters | F-1.1 – F-1.8 | ● / ◐ / ○ | Table and filters work; no price column or status filter. |
| F-2 | Create and edit a plan | F-2.1 – F-2.11 | ● / ◐ / ○ | Four-tab drawer works; features, seats and renewal are stored only. |
| F-3 | Plan lifecycle and visibility | F-3.1 – F-3.11 | ● / ◐ / ○ | Scope rule and snapshot work; deletes are undone on reload. |
| F-4 | Plan limits and entitlements | F-4.1 – F-4.6 | ○ / ● | No gate, seat cap or renewal exists; only the balance sum is computed. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Review the whole plan catalogue at a glance | F-1 |
| 2 | Platform Admin | Set seats, credits, features and prices in one place | F-2 |
| 3 | Platform Admin | Retire a plan safely | F-3 |
| 4 | Platform Admin | Limit tenants by their plan | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/plans` and create, edit, duplicate, deactivate and delete plans | Nothing |
| Admin sidebar roles | See **Plans & Credits** only if their admin role can read the plans module | Reaching the page by address is not blocked (G13-E-98) |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named a Revenue Officer as the user and said nothing about access. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Pack count badges | Tab dropdown | Count of packs |
| Yearly credits | Plan drawer | 12 times monthly credits when monthly is typed |
| Features enabled | Modules and Features | Ticked features over total features, shown as x/y |
| Remaining credits | Workspace subscription | Plan plus add-on credits minus used, never below zero |

Active Tenants per plan is not shown. No other metric appears on this tab.

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-54 | Which plan tier names are canonical, and what are the plan change rules? | F-1.2, F-2.11, Naming note |
| D-55 | Do plan modules, features and seats gate tenants, do plan edits reach subscribers, and can a plan with subscribers be deleted? | F-2.3, F-2.6, F-3.3, F-3.6, F-3.11, F-4.1, F-4.2 |
| D-56 | What is the monthly credit renewal rule and what happens at zero credits? | F-2.4, F-4.3, F-4.5 |
| D-59 | Which subscription dataset is canonical for a plan change in Workspace Billing? | F-3.8 |
| D-32 | Can seeded plans be deleted for good once referenced, or only deactivated? | F-3.3, F-3.4 |
| D-42 | Which admin actions must be audited? | F-3.10 |
| D-12 | Must permissions block direct URL access and each action? | F-1.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
