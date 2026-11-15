---
title: "Invoices, Patient Billing Ledger & POS Checkout"
product: "client"
module: "invoices"
route: "/invoices"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | INVOICES |
| Route | `/invoices` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A billing page with a List view and a Kanban board of invoices, four headline figures, a Create Invoice drawer, an invoice detail drawer, a printable invoice document and a Record Payment drawer. |
| **Who uses it** | Billing Specialist (creates, chases and records). Front-desk Staff (record payments). No role is checked: any signed-in user can do everything, including void and write-off. |
| **Where you start it** | **Invoice** in the sidebar (`/invoices`), the **Invoices** tab on a client profile, an appointment booked with the invoice option, a prepaid booking in the patient portal, or the kiosk **I Have Paid** button. |
| **Where the result goes** | The invoice ledger, the client's Documents (an invoice document), the patient portal Bill and Pay screens, the kiosk billing screen and invoice events for Workflows. Nothing reaches Claims. |
| **How real is it** | 0 features work, 5 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Bill and Pay | The patient portal reads the same invoices at `/patient/bill` and records a QR payment at `/patient/pay`. The payment is self-declared and lands on the invoice. When no invoice matches the patient, the portal lists other patients' unpaid invoices and can save an invented invoice. | [View Companion Billing](/companion/billing) |
| Companion | Prepaid booking | A prepaid portal booking asks the appointment service to create the invoice first, with a placeholder line and the default tax. The portal then records its own amount as the payment, so total and paid differ. | [View Companion Appointments](/companion/appointments) |
| AI Receptionist | Kiosk invoice lookup | The kiosk lists unpaid invoices for the visitor. With no match it lists every unpaid invoice in the system, and void invoices with a balance count as unpaid. | [View Kiosk Invoices](/ai-receptionist/billing/invoices) |
| AI Receptionist | Kiosk QR pay | The kiosk **I Have Paid** button records a full-balance payment with the note "Paid via AI Receptionist QR Kiosk". There is no proof of money. | [View Kiosk QR Pay](/ai-receptionist/billing/qr-pay) |
| Client (Appointments) | Appointment to invoice | Booking an appointment with the invoice option on, or with an appointment-to-invoice rule present, creates one invoice for that appointment. The price, tax and client fall back to placeholders. | [View Appointments](/client/appointments/list) |
| Client (Clients) | Invoices tab | The client profile has an Invoices tab to create, view and record payments. | [View Clients](/client/clients) |
| Client (Scribe) | Fill with AI | From the invoice drawer, Scribe fills notes, diagnosis and chief complaint as text. No billable lines are produced and the invoice record does not change. | [View Scribe](/client/scribe) |
| Client (Claims) | Invoice to claim | Not connected. The claim builder that would read invoices is not mounted. An insurance payment keeps the payer and claim reference as free text and updates no claim. | [View Claims](/client/claims) |
| Client (Services) | Catalogue lines | Invoice lines are picked from the product catalogue. The picker also offers inactive items and built-in sample services. | [View Services](/client/services) |
| Client (Workflows) | Invoice stages and events | Stages come from the invoice workflow. Created, sent, paid, partly paid, overdue and voided events are emitted for automations. The workflow gear opens the workflow. | [View Workflows](/client/workflows) |

## 1. Module Summary

### The story in one minute

Daniel Brooks opens **Invoice** on Monday morning. Four figures sit on top: Total Invoiced, Outstanding, Paid This Month and Overdue Count. He switches to the Kanban board and sees Sarah Johnson's consultation invoice in the Overdue column. He opens it and reads the stage ribbon, the line items and the payments. Sarah calls to pay by card. Daniel presses **Record Payment**, picks Sarah and sees her open invoices with the balance already filled in. He chooses a method, adds a receipt number and saves. The invoice moves to Paid and the balance reads zero. Sarah then sees the same invoice in her portal. He prints the invoice document for her records.

