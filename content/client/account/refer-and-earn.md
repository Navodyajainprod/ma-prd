---
title: "Refer and Earn Programme"
product: "client"
module: "account"
channel: "refer-and-earn"
route: "/refer-and-earn"
status: "In Review"
build_status: "Simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | ACCOUNT |
| Route | `/refer-and-earn` |
| Status | In Review |
| Build status | Simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A referral page with an Overview tab (four earnings cards, a three-step explainer, a plan selector with a share link and code, a FAQ) and a Referrals tab (a searchable table of referred practices). All figures and rows are fixed sample data. |
| **Who uses it** | Practice Manager (copies and shares the link). Practice Admin (reads the earnings). No role is checked: any signed-in user can open it. |
| **Where you start it** | `/refer-and-earn`. |
| **Where the result goes** | Nowhere. Copy puts a link on the clipboard. The share drawer shows a toast and sends nothing. Sign-up does not read the referral code. |
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
| Client | Sign-up attribution | Not connected. The referral link carries a ref code and a plan, but the sign-up page reads neither. | [View Sign-in and Sign-up](/client/auth/access) |
| Client | Pricing plans | The plan tiers offered in the selector are Starter, Growth, Scale and Enterprise. Rates per tier are typed in, not read from plans. | [View Pricing and Payment](/client/auth/pricing-payment) |
| Admin | Plans | No link to Admin plan data. Plan names are typed in this page. | [View Admin Plans](/admin/plans/plans) |
| Client (Settings) | Billing and payouts | Not connected. No payout, balance or commission appears in Billing. | [View Billing](/client/settings/billing) |

## 1. Module Summary

### The story in one minute

Asha Verma, the practice manager, hears that MantraAssist pays for referrals. She opens **Refer & Earn**. Four cards on top read Total Earned, Successful Referrals, Pending Referrals and Conversion Rate. She picks the **Growth** plan and sees a 12 percent rate. She presses copy and a toast says the link for Growth was copied. Then she opens the share drawer, picks WhatsApp, types a contact and presses send. A toast says ready to send. She switches to the **Referrals** tab and filters to Paid. Every number she saw is typed into the page, the link is the same for every customer, and nothing was sent.

### What is real and what is not

- **Real in the prototype:** the two tabs, the plan selector, copying the link to the clipboard with a toast, the share drawer's channels and contact picker, and search and filter on the sample table.
- **Simulated:** all earnings, counts, the conversion rate, the six referral rows and the rate per plan are typed in. The share drawer only shows a toast. These are shown as real.
- **Not built:** attribution at sign-up, the referred customer's discount, payouts and any rule for rewards.

### Journey position

```
Refer & Earn ─▶ Pick plan ─▶ Copy link or share ─▶ (no sign-up attribution) ─▶ (no payout)
```

## 2. Feature Requests

### F-1: Share a referral

#### 1. What it does
Asha opens the **Overview** tab and picks a target plan tier. The page shows a link and a code for that plan. She copies the link or opens the share drawer. In the drawer she chooses SMS, WhatsApp or email, picks existing clients or types contacts, and presses the send button, which stays off until she has chosen someone.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Overview tab | Page | Four earnings cards, a three-step explainer, the plan selector and a FAQ | ● Works | The cards are covered in F-2 |
| F-1.2: Plan selector | Select | Starter, Growth, Scale or Enterprise, each with a rate of 14, 12, 10 or 7 percent | ◐ Simulated | Rates are typed in with no rule source. **Hardcoded, formula undefined**. Decision needed: D-53 |
| F-1.3: Referral link and code | Output | A link made of one fixed referral code and the plan, and a code like MANTRA-GROWTH | ◐ Simulated | The same code for every customer. Sign-up does not read it (G14-E-21). Decision needed: D-53 |
| F-1.4: Copy link | Button | Copies the link and shows a toast naming the plan and rate | ● Works | |
| F-1.5: Share drawer | Drawer | Channel SMS, WhatsApp or email. Pick clients or type contacts. The send button is off until someone is chosen. Send shows "Ready to send via" the channel | ◐ Simulated | Nothing is sent. The payload is only written to the browser console with a note to wire a send service |
| F-1.6: FAQ | Accordion | Four answers: what counts as a referral, payout timing within 24 hours, no earnings cap, a 15 percent discount for the referred practice at checkout | ◐ Simulated | Text only. No payout, cap or discount exists. Decision needed: D-53 |
| F-1.7: Attribution at sign-up | Rule | A referred sign-up is credited to the referrer | ○ Not built | Sign-up reads no referral code (G14-E-21). Decision needed: D-53 |
| F-1.8: Discount for the referred practice | Rule | A 15 percent discount at checkout | ○ Not built | Payment applies no discount. Decision needed: D-53 |

