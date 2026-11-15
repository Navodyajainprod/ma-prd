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
| G9 Admin remaining | `content/admin/document-templates.md` | todo |
| G9 Admin remaining | `content/admin/industry-category/categories.md` | done |
| G9 Admin remaining | `content/admin/industry-category/industries.md` | done |
| G9 Admin remaining | `content/admin/organizations.md` | done |
| G9 Admin remaining | `content/admin/plans/actions.md` | todo |
| G9 Admin remaining | `content/admin/plans/categories.md` | todo |
| G9 Admin remaining | `content/admin/plans/plans.md` | todo |
| G9 Admin remaining | `content/admin/plans/pricing.md` | todo |
| G9 Admin remaining | `content/admin/roles.md` | done |
| G9 Admin remaining | `content/admin/sidebar-config.md` | done |
| G9 Admin remaining | `content/admin/users.md` | done |

## Drift pass (after Phase 3, before Phase 6)

| Area | Files | Status |
| :--- | :--- | :--- |
| Scribe popup | `content/client/scribe.md` | todo |
| Integrations Field Mapping | `content/client/settings/integrations.md` | done (covered in the rewrite from current code) |
| Tasks UI | `content/client/tasks/my-tasks.md`, `content/client/tasks/tasks-by-me.md`, `content/admin/tasks.md`, `content/companion/tasks.md` | todo |
| Organization availability (the changed drawer is used only by client Settings; admin Organizations is unchanged) | `content/client/settings/organization.md` | todo |

## Phase 4: new files for built screens with no PRD

| Group | File | Screen | Source | Status |
| :--- | :--- | :--- | :--- | :--- |
| 4a | `content/client/appointments/booking.md` | appointments / booking | analysis 06 D.4 | todo |
| 4a | `content/client/processes/detail-drawer.md` | processes / detail-drawer | analysis 05 D.3 | todo |
| 4a | `content/client/settings/numbers.md` | settings / numbers | analysis 10 D.9 | todo |
| 4a | `content/client/settings/notifications.md` | settings / notifications | analysis 10 D.10 | todo |
| 4a | `content/companion/access.md` | companion / access | analysis 12 D0 | todo |
| 4b | `content/client/auth/access.md` | auth / access | analysis 14 D1 | todo |
| 4b | `content/client/auth/onboarding.md` | auth / onboarding | analysis 14 D2 | todo |
| 4b | `content/client/auth/pricing-payment.md` | auth / pricing-payment | analysis 14 D3 | todo |
| 4b | `content/client/account/profile.md` | account / profile | analysis 14 D4 | todo |
| 4b | `content/client/account/refer-and-earn.md` | account / refer-and-earn | analysis 14 D5 | todo |
| 4b | `content/client/help/guide.md` | help / guide | analysis 14 D6 | todo |
| 4d | `content/admin/products-services.md` | Product / Services | analysis 13 C.16 | todo |
| 4d | `content/admin/admin-workflows.md` | Workflows (admin) | analysis 13 C.17 | todo |
| 4d | `content/admin/automations.md` | Automations (admin) | analysis 13 C.18 | todo |
| 4d | `content/admin/form-templates.md` | Forms (admin) | analysis 13 C.19 | todo |
| 4d | `content/admin/admin-knowledge-base.md` | Knowledge Base (admin) | analysis 13 C.20 | todo |
| 4e | `content/admin/workspace-billing.md` | Workspace Billing, Orders, Subscriptions | analysis 13 C.21 to C.23 | todo |
| 4e | `content/admin/product-analytics.md` | Analytics: Overview, Voice Calls, Org Usage, Process Movement, Revenue | analysis 13 C.24 to C.28 | todo |
| 4e | `content/admin/telephony.md` | Telephony | analysis 13 C.29 | todo |
| 4e | `content/admin/audit-logs.md` | Audit Logs (admin) | analysis 13 C.30 | todo |

After the files exist, add their entries to `src/lib/modulesConfig.ts` (tabs `booking`, `detail-drawer`, `numbers`, `notifications`; new client modules `auth`, `account`, `help`; companion module `access`; admin modules `products-services`, `admin-workflows`, `automations`, `form-templates`, `admin-knowledge-base`, `workspace-billing`, `product-analytics`, `telephony`, `audit-logs`). The admin ids are distinct from client/companion ids (`workflows`, `forms`, `knowledge-base`, `billing` already exist) so sidebar names stay correct. The analysis row C.31 (admin shell, cross-cutting) has no page of its own; it is covered by the Reference page Roles and access and by section 4 of each admin page.

## Phase 5: Reference module

| File | Status |
| :--- | :--- |
| `content/reference/journeys.md` | todo |
| `content/reference/roles-and-access.md` | todo |
| `content/reference/glossary.md` | todo |
| `content/reference/open-decisions.md` | todo |
| `content/reference/build-status.md` (generated by `scripts/build-status-board.mjs`) | todo |

## Phase 6: quality gate

- [ ] `scripts/lint-prd.mjs` written and passing on all content
- [ ] 25 factual claims spot-checked against the code
- [ ] Full build and HTTP fetch of every page
- [ ] `last_updated` and change logs set to 2026-11-14 in every touched file

## Commit list

_(append `hash message` after each commit)_
