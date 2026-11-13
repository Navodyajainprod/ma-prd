# Glossary and naming resolution (cross-module)

Date: 2026-11-13. Code facts verified in `E:\mantra-assist\src` where marked with a path; everything else is harvested from module reports `E:\ma-prd\analysis\modules\01..14` and labelled "(from <module>)". Choosing a canonical term is a PM decision: the "Recommended" column is a proposal with reasoning, and section 4 lists the decisions to make.

Paths relative to `E:\mantra-assist\src` unless stated.

---

## 1. The big one: Process vs Workflows vs Deals vs Pipeline

Two separate things share these words, and the nav labels are crossed.

| Thing | What it really is | Nav label | Route | Page title / badge | Code identifier | PRD wording |
|---|---|---|---|---|---|---|
| (a) The Kanban board of client records moving through stages | A list of client records ("deals") per stage | **"Process"** (`app/config/navigation.ts:91-95`; `SidebarMenuContext.tsx:52` also "Process") | `/deals` (`app/routes.tsx:232`) | Title "Process", badge "Pipeline", toasts "Deal moved/deleted", help "How Process Works" (`Deals.tsx:2019-2028, 2913, 3016`, from 05-process-tasks.md G5-K-19) | `pages/Deals.tsx`, component `Deals`, nav id `processes` | `client/processes/kanban.md`: "Process & Deals", "deal cards", "Clinical Process Pipeline" |
| (b) The designer of stage definitions, rules and AI persona per stage | Definition of the workflow ("process template") | **"Workflows"** (`navigation.ts:149-153`) | `/process` (`routes.tsx:233`) | Page and sidebar say "Workflow", badge "Workflow Architect"; panels say "Process Settings", "Edit Process Details", "How Process Works", "Search processes...", entity dropdown "Processes" (from 08-workflows-webforms.md line 35) | `pages/Process.tsx`, `useProcessStore`, `Process` type, `processLogsStore`, `clientProcessState.ts` | `client/workflows.md` describes a trigger/action canvas (automation), not the stage designer (G8-Q-17) |
| (c) Trigger/action rules | Automation | "Automations" (admin), page `/automation` | `/automation`, `/admin/automations` | "Automation" | `pages/Automation.tsx`, `useAutomationStore` | `client/automation.md`; `client/workflows.md` (overlap) |
| (d) Platform templates | Admin-owned templates cloned to tenants | Admin sidebar "Workflows" | `/admin/workflows`, `/admin/process-templates`, `/admin/process-template`, `/admin/workflow` | | `AdminProcessTemplates` (`routes.tsx:287-292`) | `admin/*` |

Side effects of the cross: nav "Process" opens `/deals`; nav "Workflows" opens `/process`. "Deals" survives only as a route/file name and in toasts and PRD. A client record in a stage is called "deal", "process", "client process", or "workflow" depending on screen. The workflow button reads "Add Workflow" for clients, and "Add Appointment Workflow", "Add Invoice Workflow", "Add Insurance & Claim Workflow" for other entities (from 08, `Process.tsx:3642-3660`). Admin ADMIN_MODULES id is `workflows` with label "Workflows" (`lib/adminRolesStore.ts:55`).

**Recommended (PM to confirm).**
- **Workflow** = the definition (ordered stages, rules, AI persona). Page `/workflows`.
- **Pipeline** (or **Board**) = the Kanban view of records through a workflow's stages. Page `/pipeline`. Nav label "Pipeline".
- **Case** or **Client journey** (or simply "Client in stage") = one record's progress. Pick one.
- Retire "Deal" (a sales word in a clinical product) and retire "Process" as a user-facing noun, keep it as an internal code name only.
- Keep redirects from `/deals` and `/process` once routes are renamed.

Why: "Workflow" is already the page header and the admin template name; "Pipeline" is already the Kanban badge; "Process" is the least distinctive word and is the one currently attached to both the wrong nav item and the PRD heading "Process & Deals". If the PM prefers to keep "Process" as the user-facing noun, then the nav labels must swap so "Process" opens the definition page and the Kanban gets a different name.

---

## 2. Concept resolution table

Format: concept -> recommended term -> every variant with location -> recommendation and why.

### 2.1 Client vs Patient vs Contact vs Lead

