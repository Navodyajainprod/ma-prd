---
title: "Public Pricing Page and Payment Screen"
product: "client"
module: "auth"
channel: "pricing-payment"
route: "/pricing and /payment"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | AUTH |
| Route | `/pricing` and `/payment` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A public price page with product tabs, a monthly or yearly toggle, plan cards, a comparison table, a credit explainer and a FAQ. Plus a payment screen for card or UPI that activates a paid plan without charging anyone. |
| **Who uses it** | Practice Admin, before signing up (pricing) or after choosing a paid plan or accepting a paid invite (payment). Neither route needs sign-in. |
| **Where you start it** | `/pricing` directly, or `/payment` after verify, after an invite for a paid plan, or from the last onboarding step on the paid path. |
| **Where the result goes** | **Get started** opens `/signup` with the plan. Payment assigns the plan to the workspace, marks the organisation Active and continues to onboarding or the dashboard. |
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
| Admin | Plans and prices | Plan, price and feature data on `/pricing` is read from the Admin plan store. The page tries an API first and falls back to the store. | [View Admin Plans](/admin/plans/plans) |
| Admin | Plan categories | The four product tabs follow the plan categories. Whether promotional badges such as Most Popular render is not verified. | [View Admin Plan Categories](/admin/plans/categories) |
| Admin | Credit settings | The credit rates in the FAQ are typed text. They are not read from Admin settings. | [View Admin Pricing](/admin/plans/pricing) |
| Client | Sign-up | **Get started** opens `/signup` with category, tier and cycle in the address. | [View Sign-in and Sign-up](/client/auth/access) |
| Client | Onboarding | A plan chosen on the pricing page adds a sixth step to onboarding and sends the user to payment. | [View Onboarding](/client/auth/onboarding) |
| Client (Settings) | Billing | The plan assigned after payment is the subscription that Billing shows. | [View Billing](/client/settings/billing) |
| Admin | Subscriptions and orders | Admin Organizations holds the organisation record that payment marks Active. No order is created by a real gateway. | [View Admin Organizations](/admin/organizations) |

## 1. Module Summary

### The story in one minute

Rohan Mehta is comparing vendors for his clinic. He opens `/pricing` without signing in. He picks the **Scribe** tab and switches to **Yearly**, where a 20 percent badge shows. He scrolls through the plan cards and the comparison table, then reads how credits work. He presses **Get started** on a plan and lands on `/signup` with the plan already remembered. After he verifies, the paid path sends him through onboarding to `/payment`. He picks Card, uses the **Fill demo card** link in test mode and presses pay. A short wait later his organisation is Active and the plan is assigned. No gateway was called and no money moved.

### What is real and what is not

- **Real in the prototype:** the product tabs, plan cards read from the Admin plan store, the Custom label in place of a price, the Get started hand-off with category, tier and cycle, the payment form fields and validation, and the routing after payment.
- **Simulated:** the credit rates and FAQ text are typed in, the top-up packs are display only, and payment calls no gateway and charges no card, yet the plan is activated. This is security-relevant: the test-mode flags that reveal a demo card are read from browser storage, and card data sits in page state.
- **Not built:** buying a top-up pack, a real payment gateway, a payment-failed path, receipts and a retry.

### Journey position

```
Pricing ─▶ Get started ─▶ Sign up ─▶ Verify ─▶ Onboarding ─▶ Payment ─▶ Onboarding / Dashboard
```

## 2. Feature Requests

### F-1: Browse plans on the public price page

