---
title: "Workflows: Processes, Stages, AI Behaviour and Stage Automations"
product: "client"
module: "workflows"
route: "/process"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | WORKFLOWS |
| Route | `/process` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A process and stage editor, not a node canvas. A process is an ordered list of stages for one kind of record (client, appointment, invoice, insurance and claim, task). Each stage carries the AI receptionist's behaviour and the automations that run when a record enters or leaves it. A flow canvas opens as a drawer from the automation editor. |
| **Who uses it** | Care Coordinator (designs stages and automations). Practice Admin (same screens). No role is checked: any signed-in user can edit AI prompts, delete stages and delete automations. |
| **Where you start it** | **Workflows** in the sidebar (`/process`, under CUSTOMIZATIONS), the workflow gear on an invoice, or the add-knowledge button on a process. |
| **Where the result goes** | The Process Kanban and List pages (stages), appointment, invoice and claim stage names, the shared automation store (so stage automations also appear on `/automation`), and the Knowledge Base scope picker. |
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
| Client (Process Kanban) | Stages become board columns | The stages of a process are the columns of the Process Kanban at `/deals`. | [View Process Kanban](/client/processes/kanban) |
| Client (Process List) | Stage per record | The Process List page is the list view of the same processes. | [View Process List](/client/processes/list) |
| Client (Automation) | Stage automations | Saving a stage automation also creates or updates a rule in the shared rule store, so it appears on the Automation page. Deleting it on either page removes the same rule. | [View Automation](/client/automation) |
| Client (Appointments) | Stage moves and statuses | Appointment stages come from the appointment process. Deleting a stage re-points appointments to the replacement stage you choose. | [View Appointments](/client/appointments/list) |
| Client (Invoices) | Stage moves and statuses | Invoice stages come from the invoice process. Deleting a stage re-points invoices. The workflow gear on an invoice opens this page. | [View Invoices](/client/invoices) |
| Client (Claims) | Stage moves and statuses | Insurance and claim stages come from the Insurance & Claims process. Deleting a stage re-points claims. | [View Claims](/client/claims) |
| Client (Clients) | Client stage | Deleting a stage does not move clients that sit in it. They are left in a stage that no longer exists (G8-E-03). | [View Clients](/client/clients) |
| Client (Knowledge Base) | Add knowledge | The add-knowledge button on a process opens the Knowledge Base create drawer scoped to that process. The scope picker there lists two fixed sample processes, not the live list. | [View Knowledge Base](/client/knowledge-base) |
| Client (Tasks) | Task process | The Tasks entity creates a default task process on first visit. A Create Task step is not offered in the flow builder. | [View My Tasks](/client/tasks/my-tasks) |
| Client (Web Forms) | Collect Form Data step | The step offers a fixed list of sample templates, not the organisation's own forms. A form's auto-create setting picks a process and stage from this page. | [View Web Forms](/client/web-forms) |
| AI Receptionist | Stage AI settings | Greeting, objective, model, voice, speed, tone and inbound numbers are saved on the stage. The kiosk settings page is separate. | [View Reception settings](/client/settings/reception) |

## 1. Module Summary

### The story in one minute

Priya Nair opens **Workflows** in the sidebar. The page header reads "Workflow" with the badge "Workflow Architect". She picks **Appointments** in the entity dropdown and sees the processes with their stages. She opens the Booked stage and sets the **Action** to Handle By Human with a responsible person. She writes in plain English when a record should move to this stage. On the **Automations** tab she presses **Add Stage Automation**. A flow builder drawer opens. She adds a **Wait** step of 24 hours and then a **WhatsApp** step, and saves. The rule appears in the stage list and on the Automation page. Nothing is sent a day later, because the engine has no code for those two steps. Priya can still see them, switch them on and off, and edit them.