| Variant | Where it appears |
|---|---|
| Clients | Nav label (`navigation.ts:73-77`); route `/clients`; code `Client`, `clientsStore.ts`, `getClientList.ts`; ids `CL-001` (G2-L-15) |
| Contact | `SidebarMenuContext.tsx:48` label "Contact"; code `contactCategoriesStore.ts`; page header "Contacts" (`Clients.tsx:1529-1531`, from 02-clients.md line 22) |
| Patient | PRD "Contact & Patient EHR Directory" / "Patients" (`client/clients.md`); portal routes `/patient/*`; kiosk copy; column "Patient Name" in Call Logs/Invoices/Claims; "Patient Account" banner (G11-E-34) |
| Lead | Category value `Lead` in `PREDEFINED_CONTACT_CATEGORIES = Lead, Client, Supplier, Vendor` (`lib/contactCategoriesStore.ts:14-19`) |
| Not-found state | "Client not found / Back to Clients" (`ClientProfile.tsx:2233-2240`, from 02) |
| PRD category tabs | Leads / Patients / Archived (PRD) vs built dropdown Lead / Client / Supplier / Vendor + custom (G2-L-04); "Archived" and "Pending" statuses not built (G2-Q-11) |
| Other | "Customer"/"Contact" in Website chat (module 04: "contact" speaker role `TestWebsiteChatDrawer.tsx:486`), "Website Visitor" persona |

**Recommended:** **Contact** = the umbrella record type (leads, patients, vendors, suppliers); **Patient** = a category of Contact for clinical use and the only term on patient-facing screens (kiosk, Companion); retire "Client" as a record noun.
Why: the built category list already includes non-patients (Supplier, Vendor), so "Clients" and "Patients" are both wrong for the whole table, while "Contact" is the one that fits all, and patient-facing UI must say Patient. Alternative: keep "Client" as umbrella because code and ids (`CL-001`, `clientId`) already use it; then rename only the visible labels. Impacts: nav, header, URL `/clients`, PRD module title. (G2-Q-11, G2-L-15)

### 2.2 Appointment vs Visit vs Booking

| Variant | Where |
|---|---|
| Appointment | Nav "Appointments" (`navigation.ts:97-101`); route `/appointments`; `appointmentService.ts`; PRD `client/appointments/*` |
| Visit | Companion drawer label "Visits" for `/patient/book` (`PatientPortalLayout.tsx:245`); kiosk "My Visit", "Visit Summary", `VisitJourneyCard.tsx`, visit journey, "Visit Reason" column (PRD list.md) |
| Booking | `PatientBookingScreen.tsx`, route `/patient/book`, step "Confirm booking"; "booking sources" (Inbound Call, Walked In, MA-Client) (G6-Q-13, 12-companion.md line 111); "Booked" stage/status |
| Encounter | PRD timeline `client/clients.md` §F-2.4 "encounter timeline" |

**Recommended:** **Appointment** = a scheduled slot (staff + Companion; label the Companion tab "Appointments"); **Visit** = the day-of journey from check-in to checkout (kiosk My Visit, queue ticket, tracker); "Booking" only as a verb or a source label ("Booked online"); retire "Encounter" unless a clinical note is meant.
Why: the product genuinely has two objects (a scheduled slot, and a walk-in or scheduled arrival journey with a token), so keeping both words with fixed meanings reduces confusion; Companion currently uses "Visits" for appointments. (G6-Q-03, G12 module)

### 2.3 Product & Services vs Services vs Catalogue

| Variant | Where |
|---|---|
| "Product & Services" | Client nav label (`navigation.ts:117-121`) |
| "Services" | Route `/services` (`routes.tsx:266`); `Services.tsx`; `ServiceDrawer`; PRD `client/services.md`; Companion step "Service and clinician picker" |
| "Product / Services" | Admin module label (`adminRolesStore.ts:56`), admin page `AdminProductsServices`, routes `/admin/services`, `/admin/products-services`, `/admin/product-services`, `/admin/industry-services` |
| "Products & Services" | Reception rooms table "Products & Services rooms" (from 09-kb-receptionist-config.md G9-RM-01) |
| "Catalogue" | Used in analysis docs for the table; "Catalog" in admin heading "Product / Services Catalog" (13-super-admin.md A1.10) |
| "Service rooms" | AI Receptionist rooms linked to services |

**Recommended:** **Services** as the nav label and noun if products are rare; if physical products are sold, **Products & Services** everywhere (one spelling, with "&"). Reserve "Catalogue" for documentation only. Note the admin side has a different naming and route family.
Why: the route and PRD already say Services; the "Product" half is only a label. (G7-S-* in module 07)

