---
title: "Patient Messaging, Care Chat Bot & Care Group Hub"
product: "Companion"
module: "chat"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---


### Logs

#### Date Log
- **2026-11-10**: Baseline PRD authored based on `ma-figma` source of truth (`PatientMessagesScreen.tsx`, `PatientCareBotScreen.tsx`, `PatientGroupInfoDrawer.tsx`).
- **2026-11-10**: Renamed Care Bot to Care Chat Bot and integrated quick action shortcuts into conversation stream.
- **2026-11-10**: Specified cross-product group ingestion from Client portal and self-service "Leave Group" flow.
- **2026-11-10**: Set status to "In Review".

#### Edit Log
| Date | Section Edited | What Changed |
| :--- | :--- | :--- |
| 2026-11-10 | Header & Sections 1-3 | Migrated document structure to new feature-based PRD standard: Module Summary, Feature Requests (F-1 to F-6), and Comprehensive Summary. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Staff-Initiated Care Groups & Multi-Disciplinary Care Dispatch | When clinic staff create a Care Group in the Client workspace and add the patient as a member, the group instantly surfaces in the patient's Companion chat sidebar under "Care Groups". The patient can exchange messages, review uploaded care plans, and view member rosters without any manual invite link. | [View in Client](/client/chat) |

## 1. Module Summary
- The Companion Chat module provides patients with a privacy-first, secure mobile and desktop communications console strictly partitioning conversations into three channels: an automated Care Chat Bot with one-tap clinical shortcuts, direct 1:1 messaging with the assigned primary physician, and staff-managed Care Groups. It guarantees immediate clinical touchpoints while preserving medical privacy and clinician availability boundaries.
- Authenticated patients and their designated family caregivers use this module.
- Accessed in the Companion portal via the top navigation rail at `/patient/messages`.

## 2. Feature Requests

### F-1: Tri-Entity Patient Chat Navigation
#### 1. What it does
Strictly partitions the patient messaging navigation rail into three distinct, non-overlapping channels: Care Chat Bot (pinned at top), Primary Care Clinician (pinned second), and staff-managed Care Groups (collapsible list). Patients cannot initiate unauthorized external chats, maintaining clear clinical boundaries.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Care Chat Bot Entry | Sub-feature | Pinned top navigation item loading interactive AI assistant with shortcuts | Distinct bot avatar and AI badge |
| F-1.2: Assigned Clinician Entry | Sub-feature | Pinned direct messaging conversation with primary care doctor | Shows clinician name and specialty |
| F-1.3: Care Groups Accordion | Sub-feature | Collapsible list of active multi-disciplinary groups joined by patient | Auto-synchronized from Client portal |
| F-1.4: Unread Message Indicator | UI Badge | Monochrome unread numeric indicator next to active threads | Subtly highlights threads with new messages |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient opens Messages tab in Companion | Navigates to `/patient/messages` | **Sidebar displays Care Chat Bot, Dr. Alistair Mehta, and active "Post-Op Knee Recovery" group** |
| 2 | Patient receives doctor reply while viewing bot | Dr. Mehta sends message | **Doctor thread displays subtle unread badge and shifts indicator** |
| 3 | Patient taps on Doctor thread | Clicks Dr. Alistair Mehta in sidebar | **Viewport loads doctor consultation stream; unread badge clears** |
| 4 | Patient attempts to message unassigned physician | Looks for new message CTA in sidebar | **No direct message initiation exists; messaging is bounded to assigned clinician** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I open the messages tab, I want to clearly distinguish between automated AI help, my doctor, and my care groups, so that I communicate in the right context. |
| F-1-J2 | Caregiver | When checking on updates, I want to see which thread has new messages, so that I can respond to clinical advice promptly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given an authenticated patient, when opening `/patient/messages`, then the sidebar renders Care Chat Bot, Assigned Doctor, and active Care Groups in exact order. |
| F-1-2 | Given incoming messages, then unread indicators update in real time without requiring page refreshes. |
| F-1-3 | Given the navigation sidebar, then no option exists for patients to initiate arbitrary 1:1 threads with unassigned staff or other patients. |

