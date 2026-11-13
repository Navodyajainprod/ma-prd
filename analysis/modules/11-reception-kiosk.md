# G11 — AI Receptionist kiosk — Gap Analysis
_Sources:_ PRD `content\ai-receptionist\avatar\{kiosk-shell,ambient-presence,aria-stage-speech}.md`, `checkin\{scheduled,walk-in,phone-otp,identity-biometrics}.md`, `directions\{departments,rooms}.md`, `billing\{invoices,qr-pay}.md`, `my-visit\{tracker,next-step,biometric-consent}.md` | Prototype routes `/reception`, `/reception/landing`, `/reception/avatar`, `/reception/walk-in`, `/reception/appointment`, `/reception/directions/:categoryId/:roomId`, `/reception/billing/:subStep`, `/reception/my-visit` → `E:\mantra-assist\src\reception\**` (plus the shared stores it reads and `FaceCheckinCard.tsx` on the Clients side) | Analysed 2026-11-12

**Scope note.** The whole kiosk is one large screen component driven by an internal step state; URLs only select the starting step. The "back end" is a browser-side mock client that reads and writes the same browser storage the rest of the prototype uses (clients, appointments, invoices, rooms, services, team, processes). There is no real server, SMS, payment gateway or face engine in this module. Where the PRD describes a real capability (encrypted templates, SMS OTP, payment reconciliation) the prototype only simulates it, and findings below separate "simulated by design in a demo" from "unsafe if copied to production".

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| avatar / kiosk-shell | 7 | 0 | 2 | 0 | 1 | 4 | 78% |
| avatar / ambient-presence | 7 | 0 | 0 | 1 | 0 | 1 | 88% |
| avatar / aria-stage-speech | 7 | 0 | 1 | 0 | 0 | 0 | 88% |
| checkin / scheduled | 3 | 1 | 2 | 0 | 1 | 6 | 58% |
| checkin / walk-in | 6 | 2 | 1 | 0 | 0 | 4 | 78% |
| checkin / phone-otp | 5 | 0 | 2 | 0 | 1 | 5 | 71% |
| checkin / identity-biometrics | 7 | 0 | 1 | 1 | 0 | 2 | 78% |
| directions / departments | 2 | 1 | 3 | 1 | 0 | 2 | 36% |
| directions / rooms | 2 | 1 | 1 | 0 | 2 | 1 | 63% |
| billing / invoices | 9 | 0 | 1 | 1 | 0 | 3 | 82% |
| billing / qr-pay | 7 | 0 | 1 | 0 | 2 | 3 | 88% |
| my-visit / tracker | 1 | 1 | 0 | 1 | 5 | 2 | 50% |
| my-visit / next-step | 2 | 1 | 0 | 0 | 1 | 5 | 83% |
| my-visit / biometric-consent | 6 | 1 | 2 | 1 | 0 | 2 | 65% |
| **Total** | **71** | **8** | **17** | **6** | **13** | **40** | **74%** |

Overall coverage: 73.5% (75 ÷ 102) · PRD-backed coverage: 73.5% (every sub-module has a PRD file, so the two figures are equal). Coverage counts only rows classed Matches, Partial, Missing in PRD or Contradicts; the 40 defect rows are excluded, so the figure flatters the prototype. The headline is that the screens exist and match the PRD wording, but the identity, lookup and payment logic underneath is simulated or unsafe (see E).

## Route map
| Route(s) | Page file | PRD file |
| :--- | :--- | :--- |
| `/reception`, `/reception/landing`, `/reception/avatar` | `src\reception\avatar\AvatarReceptionView.tsx` (ambient home) | `avatar/ambient-presence.md`, shell in `avatar/kiosk-shell.md`, speech in `avatar/aria-stage-speech.md` |
| `/reception/idle` | not registered in `src\app\routes.tsx` (router shows Not Found) | `avatar/ambient-presence.md` (expects it) |
| `/reception/appointment` | same view, starting at face scan | `checkin/identity-biometrics.md`, `checkin/scheduled.md` |
| `/reception/walk-in` | same view, starting at phone keypad | `checkin/phone-otp.md`, `checkin/walk-in.md` |
| `/reception/billing`, `/reception/billing/:subStep` | same view, starting at phone keypad in Billing mode (the `subStep` value is ignored) | `billing/invoices.md`, `billing/qr-pay.md` |
| `/reception/directions`, `/:categoryId`, `/:categoryId/:roomId` | same view (categories, rooms, room result) | `directions/departments.md`, `directions/rooms.md` |
| `/reception/my-visit` | same view, My Visit tracker | `my-visit/tracker.md` |
| (no URL; reached by voice "what's next" or step state while on `/reception/appointment`) | same view, Next Step and Next Step Details | `my-visit/next-step.md` |
| `/reception/feedback` | not registered in router (Feedback tile and dock navigate here and land on Not Found) | `avatar/kiosk-shell.md` § F-5.2 |
| (inside walk-in review and Clients profile card) | `AvatarReceptionView.tsx` consent step; `src\app\components\clients\FaceCheckinCard.tsx` | `my-visit/biometric-consent.md` |
| Orphan code (never mounted) | `ScheduledCheckinPanel.tsx`, `WalkInBookingPanel.tsx`, `InvoiceQrPaymentModal.tsx` | none |

## A. Product map — as built

### A.1 avatar / kiosk-shell
- **Purpose:** One frame for every task screen: Aria companion on the left, task card on the right, dock, language and mute, inactivity reset, Call Staff.
- **User roles:** Anonymous visitor. No role gating in code; settings (clinic name, colour, feature flags) come from Reception Settings.
- **Screens:** Split stage with header badge and step dots; floating dock; countdown beside Start over; Call Staff overlay; Coming Soon (feedback); toasts.
- **Flow:** 1) Visitor leaves home by tile, dock, voice or URL. 2) Split layout shows title and Step X of Y (V:3709-3732). 3) Every touch, key or mouse move, throttled to once a second, restores 60 seconds (V:1848-1880). 4) At 0 seconds, or Start over, the kiosk stops timers, camera and speech and clears the entered phone, OTP, session token, matched patient, visit summary, token, face state, form and directions choice, then returns to home (V:1788-1846). 5) Call Staff opens an overlay that keeps the screen below (V:6699). **Not handled:** the alert is never sent anywhere; scroll and speech do not restart the timer; payment, QR data, invoices, next-step data and captured face samples are not cleared by the reset.
- **Rules:** 60 s timeout (V:125); toast 3 s (V:800-806); feature flags can hide billing (V:3893).
- **Metrics:** Countdown only (computed from last activity).
- **Cross-module:** Reads Reception Settings (clinic name, colour, greeting, terminals, flags) from `receptionSettingsStore`.

### A.2 avatar / ambient-presence
- **Purpose:** Standing lobby home that wakes on a close approach or a Start tap and offers four quick actions.
- **Roles:** Anonymous; no role gating.
- **Flow:** 1) Home shows Aria and four tiles. 2) If the browser has a face detector and camera permission, it samples about 5 times per second; "close" (30% of frame height) twice in a row starts the welcome (V:134-136, 1553-1590). 3) Welcome: pause, spoken greeting in active language (or the clinic's custom phrase), short buffer, then listening, then routing by intent (V:1455-1520). 4) Tapping any tile stops the greeting and opens the flow. **Not handled:** with no detector the wake is silently manual; the camera-purpose notice is an icon with tooltip only.
- **Rules:** Distance proxy only; no matching; `?debug=1` shows a status strip.

### A.3 avatar / aria-stage-speech
- **Purpose:** Avatar visuals, speech capture and intent routing.
- **Flow:** 1) One video of Aria, still portrait if the media fails, paused for reduced motion (A:73-89, 254-265). 2) Status halo with six states. 3) Microphone capture with pre-roll, noise rules and echo guard (W:8-10, 46-48, 200; V:1383). 4) Audio goes to a server speech service; if unavailable or slow, browser speech recognition takes over (W:237; V:1366-1368, 1433). 5) Spoken text is matched room/doctor first, then department, status, workflows; first unclear phrase gets one polite prompt (V:2842-3340, 3332-3336). 6) Screen-specific voice commands (V:3379-3700). **Not handled:** microphone permission denial shows no dedicated message (falls back silently).
- **Cross-module:** Knowledge-base answers via mock `queryKnowledgeBase` (M:1727); not wired to the real Knowledge Base.

### A.4 checkin / scheduled
- **Purpose:** Turn a verified patient with an appointment into an issued queue token.
- **Flow:** 1) After face or phone verification, the kiosk looks for the patient's appointments (M:842-905) and builds a visit summary (M:2003-2083). 2) 3-card Verification Stack: identity (masked phone), appointment, room and wait (V:5028-5100). 3) Confirm creates a journey and a queue ticket at the room's station, marks the kiosk's own copy of the appointment checked in, emits check-in events, tries to check the appointment in at the clinic's Appointments store, and writes an audit entry (M:1223-1390). The clinic-store call is skipped or fails silently for staff-booked and kiosk-booked appointments (see E-42). 4) Token Issued view with token, room, directions, wait and an SMS button (T:40-148). **Not handled:** double-tap protection (no idempotency key sent), SMS delivery (log only), late/early arrival windows, errors other than a generic message.
- **Rules:** Token = appointment token or "D-" plus count; wait on ticket = max(5, (waiting + 1) x 10); summary wait uses x8.
- **Cross-module:** Appointments (reads `appointments_v1`, calls appointment store check-in), Clients (reads clients), Reception Settings and Rooms (stations), Automation event bus.

### A.5 checkin / walk-in
- **Purpose:** Register a new patient (or a known patient with no booking), book a service and doctor and issue a token.
- **Flow:** 1) After phone OTP with no profile, New Patient Details (name required, age, gender, reason, email; dictation on name and reason). 2) Age under 18 skips face and shows 4 steps. 3) Adults see Biometric Privacy & Consent with Register my face or Skip for now. 4) Register runs a 3-sample capture, then a duplicate check at 0.85. 5) Review and Approve creates the client, default process, deal and audit entries (M:706-840). 6) Service and doctor pick; "Next Available" means no doctor chosen. 7) Booking creates the appointment, checks in, issues the token (V:2669-2737). **Not handled:** error states for failed service or provider load; Decline leaves nothing saved.

### A.6 checkin / phone-otp
- **Flow:** 1) Keypad (max 15 digits, minimum 7 to send). 2) "Send code" returns success for any number. 3) Four OTP boxes auto-verify on the fourth digit; the code 1234 or 0000 is accepted for any number. 4) Lookup by phone (substring and suffix matching). 5) Branch by flow: check-in, walk-in, billing, next-step. **Not handled:** expiry, resend, lockout, session scoping, real SMS.

### A.7 checkin / identity-biometrics
- **Flow:** 1) `/reception/appointment` opens a camera preview with Start scanning and Use phone number instead. 2) 3-2-1 countdown; 8-second scan timeout. 3) Match is attempted at about 4.5 seconds against a constant test vector (V:1715-1718). 4) Match shows "Hi <FirstName>, is this you?" with match percentage; Yes routes by flow, Not me clears the candidate and returns to scan start. 5) Three failures show the phone fallback message (V:4751). **Not handled:** real matching; multiple-match warning.

### A.8 directions / departments
- **Flow:** Home tile, dock or voice opens categories built from the clinic's Rooms setting (Consultation & Clinics, Dental, Diagnostics & Imaging, Other) with fixed zones as fallback (M:560-640; Ty:44-130). Choosing a category lists rooms; empty categories are hidden. Unknown ids in the URL fall back to the list (V:762-790). **Not handled:** live refresh when an admin edits rooms; load error message.
- **Data source:** Client-side Rooms store (admin-configured, per browser), merged into kiosk stations.

### A.9 directions / rooms
- **Flow:** Choose a room or speak a place; a "Direct Match" pill shows for voice; card shows room name, floor/wing and walking text; Aria reads it aloud (same text in Hindi). Back returns to the list (browse) or home (voice). **Not built:** clinician row, walk time, Start Check-in button.

### A.10 billing / invoices
- **Flow:** 1) Billing opens the phone keypad in Billing mode. 2) After OTP, no client match shows "No billing records found for this phone number." 3) One match loads invoices; several show the household picker. 4) Ledger: Patient Account banner (name, ID, phone, N Outstanding), invoice cards with itemised text, issued and due dates, balance due and Pay via QR or View Receipt. 5) Footer: Sync with MA, Done, Different Patient. **Not handled:** an invoice load error looks like "All Bills Clear!".
- **Metric:** Balance due = invoice total minus amount paid, never below zero (M:1773-1790). Outstanding count = invoices whose status is not paid.
- **Cross-module:** Invoices (reads all invoices through the invoice service).

### A.11 billing / qr-pay
- **Flow:** 1) Pay via QR opens a card with a QR for a UPI link (payee, amount, currency, invoice number), wallet badges and Copy Payment Link. 2) The visitor taps "I Have Paid - Settle Invoice Now". 3) The kiosk records a payment of the balance with method QR Code and memo "Paid via AI Receptionist QR Kiosk", flips the card to Paid, shows confetti, speaks a thank-you and reloads the ledger (V:2133-2171). 4) Back to All Bills or Return Home. **Not handled:** any proof of payment; failure retry beyond an error toast.
- **Cross-module:** Invoices (`recordPayment` updates invoice and payment records).

### A.12 my-visit / tracker
- **Flow:** Dock My Visit looks at the clinic's queues, takes the first ticket of the first station that has any, and shows token, station, status, wait and directions (V:2739-2761, 6245-6285). If none: "No Active Token Today" with Go to Check-in. **Not handled:** identity check; priority order; live updates; Currently Serving; Patients Ahead.

### A.13 my-visit / next-step
- **Flow:** After face or phone verification in the Next-Step flow, the kiosk finds the patient's AI-Receptionist-connected process, picks the next enabled stage and shows a card (title, description, accent, patient name and ID); View Details shows the stage's guidance HTML with placeholders replaced (V:3739-3772, 6125-6260). **Not handled:** unknown placeholders; real appointment and invoice values.

### A.14 my-visit / biometric-consent
- **Flow:** Passive greeting never matches; scan runs only when the visitor taps Start scanning; walk-in adults opt in with explicit text; minors are excluded; first-name gate; audit events written; staff can delete or withdraw on the Clients profile card. **Not handled:** encryption, real audit trail, patient-side withdrawal.

## B. Product map — per PRD
Each PRD file is a "Cross-product Summary, 1. Module Summary, 2. Feature Requests (What it does / includes / worked example / jobs / acceptance), 3. Comprehensive Summary" document.

