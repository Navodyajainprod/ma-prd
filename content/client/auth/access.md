---
title: "Sign-in, Sign-up, Verification, Invite and Route Guards"
product: "client"
module: "auth"
channel: "access"
route: "/login"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | AUTH |
| Route | `/login` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The public front door and the locks inside the app: a sign-in page, a sign-up page, a six-digit verification page, an organisation invite page and the guards on the app shell. Nothing here checks a real credential. |
| **Who uses it** | Practice Admin (signs in and signs up the organisation). An invited organisation owner (accepts the invite). Every signed-in user passes through the guards. No role is checked at sign-in. |
| **Where you start it** | `/login`, `/signup`, `/verify`, an emailed link at `/invite/:token`, or the **Get started** button on `/pricing`. The typo address `/onbaording` also opens onboarding. |
| **Where the result goes** | A session in browser storage, then the payment page, the onboarding wizard or the dashboard. |
| **How real is it** | 0 features work, 4 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Organisation invite and Suspended status | The invite link, the assigned plan and the Suspended status are created in Admin Organizations. Sign-in, verify and the invite page honour Suspended and the assigned plan. | [View Admin Organizations](/admin/organizations) |
| Admin | Plans validated at sign-up | A plan chosen on `/pricing` is checked against the active plans in Admin Plans. An unknown tier falls back to Starter. | [View Admin Plans](/admin/plans/plans) |
| Admin | Platform administration | Every `/admin` page needs only a signed-in user. No role is checked. | [View Admin Roles](/admin/roles) |
| Client (Settings) | Team-member invite | A separate flow with its own PRD. The organisation invite on this page has no link to it. | [View Team](/client/settings/team) |
| Client (Settings) | Settings guard | Only the literal role System Admin opens Settings. Others get a toast and go to the dashboard. | [View Organization](/client/settings/organization) |
| Client (Settings) | Billing | The plan assigned at payment or invite is the one Billing later shows. | [View Billing](/client/settings/billing) |

## 1. Module Summary

### The story in one minute

Rohan Mehta runs a small eye clinic and wants to try MantraAssist. He opens `/signup` and enters the clinic email, website and a password. The page sends him to `/verify` and asks for a six-digit code. He types 123456 and presses submit. The prototype accepts any six digits. Because no payment is pending he lands in the onboarding wizard with his email and website already filled in. The next morning he opens `/login`, types his email and any password, and is signed in as a System Admin. No password was ever stored. Later a colleague types `/admin/organizations` into the address bar and the whole platform admin opens, because the guard only asks whether someone is signed in.

### What is real and what is not

- **Real in the prototype:** the screens and their routing, the Suspended block, the pending-payment redirect, plan carry-over from the pricing page, the paid-plan diversion on an invite, the Settings guard and the redirect of signed-out visitors.
- **Simulated:** all credentials. Any email and password sign in, any six digits verify, no code is sent, the session is browser storage and the role defaults to System Admin. These are security-relevant.
- **Not built:** forgot password, lockout, wrong or expired code, duplicate-email handling, invite expiry, revoke and resend, a role check on `/admin/*`, `/organizations` and `/users`, and a check that onboarding or payment is finished.

### Journey position

```
Pricing ─▶ Sign up ─▶ Verify code ─▶ Payment (if pending) ─▶ Onboarding ─▶ Dashboard
Admin invite ─▶ Invite page ─▶ Payment (paid plan) or setup loader ─▶ Dashboard
```

## 2. Feature Requests

### F-1: Sign in

