# Roles and permissions: prototype vs PRD (cross-module)

Date: 2026-11-13. Method: code facts verified directly in `E:\mantra-assist\src`; module facts harvested from `E:\ma-prd\analysis\modules\01..14`. Anything not re-verified in code is labelled "unverified (from <module file>)".

Paths below are relative to `E:\mantra-assist\src` unless stated.

**Headline.** The prototype has no working role model. Exactly one role check exists in the tenant app (`SettingsGuard`, SystemAdmin only). The active role comes from browser storage and defaults to SystemAdmin, and no screen lets you change it. Everything else (role matrix, per-user permissions, per-form permissions, admin role permissions, nav `roles` lists) is either decorative, dead code, or sidebar-hiding only.

---

## 1. Roles that exist in the prototype

### 1.1 The `Role` type and where the active role comes from

| Item | Fact | Ref |
|---|---|---|
| Type | `type Role = "SystemAdmin" \| "Admin" \| "Manager" \| "Agent" \| "Reception" \| string`. The trailing `string` means any value is a valid role. | `app/config/navigation.ts:32` |
| Active role source | `AuthContext` reads `localStorage["user_role"]`; if missing it falls back to `"SystemAdmin"`. | `app/context/AuthContext.tsx:27-29` |
| `user` object | Rebuilt from `localStorage["user_data"]` or a hardcoded "Admin User / admin@mantrahealth.com" with the stored role or SystemAdmin. | `AuthContext.tsx:31-45` |
| Login | Login writes `user_data.role = localStorage user_role \|\| "SystemAdmin"`. Any email/password is accepted; token is the literal `dummy_token`. | `app/pages/auth/Login.tsx:98-104, 152-158`; `AuthContext.tsx:53-56` |
| Who calls `setRole` | Nobody. Defined in the context, never invoked by any component (grep of `src` finds no caller). So role can only change by hand-editing browser storage. | `AuthContext.tsx:47-51` |
| Signup / invite | Everyone who signs up or accepts an invite is treated as SystemAdmin (module 14: G14-E-06; Signup.tsx:160-167, verified in module file only, unverified in code by me). | unverified (from 14-prototype-only.md) |
| Admin portal role | Same `useAuth().user.role`; `AdminSidebar` and `AdminLayout` use `user?.role \|\| "SystemAdmin"`. No separate admin sign-in. | `app/components/layout/AdminSidebar.tsx:171`; `AdminLayout.tsx:46` |
| Admin-role lookup | By case-insensitive name match against the admin role list in browser storage (`mantra_admin_roles_v2`). | `lib/adminRolesStore.ts:70, 189-200` |

### 1.2 Three unrelated role vocabularies (plus patient and kiosk)

| Vocabulary | Values | Where defined | Does anything read it? |
|---|---|---|---|
| A. Auth `Role` type (the one the guards read) | SystemAdmin, Admin, Manager, Agent, Reception, any string | `navigation.ts:32` | Only `SettingsGuard` (equality with SystemAdmin) and the unused `getFilteredNavigation` |
| B. Admin-portal role templates (platform staff) | SystemAdmin (locked), Admin, BillingAdmin, SupportSpecialist, ReadonlyAuditor, "Clinical Operations Lead", plus custom roles. Per-module actions read/write/delete/import/export with scope all/department/own/deny. 6 seeded names; names of the last three confirmed in `adminRolesStore.ts` function offsets, their full permission sets are in module 13 | `lib/adminRolesStore.ts:89-160` | Only `canAdminRoleView` for sidebar item visibility (`AdminSidebar.tsx:178-184`). `canAdminRoleAction` is never called (G13-E-100) |
| C. Tenant role templates (clinic staff) | Drawer defaults: Admin, Manager, "Executive" (id `agent`); Add-user drawer list: Admin, Manager, Specialist, Reception, Sales, Agent; team store sample roles: Admin, Ophthalmologist, Senior Surgeon, Physician; profile drawer: Manager/Agent. Modules: clients, processes, calls, chats, knowledgeBase, settings, processSettings, webForms, appointments, services; actions read/add/edit/delete/export/import with scope inherit/deny/own/role/all | `app/components/settings/RolesPermissionsDrawer.tsx:114-160`; `app/components/team/AddTeamMemberDrawer.tsx:16-23`; `types/permissions.ts:1-33`; `lib/teamStore.ts:32-72` | No. `canDoAction`/`canAccess` (`lib/permissions.ts:3-38`) have zero callers. Roles even live in session storage (G10-E-04) |
| D. Patient (Companion) | One role, "the patient". No caregiver/family role. No guard. Identity = `patient_portal_active_client_id` in local+session storage, falling back to first client. | `app/routes.tsx:155-178`; `app/pages/patient/PatientLoginScreen.tsx:184-186` | n/a (module 12: G12-E-01..03) |
| E. Anonymous kiosk visitor | No sign-in at all. `/reception*` routes sit outside `ProtectedRoute`; identity is phone + OTP (any number accepts 1234/0000), face (mock matcher), or none for My Visit. | `app/routes.tsx:110-154` | n/a (module 11: G11-E-01..06) |