**Naming note:** the sidebar and page say "Invoice" and "Client". The earlier PRD said "Invoices", "Patient" and used the statuses Pending and Cancelled. The prototype uses Sent, Viewed, Partial, Paid, Overdue, Void and Draft. Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the List and Kanban views, the headline figures (with wrong inputs on two of them), creating and editing a draft invoice, the lock on editing Paid or Void invoices, the overdue rule, recording payments with partial payment, overpayment and client credit, the printable invoice document, and export.
- **Simulated:** invoice numbers can repeat, the drawer preview and saved totals use different formulas, Save and Send only flips a status, edits in the detail drawer are not saved, the activity feed and a payment row can be invented, a write-off is stored as cash, and invoices created from appointments or portal bookings use placeholder lines.
- **Not built:** sortable columns, tabs with dollar sums, discount entry at creation, a PDF download, the clinic logo on the document, roles and approval for money actions, and any link from an invoice to a claim.

### Journey position

```
Appointment ─▶ Invoice created ─▶ Stage / edit ─▶ Record payment ─┬▶ Portal Bill and Pay
                                                                  ├▶ Kiosk QR pay
                                                                  └▶ Claim (not connected)
```

## 2. Feature Requests

### F-1: Invoice ledger (List and Kanban)

#### 1. What it does
Daniel opens `/invoices` and sees four headline figures. Below them are the preset chips **All**, **Paid**, **Overdue** and **Draft** with counts, a search box and a **List** and **Kanban** toggle. The list shows one row per invoice with a clickable stage bar. The board has one column per stage with a count and a subtotal. Daniel drags a card to move an invoice. A row menu holds **Add Payment**, **View Document**, **Edit** and **Delete / Void**. This page is not the organisation's own subscription billing: `/payments` and `/transactions` belong to Client Settings. Decision needed: D-05.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Headline figures | KPI | Total Invoiced, Outstanding, Paid This Month, Overdue Count | ◐ Simulated | Total Invoiced counts drafts and voids. Paid This Month has no month filter (G7-E-17). Decision needed: D-67 |
| F-1.2: Presets and search | Chips, search | All, Paid, Overdue, Draft with counts, and a search box | ● Works | |
| F-1.3: List view | Table | Invoice ID, Title, Stage, Client, Amount, Balance, Due Date, Created, Last Activity, Responsible | ● Works | Balance is 0 when paid or void. Responsible reads "Automated Flow" for system-created invoices |
| F-1.4: Kanban view | Board | One column per stage with count and subtotal. Dropping on Overdue is refused. Dropping on a sent column sends via WhatsApp | ◐ Simulated | A drop on Paid records the full balance as cash and a drop on Void voids, both with no confirmation (G7-E-23). Decision needed: D-63 |
| F-1.5: Stage bar | Control | Click a segment to move the invoice to that stage | ◐ Simulated | None of the Kanban guards apply. Paid can be set with no payment and Overdue can be set by hand (G7-I-12, G7-E-21). Decision needed: D-63 |
| F-1.6: Edit lock | Rule | Paid and Void invoices cannot be edited and a message says so | ● Works | |
| F-1.7: Delete / Void | Row action | A Draft is removed. Any other invoice is voided and kept | ◐ Simulated | No confirmation (G7-E-23). The voided invoice keeps showing its old stage because no default Void stage exists (G7-E-22). Decision needed: D-15 |
| F-1.8: Overdue rule | Rule | When the app starts, unpaid, non-void invoices past their due date move to Overdue | ● Works | Runs at app start only |
| F-1.9: Status and stage model | Rule | Seven statuses (draft, sent, viewed, partial, paid, overdue, void) beside stages from the invoice workflow. Default stages are Draft, Payment recorded, Paid, Overdue | ◐ Simulated | The help modal lists six different stages (G7-E-24). Decision needed: D-68 |
| F-1.10: Export | Modal | Opens an export modal with date range, status filter and a choice of fields | ◐ Simulated | File download not re-checked in code (unverified) |
| F-1.11: Empty state | State | List: "No invoices found matching your filters." Kanban column: "No invoices". Stage bar: "Please build the automation first" when no stage matches | ● Works | |
| F-1.12: Loading and error states | State | None exist | ○ Not built | All data is browser-local, so nothing loads or fails |
| F-1.13: Sortable columns, Issue Date, Status column | Table | Described in the earlier PRD | ○ Not built | The list has no sorting and no Issue Date column (G7-I-01) |
| F-1.14: Tabs All, Pending Payment, Paid, Overdue with dollar sums | Tabs | Described in the earlier PRD | ○ Not built | The chips show counts, not dollar sums (G7-I-02) |
| F-1.15: Role control | Rule | Any signed-in user can move, void and delete | ○ Not built | Decision needed: D-15 |

