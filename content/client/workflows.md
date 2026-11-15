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
| **How real is it** | 0 features work, 6 are partly simulated, 0 are not built. The Portal and Reception settings are read by the patient portal and the kiosk. The Calling and Chatbot switches and settings are saved but nothing reads them. See the legend below. |

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
| Client (Chats, WhatsApp) | Numbers and chatbot settings | The Chatbot drawer saves WhatsApp and SMS numbers on a process or stage, and the picker lists the numbers from Integrations. No inbox, bot or routing code reads them. | [View WhatsApp](/client/chat/whatsapp) |
| Client (Integrations) | WhatsApp numbers | A number added in the Chatbot drawer WhatsApp picker is also stored in the Integrations number list. | [View Integrations](/client/settings/integrations) |
| AI Receptionist | Stage AI settings | Greeting, objective, model, voice, speed, tone and inbound numbers are saved on the stage. The Client Portal & AI Receptionist switch and the stage card title, description and HTML are read by the kiosk Next Step and by the patient portal. The kiosk settings page is separate. | [View Reception settings](/client/settings/reception) |

## 1. Module Summary

### The story in one minute

Priya Nair opens **Workflows** in the sidebar. The page header reads "Workflow" with the badge "Workflow Architect". She picks **Appointments** in the entity dropdown and sees the processes with their stages. She opens the Booked stage and sets the **Action** to Handle By Human with a responsible person. She writes in plain English when a record should move to this stage. On the **Automations** tab she presses **Add Stage Automation**. A flow builder drawer opens. She adds a **Wait** step of 24 hours and then a **WhatsApp** step, and saves. The rule appears in the stage list and on the Automation page. Nothing is sent a day later, because the engine has no code for those two steps. Priya can still see them, switch them on and off, and edit them.

**Naming note:** the sidebar item is **Workflows**, the page header says "Workflow", and the panels, search box and entity dropdown say "Process". The Kanban page is labelled "Process" in the sidebar. The earlier PRD called this a "Workflow Designer Canvas" of trigger, condition and action nodes. Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the entity dropdown, adding and listing processes, the stage editor with its General and Automations tabs, the AI prompt and voice settings saved on a stage, required stages that cannot be deleted, hand-off between processes, the flow canvas with zoom, palette and branch wires, and the Client Portal & AI Receptionist switches and stage card, which the patient portal and kiosk read.
- **Simulated:** Temporary Disable and the Active and Draft presets do nothing, Export offers a wrong entity list, deleting a stage from the left list strands records, Wait, SMS, WhatsApp, Email, Assign Responsible, Webhook, Parallel, End Workflow and create-record nodes can be configured but never run, and the Enable Calling and Enable Chatbot switches with the Call Trigger and Chatbot Channel settings are saved but nothing reads them.
- **Not built:** deleting a process, an Add button for Tasks, grid snapping, a mini-map, port-type checks on wires, a Create Task step, any role control, a welcome message, AI prompt or knowledge base field in the Chatbot drawer, a stored default for chatbot settings, and WhatsApp number routing to a workflow.

### Journey position

```
Entity ─▶ Process ─▶ Stage ─▶ General settings (AI) ─▶ Stage automations ─┬▶ Process Kanban columns
                                                                          ├▶ Shared rule store (Automation page)
                                                                          ├▶ Steps with no runner (do nothing)
                                                                          └▶ Portal and Reception card ─▶ Patient portal and kiosk
```

## 2. Feature Requests

### F-1: Pick an entity and manage processes

