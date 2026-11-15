---
title: "Automation: Event Rules Registry and Rule Builder"
product: "client"
module: "automation"
route: "/automation"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | AUTOMATION |
| Route | `/automation` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A registry of event rules: when this event happens, run these steps and, or, move the record to this stage. It has four headline counts, a filter bar, a rules table and a rule builder drawer. The builder has a trigger list of 10 events, a palette of 16 step nodes and a flow canvas. |
| **Who uses it** | Practice Admin (monitors and edits rules). Care Coordinator (creates rules, mostly through stage automations on Workflows). No role is checked: any signed-in user can add, pause and delete rules. |
| **Where you start it** | The URL `/automation` or a deep link. There is no sidebar item. Stage automations created on **Workflows** also appear here. |
| **Where the result goes** | Appointment, invoice and client stages, generated invoices and generated documents. Messages, delays, webhooks, new records and field changes on stored records go nowhere. |
| **How real is it** | 0 features work, 6 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Workflows) | Stage automations | A stage automation saved on Workflows is a rule in the same store and shows here. A rule added here with a stage trigger shows on that stage. This builder does not offer a stage trigger. | [View Workflows](/client/workflows) |
| Client (Appointments) | Events and stage moves | Appointment booked, rescheduled, cancelled, completed, no-show and checked-in events are emitted. The builder offers only Appointment created and updated, and neither is emitted. A rule with Appointment created and an Update to stage node places a new booking in that stage at booking time. | [View Appointments](/client/appointments/list) |
| Client (Invoices) | Events and generated invoices | Invoice created, sent, paid, partly paid, overdue and voided events are emitted. The builder offers Invoice created, which fires, and Invoice updated, which does not. Rules can generate an invoice or a document and move an invoice stage. | [View Invoices](/client/invoices) |
| Client (Clients) | Client events | Client checked-in, updated, field-updated and product-assigned events are emitted. The builder offers Client updated, which fires, and Client created, which never fires. | [View Clients](/client/clients) |
| AI Receptionist | Check-in events | The patient check-in screen emits check-in events. Rules built on them are deleted from storage when rules load (G8-E-11). | [View Scheduled Check-in](/ai-receptionist/checkin/scheduled) |

## 1. Module Summary

### The story in one minute

Rohan Mehta types `/automation` into the address bar. The page is titled "Automations" and shows four counts: Total automations, Active, Runs this week and Failed. He presses **New Rule**. A drawer opens with a list of five trigger groups on the left and an empty canvas. He picks **Invoice Triggers** and the event **Created**. Then he opens **Add Actions** and clicks **Generate Document**, then **Send SMS**. He picks a template for the document and types the text message. He presses **Save**. The rule appears in the table with an empty Last Run. When the next invoice is created, the document appears in the client's Documents and Last Run fills in. The text message is never sent, because nothing in the prototype runs a Send SMS node.

### What is real and what is not

- **Real in the prototype:** the rules table with search and filters, the Active and Paused switch, delete with a browser confirm, the rule builder with a zoomable canvas, five trigger groups, 16 step nodes that can be added, wired and configured, a Save check on the target stage, and an engine that runs three of those nodes: Update to stage, Generate Invoice and Generate Document.
- **Simulated:** the Runs this week count, the triggers that nothing emits (8 of the 10 offered), and 15 of the 16 nodes, which can be configured and saved but do nothing or do something other than what the screen says (only Update to stage runs fully). This includes Condition cases, Wait, Parallel, Field Update, all messages and the Webhook. Saved check-in rules are deleted when rules load.
- **Not built:** a sidebar entry, an execution log drawer, execution count and success rate columns, time-based reminders, SLA escalations, stage-move history with undo, saving a rule as a draft, run timing per node, Send Payment and Send Invoice nodes in the palette, and any role control.

### Journey position

```
Event (appointment, invoice, client) ─▶ Matching rule ─▶ Guards ─▶ Move stage ─▶ Run steps ─▶ Last Run and health
```

## 2. Feature Requests

### F-1: Rule registry

