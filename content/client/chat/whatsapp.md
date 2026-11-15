---
title: "Chats: WhatsApp Channel & Workflow Automation"
product: "client"
module: "chat"
channel: "whatsapp"
route: "/chats?channel=whatsapp"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | CHATS: WHATSAPP CHANNEL & WORKFLOW AUTOMATION |
| Route | `/chats?channel=whatsapp` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The end-to-end WhatsApp messaging and automation architecture. Phone numbers are onboarded in **Settings > Integrations** via Meta's Embedded Signup, allocated to specific **Workflows** in the Process engine (where one workflow can hold multiple numbers, but each number belongs exclusively to one workflow), executed by automated AI chatbot agents following workflow-specific prompts, and managed operationally in the **Chats** console (`/chats?channel=whatsapp`) with a number switcher, 24-hour service window compliance, and a pre-approved Meta HSM template library. |
| **Who uses it** | **Practice Admin** (onboards WABA numbers in Integrations, allocates numbers to workflows, configures AI chatbot prompts). **Care Coordinator & Medical Staff** (monitors live threads, filters by clinic number, replies, takes over from the bot, and dispatches approved HSM templates). |
| **Where you start it** | 1. **Settings > Integrations** (`/settings/integrations`) to onboard WhatsApp numbers via Meta Embedded Signup.<br>2. **Workflows** (`/process` → Chatbot Channel Settings) to allocate numbers and configure chatbot prompts.<br>3. **Chats** (`/chats?channel=whatsapp`) for live triage, thread management, and the template library. |
| **Where the result goes** | Direct to patient mobile phones via WhatsApp PSTN, recorded in real time in the Chats inbox, and logged as an activity entry on the patient's **Client Profile Timeline**. |
| **Cross-product scope** | **Client workspace only.** WhatsApp is direct, external clinic-to-patient mobile communication. It operates independently of the Companion patient portal. |
| **How real is it** | 4 features work, 2 are partly simulated, 0 are not built. See the legend below. Number storage and UI allocation exist in the prototype; Meta API connectivity and outbound WhatsApp delivery are simulated. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Settings > Integrations) | Meta WhatsApp Embedded Signup | Practice admins connect official WhatsApp Business Accounts (WABA) using Meta's Embedded Signup onboarding flow. Registered numbers are stored in the workspace phone pool. | [View Integrations](/client/settings/integrations) |
| Client (Workflows / Process) | Number allocation & AI prompt routing | Workflows allocate active WhatsApp numbers. **Cardinality rule:** One workflow can have multiple WhatsApp numbers, but no single phone number can belong to more than one workflow. Outbound stages dispatch from the allocated number; inbound messages to that number invoke that workflow's specific prompt. | [View Workflows](/client/workflows) |
| Client (Chats Inbox) | Omnichannel triage & number switcher | `/chats?channel=whatsapp` provides a unified inbox with a phone number switcher, unread badges, manual bot takeover, 24-hour window compliance, and template dispatch. | [View Chats Inbox](/client/chat/chat) |
| Client (Clients & Contacts) | Activity timeline write-back | Inbound messages, automated AI chatbot turns, staff replies, and template dispatches are recorded on the client's Activity timeline with WhatsApp badges. | [View Clients](/client/clients) |

## 1. Module Summary

### The story in one minute

Dr. Alexander Vance connects his clinic's WhatsApp Business Account in **Settings > Integrations** using Meta's Embedded Signup flow, bringing two dedicated clinic phone lines (`+1 (555) 123-4567` and `+1 (555) 987-6543`) into the workspace.

He opens **Workflows** (`/process`) and edits the "Cataract Consultation & Surgery" workflow. In **Chatbot Channel Settings**, he enables the WhatsApp Channel and allocates both phone numbers to this workflow. The system enforces the exclusive number rule: because both numbers are now tied to this Cataract workflow, neither can be assigned to another workflow. He sets the workflow's conversational AI prompt, knowledge base, clinical triage rules, and LLM model (e.g. Gemini 2.5 Flash).

When a patient reaches an automated outreach stage (e.g. "Reach out to client" for post-op eye drop guidance), an outbound WhatsApp message is sent from the allocated clinic number. When patient Sarah Johnson replies, her incoming message hits that allocated number and routes directly to the Cataract workflow. The automated AI chatbot processes her question using the exact prompt and knowledge base configured for that workflow.

In the clinic, Care Coordinator Priya Nair opens **Chats** (`/chats?channel=whatsapp`). She uses the top-bar number switcher to filter threads by the Uptown line. Seeing Sarah's thread, she reviews the automated conversation, pauses the bot to step in personally, and sends a pre-approved Meta HSM template ("Appointment Follow-up") with full 24-hour customer care window compliance. Every exchange is automatically logged to Sarah's patient timeline.

