---
title: "Billing: Balance, Invoices and Payment"
product: "companion"
module: "billing"
route: "/patient/bill"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | COMPANION |
| Module | BILLING |
| Route | `/patient/bill` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A Billing screen with a total outstanding balance and an invoice list, and a payment screen at `/patient/pay` with a UPI QR code and one **Confirm & Record Payment** button. |
| **Who uses it** | Patient. Daniel Brooks sees the payment on the invoice. Nothing on `/patient` is protected (G12-E-01). |
| **Where you start it** | **Billing** in the portal drawer, the balance row or **Pay Invoice** on Today, **Proceed to Billing** on Pharmacy. |
| **Where the result goes** | The same invoice and payment store the clinic's Invoices page reads, the patient's stage ("Payment Done") and the call log. |
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
| Client (Invoices) | Invoices and payments | The portal lists invoices and records a QR payment on the same invoice. The payment is self-declared. With no invoice of her own, the portal lists other patients' invoices and can save an invented $78.75 invoice. | [View Invoices](/client/invoices) |
| Client (Invoices) | Prepaid booking | The booking's invoice has a placeholder line, so its total and the recorded payment differ. | [View Invoices](/client/invoices) |
| AI Receptionist | Kiosk QR pay | The kiosk also records a full-balance payment on a tap, with no proof. | [View Kiosk QR Pay](/ai-receptionist/billing/qr-pay) |
| Companion | Today | The balance row and the **Pay Invoice** button open Billing and Pay. | [View Companion Today](/companion/today) |
| Companion | Pharmacy | **Proceed to Billing** moves the patient to "Pay Bill" and opens Billing. | [View Companion Pharmacy](/companion/pharmacy) |
| Companion | Visits | A prepaid booking creates the invoice that later appears here. | [View Companion Appointments](/companion/appointments) |

## 1. Module Summary

### The story in one minute

Sarah Johnson opens **Billing**. A hero card says "Total Outstanding Balance". Below it each invoice shows its amount, date and "Due: $x" or "Settled in full". She presses **Pay** on her cataract visit invoice. The payment page shows the invoice number, the total, the balance due and a UPI QR code for that balance. She presses **Confirm & Record Payment**. No bank is asked. A receipt number appears and she is moved to "Payment Done". Daniel Brooks sees the invoice as Paid. If Sarah had no invoice, the screen would have listed other patients' bills.

### What is real and what is not

- **Real in the prototype:** the balance and invoice list, the payment screen with its QR, the payment written to the shared invoice, the receipt number, the stage change.
- **Simulated:** who the invoices belong to (fallbacks to other patients and invented $78.75 invoices), the payment itself (a tap, no proof), and the Receipt button, which reopens the pay page.
- **Not built:** card, Apple Pay and Google Pay on this screen, a receipt PDF, a breakdown by copay, diagnostics and pharmacy, an empty state, and refusing void invoices.

### Journey position

```
Today / Pharmacy ─▶ Billing ─▶ Pay ─▶ Confirm & Record Payment ─┬▶ Invoice Paid (Client)
                                                                └▶ Stage "Payment Done"
```

## 2. Feature Requests

### F-1: Outstanding balance and invoice list

#### 1. What it does
Sarah opens Billing. The hero shows her total outstanding balance. The list shows each invoice. Unpaid ones have **Pay $x**. Paid ones have **Receipt**. Both open the payment page with the invoice id in the link.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Total Outstanding Balance | Card | Sum of total minus paid, never below 0, over the invoices found that are not paid | ◐ Simulated | Includes other patients' invoices when she has none (G12-E-18) |
| F-1.2: Invoice list | List | Amount, date, "Settled in full" or "Due: $x" | ◐ Simulated | Matched by client id, name or phone, then widened (G12-E-18) |
| F-1.3: Fallback when none match | State | Shows all unpaid invoices in the clinic, then all invoices, then saves an invented $78.75 consultation invoice | ◐ Simulated | The invented invoice appears on the clinic's Invoices page (G12-E-18). Decision needed: D-46 |
| F-1.4: Pay button | Button | Opens the payment page with the invoice id | ● Works | |
| F-1.5: Receipt button | Button | Opens the payment page again | ◐ Simulated | No receipt file is produced |
| F-1.6: Void invoices | Rule | A void invoice with a balance is listed as due | ◐ Simulated | (XM-06). Decision needed: D-63 |
| F-1.7: Empty state | State | A message when the patient has no invoice | ○ Not built | The fallback always finds or invents one |
| F-1.8: Breakdown by copay, diagnostics, pharmacy | Card | Described in the earlier PRD | ○ Not built | Decision needed: D-73 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | One $35 invoice open | Opens **Billing** | **$35.00 is shown as outstanding** |
| 2 | A new patient with no invoice | Opens **Billing** | **Other patients' unpaid invoices are listed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I want to know what I owe, I want to see my balance and invoices, so that I can settle them. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** invoices that are not paid, **then** the balance is the sum of total minus paid, never below 0. |
| F-1-2 | **Given** no invoice matches the patient, **when** Billing opens, **then** other patients' invoices are listed, and if none exist an invented invoice is saved. |
| F-1-3 | **Given** Receipt is pressed, **then** the payment page opens. No file is produced. |

