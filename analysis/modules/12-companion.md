# G12 — Companion / Patient portal — Gap Analysis
_Sources:_ PRD `content/companion/today.md`, `appointments.md`, `billing.md`, `documents.md`, `forms.md`, `pharmacy.md`, `tasks.md`, `chat/chat.md` | Prototype `/patient` route tree (`src/app/routes.tsx:154-177`) → `src/app/pages/patient/**` plus shared stores in `src/lib` (clients, appointments, invoices, tasks, conversations) | Analysed 2026-11-12

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
|---|---|---|---|---|---|---|---|
| Today (incl. phone check-in) | 0 | 2 | 6 | 0 | 5 | 5 | 12.5% |
| Appointments / Visits (booking) | 1 | 3 | 3 | 0 | 3 | 3 | 35.7% |
| Billing (bill + pay) | 2 | 2 | 2 | 0 | 1 | 4 | 50.0% |
| Forms | 0 | 4 | 4 | 0 | 4 | 2 | 25.0% |
| Documents | 1 | 4 | 2 | 0 | 1 | 2 | 42.9% |
| Messages / Care Bot (chat) | 7 | 3 | 2 | 1 | 5 | 9 | 65.4% |
| Pharmacy | 0 | 1 | 2 | 0 | 1 | 1 | 16.7% |
| Tasks | 11 | 1 | 0 | 0 | 0 | 2 | 95.8% |
| Auth, session, layout, profile (login, register, profile, layout) | 0 | 0 | 6 | 0 | 0 | 9 | No PRD |
| **Totals** | **22** | **20** | **27** | **1** | **20** | **37** | |

Overall coverage: 45.7% · PRD-backed coverage: 50.0%

(Formula per brief: (Matches + 0.5 × Partial) ÷ (Matches + Partial + Missing + Contradicts). Overall = 32 ÷ 70; PRD-backed = 32 ÷ 64, which excludes the 6 "Missing in PRD" rows of the Auth/profile area that has no PRD file.)

## Route map
| Route(s) | Page file | PRD file |
|---|---|---|
| `/patient` (index), `/patient/status`, `/patient/checkin`, `/patient/:clientId` | `pages/patient/PatientStatusScreen.tsx` (all four resolve to the same Today page; `routes.tsx:158,160,161,175`) | `companion/today.md` |
| `/patient/login` (also the registration flow) | `PatientLoginScreen.tsx`; `PatientRegisterScreen.tsx` only redirects to login and is not routed | none |
| `/patient/book` | `PatientBookingScreen.tsx` | `companion/appointments.md` |
| `/patient/bill`, `/patient/pay` | `PatientBillScreen.tsx`, `PatientPaymentScreen.tsx` | `companion/billing.md` |
| `/patient/forms`, `/patient/forms/:formId` | `PatientFormsScreen.tsx`, `PatientFormFillScreen.tsx` | `companion/forms.md` |
| `/patient/documents` | `PatientDocumentsScreen.tsx` | `companion/documents.md` |
| `/patient/messages` | `PatientMessagesScreen.tsx` + `components/PatientGroupInfoDrawer.tsx` | `companion/chat/chat.md` |
| `/patient/care-bot`, `/patient/bot` | `PatientCareBotScreen.tsx` | `companion/chat/chat.md` (only the bot inside Messages is described) |
| `/patient/pharmacy` | `PatientPharmacyScreen.tsx` | `companion/pharmacy.md` |
| `/patient/tasks`, `/patient/tasks/:taskId` | `PatientTasksScreen.tsx`, `PatientTaskDetailPage.tsx` | `companion/tasks.md` |
| `/patient/profile` | `PatientProfileScreen.tsx` | none |
| (all) shell: nav drawer, clinic switcher, bell, floating bot button | `PatientPortalLayout.tsx` | none |
| not routed | `PatientCheckinScreen.tsx` (dead code), `components/CareBotDrawer.tsx` (never imported), `PatientRegisterScreen.tsx` | none |

The whole `/patient` tree sits outside the staff `ProtectedRoute` wrapper (which starts at `routes.tsx:215`). There is no portal guard of any kind.

---

## A. Product map — as built

### A0. Portal shell, sign-in, session and profile (no PRD)
**Purpose.** Give a patient a phone-style portal with a side drawer: Today, Visits, Tasks, Documents, Forms, Billing, Messages (`PatientPortalLayout.tsx:243-251`), a notification bell, an avatar that opens Profile, a floating "Care Bot" button that is hidden on bot and message screens (`:551-561`), and a clinic switcher.
**User roles.** One role: the patient. No caregiver or family role exists. No role gating and no guard of any kind.
**Screens.** Login (4 steps), portal shell, Profile (Personal / Security / Notifications tabs).

**Flow 1 — Sign in with phone or email.**
1. Patient enters a phone or email (`PatientLoginScreen.tsx:87-95`). Empty input shows "Please enter your phone number or email address".
2. After a 300 ms fake delay the app searches all clinic clients by client ID, email, or phone (exact, or one number ending with the other) (`:69-84`).
3. A match goes to a 6-digit code screen. No match goes to "Create your account" with the typed value pre-filled (`:99-117`).
4. On "Verify", the code is not checked at all: any value, including empty, proceeds. It logs in the matched client, or the first client in the clinic list if none matched (`:192-203`).
5. Login saves the active patient ID to session and local storage, shows a welcome toast and opens `/patient/<id>` (`:183-189`).
- Empty/loading/error: empty identifier and registration field validation are handled; a wrong or missing code is NOT handled. No lockout, resend, expiry or rate limit exists.

**Flow 2 — Self-registration.**
1. Name (min 2 chars), phone (min 7 digits) and email (format check) are validated (`:122-138`), then a code screen is shown.
2. After any code, a new client record is created with a random `CL-` plus 3-digit ID, source "Self Gen", fixed US country and "New York, NY", three assigned processes (Patient Care Journey, Client Intake, Appointment Scheduling) and stage "Client Checked In" (`:208-229`). It is added to the same shared client list the clinic uses.
- Not handled: duplicate phone/email check, ID collision check, consent/terms, identity verification.

**Flow 3 — Session.** The active patient is the first of: the ID in the URL path, `?clientId=` / `?id=` in the query string, the stored ID, or `CL-001` (`PatientPortalLayout.tsx:106-118`). Any path segment that is not a known screen name is treated as a patient ID (`:110,129`, `routes.tsx:175`). If the ID is not found, the first client in the list is used, and if there are none a hard-coded "Sarah Johnson" is used (`:163-181`). Sign out removes the stored ID only and returns to login (`:83-88`).

**Flow 4 — Clinic switcher and dev switcher.** The drawer shows a clinic switcher listing all organizations (`:297-351`) and a dashed "Switch Patient (Dev)" button that opens a searchable list of every patient in the clinic (`:387-402`, `DevPatientSwitcherModal.tsx:19`). Both are available to any visitor.

**Flow 5 — Profile.**
1. Personal tab edits name, email, phone, gender, birth date, emergency contact, language and photo (5 MB limit); Save writes straight into the clinic's client record and fires a portal refresh (`PatientProfileScreen.tsx:116-140`).
2. Security tab: new password needs 4+ characters and a matching confirmation; the "current password" is not checked; the password is stored in the client record (`:143-170`). Login never uses it.
3. Notifications tab: SMS / WhatsApp / email / bills toggles show "Notification preferences saved" but only change local screen state (`:80-83,509-511`).

**Business rules (as built).** Identity = client ID, email or phone. Any profile edit is immediately the clinic's data. Default emergency contact is a made-up "Priya Johnson" when blank (`:50-51`).
**KPIs.** None.
**Cross-module references.** Clients list/profile (G-Clients) — registration and profile edits write the shared client store; Process/stage engine — registration assigns processes and the "Client Checked In" stage; Organization switcher (platform shell).

### A1. Today (`/patient`, `/patient/status`)
**Purpose.** Landing page: greeting, today's visit pill, recent tasks, the patient's care-pathway stage card, and shortcuts.
**Roles.** Patient only; no gating.
**Screens/blocks.** (a) Header "Hello, <first name>" with date and clinic name, plus a pill showing today's visit time, doctor and room (`PatientStatusScreen.tsx:559-576`). (b) Up to 3 most recent tasks with progress ring (`:583-690`). (c) Hero stage card for the primary care pathway with a mini stepper, stage headline/description, optional video guides and one button (`:698-800`). (d) Collapsible "Other Care Pathways" (`:812-905`). (e) Quick rows: next appointment, documents, forms, account balance, Care Bot (`:910-995`). (f) Slide-out stage content drawer.
**Flows.**
1. Page loads this patient's appointments (by client ID, phone, or exact name) and invoices (by client ID, name, phone) from the shared appointment and invoice stores, and refreshes on a dozen change events (`:176-250`).
2. Today's visit = the first non-completed, non-cancelled appointment dated today; otherwise a completed one; otherwise any (`:431-441`). Room comes from the appointment or from clinic room rules (`:468-483`).
3. Care pathways = the processes assigned to the client that are visible in the portal. Current stage resolves in this order: latest process log entry, per-process stage map, client's global stage, first stage (`:303-345`). The pathway most recently moved by the clinic (kanban) is shown first (`:507-520`).
4. Stage card button: before the visit completes it opens the stage drawer ("View Details"). After a completed visit in "Patient Care Journey" it becomes "Pay Invoice ($x)" or, if paid, "View Paid Receipt" (`:766-800`).
5. Tapping a stage block once previews it; tapping again opens its drawer (`:532-553`).
6. Quick rows go to Visits, Documents, Forms, Billing/Pay (Pay if a balance exists) and Care Bot.
- No appointment today: pill is hidden and the next scheduled appointment appears in the quick row. No tasks: the task card is hidden. No active client: "No Patient Profile Active" with a Sign In link (`:401-417`) — unreachable in practice (see E-01).
- NOT built from PRD: "I Have Arrived" button, queue ticket, now-serving, patients ahead, ETA, full-screen "your turn" notice.

**Phone check-in (as built).** A full check-in screen exists (`PatientCheckinScreen.tsx`): opened with a client ID in the link it moves the client to the check-in stage of the automation, emits the clinic "client checked in" event, and marks the patient's first appointment checked in (`:51-95`). But `/patient/checkin` is routed to the Today page, not to this screen (`routes.tsx:161`), so it cannot be reached. The Care Bot offers "Check in for today's visit": the full-page bot only moves the client's stage (`PatientCareBotScreen.tsx:297-302`); the Messages bot only prints "Check In Confirmed" (`PatientMessagesScreen.tsx:274-276`). Neither marks the appointment or creates a queue ticket. Compare the **kiosk** (`src/reception/lib/api/mockMaClient.ts:1360-1385`), which issues a token, allocates a station, emits client and appointment checked-in events and marks the appointment checked in.

**Business rules.** Tasks shown to the patient follow the rules in A8. Consent step: the page keeps a "consent signed" flag per client in browser storage (`:100-103`, `:485-488`) but the drawer never calls it (see E-13).
**KPIs & metrics.**
| Metric | Where | Formula / label |
|---|---|---|
| Account balance row | Today quick rows (`:462-466`, `:976`) | Computed: sum over the patient's invoices that are not paid or void of (invoice total − amount paid), never below 0 |
| Pipeline progress percent | calculated at `:375-376` | (current stage number ÷ number of stages) × 100; computed but never displayed |
| Task progress ring | each task row | Computed from this patient's completed deliverables ÷ total (see A8) |
| Doctor ETA / queue position | not built | n/a |

**Cross-module.** Appointments (G-Appointments) — reads shared appointment store; Billing/Invoices (G-Billing) — reads shared invoice store; Process builder/kanban and call logs (G-Processes) — stage and stage content (`portalReceptionSettings`) come from the process definition; Rooms store (G-Rooms/Reception) — room and direction; Tasks (G-Tasks); Kiosk (G-Reception).

