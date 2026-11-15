---
title: "Billing Lookup & Invoice Ledger"
product: "ai-receptionist"
module: "billing"
channel: "invoices"
route: "/reception/billing"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | BILLING AND PAYMENTS: BILLING LOOKUP AND INVOICE LEDGER (`/reception/billing`) |
| Route | `/reception/billing` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A kiosk screen where a visitor enters a phone number and a code, sees a Patient Account banner and a list of invoice cards, and can start a QR payment or open a receipt. |
| **Who uses it** | Patient (a patient or a relative at the lobby kiosk). Front-desk Staff (create the invoices the kiosk lists). No role is checked: the kiosk has no sign-in. |
| **Where you start it** | The **Billing** tile on the kiosk home screen, **Billing** on the dock, or saying "Pay my bill". The address `/reception/billing` opens the phone keypad in Billing mode. |
| **Where the result goes** | The kiosk only reads invoices. Payment itself happens on the QR Pay page. |
| **How real is it** | 1 feature works, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Invoices) | Ledger read | The kiosk reads every invoice the Invoices page holds. It matches by client id, exact name or part of a phone number. With no match it lists every unpaid invoice in the system. Void invoices with a balance count as unpaid. | [View Invoices](/client/invoices) |
| Client (Appointments) | Invoice from a booking | An invoice made for an appointment may carry a placeholder client id that no kiosk patient has. It then shows only through the all-unpaid fallback. | [View Appointments](/client/appointments/list) |
| Client (Claims) | Insurance claims | Not connected. The kiosk shows patient balances only and no claim data. | [View Claims](/client/claims) |
| Client (Services) | Service names on cards | Each card lists the invoice's line descriptions. When none exist it says "Clinical Consultation & Reception Services". | [View Services](/client/services) |
| Client (Clients) | Phone lookup | The visitor's phone is matched to clients, including partial matches once 7 digits are typed. | [View Clients](/client/clients) |
| Client (Billing settings) | Invoice format | Not connected. Kiosk cards use a fixed dollar sign and no setting. | [View Billing Settings](/client/settings/billing) |
| Companion | Patient Bill | Companion lists the same invoices with the same wider matching and an invented-invoice fallback. | [View Companion Billing](/companion/billing) |
| Admin | Invoice templates | Not connected. Kiosk cards do not use an admin template. | [View Document Templates](/admin/document-templates) |

## 1. Module Summary

### The story in one minute

Sarah Johnson taps **Billing** on the kiosk. A phone keypad opens. She types her number and a four-digit code. Any number accepts 1234 or 0000. She sees a short loader, "Synchronizing invoices with MantraAssist...". Then the **Patient Account** banner shows her name, patient ID, full phone number and "1 Outstanding". Below it is the consultation invoice with services, issued and due dates, and a **Pay via QR** button. Daniel Brooks may not have posted a bill for her yet. If Sarah has no invoice at all, the kiosk does not say so. It shows every unpaid invoice in the clinic, with other patients' names and amounts. Meera Iyer at the front desk never sees it, because nothing is logged.

### What is real and what is not