#### 3. Worked example
Asha shares a link.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Overview tab is open | Picks **Growth** and presses copy | **A toast names Growth and 12 percent and the link is on her clipboard** |
| 2 | She opens the share drawer | Chooses WhatsApp, adds one contact and sends | **A toast says ready to send. No message goes out** |
| 3 | A friend uses the link | Signs up | **Nothing is credited to Asha** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When I recommend the product to a colleague, I want a link that is mine, so that I am credited when they join. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a plan is selected, **when** copy is pressed, **then** the link is copied and a toast names the plan and its rate. |
| F-1-2 | **Given** the share drawer with no contact chosen, **then** the send button is off. |
| F-1-3 | **Given** a contact is chosen, **when** send is pressed, **then** a toast shows and nothing is delivered. |
| F-1-4 | **Given** any user, **then** the link carries the same fixed referral code. |

### F-2: Track referrals and earnings

#### 1. What it does
Asha reads four cards on the Overview tab, then opens the **Referrals** tab. A table lists referred practices with date, plan, status, rate and reward. She searches, filters by status and ticks rows.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Earnings cards | Cards | Total Earned shows $1,250.00, Successful Referrals 18 (10 Starter, 5 Growth, 3 Scale), Pending Referrals 7 with a 7 to 14 percent rate, Conversion Rate 72.0 percent | ◐ Simulated | All typed in and shown as real (G14-E-20). Decision needed: D-53 |
| F-2.2: Referrals table | Table | Six fixed rows with name, contact, date, plan, status, rate and reward | ◐ Simulated | Sample list shown as real. It does not match the cards, which say 18 successful and 7 pending (G14-E-20) |
| F-2.3: Search and status filter | Controls | Search referrals. Filter All Statuses, Paid, Pending or Signed Up | ◐ Simulated | Works on the sample rows only |
| F-2.4: Row selection | Control | Rows can be ticked | ◐ Simulated | Sample rows only |
| F-2.5: Real tracking and payout | Rule | Real referral records, reward calculation and payout | ○ Not built | Decision needed: D-53 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She opens the **Referrals** tab | Filters to **Paid** | **Four sample rows show** |
| 2 | She compares with the cards | Reads Successful Referrals | **The card says 18. The table has four paid rows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | After I refer practices, I want to see their status and my reward, so that I know what I have earned. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** any user, **then** the cards show the same typed-in figures. |
| F-2-2 | **Given** the Referrals tab, **when** Paid is chosen, **then** the sample paid rows show. |
| F-2-3 | **Given** a new referral is made, **then** no row or figure changes. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Share a referral | F-1.1 – F-1.8 | ◐ / ● / ○ | Copy works; link is fixed, share sends nothing, no attribution. |
| F-2 | Track referrals and earnings | F-2.1 – F-2.5 | ◐ / ○ | Cards and rows are sample data shown as real. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Have a link that credits me when a colleague joins | F-1 |
| 2 | Practice Manager | See referral status and what I have earned | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open the page, copy the link, open the share drawer, search and filter the sample table | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

No earlier PRD covers this page. Decision needed: D-53.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Total Earned | Overview card | $1,250.00 typed in. **Hardcoded, formula undefined** |
| Successful Referrals | Overview card | 18, with 10 Starter, 5 Growth, 3 Scale typed in. **Hardcoded, formula undefined** |
| Pending Referrals | Overview card | 7 typed in, with the text 7 to 14 percent commission. **Hardcoded, formula undefined** |
| Conversion Rate | Overview card | 72.0 percent typed in. **Hardcoded, formula undefined** |
| Rate per plan | Selector and table | Starter 14, Growth 12, Scale 10, Enterprise 7 percent. **Hardcoded, formula undefined** |
| Reward per referral | Referrals table | Fixed sample amounts. **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-53 | What are the referral reward formula, per-plan rate, payout method, cap and attribution method? | F-1.2, F-1.3, F-1.6, F-1.7, F-1.8, F-2.1, F-2.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
