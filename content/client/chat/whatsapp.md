---
title: "WhatsApp Messaging, Workflow Allocation & 24-Hour Service Window"
product: "Client"
module: "chat"
channel: "whatsapp"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | Client |
| Module | Chats & Care Groups - WhatsApp Channel (`/chats?channel=whatsapp`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Settings > Integrations) | Meta WhatsApp Embedded Signup | Practice admins add clinic WhatsApp numbers through Meta's official Embedded Signup onboarding flow. Registered numbers are stored in the practice phone pool and made available for workflow allocation. | [View Integrations](/client/settings/integrations) |
| Client (Workflows / Process) | Number allocation & AI prompt routing | Numbers added in Integrations are allocated to workflows. **Cardinality rule:** One workflow can have multiple WhatsApp numbers, but no single number can belong to more than one workflow. When a stage triggers an outbound message to a client ("Reach out to client"), the message dispatches from the allocated number. When an inbound message arrives at that number, the conversational AI executes the specific prompt and knowledge base configured for that workflow. | [View Workflows](/client/workflows) |
| Client (Chats Inbox) | Multi-clinic triage & number switcher | Staff monitor live threads across clinic lines using the topbar number switcher, handle manual bot takeover, enforce 24-hour service window compliance, and dispatch approved Meta HSM templates. | [View Chats Inbox](/client/chat/chat) |
| Client (Clients) | Activity timeline write-back | All inbound patient messages, automated AI chatbot turns, staff replies, and template dispatches are recorded on the client's Activity timeline with WhatsApp badges. | [View Clients](/client/clients) |

## 1. Module Summary
- The WhatsApp channel within Client Chats provides a verified healthcare communication interface connected to the Meta WhatsApp Business Cloud API. It enables clinical care teams and practice staff to manage real-time patient conversations, triage inbound inquiries, switch between multiple clinic phone numbers, and dispatch broadcast notifications.
- Clinic front desk staff, care coordinators, and medical assistants use this module for immediate patient communication.
- Accessed in the Client workspace via the main navigation under Chats & Care Groups > WhatsApp.

## 2. Feature Requests

### F-1: Active WhatsApp Thread Ingestion & Clinic Number Switcher
#### 1. What it does
Consolidates all inbound WhatsApp inquiries sent to practice-registered WhatsApp Business API phone numbers into a live conversation stream. When a practice operates multiple locations or departments (e.g., Main Clinic, Pediatrics, Urgent Care), staff can use the topbar number switcher to filter threads specifically associated with that phone number.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Multi-Number Switcher | Dropdown | Allows staff to select between registered WhatsApp Business API numbers | Persists selected number across sessions |
| F-1.2: WhatsApp Inbound Stream | UI List | Renders conversation list with green WhatsApp badges, patient avatar, snippet, and timestamp | Ordered descending by latest activity |
| F-1.3: Unread Message Counter | UI Badge | Displays unread badge on threads with incoming patient responses | Automatically clears when thread opened |
| F-1.4: Responsible Assignment | Dropdown | Assigns responsible clinical coordinator to thread | Notifies assigned team member |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient sends WhatsApp message to Main Clinic number | Patient sends: "Can I reschedule my appointment?" | **Thread appears at top of WhatsApp list with green badge and bold unread count** |
| 2 | Practice operates Downtown and Uptown clinic lines | Staff switches number dropdown to "Uptown Clinic (+1-555-0199)" | **Thread list filters to display only conversations routed to the Uptown number** |
| 3 | Staff opens patient thread | Clicks conversation card | **Chat history loads in center pane and unread badge resets to zero** |
| 4 | Staff reassigns thread to front desk coordinator | Selects "Charu Arora" from responsible dropdown | **Responsible tag updates in thread header and audit event logs assignment** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Coordinator | When patients message different practice locations, I want to switch between clinic phone numbers, so that I can triage inquiries for each location separately. |
| F-1-J2 | Medical Assistant | When new WhatsApp inquiries arrive, I want to see unread indicators in real time, so that urgent patient questions are addressed promptly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given registered WhatsApp phone numbers, when staff selects a number from the topbar switcher, then only threads belonging to that phone number render. |
| F-1-2 | Given an inbound WhatsApp message, when received via webhook, then the thread list updates immediately without full-page refresh. |
| F-1-3 | Given any WhatsApp thread, when viewed in the Client topbar, then the "New Group" button is hidden. |

