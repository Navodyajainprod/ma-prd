---
title: "Touchless UPI QR Checkout & Reconciliation"
product: "ai-receptionist"
module: "billing"
channel: "qr-pay"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Billing & Payments - Touchless QR Checkout (`/reception/billing`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Real-Time Payment Reconciliation | Settling via kiosk QR records the payment immediately in Client Invoices marked as QR Code payment (`Paid via AI Receptionist QR Kiosk`), flipping front-desk ledgers to Paid automatically. | [View in Client](/client/invoices) |
| Client | Billing Merchant & Receipt Settings | Clinic payee identity and invoice numbering rules from Client Billing Settings shape every generated QR payment link. | [View in Client](/client/settings/billing) |
| Client | Reception Deployment Link | Associates lobby kiosk payment activity cleanly alongside Reception kiosk hardware configuration. | [View in Client](/client/settings/reception) |
| Client | Client Account Financial Timeline | Updates the patient's balance and settled invoice history inside their Client profile. | [View in Client](/client/clients) |
| Companion | Instant Paid Receipt Sync | Invoices paid via kiosk QR immediately appear as settled inside the patient's mobile Companion Billing view. | [View in Companion](/companion/billing) |
| Companion | Visit & Appointment Continuity | Keeps consultation charges and paid visit receipts aligned with the patient's Companion Appointments view. | [View in Companion](/companion/appointments) |

## 1. Module Summary
- The **Touchless UPI QR Checkout & Reconciliation** channel turns the lobby kiosk into a contactless mobile payment counter whenever a patient selects **Pay via QR** (or **View Receipt**) from the invoice ledger.
- Opening directly inside the **Touchless QR Settlement** card, the kiosk generates a scannable payment QR pre-filled with clinic merchant details, invoice reference, and exact remaining USD (`$`) balance, highlights supported payment apps, enables 1-tap payment link copying, reconciles payment straight into MantraAssist's live billing engine, and celebrates completion visually and aloud.

## 2. Feature Requests

### F-1: Dynamic **Touchless QR Settlement** Card & Settled Receipt Overlay
#### 1. What it does
Selecting **Pay via QR** on any unpaid invoice (or **View Receipt** on a paid bill) opens the focused **Touchless QR Settlement** checkout card showing:
- **Status & Invoice Header:** Displays **Touchless QR Settlement** badge paired with live status pill (**Payment Pending** in amber vs **Paid & Reconciled** in emerald), Invoice Number, Patient Name, Due Date, and right-aligned **Balance Due** / **Total Settled** in **`$`** USD (alongside paid vs total amounts whenever prior deposits exist).
- **Scannable Contactless QR Code:** Generates a sharp high-contrast QR matrix encoding the clinic merchant payee (`MantraCare Health`), exact remaining USD balance due, and invoice reference number so any smartphone payment app pre-fills everything cleanly on scan.
- **Digital Receipt Lock Overlay:** When viewing an already-paid bill (or right after checkout completes), an emerald **Settled & Paid • MantraAssist Synced** stamp covers the QR code so nobody can accidentally pay the same invoice twice.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Pre-Filled QR Matrix | Payment Generator | Encodes clinic payee, exact remaining `$` balance, `USD` currency, and invoice `#ID` into QR | Eliminates manual amount entry errors |
| F-1.2: Pending vs Reconciled Header | Summary Strip | Highlights Invoice `#`, Patient Name, Due Date, and remaining Balance Due / Total Settled | Clear at standing reading distance |
| F-1.3: **Settled & Paid** Overlay Stamp | Double-Pay Prevention | Masks the QR image with **Settled & Paid / MantraAssist Synced** once settled | Doubles cleanly as **View Receipt** confirmation |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient taps **Pay via QR** on `#INV-2041` with `$150.00` remaining | Opens Touchless QR Settlement card | **Displays `#INV-2041`, `Payment Pending`, `$150.00` Balance Due, and scannable QR pre-filled for `$150.00`** |
| 2 | Patient opens an old paid invoice via **View Receipt** | Clicks View Receipt row action | **Displays `Paid & Reconciled`, `Total Settled`, and overlays `Settled & Paid • MantraAssist Synced` over QR** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient at Kiosk | When paying my clinic balance by phone, I want a scannable QR code that pre-fills the exact amount and invoice number automatically, so that I make zero typos. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given an unpaid invoice with remaining balance `$150.00`, then **Touchless QR Settlement** MUST display `$150.00` Balance Due and generate a QR encoding that exact `$150.00` amount and invoice number. |
| F-1-2 | Given an invoice is already paid or just settled, then **Paid & Reconciled** and the **Settled & Paid / MantraAssist Synced** overlay MUST cover the QR square. |

---

### F-2: Accepted Wallet Badges & One-Tap **Copy Payment Link**
#### 1. What it does
Inside the **Instant Mobile Checkout** panel right beside the QR frame, visitors immediately see supported payment app badges — **GPay**, **PhonePe**, **Paytm**, **BHIM UPI**, **Apple Pay**, and **Banking Apps** — reassuring them their preferred app works. For companions paying from another device or staff-assisted tablet checkouts where pointing a camera at glass isn't convenient, a **Copy Payment Link** button copies the full payment link to the clipboard, temporarily flipping its label to **URI Copied** alongside a confirmation toast (`"Payment URI copied to clipboard"`). (Standalone checkout dialogs similarly provide **Copy UPI Link** / **Copied**.)

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Supported Wallet Strip | Compatibility Chips | Displays **GPay**, **PhonePe**, **Paytm**, **BHIM UPI**, **Apple Pay**, and **Banking Apps** | Builds confidence prior to scanning |
| F-2.2: **Copy Payment Link** Action | Clipboard Helper | Copies generated UPI link directly and toggles confirmation state (**URI Copied**) | Useful for remote family payers or tablet demos |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Caregiver paying remotely needs link sent over message | Taps **Copy Payment Link** | **Clipboard stores payment URI, button changes to `URI Copied`, and toast confirms copy** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient / Caregiver | I want to verify at a glance that my mobile payment app is accepted, or copy the exact payment link cleanly if scanning is awkward. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given **Instant Mobile Checkout** renders, then **GPay**, **PhonePe**, **Paytm**, **BHIM UPI**, **Apple Pay**, **Banking Apps**, and **Copy Payment Link** MUST be visible. |

---

### F-3: Instant Ledger Settlement, Celebration & Navigation Back to Bills
#### 1. What it does
Confirming settlement via **I Have Paid • Settle Invoice Now** (or **Confirm & Record Payment ($...)** in the standalone modal) completes the transaction atomically across clinic records:
1. Prevents duplicate submissions while settlement saves, recording method **QR Code** with standardized accounting memo **`"Paid via AI Receptionist QR Kiosk"`**.
2. Fires a celebratory multi-color confetti burst while Aria's halo turns **Verified Green** and she speaks thank-you confirmation (`"Thank you! Your payment of $X.XX has been recorded and synchronized with MantraAssist."`).
3. Updates the card immediately to **Paid & Reconciled** / `$0.00` due and refreshes the underlying billing ledger automatically.
4. Offers bottom controls **Back to All Bills** (returning to the refreshed invoice list) and **Return Home** (wiping session cleanly to the ambient lobby screen).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Atomic Ledger Sync | Accounting Write | Credits payment as `QR Code` with note `"Paid via AI Receptionist QR Kiosk"` | Immediately visible on Client Billing desk |
| F-3.2: Submitting Lock | Duplicate Protection | Disables settlement button during save to block accidental double-recording | Prevents duplicate receipt entries |
| F-3.3: Confetti & Spoken Receipt Cue | Multimodal Confirmation | Launches celebratory visual burst, green Aria state, and toast confirmation | Clear reassurance without paper printers |
| F-3.4: **Back to All Bills** & **Return Home** | Exit Actions | Lets payer settle another bill cleanly or end their session securely | Standalone modal also offers Cancel |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient pays `#INV-2041` (`$150.00`) via mobile wallet | Taps **I Have Paid • Settle Invoice Now** | **Confetti bursts, card flips to `Paid & Reconciled`, Aria speaks thank-you confirmation, and tapping `Back to All Bills` shows `Paid & Settled`** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Clinic Accountant & Patient | When a patient pays by QR at the lobby kiosk, I want the invoice marked Paid immediately across desk and mobile views with clear confirmation and zero paper bottleneck. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given **I Have Paid • Settle Invoice Now** is confirmed, then the invoice balance MUST drop to `$0.00`, payment method MUST record as QR Code (`"Paid via AI Receptionist QR Kiosk"`), celebratory confirmation MUST appear, and **Back to All Bills** MUST display the updated **Paid & Settled** state. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Dynamic QR Settlement & Receipt Stamp | F-1.1 to F-1.3 | Builds USD QR codes for exact unpaid balance and locks paid items with a Settled overlay. |
| F-2 | Wallet Compatibility & Copy Link | F-2.1 to F-2.2 | Shows 6 supported mobile payment badges and copies UPI checkout links in one tap. |
| F-3 | Atomic Reconciliation & Celebration | F-3.1 to F-3.4 | Syncs QR settlements straight to MantraAssist billing with confetti, spoken confirmation, and ledger return. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient Paying Balance | Scan a pre-filled QR code with my preferred app, confirm settlement immediately, and leave knowing desk records are updated. | F-1, F-2, F-3 |
| 2 | Billing Desk Team | Reconcile self-service lobby QR payments effortlessly inside the central clinic invoice ledger. | F-3 |
