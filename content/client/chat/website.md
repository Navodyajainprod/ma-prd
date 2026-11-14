---
title: "Chats: Website Channel"
product: "client"
module: "chat"
channel: "website"
route: "/chats?channel=website"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | CHATS: WEBSITE CHANNEL |
| Route | `/chats?channel=website` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The Website view of the Chats inbox plus a **Website Widget Settings** drawer with five sections (design, pre-chat form, first responder, responsible settings, embed code) and a visitor chat simulator. Only the simulator produces website conversations. |
| **Who uses it** | Care Coordinator (reads website threads). Practice Admin and Practice Manager (configure the widget). No role is checked. |
| **Where you start it** | **Chats** in the sidebar, then **Website** in the channel picker. The settings cog is in the top bar. The simulator opens from the small "(dev)" link in the page header and from a test form inside the settings drawer. |
| **Where the result goes** | A new or matched client in Clients, the client's Activity timeline, the Process call log, and the Website inbox. No hosted widget and no appointment is created. |
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
| Client (Clients) | Visitor becomes a contact | The simulator finds a client by phone, email or name alone. Otherwise it creates a contact in the chosen Contact Category, or "Lead" when Auto Create Contact is off. Contacts are stored in the browser session only. | [View Clients](/client/clients) |
| Client (Workflows) | Requirement to workflow and stage | Each requirement maps to a Process Entity, Workflow and Stage. The stage sets the reply. The visitor is not enrolled in the process. | [View Workflows](/client/workflows) |
| Client (Process) | Stage move from the test drawer | A stage move in the Test Website Chat drawer creates or updates a Process call-log row. It shows in the Process List only. | [View Process List](/client/processes/list) |
| Companion | Contact and appointment sync | Not connected. The earlier PRD promised appointment records. The widget creates no appointment and nothing reaches the patient portal. | [View Companion Messages](/companion/chat) |
| Client (Chats) | Shared inbox | Simulator messages appear in the Website channel. Assignment, reply and attach follow the inbox page. | [View Chats Inbox](/client/chat/chat) |

## 1. Module Summary

### The story in one minute

Priya Nair picks **Website** in the channel picker. One sample visitor thread is listed. The header shows Bot Active, but she cannot assign the thread and the composer has no gear. She presses the settings cog and the **Website Widget Settings** drawer opens. In **Pre-chat form** she adds a requirement "Book an Appointment" and maps it to Appointment, Appointment Flow and Booked. She turns on **Auto Create Contact** and picks Lead. The drawer saves every edit as she types. She runs a test visitor named Sarah Johnson. The reply uses the Booked stage prompt and a new thread appears in the Website inbox. Priya notices the simulator matched Sarah to her existing record by name alone.

### What is real and what is not

- **Real in the prototype:** the settings drawer and its saved values, the cascading Process Entity, Workflow and Stage pickers, the Contact Category dropdown, the drag-to-reorder priority list, the embed snippet, and the hidden **New Group** button.
- **Simulated:** every visitor conversation, the stage replies and buttons, and the contacts created. They run only in the simulator, with a contact id of the form `CL-SIM-<time>`. Working hours, distribution mode, priority order and transfer phrases are saved but never read by anything.
- **Not built:** live presence, page URL and visitor details, human takeover, resolve and archive, escalation to the Responsible queue, out-of-office replies, and a hosted widget.

### Journey position

```
Settings drawer ─▶ Requirement mapping ─▶ Test visitor ─┬▶ Contact (find or create)
                                                         ├▶ Stage prompt reply ─▶ Website inbox
                                                         └▶ Activity and Process call log
```

## 2. Feature Requests

### F-1: Website threads in the inbox

#### 1. What it does
Priya sees website visitor threads in the inbox. Only one sample visitor thread is stored. The header shows Bot Active, Assigned or a dead Unassigned button. The composer has no gear, so a website thread cannot be assigned or taken over.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Website thread list | List | Lists website threads with unread badge. Simulator runs add threads | ◐ Simulated | One sample thread is stored. No hosted widget feeds it |
| F-1.2: Header state | Button | Bot Active, Assigned or Unassigned | ◐ Simulated | Unassigned does nothing and a paused bot cannot be resumed (G4-E-05) |
| F-1.3: Composer | Composer | Text and a paperclip. The gear is removed | ● Works | Sending does not pause the bot |
| F-1.4: Live session card and presence | Card | Show the visitor online, the page URL and duration | ○ Not built | (G4-WEB-01) |
| F-1.5: Visitor details panel | Panel | IP location, referrer and form answers | ○ Not built | (G4-WEB-02) |
| F-1.6: Human takeover | Toggle | A human reply pauses the AI | ○ Not built | (G4-WEB-03) |
| F-1.7: Resolve and archive | Button | Close and archive a session | ○ Not built | The handler has no control (G4-E-06). Decision needed: D-140 |

