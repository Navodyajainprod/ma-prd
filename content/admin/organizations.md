---
title: "Organizations: Tenant Directory, Invite and Plan Control"
product: "admin"
module: "organizations"
route: "/admin/organizations"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | ORGANIZATIONS |
| Route | `/admin/organizations` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A platform list of tenant organisations with search, an AI Provider filter and CSV export. A four-step **Add Organization** drawer sends an invite. A row menu assigns, upgrades or removes a plan, suspends or reactivates, or deletes. |
| **Who uses it** | Platform Admin (invites, re-plans, suspends and deletes tenants). No role is checked on the page. The same page with every action is also open to tenants at `/organizations`. |
| **Where you start it** | **Organizations** in the admin sidebar (`/admin/organizations`). The admin sidebar shows it only to roles that can read the Organizations module. |
| **Where the result goes** | The organisation store that drives sign-in (suspended organisations are refused), invite acceptance, onboarding, the workspace plan subscription behind Client Settings Billing, and the client sidebar template choice. |
| **How real is it** | 1 feature works, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Organization settings) | Organisation record and sign-in | The same organisation store drives sign-in, invite acceptance, signup and onboarding. A suspended organisation sees "This organization has been suspended. Please contact support." at sign-in. | [View Organization](/client/settings/organization) |
| Client (Billing) | Plan assignment | Assigning a plan copies its price, seats and credits into the workspace subscription that Client Settings Billing reads. Later plan edits do not flow to it. | [View Billing](/client/settings/billing) |
| Client (Sidebar) | Template choice | The organisation's industry, category and location decide which sidebar template the client sees. | [View Sidebar Templates](/admin/sidebar-config) |
| Client (all pages) | Tenant access to this page | Not blocked. A tenant can open `/organizations` and suspend, delete or re-plan any organisation (G13-E-02). | [View Organization](/client/settings/organization) |
| Admin (Plans) | Plan catalogue | The plan step and the Assign Plan drawer list the plans defined in Plans and Credits. | [View Plans](/admin/plans/plans) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Organizations** and sees every tenant, newest first. He presses **Add Organization**, types the clinic's email and website, and the drawer guesses the name from the domain. In step 2 he fills in the country, industry, a location and a first service. In step 3 he picks a plan from six category tabs. Step 4 shows a review. He presses send, waits a moment and a toast says "Invite sent". He copies the invite link and pastes it into his own email, because nothing is emailed. Later a clinic stops paying. Leo opens the row menu, chooses **Suspend** and confirms. The clinic's staff are now refused at sign-in. The page keeps no record of either action.

### What is real and what is not

- **Real in the prototype:** the directory with search and the AI Provider filter, CSV export, the four-step invite drawer with its validation, assign, upgrade and remove plan, suspend and reactivate with the sign-in block, and delete with a confirmation.
- **Simulated:** the invite itself. Sending waits 600 ms, creates the organisation as "Invite sent" and stores a token. No email goes out. The Org ID is the list length plus one, so it can repeat after a delete.
- **Not built:** slug and tenant URL, subscription and user count columns, storage usage, a status filter with Trial, tenant impersonation, editing organisation details, audit entries and any block that keeps tenants off this page.

**Security note:** the page has no role logic and tenants can reach it. Suspensions and deletions leave no audit entry.

### Journey position

```
Add Organization ─▶ Invite sent ─▶ Invite accepted ─▶ Onboarding ─┬▶ Active ─▶ Plan / Suspend / Delete
                                                                   └▶ Workspace subscription (Billing)
```

## 2. Feature Requests

### F-1: Organization directory

#### 1. What it does
Leo opens `/admin/organizations`. The header reads **Organizations**. A toolbar holds a search box, an **AI Provider** filter (All, LiveKit, Dograh), **Export** and **Add Organization**. The table shows one row per organisation, newest first. He searches by name, email or Org ID. A tenant-free list shows "No organizations found matching your search."

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Organization table | Table | Actions, Org ID, Name, Email, Industry (shows the specialty), AI Provider, Created, Status | ● Works | |
| F-1.2: Search | Search box | Matches name, email and Org ID | ● Works | |
| F-1.3: AI Provider filter | Filter | All, LiveKit or Dograh | ● Works | |
| F-1.4: Export | Button | Downloads a CSV of Org ID, Name, Email, Industry, AI Provider, Created Date, Status. The toast shows the filtered row count | ● Works | |
| F-1.5: Empty state | State | "No organizations found matching your search." | ● Works | |
| F-1.6: Loading and error states | State | None exist. The only spinner is on the invite button | ○ Not built | All data is browser-local |
| F-1.7: Status filter (Active, Trial, Suspended) | Filter | Described in the earlier PRD | ○ Not built | Only the AI Provider filter exists and no Trial status exists |
| F-1.8: Slug, Subscription and Users Count columns | Table | Described in the earlier PRD | ○ Not built | The table has none of them |
| F-1.9: Storage usage per tenant | Metric | Described in the earlier PRD | ○ Not built | No storage figure or quota exists |
| F-1.10: Edit organization details | Action | No edit control exists | ○ Not built | |