#### 1. What it does
Rohan opens `/login`. If a session already exists, the page sends him to the dashboard. He enters an email and a password and presses sign in. After a short wait he is in. The page never compares the password with anything. There is no **forgot password** link.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Email and password form | Form | Email is required and format-checked. Password is required. Errors appear as toasts only | ● Works | |
| F-1.2: Sign-in | Action | After a 0.4 second wait the user is marked signed in with a placeholder token. The display name is the text before the at sign | ◐ Simulated | Any email and any password work. The token is fixed text kept in the browser. Security-relevant (G14-E-01). Decision needed: D-45 |
| F-1.3: Role of the session | Rule | The saved role is whatever the browser already holds, and System Admin when nothing is stored | ◐ Simulated | Anyone can set the role in browser storage and enter as System Admin. No screen changes the role. Security-relevant (G14-E-03). Decision needed: D-12 |
| F-1.4: Suspended organisation | State | A stored organisation with that email and status Suspended blocks sign-in with a toast | ● Works | Set in Admin Organizations |
| F-1.5: Pending-payment redirect | Rule | A user with a payment pending goes to `/payment`. Otherwise a "Welcome back" toast and the dashboard | ● Works | |
| F-1.6: Already signed in | Rule | Opening `/login` while signed in goes to the dashboard, or to onboarding if the browser flags a sign-up with no organisation | ● Works | |
| F-1.7: Wrong-credential error, lockout, rate limit | State | No error state exists for wrong credentials | ○ Not built | Decision needed: D-45 |
| F-1.8: Forgot password | Link | No link or reset flow exists | ○ Not built | Decision needed: D-45 |

#### 3. Worked example
Rohan returns to the clinic account.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Opens `/login` | Types his email and a password he made up | **He is signed in and sees "Welcome back". The password is not checked** |
| 2 | Organisation is Suspended in Admin | Tries to sign in | **A toast blocks him** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I return to work, I want to sign in quickly and safely, so that I can continue and patient data stays private. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** any well-formed email and any non-empty password, **when** the user presses sign in, **then** a session is created. Nothing is verified. |
| F-1-2 | **Given** an organisation with that email is Suspended, **when** the user signs in, **then** a toast blocks the sign-in. |
| F-1-3 | **Given** a pending payment, **when** sign-in succeeds, **then** the user goes to `/payment`. |
| F-1-4 | **Given** no stored role, **when** the user signs in, **then** the role is System Admin. |

### F-2: Sign up and verify

#### 1. What it does
Rohan opens `/signup` and enters the organisation email, website and a password of at least six characters. If he came from the pricing page, the plan he chose is checked and remembered. He lands on `/verify`, types six digits and presses submit. A **Resend code** link unlocks after 60 seconds. **Change email** returns him to sign-up.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Sign-up form | Form | Organisation email, website, password with at least six characters | ◐ Simulated | The password is not stored or checked anywhere. Security-relevant (G14-E-07) |
| F-2.2: Plan carry-over from Pricing | Rule | Category, tier and cycle in the link are checked against the active plans and saved. An unknown category clears the choice, an unknown tier falls back to Starter, and with no match the first plan in the store is used | ● Works | |
| F-2.3: Invite link at sign-up | Rule | A sign-up address carrying an invite or token goes to the invite page. If an invite session exists the organisation moves to Onboarding | ● Works | |
| F-2.4: Verification code | Screen | Six digits only, an explicit submit button, no auto-submit | ◐ Simulated | Any six digits are accepted. Security-relevant (G14-E-02). Decision needed: D-45 |
| F-2.5: Resend code | Button | Locked for 60 seconds, then a toast says a new code was sent | ◐ Simulated | Nothing is sent (G14-E-02) |
| F-2.6: Change email | Link | Returns to sign-up | ● Works | |
| F-2.7: Next step after verify | Rule | Goes to `/payment` if a payment is pending, otherwise to `/onboarding` with email, name and website | ● Works | |
| F-2.8: Suspended organisation on verify | State | A Suspended organisation is blocked here too | ● Works | |
| F-2.9: Verify with no email | State | `/verify` with no email goes to `/login` | ● Works | |
| F-2.10: Duplicate email | State | Signing up with an email that already exists is not detected | ○ Not built | Decision needed: D-45 |
| F-2.11: Wrong or expired code | State | No wrong-code or expired-code message exists | ○ Not built | Decision needed: D-45 |

#### 3. Worked example
Rohan signs up the clinic.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Opens `/signup` | Enters email, website and a password of seven characters | **He is sent to `/verify`** |
| 2 | Code page is open | Types 000000 and presses submit | **The code is accepted and onboarding starts with email and website filled in** |
| 3 | No code arrived | Waits 60 seconds and presses **Resend code** | **A toast says a code was sent. None was** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When I try the product for my clinic, I want a short sign-up that proves my email, so that I can see value fast and the account is mine. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a password shorter than six characters, **when** the user submits sign-up, **then** it is refused. |
| F-2-2 | **Given** the code page, **when** the user types any six digits and submits, **then** the user is signed in. |
| F-2-3 | **Given** sign-up with an email that already exists, **then** no duplicate is detected. |
| F-2-4 | **Given** a plan in the link with an unknown tier, **then** the Starter tier is saved. |

