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
| **What it is** | A registry of event rules: when this event happens, run these steps and, or, move the record to this stage. It has four headline counts, a filter bar, a rules table and a rule builder drawer with a flow canvas. |
| **Who uses it** | Practice Admin (monitors and edits rules). Care Coordinator (creates rules, mostly through stage automations on Workflows). No role is checked: any signed-in user can add, pause and delete rules. |
| **Where you start it** | The URL `/automation` or a deep link. There is no sidebar item. Stage automations created on **Workflows** also appear here. |
| **Where the result goes** | Appointment stages, invoice stages, client fields, generated invoices and documents, and scheduled appointments. Messages, delays and webhooks go nowhere. |
| **How real is it** | 0 features work, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Workflows) | Stage automations | A stage automation saved on Workflows is a rule in the same store and shows here. A rule added here with a stage trigger shows on that stage. | [View Workflows](/client/workflows) |
| Client (Appointments) | Events and stage moves | Appointment booked, rescheduled, cancelled, completed, no-show and checked-in events are emitted. Rules can move the appointment stage or schedule an appointment. | [View Appointments](/client/appointments/list) |
| Client (Invoices) | Events and generated invoices | Invoice created, sent, paid, partly paid, overdue and voided events are emitted. Rules can generate an invoice, generate a document or send it. | [View Invoices](/client/invoices) |
| Client (Clients) | Client events | Client checked-in, updated, field-updated and product-assigned events are emitted. No event is emitted when a client is created. | [View Clients](/client/clients) |
| AI Receptionist | Check-in events | The patient check-in screen emits check-in events. Rules built on them are deleted from storage when rules load (G8-E-11). | [View Scheduled Check-in](/ai-receptionist/checkin/scheduled) |

## 1. Module Summary

### The story in one minute

Rohan Mehta types `/automation` into the address bar. The page is titled "Automations" and shows four counts: Total automations, Active, Runs this week and Failed. He filters to **Paused** and finds one rule he switched off last month. He presses **New Rule**. A drawer opens with a blank flow. He names the rule, picks an invoice **paid** trigger and adds a **Field Update** step. He saves. The rule appears in the table with a Last Run column that is still empty. When an invoice is paid the next day, the field changes and the Last Run time fills in. Rohan then adds an **SMS** reminder step to another rule. It saves without complaint, but no text is ever sent.

### What is real and what is not

- **Real in the prototype:** the rules table with search and filters, the Active and Paused switch, delete with a browser confirm, the rule builder drawer with a zoomable canvas, save checks on stage targets, the event engine, and six step types that run: condition, field update, stage move, generate invoice, generate document and schedule appointment.
- **Simulated:** the Runs this week and capsule counts, several triggers that nothing ever emits, Send Payment and Send Invoice, and the delay, SMS, WhatsApp, Email, Assign human, Webhook and create-record steps that can be saved but never run. Saved check-in rules are deleted when rules load.
- **Not built:** a sidebar entry, an execution log drawer, execution count and success rate columns, time-based reminders, SLA escalations, stage-move history with undo, and any role control.

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
| F-1.2: Search and filters | Search, chips | Search by rule name. Filters All Rules, Active, Paused, Failed | ● Works | |
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

### F-2: Build a rule

#### 1. What it does
**New Rule** opens a drawer with a blank flow. Rohan names the rule, adds a description, chooses a trigger and adds steps on a canvas that zooms from 25 to 200 percent. Nothing is saved until **Save**. Status active or draft becomes the enabled flag. Edit opens the same drawer with the saved steps.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Rule drawer | Drawer | Name, description, trigger and steps. Save writes the rule | ● Works | |
| F-2.2: Trigger choices | Select | Process, Client, Appointment, Invoice and Call (created or updated), plus stage entry or exit and field updated | ◐ Simulated | Several are never emitted, so a rule on them cannot fire (G8-E-09). Decision needed: D-110 |
| F-2.3: Steps offered | Catalogue | Create Appointment, Create Client, Create Process, Wait or Delay, Condition Gate, Parallel Branches, Update to stage, End Workflow, Generate Invoice, Generate Document, Send Payment, WhatsApp, SMS, Email, Send Invoice, Field Update, Assign to a Human, Webhook | ◐ Simulated | Only some steps run. See F-3 (G8-E-01) |
| F-2.4: Conditions | Rule | A condition step and trigger conditions with operators such as equals, contains, greater than and is empty | ● Works | |
| F-2.5: Save checks | Rule | The target stage must belong to the same entity as the trigger, otherwise "Entity mismatch". A rule triggered by entering a stage cannot move to that stage. Failures show as a toast | ● Works | |
| F-2.6: Canvas | Canvas | Zoom 25 to 200 percent | ● Works | No mini-map or grid snapping |
| F-2.7: Edit | Drawer | Row click or View or Edit opens the saved rule | ● Works | |
| F-2.8: Time-based reminders and SLA escalations | Rule | "Send SMS 48 hours before a visit" and escalation alerts in the earlier PRD | ○ Not built | No scheduler, no SMS runner and no SLA concept exist (G8-I-33) |