### F-2: Meta 24-Hour Service Window Tracker & Policy Enforcement
#### 1. What it does
Monitors Meta's mandatory 24-hour customer service window for WhatsApp messaging. Within 24 hours of the patient's last incoming message, clinical staff can send freeform text, files, and links. Once the 24-hour window expires, the freeform composer is locked, and staff are guided to select a pre-approved HSM template to re-open the conversation.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: 24h Countdown Timer | UI Indicator | Shows remaining time in the active 24-hour window (e.g., "14h remaining") | Displayed above composer |
| F-2.2: Window Expiration Banner | UI Banner | Displays warning when window has expired with "Send Template" button | Explains Meta policy |
| F-2.3: Freeform Lock Controller | Logic | Disables text input and file upload when window has expired | Prevents carrier delivery rejections |
| F-2.4: Window Re-activation Listener | Logic | Automatically re-enables freeform composer when patient sends a new reply | Resets 24h timer to 24:00 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient replied 2 hours ago | Staff opens conversation | **Timer shows "22h remaining"; freeform composer is active and unlocked** |
| 2 | Patient last messaged 26 hours ago | Staff opens conversation | **Composer displays locked state with notice: "24-hour window expired. Select an approved template to message."** |
| 3 | Staff clicks "Send Template" button | Staff selects approved "Appointment Follow-up" template | **Template message dispatches; delivery receipt shows single check** |
| 4 | Patient responds to the template: "Yes, 10 AM works" | Patient sends incoming WhatsApp message | **24-hour window re-opens immediately; freeform composer unlocks** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinic Staff | When communicating after the 24-hour window has expired, I want clear guidance on sending approved templates, so that carrier delivery failures are prevented. |
| F-2-J2 | Practice Administrator | When reviewing messaging compliance, I want Meta window rules automatically enforced, so that the clinic does not incur carrier policy penalties. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a thread where patient last messaged < 24 hours ago, when staff views composer, then freeform text and attachments are enabled. |
| F-2-2 | Given a thread where patient last messaged > 24 hours ago, when staff views composer, then text input is disabled and template picker is prompted. |
| F-2-3 | Given an expired thread, when a new incoming patient message arrives, then the 24-hour window resets and composer unlocks immediately. |

### F-3: Pre-Approved HSM WhatsApp Template Selection & Dynamic Variable Merge
#### 1. What it does
Provides a library of Meta pre-approved Highly Structured Message (HSM) templates for clinic outreach (appointment reminders, post-op care checks, lab result notifications, payment links). Staff can preview templates, fill required dynamic variables (`{{1}}`, `{{2}}`), and dispatch messages with automated patient record interpolation.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Template Picker Drawer | UI Drawer | Slide-over drawer listing all approved WhatsApp templates by category | Searchable by title and keyword |
| F-3.2: Variable Merge Form | UI Form | Input fields mapping template variables (e.g. `{{1}} = Patient Name`, `{{2}} = Date`) | Auto-populated from patient chart |
| F-3.3: Live Template Preview | UI Preview | Real-time preview card showing exact message appearance before sending | Renders header, body, buttons |
| F-3.4: Quick Reply Action Buttons | UI Component | Supports templates configured with interactive CTA or Quick Reply buttons | Up to 3 quick buttons |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff needs to send pre-visit reminder | Opens Template Drawer and picks "Appointment Confirmation" | **Drawer shows template body with variables `{{1}}` and `{{2}}`** |
| 2 | System merges patient data | Form auto-fills `{{1}}` as "Sarah Johnson" and `{{2}}` as "Nov 12, 10:00 AM" | **Live preview displays: "Hi Sarah Johnson, your visit is scheduled for Nov 12, 10:00 AM."** |
| 3 | Staff clicks Send Template | Staff confirms dispatch | **Template sent via Meta API; card appears in thread with template badge** |
| 4 | Staff attempts to send with missing variable | Clears date field and clicks send | **Validation blocks submission and highlights missing variable input in red** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Medical Assistant | When reaching out after hours or outside the 24h window, I want to send pre-approved reminders with dynamic patient fields, so that outreach is instant and personalized. |
| F-3-J2 | Practice Manager | When standardizing clinical communication, I want approved templates with locked wording, so that medical disclaimers are uniformly followed. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given the WhatsApp template drawer, when opened, then all Meta-approved templates for the tenant are displayed with category tags. |
| F-3-2 | Given variable placeholders (`{{1}}`, `{{2}}`), when template is selected, then patient name and appointment fields auto-populate. |
| F-3-3 | Given an unpopulated variable, when the user clicks send, then dispatch is blocked with a validation error. |