#### 3. Worked example
Priya checks the website channel.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Website is chosen | Opens the visitor thread | **The stream and a composer without a gear are shown** |
| 2 | She wants to take over | Clicks the header | **Nothing happens and the bot keeps replying** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When visitors ask questions on our website, I want to see the page and the question as they chat, so that I understand their interest at once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a website thread, **then** the composer has a paperclip and Send but no gear. |
| F-1-2 | **Given** staff send a message, **then** the bot is not paused. |
| F-1-3 | **Given** the header reads Unassigned, **when** it is clicked, **then** nothing happens. |

### F-2: Visitor chat answered from the mapped workflow stage

#### 1. What it does
In the simulator a visitor chooses a requirement. The tool finds or creates a contact, loads the mapped workflow and stage, and replies with that stage's prompt. When the stage has an automation, its header and buttons are used instead. Both messages land in the Website inbox.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Stage prompt | Rule | Builds the prompt from the stage pitch, description or process description | ◐ Simulated | Simulator only |
| F-2.2: Stage reply and buttons | Reply | Replies with the stage automation output when one fires, else the prompt | ◐ Simulated | Simulator only |
| F-2.3: Workflow and stage label | Label | The Test Website Chat drawer labels each AI turn "Workflow Prompt: workflow · stage" | ◐ Simulated | |
| F-2.4: Stage moves | Hand-off | A stage move updates the Process call log and Activity | ◐ Simulated | Creates a row if none exists. Shows in the Process List only (G4-WEB-28) |
| F-2.5: Messages in the inbox | Hand-off | Both messages are pushed into the Website channel | ◐ Simulated | A placeholder phone is used when none is given (G4-E-23) |
| F-2.6: Escalation to the Responsible queue | Fallback | Hand to staff on request or an unknown question | ○ Not built | (G4-WEB-08). Decision needed: D-133 |
| F-2.7: Appointment from the chat | Hand-off | Create appointment records | ○ Not built | The widget creates no appointment |

#### 3. Worked example
Priya runs a test visitor.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Requirement "Book an Appointment" maps to Booked | Submits the test form as Sarah Johnson | **The reply uses the Booked stage prompt and is labelled with the workflow and stage** |
| 2 | The visitor asks to speak to reception | Types the request | **No escalation happens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I choose a requirement on the clinic site, I want an answer for that service, so that I do not get a generic reply. |
| F-2-J2 | Practice Admin | When visitors pick a requirement, I want the mapped stage prompt used, so that each topic follows its script. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a requirement mapped to an entity, workflow and stage, **when** a simulated visitor chats, **then** the reply uses that stage's prompt or automation output. |
| F-2-2 | **Given** a simulated visitor, **then** the contact is not enrolled in the process and no appointment is created. |
| F-2-3 | **Given** a request for a human, **then** no escalation happens. |

### F-3: Pre-chat form, requirement mapping and contacts

#### 1. What it does
In **Pre-chat form** Priya sets a greeting and ticks Name, Email, Phone and Requirement. Each requirement row has a label and three cascading pickers: **Process Entity** (Processes, Appointment, Invoice, Insurance & Claims, Task), **Workflow Name** and **Stage**. **Auto Create Contact** with a **Contact Category** decides whether a visitor becomes a contact.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Greeting and field checkboxes | Fields | Greeting text and Name, Email, Phone, Requirement ticks | ● Works | |
| F-3.2: Requirement mapping | Row builder | Label, Process Entity, Workflow Name, Stage | ● Works | |
| F-3.3: Cascade and resets | Rule | A new entity resets workflow and stage to the first options. A new workflow resets the stage | ● Works | |
| F-3.4: Save Configuration | Button | Checks every requirement is fully mapped and a category is chosen, then toasts | ◐ Simulated | Every edit already autosaved, so invalid mappings are stored and Cancel cannot undo anything (G4-E-20) |
| F-3.5: Auto Create Contact and Contact Category | Toggle, dropdown | Category list comes from the contact categories store | ● Works | |
| F-3.6: Contact when Auto Create is off | Rule | The simulator still creates a contact, category "Lead" | ◐ Simulated | (G4-E-21). Decision needed: D-22 |
| F-3.7: Match an existing client | Rule | Matches by phone, email or name alone | ◐ Simulated | Name alone links a stranger to a record (G4-E-22). Decision needed: D-22 |
| F-3.8: Placeholder phone | Rule | A placeholder number is saved when none is given | ◐ Simulated | (G4-E-23) |

