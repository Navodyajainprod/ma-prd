# G8 — Workflows + Automation + Web Forms / Form Builder — Gap Analysis
_Sources:_ PRD `content/client/workflows.md`, `content/client/automation.md`, `content/client/web-forms.md` (related, other group: `content/client/processes/kanban.md`, `list.md`) | Prototype routes `/process`, `/automation`, `/web-forms` and the redirects/admin routes listed below; files `src/app/pages/Process.tsx`, `Automation.tsx`, `WebForms.tsx`, `FormBuilder.tsx`, `NewFormTemplate.tsx`, `components/process/**`, `components/automation/**`, `components/webform/**`, `components/form-builder/**`, `components/forms/**`, `lib/useProcessStore.ts`, `lib/useAutomationStore.ts`, `lib/ruleEngine.ts`, `lib/eventBus.ts`, `data/forms.ts` | Context docs (not "built"): `WORKFLOW_AND_AUTOMATION_CONTEXT.md`, `MantraAssist Entity Workflows and Global Automation (PRD, Plan, Developer Prompt).md` | Analysed 2026-11-12

Paths below are relative to `E:\mantra-assist\src\app` unless they start with `lib/` or `data/` (those are under `src/`).

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Workflows (`/process`) | 2 | 4 | 13 | 1 | 1 | 7 | 20.0% |
| Automation (`/automation`) | 1 | 1 | 9 | 0 | 2 | 10 | 13.6% |
| Web Forms / Form Builder (`/web-forms`) | 0 | 4 | 12 | 1 | 1 | 11 | 11.8% |
| **Total** | **3** | **9** | **34** | **2** | **4** | **28** | |

Overall coverage: 15.6% · PRD-backed coverage: 15.6% (all three sub-modules have a PRD file; Form Flows are folded into the Web Forms sub-module because they have no PRD of their own, and Admin-side workflow/automation/form screens belong to G13).

Coverage = (3 + 0.5×9) ÷ (3 + 9 + 34 + 2) = 7.5 ÷ 48 = 15.6%. Counts were produced by a script over the C tables (Matches, Partial, Missing, Contradicts, PRD-only; rows marked Prototype defect in C are excluded). The Prototype defects column is the exact number of E rows (28) assigned to each sub-module: Workflows E-02 to E-08, Automation E-01 and E-09 to E-17, Web Forms E-18 to E-28. Cross-cutting E-07 (no role gating) is counted under Workflows.

## Route map
| Route(s) | Page file | PRD file |
| :--- | :--- | :--- |
| `/process` (sidebar "Workflows", `config/navigation.ts:149-153`) | `pages/Process.tsx` | `workflows.md` (stale, see C) |
| `/automation` (client, `routes.tsx:236`). No sidebar item (nav group "CUSTOMIZATIONS" lists only Workflows, Knowledge Base, Webforms, `config/navigation.ts:144-168`). `/automations` is NOT a client route; it exists only as `/admin/automations` (`routes.tsx:291`) → `pages/admin/AdminAutomations.tsx` | `pages/Automation.tsx` | `automation.md` |
| `/web-forms` (sidebar "Webforms", `config/navigation.ts:160-165`) | `pages/WebForms.tsx` | `web-forms.md` |
| `/forms`, `/forms/:id`, `/web-forms/new`, `/web-forms/builder` | redirect to `/web-forms` (`routes.tsx:238-242`) | none |
| `/form-builder`, `/form-builder/:formId` | No client route. Only `/admin/form-builder*` → redirect to `/admin/forms` (`routes.tsx:303-304`) | none |
| `/web-forms/test*` | `WebFormsTest.tsx` (ignored per brief) | none |
| (embedded) Form builder | `pages/FormBuilder.tsx` rendered inside a drawer via `components/form-builder/FormBuilderDrawer.tsx`; the standalone page is imported but not routed (`routes.tsx:41-42`). `NewFormTemplate.tsx` is imported but not routed | none |
| `/deals` (sidebar "Process") | `pages/Deals.tsx` (page title "Process", badge "Pipeline") | G-other `processes/kanban.md` |

## A. Product map — as built

### A.1 Workflows (`/process`)
**Purpose.** Defines the pipeline each record travels through. A "process" is an ordered list of stages. Each stage carries the AI receptionist's behaviour (what it says, which model and voice, how calls are handled) and the automations that run when a record enters or leaves it.

**Naming as built.** Sidebar and page header say "Workflow" (`Process.tsx:3538`, badge "Workflow Architect"). The records are called "process" in code, in the page's own panels ("Process Settings", "Edit Process Details", "How Process Works", "Search processes...") and in the entity dropdown ("Processes"). The Kanban page at `/deals` is labelled "Process" in the sidebar (`navigation.ts:91-94`) and titled "Process" with a "Pipeline" badge (`Deals.tsx:2020-2024`). "Deals" is only a route name and file name. The primary button reads "Add Workflow" for clients and "Add Appointment Workflow / Add Invoice Workflow / Add Insurance & Claim Workflow" for the other entities (`Process.tsx:3642-3660`).

**User roles.** No role gating. The nav item has no role restriction (`navigation.ts:148-153`) and the route sits outside the settings guard (`routes.tsx:233`).

**Screens.**
1. Header with "Test Process" button and "How Workflow Works" help.
2. Top bar: entity dropdown ("<Entity> Workflow (n)") with Processes, Appointments, Invoices, Insurance & Claims, Tasks (`Process.tsx:1113-1119`); search; Export; primary add button.
3. Left list of processes (cards, expandable to stages, stages drag to reorder).
4. Right panel, process view: name/description edit, temporary-disable toggle, stages ribbon (in-progress, won and lost stages), assigned products and services, knowledge base, process-level Calling, Chatbot and Portal and Reception switches.
5. Right panel, stage view with two tabs, General and Automations (`Process.tsx:4478-4500`). The earlier four-tab layout with a Flow Builder tab no longer exists; the flow builder opens as a drawer from the automation editor ("Show in flow builder", `Process.tsx:5592-5594`, `FlowBuilderDrawer`).
6. Modals and drawers: Add Process, Add/Edit Stage, Delete Stage (with replacement stage picker), Connect Next Process Stage (hand-off), Add/Edit Last Stage, Call Trigger settings, Chatbot settings, Stage Portal and Reception settings, Test Process chat drawer, Test Intent Resolution, Export.

**Step-by-step flows.**
1. Pick an entity from the dropdown. The first process of that entity is selected. Tasks creates a default task process on first visit if none exists (`Process.tsx:1134-1148`).
2. Add a process: button opens a modal. Name and description are both required, otherwise "Please fill all fields" (`Process.tsx:2805-2808`). The new process gets default stages for its entity, the organisation's industry/category/location scoping, and default AI settings (`2803-2900`). There is no add button for Tasks.
3. Open a stage: General tab holds Action (Client Reach Out To Us / Reach Out To The Client / No Action / Handle By Human), Responsible Person (only for Handle By Human), Outbound Source, inbound numbers and channels, "When to move to this stage" (plain-English intent used by the AI), AI Prompt (single or comprehensive mode, greeting, objective, business information items, languages) and AI model/voice/speed/tone. Save Changes writes everything to the stage (`Process.tsx:5650-5694`). Empty states: "No data added", "Not configured".
4. Automations tab lists the rules attached to the stage (name, trigger badge "On Stage Entry/Exit" or global trigger, up to three action chips, on/off switch, edit, delete). Empty state: "No Automations for <stage>" with an "Add Stage Automation" button (`components/process/StageAutomationsTab.tsx`). Add/Edit opens the Add Automation drawer in flow-builder view; saving writes the stage's steps AND creates or updates a rule in the shared automation store, so a stage automation also appears on `/automation` (`Process.tsx:5496-5552`).
5. Delete a stage from the stage view: opens a modal where the user picks a replacement stage; invoices, appointments and claims in the deleted stage are re-pointed to it (`Process.tsx:3412-3486`). Predefined/required stages show a disabled delete with the tooltip "Predefined stage cannot be deleted". Clients stored in a process are NOT migrated (the migration only touches invoices, appointments, claims).
6. Delete a stage from the left list: removes it immediately with only a toast, no modal, no required-stage check beyond hiding the button on predefined stages (`Process.tsx:3837-3846`).
7. Process delete: defined (`Process.tsx:2920-2957`) with guards (standard entity processes and the only default process of an entity cannot be deleted) but no control calls it.
8. Hand-off between processes: "Connect Next Process Stage" links a final stage to a stage of another process (`Process.tsx:3054-3125`).
9. Export: dialog with entity filter and chosen columns (name, description, entity, stage count, stages list, draft/published).

