# G13 — Super Admin — Gap Analysis
_Sources:_ PRD files `content/admin/organizations.md`, `users.md`, `roles.md`, `plans/plans.md`, `plans/pricing.md`, `plans/categories.md`, `plans/actions.md`, `industry-category/industries.md`, `industry-category/categories.md`, `custom-fields/fields.md`, `custom-fields/sections.md`, `document-templates.md`, `sidebar-config.md`, `ai-voices-models.md`, `tasks.md` (high level only); client cross-checks in `content/client/settings/{billing,custom-fields,voices,team,audit-logs,integrations}.md` | Prototype routes `/admin/**` in `src/app/routes.tsx:278-341`, sidebar `src/app/components/layout/AdminSidebar.tsx`, pages `src/app/pages/admin/*.tsx` + `src/app/pages/Organizations.tsx`, stores `src/lib/*Store.ts`, `src/data/*` | Analysed 2026-11-12

> **How to read citations.** Prototype citations are `file:line` relative to `E:\mantra-assist\src\`. PRD citations are `file § section` relative to `E:\ma-prd\content\`. Everything in the prototype is a browser-only mock (localStorage / sessionStorage / in-memory); there is no backend. "Not handled" means the code has no branch for that state.

> **Important context on the PRD.** Every admin PRD file is a single-feature stub (~60 lines) and each claims to be "Documented directly from MantraAssist figma codebase specifications". In practice most of their detail (SSO, impersonation, failover router, rate cards, terminology overrides…) does not exist in the code, and most of what the code does is absent from the PRD. Treat the PRD as aspirational, not as a description of the build. Ops and analytics screens have **no PRD file at all** (grep of `content/admin/**` for analytics, telephony, audit, subscription, orders, knowledge, automation, template returns only incidental mentions).

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Organizations | 0 | 3 | 9 | 2 | 3 | 2 | 10.7 |
| User Management | 0 | 1 | 10 | 0 | 4 | 5 | 4.5 |
| Roles & Permissions | 0 | 1 | 7 | 2 | 2 | 5 | 5.0 |
| Plans — Industry Plans | 1 | 3 | 8 | 2 | 3 | 4 | 17.9 |
| Plans — Packed Pricing | 1 | 3 | 3 | 0 | 3 | 4 | 35.7 |
| Plans — Plan Categories | 0 | 2 | 3 | 2 | 1 | 2 | 14.3 |
| Plans — Credit Actions | 0 | 2 | 4 | 1 | 3 | 0 | 14.3 |
| Industries — Industries | 0 | 0 | 5 | 1 | 3 | 2 | 0.0 |
| Industries — Categories | 3 | 1 | 2 | 1 | 0 | 1 | 50.0 |
| Sections & Fields — Fields | 1 | 4 | 6 | 2 | 2 | 6 | 23.1 |
| Sections & Fields — Sections | 1 | 1 | 4 | 1 | 2 | 1 | 21.4 |
| Document Templates | 1 | 3 | 4 | 2 | 3 | 6 | 25.0 |
| Sidebar Navigation Templates | 2 | 1 | 5 | 3 | 1 | 2 | 22.7 |
| AI Voices & Models | 0 | 1 | 9 | 1 | 3 | 2 | 4.5 |
| Admin Tasks (high level) | 1 | 0 | 0 | 0 | 0 | 0 | 100.0 |
| Product / Services | 0 | 0 | 7 | 0 | 0 | 5 | No PRD |
| Workflows | 0 | 0 | 7 | 0 | 0 | 6 | No PRD |
| Automations | 0 | 0 | 6 | 0 | 0 | 3 | No PRD |
| Forms | 0 | 0 | 6 | 0 | 0 | 5 | No PRD |
| Knowledge Base | 0 | 0 | 4 | 0 | 0 | 5 | No PRD |
| Workspace Billing | 0 | 0 | 5 | 0 | 0 | 5 | No PRD |
| Orders | 0 | 0 | 6 | 0 | 0 | 3 | No PRD |
| Subscriptions | 0 | 0 | 6 | 0 | 0 | 6 | No PRD |
| Analytics — Overview | 0 | 0 | 5 | 0 | 0 | 3 | No PRD |
| Analytics — Voice Calls | 0 | 0 | 6 | 0 | 0 | 4 | No PRD |
| Analytics — Org Usage | 0 | 0 | 3 | 0 | 0 | 1 | No PRD |
| Analytics — Process Movement | 0 | 0 | 3 | 0 | 0 | 2 | No PRD |
| Analytics — Revenue & Invoices | 0 | 0 | 2 | 0 | 0 | 2 | No PRD |
| Telephony | 0 | 0 | 10 | 0 | 0 | 9 | No PRD |
| Audit Logs | 0 | 0 | 4 | 0 | 0 | 4 | No PRD |
| Cross-cutting (admin shell) | 0 | 0 | 4 | 0 | 0 | 6 | No PRD |
| **Total** | **11** | **26** | **163** | **20** | **33** | **111** | **10.9** |

Overall coverage: **10.9%** · PRD-backed coverage: **17.6%** ((11 + 0.5 × 26) ÷ 136). Prototype defects and PRD-only items are excluded. The defect column counts C rows; some C rows share one E entry, so section E lists **103 distinct defects: 5 Critical, 21 High, 37 Medium, 40 Low** (20 tagged [SECURITY]).

## Route map
Aliases are listed on one line; all aliases render the same page. "Sidebar" = shown in admin sidebar (`AdminSidebar.tsx:113-168`).

| Route(s) | Page file | Sidebar label (section) | PRD file |
| :--- | :--- | :--- | :--- |
| `/admin` (index), `/admin/custom-fields` | `app/pages/admin/AdminCustomFields.tsx` | Sections/Fields (TEMPLATES) | `admin/custom-fields/fields.md`, `sections.md` |
| `/admin/organizations` (also client `/organizations`, `routes.tsx:245`) | `app/pages/Organizations.tsx` | Organizations (CORPORATE) | `admin/organizations.md` |
| `/admin/tasks`, `/admin/tasks/:taskId` | `app/pages/Tasks.tsx`, `TaskDetailPage.tsx` (shared with client) | Tasks (CORPORATE) | `admin/tasks.md` (analysed by Tasks agent) |
| `/admin/industry-category`, `/admin/industries`, `/admin/industry` | `app/pages/admin/AdminIndustries.tsx` | Industries (CORPORATE) | `admin/industry-category/industries.md`, `categories.md` |
| `/admin/billing/orders` | `app/pages/admin/AdminOrders.tsx` | Orders (BILLING & ORDERS) | none |
| `/admin/billing/subscriptions`, `/admin/subscriptions` | `app/pages/admin/AdminSubscriptions.tsx` | Subscriptions (BILLING & ORDERS) | none |
| `/admin/plans`, `/admin/plans-credits`, `/admin/credits` | `app/pages/admin/AdminPlans.tsx` | Plans & Credits (BILLING & ORDERS) | `admin/plans/plans.md`, `pricing.md`, `categories.md`, `actions.md` |
| `/admin/billing` | `app/pages/admin/AdminBilling.tsx` | — (URL only) | none |
| `/admin/product-analytics/calls` | `app/pages/admin/AdminAnalyticsCalls.tsx` | Calls (PRODUCT ANALYTICS) | none |
| `/admin/product-analytics/overview` | `app/pages/admin/AdminAnalyticsOverview.tsx` | — (URL only) | none |
| `/admin/product-analytics/organization-usage` | `app/pages/admin/AdminAnalyticsOrgUsage.tsx` | — (URL / link from Overview) | none |
| `/admin/product-analytics/process-movement` | `app/pages/admin/AdminAnalyticsProcessMovement.tsx` | — (URL only) | none |
| `/admin/product-analytics/revenue-invoices` | `app/pages/admin/AdminAnalyticsRevenueInvoices.tsx` | — (URL only) | none |
| `/admin/workflows`, `/admin/workflow`, `/admin/process-templates`, `/admin/process-template` | `app/pages/admin/AdminProcessTemplates.tsx` | Workflows (TEMPLATES) | none (client `client/workflows.md` only) |
| `/admin/automations`, `/admin/automation` | `app/pages/admin/AdminAutomations.tsx` | Automations (TEMPLATES) | none |
| `/admin/forms`, `/admin/form-templates`; `/admin/form-builder(/:formId)` → redirect `/admin/forms` | `app/pages/admin/AdminFormTemplates.tsx` | Forms (TEMPLATES) | none |
| `/admin/document-templates`, `/admin/document-template` | `app/pages/admin/AdminDocumentTemplates.tsx` | Document Templates (TEMPLATES) | `admin/document-templates.md` |
| `/admin/services`, `/admin/products-services`, `/admin/product-services`, `/admin/industry-services` | `app/pages/admin/AdminProductsServices.tsx` | Product / Services (TEMPLATES) | none |
| `/admin/knowledge-base`, `/admin/knowledge` | `app/pages/admin/AdminKnowledgeBase.tsx` | Knowledge Base (TEMPLATES) | none |
| `/admin/sidebar-config`, `/admin/sidebar`, `/admin/sidebar-templates` | `app/pages/admin/AdminSidebarConfig.tsx` | Sidebar Navigation (TEMPLATES) | `admin/sidebar-config.md` |
| `/admin/roles`, `/admin/roles-permissions`, `/admin/roles-and-permissions` | `app/pages/admin/AdminRolesPermissions.tsx` | Roles & Permissions (TEMPLATES) | `admin/roles.md` |
| `/admin/ai-voices-models`, `/admin/ai-voices`, `/admin/voice-config` | `app/pages/admin/AdminAIVoicesModels.tsx` | AI Voices & Models (INTEGRATIONS) | `admin/ai-voices-models.md` |
| `/admin/integrations/telephony` (`?tab=providers` / `?tab=numbers`); redirects from `/admin/telephony`, `/admin/telephony/numbers`, `/admin/telephony/calls`, `/admin/integrations/telephony-providers` | `app/pages/admin/AdminTelephony.tsx` | Telephony (INTEGRATIONS) | none |
| `/admin/settings/users`, `/admin/users` | `app/pages/admin/AdminUserManagement.tsx` | User Management (SETTINGS) | `admin/users.md` |
| `/admin/settings/logs`, `/admin/logs` | `app/pages/admin/AdminAuditLogs.tsx` | Audit Logs (SETTINGS) | none (client `client/settings/audit-logs.md`) |
| `/admin/settings` | `app/pages/Settings.tsx` (client Settings rendered inside admin shell) | — | out of scope (client) |
| `/admin/reports`, `/admin/campaigns` | `app/pages/Reports.tsx` (client page) | — | out of scope (client) |
| **Not routed** (imported or present but no route): `AdminPhoneNumbers.tsx`, `AdminCallLogs.tsx`, `AdminTelephonyProviders.tsx` (imported `routes.tsx:97-99`, never mounted), `AdminSecurity.tsx` (not imported), `components/RoleStudioModal.tsx` (not used) | — | — | — |

Sidebar home link points to `/admin/workflows` (`app/components/layout/AdminLayout.tsx:94`), while the index route renders Sections/Fields (`routes.tsx:282`).

---

## A. Product map — as built

### A0. Cross-cutting behaviour (applies to every admin screen)
- **Who can get in.** The whole `/admin` tree sits under a guard that only checks the user is signed in (`app/components/auth/ProtectedRoute.tsx:4-11`; `routes.tsx:215`). There is no super-admin check on any route.
- **Role-based sidebar.** The sidebar hides items the signed-in role cannot read, using the admin-portal role matrix (`AdminSidebar.tsx:170-188`; `lib/adminRolesStore.ts:189-200`). SystemAdmin and Admin always see everything; a role name that is not found **falls back to allow** (`adminRolesStore.ts:194`). The signed-in role comes from browser storage and defaults to SystemAdmin (`app/context/AuthContext.tsx:28,43`).
- **No action-level permissions.** An action-level check exists (`adminRolesStore.ts:202-218`) but no screen calls it; `lib/permissions.ts` is not imported anywhere. Any signed-in user who types an admin URL can perform every action on that page.
- **States.** No admin screen shows a loading state or a data-error state. The shared table supports a loading flag (`app/components/ui/TableComponent.tsx:62,84,494`) but no admin page turns it on. Storage failures are only logged to the console.
- **Audit actor.** Every audit entry written by admin code uses a fixed actor, "Alexander Vance / SystemAdmin" (e.g. `adminRolesStore.ts:234-237`, `lib/ordersBillingStore.ts:498-501`), not the signed-in user.
- **Scope Rules pattern.** Most catalog screens share one "Admin Control" panel: **Scope Rules** (Rule N → 1. Industry Category → 2. Industries → 3. Country (optional)) and **Permissions** (Hide / Edit / Add / Delete) (`app/pages/admin/components/AdminScopingRulesEditor.tsx:84-233`; `AdminControlAccordion.tsx:146-225`). No rules = visible to all tenants. The industry and country lists come from fixed reference data (`data/industryReferenceData.ts:28,83,85,199,263`), not from the Industries admin screen.

### A1. Catalog & config screens

#### A1.1 Organizations (`/admin/organizations`)
- **Purpose.** Platform list of tenant organizations. The super admin invites/provisions an organization with a plan, manages its plan, suspends or deletes it, and exports the list.
- **User roles.** Sidebar item gated by module "organizations" (`AdminSidebar.tsx:117`). The page itself has no role logic and does not read the URL, so the **same page with all actions is reachable by tenants at `/organizations`** (`routes.tsx:245`; component imports `app/pages/Organizations.tsx:24-80`).
- **Screens.** Header "Organizations" (`Organizations.tsx:1146-1147`); toolbar with search (name, email, Org ID), AI Provider filter (All / LiveKit / Dograh), Export, "Add Organization" (`:1151-1179`). Table: Actions, Org ID, Name, Email, Industry (shows the specialty), AI Provider, Created, Status (`:963-1115`), newest first (`:938-942`). Row menu: Assign plan, Upgrade plan (only if a higher tier exists in the same category, `:500-518`), Remove plan, Suspend / Reactivate, Delete (`:1202-1311`). 4-step "Add Organization" drawer (`:1341-1344`); "Assign Plan / Upgrade Plan" drawer (`:2168-2320`); confirmation and discard modals (`:2331-2437`).
- **Flows.**
  1. *Add Organization (invite).* Step 1 Organization email (format-checked) and Website (required) (`:752-760`); name is guessed from the domain (`:765-790`). Step 2 Information: name, country, industry, primary service & category, locations with operating days/hours, products & services, workspace setup (team size, call volume, countries, AI provider), knowledge-base uploads (`:1446-1851`); name, first location and first service are required (`:796-808`). Step 3 Plan: pick a plan from six category tabs (AI Receptionist, AI Scribe, EHR, RCM, Internal, Onboarding) (`:486-495`, `:815-818`). Step 4 Review & Send. Sending waits 600 ms (simulated), creates the organization with status "Invite sent", assigns the plan subscription and stores an invite token; toast "Invite sent to {email}!" with a **Copy Link** button for `/invite?token=…` (`:833-926`). No email is actually sent. Closing with data asks "Discard Unsaved Changes?" (`:741-748`).
  2. *Assign / Upgrade plan.* Choose a plan (required, "Please select a plan to continue"), saves the subscription and the organization's plan fields (`:626-652`).
  3. *Remove plan.* Confirm → organization reverts to the free plan of its category (`:555-572`).
  4. *Suspend / Reactivate.* Confirm → status Suspended / Active (`:573-584`); suspended orgs are blocked at login with "This organization has been suspended. Please contact support." (`app/pages/auth/Login.tsx:82-85,136-140`).
  5. *Delete.* Confirm ("This action is irreversible…") → row removed (`:585-589`, `:2371-2373`).
  6. *Export CSV.* Org ID, Name, Email, Industry, AI Provider, Created Date, Status (`:1117-1138`).
  - **Not available:** edit organization details; status filter.
  - **States:** empty handled ("No organizations found matching your search.", `:1192`); loading only as the invite button spinner (`:2139-2142`); error only step validation; permission not handled.
- **Business rules.** Statuses Invite sent → Onboarding (invite accepted, `app/pages/auth/InviteAcceptance.tsx:285`) → Active (`InviteAcceptance.tsx:340`; `Onboarding.tsx:1311`); Suspended. Unknown status becomes Active (`:248-250`). Currency INR for India else USD (`:855`). Org ID = list length + 1 (`:837-838`) so it can repeat after a delete; no uniqueness check on email or name. Primary requirements are saved from hardcoded defaults (`:685-688`). Stored under `mantra_organizations_v1` (`:322,478`). **No audit entries** for any organization action.
- **KPIs.** None (export toast shows the filtered row count, `:1138`).
- **Cross-module.** The same organization store drives login suspension, invite acceptance, signup, onboarding, payment, the organization context, plan assignment and the client sidebar template resolution (`app/context/SidebarMenuContext.tsx:370`; `lib/plansBillingStore.ts:2386-2401`).

#### A1.2 User Management (`/admin/settings/users`)
- **Purpose.** Manage Mantra platform staff (admin-portal users) and the admin-portal roles assigned to them.
- **User roles.** Sidebar module "userManagement" (`AdminSidebar.tsx:165`). No action checks. SystemAdmin users cannot be suspended or removed from the UI (`AdminUserManagement.tsx:540,552`) but **can** have their role changed (no last-SystemAdmin guard, `:517-525`).
- **Screens.** Header "User Management" (`:731-732`); dropdown switch Users / Roles synced to `?tab=` (`:166-172`, `:761-769`). Users tab: search, role and status filters, Export, "Invite User"; columns Administrator, Email, Role, Status, Last Login, Created (`:421-515`); row actions Change Role, Reset Password, Resend Invite (Invited only), Suspend Access (Active, non-SystemAdmin), Reactivate Access (Suspended), Remove Admin (non-SystemAdmin) (`:517-555`). Roles tab: search, Export, "Add Role"; columns Role Name (lock + System badge), Description, Users, Created (`:649-705`); actions Edit (disabled when locked), Duplicate, Delete (disabled for system roles) (`:707-725`). Drawers/modals: Invite User (`:855-927`), Change Administrator Role (`:932-978`), Reset Password (`:983-1013`), role editor with "Module Permissions Matrix" (Admin Module / Permissions / Level) (`:1018-1143`).
- **Flows.**
  1. *Invite.* Full name, email, role (default Admin) required (`:201,230-232,869,882-883`); status Invited; audit entry; toast "Invitation dispatched to {email}" (`:240-266`). No duplicate-email check; no email sent.
  2. *Change role* → audit entry with before/after (`:269-294`).
  3. *Suspend / Reactivate* — **no confirmation**; audit entry; toast (`:297-326`).
  4. *Reset password* — confirmation modal; audit; toast (`:328-348`). *Resend invite* — audit; toast (`:350-366`).
  5. *Remove admin* — browser confirm "…cannot be undone."; audit (`:368-390`).
  6. *Export* users CSV (`:392-405`) and roles CSV (`:407-418`); exports are not audited.
  7. *Roles:* create (name required "Role Name is required"; every module defaults to Read / All) (`:584-607`); edit blocked for the locked SystemAdmin role (`:592-594`); duplicate (`:630-634`); delete blocked for system roles, custom roles need a browser confirm (`:637-641`). No role-name uniqueness; deleting a role does not reassign its users.
  - **States:** empty handled (`:826,845`); loading, error, permission not handled.
- **Business rules.** User statuses Active / Invited / Suspended (`:68`); 6 seeded users stored in `mantra_admin_users` (`:74-137`). Admin-portal roles: 21 modules (`adminRolesStore.ts:40-68`), actions read / write / delete / import / export, levels All Records / Role / Own Records / Deny (`adminRolesStore.ts:16`; labels `AdminUserManagement.tsx:1115-1118`); selecting Write adds Read and Delete (`app/components/settings/PermissionSelect.tsx:150-172`). Six seeded roles; SystemAdmin locked; SystemAdmin, Admin, BillingAdmin, SupportSpecialist, ReadonlyAuditor cannot be deleted (`adminRolesStore.ts:89-161,257-259,329-331`). Stored in `mantra_admin_roles_v2`. Admin users are **not linked to sign-in** (the record store is read nowhere else).
- **KPIs.** Roles tab "Users" = number of admin users whose role name matches, ignoring case (`AdminUserManagement.tsx:684`).
- **Cross-module.** The admin role matrix drives only the admin sidebar. Client team roles are separate (`app/pages/Settings.tsx:1381-1399`).

#### A1.3 Roles & Permissions (`/admin/roles`)
- **Purpose.** Define **tenant role templates** (not admin-portal roles): an industry-scoped set of module permissions, plus departments. Subtitle "Configure multi-tenant security roles…" (`AdminRolesPermissions.tsx:933`).
- **User roles.** Sidebar module "roles" (`AdminSidebar.tsx:150`) — the same module id that the admin role store labels "Roles" and points at User Management → Roles (`adminRolesStore.ts:66`), so one permission controls two screens. No action checks.
- **Screens.** Sub-tabs "Roles (n)" and "Departments (n)" (`:937-962`). Roles: search, category / industry filters, "Create Role"; columns Role Name, Description, Admin Scope, Permitted Scope, Created Date (`:732-791`); actions Configure Permissions, Duplicate Role, Delete (disabled for system) (`:884-902`). Departments: search, "Add Department"; columns Department Name, Description, Assigned Roles, Actions (`:793-882`). Role drawer: Role Name*, Department, Description, Admin Scope, matrix Module / Permission / Level with expandable per-workflow rows and "inherit" toggles (`:1070-1281`).
- **Flows.** Create/edit (name required; category/industry taken from first scope rule, fallback Healthcare / General Physician) (`:664-703`); duplicate "(Copy)" (`:709-719`); delete role and delete department **without confirmation**; system roles blocked "System roles cannot be deleted." (`:721-729`, `:866-872`). No uniqueness check, no export, **no audit**. States: empty handled; others not handled.
- **Business rules.** 19 modules in the matrix (`:71-92`); actions read / write / delete / import / export; levels All Records / Role / Own Records / Deny (`:1201-1204`). 8 seeded roles: "Super Administrator" (system) + 7 industry roles (`:222-353`). Seeds also carry an older 9-module Read/Add/Edit/Delete/Export/Import matrix that the UI ignores (`:166-220`). Stored in `ma_admin_roles_store_v2` (`:164`); departments in `ma_departments`, shared with client Settings (`lib/departmentStore.ts:11`).
- **KPIs.** "Roles (n)" = roles after filters (`:948`); "Departments (n)" = total (`:960`); Admin Scope = "N industries, M countries" from scope rules (`:377-437`); **Permitted Scope = hardcoded – formula undefined** ("Global (Full Access)" if system role else "Custom Matrix Assigned", `:773`); Assigned Roles = roles whose department matches (`:831`).
- **Cross-module.** The team-member drawer reads this store but checks only the legacy delete flag, which new or edited roles never set (`app/components/TeamMemberDrawer.tsx:222-232`). Task quick-create reads role names (`app/components/tasks/TaskQuickCreateDrawer.tsx:508-516`). No code applies these templates to organizations.

#### A1.4 Plans & Credits (`/admin/plans`)
- **Purpose.** The catalogue tenants buy: subscription plans, plan categories, seat and credit packs with base unit prices, and credits deducted per billable action. Header "Plans & Credits" (`AdminPlans.tsx:1482-1485`). Tab dropdown: Industry Plans · Plan Categories · Packed Pricing (Team Member / Credits) · Credit Actions (`:1492-1567`). No export on any tab.
- **User roles.** Sidebar module "plans" (`AdminSidebar.tsx:128`). No action checks. **No audit entries** for any change.
- **Industry Plans tab.** Table (20/page, customisable columns): Plan Name (+ "Popular"), Category, Tier, Admin Scope, Included Seats, Included Credits (/mo and /yr), Status (Staff Only / Active / Inactive) (`:968-1097`). Filters Tier (Free (Onboarding), Starter, Growth, Professional) and Scope (`:1584-1636`); a status filter exists in code but has no control (`:188,324-327`). Row menu Edit, Duplicate, Toggle Active, Delete (`:1102-1127`). 4-tab drawer (`:2098-2103`): *General & Quotas* (name*, tier*, plan category* filtered by scope, description, Admin Scope, Included Seats 1–500, Monthly Credits "Renewed every month", Yearly Credits, flags Active / Highlight as Popular / Internal-Staff Only) (`:2126-2313`); *Modules & Features* (module checkboxes with feature checkboxes, plan display feature list) (`:2318-2448`); *Templates* (provisioned processes, workflows, documents, web forms) (`:2453-2543`); *Country Pricing* (monthly and yearly price per country) (`:2547-2636`).
  - Flows: create with defaults (Starter, AI Receptionist, Global, 2 seats, 1000/12000 credits) (`:482-518`); name and at least one feature line required (`:566-575`); monthly credits auto-fills yearly = 12× (`:2255-2259`); module on pre-checks its features (`:632-649`); duplicate country rejected, last country cannot be removed, new country defaults 99 / 950 (`:697-718`); duplicate "(Copy)" (`:552-562`); toggle active no confirm (`:600-604`); delete with browser confirm and **no check for subscribed workspaces** (`:593-598`); "Delete All" (`:1620-1635`) — **undone on next load** because the store re-seeds an empty list and re-injects seed plans for any missing core category (`lib/plansBillingStore.ts:1379-1425`).
- **Plan Categories tab.** Columns Category Name (+ description), Admin Scope, Plans Using, Status (`:1130-1206`); drawer name*, description, scope, Active (`:3121-3230`). Delete blocked when plans use it ("Cannot delete category … used by N plan(s)"; fuzzy name match) (`:462-471`; `plansBillingStore.ts:147-157`). Inactive categories disappear from the plan drawer (`plansBillingStore.ts:1604`). Deleting all re-seeds the six defaults (`:1484-1488`).
- **Packed Pricing — Team Member.** Base rate "Cost Per Extra Team Member" ($/member/mo, default 20) saves on **every keystroke** with a toast each time (`:956-965,1713-1744`). Team packs as cards (+N members, badge, active pill, price/pack/mo, computed /member/mo, currencies) (`:1770-1868`); drawer pack name*, extra members*, base monthly cost (USD)*, badge, country-wise pricing, Active "Visible in client add seats drawer" (`:2851-3028`).
- **Packed Pricing — Credits.** Base rate "Price Per Custom Credit" (default 0.05) also saves per keystroke (`:1876-1907`). Credit packs as cards (credits, badge, Internal Only chip, price, computed /credit) (`:1933-2036`); drawer package name*, credits (min 100), base cost (USD)*, badge, country pricing, Active "Visible in client top-up modal" (`:2670-2848`); **no control for Internal/Staff Only** although the data has it (`plansBillingStore.ts:200`). Seeded India packs store INR under a "USD $" label (`plansBillingStore.ts:946-961`; `AdminPlans.tsx:2716`).
- **Credit Actions tab.** Columns Action Event, Linked Feature, Unit Basis, Credits Deducted (`:1417-1465`); only "Edit Rate" (no create/delete) (`:1467-1476`); modal Action Name, Credits Deducted (min 1), Unit Basis, Linked Feature Category (Calls / SMS / Email / Workflows / AI Scribe) (`:3031-3118`). Seven seeded actions (`plansBillingStore.ts:1196-1253`). Changes apply immediately; no effective date, no history.
- **Business rules.** Tier taxonomy conflicts: type allows Free/Starter/Growth/Scale/Professional/Custom (`plansBillingStore.ts:13`), UI offers Free/Starter/Growth/Professional (`AdminPlans.tsx:2147-2150`), seeds use Starter/Professional/Custom/Free (`plansBillingStore.ts:464-795`), Scale is renamed to Professional on read (`:1386-1393`). A tenant sees a plan when it is active, not staff-only and its scope matches the tenant's industry category, industry and location; price from the tenant's country row, else US, else first row (`plansBillingStore.ts:2014-2088`). Assigning a plan **copies** price, seats and credits into the workspace subscription (later plan edits do not flow) (`:2326-2379`). New workspaces get the first active Free plan or a built-in "Free Plan" with 1 seat / 500 credits (`:1682-1713`). Credits: total = plan + add-on; remaining = total − used, floored at 0 (`:2376-2377`); a deduction = action credits × units, rounded, minimum 1 (`:2279`).
- **KPIs (all computed).** Pack count badges (`AdminPlans.tsx:1537,1563`); Plans Using = plans whose category name matches (`:1174`); per-member price = pack price ÷ members (`:1772`); per-credit price = pack price ÷ credits (`:1935`); "N categories available" (`:286-288`); "x/y enabled" features (`:2357`); "Available in N currencies" (`:1841,2009`).
- **Cross-module.** Client Settings → Billing (Plans, Overview, Credit Usage tabs) reads plans, packs, base prices and credit actions and performs purchases (`app/components/billing/WorkspaceBillingPlansTab.tsx:138-141,233`; `WorkspaceBillingOverviewTab.tsx:91-93,213-252,460`; `WorkspaceBillingCreditUsageTab.tsx:50-51,158,444`). Public Pricing page (`app/pages/Pricing.tsx:119,124`; builder `plansBillingStore.ts:2762-2870`, INR and 20% yearly discount hardcoded). Signup, invite acceptance, payment, onboarding and organizations assign plans. **Module/feature toggles are never read by tenant code — no entitlement enforcement; no monthly credit reset; the only caller of credit deduction is the client usage simulator** (`WorkspaceBillingCreditUsageTab.tsx:158`).

#### A1.5 Industries (`/admin/industry-category`)
- **Purpose.** Master list of industry categories and the industries inside each, used for organization provisioning (`AdminIndustries.tsx:312-315`).
- **User roles.** Sidebar module "industries" (`AdminSidebar.tsx:119`). No action checks.
- **Screens.** Pill tabs "Industry Category (N)" (default from sidebar link) and "Industries (N)" (`:320-345`, `:44-55`); shared search; category filter on Industries tab (`:349-365`); "New Industry" / "New Category". Industries table: Industry Name, Industry Category, ID, Record Type (System/Custom), Status, Actions (`:418-528`). Category table: Category Name, Attached Industries (chips, "+N more", "+" to add an industry), ID, Status, Actions (`:542-677`). Drawers Create/Edit Industry (`:691-825`) and Create/Edit Industry Category (`:828-945`); delete confirmation modal (`:948-980`).
- **Flows.** Create industry: name* (toast "Industry name is required"), category*, description (blank → "No description provided."), Active; random ID 10–909; marked Custom; name added to the category's chip list (`:168-215`). Edit (rename does **not** update chip lists) (`:175-189`). Duplicate "(Copy)" (`:146-166`). Delete — Custom industries only, confirm "Delete Permanently" (`:507-524,954-976`); chip list not cleaned. Category create/edit: name* , description, Active "Enable category for new registrations" (`:218-285`); duplicate copies chip list (`:238-248`); delete allowed for any category, no cascade. No uniqueness checks; no code generation. States: empty handled (`:535,684`); others not handled.
- **Business rules.** 7 seeded categories, 51 seeded industries, all System/Active (`data/industryReferenceData.ts:85-261`). Link is by name text in both directions and can drift. **In-memory only** (`AdminIndustries.tsx:58-59`) — edits vanish on reload and never reach any other screen.
- **KPIs.** Tab counts = rows in each list (`:331,343`); "All Categories (N)" (`:356`); "+N more" = chips − 2 (`:568`). No tenant counts.
- **Cross-module.** Onboarding, client Settings organization forms, the organization drawer, form create drawer and every admin scope filter read the **fixed seed lists**, not admin edits (`app/pages/auth/QuickFormOnboardingScreen.tsx:497,572`; `app/pages/Settings.tsx:8206-8232`; `app/components/settings/OrganizationDetailDrawer.tsx:693-726`).

#### A1.6 Sections & Fields (`/admin`, `/admin/custom-fields`)
- **Purpose.** Define the CRM data model: Fields and Sections (groups of fields on record profiles) for 9 entity modules, scoped to tenant industries and countries, with tenant-level permissions. Sidebar "Sections/Fields" (`AdminSidebar.tsx:148`); page title "Sections & Fields" (`AdminCustomFields.tsx:381-382`).
- **User roles.** Sidebar module "customFields". No page or action checks.
- **Screens.** Toolbar: Fields | Sections toggle; Module dropdown (Contact, Call Logs, Processes, Appointments, Services, Invoices, Insurance & Claims, Organizations, Team Members; default Contact) (`:197-207,403-414`); Contact Category dropdown (Lead default, Client, custom, "+ Add Category") (`:418-441`); search; presets All / Required / Text; filter panel; Add Field / Add Section (`:386-518`). Fields table: Label, Key, Type, Process (Processes only), Required/Optional, Scope (`:522-649`); row actions Edit Field / View Details (Protected), Delete Field (hidden for system) (`:656-670`). Sections table: Section, Description, Process, Scope, Fields count; Edit / Delete (non-system) (`:689-761`). Field drawer (`components/AdminFieldDrawer.tsx:2397+`), Section drawer (`components/AdminSectionDrawer.tsx:629+`), Add Contact Category modal (`AdminCustomFields.tsx:810-877`), delete confirmation modal (`:882-914`).
- **Field flows.** Create: Module* (multi-select = shared across modules), Process/Appointment/Invoice/Claim Workflow (multi-select), Contact Category, Field Name*, Field Type* (15 types in 4 groups, `AdminFieldDrawer.tsx:145-181`), type-specific settings (formula for String/Number/Money, currency/min/max, date capture/format/min/max, media category/formats/size, list type Basic or Advance (multi-column), group sub-fields), Placeholder (auto-suggested if blank, `:2116`), Tool tip, Default Value, Field Settings (Required; per-process "Required at Stages"; Show always; User Visibility by team member; Admin Controls with Scope Rules and Permissions Hide/Edit/Add Options/Delete) (`:2440-6160`). Key is auto-generated from the name (lowercase, `_`, `a-z0-9_` only), not editable, locked after creation, **no uniqueness check** (`:1990-1996,2099`). Validation: name required (`:2021`); number min ≤ max and default within range (`:2022-2037`). **No success toast** on create/update. Edit: system (built-in) fields open editable but **changes are silently discarded** (`app/context/FieldRegistryContext.tsx:3239-3247,3152-3168`). Delete from table: confirm modal, key removed from every section, no toast (`AdminCustomFields.tsx:364-372`); delete from drawer: browser confirm + toast, shown even for system fields where it is a no-op (`AdminFieldDrawer.tsx:6204-6212`). "Required Fields" preset only types "required" into search (bug) (`AdminCustomFields.tsx:457`).
- **Section flows.** Create/edit: Module*, Contact Category, Process Workflow, Admin Control (Scope Rules; Permissions Hide/Edit/Add/Delete), Section Name*, Description, Fields in this section (picker limited to fields matching category & scope), drag to reorder fields, Global Rules (Show always, User Visibility) (`AdminSectionDrawer.tsx:641-1478`). System sections editable but changes not saved (`FieldRegistryContext.tsx:3422-3430`). No section reorder, no default-expanded, no duplicate, no status, no import/export.
- **States.** Empty handled (`AdminCustomFields.tsx:681,775`); loading, error, permission not handled.
- **Business rules.** Stored in `mantra_field_registry_v1` / `mantra_section_registry_v1` (`FieldRegistryContext.tsx:625-626`), synced across tabs. Visibility to a tenant: system fields always; process assignment enforced inside a process; any matching scope rule (OR); no rules = everyone; contact category filter (`:756-1006`). Tasks are not an entity.
- **KPIs (computed).** Scope "N industries, M countries" (`AdminCustomFields.tsx:119-155`); section "N fields" (`:729-736`); "N Processes" (`:157-195`); "Required at Stages (x of y)" (`AdminFieldDrawer.tsx:5801`).
- **Cross-module.** Client Settings → Sections/Fields tab reuses both drawers in tenant mode (`app/pages/Settings.tsx:3876,12837-12860`); client profile, clients list, process, appointment, invoice, claim, team member, organization and service drawers, Form Builder and variable pickers all read the registry (e.g. `app/components/profile/DraggableOverviewSections.tsx:365-377,1041,1699`; `app/pages/FormBuilder.tsx:2211-2235`).

#### A1.7 Document Templates (`/admin/document-templates`)
- **Purpose.** Standard document templates (Word upload or HTML with placeholders) with placeholder→CRM field mapping, record-type availability and tenant scope (`AdminDocumentTemplates.tsx:382-385`).
- **User roles.** Sidebar module "documentTemplates". No checks.
- **Screens.** Entity filter Client / Process / Appointment / Invoice with counts (default Client, no "All") (`:49,395-405`); Category, Industry, Location filters; search; "Add Document Template" (`:388-468`). Table: Name, Entity, Category, Scope, Fillable Fields (`:277-343`). Row actions Configure Scope & Entities, Edit Template, Duplicate, Delete (`:345-377`). Scope modal (`:498-539`). Shared drawer in admin mode (title always "Add Document Template", `app/components/profile/AddDocumentTemplateDrawer.tsx:829`): Template Name*, Admin Control, Assign Category* (with create-new), source Import Word Doc / Import WebForm / Use Template Builder, extracted placeholders table with mapped CRM field, HTML/Preview editor with "Select Fields" inserter, Advance Settings (Template Users, Auto-Numbering) (`:857-1760`).
- **Flows.** Create: name and content required (`AddDocumentTemplateDrawer.tsx:791-822`); default category Prescription. Word upload extracts HTML (keeps tables, headings, bold), shows "Extracting document content..." and inline errors (`:690-758,1071-1100`). Placeholders detected on every change and auto-mapped by name, default "Client Full Name" (`:641-685`). "Select Fields" appends placeholders to the end (`:550-566`). Duplicate "(Copy)" (`AdminDocumentTemplates.tsx:152-162`). Delete — **no confirmation**, and the 10 seed templates **reappear** on next load (`lib/documentTemplatesStore.ts:555-557`). Configure scope saves rules; allowed record types = union of rule entities (`AdminDocumentTemplates.tsx:169-189`). Template Users and Auto-Numbering **are not saved**; Permissions panel not wired. States: empty handled; loading/error only for upload; permission not handled.
- **Business rules.** Stored in **sessionStorage** `clientDocumentTemplates` / `clientTemplateCategories`, shared with tenants (`documentTemplatesStore.ts:552-617`). Categories Invoices, Prescription, Session Notes, Consent forms, Patient Intake form, General (`:32-39`). No record types = all four; no rules = global. Placeholder forms `{field}`, `{{field}}`, `«field»`, `[Field]`, no dots (`:622-653`). Word output is filled in-place preserving formatting (`lib/docxProcessor.ts:31-146`).
- **KPIs (computed).** Entity counts (`AdminDocumentTemplates.tsx:124-140`); Fillable Fields = placeholders found (`:339`); Scope summary (`:234-274`).
- **Cross-module.** Client document generation reads the same store but filters only by record type and category, **ignoring admin scope** (`app/components/profile/GenerateDocumentDrawer.tsx:862-888`); unfilled placeholders become blank (`:843-855`). Process automation step picker does apply scope (`app/components/process/StepParametersFields.tsx:5549-5610`).

#### A1.8 Sidebar Navigation Templates (`/admin/sidebar-config`)
- **Purpose.** Default **client** sidebar layouts (sections, item order, visibility, featured items, pinned workflows) scoped by industry category, industry and location (`AdminSidebarConfig.tsx:360-361`).
- **User roles.** Sidebar module "sidebarNavigation" (`AdminSidebar.tsx:149`). No checks.
- **Screens.** Search, Category/Industry/Location filters, "Add Sidebar Template" (`:368-427`); table Name, Scope, Sections, Pinned Workflows, Items (`:238-327`); actions Edit Layout & Items, Configure Scope Rules, Duplicate, Delete (disabled for baseline) (`:330-353`); scope modal (`:455-490`); drawer with Config Studio / Live Preview, name, Admin Scoping Rules, drag-and-drop sections and items (including across sections), visibility eye, featured toggle, add/rename/remove sections, add items and pinned workflows (`components/SidebarTemplateDrawer.tsx:857-1414`).
- **Flows.** Create/edit (name required; nav paths and pinned workflows unique within a template) (`SidebarTemplateDrawer.tsx:697-806`); duplicate; delete **without confirmation**, baseline blocked "Cannot delete the system fallback baseline template" (`AdminSidebarConfig.tsx:205-216`); quick scope edit. Active flag and default start page exist in data but have no control (`SidebarTemplateDrawer.tsx:390-398`). No audit. States: empty handled; others not handled.
- **Business rules.** Stored `mantra_admin_sidebar_templates` (`lib/sidebarTemplateStore.ts:37`); seed "Standard Organization Baseline" (`:39-107`). An organization gets the best-scoring active template: industry +30, category +20, location +20, unconstrained rule 0.1, baseline 0 (`:279-368`).
- **KPIs (computed).** Sections count, items (total / visible), pinned workflows, scope summary (`AdminSidebarConfig.tsx:72-112,268-322`).
- **Cross-module.** Client sidebar resolves the template live for the active organization and caches it per org (`app/context/SidebarMenuContext.tsx:147,331-386`); a user-customised layout on the same template is kept (`:153-155`). The **admin** sidebar is hardcoded and not configurable.

#### A1.9 AI Voices & Models (`/admin/ai-voices-models`)
- **Purpose.** Global on/off switch for which AI models and voices tenants can use (`AdminAIVoicesModels.tsx:338-341`).
- **User roles.** Sidebar module "aiVoicesModels". No checks.
- **Screens.** Mode switch "AI Models (active/total)" / "AI Voices (active/total)" (`:350-364`); model filters Provider, Status, search; voice filters Provider, Gender, Accent, Language, search; Reset (`:129-200,367-495`). Models as cards (logo, name, provider · context window, switch) (`:593-636`); voices as cards (play/stop preview, name – role, provider · language · accent · gender · tone, switch) (`:649-721`). No create/edit/delete.
- **Flows.** Toggle model / voice → saved immediately, toast "…activated — now available to client organizations" / "…deactivated — hidden…" (`:203-223`); no confirmation. Preview uses the **browser's speech synthesis**, not provider audio (`:241-272`). Bulk activate/deactivate logic exists but no button (`:226-238`). States: empty handled (`:588-591,644-647`); others not handled.
- **Business rules.** Models `mantra_ai_models_config` (`lib/aiModelsStore.ts:100-130`), voices `mantra_voice_table_data` (`lib/useVoiceStore.ts:43-100`). Two-level availability: admin offers, tenant enables (`aiModelsStore.ts:139-146`; `useVoiceStore.ts:109-116`). Fallbacks: no active model → first model is used (`aiModelsStore.ts:148-157`); no active voice → **all** voices returned (`useVoiceStore.ts:118-122`). 7 seeded models, 24 voices (OpenAI, ElevenLabs, Cartesia).
- **KPIs.** Active/total counts computed (`AdminAIVoicesModels.tsx:331-332`). Context window: hardcoded – formula undefined (`aiModelsStore.ts:26`). Latency: hardcoded – formula undefined, stored but never displayed (`aiModelsStore.ts:27`).
- **Cross-module.** Client Settings → AI Voices & Models shows only admin-active items (`app/pages/Settings.tsx:3687,3701-3702`); process call/chat setup pickers use the same stores (`app/components/process/CallTriggerDrawer.tsx:169-180`; `app/pages/Process.tsx:1219-1254`). **My AI Receptionist does not** — it has its own hardcoded voice and library (`app/pages/MyAIReceptionist.tsx:51-56,2811`).

#### A1.10 Product / Services Catalog (`/admin/services`) — no PRD
- **Purpose.** Master catalogue of services with CPT code, price, tax, duration, deposit and tenant scope (`AdminProductsServices.tsx:947-950`).
- **Screens & flows.** Search, Industry Category, Industry, Status filters, "Add Service" (`:953-1016`); table Product/Service (+CPT), Category, Duration, Price, Tax, Admin Scope — **no status column** despite status filter (`:811-884`); actions Edit, Duplicate, Delete (`:887-904`). Drawer: service name* (toast "Service Name is required."), CPT code, description, currency/price/tax/duration/slot duration, prepaid deposit (100% or fixed amount), Admin Control, "Publish as Active Template" (`:1032-1375`). Defaults General, 100 USD, 45 min (`:683-696`). Delete has **no confirmation**, system records deletable (`:804-808`). "Add Field" links only toast (`:1140,1331`); Permissions panel not wired (`:1343-1350`).
- **Rules.** Stored `ma_admin_services_store_v2`, 14 seeds re-added when empty (`:65,464-484`). Blank scope saves as Healthcare / General Physician (`:728-730`).
- **KPIs.** Admin Scope "N industries, M countries" computed (`:524-580`).
- **Cross-module.** **None.** Client services use a separate store `ma_services_store` (`lib/servicesStore.ts:6`); admin catalogue never reaches tenants despite "Active templates are provisioned across client workspaces" copy (`:1360-1363`).

#### A1.11 Workflows (`/admin/workflows`) — no PRD
- **Purpose.** Design the pipelines (stages, AI calling/chat behaviour, stage automations) tenants use. **Admin and client edit the same stored process list** — there is no template layer.
- **Screens.** Header "Workflows" + "Admin Workflow Architect", "Test Process", "How Workflow Works" (`AdminProcessTemplates.tsx:3174-3187`); search, Entity dropdown (Processes, Appointments, Invoices, Insurance, Claims, Tasks with counts), Category/Industry/Location filters, "Add Workflow" (hidden for Tasks) (`:3190-3274`); left panel process cards with draggable stage lists (`:3279-3463`); right panel process view (inline name/description, scope chip, Temporary Disable, stage ribbon In Progress / Won / Lost, Products & Services, Knowledge Base, Enable Calling, Enable Chatbot, Client Portal & AI Receptionist) (`:3466-4090`) and stage view (General / Automations tabs; Action: Client Reach Out To Us / Reach Out To The Client / No Action / Handle By Human; when to move; AI Prompt single/comprehensive) (`:4092-5340`).
- **Flows.** Add workflow (name and description required "Please fill all fields"; entity type; Admin Control; default stages generated; default AI "OpenAI - GPT-4o", voice "Ava") (`:2719-2779`). Inline edit (empty allowed) (`:3536-3546`). Scope rules (permissions checkboxes not connected after creation) (`:7195-7280`). **Delete workflow not available** (handler unused, `:2798-2806`). Add stage (name required; placement before Won/Lost) (`:2996-3094`); edit stage; delete stage from right panel with confirm and predefined-stage protection (`:3096-3124`), but **left-panel icon deletes immediately with no confirm** (`:3445-3453`). Drag reorder (`:2820`). Stage automations add/edit/toggle/delete (`:4199,5184-5187`). Preview and Test chat simulator. Temporary Disable is **not saved** (`:1369,3566-3573`). Seven modals are unreachable (e.g. `:5813,5904,5990,6119,6246,6540,6853`).
- **Rules.** Stored `process_store_processes` / `process_store_steps` (`lib/useProcessStore.ts:302-303`). **Claims processes are dropped on save** (entity list omits claim, `useProcessStore.ts:1562-1580`). Predefined stages by name per entity (`:869-920`). Orphaned "Process Template" store with status/version (`app/context/ProcessTemplateContext.tsx:67-83`) is loaded but unused.
- **KPIs.** Entity counts (`:981-1001`); automation badge per stage (`:4114`).
- **Cross-module.** Client Process page reads/writes the same store and filters by org scope (`app/pages/Process.tsx:1031-1046`; `useProcessStore.ts:251`); client hides a process when the admin "Hide" box is **unchecked** (`Process.tsx:1161`), opposite of the tooltip "Tenant users can choose to show or hide" (`AdminControlAccordion.tsx:160`). "Add Knowledge Base" opens the **client** KB (`:3925`).

#### A1.12 Automations (`/admin/automations`) — no PRD
- **Purpose.** Global trigger→action rules scoped by industry/location.
- **Screens & flows.** Header "Automations" + "Admin Global Rules"; search, filters, preset chips All / Active / Paused; "New Rule" (`AdminAutomations.tsx:409-511`). Table Rule Name, Trigger Event, Admin Scope, Status (clickable), Last Run (`:234-357`); actions Configure Scope Rules, View/Edit, Delete (`:359-390`). Create: name required ("Please enter a rule name to continue."), description, scope → shared flow builder; rules failing entity-target or loop checks rejected (`:220-231,668-690`; `lib/useAutomationStore.ts:290,348,419-465`). Toggle (no toast), delete (browser confirm), rescope.
- **Rules.** Stored `mantra_global_automation_rules_v1` (shared with client) (`useAutomationStore.ts:22`). Draft → Paused. Stage automations from Workflows also appear here. Seed rule filtered out on read, so list starts empty (`:236,371-397`).
- **KPIs.** All/Active/Paused counts computed (`AdminAutomations.tsx:480-500`); Last Run = stored timestamp, never set (shows "—").
- **Cross-module.** Client Automation shows matching admin rules and **lets tenants toggle/delete them with no permission check** (`app/pages/Automation.tsx:55-61,213,261`).

#### A1.13 Forms (`/admin/forms`) — no PRD
- **Purpose.** Form templates (built in the shared Form Builder) and Form Flows (ordered sequences of forms) with scope and role permissions.
- **Screens & flows.** Tabs "Forms (N)" / "Form Flows (N)" (`AdminFormTemplates.tsx:600-629`). Forms: search, Category/Industry/Location/Status filters, "New Form"; columns Template Name, Scope, Fields, Created/Updated (status not shown) (`:379-431`); actions Edit in Flow Builder (opens Form Builder), Scope & Permissions, Duplicate, Toggle Live/Draft, Delete (**no confirm**) (`:433-459,333-336`). Flows: columns Flow Name, Category, Status, Created; Configure Steps (reorder, required, add/remove), Preview, Duplicate, Toggle, Delete (confirm) (`:462-1060`). Create form: name required, saved as draft, builder opens (`app/components/forms/FormCreateDrawer.tsx:63-93`). Scope & Permissions modal: Allowed Roles (Admin, Manager, Reception, Staff/Provider, Client/Public) and Can View/Edit/Share/Delete (`:1192-1352`).
- **Rules.** Stored `webForms` and `intakeFlows` (`data/forms.ts:214-237`; `data/intakeFlows.ts:75-96`); statuses live/draft; deleting all forms brings seeds back (`forms.ts:221`).
- **KPIs.** Tab counts, header badge, Fields count, scope summary (computed) (`:339-414,595,613,628`).
- **Cross-module.** Client Web Forms and patient form screens read the same stores (`app/pages/WebForms.tsx:803-845`; `app/pages/patient/PatientFormsScreen.tsx:54`); **scope, roles and permissions are not applied client-side**.

#### A1.14 Knowledge Base Templates (`/admin/knowledge-base`) — no PRD
- **Purpose.** Master knowledge items (Text/FAQ, File, URL) for AI agents, tagged and scoped.
- **Screens & flows.** Search, Category/Industry/Type filters (no Location), "Add Knowledge Item" (`AdminKnowledgeBase.tsx:1051-1118`); table Name/Question, Type, Applicable Workflows, Admin Scope, Tags, Created (`:925-1002`); Edit, Duplicate, Delete (**no confirm**) (`:1005-1018,918-922`). Drawer: Name* (only validated field), Tags, Applicable Processes* (not validated), Type, content/file/URL, Admin Control, "Publish as Active Knowledge Template" (`:1137-1592`). Missing file saves placeholder "new_document.pdf, 1.0 MB" (`:880-881`).
- **Rules.** Stored `ma_admin_knowledge_store_v2` (`:248`); workflows list is a hardcoded set of 14 (`:76-240`), not the Workflows store. Active flag not shown or used.
- **KPIs.** Scope summary only (`:509-570`).
- **Cross-module.** **None** — client KB uses different keys (`app/pages/KnowledgeBase.tsx:1179-1200`); admin items never reach tenants or AI agents.

#### A1.15 Admin Tasks (`/admin/tasks`) — high level only
- Reuses the client Tasks page in admin mode: shows only tasks whose scope level is "admin", with admin columns and edit actions (`app/pages/Tasks.tsx:23,194-200,254`). Detailed analysis belongs to the Tasks module report.

### A2. Ops & analytics screens (no PRD)

#### A2.1 Workspace Billing & Subscriptions (`/admin/billing`, not in sidebar)
- **Purpose.** Cross-workspace view of each tenant's plan, price and credit balance; reassign plan or allocate credits.
- **Screens.** KPI cards Total Workspaces, Active Subscriptions, Total Available Credits, Estimated MRR (`AdminBilling.tsx:235-263`); search; hardcoded category filter and tier filter (Starter, Professional, Custom only) (`:279-301`); table Workspace/Client, Category & Scope, Assigned Plan, Billing & Price, Credits Balance (bar red < 20%, amber < 50%), Status, Actions Change Plan / + Credits (`:308-464`).
- **Flows.** *Change Plan* modal lists **all** plans incl. inactive/staff-only; cycle Monthly / Annual; carries over add-on/used credits and extra seats; toast `Assigned "X" (cycle) to Org ✓` (`:138-178,469-564`). It does not update the organization's assigned plan, so the tenant-side read **can silently revert it** (`lib/plansBillingStore.ts:1747-1754`). *+ Credits* modal allocates a pack (lists staff-only too); adds to total and remaining; the add-on counter is not incremented, so credits are lost on next plan change (`:184-203`; `plansBillingStore.ts:1939-1966`). No confirmation, no audit. Status column **always "Active"** (`:434-437`); orgs without a subscription show a fake "Global Starter $49, 380/500" row (`:322-338`). Empty state not handled.
- **KPIs.** Total Workspaces = count of organizations (`:97`); subtext "All connected" hardcoded – formula undefined (`:240`). Active Subscriptions = orgs with stored status Active (`:89`); "% coverage" = active ÷ total × 100 (`:248`). Total Available Credits = sum of remaining credits (`:90`). Estimated MRR = sum of subscription amounts with yearly ÷ 12 (`:91-100`), shown in "$" even when amounts are INR.
- **Cross-module.** Writes the same workspace subscription store as client Settings → Billing (`mantra_workspace_subscriptions_v2`).

#### A2.2 Orders (`/admin/billing/orders`)
- **Purpose.** Cross-tenant ledger of purchase orders with reconciliation (mark paid, refund, cancel) and export.
- **Screens.** KPI capsules Total Orders, Settled Amount, Pending Orders, Refunded (`AdminOrders.tsx:334-363`); search; filters Type, Payment Status, Order Status (`:373-419`); Export CSV (`:151-178`); table Order ID, Date, Org ID, Organization, Order Type, Items, Amount, Payment, Payment Method (`:181-296`); row menu View, Mark as Paid, Issue Refund (Paid only), Cancel Order (`:299-323`); detail drawer with line items, "Audit & Settlement Timeline", PDF receipt link (mock) (`:436-564`).
- **Flows.** Mark Paid (browser confirm; Paid + Completed; timeline; audit) (`:109`; `lib/ordersBillingStore.ts:473-513`). Issue Refund (reason required; full refund only; Refunded + Cancelled; audit) (`:120-123,567-613`; store `:515-555`). Cancel (reason required; payment status unchanged so a Paid order can be cancelled without refund; audit) (`:136-139`; store `:557-596`). No create/edit. Empty uses generic "No records found."
- **Rules.** Types New plan / Plan upgrade / Credits top-up / Team member package / Add-on; payment Paid/Pending/Failed/Refunded; order Completed/Processing/Cancelled (`ordersBillingStore.ts:15-17`). Stored `mantra_admin_orders`, six 2024 seeds (`:88,94-222`). **Tenant purchases never create orders here.**
- **KPIs (computed, ignore filters).** Total Orders = count (`:95`); Settled = sum where Paid (`:96-98`); Pending = count where Pending (`:99`); Refunded = sum where Refunded (`:100-102`). Currency always "$". Drawer status pill always green (`:458-463`).

#### A2.3 Subscriptions (`/admin/billing/subscriptions`)
- **Purpose.** Manage recurring subscriptions per org: change plan, bonus credits, extend trial, pause, cancel, export.
- **Screens.** KPI capsules Active Subscriptions, Renewal Rate, Trials Running, Past Due (`AdminSubscriptions.tsx:358-389`); search; Status and Cycle filters; Export CSV (`:180-207`); table Org ID, Organization, Current Plan, Cycle, Status, MRR, Credits Usage, Renewal/Trial End (`:210-306`); row menu Change Plan, Add Bonus Credits, Extend Free Trial (Trial only), Pause, Cancel (`:309-347`). No Resume.
- **Flows.** Change Plan uses a **hardcoded list of 3 plans** ($149 / $299 / $499), not the Plans catalogue (`:51-55,444-508`); forces Active; audit. Add Bonus Credits (whole number > 0) (`:139-142`). Extend trial (days > 0; 1–90 limit not enforced) (`:153-156`). Pause (browser confirm) and Cancel (browser confirm; immediate; audited as "deleted") (`:164-178`; store `:640-702`).
- **Rules.** Statuses Active/Trial/Past due/Paused/Cancelled; stored `mantra_admin_subscriptions` (5 seeds) (`ordersBillingStore.ts:19,89,225-307`) — **a separate dataset from the workspace subscriptions** used by `/admin/billing` and client Billing (different status spellings).
- **KPIs.** Active = count Active (`:95`); Trials = count Trial (`:99`); Past Due = count Past due (`:100`). **Renewal Rate = hardcoded – formula undefined** (synthetic: 96.4 − 1.6 × past-due − 2.2 × cancelled, clamped 88–99.5; `:104-107`). Total MRR computed but never shown (`:96-98`).

#### A2.4 Product Analytics Overview (`/admin/product-analytics/overview`)
- **Purpose.** Platform summary: organizations, agents, calls, automations, MRR, resolution; subsystem health; top workspaces.
- **Screens & flows.** Date range picker (changes nothing) (`AdminAnalyticsOverview.tsx:41,75-84`); six KPI cards (`:91-169`); "Platform Interaction Volume" bars (`:174-232`); "Telephony & AI Subsystems" (`:235-291`); "Top Active Healthcare Workspaces" table (first 4 seed rows, not sorted) (`:295-356`); links to Calls and Org Usage (`:284,306`); Export CSV (`:43-58`). Search box rendered but inert. No empty/loading/error/permission states.
- **KPIs.** Organizations 18, Active Agents 42, Calls Processed 34,890, Automations 128,450, Net MRR $12,840, Resolution 91.4% and all "+x%" deltas: **hardcoded – formula undefined** (`lib/productAnalyticsStore.ts:45-58`). Chart bars, peak throughput 4,680/hr, 99.98% success, latencies, "Operational" badges, table values: **hardcoded – formula undefined** (`:196-277,337-343`).

#### A2.5 Voice Calls Analytics (`/admin/product-analytics/calls`)
- **Purpose.** Cross-org call volume and outcomes, with drill-down by organization.
- **Screens.** Filters search, Organization (12, service's own list), date range (7d/30d/Quarter/Custom) with chip and Reset (`AdminAnalyticsCalls.tsx:282-375`); error banner with Retry (never triggered) (`:378-392`); KPI cards Completed, Incomplete, Failed, Avg Call Duration with tooltips (`:395-529`); "Calls by Organization" bar chart with sort and top-10 toggle (`:532-699`); "Call Distribution" donut (`:704-825`); "Inbound vs Outbound Over Time" area chart (`:828-947`); "Organization Telemetry Breakdown" table (`:951-983`); two export buttons (`:277,286`).
- **Flows.** Filter by org via dropdown, bar click or row click (toast "Filtered telemetry to {org}") (`:107-117,613-619,974-977`); search; date range rescales baseline; Custom range dates are **ignored** (flat ×0.5) (`lib/callsAnalyticsService.ts:344-345`); Reset; Export CSV (`callsAnalyticsService.ts:603-654`). Empty handled for bar chart and table; loading/error coded but never triggered; permission not handled.
- **KPIs (computed from a fixed mock baseline).** Completed / Incomplete / Failed = sums across filtered orgs; "% of total" = count ÷ total × 100 (`callsAnalyticsService.ts:439-455`). Avg Call Duration = call-weighted average across **all** calls (`:331-335,442,452`) — tooltip/footer say successful calls only. Donut total = sum of totals; segment share = count ÷ total (`:458-501`). Time series = synthetic spread with weekday weights (`:531-600`). Completion Rate per row = stored baseline (30d) or completed ÷ total (`:379`). Date scaling factors 0.233 / 1 / 3.0 / 0.5 (`:338-350`). **Trend badges +4.8%, −1.6%, −0.9%, +8.2%: hardcoded – formula undefined** (`:512-521`).
- **Cross-module.** None; client Call Logs use a different store (`app/pages/CallLogs.tsx:24`; `lib/processLogsStore.ts:76-110`). Org names/codes differ from other screens.

#### A2.6 Organization Usage Matrix (`/admin/product-analytics/organization-usage`)
- **Screens & flows.** Search (org, ID, industry, plan), Status filter (Active / Trial / Past due), Export (`AdminAnalyticsOrgUsage.tsx:226-249,65-94`); table Org ID, Organization, Industry, Plan Tier, Users, Numbers, Calls (30d), Storage, Tasks/Mo, AI Accuracy, Status (`:97-213`); detail drawer with tiles and storage "N MB / 10,000 MB" (`:269-340`). Empty generic; others not handled.
- **KPIs.** All per-row values **hardcoded – formula undefined** (`lib/productAnalyticsStore.ts:228-304`); storage quota 10,000 MB hardcoded (`:328`); storage display MB→GB conversion computed (`:163`).

#### A2.7 Process Movement Analytics (`/admin/product-analytics/process-movement`)
- **Screens & flows.** Organization and date filters (change nothing) (`AdminAnalyticsProcessMovement.tsx:37-38,76-98`); KPI cards (`:106-150`); five-stage funnel with bottleneck badges (`:153-218`); three bottleneck cards with the same fixed recommendation (`:221-258`); Export (`:40-59`).
- **KPIs.** Active Workflows 14, In-Flight Tasks 1,420, Overall Completion 83.6%, stage Entered/Completed/% Conv., dwell, wait, stuck: **hardcoded – formula undefined** (`productAnalyticsStore.ts:139-209`). Identified Bottlenecks = count of bottleneck list entries (computed, `:146`). Funnel bar width = entered ÷ fixed 2,500 (`:167-168`).

#### A2.8 Revenue & Invoices Analytics (`/admin/product-analytics/revenue-invoices`)
- **Screens & flows.** Date range (changes nothing) (`AdminAnalyticsRevenueInvoices.tsx:38,84-87`); KPI cards Net Monthly MRR, Settled Invoiced (30d), Open Invoices, Overdue Balance (`:95-143`); Revenue by Subscription Tier bars (`:148-176`); Monthly MRR Growth bars (`:179-211`); Recent Invoices table (no paging, no actions) (`:215-281`); Export (`:40-63`).
- **KPIs.** MRR $12,840, Projected ARR, Settled $13,401, Collection rate 94.3%, Open $660, Overdue $149, "1 organization past due", tier MRR/% and "+41.1% 6-Mo Gain": **hardcoded – formula undefined** (`productAnalyticsStore.ts:320-343`). MRR bar height = month value ÷ fixed 14,000 (computed scale). Invoice table reads `mantra_admin_invoices` (6 seeds) (`lib/ordersBillingStore.ts:90,310-397`) and does not match the cards.

#### A2.9 Telephony (`/admin/integrations/telephony`)
- **Purpose.** (a) Carrier providers (Twilio, Exotel, Plivo, Telnyx) with LiveKit and Dograh SIP credentials and subscription due dates; (b) platform phone-number inventory and assignment to organizations.
- **User roles.** Sidebar shows if role can view telephonyProviders or telephonyNumbers (`AdminSidebar.tsx:178-182`). SupportSpecialist is read-only on providers in the matrix (`adminRolesStore.ts:130`) but nothing enforces it.
- **Screens.** Dropdown tab Providers / Numbers synced to `?tab=` (`AdminTelephony.tsx:82-88,492-500`); search; "Add Provider" / "Add Number"; Export (Numbers only) (`:469-487`); Numbers filters Provider, Organization (incl. Unassigned Only), Country (`:505-558`). Providers: cards with "N number(s) in use", due-date pill, LiveKit and Dograh username/secret with reveal and copy (`:566-758`). Numbers: table Number, Country, Provider, Org ID, Organization, Target Countries; actions Assign Organization, Edit Target Countries, Release Number (`:763-778,434-456`). Drawers Configure provider (**unreachable**, `:784-901`; opener `:135-143` never called), Add Telephony Provider (`:906-1023`), Add Phone Number (`:1137-1254`); modals Assign Organization, Edit Target Countries (11 countries).
- **Flows.** Reveal secret → audit entry "Revealed plaintext SIP secret…" (action logged as "login") + toast (`:118-126`; `lib/telephonyAdminStore.ts:1010-1025`). Copy to clipboard. Add provider (all required; no duplicate-carrier check; saved as Connected) (`telephonyAdminStore.ts:931-976`). Assign number (org required; status In Use; org code always saved as "ORG-0001"; history + audit) (`:268-285`). Edit target countries (empty allowed). Release (browser confirm; status Released, hidden; history "Suspended"; audit "deleted") (`:296-302`). Add number (non-blank only; no E.164 or duplicate check; Unassigned, $15/mo) (`:306-321`). Export (double-quoted cells defect) (`:328-349`). No unassign, delete provider or test connection. Org filter cannot match seeded numbers (id mismatch). Empty handled for Numbers only.
- **Rules.** Stored `mantra_admin_phone_numbers`, `mantra_admin_telephony_providers` (`telephonyAdminStore.ts:97-100`). Due-date rule: days left < 0 → red overdue; ≤ 7 → amber; else grey (`AdminTelephony.tsx:174-199`).
- **KPIs.** "N numbers in use" per provider: **hardcoded – formula undefined** (stored count never recalculated, `telephonyAdminStore.ts:453`). Due-date pill computed.
- **Cross-module.** Feeds Admin Audit Logs. Client Settings → Integrations → Telephony and its phone numbers are local hardcoded data (`app/components/telephony/TelephonyIntegrationPanel.tsx:25-47`; `app/pages/Settings.tsx:1803-1830`) — **admin-assigned numbers never reach tenants**. The cross-org call log (`AdminCallLogs.tsx`) is unreachable; `/admin/telephony/calls` lands on Providers.

#### A2.10 Audit Logs (`/admin/settings/logs`)
- **Purpose.** Read-only log of admin changes with before/after view.
- **Screens & flows.** Search (actor, entity, summary, IP), filters Module, Action (8 of 12 types), Actor, time range (Today = last 24h) (`AdminAuditLogs.tsx:286-357,105`); Export (`:128-170`); table Timestamp, Actor, Action, Module, Target Entity, Summary, IP (`:174-278`); detail drawer with diff and "Navigate to {module}" (`:391-542`). No edit/delete. Empty handled; others not.
- **Rules.** Stored `mantra_admin_audit_logs` (8 seeds) (`lib/auditLogsStore.ts:57-262`). IP hardcoded "192.168.1.145" when not supplied (`:321`). On every read, **"suspended" entries are rewritten as "deleted"** (`:276-284`), contradicting the "Immutable" subtitle. Written by: admin users, admin roles, telephony, orders/subscriptions. Not written by: organizations, tenant role templates, sidebar templates, plans, sign-ins.
- **KPIs.** None (export count only).
- **Cross-module.** **Client Settings → Audit Logs renders this same platform log** (`app/pages/Settings.tsx:23,7763-7764`) — tenants see other organizations' admin activity.

---

## B. Product map — per PRD
All admin PRD files share one template: frontmatter; `## 1. Module Summary`; `## 2. Feature Requests` → `### F-n` with `#### 1. What it does`, `#### 2. What it includes` (Item | Type | What it does | Notes), `#### 3. Worked example`, `#### 4. Jobs to be done`, `#### 5. Acceptance criteria`; `## 3. Comprehensive Summary` (3.1 Feature Request Summary, 3.2 Jobs to be Done). Only `custom-fields/fields.md` and `tasks.md` have a `## Cross-product Summary`. No file describes role/permission gating beyond the word "Superadmin", empty/loading/error states, delete confirmations, or persistence.

| PRD file | Purpose (per PRD) | Screens / items | Flows & rules stated | Metrics stated | Cross-refs stated |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `admin/organizations.md` | Multi-tenant clinic provisioning, storage quotas, blueprint assignment, subscription status (§1) | F-1.1 Tenants table (Org Name, Slug, Blueprint, Subscription, Users Count, Created Date, Status; searchable); F-1.2 Provision Organization **modal** (Practice Name, Custom Slug, Owner Email, Blueprint, Plan Tier); F-1.3 Tenant impersonation (read-only support login, audited) (§2 F-1 "What it includes") | Status filters Active / Trial / Suspended (§ What it does); custom URL `slug.mantraassist.com` (§ Worked example); provisioning creates isolated DB records and **sends owner activation email** (§ Acceptance criteria F-1-1) | Storage usage (§ What it does) | — |
| `admin/users.md` | Superadmin accounts, enterprise SSO, session revocation (§1) | F-1.1 table (Name, Email, Admin Level, MFA Enrolled, Last Login, Active Sessions); F-1.2 SSO card (SAML metadata URL, Entity ID, X.509; Okta/Azure/Google); F-1.3 Revoke All Sessions (§ What it includes) | Revoke invalidates all tokens immediately, forces password reset, resets MFA (§ Worked example; AC F-1-1) | — | — |
| `admin/roles.md` | System-wide RBAC matrix for Doctors, Nurses, Coordinators, Billing (§1) | F-1.1 matrix 18 modules × 6 roles, Read/Add/Edit/Delete/Export/Import toggles; F-1.2 Custom Role Creator (clone + overrides, assign to tenant users); F-1.3 PHI Export gate with MFA re-auth | Users lacking a permission have buttons hidden **and API blocked** (AC F-1-1); toggling Delete for Receptionist hides delete on patient charts (§ Worked example) | — | — |
| `admin/plans/plans.md` | "Industry Plans" tab: tiers Starter / Growth / Enterprise, monthly/annual pricing, seats, credits, feature gates (§1) | F-1.1 Plans table (Plan Name, Category, Monthly Price, Annual Price, Seat Quota, Active Tenants; edit drawer); F-1.2 Feature gate toggles (AI Scribe, Telephony, Multi-Location; API-enforced); F-1.3 Monthly credit allowance (replenished on 1st of month) | Storage limits (§ What it does); disabled features inaccessible with upgrade prompt (AC F-1-1); Growth tenants gain Scribe next session (§ Worked example) | — | Implicit: tenant workspaces |
| `admin/plans/pricing.md` | "Packed Pricing" tab: credit top-ups, seat packs, country telephony/SMS rate cards for 50+ countries (§1) | F-1.1 Credit bundles table (Bundle Name, Credits, Retail Price, Unit Discount %); F-1.2 Seat pack rate ($/seat/mo); F-2.1 Country rates table (Country, ISO, Inbound $/min, Outbound $/min, SMS $/segment); F-2.2 Rate card bulk markup editor | Purchase charges price and credits wallet immediately (AC F-1-1); Stripe checkout (§ Worked example F-1); per-second billing by destination rate (AC F-2-1) | Unit discount %, net margin | Tenant wallet / Stripe |
| `admin/plans/categories.md` | Plan categories as display groups (Practice Tiers, Enterprise Blueprints, Add-On Bundles) (§1) | F-1.1 Categories table (title, badge label, sort order, linked plans); F-1.2 Promotional badge dropdown (Popular, New, Enterprise Exclusive) | Badges show on tenant upgrade screens and signup flows (AC F-1-1); pricing page ribbon (§ Worked example) | — | Public pricing / signup / checkout |
| `admin/plans/actions.md` | Credit deduction rates per unit (§1) | F-1.1 Credit actions table (Action Key, Action Name, Consumption Unit, Credits Deducted, Description); F-1.2 Edit modal with **effective start date**, audited | Actions AI Scribe, WhatsApp Conversation, SMS, Phone Call Minute, LLM Token (§ What it does); activities deduct at active rates (AC F-1-1) | — | Practice wallet |
| `admin/industry-category/industries.md` | Vertical blueprints pre-configuring fields, forms, processes, terminology (§1) | F-1.1 Blueprints **card grid** with active tenant counts; F-1.2 Terminology overrides; F-1.3 Module preset bundler | Tenants inherit fields and terminology (AC F-1-1) | Active tenant counts | Client UI terminology |
| `admin/industry-category/categories.md` | Top-level classifications grouping blueprints (§1) | F-1.1 Categories table (Category Name, Code, Description, Sub-Industries Count, Active Status; searchable); F-1.2 Add Category **modal** generating taxonomy code | New category immediately groups new blueprints (AC F-1-1) | Sub-industries count; tenant count per category | — |
| `admin/custom-fields/fields.md` | Platform data dictionary with types and validation formulas propagating to tenants (§1) | F-1.1 Fields table (Field Label, Key, Entity, Type, Validation, Required, Status); F-1.2 Add Field drawer (Name, Key, Entity, Data Type, Placeholder; alphanumeric key validation); F-1.3 Types Text, Number, Single-Select, Multi-Select, Date, Currency, Boolean | Entities Client, Appointment, Process, Task (§ What it does); validation enforced across tenants (AC F-1-1) | — | § Cross-product Summary: fields appear in Client Settings > Custom Fields |
| `admin/custom-fields/sections.md` | Accordion sections with role-based visibility (§1) | F-1.1 Section reordering tree (drag, persisted); F-1.2 Add Section **modal** (Title, Entity, Default Expanded); F-1.3 Role-based section gate | Reordering updates order on client entity drawers (AC F-1-1); insurance read-only for clinicians (§ Worked example) | — | Client entity drawers |
| `admin/document-templates.md` | Master clinical documents with merge tags (§1) | F-1.1 Table (Title, Category Consent/Referral/Discharge, Version, Variables Count, Status); F-1.2 Rich-text editor (toolbar, tag inserter, PDF preview); F-1.3 Auto-populator (validates unpopulated tags) | Tags like `{{patient.name}}`; generating replaces all tags (AC F-1-1) | Variables count | Doctors in any tenant generate letters |
| `admin/sidebar-config.md` | Default navigation for **all client and admin** workspaces (§1) | F-1.1 Navigation tree canvas (drag, layout JSON); F-1.2 Module visibility switches globally or **per plan tier**; F-1.3 Role access menu filter | Changes apply on **next session** (AC F-1-1); hide AI Scribe for Starter tier (§ Worked example) | — | Client and admin sidebars |
| `admin/ai-voices-models.md` | LLM endpoint registry, token consumption, ElevenLabs voice library (§1) | F-1.1 Model endpoints table (Provider, Model ID, Status, Avg Latency, Fallback Order, Error Rate); F-1.2 Automated failover router; F-1.3 Global token usage meter | API keys, base URLs, rate limits (§ What it does); failover within 2 s (AC F-1-1) | Avg latency, error rate, tokens today | Clinic bots |
| `admin/tasks.md` | Corporate tasks console at `/admin/tasks` (analysed by the Tasks agent) | Admin-only task table | Scope isolation from client boards | — | Client My Tasks, Companion, Admin Organizations/Roles |
| _(no file)_ | Workspace Billing, Orders, Subscriptions, all Product Analytics pages, Telephony, Audit Logs, Workflows, Automations, Forms, Knowledge Base, Product/Services | — | — | — | Client-side PRDs exist for neighbours (`client/settings/billing.md`, `audit-logs.md`, `integrations.md`, `client/workflows.md`, `automation.md`, `web-forms.md`, `knowledge-base.md`, `services.md`) but none references an admin source |

Client cross-check notes: `client/settings/custom-fields.md` does not mention the admin dictionary (the link is one-way, from `admin/custom-fields/fields.md § Cross-product Summary`). `client/settings/billing.md § 1` describes top-ups and invoices but not admin plans. `client/settings/voices.md § F-1` covers model choice and temperature with no mention of admin activation. `client/settings/team.md § F-1.1` lists fixed roles (Admin, Doctor, Nurse, Coordinator, Billing), not admin role templates. `client/settings/audit-logs.md § 1` describes a tenant ledger, while the build shows the platform admin log.

---

## C. Findings
Status values: **Matches** / **Partial** (PRD less detailed or only partly right) / **Missing in PRD** (built and working as intended, not in the PRD) / **Contradicts** (PRD stale or says the opposite) / **PRD-only** (not built) / **Prototype defect** (bug, unwired handler, data not saved, inconsistent data between screens, placeholder data shown as real, or a destructive action with no confirmation; details in section E). `[SECURITY]` marks access-control, permission, data-exposure, tenant-isolation, auth or audit-integrity items. Prototype refs are `route — file:line`, relative to `src/`.

### C.1 Organizations
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-ORG-01 | Rule | Directory columns | Contradicts | organizations.md § F-1.1 | /admin/organizations — app/pages/Organizations.tsx:963-1115 | Built: Org ID, Name, Email, Industry (specialty), AI Provider, Created, Status. No Slug, Subscription or Users Count. |
| G13-ORG-02 | Flow | Search directory | Partial | organizations.md § F-1.1 "Searchable" | Organizations.tsx:944-956,1154 | Name, email, Org ID. |
| G13-ORG-03 | Flow | Status filter Active / Trial / Suspended | Contradicts | organizations.md § F-1 "What it does" | Organizations.tsx:1166-1174 | Only an AI Provider filter; no "Trial" status. |
| G13-ORG-04 | Rule | Status lifecycle Invite sent → Onboarding → Active; Suspended | Missing in PRD | — | Organizations.tsx:105,873; auth/InviteAcceptance.tsx:285,340 | |
| G13-ORG-05 | Flow | Provision organization | Partial | organizations.md § F-1.2 | Organizations.tsx:1341-1344,752-926 | 4-step drawer, much richer than the PRD modal. |
| G13-ORG-06 | Rule | Custom slug / tenant URL | PRD-only | organizations.md § F-1.2, § Worked example | — | |
| G13-ORG-07 | Flow | Owner activation email | Partial | organizations.md § AC F-1-1 | Organizations.tsx:897-926 | Invite token + "Copy Link"; no email (mock). |
| G13-ORG-08 | Flow | [SECURITY] Tenant impersonation / support login (audited) | PRD-only | organizations.md § F-1.3 | — | |
| G13-ORG-09 | Metric | Storage usage per tenant | PRD-only | organizations.md § F-1 "What it does" | — | |
| G13-ORG-10 | Flow | Assign / Upgrade / Remove plan | Missing in PRD | — | Organizations.tsx:500-518,555-572,626-652 | |
| G13-ORG-11 | Flow | [SECURITY] Suspend / Reactivate, enforced at sign-in | Missing in PRD | — | Organizations.tsx:573-584; auth/Login.tsx:82-85 | |
| G13-ORG-12 | Flow | Delete organization with confirmation | Missing in PRD | — | Organizations.tsx:585-589,2371-2373 | No cascade rules defined. |
| G13-ORG-13 | Flow | Export CSV | Missing in PRD | — | Organizations.tsx:1117-1138 | |
| G13-ORG-14 | Rule | Org ID can repeat; no uniqueness on email/name | Prototype defect | — | Organizations.tsx:837-838 | see G13-E-01 |
| G13-ORG-15 | Rule | Organization email and Org ID must be unique (intended) | Missing in PRD | — | Organizations.tsx:264-287 | Only cleaned up on next load today. |
| G13-ORG-16 | X-ref | [SECURITY] Tenants can open the full Organizations page at `/organizations` | Prototype defect | — | app/routes.tsx:245 | see G13-E-02 |
| G13-ORG-17 | Rule | [SECURITY] Organizations is a platform-staff-only screen (intended) | Missing in PRD | — | AdminSidebar.tsx:117 | |
| G13-ORG-18 | Rule | [SECURITY] Organization actions write no audit entries | Missing in PRD | — | Organizations.tsx (no audit call) | Audit scope undefined (G13-Q-16). |
| G13-ORG-19 | X-ref | Plan assignment writes the workspace subscription used by client Billing, sign-in and client sidebar | Missing in PRD | — | lib/plansBillingStore.ts:2326-2417; app/context/SidebarMenuContext.tsx:370 | |

### C.2 User Management
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-USR-01 | Rule | User table columns | Partial | users.md § F-1.1 | /admin/settings/users — app/pages/admin/AdminUserManagement.tsx:421-515 | Role ≈ Admin Level. |
| G13-USR-02 | Metric | [SECURITY] MFA Enrolled column | PRD-only | users.md § F-1.1 | — | |
| G13-USR-03 | Metric | [SECURITY] Active Sessions column | PRD-only | users.md § F-1.1 | — | |
| G13-USR-04 | Flow | [SECURITY] Enterprise SSO (SAML / OIDC) | PRD-only | users.md § F-1.2 | — | |
| G13-USR-05 | Flow | [SECURITY] Revoke All Sessions | PRD-only | users.md § F-1.3, AC F-1-1 | components/settings/SecurityTab.tsx:99-101 (unrouted page only) | |
| G13-USR-06 | Flow | Invite user (name, email, role) | Missing in PRD | — | AdminUserManagement.tsx:201-266,855-927 | |
| G13-USR-07 | Flow | Change role | Missing in PRD | — | AdminUserManagement.tsx:269-294 | |
| G13-USR-08 | Rule | [SECURITY] SystemAdmin users can have their role changed; no last-SystemAdmin guard | Prototype defect | — | AdminUserManagement.tsx:517-525 | see G13-E-03 |
| G13-USR-09 | Flow | Suspend / Reactivate access | Missing in PRD | — | AdminUserManagement.tsx:297-326 | |
| G13-USR-10 | Flow | Suspend has no confirmation | Prototype defect | — | AdminUserManagement.tsx:297-326 | see G13-E-04 |
| G13-USR-11 | Flow | Reset password / Resend invite | Missing in PRD | — | AdminUserManagement.tsx:328-366 | |
| G13-USR-12 | Flow | Remove admin (confirm; SystemAdmin protected) | Missing in PRD | — | AdminUserManagement.tsx:368-390,540,552 | |
| G13-USR-13 | Flow | Admin-portal roles tab (21 modules; locked SystemAdmin; system roles protected) | Missing in PRD | — | AdminUserManagement.tsx:584-641; lib/adminRolesStore.ts:40-161 | |
| G13-USR-14 | Rule | Statuses Active / Invited / Suspended | Missing in PRD | — | AdminUserManagement.tsx:68 | |
| G13-USR-15 | Rule | [SECURITY] Every user and role action writes an audit entry | Missing in PRD | — | AdminUserManagement.tsx:248-390; adminRolesStore.ts:233-336 | Entries are distorted: see G13-E-94, G13-E-95. |
| G13-USR-16 | Flow | Export users and roles CSV | Missing in PRD | — | AdminUserManagement.tsx:392-418 | |
| G13-USR-17 | Rule | [SECURITY] Signed-in role read from browser storage, defaults to SystemAdmin; admin users not linked to sign-in | Prototype defect | — | app/context/AuthContext.tsx:28,43 | see G13-E-05 |
| G13-USR-18 | Rule | No duplicate-email or role-name checks | Prototype defect | — | AdminUserManagement.tsx:230-240,605-607 | see G13-E-06 |
| G13-USR-19 | Flow | Deleting a role leaves its users on a deleted role | Prototype defect | — | AdminUserManagement.tsx:637-641 | see G13-E-07 |
| G13-USR-20 | Metric | Users per role | Missing in PRD | — | AdminUserManagement.tsx:684 | Count of users whose role name matches. |

### C.3 Roles & Permissions (tenant role templates)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-ROLE-01 | Rule | [SECURITY] Matrix size 18 modules × 6 roles | Contradicts | roles.md § F-1 "What it does" | /admin/roles — app/pages/admin/AdminRolesPermissions.tsx:71-92,222-353 | 19 modules × 8 seeded roles. |
| G13-ROLE-02 | Rule | [SECURITY] Actions Read/Add/Edit/Delete/Export/Import | Contradicts | roles.md § F-1.1 | components/settings/PermissionSelect.tsx:26-31 | Read/Write/Delete/Import/Export. |
| G13-ROLE-03 | Rule | Scope level per module (All Records / Role / Own Records / Deny) | Missing in PRD | — | AdminRolesPermissions.tsx:1201-1204 | |
| G13-ROLE-04 | Rule | Scope option labelled "Role" stores department scope | Prototype defect | — | AdminRolesPermissions.tsx:1201-1204; lib/adminRolesStore.ts:16 | see G13-E-08 |
| G13-ROLE-05 | Rule | Per-workflow permission rows with "inherit" | Missing in PRD | — | AdminRolesPermissions.tsx:1157-1275 | |
| G13-ROLE-06 | Flow | Custom role by cloning | Partial | roles.md § F-1.2 | AdminRolesPermissions.tsx:709-719 | Duplicate only. |
| G13-ROLE-07 | Rule | [SECURITY] PHI export gate with MFA re-auth | PRD-only | roles.md § F-1.3 | — | |
| G13-ROLE-08 | Rule | [SECURITY] Missing permission hides buttons and blocks API | PRD-only | roles.md § AC F-1-1 | lib/permissions.ts (not imported) | |
| G13-ROLE-09 | Rule | Templates scoped by industry category / industry / location | Missing in PRD | — | AdminRolesPermissions.tsx:1135-1142 | |
| G13-ROLE-10 | Flow | Departments tab | Missing in PRD | — | AdminRolesPermissions.tsx:793-882; lib/departmentStore.ts:11 | |
| G13-ROLE-11 | Flow | Delete role / department; system roles protected | Missing in PRD | — | AdminRolesPermissions.tsx:721-729 | |
| G13-ROLE-12 | Flow | Role / department delete has no confirmation | Prototype defect | — | AdminRolesPermissions.tsx:721-729,866-872 | see G13-E-09 |
| G13-ROLE-13 | Rule | No role-name uniqueness | Prototype defect | — | AdminRolesPermissions.tsx:664-703 | see G13-E-06 |
| G13-ROLE-14 | Rule | [SECURITY] Template changes write no audit entries | Missing in PRD | — | AdminRolesPermissions.tsx (no audit call) | |
| G13-ROLE-15 | Metric | "Permitted Scope" shows a fixed label, not derived from the matrix | Prototype defect | — | AdminRolesPermissions.tsx:773 | see G13-E-10 |
| G13-ROLE-16 | X-ref | [SECURITY] Team-member drawer checks a legacy permission flag new roles never set | Prototype defect | — | components/TeamMemberDrawer.tsx:222-232 | see G13-E-11 |
| G13-ROLE-17 | X-ref | Task quick-create reads role names and categories | Missing in PRD | — | components/tasks/TaskQuickCreateDrawer.tsx:508-516 | |

### C.4 Plans & Credits — Industry Plans
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-PLAN-01 | Rule | Plans table columns | Contradicts | plans/plans.md § F-1.1 | /admin/plans — app/pages/admin/AdminPlans.tsx:968-1097 | No prices, no Active Tenants. |
| G13-PLAN-02 | Flow | Edit drawer | Partial | plans/plans.md § F-1.1 | AdminPlans.tsx:2073-2667 | 4 tabs. |
| G13-PLAN-03 | Rule | Feature-gate toggles | Partial | plans/plans.md § F-1.2 | AdminPlans.tsx:2318-2386 | No Multi-Location; not enforced. |
| G13-PLAN-04 | Rule | Disabled features inaccessible with upgrade prompt | PRD-only | plans/plans.md § AC F-1-1 | components/billing/WorkspaceBillingOverviewTab.tsx:460 | |
| G13-PLAN-05 | Rule | Monthly credit allowance | Partial | plans/plans.md § F-1.3 | AdminPlans.tsx:2249-2281 | Monthly + Yearly. |
| G13-PLAN-06 | Rule | Credits replenished monthly | PRD-only | plans/plans.md § F-1.3 | lib/plansBillingStore.ts:2378 | |
| G13-PLAN-07 | Rule | Tiers Starter / Growth / Enterprise | Contradicts | plans/plans.md § 1 | AdminPlans.tsx:2147-2150; lib/planRecommendation.ts:10 | |
| G13-PLAN-08 | Rule | "Custom" tier in data cannot be selected; "Scale" silently renamed | Prototype defect | — | plansBillingStore.ts:13,1386-1393 | see G13-E-12 |
| G13-PLAN-09 | Rule | Country pricing matrix per plan | Missing in PRD | — | AdminPlans.tsx:2547-2636,697-718 | |
| G13-PLAN-10 | Rule | Admin Scope decides which tenants see a plan | Missing in PRD | — | plansBillingStore.ts:2014-2088 | |
| G13-PLAN-11 | Rule | Flags Active / Popular / Internal-Staff Only | Missing in PRD | — | AdminPlans.tsx:2284-2313 | |
| G13-PLAN-12 | Flow | Provisioned templates per plan | Missing in PRD | — | AdminPlans.tsx:2453-2543 | |
| G13-PLAN-13 | Flow | Templates tab industry filter hardcoded to four industries | Prototype defect | — | AdminPlans.tsx:2453-2543 | see G13-E-13 |
| G13-PLAN-14 | Flow | Duplicate / toggle active / delete plan | Missing in PRD | — | AdminPlans.tsx:552-604 | |
| G13-PLAN-15 | Flow | Deletes and "Delete All" undone by re-seeding; no subscribed-tenant check | Prototype defect | — | AdminPlans.tsx:593-598,1620-1635; plansBillingStore.ts:1379-1425 | see G13-E-14 |
| G13-PLAN-16 | Flow | Status filter exists in logic but has no control | Prototype defect | — | AdminPlans.tsx:188,324-327 | see G13-E-15 |
| G13-PLAN-17 | Rule | Plan assignment copies a snapshot into the subscription | Missing in PRD | — | plansBillingStore.ts:2326-2379 | Decision G13-Q-07. |
| G13-PLAN-18 | Rule | Seat quota | Matches | plans/plans.md § F-1 | AdminPlans.tsx:2222-2240 | |
| G13-PLAN-19 | Rule | Storage limits per plan | PRD-only | plans/plans.md § F-1 "What it does" | — | |
| G13-PLAN-20 | X-ref | Client Billing, public Pricing, signup, onboarding, payment consume plans | Missing in PRD | — | components/billing/WorkspaceBillingPlansTab.tsx:138-233; app/pages/Pricing.tsx:119,124 | |
| G13-PLAN-21 | Rule | [SECURITY] Plans & Credits changes write no audit entries | Missing in PRD | — | AdminPlans.tsx (no audit call) | |

### C.5 Plans & Credits — Packed Pricing
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-PRC-01 | Flow | Credit bundles | Partial | plans/pricing.md § F-1.1 | AdminPlans.tsx:1933-2036,2670-2848 | No discount % field. |
| G13-PRC-02 | Rule | Price per extra seat per month | Matches | plans/pricing.md § F-1.2 | AdminPlans.tsx:1713-1744 | |
| G13-PRC-03 | Flow | Team member packs | Missing in PRD | — | AdminPlans.tsx:1770-1868,2851-3028 | |
| G13-PRC-04 | Rule | Base price per custom credit | Missing in PRD | — | AdminPlans.tsx:1876-1907 | |
| G13-PRC-05 | Rule | Country-wise pack pricing | Missing in PRD | — | AdminPlans.tsx:868-896 | |
| G13-PRC-06 | Flow | Purchase charges and credits wallet | Partial | plans/pricing.md § AC F-1-1 | components/billing/WorkspaceBillingOverviewTab.tsx:213-252 | No payment provider. |
| G13-PRC-07 | Flow | Country telephony/SMS rate cards | PRD-only | plans/pricing.md § F-2.1 | — | |
| G13-PRC-08 | Flow | Bulk markup editor | PRD-only | plans/pricing.md § F-2.2 | — | |
| G13-PRC-09 | Rule | Per-second call billing by destination | PRD-only | plans/pricing.md § AC F-2-1 | — | |
| G13-PRC-10 | Rule | Base rates save and toast on every keystroke | Prototype defect | — | AdminPlans.tsx:956-965,1736-1738 | see G13-E-16 |
| G13-PRC-11 | Rule | Credit pack Internal/Staff Only has no control | Prototype defect | — | plansBillingStore.ts:200 | see G13-E-17 |
| G13-PRC-12 | Rule | Seeded INR prices under a "USD $" label | Prototype defect | — | plansBillingStore.ts:946-961; AdminPlans.tsx:2716 | see G13-E-18 |
| G13-PRC-13 | X-ref | Packs shown in client top-up and add-seat flows | Partial | client/settings/billing.md § 1 | WorkspaceBillingOverviewTab.tsx:91-93 | |
| G13-PRC-14 | Rule | Stored per-credit price not recomputed from pack price | Prototype defect | — | AdminPlans.tsx:731,810-814 | see G13-E-19 |

### C.6 Plans & Credits — Plan Categories
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-PCAT-01 | Rule | Category meaning and columns | Contradicts | plans/categories.md § 1, § F-1.1 | AdminPlans.tsx:1130-1206 | Product lines vs display groups. |
| G13-PCAT-02 | Flow | Promotional badge dropdown | Contradicts | plans/categories.md § F-1.2 | AdminPlans.tsx:2302,2731-2738 | |
| G13-PCAT-03 | Rule | Linked plans | Partial | plans/categories.md § F-1.1 | AdminPlans.tsx:1169-1181 | Count only. |
| G13-PCAT-04 | Rule | Display sort order | PRD-only | plans/categories.md § F-1.1 | — | |
| G13-PCAT-05 | Flow | Create / edit with scope and Active | Missing in PRD | — | AdminPlans.tsx:402-479,3121-3230 | |
| G13-PCAT-06 | Rule | Delete blocked while plans use the category | Missing in PRD | — | AdminPlans.tsx:462-471 | |
| G13-PCAT-07 | Rule | "Used by" check uses fuzzy name matching | Prototype defect | — | plansBillingStore.ts:147-157 | see G13-E-20 |
| G13-PCAT-08 | Rule | Default categories re-seeded when all are deleted | Prototype defect | — | plansBillingStore.ts:1484-1488 | see G13-E-14 |
| G13-PCAT-09 | Rule | Inactive categories hidden from plan drawer | Missing in PRD | — | plansBillingStore.ts:1604 | |
| G13-PCAT-10 | X-ref | Badges on pricing / signup | Partial | plans/categories.md § AC F-1-1 | app/pages/Pricing.tsx:119,124 | |

### C.7 Plans & Credits — Credit Actions
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-CACT-01 | Rule | Credit actions table columns | Partial | plans/actions.md § F-1.1 | AdminPlans.tsx:1417-1465 | No key / description. |
| G13-CACT-02 | Flow | Edit rate modal | Partial | plans/actions.md § F-1.2 | AdminPlans.tsx:3031-3118 | |
| G13-CACT-03 | Rule | Effective start date | PRD-only | plans/actions.md § F-1.2 | — | |
| G13-CACT-04 | Rule | [SECURITY] Audited rate change | PRD-only | plans/actions.md § F-1.2 | — | |
| G13-CACT-05 | Rule | Action catalogue | Contradicts | plans/actions.md § 1 | plansBillingStore.ts:1196-1253 | No WhatsApp / LLM token. |
| G13-CACT-06 | Flow | Fixed catalogue (no create / delete) | Missing in PRD | — | AdminPlans.tsx:1467-1476 | |
| G13-CACT-07 | Rule | Deduction = credits × units, rounded, min 1; balance floored at 0 | Missing in PRD | — | plansBillingStore.ts:2279-2282 | Out-of-credit behaviour: G13-Q-08. |
| G13-CACT-08 | Rule | Real platform activities deduct credits | PRD-only | plans/actions.md § AC F-1-1 | components/billing/WorkspaceBillingCreditUsageTab.tsx:158 | Simulator only. |
| G13-CACT-09 | Rule | Linked feature category | Missing in PRD | — | AdminPlans.tsx:3050-3098 | |
| G13-CACT-10 | X-ref | Client Action Rate Card mirrors admin rates | Missing in PRD | — | WorkspaceBillingCreditUsageTab.tsx:444 | |

### C.8 Industries — Industries tab
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-IND-01 | Rule | Blueprint card grid with tenant counts | Contradicts | industry-category/industries.md § F-1.1 | /admin/industries — app/pages/admin/AdminIndustries.tsx:418-528 | Table; no counts. |
| G13-IND-02 | Rule | Terminology overrides | PRD-only | industries.md § F-1.2 | — | |
| G13-IND-03 | Rule | Module preset bundler | PRD-only | industries.md § F-1.3 | — | |
| G13-IND-04 | X-ref | Tenants inherit blueprint fields and terminology | PRD-only | industries.md § AC F-1-1 | — | |
| G13-IND-05 | Flow | Create / edit industry | Missing in PRD | — | AdminIndustries.tsx:168-215,691-825 | |
| G13-IND-06 | Flow | Duplicate; delete Custom industries with confirmation | Missing in PRD | — | AdminIndustries.tsx:146-166,507-524,954-976 | |
| G13-IND-07 | Rule | Record type System / Custom | Missing in PRD | — | data/industryReferenceData.ts:24 | |
| G13-IND-08 | Rule | Edits kept in memory only; nothing else reads them | Prototype defect | — | AdminIndustries.tsx:58-59 | see G13-E-21 |
| G13-IND-09 | Rule | Industry↔category link by name drifts on rename / delete | Prototype defect | — | AdminIndustries.tsx:175-189,292 | see G13-E-22 |
| G13-IND-10 | Flow | Search and category filter | Missing in PRD | — | AdminIndustries.tsx:95-121,349-389 | |
| G13-IND-11 | X-ref | Industry master feeds onboarding, organization forms and scope pickers (intended) | Missing in PRD | — | auth/QuickFormOnboardingScreen.tsx:497,572; pages/Settings.tsx:8206-8232 | Today they read seed lists (G13-E-21). |

### C.9 Industries — Industry Category tab
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-ICAT-01 | Rule | Categories table columns | Partial | industry-category/categories.md § F-1.1 | /admin/industry-category — AdminIndustries.tsx:542-677 | No Code / numeric count. |
| G13-ICAT-02 | Flow | Add Category modal generating code | Contradicts | categories.md § F-1.2 | AdminIndustries.tsx:828-945,274 | |
| G13-ICAT-03 | Rule | Category selectable for industries | Matches | categories.md § AC F-1-1 | AdminIndustries.tsx:71-76 | |
| G13-ICAT-04 | Flow | Attached-industry chips and "+" add | Missing in PRD | — | AdminIndustries.tsx:563-606 | |
| G13-ICAT-05 | Rule | Active status | Matches | categories.md § F-1.1 | AdminIndustries.tsx:624-635 | |
| G13-ICAT-06 | Flow | Duplicate / delete category | Missing in PRD | — | AdminIndustries.tsx:238-248,660-673 | |
| G13-ICAT-07 | Rule | Category delete has no cascade | Prototype defect | — | AdminIndustries.tsx:295 | see G13-E-23 |
| G13-ICAT-08 | Flow | Search | Matches | categories.md § F-1.1 | AdminIndustries.tsx:112-121 | |

### C.10 Sections & Fields — Fields
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-CF-01 | Rule | Fields table columns | Partial | custom-fields/fields.md § F-1.1 | /admin/custom-fields — app/pages/admin/AdminCustomFields.tsx:522-649 | |
| G13-CF-02 | Flow | Add Field drawer | Partial | fields.md § F-1.2 | pages/admin/components/AdminFieldDrawer.tsx:2440-6230 | |
| G13-CF-03 | Rule | Key captured and validated | Contradicts | fields.md § F-1.2 | AdminFieldDrawer.tsx:1990-1996,2099 | Auto-generated, not editable. |
| G13-CF-04 | Rule | Key uniqueness not checked; symbol-only names give empty keys | Prototype defect | — | AdminFieldDrawer.tsx:1994; app/context/FieldRegistryContext.tsx:3172-3204 | see G13-E-24 |
| G13-CF-05 | Rule | Data types | Partial | fields.md § F-1.3 | AdminFieldDrawer.tsx:145-181 | |
| G13-CF-06 | Rule | Validation formulas | PRD-only | fields.md § 1, § AC F-1-1 | AdminFieldDrawer.tsx:2228-2231 | |
| G13-CF-07 | Rule | Entities Client, Appointment, Process, Task | Contradicts | fields.md § F-1 | AdminCustomFields.tsx:197-207 | 9 modules; no Task. |
| G13-CF-08 | X-ref | Fields propagate to tenants | Partial | fields.md § Worked example | FieldRegistryContext.tsx:756-863 | By scope rules. |
| G13-CF-09 | Rule | Scope rules | Missing in PRD | — | AdminFieldDrawer.tsx:6059 | |
| G13-CF-10 | Rule | Contact Category dimension | Missing in PRD | — | AdminCustomFields.tsx:418-441 | |
| G13-CF-11 | Rule | Workflow assignment and Required at Stages | Missing in PRD | — | AdminFieldDrawer.tsx:2508-2553,5736-5801 | |
| G13-CF-12 | Rule | [SECURITY] Tenant permissions Hide / Edit / Add Options / Delete | Missing in PRD | — | AdminFieldDrawer.tsx:6108-6160 | |
| G13-CF-13 | Rule | User Visibility by team member | Missing in PRD | — | AdminFieldDrawer.tsx:5884-5903 | |
| G13-CF-14 | Rule | System fields cannot be deleted | Missing in PRD | — | AdminCustomFields.tsx:661-670 | |
| G13-CF-15 | Rule | Edits to system fields silently discarded | Prototype defect | — | FieldRegistryContext.tsx:3152-3168,3239-3247 | see G13-E-25 |
| G13-CF-16 | Flow | Two delete paths behave differently; drawer delete toasts success on system fields | Prototype defect | — | AdminCustomFields.tsx:364-372; AdminFieldDrawer.tsx:6204-6212 | see G13-E-26 |
| G13-CF-17 | Flow | "Required Fields" preset is a text search | Prototype defect | — | AdminCustomFields.tsx:457 | see G13-E-27 |
| G13-CF-18 | Rule | Field Status | PRD-only | fields.md § F-1.1 | — | |
| G13-CF-19 | X-ref | Client Settings > Sections/Fields consumes the registry | Matches | fields.md § Cross-product Summary | pages/Settings.tsx:3876,12837-12860 | |
| G13-CF-20 | Rule | No success toast on save | Prototype defect | — | AdminFieldDrawer.tsx:2093-2262 | see G13-E-28 |
| G13-CF-21 | Flow | "Advance List 2" unreachable for new fields | Prototype defect | — | AdminFieldDrawer.tsx:4454,5076-5156 | see G13-E-29 |

### C.11 Sections & Fields — Sections
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-CS-01 | Flow | Section reordering | PRD-only | custom-fields/sections.md § F-1.1, § AC F-1-1 | — | |
| G13-CS-02 | Flow | Add Section | Partial | sections.md § F-1.2 | pages/admin/components/AdminSectionDrawer.tsx:629-1478 | |
| G13-CS-03 | Rule | Default expanded | PRD-only | sections.md § F-1.2 | — | |
| G13-CS-04 | Rule | [SECURITY] Role-based section gate | Contradicts | sections.md § F-1.3 | AdminSectionDrawer.tsx:1038,1311 | Team-member visibility instead. |
| G13-CS-05 | Flow | Assign fields into sections | Matches | sections.md § F-1 | AdminSectionDrawer.tsx:1142-1191 | |
| G13-CS-06 | Flow | Reorder fields inside a section | Missing in PRD | — | AdminSectionDrawer.tsx:485-556 | |
| G13-CS-07 | Rule | Section scope, workflow, contact category | Missing in PRD | — | AdminSectionDrawer.tsx:641-983 | |
| G13-CS-08 | Rule | [SECURITY] Section permissions Hide / Edit / Add / Delete | Missing in PRD | — | AdminSectionDrawer.tsx:1038-1102 | |
| G13-CS-09 | Rule | System sections cannot be deleted | Missing in PRD | — | AdminCustomFields.tsx:752-761 | |
| G13-CS-10 | Rule | Edits to system sections silently discarded | Prototype defect | — | FieldRegistryContext.tsx:3422-3430 | see G13-E-25 |

### C.12 Document Templates
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-DOC-01 | Rule | Table columns | Partial | document-templates.md § F-1.1 | /admin/document-templates — app/pages/admin/AdminDocumentTemplates.tsx:277-343 | |
| G13-DOC-02 | Rule | Categories Consent / Referral / Discharge | Contradicts | document-templates.md § F-1.1 | lib/documentTemplatesStore.ts:32-39 | |
| G13-DOC-03 | Flow | Rich-text editor with toolbar | Partial | document-templates.md § F-1.2 | components/profile/AddDocumentTemplateDrawer.tsx:1195-1460 | |
| G13-DOC-04 | Flow | PDF preview | Partial | document-templates.md § F-1.2 | components/profile/GenerateDocumentDrawer.tsx:934-991 | |
| G13-DOC-05 | Rule | Merge tag syntax `{{patient.name}}` | Contradicts | document-templates.md § F-1 | documentTemplatesStore.ts:622-653 | |
| G13-DOC-06 | Flow | Tags auto-populate on generation | Matches | document-templates.md § F-1.3 | GenerateDocumentDrawer.tsx:816-841 | |
| G13-DOC-07 | Rule | Validate unpopulated tags | PRD-only | document-templates.md § F-1.3 | — | |
| G13-DOC-08 | Rule | Version | PRD-only | document-templates.md § F-1.1 | — | |
| G13-DOC-09 | Rule | Status | PRD-only | document-templates.md § F-1.1 | — | |
| G13-DOC-10 | Flow | Word import with placeholder extraction and mapping | Missing in PRD | — | AddDocumentTemplateDrawer.tsx:641-758,1467-1540 | |
| G13-DOC-11 | Rule | Entity availability and scope rules | Missing in PRD | — | AdminDocumentTemplates.tsx:169-189,395-405 | |
| G13-DOC-12 | Flow | Duplicate / delete template | Missing in PRD | — | AdminDocumentTemplates.tsx:152-167 | |
| G13-DOC-13 | Flow | Delete has no confirmation; seed templates reappear | Prototype defect | — | AdminDocumentTemplates.tsx:164-167; documentTemplatesStore.ts:555-557 | see G13-E-30 |
| G13-DOC-14 | Rule | [SECURITY] Templates kept in tab session storage, shared by admin and tenants | Prototype defect | — | documentTemplatesStore.ts:552-617 | see G13-E-31 |
| G13-DOC-15 | Flow | Template Users and Auto-Numbering not saved | Prototype defect | — | AddDocumentTemplateDrawer.tsx:803-816 | see G13-E-32 |
| G13-DOC-16 | X-ref | Client generation ignores admin scope | Prototype defect | — | GenerateDocumentDrawer.tsx:862-888 | see G13-E-33 |
| G13-DOC-17 | Rule | [SECURITY] Permissions panel not wired | Prototype defect | — | AdminDocumentTemplates.tsx:509-518 | see G13-E-34 |
| G13-DOC-18 | Flow | Drawer title always "Add Document Template" | Prototype defect | — | AddDocumentTemplateDrawer.tsx:829 | see G13-E-35 |
| G13-DOC-19 | X-ref | Client Documents tab and automation step picker consume templates | Missing in PRD | — | components/profile/DocumentsTab.tsx:81; components/process/StepParametersFields.tsx:5549-5610 | |

### C.13 Sidebar Navigation Templates
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-SB-01 | Flow | Drag-and-drop navigation tree | Matches | sidebar-config.md § F-1.1 | /admin/sidebar-config — pages/admin/components/SidebarTemplateDrawer.tsx:428,951-1167 | |
| G13-SB-02 | Rule | Module visibility switches | Partial | sidebar-config.md § F-1.2 | SidebarTemplateDrawer.tsx:472,1226 | |
| G13-SB-03 | Rule | Visibility per plan tier | Contradicts | sidebar-config.md § F-1.2 | lib/sidebarTemplateStore.ts:279-368 | |
| G13-SB-04 | Rule | [SECURITY] Role access filter per link | PRD-only | sidebar-config.md § F-1.3 | — | |
| G13-SB-05 | Rule | Changes apply on next session | Contradicts | sidebar-config.md § AC F-1-1 | app/context/SidebarMenuContext.tsx:366-386 | Live. |
| G13-SB-06 | Rule | Scoped templates with baseline fallback | Missing in PRD | — | sidebarTemplateStore.ts:39-107 | |
| G13-SB-07 | Rule | Best-match scoring | Missing in PRD | — | sidebarTemplateStore.ts:279-368 | |
| G13-SB-08 | Flow | Featured items and pinned workflows | Missing in PRD | — | SidebarTemplateDrawer.tsx:487,697-699 | |
| G13-SB-09 | Flow | Delete template; baseline protected | Missing in PRD | — | AdminSidebarConfig.tsx:205-216 | |
| G13-SB-10 | Flow | Delete has no confirmation | Prototype defect | — | AdminSidebarConfig.tsx:205-216 | see G13-E-36 |
| G13-SB-11 | Rule | Unique nav paths within a template | Missing in PRD | — | SidebarTemplateDrawer.tsx:744-747 | |
| G13-SB-12 | Rule | Active flag and default start page have no control | Prototype defect | — | SidebarTemplateDrawer.tsx:390-398 | see G13-E-37 |
| G13-SB-13 | X-ref | Applies to admin workspaces too | Contradicts | sidebar-config.md § 1 | components/layout/AdminSidebar.tsx:113-168 | |
| G13-SB-14 | X-ref | Client sidebar consumes templates | Matches | sidebar-config.md § 1 | SidebarMenuContext.tsx:147,331 | |

### C.14 AI Voices & Models
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-AI-01 | Rule | Model endpoints table | Contradicts | ai-voices-models.md § F-1.1 | /admin/ai-voices-models — app/pages/admin/AdminAIVoicesModels.tsx:593-636 | Cards. |
| G13-AI-02 | Rule | Automated failover | PRD-only | ai-voices-models.md § F-1.2 | — | |
| G13-AI-03 | Metric | Token usage meter | PRD-only | ai-voices-models.md § F-1.3 | — | |
| G13-AI-04 | Rule | API keys / base URL / rate limits | PRD-only | ai-voices-models.md § F-1 | — | |
| G13-AI-05 | Rule | ElevenLabs voice library | Partial | ai-voices-models.md § 1 | lib/useVoiceStore.ts:16-41 | |
| G13-AI-06 | Flow | Activate / deactivate model | Missing in PRD | — | AdminAIVoicesModels.tsx:203-212 | |
| G13-AI-07 | Flow | Activate / deactivate voice | Missing in PRD | — | AdminAIVoicesModels.tsx:214-223 | |
| G13-AI-08 | Flow | Voice preview | Missing in PRD | — | AdminAIVoicesModels.tsx:241-272 | Browser speech. |
| G13-AI-09 | Flow | Filters | Missing in PRD | — | AdminAIVoicesModels.tsx:129-200 | |
| G13-AI-10 | Rule | Two-level availability | Missing in PRD | — | lib/aiModelsStore.ts:139-146 | |
| G13-AI-11 | Rule | Fallback when nothing is active | Missing in PRD | — | aiModelsStore.ts:148-157; useVoiceStore.ts:118-122 | Decision G13-Q-17. |
| G13-AI-12 | Metric | Active / total counts | Missing in PRD | — | AdminAIVoicesModels.tsx:331-332 | Computed. |
| G13-AI-13 | Metric | Context window, latency — hardcoded – formula undefined | Missing in PRD | — | aiModelsStore.ts:26-27 | |
| G13-AI-14 | X-ref | Client Settings and process pickers use admin activation | Missing in PRD | client/settings/voices.md § F-1 | pages/Settings.tsx:3687,3701-3702 | |
| G13-AI-15 | X-ref | My AI Receptionist uses its own voice list | Prototype defect | — | pages/MyAIReceptionist.tsx:51-56,2811 | see G13-E-38 |
| G13-AI-16 | Flow | Bulk activate/deactivate logic has no button | Prototype defect | — | AdminAIVoicesModels.tsx:226-238 | see G13-E-39 |

### C.15 Admin Tasks (high level)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-TSK-01 | Flow | Admin tasks console with corporate scope isolation | Matches | tasks.md § F-1 | /admin/tasks — app/pages/Tasks.tsx:23,194-200,254 | Detail in Tasks report. |

### C.16 Product / Services (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-SVC-01 | Flow | Catalogue table, search, filters | Missing in PRD | — | /admin/services — app/pages/admin/AdminProductsServices.tsx:811-1016 | |
| G13-SVC-02 | Flow | Add / edit service | Missing in PRD | — | AdminProductsServices.tsx:653-790,1032-1375 | |
| G13-SVC-03 | Flow | Duplicate / delete service | Missing in PRD | — | AdminProductsServices.tsx:792-808 | |
| G13-SVC-04 | Flow | Delete has no confirmation; system services deletable | Prototype defect | — | AdminProductsServices.tsx:804-808 | see G13-E-40 |
| G13-SVC-05 | Rule | Prepaid deposit | Missing in PRD | — | AdminProductsServices.tsx:1278-1325 | |
| G13-SVC-06 | Rule | Scope rules | Missing in PRD | — | AdminProductsServices.tsx:486-522 | |
| G13-SVC-07 | Rule | Blank scope saved as Healthcare / General Physician | Prototype defect | — | AdminProductsServices.tsx:728-730 | see G13-E-41 |
| G13-SVC-08 | Rule | [SECURITY] Permissions panel and "Add Field" not wired | Prototype defect | — | AdminProductsServices.tsx:1140,1331,1343-1350 | see G13-E-34 |
| G13-SVC-09 | Rule | Status filter but no status column | Prototype defect | — | AdminProductsServices.tsx:811-884 | see G13-E-42 |
| G13-SVC-10 | Metric | Admin Scope summary | Missing in PRD | — | AdminProductsServices.tsx:524-580 | Computed. |
| G13-SVC-11 | X-ref | Catalogue never reaches tenants although copy says it is provisioned | Prototype defect | — | AdminProductsServices.tsx:1360-1363; lib/servicesStore.ts:6 | see G13-E-43 |
| G13-SVC-12 | X-ref | Active services provisioned to tenant catalogues (intended) | Missing in PRD | client/services.md | — | Decision G13-Q-13. |

### C.17 Workflows (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-WF-01 | Flow | Add workflow | Missing in PRD | — | /admin/workflows — app/pages/admin/AdminProcessTemplates.tsx:2719-2779 | |
| G13-WF-02 | Flow | Stage add / edit / reorder / delete | Missing in PRD | — | AdminProcessTemplates.tsx:2820,2890,2996-3124 | |
| G13-WF-03 | Flow | Left-panel stage delete: no confirmation, no predefined check | Prototype defect | — | AdminProcessTemplates.tsx:3445-3453 | see G13-E-44 |
| G13-WF-04 | Flow | Delete-workflow handler exists but is not wired | Prototype defect | — | AdminProcessTemplates.tsx:2798-2806 | see G13-E-45 |
| G13-WF-05 | Flow | Stage configuration | Missing in PRD | — | AdminProcessTemplates.tsx:4092-5340 | |
| G13-WF-06 | Flow | Stage automations | Missing in PRD | — | AdminProcessTemplates.tsx:4199,5184-5187 | |
| G13-WF-07 | Rule | Admin edits the live tenant workflow store | Missing in PRD | — | lib/useProcessStore.ts:302-303; pages/Process.tsx:1031-1046 | Decision G13-Q-12. |
| G13-WF-08 | Rule | Claims workflows dropped on save | Prototype defect | — | useProcessStore.ts:1562-1580 | see G13-E-46 |
| G13-WF-09 | Rule | Temporary Disable not saved | Prototype defect | — | AdminProcessTemplates.tsx:1369,3566-3573 | see G13-E-47 |
| G13-WF-10 | X-ref | [SECURITY] "Hide" permission behaves opposite to its tooltip on the client | Prototype defect | — | pages/Process.tsx:1161; pages/admin/components/AdminControlAccordion.tsx:160 | see G13-E-48 |
| G13-WF-11 | Metric | Entity counts; automation badge | Missing in PRD | — | AdminProcessTemplates.tsx:981-1001,4114 | |
| G13-WF-12 | Flow | Seven unreachable modals; scope modal permissions unconnected | Prototype defect | — | AdminProcessTemplates.tsx:5813,5904,5990,6119,6246,6540,6853,7221-7230 | see G13-E-49 |
| G13-WF-13 | Flow | Delete a workflow (intended) | Missing in PRD | — | — | Decision G13-Q-12. |

### C.18 Automations (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-AUTO-01 | Flow | Create rule | Missing in PRD | — | /admin/automations — app/pages/admin/AdminAutomations.tsx:220-231,668-690 | |
| G13-AUTO-02 | Rule | Target and loop validation | Missing in PRD | — | lib/useAutomationStore.ts:290,348,419-465 | |
| G13-AUTO-03 | Flow | Toggle / delete (confirm) / rescope | Missing in PRD | — | AdminAutomations.tsx:324-330,384-404 | |
| G13-AUTO-04 | Rule | Shared store with client | Missing in PRD | — | useAutomationStore.ts:22 | |
| G13-AUTO-05 | Metric | All / Active / Paused counts | Missing in PRD | — | AdminAutomations.tsx:480-500 | |
| G13-AUTO-06 | Metric | Last Run never recorded | Prototype defect | — | AdminAutomations.tsx:339-352 | see G13-E-50 |
| G13-AUTO-07 | X-ref | [SECURITY] Tenants can toggle and delete admin rules | Prototype defect | — | pages/Automation.tsx:213,261 | see G13-E-51 |
| G13-AUTO-08 | Rule | [SECURITY] Permissions panel not wired | Prototype defect | — | AdminAutomations.tsx:807-815,857-865 | see G13-E-34 |
| G13-AUTO-09 | X-ref | Client Automation shows scoped admin rules | Missing in PRD | client/automation.md § F-1 | pages/Automation.tsx:55-61 | |

### C.19 Forms (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-FORM-01 | Flow | Create form → Form Builder | Missing in PRD | — | /admin/forms — components/forms/FormCreateDrawer.tsx:63-93 | |
| G13-FORM-02 | Flow | Duplicate / toggle live-draft / delete | Missing in PRD | — | AdminFormTemplates.tsx:306-336 | |
| G13-FORM-03 | Flow | Form delete has no confirmation | Prototype defect | — | AdminFormTemplates.tsx:333-336 | see G13-E-52 |
| G13-FORM-04 | Flow | Scope & Permissions | Missing in PRD | — | AdminFormTemplates.tsx:285-297,1192-1352 | |
| G13-FORM-05 | Flow | Form Flows | Missing in PRD | — | AdminFormTemplates.tsx:462-1060 | |
| G13-FORM-06 | Rule | Live / Draft status not visible in table | Prototype defect | — | AdminFormTemplates.tsx:379-431 | see G13-E-53 |
| G13-FORM-07 | Rule | Deleting all forms restores seeds | Prototype defect | — | data/forms.ts:221 | see G13-E-54 |
| G13-FORM-08 | Metric | Counts and scope summary | Missing in PRD | — | AdminFormTemplates.tsx:339-414,595-628 | |
| G13-FORM-09 | X-ref | [SECURITY] Client Web Forms ignore scope, roles and permissions | Prototype defect | — | pages/WebForms.tsx:803-845 | see G13-E-55 |
| G13-FORM-10 | X-ref | Client Web Forms and patient screens read the form store | Missing in PRD | client/web-forms.md | pages/patient/PatientFormsScreen.tsx:54 | |
| G13-FORM-11 | Flow | "Edit in Flow Builder" opens the Form Builder | Prototype defect | — | AdminFormTemplates.tsx:433-459 | see G13-E-56 |

### C.20 Knowledge Base (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-KB-01 | Flow | Create / edit item | Missing in PRD | — | /admin/knowledge-base — app/pages/admin/AdminKnowledgeBase.tsx:843-881,1137-1592 | |
| G13-KB-02 | Flow | Duplicate / delete | Missing in PRD | — | AdminKnowledgeBase.tsx:905-922 | |
| G13-KB-03 | Flow | Delete has no confirmation | Prototype defect | — | AdminKnowledgeBase.tsx:918-922 | see G13-E-57 |
| G13-KB-04 | Rule | Placeholder file name and size saved when no file attached | Prototype defect | — | AdminKnowledgeBase.tsx:880-881 | see G13-E-58 |
| G13-KB-05 | Rule | Workflow list hardcoded, not from Workflows | Prototype defect | — | AdminKnowledgeBase.tsx:76-240 | see G13-E-59 |
| G13-KB-06 | Rule | Active flag unused; Applicable Processes not validated | Prototype defect | — | AdminKnowledgeBase.tsx:843-848,1592 | see G13-E-60 |
| G13-KB-07 | Metric | Scope summary | Missing in PRD | — | AdminKnowledgeBase.tsx:509-570 | |
| G13-KB-08 | X-ref | Admin KB never reaches tenants or AI agents | Prototype defect | — | pages/KnowledgeBase.tsx:1179-1200 | see G13-E-61 |
| G13-KB-09 | X-ref | KB templates feed tenant KB / AI agents (intended) | Missing in PRD | client/knowledge-base.md | — | Decision G13-Q-13. |

### C.21 Workspace Billing (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-BILL-01 | Metric | Total Workspaces, Active Subscriptions (+% coverage), Total Available Credits, Estimated MRR | Missing in PRD | — | /admin/billing — app/pages/admin/AdminBilling.tsx:89-100,235-263 | Computed. |
| G13-BILL-02 | Metric | Estimated MRR adds mixed currencies under "$" | Prototype defect | — | AdminBilling.tsx:91-100,260 | see G13-E-62 |
| G13-BILL-03 | Metric | "All connected" — hardcoded – formula undefined | Missing in PRD | — | AdminBilling.tsx:240 | |
| G13-BILL-04 | Flow | Change plan | Missing in PRD | — | AdminBilling.tsx:138-178 | |
| G13-BILL-05 | Flow | Change plan lists inactive/staff plans and can be reverted | Prototype defect | — | AdminBilling.tsx:496-501; plansBillingStore.ts:1747-1754 | see G13-E-63 |
| G13-BILL-06 | Flow | Allocate credit pack | Missing in PRD | — | AdminBilling.tsx:184-203 | |
| G13-BILL-07 | Flow | Allocated credits lost on next plan change | Prototype defect | — | plansBillingStore.ts:1939-1966 | see G13-E-64 |
| G13-BILL-08 | Rule | Status always "Active"; fake row for unsubscribed orgs | Prototype defect | — | AdminBilling.tsx:322-338,434-437 | see G13-E-65 |
| G13-BILL-09 | Rule | [SECURITY] Billing changes have no confirmation and no audit | Prototype defect | — | AdminBilling.tsx:138-203 | see G13-E-66 |
| G13-BILL-10 | X-ref | Shares subscription data with client Billing | Missing in PRD | client/settings/billing.md | plansBillingStore.ts:325 | |

### C.22 Orders (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-ORD-01 | Metric | Total Orders, Settled, Pending, Refunded | Missing in PRD | — | /admin/billing/orders — app/pages/admin/AdminOrders.tsx:95-102 | Computed. |
| G13-ORD-02 | Flow | Search, filters, export | Missing in PRD | — | AdminOrders.tsx:80-87,151-178,373-419 | |
| G13-ORD-03 | Flow | Mark Paid | Missing in PRD | — | AdminOrders.tsx:109; lib/ordersBillingStore.ts:473-513 | |
| G13-ORD-04 | Flow | Issue full refund | Missing in PRD | — | AdminOrders.tsx:120-123,567-613 | |
| G13-ORD-05 | Flow | Cancel order | Missing in PRD | — | AdminOrders.tsx:136-139 | |
| G13-ORD-06 | Rule | Cancelling a Paid order leaves it Paid without refund | Prototype defect | — | ordersBillingStore.ts:557-596 | see G13-E-67 |
| G13-ORD-07 | Rule | Order types and statuses | Missing in PRD | — | ordersBillingStore.ts:15-17 | |
| G13-ORD-08 | X-ref | Tenant purchases never create orders | Prototype defect | — | ordersBillingStore.ts:88,94-222 | see G13-E-68 |
| G13-ORD-09 | Rule | Currency always "$"; detail status pill always green | Prototype defect | — | AdminOrders.tsx:334-363,458-463 | see G13-E-69 |

### C.23 Subscriptions (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-SUB-01 | Metric | Active / Trials / Past Due counts | Missing in PRD | — | /admin/billing/subscriptions — app/pages/admin/AdminSubscriptions.tsx:95-100 | |
| G13-SUB-02 | Metric | Renewal Rate — hardcoded – formula undefined | Missing in PRD | — | AdminSubscriptions.tsx:104-107 | |
| G13-SUB-03 | Metric | Renewal Rate is a synthetic value presented as retention | Prototype defect | — | AdminSubscriptions.tsx:104-107 | see G13-E-70 |
| G13-SUB-04 | Flow | Change plan uses three hardcoded plans | Prototype defect | — | AdminSubscriptions.tsx:51-55 | see G13-E-71 |
| G13-SUB-05 | Flow | Change plan from the Plans catalogue (intended) | Missing in PRD | — | AdminSubscriptions.tsx:444-508 | |
| G13-SUB-06 | Flow | Add bonus credits; extend trial | Missing in PRD | — | AdminSubscriptions.tsx:139-156 | |
| G13-SUB-07 | Rule | Trial extension 1–90 day limit not enforced | Prototype defect | — | AdminSubscriptions.tsx:153-156 | see G13-E-72 |
| G13-SUB-08 | Flow | Pause / Cancel with confirmation | Missing in PRD | — | AdminSubscriptions.tsx:164-178 | |
| G13-SUB-09 | Rule | [SECURITY] Cancel audited as "deleted"; no Resume | Prototype defect | — | ordersBillingStore.ts:672-702 | see G13-E-73 |
| G13-SUB-10 | Flow | Search, filters, export | Missing in PRD | — | AdminSubscriptions.tsx:180-207 | |
| G13-SUB-11 | Rule | Separate dataset from workspace subscriptions | Prototype defect | — | ordersBillingStore.ts:19,89; plansBillingStore.ts:270,325 | see G13-E-74 |
| G13-SUB-12 | Metric | Total MRR computed but not shown | Prototype defect | — | AdminSubscriptions.tsx:96-98 | see G13-E-75 |

### C.24 Analytics — Overview (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-AN-01 | Metric | Six KPI cards and deltas — hardcoded – formula undefined | Missing in PRD | — | /admin/product-analytics/overview — lib/productAnalyticsStore.ts:45-58 | |
| G13-AN-02 | Metric | Volume chart, throughput, success % — hardcoded – formula undefined | Missing in PRD | — | AdminAnalyticsOverview.tsx:196-230 | |
| G13-AN-03 | Metric | Subsystem latency / status — hardcoded – formula undefined | Missing in PRD | — | AdminAnalyticsOverview.tsx:244-277 | |
| G13-AN-04 | Flow | Date filter and search do nothing | Prototype defect | — | AdminAnalyticsOverview.tsx:41,77 | see G13-E-76 |
| G13-AN-05 | Flow | "Ranked" workspaces unsorted; status pill always green | Prototype defect | — | AdminAnalyticsOverview.tsx:327,346-349 | see G13-E-77 |
| G13-AN-06 | Flow | Export CSV | Missing in PRD | — | AdminAnalyticsOverview.tsx:43-58 | |
| G13-AN-07 | Rule | Figures and labels disagree with other pages | Prototype defect | — | productAnalyticsStore.ts:50; lib/callsAnalyticsService.ts:75-328 | see G13-E-78 |
| G13-AN-08 | Flow | Drill-down links to Calls and Org Usage | Missing in PRD | — | AdminAnalyticsOverview.tsx:284,306 | |

### C.25 Analytics — Voice Calls (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-AN-09 | Metric | Completed / Incomplete / Failed and % of total | Missing in PRD | — | /admin/product-analytics/calls — lib/callsAnalyticsService.ts:439-455 | Computed (mock baseline). |
| G13-AN-10 | Metric | Avg Call Duration averages all calls; label says successful only | Prototype defect | — | callsAnalyticsService.ts:331-335,442,452 | see G13-E-79 |
| G13-AN-11 | Metric | Trend badges — hardcoded – formula undefined | Missing in PRD | — | callsAnalyticsService.ts:512-521 | |
| G13-AN-12 | Metric | Donut "Incomplete" differs from Incomplete card | Prototype defect | — | callsAnalyticsService.ts:458-501 | see G13-E-80 |
| G13-AN-13 | Metric | Time series — hardcoded – formula undefined (synthetic spread) | Missing in PRD | — | callsAnalyticsService.ts:531-600 | |
| G13-AN-14 | Flow | Filter by org (dropdown / bar / row), search, reset | Missing in PRD | — | AdminAnalyticsCalls.tsx:107-123,613-619 | |
| G13-AN-15 | Flow | Custom date range ignored | Prototype defect | — | callsAnalyticsService.ts:344-345 | see G13-E-81 |
| G13-AN-16 | Flow | Export CSV | Missing in PRD | — | callsAnalyticsService.ts:603-654 | |
| G13-AN-17 | Rule | Loading / error UI never triggered; duplicate export buttons | Prototype defect | — | AdminAnalyticsCalls.tsx:86-87,277,286 | see G13-E-82 |
| G13-AN-18 | Metric | Bars, donut shares, completion rate per org | Missing in PRD | — | callsAnalyticsService.ts:357-379 | Computed. |

### C.26 Analytics — Organization Usage (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-AN-19 | Metric | Per-org usage values — hardcoded – formula undefined | Missing in PRD | — | /admin/product-analytics/organization-usage — lib/productAnalyticsStore.ts:228-304 | |
| G13-AN-20 | Metric | Storage quota 10,000 MB — hardcoded – formula undefined | Missing in PRD | — | AdminAnalyticsOrgUsage.tsx:328 | |
| G13-AN-21 | Flow | Search, status filter, drawer, export | Missing in PRD | — | AdminAnalyticsOrgUsage.tsx:48-94,269-340 | |
| G13-AN-22 | Rule | Drawer status pill always green; no Suspended filter | Prototype defect | — | AdminAnalyticsOrgUsage.tsx:246-249 | see G13-E-83 |

### C.27 Analytics — Process Movement (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-AN-23 | Metric | KPIs and funnel — hardcoded – formula undefined | Missing in PRD | — | /admin/product-analytics/process-movement — lib/productAnalyticsStore.ts:139-209 | |
| G13-AN-24 | Metric | Identified Bottlenecks = count of bottleneck list | Missing in PRD | — | AdminAnalyticsProcessMovement.tsx:146 | |
| G13-AN-25 | Flow | Organization and date filters do nothing | Prototype defect | — | AdminAnalyticsProcessMovement.tsx:37-38 | see G13-E-76 |
| G13-AN-26 | Rule | Overall completion ≠ funnel; bottleneck outside funnel; every org shows ORG-0001 | Prototype defect | — | productAnalyticsStore.ts:142,203; AdminAnalyticsProcessMovement.tsx:76-86 | see G13-E-84 |
| G13-AN-27 | Flow | Export CSV | Missing in PRD | — | AdminAnalyticsProcessMovement.tsx:40-59 | |

### C.28 Analytics — Revenue & Invoices (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-AN-28 | Metric | MRR, ARR, settled, collection, open, overdue, tier mix, growth — hardcoded – formula undefined | Missing in PRD | — | /admin/product-analytics/revenue-invoices — lib/productAnalyticsStore.ts:320-343 | |
| G13-AN-29 | Rule | Cards disagree with invoice table; tier MRRs don't add up | Prototype defect | — | productAnalyticsStore.ts:329-334; lib/ordersBillingStore.ts:310-397 | see G13-E-85 |
| G13-AN-30 | Flow | Date filter does nothing | Prototype defect | — | AdminAnalyticsRevenueInvoices.tsx:38 | see G13-E-76 |
| G13-AN-31 | Flow | Recent invoices table and export | Missing in PRD | — | AdminAnalyticsRevenueInvoices.tsx:40-63,215-281 | |

### C.29 Telephony (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-TEL-01 | Flow | Provider cards with SIP credentials | Missing in PRD | — | /admin/integrations/telephony — app/pages/admin/AdminTelephony.tsx:566-758 | |
| G13-TEL-02 | Flow | [SECURITY] Reveal secret (audited) and copy | Missing in PRD | — | AdminTelephony.tsx:118-133 | |
| G13-TEL-03 | Rule | [SECURITY] Reveal logged as "login"; hiding not logged | Prototype defect | — | lib/telephonyAdminStore.ts:1010-1025 | see G13-E-86 |
| G13-TEL-04 | Flow | Add provider | Missing in PRD | — | AdminTelephony.tsx:906-1023 | |
| G13-TEL-05 | Rule | No duplicate-carrier / duplicate-number / E.164 checks | Prototype defect | — | AdminTelephony.tsx:306-309; telephonyAdminStore.ts:931-976 | see G13-E-87 |
| G13-TEL-06 | Flow | Configure provider drawer unreachable; no delete or test | Prototype defect | — | AdminTelephony.tsx:135-158,784-901 | see G13-E-88 |
| G13-TEL-07 | Rule | Due-date warning | Missing in PRD | — | AdminTelephony.tsx:174-199 | |
| G13-TEL-08 | Flow | Numbers inventory, filters, export | Missing in PRD | — | AdminTelephony.tsx:505-558,763-778 | |
| G13-TEL-09 | Flow | Export double-quotes cells | Prototype defect | — | AdminTelephony.tsx:339,343-344 | see G13-E-89 |
| G13-TEL-10 | Flow | Assign organization | Missing in PRD | — | AdminTelephony.tsx:268-285 | |
| G13-TEL-11 | Rule | Org code always "ORG-0001"; org filter cannot match seeds | Prototype defect | — | AdminTelephony.tsx:280,244-265 | see G13-E-90 |
| G13-TEL-12 | Flow | Target countries; release number (confirm) | Missing in PRD | — | AdminTelephony.tsx:288-302 | |
| G13-TEL-13 | Rule | [SECURITY] Release logged as "Suspended" / "deleted" | Prototype defect | — | telephonyAdminStore.ts:751-794 | see G13-E-91 |
| G13-TEL-14 | Flow | Add number | Missing in PRD | — | AdminTelephony.tsx:306-321 | |
| G13-TEL-15 | Metric | Numbers in use — hardcoded – formula undefined | Missing in PRD | — | telephonyAdminStore.ts:453 | |
| G13-TEL-16 | Metric | Numbers-in-use count never recalculated | Prototype defect | — | telephonyAdminStore.ts:453,947 | see G13-E-92 |
| G13-TEL-17 | Flow | Cross-org call log unreachable | Prototype defect | — | app/routes.tsx:325 | see G13-E-93 |
| G13-TEL-18 | X-ref | Assigned numbers reach client Integrations and AI Receptionist (intended) | Missing in PRD | client/settings/integrations.md | components/telephony/TelephonyIntegrationPanel.tsx:25-47 | Decision G13-Q-15. |
| G13-TEL-19 | Rule | [SECURITY] SupportSpecialist read-only on providers not enforced | Prototype defect | — | lib/adminRolesStore.ts:130 | see G13-E-100 |

### C.30 Audit Logs (no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-AUD-01 | Flow | Search, filters, export | Missing in PRD | — | /admin/settings/logs — app/pages/admin/AdminAuditLogs.tsx:105-170,286-357 | |
| G13-AUD-02 | Flow | Detail drawer with diff | Missing in PRD | — | AdminAuditLogs.tsx:391-542 | |
| G13-AUD-03 | Rule | [SECURITY] "Suspended" entries rewritten as "deleted" | Prototype defect | — | lib/auditLogsStore.ts:276-284 | see G13-E-94 |
| G13-AUD-04 | Rule | [SECURITY] Actor and IP hardcoded | Prototype defect | — | auditLogsStore.ts:321; adminRolesStore.ts:234-237 | see G13-E-95 |
| G13-AUD-05 | Rule | [SECURITY] Coverage: users, roles, telephony, orders, subscriptions only | Missing in PRD | — | auditLogsStore.ts:26-36 | Decision G13-Q-16. |
| G13-AUD-06 | X-ref | [SECURITY] Tenants see the platform admin log in Settings | Prototype defect | client/settings/audit-logs.md § 1 | pages/Settings.tsx:23,7763-7764 | see G13-E-96 |
| G13-AUD-07 | Flow | Action filter offers 8 of 12 action types | Prototype defect | — | AdminAuditLogs.tsx:314-323 | see G13-E-97 |
| G13-AUD-08 | Rule | [SECURITY] Read-only, non-editable log | Missing in PRD | — | AdminAuditLogs.tsx (no edit/delete) | |

### C.31 Cross-cutting (admin shell, no PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G13-X-01 | Rule | [SECURITY] Admin sidebar filtered by admin role | Missing in PRD | — | components/layout/AdminSidebar.tsx:170-188 | |
| G13-X-02 | Rule | [SECURITY] Admin routes only check sign-in | Prototype defect | — | components/auth/ProtectedRoute.tsx:4-11 | see G13-E-98 |
| G13-X-03 | Rule | [SECURITY] Unknown role name allowed | Prototype defect | — | lib/adminRolesStore.ts:194 | see G13-E-99 |
| G13-X-04 | Rule | [SECURITY] Action-level permission check never called | Prototype defect | — | adminRolesStore.ts:202-218 | see G13-E-100 |
| G13-X-05 | Rule | No loading or data-error states on admin screens | Missing in PRD | — | components/ui/TableComponent.tsx:62,84,494 | States not handled. |
| G13-X-06 | Rule | Shared Admin Control panel (Scope Rules + Permissions) | Missing in PRD | — | pages/admin/components/AdminScopingRulesEditor.tsx:84-233 | |
| G13-X-07 | Rule | [SECURITY] Seeded analytics permission keys match no module | Prototype defect | — | adminRolesStore.ts:50,117-118,157 | see G13-E-101 |
| G13-X-08 | Rule | Unrouted pages and unused components | Prototype defect | — | app/routes.tsx:97-99 | see G13-E-102 |
| G13-X-09 | Rule | Client Settings / Reports render inside the admin shell | Missing in PRD | — | app/routes.tsx:334,339-340 | Decision G13-Q-19. |
| G13-X-10 | Rule | Logo link goes to Workflows; index shows Sections & Fields | Prototype defect | — | components/layout/AdminLayout.tsx:94; app/routes.tsx:282 | see G13-E-103 |

---

## D. Correct flow as built (PRD-ready)
Each block replaces the body of the named PRD file (keep the file's existing frontmatter and update `last_updated`). Blocks follow the PRD layout: header table → Cross-product Summary → 1. Module Summary → 2. Feature Requests (F-n with sub-headings 1–5) → 3. Comprehensive Summary. Screens with no PRD use the same layout and a proposed file name. **D describes intended behaviour only**: prototype defects (section E) are not written as rules; where intent is unclear the text says `Decision needed … (see G13-Q-xx)`. PRD items that are not built sit under `### Not yet built`. Copy from a `<!-- paste -->` marker to the next `<!-- end -->` marker.

**Access (applies to every block):** Super Admin screens are for Mantra platform staff. The admin role assigned in User Management decides which screens appear in the admin sidebar. Decision needed: should admin-role permissions also block direct URL access and individual actions (create, edit, delete, export) on each screen? (see G13-Q-02)

<!-- paste → content/admin/organizations.md -->
| Product | ADMIN |
| Module | ORGANIZATIONS |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Plan assignment | The plan chosen here becomes the organization's subscription in Settings → Billing | [View in Client](/client/settings/billing) |
| Client | Suspension | Users of a suspended organization are blocked at sign-in | — |
| Client | Invite acceptance & onboarding | Accepting the invite moves the organization to Onboarding, completing onboarding makes it Active | — |
| Client | Sidebar template | The organization's industry and location decide which sidebar template its users get | [View Sidebar Config](/admin/sidebar-config) |

## 1. Module Summary
- The Organizations module lists every tenant organization and lets platform staff invite a new organization with a plan, change or remove its plan, suspend or reactivate it, delete it and export the list.
- Statuses: **Invite sent → Onboarding → Active**, plus **Suspended**.
- Organizations is a platform-staff screen; tenants never see other organizations. Decision needed: final access rule (see G13-Q-03).

## 2. Feature Requests

### F-1: Organization Directory
#### 1. What it does
Shows all organizations, newest first, with search by name, email or Org ID and a filter by AI Provider (LiveKit / Dograh).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Organizations Table | Data Table | Org ID, Name, Email, Industry (specialty), AI Provider, Created, Status | 20 / 50 / 100 rows per page |
| F-1.2: Search & Filter | Filter Controls | Search name, email, Org ID; filter by AI Provider | |
| F-1.3: Row Actions | Menu | Assign plan · Upgrade plan (only when a higher tier exists in the same plan category) · Remove plan · Suspend / Reactivate · Delete | |
| F-1.4: Export | Button | CSV of the filtered list (Org ID, Name, Email, Industry, AI Provider, Created Date, Status) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A clinic stops paying | Chooses Suspend organization and confirms | **Status becomes Suspended; the clinic's users see "This organization has been suspended. Please contact support." at sign-in** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Super Admin | When a customer's contract changes, I want to suspend, reactivate, re-plan or delete their organization, so that access matches the contract. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Suspend, Reactivate, Remove plan and Delete each ask for confirmation. |
| F-1-2 | A suspended organization's users cannot sign in. |
| F-1-3 | Remove plan moves the organization to the free plan of its plan category. |
| F-1-4 | Org ID and organization email are unique across the platform. |
| F-1-5 | With no matches the table shows "No organizations found matching your search." |

### F-2: Add Organization (Invite)
#### 1. What it does
A four-step drawer collects the organization's details and plan, creates the organization with status Invite sent and produces an invite link for the owner.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Step 1 – Organization | Form | Organization email (valid format), Website (required) | Name suggested from the website domain |
| F-2.2: Step 2 – Information | Form | Name*, Country, Industry, Primary service & category, Locations with days and hours (first required), Products & Services (one required), Workspace Setup (team size, call volume, countries, AI Provider), Knowledge Base uploads | |
| F-2.3: Step 3 – Plan | Picker | Plan from tabs AI Receptionist, AI Scribe, EHR, RCM, Internal, Onboarding | Required |
| F-2.4: Step 4 – Review & Send | Button | Creates the organization, assigns the plan subscription, issues an invite link (`/invite?token=…`) | Currency INR for India, else USD |
| F-2.5: Discard guard | Modal | Closing with data entered asks "Discard Unsaved Changes?" | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New dental clinic signs | Completes the four steps, picks an AI Receptionist plan, clicks Send Invite | **Organization appears as "Invite sent"; the owner receives the invite link** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Super Admin | When onboarding a customer, I want to set up the organization and plan in one flow, so that the owner can accept and start onboarding. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Each step blocks Next until its required fields are valid. |
| F-2-2 | Accepting the invite sets Onboarding; finishing onboarding sets Active. |
| F-2-3 | Decision needed: is the invite link emailed to the owner or copied by staff? (see G13-Q-03) |

### Not yet built
- Custom slug / tenant URL; Trial status and status filter; storage usage; users-count and subscription columns.
- Tenant impersonation / support login.
- Editing organization details.
- Decision needed: which organization actions are audited (see G13-Q-16).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Organization Directory | F-1.1–F-1.4 | List, search, filter, re-plan, suspend, delete and export organizations. |
| F-2 | Add Organization (Invite) | F-2.1–F-2.5 | Four-step invite flow that creates the organization and its plan subscription. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Super Admin | Keep organization access in line with contracts. | F-1 |
| 2 | Super Admin | Onboard a customer with organization and plan in one flow. | F-2 |
<!-- end -->

<!-- paste → content/admin/users.md -->
| Product | ADMIN |
| Module | USERS |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Admin sidebar | The admin role assigned here decides which admin screens a staff member sees | — |
| Admin | Audit Logs | Every user and role change appears in Audit Logs | [View Audit Logs](/admin/settings/logs) |

## 1. Module Summary
- User Management manages Mantra platform staff who use the admin portal and the **admin roles** that decide which admin screens they can use.
- Each user has exactly one role; statuses are **Active**, **Invited**, **Suspended**.
- Decision needed: how an admin user record links to sign-in identity (see G13-Q-04).

## 2. Feature Requests

### F-1: Administrator Directory
#### 1. What it does
Lists administrators with search, role and status filters; staff can invite, change role, suspend, reactivate, reset password, resend invite, remove and export.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Users Table | Data Table | Administrator, Email, Role, Status, Last Login, Created | |
| F-1.2: Invite User | Drawer | Full Name*, Email Address* (unique), Assigned Role* (default Admin) → status Invited | |
| F-1.3: Row Actions | Menu | Change Role · Reset Password · Resend Invite (Invited) · Suspend Access (Active) · Reactivate Access (Suspended) · Remove Admin | SystemAdmin users cannot be suspended or removed |
| F-1.4: Export | Button | CSV of users | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A support agent leaves | Chooses Remove Admin and confirms | **User is removed and Audit Logs records who removed whom** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Super Admin | When staff join or leave, I want to manage their admin access, so that only current staff operate the platform. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Suspend, Reset Password and Remove Admin ask for confirmation. |
| F-1-2 | At least one SystemAdmin must always remain; a SystemAdmin's role cannot be changed if they are the last one. |
| F-1-3 | Invite, role change, suspend/reactivate, reset password, resend invite and remove each create an audit entry naming the signed-in staff member. |

### F-2: Admin Roles
#### 1. What it does
A Roles tab to create, edit, duplicate and delete admin roles using a module permission matrix.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Roles Table | Data Table | Role Name (lock + System badge), Description, Users (number of users with the role), Created | |
| F-2.2: Role Editor | Drawer | Role Name* (unique), Description, matrix over 21 admin modules: Permissions (Read, Write, Delete, Import, Export) and Level (All Records, Department, Own Records, Deny) | New roles start at Read / All Records; Write includes Read and Delete |
| F-2.3: Seeded roles | Data | SystemAdmin (locked), Admin, BillingAdmin, SupportSpecialist, ReadonlyAuditor (system), Clinical Operations Lead (custom) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Finance needs a narrower role | Duplicates BillingAdmin and removes Write on Plans | **Users with the new role see only the screens they can read** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Super Admin | When defining internal teams, I want admin roles, so that each team sees only the admin screens it needs. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | SystemAdmin cannot be edited; system roles cannot be deleted. |
| F-2-2 | Deleting a custom role asks for confirmation and requires its users to be reassigned first. |
| F-2-3 | Role permissions control which admin sidebar items appear. Decision needed: action-level enforcement (see G13-Q-02). |

### Not yet built
- MFA Enrolled and Active Sessions columns; enterprise SSO (SAML / OIDC); Revoke All Sessions.
- Real invite and password-reset emails.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Administrator Directory | F-1.1–F-1.4 | Invite and manage platform staff accounts. |
| F-2 | Admin Roles | F-2.1–F-2.3 | Module permission roles for the admin portal. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Super Admin | Keep admin access limited to current staff. | F-1 |
| 2 | Super Admin | Give each internal team the right admin screens. | F-2 |
<!-- end -->

<!-- paste → content/admin/roles.md -->
| Product | ADMIN |
| Module | ROLES |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Departments | Departments are shared with tenant Settings | [View in Client](/client/settings/team) |
| Admin | Tasks | Role names and categories are offered as task targets | [View Tasks](/admin/tasks) |

## 1. Module Summary
- Roles & Permissions defines **tenant role templates**: named roles with a permission matrix per module (and per workflow), scoped to industry categories, industries and locations, plus Departments.
- These are separate from admin roles in User Management. Decision needed: how templates reach organizations and how they are enforced in tenant workspaces (see G13-Q-05).

## 2. Feature Requests

### F-1: Role Template Matrix
#### 1. What it does
Lists role templates with search and category / industry filters and opens a drawer to configure each role.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Roles Table | Data Table | Role Name, Description, Admin Scope ("N industries, M countries"), Permitted Scope, Created Date | Decision needed: define Permitted Scope summary (see G13-Q-29) |
| F-1.2: Role Drawer | Drawer | Role Name* (unique), Department, Description, Admin Scope rules, matrix over 19 modules: Permission (Read, Write, Delete, Import, Export) and Level (All Records, Department, Own Records, Deny) | Workflow modules expand to per-workflow rows that can inherit |
| F-1.3: Duplicate Role | Action | Creates "{name} (Copy)" as a custom role | |
| F-1.4: Seeded roles | Data | Super Administrator (system) + 7 industry roles | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dental clinics need a hygienist role | Duplicates a clinical role, scopes it to Dental, sets Clients to Read | **A dental-scoped template appears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Super Admin | When packaging an industry, I want standard role templates, so that clinics start with sensible access. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Role Name is required and unique. |
| F-1-2 | System roles cannot be deleted; deleting a custom role asks for confirmation. |
| F-1-3 | Template changes are audited (see G13-Q-16). |

### F-2: Departments
#### 1. What it does
Add, edit and delete departments; each shows how many roles belong to it.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Departments Table | Data Table | Department Name, Description, Assigned Roles (count of roles in the department), Actions | Delete asks for confirmation |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Add "Front Desk" | Adds the department | **It can be picked in the role drawer** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Super Admin | When grouping roles, I want departments, so that department-level scope works. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Assigned Roles counts roles whose department matches. |

### Not yet built
- Separate Add and Edit permissions; PHI export gate with MFA re-authentication.
- Hiding tenant buttons and blocking APIs based on the template (see G13-Q-05).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Role Template Matrix | F-1.1–F-1.4 | Industry-scoped tenant role templates with module and workflow permissions. |
| F-2 | Departments | F-2.1 | Departments shared with tenant Settings. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Super Admin | Ship standard roles per industry. | F-1 |
| 2 | Super Admin | Group roles by department. | F-2 |
<!-- end -->

<!-- paste → content/admin/plans/plans.md -->
| Product | ADMIN |
| Module | PLANS |
| Channel | PLANS |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Billing → Plans | Tenants see active, non-staff plans whose scope matches them, at their country price | [View in Client](/client/settings/billing) |
| Client | Public pricing, signup, onboarding, payment | Plans are offered and assigned during sign-up and onboarding | — |
| Admin | Organizations | Plans are assigned when inviting or re-planning an organization | [View Organizations](/admin/organizations) |

## 1. Module Summary
- The Industry Plans tab of **Plans & Credits** defines subscription plans: tier, plan category, seats, monthly and yearly credits, modules and features, provisioned templates, price per country and which tenants can see the plan.
- Decision needed: final tier names (see G13-Q-06).

## 2. Feature Requests

### F-1: Industry Plans Catalogue
#### 1. What it does
Lists plans with tier, scope and status filters and opens a four-tab drawer to create or edit a plan.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Plans Table | Data Table | Plan Name (+ Popular), Category, Tier, Admin Scope, Included Seats, Included Credits (/mo, /yr), Status (Staff Only / Active / Inactive) | |
| F-1.2: General & Quotas | Form | Plan Name*, Tier*, Plan Category* (active categories matching the scope), Description, Admin Scope, Included Seats (1–500), Monthly Credits, Yearly Credits, flags Active / Highlight as Popular / Internal-Staff Only | Yearly credits pre-fill as 12 × monthly |
| F-1.3: Modules & Features | Checkboxes | Modules (turning one on selects its features) and display feature list | At least one feature line |
| F-1.4: Templates | Picker | Processes, workflows, documents, web forms provisioned with the plan | Filterable by industry |
| F-1.5: Country Pricing | Table | Monthly and yearly price per country | At least one country, no duplicates |
| F-1.6: Row Actions | Menu | Edit · Duplicate · Toggle Active · Delete (confirm) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Growth receptionist plan for India | Creates the plan with scope Healthcare / India, 5 seats, 2,500 monthly credits and an India price | **Indian healthcare tenants see it in Billing → Plans at the India price** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Revenue Officer | When packaging tiers, I want plans with seats, credits, modules and local prices, so that each market gets the right offer. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A tenant sees a plan only if it is Active, not Staff Only, and its scope matches the tenant's industry category, industry and location. |
| F-1-2 | Tenant price = the tenant's country row, else the US row, else the first row. |
| F-1-3 | New workspaces get the first active Free plan. |
| F-1-4 | A deleted plan stays deleted. Decision needed: may a plan with subscribers be deleted? (see G13-Q-07) |
| F-1-5 | Decision needed: do plan edits reach existing subscribers or only new ones? (see G13-Q-07) |

### Not yet built
- Price and Active Tenants columns; storage limits; Multi-Location toggle.
- Enforcing modules, features and seat limits in tenant workspaces, with upgrade prompts (see G13-Q-07).
- Monthly credit replenishment (see G13-Q-08).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Industry Plans Catalogue | F-1.1–F-1.6 | Scoped, localised subscription plans with quotas, modules and templates. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Revenue Officer | Offer the right plan per market. | F-1 |
<!-- end -->

<!-- paste → content/admin/plans/pricing.md -->
| Product | ADMIN |
| Module | PLANS |
| Channel | PRICING |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Top-up modal | Active, non-internal credit packs and the custom credit price | [View in Client](/client/settings/billing) |
| Client | Add seats drawer | Active team packs and the per-seat price | [View in Client](/client/settings/billing) |

## 1. Module Summary
- Packed Pricing sets two base rates (price per extra seat per month, price per custom credit) and manages purchasable Team Member packs and Credit packs, each with optional per-country prices.
- Decision needed: currency model for packs and base prices (see G13-Q-09).

## 2. Feature Requests

### F-1: Base Rates
#### 1. What it does
Sets the price per extra team member per month (default $20) and the price per custom credit (default $0.05).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Cost Per Extra Team Member | Number Input | Monthly price per seat beyond plan seats | Min 1 |
| F-1.2: Price Per Custom Credit | Number Input | Price per credit for custom top-ups | Min 0.001 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Seat price rises | Sets 25 and saves | **Client custom seat purchases cost $25 / member / month** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Finance Administrator | When unit costs change, I want one place to set seat and credit prices. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A change is saved once the admin confirms the new value, with one confirmation message. |

### F-2: Team Member Packs and Credit Packs
#### 1. What it does
Card lists of seat bundles and credit bundles with create, edit, toggle active and delete.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Team Member Pack | Card + Drawer | Pack Name*, Extra Members*, Base Monthly Cost*, Badge, country pricing, Active ("Visible in client add seats drawer") | Card shows price per member = pack price ÷ members |
| F-2.2: Credit Pack | Card + Drawer | Package Name*, Credits (min 100), Base Cost*, Badge, country pricing, Active ("Visible in client top-up modal"), Internal / Staff Only | Card shows price per credit = pack price ÷ credits |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Volume offer | Creates 10,000 credits for $160, badge "Save 20%" | **Pack appears in the client top-up modal; buying it adds 10,000 credits** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Finance Administrator | When pricing consumption, I want bundles, so that heavy users buy bigger packs. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Deleting a pack asks for confirmation. |
| F-2-2 | Only active, non-internal packs appear to tenants. |

### Not yet built
- Unit discount % field; country telephony/SMS rate cards; bulk markup editor; per-second call billing by destination; payment-provider checkout.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Base Rates | F-1.1, F-1.2 | Per-seat and per-credit prices for custom purchases. |
| F-2 | Team & Credit Packs | F-2.1, F-2.2 | Purchasable bundles with local prices. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Finance Administrator | Price custom seats and credits. | F-1 |
| 2 | Finance Administrator | Offer volume bundles. | F-2 |
<!-- end -->

<!-- paste → content/admin/plans/categories.md -->
| Product | ADMIN |
| Module | PLANS |
| Channel | CATEGORIES |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Billing → Plans, public pricing | Plans are grouped by category (product line) | [View in Client](/client/settings/billing) |

## 1. Module Summary
- Plan Categories are the product lines plans belong to (seeded: AI Receptionist, AI Scribe, EHR, RCM, Internal, Onboarding), each with Admin Scope and Active status.

## 2. Feature Requests

### F-1: Plan Category Registry
#### 1. What it does
Lists categories with how many plans use each; create, edit, toggle and delete.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Categories Table | Data Table | Category Name (+ description), Admin Scope, Plans Using (plans in this category), Status | |
| F-1.2: Category Drawer | Drawer | Category Name*, Description, Admin Scope (default Healthcare), Active | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Delete "EHR" while plans use it | Clicks Delete | **Blocked: "Cannot delete category … used by N plan(s)"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Product Lead | When launching a product line, I want a category, so that plans group by product. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Inactive categories cannot be chosen for plans. |
| F-1-2 | A category with plans in it cannot be deleted; otherwise delete asks for confirmation and is permanent. |

### Not yet built
- Badge label and promotional badge dropdown; display sort order; list of linked plans.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Plan Category Registry | F-1.1, F-1.2 | Product-line categories with scope and status. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Product Lead | Group plans by product line. | F-1 |
<!-- end -->

<!-- paste → content/admin/plans/actions.md -->
| Product | ADMIN |
| Module | PLANS |
| Channel | ACTIONS |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Billing → Credit Usage | The Action Rate Card shows these rates | [View in Client](/client/settings/billing) |

## 1. Module Summary
- Credit Actions sets how many credits each billable event deducts. Seeded: Outbound Calls (per minute) 1, Calls received (per minute) 2, Missed Call Callback 3, SMS Sent 1, Email Sent 1, Workflow Execution 1, AI Scribe Transcription 2.

## 2. Feature Requests

### F-1: Credit Deduction Rates
#### 1. What it does
A fixed list of actions whose rate, unit and linked feature can be edited.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Credit Actions Table | Data Table | Action Event, Linked Feature, Unit Basis, Credits Deducted | |
| F-1.2: Edit Credit Rate | Modal | Action Name*, Credits Deducted (min 1), Unit Basis, Linked Feature (Calls / SMS / Email / Workflows / AI Scribe) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Scribe cost rises | Sets AI Scribe Transcription to 3 | **Client rate card shows 3 credits per unit** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Operations | When costs change, I want to adjust deduction rates. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A deduction = action credits × units, rounded, minimum 1. Decision needed: what happens when credits run out (see G13-Q-08). |

### Not yet built
- Action Key and Description columns; effective start date; audited changes; WhatsApp and LLM-token actions; real product events deducting credits.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Credit Deduction Rates | F-1.1, F-1.2 | Editable credits-per-unit for billable events. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Operations | Keep consumption pricing aligned with cost. | F-1 |
<!-- end -->

<!-- paste → content/admin/industry-category/industries.md (F-2) and categories.md (F-1) -->
| Product | ADMIN |
| Module | INDUSTRY-CATEGORY |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Onboarding & organization forms | Industry and category lists come from this master | — |
| Admin | Scope Rules on every catalogue screen | Category and industry pickers use this master | — |

## 1. Module Summary
- Industries has two tabs: **Industry Category** (default) and **Industries**. Seeded: 7 categories, 51 industries (System records).
- This screen is the master list for onboarding, organization forms and every scope-rule picker. Decision needed: confirm that role (see G13-Q-11).

## 2. Feature Requests

### F-1: Industry Categories
#### 1. What it does
Lists categories with attached industries; create, edit, duplicate, delete.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Categories Table | Data Table | Category Name, Attached Industries (first 2 + "+N more"; "+" adds an industry), ID, Status, Actions | Searchable |
| F-1.2: Category Drawer | Drawer | Category Name*, Description, Active ("Enable category for new registrations") | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Add "Allied Health" | Creates it and adds "Physiotherapy" via "+" | **Category shows one attached industry and is available in scope pickers** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Architect | When expanding to new verticals, I want categories that group industries. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Delete asks for confirmation. Decision needed: what happens to industries in a deleted category (see G13-Q-11). |

### F-2: Industries
#### 1. What it does
Lists industries with category filter and search; create, edit, duplicate; delete Custom industries.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Industries Table | Data Table | Industry Name, Industry Category, ID, Record Type (System / Custom), Status, Actions | System industries cannot be deleted |
| F-2.2: Industry Drawer | Drawer | Industry Name*, Industry Category*, Description, Active ("Enable industry for provisioning") | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New specialty | Adds "Sleep Medicine" under Healthcare | **It appears in onboarding and scope pickers** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Onboarding Lead | When a new specialty signs up, I want it in the list. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Changes are saved and renaming an industry updates its category's list. |
| F-2-2 | Names are unique within a category. |

### Not yet built
- Blueprint card grid with tenant counts; terminology overrides; module presets; inheritance of fields and terminology; category code.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Industry Categories | F-1.1, F-1.2 | Top-level groups of industries. |
| F-2 | Industries | F-2.1, F-2.2 | Master list of specialties. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Architect | Organise verticals. | F-1 |
| 2 | Onboarding Lead | Keep the specialty list current. | F-2 |
<!-- end -->

<!-- paste → content/admin/custom-fields/fields.md -->
| Product | ADMIN |
| Module | CUSTOM-FIELDS |
| Channel | FIELDS |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Settings → Sections/Fields | Fields in scope appear for tenant admins, who manage them within the permissions set here | [View in Client](/client/settings/custom-fields) |
| Client | Record drawers & profiles | Contact, process, appointment, invoice, claim, team, organization and service drawers show these fields | — |

## 1. Module Summary
- **Sections & Fields** defines fields for nine modules — Contact, Call Logs, Processes, Appointments, Services, Invoices, Insurance & Claims, Organizations, Team Members — and per contact category (Lead, Client, custom).
- Each field can be limited by Scope Rules and carries tenant permissions (Hide, Edit, Add Options, Delete).

## 2. Feature Requests

### F-1: Fields
#### 1. What it does
Lists fields for the selected module and opens a drawer to create or edit one.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Fields Table | Data Table | Label, Key, Type, Process (Processes only), Required / Optional, Scope | Filters: All, Required, Text |
| F-1.2: Field Drawer | Drawer | Module* (several = shared), Workflow(s), Contact Category, Field Name*, Field Type*, type settings, Placeholder, Tool tip, Default Value, Field Settings (Required, Required at Stages, Show always, User Visibility, Scope Rules, Permissions) | Key generated from the name. Decision needed: editable keys (see G13-Q-18) |
| F-1.3: Field Types | Picker | Text, String, Phone Number, Email, Link / URL, Number, Money / Currency, Date & Time, Rating / Score, List, Yes / No, Group Field, Link to Mantra Entities, Media Attach, Digital Signature | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Add "Blood Type" | Creates a List on Contact with A+…AB-, scope Healthcare | **Healthcare tenants see it on contact profiles** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Administrator | When standardising data, I want reusable fields per module and industry. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Field Name is required; keys are unique per module. |
| F-1-2 | Number Min ≤ Max; default within range. |
| F-1-3 | A field is visible to a tenant when any scope rule matches its industry category, industry and country; no rules = all tenants. |
| F-1-4 | System fields cannot be deleted. Decision needed: can system fields be edited? (see G13-Q-18) |
| F-1-5 | Delete asks for confirmation and removes the field from every section in the module; save and delete show a confirmation message. |

### Not yet built
- Validation formulas; field Status; Task entity.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Fields | F-1.1–F-1.3 | Scoped, permissioned fields for nine modules. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Administrator | Standardise tenant data. | F-1 |
<!-- end -->

<!-- paste → content/admin/custom-fields/sections.md -->
| Product | ADMIN |
| Module | CUSTOM-FIELDS |
| Channel | SECTIONS |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Record profiles | Sections group fields on profiles in the order set here | — |

## 1. Module Summary
- Sections group fields on record profiles. Each belongs to a module (and contact category / workflow), with Scope Rules, tenant permissions (Hide, Edit, Add, Delete) and optional team-member visibility.

## 2. Feature Requests

### F-1: Sections
#### 1. What it does
Lists sections with field counts and opens a drawer to create or edit a section and arrange its fields.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Sections Table | Data Table | Section, Description, Process, Scope, Fields ("N fields") | |
| F-1.2: Section Drawer | Drawer | Module*, Contact Category, Process Workflow, Scope Rules, Permissions, Section Name*, Description, Fields (add, drag to reorder, remove), Show always, User Visibility | Picker shows fields matching the section's category and scope |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | "Insurance Details" | Creates the section, adds three fields, drags policy number first | **Profiles show the fields in that order** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Administrator | When records are dense, I want named sections. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Section Name is required; field order is saved. |
| F-1-2 | System sections cannot be deleted. Decision needed: can they be edited? (see G13-Q-18) |

### Not yet built
- Reordering sections; default expanded/collapsed; role-based section visibility.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Sections | F-1.1, F-1.2 | Ordered, scoped field groups. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Administrator | Organise fields on profiles. | F-1 |
<!-- end -->

<!-- paste → content/admin/document-templates.md -->
| Product | ADMIN |
| Module | DOCUMENT-TEMPLATES |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Documents tab → Generate | Templates available for the record type and the tenant's scope can be generated with values filled | — |
| Client | Process automations | Document steps offer templates in scope | — |

## 1. Module Summary
- Document Templates stores standard documents (categories: Invoices, Prescription, Session Notes, Consent forms, Patient Intake form, General). Templates come from Word or HTML; placeholders are detected and mapped to CRM fields; each template is offered on chosen record types (Client, Process, Appointment, Invoice) to tenants in scope.
- Decision needed: tag syntax and category list (see G13-Q-32).

## 2. Feature Requests

### F-1: Template Library & Builder
#### 1. What it does
Lists templates by record type with category, industry and location filters; a drawer creates or edits them.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Templates Table | Data Table | Name, Entity, Category, Scope, Fillable Fields (placeholders found) | |
| F-1.2: Template Drawer | Drawer | Template Name*, Scope, Category* (or new), source Import Word Doc / Import WebForm / Use Template Builder, HTML + live preview, Select Fields, Extracted Fillable Fields with mapped CRM field, Template Users, Auto-Numbering | Placeholders `{field}`, `{{field}}`, `«field»`, `[Field]` |
| F-1.3: Configure Scope & Entities | Modal | Scope rules and record-type availability | |
| F-1.4: Row Actions | Menu | Configure · Edit · Duplicate · Delete (confirm) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Referral letter | Imports a .docx with `{client_name}`, maps it | **Tenants in scope generate the letter with values filled and Word formatting kept** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinical Content Lead | When standardising paperwork, I want Word templates with mapped fields. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Name and content are required. |
| F-1-2 | Placeholders are detected on every change and auto-mapped by name. |
| F-1-3 | No record types = all four; no scope rules = all tenants; client generation respects scope. |
| F-1-4 | Templates, Template Users and Auto-Numbering settings are saved permanently; a deleted template stays deleted. |

### Not yet built
- Version and Status; formatting toolbar; admin PDF preview; warning for unfilled tags.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Template Library & Builder | F-1.1–F-1.4 | Word/HTML templates with mapped placeholders and scope. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinical Content Lead | Let tenants generate standard documents. | F-1 |
<!-- end -->

<!-- paste → content/admin/sidebar-config.md -->
| Product | ADMIN |
| Module | SIDEBAR-CONFIG |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Sidebar | Each organization's sidebar uses the best-matching template, updated live | — |

## 1. Module Summary
- **Sidebar Navigation Templates** defines default client sidebar layouts: sections, items (visible / hidden, featured), pinned workflows and Scope Rules. "Standard Organization Baseline" is the fallback.

## 2. Feature Requests

### F-1: Sidebar Template Studio
#### 1. What it does
Lists templates and opens Config Studio / Live Preview to edit layout.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Templates Table | Data Table | Name, Scope, Sections, Pinned Workflows, Items (total / visible) | |
| F-1.2: Config Studio | Drag Tree | Drag sections and items (also across sections); visibility, featured; add / rename / remove sections; add items and pinned workflows; Active flag; default start page | Paths unique within a template |
| F-1.3: Scope Rules | Modal | Industry category, industries, locations | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dental layout | Template scoped to Dental, hides Claims, pins "Recall" | **Dental organizations' sidebars update** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Architect | When serving several verticals, I want industry-specific sidebars. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Match score: industry +30, category +20, location +20; unconstrained rule 0.1; baseline 0. |
| F-1-2 | Changes apply live; a user's own customised layout on the same template is kept. |
| F-1-3 | Name required; delete asks for confirmation; the baseline cannot be deleted. |

### Not yet built
- Visibility per plan tier; role-based item filtering; configurable admin sidebar (see G13-Q-31).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Sidebar Template Studio | F-1.1–F-1.3 | Scoped client sidebar layouts. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Architect | Tailor navigation per vertical. | F-1 |
<!-- end -->

<!-- paste → content/admin/ai-voices-models.md -->
| Product | ADMIN |
| Module | AI-VOICES-MODELS |
| Status | Draft — as built |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Settings → AI Voices & Models | Only admin-active models and voices are offered; tenants enable their own | [View in Client](/client/settings/voices) |
| Client | Process call / chatbot settings, AI Receptionist | Voice and model pickers use the admin-active list | — |

## 1. Module Summary
- AI Voices & Models is the global switchboard of AI models (seeded 7) and voices (seeded 24: OpenAI, ElevenLabs, Cartesia). Active items become available to tenants.

## 2. Feature Requests

### F-1: Model & Voice Activation
#### 1. What it does
Two filterable card grids with an on/off switch per item and voice preview.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: AI Models | Card Grid | Provider, name, context window, switch | Decision needed: source of context window and latency (see G13-Q-28) |
| F-1.2: AI Voices | Card Grid | Preview, name – role, provider · language · accent · gender · tone, switch | Bulk activate / deactivate |
| F-1.3: Counters | Labels | Active / total for models and voices | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Offer "Aria" | Switches it on | **Tenants see Aria in Settings, process call settings and the AI Receptionist** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Infrastructure Lead | When approving AI providers, I want to control what tenants can pick. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Switching saves immediately. |
| F-1-2 | Decision needed: what tenants get when no model or no voice is active (see G13-Q-17). |

### Not yet built
- Endpoint table (latency, fallback order, error rate); failover; token meter; API keys / base URLs / rate limits; provider audio samples.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Model & Voice Activation | F-1.1–F-1.3 | Global on/off for AI models and voices. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Infrastructure Lead | Offer only vetted AI options. | F-1 |
<!-- end -->

<!-- paste → NEW content/admin/products-services.md -->
| Product | ADMIN |
| Module | PRODUCTS-SERVICES |
| Status | Draft — as built |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Services | Decision needed: how active admin services reach tenant catalogues (see G13-Q-13) | [View in Client](/client/services) |

## 1. Module Summary
- Product / Services Catalog keeps master services with CPT / service code, price, currency, tax, duration, slot duration, optional deposit, Admin Scope and an Active flag (14 seeded).

## 2. Feature Requests

### F-1: Master Service Catalogue
#### 1. What it does
Lists services with category, industry and status filters; drawer to add or edit.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Services Table | Data Table | Product / Service (+CPT), Category, Duration, Price, Tax, Admin Scope, Status | |
| F-1.2: Service Drawer | Drawer | Service Name*, CPT code, Description, Currency, Price, Tax %, Duration, Slot Duration, Upfront Payment (100% or fixed deposit), Scope Rules, Permissions, Publish as Active Template | Defaults: General, 100 USD, 45 min |
| F-1.3: Row Actions | Menu | Edit · Duplicate · Delete (confirm; system services protected) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Add "Root Canal" | CPT, $450, 60 min, $100 deposit, scope Dental | **Service is in the admin catalogue for dental tenants** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Catalogue Manager | When standardising offerings, I want master services with codes and prices. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Service Name is required; while Duration equals Slot Duration, changing one changes both. |
| F-1-2 | Scope is required or explicitly "All". |

### Not yet built
- Provisioning active services to tenants (see G13-Q-13).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Master Service Catalogue | F-1.1–F-1.3 | Scoped master services with pricing and deposits. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Catalogue Manager | Give tenants a correct starting catalogue. | F-1 |
<!-- end -->

<!-- paste → NEW content/admin/workflows.md -->
| Product | ADMIN |
| Module | WORKFLOWS |
| Status | Draft — as built |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Workflows / Process | Tenants in scope use these workflows and stages | [View in Client](/client/workflows) |
| Admin | Automations | Stage automations also appear in Automations | [View Automations](/admin/automations) |
| Admin | AI Voices & Models | Call settings use admin-active voices and models | — |

## 1. Module Summary
- Workflows designs pipelines for Processes, Appointments, Invoices, Insurance, Claims and Tasks: stages (In Progress / Won / Lost), per-stage AI behaviour, calling, chatbot, client portal and stage automations; tenant visibility follows Scope Rules.
- Decision needed: do admin edits change live tenant workflows or publish a template version? (see G13-Q-12)

## 2. Feature Requests

### F-1: Workflow & Stage Designer
#### 1. What it does
Two-panel designer: workflows and draggable stages on the left; workflow or stage settings on the right.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Add Workflow | Modal | Process Name*, Process Description*, Entity Type, Scope, Permissions | Default stages per entity |
| F-1.2: Stages | Inline / Modals | Add (before Won/Lost), edit, drag to reorder, delete (confirm) | Predefined stages cannot be deleted |
| F-1.3: Stage settings | Panel | Action (Client Reach Out To Us / Reach Out To The Client / No Action / Handle By Human), when to move, call trigger, chatbot, portal, AI Prompt | |
| F-1.4: Workflow settings | Panel | Products & Services, Knowledge Base, Calling, Chatbot, Client Portal & AI Receptionist, Temporary Disable | |
| F-1.5: Stage automations | Tab | Add / edit / toggle / delete | |
| F-1.6: Preview & Test | Drawers | Client-style preview; chat simulator | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Add "Insurance Verify" | Adds stage, Action "Handle By Human" | **Tenants in scope see the stage** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinical Operations Lead | When improving a care journey, I want to design it centrally. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Name and description required to add a workflow. |
| F-1-2 | Every stage delete asks for confirmation and respects predefined stages. |
| F-1-3 | Workflows of every entity type, including Claims, are saved. |
| F-1-4 | Decision needed: meaning of the "Hide" permission (see G13-Q-14). |

### Not yet built
- Deleting a workflow; draft / publish / versioning (see G13-Q-12).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Workflow & Stage Designer | F-1.1–F-1.6 | Central design of tenant pipelines and stage AI. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinical Operations Lead | Roll out best-practice journeys. | F-1 |
<!-- end -->

<!-- paste → NEW content/admin/automations.md -->
| Product | ADMIN |
| Module | AUTOMATIONS |
| Status | Draft — as built |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Automation | Admin rules in scope are listed for tenants, within the permissions set here | [View in Client](/client/automation) |

## 1. Module Summary
- Automations holds global trigger → action rules (and stage automations from Workflows), scoped by industry and location. Rules are Active or Paused.

## 2. Feature Requests

### F-1: Global Automation Rules
#### 1. What it does
Lists admin rules with filters and All / Active / Paused chips; create opens the flow builder.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Rules Table | Data Table | Rule Name, Trigger Event, Admin Scope, Status, Last Run (time of last execution) | |
| F-1.2: Create Rule | Modal → Builder | Rule Name*, Description, Scope, Permissions | Invalid targets and loops rejected |
| F-1.3: Row Actions | Menu | Configure Scope · View / Edit · Delete (confirm) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | No-show follow-up | Creates a rule, scope Healthcare | **Healthcare tenants see it in Automation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinical Operations Lead | When a rule applies everywhere, I want to publish it once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Rule Name required; a builder draft saves as Paused. |
| F-1-2 | Tenants can change admin rules only as the rule's permissions allow. |

### Not yet built
- Duplicate, import, export.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Global Automation Rules | F-1.1–F-1.3 | Scoped platform-wide automation rules. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinical Operations Lead | Publish shared rules once. | F-1 |
<!-- end -->

<!-- paste → NEW content/admin/forms.md -->
| Product | ADMIN |
| Module | FORMS |
| Status | Draft — as built |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Web Forms; patient forms | Live forms and flows in scope are available, respecting allowed roles and permissions | [View in Client](/client/web-forms) |

## 1. Module Summary
- Forms manages form templates (built in the Form Builder) and Form Flows. Forms are Live or Draft and carry scope, allowed roles and permissions.

## 2. Feature Requests

### F-1: Form Templates
#### 1. What it does
Lists forms with category, industry, location and status filters; create opens the Form Builder.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Forms Table | Data Table | Template Name, Scope, Fields, Status, Created / Updated | |
| F-1.2: Row Actions | Menu | Edit in Form Builder · Scope & Permissions · Duplicate · Toggle Live / Draft · Delete (confirm) | |
| F-1.3: Scope & Permissions | Modal | Allowed Roles (Admin, Manager, Reception, Staff / Provider, Client / Public); Can View / Edit / Share / Delete | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | "Dental Intake" | Creates, builds, sets Live | **Dental tenants see it in Web Forms** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinical Content Lead | When standardising intake, I want shared form templates. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | New forms start as Draft. |
| F-1-2 | A deleted form stays deleted (see G13-Q-33). |

### F-2: Form Flows
#### 1. What it does
Ordered sequences of forms with required steps.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Flows Table | Data Table | Flow Name (+ steps), Category, Status (Live / Draft), Created | |
| F-2.2: Step Editor | Editor | Add, mark required, reorder, remove steps | A form once per flow |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New-patient packet | Adds three forms in order | **Flow shows "3 Steps"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinical Content Lead | When patients need several forms, I want a sequence. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Deleting a flow asks for confirmation. |

### Not yet built
- Import, export, versioning.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Form Templates | F-1.1–F-1.3 | Scoped, permissioned form templates. |
| F-2 | Form Flows | F-2.1, F-2.2 | Ordered form sequences. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinical Content Lead | Standardise intake. | F-1 |
| 2 | Clinical Content Lead | Sequence forms for patients. | F-2 |
<!-- end -->

<!-- paste → NEW content/admin/knowledge-base.md -->
| Product | ADMIN |
| Module | KNOWLEDGE-BASE |
| Status | Draft — as built |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Knowledge Base / AI agents | Decision needed: how admin knowledge items reach tenants (see G13-Q-13) | [View in Client](/client/knowledge-base) |

## 1. Module Summary
- Knowledge Base Templates keeps master items (Text/FAQ, File, URL) with tags, applicable workflows/stages, Admin Scope and an Active flag.

## 2. Feature Requests

### F-1: Knowledge Templates
#### 1. What it does
Lists items with category, industry, type and location filters; drawer to create or edit.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Items Table | Data Table | Name / Question, Type, Applicable Workflows, Admin Scope, Tags, Status, Created | |
| F-1.2: Item Drawer | Drawer | Name*, Tags, Applicable Processes* (All or workflows/stages from the Workflows screen), Type, content / file / URL, Scope, Publish as Active | File required for File type |
| F-1.3: Row Actions | Menu | Edit · Duplicate · Delete (confirm) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | HIPAA FAQ | Creates a Text item tagged Compliance | **Item is available for workflows in scope** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Content Lead | When AI agents need shared facts, I want master knowledge items. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Name and Applicable Processes are required. |

### Not yet built
- Delivery to tenants and AI agents (see G13-Q-13).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Knowledge Templates | F-1.1–F-1.3 | Scoped master knowledge for AI agents. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Content Lead | Keep AI answers consistent. | F-1 |
<!-- end -->

<!-- paste → NEW content/admin/billing.md -->
| Product | ADMIN |
| Module | BILLING |
| Status | Draft — as built |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Settings → Billing | Plan changes and credit allocations made here show in the tenant's Billing | [View in Client](/client/settings/billing) |
| Admin | Audit Logs | Billing actions are audited | [View Audit Logs](/admin/settings/logs) |

## 1. Module Summary
- Three billing screens: **Workspace Billing** (plan and credits per organization), **Orders** (purchase ledger) and **Subscriptions** (recurring subscriptions).
- Decision needed: one canonical subscription dataset and how tenant purchases create orders (see G13-Q-10).

## 2. Feature Requests

### F-1: Workspace Billing
#### 1. What it does
Per-organization plan, price and credits with Change Plan and + Credits.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: KPI cards | Stat Cards | Total Workspaces = number of organizations; Active Subscriptions = organizations with an Active subscription (coverage % = active ÷ total); Total Available Credits = sum of remaining credits; Estimated MRR = sum of subscription amounts with yearly ÷ 12 | Decision needed: currency normalisation for MRR and the "All connected" subtext (see G13-Q-26) |
| F-1.2: Workspaces Table | Data Table | Workspace, Category & Scope, Plan, Billing & Price, Credits Balance (red < 20%, amber < 50%), Status (real subscription status), Actions | |
| F-1.3: Change Plan | Modal | Active, non-staff plans in the organization's scope + Monthly / Annual | Carries over add-on credits, used credits, extra seats |
| F-1.4: + Credits | Modal | Allocate a credit pack | Allocated credits survive later plan changes |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Goodwill credits | Allocates 1,000 credits and confirms | **Tenant balance rises by 1,000; audit entry created** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Billing Admin | When a deal changes, I want to switch plans or add credits. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Change Plan and + Credits ask for confirmation and are audited. |
| F-1-2 | The organization's assigned plan and its subscription always agree after a change. |

### F-2: Orders
#### 1. What it does
Cross-tenant orders with settlement actions and export.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: KPI capsules | Stat Cards | Total Orders = count; Settled Amount = sum of Paid; Pending Orders = count Pending; Refunded = sum of Refunded | |
| F-2.2: Orders Table | Data Table | Order ID, Date, Org ID, Organization, Type, Items, Amount, Payment, Payment Method | Filters type / payment / order status |
| F-2.3: Actions | Menu / Drawer | Mark as Paid (confirm) · Issue Refund (reason) · Cancel Order (reason) · line items and settlement timeline | Audited |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Bank transfer received | Marks the order Paid | **Paid / Completed; timeline and Audit Logs updated** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Billing Admin | When reconciling, I want to settle, refund or cancel orders. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Refund only for Paid orders. Decision needed: may a Paid order be cancelled without refund? (see G13-Q-10) |

### F-3: Subscriptions
#### 1. What it does
Recurring subscriptions with plan change, bonus credits, trial extension, pause, resume and cancel.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: KPI capsules | Stat Cards | Active, Trials Running, Past Due (counts); Total MRR; Renewal Rate | Decision needed: define formula for Renewal Rate (see G13-Q-25) |
| F-3.2: Subscriptions Table | Data Table | Org ID, Organization, Plan, Cycle, Status, MRR, Credits Usage, Renewal / Trial End | |
| F-3.3: Actions | Menu / Modals | Change Plan (from the Plans catalogue) · Add Bonus Credits · Extend Free Trial (1–90 days) · Pause (confirm) · Cancel (confirm) | Audited |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Trial needs time | Extends by 14 days | **Trial end and renewal move 14 days** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Billing Admin | When a subscription needs attention, I want to adjust it in place. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Bonus credits are a whole number above 0. |

### Not yet built
- Resume for paused subscriptions; partial refunds; orders created from tenant purchases (see G13-Q-10).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Workspace Billing | F-1.1–F-1.4 | Plan and credit control per organization. |
| F-2 | Orders | F-2.1–F-2.3 | Purchase ledger and reconciliation. |
| F-3 | Subscriptions | F-3.1–F-3.3 | Recurring subscription management. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Billing Admin | Adjust plans and credits. | F-1 |
| 2 | Billing Admin | Reconcile payments. | F-2 |
| 3 | Billing Admin | Manage subscriptions. | F-3 |
<!-- end -->

<!-- paste → NEW content/admin/product-analytics.md -->
| Product | ADMIN |
| Module | PRODUCT-ANALYTICS |
| Status | Draft — as built |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Call Logs, Workflows, Invoices | Decision needed: analytics should read tenant call, workflow and invoice data (see G13-Q-20) | — |

## 1. Module Summary
- Product Analytics has five pages: Voice Calls (in the sidebar), Overview, Organization Usage, Process Movement, Revenue & Invoices. Filters (organization, date range, search) apply to every number on a page.

## 2. Feature Requests

### F-1: Voice Calls Analytics
#### 1. What it does
Cross-organization call outcomes, duration and direction with drill-down.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: KPI cards | Stat Cards | Completed, Incomplete, Failed = sums across filtered organizations; % of total = count ÷ total calls; Avg Call Duration | Decision needed: define formula for Avg Call Duration, Incomplete and trend deltas (see G13-Q-21) |
| F-1.2: Calls by Organization | Bar Chart | Inbound / Outbound per org; sort; top 10; click to filter | |
| F-1.3: Call Distribution | Donut | Outcome shares = count ÷ total | |
| F-1.4: Inbound vs Outbound Over Time | Area Chart | Calls per day / week in the selected range | Decision needed: data source (see G13-Q-21) |
| F-1.5: Organization Breakdown | Data Table | Totals, outcomes, avg duration, completion rate = completed ÷ total | |
| F-1.6: Filters & Export | Controls | Search, organization, date range (7 / 30 / 90 days / custom dates), Reset, CSV | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | One clinic | Clicks its bar | **All figures recalculate for that organization** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Support Lead | When call quality drops, I want outcomes by organization. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Completed + Incomplete + Failed = Total; Inbound + Outbound = Total. |
| F-1-2 | The same metric shows the same value on every analytics page. |

### F-2: Overview, Organization Usage, Process Movement, Revenue & Invoices
#### 1. What it does
Platform summary and drill-down pages.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Overview | Dashboard | Organizations, Active Agents, Calls Processed, Automations, Net MRR, Resolution; volume chart; subsystem health; top workspaces ranked by 30-day usage | Decision needed: define formula for each KPI (see G13-Q-20) |
| F-2.2: Organization Usage | Table + Drawer | Users, Numbers, Calls (30d), Storage, Tasks/Mo, AI Accuracy, Status; search, status filter, export | Decision needed: define formulas and storage quota (see G13-Q-22) |
| F-2.3: Process Movement | Funnel | Workflow KPIs, stage funnel, bottlenecks | Decision needed: define formulas and bottleneck rule (see G13-Q-23) |
| F-2.4: Revenue & Invoices | Dashboard + Table | MRR, ARR, settled, open, overdue, tier mix, MRR trend; recent invoices | Decision needed: define formulas (see G13-Q-24) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Trial usage | Filters Organization Usage to Trial and exports | **CSV of trial organizations' usage** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Leadership | When reviewing the platform, I want usage and revenue in one place. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Each page exports its current table to CSV. |

### Not yet built
- Calculated figures for Overview, Usage, Process Movement and Revenue; sidebar entries for those four pages.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Voice Calls Analytics | F-1.1–F-1.6 | Call outcomes by organization. |
| F-2 | Platform dashboards | F-2.1–F-2.4 | Overview, usage, process and revenue views. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Support Lead | Spot failing clinics. | F-1 |
| 2 | Leadership | Track platform growth. | F-2 |
<!-- end -->

<!-- paste → NEW content/admin/telephony.md -->
| Product | ADMIN |
| Module | TELEPHONY |
| Status | Draft — as built |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Settings → Integrations, AI Receptionist | Decision needed: assigned numbers and carriers shown to tenants (see G13-Q-15) | [View in Client](/client/settings/integrations) |
| Admin | Audit Logs | Every telephony change is audited | [View Audit Logs](/admin/settings/logs) |

## 1. Module Summary
- Telephony has **Providers** (Twilio, Exotel, Plivo, Telnyx with LiveKit and Dograh SIP credentials and subscription due date) and **Numbers** (inventory and assignment to organizations).

## 2. Feature Requests

### F-1: Providers
#### 1. What it does
Provider cards with SIP credentials, reveal / copy, due-date warning; add, configure, test and remove providers.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Provider Card | Card | Name, numbers in use, due-date pill (grey; amber ≤ 7 days; red overdue), LiveKit and Dograh username / secret | Decision needed: define "numbers in use" (see G13-Q-27) |
| F-1.2: Reveal / Copy | Buttons | Reveal secret (audited as a secret reveal) and copy | |
| F-1.3: Add / Configure Provider | Drawer | Carrier (unique), LiveKit / Dograh credentials, due date | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Renewal close | Sees amber "Due in 5d" | **Admin renews in time** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Telecom Manager | When managing carriers, I want credentials and renewals in one place. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Revealing a secret writes an audit entry. |

### F-2: Numbers
#### 1. What it does
Inventory with filters, assignment, target countries, release, add and export.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Numbers Table | Data Table | Number, Country, Provider, Org ID, Organization, Target Countries | Filters provider, organization (incl. Unassigned), country |
| F-2.2: Actions | Menu / Modals | Assign Organization · Edit Target Countries (at least one) · Release Number (confirm) | |
| F-2.3: Add Phone Number | Drawer | Number (valid E.164, unique)*, carrier, country, type, target countries | Starts Unassigned |
| F-2.4: Export | Button | CSV of filtered numbers | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New clinic line | Adds and assigns a number | **Shows the clinic and In Use; audited** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Support Specialist | When a clinic needs a line, I want to assign one from inventory. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Assignment records the organization's real Org ID. |

### Not yet built
- Connection test; unassign; cross-org call log (see G13-Q-15).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Providers | F-1.1–F-1.3 | Carrier credentials and renewals. |
| F-2 | Numbers | F-2.1–F-2.4 | Number inventory and assignment. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Telecom Manager | Keep carriers running. | F-1 |
| 2 | Support Specialist | Give clinics phone lines. | F-2 |
<!-- end -->

<!-- paste → NEW content/admin/audit-logs.md -->
| Product | ADMIN |
| Module | AUDIT-LOGS |
| Status | Draft — as built |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | User Management, Telephony, Orders, Subscriptions | These screens write entries | — |
| Client | Settings → Audit Logs | Decision needed: tenants see only their own organization's entries (see G13-Q-03) | [View in Client](/client/settings/audit-logs) |

## 1. Module Summary
- Audit Logs is a read-only record of admin changes (actor, action, module, target, summary, IP) with a before/after view. Decision needed: which actions must be logged (see G13-Q-16).

## 2. Feature Requests

### F-1: Audit Log Viewer
#### 1. What it does
Search, filter, view details and export.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Log Table | Data Table | Timestamp, Actor (signed-in staff member), Action, Module, Target Entity, Summary, IP (request IP) | Filters module, every action type, actor, time |
| F-1.2: Event Drawer | Drawer | Summary, actor, target, network context, before/after diff, navigate to module | |
| F-1.3: Export | Button | CSV of filtered entries | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Who refunded? | Filters Orders / Refunded | **Entry shows actor, time and before/after** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Compliance Officer | When auditing, I want proof of who changed what. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Entries are stored exactly as written and cannot be edited or deleted. |

### Not yet built
- Logging for organizations, plans, templates, role templates and sign-ins (see G13-Q-16).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Audit Log Viewer | F-1.1–F-1.3 | Immutable record of admin changes. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Compliance Officer | Prove who changed what. | F-1 |
<!-- end -->

---

## E. Prototype defects
Severity: **Critical** = security exposure or data loss on a core flow; **High** = wrong data / broken core flow or cross-module break; **Medium** = misleading data or broken secondary flow; **Low** = cosmetic, dead code or minor validation. Paths are relative to `src/`.

| ID | What's wrong | File:line | Severity | Related C row |
| :--- | :--- | :--- | :--- | :--- |
| G13-E-01 | Org ID = list length + 1, so IDs repeat after a delete; email and name are not checked for duplicates | app/pages/Organizations.tsx:837-838 | Medium | G13-ORG-14 |
| G13-E-02 | [SECURITY] The full Organizations page (suspend, delete, re-plan any organization) is mounted at client route `/organizations` with no role check | app/routes.tsx:245; app/pages/Organizations.tsx:24-80 | Critical | G13-ORG-16 |
| G13-E-03 | [SECURITY] A SystemAdmin's role can be changed and there is no guard for the last SystemAdmin | app/pages/admin/AdminUserManagement.tsx:517-525 | High | G13-USR-08 |
| G13-E-04 | Suspend Access acts without confirmation | AdminUserManagement.tsx:297-326 | Low | G13-USR-10 |
| G13-E-05 | [SECURITY] The signed-in role comes from browser storage and defaults to SystemAdmin; admin user records are not linked to sign-in | app/context/AuthContext.tsx:28,43 | Critical | G13-USR-17 |
| G13-E-06 | No duplicate checks on admin emails, admin role names or tenant role names | AdminUserManagement.tsx:230-240,605-607; app/pages/admin/AdminRolesPermissions.tsx:664-703 | Low | G13-USR-18, G13-ROLE-13 |
| G13-E-07 | Deleting an admin role does not reassign its users | AdminUserManagement.tsx:637-641 | Medium | G13-USR-19 |
| G13-E-08 | Scope option labelled "Role" stores department-level scope | AdminRolesPermissions.tsx:1201-1204; lib/adminRolesStore.ts:16 | Low | G13-ROLE-04 |
| G13-E-09 | Deleting a tenant role or department has no confirmation | AdminRolesPermissions.tsx:721-729,866-872 | Medium | G13-ROLE-12 |
| G13-E-10 | "Permitted Scope" shows a fixed label ("Global (Full Access)" / "Custom Matrix Assigned") rather than a summary of the matrix | AdminRolesPermissions.tsx:773 | Low | G13-ROLE-15 |
| G13-E-11 | [SECURITY] Team-member drawer reads a legacy delete flag that new or edited role templates never set | app/components/TeamMemberDrawer.tsx:222-232 | Medium | G13-ROLE-16 |
| G13-E-12 | Tier lists disagree: "Custom" exists in data but cannot be chosen or filtered; "Scale" silently becomes "Professional" | lib/plansBillingStore.ts:13,1386-1393; app/pages/admin/AdminPlans.tsx:2147-2150 | Medium | G13-PLAN-08 |
| G13-E-13 | Plan Templates tab industry filter is hardcoded to four industries | AdminPlans.tsx:2453-2543 | Low | G13-PLAN-13 |
| G13-E-14 | Deleted plans, "Delete All" and deleted categories come back on next load (re-seeding); plan delete does not check subscribed workspaces | plansBillingStore.ts:1379-1425,1484-1488; AdminPlans.tsx:593-598,1620-1635 | High | G13-PLAN-15, G13-PCAT-08 |
| G13-E-15 | Plan status filter exists in logic but has no control | AdminPlans.tsx:188,324-327 | Low | G13-PLAN-16 |
| G13-E-16 | Base rates save and show a toast on every keystroke; invalid input silently saves defaults | AdminPlans.tsx:956-965,1736-1738,1899-1901 | Medium | G13-PRC-10 |
| G13-E-17 | Credit pack "Internal / Staff Only" flag has no control in the drawer | plansBillingStore.ts:200; AdminPlans.tsx:2670-2848 | Low | G13-PRC-11 |
| G13-E-18 | Seeded India packs store INR amounts under a "USD $" label | plansBillingStore.ts:946-961; AdminPlans.tsx:2716 | Medium | G13-PRC-12 |
| G13-E-19 | Stored per-credit price is copied from the base rate, not recomputed from pack price | AdminPlans.tsx:731,810-814 | Low | G13-PRC-14 |
| G13-E-20 | "Category used by plans" check uses fuzzy name matching ("EHR" matches "AI EHR") | plansBillingStore.ts:147-157 | Low | G13-PCAT-07 |
| G13-E-21 | Industries edits are kept in page memory only and lost on reload; onboarding, org forms and scope pickers read fixed seed lists | app/pages/admin/AdminIndustries.tsx:58-59; data/industryReferenceData.ts:263-274 | High | G13-IND-08 |
| G13-E-22 | Industry↔category link is by name; rename / move / delete leaves stale chips | AdminIndustries.tsx:175-189,292 | Medium | G13-IND-09 |
| G13-E-23 | Deleting a category leaves its industries pointing at it | AdminIndustries.tsx:295 | Medium | G13-ICAT-07 |
| G13-E-24 | Field keys are not checked for uniqueness; a symbol-only name gives an empty key; clashing custom keys are hidden | app/pages/admin/components/AdminFieldDrawer.tsx:1994; app/context/FieldRegistryContext.tsx:3172-3204 | Medium | G13-CF-04 |
| G13-E-25 | Edits to system fields and system sections open in an editable drawer but are silently discarded | FieldRegistryContext.tsx:3152-3168,3239-3247,3422-3430 | High | G13-CF-15, G13-CS-10 |
| G13-E-26 | Table delete (modal, no toast) and drawer delete (browser confirm, toast) differ; drawer delete toasts success on system fields where nothing happens | app/pages/admin/AdminCustomFields.tsx:364-372; AdminFieldDrawer.tsx:6204-6212 | Medium | G13-CF-16 |
| G13-E-27 | "Required Fields" preset types "required" into search instead of filtering on the Required flag | AdminCustomFields.tsx:457 | Low | G13-CF-17 |
| G13-E-28 | No success message on field / section create or update | AdminFieldDrawer.tsx:2093-2262; AdminSectionDrawer.tsx:565-616 | Low | G13-CF-20 |
| G13-E-29 | "Advance List 2" cannot be chosen for new fields | AdminFieldDrawer.tsx:4454,5076-5156 | Low | G13-CF-21 |
| G13-E-30 | Document template delete has no confirmation and the 10 seed templates reappear after deletion | app/pages/admin/AdminDocumentTemplates.tsx:164-167; lib/documentTemplatesStore.ts:555-557 | High | G13-DOC-13 |
| G13-E-31 | [SECURITY] Templates live in tab session storage, shared by admin and tenant screens (lost when the tab closes; no tenant separation) | documentTemplatesStore.ts:552-617 | High | G13-DOC-14 |
| G13-E-32 | Template Users and Auto-Numbering settings are not saved | app/components/profile/AddDocumentTemplateDrawer.tsx:803-816,1741 | Medium | G13-DOC-15 |
| G13-E-33 | Client document generation ignores admin scope rules (automations apply them) | app/components/profile/GenerateDocumentDrawer.tsx:862-888 | Medium | G13-DOC-16 |
| G13-E-34 | [SECURITY] Admin Control "Permissions" checkboxes are not wired (always ticked, clicks do nothing) on Document Templates, Product/Services and Automations; Services "Add Field" links only toast | AdminDocumentTemplates.tsx:509-518; app/pages/admin/AdminProductsServices.tsx:1140,1331,1343-1350; app/pages/admin/AdminAutomations.tsx:807-815,857-865; app/pages/admin/components/AdminControlAccordion.tsx:150-155 | Medium | G13-DOC-17, G13-SVC-08, G13-AUTO-08 |
| G13-E-35 | Template drawer title reads "Add Document Template" when editing | AddDocumentTemplateDrawer.tsx:829 | Low | G13-DOC-18 |
| G13-E-36 | Sidebar template delete has no confirmation | app/pages/admin/AdminSidebarConfig.tsx:205-216 | Medium | G13-SB-10 |
| G13-E-37 | Template Active flag and default start page cannot be set | app/pages/admin/components/SidebarTemplateDrawer.tsx:390-398 | Low | G13-SB-12 |
| G13-E-38 | My AI Receptionist uses its own hardcoded voice and library, ignoring admin activation | app/pages/MyAIReceptionist.tsx:51-56,2811 | Medium | G13-AI-15 |
| G13-E-39 | Bulk activate / deactivate logic has no button | app/pages/admin/AdminAIVoicesModels.tsx:226-238 | Low | G13-AI-16 |
| G13-E-40 | Service delete has no confirmation; system services can be deleted | AdminProductsServices.tsx:804-808 | Medium | G13-SVC-04 |
| G13-E-41 | A service saved with no scope silently becomes Healthcare / General Physician | AdminProductsServices.tsx:728-730 | Low | G13-SVC-07 |
| G13-E-42 | Status filter offered but no status column | AdminProductsServices.tsx:811-884 | Low | G13-SVC-09 |
| G13-E-43 | Admin services never reach tenants (separate store) although the toggle says active templates are provisioned | AdminProductsServices.tsx:65,1360-1363; lib/servicesStore.ts:6 | High | G13-SVC-11 |
| G13-E-44 | Left-panel stage delete removes the stage immediately, with no confirmation and no predefined-stage check | app/pages/admin/AdminProcessTemplates.tsx:3445-3453 | High | G13-WF-03 |
| G13-E-45 | Delete-workflow handler exists but nothing calls it | AdminProcessTemplates.tsx:2798-2806 | Medium | G13-WF-04 |
| G13-E-46 | Claims workflows are dropped every time workflows are saved | lib/useProcessStore.ts:1562-1580 | Critical | G13-WF-08 |
| G13-E-47 | "Temporary Disable" toggle is not saved | AdminProcessTemplates.tsx:1369,3566-3573 | Medium | G13-WF-09 |
| G13-E-48 | [SECURITY] Client hides a workflow when the admin "Hide" box is unchecked, opposite to the tooltip | app/pages/Process.tsx:1161; AdminControlAccordion.tsx:160 | Medium | G13-WF-10 |
| G13-E-49 | Seven modals and a step card are unreachable; scope modal permission checkboxes are not connected | AdminProcessTemplates.tsx:716,5813,5904,5990,6119,6246,6540,6853,7221-7230 | Low | G13-WF-12 |
| G13-E-50 | "Last Run" is never recorded, so it always shows "—" | AdminAutomations.tsx:339-352 | Low | G13-AUTO-06 |
| G13-E-51 | [SECURITY] Tenants can toggle and delete admin (global) automation rules | app/pages/Automation.tsx:213,261 | High | G13-AUTO-07 |
| G13-E-52 | Form template delete has no confirmation | app/pages/admin/AdminFormTemplates.tsx:333-336 | Medium | G13-FORM-03 |
| G13-E-53 | Live / Draft status not visible in the forms table | AdminFormTemplates.tsx:379-431 | Low | G13-FORM-06 |
| G13-E-54 | Deleting every form brings the seed forms back | data/forms.ts:221 | Low | G13-FORM-07 |
| G13-E-55 | [SECURITY] Client Web Forms ignore form scope, allowed roles and permissions | app/pages/WebForms.tsx:803-845 | High | G13-FORM-09 |
| G13-E-56 | Row action "Edit in Flow Builder" opens the Form Builder | AdminFormTemplates.tsx:433-459 | Low | G13-FORM-11 |
| G13-E-57 | Knowledge item delete has no confirmation; system items not protected | app/pages/admin/AdminKnowledgeBase.tsx:918-922 | Medium | G13-KB-03 |
| G13-E-58 | Saving a File item without a file stores placeholder "new_document.pdf, 1.0 MB" | AdminKnowledgeBase.tsx:880-881 | Medium | G13-KB-04 |
| G13-E-59 | Applicable workflows come from a hardcoded list of 14, not the Workflows screen | AdminKnowledgeBase.tsx:76-240 | Medium | G13-KB-05 |
| G13-E-60 | Active flag is saved but not shown or used; Applicable Processes marked required but not checked | AdminKnowledgeBase.tsx:843-848,1592 | Low | G13-KB-06 |
| G13-E-61 | Admin knowledge items never reach tenants or AI agents (separate store) | app/pages/KnowledgeBase.tsx:1179-1200 | High | G13-KB-08 |
| G13-E-62 | Estimated MRR adds amounts in different currencies and shows them as "$" | app/pages/admin/AdminBilling.tsx:91-100,260 | Medium | G13-BILL-02 |
| G13-E-63 | Change Plan lists inactive and staff-only plans, ignores scope, and does not update the organization's assigned plan, so the tenant side can silently revert it | AdminBilling.tsx:496-501; plansBillingStore.ts:1747-1754 | High | G13-BILL-05 |
| G13-E-64 | Allocated credit packs do not increase the add-on credit counter, so they are lost on the next plan change | plansBillingStore.ts:1939-1966 | High | G13-BILL-07 |
| G13-E-65 | Status column always shows "Active"; organizations without a subscription show a fake "Global Starter $49, 380/500" row | AdminBilling.tsx:322-338,434-437 | High | G13-BILL-08 |
| G13-E-66 | [SECURITY] Workspace billing changes have no confirmation and write no audit entry | AdminBilling.tsx:138-203 | Medium | G13-BILL-09 |
| G13-E-67 | Cancelling a Paid order leaves it Paid without a refund | lib/ordersBillingStore.ts:557-596 | Medium | G13-ORD-06 |
| G13-E-68 | Tenant purchases (plans, packs, seats) never create Orders; the ledger is seed data only | ordersBillingStore.ts:88,94-222 | High | G13-ORD-08 |
| G13-E-69 | Order amounts always shown as "$"; order detail status pill always green | app/pages/admin/AdminOrders.tsx:334-363,458-463 | Low | G13-ORD-09 |
| G13-E-70 | Renewal Rate is a synthetic number (96.4 − 1.6 × past due − 2.2 × cancelled, clamped 88–99.5) presented as retention | app/pages/admin/AdminSubscriptions.tsx:104-107 | Medium | G13-SUB-03 |
| G13-E-71 | Subscription Change Plan uses three hardcoded plans instead of the Plans catalogue | AdminSubscriptions.tsx:51-55 | High | G13-SUB-04 |
| G13-E-72 | Trial extension 1–90 day limit not enforced | AdminSubscriptions.tsx:153-156 | Low | G13-SUB-07 |
| G13-E-73 | [SECURITY] Cancel is audited as "deleted"; paused subscriptions cannot be resumed | ordersBillingStore.ts:672-702; AdminSubscriptions.tsx:309-347 | Low | G13-SUB-09 |
| G13-E-74 | Admin Subscriptions use a separate dataset (different statuses) from workspace subscriptions used by Workspace Billing and tenants | ordersBillingStore.ts:19,89; plansBillingStore.ts:270,325 | High | G13-SUB-11 |
| G13-E-75 | Total MRR is computed but never displayed | AdminSubscriptions.tsx:96-98 | Low | G13-SUB-12 |
| G13-E-76 | Date-range / organization filters and the search box change nothing on Overview, Process Movement and Revenue & Invoices | app/pages/admin/AdminAnalyticsOverview.tsx:41,77; AdminAnalyticsProcessMovement.tsx:37-38; AdminAnalyticsRevenueInvoices.tsx:38 | Medium | G13-AN-04, G13-AN-25, G13-AN-30 |
| G13-E-77 | "Ranked" top workspaces are not sorted; status pill always green | AdminAnalyticsOverview.tsx:327,346-349 | Low | G13-AN-05 |
| G13-E-78 | Figures disagree across pages (Calls 34,890 on Overview vs 35,290 on Calls; organization names and codes differ; CSV labels differ from cards) | lib/productAnalyticsStore.ts:46-57; lib/callsAnalyticsService.ts:75-328; AdminAnalyticsOverview.tsx:43-58 | Medium | G13-AN-07 |
| G13-E-79 | Avg Call Duration averages all calls while its tooltip and footer say successful calls only | callsAnalyticsService.ts:331-335,442,452; app/pages/admin/AdminAnalyticsCalls.tsx:517 | Medium | G13-AN-10 |
| G13-E-80 | Donut "Incomplete" segment is smaller than the Incomplete card for the same filter | callsAnalyticsService.ts:458-501 | Low | G13-AN-12 |
| G13-E-81 | Custom date range is ignored (always half of the 30-day figures) | callsAnalyticsService.ts:344-345,544-545 | Medium | G13-AN-15 |
| G13-E-82 | Loading and error UI coded but never triggered; two export buttons do the same thing | AdminAnalyticsCalls.tsx:86-87,277,286,378-392 | Low | G13-AN-17 |
| G13-E-83 | Org Usage drawer status pill always green; no Suspended option in status filter | app/pages/admin/AdminAnalyticsOrgUsage.tsx:246-249 | Low | G13-AN-22 |
| G13-E-84 | Overall Completion (83.6%) contradicts the funnel (~60.8%); a bottleneck stage is not in the funnel; every organization shows ORG-0001 | productAnalyticsStore.ts:142,203; AdminAnalyticsProcessMovement.tsx:76-86 | Low | G13-AN-26 |
| G13-E-85 | Revenue cards do not match the invoice table; tier MRRs sum to $5,852 vs $12,840 and percentages don't follow amounts | productAnalyticsStore.ts:320-334; ordersBillingStore.ts:310-397 | Medium | G13-AN-29 |
| G13-E-86 | [SECURITY] Secret reveal is logged with action "login"; hiding is not logged | lib/telephonyAdminStore.ts:1010-1025 | Low | G13-TEL-03 |
| G13-E-87 | No duplicate-carrier, duplicate-number or E.164 format checks | app/pages/admin/AdminTelephony.tsx:306-309; telephonyAdminStore.ts:931-976 | Low | G13-TEL-05 |
| G13-E-88 | Configure provider drawer cannot be opened; no delete or connection test | AdminTelephony.tsx:135-158,784-901 | Medium | G13-TEL-06 |
| G13-E-89 | Numbers export double-quotes some cells | AdminTelephony.tsx:339,343-344 | Low | G13-TEL-09 |
| G13-E-90 | Assignment always saves Org code "ORG-0001"; organization filter cannot match seeded numbers (ID mismatch) | AdminTelephony.tsx:244-265,280 | Medium | G13-TEL-11 |
| G13-E-91 | [SECURITY] Releasing a number is recorded as "Suspended" in history and "deleted" in the audit log | telephonyAdminStore.ts:751-794 | Low | G13-TEL-13 |
| G13-E-92 | "N numbers in use" is a stored count, never recalculated | telephonyAdminStore.ts:453,947 | Medium | G13-TEL-16 |
| G13-E-93 | Cross-org call log page is unreachable; `/admin/telephony/calls` redirects to Providers | app/routes.tsx:98,325 | Medium | G13-TEL-17 |
| G13-E-94 | [SECURITY] Audit store rewrites every "suspended" entry to "deleted" with a new summary on each read | lib/auditLogsStore.ts:276-284 | High | G13-AUD-03 |
| G13-E-95 | [SECURITY] Audit actor hardcoded to "Alexander Vance / SystemAdmin"; IP defaults to "192.168.1.145" | auditLogsStore.ts:321; lib/adminRolesStore.ts:234-237; ordersBillingStore.ts:498-501 | High | G13-AUD-04 |
| G13-E-96 | [SECURITY] Client Settings → Audit Logs renders the platform-wide admin log (other organizations' names, staff emails, IPs) | app/pages/Settings.tsx:23,7763-7764 | Critical | G13-AUD-06 |
| G13-E-97 | Audit action filter omits Suspended, Reactivated, Export and Refunded | app/pages/admin/AdminAuditLogs.tsx:314-323 | Low | G13-AUD-07 |
| G13-E-98 | [SECURITY] All `/admin` routes only check that a user is signed in | app/components/auth/ProtectedRoute.tsx:4-11; app/routes.tsx:215,278-281 | Critical | G13-X-02 |
| G13-E-99 | [SECURITY] A role name not found in the admin role list is allowed to see every screen | adminRolesStore.ts:194,211 | High | G13-X-03 |
| G13-E-100 | [SECURITY] Action-level permission check is never called, so read-only roles (e.g. SupportSpecialist on providers) can change data | adminRolesStore.ts:130,202-218 | High | G13-X-04, G13-TEL-19 |
| G13-E-101 | [SECURITY] Seeded roles grant analytics permission keys that match no module | adminRolesStore.ts:50,117-118,157 | Low | G13-X-07 |
| G13-E-102 | Dead code: unrouted Phone Numbers, Call Logs, Telephony Providers and Security pages; unused Role Studio modal and Process Template store | app/routes.tsx:97-99; app/pages/admin/AdminSecurity.tsx:5; app/pages/admin/components/RoleStudioModal.tsx; app/context/ProcessTemplateContext.tsx:67-83 | Low | G13-X-08 |
| G13-E-103 | Logo links to Workflows while `/admin` index renders Sections & Fields | app/components/layout/AdminLayout.tsx:94; app/routes.tsx:282 | Low | G13-X-10 |

**Severity count:** Critical 5 · High 21 · Medium 37 · Low 40 · **Total 103** · [SECURITY] 20.

---

## Open questions for PM
| ID | Question | Related items |
| :--- | :--- | :--- |
| G13-Q-01 | The admin PRD files describe features that do not exist (SSO, impersonation, failover, rate cards, terminology). Replace them with section D, or keep them as roadmap marked "Not yet built"? | All D blocks |
| G13-Q-02 | Should admin-role permissions block direct URL access and individual actions, not just hide sidebar items? What happens to an unknown role? | G13-X-01, G13-E-98, G13-E-99, G13-E-100, G13-TEL-19 |
| G13-Q-03 | Confirm tenants must never see `/organizations` or other organizations' audit entries. Is the owner invite emailed or copied by staff? | G13-ORG-16/17, G13-ORG-07, G13-AUD-06, G13-E-02, G13-E-96 |
| G13-Q-04 | How does an admin user record link to sign-in identity, and what is the default role when none is known? | G13-USR-17, G13-E-05 |
| G13-Q-05 | Two role systems: confirm names ("Admin roles" vs "Tenant role templates"), which one `admin/roles.md` covers, and how templates are applied and enforced in tenant workspaces. | G13-ROLE-01–09, G13-USR-13, G13-E-11 |
| G13-Q-06 | Pick one tier vocabulary (PRD Starter/Growth/Enterprise; UI Free/Starter/Growth/Professional; data Custom/Scale). | G13-PLAN-07, G13-E-12 |
| G13-Q-07 | Should plan modules/features/seats gate tenant features? Do plan edits reach existing subscribers? Can a plan with subscribers be deleted? | G13-PLAN-03/04/15/17, G13-E-14 |
| G13-Q-08 | Monthly credit renewal rule, and what happens when a tenant runs out of credits. | G13-PLAN-06, G13-CACT-07/08 |
| G13-Q-09 | Currency model for packs, base rates and MRR totals. | G13-PRC-12, G13-BILL-02, G13-E-18, G13-E-62 |
| G13-Q-10 | Which subscription dataset is canonical? Must tenant purchases create Orders? May a Paid order be cancelled without refund? | G13-SUB-05/11, G13-ORD-06/08, G13-E-63, G13-E-67, G13-E-68, G13-E-74 |
| G13-Q-11 | Is Industries the master for onboarding and scope pickers? What happens to industries when a category is deleted? Are terminology overrides and presets still wanted? | G13-IND-02/03/11, G13-E-21, G13-E-23 |
| G13-Q-12 | Should admins edit a published template (draft/version) instead of live tenant workflows? Should workflows be deletable? | G13-WF-07, G13-WF-13, G13-E-45 |
| G13-Q-13 | Should admin Product/Services and Knowledge Base items be provisioned to tenants (on onboarding, via plan templates, or on demand)? | G13-SVC-12, G13-KB-09, G13-E-43, G13-E-61 |
| G13-Q-14 | Admin Control "Hide": does ticked mean "tenants may hide" (tooltip) or "visible to tenants"? | G13-WF-10, G13-E-48, G13-X-06 |
| G13-Q-15 | Should admin numbers and carriers appear in client Integrations and the AI Receptionist? Should the cross-org call log return? | G13-TEL-18, G13-E-93 |
| G13-Q-16 | Which admin actions must be audited (organizations, plans, templates, role templates, sign-ins, exports)? | G13-AUD-05, G13-ORG-18, G13-ROLE-14, G13-PLAN-21, G13-E-94, G13-E-95 |
| G13-Q-17 | What do tenants get when no model or no voice is active (today: first model / all voices)? | G13-AI-11 |
| G13-Q-18 | Should field keys be editable? Can system fields and sections be edited? | G13-CF-03, G13-E-24, G13-E-25 |
| G13-Q-19 | Should client Settings and Reports be reachable inside the admin shell (`/admin/settings`, `/admin/reports`, `/admin/campaigns`)? | G13-X-09 |
| G13-Q-20 | Define formulas and data sources for Overview: Organizations, Active Agents, Calls Processed, Automations, Net MRR, Resolution, volume chart, subsystem health, ranking. | G13-AN-01–03, G13-E-78 |
| G13-Q-21 | Define Avg Call Duration (all vs answered), Incomplete (with or without No answer/Busy/Cancelled), trend-delta period, and the time-series source. | G13-AN-10–13, G13-E-79–81 |
| G13-Q-22 | Define Organization Usage metrics (users, numbers, calls, storage, tasks, AI accuracy) and the storage quota. | G13-AN-19/20, G13-ORG-09 |
| G13-Q-23 | Define Process Movement metrics and the bottleneck rule (e.g. dwell threshold). | G13-AN-23/24, G13-E-84 |
| G13-Q-24 | Define Revenue metrics: MRR, ARR, settled, collection rate, open, overdue, tier mix, growth. | G13-AN-28, G13-E-85 |
| G13-Q-25 | Define the Subscriptions Renewal Rate formula. | G13-SUB-02, G13-E-70 |
| G13-Q-26 | Define the Workspace Billing "All connected" subtext and MRR currency normalisation. | G13-BILL-03, G13-E-62 |
| G13-Q-27 | Define "numbers in use" per provider (assigned only, or all owned)? | G13-TEL-15, G13-E-92 |
| G13-Q-28 | Where do model context window and latency come from, and should latency be shown? | G13-AI-13 |
| G13-Q-29 | What should "Permitted Scope" summarise for a role template? | G13-ROLE-15, G13-E-10 |
| G13-Q-30 | Adopt one rule: every destructive admin action asks for confirmation? Remove dead pages? | G13-E-04, G13-E-09, G13-E-30, G13-E-36, G13-E-40, G13-E-44, G13-E-52, G13-E-57, G13-E-102 |
| G13-Q-31 | Are sidebar visibility by plan tier and by role still wanted? Should the admin sidebar be configurable? | G13-SB-03/04/13 |
| G13-Q-32 | Document tag syntax (dotted `{{patient.name}}` vs `{client_name}`) and category list. | G13-DOC-02, G13-DOC-05 |
| G13-Q-33 | Should deleting seeded plans, categories, forms or templates be permanent? | G13-E-14, G13-E-30, G13-E-54 |

