# G10 — Client Settings — Gap Analysis
_Sources:_ PRD `content/client/settings/{organization,team,security,audit-logs,billing,voices,custom-fields,integrations}.md` (reception.md excluded, belongs to another agent). Cross-read for context: `content/admin/plans/*.md`, `content/admin/custom-fields/fields.md`. | Prototype (`E:\mantra-assist\src`): routes in `app/routes.tsx:246-263,298-299,334-335`; `app/pages/Settings.tsx` (13,346 lines), `settings-constants.ts`, `ManageTeamMember.tsx`, `UserManagement.tsx`, `Payments.tsx`, `Transactions.tsx`, `admin/AdminAuditLogs.tsx`, `app/components/settings/**`, `components/team/**`, `components/billing/**`, `lib/{plansBillingStore,auditLogsStore,teamStore,useVoiceStore,aiModelsStore,integrationsRegistry,notificationSettingsStore}.ts` | Analysed 2026-11-12
_Method note:_ three helper agents were started for prototype detail; they were cut off by the rate limit. Everything below was verified directly by the lead agent (all citations opened at the line).

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
|---|---|---|---|---|---|---|---|
| Organization (organization.md) | 0 | 3 | 2 | 1 | 1 | 2 | 25% |
| Team + manage member (team.md) | 0 | 1 | 6 | 1 | 3 | 9 | 6% |
| Security (security.md) | 0 | 1 | 2 | 1 | 2 | 3 | 13% |
| Audit Logs (audit-logs.md) | 0 | 3 | 1 | 0 | 1 | 5 | 38% |
| Billing incl. /payments, /transactions (billing.md) | 0 | 5 | 5 | 1 | 0 | 8 | 23% |
| AI Voices / Models (voices.md) | 0 | 1 | 1 | 1 | 3 | 1 | 17% |
| Sections / Fields (custom-fields.md) | 0 | 5 | 2 | 0 | 0 | 1 | 36% |
| Integrations (integrations.md) | 0 | 4 | 1 | 0 | 1 | 4 | 40% |
| Numbers | 0 | 0 | 3 | 0 | 0 | 4 | No PRD |
| Notifications | 0 | 0 | 3 | 0 | 0 | 1 | No PRD |
| **Total** | **0** | **23** | **26** | **5** | **11** | **38** | |

Overall coverage: 21% (11.5 / 54) · PRD-backed coverage: 24% (11.5 / 48)

Reading the numbers: the eight PRD files are thin (1-2 features each, "figma codebase" style) and describe a clinic EHR product. The prototype is a much broader multi-vertical workspace. Nothing is a clean "Matches": every PRD feature is either narrower than, named differently from, or absent in the build.

## Route map
| Route(s) | Page file | PRD file |
|---|---|---|
| `/settings`, `/settings/:tab`, `/settings/:tab/:subtab`, `/settings/billing/:subtab`, `/billing`, `/billing/:subtab` (all behind a guard that allows only role `SystemAdmin`) | `app/pages/Settings.tsx` (tab chosen by URL; aliases at 834-865) | per tab below |
| `/settings/organization` (default; also receives `/settings/security`) | Settings.tsx:4700 | organization.md (security.md for the policy drawer) |
| `/settings/team` (`users`, `roles`; sub-tabs Users / Roles / Departments) | Settings.tsx:4889 | team.md |
| `/settings/team/:id` | `ManageTeamMember.tsx` (orphan, see G10-E-07) | none (team.md closest) |
| `/settings/billing`, `/settings/billing/plans`, `/settings/billing/credit-usage`, `payments`, `transactions` | Settings.tsx:5354; `WorkspaceBilling{Overview,Plans,CreditUsage}Tab.tsx`; embeds `Transactions.tsx` | billing.md |
| `/payments` | `Payments.tsx` (legacy page, no guard) | billing.md (contradicts, see E-24) |
| `/transactions` | `Transactions.tsx` (no guard) | billing.md |
| `/settings/voices` (`voice-config`; sub-tabs Models / Voices) | Settings.tsx:6842 | voices.md |
| `/settings/numbers` (maps to the Integrations tab, telephony sub-tab, Settings.tsx:853-855) | Settings.tsx:4148 (renderPhoneNumbersSection) rendered ~7848; Add Number modal 9429+ | none |
| `/settings/sections-fields` (also `custom-fields`, `layout`) | Settings.tsx:7228 | custom-fields.md |
| `/settings/integrations` | Settings.tsx:7773; `IntegrationConfigDrawer.tsx` | integrations.md |
| `/settings/audit-logs` | Settings.tsx:7763 renders `admin/AdminAuditLogs.tsx` | audit-logs.md |
| `/settings/notifications` (`/account/notifications` redirects here) | `NotificationsSettingsTab.tsx` (Settings.tsx:7768) | none |
| `/settings/security` | redirected to the Organization tab (Settings.tsx:862-863). The security UI lives in a drawer: `OrganizationDetailDrawer.tsx` "Security" tab and `components/settings/SecurityTab.tsx` inside the member drawer | security.md |
| `/users` (client, no guard) | `UserManagement.tsx` | none (see E-09) |
| `/admin/settings/users`, `/admin/users` | `admin/AdminUserManagement` | cross-reference only (admin module) |
| `/admin/settings/logs`, `/admin/logs` | `admin/AdminAuditLogs` (platform page) | cross-reference only |
| `/admin/settings` | the same client `Settings.tsx` (routes.tsx:334) | cross-reference only |
| `/settings/reception` | excluded (other agent) | reception.md |

Left-nav entries (navigation.ts:169-238): Organization, Team, Billing, AI Voices / Models, Numbers, Sections / Fields, Integrations, Audit Logs, Notifications. All carry `roles: ["SystemAdmin"]`. There is no Security item. The in-page tab strip (Settings.tsx:3861-3875) omits Notifications and Security.

---

## A. Product map — as built

### A.1 Organization
- **Purpose:** The tab lists every organization visible to the signed-in workspace (a table with search and an industry-category filter) and opens an organization drawer to edit it. A "Create Organization" button adds one. It is not a single "practice profile" form.
- **Roles:** Only `SystemAdmin` reaches Settings (SettingsGuard.tsx:8-20). No finer gating.
- **Screens:** Organization list (Settings.tsx:4700-4888). Organization drawer with tabs General, Availability, Security (OrganizationDetailDrawer.tsx:428-452). Business Profile modal (Settings.tsx:12966; BusinessProfileModal.tsx). Locations section (OrganizationLocationsSection.tsx).
- **Flow, edit an organization:**
  1. Click the organization name in the table, the drawer opens.
  2. Edit name, email, phone, industry, location(s), status, logo, timezone, custom-field values, hours.
  3. Logo upload rejects files over 2 MB (drawer:215-216) and shows a toast on success or removal.
  4. Save validates only that the name is filled (drawer:340-343), then calls the page-level save.
  5. The page-level save writes name, email, phone, industry category, industry, location(s) and status only (Settings.tsx:1172-1183). Logo, timezone and the other drawer fields are not written (see G10-E-01).
- **Flow, create organization:** modal asks name, email (both required), category, industry, location (Settings.tsx:1186-1200 handler); organization is added through the organization context.
- **Flow, locations:** add a location (name required, address parts optional, "Online" variant), mark one primary, set a schedule and days off. Saved per organization in browser storage (OrganizationLocationsSection.tsx:141-160, 321-360). Appointment-room and booking filters use these locations (AddTeamMemberDrawer.tsx:111-125 requires at least one location when "can book appointments" is on).
- **Business rules:** email must match a basic pattern in the create path (Settings.tsx:3890 for the legacy save). No confirmation on location delete was observed.
- **KPIs (table columns):** Users count: "hardcoded – formula undefined" (always 1, Settings.tsx:1144). Created On: "hardcoded – formula undefined" (fixed string, Settings.tsx:1145). Preferred time: "hardcoded – formula undefined" (Settings.tsx:1142).
- **States:** empty table state not verified; loading not applicable (local data).
- **Cross-module:** organization industry category and location feed plan selection (WorkspaceBillingPlansTab.tsx:79-98) and field scoping (FieldRegistryContext.tsx:757-830).

### A.2 Team (members, roles, departments, manage member)
- **Purpose:** Manage workspace users, role definitions with a permission matrix, and departments.
- **Roles:** `SystemAdmin` only for the page. The `Role` type allows `SystemAdmin | Admin | Manager | Agent | Reception | string` (navigation.ts:32). The signed-in role is read from browser storage and defaults to SystemAdmin (AuthContext.tsx:27-28). **No role beyond the route guard is checked anywhere in the Team screens.**
- **Screens:** Users table, Roles table, Departments table (sub-tabs with counts, Settings.tsx:4889-4900). Add User drawer. Role drawer. Department drawer. Member drawer with Personal info / Calendar / Availability / Days off / Services / Security tabs (TeamMemberDrawer.tsx:103,186,1513-1516). Delete-user confirmation modal (Settings.tsx:9412).
- **Users table:** columns Name, Role, Email, Created At, Status, Credits, Usage Balance (Settings.tsx:5089-5185). Filter presets All / Admins / Members & Staff with counts (4912-4930). Search by name or email. Row actions: Edit, Make Administrator or Remove Administrator, Remove (5187-5222).
- **Flow, add user:**
  1. Click "Add User" (primary action, Settings.tsx:4958-4985).
  2. Drawer asks one name field, email, department, role (list: Admin, Manager, Specialist, Reception, Sales, Agent, hardcoded, AddTeamMemberDrawer.tsx:15-22), "can book appointments" and available locations.
  3. Validation: name and email required, email pattern, at least one location if booking is on (AddTeamMemberDrawer.tsx:111-125).
  4. Save creates the member immediately as Active (status true) in the team store and closes. **No email invitation is sent, there is no Pending state, no resend, no expiry** (AddTeamMemberDrawer.tsx:135-158).
  5. **No seat check against the plan** happens (G10-E-05).
  6. A second, older Add User drawer is bound to the same open flag and renders as well (Settings.tsx:8783 and 13334-13342, G10-E-10).
