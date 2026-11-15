---
title: "Journeys: how the modules connect as built"
product: "reference"
module: "reference"
channel: "journeys"
status: "In Review"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | REFERENCE |
| Module | JOURNEYS |
| Status | In Review |
| Last updated | 2026-11-14 |

## 1. How to read this page

This page follows four journeys across the prototype. It says what data really moves from one screen to the next, and what does not. Every hand-off was checked against the code on both sides, except rows marked unverified.

All data in the prototype sits in browser storage. "Same store" means two screens share data. It does not mean the data is safe or limited to one organisation.

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described. The data moves and the target screen shows it. |
| ◐ Simulated | Looks live but uses preset data, moves only in some cases, or only shows a confirmation. |
| ○ Not built | Nothing happens or the screen cannot be reached. |

Items tagged [SECURITY] are privacy or security problems. They are facts about the build, not requirements.

| Journey | Completes end to end? | As built |
| :--- | :--- | :--- |
| 1. Call to AI Receptionist to Appointment to Scribe to Invoice to Claim | No | Each screen works alone. A person can walk it by hand, but the data does not travel. The last step (claim) is not connected at all. |
| 2. Kiosk check-in to Appointment to Billing | Partly, as a demo | A visitor can verify, get a token, register, look at bills and tap I have paid. The staff calendar is never told the patient arrived. |
| 3. Web form to Client to Process to Task | No | A preview submit creates a client and files the submission. There is no public form, no process placement and no task. |
| 4. Patient portal with Appointments and Invoices | Yes as a demo, no as a safe product | Booking, prepaying, paying, forms, tasks and messages reach the clinic screens. Nothing protects one patient from another. |

## 2. Call to AI Receptionist to Appointment to Scribe to Invoice to Claim

```
Call -> AI Receptionist -> Appointment -> Scribe -> Invoice -> Claim
```

### The story

Sarah Johnson calls the clinic. In the prototype there is no real telephony. Call Logs rows come from the Workflows test chat, from the kiosk, or from a stage move. The AI never books Sarah. A receptionist books her by hand. The doctor opens AI Scribe from the appointment, and the Scribe text lands on the appointment notes. The invoice gets text only. The biller then types Sarah's claim by hand, because nothing reaches Claims.

### Hand-offs

| Step | From to To | Data passed | Status | What happens as built | PRD pages |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1.1 | Process stage or test chat to Call Logs | Client id, name, process name, stage, channel | ◐ Simulated | Log rows only, no calls. One row per client and process name, overwritten on each stage change. Channel defaults to WhatsApp. | [Call Logs](/client/call-logs) |
| 1.2 | Knowledge Base to AI reply | Knowledge text | ○ Not built | The Knowledge Base is not connected to any AI channel. Unverified detail (from the module report): the chatbot test reply reads an always-empty bot knowledge list. | [Knowledge Base](/client/knowledge-base) |
| 1.3 | Call ends with an appointment to Appointments | Nothing | ○ Not built | The call transcript says "I've scheduled your consultation". That text is a canned script. No appointment is created or linked. | [Call Logs](/client/call-logs) |
| 1.4a | AI stage step Book Appointment to Appointments | Name, email, phone from the event, else placeholders | ◐ Simulated | Runs only if a rule fires on an emitted event. No call event is emitted. Placeholder values never match a client. No conflict check. | [Workflows](/client/workflows) |
| 1.4b | Workflows test chat Book Appointment to Invoices | Test contact | ◐ Simulated | The chat says "Appointment booked · Invoice generated". It creates no appointment. It does create a real invoice with a made-up reference and a placeholder price (XM-01). | [Workflows](/client/workflows) |
| 1.5 | Booking drawer to Invoices | Client, service price and tax, discount | ● Works | Works if an invoice rule exists. Fallback price is 150, fallback client is c-1, tax defaults to 8 percent, duration is always 60. | [Booking an appointment](/client/appointments/booking), [Invoices](/client/invoices) |
| 1.6 | Appointment to Scribe session | Client, process, appointment id as a generic record id | ◐ Simulated | The session stores no appointment link. Content is preset scenario 1 with the patient name swapped. The patient defaults to the first client when context is missing. | [AI Scribe](/client/scribe), [Appointments](/client/appointments/list) |
| 1.7 | Scribe to the same appointment | Summary, diagnosis, complaint, symptoms, plan, medications | ● Works | Same store. The Scribe summary replaces the existing appointment notes. | [AI Scribe](/client/scribe), [Appointments](/client/appointments/list) |
| 1.8 | Call Logs to the appointment Calls tab | Client's call logs | ◐ Simulated | When the client has no calls, two invented completed calls with recordings are shown. | [Appointments](/client/appointments/list) |
| 1.9 | Invoice to Scribe and back | Transcript excerpt, complaint, diagnosis | ◐ Simulated | Notes and diagnosis are kept as per-invoice browser fields. No billing lines are produced. The save call to the invoice service does not exist, so totals never change. | [Invoices](/client/invoices), [AI Scribe](/client/scribe) |
| 1.10 | Claims Create Claim button | Typed values only | ○ Not built | No appointment, invoice or Scribe data is read. The claim stores no appointment or invoice reference. Payer id is a fixed placeholder. | [Claims](/client/claims) |
| 1.11 | Claim builder with auto-fill | Appointment date, latest Scribe session | ○ Not built | The builder drawer is not mounted on any page, so Invoice or Scribe to Claim is not built. | [Claims](/client/claims) |
| 1.12 | Invoice payment to Claim | Free-text payer and claim reference | ○ Not built | Recording an insurance payment does not update the claim. | [Invoices](/client/invoices), [Claims](/client/claims) |