#### 1. What it does
Priya opens `/process`. A top bar holds an entity dropdown that reads "<Entity> Workflow (n)", a search box, **Export** and a primary add button. The button reads **Add Workflow** for clients and **Add Appointment Workflow**, **Add Invoice Workflow** or **Add Insurance & Claim Workflow** for the others. On the left is a list of process cards that expand to their stages. On the right she sees the process: name, description, stages ribbon, assigned products and services, and process-level Calling, Chatbot and Portal and Reception switches (see F-5).

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Entity dropdown | Select | Processes, Appointments, Invoices, Insurance & Claims, Tasks, each with a count | ● Works | Claims are folded into Insurance. Tasks creates a default process on first visit. Decision needed: D-07 |
| F-1.2: Add process | Modal | Name and description are both required, otherwise "Please fill all fields". The new process gets default stages and default AI settings | ● Works | |
| F-1.3: Add for Tasks | Button | No add button is shown for the Tasks entity | ○ Not built | Decision needed: D-07 |
| F-1.4: Process list and search | List | Cards expand to stages and stages drag to reorder. Search placeholder "Search processes..." | ● Works | |
| F-1.5: Active and Draft Processes presets | Chips | Show a count of processes with and without the draft flag | ◐ Simulated | Clicking only clears the search box and never filters (G8-E-05) |
| F-1.6: Process panel | Panel | Edit name and description, stages ribbon with in-progress, won and lost stages, assigned products and services | ● Works | |
| F-1.7: Process switches | Switch | Calling, Chatbot and Client Portal & AI Receptionist cards on the process panel. The Portal switch sets every stage. The Calling and Chatbot switches change only the process flag. Each stage has its own switches and dialogs | ◐ Simulated | Detail, defaults and what reads each setting are in F-5 |
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
From the automation editor Priya presses **Show in flow builder**. A drawer opens with a canvas. She zooms from 25 percent to 200 percent, picks a trigger, then picks steps from the palette and joins them with wires. The palette has five groups and sixteen nodes. A condition node has a **Case 1** and an **Else** branch. A parallel node has several. The canvas has no mini-map and no grid snapping. Only some of the sixteen nodes have code behind them in the rule engine. The rest can be placed and configured, and then do nothing when the rule fires.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Canvas with zoom | Canvas | Zoom 25 to 200 percent. Opens as a drawer, not as a page | ● Works | |
| F-4.2: Trigger list | Palette | Ten triggers: Process Created, Process Updated, Client Created, Client Updated, Appointment Created, Appointment Updated, Invoice Created, Invoice Updated, Call Created, Call Updated | ● Works | The earlier PRD named Triggers, Conditions, Actions and Delays |
| F-4.3: Wires and branch ports | Wire | Joins steps. Condition has Case 1 and Else. Parallel has several | ● Works | |
| F-4.4: Condition node | Node, Logic and Routing | Gates the steps after it behind field or intent conditions. When the conditions are false the later steps do not run | ● Works | Checked in the rule engine code |
| F-4.5: Wait / Delay node | Node, Logic and Routing | Delays the next step. A new node starts at 5 minutes | ◐ Simulated | No engine code and the delay value is ignored (G8-E-01). Decision needed: D-110 |
| F-4.6: Parallel Branches node | Node, Logic and Routing | Runs two automations side by side on the canvas | ◐ Simulated | Drawn as branches. The engine has no parallel handling (G8-E-01). Decision needed: D-110 |
| F-4.7: Update to stage node | Node, Logic and Routing | Updates the stage of a process, appointment or invoice | ● Works | The engine moves the record to the chosen stage |
| F-4.8: End Workflow node | Node, Logic and Routing | Described as "Terminate workflow execution" | ◐ Simulated | Can be placed. The engine has no code for it (G8-E-01). Decision needed: D-110 |
| F-4.9: Create Appointment node | Node, Create CRM Entities | Described as creating and scheduling a new appointment record | ◐ Simulated | Can be configured. The engine has no code for it (G8-E-01). Decision needed: D-110 |
| F-4.10: Create Client node | Node, Create CRM Entities | Described as creating a new contact or client record | ◐ Simulated | Can be configured. The engine has no code for it (G8-E-01). Decision needed: D-110 |
| F-4.11: Create Process node | Node, Create CRM Entities | Described as enrolling a record into a process | ◐ Simulated | Can be configured. The engine has no code for it (G8-E-01). Decision needed: D-110 |
| F-4.12: Generate Invoice node | Node, Records and Billing | Generates a draft invoice for an appointment. Described as strictly idempotent | ● Works | Checked in the rule engine code |
| F-4.13: Generate Document node | Node, Records and Billing | Generates a document from a template for a client, process, appointment or invoice | ● Works | Checked in the rule engine code |
| F-4.14: Send Email node | Node, Communication | Described as sending an email | ◐ Simulated | No engine code (G8-E-01). Decision needed: D-110 |
| F-4.15: Send SMS node | Node, Communication | Described as sending an SMS notification | ◐ Simulated | No engine code (G8-E-01). Decision needed: D-110 |
| F-4.16: Send WhatsApp node | Node, Communication | Described as sending a pre-configured WhatsApp message | ◐ Simulated | No engine code (G8-E-01). Decision needed: D-110 |
| F-4.17: Field Update node | Node, Data and Assignment | Updates a record or workflow field value | ● Works | Checked in the rule engine code |
| F-4.18: Assign Responsible node | Node, Data and Assignment | Assigns a team member to handle the record | ◐ Simulated | No engine code (G8-E-01). Decision needed: D-110 |
| F-4.19: Webhook node | Node, Data and Assignment | Described as sending a data payload through a webhook | ◐ Simulated | No engine code (G8-E-01). Decision needed: D-110 |
| F-4.20: Send Payment and Send Invoice steps | Engine | The engine calls the invoice send with a WhatsApp default | ◐ Simulated | Not offered in the palette. The invoice send only marks it sent (G7-E-15) |
| F-4.21: Schedule Appointment step | Engine | The engine has code that schedules an appointment | ◐ Simulated | Not offered in the palette. Reaching it from the canvas is unverified |
| F-4.22: Other node types in the code | Nodes | Call transfer to a human or AI, call hang-up, fetch availability, fetch field value, idle messages, book, reschedule and cancel appointment, move stage, move process, assign process, API | ○ Not built | Types exist in the code but the palette does not offer them |
| F-4.23: Step catalogue drawer | Drawer | A drawer of 11 step cards (Update to stage, End Workflow, Schedule Appointment, Generate Invoice, Generate Document, WhatsApp, SMS, Email, Field Update, Assign to a Human, Webhook Automation) in five categories | ○ Not built | The code exists but nothing opens it, so users never see these cards |
| F-4.24: Create Task step | Step | Offered in the earlier PRD | ○ Not built | No such step exists (G8-I-07) |
| F-4.25: Grid snapping and mini-map | Canvas | Described in the earlier PRD | ○ Not built | (G8-I-02) |
| F-4.26: Port-type validation on wires | Rule | Described in the earlier PRD | ○ Not built | Not found in code (G8-I-04) |
| F-4.27: "Patient Arrived" and "Patient Checked Out" triggers | Trigger | Named in the earlier PRD | ○ Not built | The nearest triggers are Appointment Updated and Client Updated. Rules built on check-in are deleted on load (G8-E-11) |
| F-4.28: Valid chains run in order on a trigger | Rule | Earlier PRD acceptance | ◐ Simulated | Only the steps marked Works above run |