Not an enforced role anywhere: "Medical Assistant", "Receptionist", "Physician" etc. appear only in PRD prose and in hardcoded name-matching rules (e.g. G5-E-16 treats any assignee role containing "physician" as the current user).

### 1.3 Findings about the model itself

- Role-filtered navigation is dead code. `getFilteredNavigation` (`navigation.ts:259-285`) filters by `item.roles`, and the nine Settings entries carry `roles: ["SystemAdmin"]` (`navigation.ts:171-240`), but nothing imports it (grep: only `navigation.ts` references `getFilteredNavigation`/`navigationConfig`). The tenant sidebar is built from `SidebarMenuContext` (`Sidebar.tsx:57, 396`), a user-configurable menu where Settings items are `visible: true` for everyone (`app/context/SidebarMenuContext.tsx:84-92`).
- Result for non-SystemAdmin roles: Settings entries are shown, then bounce on click (toast + redirect to `/`). That is the reverse of "Hidden only".
- `canAdminRoleView` returns true for an unknown role name (`adminRolesStore.ts:194`), so Manager/Agent/Reception (not in the admin list) see every admin sidebar item (G13-E-99).

---

## 2. Prototype matrix: role x module (what the code does)

Legend: **Enforced** = code blocks navigation or action; **Hidden only** = nav item filtered but URL works; **Open** = no check beyond "signed in"; **Visible, then blocked** = the menu item shows for every role and the route guard redirects to `/` with a toast on click (the sidebar does not filter by role); **n/a** = not applicable. "Signed-in" check = `ProtectedRoute` (`app/components/auth/ProtectedRoute.tsx:4-12`, mounted at `app/routes.tsx:215`).

Effective reality: for the tenant app every signed-in role is identical except Settings. The matrix shows that explicitly so the PM can see how little differentiation exists.

### 2.1 Tenant workspace modules (`/` shell, `routes.tsx:218-277`)

| Role | 01 Overview `/` | 01 Reports `/reports` | 02 Clients `/clients` | 03 Call Logs | 03 Scribe `/scribe` | 04 Chats `/chats` | 05 Process Kanban `/deals` | 05 Tasks `/tasks` | 06 Appointments | 07 Services `/services` | 07 Invoices | 07 Claims | 08 Workflows `/process`, Automation | 08 Webforms | 09 Knowledge Base | 09 AI Receptionist settings | 10 Settings (other tabs) | 11 Kiosk `/reception*` | 12 Companion `/patient*` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SystemAdmin | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open (passes guard) | Open (passes guard) | n/a | n/a |
| Admin | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Visible in menu, then blocked on click (SettingsGuard) `SettingsGuard.tsx:8-20` | Visible in menu, then blocked on click (SettingsGuard) | n/a | n/a |
| Manager | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Open | Visible in menu, then blocked on click (SettingsGuard) | Visible in menu, then blocked on click (SettingsGuard) | n/a | n/a |
| Agent | same as Manager | | | | | | | | | | | | | | | Visible in menu, then blocked on click (SettingsGuard) | Visible in menu, then blocked on click (SettingsGuard) | n/a | n/a |
| Reception | same as Manager | | | | | | | | | | | | | | | Visible in menu, then blocked on click (SettingsGuard) | Visible in menu, then blocked on click (SettingsGuard) | n/a | n/a |
| Other tenant templates (Specialist, Sales, Executive, custom) | same as Manager (role strings are free text) | | | | | | | | | | | | | | | Visible in menu, then blocked on click (SettingsGuard) | Visible in menu, then blocked on click (SettingsGuard) | n/a | n/a |
| Patient (Companion) | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | Open (no guard at all) |
| Anonymous kiosk visitor | n/a (cannot reach unless signed in) | | | | | | | | | | | | | | | n/a | n/a | Open (no sign-in) | n/a |
| Not signed in | Enforced (redirect to /login, `ProtectedRoute.tsx:7-9`) for all tenant routes; but see `/patient`, `/reception`, `/pricing`, `/signup`, `/invite`, `/payment`, `/onboarding` which are public (`routes.tsx:110-213`) | | | | | | | | | | | | | | | | | Open | Open |

