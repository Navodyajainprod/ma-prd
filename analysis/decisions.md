# Consolidated decisions for PM

**Source questions:** 285 (the 'Open questions for PM' sections of modules 01 to 14). **Consolidated decisions:** 147 (P0: 40, P1: 65, P2: 42). The index table at the end has 285 rows.

**Method.** Every question ID was extracted by script from the module files and each was assigned to exactly one decision (the generator fails if any ID is dropped or used twice). Questions asking the same thing across modules were merged. A decision may bundle closely related sub-questions, so answer each part. The 'why' lines and affected modules come only from the source questions. No answers are proposed.

**Priority.** P0 blocks the PRD rewrite or is a security, compliance or revenue risk. P1 is needed for PRD accuracy. P2 is detail. Priorities are my judgement from the question wording and should be confirmed.

Module numbers: 01 Overview/Reports, 02 Clients, 03 Call logs/Scribe, 04 Chats, 05 Process/Tasks, 06 Appointments, 07 Services/Invoices/Claims, 08 Workflows/Webforms, 09 KB/Receptionist config, 10 Settings, 11 Reception kiosk, 12 Companion, 13 Super admin, 14 Prototype-only.


## 1. Naming, scope and what the PRD describes

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-01 | Which names are canonical: Process vs Workflows vs Deals vs Pipeline, and Clients vs Contacts vs Patients (including whether Archived and Pending are real statuses)? | Sidebar, routes, page titles, toasts and PRD files use different words for the same objects. | 02, 05, 08, 12 | G5-Q-22, G8-Q-17, G2-Q-11 | P0 |
| D-02 | Is the PRD rewritten as a prototype-only description, or must it state backend requirements (live cross-device sync, server-side enforcement), and are PRD files for unbuilt admin features replaced by the as-built text or kept as a marked roadmap? | Several PRD files describe features that do not exist (SSO, impersonation, failover, live sync). | 09, 13 | G13-Q-01, G9-Q-14 | P0 |
| D-03 | Is the Overview a call and automation analytics dashboard (as built), a clinical command centre (as PRD), or both? | The whole page definition depends on this. | 01 | G1-Q-01 | P0 |
| D-04 | Are the original Knowledge Base concepts (folders, content search with highlighting, reader/print view, publish/index) still wanted? | PRD lists them but the build omits them. | 09 | G9-Q-12 | P1 |
| D-05 | Which routes and pages are kept or retired: /payments, /transactions, client /users, campaigns, credits, voice-config aliases, and client Settings/Reports inside the admin shell? | Dead or alias screens exist with no owner or navigation. | 07, 10, 13, 14 | G7-Q-19, G10-Q-09, G10-Q-19, G14-Q-14, G13-Q-19 | P1 |
| D-06 | Should every destructive action ask for confirmation (and remove dead pages), including deleting a stage automation? | Confirmation is inconsistent across admin and workflow screens. | 08, 13 | G13-Q-30, G8-Q-06 | P2 |
| D-07 | Is Insurance and Claims one entity or two, and does Tasks get an Add Workflow button? | Workflow entity list differs between PRD and build. | 07, 08 | G8-Q-02 | P2 |
| D-08 | Should workflows.md and automation.md be merged, and should Add Automation be a sidebar item under CUSTOMIZATIONS with a canvas page? | Built workflow (stages) and automation (event rules) overlap; PRD proposes a canvas. | 08 | G8-Q-18, G8-Q-07 | P1 |
| D-09 | Which document tag syntax ({{patient.name}} vs {client_name}) and category list is canonical? | Two tag syntaxes exist. | 13 | G13-Q-32 | P2 |
| D-10 | Which additional guide topics are required, and should unknown topics show not found? | Guide content scope is undefined. | 14 | G14-Q-12 | P2 |