#### 1. What it does
Rohan opens `/pricing`. Four tabs name the products: Receptionist, Scribe, EHR and RCM. A toggle switches between monthly and yearly prices and shows a 20 percent yearly badge. Plan cards list price and features. A comparison table lines the plans up. A credits section explains how credits work and shows top-up packs without buy buttons. A FAQ of six questions closes the page. The header and footer link to sign-in and sign-up.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Product tabs | Tabs | Receptionist, Scribe, EHR, RCM | ● Works | |
| F-1.2: Data source | Rule | Tries an API call, then falls back to the Admin plan store | ◐ Simulated | The API is not backed by anything in the prototype |
| F-1.3: Cycle toggle | Toggle | Monthly or yearly, with a 20 percent yearly badge | ◐ Simulated | Whether the yearly price is computed from the 20 percent or read from the plan is unverified. Decision needed: D-58 |
| F-1.4: Plan cards | Cards | Active plans of the chosen product with price and features. Custom and Enterprise tiers show a custom label instead of a price | ● Works | Admin promotional badges not verified (G14-I-05) |
| F-1.5: Comparison table | Table | Compares the plans of the chosen product | ● Works | |
| F-1.6: Credits explainer | Info | States that monthly credits refresh each cycle and do not roll over, and lists credit rates: outbound minute 1, inbound minute 2, missed-call callback 3, SMS or email 1, workflow run 1 | ◐ Simulated | Static text, not read from Admin credit settings, so it can go stale (G14-E-24). Decision needed: D-58 |
| F-1.7: Top-up credit packs | Info | Shows packs with no buy button | ◐ Simulated | Display only |
| F-1.8: FAQ | Accordion | Six questions, including that changes are prorated on upgrade and apply next cycle on downgrade | ◐ Simulated | Static text. Nothing in the prototype prorates or schedules a change (G14-E-24) |
| F-1.9: Header and footer links | Links | Sign-in and sign-up | ● Works | |
| F-1.10: Buy a top-up pack | Action | No purchase is possible | ○ Not built | |

#### 3. Worked example
Rohan compares plans.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Opens `/pricing` signed out | Presses the **Scribe** tab | **Only Scribe plans show** |
| 2 | He wants the cheaper cycle | Switches to **Yearly** | **The cards show yearly prices and the 20 percent badge** |
| 3 | A plan is Custom | Looks at its card | **A custom label shows instead of a price** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I compare vendors, I want clear prices and what credits cost, so that I can decide before talking to sales. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a signed-out visitor, **when** `/pricing` is opened, **then** the page opens with no sign-in. |
| F-1-2 | **Given** a product tab, **when** it is pressed, **then** only that product's active plans show. |
| F-1-3 | **Given** a Custom or Enterprise plan, **then** a custom label replaces its price. |
| F-1-4 | **Given** the credits section, **then** the rates shown are fixed text and do not change when Admin settings change. |

### F-2: Get started hand-off

#### 1. What it does
Rohan presses **Get started** on a card. The browser opens `/signup` with the category, tier and cycle in the address. Sign-up checks the plan against the active plans and remembers it. On the paid path, onboarding gets a sixth step and sends him to payment.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Get started | Button | Opens `/signup?category=...&tier=...&cycle=...` | ● Works | |
| F-2.2: Plan validation at sign-up | Rule | An unknown category clears the choice, an unknown tier falls back to Starter, with no match the first stored plan is used | ● Works | See the sign-in and sign-up PRD |
| F-2.3: Custom plan contact | Action | No contact or sales flow exists behind a Custom plan | ○ Not built | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rohan likes Growth yearly | Presses **Get started** | **Sign-up opens remembering Growth and the yearly cycle** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | After I choose a plan, I want sign-up to remember it, so that I do not choose twice. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a plan card, **when** Get started is pressed, **then** `/signup` opens with category, tier and cycle in the address. |
| F-2-2 | **Given** an unknown tier in the address, **then** the Starter tier is saved. |

### F-3: Pay for a plan

