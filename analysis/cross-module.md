# Cross-module journeys

_Scope:_ four end-to-end journeys traced through the prototype (`E:\mantra-assist`, code is what counts as built) and the PRD (`E:\ma-prd\content`). _Analysed 2026-11-13._

## Method note

- Every hand-off below was checked by opening the code on both the source and the target side. Where a row relies only on a module report, it says "unverified (from <module file>)".
- IDs such as G6-E-07 point to the module reports in `analysis/modules/`. IDs that start **XM-** are new findings from this pass. They are listed in the last section.
- Where this pass disagrees with a module report, the row says so. There are three disagreements: G11-I-39, the G7-E-10 detail, and G3 section A4 on claims (see "Corrections to module reports"). All three have since been corrected in the module files (see the Corrections log in `00-summary.md`).
- "Built?" means: **Yes** = the data really moves and the target screen shows it. **Partial** = it moves in some cases, or only as a demo, or with wrong or lost data. **No** = nothing moves.
- "Both sides agree?" asks whether the sender and the receiver use the same ids, status words, matching rule and required fields.
- All stores are browser storage in the prototype. "Same store" means the screens share data. It does not mean the data is safe or tenant-scoped (see Cross-cutting).
- [SECURITY] marks security, privacy and PII issues.
- File:line is for citation only. Line numbers are as read on 2026-11-13.

---

## Journey 1: Call → AI Receptionist → Appointment → Scribe → Invoice → Claim

### Hand-offs

| # | Trigger | Data passed | Source (screen, file:line) | Target (screen, file:line) | Built? | Both sides agree? | PRD describes it? | Linked IDs |
|---|---|---|---|---|---|---|---|---|
| 1.1 | A contact enters an AI-handled stage. There is no real telephony. Rows come from a process test chat, from the kiosk, or from a stage move. | client id, client name, process **name**, stage, channel | Workflows → Test Process chat, `TestProcessChatDrawer.tsx:110-116` | Call Logs list, `processLogsStore.ts:154-198` | Partial (log rows only, no calls) | No. One row per client and process **name**, overwritten on each stage change. Channel defaults to "WhatsApp". "In Progress" shows a red error badge. Reports and `CallLogs.tsx` carry two other call lists with different statuses. | Partial. `client/call-logs.md` § F-2.3 describes the log and the intent tag "Appointment Booking". It does not say how entries are created. | G3-X-01, G3-E-13, G3-E-14, G3-E-34, G1-E-09, G3-Q-01, G3-Q-02 |
| 1.2 | The AI answers a caller using clinic knowledge | KB text sources | Knowledge Base screen | AI reply | No. The Knowledge Base is not connected to any AI channel. The chatbot test reply reads a bot knowledge list that module 09 reports as always empty. | n/a | Yes, `client/knowledge-base.md`. | unverified (from 09-kb-receptionist-config.md); G9-E-01 |
| 1.3 | A call ends "with an appointment". Call transcript text says "I've scheduled your consultation". | nothing | Call detail drawer, `CallDetailDrawer.tsx:460-466` | none | No. The text is a canned script. No appointment is created or linked. | n/a | No. Only the tag "Appointment Booking" exists (`client/call-logs.md` § F-2.3). | G3-Q-09, G3-E-02, G3-X (A4 "Call → Appointment") |
| 1.4a | AI stage step "Book Appointment" runs through the automation engine | name, email and phone from the event, else "Client", client@example.com and +1-555-0100. Fixed employee 1. Date and time from the step. Source "ai". | Automation rule engine, `ruleEngine.ts:965-975` | Appointments store, `appointmentService.ts:702-716` | Partial. It only runs if a rule fires on an event that is emitted. No call event is emitted. | No. The client is matched by email OR name OR phone, so placeholder values never match. An appointment can exist with no client link. No service or location is passed. No conflict check. | No. `client/workflows.md` § 1 names the trigger "Appointment Booked", not an AI booking action. | G8-E-09, G8-E-01, G6-B-10, G6-B-12, G6-E-19, G6-B-14 |
| 1.4b | The same "Book Appointment" step run in the Workflows test chat | test contact | `processChatSimulator.ts:195-246`, called from `TestProcessChatDrawer.tsx:126-141` | Invoices store | **No appointment.** The chat says "Appointment booked · Invoice generated". It creates a real invoice with a made-up appointment reference and a placeholder price. | No | No | **XM-01** |
| 1.5 | Staff books an appointment, with the invoice option on or an invoice rule present | client, service price and tax lines, discount | Booking drawer, `ScheduleAppointmentDrawer.tsx:1117-1145` | Invoices, `appointmentService.ts:801-834` → `invoiceService.ts:601-610` | Yes, if an invoice rule exists | Partial. Appointment id is numeric here and a string on the invoice. Fallback price is 150 and fallback client is "c-1". Duration is always 60. Number = 1050 + count. Tax defaults to 8%. | No (`client/appointments/*.md` and `client/invoices.md` are silent) | G6-B-15, G7-I-33, G6-E-17, G6-E-21, G7-E-06, G7-E-09, G6-E-20 |
| 1.6 | Staff opens "AI Scribe" from the appointment | client id and name, process, appointment id as a **generic record id** | Appointment drawer, `AppointmentDetailDrawer.tsx:1270-1285` | Scribe session, `AIScribePopup.tsx:320-338` | Partial | No. The session stores no appointment link. Content is preset scenario #1 with only the patient name swapped. Patient defaults to the first client when context is missing. | No. `client/scribe.md` does not mention launching from an appointment. | G3-X-08, G3-E-31, G3-E-17, G3-E-18 |
| 1.7 | Scribe finishes inside the appointment drawer | summary text, diagnosis, chief complaint, symptoms, plan, medications | `AppointmentDetailDrawer.tsx:383-453` | Same appointment record (notes and description) | Yes | Yes (same store). It replaces existing notes with the Scribe summary. | No | none (intended behaviour not yet decided; see G3-Q-13 on sign-off) |
| 1.8 | Staff opens the appointment's "Calls" tab | client's call logs | `AppointmentDetailDrawer.tsx:658-697` | Call Logs store | Partial | No. When the client has no calls, two invented completed calls with recordings are shown. | No | G6-E-25, G3-E-32 |
| 1.9 | Staff launches Scribe from the invoice and the invoice is filled | transcript excerpt, chief complaint, diagnosis | Invoice detail drawer, `InvoiceDetailDrawer.tsx:1163-1180` | Invoice detail fields, `InvoiceDetailDrawer.tsx:489-537` | Partial | No. Notes, diagnosis and chief complaint are kept as per-invoice browser fields only. Billing lines are never produced because Scribe makes no billing codes. The save call to the invoice service does not exist, so totals never change. The session stores no invoice link. | No | G3-X-04, G3-X-05, G3-E-29, G7-E-11, G7-I-35, G3-Q-14 |
| 1.10 | Staff creates a claim (button "Create Claim") | typed values only | Claims, `Claims.tsx:430-436` | Claim detail drawer in create mode, `ClaimDetailDrawer.tsx:575-590` | **No hand-off.** No appointment, invoice or Scribe data is read. The claim stores no appointment or invoice reference. Payer id is a fixed placeholder. | n/a | Partial. `client/claims.md` § F-1 says claims link "patient encounter charges" to ICD-10 and CPT. It names no source screen. | G7-C-28, G7-C-31, G7-E-25, G7-Q-15 |
| 1.11 | Create Claim "from appointment, invoice and Scribe" (the builder with auto-fill) | appointment date, latest Scribe session for the client (rendering provider, DOB, ICD-10) | `CreateClaimDrawer.tsx:247-289` | Claim diagnoses | **No. The drawer is not imported by any page.** If it were mounted, it would match a session by client id OR name OR appointment id (which is never set), guess codes by keyword, and invent a birth date. | No | No | G7-C-28, G3-X-06, G3-X-07, G3-E-30, G3-E-31 |
| 1.12 | Staff records an insurance payment on an invoice | free-text payer and claim reference | `RecordPaymentModal.tsx:292-314` | Claim | No. The claim is not updated. | n/a | No | G7-C-31, G7-I-39, G7-E-18 |