**Business rules.**
- Entity types: client, appointment, invoice, insurance (claims are folded into insurance, `Process.tsx:1067-1068`), task (`lib/useProcessStore.ts:92`). Saving always keeps one default process for each non-client entity (`useProcessStore.ts:1560-1582`).
- Appointment and Insurance may have several processes per organisation scope; Invoice and Task show one; Client unlimited (`Process.tsx:1160-1181`).
- Required system stage categories per entity: appointment booked/rescheduled/completed/cancelled; invoice draft/paid/void; insurance draft/submitted/paid/failed; claim draft/submitted/paid/denied; task created/completed/overdue (`useProcessStore.ts:381-388`). A stage that fills a required category, or is predefined by name, cannot be deleted; a process must keep at least one stage (`useProcessStore.ts:922-936`).
- Visibility: a process shows only if its industry/category/location scoping matches the active organisation, and hidden processes (`canHide=false`) are removed (`Process.tsx:1158-1182`, `useProcessStore.ts:187-262`). If nothing matches for appointment/insurance, the default entity process is shown.
- Stage actions (steps) run in three lanes, "stage", "incall", "inchat", "postcall", and each step key is only allowed in some lanes (`AddAutomationDrawer.tsx:81-116`).
- Process-level switches (Calling, Chatbot, Portal & Reception) apply to the stages of the process; stage-level overrides exist in separate settings dialogs.

**KPIs & metrics.** None on this page. Count badges only: number of processes per entity in the dropdown (computed, count of processes of that entity, `Process.tsx:3564-3566`); "Active Processes" and "Draft Processes" preset counts (computed, count of processes with/without the draft flag, `3612-3625`).

**Cross-module references.** Process stages feed the Deals Kanban (`/deals`); AI receptionist settings and inbound numbers (G-other AI Receptionist); products and services assignment (G7); Knowledge Base; appointments, invoices and claims stage moves (G7); Companion portal connection (G-other); Super Admin process templates (G13, `/admin/workflows`).

### A.2 Automation (`/automation`)
**Purpose.** A registry of event rules: "when this event happens, run these steps and/or move the record to this stage". Rules are created here or implicitly by adding a stage automation on the Workflow page.

**User roles.** No role gating, and no sidebar entry (reachable only by URL or deep link).

**Screens.** Header "Automations" ("Visual rule engine connecting lifecycle events directly to pipeline actions."); four capsule KPIs; filter bar (All Rules / Active / Paused / Failed, search, "New Rule"); rules table (Rule Name, Trigger Event, Status, Last Run; row actions View/Edit and Delete); Add Automation drawer in global scope with the flow-builder canvas (`Automation.tsx:272-274`, `392-447`, `450-619`).

**Step-by-step flows.**
1. Open the page: lists rules for the organisation. Product rules created by Super Admin appear only when their scoping matches the organisation (`Automation.tsx:55-62`). Empty state: "No automation rules found. Click 'New Rule' to create one."
2. New Rule: opens the drawer with a blank flow. Name, description, trigger and steps are chosen in the canvas. Nothing is saved until Save; on save the status active/draft becomes the enabled flag (`Automation.tsx:563-590`).
3. Trigger choices: Process, Client, Appointment, Invoice, Call (each created/updated) from the global catalog (`types/automation.ts:79-143`); plus stage entry/exit and field-updated triggers inside the drawer.
4. Steps: Create Appointment, Create Client, Create Process, Wait/Delay, Condition Gate, Parallel Branches, Update to stage, End Workflow, Generate Invoice, Generate Document, Send Payment, WhatsApp, SMS, Email, Send Invoice, Field Update, Assign to a Human, Webhook (`AddAutomationDrawer.tsx:130-316`). The canvas supports zoom 25% to 200% (`FlowBuilderTab.tsx:1726`). No mini-map or grid snapping.
5. Save validation: if the rule moves records to a stage, the target process must belong to the same entity as the trigger (appointment/invoice/client), otherwise saving throws "Entity mismatch" and a toast shows it; a rule triggered by "entered stage X" cannot move to stage X (`useAutomationStore.ts:290-363`). Failures are toasted (`Automation.tsx:587-589`).
6. Toggle Active/Paused from the table (no confirmation, takes effect immediately, `useAutomationStore.ts:482-489`).
7. Delete: native browser confirm, then "Rule deleted" (`Automation.tsx:259-264`).
8. Edit: row click or View/Edit opens the same drawer with the rule's steps.

**How rules run (engine).** The engine listens to every app event and, for each enabled rule whose trigger matches the event, checks (in order) loop guard, duplicate-event guard, target validation, rule conditions and trigger conditions, then optionally moves the record to the target stage, then executes the steps (`lib/ruleEngine.ts:159-1034`). Rules can chain (a move emits "entered stage", which can fire further rules) up to depth 10 (`ruleEngine.ts:20,164`). Events actually emitted by the app: appointment booked/rescheduled/cancelled/completed/no-show/checked-in, client checked-in/updated/field-updated/product-assigned, invoice created/sent/paid/partially-paid/overdue/voided, field updated, stage entered/exited. There is no emitter for client created, call ended, process created, claim or insurance events although some are offered as triggers.

**Business rules.**
- A disabled rule is skipped by the engine (`ruleEngine.ts:174`).
- Same event + same record + same rule runs once (`ruleEngine.ts:295-298`), tracked in memory only.
- A rule cannot re-fire within one chain (`ruleEngine.ts:282-293`); the store-level cycle check only catches a rule that moves to the very stage that triggers it (`useAutomationStore.ts:348-363`).
- Steps the engine can execute: condition gate, field update, stage move, generate invoice, generate document, schedule appointment, send payment/send invoice (`ruleEngine.ts:426-992`). Other catalogue steps (Wait/Delay, WhatsApp, SMS, Email, Assign human, Webhook, Create Client/Appointment/Process, Parallel) have no executor; delays are ignored.
- Rule health and last-run time are written after each run; a rule that fails validation is flagged failed (`ruleEngine.ts:306-312, 1001-1004`).

**KPIs & metrics** (`Automation.tsx:76-96`, `278-389`).
| Metric | Where | Formula |
| :--- | :--- | :--- |
| Total automations | capsule 1 | Count of all stored rules (computed). Sub-label "n paused" or "all active". |
| Active | capsule 2 | Count of rules with the enabled flag (computed). Sub-label repeats the number ("n live"). |
| Runs this week | capsule 3 | Count of RULES whose last-run time is in the past 7 days (computed, not a count of runs; see G8-E-17). |
| Failed | capsule 4 | Count of rules whose health is "failed" (computed). Sub-label "Needs action" or "All healthy". |

Capsules count all rules, but the table hides product rules outside the organisation's scope, so the counts can disagree with the rows.

**Cross-module references.** Stage automations from Workflows (same store); appointments and invoices services emit events and receive stage moves (`lib/appointmentService.ts`, `lib/invoiceService.ts`; G7); Patient check-in screen (`pages/patient/PatientCheckinScreen.tsx`); Super Admin automations (G13).

### A.3 Web Forms / Form Builder (`/web-forms`)
**Purpose.** Build intake and lead-capture forms, share them with clients or publish them for embedding, and (optionally) turn each submission into a client record placed in a chosen process and stage.

**Naming as built.** Nav label "Webforms" (`navigation.ts:162`), page title "Web Forms" (`WebForms.tsx:1377`), help "How Web Forms Works", export option "WebForm" (`Process.tsx:3677`). Admin side calls them "Forms" / "Form Templates". Multi-form bundles are called "Form Flows" in the code and "Intake flows" in data; the sub-tab label is "Flows".

**User roles.** No role gating on the client side. A form has a permissions object (view/edit/share) set in the create drawer (`components/forms/FormCreateDrawer.tsx:281-299`); nothing in the pages enforces it.

**Screens.** KPI capsules; main tabs Submissions and Forms; Forms tab has sub-tabs Forms and Flows; form detail drawer (Overview / Preview); Form create drawer; Form Builder drawer (fields, settings tabs including Appearance and an auto-create-client section); Share drawer; Flow create and flow detail drawers; submission drawer; client profile preview.