#### 3. Worked example
Priya maps a requirement and tests it.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A new requirement row | Picks Invoice, then Billing & Invoicing | **The Stage list refreshes with that workflow's stages** |
| 2 | Auto Create is on with no category | Presses **Save Configuration** | **A message asks for a category. The earlier edits are already saved** |
| 3 | Test visitor "Sarah Johnson" with a different email | Submits | **The chat attaches to the existing Sarah Johnson record** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When visitors pick a requirement, I want to map it to an entity, workflow and stage, so that the reply matches the topic. |
| F-3-J2 | Front-desk Staff | When a visitor is made a contact, I want a category such as Lead, so that website inquiries land in the right segment. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a requirement row, **when** the entity changes, **then** workflow and stage reset to the first options. |
| F-3-2 | **Given** Auto Create Contact is on with no category, **when** Save Configuration is pressed, **then** saving is refused. Earlier edits stay saved. |
| F-3-3 | **Given** Auto Create Contact is off, **when** the simulator runs, **then** a contact is still created as Lead. |
| F-3-4 | **Given** a visitor name equal to an existing client, **then** the chat is linked to that client. |

### F-4: First responder and responsible settings

#### 1. What it does
**First Responder** is an AI Assistant or Human Agent choice. **Responsible Settings** has working hours with a branch picker, a member list, three distribution modes and an agent display option. Sequential mode shows a drag-to-reorder list labelled "Priority 1 (First Responder)" and "Fallback #n". All of it is saved and none of it is applied to any conversation.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: First Responder radio | Radio | AI Assistant or Human Agent | ◐ Simulated | Saved, never read. Decision needed: D-133 |
| F-4.2: Responsible members | Picker | Chosen from the organisation's team roster | ● Works | |
| F-4.3: Distribution mode | Dropdown | Simultaneous broadcast, Round-robin, Sequential priority | ◐ Simulated | Saved, never read |
| F-4.4: Priority list | Drag list | Drag to reorder, no arrows, order saved | ● Works | Order is never used for routing |
| F-4.5: Working hours | Toggle, branch | A branch picker with a read-only schedule synced from Org Data | ◐ Simulated | Never read. Decision needed: D-143 |
| F-4.6: Agent display | Option | User, custom or hide, with custom profiles | ◐ Simulated | Saved, never read |
| F-4.7: Out-of-office reply, routing and 30 second fall-through | Rule | Reply after hours and move down the list | ○ Not built | Stored, never read (G4-WEB-21). Decision needed: D-133 |
| F-4.8: Custom days, times and timezone | Settings | Editable hours | ○ Not built | Decision needed: D-143 |

#### 3. Worked example
Priya sets up the priority order.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sequential priority is chosen | Drags Dr. Anita Rao to the top | **She becomes Priority 1 (First Responder) and the order is saved** |
| 2 | A visitor chats | Sends a message | **No one is alerted. The order is not used** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Admin | When setting escalation order, I want to drag people into priority, so that the hierarchy is simple to manage. |
| F-4-J2 | Practice Manager | When visitors chat after closing, I want working hours applied, so that expectations are realistic. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** Sequential priority, **then** a numbered drag list is shown with no arrows and its order is saved. |
| F-4-2 | **Given** working hours are on and a visitor chats after hours, **then** no out-of-office reply is sent. |

### F-5: Design, embed code and top bar