### Journey verdict
No, a user cannot complete this journey as one flow. Each screen works alone, and a determined staff member can walk call log → manual appointment → Scribe → invoice → manual claim, but the data does not travel. The call and the AI receptionist never create an appointment. In the Workflows test chat the AI says "Appointment booked" when only an invoice was made (XM-01). The rule-engine path can create an appointment, but it is not triggered by calls and uses placeholder identity. Scribe produces a canned record, so everything downstream rests on made-up clinical content. The appointment → Scribe → invoice steps hand over text only (notes, diagnosis), never billable lines, and the invoice edits are not saved. The last step is broken completely: claims are typed by hand, and the only builder that pulls from Scribe, appointment and invoice is not mounted.

### Break points (ranked by impact)
1. **Invoice and Scribe to Claim: no hand-off.** The claim is rekeyed. The auto-fill builder is unmounted (G7-C-28, G3-X-07, G3-E-30). This is revenue and compliance impact.
2. **Call and AI receptionist to Appointment: no hand-off.** The only built paths are an untriggerable rule and a test chat that reports a booking that did not happen (XM-01, G8-E-09, G3-Q-09).
3. **Scribe content is canned and may be attached to the wrong patient.** Clinical data is not real, and the appointment link is lost (G3-E-17, G3-E-18, G3-E-31).
4. **Scribe to Invoice carries no billable data.** Invoice edits are not saved (G3-E-29, G7-E-11).
5. **Invoice money fields are placeholders.** Number reuse, default 8% tax, 150 price and "c-1" client (G7-E-06, G7-E-09, G6-E-21).
6. **Call Logs is not a call log.** One overwritten row per client and process, mislabelled channel, three disagreeing call lists (G3-Q-02, G3-E-14, G1-E-09).

### What the PRD should say
- **Call Logs** is the record of telephone and messaging interactions. Decision needed: is it calls only, or also SMS, WhatsApp and kiosk process events, and is it one entry per call or one per client and process? (G3-Q-02)
- When the AI receptionist books a patient during a call, the appointment is created in the appointment workflow's first stage, linked to the client and to the call log entry. Decision needed: should the call entry show the appointment link, and may staff create a task from a call? (G3-Q-09)
- Decision needed: which services, locations and providers may the AI book, and does it follow the clinic's availability and conflict rules? (G6-Q-07)
- A new appointment may create exactly one invoice, linked to that appointment. Decision needed: define when the invoice is created, which price and tax apply, and invoice number format (G6-Q-08, G7-Q-07, G7-Q-09).
- Scribe is started from an appointment with that appointment linked. After sign-off, its summary appears on the appointment. Decision needed: what exactly Scribe may push to the invoice (suggested services or codes and fees) and whether a clinician must confirm (G3-Q-14); who may sign off (G3-Q-13).
- Decision needed: should a claim be built from the appointment, invoice and Scribe data, with ICD-10 only from clinician-confirmed extraction? (G7-Q-15, G3-Q-14)
- Decision needed: should an insurance payment on an invoice update the claim? (G7-Q-15)

---

## Journey 2: Kiosk check-in (scheduled, walk-in, phone OTP) → Appointment → Billing (invoice lookup, QR pay)

### Hand-offs