### Break points

1. Invoice and Scribe to Claim has no hand-off. The claim is retyped, and the auto-fill builder is not mounted (G7-C-28, G3-X-07, G3-E-30). Decision needed: D-76.
2. Call and AI Receptionist to Appointment has no hand-off. The only built paths are a rule that no call triggers and a test chat that reports a booking that did not happen (XM-01, G8-E-09, G3-Q-09). Decision needed: D-89, D-110.
3. Scribe content is canned and may be attached to the wrong patient. The appointment link is lost (G3-E-17, G3-E-18, G3-E-31). Decision needed: D-79.
4. Scribe to Invoice carries no billable data, and invoice edits are not saved (G3-E-29, G7-E-11). Decision needed: D-76.
5. Invoice money fields are placeholders: invoice number reuse, 8 percent default tax, 150 price and c-1 client (G7-E-06, G7-E-09, G6-E-21). Decision needed: D-69, D-70.
6. Call Logs is not a call log. It holds one overwritten row per client and process, a mislabelled channel and three disagreeing call lists (G3-Q-02, G3-E-14, G1-E-09). Decision needed: D-85, D-83.

## 3. Kiosk check-in to Appointment to Billing

```
Kiosk phone/OTP -> Visit lookup -> Check-in token -> Appointment -> Billing -> QR pay
```

### The story

Ravi Mehta walks up to the lobby kiosk and types his phone number and a four-digit code. The kiosk finds him and shows today's visit. He confirms and gets a token. The staff calendar is never told he arrived. Later he opens Billing, taps I have paid, and the invoice shows Paid with no proof of money.

### Hand-offs