#### 3. Worked example
Priya designs a post-visit chain.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She opens the builder | Zooms out and adds a **Condition**, then **Generate Invoice** | **The wires join and the invoice step runs when the condition is true** |
| 2 | She adds **Wait / Delay** and **Send SMS** after it | Saves | **Both can be configured. Neither runs** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Care Coordinator | When I set a follow-up protocol, I want a visual flow, so that I can design it without writing code. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** the canvas, **then** zoom runs from 25 to 200 percent and there is no mini-map or snapping. |
| F-4-2 | **Given** a condition step that is false, **then** the steps after it do not run. |
| F-4-3 | **Given** a Wait, SMS, WhatsApp, Email, Assign Responsible or Webhook step, **when** the rule fires, **then** nothing runs for that step. |
| F-4-4 | **Given** the palette, **then** it offers sixteen nodes in five groups: Logic and Routing, Create CRM Entities, Records and Billing, Communication, Data and Assignment. |

### F-5: Chatbot, Calling and Portal and Reception switches and settings

#### 1. What it does
Priya selects a process. On the process panel, under the stages ribbon, she sees three cards: **Enable Calling**, **Enable Chatbot** and **Client Portal & AI Receptionist**. Calling and Chatbot each have a gear and a switch. She presses the Chatbot gear and a drawer titled **Chatbot Channel Settings** slides in. It has three sections: **Chatbot Channels & Sources**, **Chatbot Intelligence & Settings** and **Settings Scope & Defaults**. She picks WhatsApp and SMS numbers, a model and the auto-create setting, then presses **Save Settings**. Each stage has the same three cards in its **General** tab, with its own switches, so one stage can differ from the process. The Portal card has a gear that opens **Stage Portal & Reception Settings**, where she writes the card the patient sees. The Portal and Reception setting is read by the patient portal and the kiosk receptionist. The Calling and Chatbot settings are saved but nothing reads them: no call is placed and no chatbot answers because of them.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Process card Enable Calling | Switch | Card **Enable Calling** with a phone icon, an info tip "Allow the AI agent to initiate or receive calls for leads in this workflow." and a gear. On by default. Toggling shows "Calling enabled for this process" or "Calling disabled for this process". Saved as a flag on the process only. The stages keep their own switch | ◐ Simulated | Nothing reads the flag. Only the process template copy carries it |
| F-5.2: Process Call Trigger gear | Button | Gear, hover title "Process Call Trigger Settings", opens the Call Trigger Settings drawer for the whole process. It opens even when the switch is off. See F-5.32 to F-5.34 | ◐ Simulated | |
| F-5.3: Process card Enable Chatbot | Switch | Card **Enable Chatbot** with a bot icon, an info tip "Configure omnichannel conversational AI across WhatsApp, SMS, and Website." and a gear. On by default (a process with no value counts as on). Toggling shows "Chatbot enabled for this process" or "Chatbot disabled for this process". Saved as a flag on the process only. Stage switches do not change | ◐ Simulated | No chat, channel or Companion code reads the flag. Decision needed: D-127 |
| F-5.4: Process Chatbot gear | Button | Gear, hover title "Process Chatbot Settings", opens the Chatbot Channel Settings drawer with no stage name. It shows the process settings, or the first stage's settings when the process has none. It opens even when the switch is off | ● Works | The drawer opens and saves. What it saves is read by nothing (F-5.31) |
| F-5.5: Process card Client Portal and AI Receptionist | Switch | Card **Client Portal & AI Receptionist** with an info tip about self-booking in the Client Portal and call triage in AI Receptionist. It reads as on when the process or any of its flags is on. Toggling sets the portal and receptionist flags on the process and on every stage, fills each stage card title with the stage name and the description with the stage description, and shows "Connected pipeline to Client Portal & AI Receptionist" or "Disconnected pipeline from Client Portal & AI Receptionist". There is no gear at process level | ● Works | The patient portal needs the portal flag on a process the client is in. The kiosk receptionist uses the receptionist flag |
| F-5.6: Where the stage cards show | Rule | In a stage's **General** tab the three cards sit below **When to move to this stage**. They are hidden when the Action is **Handle By Human** or **No Action** | ● Works | |
| F-5.7: Stage card Enable Calling | Switch | Same card with the info tip "...for leads in this stage." and a gear titled "Call Trigger Settings". On by default. Writes to the stage at once and again with **Save Changes**. No toast | ◐ Simulated | Nothing reads the flag |
| F-5.8: Stage card Enable Chatbot | Switch | Same card with a chat icon and the same info tip as the process card. On by default. Writes to the stage at once and again with **Save Changes**. No toast. The gear is titled "Chatbot Channel Settings" | ◐ Simulated | Nothing reads the flag. Decision needed: D-127 |
| F-5.9: Stage override and the process switch | Rule | The stage switch and the process switch are independent flags. Turning the process switch off leaves every stage switch as it was. Turning a stage switch off does not change the process. A stage with no saved value shows on | ◐ Simulated | No cascade and no inheritance exist. Decision needed: D-127 |
| F-5.10: Stage card Client Portal and AI Receptionist | Switch | Card with the info tip "Enable this stage in the Client Portal and AI Receptionist, with custom guidance, video, links, and media." Toggling sets the stage portal and receptionist flags and shows "Stage connected to Portal & AI Receptionist" or "Stage disconnected from Portal & AI Receptionist" | ● Works | Read by the patient portal stage card and the kiosk Next Step |
| F-5.11: Stage Portal gear | Button | Gear, hover title "Stage Portal & Reception Settings", opens the dialog in F-5.35 to F-5.37 | ● Works | |
| F-5.12: Chatbot drawer shell | Drawer | Title **Chatbot Channel Settings**. Subtitle "Configure channels and AI chatbot settings for "<stage>"" at stage level and "Configure channels and AI chatbot settings" at process level. Footer: **Reset Defaults**, **Cancel**, **Save Settings** | ● Works | |
| F-5.13: Section Chatbot Channels and Sources | Section | Collapsible, open by default, info tip "Enable or disable communication channels for the conversational AI bot." Holds the WhatsApp, SMS and Website cards | ● Works | |
| F-5.14: WhatsApp Channel switch | Switch | Label **WhatsApp Channel**, tip "Enable AI conversational bot over WhatsApp." On by default. Off hides the numbers picker | ◐ Simulated | Saved as the WhatsApp enable setting. Nothing reads it (F-5.31) |
| F-5.15: WhatsApp Channel Phone Numbers | Multi-select | Label **Channel Phone Numbers**, tip "Select multiple WhatsApp numbers for this workflow, or add new numbers inside the dropdown." Placeholder "Select WhatsApp phone numbers...". Chips carry the suffix "WhatsApp Business". Default one number, +1 (555) 123-4567. The first chosen number is also saved as the single number | ◐ Simulated | Saved on the stage or process. Nothing reads it (F-5.31, F-6.1) |
| F-5.16: SMS Channel switch | Switch | Label **SMS Channel**, tip "Enable text message conversational AI bot over SMS." On by default. Off hides the numbers picker | ◐ Simulated | Nothing reads it (F-5.31) |
| F-5.17: SMS Channel Phone Numbers | Multi-select | Label **Channel Phone Numbers**, tip "Select multiple SMS carrier numbers for this workflow, or add new numbers inside the dropdown." Placeholder "Select SMS phone numbers...". Chips carry the suffix "SMS Carrier". Default one number, +1 (555) 123-4567 | ◐ Simulated | The list is the same numbers as WhatsApp, not a list of SMS numbers. Nothing reads it (F-5.31) |
| F-5.18: Number picker | Control | Header "Available Numbers (n)" with **Select All** and **Clear**. Empty list reads "No phone numbers found. Add one below." Add box "Add Phone Number" with placeholder "+1 (555) 000-0000" and **Add**. A blank entry shows "Please enter a valid phone number". Anything else is accepted and shows "Number <number> added and selected". No format or duplicate check, and the selection can be empty | ◐ Simulated | A number added under WhatsApp is also written to the Integrations number list. A number added under SMS lives only in the open drawer |
| F-5.19: Where the number list comes from | Rule | The picker lists the stage inbound numbers (three sample numbers on this page) joined with the numbers stored by Settings > Integrations (two sample numbers when none are stored) | ◐ Simulated | Sample data, not live numbers |
| F-5.20: Website Chatbot switch | Switch | Label **Website Chatbot**, tip "Live chat widget embedded on your portal or website." On by default. Off hides the source field | ◐ Simulated | Nothing reads it (F-5.31) |
| F-5.21: Widget Link / Source URL | Text | Label **Widget Link / Source URL**, tip "Website URL or integration identifier where your live chatbot is embedded." Plain text, placeholder "Mantra AI Web Widget or https://example.com/widget". A drawer with nothing saved shows https://example.com/widget. Reset Defaults sets "Mantra AI Web Widget". No URL check | ◐ Simulated | Not connected to the Website chat widget settings |
| F-5.22: Section Chatbot Intelligence and Settings | Section | Collapsible, open by default, tip "Underlying LLM model and automated client creation settings." | ● Works | |
| F-5.23: AI Model | Select | Label **AI Model**, tip "Select the LLM model that powers conversational logic and chat responses." Options are the active models from the AI models store, each shown as "<name> (<provider>)". Default Gemini 2.5 Flash | ◐ Simulated | The value is saved. No chatbot runs on it |
| F-5.24: Auto-create Client | Switch | Label **Auto-create Client**, tip "Automatically create a new client contact record in your CRM when a visitor starts a conversation." On by default | ◐ Simulated | Saved only. No conversation creates a client from it. The Website chat widget and Web Forms have their own auto-create settings |
| F-5.25: Welcome message | Text | The saved settings carry a welcome message ("Hello! How can I assist you today?" by default) | ○ Not built | The drawer has no field for it, so it cannot be edited here. The Website chat widget has its own welcome message |
| F-5.26: Section Settings Scope and Defaults | Section | Collapsed by default. A badge shows "Global Default" or "Process Only" when one of the two boxes is ticked. Tip "Choose whether these chatbot settings apply across all stages." | ● Works | |
| F-5.27: Set as Default Chatbot Settings | Checkbox | Tip "Automatically applied to newly configured stages across all processes." Ticking it clears the other box. The badge reads "Global Default" | ○ Not built | Save has no branch for it, so no default is stored and new stages do not receive it. The call drawer has a working default (F-5.34) |
| F-5.28: Apply to All Stages in this Process | Checkbox | Tip "Apply these chatbot channel settings to all stages in this process only (<process>)." Disabled while the default box is ticked | ● Works | Save copies the settings to every stage of the process and shows "Applied chatbot settings to all stages in "<process>"" |
| F-5.29: Save Settings | Button | At process level it saves to the process and overwrites every stage's chatbot settings, showing "Saved chatbot settings for "<process>"". At stage level it saves to that stage only and shows "Chatbot settings saved for this stage". The drawer then closes | ● Works | A process-level save wipes stage differences |
| F-5.30: Reset Defaults and Cancel | Button | **Reset Defaults** puts the factory values in the form and shows "Reset to default chatbot settings". Nothing is saved until **Save Settings**. **Cancel** closes without saving | ● Works | |
| F-5.31: What reads the chatbot settings | Rule | Channel switches, numbers, source URL, model and auto-create setting are stored on the process and stage records only. No Chats, SMS, WhatsApp, website widget, Companion or rule code reads them | ○ Not built | Decision needed: D-127 |
| F-5.32: Call Trigger Settings drawer, calling and timing | Drawer | Title **Call Trigger Settings**. **Calling Numbers** (Integrated Numbers (Source), multi-select, default +1 (555) 123-4567). **Trigger Call** with **Trigger Immediately** (default) or **Wait / Delay Before Calling** (whole number 1 to 999, units Minutes, Hours, Days, Weeks, Months, default 15 Minutes). **Calling Hours** start and end (default 09:00 to 18:00), time zone of the lead or a custom zone (default America/New_York), skipped days (default Saturday and Sunday) and days off with a date or range | ◐ Simulated | No call is ever placed from these settings. Dates show "Please select a start date", "This date or range is already in the list" or "Date added to days off". Decision needed: D-61 |
| F-5.33: Call Trigger Settings drawer, call handling | Drawer | **Call Duration** (default 15 min) and **Hangup Window** (default 2 min, must be less than the duration, otherwise "Hangup window must be less than call duration (n min)"). **Record Calls** and **Detect Voicemail**, both on by default. **AI Model & Voice Settings**: AI Model, Voice Engine with a **Test** button that only shows "Playing preview for <voice>...", Speech Speed 0.5x to 1.5x, tone and style. **Call Retries Settings**: Enable Retry Rules (off), Retry Attempts (3), Delay Between Retries (5 min). **Transfer Call**: Enable Transfer Call (off), Transfer Numbers with country code, phone number and primary flag, **Add Number**, Voice Response (default "Please hold while I transfer your call") and Transfer Reason | ◐ Simulated | Test plays no audio. Nothing transfers or retries |
| F-5.34: Call Trigger Settings scope and save | Drawer | **Set Default** stores the settings as the default for every stage of every process and for stages added later, and shows "Saved as default settings for all stages across all processes". **Apply to All** copies to all stages of the process. At process level Save writes the process and every stage. At stage level it writes that stage. **Reset Defaults** shows "Reset to default settings" | ◐ Simulated | The default is kept in the browser storage and works. Nothing reads the calling settings at run time |
| F-5.35: Stage Portal and Reception Settings dialog, card | Drawer | Title **Stage Portal & Reception Settings** with the stage name as a badge. **Card Title** (marked required, default the stage name, placeholder "e.g. Clinic Check-In & Identity Verification") and **Card Description** (placeholder "e.g. Verified at Reception Desk / AI Kiosk") | ● Works | Both are shown on the patient portal stage card and the kiosk Next Step |
| F-5.36: Interactive Detail Content | Editor | **Interactive Detail Content** with **HTML** and **Preview** tabs and a **Select Fields** picker of 18 tokens in four groups (client, appointments, invoices, stage). Placeholder text shows a sample guide. Preview fills the tokens with a fixed sample patient, Priya Sharma. An empty preview reads "No HTML content configured yet..." | ● Works | The portal drawer and the kiosk fill the tokens from the real client |
| F-5.37: Save Stage Settings | Button | Writes title, description and HTML to the stage and shows "Settings saved for stage "<stage>"". An empty title becomes the stage name. Empty HTML is allowed even though the field is marked required. First save on a stage with no setting turns the portal and receptionist flags on | ● Works | |
| F-5.38: State, switches off | State | With a switch off, its gear still opens and saves. Nothing greys out or hides | ● Works | |
| F-5.39: State, nothing saved yet | State | A stage or process with no chatbot settings opens the drawer with the factory values: all three channels on, one number, auto-create on | ● Works | |
| F-5.40: State, no numbers connected | State | When there are no numbers to pick, the list reads "No phone numbers found. Add one below." The page always has sample numbers, so it rarely shows | ● Works | |

