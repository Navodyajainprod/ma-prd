# G3 — Call Logs + AI Scribe — Gap Analysis
_Sources:_ PRD files `content/client/call-logs.md`, `content/client/scribe.md` | Prototype routes `/call-logs`, `/call-logs/:id`, `/scribe`. Files: `app/pages/CallLogs.tsx`, `app/pages/CallDetails.tsx`, `app/pages/AIScribeConsole.tsx`, `app/components/telephony/**`, `app/components/scribe/**`, `lib/processLogsStore.ts`, `lib/scribeSessionStore.ts`. Hand-off code checked: `reception/lib/api/mockMaClient.ts`, `app/components/invoices/InvoiceDetailDrawer.tsx`, `app/components/claims/CreateClaimDrawer.tsx`, `app/components/appointments/AppointmentDetailDrawer.tsx`, `app/components/ai/AIAssistantCapsule.tsx` | Analysed 2026-11-12

> Reading notes
> - Citations are `file:line` relative to `E:\mantra-assist\src\`. PRD citations are `file § section`.
> - All data lives in the browser. Call logs are stored in localStorage and sessionStorage. Scribe sessions are stored in **sessionStorage only**. There is no server, so no screen has a loading or network-error state. Each table only has an empty state.
> - Both PRDs are short stubs with two features each and no Cross-product Summary. Most findings are therefore either "Missing in PRD" or prototype defects. The few specific PRD claims (Missed/Voicemail outcomes, click-to-dial, intent tags, SOAP structure, Sign & Attach) are either not built or contradicted.
> - Out of scope, cross-reference only: `/admin/call-logs` (`app/pages/admin/AdminCallLogs.tsx`, super-admin agent) and the telephony trunk settings (`app/components/telephony/TelephonyIntegrationPanel.tsx`, mounted in Settings at `app/pages/Settings.tsx:7847`, Settings agent).

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Call Logs list (`/call-logs`, G3-L) | 2 | 1 | 6 | 3 | 2 | 9 | 20.8% |
| Call detail (drawer + `/call-logs/:id`, G3-D) | 2 | 1 | 4 | 1 | 4 | 7 | 31.3% |
| AI Scribe (`/scribe` + recorder + transcript drawer, G3-S) | 2 | 0 | 7 | 2 | 5 | 13 | 18.2% |
| Hand-offs (Call/Kiosk → logs; Scribe → Invoice/Claim/Profile, G3-X) | 0 | 0 | 5 | 0 | 1 | 5 | 0.0% |
| **G3 total** | **6** | **2** | **22** | **6** | **12** | **34** | **19.4%** |

**Overall coverage: 19.4% · PRD-backed coverage: 19.4%.** Every scored screen falls under one of the two PRD files. The hand-off rows are scored against the "cross-product synchronization" claims in both PRDs.

Coverage % = (Matches + 0.5×Partial) ÷ (Matches + Partial + Missing + Contradicts). PRD-only and Prototype defect rows are excluded.

Section E has 34 defects: **Critical 3 · High 13 · Medium 15 · Low 3**.

## Route map
| Route(s) | Nav entry | Page file | PRD file |
| :--- | :--- | :--- | :--- |
| `/call-logs` | WORKSPACE › "Call Logs" (`app/config/navigation.ts:78-83`) | `app/pages/CallLogs.tsx` (+ `components/telephony/CallDetailDrawer.tsx`, `ScheduleCallDrawer.tsx`) | `content/client/call-logs.md` |
| `/call-logs/:id` | none; reachable by URL only. It links only to itself (`app/pages/CallDetails.tsx:261, 287`) | `app/pages/CallDetails.tsx` | `content/client/call-logs.md` |
| `/scribe` | WORKSPACE › "AI Scribe" (`app/config/navigation.ts:102-107`) | `app/pages/AIScribeConsole.tsx` (+ `components/scribe/AIScribePopup.tsx` via `NewConsultationDrawer.tsx`, `TranscriptDetailDrawer.tsx`) | `content/client/scribe.md` |
| Global Scribe launcher (every page) | "AI Scribe" button in the AI assistant capsule (`app/components/ai/AIAssistantCapsule.tsx:114-126`, mounted in `app/components/layout/MainLayout.tsx:98`) | `components/scribe/AIScribePopup.tsx` | `content/client/scribe.md` |
Routes are defined at `app/routes.tsx:222, 230-231`. They sit inside the authentication guard only (`app/routes.tsx:215`; `app/components/auth/ProtectedRoute.tsx`).

Unused files that are not mounted anywhere: `components/scribe/AIScribeModal.tsx`, `components/scribe/TranscriptFieldMappingDrawer.tsx`, `components/scribe/AIScribeFloatingWidget.tsx`. Scribe settings, queue and analytics helpers are also unused (`lib/scribeSessionStore.ts:578-717`). None of these are scored.

---

## A. Product map — as built

### A1 Call Logs list (`/call-logs`)
**Purpose.** This is one list of calls and other outreach events per client. Each row ties a client to a **process** and **stage**, so the list doubles as a process-progress log. The page header shows a "Telephony" badge and the subtitle "View and manage call logs and recordings with precision" (`app/pages/CallLogs.tsx:1253-1263`).

**User roles.** No role gating. Any signed-in user can view calls, recordings and transcripts, schedule calls, and (apparently) delete calls (`app/routes.tsx:215, 230`; `app/components/auth/ProtectedRoute.tsx`).

**Where the data comes from.** Rows come from the shared call-log store (`app/pages/CallLogs.tsx:503-512`; `lib/processLogsStore.ts:76-141`):
- **Demo workspace:** seeds 5 "Patient Care Journey" rows and 21 sample calls (`lib/processLogsStore.ts:25-57`).
- **Fresh workspace:** starts empty (`lib/processLogsStore.ts:92-106`).
- **Other writers:** the process engine and the AI Receptionist kiosk add or update rows. One row is kept per client and process. If a row already exists, its stage and date are overwritten instead of a new row being added (`lib/processLogsStore.ts:154-198`).
- **Rows that are not calls:** new rows from these writers are typed "SMS" or "WhatsApp", with status "In Progress" (`lib/processLogsStore.ts:184-185`).
- **Refresh triggers:** the list reloads on store events, storage changes, window focus, tab visibility and a broadcast channel (`app/pages/CallLogs.tsx:516-554`).
- **Unused seed:** a separate 100-row seed list in the page file is never used (`app/pages/CallLogs.tsx:51-151`).

**Screens.**
- Page header with a "How Calls Works" help modal (`app/pages/CallLogs.tsx:1253-1265, 2212-2225`).
- Top bar (`app/pages/CallLogs.tsx:1294-1305`):
  - search box ("Search call logs...")
  - advanced-filter modal
  - Export
  - primary action "Schedule Call"
- Table (`app/pages/CallLogs.tsx:1885-1958`). Columns:
  - Call ID (link that opens the detail drawer)
  - Previous Stage
  - Last Stage
  - Client, with a coloured outbound or inbound phone icon
  - Status badge
  - Date & Time
  - Duration

  There is no phone column, no process column and no column sorting. The shared table component has no sort support.
- Row actions: View, Call, Delete (`app/pages/CallLogs.tsx:1960-1989`).
- Bulk delete (`app/pages/CallLogs.tsx:1997-2008`).
- A separate bulk bar with "Trigger Calls" and "Cancel Scheduled" (`app/pages/CallLogs.tsx:1842-1880`).
- Modals: Trigger Calls (`:2022-2108`), Cancel Scheduled Calls (`:2111-2140`), Custom Date Range (`:2143-2182`; never opened, see E-16), Export (`:1684-1710`).
- Schedule Call drawer (`app/components/telephony/ScheduleCallDrawer.tsx`).

**Flows.**
1. *Browse and search.* The user opens Call Logs and the table lists all rows. Typing filters on **client name only** (`app/pages/CallLogs.tsx:1050-1061`). Empty result shows "No call logs found matching your filters." (`:2011`).
2. *Advanced filter.* The modal shows saved-search chips ("Deals in progress", "Test deals"…), Name, Responsible person, Stage group, Comment, Created on, and optional fields via "Add field". **Search applies nothing** because the handler only closes the modal (`app/pages/CallLogs.tsx:1666-1672`). The Call type, Status and Duration inputs are not connected to any state (`:1531-1572`). See E-09.
3. *Schedule a call.* The user clicks Schedule Call and the drawer opens. Steps:
   1. Search for a client by email, phone or name (`ScheduleCallDrawer.tsx:215`).
   2. Pick a process, then a stage. The stage list appears only if the process is in the page's fixed process→stage map (`ScheduleCallDrawer.tsx:328-368`; `app/pages/CallLogs.tsx:805-811`).
   3. Pick a date on a calendar. Past days are disabled (`ScheduleCallDrawer.tsx:443-451`).
   4. Set the time on a 24-hour spinner.

   Validation: the button is disabled until a client and date are set (`ScheduleCallDrawer.tsx:580`). There is also a toast fallback "Please select a client and a date/time" (`app/pages/CallLogs.tsx:851-853`). After a simulated 0.9 s delay, a "Pending" outbound row is added to the top of the list and a success toast appears (`:854-885`). **The row is not saved to the store** (E-11).
4. *Bulk trigger calls.* The user selects rows and clicks Trigger Calls. A modal offers "Start Immediately" or "Schedule for Later"; date and time are required for later (`:2022-2108`). Confirm shows a toast only, and no rows are created (`:1012-1024`, E-12).
5. *Cancel scheduled calls.* "Cancel Scheduled" is enabled only if a selected row has a scheduled call (`:1043-1046, 1864-1876`). A confirm modal warns "This action cannot be undone" (`:2111-2140`). Confirm clears the scheduled flag in page memory only (`:1026-1037`).
6. *Click-to-dial.* The row action "Call" shows "Call feature coming soon" (`:1974-1979`, E-08).
7. *Delete.* The row "Delete" and bulk "Delete Selected" show success toasts. Nothing is removed and there is no confirmation (`:1982-1987, 2000-2007`, E-10).
8. *Export.* The shared export modal offers date and status filters (Completed/Failed/Pending). Fields: Call ID, Client Name, Call Type, Status, Process, Stage, Duration, Date & Time (`:1684-1710`).
9. *Open details.* Clicking the Call ID or "View" opens the Conversation Details drawer (A2) (`:1890-1898, 1964-1969`).
10. *Client filter.* The page can show a "Showing call logs for <client>" banner with "Clear Filter" when another screen sends a client (`:888-903, 1265-1292`). No screen does this today (E-16).

**Business rules.**
- Statuses: Completed (green), Pending (amber), and anything else in red. "Failed" and process-generated "In Progress" therefore look the same (`app/pages/CallLogs.tsx:1937-1952`, E-13).
- The direction icon is outgoing for "Outbound" and incoming for every other type, including SMS and WhatsApp (`:1926-1931`).
- A process missing from a row is derived from its stage through a fixed map, for example Slot Selection → Appointment Scheduling (`:479-500`).
- A scheduled call stores client, process, stage, date and time. Status is "Pending" and type is "Outbound" (`:856-872`).

**KPIs & metrics.** The list page shows none.

**Cross-module references.** Process board (`/deals`) and Client Profile read and write the same store (`app/pages/Deals.tsx:32`; `app/pages/ClientProfile.tsx:35`). The AI Receptionist kiosk writes to it (`reception/lib/api/mockMaClient.ts:795, 1119, 1489`). Overview reads it (`app/pages/Overview.tsx:136`). The patient portal status screen reads it (`app/pages/patient/PatientStatusScreen.tsx:268`).

### A2 Call detail — Conversation Details drawer and `/call-logs/:id` page
**Purpose.** Review a single call: its recording, summary, transcript and retry history.

**User roles.** No role gating.

**Screens.**
- **Conversation Details drawer** (`app/components/telephony/CallDetailDrawer.tsx:624-1020`). The same drawer opens from Call Logs, Client Profile (`app/pages/ClientProfile.tsx:4318`), the Appointment drawer (`app/components/appointments/AppointmentDetailDrawer.tsx:1260`) and the Process board (`app/pages/Deals.tsx:3269`).
  - Header: call ID, client initial and name, client phone (`:631-656`).
  - Tabs: **Overview** and **Retry History** (`:661-686`).
  - Overview: Recording card, Summary card and Transcription card (`:692-860`).
  - A third panel, "Call Review", exists in code (`:873-1012`) but has no tab button, so no one can reach it (E-01).
- **`/call-logs/:id` page** (`app/pages/CallDetails.tsx`). Contents:
  - Summary block
  - Rating & Feedback with half-star rating and a text box
  - Call Relationship (parent and child calls)
  - Recording
  - Transcript with a download button
  - "AI Insights": Positive Sentiment, Call Quality, Efficiency Score, Key Information Captured

  All of it is fixed content for "Sarah Johnson", whatever ID is in the URL (`:21-28, 160-190, 346-416`, E-07).

**Flows (drawer).**
1. The drawer opens on Overview. If the requested call can't be found by exact ID, it tries a case-insensitive match, then a digit match, and finally falls back to the first call in the store (`CallDetailDrawer.tsx:353-380`).
2. *Recording.* Steps:
   1. Play/Pause toggles an icon. The progress bar jumps between 15% and 50% (`:711-721`).
   2. End time shows the call duration (`:722-725`).
   3. Speed buttons: 1x, 1.25x, 1.5x, 2x (`:736-751`).
   4. Download button has no handler (`:727-731`).
   5. A 1–5 star rating is held on screen only (`:752-768`).

   **No audio exists, and the card shows even for Failed or Pending calls** (E-03).
3. *Summary.* The text is templated and says "outbound follow-up call … to a prospective customer". It is the same for every call, including inbound ones (`:777-795`).
4. *Transcription.* Speech bubbles are labelled "AI Assistant" (right) and "Client" (left). There are 9 fixed lines with only the client's first name and current stage filled in (`:409-467, 813-857`). The header always says "17 Messages" (`:811`). Timestamps exist in the data but are not shown, and there is no search (E-02).
5. *Retry History.* A table of 5 attempts: call type, process, initial stage, updated stage, status (COMPLETED/BUSY/…), created at, scheduled on. Four of the five rows have fixed "Oct 10, 2026" times (`:484-542, 862-871`, E-04).
6. *Close.* Closing resets the tab, playback and rating (`:382-389`).
7. *Empty state.* With no call found and an empty store, the drawer body is blank (`:1017`).

**Business rules.**
- The client phone comes from the clients list in sessionStorage. If none is found, a fixed number is shown (`CallDetailDrawer.tsx:399-407, 470`, E-05).
- Speaker attribution is always "AI Assistant" vs "Client". No human-agent speaker exists anywhere.

**KPIs & metrics** (Call Review panel only; built but unreachable, `CallDetailDrawer.tsx:192-299`):
| Metric | Where shown | Formula | Citation |
| :--- | :--- | :--- | :--- |
| Call Outcome | Call Review (unreachable) | Not Completed → "No Outcome". Completed and previous stage ≠ current stage → "Stage Advanced". Otherwise "No Change". | `CallDetailDrawer.tsx:196-201` |
| How long | Call Review (unreachable) | Call duration, or "—" if empty or 0:00 | `CallDetailDrawer.tsx:203-207` |
| What next / follow-up date | Call Review footer (unreachable) | "Scheduled" if the call has a scheduled follow-up. The date is a seeded random 3–14 days after 15 Apr 2024: **hardcoded – formula undefined** | `CallDetailDrawer.tsx:209-216` |
| Disconnect / End Reason | Call Review (unreachable) | **hardcoded – formula undefined** (seeded random pick from 4 values) | `CallDetailDrawer.tsx:218-221` |
| Barge-in Count | Call Review (unreachable) | **hardcoded – formula undefined** (seeded random 0–7) | `CallDetailDrawer.tsx:223-226` |
| Tool / Action Failure | Call Review (unreachable) | **hardcoded – formula undefined** (seeded random, 15%) | `CallDetailDrawer.tsx:228-231` |
| Loop Detected | Call Review (unreachable) | **hardcoded – formula undefined** (seeded random, 10%) | `CallDetailDrawer.tsx:233-236` |
| Client happiness (x / 5) | Call Review (unreachable) | **hardcoded – formula undefined** (seeded random 3.0–5.0) | `CallDetailDrawer.tsx:240-247` |
| Sentiment start / mid / end | Defined, not rendered | **hardcoded – formula undefined** (weighted random 50/35/15) | `CallDetailDrawer.tsx:249-251` |
| Time the AI spoke, warmth, longest stretch, silence | Call Review (unreachable) | **hardcoded – formula undefined** (seeded random ranges) | `CallDetailDrawer.tsx:258-271` |
| Fields updated from this call | Call Review (unreachable) | For Completed calls: Stage (if changed), Next Follow-up (if scheduled), Last Contact = call date | `CallDetailDrawer.tsx:287-298` |
| Sentiment, Call Quality, Efficiency "20% faster than average" | `/call-logs/:id` AI Insights | **hardcoded – formula undefined** (static text) | `app/pages/CallDetails.tsx:371-416` |

**Cross-module references.** The Appointment drawer lists calls by matching client, not appointment. When a client has no calls, it **invents two sample calls** (`app/components/appointments/AppointmentDetailDrawer.tsx:658-697`, E-32). There is no link from a call to an appointment or a task.

### A3 AI Scribe (`/scribe`, recorder popup, transcript drawer)
**Purpose.** Ambient recording of a consultation (or upload of audio), turned into a transcript and extracted clinical data. Saving also produces a prescription document for the patient's record. The page subtitle is "Ambient clinical voice intelligence & prescription engine" (`app/pages/AIScribeConsole.tsx:166-170`).

**User roles.** No role gating. Any signed-in user can record, pick any doctor as the responsible clinician, and produce an "Attested" note and a "Verified" prescription (`app/routes.tsx:222`; `components/scribe/AIScribePopup.tsx:126, 895-902`).

**Screens.**
- **Console list** (`app/pages/AIScribeConsole.tsx`).
  - Search box "Search transcripts by patient name, keyword..." (`:180-188`).
  - Preset chips: All Consultations / Completed / Upcoming (`:192-196`).
  - Filter fields: Patient Name, Status (`:197-212`).
  - Primary action "Add Scribe" (`:214-217`).
  - Table columns: NAME, WORKFLOW (session title), DURATION, RESPONSIBLE, CREATED AT, STATUS (`:222-294`).
  - Row actions: View Transcript, Download PDF, Share via WhatsApp, Delete Record (`:298-327`).
  - Bulk action: Delete Selected (`:330-340`).
  - WhatsApp modal (`:385-428`). How-it-works modal (`:432-446`).
- **Recorder popup** (`components/scribe/AIScribePopup.tsx`). Draggable, with 2 steps: record → assign (`:86`). On save, it shows a toast notification and immediately closes without an intermediate confirmation screen.
- **Transcript detail drawer** (`components/scribe/TranscriptDetailDrawer.tsx`). Renders as a true right-side slide-over drawer (`w-full max-w-4xl bg-[#f8fafc] border-l border-border h-full shadow-2xl animate-in slide-in-from-right duration-300`) with backdrop overlay. Contents:
  - Title "Conversation with <patient>"
  - Recording card (simulated playback, scrub, speed, star rating)
  - Summary card
  - Transcription timeline (Doctor / Patient)

**Flows.**
1. *Browse and search.* Sessions load from sessionStorage, newest first. Search matches patient name, diagnosis or transcript text (`app/pages/AIScribeConsole.tsx:37, 101-107`; `lib/scribeSessionStore.ts:597-623`).
   - The "Completed" and "Upcoming" chips type that word into search, so they match text rather than status. The Status filter has no handler (`AIScribeConsole.tsx:192-211`, E-25).
   - Empty state: "No Transcripts Found. Click the + button above to record your first consultation." (`:355`).
2. *Start a session.* The user clicks "Add Scribe" or a launch point elsewhere (AI capsule, Clients, Client Profile, Appointments, Appointment drawer, Process board, Invoice drawer). The recorder opens on the Record step (`AIScribePopup.tsx:137-178`).
   - If no patient was passed in, the **first client in the list is preselected** without telling the user (`:164-168`, E-18).
   - The user picks **Live** or **Upload Audio** (`:480-498`).
3. *Record (live).* Steps:
   1. "Start Ambient Recording" starts a 1-second timer with toast "Ambient microphone listening started" (`:240-244, 182-190, 646-652`).
   2. A pulse dot and animated bars show "Listening to Consultation..." (`:576-600`).
   3. Pause and Resume stop and restart the timer, with toasts (`:245-251, 608-626`).
   4. Restart resets the session (`:254-262`).

   **The microphone is never accessed** (E-17).
4. *Upload.* The user picks an audio file and gets the toast "Loaded audio: <name>" (`:520-545`). "Finish & Save Consultation" is available whether or not a file was chosen (`:653-660`, E-28).
5. *Assign (step 2 of 2).* Streamlined to 4 essential inputs:
   - **Contact**: Search existing clients dropdown, or toggle "+ New / Walk-in" to type a new patient name.
   - **Link Appointment**: Selectable appointment dropdown populated with scheduled appointments for that contact, or "No appointment linked".
   - **Session Date / Appointment Date**: Date picker input (`YYYY-MM-DD`). In Client Profile, the clinician fills/customizes this date (defaulting to today). In Appointment Drawer, this date is pre-filled automatically from the appointment.
   - **Attendee Name**: Selectable dropdown populated from active team members (`useTeamMembers()`). Pre-filled with the logged-in user or the assigned appointment clinician.
   - *Note*: Extraneous inputs (Age, Gender, Link Entity dropdown, and Consultation Title input) are omitted from Step 2; consultation title is auto-generated cleanly as `${patientName}_Consultation_${sessionDate}`.
   - *Pre-fill behavior*:
     - **Contact Profile (`ClientProfile.tsx`)**: Contact is pre-filled; Link Appointment lists this contact's appointments (defaulting to "No appointment linked"); Session Date is filled/edited by user; Attendee defaults to logged-in user.
     - **Appointment Drawer (`AppointmentDetailDrawer.tsx`)**: Contact, Link Appointment, Session Date, and Attendee Name are all pre-filled automatically from the appointment.

   "Back to Recording" returns to step 1 (`:264-276, 680-856`).
6. *Save Consultation* (`:286-366`). Action button is a clean, single **Save** button (replacing "Confirm & Generate SOAP Notes"). Steps:
   1. Builds a session from **preset scenario #1** (ophthalmology / cataract). Only the patient name is swapped in (`:288, 310-323`).
   2. Uses the selected attendee as the doctor. Duration is the timer value, or 78 s if it is zero (`:343`). Status "completed" (`:345`).
   3. Saves the session (`lib/scribeSessionStore.ts:630-672`). Saving also: (a) adds a "Scribe Recorded" or "Scribe Uploaded" activity to the client's timeline (`:637-662`); (b) marks the patient "Completed" in the scribe queue (`:665-669`).
   4. Files a prescription document into the client's Documents (`AIScribePopup.tsx:359-361`; `lib/scribeSessionStore.ts:719-781`).
   5. Shows a success notification "AI Scribe consultation saved for <patient>!" and immediately closes the popup (removing the legacy intermediate confirmation screen). Transcript can be accessed anytime from the Scribe Console or Client Profile.
7. *Review transcript.* Opens as a right-side slide-over drawer showing:
   - Recording card: the play timer counts to the session duration (speed-adjusted), scrubbing moves the position, rating stays on screen (`TranscriptDetailDrawer.tsx:306-321, 412-500`).
   - Summary: a narrative built from patient age and gender, doctor, chief complaint, diagnosis and medicines (`:365-370, 518`).
   - Transcript: Doctor and Patient turns with patient-name substitution (`:528-585`).

   **No SOAP or note view, no edit and no sign action is shown.** An 11-section prescription template and its field values are prepared in code but never rendered (`:39-106, 144-173, 331-343`, E-20).
8. *Download PDF* (row action). This files **another** prescription document and shows "Prescription downloaded…". No file is downloaded (`AIScribeConsole.tsx:305-311`, E-21).
9. *Share via WhatsApp.* The modal previews a message with a fixed link `…/rx/doc89421`. "Send" shows a success toast only (`AIScribeConsole.tsx:400-424`, E-22).
10. *Delete.* Row and bulk delete remove the session immediately, with no confirmation (`AIScribeConsole.tsx:321-340`; `lib/scribeSessionStore.ts:674-679`, E-23).

**Business rules.**
- Extracted data structure (`lib/scribeSessionStore.ts:26-46`):
  - chief complaint
  - vitals
  - diagnosis
  - ICD-10 code
  - secondary diagnoses
  - medications (drug, dosage, frequency, duration, instructions, confidence)
  - investigations
  - advice
  - follow-up date or days
  - doctor notes

  There is no SOAP structure and there are no CPT or procedure codes.
- Linked entity types: client, appointment, invoice, insurance, claim (`AIScribePopup.tsx:58-64`). Only the type is stored. A specific record is stored only when the launcher passes one (`:334-338`).
- The prescription document is stored as category "Medical / Intake", type pdf, status "Verified" and uploaded by "<doctor> (AI Scribe)". It carries fixed doctor credentials and default age 54 / Male when unknown (`lib/scribeSessionStore.ts:733-738, 764-777`).
- In the transcript drawer, an unknown patient gender is guessed from a list of first names. Unknown age defaults to 34 or 45 (`TranscriptDetailDrawer.tsx:132-142`, E-26).
- Status badge: "recording" or "transcribed" → In Progress; "upcoming" or "scheduled" → Upcoming; anything else → Completed (`AIScribeConsole.tsx:136-162`).

**KPIs & metrics.** None are shown on `/scribe`. The analytics helper is not used anywhere. If it were wired up, it would compute time saved = sessions × 8.5 min − recorded minutes, which is **hardcoded – formula undefined** because of the 8.5-minute placeholder. Average confidence is a fixed 98.4: **hardcoded – formula undefined** (`lib/scribeSessionStore.ts:694-717`).

**Cross-module references.** See A4.

### A4 Hand-offs (as built)
| Trigger | Data passed | Target | Source ref | Target ref |
| :--- | :--- | :--- | :--- | :--- |
| Kiosk walk-in registration | client, default process, stage "Initial Contact" | Call Logs row (type "WhatsApp", status In Progress) | `reception/lib/api/mockMaClient.ts:795-800` | `lib/processLogsStore.ts:154-198` |
| Kiosk appointment booking | client, default process, stage "Confirmed" | Call Logs row (update or create) | `reception/lib/api/mockMaClient.ts:1119-1124` | same |
| Kiosk walk-in check-in | client, default process, stage "Initial Contact" | Call Logs row | `reception/lib/api/mockMaClient.ts:1489-1494` | same |
| Process test chat / process entry | client, process, stage, channel | Call Logs row | `app/components/process/TestProcessChatDrawer.tsx:110-116` | same |
| Stage change on a client or process | new stage | Call Log row → clients and deals stores | `lib/processLogsStore.ts:200-310` | `app/pages/Deals.tsx`, `ClientProfile.tsx` |
| Call → Appointment | **none.** The transcript text says "I've scheduled your consultation", but no appointment is created or linked | — | `CallDetailDrawer.tsx:463-466` | — |
| Scribe saved | activity entry (diagnosis, meds, transcript preview, extracted data) | Client Profile timeline | `lib/scribeSessionStore.ts:637-662` | `app/components/activity/ActivityTab.tsx:632-704` |
| Scribe saved / Download PDF | prescription document | Client Documents | `lib/scribeSessionStore.ts:719-781` | `lib/clientDocumentsStore` |
| Scribe launched from Invoice drawer | transcript excerpt, chief complaint, diagnosis → invoice custom fields (notes, diagnosis, chief_complaint). Billing-code lines are coded but never filled | Invoice detail fields | `app/components/invoices/InvoiceDetailDrawer.tsx:1163-1180` | `InvoiceDetailDrawer.tsx:489-537` |
| Create Claim from appointment | latest scribe session for that client → rendering provider, gender, estimated DOB, diagnosis codes A/B | Claim diagnoses | `lib/scribeSessionStore.ts:597` | `app/components/claims/CreateClaimDrawer.tsx:247-289, 712-722` |
| Scribe launched from Appointment drawer | client, process, appointment ID as generic record ID (never as appointment link) | Scribe session | `app/components/appointments/AppointmentDetailDrawer.tsx:1270-1285` | `AIScribePopup.tsx:334-338` |

---

## B. Product map — per PRD

### B1 Call Logs (`content/client/call-logs.md`)
- **Purpose** (§ 1. Module Summary): a unified VoIP telephony hub that logs all inbound and outbound clinical calls, has an audio player for recordings, shows AI transcriptions with sentiment tagging, and supports scheduling callback reminders.
- **Roles** (§ F-1 Jobs to be done, § F-2 Jobs to be done): Front Desk Staff and Quality Assurance Supervisor. Nothing is said about access control.
- **F-1 Inbound & Outbound VoIP Call Log Stream** (§ F-1):
  - Calls handled by clinic staff **and** AI voice agents.
  - Sortable columns: Call Direction, Patient Name, Phone Number, Duration, Date/Time, Call Outcome (Completed, Missed, Voicemail), Assigned Process.
  - F-1.1: direction and status icons for Inbound, Outbound, Missed and Voicemail, colour-coded.
  - F-1.2: duration (e.g. "4:32") and timestamp with relative date, accurate to the second.
  - F-1.3: click-to-dial from any row, which launches a softphone.
  - Worked example: filter by "Missed Calls", then call back from the dialer icon.
  - AC F-1-1: every call placed or received through the system generates a log entry with duration and status.
- **F-2 Integrated Audio Player & Dual-Speaker AI Transcription** (§ F-2):
  - F-2.1: waveform player with play, pause, scrub, speeds 1.0x/1.25x/1.5x and audio download.
  - F-2.2: diarized transcript of alternating Staff/Patient (or Agent/Patient) bubbles with timestamps; searchable.
  - F-2.3: intent tags (Appointment Booking, Prescription Refill, Billing Query) and sentiment (Positive/Urgent), "generated via Whisper LLM".
  - Worked example: a supervisor plays at 1.25x and reads a highlighted transcript.
  - AC F-2-1: calls with recorded audio provide playback and full transcription.
- **Business rules / KPIs:** none beyond the above. No metric definitions.
- **Cross-module:** generic "seamless cross-product synchronization" (§ 1). No Cross-product Summary table.
- **Not covered:** scheduling flow detail, bulk trigger and cancel, retry history, call summaries, QA rating, delete, export, process/stage tracking, links to appointments or tasks.

### B2 AI Scribe (`content/client/scribe.md`)
- **Purpose** (§ 1. Module Summary): ambient listening for in-person or telehealth encounters, transcription "via Whisper", and structured SOAP notes ready for doctor sign-off and EHR sync.
- **Roles:** Physician (§ F-1 / F-2 Jobs to be done). Nothing is said about access control or consent.
- **F-1 Ambient Consultation Audio Recording & Stream** (§ F-1):
  - A single "Start Consultation" button with live waveform and noise-cancellation status.
  - F-1.1: large start/stop toggle with timer and red pulse.
  - F-1.2: real-time waveform that detects speech pauses.
  - F-1.3: pause and resume, with zero data recorded while paused.
  - AC F-1-1: starting recording captures microphone input and shows elapsed time.
- **F-2 Automated Structured SOAP Note Synthesis** (§ F-2):
  - Subjective, Objective, Assessment, Plan.
  - F-2.1: 4-section accordion or tabbed container.
  - F-2.2: rich-text editor with version history.
  - F-2.3: "Sign & Attach to Chart", which signs with clinician credentials, attaches to the encounter and locks the note.
  - Worked example: "End Consultation & Generate Note", note ready in about 8 s, then edit and Sign & Attach.
  - AC F-2-1: notes strictly follow the 4-part SOAP structure.
- **Not covered:** consent, patient assignment, upload mode, prescription documents, WhatsApp sharing, invoice and claim hand-off, ICD/CPT codes, deletion, retention.

---

## C. Findings

### G3-L — Call Logs list
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G3-L-01 | Flow | List columns | Contradicts or stale | call-logs.md § F-1 What it does | `app/pages/CallLogs.tsx:1885-1958` | PRD: Direction, Patient, Phone, Duration, Date/Time, Outcome, Process. Built: Call ID, Previous Stage, Last Stage, Client (+direction icon), Status, Date, Duration. No phone or process column. |
| G3-L-02 | Rule | Call outcome values | Contradicts or stale | call-logs.md § F-1, F-1.1 | `app/pages/CallLogs.tsx:1937-1952`; `lib/processLogsStore.ts:185` | PRD: Completed / Missed / Voicemail. Built: Completed / Failed / Pending / In Progress. The retry tab also uses BUSY and NO ANSWER. Needs one canonical set (Q-01). |
| G3-L-03 | Flow | Inbound/outbound direction icon | Matches | call-logs.md § F-1.1 | `app/pages/CallLogs.tsx:1926-1931` | Missed and Voicemail icons are not built (see L-02). |
| G3-L-04 | Flow | Duration and date-time shown per row | Matches | call-logs.md § F-1.2 | `app/pages/CallLogs.tsx:1953-1957` | Raw "YYYY-MM-DD HH:MM". |
| G3-L-05 | Flow | Relative date ("2 hours ago") | PRD-only (not built) | call-logs.md § F-1.2 | — | |
| G3-L-06 | Flow | Sortable columns | PRD-only (not built) | call-logs.md § F-1 | `app/components/ui/TableComponent.tsx` (no sort) | |
| G3-L-07 | Flow | Click-to-dial from row | Prototype defect | call-logs.md § F-1.3 | `app/pages/CallLogs.tsx:1974-1979` | see E-08 |
| G3-L-08 | Flow | Filter calls (e.g. missed calls) | Prototype defect | call-logs.md § F-1 Worked example | `app/pages/CallLogs.tsx:1666-1672` | see E-09 |
| G3-L-09 | Flow | Search by client name | Missing in PRD | — | `app/pages/CallLogs.tsx:1050-1061` | Name only; phone search not supported. |
| G3-L-10 | Flow | Schedule Call drawer (client, process, stage, date, 24h time; past days blocked) | Partial (PRD less detailed) | call-logs.md § 1 ("scheduling callback reminders") | `ScheduleCallDrawer.tsx:139-590`; `app/pages/CallLogs.tsx:850-885` | The PRD mentions it in one phrase only. |
| G3-L-11 | Flow | Scheduled, triggered and cancelled calls persist | Prototype defect | — | `app/pages/CallLogs.tsx:874, 1026-1037, 516-534` | see E-11 |
| G3-L-12 | Flow | Bulk "Trigger Calls" now or scheduled (intended) | Missing in PRD | — | `app/pages/CallLogs.tsx:2022-2108` | |
| G3-L-13 | Flow | Bulk trigger creates calls | Prototype defect | — | `app/pages/CallLogs.tsx:1012-1024` | see E-12 |
| G3-L-14 | Flow | Bulk "Cancel Scheduled" with confirm modal | Missing in PRD | — | `app/pages/CallLogs.tsx:1864-1876, 2111-2140` | |
| G3-L-15 | Flow | [SECURITY] Delete call log (row / bulk) | Prototype defect | — | `app/pages/CallLogs.tsx:1982-1987, 2000-2007` | see E-10; whether calls may be deleted at all is Q-05 |
| G3-L-16 | Flow | Export call logs (date, status, field picker) | Missing in PRD | — | `app/pages/CallLogs.tsx:1684-1710` | |
| G3-L-17 | Rule | AC F-1-1: every call generates its own log entry | Contradicts or stale | call-logs.md § F-1 Acceptance criteria | `lib/processLogsStore.ts:154-198` | Built: one row per client and process, overwritten on each stage change. Non-call events (SMS, WhatsApp, kiosk) also become rows. Q-02. |
| G3-L-18 | Rule | Status badge and icon for non-call rows | Prototype defect | — | `app/pages/CallLogs.tsx:1926-1952` | see E-13 |
| G3-L-19 | Rule | Previous/Last stage columns show how a call moved the client's process | Missing in PRD | — | `app/pages/CallLogs.tsx:1903-1920` | Core to how calls relate to processes. |
| G3-L-20 | Rule | [SECURITY] Who can see call logs and recordings | Prototype defect | — | `app/routes.tsx:215, 230` | see E-33; Q-10 |
| G3-L-21 | Flow | Client-filter banner and help copy (date range) | Prototype defect | — | `app/pages/CallLogs.tsx:888-903, 965-982, 2218-2223` | see E-16 |
| G3-L-22 | Rule | Schedule Call process/stage options | Prototype defect | — | `ScheduleCallDrawer.tsx:336-368`; `app/pages/CallLogs.tsx:805-811, 869` | see E-15 |
| G3-L-23 | Flow | Empty state "No call logs found matching your filters." | Missing in PRD | — | `app/pages/CallLogs.tsx:2011` | |

### G3-D — Call detail
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G3-D-01 | Flow | Open Conversation Details drawer (Overview / Retry History) from list, Client Profile, Appointment drawer, Process board | Partial (PRD less detailed) | call-logs.md § F-2 Worked example ("Opens call details") | `CallDetailDrawer.tsx:624-686`; `app/pages/ClientProfile.tsx:4318`; `AppointmentDetailDrawer.tsx:1260`; `app/pages/Deals.tsx:3269` | |
| G3-D-02 | Flow | Recording playback and download | Prototype defect | call-logs.md § F-2.1, AC F-2-1 | `CallDetailDrawer.tsx:711-733` | see E-03 |
| G3-D-03 | Rule | Speed options | Contradicts or stale | call-logs.md § F-2.1 | `CallDetailDrawer.tsx:736` | PRD: 1.0/1.25/1.5x. Built adds 2x. Minor. |
| G3-D-04 | Flow | Waveform visual | PRD-only (not built) | call-logs.md § F-2.1 | `CallDetailDrawer.tsx:718-721` (plain bar) | |
| G3-D-05 | Flow | Diarized speech bubbles (AI vs client) | Matches | call-logs.md § F-2.2 | `CallDetailDrawer.tsx:813-857` | |
| G3-D-06 | Flow | Transcript timestamps and search | PRD-only (not built) | call-logs.md § F-2.2 | — | Times exist in the data but are not shown. |
| G3-D-07 | Flow | Transcript reflects the actual call | Prototype defect | call-logs.md § AC F-2-1 | `CallDetailDrawer.tsx:409-467, 811` | see E-02 |
| G3-D-08 | Rule | Calls handled by staff vs AI voice agent (attribution) | PRD-only (not built) | call-logs.md § F-1 What it does; § F-2.2 ("Staff and Patient") | — | No handler field. Every transcript is "AI Assistant". Q-07. |
| G3-D-09 | Flow | AI call summary card (intended) | Missing in PRD | — | `CallDetailDrawer.tsx:777-795` | Content is templated (E-02). |
| G3-D-10 | Flow | Intent tags (Appointment Booking, Refill, Billing) | PRD-only (not built) | call-logs.md § F-2.3 | — | |
| G3-D-11 | Metric | Sentiment and call-review KPIs | Prototype defect | call-logs.md § F-2.3 | `CallDetailDrawer.tsx:192-280, 873-1012` | see E-01 |
| G3-D-12 | Metric | Intended call-quality KPI set (outcome, disconnect reason, barge-in, tool failure, loop, sentiment arc, talk-time, fields updated) | Missing in PRD | — | `CallDetailDrawer.tsx:125-141, 287-298` | Only Call Outcome, How long and Fields updated have real formulas. Q-06. |
| G3-D-13 | Flow | QA star rating and feedback (intended) | Missing in PRD | call-logs.md § F-2 JTBD (QA supervisor) | `CallDetailDrawer.tsx:752-768`; `app/pages/CallDetails.tsx:194-236` | Q-20 |
| G3-D-14 | Flow | Rating and feedback saved | Prototype defect | — | `CallDetailDrawer.tsx:758`; `app/pages/CallDetails.tsx:42-50` | see E-06 |
| G3-D-15 | Flow | Retry history and parent/child call chain (intended) | Missing in PRD | — | `CallDetailDrawer.tsx:473-542`; `lib/processLogsStore.ts:20-22` | Q-19 |
| G3-D-16 | Flow | Retry history data | Prototype defect | — | `CallDetailDrawer.tsx:484-542` | see E-04 |
| G3-D-17 | Rule | [SECURITY] Client phone in header | Prototype defect | — | `CallDetailDrawer.tsx:399-407, 470` | see E-05 |
| G3-D-18 | Flow | `/call-logs/:id` detail page | Prototype defect | call-logs.md § F-2 | `app/pages/CallDetails.tsx:21-28, 160-190, 346-416` | see E-07; which surface is canonical is Q-08 |
| G3-D-19 | X-ref | Call linked to its client (name and ID in header) | Matches | call-logs.md § F-1 (Patient Name) | `CallDetailDrawer.tsx:641-654` | The name is not clickable through to the profile. Links to appointment or task are absent (Q-09). |

### G3-S — AI Scribe
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G3-S-01 | Flow | Scribe console list and search (name, title, duration, doctor, created, status) | Missing in PRD | — | `app/pages/AIScribeConsole.tsx:101-107, 222-294` | |
| G3-S-02 | Flow | Status presets and filter | Prototype defect | — | `app/pages/AIScribeConsole.tsx:192-211` | see E-25 |
| G3-S-03 | Flow | Start/stop control with elapsed timer and pulse | Matches | scribe.md § F-1.1 | `AIScribePopup.tsx:240-252, 576-600, 646-660` | The label is "Start Ambient Recording", not "Start Consultation". |
| G3-S-04 | Flow | AC F-1-1: microphone input captured, and the note reflects it | Prototype defect | scribe.md § F-1 Acceptance criteria | `AIScribePopup.tsx:240-252, 286-345` | see E-17 |
| G3-S-05 | Flow | Live waveform from real audio with speech-pause detection | PRD-only (not built) | scribe.md § F-1.2 | `AIScribePopup.tsx:584-600` (decorative bars) | |
| G3-S-06 | Flow | Pause / resume | Matches | scribe.md § F-1.3 | `AIScribePopup.tsx:245-251, 608-626` | |
| G3-S-07 | Flow | Noise-cancellation status | PRD-only (not built) | scribe.md § F-1 What it does | — | Unused setting flag at `lib/scribeSessionStore.ts:393` |
| G3-S-08 | Flow | Upload recorded audio instead of live (intended) | Missing in PRD | — | `AIScribePopup.tsx:480-545` | |
| G3-S-09 | Flow | Upload validation and processing | Prototype defect | — | `AIScribePopup.tsx:530, 653-660` | see E-28 |
| G3-S-10 | Flow | Assign step: patient (existing or new), age/gender, doctor, linked entity type, title | Missing in PRD | — | `AIScribePopup.tsx:264-276, 680-856` | Q-17 |
| G3-S-11 | Rule | [SECURITY] Patient default and required fields | Prototype defect | — | `AIScribePopup.tsx:164-168, 286-305, 858-866` | see E-18 |
| G3-S-12 | Rule | Note structure: 4-part SOAP | Contradicts or stale | scribe.md § F-2, F-2.1, AC F-2-1 | `lib/scribeSessionStore.ts:26-46`; `TranscriptDetailDrawer.tsx:39-106` | Built extraction and template are prescription-style (11 sections: patient info, complaint, diagnosis+ICD, 3 medication blocks, instructions, precautions, prognosis, follow-up, doctor info), not SOAP. Q-12. |
| G3-S-13 | Flow | Note shown and editable | Prototype defect | scribe.md § F-2.1 | `TranscriptDetailDrawer.tsx:144-173, 331-343` | see E-20 |
| G3-S-14 | Flow | Rich-text editor with version history | PRD-only (not built) | scribe.md § F-2.2 | — | |
| G3-S-15 | Flow | Sign & Attach to chart, lock note | PRD-only (not built) | scribe.md § F-2.3 | — | Q-13 |
| G3-S-16 | Flow | "Attested" / "SOAP notes generated" shown without sign-off | Prototype defect | — | `AIScribePopup.tsx:883-902, 934` | see E-19 |
| G3-S-17 | Flow | Transcript drawer: recording card, narrative summary, Doctor/Patient transcript | Missing in PRD | — | `TranscriptDetailDrawer.tsx:372-590` | |
| G3-S-18 | Flow | Transcript playback and rating | Prototype defect | — | `TranscriptDetailDrawer.tsx:306-321, 489` | see E-27 |
| G3-S-19 | X-ref | Prescription document filed to client Documents (intended) | Missing in PRD | — | `lib/scribeSessionStore.ts:719-781`; `AIScribePopup.tsx:359-361` | Q-18 |
| G3-S-20 | Rule | [SECURITY] Prescription content and "Download PDF" | Prototype defect | — | `lib/scribeSessionStore.ts:733-738, 774`; `app/pages/AIScribeConsole.tsx:305-311` | see E-21 |
| G3-S-21 | Flow | Share prescription via WhatsApp (intended) | Missing in PRD | — | `app/pages/AIScribeConsole.tsx:313-319, 385-428` | |
| G3-S-22 | Flow | [SECURITY] WhatsApp message content and send | Prototype defect | — | `app/pages/AIScribeConsole.tsx:400-424` | see E-22 |
| G3-S-23 | Flow | [SECURITY] Delete clinical record | Prototype defect | — | `app/pages/AIScribeConsole.tsx:321-340` | see E-23 |
| G3-S-24 | Rule | Session persistence | Prototype defect | — | `lib/scribeSessionStore.ts:599, 634` | see E-24; retention is Q-16 |
| G3-S-25 | Rule | [SECURITY] Patient gender and age when unknown | Prototype defect | — | `TranscriptDetailDrawer.tsx:132-142` | see E-26 |
| G3-S-26 | Rule | Speech-to-text engine named | Contradicts or stale | scribe.md § 1 ("via Whisper") | `app/pages/AIScribeConsole.tsx:441` ("Deepgram Nova-2 Medical") | Q-15 |
| G3-S-27 | X-ref | Scribe launchable from AI capsule (all pages), Clients, Client Profile, Appointments, Appointment drawer, Process board, Invoice drawer | Missing in PRD | — | `AIAssistantCapsule.tsx:244`; `app/pages/Clients.tsx:4994`; `ClientProfile.tsx:4332`; `Appointments.tsx:2041`; `AppointmentDetailDrawer.tsx:1270`; `Deals.tsx:4157`; `InvoiceDetailDrawer.tsx:1163` | |
| G3-S-28 | Rule | Note generated in about 8 s; charting under 60 s | PRD-only (not built) | scribe.md § F-2 Worked example, JTBD | — | There is no generation step. Save is instant with preset content. |
| G3-S-29 | Rule | [SECURITY] Who may record, attest and issue prescriptions | Prototype defect | — | `app/routes.tsx:222`; `AIScribePopup.tsx:126` | see E-33; Q-10 |

### G3-X — Hand-offs
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G3-X-01 | X-ref | AI Receptionist kiosk (registration, booking, walk-in check-in) writes a Call Logs entry (intended) | Missing in PRD | — | `reception/lib/api/mockMaClient.ts:795-800, 1119-1124, 1489-1494` | Q-02 |
| G3-X-02 | X-ref | Channel of kiosk-created entries | Prototype defect | — | `lib/processLogsStore.ts:184` | see E-14 |
| G3-X-03 | X-ref | Stage change on a call-log row syncs to client and process (deal) records | Missing in PRD | — | `lib/processLogsStore.ts:200-310` | |
| G3-X-04 | X-ref | Scribe → Invoice: fills invoice notes, diagnosis, chief complaint | Missing in PRD | — | `InvoiceDetailDrawer.tsx:489-537, 1163-1180` | |
| G3-X-05 | X-ref | Scribe → Invoice billing lines | Prototype defect | — | `InvoiceDetailDrawer.tsx:496-525` | see E-29; Q-14 |
| G3-X-06 | X-ref | Scribe → Claim: ICD-10 diagnosis pointers, rendering provider, patient gender | Missing in PRD | — | `CreateClaimDrawer.tsx:247-289` | |
| G3-X-07 | X-ref | Scribe → Claim code and DOB derivation | Prototype defect | — | `CreateClaimDrawer.tsx:249-289, 717` | see E-30; Q-14 |
| G3-X-08 | X-ref | Scribe keeps its appointment link | Prototype defect | — | `AIScribePopup.tsx:320-338`; `AppointmentDetailDrawer.tsx:1270-1278` | see E-31 |
| G3-X-09 | X-ref | Scribe → Client Profile activity timeline | Missing in PRD | — | `lib/scribeSessionStore.ts:637-662`; `ActivityTab.tsx:632-704` | |
| G3-X-10 | X-ref | Appointment drawer call list | Prototype defect | — | `AppointmentDetailDrawer.tsx:658-697` | see E-32 |
| G3-X-11 | X-ref | EHR sync of signed note | PRD-only (not built) | scribe.md § 1 Module Summary | — | No external EHR integration. |

---

## D. Correct flow as built (PRD-ready)

### D1 — replacement for `content/client/call-logs.md`

---
title: "Call Logs, Telephony Hub & AI Transcription"
product: "client"
module: "call-logs"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | CALL-LOGS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| AI Receptionist | Kiosk registration, booking and walk-in check-in | Each event creates or updates the client's entry for the default process, at stage "Initial Contact" or "Confirmed". Decision needed: are these shown in Call Logs, and with what channel label? (see G3-Q-02) | [View in AI Receptionist](/ai-receptionist) |
| Client (Process / Deals) | Stage changes | A stage change on a call entry updates the client's stage and the matching process card, and the reverse also applies. | [View Process](/deals) |
| Client (Client Profile, Appointments) | Call details | The same Conversation Details drawer opens from a client's profile and from an appointment, listing that client's calls. | [View Clients](/clients) |
| Companion | Patient status | The patient portal status screen reads the client's current process stage from call entries. | [View in Companion](/companion/today) |

## 1. Module Summary
- Call Logs lists every inbound and outbound call per client, together with the process and stage the call belongs to. Staff can search, schedule calls, trigger or cancel calls in bulk, export, and open a Conversation Details view with recording, AI summary, diarized transcript and retry history.
- Each entry records how the call moved the client's process: previous stage and last stage.
- Decision needed: does Call Logs hold only telephone calls, or also SMS, WhatsApp and kiosk process events? Is there one entry per call, or one per client and process? (see G3-Q-02)

## 2. Feature Requests

### F-1: Call Log List, Search & Export
#### 1. What it does
Shows one table of calls with Call ID, Previous Stage, Last Stage, Client (with an inbound or outbound icon), Status, Date & Time and Duration. Staff can search by client name, filter, select rows and export.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Direction icon | UI Icon | Outgoing icon for outbound calls, incoming icon for inbound calls | Decision needed: icons for SMS/WhatsApp entries (G3-Q-02) |
| F-1.2: Status badge | Badge | Completed (green), Pending (amber), Failed (red) | Decision needed: canonical outcome set, including Missed/Voicemail/Busy/No answer/In Progress (G3-Q-01) |
| F-1.3: Stage columns | Text | Previous stage and last stage of the client's process at the time of the call | "—" when no previous stage |
| F-1.4: Search | Input | Filters by client name | |
| F-1.5: Advanced filter | Modal | Name, responsible person, stage group, comment, created-on (with custom range), plus optional call type, status, duration, phone, email, notes; Search applies the filters; Reset restores defaults | Filters must apply to the table |
| F-1.6: Export | Modal | Export with date range and status filter; fields Call ID, Client Name, Call Type, Status, Process, Stage, Duration, Date & Time | |
| F-1.7: Empty state | Message | "No call logs found matching your filters." | |
| F-1.8: Client filter | Banner | When opened from a client, shows "Showing call logs for <client>" with Clear Filter | Entry point to be added from Client Profile |
| F-1.9: Delete | Row/bulk action | Decision needed: can call logs be deleted, by whom, and with what audit trail? (see G3-Q-05) | Must confirm before deleting |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Front desk reviews failed calls | Opens Advanced filter, sets Status = Failed, clicks Search | **Only failed calls are listed; the user selects them and clicks Trigger Calls** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front Desk Staff | When following up on calls that didn't connect, I want a filtered list, so that I can re-trigger them quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Every call creates an entry with client, type, status, process, stage, duration and date-time. Decision needed on per-call vs per-process entries (G3-Q-02). |
| F-1-2 | Search by client name and every advanced-filter field narrow the table. |
| F-1-3 | Export respects the chosen date range, status and fields. |

### F-2: Schedule, Trigger & Cancel Calls
#### 1. What it does
Staff can schedule an outbound call for a client at a chosen process stage, date and time. They can trigger calls for many selected entries at once (now or later) and cancel scheduled calls.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Schedule Call drawer | Drawer | Search client by email, phone or name; choose process and active stage; choose date (past days disabled) and 24-hour time | Schedule is disabled until client and date are chosen. Process options are the client's processes and their stages come from the process definition. Times in the past are rejected. |
| F-2.2: Scheduled entry | Record | Adds a Pending outbound entry with process, stage, date and time | Saved to the shared call-log store |
| F-2.3: Bulk Trigger Calls | Modal | "Start Immediately" or "Schedule for Later" (date and time required) for selected entries | Creates one call per selected entry, linked to its parent call |
| F-2.4: Cancel Scheduled | Modal | Enabled only when selected entries have a scheduled call; confirm with "This action cannot be undone" warning | Clears the schedule and is saved |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator books a callback | Clicks Schedule Call, picks the client, process "Patient Intake" and stage "Insurance Verify", picks tomorrow 10:30 | **A Pending outbound call appears at the top of the list for tomorrow 10:30** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Front Desk Staff | When a client asks to be called back, I want to schedule the call at the right process stage, so that the AI agent calls with the right context. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | A scheduled call survives page refresh and appears in the client's profile. |
| F-2-2 | Bulk trigger creates one new call per selected entry, recorded as created by "Call Trigger" from its parent. |
| F-2-3 | Cancelling removes the schedule only after confirmation. |

### F-3: Conversation Details (Recording, Summary, Transcript)
#### 1. What it does
Clicking a Call ID or "View" opens Conversation Details with the client's name and phone, then an Overview of recording, AI summary and diarized transcript. The same drawer opens from Client Profile, Appointment details and the Process board.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Recording player | Player | Play/pause, scrub, speeds 1x/1.25x/1.5x/2x, download audio, call date and duration | Shown only when the call has a recording |
| F-3.2: AI Summary | Card | Reason for the call and intent, generated from the call | Generated per call |
| F-3.3: Transcription | Transcript | Alternating bubbles labelled by speaker (AI Assistant / Client), with message count | Shown only when the call has a transcript. Decision needed: how to attribute human staff speakers (G3-Q-07) |
| F-3.4: Call rating | Stars | 1–5 rating saved against the call | Decision needed: what the rating measures and where it is reported (G3-Q-20) |
| F-3.5: Client phone | Header | Client's phone from the client record | Blank if unknown |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Supervisor reviews a booking call | Opens the call, plays at 1.25x and reads the transcript | **Confirms the agent offered the correct slots and the stage moved to Confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Quality Assurance Supervisor | When evaluating calls, I want recording, summary and transcript together, so that I can verify quality and compliance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Calls with a recording play audio and allow download; calls without one show no player. |
| F-3-2 | Transcript and summary are those of the selected call. |
| F-3-3 | Decision needed: is the drawer or the `/call-logs/:id` page the canonical detail view? (see G3-Q-08) |

### F-4: Retry History & Call Relationships
#### 1. What it does
A Retry History tab lists each attempt for the same client and process: call type, process, initial stage, updated stage, status, created at and scheduled on. Calls created from another call keep a link to their parent.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Retry table | Table | One row per attempt, with column customisation | Built from real attempts |
| F-4.2: Relationship reason | Tag | Call Trigger, Stage Change, Retry, Manual Trigger | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Call was busy, then retried | Opens Retry History | **Sees the BUSY attempt and the later COMPLETED attempt with the stage it reached** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front Desk Staff | When a client says "you called me three times", I want to see every attempt, so that I can explain what happened. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Retry rows reflect real attempts. Decision needed: retry policy and maximum attempts (see G3-Q-19). |

### F-5: Call Review Metrics
#### 1. What it does
A Call Review panel summarises the call's outcome and quality.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Call Outcome | Metric | Not completed → "No Outcome" ("Call did not connect" for failed, "Call hasn't happened yet" for pending). Completed and stage changed → "Stage Advanced (previous → current)". Otherwise "No Change". | |
| F-5.2: How long | Metric | Call duration, or "—" | |
| F-5.3: Fields updated from this call | Table | Stage (if changed), Next Follow-up (if scheduled), Last Contact (call date) | Completed calls only |
| F-5.4: Client happiness, disconnect reason, barge-in count, tool/action failure, loop detected, sentiment start/mid/end, time the AI spoke, warmth, longest stretch, silence | Metrics | Decision needed: define formula for each of these metrics (see G3-Q-06) | Not shown until defined |
| F-5.5: Next follow-up date | Metric | Decision needed: define source for follow-up date (see G3-Q-06) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Supervisor checks if a call worked | Opens Call Review | **Sees "Stage Advanced: Slot Selection → Confirmation" and the fields the call updated** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Quality Assurance Supervisor | When reviewing AI calls, I want outcome and quality signals, so that I can tune the voice agent. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Call Outcome and Fields Updated follow the rules above. Other metrics appear only after their formulas are defined. |

### Not yet built (from previous PRD)
- Click-to-dial from a row through a softphone (the row "Call" action exists). Decision needed: telephony provider and softphone (G3-Q-04).
- Sortable columns. Relative dates. Phone and Assigned Process columns (G3-Q-03).
- Waveform audio visual. Transcript timestamps and search.
- Intent tags (Appointment Booking, Prescription Refill, Billing Query) and Positive/Urgent sentiment.
- Distinguishing calls handled by staff from calls handled by AI agents (G3-Q-07).
- Linking a call to the appointment or task it produced (G3-Q-09).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Call Log List, Search & Export | F-1.1 – F-1.9 | Table of calls with stage movement, status, search, advanced filters and export. |
| F-2 | Schedule, Trigger & Cancel Calls | F-2.1 – F-2.4 | Schedule a call at a process stage; trigger or cancel calls in bulk. |
| F-3 | Conversation Details | F-3.1 – F-3.5 | Recording, AI summary, diarized transcript and rating for one call. |
| F-4 | Retry History & Call Relationships | F-4.1 – F-4.2 | Every attempt and parent/child link for a call. |
| F-5 | Call Review Metrics | F-5.1 – F-5.5 | Outcome, duration and fields updated; other quality metrics pending definition. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front Desk Staff | When following up on calls that didn't connect, I want a filtered list, so that I can re-trigger them quickly. | F-1, F-2 |
| 2 | Front Desk Staff | When a client asks to be called back, I want to schedule the call at the right process stage. | F-2 |
| 3 | Quality Assurance Supervisor | When evaluating calls, I want recording, summary and transcript together. | F-3, F-5 |
| 4 | Front Desk Staff | When a client asks about repeated calls, I want to see every attempt. | F-4 |

---

### D2 — replacement for `content/client/scribe.md`

---
title: "AI Clinical Scribe & Consultation Notes"
product: "client"
module: "scribe"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | SCRIBE |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Client Profile) | Scribe activity and prescription document | Saving a session adds a "Scribe Recorded / Uploaded" entry to the client's activity timeline and files a prescription document in the client's Documents. | [View Clients](/clients) |
| Client (Invoices) | Fill invoice from Scribe | Starting Scribe from an invoice fills the invoice's notes, diagnosis and chief complaint from the session. | [View Invoices](/invoices) |
| Client (Claims) | Diagnosis codes for claims | Creating a claim for an appointment pulls the session's ICD-10 diagnosis, rendering provider and patient gender. | [View Claims](/claims) |
| Client (Appointments, Process) | Launch points | Scribe can be started from Appointments, an appointment's details, the Process board, Clients, Client Profile and the AI assistant capsule. The patient and context are prefilled. | [View Appointments](/appointments) |

