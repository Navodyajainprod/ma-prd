---
title: "Open decisions"
product: "reference"
module: "reference"
channel: "open-decisions"
status: "In Review"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | REFERENCE |
| Module | OPEN DECISIONS |
| Status | In Review |
| Generated | by `scripts/build-decisions-page.mjs` from `analysis/decisions.md` and the decision notes in every PRD page |
| Last updated | 2026-11-14 |

## 1. How to read this page

The PRD describes the prototype as built. Where the intended behaviour is not decided, the page says "Decision needed" and points here. There are **147 open decisions**: 40 at P0, 65 at P1 and 42 at P2. None is answered in the PRD.

| Priority | Meaning |
| :--- | :--- |
| P0 | Blocks the PRD, or is a security, compliance, safety or revenue risk. |
| P1 | Needed for the PRD to be accurate. |
| P2 | Detail. |

## 2. P0 decisions (40)

### Naming, scope and what the PRD describes

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-01 | Which names are canonical: Process vs Workflows vs Deals vs Pipeline, and Clients vs Contacts vs Patients (including whether Archived and Pending are real statuses)? | Sidebar, routes, page titles, toasts and PRD files use different words for the same objects. | [Industries: Industries Tab](/admin/industry-category/industries), [Clients: Contacts Directory and Profile](/client/clients), [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices), [Process: Record Detail Drawer](/client/processes/detail-drawer), [Clinical Process Pipeline Kanban Board](/client/processes/kanban), [Process Instances Data Table & SLA Indicators](/client/processes/list), [Product & Services Catalog Management](/client/services), [My Tasks: Assigned Clinic and Admin Work Inbox](/client/tasks/my-tasks), [Tasks by me: Team Delegation, Patient Tasks and Sharing](/client/tasks/tasks-by-me), [Web Forms: Intake Forms, Sharing and Client Creation](/client/web-forms), [Workflows: Processes, Stages, AI Behaviour and Stage Automations](/client/workflows), [Visits: Booking, Prepaid Booking and Visit List](/companion/appointments), [Today: Visit, Care Pathway and Check-in](/companion/today) |
| D-02 | Is the PRD rewritten as a prototype-only description, or must it state backend requirements (live cross-device sync, server-side enforcement), and are PRD files for unbuilt admin features replaced by the as-built text or kept as a marked roadmap? | Several PRD files describe features that do not exist (SSO, impersonation, failover, live sync). | [AI Voices and Models: Global Availability Switchboard](/admin/ai-voices-models), [User Management: Admin Users and Admin Roles](/admin/users), [Live Sync, Duplicate Protection & Kiosk Resilience](/ai-receptionist/settings/architecture), [Queue Rules, Token Prefixes & Onboarding Default](/ai-receptionist/settings/queue), [AI Receptionist Settings](/client/settings/reception), [AI Voices, LLM Model Bindings & Speech Profiles](/client/settings/voices) |
| D-03 | Is the Overview a call and automation analytics dashboard (as built), a clinical command centre (as PRD), or both? | The whole page definition depends on this. | [Overview: Analytics Dashboard](/client/overview), [Reports: Library, Viewer and Builder](/client/reports) |