### 2.4 Invoice status vocabularies

| Source | Values | Ref |
|---|---|---|
| Code type `InvoiceStatus` (internal) | draft, sent, viewed, partial, paid, overdue, void | `app/types/invoiceTypes.ts:1` |
| Default stages (visible) | Draft, Payment recorded, Paid, Overdue (no default Void stage) | `lib/useProcessStore.ts:526-625` (from 07) |
| Required system categories | draft, paid, void | `useProcessStore.ts:384` (from 07) |
| UI preset chips | All / Paid / Overdue / Draft | `Invoices.tsx:383-415` (from 07) |
| Help modal | Draft, Sent, Viewed, Paid, Overdue, Void | `Invoices.tsx:1008` (G7-E-24) |
| PRD tabs | All / Pending Payment / Paid / Overdue | `client/invoices.md` §F-1.1 (G7-I-02) |
| PRD rule list (A) | Draft, Pending, Paid, Overdue, Cancelled | `invoices.md` §F-1 > 1 |
| PRD rule list (B) | Paid, Pending, Overdue, Void | `invoices.md` §1 |
| Events | invoice.created / sent / paid / partially_paid / overdue / voided | `invoiceService.ts` (from 07) |
| Kiosk/Companion | "Pending" invoices, "unpaid", "I Have Paid" | modules 11, 12 |
| Outstanding KPI | sent + viewed + partial + overdue | G7-Q-12 |

**Recommended (status, system):** Draft, Sent, Viewed, Partially paid, Paid, Overdue, Void (the code set, with "Cancelled" dropped in favour of Void, "Pending" shown only as a filter = Sent + Viewed). Stages are the customer-visible layer mapped to those statuses; seed a Void stage.
Why: it is what the code and events already implement; PRD's two lists contradict each other. (G7-Q-04, G7-Q-12)

### 2.5 Claim status vocabularies

| Source | Values | Ref |
|---|---|---|
| Code `ClaimStatus` | Draft, Ready to Submit, Submitted, Accepted, Under Review, Paid, Denied, Rejected | `lib/claimsStore.ts:3-11` |
| Stage-to-status inference (table) | paid, accept/verified -> Accepted, submit, review, ready/pending, reject/fail/denied -> Rejected, draft | `Claims.tsx:141-149` (from 07) |
| Stage-to-status (drawer) | paid/settled, denied/reject/failed -> Denied, submit, draft/intake, review/verified -> Ready to Submit | `claimsStore.ts:473-485` (from 07) |
| Presets | All / Ready / Submitted & Review / Paid / Drafts (count and filter disagree) | `Claims.tsx:198-212` vs `:168` (from 07) |
| PRD | "status badge", clearinghouse status; lifecycle not enumerated | `client/claims.md` (G7-C-09, G7-Q-14) |
| Overlapping meanings | Denied vs Rejected | G7-C-09 |

**Recommended:** Draft, Ready to Submit, Submitted, Accepted, In Review, Paid, Denied (final payer decision), Rejected (clearinghouse/front-end rejection, fixable and resubmittable); one inference rule used by both table and drawer.
Why: both Denied and Rejected exist in code and are industry-distinct, but the two inference rules map "reject" to different statuses. (G7-Q-14)

### 2.6 Appointment status vocabularies

| Source | Values | Ref |
|---|---|---|
| PRD list filter | Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show | `client/appointments/list.md` §F-1.1 (G6-L-02) |
| Build filter (workflow stages) | Booked, Reminder, Completed, Reschedule, No-show | `Appointments.tsx:1223-1238`; `useProcessStore.ts:383` (from 06) |
| Build status after actions | Booked, Completed, Cancelled, No-show, Rescheduled | module 06 D §F-1.6 |
| Calendar side panel | Always "CONFIRMED" | `AppointmentCalendarView.tsx:323` (from 06) |
| Kiosk | marks "Arrived" (check-in only records time; status does not change in appointment store) | G6-E-07, 11-reception-kiosk.md |
| Companion | tabs Upcoming / Past | `PatientBookingScreen.tsx:775-928` (from 12) |

**Recommended:** status (system): Booked, Confirmed, Arrived, In Progress, Completed, Cancelled, No-show, Rescheduled; stage (workflow) is a customisable layer that maps onto status. Drop "Reminder" as a status (it is an automation step).
Why: PRD and kiosk both need Arrived; the build lacks it. (G6-Q-03, G6-L-02)

