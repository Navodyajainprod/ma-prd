---
title: "Unified Omnichannel Chat & Care Team Collaboration"
product: "Client"
module: "chat"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---


### Logs

#### Date Log
- **2026-11-10**: Baseline PRD authored based on `ma-figma` source of truth (`Chats.tsx`, `CreateGroupChatDrawer.tsx`, `useConversations.ts`).
- **2026-11-10**: Scoped New Group button strictly to the Companion channel top bar.
- **2026-11-10**: Removed Message Actions & Settings button specifically on the Website channel.
- **2026-11-10**: Set status to "In Review".

#### Edit Log
| Date | Section Edited | What Changed |
| :--- | :--- | :--- |
| 2026-11-10 | Header & Sections 1-3 | Migrated document structure to new feature-based PRD standard: Module Summary, Feature Requests (F-1 to F-5), and Comprehensive Summary. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Multi-Party Care Groups & Direct Clinician Communication | Any Care Group created in MantraAssist Client that includes a patient contact is automatically surfaced in that patient's Companion chat navigation drawer under active groups. The patient can participate, view attachments, and review clinician responses in real time. | [View in Companion](/companion/chat) |

## 1. Module Summary
- The Client Chat module provides a unified omnichannel messaging console consolidating 1:1 patient conversations across WhatsApp, SMS, Website, Email, and Companion channels alongside staff-moderated care groups. It enables clinicians and support coordinators to triage inbound inquiries, share clinical records, and collaborate within multi-disciplinary teams without message fragmentation.
- Primary clinical staff, care coordinators, practice administrators, and triage agents use this module.
- Accessed in the Client workspace via the main navigation bar at `/chats`.

## 2. Feature Requests

### F-1: Omnichannel Thread Aggregation & Channel Filtering
#### 1. What it does
Aggregates incoming and ongoing messages across WhatsApp, SMS, Website widgets, inbound email, and the patient Companion portal into a single synchronized inbox. Staff can switch views between all messages or isolate a specific transport channel using horizontal channel filter pills.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Thread List Stream | Sub-feature | Renders recent conversations ordered descending by last message timestamp with delivery badges and unread counters | Click loads message history in center pane |
| F-1.2: Channel Filter Tabs | Control | Filters visible threads by transport channel (All, WhatsApp, SMS, Website, Email, Companion) | Retains search query when switching |
| F-1.3: Thread Search Bar | Input | Filters conversation threads by patient contact name, phone number, or recent snippet text | Real-time substring matching |
| F-1.4: Responsible Assignment | Setting | Assigns thread responsibility to a designated clinician or team member | Updates `responsible` identity |
| F-1.5: Bot Assignment Toggle | Setting | Toggles automated triage bot or AI assistant response mode | Fallback to human upon escalation |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient Sarah Johnson sends question via SMS | Clinician views thread list | **Sarah's thread moves to top with SMS indicator and unread message counter** |
| 2 | Staff only wants to inspect patient portal inquiries | Clinician clicks "Companion" channel filter tab | **List filters strictly to Companion threads; WhatsApp and SMS threads are hidden** |
| 3 | Staff enters "Johnson" in thread search box | Staff types query into search input | **List filters to matching patient name with matching text highlighted** |
| 4 | Thread assigned to off-duty clinician | Coordinator reassigns thread to Dr. Alistair Mehta | **Conversation badge updates and Dr. Mehta receives notification alert** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When multiple patient inquiries arrive across channels, I want to view them in a single unified thread list, so that no patient message is overlooked. |
| F-1-J2 | Clinician | When focusing on patient portal queries, I want to filter the inbox strictly by the Companion channel, so that I can prioritize clinical inquiries. |
| F-1-J3 | Triage Staff | When searching for a specific patient, I want to enter their name or number in the search bar, so that I can open their chat history immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given active incoming messages across WhatsApp, SMS, and Companion, when staff views the inbox, then threads appear sorted descending by last message timestamp. |
| F-1-2 | Given the thread list, when the user clicks the "Companion" channel filter tab, then only conversations where transport is "companion" are rendered. |
| F-1-3 | Given an active conversation, when the user selects a new responsible team member, then the assignment updates immediately in the conversation header and store. |