#### 3. Worked example
Leo looks for one clinic.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A clinic owner asks for help | Types the owner's email in the search box | **Only the matching organisation is listed** |
| 2 | He wants the list for finance | Presses **Export** | **A CSV downloads and a toast shows how many rows it holds** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When a clinic asks for support, I want to find its organisation quickly, so that I can act on the right account. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** several organisations, **then** the table lists them newest first with Org ID, Name, Email, Industry, AI Provider, Created and Status. |
| F-1-2 | **Given** text in the search box, **then** only organisations whose name, email or Org ID match are shown. |
| F-1-3 | **Given** no match, **then** the empty message is shown. |
| F-1-4 | **Given** the page, **then** there is no status filter and no Slug, Subscription or Users Count column. |

### F-2: Add Organization (invite)

#### 1. What it does
Leo presses **Add Organization** and a four-step drawer opens. Step 1 asks for the organisation email and the website. Step 2 is **Information**. Step 3 is **Plan**. Step 4 is **Review & Send**. Sending waits 600 ms and shows "Invite sent to the email!" with a **Copy Link** button for the invite link. Closing with data entered asks "Discard Unsaved Changes?".

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Step 1, email and website | Form | The email is format-checked and the website is required. The name is guessed from the domain | ● Works | |
| F-2.2: Step 2, Information | Form | Name, country, industry, primary service and category, locations with operating days and hours, products and services, workspace setup (team size, call volume, countries, AI provider) and knowledge-base uploads | ● Works | Name, first location and first service are required. Primary requirements are saved from hardcoded defaults |
| F-2.3: Step 3, Plan | Picker | Pick a plan from six category tabs: AI Receptionist, AI Scribe, EHR, RCM, Internal, Onboarding | ● Works | |
| F-2.4: Review & Send | Button | Creates the organisation as "Invite sent", assigns the plan subscription and stores an invite token | ◐ Simulated | Waits 600 ms. No email is sent. The link is copied by hand (G13-ORG-07). Decision needed: D-43 |
| F-2.5: Discard guard | Modal | "Discard Unsaved Changes?" when closing with data | ● Works | |
| F-2.6: Org ID | Rule | List length plus one | ◐ Simulated | The ID can repeat after a delete. Email and name are not checked for duplicates (G13-E-01) |
| F-2.7: Custom slug and tenant URL | Field | Described in the earlier PRD | ○ Not built | No slug exists |
| F-2.8: Owner activation email | Email | Described in the earlier PRD | ○ Not built | No email is dispatched |
| F-2.9: Isolated tenant records at provisioning | Rule | Described in the earlier PRD | ○ Not built | One browser-local store holds all organisations |

#### 3. Worked example
Leo invites a new clinic.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The drawer opens on step 1 | Enters the email and website | **The name is guessed from the domain** |
| 2 | He picks a plan in step 3 and reviews | Presses send | **A toast says the invite was sent and offers Copy Link. No email goes out** |
| 3 | He changes his mind midway | Closes the drawer | **A discard prompt appears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When onboarding a new clinic customer, I want to provision the workspace and plan in one flow, so that the practice is ready quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** step 1, **when** the email is badly formed or the website is empty, **then** the user cannot continue. |
| F-2-2 | **Given** step 2, **when** the name, first location or first service is empty, **then** the user cannot continue. |
| F-2-3 | **Given** send is pressed, **then** an organisation with status "Invite sent", its plan subscription and an invite token are stored. No email is sent. |
| F-2-4 | **Given** an organisation was deleted, **when** a new one is added, **then** its Org ID can equal an existing one. |

### F-3: Plan, suspend and delete

#### 1. What it does
Leo opens a row menu. It holds **Assign plan**, **Upgrade plan** (only when a higher tier exists in the same category), **Remove plan**, **Suspend** or **Reactivate**, and **Delete**. Each asks for a confirmation. Suspending sets the status to Suspended and the organisation is refused at sign-in. Delete says "This action is irreversible".

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Assign or Upgrade plan | Drawer | A plan is required ("Please select a plan to continue"). It saves the subscription and the organisation's plan fields | ● Works | See Plans and Credits for the catalogue |
| F-3.2: Remove plan | Action | After confirmation the organisation reverts to the free plan of its category | ● Works | |
| F-3.3: Suspend and Reactivate | Action | After confirmation the status becomes Suspended or Active. A suspended organisation cannot sign in | ● Works | No audit entry is written (G13-ORG-18). Decision needed: D-42 |
| F-3.4: Delete | Action | After confirmation the row is removed | ● Works | No cascade rule is defined and no audit entry is written |
| F-3.5: Staff-only access | Rule | Only platform staff should reach this page | ○ Not built | A tenant can open `/organizations` and use every action (G13-E-02). Decision needed: D-43 |
| F-3.6: Role control | Rule | The page checks no role | ○ Not built | Decision needed: D-12 |
| F-3.7: Audit entries for organisation actions | Log | Plan, suspend and delete write nothing to the audit log | ○ Not built | Decision needed: D-42 |
| F-3.8: Tenant impersonation and support login | Action | Described in the earlier PRD, audited | ○ Not built | Nothing like it exists |

