# PROGRESS: as-built PRD rewrite (branch `prd-as-built`)

Resume rule: read this file, continue from the first `todo` row. Never redo `done` or `verified` rows.

Statuses: `todo` / `done` (written, committed) / `verified` (checked by the quality gate).

Build check: run `scripts/sync-mirror.ps1` (in the session scratchpad) then `npm run build` in the local build copy. `E:\ma-prd` itself cannot build (EISDIR on the E: drive).

## Judgement calls

_(append one line per ambiguous choice)_

- `build_status` override: a page whose central behaviour is simulated or not built cannot be `Works` (identity-biometrics set to `Partly simulated` although 80% of rows are ●).
- Roles sections cite the decision that fits the module (for example D-15 money actions, D-41/D-46/D-35 kiosk), not D-14 (clinical/Scribe).
- Persona mapping: Nurse, Medical Assistant, Privacy/Compliance Officer, Clinic Auditor map to the nearest standard persona (Care Coordinator or Practice Admin); no new roles.
- The story cast (Dr. Anita Rao, Meera Iyer, Priya Nair, Daniel Brooks, Asha Verma, Rohan Mehta, Sarah Johnson, Leo Martin) is a narrative device, not a claim about the prototype.

- Super Admin screens: the 16 screens are written following the grouping proposed in analysis section D of module 13 (analytics pages in one file, billing/orders/subscriptions in one file, other screens one file each), not 16 separate files.
- `build_status` values: Works / Partly simulated / Simulated / Not built (as in the sample). The renderer accepts the older codes too.
- Status of an unmounted-but-built component is `○ Not built` (for example the claim builder, G7-C-28).

## Drift: things that changed after the analysis (read this before trusting the analysis files)

- **The prototype changed on 2026-11-13 and 2026-11-14**, after the analysis was written (read-only check of `E:\mantra-assist` git log). Affected areas and commits:
  - **AI Scribe popup** (`AIScribePopup.tsx`, `TranscriptDetailDrawer.tsx`, `AppointmentDetailDrawer.tsx`): confirm step removed, saves and closes with a toast, step 2 streamlined with a Save button, transcript detail became a slide-over drawer, appointment and contact prefilled (commits 346cd37, 333c04d, 2da69c8, 0327513). The golden sample `content/client/scribe.md` describes the older flow.
  - **Integrations** (`IntegrationConfigDrawer.tsx`, `integrationsRegistry.ts`): new Field Mapping tab (13d3b22, 0c9e6ed, c77dce1). Affects `settings/integrations.md`.
  - **Tasks** (`TaskQuickCreateDrawer.tsx` rewritten, `Tasks.tsx`): new task UI on 11-13, workflow pipeline hidden in admin and the All Workflows filter removed (1c870bd, b444132, fa5ead5). Affects the four tasks pages.
  - **Organization availability** (`OrganizationDetailDrawer.tsx`, +1029 lines, a8d74f0). Affects admin `organizations.md` and possibly client `organization.md` and appointments availability.