### F-4: WhatsApp Topbar Controls & Scoped Action Scoping
#### 1. What it does
Configures the channel-specific topbar controls for WhatsApp. The topbar includes the phone number switcher, template library button, contact search input, and filter controls. "New Group" is strictly hidden (as group creation is scoped exclusively to the Companion channel). "Message Actions & Settings" cog is enabled on message bubbles.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Topbar Phone Switcher | Dropdown | Switches clinic phone numbers | Shows phone number and label |
| F-4.2: Template Library Button | Button | Quick-action button opening the WhatsApp Template Drawer | Accessible directly from topbar |
| F-4.3: New Group Button Removal | Policy | Strictly hides "New Group" button on WhatsApp | Prevents invalid carrier group operations |
| F-4.4: Message Actions Cog | UI Control | Allows message copy, quotation reply, and forwarding | Enabled for WhatsApp channel |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff inspects WhatsApp channel topbar | Filters to WhatsApp channel | **Topbar displays Phone Switcher, Template Library button, Search bar; "New Group" is absent** |
| 2 | Staff clicks Template Library in topbar | Clicks "Templates" button | **Template library drawer slides open from right** |
| 3 | Staff hovers over sent WhatsApp message | Moves mouse cursor over message bubble | **Message Actions cog appears with Reply and Copy actions** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinical Coordinator | When triaging WhatsApp chats, I want a focused topbar with template shortcuts and phone switchers, so that I don't see irrelevant controls. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given the WhatsApp channel view, then the "New Group" button is not rendered in the topbar. |
| F-4-2 | Given the WhatsApp channel view, then the topbar contains the Phone Switcher and Templates action button. |

---

### F-5: Workflow-Driven AI Chatbot Binding per WhatsApp Number (Prompt & Knowledge Base Scoping)
#### 1. What it does
In **Settings > Integrations**, practice admins add clinic WhatsApp numbers through Meta's Embedded Signup flow. Once connected, these numbers become available in **Workflows** (`/process` → Chatbot Channel Settings).

Each workflow can be allocated one or more WhatsApp numbers, but **strict cardinality is enforced: one workflow can have multiple WhatsApp numbers, but no single phone number can belong to more than one workflow**.

This powers two-way automated clinical routing:
1. **Outbound Stage Triggers ("Client reach out to us / Reach out to client")**: When an automation stage triggers an outbound message to a client, the message dispatches directly from the workflow's allocated WhatsApp number(s).
2. **Inbound Stage Ingestion & AI Prompt Execution**: When a patient sends an inbound WhatsApp message to that number, it routes to that workflow, and the conversational AI chatbot answering on that number dynamically inherits and adheres to the **AI Prompt** (persona, instructions, clinical boundaries, and intake scripts) and the **Knowledge Base (KB)** (protocol documents, triage guides, service pricing, and FAQs) configured on that specific workflow.