## 1. Module Summary
- AI Scribe records a consultation (live ambient audio or uploaded audio), assigns it to a patient and encounter, and produces a diarized Doctor/Patient transcript, a clinical summary and extracted clinical data: chief complaint, vitals, diagnosis with ICD-10, medications, investigations, advice, follow-up.
- From the extracted data it creates a prescription document for the patient, which can be shared over WhatsApp.
- Decision needed: note template, SOAP or the 11-section prescription layout (see G3-Q-12). Sign-off rules (see G3-Q-13). Consent capture (see G3-Q-11).

## 2. Feature Requests

### F-1: Ambient Recording or Audio Upload
#### 1. What it does
A draggable Scribe popup opens on a Record step. The clinician either starts ambient recording or uploads an existing audio file.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Start Ambient Recording | Button | Starts microphone capture with an elapsed-time timer and a live pulse ("Listening to Consultation...") | Captures real microphone input |
| F-1.2: Pause / Resume | Button | Pauses and resumes capture and the timer | Nothing is captured while paused |
| F-1.3: Restart | Button | Discards the current capture and resets the timer | |
| F-1.4: Upload Audio | File input | Loads an audio file to transcribe | "Finish & Save" requires a file |
| F-1.5: Consent | Step | Decision needed: is patient consent required before recording, and how is it captured and stored? (see G3-Q-11) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor begins a visit | Clicks the AI Scribe button and "Start Ambient Recording" | **Timer starts and the popup shows it is listening** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Physician | During consultations, I want ambient recording, so that I can keep eye contact instead of typing. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Starting recording captures microphone input and shows elapsed time; pausing stops capture. |
| F-1-2 | Upload mode cannot proceed without a file. |

