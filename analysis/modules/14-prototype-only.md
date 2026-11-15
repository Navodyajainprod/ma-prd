# G14 — Prototype-only screens (auth, onboarding, pricing, profile, refer, guide, misc routes) — Gap Analysis
_Sources:_ PRD: none for this group. Partial mentions only in `content/client/settings/team.md`, `content/admin/organizations.md`, `content/admin/plans/categories.md`, `content/admin/industry-category/industries.md` | Prototype: `src/app/routes.tsx`, `src/app/pages/auth/**`, `Pricing.tsx`, `Profile.tsx`, `ReferAndEarn.tsx`, `GuidePageRoute.tsx`, `NotFound.tsx`, `Organizations.tsx`, `components/auth/**`, `context/AuthContext.tsx`, `lib/onboardingWorkspace.ts`, `lib/planRecommendation.ts` | Analysed 2026-11-12 (paths under `E:\mantra-assist\src\app\` unless noted)

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
|---|---|---|---|---|---|---|---|
| Login / Verify / Signup / auth guards | 0 | 0 | 6 | 0 | 0 | 6 | No PRD |
| Invite acceptance (`/invite`, `/invite/:token`) | 0 | 1 | 3 | 0 | 1 | 3 | No PRD |
| Onboarding (5/6-step wizard) + Voice/Quick-form variants | 0 | 1 | 5 | 0 | 0 | 4 | No PRD |
| Pricing (`/pricing`) | 0 | 1 | 3 | 0 | 0 | 1 | No PRD |
| Payment (`/payment`) | 0 | 0 | 3 | 0 | 0 | 3 | No PRD |
| Profile / `/account/notifications` / NotFound | 0 | 0 | 3 | 0 | 0 | 2 | No PRD |
| Refer & Earn | 0 | 0 | 2 | 0 | 0 | 2 | No PRD |
| Guide (`/guide*`) | 0 | 0 | 2 | 0 | 0 | 1 | No PRD |
| Legacy / redirect / tenant-reachable routes | 0 | 0 | 4 | 0 | 0 | 2 | No PRD |
| **Total** | 0 | 3 | 31 | 0 | 1 | 24 | No PRD |

Overall coverage: 3 × 0.5 ÷ 34 ≈ 4% · PRD-backed coverage: n/a (no screen in this group has a PRD file)

## Route map
| Route(s) | Page file | PRD file |
|---|---|---|
| `/login`, `/verify` | `pages/auth/Login.tsx` (same component; `/verify` shows OTP view) (routes.tsx:178-185) | none |
| `/signup` | `pages/auth/Signup.tsx` (routes.tsx:190) | none |
| `/invite`, `/invite/:token` | `pages/auth/InviteAcceptance.tsx` (routes.tsx:194-201) | none (partial: org provisioning in `admin/organizations.md`) |
| `/pricing` | `pages/Pricing.tsx` (routes.tsx:186) | none (partial: `admin/plans/categories.md`) |
| `/payment` | `pages/auth/PaymentScreen.tsx` (routes.tsx:202) | none |
| `/onboarding`, `/onbaording` (typo alias, routes.tsx:210-213) | `pages/auth/Onboarding.tsx` | none |
| (not routed) Voice / Quick-form onboarding | `VoiceOnboardingScreen.tsx`, `QuickFormOnboardingScreen.tsx` — imported by nothing | none |
| `/profile` | `pages/Profile.tsx` (routes.tsx:272) | none |
| `/account/notifications` | redirect to `/settings/notifications` (routes.tsx:263), inside the System-Admin guard | none |
| `/refer-and-earn` | `pages/ReferAndEarn.tsx` (routes.tsx:275) | none |
| `/guide`, `/guide/:slug` | `pages/GuidePageRoute.tsx` (routes.tsx:273-274) | none |
| `*` | `pages/NotFound.tsx` (routes.tsx:345) | none |
| `/organizations`, `/users` (tenant shell) | `Organizations.tsx`, `UserManagement.tsx` (routes.tsx:245-246) | none for tenant use (admin PRD covers `/admin/organizations`, `/admin/users`, owned by G13) |
| `/email-agent`, `/agents/email-agent` | redirect to `/chats?channel=email&subMode=agent` (routes.tsx:270-271) | none (G4 owns `/chats`) |
| `/roles` | redirect to `/settings/team?tab=roles` (routes.tsx:267) | none |
| `/forms`, `/forms/:id`, `/web-forms/new`, `/web-forms/builder` | redirects to `/web-forms` (routes.tsx:238-242) | G8 owns target |
| `/admin/campaigns` | renders the Reports page (routes.tsx:340) | none |
| `/admin/credits` | renders Plans page (routes.tsx:323) | none |
| `/admin/voice-config` | alias for AI Voices & Models (routes.tsx:295) | none |
| `/admin/form-builder*`, `/admin/telephony*` | redirects (routes.tsx:303-327) | G13 |

Notes: there is no top-level `/campaigns`, `/credits`, `/voice-config`; only `/admin/` aliases exist. Top-level `/email-agent` and `/agents/email-agent` are redirect-only.

## A. Product map — as built

### A1. Login, Verify, Signup and auth guards
**Purpose.** Public entry to the app. Existing users sign in with email and password; new organisations sign up with email, website and password, confirm a 6-digit code, then go to onboarding.
**User roles.** None at sign-in. Everyone who signs up is treated as System Admin (Signup.tsx:160-167, Login.tsx:103). Role is read from browser storage and defaults to System Admin (AuthContext.tsx:28).
**Screens.** Login (`/login`), Verify (`/verify`, same component), Signup.
**Flow: sign in.**
1. User opens `/login`. If already signed in, the guest wrapper sends them to `/` (or to onboarding if the browser flags a signup without an organisation) (GuestRoute.tsx:47-71).
2. User enters email and password. Validation: email required and format-checked, password required (Login.tsx:59-72); errors appear as toasts only.
3. If a stored organisation with that email is Suspended, sign-in is blocked with a toast (Login.tsx:76-88).
4. After a 0.4 s simulated wait the user is marked signed in with a placeholder token, a display name is derived from the email text before the "@", and the stored role (default System Admin) is saved (Login.tsx:90-105; AuthContext.tsx:53-56).
5. If a payment is pending, go to `/payment`; otherwise toast "Welcome back" and go to `/` (Login.tsx:107-115).
- The password is never checked against anything. Any email and any password signs in. No "forgot password" link exists. No lockout, rate limit or error state for wrong credentials.

**Flow: sign up.**
1. `/signup` takes organisation email, organisation website, password (min 6 characters) (Signup.tsx:112-126).
2. If arrived from `/pricing` with category, tier and cycle in the URL, the chosen plan is validated against active admin plans and saved as the "pricing flow selection". Unknown categories clear it; unknown tiers fall back to Starter; if nothing matches the first plan in the store is used (Signup.tsx:31-100).
3. If the URL carries an invite or token, the user is redirected to the invite screen (Signup.tsx:103-107).
4. On submit (0.35 s simulated), if an invite session exists, the matching organisation's status moves to "Onboarding" (Signup.tsx:137-153). Email, website and a signup marker are stored, user role is set to System Admin, and the user goes to `/verify` (Signup.tsx:155-176).
- Signing up with an email that already exists is not detected. The password is not stored anywhere.

**Flow: verify.**
1. `/verify` without an email redirects to `/login` (Login.tsx:42-46).
2. User types a 6-digit code (digits only). A Submit button is required (no auto-submit) (Login.tsx:186-199).
3. Any 6 digits are accepted. Success signs the user in and goes to `/payment` if a payment is pending, else `/onboarding` carrying email, name and website (Login.tsx:145-182).
4. "Resend code" is locked for 60 s, then a toast says a new code was sent (no code is actually sent) (Login.tsx:49-54, 202-212). "Change email" returns to signup.
- Suspended organisations are blocked here too (Login.tsx:131-143). There is no expired or wrong-code state.

**Auth guards on the app shell.**
- Every tenant page and every `/admin` page sits under one guard that only checks "is a token present"; if not, redirect to `/login` (ProtectedRoute.tsx:4-11; routes.tsx:214-215).
- Settings routes add a second guard: only role "SystemAdmin" passes, others get an error toast and are sent to `/` (SettingsGuard.tsx:18-35; routes.tsx:252-265).
- `/admin/*` has no role check; the admin layout reads the role only to label the profile (AdminLayout.tsx:46). The sign-in guard does not check that onboarding or payment is complete, so a user who stops mid-onboarding can navigate straight to `/`.
- The patient portal and reception kiosk routes are outside the guard (G11, G12).
**Business rules.** Suspended org blocks sign-in and verify; pending payment diverts to payment; plan from pricing is validated against active admin plans.
**KPIs.** None.
**Cross-module.** Suspended status is set in Admin → Organizations (G13); plan list comes from Admin → Plans (G13).

### A2. Invite acceptance (`/invite`, `/invite/:token`)
**Purpose.** An admin-provisioned organisation owner opens an emailed link, sets a password and lands in an already-configured workspace.
**Roles.** The invited person becomes a user with role "Admin" in the user list (InviteAcceptance.tsx:259-267) but is saved in the session as System Admin (InviteAcceptance.tsx:303-309). The two values conflict.
**Flow.**
1. Token is read from the route, or the `token` / `invite` query (InviteAcceptance.tsx:44-50).
2. Validation (browser storage only): link is invalid if the token was already used, the organisation cannot be found, the org is Suspended, or the invite is flagged used (InviteAcceptance.tsx:115-160). All failures show the same generic message "no longer valid, ask your admin for a new invite" (InviteAcceptance.tsx:56-58).
3. If the invited email already has an account, no password is asked; otherwise password plus confirmation are required and must match (InviteAcceptance.tsx:233-250).
4. Accept: user record is saved, token marked used, org status becomes "Onboarding", session is signed in (InviteAcceptance.tsx:257-310).
5. If the assigned plan has a price above zero (and is not an internal, onboarding or free plan), go to `/payment` (InviteAcceptance.tsx:78-92, 317-329). Otherwise the org is set Active, onboarding is marked complete, a 4.2 s "setting up" loader runs and the user lands on `/` (InviteAcceptance.tsx:333-366).
- Missing state: no expiry date check on the token; no revoke state other than Suspended; no resend; no role other than admin can be invited here.
**Business rules.** One-time token; plan comes from the org record set by the platform admin; onboarding questions are skipped for invited orgs.
**Cross-module.** Org record, assigned plan, token are created in Admin → Organizations (G13). Team-member invites (Settings → Team, G10) are a different flow with no code path here.

### A3. Onboarding wizard (`/onboarding`)
**Purpose.** Capture the practice profile after signup, recommend a plan, and seed a fresh workspace.
**Roles.** Whoever just signed up; no gating beyond the shared app-shell guard (the route itself is public).
**Screens.** One wizard with 5 steps (6 when the user came from `/pricing`). Titles: 1 About your organisation, 2 About your location, 3 Product and service, 4 Your workspace, 5 Knowledge base, 6 Payment (pricing flow only) (Onboarding.tsx:1530, 1616, 1850, 2071, 2154, 2274).
**Flow.**
1. Entry: from verify (email, website carried in) or from payment. Website defaults to a hardcoded sample site if none was provided (Onboarding.tsx:741-748). Org name is pre-filled from the website/email.
2. Step 1 captures organisation name, industry and service category, country. Step 2 captures one or more locations with address, operating days and hours (add/delete supported). Step 3 captures services with descriptions. Step 4 captures requirements (a multi-select of needs), team size, call volume, countries called. Step 5 captures uploaded knowledge documents. Back is available on every step.
3. Step 4 in the open (non-pricing) path computes the recommended category and tier (Onboarding.tsx:2045-2051). Category = the product family with the most selected needs, tie broken by the first selected need, default AI Receptionist (planRecommendation.ts:85-130). Tier = the highest of: lowest tier containing every selected need; tier by team size (Scribe: up to 3/10/25; other products: up to 8/25/100); tier by calls per day, receptionist only (planRecommendation.ts:134-166 comment and function).
4. Finish (open path): a 6.5 s animated "building your practice" loader runs, then the workspace is created (Onboarding.tsx:1184-1213). Creates a new organisation with a timestamp ID, status Active, stores locations, services as seeded services, documents as knowledge sources, and empties all client, call, process, appointment, deal, invoice, payment and claim lists (onboardingWorkspace.ts:160-355). A free plan for the matched category is assigned (Onboarding.tsx:1320; plansBillingStore.ts:1867). The recommended tier is saved on the org but not purchased. Onboarding is marked complete, user signed in, toast, go to `/` and the "How it works" guide auto-opens (Onboarding.tsx:1331-1349).
5. Pricing path: category/tier come from the pricing selection, the plan is bound after payment, and step 5's primary button is "Continue to payment" (pending-payment flag set, go to `/payment`) (Onboarding.tsx:2236-2247). Currency is INR, default country India, versus USD and United States on the open path (Onboarding.tsx:1272-1273).
6. Invite path: questions skipped; the loader runs immediately and the workspace is created from the stored invite (Onboarding.tsx:798-806); plan comes from the invite (Starter fallback, category from the invite) (Onboarding.tsx:1238-1247).
- Auto-run: if onboarding is already marked complete when the page opens, the loader fires again and a second workspace is created (Onboarding.tsx:798-806).
- Error handling: if workspace seeding throws, the org is added by a fallback and the user proceeds with only a console warning (Onboarding.tsx:1325-1327).
**What the answers configure.** Industry and service category: stored on the org. Requirements, team size, call volume: drive the plan recommendation only. Locations: stored text only. Services and documents: seeded into the Services and Knowledge Base lists. Operating countries and the "international calls" flag: stored on the org. Telephony: hardcoded to "default". Sidebar template, industry workflow templates and automations: not set anywhere in onboarding code (no reference in the onboarding files or workspace seeding).
**Voice and Quick-form variants.** Two further onboarding screens (a voice conversation using Whisper audio capture, and a single quick form) share the same data shape (industry, requirements, call volume, countries, locations, hours, team size, documents, telephony) (onboardingHelpers.ts:17-30). Neither is imported or routed anywhere, so they are unreachable (grep: only `Onboarding.tsx`/`PaymentScreen.tsx` import the shared shell). Shared helpers guess the specialty from website text with keyword patterns and fall back to General Physician (onboardingHelpers.ts:39-109), invent sample locations when none are found (onboardingHelpers.ts:148-157), and tag needs by keyword (onboardingHelpers.ts:164-205).
**KPIs.** Recommended category and tier (formula above, computed). The build-progress percentage is a timer, not real progress.
**Cross-module.** Seeds Services (G7), Knowledge Base (G9), org record (G13), subscription (Settings → Billing, G10).

### A4. Pricing (`/pricing`)
**Purpose.** Public price page. Tabs per product (Receptionist, Scribe, EHR, RCM), monthly/yearly toggle with a 20% yearly badge, plan cards, comparison table, credit explainer, top-up packs (display only), FAQ, closing call to action (Pricing.tsx header comment 1-17).
**Roles.** Public.
**Flow.** Data loads from the admin plan store (an API call is noted but falls back to the store) (Pricing.tsx:119-124). "Get started" on a plan goes to `/signup?category=…&tier=…&cycle=…` (Pricing.tsx:146-147). Header and footer link to login and signup (Pricing.tsx:177-188, 755-760). Custom/Enterprise tiers show a custom label instead of a price (Pricing.tsx:499).
**Rules.** Credit rates stated in the FAQ: outbound minute 1, inbound minute 2, missed-call callback 3, SMS or email 1, workflow run 1 (Pricing.tsx:48-50). These are static text, not read from admin credit settings. FAQ says changes are prorated on upgrade and apply next cycle on downgrade.
**KPIs.** The 20% yearly discount is stated; whether the displayed yearly price is computed from it or read from the plan is not verified here.
**Cross-module.** Plans and categories from Admin → Plans (G13); handoff to Signup.

### A5. Payment (`/payment`)
**Purpose.** Collect card or UPI for a paid plan (from pricing flow or paid invite).
**Flow.**
1. Loads invite session or pricing selection and the matching plan; billing organisation name pre-filled (PaymentScreen.tsx:30-66).
2. User chooses card or UPI. Validation: org name required; card number at least 15 digits, expiry must contain "/", CVC 3 or more, name required; UPI must contain "@" (PaymentScreen.tsx:161-185). Errors show inline plus a generic banner.
3. In demo/test mode a "quick fill" link inserts a sample card (PaymentScreen.tsx:123-157).
4. On submit (simulated wait) the plan is assigned to the workspace, the org record is marked Active with plan details, the pending flag is cleared, onboarding is marked complete and the user is signed in (PaymentScreen.tsx:200-253). Invited orgs go to `/` after a 4.2 s loader; pricing-flow users go on to `/onboarding` to finish tailoring (PaymentScreen.tsx:256-270).
- No real gateway call; the card is never charged or tokenised. No payment-failed path beyond the field validation. The back control goes to the previous page or login (PaymentScreen.tsx:525-527).
**Cross-module.** Subscriptions and orders in Admin (G13); Settings → Billing (G10).

### A6. Profile, account notifications, NotFound
- `/profile` opens a drawer on top of the dashboard immediately; closing it returns to the previous page (Profile.tsx:6-17, 21-24). It edits the first team member whose role is "admin", or the first member, or a hardcoded sample admin ("Admin User", sample email and phone) if the team list is empty (Profile.tsx:19-35). It does not use the signed-in user's own identity. Saving writes the member back to the team list in browser storage (Profile.tsx:59-65). Any role can open it.
- `/account/notifications` redirects to Settings → Notifications; only System Admins reach it, others get the restricted toast and go home (routes.tsx:252-263).
- `*` shows a plain "404 Page not found" with a "Go to Home" button (NotFound.tsx). It is outside the app shell, so signed-out users also see it.

### A7. Refer & Earn (`/refer-and-earn`)
**Purpose.** Referral programme page: overview tab (earnings cards, 3-step explainer, plan selector with share link/code, FAQ) and referrals tab (search, status filter, row selection, table of referred practices) (ReferAndEarn.tsx:78-95).
**Flow.** Pick a plan, copy the referral link (toast shows plan and rate) or open the share drawer (email/message options in `ReferralShareDrawer.tsx`) (ReferAndEarn.tsx:97-109).
**KPIs.** "Total Earned $1,250.00" is a typed constant (ReferAndEarn.tsx:402): hardcoded – formula undefined. Referral rows (names, dates, plan, status, rate, reward) are a fixed sample list (ReferAndEarn.tsx:50-55): hardcoded – formula undefined. Commission rates differ by plan (7 to 14%) with no rule source. FAQ states rewards are uncapped (ReferAndEarn.tsx:69).
No sign-up attribution exists: the signup page does not read a referral code.

### A8. Guide (`/guide`, `/guide/:slug`)
**Purpose.** In-app help centre with a sidebar of topic pages, on-this-page index, and a home view when no slug matches (GuidePageRoute.tsx:1612-1620). Topics (slugs): dashboard, clients, call-logs, process-settings, web-forms, knowledge-base, chats, appointments, services, team-and-organization, organizations, billing-payments, settings, deals, ai-scribe (GuidePageRoute.tsx:43-1095). Process screens deep-link here (e.g. `/guide/process-settings#flow-builder-canvas`, components/process/FlowBuilderTab.tsx:3317). "Back to app" returns to the page the user came from or one step back (GuidePageRoute.tsx:1590-1597).
An unknown slug silently shows the guide home rather than a not-found message. The guide has no pages for Reports, Tasks, Invoices, Claims, Receptionist or Automation.

### A9. Legacy, redirect and tenant-reachable routes
- Redirects listed in the Route map send old URLs (`/forms`, `/roles`, `/receptionist`, `/email-agent`, `/agents/email-agent`) to current screens, keeping query parameters for chats.
- `/organizations` and `/users` render the platform-admin Organizations and User Management pages inside the tenant shell for any signed-in role (routes.tsx:245-246). They are not in the client navigation (no entry in `config/navigation.ts`) but are reachable by typing the address.
- `/admin/campaigns` renders the Reports page, `/admin/credits` the Plans page, `/admin/voice-config` the AI Voices page (routes.tsx:323, 295, 340). These look like placeholder aliases: there is no campaigns or credits screen.
- A typo route `/onbaording` also opens onboarding (routes.tsx:210-213).

## B. Product map — per PRD
No PRD exists for any screen in this group. Partial mentions found by searching `E:\ma-prd\content` for login, signup, onboarding, invite, pricing, refer, profile, guide, campaigns, email agent, voice-config:
- `client/settings/team.md § F-1 Invite Team Member` (lines 32-33, 39, 49): role-based email invite (Admin, Doctor, Nurse, Coordinator, Billing) with a secure token, 7-day expiry, "Pending Invite" tag and "Resend Invite" with a fresh token; invitee "logs in to set password". This is the team-member invite, not the organisation invite built in `/invite`.
- `admin/organizations.md § F-1` (line 42): superadmin "provision their tenant workspace with one click". Does not describe the invite link, acceptance, or payment hand-off.
- `admin/plans/categories.md § F-1` (lines 27, 48): category badges such as "Most Popular" shown on public signup and checkout pages.
- `admin/industry-category/industries.md § F-1` (line 27): industry blueprints bundle modules, workflows and default intake questions "for instant practice onboarding". No onboarding screen in the prototype applies these blueprints.
- No PRD mentions login, verify, signup, pricing page, payment screen, referrals, profile page, guide or campaigns.

## C. Findings (only items with some PRD mention)
### Invite
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G14-I-01 | Flow | Organisation invite: token link, set password, enter workspace | Partial (PRD less detailed) | `admin/organizations.md § F-1` | InviteAcceptance.tsx:233-366 | PRD only says "one-click provisioning"; invite acceptance, plan-driven payment diversion and used-token rules are not written |
| G14-I-02 | Rule | Invite expires after 7 days; resend gives a fresh token | PRD-only (not built) | `client/settings/team.md § F-1.2` | InviteAcceptance.tsx:115-160 (no expiry check) | Applies to team invites (G10); org invites have no expiry in code |
| G14-I-03 | Rule | Role chosen at invite (Admin, Doctor, Nurse, Coordinator, Billing) | Missing in PRD for org invite | `client/settings/team.md § F-1.1` | InviteAcceptance.tsx:264, 308 | Org invite always yields admin/System Admin; see G14-E-08 |
### Onboarding and pricing
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G14-I-04 | X-ref | Industry blueprints configure a new practice automatically | Partial (PRD less detailed) | `admin/industry-category/industries.md § F-1` | Onboarding.tsx:1216-1230 (industry stored on org only) | PRD intent is not wired: onboarding stores industry as a label and does not apply blueprints |
| G14-I-05 | Flow | Category badges on public pricing/signup | Partial (PRD less detailed) | `admin/plans/categories.md § F-1` | Pricing.tsx:319-420 | Page shows plan cards and feature lists; whether admin promotional tags render is not verified in code read |
| G14-I-06 | Flow | Everything else (login, verify, signup, wizard, payment, profile, refer, guide, 404) | No PRD | none | see A1-A9 | Treat as net-new PRDs (section D) |

## D. Correct flow as built (PRD-ready)
Each block below is a proposed PRD file following `content/client/overview.md`. Suggested paths: `content/client/auth/access.md`, `content/client/auth/onboarding.md`, `content/client/auth/pricing-payment.md`, `content/client/account/profile.md`, `content/client/account/refer-and-earn.md`, `content/client/help/guide.md`.

### D1. `content/client/auth/access.md`
```
---
title: "Sign-in, Sign-up, Verification & Invite Access"
product: "client"
module: "auth"
status: "Draft"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | AUTH |
| Status | Draft |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
- Admin → Organizations: creates the invite link, assigned plan and Suspended status that these screens honour.
- Admin → Plans: supplies the plans validated at signup.
- Settings → Team: separate team-member invite flow (not covered here).

## 1. Module Summary
- Public entry to MantraAssist: sign in, create an account, confirm by one-time code, or accept an organisation invite.
- Every in-app page requires a signed-in user; Settings requires System Admin; /admin requires Decision needed: platform-admin role (see G14-Q-02).

## 2. Feature Requests

### F-1: Sign in
#### 1. What it does
Lets an existing user enter email and password and reach the dashboard.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Email and password form | Form | Both required; email format checked; show/hide password | Errors shown as toasts |
| F-1.2: Suspended-organisation block | Rule | A suspended organisation cannot sign in | Message: contact support |
| F-1.3: Pending-payment redirect | Rule | A user with an unpaid chosen plan goes to payment instead of the dashboard | |
| F-1.4: Credential check, forgot password, lockout | Requirement | Decision needed: real credential verification and password reset (see G14-Q-01) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Returning admin | Enters email and password | **Lands on the dashboard with a welcome message** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice admin | When I return, I want to sign in quickly, so that I can continue my work. |

### F-2: Sign up and verify
#### 1. What it does
Creates a new organisation account from email, website and password, then confirms the email with a 6-digit code.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Signup form | Form | Organisation email, website, password of at least 6 characters | Duplicate-email handling: Decision needed (see G14-Q-03) |
| F-2.2: Plan carry-over from Pricing | Rule | Category, tier and cycle in the link are validated against active plans and remembered | Unknown tier falls back to Starter |
| F-2.3: Verification code | Screen | 6-digit numeric code, Submit button, 60-second resend lock, change email | Code validity and expiry: Decision needed (see G14-Q-01) |
| F-2.4: Next step | Rule | After verifying, go to payment if one is pending, otherwise to onboarding | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New clinic owner | Signs up, enters the code | **Starts onboarding with email and website pre-filled** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | New practice owner | When I try the product, I want a short signup, so that I can see value fast. |

### F-3: Accept an organisation invite
#### 1. What it does
Lets a platform-provisioned owner open an emailed link, set a password and enter the pre-configured workspace.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Link check | Rule | Link is rejected if used, organisation missing, or organisation suspended | One generic message for all |
| F-3.2: Password step | Form | New users set and confirm a password; existing users skip it | |
| F-3.3: Paid-plan diversion | Rule | A plan with a price goes to payment first; free plans go straight to a setup loader and the dashboard | |
| F-3.4: Role and expiry | Requirement | Decision needed: role granted and link lifetime (see G14-Q-04) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin invites a clinic on a free plan | Owner opens link, sets password | **Workspace opens ready to use** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Invited owner | When my provider sets me up, I want to skip questions, so that I start working at once. |

### F-4: Route guards
#### 1. What it does
Protects in-app pages.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Signed-in guard | Rule | Signed-out visitors go to login | |
| F-4.2: Settings guard | Rule | Only System Admin can open Settings; others are redirected home with a message | |
| F-4.3: Platform-admin guard | Requirement | Decision needed: who may open /admin and tenant-side Organizations/Users (see G14-Q-02) | |
| F-4.4: Onboarding-complete guard | Requirement | Decision needed: block the app until onboarding/payment is finished (see G14-Q-05) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Signed-out visit to /clients | Opens the address | **Sent to login** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice owner | When staff open links, I want sign-in enforced, so that patient data stays private. |

### Not yet built
- Password reset, real code delivery, social sign-in (none in prototype; none in PRD).

## 3. Comprehensive Summary
| # | User | Job to be done | Feature |
| :--- | :--- | :--- | :--- |
| 1 | Practice admin | Sign in quickly | F-1 |
| 2 | New practice owner | Sign up fast | F-2 |
| 3 | Invited owner | Skip setup | F-3 |
| 4 | Practice owner | Keep data private | F-4 |
```

### D2. `content/client/auth/onboarding.md`
```
---
title: "Practice Onboarding Wizard, Plan Recommendation & Payment"
product: "client"
module: "onboarding"
status: "Draft"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | ONBOARDING |
| Status | Draft |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
- Services: services entered in step 3 become the first Services list.
- Knowledge Base: documents uploaded in step 5 become knowledge sources.
- Admin → Organizations/Plans: new organisation record and subscription.
- Settings → Billing: the plan assigned here.

## 1. Module Summary
- A guided wizard that captures the practice profile, recommends a plan, and creates an empty, ready workspace.
- Three entry paths: open signup (free plan), from the pricing page (paid plan, extra payment step), invited (questions skipped).

## 2. Feature Requests

### F-1: Wizard steps
#### 1. What it does
Collects organisation, locations, services, workspace needs and knowledge documents across five steps (six for paid plans).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: About your organisation | Step | Name, industry, service category, country; pre-filled from website | |
| F-1.2: About your location | Step | One or more locations with address, operating days and hours | Add and delete supported |
| F-1.3: Product and service | Step | Services with descriptions | Added to Services |
| F-1.4: Your workspace | Step | Needs, team size, calls per day, countries called | Drives plan recommendation |
| F-1.5: Knowledge base | Step | Upload practice documents | Added to Knowledge Base |
| F-1.6: Payment | Step | Paid-plan path only | See F-3 |
| F-1.7: Voice and quick-form variants | Requirement | Decision needed: ship or retire the voice and quick-form onboarding (see G14-Q-06) | Built but not reachable |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dental clinic signs up | Completes five steps | **Sees an empty workspace with services and documents loaded** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | New practice owner | When I join, I want to describe my practice once, so that the product is configured for me. |

### F-2: Plan recommendation
#### 1. What it does
Suggests a product and tier from the needs chosen.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Product choice | Rule | Product with the most selected needs; tie goes to the first selected; none selected gives AI Receptionist | |
| F-2.2: Tier choice | Rule | Highest of: lowest tier containing all selected needs, tier for team size, tier for calls per day (receptionist only) | Scribe team limits 3/10/25; other products 8/25/100 |
| F-2.3: Free start | Rule | Open signup gets the free plan of the product; the recommended tier is stored, not charged | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | 12 staff, receptionist needs | Finishes step 4 | **Growth recommended** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice owner | When choosing a plan, I want a sensible suggestion, so that I do not overpay. |

### F-3: Payment
#### 1. What it does
Collects card or UPI details for a paid plan and activates the workspace.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Payment form | Form | Organisation name plus card (number, expiry, CVC, name) or UPI ID | Field-level errors |
| F-3.2: Activation | Rule | On success the plan is applied, the organisation becomes Active, the user continues to onboarding (pricing path) or the dashboard (invited) | |
| F-3.3: Real gateway, failures, receipts | Requirement | Decision needed: payment provider and failure handling (see G14-Q-07) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Owner picked Growth on pricing | Pays by card | **Account active, wizard continues** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice owner | When I choose a paid plan, I want to pay once, so that I can start without sales contact. |

### F-4: What the answers configure
#### 1. What it does
Maps answers to workspace setup.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Organisation record | Rule | Name, industry, country, locations, hours, team size, call volume saved on the organisation | |
| F-4.2: Empty data | Rule | New workspace starts with no clients, calls, processes, appointments, deals, invoices or claims | |
| F-4.3: Industry workflows, sidebar template, automations | Requirement | Decision needed: should industry or plan pick workflow templates and a sidebar template (see G14-Q-08) | Not set by onboarding today |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New clinic finishes | Lands on dashboard | **Empty lists, welcome guide opens** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice owner | When setup ends, I want a clean workspace, so that no sample data confuses my team. |

### Not yet built
- Industry blueprint application (PRD intent in `admin/industry-category/industries.md`).
- Voice and quick-form onboarding (code exists, unreachable).

## 3. Comprehensive Summary
| # | User | Job to be done | Feature |
| :--- | :--- | :--- | :--- |
| 1 | New practice owner | Describe my practice once | F-1 |
| 2 | Practice owner | Get a sensible plan | F-2 |
| 3 | Practice owner | Pay once | F-3 |
| 4 | Practice owner | Clean start | F-4 |
```

### D3. `content/client/auth/pricing-payment.md` (public pricing page)
```
---
title: "Public Pricing Page"
product: "client"
module: "pricing"
status: "Draft"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | PRICING |
| Status | Draft |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
- Admin → Plans: all plan, price and feature data is read from here.
- Signup: "Get started" passes product, tier and billing cycle.

## 1. Module Summary
- A public page, no sign-in, listing plans by product with monthly or yearly pricing, a comparison table, credit explainer and FAQ.

## 2. Feature Requests

### F-1: Plan browsing and hand-off
#### 1. What it does
Shows active plans for the selected product and sends the chosen one to signup.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Product tabs | Tabs | Receptionist, Scribe, EHR, RCM | |
| F-1.2: Cycle toggle | Toggle | Monthly or yearly with a discount badge | Decision needed: confirm 20% rule and whether yearly price is computed or stored (see G14-Q-09) |
| F-1.3: Plan cards and comparison | Cards, table | Starter, Growth, Scale, plus Custom if defined; Custom shows "contact" instead of a price | |
| F-1.4: Credits explainer and top-up packs | Info | Display only | Decision needed: read credit rates from admin settings (see G14-Q-09) |
| F-1.5: FAQ and closing call to action | Info | Six questions | |
| F-1.6: Get started | Action | Opens signup with product, tier and cycle | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor likes Growth yearly | Clicks Get started | **Signup opens remembering Growth yearly** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Prospect | When comparing vendors, I want clear prices, so that I can decide before talking to sales. |

## 3. Comprehensive Summary
| # | User | Job to be done | Feature |
| :--- | :--- | :--- | :--- |
| 1 | Prospect | See clear prices | F-1 |
```

### D4. `content/client/account/profile.md` (Profile, notifications redirect, 404)
```
---
title: "My Profile, Account Notifications Shortcut & Not-Found Page"
product: "client"
module: "account"
status: "Draft"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | ACCOUNT |
| Status | Draft |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
- Settings → Team: profile edits are saved to the same team-member record.
- Settings → Notifications: the account notifications address opens it.

## 1. Module Summary
- A profile drawer for the signed-in user, a shortcut to notification settings, and a not-found page.

## 2. Feature Requests

### F-1: My profile
#### 1. What it does
Opens the signed-in user's team-member record for editing.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Profile drawer | Drawer | Name, contact, role, department, calendar link, locations, services, permissions | Closing returns to the previous page |
| F-1.2: Whose record | Rule | Decision needed: must open the signed-in user's own record (see G14-Q-10) | Built version opens the first admin on the team list |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor opens My Profile | Updates phone | **Saved to own team record** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Staff member | When my details change, I want to update them, so that colleagues reach me. |

### F-2: Notifications shortcut and 404
#### 1. What it does
Account notifications address opens Settings → Notifications for System Admins; unknown addresses show a 404 with a Go to Home button.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Notifications shortcut | Redirect | Non-admins see an access message and go home | Decision needed: should every user manage their own notifications (see G14-Q-10) |
| F-2.2: Not found | Page | 404 and home button | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Mistyped address | Opens it | **404 with a way home** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Any user | When I land on a bad link, I want a way back, so that I am not stuck. |

## 3. Comprehensive Summary
| # | User | Job to be done | Feature |
| :--- | :--- | :--- | :--- |
| 1 | Staff member | Keep details current | F-1 |
| 2 | Any user | Recover from bad link | F-2 |
```

### D5. `content/client/account/refer-and-earn.md`
```
---
title: "Refer & Earn Programme"
product: "client"
module: "refer-and-earn"
status: "Draft"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | REFER-AND-EARN |
| Status | Draft |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
- Signup/Billing: a referred sign-up and its payment would need to be attributed. Decision needed (see G14-Q-11).

## 1. Module Summary
- A partner page where a customer picks a plan, copies or shares a referral link and code, sees earnings and a list of referred practices.

## 2. Feature Requests

### F-1: Share a referral
#### 1. What it does
Lets the user choose a plan, see its reward rate, copy the link or open a share drawer.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Overview tab | Page | Earnings cards, three-step explainer, plan selector, FAQ | |
| F-1.2: Copy link and share drawer | Actions | Copy shows a confirmation naming plan and rate | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Owner picks Growth | Copies link | **Confirmation names Growth and its rate** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Customer | When I recommend the product, I want a trackable link, so that I get credit. |

### F-2: Track referrals and earnings
#### 1. What it does
Lists referred practices with status and reward.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Referrals table | Table | Search, status filter (paid, pending, signed up), row selection | |
| F-2.2: Total earned and reward rates | Metric | Decision needed: define reward formula, rate per plan, payout form and cap (see G14-Q-11) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Owner filters to Paid | Uses filter | **Only paid referrals shown** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Customer | When I refer, I want to see status, so that I know what I have earned. |

### Not yet built
- Real referral tracking and payout; the sample list and totals are placeholders.

## 3. Comprehensive Summary
| # | User | Job to be done | Feature |
| :--- | :--- | :--- | :--- |
| 1 | Customer | Share a link | F-1 |
| 2 | Customer | See what I earned | F-2 |
```

### D6. `content/client/help/guide.md`
```
---
title: "In-app Guide"
product: "client"
module: "guide"
status: "Draft"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | GUIDE |
| Status | Draft |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
- Process, Chats, Clients, Call Logs and others deep-link into topic pages.

## 1. Module Summary
- A help centre inside the app with a topic sidebar, an on-this-page index, and a back button to the previous screen.

## 2. Feature Requests

### F-1: Topic pages
#### 1. What it does
Explains each screen's controls and typical tasks.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Topics | Pages | Dashboard, Clients, Call Logs, Process Settings, Web Forms, Knowledge Base, Chats, Appointments, Services, Team and Organization, Organizations, Billing and Payments, Settings, Deals, AI Scribe | Decision needed: add Reports, Tasks, Invoices, Claims, Automation (see G14-Q-12) |
| F-1.2: Deep links | Rule | A topic and section can be opened from a screen | |
| F-1.3: Unknown topic | Rule | Shows the guide home | Decision needed: show a "topic not found" message (see G14-Q-12) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | User clicks guide in Process | Opens flow builder section | **Guide opens at that section** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | New staff member | When stuck, I want a guide in the app, so that I can learn without asking. |

## 3. Comprehensive Summary
| # | User | Job to be done | Feature |
| :--- | :--- | :--- | :--- |
| 1 | New staff member | Learn without asking | F-1 |
```

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
|---|---|---|---|---|
| G14-E-01 | [SECURITY] Login accepts any email and any password; there is no credential check. The "token" is the fixed text "dummy_token" stored in the browser. | pages/auth/Login.tsx:57-105; context/AuthContext.tsx:53-56 | Critical | see C (No PRD) |
| G14-E-02 | [SECURITY] Verification accepts any 6 digits; resend sends nothing | Login.tsx:145-182, 202-212 | High | — |
| G14-E-03 | [SECURITY] Session is just browser storage; anyone can set `auth_token` and `user_role=SystemAdmin` in storage to enter as System Admin. Role defaults to System Admin when missing. | AuthContext.tsx:22-29 | Critical | — |
| G14-E-04 | [SECURITY] `/admin/*` and all admin pages need only "signed in", no role check, so any tenant role can open platform administration by URL | routes.tsx:214-279; SettingsGuard.tsx:18-35 (only on settings) | Critical | — |
| G14-E-05 | [SECURITY] Tenant shell exposes `/organizations` and `/users` (platform-wide organisations and users) to any signed-in role | routes.tsx:245-246 | High | — |
| G14-E-06 | [SECURITY] Invite for an already-registered email asks for no password and signs the visitor in as System Admin; the token alone is the credential. Invalid-link logic also relies on a browser-stored "used" flag, so reuse across browsers is possible; no expiry | InviteAcceptance.tsx:115-160, 233-250, 297-310 | Critical | G14-I-02 |
| G14-E-07 | [SECURITY] Password entered at signup and invite is never stored or checked | Signup.tsx:123-178; InviteAcceptance.tsx:257-270 | High | — |
| G14-E-08 | Role mismatch on invite: saved user role is "Admin" but session role is "SystemAdmin" | InviteAcceptance.tsx:264, 308 | Medium | G14-I-03 |
| G14-E-09 | Sign-in guard does not check that onboarding or payment is complete; users can skip both by navigating to `/` after verify | ProtectedRoute.tsx:4-11 | High | — |
| G14-E-10 | Opening `/onboarding` when onboarding is already marked complete re-runs the loader and creates a second organisation with a new ID | Onboarding.tsx:798-806; onboardingWorkspace.ts:160-170 | High | — |
| G14-E-11 | Onboarding is reachable while already signed in or out of any guard; the website falls back to a hardcoded sample site and default org names use sample clinic data ("Eye Mantra") | Onboarding.tsx:741-748; onboardingWorkspace.ts:166-181 | Medium | — |
| G14-E-12 | Seeding failure is swallowed (console warning) and the user is told "setup complete" | Onboarding.tsx:1325-1327, 1340-1343 | Medium | — |
| G14-E-13 | Voice and quick-form onboarding screens are unreachable (not routed, not imported); also invent sample locations when none found | pages/auth/VoiceOnboardingScreen.tsx, QuickFormOnboardingScreen.tsx; onboardingHelpers.ts:148-157 | Medium | — |
| G14-E-14 | Typo duplicate route `/onbaording` | routes.tsx:210-213 | Low | — |
| G14-E-15 | Pricing flow currency/country hardcoded to INR/India vs USD/United States on the open path; phone saved as a fixed sample number for every new organisation | Onboarding.tsx:1272-1280 | Medium | — |
| G14-E-16 | Payment is simulated: no gateway call, plan activated regardless; the card quick-fill link reveals a demo card | PaymentScreen.tsx:123-157, 200-253 | High | — |
| G14-E-17 | [SECURITY] Card data is held in page state; the payment test-mode flags are read from browser storage so anyone can enable them | PaymentScreen.tsx:123-130 | Medium | — |
| G14-E-18 | `/profile` edits the first admin in the team list (or a hardcoded sample admin), not the signed-in user; any role can edit an admin's record this way | Profile.tsx:19-35, 59-65 | High | — |
| G14-E-19 | [SECURITY] Profile fallback exposes a sample admin email and phone when team list is empty | Profile.tsx:19-35 | Low | — |
| G14-E-20 | Refer & Earn totals, referral rows and rates are hardcoded sample data shown as real | ReferAndEarn.tsx:50-55, 402 | High | — |
| G14-E-21 | Referral link has no attribution: signup does not read a referral code | Signup.tsx:31-107 | Medium | — |
| G14-E-22 | Guide silently falls back to home on unknown topic; guide lacks pages for several screens | GuidePageRoute.tsx:1612-1620 | Low | — |
| G14-E-23 | `/admin/campaigns` renders Reports and `/admin/credits` renders Plans; there are no real screens behind those names | routes.tsx:323, 340 | Low | — |
| G14-E-24 | Pricing FAQ credit rates are static text not tied to admin credit settings (risk of showing stale prices) | Pricing.tsx:48-50 | Medium | G14-I-05 |

## Open questions for PM
- G14-Q-01 (E-01, E-02, D1 F-1/F-2): What is the real authentication model (password hash, emailed code validity, expiry, lockout, forgot password, SSO)? The prototype has none.
- G14-Q-02 (E-04, E-05, D1 F-4): Which roles may open `/admin/*`, and should `/organizations` and `/users` be removed from the tenant shell?
- G14-Q-03 (D1 F-2): What happens when someone signs up with an email that already has an account or organisation?
- G14-Q-04 (E-06, E-08, D1 F-3): What role does an invited owner get (Admin or System Admin), and how long does an invite link live? Can an invite be revoked or resent?
- G14-Q-05 (E-09, D1 F-4): Should the app block users until onboarding and payment are complete?
- G14-Q-06 (E-13, D2 F-1.7): Are the voice and quick-form onboarding variants to ship, replace the wizard, or be deleted? Which is the default?
- G14-Q-07 (E-16, D2 F-3): Which payment gateway, which currencies (INR for pricing flow, USD otherwise), and what are the failed-payment, retry and receipt rules?
- G14-Q-08 (A3, D2 F-4.3): Should onboarding answers choose industry workflow templates, automations or the sidebar template? Today they do not; industry blueprints in `admin/industry-category/industries.md` imply they should.
- G14-Q-09 (A4, D3 F-1): Confirm the 20% yearly discount rule and whether credit rates on the page are read from admin.
- G14-Q-10 (E-18, D4): Should My Profile always open the signed-in user's own record, and should every user (not only System Admin) manage their own notifications?
- G14-Q-11 (E-20, E-21, D5): What is the referral reward formula, per-plan rate, payout method, cap and attribution method?
- G14-Q-12 (E-22, D6): Which additional guide topics are required, and should unknown topics show "not found"?
- G14-Q-13 (A3): Should free signup accounts (free plan, recommended tier stored but unpaid) have a trial length and a conversion step to paid?
- G14-Q-14 (A9, E-23): Are `campaigns`, `credits`, `voice-config` meant to be real screens or only aliases to be removed?
