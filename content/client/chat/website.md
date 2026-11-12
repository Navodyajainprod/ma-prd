---
title: "Website Live Chat Widget, Process-Driven AI Assistant & Drawer Settings"
product: "Client"
module: "chat"
channel: "website"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-12"
---

| Product | Client |
| Module | Chats & Care Groups - Website Channel (`/chats?channel=website`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Process-Aligned Clinical Automation | When website visitors submit inquiries through the web widget, the AI identifies the target workflow process (e.g., Intake, Booking, Billing) and automatically synchronizes the resulting contact and appointment records into the practice management and Companion systems. | [View in Companion](/companion/chat) |

## 1. Module Summary
- The Website Channel provides real-time triage for visitors and prospective patients engaging with the practice's embeddable website widget. It integrates a process-driven AI Assistant First Responder that dynamically identifies visitor intent and requirement selections, maps them to established practice processes (Booking, Billing, Intake, Check-in), and delivers automated resolution flows before handing off to human clinical agents.
- Website visitors, prospective patients, practice triage agents, and front-desk coordinators use this module.
- Accessed in the Client workspace via Chats & Care Groups > Website.

## 2. Feature Requests

### F-1: Inbound Web Widget Live Thread Aggregation & Visitor Session Presence
#### 1. What it does
Aggregates live chat sessions initiated by website visitors into an omnichannel inbox stream. Tracks visitor online presence, active page URL, geographic IP snippet, and session duration. Live updates alert staff when visitors enter or leave the site widget.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Live Session Card | UI Card | Renders visitor thread with browser indicator, current page URL, and duration | Real-time presence dot |
| F-1.2: Visitor Metadata Panel | UI Panel | Surfaces visitor IP location, referrer URL, and pre-chat form submissions | Located in right sidebar |
| F-1.3: Human Takeover Switch | Toggle | Allows human agent to pause AI Assistant and take manual control of conversation | Instant bot pause |
| F-1.4: Resolve & Archive Session | Button | Closes finished visitor session and archives chat transcript | Preserved in history |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor opens chat widget on `/services/orthopedics` | Visitor clicks launcher button on clinic site | **Thread appears in Website channel with live green dot and page label "Orthopedics"** |
| 2 | Visitor types question about consultation pricing | Types: "How much is an initial consultation?" | **Message renders in real time; AI First Responder evaluates intent** |
| 3 | Human coordinator intervenes | Coordinator clicks "Take Over Chat" | **Bot pauses; coordinator types direct reply to visitor** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Triage Coordinator | When website visitors ask questions on our clinic website, I want to see their active page and query in real time, so that I understand their clinical interest immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given an active visitor session on the practice website, when the visitor sends a message, then it renders in the Website channel within 500ms. |
| F-1-2 | Given a human agent sending a message, then the AI Assistant is automatically paused for that conversation session. |

### F-2: Process-Driven AI Assistant First Responder & Workflow Prompt Routing
#### 1. What it does
Provides an intelligent AI First Responder that evaluates inbound messages and pre-chat requirement selections against each requirement's mapped **Process Entity**, **Workflow Name**, and **Stage**. When a visitor chooses a requirement or discusses that topic in chat, the AI maps the conversation to that workflow stage's configured prompt and instructions (such as `Appointment Flow → Booked`, `Billing & Invoicing → Draft`, `Insurance and Claims → Draft & Intake`, or `Client Intake → Initial Contact`), formulates a stage-aligned response, and offers interactive shortcut actions or smooth handoff to human coordinators.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Requirement-to-Workflow Stage Prompt Resolver | Logic | Reads the Process Entity, Workflow Name, and Stage mapped to the visitor's chosen requirement and loads that stage's workflow prompt | Exact stage prompt resolution |
| F-2.2: Stage-Specific Response | Generator | Formulates a tailored response following the mapped workflow stage prompt and conversational context | Explains next steps clearly |
| F-2.3: Interactive Action Card | UI Component | Renders clickable shortcut buttons when configured on the mapped stage (e.g. booking links, billing guidance, or intake actions) | One-tap workflow launch |
| F-2.4: Escalation to Human Queue | Fallback | Escalates to Responsible Settings queue when the query cannot be resolved or the visitor requests a human agent | Notifies on-duty staff |

#### 3. Worked example
| # | Situation | What the visitor does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor selects "Book an Appointment" (mapped to `Appointment` → `Appointment Flow` → `Booked`) | Submits pre-chat form and asks for availability | **AI maps the conversation to `Appointment Flow · Booked`, loads that stage's prompt, and replies with scheduling guidance** |
| 2 | Visitor asks: "Can I pay my overdue bill here?" under "Billing & Invoices" (mapped to `Invoice` → `Billing & Invoicing` → `Draft`) | Sends billing question | **AI applies the `Billing & Invoicing · Draft` stage workflow prompt and responds with balance and payment guidance** |
| 3 | Visitor asks about policy coverage under "Insurance & Coverage Inquiry" (mapped to `Insurance & Claims` → `Insurance and Claims` → `Draft & Intake`) | Sends coverage question | **AI responds using the `Insurance and Claims · Draft & Intake` stage prompt** |
| 4 | Visitor types: "I need to speak with someone at reception" | Requests human help | **AI escalates the active thread to the assigned Responsible Settings team queue** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Website Visitor | When I choose a requirement and start chatting on the clinic website, I want instant, relevant answers aligned with that specific service workflow stage, so that I do not receive generic replies. |
| F-2-J2 | Practice Administrator | When visitors select a pre-chat requirement, I want the AI to automatically load the prompt from the mapped workflow stage, so that each inquiry type follows the right conversational script. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a visitor selects a requirement mapped to a Process Entity, Workflow Name, and Stage, then the AI First Responder loads that stage's workflow prompt for the conversation. |
| F-2-2 | Given a visitor tests the chat inside Website Widget Settings or the Website Bot Simulator, then the response header/context displays the active mapped Workflow Name and Stage. |
| F-2-3 | Given an unrecognized inquiry or explicit escalation trigger, then the AI hands the conversation over to on-duty team members. |

### F-3: Pre-Chat Intake Form, Requirement Workflow Mapping & Auto Create Contact (Contact Category)
#### 1. What it does
Gathers preliminary visitor details before starting a chat session. Includes a greeting message, toggleable visitor intake fields (`Full Name`, `Email Address`, `Phone Number`, `Requirement`), and **Requirement Options & Workflow Mapping**. For each requirement option visitors can pick, the administrator configures the **Requirement Option** label and maps it across three cascading dropdowns: **Process Entity** (`Processes`, `Appointment`, `Invoice`, `Insurance & Claims`, `Task`), **Workflow Name** (filtered by entity), and **Stage** (filtered by workflow), so the AI activates the exact stage workflow prompt when visitors discuss that requirement. Also includes an **Auto Create Contact** toggle: when enabled, administrators select the target **Contact Category** (`Lead`, `Client`, `Supplier`, `Vendor`, or custom contact categories) under which visitor records are automatically created, without enrolling the contact itself into a pipeline stage.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Greeting Message Input | Text Input | Configures customizable welcome text displayed on the pre-chat card | Multi-line greeting |
| F-3.2: Contact Field Checkboxes | Checkboxes | Toggles collection of Visitor Full Name, Email Address, Phone Number, and Requirement | Requirement toggles options list |
| F-3.3: Requirement Options & Workflow Mapping | Row Builder | For each requirement option, captures the Requirement label, **Process Entity**, **Workflow Name**, and **Stage** dropdowns | 3-step cascading mapping |
| F-3.4: Cascading Entity → Workflow → Stage Filtering | Selection Rule | Selecting a Process Entity updates Workflow Name choices; selecting a Workflow Name updates Stage choices | Defaults cleanly on switch |
| F-3.5: Auto Create Contact Toggle | Toggle | When ON, automatically creates a Contact record in Contacts upon visitor form submission | Preserves contact-only intake |
| F-3.6: Contact Category Selector Dropdown | Dropdown | Selects the Contact Category (`Lead`, `Client`, `Supplier`, `Vendor`, or custom categories) for auto-created contacts | Replaces legacy Entity selector on contacts |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin maps "Book an Appointment" in Requirement Options | Selects Process Entity `Appointment`, Workflow Name `Appointment Flow`, and Stage `Booked` | **Requirement saves with complete Process Entity, Workflow Name, and Stage mapping** |
| 2 | Admin changes Process Entity or Workflow Name on a requirement | Switches Process Entity to `Invoice` and selects `Billing & Invoicing` | **Stage dropdown refreshes automatically to list stages of `Billing & Invoicing` (`Draft`, `Payment recorded`, `Paid`, `Overdue`)** |
| 3 | Admin enables Auto Create Contact | Turns Auto Create Contact toggle ON | **Contact Category dropdown appears listing `Lead`, `Client`, `Supplier`, `Vendor`, and custom contact categories (not Entity)** |
| 4 | Admin chooses `Lead` and tests visitor submission | Enters "John Doe, john@example.com", picks "Book an Appointment", and submits | **Contact "John Doe" is created in Contacts under the `Lead` Contact Category while the AI conversation applies the `Appointment Flow · Booked` stage prompt** |
| 5 | Admin turns Auto Create ON without picking a Contact Category, or leaves a requirement unmapped | Clicks Save Configuration | **Validation prevents saving and asks for a Contact Category or complete Requirement Process Entity, Workflow Name, and Stage mapping** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When visitors pick a pre-chat requirement, I want to map it across Process Entity, Workflow Name, and Stage, so that the AI responds with the exact stage workflow prompt for that topic. |
| F-3-J2 | Front-Desk Lead | When auto-creating contacts from website chat visitors, I want to assign them to a Contact Category such as `Lead` or `Client` instead of a system entity, so that new website inquiries land in the right contact segment immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given the Requirement Options & Workflow Mapping list, each requirement displays a text label input plus cascading Process Entity, Workflow Name, and Stage dropdowns. |
| F-3-2 | Given a Process Entity or Workflow Name change on a requirement row, then downstream Workflow Name and Stage dropdowns refresh immediately to match. |
| F-3-3 | Given the Auto Create Contact toggle set to ON, then a **Contact Category** dropdown populated from configured Contact Categories (`Lead`, `Client`, `Supplier`, `Vendor`, plus custom categories) is displayed instead of an Entity dropdown. |
| F-3-4 | Given form submission with Auto Create Contact ON, then the new Contact record is stored under the selected Contact Category while the AI conversation maps to the chosen requirement's Workflow Name and Stage prompt. |

### F-4: Responsible Settings & Sequential Priority Queue Routing
#### 1. What it does
Replaces legacy Queue & Routing with "Responsible Settings". Clinic administrators select team members from verified organization users and choose between three distribution modes: Simultaneous broadcast, Round-robin, and Sequential priority. When "Sequential priority" is active, a numbered drag-to-reorder priority list allows administrators to set the exact fallback order without confusing up/down arrow buttons. Working Hours settings (toggle, days, time ranges, timezone) reside exclusively within this card.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Responsible Members Multi-Select | Picker | Selects team members from the organization roster | No hardcoded sample users |
| F-4.2: Distribution Mode Selector | Dropdown | 3 modes: Simultaneous broadcast, Round-robin, Sequential priority | Configures triage distribution |
| F-4.3: Sequential Priority Reorder List | UI List | Drag-to-reorder numbered priority list (Priority 1, 2, 3...) | Up/down arrow buttons removed |
| F-4.4: Priority Order Persistence | Data Logic | Saves exact member sequence order to backend configuration | Fallback escalation order |
| F-4.5: Working Hours Configuration | Settings | Toggle, working days, time slot ranges, and clinic timezone | Embedded in Responsible card |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin selects "Sequential priority" mode | Chooses Sequential priority from distribution dropdown | **Numbered priority list appears with drag handles and remove trash icons** |
| 2 | Admin reorders Dr. Mehta above Admin User | Drags Dr. Mehta to position #1 | **Dr. Mehta becomes Priority 1 (First Responder); Admin User shifts to Priority 2 (Fallback #1)** |
| 3 | Inbound chat arrives during working hours | Visitor initiates live chat | **Chat alerts Dr. Mehta first; if unanswered in 30 seconds, falls through to Admin User** |
| 4 | Visitor chats outside configured working hours | Visitor messages at 10:00 PM (Hours: 9AM-5PM) | **Out-of-office response triggers: "Our care team is currently offline. We will follow up in the morning."** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinic Administrator | When configuring sequential routing, I want to drag team members into priority order without cluttered up/down arrows, so that escalation hierarchy is simple to manage. |
| F-4-J2 | Practice Manager | When visitors chat after clinic closing, I want working hours enforced inside Responsible Settings, so that realistic response expectations are set. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given "Sequential priority" mode, then a numbered drag-to-reorder list is displayed with up and down arrows removed. |
| F-4-2 | Given working hours enabled, when a visitor chats outside open hours, then the configured out-of-office message is returned. |

### F-5: Website Topbar Controls & Scoped Composer Actions
#### 1. What it does
Configures topbar and composer actions strictly tailored for Website chat. The topbar includes the "Website Widget Settings" cog button (opening the 5-section settings drawer) and the "Test Widget Chat" button (opening the interactive simulator drawer). The "New Group" button is strictly hidden. Inside the chat composer, the "Message Actions & Settings" cog button is strictly removed.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Widget Settings Cog Button | Button | Topbar button launching the Website Widget Settings drawer | 36x36px icon button |
| F-5.2: Test Widget Chat Trigger | Button | Topbar button opening the Test Website Chat simulator drawer | Simulates visitor experience |
| F-5.3: New Group Button Removal | Policy | Strictly hides "New Group" button on Website channel | Group creation exclusive to Companion |
| F-5.4: Composer Message Actions Removal | Policy | Removes the gear cog button from the message text composer | Website channel specific |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff inspects Website channel topbar | Filters to Website channel | **Topbar displays Widget Settings cog and Test Chat button; "New Group" button is absent** |
| 2 | Staff opens chat thread with website visitor | Views composer input box | **Composer features attachment paperclip and send button; Message Actions cog is removed** |
| 3 | Staff clicks Widget Settings in topbar | Clicks settings cog | **Website Widget Settings drawer slides open with 5 structured sections** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Clinical Coordinator | When triaging website chats, I want a clean composer without extraneous setting icons, so that messaging is streamlined and uncluttered. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Given the Website channel view, then the topbar contains the Widget Settings button and Test Chat button, and excludes New Group. |
| F-5-2 | Given any active thread in Website channel, then the chat composer does not render the Message Actions & Settings cog button. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Inbound Web Widget Live Thread Aggregation | F-1.1 Session Card, F-1.2 Visitor Metadata, F-1.3 Human Takeover, F-1.4 Resolve Session | Real-time website visitor thread tracking with active page presence and manual agent takeover. |
| F-2 | Process-Driven AI Assistant First Responder | F-2.1 Stage Prompt Resolver, F-2.2 Stage Response, F-2.3 Action Cards, F-2.4 Queue Escalation | AI engine resolving each requirement's mapped Process Entity, Workflow Name, and Stage prompt during visitor chat. |
| F-3 | Pre-Chat Intake Form, Workflow Mapping & Contact Category | F-3.1 Greeting Message, F-3.2 Field Checkboxes, F-3.3 Entity / Workflow / Stage Mapping, F-3.4 Cascading Filtering, F-3.5 Auto Create Toggle, F-3.6 Contact Category Selector | Welcome greeting, cascading requirement mapping (Process Entity, Workflow Name, Stage), and Contact Category auto-creation. |
| F-4 | Responsible Settings & Sequential Priority Queue | F-4.1 Member Multi-Select, F-4.2 Distribution Selector, F-4.3 Drag Reorder List, F-4.4 Persistence, F-4.5 Working Hours | Responsible team routing with drag-to-reorder sequential priority (no arrow buttons) and embedded working hours. |
| F-5 | Website Topbar Controls & Scoped Composer | F-5.1 Widget Settings Cog, F-5.2 Test Chat Button, F-5.3 Group Button Removal, F-5.4 Composer Scoping | Topbar drawer triggers and clean composer stripping New Group and Message Actions buttons. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Triage Coordinator | When website visitors ask questions on our clinic website, I want to see their active page and query in real time, so that I understand their clinical interest immediately. | F-1 |
| 2 | Website Visitor | When I choose a requirement and start chatting on the clinic website, I want instant, relevant answers aligned with that specific service workflow stage, so that I do not receive generic replies. | F-2 |
| 3 | Practice Administrator | When visitors select a pre-chat requirement, I want the AI to automatically load the prompt from the mapped workflow stage, so that each inquiry type follows the right conversational script. | F-2 |
| 4 | Practice Manager | When visitors pick a pre-chat requirement, I want to map it across Process Entity, Workflow Name, and Stage, so that the AI responds with the exact stage workflow prompt for that topic. | F-3 |
| 5 | Front-Desk Lead | When auto-creating contacts from website chat visitors, I want to assign them to a Contact Category such as `Lead` or `Client` instead of a system entity, so that new website inquiries land in the right contact segment immediately. | F-3 |
| 6 | Clinic Administrator | When configuring sequential routing, I want to drag team members into priority order without cluttered up/down arrows, so that escalation hierarchy is simple to manage. | F-4 |
| 7 | Practice Manager | When visitors chat after clinic closing, I want working hours enforced inside Responsible Settings, so that realistic response expectations are set. | F-4 |
| 8 | Clinical Coordinator | When triaging website chats, I want a clean composer without extraneous setting icons, so that messaging is streamlined and uncluttered. | F-5 |

