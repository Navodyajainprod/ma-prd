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
| **How real is it** | 0 features work, 6 are partly simulated, 0 are not built. See the legend below. Number storage and the allocation picker exist in the prototype. Meta Embedded Signup cannot complete, no workflow routes or sends WhatsApp messages, the number switcher does not filter threads and the 24-hour window is always open. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Settings > Integrations) | Meta WhatsApp Embedded Signup | Practice admins connect official WhatsApp Business Accounts (WABA) using Meta's Embedded Signup onboarding flow. Registered numbers are stored in the workspace phone pool. In the prototype a number is typed in and given a placeholder WABA id. Embedded Signup shows an error. | [View Integrations](/client/settings/integrations) |
| Client (Workflows / Process) | Number allocation & AI prompt routing | Workflows allocate active WhatsApp numbers. **Cardinality rule:** One workflow can have multiple WhatsApp numbers, but no single phone number can belong to more than one workflow. The allocation is saved on the workflow, but nothing reads it: no stage sends from the number and no inbound message is routed by it. There is no exclusivity check and no per-workflow prompt or knowledge base in the drawer. | [View Workflows](/client/workflows) |
| Client (Chats Inbox) | Omnichannel triage & number switcher | `/chats?channel=whatsapp` provides an inbox with a phone number switcher (it lists numbers but does not filter threads), unread badges, an Assign Responsible action, and template dispatch. The 24-hour window is always open. | [View Chats Inbox](/client/chat/chat) |
| Client (Clients & Contacts) | Activity timeline write-back | Inbound messages, automated AI chatbot turns, staff replies, and template dispatches are recorded on the client's Activity timeline with WhatsApp badges. | [View Clients](/client/clients) |

## 1. Module Summary

### The story in one minute

Dr. Alexander Vance connects his clinic's WhatsApp Business Account in **Settings > Integrations** using Meta's Embedded Signup flow, bringing two dedicated clinic phone lines (`+1 (555) 123-4567` and `+1 (555) 987-6543`) into the workspace.

He opens **Workflows** (`/process`) and edits the "Cataract Consultation & Surgery" workflow. In **Chatbot Channel Settings**, he enables the WhatsApp Channel and allocates both phone numbers to this workflow. The system enforces the exclusive number rule: because both numbers are now tied to this Cataract workflow, neither can be assigned to another workflow. He sets the workflow's conversational AI prompt, knowledge base, clinical triage rules, and LLM model (e.g. Gemini 2.5 Flash).

When a patient reaches an automated outreach stage (e.g. "Reach out to client" for post-op eye drop guidance), an outbound WhatsApp message is sent from the allocated clinic number. When patient Sarah Johnson replies, her incoming message hits that allocated number and routes directly to the Cataract workflow. The automated AI chatbot processes her question using the exact prompt and knowledge base configured for that workflow.

In the clinic, Care Coordinator Priya Nair opens **Chats** (`/chats?channel=whatsapp`). She uses the top-bar number switcher to filter threads by the Uptown line. Seeing Sarah's thread, she reviews the automated conversation, pauses the bot to step in personally, and sends a pre-approved Meta HSM template ("Appointment Follow-up") with full 24-hour customer care window compliance. Every exchange is automatically logged to Sarah's patient timeline.

> **As built, 2026-11-14:** the story above is the intended flow. In the prototype Alexander types the numbers in, the allocation is saved but no workflow sends or routes anything, the switcher does not filter threads and the 24-hour window never closes. See the status marks below.

### What is real and what is not

