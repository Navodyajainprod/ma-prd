---
title: "Touchless UPI QR Checkout & Reconciliation"
product: "ai-receptionist"
module: "billing"
channel: "qr-pay"
route: "/reception/billing"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | BILLING AND PAYMENTS: TOUCHLESS QR CHECKOUT (`/reception/billing`) |
| Route | `/reception/billing` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A kiosk checkout card with a payment QR, supported wallet badges, a Copy Payment Link button and an **I Have Paid** button that records the payment on the invoice. |
| **Who uses it** | Patient (at the lobby kiosk). Billing Specialist (sees the payment on the Invoices page). No identity check and no role is applied. |
| **Where you start it** | **Pay via QR** or **View Receipt** on an invoice card in the kiosk ledger, or saying "pay" or "checkout". |
| **Where the result goes** | The invoice and its payment record on the Invoices page, the kiosk ledger, and the patient's Companion Bill screen. Nothing reaches Claims. |
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
| Client (Invoices) | Payment lands on the invoice | **I Have Paid** records the full balance with method QR Code and the note "Paid via AI Receptionist QR Kiosk". The invoice shows Paid. Nothing checks that money moved. An invoice id the service cannot find creates a new paid invoice for client CL-001. A void invoice with a balance can be paid. | [View Invoices](/client/invoices) |
| Client (Billing settings) | Payee and numbering | Not connected. The QR uses a fixed payee address and USD amounts. Billing settings do not feed it. | [View Billing Settings](/client/settings/billing) |
| Client (Reception Settings) | Kiosk setup | The kiosk is deployed from Reception Settings, which holds no payment rules. | [View Reception Settings](/client/settings/reception) |
| Client (Clients) | Account balance | The client's Invoices tab shows the payment after it is recorded. Kiosk payment does not move the client's stage (the portal does). | [View Clients](/client/clients) |
| Companion | Paid receipt on the phone | The patient's Bill screen reads the same invoices, so a kiosk payment shows as paid there. | [View Companion Billing](/companion/billing) |
| Companion (Appointments) | Visit receipts | Not connected from this screen. | [View Companion Appointments](/companion/appointments) |

## 1. Module Summary

### The story in one minute

Sarah Johnson taps **Pay via QR** on her consultation invoice. A card opens showing **Touchless QR Settlement**, a **Payment Pending** pill, the invoice number, the due date and the balance in dollars. A QR code sits beside a strip of wallet badges. She can tap **Copy Payment Link** if scanning is awkward. She pays on her phone, then taps **I Have Paid • Settle Invoice Now**. The kiosk does not check any bank or gateway. It records the payment, throws confetti, turns Aria green and speaks a thank-you. The card flips to **Paid & Reconciled**. Daniel Brooks later sees a QR Code payment on the invoice. The payment QR cannot be paid in a real UPI app, because it is an INR-only link with a dollar amount.

### What is real and what is not

- **Real in the prototype:** the QR card layout, the pending and paid header, the Settled & Paid overlay, the wallet badges, the copy button, the saving lock, the confetti and spoken thank-you, and the return buttons.
- **Simulated:** the payment itself. Tapping **I Have Paid** records the full balance with no proof (G11-E-16). The QR carries a fixed payee address and USD (G11-E-18). The receipt number is made up (G11-E-40).
- **Not built:** reconciliation against a real UPI or gateway confirmation, and the standalone Confirm & Record Payment dialog, which exists in code but is not mounted.

### Journey position

```
Pay via QR ─▶ QR card ─▶ I Have Paid (no proof) ─▶ Invoice Paid ─┬▶ Kiosk ledger
                                                                 ├▶ Invoices page
                                                                 └▶ Companion Bill
```

## 2. Feature Requests

### F-1: QR settlement card and Settled overlay