- **Flow, make or remove administrator:** one click, changes the role text to "Admin" or "Member", toast, no confirmation (5196-5215).
- **Flow, remove:** opens a confirmation modal, confirm deletes the user from the list (3953-3963, 9412).
- **Flow, edit:** opens the member drawer. Users and their settings persist to the team store (Settings.tsx:1563-1567).
- **Roles sub-tab:** Create Role opens a drawer with a module-by-action matrix (read, add, edit, delete, export, import; scope allow/deny/own style) (RolesPermissionsDrawer.tsx; types in settings-constants.ts:26-48). Seed roles Admin, Manager, Executive (RolesPermissionsDrawer.tsx:117,136,~155). Roles persist to **session** storage only (Settings.tsx:1381-1399).
- **Enforcement:** the permission matrix is saved on the user and role but no page or button reads it (permission checks exist only in the field-registry context; nothing in navigation, pages or actions). See G10-E-03.
- **`/settings/team/:id` page:** a member-edit page that reads the user from navigation state, redirects to `/settings` if opened directly (ManageTeamMember.tsx:84,131-134), has calendar / availability / days-off / services tabs and a coarse view-or-write permission list. Nothing in the app links to it (G10-E-07).
- **`/users` page (client):** a separate user list with credits, add, edit, permissions modal, credit modal, stored in session storage, **outside the Settings guard** (UserManagement.tsx:67-72; routes.tsx:246). It is a second, unsynchronised user store (G10-E-09).
- **Not built:** NPI, state licence, taxonomy codes, licence expiry reminders; resend invite; invite expiry; active toggle on the table (handler exists but no control calls it, Settings.tsx:3917).
- **KPIs:** badge counts on sub-tabs and filter presets are computed (count of users, roles, departments; Admin count = users whose role text contains "admin", Settings.tsx:4912-4930). Credits column "0 / 0" and Usage Balance % are placeholders: "hardcoded – formula undefined" (Settings.tsx:5163-5180). Created At falls back to a fixed date (5142).
- **Cross-module:** members flagged "can book appointments" appear in Appointments; assigned services sync to the services catalogue (Settings.tsx:4029-4045); location map stored per member.

### A.3 Security
- **Purpose:** Authentication and session policies.
- **Screens:** no Security tab. `/settings/security` lands on Organization (Settings.tsx:862-863). Two UIs exist: (a) organization drawer "Security" tab with five accordion cards: robo-call shielding with sensitivity, auto-block spam and a blocked-numbers list; 2FA policy (enforce toggle, grace period 3 days default); session inactivity timeout (15m / 30m / 1h / 4h / 8h) with lock-on-idle; password complexity (length 8-16, special characters, numbers) (OrganizationDetailDrawer.tsx:258-279, 1243-1600). (b) per-member SecurityTab: change password, 2FA on/off with method, active sessions with "sign out others", idle timeout (15 / 30 / 60 / 240) (SecurityTab.tsx:35-101, 476-515).
- **Flow, org policy:** toggle or choose, the drawer state changes. Save writes only the profile fields, so none of these survive (OrganizationDetailDrawer.tsx:340-347; Settings.tsx:1172-1183).
- **Flow, member password:** current password only needs to be non-empty, new password at least 8 characters and matching (SecurityTab.tsx:80-92). No server or stored credential check.
- **Not built:** IP allowlist; any application-wide idle lock that fires after the timeout; enforcing 2FA at login.
- **Roles:** SystemAdmin only (via Settings).

### A.4 Audit Logs
- **Purpose:** Searchable activity trail.
- **Screen:** the Settings tab renders the same component used by the platform admin console, with a flag that only trims page chrome (Settings.tsx:7763-7765; AdminAuditLogs.tsx:72, 281, 381-382).
- **Data:** every user of the page reads one shared list in browser storage, seeded with platform events: organization updates for named clinics, telephony changes, orders by a billing worker, subscription changes, template edits (auditLogsStore.ts:57-260). Entries are written only by admin-side stores (users, roles, telephony, orders) (grep of `recordAuditLog`). Nothing records client activity (patient views, logins, exports).
- **Flow:** search (actor, email, target, entity id, summary, IP), filters Module / Action / Actor / Date (all, today, 7d, 30d), open a row for a drawer with before/after JSON and a "Navigate to" link into `/admin/...` pages (AdminAuditLogs.tsx:90-122, 500-530). Export to CSV of the filtered rows, file named `mantra_admin_audit_logs_<time>.csv` (126-171). Export is not logged and not signed.
- **Scope:** **no tenant or organization filter at all.** A client Settings user sees other organizations' and platform staff entries (G10-E-15). The platform page `/admin/settings/logs` is open to any signed-in user (G10-E-16).
- **KPIs:** none.

### A.5 Billing (subscription, plans, credits, transactions, payments)
- **Purpose:** The organization's own SaaS subscription. Sub-tabs: Plan Overview & Payment, Plans & Subscriptions, Credit Usage (Settings.tsx:5354-5430, URL parsing 820-830).
- **Roles:** SystemAdmin only under Settings. `/payments` and `/transactions` have no guard (routes.tsx:247,251).
- **Overview tab:** plan card (name, tier, price, cycle, renewal date), usage meter, seats included plus purchased, add-on credit and team-member purchase dialogs, payment methods, billing address, invoice list (WorkspaceBillingOverviewTab.tsx:140-170; Settings.tsx:5460-5830).
  - Renewal date: set at plan assignment to today plus 30 days (monthly) or 365 days (yearly) (plansBillingStore.ts:2326-2400).
  - Usage percent: credits consumed divided by total credits (plan credits plus add-on credits), capped at 100% with a 0.1% floor (WorkspaceBillingOverviewTab.tsx:156-159). Computed.
  - Seats: included seats plus extra seats purchased (145-147). Computed. Never compared to the team size anywhere.
  - Credit meter colour rules from the PRD (green/amber/red thresholds) were not found.
- **Plans tab:** category tabs (AI Receptionist, AI Scribe, EHR, RCM) filtered by the organization's industry; plan cards from the admin catalogue (tiers ordered Starter, Professional, Enterprise, Custom); monthly/yearly toggle; cart; add-on credits and extra seats (WorkspaceBillingPlansTab.tsx:73-130, 200-275).
  - **Flow, plan change:** click select on a plan. The subscription is replaced instantly (single active plan), seats and credits reset to the new plan, renewal date recalculated, toast "Switched to ... ". No confirm step, no payment, no proration, no check of current team size or usage (WorkspaceBillingPlansTab.tsx:229-236; plansBillingStore.ts:2326-2400).
  - **Flow, top-up:** choose a package or type a custom amount; cost is credits times the admin default price per credit (fallback $0.04); requires an active plan; credits and "recent packages" update and persist immediately (WorkspaceBillingPlansTab.tsx:240-256; plansBillingStore.ts:2596-2627). No payment method required, no invoice or transaction written.
  - **Flow, extra seats:** same pattern at the admin default price per extra member (fallback $20) (269-275).
  - **Flow, cart checkout:** add items, "Pay & Activate All" applies everything and shows a success toast with the total (1060-1080); no payment capture.
- **Credit Usage tab:** per-feature breakdown (Calls, SMS, Email, Workflows, AI Scribe) summed from deduction logs; any gap between the total consumed and the logged sum is added to Calls so the chart totals agree (WorkspaceBillingCreditUsageTab.tsx:72-105). Computed. Deduction history table. Four "simulate action" buttons that deduct credits (157-161, 501-528).
- **Payment methods:** add, set default, remove. Local state only (Settings.tsx:738, 5517-5531, 13138-13145). Remove has no confirmation.
- **Invoices:** four fixed rows INV-2026-001 to 004 with download toast (Settings.tsx:5706+, 5825).
- **`/payments`:** a different, older billing page with its own plan names (Starter, Basic, Professional, Enterprise), per-user pricing ($10 / $49 / $79), 2 seats, fixed renewal 2 Jun 2026, credit price $0.10, Confirm Changes / Buy Credits / Add Seats that only toast (Payments.tsx:26-63, 69-135, 169-188, 570-583, 1096-1157).
- **`/transactions` (also embedded under billing):** three stat tiles (Available 1,755, Used this month 1,245, Total purchased 3,500: "hardcoded – formula undefined"), a five-point chart and five fixed 2024 rows; export is a two-second fake (Transactions.tsx:11-46, 64-96).
- **Cross-module:** plans, credit packages, price per credit, seat packs and credit action rates come from the admin catalogue (plansBillingStore.ts; admin PRD `plans/*.md`). Credit deductions are recorded by `recordCreditDeduction` (plansBillingStore.ts:2265).

### A.6 AI Voices / Models
- **Purpose:** Decide which admin-published voices and models the workspace may use.
- **Screen:** Models and Voices modes with search and filters (provider, status; gender, accent, language) (Settings.tsx:6842-6900).
- **Inheritance:** only items the admin has switched on appear (models: Settings.tsx:3686-3688; voices: 3702-3703). The client adds a second switch, "clientEnabled", per item (useVoiceStore.ts:109-116; aiModelsStore.ts:139-146). Toggling saves immediately and states it becomes (or stops being) the default in Process Automations (Settings.tsx:3595-3626).
- **Preview:** play button speaks a canned greeting with the browser's built-in speech engine, fixed rate, pitch varied by gender (Settings.tsx:3636-3690). Not the vendor voice.
- **Not built:** model dropdown with a single active model, temperature slider, emergency guardrail prompt, speech-rate slider.
- **Voice catalogue seed:** OpenAI, ElevenLabs, Deepgram voices (settings-constants.ts:106-132).

