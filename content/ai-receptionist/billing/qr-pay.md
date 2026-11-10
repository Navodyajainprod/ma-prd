---
title: "Dynamic QR Code Payment & Instant Settlement"
product: "ai-receptionist"
module: "billing"
channel: "qr-pay"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | BILLING |
| Channel | QR-PAY |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Payment Ledger Entry & Receipt Generation | Successful QR checkout logs an audited transaction in Client > Invoices, updates invoice status to 'Paid', and sends an SMS receipt to patient. | [View in Client](/client/invoices) |

## 1. Module Summary
- The Dynamic QR Checkout PRD defines the contactless kiosk payment modal. Generates dynamic UPI, Apple Pay, and debit/credit QR codes on screen, listens for webhook payment confirmation, celebrates successful payment with confetti, and prints thermal receipts.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Dynamic UPI / Contactless Payment QR Modal
#### 1. What it does
Generates an encrypted dynamic QR code representing the exact invoice balance. Patients scan the code with any UPI or mobile banking app (GPay, PhonePe, Paytm, Banking Apps). Listens for payment webhook and completes transaction without touching hardware. To confirm: What is the UPI payment webhook timeout before the kiosk prompts the patient to visit the physical billing counter?

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: High-Resolution QR Canvas | Canvas Code | Dynamically rendered QR code encoded with merchant VPA, invoice ID, and amount | Scannable from 1 meter away |
| F-1.2: Payment Amount & Merchant Header | Header Card | Displays Practice Name, Invoice Number, and exact charge in bold currency | Clear verified trust seal |
| F-1.3: Real-Time Polling & Webhook Listener | Status Listener | Detects bank payment settlement within 1.5 seconds and triggers success state | Zero button press needed |
| F-1.4: Payment Success Animation & Confetti | Animation | Celebratory confetti burst, checkmark confirmation, and auto-dismiss timer | Positive patient experience |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient taps 'Pay Now' on $50 consultation fee | Modal generates dynamic QR code on screen | **Patient scans with phone, enters UPI PIN; kiosk plays success chime and prints receipt** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | I want to pay my medical bill using my smartphone camera, so that I can settle dues quickly without handling plastic cards or cash. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Upon payment webhook confirmation, invoice status updates to 'Paid' instantly. |
| F-1-2 | Kiosk prints thermal receipt and displays confirmation screen for 10 seconds. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Dynamic UPI / Contactless Payment QR Modal | F-1.1, F-1.2, F-1.3, F-1.4 | Generates an encrypted dynamic QR code representing the exact invoice balance. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | I want to pay my medical bill using my smartphone camera, so that I can settle dues quickly without handling plastic cards or cash. | F-1 |