#### 1. What it does
Rohan opens `/automation`. Under the header "Automations" sit four capsules, a filter bar with **All Rules**, **Active**, **Paused** and **Failed**, a search box and **New Rule**. The table lists **Rule Name**, **Trigger Event**, **Status** and **Last Run**. A status pill switches a rule on or off at once. Row actions are View or Edit and Delete. Product rules made by a platform admin appear only when their scope matches the organisation.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Rules table | Table | Rule Name, Trigger Event, Status and Last Run. Row click opens the rule | ● Works | |
| F-1.2: Search and filters | Search, chips | Search by rule name, trigger label or description. Filters All Rules, Active, Paused, Failed | ● Works | |
| F-1.3: Headline capsules | KPI | Total automations, Active, Runs this week, Failed | ◐ Simulated | Runs this week counts rules, not runs. Counts include rules the table hides (G8-E-16, G8-E-17). Decision needed: D-99 |
| F-1.4: Active and Paused switch | Switch | Turns a rule on or off at once | ◐ Simulated | One click, no confirmation and no toast (G8-E-15) |
| F-1.5: Disabled rule is skipped | Rule | The engine skips a disabled rule on later events | ● Works | |
| F-1.6: Delete | Action | Browser confirm, then the toast "Rule deleted" | ● Works | |
| F-1.7: Empty state | State | "No automation rules found. Click 'New Rule' to create one." | ● Works | |
| F-1.8: Product rules by scope | Rule | Rules made by a platform admin show only when their scope matches the organisation | ● Works | Tenants can toggle or delete admin-made rules (G13-E-51) |
| F-1.9: Sidebar entry | Navigation | Reachable only by URL or deep link | ○ Not built | (G8-E-13). Decision needed: D-08 |
| F-1.10: Execution audit log drawer | Drawer | Past firings with success or failure and time | ○ Not built | Only a Last Run time exists (G8-I-31). Decision needed: D-99 |
| F-1.11: Action summary, execution count and success rate columns | Columns | Described in the earlier PRD | ○ Not built | No counter or data source exists. Decision needed: D-99 |
| F-1.12: Stage-move history with undo | Screen | The store supports it | ○ Not built | The screen is never mounted (G8-E-12) |
| F-1.13: Role control | Rule | Any signed-in user can add, pause and delete | ○ Not built | (G8-E-07). Decision needed: D-17 |

#### 3. Worked example
Rohan checks his rules.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants to see switched-off rules | Presses **Paused** | **Only paused rules are listed** |
| 2 | He turns one back on | Clicks its status pill | **It is live at once with no confirmation** |
| 3 | A rule is no longer wanted | Chooses Delete | **A browser confirm appears, then "Rule deleted"** |
| 4 | The table is empty | Opens the page | **"No automation rules found. Click 'New Rule' to create one."** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I rely on automated routines, I want one list of every rule with its state, so that I can check them in one place. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a rule is switched off, **when** its event occurs, **then** it does not run. |
| F-1-2 | **Given** the status pill is clicked, **then** the rule changes state at once with no confirmation. |
| F-1-3 | **Given** Runs this week, **then** it shows the number of rules that ran in the last seven days, not the number of runs. |
| F-1-4 | **Given** there is no execution log, **then** the only run information is the Last Run time. |

### F-2: Rule builder