### A.7 Numbers
- **Purpose:** Phone numbers with country routing.
- **Screen:** table of numbers (phone, country, priority, countries served, processes, provider, cost in/out, direction, status, verified) with column re-order saved in the browser, verify, edit, delete (Settings.tsx:4148-4650; seed rows 1934-1990).
- **Flow, add number:** "Add Number" opens a modal with options Free Vapi Number, Free Vapi SIP, Import Twilio, Import Vonage, Import Telnyx, BYO SIP Trunk (Settings.tsx:9429-9470). Each option's confirm button only shows a success toast and closes (9517, 9601, 9703, 9795, 9876). Nothing is added to the table (G10-E-34).
- **Flow, add country routing row (separate form):** requires phone (starts with +), country, provider; verified flag is auto-true for United States (2229-2275).
- **Assignment:** a number is linked to one or more processes and to the countries it serves (table columns; add form). A default number concept exists in the telephony list (2836-2890).
- **Verify:** Verify Caller ID modal flow (VerifyNumberModal.tsx, 1570 lines; opened from the row menu, Settings.tsx:4602).
- **Delete:** removes the row at once, no confirmation (2282-2285, 4635).
- **Pricing table:** per-country price list exists (settings-constants.ts:52-103) but the only purchase handler that reads it is never called (Settings.tsx:1915-1929). No credit charge, no number inventory search.
- **Persistence:** routing rows are page state; they reset on reload (seed returns).

### A.8 Sections / Fields
- **Purpose:** Manage fields and sections per entity.
- **Screen:** entity picker (Organization, Clients, Call logs, Processes, Appointments, Forms, Team, Services, Invoices, Claims; Settings.tsx:1717-1723), Fields and Sections modes, contact-category filter for Clients, field table with row actions (Settings.tsx:7228-7760).
- **Inheritance rules:** system fields and sections are always shown and locked (cannot edit or delete) (Settings.tsx:7554-7558, 7589; FieldRegistryContext.tsx:757-763). Other fields appear when their scoping rules match the active organization (industry category, industry, location, process) and for Clients the selected contact category (Settings.tsx:7412-7416; FieldRegistryContext.tsx:757-830). Admin and client fields live in one shared registry (FieldRegistryContext.tsx:625-626) and carry no owner marker.
- **Flow, add/edit field:** drawer reused from the admin console (AdminFieldDrawer). Types include text, number, money, dropdown, table, list and more; options list, required flag, section assignment, "visible to selected" (Settings.tsx:7385-7400, 7560-7580).
- **Delete:** browser confirm, then delete (7594-7597); bulk delete of selected custom items (7614-7627). Same for sections (7713-7750).
- **Copy key:** copies the field key (7580-7586).

### A.9 Integrations
- **Purpose:** Connect external systems.
- **Catalogue (categories):** CRM: Phorest, Bitrix24, HubSpot, Salesforce, Custom API, Custom Webhook. Telephony: Twilio, Tata Tele, Exotel, Zadarma, other. Mailbox: Gmail, Outlook, IMAP/SMTP. SMS: Twilio SMS. Marketing: Meta Lead Ads, WhatsApp Business (Settings.tsx:3170-3225). Tabs filter by category.
- **Flow, connect:** open card, drawer shows credential fields; "Test connection" waits about one second and then reports success with a fixed "HTTP 200, 124 ms" message if the required fields are non-empty (IntegrationConfigDrawer.tsx:125-153; Settings.tsx:2738-2748). Save marks connected, writes an activity log entry, and stores the config under a per-integration key (IntegrationConfigDrawer.tsx:156-189; integrationsRegistry.ts:513, 544-551).
- **Flow, disconnect:** red "Disconnect" in the drawer footer clears credentials and flips the flag, no confirmation (IntegrationConfigDrawer.tsx:191-201, 949-955).
- **Status badge:** from the stored flag, not a live ping. Twilio and Gmail are shipped as already connected (Settings.tsx:3200, 3207).
- **Extra:** WhatsApp numbers list with disconnect (Settings.tsx:2336-2370), field mapping and process selection for Bitrix, Salesforce, Meta forms, sync logs and schedule.
- **Not built:** Stripe Connect.

### A.10 Notifications
- **Purpose:** Choose which modules may raise in-app notifications.
- **Screen:** 13 module switches (Appointments, Billings, Calls, Chats, Clients, Dashboard, DocumentTemplates, Integrations, KnowledgeBase, Processes, Settings, Tasks, WebForms), Enable All / Disable All, "reset to defaults", desktop push permission request (NotificationsSettingsTab.tsx:34-60, 185-210; notificationSettingsStore.ts:13-26).
- **Behaviour:** changes autosave to one browser key (notificationSettingsStore.ts:3, 56-60) and are read by the notification store when raising items (isModuleNotificationAllowed). No channel choice (email/SMS) or per-user scope. Page copy says it applies to "this organization" (tab:105).

---

## B. Product map — per PRD

### B.1 organization.md
- **F-1 Practice Legal Profile & Custom Brand Assets:** logo upload (PNG/SVG, max 5 MB) used in header, invoices, companion portal; legal entity name and tax ID shown on receipts; brand primary colour (hex) for patient-facing surfaces. AC: logo renders in topbar and invoice headers.
- **F-2 Multi-Location Registry:** add location (name, street, city, state, ZIP, phone); locations drive appointment room selectors, booking dropdowns and calendar filters. AC: staff can filter calendars and rooms by location.
- Roles: Practice Administrator. No KPIs.

### B.2 team.md
- **F-1 Roster & Email Invitation:** list with avatar, email, role, department, status; invite modal (first name, last name, email, role Admin / Doctor / Nurse / Coordinator / Billing) sending a secure link; Active or Pending status; resend invite (7-day expiry, fresh token); active toggle that deactivates and revokes sessions without deleting history.
- **F-2 NPI and State Licence Registry:** 10-digit NPI with validation, state licence number with expiry and a 30-day warning; values flow into CMS-1500 claims and prescription footers.
- Roles: Practice Administrator, Physician. Silent on seat limits, permissions and who may invite.

### B.3 security.md
- **F-1:** enforce 2FA (TOTP) for all staff; inactivity timeout 5 / 15 / 30 / 60 min (15 recommended); IP allowlist (IP or CIDR). AC: after 15 minutes idle the app locks and asks for the password.

### B.4 audit-logs.md
- **F-1 Immutable HIPAA ledger:** timestamp, actor, action (LOGIN, PHI_VIEW, RECORD_EXPORT, PERMISSION_CHANGE), entity type, record id, IP; filter by action; signed CSV export that logs the export itself; filter by patient. AC: every chart view logged with actor, IP and UTC time. Silent on tenant vs platform scope.

### B.5 billing.md
- **F-1 Subscription tier display and credit balance:** plan card (Starter / Growth / Enterprise, monthly cost, renewal date, quotas); credit meter coloured green above 1,000, amber below 500, red below 100, real-time; top-up modal with 1,000 / 5,000 / 10,000 bundles charged to the saved Stripe card. AC: purchase increments the balance at once and logs an invoice. Module summary also mentions downloading past invoices and AI Voice / Scribe / SMS credit types.

### B.6 voices.md
- **F-1 Model binding and safety guardrails:** choose GPT-4o / Claude 3.5 / Gemini 1.5; temperature slider 0.0-1.0; mandatory emergency prompt that cannot be disabled. AC: emergency keyword returns the emergency directive.
- **F-2 Voice and speech speed:** voice dropdown (ElevenLabs, OpenAI) with preview; rate slider 0.8x-1.4x (summary says 1.5x).

### B.7 custom-fields.md
- **F-1 Entity Field Builder:** add field (label, unique API key, entity Client / Appointment / Process, type Text, Number, Dropdown, Multi-select, Date, Currency, Boolean); dropdown option manager with badge colours and ordering; required and visible-on-portal flags; sections as accordion groups (summary). Admin PRD (`admin/custom-fields/fields.md`) says admin master fields appear as selectable fields for clinic coordinators.

### B.8 integrations.md
- **F-1 Twilio and Meta WhatsApp binding:** Twilio SID, token, caller ID with Test Connection; WhatsApp WABA ID, phone number ID, system token; live Connected / Disconnected badge with error tooltips. Module summary also lists Stripe Connect keys and outbound webhooks.

---

## C. Findings
Status key: Match / Partial / Missing in PRD / Contradicts / PRD-only / Defect (see E).

### C.1 Organization
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-01 | Rule | Logo upload size and format | Contradicts or stale | organization.md § F-1.1 (max 5 MB, PNG/SVG) | OrganizationDetailDrawer.tsx:215-216 (2 MB) | Limit differs; format check not found. |
| G10-I-02 | Flow | Legal name and tax ID capture | Partial (PRD less detailed) | § F-1.2 | BusinessProfileModal.tsx:21; Settings.tsx:12966 | Built: business name, type, industry, region, registration ID type. Medical director not found. "Rendered on receipts" not verified. |
| G10-I-03 | Flow | Brand primary colour picker | PRD-only (not built) | § F-1.3 | none | No colour field in the drawer, modal or locations section. |
| G10-I-04 | Flow | Add location | Partial (PRD less detailed) | § F-2.1 | OrganizationLocationsSection.tsx:141-160, 321-360 | Built also: Online location, primary flag, per-location schedule and days off. Phone not captured at location level. |
| G10-I-05 | X-ref | Locations drive booking and filters | Partial (PRD less detailed) | § F-2.2 | AddTeamMemberDrawer.tsx:111-125; Appointments | Per-member location availability exists; room-level link not verified. |
| G10-I-06 | Flow | Organization list across all orgs, create organization, industry-category filter | Missing in PRD | none | Settings.tsx:4700-4888, 1183-1200 | The tab is a multi-organization manager. PRD describes one profile. Needs a decision on who may see or create other organizations (Q-12). |
| G10-I-07 | Flow | Locations schedule, days off, hours | Missing in PRD | none | OrganizationLocationsSection.tsx:257-315 | Built and working. |
| G10-I-08 | Flow | Drawer save loses most fields | Prototype defect | | see E-01 | |
| G10-I-09 | Metric | Users, created on, preferred time columns | Prototype defect | | see E-02 | "hardcoded – formula undefined". |