**Step-by-step flows.**
1. Create form: "New form" opens the create drawer, then the builder drawer. Palette: Short Text, Long Text, Number, Date, Dropdown, Multi-Select, Radio, Checkbox, File Upload, Email, Phone, Page Break, Section Break, Signature, HTML Block (`FormBuilder.tsx:2282-2296`). Fields can also be linked to client registry fields (system or custom) and custom fields can be created inline (`FormBuilder.tsx:230-365`). Field empty/error: "Please enter a field name". "Conditional logic" shows a "coming soon" toast (`FormBuilder.tsx:1031`).
2. Save as draft: stores the form as draft and disabled; toast "Form saved as draft" (`FormBuilder.tsx:449-475`).
3. Publish: if "Create Submitter as Client Profile" is on, a process and initial stage must be chosen or the toast "Please select a Process and Initial Stage before publishing." blocks it (`FormBuilder.tsx:497-500`); then the form is stored as live and enabled (`FormBuilder.tsx:521-547`).
4. List and manage: search, sort by name/submissions/last updated, enable switch, row actions Edit, Share, Test, Delete (`WebForms.tsx:1221-1255`). Delete: if the form is in any flow a native confirm warns and the form is removed from those flows too; otherwise it deletes with only a toast (`WebForms.tsx:1231-1243`).
5. Share: choose recipients (existing clients or typed email/phone) and channel SMS, WhatsApp, Email or Patient Companion App, optionally with conditions. Link and iframe embed snippet are shown and copyable. Sending creates a "sent" submission row per recipient and, for clients, a pending entry in the client's Forms tab; SMS/WhatsApp/Email only show "Ready to send via <channel>" (no message is sent) (`ShareFormDrawer.tsx:296-306`, `WebForms.tsx:927-1004`). A draft form shows a banner "the link won't be publicly live until it's published".
6. Detail drawer: Overview shows description, field count, creator, created date, and for live forms a "Live link" and embed code; for draft forms a "Publish form" button which only shows a toast (`WebForms.tsx:675-692`). Preview tab renders the form and submits it.
7. Submit (the only submit path is this in-app preview, plus the Test page): collects values; if the form's auto-create option is on, it looks for an existing client by email (case-insensitive) or phone (digits only). Match: fills empty name/email/phone/country and writes mapped company, role and custom fields onto the client. No match: creates a client with id "CL-<6 digits>", name (falls back to email, then "New Contact"), email, phone, country (default US), the chosen process, and stage text "<process>: <stage>" (default stage "Initial Contact"), status Active; toast "New client created". If the option is off no client is created. In all cases a submission row (status completed) is added, the form's submission counter goes up and, when a client exists, the client's Forms tab gets an entry (`WebForms.tsx:1027-1199`). There is no required-field check, no task is created, no front-desk notification, and no automation event is emitted.
8. Flows: create flow (name required), add existing or new forms as ordered steps with a Required flag, drag to reorder, welcome and thank-you screens, preview, duplicate, delete, enable switch, link and embed code. Adding a form to a flow that already has active clients asks for confirmation (`WebForms.tsx:1278-1348`). Flow delete has no confirmation.

**Business rules.**
- Auto-create is off by default (`FormBuilder.tsx:157`).
- Record linking uses only fields explicitly mapped to client registry fields; label guessing was removed on purpose (`WebForms.tsx:1033-1036, 1100-1103`).
- Stage and process are stored as text names (process names are what the selector stores, `ui/ProcessStageSelect.tsx:189`).
- Process list offered in the selector is not limited to client processes (no entity filter in `ProcessStageSelect.tsx`), so appointment or invoice processes can be picked.
- Forms are scoped by category/industry (admin templates) (`data/forms.ts:259`).

**KPIs & metrics.**
| Metric | Where | Value |
| :--- | :--- | :--- |
| Submissions 7d (and "vs prior") | capsule 1 | 47 vs 31 — hardcoded – formula undefined (`WebForms.tsx:1011-1017`) |
| Active forms (and "live") | capsule 2 | 3 total, 3 live — hardcoded – formula undefined (the list can have different counts) |
| Top performer | capsule 3 | "Newsletter Signup", 89 — hardcoded – formula undefined |
| Usage | capsule 4 | 135 of 300 "On track" — hardcoded – formula undefined |
| Submissions per form (Forms table) | table | Stored counter, incremented on submit and, wrongly, on share (see G8-E-23) |

**Cross-module references.** Clients list and profile (G-other Clients, shared client store in session storage), client Forms tab, Companion app (patient_app channel), Workflows ("Collect Form Data" step), Chats/Call Details read the same client store, Super Admin form templates (G13).

## B. Product map — per PRD

### B.1 `workflows.md` — "Workflow Designer Canvas & Trigger-Action Pipelines" (status In Review)
- **Purpose** (`workflows.md § 1. Module Summary`): node-based canvas to author automated clinical pathways from Trigger nodes (Appointment Booked, Patient Arrived), Condition nodes (If First Visit, If High Risk) and Action nodes (Send SMS, Create Task, Generate Bill).
- **Roles** (`§ F-1 / 4. Jobs to be done`): Clinical Coordinator. No gating stated.
- **Screens/flows** (`§ F-1`): F-1.1 drag-and-drop canvas with pan, zoom 25–200%, grid snapping; F-1.2 node palette (Triggers, Conditions, Actions, Delays, searchable); F-1.3 Bezier wires with port-type validation. Worked example: Patient Checked Out → Wait 24h → Send WhatsApp Care Check.
- **Rules** (`§ 5. Acceptance criteria`): valid connections execute in sequence when trigger events occur.
- **KPIs:** none. **Cross-product:** none (no Cross-product Summary section). Mentions "mini-map navigation" in `§ F-1 / 1`.

### B.2 `automation.md` — "Global Automation Engine & Event Triggers" (status In Review)
- **Purpose** (`§ 1. Module Summary`): system-wide event rules for lifecycle transitions, reminder cadences and SLA escalations across all modules.
- **Roles:** Practice Administrator.
- **Screens/flows** (`§ F-1`): F-1.1 table of rules (title, trigger, action summary, execution count, active switch, search); F-1.2 execution audit log drawer with success/failure and timestamps. Example: "Send SMS 48h before visit" executed 42 times today with 100% success.
- **Rules** (`§ 5`): disabling a rule immediately stops it triggering.
- **KPIs:** execution count, success rate (no formulas). **Cross-product:** none.

### B.3 `web-forms.md` — "Webforms, Digital Intake & Signature Collection" (status In Review)
- **Purpose** (`§ 1`): responsive digital intake forms with fields, signature, iframe embedding and automatic patient-chart ingestion.
- **Roles:** Practice Coordinator.
- **Screens/flows** (`§ F-1`): F-1.1 drag-and-drop builder with palette (Text, Phone, Date of Birth, Checkbox Group, File Upload, Signature Pad) and live preview toggle; F-1.2 public URL and iframe embed ("SSL encrypted link"); F-1.3 submissions create or update patient charts and an intake timeline event. Example: patient receives SMS link, signs on phone, submission syncs to chart and notifies front desk.
- **Rules** (`§ 5`): submitted webforms automatically create or update patient demographic and medical records.
- **KPIs:** none. **Cross-product:** none.

## C. Findings

