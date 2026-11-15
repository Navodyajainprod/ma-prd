---
title: "Packed Pricing: Credit Packs, Seat Packs and Country Prices"
product: "admin"
module: "plans"
channel: "pricing"
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
| **What it is** | The **Packed Pricing** tab of **Plans & Credits**, with two sub-views: **Team Member** and **Credits**. Each has a base rate and a set of pack cards with a drawer to create or edit one. |
| **Who uses it** | Platform Admin (prices extra seats and credit top-ups). No role is checked. |
| **Where you start it** | **Plans & Credits** in the admin sidebar (`/admin/plans`), then **Packed Pricing** in the tab dropdown. |
| **Where the result goes** | The top-up modal and the add-seats drawer in Client Settings Billing. A purchase adds credits or seats at once, with no payment provider. |
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
| Client (Billing) | Credit top-up | Active credit packs are offered in the top-up modal. A purchase raises the credit balance at once. No card is taken and no invoice is written (G13-PRC-06). | [View Billing](/client/settings/billing) |
| Client (Billing) | Add seats | Active team member packs are offered in the add-seats flow (G13-PRC-13). | [View Billing](/client/settings/billing) |
| Client (Billing) | Telephony and SMS rates | Not connected. No country rate card exists, and calls do not bill by destination (G13-PRC-07, G13-PRC-09). | [View Billing](/client/settings/billing) |
| Admin (Industry Plans) | Country prices | Plans carry their own country prices. Packs use the same country mechanism. | [View Industry Plans](/admin/plans/plans) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Packed Pricing** and stays on **Credits**. The base rate **Price Per Custom Credit** reads 0.05. He edits it and a toast appears on every keystroke. He adds a pack of 5,000 credits at a base cost, with a badge and an Active switch labelled "Visible in client top-up modal". The card shows the price per credit, worked out from the pack price. He switches to **Team Member** and sets **Cost Per Extra Team Member**. He adds a pack of 5 extra members. He opens the country pricing in the drawer and adds an India price. When a clinic tops up in Billing, its balance rises at once. No payment is taken.

### What is real and what is not

- **Real in the prototype:** the two base rates, the pack cards and drawers, computed price per credit and per member, country prices on packs, and the Active switch that controls what clients see.
- **Simulated:** the base rates save on every keystroke. Seeded India packs hold rupee amounts under a "USD $" label. A pack purchase raises the balance with no payment.
- **Not built:** a discount percentage field, automatic seat billing on an invoice, a Stripe checkout, the Internal or Staff Only control for credit packs, and the country telephony and SMS rate cards with a bulk markup editor.

### Journey position

```
Base rate ─▶ Pack card ─▶ Active ─▶ Client top-up or add seats ─▶ Balance or seats rise (no payment)
```

## 2. Feature Requests

### F-1: Credit packs and the per-credit base price

#### 1. What it does
Leo opens **Credits**. Pack cards show the credits, a badge, an Internal Only chip when set, the price and the price per credit. He creates a pack in a drawer with a package name, credits (at least 100), a base cost in USD, a badge, country pricing and an **Active** switch. Active packs appear in the client top-up modal.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Price Per Custom Credit | Number | Base rate, default 0.05 | ◐ Simulated | Saves and toasts on every keystroke. Invalid input silently saves the default (G13-E-16) |
| F-1.2: Credit pack cards | Cards | Credits, badge, Internal Only chip, price, price per credit, "Available in N currencies" | ● Works | |
| F-1.3: Credit pack drawer | Drawer | Package name, credits (min 100), base cost in USD, badge, country pricing, Active "Visible in client top-up modal" | ● Works | Name and cost are required |
| F-1.4: Price per credit | Calculation | Pack price divided by credits on the card | ◐ Simulated | The stored per-credit price is copied from the base rate, not recomputed (G13-E-19) |
| F-1.5: Internal or Staff Only | Flag | The data holds the flag and the card shows a chip | ○ Not built | The drawer has no control to set it (G13-E-17) |
| F-1.6: Currency | Rule | Prices shown with a "USD $" label | ◐ Simulated | Seeded India packs hold INR amounts under that label (G13-E-18). Decision needed: D-60 |
| F-1.7: Unit discount percentage | Field | Described in the earlier PRD | ○ Not built | No discount field exists. Only the computed price per credit shows (G13-PRC-01) |
| F-1.8: Purchase charges and credits the wallet | Hand-off | A client top-up credits the wallet at once | ◐ Simulated | No payment provider. The earlier PRD named Stripe checkout (G13-PRC-06) |
| F-1.9: Loading and error states | State | None exist | ○ Not built | All data is browser-local (G13-X-05) |

