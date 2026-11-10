---
title: "Invoices, Patient Billing Ledger & POS Checkout"
product: "client"
module: "invoices"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | INVOICES |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Invoice & Payment Portal Sync | Invoices generated in the Client billing ledger appear immediately in the patient's Companion portal with a 'Pay Now' button for self-service payment. | [View in Companion](/companion/billing) |

## 1. Module Summary
- The Invoices & Billing module manages practice revenue: generating itemized patient invoices, tracking payment statuses (Paid, Pending, Overdue, Void), collecting copays via credit card or UPI, and dispatching digital payment links.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Patient Invoicing Ledger & Payment Status Tracker
#### 1. What it does
Displays all clinic invoices with sortable columns: Invoice Number, Patient Name, Issue Date, Due Date, Total Amount, Balance Due, and Status (Draft, Pending, Paid, Overdue, Cancelled).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Status Filter Tabs | Tabs | Filters invoices by All, Pending Payment, Paid, and Overdue | Shows outstanding dollar sums |
| F-1.2: Generate Invoice Modal | Modal | Selects patient, adds line items from services catalog, applies discounts/taxes, and sets due date | Calculates subtotal and total |
| F-1.3: Download PDF Receipt | Button | Generates branded PDF invoice with clinic logo, patient address, and line item details | One-click download |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Front desk creates invoice for consultation and blood test | Selects Sarah Johnson, adds 'Office Visit ($150)' and 'CBC Panel ($45)' | **System generates Invoice #INV-1049 for $195 and prompts payment collect** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Billing Specialist | When a visit is completed, I want to create an itemized invoice, so that the patient receives an accurate record of clinical charges. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Creating an invoice calculates line items, taxes, and balance due accurately and assigns a sequential invoice ID. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Patient Invoicing Ledger & Payment Status Tracker | F-1.1, F-1.2, F-1.3 | Displays all clinic invoices with sortable columns: Invoice Number, Patient Name, Issue Date, Due Date, Total Amount, Balance Due, and Status (Draft, Pending, Paid, Overdue, Cancelled). |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Billing Specialist | When a visit is completed, I want to create an itemized invoice, so that the patient receives an accurate record of clinical charges. | F-1 |