### C.1 Workflows
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G8-I-01 | Flow | Canvas with zoom 25% to 200% | Matches | workflows.md § F-1.1 | components/process/FlowBuilderTab.tsx:1726 | Canvas lives in the automation editor drawer, not on the Workflow page. |
| G8-I-02 | Flow | Grid snapping and mini-map | PRD-only (not built) | workflows.md § F-1 / 1 and F-1.1 | none found in FlowBuilderTab.tsx | Context doc also asks for a mini-map. |
| G8-I-03 | Flow | Node palette | Partial (PRD less detailed) | workflows.md § F-1.2 | FlowBuilderTab.tsx:233-294 | Built groups are Logic & Routing, Create CRM Entities, Records & Billing, Communication, Data & Assignment, plus a separate trigger list; PRD says Triggers/Conditions/Actions/Delays. |
| G8-I-04 | Flow | Wires between nodes | Partial (PRD less detailed) | workflows.md § F-1.3 | FlowBuilderTab.tsx (ports, 1389-1427) | Wires and branch ports exist (Case 1 / Else, parallel); port-type validation not found. |
| G8-I-05 | Rule | Trigger vocabulary ("Appointment Booked", "Patient Arrived") | Contradicts or stale | workflows.md § F-1 | types/automation.ts:79-143; lib/useAutomationStore.ts:189-234 | Built triggers are created/updated for process, client, appointment, invoice, call, plus the event catalogue (booked, completed, paid...). "Patient Arrived" does not exist (closest: checked-in). PRD also frames the Workflow page as a canvas, but the built page is a process/stage editor. |
| G8-I-06 | Flow | Condition nodes | Matches | workflows.md § F-1 / 1 | FlowBuilderTab.tsx:236; lib/ruleEngine.ts:426-436 | Condition halts the following steps when false. |
| G8-I-07 | Flow | Action nodes (Send SMS, Create Task, Generate Bill) | Partial (PRD less detailed) | workflows.md § F-1 / 1 | AddAutomationDrawer.tsx:130-316 | SMS, WhatsApp, Email, Generate Invoice exist; no "Create Task" step. |
| G8-I-08 | Flow | Valid chains execute in sequence on trigger; Wait 24h then WhatsApp | Partial (PRD less detailed) | workflows.md § F-1 acceptance F-1-1 and worked example | lib/ruleEngine.ts:426-996 | Only some steps execute; delays and messaging steps do not. See G8-E-01. |
| G8-I-09 | Flow | A workflow is a per-entity "process" made of stages; stage = status | Missing in PRD | none | Process.tsx:1113-1119; lib/useProcessStore.ts:92 | Core model of the page is absent from the PRD. |
| G8-I-10 | Flow | Entity selector: Processes, Appointments, Invoices, Insurance & Claims, Tasks | Missing in PRD | none | Process.tsx:1113-1119, 3555-3598 | Context doc lists Clients/Appointments/Invoices/Insurance/Claims; built merges claims and adds Tasks. |
| G8-I-11 | Flow | Stage General tab: Action type, Responsible Person, outbound source, inbound numbers, "When to move to this stage" | Missing in PRD | none | Process.tsx:4600-4700 | |
| G8-I-12 | Flow | Stage AI persona: prompt (single/comprehensive), greeting, objective, business info, languages, model, voice, speed, tone | Missing in PRD | none | Process.tsx:4900-5460, 5650-5694 | The "AI agent/voice" definition requested in the focus is entirely unspecified in the PRD. |
| G8-I-13 | Flow | Stage Automations tab (list, toggle, add, edit, delete) syncing to the global rule store | Missing in PRD | none | components/process/StageAutomationsTab.tsx; Process.tsx:5496-5552 | |
| G8-I-14 | Flow | Won/Lost final stages and hand-off to a stage in another process | Missing in PRD | none | Process.tsx:3054-3125, 3188-3270 | |
| G8-I-15 | Rule | Required system stages cannot be deleted; deleting a stage re-points invoices, appointments, claims to a replacement | Missing in PRD | none | lib/useProcessStore.ts:381-388, 922-936; Process.tsx:3412-3486 | Clients are not migrated, see G8-E-03. |
| G8-I-16 | Rule | Processes limited by organisation industry, category and location | Missing in PRD | none | lib/useProcessStore.ts:187-262; Process.tsx:1158-1182 | |
| G8-I-17 | Flow | Process-level Calling, Chatbot, Portal & Reception switches and settings dialogs | Missing in PRD | none | Process.tsx:4345-4460, 4729-4880 | |
| G8-I-18 | Flow | Test Process chat and Test Intent Resolution | Missing in PRD | none | Process.tsx:3544, 6566 | |
| G8-I-19 | Flow | Export processes | Missing in PRD | none | Process.tsx:3664-3690 | Export entity filter lists "WebForm" and omits Insurance and Tasks, see G8-E-06. |
| G8-I-20 | X-ref | Workflow stages drive the Process (Deals) Kanban and the Companion care journey | Missing in PRD | processes/kanban.md (other group) | pages/Deals.tsx:2019-2029; lib/useProcessStore.ts:1114-1141 | workflows.md has no cross-product section. |
| G8-I-21 | X-ref | Stage and process settings feed AI Receptionist and Appointments/Invoices/Claims stage statuses | Missing in PRD | none | lib/useProcessStore.ts:1137-1155; lib/ruleEngine.ts:376-418 | |
| G8-I-22 | Rule | Temporary disable of a process | Prototype defect | none | Process.tsx:3950 | see G8-E-04 |
| G8-I-23 | Rule | Delete a process | Prototype defect | none | Process.tsx:2920 | see G8-E-02 |
| G8-I-24 | Rule | Delete a stage from the left list | Prototype defect | none | Process.tsx:3837 | see G8-E-03 |
| G8-I-25 | Metric | "Active/Draft Processes" presets | Prototype defect | none | Process.tsx:3612-3625 | see G8-E-05 |

### C.2 Automation
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G8-I-30 | Flow | Rules table with name, trigger, action summary, execution count, active switch, search | Partial (PRD less detailed) | automation.md § F-1.1 | Automation.tsx:162-243 | Built columns: name, trigger, status (toggle), last run. No action summary and no execution count. |
| G8-I-31 | Flow | Execution audit log drawer | PRD-only (not built) | automation.md § F-1.2 | none | Only a last-run time exists. |
| G8-I-32 | Rule | Disabling a rule stops it on subsequent events | Matches | automation.md § F-1 acceptance F-1-1 | lib/ruleEngine.ts:174; lib/useAutomationStore.ts:482-489 | |
| G8-I-33 | Metric | "Send SMS 48h before visit" ran 42 times, 100% success; reminder cadences and SLA escalations | PRD-only (not built) | automation.md § 1 and worked example | none | No time-based scheduler, no SMS executor, no counters, no SLA concept. Execution count and success rate: no data source exists. |
| G8-I-34 | Flow | Trigger catalogue: Process, Client, Appointment, Invoice, Call created/updated; stage entry/exit; field updated | Missing in PRD | none | types/automation.ts:79-143; AddAutomationDrawer.tsx:1089-1098 | Context doc proposes a larger event list (booked, paid, overdue, claim denied...), not all emitted, see G8-E-09. |
| G8-I-35 | Flow | Rule builder drawer with step catalogue and flow canvas | Missing in PRD | none | Automation.tsx:450-619; AddAutomationDrawer.tsx:130-316 | |
| G8-I-36 | Rule | Conditions: condition step and trigger conditions with operators (equals, contains, greater than, is empty...) | Missing in PRD | none | lib/ruleEngine.ts:26-130, 335-352 | |
| G8-I-37 | Rule | Safety: same-entity target validation, loop guard, once-per-event, chain depth 10 | Missing in PRD | none | lib/useAutomationStore.ts:290-363; lib/ruleEngine.ts:20, 282-307 | Weaknesses logged as G8-E-10. |
| G8-I-38 | Metric | Total, Active, Failed capsules (computed counts) | Missing in PRD | none | Automation.tsx:76-96, 278-389 | Formulas in A.2. |
| G8-I-39 | Metric | Runs this week | Prototype defect | none | Automation.tsx:82-87 | see G8-E-17 |
| G8-I-40 | Rule | Product (Super Admin) rules appear only when scoping matches the organisation; client rules are customisations | Missing in PRD | none | Automation.tsx:55-62; lib/useAutomationStore.ts:103-165 | |
| G8-I-41 | Flow | Stage automations and global rules are one store; a rule can appear on both pages | Missing in PRD | none | Process.tsx:5496-5552; components/process/StageAutomationsTab.tsx:78-105 | |
| G8-I-42 | Flow | Stage-move history with undo | Prototype defect | none | lib/useAutomationStore.ts:551-650; components/automation/StageMovementTimelineModal.tsx | see G8-E-12; intended history/undo is also not in the PRD. |
| G8-I-43 | Flow | Automation page reachable from the sidebar | Prototype defect | none | config/navigation.ts:144-168; routes.tsx:236 | see G8-E-13 |
| G8-I-44 | X-ref | Rules move appointments and invoices and trigger invoice generation | Missing in PRD | none | lib/ruleEngine.ts:376-418, 608-765; lib/appointmentService.ts; lib/invoiceService.ts | G7 hand-off. |
| G8-I-45 | X-ref | Super Admin product automations and templates | Missing in PRD | none | routes.tsx:287-292; pages/admin/AdminAutomations.tsx | G13 hand-off. |
| G8-I-46 | Rule | Steps that cannot execute (delay, SMS, email, WhatsApp, webhook, assign human, create client/appointment/process) | Prototype defect | none | lib/ruleEngine.ts:426-996 | see G8-E-01 |
| G8-I-47 | Rule | Check-in rules silently removed on load | Prototype defect | none | lib/useAutomationStore.ts:380-397 | see G8-E-11 |

