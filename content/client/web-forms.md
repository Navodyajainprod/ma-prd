---
title: "Web Forms: Intake Forms, Sharing and Client Creation"
product: "client"
module: "web-forms"
route: "/web-forms"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | WEB FORMS |
| Route | `/web-forms` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A page to build intake and lead-capture forms, share them, and optionally turn each submission into a client in a chosen process and stage. It has four capsules, Submissions and Forms tabs, Forms and Flows sub-tabs, a builder drawer, a share drawer and a preview that accepts submissions. There is no `/form-builder` page for clients: the builder opens as a drawer. |
| **Who uses it** | Care Coordinator (builds and shares forms). Patient (fills a form, today only from the in-app preview or the Companion app). No role is checked: any signed-in user can edit, publish and delete forms. |
| **Where you start it** | **Webforms** in the sidebar (`/web-forms`, under CUSTOMIZATIONS). `/forms`, `/web-forms/new` and `/web-forms/builder` redirect to the list. |
| **Where the result goes** | A submission row, a client (when auto-create is on) with an entry in the client's Forms tab, and the Companion app's Forms screen for forms shared with a client. Not to the Process boards and not to Tasks. |
| **How real is it** | 0 features work, 5 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Clients) | Client created or updated | With auto-create on, a submission finds a client by email or phone, or creates one with id `CL-` plus six digits. The page writes the client list to session storage only, so the new client may not show in the directory (XM-04). The submission is filed in the client's Forms tab. No timeline event is written. | [View Clients](/client/clients) |
| Client (Process Kanban) | Process and stage | The form stores a process name and a stage as text on the client. The client does not appear on the Process Kanban or List. | [View Process Kanban](/client/processes/kanban) |
| Client (Tasks) | Task for staff | Not connected. No task is created and no front-desk notification is sent. | [View My Tasks](/client/tasks/my-tasks) |
| Client (Workflows) | Collect Form Data step | The step lists a fixed set of sample templates, not the organisation's forms. The auto-create process and stage come from the process list on Workflows. | [View Workflows](/client/workflows) |
| Companion | Forms screen | A form shared with a client adds a pending entry that the patient sees in the portal, whatever channel was picked. SMS, WhatsApp and email send nothing. | [View Companion Forms](/companion/forms) |
| Client (Chats) | Website chat widget | A separate path. The widget creates a contact from the first message and does not use these forms. | [View Website chat](/client/chat/website) |

## 1. Module Summary

### The story in one minute

Priya Nair opens **Webforms** and presses **New form**. She adds Short Text, Email, Phone and Signature fields and maps Email and Phone to the client fields. In the settings she turns on **Create Submitter as Client Profile** and picks a process and the initial stage, then presses **Publish**. She opens the form and copies the **Live link**. It points to a placeholder domain with nothing behind it. She shares the form with Sarah Johnson by SMS. A toast says "Ready to send via SMS" and no text goes out, but a "sent" row appears. Priya tests the form from the **Preview** tab as Sarah and submits. The page says "New client created". The client is in the list with the stage written as text. No task is made and nobody is told.

**Naming note:** the sidebar says "Webforms", the page title says "Web Forms", and the earlier PRD said "Webforms" and "patient". The product uses "client". Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the Submissions and Forms tabs, the form list with search, sort and enable switch, the 15-type field palette, mapping fields to client fields, draft and publish, existing-client matching by email or phone, the submission row and the client's Forms tab entry, and Form Flows.
- **Simulated:** the dashboard figures are fixed numbers, the public link and embed point to a placeholder domain, sharing by SMS, WhatsApp and email only shows a toast while writing "sent" rows, Publish in the detail drawer is a toast, and the client is placed in a process by text only.
- **Not built:** a hosted public form, required-field checks, conditional logic, a task or notification after a submit, an intake timeline event, a standalone form builder page, and any role control.

### Journey position

```
Form built ─▶ Shared (toast only) ─▶ Preview submit ─▶ Client created or matched ─▶ Forms tab entry
                                                                                  └▶ Process and stage (text only)
```

## 2. Feature Requests

### F-1: Form list, dashboard and submissions