#### 1. What it does
**New Rule** opens a full-height drawer with a left panel, a canvas and a **Save** button. The left panel first asks for a trigger (**Select Trigger**), then offers the step nodes (**Add Actions**). Rohan clicks a node to add it, wires it to the one before, clicks it to open its panel and fills in the fields. Nothing is saved until **Save**. Edit opens the same drawer with the saved nodes.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Rule drawer | Drawer | Opens from the right. Title is New Global Automation for a new rule. A pencil beside the title edits the name and a description (placeholder "Explain what this automation accomplishes..."). A rule never renamed is saved as New Global Automation. **How Flow Builder Works** opens a help modal | ● Works | |
| F-2.2: Select Trigger panel | Panel | A new rule starts here. Five cards: Process Triggers, Client Triggers, Appointment Triggers, Invoice Triggers, Call Triggers, each marked "Created or updated". A search box reads "Search trigger categories...". **Proceed to Add Actions** moves on without a choice | ● Works | The default trigger stays Client created if no card is chosen. See F-3.3 |
| F-2.3: Add Actions panel | Panel | Five groups with a search box "Search action steps...": Logic and Routing, Create CRM Entities, Records and Billing, Communication, Data and Assignment. Clicking a node adds it after the selected node, or into the selected branch, with the toast "Added <name> to flow." **Change Trigger** goes back | ● Works | 16 nodes. See F-4 to F-6. Editing a rule that already has nodes opens this panel directly |
| F-2.4: Trigger node | Node | A start node at the top shows the chosen trigger. Clicking it opens the trigger panel (F-3) | ● Works | |
| F-2.5: Canvas | Canvas | Zoom 25 to 200 percent with the buttons or the mouse wheel. **Fit to Screen**, **Tidy Up**, a hand tool (also the Space key) to pan, undo and redo (30 steps). Dotted background | ● Works | No mini-map and no grid snapping |
| F-2.6: Wires | Canvas | Drag from a node's bottom port to another node's top port, or click a port then the target. Toast "Connected steps in sequence." A wire back to an ancestor is refused with "Cannot create a circular connection." | ● Works | |
| F-2.7: Insert and cut a wire | Canvas | Each wire has a plus button that inserts a node between the two ends and a trash button "Delete connection (keeps nodes)" that removes only the wire. The following node becomes unconnected | ● Works | |
| F-2.8: Node panel | Drawer | Clicking a node opens a panel on the right with its name, description, a **Parameters** section and the buttons **Back** and **Save Changes**. Saving shows `Action "<name>" updated`. A Condition and a Wait node open their panel as soon as they are added, other nodes open on click | ● Works | Fields per node are in F-4 to F-6 |
| F-2.9: Condition cases and Else | Canvas | A Condition node shows one output per case plus an amber **Else**. The panel header is **Condition Cases** with **Add Case** and **Add Another Case**. Each case has a name, one or more rules and a **Match** switch between rules (AND or OR). Else cannot be deleted. A rule must have a field, operator and value | ● Works | The builder works. The engine ignores the cases. See F-4.1 |
| F-2.10: Parallel branches | Canvas | A Parallel node shows Branch 1 and Branch 2 with an **Add branch** button on the node and a **Delete branch** button on each branch. A Parallel node keeps at least 2 branches. Steps can be added into a branch | ● Works | The engine does not run branches in parallel. See F-4.3 |
| F-2.11: Delete a node | Action | A trash button on each node, tooltip "Delete node". No confirmation. The toast is "Step removed". A Parallel or Condition node takes its branches with it | ● Works | |
| F-2.12: Reorder nodes | Canvas | Order comes from the wires. A node can be dragged to a new place on the canvas, but the place is not saved | ○ Not built | No move up or down control exists |
| F-2.13: Save | Button | Saves the rule as Active, shows `Automation "<name>" saved as active` and closes the drawer. The new rule appears at the top of the table with an empty Last Run | ◐ Simulated | The Active or Draft choice cannot be made. See F-2.14 |
| F-2.14: Draft status | Rule | A panel with Status Active or Draft exists in the code, but no button opens it. Save always writes Active. Editing a paused rule and saving makes it Active | ○ Not built | New finding, no analysis id yet. Decision needed: D-113 |
| F-2.15: Save checks | Rule | The first Update to stage node becomes the rule's target. Its process must be of the same entity as the trigger (client, appointment or invoice), otherwise "Entity mismatch: <entity> rule cannot move records to <entity> process." Also "Target process not found" and "Target stage not found" | ◐ Simulated | On a failed check an error toast shows, but the success toast "saved as active" also shows, the drawer closes and nothing is saved. New finding, no analysis id yet |
| F-2.16: Loop check on save | Rule | Refuses a rule that triggers on entering a stage and moves to the same stage | ◐ Simulated | It only reads triggers that end in "entered_stage". The builder never offers one, so it never blocks a rule built here (G8-E-10). Decision needed: D-113 |
| F-2.17: Empty canvas hint | State | With only the trigger node: "Click a node from the left panel to add it to the canvas". With nodes but no wires: "Drag from a node's bottom port to another node's top port to connect them" | ● Works | |
| F-2.18: Builder messages | State | Messages are toasts: `Trigger set to "<label>"`, `Trigger configured: "<label>"`, "Branch added", "Branch removed", "Connection deleted (nodes preserved)", "Flow tidied up! Parallel branches connected and running independently." | ● Works | |
| F-2.19: Branch rule errors | State | "Condition must have at least 1 Case plus the Else branch." "Each case must have at least 1 condition rule." "The Else fallback branch cannot be deleted." "A Parallel node must have at least 2 branches." | ● Works | |
| F-2.20: Save validation | Rule | Name, steps and node fields are not checked. A rule with only a trigger, or with empty nodes, saves | ○ Not built | Missing standard behaviour |
| F-2.21: Unsaved-changes warning | State | Esc, the close button or a click on the dark backdrop closes the drawer and drops the work with no warning | ○ Not built | Missing standard behaviour |
| F-2.22: Run timing per node | Control | Trigger group, Execution (Instant, Wait, In Parallel), Delay and Connect After exist in the code and are hidden in this builder | ○ Not built | The engine ignores them too. Decision needed: D-110 |
| F-2.23: Earlier 18-step catalogue | Panel | A catalogue of 18 names (with Send Payment and Send Invoice) and a popover to add from it are in the code, and nothing shows them | ○ Not built | The earlier PRD listed these 18. The screen offers the 16 in F-4 to F-6 (G8-E-01) |
| F-2.24: Time-based reminders and SLA escalations | Rule | "Send SMS 48 hours before a visit" and escalation alerts in the earlier PRD | ○ Not built | No scheduler, no SMS runner and no SLA concept exist (G8-I-33) |