#### 3. Worked example
Leo adds a 10,000 credit pack.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The drawer is open | Enters **10,000** credits and a base cost, then turns **Active** on | **The card shows the pack and its price per credit** |
| 2 | A clinic opens Billing | Chooses the pack in the top-up modal | **The balance rises at once. No payment is taken** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When pricing consumption credits, I want volume packs with a clear price per credit, so that high-usage clinics buy larger bundles. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a pack with credits below 100, **when** it is saved, **then** it is refused. |
| F-1-2 | **Given** the base rate field, **when** the admin types, **then** the value saves and a toast shows on each keystroke. |
| F-1-3 | **Given** a pack is Active, **then** it appears in the client top-up modal. Buying it raises the balance and takes no payment. |

### F-2: Team member packs and the per-seat price

#### 1. What it does
Leo opens **Team Member**. The base rate **Cost Per Extra Team Member** is in dollars per member per month, default 20. Pack cards show the extra members, a badge, an Active pill, the price per pack per month and the computed price per member. A drawer sets the pack name, extra members, base monthly cost in USD, badge, country pricing and the **Active** switch, labelled "Visible in client add seats drawer".

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Cost Per Extra Team Member | Number | Base price per additional seat per month, default 20 | ◐ Simulated | Saves and toasts on every keystroke (G13-E-16) |
| F-2.2: Team pack cards | Cards | Extra members, badge, Active pill, price per pack per month, price per member, currencies | ● Works | Price per member is pack price divided by members |
| F-2.3: Team pack drawer | Drawer | Pack name, extra members, base monthly cost in USD, badge, country pricing, Active | ● Works | Name, members and cost are required |
| F-2.4: Shown to clients | Hand-off | Active packs appear in the client add-seats flow | ◐ Simulated | Purchase takes no payment (G13-PRC-13, G13-PRC-06) |
| F-2.5: Auto-billed on invoice | Rule | Extra seats billed on the invoice each month | ○ Not built | No invoice or charge is written |
| F-2.6: Seat limit check | Rule | Adding a member beyond plan seats triggers a pack purchase | ○ Not built | Seats are not enforced. Decision needed: D-55 |

#### 3. Worked example
Leo prices extra seats.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Base rate reads 20 | Changes it to **29** | **Each digit typed saves and shows a toast** |
| 2 | He adds a pack of 5 members | Saves with Active on | **The card shows price per pack and price per member** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When a clinic outgrows its plan seats, I want a priced pack for extra seats, so that revenue grows with the team. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a team pack with extra members and a cost, **when** it is saved, **then** the card shows the price per member as pack price divided by members. |
| F-2-2 | **Given** a pack is not Active, **then** it does not appear in the client add-seats drawer. |
| F-2-3 | **Given** a clinic buys a pack, **then** no invoice line is created. |

### F-3: Country prices and telephony rate cards

#### 1. What it does
Packs can carry a price per country. The earlier PRD also promised a table of inbound, outbound and SMS rates for over 50 countries with a bulk markup editor. Only the pack country prices exist.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Country-wise pack pricing | Table | A price per country inside the credit and team pack drawers | ● Works | Shown as "Available in N currencies" on the card (G13-PRC-05) |
| F-3.2: Country Rates table | Table | Country, ISO code, inbound, outbound and SMS rates, searchable | ○ Not built | (G13-PRC-07) |
| F-3.3: Rate card bulk editor | Modal | Adjusts the telephony markup across all routes and shows net margin | ○ Not built | (G13-PRC-08) |
| F-3.4: Per-second call billing by destination | Rule | Calls deduct credits at the destination country rate | ○ Not built | No billing by destination exists (G13-PRC-09) |

#### 3. Worked example
Leo wants the United Kingdom call rate.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He opens Packed Pricing | Looks for a country rate table | **None exists. Country prices appear only inside pack drawers** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When routing international patient calls, I want a rate card per country, so that telephony usage is billed without carrier losses. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a pack drawer, **when** a country price is added, **then** the card shows the number of currencies. |
| F-3-2 | **Given** Packed Pricing, **then** no country rate card and no markup editor exist. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Credit packs and base price | F-1.1 – F-1.9 | ● / ◐ / ○ | Packs work; base rate saves per keystroke; no discount or payment. |
| F-2 | Team member packs and seat price | F-2.1 – F-2.6 | ● / ◐ / ○ | Packs work; no invoice billing or seat limit. |
| F-3 | Country prices and rate cards | F-3.1 – F-3.4 | ● / ○ | Pack country prices work; rate cards absent. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Price credit packs with a clear price per credit | F-1 |
| 2 | Platform Admin | Price extra seats for growing clinics | F-2 |
| 3 | Platform Admin | Set a rate per country for telephony | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/plans` and change base rates and packs | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named a Finance Administrator and a Telecom Manager and said nothing about access. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Price per member | Team pack card | Pack price divided by extra members |
| Price per credit | Credit pack card | Pack price divided by credits |
| Available in N currencies | Pack card | Count of country prices |
| Pack count | Tab dropdown | Count of packs |

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-60 | What is the currency model for packs and base rates (single USD or per org)? | F-1.6 |
| D-55 | Do seats gate tenants and what happens at the seat limit? | F-2.6 |
| D-12 | Must permissions block direct URL access and each action? | Roles section |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