#### 3. Worked example
Daniel checks what is late.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah's invoice passed its due date last week | Opens **Invoice** and presses the **Overdue** chip | **Only overdue invoices are listed and the Overdue Count figure shows the same number** |
| 2 | He wants a board view | Switches to **Kanban** and drags Sarah's card to a Void column | **The invoice is voided at once with no confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Billing Specialist | When chasing payments, I want to see outstanding and overdue invoices at a glance, so that I know who to follow up. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** an invoice is unpaid and not void, **when** its due date has passed and the app starts, **then** it moves to the Overdue stage. |
| F-1-2 | **Given** an invoice is Paid or Void, **when** the user chooses Edit, **then** a message says it cannot be edited. |
| F-1-3 | **Given** a Kanban card is dropped on Overdue, **then** the move is refused. Clicking Overdue on the stage bar is allowed. |
| F-1-4 | **Given** a non-draft invoice, **when** the user chooses Delete / Void, **then** it is voided at once with no confirmation. |
| F-1-5 | **Given** no invoice matches, **then** the empty message is shown. |

### F-2: Create and edit an invoice

#### 1. What it does
Daniel presses **Create Invoice** and a drawer titled "Create Standalone Invoice" opens. The first client and the first catalogue item are already filled in. The issue date is today, the due date is 14 days out and the payment mode is Bank Transfer. He picks Sarah, edits the line items and watches the subtotal and tax change. He presses **Save as Draft** or **Save & Send Invoice**. A toast names the new invoice and the drawer closes. No payment prompt follows.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Create Invoice drawer | Drawer | Client selector, Client Detail section, Product section. Edit reuses the same drawer | ● Works | Prefills the first client and first catalogue item |
| F-2.2: Client Detail | Section | Name, email, phone, invoice number, issue date, due date, payment mode | ◐ Simulated | The invoice number shown is a random `INV-######` and differs from the number saved (G7-E-07) |
| F-2.3: Line items | Table | Product from the catalogue, quantity, price, tax percent | ◐ Simulated | The picker lists inactive items and built-in sample services (G7-E-05) |
| F-2.4: Totals preview | Calculation | Subtotal, tax and total update on each line change | ◐ Simulated | The preview taxes undiscounted lines but the saved invoice spreads discount first (G7-E-08). A line with no tax rate gets 8 percent (G7-E-09). Decision needed: D-69 |
| F-2.5: Save as Draft | Button | Saves the invoice as a draft, toasts "Invoice <id> generated!" and closes | ● Works | |
| F-2.6: Save & Send Invoice | Button | Saves the invoice and flips its status to sent | ◐ Simulated | No channel, no sent time, no stage change and nothing is sent (G7-E-15) |
| F-2.7: Validation | State | A client and at least one line item are required | ● Works | |
| F-2.8: Invoice numbering | Rule | The number is `INV-CL-` plus 1050 plus the count of stored invoices | ◐ Simulated | Deleting a draft makes the next number repeat an existing one (G7-E-06). Decision needed: D-70 |
| F-2.9: Automation gate | Rule | A banner says "Automated Invoicing is locked" when no invoice automation exists | ◐ Simulated | The check passes whenever the default invoice process exists, which is always (G7-E-20). Decision needed: D-72 |
| F-2.10: Discount entry at creation | Field | Described in the earlier PRD | ○ Not built | The field is deliberately excluded from the create drawer. Decision needed: D-69 |
| F-2.11: Payment prompt after creation | Step | Described in the earlier PRD worked example | ○ Not built | The drawer only closes (G7-I-41) |
| F-2.12: Sequential, never reused numbers | Rule | Described in the earlier PRD | ○ Not built | See F-2.8 |