Notes on specific cells (all Open unless stated; module refs):
- Overview: G1-OV-20, G1-E-07 (shows tasks of other orgs/admin).
- Reports incl. Revenue: G1-RL-10, G1-E-15; also mounted at `/admin/reports` and `/admin/campaigns` (`routes.tsx:339-340`).
- Clients: delete, bulk delete, import, export of the whole DB open to any signed-in user (02-clients.md line 31; G2-E-09). Whole module Open, `/clients/:id` too.
- Call Logs and Scribe: G3-E-33 (any user sees PHI, picks any doctor, issues "Attested"/"Verified").
- Chats: all threads visible, "Me" hardcoded to id "1", group owner hardcoded "Clinic Admin" (04-chats.md line 41; G4-Q-19).
- Process Kanban and Tasks: G5-E-17 (any user edits/deletes others' tasks), G5-E-25 (delete button depends on creator's display name containing "admin").
- Appointments: G6-E-28 (the "provider-only" view exists in code but is a fixed internal value, `Appointments.tsx:338-340`, unverified by me beyond module file).
- Services/Invoices/Claims: G7-S-25, G7-Q-16; write-off G7-E-18; claim submit has no role check (07-services-invoices-claims.md, claim section).
- Workflows, Automation, Webforms: G8-E-07; per-form permissions object not enforced (08 line 113; G13-E-55); tenants can toggle/delete admin automation rules (G13-E-51).
- Knowledge Base: G9-Q-04. The `knowledgeBase` row in `RolesPermissionsDrawer.tsx:47` is not enforced.
- AI Receptionist settings and all Settings tabs: `SettingsGuard` wraps `settings`, `settings/:tab`, `settings/:tab/:subtab`, `settings/team/:id`, `billing`, `billing/:subtab` (`routes.tsx:252-264`). Redirect to `/` for any role but SystemAdmin, but only the literal string "SystemAdmin" passes (`SettingsGuard.tsx:8`).

### 2.2 Tenant-shell routes that sit OUTSIDE the Settings guard (privilege leaks)

| Route | Line | What it exposes | Cell for every signed-in role | Module ref |
|---|---|---|---|---|
| `/organizations` | `routes.tsx:245` | Full Organizations page: suspend, delete, re-plan any org | Open | G13-E-02 (Critical), G14-E-05 |
| `/users` | `routes.tsx:246` | Client user manager with permissions and credits, separate sample user list | Open | G10-E-09, G14-E-05 |
| `/payments` | `routes.tsx:247` | Billing data | Open | G10-E-26 |
| `/transactions` | `routes.tsx:251` | Billing data | Open | G10-E-26 |
| `/roles` | `routes.tsx:267` | Redirect to `/settings/team?tab=roles` (then Settings guard applies) | Enforced via redirect target | n/a |
| `/profile`, `/guide`, `/refer-and-earn` | `routes.tsx:272-276` | Own profile, help | Open | n/a |

### 2.3 Platform / Super Admin (`/admin/*`, module 13) and Settings tabs reused there

`AdminLayout` is mounted at `routes.tsx:279-281` inside `ProtectedRoute` only. It reads the role (`AdminLayout.tsx:46`) but never blocks. Visibility of sidebar items is the only control and only for admin-role names found in the admin role list.