#### 3. Worked example
Rohan adds an invoice rule.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Nothing exists yet | Presses **New Rule**, picks an invoice **paid** trigger, adds **Field Update**, saves | **The rule is listed with an empty Last Run** |
| 2 | He points a stage move at a process of another entity | Presses save | **"Entity mismatch" shows and nothing is saved** |
| 3 | He picks a client **created** trigger | Saves | **It saves. No event is ever emitted for it, so it never fires** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When a routine task repeats, I want to turn it into a rule on an event, so that staff stop doing it by hand. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a stage move whose target belongs to another entity, **when** the user saves, **then** "Entity mismatch" shows and the rule is not saved. |
| F-2-2 | **Given** a rule triggered by entering stage X, **when** it targets stage X, **then** save is refused. |
| F-2-3 | **Given** a trigger that is never emitted, **when** the rule is saved, **then** it saves and never fires. |

### F-3: How rules run

#### 1. What it does
The engine listens to every app event. For each enabled rule whose trigger matches, it checks the loop guard, the duplicate-event guard, the target, the rule conditions and the trigger conditions. It then moves the record to the target stage if the rule says so, and runs the steps. A move can fire further rules, up to a depth of 10. Last run and health are written after each run.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Events emitted | Event | Appointment booked, rescheduled, cancelled, completed, no-show, checked-in. Client checked-in, updated, field-updated, product-assigned. Invoice created, sent, paid, partly paid, overdue, voided. Field updated. Stage entered and exited | ● Works | |
| F-3.2: Steps that run | Engine | Condition, Field Update, Update to stage, Generate Invoice, Generate Document, Schedule Appointment | ● Works | Re-checked in the rule engine code |
| F-3.3: Send Payment and Send Invoice | Engine | Calls the invoice send, WhatsApp by default | ◐ Simulated | It only marks the invoice sent (G7-E-15) |
| F-3.4: Wait or Delay, SMS, WhatsApp, Email, Assign to a Human, Webhook, Create Client, Create Appointment, Create Process, Parallel | Steps | Can be configured and saved | ◐ Simulated | No code runs them and delays are ignored (G8-E-01). Decision needed: D-110 |
| F-3.5: Once per event, loop guard, chain depth | Rule | Same event, record and rule runs once. A rule cannot re-fire in one chain. Chains stop at depth 10 | ◐ Simulated | The once-per-event list is memory only and the save check only catches a move to the triggering stage (G8-E-10). Decision needed: D-113 |
| F-3.6: Last run and health | Rule | Written after each run. A rule that fails validation is flagged failed | ● Works | |
| F-3.7: Saved check-in rules | Rule | A rule triggered by a client or appointment check-in can be saved | ◐ Simulated | It is silently deleted the next time rules load (G8-E-11). Decision needed: D-113 |

#### 3. Worked example
Rohan relies on an automatic SMS.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | An invoice rule has a Field Update step | Marks an invoice paid | **The field changes and Last Run fills in** |
| 2 | Another rule sends an SMS after a 2 hour delay | Marks an invoice paid | **The rule shows as run. No SMS is sent and the delay is ignored** |
| 3 | He builds a check-in rule | Reloads the app | **The rule is gone from storage** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When I switch a rule on, I want to know it really runs, so that I can verify automations work reliably. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an enabled rule whose trigger matches an emitted event, **then** its steps in F-3.2 run and Last Run is written. |
| F-3-2 | **Given** a Wait, SMS, WhatsApp, Email, Assign human, Webhook or create-record step, **then** nothing runs for it. |
| F-3-3 | **Given** a saved check-in rule, **when** rules load, **then** it is deleted from storage. |
| F-3-4 | **Given** a chain of rules, **then** it stops at depth 10. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Rule registry | F-1.1 – F-1.13 | ● / ◐ / ○ | Table and switch work; no log, counts or sidebar entry. |
| F-2 | Build a rule | F-2.1 – F-2.8 | ● / ◐ / ○ | Builder works; some triggers and steps are dead; no reminders. |
| F-3 | How rules run | F-3.1 – F-3.7 | ● / ◐ | Six steps run; messaging and delay do nothing; check-in rules deleted. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Check every rule and its state in one place | F-1 |
| 2 | Practice Admin | Turn a repeated task into a rule on an event | F-2 |
| 3 | Practice Admin | Know a switched-on rule really runs | F-3 |

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

This module is not a step in any of the four journeys. It reacts to appointment and invoice events and does not move a web form submission anywhere, because a form submit emits no event.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-08 | Should workflows and automation be merged, and should Automation be a sidebar item with a canvas page? | F-1.9 |
| D-17 | Which roles may edit workflows, automations and forms? | F-1.13 |
| D-99 | What do Runs this week, execution count, success rate and an audit log mean? | F-1.3, F-1.10, F-1.11 |
| D-110 | Which steps must really execute, and until then should the rest be hidden or marked not live? | F-2.2, F-3.4 |
| D-113 | Must once-per-event be persistent, must longer cycles be blocked at save, and should check-in rules be allowed to exist? | F-3.5, F-3.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