### F-2: Assign Patient & Encounter Context
#### 1. What it does
"Finish & Save Consultation" moves to step 2. The clinician confirms the patient, the attending doctor, the record the session belongs to, and a title.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Patient | Search / text | Search existing clients by name, ID or phone, or enter a new patient name; age and gender | Prefilled when launched from a client, appointment, invoice or process. Otherwise the patient must be chosen explicitly. |
| F-2.2: Doctor | Select | Attending doctor | Decision needed: restrict to the signed-in clinician? (G3-Q-10) |
| F-2.3: Link Entity | Select | Client / Patient, Appointment, Invoice, Insurance, Claim | When launched from a record, that record is linked. Decision needed: choosing a specific record when launched without context (G3-Q-17) |
| F-2.4: Title | Text | Defaults to "<patient>_Consultation_<date>" | |
| F-2.5: Back to Recording | Link | Returns to step 1 | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor starts Scribe from an appointment | Finishes recording | **Patient, appointment and process are prefilled; doctor clicks Confirm & Generate** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Physician | When saving a consultation, I want it attached to the right patient and appointment, so that billing and claims use it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | A session cannot be saved without a patient. |
| F-2-2 | A session started from an appointment stores that appointment as its link. |

### F-3: Transcript & Clinical Summary Review
#### 1. What it does
After "Confirm & Generate", a success screen shows patient, doctor, diagnosis and number of medicines. "View Full Transcript" opens the transcript drawer.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Recording | Player | Play/pause, scrub, speeds 1x/1.25x/1.5x/2x, date and duration | Plays the captured audio |
| F-3.2: Summary | Card | Narrative from age, gender, doctor, chief complaint, diagnosis and medicines | |
| F-3.3: Transcription | Timeline | Doctor and Patient turns with message count | From the actual recording |
| F-3.4: Session rating | Stars | 1–5 rating | Saved. Decision needed: purpose (G3-Q-20) |
| F-3.5: Console list | Table | Name, workflow/title, duration, responsible doctor, created at, status (In Progress / Upcoming / Completed); search by patient, diagnosis or transcript; filters by status | Empty state: "No Transcripts Found. Click the + button above to record your first consultation." |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor checks the transcript | Opens the session from the list | **Sees summary and Doctor/Patient transcript for that consultation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Physician | After the encounter, I want to check what was captured, so that I can trust the note. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Transcript, summary and extracted data come from the session's own audio. |
| F-3-2 | Unknown age or gender is shown as unknown, never inferred. |