#### 3. Worked example
Priya sets up the Booked stage of the Appointments process.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She wants the chatbot on WhatsApp only | Opens the stage, presses the Chatbot gear, turns off **SMS Channel** and **Website Chatbot**, presses **Save Settings** | **"Chatbot settings saved for this stage" shows. Nothing changes in Chats** |
| 2 | She wants the same for the whole process | Opens the process, presses the Chatbot gear, ticks **Apply to All Stages in this Process** and saves | **Every stage gets the same settings and a toast confirms it** |
| 3 | She turns the process **Enable Chatbot** off | Looks at the stage cards | **Each stage switch is still on. The flags are independent** |
| 4 | She ticks **Set as Default Chatbot Settings** | Presses **Save Settings** | **The badge says Global Default, but no default is stored and new stages do not get it** |
| 5 | She writes the guidance a patient sees | Opens the stage Portal gear, types a title and HTML, saves | **The patient portal and the kiosk show the card** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | When I set up how a pipeline talks to patients, I want to choose channels, numbers and model for the chatbot in one drawer, so that each process can behave differently. |
| F-5-J2 | Care Coordinator | When a patient reaches a stage, I want to write the guidance the patient sees in the portal and at the kiosk, so that they know the next step. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** the process panel, **when** the Enable Chatbot switch is flipped, **then** a toast shows and only the process flag changes. No stage switch changes. |
| F-5-2 | **Given** the Chatbot drawer at process level, **when** Save Settings is pressed, **then** the process and every stage receive the same settings. |
| F-5-3 | **Given** the Chatbot drawer at stage level, **when** Save Settings is pressed, **then** only that stage is updated. |
| F-5-4 | **Given** Set as Default Chatbot Settings is ticked, **when** Save Settings is pressed, **then** no default is stored. |
| F-5-5 | **Given** saved chatbot or calling settings, **then** no chat, call or rule code uses them. |
| F-5-6 | **Given** the Chatbot drawer, **then** there is no welcome message field, AI prompt field or knowledge base field. |
| F-5-7 | **Given** the Action is Handle By Human or No Action, **then** the Calling, Chatbot and Portal cards are hidden on the stage. |
| F-5-8 | **Given** the Portal switch on the process, **when** it is flipped, **then** every stage is connected or disconnected with it. |