#### 1. What it does
Priya opens `/web-forms`. Four capsules sit on top. Below are two main tabs, **Submissions** and **Forms**. Forms has sub-tabs **Forms** and **Flows**. The forms table has search, sort by name, submissions or last updated, an enable switch and row actions **Edit**, **Share**, **Test** and **Delete**. Clicking a form opens a detail drawer with **Overview** and **Preview**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Dashboard capsules | KPI | Submissions 7d (47 vs 31), Active forms (3 total, 3 live), Top performer (Newsletter Signup, 89), Usage (135 of 300 On track) | ◐ Simulated | All four are fixed numbers (G8-E-19). Decision needed: D-99 |
| F-1.2: Tabs and sub-tabs | Tabs | Submissions and Forms. Forms and Flows | ● Works | |
| F-1.3: Forms table | Table | Search, sort, enable switch | ● Works | |
| F-1.4: Submissions per form | Counter | A stored counter, raised on each submit | ◐ Simulated | It is also raised once per recipient on share, so it counts sends (G8-E-23) |
| F-1.5: Detail drawer | Drawer | Overview shows description, field count, creator, created date, and for live forms a Live link and embed code. Preview renders the form | ● Works | |
| F-1.6: Publish from the detail drawer | Button | Shows a toast on a draft | ◐ Simulated | The form stays draft (G8-E-21) |
| F-1.7: Delete form | Action | If the form is in a flow a browser confirm warns and removes it from those flows. Otherwise it deletes with a toast | ◐ Simulated | No confirmation when no flow uses it (G8-E-24). Decision needed: D-06 |
| F-1.8: Submissions tab and submission drawer | Table, drawer | One row per submission, with a drawer and a client preview | ● Works | |
| F-1.9: Where data is kept | Rule | Submitted data and client records live in browser storage and the matching runs in the browser | ◐ Simulated | No access control or audit (G8-E-27) |
| F-1.10: Role control and per-form permissions | Rule | The create drawer sets view, edit and share permissions | ○ Not built | Nothing enforces them or any role (G8-E-07). Decision needed: D-17 |

#### 3. Worked example
Priya reviews the dashboard.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She opens the page | Reads the capsules | **47 submissions, 3 active forms and Newsletter Signup 89 show, whatever the real data** |
| 2 | She shares a form with 3 people | Looks at the table | **The form's submission count rose by 3 although nobody submitted** |
| 3 | A draft form is open | Presses **Publish form** in the drawer | **A toast shows. The form stays draft** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When I run several intake forms, I want to see each form, its state and its submissions, so that I know what patients have completed. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the dashboard, **then** the four capsules show fixed values that do not follow the data. |
| F-1-2 | **Given** a form shared with n recipients, **then** its submissions counter rises by n. |
| F-1-3 | **Given** a draft form, **when** Publish form is pressed in the detail drawer, **then** a toast shows and the status stays draft. |
| F-1-4 | **Given** a form not used in any flow, **when** Delete is chosen, **then** it is deleted at once with only a toast. |

### F-2: Build a form

#### 1. What it does
**New form** opens a create drawer and then the builder drawer. Priya picks fields from a palette, names them, and can link a field to a client field or create a custom client field inline. She saves a draft or publishes. If **Create Submitter as Client Profile** is on, she must choose a process and an initial stage first.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Create drawer then builder drawer | Drawer | Sets name, description and permissions, then opens the builder | ● Works | |
| F-2.2: Field palette | Palette | Short Text, Long Text, Number, Date, Dropdown, Multi-Select, Radio, Checkbox, File Upload, Email, Phone, Page Break, Section Break, Signature, HTML Block | ● Works | The earlier PRD named Date of Birth, Checkbox Group and Insurance Card Upload as separate fields. They are not distinct types |
| F-2.3: Drag and drop placement | Interaction | The earlier PRD asks for drag and drop | ◐ Simulated | Not verified in code (unverified) |
| F-2.4: Link fields to client fields | Mapping | A field maps to a system or custom client field. Custom fields can be created inline | ● Works | Only mapped fields are used to match and fill a client |
| F-2.5: Field name check | State | "Please enter a field name" | ● Works | |
| F-2.6: Live preview toggle | Toggle | Shows a toast "Live preview updated" | ◐ Simulated | The real preview is the Preview tab of the detail drawer |
| F-2.7: Save as draft | Button | Stores the form as draft and disabled. Toast "Form saved as draft" | ● Works | |
| F-2.8: Publish | Button | Stores the form as live and enabled | ● Works | |
| F-2.9: Create Submitter as Client Profile | Setting | Off by default. When on, a process and initial stage must be chosen or "Please select a Process and Initial Stage before publishing." shows | ● Works | The earlier PRD implied it is always on |
| F-2.10: Process and stage picker | Select | Lists processes and their stages | ◐ Simulated | Not limited to client processes, so an appointment or invoice process can be picked (G8-E-25) |
| F-2.11: Conditional logic | Button | Shows a "coming soon" toast | ○ Not built | (G8-E-26). Decision needed: D-112 |
| F-2.12: Standalone form builder page | Route | No client `/form-builder` route. The old new-form page is not mounted | ○ Not built | The builder opens only as a drawer (G8-E-28) |
| F-2.13: Collect Form Data step in Workflows | Step | The workflow step picks a form | ◐ Simulated | It lists a fixed set of sample templates, not the organisation's forms (G8-E-08) |