### F-4: Clinical Note & Prescription Document
#### 1. What it does
Extracted data populates the clinical note template. A prescription document is filed in the patient's Documents.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Note template | Sections | Decision needed: SOAP (4 sections) or the 11-section layout (patient info, chief complaint, diagnosis+ICD, medications 1–3, instructions, precautions, prognosis, follow-up, doctor info); sections reorderable (see G3-Q-12) | |
| F-4.2: Edit note | Editor | Clinician edits note fields before sign-off; edits are saved | |
| F-4.3: Sign-off | Action | Decision needed: who signs, what locks, amendments (see G3-Q-13) | No "Attested" status before sign-off |
| F-4.4: Prescription document | Document | Prescription with patient, complaint, diagnoses, vitals, medications, investigations, advice, follow-up and the signing doctor's own credentials | Decision needed: file on save or only after sign-off; status label (G3-Q-18) |
| F-4.5: Download PDF | Action | Downloads the existing prescription document | Does not create duplicates |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor finalises a visit | Reviews the note, corrects a dosage, signs | **Note locks; prescription is filed in the patient's Documents** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Physician | When the encounter ends, I want a structured note and prescription generated, so that I finish charting in under a minute. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Credentials on the document come from the signing clinician's profile. |
| F-4-2 | A note is marked signed only after an explicit sign action by an authorised clinician. |