### A2. Appointments / Visits (`/patient/book`)
**Purpose.** See upcoming and past visits and book a new one, with optional prepayment.
**Roles.** Patient; no gating.
**Flows.**
1. Visits list has "Upcoming" and "Past" tabs (non-completed/non-cancelled vs completed/cancelled) showing status, doctor, room and date (`PatientBookingScreen.tsx:775-928`). Visits are filtered by client ID or phone (`:62-90`).
2. "Book" opens a 3-step sheet. Step 1: pick a service (shows price) and a clinician or "Any Available Clinician", plus location (`:929-1194`). A banner states the prepaid amount when the service is prepaid or a deposit (`:1016`).
3. Step 2: pick a date (week navigation) and a time. Slots come from the clinician's saved working hours and the service's slot length, minus existing non-cancelled appointments; "Any Available" merges slots across eligible clinicians (`:397-627`). If none: "No open slots on this date" (`:1350-1356`). The first slot is auto-selected (`:630-638`).
4. Non-prepaid service: "Confirm Booking" creates the appointment. Prepaid service: Continue to step 3, a summary with fee + tax and a Card or touchless QR (UPI) tab, then Confirm (`:1391-1610`).
5. Confirm creates the appointment as source "MA-Client", auto-assigns a room, with the booking forced past the clinic's "appointment automation required" check (`:672-692`; check at `appointmentService.ts:638-648`).
6. It then sets the patient's stage to "Payment Done" (prepaid) or "Client Checked In" (not prepaid) and adds "Patient Care Journey" to their processes (`:695-707`).
7. Prepaid: reuses the invoice the appointment service creates at booking (a placeholder line of price 150 with the default 8% tax; only if none exists does the portal build its own line for the deposit/fee) and immediately records a payment for fee + tax as card or QR, so the invoice total and the amount paid can differ (see G7-E-10, XM-03); confetti and "Appointment booked & prepaid payment received!" (`:709-761`).
- Errors: any exception shows "Failed to book appointment". Not built: slot lock while checking out, cancel, reschedule (no buttons exist), calendar invite, confirmation SMS, provider photos/bios.
**Business rules.** Prepaid amount = full service price, or the configured deposit; tax = amount × service tax %; total due = amount + tax (`:259-275`). Slot length = service slot duration or duration or 30 minutes.
**KPIs.** None on screen; fee shown is computed as above; fallback "$75" label when a service has no price (`:995,1046`) — hardcoded – formula undefined.
**Cross-module.** Appointments calendar (G-Appointments) — new booking appears with source "MA-Client"; Services and Team (G-Settings/Catalog) — services, prepaid flags, clinician working hours; Invoices (G-Billing) — prepaid invoice and payment; Rooms (G-Rooms); Process stage (G-Processes).

### A3. Billing (`/patient/bill`, `/patient/pay`)
**Purpose.** Show what the patient owes and let them settle an invoice.
**Flows.**
1. Billing page: hero "Total Outstanding Balance" and a list of invoices with amount, date, and "Settled in full" or "Due: $x" (`PatientBillScreen.tsx:103-247`). Unpaid ones have "Pay $x", paid ones "Receipt"; both just open the payment page with the invoice ID in the link (`:111-118,224-235`).
2. Invoices shown are this patient's (by client ID, name or phone). If none match, it shows all unpaid invoices in the clinic, then all invoices, and if the clinic has none it creates and saves a made-up $78.75 consultation invoice (`:57-97`).
3. Payment page: shows invoice number, total, balance due and a UPI QR code built for that balance (`PatientPaymentScreen.tsx:114-139`). The one button "Confirm & Record Payment" records a full QR payment against the invoice with no check that any money moved, moves the patient to "Payment Done" and shows a receipt number (`:141-200`). After payment: "Back to billing" and "Home" (`:266-280`).
4. The invoice is picked from the link's invoice ID; if absent or unknown, the patient's pending invoice, then any pending invoice, then any invoice, then a made-up default (`:53-112`).
- Not built: card / Apple Pay / Google Pay rails (card exists only in the booking sheet), receipt PDF, itemised category breakdown (copay / diagnostics / pharmacy), tax receipt with clinic address.
**KPIs.**
| Metric | Where | Formula |
|---|---|---|
| Total outstanding balance | Billing hero (`:103-107,131`) | Computed: sum of (total − paid, minimum 0) for the patient's invoices that are not paid |
| Balance due (Pay page) | `PatientPaymentScreen.tsx` | Computed: invoice total − amount already paid |
**Cross-module.** Client invoices and payments (G-Billing) — payment is written to the same invoice and payment store the clinic's Billing screens read; events refresh clinic screens. Pharmacy → Billing hand-off (stage "Pay Bill").