- **Real in the prototype:** Number persistence in the workspace store (`useWhatsAppNumbers`), the multi-select number picker in the Chatbot Channel Settings drawer (`ChatbotChannelDrawer.tsx`, saved on the workflow), thread list with unread counter, search, responsible staff assignment, template builder with live preview, template sending from a thread and timeline activity write-back.
- **Simulated:** A number is added by typing it; it gets a placeholder WABA id. Two sample numbers are preloaded. Messages and threads live in local storage and nothing is delivered. The number switcher lists numbers but shows every thread. The 24-hour window is computed but forced open and shows 24 hours. Template approval requests are auto-approved instantly.
- **Not built:** Meta Embedded Signup (the link needs the Facebook SDK, which is not loaded, and a backend that does not exist), exclusive allocation of a number to one workflow, per-workflow prompt and knowledge base in the drawer, outbound dispatch from a stage, inbound routing by number, any AI bot reply on WhatsApp, window expiry and the template prompt, server-side webhook receiver, delivery receipts, media attachments over 25MB, dynamic HSM template parameter validation against live patient chart variables.

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
| F-1.1: Embedded Signup Trigger | Button | Launches Meta OAuth onboarding dialog ("Launch WhatsApp Onboarding") | ○ Not built | The WhatsApp Business connect window has a link, "Or connect via Meta Embedded Signup (requires setup)". It shows "Facebook SDK not loaded" because the SDK is not loaded. The Meta config id is a placeholder and the callback endpoint does not exist |
| F-1.2: Number Registration | Data | Captures phone number, verified display name, and Meta Cloud API credentials | ◐ Simulated | **+ Add WhatsApp Number** takes only a typed number and gives it a placeholder WABA id. No verification and no Meta credentials. Stored in `whatsappTemplateIntegrations` |
| F-1.3: Number Inventory | List | Displays active WhatsApp numbers with provider status and phone IDs | ● Works | Lists each number with its WABA id and a Disconnect button. Two sample numbers are preloaded when none are stored. Consumed by `useWhatsAppNumbers` hook |
| F-1.4: Disconnect / Reconnect | Action | Revokes Meta token and releases phone numbers from the workspace pool | ◐ Simulated | Disconnect removes the number from the pool at once and shows a toast. There is no confirmation, no audit log and no Meta token to revoke. A workflow that used the number keeps it |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Setting up clinic communications | Opens Settings > Integrations, clicks **Launch WhatsApp Onboarding** | **Intended. As built, the link shows "Facebook SDK not loaded". A number is added only through + Add WhatsApp Number** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | I want to onboard our verified clinic phone numbers through Meta Embedded Signup, so that our practice can communicate legally over WhatsApp. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** Settings > Integrations, **when** the user types a number in **+ Add WhatsApp Number**, **then** it appears in the workspace number inventory with a placeholder WABA id. Meta Embedded Signup does not complete. |
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
| F-2.2: Channel Phone Numbers Multi-Select | Dropdown | Multi-select pills listing available numbers from Integrations | ● Works | Supports multiple numbers per workflow. A number can also be added inside the dropdown, which adds it to the pool. The drawer opens per stage as well as per workflow |
| F-2.3: Exclusive Allocation Rule | Validation | Prevents a phone number from being assigned to more than one workflow | ○ Not built | No check exists. The same number can be selected on any number of workflows. Decision needed: D-140 |
| F-2.4: Default Inbound Assignment | Setting | Defines primary fallback number for outbound stage triggers | ◐ Simulated | The first selected number is stored as the primary. No stage trigger reads it. Decision needed: D-139 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Configuring Cataract Workflow | Toggles WhatsApp Channel ON, selects `+1 (555) 123-4567` and `+1 (555) 987-6543` | **Both numbers are allocated to the Cataract workflow** |
| 2 | Configuring Dental Workflow | Opens Dental workflow Chatbot Settings | **Intended. As built, the two cataract numbers can still be chosen and no warning shows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | I want to dedicate specific phone numbers to specific clinical workflows, so that patient inquiries are routed to the correct clinical process without collision. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a workflow's Chatbot Channel Settings, **when** WhatsApp is enabled, **then** the user can allocate one or more registered WhatsApp numbers. |
| F-2-2 | **Given** a phone number already allocated to Workflow A, **then** it can also be selected on Workflow B. No exclusivity rule is enforced. |

---

### F-3: Workflow-Driven Inbound & Outbound Chatbot Execution