- **The user is editing PRD pages on `main` in parallel** (commits 886f345, a7bb61e, f77704e, 2656e8e): Scribe, WhatsApp, Workflows, Integrations, Tasks. Files changed on both `main` and this branch (merge will conflict): `content/client/scribe.md`, `content/client/chat/whatsapp.md` (the user already ported theirs onto this branch as 221da33), `content/client/settings/integrations.md`, `content/client/workflows.md`, `content/client/tasks/tasks-by-me.md`, `content/admin/tasks.md`. This branch is NOT merged with `main`.
- **Plan:** finish the rollout from the analysis, then run a **drift pass**: for each area above, re-read the changed code and update the affected pages (code is the truth; the user's `main` edits are used as hints only, every fact is verified in code).

## Phases 2 and 3: rewrite existing files

| Group | File | Status |
| :--- | :--- | :--- |
| P2 Pilot | `content/client/scribe.md` | done |
| P2 Pilot | `content/client/invoices.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/avatar/ambient-presence.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/avatar/aria-stage-speech.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/avatar/kiosk-shell.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/billing/invoices.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/billing/qr-pay.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/checkin/identity-biometrics.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/checkin/phone-otp.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/checkin/scheduled.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/checkin/walk-in.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/directions/departments.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/directions/rooms.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/my-visit/biometric-consent.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/my-visit/next-step.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/my-visit/tracker.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/settings/architecture.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/settings/queue.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/settings/stations.md` | done |
| G2 Chats | `content/client/chat/chat.md` | done |
| G2 Chats | `content/client/chat/whatsapp.md` | done |
| G2 Chats | `content/client/chat/sms.md` | done |
| G2 Chats | `content/client/chat/website.md` | done |
| G2 Chats | `content/client/chat/companion.md` | done |
| G2 Chats | `content/companion/chat/chat.md` | done |
| G3 Tasks | `content/client/tasks/my-tasks.md` | done |
| G3 Tasks | `content/client/tasks/tasks-by-me.md` | done |
| G3 Tasks | `content/admin/tasks.md` | done |
| G3 Tasks | `content/companion/tasks.md` | done |
| G4 Appointments | `content/client/appointments/availability.md` | done |
| G4 Appointments | `content/client/appointments/calendar.md` | done |
| G4 Appointments | `content/client/appointments/list.md` | done |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/call-logs.md` | done |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/processes/kanban.md` | done |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/processes/list.md` | done |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/clients.md` | done |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/overview.md` | done |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/reports.md` | done |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/services.md` | done |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/claims.md` | done |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/workflows.md` | done |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/automation.md` | done |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/web-forms.md` | done |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/knowledge-base.md` | done |
| G7 Client Settings | `content/client/settings/audit-logs.md` | done |
| G7 Client Settings | `content/client/settings/billing.md` | done |
| G7 Client Settings | `content/client/settings/custom-fields.md` | done |
| G7 Client Settings | `content/client/settings/integrations.md` | done |
| G7 Client Settings | `content/client/settings/organization.md` | done |
| G7 Client Settings | `content/client/settings/reception.md` | done |
| G7 Client Settings | `content/client/settings/security.md` | done |
| G7 Client Settings | `content/client/settings/team.md` | done |
| G7 Client Settings | `content/client/settings/voices.md` | done |
| G8 Companion remaining | `content/companion/today.md` | done |
| G8 Companion remaining | `content/companion/appointments.md` | done |
| G8 Companion remaining | `content/companion/documents.md` | done |
| G8 Companion remaining | `content/companion/forms.md` | done |
| G8 Companion remaining | `content/companion/billing.md` | done |
| G8 Companion remaining | `content/companion/pharmacy.md` | done |
| G9 Admin remaining | `content/admin/ai-voices-models.md` | done |
| G9 Admin remaining | `content/admin/custom-fields/fields.md` | done |
| G9 Admin remaining | `content/admin/custom-fields/sections.md` | done |
| G9 Admin remaining | `content/admin/document-templates.md` | done |
| G9 Admin remaining | `content/admin/industry-category/categories.md` | done |
| G9 Admin remaining | `content/admin/industry-category/industries.md` | done |
| G9 Admin remaining | `content/admin/organizations.md` | done |
| G9 Admin remaining | `content/admin/plans/actions.md` | done |
| G9 Admin remaining | `content/admin/plans/categories.md` | done |
| G9 Admin remaining | `content/admin/plans/plans.md` | done |
| G9 Admin remaining | `content/admin/plans/pricing.md` | done |
| G9 Admin remaining | `content/admin/roles.md` | done |
| G9 Admin remaining | `content/admin/sidebar-config.md` | done |
| G9 Admin remaining | `content/admin/users.md` | done |

## Drift pass (after Phase 3, before Phase 6)

| Area | Files | Status |
| :--- | :--- | :--- |
| Scribe popup | `content/client/scribe.md` | done |
| Integrations Field Mapping | `content/client/settings/integrations.md` | done (covered in the rewrite from current code) |
| Tasks UI | `content/client/tasks/my-tasks.md`, `content/client/tasks/tasks-by-me.md`, `content/admin/tasks.md`, `content/companion/tasks.md` | done |
| WhatsApp number allocation (user edit 221da33 / main 2656e8e: Embedded Signup, workflow-attached numbers; marks not yet checked in code) | `content/client/chat/whatsapp.md` | done |
| Organization availability (the changed drawer is used only by client Settings; admin Organizations is unchanged) | `content/client/settings/organization.md` | done |

## Phase 4: new files for built screens with no PRD

| Group | File | Screen | Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| 4a | `content/client/appointments/booking.md` | appointments / booking | analysis 06 D.4 | done |
| 4a | `content/client/processes/detail-drawer.md` | processes / detail-drawer | analysis 05 D.3 | done |
| 4a | `content/client/settings/numbers.md` | settings / numbers | analysis 10 D.9 | done |
| 4a | `content/client/settings/notifications.md` | settings / notifications | analysis 10 D.10 | done |
| 4a | `content/companion/access.md` | companion / access | analysis 12 D0 | done |
| 4b | `content/client/auth/access.md` | auth / access | analysis 14 D1 | done |
| 4b | `content/client/auth/onboarding.md` | auth / onboarding | analysis 14 D2 | done |
| 4b | `content/client/auth/pricing-payment.md` | auth / pricing-payment | analysis 14 D3 | done |
| 4b | `content/client/account/profile.md` | account / profile | analysis 14 D4 | done |
| 4b | `content/client/account/refer-and-earn.md` | account / refer-and-earn | analysis 14 D5 | done |
| 4b | `content/client/help/guide.md` | help / guide | analysis 14 D6 | done |
| 4d | `content/admin/products-services.md` | Product / Services | analysis 13 C.16 | done |
| 4d | `content/admin/admin-workflows.md` | Workflows (admin) | analysis 13 C.17 | done |
| 4d | `content/admin/automations.md` | Automations (admin) | analysis 13 C.18 | done |
| 4d | `content/admin/form-templates.md` | Forms (admin) | analysis 13 C.19 | done |
| 4d | `content/admin/admin-knowledge-base.md` | Knowledge Base (admin) | analysis 13 C.20 | done |
| 4e | `content/admin/workspace-billing.md` | Workspace Billing, Orders, Subscriptions | analysis 13 C.21 to C.23 | done |
| 4e | `content/admin/product-analytics.md` | Analytics: Overview, Voice Calls, Org Usage, Process Movement, Revenue | analysis 13 C.24 to C.28 | done |
| 4e | `content/admin/telephony.md` | Telephony | analysis 13 C.29 | done |
| 4e | `content/admin/audit-logs.md` | Audit Logs (admin) | analysis 13 C.30 | done |

After the files exist, add their entries to `src/lib/modulesConfig.ts` (tabs `booking`, `detail-drawer`, `numbers`, `notifications`; new client modules `auth`, `account`, `help`; companion module `access`; admin modules `products-services`, `admin-workflows`, `automations`, `form-templates`, `admin-knowledge-base`, `workspace-billing`, `product-analytics`, `telephony`, `audit-logs`). The admin ids are distinct from client/companion ids (`workflows`, `forms`, `knowledge-base`, `billing` already exist) so sidebar names stay correct. The analysis row C.31 (admin shell, cross-cutting) has no page of its own; it is covered by the Reference page Roles and access and by section 4 of each admin page.

## Phase 5: Reference module

| File | Status |
| :--- | :--- |
| `content/reference/journeys.md` | done |
| `content/reference/roles-and-access.md` | done |
| `content/reference/glossary.md` | done |
| `content/reference/open-decisions.md` | done |
| `content/reference/build-status.md` (generated by `scripts/build-status-board.mjs`) | done |

## Phase 6: quality gate

- [x] `scripts/lint-prd.mjs` written and passing on all content (98 files, 0 problems)
- [x] 25 factual claims spot-checked against the code (see the spot-check log below)
- [x] Full build (local copy) and HTTP fetch of every page: 139 URLs, all return a page; `/` is the original redirect to `/client/overview`
- [x] `last_updated` is 2026-11-14 in all 98 files and equals the newest change-log date (lint enforces it)

## Commit list

_(append `hash message` after each commit)_

## More judgement calls (added during the run)

- Cross-cutting admin shell (analysis row C.31) has no page of its own; it is covered by Reference > Roles and access and by section 4 of each admin page.
- Jobs may be written "I want ..., so that ..." as well as "<When ...>, I want ..., so that ..."; the lint accepts both.
- "How real is it" counts follow one rule (a feature works if every row is Works, is not built if every row is Not built, else partly simulated); the lint enforces it. Most features are "partly simulated" because almost every feature has at least one simulated or not-built row.
- The Reports page text was returned by its subagent as plain text because a tool guard blocks subagents from writing files with "report" in the name; the orchestrator wrote it.
- `content/client/chat/whatsapp.md` contains the user's own edits from commit 221da33; their wording is kept, personas mapped to the standard list, and marks corrected against the code.
- The prototype changed on 2026-11-13/14 after the analysis; five drift passes re-read the current code (Scribe, Tasks, Organization, WhatsApp numbers, Integrations Field Mapping). Other pages still rest on the analysis of 2026-11-12/13.
- `main` has parallel PRD edits for Scribe, WhatsApp, Workflows, Integrations and Tasks that this branch does not contain.

## Spot-check log (28 claims, verified in `E:\mantra-assist\src`)

| # | Claim in the PRD | Where in the code | Result |
| :--- | :--- | :--- | :--- |
| 1 | Invoice number is 1050 + number of invoices (invoices page) | `lib/invoiceService.ts:646` | Pass |
| 2 | Every claim carries payer ID PAY-001 (claims page) | `app/components/claims/ClaimDetailDrawer.tsx:582` | Pass |
| 3 | Claim "Allowed Amount" is billed x 0.85 (claims page) | `ClaimDetailDrawer.tsx:364, 914, 930` | Pass |
| 4 | Prescription carries fixed doctor registration MC-89421 (Scribe) | `lib/scribeSessionStore.ts:339, 733` | Pass |
| 5 | Kiosk accepts OTP 1234 or 0000 for any number (kiosk phone-otp) | `reception/lib/api/mockMaClient.ts:652-653` | Pass |
| 6 | Portal bill screen invents a 78.75 invoice (Companion billing) | `app/pages/patient/PatientBillScreen.tsx:81` | Pass |
| 7 | Role defaults to SystemAdmin (Roles and access) | `app/context/AuthContext.tsx:28, 43` | Pass |
| 8 | Action-level admin permission check is never called (admin roles) | only its definition, `lib/adminRolesStore.ts:202` | Pass |
| 9 | Staff bookings are saved as 60 minutes (booking) | `app/pages/Appointments.tsx:873` passes no duration; `lib/appointmentService.ts:736` defaults to 60 | Pass |
| 10 | Cancelling voids the linked invoice (booking) | `lib/appointmentService.ts:960, 964` | Pass |
| 11 | Kiosk invoice lookup falls back to other unpaid invoices (kiosk invoices) | `reception/lib/api/mockMaClient.ts:1765` | Pass |
| 12 | Kiosk settings fall back to the shared "last saved" key (kiosk settings) | confirmed in code by the settings agent (`receptionSettingsStore`) | Pass |
| 13 | Check-in automation rules are deleted when rules load (Automation) | `lib/useAutomationStore.ts` filter on `client.checked_in` (about lines 388-392) | Pass |
| 14 | Web form public link points to a fixed external address and no public form page exists (Web Forms) | `app/pages/WebForms.tsx:526` (`app.myaifrontdesk.com/forms/...`); `routes.tsx:239` redirects `forms/:id` | Partial: the page said "placeholder domain with nothing behind it"; reworded to what the code shows |
| 15 | No SMS STOP/START handling (SMS) | only a placeholder text at `app/pages/Chats.tsx:3397` | Pass (absence) |
| 16 | WhatsApp 24-hour window is computed but hard-wired open (WhatsApp) | `lib/useConversations.ts:1171` (`computeSessionWindow`, `freeFormAllowed: true`) | Pass (my first search missed it; the drift agent found it) |
| 17 | Portal shows groups containing client CL-001 (patient chat) | `app/pages/patient/PatientMessagesScreen.tsx:133, 228` | Pass |
| 18 | "Assigned to me" matches names like "alistair" and "lead physician" (Tasks) | `app/pages/Tasks.tsx:142-143, 149` | Pass |
| 19 | Audit actor is hardcoded "Alexander Vance" (admin audit logs) | `app/pages/admin/AdminUserManagement.tsx:80, 250` | Pass |
| 20 | Client Settings Audit Logs tab renders the admin audit log (client audit logs) | `app/pages/Settings.tsx:7764` | Pass |
| 21 | Services Active toggle handler is defined but never used (Services) | `app/pages/Services.tsx:342`, no other reference | Pass |
| 22 | Login only checks email format, a non-empty password and a suspended org (sign-in) | `app/pages/auth/Login.tsx:57-115` | Pass |
| 23 | Reopening /onboarding after completion creates a new organisation (onboarding) | confirmed in code by the 4b agent (`initializeFreshSignupWorkspace`, id `org_` + Date.now()) | Pass |
| 24 | Refer and Earn uses one fixed referral code (refer and earn) | `app/pages/ReferAndEarn.tsx:85` (`MANTRA-ALEX2026`) | Pass |
| 25 | /payments plans cost 10 / 49 per user (Settings billing) | `app/pages/Payments.tsx:72, 92` | Pass |
| 26 | Kiosk resets after 60 seconds of inactivity (kiosk shell) | `reception/avatar/AvatarReceptionView.tsx:125` | Pass |
| 27 | WhatsApp "Request approval" sets Approved at once (WhatsApp) | `app/components/chats/RequestTemplateApprovalModal.tsx:51` | Pass |
| 28 | Organization drawer Save Changes throws (Organization) | `app/components/settings/OrganizationDetailDrawer.tsx:815` uses `selectedLocation`, declared nowhere | Pass |

Result: 27 pass, 1 partial (fixed). Checks 12 and 23 were done by the page's own agent re-reading the code; the other 26 by the orchestrator. Two analysis claims were found wrong or out of date while checking: location delete does ask for confirmation (analysis said it did not), and a visitor with no session does not simply become the first client.