- **B.1 kiosk-shell** (`avatar/kiosk-shell.md`): § F-1 split stage and captions; § F-2 titles and Step X of Y with minor 4-step rule; § F-3 six-button dock, EN/हिन्दी toggle, Mute; § F-4 60-second reset with Start over, wipes screen and stops camera; § F-5 Call Staff overlay, feedback route, 3-second toasts. Roles: visitor; reads Reception Settings. KPIs: none.
- **B.2 ambient-presence** (`avatar/ambient-presence.md`): § F-1 canonical home and wipe; § F-2 proximity (14%, 30%, two checks, 5 per second), "Camera active for greeting only" pill, no recognition, camera-free fallback; § F-3 5-phase welcome (0.3 s lead-in, 0.2 s buffer); § F-4 four tiles and Start; § F-5 `?debug=1`.
- **B.3 aria-stage-speech** (`avatar/aria-stage-speech.md`): § F-1 single video, 0.7 s closed-mouth settle, reduced motion; § F-2 six-state halo; § F-3 pre-roll 0.6 s, burst filter 0.4 s, 0.8 s silence, 8 s max, echo guard 0.45 s, 8 s transcription timeout and browser fallback; § F-4 priority intents and anti-loop; § F-5 hands-free commands.
- **B.4 scheduled** (`checkin/scheduled.md`): § F-1 same-day lookup, doctor-room pairing, wait = max(5, (waiting + 1) x 10), walk-in fallback; § F-2 3-card stack with masked phone; § F-3 duplicate-safe confirm (24 h window), Arrived with token, token screen, SMS and WhatsApp pass.
- **B.5 walk-in** (`checkin/walk-in.md`): § F-1 details, dictation, minor rule; § F-2 optional 3-angle face enrolment, 0.85 duplicate guard; § F-3 review gate, atomic create (client, template, audit, default onboarding process); § F-4 service, clinician or Next Available (shortest queue), Arrived walk-in and token.
- **B.6 phone-otp** (`checkin/phone-otp.md`): § F-1 keypad, normalisation, minimum 7 digits; § F-2 4-digit OTP, 5-minute validity, 30-second resend; § F-3 household picker; § F-4 routing (check-in three-way, billing guardrail, my-visit).
- **B.7 identity-biometrics** (`checkin/identity-biometrics.md`): § F-1 entry and camera mirror; § F-2 coaching; § F-3 countdown, 3 attempts then phone; § F-4 zero-PHI confirmation, Yes routes, Not me goes to phone keypad.
- **B.8 departments** (`directions/departments.md`): § F-1 three core zones plus configured categories with counts; § F-2 room list; § F-3 Home and Appointment shortcuts.
- **B.9 rooms** (`directions/rooms.md`): § F-1 direct voice match with English/Hindi synonyms; § F-2 card with number, floor/wing, clinician, walking text, "~1-2 min walk", spoken; § F-3 back logic, Start Check-in, Done.
- **B.10 invoices** (`billing/invoices.md`): § F-1 phone and OTP gate, zero-match, household; § F-2 live sync, Patient Account banner; § F-3 balance arithmetic, Pay via QR or View Receipt; § F-4 All Bills Clear, Sync, Done, Different Patient.
- **B.11 qr-pay** (`billing/qr-pay.md`): § F-1 QR card and Settled overlay; § F-2 wallet badges and copy link; § F-3 settle, QR Code memo, confetti, Back to All Bills.
- **B.12 tracker** (`my-visit/tracker.md`): § F-1 verify then show In-Service, Waiting, Completed priority; § F-2 token, Currently Serving, Patients Ahead, Estimated Wait (at least 5), live subscription; § F-3 Send to Pharmacy (P-014), Complete Visit, No Show recalculation; § F-4 empty state.
- **B.13 next-step** (`my-visit/next-step.md`): § F-1 "What's next" and AI-connected process; § F-2 stage cards, visibility filter, View Details; § F-3 personalised placeholders (patient, appointment, billing, stage, clinic), blank if missing.
- **B.14 biometric-consent** (`my-visit/biometric-consent.md`): § F-1 passive vs saved biometrics; § F-2 zero-PHI and under-18 exclusion; § F-3 opt-in, skip, consent guard, audit; § F-4 staff delete and enrol on Client profile.

## C. Findings

Citation key: **V** = `E:\mantra-assist\src\reception\avatar\AvatarReceptionView.tsx`; **M** = `src\reception\lib\api\mockMaClient.ts`; **T** = `src\reception\avatar\components\TokenAndCurrentServingCard.tsx`; **R** = `src\app\routes.tsx`; **W** = `src\reception\lib\whisperRecorder.ts`; **A** = `src\reception\avatar\components\AnimatedAvatar.tsx`; **Ty** = `src\reception\types\reception.ts`. PRD refs are `<folder>/<file> § <feature>`. All prototype data is front-end mock (browser localStorage). A "Defect" status row says only "see E-xx".

### C.1 avatar / kiosk-shell
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-01 | Flow | Split stage: Aria panel with live captions on the left, task panel on the right | Matches | kiosk-shell § F-1 | V:4267-4303, V:3830-3850 | Caption states and waveform exist. |
| G11-I-02 | Flow | Plain-language screen titles and "Step X of Y"; minors collapse 5 steps to 4 | Matches | kiosk-shell § F-2 | V:3709-3732, V:4374 | Scheduled 3 steps, billing 2, walk-in 4 or 5. |
| G11-I-03 | Flow | Right dock: Home, Appointment, Billing, Feedback, Directions, My Visit | Matches | kiosk-shell § F-3 | V:6545-6640, V:1922-1962 | Billing is hidden when the clinic turns the payments feature off (see I-09). |
| G11-I-04 | Flow | EN/Hindi toggle keeps typed digits; Mute stops speech but captions stay | Matches | kiosk-shell § F-3 | V:1949-1956, V:6657-6661 | Language is a separate setting from the entered phone digits, so nothing is cleared. |
| G11-I-05 | Rule | 60-second inactivity watchdog with visible countdown, reset on touch/key, wipes screen state, stops camera and speech, returns Home | Matches | kiosk-shell § F-4 | V:125, V:1788-1846, V:1848-1880, V:6674 | Activity is throttled to once a second. |
| G11-I-06 | Rule | Inactivity timer also restarts on scroll and on spoken input | PRD-only | kiosk-shell § F-4.2 | V:1871-1880 | Only mousedown, mousemove, keydown and touchstart are listened for. |
| G11-I-07 | Rule | Reset wipes patient, appointment and billing data | Defect | kiosk-shell § F-4.4; ambient-presence § F-1.2 | V:1788-1846 vs V:510-517, 570, 577-579 | See E-10. |
| G11-I-08 | Flow | Call Staff overlay "Staff Assistance Summoned", form state preserved | Matches | kiosk-shell § F-5.1 | V:1957-1960, V:6699 | Overlay and preserved state work; the alert itself does not (I-10). |
| G11-I-09 | Rule | Clinic can switch kiosk features (voice, payments), set clinic name, brand colour, greeting phrase and terminal label from Reception Settings or URL (`org`, `terminal`, `terminalName`, `location`) | Missing in PRD | none | V:462-489, V:1492-1518, V:3818, V:3893, V:4010 | Hand-off from `/settings/reception` via the reception settings store; not in the shell PRD. |
| G11-I-10 | Flow | Call Staff really notifies the front desk | Defect | kiosk-shell § F-5.1 | V:1957-1960 | See E-31. |
| G11-I-11 | Flow | Feedback preview at `/reception/feedback` | Defect | kiosk-shell § F-5.2 | R:109-152, R:346, V:1906-1920 | See E-30. |
| G11-I-12 | Rule | 3-second auto-dismiss toast banners | Matches | kiosk-shell § F-5.3 | V:800-806 | Billing also uses a second toast library. |
| G11-I-13 | Rule | Directions views are written to an audit log | Missing in PRD | none | V:2780-2790, V:2806-2812, M:2114-2118 | Local kiosk log only (see E-13). |
| G11-I-14 | Rule | Debug and test hooks are exposed on the browser window | Defect | none | V:1614-1625, V:2545-2640 | See E-15. |

### C.2 avatar / ambient-presence
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-15 | Flow | `/reception` and `/reception/landing` normalise to canonical home | Matches | ambient-presence § F-1.1 | V:731-745 | |
| G11-I-16 | Flow | `/reception/idle` also normalises to home | Defect | ambient-presence § F-1.1 | V:731-742, R:109-152 | See E-30: route not registered, router shows Not Found. |
| G11-I-17 | Rule | Distance and dwell filter: noticed 14%, close 30% face height, 2 consecutive checks, 5 checks per second | Matches | ambient-presence § F-2.1 | V:134-136, V:1553-1590 | Check cadence is 200 ms. |
| G11-I-18 | Rule | Passive mode never runs face matching or stores images | Matches | ambient-presence § F-2.2 | V:1540-1590 | Only face size is read from the browser face detector. |
| G11-I-19 | Rule | Persistent green "Camera active for greeting only" badge | Contradicts | ambient-presence § F-2.3 | V:3830-3850 | Built as a small camera icon with hover/long-press tooltip, not a persistent text pill. Weaker disclosure (Q-05). |
| G11-I-20 | Rule | Touch-first fallback when camera is denied or unsupported | Matches | ambient-presence § F-2.4 | V:433, V:1544-1556 | If the browser has no face detector, presence is silently off; PRD does not say so. |
| G11-I-21 | Flow | 5-phase welcome (dormant, engaged, greeting, listening, routing) with post-speech buffer | Matches | ambient-presence § F-3 | V:119, V:1455-1520 | Org greeting phrase can override default text (I-09). |
| G11-I-22 | Flow | Four flanking quick actions plus Start button; tap interrupts greeting | Matches | ambient-presence § F-4 | V:3893-4030 | Billing tile depends on the payments flag. |
| G11-I-23 | Flow | `?debug=1` installer HUD | Matches | ambient-presence § F-5 | V:454-459, V:3803 | |

### C.3 avatar / aria-stage-speech
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-24 | Flow | Single continuous video stage, static portrait fallback, reduced-motion pause, rest-frame settle | Matches | aria-stage-speech § F-1 | A:73-89, A:103-120, A:254-265 | Single-element rule is unit-tested. |
| G11-I-25 | Flow | Six-state halo and status pill (idle, speaking, listening, thinking, success, apologetic) | Matches | aria-stage-speech § F-2 | A:37, V:3925-3937 | |
| G11-I-26 | Rule | Speech capture: 0.6 s pre-roll, ignore bursts under 0.4 s, end after 0.8 s silence or 8 s | Matches | aria-stage-speech § F-3.1-F-3.2 | W:8-10, W:46-48, W:200 | |
| G11-I-27 | Rule | Echo guard of about 0.45 s after Aria speaks | Matches | aria-stage-speech § F-3.3 | V:1383, V:1000-1011 | |
| G11-I-28 | Rule | Cloud transcription with 8 s timeout, automatic browser-speech fallback | Matches | aria-stage-speech § F-3.4 | W:237, V:1366-1368, V:1433 | Offline and unconfigured states degrade to browser speech. |
| G11-I-29 | Rule | Priority intent routing and one-time clarification | Matches | aria-stage-speech § F-4 | V:2842-3340, V:1266, V:3332-3336, `voiceIntentAndRouting.test.ts` | Tests cover pharmacy, lab, restroom, doctor and gibberish. |
| G11-I-30 | Flow | Hands-free commands inside screens (scan, yes/no, digits, approve/edit/skip, back/home) | Matches | aria-stage-speech § F-5 | V:3379-3700 | |
| G11-I-31 | Rule | [SECURITY] Visitor audio is recorded and sent to a server speech service (`/api/stt/transcribe`) | Missing in PRD | none | W:233-245, V:1372-1380 | Patient voice leaves the kiosk; PRD gives no privacy notice, retention or consent wording (Q-12). |

### C.4 checkin / scheduled
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-32 | Flow | Same-day lookup for the verified patient across desk, phone, web and kiosk bookings | Defect | scheduled § F-1.1 | M:842-905 | See E-20. |
| G11-I-33 | Rule | Doctor mapped to room using the clinic's rooms | Matches | scheduled § F-1.2 | M:496-545, M:1245-1262 | Stations are rebuilt from the Rooms setting each time. |
| G11-I-34 | Metric | Estimated wait = max(5, (waiting + 1) x 10) minutes | Defect | scheduled § F-1.3 | M:1331 vs M:2048 | See E-22. |
| G11-I-35 | Flow | No appointment today sends the patient to walk-in service selection | Matches | scheduled § F-1.4 | V:2305-2313 | |
| G11-I-36 | Flow | 3-card Visit Summary (identity with masked phone, appointment, room and wait) and confirm button | Matches | scheduled § F-2 | V:5028-5100, M:2050-2056 | Masking works on this path, not on the walk-in summary (E-34). |
| G11-I-37 | Rule | Visit summary shows real data for the patient | Defect | scheduled § F-2 | M:2003-2083 | See E-21. |
| G11-I-38 | Flow | Duplicate-safe confirm: double tap issues one token | Defect | scheduled § F-3.1 | V:2373-2380, V:5092, M:474 | See E-23. |
| G11-I-39 | Flow | Confirm marks the appointment Arrived and emits arrival events and audit | Prototype defect | scheduled § F-3.2 | M:1365-1387 | see E-42 / XM-02 |
| G11-I-40 | Rule | Token number issued with station prefix | Missing in PRD | scheduled § F-3.3 | M:1138, M:1287, M:1455 | Built number = "D-" + (count of all reception appointments + 1). See E-24. |
| G11-I-41 | Flow | Token Issued view with token, room, directions, wait, SMS pass | Partial | scheduled § F-3.3-F-3.4 | V:3603-3612, V:6109-6125, T:40-148 | Built also has a map trigger. |
| G11-I-42 | Flow | WhatsApp digital pass | PRD-only | scheduled § F-3.4 | T:148, V:3606 | Only SMS exists. |
| G11-I-43 | Rule | SMS pass actually delivered | Defect | scheduled § F-3.4 | M:1703-1706, V:3606 | See E-25. |
| G11-I-44 | Rule | Early and late arrival windows, queue ageing cap | Missing in PRD | none | Ty:148-170, M:347-352 | Settings hold the values; check-in never enforces them (Q-09). |

### C.5 checkin / walk-in
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-45 | Flow | New Patient Details: name required, age, gender, reason, email; blocks on empty name | Matches | walk-in § F-1.1 | V:2399-2412 | |
| G11-I-46 | Flow | Mic dictation for name and reason | Matches | walk-in § F-1.2 | V:1040-1112 | |
| G11-I-47 | Rule | Under-18 skips face step and steps drop to 4 | Matches | walk-in § F-1.3 | V:2413-2424, V:3719-3731, V:5924 | Age is typed by the visitor (Q-07). |
| G11-I-48 | Flow | Consent screen with Register my face and Skip for now | Matches | walk-in § F-2.1 | V:5655-5680, V:2495-2507 | |
| G11-I-49 | Flow | 3-angle capture (front, left, right) | Defect | walk-in § F-2.2 | V:2441-2461 | See E-02. |
| G11-I-50 | Rule | Duplicate face guard at 0.85 with "Yes, that's me" merge | Defect | walk-in § F-2.3 | V:2478-2490, V:2520-2527 | See E-02, E-08. |
| G11-I-51 | Flow | Review and Approve screen with Edit and Decline | Matches | walk-in § F-3.1, F-3.3 | V:2513-2519, V:2640-2667, V:5900-5990 | Decline resets with nothing saved. |
| G11-I-52 | Rule | Approve creates client, face template, audit and default onboarding process together | Partial | walk-in § F-3.2 | M:706-840 | Built writes in sequence, not as one transaction. |
| G11-I-53 | Rule | Walk-in also creates a Deal and process call log for the client | Missing in PRD | none | M:794-801 | Deal amount fixed at 150 (E-29). |
| G11-I-54 | Flow | Walk-in service picker with prices and durations from Services | Matches | walk-in § F-4.1 | M:911-936, V:806-808 | Falls back to 3 built-in services if none configured; load failure is silent (E-41). |
| G11-I-55 | Rule | "Next Available" picks the shortest queue | Defect | walk-in § F-4.2 | M:1093-1096 | See E-26. |
| G11-I-56 | Flow | Booking creates an Arrived walk-in appointment and a numbered token | Partial | walk-in § F-4.3 | V:2669-2737, M:1077-1220 | Created Confirmed in the kiosk's own store, then check-in marks only that copy; the clinic's Appointments record is not updated (see E-27, E-42). |
| G11-I-57 | Rule | Existing patient on the walk-in route is pre-filled then re-registered | Defect | walk-in § F-1 | V:2310-2322, V:2643 | See E-28. |

### C.6 checkin / phone-otp
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-58 | Flow | Touch keypad with backspace/clear, spoken digits, minimum 7 digits | Matches | phone-otp § F-1.1, F-1.3 | V:2057-2069, V:2089-2096 | Maximum 15 digits. |
| G11-I-59 | Rule | Normalise country code and match on trailing 10 digits | Defect | phone-otp § F-1.2 | M:662-696 | See E-04. |
| G11-I-60 | Flow | 4-digit auto-verify boxes | Matches | phone-otp § F-2.1 | V:2071-2086 | |
| G11-I-61 | Rule | OTP is checked against the number and expires in 5 minutes | Defect | phone-otp § F-2.2 | M:642-660 | See E-03. |
| G11-I-62 | Flow | Resend Code with 30-second cooldown | PRD-only | phone-otp § F-2.3 | none | No resend control exists. |
| G11-I-63 | Rule | Attempt limit or lockout after wrong codes | Missing in PRD | none | V:2330-2335 | Neither built nor specified (Q-03). |
| G11-I-64 | Flow | Household picker when several profiles share a number, skipped for one | Matches | phone-otp § F-3 | V:2262-2335, V:2341-2371, V:3500 | |
| G11-I-65 | Flow | Check-in branch: appointment today, known patient without one, or unknown number to New Patient Details | Matches | phone-otp § F-4.1 | V:2262-2330 | |
| G11-I-66 | Flow | Billing guard: zero matches shows "No billing records found for this phone number." and stays on the phone screen | Matches | phone-otp § F-4.2 | V:2191-2197 | Works when no client exists; invoice lookup still leaks (E-05). |
| G11-I-67 | Flow | Next-step by phone lands on the right household member | Defect | phone-otp § F-4.3 | V:2226-2240 | See E-07. |
| G11-I-68 | Flow | My Visit unlocks after verification | Defect | phone-otp § F-4.3 | V:2739-2761 | See E-06. |
| G11-I-69 | Rule | Verification session token authorises later lookups | Missing in PRD | none | V:2188, M:662, M:842, M:706 | Token is stored but ignored by every call (Q-04). |
| G11-I-70 | Rule | Demo code is announced aloud and in the error text | Defect | phone-otp § F-2 (demo "1 2 3 4") | V:2101, V:2332 | See E-03. |