#### 1. What it does
When a workflow stage triggers an outbound message to a client (e.g., "Client reach out to us / Reach out to client"), the message is dispatched from the workflow's allocated WhatsApp number. Conversely, when an inbound message arrives at an allocated number, it routes to that workflow, and the AI chatbot executes the specific prompt, knowledge base, and instructions configured for **that Workflow**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Outbound Stage Dispatch | Action | Dispatches stage communication from the allocated WhatsApp number | ○ Not built | No stage action sends a WhatsApp message and nothing reads the saved numbers. Decision needed: D-139 |
| F-3.2: Inbound Number Routing | Router | Inbound webhook matches recipient phone number to its dedicated workflow | ○ Not built | No webhook and no routing by number. Decision needed: D-140 |
| F-3.3: Workflow Prompt Execution | AI Engine | Chatbot replies according to the workflow's prompt, clinical guidelines, and model | ○ Not built | The drawer holds a bot model, a welcome message and an auto-create switch. It has no prompt and no knowledge base field, and no WhatsApp reply is generated |
| F-3.4: Auto-Create Client on First Message | Rule | Optional setting in drawer to create patient record from WhatsApp sender ID | ◐ Simulated | `autoCreateClient` toggle is saved with the settings. No inbound message ever reaches it |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient reaches post-op stage | Stage trigger activates | **Intended. As built, no WhatsApp message is sent** |
| 2 | Sarah Johnson replies: "Can I shower after surgery?" | Message arrives on `+1 (555) 123-4567` | **Intended. As built, nothing routes the message and no bot answers** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | I want our conversational AI bot to follow the specialized clinical prompt of the relevant workflow, so that patients receive clinically accurate guidance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an automated outbound stage, **then** no WhatsApp message is dispatched from the allocated number. |
| F-3-2 | **Given** an inbound message to a clinic WhatsApp number, **then** it is not routed to a workflow and no bot reply is generated. |

---

### F-4: WhatsApp Threads & Number Switcher in Chats Console

#### 1. What it does
In **Chats** (`/chats?channel=whatsapp`), staff see live WhatsApp threads across the practice. The top-bar number switcher allows filtering threads by specific clinic lines. Staff can read messages, reply manually, take over from the AI bot, and view unread notification badges.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: WhatsApp Thread List | List | Lists threads with patient name, phone, snippet, timestamp, unread badge | ● Works | Synced in local store |
| F-4.2: Number Switcher | Dropdown | Filters the thread list by allocated clinic WhatsApp number | ◐ Simulated | The dropdown lists the stored numbers and the numbers on sample threads, and shows the chosen one. The thread list ignores it and shows every thread. Populated from `useWhatsAppNumbers` |
| F-4.3: Unread Badges | Indicator | Numeric counter on unread incoming WhatsApp messages; clears on open | ● Works | Clears when the thread is opened |
| F-4.4: Staff Bot Takeover | Action | Assigning a staff member or typing manually pauses automated bot replies | ◐ Simulated | Gear menu → **Assign Responsible** sets the responsible person. No bot replies on WhatsApp threads, so nothing is paused. The Pause Care Bot item exists only on the Companion thread |
| F-4.5: Search & Filter | Search | Searches patient names, phone numbers, and message content | ● Works | Real-time text search |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator Priya arrives for shift | Opens Chats, selects WhatsApp channel and filters by Downtown line | **Intended. As built, the number is shown but every WhatsApp thread stays listed** |
| 2 | Patient asks for human assistance | Priya types a message and assigns herself | **Priya is set as responsible. No bot was running on the thread** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Care Coordinator | When managing multiple practice locations, I want to filter WhatsApp threads by phone number, so that I focus on my assigned facility. |
| F-4-J2 | Care Coordinator | When a patient needs complex clinical triage, I want to take over from the AI bot seamlessly, so that the patient receives personal care. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** `/chats?channel=whatsapp`, **when** a number is selected in the number switcher, **then** the number is shown and the thread list does not change. |
| F-4-2 | **Given** an active thread, **when** staff assign a team member, **then** that person is shown as responsible. No bot is paused. |