| Step | From to To | Data passed | Status | What happens as built | PRD pages |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2.1 | Kiosk keypad to client lookup | Phone digits, code | ◐ Simulated | Demo only. Code 1234 or 0000 works for any number. The lookup matches exact, last 10 digits, ends-with, and contains once 7 digits are typed. | [Phone OTP](/ai-receptionist/checkin/phone-otp) |
| 2.2 | Kiosk to appointment lookup | Kiosk patient id | ◐ Simulated | Matches by id, phone ending or exact name, with no date or status filter. The kiosk takes the first result as today. Demo ids pat_1 and pat_3 are mapped by hand to CL-001 and CL-013. | [Scheduled check-in](/ai-receptionist/checkin/scheduled) |
| 2.3 | Confirm on the visit summary to check-in | Appointment id, client id | ◐ Simulated | A token and journey are made. When no appointment exists, the summary invents one (Cardiology, Dr. Rajesh Patel, 11:00 AM). | [Scheduled check-in](/ai-receptionist/checkin/scheduled) |
| 2.4 | Check-in to the clinic appointment | Appointment id | ○ Not built | The kiosk never updates a staff-booked appointment. For a kiosk-booked walk-in the call fails and the failure is swallowed. Even a working call would record only a check-in time. Status and stage do not change. Check-in automations are deleted when rules load (XM-02). | [Scheduled check-in](/ai-receptionist/checkin/scheduled), [Appointments](/client/appointments/list) |
| 2.5 | Check-in to audit and timeline | Check-in event, audit entry | ◐ Simulated | The audit stays in the kiosk's own storage. A rule would see the event only if a rule exists, and check-in rules are removed. | [Scheduled check-in](/ai-receptionist/checkin/scheduled) |
| 2.6 | Walk-in approval to Clients | Name, age, gender, reason, email, face data, phone | ● Works | Duplicates match by name plus last 10 digits, or name alone when a phone is missing. A known number is prefilled but a second record is still created on approve. | [Walk-in check-in](/ai-receptionist/checkin/walk-in), [Clients](/client/clients) |
| 2.7 | Walk-in approval to Process board and Call Logs | Client, default onboarding process, stage Initial Contact | ● Works | The deal amount is a fixed 150. The call log row is labelled WhatsApp. The deal is matched by client name. | [Walk-in check-in](/ai-receptionist/checkin/walk-in), [Kanban](/client/processes/kanban) |
| 2.8 | Kiosk booking to Appointments | Service, doctor, time, reason | ◐ Simulated | Two records are saved with different ids (apt_ plus time in the kiosk store, a number in the clinic store) and no link. Created as Confirmed, not Arrived. Next Available takes the first listed doctor. | [Walk-in check-in](/ai-receptionist/checkin/walk-in) |
| 2.9 | Kiosk Billing to invoice lookup | Kiosk patient id | ● Works | Works with a data leak. It matches by id, exact name or phone contains. With no match it returns every unpaid invoice in the system. Void invoices with a balance count as unpaid [SECURITY] (XM-06). | [Billing ledger](/ai-receptionist/billing/invoices) |
| 2.10 | Appointment invoice to the kiosk ledger | Invoice | ◐ Simulated | The invoice client id may be the fallback c-1, which no kiosk patient has. It then appears only through the all-unpaid fallback. | [Billing ledger](/ai-receptionist/billing/invoices) |
| 2.11 | I Have Paid to the invoice service | Invoice id, full balance, method QR Code | ● Works | The invoice is found by id, number or digits only. If not found, a new paid invoice is created for CL-001 named Patient. Void invoices can be reopened as paid. The QR is a fixed-payee INR link with USD amounts. No proof of money. | [QR pay](/ai-receptionist/billing/qr-pay), [Invoices](/client/invoices) |

### Break points

1. The billing ledger can show other patients' invoices [SECURITY], behind a nearly free phone and code gate (G11-E-05, G11-E-03, G11-E-04). Decision needed: D-39, D-40, D-46.
2. Payment is recorded on a tap with no proof, and a bad id creates a paid invoice for CL-001 (G11-E-16, G11-E-17). Decision needed: D-62, D-63.
3. Check-in never reaches the appointment (XM-02, G6-E-07, G8-E-11). Two earlier PRD pages promise Arrived. The front desk is not notified. Decision needed: D-122, D-114.
4. A wrong or invented visit can be shown, because the match has no date or status filter, matches by name and falls back to a made-up appointment (G11-E-20, G11-E-21). Decision needed: D-122.
5. Walk-ins get double records: a kiosk copy and a clinic copy under different ids, plus a duplicate client on approve (G11-E-27, G11-E-28). Decision needed: D-22.
6. Voided invoices stay payable at the kiosk (XM-06). Decision needed: D-63, D-65.

## 4. Web form to Client to Process to Task

```
Web form / website chat -> Client -> Process (Kanban) -> Task
```

### The story

Maria Lopez fills in the clinic's intake form. In the prototype the public link points to a placeholder domain with nothing behind it. Staff can submit only from the in-app Preview or Test page. If the option **Create submitter as client profile** is on, Maria becomes a client and her answers appear on the Forms tab. She does not appear on the Process board, and no task is created. The website chat widget is a simulator that creates a contact, shows a reply and files messages in the inbox.

### Hand-offs, web form