#### 3. Worked example
Priya builds an intake form.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She wants clients created | Turns on **Create Submitter as Client Profile** and presses **Publish** with no process | **"Please select a Process and Initial Stage before publishing." blocks it** |
| 2 | She picks a process and a stage | Presses **Publish** | **The form is live and enabled** |
| 3 | She taps Conditional logic | Presses the button | **A "coming soon" toast** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | Before patients arrive, I want to build an intake form with the fields I need, so that waiting room clipboards are eliminated. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** auto-create is on and no process and stage are chosen, **when** Publish is pressed, **then** a toast blocks it. |
| F-2-2 | **Given** auto-create is off, **then** publishing needs no process. This is the default. |
| F-2-3 | **Given** Save as draft, **then** the form is stored as draft and disabled. |
| F-2-4 | **Given** the process picker, **then** processes of every entity are offered. |

### F-3: Share, link and embed

#### 1. What it does
**Share** opens a drawer. Priya picks recipients, existing clients or a typed email or phone, and a channel: SMS, WhatsApp, Email or Patient Companion App, with optional conditions. She sees a link and an iframe embed snippet and can copy both. Sending adds a "sent" row per recipient and, for clients, a pending entry in the client's Forms tab. A draft form shows a banner: the link will not be publicly live until it is published.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Recipient picker | Picker | Existing clients or typed email or phone | ● Works | |
| F-3.2: Send by SMS, WhatsApp or Email | Channel | Shows "Ready to send via <channel>" | ◐ Simulated | Nothing is sent, yet "sent" rows are written (G8-E-20). Decision needed: D-112 |
| F-3.3: Patient Companion App channel | Channel | Adds a pending form the patient sees in the portal | ● Works | A pending form appears whatever channel was picked (XM-07) |
| F-3.4: Sent row and client Forms tab entry | Record | A "sent" row per recipient and a pending entry for clients | ◐ Simulated | Written even when nothing was sent (G8-E-20) |
| F-3.5: Public link and iframe embed | Code | Link and snippet are shown and copyable, also for flows | ◐ Simulated | They point to a placeholder domain with nothing behind it (G8-E-18). Decision needed: D-112 |
| F-3.6: Draft banner | State | "the link won't be publicly live until it's published" | ● Works | |
| F-3.7: Hosted public form page | Page | A visitor opens the link and submits | ○ Not built | Nothing is served. The earlier PRD also promised an "SSL encrypted link" |
| F-3.8: Patient fills and signs on a phone from an SMS link | Flow | Earlier PRD worked example | ○ Not built | No SMS is sent and no public page exists |

#### 3. Worked example
Priya sends the form to Sarah.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah is an existing client | Picks her, chooses **SMS** and sends | **"Ready to send via SMS". No text is sent** |
| 2 | Priya checks Sarah's profile | Opens her Forms tab | **A pending entry is there** |
| 3 | Priya copies the Live link | Opens it | **It goes to a placeholder domain with no form** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator | Before a visit, I want to send the form to the patient on the channel they use, so that they complete it on their phone. |
| F-3-J2 | Patient | When the clinic asks me for details, I want to open the form from a link on my phone, so that I do not fill in a paper form. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** SMS, WhatsApp or Email is chosen, **when** Send is pressed, **then** a toast shows, "sent" rows are written and no message is delivered. |
| F-3-2 | **Given** a live form, **then** its link and embed point to a placeholder domain that serves no form. |
| F-3-3 | **Given** a draft form, **when** Share opens, **then** the draft banner shows. |