| # | Trigger | Data passed | Source (screen, file:line) | Target (screen, file:line) | Built? | Both sides agree? | PRD describes it? | Linked IDs |
|---|---|---|---|---|---|---|---|---|
| 2.1 | Visitor types a phone number and a 4-digit code | phone digits, code | Kiosk keypad and OTP, `AvatarReceptionView.tsx` (module cites 2057-2096) | Client lookup, `mockMaClient.ts:642-696` | Yes (demo) | No. The kiosk matches exact, last 10 digits, ends-with and **contains** (either way) once 7 digits are typed. Clients store phones in several fields and formats. Code 1234 or 0000 works for any number. | Yes. `ai-receptionist/checkin/phone-otp.md` § F-1, F-2 (normalise and match last 10 digits, 5-minute expiry). Contradicted by the build. | G11-E-03, G11-E-04, G11-I-59, G11-I-61 |
| 2.2 | A single patient is found | kiosk patient id | Kiosk, `AvatarReceptionView.tsx:2295-2310` | Appointment lookup, `mockMaClient.ts:842-905` | Partial | No. The lookup reads the kiosk's own store plus the clinic appointment store. It matches by id, **phone ending, or exact name**. It has no date or status filter. The kiosk takes the first result as "today". The kiosk uses demo ids (pat_1, pat_3) mapped by hand to CL-001 and CL-013. | Yes. `checkin/scheduled.md` § F-1.1 (today's lookup) | G11-E-20, G11-I-32 |
| 2.3 | Patient taps confirm on the visit summary | appointment id, client id | Kiosk, `AvatarReceptionView.tsx` (module cites 2373-2380) | Check-in, `mockMaClient.ts:1223-1250` | Partial (token and journey are made) | No. See 2.4. When no appointment exists, the summary invents one (Cardiology, Dr. Rajesh Patel, 11:00 AM). | Yes. `checkin/scheduled.md` § F-2, F-3 | G11-E-21, G11-E-23 |
| 2.4 | Check-in marks the appointment | appointment id | `mockMaClient.ts:1230-1232, 1378-1383` | Appointment record, `appointmentService.ts:1138-1162` | **No for staff-booked appointments; No for kiosk-booked ones.** The kiosk looks the appointment up in its own store only. A staff-booked appointment is merged into the lookup result but never saved there, so the kiosk finds nothing and never calls the appointment service. A kiosk-booked walk-in has an id like `apt_<time>` that the appointment store does not know. The call fails and the failure is swallowed. Even when it works, it records only a check-in time. Status and stage do not change. Check-in automations are deleted when rules load. | No (different ids; no status or stage change) | Yes. `checkin/scheduled.md` § Cross-product Summary ("calendar slot switches to Arrived with its token") and § F-3.2. `client/appointments/list.md` § Cross-product Summary (status becomes "Arrived"). | G6-E-07, G6-Q-04, G11-E-27, G11-E-42, G8-E-11, **XM-02**. G11-I-39 is now a Prototype defect. |
| 2.5 | Check-in audit and timeline | check-in event, audit entry | `mockMaClient.ts:1360-1366` | Kiosk browser storage | Partial. Audit stays in the kiosk's storage. The check-in event reaches a rule only if a rule exists, and check-in rules are removed. | n/a | Yes. `checkin/scheduled.md` § Cross-product Summary (patient timeline and front-desk broadcast). | G11-E-13, G11-Q-17, G8-E-11 |
| 2.6 | Walk-in registration approved | name, age, gender, reason, email, face data, phone | Kiosk review, `mockMaClient.ts:706-840` | Clients store, `clientsStore.ts:217-301` | Yes | Partial. Duplicates are matched by name plus last 10 digits, or name alone when a phone is missing. This is a different rule from the website chat and form paths. A known number is prefilled but a second record is still created on approve. | Yes. `checkin/walk-in.md` § F-3.2 | G11-E-28, G2-E-11, G11-Q-22, G2-Q-01 |
| 2.7 | Same approval | client, default onboarding process, stage "Initial Contact" | `mockMaClient.ts:794-801` | Process board (Deals) and Call Logs, `processLogsStore.ts:154-198` | Yes | Partial. The deal amount is a fixed 150 whatever the service. The call log row is labelled "WhatsApp". The deal is matched by client name. The onboarding process can be silently overridden by the appointment default. | Partial. `checkin/walk-in.md` § Cross-product Summary (Default Onboarding Workflow, coordinators see it on the Kanban). Deal amount and call log row are not described. | G11-E-29, G3-E-14, G5-E-02, G9-E-10, G11-Q-25 |
| 2.8 | Visitor picks service and doctor | service, doctor, time, reason | Kiosk, `mockMaClient.ts:1138-1186` | Appointments store (forced create) | Partial | No. A copy is saved in the kiosk's own store (`apt_<time>`) and a second record in the clinic store with a different numeric id. No link is kept between them. Created as "Confirmed" (initial stage), not "Arrived". "Next Available" takes the first listed doctor. No conflict check. An invoice appears only if an appointment-to-invoice rule exists. | Partial. `checkin/walk-in.md` § F-4.3, § Cross-product Summary ("marked Arrived"). | G11-E-26, G11-E-27, G6-E-19, G6-B-10, G11-I-56 |
| 2.9 | Visitor opens Billing, phone gate passed | kiosk patient id | Kiosk, `AvatarReceptionView.tsx` (module cites 2186-2217) | Invoice lookup, `mockMaClient.ts:1747-1790` | Yes, with a data leak | No. It matches by client id, **exact name**, or **phone contains**. If nothing matches, it returns **every unpaid invoice in the system** (names, items, amounts). Void invoices with a balance count as unpaid. The kiosk shows the invoice id as the "invoice number". A face match can also open billing. | Yes. `billing/invoices.md` § F-1, F-2.1 (scoped to the verified patient) | G11-E-05 [SECURITY], G11-I-99, G11-Q-11, **XM-06** |
| 2.10 | Appointment created an invoice | invoice | Appointments (1.5) | Kiosk ledger | Partial | Invoice client id may be a fallback ("c-1") that no kiosk patient has, so it appears only via the all-unpaid fallback in 2.9. | Yes. `billing/invoices.md` § Cross-product Summary ("Live Invoice & Ledger Sync") | G6-E-21, G11-E-05 |
| 2.11 | "I Have Paid - Settle Invoice Now" | invoice id, full balance, method "QR Code", memo | Kiosk QR card (module cites `AvatarReceptionView.tsx:2133-2171`) | `mockMaClient.ts:1802-1808` → `invoiceService.ts:759-880` | Yes | Partial. The invoice is found by id, number, or **digits only**. If it is not found, the service creates a new "paid" invoice for client CL-001 named "Patient". It does not refuse void invoices, and it can reopen one as paid. The QR is a fixed-payee INR link with USD amounts. No proof of money. Kiosk payment does not move the client's stage (portal payment does). | Yes. `billing/qr-pay.md` § Cross-product Summary (clinic ledger flips to Paid, "Paid via AI Receptionist QR Kiosk"). Gateway reconciliation is PRD-only. | G11-E-16, G11-E-17, G11-E-18, G11-I-118, G7-E-19, **XM-06** |

### Journey verdict
Partly, as a demo. A visitor can verify by phone, get a token, register as a walk-in (client, deal, call log row and appointment are all created), look at bills and tap "I have paid", and the invoice store shows Paid. But the PRD's central promise is not met: the staff calendar is not told the patient has arrived (2.4). Scheduled check-in does not reach the appointment, and a walk-in is booked under a second id, as "Confirmed". The lookup is neither scoped to today nor to the verified patient, so the wrong appointment or someone else's bills can appear. Payment is self-declared.

### Break points (ranked by impact)
1. **Billing ledger shows other patients' invoices** (G11-E-05 [SECURITY]), with a nearly free phone and OTP gate (G11-E-03, G11-E-04).
2. **Payment is recorded on a tap with no proof, and a bad id creates a paid invoice for CL-001** (G11-E-16, G11-E-17).
3. **Check-in never reaches the appointment** (XM-02, G6-E-07, G8-E-11). The "Arrived" promise in two PRD files is unmet, and the front desk is not notified.
4. **Wrong or invented visit shown** because the appointment match has no date or status filter, matches by name, and falls back to a fabricated appointment (G11-E-20, G11-E-21).
5. **Double records for walk-ins**: kiosk copy and clinic copy under different ids; duplicate client on approve (G11-E-27, G11-E-28).
6. **Voided invoices stay payable** at the kiosk (XM-06).