### F-5: Share & Manage Records
#### 1. What it does
Row actions on the console: View Transcript, Download PDF, Share via WhatsApp, Delete Record.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Share via WhatsApp | Modal | Preview "Hello <patient>, your prescription from <doctor> for <diagnosis> is ready to download: <link>" and send | The link points to that patient's document |
| F-5.2: Delete | Action | Decision needed: can clinical records be deleted, by whom, with confirmation and audit (see G3-Q-05) | |
| F-5.3: Retention | Rule | Decision needed: retention period for audio and transcripts (see G3-Q-16) | Sessions persist beyond the browser session |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient asks for prescription | Doctor clicks Share via WhatsApp and Send | **Patient receives a link to their own prescription** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Physician | After the visit, I want to send the prescription instantly, so that the patient can go to the pharmacy. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | The shared link opens the selected patient's prescription only. |

### F-6: Hand-offs to Invoice & Claim
#### 1. What it does
Session data is reused in billing.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-6.1: Fill invoice | Action | From an invoice, Scribe fills notes (transcript excerpt + chief complaint), diagnosis and chief complaint | Decision needed: should Scribe propose billable services or CPT lines (see G3-Q-14) |
| F-6.2: Claim diagnoses | Auto-fill | Creating a claim for an appointment uses the session linked to that appointment: ICD-10 as pointer A, secondary diagnosis as pointer B, rendering provider, patient gender | Codes come from the session's extracted codes only. Decision needed: clinician confirmation of AI codes (G3-Q-14) |
| F-6.3: Activity timeline | Entry | Adds "Scribe Recorded / Uploaded" with diagnosis, medicines and duration to the client timeline | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Biller creates a claim | Picks the appointment | **Diagnosis A = the session's ICD-10 code; provider = session doctor** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-6-J1 | Billing Staff | When billing a visit, I want the clinical codes from the note, so that I don't re-key them. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-6-1 | No diagnosis code is added that is not in the session's extracted data. |
| F-6-2 | Patient date of birth is never estimated from age. |