#### 3. Worked example
Rohan adds an invoice rule.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Nothing exists yet | Presses **New Rule**, picks **Invoice Triggers** | **The trigger panel opens with Created and Updated** |
| 2 | He wants a document for each invoice | Saves the trigger, clicks **Generate Document** and **Send SMS**, wires them | **Two nodes appear under the trigger, connected** |
| 3 | He is happy | Presses **Save** | **"Automation ... saved as active" shows and the rule is listed with an empty Last Run** |
| 4 | He points an Update to stage node at a process of another entity | Presses **Save** | **An "Entity mismatch" error shows with a "saved as active" message, the drawer closes and nothing is saved** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When a routine task repeats, I want to turn it into a rule on an event, so that staff stop doing it by hand. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** an Update to stage node whose process belongs to another entity than the trigger, **when** the user saves, **then** an "Entity mismatch" error shows, the drawer closes and the rule is not saved. |
| F-2-2 | **Given** a rule is saved, **then** it is Active, whatever status it had before. |
| F-2-3 | **Given** a rule with only a trigger, **when** the user saves, **then** it saves. |
| F-2-4 | **Given** two nodes where the second is an ancestor of the first, **when** the user wires them, **then** "Cannot create a circular connection." shows and no wire is made. |
| F-2-5 | **Given** a Parallel node with 2 branches, **when** the user deletes one branch, **then** "A Parallel node must have at least 2 branches." shows. |

### F-3: Triggers and how rules run

#### 1. What it does
Rohan picks a trigger group and then Created or Updated. The builder offers 10 events in five groups. The engine listens to every app event. Only 2 of the 10 offered events are ever emitted by the app, and a third (Appointment created) is only read when an appointment is booked. A rule on any other event saves and never fires. For each enabled rule whose trigger matches, the engine checks the guards, moves the record if the rule says so, and runs the nodes. Last run and health are written after each run.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Process created | Trigger | Group Process Triggers. A **Choose Process** list appears above the Created and Updated cards. Described as "Fires when a new process workflow is enrolled or created" | ◐ Simulated | Nothing emits it, so the rule never fires (G8-E-09) |
| F-3.2: Process updated | Trigger | Same group. "Fires when a process workflow record or stage is updated" | ◐ Simulated | Nothing emits it (G8-E-09) |
| F-3.3: Client created | Trigger | Group Client Triggers. "Fires when a new client record is added to CRM". It is the default trigger of a new rule | ◐ Simulated | Nothing emits it, so a rule left on the default never fires (G8-E-09) |
| F-3.4: Client updated | Trigger | "Fires when existing client profile details or fields are modified" | ● Works | Emitted when a client profile is saved |
| F-3.5: Appointment created | Trigger | Group Appointment Triggers. "Fires when a new appointment booking is scheduled" | ◐ Simulated | The engine never receives it, because booking emits "booked". A booking-time check reads it, and its Update to stage node sets the stage of the new appointment (G8-E-09) |
| F-3.6: Appointment updated | Trigger | "Fires when appointment details or schedule are updated" | ◐ Simulated | Nothing emits it. Reschedule, cancel, complete and no-show emit their own events, which are not offered (G8-E-09) |
| F-3.7: Invoice created | Trigger | Group Invoice Triggers. "Fires when a new billing invoice is created or drafted" | ● Works | Emitted when an invoice is created |
| F-3.8: Invoice updated | Trigger | "Fires when an invoice record or status is modified" | ◐ Simulated | Nothing emits it. Sent, paid, partly paid, overdue and void emit their own events, which are not offered (G8-E-09) |
| F-3.9: Call created | Trigger | Group Call Triggers. "Fires when a new call session is initiated or logged" | ◐ Simulated | Nothing emits it (G8-E-09) |
| F-3.10: Call updated | Trigger | "Fires when call metadata, transcript, or status updates" | ◐ Simulated | Nothing emits it (G8-E-09) |
| F-3.11: Stage entry and exit | Trigger | The earlier PRD listed them here. This builder does not offer them. A rule made on Workflows with a stage trigger shows in the table and is matched when a record enters or leaves that stage | ○ Not built | Not selectable on this page |
| F-3.12: Field updated | Trigger | Not offered. The engine would match a field-updated event, which a client profile save emits | ○ Not built | Not selectable on this page |
| F-3.13: Events emitted but not offered | Trigger | Appointment booked, rescheduled, cancelled, completed, no-show, checked-in. Client checked-in, field-updated, product-assigned. Invoice sent, paid, partly paid, overdue, voided | ○ Not built | The app emits them and no card selects them. Decision needed: D-110 |
| F-3.14: Check-in rules | Rule | A rule triggered by a client or appointment check-in can exist | ◐ Simulated | It is silently deleted the next time rules load (G8-E-11). Decision needed: D-113 |
| F-3.15: Trigger conditions and fields to watch | Rule | The engine can test conditions on the trigger data and a list of watched fields. The panel offers neither | ○ Not built | Code exists and no screen reaches it |
| F-3.16: Which events a rule reacts to | Engine | Enabled rules only. The event name must match, and the rule's entity must match the record type | ● Works | |
| F-3.17: Run order of nodes | Engine | The engine takes every node of the rule in tree order, including the nodes inside branches, and runs them one after another. It ignores the wires, the Case and Else choice, parallel timing and every delay | ◐ Simulated | New finding, no analysis id yet. Decision needed: D-110 |
| F-3.18: Move on the rule | Engine | The first Update to stage node also sets the rule's own target. The engine moves the appointment, invoice or client to it and then fires entry rules, up to depth 10 | ● Works | |
| F-3.19: Once per event, loop guard, chain depth | Rule | Same event, record and rule runs once. A rule cannot re-fire in one chain. Chains stop at depth 10 | ◐ Simulated | The once-per-event list is memory only (G8-E-10). Decision needed: D-113 |
| F-3.20: Last run and health | Rule | Written after each run. A rule that fails validation is flagged failed | ● Works | |