### What the PRD should say
- After a patient is verified, the kiosk lists only that patient's appointments for **today** that are still open. Decision needed: how far a late or early arrival may be from the slot (G11-Q-09), and which statuses count as open (G6-Q-03).
- Confirming check-in sets the appointment to "Arrived" with arrival time and token, shown in the Appointments list and calendar, and notifies the front desk. Decision needed: whether status "Arrived" is a status or a workflow stage (G6-Q-03, G6-Q-04).
- A walk-in approval creates one client (or links to an existing one) and one appointment, and enters the clinic's Default Onboarding Process. The kiosk and the clinic use the same appointment record. Decision needed: link or create when the phone matches an existing client (G11-Q-22); deal amount (G11-Q-25); which setting wins between the onboarding and appointment defaults (G9-Q-09).
- The billing ledger shows only the verified patient's unpaid invoices. Decision needed: what may be shown or spoken in a public lobby (G11-Q-06); whether a face match may open billing (G11-Q-11).
- Voided invoices never appear for payment. Decision needed: how a payment is confirmed (gateway or staff) before an invoice becomes Paid (G11-Q-01), and which currency and payee the QR uses (G11-Q-21).

---

## Journey 3: Web form → Client → Process → Task (and website chat widget → Client → Process)

### Hand-offs, web form

| # | Trigger | Data passed | Source (screen, file:line) | Target (screen, file:line) | Built? | Both sides agree? | PRD describes it? | Linked IDs |
|---|---|---|---|---|---|---|---|---|
| 3.1 | A visitor opens the public form link and submits | field values | Web Forms → share link and embed code, `WebForms.tsx:526-527` | the form page | **No.** The link and embed point to a placeholder domain with nothing behind it. The only submit paths are the in-app Preview and Test pages. | n/a | Yes. `client/web-forms.md` § F-1.2 (public URL, iframe embed) | G8-E-18, G8-I-62 |
| 3.2 | Form submit (Preview or Test) with "Create submitter as client profile" on | email, phone, name, country, mapped company, role, custom fields | Web Forms, `WebForms.tsx:1027-1160` | Clients, via the browser's session copy of the client list (`WebForms.tsx:786-791`) | Partial | No. Match is by email OR phone digits, exact. A stored phone with other formatting misses. It fills only empty core fields on a match. No required-field check, so a blank submit makes a client named "New Contact". New id is `CL-` plus six digits. No contact category is set (the chat widget sets one). The page writes the client list to **session storage only**, while the Clients directory reads the **local copy first**, so the new client may not show, and a later save can overwrite it. Not confirmed at runtime. The feature is off by default; the PRD says always. | Partial. `client/web-forms.md` § F-1.3 and acceptance F-1-1 ("automatically create or update"). The PRD says "patient" and implies always-on. | G8-I-63, G8-I-64, G8-I-70, G8-E-22, G8-E-27, G2-E-11, G2-E-13, G8-Q-14, G8-Q-15, **XM-04** |
| 3.3 | Same submit | submission with all answers | `WebForms.tsx:1180-1190` | Client profile → Forms tab (`ClientProfile.tsx:1985`) | Yes | Yes (same client id). No timeline event. | Partial. § F-1.3 promises a timeline event. | G8-I-75, G8-I-65 |
| 3.4 | Same submit, client placed in a chosen process and stage | process name, stage name | `WebForms.tsx:1100-1118` | Client record only. Not the Process page: its List reads the process-log store (`Deals.tsx:310-315`) and its Kanban reads a separate deals list (`Deals.tsx:565-595`). | **No (text only).** The client gets a text stage "<process>: <stage>". No process log row, no deal card, no activity entry, no event. By contrast, "Assign Process" on the client profile does create a deal and a log row (`ClientProfile.tsx:1033-1129`). | No. The form stores the process **name** from a picker that also offers non-client processes (appointment, invoice). The stage is a string. | **No.** `client/web-forms.md` never mentions processes. The "Default process" setting is undocumented. | G8-I-69, G8-I-81, G8-E-25, G5-E-01, G5-E-02, G2-C-09 |
| 3.5 | Submit leads to a task for staff ("front desk notified") | task | none | Tasks | **No.** No automation, form or process action creates a task. Tasks are made only by hand. The client picker in task creation uses a static client list, so a form-created client cannot be selected. | n/a | Partial. `client/web-forms.md` worked example says the front desk is notified. `client/workflows.md` § 1 lists a "Create Task" action node. Neither is built. | G8-I-65, G8-I-07, G8-Q-08, G5-Q-18, G5-E-22 |

### Hand-offs, website chat widget

| # | Trigger | Data passed | Source (screen, file:line) | Target (screen, file:line) | Built? | Both sides agree? | PRD describes it? | Linked IDs |
|---|---|---|---|---|---|---|---|---|
| 3.6 | Visitor sends the first message | name, phone, email, requirement, first message | Website widget test drawer or settings test form, `TestWebsiteChatDrawer.tsx:85-103` | Contact lookup and create, `websiteChatSimulator.ts:76-110` → `clientProcessState.ts:87-121` | Partial. Only a **simulator** exists. No hosted widget is traced. | No. Match is phone OR email OR **name alone** [SECURITY]. A contact is created even when Auto Create is off. Placeholder phone used when none given. Stored in session storage only, id `CL-SIM-<time>`. | Partial. `client/chat/website.md` § F-3 (F-3.5/F-3.6, contact category). The PRD says with Auto Create off, no contact; matching rule is undefined. | G4-E-21, G4-E-22, G4-E-23, G2-E-13, G2-E-14, G4-Q-17, G2-Q-01 |
| 3.7 | Requirement chosen → workflow and stage | process id, stage id | `websiteChatSimulator.ts:109-153` | AI reply and activity entry | Partial. The workflow decides the reply and the activity label only. The contact is deliberately **not** enrolled in the process. No process log row is made on first contact. | Yes within the simulator | Yes. `client/chat/website.md` § F-2 (AC F-2-1, F-2-2). The Cross-product Summary also promises "contact and appointment records" synced to practice management. | G4-WEB-05, G4-WEB-06, G4-WEB-13 |
| 3.8 | The bot moves the visitor to a new stage (test drawer) | client id, process name, stage | `TestWebsiteChatDrawer.tsx:146-175` | Process log row, `processLogsStore.ts:200-240` | Partial. A row is created if none exists. It appears in the Process List only, not the Kanban. | Partial. Matched by client id or name, and process name (case-insensitive). | No (stage move from widget not described) | G4-WEB-28, G5-E-01 |
| 3.9 | Widget conversation leads to an appointment | appointment | none | Appointments | **No.** The widget creates no appointment. | n/a | Yes. `client/chat/website.md` § Cross-product Summary ("contact and appointment records"). | none |
| 3.10 | Visitor chat to inbox | messages | `websiteChatSimulator.ts:155-168` | Chats → Website channel | Yes | Yes | Partial (`client/chat/website.md` § F-1) | G4-WEB-29 |
| 3.11 | Escalation to the Responsible queue, out-of-hours routing | — | none | — | No. Settings are stored but never read. | n/a | Yes. `client/chat/website.md` § F-2.4, F-4 | G4-WEB-08, G4-WEB-21 |