### Not yet built (from previous PRD)
- Real-time waveform from microphone input with speech-pause detection. Noise-cancellation status.
- 4-section SOAP container (pending G3-Q-12), rich-text editor with version history, Sign & Attach to Chart with lock (pending G3-Q-13).
- Note generation step (target about 8 s) and EHR sync.
- Speech-to-text engine naming: PRD said Whisper, the in-app help says Deepgram Nova-2 Medical (G3-Q-15).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Ambient Recording or Audio Upload | F-1.1 – F-1.5 | Capture a consultation live or from a file. |
| F-2 | Assign Patient & Encounter Context | F-2.1 – F-2.5 | Attach the session to patient, doctor and record. |
| F-3 | Transcript & Clinical Summary Review | F-3.1 – F-3.5 | Review recording, summary and diarized transcript; list sessions. |
| F-4 | Clinical Note & Prescription Document | F-4.1 – F-4.5 | Structured note, sign-off and prescription document. |
| F-5 | Share & Manage Records | F-5.1 – F-5.3 | WhatsApp sharing, deletion and retention. |
| F-6 | Hand-offs to Invoice & Claim | F-6.1 – F-6.3 | Reuse session data in invoices, claims and the client timeline. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Physician | During consultations, I want ambient recording, so that I can keep eye contact. | F-1 |
| 2 | Physician | When saving, I want the session attached to the right patient and appointment. | F-2 |
| 3 | Physician | When the encounter ends, I want a structured note and prescription generated. | F-3, F-4 |
| 4 | Physician | After the visit, I want to send the prescription instantly. | F-5 |
| 5 | Billing Staff | When billing a visit, I want the clinical codes from the note. | F-6 |