#### 3. Worked example
Rohan relies on automatic documents and messages.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A rule has the trigger Invoice created and a Generate Document node | Creates an invoice | **A document is saved to the client's Documents and Last Run fills in** |
| 2 | Another rule has the trigger Call updated and a Send SMS node | Ends a call | **Nothing happens. No event is emitted for a call** |
| 3 | A rule has the trigger Client created | Adds a new client | **Nothing happens. No event is emitted for it** |
| 4 | He builds a check-in rule | Reloads the app | **The rule is gone from storage** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When I choose the event for a rule, I want to know the event really fires, so that the rule runs when I expect it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an enabled rule on Client updated or Invoice created, **when** that event occurs, **then** its nodes run and Last Run is written. |
| F-3-2 | **Given** a rule on any of the other eight offered events, **then** it saves and never fires. |
| F-3-3 | **Given** a saved check-in rule, **when** rules load, **then** it is deleted from storage. |
| F-3-4 | **Given** a chain of rules, **then** it stops at depth 10. |
| F-3-5 | **Given** a rule with a Condition node, **when** it runs, **then** the nodes under every Case and Else run in order. |

### F-4: Workflow logic nodes

#### 1. What it does
Five nodes shape the flow. Rohan finds them under **Logic and Routing**. Each node can be added after the selected node and wired. Each opens a panel when clicked. Of the five, only **Update to stage** does its job when the rule runs. The earlier PRD called the logic nodes working. They are not.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Condition | Step | Palette label **Condition**, "Gate this step behind field or intent conditions". Group Logic and Routing. Allowed run groups in the code: stage, in-call, in-chat, post-call. You configure **Condition Cases**: a case name, rules (field, operator, value or another CRM field, **Match** AND or OR), **Add Case**, and an automatic **Else**. A field can be a caller intent, call, client, appointment or invoice field. Engine: reads an older rule list that the builder never writes, so it never stops the flow | ◐ Simulated | New finding, no analysis id yet. Decision needed: D-110 |
| F-4.2: Wait / Delay | Step | Palette label **Wait / Delay**, "Delay this step before it runs". Group Logic and Routing. Allowed run groups: stage, in-call, in-chat, post-call. You configure **Wait Duration**: a number (default 5) and a unit (Seconds, Minutes, Hours, Days). Engine: no runner, so the delay is ignored and the next nodes run at once | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-4.3: Parallel Branches | Step | Palette label **Parallel Branches**, "Run two automations simultaneously in parallel". Group Logic and Routing. Allowed run groups: stage, in-call, in-chat, post-call. You add and delete branches on the node. The panel also shows **Number of Branches** (2 to 6). Engine: no parallel runner, so the nodes in all branches run one after another | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-4.4: Update to stage | Step | Palette label **Update to stage**, "Update stage for process, appointment, or invoice". Group Logic and Routing. Allowed run groups: stage, in-chat, post-call. You configure **Choose Entity** (Processes, Appointment, Invoice), **Choose Process** and **Choose Stage**. Engine: moves the appointment, invoice or client to that stage and records the move | ● Works | The first such node is also the rule's target for the Save check (F-2.15) |
| F-4.5: End Workflow | Step | Palette label **End Workflow**, "Terminate workflow execution". Group Logic and Routing. Allowed run groups: stage, in-chat, post-call. It has no fields. The panel says "Terminates the workflow immediately." Engine: no handler, so the nodes after it still run | ◐ Simulated | New finding, no analysis id yet. Decision needed: D-110 |

