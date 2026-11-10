---
title: "Patient Invoice Lookup & Outstanding Dues Breakdown"
product: "ai-receptionist"
module: "billing"
channel: "invoices"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | BILLING |
| Channel | INVOICES |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Invoice Ledger Synchronization | Invoices settled at the kiosk immediately reflect as 'Paid' in the Companion app billing ledger and update the practice revenue logs in Client. | [View in Companion](/companion/billing) |

## 1. Module Summary
- The Outstanding Dues PRD defines the kiosk billing lookup workflow. Patients enter their registered mobile number to retrieve outstanding consultation copays, lab diagnostic fees, and pharmacy charges prior to consultation or departure.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Phone-Based Invoice Discovery & Patient Billing History
#### 1. What it does
Permits patients to look up pending or past invoices using their verified phone number. Surfaces itemized clinical services, insurance adjustments, already paid deposits, and remaining balance due.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Phone Keypad Lookup | Keypad | High-contrast numeric dialpad for fast phone number entry with OTP safety check | Prevents unauthorized viewing |
| F-1.2: Unpaid Invoices List | Data List | Displays invoice cards with invoice number, consultation date, doctor, and balance amount | High-contrast balance badge |
| F-1.3: Itemized Fee Breakdown Drawer | Details View | Lists individual fee lines (e.g. 'Consultation Fee $75.00', 'CBC Blood Test $35.00') | Shows clear tax/copay rows |
| F-1.4: One-Tap Pay Now CTA | Action Button | Launches dynamic QR code payment modal for immediate settlement | Prominent green button |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient arrives for follow-up with $45 unpaid lab balance | Enters phone on kiosk billing screen | **Kiosk displays Invoice #INV-2026-089 for $45.00 with 'Pay Now' CTA** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | Before seeing my doctor, I want to review and pay my copay on the kiosk, so that I don't need to wait in line at billing. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Entering phone retrieves all unpaid invoices associated with the patient's client record. |
| F-1-2 | Fully paid invoices are marked with green 'Paid' checkmark and can print receipts. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Phone-Based Invoice Discovery & Patient Billing History | F-1.1, F-1.2, F-1.3, F-1.4 | Permits patients to look up pending or past invoices using their verified phone number. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Before seeing my doctor, I want to review and pay my copay on the kiosk, so that I don't need to wait in line at billing. | F-1 |