### Journey verdict
No. For the form, the first half works inside the app: a submit in the in-app preview creates or updates a client and files the submission in that client's Forms tab. Nothing public exists to submit from. The Client → Process step is a text label on the client, so the person never appears on the Process boards. The Process → Task step does not exist. The widget path is a simulation: it creates a contact with a category (and without a process, by design), shows a workflow-driven reply, and files messages in the inbox. It creates no appointment and no task.

### Break points (ranked by impact)
1. **Client is not placed in the Process.** A form-created client has no process log row and no deal. A coordinator watching the Process board never sees the lead (G8-I-81, G5-E-01).
2. **No task or front-desk notification** (G8-I-65, G8-I-07). The PRD promises it, so a new lead can sit unseen.
3. **No public form** exists to submit from (G8-E-18).
4. **Client store split** between session and local copies: new clients from forms and the widget may not appear in the directory (XM-04, G2-E-13).
5. **Website chat matches by name alone** [SECURITY]: a stranger's messages land on another person's record (G4-E-22, G2-E-14).
6. **Blank submissions create "New Contact" clients**, and matching differs by channel (G8-E-22, G2-E-11).

### What the PRD should say
- A submitted web form, when "Create submitter as client profile" is on, finds an existing client by email or phone (Decision needed: single rule across all channels, never by name alone, see G2-Q-01) and otherwise creates a client with a contact category. Which fields are required to create a client is a decision (G8-Q-15). Which fields a match may overwrite is a decision (G8-Q-14).
- The form's settings include the process and initial stage. The client is placed in that stage as a real process record, visible on the Process List and Kanban, and stage automations run. Decision needed: should the new client enter the stage and fire stage automations? (G8-Q-08)
- Decision needed: after a submission, is a task created and who is notified? (G8-Q-08, G5-Q-18)
- Decision needed: where forms are publicly hosted and when sharing really sends SMS, WhatsApp or email. (G8-Q-13)
- Website chat creates a contact with the configured Contact Category only when Auto Create is on. The requirement maps to a workflow and stage that drive the reply. Decision needed: whether the visitor becomes a process record, whether any appointment is created, and matching fields. (G4-Q-17)

---

## Journey 4: Patient portal ↔ Appointments / Invoices (booking, prepaid payment, bill/pay, cancellation, forms, messages, tasks)

### Hand-offs

