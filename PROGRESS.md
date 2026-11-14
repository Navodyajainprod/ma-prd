# PROGRESS: as-built PRD rewrite (branch `prd-as-built`)

Resume rule: read this file, continue from the first `todo` row. Never redo `done` or `verified` rows.

Statuses: `todo` / `done` (written, committed) / `verified` (checked by the quality gate).

Build check: run `scripts/sync-mirror.ps1` (in the session scratchpad) then `npm run build` in the local build copy. `E:\ma-prd` itself cannot build (EISDIR on the E: drive).

## Judgement calls

_(append one line per ambiguous choice)_

- Super Admin screens: the 16 screens are written following the grouping proposed in analysis section D of module 13 (analytics pages in one file, billing/orders/subscriptions in one file, other screens one file each), not 16 separate files.
- `build_status` values: Works / Partly simulated / Simulated / Not built (as in the sample). The renderer accepts the older codes too.
- Status of an unmounted-but-built component is `○ Not built` (for example the claim builder, G7-C-28).

## Phases 2 and 3: rewrite existing files

| Group | File | Status |
| :--- | :--- | :--- |
| P2 Pilot | `content/client/scribe.md` | done |
| P2 Pilot | `content/client/invoices.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/avatar/ambient-presence.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/avatar/aria-stage-speech.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/avatar/kiosk-shell.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/billing/invoices.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/billing/qr-pay.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/checkin/identity-biometrics.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/checkin/phone-otp.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/checkin/scheduled.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/checkin/walk-in.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/directions/departments.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/directions/rooms.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/my-visit/biometric-consent.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/my-visit/next-step.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/my-visit/tracker.md` | todo |
| G1 AI Receptionist kiosk | `content/ai-receptionist/settings/architecture.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/settings/queue.md` | done |
| G1 AI Receptionist kiosk | `content/ai-receptionist/settings/stations.md` | done |
| G2 Chats | `content/client/chat/chat.md` | todo |
| G2 Chats | `content/client/chat/whatsapp.md` | todo |
| G2 Chats | `content/client/chat/sms.md` | todo |
| G2 Chats | `content/client/chat/website.md` | todo |
| G2 Chats | `content/client/chat/companion.md` | todo |
| G2 Chats | `content/companion/chat/chat.md` | todo |
| G3 Tasks | `content/client/tasks/my-tasks.md` | todo |
| G3 Tasks | `content/client/tasks/tasks-by-me.md` | todo |
| G3 Tasks | `content/admin/tasks.md` | todo |
| G3 Tasks | `content/companion/tasks.md` | todo |
| G4 Appointments | `content/client/appointments/availability.md` | todo |
| G4 Appointments | `content/client/appointments/calendar.md` | todo |
| G4 Appointments | `content/client/appointments/list.md` | todo |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/call-logs.md` | todo |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/processes/kanban.md` | todo |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/processes/list.md` | todo |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/clients.md` | todo |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/overview.md` | todo |
| G5 Call Logs, Process, Clients, Overview, Reports | `content/client/reports.md` | todo |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/services.md` | todo |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/claims.md` | todo |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/workflows.md` | todo |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/automation.md` | todo |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/web-forms.md` | todo |
| G6 Services, Claims, Workflows, Automation, Web Forms, Knowledge Base | `content/client/knowledge-base.md` | todo |
| G7 Client Settings | `content/client/settings/audit-logs.md` | todo |
| G7 Client Settings | `content/client/settings/billing.md` | todo |
| G7 Client Settings | `content/client/settings/custom-fields.md` | todo |
| G7 Client Settings | `content/client/settings/integrations.md` | todo |
| G7 Client Settings | `content/client/settings/organization.md` | todo |
| G7 Client Settings | `content/client/settings/reception.md` | todo |
| G7 Client Settings | `content/client/settings/security.md` | todo |
| G7 Client Settings | `content/client/settings/team.md` | todo |
| G7 Client Settings | `content/client/settings/voices.md` | todo |
| G8 Companion remaining | `content/companion/today.md` | todo |
| G8 Companion remaining | `content/companion/appointments.md` | todo |
| G8 Companion remaining | `content/companion/documents.md` | todo |
| G8 Companion remaining | `content/companion/forms.md` | todo |
| G8 Companion remaining | `content/companion/billing.md` | todo |
| G8 Companion remaining | `content/companion/pharmacy.md` | todo |
| G9 Admin remaining | `content/admin/ai-voices-models.md` | todo |
| G9 Admin remaining | `content/admin/custom-fields/fields.md` | todo |
| G9 Admin remaining | `content/admin/custom-fields/sections.md` | todo |
| G9 Admin remaining | `content/admin/document-templates.md` | todo |
| G9 Admin remaining | `content/admin/industry-category/categories.md` | todo |
| G9 Admin remaining | `content/admin/industry-category/industries.md` | todo |
| G9 Admin remaining | `content/admin/organizations.md` | todo |
| G9 Admin remaining | `content/admin/plans/actions.md` | todo |
| G9 Admin remaining | `content/admin/plans/categories.md` | todo |
| G9 Admin remaining | `content/admin/plans/plans.md` | todo |
| G9 Admin remaining | `content/admin/plans/pricing.md` | todo |
| G9 Admin remaining | `content/admin/roles.md` | todo |
| G9 Admin remaining | `content/admin/sidebar-config.md` | todo |
| G9 Admin remaining | `content/admin/users.md` | todo |

## Phase 4: new files for built screens with no PRD

_(file list is added when Phase 4 starts)_

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