**Naming note:** the sidebar item is **Workflows**, the page header says "Workflow", and the panels, search box and entity dropdown say "Process". The Kanban page is labelled "Process" in the sidebar. The earlier PRD called this a "Workflow Designer Canvas" of trigger, condition and action nodes. Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the entity dropdown, adding and listing processes, the stage editor with its General and Automations tabs, the AI prompt and voice settings saved on a stage, required stages that cannot be deleted, hand-off between processes, and the flow canvas with zoom, palette and branch wires.
- **Simulated:** Temporary Disable and the Active and Draft presets do nothing, Export offers a wrong entity list, deleting a stage from the left list strands records, and Wait, SMS, WhatsApp, Email, Assign human, Webhook and create-record steps can be configured but never run.
- **Not built:** deleting a process, an Add button for Tasks, grid snapping, a mini-map, port-type checks on wires, a Create Task step, and any role control.

### Journey position

```
Entity ─▶ Process ─▶ Stage ─▶ General settings (AI) ─▶ Stage automations ─┬▶ Process Kanban columns
                                                                          ├▶ Shared rule store (Automation page)
                                                                          └▶ Steps with no runner (do nothing)
```

## 2. Feature Requests

### F-1: Pick an entity and manage processes

#### 1. What it does
Priya opens `/process`. A top bar holds an entity dropdown that reads "<Entity> Workflow (n)", a search box, **Export** and a primary add button. The button reads **Add Workflow** for clients and **Add Appointment Workflow**, **Add Invoice Workflow** or **Add Insurance & Claim Workflow** for the others. On the left is a list of process cards that expand to their stages. On the right she sees the process: name, description, stages ribbon, assigned products and services, and process-level Calling, Chatbot and Portal and Reception switches.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Entity dropdown | Select | Processes, Appointments, Invoices, Insurance & Claims, Tasks, each with a count | ● Works | Claims are folded into Insurance. Tasks creates a default process on first visit. Decision needed: D-07 |
| F-1.2: Add process | Modal | Name and description are both required, otherwise "Please fill all fields". The new process gets default stages and default AI settings | ● Works | |
| F-1.3: Add for Tasks | Button | No add button is shown for the Tasks entity | ○ Not built | Decision needed: D-07 |
| F-1.4: Process list and search | List | Cards expand to stages and stages drag to reorder. Search placeholder "Search processes..." | ● Works | |
| F-1.5: Active and Draft Processes presets | Chips | Show a count of processes with and without the draft flag | ◐ Simulated | Clicking only clears the search box and never filters (G8-E-05) |
| F-1.6: Process panel | Panel | Edit name and description, stages ribbon with in-progress, won and lost stages, assigned products and services | ● Works | |
| F-1.7: Process switches | Switch | Calling, Chatbot and Portal and Reception switches apply to the stages of the process. Stage overrides have their own dialogs | ● Works | |
| F-1.8: Temporary Disable | Switch | Flips local state and shows a toast | ◐ Simulated | Not saved on the process and has no effect (G8-E-04). Decision needed: D-113 |
| F-1.9: Visibility by organisation | Rule | A process shows only when its industry, category and location match the active organisation. If nothing matches for appointments or insurance, the default process is shown | ● Works | |
| F-1.10: Export | Dialog | Entity filter and chosen columns: name, description, entity, stage count, stages, draft or published | ◐ Simulated | The filter offers "WebForm" and omits Insurance and Task (G8-E-06) |
| F-1.11: Test Process and Test Intent Resolution | Drawer | A test chat drawer and an intent test for the process | ● Works | |
| F-1.12: Delete process | Action | The delete handler exists with guards but no control calls it | ○ Not built | (G8-E-02). Decision needed: D-32 |
| F-1.13: Empty states | State | "No data added" and "Not configured" on stage fields | ● Works | |
| F-1.14: Role control | Rule | Any signed-in user can edit, delete and publish | ○ Not built | (G8-E-07). Decision needed: D-17 |

