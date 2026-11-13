# PRD ↔ Prototype gap analysis: summary

_Prepared 2026-11-13. PRD: `E:\ma-prd\content` (73 files). Prototype: `E:\mantra-assist` (code is what counts as "built"). Nothing in either repo was changed except new files under `analysis/`._

## Headline

| Measure | Result |
|---|---|
| Coverage, overall (all screens) | **31.4%** (294 ÷ 936 scored items) |
| Coverage, PRD-backed screens only | **37.3%** (292.5 ÷ 784) |
| Exact matches / partial / missing in PRD / contradicts | 219 / 150 / 491 / 76 |
| In PRD but not built | 169 |
| Prototype defects (distinct, section E) | **492**: 27 critical, 159 high, 195 medium, 110 low (one row unrated) |
| [SECURITY]-tagged defects | at least 115 |
| Open questions → consolidated decisions | 285 → 147 (40 are P0) |

**What the numbers say**
1. **The PRD is much smaller than the product.** 52% of scored items are built but not documented. Most PRD files are one-feature stubs of about 60 lines.
2. **Two PRDs describe a different product.** Overview and Reports score 0%: the PRDs describe an appointment-triage dashboard and AR-aging reports, and the prototype has neither. Clients, Settings and Super Admin also score low because the PRDs describe a clinic patient directory while the prototype is a broader contact CRM.
3. **Where a PRD was written against the screens, it matches well:** Reception kiosk 74%, Chats 63%, Process + Tasks 55–61%, Knowledge Base + Receptionist config 52%.
4. **Coverage says little about quality.** The Reception kiosk has the best score and also 4 critical defects. The defect list matters more than the percentages.
5. **Much of the prototype is demo-grade.** Sign-in, payments, face matching, scribe notes, workflow actions and many dashboard numbers are simulated or hardcoded. Treat the prototype as a UI spec, not as proof that a behaviour works.

## Top 15 gaps, ranked by impact

Impact weighs patient or customer harm, security and compliance, revenue, and how many modules are touched. IDs point into the module files; `XM-` IDs are in `cross-module.md`.