### F-6: WhatsApp number to workflow chatbot routing (intent, checked against the code)

#### 1. What it does
The practice owner documented an idea: connect each clinic WhatsApp number to one workflow, so that a message sent to that number is answered by that workflow's AI prompt and only the knowledge base attached to that workflow. A pediatrics number and a dermatology number would then never share answers. Priya can pick WhatsApp numbers on a workflow today, and the numbers are saved. After that the idea is not built. No inbound WhatsApp message is routed by those numbers, no bot answers on WhatsApp, the drawer has no AI prompt or knowledge base field, and a chat test drawer is the only place where a number resolves to a stage.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-6.1: Attach WhatsApp numbers to a workflow | Multi-select | Intent: bind one or more Meta WhatsApp Business numbers from Settings > Integrations to a workflow. As built, the Chatbot drawer picks one or more numbers (F-5.15) and saves them on the process or stage | ◐ Simulated | Nothing reads the saved numbers. Decision needed: D-61 |
| F-6.2: Numbers come from Integrations | Data | The picker joins the Integrations numbers (two samples when none are stored) with the sample stage numbers. A number added in the WhatsApp picker is also stored in Integrations | ● Works | |
| F-6.3: Number to stage registry | Service | When a stage whose Action is Client Reach Out To Us has a channel source number, the page records number, channel, process and stage in a browser store. A newer entry replaces an older one for the same number with no warning | ◐ Simulated | Written from the stage channel sources, not from the Chatbot drawer numbers. Read only by the Test Process chat (F-6.5) |
| F-6.4: One number belongs to one workflow | Rule | Intent: a number cannot be attached to two workflows | ○ Not built | No check. The registry lets the last save win. Decision needed: D-61 |
| F-6.5: Resolve an incoming number to a workflow and entry stage | Service | Intent: an inbound WhatsApp message to a configured number finds its workflow and first stage. As built, only the Test Process chat looks up a number in the registry, and its replies are simulated from the stage greeting | ◐ Simulated | No webhook or inbox code uses the registry (F-5.31) |
| F-6.6: Workflow AI prompt drives the chatbot | Configuration | Intent: the chatbot runs the prompt set on the workflow. As built, the stage AI prompt, greeting and objective are saved on the stage (F-2.5) but the Chatbot drawer has no prompt field and no WhatsApp bot reads the stage prompt | ○ Not built | Decision needed: D-127 |
| F-6.7: Knowledge base scoped to the workflow | Data | Intent: the chatbot retrieves only articles tagged with the workflow. As built, the Knowledge Base create drawer can scope an article to a process, but the Chatbot drawer has no knowledge field and nothing retrieves for a chatbot | ○ Not built | Decision needed: D-127 |
| F-6.8: Department isolation between numbers | Rule | Intent: a pediatrics number never uses dermatology answers | ○ Not built | Follows from F-6.4 to F-6.7 |
| F-6.9: Stage progression from the chat | Automation | Intent: answers in the chat move the patient along the pipeline. As built, the Test Process chat can move a test client to a stage | ◐ Simulated | Test chat only. No escalation or hand-over to staff exists |
| F-6.10: State, number not attached | State | A number nobody attached resolves to nothing in the Test Process chat, which then sends no reply | ● Works | |