### C.3 Web Forms / Form Builder
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G8-I-60 | Flow | Form builder with field palette (Text, Phone, Date, Checkbox, File Upload, Signature) | Partial (PRD less detailed) | web-forms.md § F-1.1 | pages/FormBuilder.tsx:2282-2296 | Palette is larger (15 types, page and section breaks, HTML). Drag-and-drop not verified. "Checkbox Group" and "Date of Birth" are not distinct types. |
| G8-I-61 | Flow | Live preview toggle | Partial (PRD less detailed) | web-forms.md § F-1.1 | FormBuilder.tsx:2418; WebForms.tsx:700-770 | Builder shows a toast "Live preview updated"; the real preview is on the detail drawer's Preview tab. |
| G8-I-62 | Flow | Public link and iframe embed | Partial (PRD less detailed) | web-forms.md § F-1.2 | WebForms.tsx:526-527; ShareFormDrawer.tsx:273-274; forms/FormFlowDrawer.tsx:34-35 | Link and snippet are generated, but they point to a placeholder domain that nothing serves, see G8-E-18. |
| G8-I-63 | Flow | Submission creates or updates a client/patient record | Partial (PRD less detailed) | web-forms.md § F-1.3 | WebForms.tsx:1027-1199 | Matches on email or phone; updates only empty core fields; no intake timeline event and no medical-record data. |
| G8-I-64 | Rule | "Submitted webforms automatically create or update patient records" | Contradicts or stale | web-forms.md § F-1 acceptance F-1-1 | FormBuilder.tsx:157; components/form-builder/FormSettings.tsx:395-445 | Built behaviour is opt-in per form (toggle "Create Submitter as Client Profile", default off). PRD also says "patient"; the product uses "client". |
| G8-I-65 | Flow | Front desk notified; patient chart timeline event | PRD-only (not built) | web-forms.md § F-1 worked example, F-1.3 | none | No notification or timeline entry is produced on submit. |
| G8-I-66 | Flow | Main tabs Submissions / Forms, Forms vs Flows sub-tabs, submission drawer | Missing in PRD | none | WebForms.tsx:1380-1500, 2195-2212 | |
| G8-I-67 | Flow | Form Flows: ordered multi-form bundles, Required flag, welcome and thank-you screens, preview, duplicate | Missing in PRD | none | WebForms.tsx:1278-1348; forms/FormFlowDrawer.tsx | |
| G8-I-68 | Flow | Share drawer: channels SMS, WhatsApp, Email, Patient Companion App, recipients, conditions | Missing in PRD | none | components/webform/ShareFormDrawer.tsx; ShareConditionsEditor.tsx; ShareRecipientPicker.tsx | Sending only toasts for SMS/WhatsApp/Email, see G8-E-20. |
| G8-I-69 | Flow | Auto-create client settings: choose process and initial stage; publish blocked until chosen | Missing in PRD | none | FormSettings.tsx:395-445; FormBuilder.tsx:497-500 | Process is the submission-to-process-stage link the focus asks about. |
| G8-I-70 | Rule | Existing-client matching by email (case-insensitive) or phone (digits only) | Missing in PRD | none | WebForms.tsx:1047-1050 | |
| G8-I-71 | Rule | Draft vs live status and enable switch | Missing in PRD | none | FormBuilder.tsx:449-547; WebForms.tsx:1245-1250 | Draft is saved disabled; live is saved enabled. |
| G8-I-72 | Flow | Map form fields to client registry fields and create custom fields inline | Missing in PRD | none | FormBuilder.tsx:230-365 | |
| G8-I-73 | Rule | Delete form warns when used in flows | Missing in PRD | none | WebForms.tsx:1231-1243 | Uses a native confirm only when flows reference the form. |
| G8-I-74 | X-ref | "Collect Form Data" workflow step picks a form | Missing in PRD | none | components/process/StepParametersFields.tsx:4523-4532 | Picker lists a fixed template list, see G8-E-21. |
| G8-I-75 | X-ref | Submissions written to the client's Forms tab and client store | Missing in PRD | none | WebForms.tsx:1180-1190; data/submissionsStore.ts | |
| G8-I-76 | X-ref | Admin form templates scoped by category/industry | Missing in PRD | none | data/forms.ts:259; pages/admin/AdminFormTemplates.tsx | G13 hand-off. |
| G8-I-77 | Metric | KPI capsules (Submissions 7d, Active forms, Top performer, Usage) | Prototype defect | none | WebForms.tsx:1011-1017 | see G8-E-19 |
| G8-I-78 | Metric | Per-form submission counter | Prototype defect | none | WebForms.tsx:996-1001 | see G8-E-23 |
| G8-I-79 | Flow | Publish from detail drawer | Prototype defect | none | WebForms.tsx:688 | see G8-E-21 |
| G8-I-80 | Rule | Required-field validation on submit | Prototype defect | none | WebForms.tsx:710, 755-770 | see G8-E-22 |
| G8-I-81 | Flow | Submission → process stage → task | Missing in PRD | none | WebForms.tsx:1086-1118 | Stage is recorded as text only; no task is created and no automation fires. Intended behaviour is a PM decision, see G8-Q-08. |

## D. Correct flow as built (PRD-ready)

