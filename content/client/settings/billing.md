---
title: "Subscription, Plans, Credits & Payment Methods"
product: "client"
module: "settings"
channel: "billing"
route: "/settings/billing"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS |
| Route | `/settings/billing` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The organization's own subscription billing. Three sub-tabs: **Plan Overview & Payment**, **Plans & Subscriptions** and **Credit Usage**. Two older pages, `/payments` and `/transactions`, are a second billing model with different plan names and prices. |
| **Who uses it** | Practice Admin and Practice Manager. Only the System Admin role passes the Settings guard. `/payments` and `/transactions` have no guard. |
| **Where you start it** | **Settings**, then **Billing**. The sub-tabs have the addresses `/settings/billing`, `/settings/billing/plans` and `/settings/billing/credit-usage`. `/payments` and `/transactions` open by address only. |
| **Where the result goes** | The plan card, the credit balance and the seat count on this tab. No payment, invoice or transaction is written. |
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
| Admin | Plans, credit packages, price per credit, seat packs | The admin catalogue defines what the Plans tab offers and what a credit or seat costs. | [View Admin Plans](/admin/plans/plans) |
| Admin | Credit action rates | The credits each action costs come from the admin catalogue. | [View Admin Plan Actions](/admin/plans/actions) |
| Client (Team) | Seats | Included plus extra seats are shown here. Nothing compares them with the team size (G10-E-05). | [View Team](/client/settings/team) |
| Client (Organization) | Plan choice | The organization's industry category and location decide which plans it can choose. | [View Organization](/client/settings/organization) |
| Client (Invoices) | Customer invoices | `/invoices` is the clinic's patient billing, not this subscription. A purchase here writes no invoice there. | [View Invoices](/client/invoices) |

## 1. Module Summary

### The story in one minute

Rohan Mehta opens **Billing**. The **Plan Overview & Payment** tab shows the current plan, its price, the renewal date, a credit meter and the seat count. Credits are running low. He opens **Plans & Subscriptions** and chooses a pack, then a custom amount. The credits rise at once. No card is asked for and no invoice appears. He then picks a larger plan. It replaces the old one in one click, with no confirmation, and seats and credits reset. He checks **Credit Usage** and sees credits per feature. Curious, he opens `/payments` and finds other plan names and prices. That page and `/transactions` show fixed numbers.

**Naming note:** the earlier PRD named the plans Starter, Growth and Enterprise. The Plans tab uses Starter, Professional, Enterprise and Custom by category. `/payments` uses Starter, Basic, Professional and Enterprise. Decision needed: D-54.

### What is real and what is not

- **Real in the prototype:** the plan cards from the admin catalogue, the computed usage percent, seats and renewal date, the credit usage breakdown and deduction history.
- **Simulated:** plan change, credit top-up, extra seats and the cart apply instantly with no payment. Payment methods and the invoice list are local or fixed. `/payments` and `/transactions` are hardcoded.
- **Not built:** a card charge, an invoice for each purchase, green, amber and red meter colours, a seat check and a confirmation step.

### Journey position

```
Admin catalogue ─▶ Plans tab ─▶ Select plan / top up / seats ─▶ Plan card, credits, seats (no payment)
                                                              └▶ Credit Usage (deductions)
```

## 2. Feature Requests

### F-1: Plan overview and payment

#### 1. What it does
On **Plan Overview & Payment** Rohan sees a plan card with name, tier, price, billing cycle and renewal date. A meter shows credit usage. Below are seats, add-on dialogs, payment methods, a billing address and an invoice list.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Plan card | Card | Name, tier, price, cycle, renewal date, included credits and seats | ● Works | Renewal is the assignment date plus 30 days (monthly) or 365 days (yearly) |
| F-1.2: Usage meter | Bar | Credits consumed divided by plan plus add-on credits, capped at 100 percent with a 0.1 percent floor | ● Works | |
| F-1.3: Seats | Text | Included seats plus extra seats purchased | ● Works | |
| F-1.4: Seat enforcement | Rule | Compare seats with the team size | ○ Not built | The number is never used. Invites ignore plan seat limits (G10-E-05). Decision needed: D-55 |
| F-1.5: Credit meter colours | Rule | Green above 1,000, amber below 500, red below 100 (earlier PRD) | ○ Not built | The meter is a percentage. 500 to 1,000 is undefined (G10-I-51). Decision needed: D-57 |
| F-1.6: Payment methods | List | Add, set default, remove | ◐ Simulated | Page state only. Remove has no confirmation (G10-E-22). Decision needed: D-62 |
| F-1.7: Billing address | Form | A form with Save | ◐ Simulated | Unverified. Treated as local state |
| F-1.8: Invoice list and download | Table | Four fixed rows, INV-2026-001 to 004, with a download button | ◐ Simulated | Download only shows a toast (G10-E-23). Decision needed: D-57 |