## 2. Roles, permissions and access control

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-11 | What is the source of truth for role names and the role model (Admin/Doctor/Nurse/Coordinator/Billing vs Admin/Manager/Specialist/Reception/Sales/Agent/Executive; Admin roles vs Tenant role templates), how does an admin record link to a sign-in identity (default role), and what should Permitted Scope summarise? | PRD and build use different role sets and two role systems exist. | 10, 13 | G10-Q-05, G13-Q-05, G13-Q-04, G13-Q-29 | P0 |
| D-12 | Must permissions block direct URL access and each action (not only hide sidebar items), where is the role matrix enforced, what happens to an unknown role, who may open /admin/*, and are sidebar items gated by plan tier and role? | Today there is no gating; hidden menu items are still reachable. | all | G13-Q-02, G10-Q-03, G14-Q-02, G13-Q-31 | P0 |
| D-13 | Which roles may delete, bulk-delete, import, export, add categories and mark fields required on clients, and must exports be audited? | Mass data access to patient records is ungated. | 02 | G2-Q-02 | P0 |
| D-14 | Which roles may listen to recordings, read transcripts, run Scribe, select the responsible doctor and issue prescriptions? | Clinical and recording access is ungated. | 03 | G3-Q-10 | P0 |
| D-15 | Which roles may manage the catalogue, void invoices, write off, record payments, and create or submit claims? | No gating exists on money-affecting actions. | 07 | G7-Q-16 | P0 |
| D-16 | Which roles may view, create, edit or delete Knowledge Base sources, and should Admin/Manager reach AI Receptionist settings (perhaps Rooms only)? | Every role can edit KB today; settings are SystemAdmin-only while PRD personas are managers. | 09 | G9-Q-04, G9-Q-05 | P0 |
| D-17 | Which roles may edit workflows, automations and forms? | No role gating on automation edits. | 08 | G8-Q-19 | P1 |
| D-18 | Which roles may view all inbox threads, assign threads, and edit Website/Companion settings? | No gating exists today. | 04 | G4-Q-19 | P1 |
| D-19 | Which roles may open Reports (especially Revenue and Team sources) and the Overview, and should /admin/reports and /admin/campaigns exist? | Financial and team data are exposed to all roles. | 01 | G1-Q-16 | P1 |
| D-20 | Which roles may see other providers' appointments, book for others, cancel, and edit availability? | No role rules for appointments. | 06 | G6-Q-12 | P1 |
| D-21 | Which roles may delete a task, and does Tasks by me mean created by me (and can practice managers see all practice tasks)? | Task delete and visibility rules are undefined. | 05 | G5-Q-14, G5-Q-10 | P2 |

## 3. Client identity, matching and records

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-22 | What is the single matching rule for every entry point (manual, kiosk, website, webmail, portal, import, inbox thread), for example exact phone (last 10 digits) OR exact email and never name alone; should manual create warn and offer the existing contact; what happens when Auto Create Contact is off; how is an unknown number linked to a client; and for a kiosk walk-in match, link, offer the household picker or create new? | Every channel dedupes differently, risking duplicate or wrongly merged patient records. | 02, 04, 11 | G2-Q-01, G4-Q-17, G4-Q-20, G11-Q-22 | P0 |
| D-23 | Which fields may a form submission overwrite on a matched client, and do portal form answers stay as a submission record or update client fields (allergies, DOB, insurance)? | Overwriting clinical fields from a form can corrupt records. | 08, 12 | G8-Q-14, G12-Q-10 | P0 |
| D-24 | What is the minimum required field set to create a client (Name only, phone or email, DOB/gender)? | Create rules differ between manual, form and PRD. | 02, 08 | G2-Q-07, G8-Q-15 | P1 |
| D-25 | Are contact categories, saved filters and section layouts org-wide (admin-managed/shared) or per user? | Built layout changes apply to all contacts; scope of the others is unspecified. | 02 | G2-Q-03, G2-Q-06, G2-Q-10 | P2 |
| D-26 | What are the CSV import rules (column mapping, duplicate handling, error report) and does export cover the current filter or the whole database? | Import/export behaviour is unspecified. | 02 | G2-Q-08, G2-Q-09 | P2 |
| D-27 | Should the client profile have Claims, Calls, Chats and Tasks tabs, or are activity entries enough? | PRD and build differ. | 02 | G2-Q-05 | P2 |
| D-28 | Should Send Invite go through email/SMS/WhatsApp with a copyable link, and should staff ever open the portal on a patient's behalf? | An unused invite modal exists; staff-as-patient access is a privacy question. | 02, 12 | G2-Q-04 | P1 |
| D-29 | Should seed/demo contacts be deletable and editable like any other? | Demo data behaviour is undefined. | 02 | G2-Q-12 | P2 |
| D-30 | Should field keys be editable, can system fields and sections be edited, may a tenant edit or delete admin-defined fields, what defines a unique key, and what is the formula for per-user credits and usage columns? | Admin-defined custom field rules and usage columns are undefined. | 10, 13 | G13-Q-18, G10-Q-14 | P1 |
| D-31 | What should be logged for inbox threads with no linked client, and where? | Messages from unlinked threads leave no trace. | 04 | G4-Q-22 | P2 |

## 4. Deleting and deactivating referenced records

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-32 | Can a catalogue item, claim, room, process, stage or seeded plan/category/form/template be deleted once referenced, or only deactivated; and when a stage is deleted must its clients be moved to a replacement stage? | Deleting referenced records can orphan invoices, appointments and clients. | 07, 08, 09, 13 | G7-Q-20, G9-Q-15, G8-Q-04, G8-Q-03, G13-Q-33 | P1 |
| D-33 | Can call logs and Scribe sessions be deleted, by whom, with what confirmation, retention and audit trail? | Clinical and call records have no deletion rules. | 03 | G3-Q-05 | P0 |

## 5. Consent, biometrics and privacy (kiosk, Scribe, voice)

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-34 | Is patient consent required before ambient recording and voice capture (Scribe, kiosk speech to a server), captured per session or per patient, and what notice and storage apply? | Recording and sending patient voice to a server has no consent rule. | 03, 11 | G3-Q-11, G11-Q-12 | P0 |
| D-35 | How are biometric consent and its withdrawal handled: staff capture before Enroll Face Check-in, withdrawal at the kiosk itself, and is a persistent camera notice pill required? | Face enrolment has no defined consent flow. | 11 | G11-Q-23, G11-Q-10, G11-Q-05 | P0 |
| D-36 | Is the visitor-typed age enough to exclude minors from biometrics, or is a DOB or guardian step needed? | Biometric use on minors is a compliance risk. | 11 | G11-Q-07 | P0 |
| D-37 | What protection at rest and retention period apply to stored face templates? | Biometric data storage rules are undefined. | 11 | G11-Q-28 | P0 |
| D-38 | What is the retention period for scribe audio, transcripts and call recordings (the 90-day setting is unused)? | Retention is configured but not applied. | 03 | G3-Q-16 | P0 |
| D-39 | Which details may appear on screen or be spoken in a public lobby after verification (full name, phone, patient ID, bill count and amount)? | Patient data could be exposed in a public space. | 11 | G11-Q-06 | P0 |
| D-40 | What safeguards apply to face match: second check on a duplicate-face warning, fallback to phone when several faces match, and may a face match unlock Billing? | Weak match handling risks identifying or billing the wrong person. | 11 | G11-Q-24, G11-Q-26, G11-Q-11 | P0 |
| D-41 | What may a successful verification authorise, for how long, and is it bound to the one patient or household chosen? | Scope of a verified session is undefined. | 11 | G11-Q-04 | P1 |

## 6. Audit, retention and tenant isolation

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-42 | Which events must be audited (patient access, kiosk biometric and arrival events, exports, platform and admin actions, sign-ins), and must the log be immutable with signed export? | Audit coverage is undefined across client and admin consoles. | 10, 11, 13 | G10-Q-18, G11-Q-17, G13-Q-16 | P0 |
| D-43 | Should the client audit log show only this organisation's events, what may a tenant see about platform staff actions on its account, and must tenants never see /organizations or other organisations' audit entries (and is the owner invite emailed or copied)? | Cross-tenant visibility is a data-isolation risk. | 10, 13 | G10-Q-01, G13-Q-03 | P0 |
| D-44 | Are the logo (size, formats), brand colour and tax ID on receipts in scope for organisation profile, and may a client administrator see or create other organisations? | Org profile fields and multi-org rights are unclear. | 10 | G10-Q-12 | P1 |

## 7. Authentication, onboarding and invitations

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-45 | What is the staff authentication model (password hash, emailed code, expiry, lockout, forgot password, SSO), where do security policies live and how are they enforced, how is the current password verified, is idle lock required (lock or sign out), and what happens when sign-up uses an email that already has an account? | The prototype has no real authentication. | 10, 14 | G14-Q-01, G14-Q-03, G10-Q-10, G10-Q-20 | P0 |
| D-46 | What is the patient/visitor authentication model: real OTP by SMS/email, lifetime, retry and lockout limits (OTP and face), session length, passwords, client ID login, duplicate phone/email at registration, and how is the OTP delivered in production (demo code only behind a flag)? | Portal and kiosk verification is demo-only. | 11, 12 | G12-Q-01, G11-Q-02, G11-Q-03 | P0 |
| D-47 | What is the invitation model (emailed secure link with Pending, resend, 7-day expiry, revoke, vs instant add), and what role does an invited owner get? | PRD and build differ; owner role and link lifetime unset. | 10, 14 | G10-Q-04, G14-Q-04 | P1 |
| D-48 | Should free sign-up accounts have a trial length and a conversion step, and should the app block users until onboarding and payment are complete? | Free-to-paid path is undefined. | 14 | G14-Q-13, G14-Q-05 | P1 |
| D-49 | Are the voice and quick-form onboarding variants shipped, replacing the wizard, or deleted, and which is the default? | Three variants exist. | 14 | G14-Q-06 | P2 |
| D-50 | Should onboarding answers choose industry workflow templates, automations or sidebar template; is Industries the master for onboarding and scope pickers (and what happens when a category is deleted, are terminology overrides still wanted); and should admin Products/Services and KB items be provisioned to tenants? | Onboarding answers currently drive nothing; blueprints imply they should. | 13, 14 | G14-Q-08, G13-Q-11, G13-Q-13 | P1 |
| D-51 | Should admins edit a published template via draft/version rather than live tenant workflows, should workflows be deletable, and does the Admin Control Hide tick mean tenants may hide or visible to tenants? | Template edits affect live tenants; Hide semantics are ambiguous. | 13 | G13-Q-12, G13-Q-14 | P1 |
| D-52 | Should My Profile always open the signed-in user's own record, and does every user manage their own notification preferences? | Today only System Admin manages notifications. | 14 | G14-Q-10 | P2 |
| D-53 | What is the referral reward formula, per-plan rate, payout method, cap and attribution method? | Referral rules are undefined. | 14 | G14-Q-11 | P2 |

## 8. Plans, billing and credits

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-54 | Which plan tier names are canonical (Starter/Growth/Enterprise vs Starter/Professional/Enterprise/Custom vs Free/Starter/Growth/Professional vs Custom/Scale) and what are the plan change rules (confirmation, proration, effective date, downgrade limits)? | Three vocabularies coexist. | 10, 13, 14 | G13-Q-06, G10-Q-06 | P0 |
| D-55 | Do plan modules, features and seats gate tenant features; does adding a member block, warn or auto-bill at the seat limit; what happens to over-limit users on downgrade; do plan edits reach existing subscribers; and can a plan with subscribers be deleted? | Plan enforcement drives revenue and is not defined. | 10, 13 | G13-Q-07, G10-Q-02 | P0 |
| D-56 | What is the monthly credit renewal rule and what happens when a tenant runs out of credits? | Revenue and service continuity risk. | 13 | G13-Q-08 | P0 |
| D-57 | How do top-ups work (fixed bundles or custom amounts, price source, payment method, invoice, confirm card removal) and what are the credit meter colour thresholds (500-1,000 undefined)? | Credit purchase and warning rules are undefined. | 10 | G10-Q-07, G10-Q-08 | P1 |
| D-58 | Is the 20% yearly discount rule confirmed, and are credit rates read from admin? | Pricing page may not reflect admin values. | 14 | G14-Q-09 | P1 |
| D-59 | Which subscription dataset is canonical, must tenant purchases create Orders, and may a Paid order be cancelled without refund? | Subscriptions and orders are separate stores. | 13 | G13-Q-10 | P1 |
| D-60 | What is the currency model for packs, base rates, catalogue items and MRR totals (single USD or per org), and what does the Workspace Billing All connected subtext mean? | Prices show in dollars while some flows are INR. | 07, 13 | G7-Q-03, G13-Q-09, G13-Q-26 | P1 |
| D-61 | Which telephony model applies: who places click-to-dial calls (trunk or softphone), are numbers self-service, imported or admin-allocated with what charge and process assignment, and should admin numbers and carriers appear in client Integrations and AI Receptionist? | Number ownership and cost rules are undefined. | 03, 10, 13 | G10-Q-15, G13-Q-15, G3-Q-04 | P1 |

## 9. Payments, refunds and revenue definitions

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-62 | Which payment gateway and rails (card, Apple/Google Pay, UPI/INR QR) are used, where do credentials live and is Stripe Connect client or admin only, what are the failed-payment, retry and receipt rules, and which currency and payee does the kiosk QR use? | Payment flow is a mock and mixes INR and USD. | 10, 11, 12, 14 | G12-Q-04, G14-Q-07, G10-Q-16, G11-Q-21 | P0 |
| D-63 | What counts as Paid: can an invoice move to Paid without a recorded payment (and by which role), should a Kanban drop on Paid open Record Payment, and may the kiosk mark an invoice Paid on tapping I Have Paid? | Paid status without confirmed money is a revenue risk. | 07, 11 | G7-Q-05, G11-Q-01 | P0 |
| D-64 | For prepaid bookings, is the invoice the full price or the deposit, must payment be captured before confirmation, and how long is a slot held during checkout? | Prepaid booking money flow is undefined. | 06, 12 | G6-Q-08, G12-Q-06 | P0 |
| D-65 | What happens on cancelling a paid or prepaid appointment (refund, credit note, keep paid) and does a no-show create a fee or touch the invoice? | Refund and fee rules are undefined. | 06 | G6-Q-09, G6-Q-10 | P0 |
| D-66 | How are write-offs stored and reported (not as cash), and do they need approval or a role? | Write-offs could be counted as cash. | 07 | G7-Q-06 | P0 |
| D-67 | Which invoice statuses count as revenue, billed, collected, Outstanding, Total Invoiced and Paid This Month (payment date in the calendar month), and is collection rate measured within 60 days of invoice date or due date? | Revenue KPIs depend on the status mapping. | 01, 07 | G1-Q-12, G7-Q-08, G7-Q-11, G7-Q-12 | P0 |
| D-68 | What is the invoice status vocabulary and mapping to stages, and should a Void stage be seeded by default? | Statuses differ between PRD and workflow stages. | 07 | G7-Q-04 | P0 |
| D-69 | What tax applies to a line with no tax rate (0%, item tax, org default), and where is discount entered, as amount or percent, before tax? | Totals depend on these defaults. | 07 | G7-Q-09, G7-Q-10 | P0 |
| D-70 | What are the invoice and claim number formats, is numbering per organisation, and must claim numbers be unique? | Numbering affects compliance and exports. | 07 | G7-Q-07, G7-Q-18 | P1 |
| D-71 | Which invoice fields stay editable after Sent? | Post-send edits alter issued documents. | 07 | G7-Q-22 | P1 |
| D-72 | Should invoice creation be gated by an invoice automation, and should patient-portal bookings follow the clinic's appointment automation required setting? | Portal currently overrides the setting. | 07, 12 | G7-Q-13, G12-Q-07 | P1 |
| D-73 | Should the patient balance be broken down by copay, diagnostics, pharmacy, and which invoice categories apply? | Portal billing detail is unspecified. | 12 | G12-Q-08 | P2 |
| D-74 | Should inactive catalogue items exist (toggle, Status column, historic invoices), which category list is canonical (can users add categories), and should non-bookable items have an editable duration? | Catalogue model differs from PRD. | 07 | G7-Q-01, G7-Q-02, G7-Q-21 | P2 |

## 10. Claims and clinical documentation

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-75 | Which claims process (Insurance and Claims vs Claims Management) and status set (Accepted vs Acknowledged, Denied vs Rejected) are canonical, with a single stage-to-status mapping? | Claim vocabularies conflict. | 07 | G7-Q-14 | P1 |
| D-76 | Should claims be built from appointment, invoice and AI Scribe data, should insurance payments on invoices update claims, and what should Scribe push to invoices and claims (suggested services or CPT codes and fees; ICD-10 only with clinician confirmation)? | Data flow into billing is unspecified and clinically sensitive. | 03, 07 | G7-Q-15, G3-Q-14 | P1 |
| D-77 | What are the formula and data source (payer contract, ERA) for Allowed Amount and Patient Responsibility? | Claim amounts cannot be computed. | 07 | G7-Q-17 | P1 |
| D-78 | Which claim fields are mandatory, is provider NPI taken from Team credentials, and are NPI, licence and taxonomy in scope? | Claim validity depends on provider identifiers. | 07, 10 | G7-Q-23, G10-Q-11 | P1 |
| D-79 | Which note template applies (4-part SOAP vs 11-section prescription layout; per specialty), who can sign off, what locks, and how are amendments and versions handled; is the prescription filed on save or sign-off? | Clinical record legal status is undefined. | 03 | G3-Q-12, G3-Q-13, G3-Q-18 | P1 |
| D-80 | When Scribe starts without context and Invoice, Insurance or Claim is chosen as linked entity, must the user pick the specific record? | Orphan links possible. | 03 | G3-Q-17 | P2 |
| D-81 | Which speech-to-text engine is named in the product (Whisper vs Deepgram Nova-2 Medical)? | PRD and help copy disagree. | 03 | G3-Q-15 | P2 |
| D-82 | What do the 1-5 star ratings on calls and Scribe sessions measure and where are they reported? | Ratings have no definition. | 03 | G3-Q-20 | P2 |

## 11. Calls, call logs and metrics

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-83 | What is the canonical call outcome set (Completed/Missed/Voicemail vs Completed/Failed/Pending/In Progress vs BUSY/NO ANSWER), with one data source shared by Overview, Reports and Call Logs? | Three vocabularies drive different counts. | 01, 03 | G1-Q-03, G3-Q-01 | P0 |
| D-84 | How are Avg Duration, success rate (denominator), Missed and Incomplete (with or without No answer/Busy/Cancelled) defined, and over which date scope? | KPI numbers vary by definition. | 01, 13 | G1-Q-02, G1-Q-09, G13-Q-21 | P1 |
| D-85 | Is Call Logs telephone-only or does it include SMS, WhatsApp and kiosk events, is each call its own entry, and how are human-handled calls and AI-to-human transfers represented? | Current log overwrites one entry per client and process. | 03 | G3-Q-02, G3-Q-07 | P1 |
| D-86 | Which columns (Phone, Assigned Process vs Previous/Last Stage) and which call-detail surface (drawer vs /call-logs/:id page) are canonical? | PRD and build differ. | 03 | G3-Q-03, G3-Q-08 | P2 |
| D-87 | What are the formulas and sources for call review metrics (happiness, disconnect reason, barge-in, loop, sentiment, warmth, silence, follow-up date), and should the Call Review tab be shown? | Metrics are displayed without a defined source. | 03 | G3-Q-06 | P1 |
| D-88 | What is the retry policy (what counts as retry, maximum attempts, spacing)? | Retry tab exists without rules. | 03 | G3-Q-19 | P2 |
| D-89 | Should a call that books an appointment link to it, and can staff create a task from a call? | Cross-module links are missing. | 03 | G3-Q-09 | P2 |

## 12. Dashboard, reports and admin analytics

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-90 | What are the conversion funnel definition (stages from selected process; ever reached vs currently in), Performance Analysis insights (calculate or remove), and where do dashboard filter options and reporting periods (calendar vs rolling, Last Run) come from? | Charts show numbers with no stated formula. | 01 | G1-Q-04, G1-Q-05, G1-Q-06, G1-Q-11 | P1 |
| D-91 | Which tasks appear in Active Tasks on the Overview (mine or team, which statuses, admin-scope tasks)? | Scope is unspecified. | 01 | G1-Q-07 | P2 |
| D-92 | Which pre-built read-only report templates ship, which live module feeds each source, and should Messaging be a data source? | Builder sources are unspecified. | 01 | G1-Q-10, G1-Q-18 | P1 |
| D-93 | Can filter changes in the viewer be saved back to the report or as a new report, and what should % Total do? | Viewer behaviour is unspecified. | 01 | G1-Q-13, G1-Q-17 | P2 |
| D-94 | Is CSV export enough, or are XLSX and PDF required? | PRD requires more than build. | 01 | G1-Q-14 | P2 |
| D-95 | What is the report sharing model (users, roles, teams; view or edit) behind the Shared badge? | Sharing is unspecified and affects data access. | 01 | G1-Q-15 | P1 |
| D-96 | What are the formulas and sources for admin Overview (Organizations, Active Agents, Calls Processed, Automations, Net MRR, Resolution, volume chart, health, ranking) and Organization Usage (users, numbers, calls, storage, tasks, AI accuracy, storage quota, numbers in use per provider)? | Admin metrics have no definitions. | 13 | G13-Q-20, G13-Q-22, G13-Q-27 | P1 |
| D-97 | What is the Process Movement metric set and bottleneck rule (dwell threshold)? | Bottleneck flagged without rule. | 13 | G13-Q-23 | P2 |
| D-98 | What are the formulas for Revenue metrics (MRR, ARR, settled, collection rate, open, overdue, tier mix, growth) and Subscriptions Renewal Rate? | Finance KPIs undefined. | 13 | G13-Q-24, G13-Q-25 | P1 |
| D-99 | What are the formulas for Submissions 7d, Active forms, Top performer, Usage (plan limit 300), execution count/success rate/audit log on the rules table, and Runs this week? | Workflow and form tiles lack formulas. | 08 | G8-Q-16, G8-Q-09, G8-Q-10 | P2 |

## 13. Process pipeline and tasks

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-100 | Do Kanban and List show one shared set of process records (one per client per process), what do Kanban card Edit and Call do, should there be an All processes list with a Process Name column, and should the detail drawer get its own PRD (with cross-process hand-off)? | Views and data model are inconsistent. | 05 | G5-Q-01, G5-Q-05, G5-Q-23 | P1 |
| D-101 | Does a process record carry a monetary value (column totals, weighted forecast, stage probabilities), and should a kiosk walk-in registration create a deal and with what amount? | Pipeline value and forecast depend on this. | 05, 11 | G5-Q-02, G11-Q-25 | P1 |
| D-102 | What starts the days-in-stage clock and is the SLA threshold configured per stage in Workflows? | Timers have no start rule. | 05 | G5-Q-03 | P2 |
| D-103 | Can a card move to any stage or only adjacent ones, and are final (won/lost) stages locked? | Stage movement rules are undefined. | 05 | G5-Q-04 | P1 |
| D-104 | Is Responsible per process record or per client, and which List row and bulk actions (Edit, Delete, bulk reassign, move, Trigger Calls) are in scope? | Today Responsible is the client owner. | 05 | G5-Q-07, G5-Q-08 | P2 |
| D-105 | Should Admin role-targeted tasks appear in clinic My Tasks (how is the role matched to a user), should Admin tasks target specific organisations, and keep or drop the STAGE column in /admin/tasks? | Admin and clinic task scopes overlap. | 05 | G5-Q-09, G5-Q-20, G5-Q-21 | P1 |
| D-106 | Is Client Portal share disabled for Admin tasks, and should portal-scoped tasks with no named patient appear for every patient? | Patient-visible task exposure. | 05, 12 | G5-Q-15, G12-Q-19 | P1 |
| D-107 | Who receives each task notification (assignee, observers, creator, platform admin), and should the Task Assigned chat notice be a card? | Recipients are unspecified. | 05, 12 | G5-Q-16, G12-Q-20 | P1 |
| D-108 | Does Mark Completed close the task for everyone or just my deliverables, how does a creator reach Overall Completion, and what happens to completion on edit? | Completion semantics are ambiguous. | 05 | G5-Q-11, G5-Q-12, G5-Q-19 | P2 |
| D-109 | Is recurrence created on completion or a fixed schedule (copying deliverables and people), and should a passed deadline move the task to Task Overdue? | Recurrence and overdue stage rules are undefined. | 05 | G5-Q-13, G5-Q-17 | P2 |

## 14. Workflow automation and forms

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-110 | Which workflow steps must really execute (delay, SMS, WhatsApp, Email, webhook, assign human, create records, Create task), and until then should they be hidden or marked not live? | Unimplemented steps look configured and live. | 05, 08 | G8-Q-01, G5-Q-18 | P0 |
| D-111 | After a form submission, should a task be created and staff notified, and should the new client enter the stage and fire stage automations? | No automation event is emitted today. | 08 | G8-Q-08 | P1 |
| D-112 | Where are forms publicly hosted and when does sharing actually send SMS, WhatsApp or email; is conditional logic in forms in scope? | Sharing is simulated. | 08 | G8-Q-13, G8-Q-12 | P1 |
| D-113 | What should Temporary Disable do, must once-per-event be persistent and longer cycles blocked at save, and should check-in rules exist? | Rule behaviour is undefined. | 08 | G8-Q-05, G8-Q-11 | P2 |

## 15. Appointments and scheduling

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-114 | What is the canonical appointment status list (Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show vs Booked, Reminder, Completed, Reschedule, No-show), should a default Cancelled stage exist, and which List columns are required? | PRD and workflow stages differ. | 06 | G6-Q-03 | P0 |
| D-115 | Are Day/Week views with provider columns required for MVP, and does clicking an appointment open Details or Reschedule? | Calendar scope undefined. | 06 | G6-Q-01 | P1 |
| D-116 | Rooms: keep auto-allocation, add manual override, or both; is a room double-booking warning required; and how do cancelled and no-show appointments look? | Room logic is partly built. | 06 | G6-Q-02 | P2 |
| D-117 | Is overlap the conflict rule, do completed or no-show appointments free the slot, can staff override with a warning, and may reschedule change provider, service or location; what are the patient reschedule and cancel rules (24-hour, reason, who is told)? | Scheduling integrity and patient rules. | 06, 12 | G6-Q-07, G6-Q-15, G12-Q-05 | P1 |
| D-118 | Are buffers set per provider, service or location and do they apply in seat mode; do slots step by duration or fixed 15-minute marks; keep the cap of 3 shifts per day; are partial days off stored as time windows? | Availability engine rules. | 06 | G6-Q-05, G6-Q-06, G6-Q-16, G6-Q-17 | P2 |
| D-119 | Which booking sources can staff choose? | List of sources unspecified. | 06 | G6-Q-13 | P2 |
| D-120 | Is a time-based reminder (for example 24 hours before) required, or is the stage-entry WhatsApp step enough? | Reminder mechanism differs. | 06 | G6-Q-11 | P1 |
| D-121 | Should Today show every assigned pathway or only the most recently moved, and should a patient ever see a clinic switcher? | Companion Today screen scope. | 12 | G12-Q-17, G12-Q-18 | P2 |

## 16. Kiosk, check-in and queue

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-122 | Should kiosk or phone check-in set the appointment to Arrived (with arrival time, wait time, token, Mark Arrived button), should phone check-in create the same token and station allocation (geofence, notify doctor), and should check-in enforce early and late arrival windows? | Check-in behaviour differs across channels. | 06, 09, 11, 12 | G6-Q-04, G12-Q-02, G11-Q-09 | P1 |
| D-123 | How are Currently Serving, Patients Ahead, Estimated Wait and shortest queue defined (one rule for check-in, summary, My Visit and portal; live updates), and who owns the queue position? | Wait numbers are shown without a formula. | 11, 12 | G11-Q-13, G12-Q-03, G11-Q-16 | P1 |
| D-124 | Is the token one sequence per station per day with station prefixes from settings (fixed or editable), when does it reset, and how is station type set for Products and Services rooms? | Token and prefix rules conflict between PRD files. | 09, 11 | G11-Q-14, G9-Q-10, G9-Q-16 | P1 |
| D-125 | Should kiosk departments come from an explicit Room field, should Pharmacy/Labs/Restrooms always appear, should rooms table and kiosk room card show source badge, attached service, clinician, walking time and Start Check-in? | Department mapping uses service-name keywords. | 09, 11 | G11-Q-15, G9-Q-11, G11-Q-27 | P2 |
| D-126 | If a verified patient is in no AI-connected process, what should Next Step show, and should Default Onboarding Process list live Workflows (and which wins over the appointment default)? | Kiosk routing for patients outside workflows is undefined. | 09, 11 | G11-Q-19, G9-Q-09 | P1 |
| D-127 | Which AI channels read Knowledge Base sources (kiosk voice, phone agent, chatbots) and how does process/stage scope apply to someone not yet in a workflow? | AI answer sources are undefined. | 09 | G9-Q-01 | P1 |
| D-128 | How is the front desk alerted by Call Staff (notification, task, queue entry) and which kiosk; and should a stage move notify anyone by default or only via automations; is reschedule notification automatic, opt-in or automation-only? | Staff alert and notification triggers are undefined. | 05, 06, 11 | G11-Q-18, G5-Q-06, G6-Q-14 | P1 |
| D-129 | Where should Not me lead, and should the 60-second timer pause during payment save or face capture? | Kiosk flow details. | 11 | G11-Q-08, G11-Q-20 | P2 |
| D-130 | Should Greeting Phrase support per-language versions, where do Support Phone/Email appear on the kiosk, and what validation applies to Support Email, Support Phone and hex colour? | Kiosk branding fields unspecified. | 09 | G9-Q-07, G9-Q-08, G9-Q-06 | P2 |
| D-131 | Should KB tag presets be clinic-specific, what is the KB ID for, and what happens when file processing fails? | KB source management is unspecified. | 09 | G9-Q-02, G9-Q-03, G9-Q-13 | P2 |

## 17. AI behaviour, bots and emergencies

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-132 | What are the emergency escalation keywords, wording and staff alert for Companion and chat bots? | Patient safety path is undefined. | 04, 12 | G4-Q-21 | P0 |
| D-133 | What is the runtime for bot vs human routing: first responder, transfer phrases, routing modes, out-of-office text, channel order (PRD bot first; built clinician first), should Messages bot and Care Bot be one per-patient thread, who answers when human first, should bot answers carry buttons and balance, and where do clinic hours come from? | Settings exist but are not applied. | 04, 12 | G4-Q-18, G12-Q-12, G12-Q-13 | P1 |
| D-134 | Are model choice, temperature, emergency guardrail and speech rate client or admin settings (single or several active models), what do tenants get when no model or voice is active, and where do context window and latency come from? | Ownership and defaults of AI settings are unclear. | 10, 13 | G10-Q-13, G13-Q-17, G13-Q-28 | P1 |

## 18. Messaging channels and compliance

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-135 | Should the 24h WhatsApp window countdown and lock be restored, and in which release? | Window was disabled per user request; policy risk. | 04 | G4-Q-10 | P0 |
| D-136 | Are templates allowed on SMS or WhatsApp only, what are the template approval states and who sets them (Meta webhook vs manual), and what happens when a variable has no value? | Template compliance is undefined. | 04 | G4-Q-13, G4-Q-14 | P1 |
| D-137 | What are attachment limits and allowed types per channel (25MB exceeds carrier limits), accepted portal file types and sizes, and how do staff verify patient uploads (PDF viewer, zoom, watermark)? | Limits conflict across PRDs and carriers. | 04, 12 | G4-Q-08, G12-Q-11 | P1 |
| D-138 | What are the care group rules: shown outside Companion, Private/Public type (are public groups visible to every patient), archive vs auto-delete retention, and does leaving update the clinic side? | Public group exposure is a privacy risk. | 04, 12 | G4-Q-03, G4-Q-06, G4-Q-07, G12-Q-15 | P0 |
| D-139 | Should the inbox offer an All channels view, what is the thread sort rule, and is the number selector a list filter, outbound sender or both (persisted per user)? | Inbox structure differs from PRD. | 04 | G4-Q-01, G4-Q-02, G4-Q-11 | P1 |
| D-140 | Is open/resolved status with Unread and Assigned-to-me views for all channels, where does Resolve live, which roster is the assignee source and should assignment notify? | Thread ownership model undefined. | 04 | G4-Q-05, G4-Q-04 | P1 |
| D-141 | What is the source of delivery and read receipts per channel (does Website have them)? | Receipts are shown without a source. | 04 | G4-Q-09 | P2 |
| D-142 | What belongs in per-channel message actions (Copy, Quote, Resend, Forward) and where do they live? | UI detail. | 04 | G4-Q-12 | P2 |
| D-143 | Website widget: branch-synced read-only hours or custom days/times/timezone, and where does Test Widget Chat live? | Settings differ between PRD and build. | 04 | G4-Q-15, G4-Q-16 | P2 |

## 19. Notifications and patient profile

| ID | Decision needed | Why it matters | Affects | Source questions | Pri |
| :-- | :-- | :-- | :-- | :-- | :-- |
| D-144 | Is notification scope per organisation or per user, are channels added, and should the dashboard show a notifications panel? | Notification model is unspecified. | 01, 10 | G10-Q-17, G1-Q-08 | P1 |
| D-145 | Which profile fields can a patient edit directly vs by request, does changing phone/email need re-verification, and where do notification preferences live and who honours them? | Identity changes without verification are a security risk. | 12 | G12-Q-16 | P1 |
| D-146 | Where do a patient's prescriptions come from, should prices show, is pharmacy a drawer item or a stage, and how are refills routed? | Portal prescriptions have no source module. | 12 | G12-Q-14 | P1 |
| D-147 | Is there autosave and drafts, progress bar, mandatory signature per form type, lock after submit, what must the cryptographic timestamp prove, and does consent signing belong in the stage drawer or Forms? | Signed-form legal meaning is unclear. | 12 | G12-Q-09 | P1 |

## P0 decisions

- **D-01** Which names are canonical: Process vs Workflows vs Deals vs Pipeline, and Clients vs Contacts vs Patients (including whether Archived and Pending are real statuses)?
- **D-02** Is the PRD rewritten as a prototype-only description, or must it state backend requirements (live cross-device sync, server-side enforcement), and are PRD files for unbuilt admin features replaced by the as-built text or kept as a marked roadmap?
- **D-03** Is the Overview a call and automation analytics dashboard (as built), a clinical command centre (as PRD), or both?
- **D-11** What is the source of truth for role names and the role model (Admin/Doctor/Nurse/Coordinator/Billing vs Admin/Manager/Specialist/Reception/Sales/Agent/Executive; Admin roles vs Tenant role templates), how does an admin record link to a sign-in identity (default role), and what should Permitted Scope summarise?
- **D-12** Must permissions block direct URL access and each action (not only hide sidebar items), where is the role matrix enforced, what happens to an unknown role, who may open /admin/*, and are sidebar items gated by plan tier and role?
- **D-13** Which roles may delete, bulk-delete, import, export, add categories and mark fields required on clients, and must exports be audited?
- **D-14** Which roles may listen to recordings, read transcripts, run Scribe, select the responsible doctor and issue prescriptions?
- **D-15** Which roles may manage the catalogue, void invoices, write off, record payments, and create or submit claims?
- **D-16** Which roles may view, create, edit or delete Knowledge Base sources, and should Admin/Manager reach AI Receptionist settings (perhaps Rooms only)?
- **D-22** What is the single matching rule for every entry point (manual, kiosk, website, webmail, portal, import, inbox thread), for example exact phone (last 10 digits) OR exact email and never name alone; should manual create warn and offer the existing contact; what happens when Auto Create Contact is off; how is an unknown number linked to a client; and for a kiosk walk-in match, link, offer the household picker or create new?
- **D-23** Which fields may a form submission overwrite on a matched client, and do portal form answers stay as a submission record or update client fields (allergies, DOB, insurance)?
- **D-33** Can call logs and Scribe sessions be deleted, by whom, with what confirmation, retention and audit trail?
- **D-34** Is patient consent required before ambient recording and voice capture (Scribe, kiosk speech to a server), captured per session or per patient, and what notice and storage apply?
- **D-35** How are biometric consent and its withdrawal handled: staff capture before Enroll Face Check-in, withdrawal at the kiosk itself, and is a persistent camera notice pill required?
- **D-36** Is the visitor-typed age enough to exclude minors from biometrics, or is a DOB or guardian step needed?
- **D-37** What protection at rest and retention period apply to stored face templates?
- **D-38** What is the retention period for scribe audio, transcripts and call recordings (the 90-day setting is unused)?
- **D-39** Which details may appear on screen or be spoken in a public lobby after verification (full name, phone, patient ID, bill count and amount)?
- **D-40** What safeguards apply to face match: second check on a duplicate-face warning, fallback to phone when several faces match, and may a face match unlock Billing?
- **D-42** Which events must be audited (patient access, kiosk biometric and arrival events, exports, platform and admin actions, sign-ins), and must the log be immutable with signed export?
- **D-43** Should the client audit log show only this organisation's events, what may a tenant see about platform staff actions on its account, and must tenants never see /organizations or other organisations' audit entries (and is the owner invite emailed or copied)?
- **D-45** What is the staff authentication model (password hash, emailed code, expiry, lockout, forgot password, SSO), where do security policies live and how are they enforced, how is the current password verified, is idle lock required (lock or sign out), and what happens when sign-up uses an email that already has an account?
- **D-46** What is the patient/visitor authentication model: real OTP by SMS/email, lifetime, retry and lockout limits (OTP and face), session length, passwords, client ID login, duplicate phone/email at registration, and how is the OTP delivered in production (demo code only behind a flag)?
- **D-54** Which plan tier names are canonical (Starter/Growth/Enterprise vs Starter/Professional/Enterprise/Custom vs Free/Starter/Growth/Professional vs Custom/Scale) and what are the plan change rules (confirmation, proration, effective date, downgrade limits)?
- **D-55** Do plan modules, features and seats gate tenant features; does adding a member block, warn or auto-bill at the seat limit; what happens to over-limit users on downgrade; do plan edits reach existing subscribers; and can a plan with subscribers be deleted?
- **D-56** What is the monthly credit renewal rule and what happens when a tenant runs out of credits?
- **D-62** Which payment gateway and rails (card, Apple/Google Pay, UPI/INR QR) are used, where do credentials live and is Stripe Connect client or admin only, what are the failed-payment, retry and receipt rules, and which currency and payee does the kiosk QR use?
- **D-63** What counts as Paid: can an invoice move to Paid without a recorded payment (and by which role), should a Kanban drop on Paid open Record Payment, and may the kiosk mark an invoice Paid on tapping I Have Paid?
- **D-64** For prepaid bookings, is the invoice the full price or the deposit, must payment be captured before confirmation, and how long is a slot held during checkout?
- **D-65** What happens on cancelling a paid or prepaid appointment (refund, credit note, keep paid) and does a no-show create a fee or touch the invoice?
- **D-66** How are write-offs stored and reported (not as cash), and do they need approval or a role?
- **D-67** Which invoice statuses count as revenue, billed, collected, Outstanding, Total Invoiced and Paid This Month (payment date in the calendar month), and is collection rate measured within 60 days of invoice date or due date?
- **D-68** What is the invoice status vocabulary and mapping to stages, and should a Void stage be seeded by default?
- **D-69** What tax applies to a line with no tax rate (0%, item tax, org default), and where is discount entered, as amount or percent, before tax?
- **D-83** What is the canonical call outcome set (Completed/Missed/Voicemail vs Completed/Failed/Pending/In Progress vs BUSY/NO ANSWER), with one data source shared by Overview, Reports and Call Logs?
- **D-110** Which workflow steps must really execute (delay, SMS, WhatsApp, Email, webhook, assign human, create records, Create task), and until then should they be hidden or marked not live?
- **D-114** What is the canonical appointment status list (Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show vs Booked, Reminder, Completed, Reschedule, No-show), should a default Cancelled stage exist, and which List columns are required?
- **D-132** What are the emergency escalation keywords, wording and staff alert for Companion and chat bots?
- **D-135** Should the 24h WhatsApp window countdown and lock be restored, and in which release?
- **D-138** What are the care group rules: shown outside Companion, Private/Public type (are public groups visible to every patient), archive vs auto-delete retention, and does leaving update the clinic side?

## Quick wins (answerable in one line)

- **D-06** Should every destructive action ask for confirmation (and remove dead pages), including deleting a stage automation?
- **D-09** Which document tag syntax ({{patient.name}} vs {client_name}) and category list is canonical?
- **D-10** Which additional guide topics are required, and should unknown topics show not found?
- **D-24** What is the minimum required field set to create a client (Name only, phone or email, DOB/gender)?
- **D-27** Should the client profile have Claims, Calls, Chats and Tasks tabs, or are activity entries enough?
- **D-29** Should seed/demo contacts be deletable and editable like any other?
- **D-52** Should My Profile always open the signed-in user's own record, and does every user manage their own notification preferences?
- **D-58** Is the 20% yearly discount rule confirmed, and are credit rates read from admin?
- **D-81** Which speech-to-text engine is named in the product (Whisper vs Deepgram Nova-2 Medical)?
- **D-94** Is CSV export enough, or are XLSX and PDF required?
- **D-106** Is Client Portal share disabled for Admin tasks, and should portal-scoped tasks with no named patient appear for every patient?
- **D-119** Which booking sources can staff choose?
- **D-129** Where should Not me lead, and should the 60-second timer pause during payment save or face capture?

## Unlinked decision markers

Every `Decision needed (see Gx-Q-yy)` marker in section D of the modules points to a question ID that exists in the lists above. Markers that carry no question ID:

- `04-chats.md` line 762, F-2 24h window, marked only `Decision needed.` Likely G4-Q-10 (mapped to D-135) but not stated in the file.
- `08-workflows-webforms.md` line 686, F-5 Dashboard Metrics, marked only `Decision needed.` Likely G8-Q-16 (mapped to D-99) but not stated in the file.
- Five other lines containing the phrase (`04-chats.md` 353, `05-process-tasks.md` 397, `07-services-invoices-claims.md` 360, `12-companion.md` 390, `13-super-admin.md` 823) are explanatory preambles, not markers.
- 41 source questions have no `Decision needed` marker in section D. They are still in the index.

## Index: source question to decision

Rows: 285. Source questions: 285.

| Source question | Decision |
| :-- | :-- |
| G1-Q-01 | D-03 |
| G1-Q-02 | D-84 |
| G1-Q-03 | D-83 |
| G1-Q-04 | D-90 |
| G1-Q-05 | D-90 |
| G1-Q-06 | D-90 |
| G1-Q-07 | D-91 |
| G1-Q-08 | D-144 |
| G1-Q-09 | D-84 |
| G1-Q-10 | D-92 |
| G1-Q-11 | D-90 |
| G1-Q-12 | D-67 |
| G1-Q-13 | D-93 |
| G1-Q-14 | D-94 |
| G1-Q-15 | D-95 |
| G1-Q-16 | D-19 |
| G1-Q-17 | D-93 |
| G1-Q-18 | D-92 |
| G2-Q-01 | D-22 |
| G2-Q-02 | D-13 |
| G2-Q-03 | D-25 |
| G2-Q-04 | D-28 |
| G2-Q-05 | D-27 |
| G2-Q-06 | D-25 |
| G2-Q-07 | D-24 |
| G2-Q-08 | D-26 |
| G2-Q-09 | D-26 |
| G2-Q-10 | D-25 |
| G2-Q-11 | D-01 |
| G2-Q-12 | D-29 |
| G3-Q-01 | D-83 |
| G3-Q-02 | D-85 |
| G3-Q-03 | D-86 |
| G3-Q-04 | D-61 |
| G3-Q-05 | D-33 |
| G3-Q-06 | D-87 |
| G3-Q-07 | D-85 |
| G3-Q-08 | D-86 |
| G3-Q-09 | D-89 |
| G3-Q-10 | D-14 |
| G3-Q-11 | D-34 |
| G3-Q-12 | D-79 |
| G3-Q-13 | D-79 |
| G3-Q-14 | D-76 |
| G3-Q-15 | D-81 |
| G3-Q-16 | D-38 |
| G3-Q-17 | D-80 |
| G3-Q-18 | D-79 |
| G3-Q-19 | D-88 |
| G3-Q-20 | D-82 |
| G4-Q-01 | D-139 |
| G4-Q-02 | D-139 |
| G4-Q-03 | D-138 |
| G4-Q-04 | D-140 |
| G4-Q-05 | D-140 |
| G4-Q-06 | D-138 |
| G4-Q-07 | D-138 |
| G4-Q-08 | D-137 |
| G4-Q-09 | D-141 |
| G4-Q-10 | D-135 |
| G4-Q-11 | D-139 |
| G4-Q-12 | D-142 |
| G4-Q-13 | D-136 |
| G4-Q-14 | D-136 |
| G4-Q-15 | D-143 |
| G4-Q-16 | D-143 |
| G4-Q-17 | D-22 |
| G4-Q-18 | D-133 |
| G4-Q-19 | D-18 |
| G4-Q-20 | D-22 |
| G4-Q-21 | D-132 |
| G4-Q-22 | D-31 |
| G5-Q-01 | D-100 |
| G5-Q-02 | D-101 |
| G5-Q-03 | D-102 |
| G5-Q-04 | D-103 |
| G5-Q-05 | D-100 |
| G5-Q-06 | D-128 |
| G5-Q-07 | D-104 |
| G5-Q-08 | D-104 |
| G5-Q-09 | D-105 |
| G5-Q-10 | D-21 |
| G5-Q-11 | D-108 |
| G5-Q-12 | D-108 |
| G5-Q-13 | D-109 |
| G5-Q-14 | D-21 |
| G5-Q-15 | D-106 |
| G5-Q-16 | D-107 |
| G5-Q-17 | D-109 |
| G5-Q-18 | D-110 |
| G5-Q-19 | D-108 |
| G5-Q-20 | D-105 |
| G5-Q-21 | D-105 |
| G5-Q-22 | D-01 |
| G5-Q-23 | D-100 |
| G6-Q-01 | D-115 |
| G6-Q-02 | D-116 |
| G6-Q-03 | D-114 |
| G6-Q-04 | D-122 |
| G6-Q-05 | D-118 |
| G6-Q-06 | D-118 |
| G6-Q-07 | D-117 |
| G6-Q-08 | D-64 |
| G6-Q-09 | D-65 |
| G6-Q-10 | D-65 |
| G6-Q-11 | D-120 |
| G6-Q-12 | D-20 |
| G6-Q-13 | D-119 |
| G6-Q-14 | D-128 |
| G6-Q-15 | D-117 |
| G6-Q-16 | D-118 |
| G6-Q-17 | D-118 |
| G7-Q-01 | D-74 |
| G7-Q-02 | D-74 |
| G7-Q-03 | D-60 |
| G7-Q-04 | D-68 |
| G7-Q-05 | D-63 |
| G7-Q-06 | D-66 |
| G7-Q-07 | D-70 |
| G7-Q-08 | D-67 |
| G7-Q-09 | D-69 |
| G7-Q-10 | D-69 |
| G7-Q-11 | D-67 |
| G7-Q-12 | D-67 |
| G7-Q-13 | D-72 |
| G7-Q-14 | D-75 |
| G7-Q-15 | D-76 |
| G7-Q-16 | D-15 |
| G7-Q-17 | D-77 |
| G7-Q-18 | D-70 |
| G7-Q-19 | D-05 |
| G7-Q-20 | D-32 |
| G7-Q-21 | D-74 |
| G7-Q-22 | D-71 |
| G7-Q-23 | D-78 |
| G8-Q-01 | D-110 |
| G8-Q-02 | D-07 |
| G8-Q-03 | D-32 |
| G8-Q-04 | D-32 |
| G8-Q-05 | D-113 |
| G8-Q-06 | D-06 |
| G8-Q-07 | D-08 |
| G8-Q-08 | D-111 |
| G8-Q-09 | D-99 |
| G8-Q-10 | D-99 |
| G8-Q-11 | D-113 |
| G8-Q-12 | D-112 |
| G8-Q-13 | D-112 |
| G8-Q-14 | D-23 |
| G8-Q-15 | D-24 |
| G8-Q-16 | D-99 |
| G8-Q-17 | D-01 |
| G8-Q-18 | D-08 |
| G8-Q-19 | D-17 |
| G9-Q-01 | D-127 |
| G9-Q-02 | D-131 |
| G9-Q-03 | D-131 |
| G9-Q-04 | D-16 |
| G9-Q-05 | D-16 |
| G9-Q-06 | D-130 |
| G9-Q-07 | D-130 |
| G9-Q-08 | D-130 |
| G9-Q-09 | D-126 |
| G9-Q-10 | D-124 |
| G9-Q-11 | D-125 |
| G9-Q-12 | D-04 |
| G9-Q-13 | D-131 |
| G9-Q-14 | D-02 |
| G9-Q-15 | D-32 |
| G9-Q-16 | D-124 |
| G10-Q-01 | D-43 |
| G10-Q-02 | D-55 |
| G10-Q-03 | D-12 |
| G10-Q-04 | D-47 |
| G10-Q-05 | D-11 |
| G10-Q-06 | D-54 |
| G10-Q-07 | D-57 |
| G10-Q-08 | D-57 |
| G10-Q-09 | D-05 |
| G10-Q-10 | D-45 |
| G10-Q-11 | D-78 |
| G10-Q-12 | D-44 |
| G10-Q-13 | D-134 |
| G10-Q-14 | D-30 |
| G10-Q-15 | D-61 |
| G10-Q-16 | D-62 |
| G10-Q-17 | D-144 |
| G10-Q-18 | D-42 |
| G10-Q-19 | D-05 |
| G10-Q-20 | D-45 |
| G11-Q-01 | D-63 |
| G11-Q-02 | D-46 |
| G11-Q-03 | D-46 |
| G11-Q-04 | D-41 |
| G11-Q-05 | D-35 |
| G11-Q-06 | D-39 |
| G11-Q-07 | D-36 |
| G11-Q-08 | D-129 |
| G11-Q-09 | D-122 |
| G11-Q-10 | D-35 |
| G11-Q-11 | D-40 |
| G11-Q-12 | D-34 |
| G11-Q-13 | D-123 |
| G11-Q-14 | D-124 |
| G11-Q-15 | D-125 |
| G11-Q-16 | D-123 |
| G11-Q-17 | D-42 |
| G11-Q-18 | D-128 |
| G11-Q-19 | D-126 |
| G11-Q-20 | D-129 |
| G11-Q-21 | D-62 |
| G11-Q-22 | D-22 |
| G11-Q-23 | D-35 |
| G11-Q-24 | D-40 |
| G11-Q-25 | D-101 |
| G11-Q-26 | D-40 |
| G11-Q-27 | D-125 |
| G11-Q-28 | D-37 |
| G12-Q-01 | D-46 |
| G12-Q-02 | D-122 |
| G12-Q-03 | D-123 |
| G12-Q-04 | D-62 |
| G12-Q-05 | D-117 |
| G12-Q-06 | D-64 |
| G12-Q-07 | D-72 |
| G12-Q-08 | D-73 |
| G12-Q-09 | D-147 |
| G12-Q-10 | D-23 |
| G12-Q-11 | D-137 |
| G12-Q-12 | D-133 |
| G12-Q-13 | D-133 |
| G12-Q-14 | D-146 |
| G12-Q-15 | D-138 |
| G12-Q-16 | D-145 |
| G12-Q-17 | D-121 |
| G12-Q-18 | D-121 |
| G12-Q-19 | D-106 |
| G12-Q-20 | D-107 |
| G13-Q-01 | D-02 |
| G13-Q-02 | D-12 |
| G13-Q-03 | D-43 |
| G13-Q-04 | D-11 |
| G13-Q-05 | D-11 |
| G13-Q-06 | D-54 |
| G13-Q-07 | D-55 |
| G13-Q-08 | D-56 |
| G13-Q-09 | D-60 |
| G13-Q-10 | D-59 |
| G13-Q-11 | D-50 |
| G13-Q-12 | D-51 |
| G13-Q-13 | D-50 |
| G13-Q-14 | D-51 |
| G13-Q-15 | D-61 |
| G13-Q-16 | D-42 |
| G13-Q-17 | D-134 |
| G13-Q-18 | D-30 |
| G13-Q-19 | D-05 |
| G13-Q-20 | D-96 |
| G13-Q-21 | D-84 |
| G13-Q-22 | D-96 |
| G13-Q-23 | D-97 |
| G13-Q-24 | D-98 |
| G13-Q-25 | D-98 |
| G13-Q-26 | D-60 |
| G13-Q-27 | D-96 |
| G13-Q-28 | D-134 |
| G13-Q-29 | D-11 |
| G13-Q-30 | D-06 |
| G13-Q-31 | D-12 |
| G13-Q-32 | D-09 |
| G13-Q-33 | D-32 |
| G14-Q-01 | D-45 |
| G14-Q-02 | D-12 |
| G14-Q-03 | D-45 |
| G14-Q-04 | D-47 |
| G14-Q-05 | D-48 |
| G14-Q-06 | D-49 |
| G14-Q-07 | D-62 |
| G14-Q-08 | D-50 |
| G14-Q-09 | D-58 |
| G14-Q-10 | D-52 |
| G14-Q-11 | D-53 |
| G14-Q-12 | D-10 |
| G14-Q-13 | D-48 |
| G14-Q-14 | D-05 |