---

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
| :--- | :--- | :--- | :--- | :--- |
| G3-E-01 | The Call Review panel (outcome, happiness, disconnect reason, barge-in, tool failure, loop, talk-time, fields updated) has no tab button, so it can never be opened. Most values are seeded random numbers from the call ID, shown as if measured. | `app/components/telephony/CallDetailDrawer.tsx:192-280, 661-686, 873` | Medium | G3-D-11 |
| G3-E-02 | Every call shows the same 9-line AI script (only first name and stage swapped), even inbound or failed calls. The header always says "17 Messages". The summary always says "outbound follow-up … prospective customer". | `CallDetailDrawer.tsx:409-467, 792, 811` | High | G3-D-07, G3-D-09 |
| G3-E-03 | The recording player is simulated: no audio, the bar jumps 15%→50%, and Download has no handler. The player and transcript also appear for Failed and Pending calls with no recording. | `CallDetailDrawer.tsx:711-733` | High | G3-D-02 |
| G3-E-04 | The Retry History tab shows 5 invented attempts with fixed "Oct 10, 2026" times for every call. | `CallDetailDrawer.tsx:484-542` | Medium | G3-D-16 |
| G3-E-05 | [SECURITY] When the client phone isn't found in sessionStorage, the header shows a fixed real-looking number (7795163421) as the client's phone. | `CallDetailDrawer.tsx:399-407, 470` | Medium | G3-D-17 |
| G3-E-06 | The call rating in the drawer is never saved. "Save Feedback" on the detail page only shows a toast. | `CallDetailDrawer.tsx:752-768`; `app/pages/CallDetails.tsx:42-50` | Medium | G3-D-14 |
| G3-E-07 | `/call-logs/:id` shows the same hardcoded call (Sarah Johnson, BCBS policy BC123456789, "Positive Sentiment", "20% faster") for any ID. The relationship data is simulated. No screen links to it. | `app/pages/CallDetails.tsx:21-28, 160-190, 346-416` | High | G3-D-18 |
| G3-E-08 | The row "Call" action (click-to-dial) only shows "Call feature coming soon". | `app/pages/CallLogs.tsx:1974-1979` | High | G3-L-07 |
| G3-E-09 | The advanced filter "Search" applies nothing (the handler has an "Apply filters here" comment). Call type, Status and Duration inputs are not connected. Only client-name search works. | `app/pages/CallLogs.tsx:1666-1672, 1531-1572, 1050-1061` | High | G3-L-08 |
| G3-E-10 | [SECURITY] Row Delete and bulk "Delete Selected" show "deleted" toasts but remove nothing, with no confirmation. Users are told records are gone when they aren't. | `app/pages/CallLogs.tsx:1982-1987, 2000-2007` | Medium | G3-L-15 |
| G3-E-11 | Scheduled calls, cancelled schedules (and the unused single trigger/stop handlers) change page memory only. They are never saved to the store and disappear on refresh. Even refocusing the window reloads the store over them. | `app/pages/CallLogs.tsx:874, 1026-1037, 1124-1167, 516-534` | High | G3-L-11 |
| G3-E-12 | "Trigger Calls" (now or scheduled) only shows a success toast. No calls are created. | `app/pages/CallLogs.tsx:1012-1024` | Medium | G3-L-13 |
| G3-E-13 | "In Progress" entries (from processes and kiosk) get the red error badge, the same as Failed. SMS and WhatsApp entries get the inbound phone icon. | `app/pages/CallLogs.tsx:1926-1931, 1940-1946`; `lib/processLogsStore.ts:184-185` | Medium | G3-L-18 |
| G3-E-14 | Kiosk registration, booking and check-in pass no channel, so their entries are labelled "WhatsApp". | `lib/processLogsStore.ts:184`; `reception/lib/api/mockMaClient.ts:795-800, 1119-1124, 1489-1494` | Medium | G3-X-02 |
| G3-E-15 | In Schedule Call, client process names (e.g. "Client Intake") are not in the drawer's fixed process→stage map ("Patient Intake"…). The stage picker stays hidden and the stage silently falls back to the client's general stage. Times earlier today are accepted. | `ScheduleCallDrawer.tsx:336-368, 443`; `app/pages/CallLogs.tsx:805-811, 869` | Low | G3-L-22 |
| G3-E-16 | The client-filter banner can never appear because no screen sends a client to Call Logs. The help modal promises date-range filtering, but the date-range buttons are never rendered. | `app/pages/CallLogs.tsx:888-903, 965-982, 2218-2223` | Low | G3-L-21 |
| G3-E-17 | Scribe never accesses the microphone. Every session saves preset scenario #1 (cataract consult) with only the patient name swapped. Duration defaults to 78 s. The result is a clinical record that doesn't reflect the encounter, presented as real. | `app/components/scribe/AIScribePopup.tsx:240-252, 286-345` | Critical | G3-S-04 |
| G3-E-18 | [SECURITY] Without launch context, the first client in the list is silently preselected as the patient. "Confirm & Generate" has no validation. A new walk-in gets a temporary ID that is never created as a client. PHI can be attached to the wrong patient. | `AIScribePopup.tsx:164-168, 286-305, 858-866` | High | G3-S-11 |
| G3-E-19 | The success screen shows "Attested" and "SOAP notes generated" and offers "View … SOAP Notes", but there is no SOAP view and no sign-off. | `AIScribePopup.tsx:883-902, 934` | High | G3-S-16 |
| G3-E-20 | The 11-section note template and its prefilled, editable field values are built in the transcript drawer but never rendered. Edits would not be saved. Section order is stored per browser. | `app/components/scribe/TranscriptDetailDrawer.tsx:39-106, 144-173, 331-343` | High | G3-S-13 |
| G3-E-21 | [SECURITY] Prescription documents are auto-filed as "Verified" with hardcoded doctor credentials ("MS, FICO, Reg: MC-89421"; "MBBS, MD") and default patient "54 yrs / Male" when unknown. "Download PDF" files a duplicate document on each click and downloads nothing. | `lib/scribeSessionStore.ts:733, 738, 774`; `TranscriptDetailDrawer.tsx:288-289`; `app/pages/AIScribeConsole.tsx:305-311` | Critical | G3-S-20 |
| G3-E-22 | [SECURITY] The WhatsApp message to the patient contains a fixed link (`…/rx/doc89421`) that is the same for every patient. Send is simulated with a success toast. | `app/pages/AIScribeConsole.tsx:400-424` | High | G3-S-22 |
| G3-E-23 | [SECURITY] Scribe row and bulk delete permanently remove clinical sessions immediately, with no confirmation and no audit trail. | `app/pages/AIScribeConsole.tsx:321-340`; `lib/scribeSessionStore.ts:674-679` | High | G3-S-23 |
| G3-E-24 | Scribe sessions are kept in sessionStorage only, so all transcripts are lost when the tab closes. The prescription documents and activity entries they produced remain, pointing to sessions that no longer exist. | `lib/scribeSessionStore.ts:599, 634` | Medium | G3-S-24 |
| G3-E-25 | The "Completed" and "Upcoming" chips type the word into the search box instead of filtering by status. The Status filter has no handler. | `app/pages/AIScribeConsole.tsx:192-211` | Medium | G3-S-02 |
| G3-E-26 | [SECURITY] Unknown patient gender is guessed from a list of first names. Unknown age defaults to 34 or 45. These feed the summary and prescription. | `TranscriptDetailDrawer.tsx:132-142` | Medium | G3-S-25 |
| G3-E-27 | Transcript-drawer "playback" is a counting timer with no audio. The session rating is never saved. | `TranscriptDetailDrawer.tsx:306-321, 489` | Medium | G3-S-18 |
| G3-E-28 | Upload mode lets the user finish with no file, and the uploaded file is ignored. | `AIScribePopup.tsx:530, 653-660` | Medium | G3-S-09 |
| G3-E-29 | Scribe → Invoice reads "assessment" and "billingCodes" fields that Scribe never produces. Invoice line items and totals are never filled, and the coded fallbacks ($120 fee, 5% tax) are placeholders. | `app/components/invoices/InvoiceDetailDrawer.tsx:496-525`; `lib/scribeSessionStore.ts:26-46` | High | G3-X-05 |
| G3-E-30 | Scribe → Claim has several problems: (a) when no ICD-10 is stored, codes are guessed by keyword with silent defaults (M17.0 knee osteoarthritis; secondary I10 / E11.9 / F41.1 anxiety); (b) the badge falls back to H25.11; (c) patient DOB is invented as 10 May of (current year − age); (d) the matched session is any session for that client, not the appointment's. This produces inaccurate claim data. | `app/components/claims/CreateClaimDrawer.tsx:249-289, 717` | Critical | G3-X-07 |
| G3-E-31 | Scribe launched from an appointment stores the appointment only as a generic record ID, never as its appointment link. Claim matching then falls back to "any session for this client". | `AIScribePopup.tsx:320-338`; `AppointmentDetailDrawer.tsx:1270-1278` | Medium | G3-X-08 |
| G3-E-32 | The appointment drawer invents two sample calls (Completed, with recording and transcript) when the client has none. | `app/components/appointments/AppointmentDetailDrawer.tsx:667-697` | Medium | G3-X-10 |
| G3-E-33 | [SECURITY] No role or permission check on call recordings, transcripts or Scribe. Any signed-in user can view PHI, record, choose any doctor as the responsible clinician, and issue "Attested"/"Verified" documents. | `app/routes.tsx:215, 222, 230-231`; `app/components/auth/ProtectedRoute.tsx`; `AIScribePopup.tsx:126` | High | G3-L-20, G3-S-29 |
| G3-E-34 | `CallLogs.tsx` contains an unused 100-call seed with different stages from the store, plus duplicate metric helpers. This is a maintenance risk and causes data inconsistency between screens. | `app/pages/CallLogs.tsx:51-151, 163-475` | Low | G3-L-17 |