---

### F-5: Meta 24-Hour Customer Care Window Compliance

#### 1. What it does
Under Meta policy, businesses can exchange freeform messages with patients only within 24 hours of the patient's last inbound message. Once the 24-hour service window closes, freeform messaging is restricted, and staff must send an approved Meta HSM template message to re-engage the patient.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: 24h Window Calculation | Rule | Computes elapsed time since the latest inbound message timestamp | ◐ Simulated | The elapsed time is computed, but expiry is switched off in code: the window is always open and always reports 24 hours (G4-W-06) |
| F-5.2: Service Window Countdown | Indicator | Visual indicator above composer showing remaining time in the active window | ◐ Simulated | The client Activity tab shows "Reply window: 24h 0m left", always the same value. Nothing shows above the Chats composer |
| F-5.3: Window Expiry Notification | Banner | Informs staff when the 24h window has expired and prompts template usage | ○ Not built | Target design |
| F-5.4: Automatic Window Reset | Rule | Patient reply immediately resets the 24-hour customer care timer | ◐ Simulated | The last inbound message is used for the calculation, but the window never expires, so a reset has no visible effect |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient replied 2 hours ago | Staff opens thread | **Window is active; freeform messaging and attachments permitted** |
| 2 | Patient last replied 3 days ago | Staff attempts to message | **Intended. As built, the freeform message is sent and no template prompt shows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | I want the system to observe Meta's 24-hour messaging window, so that our clinic avoids Meta Cloud API carrier blocks and penalties. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** any WhatsApp thread, **then** freeform messages are always allowed. |
| F-5-2 | **Given** a thread whose last inbound message is days old, **then** freeform sending is still allowed and no template is required. A template can still be sent through **Share Template Message**. |

---

### F-6: Meta HSM Template Library & Composer Sender

#### 1. What it does
Provides a library of pre-approved Meta HSM (Highly Structured Message) templates at `/chats?tab=templates`. Staff can build new templates with parameter mapping (`{{1}}`, `{{2}}`), copy from a starter library, and submit for approval. In any WhatsApp thread, staff can click **Share Template Message** to send an approved template directly into the conversation.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-6.1: Template Library Management | Table | Lists templates with category, language, approval status, and actions | ● Works | Stored in browser store |
| F-6.2: Template Builder Drawer | Drawer | Visual builder with parameter mapping and real-time WhatsApp bubble preview | ● Works | |
| F-6.3: Starter Templates | Catalog | Pre-built healthcare templates (Appointment Reminder, Lab Result Ready, Intake Form) | ○ Not built | No starter catalog with one-click copy was found. Three templates are preloaded in the library: Appointment Reminder, Booking Confirmation, Post-Consultation Feedback |
| F-6.4: Request Meta Approval | Action | Submits template to Meta for category and content verification | ◐ Simulated | Auto-approved in prototype |
| F-6.5: Share Template Message | Modal | Modal in chat composer allowing immediate template selection and dispatch | ● Works | Resolves variables or defaults to "there" |
| F-6.6: Activity Write-back | Event | Sent template is automatically logged to the patient's Client Activity Timeline | ● Works | Logged with WhatsApp tag |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff wants to re-engage Sarah Johnson | Staff clicks gear → **Share Template Message** → selects "Appointment Follow-up" | **Approved template dispatches to Sarah's WhatsApp; entry logs in Client Timeline** |
| 2 | Sarah replies: "Yes, I will be there" | Sarah sends message | **Staff can converse freely. The window was never closed in the prototype** |

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
| F-1 | Number Onboarding (Integrations) | F-1.1 – F-1.4 | ● / ◐ / ○ | Numbers are typed in with a placeholder WABA id. Embedded Signup does not work. |
| F-2 | Workflow Number Allocation | F-2.1 – F-2.4 | ● / ◐ / ○ | Multi-select numbers per workflow is saved. The one-workflow-per-number rule is not enforced. |
| F-3 | Workflow Chatbot Execution | F-3.1 – F-3.4 | ◐ / ○ | No outbound dispatch, inbound routing or prompt execution exists. |
| F-4 | WhatsApp Threads & Switcher | F-4.1 – F-4.5 | ● / ◐ | Threads, unread badges and search work. The switcher does not filter and no bot is paused. |
| F-5 | 24-Hour Service Window | F-5.1 – F-5.4 | ◐ / ○ | The window is computed but always open; no expiry banner. |
| F-6 | Template Library & Sender | F-6.1 – F-6.6 | ● / ◐ / ○ | Builder, auto-approval, composer dispatch and timeline write-back work; no starter catalog. |

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
| **System Admin / Practice Admin** | Add numbers in Settings > Integrations, pick numbers per workflow in Process, set the bot model and welcome message, create and approve HSM templates. | Nothing |
| **Care Coordinator / Clinical Staff** | Reply to patients in `/chats?channel=whatsapp`, assign a responsible person, dispatch approved templates. | Not blocked by any rule: only the System Admin role opens Settings and Process, but Chats has no finer control |
| **Signed-out visitor** | Nothing (redirected to sign-in) | Everything |

