---
title: "Build status board"
product: "reference"
module: "reference"
channel: "build-status"
status: "In Review"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | REFERENCE |
| Module | BUILD STATUS BOARD |
| Status | In Review |
| Generated | by `scripts/build-status-board.mjs` from the status marks in every PRD page |
| Last updated | 2026-11-14 |

## 1. How to read this board

Every row in a feature's "What it includes" table carries one mark. This board counts those rows for each page.

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

The page's overall build status is set by the page itself: **Works** if at least 80% of rows are ●; **Not built** if at least 80% are ○; **Simulated** if at most 20% are ● and ○ is not the majority; otherwise **Partly simulated**.

## 2. Totals by product

| Product | Pages | Features | Rows | ● Works | ◐ Simulated | ○ Not built | Share working |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Client | 43 | 166 | 1417 | 535 | 531 | 351 | 38% |
| Admin | 24 | 76 | 561 | 241 | 161 | 159 | 43% |
| Companion | 9 | 29 | 186 | 70 | 61 | 55 | 38% |
| AI Receptionist | 17 | 65 | 328 | 170 | 91 | 67 | 52% |
| **All products** | 93 | 336 | 2492 | 1016 | 844 | 632 | 41% |

## 3. Client

| Page | File | Build status | Features | Works rows | Simulated rows | Not built rows |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| My Profile, Notifications Shortcut and Not-Found Page | `client/account/profile.md` | ◐ Partly simulated | 3 | 7 | 2 | 3 |
| Refer and Earn Programme | `client/account/refer-and-earn.md` | ◐ Simulated | 2 | 2 | 8 | 3 |
| Appointments Availability: Weekly Hours and Days Off | `client/appointments/availability.md` | ◐ Partly simulated | 3 | 14 | 6 | 7 |
| Appointments: Booking Drawer and Lifecycle | `client/appointments/booking.md` | ◐ Partly simulated | 5 | 16 | 16 | 6 |
| Appointments Calendar: Month Grid and Day Panel | `client/appointments/calendar.md` | ◐ Partly simulated | 3 | 12 | 6 | 12 |
| Appointments List: Workflow Table, Stage Moves, Import and Export | `client/appointments/list.md` | ◐ Partly simulated | 4 | 9 | 14 | 15 |
| Sign-in, Sign-up, Verification, Invite and Route Guards | `client/auth/access.md` | ◐ Partly simulated | 4 | 13 | 12 | 9 |
| Practice Onboarding Wizard and Plan Recommendation | `client/auth/onboarding.md` | ◐ Partly simulated | 5 | 16 | 8 | 9 |
| Public Pricing Page and Payment Screen | `client/auth/pricing-payment.md` | ◐ Partly simulated | 3 | 11 | 8 | 3 |
| Automation: Event Rules Registry and Rule Builder | `client/automation.md` | ◐ Partly simulated | 6 | 26 | 31 | 19 |
| Call Logs, Telephony Hub & AI Transcription | `client/call-logs.md` | ◐ Simulated | 5 | 7 | 21 | 16 |
| Chats: Inbox and Care Groups | `client/chat/chat.md` | ◐ Partly simulated | 5 | 14 | 15 | 14 |
| Chats: Companion Channel | `client/chat/companion.md` | ◐ Partly simulated | 5 | 11 | 12 | 6 |
| Chats: SMS Channel | `client/chat/sms.md` | ◐ Partly simulated | 4 | 4 | 6 | 11 |
| Chats: Website Channel | `client/chat/website.md` | ◐ Partly simulated | 5 | 10 | 17 | 9 |
| Chats: WhatsApp Channel & Workflow Automation | `client/chat/whatsapp.md` | ◐ Partly simulated | 6 | 10 | 10 | 7 |
| Insurance Claims, EDI Billing & Clearinghouse | `client/claims.md` | ◐ Partly simulated | 4 | 12 | 17 | 11 |
| Clients: Contacts Directory and Profile | `client/clients.md` | ◐ Partly simulated | 3 | 15 | 23 | 13 |
| In-app Product Guide | `client/help/guide.md` | ● Works | 2 | 8 | 1 | 1 |
| Invoices, Patient Billing Ledger & POS Checkout | `client/invoices.md` | ◐ Partly simulated | 5 | 20 | 28 | 13 |
| Knowledge Base: Reference Sources for the AI | `client/knowledge-base.md` | ◐ Partly simulated | 4 | 7 | 10 | 11 |
| Overview: Analytics Dashboard | `client/overview.md` | ◐ Partly simulated | 3 | 5 | 10 | 7 |
| Process: Record Detail Drawer | `client/processes/detail-drawer.md` | ◐ Partly simulated | 3 | 8 | 6 | 3 |
| Clinical Process Pipeline Kanban Board | `client/processes/kanban.md` | ◐ Partly simulated | 4 | 10 | 5 | 11 |
| Process Instances Data Table & SLA Indicators | `client/processes/list.md` | ◐ Partly simulated | 3 | 12 | 9 | 10 |
| Reports: Library, Viewer and Builder | `client/reports.md` | ◐ Partly simulated | 3 | 12 | 17 | 9 |
| AI Scribe: Ambient Consultation Notes | `client/scribe.md` | ◐ Partly simulated | 6 | 11 | 16 | 10 |
| Product & Services Catalog Management | `client/services.md` | ◐ Partly simulated | 3 | 15 | 6 | 7 |
| Audit Logs | `client/settings/audit-logs.md` | ◐ Partly simulated | 2 | 3 | 5 | 4 |
| Subscription, Plans, Credits & Payment Methods | `client/settings/billing.md` | ◐ Partly simulated | 4 | 7 | 13 | 4 |
| Custom Fields, Dynamic Layout & Data Dictionary | `client/settings/custom-fields.md` | ◐ Partly simulated | 3 | 15 | 8 | 6 |
| Third-Party Integrations, Twilio SIP & Webhooks | `client/settings/integrations.md` | ◐ Partly simulated | 5 | 11 | 18 | 5 |
| Settings: Notification Preferences | `client/settings/notifications.md` | ◐ Partly simulated | 2 | 5 | 1 | 3 |
| Settings: Phone Numbers and Country Routing | `client/settings/numbers.md` | ◐ Simulated | 2 | 1 | 8 | 3 |
| Organizations, Business Profile & Operating Locations | `client/settings/organization.md` | ◐ Partly simulated | 3 | 9 | 6 | 9 |
| AI Receptionist Settings | `client/settings/reception.md` | ◐ Partly simulated | 5 | 16 | 14 | 5 |
| Security Policies & Member Security | `client/settings/security.md` | ◐ Simulated | 2 | 0 | 9 | 4 |
| Team Members, Roles, Departments & Seat Usage | `client/settings/team.md` | ◐ Partly simulated | 4 | 7 | 6 | 8 |
| AI Voices, LLM Model Bindings & Speech Profiles | `client/settings/voices.md` | ◐ Partly simulated | 3 | 12 | 3 | 6 |
| My Tasks: Assigned Clinic and Admin Work Inbox | `client/tasks/my-tasks.md` | ◐ Partly simulated | 4 | 11 | 6 | 4 |
| Tasks by me: Team Delegation, Patient Tasks and Sharing | `client/tasks/tasks-by-me.md` | ◐ Partly simulated | 4 | 15 | 16 | 4 |
| Web Forms: Intake Forms, Sharing and Client Creation | `client/web-forms.md` | ◐ Partly simulated | 5 | 23 | 16 | 9 |
| Workflows: Processes, Stages, AI Behaviour and Stage Automations | `client/workflows.md` | ◐ Partly simulated | 7 | 83 | 62 | 22 |