### What is real and what is not

- **Real in the prototype:** Number persistence in the workspace store (`useWhatsAppNumbers`), workflow multi-select number allocation in Chatbot Channel Settings drawer (`ChatbotChannelDrawer.tsx`), thread list with unread counter, search, manual responsible staff assignment, template builder with live preview, and timeline activity write-back.
- **Simulated:** Meta Embedded Signup uses a simulated OAuth callback. Actual WhatsApp Cloud API webhooks and carrier message delivery are mocked in local storage. The 24-hour service window is calculated but forced open for demonstration. Template approval requests are auto-approved instantly.
- **Not built:** Server-side webhook receiver, carrier message delivery receipts (double blue checks), media attachments over 25MB, dynamic HSM template parameter validation against live patient chart variables.

### Journey position

```
Settings > Integrations (Meta Embedded Signup onboarding)
      │
      ▼
Workflows / Process (Allocate numbers; 1 workflow : N numbers, 1 number : 1 workflow; configure AI prompt)
      │
      ├─▶ Outbound stage trigger ──▶ Patient's mobile phone (dispatched from allocated number)
      │                                      │
      │                                      ▼ (Patient replies inbound)
      ├─▶ Inbound message routing ─▶ AI Chatbot executes Workflow-specific prompt
      │
      ├─▶ Chats Console (/chats?channel=whatsapp: staff monitoring, number switcher, 24h window, HSM templates)
      │
      └─▶ Client Profile (Activity timeline history)
```

## 2. Feature Requests

### F-1: WhatsApp Number Onboarding via Meta Embedded Signup

#### 1. What it does
In **Settings > Integrations** (`/settings/integrations`), the Practice Admin connects WhatsApp Business Accounts using Meta's Embedded Signup flow. This links the clinic's WABA (WhatsApp Business Account) and registers active phone numbers with Meta Cloud API credentials (`wabaId`, `phoneNumberId`, `businessAccountId`, `displayPhoneNumber`).

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Embedded Signup Trigger | Button | Launches Meta OAuth onboarding dialog ("Launch WhatsApp Onboarding") | ● Works | Opens Meta modal in client |
| F-1.2: Number Registration | Data | Captures phone number, verified display name, and Meta Cloud API credentials | ● Works | Stored in `whatsappTemplateIntegrations` |
| F-1.3: Number Inventory | List | Displays active WhatsApp numbers with provider status and phone IDs | ● Works | Consumed by `useWhatsAppNumbers` hook |
| F-1.4: Disconnect / Reconnect | Action | Revokes Meta token and releases phone numbers from the workspace pool | ● Works | Confirmation modal with audit log |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Setting up clinic communications | Opens Settings > Integrations, clicks **Launch WhatsApp Onboarding** | **Meta Embedded Signup completes; `+1 (555) 123-4567` is added to the clinic's number pool** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | I want to onboard our verified clinic phone numbers through Meta Embedded Signup, so that our practice can communicate legally over WhatsApp. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** Settings > Integrations, **when** the user completes Meta Embedded Signup, **then** the connected phone numbers appear in the workspace number inventory. |
| F-1-2 | **Given** registered numbers, **then** they are exposed to the workflow engine and chats module via `useWhatsAppNumbers`. |

---

### F-2: Workflow Number Allocation & Cardinality Enforcement

#### 1. What it does
In **Workflows** (`/process`), each clinical process can enable the WhatsApp channel inside its **Chatbot Channel Settings** drawer. The admin allocates one or more WhatsApp numbers to the workflow.
**Strict Cardinality Rule:**
- **One workflow can have multiple WhatsApp numbers** (e.g., Downtown line and Uptown line both routing into the Cataract Surgery workflow).
- **No single phone number can belong to more than one workflow** (an individual number cannot be split across multiple workflows, ensuring zero ambiguity in inbound routing).

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: WhatsApp Channel Toggle | Toggle | Enables or disables automated WhatsApp handling on the workflow | ● Works | Persisted in workflow stage settings |
| F-2.2: Channel Phone Numbers Multi-Select | Dropdown | Multi-select pills listing available numbers from Integrations | ● Works | Supports multiple numbers per workflow |
| F-2.3: Exclusive Allocation Rule | Validation | Prevents a phone number from being assigned to more than one workflow | ● Works | Once assigned to Workflow A, the number is unavailable or reassigned from Workflow B |
| F-2.4: Default Inbound Assignment | Setting | Defines primary fallback number for outbound stage triggers | ● Works | First allocated number acts as primary default |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Configuring Cataract Workflow | Toggles WhatsApp Channel ON, selects `+1 (555) 123-4567` and `+1 (555) 987-6543` | **Both numbers are allocated to the Cataract workflow** |
| 2 | Configuring Dental Workflow | Opens Dental workflow Chatbot Settings | **The two cataract numbers cannot be chosen, or prompt a reassignment warning** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | I want to dedicate specific phone numbers to specific clinical workflows, so that patient inquiries are routed to the correct clinical process without collision. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a workflow's Chatbot Channel Settings, **when** WhatsApp is enabled, **then** the user can allocate one or more registered WhatsApp numbers. |
| F-2-2 | **Given** a phone number already allocated to Workflow A, **then** it cannot simultaneously be active on Workflow B. |