### F-2: Care Chat Bot with Clinical Shortcut Actions
#### 1. What it does
Provides an interactive 24/7 automated care assistant providing instant responses for administrative and triage inquiries. Renders a grid of five one-tap clinical shortcut cards (Appointment Booking, Billing & Insurance, Medical Intake, Clinician Connection, and Visit Check-in) enabling rapid workflow navigation without typing.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Shortcut Card Grid | UI Grid | Displays 5 quick-action cards for common clinical operations | One-tap inquiry dispatch |
| F-2.2: Book Appointment Shortcut | Action | Posts booking query and renders direct CTA button to `/patient/book` | Preserves clinic schedule context |
| F-2.3: Billing & Copay Shortcut | Action | Displays current outstanding balance and deep-link to `/patient/bill` | Fetches live invoice record |
| F-2.4: Medical Intake Shortcut | Action | Surfaces required pre-consultation health forms and questionnaires | Links to WebForms module |
| F-2.5: Today's Check-in Shortcut | Action | Advances patient to `/patient/status` check-in queue screen | Active on appointment days |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient wants to book follow-up consultation | Taps "Book an Appointment" shortcut card | **Bot responds with available slots and displays "Select Timeslot" button linking to `/patient/book`** |
| 2 | Patient inquires about outstanding copay | Taps "Billing & Insurance" shortcut | **Bot displays current balance ($120.00) and direct button to settle payment** |
| 3 | Patient arrives at clinic for scheduled visit | Taps "Check in for Today's Visit" shortcut | **Bot initiates check-in verification and redirects to `/patient/status` queue** |
| 4 | Patient asks complex medical emergency question | Types: "Severe chest pain radiating to left arm" | **Bot immediately outputs urgent escalation protocol advising emergency contact (911)** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I need to schedule a visit or check my balance, I want to tap a shortcut card, so that I do not have to type lengthy messages on my phone. |
| F-2-J2 | Patient | When I have routine administrative questions after hours, I want an immediate automated reply, so that I can resolve my inquiry without waiting for office hours. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given the Care Chat Bot view, when opened, then five persistent clinical shortcut cards render prominently above the message input. |
| F-2-2 | Given a click on any shortcut card, then the inquiry is dispatched and an automated contextual reply renders within 1 second. |
| F-2-3 | Given medical emergency trigger keywords, then the bot immediately returns emergency warning protocols with priority formatting. |

### F-3: Direct Primary Clinician Messaging
#### 1. What it does
Provides an encrypted, asynchronous messaging channel between the patient and their assigned primary care physician. Supports text, document attachments, and delivery receipts, giving patients peace of mind that their clinical questions reach their doctor's desk.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Clinician Header Banner | UI Header | Displays doctor avatar, full name, specialty, and clinic affiliation | Subtle verified practitioner badge |
| F-3.2: Bi-Directional Message Stream | UI Stream | Renders patient and clinician dialogue with timestamps and read states | Formatted in chronological order |
| F-3.3: Clinician Attribution Tag | UI Tag | Clearly identifies doctor responses with name and credentials | Prevents confusion with bot replies |
| F-3.4: Operating Hours Notice | UI Notice | Surfaces clinic response time guidelines when messaging outside office hours | Manages patient reply expectations |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient asks question about prescription dosage | Types message in doctor chat and clicks Send | **Message posts with single check (sent) and updates to double check upon server ingestion** |
| 2 | Doctor reviews and answers from Client workspace | Clinician submits adjustment reply | **Message appears in patient view with "Dr. Alistair Mehta" attribution badge** |
| 3 | Patient opens doctor message | Views incoming response | **Read receipt updates to dark double check in Client clinical console** |
| 4 | Patient messages late at night | Submits query at 11:30 PM | **Notice surfaces: "Dr. Mehta typically responds during office hours (Mon-Fri 9AM-5PM)"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I have a non-urgent medical question for my physician, I want to send a secure message, so that my doctor can advise me without an in-person visit. |
| F-3-J2 | Patient | When receiving instructions from my doctor, I want to see clear practitioner attribution, so that I know the advice came directly from my licensed physician. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given an authenticated patient, when viewing the Doctor conversation, then all messages are attributed strictly to the assigned clinician and patient. |
| F-3-2 | Given an outbound message from patient, then delivery status icons display sent and delivered confirmations accurately. |
| F-3-3 | Given a doctor reply dispatched from Client, then the message renders in Companion with practitioner credential attribution. |