- **Real in the prototype:** the phone gate, the zero-match message, the household picker, the loader, invoice cards with balance math, status badges, Pay via QR and View Receipt, All Bills Clear!, Sync with MA and Done.
- **Simulated:** the code check (any number accepts 1234 or 0000), the lookup scope (other patients' unpaid invoices leak) and the failure state (a load error looks like All Bills Clear!).
- **Not built:** masking of the phone number and ID on the public banner, and a load-error message that differs from All Bills Clear!.

### Journey position

```
Billing tile ─▶ Phone + code ─▶ Household picker ─▶ Invoice ledger ─▶ Pay via QR (see QR Pay page)
```

## 2. Feature Requests

### F-1: Phone gate and household picker

#### 1. What it does
Sarah opens Billing and the kiosk shows the phone keypad in Billing mode. She types a number and the code. If no client matches, she sees "No billing records found for this phone number." and stays on the keypad. One match opens the ledger. Several matches open **Select Patient Profile** with "Whose bill would you like to view?". A face match can also open billing.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Phone and code gate | Rule | No amount is shown until a phone number and a four-digit code are entered | ◐ Simulated | The code 1234 or 0000 works for any number, and nothing is sent (G11-E-03). Decision needed: D-46 |
| F-1.2: Phone lookup | Rule | Matches the number to clients, including part of a number once 7 digits are typed | ◐ Simulated | A few digits of another patient's number can return that patient (G11-E-04) |
| F-1.3: Zero-match message | State | Shows "No billing records found for this phone number." and stays on the keypad | ● Works | G11-I-100 |
| F-1.4: Household picker | Screen | Asks whose bill to view when several profiles share the number | ● Works | G11-I-101 |
| F-1.5: Face unlock | Rule | A face match can also open Billing | ◐ Simulated | The old PRD said phone only (G11-I-99). The match is a mock (G11-E-01). Decision needed: D-40 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah taps Billing | Types her number and the code 1234 | **The ledger opens for her profile** |
| 2 | A visitor types a number no client has | Types any code | **"No billing records found for this phone number." and the keypad stays** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I check a bill on a public screen, I want a phone check and a family picker, so that no one else sees my balance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** Billing is chosen, **when** any number and the code 1234 or 0000 are entered, **then** invoices are shown. |
| F-1-2 | **Given** no client matches the number, **then** the zero-match message shows and the keypad stays. |
| F-1-3 | **Given** several clients share the number, **then** the household picker opens before any invoice. |

### F-2: Ledger and Patient Account banner

#### 1. What it does
After the check, the kiosk loads invoices and shows the **Patient Account** banner, then one card per invoice. Each card shows the invoice number, the service lines, the issued and due dates, the balance due and a status. If the lookup finds nothing for the patient, it returns every unpaid invoice in the system.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Loader | State | Shows "Synchronizing invoices with MantraAssist..." while loading | ● Works | G11-I-103 |
| F-2.2: Invoice lookup scope | Rule | Matches by client id, exact name or partial phone | ◐ Simulated | With no match it returns every unpaid invoice in the system with names and amounts (G11-E-05). Decision needed: D-39 |
| F-2.3: Patient Account banner | Header | Shows name, patient ID, full phone number and "N Outstanding" | ◐ Simulated | Phone and ID are not masked on a public screen (G11-E-34). Decision needed: D-39 |
| F-2.4: Invoice cards | Card | Invoice number (the invoice id), service descriptions, issued and due dates | ● Works | G11-I-105 |
| F-2.5: Void invoices | Rule | A void invoice with a balance is listed as unpaid and can be paid | ◐ Simulated | XM-06. Decision needed: D-63 |
| F-2.6: Load failure | State | A failed load shows an empty list | ◐ Simulated | It reads as **All Bills Clear!** and Aria says there are no outstanding bills (G11-E-19) |
| F-2.7: Outstanding count | Metric | Counts invoices whose status is not paid | ● Works | |
| F-2.8: Masked phone and patient ID | Rule | Described nowhere in the old PRD | ○ Not built | Decision needed: D-39 |
| F-2.9: Separate load-error message | State | A message that tells a failed load from an empty ledger | ○ Not built | See F-2.6 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah has one open invoice | Finishes the phone check | **The banner reads "1 Outstanding" and the invoice card shows its services and dates** |
| 2 | A patient has no invoice | Finishes the phone check | **The ledger lists every unpaid invoice in the clinic, with other patients' names** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | Before I pay, I want to check the invoice number, services and count against my name, so that I pay the right bill. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** invoices match the patient, **then** the banner shows the full phone and ID and the cards show the matching invoices. |
| F-2-2 | **Given** no invoice matches the patient, **then** every unpaid invoice in the system is listed. |
| F-2-3 | **Given** an invoice load fails, **then** the screen shows All Bills Clear!. |

### F-3: Balance, status and row actions

#### 1. What it does
Each card works out the balance as the total minus what was paid, never below zero. An unpaid or partly paid card shows an amber **Pending Payment** badge, the balance and **Pay via QR**. A paid card shows **Paid & Settled** and **View Receipt**. Saying "pay" or "checkout" opens the first unpaid invoice.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Balance math | Metric | Balance due is total minus paid, with a Paid / Total line when part is paid | ● Works | G11-I-106. The dollar sign is fixed. Decision needed: D-62 |
| F-3.2: Status badges | Badge | **Pending Payment** or **Paid & Settled** | ● Works | |
| F-3.3: Pay via QR and View Receipt | Buttons | Opens the QR card for unpaid rows or the settled card for paid rows | ● Works | |
| F-3.4: Voice pay | Voice | "Pay", "QR" or "checkout" opens the first unpaid invoice | ● Works | G11-I-111. Not in the old PRD |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A 200 invoice has 50 paid | Looks at the card | **Balance Due 150, a Paid 50 / 200 line, Pending Payment and Pay via QR** |
| 2 | Last week's invoice is paid | Looks at its card | **Paid & Settled and View Receipt** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I paid a deposit, I want to see it credited and pay only what remains, so that I am not charged twice. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an invoice of 200 with 50 paid, **then** the card shows Balance Due 150, Paid 50 / 200 and Pay via QR. |
| F-3-2 | **Given** a fully paid invoice, **then** the card shows Paid & Settled and View Receipt, not Pay via QR. |

### F-4: All Bills Clear!, Sync with MA and footer actions

#### 1. What it does
When the list is empty, a card says **All Bills Clear!**. The footer has **Sync with MA**, **Done / Return Home** and **Different Patient**. Different Patient returns to the phone keypad.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: All Bills Clear! | State | Shows when no invoices are listed | ● Works | Also shown after a load failure (F-2.6) |
| F-4.2: Sync with MA | Button | Reloads the invoices and shows "Invoices refreshed from MantraAssist" | ● Works | The toast shows at once, before the reload ends (G11-I-109) |
| F-4.3: Done / Return Home | Button | Clears the billing session and returns home | ● Works | |
| F-4.4: Different Patient | Button | Clears the patient and returns to the keypad | ◐ Simulated | The previous phone, code and invoice list stay in memory and the number still shows on the keypad (G11-E-11) |
| F-4.5: Session wipe | Rule | The 60-second reset should clear invoices, the selected invoice and the QR | ◐ Simulated | It does not clear all of them (G11-E-10) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Daniel posts a new invoice while Sarah is at the kiosk | Sarah taps **Sync with MA** | **A toast shows and the new invoice appears** |
| 2 | Sarah's daughter wants to check her own bill | Taps **Different Patient** | **The keypad opens, but the earlier number is still on it** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | After I check one relative's bills, I want to refresh or switch to another number cleanly, so that the next person does not see mine. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** Sync with MA is pressed, **then** invoices reload and the toast shows. |
| F-4-2 | **Given** Different Patient is pressed, **then** the keypad opens with the previous number still entered. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Phone gate and household picker | F-1.1 – F-1.5 | ◐ / ● | Gate is a demo: any number takes the code; partial phone matches. |
| F-2 | Ledger and Patient Account banner | F-2.1 – F-2.9 | ● / ◐ / ○ | Cards work; lookup leaks others' invoices; failure looks like all clear. |
| F-3 | Balance, status and row actions | F-3.1 – F-3.4 | ● Works | Balance math and buttons work. |
| F-4 | All Bills Clear!, Sync and footer | F-4.1 – F-4.5 | ● / ◐ | Sync and Done work; Different Patient keeps data. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Keep my balance private on a public screen | F-1 |
| 2 | Patient | Check the invoice before I pay | F-2 |
| 3 | Patient | Pay only what remains after a deposit | F-3 |
| 4 | Patient | Refresh or switch patient cleanly | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor at the kiosk | Enter any number with the code 1234 or 0000, see invoices, start a payment | Nothing. The kiosk routes sit outside sign-in |
| Front-desk Staff (Meera), Billing Specialist (Daniel) | Create the invoices the kiosk lists, on the Invoices page | Nothing is checked |

The old PRD said the screen opens only after verified phone and code and shows the verified patient's invoices. Decision needed: D-46.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Balance due | Invoice card | Invoice total minus amount paid, never below zero |
| Outstanding count | Patient Account banner | Count of invoices whose status is not paid |
| Paid / Total line | Invoice card | Amount paid over invoice total, shown when part is paid |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → **Billing** | Visitor opens Billing, phone gate passed | Matches by client id, exact name or partial phone. With no match it lists every unpaid invoice. Void invoices count as unpaid. A face match can also open Billing. |
| | Appointment created an invoice | The invoice may carry a placeholder client id that no kiosk patient has, so it shows only through the all-unpaid fallback. |
| Patient portal ↔ Appointments / **Invoices** | Staff cancels a prepaid appointment | The invoice is voided even when paid. The kiosk still lists a void invoice with a balance as payable. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-46 | What is the visitor authentication model: real code delivery, limits and lockout? | F-1.1, Section 4 |
| D-39 | Which details may appear on screen or be spoken in a public lobby, and who may see which invoices? | F-2.2, F-2.3 |
| D-40 | May a face match unlock Billing? | F-1.5 |
| D-62 | Which currency and payment rails apply on the kiosk? | F-3.1 |
| D-63 | Are void invoices excluded from payment, and what counts as Paid? | F-2.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