| Step | From to To | Data passed | Status | What happens as built | PRD pages |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 3.1 | Public form link to the form page | Field values | ○ Not built | The share link and embed code point to a placeholder domain. The only submit paths are the in-app Preview and Test pages. | [Web Forms](/client/web-forms) |
| 3.2 | Form submit to Clients | Email, phone, name, country, company, role, custom fields | ◐ Simulated | Matches by email or phone digits, exact. No required-field check, so a blank submit makes a client named New Contact. The page writes the client list to session storage while the directory reads the local copy first, so the new client may not show. Not confirmed at runtime (XM-04). The feature is off by default. | [Web Forms](/client/web-forms), [Clients](/client/clients) |
| 3.3 | Same submit to the client Forms tab | Submission with all answers | ● Works | Same client id. No timeline event is written. | [Web Forms](/client/web-forms), [Clients](/client/clients) |
| 3.4 | Same submit to a process and stage | Process name, stage name | ○ Not built | The client gets only a text stage. No process log row, deal card or event is written (XM-05). The Assign Process action on the client profile does write them. | [Web Forms](/client/web-forms), [Kanban](/client/processes/kanban) |
| 3.5 | Submit to a task for staff | Task | ○ Not built | No automation, form or process action creates a task. Tasks are made only by hand. The task client picker uses a static list. | [Web Forms](/client/web-forms), [Tasks by me](/client/tasks/tasks-by-me) |

### Hand-offs, website chat widget

| Step | From to To | Data passed | Status | What happens as built | PRD pages |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 3.6 | First chat message to Clients | Name, phone, email, requirement, message | ◐ Simulated | Only a simulator exists. It matches by phone, email or name alone [SECURITY]. A contact is created even when Auto Create is off. Stored in session storage only. | [Website chat](/client/chat/website) |
| 3.7 | Requirement to workflow and stage | Process id, stage id | ◐ Simulated | The workflow drives the reply and the activity label only. The contact is deliberately not enrolled in the process. | [Website chat](/client/chat/website) |
| 3.8 | Bot stage move to Process List | Client id, process name, stage | ◐ Simulated | A log row is created if none exists. It appears in the Process List only, not the Kanban. | [Process List](/client/processes/list) |
| 3.9 | Widget conversation to Appointments | Appointment | ○ Not built | The widget creates no appointment. | [Website chat](/client/chat/website) |
| 3.10 | Visitor chat to the inbox | Messages | ● Works | Messages appear in the Website channel of Chats. | [Website chat](/client/chat/website) |
| 3.11 | Escalation and out-of-hours routing | None | ○ Not built | Settings are stored but never read. | [Website chat](/client/chat/website) |

### Break points

1. The client is not placed in the Process. A form-created client has no process log row and no deal, so a coordinator never sees the lead (G8-I-81, G5-E-01). Decision needed: D-111.
2. No task or front-desk notification is created (G8-I-65, G8-I-07). Decision needed: D-111, D-110.
3. No public form exists to submit from (G8-E-18). Decision needed: D-112.
4. The client store is split between a session copy and a local copy, so forms and the widget may create clients the directory does not show (XM-04, G2-E-13). Decision needed: D-22.
5. Website chat can match by name alone [SECURITY], so a stranger's messages can land on another person's record (G4-E-22, G2-E-14). Decision needed: D-22.
6. Blank submissions create New Contact clients, and matching differs by channel (G8-E-22, G2-E-11). Decision needed: D-24, D-23.

## 5. Patient portal with Appointments and Invoices

```
Portal sign-in -> Book -> Appointment + Invoice -> Pay -> Forms / Tasks / Messages
```

### The story

Daniel Okafor opens the patient portal and signs in with his phone number and any code. He books a prepaid consultation. The visit appears on the staff calendar. He pays the bill on a tap. He fills a form the front desk shared, and he messages the clinic. He cannot cancel, reschedule or check in on his phone.

### Hand-offs