### 2.7 Call outcome / status vocabularies

| Source | Values | Ref |
|---|---|---|
| PRD | Completed, Missed, Voicemail | `client/call-logs.md` §F-1 (G3-L-02) |
| Build status badge | Completed, Failed, Pending, In Progress | `CallLogs.tsx:1937-1952`; `processLogsStore.ts:185` (from 03) |
| Retry tab | BUSY, NO ANSWER | G3-Q-01 |
| Call Review "Call Outcome" metric (unreachable) | "No Outcome", "Stage Advanced", "No Change" | `CallDetailDrawer.tsx:196-201` (from 03) |
| Column name | PRD "Call Outcome"; build "Status" | G3-L-01 |

**Recommended:** two separate fields: **Call status** (Completed, Missed, Voicemail, Busy, No answer, Failed, In progress, Scheduled) and **Call result** (Stage advanced, No change, Escalated). Retire the single "Outcome" word for both.
Why: today "outcome" carries both connection result and business result. (G3-Q-01)

### 2.8 Plan tier names

| Source | Values | Ref |
|---|---|---|
| Type | Free, Starter, Growth, Scale, Professional, Custom | `lib/plansBillingStore.ts:13` (from 13) |
| Admin UI filter | Free (Onboarding), Starter, Growth, Professional | `AdminPlans.tsx:2147-2150` (from 13) |
| Seeds | Starter, Professional, Custom, Free | `plansBillingStore.ts:464-795` (from 13) |
| Silent rename | Scale becomes Professional on read | `plansBillingStore.ts:1386-1393` (G13-E-12) |
| PRD | Starter, Growth, Enterprise | `admin/plans/*.md` (G13-Q-06) |
| Status | Staff Only / Active / Inactive | G13 A1 plans |

**Recommended:** **Free, Starter, Growth, Professional, Enterprise** or the PRD set Starter, Growth, Enterprise with Free as trial. Delete Scale and Custom from the type, or make "Custom" a quote-based Enterprise flag.
Why: the data model has two names for the same tier and one tier that cannot be chosen. (G13-Q-06)

### 2.9 Role names

See `roles-permissions.md` section 1.2. Summary of the variants: auth `Role` = SystemAdmin, Admin, Manager, Agent, Reception (`navigation.ts:32`); tenant template drawer = Admin, Manager, "Executive" with id `agent` (`RolesPermissionsDrawer.tsx:114-160`); Add-user drawer = Admin, Manager, Specialist, Reception, Sales, Agent (`AddTeamMemberDrawer.tsx:16-23`); admin templates = SystemAdmin, Admin, BillingAdmin, SupportSpecialist, ReadonlyAuditor, Clinical Operations Lead (`adminRolesStore.ts`); team store sample roles = Admin, Ophthalmologist, Senior Surgeon, Physician (`teamStore.ts:32-72`); PRD = Admin, Doctor, Nurse, Coordinator, Billing (`client/settings/team.md`), "Super Admin", "Superadmin", "Platform Admin" (`admin/*`, `my-tasks.md`). **"Admin" means three different things** (tenant admin, platform admin, "Clinic Admin" hardcoded owner of group chats, G4 line 41).

**Recommended:** distinct vocabularies: platform staff = **Platform Admin** (retire SystemAdmin/Superadmin/Super Admin), clinic = **Owner** (replaces tenant SystemAdmin), **Admin**, **Manager**, **Provider** (replaces Doctor/Physician/Specialist/Executive), **Reception**, **Billing**, **Agent/Coordinator** (pick one). Keep "Admin" only in the tenant list.
Why: one string, "SystemAdmin", is currently both the tenant gate and the platform root. (G10-Q-05, G13-Q-05, G14-Q-04)

### 2.10 Station vs Room vs Desk vs Terminal vs Kiosk

| Variant | Where |
|---|---|
| Room | "Clinic Rooms & Desks" topbar mode and drawer "Room Label", "Room Number" (09 G9-RM-07); `roomsStore.ts`; Companion pill "room"; appointment column Room |
| Desk | Same topbar title; terminal name "Desk N"; default "OPD Desk (Floor 1)"; type values in drawer (from 09) |
| Station | PRD `ai-receptionist/settings/stations.md`; code `roomsStore` standalone "stations"; queue "ticket at the room's station"; "provision a kiosk station" empty-state copy (09 line 100) |
| Terminal | Settings section "Receptionist terminals"; "Reception Terminal N"; query `?terminal=`; kiosk header "Name (Location)" |
| Kiosk | Settings topbar "Kiosk & Terminals"; PRD `kiosk-shell.md`; `/reception`; Kiosk features list |
| Reception / Receptionist | Route `/reception`; "Receptionist terminals"; "Reception Settings" PRD; also the human role Receptionist (96 mentions in PRD) |
| Department / Directions | `/reception/directions/:categoryId/:roomId` |