#### 1. What it does
Sarah taps **Pay via QR** and the **Touchless QR Settlement** card opens. It shows a status pill, the invoice number, the patient name, the due date and the balance. The QR encodes a payee, the balance, a currency and the invoice number. On a paid invoice, **View Receipt** shows **Paid & Reconciled** and an overlay **Settled & Paid • MantraAssist Synced** covers the QR.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Payment QR | Generator | Encodes a UPI link with a fixed payee address, the balance, USD and the invoice number | ◐ Simulated | UPI apps accept INR only, so a real scan would not complete (G11-E-18). Decision needed: D-62 |
| F-1.2: Header | Strip | Shows **Payment Pending** or **Paid & Reconciled**, invoice number, patient, due date and balance | ● Works | G11-I-113 |
| F-1.3: Settled & Paid overlay | Overlay | Covers the QR once the invoice is paid | ● Works | Hides the QR so the same invoice is not paid twice from this card |
| F-1.4: Void invoice | Rule | A void invoice with a balance opens the card and can be paid | ◐ Simulated | XM-06. Decision needed: D-63 |
| F-1.5: Payee and currency from Billing settings | Rule | Described in the earlier PRD | ○ Not built | The payee is fixed in code. Decision needed: D-62 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | An invoice has a balance of 150 | Taps **Pay via QR** | **The card shows Payment Pending, the balance and a QR with a fixed payee, in USD** |
| 2 | An invoice is already paid | Taps **View Receipt** | **Paid & Reconciled with the Settled & Paid overlay on the QR** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I pay by phone at the kiosk, I want a QR that carries the exact amount and invoice, so that I make no typing mistakes. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** an unpaid invoice, **when** Pay via QR is tapped, **then** the card shows Payment Pending, the balance and a QR with a fixed payee address and USD. |
| F-1-2 | **Given** a paid invoice, **when** View Receipt is tapped, **then** Paid & Reconciled and the overlay show. |
| F-1-3 | **Given** a void invoice with a balance, **then** the card opens and can be paid. |

### F-2: Wallet badges and Copy Payment Link

#### 1. What it does
Beside the QR, the **Instant Mobile Checkout** panel shows badges for GPay, PhonePe, Paytm, BHIM UPI, Apple Pay and Banking Apps. **Copy Payment Link** copies the payment link and the label changes to **URI Copied**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Wallet badges | Chips | Shows the six app names | ● Works | G11-I-115. Display only, no app is called |
| F-2.2: Copy Payment Link | Button | Copies the link and shows **URI Copied** and a toast | ● Works | The copied link is the fixed-payee link from F-1.1 |
| F-2.3: Standalone Copy UPI Link dialog | Dialog | Described in the earlier PRD | ○ Not built | The dialog exists in code but is never mounted (G11-E-39) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah's phone cannot scan the screen | Taps **Copy Payment Link** | **The label changes to URI Copied and a toast confirms** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When scanning is awkward, I want to copy the payment link, so that I can pay from another device. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the QR card, **then** the six wallet badges and Copy Payment Link are visible. |
| F-2-2 | **Given** Copy Payment Link is tapped, **then** the label shows URI Copied. |

### F-3: I Have Paid and ledger update