### A4. Forms (`/patient/forms`, `/patient/forms/:formId`)
**Purpose.** Complete clinic forms (intake, consents) from the phone and see past submissions.
**Flows.**
1. List has "To complete" and "Completed" tabs. To-complete = forms the clinic sent this patient (pending submission records) plus every form of type "intake" (or form #5) not yet completed (`PatientFormsScreen.tsx:79-108`). Completed = this patient's completed submissions; tapping one opens a read-only modal with every answer and the signature image (`:314-366`).
2. Fill screen: finds the form by number among the clinic's web forms (`PatientFormFillScreen.tsx:36-55`); name, email, phone are pre-filled from the profile (`:57-70`). Required fields are validated with an inline message and a toast (`:99-114`). Optional finger/mouse signature with clear and re-sign (`:380-395`, `DigitalSignaturePad.tsx:87`).
3. Submit: if the clinic had sent a pending submission it is completed; otherwise a new completed submission is added for this patient with answers, signature image and "Signed At" (local time text) (`:128-165`). Toast and return to the list.
- Not built: autosave/draft, progress bar, undo on the pad, submission confirmation card naming the doctor, lock after submission (the fill link still opens a completed form), PDF with embedded signature, cryptographic timestamp.
**Cross-module.** Web Forms builder (G-Forms) — form definitions; Client profile (G-Clients) — submissions are kept in the shared submissions store, which the client profile reads (`ClientProfile.tsx:1985`). Care Bot "Medical Intake" shortcut and the Today row link here.

### A5. Documents (`/patient/documents`)
**Purpose.** Patient's records vault.
**Flows.**
1. Lists documents for this patient with `show to patient` on, newest first, with category, issuer, date, size (`PatientDocumentsScreen.tsx:116-134`). A search box matches name, category or uploader (`:137-149`). Empty state with Upload button.
2. Three sample clinical documents (prescription schedule, consultation summary, insurance verification) are added for every patient (`:70-113`).
3. Preview modal shows an image if the file is an image; "Download" buttons only show a "Downloading…" toast (`:406-410,709-713`).
4. Upload: choose category, title, notes and a file (image, PDF, doc, docx; 10 MB limit), saved with status "Pending Review" and the patient as uploader, base64 stored in the browser store (`:152-243`, accept list at `:494`).
**Cross-module.** Client profile documents (G-Clients) — same store keyed by client; the clinic's "visible to patient" flag controls what the patient sees (clinic release).

### A6. Messages and Care Bot (`/patient/messages`, `/patient/care-bot`)
**Purpose.** One inbox with the clinician, care groups and a bot; plus a full-page bot.
**Messages flows.**
1. Left list order: clinician chat, then care groups, then Care Bot (`PatientMessagesScreen.tsx:162`). On a phone the list and thread are separate views, tracked by `?chat=` in the link (`:354-366`).
2. Clinician chat = first conversation whose client ID is the patient or, for non-groups, whose contact name equals the patient's name; if none, a pretend thread from "Dr. Alistair Mehta" ("Hello Sarah…") is shown (`:85-123`).
3. Care groups = group conversations where the patient (or the hardcoded ID CL-001) is a member, or the group is public, minus groups the patient has left (`:127-135`).
4. Care Bot = the single shared "care-bot-system" conversation (`:138`; `useConversations.ts:212`).
5. Sending adds the patient's message to the shared conversation store ("me" side), with optional reply quote and an attachment record (name, size, type only) (`:281-312,337-352`). Bot chats get a canned keyword reply after 650 ms (`:314-324`).
6. Five shortcut cards (book, billing & insurance, intake, connect with care team, check in) pre-fill and send an inquiry (`:60-66,327-335`). Replies are plain text pointing to tabs; no buttons, no live balance, no emergency handling.
7. Group info drawer: Members, Files, Tasks tabs and "Leave Group" with a confirmation dialog (`PatientGroupInfoDrawer.tsx:60,256-327,598-635`). Leaving removes the patient from the group's member list and remembers it in browser storage (`:224-246`).
- Not built: unread badges, real delivery states (own messages always show a double tick: `:611`), office-hours notice, emergency keyword escalation, 25 MB limit, "moderators only" locking of the composer, any way to start a new chat (good).
**Care Bot full page flow.**
1. Finds or creates one conversation per patient in the clinic's Companion channel (`PatientCareBotScreen.tsx:100-139`). Welcome text comes from the Companion widget settings.
2. Patient messages are stored on the "contact" side, i.e. the patient (`:326-330`) — the opposite of the Messages screen.
3. If the clinic's widget settings say AI answers first and auto-reply is on, a keyword reply comes after 500 ms; otherwise nothing replies and a human is expected (`:346-372`). "Check in" moves the client stage only (`:297-302`).
**Cross-module.** Clinic Chats (G-Chats): conversations live in the same store the clinic inbox reads (Companion channel filter, `Chats.tsx:1545`); Companion widget settings (G-Settings/AI Receptionist); Task Share to Client Portal posts a text message into the patient's chat (`ShareTaskDrawer.tsx:72`).

### A7. Pharmacy (`/patient/pharmacy`)
**Purpose.** Show dispensary pickup information and move the patient to billing.
**Flows.** Shows a banner "Prescription Ready for Pickup at Pharmacy Counter 3 … Ground Floor, East Clinical Wing" with the patient ID, and a fixed list of three medicines (Amoxicillin, Paracetamol, Vitamin D3) with dose, duration, note and price (`PatientPharmacyScreen.tsx:29-52,68-110`). "Proceed to Billing" sets the patient's stage to "Pay Bill" and opens Billing (`:53-66`). Not in the nav drawer; reached via the stage-to-route table (`PatientPortalLayout.tsx:42`, which is exported but not used elsewhere) or by URL. Not built: real prescriptions, doctor, refills, refill request, schedule, pharmacy hours/phone/directions.
**Cross-module.** Process stage "Move to Pharmacy"/"Pay Bill" (G-Processes); Billing.

### A8. Tasks (`/patient/tasks`, `/patient/tasks/:taskId`)
**Purpose.** Care-team assigned deliverables the patient ticks off.
**Flows.**
1. List: "Action Needed" (default), "Completed", "All" tabs with counts, search over cleaned title, description and deliverable titles, rows with progress ring, star, due date and status pill, empty card "All Caught Up!" / "No matching tasks found" (`PatientTasksScreen.tsx:20-301`).
2. Which tasks appear: never Admin-scope tasks; must be portal-scope or assigned to a client contact; and either assigned to this patient by ID, or by name containing the patient's name, or in the assignee/responsible lists, or a portal-scope task with no named person (visible to everyone) (`:40-90`).
3. Titles drop a leading `[tag]` and `TSK-123:` (`:122`, `PatientTaskDetailPage.tsx:123-125`).
4. Detail: Task Not Available lock screen with "Return to My Tasks" when the task is missing, admin-scope or not matched (`PatientTaskDetailPage.tsx:44-116`). Otherwise Back link, Priority Care badge, "Assigned by your clinical care team • date", progress ring, "X/Y items completed (Z%)", numbered deliverables each with "Mark as done" / "Completed (Undo)" (`:153-301`).
5. Toggle records this patient's completion and time per deliverable; when all responsible people are done the task becomes Completed and the clinic gets a notification; undo re-opens it (`tasksStore.ts:1229-1300`, notification at `:1298-1299`). Toast on each change (`:132-138`).
6. Resources per deliverable: image, video player, link, file download, and HTML shown in a sandboxed frame titled "Clinical Instructions & Protocol" (`:311-376`).
**KPIs.** Action Needed / Done counts and ring: computed from this patient's completed deliverables vs total (`PatientTasksScreen.tsx:112-125`; `getPersonTaskProgress`).
**Cross-module.** Client Tasks "Tasks by me" (G-Tasks) — same store, live in both directions; Chats — Share → Client Portal sends a text "📋 Task Assigned: title, Stage, Deadline, Link"; Admin tasks excluded.

---

## B. Product map — per PRD

### B1. `today.md` — Today's Visit Agenda, Live Queue & Doctor ETA
- **Purpose:** patient's visit-day command centre. **Roles:** patient. **Cross-product:** tapping "I Have Arrived" sets the appointment to Arrived in Client appointments (`today.md § Cross-product Summary`).
- **F-1 Visit card and ETA** (`§ F-1`): F-1.1 header card (avatar, doctor, specialty, suite, time); F-1.2 one-tap I Have Arrived inside a geofence; F-1.3 live wait estimate. Worked example: arrive, tap, get ticket D-104 and Dr. is notified. AC: tapping changes status to checked in and shows the queue token card.
- **F-2 Queue** (`§ F-2`): F-2.1 ticket badge with pulse; F-2.2 now-serving counter, real time; F-2.3 room wayfinding "proceed to Room 204, 2nd floor". AC: when the clinic calls the token, full-screen notice with directions.
- KPIs: none defined (ETA "updates dynamically", no formula).

### B2. `appointments.md` — Booking & Visit History
- **Purpose:** book, reschedule, and review visits. **Roles:** patient.
- **F-1** (`§ F-1`): F-1.1 provider and specialty browser (photos, bios, fees, filter by specialty); F-1.2 date and slot grid of 15/30 min slots, "locks slot during checkout"; F-1.3 one-click reschedule/cancel with mandatory reason and 24-hour notice. Example: choose Dr. Jenkins, Thursday 2:30 PM, confirm; calendar invite and SMS. AC: chosen slot locks immediately so no double booking.
- No mention of prepayment, upcoming/past tabs, or room allocation.

### B3. `billing.md` — Copays, Invoices & Digital Checkout
- **F-1** (`§ F-1`): F-1.1 balance card with breakdown (doctor copay, diagnostics, pharmacy) and Pay Now; F-1.2 payment modal: card, Apple Pay, Google Pay, UPI QR, PCI-DSS; F-1.3 receipt PDF with reference ID and clinic address, saved to history. Example: $35 copay, Apple Pay, 2 seconds, balance resets. AC: successful payment sets balance to zero and marks the invoice paid in Client Billing.

### B4. `forms.md` — Intake Forms & Digital Signature
- **F-1** (`§ F-1`): F-1.1 single-column runner with progress bar and autosave of drafts; F-1.2 signature pad with clear and undo, vector signature embedded in PDF; F-1.3 confirmation card "Your intake has been received by Dr. Jenkins", form locked. Example: new patient signs at home; form syncs to clinic EHR. AC: submitted forms lock and get a cryptographic signature timestamp.

### B5. `documents.md` — Records, Lab Reports & Secure Downloads
- **F-1** (`§ F-1`): F-1.1 list sortable by date with name, clinician, date, size; F-1.2 in-app multi-page PDF viewer with zoom and clinical watermark; F-1.3 patient upload (PDF, JPG, PNG). Summary also promises full-text search and encrypted downloads. AC: documents uploaded by staff appear immediately on physician release.

### B6. `pharmacy.md` — Prescriptions, Schedule & Refills
- **F-1** (`§ F-1`): F-1.1 active prescription cards (drug, dose, frequency, prescriber, refills left); F-1.2 one-tap refill request that notifies the prescriber and, on approval, the patient; F-1.3 dispensing pharmacy address, hours, phone, directions. AC: refill creates a task in the prescribing clinician's queue with previous prescription details.

### B7. `tasks.md` — My Tasks, Protocols & Live Sync (richest PRD)
- **Cross-product:** Client Tasks by me assignment and live completion sync; Chat "Task Assigned" card; Today agenda coordination; Admin task firewall.
- **F-1** list hub: Action Needed / Done pills, 3 tabs, search, title sanitisation, progress-ring rows (`§ F-1`). **F-2** execution screen: task info card, numbered deliverables, Mark as done / Undo, auto-close and reopen (`§ F-2`). **F-3** rich resources: image, video, file, URL, HTML protocol (`§ F-3`). **F-4** privacy: admin lockout, cross-patient isolation, "Task Not Available" lock screen with zero leakage (`§ F-4`).

### B8. `chat/chat.md` — Messaging, Care Chat Bot & Care Groups
- **Roles:** authenticated patients and designated family caregivers.
- **F-1** three-channel rail in exact order: Care Chat Bot, assigned clinician, Care Groups; unread indicators in real time; no way to start new threads (`§ F-1`). **F-2** bot with five shortcut cards, CTA buttons to `/patient/book`, `/patient/bill` (live balance), forms, `/patient/status` check-in; reply within 1 second; emergency keywords return 911 protocol (`§ F-2`). **F-3** clinician thread with header, attribution tag, sent/delivered/read ticks, out-of-hours notice (`§ F-3`). **F-4** care groups auto-ingested from Client within 500 ms, multi-author stream, "Moderators Only" locks composer, archive (`§ F-4`). **F-5** reply quotes and attachments up to 25 MB with download card (`§ F-5`). **F-6** group info drawer: Members, Files, Tasks, Leave Group with confirmation (`§ F-6`).

---

## C. Findings

### C0. Auth, session, shell and profile (no PRD file)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G12-I-01 | Flow | Phone/email sign-in with 6-digit code | Missing in PRD | none (chat.md only says "authenticated patients") | `PatientLoginScreen.tsx:87-119,192-203` | Intended login is clear; no PRD defines identity, code delivery or session. Code check itself is a defect, see E-03 |
| G12-I-02 | Flow | Self-registration creates a clinic client record (source "Self Gen", 3 processes, stage "Client Checked In") | Missing in PRD | none | `PatientLoginScreen.tsx:122-145,208-232` | Cross-module: creates leads/clients in Client. Stage and process defaults need PM sign-off (Q-01) |
| G12-I-03 | Flow | Portal shell: drawer nav (Today, Visits, Tasks, Documents, Forms, Billing, Messages), bell, avatar, floating Care Bot button | Missing in PRD | chat.md mentions "top navigation rail" only | `PatientPortalLayout.tsx:243-251,507-561` | PRD names the tabs per module but never the shell |
| G12-I-04 | Flow | Profile: personal details, photo, emergency contact, language; saves to clinic record | Missing in PRD | none | `PatientProfileScreen.tsx:116-140` | Which fields the patient may edit is undecided (Q-16) |
| G12-I-05 | Flow | Sign out | Missing in PRD | none | `PatientPortalLayout.tsx:83-88` | Clears stored patient only; no session timeout concept |
| G12-I-06 | Flow | Clinic (organization) switcher inside the patient portal | Missing in PRD | none | `PatientPortalLayout.tsx:297-351` | Patient should likely never choose clinic (Q-18) |
| G12-I-07 | Rule | [SECURITY] No auth guard on any `/patient` route; unknown patient falls back to the first client | Prototype defect | — | `routes.tsx:154-157`, `PatientPortalLayout.tsx:163-181` | see E-01 |
| G12-I-08 | Rule | [SECURITY] Any URL segment or `?clientId=` switches the active patient | Prototype defect | — | `PatientPortalLayout.tsx:106-143` | see E-02 |
| G12-I-09 | Rule | [SECURITY] One-time code is never verified | Prototype defect | — | `PatientLoginScreen.tsx:192-203` | see E-03 |
| G12-I-10 | Rule | [SECURITY] Identifier matching on client ID and partial phone | Prototype defect | — | `PatientLoginScreen.tsx:69-84` | see E-04 |
| G12-I-11 | Flow | [SECURITY] "Switch Patient (Dev)" in the production drawer | Prototype defect | — | `PatientPortalLayout.tsx:387-402` | see E-05 |
| G12-I-12 | Flow | Registration after an unverified code; ID collisions | Prototype defect | — | `PatientLoginScreen.tsx:208-232` | see E-06 |
| G12-I-13 | Flow | [SECURITY] Password change without current password; plaintext storage | Prototype defect | — | `PatientProfileScreen.tsx:143-170` | see E-07 |
| G12-I-14 | Flow | [SECURITY] Profile identity edits go straight to clinic record | Prototype defect | — | `PatientProfileScreen.tsx:116-140` | see E-08 |
| G12-I-15 | Flow | Fabricated emergency contact; notification toggles not saved | Prototype defect | — | `PatientProfileScreen.tsx:50-51,509-511` | see E-09 |

### C1. Today
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G12-I-16 | Flow | Visit header: doctor, time, room | Partial (PRD less detailed) | today.md § F-1.1 | `PatientStatusScreen.tsx:559-576` | PRD adds avatar, specialty, suite, clinic address; prototype shows time, doctor, room only |
| G12-I-17 | Flow | One-tap "I Have Arrived" (geofenced) | PRD-only (not built) | today.md § F-1.2, AC F-1-1 | route `routes.tsx:161` renders Today | No button exists anywhere on Today. Built-but-orphaned check-in screen: see E-12 |
| G12-I-18 | Flow | Queue ticket (D-104) shown to the patient | PRD-only (not built) | today.md § F-2.1 | none; kiosk issues tokens `reception/lib/api/mockMaClient.ts:1360-1368` | Kiosk and Companion are not linked (Q-02, Q-03) |
| G12-I-19 | Flow | Now serving / patients ahead | PRD-only (not built) | today.md § F-2.2 | none | Depends on queue data owned by Reception |
| G12-I-20 | Metric | Doctor ETA / wait counter | PRD-only (not built) | today.md § F-1.3 | none | PRD gives no formula either |
| G12-I-21 | Flow | Room wayfinding banner | Partial (PRD less detailed) | today.md § F-2.3 | `PatientStatusScreen.tsx:468-483,572` | Room number shown in the pill; direction text is computed but never shown (E-14) |
| G12-I-22 | Flow | Full-screen "your turn" notification | PRD-only (not built) | today.md AC F-2-1 | none | |
| G12-I-23 | X-ref | Arrival syncs appointment to "Arrived" in Client | PRD-only (not built) | today.md § Cross-product Summary | `appointmentService.ts:1138-1150` sets a checked-in time only | Orphan check-in screen would call it, but cannot be reached |
| G12-I-24 | Flow | Care-pathway hero card, stage stepper, stage drawer and other pathways | Missing in PRD | none | `PatientStatusScreen.tsx:698-905` | Main content of Today is not described in any PRD |
| G12-I-25 | X-ref | Clinic kanban/stage moves drive what the patient sees | Missing in PRD | none | `PatientStatusScreen.tsx:303-345,507-520` | Stage content authored in the process builder (`portalReceptionSettings`) |
| G12-I-26 | Flow | Recent tasks card (3 most recent) | Missing in PRD | tasks.md cross-product row mentions alignment only | `PatientStatusScreen.tsx:583-690` | |
| G12-I-27 | Flow | Quick rows: next appointment, documents, forms, balance, Care Bot | Missing in PRD | none | `PatientStatusScreen.tsx:910-995` | |
| G12-I-28 | Flow | After completed visit the hero button becomes "Pay Invoice" / "View Paid Receipt" | Missing in PRD | none | `PatientStatusScreen.tsx:766-800` | Links visit completion to billing |
| G12-I-29 | Metric | Account balance on Today | Missing in PRD | none | `PatientStatusScreen.tsx:462-466` | Computed (sum of unpaid balance); formula in A1 |
| G12-I-30 | Flow | [SECURITY] Today shows other patients' invoices when patient has none | Prototype defect | — | `PatientStatusScreen.tsx:217-224` | see E-10 |
| G12-I-31 | Flow | Fabricated $78.75 on pay button | Prototype defect | — | `PatientStatusScreen.tsx:788` | see E-11 |
| G12-I-32 | Flow | Check-in screen routed to Today (unreachable); bot "check in" does not check in | Prototype defect | — | `routes.tsx:161`; `PatientCheckinScreen.tsx:31` | see E-12, E-26 |
| G12-I-33 | Flow | Consent signing in stage drawer not wired | Prototype defect | — | `PatientStatusScreen.tsx:485-488,1007` | see E-13 |
| G12-I-34 | Metric | Pipeline percent and room direction computed but unused | Prototype defect | — | `PatientStatusScreen.tsx:375-376,483` | see E-14 |

### C2. Appointments / Visits
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G12-I-35 | Flow | Service and clinician picker (with "Any Available") | Partial (PRD less detailed) | appointments.md § F-1.1 | `PatientBookingScreen.tsx:929-1194` | PRD wants photos, bios, specialty filter; prototype has service price and clinician name |
| G12-I-36 | Flow | Date and slot picker from working hours and service slot length | Partial (PRD less detailed) | appointments.md § F-1.2 | `PatientBookingScreen.tsx:397-627,1329-1388` | Slot length comes from service; PRD fixes 15/30 min; no checkout lock |
| G12-I-37 | Rule | Slot locks during checkout to avoid duplicate booking | PRD-only (not built) | appointments.md AC F-1-1 | slots excluded only at render `:516-521` | Two patients can pick the same slot concurrently |
| G12-I-38 | Flow | Confirm booking creates the appointment immediately | Matches | appointments.md § F-1 worked example | `PatientBookingScreen.tsx:640-692` | |
| G12-I-39 | Flow | Calendar invite and confirmation SMS | PRD-only (not built) | appointments.md worked example | none | |
| G12-I-40 | Flow | Reschedule / cancel with reason, 24 h notice | PRD-only (not built) | appointments.md § F-1.3 | none | Patient cannot change a booking at all |
| G12-I-41 | Flow | Prepaid service or deposit payment inside booking (card or QR, tax) | Missing in PRD | none (billing.md silent on prepay) | `PatientBookingScreen.tsx:259-275,1391-1610` | Revenue-bearing; PRD owner must define (Q-04) |
| G12-I-42 | Flow | Upcoming / Past visit lists with status and room | Partial (PRD less detailed) | appointments.md § 1 "review past encounters" | `PatientBookingScreen.tsx:775-928` | PRD says encounter history, prototype lists appointments only |
| G12-I-43 | Rule | Patient booking bypasses the clinic's "appointment automation required" rule | Missing in PRD | none | `PatientBookingScreen.tsx:692`; `appointmentService.ts:638-648` | Clinic setting is ignored on purpose or by accident (Q-07) |
| G12-I-44 | X-ref | New booking appears in clinic calendar with source "MA-Client", prepaid invoice and payment in client invoices | Missing in PRD | none | `PatientBookingScreen.tsx:672-761` | |
| G12-I-45 | Rule | Booking moves the patient's pipeline stage | Prototype defect | — | `PatientBookingScreen.tsx:695-707` | see E-15 |
| G12-I-46 | Flow | [SECURITY] Prepaid payment recorded without any charge; test card prefilled | Prototype defect | — | `PatientBookingScreen.tsx:181-183,739-748` | see E-16 |
| G12-I-47 | Metric | Fallback fee "$75" shown when service price missing | Prototype defect | — | `PatientBookingScreen.tsx:995,1046` | see E-17 |

### C3. Billing
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G12-I-48 | Metric | Outstanding balance card | Partial (PRD less detailed) | billing.md § F-1.1 | `PatientBillScreen.tsx:103-107,131` | PRD wants breakdown by copay/diagnostics/pharmacy; prototype totals only. Computed |
| G12-I-49 | Flow | Invoice list with Due/Settled, Pay and Receipt actions | Missing in PRD | none | `PatientBillScreen.tsx:195-247` | |
| G12-I-50 | Flow | Payment checkout rails | Partial (PRD less detailed) | billing.md § F-1.2 | `PatientPaymentScreen.tsx:114-139,285-360` | Only UPI QR on pay page; card only inside booking; no Apple/Google Pay, no gateway |
| G12-I-51 | Flow | Receipt PDF download | PRD-only (not built) | billing.md § F-1.3 | success screen shows a receipt number only `PatientPaymentScreen.tsx:221-262` | "Receipt" button just reopens the pay page |
| G12-I-52 | X-ref | Payment marks invoice paid in Client Billing | Matches | billing.md AC F-1-1 | `PatientPaymentScreen.tsx:150-161` | Writes to the shared invoice store |
| G12-I-53 | Metric | Balance resets to $0.00 after payment | Matches | billing.md § worked example | `PatientBillScreen.tsx:103-107,131` | Computed from invoices, so it follows the payment |
| G12-I-54 | Rule | Successful payment moves the patient to "Payment Done" and updates the call log | Missing in PRD | none | `PatientPaymentScreen.tsx:163-177` | Pharmacy → Bill → Pay is a stage chain |
| G12-I-55 | Flow | [SECURITY] Billing shows other patients' invoices; fake invoice saved | Prototype defect | — | `PatientBillScreen.tsx:57-97` | see E-18 |
| G12-I-56 | Flow | [SECURITY] Pay page opens any invoice ID | Prototype defect | — | `PatientPaymentScreen.tsx:53-79` | see E-19 |
| G12-I-57 | Flow | [SECURITY] "Confirm & Record Payment" needs no proof of payment | Prototype defect | — | `PatientPaymentScreen.tsx:141-160,350-360` | see E-20 |
| G12-I-58 | Flow | Pay page invents a default invoice | Prototype defect | — | `PatientPaymentScreen.tsx:83-110` | see E-21 |

### C4. Forms
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G12-I-59 | Flow | To-complete / Completed tabs; clinic-sent pending forms and default intake forms | Missing in PRD | none | `PatientFormsScreen.tsx:79-108` | Forms "sent" by the clinic appear as pending |
| G12-I-60 | Flow | Questionnaire runner with required-field validation | Partial (PRD less detailed) | forms.md § F-1.1 | `PatientFormFillScreen.tsx:99-114` | No progress bar and no autosave |
| G12-I-61 | Flow | Autosave and incomplete drafts | PRD-only (not built) | forms.md § F-1.1 | none | |
| G12-I-62 | Flow | Progress indicator | PRD-only (not built) | forms.md § 2 | none | |
| G12-I-63 | Flow | Signature pad with clear | Partial (PRD less detailed) | forms.md § F-1.2 | `DigitalSignaturePad.tsx:87,99` | No undo; image saved with submission, not embedded in a PDF |
| G12-I-64 | Flow | Signature embedded as vector in PDF | PRD-only (not built) | forms.md § F-1.2 | `PatientFormFillScreen.tsx:128-133` stores an image | |
| G12-I-65 | Flow | Submission confirmation card naming the doctor | Partial (PRD less detailed) | forms.md § F-1.3 | `PatientFormFillScreen.tsx:185-186` | A toast and redirect only |
| G12-I-66 | Rule | Submitted form locks; cryptographic signature timestamp | PRD-only (not built) | forms.md AC F-1-1 | "Signed At" is local time text `:131-132` | |
| G12-I-67 | X-ref | Submission reaches the client record | Partial (PRD less detailed) | forms.md worked example ("syncs to clinic EHR") | `PatientFormFillScreen.tsx:150-165`; `ClientProfile.tsx:1985` | Stored as a submission on the client profile; answers do not update client fields |
| G12-I-68 | Flow | Name, email, phone pre-filled from profile | Missing in PRD | none | `PatientFormFillScreen.tsx:57-70` | |
| G12-I-69 | Flow | Read-only view of completed answers and signature | Missing in PRD | none | `PatientFormsScreen.tsx:314-366` | |
| G12-I-70 | Flow | Fabricated birth date and insurer pre-filled for everyone | Prototype defect | — | `PatientFormFillScreen.tsx:71-74` | see E-22 |
| G12-I-71 | Rule | Signature optional on consent; completed forms reopenable | Prototype defect | — | `PatientFormFillScreen.tsx:99-165` | see E-23 |

### C5. Documents
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G12-I-72 | Flow | Documents list with name, issuer, date, size, type | Partial (PRD less detailed) | documents.md § F-1.1 | `PatientDocumentsScreen.tsx:116-149,360-400` | Fixed newest-first, user cannot sort |
| G12-I-73 | Flow | In-app viewer | Partial (PRD less detailed) | documents.md § F-1.2 | `PatientDocumentsScreen.tsx:677-700` | Images only; PDFs show no content |
| G12-I-74 | Flow | Zoom and clinical watermark | PRD-only (not built) | documents.md § F-1.2 | none | |
| G12-I-75 | Flow | Patient upload | Partial (PRD less detailed) | documents.md § F-1.3 | `PatientDocumentsScreen.tsx:152-243,494` | Adds category, notes, Word types, 10 MB cap; PRD lists PDF/JPG/PNG |
| G12-I-76 | Flow | Full-text search | Partial (PRD less detailed) | documents.md § 1 | `PatientDocumentsScreen.tsx:137-149` | Searches name, category, uploader only, not file contents |
| G12-I-77 | X-ref | Clinic-released documents appear for the patient | Matches | documents.md AC F-1-1 | `PatientDocumentsScreen.tsx:129` (only documents flagged visible to patient) | Clinic controls release with the visibility flag |
| G12-I-78 | Flow | Patient uploads start as "Pending Review" for clinic verification | Missing in PRD | none | `PatientDocumentsScreen.tsx:218-221` | |
| G12-I-79 | X-ref | Patient upload lands in the client's document list | Missing in PRD | none | `PatientDocumentsScreen.tsx:226`; shared document store | Clinic review process undefined |
| G12-I-80 | Flow | Sample documents shown to every patient | Prototype defect | — | `PatientDocumentsScreen.tsx:70-113` | see E-24 |
| G12-I-81 | Flow | Download only shows a toast | Prototype defect | — | `PatientDocumentsScreen.tsx:406-410,709-713` | see E-25 |

### C6. Messages and Care Bot
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G12-I-82 | Rule | Channel order | Contradicts or stale | chat.md AC F-1-1 (bot, clinician, groups) | `PatientMessagesScreen.tsx:162` (clinician, groups, bot) | PM decides which order is right (Q-12) |
| G12-I-83 | Flow | No way to start a chat with other staff or patients | Matches | chat.md AC F-1-3 | no new-chat control in `PatientMessagesScreen.tsx` | |
| G12-I-84 | Flow | Unread badges updating in real time | PRD-only (not built) | chat.md § F-1.4, AC F-1-2 | none (unread count exists in data but is not shown) | |
| G12-I-85 | Flow | Five shortcut cards | Matches | chat.md § F-2.1 | `PatientMessagesScreen.tsx:60-66` | |
| G12-I-86 | Flow | Shortcut replies with CTA button, live balance | Partial (PRD less detailed) | chat.md § F-2.2–F-2.4 | `PatientMessagesScreen.tsx:249-282` | Static text only; no button, no balance (a never-used drawer version has buttons: `components/CareBotDrawer.tsx`) |
| G12-I-87 | Flow | Bot answers within 1 second | Matches | chat.md AC F-2-2 | `PatientMessagesScreen.tsx:316-324` (650 ms) | |
| G12-I-88 | Flow | Emergency keywords return urgent 911 protocol | PRD-only (not built) | chat.md § F-2 example 4, AC F-2-3 | none | Clinical-safety gap: "chest pain" gets the generic reply |
| G12-I-89 | Flow | Check-in shortcut initiates check-in | Prototype defect | chat.md § F-2.5 | `PatientMessagesScreen.tsx:274-276`; `PatientCareBotScreen.tsx:297-302` | see E-26 |
| G12-I-90 | Flow | Clinician thread with attribution | Partial (PRD less detailed) | chat.md § F-3.1–F-3.3 | `PatientMessagesScreen.tsx:439-500` | Shows name and number text; no credentials badge, no verified badge |
| G12-I-91 | Flow | Sent / delivered / read ticks | Prototype defect | chat.md § F-3.2, AC F-3-2 | `PatientMessagesScreen.tsx:611` | see E-31 |
| G12-I-92 | Flow | Out-of-hours notice | PRD-only (not built) | chat.md § F-3.4 | none | Needs a source for clinic hours (Q-12) |
| G12-I-93 | X-ref | Care groups created in Client appear automatically for member patients | Matches | chat.md § F-4.1, AC F-4-1 | `PatientMessagesScreen.tsx:127-135`; shared store `useConversations.ts` | Same store as clinic Chats; no webhook needed |
| G12-I-94 | Rule | "Moderators only" locks the composer | Prototype defect | chat.md § F-4.4, AC F-4-2 | `PatientMessagesScreen.tsx` (no check); setting exists `useConversations.ts:44` | see E-32 |
| G12-I-95 | Flow | Reply with quote | Matches | chat.md § F-5.1–F-5.2 | `PatientMessagesScreen.tsx:281-312,516-545,650-670` | |
| G12-I-96 | Flow | Attachment staging chip and download card | Partial (PRD less detailed) | chat.md § F-5.3–F-5.5 | `PatientMessagesScreen.tsx:337-352` | Only name/size/type are kept; the file is not transferred (E-33) |
| G12-I-97 | Rule | 25 MB limit with error | PRD-only (not built) | chat.md § F-5, AC F-5-3 | none | |
| G12-I-98 | Flow | Group info drawer with Members / Files / Tasks | Matches | chat.md § F-6.1–F-6.4 | `PatientGroupInfoDrawer.tsx:60,256-509` | |
| G12-I-99 | Flow | Leave group with confirmation | Matches | chat.md § F-6.5, AC F-6-3 | `PatientGroupInfoDrawer.tsx:598-635`; `PatientMessagesScreen.tsx:224-246` | |
| G12-I-100 | Flow | Caregiver (family) users | PRD-only (not built) | chat.md § 1 | none | No caregiver sign-in or role |
| G12-I-101 | Flow | Full-page Care Bot per patient in the Companion channel, floating launcher | Missing in PRD | none | `PatientCareBotScreen.tsx:100-139`; `PatientPortalLayout.tsx:551-561` | The PRD places the bot only inside Messages |
| G12-I-102 | Rule | Clinic widget settings decide who replies first (AI vs human) and welcome text | Missing in PRD | none | `PatientCareBotScreen.tsx:51,346-372`; `companionWidgetStore.ts:44-45` | Links to AI Receptionist/Companion settings |
| G12-I-103 | Flow | [SECURITY] Care Bot in Messages is one shared thread for all patients | Prototype defect | — | `PatientMessagesScreen.tsx:138` | see E-27 |
| G12-I-104 | Flow | [SECURITY] Groups shown by hardcoded member ID or "public" | Prototype defect | — | `PatientMessagesScreen.tsx:127-135` | see E-28 |
| G12-I-105 | Flow | Pretend clinician thread and fixed clinician name | Prototype defect | — | `PatientMessagesScreen.tsx:85-123,260` | see E-29 |
| G12-I-106 | Flow | Clinician thread can resolve to the patient's Companion bot conversation | Prototype defect | — | `PatientMessagesScreen.tsx:86-88` | see E-30 |
| G12-I-107 | Rule | Bot and Messages screens store patient messages on opposite sides | Prototype defect | — | `PatientMessagesScreen.tsx:304-309` vs `PatientCareBotScreen.tsx:328` | see E-34 |

### C7. Pharmacy
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G12-I-108 | Flow | Active prescription list | Prototype defect | pharmacy.md § F-1.1 | `PatientPharmacyScreen.tsx:29-52,76-103` | see E-35 |
| G12-I-109 | Flow | One-tap refill request routed to prescriber as a task | PRD-only (not built) | pharmacy.md § F-1.2, AC F-1-1 | none | |
| G12-I-110 | Flow | Dispensing pharmacy details | Partial (PRD less detailed) | pharmacy.md § F-1.3 | `PatientPharmacyScreen.tsx:68-76` | Counter and wing text only; no hours, phone, directions link |
| G12-I-111 | Flow | "Proceed to Billing" advances stage to "Pay Bill" | Missing in PRD | none | `PatientPharmacyScreen.tsx:53-66` | |
| G12-I-112 | Rule | Pharmacy not in nav; opened by stage route or URL | Missing in PRD | none | `PatientPortalLayout.tsx:39-45,243-251` | |

### C8. Tasks
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G12-I-113 | Metric | Action Needed / Done pills | Matches | tasks.md § F-1.1 | `PatientTasksScreen.tsx:112-125,140-175` | Computed from the patient's own deliverables |
| G12-I-114 | Flow | Tabs (default Action Needed) and search over title, description, deliverables | Matches | tasks.md § F-1.2 | `PatientTasksScreen.tsx:90-110` | |
| G12-I-115 | Rule | Title sanitisation | Matches | tasks.md § F-1.3, AC F-1-1 | `PatientTasksScreen.tsx:102,226`; `PatientTaskDetailPage.tsx:123-125` | |
| G12-I-116 | Flow | Rows with ring, star, due date, status pill | Matches | tasks.md § F-1.4 | `PatientTasksScreen.tsx:236-291` | |
| G12-I-117 | Flow | Empty state "All Caught Up!" | Matches | tasks.md § F-1 | `PatientTasksScreen.tsx:215` | |
| G12-I-118 | Flow | Detail header, progress text | Matches | tasks.md § F-2.1 | `PatientTaskDetailPage.tsx:153-209` | |
| G12-I-119 | Flow | Mark as done / Undo with toast | Matches | tasks.md § F-2.2 | `PatientTaskDetailPage.tsx:132-138,284-301` | |
| G12-I-120 | X-ref | Auto-complete task and notify clinic; reopen on undo | Matches | tasks.md § F-2.3 | `tasksStore.ts:1229-1300` | |
| G12-I-121 | X-ref | Live two-way sync with Client Tasks | Matches | tasks.md cross-product row 1 | shared task store | |
| G12-I-122 | Flow | Rich resources (image, video, link, file, HTML) | Matches | tasks.md § F-3 | `PatientTaskDetailPage.tsx:311-376` | |
| G12-I-123 | Rule | Admin firewall and "Task Not Available" screen | Matches | tasks.md § F-4.1, F-4.3 | `PatientTaskDetailPage.tsx:44-116` | Screen shows no task content |
| G12-I-124 | Flow | Task Assigned card in Companion chat | Partial (PRD less detailed) | tasks.md cross-product row 2 | `ShareTaskDrawer.tsx:72` | Arrives as a plain text message with a link, not a card |
| G12-I-125 | Rule | [SECURITY] Patient match by name substring | Prototype defect | tasks.md § F-4.2 | `PatientTasksScreen.tsx:43-83`; `PatientTaskDetailPage.tsx:62-90` | see E-36 |
| G12-I-126 | Flow | Unvalidated link addresses in task resources | Prototype defect | — | `PatientTaskDetailPage.tsx:333-339` | see E-37 |

---

## D. Correct flow as built (PRD-ready)
Each block replaces the whole PRD file named. Decisions not made yet are marked "Decision needed".

### D0. NEW FILE `companion/access.md` — Sign-in, Session, Shell & Profile
| Product | COMPANION |
| Module | ACCESS (sign-in, registration, shell, profile) |
| Status | Draft |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Patient records | A self-registered patient becomes a client record (source "Self Gen") with the default care pathway; profile edits update the client record | [View in Client](/client/contacts) |
| Platform | Process stages | Registration assigns the starting processes and stage | [View in Client Processes](/client/processes) |

## 1. Module Summary
- A patient signs in with their phone number or email plus a one-time code, can register if unknown, and then sees a single-patient portal (Today, Visits, Tasks, Documents, Forms, Billing, Messages, Profile).
- A patient can see and change only their own data.
- Decision needed: how the one-time code is delivered, checked, expired and rate-limited (see G12-Q-01).

## 2. Feature Requests
### F-1: Phone/email sign-in with one-time code
#### 1. What it does
Looks up the patient by the phone or email they enter and signs them in once the code sent to that contact is confirmed.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Identifier step | Form | Accepts phone or email; empty entry shows an inline message | Client ID is not an accepted identifier (Decision needed: G12-Q-01) |
| F-1.2 Code step | 6-digit input | Confirms the code; wrong or expired code is rejected | Decision needed: code lifetime, retries, resend (G12-Q-01) |
| F-1.3 Not found | Redirect | Unknown identifier opens registration pre-filled | Decision needed: whether to reveal that an account does not exist (G12-Q-01) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Returning patient | Enters phone, then the code | Lands on Today for that patient only |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | I want to sign in with just my phone or email so I can reach my care info quickly and privately. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Only the patient who passes the code check is signed in. |
| F-1-2 | Every `/patient` page except sign-in requires a signed-in patient; otherwise the visitor is sent to sign-in. |
| F-1-3 | A patient can never open another patient's data by changing the address. |
| F-1-4 | Sign out ends the session. |

### F-2: Self-registration
#### 1. What it does
New patients create a profile with name, phone and email, verify the code, and become a clinic client.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Details form | Form | Name (2+ characters), phone (7+ digits), valid email | Duplicate phone/email handling: Decision needed (G12-Q-01) |
| F-2.2 Client record creation | Cross-product | Creates a client with source "Self Gen", starting processes and stage | Decision needed: which processes and stage (G12-Q-01) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New patient | Fills details and verifies | Appears as a new client in Client with source "Self Gen" |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | New patient | I want to create my profile on my phone so I can book without calling. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | The client record is created only after the code is verified. |
| F-2-2 | A patient cannot be registered twice with the same phone or email (Decision needed: G12-Q-01). |

### F-3: Portal shell
#### 1. What it does
Side drawer navigation (Today, Visits, Tasks, Documents, Forms, Billing, Messages), notification bell, avatar to Profile, floating Care Bot button (hidden in chat screens), sign out.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Drawer | Navigation | Seven destinations, active item highlighted | Pharmacy is reached from care-pathway stages, not the drawer |
| F-3.2 Clinic switcher | Control | Shows clinic name | Decision needed: should a patient be able to switch clinics? (G12-Q-18) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient on any page | Taps the floating bot button | Opens the Care Bot |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | I want one menu for everything about my care. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | The drawer shows the seven destinations and closes after a tap. |
| F-3-2 | No developer or staff tools are visible to patients. |

### F-4: Profile
#### 1. What it does
Patient edits name, email, phone, gender, birth date, emergency contact, language and photo (5 MB max), changes password (if passwords are kept), and sees notification preferences.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 Personal tab | Form | Saves to the client record | Decision needed: which fields need clinic approval (G12-Q-16) |
| F-4.2 Security tab | Form | Password change | Decision needed: are passwords part of the model at all (G12-Q-01) |
| F-4.3 Notifications tab | Toggles | SMS, WhatsApp, email, bills | Decision needed: where preferences are stored and who honours them (G12-Q-16) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient moves home | Updates address-related contact and saves | Clinic sees the new emergency contact |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | I want to keep my details current without calling the clinic. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Saved personal details appear on the client record. |
| F-4-2 | Changing a sign-in identifier (phone or email) requires re-verification (Decision needed: G12-Q-16). |

### Not yet built
Code verification, route protection, URL tampering protection, real notification preferences.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Sign-in | F-1.1–F-1.3 | Phone/email plus code |
| F-2 | Registration | F-2.1–F-2.2 | Self-service client creation |
| F-3 | Portal shell | F-3.1–F-3.2 | Navigation and bot launcher |
| F-4 | Profile | F-4.1–F-4.3 | Personal details, security, notifications |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Sign in quickly and privately | F-1 |
| 2 | New patient | Create my profile on my phone | F-2 |
| 3 | Patient | One menu for everything | F-3 |
| 4 | Patient | Keep my details current | F-4 |

### D1. `companion/today.md` — Today's Visit Agenda, Care Pathway & Check-in
| Product | COMPANION |
| Module | TODAY |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Appointments | The patient's own appointments feed the visit pill and the next-appointment row | [View in Client](/client/appointments/list) |
| Client | Invoices | Unpaid balance and the Pay / View Receipt button come from the patient's own invoices | [View in Client Billing](/client/billing) |
| Client | Process stages | The pathway stage card shows the stage the clinic has moved the patient to, with the stage's authored content | [View in Client Processes](/client/processes) |
| Companion | Tasks | The three most recent tasks are summarised on Today | [View in Companion Tasks](/companion/tasks) |
| Reception | Kiosk | Phone check-in is the remote equivalent of kiosk check-in | Decision needed (G12-Q-02) |

## 1. Module Summary
- Today is the patient's landing page: greeting, today's visit (time, doctor, room), recent tasks, the care-pathway stage with guidance, and shortcuts to visits, documents, forms, balance and Care Bot.
- Everything on the page belongs to the signed-in patient only.
- Pathway stage follows the clinic: moving a patient on the clinic board changes what Today shows.

## 2. Feature Requests
### F-1: Visit card
#### 1. What it does
Shows today's appointment: time, doctor, and room (from the appointment or the clinic's room rules). If there is none today the next scheduled visit appears in the shortcuts.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Visit pill | Badge | Time, doctor, room | Decision needed: add doctor avatar, specialty, suite and clinic address (G12-Q-03) |
| F-1.2 Room direction | Text | Walking direction to the room from the clinic's room rules | Intended; show it |
| F-1.3 Next appointment row | Row | Next scheduled visit, opens Visits | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visit today at 2:30 PM, Room 204 | Opens Today | Pill shows time, doctor, Room 204 |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | On visit day I want to see time, doctor and room at a glance. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Only this patient's appointments are used. |
| F-1-2 | With no visit today the pill is hidden. |