### C.7 checkin / identity-biometrics
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-71 | Flow | Unified entry: camera preview, Start scanning, Use phone number instead | Matches | identity-biometrics § F-1 | V:4576-4880, V:1884-1904 | |
| G11-I-72 | Rule | Camera stops when leaving or resetting; stays usable if permission denied | Matches | identity-biometrics § F-1.2-1.3 | V:1137-1152, V:1788-1795, V:120 | |
| G11-I-73 | Flow | Too close/too far/off-centre coaching and green oval when aligned | Matches | identity-biometrics § F-2 | V:557, V:1690-1701, V:4592-4700 | Timed coaching lines are canned when no face detector exists. |
| G11-I-74 | Flow | 3-2-1 countdown, Cancel scanning | Matches | identity-biometrics § F-3.1 | V:1643-1690 | |
| G11-I-75 | Rule | Face is actually matched against consented templates | Defect | identity-biometrics § F-3 | V:1715-1718, M:1865-1930 | See E-01. |
| G11-I-76 | Flow | After 3 failures show "Multiple attempts reached" and send to phone check-in | Matches | identity-biometrics § F-3.2 | V:4751-4760, V:4792 | |
| G11-I-77 | Rule | Privacy gate shows first name only before "Yes, that's me" | Matches | identity-biometrics § F-4.1 | V:4700-4720, V:1722-1725 | Match percentage is shown too (biometric-consent § F-2.1 allows this). |
| G11-I-78 | Rule | [SECURITY] Aria speaks full name, bill count and visit details aloud after confirmation | Missing in PRD | none | V:1993-2013, V:2205-2209 | Spoken PHI in a public lobby; PRD controls only on-screen PHI (Q-06). |
| G11-I-79 | Flow | "Yes, that's me" routes to Visit Summary or walk-in service selection | Matches | identity-biometrics § F-4 | V:1964-2043 | Billing and next-step flows branch from the same button. |
| G11-I-80 | Flow | "Not me" discards the candidate and goes to the phone keypad | Contradicts | identity-biometrics § F-4.2 | V:2044-2049 | Built clears the candidate and returns to the scan start; phone entry stays available (Q-08). |
| G11-I-81 | Rule | Several face matches are flagged | Defect | none | M:1865-1930, V:1715 | See E-38. |

### C.8 directions / departments
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-82 | Flow | Zone grid: Clinical & Doctors, Pharmacy & Labs, Facilities & Restrooms plus configured categories with room counts | Contradicts | departments § F-1 | M:560-640, Ty:44-130, V:709-722 | Built groups rooms configured in Settings into Consultation & Clinics, Dental, Diagnostics & Imaging, Other. The three fixed zones appear only as a static fallback when no rooms exist. |
| G11-I-83 | Rule | Category chosen from room service-name keywords (dental, x-ray/imaging, consult, else Other) | Missing in PRD | none | M:568-600 | Rooms with unrelated service names land in "Other". |
| G11-I-84 | Rule | Categories with no rooms are hidden | Missing in PRD | none | M:618-622 | |
| G11-I-85 | Flow | Category opens its rooms with floor/room badges and Back | Matches | departments § F-2 | V:2777-2797, V:2824-2840 | |
| G11-I-86 | Flow | Home and Appointment shortcuts from directions | Matches | departments § F-3 | V:6545-6600 | Via the dock. |
| G11-I-87 | Flow | Unknown category or room in the URL falls back to the category or room list | Missing in PRD | none | V:762-790 | |
| G11-I-88 | Rule | Directions data source: rooms configured by admin merged into kiosk stations | Partial | departments § Cross-product | M:496-545, M:560-640 | PRD names Reception Settings; built reads the shared Rooms store. |
| G11-I-89 | Rule | Placeholder zones (fictional doctors, restrooms) shown when rooms are missing or load fails | Defect | none | Ty:44-130, V:709-722 | See E-35. |
| G11-I-90 | Rule | Room edits by admin appear on a running kiosk | Defect | departments § Cross-product | V:722-724 | See E-36. |

### C.9 directions / rooms
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-91 | Flow | Voice deep-link to room by name, doctor or English/Hindi synonym, shows Direct Match | Matches | rooms § F-1 | V:2842-3340, V:6439-6445, `voiceIntentAndRouting.test.ts` | |
| G11-I-92 | Flow | Room card shows name, floor/wing, landmark text, spoken readout | Partial | rooms § F-2 | V:6425-6480, V:2806-2820 | Room-number tag is part of floor/wing text. |
| G11-I-93 | Flow | Assigned clinician row and "~1-2 min walk" estimate | PRD-only | rooms § F-2 | V:6425-6480 | Neither is on the card. |
| G11-I-94 | Rule | Walking text is read in the active language | Defect | rooms § F-2 | V:2813-2816 | See E-37. |
| G11-I-95 | Flow | Back returns to room list (browse) or Home (voice); Done returns Home | Matches | rooms § F-3 | V:2824-2840, V:6480-6500 | |
| G11-I-96 | Flow | "Start Check-in" button on room card | PRD-only | rooms § F-3 | V:6480-6500 | Only Back and Done exist. |
| G11-I-97 | Rule | Room guidance text comes from the Room's direction field, else a generic sentence | Missing in PRD | none | M:520-523, M:584-586 | Fallback: "Room N is located at <location>. Please follow hallway signs." |

### C.10 billing / invoices
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-98 | Flow | Billing needs phone and OTP before any amount is shown | Matches | invoices § F-1.1 | V:1934-1940, V:2186-2204 | |
| G11-I-99 | Flow | Face confirmation can also open billing | Contradicts | invoices § F-1 ("rather than passive facial unlock") | V:1996-2007 | Built lets a face match unlock billing in the Payment flow; PRD says phone-only. |
| G11-I-100 | Flow | Zero-match message and stay on phone screen | Matches | invoices § F-1.2 | V:2191-2197 | |
| G11-I-101 | Flow | Household picker "Whose bill would you like to view?" | Matches | invoices § F-1.3 | V:2203-2217, V:2341-2352 | |
| G11-I-102 | Rule | Invoice lookup is scoped to the verified patient | Defect | invoices § F-2.1 | M:1747-1770 | See E-05. |
| G11-I-103 | Flow | "Synchronizing invoices…" loader | Matches | invoices § F-2 | V:5345-5352, V:2108-2121 | |
| G11-I-104 | Flow | Patient Account banner: name, ID, phone and "N Outstanding" | Matches | invoices § F-2.2 | V:5325-5342 | Shows full phone and patient ID in public (E-34, Q-06). |
| G11-I-105 | Flow | Invoice cards: number, itemised services (fallback text), issued and due dates | Matches | invoices § F-2.3 | V:5395-5430 | |
| G11-I-106 | Metric | Balance due = total minus paid; Paid / Total subline; status badge and CTA | Matches | invoices § F-3 | M:1773-1790, V:5419-5455 | Computed per invoice, floor of zero; dollar sign is fixed. |
| G11-I-107 | Flow | Invoice load failure handling | Defect | invoices § F-4.1 | V:2108-2121 | See E-19. |
| G11-I-108 | Flow | "All Bills Clear!" empty state | Matches | invoices § F-4.1 | V:5355-5375 | |
| G11-I-109 | Flow | Sync with MA refresh and toast | Matches | invoices § F-4.2 | V:5466-5476 | Toast shows immediately, not after the reload finishes. |
| G11-I-110 | Flow | Done / Return Home and Different Patient clear the session | Defect | invoices § F-4.3 | V:5480-5495 | See E-11 (Different Patient keeps prior data). Done is correct. |
| G11-I-111 | Flow | Voice "pay / QR / checkout" opens the first unpaid invoice | Missing in PRD | none | V:3514-3524 | |

### C.11 billing / qr-pay
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-112 | Flow | QR carries payee, exact balance, currency and invoice reference | Defect | qr-pay § F-1.1 | V:530-540, V:5220 | See E-18. |
| G11-I-113 | Flow | Header with Pending/Paid pill, invoice number, due date and balance | Matches | qr-pay § F-1.2 | V:5140-5200 | |
| G11-I-114 | Flow | "Settled & Paid" overlay covers the QR | Matches | qr-pay § F-1.3 | V:5183 | |
| G11-I-115 | Flow | Wallet badges and Copy Payment Link / URI Copied | Matches | qr-pay § F-2 | V:5203-5230 | |
| G11-I-116 | Flow | Standalone Copy UPI Link / Confirm & Record dialog | PRD-only | qr-pay § F-2, F-3 | `InvoiceQrPaymentModal.tsx` (never mounted) | See E-39. |
| G11-I-117 | Flow | "I Have Paid - Settle Invoice Now" records payment as QR Code with memo "Paid via AI Receptionist QR Kiosk" | Matches | qr-pay § F-3.1 | V:2133-2140, V:5255-5262, M:1802-1808 | Visitor self-asserts payment (E-16, Q-01). |
| G11-I-118 | Rule | Payment is reconciled against a real UPI or gateway confirmation | PRD-only | qr-pay § Module Summary ("reconciles") | V:2133-2140 | Nothing checks money arrived. |
| G11-I-119 | Rule | Submitting lock during save | Matches | qr-pay § F-3.2 | V:515, V:5257 | |
| G11-I-120 | Flow | Confetti, green Aria state, spoken thank-you, card flips to Paid, ledger refreshes | Matches | qr-pay § F-3.3 | V:2141-2171 | |
| G11-I-121 | Flow | Back to All Bills and Return Home | Matches | qr-pay § F-3.4 | V:5295-5310 | |
| G11-I-122 | Rule | Recording against an invoice that cannot be found | Defect | none | `src\lib\invoiceService.ts:773-785` | See E-17. |
| G11-I-123 | Rule | Payment failure shows an error toast | Missing in PRD | none | V:2173-2180 | See E-40 for the unhandled rejection. |
| G11-I-124 | Rule | Receipt number shown on the confirmation | Defect | none | V:5289 | See E-40. |

### C.12 my-visit / tracker
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-125 | Flow | Visitor is verified before the queue is shown | Defect | tracker § F-1.1 | V:1944-1950, V:2739-2761 | See E-06. |
| G11-I-126 | Rule | Ticket priority: In-Service, then Waiting, then Completed | PRD-only | tracker § F-1.2 | V:2744-2751 | Built takes the first ticket of the first non-empty station. |
| G11-I-127 | Flow | Active Clinic Visit card: token, station, status, wait, directions, close | Partial | tracker § F-2.1 | V:6245-6285 | No Currently Serving, Patients Ahead or Send to Phone. |
| G11-I-128 | Metric | Currently Serving counter | PRD-only | tracker § F-2.2 | T:47-58 (token screen only) | Token screen shows "token minus 4": **hardcoded – formula undefined** (E-22). |
| G11-I-129 | Metric | Patients Ahead | PRD-only | tracker § F-2.2 | T:58-60 | Token screen: max(1, 4): **hardcoded – formula undefined** (E-22). |
| G11-I-130 | Metric | Estimated wait | Defect | tracker § F-2.2 | M:1331, V:6268-6271, M:2048 | Fixed at issue time and never recalculated; My Visit falls back to 5. See E-22. |
| G11-I-131 | Rule | Live subscription refreshes counts when staff move tickets | PRD-only | tracker § F-2.3 | M:1691-1700 | Client supports it; kiosk screens never subscribe. |
| G11-I-132 | Flow | Send to Pharmacy creates a new pharmacy token (P-014) | Contradicts | tracker § F-3.1 | M:1563-1640, `src\app\components\clients\VisitJourneyCard.tsx` | Staff button exists; the next ticket reuses the same token label and picks the first pharmacy or billing station. |
| G11-I-133 | Flow | Complete Visit and No Show/Left lower waits for others | PRD-only | tracker § F-3.2-3.3 | M:1668-1688 | Status changes, but no kiosk recalculation exists. |
| G11-I-134 | Flow | "No Active Token Today" with Go to Check-in | Matches | tracker § F-4 | V:6288-6300 | Opening the URL directly does not run the lookup (V:794-796). |

### C.13 my-visit / next-step
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-135 | Flow | "What's next / my status" by voice or touch after verification | Matches | next-step § F-1.1 | V:1884-1904, V:1964-2000 | |
| G11-I-136 | Rule | Uses the patient's process that is connected to AI Receptionist | Partial | next-step § F-1.2 | V:1990-2003, `src\lib\useProcessStore.ts:1137-1145` | Built falls back to the first AI-connected process if the patient is in none. |
| G11-I-137 | Flow | Stage card with accent, title, description, voice readout, View Details | Matches | next-step § F-2.1, F-2.3 | V:6125-6190 | Card also shows patient name and client ID (E-34). |
| G11-I-138 | Rule | "Step X of Y" on stage card | PRD-only | next-step § F-2.1 | V:6125-6190 | Not shown. |
| G11-I-139 | Rule | Internal-only stages never shown | Defect | next-step § F-2.2 | V:2006-2013 | See E-33. |
| G11-I-140 | Flow | View Details sheet merges patient, appointment and billing fields | Defect | next-step § F-3.2 | V:3739-3772 | See E-32. |
| G11-I-141 | Rule | Missing placeholders resolve blank | Defect | next-step § F-3.3 | V:3763-3772 | See E-32. |
| G11-I-142 | Rule | Guidance HTML is displayed safely | Defect | none | V:6217 | See E-09. |
| G11-I-143 | Flow | Phone path lands on the right household member | Defect | next-step § F-1 | V:2226-2240 | See E-07. |

### C.14 my-visit / biometric-consent
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G11-I-144 | Rule | Passive greeting is strictly separate from saved biometrics | Matches | biometric-consent § F-1.1 | V:1540-1590 | |
| G11-I-145 | Rule | "Camera active for greeting only" indicator | Contradicts | biometric-consent § F-1.2 | V:3830-3850 | Same as G11-I-19. |
| G11-I-146 | Rule | Template stored as an encrypted vector with consent timestamp, no photos | Defect | biometric-consent § F-1.3 | M:1813-1862 | See E-12. No photos are saved (matches). |
| G11-I-147 | Rule | First-name-only gate before confirmation | Matches | biometric-consent § F-2.1 | V:4700-4720 | |
| G11-I-148 | Rule | Under-18 never offered face enrolment; review says "Not available (under 18)" | Matches | biometric-consent § F-2.2 | V:2413-2424, V:5924 | |
| G11-I-149 | Flow | Adult opt-in with explicit explanation and unpenalised Skip | Matches | biometric-consent § F-3.1 | V:5655-5680 | |
| G11-I-150 | Rule | Template cannot be saved without consent | Matches | biometric-consent § F-3.2 | M:1945-1948 | Kiosk path honours it; staff Quick Enroll bypasses it (E-14). |
| G11-I-151 | Rule | Audit events for face enrolled and face deleted | Partial | biometric-consent § F-3.3 | M:1855-1862, M:1963-1972, M:2114-2118 | Also logs "face skipped"; events sit in the kiosk browser only (E-13). |
| G11-I-152 | Flow | Staff Biometric card: status, Delete face data with confirmation, status flips | Matches | biometric-consent § F-4.1-4.2 | `src\app\components\clients\FaceCheckinCard.tsx:46-95` | Confirmation dialog present; enrolled date is hardcoded in one path (E-14). |
| G11-I-153 | Flow | Staff "Enroll Face Check-in" | Defect | biometric-consent § F-4.3 | `FaceCheckinCard.tsx:100-104` | See E-14. |
| G11-I-154 | Flow | Staff "Withdraw Consent" action | Missing in PRD | none | `FaceCheckinCard.tsx:62-80` | Separate from Delete; same deletion call. |
| G11-I-155 | Flow | Patient can withdraw consent at the kiosk | Missing in PRD | none | none | Neither specified nor built (Q-10). |
## D. Correct flow as built (PRD-ready)