### F-3: Accept an organisation invite

#### 1. What it does
A platform admin has set up a clinic and sent an emailed link. The owner opens `/invite/:token`. The link is checked against browser storage. A new person sets a password and its confirmation. A person whose email already has an account is not asked for a password. On acceptance the organisation moves to Onboarding. A paid plan sends the owner to `/payment`. A free plan shows a 4.2 second setup loader and then the dashboard.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Link check | State | The link fails if the token was used, the organisation is missing, the organisation is Suspended or the invite is flagged used. One generic message covers all four: no longer valid, ask your admin for a new invite | ◐ Simulated | The used flag lives in one browser only, so the same link can work elsewhere. Security-relevant (G14-E-06) |
| F-3.2: Password step | Form | A new user sets a password and a matching confirmation | ◐ Simulated | The password is never stored (G14-E-07) |
| F-3.3: Existing email | Rule | An invited email that already has an account is asked for no password and is signed in | ◐ Simulated | The token alone is the credential. Security-relevant (G14-E-06). Decision needed: D-47 |
| F-3.4: Role granted | Rule | The user record gets role Admin, but the session is saved as System Admin | ◐ Simulated | The two values conflict (G14-E-08). Decision needed: D-47 |
| F-3.5: Paid-plan diversion | Rule | A plan with a price above zero, and not internal, onboarding or free, goes to `/payment` | ● Works | |
| F-3.6: Free-plan path | Rule | The organisation becomes Active, onboarding is marked complete, a 4.2 second loader runs and the dashboard opens. Onboarding questions are skipped | ● Works | |
| F-3.7: Expiry, revoke, resend | Rule | No expiry check on the token. Only Suspended works as a revoke. No resend | ○ Not built | The earlier team PRD names a 7-day expiry for team invites (G14-I-02). Decision needed: D-47 |
| F-3.8: Choose a role at invite | Field | The organisation invite always yields an admin | ○ Not built | Decision needed: D-47 |

#### 3. Worked example
Rohan is invited by the platform admin to a clinic on the free plan.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Opens the emailed link | Sets a password and confirmation, then accepts | **A setup loader runs for about four seconds and the dashboard opens** |
| 2 | His email already has an account | Opens the same kind of link | **No password is asked and he is signed in as System Admin** |
| 3 | He opens the used link again in the same browser | Opens it | **The generic "no longer valid" message shows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When my provider has set up my clinic, I want to open one link and start working, so that I skip repeated questions. |
| F-3-J2 | Platform Admin | After I provision an organisation, I want the invite to expire and be revocable, so that a forgotten link cannot open the workspace. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an unused token for an active organisation, **when** a new user sets matching passwords, **then** the organisation moves to Onboarding and the user is signed in. |
| F-3-2 | **Given** an invited email that already has an account, **when** the link is opened, **then** no password is asked and the session is System Admin. |
| F-3-3 | **Given** a plan with a price above zero, **when** the invite is accepted, **then** the user goes to `/payment`. |
| F-3-4 | **Given** a token of any age, **then** it is not rejected for being old. |

### F-4: Route guards

