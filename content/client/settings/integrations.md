---
title: "Third-Party Integrations, Twilio SIP & Webhooks"
product: "client"
module: "settings"
channel: "integrations"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS |
| Channel | INTEGRATIONS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## 1. Module Summary
- The Integrations tab manages external service connections: Twilio SIP Telephony credentials, Meta WhatsApp Business API tokens, Stripe Connect payment gateway keys, and outbound custom webhook dispatchers.
- **WhatsApp Phone Numbers & Workflow Binding**: Verified WhatsApp Business numbers configured under the Meta integration automatically sync into the clinic's active phone inventory. Each number can be attached to a specific clinical or administrative workflow pipeline so that its AI chatbot follows the workflow's designated AI prompt and scoped Knowledge Base articles.
- Documented directly from MantraAssist figma codebase specifications (`src/app/pages/Settings.tsx`, `src/lib/useWhatsAppNumbers.ts`, and `src/lib/useStageNumberRouting.ts`).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Twilio Telephony & Meta WhatsApp API Credential Binding
#### 1. What it does
Stores API credentials and verifies connectivity for carrier telecom trunks (Twilio Account SID, Auth Token) and Meta WhatsApp Cloud API (WABA ID, Access Token).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Twilio SIP Connection Card | Config Card | Input fields for Account SID, Auth Token, and default Caller ID phone number | Includes 'Test Connection' button |
| F-1.2: Meta WhatsApp Cloud Card | Config Card | Input fields for WABA ID, Phone Number ID, and Permanent System Token | Verifies Meta webhook handshake |
| F-1.3: Connection Status Indicator | UI Badge | Displays live 'Connected' (green) or 'Disconnected' (red) ping status | Diagnostic error tooltips |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin enters Twilio credentials | Pastes SID and Auth Token, clicks 'Test Connection' | **System verifies SIP trunk and displays green 'Connected' badge with active phone numbers** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Administrator | When connecting our telephony, I want real-time API connection testing, so that I can verify call routing before going live. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given valid Twilio credentials, testing connection returns HTTP 200 and displays green connected badge. |

---

### F-2: WhatsApp Phone Numbers Inventory & Workflow Chatbot Binding
#### 1. What it does
Maintains an inventory of all verified WhatsApp Business phone numbers connected via the Meta Cloud API integration. Each number can be assigned to a specific workflow pipeline and entry stage (`useStageNumberRouting`). Inbound inquiries received on any configured number automatically execute with the specific **AI Prompt** and scoped **Knowledge Base (KB)** of the workflow attached to that number.

This enables practices to deploy distinct departmental lines (e.g. Appointments line, Billing inquiry line, Specialty care lines) with dedicated AI agents adhering to specialized clinical instructions and isolated Knowledge Base documentation without cross-specialty confusion.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: WhatsApp Phone Number Inventory | Number List | Displays list of verified Meta phone numbers with display labels and status | Managed via `useWhatsAppNumbers` |
| F-2.2: Workflow Attachment Resolver | Routing Mapper | Maps each phone number to a designated target workflow process and stage | Synchronized via `useStageNumberRouting` |
| F-2.3: Prompt & KB Inheritance Indicator | UI Card | Indicates which AI Prompt and Knowledge Base collections are bound to each phone number via its attached workflow | Provides clear visibility of active bot persona |
| F-2.4: Departmental Isolation Enforcement | Runtime Guard | Restricts AI RAG retrieval to the Knowledge Base articles tagged with the attached workflow's `processId` | Prevents clinical data bleeding across lines |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin reviews connected WhatsApp numbers | Navigates to Settings > Integrations > WhatsApp Numbers | **Views list: +1-555-0111 (Assigned to Pediatrics Workflow) and +1-555-0222 (Assigned to Dermatology Workflow)** |
| 2 | Inbound message to +1-555-0111 arrives | Patient asks about child vaccination schedule | **Chatbot executes with Pediatrics AI prompt and queries Pediatrics KB; answers accurately with pediatric vaccination timeline.** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Administrator | When setting up our clinic's WhatsApp integration, I want to route distinct numbers to dedicated workflows, so that each number's chatbot follows that workflow's prompt and knowledge base. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Configured WhatsApp numbers from Meta API are populated in the system's number inventory. |
| F-2-2 | Each WhatsApp number can be mapped to an individual workflow pipeline and stage. |
| F-2-3 | Inbound messages to a WhatsApp number execute using the attached workflow's AI prompt and scoped KB documents. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Twilio Telephony & Meta WhatsApp API Credential Binding | F-1.1, F-1.2, F-1.3 | Stores API credentials and verifies connectivity for carrier telecom trunks (Twilio Account SID, Auth Token) and Meta WhatsApp Cloud API (WABA ID, Access Token). |
| F-2 | WhatsApp Phone Numbers Inventory & Workflow Chatbot Binding | F-2.1, F-2.2, F-2.3, F-2.4 | Manages verified WhatsApp numbers and binds them to workflow pipelines so each chatbot agent adheres to the workflow's prompt and scoped KB. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Administrator | When connecting our telephony, I want real-time API connection testing, so that I can verify call routing before going live. | F-1 |
| 2 | Practice Administrator | When setting up our clinic's WhatsApp integration, I want to route distinct numbers to dedicated workflows, so that each number's chatbot follows that workflow's prompt and knowledge base. | F-2 |