Each block below can replace the whole PRD file named in its heading. They describe intended behaviour: what is built and working, plus what was clearly intended where the prototype is buggy. Anything not yet built is under "Not yet built". Open decisions point to the Open questions list. Layout per file: header table, Cross-product Summary, 1. Module Summary, 2. Feature Requests (What it does / What it includes / Worked example / Jobs to be done / Acceptance criteria), 3. Comprehensive Summary.

---
### D.1 `avatar/kiosk-shell.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Avatar & Voice Experience - Split Kiosk Shell & Safety Controls (`/reception/*`) |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Reception Settings | Clinic name, brand colour, greeting phrase, terminals and the voice and payments switches set in Reception Settings change what the kiosk shows. | [View in Client](/client/settings/reception) |
| Client | Voice settings | Language and mute controls act on spoken audio and captions during the visit. | [View in Client](/client/settings/voices) |
| Client | Patient privacy | The inactivity timer clears the visitor's details from screen. | [View in Client](/client/clients) |
| Companion | Continuity | Visitors can carry on checking their queue on Companion. | [View in Companion](/companion/today) |

## 1. Module Summary
- The shell frames every screen after the home screen: Aria and live captions on the left, the task card on the right, a floating dock, language and mute controls, a 60-second privacy reset and Call Staff.
- Clinic administrators can turn the voice and payments features off, rename the clinic, set a brand colour and a greeting phrase, and label a terminal, from Reception Settings or the kiosk URL.

## 2. Feature Requests
### F-1: Split Stage and Live Captions
#### 1. What it does
Every active screen shows the Aria panel (Clinic AI Avatar, "Voice & Touch Enabled", animated voice bars and live captions for what the visitor says and what Aria says) beside a bright task panel.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Identity header | Banner | Names Aria and the input modes | |
| F-1.2 Continuous Aria pane | Layout | Aria stays on screen across steps | |
| F-1.3 Live caption card | Accessibility | Shows spoken and heard text | Visible when muted |
| F-1.4 Task panel | Workspace | Large forms, keypads and cards | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor moves from scan to phone to code to summary | Taps through four screens | Aria and captions stay put while the task card changes |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Hard-of-hearing visitor | See everything Aria says as large captions. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | On any active screen the Aria panel with captions renders beside the task panel. |

### F-2: Screen Titles and Step X of Y
#### 1. What it does
Titles name the task (Face Check-in, Phone Number Check-in, Security Code Verification, Select Patient Profile, Visit Summary & Room Assignment, Billing & Touchless QR Payment, New Patient Details, Register your face). Step dots show the position: scheduled flow 3 steps, billing 2, new walk-in 5 steps for adults and 4 for under-18s.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Screen titles | Header | Task-oriented title in English or Hindi | |
| F-2.2 Adaptive step dots | Indicator | Total changes with flow and age | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Parent registers a 14-year-old | Enters age 14 | 4 steps, face step skipped |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Walk-in visitor | Know which step I am on and how many remain. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | For an under-18 walk-in the indicator shows 4 total steps. |

### F-3: Dock, Language Switch and Mute
#### 1. What it does
The dock offers Home, Appointment, Billing, Feedback, Directions and My Visit, plus an English/Hindi switch and Mute. Billing is hidden when the clinic turns the payments feature off. Switching language changes screen text, Aria's voice and speech recognition without clearing typed digits. Mute stops speech at once; captions stay.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Shortcut rail | Dock | One-tap jump to a flow, highlights the active one | Billing follows the payments switch |
| F-3.2 Language toggle | Switch | Flips text, voice and listening language | Keeps entered inputs |
| F-3.3 Mute | Switch | Cuts spoken audio | Captions remain |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Six digits typed, visitor prefers Hindi | Taps the language switch | Text and voice change, digits stay |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Bilingual visitor | Switch language mid-way without retyping. |
| F-3-J2 | Staff nearby | Mute voice in one tap. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Toggling language mid phone entry updates text and speech language and keeps the digits. |
| F-3-2 | Mute silences speech immediately and captions stay visible. |

### F-4: 60-Second Privacy Reset and Start over
#### 1. What it does
A visible countdown runs on every screen except home. Touching, typing or moving the pointer restores 60 seconds. At 0, or when Start over is tapped, the kiosk stops the camera, microphone and speech, clears every visitor detail held for the session (matched patient, phone, code, session, appointment, invoices, payment state, next-step data, captured face samples, forms, directions choice) and returns to home.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 Watchdog | Timer | 60 s countdown off home | |
| F-4.2 Activity reset | Timer | Restores 60 s on touch, key, pointer | |
| F-4.3 Countdown and Start over | Header | Shows seconds and manual reset | |
| F-4.4 Full clear | Reset | Stops hardware and wipes all visitor data | Includes billing and next-step data |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor walks away from a token screen | Leaves it for 60 s | Details erased, streams stopped, home shown |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Privacy lead | Wipe an abandoned screen within 60 seconds. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | After 60 s of no touch, key or pointer input on a non-home screen, all visitor session data is cleared and home shows. |
| F-4-2 | Input with 15 s left restores 60 s. |
| F-4-3 | The clear includes invoices, payment and QR state, next-step data and captured face samples. |

**Not yet built:** restart on scroll and on spoken input; clearing of invoice, payment and next-step data (see E-10). Decision needed: should the timer pause during an in-flight payment save or face capture (see G11-Q-20)?

### F-5: Call Staff, Feedback Placeholder and Toasts
#### 1. What it does
Call Staff opens "Staff Assistance Summoned" ("The front desk has been notified and someone is on the way.") over the current screen with a "Got it, thanks" button, keeping the form underneath. The front desk is actually alerted. Feedback opens a "coming soon" screen with a way home. Status toasts disappear after 3 seconds.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1 Call Staff | Modal | Overlay and a real staff alert | Decision needed: how is the front desk alerted (see G11-Q-18)? |
| F-5.2 Feedback route | Screen | Placeholder at `/reception/feedback` | Route must be registered |
| F-5.3 Toasts | Banners | 3-second status messages | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor confused at the code screen | Taps Call Staff, then Got it | Overlay shows; entered phone is intact |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Overwhelmed visitor | Get human help without losing my progress. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Call Staff shows the overlay and keeps the underlying inputs on dismissal. |
| F-5-2 | Call Staff notifies reception (see G11-Q-18). |

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Split stage and captions | F-1.1 to F-1.4 | Aria, captions and task card side by side. |
| F-2 | Titles and steps | F-2.1 to F-2.2 | Clear titles and adaptive step dots. |
| F-3 | Dock, language, mute | F-3.1 to F-3.3 | Fast switching that keeps typed input. |
| F-4 | Privacy reset | F-4.1 to F-4.4 | 60-second wipe of all visitor data. |
| F-5 | Call Staff, feedback, toasts | F-5.1 to F-5.3 | Human help without losing progress. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Bilingual and accessible visitor | Captions, language switch, mute, step counters. | F-1, F-2, F-3 |
| 2 | Privacy lead and confused visitor | Auto-wipe and human help. | F-4, F-5 |

**Added behaviour (built, not in the old PRD):** clinic branding and feature switches from Reception Settings or URL parameters (`org`, `terminal`, `terminalName`, `location`); directions views are logged; billing can be hidden when payments are off.

---
### D.2 `avatar/ambient-presence.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Avatar & Voice Experience - Ambient Presence & Wake Flow (`/reception`) |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Reception Settings | Configured clinic name, greeting phrase and feature switches shape the home screen. | [View in Client](/client/settings/reception) |
| Client | Appointments | Appointment tile opens check-in against today's calendar. | [View in Client](/client/appointments/calendar) |
| Client | Invoices | Billing tile opens phone-verified invoice lookup. | [View in Client](/client/invoices) |
| Companion | Mobile alternative | Visitors can continue on Companion. | [View in Companion](/companion/today) |

## 1. Module Summary
- The standing lobby home of Aria at `/reception` greets visitors who stop close, ignores passers-by, and offers four quick actions and a Start button.
- Every visit starts from a clean home screen with no earlier patient detail.

## 2. Feature Requests
### F-1: Canonical Home and Session Clear
#### 1. What it does
`/reception`, `/reception/landing` and `/reception/idle` all open the one home screen (the `/reception/idle` route must be registered). Returning home clears names, phone, codes, invoices and drafts.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Normalised route | Navigation | All entry URLs lead to home | |
| F-1.2 Session clear | Privacy | Clears prior visitor data on return | See kiosk-shell F-4.4 |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient finishes billing and taps Home | Returns home | Invoice and name are gone |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Privacy lead | Erase earlier visitor details immediately. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | On return to home, all previous patient, appointment, invoice and payment details are cleared. |

### F-2: Close-Proximity Greeting and Privacy Notice
#### 1. What it does
When the browser offers a face detector and camera permission, the kiosk samples about 5 times a second and only measures face size. A face smaller than 14% of frame height is ignored; 30% or more for two checks in a row wakes Aria. No recognition runs and no image is saved. A visible notice tells visitors the camera is for greeting only. Without camera or detector, the kiosk works by touch.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Distance and dwell filter | Logic | 30% for 2 checks to wake | |
| F-2.2 Non-identifying promise | Privacy | No matching or storage | |
| F-2.3 "Camera active for greeting only" notice | Badge | Tells visitors why the camera is on | Decision needed: persistent text pill or icon with tooltip (see G11-Q-05) |
| F-2.4 Touch fallback | Resilience | Full use without camera | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist walks behind the chairs | Passes at 9% | No greeting |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Approaching visitor | Be greeted without disturbing others. |
| F-2-J2 | Compliance officer | Show visitors the camera is not identifying them. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Below the dwell threshold Aria stays at rest and plays no welcome. |
| F-2-2 | On home no face matching runs, and the camera purpose is visible. |