#### 1. What it does
The first section sets theme colour and mode, bot name, a remove signature option and one of six positions. The last section shows a copyable script snippet. In the top bar there is the settings cog and no New Group. The **Test Widget Chat** button of the earlier PRD does not exist: the simulator opens from the "(dev)" link and the in-drawer test form.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Settings cog | Button | Opens **Website Widget Settings** | ● Works | |
| F-5.2: Design and position | Fields | Theme colour and mode, bot name, remove signature, six position presets | ● Works | |
| F-5.3: Embed code | Snippet | A copyable script | ◐ Simulated | No hosted widget is traced |
| F-5.4: Test Widget Chat | Button | Top bar button for the simulator | ○ Not built | Only a "(dev)" link and the in-drawer form. Decision needed: D-143 |
| F-5.5: Test Website Chat drawer | Drawer | Runs the visitor simulator | ◐ Simulated | See F-2 |
| F-5.6: New Group hidden | Rule | No New Group on Website | ● Works | |

#### 3. Worked example
Priya changes the look.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer is open | Changes the bot name and picks a bottom left position | **The values are saved as she edits** |
| 2 | She looks for Test Widget Chat | Checks the top bar | **Only the settings cog is there** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | When the widget goes on our site, I want to set its look and copy its code, so that it matches our brand. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** the Website channel, **then** the top bar has the settings cog and no New Group or Test Widget Chat button. |
| F-5-2 | **Given** the settings drawer, **then** it has five sections: design, pre-chat form, first responder, responsible settings and embed code. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Website threads | F-1.1 – F-1.7 | ◐ / ● / ○ | One sample thread; no presence, takeover or resolve. |
| F-2 | Answer from mapped stage | F-2.1 – F-2.7 | ◐ / ○ | Simulator only; no escalation or appointment. |
| F-3 | Pre-chat form and contacts | F-3.1 – F-3.8 | ● / ◐ | Mapping works; matching is by name alone. |
| F-4 | First responder and routing | F-4.1 – F-4.8 | ● / ◐ / ○ | Settings saved but never applied. |
| F-5 | Design, embed and top bar | F-5.1 – F-5.6 | ● / ◐ / ○ | Design saves; no Test Widget Chat button. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | See the visitor's page and question as they chat | F-1 |
| 2 | Patient | Get an answer for the service I chose | F-2 |
| 3 | Practice Admin | Have the mapped stage prompt used | F-2 |
| 4 | Practice Manager | Map a requirement to entity, workflow and stage | F-3 |
| 5 | Front-desk Staff | Put new website contacts in a category | F-3 |
| 6 | Practice Admin | Set escalation order by dragging | F-4 |
| 7 | Practice Manager | Apply working hours after closing | F-4 |
| 8 | Practice Admin | Set the widget look and copy its code | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Read website threads, open and change widget settings, run the simulator | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named triage staff, front desk and administrators and did not say who edits widget settings. Decision needed: D-18.

## 5. Metrics and definitions

The unread badge is the only figure here. It counts unread inbound messages on the thread and clears on open. No other metric is shown.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Web form → Client → Process → Task (and website chat widget → Client → Process) | Visitor sends the first message | Only the simulator exists. A client is matched by phone, email or name alone. A contact is created even when Auto Create is off, with a placeholder phone and a `CL-SIM-<time>` id. |
| | Requirement to workflow and stage | The mapped stage sets the reply and the activity label. The contact is not enrolled in the process. |
| | The bot moves the visitor to a new stage | The test drawer creates or updates a Process call-log row that shows in the Process List only. |
| | Widget conversation to an appointment | Not connected. No appointment is created. |
| | Visitor chat to inbox | Messages appear in the Website channel. |
| | Escalation and out-of-hours routing | Not connected. Settings are stored but never read. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-140 | Where does Resolve live and does status apply to every channel? | F-1.7 |
| D-133 | What is the runtime for first responder, transfer phrases, routing modes and out-of-office text? | F-2.6, F-4.1, F-4.7 |
| D-22 | What single rule matches a visitor to a client, and what happens when Auto Create Contact is off? | F-3.6, F-3.7 |
| D-143 | Are working hours branch-synced and read-only or custom, and where does Test Widget Chat live? | F-4.5, F-4.8, F-5.4 |
| D-18 | Which roles may edit Website settings? | Roles |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | Added Process Entity, Workflow Name and Stage mapping and Contact Category. |
| 2026-11-10 | First version. |