## 4. Admin

| Page | File | Build status | Features | Works rows | Simulated rows | Not built rows |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Admin: Knowledge Base Templates | `admin/admin-knowledge-base.md` | ◐ Partly simulated | 3 | 8 | 6 | 4 |
| Admin: Workflows | `admin/admin-workflows.md` | ◐ Partly simulated | 4 | 12 | 6 | 4 |
| AI Voices and Models: Global Availability Switchboard | `admin/ai-voices-models.md` | ◐ Partly simulated | 2 | 8 | 2 | 7 |
| Audit Logs: Platform Admin Activity | `admin/audit-logs.md` | ◐ Partly simulated | 3 | 8 | 6 | 5 |
| Admin: Automations | `admin/automations.md` | ◐ Partly simulated | 3 | 10 | 3 | 3 |
| Sections & Fields: Fields Tab (Global Custom Field Registry) | `admin/custom-fields/fields.md` | ◐ Partly simulated | 4 | 20 | 8 | 6 |
| Sections & Fields: Sections Tab (Field Groups on Record Profiles) | `admin/custom-fields/sections.md` | ◐ Partly simulated | 3 | 11 | 3 | 7 |
| Document Templates: Master Registry | `admin/document-templates.md` | ◐ Partly simulated | 4 | 15 | 8 | 7 |
| Admin: Form Templates | `admin/form-templates.md` | ◐ Partly simulated | 3 | 12 | 5 | 2 |
| Industries: Industry Category Tab | `admin/industry-category/categories.md` | ◐ Partly simulated | 3 | 9 | 5 | 7 |
| Industries: Industries Tab | `admin/industry-category/industries.md` | ◐ Partly simulated | 3 | 7 | 5 | 8 |
| Organizations: Tenant Directory, Invite and Plan Control | `admin/organizations.md` | ◐ Partly simulated | 4 | 18 | 2 | 12 |
| Credit Actions: Credits Deducted per Action | `admin/plans/actions.md` | ◐ Partly simulated | 2 | 7 | 1 | 8 |
| Plan Categories: Grouping Plans by Product Line | `admin/plans/categories.md` | ◐ Partly simulated | 2 | 3 | 4 | 5 |
| Industry Plans: Subscription Plan Catalogue | `admin/plans/plans.md` | ◐ Partly simulated | 4 | 13 | 11 | 12 |
| Packed Pricing: Credit Packs, Seat Packs and Country Prices | `admin/plans/pricing.md` | ◐ Partly simulated | 3 | 5 | 6 | 8 |
| Product Analytics: Overview, Calls, Usage, Process Movement and Revenue | `admin/product-analytics.md` | ◐ Simulated | 5 | 7 | 26 | 10 |
| Admin: Product / Services Catalogue | `admin/products-services.md` | ◐ Partly simulated | 2 | 6 | 6 | 2 |
| Roles and Permissions: Tenant Role Templates and Departments | `admin/roles.md` | ◐ Partly simulated | 3 | 9 | 5 | 5 |
| Sidebar Navigation Templates | `admin/sidebar-config.md` | ◐ Partly simulated | 3 | 14 | 1 | 6 |
| Corporate Tasks, Cross-Org Delegation and Governance | `admin/tasks.md` | ◐ Partly simulated | 4 | 11 | 10 | 6 |
| Telephony: Providers and Phone Numbers | `admin/telephony.md` | ◐ Partly simulated | 3 | 6 | 9 | 8 |
| User Management: Admin Users and Admin Roles | `admin/users.md` | ◐ Partly simulated | 2 | 9 | 6 | 6 |
| Workspace Billing, Orders & Subscriptions | `admin/workspace-billing.md` | ◐ Partly simulated | 4 | 13 | 17 | 11 |