#### 3. Worked example
Daniel bills Sarah for a follow-up.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer opens with the first client | Selects **Sarah Johnson** and keeps the prefilled line | **The preview shows subtotal, tax and total** |
| 2 | He is happy with it | Presses **Save as Draft** | **A toast names the invoice and the drawer closes. The invoice is in Draft** |
| 3 | He had deleted a draft earlier | Creates another invoice | **The new invoice can take a number that another invoice already has** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Billing Specialist | When a visit is completed, I want to create an itemised invoice from the catalogue, so that the patient receives an accurate record of charges. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the drawer opens, **then** the first client and first catalogue item are filled, the due date is 14 days out and the payment mode is Bank Transfer. |
| F-2-2 | **Given** no client or no line item, **when** the user saves, **then** a validation message appears and nothing is saved. |
| F-2-3 | **Given** a saved invoice, **then** its number is 1050 plus the number of stored invoices, not the number shown in the drawer. |
| F-2-4 | **Given** Save & Send Invoice is pressed, **then** the status becomes sent. No message is sent and the stage is unchanged. |
| F-2-5 | **Given** the drawer, **then** there is no discount field. |

### F-3: Invoice detail, document and sending

#### 1. What it does
Daniel clicks an invoice ID and a drawer opens with a stage ribbon and three tabs: **Overview**, **Documents** and **Payments**. Overview has editable sections and an activity feed. Payments shows four cards (Total, Paid, Balance, Client Credit) and a payments table. **View Document** opens a printable "Official Invoice". Daniel prints it for Sarah.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Stage ribbon | Chevrons | Click a stage to move the invoice | ◐ Simulated | Same unguarded behaviour as the stage bar (G7-I-12) |
| F-3.2: Editable details | Sections | Due date, payment mode, line items and discount can be edited | ◐ Simulated | Edits go to a per-invoice browser store. The invoice record and totals never change (G7-E-11). Decision needed: D-71 |
| F-3.3: Subtotal and tax on Overview | Display | Shown from the record, or from the total when not stored | ◐ Simulated | Falls back to total times 0.95 and 0.05. Hardcoded, formula undefined (G7-E-12) |
| F-3.4: Activity feed | Timeline | Lists recorded events | ◐ Simulated | When history is empty it writes four invented events (G7-E-13) |
| F-3.5: Payment cards | Cards | Total, Amount Paid, Balance Due, Client Credit | ● Works | |
| F-3.6: Payments table | Table | One row per recorded payment | ◐ Simulated | An invoice marked Paid with no payment shows an invented completed row (G7-E-14) |
| F-3.7: Documents tab and client document | Document | An invoice document record is added to the client's Documents | ● Works | |
| F-3.8: View Document and Print | Modal | Printable "Official Invoice" with Bill To, lines, subtotal, discount, tax, total, amount paid. Print opens the browser print dialog | ● Works | The letterhead is hard-coded "MantraAssist RCM" |
| F-3.9: Send via WhatsApp (document) | Button | Marks the invoice sent | ◐ Simulated | Delivery is unverified and the sent time is not stored |
| F-3.10: Payment link | Text | A shareable link on Overview | ◐ Simulated | The link is a mock URL |
| F-3.11: Send by email, SMS or WhatsApp, Void, Copy link | Buttons | The handlers exist but no control uses them | ○ Not built | (G7-E-16) |
| F-3.12: Fill with AI (Scribe) | Action | Scribe fills notes, diagnosis and chief complaint | ◐ Simulated | Kept as per-invoice browser fields. No billable lines are produced and totals do not change (G7-E-11, G3-E-29). Decision needed: D-76 |
| F-3.13: PDF download and clinic logo | Document | Described in the earlier PRD | ○ Not built | Print only. The organisation logo is not used (G7-I-38) |

#### 3. Worked example
Sarah asks for a copy of her bill.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Invoice is open | Presses **View Document**, then **Print** | **The browser print dialog opens with the invoice sheet** |
| 2 | Daniel changes the due date on Overview | Edits and leaves | **The new date is shown in the drawer. The invoice record keeps the old date** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Billing Specialist | When a client asks about a bill, I want one place with the stage, documents and payments, so that I can answer at once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the Payments tab, **then** Balance Due equals the total minus the amount paid. |
| F-3-2 | **Given** View Document, **when** Print is pressed, **then** the browser print dialog opens. No PDF file is produced. |
| F-3-3 | **Given** an edit on Overview, **when** it is saved, **then** the invoice record and totals are unchanged. |
| F-3-4 | **Given** an invoice with no history, **when** the drawer opens, **then** four events are written that never happened. |

