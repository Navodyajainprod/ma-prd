---
title: "Workflow Designer Canvas & Trigger-Action Pipelines"
product: "client"
module: "workflows"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | WORKFLOWS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## 1. Module Summary
- The Workflow Designer provides an interactive node-based canvas and stage pipeline configuration for authoring automated clinical care pathways. Coordinators can connect Trigger nodes (e.g. Appointment Booked, Patient Arrived), Condition nodes (e.g. If First Visit, If High Risk), and Action nodes (e.g. Send SMS, Create Task, Generate Bill).
- **Multi-Channel Entry Points & WhatsApp Chatbot Binding**: Workflows connect directly to inbound communication channels, including specific Meta WhatsApp Business phone numbers configured in `Settings > Integrations`. When an inquiry arrives on a configured WhatsApp number, the AI chatbot agent automatically executes the specific **AI Prompt** (instructions, persona, guardrails, and intake criteria) and references the scoped **Knowledge Base (KB)** (clinical SOPs, triage protocols, pricing, and FAQs) attached to that workflow pipeline.
- Ensures strict multi-departmental separation: inquiries to a dedicated department number (e.g., Pediatrics vs. Dermatology) follow that department's workflow prompt and KB without cross-specialty data leakage.
- Documented directly from MantraAssist figma codebase specifications (`src/app/pages/Process.tsx`, `src/app/components/process/**`, and `src/lib/useStageNumberRouting.ts`).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Interactive Node Canvas & Visual Pipeline Authoring
#### 1. What it does
Provides an infinite draggable canvas with zoom controls, mini-map navigation, and drag-and-drop node palette allowing users to wire clinical automation pipelines with curved connection lines.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Drag-and-Drop Node Canvas | Visual Canvas | Interactive canvas with pan, zoom (25% - 200%), and grid snapping | Supports complex branching |
| F-1.2: Node Palette Drawer | Palette | Draggable node catalog categorized into Triggers, Conditions, Actions, and Delays | Searchable node list |
| F-1.3: Bezier Connection Wires | Wire Connector | Click and drag from node output ports to input ports with visual connection line | Validates compatible port types |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator designs post-op care flow | Drags 'Patient Checked Out' trigger, connects 'Wait 24h' delay node, connects 'Send WhatsApp Care Check' action | **Activates workflow; post-op patients automatically receive check-in message 24 hours later** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinical Coordinator | When establishing standardized care protocols, I want a visual workflow canvas, so that I can design patient follow-up pipelines without writing code. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Valid connections between trigger, condition, and action nodes execute in sequence when trigger events occur. |

---

### F-2: Multi-Channel Entry Points & WhatsApp Number Chatbot Routing (Workflow AI Prompt & KB Scoping)
#### 1. What it does
Allows practice administrators and clinical leads to bind specific inbound communication channels—specifically Meta WhatsApp Business phone numbers configured in `Settings > Integrations`—to dedicated workflow pipelines and pipeline stages.

