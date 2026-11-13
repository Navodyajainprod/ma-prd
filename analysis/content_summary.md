# What the PRD says: content summary

_Analysed 2026-11-13. Source: the 73 Markdown files in `E:\ma-prd\content`. Counts were taken from the files with a script; descriptions of each file come from its own Module Summary and feature titles. `design.md` explains how the files are structured; this document explains what they contain and how they explain it._

You asked for `content_summry.md`. I used the corrected spelling, `content_summary.md`.

---

## 1. At a glance

| | Admin | AI Receptionist | Client | Companion | **Total** |
|---|--:|--:|--:|--:|--:|
| Files | 15 | 17 | 33 | 8 | **73** |
| Features (`F-n`) | 19 | 65 | 72 | 17 | **173** |
| Sub-features (`F-n.m` rows) | 54 | 187 | 237 | 61 | **539** |
| Jobs to be done | 19 | 77 | 91 | 23 | **210** |
| Acceptance criteria | 21 | 94 | 114 | 31 | **260** |
| Cross-product rows | 6 | 83 | 26 | 6 | **121** |
| Lines | 1,065 | 2,843 | 3,435 | 835 | **8,178** |
| Words (by whitespace; table markup inflates this) | 9,753 | 36,232 | 39,649 | 9,727 | **≈ 95,400** |

Every file has the status "In Review".

## 2. How the PRD explains a feature

Each feature is explained in the same five steps, so a reader always meets the same questions in the same order:

1. **What it does:** one paragraph of plain prose. In the longer files this is followed by a numbered breakdown (for example the kiosk's "3-card verification stack").
2. **What it includes:** a table of the parts. Every row is one visible control, rule or behaviour, with a *type* (Button, Drawer, Tabs, Guard, Rule…) and a *note* that carries the constraint ("Debounced 200ms input", "Validates duplicate phone").
3. **Worked example:** a situation, what the user does, and the bold result. It shows the feature in use, with named people such as Sarah Johnson.
4. **Jobs to be done:** "When …, I want …, so that …", written for a named persona.
5. **Acceptance criteria:** testable statements. The longer files use *Given … when … then …* and **MUST**.

A reader can therefore get the gist from "What it does", the scope from "What it includes", and the pass/fail test from the last table. Section 3 of each file repeats the features and jobs as two roll-up tables.

**Style of explanation**

- It describes the system as if it already exists ("The kiosk summarizes…"), in present tense.
- It names screens and controls exactly as they are labelled on screen, in bold ("**Confirm check-in & Print Token**") and gives routes and formulas in backticks (`/reception/appointment`, `max(5, (waiting + 1) * 10)`).
- It gives concrete numbers where it has them: debounce times, wait formulas, token prefixes (`D-`, `P-`, `L-`, `B-`, `R-`), 24-hour windows, 60-second privacy reset.
- It explains **behaviour and outcome**. No file has a data-model, API or error-code section.

**Who the PRD is written for.** 210 jobs name **123 different personas**. The most common are Patient (19), Practice Administrator (13), Practice Manager (10), Care Coordinator (7), Practice Coordinator (5), Medical Assistant (5), Front Desk Staff (4), Clinic Administrator (4), Clinician (4) and Physician (4). Several names mean overlapping roles, which the roles file in this folder (`roles-permissions.md`) takes up.

## 3. Two depths of content

The 73 files fall into two clear groups:

| | **Generated baseline** | **Expanded** |
|---|--:|--:|
| Files | 45 | 28 |
| Average length | 70 lines, about 630 words | 179 lines, about 2,390 words |
| Features per file | 1.3 (32 files have only one feature) | 4.1 |
| Sub-features per feature | 2.8 | 3.3 |
| Jobs / criteria per feature | 1 / 1 | 1.3 / 1.8 |
| Cross-product summary | 7 of 45 files | all 28 files |
| Share of all words | 30% | 70% |

- **Generated baseline:** written by script (see `design.md` §7). They are short, one-feature documents that share two identical Module Summary bullets. They describe the headline capability of each screen.
- **Expanded:** hand-written, mostly on 2026-11-12 (the Chats files date from 2026-11-10). They cover 3 to 6 features each with real flows, formulas, routes and cross-product links.

By product:

| Product | Generated baseline | Expanded |
|---|--:|--:|
| Admin | 14 | 1 (Tasks) |
| AI Receptionist | 0 | 17 (all) |
| Client | 25 | 8 (five Chats files, two Tasks files, AI Receptionist settings) |
| Companion | 6 | 2 (Chat, Tasks) |

**Depth follows where the authors spent recent effort, not the size of the product.** The AI Receptionist kiosk alone holds 38% of the words (36,232 of 95,361). The Admin console, which configures plans, roles, fields and templates for the other products, holds 10% and is almost entirely one feature per screen.

## 4. What each product documents

### 4.1 Client (33 files): the clinic staff workspace

The largest product. It documents the daily workspace in four sidebar groups: workspace tools, revenue and insights, customisations, and settings. Depth is split: five Chats files, two Tasks files and the AI Receptionist settings are expanded; the other 25 are baselines of one to three features.

| File (under `content/client/`) | What it explains | F | Depth |
|---|---|--:|---|
| `overview.md` | Dashboard: daily appointment triage counters and a real-time multi-channel activity feed | 2 | Generated |
| `clients.md` | Patient and contact directory with search and categories; profile drawer with encounter timeline | 2 | Generated |
| `call-logs.md` | Inbound and outbound call log; audio player with dual-speaker AI transcript | 2 | Generated |
| `chat/chat.md` | Unified omnichannel inbox, care groups, replies, attachments, delivery receipts (**not shown in the app**, see `design.md` §3.5) | 5 | Expanded |
| `chat/whatsapp.md` | WhatsApp threads, the 24-hour service window, approved message templates, topbar controls | 4 | Expanded |
| `chat/sms.md` | SMS threads, 10DLC compliance and opt-out handling, character-segment and cost calculator | 4 | Expanded |
| `chat/website.md` | Website widget threads, process-driven AI first responder, pre-chat form mapped to workflows, responsible-person routing | 5 | Expanded |
| `chat/companion.md` | Companion channel: care group creation, process-driven care bot, settings drawer, media and quoting, composer controls | 5 | Expanded |
| `processes/kanban.md` | Drag-and-drop stage board with deal cards and value forecasts | 2 | Generated |
| `processes/list.md` | Process-instance table with SLA countdown | 1 | Generated |
| `tasks/my-tasks.md` | Assigned-work inbox, assignee rules, task detail with progress ring, overdue monitoring | 4 | Expanded |
| `tasks/tasks-by-me.md` | Delegated task pipeline, two-step creation wizard, completion breakdown, sharing | 3 | Expanded |
| `appointments/calendar.md` | Multi-provider day, week and month calendar; room allocation; drag-and-drop rescheduling | 3 | Generated |
| `appointments/list.md` | Filterable appointments table with status badges and a check-in action | 2 | Generated |
| `appointments/availability.md` | Weekly working hours, buffers between visits, days off | 2 | Generated |
| `scribe.md` | Ambient consultation recording and structured SOAP note generation | 2 | Generated |
| `services.md` | Services catalogue and fee schedule | 1 | Generated |
| `invoices.md` | Invoice ledger and payment status tracking | 1 | Generated |
| `claims.md` | Electronic claim generation and diagnosis-code mapping | 1 | Generated |
| `reports.md` | Revenue-cycle and accounts-receivable aging reports | 1 | Generated |
| `workflows.md` | Node-canvas workflow designer (trigger, condition, action) | 1 | Generated |
| `automation.md` | Global automation rule registry and execution log | 1 | Generated |
| `knowledge-base.md` | Protocol repository and semantic search used by the AI bot | 1 | Generated |
| `web-forms.md` | Intake form builder with a shareable public URL | 1 | Generated |
| `settings/organization.md` | Practice legal profile, branding, multi-location registry | 2 | Generated |
| `settings/team.md` | Staff roster, invitations, role assignment, practitioner NPI and licence registry | 2 | Generated |
| `settings/billing.md` | Subscription tier and add-on credit balances | 1 | Generated |
| `settings/voices.md` | LLM model binding with safety guardrails; voice selection and speed | 2 | Generated |
| `settings/custom-fields.md` | Entity field builder for specialty attributes | 1 | Generated |
| `settings/integrations.md` | Telephony and WhatsApp credentials | 1 | Generated |
| `settings/audit-logs.md` | Immutable event ledger and access trail | 1 | Generated |
| `settings/security.md` | Two-factor enforcement and session timeout | 1 | Generated |
| `settings/reception.md` | AI Receptionist settings: topbar, clinic persona, kiosk features, queue and onboarding rules, terminals, unified rooms table | 5 | Expanded |

### 4.2 AI Receptionist (17 files): the lobby kiosk

Entirely expanded and the best-connected product: every file has a Cross-product Summary, and 14 of 17 use *Given … when … then …* criteria. It follows a visitor through the lobby, then the clinic-side settings that drive it. "Aria" is the kiosk's voice avatar.

| File (under `content/ai-receptionist/`) | What it explains | F |
|---|---|--:|
| `avatar/ambient-presence.md` | Lobby home screen, passive greeting with privacy notice, five-phase welcome sequence, quick actions, installer diagnostic mode | 5 |
| `avatar/aria-stage-speech.md` | Lip-sync stage, six-state status glow, noise-filtered speech capture (English and Hindi), intent routing, voice commands | 5 |
| `avatar/kiosk-shell.md` | 50/50 split screen, step progress, floating dock, language switch, 60-second privacy reset, Call Staff, feedback | 5 |
| `checkin/identity-biometrics.md` | Face scan with coaching, countdown and matching, three-attempt phone fallback, name-only confirmation | 4 |
| `checkin/phone-otp.md` | Phone keypad, 4-digit OTP with 5-minute validity, household member picker, routing | 4 |
| `checkin/scheduled.md` | Today's appointment lookup, 3-card visit summary, duplicate-safe confirmation, token screen | 3 |
| `checkin/walk-in.md` | Walk-in registration with voice dictation, minor handling, optional face enrolment, service and clinician booking | 4 |
| `directions/departments.md` | Zone and department directory driven by clinic room settings | 3 |
| `directions/rooms.md` | Voice deep-linking to a room, large-print walking directions, context-aware back navigation | 3 |
| `my-visit/tracker.md` | Visit lookup, live queue position, people ahead, estimated wait, multi-station hand-offs | 4 |
| `my-visit/next-step.md` | "What's next?" discovery and patient-friendly process stage guidance | 3 |
| `my-visit/biometric-consent.md` | Lobby camera privacy rules, opt-in and skip, minor safeguards, staff removal of face data | 4 |
| `billing/invoices.md` | Phone and OTP billing gate, ledger, partial payments, empty "All Bills Clear" state | 4 |
| `billing/qr-pay.md` | Touchless QR payment card, wallet badges, payment link, instant ledger settlement | 3 |
| `settings/stations.md` | Clinic rooms and desks directory, station visibility, stage guidance card composer | 3 |
| `settings/queue.md` | Token prefixes, late-arrival window, anti-starvation aging cap, default onboarding process | 4 |
| `settings/architecture.md` | Live sync with clinic systems, 24-hour duplicate protection, queue progress, privacy reset and hardware resilience | 4 |

### 4.3 Companion (8 files): the patient portal

Mostly baseline. Six files are one-feature descriptions of what a patient sees; the two expanded files are Tasks and Chat.

| File (under `content/companion/`) | What it explains | F | Depth |
|---|---|--:|---|
| `today.md` | Visit-day agenda: appointment card, doctor ETA, live queue position and current serving ticket | 2 | Generated |
| `appointments.md` | Self-service booking, rescheduling and visit history | 1 | Generated |
| `tasks.md` | My Tasks hub, deliverable execution with live clinic sync, multimedia resources, privacy scoping and corporate-admin firewall | 4 | Expanded |
| `documents.md` | Lab reports and records with in-app preview | 1 | Generated |
| `forms.md` | Mobile intake forms and signature pad | 1 | Generated |
| `billing.md` | Outstanding copays and digital checkout | 1 | Generated |
| `pharmacy.md` | Active medication schedule and refill requests | 1 | Generated |
| `chat/chat.md` | Three-channel chat: care bot, direct clinician, care groups; replies, media, group information and leave | 6 | Expanded |

### 4.4 Admin (15 files): the platform console

Mostly baseline: 14 of 15 files describe one feature each, about 500 words. Only Tasks is expanded. Only two files have a Cross-product Summary.

| File (under `content/admin/`) | What it explains | F | Depth |
|---|---|--:|---|
| `organizations.md` | Multi-tenant clinic accounts: workspace provisioning, storage quotas, industry blueprint, subscription status | 1 | Generated |
| `users.md` | Platform super-admin accounts, enterprise single sign-on, session revocation | 1 | Generated |
| `roles.md` | Role-based access matrix (read, add, edit, delete, export, import), custom roles, export gate | 1 | Generated |
| `sidebar-config.md` | Navigation layout editor, module visibility, feature flags | 1 | Generated |
| `ai-voices-models.md` | Registry of language-model endpoints, token consumption, voice models | 1 | Generated |
| `document-templates.md` | Master clinical document templates (referral letters, discharge summaries, consent forms) | 1 | Generated |
| `custom-fields/fields.md` | Global clinical data dictionary, field types, validation | 1 | Generated |
| `custom-fields/sections.md` | Section containers, accordion order, role-based visibility | 1 | Generated |
| `industry-category/categories.md` | Top-level healthcare categories | 1 | Generated |
| `industry-category/industries.md` | Vertical industry blueprints (dental, dermatology, mental health, paediatrics) | 1 | Generated |
| `plans/plans.md` | Subscription tiers: pricing, seats, credits, feature gates | 1 | Generated |
| `plans/categories.md` | Commercial plan packaging categories | 1 | Generated |
| `plans/pricing.md` | Credit bundles, seat packs, country rate cards for telephony and SMS | 2 | Generated |
| `plans/actions.md` | Credit consumption rules per action (voice minute, SMS segment, scribe minute, model query) | 1 | Generated |
| `tasks.md` | Corporate tasks across organisations: two-step composer, per-person tracking, visibility boundaries and patient-portal firewall | 4 | Expanded |

## 5. How the products connect

The Cross-product Summary is the PRD's way of saying "this behaviour also appears elsewhere". The 121 rows split like this (from the file that holds the row, to the product it points at):

| From ↓ / To → | Client | Companion | AI Receptionist | Admin | Same product | Rows |
|---|--:|--:|--:|--:|--:|--:|
| Admin (2 of 15 files) | 3 | 1 | – | – | 2 | 6 |
| AI Receptionist (17 of 17) | 59 | 17 | – | 3 | 4 | 83 |
| Client (13 of 33) | – | 11 | 6 | 2 | 7 | 26 |
| Companion (3 of 8) | 3 | – | – | 1 | 2 | 6 |

All 121 links resolve to a file.

What the rows describe (recurring themes):

- **Arrival and appointments:** a kiosk check-in is meant to switch the calendar slot to Arrived and show the token (Client appointments).
- **Patient record and audit:** kiosk events are meant to appear on the patient timeline and audit history.
- **Billing:** invoice ledger and payment settlement shared between kiosk, Companion and Client invoices.
- **Process stages:** stage names and guidance written once in Client Process settings and shown on the kiosk and in Companion.
- **Tasks:** an Admin task delegated down to Client staff and mirrored to Companion, with a firewall that keeps admin tasks away from patients.
- **Chat:** care groups created in Client Chats appear in the patient's Companion chat.

**Where the links are thin.**

- The kiosk points at Client 59 times, but Client points back at the kiosk only 6 times. The Client side rarely records what the kiosk does to it.
- Admin configures plans, roles, fields and templates for the other products, but only 4 of its 6 rows point at another product (3 Client, 1 Companion), and they sit in 2 of its 15 files.

## 6. What is deep and what is thin

| Topic | Depth | Why |
|---|---|---|
| Lobby kiosk (check-in, wayfinding, visit tracking, payment, settings) | Deep: 17 files, 65 features | All expanded on 2026-11-12 |
| Chat channels and care groups | Deep: 6 files across Client and Companion | Hand-written from the start |
| Tasks across Admin, Client and Companion | Deep: 4 files | Expanded on 2026-11-12 |
| Client AI Receptionist settings | Deep: 5 features | Expanded on 2026-11-12 |
| Appointments (calendar, list, availability) | Medium: 3 files, 7 features | Generated but longer than most |
| Clinic workspace: overview, clients, calls, scribe, process board | Light: 1 to 2 features per file | Generated baseline |
| Revenue: services, invoices, claims, reports | Light: 1 feature each, about 500 words | Generated baseline |
| Customisation: workflows, automation, knowledge base, web forms | Light: 1 feature each | Generated baseline |
| Client settings (eight tabs) | Light: 1 to 2 features each | Generated baseline |
| Admin console (14 files) | Light: 1 feature each | Generated baseline |
| Companion apart from Tasks and Chat | Light: 1 to 2 features each | Generated baseline |

## 7. What the PRD does not contain

These are properties of the template and of what the authors wrote, counted from the headings and files:

- **No section** for roles and permissions, error and empty states, metrics and their formulas, data model, non-functional requirements, or open questions. Where a file mentions one, it does so inside a feature.
- **No explicit status of any item** (approved, in progress, built or not built). All 73 files say "In Review".
- **No ownership or sign-off in the Markdown files**: no authors, approvers or version numbers (only a status and two dates). The app's separate change-log page does name an author for each entry.
- **Generated files have one job and one criterion per feature**, so they can say only a little about what "done" means.
- **The PRD describes the prototype's design source**, not its running behaviour. The gap analysis in this folder (`00-summary.md`, `gap-matrix.md`) measured the consequence: about 52% of the items compared were built in the prototype but not described in the PRD, and the Overview and Reports files describe features the prototype does not have.

## 8. Terms as the PRD uses them

| Term | Meaning in the PRD |
|---|---|
| Product | One of the four surfaces: Client, Admin, Companion, AI Receptionist |
| Module / tab | A sidebar entry / a sub-page of one |
| Process | A clinical workflow with stages, shown as a Kanban board or a list ("Process & Deals") |
| Stage | One step of a Process; its patient-facing text is also shown on the kiosk and in Companion |
| Care Group | A chat with clinic staff and one or more patient contacts, created in the Companion channel |
| Companion | The patient portal, and also a chat channel inside Client Chats |
| Aria | The kiosk's talking avatar |
| Token | A numbered queue ticket with a configurable letter prefix (`D-`, `P-`, `L-`, `B-`, `R-`) |
| Station | A clinic room or desk set up in reception settings and used by the kiosk |
| Credits | Wallet balance spent by AI voice minutes, SMS segments, scribe minutes and model queries |
| Cross-product Summary | A table of effects this module has in other products |

Naming conflicts between these terms and the prototype are listed in `glossary.md`.

## 9. Where to find things

| If you need… | Read |
|---|---|
| How a visitor is identified and checked in at the kiosk | `ai-receptionist/checkin/*` (4 files) and `avatar/*` |
| How a patient pays at the kiosk | `ai-receptionist/billing/invoices.md`, `qr-pay.md`, and `companion/billing.md` |
| What reception settings control | `client/settings/reception.md` and `ai-receptionist/settings/*` |
| How messages reach a patient | `client/chat/*` (WhatsApp, SMS, Website, Companion) and `companion/chat/chat.md` |
| How tasks move between admin, staff and patients | `admin/tasks.md`, `client/tasks/*`, `companion/tasks.md` |
| How plans, credits and pricing are set up | `admin/plans/*` and `client/settings/billing.md` |
| What the clinic can configure for the AI | `client/settings/voices.md`, `client/knowledge-base.md`, `admin/ai-voices-models.md` |
| Appointment scheduling rules | `client/appointments/*` and `companion/appointments.md` |
| The unified inbox document that the app does not show | `client/chat/chat.md` |
