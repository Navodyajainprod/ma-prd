---
title: "Credit Actions: Credits Deducted per Action"
product: "admin"
module: "plans"
channel: "actions"
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
| **What it is** | The **Credit Actions** tab of **Plans & Credits**: a table of seven preset billable actions with the credits each one costs, and an **Edit Rate** modal. |
| **Who uses it** | Platform Admin (sets what each action costs). No role is checked. |
| **Where you start it** | **Plans & Credits** in the admin sidebar (`/admin/plans`), then **Credit Actions** in the tab dropdown. |
| **Where the result goes** | The Action Rate Card in Client Settings Billing, Credit Usage, and the usage simulator there. Real platform activity does not deduct credits. |
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
| Client (Billing) | Action Rate Card | The Credit Usage tab shows the same rates the admin sets here (G13-CACT-10). | [View Billing](/client/settings/billing) |
| Client (Billing) | Credit deduction | Only the Credit Usage simulator deducts credits. No call, SMS, workflow or Scribe action does (G13-CACT-08). | [View Billing](/client/settings/billing) |
| Admin (Industry Plans) | Monthly credits | The credits a plan includes are spent at these rates, but they are never renewed (G13-PLAN-06). | [View Industry Plans](/admin/plans/plans) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Credit Actions** and reads seven rows. Each row shows an Action Event, its Linked Feature, a Unit Basis and the Credits Deducted. He wants to raise the cost of one action. He presses **Edit Rate**, changes the credits and the unit basis and saves. The change applies at once. There is no start date and no history. He cannot add or delete an action: the catalogue is fixed. In Client Settings Billing the Action Rate Card now shows the new rate. When a clinic uses the usage simulator, credits drop by the rate times the units. Real calls, texts and consultations do not touch credits.

### What is real and what is not

- **Real in the prototype:** the table, the Edit Rate modal, immediate effect, the deduction formula, and the rate card mirrored in Client Billing.
- **Simulated:** the deduction itself. Only the client usage simulator calls it.
- **Not built:** an action key and description, an effective start date, an audited change, WhatsApp conversation and LLM token actions, creating or deleting actions, and what happens at zero credits.

### Journey position

```
Edit Rate ─▶ Rate stored ─▶ Client rate card ─▶ Usage simulator deducts (no real activity)
```

## 2. Feature Requests

### F-1: Credit action rates

#### 1. What it does
Leo opens **Credit Actions** and sees one row per action with Action Event, Linked Feature, Unit Basis and Credits Deducted. **Edit Rate** opens a modal with Action Name, Credits Deducted (at least 1), Unit Basis and Linked Feature Category. The categories are Calls, SMS, Email, Workflows and AI Scribe. The new rate applies as soon as he saves.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Credit actions table | Table | Action Event, Linked Feature, Unit Basis, Credits Deducted. Seven seeded actions | ● Works | |
| F-1.2: Edit Rate modal | Modal | Action Name, Credits Deducted (min 1), Unit Basis, Linked Feature Category | ● Works | |
| F-1.3: Immediate effect | Rule | Saved rates apply at once | ● Works | No effective date and no history (G13-CACT-03) |
| F-1.4: Fixed catalogue | State | Only Edit Rate exists. No create and no delete | ● Works | (G13-CACT-06) |
| F-1.5: Action key and description columns | Columns | Described in the earlier PRD | ○ Not built | The table has no key or description (G13-CACT-01) |
| F-1.6: Effective start date | Field | Described in the earlier PRD | ○ Not built | (G13-CACT-03) |
| F-1.7: Audited change | Rule | Every rate change is logged | ○ Not built | No audit entry is written. Decision needed: D-42 |
| F-1.8: WhatsApp conversation and LLM token actions | Rows | Named in the earlier PRD | ○ Not built | The seven seeded actions do not include them (G13-CACT-05) |
| F-1.9: Loading and error states | State | None exist | ○ Not built | All data is browser-local (G13-X-05) |
| F-1.10: Role control | Rule | Any signed-in user can edit a rate | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Leo raises one rate.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The row shows its current credits | Presses **Edit Rate**, enters a higher number and saves | **The table shows the new rate at once** |
| 2 | He looks for a start date | Reviews the modal | **There is no effective date field** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When operational costs change, I want to adjust the credits each action costs, so that platform margins stay sustainable. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** Edit Rate, **when** credits below 1 are entered, **then** the save is refused. |
| F-1-2 | **Given** a rate is saved, **then** it applies at once with no effective date and no audit entry. |
| F-1-3 | **Given** the table, **then** there is no add or delete control. |

### F-2: Deduction rules and client use

#### 1. What it does
A deduction is the action's credits times the units used, rounded, and never below 1. Remaining credits never fall below zero. The client Credit Usage tab shows these rates and runs a simulator that deducts credits. Nothing else in the product deducts them.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Deduction formula | Rule | Credits times units, rounded, minimum 1. Balance floored at 0 | ● Works | (G13-CACT-07) |
| F-2.2: Client Action Rate Card | Hand-off | Client Billing shows the admin rates | ● Works | (G13-CACT-10) |
| F-2.3: Usage simulator | Hand-off | A client simulator deducts credits using the rates | ◐ Simulated | The only caller of deduction (G13-CACT-08) |
| F-2.4: Real platform deduction | Rule | Calls, SMS, workflows and Scribe deduct credits as they run | ○ Not built | Decision needed: D-56 |
| F-2.5: Out-of-credit behaviour | Rule | What happens when credits run out | ○ Not built | Decision needed: D-56 |
| F-2.6: Linked feature category | Field | Groups an action under Calls, SMS, Email, Workflows or AI Scribe | ● Works | Label only (G13-CACT-09) |

#### 3. Worked example
A clinic tries the simulator.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rate is 3 credits per unit | A clinic user runs the simulator for 10 units in Client Billing | **30 credits are deducted** |
| 2 | A physician runs a real Scribe session | Saves it | **No credits are deducted** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When a tenant uses a billable feature, I want credits deducted at the active rate, so that usage is charged correctly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a rate and a number of units, **when** the simulator runs, **then** credits fall by the product, rounded and at least 1, and the balance stays at or above zero. |
| F-2-2 | **Given** a real call, SMS, workflow or Scribe session, **then** no credits are deducted. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Credit action rates | F-1.1 – F-1.10 | ● / ○ | Table and Edit Rate work; no date, history, audit or new actions. |
| F-2 | Deduction rules and client use | F-2.1 – F-2.6 | ● / ◐ / ○ | Formula and rate card work; only the simulator deducts. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Adjust the credits each action costs | F-1 |
| 2 | Platform Admin | Charge tenants at the active rate | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/plans` and edit any action rate | Creating or deleting actions |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named Platform Operations as the user and said nothing about access. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Deduction | Credit Usage simulator | Credits for the action times units, rounded, minimum 1 |
| Remaining credits | Workspace subscription | Plan plus add-on credits minus used, never below zero |

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-56 | What is the monthly credit renewal rule and what happens at zero credits? | F-2.4, F-2.5 |
| D-42 | Which admin actions must be audited? | F-1.7 |
| D-12 | Must permissions block direct URL access and each action? | F-1.10 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
