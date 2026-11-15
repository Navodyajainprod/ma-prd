---
title: "Roles and access: what is checked, as built"
product: "reference"
module: "reference"
channel: "roles-and-access"
status: "In Review"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | REFERENCE |
| Module | ROLES AND ACCESS |
| Status | In Review |
| Last updated | 2026-11-14 |

## 1. How to read this page

This page says which roles exist in the prototype and what each screen actually checks. The short version is that the prototype has no working role model. One role check exists in the clinic app: the Settings guard, which lets only the role **SystemAdmin** through. Everything else is decorative, unused, or only hides menu items.

Where a fact is not re-checked in code, it is marked unverified and names the module report it came from.

The words used in the check column:

| Word | Meaning |
| :--- | :--- |
| Open | No check beyond being signed in. |
| Visible in menu, then blocked | The menu item shows for every role. Clicking it as a non-SystemAdmin role shows a message and returns to the home page. |
| Enforced | The code blocks navigation or the action. |

## 2. How the active role is set

- The active role is read from browser storage (`user_role`). If it is missing, the role is **SystemAdmin**.
- Login accepts any email and password. It writes the stored role, or SystemAdmin if none.
- Nothing in the app changes the role. The function that sets it is never called. The role changes only if someone edits browser storage by hand.
- Unverified (from the Prototype-only module report): everyone who signs up or accepts an invite is treated as SystemAdmin. An invite for an existing email signs in as SystemAdmin without a password.
- The admin portal reads the same role. There is no separate admin sign-in.
- The role type accepts any text, so any role name is valid.

Decision needed: D-11, D-12, D-45.

## 3. The roles that exist

There are three unrelated sets of role names, plus the patient and the kiosk visitor.

| Role set | Names | Where it comes from | Does anything read it? |
| :--- | :--- | :--- | :--- |
| Sign-in role (the one the guard reads) | SystemAdmin, Admin, Manager, Agent, Reception, or any text | Login and browser storage | Only the Settings guard (equals SystemAdmin) and an unused menu filter |
| Admin-portal role templates (platform staff) | SystemAdmin (locked), Admin, BillingAdmin, SupportSpecialist, ReadonlyAuditor, Clinical Operations Lead, and custom roles. Actions read, write, delete, import, export with scope all, department, own or deny. | Admin roles store in the browser | Only to show or hide admin sidebar items. The action permissions are never checked. An unknown role name sees every admin item. |
| Tenant role templates (clinic staff) | Drawer defaults Admin, Manager, Executive. Add-user list Admin, Manager, Specialist, Reception, Sales, Agent. Sample team roles Admin, Ophthalmologist, Senior Surgeon, Physician. | Roles and Add user drawers, team store | No. The permission checks have no callers. Roles are kept in session storage. |
| Patient (Companion) | One role, the patient. No caregiver or family role. | Active patient id in browser storage, falling back to the first client | No guard exists |
| Anonymous kiosk visitor | No sign-in. Identity is phone and code, a mock face match, or none for My Visit. | The `/reception` routes sit outside the sign-in check | No |

Names such as Medical Assistant, Receptionist and Physician appear only in earlier PRD text and in hard-coded name matching. They are not enforced roles.

The menu filter by role is unused. The Settings entries are marked for SystemAdmin only in a navigation file that nothing imports. The sidebar that people see is built from a user-configurable menu where Settings items are visible for everyone.

## 4. What each screen checks

For the clinic app, every signed-in role is treated the same except for Settings. Roles Admin, Manager, Agent, Reception and any other tenant template behave identically.