---

### F-3: Workflow-Driven Inbound & Outbound Chatbot Execution

#### 1. What it does
When a workflow stage triggers an outbound message to a client (e.g., "Client reach out to us / Reach out to client"), the message is dispatched from the workflow's allocated WhatsApp number. Conversely, when an inbound message arrives at an allocated number, it routes to that workflow, and the AI chatbot executes the specific prompt, knowledge base, and instructions configured for **that Workflow**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Outbound Stage Dispatch | Action | Dispatches stage communication from the allocated WhatsApp number | ● Works | Uses the workflow's active number |
| F-3.2: Inbound Number Routing | Router | Inbound webhook matches recipient phone number to its dedicated workflow | ● Works | Deterministic 1:1 number-to-workflow mapping |
| F-3.3: Workflow Prompt Execution | AI Engine | Chatbot replies according to the workflow's prompt, clinical guidelines, and model | ● Works | Driven by `botModel`, system prompt, and stage KB |
| F-3.4: Auto-Create Client on First Message | Rule | Optional setting in drawer to create patient record from WhatsApp sender ID | ● Works | `autoCreateClient` toggle in Chatbot drawer |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient reaches post-op stage | Stage trigger activates | **Outbound WhatsApp message is sent from the Cataract workflow's number** |
| 2 | Sarah Johnson replies: "Can I shower after surgery?" | Message arrives on `+1 (555) 123-4567` | **Inbound routes to Cataract workflow; AI bot uses Cataract prompt and knowledge base to answer correctly** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | I want our conversational AI bot to follow the specialized clinical prompt of the relevant workflow, so that patients receive clinically accurate guidance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an automated outbound stage, **then** the message is dispatched from the workflow's allocated WhatsApp number. |
| F-3-2 | **Given** an inbound message to a clinic WhatsApp number, **then** it is handled by the workflow allocated to that number, using that workflow's prompt and model. |

---

### F-4: WhatsApp Threads & Number Switcher in Chats Console

#### 1. What it does
In **Chats** (`/chats?channel=whatsapp`), staff see live WhatsApp threads across the practice. The top-bar number switcher allows filtering threads by specific clinic lines. Staff can read messages, reply manually, take over from the AI bot, and view unread notification badges.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: WhatsApp Thread List | List | Lists threads with patient name, phone, snippet, timestamp, unread badge | ● Works | Synced in local store |
| F-4.2: Number Switcher | Dropdown | Filters the thread list by allocated clinic WhatsApp number | ● Works | Populated from `useWhatsAppNumbers` |
| F-4.3: Unread Badges | Indicator | Numeric counter on unread incoming WhatsApp messages; clears on open | ● Works | |
| F-4.4: Staff Bot Takeover | Action | Assigning a staff member or typing manually pauses automated bot replies | ● Works | Gear menu → **Assign Responsible** |
| F-4.5: Search & Filter | Search | Searches patient names, phone numbers, and message content | ● Works | Real-time text search |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator Priya arrives for shift | Opens Chats, selects WhatsApp channel and filters by Downtown line | **Only threads belonging to the Downtown WhatsApp number are listed** |
| 2 | Patient asks for human assistance | Priya types a message and assigns herself | **AI chatbot is paused on the thread; Priya handles the patient directly** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Care Coordinator | When managing multiple practice locations, I want to filter WhatsApp threads by phone number, so that I focus on my assigned facility. |
| F-4-J2 | Care Coordinator | When a patient needs complex clinical triage, I want to take over from the AI bot seamlessly, so that the patient receives personal care. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** `/chats?channel=whatsapp`, **when** a number is selected in the number switcher, **then** threads are filtered to that clinic line. |
| F-4-2 | **Given** an active thread, **when** staff assign a team member or reply, **then** the AI bot is paused for that thread. |

