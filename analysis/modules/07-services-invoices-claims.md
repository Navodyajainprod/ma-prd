# G7 — Products & Services · Invoices · Claims — Gap Analysis
_Sources:_ PRD files `content/client/services.md`, `content/client/invoices.md`, `content/client/claims.md` (cross-refs verified only in `content/ai-receptionist/billing/invoices.md`, `content/ai-receptionist/billing/qr-pay.md`, `content/companion/billing.md`, `content/client/settings/reception.md`, `content/client/settings/team.md`, `content/client/settings/organization.md`) | Prototype routes `/services`, `/invoices`, `/claims` (+ `/payments`, `/transactions` checked) — `src/app/pages/Services.tsx`, `Invoices.tsx`, `Claims.tsx`, `Payments.tsx`, `Transactions.tsx`; `src/app/components/services/**`, `components/invoices/**`, `components/claims/**`; `src/lib/servicesStore.ts`, `invoiceService.ts`, `claimsStore.ts`, `useProcessStore.ts`; `src/app/context/InvoiceContext.tsx`; `src/app/types/invoiceTypes.ts` | Analysed 2026-11-12

> Reading notes
> - All prototype data is browser-local mock storage. There is no server, so "loading" and "network error" states do not exist anywhere in this group; each table only has an empty state.
> - Citations are `file:line` relative to `E:\mantra-assist\src\` unless stated. PRD citations are `file § section`.
> - `/payments` and `/transactions` are **not** client invoicing. They are the organisation's own subscription / credit-wallet billing (plans, seats, credit usage). `/payments` is not linked from any navigation (reachable by URL only). `/transactions` is reachable only from the Settings sub-navigation under "Billing" (`app/components/settings/SettingsSubnav.tsx:100`). Both use hard-coded demo data (`app/pages/Payments.tsx:158-167`, `app/pages/Transactions.tsx:10-24`). They belong to the Settings/Billing agent and are not scored here. The `components/billing/WorkspaceBilling*` tabs are the same org-subscription domain and are also out of scope.

## Status summary
_Template v2. "Prototype defects" = C rows whose status is Prototype defect; each one points to section E, which lists all 33 defects (some C rows cover more than one)._

| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Products & Services (`/services`, G7-S) | 2 | 6 | 12 | 2 | 1 | 2 | 22.7% |
| Invoices / Payments (`/invoices`, G7-I) | 2 | 8 | 20 | 5 | 1 | 6 | 17.1% |
| Insurance & Claims (`/claims`, G7-C) | 1 | 7 | 14 | 1 | 5 | 6 | 19.6% |
| `/payments`, `/transactions` (org subscription billing) | — | — | — | — | — | — | Not scored (Settings/Billing agent) |
| **G7 total** | **5** | **21** | **46** | **5** | **7** | **14** | **20.1%** |

**Overall coverage: 20.1% · PRD-backed coverage: 20.1%.** All three scored sub-modules have a PRD file, so the two figures are the same.

Coverage % = (Matches + 0.5×Partial) ÷ (Matches + Partial + Missing + Contradicts). PRD-only and Prototype defect rows are excluded.

Defects by severity (section E, 33 total): **Critical 2 · High 16 · Medium 9 · Low 6**.

Headline: all three PRDs are one-feature stubs (one F-1 each, ~60 lines). The prototype is much richer: Kanban, a payments drawer, client credit, CMS-1500, availability/prepaid and workflow stages. Most findings are therefore "Missing in PRD". The few specific PRD claims are mostly contradicted, not built, or broken in the prototype: unique service code, active toggle, sequential invoice ID, discounts, payer ID, claim scrubber and NPI blocking.

## Route map
| Route(s) | Nav entry | Page file | PRD file |
| :--- | :--- | :--- | :--- |
| `/services` | "Product & Services" (`app/config/navigation.ts:117-121`) | `app/pages/Services.tsx` (+ `components/services/ServiceDrawer.tsx`) | `content/client/services.md` |
| `/invoices` | "Invoice" (`app/config/navigation.ts:123-127`) | `app/pages/Invoices.tsx` (+ `components/invoices/**`) | `content/client/invoices.md` |
| `/claims` | "Insurance & Claims" (`app/config/navigation.ts:129-133`) | `app/pages/Claims.tsx` (+ `components/claims/**`) | `content/client/claims.md` |
| `/payments` | none (URL only) | `app/pages/Payments.tsx` (org plans/seats/cards) | none in G7 (org billing → `content/client/settings/billing.md`, other agent) |
| `/transactions` | Settings sub-nav › Billing › Transactions (`app/components/settings/SettingsSubnav.tsx:100`) | `app/pages/Transactions.tsx` (credit usage) | none in G7 (other agent) |
| `/patient/bill`, `/patient/pay` (cross-ref only) | Patient portal | `app/pages/patient/PatientBillScreen.tsx`, `PatientPaymentScreen.tsx` | `content/companion/billing.md` (cross-ref only) |
Routes are defined at `app/routes.tsx:247-251, 266, 170-171`.

---

## A. Product map — as built

### A1 Products & Services
**Purpose.** A single catalogue of everything the practice sells — consultations, procedures, products — with price, tax, CPT code, and (optionally) booking rules such as slot length, locations, rooms, staff and upfront payment. The same catalogue feeds appointment booking, the patient booking portal, invoice line items, the AI Receptionist room directory and automation rules (`lib/servicesStore.ts:1-4`).

**Roles.** No role gating in prototype — any signed-in user can add, edit or delete catalogue items (no permission checks in `app/pages/Services.tsx` or `app/components/services/ServiceDrawer.tsx`). Nav label "Product & Services" under REVENUE & INSIGHTS (`app/config/navigation.ts:117-121`); route `/services` (`app/routes.tsx:266`). A separate admin catalogue exists at `/admin/services` (`app/routes.tsx:305-308`) — another agent's scope.

**Screens.**
- Catalogue list page titled "Product / Services" with search, category quick-filters, Export and "Add Product" (`app/pages/Services.tsx:390-463`).
- Table columns: Product / Service (with "Appointment" and "Prepaid" badges), CPT / Code, Category, Duration, Price, Tax, Responsible, Created, Activity (`app/pages/Services.tsx:487-624`). No Status column.
- Add / Edit side drawer ("Add New Product" / "Product Details") with two tabs: **Overview** (Service Details: name, category, CPT code, description; Pricing: price, tax; plus any custom fields/sections) and **Availability** (only visible when "Available for appointment" is ticked) (`app/components/services/ServiceDrawer.tsx:127-138, 539-590, 1159-1179`).
- Export modal (`app/pages/Services.tsx:466-483`); "How it works" help modal (`app/pages/Services.tsx:681-693`).

**Flows.**
1. *Browse/search.* User opens Product & Services; table shows all items, 20 per page. Typing searches name, description, category and CPT code (`app/pages/Services.tsx:267-273`). Quick-filter chips show "All Services" plus the first four categories, each with a live count (`app/pages/Services.tsx:408-429`). Empty result shows "No products or services found matching your filters." (`app/pages/Services.tsx:650`). No sorting.
2. *Add item.* User clicks Add Product → drawer opens on Overview with defaults (category General, price 0, tax 0) (`app/components/services/ServiceDrawer.tsx:298-332`). User enters name, category, CPT code, description, price, tax %.
3. *Make it bookable (optional).* User ticks "Available for appointment" in the drawer footer (`ServiceDrawer.tsx:1109-1127`) → Availability tab appears with: slot duration (common to all locations) (`:616-645`); "Require Upfront Payment (Prepaid)" with Full amount or Fixed deposit (`:663-790`); one or more location rules, each with seats, room number, room label, directions and assigned users (blank = available to all staff) (`:800-1105`).
4. *Save.* Validation: name required ("Service name is required"); if bookable, at least one location ("Please add at least one location in Availability") (`ServiceDrawer.tsx:388-398`). Item saved, toast "<name> added/updated", rooms synced to the AI Receptionist rooms list (`:479, 531`).
5. *Edit.* Click row or name → same drawer in edit mode, pre-filled (`app/pages/Services.tsx:329-333, 648`; `ServiceDrawer.tsx:227-297`).
6. *Delete.* Row menu → Delete. Immediate hard delete, no confirmation (`app/pages/Services.tsx:335-340, 632-637`).
7. *Activate / deactivate.* **Not available in the UI.** A toggle handler exists but is not wired to any control (`app/pages/Services.tsx:342-348`), the active flag is hidden from the drawer (`ServiceDrawer.tsx:189-201`), and every save forces the item back to active (`ServiceDrawer.tsx:465, 491, 516`). The help text still promises "Toggle items active/inactive" (`app/pages/Services.tsx:690`).
8. *Export.* Export modal with name, category, price, duration, CPT, description, tax, colour (`app/pages/Services.tsx:466-483`).
- States: empty state handled; no loading/error (local data); validation errors shown as toasts only (no inline field errors).

**Business rules.**
- IDs: next number = highest existing ID + 1 (`lib/servicesStore.ts:155-161`).
- Categories: default Consultation, Dental, Diagnostics, Treatment, Surgical, General plus any stored custom categories (`app/pages/Services.tsx:38-55`).
- Currency always saved as USD, despite a 10-currency list in the store (`ServiceDrawer.tsx:463, 489, 514`; `lib/servicesStore.ts:55-66`).
- Duration = slot duration from Availability; if the item is not bookable, duration silently stays 30 min (`ServiceDrawer.tsx:447`).
- Prepaid deposit: Full = item price; Deposit = entered amount (min 0); prepaid only kept when bookable (`ServiceDrawer.tsx:448-451, 467-469`).
- Seats per location minimum 1 (`ServiceDrawer.tsx:409`).
- No unique CPT/code check.

**KPIs/metrics.**
| Metric | Where | How calculated | Citation |
| :--- | :--- | :--- | :--- |
| All Services count | Quick-filter chip | Count of all catalogue items | `app/pages/Services.tsx:412` |
| Per-category count | Quick-filter chips (first 4 categories) | Count of items whose category equals the chip | `app/pages/Services.tsx:422` |

**Cross-module references.**
- Appointments (staff drawer) list only items that are active **and** "Available for appointment" (`app/components/appointments/ScheduleAppointmentDrawer.tsx:504-507`).
- Patient booking portal uses the same filter and charges price/deposit + service tax for prepaid items (`app/pages/patient/PatientBookingScreen.tsx:94-97, 259-274`).
- Invoices: line-item picker lists **all** catalogue items (including inactive) plus extra built-in mock services not in the catalogue (`app/components/fields/useCrmBindOptions.ts:50-61`; `app/components/invoices/CreateInvoiceDrawer.tsx:179`).
- AI Receptionist: service rooms synced into the rooms list (`ServiceDrawer.tsx:479, 531` → `lib/roomsStore.ts:280`); kiosk reads the catalogue (`reception/lib/api/mockMaClient.ts:872-941`).
- Settings › Team: adding a team member can assign them to services (`app/pages/Settings.tsx:4037`).
- Client profile: products can be assigned per client; automation rules can read them (`lib/servicesStore.ts:184-221`; `lib/ruleEngine.ts:13`; `app/pages/ClientProfile.tsx:1163`).
- Process cards and step parameters read the catalogue (`app/components/process/ProcessProductsServicesCard.tsx:22`; `app/components/process/StepParametersFields.tsx:168`).

### A2 Invoices, Payments, Transactions
**Purpose.** Client-side billing: create itemised invoices (manually or automatically from appointments), move them through a configurable billing workflow, record payments / deposits / write-offs, keep client credit, and produce a printable document. Nav label "Invoice" (`app/config/navigation.ts:123-127`); route `/invoices` (`app/routes.tsx:248`).

**Roles.** No role gating in prototype. "Responsible" column shows "Automated Flow" for system-created invoices, else the creator label (`app/pages/Invoices.tsx:642-650`).

**Screens.**
- Invoices page with 4 KPI capsules, an "Automated Invoicing is locked" banner (only when no invoice automation exists), List / Kanban toggle, search, presets, Record Payment, Create Invoice, Export and workflow gear (`app/pages/Invoices.tsx:327-459`).
- List columns: Invoice ID, Title (`<Client>_Invoice_<date>`), Stage (clickable stage bar), Client, Amount, Balance, Due Date, Created, Last Activity, Responsible (`app/pages/Invoices.tsx:495-652`). Row menu: Add Payment, View Document, Edit, Delete / Void (`:654-683`).
- Kanban: one column per workflow stage with count and subtotal; drag-and-drop cards (`app/pages/Invoices.tsx:700-966`).
- "Create Standalone Invoice" / "Edit Invoice" drawer: client selector, Client Detail section (name, email, phone, invoice number, issue date, due date, payment mode), Product section (line-item table: product from catalogue, quantity, price, tax %) (`app/components/invoices/CreateInvoiceDrawer.tsx:29-58, 396-521`).
- Invoice detail drawer: title + ID, stage ribbon, tabs **Overview** (editable sections incl. shareable payment link + activity feed), **Documents**, **Payments** (Total, Paid, Balance, Client Credit cards + payments table) (`app/components/invoices/InvoiceDetailDrawer.tsx:76-116, 740-1063`).
- Invoice Document modal: printable "Official Invoice" with Print and Send via WhatsApp (`app/components/invoices/InvoiceDocumentModal.tsx:79-248`).
- Record Payment drawer (`app/components/invoices/RecordPaymentModal.tsx:341+`).

**Flows.**
1. *Create invoice (manual).* Create Invoice → (automation gate check, see rules) → drawer pre-fills first client, first catalogue item (qty 1, its price and tax), issue date today, due date today+14, payment mode "Bank Transfer" (`CreateInvoiceDrawer.tsx:176-252`). User picks client, edits line items. Subtotal/tax preview recalculates on each line change (`:282-305`). **Save as Draft** or **Save & Send Invoice** (`:426-447`). Validation: client required, at least one line item (`:313-322`). Toast "Invoice <id> generated!" and drawer closes (`:390-393`). No payment prompt follows.
2. *Create invoice (automatic).* When an appointment is booked and an appointment-triggered "generate invoice" automation exists, an invoice is created once per appointment (`lib/appointmentService.ts:805-830`; idempotency `lib/invoiceService.ts:601-610`).
3. *Edit.* Edit from row/card menu; blocked for Paid or Void ("Paid or Void invoices can't be edited") (`app/pages/Invoices.tsx:234-243`).
4. *Delete / Void.* Draft → permanently deleted; any other status → voided "audit record preserved" (`app/pages/Invoices.tsx:245-255`). **No confirmation step** for either (see G7-E-23).
5. *Move stage.* Click a segment of the stage bar (list or card) or drag a Kanban card. Kanban drop rules: to Overdue → refused ("system-derived"); to a "sent" column → sends via WhatsApp; to Paid → records the full remaining balance as cash; to Void → voids; else simple stage move (`app/pages/Invoices.tsx:758-791`). Stage-bar clicks have none of these guards (`:280-288` → `lib/invoiceService.ts:958-1010`).
6. *View detail.* Click ID or client → detail drawer. Overview edits (due date, payment mode, line items, discount) are written to a per-invoice field store; they **do not update the invoice record** because the save call targets a function that does not exist on the invoice service (`InvoiceDetailDrawer.tsx:415-487`, call at `:484`). Activity feed: if the invoice has no history, the drawer writes four synthetic events (Invoice Created, Document Generated, Stage Updated, Payment Recorded) (`:591-681`).
7. *Fill with AI (Scribe).* From the activity panel, user can record/attach an AI Scribe consultation; billing codes become line items (default fee $120, 5% tax) (`InvoiceDetailDrawer.tsx:489-538, 1163-1181`) — field-store only, not the invoice record.
8. *View / print / send document.* View Document → printable sheet with hard-coded "MantraAssist RCM" letterhead, Bill To, line items, subtotal, discount, sales tax, total, amount paid; footer "Payment is due within 14 days" (`InvoiceDocumentModal.tsx:126-246`). Print uses the browser print dialog (`:27-29`). "Send via WhatsApp" marks the invoice sent (`:105-108`). A document record is also auto-generated into the client's documents (`lib/invoiceService.ts:354-446`; `InvoiceDetailDrawer.tsx:247-251`).
9. *Record payment.* From toolbar (no client pre-selected), row/card "Add Payment", or detail Payments tab (`app/pages/Invoices.tsx:426-443, 656-666`; `InvoiceDetailDrawer.tsx:971-980`). Drawer: pick client → lists that client's open invoices with amounts defaulting to each balance (`RecordPaymentModal.tsx:89-98, 150-192`). If the client has no open invoices the drawer switches to **Unlinked Advance Payment** (default $100) credited to the client's account (`:159-160, 255-279`). Payment type: Self-pay / Insurance (payer + claim ref) / Write-off (reason list) (`:41-47, 112, 292-317`). Method: cash, card on file, check (+check #), external terminal (+auth code), bank transfer; date; receipt # (auto `REC-xxxxx`) and file upload; note. "Apply client credit" reduces amount to pay (`:209-219`). Mode "Send link" sends via WhatsApp instead of recording (`:246-252`). Validation: at least one invoice (or unlinked mode); amount > 0 except write-off (`:240-285, 321-324`).
10. *Export.* Export modal with invoice number, client, email, status, total, paid, balance, due, created, paid date (`app/pages/Invoices.tsx:461-491`).
- States: list empty "No invoices found matching your filters." (`:694`); Kanban column "No invoices" (`:957-959`); stage bar "Please build the automation first" when no stage matches (`:544-556`); locked banner (`:359-369`); no loading/error states.

**Business rules.**
- **Statuses** (internal): draft, sent, viewed, partial, paid, overdue, void (`app/types/invoiceTypes.ts:1`). **Stages** (visible): from the invoice workflow process; default stages are Draft → Payment recorded → Paid → Overdue (`lib/useProcessStore.ts:526-625`). Required system categories: draft, paid, void (`lib/useProcessStore.ts:384`) — yet no default Void stage exists, so a voided invoice keeps showing its previous stage (`lib/invoiceService.ts:938-953`). The help modal still describes "6 invoice stages (Draft, Sent, Viewed, Paid, Overdue, Void)" (`app/pages/Invoices.tsx:1008`).
- **Totals (saved record):** subtotal = Σ(qty × unit price − line discount); invoice discount (amount or %) spread across lines in proportion to value; tax = Σ(discounted line × line tax %), defaulting to **8 %** if a line has no tax rate; total = (subtotal − discount) + tax, rounded to cents (`lib/invoiceService.ts:612-644`).
- **Totals (drawer preview):** tax = Σ(qty × price × tax %) on the undiscounted amount; total = subtotal − discount + tax (`CreateInvoiceDrawer.tsx:255-279`). The two formulas differ when a discount is present.
- **Discount entry:** hidden in the create drawer (excluded field) (`CreateInvoiceDrawer.tsx:60-69`); editable only in detail drawer, where it does not persist (see flow 6).
- **Numbering:** `INV-CL-<1050 + number of invoices currently stored>` (`lib/invoiceService.ts:646, 669`) — deleting a draft can cause the next invoice to reuse an existing number. The create drawer meanwhile displays a different random `INV-######` in the Invoice Number field (`CreateInvoiceDrawer.tsx:187`).
- **Due date** default +14 days (`lib/invoiceService.ts:691`); payment link is a mock URL (`:693`).
- **Overdue:** on app start, any invoice past its due date that is not paid/void is moved to the Overdue stage (`lib/invoiceService.ts:885-933`, triggered `app/context/InvoiceContext.tsx:332`).
- **Payments:** amount paid accumulates; ≥ total → Paid (+ paid date, Paid stage); otherwise Partial (`lib/invoiceService.ts:809-825`). Overpayment above balance → excess added to client credit (`app/context/InvoiceContext.tsx:586-595`). Unlinked payment → client credit (`:545-559`). Write-off is stored as a cash payment, so it marks the invoice Paid (`RecordPaymentModal.tsx:308`).
- **Payment recording path:** the drawer records through the invoice context *and* forwards each payment to the invoice service, which writes its own payment record (`app/context/InvoiceContext.tsx:536, 651-659`; `lib/invoiceService.ts:849-858`) — risk of duplicated or overwritten payment rows (needs engineering confirmation).
- **Manual "Paid" stage** via stage bar marks the invoice paid without any payment amount (`lib/invoiceService.ts:969-982`).
- **"Save & Send"** only flips the status to sent — no channel, no send timestamp, no stage change, no send event (`CreateInvoiceDrawer.tsx:382-384`).
- **Automation gate:** creating invoices requires an invoice automation, but the check returns true whenever the default invoice process exists, i.e. always (`lib/invoiceService.ts:69-75`).
- **Events** for automations: invoice.created / sent / paid / partially_paid / overdue / voided / stage.entered (`lib/invoiceService.ts:710, 750, 861-864, 921, 950, 999`).

**KPIs/metrics.**
| Metric | Where | How calculated | Citation |
| :--- | :--- | :--- | :--- |
| TOTAL INVOICED (+ "n inv") | KPI capsule | Sum of totals of **all** invoices, including drafts and voids; count of all invoices | `app/pages/Invoices.tsx:90, 339-341` |
| OUTSTANDING (+ "n due") | KPI capsule | Sum of (total − amount paid) for invoices in sent, viewed, partial or overdue; count of those | `app/pages/Invoices.tsx:91-93, 344-346` |
| PAID THIS MONTH (+ "n paid") | KPI capsule | Sum of amount paid (or total, if paid with no amount) across all invoices with any payment — **no month filter is applied**, so the label is wrong | `app/pages/Invoices.tsx:94-96, 349-351` |
| OVERDUE COUNT | KPI capsule | Count of invoices with status overdue; "Needs action"/"All clear" | `app/pages/Invoices.tsx:97, 354-356` |
| Preset counts | All / Paid / Overdue / Draft chips | Count by status | `app/pages/Invoices.tsx:387-412` |
| Column subtotal | Kanban column header | Sum of totals of invoices in the column | `app/pages/Invoices.tsx:742, 808` |
| Balance | List column | Total − paid; 0 if paid or void | `app/pages/Invoices.tsx:602` |
| Total / Amount Paid / Balance Due / Client Credit | Detail › Payments tab | Invoice total; amount paid (or total if marked paid); total − paid; client credit balance | `InvoiceDetailDrawer.tsx:931-956` |
| Subtotal / Tax (detail Overview) | Detail › Overview | If not stored, subtotal falls back to total × 0.95 and tax to total × 0.05 — **hardcoded – formula undefined** | `InvoiceDetailDrawer.tsx:407-408` |
| Amount to pay | Record Payment footer | Σ entered amounts − applied credit (credit capped at subtotal) | `RecordPaymentModal.tsx:210-219` |

**Cross-module references.**
- Appointments → invoice (automation, idempotent) (`lib/appointmentService.ts:805-830`; `lib/ruleEngine.ts:630, 725`).
- Patient portal prepaid booking → invoice + payment (`app/pages/patient/PatientBookingScreen.tsx:708-745`). The line item carries no tax rate, so the invoice applies the 8 % default while the patient paid price + service tax → invoice can end "Partial" (`lib/invoiceService.ts:640`).
- Companion / patient portal `/patient/bill`, `/patient/pay` read the same invoices and record QR payments (`app/routes.tsx:170-171`; `app/pages/patient/PatientPaymentScreen.tsx:38-60, 150`).
- AI Receptionist kiosk QR pay → records payment "Paid via AI Receptionist QR Kiosk" (`reception/avatar/AvatarReceptionView.tsx:2137`; `reception/lib/api/mockMaClient.ts:1806-1808`).
- AI Scribe → invoice line items (`InvoiceDetailDrawer.tsx:489-538`).
- Client profile Invoices tab (create, view, record payment) (`app/pages/ClientProfile.tsx:2354, 3422-3700`).
- Client documents (auto invoice document) (`lib/invoiceService.ts:354-446`).
- Process / Automation (workflow gear, stage moves, events) (`app/pages/Invoices.tsx:451-457`; `lib/invoiceService.ts:958-1010`).
- Claims: none. Insurance payments capture payer and claim reference as free text only (`RecordPaymentModal.tsx:292-314`).

### A3 Insurance & Claims
**Purpose.** Prepare professional insurance claims (CMS-1500 / 837P), submit them electronically (simulated clearinghouse) or on paper, and track them through an insurance workflow. Nav label "Insurance & Claims" (`app/config/navigation.ts:129-133`); route `/claims` (`app/routes.tsx:249`).

**Roles.** No role gating in prototype.

**Screens.**
- Claims page: search, status presets, payer filter, process selector (when >1 insurance process), Create Claim, Export, workflow gear (`app/pages/Claims.tsx:255-459`).
- Table columns: Claim ID, Title (`<Patient>_Claim_<date>`), Stages (clickable bar), Client, Insurance Payer, Service Date, Billed Amount (`app/pages/Claims.tsx:494-607`). Row menu: Edit Claim, Submit / View Status, View CMS-1500 Form (`:609-631`).
- Claim detail / create drawer: stage ribbon, tabs **Overview** (Claim Details; Patient & Policy Information; Billing & Diagnosis; plus custom fields/sections; activity feed), **Documents**, **CPT & Diagnoses** (financial cards, service-line table, diagnosis list, clearinghouse block) (`app/components/claims/ClaimDetailDrawer.tsx:75-124, 668-1055`).
- Submit modal (Electronic Clearinghouse vs Manual CMS-1500) (`app/components/claims/ClaimSubmissionModal.tsx`).
- Clearinghouse Status modal (`app/components/claims/ClaimStatusModal.tsx`).
- CMS-1500 form modal (Print, Export JSON) (`app/components/claims/CMS1500Modal.tsx`).

**Flows.**
1. *Browse.* Five seeded claims load on first visit (`lib/claimsStore.ts:111-371, 383-387`). Search matches claim #, patient, payer name/ID, ICD-10 code/description, CPT code/description (`app/pages/Claims.tsx:177-191`). Presets: All, Ready to Submit, Submitted & Review, Paid Claims, Drafts (`:269-320`). Empty: "No insurance claims found matching your filters." (`:642`).
2. *Create claim.* Create Claim → drawer in create mode with new number `CLM-<year>-<4 random digits>`, service date today, place of service "11 - Office", type "Professional (CMS-1500 / 837P)" (`ClaimDetailDrawer.tsx:126-162, 323-344`). User fills patient, DOB, phone, email, payer name, policy #, group #, diagnosis codes (comma-separated), procedure codes (comma-separated), provider NPI, prior auth, allowed and paid amounts. **Save as Draft** or **Create Claim** (= Ready to Submit) (`:1036-1052`). No required fields: blank patient saves as "Unnamed Client", blank payer as "Self-Pay / Commercial", payer ID always "PAY-001" (`:569-597`).
3. *Edit existing.* Row "Edit Claim" or click patient → drawer. Field edits are kept as per-claim overrides only; the "save changes" routine is not connected to any button, so the claim record itself (and the table) does not change (`ClaimDetailDrawer.tsx:378-395, 624-653`).
4. *Advance stage.* Click a stage in the table bar or drawer ribbon. Status is inferred from the stage name — with **two different rule sets** (table vs drawer) (`app/pages/Claims.tsx:135-161`; `lib/claimsStore.ts:467-497`).
5. *Submit.* Row "Submit / View Status" on Draft or Ready to Submit → modal with a "Pre-Flight Submission Checklist" (always shows green ticks — no actual checks) (`ClaimSubmissionModal.tsx:213-238`) and two options: **Submit Electronically** (1.2 s simulated call, always succeeds, sets Submitted + tracking ID, batch ID, EDI control #) (`:44-58`; `lib/claimsStore.ts:434-465`) or **Submit & Print CMS-1500** (sets Submitted, opens CMS-1500) / **Preview only** (`:60-77, 325-339`). Error message shown if the call fails (only possible if the claim vanished) (`:53-55, 206-211`).
6. *View status.* For submitted/accepted/paid claims, row action opens the Clearinghouse Status modal with tracking/batch/EDI numbers (falling back to fixed demo numbers if missing) and financial summary; rejection reason only for status "Rejected" (`ClaimStatusModal.tsx:32-41, 115-130`).
7. *CMS-1500.* View printable CMS-1500 (02/12) form; Print (browser) or Export JSON of the claim (`CMS1500Modal.tsx:17-29, 75-90`).
8. *Export.* Claims export with claim #, patient, payer, policy, service date, billed, status, CPT, ICD-10 (`app/pages/Claims.tsx:462-490`).
9. *Delete.* Not available in UI (store function exists, unused) (`lib/claimsStore.ts:417-426`).
- Activity feed: if a claim has no history, the drawer writes synthetic entries including "Real-time 270/271 Eligibility Verified" (`ClaimDetailDrawer.tsx:455-517`).

**Business rules.**
- Statuses: Draft, Ready to Submit, Submitted, Accepted, Under Review, Paid, Denied, Rejected (`lib/claimsStore.ts:3-11`).
- Stages: from the **insurance** workflow process — Draft & Intake → Coverage Verified → Submitted (837P) → Under Review → Paid & Settled / Denied (`lib/useProcessStore.ts:757-776`). A separate "Claims Management" process for entity *claim* (Draft, Submitted, In Review, Paid, Denied) is defined but not used by this page (`lib/useProcessStore.ts:779-796`).
- Stage → status (table): name contains paid → Paid; accept/verified → Accepted; submit → Submitted; review → Under Review; ready/pending → Ready to Submit; reject/fail/denied → Rejected; draft → Draft (`app/pages/Claims.tsx:141-149`).
- Stage → status (drawer): paid/settled → Paid; denied/reject/failed → Denied; submit → Submitted; draft/intake → Draft; review/verified → Ready to Submit (`lib/claimsStore.ts:473-485`).
- Service lines on create: each CPT code becomes one line, billed amount divided equally, diagnosis pointer "A", units 1; diagnosis pointers A–D assigned in entry order (`ClaimDetailDrawer.tsx:543-567`).
- Numbering random `CLM-YYYY-####` (collisions possible) (`lib/claimsStore.ts:428-432`).
- Billing provider tax ID/address default to fixed demo values (`ClaimDetailDrawer.tsx:157-158`).

**KPIs/metrics.**
| Metric | Where | How calculated | Citation |
| :--- | :--- | :--- | :--- |
| All / Ready / Submitted & Review / Paid / Drafts counts | Preset chips, status dropdowns | Count by status. "Submitted & Review" count includes Accepted, but the filter it applies excludes Accepted → count and list disagree | `app/pages/Claims.tsx:198-212` vs `:168` |
| Total Billed Charge | Drawer › CPT & Diagnoses | Claim billed total | `ClaimDetailDrawer.tsx:903-906` |
| Allowed Amount | Drawer › CPT & Diagnoses (and Overview default) | Billed × 0.85 — fixed placeholder ratio, no payer-contract source — **hardcoded – formula undefined** | `ClaimDetailDrawer.tsx:911-914, 364` |
| Amount Paid by Payer | Drawer › CPT & Diagnoses | Claim amount paid | `ClaimDetailDrawer.tsx:919-922` |
| Patient Responsibility | Drawer › CPT & Diagnoses | (Billed × 0.85) − amount paid, min 0 — depends on the placeholder ratio — **hardcoded – formula undefined** | `ClaimDetailDrawer.tsx:927-930` |

**Cross-module references.**
- Workflow / Process: insurance process + workflow gear (`app/pages/Claims.tsx:64-94, 451-456`).
- Appointment / Invoice / AI Scribe linkage: a full "Client → Appointment → Invoice → Scribe ICD-10" auto-fill builder exists in `app/components/claims/CreateClaimDrawer.tsx:111-349`, but **no page uses it**. The live drawer has no linkage fields; seed claims carry appointment and scribe IDs that are never shown.
- Team settings NPI: not used; NPI is free text (`ClaimDetailDrawer.tsx:591`).
- Invoices: no link; insurance payments on invoices do not update claims.

---

## B. Product map — per PRD

### B1 Products & Services (`client/services.md`)
- **Purpose:** central catalogue of billable consultations, procedures, lab panels and packages with price, tax rate and duration (`services.md § 1. Module Summary`).
- **Roles:** Practice Manager (`services.md § F-1 › 4. Jobs to be done`). No permission rules.
- **Screens:** Services data table (Code, Service Name, Category, Price, Tax Rate, Duration, Status); Add Service **modal**; Active status switch (`services.md § F-1 › 2. What it includes`).
- **Flows:** add service (name, code, category, price, duration, description); toggle active; search by name and code (`§ F-1 › 2`). Worked example: add "Comprehensive Dermatology Consultation", CPT-99204, $180, 30 m → selectable in booking and invoicing (`§ F-1 › 3`).
- **Rules:** categories Consultations, Procedures, Diagnostics, Pharmacy (`§ F-1 › 1`); unique item code (`§ F-1.2`); inactive = not selectable in booking/invoicing (`§ F-1.3`).
- **KPIs:** none.
- **Cross-refs:** active services selectable in appointment drawers and invoice creation (`§ F-1 › 5. Acceptance criteria F-1-1`). Elsewhere: service rooms in AI Receptionist rooms table (`settings/reception.md § F-5`); kiosk invoice service labels originate from the catalogue (`ai-receptionist/billing/invoices.md § Cross-product Summary`).
- **States:** none specified.

### B2 Invoices (`client/invoices.md`)
- **Purpose:** generate itemised invoices, track statuses (Paid, Pending, Overdue, Void), collect copays by card or UPI, dispatch payment links (`invoices.md § 1. Module Summary`).
- **Roles:** Billing Specialist; front desk (`§ F-1 › 3, 4`).
- **Screens:** ledger with sortable columns Invoice Number, Patient Name, Issue Date, Due Date, Total, Balance Due, Status (`§ F-1 › 1`); status tabs All / Pending Payment / Paid / Overdue showing outstanding $ sums (`§ F-1.1`); Generate Invoice **modal** (`§ F-1.2`); Download PDF button (`§ F-1.3`).
- **Flows:** select patient, add catalogue lines, apply discounts/taxes, set due date (`§ F-1.2`); download branded PDF with logo and patient address (`§ F-1.3`). Worked example: Office Visit $150 + CBC $45 → INV-1049 for $195 and prompts payment collection (`§ F-1 › 3`).
- **Rules:** statuses Draft, Pending, Paid, Overdue, Cancelled (`§ F-1 › 1`) — and Paid/Pending/Overdue/Void (`§ 1`); sequential invoice ID; accurate line/tax/balance calculation (`§ F-1 › 5 F-1-1`).
- **KPIs:** outstanding dollar sums on tabs (`§ F-1.1`), no formula.
- **Cross-refs:** Companion Pay Now sync (`invoices.md § Cross-product Summary`); kiosk ledger + QR pay records "Paid via AI Receptionist QR Kiosk" (`ai-receptionist/billing/qr-pay.md § F-3`); org logo on patient invoices (`settings/organization.md § F-1-1`).
- **States:** none.

### B3 Insurance & Claims (`client/claims.md`)
- **Purpose:** verify eligibility, generate EDI 837 claims with ICD-10/CPT, track clearinghouse status (`claims.md § 1. Module Summary`).
- **Roles:** Insurance Biller (`§ F-1 › 4`).
- **Screens:** Claim Builder form; scrubber; status badge (`§ F-1 › 2`).
- **Flows:** capture Payer ID, Policy #, primary ICD-10, CPT, billed amount (`§ F-1.1`); real-time scrubber flags missing NPI / invalid code in red (`§ F-1.2`); submit → passes scrubber → confirmation #CLM-892 (`§ F-1 › 3`).
- **Rules:** mandatory fields; lifecycle Draft, Submitted, Acknowledged, Paid, Denied with denial reason code (`§ F-1.3`); claims missing ICD-10 or NPI blocked with field errors (`§ F-1 › 5 F-1-1`).
- **KPIs:** none.
- **Cross-refs:** NPI auto-merges from Team credentials into CMS-1500 Box 24J/33 (`settings/team.md § F-2-1`); kiosk keeps claims separate (`ai-receptionist/billing/invoices.md § Cross-product Summary`).
- **States:** error highlighting only.

---

## C. Findings

### C1 Products & Services
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G7-S-01 | Flow | Search catalogue | Partial (PRD less detailed) | services.md § F-1.1 | `/services` `app/pages/Services.tsx:267-273` | The prototype also searches description and category. |
| G7-S-02 | Flow | Table columns | Contradicts or stale | services.md § F-1.1 | `app/pages/Services.tsx:487-624` | The PRD has a Status column; the prototype has none, and adds Responsible / Created / Activity plus Appointment / Prepaid badges. Q-01. |
| G7-S-03 | Flow | Add item UI | Partial (PRD less detailed) | services.md § F-1.2 | `components/services/ServiceDrawer.tsx:127-138, 1159-1179` | Side drawer with Overview + Availability tabs, not a modal. |
| G7-S-04 | Rule | Unique item code validation | PRD-only (not built) | services.md § F-1.2 | `ServiceDrawer.tsx:388-398` | Duplicate CPT codes are allowed, which affects claim coding accuracy. |
| G7-S-05 | Rule | Name required; location required when bookable | Missing in PRD | — | `ServiceDrawer.tsx:389-397` | Errors appear as toasts only. |
| G7-S-06 | Flow | Active / inactive toggle | Prototype defect | services.md § F-1.3 | — | see E-01, E-02, E-03 |
| G7-S-07 | Rule | Category list | Contradicts or stale | services.md § F-1 › 1 | `app/pages/Services.tsx:38-45` | PRD: Consultations / Procedures / Diagnostics / Pharmacy. Prototype: Consultation / Dental / Diagnostics / Treatment / Surgical / General, plus custom. Q-02. |
| G7-S-08 | Rule | Duration capture | Partial (PRD less detailed) | services.md § F-1 › 1 | `ServiceDrawer.tsx:447, 616-645` | Duration can only be edited as slot duration on the Availability tab. Q-21. |
| G7-S-09 | Rule | Single currency (USD) | Missing in PRD | — | `ServiceDrawer.tsx:463, 489, 514`; `lib/servicesStore.ts:55-66` | A 10-currency list exists but is unused. Q-03. |
| G7-S-10 | Rule | Tax rate per item | Matches | services.md § F-1.1 | `app/pages/Services.tsx:563-576` | |
| G7-S-11 | Flow | Availability: locations, seats, rooms, directions, assigned users | Missing in PRD | — | `ServiceDrawer.tsx:592-1105` | |
| G7-S-12 | Flow | Prepaid booking (full / deposit) | Missing in PRD | — | `ServiceDrawer.tsx:663-790`; `pages/patient/PatientBookingScreen.tsx:259-274` | Affects revenue. |
| G7-S-13 | Flow | Edit item; delete item | Missing in PRD | — | `app/pages/Services.tsx:329-340, 626-638` | The missing delete confirmation is logged as E-04. Q-20. |
| G7-S-14 | Flow | Export catalogue | Missing in PRD | — | `app/pages/Services.tsx:466-483` | |
| G7-S-15 | Flow | Category quick filters | Missing in PRD | — | `app/pages/Services.tsx:408-429` | Only the first 4 categories get a chip. |
| G7-S-16 | Flow | Custom fields & sections on items | Missing in PRD | — | `app/pages/Services.tsx:168-228`; `ServiceDrawer.tsx:142-171` | |
| G7-S-17 | Flow | Empty state; no loading/error states | Missing in PRD | — | `app/pages/Services.tsx:650` | |
| G7-S-18 | Metric | Preset counts (all / per category) | Missing in PRD | — | `app/pages/Services.tsx:412, 422` | Computed counts. |
| G7-S-19 | X-ref | Catalogue → appointment booking | Partial (PRD less detailed) | services.md § F-1 › 5 F-1-1 | `components/appointments/ScheduleAppointmentDrawer.tsx:504-507`; `pages/patient/PatientBookingScreen.tsx:94-97` | Requires the item to be active **and** "Available for appointment". |
| G7-S-20 | X-ref | Catalogue → invoice line picker | Prototype defect | services.md § F-1 › 5 F-1-1 | — | see E-05 |
| G7-S-21 | X-ref | Service rooms → AI Receptionist rooms table | Matches | settings/reception.md § F-5 | `ServiceDrawer.tsx:479, 531`; `lib/roomsStore.ts:280` | |
| G7-S-22 | X-ref | Kiosk invoice rows show catalogue service labels | Partial (PRD less detailed) | ai-receptionist/billing/invoices.md § Cross-product Summary | `components/invoices/CreateInvoiceDrawer.tsx:324-331` | Labels are copied as text when the invoice is created; there is no live service link. |
| G7-S-23 | X-ref | Team settings assigns staff to services | Missing in PRD | — | `app/pages/Settings.tsx:4037` | |
| G7-S-24 | X-ref | Client product assignment; automation rules; process cards | Missing in PRD | — | `lib/servicesStore.ts:184-221`; `lib/ruleEngine.ts:13`; `components/process/ProcessProductsServicesCard.tsx:22` | |
| G7-S-25 | Rule | [SECURITY] Who may create, edit and delete catalogue items | Partial (PRD less detailed) | services.md § F-1 › 4 | — (no role gating) | Any user can change prices or delete items. The PRD only names a Practice Manager persona. Q-16. |

### C2 Invoices / Payments
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G7-I-01 | Flow | Ledger columns & sorting | Contradicts or stale | invoices.md § F-1 › 1 | `/invoices` `app/pages/Invoices.tsx:495-652` | No Issue Date column and no sorting; Status is shown as a stage bar. |
| G7-I-02 | Flow | Status tabs | Contradicts or stale | invoices.md § F-1.1 | `app/pages/Invoices.tsx:383-415` | Prototype: All / Paid / Overdue / Draft with counts. PRD: All / Pending Payment / Paid / Overdue with $ sums. |
| G7-I-03 | Flow | Kanban board with drag rules | Missing in PRD | — | `app/pages/Invoices.tsx:700-966` | Unconfirmed drops are logged as E-23. Q-05. |
| G7-I-04 | Rule | Status / stage model | Contradicts or stale | invoices.md § 1, § F-1 › 1 | `types/invoiceTypes.ts:1`; `lib/useProcessStore.ts:384, 526-625` | The PRD gives two different status sets; the prototype has 7 statuses plus configurable stages. E-22 and E-24 are related. Q-04. |
| G7-I-05 | Flow | Create invoice drawer | Partial (PRD less detailed) | invoices.md § F-1.2 | `components/invoices/CreateInvoiceDrawer.tsx:176-252, 396-521` | |
| G7-I-06 | Rule | Discount entry at creation | Contradicts or stale | invoices.md § F-1.2 | `CreateInvoiceDrawer.tsx:60-69` | The discount field is deliberately excluded from the create drawer. Q-10. |
| G7-I-07 | Rule | Subtotal / tax / total calculation | Partial (PRD less detailed) | invoices.md § F-1 › 5 F-1-1 | `lib/invoiceService.ts:612-644` | Line × qty, discount and per-line tax. Formula inconsistencies are logged as E-08 and E-09. Q-09. |
| G7-I-08 | Rule | Sequential, unique invoice ID | Prototype defect | invoices.md § F-1 › 5 F-1-1 | — | see E-06, E-07 |
| G7-I-09 | Rule | Paid / Void invoices locked from edit | Missing in PRD | — | `app/pages/Invoices.tsx:234-243` | |
| G7-I-10 | Rule | Delete = remove Draft, otherwise Void (audit preserved) | Missing in PRD | — | `app/pages/Invoices.tsx:245-255` | The missing confirmation is logged as E-23. |
| G7-I-11 | Rule | Overdue derived from due date | Partial (PRD less detailed) | invoices.md § F-1 › 1 | `lib/invoiceService.ts:885-933`; `context/InvoiceContext.tsx:332` | The inconsistent guard is logged as E-21. |
| G7-I-12 | Rule | [SECURITY] Manual stage move, including to Paid without a recorded payment | Missing in PRD | — | `lib/invoiceService.ts:958-1010` | No guard and no role gating; risk to AR / audit integrity. Q-05. |
| G7-I-13 | Flow | Invoice detail drawer (tabs, ribbon, editable sections, activity) | Missing in PRD | — | `components/invoices/InvoiceDetailDrawer.tsx:740-1063` | Q-22. |
| G7-I-14 | Flow | Detail edits saved to the invoice record | Prototype defect | — | — | see E-11 |
| G7-I-15 | Flow | Branded invoice document (PRD: PDF download) | Partial (PRD less detailed) | invoices.md § F-1.3 | `components/invoices/InvoiceDocumentModal.tsx:27-29, 126-147`; `lib/invoiceService.ts:354-446` | Browser print only; no PDF file. |
| G7-I-16 | Flow | Send invoice / payment link | Partial (PRD less detailed) | invoices.md § 1 | `InvoiceDocumentModal.tsx:105-108`; `RecordPaymentModal.tsx:246-252` | WhatsApp send exists. Broken send paths are logged as E-15 and E-16. |
| G7-I-17 | Flow | Record Payment drawer (multi-invoice allocation, types, methods, receipt) | Missing in PRD | — | `components/invoices/RecordPaymentModal.tsx:89-339` | |
| G7-I-18 | Rule | Payment methods (card / UPI) | Partial (PRD less detailed) | invoices.md § 1 | `RecordPaymentModal.tsx:117-120` | Staff side has no UPI; UPI exists only through the patient/kiosk QR. |
| G7-I-19 | Rule | Partial payment, overpayment, unlinked deposit, client credit | Missing in PRD | — | `context/InvoiceContext.tsx:428-474, 528-663`; `RecordPaymentModal.tsx:209-229` | |
| G7-I-20 | Rule | [SECURITY] Write-off recorded correctly | Prototype defect | — | — | see E-18 |
| G7-I-21 | Rule | Single payment record per payment | Prototype defect | — | — | see E-19 |
| G7-I-22 | Rule | Invoice creation gated behind an invoice automation ("locked" banner) | Missing in PRD | — | `app/pages/Invoices.tsx:224-232, 359-369` | The check itself never blocks (E-20). Q-13. |
| G7-I-23 | Metric | TOTAL INVOICED | Missing in PRD | — | `app/pages/Invoices.tsx:90` | Sum of all invoice totals, including drafts and voids. Q-11. |
| G7-I-24 | Metric | OUTSTANDING | Partial (PRD less detailed) | invoices.md § F-1.1 | `app/pages/Invoices.tsx:91-93` | Sum of (total − paid) for sent, viewed, partial and overdue invoices. Q-12. |
| G7-I-25 | Metric | PAID THIS MONTH (intended: payments received this calendar month) | Missing in PRD | — | `app/pages/Invoices.tsx:94-96, 349-351` | The current calculation is wrong (E-17). Q-08. |
| G7-I-26 | Metric | OVERDUE COUNT | Missing in PRD | — | `app/pages/Invoices.tsx:97` | |
| G7-I-27 | Metric | Kanban subtotal, preset counts, detail Payments cards | Missing in PRD | — | `Invoices.tsx:742`; `InvoiceDetailDrawer.tsx:931-956` | The placeholder subtotal/tax shown in the detail drawer is logged as E-12. |
| G7-I-28 | Flow | [SECURITY] Activity history and payments table reflect real events only | Prototype defect | — | — | see E-13, E-14 |
| G7-I-29 | Flow | Export invoices | Missing in PRD | — | `app/pages/Invoices.tsx:461-491` | |
| G7-I-30 | Flow | Empty / locked states; no loading/error | Missing in PRD | — | `Invoices.tsx:359-369, 544-556, 694, 957-959` | |
| G7-I-31 | X-ref | Companion / patient portal Pay Now | Matches | invoices.md § Cross-product Summary | `app/routes.tsx:170-171`; `pages/patient/PatientPaymentScreen.tsx:38-60, 150` | |
| G7-I-32 | X-ref | Kiosk QR pay → "Paid via AI Receptionist QR Kiosk" | Matches | ai-receptionist/billing/qr-pay.md § F-3 | `reception/avatar/AvatarReceptionView.tsx:2137`; `reception/lib/api/mockMaClient.ts:1806-1808` | |
| G7-I-33 | X-ref | Appointment → auto invoice (once per appointment) | Missing in PRD | — | `lib/appointmentService.ts:805-830`; `lib/invoiceService.ts:601-610` | |
| G7-I-34 | X-ref | Patient prepaid booking → invoice + payment | Missing in PRD | — | `pages/patient/PatientBookingScreen.tsx:708-745` | The tax mismatch is logged as E-10. |
| G7-I-35 | X-ref | AI Scribe → invoice line items ("Fill with AI") | Missing in PRD | — | `InvoiceDetailDrawer.tsx:489-538, 1163-1181` | Does not persist (E-11). |
| G7-I-36 | X-ref | Client profile Invoices tab | Missing in PRD | — | `app/pages/ClientProfile.tsx:2354, 3422-3700` | |
| G7-I-37 | X-ref | Process / automation events and workflow gear | Missing in PRD | — | `lib/invoiceService.ts:710, 750, 861-864, 921, 950, 999`; `Invoices.tsx:451-457` | |
| G7-I-38 | X-ref | Org logo on patient invoices | PRD-only (not built) | settings/organization.md § F-1-1 | `InvoiceDocumentModal.tsx:131-134` | The letterhead is hard-coded. |
| G7-I-39 | X-ref | Insurance payment ↔ claim record | Missing in PRD | — | `RecordPaymentModal.tsx:292-314` | Payer and claim ref are free text; the claim is not updated. Q-15. |
| G7-I-40 | Rule | [SECURITY] Who may create, void, write off and record payments | Partial (PRD less detailed) | invoices.md § F-1 › 4 | — (no role gating) | Void and write-off have no role control or approval. Q-06, Q-16. |
| G7-I-41 | Flow | Worked example: create → prompts payment collection | Contradicts or stale | invoices.md § F-1 › 3 | `CreateInvoiceDrawer.tsx:390-393` | The drawer just closes. |
| G7-I-42 | Metric | PAID THIS MONTH calculation | Prototype defect | — | — | see E-17 |

### C3 Insurance & Claims
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G7-C-01 | Flow | Claims list & columns | Missing in PRD | — | `/claims` `app/pages/Claims.tsx:494-607` | |
| G7-C-02 | Flow | Presets, payer filter, ICD/CPT search, process selector | Missing in PRD | — | `app/pages/Claims.tsx:164-195, 269-428` | |
| G7-C-03 | Flow | Claim builder | Partial (PRD less detailed) | claims.md § F-1.1 | `components/claims/ClaimDetailDrawer.tsx:75-124, 539-622` | |
| G7-C-04 | Rule | Payer ID capture | Prototype defect | claims.md § F-1.1 | — | see E-25 |
| G7-C-05 | Rule | Mandatory field validation | PRD-only (not built) | claims.md § F-1.1 | `ClaimDetailDrawer.tsx:539-599` | A blank claim saves as "Unnamed Client". Q-23. |
| G7-C-06 | Rule | Code entry, pointers, charge split | Partial (PRD less detailed) | claims.md § F-1 › 1 | `ClaimDetailDrawer.tsx:543-567` | The billed amount is split evenly across CPT lines. |
| G7-C-07 | Rule | Real-time scrubber | PRD-only (not built) | claims.md § F-1.2 | — | The placeholder checklist is logged as E-26. |
| G7-C-08 | Rule | Block submission when ICD-10 / NPI missing | PRD-only (not built) | claims.md § F-1 › 5 F-1-1 | `ClaimSubmissionModal.tsx:44-77` | |
| G7-C-09 | Rule | Claim status lifecycle | Contradicts or stale | claims.md § F-1.3 | `lib/claimsStore.ts:3-11`; `lib/useProcessStore.ts:757-776` | Q-14. |
| G7-C-10 | Rule | One stage→status mapping | Prototype defect | — | — | see E-27 |
| G7-C-11 | Rule | Denial reason code | Partial (PRD less detailed) | claims.md § F-1.3 | `components/claims/ClaimStatusModal.tsx:35, 126-130` | Shown only for "Rejected". The placeholder fallback text is logged as E-31. |
| G7-C-12 | Flow | Submit (electronic / manual CMS-1500 / preview) | Partial (PRD less detailed) | claims.md § F-1 › 3 | `ClaimSubmissionModal.tsx:44-77, 274-339`; `lib/claimsStore.ts:434-465` | Simulated clearinghouse. |
| G7-C-13 | Flow | Clearinghouse status view | Partial (PRD less detailed) | claims.md § F-1.3 | `ClaimStatusModal.tsx:32-41, 115-130` | Placeholder numbers are logged as E-31. |
| G7-C-14 | Flow | CMS-1500 view / print / JSON export | Missing in PRD | — | `components/claims/CMS1500Modal.tsx:17-29, 75-90` | |
| G7-C-15 | Flow | Detail drawer tabs & stage ribbon; edit existing claim | Missing in PRD | — | `ClaimDetailDrawer.tsx:668-1055` | Edits do not save (E-28). |
| G7-C-16 | Flow | Edits to existing claims saved; in-drawer submit | Prototype defect | — | — | see E-28 |
| G7-C-17 | Flow | Delete claim | Missing in PRD | — | `lib/claimsStore.ts:417-426` (no UI) | Q-20. |
| G7-C-18 | Rule | Claim numbering `CLM-YYYY-####` | Missing in PRD | — | `lib/claimsStore.ts:428-432` | Random suffix, so collisions are possible. Q-18. |
| G7-C-19 | Metric | Status counts on presets | Missing in PRD | — | `app/pages/Claims.tsx:198-212` | Count by status. The count/filter mismatch is logged as E-30. |
| G7-C-20 | Metric | Allowed Amount, Patient Responsibility | Missing in PRD | — | `ClaimDetailDrawer.tsx:364, 911-930` | hardcoded – formula undefined (85% placeholder; E-33). Q-17. |
| G7-C-21 | Metric | Total Billed, Amount Paid by Payer | Missing in PRD | — | `ClaimDetailDrawer.tsx:903-922` | Computed from the claim record. |
| G7-C-22 | Flow | [SECURITY] Activity history reflects real events only | Prototype defect | — | — | see E-29 |
| G7-C-23 | Flow | Eligibility verification | PRD-only (not built) | claims.md § 1 | — | |
| G7-C-24 | Flow | EDI 837 generation | Partial (PRD less detailed) | claims.md § 1 | `lib/claimsStore.ts:434-465`; `CMS1500Modal.tsx:21-29` | No 837 file; JSON export only. |
| G7-C-25 | Flow | Export claims | Missing in PRD | — | `app/pages/Claims.tsx:462-490` | |
| G7-C-26 | Flow | Empty / submitting / error states | Missing in PRD | — | `Claims.tsx:642`; `ClaimSubmissionModal.tsx:33-58, 206-211` | |
| G7-C-27 | X-ref | NPI from Team credentials | PRD-only (not built) | settings/team.md § F-2-1 | `ClaimDetailDrawer.tsx:591` | Q-23. |
| G7-C-28 | X-ref | Appointment / invoice / scribe → claim auto-fill | Missing in PRD | — | `components/claims/CreateClaimDrawer.tsx:111-349` (no page uses it) | Built but orphaned. Q-15. |
| G7-C-29 | X-ref | Kiosk ledger excludes claims | Matches | ai-receptionist/billing/invoices.md § Cross-product Summary | `reception/lib/api/mockMaClient.ts:1748` | |
| G7-C-30 | X-ref | Insurance workflow process vs unused "Claims Management" process | Missing in PRD | — | `app/pages/Claims.tsx:64-94`; `lib/useProcessStore.ts:757-796` | Q-14. |
| G7-C-31 | X-ref | Invoice insurance payments don't update claims | Missing in PRD | — | `components/invoices/RecordPaymentModal.tsx:292-314` | Q-15. |
| G7-C-32 | Rule | [SECURITY] Who may create and submit claims | Partial (PRD less detailed) | claims.md § F-1 › 4 | — (no role gating) | Any user can submit claims to payers. Q-16. |
| G7-C-33 | Rule | Pre-flight checklist reflects real checks | Prototype defect | claims.md § F-1.2 | — | see E-26 |
| G7-C-34 | Metric | Preset count matches its filter | Prototype defect | — | — | see E-30 |

---

## D. Correct flow as built (PRD-ready)

> D mirrors the existing PRD structure: header table → Cross-product Summary → 1. Module Summary → 2. Feature Requests (1–5 sub-headings) → 3. Comprehensive Summary. It describes **intended** behaviour only. No defect from section E is written as a rule, acceptance criterion or KPI definition. Unclear points are marked `Decision needed`.

### D1 Products & Services (replacement for `client/services.md`)

| Product | CLIENT |
| Module | SERVICES |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Appointments | Only items that are active and marked **Available for appointment** appear in the Schedule Appointment drawer. | [View](/client/appointments) |
| Companion | Patient booking | Bookable items appear in the patient booking portal. **Prepaid** items require payment (full price or deposit, plus item tax) before the booking is confirmed. | [View](/companion/billing) |
| Client | Invoices | Active catalogue items can be picked as invoice line items (name, price and tax are copied onto the line). | [View](/client/invoices) |
| AI Receptionist | Rooms | Rooms entered on a bookable item's Availability tab appear in the unified Clinic Rooms & Desks table. | [View](/client/settings/reception) |
| Client | Team settings | Staff can be assigned to items when adding a team member. | [View](/client/settings/team) |

## 1. Module Summary
- **Product & Services** is the practice's single catalogue of everything it sells: consultations, procedures, diagnostics and products. Each item has a price, tax %, optional CPT/code, category and description.
- An item can be made **bookable**. This unlocks slot duration, per-location availability (seats, room, directions, assigned staff) and **prepaid** collection.
- Items can be **active** or **inactive**. Inactive items are kept for history but cannot be booked or invoiced.
- The catalogue feeds appointment booking, the patient booking portal, invoice line items, AI Receptionist rooms and automation rules.

## 2. Feature Requests

### F-1: Catalogue List
#### 1. What it does
Shows every item in a paged table (20 per page) with search, category quick filters and export.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Catalogue table | Data table | Columns: Product / Service (with **Appointment** and **Prepaid** badges), CPT / Code, Category, Duration, Price, Tax, Responsible, Created, Activity | Click a row or name to open the item; row menu: Edit, Activate/Deactivate, Delete. Decision needed: add a Status column as the PRD specified? (see G7-Q-01) |
| F-1.2: Search | Search box | Matches name, description, category or CPT code | |
| F-1.3: Category quick filters | Chips | "All Services" plus categories, each with a count of items in that category | Decision needed: canonical default category list (see G7-Q-02) |
| F-1.4: Export | Modal | Exports name, category, price, duration, CPT, description, tax and colour | |
| F-1.5: Delete | Row action | Removes the item after the user confirms | Decision needed: block delete or force deactivation once the item is referenced? (see G7-Q-20) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Manager looks for all dental items | Clicks the **Dental** chip | The table shows only Dental items; the chip shows the count |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When reviewing our fee schedule, I want to find any item by name or code, so that I can check pricing quickly. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Search returns items whose name, description, category or CPT code contains the text. |
| F-1-2 | With no matches the table shows "No products or services found matching your filters." |
| F-1-3 | Delete asks for confirmation before removing an item. |

### F-2: Add / Edit Item Drawer
#### 1. What it does
A side drawer ("Add New Product" / "Product Details") to create or edit an item. The **Overview** tab is always shown. The **Availability** tab appears only when "Available for appointment" is ticked in the footer.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Service Details | Section | Name (required), Category (default General), CPT code, Description | |
| F-2.2: Pricing | Section | Price, Tax % | Decision needed: single currency or per-item currency? (see G7-Q-03) |
| F-2.3: Active status | Toggle | Sets the item active or inactive; saving keeps the chosen state | |
| F-2.4: Custom fields & sections | Section manager | Add registered or custom fields/sections | |
| F-2.5: Available for appointment | Checkbox (footer) | Shows/hides the Availability tab | Un-ticking returns to Overview |
| F-2.6: Slot duration | Number (min) | One booking length for all locations | Decision needed: should non-bookable items have an editable duration? (see G7-Q-21) |
| F-2.7: Prepaid | Toggle + choice | Full amount or fixed deposit, collected in the patient portal before the booking confirms | Only applies to bookable items |
| F-2.8: Location rules | Repeating card | Location, seats (min 1), room number, room label, directions, assigned users (blank = all staff) | "Add Location"; rooms sync to AI Receptionist |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Add "Initial Consultation", CPT 99204, $150, 5% tax, bookable at Main Clinic Room 101, prepaid in full | Fills Overview, ticks Available for appointment, sets a 60 min slot, prepaid Full, adds a location with a room | The item appears with **Appointment** and **Prepaid** badges. It is offered in the appointment drawer and patient portal (the portal charges $157.50), and Room 101 appears in AI Receptionist rooms |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When adding a new offering, I want to set price, tax and where/who delivers it, so that booking and billing use the same rules. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Saving without a name shows "Service name is required". |
| F-2-2 | Saving a bookable item with no location shows "Please add at least one location in Availability". |
| F-2-3 | Only active items marked Available for appointment appear in the appointment drawer and patient portal. |
| F-2-4 | Only active catalogue items appear in the invoice line-item picker. |
| F-2-5 | Deactivating an item and saving keeps it inactive. |

### Not yet built (from current PRD)
- Unique item-code validation (old F-1.2).
- Category set Consultations / Procedures / Diagnostics / Pharmacy (old F-1). See G7-Q-02.
- Decision needed: which roles may create, edit, price and delete catalogue items? (see G7-Q-16)

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Catalogue List | F-1.1–F-1.5 | Paged, searchable, filterable catalogue table with export and confirmed delete. |
| F-2 | Add / Edit Item Drawer | F-2.1–F-2.8 | Item details, pricing, active state, custom fields, and optional booking availability with prepaid collection. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Find and review any item quickly. | F-1 |
| 2 | Practice Manager | Define an offering once so booking, billing and kiosk rooms stay consistent. | F-2 |

### D2 Invoices (replacement for `client/invoices.md`)

| Product | CLIENT |
| Module | INVOICES |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Bill & Pay | Patients see the same invoices at `/patient/bill` and pay by QR at `/patient/pay`; the payment is recorded on the invoice. | [View in Companion](/companion/billing) |
| AI Receptionist | Kiosk QR Pay | Kiosk QR settlement records a payment with the note "Paid via AI Receptionist QR Kiosk". | [View](/ai-receptionist/billing/qr-pay) |
| Client | Appointments | A booking can auto-create one invoice per appointment when an appointment "generate invoice" automation is active. | [View](/client/appointments) |
| Companion | Prepaid booking | A prepaid patient booking creates an invoice for the amount paid (price/deposit + item tax) and records the payment, so the invoice is settled. | [View](/companion/billing) |
| Client | AI Scribe | "Fill with AI" turns scribe billing codes into invoice line items. | [View](/client/scribe) |
| Client | Clients | The client profile has an Invoices tab (create, view, record payment). | [View](/client/clients) |
| Client | Processes / Automation | Invoice stages come from the Billing & Invoicing process; invoice events (created, sent, paid, partially paid, overdue, voided) trigger automations. | [View](/client/processes) |

## 1. Module Summary
- **Invoices** manages client billing: itemised invoices (manual or automatic), a configurable stage workflow, payments, deposits, write-offs and client credit.
- Two views, **List** and **Kanban**, share search, presets, Record Payment, Create Invoice, Export and the workflow gear.
- Four headline figures sit above the table: Total Invoiced, Outstanding, Paid This Month and Overdue Count.

## 2. Feature Requests

### F-1: Invoice Ledger (List & Kanban)
#### 1. What it does
Lists all invoices with their stage, amounts and activity, and lets staff move invoices between stages.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Headline figures | KPI capsules | **Outstanding** = sum of (total − amount paid) for invoices that are sent, viewed, partially paid or overdue. **Overdue Count** = number of overdue invoices. **Paid This Month** = sum of payments received in the current calendar month. **Total Invoiced** = sum of invoice totals | Decision needed: should Total Invoiced exclude drafts and voids? (see G7-Q-11). Decision needed: which statuses count as Outstanding? (see G7-Q-12). Confirm the Paid This Month definition (see G7-Q-08) |
| F-1.2: Presets & search | Chips + search | All / Paid / Overdue / Draft with counts; search by invoice ID, client or appointment title | |
| F-1.3: List view | Table | Invoice ID, Title, Stage (clickable), Client, Amount, Balance (0 when paid or void), Due Date, Created, Last Activity, Responsible | Row menu: Add Payment, View Document, Edit, Delete / Void |
| F-1.4: Kanban view | Board | One column per stage with count and subtotal; drag cards between stages | Overdue can't be set manually from anywhere. Decision needed: should a drop on Paid open Record Payment, and should a drop on Void confirm? (see G7-Q-05) |
| F-1.5: Edit / Delete rules | Rules | Paid and Void invoices can't be edited. Delete removes a Draft; any other status is voided and kept. Both ask for confirmation | |
| F-1.6: Overdue | System rule | Unpaid, non-void invoices past their due date move to Overdue | |
| F-1.7: Status & stages | Rule | Decision needed: final status vocabulary, its mapping to process stages, and whether a Void stage is seeded by default (see G7-Q-04) | |
| F-1.8: Manual move to Paid | Rule | Decision needed: may staff mark an invoice Paid without a recorded payment, and which role? (see G7-Q-05) | |
| F-1.9: Export | Modal | Number, client, email, status, total, paid, balance, due, created, paid date | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | An unpaid invoice passed its due date yesterday | Opens Invoices | The invoice shows in the Overdue stage and Overdue Count increases |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Billing Specialist | When chasing payments, I want to see outstanding and overdue invoices at a glance, so that I know who to follow up. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Editing a Paid or Void invoice shows "Paid or Void invoices can't be edited". |
| F-1-2 | Deleting a non-draft invoice voids it and keeps the record, after confirmation. |
| F-1-3 | A voided invoice shows as Void with zero balance. |

### F-2: Create / Edit Invoice Drawer
#### 1. What it does
A "Create Standalone Invoice" drawer with a client selector, a Client Detail section and a Product (line items) section.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Client Detail | Section | Client name/email/phone (from the selector), invoice number, issue date (today), due date (+14 days), payment mode (Bank Transfer, Card, Cash, UPI, Stripe, PayPal) | The invoice number shown is the one the invoice is saved with |
| F-2.2: Line items | Table | Product (active catalogue items), quantity, price, tax % | First catalogue item pre-filled |
| F-2.3: Totals | Calculation | Subtotal = sum of quantity × price; total = subtotal − discount + tax; the drawer preview and the saved invoice show the same figures | Decision needed: tax for a line with no rate (see G7-Q-09). Decision needed: where discount is entered and whether it applies before tax (see G7-Q-10) |
| F-2.4: Save as Draft / Save & Send Invoice | Buttons | Save as Draft saves the invoice; Save & Send also sends it to the client (channel, sent time, Sent stage) | Requires a client and at least one line |
| F-2.5: Numbering | Rule | Invoice numbers are unique and sequential per organisation and never reused | Decision needed: number format (see G7-Q-07) |
| F-2.6: Automation gate | Rule | Decision needed: should creating invoices require an invoice automation, and what counts as one? (see G7-Q-13) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Front desk bills a follow-up | Selects the client, keeps "Follow-up Visit $75, 5% tax", Save as Draft | Toast "Invoice <number> generated!"; total $78.75 in Draft |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Billing Specialist | When a visit is completed, I want to create an itemised invoice from the catalogue, so that charges are accurate. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Saving without line items shows "Please add at least one line item". |
| F-2-2 | The saved invoice total equals the total shown in the drawer. |

### F-3: Invoice Detail Drawer
#### 1. What it does
A stage ribbon plus three tabs. **Overview**: editable sections, shareable payment link and activity feed with Fill-with-AI. **Documents**: invoice document and templates. **Payments**: Total, Amount Paid, Balance Due and Client Credit cards, a payments table and Record Payment.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Stage ribbon | Chevrons | Click to move stage | Same rules as F-1 |
| F-3.2: Editable details | Sections | Due date, payment mode and line items (including Fill-with-AI lines); changes save to the invoice and update totals | Decision needed: which fields stay editable after Sent? (see G7-Q-22) |
| F-3.3: Activity feed | Timeline | Shows recorded events only (created, document generated, stage changes, payments) | |
| F-3.4: Payments tab | Cards + table | Date, method, receipt/ref, status and amount for recorded payments | Balance Due = total − amount paid |
| F-3.5: Invoice document | Modal | Printable "Official Invoice" (Print, Send via WhatsApp) | Clinic branding: see Not yet built |
| F-3.6: Send / copy link | Actions | Send by email, SMS or WhatsApp; copy the shareable payment link | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Client asks for a copy | View Document → Print | The browser print dialog opens with the invoice sheet |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Billing Specialist | I want one place to see an invoice's stage, documents and payments. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Payments tab Balance Due = total − amount paid. |
| F-3-2 | An invoice with no payments shows "No payments recorded yet for this invoice." |

### F-4: Record Payment
#### 1. What it does
A drawer to record one payment across one or many of a client's open invoices, or an unlinked deposit.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Invoice allocation | Table | Lists the client's open invoices; each amount defaults to its balance | |
| F-4.2: Payment type | Choice | Self-pay; Insurance (payer, claim ref); Write-off (reason) | Decision needed: how write-offs are recorded and reported, and who may approve them (see G7-Q-06) |
| F-4.3: Method | Choice | Cash, card on file, check (#), external terminal (auth code), bank transfer; date; receipt # and upload; note | |
| F-4.4: Client credit | Rule | Apply available credit; overpayments and unlinked deposits go to client credit | |
| F-4.5: Send link | Mode | Sends a payment link via WhatsApp instead of recording a payment | |
| F-4.6: One record per payment | Rule | Each payment creates exactly one payment record | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Client pays $100 cash on a $78.75 invoice | Enters $100 and saves | The invoice is Paid; $21.25 is added to client credit |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front desk | When a client pays, I want to apply it to the right invoices and keep any extra as credit. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | A payment ≥ balance sets the invoice to Paid; a smaller payment sets Partial. |
| F-4-2 | Saving with no invoice selected (and not in unlinked mode) shows "Please select at least one invoice or switch to Unlinked Advance Payment." |

### Not yet built (from current PRD)
- Sortable columns and Issue Date / Status columns (old F-1).
- Tabs All / Pending Payment / Paid / Overdue with $ sums (old F-1.1).
- Discount entry at creation (old F-1.2). See G7-Q-10.
- Downloadable branded PDF with clinic logo and patient address (old F-1.3; settings/organization F-1-1).
- Payment prompt after creation (old worked example).
- Decision needed: which roles may create, void, write off and record payments? (see G7-Q-16)

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Invoice Ledger | F-1.1–F-1.9 | KPIs, list/Kanban, stage moves, edit/void rules, overdue, export. |
| F-2 | Create / Edit Invoice | F-2.1–F-2.6 | Client + catalogue line items with per-line tax; draft or send; unique numbering. |
| F-3 | Invoice Detail | F-3.1–F-3.6 | Stage ribbon, editable details, activity, documents, payments, send. |
| F-4 | Record Payment | F-4.1–F-4.6 | Multi-invoice payments, insurance, write-off, deposits and credit. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Billing Specialist | Track and chase outstanding invoices. | F-1 |
| 2 | Billing Specialist | Create accurate itemised invoices. | F-2, F-3 |
| 3 | Front desk | Record payments and manage client credit. | F-4 |

### D3 Insurance & Claims (replacement for `client/claims.md`)

| Product | CLIENT |
| Module | CLAIMS |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| AI Receptionist | Kiosk ledger | Claims stay out of the patient-facing kiosk invoice ledger. | [View](/ai-receptionist/billing/invoices) |
| Client | Processes | Claim stages come from the insurance claims process; the workflow gear opens its automations. | [View](/client/processes) |
| Client | Invoices / Appointments / AI Scribe | Decision needed: should claims be built from appointment, invoice and scribe data, and should insurance payments recorded on invoices update the claim? (see G7-Q-15) | [View](/client/invoices) |

## 1. Module Summary
- **Insurance & Claims** prepares professional claims (CMS-1500 / 837P), submits them electronically through the clearinghouse or on paper, and tracks them through a claims workflow.
- Decision needed: which process and status set is canonical (see G7-Q-14). The built default stages are Draft & Intake → Coverage Verified → Submitted (837P) → Under Review → Paid & Settled / Denied.

## 2. Feature Requests

### F-1: Claims List
#### 1. What it does
A table of claims with a stage bar, search and filters.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Table | Data table | Claim ID, Title, Stages (clickable), Client, Insurance Payer, Service Date, Billed Amount | Row menu: Edit Claim, Submit / View Status, View CMS-1500 |
| F-1.2: Presets | Chips | All, Ready to Submit, Submitted & Review, Paid Claims, Drafts; each count equals the number of claims its filter shows | |
| F-1.3: Search & filters | Search + selects | Claim #, patient, payer, ICD-10, CPT; payer filter; process selector | |
| F-1.4: Export | Modal | Claim #, patient, payer, policy, service date, billed, status, CPT, ICD-10 | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Biller looks for knee claims | Searches "M17" | Claims with ICD-10 M17.x are listed |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Insurance Biller | I want to find claims by patient, payer or code, so that I can follow up quickly. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Search matches claim number, patient, payer name/ID, ICD-10 or CPT code/description. |
| F-1-2 | With no matches the table shows "No insurance claims found matching your filters." |

### F-2: Create Claim & Claim Detail
#### 1. What it does
A drawer with a stage ribbon and three tabs. **Overview**: Claim Details; Patient & Policy Information; Billing & Diagnosis; activity. **Documents**. **CPT & Diagnoses**: financial cards, service lines, diagnoses and clearinghouse info.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Claim Details | Section | Claim ID (auto), date of service, billed amount, claim type, place of service | Decision needed: claim number format and uniqueness (see G7-Q-18) |
| F-2.2: Patient & Policy | Section | Patient name, email, phone, DOB, payer (name and payer ID), policy #, group # | The payer ID entered or selected is stored on the claim |
| F-2.3: Billing & Diagnosis | Section | Diagnosis codes, procedure codes, provider NPI, prior auth, paid amount | Each CPT code becomes a service line. Decision needed: required fields and NPI source (see G7-Q-23) |
| F-2.4: Save as Draft / Create Claim | Buttons | Draft, or Ready to Submit | |
| F-2.5: Edit existing claim | Sections | Changes save to the claim and update the list | |
| F-2.6: Financial cards | Cards | Total billed; Amount paid by payer | Decision needed: define formula for Allowed Amount and Patient Responsibility (see G7-Q-17) |
| F-2.7: Stage ribbon | Chevrons | Click to move stage; status follows one stage→status mapping everywhere | Decision needed: the mapping table (see G7-Q-14) |
| F-2.8: Activity feed | Timeline | Shows recorded events only | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Biller creates a claim for a biopsy | Enters patient, payer and payer ID, policy, ICD-10 L82.1, CPT 11102, $250, Create Claim | The claim is saved as Ready to Submit with one $250 service line |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Insurance Biller | I want to capture patient, policy and coding details in one place. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Create Claim saves the claim as Ready to Submit. |
| F-2-2 | Editing an existing claim and saving updates the claim in the list. |

### F-3: Submit, Track & CMS-1500
#### 1. What it does
The submit modal offers **Mantra Clearinghouse** (electronic 837P) or **Manual CMS-1500**. Submitted claims open a Clearinghouse Status view.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Electronic submit | Action | Sets Submitted and shows the tracking ID, batch ID and EDI control # returned by the clearinghouse | Clearinghouse is simulated in the prototype |
| F-3.2: Manual CMS-1500 | Action | Sets Submitted (or preview only) and opens the printable CMS-1500 (02/12) | Print or Export JSON |
| F-3.3: Status view | Modal | Status banner, gateway details, financial summary, and the payer's rejection/denial reason | Shows only values received for this claim |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A claim is ready | Submit / View Status → Submit Electronically | Status is Submitted; the tracking ID is shown |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Insurance Biller | I want to submit electronically or print a CMS-1500, and see transmission details afterwards. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | After electronic submit the claim shows tracking, batch and EDI control numbers. |
| F-3-2 | If submission fails, the modal shows the error and the claim stays unsubmitted. |

### Not yet built (from current PRD)
- Mandatory-field validation and blocking when ICD-10 or NPI is missing (old F-1.1, F-1-1).
- Real-time scrubber / pre-flight checks (old F-1.2).
- "Acknowledged" status and denial reason codes (old F-1.3). See G7-Q-14.
- Eligibility verification (old summary).
- NPI auto-filled from Team credentials (settings/team F-2-1).
- Decision needed: which roles may create and submit claims? (see G7-Q-16)

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Claims List | F-1.1–F-1.4 | Searchable, filterable claims table with stage bar and export. |
| F-2 | Create Claim & Detail | F-2.1–F-2.8 | Claim, patient/policy and coding capture with financial summary. |
| F-3 | Submit, Track & CMS-1500 | F-3.1–F-3.3 | Electronic or paper submission and clearinghouse status. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Insurance Biller | Find and follow up claims. | F-1 |
| 2 | Insurance Biller | Build and submit clean claims. | F-2, F-3 |

---

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
| :--- | :--- | :--- | :--- | :--- |
| G7-E-01 | The activate/deactivate handler exists but no control calls it, so items can't be retired. | `app/pages/Services.tsx:342-348` | High | G7-S-06 |
| G7-E-02 | Every save forces the item back to active, which would undo any deactivation. | `components/services/ServiceDrawer.tsx:465, 491, 516` | High | G7-S-06 |
| G7-E-03 | The help modal promises "Toggle items active/inactive", which is not available. | `app/pages/Services.tsx:690` | Low | G7-S-06 |
| G7-E-04 | Delete removes a catalogue item immediately, with no confirmation. | `app/pages/Services.tsx:335-340, 632-637` | Medium | G7-S-13 |
| G7-E-05 | The invoice line picker lists inactive items and built-in sample services that are not in the catalogue. | `components/fields/useCrmBindOptions.ts:50-61`; `components/invoices/CreateInvoiceDrawer.tsx:179` | High | G7-S-20 |
| G7-E-06 | Invoice number = 1050 + number of invoices currently stored, so a number is reused after a draft is deleted. | `lib/invoiceService.ts:646, 669` | Critical | G7-I-08 |
| G7-E-07 | The create drawer shows a random `INV-######` that differs from the number the invoice is saved with. | `components/invoices/CreateInvoiceDrawer.tsx:187` | Medium | G7-I-08 |
| G7-E-08 | Drawer preview and saved invoice use different total formulas: the preview taxes undiscounted lines, while the saved invoice spreads the discount across lines before tax. | `CreateInvoiceDrawer.tsx:255-279` vs `lib/invoiceService.ts:623-644` | High | G7-I-07 |
| G7-E-09 | A line with no tax rate silently gets 8% tax. | `lib/invoiceService.ts:640` | High | G7-I-07, G7-I-34 |
| G7-E-10 | A prepaid portal booking charges price + the item's tax, but its invoice line has no rate and so gets 8%. The invoice is left "Partial" after full payment. | `pages/patient/PatientBookingScreen.tsx:272-274, 720-744` | High | G7-I-34 |
| G7-E-11 | Detail-drawer edits (due date, payment mode, line items, discount, Fill-with-AI lines) are saved through a function the invoice service doesn't have. The invoice record and totals never change. | `components/invoices/InvoiceDetailDrawer.tsx:415-487` (call at `:484`), `:489-538` | High | G7-I-14 |
| G7-E-12 | The detail Overview shows subtotal = total × 0.95 and tax = total × 0.05 when they aren't stored (hardcoded – formula undefined). Payment mode is read from a different field than the one saved. | `InvoiceDetailDrawer.tsx:395, 407-408` | Medium | G7-I-27 |
| G7-E-13 | [SECURITY] The invoice activity feed writes fabricated "Invoice Created / Document Generated / Stage Updated / Payment Recorded" events whenever history is empty. This compromises audit-trail integrity. | `InvoiceDetailDrawer.tsx:591-681` | High | G7-I-28 |
| G7-E-14 | [SECURITY] The Payments tab shows a synthetic "completed" payment row when an invoice is marked paid without a payment record. | `InvoiceDetailDrawer.tsx:698-719` | High | G7-I-28 |
| G7-E-15 | "Save & Send Invoice" only changes the status: nothing is sent, there is no channel or sent time, and the stage doesn't change. | `CreateInvoiceDrawer.tsx:382-384` | Medium | G7-I-16 |
| G7-E-16 | The Send (email/SMS/WhatsApp), Void and Copy-payment-link handlers in the detail drawer are not wired to any control. | `InvoiceDetailDrawer.tsx:723-738` | Medium | G7-I-16 |
| G7-E-17 | "Paid This Month" sums every payment ever recorded; there is no month filter. | `app/pages/Invoices.tsx:94-96` | Medium | G7-I-42, G7-I-25 |
| G7-E-18 | [SECURITY] A write-off is stored as a cash payment, so it counts as cash received and marks the invoice Paid. This misstates the financial record. | `components/invoices/RecordPaymentModal.tsx:294-308` | High | G7-I-20 |
| G7-E-19 | Each payment is recorded through two paths (invoice context and invoice service), each writing its own payment record. Duplicate or overwritten rows are likely; engineering should confirm. | `context/InvoiceContext.tsx:536, 651-659`; `lib/invoiceService.ts:849-858` | High | G7-I-21 |
| G7-E-20 | The "build automation first" check always passes because the default invoice process counts, so the lock never applies. | `lib/invoiceService.ts:69-75` | Low | G7-I-22 |
| G7-E-21 | A manual move to Overdue is refused on a Kanban drop but allowed from the stage bar. | `app/pages/Invoices.tsx:767-771` vs `:280-288` | Low | G7-I-11 |
| G7-E-22 | Void is a required category, but no default Void stage exists, so voiding leaves the previous stage displayed. | `lib/useProcessStore.ts:384, 526-625`; `lib/invoiceService.ts:938-953` | Medium | G7-I-04 |
| G7-E-23 | Destructive actions run without confirmation: Delete/Void from the row or card menu, a Kanban drop on Void, and a Kanban drop on Paid (which records the full balance as cash). | `app/pages/Invoices.tsx:245-255, 776-784` | High | G7-I-03, G7-I-10 |
| G7-E-24 | The help modal lists 6 stages (Draft, Sent, Viewed, Paid, Overdue, Void) that don't match the default process. | `app/pages/Invoices.tsx:1008` | Low | G7-I-04 |
| G7-E-25 | The payer ID on a new claim is a fixed placeholder, so electronic claims can't route to the right payer. | `components/claims/ClaimDetailDrawer.tsx:579-584` | Critical | G7-C-04 |
| G7-E-26 | The "Pre-Flight Submission Checklist" always shows green ticks; no checks run. | `components/claims/ClaimSubmissionModal.tsx:213-238` | High | G7-C-33 |
| G7-E-27 | There are two conflicting stage→status mappings. For example, a "Denied" stage becomes Rejected from the table but Denied from the drawer, and "Coverage Verified" becomes Accepted vs Ready to Submit. | `app/pages/Claims.tsx:141-149` vs `lib/claimsStore.ts:473-485` | High | G7-C-10 |
| G7-E-28 | Editing an existing claim never saves to the claim (the save routine isn't connected to any button), and in-drawer submit is unwired. | `ClaimDetailDrawer.tsx:378-395, 624-666` | High | G7-C-16 |
| G7-E-29 | [SECURITY] The claim activity feed fabricates entries, including "Real-time 270/271 Eligibility Verified", when history is empty. This compromises audit integrity and gives a false compliance signal. | `ClaimDetailDrawer.tsx:455-517` | High | G7-C-22 |
| G7-E-30 | The "Submitted & Review" count includes Accepted claims, but its filter excludes them. | `app/pages/Claims.tsx:202` vs `:168` | Low | G7-C-34 |
| G7-E-31 | Missing tracking, batch and EDI numbers fall back to fixed demo values, and the rejection reason falls back to canned text. Both are shown as if real. | `components/claims/ClaimStatusModal.tsx:37-41, 129`; `ClaimSubmissionModal.tsx:162-174` | Medium | G7-C-11, G7-C-13 |
| G7-E-32 | [SECURITY] Patient email is fabricated as `<patientId>@example.com` in Overview and as `patient@example.com` in Documents. This is placeholder PII shown as real contact data. | `ClaimDetailDrawer.tsx:356, 881` | Low | G7-C-15 |
| G7-E-33 | Allowed Amount = billed × 0.85, and Patient Responsibility derived from it, are shown as real figures (hardcoded – formula undefined). | `ClaimDetailDrawer.tsx:364, 911-930` | Medium | G7-C-20 |

Severity count (33): **Critical 2** (E-06, E-25) · **High 16** (E-01, 02, 05, 08, 09, 10, 11, 13, 14, 18, 19, 23, 26, 27, 28, 29) · **Medium 9** (E-04, 07, 12, 15, 16, 17, 22, 31, 33) · **Low 6** (E-03, 20, 21, 24, 30, 32).

---

## Open questions for PM
| ID | Question | Related |
| :--- | :--- | :--- |
| G7-Q-01 | Should inactive catalogue items exist, with a toggle and a Status column? Should historic invoices still show them? | G7-S-02, G7-S-06, E-01/02, D1 F-1.1 |
| G7-Q-02 | Which category list is canonical (PRD vs built), and can users add custom categories? | G7-S-07, D1 F-1.3 |
| G7-Q-03 | Should the catalogue be single-currency (USD), or support per-item / per-org currency? | G7-S-09, D1 F-2.2 |
| G7-Q-04 | What is the invoice status vocabulary and its mapping to stages? Should a Void stage be seeded by default? | G7-I-04, E-22, E-24, D2 F-1.7 |
| G7-Q-05 | Can an invoice be moved to Paid without a recorded payment, and by which role? Should a Kanban drop on Paid open Record Payment? Should a drop on Void confirm? | G7-I-03, G7-I-12, E-23, D2 F-1.4/F-1.8 |
| G7-Q-06 | How should write-offs be stored and reported (not as cash), and do they need approval or a specific role? | G7-I-20, G7-I-40, E-18, D2 F-4.2 |
| G7-Q-07 | What invoice number format should be used (`INV-CL-####`, `INV-YYYY-###`, …)? Should numbering be per organisation? | G7-I-08, E-06/07, D2 F-2.5 |
| G7-Q-08 | Confirm that "Paid This Month" = payments by payment date in the current calendar month. | G7-I-25, E-17, D2 F-1.1 |
| G7-Q-09 | What tax applies to a line with no tax rate: 0%, the item's own tax, or an org default? | G7-I-07, E-09, E-10, D2 F-2.3 |
| G7-Q-10 | Where is the discount entered (create drawer vs detail drawer), is it an amount or a %, and does it apply before tax? | G7-I-06, E-08, D2 F-2.3 |
| G7-Q-11 | Should Total Invoiced exclude drafts and voids? | G7-I-23, D2 F-1.1 |
| G7-Q-12 | Which statuses count toward Outstanding? | G7-I-24, D2 F-1.1 |
| G7-Q-13 | Should invoice creation be gated by an invoice automation? If so, what qualifies as one? | G7-I-22, E-20, D2 F-2.6 |
| G7-Q-14 | Which claims process ("Insurance and Claims" vs "Claims Management") and which status set (Accepted vs Acknowledged, Denied vs Rejected) are canonical? What is the single stage→status mapping? | G7-C-09, G7-C-30, E-27, D3 §1, F-2.7 |
| G7-Q-15 | Should claims be built from appointment / invoice / AI Scribe data, as in the orphaned builder? Should insurance payments on invoices update claims? | G7-C-28, G7-C-31, G7-I-39, D3 Cross-product |
| G7-Q-16 | Which roles may manage the catalogue, void invoices, write off, record payments, and create or submit claims? No gating exists today. | G7-S-25, G7-I-12, G7-I-40, G7-C-32, D1/D2/D3 Not yet built |
| G7-Q-17 | What is the formula and data source (payer contract / ERA) for Allowed Amount and Patient Responsibility? | G7-C-20, E-33, D3 F-2.6 |
| G7-Q-18 | What claim number format should be used, and must numbers be guaranteed unique? | G7-C-18, D3 F-2.1 |
| G7-Q-19 | Are `/payments` and `/transactions` owned by Settings/Billing? Should `/payments` be retired or linked from navigation? | Route map |
| G7-Q-20 | Can a catalogue item or claim be deleted once it is referenced, or must it be deactivated? | G7-S-13, G7-C-17, E-04, D1 F-1.5 |
| G7-Q-21 | Should non-bookable items have an editable duration? | G7-S-08, D1 F-2.6 |
| G7-Q-22 | Which invoice fields stay editable after the invoice is Sent? | G7-I-13, D2 F-3.2 |
| G7-Q-23 | Which claim fields are mandatory? Should provider NPI come from Team credentials? | G7-C-05, G7-C-27, D3 F-2.3 |