**Recommended:** **Room** = a physical place a patient goes (exam room, lab, pharmacy counter), including desks; **Queue station** = a room that holds a queue (only if needed; otherwise just "Room with queue"); **Kiosk** = the patient-facing device/screen; **Terminal** only as the admin label for a registered kiosk (or drop it, say "Kiosk"); **Reception desk** = the human front desk.
Why: Rooms, Desks and Stations are one table with a dedupe rule (G9-RM-02), so three names for one object. Terminal and Kiosk are one object too. (G9 questions, module 11)

### 2.11 Token vs Ticket vs Queue number

| Variant | Where |
|---|---|
| Token | Kiosk "Token Issued" screen, "No Active Token Today", PRD token prefixes D-/P-/L-/B-/R- (`reception/queue.md`), "pharmacy token (P-014)" (from 11, 09) |
| Ticket | Code queue ticket at the room's station; "ticket log" kiosk store (from 09 G9-E-13, 11) |
| Queue number | PRD walk-in journey "get a queue number now" (11 line 1021) |
| Appointment token | Appointment's own token string vs "D-" + count (11 line 67) |

**Recommended:** **Token** (patient-facing, what is printed or shown, e.g. D-014) and **Queue ticket** only as the internal record; retire "Queue number".
Why: patients and PRD already say token; code says ticket. (G11-E-22 on placeholder numbers)

### 2.12 Aria vs Receptionist vs AI Receptionist vs Avatar

| Variant | Where |
|---|---|
| Aria | Spoken name of the kiosk voice: "Greeting Phrase spoken by Aria" (09 F-1), Aria panel, PRD `avatar/aria-stage-speech.md`, "Aria announces" (G11-E-03) |
| Avatar / Clinic AI Avatar | Route `/reception/avatar`; `AvatarReceptionView.tsx`; PRD folder `avatar/`; the panel label "Clinic AI Avatar, Voice & Touch Enabled" (11 line 365) |
| AI Receptionist | Settings tab and sidebar item "AI Receptionist" (`SidebarMenuContext.tsx:87`; `Settings.tsx:3878`); kiosk header "• AI Receptionist • Name (Location)" (`AvatarReceptionView.tsx:478-489`); PRD product folder `ai-receptionist` |
| Reception / Reception Settings | Route `/reception`, `receptionSettingsStore.ts`, PRD `client/settings/reception.md` |
| Receptionist | Also the human role (PRD), also "Receptionist terminals" |
| Voice agent / AI Voices | Nav "AI Voices / Models" (call agent voice), `/settings/voices`; "AI persona" per workflow stage (G8-I-12); Care Bot (Companion) |
| Scribe | "AI Scribe" nav label (`navigation.ts:103-107`), PRD `scribe.md` |

**Recommended:** **AI Receptionist** = the product (settings, kiosk, avatar); **Aria** = the avatar's persona name (user-facing character, configurable); **Reception** only for the human front desk and the `/reception` kiosk URL (or rename the route `/kiosk`); **Voice agent** = phone agent, distinct from Aria; **Care Bot** = Companion chatbot.
Why: "Receptionist" currently means the product, the screen, and a human staff role. (G9-Q-05)

### 2.13 Knowledge source vs article vs document

| Variant | Where |
|---|---|
| Knowledge source | Page copy, header, delete toast "Knowledge source(s) deleted" (`KnowledgeBase.tsx:1537-1542`, 1506-1517; from 09); module D "Knowledge Source List" |
| Reference material | Header copy, delete modal (from 09) |
| Text Articles | Preset "Text Articles" (09 line 38) |
| File Documents | Preset "File Documents"; types PDF, DOC, DOCX, TXT, CSV |
| URLs & Links | Preset; "Coming soon" disabled |
| Article (Markdown viewer) | PRD `client/knowledge-base.md` §F-1.3 "Markdown Article Viewer" (G9-KB-02) |
| Knowledge Base | Nav "Knowledge Base" (`navigation.ts:155-159`), routes `/knowledge-base`, `/admin/knowledge-base` |
| Onboarding | "documents as knowledge sources" (from 14) |