#### 3. Worked example
Rohan checks the account.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He opens the tab | Reads the plan card | **Plan, price, renewal date and the usage percent show** |
| 2 | He removes a saved card | Presses remove | **The card goes at once with no confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I review our subscription, I want the plan, renewal date and credit use in one place, so that I know what we pay for. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** an active plan, **then** the usage percent is credits consumed divided by plan plus add-on credits, capped at 100. |
| F-1-2 | **Given** a team larger than the seat count, **then** no warning shows. |
| F-1-3 | **Given** Download on an invoice row, **then** a toast shows and no file is produced. |

### F-2: Plans, add-on credits and seats

#### 1. What it does
On **Plans & Subscriptions** Rohan sees category tabs (AI Receptionist, AI Scribe, EHR, RCM) filtered by the organization's industry, with plan cards ordered Starter, Professional, Enterprise, Custom and a monthly or yearly switch. He can buy credit packs or a custom amount, buy extra seats or use a cart.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Plan cards | Cards | Plans from the admin catalogue, by category, tier and billing cycle | ● Works | |
| F-2.2: Select plan | Action | Replaces the single active plan at once. Seats and credits reset and the renewal date is recalculated. A toast says "Switched to ..." | ◐ Simulated | No confirmation, payment, proration or check of team size or usage (G10-E-20). Decision needed: D-54 |
| F-2.3: Add-on credits | Packs, input | A pack or a custom amount. Cost is credits times the admin price per credit (fallback 0.04 dollars). Needs an active plan | ◐ Simulated | Credits rise and persist at once. No payment, invoice or transaction (G10-E-21). Decision needed: D-57 |
| F-2.4: Extra seats | Packs, input | Price is the admin price per extra member (fallback 20 dollars) | ◐ Simulated | Same instant effect, no payment (G10-E-21). Decision needed: D-55 |
| F-2.5: Cart | Drawer | Add items, then **Pay & Activate All** applies everything and toasts the total | ◐ Simulated | No payment is captured (G10-E-21) |
| F-2.6: Card charge and an invoice per purchase | Payment | Charges the saved Stripe card for 1,000, 5,000 or 10,000 credit bundles and logs an invoice (earlier PRD) | ○ Not built | Decision needed: D-62 |

#### 3. Worked example
Rohan runs short of credits.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The plan is active | Buys a pack of add-on credits | **The balance rises at once. No card is charged and no invoice is written** |
| 2 | He wants more capacity | Selects a larger plan | **The plan is replaced at once. Seats and credits reset. No confirmation appears** |
| 3 | No plan is active | Tries a top-up | **It is blocked** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When the credit balance runs low, I want to top up our balance, so that AI Scribe and patient messaging are not interrupted. |
| F-2-J2 | Practice Admin | When our needs change, I want to switch plan, so that we pay for the right capacity. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** an active plan, **when** a top-up is chosen, **then** credits increase at once, no payment is taken and no invoice or transaction is written. |
| F-2-2 | **Given** no active plan, **when** a top-up is chosen, **then** it is blocked with a message. |
| F-2-3 | **Given** a plan is selected, **then** it replaces the current plan with no confirmation and seats and credits reset. |

### F-3: Credit usage

#### 1. What it does
On **Credit Usage** Rohan sees credits per feature (Calls, SMS, Email, Workflows, AI Scribe) and a table of deductions.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Breakdown chart | Chart | Credits per feature summed from the deduction log | ● Works | Any gap between total consumed and the logged sum is added to Calls so the totals agree (G10-I-57) |
| F-3.2: Deduction history | Table | Each deduction with feature and credits | ● Works | |
| F-3.3: Action rates | List | Credits per unit, set in the admin catalogue | ● Works | |
| F-3.4: Simulate-action buttons | Buttons | Four buttons that deduct credits to simulate an action | ◐ Simulated | Every viewer sees them and the deductions are real (G10-E-27) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants to see where credits go | Opens **Credit Usage** | **A per-feature breakdown and a deduction table show** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When credits fall faster than expected, I want to see which feature uses them, so that I can act. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** logged deductions, **then** the breakdown shows credits per feature and the history lists each deduction. |
| F-3-2 | **Given** a simulate button is pressed, **then** credits are deducted for real. |

### F-4: The second billing model: `/payments` and `/transactions`