#### 3. Worked example
Leo suspends a clinic that has stopped paying.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Row menu is open | Chooses **Suspend** and confirms | **Status shows Suspended** |
| 2 | A clinic user tries to sign in | Enters valid details | **The sign-in is refused: "This organization has been suspended. Please contact support."** |
| 3 | A tenant user opens `/organizations` | Chooses **Delete** on any organisation | **The organisation is removed. Nothing blocks the tenant** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When a clinic changes tier or stops paying, I want to change its plan or suspend it, so that access matches its subscription. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** Assign plan, **when** no plan is chosen, **then** a message asks for one and nothing is saved. |
| F-3-2 | **Given** an organisation is suspended, **when** its user signs in, **then** the sign-in is refused with the suspension message. |
| F-3-3 | **Given** Delete is confirmed, **then** the organisation is removed and no audit entry exists. |
| F-3-4 | **Given** a signed-in tenant user, **when** they open `/organizations`, **then** the full page and all actions are available. |

### F-4: Status lifecycle and hand-offs

#### 1. What it does
An organisation moves through **Invite sent**, **Onboarding**, **Active** and **Suspended**. Other screens move it: accepting the invite sets Onboarding and finishing onboarding or payment sets Active. The organisation's plan and place also pick the sidebar template the client sees.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Status lifecycle | Rule | Invite sent, then Onboarding on invite acceptance, then Active. Suspended is set by staff. An unknown status becomes Active | ● Works | |
| F-4.2: Sign-in block | Rule | Suspended organisations are refused at sign-in | ● Works | |
| F-4.3: Workspace subscription | Hand-off | Plan assignment writes the subscription that Client Settings Billing, sign-in and the client sidebar read | ● Works | The price, seats and credits are copied, so later plan edits do not flow |
| F-4.4: Currency | Rule | INR for India, USD for others | ● Works | |
| F-4.5: Sidebar template choice | Hand-off | The organisation's industry, category and location select a template | ● Works | See Sidebar Navigation Templates |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The clinic owner opens the invite link | Accepts the invite | **Status moves to Onboarding, then Active when onboarding finishes** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Platform Admin | After inviting a clinic, I want to see where it is in setup, so that I can chase it if it stalls. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** an invite is accepted, **then** the status becomes Onboarding. |
| F-4-2 | **Given** a stored status that is not recognised, **then** it is treated as Active. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Organization directory | F-1.1 – F-1.10 | ● / ○ | List, search, filter and export work; no status filter or storage figure. |
| F-2 | Add Organization (invite) | F-2.1 – F-2.9 | ● / ◐ / ○ | Four-step drawer works; the invite is not emailed. |
| F-3 | Plan, suspend and delete | F-3.1 – F-3.8 | ● / ○ | Actions work; tenants can reach them and no audit is written. |
| F-4 | Status lifecycle and hand-offs | F-4.1 – F-4.5 | ● Works | Status, sign-in block and subscription hand-offs work. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Find a clinic's organisation quickly | F-1 |
| 2 | Platform Admin | Provision a workspace and plan in one flow | F-2 |
| 3 | Platform Admin | Change a clinic's plan or suspend it | F-3 |
| 4 | Platform Admin | See where a new clinic is in setup | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user at `/admin/organizations` | Everything on the page: invite, re-plan, suspend, delete, export | Nothing. Only the admin sidebar hides the item from admin roles that cannot read the module |
| Any signed-in tenant user at `/organizations` | The same full page and every action (security gap, G13-E-02) | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named a superadmin who provisions tenants and can impersonate them with an audit trail. It said nothing about who else could reach the page. Decision needed: D-12 and D-43.

## 5. Metrics and definitions

No metric is shown on this page. The export toast shows the filtered row count.

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys in the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-12 | Who may open `/admin/*`, must permissions block direct URLs and each action, and what happens to an unknown role? | F-3.6 |
| D-42 | Which admin actions must be audited, including organisation plan, suspend and delete? | F-3.3, F-3.7 |
| D-43 | Must tenants never see `/organizations`, and is the owner invite emailed or copied by staff? | F-2.4, F-3.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