#### 1. What it does
Every in-app page and every `/admin` page sits under one guard. If no token is present the visitor goes to `/login`. Settings add a second guard that lets only the role System Admin through. The guard does not look at the role for anything else, and it does not check that onboarding or payment is finished.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Signed-in guard | Rule | A visitor with no token goes to `/login` | ◐ Simulated | It checks only that a token exists, and the token is fixed text (G14-E-03) |
| F-4.2: Settings guard | Rule | Only role System Admin opens Settings. Others get an error toast and go to the dashboard | ◐ Simulated | The role comes from browser storage and defaults to System Admin (G14-E-03). Decision needed: D-12 |
| F-4.3: Platform-admin guard | Rule | `/admin/*` needs only a signed-in user. The admin layout reads the role only to label the profile | ○ Not built | Any tenant role can open platform administration by address. Security-relevant (G14-E-04). Decision needed: D-12 |
| F-4.4: Tenant Organizations and Users | Rule | `/organizations` and `/users` show the platform-wide pages inside the tenant shell to any signed-in role | ○ Not built | Not in the navigation but reachable by typing the address. Security-relevant (G14-E-05). Decision needed: D-12 |
| F-4.5: Onboarding-complete guard | Rule | A user who stops mid-onboarding or skips payment can open the dashboard | ○ Not built | (G14-E-09). Decision needed: D-48 |
| F-4.6: Public routes | Rule | `/login`, `/verify`, `/signup`, `/invite`, `/pricing`, `/payment` and `/onboarding` sit outside the guard | ● Works | The patient portal and reception kiosk are outside it too and have their own PRDs |
| F-4.7: Typo address `/onbaording` | Alias | Opens onboarding | ◐ Simulated | A duplicate of `/onboarding` (G14-E-14) |

#### 3. Worked example
Rohan checks who can see what.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Signed-out visit | Opens `/clients` | **He is sent to `/login`** |
| 2 | Signed in as any role | Types `/admin/organizations` | **The platform admin page opens** |
| 3 | A non-System-Admin role | Opens Settings | **An error toast shows and he goes to the dashboard** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Admin | When staff open links, I want sign-in and roles enforced, so that patient data stays private. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** no token, **when** a tenant or admin page is opened, **then** the visitor goes to `/login`. |
| F-4-2 | **Given** any signed-in role, **when** `/admin/*`, `/organizations` or `/users` is opened, **then** the page opens. |
| F-4-3 | **Given** a role other than System Admin, **when** a Settings page is opened, **then** an error toast shows and the user goes to the dashboard. |
| F-4-4 | **Given** a signed-in user who has not finished onboarding or payment, **when** the dashboard is opened, **then** it opens. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Sign in | F-1.1 – F-1.8 | ● / ◐ / ○ | Form and redirects work; credentials are not checked. |
| F-2 | Sign up and verify | F-2.1 – F-2.11 | ● / ◐ / ○ | Plan carry-over works; any six digits pass and no code is sent. |
| F-3 | Accept an organisation invite | F-3.1 – F-3.8 | ● / ◐ / ○ | Paid and free paths work; existing email needs no password. |
| F-4 | Route guards | F-4.1 – F-4.7 | ◐ / ○ / ● | Only a token check; admin pages have no role check. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Sign in quickly and safely | F-1 |
| 2 | Practice Admin | Sign up and prove my email | F-2 |
| 3 | Practice Admin | Open one invite link and start working | F-3 |
| 4 | Platform Admin | Make invites expire and be revocable | F-3 |
| 5 | Practice Admin | Have sign-in and roles enforced | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Signed-out visitor | Open sign-in, sign-up, verify, invite, pricing, payment, onboarding, the patient portal and the kiosk | Every tenant and admin page (sent to sign-in) |
| Any signed-in user | Open every tenant page, every `/admin` page, `/organizations` and `/users` | Settings, unless the stored role is System Admin |
| System Admin (the default role) | Everything, including Settings | Nothing |
| Anyone with browser access | Set the stored role to System Admin and enter as one | Nothing. Security-relevant (G14-E-03) |

No earlier PRD covers these screens. The organisation PRD only says the platform admin can provision a workspace. Decision needed: D-12.

## 5. Metrics and definitions

No metric is shown on these screens.

## 6. Cross-module journeys this module appears in

This module is the entry to all four journeys but holds no step in them.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-45 | What is the real authentication model (password hash, emailed code and expiry, lockout, forgot password, SSO), and what happens when sign-up uses an email that already has an account? | F-1.2, F-1.7, F-1.8, F-2.4, F-2.10, F-2.11 |
| D-12 | Who may open `/admin/*`, `/organizations` and `/users`, and where is the role matrix enforced? | F-1.3, F-4.2, F-4.3, F-4.4 |
| D-47 | What role does an invited owner get, how long does the link live, and can it be revoked or resent? | F-3.3, F-3.4, F-3.7, F-3.8 |
| D-48 | Should the app block users until onboarding and payment are complete? | F-4.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