#### 1. What it does
After paying, Sarah taps **I Have Paid • Settle Invoice Now**. The button locks while the save runs. The kiosk records a payment of the full balance with method QR Code and the note "Paid via AI Receptionist QR Kiosk". Confetti bursts, Aria turns green and speaks a thank-you, and the card shows **Paid & Reconciled**. **Back to All Bills** and **Return Home** follow. The kiosk does not check that any money moved.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Record payment | Write | Records the full balance as QR Code with the kiosk note, and the invoice becomes Paid | ◐ Simulated | The visitor's tap is the only proof (G11-E-16). Decision needed: D-63 |
| F-3.2: Unknown invoice id | Rule | An id the service cannot find creates a new paid invoice for client CL-001 named "Patient" | ◐ Simulated | G11-E-17 |
| F-3.3: Saving lock | Rule | The button is disabled while the save runs | ● Works | G11-I-119 |
| F-3.4: Confetti, green Aria and thank-you | Feedback | Visual burst, green state and a spoken confirmation | ● Works | G11-I-120 |
| F-3.5: Receipt number | Display | A receipt number shown on confirmation | ◐ Simulated | Made up from invoice digits, default 1001 (G11-E-40) |
| F-3.6: Failure handling | State | A failed save shows an error toast | ◐ Simulated | The error is then rethrown and goes unhandled (G11-E-40) |
| F-3.7: Back to All Bills, Return Home | Buttons | Returns to the refreshed ledger or to Home | ● Works | G11-I-121 |
| F-3.8: Gateway reconciliation | Rule | Described in the earlier PRD: reconcile against a real payment confirmation | ○ Not built | Nothing checks that money arrived (G11-I-118). Decision needed: D-62 |
| F-3.9: Standalone Confirm & Record Payment | Dialog | Described in the earlier PRD | ○ Not built | Never mounted (G11-E-39) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah has paid on her phone | Taps **I Have Paid • Settle Invoice Now** | **Confetti, a spoken thank-you and Paid & Reconciled. Back to All Bills shows Paid & Settled** |
| 2 | A visitor taps it without paying | Taps **I Have Paid • Settle Invoice Now** | **The invoice is recorded as paid all the same** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I pay at the kiosk, I want the invoice shown as paid at once, so that I can leave without paper. |
| F-3-J2 | Billing Specialist | When a patient pays at the kiosk, I want the payment to appear on the invoice and to be real, so that the ledger can be trusted. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** I Have Paid is tapped, **then** the full balance is recorded as QR Code with the note "Paid via AI Receptionist QR Kiosk" and the invoice shows Paid, with no check that money arrived. |
| F-3-2 | **Given** the invoice id is not found, **then** a new paid invoice is created for client CL-001. |
| F-3-3 | **Given** the save fails, **then** an error toast shows and the error is rethrown. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | QR settlement card | F-1.1 – F-1.5 | ◐ / ● / ○ | Card works; QR is fixed-payee, USD and not payable in a UPI app. |
| F-2 | Wallet badges and Copy link | F-2.1 – F-2.3 | ● / ○ | Badges and copy work; standalone dialog unmounted. |
| F-3 | I Have Paid and ledger update | F-3.1 – F-3.9 | ◐ / ● / ○ | Records paid on a tap with no proof; unknown ids create an invoice. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Pay with a QR that carries the exact amount | F-1 |
| 2 | Patient | Copy the payment link when scanning is awkward | F-2 |
| 3 | Patient | See the invoice paid at once | F-3 |
| 4 | Billing Specialist | Trust that kiosk payments are real | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor at the kiosk | Open any invoice card, copy the link, mark an invoice paid | Nothing. No proof of payment is asked |
| Billing Specialist (Daniel) | See the QR Code payment on the Invoices page | Nothing is checked |

The old PRD said the invoice flips to Paid after the kiosk reconciles the payment. Decision needed: D-63.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Balance due | QR card header | Invoice total minus amount paid, never below zero |
| Amount recorded | I Have Paid | The full balance at the moment of the tap |
| Receipt number | Confirmation | Built from invoice digits, default 1001. **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → **Billing** | I Have Paid | Records the full balance on a tap. An unknown invoice id creates a paid invoice for client CL-001. |
| | QR link | A fixed-payee INR link with USD amounts. No proof of money. Kiosk payment does not move the client's stage. |
| Patient portal ↔ Appointments / **Invoices** | Staff cancels a prepaid appointment | The invoice is voided even when paid, and the kiosk can still take payment on it. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-63 | May the kiosk mark an invoice Paid on a tap, and are void invoices excluded? | F-1.4, F-3.1, Section 4 |
| D-62 | Which gateway, currency and payee does the kiosk QR use, and is payment reconciled? | F-1.1, F-1.5, F-3.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