#### 3. Worked example
Rohan builds a no-show follow-up.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants to separate paid from unpaid | Adds **Condition** with Case 1 on a payment field | **The node shows Case 1 and Else outputs. When the rule runs, steps under both are run** |
| 2 | He wants a 2 hour pause | Adds **Wait / Delay** and sets 2 Hours | **The value saves. The pause never happens** |
| 3 | He wants the appointment moved | Adds **Update to stage** and picks an appointment stage | **The appointment moves when the rule runs** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Admin | When a rule must act differently by case or after a delay, I want logic nodes that really branch and wait, so that one rule handles each situation correctly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a Condition node, **when** the rule runs, **then** its Case rules are not evaluated and every node under Case and Else runs. |
| F-4-2 | **Given** a Wait / Delay node, **when** the rule runs, **then** there is no pause. |
| F-4-3 | **Given** an Update to stage node and a matching event, **when** the rule runs, **then** the record is moved to the chosen stage. |
| F-4-4 | **Given** an End Workflow node followed by other nodes, **when** the rule runs, **then** the later nodes still run. |

### F-5: Record nodes

#### 1. What it does
Five nodes create or produce records: three under **Create CRM Entities** and two under **Records and Billing**. Rohan configures them in the same node panel. Only Generate Invoice and Generate Document do anything when the rule runs. The three Create nodes keep their settings and create nothing.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Create Appointment | Step | Palette label **Create Appointment**, "Create and schedule a new appointment record in CRM". Group Create CRM Entities. Allowed run groups: the default of all four, as it is not in the table. You configure **Service / Appointment Type**, **Appointment Title**, **Appointment Schedule (Date & Time)** with Time Amount, Time Unit (Hours, Days, Business Days, Weeks), Timing (After or Before) and **Relative To (Reference Event)**, **Location / Method** (In-Person Clinic, Telehealth / Video Call, Phone Call) and **Assigned Provider / Staff**. Engine: no runner for this node | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-5.2: Create Client | Step | Palette label **Create Client**, "Create a new contact or client record in CRM". Group Create CRM Entities. Allowed run groups: all four by default. You configure **Client / Contact Name**, **Phone Number**, **Email Address**, **Contact Type** (Lead, Prospect, Client, Patient, Customer, VIP), **Lead Source** (Website Form, Inbound Call, Referral, Ad Campaign, Social Media, Other), **Company / Organization** and **Responsible Person**. Engine: no runner | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-5.3: Create Process | Step | Palette label **Create Process**, "Create and enroll a record into a process workflow". Group Create CRM Entities. Allowed run groups: all four by default. You configure **Choose Process**, **Choose Stage** and a list of the process fields, required ones first, each with a value or a **Select Field** token. Engine: no runner | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-5.4: Generate Invoice | Step | Palette label **Generate Invoice**, "Generate draft invoice for appointment (strictly idempotent)". Group Records and Billing. Allowed run groups: stage, post-call. You configure **Bill for** (Appointment's service, Client's services, Choose services), Quantity, Discount in percent or dollars, a service list with **Add another service**, **Due in** days (default 14) and **Payment mode** (Bank Transfer, Card, Cash, Insurance-EMI). Engine: creates an invoice when the event is an appointment or client event, and does nothing for other events | ◐ Simulated | The service list is a built-in sample list, not the Services catalogue. Chosen lines are used, otherwise placeholder lines. No check was found that stops a second invoice for the same appointment. Decision needed: D-110 |
| F-5.5: Generate Document | Step | Palette label **Generate Document**, "Generate document from template for client, process, appointment, or invoice". Group Records and Billing. Allowed run groups: stage, post-call. You configure **Select Entity** (Client, Process, Appointment, Invoice, each with a template count), **Select Template**, **Document Title / File Name** and **Output Format** (PDF or Word). Engine: saves a document to the client's Documents with the template text filled in | ◐ Simulated | The saved file is always a PDF record of a fixed size, so the Word choice has no effect. If no template matches the scope, the panel offers **Manage Document Templates**. Decision needed: D-110 |
| F-5.6: Schedule Appointment | Step | Book, reschedule and cancel appointment node types exist in the code. The engine can create an appointment for them. No palette entry adds them | ○ Not built | Create Appointment uses a different key, so the engine runner never sees it (G8-E-01) |