---

## 5. Metrics and definitions

| Metric | Definition | Benchmark / Formula |
| :--- | :--- | :--- |
| **Active WhatsApp Lines** | Count of registered Meta Cloud API phone numbers currently allocated to workflows. | Not computed anywhere in the prototype. |
| **24h Window Adherence** | Percentage of outbound communications sent within the active window or via approved templates. | Not computed. Target: 100% compliance to avoid carrier blocking. |
| **AI Bot Resolution Rate** | Percentage of inbound WhatsApp interactions resolved by the workflow AI bot without staff takeover. | Not computed. Industry benchmark: >70%. |
| **Template Delivery Rate** | Percentage of Meta HSM templates successfully delivered to patient handsets. | Not computed. Target: >98%. |

---

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| **Onboarding & Channel Setup** | Settings > Integrations → Workflows | Admin connects numbers via Meta Embedded Signup. Numbers become available in Workflows. Admin allocates numbers to a workflow with exclusive assignment. |
| **Automated Clinical Outreach** | Workflow Stage Trigger → Patient WhatsApp | Workflow reaches an outbound communication stage ("Reach out to client"). Message is dispatched from the workflow's allocated WhatsApp number. |
| **Inbound Patient Inquiry** | Patient WhatsApp → Workflow Chatbot | Patient replies. System routes to the allocated workflow, and the AI chatbot responds following that workflow's specific prompt. |
| **Live Staff Triage & Takeover** | Chats Console → Patient WhatsApp | Staff views thread in `/chats?channel=whatsapp`, filters by phone line, pauses bot, replies manually, or sends an approved HSM template. |
| **Audit & Record Keeping** | WhatsApp Exchange → Client Profile | Every inbound message, bot turn, staff response, and template is archived to the patient's Client Activity Timeline. |

> **As built:** the first four journeys below are intended flows. Only the staff triage in Chats and the timeline write-back run in the prototype, and neither uses the allocated numbers.

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
| 2026-11-14 | Updated to the prototype changes of 2026-11-13 and 2026-11-14 (status marks checked against the code: Embedded Signup, exclusive allocation, routing, prompt, number filter and the always-open 24-hour window downgraded). |
| 2026-11-14 | **Major Architecture & Flow Correction:** Removed all incorrect references to Companion. Added the complete end-to-end WhatsApp integration flow: Meta Embedded Signup in Settings > Integrations, workflow allocation in Process (enforcing 1 workflow to multiple numbers, but no single number to multiple workflows), outbound stage dispatch, inbound routing to workflow-specific prompt, and live Chats console triage with 24h window compliance and HSM templates. |
| 2026-11-10 | First version (generated stub). |