## 5. Companion

| Page | File | Build status | Features | Works rows | Simulated rows | Not built rows |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Companion: Sign-in, Session and Profile | `companion/access.md` | ◐ Simulated | 4 | 4 | 12 | 4 |
| Visits: Booking, Prepaid Booking and Visit List | `companion/appointments.md` | ◐ Partly simulated | 3 | 9 | 9 | 7 |
| Billing: Balance, Invoices and Payment | `companion/billing.md` | ◐ Partly simulated | 2 | 4 | 9 | 6 |
| Messages: Care Chat Bot, Clinician and Care Groups | `companion/chat/chat.md` | ◐ Partly simulated | 6 | 12 | 13 | 9 |
| Documents: Records Vault and Uploads | `companion/documents.md` | ◐ Partly simulated | 2 | 7 | 3 | 4 |
| Forms: Intake, Consent and Signature | `companion/forms.md` | ◐ Partly simulated | 2 | 8 | 4 | 4 |
| Pharmacy: Pickup and Prescriptions | `companion/pharmacy.md` | ◐ Simulated | 2 | 1 | 2 | 7 |
| Patient My Tasks, Care Protocols and Live Sync | `companion/tasks.md` | ◐ Partly simulated | 4 | 14 | 4 | 2 |
| Today: Visit, Care Pathway and Check-in | `companion/today.md` | ◐ Partly simulated | 4 | 11 | 5 | 12 |

