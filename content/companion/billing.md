---
title: "Patient Copays, Invoices & Digital Checkout"
product: "companion"
module: "billing"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | COMPANION |
| Module | BILLING |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Billing & Invoices module enables patients to review outstanding clinic copays, inspect itemized charge breakdowns, and pay securely via Credit/Debit Card or UPI with instant receipt downloads.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Outstanding Copay Ledger & Digital Payment Checkout
#### 1. What it does
Displays outstanding patient balances with itemized consultation and lab charges, integrating Stripe / UPI checkout for one-tap bill payment.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Outstanding Balance Card | Summary Card | Highlights total amount due with breakdown: Doctor Copay, Diagnostic Tests, Pharmacy | Prominent 'Pay Now' button |
| F-1.2: Instant Payment Gateway Checkout | Payment Modal | Supports Credit Card, Apple Pay, Google Pay, and UPI QR code payment rails | PCI-DSS compliant |
| F-1.3: Payment Receipt PDF Download | Receipt Generator | Generates downloadable tax receipt with payment reference ID and clinic address | Saved to payment history |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient receives bill notification for $35 copay | Opens Billing tab, taps 'Pay Now', confirms with Apple Pay | **Payment processes in 2 seconds; receipt is saved and balance resets to $0.00** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When paying my medical bill, I want a secure one-tap mobile checkout, so that I can settle copays without waiting at the cashier desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Successful digital payments immediately update the patient's balance to zero and mark the invoice paid in Client Billing. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Outstanding Copay Ledger & Digital Payment Checkout | F-1.1, F-1.2, F-1.3 | Displays outstanding patient balances with itemized consultation and lab charges, integrating Stripe / UPI checkout for one-tap bill payment. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | When paying my medical bill, I want a secure one-tap mobile checkout, so that I can settle copays without waiting at the cashier desk. | F-1 |