**Recommended:** **Knowledge Base** = the module; **Source** = one item, with types **Text**, **File**, **URL**; retire "Article" unless authored Markdown articles are built.
Why: the build has sources with three types; the PRD describes authored articles with a Markdown viewer, which is a different content model. (G9-KB-02, G9-Q section)

### 2.14 Companion vs Patient portal vs MA-Client

| Variant | Where |
|---|---|
| Companion | PRD product folder `content/companion`; Chats channel filter "Companion" (`Chats.tsx:1545`, from 12); widget settings "Companion widget" (`companionWidgetStore.ts`); `client/chat/companion.md` |
| Patient portal | Route `/patient`; `PatientPortalLayout`; `patient_portal_active_client_id`; code `getProcessesForPatientPortal`; Task "Share to Client Portal" (G5-E-26) |
| Client Portal | Share drawer target label "Client Portal" (G5-E-26) |
| MA-Client | Appointment source string for portal bookings (12 line 111) |
| Care Bot / Care groups / Care Chat | Messages channels; floating button "Care Bot"; PRD "Care Chat Task Notifications" (12 lines 152-167, 1222) |
| Patient app | Phone-style portal; "mobile My Tasks" PRD (`my-tasks.md`) |

**Recommended:** **Companion** = the product name (what staff and PRD call it; Chats channel); **Patient portal** = no longer a name, use "Companion"; retire "Client Portal"; replace source "MA-Client" with "Companion". Keep "Care Bot" for the chatbot only.
Why: three names for one app across nav, settings, tasks and data. Because patients must see "Patient" per 2.1, the in-app title can stay generic ("Your care").

### 2.15 Team vs Users (and User Management)

| Variant | Where |
|---|---|
| Team | Settings nav "Team" (`navigation.ts:182-187`, `SidebarMenuContext.tsx:85`); route `/settings/team`; PRD `client/settings/team.md` "Team & Roles"; `teamStore.ts` |
| Users | Sub-tab "Users" inside Team (sub-tabs Users / Roles / Departments, `Settings.tsx:4889`, from 10); route `/users` (client "User Management"); PRD "Users" |
| User Management | Admin page title (`/admin/settings/users`, `/admin/users`), `AdminUserManagement.tsx`; admin module id `userManagement` (`adminRolesStore.ts:65`); sidebar "User Management" (`AdminSidebar.tsx:165`) |
| Administrator | Column header on admin Users tab (from 13 A1.2) |
| Team member / Member | `ManageTeamMember`, `TeamMemberDrawer`, `/settings/team/:id`; Profile drawer "Specialist" etc. |
| Providers / Doctors / Clinicians | Appointments "Provider", Chats "Responsible" (see 2.19) |

**Recommended:** **Team** = clinic staff directory (people), with tabs **Members, Roles, Departments**; **Users** = login accounts only if distinct from team members (today they are the same, G10-I-20); platform staff = **Platform users** (replaces "User Management"/"Administrator"). Remove the legacy `/users` page. (G10-Q-19)

### 2.16 Other conflicts found in the module files