---

### F-5: Meta 24-Hour Customer Care Window Compliance

#### 1. What it does
Under Meta policy, businesses can exchange freeform messages with patients only within 24 hours of the patient's last inbound message. Once the 24-hour service window closes, freeform messaging is restricted, and staff must send an approved Meta HSM template message to re-engage the patient.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: 24h Window Calculation | Rule | Computes elapsed time since the latest inbound message timestamp | ◐ Simulated | Window forced open in prototype for demo (G4-W-06) |
| F-5.2: Service Window Countdown | Indicator | Visual indicator above composer showing remaining time in the active window | ○ Not built | Target design |
| F-5.3: Window Expiry Notification | Banner | Informs staff when the 24h window has expired and prompts template usage | ○ Not built | Target design |
| F-5.4: Automatic Window Reset | Rule | Patient reply immediately resets the 24-hour customer care timer | ● Works | Inbound message resets timer |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient replied 2 hours ago | Staff opens thread | **Window is active; freeform messaging and attachments permitted** |
| 2 | Patient last replied 3 days ago | Staff attempts to message | **System prompts staff to send an approved HSM Template to reopen window** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | I want the system to observe Meta's 24-hour messaging window, so that our clinic avoids Meta Cloud API carrier blocks and penalties. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** an inbound message, **then** the 24-hour service window opens and permits freeform conversation. |
| F-5-2 | **Given** an expired 24h window, **then** outbound communication must be an approved Meta HSM template. |

---

### F-6: Meta HSM Template Library & Composer Sender

#### 1. What it does
Provides a library of pre-approved Meta HSM (Highly Structured Message) templates at `/chats?tab=templates`. Staff can build new templates with parameter mapping (`{{1}}`, `{{2}}`), copy from a starter library, and submit for approval. In any WhatsApp thread, staff can click **Share Template Message** to send an approved template directly into the conversation.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-6.1: Template Library Management | Table | Lists templates with category, language, approval status, and actions | ● Works | Stored in browser store |
| F-6.2: Template Builder Drawer | Drawer | Visual builder with parameter mapping and real-time WhatsApp bubble preview | ● Works | |
| F-6.3: Starter Templates | Catalog | Pre-built healthcare templates (Appointment Reminder, Lab Result Ready, Intake Form) | ● Works | One-click copy into clinic library |
| F-6.4: Request Meta Approval | Action | Submits template to Meta for category and content verification | ◐ Simulated | Auto-approved in prototype |
| F-6.5: Share Template Message | Modal | Modal in chat composer allowing immediate template selection and dispatch | ● Works | Resolves variables or defaults to "there" |
| F-6.6: Activity Write-back | Event | Sent template is automatically logged to the patient's Client Activity Timeline | ● Works | Logged with WhatsApp tag |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Window expired for Sarah Johnson | Staff clicks gear → **Share Template Message** → selects "Appointment Follow-up" | **Approved template dispatches to Sarah's WhatsApp; entry logs in Client Timeline** |
| 2 | Sarah replies: "Yes, I will be there" | Sarah sends message | **24-hour service window is reopened; staff can converse freely** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-6-J1 | Practice Manager | I want to maintain standardized, approved WhatsApp templates for reminders and follow-ups, so that staff communicate with consistent wording. |
| F-6-J2 | Care Coordinator | I want to dispatch an approved template directly from the chat composer, so that I can re-engage patients whose 24-hour window has expired. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-6-1 | **Given** the chat composer, **when** staff selects an approved template, **then** it dispatches to the patient's WhatsApp thread. |
| F-6-2 | **Given** template dispatch, **then** the action is recorded in the patient's Client Activity timeline. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Number Onboarding (Integrations) | F-1.1 – F-1.4 | ● / ◐ | Meta Embedded Signup registers clinic WABA numbers into workspace pool. |
| F-2 | Workflow Number Allocation | F-2.1 – F-2.4 | ● Works | Multi-select numbers per workflow; strict 1:N cardinality (no shared numbers across workflows). |
| F-3 | Workflow Chatbot Execution | F-3.1 – F-3.4 | ● Works | Outbound stage dispatch & inbound routing to workflow-specific prompt and model. |
| F-4 | WhatsApp Threads & Switcher | F-4.1 – F-4.5 | ● Works | Live threads, clinic line filtering, unread badges, manual bot takeover. |
| F-5 | 24-Hour Service Window | F-5.1 – F-5.4 | ◐ / ○ | Meta 24h customer care compliance; freeform allowed within 24h, templates required outside. |
| F-6 | Template Library & Sender | F-6.1 – F-6.6 | ● / ◐ | Builder, starter catalog, auto-approval, composer dispatch, timeline write-back. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Onboard verified clinic phone lines via Meta Embedded Signup | F-1 |
| 2 | Practice Manager | Allocate dedicated numbers to workflows with exclusive routing | F-2 |
| 3 | Practice Manager | Ensure conversational AI follows workflow-specific clinical prompts | F-3 |
| 4 | Care Coordinator | Filter chats by clinic number | F-4 |
| 5 | Care Coordinator | Take over from the bot when a patient needs complex triage | F-4 |
| 6 | Practice Admin | Comply with Meta's 24-hour service window rules | F-5 |
| 7 | Practice Manager | Maintain standardized approved WhatsApp templates | F-6 |
| 8 | Care Coordinator | Re-engage inactive patients using approved Meta HSM templates | F-6 |