#### 3. Worked example
Rohan automates paperwork.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A rule on Client updated has Generate Document with a client template | Saves a client profile | **A PDF record is added to the client's Documents** |
| 2 | A rule on Invoice created has Generate Invoice | Creates an invoice | **Nothing is generated, because the event is not an appointment or client event** |
| 3 | A rule has Create Client | Triggers the rule | **No client is created** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Billing Specialist | When an appointment is booked, I want an invoice created for me, so that I do not key it by hand. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** a Generate Document node and any matching event, **when** the rule runs, **then** a PDF-named document record is saved for the client. |
| F-5-2 | **Given** a Generate Invoice node and an appointment or client event, **when** the rule runs, **then** one invoice is created. |
| F-5-3 | **Given** a Create Appointment, Create Client or Create Process node, **when** the rule runs, **then** nothing is created. |

### F-6: Message, data and webhook nodes

#### 1. What it does
Six nodes send messages, change data, assign people or call a webhook. Rohan finds them under **Communication** and **Data and Assignment**. Every one of them can be filled in and saved. None of them does anything when the rule runs. The panel looks complete, so a rule built on them looks live.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-6.1: Send Email | Step | Palette label **Send Email**, "Send an email". Group Communication. Allowed run groups: stage, in-call, in-chat, post-call. You configure **Connected Account** (one preset address), **Template Mode** (Rich Editor or HTML Source with Code and Preview), **Subject** and **Email Body** with a variable picker. Engine: no runner, nothing is sent | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-6.2: Send SMS | Step | Palette label **Send SMS**, "Send an SMS notification". Group Communication. Allowed run groups: stage, in-call, in-chat, post-call. You configure **Message** with a variable picker and **Website Chat Notification Message**. There is no template picker. Engine: no runner | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-6.3: Send WhatsApp | Step | Palette label **Send WhatsApp**, "Send a pre-configured WhatsApp message". Group Communication. Allowed run groups: stage, in-call, in-chat, post-call. You configure **Select Source** (Template or Campaign), then **Template** or **Campaign** from the Chats lists, and **Website Chat Notification Message**. With none, the panel links to Manage Templates or Manage Campaigns. Engine: no runner | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-6.4: Field Update | Step | Palette label **Field Update**, "Update a record or workflow field value". Group Data and Assignment. Allowed run groups: stage, in-chat, post-call. You configure **Choose Entity** (Processes, Appointment, Invoice), **Choose Workflow**, **Choose Stage**, then one or more blocks with **Primary Field**, **Operator** (Equal To, Clear Value, Append Value, Increment, Decrement) and **Value**, with **Add Another Field Update**. Engine: puts the value in the event's data and adds an activity note on the client | ◐ Simulated | The stored record does not change and the operator is ignored. New finding, no analysis id yet. Decision needed: D-110 |
| F-6.5: Assign Responsible | Step | Palette label **Assign Responsible**, "Assign a team member to handle this record". Group Data and Assignment. Allowed run groups: stage, in-chat, post-call. You configure **Assignment Filter**: All Users (**Distribution Priority** Round Robin or Random), By Role (**Select Target Role**, **Role Distribution Priority**) or By Entity (**Entity Responsible Source**, **Fallback Team Member (if entity has no owner)**). Engine: no runner | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-6.6: Webhook | Step | Palette label **Webhook**, "Send data payload via webhook". Group Data and Assignment. Allowed run groups: stage, in-chat, post-call. You configure **Name**, **Target URL** and **Parameters** as key and value pairs, with a **URL Preview** of the address with the parameters added. Engine: no runner, no call is made | ◐ Simulated | (G8-E-01). Decision needed: D-110 |
| F-6.7: Send Payment and Send Invoice | Step | Not in the palette. The engine marks an invoice sent through a channel when a rule has one of these nodes and the event has an invoice. Panels with a channel choice exist in the code | ○ Not built | Not reachable. The send only changes the invoice status (G7-E-15) |
| F-6.8: Other step forms in the code | Step | Assign Process, CRM Update, EHR Update, API call, Collect Information and call-time steps (greeting, transfer, hang up, fetch availability, fetch field value, idle messages, silence hang-up, call analysis) have panels and are not in the palette | ○ Not built | Not reachable here. Decision needed: D-110 |