| Area | Routes | Check as built | Notes |
| :--- | :--- | :--- | :--- |
| Overview and Reports | `/`, `/reports` | Open | Revenue reports included. Also mounted under `/admin/reports` and `/admin/campaigns`. |
| Clients | `/clients` | Open | Delete, bulk delete, import and export of the whole database are open to any signed-in user. |
| Call Logs and Scribe | `/call-logs`, `/scribe` | Open | Any user sees patient data, picks any doctor and can mark notes Attested or Verified. |
| Chats | `/chats` | Open | All threads are visible. The current user is fixed as user 1. |
| Process Kanban and Tasks | `/deals`, `/tasks` | Open | Any user can edit or delete others' tasks. Delete rights depend on the creator's display name containing admin. |
| Appointments | `/appointments` | Open | A provider-only view exists in code but is a fixed internal value. |
| Services, Invoices, Claims | `/services`, `/invoices`, `/claims` | Open | No role check on price edits, void, write-off, record payment or claim submit. |
| Workflows, Automation, Web Forms | `/process`, `/automation`, `/web-forms` | Open | A per-form permissions object is not enforced. |
| Knowledge Base | `/knowledge-base` | Open | The Knowledge Base row in the roles drawer is not enforced. |
| AI Receptionist settings and all other Settings tabs | `/settings`, `/settings/:tab`, `/settings/team/:id`, `/billing` | Visible in menu, then blocked on click (SettingsGuard) | Only the exact text SystemAdmin passes. Every other role is sent to the home page. |
| Kiosk | `/reception` and sub-routes | Open (no sign-in) | Any browser with the URL. The organisation comes from a query value, else the last saved organisation. |
| Companion | `/patient/*` | Open (no guard at all) | The URL `/patient/id` switches identity. Code login accepts any code. A Switch Patient (Dev) control is shown. |
| Super Admin | `/admin/*` | Open to any signed-in user | The admin layout reads the role but never blocks. Admin-role names only hide sidebar items. |
| Public pages | `/login`, `/verify`, `/signup`, `/invite/:token`, `/payment`, `/onboarding`, `/pricing` | Open | Login accepts any email and password and any 6 digits. |
| Not signed in | All clinic routes | Enforced | Redirect to `/login`. This is the one sign-in check. |

Decision needed: D-12, D-16, D-17, D-18, D-19, D-20.

## 5. Routes outside the Settings guard

These routes sit inside the clinic shell but outside the Settings guard. Any signed-in role can open them.

- `/organizations` opens the full Organizations page. It can suspend, delete and re-plan any organisation (G13-E-02).
- `/users` opens a client user manager with permissions and credits, and a separate sample user list (G10-E-09).
- `/payments` and `/transactions` show billing data (G10-E-26).
- `/admin/settings` renders the clinic Settings pages outside the Settings guard, and `/admin/settings/logs` shows the audit log.
- `/roles` redirects to `/settings/team?tab=roles`, so the Settings guard applies after the redirect.
- `/profile`, `/guide` and `/refer-and-earn` are open and show the user's own profile or help.

Inside Super Admin, any signed-in user can open `/admin/roles` and edit roles, and can change a SystemAdmin's role with no last-SystemAdmin guard (G13-E-03, unverified, from the Super Admin module report). The Admin Control checkboxes on Document Templates, Products and Services, and Automations are not wired (G13-E-34).

Decision needed: D-05, D-12, D-43.

## 6. Sensitive actions with no control

Every action below is open to any signed-in user. Kiosk and portal actions are open to any visitor.