| Step | From to To | Data passed | Status | What happens as built | PRD pages |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 4.1 | Portal sign-in to Clients | Identifier, code | ◐ Simulated | Unverified (from the Companion module report): the code is never checked. Any /patient/id URL switches patient, and a missing patient becomes the first client. | [Companion access](/companion/access) |
| 4.2 | Self-registration to Clients | Name, phone, email | ◐ Simulated | Unverified (from the Companion module report): random id, no duplicate check, placeholder email and phone, three processes assigned. | [Companion access](/companion/access) |
| 4.3 | Confirm booking to Appointments | Client id, service, provider, room, date, time, source MA-Client | ● Works | Forced past the appointment automation gate. Email and phone are placeholders when blank. Slot logic is a second copy. No conflict check at save. Slot locking is not built. | [Companion appointments](/companion/appointments), [Appointments](/client/appointments/list) |
| 4.4 | Booking to the client record | Stage Client Checked In or Payment Done | ● Works | The patient looks checked in or paid before arriving. No process log row is written here. | [Companion appointments](/companion/appointments) |
| 4.5 | Prepaid booking to Invoices | Payment for price plus tax | ◐ Simulated | The appointment service creates the invoice first, with a placeholder 150 line and 8 percent tax. The portal's own invoice is never built. The portal then records its computed amount as paid against that invoice, so total and paid differ (XM-03, G7-E-10). No card charge. | [Companion billing](/companion/billing), [Invoices](/client/invoices) |
| 4.5b | Staff booking to portal Visits | Appointment | ● Works | The portal matches by id, email, name or phone, so namesakes can see each other's visits [SECURITY]. A No-show appears as upcoming. | [Companion appointments](/companion/appointments) |
| 4.6 | Portal cancel or reschedule | None | ○ Not built | There is no cancel or reschedule control. | [Companion appointments](/companion/appointments) |
| 4.7 | Staff cancel to invoice void | Invoice id | ◐ Simulated | The invoice is voided even when it is paid. Void invoices with a balance stay payable. There is no refund concept (XM-06). | [Appointments](/client/appointments/list), [Invoices](/client/invoices) |
| 4.8 | Invoices to portal Billing | Invoice | ● Works | Matches by id, name or phone ending. With no match it lists every unpaid invoice, then all invoices, then saves an invented 78.75 invoice into the shared list [SECURITY]. | [Companion billing](/companion/billing) |
| 4.9 | Confirm and Record Payment to Invoices | Invoice id, balance, method QR | ● Works | Payment is self-declared. Any invoice id from the link opens, even another patient's. | [Companion billing](/companion/billing), [QR pay](/ai-receptionist/billing/qr-pay) |
| 4.10 | Staff shares a form to portal Forms | Client id, form id, pending | ● Works | A pending form appears whatever channel was picked, though SMS, WhatsApp and email do not send. Every patient also sees default intake forms (XM-07). | [Companion forms](/companion/forms), [Web Forms](/client/web-forms) |
| 4.11 | Patient submits a form to the client Forms tab | Answers, signature | ● Works | Same client id. Answers do not update client fields. | [Companion forms](/companion/forms), [Clients](/client/clients) |
| 4.12 | Staff task to portal My Tasks | Assignee client id, deliverables | ◐ Simulated | Staff pick from a static client list, so new clients cannot be chosen. The portal matches by id or name contains and shows tasks with no named patient to every patient [SECURITY]. | [Tasks by me](/client/tasks/tasks-by-me) |
| 4.13 | Patient completes a task | Deliverable checks | ● Works | Same task record. It auto-completes and notifies the clinic. | [Tasks by me](/client/tasks/tasks-by-me) |
| 4.14 | Share task to portal Messages | Text with title, stage, deadline, link | ● Works | The recipient list is the same static catalog. The default recipient is CL-001. The notice is plain text, not a card. | [Tasks by me](/client/tasks/tasks-by-me) |
| 4.15 | Patient message to clinic Chats | Text | ● Works | The clinician thread is found by client id or contact name. Care groups show if the patient is a member, the list contains CL-001, or the group is public [SECURITY]. | [Companion chat](/companion/chat/chat) |
| 4.16 | Patient check-in on the phone | Arrival | ○ Not built | There is no I have arrived control. The check-in screen is unreachable. | [Companion today](/companion/today) |
| 4.17 | Profile edit to Clients | Name, phone, email | ● Works | Same store. Patient edits change sign-in identifiers with no re-verification. | [Clients](/client/clients) |

### Break points

1. No identity or organisation separation [SECURITY]. Sign-in is not verified, URLs switch patient, and other patients' invoices, tasks, groups and bot threads are visible (G12-E-01 to G12-E-05, G12-E-18, G12-E-27, G12-E-28, G12-E-36). Decision needed: D-46.
2. A prepaid booking records a payment with no charge, against an invoice with a placeholder total (G12-E-16, XM-03, G7-E-10). Decision needed: D-64.
3. Payment happens on a tap with no proof, and any invoice id opens (G12-E-19, G12-E-20). Decision needed: D-62, D-63.
4. A staff cancel voids a paid invoice, and void invoices stay payable. There is no refund path (G6-E-23, XM-06). Decision needed: D-65.
5. The patient cannot cancel, reschedule or check in (G12-I-40, G12-E-12). Decision needed: D-117, D-122.
6. Booking marks the patient as checked in or paid before arriving (G12-E-15). Decision needed: D-114.
7. Form and task hand-offs are tied to a static client list and to channels that do not send (G5-E-22, G8-E-20). Decision needed: D-112, D-106.