### F-4: Record a payment

#### 1. What it does
Daniel presses **Record Payment**. He picks Sarah and her open invoices appear with each amount set to its balance. If she has no open invoice the drawer switches to **Unlinked Advance Payment** and credits her account. He picks Self-pay, Insurance or Write-off, a method, a date and a receipt number, then saves. The invoice becomes Paid, or Partial when the amount is smaller than the total.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Entry points | Button | The toolbar, a row or card **Add Payment**, or the detail Payments tab | ● Works | The toolbar entry has no client preselected |
| F-4.2: Invoice allocation | Table | Lists the client's open invoices with amounts defaulting to each balance | ● Works | |
| F-4.3: Unlinked Advance Payment | State | With no open invoice, a deposit (default 100) is credited to the client | ● Works | |
| F-4.4: Payment type | Choice | Self-pay, Insurance (payer and claim reference), Write-off (reason list) | ◐ Simulated | Insurance keeps free text and updates no claim (G7-I-39). Decision needed: D-76 |
| F-4.5: Write-off | Choice | Records a write-off | ◐ Simulated | Stored as a cash payment, so it counts as cash received and marks the invoice Paid (G7-E-18). Decision needed: D-66 |
| F-4.6: Method, date, receipt | Fields | Cash, card on file, check (number), external terminal (auth code), bank transfer. Receipt number is auto `REC-xxxxx`. File upload and note | ● Works | There is no UPI on the staff side (G7-I-18) |
| F-4.7: Client credit | Rule | Apply credit to reduce the amount. An overpayment adds the excess to credit | ● Works | |
| F-4.8: Paid or Partial | Rule | A payment at or above the total sets Paid with a paid date. A smaller one sets Partial | ● Works | |
| F-4.9: One record per payment | Rule | Each payment should create one record | ◐ Simulated | Two write paths may duplicate or overwrite rows. Engineering has not confirmed (G7-E-19) |
| F-4.10: Send link | Mode | Sends a payment link by WhatsApp instead of recording | ◐ Simulated | Delivery is unverified |
| F-4.11: Validation | State | At least one invoice (or unlinked mode) and an amount above 0, except for a write-off | ● Works | |
| F-4.12: Card or UPI collection | Payment | Described in the earlier PRD | ○ Not built | The drawer records a payment. It charges nothing |
| F-4.13: Role and approval | Rule | Any signed-in user can record, write off and mark paid | ○ Not built | Decision needed: D-15 |

#### 3. Worked example
Sarah pays more than she owes.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah owes less than 100 and pays 100 cash | Enters **100** and saves | **The invoice is Paid and the excess is added to her client credit** |
| 2 | An invoice has a smaller payment | Enters part of the balance | **The invoice shows Partial** |
| 3 | A balance is not collectable | Chooses **Write-off** | **The invoice shows Paid and the amount is stored as cash received** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-desk Staff | When a client pays, I want to apply the payment to the right invoices and keep any extra as credit, so that the ledger is correct. |
| F-4-J2 | Billing Specialist | When a balance cannot be collected, I want to write it off and report it as a write-off, so that revenue is not overstated. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a payment at or above the total, **then** the invoice is Paid and the excess goes to client credit. |
| F-4-2 | **Given** a payment below the total, **then** the invoice is Partial. |
| F-4-3 | **Given** no invoice is selected and unlinked mode is off, **when** the user saves, **then** a validation message appears. |
| F-4-4 | **Given** Write-off, **when** it is saved, **then** it is stored as a cash payment and the invoice is Paid. |

### F-5: Hand-offs into and out of invoices