#### 3. Worked example
Priya wants the pediatrics line to answer with the pediatrics prompt and documents.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She picks the number | Opens the Chatbot gear on the Pediatric Care process and selects +1 (555) 987-6543 | **The number is saved on the process** |
| 2 | She looks for the prompt and knowledge base | Scans the drawer | **There is no prompt or knowledge base field** |
| 3 | A parent writes to that number | Sends a WhatsApp message | **No bot answers and no workflow is chosen. Only the Test Process chat can simulate it** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-6-J1 | Practice Admin | When the clinic has several WhatsApp numbers, I want each number tied to its own workflow, so that each number uses its own AI prompt and knowledge base. |
| F-6-J2 | Practice Manager | When patient-facing chatbots answer clinical questions, I want answers limited to the knowledge attached to that workflow, so that guidance never crosses between specialties. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-6-1 | **Given** a WhatsApp number selected in the Chatbot drawer, **when** Save Settings is pressed, **then** the number is stored on the process or stage and nothing else happens. |
| F-6-2 | **Given** an inbound WhatsApp message, **then** no workflow is selected and no bot replies. |
| F-6-3 | **Given** two workflows with the same number, **then** no error shows. |
| F-6-4 | **Given** the Test Process chat, **when** a number is registered against a stage, **then** the chat resolves that stage and replies from a simulation. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Entities and processes | F-1.1 – F-1.14 | ● / ◐ / ○ | Add and list work; Temporary Disable, presets and Export do not; no delete or role control. |
| F-2 | Stage, AI behaviour and hand-off | F-2.1 – F-2.11 | ● / ◐ / ○ | Stage settings save; stage delete strands clients. |
| F-3 | Stage automations | F-3.1 – F-3.7 | ● / ◐ | Rules are saved and shared; delete has no confirmation. |
| F-4 | Flow canvas and steps | F-4.1 – F-4.28 | ● / ◐ / ○ | Canvas, triggers and five of sixteen nodes work; messaging, delay and create-record nodes do nothing. |
| F-5 | Chatbot, Calling and Portal and Reception settings | F-5.1 – F-5.40 | ● / ◐ / ○ | Portal and Reception settings are read by the portal and kiosk; Calling and Chatbot settings are saved but read by nothing. |
| F-6 | WhatsApp number to workflow chatbot routing | F-6.1 – F-6.10 | ● / ◐ / ○ | Numbers can be picked and saved; no routing, prompt or knowledge base scoping exists beyond a test chat. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | See every process and its stages by record type | F-1 |
| 2 | Care Coordinator | Define what the AI says and who handles a stage | F-2 |
| 3 | Practice Admin | Move records to a replacement when a stage is retired | F-2 |
| 4 | Care Coordinator | Have follow-up steps run by themselves | F-3 |
| 5 | Care Coordinator | Design a follow-up protocol visually | F-4 |
| 6 | Practice Admin | Choose channels, numbers and model for the chatbot in one drawer | F-5 |
| 7 | Care Coordinator | Write the guidance a patient sees in the portal and at the kiosk | F-5 |
| 8 | Practice Admin | Tie each WhatsApp number to its own workflow | F-6 |
| 9 | Practice Manager | Limit chatbot answers to the knowledge attached to the workflow | F-6 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/process`, edit stages, AI prompts, automations and the Calling, Chatbot and Portal and Reception settings, delete stages and rules | Nothing |
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
| D-61 | Which telephony model applies, are numbers admin-allocated, and how is a number assigned to a process (one number to one workflow or many)? | F-5.32, F-6.1, F-6.4 |
| D-110 | Which steps must really execute (delay, SMS, WhatsApp, Email, webhook, assign human, create records, Create Task), and should the rest be hidden or marked not live? | F-3.6, F-4.5, F-4.6, F-4.8 – F-4.11, F-4.14 – F-4.16, F-4.18, F-4.19 |
| D-127 | Which AI channels read Knowledge Base sources (kiosk voice, phone agent, chatbots), and what reads the chatbot settings, AI prompt and scope? | F-5.3, F-5.8, F-5.9, F-5.31, F-6.6, F-6.7 |
| D-113 | What should Temporary Disable do, and should check-in rules be allowed to exist? | F-1.8, F-3.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Added the Chatbot, Calling and Portal and Reception settings in detail, as built. |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
