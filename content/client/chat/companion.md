---
title: "Companion Channel: Care Groups, Process-Driven AI Bot & Portal Sync"
product: "Client"
module: "chat"
channel: "companion"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | Client |
| Module | Chats & Care Groups - Companion Channel (`/chats?channel=companion`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Care Group Auto-Ingestion & Process Automation | Care Groups created in the Client workspace instantly surface in the patient's Companion portal under "Care Groups". Patient messages and automated AI triage responses route bi-directionally between staff in Client and patients in Companion. | [View in Companion](/companion/chat) |

## 1. Module Summary
- The Companion Channel within Client Chats manages secure bi-directional communication between clinic staff and registered patients active on the Companion web and mobile portal. It supports 1:1 doctor-patient consultations, multi-party multidisciplinary Care Groups, and a process-driven AI Care Bot that evaluates patient inquiries against clinical workflow processes (Appointment Booking, Invoicing, Health Intake, Arrival Check-in) to deliver immediate automated resolutions.
- Primary care physicians, specialists, care coordinators, and medical assistants use this module.
- Accessed in the Client workspace via Chats & Care Groups > Companion.

## 2. Feature Requests

### F-1: Multi-Party Clinical Care Group Creation (Exclusive Topbar Action)
#### 1. What it does
Provides clinical care teams with the exclusive ability to assemble and moderate multi-party Care Groups comprising patients, designated family caregivers, primary care doctors, and medical specialists. Group creation is strictly scoped to the Companion channel, and created groups automatically propagate to the patient's Companion portal within 500ms.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: "New Group" Topbar CTA | Button | Topbar button launching the Create Group slide-over drawer | Exclusively visible on Companion channel |
| F-1.2: Create Group Drawer | UI Drawer | Collects Group Name, Description, Group Type, Member Roster, and Moderators | Slide-over drawer |
| F-1.3: Staff Moderator Enforcement | Logic | Requires at least one licensed staff moderator before submission | Prevents unmoderated patient groups |
| F-1.4: Real-Time Companion Ingestion | Data Sync | Synchronizes newly created group with patient's Companion portal | Automatic webhook dispatch |
| F-1.5: Posting Permissions Control | Setting | Restricts message composing to "Moderators Only" or "All Members" | Configurable in group header |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff views Companion channel topbar | Filters to Companion channel | **"New Group" button appears prominently in topbar; absent on other channels** |
| 2 | Coordinator creates "Post-Op Knee Recovery" group | Clicks "New Group", enters name, selects patient Sarah and Dr. Mehta | **Group created with ID `grp-101`; immediately visible in Client and Sarah's Companion portal** |
| 3 | Staff attempts to submit with no moderator | Deselects all staff members and clicks submit | **Validation blocks submission and displays: "At least one Staff Moderator is required"** |
| 4 | Moderator restricts posting to "Moderators only" | Opens Group Settings and toggles posting permission | **Patient composer in Companion portal disables with notice: "Only care coordinators can post"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When assembling a multidisciplinary team for a patient, I want to create a shared Care Group directly from the Companion channel topbar, so that all clinical specialists and the patient collaborate in one thread. |
| F-1-J2 | Staff Moderator | When broadcasting clinical updates, I want to restrict posting to moderators only, so that critical instructions are not drowned out by extraneous messages. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given the Chats page, when on the Companion channel, then the "New Group" action button is exclusively visible in the top bar. |
| F-1-2 | Given a valid Care Group submission, then the group is created and propagated to the patient's Companion portal within 500ms. |

### F-2: Process-Driven AI Care Bot & Interactive Clinical Shortcuts
#### 1. What it does
Powers the Companion AI Care Chat Bot that triages patient requests 24/7. When a patient taps a requirement or types an inquiry, the AI analyzes the request, identifies the underlying clinical workflow process (e.g. Appointment Booking, Billing & Invoicing, Medical Intake Assessment, Arrival Check-in), delivers tailored instructions, and surfaces interactive shortcut cards linking directly to the corresponding portal workflow.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Process Intent Classifier | Logic | Identifies the target practice process from patient message or requirement choice | Real-time classification |
| F-2.2: Process-Tailored Response | Generator | Returns clinical explanations matching the identified process workflow | Accurate care advice |
| F-2.3: Actionable Portal Shortcuts | UI Card | Surfaces deep-link buttons (`/patient/book`, `/patient/bill`, `/patient/forms`, `/patient/status`) | One-tap workflow launch |
| F-2.4: Emergency Escalation Safety | Logic | Detects emergency keywords (chest pain, shortness of breath) and triggers emergency disclaimers (911) | Immediate clinical escalation |

#### 3. Worked example
| # | Situation | What the patient does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient selects "Book Consultation" requirement | Taps shortcut in Companion bot | **AI identifies "Appointment Booking" process; replies: "I've routed your request to our Booking process" and renders "Open Booking Slots" button** |
| 2 | Patient asks: "What is my outstanding copay balance?" | Types billing inquiry | **AI identifies "Billing & Invoicing" process; displays outstanding balance and renders "View & Pay Invoices" button linking to `/patient/bill`** |
| 3 | Patient asks: "Where do I submit my pre-visit health history?" | Types intake inquiry | **AI identifies "Medical Intake Assessment" process; displays forms notice and renders "Complete Forms" button linking to `/patient/forms`** |
| 4 | Patient texts: "I've arrived at the office" on appointment day | Sends check-in message | **AI identifies "Visit Check-in" process; marks arrival queue status and displays confirmation notice** |
| 5 | Patient types: "Severe chest pain radiating to arm" | Types emergency query | **AI immediately triggers emergency priority protocol: "Please call 911 immediately or proceed to the nearest emergency room."** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I have questions after office hours, I want instant answers that route directly to the right clinic process, so that I can schedule visits or settle bills without waiting. |
| F-2-J2 | Practice Administrator | When patients use the Companion portal, I want routine inquiries automatically resolved via identified processes, so that phone volume to front desk staff is minimized. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a patient inquiry matching a practice process, then the AI Care Bot identifies the process and outputs the corresponding tailored response. |
| F-2-2 | Given a process-identified response, then an interactive shortcut button linking to the target portal page is rendered. |
| F-2-3 | Given emergency symptom keywords, then emergency warning protocols take immediate priority over routine process routing. |

### F-3: Companion Settings Drawer & Requirement-to-Process Mapping
#### 1. What it does
Provides administrative controls for the Companion channel through a dedicated "Companion Settings" drawer accessed via the topbar gear icon. Administrators configure Requirement to Process Mapping (associating patient intake choices with target workflows), auto-responder behavior, and working time preferences.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Companion Settings Topbar Button | Button | Gear cog icon in Companion topbar opening the slide-over settings drawer | 36x36px icon button |
| F-3.2: Requirement to Process Mapping | Table | Maps patient requirement options (e.g. "Booking", "Billing") to target practice processes | Dropdown per requirement |
| F-3.3: AI First Responder Toggle | Toggle | Toggles AI Care Bot as primary first responder or direct human routing | Configurable per practice |
| F-3.4: Working Time Preferences | Settings | Configures business hours, weekend rules, and out-of-office automated notifications | Timezone aware |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin clicks Companion Settings in topbar | Clicks settings cog on Companion channel | **Companion Settings drawer slides open displaying Requirement Mapping and Preferences** |
| 2 | Admin maps "Physical Therapy Intake" to "Rehab Intake" process | Selects "Rehab Intake" in process dropdown and saves | **Mapping persists; when patients choose Physical Therapy, AI maps inquiry to Rehab Intake** |
| 3 | Admin toggles AI First Responder ON | Flips toggle to ON | **AI Care Bot handles initial patient touchpoint across Companion channel** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Administrator | When configuring the patient portal, I want to map patient choices to exact back-office processes, so that intake and booking workflows execute automatically. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given the Companion channel topbar, then the Companion Settings cog button is visible. |
| F-3-2 | Given the Companion Settings drawer, then Requirement to Process Mapping allows administrators to map each option to a specific organizational process. |

### F-4: Secure Clinical Media & Contextual Message Quoting
#### 1. What it does
Enables clinicians and patients to share clinical documents (lab results, radiology scans, post-op instructions) up to 25MB and cite previous messages with in-line quote replies. Messages feature delivery status tracking (sent, delivered, read receipts).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Attachment Sharing Pipeline | File Upload | Supports PDF, PNG, JPG uploads with 25MB size enforcement | Client-side validation |
| F-4.2: In-Line Message Quoting | Action | Quote reply banner linking back to referenced message bubble | Deep-link scroll navigation |
| F-4.3: Real-Time Read Receipts | UI Indicator | Monochrome status glyphs showing when message was delivered and read | Timestamp hover tooltips |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinician attaches 4.2MB knee MRI report | Drops PDF into composer | **Upload completes; document card renders in thread with file size and download link** |
| 2 | Clinician replies to specific patient question | Clicks Reply icon on patient message #3 | **Sent message displays quote preview card deep-linking back to message #3** |
| 3 | Patient opens message in Companion portal | Patient views conversation | **Read receipt updates to dark double check in Client clinical console** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinician | When discussing lab results with a patient, I want to attach PDF documents and quote questions directly, so that patient communication is precise and well-documented. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given clinical attachments under 25MB, then files upload securely with download cards. |
| F-4-2 | Given a message reply, then a quote banner links back to the original message in thread. |

### F-5: Scoped Composer Controls & In-Line Responsible Assignment
#### 1. What it does
Streamlines clinical conversation controls on the Companion channel by removing the topbar assignment button and moving Care Bot pause/resume controls and responsible team member assignment into the composer gear menu. Eliminates external message templates on Companion and renders a clean, concise popup directly above the gear box scoped strictly to the organization's team members.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Topbar Assign Removal | UI Scoping | Removes the topbar `Unassigned` / `Bot Active` button on Companion conversations | Cleaner top header |
| F-5.2: Care Bot Pause / Resume Action | Control | Toggles Care Bot active/paused status directly inside the composer gear menu | Shows Active/Paused badge |
| F-5.3: Template Option Removal | Scoping | Hides the "Share Template Message" option on the Companion channel | Templates are SMS/WhatsApp only |
| F-5.4: Concise Responsible Popup | UI Popover | Renders a small, clean popover directly above the gear box | Positioned right above gear icon |
| F-5.5: Team Member-Only Selection | Data Scoping | Scopes assignable responsible persons strictly to organization team members | Excludes bots and non-org users |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff inspects Companion chat header | Opens patient Companion conversation | **Topbar shows contact name and phone; the `Unassigned` button is absent** |
| 2 | Staff wants to pause automated bot replies | Clicks gear icon in composer and taps "Pause Care Bot" | **Care Bot pauses; status pill updates to "Paused" and toast confirms "Care Bot paused"** |
| 3 | Staff wants to assign doctor to thread | Clicks gear icon and selects "Assign Responsible" | **Clean, concise popup opens directly above the gear box listing organization team members** |
| 4 | Staff selects "Dr. Akshita Sharma" | Clicks Dr. Akshita Sharma in member list | **Responsible updates to Dr. Akshita Sharma; bot pauses automatically; toast confirms assignment** |
| 5 | Staff unassigns responsible | Clicks "Unassigned" option in popup | **Responsible is cleared; toast confirms "Conversation unassigned"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Care Coordinator | When taking over a patient conversation from the Care Bot, I want to pause the bot and assign a clinician from a concise popup above the composer, so that I can manage routing without leaving the chat stream. |
| F-5-J2 | Practice Administrator | When assigning responsibles on Companion, I want member choices restricted strictly to our organization team members, so that patient threads cannot be routed to arbitrary external contacts. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Given a Companion conversation, when viewed, then the topbar assignment button is hidden. |
| F-5-2 | Given the composer gear menu on Companion, then the template sharing option is hidden. |
| F-5-3 | Given the composer gear menu on Companion, then a toggle option allows staff to pause and resume the Care Bot. |
| F-5-4 | Given the "Assign Responsible" action, then a concise popup renders directly above the gear box. |
| F-5-5 | Given the responsible member list, then only verified organization team members and an "Unassigned" option are selectable. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Multi-Party Care Group Creation | F-1.1 New Group CTA, F-1.2 Create Drawer, F-1.3 Staff Moderator, F-1.4 Real-Time Ingestion, F-1.5 Posting Permissions | Companion-exclusive New Group button launching multidisciplinary care team creation drawer. |
| F-2 | Process-Driven AI Care Bot & Shortcuts | F-2.1 Intent Classifier, F-2.2 Process Response, F-2.3 Action Shortcuts, F-2.4 Emergency Escalation | AI bot evaluating practice processes (Booking, Billing, Intake, Check-in) and returning interactive shortcuts. |
| F-3 | Companion Settings & Requirement Mapping | F-3.1 Settings Button, F-3.2 Requirement Mapping, F-3.3 AI Responder Toggle, F-3.4 Working Hours | Dedicated settings drawer mapping client requirement choices to organizational workflow processes. |
| F-4 | Secure Clinical Media & Contextual Quoting | F-4.1 Attachment Pipeline, F-4.2 In-Line Quoting, F-4.3 Read Receipts | 25MB clinical document exchange, in-thread quote replies, and delivery status tracking. |
| F-5 | Scoped Composer Controls & In-Line Responsible Assignment | F-5.1 Topbar Removal, F-5.2 Bot Pause/Resume, F-5.3 Template Removal, F-5.4 Concise Popup, F-5.5 Org Team Members | In-composer Care Bot pause/resume and concise popup above gear box for assigning organization team members. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | When assembling a multidisciplinary team for a patient, I want to create a shared Care Group directly from the Companion channel topbar, so that all clinical specialists and the patient collaborate in one thread. | F-1 |
| 2 | Staff Moderator | When broadcasting clinical updates, I want to restrict posting to moderators only, so that critical instructions are not drowned out by extraneous messages. | F-1 |
| 3 | Patient | When I have questions after office hours, I want instant answers that route directly to the right clinic process, so that I can schedule visits or settle bills without waiting. | F-2 |
| 4 | Practice Administrator | When patients use the Companion portal, I want routine inquiries automatically resolved via identified processes, so that phone volume to front desk staff is minimized. | F-2 |
| 5 | Practice Administrator | When configuring the patient portal, I want to map patient choices to exact back-office processes, so that intake and booking workflows execute automatically. | F-3 |
| 6 | Clinician | When discussing lab results with a patient, I want to attach PDF documents and quote questions directly, so that patient communication is precise and well-documented. | F-4 |
| 7 | Care Coordinator | When taking over a patient conversation from the Care Bot, I want to pause the bot and assign a clinician from a concise popup above the composer, so that I can manage routing without leaving the chat stream. | F-5 |
| 8 | Practice Administrator | When assigning responsibles on Companion, I want member choices restricted strictly to our organization team members, so that patient threads cannot be routed to arbitrary external contacts. | F-5 |

### Open Items
- To confirm: Should patients who leave a Care Group via the Companion portal be allowed to re-join without a staff invite?
- To confirm: How are multi-practitioner assignment notifications routed if more than two clinicians are tagged in a Care Group?