### F-2: Multi-Party Care Group Creation & Management
#### 1. What it does
Enables clinical staff to create secure, multi-party care groups comprising both internal care team members and patient contacts. Group creation is strictly scoped to the Companion channel, and created groups are automatically synchronized with the patient's Companion portal.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: New Group Action Button | Button | Launches the slide-over group creation drawer | Exclusively visible when filtered to Companion channel |
| F-2.2: Create Group Drawer | UI Drawer | Collects Group Name, Description, Group Type (Private/Public), Members, and Moderators | Slide-over drawer matching MA design system |
| F-2.3: Member & Moderator Roster | Selector | Multi-select picker with tabs for Patient Contacts and Team Members | Enforces at least one Staff Moderator |
| F-2.4: Group Settings Drawer | UI Drawer | Modifies group title, member list, posting permissions, and group archival | Accessible from conversation header |
| F-2.5: Who Can Post Permission | Setting | Restricts message composing to Moderators Only or All Members | Enforced client and server side |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff creates "Post-Op Knee Rehab" group | Opens New Group on Companion channel, enters title, selects Sarah and Dr. Mehta | **Group created with ID `grp-101`; immediately visible in Client and Sarah's Companion portal** |
| 2 | Staff attempts to submit group with blank name | Clicks Create Group with empty title input | **Submission blocked; red border highlights Group Name with validation error** |
| 3 | Staff attempts to create group with no moderator | Deselects all staff moderators and clicks submit | **Submission blocked; system requires at least one Staff Moderator** |
| 4 | Moderator restricts posting to "Moderators only" | Opens Group Settings drawer and toggles posting permission | **Patient composer in Companion portal displays disabled state with explanatory notice** |
| 5 | Staff removes patient from care group | Moderator removes patient in Group Settings drawer | **Group access revoked in patient Companion portal; full audit log preserved in Client** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When coordinating complex recovery, I want to assemble a multi-disciplinary care group with the patient, so that all specialists share the same conversation context. |
| F-2-J2 | Moderator | When clinical updates need broadcast-only status, I want to set group posting permissions to Moderators Only, so that group chatter is minimized. |
| F-2-J3 | Administrator | When a patient completes a program, I want to archive the group while preserving medical history, so that HIPAA record compliance is maintained. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given the Chats page, when the user is on the Companion channel, then the "New Group" button is visible; when on WhatsApp, SMS, Website, or Email, the button is hidden. |
| F-2-2 | Given the Create Group drawer, when submitted with valid name, contact, and staff moderator, then the group is created and propagated to Companion within 500ms. |
| F-2-3 | Given a group with "Who can post" set to "Moderators only", when a non-moderator accesses the group, then message input is disabled with a descriptive tooltip. |

### F-3: Contextual In-Line Message Replies
#### 1. What it does
Provides contextual message citing within conversation threads. Staff can quote specific patient questions or previous clinician instructions. Sent replies display a visual reference banner above the message bubble that scrolls directly to the referenced message when clicked.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Hover Action Bar | UI Control | Contextual action bar surfacing Reply trigger upon message bubble hover | Minimal monochrome icon styling |
| F-3.2: Composer Reply Staging Banner | UI Block | Displays quoted sender name, message snippet, and cancel button above text input | Cleared on message send or X click |
| F-3.3: In-Thread Reference Card | UI Block | Renders embedded quote block above message bubble in chat stream | Click deep-links and scrolls to original message |
| F-3.4: Reply Metadata Persistence | Data Field | Stores `replyTo` object containing referenced message ID, sender, and text | Retained across thread exports |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient asks about dosage in message #3 | Clinician hovers message #3 and clicks Reply | **Composer displays reply banner citing message #3 and sender name** |
| 2 | Clinician types reply text and presses Enter | Submits message | **Sent bubble displays quoted excerpt block linking back to message #3** |
| 3 | Staff clicks quote block on historical reply | Clicks embedded excerpt card | **Viewport smoothly scrolls to message #3 and temporarily highlights it** |
| 4 | Staff changes mind before sending reply | Clicks X on composer reply staging banner | **Reply staging banner dismisses; composer reverts to standard direct message** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Clinician | When answering a specific clinical question in a busy thread, I want to quote the question directly, so that the patient understands which concern is addressed. |
| F-3-J2 | Staff Member | When reviewing a reply in historical logs, I want to click the quote card, so that I can jump to the original message for full context. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given any message bubble in an active conversation, when hovered, then a contextual action bar with a Reply icon is visible. |
| F-3-2 | Given a reply staging banner active above the composer, when the user sends a message, then the rendered bubble embeds a linked quote block. |
| F-3-3 | Given a message with a quote block, when clicked, then the thread view scrolls to the referenced message and applies temporary highlight. |