### F-4: Staff-Initiated Care Group Collaboration & Ingestion
#### 1. What it does
Automatically ingests and surfaces multi-party Care Groups created by clinical staff in the Client workspace. Enables patients to participate in coordinated discussions with specialists, therapists, and coordinators without requiring manual group invitation codes.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Care Group List Item | UI Item | Displays group avatar, title, latest message snippet, and unread indicator | Placed under Care Groups accordion |
| F-4.2: Real-Time Webhook Listener | Data Sync | Listens for group creation events from Client workspace matching patient ID | Populates within 500ms |
| F-4.3: Multi-Party Message Stream | UI Stream | Displays messages from multiple clinicians with individual author avatars | Full conversation transparency |
| F-4.4: Posting Restriction Evaluator | UI Logic | Enforces "Moderators Only" posting rules configured by clinic staff | Disables composer when restricted |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic staff creates "Cardio Support Circle" including Sarah | Staff submits creation drawer in Client | **Group immediately appears under "Care Groups" in Sarah's Companion sidebar** |
| 2 | Physical therapist posts rehab exercises | Therapist sends message in Client | **Message displays in Sarah's group view with therapist's name and role** |
| 3 | Moderator sets group to "Moderators Only" | Moderator toggles permission in Client | **Sarah's composer disables with notice: "Only care coordinators can post in this group"** |
| 4 | Clinic archives group after program completion | Staff archives group in Client | **Group moves to archived state and patient real-time listener disconnects** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When participating in specialized therapy, I want a single care group with all my clinicians, so that everyone stays aligned on my recovery plan. |
| F-4-J2 | Caregiver | When reading care group updates, I want to see messages from all specialists in one place, so that care coordination is effortless. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given a care group created in Client with patient ID, then the group automatically renders in Companion without manual invite links. |
| F-4-2 | Given a group with "Moderators Only" posting permissions, then the patient's message input is locked with an explanatory notice. |
| F-4-3 | Given multiple care team members participating in a group, then each message displays individual author avatar and clinical title. |

### F-5: Contextual In-Line Replies & Clinical Media Sharing
#### 1. What it does
Enables patients to cite previous clinician messages using in-line replies and upload clinical photos, lab reports, and insurance documents up to 25MB. Files are validated client-side and rendered with download previews.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Message Reply Action | UI Button | Reply button on message hover binding author and snippet to composer | Visible on patient hover/tap |
| F-5.2: Composer Reply Staging Card | UI Card | Displays quoted message preview above composer with cancel button | Dismissible via X icon |
| F-5.3: Paperclip Attachment Button | UI Button | Opens system file selector for images and PDF documents | Enforces 25MB threshold |
| F-5.4: Staged Attachment Preview | UI Chip | Shows thumbnail, filename, and file size prior to message send | Client-side validation |
| F-5.5: Secure Download Card | UI Card | Renders inline document card with secure download action | Encrypted clinical assets |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient replies to specific doctor question | Taps Reply icon on doctor's message #4 | **Composer displays reply banner quoting doctor instruction** |
| 2 | Patient sends reply with explanation | Types response and clicks Send | **Sent bubble embeds clickable quote card linking directly to message #4** |
| 3 | Patient uploads 1.8MB lab report PDF | Taps paperclip icon and selects `lab_results.pdf` | **File uploads cleanly; renders in stream with PDF icon, file size, and download link** |
| 4 | Patient attempts to upload 32MB video file | Selects 32MB video file in picker | **Upload blocked instantly; toast displays: "File exceeds 25MB limit"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Patient | When responding to a specific question from my doctor, I want to quote the question directly, so that my doctor knows which issue I am answering. |
| F-5-J2 | Patient | When I have an external lab report or photo of a rash, I want to upload it securely, so that my care team can review it before my consultation. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Given any historical message, when hovered/tapped, then a Reply action is available that attaches a quote preview to the composer. |
| F-5-2 | Given a document or image under 25MB, when attached, then a staging chip renders and the file uploads securely upon sending. |
| F-5-3 | Given any file exceeding 25MB, when selected, then upload is immediately rejected with a descriptive error notification. |