| Concept | Variants (where) | Recommended | Why |
|---|---|---|---|
| Web forms | Nav "Webforms" (`navigation.ts:161-165`), page title "Web Forms" (`WebForms.tsx:1377`), help "How Web Forms Works", export "WebForm", admin "Forms"/"Form Templates"/`/admin/forms`, bundles "Form Flows" in code, "Intake flows" in data, sub-tab "Flows", PRD `web-forms.md`, Companion "Forms" (from 08) | **Forms** (with "Web form" meaning the public-link type); bundles = **Form flows** | One word in nav, page, admin, Companion |
| Settings: Sections / Fields | Nav "Sections / Fields" (`navigation.ts:210-215`), admin "Custom Fields" and "Sections/Fields" (`adminRolesStore.ts:58`), PRD `custom-fields.md`, `fields.md`, `sections.md`; client can edit admin fields (G10-E-29) | **Custom fields** | Matches PRD, admin routes |
| Organization | Settings "Organization" (`navigation.ts:175-180`), Admin "Organizations" `/admin/organizations`, tenant `/organizations` leak, PRD "tenant", "practice", "clinic", "workspace", "Practice Name", `OrganizationSwitcher` (from 10, 13) | **Organization** (platform) with **Clinic** as the display noun for patient-facing text; retire tenant/workspace/practice in UI | One platform noun |
| Industry vs Blueprint | Admin "Industries" (`/admin/industries`, `/admin/industry-category`, `/admin/industry`), PRD "Industry blueprints", "Industry Category", "Industry Plans" (from 13) | **Industry** (category) and **Blueprint** (the bundle) | Both exist and mean different layers |
| Audit logs | Nav "Audit Logs" (`navigation.ts:224-229`), admin "Audit Logs" and "Logs" (`/admin/logs`, `/admin/settings/logs`), PRD "HIPAA Security Audit Logs & Access History" (`client/settings/audit-logs.md`); tenant tab shows platform log (G10-E-15); "Activity" feed in drawers fabricates entries (G7-E-13, E-29) | **Audit log** (immutable security record) vs **Activity** (record timeline); separate | Two different things named alike |
| Numbers / Telephony | Settings "Numbers" (`navigation.ts:203-208`, removed by migration `SidebarMenuContext.tsx:124`), admin "Telephony: Numbers / Providers", "Phone Numbers", PRD voices | **Phone numbers** under **Telephony** | Matches admin |
| AI Voices / Models | `/settings/voices` "AI Voices / Models"; admin `/admin/ai-voices-models`, `/ai-voices`, `/voice-config`; PRD `voices.md`; Aria is separate | **AI voices and models** | Single label, Aria separate (2.12) |
| Overview vs Dashboard | Nav "Overview" (`navigation.ts:59-63`), PRD `client/overview.md`, widget names "Active Tasks" | **Overview** | Consistent |
| Reports vs Campaigns | `/reports`; admin `/admin/reports` and `/admin/campaigns` both render `Reports` (`routes.tsx:339-340`) | **Reports**; drop `/admin/campaigns` unless built | Duplicate route |
| Chats vs Messages vs Inbox | Nav "Chats"; channels WhatsApp, SMS, Website, Companion, Email (Webmail), "Email agent" redirects `/email-agent`; Companion tab "Messages"; "Chat" PRD | **Conversations** (module) with **Chat** for live channels and **Email** separate, or keep "Chats" | Email is not a chat; PM choice |
| Call "Logs" vs "Calls" vs "Call Review" | Nav "Call Logs", PRD `call-logs.md`, panel "Call Review" unreachable (G3-E-01), admin "Calls" analytics | **Call logs** | Matches nav/PRD |
| Scribe | Nav "AI Scribe" (`navigation.ts:103-107`), route `/scribe`, page title `AIScribeConsole`, PRD `scribe.md`, STT engine "Whisper" (PRD) vs "Deepgram Nova-2 Medical" (help) (G3-Q-15) | **AI Scribe** | Consistent; fix engine claim |
| Responsible / Assigned / Provider / Doctor / Clinician | Appointments "Provider" and "Responsible", tasks "Assigned to me", Settings Add-user "Responsible", kiosk "Doctor" (from 06, 05, 09) | **Provider** for clinical delivery, **Owner** for CRM/process, **Assignee** for tasks | Three meanings now share words |
| Stage vs Status vs Category | Workflows "stage", invoices "status" and "stage", appointments "stage pills", required system categories draft/paid/void (`useProcessStore.ts:384`) | **Stage** = customer-defined position; **Status** = system lifecycle; **Category** = mapping between them | Prevents duplicate vocabularies (see 2.4, 2.6) |
| Task vs To-do / Admin task / My Tasks / Tasks by me | Nav hidden-or-absent for Tasks in `navigation.ts` (route `/tasks` exists, SidebarMenuContext item `tasks`), PRD "My Tasks", "Tasks by me", admin tasks `/admin/tasks`, patient tasks `/patient/tasks` | **Tasks** with tabs My tasks / Created by me / Admin | |
| Webmail vs Email | Chat sub-area `WebmailView.tsx`, "email agent" | **Email** | |
| Contact category vs custom contact category | `ma_contact_categories` (from 02) | **Contact type** | "Category" also used for fields, industries, plans |
| Sign in vs Login | `/login`, `/verify`, "Sign Out" label (`navigation.ts:246-252`), PRD "Sign & Attach" (signature) | **Sign in / Sign out**; "Sign" for signatures only | |
| Persona names in PRD | Practice Manager, Practice Administrator, Practice Coordinator, Clinic Administrator, Clinic Coordinator, Clinical Coordinator, Care Coordinator, Care Manager, Front-Desk Lead, Front-Desk Supervisor, Ops Lead, Triage Coordinator, Medical Assistant, Insurance Biller, Billing Specialist, Security Officer, Revenue Officer, Superadmin, Platform Admin (PRD jobs-to-be-done tables) | One persona list tied to the role list (2.9) | PRD has ~19 personas, the build has 5 role strings |
| Organization names / "MantraAssist" vs "Mantra Care" vs "Mantra Health" | Email defaults `admin@mantrahealth.com`, `admin@mantra.care`, `anshul@mantracare.com` (G5-E-11), PRD "MantraAssist" (from 13 line 6) | Product name decision | Brand consistency, also leaks real email as fallback |
| `/onbaording` | Typo twin route `routes.tsx:211` | Remove | typo |