#### 1. What it does
Two older pages sit outside Settings. `/payments` is another billing screen with its own plans and prices. `/transactions` shows a credit history. Both are also unguarded. Rohan can reach them by address. Neither is tied to the Settings billing data.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: `/payments` plans and prices | Page | Starter, Basic, Professional and Enterprise. Per-user prices 10, 49 and 79 dollars a month, Enterprise by quote. Credits per user 2,000, 20,000 and 50,000 | ◐ Simulated | Different names and prices from the Plans tab (G10-E-24). Decision needed: D-54 |
| F-4.2: `/payments` account figures | Display | 2 seats at 79 dollars, a renewal fixed at 2 Jun 2026 and credits at 0.10 dollars each | ◐ Simulated | The renewal date has passed. Hardcoded, formula undefined (G10-E-24) |
| F-4.3: Confirm Changes, Buy Credits, Add Seats | Buttons | Only show a toast | ◐ Simulated | Nothing changes (G10-E-24). Decision needed: D-05 |
| F-4.4: `/transactions` figures | Tiles, chart, table | Available 1,755, Used this month 1,245, Total purchased 3,500, a five-point chart and five fixed 2024 rows | ◐ Simulated | Hardcoded, formula undefined (G10-E-25) |
| F-4.5: Transactions sub-tab and export | Tab, button | The same page is embedded under Billing. Export waits two seconds and toasts success | ◐ Simulated | No file is made (G10-E-25) |
| F-4.6: Purchases appear as transactions | Rule | A top-up or plan change adds a transaction row | ○ Not built | The page does not reflect them (G10-E-21). Decision needed: D-57 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rohan opens `/payments` | Reads the plans | **He sees Basic at 49 dollars per user, a name that does not exist on the Plans tab** |
| 2 | He presses **Buy Credits** | Confirms | **A toast shows. The balance does not change** |
| 3 | He buys credits on the Plans tab, then opens `/transactions` | Reads the table | **The purchase is not listed. The rows are from 2024** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Admin | When I review our subscription, I want one billing record with one set of plans, so that I am not misled. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** `/payments`, **when** Confirm Changes, Buy Credits or Add Seats is pressed, **then** only a toast shows. |
| F-4-2 | **Given** `/transactions`, **then** the tiles, chart and rows are fixed and do not change with any purchase. |
| F-4-3 | **Given** any signed-in role, **when** it opens `/payments` or `/transactions`, **then** the page opens. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Plan overview and payment | F-1.1 – F-1.8 | ● / ◐ / ○ | Plan card and meter are computed; cards, invoices and address are local or fixed. |
| F-2 | Plans, add-on credits and seats | F-2.1 – F-2.6 | ● / ◐ / ○ | Plan change, top-up and seats apply instantly with no payment. |
| F-3 | Credit usage | F-3.1 – F-3.4 | ● / ◐ | Breakdown and history work; simulate buttons deduct real credits. |
| F-4 | Second billing model | F-4.1 – F-4.6 | ◐ / ○ | `/payments` and `/transactions` are hardcoded and unguarded. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | See plan, renewal and credit use in one place | F-1 |
| 2 | Practice Manager | Top up credits when the balance runs low | F-2 |
| 3 | Practice Admin | Switch plan when needs change | F-2 |
| 4 | Practice Manager | See which feature uses credits | F-3 |
| 5 | Practice Admin | Have one billing record with one set of plans | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| System Admin (the default role, read from browser storage) | Change plan, top up, buy seats, manage cards, view usage | Nothing. There is no confirmation or approval |
| Any other role | Sees Settings in the menu | Opening `/settings/billing`. A click returns to the home page |
| Any signed-in user | Open `/payments` and `/transactions` | Nothing (G10-E-26) |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names the Practice Manager as the person who tops up. The prototype checks only the System Admin guard. Decision needed: D-55, D-57.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Usage percent | Plan Overview | Credits consumed divided by (plan credits plus add-on credits), capped at 100 percent, floor 0.1 percent |
| Seats | Plan Overview | Included seats plus extra seats purchased |
| Renewal date | Plan card | Assignment date plus 30 days (monthly) or 365 days (yearly) |
| Credits per feature | Credit Usage | Sum of deduction logs per feature. A gap versus total consumed is added to Calls |
| Top-up cost | Plans tab | Credits times the admin price per credit (fallback 0.04 dollars). Extra seat cost is the admin price per member (fallback 20 dollars) |
| Invoice rows | Plan Overview | Four fixed rows. **Hardcoded, formula undefined** |
| Available, Used this month, Total purchased | `/transactions` | 1,755, 1,245 and 3,500. **Hardcoded, formula undefined** (G10-E-25) |
| Seats, renewal, credit price | `/payments` | 2 seats, 2 Jun 2026, 0.10 dollars. **Hardcoded, formula undefined** (G10-E-24) |

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys. The kiosk QR payee is meant to come from billing settings, which is not traced here.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-05 | Are `/payments` and `/transactions` kept, retired or linked from navigation, and who may open them? | F-4.3 |
| D-54 | Which plan names are canonical, and what are the plan change rules (confirmation, proration, effective date, downgrade limits)? | F-2.2, F-4.1 |
| D-55 | Do plan seats gate adding a member, and what happens to over-limit users on downgrade? | F-1.4, F-2.4 |
| D-57 | How do top-ups work (bundles or custom amount, price source, payment method, invoice), what are the meter colour thresholds and what is the source of invoice data? | F-1.5, F-1.8, F-2.3, F-4.6 |
| D-62 | Which payment gateway is used, and where do card details and receipts live? | F-1.6, F-2.6 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
