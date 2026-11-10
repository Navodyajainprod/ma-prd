---
title: "Subscription Plans, Payment Methods & Wallet Credits"
product: "client"
module: "settings"
channel: "billing"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SETTINGS |
| Channel | BILLING |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Billing & Plans tab allows administrators to manage their MantraAssist subscription tier, view credit balances (for AI Voice, Scribe minutes, and SMS segments), top up their wallet, and download past tax invoices.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Subscription Tier Display & Add-On Credit Balance
#### 1. What it does
Displays current practice subscription plan (Starter, Growth, Enterprise), monthly renewal date, remaining credit balance in the practice wallet, and credit consumption meters.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Active Plan Card | UI Card | Shows plan tier name, monthly cost, renewal date, and included quotas | Highlights upgrade options |
| F-1.2: Live Wallet Credit Meter | Progress Bar | Displays remaining credits in clinic balance with color indicator (Green > 1000, Amber < 500, Red < 100) | Updates in real time |
| F-1.3: Top Up Credits Button | Button & Modal | Opens instant credit bundle purchase modal (1,000 / 5,000 / 10,000 credits) | Charges saved Stripe card |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin checks credit balance | Card shows '850 credits remaining' | **Admin clicks 'Top Up Credits', selects 5,000 bundle, and balance updates to 5,850 instantly** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When credit balance runs low, I want to top up our wallet instantly, so that AI Scribe and patient SMS messaging are not interrupted. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a successful credit purchase, the practice wallet balance increments immediately and logs an invoice. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Subscription Tier Display & Add-On Credit Balance | F-1.1, F-1.2, F-1.3 | Displays current practice subscription plan (Starter, Growth, Enterprise), monthly renewal date, remaining credit balance in the practice wallet, and credit consumption meters. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | When credit balance runs low, I want to top up our wallet instantly, so that AI Scribe and patient SMS messaging are not interrupted. | F-1 |