### F-2: Care pathway card and stage guidance
#### 1. What it does
Shows the patient's current pathway with a stepper, the stage title and description, optional videos, and a button. Other pathways are in a collapsible list. A second tap on a stage opens its full content.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Stage stepper | Stepper | Done / current / upcoming from the clinic's stage | The most recently moved pathway is shown first |
| F-2.2 Stage drawer | Drawer | Authored guidance for the stage | |
| F-2.3 Pay button | Button | After a completed visit: "Pay Invoice" or "View Paid Receipt" | |
| F-2.4 Consent signing | Drawer step | Patient signs the consent in the stage drawer | Decision needed: is consent signing part of the stage drawer or the Forms module? (G12-Q-09) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visit completed, invoice open | Opens Today | Hero shows "Pay Invoice ($amount)" |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | I want to know where I am in my care journey and what to do next. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | The stage shown matches the stage set by the clinic. |
| F-2-2 | The pay button uses the patient's own invoice only. |

### F-3: Tasks and shortcuts
#### 1. What it does
Shows the 3 most recent tasks with progress, and rows for documents, forms, account balance and Care Bot.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Task card | Card | Up to 3 tasks, same rules as My Tasks | |
| F-3.2 Account balance row | Metric | Sum of unpaid balance on the patient's unpaid invoices | Opens Pay if > 0, otherwise Billing |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | $78.75 open | Taps the balance row | Opens payment |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | I want quick access to what needs my attention. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Balance = sum of (total − paid) on this patient's invoices that are not paid or void. |
| F-3-2 | A patient with no invoices sees no balance and never sees another patient's invoices. |