### C.2 Team
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-10 | Flow | Staff roster list | Partial (PRD less detailed) | team.md § F-1 | Settings.tsx:5089-5185 | Built columns: name, role, email, created, status, credits, usage. No avatar or department column. |
| G10-I-11 | Flow | Invite team member | Contradicts or stale | § F-1.1 | AddTeamMemberDrawer.tsx:15-22, 111-158 | PRD: first/last name, five roles, emailed secure link. Built: single name, six different roles, instant add, no email. |
| G10-I-12 | Flow | Pending status, resend invite, 7-day expiry | PRD-only (not built) | § F-1.2 | none | Pending type exists in the data model (Settings.tsx:223) but is never set. |
| G10-I-13 | Flow | Active toggle that deactivates and revokes sessions | PRD-only (not built) | § F-1.3 | handler Settings.tsx:3917 not wired | No row control, no session concept. See also G10-I-20. |
| G10-I-14 | Flow | NPI and state licence registry | PRD-only (not built) | § F-2 | none | No NPI, licence, taxonomy or expiry fields anywhere in Team. |
| G10-I-15 | Flow | Departments sub-tab (create, edit) | Missing in PRD | none | Settings.tsx:4889-4900; DepartmentDrawer.tsx | Built and working. |
| G10-I-16 | Flow | Roles sub-tab with module-by-action permission matrix | Missing in PRD | none | RolesPermissionsDrawer.tsx; CreateRoleDrawer.tsx; settings-constants.ts:26-48 | Built, but see enforcement defect. |
| G10-I-17 | Flow | Make / Remove Administrator | Missing in PRD | none | Settings.tsx:5196-5215 | One click, no confirmation. |
| G10-I-18 | Flow | Member drawer: calendar, availability, days off, services, security | Missing in PRD | none | TeamMemberDrawer.tsx:103,186; MemberLocationScheduleTab.tsx | Built and working. |
| G10-I-19 | Flow | Remove user with confirmation modal | Missing in PRD | none | Settings.tsx:3953-3963, 9412 | Built. |
| G10-I-20 | Rule | Who may manage the team: only SystemAdmin reaches Settings | Missing in PRD | none (team.md silent) | SettingsGuard.tsx:8-20; navigation.ts:177-186 | The PRD names Practice Administrator, Physician, Compliance Officer but no access rules (Q-03). |
| G10-I-21 | Rule | Seat limit vs plan on invite | Prototype defect | | see E-05 | Admin PRD says plans carry seat quotas (`admin/plans/plans.md`). |
| G10-I-22 | Rule | Role permissions enforced | Prototype defect | | see E-03 | [SECURITY] |
| G10-I-23 | Rule | Roles persisted | Prototype defect | | see E-04 | |
| G10-I-24 | Flow | Active toggle handler unwired | Prototype defect | | see E-06 | |
| G10-I-25 | Flow | `/settings/team/:id` page | Prototype defect | | see E-07 | |
| G10-I-26 | Metric | Credits, usage balance, created-at columns | Prototype defect | | see E-08 | "hardcoded – formula undefined". |
| G10-I-27 | Flow | `/users` client page | Prototype defect | | see E-09 | [SECURITY] |
| G10-I-28 | Flow | Duplicate Add User drawer | Prototype defect | | see E-10 | |
| G10-I-29 | Rule | Role list in Add drawer vs Roles tab | Prototype defect | | see E-11 | |

### C.3 Security
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-30 | Flow | Enforce 2FA toggle | Partial (PRD less detailed) | security.md § F-1.1 | OrganizationDetailDrawer.tsx:263-264, 1433-1500 | Built with a grace period (days to set up), which the PRD lacks. Not saved or enforced, see E-12. |
| G10-I-31 | Rule | Inactivity timeout options | Contradicts or stale | § F-1.2 (5 / 15 / 30 / 60) | OrganizationDetailDrawer.tsx:1538-1545 (15m to 8h); SecurityTab.tsx:481-497 (15 / 30 / 60 / 240) | Neither screen offers 5 minutes. Two screens disagree with each other. |
| G10-I-32 | Flow | IP allowlist | PRD-only (not built) | § F-1.3 | none | |
| G10-I-33 | Flow | Auto-lock after idle with password re-prompt | PRD-only (not built) | § F-1 AC | none found | A lock-on-idle switch exists but no listener acts on it. |
| G10-I-34 | Flow | Robo-call shielding, spam auto-block, blocked-numbers list, password complexity policy | Missing in PRD | none | OrganizationDetailDrawer.tsx:1243-1430, 1560-1600 | Built UI only. |
| G10-I-35 | Flow | Per-member security (password, 2FA method, sessions, idle timeout) | Missing in PRD | none | SecurityTab.tsx:35-101; TeamMemberDrawer.tsx:1513-1516 | Built UI. |
| G10-I-36 | Flow | Policies not persisted or enforced | Prototype defect | | see E-12 | [SECURITY] |
| G10-I-37 | Flow | Password change accepts any current password | Prototype defect | | see E-13 | [SECURITY] |
| G10-I-38 | Flow | Security tab unreachable | Prototype defect | | see E-14 | |

### C.4 Audit Logs
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-39 | Flow | Event table | Partial (PRD less detailed) | audit-logs.md § F-1.1 | AdminAuditLogs.tsx:72-122, 281+ | Columns similar. Action types are created / updated / deleted / login / export / assigned etc., not LOGIN, PHI_VIEW, RECORD_EXPORT. Modules are admin objects. |
| G10-I-40 | Flow | Action filter | Partial (PRD less detailed) | § F-1.2 | AdminAuditLogs.tsx:88-120 | Plus module, actor, date filters and text search. |
| G10-I-41 | Flow | CSV export | Partial (PRD less detailed) | § F-1.3 | AdminAuditLogs.tsx:126-171 | Export exists. Not signed. Export event not logged (E-18). |
| G10-I-42 | Flow | Patient record access events and patient filter | PRD-only (not built) | § F-1, worked example | none | Only admin mutations are recorded. No chart-view events. |
| G10-I-43 | Flow | Before/after drawer and entity link | Missing in PRD | none | AdminAuditLogs.tsx:440-530 | Built. |
| G10-I-44 | Rule | Tenant scope of the log | Prototype defect | | see E-15 | [SECURITY] Known issue confirmed. |
| G10-I-45 | Rule | Platform log page open to every signed-in user | Prototype defect | | see E-16 | [SECURITY] |
| G10-I-46 | Rule | Immutability | Prototype defect | | see E-17 | [SECURITY] |
| G10-I-47 | Rule | Export not audited | Prototype defect | | see E-18 | [SECURITY] |
| G10-I-48 | X-ref | Entity link goes to /admin pages | Prototype defect | | see E-19 | |

### C.5 Billing
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-49 | Flow | Active plan card | Partial (PRD less detailed) | billing.md § F-1.1 | WorkspaceBillingOverviewTab.tsx:140-170 | Shows name, tier, price, cycle, renewal, included seats and credits. |
| G10-I-50 | Rule | Plan names | Contradicts or stale | § F-1 (Starter / Growth / Enterprise) | WorkspaceBillingPlansTab.tsx (tiers Starter, Professional, Enterprise, Custom by category); Payments.tsx:69-135 (Starter, Basic, Professional, Enterprise) | Three different name sets. |
| G10-I-51 | Metric | Credit meter and colour thresholds (green above 1,000, amber below 500, red below 100) | Partial (PRD less detailed) | § F-1.2 | WorkspaceBillingOverviewTab.tsx:156-159 | Meter is a consumed-over-total percentage. The PRD thresholds (absolute credits) are not implemented. Also note PRD gap: values 500-1,000 undefined. |
| G10-I-52 | Flow | Top-up | Partial (PRD less detailed) | § F-1.3 | WorkspaceBillingOverviewTab.tsx:200-256; WorkspaceBillingPlansTab.tsx:240-256 | PRD bundles 1,000 / 5,000 / 10,000 at a Stripe card. Built: admin-defined packs or a custom amount at the admin per-credit price. No card is charged. |
| G10-I-53 | Rule | Purchase increments balance and logs an invoice | Partial (PRD less detailed) | § F-1 AC | plansBillingStore.ts:2596-2627 | Balance increments and persists. A "recent packages" entry is kept. No invoice or transaction record (E-21). |
| G10-I-54 | Flow | Download past tax invoices | Partial (PRD less detailed) | Module summary | Settings.tsx:5706-5830 | List and download button exist; data is fixed (E-23). |
| G10-I-55 | Flow | Plan change (select, cart checkout) | Missing in PRD | none | WorkspaceBillingPlansTab.tsx:229-236, 1060-1080 | PRD describes display only. Intended rules need a decision (Q-06). |
| G10-I-56 | Flow | Extra team seats purchase | Missing in PRD | none | WorkspaceBillingPlansTab.tsx:269-275; plansBillingStore.ts:2656 | Built. Seats are never checked against users (E-05). |
| G10-I-57 | Metric | Credit Usage tab: breakdown, deduction history, rates | Missing in PRD | none | WorkspaceBillingCreditUsageTab.tsx:72-105 | Computed: credits per feature from deduction logs; any shortfall versus total consumed is assigned to Calls. |
| G10-I-58 | Flow | Payment methods add, default, remove | Missing in PRD | none | Settings.tsx:5460-5531, 13138 | Built with local state; remove has no confirm (E-22). |
| G10-I-59 | Metric | Overview usage %, seats, renewal date | Missing in PRD | none | WorkspaceBillingOverviewTab.tsx:145-159; plansBillingStore.ts:2378 | Computed. Usage % = consumed / (plan + add-on credits), capped 100. Seats = included + extra. Renewal = assignment date + 30 or 365 days. |
| G10-I-60 | Flow | Plan change applied without confirmation, payment or checks | Prototype defect | | see E-20 | |
| G10-I-61 | Flow | Top-up without payment or record | Prototype defect | | see E-21 | |
| G10-I-62 | Flow | Remove payment method no confirm | Prototype defect | | see E-22 | |
| G10-I-63 | Metric | Fixed invoice rows | Prototype defect | | see E-23 | |
| G10-I-64 | Flow | `/payments` legacy page | Prototype defect | | see E-24 | |
| G10-I-65 | Metric | `/transactions` fixed figures | Prototype defect | | see E-25 | "hardcoded – formula undefined". |
| G10-I-66 | Rule | `/payments`, `/transactions` unguarded | Prototype defect | | see E-26 | [SECURITY] |
| G10-I-67 | Flow | Simulate-action buttons for clients | Prototype defect | | see E-27 | |