| # | Trigger | Data passed | Source (screen, file:line) | Target (screen, file:line) | Built? | Both sides agree? | PRD describes it? | Linked IDs |
|---|---|---|---|---|---|---|---|---|
| 4.1 | Patient signs in with phone, email or client id plus a code | identifier, code | Portal login (module cites `PatientLoginScreen.tsx:69-119, 192-203`) | Clients store, active patient id | Yes (demo) | No. The code is never checked. Matches raw client id or any phone ending. A missing patient becomes "the first client". Any `/patient/<id>` URL switches patient. | No. No PRD file defines portal sign-in. | unverified (from 12-companion.md): G12-E-01 to G12-E-05, G12-Q-01 |
| 4.2 | Patient self-registers | name, phone, email | Portal login (module cites `PatientLoginScreen.tsx:208-232`) | Clients store | Yes | No. Random id from 900 values, no duplicate check, placeholder email and phone, three processes assigned. | No | unverified (from 12-companion.md): G12-E-06, G2-E-10, G2-E-15 |
| 4.3 | Patient confirms a booking | client id, service, provider, room, date, time, duration, source "MA-Client" | Visits → Book, `PatientBookingScreen.tsx:640-692` | Appointments (calendar and list) via `appointmentService.ts`, forced past the "automation required" gate | Yes | Partial. Client id is passed (good). Email and phone are placeholders when blank. Duration comes from the service (staff drawer always saves 60). Slot logic is a second copy, separate from the staff drawer. No conflict check at save. | Yes. `companion/appointments.md` § F-1; `client/appointments/calendar.md` § Cross-product Summary (calendar sync, real-time slot locking). Slot locking is not built. | G12-I-38, G12-I-44, G12-I-37, G12-I-43, G6-E-19, G6-B-10 |
| 4.4 | Booking confirmed | stage "Client Checked In" or "Payment Done"; process "Patient Care Journey" | `PatientBookingScreen.tsx:695-707` | Client record | Yes | No. The patient looks "checked in" or "paid" before arriving. No process log row or deal is written here. | No | G12-E-15 |
| 4.5 | Prepaid service booked | invoice (no line items passed), payment for price + tax | `PatientBookingScreen.tsx:672-692, 709-745` | Invoices, via `appointmentService.ts:801-834` then `invoiceService.ts:759-880` | Partial | **No.** The appointment service creates the invoice first with its placeholder line (150, 8% tax). The portal's own price-and-tax invoice is never built. The portal then records its computed amount as paid against that invoice, so total and paid differ. The configured deposit type is ignored (invoice is full price). No card charge. QR payee is hard-coded, currency USD. | No. `companion/billing.md` and `client/invoices.md` are silent on prepay. | **XM-03**, G7-E-10, G6-E-20, G6-E-21, G12-E-16, G12-I-41, G6-Q-08 |
| 4.5b | Staff books an appointment | appointment | Staff booking | Portal → Visits, `PatientBookingScreen.tsx:62-90, 775-776` | Yes | No. The portal matches by id OR email OR **name** OR phone, so namesakes see each other's visits [SECURITY]. "Upcoming" is anything not completed or cancelled, so **No-show appears as upcoming**. | Partial. `companion/appointments.md` § 1 (history), § F-1 | G6-E-04, G6-Q-03 |
| 4.6 | Cancellation or reschedule from the portal | — | none | — | **No.** No cancel or reschedule control exists. | n/a | Yes. `companion/appointments.md` § F-1.3 (reschedule or cancel with reason, 24-hour rule). | G12-I-40, G12-Q-05 |
| 4.7 | Staff cancels a portal-booked prepaid appointment | invoice id | Appointments (row cancel, `Appointments.tsx:1853-1864`) | Invoice void, `appointmentService.ts:958-966` | Partial | No. The invoice is voided **even when it is paid**. The portal and kiosk then still list a void invoice with a balance as payable, and payment is not refused. No refund concept. | No | G6-E-23, G6-Q-09, **XM-06** |
| 4.8 | Staff creates an invoice | invoice | Invoices | Portal → Billing, `PatientBillScreen.tsx:41-98, 100-102` | Yes | No. Match by client id OR **name equals** OR phone ending. With no match it lists every unpaid invoice in the clinic, then all invoices, and finally **saves an invented $78.75 invoice** into the shared list. Void is not excluded. | Yes. `companion/billing.md` § F-1; `client/invoices.md` § Cross-product Summary (invoice appears with "Pay Now"). | G12-E-18 [SECURITY], G12-E-10, G12-I-48, **XM-06** |
| 4.9 | Patient taps "Confirm & Record Payment" | invoice id, balance, method QR | Portal → Pay, `PatientPaymentScreen.tsx:141-177` | Invoices and payments, `invoiceService.ts:759-880`; client stage "Payment Done" | Yes | Partial. Any invoice id from the link opens (even another patient's). If missing, the pay page creates a default invoice. Payment is self-declared. Two write paths may duplicate payment rows. | Yes. `companion/billing.md` AC F-1-1 (Matches); gateway is PRD-only. | G12-E-19, G12-E-20, G12-E-21, G12-I-52, G7-E-19, G11-E-17 |
| 4.10 | Staff shares a form (any channel) | client id, form id, status pending | Web Forms share, `WebForms.tsx:927-1004` | Portal → Forms, `PatientFormsScreen.tsx:51-100` | Yes | Partial. A pending form appears in the portal **whatever channel was picked**, though SMS, WhatsApp and email do not send. The portal matches client ids by exact or **digits-only** equality. Every patient also sees default intake forms. The form list comes from browser storage, falling back to a sample list. | Yes. `companion/forms.md` § F-1. Staff share is described in `client/web-forms.md` only through form flows. | G8-E-20, G12-I-67, G12-E-22, **XM-07** |
| 4.11 | Patient submits a form | answers, signature | Portal form fill, `PatientFormFillScreen.tsx:140-165` | Client profile → Forms tab (`ClientProfile.tsx:1985`) | Yes | Yes (same client id). Answers do not update client fields. Pre-filled birth date and insurer for every patient. | Partial. `companion/forms.md` ("syncs to clinic EHR") | G12-I-67, G12-E-22, G12-E-23, G12-Q-10 |
| 4.12 | Staff creates a task for a client contact | assignee client id and name, deliverables | Tasks by me, `TaskQuickCreateDrawer.tsx:491-494` | Portal → My Tasks, `PatientTasksScreen.tsx:40-83` | Partial | No. Staff pick from a **static client catalog**, so newly added or portal-registered clients cannot be chosen. The portal matches by id or **"name contains"**, and shows portal-scope tasks without a named patient to every patient. | Yes. `companion/tasks.md` § Cross-product Summary and § F-1 to F-4 | G5-E-22, G12-E-36 [SECURITY], G12-Q-19 |
| 4.13 | Patient completes a task | deliverable checks | Portal task detail | Same task record | Yes | Yes. Auto-completes and notifies the clinic. | Yes. `companion/tasks.md` § F-2 | G12-I-120, G12-I-121 |
| 4.14 | Staff shares a task to the Client Portal | text message with title, stage, deadline, link | `ShareTaskDrawer.tsx:72, 190-222` | Portal → Messages (conversation store) | Yes | Partial. Recipient list is the same static catalog. The default recipient is CL-001 when the assignee is not a contact. The notice is plain text, not the card the PRD describes. | Yes. `companion/tasks.md` § Cross-product Summary | G5-E-22, G12-Q-20 |
| 4.15 | Patient sends a message | text | Portal Messages, `PatientMessagesScreen.tsx:84-92, 127-135, 306` | Clinic Chats → Companion channel (`Chats.tsx:1545`) | Yes | No. The "clinician" thread is found by client id OR **contact name equals**. Care groups show if the patient is a member, **or the list contains the hard-coded CL-001, or the group is public**. The bot is one shared conversation for all patients. | Yes. `companion/chat/chat.md` § F-3, F-4 | G12-E-27 [SECURITY], G12-E-28, G12-E-30, G12-I-93 |
| 4.16 | Patient arrives and checks in on the phone | arrival | Portal check-in (`routes.tsx:161` sends it to Today) | Appointment status | **No.** No "I have arrived" control; the check-in screen is unreachable. | n/a | Yes. `companion/today.md` § Cross-product Summary | G12-E-12, G12-I-23, G12-Q-02 |
| 4.17 | Patient edits profile; clinic edits contact | name, phone, email, etc. | Profile ↔ Clients | Clients store | Yes | Yes (same store), but patient edits change sign-in identifiers with no re-verification. | Yes. `client/clients.md` § Cross-product Summary (Companion profile sync) | G2-C-08, G12-E-08 |

### Journey verdict
Yes as a demo, no as a safe product. A patient can sign in, book, prepay, see the visit on the staff calendar, see and pay bills, fill forms, work tasks and message the clinic, and clinic screens see the results because every screen shares the same stores. It breaks in four places: cancellation and reschedule do not exist for the patient, and arrival check-in cannot be reached. The prepaid invoice does not match what the patient paid (XM-03). A staff cancel voids a paid invoice. And nothing protects one patient from another: sign-in is not verified, and billing, forms, tasks and messages all fall back to name or wide-open matching.

### Break points (ranked by impact)
1. **No identity or tenant isolation** [SECURITY]: unverified code, URL switching, other patients' invoices, tasks, groups and bot threads visible (G12-E-01 to G12-E-05, G12-E-18, G12-E-27, G12-E-28, G12-E-36).
2. **Prepaid booking records a payment with no charge, against an invoice with a placeholder total** (G12-E-16, XM-03, G7-E-10).
3. **Payment on a tap with no proof, and any invoice id opens** (G12-E-19, G12-E-20).
4. **Staff cancel voids a paid invoice, and void invoices remain payable** (G6-E-23, XM-06). There is no refund path.
5. **Patient cannot cancel or reschedule, and cannot check in** (G12-I-40, G12-E-12).
6. **Booking marks the patient as checked in or paid before arriving** (G12-E-15).
7. **Form and task hand-offs are bound to a static client list and to channels that do not send** (G5-E-22, G8-E-20).

### What the PRD should say
- Patient sign-in uses a real one-time code, a session length and retry limits. The patient sees only their own records. Decision needed: the auth model, whether a client id is a valid login, and duplicate phone or email at registration (G12-Q-01).
- A booked appointment appears on the clinic calendar and list in the first stage of the appointment workflow, with source "Portal". Decision needed: do portal bookings follow the clinic's "appointment automation required" setting (G12-Q-07); how long a slot is held during checkout (G12-Q-06).
- Decision needed: does a prepaid service charge the full price or a deposit, and what counts as paid before the booking is confirmed (G6-Q-08, G12-Q-04)? The invoice total and the payment must match.
- Patients can reschedule or cancel within a clinic-set notice window, with a reason. Decision needed: window, who is told, refund or credit for a paid invoice (G12-Q-05, G6-Q-09).
- The portal lists only the patient's own invoices, never void ones as payable. A payment is recorded only after confirmation. Decision needed: gateway and rails, receipt PDF (G12-Q-04).
- Forms shared to the portal appear only when the share channel is the portal. Decision needed: do answers stay as a submission or update client fields (G12-Q-10)?
- A task for a client contact reaches that contact only. Decision needed: whether portal tasks with no named patient appear for everyone (G12-Q-19).
- Patient check-in from the phone sets "Arrived" on the appointment. Decision needed: whether it creates the same token as the kiosk and whether it is geo-fenced (G12-Q-02).

---

## Cross-cutting issues

### 1. Identity matching across modules

The same person is found, matched or created by different rules in every module. This is the main reason hand-offs "work" in the demo and fail on real data.

| Where | Matching rule (as built) | Source |
|---|---|---|
| Kiosk phone lookup | exact, last 10 digits, ends-with, **contains** either way (7+ digits) | `mockMaClient.ts:662-696` |
| Kiosk appointment lookup | id, phone ending, **exact name**; demo ids pat_1 and pat_3 hard-mapped to CL-001 and CL-013 | `mockMaClient.ts:842-905` |
| Kiosk invoice lookup | id, **exact name**, phone **contains**; else **all unpaid invoices** | `mockMaClient.ts:1747-1770` |
| Kiosk walk-in client | name plus last 10 digits, or **name alone** | `clientsStore.ts:217-301` |
| Web form submit | email OR phone digits, exact; no name | `WebForms.tsx:1047-1050` |
| Website chat widget | phone OR email OR **name alone** | `websiteChatSimulator.ts:82-88` |
| Appointment service (staff, rule, kiosk) | email OR name OR phone | `appointmentService.ts:702-716` |
| Appointment drawer invoices | appointment id OR **client name** | `AppointmentDetailDrawer.tsx:624-633` |
| Portal visits | id OR email OR **name** OR phone | `PatientBookingScreen.tsx:62-90` |
| Portal billing | id OR **name** OR phone ending, else all | `PatientBillScreen.tsx:41-98` |
| Portal forms | id exact, or **digits-only** id | `PatientFormsScreen.tsx:60-66` |
| Portal tasks | id OR **name contains** | `PatientTasksScreen.tsx:40-83` |
| Portal messages | id OR **contact name equals**; group lists CL-001 | `PatientMessagesScreen.tsx:84-92, 127-135` |
| Claim builder (unmounted) | session by client id OR **name** OR appointment id | `CreateClaimDrawer.tsx:247-254` |
| Process log update | client id OR client name; process **name** lower-cased | `processLogsStore.ts:200-240` |
| Process stage move | every deal with the same **client name** is rewritten | G5-E-02 (unverified, from 05-process-tasks.md) |

Id formats that do not line up:
- **Client:** `CL-001` seeds; `CL-100` to `CL-999` random (manual and portal, can collide, G2-E-10); `CL-` plus six digits (web form); `CL-SIM-<time>` (chat widget); kiosk demo ids `pat_1`, `pat_3`; fallback `c-1` (appointment, invoice, test chat); fallback `CL-001` (payment, activity, task share).
- **Appointment:** numeric (staff and portal); `apt_<time>` (kiosk copy); seeded `apt-101` to `apt-104` in claims and Scribe sample data, which can never match a real appointment.
- **Invoice:** `id` is `INV-CL-<1050 + count>` with a separate `invoiceNumber`. The kiosk shows the id as the number. The portal seed uses `INV-CL-1001` with `INV-2026-101`. Payment finds an invoice by id, number or digits.
- **Process:** forms and call logs use the process **name**. The widget uses the process **id**.

Recommendation for the PRD: one canonical rule (for example exact phone or exact email, never name alone) and one stable id per entity, used by every channel (G2-Q-01).

### 2. Status vocabulary mismatches

| Entity | PRD | Built (staff) | Other screens |
|---|---|---|---|
| Appointment | Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show | Stages Booked, Reminder, Completed, Reschedule, No-show. Status scheduled, completed, cancelled, no-show. No Cancelled stage. | Kiosk "confirmed". Portal: upcoming = not completed or cancelled, so No-show shows as upcoming. |
| Invoice | Draft, Pending, Paid, Overdue, Cancelled | Draft, Sent, Viewed, Partial, Paid, Overdue, Void; no Void stage by default | Kiosk: unpaid, partially_paid, paid; void counted as unpaid. Portal: balance greater than zero and not paid. |
| Claim | Draft, Submitted, Acknowledged, Paid, Denied | Two stage-to-status maps (Denied vs Rejected, Accepted vs Ready to Submit) | G7-E-27, G7-Q-14 |
| Call | Completed, Missed, Voicemail | Completed, Failed, Pending, In Progress | Reports: Completed, Failed, Handoff; retry tab BUSY and NO ANSWER (G3-Q-01, G1-E-09) |
| Task | — | Status pending, in progress, completed, deferred. Stage names Created, Completed, Overdue. Overdue stage becomes Deferred. | G5 module |
| Client stage | — | One text "Process: Stage" on the client. Separate deal stage and call-log current stage. | Kiosk, portal and web form each write a different text. Kiosk "Initial Contact", portal "Client Checked In" or "Payment Done", form "<process>: <stage>". |

Check-in is also described three ways: kiosk sets a time only, the portal check-in is unreachable, and the PRD says status "Arrived".

### 3. Duplicated stores
- **Appointments:** the kiosk keeps its own copy (`apt_<time>` ids) beside the clinic store; no link between them (XM-02).
- **Process records:** Process List reads the process-log store; Kanban reads a separately seeded deals list (G5-E-01). A form-created client appears in neither.
- **Call lists:** the Call Logs store, the unused 100-call seed in `CallLogs.tsx`, and 20 static calls in Reports (G3-E-34, G1-E-09).
- **Clients:** session and local copies; some writers use one only (web form, chat widget). The directory reads local first (XM-04, G2-E-13).
- **Payments:** each payment is written through two paths (G7-E-19).
- **Scribe sessions:** session storage only. Documents and activity they created outlive them (G3-E-24).
- **Client catalog for tasks:** a static list, not the live clients (G5-E-22).
- **Forms:** the portal reads a browser copy of forms, falling back to a sample list (`PatientFormsScreen.tsx:51-60`).
- **Claims process:** "Insurance and Claims" versus an unused "Claims Management" (G7-C-30).

### 4. Org isolation
- Scribe, claims and tasks stores have no organisation scoping at all (no organisation reference found in `scribeSessionStore.ts`, `claimsStore.ts`, `tasksStore.ts`).
- Appointments and invoices use one fixed storage key each; the organisation id appears only as a constant "default" on events (`appointmentService.ts:192, 1021, 1098`; `invoiceService.ts:38, 910, 988`). Clients are scoped by organisation only in "fresh workspace" mode (`clientsStore.ts:40-52`).
- The kiosk uses a single constant organisation id (`mockMaClient.ts:54`).
- [SECURITY] The patient portal shows a clinic switcher that lists all organisations to any visitor (G12 A0, unverified from 12-companion.md), and the tenant audit log shows the platform-wide log (G10-E-15, unverified from 10-settings.md).
- Effect on journeys: any hand-off that "falls back to all unpaid invoices" or "first client" (kiosk billing, portal billing, portal login, Scribe patient) crosses patients, and in a multi-tenant deployment would cross tenants.

### 5. Hand-offs in the PRD that the prototype does not deliver

| PRD hand-off | PRD ref | Prototype |
|---|---|---|
| Kiosk check-in makes the calendar slot "Arrived" and shows token | `ai-receptionist/checkin/scheduled.md` § Cross-product Summary, § F-3.2; `client/appointments/list.md` § Cross-product Summary | Not delivered (XM-02, G6-E-07) |
| Kiosk walk-in appointment is created "Arrived" | `ai-receptionist/checkin/walk-in.md` § Cross-product Summary, § F-4.3 | Created "Confirmed", separate id |
| Kiosk arrival notifies front desk and downstream workflows | `checkin/scheduled.md` § Cross-product Summary | Check-in rules are deleted on load (G8-E-11); the kiosk "Call Staff" alert is local only (G11-E-31) |
| Kiosk token and queue sync to the patient portal | `checkin/scheduled.md` § Cross-product Summary | Unverified (from 12-companion.md, G12-I-18 to G12-I-22); portal check-in unreachable (G12-E-12) |
| Web form submission: front desk notified and timeline event | `client/web-forms.md` § F-1, F-1.3 | Not delivered (G8-I-65) |
| Web form public URL and iframe | `client/web-forms.md` § F-1.2 | Link points to a placeholder domain (G8-E-18) |
| Workflow "Create Task" action | `client/workflows.md` § 1, § F-1 | No such step (G8-I-07) |
| Website chat widget syncs contact **and appointment** records | `client/chat/website.md` § Cross-product Summary | No appointment created (3.9) |
| Escalation to Responsible queue; out-of-office routing | `client/chat/website.md` § F-2.4, F-4 | Stored, never read (G4-WEB-08, G4-WEB-21) |
| Portal reschedule and cancel; slot locking | `companion/appointments.md` § F-1.3; `client/appointments/calendar.md` § Cross-product Summary | Not built (G12-I-40, G12-I-37) |
| Scribe note synced to EHR | `client/scribe.md` § 1 | Not built (G3-X-11) |
| Kiosk QR payment reconciled against a gateway; payee and currency from Billing settings | `ai-receptionist/billing/qr-pay.md` § Module Summary, § Cross-product Summary | Self-asserted; hard-coded payee (G11-I-118, G11-E-18) |
| Claim built from the encounter's charges | `client/claims.md` § F-1 | Not delivered; builder unmounted (G7-C-28) |

### 6. Hand-offs built but described nowhere in the PRD
Call Logs entries from kiosk and process events (G3-X-01); appointment → auto invoice (G7-I-33); Scribe → appointment notes and → invoice notes (G3-X-04); portal prepaid booking (G12-I-41); portal booking source and gate bypass (G12-I-43); walk-in deal and call log row (G11-I-53); form auto-create settings including process and stage (G8-I-69); portal self-registration (G12-I-02).

### 7. Corrections to module reports and new findings from this pass

**Corrections to module reports**
- **G11-I-39** rates "Confirm marks the appointment Arrived" as Matches. Reading `mockMaClient.ts:1230-1232, 1378-1383` and `appointmentService.ts:1138-1162`, the appointment is not updated for staff-booked or kiosk-booked appointments, and even a successful call sets a time only. This should be a defect against `scheduled.md`, not a match. Corrected: G11-I-39 is now a Prototype defect, with a new section E row (G11-E-42) in `modules/11-reception-kiosk.md`.
- **G7-E-10** says the portal's own prepaid invoice line gets 8% tax. In practice the appointment service creates the invoice first (with a 150 placeholder line), and the portal's own invoice branch does not run (XM-03). Corrected: G7-E-10 in `modules/07-services-invoices-claims.md` now describes this mechanism.
- **G3 section A4** lists "Create Claim from appointment" and Scribe → Claim as live hand-offs. They only exist in an unmounted drawer (G7-C-28). The live "Create Claim" button has no such link. Corrected: A4, G3-X-06, G3-X-07, G3-E-30 and F-6.2 in `modules/03-call-logs-scribe.md` now say the builder is unreachable.

**New findings (IDs for the glossary)**

| ID | Finding | Evidence | Severity |
|---|---|---|---|
| XM-01 | The Workflows test chat's "Book Appointment" step says "Appointment booked · Invoice generated", but creates **no appointment**. It does create a real, persisted invoice with a made-up appointment reference and a default client ("c-1"). | `processChatSimulator.ts:195-246`; `TestProcessChatDrawer.tsx:126-141` | High (misleads PMs testing the AI receptionist; pollutes the invoice list) |
| XM-02 | Kiosk check-in never updates a staff-booked appointment, and the call for a kiosk-booked walk-in fails silently because the id is unknown to the appointment store. Even a successful call would only set a time. | `mockMaClient.ts:1230-1232, 1378-1383, 1138-1186`; `appointmentService.ts:1138-1162` | High (PRD promise "Arrived" unmet) |
| XM-03 | Portal prepaid booking: the invoice is created inside the appointment service with a placeholder 150 line plus 8% tax, then the portal records its own price and tax as the payment. Invoice total and paid amount differ (invoice left Partial, or over-paid). | `PatientBookingScreen.tsx:672-692, 709-745`; `appointmentService.ts:811-834`; `invoiceService.ts:617-645` | High (revenue) |
| XM-04 | The web form (like the chat widget) writes new clients to the session copy of the client list only, while the directory reads the local copy first. A form-created client may not appear, or may be overwritten. Not confirmed at runtime. | `WebForms.tsx:786-791, 1138-1160`; `clientsStore.ts:40-58` | High |
| XM-05 | The Process board does not show clients created by forms: no process log row and no deal are written. The manual "Assign Process" on the client profile does write them. | `WebForms.tsx:1100-1160`; `ClientProfile.tsx:1033-1129`; `Deals.tsx:310-315, 565-595` | High |
| XM-06 | **Void invoices stay payable.** Kiosk, portal and the payment service do not exclude void invoices. A voided unpaid invoice with a balance still lists as due and can be paid. Paying a void invoice silently turns it Paid. This compounds G6-E-23 (cancel voids paid invoices). | `mockMaClient.ts:1773-1790`; `PatientBillScreen.tsx:100-102`; `invoiceService.ts:759-800` | High (revenue and audit) |
| XM-07 | [SECURITY] Portal forms match the client id by digits only, and every patient is shown the default intake form. Sharing a form by SMS, WhatsApp or email still puts a pending form in the portal, though nothing is sent. | `PatientFormsScreen.tsx:60-100`; `WebForms.tsx:955-975` | Medium |