---

## 3. Where wording is user-visible and duplicates (quick index)

| Surface | Terms to align |
|---|---|
| Client sidebar (`SidebarMenuContext.tsx:46-92`) | "Contact" (not "Clients"), "Process" (-> Pipeline), "Product & Services", "AI Receptionist" (not in `navigation.ts`; `navigation.ts` still has "Numbers", "Security" removed by migration) |
| `navigation.ts` (unused) | "Clients", "Process", "Workflows", "Webforms", "Invoice" (singular), "Insurance & Claims", "AI Voices / Models", "Sections / Fields" |
| Admin sidebar (`AdminSidebar.tsx`) | "User Management", "Roles & Permissions", "Workflows", "Product / Services", "Industries" |
| Companion drawer (`PatientPortalLayout.tsx:244-250`) | "Today", "Visits", "Tasks", "Documents", "Forms", "Billing", "Messages", floating "Care Bot" |
| Kiosk | "My Visit", "Next Step", "Token", "Aria", "AI Receptionist" |

Note the two sidebar sources disagree (`navigation.ts` vs `SidebarMenuContext.tsx`): the tenant sidebar actually renders the latter (`Sidebar.tsx:57, 396`), so labels in `navigation.ts` are not what users see. Decide which file is canonical.

---

## 4. Decisions needed (PM)

1. **Process / Workflow / Pipeline / Deal**: pick the nouns (section 1) and whether to swap the nav labels. (G5-Q-22, G8-Q-17, G5-K-19)
2. **Client / Patient / Contact**: umbrella record noun, category names, and the patient-facing word. Archived/Pending statuses real? (G2-Q-11, G2-L-15)
3. **Appointment / Visit / Booking**: confirm two objects (scheduled slot, day-of journey) and rename the Companion "Visits" tab. (G6-Q-03)
4. **Status sets**: single canonical lists for invoices (G7-Q-04, G7-Q-12), claims including Denied vs Rejected (G7-Q-14), appointments including Arrived/In Progress/Cancelled (G6-Q-03), calls (G3-Q-01). Decide status vs stage layering.
5. **Plan tiers**: Starter/Growth/Enterprise vs Free/Starter/Growth/Professional vs Scale/Custom. (G13-Q-06)
6. **Role names**: collapse "Admin" and "SystemAdmin" ambiguity, adopt PRD or build role list. (G10-Q-05, G13-Q-05, G14-Q-04)
7. **Reception hardware and queue words**: Room vs Desk vs Station vs Terminal vs Kiosk; Token vs Ticket vs Queue number. (module 09, module 11)
8. **AI naming**: Aria (persona) vs AI Receptionist (product) vs Avatar vs Voice agent vs Care Bot; and the human "Receptionist" role.
9. **KB content model**: Sources (Text/File/URL) vs Articles. (G9-KB-02)
10. **Companion naming**: Companion vs Patient portal vs Client Portal vs MA-Client source label.
11. **Team/Users**: keep "Team" with Members/Roles/Departments; retire `/users`; platform staff label. (G10-Q-19, G13-Q-05)
12. **Forms, Custom fields, Organization/Clinic/Workspace/Practice, Industry/Blueprint, Audit log vs Activity** (section 2.16).
13. **Persona list**: reduce the ~19 PRD persona names to the agreed role list.
14. **Canonical sidebar file**: `navigation.ts` vs `SidebarMenuContext.tsx` (section 3).
15. **Product/brand name** used in UI, emails and PRD (MantraAssist, Mantra Care, Mantra Health).