### C.6 AI Voices / Models
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-68 | Flow | Model selection | Contradicts or stale | voices.md § F-1.1 (single dropdown, default GPT-4o) | Settings.tsx:3686-3700, 3616-3626 | Built: admin-published list, per-model client on/off, several can be on. |
| G10-I-69 | Flow | Temperature slider | PRD-only (not built) | § F-1.2 | none | |
| G10-I-70 | Rule | Mandatory emergency guardrail prompt | PRD-only (not built) | § F-1.3 | none | Safety-relevant. |
| G10-I-71 | Flow | Voice list with preview | Partial (PRD less detailed) | § F-2.1 | Settings.tsx:3700-3760, 3636-3690; VoiceCard.tsx | Cards with filters (gender, accent, language), enable switch, preview. Providers include Deepgram. |
| G10-I-72 | Flow | Speech-rate slider | PRD-only (not built) | § F-2.2 | none | |
| G10-I-73 | Rule | Admin publishes, client enables | Missing in PRD | none | Settings.tsx:3688, 3703; useVoiceStore.ts:109-125 | Built and works: only admin-active items shown, client switch hides from automations. |
| G10-I-74 | Flow | Preview is not the real voice | Prototype defect | | see E-28 | |

### C.7 Sections / Fields
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-75 | Flow | Add custom field and field types | Partial (PRD less detailed) | custom-fields.md § F-1 | Settings.tsx:7385-7400; AdminFieldDrawer | Ten entities instead of three or four; more types (table, list). |
| G10-I-76 | Rule | Field key and uniqueness | Partial (PRD less detailed) | § F-1.1 | Settings.tsx:7580-7586 (copy key) | Key is shown and copyable; unique-key validation not verified. |
| G10-I-77 | Flow | Dropdown options | Partial (PRD less detailed) | § F-1.2 | Settings.tsx:7385-7395 | Options list present; badge colours and drag order not verified. |
| G10-I-78 | Rule | Required and visible flags | Partial (PRD less detailed) | § F-1.3 | Settings.tsx:7560-7580 | Required flag built; "visible on patient portal" appears as "visible to selected". |
| G10-I-79 | Flow | Sections | Partial (PRD less detailed) | Module summary | Settings.tsx:7699-7750 | Add, edit, delete, bulk delete. |
| G10-I-80 | Rule | Admin-defined fields inherited; system fields locked; org and process scoping | Missing in PRD | none (client PRD silent; admin PRD cross-reference only) | Settings.tsx:7412-7416; FieldRegistryContext.tsx:757-830 | Built. Contact-category filter for Clients also built. |
| G10-I-81 | Rule | Contact-category scoping of client fields | Missing in PRD | none | Settings.tsx:7413; contactCategoriesStore | Built. |
| G10-I-82 | Rule | No owner marker: tenant can edit or delete admin fields | Prototype defect | | see E-29 | [SECURITY] |

### C.8 Integrations
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-83 | Flow | Twilio card | Partial (PRD less detailed) | integrations.md § F-1.1 | Settings.tsx:3200; IntegrationConfigDrawer.tsx | Built in telephony category, test is simulated (E-31). |
| G10-I-84 | Flow | WhatsApp card | Partial (PRD less detailed) | § F-1.2 | Settings.tsx:2336-2370, 3216 | Built with a numbers list. |
| G10-I-85 | Flow | Connection status badge | Partial (PRD less detailed) | § F-1.3 | Settings.tsx:3200, 3207 | Badge exists; not a live ping; two start as connected (E-33). |
| G10-I-86 | Flow | Stripe Connect | PRD-only (not built) | Module summary | none | |
| G10-I-87 | Flow | Custom webhook | Partial (PRD less detailed) | Module summary | Settings.tsx:2620-2655 | Custom API and Custom Webhook entries stored in the browser. |
| G10-I-88 | Flow | CRM, mailbox, SMS, marketing integrations, sync logs and schedule | Missing in PRD | none | Settings.tsx:3170-3225; IntegrationConfigDrawer.tsx:156-189 | Built. |
| G10-I-89 | Rule | Credentials stored in plain browser storage | Prototype defect | | see E-30 | [SECURITY] |
| G10-I-90 | Flow | Test connection always succeeds | Prototype defect | | see E-31 | |
| G10-I-91 | Flow | Disconnect without confirmation | Prototype defect | | see E-32 | |
| G10-I-92 | Metric | Default connected badges | Prototype defect | | see E-33 | |

### C.9 Numbers (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-93 | Flow | Number table with routing (priority, countries served, processes, provider, cost, direction) and assignment to processes | Missing in PRD | none | Settings.tsx:4148-4650, 2229-2275 | Built. |
| G10-I-94 | Flow | Verify caller ID | Missing in PRD | none | VerifyNumberModal.tsx; Settings.tsx:4602 | Built. |
| G10-I-95 | Metric | Country price list | Missing in PRD | none | settings-constants.ts:52-103 | Static price table. No formula; shown values are fixed data. |
| G10-I-96 | Flow | Buy / import number options | Prototype defect | | see E-34 | |
| G10-I-97 | Flow | Routing rows not persisted, seeded | Prototype defect | | see E-35 | |
| G10-I-98 | Flow | Delete without confirmation | Prototype defect | | see E-36 | |
| G10-I-99 | Flow | Purchase does not charge credits | Prototype defect | | see E-37 | |

### C.10 Notifications (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G10-I-100 | Flow | Per-module notification switches, enable/disable all, reset | Missing in PRD | none | NotificationsSettingsTab.tsx:185-210; notificationSettingsStore.ts:13-60 | Built and persists. |
| G10-I-101 | Flow | Desktop push permission | Missing in PRD | none | NotificationsSettingsTab.tsx:34-53; browserPushNotifications.ts | Built. |
| G10-I-102 | X-ref | Settings consulted when raising notifications | Missing in PRD | none | notificationSettingsStore.ts:67; notificationsStore.ts | Built. |
| G10-I-103 | Rule | Scope: copy says per organization, stored once per browser | Prototype defect | | see E-38 | |

---

## D. Correct flow as built (PRD-ready)
Each block can replace the whole PRD file. Defects are not written as requirements. Where intent is unclear a decision is flagged.

### D.1 `content/client/settings/organization.md`
```
---
title: "Organizations, Business Profile & Operating Locations"
product: "client"
module: "settings"
channel: "organization"
status: "In Review"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | ORGANIZATION |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Organizations | Organizations created or edited by platform staff appear in this list. | [View in Admin](/admin/organizations) |
| Client | Billing | The organization's industry category and location decide which plans it can choose. | [View](/client/settings/billing) |
| Client | Team / Appointments | Locations defined here are offered to staff and to appointment booking. | [View](/client/settings/team) |

## 1. Module Summary
- The Organization tab lists the organizations the signed-in administrator can manage, with search and an industry-category filter, and opens a drawer to edit each one.
- Administrators can create an organization, edit its profile (name, email, phone, industry category, industry, status, logo, timezone, business profile) and manage its locations.
- Only System Admin users can open Settings.

## 2. Feature Requests
### F-1: Organization List, Create and Edit
#### 1. What it does
Shows a searchable, filterable table of organizations and lets an administrator create or edit one.
#### 2. What it includes
| Item | Type | What it does | Notes |
| F-1.1: Organization table | Data table | Name, email, industry, preferred time, users, created on | Users, preferred time and created-on: Decision needed: define source for these columns (see G10-Q-12) |
| F-1.2: Create Organization | Modal | Name and email required; category, industry, location | |
| F-1.3: Organization drawer | Drawer | General, Availability and Security tabs; Save validates name | Decision needed: which drawer fields must persist (see G10-Q-12) |
#### 3. Worked example
| 1 | Admin opens "Metro Health" | Changes phone and status, saves | Table shows the new values |
#### 4. Jobs to be done
| F-1-J1 | Practice Administrator | When my organization details change, I want to update them, so records stay accurate. |
#### 5. Acceptance criteria
| F-1-1 | Given a saved change to name, email, phone, industry, location or status, the table shows it after save. |
| F-1-2 | Given an empty name, save is blocked with an error. |

### F-2: Business Profile, Logo and Branding
#### 1. What it does
Stores legal and branding details.
#### 2. What it includes
| F-2.1: Logo upload | Uploader | Image up to 2 MB (Decision needed: confirm limit and formats, see G10-Q-12) | |
| F-2.2: Business profile | Modal | Business name, type, industry, region, registration ID type | |
| F-2.3: Brand primary colour | Colour input | Not yet built | |
#### 3. Worked example
| 1 | Admin uploads a logo | Selects a 1 MB PNG | Logo appears in the drawer; Decision needed: where else the logo is shown (see G10-Q-12) |
#### 4. Jobs to be done
| F-2-J1 | Practice Administrator | I want official branding recorded so documents look professional. |
#### 5. Acceptance criteria
| F-2-1 | Given a file above the limit, upload is rejected with a message. |

### F-3: Operating Locations
#### 1. What it does
Maintains locations for an organization with a primary location, an optional Online location, a weekly schedule and days off.
#### 2. What it includes
| F-3.1: Add location | Form | Name required; address, city, state, ZIP | |
| F-3.2: Primary and online flags | Toggles | One primary location | |
| F-3.3: Schedule and days off | Editor | Hours per day, dated days off; "apply Mon-Fri 9-5" shortcut | |
| F-3.4: Location use | Logic | Staff who take appointments must have at least one location | |
#### 3. Worked example
| 1 | Admin adds Westside | Enters name and address | Location is offered when adding a team member |
#### 4. Jobs to be done
| F-3-J1 | Practice Administrator | When I open a branch, I want to add it so appointments can be scheduled there. |
#### 5. Acceptance criteria
| F-3-1 | Given a location without a name, save is blocked. |
| F-3-2 | Given a duplicate day off, it is rejected. |

### Not yet built
- Brand primary colour (hex) used across patient-facing surfaces.
- Medical director name and tax ID printed on receipts (Decision needed, see G10-Q-12).

## 3. Comprehensive Summary
(3.1 Feature table F-1 to F-3 with one-line summaries; 3.2 Jobs to be done mapping to F-1, F-2, F-3.)
```