| Role | /admin/* (URL) | /admin sidebar items | Admin actions (create/edit/delete/suspend) | `/admin/settings` (renders tenant Settings) | `/admin/settings/logs` audit |
|---|---|---|---|---|---|
| SystemAdmin | Open | All shown (`adminRolesStore.ts:191`) | Open | Open (outside `SettingsGuard`, `routes.tsx:334`) | Open |
| Admin | Open | All shown (`:191`) | Open | Open | Open |
| Manager / Agent / Reception (tenant roles) | Open (G13-E-98, G14-E-04) | All shown (unknown name -> allow, `:194`, G13-E-99) | Open | Open | Open |
| BillingAdmin, SupportSpecialist, ReadonlyAuditor, Clinical Operations Lead (admin templates) | Open | Hidden only (`AdminSidebar.tsx:176-186`) | Open: action permissions never checked (G13-E-100, G13-TEL-19) | Open | Hidden only |
| Custom admin role | Open | Hidden only | Open | Open | Hidden only |
| Patient / kiosk visitor | n/a (needs sign-in token, which is trivially set: G14-E-03) | n/a | n/a | n/a | n/a |

Special modules inside Super Admin:
- Role manager itself: any signed-in user can open `/admin/roles` and edit roles, including changing a SystemAdmin's role; no last-SystemAdmin guard (G13-E-03, `AdminUserManagement.tsx:517-525`, unverified by me beyond module file). SystemAdmin role object is `isLocked` in the store (`adminRolesStore.ts:99-100`).
- "Admin Control" permission checkboxes on Document Templates, Product/Services, Automations are not wired (G13-E-34).
- `/admin/tasks` (shared `Tasks` page): G5-E-28.

### 2.4 Public and prototype-only surfaces (module 14, 11, 12)

| Surface | Route | Control | Cell |
|---|---|---|---|
| Login, verify | `/login`, `/verify` | Any email/password; any 6 digits (G14-E-01, G14-E-02) | Open |
| Signup, invite, payment, onboarding | `/signup`, `/invite/:token`, `/payment`, `/onboarding`, typo twin `/onbaording` | No guard; invite for existing email signs in as SystemAdmin without password (G14-E-06) | Open |
| Pricing | `/pricing` | public | Open |
| Kiosk | `/reception`, `/reception/*` (11 routes) | None. Any browser with the URL; org taken from query param, falls back to last-saved org (G9-E-13) | Open |
| Patient portal | `/patient/*` | None. URL `/patient/:clientId` switches identity (G12-E-02); code login accepts anything (G12-E-03); "Switch Patient (Dev)" in production (G12-E-05) | Open |

---

## 3. What the PRD says (personas and permission rules)

Source: PRD `E:\ma-prd\content\**`, via the module B sections. "PRD silent" = no permission rule found. Personas are named in user-story rows (`F-n-J*`) and "Jobs to be done" tables, not as a role system.

| Module | Personas the PRD names | Permission / access rules in the PRD | PRD ref |
|---|---|---|---|
| 01 Overview | Medical Assistant, Clinic Coordinator | PRD silent on permissions | `client/overview.md` jobs-to-be-done |
| 01 Reports | Practice Administrator | PRD silent | `client/reports.md` |
| 02 Clients | Receptionist (find chart by phone), Physician (encounter timeline) | "under HIPAA compliance controls" for export (summary, §1); no roles defined | `client/clients.md` §1, §F-1.4, §F-2.4 |
| 03 Call Logs | Quality Assurance Supervisor | PRD silent | `client/call-logs.md` §F-5 |
| 03 Scribe | Physician | PRD silent (the PRD asks for "Sign & Attach" by a physician, not built) | `client/scribe.md` |
| 04 Chats | Care Coordinator, Medical Assistant, Practice Manager, Practice Administrator, Front-Desk Lead, Triage Coordinator, Clinical Coordinator, Clinic Staff | PRD silent on who sees which threads (G4-Q-19) | `client/chat/*.md` |
| 05 Process Kanban | Practice Manager, Care Coordinator | PRD silent | `client/processes/kanban.md` |
| 05 Tasks | Attending Physician, Care Coordinator, Care Manager, Treating Clinician; Admin side: Super Admin / Platform Admin | Role-targeted tasks: Admin tasks scoped to a clinic role arrive in My Tasks; admin-private tasks excluded (`client/tasks/my-tasks.md` §F-1); no delete rule (G5-Q-14) | `client/tasks/my-tasks.md` §F-1; `admin/tasks.md` |
| 06 Appointments | Receptionist | PRD silent on who may book for others or cancel (G6-Q-12) | `client/appointments/list.md` |
| 07 Services | Practice Manager | PRD silent on who may edit prices (G7-S-25) | `client/services.md` |
| 07 Invoices | Billing Specialist | PRD silent on void / write-off / record payment roles (G7-Q-05, G7-Q-06) | `client/invoices.md` |
| 07 Claims | Insurance Biller | PRD silent | `client/claims.md` |
| 08 Workflows / Automation | Clinical Coordinator (workflows), Practice Administrator (automation) | PRD silent (G8-Q-19) | `client/workflows.md`, `client/automation.md` |
| 08 Webforms | Practice Coordinator | Form has a view/edit/share permissions object in the build; PRD silent | `client/web-forms.md` |
| 09 Knowledge Base | Medical Assistant | PRD silent (G9-Q-04) | `client/knowledge-base.md` |
| 09 AI Receptionist settings | Practice Manager, Ops Lead, Front-Desk Supervisor | No explicit rule; these personas are NOT SystemAdmin, so SystemAdmin-only guard locks them out (G9-Q-05, G9-KT-22) | `client/settings/reception.md`, `ai-receptionist/settings/*.md` |
| 10 Settings: Team | Practice Administrator | Roles "Admin, Doctor, Nurse, Coordinator, Billing"; role-based invites (`client/settings/team.md` §1). Role denial acceptance criterion F-2.1 ("module set to deny: users cannot open or act") | `client/settings/team.md` |
| 10 Settings: Organization, Security, Integrations, Billing, Voices | Practice Administrator, Practice Manager, Medical Director | Billing "administrators" manage plans; PRD silent on who else (G10-Q-03) | `client/settings/*.md` |
| 10 Audit Logs | (HIPAA audit) | PRD silent on viewers; says log must be limited to this organization (module 10 §D) | `client/settings/audit-logs.md` |
| 11 Kiosk | Patient (walk-in/scheduled), Receptionist (alerted by Call Staff) | Identity must be verified (phone OTP, face) before personal data; PHI shown only after first-name confirmation (`ai-receptionist/checkin/*`, `my-visit/*`); no staff role rules | `ai-receptionist/**` |
| 12 Companion | Patient only | Active-patient match guard by client ID (module 12 §D F-4.2); sign-in model undefined (G12-Q-01) | `companion/**`, `client/chat/companion.md` |
| 13 Super Admin | Superadmin, Platform Admin, Revenue Officer, Security Officer | `admin/roles.md`: RBAC matrix, 18 modules x 6 roles (Doctors, Nurses, Coordinators, Billing Specialists, Receptionist in examples), actions Read/Add/Edit/Delete/Export/Import; "Users lacking a permission have the UI buttons hidden and API endpoints blocked" (F-1-1); PHI Export needs MFA re-auth (F-1.3). `admin/users.md`: SSO, session revocation. `admin/organizations.md` F-1.3: read-only impersonation, audited | `admin/*.md` |
| 14 Prototype-only | no PRD | n/a | n/a |

Key PRD fact: the only place the PRD states an enforcement rule is `admin/roles.md` F-1-1 (hidden buttons and blocked endpoints) and F-1.3 (MFA gate for Export). The PRD's role list is Admin / Doctor / Nurse / Coordinator / Billing (+ Receptionist in examples); the build's lists are Admin / Manager / Specialist / Reception / Sales / Agent / Executive. There is no mapping between them (G10-Q-05).

### 3.1 PRD matrix (persona x module), "who is the intended user"

Because the PRD names jobs, not permissions, the matrix below states PRD intent where it exists and "PRD silent" elsewhere. Rows are the roles the PRD lists in `team.md` / `roles.md`.

| PRD role | Clients | Call Logs / Scribe | Chats | Process / Tasks | Appts | Services / Invoices / Claims | Workflows / Forms / KB | AI Receptionist settings | Settings (Team, Billing, Org) | Super Admin |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin | PRD silent | PRD silent | PRD silent | Tasks: receives role-targeted admin tasks only if clinic role matches | PRD silent | Billing "administrators" top-up (`billing.md`) | PRD silent | PRD silent | Invites staff, assigns roles (`team.md`) | n/a (separate Superadmin) |
| Doctor / Physician | Timeline (`clients.md` F-2.4) | Scribe user; "Sign & Attach" | PRD silent | My Tasks inbox | PRD silent | PRD silent | PRD silent | PRD silent | n/a | n/a |
| Nurse | PRD silent | PRD silent | PRD silent | My Tasks | PRD silent | PRD silent | PRD silent | PRD silent | role template | n/a |
| Coordinator / Care Coordinator | PRD silent | PRD silent | Chat user | Kanban, tasks-by-me | PRD silent | PRD silent | Workflows | PRD silent | role template | n/a |
| Billing / Billing Specialist / Insurance Biller | PRD silent | PRD silent | PRD silent | PRD silent | PRD silent | Invoices, claims | PRD silent | PRD silent | role template | n/a |
| Receptionist | Find chart by phone | PRD silent | PRD silent | PRD silent | Primary list user | PRD silent | PRD silent | "Receptionist" appears 36 times in `reception.md` as the AI, not a human role | Example: delete off for Receptionist (`admin/roles.md`) | n/a |
| Practice Manager | PRD silent | PRD silent | PRD silent | Kanban | PRD silent | Services owner | PRD silent | Intended owner (G9-Q-05) | Billing/Voices | n/a |
| Patient | n/a | n/a | Chats via Companion | Patient tasks | Books via Companion | Pays via Companion/kiosk | Fills forms | n/a | n/a | n/a |
| Superadmin / Platform Admin | n/a | n/a | n/a | Delegates tasks to clinic roles | n/a | n/a | Templates | n/a | n/a | RBAC, SSO, impersonation, suspend (`admin/*.md`) |

---

## 4. Mismatch list: prototype vs PRD, ranked by impact

Impact order: [SECURITY] Critical, [SECURITY] High, then enforcement gaps, then model gaps. IDs are module defect/finding IDs.

| # | Mismatch | Prototype (verified) | PRD | Tag | IDs |
|---|---|---|---|---|---|
| 1 | Active role comes from browser storage and defaults to SystemAdmin; nothing sets it; everyone who signs up is SystemAdmin | `AuthContext.tsx:27-29, 47-51`; `Login.tsx:103` | RBAC with real roles (`admin/roles.md`) | [SECURITY] | G13-E-05, G14-E-03, G14-E-06 |
| 2 | `/admin/*` (whole Super Admin) needs only sign-in: any tenant user can open platform admin, edit roles, suspend orgs | `routes.tsx:215, 279-281`; `ProtectedRoute.tsx:4-12`; `AdminLayout.tsx:46` | Super Admin screens are for platform staff (`admin/*.md`) | [SECURITY] | G13-E-98, G14-E-04, G10-E-16, G5-E-28 |
| 3 | Organizations page (suspend, delete, re-plan any org) and `/users`, `/payments`, `/transactions` exposed in tenant shell | `routes.tsx:245-247, 251` | PRD: platform staff only | [SECURITY] | G13-E-02, G14-E-05, G10-E-09, G10-E-26 |
| 4 | Role permission matrix never checked: "deny all" role has no effect; only SettingsGuard exists | `lib/permissions.ts:3-38` unused; `SettingsGuard.tsx:8` | `admin/roles.md` F-1-1 "buttons hidden and API endpoints blocked"; `team.md` F-2.1 | [SECURITY] | G10-E-03, G10-Q-03 |
| 5 | Admin-role action permissions never called; unknown role sees everything; admin roles can be edited by anyone | `adminRolesStore.ts:194, 202-218` | Matrix with Read/Add/Edit/Delete/Export/Import | [SECURITY] | G13-E-99, G13-E-100, G13-E-03 |
| 6 | Patient portal has no auth: identity from URL or first client; code never verified | `routes.tsx:155-178`; `PatientLoginScreen.tsx:192-203` | Auth model undefined (G12-Q-01); consent-gated PHI | [SECURITY] Critical | G12-E-01, G12-E-02, G12-E-03, G12-E-05, G12-E-10, G12-E-18..20 |
| 7 | Kiosk OTP accepts 1234/0000; face recognition fake; My Visit has no identity check; invoice lookup leaks all unpaid invoices | module 11 | PRD requires OTP and verified identity before PHI | [SECURITY] Critical | G11-E-01, E-03, E-05, E-06, E-34 |
| 8 | Whole-DB export, bulk delete, import open to every signed-in user, no audit | `Clients.tsx:4036-4058` (module file) | "HIPAA compliance controls"; PHI Export gated by MFA re-auth (`admin/roles.md` F-1.3) | [SECURITY] | G2-E-09, G2-L-13, G2-Q-02 |
| 9 | Tenant Audit Logs tab shows platform-wide log (other orgs, staff emails, IPs); audit actor hardcoded; log editable and re-seeded | `Settings.tsx:7763-7764` (module file) | Log limited to own org (module 10 §D) | [SECURITY] | G10-E-15, G10-E-17, G13-E-96, G13-E-95, G13-E-94 |
| 10 | Tenant can edit/delete admin-owned custom fields and global automation rules; client ignores admin form scope, allowed roles, permissions | module file refs | Admin templates inherit into tenants (module 13 D) | [SECURITY] | G10-E-29, G13-E-51, G13-E-55, G13-E-48 |
| 11 | AI Receptionist settings SystemAdmin-only, PRD personas are Practice Manager / Ops Lead / Front-Desk Supervisor | `SettingsGuard.tsx:8`; `routes.tsx:252-262` | personas in `client/settings/reception.md` | Model gap | G9-KT-22, G9-Q-05 |
| 12 | Role names and templates disagree: PRD Admin/Doctor/Nurse/Coordinator/Billing vs build Admin/Manager/Specialist/Reception/Sales/Agent/Executive; roles in session storage | `RolesPermissionsDrawer.tsx:114-160`; `AddTeamMemberDrawer.tsx:16-23` | `client/settings/team.md` | Model gap | G10-Q-05, G10-E-04, G13-Q-05 |
| 13 | Clinical sign-off ("Attested", "Verified", Rx) with no role; any user picks any doctor | module 03 | PRD: Physician signs | [SECURITY] | G3-E-33, G3-E-18, G3-E-21 |
| 14 | Money actions with no role: write-off stored as cash payment, void, kiosk and portal mark invoices paid on a tap | module 07/11/12 | PRD silent on roles | [SECURITY] | G7-E-18, G11-E-16, G12-E-20 |
| 15 | Chats: every user reads every thread, "Me" = user 1, owner "Clinic Admin" hardcoded | `Chats.tsx:227` (module file) | PRD silent | Model gap | G4-Q-19, G4-E-16 |
| 16 | Task permission derived from names ("contains admin", "physician", "alistair"); "Tasks by me" shows everyone's tasks and allows edit/delete | module 05 | PRD: My Tasks = assigned to me or role target | [SECURITY] | G5-E-16, G5-E-17, G5-E-25 |
| 17 | Appointments: provider-only view built but unreachable; all providers' appointments cancelable by anyone | `Appointments.tsx:338-340` (module file) | PRD silent | Model gap | G6-E-28, G6-Q-12 |
| 18 | Nav `roles` lists are dead code; Settings nav shows for all roles and bounces | `navigation.ts:259-285` unused; `SidebarMenuContext.tsx:84-92` | `admin/roles.md` sidebars by role (module 13 G13-SB-03/04) | Enforcement gap | G13-Q-31 |
| 19 | PRD features that do not exist: SSO, impersonation, MFA re-auth for export, session revocation | not built | `admin/users.md`, `admin/organizations.md` F-1.3, `admin/roles.md` F-1.3 | PRD-only | G13-USR-04, G13-ORG-08, G13-Q-01 |
| 20 | Integration secrets, face templates, passwords, card data in plain browser storage; org security policies (2FA, timeout) do nothing | module 10/11/14 | PRD says "encrypted" | [SECURITY] | G10-E-30, G10-E-12, G10-E-13, G11-E-12, G14-E-07, G14-E-17 |

---

## 5. Destructive or sensitive actions with no role control

Every row below is open to any signed-in user (or any visitor for kiosk/portal) in the prototype.

| Action | Where | Control today | IDs |
|---|---|---|---|
| Delete / bulk-delete contacts | Clients | none | G2-Q-02, G2-E-09 |
| Export entire contact DB (xlsx/csv) | Clients | none, no audit entry | G2-E-09, G2-L-13 |
| Import contacts, webhook import with hardcoded "Production Key" | Clients | none | G2-E-08, G2-Q-02 |
| Delete call logs (toast says deleted, nothing removed) | Call Logs | none, no confirm | G3-E-10 |
| View recordings / transcripts (PHI) | Call Logs | none | G3-E-33 |
| Delete Scribe sessions (row and bulk, permanent, no audit) | Scribe | none, no confirm | G3-E-23 |
| Sign / "Attest" note, file "Verified" prescription with fixed credentials, send Rx over WhatsApp with shared link | Scribe | none | G3-E-21, G3-E-22, G3-E-33 |
| Read every chat thread; create groups | Chats | none | G4-Q-19 |
| Edit/delete other users' tasks; delete from task header (name-based) | Tasks | name matching | G5-E-17, G5-E-25 |
| Post an internal admin task into a patient's chat | Tasks / Share | none | G5-E-26 |
| Cancel any provider's appointment | Appointments | none | G6-E-28 |
| Create/edit/delete catalogue items, change prices | Services | none | G7-S-25, G7-Q-16 |
| Void invoice; drag to Paid without payment | Invoices | none, no confirm | G7-Q-05, G7-Q-16 |
| Write-off (stored as cash, marks Paid) | Invoices | none | G7-E-18, G7-Q-06 |
| Record payment | Invoices | none | G7-Q-16 |
| Create / submit claim to clearinghouse ("Submit Electronically" always succeeds, checklist always green) | Claims | none | G7-Q-16, G7-C-32 (module 07) |
| Edit AI prompts, delete stages and rules; publish forms; toggle/delete admin automation rules | Workflows / Automation / Webforms | none | G8-E-07, G8-Q-19, G13-E-51 |
| Delete KB sources (global storage, cross-org) | Knowledge Base | none | G9-Q-04, G9-E-02 |
| Edit rooms/stations (global, shows all orgs) | Settings > AI Receptionist | SystemAdmin only (guard) but data is global | G9-E-17 |
| Delete face data / withdraw biometric consent | Client profile | cards not mounted, so staff cannot act | G2-E-24 |
| Staff "Quick Enroll" face with fabricated consent | Client profile | none | G11-E-14 |
| Invite, edit, remove team members; change roles | Settings > Team | SystemAdmin only (guard) | G10-Q-03 |
| Suspend / delete / re-plan organization | `/organizations`, `/admin/organizations` | none | G13-E-02, G13-ORG-16 |
| Change a SystemAdmin's role (no last-SystemAdmin guard) | `/admin/users` | none | G13-E-03 |
| Edit roles / permissions of any role | `/admin/roles` | none | G13-E-98, G13-E-100 |
| Workspace billing / plan changes (no confirm, no audit) | `/admin/billing`, `/admin/plans` | none | G13-E-66, G13-PLAN-21 |
| Reveal telephony secrets; release numbers | `/admin/integrations/telephony` | none (logs mislabel) | G13-E-86, G13-E-91 |
| Export audit log CSV (no audit of the export) | Settings / `/admin/logs` | none | G10-E-18 |
| Clear/edit audit log | browser storage | none | G10-E-17 |
| Mark invoice paid from kiosk / patient portal with no proof | Kiosk, Companion | none | G11-E-16, G12-E-20 |
| Change sign-in identifiers (phone/email) and password in portal | Companion profile | none | G12-E-07, G12-E-08 |
| Reports: edit shared report definitions across orgs (incl. revenue) | Reports | none | G1-E-15 |
| Org security policies (2FA, timeout) save | Settings > Organization | not wired | G10-E-12 |

---

## 6. Decisions needed: the role model the PM must define

Questions reference IDs in the module files. Group A is a prerequisite to the rest.

### A. Model foundations
1. **One role system or three?** Today: auth `Role` string, admin-portal templates, tenant templates (section 1.2). Decide: a single tenant role set, a separate platform-staff role set, and where each is stored (server, not browser). (G13-Q-05, G10-Q-05, G13-Q-04)
2. **Canonical tenant role list.** PRD: Admin, Doctor, Nurse, Coordinator, Billing (+ Receptionist examples; personas Practice Manager, Medical Assistant, Care Coordinator, Billing Specialist). Build: SystemAdmin, Admin, Manager, Agent, Reception, Specialist, Sales, Executive. Pick names and which are system (locked) vs custom. (G10-Q-05, G10-Q-03)
3. **SystemAdmin vs Admin (tenant).** Is "SystemAdmin" a tenant owner role or a platform role? Today the same string gates tenant Settings and is the platform root. (G10-Q-03, G13-Q-02, G14-Q-04)
4. **Default role when none is known** (today SystemAdmin) and what role an invited owner/new signup gets. (G13-Q-04, G14-Q-04)
5. **Unknown role behaviour**: allow-all today. Must be deny. (G13-Q-02)
6. **Enforcement level**: hide nav only, block URL, block action, block API? PRD says hide buttons and block endpoints; build blocks only Settings. Decide for all modules. (G13-Q-02, G10-Q-03, G13-Q-31)

### B. Who may do what (per module)
7. Reports and Overview, especially Revenue and Team sources. (G1-Q-16)
8. Clients: delete, bulk delete, import, export (and audit), add categories, mark fields required. (G2-Q-02)
9. Call recordings/transcripts, Scribe signing, who may be "responsible clinician". (G3-L-20, G3-S-29, G3-E-33)
10. Chats: view all threads vs own, assign, edit Website/Companion settings. (G4-Q-19)
11. Tasks: delete rights, how admin role-targeted tasks match a user. (G5-Q-14, G5-Q-09)
12. Appointments: see other providers, book for others, cancel, edit availability. (G6-Q-12)
13. Catalogue (prices), void invoices, write-off (with approval?), record payments, create/submit claims. (G7-Q-16, G7-Q-05, G7-Q-06)
14. Workflows, automations, forms edit/publish. (G8-Q-19)
15. Knowledge Base CRUD. (G9-Q-04)
16. AI Receptionist settings: Admin/Manager access, perhaps Rooms only; PRD personas Practice Manager, Ops Lead, Front-Desk Supervisor. (G9-Q-05)
17. Team management: who invites, edits, removes; seat limits. (G10-Q-03, G10-Q-02)
18. Billing pages `/payments`, `/transactions`: keep or retire, who opens. (G10-Q-09, G10-Q-19)
19. Audit logs: who reads, scope (own org only), what is audited, immutability, signed exports. (G10-Q-01, G10-Q-18, G13-Q-16, G11-Q-17)
20. Biometric data: who may view, delete, enroll on a patient's behalf. (G11-Q-17, G2-E-24)

### C. Patients and visitors
21. Patient auth model: real OTP, session length, whether passwords exist, whether client ID is a login, caregiver/guardian roles. (G12-Q-01, G12-Q-16)
22. Kiosk identity: what a verified session authorises, OTP rules, what My Visit requires. (G11-Q-04, G11-Q-01)
23. Whether the kiosk or portal may mark invoices Paid on the visitor's word. (G11-Q-01)

### D. Platform (Super Admin)
24. Which roles may open `/admin/*`; remove `/organizations` and `/users` from the tenant shell. (G14-Q-02, G13-Q-02)
25. Keep or roadmap-mark unbuilt PRD features: SSO, session revocation, impersonation, MFA re-auth for export. (G13-Q-01)
26. Platform role templates (BillingAdmin, SupportSpecialist, ReadonlyAuditor, Clinical Operations Lead): keep, rename, or replace; meaning of "Permitted Scope". (G13-Q-29, G13-Q-05)
27. Which module ids map to which screen (one id "roles" controls two screens; analytics keys match no module). (G13-E-101, G13-ROLE section)