### F-3: 5-Phase Welcome
#### 1. What it does
On approach or Start tap: dormant, engaged (short pause), greeting (English, Hindi or the clinic's custom phrase), listening (after a short echo buffer, mic opens with captions), routing ("One moment, directing your visit..."). With voice turned off in settings the kiosk greets but does not listen.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Lead-in | Cue | Short pause before speaking | |
| F-3.2 Bilingual greeting | Prompt | Active language or custom phrase | |
| F-3.3 Listening hand-off | Timing | Short pause before the mic opens | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Quiet morning | Taps Start | Greeting, then listening with captions |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Lobby visitor | Natural turn-taking. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Aria finishes the greeting before the microphone opens. |

### F-4: Quick Actions and Start
#### 1. What it does
Four tiles (Appointment, Billing, Feedback, Directions) in English or Hindi, two either side of Aria on wide screens and a grid on tablets, with Start at the bottom. A tile tap stops the greeting and opens the flow at once. Billing is absent when payments are off.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 Wide layout | Layout | Two left, two right | |
| F-4.2 Compact grid | Layout | Grid on small screens | |
| F-4.3 Touch bypass | Action | Interrupts greeting | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Quiet visitor | Taps Directions during the greeting | Greeting stops, categories open |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Shy visitor | Do the common tasks without speaking. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Tapping a tile stops greeting audio and opens that screen. |

### F-5: Installer Diagnostic Mode
#### 1. What it does
`/reception?debug=1` or `?debug=true` shows a small strip with wake phase, screen and camera status. Without the flag nothing is shown.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1 Query flag | Tool | Turns the strip on | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Installer tests angle | Opens `?debug=1` | Strip shows dormant, engaged, greeting, listening |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Installer | Check approach triggers without developer tools. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Without the flag no diagnostic strip appears. |

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Canonical home and clear | F-1.1 to F-1.2 | One home, clean between visitors. |
| F-2 | Proximity greeting and notice | F-2.1 to F-2.4 | Size-only sensing, visible purpose. |
| F-3 | 5-phase welcome | F-3.1 to F-3.3 | Natural pacing. |
| F-4 | Quick actions and Start | F-4.1 to F-4.3 | Four bilingual tiles. |
| F-5 | Installer mode | F-5.1 | Optional status strip. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Lobby visitor | Greeted on approach or one-tap tasks. | F-2, F-3, F-4 |
| 2 | Privacy lead and installer | Anonymous camera use, easy calibration. | F-1, F-2, F-5 |

**Not yet built:** none beyond the unregistered `/reception/idle` route (see E-30).

---
### D.3 `avatar/aria-stage-speech.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Avatar & Voice Experience - Aria Stage, Speech Capture & Intent Routing |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Voice and AI settings | Clinic voice setup supplies spoken prompts and languages. | [View in Client](/client/settings/voices) |
| Client | Knowledge Base | Questions on timings and policies are meant to use the clinic's Knowledge Base. | [View in Client](/client/knowledge-base) |
| Admin | Voice and model catalog | Platform speech models drive quality. | [View in Admin](/admin/ai-voices-models) |
| Companion | AI chat | Private text assistant on the phone. | [View in Companion](/companion/chat/chat) |

## 1. Module Summary
- Aria appears as one continuous video with colour-coded status, listens in noisy lobbies in English and Hindi, and routes spoken requests by priority.
- Visitor speech is captured by the kiosk microphone and transcribed by a server speech service, with automatic fallback to browser speech recognition.

## 2. Feature Requests
### F-1: Single Stage, Rest Poses, Reduced Motion
#### 1. What it does
One video element with a static portrait if media fails; playback settles on a closed-mouth rest frame when speech ends; reduced-motion devices keep Aria paused while captions continue.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Single stage | Video | One Aria visual across screens | |
| F-1.2 Rest settle | Motion | Stops on a closed-mouth frame | |
| F-1.3 Portrait fallback | Resilience | Static image if video fails | |
| F-1.4 Reduced motion | Accessibility | Honours OS preference | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Aria finishes a sentence | Waits | Mouth settles closed |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Waiting patient | Calm, natural motion. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Exactly one Aria media element is on screen in every state. |
| F-1-2 | With reduced motion on, video stays paused and captions stay legible. |

### F-2: Six-State Halo and Status Pill
#### 1. What it does
A halo and pill show Ready, Speaking, Listening, Thinking (with contextual text), Verified, or Assistance.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Six colour states | Aura | Idle, speaking, listening, thinking, success, apologetic | |
| F-2.2 Status badge | Label | Icon plus state word | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor enters last code digit | Waits | Thinking state shows "Verifying security code..." |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Hard-of-hearing visitor | Know visually what Aria is doing. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Each of the six states shows its own label and colour. |

### F-3: Noise-Filtered Capture and Speech Backup
#### 1. What it does
Keeps 0.6 s before voice starts, drops sounds under 0.4 s, ends a phrase after 0.8 s of silence or 8 s, waits about 0.45 s after Aria speaks, and falls back to browser speech if the server service is unconfigured, offline or slower than 8 s.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Pre-roll | Buffer | 0.6 s | |
| F-3.2 Burst and silence rules | Segmenting | 0.4 s / 0.8 s / 8 s | |
| F-3.3 Echo guard | Guard | About 0.45 s | |
| F-3.4 Dual transcription | Backup | Server first, browser second | Decision needed: retention and consent wording for audio sent to the server (see G11-Q-12) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | No speech server key | Speaks | Browser recognition takes over |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient in a noisy lobby | First words captured, no false triggers. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Sound under 0.4 s is discarded without a transcription request. |
| F-3-2 | If the server service is unavailable or exceeds 8 s, the kiosk uses browser recognition without freezing. |

### F-4: Priority Intent Routing and Anti-Loop
#### 1. What it does
Phrases are matched most specific first: room, doctor and English/Hindi synonyms go straight to walking directions; then department; then status and next step; then Feedback, Appointment, Billing, Directions. The first unclear phrase gets one clarification; later chatter is ignored quietly.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 Direct destination | Priority 1 | Room, doctor, synonyms | |
| F-4.2 Category and status | Priority 2 | Departments, "What's next" | |
| F-4.3 Core modules | Priority 3 | Feedback, check-in, billing, directions | |
| F-4.4 Anti-loop | Priority 4 | One prompt then quiet | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Hindi speaker | Says "Dawai kahan milegi?" | Pharmacy directions open |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Visitor | Jump straight to the room I asked for. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | "Where is the pharmacy?" opens the pharmacy directions directly. |
| F-4-2 | Two unclear utterances in a row produce one spoken clarification. |

### F-5: Hands-Free Commands
#### 1. What it does
Voice works inside each step: start scan, use phone, yes that's me or not me, spoken digits, clear, send, verify, continue, approve, edit, skip, back, home, start over.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1 Identity and confirm | Command | Start, use phone, yes, not me | |
| F-5.2 Spoken digits | Input | Fills phone and code | |
| F-5.3 Navigation | Command | Back, home, start over | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor holding a child | Says "Yes, that's me" | Same as tapping confirm |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Hands-full patient | Complete check-in by voice. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Saying "Yes, that's me" on the privacy confirmation acts like tapping the button. |

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Stage and rest poses | F-1.1 to F-1.4 | One calm Aria. |
| F-2 | Halo and pill | F-2.1 to F-2.2 | Six visible states. |
| F-3 | Capture and backup | F-3.1 to F-3.4 | Reliable voice in loud rooms. |
| F-4 | Intent routing | F-4.1 to F-4.4 | Specific beats broad; no nagging. |
| F-5 | Hands-free commands | F-5.1 to F-5.3 | Voice parity with touch. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | All visitors | Natural, accessible voice help. | F-1, F-2, F-3, F-5 |
| 2 | Question-driven visitors | Direct answers without repeated errors. | F-4 |

**Not yet built:** Knowledge Base answers are a mock (not connected to the clinic Knowledge Base).

---
### D.4 `checkin/scheduled.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Check-In & Booking - Scheduled Check-In (`/reception/appointment`) |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Appointments calendar | Confirming check-in marks the visit Arrived with its token. | [View in Client](/client/appointments/calendar) |
| Client | Patient timeline | Arrival is logged against the patient with doctor and room. | [View in Client](/client/clients) |
| Client | Automation | Check-in raises client and appointment arrival events for rules. | [View in Client](/client/automation) |
| Companion | Token and queue | The issued token and wait are visible in Companion. | [View in Companion](/companion/today) |

## 1. Module Summary
- A verified patient with an appointment today reviews a 3-card summary and confirms once to be marked Arrived and given a numbered queue token.
- A verified patient with no appointment today is taken to walk-in service selection.

## 2. Feature Requests
### F-1: Today's Appointment Lookup
#### 1. What it does
After face or phone verification the kiosk finds that patient's appointments for **today** with an active status, from desk, phone, web or kiosk bookings, pairs the booked doctor with the room set in Rooms, and estimates the wait. Matching is by patient identity (not by name alone). With no booking today the visitor goes to walk-in service selection with a warm greeting.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Same-day lookup | Rule | Today and active status only, matched to the verified patient | |
| F-1.2 Doctor-room pairing | Rule | Uses configured rooms and their floor and directions text | |
| F-1.3 Wait estimate | Metric | Decision needed: confirm the wait formula (see G11-Q-13); current intent is max(5, (waiting + 1) x 10) minutes, used the same way on every screen | |
| F-1.4 Walk-in fallback | Branch | No booking leads to service selection | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Booked 11:00 with Dr. Sharma, arrives 10:50 | Verifies | Summary with room and wait |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Scheduled patient | Have the kiosk find my visit without repeating details. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A verified patient with an active appointment dated today sees Visit Summary & Room Assignment. |
| F-1-2 | A verified patient with none today goes to walk-in service selection. |
| F-1-3 | Appointments of other dates, cancelled visits or other patients are never shown. |

### F-2: 3-Card Visit Summary
#### 1. What it does
Card 1: name, age and gender, masked phone and a biometric badge. Card 2: service, doctor, date and time, source. Card 3: room, floor and directions, wait, and the Confirm check-in & Print Token button. Details come from the patient's real appointment and the clinic's room setup.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Patient card | Card | Name, demographics, masked phone | Never full digits |
| F-2.2 Appointment card | Card | Service, doctor, slot | |
| F-2.3 Room and wait card | Card | Room, location, wait | |
| F-2.4 Confirm CTA | Button | Confirms; also by voice | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor checks the cards | Taps Confirm | Token issued |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Arriving patient | Catch a mix-up before joining the queue. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | All three cards and the confirm button show; the phone is masked. |

### F-3: Duplicate-Safe Confirmation, Token and Pass
#### 1. What it does
Confirm checks the appointment in, creates a journey and one queue ticket at the room's station, marks the appointment Arrived, raises arrival events and records an audit entry. A rapid second tap does not issue a second token. The Token Issued view shows the token, room, directions and wait and offers an SMS pass.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Double-tap protection | Guard | One ticket per appointment | |
| F-3.2 Schedule sync | Sync | Appointment becomes Arrived | Decision needed: should check-in set the appointment status to Arrived, and what should the List show? (see G6-Q-04) |
| F-3.3 Token display | View | Token, room, directions, wait | Decision needed: token format and reset rule (see G11-Q-14) |
| F-3.4 SMS pass | Action | Sends token and directions by SMS | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient double-taps Confirm | Two taps in a second | One token; calendar shows Arrived |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Front desk | See who has arrived without asking. |
| F-3-J2 | Patient | Keep my token and directions on my phone. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | One or many rapid taps issue exactly one ticket for the appointment. |
| F-3-2 | Intended: the appointment shows Arrived with its token in the calendar. Decision needed (see G6-Q-04; arrival windows are G11-Q-09): should check-in set the status to Arrived, and what should the List show? |

**Not yet built:** WhatsApp pass; real SMS delivery; enforcement of early and late arrival windows (see G11-Q-09); check-in updating the clinic's Appointments record so the appointment shows Arrived with its token in the calendar (see E-42, G6-Q-04).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Today lookup | F-1.1 to F-1.4 | Find today's visit or go to walk-in. |
| F-2 | 3-card summary | F-2.1 to F-2.4 | Confirm identity, doctor, room. |
| F-3 | Confirm and token | F-3.1 to F-3.4 | One token, Arrived, SMS pass. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Pre-booked patient | Review and get a token in one tap. | F-1, F-2, F-3 |
| 2 | Reception staff | Self check-ins appear as Arrived. | F-3 |

---
### D.5 `checkin/walk-in.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Check-In & Booking - Walk-In Registration (`/reception/walk-in`) |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | New patient record | Approving registration creates the client with intake details. | [View in Client](/client/clients) |
| Client | Walk-in appointment | The booked walk-in is an Arrived appointment with token. | [View in Client](/client/appointments/list) |
| Client | Onboarding process and pipeline | The patient enters the configured default process and a pipeline deal is created. | [View in Client](/client/processes/kanban) |
| Client | Services | Service names, durations and prices come from Services. | [View in Client](/client/services) |
| Client | Reception Settings | Default onboarding process and token prefixes. | [View in Client](/client/settings/reception) |

## 1. Module Summary
- Visitors without a profile or booking register, optionally enrol their face, choose a service and doctor and receive a token.
- Steps adapt (5 for adults, 4 for minors) and name and reason can be dictated.

## 2. Feature Requests
### F-1: New Patient Details, Dictation, Minor Rule
#### 1. What it does
Full name (required), age (required), gender, reason, optional email. Mic buttons dictate name and reason. Age under 18 skips face enrolment, drops the steps to 4 and records biometrics as "Not available (under 18)". Decision needed: age is typed by the visitor; is a date of birth or guardian step required (see G11-Q-07)?
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Demographics form | Form | Blocks on an empty name | |
| F-1.2 Mic dictation | Voice | Fills name and reason | |
| F-1.3 Minor bypass | Rule | No face step under 18 | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Parent registers a 12-year-old | Enters age 12 | 4 steps, straight to Review |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | First-time walk-in | Dictate details quickly. |
| F-1-J2 | Parent | Skip biometrics for my child. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Empty name blocks Next with an inline message. |
| F-1-2 | Age under 18 skips face registration and shows 4 steps. |

### F-2: Optional Face Enrolment and Duplicate Guard
#### 1. What it does
Adults see the Biometric Privacy & Consent notice and choose Register my face or Skip for now (no penalty). Registration captures three angles from the live camera, builds one template, and compares it with enrolled templates at 0.85 similarity; a strong match offers "Yes, that's me" to link to the existing record instead of creating another, after the visitor has also proved who they are (decision needed: what extra check, see G11-Q-24).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Consent vs Skip | Screen | Voluntary opt-in | |
| F-2.2 3-angle capture | Scan | Front, left, right | |
| F-2.3 Duplicate guard | Rule | Offers to merge on strong match | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Adult declines biometrics | Taps Skip for now | Review, same priority |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Privacy-sensitive adult | Keep enrolment truly voluntary. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Skip for now moves to Review with no template saved. |
| F-2-2 | A strong match shows a duplicate-profile choice before a second profile is created. |

### F-3: Review and Approve, Record Creation
#### 1. What it does
Review lists name, age, gender, phone, email, reason and biometric choice (Enrolled, Skipped, Not available under 18). Approve creates the client, any consented template, audit entries, enrols the client in the Default Onboarding Process and creates a pipeline deal, then opens service selection. Edit goes back with inputs kept; Decline saves nothing and returns home.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Review summary | Screen | All entered data | |
| F-3.2 Create on Approve | Action | Client, template, audit, process, deal | Decision needed: deal amount rule (see G11-Q-25) |
| F-3.3 Edit and Decline | Buttons | Fix or abandon | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Typo in age | Taps Edit Details | Back to form with data kept |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Walk-in visitor | Review before my file is saved. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Decline creates no client and no template. |
| F-3-2 | Approve creates the client and opens service selection. |
| F-3-3 | A visitor whose phone already matches a client is linked to that client, not duplicated (see G11-Q-22). |

### F-4: Service and Doctor Selection, Walk-In Booking and Token
#### 1. What it does
Services (name, duration, price) come from Services. The visitor picks a doctor or "Next Available", which assigns the doctor with the shortest waiting queue (decision needed: definition, see G11-Q-16). Confirming creates a same-day appointment, checks it in as Arrived, issues a token and shows room, directions, wait and an SMS pass.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 Service cards | Picker | From the Services catalog | |
| F-4.2 Next Available vs doctor | Picker | Shortest queue or chosen doctor | |
| F-4.3 Slot and token | Commit | Arrived booking and token | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Urgent walk-in | Picks General Consultation and Next Available | Token and room of the quickest doctor |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Unscheduled patient | Pick a service and get a queue number now. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Confirming a service and doctor (or Next Available) creates an Arrived appointment and a numbered token. |

**Not yet built:** shortest-queue assignment for Next Available; guaranteed arrival sync to the Appointments calendar (see E-26, E-27).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Details, dictation, minor rule | F-1.1 to F-1.3 | Intake with a minor bypass. |
| F-2 | Face enrolment and duplicate guard | F-2.1 to F-2.3 | Voluntary, de-duplicated. |
| F-3 | Review and create | F-3.1 to F-3.3 | Approve, edit or decline. |
| F-4 | Service, doctor, token | F-4.1 to F-4.3 | Walk-in booking and token. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | New walk-in patient | Register with voice help and optional face. | F-1, F-2, F-3 |
| 2 | Returning patient without booking | Get a token fast. | F-4 |

---
### D.6 `checkin/phone-otp.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Check-In & Booking - Phone Keypad, OTP & Household Picker |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Patient profile and household | The phone is matched to client phone fields; several clients can share one number. | [View in Client](/client/clients) |
| Client | Invoices | Verification unlocks that patient's invoices. | [View in Client](/client/invoices) |
| Companion | Billing and Today | Balances and queue match what Companion shows. | [View in Companion](/companion/billing) |

## 1. Module Summary
- Visitors verify by mobile number and a 4-digit SMS code, pick a household member if needed, and land on the task they began (check-in, walk-in, billing, next step).

## 2. Feature Requests
### F-1: Keypad, Voice Digits, Validation
#### 1. What it does
Large keypad (0-9, backspace, clear) or spoken digits, up to 15 digits. Send Code needs at least 7 digits and otherwise shows an inline message. The number is matched to clinic records by comparing the national number (country codes stripped, trailing 10 digits compared); a partial number never matches a different patient.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Keypad | Controls | Touch and voice | |
| F-1.2 Normalisation | Rule | Strip +91/+1, compare trailing 10 digits | |
| F-1.3 Minimum length | Validation | 7 digits | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Only 4 digits entered | Taps Send Code | Inline message, stays |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Unenrolled visitor | Verify by phone quickly. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Fewer than 7 digits blocks sending and shows a message. |
| F-1-2 | A valid number moves to Security Code Verification. |
| F-1-3 | A number matches only a client whose national number is equal. |

### F-2: 4-Digit OTP, Validity, Resend
#### 1. What it does
Four boxes verify automatically on the fourth digit. The code is sent by SMS to that number only, is valid for 5 minutes, and a wrong or expired code shows a message. Resend is locked for 30 seconds after each send. Demo builds accept a published demo code; production never accepts a shared code (decision needed: delivery channel, retry and lockout limits, see G11-Q-02, G11-Q-03).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Auto-verify boxes | Input | Submit on 4th digit | |
| F-2.2 5-minute expiry | Security | Rejects old codes | |
| F-2.3 Resend and cooldown | Control | 30-second lock | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Wrong code | Enters 4 wrong digits | Error, retry |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Visitor | Be verified right after the fourth digit. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | The fourth digit triggers verification; mismatched or expired codes show a message. |
| F-2-2 | Resend stays locked for 30 seconds after a send. |

**Not yet built:** expiry enforcement, resend, lockout, real SMS, and use of the verification session to authorise later lookups (see E-03, G11-Q-04).

### F-3: Household Picker
#### 1. What it does
When several clients match the number, Select Patient Profile lists each member; one match skips the screen. The prompt adapts to check-in, next-step or billing ("Whose bill would you like to view?"). The Next Step flow uses the picker as well.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Profile cards | List | One card per member | |
| F-3.2 Single-match fast track | Shortcut | Skips the picker | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Mother checks in her son | Picks his card | His visit opens |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Parent | Choose the right family member. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | More than one match shows all members before any clinical or billing detail. |
| F-3-2 | Exactly one match bypasses the picker. |

### F-4: Context-Aware Routing
#### 1. What it does
Check-in: appointment today goes to Visit Summary; known patient without one goes to walk-in service selection; no profile goes to New Patient Details. Walk-in route: unknown number goes to New Patient Details; a known number pre-fills their details (see G11-Q-22). Billing: shows invoices, or "No billing records found for this phone number." and stays. My Visit and Next Step: open only for the verified patient.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 Check-in three-way branch | Dispatcher | Today, returning, new | |
| F-4.2 Billing guardrail | Rule | No clinical onboarding from Billing | |
| F-4.3 Visit and next-step unlock | Router | Original intent kept | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Unknown number in Billing | Completes OTP | Message shown, stays on phone screen |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Visitor | Verify once and land on my task. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Zero profiles in check-in leads to New Patient Details. |
| F-4-2 | Zero billing matches shows the message and stays on Phone Number Check-in. |

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Keypad and validation | F-1.1 to F-1.3 | Touch and voice digits. |
| F-2 | OTP | F-2.1 to F-2.3 | Auto-verify, 5-minute validity, resend. |
| F-3 | Household picker | F-3.1 to F-3.2 | Choose the right member. |
| F-4 | Routing | F-4.1 to F-4.3 | Branch by intent. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Visitor without face enrolment | Verify by phone quickly. | F-1, F-2 |
| 2 | Family caregiver | Pick the member and land on my task. | F-3, F-4 |

---
### D.7 `checkin/identity-biometrics.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Check-In & Booking - Identity Gate & Face Biometrics (`/reception/appointment`) |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Biometric enrolment status | Enrolment and deletion show on the patient profile. | [View in Client](/client/clients) |
| Client | Appointment lookup | A confirmed identity loads today's booking. | [View in Client](/client/appointments/calendar) |
| Client | Audit trail | Matches, enrolments, deletions and arrivals are recorded in the clinic audit trail. | [View in Client](/client/settings/audit-logs) |
| Companion | Visit continuity | Phone or face check-in shows in Companion Today. | [View in Companion](/companion/today) |

## 1. Module Summary
- One camera check-in entry for scheduled and unscheduled visitors with a permanent "Use phone number instead".
- No personal health information shows until the matched visitor confirms a first-name greeting.

## 2. Feature Requests
### F-1: Unified Entry and Live Camera Mirror
#### 1. What it does
`/reception/appointment` shows the camera preview, alignment guide, Start scanning and Use phone number instead. The camera stops when leaving or resetting; if permission is denied, phone entry still works.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Entry screen | Screen | Preview and two choices | |
| F-1.2 Camera stop | Privacy | Stops on leave or reset | |
| F-1.3 Denied fallback | Resilience | Phone option stays | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Camera blocked | Opens check-in | Phone option usable |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Arriving patient | Check in fast, with a phone alternative. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Preview, guide, Start scanning and Use phone number instead are shown. |
| F-1-2 | Leaving or resetting stops the camera at once. |
| F-1-3 | With permission denied, Use phone number instead stays clickable. |

### F-2: Distance and Centring Coaching
#### 1. What it does
Hints for too close, too far, off centre; the oval and corner brackets turn green when aligned.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Live hints | Coaching | Step back, closer, centre | |
| F-2.2 Aligned state | Indicator | Green oval | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor off centre | Moves | Oval turns green |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Visitor | Know when I am ready to scan. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Poor framing keeps the oval blue with a hint. |
| F-2-2 | Good framing turns oval and brackets green. |

### F-3: Countdown, Matching, 3-Attempt Fallback
#### 1. What it does
Start scanning runs a 3-2-1 countdown (Cancel scanning available), then a scan with an 8-second timeout. The captured face is compared with consented templates. A match goes to the confirmation gate; no match shows Try again with phone still available; after 3 failures the kiosk shows "Multiple attempts reached. Please use phone number check-in." and moves to phone check-in. If several profiles match, the visitor is not auto-confirmed (decision needed: handling, see G11-Q-26).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Countdown and cancel | Control | 3-2-1 | |
| F-3.2 Matching | Rule | Compare with consented templates | |
| F-3.3 Three-attempt fallback | Rule | Then phone | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Third failed scan | Waits | Message and phone check-in |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Visitor | Never be stuck on a failing scan. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | A 3-2-1 countdown runs before matching and can be cancelled. |
| F-3-2 | Three consecutive failures show the message and open phone check-in. |

**Not yet built:** real face matching (the prototype matches against a fixed test value; see E-01).

### F-4: Zero-PHI Confirmation and Routing
#### 1. What it does
On a match the screen shows only "Hi <FirstName>, is this you?" with the match percentage. Yes, that's me routes by flow: scheduled visitors with an appointment today to Visit Summary, others to walk-in service selection, and the Billing, My Visit and Next Step flows to their screens (decision needed: whether face may unlock Billing, see G11-Q-11). Not me discards the candidate and goes to phone check-in (decision needed: current build returns to the scan start, see G11-Q-08). Whether full names and amounts may be spoken aloud afterwards is undecided (see G11-Q-06).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 First-name gate | Privacy | No surname, phone, time or ID | |
| F-4.2 Yes routing | Router | By flow | |
| F-4.3 Not me | Reset | Discard candidate | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Wrong person matched | Taps Not me | Candidate discarded, no details shown |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Visitor | Keep my details private until I confirm. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Before Yes, no surname, phone, appointment time or medical ID is on screen. |
| F-4-2 | Not me discards the candidate and leaves the visitor on a path to phone check-in. |

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Entry and camera mirror | F-1.1 to F-1.3 | One entry with phone alternative. |
| F-2 | Coaching | F-2.1 to F-2.2 | Guidance to align. |
| F-3 | Countdown, matching, fallback | F-3.1 to F-3.3 | Three tries then phone. |
| F-4 | Zero-PHI confirmation | F-4.1 to F-4.3 | First name only until confirmed. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Arriving visitor | Check in by face or phone without exposing details. | F-1 to F-4 |

---
### D.8 `directions/departments.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Directions - Clinic Zones & Department Directory (`/reception/directions`) |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Rooms (Reception Settings) | Rooms the clinic configures appear as kiosk departments; the kiosk reads the same Rooms list, per browser. | [View in Client](/client/settings/reception) |
| Client | Services | A room's linked service decides its department. | [View in Client](/client/services) |
| Companion | Facility information | Room names match what patients see in Companion. | [View in Companion](/companion/today) |

## 1. Module Summary
- Visitors open Directions from the home tile, dock or by voice and browse Department, then Room, then Walking Directions.
- Departments come from the clinic's configured rooms; fixed example zones appear only when no room has been configured.

## 2. Feature Requests
### F-1: Department Grid (`/reception/directions`)
#### 1. What it does
The grid lists departments that have at least one active room, with room counts. A room goes to Dental if its service name contains "dental", to Diagnostics & Imaging if it contains "x-ray" or "imaging", to Consultation & Clinics if it contains "consult", otherwise to Other Clinic Rooms. When no rooms are configured, a built-in set (Pharmacy & Labs, Clinical & Doctors, Facilities & Restrooms) is shown. Decision needed: keep keyword grouping or add an explicit department field on rooms; should pharmacy, labs and restrooms always show (see G11-Q-15)?
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Dynamic grid | Grid | Departments with active rooms and counts | Empty departments hidden |
| F-1.2 Fallback zones | Default | Example zones if no rooms exist | Must not show invented staff as real |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic has two dental rooms and one consult room | Opens Directions | Dental (2) and Consultation (1) |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Visitor | See where each department is. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Each department with an active configured room shows with the correct room count. |
| F-1-2 | An unknown department or room in the URL falls back to the department or room list. |

### F-2: Room Listing
#### 1. What it does
A department opens its rooms with floor and room badges and a Back control.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Room list | List | Only rooms of that department | |
| F-2.2 Back | Control | Returns to departments | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor opens Dental | Taps it | Dental rooms only |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Visitor | Find my room in a department. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Only rooms of the chosen department show, with a working Back. |

### F-3: Home and Appointment Shortcuts
#### 1. What it does
Home (dock) returns to the lobby screen; Appointment starts check-in.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Dock shortcuts | Navigation | Home, Appointment | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor found the room, now wants to check in | Taps Appointment | Check-in opens |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Visitor | Move on to check-in. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Home returns to the lobby screen and Appointment launches check-in. |

**Not yet built:** rooms edited in Settings refreshing a kiosk that is already open (see E-36).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Department grid | F-1.1 to F-1.2 | Departments from configured rooms. |
| F-2 | Room listing | F-2.1 to F-2.2 | Rooms in a department. |
| F-3 | Shortcuts | F-3.1 | Home and check-in. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Visitor | Browse clinic areas and move on. | F-1, F-2, F-3 |

---
### D.9 `directions/rooms.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Directions - Voice Deep-Linking & Room Guide (`/reception/directions/:category/:room`) |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Room directions text | The direction text, floor label and responsible doctor edited on a Room feed the room card and voice matching. | [View in Client](/client/settings/reception) |
| Client | Services and providers | Rooms link service and doctor so visitors can ask by either. | [View in Client](/client/services) |
| Companion | Visit room | Room names match across kiosk and Companion. | [View in Companion](/companion/today) |

## 1. Module Summary
- Visitors reach walking directions by browsing or by speaking ("Where is the washroom?", "Where is Dr. Sharma?", "Dawai kahan milegi?"). Voice requests skip the menus and show a Direct Match pill.
- Walking text is whatever the clinic wrote for that room; if none, a generic sentence with room number and location is used.

## 2. Feature Requests
### F-1: Direct Voice Wayfinding
#### 1. What it does
A spoken room, doctor or English/Hindi synonym opens that room's card directly with Direct Match.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Direct match | Routing | Room or doctor to its card | |
| F-1.2 Synonyms | Vocabulary | Washroom, dawai, paani, lab | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor asks for the restroom | Speaks | Restroom card with Direct Match |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Visitor | Get straight to the place I asked for. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A query that matches an active room, doctor or synonym opens that room card with Direct Match. |

### F-2: Walking Directions Card
#### 1. What it does
The card shows the category, a Direct Match pill when spoken, room name, floor or wing with room number, and large walking text. Aria reads the text aloud unless muted, in the active language. Decision needed: should the card also show the assigned clinician and a walking time (see G11-Q-27)?
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Header | Card | Room, floor or wing | |
| F-2.2 Walking text | Text | Admin-authored landmarks | |
| F-2.3 Spoken readout | Voice | Reads text in active language | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor opens Room 101 | Reads | Text on screen and spoken |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Visually impaired visitor | Hear every turn. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Room name, floor or wing and walking text show together, and are spoken when unmuted. |

### F-3: Back Navigation and Exit
#### 1. What it does
After browsing, Back returns to that department's rooms; after a voice match, Back returns home. Done returns home and clears the session.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Context-aware Back | Navigation | Rooms or Home | |
| F-3.2 Done | Action | Home and clear | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Browsing path | Taps Back | Room list |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Visitor | Never hit a dead end. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | After browsing, Back returns to the department's rooms; Done resets to home. |

**Not yet built:** assigned clinician row, walking-time estimate and a Start Check-in button on the card; Hindi reading of the room's text (the text is spoken as written) (see E-37).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Direct voice wayfinding | F-1.1 to F-1.2 | Room or doctor by voice. |
| F-2 | Directions card | F-2.1 to F-2.3 | Large walking text, spoken. |
| F-3 | Back and exit | F-3.1 to F-3.2 | Context-aware back, Done. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Visitor | Reach the right room quickly. | F-1, F-2, F-3 |

---
### D.10 `billing/invoices.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Billing - Lookup & Invoice Ledger (`/reception/billing`) |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Invoices | The kiosk lists the verified patient's invoices from Client Billing and shows open balances. | [View in Client](/client/invoices) |
| Client | Patient profile | The household picker uses client phone fields. | [View in Client](/client/clients) |
| Companion | Billing | Balances match the Companion billing portal. | [View in Companion](/companion/billing) |

## 1. Module Summary
- Patients and caregivers look up open and settled invoices at the kiosk after phone and 4-digit OTP verification (and household selection when needed).
- Only the verified patient's own invoices are ever returned.

## 2. Feature Requests
### F-1: Phone/OTP Billing Gate and Household Selection
#### 1. What it does
Billing (tile, dock or "pay my bill") opens Phone Number Check-in in Billing mode. No amount shows until verification succeeds. Zero matches show "No billing records found for this phone number." and stay on the phone screen. One match opens the ledger and Aria says the number of pending bills (decision needed: whether to speak amounts or names, see G11-Q-06). Several matches show "Whose bill would you like to view?". Decision needed: whether a face match may also unlock billing (see G11-Q-11).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Verification gate | Privacy | Phone and OTP before amounts | |
| F-1.2 Non-match guard | Error | Stay on phone screen | Never opens walk-in |
| F-1.3 Family picker | Multi-match | Choose whose bill | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Unknown number | Verifies | Message; no registration |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Caregiver | See only the right family member's bill. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | No invoice rows appear before phone and OTP verification succeed. |
| F-1-2 | Zero matches show the message and stay on Phone Number Check-in. |
| F-1-3 | Invoices returned are only those of the verified patient. |

### F-2: Ledger and Patient Account Header
#### 1. What it does
After a loading message ("Synchronizing invoices with MantraAssist..."), the Patient Account banner shows name, patient ID, phone and "N Outstanding" (decision needed: mask phone and ID on a public screen, see G11-Q-06). Cards show the invoice number, itemised services (or "Clinical Consultation & Reception Services"), issued and due dates. A failed load shows an error with a retry, never the empty state.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Live ledger | Fetch | Current invoices | |
| F-2.2 Patient Account banner | Header | Name, ID, phone, outstanding count | |
| F-2.3 Service breakdown | Text | Items per card | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Two unpaid invoices | Opens ledger | "2 Outstanding" |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Payer | Check what each charge is for. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | The header count equals the invoices with a balance and each card lists its items. |
| F-2-2 | A load failure shows an error and retry, not "All Bills Clear!". |

### F-3: Balance, Pay via QR, View Receipt
#### 1. What it does
Balance due = invoice total minus amount paid, never below zero. Unpaid or partly paid cards show Pending Payment, the balance, "Paid: $X / $Y" when part-paid, and Pay via QR. Settled cards show Paid & Settled and View Receipt.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Balance math | Calculator | Total minus paid | |
| F-3.2 Status badges | Badge | Pending vs Paid & Settled | |
| F-3.3 Actions | Buttons | Pay via QR or View Receipt | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | $200 invoice, $50 paid | Views card | Balance $150, "Paid: $50.00 / $200.00" |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Payer | See exactly what remains. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | A $200 invoice with $50 paid shows Balance Due $150.00, Paid $50.00 / $200.00 and Pay via QR. |
| F-3-2 | A fully paid invoice shows Paid & Settled and View Receipt. |

### F-4: All Bills Clear, Footer Actions
#### 1. What it does
With no invoices, "All Bills Clear!" shows. Footer: Sync with MA reloads invoices and confirms with a toast once loaded; Done / Return Home wipes the session; Different Patient clears the current patient, the entered number and code and the invoices, and returns to Phone Number Check-in.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 All Bills Clear | Empty state | Nothing due | |
| F-4.2 Sync with MA | Refresh | Reload without new OTP | |
| F-4.3 Done and Different Patient | Footer | Wipe or switch patient | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Caregiver checks a relative | Taps Different Patient | Empty keypad |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Caregiver | Look up another family member. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Sync with MA reloads invoices and confirms by toast. |
| F-4-2 | Different Patient clears patient, number, code and invoices and returns to Phone Number Check-in. |

**Not yet built:** error and retry state on load failure; Different Patient clearing the previous number and invoices; patient scoping on the lookup (see E-05, E-11, E-19).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Gate and household | F-1.1 to F-1.3 | Verified access only. |
| F-2 | Ledger and header | F-2.1 to F-2.3 | Live, itemised invoices. |
| F-3 | Balance and actions | F-3.1 to F-3.3 | Exact balance, pay or receipt. |
| F-4 | Empty state and footer | F-4.1 to F-4.3 | Refresh, finish, switch patient. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient or caregiver | Verify and see exact dues. | F-1, F-2, F-3 |
| 2 | Caregiver | Refresh and switch patients. | F-4 |

---
### D.11 `billing/qr-pay.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | Billing - Touchless QR Checkout & Reconciliation |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Invoices and payments | A kiosk payment is recorded on the invoice as method QR Code with the memo "Paid via AI Receptionist QR Kiosk" and moves the invoice toward Paid. | [View in Client](/client/invoices) |
| Companion | Billing | The settled balance shows in Companion. | [View in Companion](/companion/billing) |

## 1. Module Summary
- Pay via QR opens a Touchless QR Settlement card with a scannable payment code for the exact balance. After the visitor confirms payment, the kiosk records it on the invoice, celebrates and refreshes the ledger.
- Decision needed: whether the kiosk may mark an invoice paid on the visitor's word alone, or only after a gateway or staff confirmation (see G11-Q-01).

## 2. Feature Requests
### F-1: QR Settlement Card and Settled Overlay
#### 1. What it does
The card shows a Payment Pending or Paid & Reconciled pill, invoice number, patient name, due date, Balance Due or Total Settled and prior deposits. The QR carries the clinic payee, the exact balance, the clinic's currency and the invoice reference. For a paid invoice an emerald "Settled & Paid" stamp covers the QR. Decision needed: currency and payee address for the QR (see G11-Q-21).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 QR matrix | Generator | Payee, amount, currency, invoice | |
| F-1.2 Status header | Strip | Pending or Reconciled | |
| F-1.3 Settled overlay | Stamp | Prevents double payment | Doubles as View Receipt |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | $150 balance | Opens card | QR for $150 |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Payer | Scan once and pay the exact amount. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A $150.00 balance shows $150.00 and the QR encodes that amount and the invoice number. |
| F-1-2 | A paid invoice shows Paid & Reconciled and the overlay over the QR. |

### F-2: Wallet Badges and Copy Payment Link
#### 1. What it does
GPay, PhonePe, Paytm, BHIM UPI, Apple Pay and Banking Apps badges; Copy Payment Link copies the link, flips to "URI Copied" and shows a toast.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Wallet strip | Chips | Accepted apps | |
| F-2.2 Copy link | Clipboard | Copies link, toast | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Companion paying from their phone | Taps Copy Payment Link | "URI Copied" |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Remote payer | Pay without scanning glass. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | The six badges and Copy Payment Link are visible. |

### F-3: Settlement, Celebration, Navigation
#### 1. What it does
"I Have Paid - Settle Invoice Now" locks the button while saving, records the payment as QR Code with the memo, shows confetti, turns Aria green, says thanks, flips the card to Paid & Reconciled, refreshes the ledger and offers Back to All Bills and Return Home. A failed save shows an error and leaves the invoice unpaid. Recording against an invoice that does not exist fails instead of creating one.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Ledger write | Accounting | QR Code, standard memo | |
| F-3.2 Submit lock | Guard | One save at a time | |
| F-3.3 Confetti and spoken thanks | Feedback | Visual and audio | |
| F-3.4 Exit actions | Buttons | Back to All Bills, Return Home | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Payer finishes on phone | Taps settle | Invoice shows $0.00 due |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Payer | Get instant confirmation without paper. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | After settlement the balance is $0.00, method is QR Code with the standard memo, and Back to All Bills shows Paid & Settled. |

**Not yet built:** reconciliation against a real payment (gateway or UPI confirmation); the separate standalone payment dialog (Copy UPI Link, Confirm & Record, Cancel); a safe receipt number (see E-16, E-39, E-40).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | QR card and overlay | F-1.1 to F-1.3 | Exact-balance QR and settled stamp. |
| F-2 | Badges and copy link | F-2.1 to F-2.2 | Accepted apps and link copy. |
| F-3 | Settlement | F-3.1 to F-3.4 | Record, celebrate, refresh. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient or caregiver | Pay the exact amount contactlessly. | F-1, F-2, F-3 |

---
### D.12 `my-visit/tracker.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | My Visit - Active Visit & Live Queue Tracker (`/reception/my-visit`) |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Visit journey (staff) | Staff Send to Pharmacy or Complete Visit from the client profile moves the patient between stations. | [View in Client](/client/clients) |
| Client | Queue | Tickets issued at check-in are what the tracker shows. | [View in Client](/client/appointments/calendar) |
| Companion | Today | The same ticket and progress show in Companion. | [View in Companion](/companion/today) |

## 1. Module Summary
- Checked-in patients see their own ticket, station, status and estimated wait; there is a clear empty state with a check-in shortcut.
- Only the verified visitor's own ticket is ever shown.

## 2. Feature Requests
### F-1: Verified Visit Lookup
#### 1. What it does
My Visit (dock or voice) shows the active ticket immediately if the visitor has already verified in this session; otherwise Aria verifies by face or phone first. When several tickets exist today, In-Service comes first, then Waiting, then Completed.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Session-aware entry | Guard | Verify before showing | |
| F-1.2 Priority lookup | Order | In-Service, Waiting, Completed | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Unverified visitor taps My Visit | Taps | Verification starts |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Waiting patient | Check my place without exposing others. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Without verification the kiosk verifies identity before showing any ticket. |
| F-1-2 | Only the verified patient's tickets are considered. |

### F-2: Active Clinic Visit Card
#### 1. What it does
The card shows the token, status (Waiting, In Service, Completed), station name, estimated wait, directions and a close button. Currently Serving, Patients Ahead and Send to Phone are planned (Decision needed: define formulas for Currently Serving, Patients Ahead and Estimated Wait, see G11-Q-13). The token screen today shows the visitor's token with a Currently Serving and Patients Ahead panel.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Header | Card | Token, status, station | |
| F-2.2 Queue panel | Metrics | Decision needed: define formula for Currently Serving, Patients Ahead (see G11-Q-13) | |
| F-2.3 Live sync | Subscription | Counts update as staff move tickets | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor opens My Visit | Taps dock | Card with token D-042 |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Visitor | See where I am in the queue. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | The card shows token, status, station and estimated wait for the verified patient. |

### F-3: Multi-Station Handoffs
#### 1. What it does
Staff can send a patient to Pharmacy or complete the visit from the client profile. Intended: a new ticket at the pharmacy with its own token (for example P-014) appears in My Visit; Complete Visit sets the ticket Completed; No Show or Left lowers the count for those behind.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Send to Pharmacy | Handoff | Closes doctor ticket, opens next station ticket | |
| F-3.2 Complete Visit | Finalise | Marks visit Completed | |
| F-3.3 Exception recalculation | Fairness | No Show or Left leaves counts | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor sends patient to pharmacy | Patient opens My Visit | Pharmacy ticket |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | Follow my journey across stations. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | After Send to Pharmacy the consultation ticket completes and a pharmacy ticket shows in My Visit. |

### F-4: No Active Token Today
#### 1. What it does
With no ticket, the screen explains none was issued and offers Go to Check-in.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 Empty card | Empty state | Clear message | |
| F-4.2 Go to Check-in | CTA | Opens check-in | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | No ticket | Opens My Visit | Card and button |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Unchecked-in visitor | Know I have no ticket and start check-in. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Zero tickets shows "No Active Token Today" and a working Go to Check-in. |

**Not yet built:** verification before My Visit, priority order, Currently Serving, Patients Ahead, Send to Phone, live updates, pharmacy token numbering, No Show recalculation (see E-06, E-22).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Verified lookup | F-1.1 to F-1.2 | Verify, then show the right ticket. |
| F-2 | Active visit card | F-2.1 to F-2.3 | Token, station, wait. |
| F-3 | Handoffs | F-3.1 to F-3.3 | Follow the patient across stations. |
| F-4 | Empty state | F-4.1 to F-4.2 | Clear next step. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Waiting patient or family | Check queue status privately. | F-1, F-2, F-3 |
| 2 | Unchecked-in visitor | Start check-in. | F-4 |

---
### D.13 `my-visit/next-step.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | My Visit - Process Stage & Personalized Next-Step Guidance |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Processes and stages | Stages marked for AI Receptionist and their card title, description and guidance content are authored in Process settings. | [View in Client](/client/processes/kanban) |
| Client | Clients | The patient's current stage drives which card shows. | [View in Client](/client/clients) |
| Companion | Care journey | Same stage guidance in Companion. | [View in Companion](/companion/today) |

## 1. Module Summary
- A verified patient asks "What's next?" or "My status" and sees the next patient-visible stage of their AI-Receptionist-connected process as a card, with a View Details guidance sheet personalised with their real data.

## 2. Feature Requests
### F-1: "What's Next?" Discovery
#### 1. What it does
After face or phone verification (with household picker when needed) the kiosk finds the patient's active process that is connected to AI Receptionist and prepares their current or next patient-visible stage. Decision needed: what to show when the patient is in no AI-connected process (see G11-Q-19).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Voice trigger | Intent | "What's next", "My status" | |
| F-1.2 Process lookup | Resolution | Only AI-connected processes | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Verified patient | Says "What's next?" | Stage card |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | Know my next step. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A verified patient in an AI-connected process sees their stage card, never an internal workflow. |

### F-2: Stage Cards and Visibility Filter
#### 1. What it does
A card shows the stage accent, Card Title (or stage name), Card Description, the process position (Step X of Y) and a View Details button; Aria reads title and summary. Stages switched off for kiosk visibility are never shown, and the kiosk advances to the next visible stage. Only the verified patient's own card shows.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 Card | Card | Accent, title, description, step | |
| F-2.2 Visibility filter | Privacy | Hides staff-only stages | |
| F-2.3 View Details | CTA | Opens guidance | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Stage "Verify Insurance - Billing Hold" is hidden | Asks what's next | The next visible stage shows |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Coordinator | Keep internal notes off lobby glass. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | A stage with kiosk visibility off is never shown. |
| F-2-2 | A visible stage shows its title and description with View Details. |

**Not yet built:** Step X of Y on the card; a guarantee that the fallback never lands on a hidden stage (see E-33).

### F-3: Personalised Guidance Sheet
#### 1. What it does
View Details shows the coordinator's rich guidance with live values for patient fields (name, first name, last name, phone, email, client ID), appointment fields (date, time, service, doctor, room), billing and stage fields (invoice ID, total, balance due, payment status, stage, process, clinic). Any field with no data shows blank, never a raw marker or a made-up value. Content is displayed safely so text typed by visitors cannot run as code.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Rich guidance canvas | Sheet | Formatted headings and checklists | |
| F-3.2 Live merge | Personalisation | Real patient and visit values | |
| F-3.3 Blank-if-missing | Guard | No raw markers | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Walk-in with no invoice | Opens details | Balance fields blank |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | Get instructions written for me. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | For a patient with an appointment, fields show real values and no unfilled marker remains. |
| F-3-2 | Missing optional fields display blank. |

**Not yet built:** real appointment and invoice values (the prototype shows sample text) and safe display (see E-09, E-32).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | What's next discovery | F-1.1 to F-1.2 | Find the patient's connected process. |
| F-2 | Cards and visibility | F-2.1 to F-2.3 | Patient-friendly, filtered. |
| F-3 | Guidance sheet | F-3.1 to F-3.3 | Personalised instructions. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Verified patient | See my next step and prepare. | F-1, F-2, F-3 |

---
### D.14 `my-visit/biometric-consent.md`

| Product | AI Receptionist |
| :--- | :--- |
| Module | My Visit - Biometric Privacy, Consent & Revocation |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Biometric Face Check-in card | Front desk sees enrolment status and date and can delete the stored template or withdraw consent. | [View in Client](/client/clients) |
| Client | Audit log | Enrolment, skip and deletion events are recorded for compliance. | [View in Client](/client/settings/audit-logs) |
| Companion | Visit continuity | Skipping face scan never limits phone check-in. | [View in Companion](/companion/today) |

## 1. Module Summary
- Camera use has two separate modes: passive greeting (size only) and intentional biometric check-in or enrolment. Minors are excluded, consent is explicit, skipping has no penalty and staff can delete the template.

## 2. Feature Requests
### F-1: Passive Greeting vs Saved Biometrics
#### 1. What it does
On home the camera only measures approximate face size to trigger a greeting; no matching, no photo, nothing saved; a visible notice says "Camera active for greeting only" (decision needed: persistent text or icon, see G11-Q-05). Matching or saving runs only after Start scanning or Register my face. Stored data is a numeric template with a consent timestamp and never a photograph; it is protected at rest (decision needed: required protection, see G11-Q-28).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1 Zero-identification greeting | Boundary | No identity query on home | |
| F-1.2 Camera purpose notice | Badge | Transparency | |
| F-1.3 Template storage | Storage | Template plus consent time, no photos | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor stands at the idle kiosk | Waits | Greeted, nothing identified or saved |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Visitor | Trust the camera is not tracking me. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | On home, no matching or template saving runs however long someone stands there. |

### F-2: Zero-PHI Confirmation and Under-18 Exclusion
#### 1. What it does
After a match only the first name (and match percentage) shows until Yes, that's me; Not me clears the match. Under-18 walk-ins never see face enrolment, store no template and see "Not available (under 18)" on the review.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1 First-name gate | Guard | Hides surname, phone, doctor, bill | |
| F-2.2 Minor exclusion | Rule | No biometrics under 18 | Age is as entered (see G11-Q-07) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Child registered | Enters age 12 | No face step |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Parent | Keep my child's biometrics out. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Until Yes, that's me, no full name, phone, doctor or invoice shows. |
| F-2-2 | Under 18: no enrolment screen and no template stored. |

### F-3: Informed Opt-In, Skip, Audit
#### 1. What it does
The walk-in consent screen explains that an encrypted template is stored, not raw photos, never shared, and can be revoked. Skip for now goes on with identical priority and nothing stored. A template is saved only with consent. Enrolment, skip and deletion each write a time-stamped audit event in the clinic audit trail, visible on the patient's timeline (decision needed: where the events live, see G11-Q-17). Patient-side withdrawal at the kiosk is undecided (see G11-Q-10).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1 Voluntary skip | Opt-out | No penalty | |
| F-3.2 Consent guard | Policy | No save without consent | |
| F-3.3 Audit feed | Trail | Enrolled, skipped, deleted | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Adult skips | Taps Skip for now | Booking continues, no template |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Adult visitor | Choose freely about biometrics. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Skip for now proceeds with no template persisted. |
| F-3-2 | Granting or revoking consent writes a time-stamped audit event. |

### F-4: Staff Biometric Controls
#### 1. What it does
The Biometric Face Check-in card on the client profile shows "Enrolled on <date>" or "Not enrolled" (the real enrolment date). Delete face data asks for confirmation, removes the template, clears the flags, logs the deletion and flips to Not enrolled; later scans no longer match that patient. Withdraw Consent does the same. Staff may enrol a patient on request only after consent is captured (decision needed: how, see G11-Q-23).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1 Status badge | Card | Enrolled date or Not enrolled | |
| F-4.2 Delete face data | Purge | Confirm, erase, log | |
| F-4.3 Enrol | Staff action | Needs consent | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient phones to remove face data | Staff taps Delete face data and confirms | Status Not enrolled; scans no longer match |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front desk | Honour a deletion request immediately. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | After confirmed deletion the card shows Not enrolled, a deletion event is logged and later scans do not match the patient. |

**Not yet built:** protected storage of templates, audit in the clinic trail, staff enrolment with real captured consent (see E-12, E-13, E-14).

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Passive vs saved | F-1.1 to F-1.3 | Greeting never identifies. |
| F-2 | Zero-PHI and minors | F-2.1 to F-2.2 | First name only; no minors. |
| F-3 | Opt-in, skip, audit | F-3.1 to F-3.3 | Voluntary and logged. |
| F-4 | Staff controls | F-4.1 to F-4.3 | Delete or enrol on request. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Visitor and parent | Control my biometric data. | F-1, F-2, F-3 |
| 2 | Front desk | Delete data on request. | F-4 |


## E. Prototype defects

Severity reflects impact if the behaviour were carried into a real deployment. The prototype is a demo on synthetic data, so several are "by design for a demo" but are not safe to describe as intended.

| ID | What's wrong | File:line | Severity | Related C row |
| :--- | :--- | :--- | :--- | :--- |
| G11-E-01 | [SECURITY] Face recognition never compares a real face. The scan sends one fixed test vector (V:1715-1718), and when nothing matches, the mock matcher returns the first enrolled patient at 94% confidence (M:1918-1926). Any visitor is "recognised" as an enrolled patient and sees that patient's first name, then (after Yes) their visit, bills or next step. | V:1715-1718; M:1918-1926 | Critical | G11-I-75 |
| G11-E-02 | [SECURITY] Face enrolment captures nothing from the camera: three constant sample vectors are averaged (V:2441-2461), and Approve falls back to the same constant (V:2646). Every enrolee gets near-identical templates, so the 0.85 duplicate check flags new patients as existing. | V:2441-2461, V:2646 | High | G11-I-49, G11-I-50 |
| G11-E-03 | [SECURITY] OTP is not a verification: any number accepts code 1234 or 0000 (M:651-660), expiry is returned but never checked (M:642-649), nothing is sent, there is no resend or lockout, and Aria announces "enter 1 2 3 4" aloud (V:2101) and the error text repeats it (V:2332). The verification session token is stored but ignored by every lookup (M:662, 706, 842). | M:642-660; V:2101, V:2332 | Critical | G11-I-61, G11-I-62, G11-I-70 |
| G11-E-04 | [SECURITY] Phone lookup accepts partial and substring matches (suffix, "contains" either way) once 7 digits are typed, so a few digits of another patient's number can return that patient (household picker or direct). With the shared OTP this exposes any matching patient. | M:676-688 | High | G11-I-59 |
| G11-E-05 | [SECURITY] Invoice lookup leaks other patients' bills. When a verified patient has no invoices, the lookup returns every unpaid invoice in the system (M:1766-1770), with names, items and amounts, and it also matches on name equality and partial phone (M:1756-1761). | M:1747-1770 | Critical | G11-I-102 |
| G11-E-06 | [SECURITY] My Visit needs no identity check: it takes the first ticket from the first station that has any queue and shows token, station, status and wait for whoever that is (V:2739-2761). | V:2739-2761 | Critical | G11-I-125, G11-I-68 |
| G11-E-07 | [SECURITY] Next-Step by phone picks the first matching household member silently (V:2226-2240) and shows their name, client ID and stage. The picker the PRD requires is skipped. | V:2226-2240 | High | G11-I-67, G11-I-143 |
| G11-E-08 | [SECURITY] "Yes, that's me" on a duplicate-face warning links the visitor to the existing patient record with no further check and Aria has just spoken that patient's first name (V:2478-2490, V:2520-2527). With E-02 this can attach a stranger to someone else's record and booking. | V:2478-2490, V:2520-2527 | High | G11-I-50 |
| G11-E-09 | [SECURITY] Next-step guidance HTML is injected unsanitised (V:6217) after replacing markers with values including the client name (V:3739-3771). A name typed by a walk-in at the kiosk is saved on the client and later rendered, so script text in a name can run on the kiosk. | V:6217; V:3739-3771; V:2643 | High | G11-I-142 |
| G11-E-10 | [SECURITY] The 60-second and Home reset does not clear invoices, selected invoice, QR image and paid flag, next-step client/stage/process or captured face samples (state at V:510-517, 570, 577-579; reset at V:1788-1846). Not visible through normal navigation, but it contradicts the PRD wipe and is risky if screens change. | V:1788-1846 | Medium | G11-I-07 |
| G11-E-11 | [SECURITY] "Different Patient" only clears the selected patient and returns to the keypad (V:5486-5490). The previous phone number, code, session token and invoice list stay in memory and the number still appears on the keypad for the next person. | V:5486-5490 | Medium | G11-I-110 |
| G11-E-12 | [SECURITY] Face templates are stored as plain number lists in browser storage (M:1832-1840) and copied onto the client record (M:1849), though the consent text and PRD say "encrypted". | M:1813-1862; V:5661 | High | G11-I-146 |
| G11-E-13 | [SECURITY] Biometric and reception audit events (enrolled, skipped, deleted, check-in, directions viewed) are saved only to the kiosk browser's local storage (M:42-52, M:2114-2118): per device, editable by anyone with browser access, and not in the clinic audit trail the PRD names. | M:2114-2118 | Medium | G11-I-151, G11-I-13 |
| G11-E-14 | [SECURITY] Staff Quick Enroll creates a template from a dummy vector with consent set to true (`FaceCheckinCard.tsx:100-104`), fabricating consent and biometric data. The card also shows a hardcoded enrolled date (2026-09-02) for patients enrolled only on the client record (`FaceCheckinCard.tsx:49-50`). | `src\app\components\clients\FaceCheckinCard.tsx:49-50, 100-104` | High | G11-I-153, G11-I-152 |
| G11-E-15 | [SECURITY] Test hooks on the browser window can set face position, ambient phase and inject a full patient, visit summary and match result (V:1614-1625, V:2545-2640), available in any build. Anyone with the console can show another patient's visit screen. | V:1614-1625, V:2545-2640 | Medium | G11-I-14 |
| G11-E-16 | [SECURITY] Payment is recorded when the visitor taps "I Have Paid" (V:2133-2140, V:5255-5262) with no check that money moved. Any visitor who can open an invoice can mark it paid; revenue and audit integrity depend on honesty. | V:2133-2140, V:5255-5262 | High | G11-I-117, G11-I-118 |
| G11-E-17 | [SECURITY] Recording a payment against an invoice id that is not found creates a new invoice for client "CL-001" named "Patient" and marks it paid (`src\lib\invoiceService.ts:773-785`). A bad id books money to the wrong client. | `invoiceService.ts:773-785` | High | G11-I-122 |
| G11-E-18 | The payment QR is a UPI link with a hardcoded payee address and currency USD (V:530-540, V:5220); UPI apps accept INR only, so scans would not complete. | V:530-540, V:5220; `InvoiceQrPaymentModal.tsx:47-49` | Medium | G11-I-112 |
| G11-E-19 | An invoice load failure is swallowed and the ledger shows an empty list (V:2108-2121), which the screen presents as "All Bills Clear!" and Aria says "no outstanding bills". | V:2108-2121, V:5355-5375 | High | G11-I-107 |
| G11-E-20 | [SECURITY] Today's appointments are not limited to today or to active status, and a name-only match attaches another person's booking when names are equal (M:842-905; date is only defaulted, M:857). A visitor can be shown an old, cancelled or namesake booking. | M:842-905 (name match M:866) | High | G11-I-32 |
| G11-E-21 | Visit summary invents data: if there is no appointment it fabricates one (Cardiology Checkup, Dr. Rajesh Patel, D-002, 11:00 AM, "Ground Floor, Clinical Wing B") (M:2020-2036, M:2077-2078), and an unknown patient id becomes client CL-013 or a fake "Priya Sharma" (M:2009-2031). Face-flow routing treats any summary with status "confirmed" as a scheduled visit (V:1744), so almost everyone is sent to the appointment screen. | M:2003-2083; V:1744 | High | G11-I-37 |
| G11-E-22 | Queue numbers are placeholders or inconsistent. Ticket wait uses x10 (M:1331), summary wait x8 (M:2048); Token screen sets "now serving" to token minus 4 and patients ahead to at least 1 (T:47-64); My Visit wait is the saved issue-time value or 5 (V:6268-6271). **Currently Serving, Patients Ahead and Estimated Wait on the token screen: hardcoded – formula undefined.** | M:1331, M:2048; T:47-64; V:6268-6271 | Medium | G11-I-34, G11-I-128, G11-I-129, G11-I-130 |
| G11-E-23 | Confirm check-in is not duplicate-safe: the kiosk passes no idempotency key (V:2373-2380, V:2680-2700) and the button is never disabled (V:5092), so a double tap creates two journeys and tickets, though the client supports 24-hour idempotency (M:474-494). | V:2373-2380, V:5092; M:474 | Medium | G11-I-38 |
| G11-E-24 | Token numbers come from the number of reception appointments ever saved plus 1 (M:1138, M:1455), not a per-station, per-day sequence, and the configured station prefixes only apply when the appointment has no token (M:1287). | M:1138, M:1287, M:1455 | Medium | G11-I-40 |
| G11-E-25 | The SMS pass only writes a console line (M:1703-1706) yet the screen announces it was sent; with no phone on hand it falls back to hardcoded numbers (V:3606; T:148). Nothing reaches a patient and a fake number could receive data in a live build. | M:1703-1706; V:3606; T:148 | Medium | G11-I-43 |
| G11-E-26 | "Next Available" does not pick the shortest queue; no doctor means the first listed doctor (M:1093-1096). | M:1093-1096 | Medium | G11-I-55 |
| G11-E-27 | Kiosk-booked walk-ins are saved as Confirmed with a reception-side id (M:1145-1160) and check-in calls the appointment store with that id (M:1382). If the Appointments store uses a different id the calendar may never show Arrived. Not confirmed at runtime. Code reading shows the ids differ (see E-42). | M:1145-1160, M:1381-1383 | Medium | G11-I-56 |
| G11-E-28 | A known number on the walk-in route is pre-filled (V:2310-2322), but Approve always creates a client (V:2643), so a second record for the same person is possible. | V:2310-2322, V:2643; M:706 | Medium | G11-I-57 |
| G11-E-29 | Every walk-in registration creates a pipeline deal of fixed amount 150 in rupees regardless of service (M:794). | M:794 | Low | G11-I-53 |
| G11-E-30 | `/reception/feedback` and `/reception/idle` are not registered routes (R:109-152). The Feedback tile and dock navigate to `/reception/feedback` (V:1914-1916) and the app shows the Not Found page (R:346) instead of the placeholder screen. | R:109-152, R:346; V:1906-1920 | Medium | G11-I-11, G11-I-16 |
| G11-E-31 | Call Staff only opens a local overlay and speaks (V:1957-1960, V:6699). No alert, queue entry or event is sent, though the screen says "The front desk has been notified". | V:1957-1960, V:6699 | High | G11-I-10 |
| G11-E-32 | Next-step guidance replaces appointment and billing markers with fixed sample values ("Dr. Rajesh Patel", "11:30 AM", "Consultation Room 3", "INV-CL-1056", "$78.75") (V:3750-3760) and leaves any other marker unchanged (V:3763-3771) instead of blanking it. Patients see invented appointment and invoice data. | V:3739-3772 | High | G11-I-140, G11-I-141 |
| G11-E-33 | [SECURITY] Hidden-stage filtering applies only to "next" stage; if none is visible the code falls back to the current stage or the first stage (V:2006-2013), which may be a staff-only stage. Patients not in any AI-connected process get the first AI process (V:1990-1996). | V:1990-2013 | Medium | G11-I-139 |
| G11-E-34 | [SECURITY] Personal data shown on a public screen without masking: full phone and patient ID in the Patient Account banner (V:5325-5342), name and client ID on the next-step card, and raw phone passed as the "masked" phone on the walk-in token summary (V:2705). | V:5325-5342, V:2705; V:6125-6190 | Medium | G11-I-36, G11-I-104, G11-I-137 |
| G11-E-35 | When no room is configured or the rooms load fails, the kiosk shows built-in example zones with invented staff (Dr. Rajesh Patel - Cardiology, Dr. Priya Nair - Pediatrics) as real directions (Ty:44-130; V:709-722). | Ty:44-130; V:709-722 | Medium | G11-I-89 |
| G11-E-36 | Directions load once on screen open and do not subscribe to room changes (V:722-724), so an admin's room edit does not reach a running kiosk until reload. | V:722-724 | Low | G11-I-90 |
| G11-E-37 | Walking directions are spoken with the same text in Hindi mode (V:2813-2816); room text is not translated. | V:2806-2816 | Low | G11-I-94 |
| G11-E-38 | The face matcher reports when several profiles match but the kiosk never reads that flag (M:1865-1930; V:1715-1730). | M:1865-1930 | Low | G11-I-81 |
| G11-E-39 | Dead code: the scheduled check-in panel (with demo-profile buttons and real-looking phone numbers), the walk-in booking panel and the standalone QR payment dialog are never mounted. | `src\reception\avatar\components\ScheduledCheckinPanel.tsx:360-381`; `WalkInBookingPanel.tsx`; `InvoiceQrPaymentModal.tsx` | Low | G11-I-116 |
| G11-E-40 | The payment confirmation shows a made-up receipt number from invoice digits, defaulting to "1001" (V:5289), and a failed payment save rethrows after the error toast (V:2173-2180), producing an unhandled error. | V:5289, V:2173-2180 | Low | G11-I-123, G11-I-124 |
| G11-E-41 | Services and doctors load failures are only logged (V:806-808), leaving an empty service picker with no message. | V:806-808 | Low | G11-I-54 |
| G11-E-42 | Kiosk check-in does not reach the clinic's appointment record, so the PRD promise that the appointment shows Arrived with its token in the calendar is not delivered. The kiosk looks the appointment up only in its own copy of appointments (M:1231). (a) A staff-booked appointment is shown to the visitor from the clinic store but is never saved into the kiosk copy (M:842-905), so the lookup finds nothing and neither the appointment event nor the appointment-store check-in is sent (M:1375). (b) A kiosk-booked appointment gets a kiosk id like apt_<time> (M:1146) while the clinic store numbers its own appointments from 101 (`src\lib\appointmentService.ts:651`), so the store call fails with "not found" and the empty catch swallows it (M:1383-1384). (c) Even when an id does match, the store only records a check-in time (`appointmentService.ts:1138-1162`); the status is not changed and the stage moves only if an automation rule on appointment check-in exists. See XM-02 and G6-E-07. | M:1231, M:1375-1384, M:1146, M:842-905; `src\lib\appointmentService.ts:651, 1138-1162` | High | G11-I-39 |

## Open questions for PM
1. **G11-Q-01** Should the kiosk be allowed to mark an invoice Paid when the visitor taps "I Have Paid", or only after a gateway or staff confirmation? What should the card show while waiting? (G11-I-117, G11-I-118, G11-E-16, D.11 F-3)
2. **G11-Q-02** How is the OTP delivered in production, who owns the SMS channel, and should the demo code ever exist outside a demo flag? (G11-I-61, G11-E-03, D.6 F-2)
3. **G11-Q-03** What are the retry and lockout limits for OTP and for face scans, and what should the kiosk show when exceeded? (G11-I-63, D.6 F-2)
4. **G11-Q-04** What should a successful verification authorise, for how long, and should it be bound to the one patient or household chosen? (G11-I-69, G11-E-03, D.6)
5. **G11-Q-05** Must the "Camera active for greeting only" notice be a persistent text pill (PRD) or is an icon with tooltip enough? (G11-I-19, G11-I-145, D.2 F-2, D.14 F-1)
6. **G11-Q-06** After verification, which details may appear on screen or be spoken in a public lobby: full name, full phone, patient ID, number and amount of bills? (G11-I-78, G11-I-104, G11-E-34, D.10 F-1 and F-2)
7. **G11-Q-07** Is the visitor-typed age enough to exclude minors from biometrics, or is a date of birth or guardian step needed? (G11-I-47, D.5 F-1, D.14 F-2)
8. **G11-Q-08** Where should "Not me" lead: phone keypad (PRD) or back to scan start (built)? (G11-I-80, D.7 F-4)
9. **G11-Q-09** Should check-in enforce the early and late arrival windows already stored in Reception Settings? (G11-I-44, D.4)
10. **G11-Q-10** Should a patient be able to withdraw biometric consent at the kiosk itself, not only through staff? (G11-I-155, D.14 F-3)
11. **G11-Q-11** May a face match unlock Billing, or must billing always use phone and OTP? (G11-I-99, D.7 F-4, D.10 F-1)
12. **G11-Q-12** Patient voice is sent to a server speech service: what notice, consent and retention rules apply? (G11-I-31, D.3 F-3)
13. **G11-Q-13** Define the formulas for Currently Serving, Patients Ahead and Estimated Wait (one rule for check-in, summary and My Visit), and whether they update live. (G11-I-34, G11-I-128 to 130, G11-E-22, D.4 F-1, D.12 F-2)
14. **G11-Q-14** Token format: one sequence per station per day with station prefixes from settings, or an appointment-level number? When does it reset? (G11-I-40, G11-E-24, D.4 F-3)
15. **G11-Q-15** Should kiosk departments be driven by an explicit department field on a Room (instead of service-name keywords), and should Pharmacy, Labs and Restrooms always appear? (G11-I-82, G11-I-83, D.8 F-1)
16. **G11-Q-16** How is "shortest queue" defined for Next Available (waiting count, wait minutes, doctor availability)? (G11-I-55, G11-E-26, D.5 F-4)
17. **G11-Q-17** Should kiosk biometric and arrival events go to the clinic's audit log and patient timeline, and who may read them? (G11-I-151, G11-E-13, D.14 F-3)
18. **G11-Q-18** How is the front desk alerted by Call Staff (notification, task, queue entry) and how do they know which kiosk? (G11-I-10, G11-E-31, D.1 F-5)
19. **G11-Q-19** If a verified patient is in no AI-connected process, what should Next Step show? (G11-I-136, G11-E-33, D.13 F-1)
20. **G11-Q-20** Should the 60-second timer pause while a payment is saving or a face capture is running? (G11-I-05, D.1 F-4)
21. **G11-Q-21** Which currency and payee address should the payment QR use (the UPI link is INR-only; amounts show in dollars)? (G11-I-112, G11-E-18, D.11 F-1)
22. **G11-Q-22** When a walk-in's phone matches an existing client, should the kiosk link to that client, offer the household picker, or create a new record? (G11-I-57, G11-E-28, D.5 F-3, D.6 F-4)
23. **G11-Q-23** How should staff capture patient consent before using Enroll Face Check-in? (G11-I-153, G11-E-14, D.14 F-4)
24. **G11-Q-24** What second check should accompany "Yes, that's me" on a duplicate-face warning? (G11-I-50, G11-E-08, D.5 F-2)
25. **G11-Q-25** Should a walk-in registration create a pipeline deal, and with what amount? (G11-I-53, G11-E-29, D.5 F-3)
26. **G11-Q-26** If two or more faces match, should the kiosk fall back to phone verification? (G11-I-81, G11-E-38, D.7 F-3)
27. **G11-Q-27** Should the room card show the assigned clinician, a walking time and a Start Check-in button as the PRD says? (G11-I-93, G11-I-96, D.9 F-2)
28. **G11-Q-28** What protection at rest and retention period does the PRD require for stored face templates? (G11-I-146, G11-E-12, D.14 F-1)