### D.2 `content/client/settings/team.md`
```
---
title: "Team Members, Roles, Departments & Seat Usage"
product: "client"
module: "settings"
channel: "team"
status: "In Review"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | TEAM |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Roles and plans | Plan seat quotas and platform role templates come from the admin console. | [View in Admin](/admin/plans) |
| Client | Billing | Seats included and extra seats purchased are shown in Billing. | [View](/client/settings/billing) |
| Client | Appointments | Members marked "can book appointments" appear as bookable users. | [View](/client/appointments) |
| Client | Services | Services assigned to a member sync to the services catalogue. | [View](/client/services) |

## 1. Module Summary
- The Team tab has three sub-tabs: Users, Roles and Departments, each with a count badge, search and an "Add" primary action.
- Only System Admin users can open Settings, so only they can add, edit or remove team members today. Decision needed: who else may manage the team (see G10-Q-03).

## 2. Feature Requests
### F-1: Users
#### 1. What it does
Lists users and lets an administrator add, edit, promote or remove them.
#### 2. What it includes
| F-1.1: Users table | Table | Name, role, email, created at, status | Credits and usage columns: Decision needed: define formula (see G10-Q-14) |
| F-1.2: Filter presets | Chips | All team members, Admins, Members and staff, with counts | |
| F-1.3: Add User | Drawer | Name, email required; department; role; "can book appointments"; locations | Decision needed: invite by email with Pending status and resend, or instant add (see G10-Q-04); role list source (see G10-Q-05); seat limit behaviour (see G10-Q-02) |
| F-1.4: Make or Remove Administrator | Row action | Switches role between Admin and Member | |
| F-1.5: Remove user | Row action | Confirmation modal, then deletes | |
| F-1.6: Member drawer | Drawer | Personal info, calendar connection, weekly availability, days off, services, security | |
#### 3. Worked example
| 1 | Admin adds a coordinator | Enters name, email, role, one location | User appears Active in the table |
#### 4. Jobs to be done
| F-1-J1 | Practice Administrator | When I hire staff, I want to add them with the right role so they can start work. |
#### 5. Acceptance criteria
| F-1-1 | Given missing name or email, or an invalid email, save is blocked. |
| F-1-2 | Given "can book appointments" with no location, save is blocked. |
| F-1-3 | Given Remove and Confirm, the user disappears. Given Cancel, nothing changes. |

### F-2: Roles and Permissions
#### 1. What it does
Defines named roles with a module-by-action matrix (read, add, edit, delete, export, import).
#### 2. What it includes
| F-2.1: Roles table | Table | Name, description | Seed roles Admin, Manager, Executive |
| F-2.2: Create or edit role | Drawer | Permission matrix per module | Decision needed: where permissions are enforced and the saved location (see G10-Q-03) |
#### 5. Acceptance criteria
| F-2-1 | Given a role with a module set to deny, users with that role cannot open or act on that module. Decision needed (see G10-Q-03) |

### F-3: Departments
Create, edit and list departments (name, members). Drawer based.

### Not yet built
- Invitation email, Pending status, Resend invite, 7-day expiry (Decision needed, G10-Q-04).
- Activate or deactivate a member without deleting history, with sessions revoked.
- NPI, state licence number, taxonomy and expiry reminders (Decision needed, G10-Q-11).
- Seat limit check against the plan (Decision needed, G10-Q-02).

## 3. Comprehensive Summary
(3.1 table F-1 to F-3; 3.2 jobs: Practice Administrator adds staff; Physician credentials are Not yet built.)
```

### D.3 `content/client/settings/security.md`
```
---
title: "Security Policies & Member Security"
product: "client"
module: "settings"
channel: "security"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | SECURITY |
| Status | In Review |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Team | The member drawer has a Security tab. | [View](/client/settings/team) |
| Client | Organization | Policies are edited inside the organization drawer. | [View](/client/settings/organization) |

## 1. Module Summary
- Security controls are reached from the organization drawer (Security tab) and from each member's drawer. There is no separate Security tab in the Settings menu. Decision needed: standalone tab or drawer (see G10-Q-10).

## 2. Feature Requests
### F-1: Organization Security Policies
#### 2. What it includes
| F-1.1: 2FA policy | Toggle | Enforce or optional, with a grace period in days | Decision needed: enforcement at login (G10-Q-10) |
| F-1.2: Session inactivity timeout | Select | Options to be confirmed (PRD 5 / 15 / 30 / 60) with a lock-instead-of-sign-out switch | Decision needed (G10-Q-10, G10-Q-20) |
| F-1.3: Password complexity | Select, switches | Minimum length 8 to 16; require special characters and numbers | |
| F-1.4: Spam call protection | Controls | Robo-call shielding with sensitivity, auto-block known spam, blocked numbers list | |
#### 5. Acceptance criteria
| F-1-1 | Given a saved policy, it applies to every member of the organization. Decision needed (G10-Q-10) |

### F-2: Member Security
| F-2.1: Change password | Form | Current password, new (8+ characters, strength meter), confirm; optional force-reset flag | Decision needed: how current password is verified (G10-Q-10) |
| F-2.2: Two-factor method | Switch and select | Enable 2FA, choose method | |
| F-2.3: Active sessions | List | Devices; "sign out all other sessions" | |
| F-2.4: Idle timeout | Select | Per member | |

### Not yet built
- IP address or CIDR allowlist.
- Automatic screen lock after the idle period.

## 3. Comprehensive Summary
(3.1 table F-1, F-2; 3.2 jobs: protect patient information through automatic locking.)
```

### D.4 `content/client/settings/audit-logs.md`
```
---
title: "Audit Logs"
product: "client"
module: "settings"
channel: "audit-logs"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | AUDIT-LOGS |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Platform audit log | Platform staff see a platform-wide log. Decision needed: this tenant view must be limited to this organization (see G10-Q-01). | [View in Admin](/admin/logs) |

## 1. Module Summary
- The Audit Logs tab lets an administrator search and review who changed what and when, with before and after values, and export the filtered list to CSV.
- Decision needed: scope is the signed-in organization only, or both (see G10-Q-01).

## 2. Feature Requests
### F-1: Activity Ledger
#### 2. What it includes
| F-1.1: Event table | Table | Time, actor, role, action, module, target, summary, IP | |
| F-1.2: Filters | Controls | Module, action, actor, date range (today, 7 days, 30 days), search | |
| F-1.3: Detail drawer | Drawer | Before and after values, user agent, link to the related record | |
| F-1.4: CSV export | Button | Exports the filtered rows | Decision needed: signed file and an entry for the export itself (G10-Q-18) |
#### 5. Acceptance criteria
| F-1-1 | Given a filter, only matching rows are shown and exported. |
| F-1-2 | Given no rows, export shows "No logs to export". |

### Not yet built
- Patient record access events (chart view, edit, export) with patient filter.
- Immutability and signed exports (Decision needed, G10-Q-18).
- Tenant isolation of the ledger (Decision needed, G10-Q-01).

## 3. Comprehensive Summary
(3.1 F-1; 3.2 jobs: Compliance Officer reviews access.)
```

### D.5 `content/client/settings/billing.md`
```
---
title: "Subscription, Plans, Credits & Payment Methods"
product: "client"
module: "settings"
channel: "billing"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | BILLING |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Plans, credit packages, price per credit, seat packs, credit action rates | These define what this tab offers and what each action costs. | [View in Admin](/admin/plans) |
| Client | Team | Included plus extra seats set how many users the plan covers. | [View](/client/settings/team) |

## 1. Module Summary
- Billing has three views: Plan Overview and Payment, Plans and Subscriptions, Credit Usage.
- An organization has one active plan at a time. Plans are offered by category (AI Receptionist, AI Scribe, EHR, RCM) and filtered by the organization's industry.

## 2. Feature Requests
### F-1: Plan Overview
| F-1.1: Plan card | Card | Name, tier, price, billing cycle, renewal date, included seats, credits | Renewal date is the assignment date plus one month or one year |
| F-1.2: Usage meter | Bar | Credits consumed divided by total credits (plan plus add-on), capped at 100% | Decision needed: colour thresholds (see G10-Q-08) |
| F-1.3: Seats | Text | Included seats plus extra seats purchased | |
### F-2: Plans and Add-ons
| F-2.1: Choose plan | Cards | Monthly or yearly | Decision needed: confirmation, proration, payment, downgrade rules and seat check (see G10-Q-06, G10-Q-02) |
| F-2.2: Add-on credits | Packs or custom amount | Price is credits times the admin price per credit | Decision needed: payment method, invoice (see G10-Q-07) |
| F-2.3: Extra seats | Packs or custom | Price per extra member from admin settings | |
| F-2.4: Cart | Drawer | Add items, pay and activate all | |
#### 5. Acceptance criteria
| F-2-1 | Given an add-on credit purchase with an active plan, credits and remaining balance increase immediately. |
| F-2-2 | Given no active plan, add-on purchase is blocked with a message. |
### F-3: Credit Usage
| F-3.1: Breakdown | Chart | Credits per feature (Calls, SMS, Email, Workflows, AI Scribe) from the deduction log | |
| F-3.2: Deduction history | Table | Each deduction with feature and credits | |
| F-3.3: Action rates | List | Credits per unit set by admin | |
### F-4: Payment Methods and Invoices
| F-4.1: Payment methods | List | Add, set default, remove | Decision needed: removal confirmation (G10-Q-07) |
| F-4.2: Billing address | Form | Save | |
| F-4.3: Invoices and transactions | Table | Decision needed: source of invoice and transaction data and fate of the legacy /payments and /transactions pages (see G10-Q-09) | |

### Not yet built
- Green, amber, red credit meter at 1,000 and 500 and 100 credits.
- Card charge for top-ups through a payment provider.
- An invoice created for each purchase.

## 3. Comprehensive Summary
(3.1 F-1 to F-4; 3.2 jobs: Practice Manager tops up credits.)
```