#### 1. What it does
Invoices arrive from several places. A booking can create one. A patient who prepays in the portal gets one. Sarah pays through the portal or the kiosk and the payment lands on the same invoice. Nothing flows from an invoice to a claim.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Appointment to invoice | Hand-off | Creates one invoice per appointment when the invoice option is on or an appointment-to-invoice rule exists | ◐ Simulated | Price falls back to 150, client to "c-1" and tax to 8 percent (G7-I-33, G7-E-09, G6-E-21) |
| F-5.2: Prepaid portal booking | Hand-off | The appointment service creates the invoice first with a placeholder line and no tax rate. The portal then records its own amount as paid | ◐ Simulated | Total is 162 whatever the service costs, so the invoice ends Partial or over-paid with no credit or refund (G7-E-10, XM-03). Decision needed: D-69 |
| F-5.3: Portal Bill and Pay | Hand-off | The portal lists the invoices and records a QR payment on the chosen one | ◐ Simulated | No match lists other patients' unpaid invoices and can save an invented invoice. Payment is self-declared (G12-E-18, G12-E-19) |
| F-5.4: Kiosk QR pay | Hand-off | I Have Paid records the full balance as "Paid via AI Receptionist QR Kiosk" | ◐ Simulated | Unknown ids create a paid invoice for CL-001. No proof of money (G11-E-16, G11-E-17). Decision needed: D-63 |
| F-5.5: Void invoices excluded from payment | Rule | The payment service does not refuse a void invoice | ○ Not built | A void invoice with a balance stays payable and turns Paid (XM-06). Decision needed: D-63 |
| F-5.6: Client profile Invoices tab | Tab | Create, view and record payment for that client | ● Works | |
| F-5.7: Invoice events | Event | Created, sent, paid, partly paid, overdue, voided and stage-entered events are emitted. The workflow gear opens the workflow | ● Works | What runs on them belongs to Workflows |
| F-5.8: Invoice to claim | Hand-off | A claim builder that would read invoice data exists in code | ○ Not built | The builder is not mounted on any page. The Create Claim button opens an empty form (G7-C-28). Decision needed: D-76 |

#### 3. Worked example
Sarah books and prepays in the portal.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah books a prepaid service | Confirms the booking | **An invoice appears with a placeholder line and a total that does not match her payment** |
| 2 | Daniel opens Invoice | Looks at the invoice | **It shows Partial or Paid with an over-payment** |
| 3 | Sarah later cancels at the desk | Staff cancels the appointment | **The invoice is voided even though it is paid, and no refund is recorded** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Billing Specialist | After a visit is booked, I want the invoice created with the right lines and price, so that I do not retype it. |
| F-5-J2 | Patient | When I owe a bill, I want to see and pay it from my phone, so that I do not queue at the desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** a prepaid portal booking, **then** the invoice total is built from the placeholder line and default tax and may not equal the amount the portal records as paid. |
| F-5-2 | **Given** a void invoice with a balance, **when** the kiosk or portal pays it, **then** the payment is accepted. |
| F-5-3 | **Given** an invoice, **when** the user looks for a claim, **then** no claim is created or updated. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Invoice ledger | F-1.1 – F-1.15 | ● / ◐ / ○ | List and Kanban work; unguarded moves and two wrong figures. |
| F-2 | Create and edit invoice | F-2.1 – F-2.12 | ● / ◐ / ○ | Drawer works; numbering, totals and Save and Send are unsound. |
| F-3 | Detail, document and sending | F-3.1 – F-3.13 | ● / ◐ / ○ | Print works; edits are not saved and feed can be invented. |
| F-4 | Record a payment | F-4.1 – F-4.13 | ● / ◐ / ○ | Allocation and credit work; write-off is stored as cash. |
| F-5 | Hand-offs | F-5.1 – F-5.8 | ◐ / ○ / ● | Placeholder lines on auto invoices; no link to claims. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Billing Specialist | See outstanding and overdue invoices at a glance | F-1 |
| 2 | Billing Specialist | Create an itemised invoice from the catalogue | F-2 |
| 3 | Billing Specialist | Answer a client's bill question from one place | F-3 |
| 4 | Front-desk Staff | Apply a payment to the right invoices and keep credit | F-4 |
| 5 | Billing Specialist | Write off an uncollectable balance and report it as such | F-4 |
| 6 | Billing Specialist | Get the invoice created with the right lines after booking | F-5 |
| 7 | Patient | See and pay a bill from my phone | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Create, edit, send, void and delete invoices, drag to Paid, record payments, write off, export | Editing Paid or Void invoices. A Kanban drop on Overdue |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |
| Kiosk visitor and portal patient | Pay an invoice by QR on a tap | Nothing further. Payment is not confirmed |