#### 1. What it does
`/payment` opens for a paid invite or a pricing-path sign-up. The plan and the billing organisation name are filled in. Rohan picks **Card** or **UPI**, fills the fields and pays. After a short wait the plan is applied and the clinic is Active. Nothing is charged.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Plan and organisation name | Rule | Loads the invite session or the pricing selection and the matching plan. The organisation name is pre-filled | ● Works | |
| F-3.2: Method choice | Toggle | Card or UPI | ● Works | |
| F-3.3: Validation | State | Organisation name required. Card number at least 15 digits, expiry must contain a slash, CVC three or more digits, cardholder name required. UPI must contain an at sign. Errors show inline and in a generic banner | ● Works | Only the shape is checked |
| F-3.4: Demo card quick fill | Link | In test or demo mode a link fills a sample card | ◐ Simulated | Test-mode flags are read from browser storage, so anyone can turn them on. Security-relevant (G14-E-16, G14-E-17) |
| F-3.5: Pay | Action | After a simulated wait the plan is assigned, the organisation is marked Active with plan details, the pending flag is cleared, onboarding is marked complete and the user is signed in | ◐ Simulated | No gateway call and no charge. The plan is activated whatever the card. Security-relevant (G14-E-16). Decision needed: D-62 |
| F-3.6: Card data handling | Rule | Card details are held in page state | ◐ Simulated | Never tokenised or sent anywhere. Security-relevant (G14-E-17) |
| F-3.7: After payment | Rule | An invited organisation goes to the dashboard after a 4.2 second loader. A pricing-path user goes to `/onboarding` to finish tailoring | ● Works | |
| F-3.8: Back control | Button | Goes to the previous page, or to sign-in | ● Works | |
| F-3.9: Real gateway, failures, retry, receipt | Rule | No gateway, no payment-failed path beyond field validation, no retry, no receipt | ○ Not built | Decision needed: D-62 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rohan chose a paid plan | Opens `/payment`, picks **Card**, fills the demo card, presses pay | **After a short wait the clinic is Active and he goes on to onboarding** |
| 2 | He types a card number of 10 digits | Presses pay | **An inline error and a banner show** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When I choose a paid plan, I want to pay once and start, so that I do not need a sales call. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** valid-shaped fields, **when** the user pays, **then** the plan is assigned and the organisation becomes Active. No card is charged. |
| F-3-2 | **Given** a card number under 15 digits, **when** the user pays, **then** an inline error shows and nothing is activated. |
| F-3-3 | **Given** a paid invite, **when** payment finishes, **then** the dashboard opens after a loader. |
| F-3-4 | **Given** a pricing-path user, **when** payment finishes, **then** onboarding opens. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Browse plans | F-1.1 – F-1.10 | ● / ◐ / ○ | Tabs and cards work; credit text is static and top-ups are display only. |
| F-2 | Get started hand-off | F-2.1 – F-2.3 | ● / ○ | Plan travels to sign-up; no contact flow for Custom. |
| F-3 | Pay for a plan | F-3.1 – F-3.9 | ● / ◐ / ○ | Form works; no gateway, plan activates anyway. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | See clear prices and credit costs | F-1 |
| 2 | Practice Admin | Have sign-up remember my plan | F-2 |
| 3 | Practice Admin | Pay once and start | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Anyone, signed in or not | Open `/pricing` and `/payment`, press Get started, pay, enable test mode in browser storage | Nothing. Neither route is guarded |

No earlier PRD covers these screens. The plan categories PRD mentions badges such as Most Popular on public pages. Decision needed: D-62.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Yearly discount | Pricing toggle badge | 20 percent is stated. Whether the yearly price is computed from it or read from the plan is unverified. Decision needed: D-58 |
| Credit rates | Pricing FAQ | Outbound minute 1, inbound minute 2, missed-call callback 3, SMS or email 1, workflow run 1. **Hardcoded, formula undefined** |
| Proration | Pricing FAQ | Stated as prorated on upgrade and applied next cycle on downgrade. Text only, no calculation exists |

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-58 | Is the 20 percent yearly discount confirmed, and are credit rates read from Admin? | F-1.3, F-1.6 |
| D-62 | Which payment gateway, currencies, failed-payment, retry and receipt rules apply? | F-3.5, F-3.9 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