### D.6 `content/client/settings/voices.md`
```
---
title: "AI Voices & Models"
product: "client"
module: "settings"
channel: "voices"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | VOICES |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | AI Voices and Models catalogue | Only items the admin has activated are listed here. | [View in Admin](/admin/ai-voices-models) |
| Client | Process automations | A voice or model enabled here is offered as a default in automations. | [View](/client/processes) |

## 1. Module Summary
- Two modes: Models and Voices. Each lists admin-published items with search and filters. The workspace switches each item on or off. Switching an item off hides it from Process Automations.

## 2. Feature Requests
### F-1: Models
| F-1.1: Model list | Cards or table | Name, provider, description; filter by provider and status | |
| F-1.2: Enable or disable | Switch | Per model; saved at once | Decision needed: single active model vs several (see G10-Q-13) |
### F-2: Voices
| F-2.1: Voice cards | Cards | Name, gender, country, tags | |
| F-2.2: Filters | Selects | Gender, accent, language, search | |
| F-2.3: Preview | Button | Plays a sample greeting | Decision needed: preview must use the actual voice (see G10-Q-13) |
| F-2.4: Enable or disable | Switch | Per voice; saved at once | |
#### 5. Acceptance criteria
| F-2-1 | Given an item deactivated by admin, it does not appear. |
| F-2-2 | Given an item switched off here, it is not offered in automations. |

### Not yet built
- Temperature control, mandatory emergency guardrail prompt, speech-rate control (Decision needed: client or admin level, G10-Q-13).

## 3. Comprehensive Summary
(3.1 F-1, F-2; 3.2 jobs.)
```

### D.7 `content/client/settings/custom-fields.md`
```
---
title: "Sections & Fields"
product: "client"
module: "settings"
channel: "custom-fields"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | CUSTOM-FIELDS |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Fields master and sections | Platform fields appear here for matching organizations. | [View in Admin](/admin/custom-fields) |
| Client | Clients, Appointments, Processes, Services, Invoices, Claims, Forms, Team | Fields and sections appear on the entity forms and drawers. | |

## 1. Module Summary
- Choose an entity (Organization, Clients, Call logs, Processes, Appointments, Forms, Team, Services, Invoices, Claims), then manage Fields or Sections.
- System fields and sections are always shown and cannot be edited or deleted.
- Fields and sections defined by admin appear when their scope (industry category, industry, location, process, and for Clients the contact category) matches the active organization.

## 2. Feature Requests
### F-1: Fields
| F-1.1: Field table | Table | Search, filters, contact category (Clients) | |
| F-1.2: Add or edit | Drawer | Label, type, section, required, options, table columns | Decision needed: key uniqueness rule (see G10-Q-14) |
| F-1.3: Copy key | Row action | Copies the key | |
| F-1.4: Delete | Row action | Confirmation, then delete; bulk delete | Decision needed: may a tenant edit or delete admin-defined fields (G10-Q-14) |
### F-2: Sections
| F-2.1: Section table | Table | Add, edit, delete, bulk delete | |
| F-2.2: Assign fields | Drawer | Choose fields in a section | |
#### 5. Acceptance criteria
| F-1-1 | Given a system field, edit and delete are not offered. |
| F-1-2 | Given Delete and Cancel, nothing changes. |
| F-1-3 | Given a field scoped to another industry, it is not listed. |

### Not yet built
- Mandatory-on-intake enforcement and patient-portal visibility as separate flags (Decision needed, G10-Q-14).

## 3. Comprehensive Summary
(3.1 F-1, F-2; 3.2 jobs.)
```

### D.8 `content/client/settings/integrations.md`
```
---
title: "Integrations"
product: "client"
module: "settings"
channel: "integrations"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | INTEGRATIONS |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Chats, Call logs | Telephony, mailbox, SMS and WhatsApp connections feed channels. | [View](/client/chat) |
| Client | Clients | CRM sync and lead forms create or update contacts. | [View](/client/clients) |

## 1. Module Summary
- Integrations are grouped by category: CRM, Telephony, Mailbox, SMS, Marketing. Each card opens a drawer to enter credentials, test the connection, save, and disconnect.

## 2. Feature Requests
### F-1: Connect and Test
| F-1.1: Catalogue | Cards by category | Phorest, Bitrix24, HubSpot, Salesforce, Custom API, Custom Webhook; Twilio, Tata Tele, Exotel, Zadarma; Gmail, Outlook, IMAP; Twilio SMS; Meta Lead Ads, WhatsApp Business | |
| F-1.2: Credentials and test | Drawer | Required fields, Test connection | Decision needed: real handshake and credential storage (see G10-Q-16) |
| F-1.3: Status | Badge | Connected or not | Decision needed: live ping (G10-Q-16) |
### F-2: Disconnect
| F-2.1: Disconnect | Button | Clears credentials and marks not connected | Decision needed: confirmation (G10-Q-16) |
### F-3: Sync
| F-3.1: Activity log and schedule | Panel | Connection events and sync schedule | |
### F-4: WhatsApp numbers
List, add and disconnect numbers.

### Not yet built
- Stripe Connect keys (Decision needed, G10-Q-16).

## 3. Comprehensive Summary
(3.1 F-1 to F-4; 3.2 jobs.)
```

### D.9 New file `content/client/settings/numbers.md` (no PRD today; layout follows integrations.md)
```
---
title: "Phone Numbers & Country Routing"
product: "client"
module: "settings"
channel: "numbers"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | NUMBERS |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Telephony numbers and providers | Admin-managed numbers and providers. Decision needed: relation (see G10-Q-15). | [View in Admin](/admin/integrations/telephony) |
| Client | Processes | A number is assigned to processes that use it. | [View](/client/processes) |
| Client | Billing | Calls consume credits at the country rate. | [View](/client/settings/billing) |

## 1. Module Summary
- A table of numbers with country, priority, countries served, assigned processes, provider, per-minute cost in and out, direction, status and verified flag. Numbers can be edited, verified and deleted.

## 2. Feature Requests
### F-1: Number routing
| F-1.1: Add a number | Modal | Number starting with +, country, provider required | Decision needed: purchase, import or admin allocation (G10-Q-15) |
| F-1.2: Assign to processes and countries | Multi-select | | |
| F-1.3: Verify caller ID | Modal | | |
| F-1.4: Delete | Row action | Decision needed: confirmation (G10-Q-15) | |
### Not yet built
- Self-service purchase with inventory search, country price and credit charge.
- Persistence of routing rows between sessions.

## 3. Comprehensive Summary
(3.1 F-1; 3.2 jobs.)
```

### D.10 New file `content/client/settings/notifications.md` (no PRD today)
```
---
title: "Notification Preferences"
product: "client"
module: "settings"
channel: "notifications"
---
| Product | CLIENT |
| Module | SETTINGS |
| Channel | NOTIFICATIONS |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| All client modules | Module notifications | A switched-off module raises no in-app notifications. | |

## 1. Module Summary
- One switch per module (Appointments, Billings, Calls, Chats, Clients, Dashboard, Document Templates, Integrations, Knowledge Base, Processes, Settings, Tasks, Web Forms). Changes save automatically.

## 2. Feature Requests
### F-1: Module switches
| F-1.1: Switch per module | Toggle | Saves at once | Decision needed: scope per organization or per user (G10-Q-17) |
| F-1.2: Enable all, Disable all, Reset to defaults | Buttons | | |
| F-1.3: Desktop push | Permission request | Browser permission; shows blocked message | |
### Not yet built
- Channel choice (email, SMS) and quiet hours.

## 3. Comprehensive Summary
(3.1 F-1; 3.2 jobs.)
```