#### 3. Worked example
Priya looks at the appointment pathway.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She needs the appointment stages | Picks **Appointments** in the dropdown | **The appointment processes appear with their stages** |
| 2 | She wants to pause a process while she edits it | Turns on **Temporary Disable** | **A toast shows. Nothing is stopped and the switch is not saved** |
| 3 | She adds a process with no description | Presses save | **"Please fill all fields" appears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When I set up a care pathway, I want to see every process and its stages by record type, so that I can adjust the journey without code. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a new process with a blank name or description, **when** the user saves, **then** "Please fill all fields" shows and nothing is created. |
| F-1-2 | **Given** Temporary Disable is switched on, **then** only a toast shows. The process stays unchanged and active. |
| F-1-3 | **Given** the Active Processes chip is clicked, **then** the list is not filtered. |
| F-1-4 | **Given** the Tasks entity, **then** no add button is shown. |

### F-2: Set up a stage, its AI behaviour and its hand-off

#### 1. What it does
Priya clicks a stage. A panel opens with two tabs, **General** and **Automations**. On General she chooses what happens: **Client Reach Out To Us**, **Reach Out To The Client**, **No Action** or **Handle By Human**. She names the responsible person, the outbound source and the inbound numbers and channels. She writes **When to move to this stage** in plain English. She also writes the AI prompt, greeting, objective, business information, languages, model, voice, speed and tone. **Save Changes** writes everything to the stage. For the final stage she can add a won or lost stage and link it to a stage of another process with **Connect Next Process Stage**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Add and edit stage | Modal | Adds or edits a stage with name and details | ● Works | |
| F-2.2: Action and Responsible Person | Select | Four actions. Responsible Person is only asked for Handle By Human | ● Works | |
| F-2.3: Outbound source, inbound numbers and channels | Fields | Saved on the stage | ● Works | |
| F-2.4: When to move to this stage | Text | Plain-English intent stored on the stage for the AI | ● Works | |
| F-2.5: AI prompt, greeting, objective, business information, languages | Form | Single or comprehensive prompt mode. Saved on the stage | ● Works | |
| F-2.6: AI model, voice, speed, tone | Select | Saved on the stage | ● Works | |
| F-2.7: Won and Lost stages, Connect Next Process Stage | Modal | Links a final stage to a stage of another process | ● Works | |
| F-2.8: Required stages | Rule | A stage that fills a required category or is predefined cannot be deleted. The button is disabled with "Predefined stage cannot be deleted". A process keeps at least one stage | ● Works | |
| F-2.9: Delete stage from the stage panel | Modal | Asks for a replacement stage. Invoices, appointments and claims in the deleted stage move to it | ◐ Simulated | Clients in the stage are not moved (G8-E-03). Decision needed: D-32 |
| F-2.10: Delete stage from the left list | Action | Removes the stage at once with only a toast | ◐ Simulated | No confirmation, no replacement and no required-stage check beyond hiding the button, so records are stranded (G8-E-03). Decision needed: D-32 |
| F-2.11: Stage-move history with undo | Screen | The code and store exist | ○ Not built | The screen is never mounted (G8-E-12) |

#### 3. Worked example
Priya cleans up the stages of a client process.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A stage is no longer needed | Opens the stage and presses delete | **A modal asks for a replacement stage. Invoices, appointments and claims move there. Clients do not** |
| 2 | She is in a hurry | Deletes another stage from the left list | **It disappears with only a toast. Records in it are left without a stage** |
| 3 | She tries the same on a Paid stage | Looks at the delete button | **It is disabled: "Predefined stage cannot be deleted"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When I define what the AI says and who handles a stage, I want to set it in one panel, so that each stage behaves the same way every time. |
| F-2-J2 | Practice Admin | When a stage is retired, I want its records moved to a replacement, so that no record is lost. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a stage panel, **when** Save Changes is pressed, **then** all General fields are written to the stage. |
| F-2-2 | **Given** Handle By Human is not chosen, **then** no Responsible Person is asked for. |
| F-2-3 | **Given** a stage is deleted from the panel with a replacement, **then** its invoices, appointments and claims move to the replacement. Its clients stay where they were. |
| F-2-4 | **Given** a stage is deleted from the left list, **then** it is removed at once with no confirmation and no replacement. |
| F-2-5 | **Given** a required or predefined stage, **then** delete is disabled. |

### F-3: Stage automations