## 6. AI Receptionist

| Page | File | Build status | Features | Works rows | Simulated rows | Not built rows |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Ambient Presence & Wake Flow | `ai-receptionist/avatar/ambient-presence.md` | ◐ Partly simulated | 5 | 14 | 1 | 3 |
| Aria Lip-Sync Stage, Speech Capture & Intent Routing | `ai-receptionist/avatar/aria-stage-speech.md` | ● Works | 5 | 18 | 1 | 2 |
| Split Kiosk Shell, Dock, Timer & Staff Alert | `ai-receptionist/avatar/kiosk-shell.md` | ◐ Partly simulated | 5 | 17 | 3 | 4 |
| Billing Lookup & Invoice Ledger | `ai-receptionist/billing/invoices.md` | ◐ Partly simulated | 4 | 12 | 9 | 2 |
| Touchless UPI QR Checkout & Reconciliation | `ai-receptionist/billing/qr-pay.md` | ◐ Partly simulated | 3 | 7 | 6 | 4 |
| Identity Gate & Face Biometrics | `ai-receptionist/checkin/identity-biometrics.md` | ◐ Partly simulated | 4 | 16 | 2 | 2 |
| Phone Keypad, 4-Digit OTP & Household Picker | `ai-receptionist/checkin/phone-otp.md` | ◐ Partly simulated | 4 | 8 | 9 | 4 |
| Scheduled Check-In & Token Issuance | `ai-receptionist/checkin/scheduled.md` | ◐ Partly simulated | 3 | 6 | 8 | 4 |
| Walk-In Registration, Voice Intake & Booking | `ai-receptionist/checkin/walk-in.md` | ◐ Partly simulated | 4 | 8 | 9 | 3 |
| Clinic Zones & Department Directory | `ai-receptionist/directions/departments.md` | ◐ Partly simulated | 3 | 10 | 3 | 2 |
| Voice Deep-Linking & Turn-by-Turn Room Guide | `ai-receptionist/directions/rooms.md` | ◐ Partly simulated | 3 | 9 | 2 | 4 |
| Biometric Consent, Minor Safeguards & Revocation | `ai-receptionist/my-visit/biometric-consent.md` | ◐ Partly simulated | 4 | 9 | 7 | 1 |
| Process Stage & Personalized Next-Step Guidance | `ai-receptionist/my-visit/next-step.md` | ◐ Partly simulated | 3 | 5 | 7 | 3 |
| Active Visit & Live Queue Tracker | `ai-receptionist/my-visit/tracker.md` | ◐ Partly simulated | 3 | 5 | 4 | 6 |
| Live Sync, Duplicate Protection & Kiosk Resilience | `ai-receptionist/settings/architecture.md` | ◐ Partly simulated | 4 | 5 | 7 | 10 |
| Queue Rules, Token Prefixes & Onboarding Default | `ai-receptionist/settings/queue.md` | ◐ Simulated | 5 | 3 | 7 | 7 |
| Clinic Rooms & Desks and Stage Guidance Cards | `ai-receptionist/settings/stations.md` | ◐ Partly simulated | 3 | 18 | 6 | 6 |

## 7. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Generated from the status marks in every PRD page. |