#### 3. Worked example
Rohan adds follow-up messages.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants a reminder text | Adds **Send SMS** and types a message | **The node saves with the text. No text is ever sent** |
| 2 | He wants the client's status set | Adds **Field Update** and chooses a field and a value | **An activity note appears on the client. The field itself does not change** |
| 3 | He wants another system told | Adds **Webhook** with a Target URL | **The node saves. No request is made** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-6-J1 | Care Coordinator | When a client needs a reminder or an update after an event, I want a message step in the rule, so that follow-up goes out without me. |
| F-6-J2 | Practice Admin | When a record needs an owner or another system must know, I want assignment and webhook steps, so that nothing waits on a manual hand-off. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-6-1 | **Given** a Send Email, Send SMS or Send WhatsApp node, **when** the rule runs, **then** no message is sent. |
| F-6-2 | **Given** an Assign Responsible or Webhook node, **when** the rule runs, **then** nobody is assigned and no request is made. |
| F-6-3 | **Given** a Field Update node, **when** the rule runs, **then** an activity note is added and the stored field keeps its old value. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Rule registry | F-1.1 – F-1.13 | ● / ◐ / ○ | Table and switch work; no log, counts or sidebar entry. |
| F-2 | Rule builder | F-2.1 – F-2.24 | ● / ◐ / ○ | Canvas, wires and panels work; no draft, no validation, odd save errors. |
| F-3 | Triggers and how rules run | F-3.1 – F-3.20 | ● / ◐ / ○ | 10 triggers offered, 2 fire; the engine ignores wires and cases. |
| F-4 | Workflow logic nodes | F-4.1 – F-4.5 | ● / ◐ | Only Update to stage runs; Condition, Wait, Parallel and End do not act. |
| F-5 | Record nodes | F-5.1 – F-5.6 | ◐ / ○ | Generate Invoice and Generate Document run; Create nodes do nothing. |
| F-6 | Message, data and webhook nodes | F-6.1 – F-6.8 | ◐ / ○ | Six nodes save and do nothing; Send Payment and Send Invoice are hidden. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Check every rule and its state in one place | F-1 |
| 2 | Practice Admin | Turn a repeated task into a rule on an event | F-2 |
| 3 | Practice Admin | Pick an event that really fires | F-3 |
| 4 | Practice Admin | Branch and wait inside a rule | F-4 |
| 5 | Billing Specialist | Have an invoice created when an appointment is booked | F-5 |
| 6 | Care Coordinator | Send a reminder or update after an event | F-6 |
| 7 | Practice Admin | Assign owners and notify other systems from a rule | F-6 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/automation`, add, edit, pause and delete rules, including admin-made rules | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names the Practice Administrator as the user and says nothing about access. Decision needed: D-17.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Total automations | Capsule | Count of all stored rules. Sub-label is the paused count or "all active" |
| Active | Capsule | Count of rules with the enabled flag. The sub-label repeats the number |
| Runs this week | Capsule | Count of rules whose last-run time is in the past 7 days. Not a count of runs (G8-E-17). Decision needed: D-99 |
| Failed | Capsule | Count of rules whose health is failed |

The capsules count every stored rule, but the table hides product rules outside the organisation's scope, so counts and rows can differ (G8-E-16). The execution count and success rate in the earlier PRD have no data source.

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys. It reacts to appointment, client and invoice events and does not move a web form submission anywhere, because a form submit emits no event.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-08 | Should workflows and automation be merged, and should Automation be a sidebar item with a canvas page? | F-1.9 |
| D-17 | Which roles may edit workflows, automations and forms? | F-1.13 |
| D-99 | What do Runs this week, execution count, success rate and an audit log mean? | F-1.3, F-1.10, F-1.11 |
| D-110 | Which steps must really execute, and until then should the rest be hidden or marked not live? | F-2.22, F-3.13, F-3.17, F-4.1 – F-4.3, F-4.5, F-5.1 – F-5.5, F-6.1 – F-6.6, F-6.8 |
| D-113 | Must once-per-event be persistent, must longer cycles be blocked at save, should check-in rules be allowed, and what should a draft rule do? | F-2.14, F-2.16, F-3.14, F-3.19 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Added every node and trigger of the rule builder in detail, as built. |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