#### 1. What it does
The **Automations** tab lists the rules attached to the stage. Each row shows the name, a trigger badge ("On Stage Entry" or "On Stage Exit", or a global trigger), up to three action chips, an on and off switch, edit and delete. With no rules it reads "No Automations for <stage>" and offers **Add Stage Automation**. Add and edit open the Add Automation drawer in flow-builder view. Saving writes the stage's steps and creates or updates a rule in the shared store, so the rule also appears on the Automation page.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Stage automation list | Table | Name, trigger badge, up to three action chips, on and off switch | ● Works | |
| F-3.2: Add and edit | Drawer | Opens the flow builder. Save writes the stage steps and the shared rule | ● Works | |
| F-3.3: Shared rule store | Rule | A stage automation and a global rule are one store, so a rule can show on both pages | ● Works | |
| F-3.4: Delete stage automation | Action | Deletes the rule | ◐ Simulated | No confirmation here, while the Automation page asks (G8-E-14). Decision needed: D-06 |
| F-3.5: Empty state | State | "No Automations for <stage>" with the Add Stage Automation button | ● Works | |
| F-3.6: Rules that run | Rule | Whether the saved steps run depends on the step. See F-4 | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-3.7: Check-in rules | Rule | A rule triggered by a client or appointment check-in can be saved | ◐ Simulated | It is deleted from storage the next time rules load (G8-E-11). Decision needed: D-113 |

#### 3. Worked example
Priya wants a message 24 hours after check-out.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Stage has no rules | Opens **Automations** | **"No Automations for Checked Out" and an Add Stage Automation button** |
| 2 | She builds Wait 24 hours then WhatsApp | Saves | **The rule is listed, switched on, and also appears on the Automation page** |
| 3 | A patient is checked out | Waits a day | **No message is sent. The Wait and WhatsApp steps have no runner** |
| 4 | She deletes the rule | Presses delete on the tab | **It is removed at once with no confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator | When a record enters a stage, I want follow-up steps to run by themselves, so that patients are not forgotten. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a stage with no rules, **then** "No Automations for <stage>" and the add button show. |
| F-3-2 | **Given** a stage automation is saved, **then** the same rule is listed on the Automation page. |
| F-3-3 | **Given** the delete icon on the stage tab, **when** pressed, **then** the rule is removed with no confirmation. |
| F-3-4 | **Given** a rule with a Wait, SMS, WhatsApp or Email step, **when** its trigger fires, **then** that step does nothing. |

### F-4: The flow canvas and its steps

#### 1. What it does
From the automation editor Priya presses **Show in flow builder**. A drawer opens with a canvas. She zooms from 25 percent to 200 percent, picks steps from the palette and joins them with wires. A condition node has a **Case 1** and an **Else** branch. A parallel node has several. The canvas has no mini-map and no grid snapping.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Canvas with zoom | Canvas | Zoom 25 to 200 percent. Opens as a drawer, not as a page | ● Works | |
| F-4.2: Node palette | Palette | Groups Logic and Routing, Create CRM Entities, Records and Billing, Communication, Data and Assignment, plus a trigger list | ● Works | The earlier PRD named Triggers, Conditions, Actions and Delays |
| F-4.3: Wires and branch ports | Wire | Joins steps. Condition has Case 1 and Else. Parallel has several | ● Works | |
| F-4.4: Steps that run | Engine | Condition (stops the later steps when false), Field Update, Update to stage, Generate Invoice, Generate Document, Schedule Appointment | ● Works | Checked in the rule engine code |
| F-4.5: Send Payment and Send Invoice | Engine | Calls the invoice send with a WhatsApp default | ◐ Simulated | The invoice send only marks it sent (G7-E-15) |
| F-4.6: Wait or Delay, SMS, WhatsApp, Email, Assign to a Human, Webhook, Create Client, Create Appointment, Create Process, Parallel | Steps | Can be placed and configured on the canvas | ◐ Simulated | No code in the engine runs them and delay values are ignored (G8-E-01). Decision needed: D-110 |
| F-4.7: Create Task step | Step | Offered in the earlier PRD | ○ Not built | No such step exists (G8-I-07) |
| F-4.8: Grid snapping and mini-map | Canvas | Described in the earlier PRD | ○ Not built | (G8-I-02) |
| F-4.9: Port-type validation on wires | Rule | Described in the earlier PRD | ○ Not built | Not found in code (G8-I-04) |
| F-4.10: "Patient Arrived" and "Patient Checked Out" triggers | Trigger | Named in the earlier PRD | ○ Not built | The nearest trigger is checked-in, and rules using it are deleted on load (G8-E-11) |
| F-4.11: Valid chains run in order on a trigger | Rule | Earlier PRD acceptance | ◐ Simulated | Only the steps in F-4.4 run |