---

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| **System Admin / Practice Admin** | Onboard WABA numbers in Settings > Integrations, allocate numbers to workflows in Process, configure AI chatbot prompts, create and approve HSM templates. | Nothing |
| **Care Coordinator / Clinical Staff** | Filter threads by clinic line in `/chats?channel=whatsapp`, reply to patients, pause bot and take over responsible assignment, dispatch approved templates. | Cannot disconnect Meta integrations or change workflow number routing |
| **Signed-out visitor** | Nothing (redirected to sign-in) | Everything |

---

## 5. Metrics and definitions

| Metric | Definition | Benchmark / Formula |
| :--- | :--- | :--- |
| **Active WhatsApp Lines** | Count of registered Meta Cloud API phone numbers currently allocated to workflows. | Integer count (1 workflow : N numbers). |
| **24h Window Adherence** | Percentage of outbound communications sent within the active window or via approved templates. | Target: 100% compliance to avoid carrier blocking. |
| **AI Bot Resolution Rate** | Percentage of inbound WhatsApp interactions resolved by the workflow AI bot without staff takeover. | Industry benchmark: >70%. |
| **Template Delivery Rate** | Percentage of Meta HSM templates successfully delivered to patient handsets. | Target: >98%. |

---

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| **Onboarding & Channel Setup** | Settings > Integrations → Workflows | Admin connects numbers via Meta Embedded Signup. Numbers become available in Workflows. Admin allocates numbers to a workflow with exclusive assignment. |
| **Automated Clinical Outreach** | Workflow Stage Trigger → Patient WhatsApp | Workflow reaches an outbound communication stage ("Reach out to client"). Message is dispatched from the workflow's allocated WhatsApp number. |
| **Inbound Patient Inquiry** | Patient WhatsApp → Workflow Chatbot | Patient replies. System routes to the allocated workflow, and the AI chatbot responds following that workflow's specific prompt. |
| **Live Staff Triage & Takeover** | Chats Console → Patient WhatsApp | Staff views thread in `/chats?channel=whatsapp`, filters by phone line, pauses bot, replies manually, or sends an approved HSM template. |
| **Audit & Record Keeping** | WhatsApp Exchange → Client Profile | Every inbound message, bot turn, staff response, and template is archived to the patient's Client Activity Timeline. |

> **Explicit Boundary Note:** WhatsApp operates exclusively within the **Client** workspace and patient mobile messaging network. The **Companion** patient portal does not receive or host WhatsApp messages.

---

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-139 | When multiple numbers are allocated to a single workflow, how should outbound stage messages select between them (e.g. round-robin, patient location match, or primary default line)? | F-2.4, F-3.1 |
| D-140 | When reallocating a phone number from Workflow A to Workflow B, should existing open threads automatically migrate workflows or complete in their origin workflow? | F-2.3, F-3.2 |
| D-135 | In production, should the 24-hour service window hard-lock the composer input or provide an override confirmation modal for emergency clinical dispatches? | F-5.2, F-5.4 |
| D-136 | Will Meta HSM template variables support live chart dynamic resolvers (e.g. `{{patient.nextAppointmentDate}}`, `{{doctor.name}}`) directly from EHR stores? | F-6.5 |

---

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | **Major Architecture & Flow Correction:** Removed all incorrect references to Companion. Added the complete end-to-end WhatsApp integration flow: Meta Embedded Signup in Settings > Integrations, workflow allocation in Process (enforcing 1 workflow to multiple numbers, but no single number to multiple workflows), outbound stage dispatch, inbound routing to workflow-specific prompt, and live Chats console triage with 24h window compliance and HSM templates. |
| 2026-11-10 | First version (generated stub). |