When a patient sends an inbound WhatsApp message to a configured number:
1. **Inbound Routing Resolver**: The system identifies the receiving WhatsApp number and maps it directly to its attached workflow pipeline and initial intake stage via `useStageNumberRouting`.
2. **AI Prompt Adherence**: The chatbot agent runtime loads the **AI Prompt** configured on that workflow/stage. This prompt sets the agent's role, conversational boundaries, tone, intake questions, and safety disclaimers.
3. **Scoped Knowledge Base (KB) Retrieval**: The chatbot's retrieval-augmented generation (RAG) is strictly isolated to the Knowledge Base articles, treatment plans, clinical SOPs, and fee schedules tagged with that workflow's `processId`.
4. **Specialty & Departmental Isolation**: Clinics operating multiple WhatsApp lines (e.g., Pediatrics on `+1-555-0111`, Cosmetic Surgery on `+1-555-0222`) ensure inquiries on each number run strictly on that department's AI persona and approved clinical protocols without cross-contamination.
5. **Stage Progression & Human Escalation**: As the patient answers conversational intake questions over WhatsApp, the agent evaluates stage completion rules, advancing the patient card along the Kanban pipeline or triggering an automated escalation handover that pauses the bot and notifies clinical staff.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: WhatsApp Number Attachment Drawer | UI Drawer | Multi-select dropdown selector in Workflow Chatbot Settings allowing users to bind one or more WhatsApp Business numbers configured from Integrations | Pulls verified numbers from `getStoredWhatsAppNumbers()` |
| F-2.2: Workflow AI Prompt & System Instruction Engine | Configuration | Configurable system prompt and instructions defining chatbot behavior, conversational intake questions, tone, and clinical boundaries | Seeded into LLM runtime upon incoming session |
| F-2.3: Scoped Knowledge Base (KB) Attachment | Data Association | Binds specific Knowledge Base documents, FAQs, and protocol URLs directly to the workflow (`processId`) | Restricts semantic search retrieval exclusively to attached articles |
| F-2.4: Number-to-Workflow Routing Resolver | System Service | Real-time webhook listener and resolver mapping incoming WhatsApp messages to the attached workflow pipeline and entry stage (`useStageNumberRouting`) | Supports multiple phone numbers per clinic |
| F-2.5: In-Chat Stage Progression & Handover | Automation | Evaluates patient responses against workflow stage transition triggers; advances pipeline status and pauses bot upon escalation | Updates pipeline Kanban in real time |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic admin configures Pediatrics WhatsApp line | Opens "Pediatric Care" workflow, opens Chatbot Settings, selects WhatsApp number `+1 (555) 0111`, and attaches "Pediatric Protocols" Knowledge Base | **WhatsApp number `+1 (555) 0111` is bound to the Pediatric Care pipeline; routing table updates.** |
| 2 | Parent messages Pediatrics WhatsApp number | Sends message: "My 3-year-old has a 101F fever, what dose of acetaminophen should I give?" | **Chatbot activates with Pediatric Care prompt; retrieves dosage guidelines exclusively from Pediatric Protocols KB; responds with verified weight-based instructions and warns to seek emergency care if red flags appear.** |
| 3 | Prospective client messages Cosmetic Surgery line | Sends message to `+1 (555) 0222`: "How much is rhinoplasty consultation?" | **Chatbot routes through Cosmetic Surgery pipeline; executes aesthetic intake prompt and retrieves pricing from the Cosmetic Surgery Fee Schedule KB.** |
| 4 | Patient asks to speak with a doctor | Sends message: "I want to speak directly with an assistant" | **Chatbot detects escalation intent; workflow marks conversation as escalated, pauses the automated bot, and assigns thread to on-duty coordinator.** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Administrator | When managing multiple clinic phone numbers across specialties, I want each WhatsApp number to bind to its own workflow pipeline, so that each number automatically uses its specialized AI prompt and knowledge base. |
| F-2-J2 | Clinical Director | When configuring patient-facing chatbots, I want RAG retrieval strictly scoped to the workflow's attached knowledge base documents, so that clinical guidance cannot cross-contaminate between unrelated specialties. |
| F-2-J3 | Care Coordinator | When patients interact with the WhatsApp chatbot, I want successful intake answers to automatically advance the patient across workflow stages, so that our team has visibility on patient readiness. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a WhatsApp number configured in `Settings > Integrations`, when selected in the Workflow Chatbot Channel Drawer, the number is successfully bound to the workflow via `useStageNumberRouting`. |
| F-2-2 | Given an inbound WhatsApp message to a configured number, the AI chatbot must execute using the attached workflow's AI Prompt as its primary system instruction. |
| F-2-3 | Given an inbound query requiring clinical protocol or clinic policy answers, the chatbot must retrieve context exclusively from Knowledge Base articles scoped to that workflow's `processId`. |
| F-2-4 | Knowledge Base articles scoped to Workflow A must never be retrieved or exposed during conversations occurring on a WhatsApp number attached to Workflow B. |
| F-2-5 | When a patient completes required intake steps via WhatsApp, the workflow engine automatically transitions the patient record to the designated next pipeline stage. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Interactive Node Canvas & Visual Pipeline Authoring | F-1.1, F-1.2, F-1.3 | Provides an infinite draggable canvas with zoom controls, mini-map navigation, and drag-and-drop node palette allowing users to wire clinical automation pipelines with curved connection lines. |
| F-2 | Multi-Channel Entry Points & WhatsApp Number Chatbot Routing | F-2.1, F-2.2, F-2.3, F-2.4, F-2.5 | Binds integration WhatsApp numbers to workflows so the chatbot agent on each number adheres to the workflow's prompt and scoped Knowledge Base. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinical Coordinator | When establishing standardized care protocols, I want a visual workflow canvas, so that I can design patient follow-up pipelines without writing code. | F-1 |
| 2 | Practice Administrator | When managing multiple clinic phone numbers across specialties, I want each WhatsApp number to bind to its own workflow pipeline, so that each number automatically uses its specialized AI prompt and knowledge base. | F-2 |
| 3 | Clinical Director | When configuring patient-facing chatbots, I want RAG retrieval strictly scoped to the workflow's attached knowledge base documents, so that clinical guidance cannot cross-contaminate between unrelated specialties. | F-2 |
| 4 | Care Coordinator | When patients interact with the WhatsApp chatbot, I want successful intake answers to automatically advance the patient across workflow stages, so that our team has visibility on patient readiness. | F-2 |