| Action | Where | Control today |
| :--- | :--- | :--- |
| Delete or bulk delete contacts | Clients | None (G2-E-09) |
| Export the whole contact database | Clients | None, and no audit entry |
| Import contacts | Clients | None |
| View recordings and transcripts | Call Logs | None (G3-E-33) |
| Delete Scribe sessions | Scribe | None, no confirm (G3-E-23) |
| Sign a note as Attested, file a Verified prescription | Scribe | None (G3-E-21) |
| Read every chat thread | Chats | None (G4-Q-19) |
| Edit or delete other users' tasks | Tasks | Name matching only (G5-E-17) |
| Cancel any provider's appointment | Appointments | None (G6-E-28) |
| Change catalogue prices | Services | None (G7-S-25) |
| Void an invoice, or drag it to Paid without payment | Invoices | None, no confirm |
| Write off an invoice (stored as a cash payment) | Invoices | None (G7-E-18) |
| Record a payment | Invoices | None |
| Create or submit a claim ("Submit Electronically" always succeeds) | Claims | None |
| Edit AI prompts, delete stages and rules, publish forms | Workflows, Automation, Web Forms | None (G8-E-07) |
| Delete Knowledge Base sources | Knowledge Base | None (G9-E-02) |
| Invite, edit or remove team members, change roles | Settings, Team | Settings guard only |
| Suspend, delete or re-plan an organisation | `/organizations`, `/admin/organizations` | None (G13-E-02) |
| Edit roles and permissions | `/admin/roles` | None |
| Workspace billing and plan changes | `/admin/billing`, `/admin/plans` | None, no confirm |
| Export or clear the audit log | Settings, `/admin/logs` | None (G10-E-17, G10-E-18) |
| Mark an invoice paid with no proof | Kiosk, Companion | None (G11-E-16, G12-E-20) |
| Change sign-in phone, email or password | Companion profile | None (G12-E-08) |
| Sign a prescription | Scribe | None (G3-E-22) |

Decision needed: D-13, D-14, D-15, D-33, D-63, D-66.

## 7. What the earlier PRD said about roles

- The earlier PRD names personas in jobs-to-be-done tables, not a role system. For most modules it is silent on who may do what.
- The only enforcement rule is on the admin Roles page: users lacking a permission have buttons hidden and endpoints blocked, and exporting patient data needs a second sign-in (MFA). Neither is built.
- The Team page lists roles Admin, Doctor, Nurse, Coordinator, Billing, and says a module set to deny means users cannot open or act. The build uses Admin, Manager, Specialist, Reception, Sales, Agent and Executive. There is no mapping between the two lists.
- The AI Receptionist settings personas are Practice Manager, Ops Lead and Front-Desk Supervisor. In the build those settings are SystemAdmin only, so those personas would be locked out.
- Single sign-on, session revocation, impersonation and MFA re-sign-in for export are described in the earlier PRD and are not built.

## 8. Open decisions

| ID | Decision | Where it shows |
| :--- | :--- | :--- |
| D-11 | Source of truth for role names and the role model, including admin roles versus tenant templates and the default role | Sections 2 and 3 |
| D-12 | Whether permissions must block direct URLs and each action, what an unknown role gets, and who may open `/admin/*` | Sections 4 and 5 |
| D-13 | Which roles may delete, import and export clients, and whether exports are audited | Section 6 |
| D-14 | Which roles may play recordings, read transcripts, run Scribe and issue prescriptions | Section 6 |
| D-15 | Which roles may manage the catalogue, void, write off, record payments and submit claims | Section 6 |
| D-16 | Who may edit Knowledge Base sources, and whether Admin and Manager reach AI Receptionist settings | Section 4 |
| D-17 | Which roles may edit workflows, automations and forms | Section 4 |
| D-18 | Which roles may view all inbox threads and edit chat settings | Section 4 |
| D-19 | Which roles may open Reports and the Overview | Section 4 |
| D-20 | Which roles may see other providers' appointments, book for others and cancel | Section 4 |
| D-21 | Who may delete tasks | Section 6 |
| D-33 | Deleting call logs and Scribe sessions: who, and with what audit | Section 6 |
| D-42 | Which events must be audited | Section 6 |
| D-43 | Whether the clinic audit log shows only its own organisation, and keeping `/organizations` away from clinics | Section 5 |
| D-45 | The staff sign-in model | Section 2 |
| D-46 | The patient and visitor sign-in model | Section 4 |
| D-05 | Which routes are kept or retired, such as `/payments`, `/transactions` and `/users` | Section 5 |
| D-02 | Whether PRD pages for unbuilt features (SSO, impersonation, MFA) are kept as a marked roadmap | Section 7 |

## 9. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