### D.1 Replacement for `content/client/workflows.md`
```markdown
---
title: "Workflows (Entity Processes, Stages & Stage Automations)"
product: "client"
module: "workflows"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | WORKFLOWS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Process Kanban) | Stages become Kanban columns | Each client process defined here is a board on the Process page; stage order and colours come from this page. | [Process Kanban](/client/processes/kanban) |
| Companion | Care journey stepper | Processes connected to the portal show their stages in the patient's care journey. | [View in Companion](/companion/today) |
| Client (Appointments, Invoices, Insurance & Claims) | Entity processes | Each of these modules uses the stages of its entity process as its statuses. | See G7 |
| Client (AI Receptionist) | Stage AI behaviour | Stage prompt, model, voice and inbound numbers drive how the AI answers. | See AI Receptionist PRDs |

## 1. Module Summary
- Workflows (sidebar "Workflows", route /process) is where an organisation defines the stages every record moves through and what happens at each stage. Records are called "processes"; each process is an ordered list of stages. The Kanban page for client processes is labelled "Process" in the sidebar.
- Five entity types each have their own processes: Clients (many), Appointments, Invoices, Insurance & Claims, Tasks.
- A stage defines AI receptionist behaviour (action type, prompt, greeting, objective, business information, languages, model, voice, speed, tone) and stage automations (steps run when a record enters or leaves the stage).
- Processes are visible only when their industry, category and location scoping matches the organisation.

## 2. Feature Requests

### F-1: Entity Processes and Stage Management
#### 1. What it does
Lets an admin pick an entity, create or edit its processes and arrange, add, edit and delete stages (in-progress, won, lost).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Entity switcher | Dropdown | Switches between Processes, Appointments, Invoices, Insurance & Claims, Tasks with counts | Insurance & Claims merged |
| F-1.2: Add process | Modal | Name and description required; entity default stages and scoping are applied | Decision needed: Add for Tasks (see G8-Q-02) |
| F-1.3: Stage ribbon and list | Drag and drop | Reorder stages, add in-progress, won and lost stages | |
| F-1.4: Required stages | Rule | Required system stages and predefined stages cannot be deleted; a process keeps at least one stage | Categories per entity listed in 3.3 |
| F-1.5: Delete stage with replacement | Modal | Picks replacement stage; invoices, appointments, claims move to it | Decision needed: client migration (see G8-Q-03) |
| F-1.6: Hand-off to another process | Modal | A final stage can send the record to a stage of another process | |
| F-1.7: Scoping | Rule | Processes appear only when industry, category and location match the organisation | |
| F-1.8: Export | Dialog | Exports processes, stage counts and stage lists | |
| F-1.9: Process delete | Control | Decision needed: how admins delete a process (see G8-Q-04) | |
| F-1.10: Temporary disable | Switch | Decision needed: what pausing a process does (see G8-Q-05) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic adds a post-op pipeline | Chooses Processes, clicks Add Workflow, names it, adds stages | **New process appears with scoped visibility and default AI settings** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Administrator | When designing care pathways, I want editable stages per entity, so that every record has a clear status. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Name and description are required to create a process. |
| F-1-2 | Required system stages cannot be deleted; deleting another stage requires choosing a replacement. |
| F-1-3 | Only processes matching the organisation's scoping are shown. |

### F-2: Stage Configuration and AI Behaviour
#### 1. What it does
Configures how the AI and staff handle a record in a stage.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Action | Select | Client Reach Out To Us, Reach Out To The Client, No Action, Handle By Human | Responsible person shown for Handle By Human |
| F-2.2: When to move to this stage | Text | Plain-English intent used by the AI to place a contact | |
| F-2.3: AI prompt | Editor | Single or comprehensive prompt, greeting, objective, business information, languages | |
| F-2.4: AI model, voice, speed, tone | Selects | Per-stage persona | Defaults come from process settings |
| F-2.5: Calling, Chatbot, Portal and Reception | Switches and dialogs | Enable per process and override per stage | |
| F-2.6: Test | Drawers | Test Process chat and Test Intent Resolution | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Stage handled by a human | Sets Action to Handle By Human and picks an employee | **Calls for this stage go to that person** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Administrator | When a record reaches a stage, I want the AI to behave appropriately, so that callers get consistent answers. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Save Changes stores all stage settings and confirms with "Stage configuration saved". |

### F-3: Stage Automations
#### 1. What it does
Attaches automations to a stage so they run when a record enters or leaves it.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Automations tab | Table | Lists rules for the stage with trigger, action chips and an on/off switch | |
| F-3.2: Add/Edit automation | Drawer | Flow builder with step catalogue (see Automation PRD) | Same store as /automation |
| F-3.3: Show in flow builder | Drawer | Opens the flow canvas for the stage's steps | |
| F-3.4: Delete automation | Control | Decision needed: confirmation wording (see G8-Q-06) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Invoice should go out when an appointment completes | Adds an automation on the Completed stage with a Send Invoice step | **Invoice is sent when an appointment enters Completed** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Clinical Coordinator | When a record enters a stage, I want follow-ups to run automatically, so that nothing is forgotten. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | A stage automation is stored as a rule and appears on the Automation page. |
| F-3-2 | Disabling the switch stops the automation from running. |

### F-4: Visual Flow Canvas
#### 1. What it does
Provides a node canvas to arrange triggers, conditions, delays and actions.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Canvas | Visual | Pan and zoom from 25% to 200% | |
| F-4.2: Node palette | Palette | Logic & Routing, Create CRM Entities, Records & Billing, Communication, Data & Assignment | |
| F-4.3: Wires and branches | Connector | Condition cases with Else, parallel branches | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Conditional follow-up | Adds a Condition node then a Send WhatsApp node | **Message sent only when the condition passes** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinical Coordinator | When designing a follow-up, I want a visual canvas, so that I can build it without code. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Condition nodes gate the steps that follow them. |

### Not yet built
- Grid snapping and mini-map on the canvas (see G8-I-02).
- Trigger names "Appointment Booked / Patient Arrived" as shown in the original PRD (see G8-I-05).
- "Create Task" action (see G8-I-07).
- Decision needed: whether Wait/Delay, SMS, WhatsApp, Email, Webhook and Assign steps must execute (see G8-Q-01).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Entity Processes and Stage Management | F-1.1 to F-1.10 | Define processes and stages per entity. |
| F-2 | Stage Configuration and AI Behaviour | F-2.1 to F-2.6 | Set how AI and staff handle a stage. |
| F-3 | Stage Automations | F-3.1 to F-3.4 | Run steps when records enter or leave a stage. |
| F-4 | Visual Flow Canvas | F-4.1 to F-4.3 | Node canvas for automation steps. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Administrator | Editable stages per entity so every record has a status. | F-1 |
| 2 | Practice Administrator | AI behaves appropriately at each stage. | F-2 |
| 3 | Clinical Coordinator | Follow-ups run automatically on stage entry. | F-3 |
| 4 | Clinical Coordinator | Visual flow design without code. | F-4 |

### 3.3 Required stage categories
Appointment: booked, rescheduled, completed, cancelled. Invoice: draft, paid, void. Insurance: draft, submitted, paid, failed. Claim: draft, submitted, paid, denied. Task: created, completed, overdue.
```

### D.2 Replacement for `content/client/automation.md`
```markdown
---
title: "Automation (Event Rules & Stage Moves)"
product: "client"
module: "automation"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | AUTOMATION |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Workflows) | Stage automations | Automations added to a stage appear here as rules and vice versa. | [Workflows](/client/workflows) |
| Client (Appointments, Invoices) | Events and stage moves | Appointment and invoice events fire rules; rules move records and can generate or send invoices. | See G7 |
| Super Admin | Product automations | Admin-defined rules show here when their scoping matches the organisation. | See Super Admin PRDs |

## 1. Module Summary
- Automation (route /automation) lists event rules: "when this event happens, optionally move the record to a stage and run these steps".
- Triggers: created or updated events for Process, Client, Appointment, Invoice and Call; stage entry and exit; field updated; plus lifecycle events emitted by appointments and invoices.
- Steps: condition, wait, parallel branches, update to stage, end, generate invoice, generate document, send payment/invoice, WhatsApp, SMS, Email, field update, assign human, webhook, create client/appointment/process.
- Decision needed: add Automation to the sidebar next to Workflows (see G8-Q-07).

## 2. Feature Requests

### F-1: Rule Registry
#### 1. What it does
Lists rules with a status toggle, search, status filters and capsule counts.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Rules table | Table | Rule name, trigger event, status toggle, last run; edit and delete actions | Decision needed: execution count and action summary (see G8-Q-09) |
| F-1.2: Filters and search | Bar | All, Active, Paused, Failed; search by name, trigger, description | |
| F-1.3: Capsules | Metrics | Total, Active, Runs this week, Failed | Decision needed: define formula for Runs this week (see G8-Q-10) |
| F-1.4: Scope | Rule | Product rules appear only when scoping matches the organisation | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin pauses a rule | Clicks the Active pill | **Rule becomes Paused and stops firing** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Administrator | When automating routine work, I want one list of rules, so that I can see what is on or off. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Disabling a rule stops it from triggering on subsequent events. |
| F-1-2 | Deleting a rule asks for confirmation. |

### F-2: Rule Builder
#### 1. What it does
Creates and edits rules in a flow-builder drawer.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Trigger selection | Selector | Chooses event from the catalogue | |
| F-2.2: Conditions | Nodes | Operators: equals, not equals, contains, starts/ends with, greater/less than, is empty | |
| F-2.3: Steps | Canvas | Add, order, delay, branch steps | |
| F-2.4: Move to stage | Step | Target process and stage must belong to the same entity as the trigger | |
| F-2.5: Save | Action | Nothing saved until Save; invalid targets show an error | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Send invoice when appointment completes | Trigger Appointment completed, step Send Invoice | **Invoice is dispatched on completion** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Administrator | When a lifecycle event happens, I want automatic follow-ups, so that staff do less manual work. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | A rule cannot move a record to a stage of a different entity. |
| F-2-2 | A rule triggered by entering stage X cannot move to stage X. |

### F-3: Execution Safety
#### 1. What it does
Prevents duplicate and runaway execution.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Once per event | Rule | A rule runs once per record and event | Decision needed: must survive reload (see G8-Q-11) |
| F-3.2: Loop guard and depth | Rule | A rule cannot re-fire in the same chain; chains stop at depth 10 | Decision needed: block longer cycles at save (see G8-Q-11) |
| F-3.3: Health | Status | Last run time and health recorded per rule | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Two rules form a loop | Saves both | **Second run in the chain is skipped by the loop guard** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Administrator | When rules interact, I want safeguards, so that nothing runs twice or forever. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Duplicate events do not run a rule twice. |

### Not yet built
- Execution audit log drawer with success/failure per firing (see G8-I-31).
- Execution count and success rate per rule (see G8-I-30).
- Time-based reminders ("48h before visit") and SLA escalations (see G8-I-33).
- Stage-move history with undo screen (see G8-I-42).
- Decision needed: which steps must execute (see G8-Q-01).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Rule Registry | F-1.1 to F-1.4 | List, filter, toggle and scope rules. |
| F-2 | Rule Builder | F-2.1 to F-2.5 | Build rules with triggers, conditions and steps. |
| F-3 | Execution Safety | F-3.1 to F-3.3 | Prevent duplicate and runaway runs. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Administrator | One list of rules with on/off. | F-1 |
| 2 | Practice Administrator | Automatic follow-ups on lifecycle events. | F-2 |
| 3 | Practice Administrator | Safeguards against duplicates and loops. | F-3 |
```