| # | Gap | Why it matters | Evidence (IDs) |
|---|---|---|---|
| 1 | **[SECURITY] No working access control.** The active role comes from browser storage and defaults to SystemAdmin. `/admin/*`, `/organizations` and `/users` need only a sign-in. Saved role permissions are never checked. The role-filtered navigation is dead code. | Any user can administer every organisation, delete data and change roles. The PRD defines no permission model, so there is nothing to build against. | G13-E-05, E-98, E-02, E-100; G14-E-04/05; G10-E-03/09; `roles-permissions.md`; decisions D-11–16 |
| 2 | **[SECURITY] Sign-in is simulated everywhere.** Staff login accepts any email and password. An invite for an existing email signs the visitor in as System Admin and never expires. Portal one-time codes are never checked. The kiosk accepts the demo codes 1234 and 0000. | No identity is ever verified, for staff, patients or kiosk visitors. | G14-E-01/02/03/06; G12-E-01/02/03; G11-E-03 |
| 3 | **[SECURITY] Patients can see other patients' data.** Kiosk and portal billing fall back to other patients' unpaid invoices. Care groups, the Care Bot thread and tasks are matched by name, a hardcoded client, or a shared thread. The client Appointments and Invoices tabs match by name. | Privacy breach across three products. This is PII and likely a regulatory issue for a clinic. | G11-E-05/06; G12-E-10/18/19/27/28/36; G4-E-07/16/22; G2-E-17/19; G6-E-26; G5-E-16/17 |
| 4 | **Payments and "Paid" status can't be trusted.** The kiosk "I Have Paid" tap and the portal "Confirm & Record Payment" settle an invoice with no proof of payment. Paying an unknown invoice ID creates a fake invoice. A write-off is stored as a cash payment. Prepaid portal bookings and the invoice total can differ. | Revenue and audit risk, and the PRD's QR-pay promise cannot be met by this design. | G11-E-16/17; G12-E-16/20; G7-I-12, I-20, E-10; XM-03/06; decisions D-62–69 |
| 5 | **[SECURITY] Organisations are not isolated.** Tenants see the platform-wide audit log, including other organisations' entries and the audit actor is hardcoded. Kiosk settings, rooms, stations and Knowledge Base sources use shared global storage. Saved reports are not separated by organisation. | One tenant can see or affect another's data. | G13-E-96/95; G10-E-15; G9-E-02/13/17; G1-E-15; decisions D-42–46 |
| 6 | **[SECURITY] Biometrics and consent.** The kiosk face matcher returns the first enrolled patient at 94% when nothing matches. Consent, retention and what the lobby display may show are undecided. | Anyone can be identified as someone else. Biometric data is a high-risk category. | G11-E-01; decisions D-33–40 |
| 7 | **AI Scribe fabricates clinical content.** It never uses the microphone, and every session saves the same preset consult. In the claim builder (which no page mounts today), missing diagnosis codes are guessed from keywords and date of birth is derived from age; prescriptions are auto-filed as "Verified" with a hardcoded doctor and registration number. | False clinical and billing records. | G3-E-17/21/30 |
| 8 | **Claims can't be completed end to end.** The claim builder is not mounted anywhere. The "pre-flight checklist" is always green and every claim carries the placeholder payer ID PAY-001. "Allowed Amount" is billed × 0.85. | Real claims would be rejected, and there is no Invoice → Claim or Scribe → Claim hand-off. | G7-C-04/07/08/28, E-25; G3-X-07; `cross-module.md` journey 1 |
| 9 | **Invoice records are unreliable.** Invoice numbers are reused after a draft is deleted. Edits in the invoice and claim drawers never save. Activity history, including a fake "270/271 Eligibility Verified", is invented. | Audit trail and numbering integrity. | G7-I-08/14/28, E-06/13/14/29 |
| 10 | **Appointment integrity.** Cancelling voids the invoice even when it is paid. Staff can book unavailable slots, every staff booking is 60 minutes, and the conflict check misses overlaps and rooms. Kiosk check-in records a time only, so the appointment never becomes "Arrived". | Double bookings, lost revenue, and the PRD's "Arrived" promise is unmet. | G6-E-23/16/17/15/19/07; XM-02 |
| 11 | **Plans, credits and billing are not enforced or consistent.** Plan features, seats and credits aren't checked. Plan changes and credit top-ups apply instantly with no payment. Three billing datasets disagree and `/payments` uses different plan names and prices. | Direct revenue leakage. | G13-PLAN-04/06, SUB-07, BILL-03; G10-E-05/20/21/24/25; decisions D-54–56 |
| 12 | **Workflow and automation steps look live but aren't.** Delay, SMS, WhatsApp, email, webhook, assign-human and create-record steps can be set up but the engine has no code to run them. Several offered triggers are never emitted. Public form links and embeds point to a placeholder domain. | Users configure automation that silently does nothing. | G8-E-01/09/18/20; decisions D-110 |
| 13 | **Lead-to-care journey is broken.** A form-created client never reaches the Process boards and creates no task. Each entry point matches duplicates differently, and the website widget can merge strangers. | The core intake journey does not work as the PRD implies. | G2-E-11/14; G8-I-65/81; XM-01/04/05; `cross-module.md` journey 3 |
| 14 | **Metrics are hardcoded or inconsistent.** Overview donut, funnel and insights are fixed values, the filters do nothing, and slices sum to 573 against a centre of about 26. "Total Revenue" counts drafts and unpaid invoices, and "This Month" means the last 30 days. Many KPIs are marked "hardcoded – formula undefined". | Dashboards would mislead, and the PRD defines no formulas. | G1-E-03..06/18/20/22; G7-I-25; decisions D-01–03 |
| 15 | **Messaging compliance and safety.** SMS STOP/START, composer lock and the opt-out log are in the PRD but not built. The WhatsApp 24-hour reply window is forced open. The Care Bot has no emergency escalation. Moderator-only posting is not enforced. | Legal exposure (opt-out rules) and patient safety. | G4-S-07/08, W-06, C-07, E-09; decisions D-132/135/138 |

Ranks 1–6 are security, privacy and identity. Ranks 7–10 are clinical, billing and booking integrity. Ranks 11–15 are enforcement, automation, journey and compliance gaps.

## What to do with the PRD first

1. **Answer the 40 P0 decisions** in `decisions.md`. Many gaps can't be written into the PRD until the role model, client matching rule, status vocabularies and payment rules are decided.
2. **Fix the crossed naming** with `glossary.md`. In the app, the menu item "Process" opens `/deals` and "Workflows" opens `/process`. The PRD uses a third wording.
3. **Paste in the proposed PRD blocks.** Section D of each module file holds intended-behaviour replacements, and new files where none exist (for example booking, access and sign-in, Super Admin analytics, billing). Section D never writes a defect as a rule. Open points read "Decision needed: …".
4. **Retire or rewrite the Overview and Reports PRDs.** They describe a product that doesn't exist in the prototype.
5. **Treat section E as the prototype fix list**, separate from the PRD.

## Files