### F-4: Secure Clinical Attachment Pipeline
#### 1. What it does
Allows staff to upload, validate, preview, and download medical records, lab reports, radiology scans, and intake documents within chat threads. Enforces client-side file size limits (up to 25MB) and supported MIME types with upload progress feedback.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Attachment Trigger | Button | Paperclip icon in composer bar opening system file picker | Accepts drag-and-drop onto composer |
| F-4.2: File Size Validator | Logic | Enforces 25MB maximum file threshold prior to upload transmission | Immediate client-side validation |
| F-4.3: Composer File Staging Chip | UI Chip | Displays filename, file size, icon, and remove button prior to sending | Multiple files supported |
| F-4.4: In-Thread Document Card | UI Card | Displays document title, file type, file size, preview thumbnail, and download CTA | Renders PDF and image previews |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff uploads 4.2MB knee MRI scan PDF | Drops file onto composer drop zone | **Upload completes; message renders PDF card with file size and download link** |
| 2 | Staff attempts to upload 38MB video file | Selects 38MB video in file picker | **Upload rejected immediately; toast displays: "File exceeds 25MB threshold"** |
| 3 | Staff attaches image then removes before sending | Clicks X on staged file chip | **File chip removed from composer staging area without upload dispatch** |
| 4 | Clinician clicks download on received PDF | Clicks download link on document card | **File securely downloads with authenticated token and original filename** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinician | When sharing lab results with a patient, I want to upload a PDF directly into the thread, so that the patient can review their findings securely. |
| F-4-J2 | Practice Staff | When receiving medical charts, I want to preview file details and download them, so that I can import them into the electronic health record. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given a file under 25MB (PDF, PNG, JPG, DOCX), when attached to the composer, then a staged file chip displays filename and file size. |
| F-4-2 | Given a file exceeding 25MB, when selected, then upload is immediately blocked and a descriptive error toast is displayed. |
| F-4-3 | Given a sent document attachment, when viewed in the thread, then a document card renders filename, size, and secure download action. |