### F-4: Submit a form and create a client

#### 1. What it does
Sarah fills the form in the **Preview** tab. She presses submit. If the form's auto-create option is on, the page looks for an existing client by email, ignoring case, or phone, digits only. A match gets its empty name, email, phone and country filled, and mapped company, role and custom fields written. No match creates a client with id `CL-` plus six digits, status Active, and the stage text "<process>: <stage>", default "Initial Contact". In every case a submission row is added.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Submit from Preview or Test | Action | Collects the values. This is the only submit path | ● Works | No public page can submit |
| F-4.2: Required-field check | Rule | A required field only draws an asterisk | ○ Not built | A blank submit creates a client named "New Contact" (G8-E-22). Decision needed: D-24 |
| F-4.3: Match an existing client | Rule | By email ignoring case, or phone digits only. Name is never used | ● Works | |
| F-4.4: Fill a matched client | Rule | Fills only empty name, email, phone and country, and writes mapped company, role and custom fields | ● Works | Which fields may be overwritten is open. Decision needed: D-23 |
| F-4.5: Create a new client | Rule | Name falls back to email then "New Contact". Country defaults to US. Toast "New client created" | ◐ Simulated | Written to the session copy of the client list only, so it may not show in the directory (XM-04, G8-E-27) |
| F-4.6: Auto-create off | State | No client is created. The submission row is still added | ● Works | |
| F-4.7: Submission row and Forms tab entry | Record | A completed submission row. For a client, an entry in the client's Forms tab | ● Works | |
| F-4.8: Place the client in a process and stage | Rule | The stage is saved as text on the client | ◐ Simulated | No Process List row, no Kanban card, no activity entry (G8-I-81). Decision needed: D-111 |
| F-4.9: Task and front-desk notification | Rule | Earlier PRD worked example | ○ Not built | No task is created and nobody is notified. Decision needed: D-111 |
| F-4.10: Automation event and stage automations | Rule | A submit could fire stage automations | ○ Not built | No event is emitted. Decision needed: D-111 |
| F-4.11: Intake timeline event and medical record data | Rule | Earlier PRD acceptance | ○ Not built | Only demographic fields are written and no timeline event is added (G8-I-65) |

#### 3. Worked example
Sarah submits the intake form.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah is already a client | Submits with her email in capitals | **She is matched. Her empty fields are filled and a Forms tab entry is added** |
| 2 | A stranger's phone and email | Submits | **"New client created". The client has the stage text "<process>: <stage>"** |
| 3 | Nothing is filled in | Submits | **A "New Contact" client is created** |
| 4 | Priya looks for a follow-up | Opens Tasks and the Process Kanban | **No task and no card** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Care Coordinator | When a form is submitted, I want the person added or updated as a client in the right stage, so that nobody types the data again. |
| F-4-J2 | Patient | After I submit the form, I want the clinic to act on it, so that I am not left waiting. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** auto-create is on and the email or phone matches a client, **when** the form is submitted, **then** that client's empty core fields are filled and no new client is created. |
| F-4-2 | **Given** auto-create is on and nothing matches, **then** a client is created with the process and stage text. |
| F-4-3 | **Given** an empty submission, **then** a client named "New Contact" is created. No error shows. |
| F-4-4 | **Given** any submit, **then** no task is created, no one is notified and no automation event is emitted. |
| F-4-5 | **Given** auto-create is off, **then** only the submission row is added. |

### F-5: Form Flows

#### 1. What it does
A flow bundles several forms into an ordered set of steps. Priya names a flow, adds existing or new forms, marks each **Required**, drags to reorder and writes a welcome and a thank-you screen. She can preview, duplicate, switch it on or off, and copy its link and embed code.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Create flow | Drawer | Name is required | ● Works | |
| F-5.2: Steps with Required flag and reorder | List | Forms as ordered steps, drag to reorder | ● Works | |
| F-5.3: Welcome and thank-you screens, preview, duplicate, enable | Controls | As named | ● Works | |
| F-5.4: Confirm when adding to a flow with active clients | State | Asks for confirmation | ● Works | |
| F-5.5: Flow link and embed code | Code | Shown and copyable | ◐ Simulated | Same placeholder domain (G8-E-18) |
| F-5.6: Delete flow | Action | Removes the flow at once | ◐ Simulated | No confirmation (G8-E-24). Decision needed: D-06 |