| File | What it holds |
|---|---|
| `00-summary.md` | This page |
| `gap-matrix.md` | Module × status counts, coverage, defects by severity |
| `decisions.md` | 285 open questions merged into 147 decisions by theme, with priorities and an index |
| `cross-module.md` | Four end-to-end journeys, hand-off tables, break points, new XM-01…07 findings |
| `roles-permissions.md` | Role × module matrix, prototype vs PRD, mismatches |
| `glossary.md` | Naming conflicts with a recommended term and the decisions needed |
| `modules/01…14-*.md` | Per-module map as built, map per PRD, findings, PRD-ready flows, defects, questions |

## Journey verdicts (from `cross-module.md`)

| Journey | Completes end to end? |
|---|---|
| Call → AI Receptionist → Appointment → Scribe → Invoice → Claim | **No.** Each screen works alone, but data doesn't travel between them. |
| Kiosk check-in → Appointment → Billing | **Partly, as a demo.** The staff calendar is never told the patient arrived. |
| Web form → Client → Process → Task | **No.** No process placement and no task. |
| Patient portal ↔ Appointments / Invoices | **As a demo only.** Cancel, reschedule and phone check-in are missing, and one patient can reach another's data. |

## How reliable is this

- **Method:** 14 module agents each built a map from the code, a map from the PRD, and a classified comparison. Three further agents did the cross-module pass, the roles and glossary, and the decisions list. I built the matrix and this summary.
- **Interruptions:** two usage-limit cutoffs interrupted several agents. They resumed from their saved progress, and the Settings, Reception kiosk and Chats agents had to redo helper-agent work themselves.
- **Citations:** agents opened files while writing, but not every line reference was re-checked. The Settings, Companion, Prototype-only and Workflows agents each said some line ranges are approximate. I spot-checked about 25 claims in the code across the modules and all but one held; the exception is a citation that pointed at the wrong lines. The spot-checks covered, for example:
  - invoice numbering
  - the hardcoded claim payer ID and the ×0.85 Allowed Amount
  - the hardcoded SystemAdmin role fallback
  - the hardcoded doctor registration number
  - cancelling an appointment voiding its invoice
  - the invented $78.75 invoice
  - the kiosk demo code
  - the claim builder not being mounted
  - check-in recording a time but not a status
- **Not confirmed by me:**
  - the shared "last saved" kiosk config key
  - "reopening `/onboarding` creates a second organisation"
  - "a visitor with no session becomes the first client" in the portal
  - void invoices staying payable
  - the claim that the rule engine cannot run delay, SMS and email steps (I found no handler in a text search, which is weak evidence)
- **Corrected:** the Reception kiosk report first rated kiosk check-in → appointment as a match (G11-I-39). The code shows the appointment is not updated, so it is now a Prototype defect (G11-E-42), in line with the journey trace and the Appointments report (G6-E-07). See the Corrections log below.
- **Judgement calls:** status labels such as Partial versus Missing were assigned by separate agents, so borderline cases vary. The defect severity ratings are each agent's own.
- **Prototype limits:** the prototype runs on local mock data with no backend, so some "defects" are simply places a backend is still to be built. `decisions.md` asks which of these are out of scope.


## Corrections log

_Applied 2026-11-13, after the first delivery. Each claim was re-checked in `E:\mantra-assist\src` before any edit. Paths below are relative to that `src` folder._

### 1. G11-I-39: kiosk check-in was rated "Matches"
- **What was wrong:** the Reception kiosk report said Confirm marks the appointment Arrived and calls the appointment-store check-in, and scored it Matches against `scheduled.md` § F-3.2.
- **What the code shows:**
  - The kiosk looks the appointment up only in its own copy of appointments (`reception/lib/api/mockMaClient.ts:1231`).
  - A staff-booked appointment is added to the visitor's lookup list but never saved into that copy (`:842-905`), so the lookup finds nothing and the appointment event and appointment-store check-in are skipped (`:1375-1384`).
  - A kiosk-booked appointment gets a kiosk id like `apt_<time>` (`:1146`), while the clinic store numbers its own from 101 (`lib/appointmentService.ts:651`). The call at `:1383` fails with "not found" and the empty `catch` swallows it.
  - Even when an id matches, `checkInAppointment` only sets a check-in time (`lib/appointmentService.ts:1138-1162`). Status is not changed (the type allows "checked-in", `:132`, but nothing sets it), and the stage moves only if an automation rule on appointment check-in exists.
- **Detail I left out of the new row:** the `apt_walkin_<time>` records (`mockMaClient.ts:1407-1459`) come from `checkinWalkIn`, which only the unmounted `WalkInBookingPanel` calls (G11-E-39). They are not a live path.
- **Files changed:** `modules/11-reception-kiosk.md` (C.4 row G11-I-39 → Prototype defect; G11-I-56 note; A.4 flow text; E-27 cross-reference; new row G11-E-42, High; D.4 F-3.2, acceptance F-3-2 and "Not yet built"; status summary), `cross-module.md` (wording that said "disputes"), `gap-matrix.md`, this file.
- **Arithmetic:** G11 Matches 72 → 71; defect rows 39 → 40. "checkin / scheduled": (4 + 0.5×1) ÷ 7 = 64.3% → (3 + 0.5×1) ÷ 6 = 58.3%. G11 total: (72 + 4) ÷ 103 = 73.8% → (71 + 4) ÷ 102 = 73.5%. Section E: 41 → 42 rows; High 14 → 15.