---

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
|---|---|---|---|---|
| G10-E-01 | Organization drawer Save writes only name, email, phone, industry, location, status. Logo, timezone, business profile, custom-field values, hours are lost although a success toast shows. | Settings.tsx:1172-1183; OrganizationDetailDrawer.tsx:340-347 | Medium | G10-I-08 |
| G10-E-02 | Users, created-on and preferred-time columns are fixed values for every organization. | Settings.tsx:1142-1145 | Low | G10-I-09 |
| G10-E-03 | [SECURITY] Role permission matrix and per-user permissions are saved but never checked by any page or action. The only access rule is the SystemAdmin guard on Settings. A "deny all" role has no effect. | SettingsGuard.tsx:8-20; settings-constants.ts:26-48 | High | G10-I-22 |
| G10-E-04 | Roles are kept in session storage and vanish when the tab closes; users sit in the team store. | Settings.tsx:1381-1399 | Medium | G10-I-23 |
| G10-E-05 | No seat check. Add User never compares team size with plan seats (included plus extra); billing computes seats but nothing consumes the number. | AddTeamMemberDrawer.tsx:111-158; WorkspaceBillingOverviewTab.tsx:145-147 | High | G10-I-21 |
| G10-E-06 | Deactivate/activate handler exists but no control calls it; status badge is always styled green even when "Inactive". | Settings.tsx:3917-3921, 5148-5154 | Medium | G10-I-24 |
| G10-E-07 | `/settings/team/:id` page is not linked from anywhere; opening it directly redirects away; it uses hardcoded mock services. | routes.tsx:259; ManageTeamMember.tsx:84, 131-134 | Low | G10-I-25 |
| G10-E-08 | Credits column shows "0 / 0", usage percent 0 and created-at falls back to a fixed date for every user (hardcoded – formula undefined). | Settings.tsx:5142, 5163-5180 | Medium | G10-I-26 |
| G10-E-09 | [SECURITY] `/users` (client user manager with permissions and credits) is outside the Settings guard, so any signed-in role can open it, and it keeps a separate session-storage user list seeded with sample users. | routes.tsx:246 vs 252-255; UserManagement.tsx:67-72 | High | G10-I-27 |
| G10-E-10 | Two Add User drawers (legacy and new) open on the same trigger. | Settings.tsx:8783, 13334-13342 | Medium | G10-I-28 |
| G10-E-11 | Role dropdown in Add User is a fixed list (Admin, Manager, Specialist, Reception, Sales, Agent) unrelated to roles created in the Roles tab. | AddTeamMemberDrawer.tsx:15-22, 288-300 | Medium | G10-I-29 |
| G10-E-12 | [SECURITY] Org security policies (2FA enforce, grace, idle timeout, password rules, blocklist) are drawer state, not included in Save, and not read by login or the app. They look active but do nothing. | OrganizationDetailDrawer.tsx:263-279, 340-347 | High | G10-I-36 |
| G10-E-13 | [SECURITY] Member password change only checks the current password is non-empty; 2FA, sessions and timeout changes are local state. | SecurityTab.tsx:47-101 | Medium | G10-I-37 |
| G10-E-14 | Security is not reachable: `/settings/security` is redirected to Organization and no menu item exists. | Settings.tsx:862-863; navigation.ts:169-238 | Low | G10-I-38 |
| G10-E-15 | [SECURITY] Tenant Audit Logs tab shows the platform-wide log: entries for other organizations, platform staff names and emails, billing worker orders. No organization filter exists in the component or the store. Confirms the known issue. | Settings.tsx:7763-7765; AdminAuditLogs.tsx:72-73, 90-122; auditLogsStore.ts:61-260 | Critical | G10-I-44 |
| G10-E-16 | [SECURITY] The platform audit page and all `/admin/*` routes need only a signed-in session. The admin layout reads the role but never blocks. `/admin/settings` renders the client Settings page. | routes.tsx:280-335; ProtectedRoute.tsx:4-10; AdminLayout.tsx:44-47 | High | G10-I-45 |
| G10-E-17 | [SECURITY] Audit log is not immutable: it is a browser-storage list that can be edited or cleared, and re-seeded when empty. | auditLogsStore.ts:57-58, 264-300 | High | G10-I-46 |
| G10-E-18 | [SECURITY] CSV export writes no audit entry, is unsigned, and exports whatever is filtered; file name says "admin". | AdminAuditLogs.tsx:126-171 | Medium | G10-I-47 |
| G10-E-19 | Detail drawer link sends a tenant user to `/admin/...` pages. | AdminAuditLogs.tsx:517-530 | Medium | G10-I-48 |
| G10-E-20 | Plan change is instant: no confirmation, payment, proration or check against team size or usage; credits and seats reset immediately. | WorkspaceBillingPlansTab.tsx:229-236; plansBillingStore.ts:2326-2400 | High | G10-I-60 |
| G10-E-21 | Credit top-up and extra seats take effect without any payment method, charge, invoice or transaction entry. Transactions page does not reflect them. | WorkspaceBillingPlansTab.tsx:240-275; plansBillingStore.ts:2596-2627; WorkspaceBillingOverviewTab.tsx:200-255 | High | G10-I-61 |
| G10-E-22 | Payment method removal has no confirmation, and cards are page state only. | Settings.tsx:738, 5517-5531 | Medium | G10-I-62 |
| G10-E-23 | Invoice list is four fixed rows shown as real history; download only shows a toast. | Settings.tsx:5706+, 5825 | Medium | G10-I-63 |
| G10-E-24 | `/payments` is a second billing model: other plan names, per-user prices, 2 seats, renewal fixed at 2 Jun 2026 (already past), credits at $0.10; confirm, buy and add seats only toast. Contradicts Settings billing. | Payments.tsx:50-63, 69-135, 169-188, 570-583, 1096-1157 | High | G10-I-64 |
| G10-E-25 | `/transactions` shows fixed tiles (1,755 / 1,245 / 3,500), a fixed chart and fixed 2024 rows; export and receipt actions are fake (hardcoded – formula undefined). | Transactions.tsx:11-46, 64-96, 262-269 | Medium | G10-I-65 |
| G10-E-26 | [SECURITY] `/payments` and `/transactions` sit outside the Settings guard, so any signed-in role can see billing data. | routes.tsx:247, 251 | Medium | G10-I-66 |
| G10-E-27 | Credit Usage tab gives every viewer buttons that deduct real credits to "simulate" actions. | WorkspaceBillingCreditUsageTab.tsx:157-161, 501-528 | Medium | G10-I-67 |
| G10-E-28 | Voice preview uses the browser's speech engine with a fixed rate, so the sample is not the selected vendor voice. | Settings.tsx:3636-3690 | Low | G10-I-74 |
| G10-E-29 | [SECURITY] Admin and client fields share one registry with no owner marker. A tenant can edit or delete admin-created custom fields (only "system" ones are locked). | FieldRegistryContext.tsx:625-626; Settings.tsx:7554-7600 | Medium | G10-I-82 |
| G10-E-30 | [SECURITY] Integration credentials (passwords, tokens) are saved in plain browser storage. | integrationsRegistry.ts:513, 544-551; Settings.tsx:2521 | High | G10-I-89 |
| G10-E-31 | Test connection always succeeds after a short wait, with a fixed "HTTP 200, 124 ms" message, and in the page version success is set before required-field checks. | IntegrationConfigDrawer.tsx:141-153; Settings.tsx:2738-2748 | Medium | G10-I-90 |
| G10-E-32 | Disconnect has no confirmation. | IntegrationConfigDrawer.tsx:191-201, 949-955 | Medium | G10-I-91 |
| G10-E-33 | Twilio and Gmail are shipped as "connected" regardless of credentials. | Settings.tsx:3200, 3207 | Low | G10-I-92 |
| G10-E-34 | Every Add Number option (free Vapi, SIP, Twilio, Vonage, Telnyx, BYO) only shows a success toast; no number is added. | Settings.tsx:9517, 9601, 9703, 9795, 9876 | High | G10-I-96 |
| G10-E-35 | Number routing rows live in page state with hardcoded seed numbers; adds and edits reset on reload. | Settings.tsx:1934-1990, 2263-2285 | Medium | G10-I-97 |
| G10-E-36 | Deleting a number routing row has no confirmation. | Settings.tsx:2282-2285, 4635 | Medium | G10-I-98 |
| G10-E-37 | The purchase handler that reads country prices is never called; no price shown at purchase, no credit charge, no assignment. | Settings.tsx:1915-1929; settings-constants.ts:52-103 | Medium | G10-I-99 |
| G10-E-38 | Notifications page says changes apply to "this organization" but a single browser-wide key is used. | NotificationsSettingsTab.tsx:105; notificationSettingsStore.ts:3 | Low | G10-I-103 |

## Open questions for PM
1. **G10-Q-01** (G10-I-44, E-15, E-16; D.4) Audit log scope. Should the client Audit Logs tab show only this organization's events, with platform events limited to the admin console? What may a tenant see about platform staff actions on their account?
2. **G10-Q-02** (G10-I-21, E-05, E-20; D.2, D.5) Seat limits. Should adding a member be blocked, warned or auto-billed when team size reaches included plus extra seats? What happens to over-limit users on a downgrade?
3. **G10-Q-03** (G10-I-20, I-22, E-03; D.2) Who may invite, edit and remove team members: System Admin only, Admin role, or custom roles? Where must the role matrix be enforced?
4. **G10-Q-04** (G10-I-11, I-12; D.2) Invitation model: emailed secure link with Pending, resend and 7-day expiry (PRD), or instant add (built)?
5. **G10-Q-05** (G10-I-11, E-11; D.2) Role names: PRD lists Admin, Doctor, Nurse, Coordinator, Billing; build uses Admin, Manager, Specialist, Reception, Sales, Agent and Executive. What is the source of truth?
6. **G10-Q-06** (G10-I-50, I-55, E-20; D.5) Plan names (Starter / Growth / Enterprise vs Starter / Professional / Enterprise / Custom) and plan change rules: confirmation, proration, effective date, downgrade limits.
7. **G10-Q-07** (G10-I-52, I-53, E-21, E-22; D.5) Top-up: fixed bundles or custom amounts, price source, payment method charged, invoice generated, confirmation to remove a card.
8. **G10-Q-08** (G10-I-51; D.5) Credit meter colours: absolute thresholds or percent? Behaviour between 500 and 1,000 credits is undefined in the PRD.
9. **G10-Q-09** (E-24, E-25, E-26; D.5) Keep or retire the `/payments` and `/transactions` pages? Who may open them?
10. **G10-Q-10** (G10-I-30 to I-38, E-12, E-13; D.3) Where do security policies live (own tab or drawer), are they per organization, how are they enforced, which timeout options apply, and how is the current password verified?
11. **G10-Q-11** (G10-I-14; D.2) Are NPI, licence and taxonomy in scope for this product and where are they used (claims, prescriptions)?
12. **G10-Q-12** (G10-I-01, I-03, I-06, E-01, E-02; D.1) Logo size and formats, brand colour, tax ID on receipts, and whether a client administrator may see or create other organizations.
13. **G10-Q-13** (G10-I-68 to I-72; D.6) Are model choice, temperature, emergency guardrail and speech rate client settings, admin settings or removed? Single active model or several?
14. **G10-Q-14** (G10-I-76, I-82, E-08, E-29; D.2, D.7) May a tenant edit or delete admin-defined fields? What defines a unique key? What is the formula for the per-user credits and usage columns?
15. **G10-Q-15** (G10-I-93 to I-99, E-34 to E-37; D.9) Numbers: self-service purchase, import, or admin allocation? Which charge applies, and how is a number assigned to processes?
16. **G10-Q-16** (G10-I-83 to I-92, E-30 to E-33; D.8) Stripe Connect in the client or admin only? Where are credentials stored and how is connection tested?
17. **G10-Q-17** (G10-I-100 to I-103, E-38; D.10) Notification scope: per organization or per user? Add channels?
18. **G10-Q-18** (G10-I-41, I-46, I-47, E-17, E-18; D.4) Audit requirements: immutability, signed export, logging of exports, which client events must be recorded (patient access)?
19. **G10-Q-19** (E-09; D.2) Is the client `/users` page to be removed in favour of Team?
20. **G10-Q-20** (G10-I-33; D.3) Is automatic idle lock required, and does it lock or sign out?

---
## Final message data (for the orchestrator)
See the SubagentHandback report.