### Not yet built
- **F-4 Phone check-in ("I Have Arrived")**: one-tap check-in from Today; marks the appointment arrived in Client appointments and notifies the doctor. Decision needed: geofence rules (G12-Q-02).
- **F-5 Queue**: ticket number, now serving, patients ahead, doctor ETA, full-screen notice with room directions when called. Decision needed: queue owner and ETA formula (G12-Q-03).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Visit card | F-1.1–F-1.3 | Today's visit |
| F-2 | Care pathway card | F-2.1–F-2.4 | Clinic-driven stage and guidance |
| F-3 | Tasks and shortcuts | F-3.1–F-3.2 | Tasks and quick rows |
| F-4 | Phone check-in (not built) | — | Remote arrival |
| F-5 | Queue (not built) | — | Ticket, serving, ETA |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | See time, doctor, room | F-1 |
| 2 | Patient | Know my journey and next step | F-2 |
| 3 | Patient | Quick access to tasks, balance, forms | F-3 |
| 4 | Patient | Check in from my phone | F-4 |
| 5 | Patient | See my queue progress | F-5 |

### D2. `companion/appointments.md` — Booking, Prepayment & Visit List
| Product | COMPANION |
| Module | APPOINTMENTS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Appointments calendar | A patient booking appears on the clinic calendar with source "MA-Client" and an assigned room | [View in Client](/client/appointments/list) |
| Client | Invoices | A prepaid service or deposit creates an invoice and records the payment | [View in Client Billing](/client/billing) |
| Client | Services and team | Services, prices, prepaid settings and clinician working hours drive what can be booked | [View in Settings](/client/settings) |