### 2. G7-E-10: prepaid portal invoice tax
- **What was wrong:** the report said the portal's own invoice line has no tax rate and gets 8%.
- **What the code shows:**
  - The portal asks the appointment service to create the invoice (`generateInvoice: true`, no line items; `app/pages/patient/PatientBookingScreen.tsx:690`).
  - The service builds a placeholder line, price 150 (`lib/appointmentService.ts:812-814`), and the invoice applies the default 8% (`lib/invoiceService.ts:640`): a total of 162 for any service.
  - Because an invoice id comes back, the portal's own price-plus-tax branch is skipped (`PatientBookingScreen.tsx:709-710`).
  - The portal then records the service's price plus tax as the payment (`:739-745`). The invoice becomes Partial if that is below 162, or Paid with an over-payment if above (`lib/invoiceService.ts:809-815`).
- **Files changed:** `modules/07-services-invoices-claims.md` (A2 bullet, C row G7-I-34, E row G7-E-10 rewritten, severity kept High, "see XM-03" added), `modules/12-companion.md` (A flow step 7 said the portal creates an invoice for the deposit/fee), `modules/06-appointments.md` (cross-reference added to G6-E-21), `cross-module.md` (note that the correction is applied). No counts changed.

### 3. G3 section A4: "Create Claim" is not a live hand-off
- **What was wrong:** A4 listed Create Claim from an appointment, with Scribe data flowing into the claim, as a live hand-off.
- **What the code shows:** no file imports `components/claims/CreateClaimDrawer.tsx`. The live Create Claim button (`app/pages/Claims.tsx:430-436`) opens `ClaimDetailDrawer` in create mode, which starts from an empty claim and imports no appointment, invoice or Scribe store.
- **Detail:** A4 has one claim row, not two. The Scribe → Claim hand-off is that row.
- **Files changed:** `modules/03-call-logs-scribe.md` (A4 row marked "Not reachable from the UI" with target "unmounted component (not reachable)"; C rows G3-X-06 → Prototype defect and G3-X-07 noted; E-30 extended with point (e) and linked to G3-X-06; D2 F-6.2, its worked example and the Client (Claims) cross-product row now say "Intended" / not yet built; new "Not yet built" bullet; status summary), `00-summary.md` (gap 7 wording), `cross-module.md`.
- **Arithmetic:** G3 hand-offs row: Missing in PRD 5 → 4, defect rows 5 → 6. G3 total: 7 ÷ 36 = 19.4% → 7 ÷ 35 = 20.0%. Section E stays at 34 rows.

### Combined effect on the headline numbers
| Measure | Before | After |
|---|---|---|
| Matches / Partial / Missing in PRD / Contradicts | 220 / 150 / 492 / 76 | 219 / 150 / 491 / 76 |
| Overall coverage | 295 ÷ 938 = 31.45% (31.4%) | 294 ÷ 936 = 31.41% (31.4%) |
| PRD-backed coverage | 293.5 ÷ 786 = 37.34% (37.3%) | 292.5 ÷ 784 = 37.31% (37.3%) |
| G11 coverage | 73.8% | 73.5% |
| G3 coverage | 19.4% | 20.0% |
| Prototype defect entries (section E) | 491 (High 158) | 492 (High 159) |

### Left as they were, for your call
- **G7-C-28** still carries the status "Missing in PRD" with the note "built but orphaned", while G3-X-06 for the same unmounted builder is now "Prototype defect". Aligning G7-C-28 would also need a new G7 section E row, and would move G7 Claims from 19.6% to 20.5% and the overall total by one item.
- **G3-E-30 severity** is still Critical. It was rated for the guessing logic, which cannot run today because the builder is unreachable; it matters once the builder is mounted.
- **Question links.** `G11-Q-09` is about early and late arrival windows, not about the appointment becoming Arrived, so F-3-2 cites `G6-Q-04` for the Arrived decision and mentions G11-Q-09 only for the arrival windows. No new question was added.
- **G11-E-27** (Medium) now overlaps G11-E-42. I added a cross-reference but kept both rows.
- **G12-E-16** and **G6-E-20** were not changed; neither repeats the old wording.
- **Row 2.4 of `cross-module.md`** says check-in automations are deleted when rules load (G8-E-11). I did not re-check that clause.
