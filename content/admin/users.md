---
title: "User Management: Admin Users and Admin Roles"
product: "admin"
module: "users"
route: "/admin/settings/users"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | USERS |
| Route | `/admin/settings/users` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A page for Mantra platform staff. A **Users** tab lists admin users with invite, change role, suspend, reset password and remove. A **Roles** tab lists the admin-portal roles and a 21-module permission matrix. |
| **Who uses it** | Platform Admin. No action is checked: any signed-in user who opens the URL can do everything on the page. |
| **Where you start it** | **User Management** under SETTINGS in the admin sidebar (`/admin/settings/users`, also `/admin/users`). The tab is kept in `?tab=`. |
| **Where the result goes** | Browser storage for users and roles, and the admin audit log. The role matrix drives only which admin sidebar items show. Admin users are not linked to sign-in. |
| **How real is it** | 0 features work, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin (Roles and Permissions) | Admin role matrix and sidebar | The admin role matrix hides admin sidebar items the signed-in role cannot read. The module id for Roles is shared with Roles and Permissions, so one permission controls both screens. | [View Roles and Permissions](/admin/roles) |
| Client (Team) | Client team roles | Not connected. Client team roles are a separate system and do not read the admin roles. | [View Team](/client/settings/team) |
| Client (Audit Logs) | Audit entries | Every user and role action writes an entry with a fixed actor. Client Settings Audit Logs shows the platform-wide log. | [View Audit Logs](/client/settings/audit-logs) |
| Client (Security) | Sessions and SSO | Not connected. Revoke All Sessions and SSO exist nowhere on this page. | [View Security](/client/settings/security) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **User Management**. The **Users** tab lists six staff with role, status and last login. He presses **Invite User** and enters a name, an email and a role. The status shows Invited and a toast says the invitation was dispatched. No email goes out. Later he changes a colleague's role and the audit log records the before and after. He switches to **Roles** from the dropdown, duplicates a role and opens its **Module Permissions Matrix**. He sets billing to Read and saves. Nothing on any other screen checks that matrix. He could also change his own role, because the signed-in role comes from browser storage and defaults to SystemAdmin.

### What is real and what is not

- **Real in the prototype:** the user and role tables, invite, change role, suspend and reactivate, reset password, resend invite, remove, role create, edit, duplicate and delete with their protections, CSV export, and audit entries for user and role actions.
- **Simulated:** the invite and password reset send nothing. Audit entries carry a fixed actor, "Alexander Vance / SystemAdmin", not the signed-in user. Admin users are not linked to sign-in.
- **Not built:** MFA enrolled and Active Sessions columns, enterprise SSO, Revoke All Sessions, a last-SystemAdmin guard, duplicate checks and any permission check on actions.

**Security note:** there is no last-SystemAdmin guard, the signed-in role comes from browser storage with a default of SystemAdmin, `/admin/*` checks only that the user is signed in, an unknown role is allowed to see everything, and the matrix is saved but never checked on actions.

### Journey position

```
Invite User ─▶ Invited ─▶ Change role / Suspend ─▶ Audit log
Roles tab ─▶ Module Permissions Matrix ─▶ Admin sidebar visibility only
```

## 2. Feature Requests

### F-1: Admin users

#### 1. What it does
Leo opens the **Users** tab. It lists Administrator, Email, Role, Status, Last Login and Created. He searches and filters by role and status. The row menu offers **Change Role**, **Reset Password**, **Resend Invite** (Invited only), **Suspend Access** (Active, not SystemAdmin), **Reactivate Access** (Suspended) and **Remove Admin** (not SystemAdmin). **Export** downloads a CSV.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: User table | Table | Name, email, role, status (Active, Invited, Suspended), last login, created. Six users are seeded | ● Works | Role is the earlier PRD's Admin Level |
| F-1.2: Invite User | Drawer | Full name, email and role (default Admin) are required. Status is Invited. Toast "Invitation dispatched to the email" | ◐ Simulated | No email is sent and the email is not checked for duplicates (G13-E-06) |
| F-1.3: Change Role | Drawer | Saves the new role and writes an audit entry with before and after | ◐ Simulated | A SystemAdmin can be changed and there is no last-SystemAdmin guard (G13-E-03) |
| F-1.4: Suspend and Reactivate | Action | Changes status at once with an audit entry and a toast | ◐ Simulated | No confirmation (G13-E-04). Decision needed: D-06 |
| F-1.5: Reset Password and Resend Invite | Action | Reset asks for confirmation. Both write an audit entry and a toast | ◐ Simulated | Nothing is sent |
| F-1.6: Remove Admin | Action | A browser confirm "cannot be undone", then the user is removed | ● Works | SystemAdmin users cannot be removed or suspended from the UI |
| F-1.7: Export users | Button | Downloads a CSV | ● Works | Exports are not audited |
| F-1.8: Empty state | State | Shown when no user matches | ● Works | |
| F-1.9: Loading, error and permission states | State | None exist | ○ Not built | |
| F-1.10: MFA Enrolled and Active Sessions columns | Table | Described in the earlier PRD | ○ Not built | Neither column exists |
| F-1.11: Enterprise SSO (SAML or OIDC) | Config | Described in the earlier PRD | ○ Not built | No identity-provider setup exists. Decision needed: D-02 |
| F-1.12: Revoke All Sessions | Emergency action | Described in the earlier PRD | ○ Not built | Not on this page |
| F-1.13: Link to sign-in | Rule | Admin user records are not linked to sign-in | ○ Not built | The signed-in role comes from browser storage and defaults to SystemAdmin (G13-E-05). Decision needed: D-11 |

