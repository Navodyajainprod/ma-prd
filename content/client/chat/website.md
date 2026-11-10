---
title: "Website Live Chat Widget, Process-Driven AI Assistant & Drawer Settings"
product: "Client"
module: "chat"
channel: "website"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | Client |
| Module | Chats & Care Groups - Website Channel (`/chats?channel=website`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

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

### F-2: Process-Driven AI Assistant First Responder & Intent Routing
#### 1. What it does
Provides an intelligent AI First Responder that evaluates inbound messages and pre-chat requirement selections against the organization's configured processes. The AI identifies the target workflow process (e.g. "Appointment Booking", "Billing & Invoicing", "Medical Intake Assessment", or "Clinic Arrival Check-in"), constructs a process-specific response, and surfaces interactive shortcut cards linking the visitor directly to that workflow.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Process Intent Classifier | Logic | Analyzes message content and requirement choice to identify the target practice process | Matches Booking, Billing, Intake, Check-in |
| F-2.2: Process-Specific Response | Generator | Formulates tailored response addressing the identified process context | Explains next steps clearly |
| F-2.3: Interactive Action Card | UI Component | Renders clickable deep-link buttons (e.g. "Open Booking Slots", "View & Pay Invoices", "Complete Forms") | One-tap workflow launch |
| F-2.4: Escalation to Human Queue | Fallback | Escalates to Responsible Settings queue when process cannot be resolved or visitor requests human | Notifies on-duty staff |

#### 3. Worked example
| # | Situation | What the visitor does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor selects "Book an Appointment" requirement | Submits pre-chat form | **AI identifies "Appointment Booking" process; responds with booking instructions and "Select Timeslot" button linking to `/patient/book`** |
| 2 | Visitor asks: "Can I pay my overdue bill here?" | Types billing inquiry | **AI identifies "Billing & Invoicing" process; responds with balance options and "View & Pay Invoices" button linking to `/patient/bill`** |
| 3 | Visitor asks: "Do I need to fill out new patient intake papers?" | Types intake inquiry | **AI identifies "Medical Intake Assessment" process; responds: "Please complete your forms before your visit" with "Complete Forms" button** |
| 4 | Visitor types: "I have arrived at the clinic" | Sends arrival notice | **AI identifies "Visit Check-in" process; responds: "You are checked in! The care team has received your arrival notice."** |
| 5 | Visitor types an ambiguous inquiry | Types: "What is your clinic philosophy?" | **AI responds with practice information and offers to connect to a live coordinator** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Website Visitor | When I visit the clinic website to book or pay, I want instant, accurate guidance based on my specific request, so that I can complete my task without waiting for office hours. |
| F-2-J2 | Practice Administrator | When visitors ask routine operational questions, I want the AI to route them directly to the corresponding process, so that front desk staff are freed from repetitive queries. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a visitor inquiry matching a known process (Booking, Billing, Intake, Check-in), then the AI First Responder identifies the process and outputs the corresponding tailored response. |
| F-2-2 | Given a process-identified response, then an interactive action card with an authenticated deep-link is rendered in the chat bubble. |
| F-2-3 | Given an unrecognized inquiry, then the AI provides general guidance and offers seamless escalation to on-duty team members. |

### F-3: Pre-Chat Intake Form & Auto Create Contact Workflow (Entity Selection Only)
#### 1. What it does
Gathers preliminary visitor information before starting a chat session. Features a greeting message, configurable contact fields (Name, Email, Phone), and client requirement choices. Includes an "Auto Create Contact" toggle: when enabled, the user selects the target Entity under which contacts are created. Auto-created contacts are NOT allocated to any stage or process (stage dropdown, process mapping, and automatic process triggers are strictly excluded).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Greeting Message Input | Text Input | Configures customizable welcome text displayed on the pre-chat card | Multi-line greeting |
| F-3.2: Contact Field Checkboxes | Checkboxes | Toggles collection of Visitor Name, Email, and Phone Number | Markable as required/optional |
| F-3.3: Requirement Options List | List Manager | Manages list of visitor intent choices (e.g. "General Inquiry", "New Patient Visit") | Process dropdown removed |
| F-3.4: Auto Create Contact Toggle | Toggle | When ON, automatically creates a Contact record in CRM upon form submission | Renamed from "Auto Create Client" |
| F-3.5: Entity Selector Dropdown | Dropdown | Selects the organizational Entity the contact is created under | Scoped to org entities |
| F-3.6: Process Allocation Removal | Policy | Auto-created contacts are not assigned to or triggered by any Process or Stage | Excluded by design |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin configures pre-chat greeting | Enters: "Welcome to MantraAssist Health! Please let us know how we can help." | **Greeting displays prominently at top of website pre-chat card** |
| 2 | Admin enables Auto Create Contact | Flips toggle to ON | **Entity selector dropdown appears; stage dropdown and process mapping remain completely hidden** |
| 3 | Admin selects Entity "Healthcare Practice" | Picks "Healthcare Practice" from dropdown and saves | **Configuration persists; visitor submissions automatically create Contacts under Healthcare Practice** |
| 4 | Visitor submits pre-chat form on site | Visitor enters "John Doe, john@example.com" | **Contact "John Doe" is created in CRM under Healthcare Practice with NO process or stage assigned** |
| 5 | Admin toggles Auto Create ON but leaves Entity blank | Clicks Save Widget Settings | **Validation blocks save; surfaces error: "Entity selection is required"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When capturing website leads, I want contacts automatically created under our practice entity without triggering premature clinical processes, so that intake records remain clean. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given the Pre-Chat Form card, then Greeting Message, field checkboxes, and Auto Create Contact exist in that section. |
| F-3-2 | Given the Auto Create Contact toggle set to ON, then an Entity dropdown is shown, and stage dropdown and process mappings are absent. |
| F-3-3 | Given form submission with Auto Create Contact ON, then a Contact is created under the selected Entity without triggering any Process. |

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
| F-2 | Process-Driven AI Assistant First Responder | F-2.1 Intent Classifier, F-2.2 Process Response, F-2.3 Action Cards, F-2.4 Queue Escalation | AI engine identifying practice processes (Booking, Billing, Intake, Check-in) and returning interactive shortcuts. |
| F-3 | Pre-Chat Intake Form & Auto Create Contact | F-3.1 Greeting Message, F-3.2 Field Checkboxes, F-3.3 Requirement List, F-3.4 Auto Create, F-3.5 Entity Selector, F-3.6 Process Removal | Welcome greeting, visitor field collection, and entity-scoped contact creation without stage/process allocation. |
| F-4 | Responsible Settings & Sequential Priority Queue | F-4.1 Member Multi-Select, F-4.2 Distribution Selector, F-4.3 Drag Reorder List, F-4.4 Persistence, F-4.5 Working Hours | Responsible team routing with drag-to-reorder sequential priority (no arrow buttons) and embedded working hours. |
| F-5 | Website Topbar Controls & Scoped Composer | F-5.1 Widget Settings Cog, F-5.2 Test Chat Button, F-5.3 Group Button Removal, F-5.4 Composer Scoping | Topbar drawer triggers and clean composer stripping New Group and Message Actions buttons. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Triage Coordinator | When website visitors ask questions on our clinic website, I want to see their active page and query in real time, so that I understand their clinical interest immediately. | F-1 |
| 2 | Website Visitor | When I visit the clinic website to book or pay, I want instant, accurate guidance based on my specific request, so that I can complete my task without waiting for office hours. | F-2 |
| 3 | Practice Administrator | When visitors ask routine operational questions, I want the AI to route them directly to the corresponding process, so that front desk staff are freed from repetitive queries. | F-2 |
| 4 | Practice Manager | When capturing website leads, I want contacts automatically created under our practice entity without triggering premature clinical processes, so that intake records remain clean. | F-3 |
| 5 | Clinic Administrator | When configuring sequential routing, I want to drag team members into priority order without cluttered up/down arrows, so that escalation hierarchy is simple to manage. | F-4 |
| 6 | Practice Manager | When visitors chat after clinic closing, I want working hours enforced inside Responsible Settings, so that realistic response expectations are set. | F-4 |
| 7 | Clinical Coordinator | When triaging website chats, I want a clean composer without extraneous setting icons, so that messaging is streamlined and uncluttered. | F-5 |