This guarantees that a clinic running multiple distinct service lines on different WhatsApp numbers automatically isolates AI behavior: inquiries to a dedicated dental line follow dental prompts and dental knowledge articles, while inquiries to an urgent care or cardiology line follow their respective clinical guidelines without cross-contamination.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Embedded Signup & Number Availability | Integration | Numbers added via Meta Embedded Signup in Settings > Integrations become available in Workflow Chatbot Channel Settings | Centralized practice number pool |
| F-5.2: Multi-Number Workflow Allocation (1:N Rule) | Configuration | Allows allocating multiple numbers to one workflow; strictly forbids assigning one number to multiple workflows | Prevents inbound collision across workflows |
| F-5.3: Outbound Stage Dispatch | Execution | Automatically sends stage outreach ("Reach out to client") from the allocated workflow number | Dispatched via Meta WhatsApp Cloud API |
| F-5.4: Inbound Number-to-Workflow Routing Resolver | System Service | Maps incoming WhatsApp phone numbers to the target workflow ID and initial entry stage (`useStageNumberRouting`) | Direct deterministic 1:1 number lookup |
| F-5.5: Workflow AI Prompt Adherence | LLM Runtime | Injects the attached workflow and stage's AI Prompt as the chatbot's system instruction | Sets conversation style, intake questions, tone, and guardrails |
| F-5.6: Scoped Knowledge Base RAG Retrieval | Context Engine | Restricts AI vector retrieval and reference lookups exclusively to the Knowledge Base sources linked to the attached workflow | Prevents leakage of unrelated clinic data across different numbers |
| F-5.7: In-Chat Stage Progression & Automations | State Machine | Matches patient responses against workflow `inchat` triggers and intent steps (e.g. moving patient to "Needs Assessment" or "Booked") | Evaluates trigger conditions in real time |
| F-5.8: Human Handover & Bot Pause | Control Toggle | Pauses the AI chatbot and tags the thread as "Assigned: <Staff Name>" whenever an escalation condition triggers or staff sends a manual reply | Preserves clinical oversight |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient messages the Pediatrics WhatsApp line (+1-555-0111) | Sends message: "What should I do if my 3-year-old has a 101F fever?" | **Chatbot routes through Pediatrics Triage Workflow; loads pediatric triage prompt and references the 'Pediatric Fever Management Protocol' from the attached KB to provide verified guidance.** |
| 2 | Same patient messages the Cosmetic Dermatology line (+1-555-0222) | Sends message: "How much is a chemical peel consultation?" | **Chatbot routes through Dermatology Workflow; uses derm intake prompt and Dermatology Fee Schedule KB, answering with pricing and pre-care instructions.** |
| 3 | Patient requests to speak with a human on WhatsApp | Sends message: "I want to talk to an assistant please" | **In-chat escalation trigger fires; AI bot pauses, and thread is flagged as unassigned/assigned to coordinator in the unified inbox.** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Administrator | When configuring multiple WhatsApp business numbers for different departments, I want each number's AI bot to follow the prompt and Knowledge Base of its attached workflow, so that patients receive specialized, accurate guidance. |
| F-5-J2 | Clinical Lead | When designing specialty care pathways, I want the WhatsApp bot to reference only our approved departmental protocols, so that medical disclaimers and clinical instructions are strictly adhered to. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Given WhatsApp numbers connected via Meta Embedded Signup in Settings > Integrations, they are available to be allocated in Workflow Chatbot Channel Settings. |
| F-5-2 | Given a workflow, it can be allocated multiple WhatsApp numbers; however, no single phone number can belong to more than one workflow. |
| F-5-3 | Given an outbound workflow stage trigger ("Reach out to client"), the message is dispatched from the workflow's allocated WhatsApp number. |
| F-5-4 | Given an inbound message arriving at an allocated WhatsApp number, the AI chatbot executes using that workflow's specific AI Prompt as its system instructions. |
| F-5-5 | Given a query requiring clinic information, the chatbot retrieves context strictly from Knowledge Base sources attached to that workflow. |
| F-5-6 | Inbound messages to a WhatsApp number attached to Workflow Y must never retrieve or reference knowledge sources exclusively scoped to Workflow X. |
| F-5-7 | When an in-chat automation matches a patient response, the system updates the client's workflow stage in real time. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Active WhatsApp Thread Ingestion & Number Switcher | F-1.1 Number Switcher, F-1.2 Inbound Stream, F-1.3 Unread Badge, F-1.4 Responsible Assignment | Multi-clinic phone number filtering with live unread indicators and staff triage assignment. |
| F-2 | Meta 24-Hour Service Window Tracker & Policy | F-2.1 Countdown Timer, F-2.2 Expiration Banner, F-2.3 Freeform Lock, F-2.4 Window Re-activation | Strict customer service window monitoring with composer locking and automated re-opening. |
| F-3 | Pre-Approved HSM WhatsApp Template Selection | F-3.1 Template Drawer, F-3.2 Variable Form, F-3.3 Live Preview, F-3.4 Quick Reply Buttons | Meta-compliant template catalog with patient chart variable auto-population and preview. |
| F-4 | WhatsApp Topbar Controls & Scoped Action Scoping | F-4.1 Topbar Switcher, F-4.2 Template CTA, F-4.3 Group Button Removal, F-4.4 Message Actions | Focused WhatsApp topbar hiding New Group and exposing templates and phone switchers. |
| F-5 | Workflow-Driven AI Chatbot Binding per WhatsApp Number | F-5.1 Routing Resolver, F-5.2 Prompt Adherence, F-5.3 Scoped KB Retrieval, F-5.4 Stage Progression, F-5.5 Human Handover | Each WhatsApp number's AI chatbot follows the specific system prompt and Knowledge Base of its attached workflow pipeline. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Coordinator | When patients message different practice locations, I want to switch between clinic phone numbers, so that I can triage inquiries for each location separately. | F-1 |
| 2 | Medical Assistant | When new WhatsApp inquiries arrive, I want to see unread indicators in real time, so that urgent patient questions are addressed promptly. | F-1 |
| 3 | Clinic Staff | When communicating after the 24-hour window has expired, I want clear guidance on sending approved templates, so that carrier delivery failures are prevented. | F-2 |
| 4 | Practice Administrator | When reviewing messaging compliance, I want Meta window rules automatically enforced, so that the clinic does not incur carrier policy penalties. | F-2 |
| 5 | Medical Assistant | When reaching out after hours or outside the 24h window, I want to send pre-approved reminders with dynamic patient fields, so that outreach is instant and personalized. | F-3 |
| 6 | Practice Manager | When standardizing clinical communication, I want approved templates with locked wording, so that medical disclaimers are uniformly followed. | F-3 |
| 7 | Clinical Coordinator | When triaging WhatsApp chats, I want a focused topbar with template shortcuts and phone switchers, so that I don't see irrelevant controls. | F-4 |
| 8 | Practice Administrator | When configuring multiple WhatsApp business numbers, I want each number's AI bot to follow the prompt and Knowledge Base of its attached workflow. | F-5 |
| 9 | Clinical Lead | When designing specialty care pathways, I want the WhatsApp bot to reference only our approved departmental protocols without cross-department data leakage. | F-5 |