#### 3. Worked example
Priya makes a new-patient pack.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Two forms are needed | Creates a flow and adds both, marking one **Required** | **An ordered flow with welcome and thank-you screens** |
| 2 | The flow is no longer needed | Deletes it | **It is gone at once with no confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Care Coordinator | When a new patient needs several forms, I want to send them as one pack, so that they finish everything in one go. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** a flow with no name, **then** it cannot be created. |
| F-5-2 | **Given** a flow with active clients, **when** a form is added, **then** a confirmation is asked. |
| F-5-3 | **Given** Delete on a flow, **then** it is removed at once. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Form list, dashboard, submissions | F-1.1 – F-1.10 | ● / ◐ / ○ | List works; capsules fixed; Publish in drawer is a toast. |
| F-2 | Build a form | F-2.1 – F-2.13 | ● / ◐ / ○ | Builder works; conditional logic and builder page absent. |
| F-3 | Share, link and embed | F-3.1 – F-3.8 | ● / ◐ / ○ | Link points nowhere; sending only toasts. |
| F-4 | Submit and create client | F-4.1 – F-4.11 | ● / ◐ / ○ | Matching works; no required check, task or event. |
| F-5 | Form Flows | F-5.1 – F-5.6 | ● / ◐ | Flows work; link is a placeholder; delete unconfirmed. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | See each form, its state and its submissions | F-1 |
| 2 | Care Coordinator | Build an intake form with the fields I need | F-2 |
| 3 | Care Coordinator | Send the form on the channel the patient uses | F-3 |
| 4 | Patient | Open the form from a link on my phone | F-3 |
| 5 | Care Coordinator | Add or update the client in the right stage | F-4 |
| 6 | Patient | Have the clinic act after I submit | F-4 |
| 7 | Care Coordinator | Send several forms as one pack | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Build, publish, share, test and delete forms and flows, and create clients through submissions | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything. Nothing public exists to submit from |
| Patient (Companion app) | See a form shared with them as pending | Nothing further is built here |

The earlier PRD names the Practice Coordinator and says nothing about access. A form's permissions object is saved but never enforced. Decision needed: D-17.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Submissions 7d (and vs prior) | Capsule | 47 vs 31. **Hardcoded, formula undefined** (G8-E-19) |
| Active forms (and live) | Capsule | 3 total, 3 live. **Hardcoded, formula undefined** |
| Top performer | Capsule | Newsletter Signup, 89. **Hardcoded, formula undefined** |
| Usage | Capsule | 135 of 300, On track. **Hardcoded, formula undefined** |
| Submissions per form | Forms table | Stored counter, raised on submit and, wrongly, on share (G8-E-23). Decision needed: D-99 |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| **Web form** → Client → Process → Task | Visitor opens the public link | Not built. The link points to a placeholder domain. |
| | Submit creates or updates a client | Only from Preview or Test, and only with auto-create on. Match by email or phone. No required check. Session copy only. |
| | Submission on the client profile | A Forms tab entry is added. No timeline event. |
| | Client placed in a process and stage | Text on the client only. The Process boards never show it. |
| | Task or front-desk notification | Not built. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical: Client or Patient, Webforms or Web Forms? | Naming note |
| D-06 | Should every destructive action, including deleting a form or a flow, ask for confirmation? | F-1.7, F-5.6 |
| D-17 | Which roles may edit workflows, automations and forms? | F-1.10 |
| D-23 | Which fields may a submission overwrite on a matched client? | F-4.4 |
| D-24 | Which fields must be filled to create a client? | F-4.2 |
| D-99 | What are the formulas for Submissions 7d, Active forms, Top performer and Usage? | F-1.1, F-1.4 |
| D-111 | After a submission, should a task be created, staff notified, and the client enter the stage and fire stage automations? | F-4.8, F-4.9, F-4.10 |
| D-112 | Where are forms publicly hosted, when does sharing really send, and is conditional logic in scope? | F-2.11, F-3.2, F-3.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