The earlier PRD names the Billing Specialist and front desk as users and says nothing about void, write-off or payment roles. Decision needed: D-15.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Total Invoiced (and count) | Headline figure | Sum of totals of all invoices, including drafts and voids. Decision needed: D-67 |
| Outstanding (and count) | Headline figure | Sum of (total minus paid) for invoices that are sent, viewed, partial or overdue |
| Paid This Month (and count) | Headline figure | Sum of amount paid across all invoices with any payment. No month filter, so the label is wrong (G7-E-17) |
| Overdue Count | Headline figure | Count of overdue invoices |
| Preset counts | Chips | Count by status |
| Column subtotal | Kanban header | Sum of totals of invoices in the column |
| Balance | List | Total minus paid, 0 if paid or void |
| Total, Amount Paid, Balance Due, Client Credit | Detail Payments tab | Invoice total, amount paid, total minus paid, client credit balance |
| Saved totals | Invoice record | Subtotal is the sum of quantity times price minus line discount. Discount is spread across lines. Tax is the sum of the discounted line times its tax percent, default 8 percent. Total is subtotal minus discount plus tax, rounded to cents |
| Drawer preview totals | Create drawer | Tax on the undiscounted amount. Differs from saved totals when a discount exists (G7-E-08) |
| Subtotal and tax on Overview | Detail Overview | Total times 0.95 and total times 0.05 when not stored. **Hardcoded, formula undefined** |
| Amount to pay | Record Payment footer | Sum of entered amounts minus applied credit, credit capped at the subtotal |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Call → Receptionist → Appointment → Scribe → **Invoice** → Claim | Appointment to Invoice | Creates one invoice with placeholder price, client and tax. Number is 1050 plus the count. |
| | Scribe to Invoice | Text only, kept as per-invoice browser fields. No billable lines. |
| | Invoice to Claim | Not connected. The claim is typed by hand and the builder is not mounted. |
| | Insurance payment on an invoice | Free text payer and claim reference. The claim is not updated. |
| Kiosk check-in → Appointment → **Billing** | Kiosk invoice lookup | Matches by client id, exact name or phone. With no match it lists every unpaid invoice. Void invoices count as unpaid. |
| | I Have Paid | Records the full balance on a tap. An unknown id creates a paid invoice for CL-001. |
| Patient portal ↔ Appointments / **Invoices** | Prepaid booking | The appointment service creates the invoice first with a placeholder line. The portal records its own amount as paid, so total and paid differ. |
| | Staff cancels a prepaid appointment | The invoice is voided even when paid. A void invoice stays payable. |
| | Bill and Pay | The portal lists invoices, falling back to others' unpaid invoices and an invented invoice. Payment is self-declared. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical: Invoice or Invoices, Client or Patient, and are Pending and Cancelled real statuses? | Naming note |
| D-05 | Are `/payments` and `/transactions` kept, retired or linked from navigation? | F-1 |
| D-15 | Which roles may void invoices, write off, record payments and move to Paid? | F-1.7, F-1.15, F-4.13 |
| D-63 | Can an invoice become Paid with no recorded payment, should a Kanban drop on Paid open Record Payment, and may the kiosk mark Paid on a tap? | F-1.4, F-1.5, F-5.4, F-5.5 |
| D-66 | How are write-offs stored and reported (not as cash), and do they need approval? | F-4.5 |
| D-67 | Which statuses count toward Total Invoiced, Outstanding and Paid This Month (payment date in the calendar month)? | F-1.1 |
| D-68 | What is the status vocabulary, its mapping to stages, and is a Void stage seeded by default? | F-1.9 |
| D-69 | What tax applies to a line with no rate, and where is discount entered, as amount or percent, before tax? | F-2.4, F-2.10, F-5.2 |
| D-70 | What is the invoice number format and is numbering per organisation? | F-2.8 |
| D-71 | Which invoice fields stay editable after Sent? | F-3.2 |
| D-72 | Should invoice creation be gated by an invoice automation? | F-2.9 |
| D-76 | Should claims be built from invoices, should insurance payments update claims, and what may Scribe push to invoices? | F-3.12, F-4.4, F-5.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