## 1. Module Summary
- Patients see Upcoming and Past visits and book a new one in three steps: service and clinician, date and time, and (only if the service is prepaid) payment.
- Slots come from clinician working hours and service slot length, excluding existing bookings.
- Decision needed: whether patient bookings should respect the clinic's "appointment automation required" setting (see G12-Q-07).

## 2. Feature Requests
### F-1: Self-service booking
#### 1. What it does
The patient chooses a service and a clinician (or "Any Available Clinician"), picks a date and time, and confirms.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Service and clinician picker | Selector | Shows service price; "Any Available" merges slots across eligible clinicians | Decision needed: photos, bios, specialty filter (G12-Q-05) |
| F-1.2 Date and slot picker | Slot grid | Week navigation; slots from working hours minus booked slots; message when none | Slot length is the service's slot length |
| F-1.3 Confirm | Button | Creates the appointment and assigns a room | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Follow-up with Dr. Jenkins | Picks Thursday 2:30 PM and confirms | Appears in Upcoming and on the clinic calendar |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | I want to book from my phone so I do not have to call. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Booked slots are not offered again to another patient. |
| F-1-2 | A slot being checked out is held for a short period (Decision needed: hold time, G12-Q-06). |
| F-1-3 | If no slots exist the patient sees a clear message and can change date or clinician. |

### F-2: Prepaid booking
#### 1. What it does
If the service is prepaid or has a deposit, the patient reviews fee plus tax and pays by card or touchless QR before the booking is confirmed.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Amount | Rule | Amount = full price, or the configured deposit; tax = amount × service tax %; total = amount + tax | |
| F-2.2 Payment step | Form | Card or QR | Decision needed: real gateway and what counts as paid (G12-Q-04) |
| F-2.3 Invoice | Cross-product | Creates an invoice and records the payment against it | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | $50 deposit, 5% tax | Pays $52.50 | Booking confirmed; invoice paid |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | I want to secure my slot by paying upfront. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | A booking is marked paid only after a payment is confirmed by the gateway (Decision needed: G12-Q-04). |
| F-2-2 | The invoice appears in Client invoices with the payment. |

### F-3: Visit list
#### 1. What it does
Upcoming and Past tabs with status, clinician, room and date.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Upcoming | List | Not completed, not cancelled | |
| F-3.2 Past | List | Completed or cancelled | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Past visit | Opens Past | Sees status and room |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | I want to see my visit history. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Only this patient's visits are listed. |

### Not yet built
- Reschedule and cancel with a mandatory reason and 24-hour notice (Decision needed: policy, G12-Q-05).
- Slot lock during checkout (G12-Q-06).
- Calendar invite and confirmation SMS.
- Provider photos, bios and specialty filter.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Self-service booking | F-1.1–F-1.3 | Service, clinician, slot, confirm |
| F-2 | Prepaid booking | F-2.1–F-2.3 | Fee plus tax before confirm |
| F-3 | Visit list | F-3.1–F-3.2 | Upcoming and past |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Book without calling | F-1 |
| 2 | Patient | Secure my slot by paying | F-2 |
| 3 | Patient | See my visit history | F-3 |

### D3. `companion/billing.md` — Balance, Invoices & Payment
| Product | COMPANION |
| Module | BILLING |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Invoices and payments | The patient's own invoices are listed; a confirmed payment is recorded on the same invoice in Client Billing | [View in Client Billing](/client/billing) |
| Companion | Pharmacy and Today | Pharmacy hand-off and the Today pay button open Billing/Pay | [View in Companion Today](/companion/today) |

## 1. Module Summary
- Billing shows the patient's total outstanding balance and their invoices (due or settled) with Pay and Receipt actions.
- The payment page shows the invoice and a UPI QR for the balance; once payment is confirmed the invoice is paid in Client Billing and the patient moves to "Payment Done".
- Decision needed: card, Apple Pay, Google Pay rails and the gateway (see G12-Q-04).

## 2. Feature Requests
### F-1: Outstanding balance and invoice list
#### 1. What it does
Shows total outstanding = sum of (invoice total − paid) over this patient's invoices that are not paid, and a list of each invoice.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Balance card | Summary | Total due with Pay Now | Decision needed: breakdown by copay, diagnostics, pharmacy (G12-Q-08) |
| F-1.2 Invoice list | List | Invoice, date, amount, "Settled in full" or "Due" | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | One $35 invoice open | Opens Billing | $35.00 outstanding |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | I want to see what I owe. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Only this patient's invoices are shown; with none, an empty state appears. |
| F-1-2 | Balance = sum of (total − paid, minimum 0) on unpaid invoices. |

### F-2: Payment
#### 1. What it does
Opens a payment page for one of the patient's own invoices and records the payment once confirmed.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Payment rails | Checkout | UPI QR today | Decision needed: card, Apple Pay, Google Pay, PCI approach (G12-Q-04) |
| F-2.2 Confirmation | Rule | Payment recorded only after the payment provider confirms | Decision needed: how confirmation arrives (G12-Q-04) |
| F-2.3 Result | Cross-product | Invoice paid in Client Billing; balance recalculated; patient moves to "Payment Done" | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | $35 copay | Pays | Invoice paid; balance $0.00 |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | I want a quick secure way to pay my bill. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | A patient can open only their own invoices on the payment page. |
| F-2-2 | A successful payment marks the invoice paid in Client Billing. |

### Not yet built
- Receipt PDF with payment reference and clinic address (the Receipt button currently reopens the payment page).
- Card, Apple Pay, Google Pay.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Balance and invoices | F-1.1–F-1.2 | What I owe |
| F-2 | Payment | F-2.1–F-2.3 | Pay and sync to Client Billing |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | See what I owe | F-1 |
| 2 | Patient | Pay quickly and securely | F-2 |

### D4. `companion/forms.md` — Forms, Submissions & Signature
| Product | COMPANION |
| Module | FORMS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Web Forms | Form definitions and forms sent to a patient come from the clinic's Web Forms | [View in Client](/client/web-forms) |
| Client | Client profile | Completed submissions are visible on the patient's client profile | [View in Client](/client/contacts) |

## 1. Module Summary
- Patients see forms To complete (forms the clinic sent plus intake forms not yet done) and Completed submissions they can reopen read-only.
- Name, email and phone are pre-filled from the profile. Required fields are validated. A signature can be drawn with a finger or mouse.
- Decision needed: whether a signature is mandatory per form (see G12-Q-09).

## 2. Feature Requests
### F-1: Fill and submit a form
#### 1. What it does
Single-column form with required-field messages and an optional signature pad (clear and re-sign).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Runner | Form | Pre-fills name, email, phone only; no other data is guessed | |
| F-1.2 Signature | Pad | Draw, clear, re-sign | Decision needed: undo, PDF embedding (G12-Q-09) |
| F-1.3 Submit | Action | Completes the clinic's pending submission or adds a new one; returns to the list with a confirmation | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Intake sent by clinic | Fills and signs | Moves to Completed; visible on the client profile |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | I want to fill forms at home so I do not use a clipboard. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Required fields must be filled before submit. |
| F-1-2 | A submitted form cannot be edited again (Decision needed: lock rule, G12-Q-09). |
| F-1-3 | Pre-filled values come only from the patient's own profile. |