### F-5: Message Delivery Status Indicators & Receipts
#### 1. What it does
Provides real-time feedback on message transport states across external networks and the patient portal. Displays clean monochrome status icons (pending, sent, delivered, read, failed) with timestamp tooltips upon hover.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Delivery Status Icons | UI Indicator | Monochrome status glyphs (clock, single check, double check, shaded double check, alert) | Minimalist non-colorful icons |
| F-5.2: Timestamp Tooltip | Tooltip | Displays exact transmission and read receipt timestamps upon icon hover | Instant contextual tooltip |
| F-5.3: Delivery Error Banner | UI Banner | Surfaces retry action and error reason for failed carrier deliveries | Handles opt-out / invalid number |
| F-5.4: WhatsApp Window Indicator | UI Logic | Enforces pre-approved HSM templates when messaging outside 24h Meta window | Restricts freeform composer text |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff sends message to patient portal | Clicks send button | **Icon transitions from clock (pending) to single check (sent) to double check (delivered)** |
| 2 | Patient opens message in Companion app | Patient views thread | **Icon updates to dark double check (read) in Client console** |
| 3 | Staff hovers over read receipt icon | Moves cursor over double check | **Tooltip displays: "Read by Sarah Johnson at 10:42 AM"** |
| 4 | Message fails due to disconnected mobile carrier | Gateway reports transport failure | **Warning triangle displays next to bubble with "Delivery failed - click to retry"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Care Coordinator | When dispatching urgent instructions, I want to verify if the message was delivered and read, so that I know the patient received care guidance. |
| F-5-J2 | Staff Member | When a message delivery fails, I want to see the error indicator and retry option, so that I can re-attempt communication. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Given an outbound message, when dispatched, then delivery state transitions accurately from sent to delivered and read. |
| F-5-2 | Given any message status icon, when hovered by the cursor, then a tooltip displays the exact status and timestamp. |
| F-5-3 | Given a delivery failure, when the error occurs, then a failure icon displays with a retry action. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Omnichannel Thread Aggregation & Channel Filtering | F-1.1 Thread Stream, F-1.2 Channel Filter Tabs, F-1.3 Thread Search, F-1.4 Responsible Assignment, F-1.5 Bot Assignment | Consolidated 1:1 patient inbox across five channels with live filtering and staff assignment. |
| F-2 | Multi-Party Care Group Creation & Management | F-2.1 New Group CTA, F-2.2 Creation Drawer, F-2.3 Member Roster, F-2.4 Settings Drawer, F-2.5 Posting Permissions | Companion-scoped care group creation drawer establishing multi-disciplinary clinical channels. |
| F-3 | Contextual In-Line Message Replies | F-3.1 Hover Bar, F-3.2 Composer Reply Banner, F-3.3 In-Thread Reference Card, F-3.4 Reply Metadata | In-thread message quoting with visual snippet previews and deep-link scroll navigation. |
| F-4 | Secure Clinical Attachment Pipeline | F-4.1 Attachment Trigger, F-4.2 File Size Validator, F-4.3 File Staging Chip, F-4.4 Document Card | 25MB clinical media and PDF document sharing pipeline with previews and validation. |
| F-5 | Message Delivery Status Indicators & Receipts | F-5.1 Status Icons, F-5.2 Timestamp Tooltips, F-5.3 Error Banners, F-5.4 WhatsApp Window | Minimalist delivery receipt tracking with timestamp hover tooltips and failure retry flows. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | When multiple patient inquiries arrive across channels, I want to view them in a single unified thread list, so that no patient message is overlooked. | F-1 |
| 2 | Clinician | When focusing on patient portal queries, I want to filter the inbox strictly by the Companion channel, so that I can prioritize clinical inquiries. | F-1 |
| 3 | Triage Staff | When searching for a specific patient, I want to enter their name or number in the search bar, so that I can open their chat history immediately. | F-1 |
| 4 | Care Coordinator | When coordinating complex recovery, I want to assemble a multi-disciplinary care group with the patient, so that all specialists share the same conversation context. | F-2 |
| 5 | Moderator | When clinical updates need broadcast-only status, I want to set group posting permissions to Moderators Only, so that group chatter is minimized. | F-2 |
| 6 | Administrator | When a patient completes a program, I want to archive the group while preserving medical history, so that HIPAA record compliance is maintained. | F-2 |
| 7 | Clinician | When answering a specific clinical question in a busy thread, I want to quote the question directly, so that the patient understands which concern is addressed. | F-3 |
| 8 | Staff Member | When reviewing a reply in historical logs, I want to click the quote card, so that I can jump to the original message for full context. | F-3 |
| 9 | Clinician | When sharing lab results with a patient, I want to upload a PDF directly into the thread, so that the patient can review their findings securely. | F-4 |
| 10 | Practice Staff | When receiving medical charts, I want to preview file details and download them, so that I can import them into the electronic health record. | F-4 |
| 11 | Care Coordinator | When dispatching urgent instructions, I want to verify if the message was delivered and read, so that I know the patient received care guidance. | F-5 |
| 12 | Staff Member | When a message delivery fails, I want to see the error indicator and retry option, so that I can re-attempt communication. | F-5 |