## Open questions for PM
1. **G3-Q-01.** What is the canonical call outcome set: PRD Completed/Missed/Voicemail; built Completed/Failed/Pending/In Progress; retry tab BUSY/NO ANSWER? (G3-L-02)
2. **G3-Q-02.** Is Call Logs a log of telephone calls only, or also SMS, WhatsApp and kiosk process events? Should each call be its own entry, instead of one entry per client and process overwritten on stage change? (G3-L-17, G3-X-01)
3. **G3-Q-03.** Should the list show Phone and Assigned Process columns (PRD), Previous/Last Stage (built), or both? (G3-L-01)
4. **G3-Q-04.** Click-to-dial: which telephony trunk or softphone places the call, and does it create the log entry immediately? (G3-L-07, E-08)
5. **G3-Q-05.** Can call logs and Scribe sessions be deleted? By whom, with what confirmation, retention and audit trail? (G3-L-15, G3-S-23)
6. **G3-Q-06.** Define formulas and data sources for client happiness, disconnect reason, barge-in count, tool/action failure, loop detected, sentiment start/mid/end, time the AI spoke, warmth, longest stretch, silence and next follow-up date. Should the Call Review tab be shown? (G3-D-11, G3-D-12)
7. **G3-Q-07.** How are human-handled calls represented: staff user as speaker or handler, transfers from AI to human? (G3-D-08)
8. **G3-Q-08.** Which is the canonical call-detail surface: the drawer or the `/call-logs/:id` page? Should the page be removed? (G3-D-18)
9. **G3-Q-09.** Should a call that books an appointment (via the AI receptionist) link to that appointment? Should staff be able to create a task from a call? (G3-D-19, A4 Call → Appointment)
10. **G3-Q-10.** Which roles may listen to recordings, read transcripts, run Scribe, select the responsible doctor and issue prescriptions? (G3-L-20, G3-S-29, E-33)
11. **G3-Q-11.** Is patient consent required before ambient recording? Captured per session or per patient, and where is it stored and shown? (D2 F-1.5)
12. **G3-Q-12.** Which note template: 4-part SOAP (PRD) or the 11-section prescription layout (code)? Should templates be configurable per specialty? (G3-S-12)
13. **G3-Q-13.** Sign-off: who can sign, what locks, how are amendments or addenda handled, is version history needed? (G3-S-15, E-19)
14. **G3-Q-14.** What should Scribe push to invoices and claims: suggested services or CPT codes and fees? ICD-10 only from extraction, with mandatory clinician confirmation? (G3-X-05, G3-X-07)
15. **G3-Q-15.** Which speech-to-text engine should the product name: Whisper (PRD) or Deepgram Nova-2 Medical (help copy)? (G3-S-26)
16. **G3-Q-16.** What is the retention period for scribe audio, transcripts and call recordings? The settings default of 90 days is unused. (G3-S-24)
17. **G3-Q-17.** When Scribe is started without context and "Invoice", "Insurance" or "Claim" is chosen as the linked entity, must the user pick the specific record? (G3-S-10)
18. **G3-Q-18.** Should the prescription document be filed on save or only after sign-off, and what status should it carry? (G3-S-19, E-21)
19. **G3-Q-19.** Retry policy: what counts as a retry, maximum attempts, spacing? (G3-D-15)
20. **G3-Q-20.** What do the 1–5 star ratings on calls and Scribe sessions measure, and where are they reported? (G3-D-13, D2 F-3.4)