#### 3. Worked example
Leo brings a new support colleague on board.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Colleague needs access | Presses **Invite User** and enters name, email and role | **The user appears as Invited and a toast says the invitation was dispatched. No email is sent** |
| 2 | Colleague leaves the company | Opens the row menu and chooses **Suspend Access** | **The user is Suspended at once with no confirmation, and an audit entry is written** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When staff join or leave, I want to invite, change or suspend their admin access, so that only the right people reach the admin portal. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** Invite User, **when** name, email or role is empty, **then** the invite is refused. A duplicate email is accepted. |
| F-1-2 | **Given** an Active non-SystemAdmin user, **when** Suspend Access is chosen, **then** the user is Suspended at once with no confirmation. |
| F-1-3 | **Given** a SystemAdmin user, **then** Suspend Access and Remove Admin are not offered. Change Role is offered, even for the last SystemAdmin. |
| F-1-4 | **Given** any user action, **then** an audit entry is written with the fixed actor "Alexander Vance / SystemAdmin". |

### F-2: Admin roles and permission matrix

#### 1. What it does
Leo switches the dropdown to **Roles**. The table shows Role Name (with a lock and a System badge), Description, Users and Created. **Add Role** opens an editor with a **Module Permissions Matrix** of 21 admin modules. Each has permissions (read, write, delete, import, export) and a level (All Records, Role, Own Records, Deny). Choosing Write adds Read and Delete. Six roles are seeded and SystemAdmin is locked.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Role table | Table | Name, description, user count, created. Export downloads a CSV | ● Works | Users is the count of admin users whose role name matches, ignoring case |
| F-2.2: Add and edit role | Drawer | Role Name is required ("Role Name is required"). Every module defaults to Read, All Records | ● Works | Edit is blocked for the locked SystemAdmin role. No name uniqueness check (G13-E-06) |
| F-2.3: Duplicate | Action | Copies a role | ● Works | |
| F-2.4: Delete | Action | Blocked for system roles. A custom role needs a browser confirm | ◐ Simulated | Its users are not reassigned (G13-E-07) |
| F-2.5: Protected roles | Rule | SystemAdmin, Admin, BillingAdmin, SupportSpecialist and ReadonlyAuditor cannot be deleted | ● Works | |
| F-2.6: Permission enforcement | Rule | The matrix drives only which admin sidebar items show | ◐ Simulated | An action-level check exists but is never called. An unknown role is allowed everything (G13-E-99, G13-E-100). Decision needed: D-12 |
| F-2.7: Empty state | State | Shown when no role matches | ● Works | |
| F-2.8: Custom role overrides assigned to tenant users | Role | Described in the earlier PRD | ○ Not built | Admin roles apply to admin users only |

#### 3. Worked example
Leo makes a read-only role for an auditor.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He duplicates ReadonlyAuditor | Edits the copy and sets modules to Read | **The role is saved and appears in the table** |
| 2 | A user with that role signs in elsewhere | Opens an admin URL and presses Save on a page | **The change is saved. Actions are not checked** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When defining platform staff roles, I want fine-grained permissions, so that each person has only the access their job needs. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** Add Role, **when** the name is empty, **then** "Role Name is required" shows. |
| F-2-2 | **Given** a system role, **when** Delete is attempted, **then** it is blocked. A custom role is deleted after a browser confirm and its users keep the old role name. |
| F-2-3 | **Given** a role with Read only, **when** the user opens a page and acts, **then** the action is allowed. Only sidebar items are hidden. |
| F-2-4 | **Given** a role name not in the list, **then** every admin screen is visible. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Admin users | F-1.1 – F-1.13 | ● / ◐ / ○ | Invite and manage work; nothing is sent and no SSO or sessions. |
| F-2 | Admin roles and permission matrix | F-2.1 – F-2.8 | ● / ◐ / ○ | Roles work; the matrix is saved but not enforced. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Invite, change or suspend staff admin access | F-1 |
| 2 | Platform Admin | Define fine-grained roles for platform staff | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open the page by URL and use every action, including changing a SystemAdmin's role | Suspending or removing a SystemAdmin from the row menu |
| Signed-in user with a known admin role | The same, plus sidebar items follow the role matrix (SystemAdmin and Admin see everything) | Seeing sidebar items the role cannot read |
| Signed-in user with an unknown role | Every screen | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The signed-in role comes from browser storage and defaults to SystemAdmin. The earlier PRD named a security officer with SSO and instant session revocation and set no access rule. Decision needed: D-11 and D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Users per role | Roles tab | Count of admin users whose role name equals the role name, ignoring case |

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys in the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-02 | Is the PRD a prototype-only description, and are unbuilt admin features kept as a marked roadmap? | F-1.11 |
| D-06 | Should every destructive admin action ask for confirmation? | F-1.4, F-2.4 |
| D-11 | What is the role model, how does an admin record link to a sign-in identity, and what is the default role? | F-1.13 |
| D-12 | Must permissions block direct URLs and actions, who may open `/admin/*`, and what happens to an unknown role? | F-2.6 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