#### 3. Worked example
Priya designs a post-visit chain.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She opens the builder | Zooms out and adds a **Condition**, then **Generate Invoice** | **The wires join and the invoice step runs when the condition is true** |
| 2 | She adds **Wait** and **SMS** after it | Saves | **Both can be configured. Neither runs** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Care Coordinator | When I set a follow-up protocol, I want a visual flow, so that I can design it without writing code. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** the canvas, **then** zoom runs from 25 to 200 percent and there is no mini-map or snapping. |
| F-4-2 | **Given** a condition step that is false, **then** the steps after it do not run. |
| F-4-3 | **Given** a Wait, SMS, WhatsApp, Email, Assign human or Webhook step, **when** the rule fires, **then** nothing runs for that step. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Entities and processes | F-1.1 – F-1.14 | ● / ◐ / ○ | Add and list work; Temporary Disable, presets and Export do not; no delete or role control. |
| F-2 | Stage, AI behaviour and hand-off | F-2.1 – F-2.11 | ● / ◐ / ○ | Stage settings save; stage delete strands clients. |
| F-3 | Stage automations | F-3.1 – F-3.7 | ● / ◐ | Rules are saved and shared; delete has no confirmation. |
| F-4 | Flow canvas and steps | F-4.1 – F-4.11 | ● / ◐ / ○ | Canvas and six steps work; messaging and delay steps do nothing. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | See every process and its stages by record type | F-1 |
| 2 | Care Coordinator | Define what the AI says and who handles a stage | F-2 |
| 3 | Practice Admin | Move records to a replacement when a stage is retired | F-2 |
| 4 | Care Coordinator | Have follow-up steps run by themselves | F-3 |
| 5 | Care Coordinator | Design a follow-up protocol visually | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/process`, edit stages, AI prompts and automations, delete stages and rules | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names the Clinical Coordinator as the user and says nothing about access. The roles drawer lists a processSettings permission but nothing checks it. Decision needed: D-17.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Processes per entity | Entity dropdown | Count of processes of that entity |
| Active Processes | Preset chip | Count of processes without the draft flag. The chip does not filter (G8-E-05) |
| Draft Processes | Preset chip | Count of processes with the draft flag. The chip does not filter (G8-E-05) |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Web form → Client → **Process** → Task | Choose process and stage | A form's auto-create setting offers processes from this page, including non-client processes. The client gets a text stage only and never appears on the Process boards. |
| | Create Task step | Not offered. No form, process or automation creates a task. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which name is canonical: Process, Workflows, Deals or Pipeline? | Naming note |
| D-06 | Should every destructive action, including deleting a stage automation, ask for confirmation? | F-3.4 |
| D-07 | Is Insurance and Claims one entity or two, and does Tasks get an Add Workflow button? | F-1.1, F-1.3 |
| D-17 | Which roles may edit workflows, automations and forms? | F-1.14 |
| D-32 | Can a process or stage be deleted once referenced, and must its clients move to a replacement stage? | F-1.12, F-2.9, F-2.10 |
| D-110 | Which steps must really execute (delay, SMS, WhatsApp, Email, webhook, assign human, create records, Create Task), and should the rest be hidden or marked not live? | F-3.6, F-4.6 |
| D-113 | What should Temporary Disable do, and should check-in rules be allowed to exist? | F-1.8, F-3.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