## 6. Cross-cutting issues

### Identity matching across modules

The same person is found, matched or created by a different rule in every module. This is the main reason hand-offs work in the demo and fail on real data. Decision needed: D-22.

| Where | Matching rule as built |
| :--- | :--- |
| Kiosk phone lookup | Exact, last 10 digits, ends-with, contains either way (7 or more digits) |
| Kiosk appointment lookup | Id, phone ending, exact name |
| Kiosk invoice lookup | Id, exact name, phone contains, else all unpaid invoices |
| Kiosk walk-in client | Name plus last 10 digits, or name alone |
| Web form submit | Email or phone digits, exact, no name |
| Website chat widget | Phone, email or name alone |
| Appointment service (staff, rule, kiosk) | Email, name or phone |
| Portal visits | Id, email, name or phone |
| Portal billing | Id, name or phone ending, else all |
| Portal forms | Id exact, or digits-only id |
| Portal tasks | Id or name contains |
| Portal messages | Id or contact name equals, group list includes CL-001 |
| Claim builder (not mounted) | Session by client id, name or appointment id |
| Process log update | Client id or client name, process name lower-cased |
| Process stage move | Every deal with the same client name is rewritten (unverified, from the Process and Tasks module report) |

Ids do not line up either. Clients use CL-001 seeds, CL-100 to CL-999 random ids, CL- plus six digits (web form), CL-SIM- plus time (chat widget), kiosk demo ids pat_1 and pat_3, and fallbacks c-1 and CL-001. Appointments use numbers (staff and portal), apt_ plus time (kiosk copy) and seeded apt-101 to apt-104. Invoices have an id such as INV-CL-1050 and a separate invoice number, and the kiosk shows the id as the number. Processes are matched by name in forms and call logs, and by id in the widget.

### Status vocabularies

| Entity | Earlier PRD | Built (staff) | Other screens |
| :--- | :--- | :--- | :--- |
| Appointment | Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show | Stages Booked, Reminder, Completed, Reschedule, No-show. No Cancelled stage. | Kiosk says confirmed. Portal counts anything not completed or cancelled as upcoming. |
| Invoice | Draft, Pending, Paid, Overdue, Cancelled | Draft, Sent, Viewed, Partial, Paid, Overdue, Void | Kiosk: unpaid, partially_paid, paid, with void counted as unpaid. |
| Claim | Draft, Submitted, Acknowledged, Paid, Denied | Two stage-to-status maps (Denied versus Rejected, Accepted versus Ready to Submit) | Not applicable |
| Call | Completed, Missed, Voicemail | Completed, Failed, Pending, In Progress | Reports: Completed, Failed, Handoff. Retry tab: BUSY and NO ANSWER. |
| Client stage | Not defined | One text such as Process: Stage | Kiosk writes Initial Contact, portal writes Client Checked In or Payment Done, form writes process and stage. |

Check-in is described three ways: the kiosk sets a time only, the portal check-in is unreachable, and the earlier PRD says status Arrived. Decision needed: D-114, D-68, D-75, D-83.

### Duplicated stores

- Appointments: the kiosk keeps its own copy beside the clinic store, with no link (XM-02).
- Process records: the Process List reads the process-log store and the Kanban reads a separately seeded deals list (G5-E-01). A form-created client appears in neither.
- Call lists: the Call Logs store, an unused 100-call seed in the page, and 20 static calls in Reports (G3-E-34, G1-E-09).
- Clients: session and local copies. The directory reads local first (XM-04).
- Payments: each payment is written through two paths (G7-E-19).
- Scribe sessions: session storage only. Documents and activity they created outlive them (G3-E-24).
- Client catalog for tasks: a static list, not the live clients (G5-E-22).
- Forms: the portal reads a browser copy, falling back to a sample list.
- Claims process: Insurance and Claims versus an unused Claims Management (G7-C-30).

### Organisation separation

- Scribe, claims and tasks stores have no organisation reference at all.
- Appointments and invoices use one fixed storage key each. Clients are scoped by organisation only in fresh workspace mode.
- The kiosk uses one constant organisation id.
- [SECURITY] Unverified (from the Companion and Settings module reports): the patient portal shows a clinic switcher listing all organisations, and the tenant audit log shows the platform-wide log.
- Any hand-off that falls back to all unpaid invoices or the first client crosses patients. In a multi-tenant deployment it would cross organisations. Decision needed: D-43.

## 7. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