### F-6: Patient Group Information & Leave Workflow
#### 1. What it does
Provides a slide-over `PatientGroupInfoDrawer` displaying group details, care team member rosters, shared clinical files, and care tasks. Patients can independently leave groups they no longer wish to participate in.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-6.1: Group Info Header Trigger | Button | Info icon (`i`) in group header opening slide-over drawer | Right-anchored drawer |
| F-6.2: Drawer Tab Navigation | Tab Bar | Three sub-tabs: Members (roster), Files (shared documents), and Tasks | Clean segmented control |
| F-6.3: Care Team Member Roster | List | Displays names, roles, and avatars of participating clinicians and patients | Hides personal phone numbers |
| F-6.4: Shared Files Repository | List | Aggregates all PDFs and images shared in group conversation | Instant download links |
| F-6.5: Leave Group Action Button | Button | Red action button with confirmation dialog removing patient from group | Self-service departure |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient wants to check therapist's name | Taps info icon in "Rehab Group" header | **`PatientGroupInfoDrawer` slides open showing team roster with roles** |
| 2 | Patient looks for previously shared care guide | Clicks "Files" tab in group drawer | **List displays `knee_rehab_guide.pdf` with direct download link** |
| 3 | Patient discharged from program leaves group | Clicks "Leave Group" button and confirms dialog | **Patient removed from group; drawer closes and group disappears from sidebar** |
| 4 | Patient changes mind on leave confirmation | Clicks "Cancel" on leave confirmation dialog | **Leave action cancels; patient remains active member of care group** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-6-J1 | Patient | When looking for clinical guides sent weeks ago, I want to view a shared files list in the group drawer, so that I do not have to scroll through hundreds of messages. |
| F-6-J2 | Patient | When I complete a clinical program, I want to leave the group myself, so that my messaging sidebar remains clean and uncluttered. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-6-1 | Given an active Care Group, when the patient clicks the header info icon, then `PatientGroupInfoDrawer` opens showing Members, Files, and Tasks. |
| F-6-2 | Given the Files tab, then all documents uploaded in the group conversation are aggregated with secure download links. |
| F-6-3 | Given the "Leave Group" action, when confirmed by the patient, then the patient is removed from group state and redirected to the Doctor conversation. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Tri-Entity Patient Chat Navigation | F-1.1 Care Bot, F-1.2 Assigned Clinician, F-1.3 Care Groups, F-1.4 Unread Badges | Structured three-tier conversation rail separating AI bot, primary doctor, and care groups. |
| F-2 | Care Chat Bot with Clinical Shortcut Actions | F-2.1 Shortcut Grid, F-2.2 Booking, F-2.3 Billing, F-2.4 Intake, F-2.5 Check-in | 24/7 automated care assistant with five one-tap clinical shortcut cards for quick actions. |
| F-3 | Direct Primary Clinician Messaging | F-3.1 Doctor Header, F-3.2 Dialogue Stream, F-3.3 Practitioner Tag, F-3.4 Hours Notice | Secure asynchronous messaging channel between patient and assigned primary physician. |
| F-4 | Staff-Initiated Care Group Collaboration | F-4.1 Group Item, F-4.2 Real-Time Sync, F-4.3 Multi-Party Stream, F-4.4 Posting Rules | Multi-disciplinary clinical rooms automatically ingested from Client workspace creation. |
| F-5 | Contextual In-Line Replies & Media Sharing | F-5.1 Reply Action, F-5.2 Reply Banner, F-5.3 Paperclip Upload, F-5.4 Staging Chip, F-5.5 Download Card | Contextual message quoting and 25MB secure clinical document and photo sharing pipeline. |
| F-6 | Patient Group Information & Leave Workflow | F-6.1 Info Trigger, F-6.2 Drawer Tabs, F-6.3 Member Roster, F-6.4 Files List, F-6.5 Leave Group | Slide-over group info drawer with member rosters, shared file repository, and self-service departure. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | When I open the messages tab, I want to clearly distinguish between automated AI help, my doctor, and my care groups, so that I communicate in the right context. | F-1 |
| 2 | Caregiver | When checking on updates, I want to see which thread has new messages, so that I can respond to clinical advice promptly. | F-1 |
| 3 | Patient | When I need to schedule a visit or check my balance, I want to tap a shortcut card, so that I do not have to type lengthy messages on my phone. | F-2 |
| 4 | Patient | When I have routine administrative questions after hours, I want an immediate automated reply, so that I can resolve my inquiry without waiting for office hours. | F-2 |
| 5 | Patient | When I have a non-urgent medical question for my physician, I want to send a secure message, so that my doctor can advise me without an in-person visit. | F-3 |
| 6 | Patient | When receiving instructions from my doctor, I want to see clear practitioner attribution, so that I know the advice came directly from my licensed physician. | F-3 |
| 7 | Patient | When participating in specialized therapy, I want a single care group with all my clinicians, so that everyone stays aligned on my recovery plan. | F-4 |
| 8 | Caregiver | When reading care group updates, I want to see messages from all specialists in one place, so that care coordination is effortless. | F-4 |
| 9 | Patient | When responding to a specific question from my doctor, I want to quote the question directly, so that my doctor knows which issue I am answering. | F-5 |
| 10 | Patient | When I have an external lab report or photo of a rash, I want to upload it securely, so that my care team can review it before my consultation. | F-5 |
| 11 | Patient | When looking for clinical guides sent weeks ago, I want to view a shared files list in the group drawer, so that I do not have to scroll through hundreds of messages. | F-6 |
| 12 | Patient | When I complete a clinical program, I want to leave the group myself, so that my messaging sidebar remains clean and uncluttered. | F-6 |