### F-2: Form lists and review
#### 1. What it does
Lists to-complete forms and completed submissions; tapping a completed one shows each answer and the signature.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 To complete | Tab | Clinic-sent forms plus open intake forms | |
| F-2.2 Completed | Tab | Submissions with date | |
| F-2.3 Review | Modal | Read-only answers and signature | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Past consent | Opens Completed, taps it | Sees answers and signature |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | I want to see what I submitted. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Only this patient's submissions are listed. |

### Not yet built
- Autosave of drafts, progress bar.
- Signature as vector in a PDF; cryptographic signature timestamp; lock after submission.
- Confirmation card naming the doctor.
- Answers updating client fields (Decision needed: G12-Q-10).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Fill and submit | F-1.1–F-1.3 | Complete a form with optional signature |
| F-2 | Lists and review | F-2.1–F-2.3 | To complete, completed, review |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Fill forms at home | F-1 |
| 2 | Patient | Review what I submitted | F-2 |

### D5. `companion/documents.md` — Documents Vault & Uploads
| Product | COMPANION |
| Module | DOCUMENTS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Client documents | Documents the clinic marks visible to the patient appear here; patient uploads appear in the client's documents as "Pending Review" | [View in Client](/client/contacts) |

## 1. Module Summary
- The patient sees documents released to them (newest first), can search by name, category or uploader, preview images, and upload their own files (images, PDF, Word; up to 10 MB) with a category and notes.
- Decision needed: upload size limit and accepted types (see G12-Q-11).

## 2. Feature Requests
### F-1: Documents vault
#### 1. What it does
Lists this patient's released documents with name, category, issuer, date and size; search; preview; download.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 List | Table | Newest first | Decision needed: user sorting (G12-Q-11) |
| F-1.2 Search | Input | Name, category, uploader | Decision needed: content search (G12-Q-11) |
| F-1.3 Viewer | Modal | Shows the document | Decision needed: PDF viewer, zoom, watermark (G12-Q-11) |
| F-1.4 Download | Action | Saves the file | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Lab report released | Opens Documents | Sees it at the top |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | I want my reports on my phone. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Only documents flagged visible to the patient appear, and only for that patient. |
| F-1-2 | No documents appear that the clinic did not create or the patient did not upload. |
| F-1-3 | Download delivers the actual file. |

### F-2: Patient upload
#### 1. What it does
Patient uploads a file with category, title and notes; it is saved as "Pending Review".
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Upload form | Modal | Category, title, notes, file | |
| F-2.2 Review status | Label | "Pending Review" until the clinic verifies | Decision needed: clinic verification flow (G12-Q-11) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Photo ID | Uploads | Appears as Pending Review |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | I want to share my insurance card and outside records. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Files above the limit are rejected with a message. |
| F-2-2 | The upload appears in the client's documents. |

### Not yet built
Multi-page PDF viewer with zoom and watermark; encrypted download; full-text search of file content.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Documents vault | F-1.1–F-1.4 | Released documents |
| F-2 | Patient upload | F-2.1–F-2.2 | Share files with the clinic |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Reports on my phone | F-1 |
| 2 | Patient | Share my own records | F-2 |

### D6. `companion/chat/chat.md` — Messaging, Care Bot & Care Groups
| Product | Companion |
| Module | chat |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Chats (Companion channel) | Patient messages, bot messages and group posts are the same conversations the clinic sees in Client Chats | [View in Client](/client/chat) |
| Client | Care groups | Groups created by staff with the patient as member appear automatically | [View in Client](/client/chat) |
| Client | Tasks | Share → Client Portal sends a "Task Assigned" message into the patient's chat | [View in Companion Tasks](/companion/tasks) |
| Settings | Companion widget | Clinic settings decide whether the bot or a human answers first and the welcome text | [View in Settings](/client/settings) |

## 1. Module Summary
- Messages shows three channel types: the assigned clinician, care groups the patient belongs to, and the Care Bot. Decision needed: channel order (see G12-Q-12).
- The patient cannot start chats with other staff or patients.
- A full-page Care Bot (`/patient/care-bot`) keeps one conversation per patient in the clinic's Companion channel.
- Decision needed: whether there is one bot thread or two (see G12-Q-13).

## 2. Feature Requests
### F-1: Channel navigation
#### 1. What it does
Lists the clinician thread, the patient's groups (excluding left groups) and the Care Bot.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Clinician thread | List item | The patient's own conversation with their clinician | |
| F-1.2 Care groups | List items | Only groups where the patient is a member | Decision needed: public groups (G12-Q-15) |
| F-1.3 Care Bot | List item | This patient's own bot thread | |
| F-1.4 Unread indicator | Badge | Per-thread unread count | Not yet built |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient opens Messages | — | Sees clinician, groups, bot |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | I want to tell apart the bot, my doctor and my groups. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A patient sees only their own threads and groups they belong to. |
| F-1-2 | No control to start a new chat exists. |
| F-1-3 | If the clinic has no conversation with the patient yet, an empty clinician thread is shown, never invented messages. |

### F-2: Care Bot and shortcuts
#### 1. What it does
Five shortcut cards (book, billing & insurance, intake, connect with care team, check in) send a prepared question and get an automatic keyword reply within about a second. The full-page bot replies only when the clinic's widget settings say AI answers first.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Shortcut grid | Cards | Five prepared questions | |
| F-2.2 Replies | Text | Keyword answers pointing to the right tab | Decision needed: add buttons and live balance (G12-Q-12) |
| F-2.3 Check-in | Action | Check in for today's visit | Decision needed: must really check the appointment in (G12-Q-02) |
| F-2.4 Emergency | Rule | Emergency wording gets an urgent "call emergency services" reply | Not yet built; Decision needed: keywords and wording (G12-Q-12) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Wants to book | Taps "Book an Appointment" | Gets scheduling info pointing to Visits |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | I want quick answers without typing. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Five shortcuts are always visible in the bot. |
| F-2-2 | A reply appears within about a second when the bot is the first responder. |
| F-2-3 | The bot never says the patient is checked in unless the appointment was actually checked in. |

### F-3: Clinician messaging
#### 1. What it does
Text conversation with reply quotes and attachment chip; messages are stored in the clinic's Companion conversations.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Thread | Stream | Patient and clinician messages with times | |
| F-3.2 Reply | Quote | Quote a previous message | |
| F-3.3 Delivery state | Ticks | Sent, delivered, read | Not yet built |
| F-3.4 Office-hours notice | Notice | Out-of-hours expectation | Not yet built; Decision needed: hours source (G12-Q-12) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Question about dosage | Sends a message | Clinic sees it in Chats |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | I want to message my doctor securely. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Patient messages appear in the clinic's Chats on the patient's side. |

### F-4: Care groups
#### 1. What it does
Groups created in Client with the patient as member appear automatically with multi-author messages.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 Group list | Items | Title, latest message | |
| F-4.2 Posting rule | Rule | "Moderators only" locks the composer with a notice | Not yet enforced for patients; intended |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff adds Sarah to a group | — | Group appears in her list |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | I want one place with all my clinicians. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | A patient sees a group only if they are a member (Decision needed: public groups, G12-Q-15). |
| F-4-2 | In a moderators-only group the composer is disabled with an explanation. |

### F-5: Attachments
#### 1. What it does
Patient attaches a file to a message.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1 Attach | Button | Chooses a file | The actual file must reach the clinic (Decision needed: size limit, 25 MB in the original PRD, G12-Q-12) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Lab report | Attaches a PDF | Clinic can download it |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Patient | I want to send a photo or report to my team. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Files above the limit are rejected with a message. |

### F-6: Group info and leave
#### 1. What it does
Drawer with Members, Files and Tasks tabs and a "Leave Group" button with confirmation; the patient is removed from the group and moved to another thread.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-6.1 Drawer | Drawer | Members, Files, Tasks | |
| F-6.2 Leave | Action | Confirm, remove from members | Remembered per browser; Decision needed: whether leaving is also remembered on the clinic side (G12-Q-15) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Programme ended | Leaves group | Group disappears |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-6-J1 | Patient | I want to leave a group I no longer need. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-6-1 | Cancel keeps the patient in the group. |

### Not yet built
Unread badges; delivery states; office-hours notice; emergency escalation; 25 MB limit; moderators-only enforcement for patients; caregiver (family) accounts.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Channel navigation | F-1.1–F-1.4 | Clinician, groups, bot |
| F-2 | Care Bot | F-2.1–F-2.4 | Shortcuts and replies |
| F-3 | Clinician messaging | F-3.1–F-3.4 | Secure thread |
| F-4 | Care groups | F-4.1–F-4.2 | Auto-ingested groups |
| F-5 | Attachments | F-5.1 | Share files |
| F-6 | Group info and leave | F-6.1–F-6.2 | Members, files, leave |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Tell bot, doctor, groups apart | F-1 |
| 2 | Patient | Quick answers | F-2 |
| 3 | Patient | Message my doctor | F-3 |
| 4 | Patient | One place with my clinicians | F-4 |
| 5 | Patient | Send a report or photo | F-5 |
| 6 | Patient | Leave a group | F-6 |

### D7. `companion/pharmacy.md` — Pharmacy & Prescriptions
| Product | COMPANION |
| Module | PHARMACY |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Process stages | "Move to Pharmacy" stage sends the patient here; "Proceed to Billing" moves them to "Pay Bill" | [View in Client Processes](/client/processes) |
| Companion | Billing | Next step after pharmacy | [View in Companion Billing](/companion/billing) |

## 1. Module Summary
- The pharmacy page tells the patient where to collect their medicines and lists their prescribed items; "Proceed to Billing" moves them to the "Pay Bill" stage and opens Billing.
- It is not in the drawer; it opens from the pathway stage.
- Decision needed: where prescriptions come from (see G12-Q-14).

## 2. Feature Requests
### F-1: Prescription list and pickup
#### 1. What it does
Shows pickup counter and the patient's own prescribed medicines (name, dose, duration, notes).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Pickup banner | Info | Counter, location, patient ID | Decision needed: configurable per clinic; add hours, phone, directions (G12-Q-14) |
| F-1.2 Medication list | List | The patient's own prescriptions | Decision needed: source and price display (G12-Q-14) |
| F-1.3 Proceed to Billing | Button | Moves stage to "Pay Bill", opens Billing | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Prescription ready | Opens Pharmacy | Sees counter and items |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | I want to know where to collect my medicines. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Only the patient's own prescriptions are shown; with none, an empty state is shown. |

### Not yet built
Refill request creating a task in the prescriber's queue and notifying the patient on approval; remaining refills; medication schedule; pharmacy hours, phone and directions.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Prescription list and pickup | F-1.1–F-1.3 | Pickup and next step |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Know where to collect medicines | F-1 |

### D8. `companion/tasks.md` — My Tasks (PRD stays; additions only)
The existing PRD already matches the prototype. Replace the file with the current PRD plus these changes:
- Cross-product Summary, row "Companion — Care Chat Task Notifications": say the notice arrives as a text message ("Task Assigned: title, stage, deadline, link"), not a card. Decision needed: build the card (see G12-Q-20).
- F-4.2 Active Patient Match Guard: patient identity is matched by client ID only; name matching must be exact, not "contains". Decision needed: whether tasks scoped to the portal with no named patient are visible to all patients (see G12-Q-19).
- F-3 acceptance: link resources must be web (http/https) addresses only.
- Add to F-1: the same list's three most recent tasks also appear on Today.