### D.3 Replacement for `content/client/web-forms.md`
```markdown
---
title: "Web Forms (Builder, Share, Flows & Client Creation)"
product: "client"
module: "web-forms"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | WEB-FORMS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Clients) | Client creation and form history | A submission can create or update a client and appears in the client's Forms tab. | [Clients](/client/clients) |
| Companion | Patient Companion App channel | Forms can be shared to the Companion app. | [View in Companion](/companion/today) |
| Client (Workflows) | Collect Form Data step | A workflow step can ask the client to fill a form. | [Workflows](/client/workflows) |
| Super Admin | Form templates | Admin templates scoped by category and industry feed the form list. | See Super Admin PRDs |

## 1. Module Summary
- Web Forms (sidebar "Webforms", route /web-forms, page title "Web Forms") lets a clinic build forms, share them with clients or publish them, group them into Form Flows, and optionally create or update a client from each submission.
- Two main tabs: Submissions and Forms; Forms has sub-tabs Forms and Flows.
- Forms are drafts until published; a draft is saved disabled, a published form is live and enabled.

## 2. Feature Requests

### F-1: Form Builder
#### 1. What it does
Builds forms from a palette and links fields to client records.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Field palette | Builder | Short and Long Text, Number, Date, Dropdown, Multi-Select, Radio, Checkbox, File Upload, Email, Phone, Page Break, Section Break, Signature, HTML Block | |
| F-1.2: Client field mapping | Link | Map a field to a client system or custom field; create a custom field inline | Only mapped fields drive client data |
| F-1.3: Draft and publish | Action | Save as draft or publish; publish validates auto-create settings | |
| F-1.4: Conditional logic | Feature | Decision needed: scope of conditional logic (see G8-Q-12) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic builds an intake form | Adds fields, maps Email and Phone to client fields, publishes | **Form is live and ready to share** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Coordinator | Before visits, I want digital intake forms, so that clipboards are not needed. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A form with auto-create on cannot be published without a process and an initial stage. |

### F-2: Share, Link and Embed
#### 1. What it does
Delivers a form to recipients or publishes it for embedding.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Share drawer | Drawer | Pick clients or type email/phone; channels SMS, WhatsApp, Email, Patient Companion App | Decision needed: real message delivery (see G8-Q-13) |
| F-2.2: Link and embed | Generator | Public link and iframe snippet for live forms | Decision needed: public hosting (see G8-Q-13) |
| F-2.3: Draft warning | Rule | A draft form's link is not live until published | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Send intake before a visit | Shares the form with a client by SMS | **A sent entry appears in the client's Forms tab** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Coordinator | I want to send forms to patients on their phones, so that intake is done before arrival. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Sharing records one sent entry per recipient. |

### F-3: Submissions and Client Creation
#### 1. What it does
Turns a submission into a stored response and, if enabled on the form, a client.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Create Submitter as Client Profile | Setting | Off by default; picks process and initial stage | |
| F-3.2: Matching | Rule | Existing client found by email (case-insensitive) or phone (digits) | |
| F-3.3: Update existing | Rule | Fills empty name, email, phone, country; writes mapped company, role and custom fields | Decision needed: overwrite rules (see G8-Q-14) |
| F-3.4: Create new | Rule | New client with name (fallback email, then "New Contact"), chosen process, stage "<process>: <stage>", status Active | |
| F-3.5: Submission record | Log | Stored on the Submissions tab and the client's Forms tab; form submission count increases | |
| F-3.6: Required fields | Rule | Decision needed: required-field enforcement on submit (see G8-Q-15) | |
| F-3.7: Task and notifications | Rule | Decision needed: tasks and front-desk notification after submission (see G8-Q-08) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New lead submits the form | Submits with email and phone | **A client is created in the chosen process and stage** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Coordinator | When someone submits a form, I want them in the CRM, so that I do not retype data. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | With auto-create on and no match, a client is created; with a match, that client is updated. |
| F-3-2 | With auto-create off, no client is created and the submission is still stored. |

### F-4: Form Flows
#### 1. What it does
Bundles forms into an ordered flow with welcome and thank-you screens.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Flow list | Table | Search, enable, edit, share, duplicate, delete | |
| F-4.2: Steps | Editor | Add existing or new forms, Required flag, reorder | Confirmation when active clients exist |
| F-4.3: Preview | Drawer | Welcome, each form, thank-you | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New patient packet | Creates a flow of Intake and Consent | **Patients fill both in order** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Coordinator | I want a patient to complete several forms in one go. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Deleting a form used in flows warns and removes it from those flows. |

### F-5: Dashboard Metrics
Decision needed: define formula for Submissions 7d, Active forms, Top performer and Usage (see G8-Q-16).

### Not yet built
- Public hosted form page behind the link (see G8-I-62).
- Intake timeline event and front-desk notification (see G8-I-65).
- Medical-record fields beyond client demographics (see G8-I-63).
- Task creation from a submission (see G8-I-81).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Form Builder | F-1.1 to F-1.4 | Build forms and map fields to client data. |
| F-2 | Share, Link and Embed | F-2.1 to F-2.3 | Deliver or publish forms. |
| F-3 | Submissions and Client Creation | F-3.1 to F-3.7 | Store submissions and create or update clients. |
| F-4 | Form Flows | F-4.1 to F-4.3 | Bundle forms into ordered flows. |
| F-5 | Dashboard Metrics | none | Decision needed. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Coordinator | Digital intake forms. | F-1 |
| 2 | Practice Coordinator | Send forms to phones. | F-2 |
| 3 | Practice Coordinator | Submissions land in the CRM. | F-3 |
| 4 | Practice Coordinator | Multi-form intake packets. | F-4 |
```

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
| :--- | :--- | :--- | :--- | :--- |
| G8-E-01 | Steps offered in the builder do not run: the engine has no executor for Wait/Delay, SMS, WhatsApp, Email, Assign human, Webhook, Create Client/Appointment/Process, Parallel; delay values are ignored. A rule that looks configured does nothing for these steps. | lib/ruleEngine.ts:426-996 (handlers only for condition 426, field update 438, stage move 468-475, generate invoice 608, generate document 766, schedule appointment 965, send payment/invoice 984-987; no handler for the catalogue's create_appointment, create_client, create_process, wait, parallel, sms, email, whatsapp, assignhuman or webhook_trigger keys) | High | G8-I-08, G8-I-46 |
| G8-E-02 | Process delete handler exists with guards but nothing calls it; users cannot delete a process. | pages/Process.tsx:2920-2957 | Medium | G8-I-23 |
| G8-E-03 | Deleting a stage from the left list removes it immediately: no confirmation, no required-stage check, no replacement, so records in it are stranded. The in-panel delete migrates invoices, appointments and claims but not clients. | pages/Process.tsx:3837-3846; 3412-3486 | High | G8-I-24 |
| G8-E-04 | "Temporary Disable" switch only flips local state and a toast; not saved on the process and has no effect. | pages/Process.tsx:1402, 3950 | Medium | G8-I-22 |
| G8-E-05 | "Active Processes" and "Draft Processes" presets only clear the search box and are never active; they do not filter. | pages/Process.tsx:3612-3625 | Low | G8-I-25 |
| G8-E-06 | Export dialog entity filter lists "WebForm" (not a workflow entity) and omits Insurance and Task. | pages/Process.tsx:3674-3678 | Low | G8-I-19 |
| G8-E-07 | [SECURITY] No role gating on Workflows, Automation or Web Forms: nav items have no role list and routes are outside the settings guard, so any signed-in role can edit AI prompts, delete stages and rules, and publish forms. | config/navigation.ts:148-165; routes.tsx:233-244 | High | G8-I-09 |
| G8-E-08 | Collecting form data in a workflow step offers a fixed list of sample templates, not the organisation's real forms. | components/process/StepParametersFields.tsx:69, 4528; pages/Process.tsx:194 | Medium | G8-I-74 |
| G8-E-09 | Triggers offered with no emitter in the app, so a rule using them cannot fire: client created, call created/updated/ended, process created/updated, appointment created/updated (only booked, rescheduled, cancelled, completed, no-show and checked-in are emitted), invoice updated, insurance and claim events. Checked by listing every event-bus emit in the code (only these are emitted: client checked-in, updated, field-updated, product-assigned; appointment booked/rescheduled/cancelled/completed/no-show/checked-in; invoice created/sent/paid/partially-paid/overdue/voided; field updated; stage entered/exited) and there is no other dispatch path into the rule engine. | Offered in lib/useAutomationStore.ts:189-234 and types/automation.ts:79-143; emitters at lib/appointmentService.ts:837-1155, lib/invoiceService.ts:710-950, pages/ClientProfile.tsx:842-844, 4022, pages/patient/PatientCheckinScreen.tsx:76, 132, lib/useAutomationStore.ts:564-577 | High | G8-I-34 |
| G8-E-10 | Duplicate-event guard is an in-memory list, lost on reload; cycle check only catches "moves to the stage that triggers it", not longer loops (depth limit 10 is the only net). | lib/ruleEngine.ts:295-298, 353-357; lib/useAutomationStore.ts:348-363 | Medium | G8-I-37 |
| G8-E-11 | On load, any saved rule triggered by client/appointment check-in is silently deleted from storage (treated as legacy mock). | lib/useAutomationStore.ts:380-397 | High | G8-I-47 |
| G8-E-12 | Stage-move timeline/undo screen exists but is never imported, so history and undo are unreachable although the store supports them. | components/automation/StageMovementTimelineModal.tsx; lib/useAutomationStore.ts:596 | Medium | G8-I-42 |
| G8-E-13 | Automation page has no sidebar item and `/automations` is not a client route; users cannot discover it. | config/navigation.ts:144-168; routes.tsx:236 | Medium | G8-I-43 |
| G8-E-14 | Deleting a stage automation from the stage tab has no confirmation (the global page uses a native confirm). | components/process/StageAutomationsTab.tsx:182; pages/Process.tsx:4584 | Medium | G8-I-41 |
| G8-E-15 | Status pill toggles a live rule on/off with a single click and no confirmation or toast on the global page. | pages/Automation.tsx:209-223 | Low | G8-I-32 |
| G8-E-16 | Capsule counts include rules the table hides (product rules outside scope), so counts and rows can differ; "Active" sub-label just repeats the number. | pages/Automation.tsx:55-62, 76-96, 325-333 | Low | G8-I-38 |
| G8-E-17 | "Runs this week" counts rules that ran in the last 7 days, not runs; a rule firing 50 times counts once. Formula label: computed, but not a run count. | pages/Automation.tsx:82-87 | Medium | G8-I-39 |
| G8-E-18 | Public link and iframe embed point to a placeholder domain with no hosted form page behind it, shown as if live. | pages/WebForms.tsx:526-527; components/webform/ShareFormDrawer.tsx:273-274; components/forms/FormFlowDrawer.tsx:34-35 | High | G8-I-62 |
| G8-E-19 | Dashboard capsules are hardcoded (47 vs 31, 3 total/3 live, "Newsletter Signup" 89, 135 of 300). Metric label: hardcoded – formula undefined. | pages/WebForms.tsx:1011-1017 | Medium | G8-I-77 |
| G8-E-20 | Sharing by SMS, WhatsApp or Email only shows "Ready to send via ..."; nothing is sent, yet "sent" rows are written to Submissions and the client's Forms tab. | components/webform/ShareFormDrawer.tsx:296-306; pages/WebForms.tsx:927-1008 | High | G8-I-68 |
| G8-E-21 | "Publish form" on a draft in the detail drawer only shows a toast; status stays draft. | pages/WebForms.tsx:688 | Medium | G8-I-79 |
| G8-E-22 | No required-field validation on submit; required only draws an asterisk. A blank submission creates a "New Contact" client. | pages/WebForms.tsx:710 (asterisk only), 753-770 (submit handler, no check), 1114 ("New Contact" fallback name) | High | G8-I-80 |
| G8-E-23 | Sharing increases the form's "submissions" counter by number of recipients, so the metric counts sends, not submissions. | pages/WebForms.tsx:996-1001 | Medium | G8-I-78 |
| G8-E-24 | Deleting a form with no flow usage and deleting a flow have no confirmation; both are immediate. | pages/WebForms.tsx:1239-1243, 2203-2208 | Medium | G8-I-73 |
| G8-E-25 | Process selector for auto-create is not limited to client processes, so a form can place a client into an appointment or invoice process. | components/ui/ProcessStageSelect.tsx:135-150 | Medium | G8-I-69 |
| G8-E-26 | Conditional logic button is a stub ("coming soon"). | pages/FormBuilder.tsx:1031 | Low | G8-I-60 |
| G8-E-27 | [SECURITY] Submitted PII and client records live only in browser session/local storage with no access control or audit; submission, matching and client update run in the browser. | pages/WebForms.tsx:787-791, 1138-1199; data/forms.ts:230-236 | Medium | G8-I-63 |
| G8-E-28 | Stale routes and dead page: `/web-forms/new` and `/web-forms/builder` redirect to the list (deliberate, the builder now opens as a drawer, `pages/FormBuilder.tsx` is still used through `FormBuilderDrawer`); there is no client `/form-builder` route; `NewFormTemplate.tsx` is imported by the router but never mounted, and its own buttons navigate to `/web-forms/builder`, which redirects away. Reworded from "builder orphaned": only the new-template page is dead code. Not a user-facing defect. | routes.tsx:41-42, 241-242; pages/NewFormTemplate.tsx:66, 70; components/form-builder/FormBuilderDrawer.tsx:2 | Low | G8-I-60 |

## Open questions for PM
1. G8-Q-01 (G8-I-08, G8-E-01): Which steps must really execute (delay, SMS, WhatsApp, Email, webhook, assign human, create records)? Until then they must not look configured and live.
2. G8-Q-02 (G8-I-10): Should Tasks get an "Add Workflow" button, and is Insurance & Claims one entity or two?
3. G8-Q-03 (G8-I-15, G8-E-03): When a stage is deleted, must clients in it be moved to the replacement stage like invoices and appointments?
4. G8-Q-04 (G8-E-02): How should admins delete a process, and what about records inside it?
5. G8-Q-05 (G8-E-04): What should "Temporary Disable" do (stop AI, stop automations, hide from Kanban)?
6. G8-Q-06 (G8-E-14): Should deleting a stage automation require confirmation?
7. G8-Q-07 (G8-E-13): Add Automation to the sidebar under CUSTOMIZATIONS? The context PRD proposes a new sidebar item and a full-canvas page; the built page is a table.
8. G8-Q-08 (G8-I-81, G8-I-65): After a submission, should a task be created and staff notified? Should the new client enter the stage and fire stage automations (no automation event is emitted today)?
9. G8-Q-09 (G8-I-30): Are execution count, success rate and an audit log required on the rules table?
10. G8-Q-10 (G8-E-17): What does "Runs this week" mean: runs, successful runs, or rules that ran?
11. G8-Q-11 (G8-E-10, G8-E-11): Must once-per-event be persistent, must longer cycles be blocked at save, and should check-in rules be allowed to exist?
12. G8-Q-12 (G8-E-26): Is conditional logic in forms in scope?
13. G8-Q-13 (G8-E-18, G8-E-20): Where are forms publicly hosted, and when does sharing actually send SMS, WhatsApp or email?
14. G8-Q-14 (G8-I-63): When a submission matches an existing client, which fields may it overwrite?
15. G8-Q-15 (G8-E-22): Which fields must be required to create a client (at least email or phone)?
16. G8-Q-16 (G8-E-19): Define formulas for Submissions 7d, Active forms, Top performer and Usage (and the plan limit of 300).
17. G8-Q-17 (G8-I-09): Naming: use "Workflow" or "Process" for the record, and what do "Deals" and "Pipeline" mean? Today the sidebar says Workflows (/process) and Process (/deals), the page says Workflow, and PRD workflows.md describes a trigger/action canvas.
18. G8-Q-18 (G8-I-05): Should workflows.md and automation.md be merged, since the built "workflow" (stages) and "automation" (event rules) overlap?
19. G8-Q-19 (G8-E-07): Which roles may edit workflows, automations and forms?