### F-2: Pay an invoice

#### 1. What it does
The payment page shows the invoice number, total, balance due and a UPI QR for the balance. Sarah presses **Confirm & Record Payment**. A full QR payment is written against the invoice, the stage moves to "Payment Done" and a receipt number appears. **Back to billing** and **Home** follow.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Invoice choice | Rule | Uses the invoice id in the link. If absent or unknown: the patient's pending invoice, any pending invoice, any invoice, else an invented default that is saved | ◐ Simulated | Any patient's invoice id opens (G12-E-19, G12-E-21) |
| F-2.2: Summary and balance due | Display | Invoice number, total, balance due as total minus paid | ● Works | |
| F-2.3: UPI QR | Image | A QR built for the balance | ◐ Simulated | Nothing watches for money (G12-E-20). Decision needed: D-62 |
| F-2.4: Confirm & Record Payment | Button | Records a full QR payment with no check that money moved | ◐ Simulated | One tap clears a real debt (G12-E-20) |
| F-2.5: Payment lands on the invoice | Hand-off | Written to the shared invoice and payment store the clinic reads | ◐ Simulated | Two write paths may duplicate rows (G7-E-19) |
| F-2.6: Result | Rule | Receipt number shown. Stage becomes "Payment Done". The call log is updated | ● Works | The trigger is the unchecked tap (G12-E-20) |
| F-2.7: After payment | Buttons | **Back to billing** and **Home** | ● Works | |
| F-2.8: Card, Apple Pay, Google Pay | Checkout | Described in the earlier PRD | ○ Not built | Card exists only in the booking sheet. Decision needed: D-62 |
| F-2.9: Gateway confirmation | Rule | Payment recorded only after the provider confirms | ○ Not built | Decision needed: D-62 |
| F-2.10: Receipt PDF | Document | With reference id and clinic address | ○ Not built | A receipt number only |
| F-2.11: Void invoice refused | Rule | A void invoice cannot be paid | ○ Not built | It turns Paid (XM-06). Decision needed: D-63 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah owes $35 | Presses **Confirm & Record Payment** | **The invoice is Paid, a receipt number shows and her balance is $0.00. No money moved** |
| 2 | Someone edits the invoice id in the link | Opens the page | **That patient's invoice opens and can be marked paid** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I owe a bill, I want a quick secure way to pay it, so that I skip the cashier desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** any invoice id in the link, **when** the page opens, **then** that invoice is shown whoever owns it. |
| F-2-2 | **Given** Confirm & Record Payment, **when** pressed, **then** a full payment is recorded with no proof and the invoice is Paid in Client Invoices. |
| F-2-3 | **Given** a void invoice with a balance, **when** paid, **then** the payment is accepted. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Balance and invoice list | F-1.1 – F-1.8 | ◐ / ● / ○ | Lists work but borrow other patients' invoices. |
| F-2 | Pay an invoice | F-2.1 – F-2.11 | ◐ / ● / ○ | Payment is a tap with no proof. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | See what I owe | F-1 |
| 2 | Patient | Pay quickly and securely | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Anyone with the link | See and pay any patient's invoice by changing the path, `?clientId=` or the invoice id | Nothing |
| Clinic staff | See the payment on the invoice | Nothing on this page |

The earlier PRD named the patient only. Decision needed: D-46.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Total Outstanding Balance | Billing hero | Sum of total minus paid, minimum 0, over the invoices found that are not paid |
| Balance due | Pay page | Invoice total minus amount already paid |
| Fallback invoice | Billing and Pay | $78.75. **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal with Appointments and Invoices | Staff creates an invoice | Billing matches by id, name or phone, then lists others' unpaid invoices and saves an invented one. Void is not excluded. |
| | Patient taps Confirm & Record Payment | Any invoice id opens. Payment is self-declared. Stage becomes "Payment Done". |
| | Prepaid booking | The invoice total and the recorded payment differ. |
| Kiosk check-in to Billing | Kiosk I Have Paid | The kiosk records a full payment on a tap, the same weakness. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-46 | What is the patient authentication model? | F-1.3, Roles |
| D-62 | Which gateway and rails, and what counts as paid? | F-2.3, F-2.8, F-2.9 |
| D-63 | Can a void invoice be paid, and may a tap mark paid? | F-1.6, F-2.11 |
| D-73 | Should the balance be broken down by copay, diagnostics and pharmacy? | F-1.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