---

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
|---|---|---|---|---|
| G12-E-01 | [SECURITY] No sign-in guard on any patient page; a visitor with no session is treated as the first client in the clinic (or a hard-coded "Sarah Johnson") and sees that person's data | `routes.tsx:154-157`; `PatientPortalLayout.tsx:163-181` | Critical | G12-I-07 |
| G12-E-02 | [SECURITY] The patient identity can be switched by editing the web address (`/patient/<id>`, `?clientId=`, `?id=`) with no check | `PatientPortalLayout.tsx:106-143`; `routes.tsx:175` | Critical | G12-I-08 |
| G12-E-03 | [SECURITY] The 6-digit code is never verified; any entry, even empty, logs in the matched client, or the first client if none matched | `PatientLoginScreen.tsx:192-203` | Critical | G12-I-09 |
| G12-E-04 | [SECURITY] Sign-in accepts a raw client ID or any number that is a prefix/suffix of a stored phone; the "not found → register" branch reveals which contacts exist | `PatientLoginScreen.tsx:69-84,103-117` | High | G12-I-10 |
| G12-E-05 | [SECURITY] "Switch Patient (Dev)" is in the production drawer and lists every patient's name | `PatientPortalLayout.tsx:387-402`; `components/DevPatientSwitcherModal.tsx:19-24` | High | G12-I-11 |
| G12-E-06 | Registration creates the client after an unchecked code, with a random 3-digit ID (collisions possible) and no duplicate phone/email check | `PatientLoginScreen.tsx:208-232` | Medium | G12-I-12 |
| G12-E-07 | [SECURITY] Password change does not check the current password and stores the new password in plain text on the client record; login never uses it | `PatientProfileScreen.tsx:143-170` | High | G12-I-13 |
| G12-E-08 | [SECURITY] Profile Save writes name, email and phone (the sign-in identifiers) straight to the clinic's record with no re-verification or audit | `PatientProfileScreen.tsx:116-140` | Medium | G12-I-14 |
| G12-E-09 | Profile invents an emergency contact ("Priya Johnson") and the notification toggles say "saved" but keep nothing | `PatientProfileScreen.tsx:50-51,65-66,509-511` | Medium | G12-I-15 |
| G12-E-10 | [SECURITY] When the patient has no invoices, Today shows all unpaid invoices in the clinic, then all invoices (other patients' names and amounts), and the balance row and pay button use them | `PatientStatusScreen.tsx:217-224,456-466` | Critical | G12-I-30 |
| G12-E-11 | Pay button falls back to a made-up "$78.75" | `PatientStatusScreen.tsx:788` | Low | G12-I-31 |
| G12-E-12 | The phone check-in screen exists but `/patient/checkin` is routed to Today, so no one can reach it; there is no "I Have Arrived" button anywhere | `routes.tsx:161`; `PatientCheckinScreen.tsx:31-95` | High | G12-I-32, G12-I-17 |
| G12-E-13 | Consent signing in the stage drawer is not wired: the drawer never calls the "consent signed" handler, so no signature is captured | `PatientStatusScreen.tsx:485-488,1007`; `components/StageContentDrawer.tsx:20` | Medium | G12-I-33 |
| G12-E-14 | Room direction and pipeline percent are calculated but never shown | `PatientStatusScreen.tsx:375-376,483` | Low | G12-I-34 |
| G12-E-15 | Booking sets the patient's pipeline stage to "Client Checked In" (unpaid service) or "Payment Done" at booking time, so a patient looks checked in before arriving | `PatientBookingScreen.tsx:695-707` | High | G12-I-45 |
| G12-E-16 | [SECURITY] Prepaid booking records a payment for fee plus tax without any charge; card fields are pre-filled with a test card and never validated; the QR payload uses a fixed payee | `PatientBookingScreen.tsx:181-183,260-297,739-748` | Critical | G12-I-46 |
| G12-E-17 | A "$75" fee label is shown when a service has no price | `PatientBookingScreen.tsx:995,1046` | Low | G12-I-47 |
| G12-E-18 | [SECURITY] Billing shows other patients' invoices when the patient has none, and saves an invented $78.75 invoice into the shared invoice list that the clinic's Billing then shows | `PatientBillScreen.tsx:57-97` | Critical | G12-I-55 |
| G12-E-19 | [SECURITY] The pay page opens any invoice ID from the link (any patient's), and otherwise falls back to any pending invoice | `PatientPaymentScreen.tsx:53-79` | High | G12-I-56 |
| G12-E-20 | [SECURITY] "Confirm & Record Payment" marks the invoice paid with no proof of payment; one tap clears a real debt in Client Billing | `PatientPaymentScreen.tsx:141-160,350-360` | Critical | G12-I-57 |
| G12-E-21 | Pay page invents a default invoice and saves it to the shared list | `PatientPaymentScreen.tsx:83-110` | Medium | G12-I-58 |
| G12-E-22 | Every patient's form is pre-filled with birth date "09/14/1990" and insurer "Blue Cross Blue Shield", then submitted as their answers | `PatientFormFillScreen.tsx:71-74` | High | G12-I-70 |
| G12-E-23 | Signature is optional even for consent forms, and a completed form's link still opens and can be submitted again | `PatientFormFillScreen.tsx:99-165` | Medium | G12-I-71 |
| G12-E-24 | Three sample clinical documents (prescription, consultation summary, insurance note naming "Blue Cross PPO") appear for every patient as real records | `PatientDocumentsScreen.tsx:70-113,126-134` | High | G12-I-80 |
| G12-E-25 | Download buttons only show a "Downloading…" toast; PDFs have no preview | `PatientDocumentsScreen.tsx:406-410,709-713` | Medium | G12-I-81 |
| G12-E-26 | Bot "Check in" says "You are checked in; reception notified" but marks no appointment (Messages) or only changes the stage (full-page bot) | `PatientMessagesScreen.tsx:274-276`; `PatientCareBotScreen.tsx:297-302` | High | G12-I-89 |
| G12-E-27 | [SECURITY] The Care Bot in Messages is a single shared conversation, so one patient's messages to the bot are stored where every patient's bot view reads them | `PatientMessagesScreen.tsx:138,297-324`; `useConversations.ts:212` | High | G12-I-103 |
| G12-E-28 | [SECURITY] A care group is shown if it lists the hard-coded ID CL-001 or is "public", whether or not the patient is a member | `PatientMessagesScreen.tsx:127-135,228` | High | G12-I-104 |
| G12-E-29 | If the clinic has no conversation with the patient, an invented thread ("Hello Sarah… blood panel…") from "Dr. Alistair Mehta" is shown to every patient, and bot replies name that doctor for everyone | `PatientMessagesScreen.tsx:85-123,260` | Medium | G12-I-105 |
| G12-E-30 | The "clinician" thread is the first conversation with the patient's client ID, which can be the patient's own Companion bot conversation | `PatientMessagesScreen.tsx:86-88`; `PatientCareBotScreen.tsx:100-139` | Medium | G12-I-106 |
| G12-E-31 | Every message the patient sends always shows a double tick, with no real delivery or read state | `PatientMessagesScreen.tsx:611` | Medium | G12-I-91 |
| G12-E-32 | [SECURITY] "Moderators only" groups are not enforced: the patient composer is always open | `PatientMessagesScreen.tsx` (no check); setting at `useConversations.ts:44` | Medium | G12-I-94 |
| G12-E-33 | Attachments keep only name, size and type; the file itself is never sent, with no size limit | `PatientMessagesScreen.tsx:337-352` | Medium | G12-I-96 |
| G12-E-34 | The two bot screens write patient messages on opposite sides of the same conversation store, so one of them shows swapped sender sides in the clinic inbox | `PatientMessagesScreen.tsx:304-309` vs `PatientCareBotScreen.tsx:326-330` | Medium | G12-I-107 |
| G12-E-35 | Pharmacy shows the same three medicines, prices and "Counter 3 … East Clinical Wing" to every patient as their own prescription | `PatientPharmacyScreen.tsx:29-52,68-76` | High | G12-I-108 |
| G12-E-36 | [SECURITY] Task visibility and the direct-link guard match patients by "name contains" (a patient named "Ann" matches "Joanna …"), and the "no active patient → deny" rule can never trigger because of E-01 | `PatientTasksScreen.tsx:43-83`; `PatientTaskDetailPage.tsx:62-90` | High | G12-I-125 |
| G12-E-37 | [SECURITY] Task link and file addresses are placed in links without checking they are web addresses | `PatientTaskDetailPage.tsx:333-339,346-352` | Medium | G12-I-126 |

---

## Open questions for PM
1. **G12-Q-01** (G12-I-01, I-02, E-01..E-04, E-06, E-07, D0): What is the patient auth model? Real one-time code by SMS/email, lifetime and retry limits, session length, whether passwords exist at all, whether client ID is a valid login, and what happens on duplicate phone/email at registration.
2. **G12-Q-02** (G12-I-17, I-23, E-12, E-26, D1): Check-in from phone vs the kiosk. Should the phone create the same token and station allocation the kiosk does? Is there a geofence? Should it set the appointment to "Arrived" and notify the doctor?
3. **G12-Q-03** (G12-I-18..I-22, D1): Who owns queue position, now-serving and ETA, and what is the ETA formula? Should Today show the doctor avatar, specialty, suite and clinic address?
4. **G12-Q-04** (G12-I-41, I-50, I-51, E-16, E-20, D2, D3): Which payment gateway and rails (card, Apple/Google Pay, UPI)? What counts as "paid" for prepaid bookings and for invoice payment? Is a receipt PDF required? What happens to a prepaid booking that is cancelled (refund)?
5. **G12-Q-05** (G12-I-35, I-40, D2): Reschedule and cancel: allowed, 24-hour rule, mandatory reason, and who is told. Provider photos, bios, specialty filter?
6. **G12-Q-06** (G12-I-37, D2): Slot hold during checkout: how long?
7. **G12-Q-07** (G12-I-43): Should patient bookings follow the clinic's "appointment automation required" setting? The portal currently overrides it.
8. **G12-Q-08** (G12-I-48, D3): Should the balance be broken down by copay, diagnostics, pharmacy? Which invoice categories?
9. **G12-Q-09** (G12-I-60..I-66, E-13, E-23, D1, D4): Autosave and drafts, progress bar, mandatory signature per form type, lock after submit, what the "cryptographic timestamp" must prove, and whether consent signing belongs in the stage drawer or Forms.
10. **G12-Q-10** (G12-I-67, D4): Do form answers stay as a submission record on the client profile, or update client fields (allergies, DOB, insurance)?
11. **G12-Q-11** (G12-I-72..I-79, D5): Accepted file types and size (the PRD says PDF/JPG/PNG; the portal also takes Word and caps at 10 MB; chat PRD says 25 MB). How do clinic staff verify patient uploads? Do we need the PDF viewer, zoom and watermark?
12. **G12-Q-12** (G12-I-82, I-86, I-88, I-92, I-96, I-97, D6): Channel order (PRD: bot first; built: clinician first). Should bot answers carry buttons and live balance? Emergency keywords and wording. Where do clinic hours come from? File size limit.
13. **G12-Q-13** (G12-I-101, I-102, E-27, E-34, D6): Should the Messages bot and the full-page Care Bot be one per-patient thread? Who answers when the clinic setting is "human first"?
14. **G12-Q-14** (G12-I-108..I-112, E-35, D7): Where do a patient's prescriptions come from (which module)? Should prices show? Is pharmacy a drawer item or only a stage? Refill request routing.
15. **G12-Q-15** (G12-I-93, E-28, D6): Are "public" care groups visible to every patient or only members? Does leaving a group also update the clinic side?
16. **G12-Q-16** (G12-I-04, E-08, E-09, D0): Which profile fields can a patient edit directly vs by request, and does changing phone/email need re-verification? Where do notification preferences live and who honours them?
17. **G12-Q-17** (G12-I-24, D1): Should Today show every assigned pathway or only the most recently moved one first?
18. **G12-Q-18** (G12-I-06, D0): Should a patient ever see a clinic switcher?
19. **G12-Q-19** (G12-I-123, E-36, D8): Are portal-scoped tasks with no named patient meant to appear for every patient?
20. **G12-Q-20** (G12-I-124, D8): Should the "Task Assigned" chat notice be a card (stage, deadline, button) rather than text?

---
_Appendix for the glossary_: "Companion" (product), "Patient portal" (code name `/patient`), "Care Bot" / "Care Chat Bot" (bot), "Visits" (nav label) = Appointments (PRD) = `/patient/book`, "Today" (nav label) = status screen (`/patient/status`), "Billing" (nav label) = `/patient/bill`, "client" (clinic side) = "patient" (portal side).