### Roles, permissions and access control

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-11 | What is the source of truth for role names and the role model (Admin/Doctor/Nurse/Coordinator/Billing vs Admin/Manager/Specialist/Reception/Sales/Agent/Executive; Admin roles vs Tenant role templates), how does an admin record link to a sign-in identity (default role), and what should Permitted Scope summarise? | PRD and build use different role sets and two role systems exist. | [Roles and Permissions: Tenant Role Templates and Departments](/admin/roles), [User Management: Admin Users and Admin Roles](/admin/users), [Team Members, Roles, Departments & Seat Usage](/client/settings/team) |
| D-12 | Must permissions block direct URL access and each action (not only hide sidebar items), where is the role matrix enforced, what happens to an unknown role, who may open /admin/*, and are sidebar items gated by plan tier and role? | Today there is no gating; hidden menu items are still reachable. | [Admin: Knowledge Base Templates](/admin/admin-knowledge-base), [Admin: Workflows](/admin/admin-workflows), [AI Voices and Models: Global Availability Switchboard](/admin/ai-voices-models), [Audit Logs: Platform Admin Activity](/admin/audit-logs), [Admin: Automations](/admin/automations), [Sections & Fields: Fields Tab (Global Custom Field Registry)](/admin/custom-fields/fields), [Sections & Fields: Sections Tab (Field Groups on Record Profiles)](/admin/custom-fields/sections), [Document Templates: Master Registry](/admin/document-templates), [Admin: Form Templates](/admin/form-templates), [Industries: Industry Category Tab](/admin/industry-category/categories), [Industries: Industries Tab](/admin/industry-category/industries), [Organizations: Tenant Directory, Invite and Plan Control](/admin/organizations), [Credit Actions: Credits Deducted per Action](/admin/plans/actions), [Plan Categories: Grouping Plans by Product Line](/admin/plans/categories), [Industry Plans: Subscription Plan Catalogue](/admin/plans/plans), [Packed Pricing: Credit Packs, Seat Packs and Country Prices](/admin/plans/pricing), [Product Analytics: Overview, Calls, Usage, Process Movement and Revenue](/admin/product-analytics), [Admin: Product / Services Catalogue](/admin/products-services), [Roles and Permissions: Tenant Role Templates and Departments](/admin/roles), [Sidebar Navigation Templates](/admin/sidebar-config), [Corporate Tasks, Cross-Org Delegation and Governance](/admin/tasks), [Telephony: Providers and Phone Numbers](/admin/telephony), [User Management: Admin Users and Admin Roles](/admin/users), [Workspace Billing, Orders & Subscriptions](/admin/workspace-billing), [Sign-in, Sign-up, Verification, Invite and Route Guards](/client/auth/access), [Custom Fields, Dynamic Layout & Data Dictionary](/client/settings/custom-fields), [Third-Party Integrations, Twilio SIP & Webhooks](/client/settings/integrations), [Settings: Notification Preferences](/client/settings/notifications), [Settings: Phone Numbers and Country Routing](/client/settings/numbers), [Organizations, Business Profile & Operating Locations](/client/settings/organization), [Team Members, Roles, Departments & Seat Usage](/client/settings/team), [AI Voices, LLM Model Bindings & Speech Profiles](/client/settings/voices), [My Tasks: Assigned Clinic and Admin Work Inbox](/client/tasks/my-tasks) |
| D-13 | Which roles may delete, bulk-delete, import, export, add categories and mark fields required on clients, and must exports be audited? | Mass data access to patient records is ungated. | [Clients: Contacts Directory and Profile](/client/clients) |
| D-14 | Which roles may listen to recordings, read transcripts, run Scribe, select the responsible doctor and issue prescriptions? | Clinical and recording access is ungated. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs), [Process: Record Detail Drawer](/client/processes/detail-drawer), [AI Scribe: Ambient Consultation Notes](/client/scribe) |
| D-15 | Which roles may manage the catalogue, void invoices, write off, record payments, and create or submit claims? | No gating exists on money-affecting actions. | [Insurance Claims, EDI Billing & Clearinghouse](/client/claims), [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices), [Product & Services Catalog Management](/client/services) |
| D-16 | Which roles may view, create, edit or delete Knowledge Base sources, and should Admin/Manager reach AI Receptionist settings (perhaps Rooms only)? | Every role can edit KB today; settings are SystemAdmin-only while PRD personas are managers. | [Live Sync, Duplicate Protection & Kiosk Resilience](/ai-receptionist/settings/architecture), [Queue Rules, Token Prefixes & Onboarding Default](/ai-receptionist/settings/queue), [Clinic Rooms & Desks and Stage Guidance Cards](/ai-receptionist/settings/stations), [Knowledge Base: Reference Sources for the AI](/client/knowledge-base), [AI Receptionist Settings](/client/settings/reception) |

### Client identity, matching and records

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-22 | What is the single matching rule for every entry point (manual, kiosk, website, webmail, portal, import, inbox thread), for example exact phone (last 10 digits) OR exact email and never name alone; should manual create warn and offer the existing contact; what happens when Auto Create Contact is off; how is an unknown number linked to a client; and for a kiosk walk-in match, link, offer the household picker or create new? | Every channel dedupes differently, risking duplicate or wrongly merged patient records. | [Walk-In Registration, Voice Intake & Booking](/ai-receptionist/checkin/walk-in), [Chats: Inbox and Care Groups](/client/chat/chat), [Chats: SMS Channel](/client/chat/sms), [Chats: Website Channel](/client/chat/website), [Clients: Contacts Directory and Profile](/client/clients) |
| D-23 | Which fields may a form submission overwrite on a matched client, and do portal form answers stay as a submission record or update client fields (allergies, DOB, insurance)? | Overwriting clinical fields from a form can corrupt records. | [Web Forms: Intake Forms, Sharing and Client Creation](/client/web-forms), [Forms: Intake, Consent and Signature](/companion/forms) |

### Deleting and deactivating referenced records

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-33 | Can call logs and Scribe sessions be deleted, by whom, with what confirmation, retention and audit trail? | Clinical and call records have no deletion rules. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs), [AI Scribe: Ambient Consultation Notes](/client/scribe) |

### Consent, biometrics and privacy (kiosk, Scribe, voice)

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-34 | Is patient consent required before ambient recording and voice capture (Scribe, kiosk speech to a server), captured per session or per patient, and what notice and storage apply? | Recording and sending patient voice to a server has no consent rule. | [Aria Lip-Sync Stage, Speech Capture & Intent Routing](/ai-receptionist/avatar/aria-stage-speech), [Live Sync, Duplicate Protection & Kiosk Resilience](/ai-receptionist/settings/architecture), [AI Scribe: Ambient Consultation Notes](/client/scribe) |
| D-35 | How are biometric consent and its withdrawal handled: staff capture before Enroll Face Check-in, withdrawal at the kiosk itself, and is a persistent camera notice pill required? | Face enrolment has no defined consent flow. | [Ambient Presence & Wake Flow](/ai-receptionist/avatar/ambient-presence), [Biometric Consent, Minor Safeguards & Revocation](/ai-receptionist/my-visit/biometric-consent) |
| D-36 | Is the visitor-typed age enough to exclude minors from biometrics, or is a DOB or guardian step needed? | Biometric use on minors is a compliance risk. | [Split Kiosk Shell, Dock, Timer & Staff Alert](/ai-receptionist/avatar/kiosk-shell), [Walk-In Registration, Voice Intake & Booking](/ai-receptionist/checkin/walk-in), [Biometric Consent, Minor Safeguards & Revocation](/ai-receptionist/my-visit/biometric-consent) |
| D-37 | What protection at rest and retention period apply to stored face templates? | Biometric data storage rules are undefined. | [Identity Gate & Face Biometrics](/ai-receptionist/checkin/identity-biometrics), [Walk-In Registration, Voice Intake & Booking](/ai-receptionist/checkin/walk-in), [Biometric Consent, Minor Safeguards & Revocation](/ai-receptionist/my-visit/biometric-consent) |
| D-38 | What is the retention period for scribe audio, transcripts and call recordings (the 90-day setting is unused)? | Retention is configured but not applied. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs), [AI Scribe: Ambient Consultation Notes](/client/scribe) |
| D-39 | Which details may appear on screen or be spoken in a public lobby after verification (full name, phone, patient ID, bill count and amount)? | Patient data could be exposed in a public space. | [Billing Lookup & Invoice Ledger](/ai-receptionist/billing/invoices), [Identity Gate & Face Biometrics](/ai-receptionist/checkin/identity-biometrics), [Phone Keypad, 4-Digit OTP & Household Picker](/ai-receptionist/checkin/phone-otp), [Process Stage & Personalized Next-Step Guidance](/ai-receptionist/my-visit/next-step) |
| D-40 | What safeguards apply to face match: second check on a duplicate-face warning, fallback to phone when several faces match, and may a face match unlock Billing? | Weak match handling risks identifying or billing the wrong person. | [Billing Lookup & Invoice Ledger](/ai-receptionist/billing/invoices), [Identity Gate & Face Biometrics](/ai-receptionist/checkin/identity-biometrics), [Walk-In Registration, Voice Intake & Booking](/ai-receptionist/checkin/walk-in), [Biometric Consent, Minor Safeguards & Revocation](/ai-receptionist/my-visit/biometric-consent) |

### Audit, retention and tenant isolation

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-42 | Which events must be audited (patient access, kiosk biometric and arrival events, exports, platform and admin actions, sign-ins), and must the log be immutable with signed export? | Audit coverage is undefined across client and admin consoles. | [AI Voices and Models: Global Availability Switchboard](/admin/ai-voices-models), [Audit Logs: Platform Admin Activity](/admin/audit-logs), [Document Templates: Master Registry](/admin/document-templates), [Organizations: Tenant Directory, Invite and Plan Control](/admin/organizations), [Credit Actions: Credits Deducted per Action](/admin/plans/actions), [Plan Categories: Grouping Plans by Product Line](/admin/plans/categories), [Industry Plans: Subscription Plan Catalogue](/admin/plans/plans), [Roles and Permissions: Tenant Role Templates and Departments](/admin/roles), [Sidebar Navigation Templates](/admin/sidebar-config), [Workspace Billing, Orders & Subscriptions](/admin/workspace-billing), [Split Kiosk Shell, Dock, Timer & Staff Alert](/ai-receptionist/avatar/kiosk-shell), [Scheduled Check-In & Token Issuance](/ai-receptionist/checkin/scheduled), [Clinic Zones & Department Directory](/ai-receptionist/directions/departments), [Biometric Consent, Minor Safeguards & Revocation](/ai-receptionist/my-visit/biometric-consent), [Live Sync, Duplicate Protection & Kiosk Resilience](/ai-receptionist/settings/architecture), [Audit Logs](/client/settings/audit-logs) |
| D-43 | Should the client audit log show only this organisation's events, what may a tenant see about platform staff actions on its account, and must tenants never see /organizations or other organisations' audit entries (and is the owner invite emailed or copied)? | Cross-tenant visibility is a data-isolation risk. | [Audit Logs: Platform Admin Activity](/admin/audit-logs), [Organizations: Tenant Directory, Invite and Plan Control](/admin/organizations), [Audit Logs](/client/settings/audit-logs) |

### Authentication, onboarding and invitations

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-45 | What is the staff authentication model (password hash, emailed code, expiry, lockout, forgot password, SSO), where do security policies live and how are they enforced, how is the current password verified, is idle lock required (lock or sign out), and what happens when sign-up uses an email that already has an account? | The prototype has no real authentication. | [Sign-in, Sign-up, Verification, Invite and Route Guards](/client/auth/access), [Security Policies & Member Security](/client/settings/security) |
| D-46 | What is the patient/visitor authentication model: real OTP by SMS/email, lifetime, retry and lockout limits (OTP and face), session length, passwords, client ID login, duplicate phone/email at registration, and how is the OTP delivered in production (demo code only behind a flag)? | Portal and kiosk verification is demo-only. | [Billing Lookup & Invoice Ledger](/ai-receptionist/billing/invoices), [Identity Gate & Face Biometrics](/ai-receptionist/checkin/identity-biometrics), [Phone Keypad, 4-Digit OTP & Household Picker](/ai-receptionist/checkin/phone-otp), [Clinic Zones & Department Directory](/ai-receptionist/directions/departments), [Voice Deep-Linking & Turn-by-Turn Room Guide](/ai-receptionist/directions/rooms), [Companion: Sign-in, Session and Profile](/companion/access), [Visits: Booking, Prepaid Booking and Visit List](/companion/appointments), [Billing: Balance, Invoices and Payment](/companion/billing), [Messages: Care Chat Bot, Clinician and Care Groups](/companion/chat/chat), [Documents: Records Vault and Uploads](/companion/documents), [Forms: Intake, Consent and Signature](/companion/forms), [Pharmacy: Pickup and Prescriptions](/companion/pharmacy), [Today: Visit, Care Pathway and Check-in](/companion/today) |

### Plans, billing and credits

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-54 | Which plan tier names are canonical (Starter/Growth/Enterprise vs Starter/Professional/Enterprise/Custom vs Free/Starter/Growth/Professional vs Custom/Scale) and what are the plan change rules (confirmation, proration, effective date, downgrade limits)? | Three vocabularies coexist. | [Industry Plans: Subscription Plan Catalogue](/admin/plans/plans), [Workspace Billing, Orders & Subscriptions](/admin/workspace-billing), [Subscription, Plans, Credits & Payment Methods](/client/settings/billing) |
| D-55 | Do plan modules, features and seats gate tenant features; does adding a member block, warn or auto-bill at the seat limit; what happens to over-limit users on downgrade; do plan edits reach existing subscribers; and can a plan with subscribers be deleted? | Plan enforcement drives revenue and is not defined. | [Industry Plans: Subscription Plan Catalogue](/admin/plans/plans), [Packed Pricing: Credit Packs, Seat Packs and Country Prices](/admin/plans/pricing), [Subscription, Plans, Credits & Payment Methods](/client/settings/billing), [Team Members, Roles, Departments & Seat Usage](/client/settings/team) |
| D-56 | What is the monthly credit renewal rule and what happens when a tenant runs out of credits? | Revenue and service continuity risk. | [Credit Actions: Credits Deducted per Action](/admin/plans/actions), [Industry Plans: Subscription Plan Catalogue](/admin/plans/plans) |

### Payments, refunds and revenue definitions

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-62 | Which payment gateway and rails (card, Apple/Google Pay, UPI/INR QR) are used, where do credentials live and is Stripe Connect client or admin only, what are the failed-payment, retry and receipt rules, and which currency and payee does the kiosk QR use? | Payment flow is a mock and mixes INR and USD. | [Billing Lookup & Invoice Ledger](/ai-receptionist/billing/invoices), [Touchless UPI QR Checkout & Reconciliation](/ai-receptionist/billing/qr-pay), [Practice Onboarding Wizard and Plan Recommendation](/client/auth/onboarding), [Public Pricing Page and Payment Screen](/client/auth/pricing-payment), [Subscription, Plans, Credits & Payment Methods](/client/settings/billing), [Third-Party Integrations, Twilio SIP & Webhooks](/client/settings/integrations), [Visits: Booking, Prepaid Booking and Visit List](/companion/appointments), [Billing: Balance, Invoices and Payment](/companion/billing) |
| D-63 | What counts as Paid: can an invoice move to Paid without a recorded payment (and by which role), should a Kanban drop on Paid open Record Payment, and may the kiosk mark an invoice Paid on tapping I Have Paid? | Paid status without confirmed money is a revenue risk. | [Billing Lookup & Invoice Ledger](/ai-receptionist/billing/invoices), [Touchless UPI QR Checkout & Reconciliation](/ai-receptionist/billing/qr-pay), [Live Sync, Duplicate Protection & Kiosk Resilience](/ai-receptionist/settings/architecture), [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices), [Billing: Balance, Invoices and Payment](/companion/billing) |
| D-64 | For prepaid bookings, is the invoice the full price or the deposit, must payment be captured before confirmation, and how long is a slot held during checkout? | Prepaid booking money flow is undefined. | [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Visits: Booking, Prepaid Booking and Visit List](/companion/appointments) |
| D-65 | What happens on cancelling a paid or prepaid appointment (refund, credit note, keep paid) and does a no-show create a fee or touch the invoice? | Refund and fee rules are undefined. | [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Appointments List: Workflow Table, Stage Moves, Import and Export](/client/appointments/list) |
| D-66 | How are write-offs stored and reported (not as cash), and do they need approval or a role? | Write-offs could be counted as cash. | [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices) |
| D-67 | Which invoice statuses count as revenue, billed, collected, Outstanding, Total Invoiced and Paid This Month (payment date in the calendar month), and is collection rate measured within 60 days of invoice date or due date? | Revenue KPIs depend on the status mapping. | [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices), [Reports: Library, Viewer and Builder](/client/reports) |
| D-68 | What is the invoice status vocabulary and mapping to stages, and should a Void stage be seeded by default? | Statuses differ between PRD and workflow stages. | [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices) |
| D-69 | What tax applies to a line with no tax rate (0%, item tax, org default), and where is discount entered, as amount or percent, before tax? | Totals depend on these defaults. | [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices) |

### Calls, call logs and metrics

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-83 | What is the canonical call outcome set (Completed/Missed/Voicemail vs Completed/Failed/Pending/In Progress vs BUSY/NO ANSWER), with one data source shared by Overview, Reports and Call Logs? | Three vocabularies drive different counts. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs), [Overview: Analytics Dashboard](/client/overview) |

### Workflow automation and forms

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-110 | Which workflow steps must really execute (delay, SMS, WhatsApp, Email, webhook, assign human, create records, Create task), and until then should they be hidden or marked not live? | Unimplemented steps look configured and live. | [Automation: Event Rules Registry and Rule Builder](/client/automation), [Tasks by me: Team Delegation, Patient Tasks and Sharing](/client/tasks/tasks-by-me), [Workflows: Processes, Stages, AI Behaviour and Stage Automations](/client/workflows) |

### Appointments and scheduling

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-114 | What is the canonical appointment status list (Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show vs Booked, Reminder, Completed, Reschedule, No-show), should a default Cancelled stage exist, and which List columns are required? | PRD and workflow stages differ. | [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Appointments List: Workflow Table, Stage Moves, Import and Export](/client/appointments/list) |

### AI behaviour, bots and emergencies

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-132 | What are the emergency escalation keywords, wording and staff alert for Companion and chat bots? | Patient safety path is undefined. | [Chats: Companion Channel](/client/chat/companion), [Messages: Care Chat Bot, Clinician and Care Groups](/companion/chat/chat) |

### Messaging channels and compliance

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-135 | Should the 24h WhatsApp window countdown and lock be restored, and in which release? | Window was disabled per user request; policy risk. | [Chats: WhatsApp Channel & Workflow Automation](/client/chat/whatsapp) |
| D-138 | What are the care group rules: shown outside Companion, Private/Public type (are public groups visible to every patient), archive vs auto-delete retention, and does leaving update the clinic side? | Public group exposure is a privacy risk. | [Chats: Inbox and Care Groups](/client/chat/chat), [Chats: Companion Channel](/client/chat/companion), [Messages: Care Chat Bot, Clinician and Care Groups](/companion/chat/chat) |

## 3. P1 decisions (65)

### Naming, scope and what the PRD describes

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-04 | Are the original Knowledge Base concepts (folders, content search with highlighting, reader/print view, publish/index) still wanted? | PRD lists them but the build omits them. | [Knowledge Base: Reference Sources for the AI](/client/knowledge-base) |
| D-05 | Which routes and pages are kept or retired: /payments, /transactions, client /users, campaigns, credits, voice-config aliases, and client Settings/Reports inside the admin shell? | Dead or alias screens exist with no owner or navigation. | [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices), [Subscription, Plans, Credits & Payment Methods](/client/settings/billing), [Team Members, Roles, Departments & Seat Usage](/client/settings/team) |
| D-08 | Should workflows.md and automation.md be merged, and should Add Automation be a sidebar item under CUSTOMIZATIONS with a canvas page? | Built workflow (stages) and automation (event rules) overlap; PRD proposes a canvas. | [Automation: Event Rules Registry and Rule Builder](/client/automation) |

### Roles, permissions and access control

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-17 | Which roles may edit workflows, automations and forms? | No role gating on automation edits. | [Admin: Automations](/admin/automations), [Admin: Form Templates](/admin/form-templates), [Automation: Event Rules Registry and Rule Builder](/client/automation), [Web Forms: Intake Forms, Sharing and Client Creation](/client/web-forms), [Workflows: Processes, Stages, AI Behaviour and Stage Automations](/client/workflows) |
| D-18 | Which roles may view all inbox threads, assign threads, and edit Website/Companion settings? | No gating exists today. | [Chats: Inbox and Care Groups](/client/chat/chat), [Chats: Companion Channel](/client/chat/companion), [Chats: SMS Channel](/client/chat/sms), [Chats: Website Channel](/client/chat/website) |
| D-19 | Which roles may open Reports (especially Revenue and Team sources) and the Overview, and should /admin/reports and /admin/campaigns exist? | Financial and team data are exposed to all roles. | [Overview: Analytics Dashboard](/client/overview), [Reports: Library, Viewer and Builder](/client/reports) |
| D-20 | Which roles may see other providers' appointments, book for others, cancel, and edit availability? | No role rules for appointments. | [Appointments Availability: Weekly Hours and Days Off](/client/appointments/availability), [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Appointments Calendar: Month Grid and Day Panel](/client/appointments/calendar), [Appointments List: Workflow Table, Stage Moves, Import and Export](/client/appointments/list) |

### Client identity, matching and records

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-24 | What is the minimum required field set to create a client (Name only, phone or email, DOB/gender)? | Create rules differ between manual, form and PRD. | [Clients: Contacts Directory and Profile](/client/clients), [Web Forms: Intake Forms, Sharing and Client Creation](/client/web-forms) |
| D-28 | Should Send Invite go through email/SMS/WhatsApp with a copyable link, and should staff ever open the portal on a patient's behalf? | An unused invite modal exists; staff-as-patient access is a privacy question. | [Clients: Contacts Directory and Profile](/client/clients) |
| D-30 | Should field keys be editable, can system fields and sections be edited, may a tenant edit or delete admin-defined fields, what defines a unique key, and what is the formula for per-user credits and usage columns? | Admin-defined custom field rules and usage columns are undefined. | [Sections & Fields: Fields Tab (Global Custom Field Registry)](/admin/custom-fields/fields), [Sections & Fields: Sections Tab (Field Groups on Record Profiles)](/admin/custom-fields/sections), [Custom Fields, Dynamic Layout & Data Dictionary](/client/settings/custom-fields), [Team Members, Roles, Departments & Seat Usage](/client/settings/team) |

### Deleting and deactivating referenced records

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-32 | Can a catalogue item, claim, room, process, stage or seeded plan/category/form/template be deleted once referenced, or only deactivated; and when a stage is deleted must its clients be moved to a replacement stage? | Deleting referenced records can orphan invoices, appointments and clients. | [Sections & Fields: Fields Tab (Global Custom Field Registry)](/admin/custom-fields/fields), [Document Templates: Master Registry](/admin/document-templates), [Admin: Form Templates](/admin/form-templates), [Industries: Industry Category Tab](/admin/industry-category/categories), [Industries: Industries Tab](/admin/industry-category/industries), [Plan Categories: Grouping Plans by Product Line](/admin/plans/categories), [Industry Plans: Subscription Plan Catalogue](/admin/plans/plans), [Admin: Product / Services Catalogue](/admin/products-services), [Clinic Rooms & Desks and Stage Guidance Cards](/ai-receptionist/settings/stations), [Insurance Claims, EDI Billing & Clearinghouse](/client/claims), [Product & Services Catalog Management](/client/services), [AI Receptionist Settings](/client/settings/reception), [Workflows: Processes, Stages, AI Behaviour and Stage Automations](/client/workflows) |

### Consent, biometrics and privacy (kiosk, Scribe, voice)

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-41 | What may a successful verification authorise, for how long, and is it bound to the one patient or household chosen? | Scope of a verified session is undefined. | [Ambient Presence & Wake Flow](/ai-receptionist/avatar/ambient-presence), [Aria Lip-Sync Stage, Speech Capture & Intent Routing](/ai-receptionist/avatar/aria-stage-speech), [Split Kiosk Shell, Dock, Timer & Staff Alert](/ai-receptionist/avatar/kiosk-shell), [Identity Gate & Face Biometrics](/ai-receptionist/checkin/identity-biometrics), [Phone Keypad, 4-Digit OTP & Household Picker](/ai-receptionist/checkin/phone-otp), [Scheduled Check-In & Token Issuance](/ai-receptionist/checkin/scheduled), [Walk-In Registration, Voice Intake & Booking](/ai-receptionist/checkin/walk-in), [Process Stage & Personalized Next-Step Guidance](/ai-receptionist/my-visit/next-step), [Active Visit & Live Queue Tracker](/ai-receptionist/my-visit/tracker) |

### Audit, retention and tenant isolation

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-44 | Are the logo (size, formats), brand colour and tax ID on receipts in scope for organisation profile, and may a client administrator see or create other organisations? | Org profile fields and multi-org rights are unclear. | [Organizations, Business Profile & Operating Locations](/client/settings/organization) |

### Authentication, onboarding and invitations

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-47 | What is the invitation model (emailed secure link with Pending, resend, 7-day expiry, revoke, vs instant add), and what role does an invited owner get? | PRD and build differ; owner role and link lifetime unset. | [Sign-in, Sign-up, Verification, Invite and Route Guards](/client/auth/access), [Team Members, Roles, Departments & Seat Usage](/client/settings/team) |
| D-48 | Should free sign-up accounts have a trial length and a conversion step, and should the app block users until onboarding and payment are complete? | Free-to-paid path is undefined. | [Sign-in, Sign-up, Verification, Invite and Route Guards](/client/auth/access), [Practice Onboarding Wizard and Plan Recommendation](/client/auth/onboarding) |
| D-50 | Should onboarding answers choose industry workflow templates, automations or sidebar template; is Industries the master for onboarding and scope pickers (and what happens when a category is deleted, are terminology overrides still wanted); and should admin Products/Services and KB items be provisioned to tenants? | Onboarding answers currently drive nothing; blueprints imply they should. | [Admin: Knowledge Base Templates](/admin/admin-knowledge-base), [Sections & Fields: Fields Tab (Global Custom Field Registry)](/admin/custom-fields/fields), [Sections & Fields: Sections Tab (Field Groups on Record Profiles)](/admin/custom-fields/sections), [Industries: Industry Category Tab](/admin/industry-category/categories), [Industries: Industries Tab](/admin/industry-category/industries), [Admin: Product / Services Catalogue](/admin/products-services), [Practice Onboarding Wizard and Plan Recommendation](/client/auth/onboarding) |
| D-51 | Should admins edit a published template via draft/version rather than live tenant workflows, should workflows be deletable, and does the Admin Control Hide tick mean tenants may hide or visible to tenants? | Template edits affect live tenants; Hide semantics are ambiguous. | [Admin: Workflows](/admin/admin-workflows), [Admin: Product / Services Catalogue](/admin/products-services) |

### Plans, billing and credits

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-57 | How do top-ups work (fixed bundles or custom amounts, price source, payment method, invoice, confirm card removal) and what are the credit meter colour thresholds (500-1,000 undefined)? | Credit purchase and warning rules are undefined. | [Subscription, Plans, Credits & Payment Methods](/client/settings/billing) |
| D-58 | Is the 20% yearly discount rule confirmed, and are credit rates read from admin? | Pricing page may not reflect admin values. | [Public Pricing Page and Payment Screen](/client/auth/pricing-payment) |
| D-59 | Which subscription dataset is canonical, must tenant purchases create Orders, and may a Paid order be cancelled without refund? | Subscriptions and orders are separate stores. | [Industry Plans: Subscription Plan Catalogue](/admin/plans/plans), [Workspace Billing, Orders & Subscriptions](/admin/workspace-billing) |
| D-60 | What is the currency model for packs, base rates, catalogue items and MRR totals (single USD or per org), and what does the Workspace Billing All connected subtext mean? | Prices show in dollars while some flows are INR. | [Packed Pricing: Credit Packs, Seat Packs and Country Prices](/admin/plans/pricing), [Workspace Billing, Orders & Subscriptions](/admin/workspace-billing), [Product & Services Catalog Management](/client/services) |
| D-61 | Which telephony model applies: who places click-to-dial calls (trunk or softphone), are numbers self-service, imported or admin-allocated with what charge and process assignment, and should admin numbers and carriers appear in client Integrations and AI Receptionist? | Number ownership and cost rules are undefined. | [Telephony: Providers and Phone Numbers](/admin/telephony), [Call Logs, Telephony Hub & AI Transcription](/client/call-logs), [Third-Party Integrations, Twilio SIP & Webhooks](/client/settings/integrations), [Settings: Phone Numbers and Country Routing](/client/settings/numbers), [Workflows: Processes, Stages, AI Behaviour and Stage Automations](/client/workflows) |

### Payments, refunds and revenue definitions

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-70 | What are the invoice and claim number formats, is numbering per organisation, and must claim numbers be unique? | Numbering affects compliance and exports. | [Insurance Claims, EDI Billing & Clearinghouse](/client/claims), [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices) |
| D-71 | Which invoice fields stay editable after Sent? | Post-send edits alter issued documents. | [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices) |
| D-72 | Should invoice creation be gated by an invoice automation, and should patient-portal bookings follow the clinic's appointment automation required setting? | Portal currently overrides the setting. | [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices), [Visits: Booking, Prepaid Booking and Visit List](/companion/appointments) |

### Claims and clinical documentation

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-75 | Which claims process (Insurance and Claims vs Claims Management) and status set (Accepted vs Acknowledged, Denied vs Rejected) are canonical, with a single stage-to-status mapping? | Claim vocabularies conflict. | [Insurance Claims, EDI Billing & Clearinghouse](/client/claims) |
| D-76 | Should claims be built from appointment, invoice and AI Scribe data, should insurance payments on invoices update claims, and what should Scribe push to invoices and claims (suggested services or CPT codes and fees; ICD-10 only with clinician confirmation)? | Data flow into billing is unspecified and clinically sensitive. | [Insurance Claims, EDI Billing & Clearinghouse](/client/claims), [Invoices, Patient Billing Ledger & POS Checkout](/client/invoices), [AI Scribe: Ambient Consultation Notes](/client/scribe) |
| D-77 | What are the formula and data source (payer contract, ERA) for Allowed Amount and Patient Responsibility? | Claim amounts cannot be computed. | [Insurance Claims, EDI Billing & Clearinghouse](/client/claims) |
| D-78 | Which claim fields are mandatory, is provider NPI taken from Team credentials, and are NPI, licence and taxonomy in scope? | Claim validity depends on provider identifiers. | [Insurance Claims, EDI Billing & Clearinghouse](/client/claims), [Team Members, Roles, Departments & Seat Usage](/client/settings/team) |
| D-79 | Which note template applies (4-part SOAP vs 11-section prescription layout; per specialty), who can sign off, what locks, and how are amendments and versions handled; is the prescription filed on save or sign-off? | Clinical record legal status is undefined. | [AI Scribe: Ambient Consultation Notes](/client/scribe) |

### Calls, call logs and metrics

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-84 | How are Avg Duration, success rate (denominator), Missed and Incomplete (with or without No answer/Busy/Cancelled) defined, and over which date scope? | KPI numbers vary by definition. | [Product Analytics: Overview, Calls, Usage, Process Movement and Revenue](/admin/product-analytics), [Overview: Analytics Dashboard](/client/overview) |
| D-85 | Is Call Logs telephone-only or does it include SMS, WhatsApp and kiosk events, is each call its own entry, and how are human-handled calls and AI-to-human transfers represented? | Current log overwrites one entry per client and process. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs) |
| D-87 | What are the formulas and sources for call review metrics (happiness, disconnect reason, barge-in, loop, sentiment, warmth, silence, follow-up date), and should the Call Review tab be shown? | Metrics are displayed without a defined source. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs) |

### Dashboard, reports and admin analytics

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-90 | What are the conversion funnel definition (stages from selected process; ever reached vs currently in), Performance Analysis insights (calculate or remove), and where do dashboard filter options and reporting periods (calendar vs rolling, Last Run) come from? | Charts show numbers with no stated formula. | [Overview: Analytics Dashboard](/client/overview), [Reports: Library, Viewer and Builder](/client/reports) |
| D-92 | Which pre-built read-only report templates ship, which live module feeds each source, and should Messaging be a data source? | Builder sources are unspecified. | [Reports: Library, Viewer and Builder](/client/reports) |
| D-95 | What is the report sharing model (users, roles, teams; view or edit) behind the Shared badge? | Sharing is unspecified and affects data access. | [Reports: Library, Viewer and Builder](/client/reports) |
| D-96 | What are the formulas and sources for admin Overview (Organizations, Active Agents, Calls Processed, Automations, Net MRR, Resolution, volume chart, health, ranking) and Organization Usage (users, numbers, calls, storage, tasks, AI accuracy, storage quota, numbers in use per provider)? | Admin metrics have no definitions. | [Product Analytics: Overview, Calls, Usage, Process Movement and Revenue](/admin/product-analytics), [Telephony: Providers and Phone Numbers](/admin/telephony) |
| D-98 | What are the formulas for Revenue metrics (MRR, ARR, settled, collection rate, open, overdue, tier mix, growth) and Subscriptions Renewal Rate? | Finance KPIs undefined. | [Product Analytics: Overview, Calls, Usage, Process Movement and Revenue](/admin/product-analytics), [Workspace Billing, Orders & Subscriptions](/admin/workspace-billing) |

### Process pipeline and tasks

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-100 | Do Kanban and List show one shared set of process records (one per client per process), what do Kanban card Edit and Call do, should there be an All processes list with a Process Name column, and should the detail drawer get its own PRD (with cross-process hand-off)? | Views and data model are inconsistent. | [Process: Record Detail Drawer](/client/processes/detail-drawer), [Clinical Process Pipeline Kanban Board](/client/processes/kanban), [Process Instances Data Table & SLA Indicators](/client/processes/list) |
| D-101 | Does a process record carry a monetary value (column totals, weighted forecast, stage probabilities), and should a kiosk walk-in registration create a deal and with what amount? | Pipeline value and forecast depend on this. | [Walk-In Registration, Voice Intake & Booking](/ai-receptionist/checkin/walk-in), [Clinical Process Pipeline Kanban Board](/client/processes/kanban), [Process Instances Data Table & SLA Indicators](/client/processes/list) |
| D-103 | Can a card move to any stage or only adjacent ones, and are final (won/lost) stages locked? | Stage movement rules are undefined. | [Process: Record Detail Drawer](/client/processes/detail-drawer), [Clinical Process Pipeline Kanban Board](/client/processes/kanban), [Process Instances Data Table & SLA Indicators](/client/processes/list) |
| D-105 | Should Admin role-targeted tasks appear in clinic My Tasks (how is the role matched to a user), should Admin tasks target specific organisations, and keep or drop the STAGE column in /admin/tasks? | Admin and clinic task scopes overlap. | [Corporate Tasks, Cross-Org Delegation and Governance](/admin/tasks), [My Tasks: Assigned Clinic and Admin Work Inbox](/client/tasks/my-tasks) |
| D-106 | Is Client Portal share disabled for Admin tasks, and should portal-scoped tasks with no named patient appear for every patient? | Patient-visible task exposure. | [Corporate Tasks, Cross-Org Delegation and Governance](/admin/tasks), [Tasks by me: Team Delegation, Patient Tasks and Sharing](/client/tasks/tasks-by-me), [Patient My Tasks, Care Protocols and Live Sync](/companion/tasks) |
| D-107 | Who receives each task notification (assignee, observers, creator, platform admin), and should the Task Assigned chat notice be a card? | Recipients are unspecified. | [Corporate Tasks, Cross-Org Delegation and Governance](/admin/tasks), [My Tasks: Assigned Clinic and Admin Work Inbox](/client/tasks/my-tasks), [Tasks by me: Team Delegation, Patient Tasks and Sharing](/client/tasks/tasks-by-me), [Patient My Tasks, Care Protocols and Live Sync](/companion/tasks) |

### Workflow automation and forms

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-111 | After a form submission, should a task be created and staff notified, and should the new client enter the stage and fire stage automations? | No automation event is emitted today. | [Web Forms: Intake Forms, Sharing and Client Creation](/client/web-forms) |
| D-112 | Where are forms publicly hosted and when does sharing actually send SMS, WhatsApp or email; is conditional logic in forms in scope? | Sharing is simulated. | [Web Forms: Intake Forms, Sharing and Client Creation](/client/web-forms) |

### Appointments and scheduling

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-115 | Are Day/Week views with provider columns required for MVP, and does clicking an appointment open Details or Reschedule? | Calendar scope undefined. | [Appointments Calendar: Month Grid and Day Panel](/client/appointments/calendar) |
| D-117 | Is overlap the conflict rule, do completed or no-show appointments free the slot, can staff override with a warning, and may reschedule change provider, service or location; what are the patient reschedule and cancel rules (24-hour, reason, who is told)? | Scheduling integrity and patient rules. | [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Appointments Calendar: Month Grid and Day Panel](/client/appointments/calendar), [Appointments List: Workflow Table, Stage Moves, Import and Export](/client/appointments/list), [Visits: Booking, Prepaid Booking and Visit List](/companion/appointments) |
| D-120 | Is a time-based reminder (for example 24 hours before) required, or is the stage-entry WhatsApp step enough? | Reminder mechanism differs. | [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Appointments List: Workflow Table, Stage Moves, Import and Export](/client/appointments/list) |

### Kiosk, check-in and queue

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-122 | Should kiosk or phone check-in set the appointment to Arrived (with arrival time, wait time, token, Mark Arrived button), should phone check-in create the same token and station allocation (geofence, notify doctor), and should check-in enforce early and late arrival windows? | Check-in behaviour differs across channels. | [Scheduled Check-In & Token Issuance](/ai-receptionist/checkin/scheduled), [Walk-In Registration, Voice Intake & Booking](/ai-receptionist/checkin/walk-in), [Live Sync, Duplicate Protection & Kiosk Resilience](/ai-receptionist/settings/architecture), [Queue Rules, Token Prefixes & Onboarding Default](/ai-receptionist/settings/queue), [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Appointments List: Workflow Table, Stage Moves, Import and Export](/client/appointments/list), [AI Receptionist Settings](/client/settings/reception), [Today: Visit, Care Pathway and Check-in](/companion/today) |
| D-123 | How are Currently Serving, Patients Ahead, Estimated Wait and shortest queue defined (one rule for check-in, summary, My Visit and portal; live updates), and who owns the queue position? | Wait numbers are shown without a formula. | [Scheduled Check-In & Token Issuance](/ai-receptionist/checkin/scheduled), [Walk-In Registration, Voice Intake & Booking](/ai-receptionist/checkin/walk-in), [Active Visit & Live Queue Tracker](/ai-receptionist/my-visit/tracker), [Live Sync, Duplicate Protection & Kiosk Resilience](/ai-receptionist/settings/architecture), [Queue Rules, Token Prefixes & Onboarding Default](/ai-receptionist/settings/queue), [AI Receptionist Settings](/client/settings/reception), [Today: Visit, Care Pathway and Check-in](/companion/today) |
| D-124 | Is the token one sequence per station per day with station prefixes from settings (fixed or editable), when does it reset, and how is station type set for Products and Services rooms? | Token and prefix rules conflict between PRD files. | [Scheduled Check-In & Token Issuance](/ai-receptionist/checkin/scheduled), [Walk-In Registration, Voice Intake & Booking](/ai-receptionist/checkin/walk-in), [Active Visit & Live Queue Tracker](/ai-receptionist/my-visit/tracker), [Queue Rules, Token Prefixes & Onboarding Default](/ai-receptionist/settings/queue), [Clinic Rooms & Desks and Stage Guidance Cards](/ai-receptionist/settings/stations), [AI Receptionist Settings](/client/settings/reception) |
| D-126 | If a verified patient is in no AI-connected process, what should Next Step show, and should Default Onboarding Process list live Workflows (and which wins over the appointment default)? | Kiosk routing for patients outside workflows is undefined. | [Process Stage & Personalized Next-Step Guidance](/ai-receptionist/my-visit/next-step), [Queue Rules, Token Prefixes & Onboarding Default](/ai-receptionist/settings/queue), [Clinic Rooms & Desks and Stage Guidance Cards](/ai-receptionist/settings/stations), [AI Receptionist Settings](/client/settings/reception) |
| D-127 | Which AI channels read Knowledge Base sources (kiosk voice, phone agent, chatbots) and how does process/stage scope apply to someone not yet in a workflow? | AI answer sources are undefined. | [Knowledge Base: Reference Sources for the AI](/client/knowledge-base), [Workflows: Processes, Stages, AI Behaviour and Stage Automations](/client/workflows) |
| D-128 | How is the front desk alerted by Call Staff (notification, task, queue entry) and which kiosk; and should a stage move notify anyone by default or only via automations; is reschedule notification automatic, opt-in or automation-only? | Staff alert and notification triggers are undefined. | [Split Kiosk Shell, Dock, Timer & Staff Alert](/ai-receptionist/avatar/kiosk-shell), [Live Sync, Duplicate Protection & Kiosk Resilience](/ai-receptionist/settings/architecture), [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Appointments Calendar: Month Grid and Day Panel](/client/appointments/calendar), [Clinical Process Pipeline Kanban Board](/client/processes/kanban) |

### AI behaviour, bots and emergencies

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-133 | What is the runtime for bot vs human routing: first responder, transfer phrases, routing modes, out-of-office text, channel order (PRD bot first; built clinician first), should Messages bot and Care Bot be one per-patient thread, who answers when human first, should bot answers carry buttons and balance, and where do clinic hours come from? | Settings exist but are not applied. | [Chats: Companion Channel](/client/chat/companion), [Chats: Website Channel](/client/chat/website), [Messages: Care Chat Bot, Clinician and Care Groups](/companion/chat/chat) |
| D-134 | Are model choice, temperature, emergency guardrail and speech rate client or admin settings (single or several active models), what do tenants get when no model or voice is active, and where do context window and latency come from? | Ownership and defaults of AI settings are unclear. | [AI Voices and Models: Global Availability Switchboard](/admin/ai-voices-models), [AI Voices, LLM Model Bindings & Speech Profiles](/client/settings/voices) |

### Messaging channels and compliance

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-136 | Are templates allowed on SMS or WhatsApp only, what are the template approval states and who sets them (Meta webhook vs manual), and what happens when a variable has no value? | Template compliance is undefined. | [Chats: SMS Channel](/client/chat/sms), [Chats: WhatsApp Channel & Workflow Automation](/client/chat/whatsapp) |
| D-137 | What are attachment limits and allowed types per channel (25MB exceeds carrier limits), accepted portal file types and sizes, and how do staff verify patient uploads (PDF viewer, zoom, watermark)? | Limits conflict across PRDs and carriers. | [Chats: Inbox and Care Groups](/client/chat/chat), [Chats: Companion Channel](/client/chat/companion), [Messages: Care Chat Bot, Clinician and Care Groups](/companion/chat/chat), [Documents: Records Vault and Uploads](/companion/documents) |
| D-139 | Should the inbox offer an All channels view, what is the thread sort rule, and is the number selector a list filter, outbound sender or both (persisted per user)? | Inbox structure differs from PRD. | [Chats: Inbox and Care Groups](/client/chat/chat), [Chats: SMS Channel](/client/chat/sms), [Chats: WhatsApp Channel & Workflow Automation](/client/chat/whatsapp) |
| D-140 | Is open/resolved status with Unread and Assigned-to-me views for all channels, where does Resolve live, which roster is the assignee source and should assignment notify? | Thread ownership model undefined. | [Chats: Inbox and Care Groups](/client/chat/chat), [Chats: Companion Channel](/client/chat/companion), [Chats: SMS Channel](/client/chat/sms), [Chats: Website Channel](/client/chat/website), [Chats: WhatsApp Channel & Workflow Automation](/client/chat/whatsapp) |

### Notifications and patient profile

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-144 | Is notification scope per organisation or per user, are channels added, and should the dashboard show a notifications panel? | Notification model is unspecified. | [Overview: Analytics Dashboard](/client/overview), [Settings: Notification Preferences](/client/settings/notifications) |
| D-145 | Which profile fields can a patient edit directly vs by request, does changing phone/email need re-verification, and where do notification preferences live and who honours them? | Identity changes without verification are a security risk. | [Companion: Sign-in, Session and Profile](/companion/access) |
| D-146 | Where do a patient's prescriptions come from, should prices show, is pharmacy a drawer item or a stage, and how are refills routed? | Portal prescriptions have no source module. | [Pharmacy: Pickup and Prescriptions](/companion/pharmacy) |
| D-147 | Is there autosave and drafts, progress bar, mandatory signature per form type, lock after submit, what must the cryptographic timestamp prove, and does consent signing belong in the stage drawer or Forms? | Signed-form legal meaning is unclear. | [Forms: Intake, Consent and Signature](/companion/forms), [Today: Visit, Care Pathway and Check-in](/companion/today) |

## 4. P2 decisions (42)

### Naming, scope and what the PRD describes

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-06 | Should every destructive action ask for confirmation (and remove dead pages), including deleting a stage automation? | Confirmation is inconsistent across admin and workflow screens. | [Admin: Knowledge Base Templates](/admin/admin-knowledge-base), [Admin: Workflows](/admin/admin-workflows), [Sections & Fields: Fields Tab (Global Custom Field Registry)](/admin/custom-fields/fields), [Sections & Fields: Sections Tab (Field Groups on Record Profiles)](/admin/custom-fields/sections), [Document Templates: Master Registry](/admin/document-templates), [Admin: Form Templates](/admin/form-templates), [Industries: Industry Category Tab](/admin/industry-category/categories), [Roles and Permissions: Tenant Role Templates and Departments](/admin/roles), [Sidebar Navigation Templates](/admin/sidebar-config), [User Management: Admin Users and Admin Roles](/admin/users), [Workspace Billing, Orders & Subscriptions](/admin/workspace-billing), [Web Forms: Intake Forms, Sharing and Client Creation](/client/web-forms), [Workflows: Processes, Stages, AI Behaviour and Stage Automations](/client/workflows) |
| D-07 | Is Insurance and Claims one entity or two, and does Tasks get an Add Workflow button? | Workflow entity list differs between PRD and build. | [Workflows: Processes, Stages, AI Behaviour and Stage Automations](/client/workflows) |
| D-09 | Which document tag syntax ({{patient.name}} vs {client_name}) and category list is canonical? | Two tag syntaxes exist. | [Document Templates: Master Registry](/admin/document-templates) |
| D-10 | Which additional guide topics are required, and should unknown topics show not found? | Guide content scope is undefined. | [In-app Product Guide](/client/help/guide) |

### Roles, permissions and access control

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-21 | Which roles may delete a task, and does Tasks by me mean created by me (and can practice managers see all practice tasks)? | Task delete and visibility rules are undefined. | [Corporate Tasks, Cross-Org Delegation and Governance](/admin/tasks), [Tasks by me: Team Delegation, Patient Tasks and Sharing](/client/tasks/tasks-by-me) |

### Client identity, matching and records

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-25 | Are contact categories, saved filters and section layouts org-wide (admin-managed/shared) or per user? | Built layout changes apply to all contacts; scope of the others is unspecified. | [Clients: Contacts Directory and Profile](/client/clients) |
| D-26 | What are the CSV import rules (column mapping, duplicate handling, error report) and does export cover the current filter or the whole database? | Import/export behaviour is unspecified. | [Clients: Contacts Directory and Profile](/client/clients) |
| D-27 | Should the client profile have Claims, Calls, Chats and Tasks tabs, or are activity entries enough? | PRD and build differ. | [Clients: Contacts Directory and Profile](/client/clients) |
| D-29 | Should seed/demo contacts be deletable and editable like any other? | Demo data behaviour is undefined. | [Clients: Contacts Directory and Profile](/client/clients) |
| D-31 | What should be logged for inbox threads with no linked client, and where? | Messages from unlinked threads leave no trace. | [Chats: Inbox and Care Groups](/client/chat/chat) |

### Authentication, onboarding and invitations

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-49 | Are the voice and quick-form onboarding variants shipped, replacing the wizard, or deleted, and which is the default? | Three variants exist. | [Practice Onboarding Wizard and Plan Recommendation](/client/auth/onboarding) |
| D-52 | Should My Profile always open the signed-in user's own record, and does every user manage their own notification preferences? | Today only System Admin manages notifications. | [My Profile, Notifications Shortcut and Not-Found Page](/client/account/profile) |
| D-53 | What is the referral reward formula, per-plan rate, payout method, cap and attribution method? | Referral rules are undefined. | [Refer and Earn Programme](/client/account/refer-and-earn) |

### Payments, refunds and revenue definitions

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-73 | Should the patient balance be broken down by copay, diagnostics, pharmacy, and which invoice categories apply? | Portal billing detail is unspecified. | [Billing: Balance, Invoices and Payment](/companion/billing) |
| D-74 | Should inactive catalogue items exist (toggle, Status column, historic invoices), which category list is canonical (can users add categories), and should non-bookable items have an editable duration? | Catalogue model differs from PRD. | [Product & Services Catalog Management](/client/services) |

### Claims and clinical documentation

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-80 | When Scribe starts without context and Invoice, Insurance or Claim is chosen as linked entity, must the user pick the specific record? | Orphan links possible. | No page raises it yet |
| D-81 | Which speech-to-text engine is named in the product (Whisper vs Deepgram Nova-2 Medical)? | PRD and help copy disagree. | [AI Scribe: Ambient Consultation Notes](/client/scribe) |
| D-82 | What do the 1-5 star ratings on calls and Scribe sessions measure and where are they reported? | Ratings have no definition. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs), [AI Scribe: Ambient Consultation Notes](/client/scribe) |

### Calls, call logs and metrics

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-86 | Which columns (Phone, Assigned Process vs Previous/Last Stage) and which call-detail surface (drawer vs /call-logs/:id page) are canonical? | PRD and build differ. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs) |
| D-88 | What is the retry policy (what counts as retry, maximum attempts, spacing)? | Retry tab exists without rules. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs) |
| D-89 | Should a call that books an appointment link to it, and can staff create a task from a call? | Cross-module links are missing. | [Call Logs, Telephony Hub & AI Transcription](/client/call-logs) |

### Dashboard, reports and admin analytics

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-91 | Which tasks appear in Active Tasks on the Overview (mine or team, which statuses, admin-scope tasks)? | Scope is unspecified. | [Overview: Analytics Dashboard](/client/overview) |
| D-93 | Can filter changes in the viewer be saved back to the report or as a new report, and what should % Total do? | Viewer behaviour is unspecified. | [Reports: Library, Viewer and Builder](/client/reports) |
| D-94 | Is CSV export enough, or are XLSX and PDF required? | PRD requires more than build. | [Reports: Library, Viewer and Builder](/client/reports) |
| D-97 | What is the Process Movement metric set and bottleneck rule (dwell threshold)? | Bottleneck flagged without rule. | [Product Analytics: Overview, Calls, Usage, Process Movement and Revenue](/admin/product-analytics) |
| D-99 | What are the formulas for Submissions 7d, Active forms, Top performer, Usage (plan limit 300), execution count/success rate/audit log on the rules table, and Runs this week? | Workflow and form tiles lack formulas. | [Automation: Event Rules Registry and Rule Builder](/client/automation), [Web Forms: Intake Forms, Sharing and Client Creation](/client/web-forms) |

### Process pipeline and tasks

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-102 | What starts the days-in-stage clock and is the SLA threshold configured per stage in Workflows? | Timers have no start rule. | [Clinical Process Pipeline Kanban Board](/client/processes/kanban), [Process Instances Data Table & SLA Indicators](/client/processes/list) |
| D-104 | Is Responsible per process record or per client, and which List row and bulk actions (Edit, Delete, bulk reassign, move, Trigger Calls) are in scope? | Today Responsible is the client owner. | [Process Instances Data Table & SLA Indicators](/client/processes/list) |
| D-108 | Does Mark Completed close the task for everyone or just my deliverables, how does a creator reach Overall Completion, and what happens to completion on edit? | Completion semantics are ambiguous. | [Corporate Tasks, Cross-Org Delegation and Governance](/admin/tasks), [My Tasks: Assigned Clinic and Admin Work Inbox](/client/tasks/my-tasks), [Tasks by me: Team Delegation, Patient Tasks and Sharing](/client/tasks/tasks-by-me) |
| D-109 | Is recurrence created on completion or a fixed schedule (copying deliverables and people), and should a passed deadline move the task to Task Overdue? | Recurrence and overdue stage rules are undefined. | [My Tasks: Assigned Clinic and Admin Work Inbox](/client/tasks/my-tasks), [Tasks by me: Team Delegation, Patient Tasks and Sharing](/client/tasks/tasks-by-me) |

### Workflow automation and forms

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-113 | What should Temporary Disable do, must once-per-event be persistent and longer cycles blocked at save, and should check-in rules exist? | Rule behaviour is undefined. | [Automation: Event Rules Registry and Rule Builder](/client/automation), [Workflows: Processes, Stages, AI Behaviour and Stage Automations](/client/workflows) |

### Appointments and scheduling

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-116 | Rooms: keep auto-allocation, add manual override, or both; is a room double-booking warning required; and how do cancelled and no-show appointments look? | Room logic is partly built. | [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking), [Appointments Calendar: Month Grid and Day Panel](/client/appointments/calendar) |
| D-118 | Are buffers set per provider, service or location and do they apply in seat mode; do slots step by duration or fixed 15-minute marks; keep the cap of 3 shifts per day; are partial days off stored as time windows? | Availability engine rules. | [Appointments Availability: Weekly Hours and Days Off](/client/appointments/availability), [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking) |
| D-119 | Which booking sources can staff choose? | List of sources unspecified. | [Appointments: Booking Drawer and Lifecycle](/client/appointments/booking) |
| D-121 | Should Today show every assigned pathway or only the most recently moved, and should a patient ever see a clinic switcher? | Companion Today screen scope. | [Companion: Sign-in, Session and Profile](/companion/access), [Today: Visit, Care Pathway and Check-in](/companion/today) |

### Kiosk, check-in and queue

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-125 | Should kiosk departments come from an explicit Room field, should Pharmacy/Labs/Restrooms always appear, should rooms table and kiosk room card show source badge, attached service, clinician, walking time and Start Check-in? | Department mapping uses service-name keywords. | [Clinic Zones & Department Directory](/ai-receptionist/directions/departments), [Voice Deep-Linking & Turn-by-Turn Room Guide](/ai-receptionist/directions/rooms), [Clinic Rooms & Desks and Stage Guidance Cards](/ai-receptionist/settings/stations), [AI Receptionist Settings](/client/settings/reception) |
| D-129 | Where should Not me lead, and should the 60-second timer pause during payment save or face capture? | Kiosk flow details. | [Split Kiosk Shell, Dock, Timer & Staff Alert](/ai-receptionist/avatar/kiosk-shell), [Identity Gate & Face Biometrics](/ai-receptionist/checkin/identity-biometrics), [Biometric Consent, Minor Safeguards & Revocation](/ai-receptionist/my-visit/biometric-consent), [Live Sync, Duplicate Protection & Kiosk Resilience](/ai-receptionist/settings/architecture) |
| D-130 | Should Greeting Phrase support per-language versions, where do Support Phone/Email appear on the kiosk, and what validation applies to Support Email, Support Phone and hex colour? | Kiosk branding fields unspecified. | [AI Receptionist Settings](/client/settings/reception) |
| D-131 | Should KB tag presets be clinic-specific, what is the KB ID for, and what happens when file processing fails? | KB source management is unspecified. | [Knowledge Base: Reference Sources for the AI](/client/knowledge-base) |

### Messaging channels and compliance

| ID | Decision | Why it matters | PRD pages that raise it |
| :--- | :--- | :--- | :--- |
| D-141 | What is the source of delivery and read receipts per channel (does Website have them)? | Receipts are shown without a source. | [Chats: Inbox and Care Groups](/client/chat/chat), [Chats: Companion Channel](/client/chat/companion) |
| D-142 | What belongs in per-channel message actions (Copy, Quote, Resend, Forward) and where do they live? | UI detail. | [Chats: SMS Channel](/client/chat/sms) |
| D-143 | Website widget: branch-synced read-only hours or custom days/times/timezone, and where does Test Widget Chat live? | Settings differ between PRD and build. | [Chats: Website Channel](/client/chat/website) |

## 5. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Generated from the decision register and the decision notes in every PRD page. |
