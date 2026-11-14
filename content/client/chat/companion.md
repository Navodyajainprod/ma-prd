---
title: "Chats: Companion Channel"
product: "client"
module: "chat"
channel: "companion"
route: "/chats?channel=companion"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | CHATS: COMPANION CHANNEL |
| Route | `/chats?channel=companion` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The Companion view of the Chats inbox: the patient threads that come from the patient portal, care groups with a **New Group** button, a Care Bot pause control, and a **Companion Settings** drawer. |
| **Who uses it** | Care Coordinator (replies, assigns, builds groups). Practice Admin (configures the bot). Patient (the other side, in the portal). No role is checked. |
| **Where you start it** | **Chats** in the sidebar, then **Companion** in the channel picker. The address `/chats?channel=companion` does not select it. |
| **Where the result goes** | The shared conversation store that the patient portal reads, and the client's Activity timeline. |
| **How real is it** | 0 features work, 5 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Care groups in the portal | A group made here shows in the patient's Messages screen at once, from the same browser store. The portal also shows every group containing client CL-001 and every public group to any patient. | [View Companion Messages](/companion/chat) |
| Companion | Care Bot settings | Greeting, requirement buttons, bot name and photo saved here are read by the portal Care Bot. The mapped process is not read by the portal bot screen. | [View Companion Messages](/companion/chat) |
| Companion | Patient messages | A patient's messages arrive in this channel. The bot in the Messages screen is one shared thread for all patients. | [View Companion Messages](/companion/chat) |
| Client (Clients) | Activity timeline | Messages sent here are written to the client's Activity timeline, logged as WhatsApp. | [View Clients](/client/clients) |
| Client (Chats) | Shared inbox | Search, reply, attach and receipts follow the inbox page. | [View Chats Inbox](/client/chat/chat) |

## 1. Module Summary

### The story in one minute

Priya Nair opens **Chats** and picks **Companion**. Sarah Johnson wrote from the patient portal. The header shows her name and phone and no assign button. Priya opens the composer gear. It offers **Pause Care Bot** with an Active badge and **Assign Responsible**, and no templates. She presses **Assign Responsible**. A small popup opens above the gear. She picks Dr. Anita Rao and a toast confirms. The bot status flips to off. She then presses the settings cog. **Companion Settings** opens with a welcome greeting, four requirement buttons, a bot name and a photo. She renames the bot and the change reaches the patient's screen. Nothing in the bot looks for emergency words.

### What is real and what is not

- **Real in the prototype:** the Companion thread list, the **New Group** button, the gear menu with Pause and Assign, and the Companion Settings drawer with greeting, requirement list, bot name and photo.
- **Simulated:** the portal bot answers by matching words, not by the mapped process. Pausing the bot sets a flag the portal bot screens do not read. Messages are marked read at once. Care group visibility in the portal is wider than membership.
- **Not built:** emergency escalation, the AI First Responder toggle and hand-off phrase fields, working time preferences, enforced moderator posting, and a clickable quote.

### Journey position

```
Patient portal message ─▶ Companion thread ─▶ Reply / pause bot / assign ─▶ Client Activity timeline
Companion Settings ─▶ Care Bot in the portal
```

## 2. Feature Requests

### F-1: Care groups on the Companion channel

#### 1. What it does
**New Group** appears only here. Priya names a group, adds Sarah and Dr. Rao and saves. The group goes to the top of the list. Group Settings in the header edits it. The drawer fields and rules are the same as on the inbox page.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: New Group button | Button | Opens the Create Group drawer. Shown only on Companion | ● Works | |
| F-1.2: Create Group drawer | Drawer | Name, description, members, moderators, who can add, who can post | ● Works | Always private. Owner is "Clinic Admin" |
| F-1.3: Staff moderator rule | Rule | The locked owner is always a moderator | ◐ Simulated | No "At least one Staff Moderator" message (G4-C-02) |
| F-1.4: Portal ingestion | Hand-off | The portal reads the same store | ◐ Simulated | No webhook. Any patient also sees groups with CL-001 and public groups (G4-E-07). Decision needed: D-138 |
| F-1.5: Posting permissions | Setting | Moderators only or all members | ◐ Simulated | Saved but never enforced (G4-E-09) |

#### 3. Worked example
Priya starts a group.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Companion is chosen | Presses **New Group** and saves "Cataract Recovery" with Sarah | **The group is listed first and a system message is added** |
| 2 | She limits posting to moderators | Saves Group Settings | **The composer still accepts messages from anyone** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When assembling a team for a patient, I want to create a care group from the Companion channel, so that specialists and the patient share one thread. |
| F-1-J2 | Care Coordinator | When sending broadcast updates, I want posting limited to moderators, so that instructions are not drowned out. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the Companion channel, **then** New Group is visible. On other channels it is hidden. |
| F-1-2 | **Given** a valid group is saved, **then** it is stored and the patient portal can list it at once. |
| F-1-3 | **Given** Who can post is Moderators only, **then** the composer is still open. |

### F-2: Care Bot behaviour for patients

#### 1. What it does
The Care Bot lives in the patient portal. It greets the patient with the welcome text from Companion Settings and shows the requirement buttons. When the patient taps one or types, a short canned reply appears after about half a second. Replies are chosen by words in the button label or the message. No button links to a portal page and no emergency words are checked.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Requirement buttons | Buttons | The portal shows the requirements saved in Companion Settings | ● Works | |
| F-2.2: Keyword replies | Reply | Canned text for booking, billing, forms, care team, check-in, and a default | ◐ Simulated | Chosen by words, not by the mapped process (G4-C-06). Billing text names payment methods the app does not take |
| F-2.3: Process intent classifier | Logic | Pick the target process from the message | ○ Not built | The mapped process is not read by the portal bot screen |
| F-2.4: Portal shortcut buttons in replies | Buttons | Deep links to booking, billing, forms and status | ○ Not built | Replies are plain text |
| F-2.5: Check-in message | Reply | "Check In Confirmed" | ◐ Simulated | Only changes a client stage, no appointment is marked (G12-E-26) |
| F-2.6: Emergency escalation | Rule | Detect chest pain and similar and show 911 guidance | ○ Not built | Patient safety gap (G4-C-07). Decision needed: D-132 |
| F-2.7: Who replies first | Rule | Whether the bot or a human answers first | ◐ Simulated | The saved First Responder value defaults to AI and has no control here. Decision needed: D-133 |

#### 3. Worked example
Sarah asks the bot about a bill.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah taps a billing requirement | Taps it in the portal | **A canned billing reply with no button appears** |
| 2 | Sarah types "severe chest pain" | Sends it | **The default reply says the care team has the update. No 911 guidance appears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I have a question after office hours, I want an instant answer, so that I do not wait for the clinic to open. |
| F-2-J2 | Practice Admin | When patients use the portal, I want routine questions answered by the bot, so that calls to the front desk drop. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a requirement button is tapped, **then** a canned reply is chosen by words in its label. |
| F-2-2 | **Given** a message with emergency words, **then** the default reply is shown. No emergency guidance and no staff alert follow. |
| F-2-3 | **Given** any bot reply, **then** it is plain text with no link button. |

### F-3: Companion Settings

#### 1. What it does
The settings cog opens the **Companion Settings** drawer. Priya edits the welcome greeting and a list of requirements, each mapped to a process. She sets a bot name and a profile photo. **Save Settings** stores the rest. The photo saves at once.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Settings cog | Button | Opens Companion Settings | ● Works | |
| F-3.2: Welcome greeting | Text | Shown by the portal Care Bot | ● Works | |
| F-3.3: Requirement to process mapping | Rows | Label and process, no stage. At least one row stays | ◐ Simulated | The portal bot screen does not read the process |
| F-3.4: Bot name and photo | Fields | Name and a photo under 20MB, compressed | ◐ Simulated | Photo upload and remove save at once, outside Save and Cancel (G4-E-24) |
| F-3.5: Save Settings | Button | Saves greeting, requirements and name | ● Works | |
| F-3.6: AI First Responder toggle | Toggle | Choose bot or human first | ○ Not built | Stored with no control (G4-C-10). Decision needed: D-133 |
| F-3.7: Hand-off phrases and auto-responder | Fields | Phrases that pass a chat to a human | ○ Not built | Stored with no control |
| F-3.8: Working time preferences | Settings | Business hours and out-of-office notices | ○ Not built | (G4-C-11). Decision needed: D-133 |

#### 3. Worked example
Priya renames the bot.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The drawer is open | Types a new bot name and presses **Save Settings** | **The portal shows the new name** |
| 2 | She uploads a photo | Picks an image | **It is saved at once, even if she then cancels** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When setting up the portal, I want to name the bot and map patient choices to processes, so that intake and booking are routed as intended. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the Companion channel, **then** the settings cog is in the top bar. |
| F-3-2 | **Given** a photo is chosen, **then** it is compressed and saved at once. Cancel does not undo it. |
| F-3-3 | **Given** the drawer, **then** no control exists for First Responder, hand-off phrases or working time. |

### F-4: Media, quoting and receipts

#### 1. What it does
Companion threads use the same composer as every channel. Priya can reply to a message with a quote and attach one file. The file keeps only its name, size and type. Every sent message is stamped read.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Attachment | Upload | One file as a chip. Nothing is stored but name, size and type | ◐ Simulated | No 25MB limit, no download (G4-E-10). Decision needed: D-137 |
| F-4.2: Quote reply | Action | Reply icon, banner and quote block | ● Works | The quote is not clickable |
| F-4.3: Read receipts | Glyph | Double check for read | ◐ Simulated | Stamped read at send (G4-E-11). Decision needed: D-141 |

#### 3. Worked example
Priya replies with a quote.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah asks about her drops | Presses Reply on the message and sends | **The bubble shows the quote and a double check at once** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Physician | When discussing results with a patient, I want to attach a file and quote a question, so that the answer is precise. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a file is attached and sent, **then** a card shows its name and size. No file is stored. |
| F-4-2 | **Given** a sent message, **then** it shows a double check at once. |

### F-5: Gear menu, Care Bot pause and assignment

#### 1. What it does
The top bar assign button is removed on Companion. The composer gear holds **Pause Care Bot** or **Resume Care Bot** with an Active or Paused badge, and **Assign Responsible**. There is no template option. Assign opens a small popup above the gear with a search box, an **Unassigned** option and active team members.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Top bar assign button removed | Rule | The header shows name and phone only | ● Works | |
| F-5.2: Pause and Resume Care Bot | Control | Toggles the bot flag with an Active or Paused badge | ◐ Simulated | The portal bot screens do not read the flag, so replies continue |
| F-5.3: Templates hidden | Rule | No Share Template Message on Companion | ● Works | |
| F-5.4: Assign Responsible popup | Popover | Search, Unassigned and active team store members | ● Works | |
| F-5.5: Assign turns the bot off | Rule | Sets the assignee, sets the bot off and toasts. Unassign toasts "Conversation unassigned" | ● Works | The bot is set off rather than paused (G4-C-17) |
| F-5.6: Assignee names in the list | Display | The thread list and header read a short fixed list | ◐ Simulated | Can differ from the popup (G4-E-04). Decision needed: D-140 |

#### 3. Worked example
Priya takes over from the bot.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah's thread is open | Opens the gear and presses **Assign Responsible**, picks Dr. Anita Rao | **A toast confirms and the bot flag is set off** |
| 2 | Priya unassigns | Chooses **Unassigned** | **A toast says "Conversation unassigned"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Care Coordinator | When taking over from the Care Bot, I want to pause it and assign a clinician from the gear, so that I stay in the chat stream. |
| F-5-J2 | Practice Admin | When assigning on Companion, I want only our team members offered, so that threads are not routed outside the clinic. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** a Companion thread, **then** the header has no assign button. |
| F-5-2 | **Given** the gear menu, **then** it has Pause or Resume Care Bot and Assign Responsible, and no template option. |
| F-5-3 | **Given** a person is chosen in the popup, **then** the assignee is set, the bot is set off and a toast shows. |
| F-5-4 | **Given** the popup, **then** only active team members and Unassigned are offered. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Care groups | F-1.1 – F-1.5 | ● / ◐ | Create works; posting limit not enforced. |
| F-2 | Care Bot behaviour | F-2.1 – F-2.7 | ● / ◐ / ○ | Canned keyword replies; no emergency escalation. |
| F-3 | Companion Settings | F-3.1 – F-3.8 | ● / ◐ / ○ | Greeting and name work; first responder and hours absent. |
| F-4 | Media, quoting, receipts | F-4.1 – F-4.3 | ● / ◐ | Quote works; file not kept; receipts fabricated. |
| F-5 | Gear menu and assignment | F-5.1 – F-5.6 | ● / ◐ | Assign works; pause is not read by the portal. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | Create a care group from the Companion channel | F-1 |
| 2 | Care Coordinator | Limit posting to moderators | F-1 |
| 3 | Patient | Get an instant answer after hours | F-2 |
| 4 | Practice Admin | Have the bot answer routine questions | F-2 |
| 5 | Practice Admin | Name the bot and map choices to processes | F-3 |
| 6 | Physician | Attach a file and quote a question | F-4 |
| 7 | Care Coordinator | Pause the bot and assign a clinician | F-5 |
| 8 | Practice Admin | Offer only our team members for assignment | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Read every Companion thread, create groups, assign, pause the bot, edit Companion Settings | Nothing |
| Patient (portal) | Send messages to the clinic and the bot, see groups | Starting a new chat. Group access is not limited to membership |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named physicians, specialists, coordinators and administrators and did not say who edits settings. Decision needed: D-18.

## 5. Metrics and definitions

The unread badge is the only figure here. It counts unread inbound messages on the thread and clears on open. No other metric is shown.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal ↔ Appointments / Invoices | Patient sends a message | The message reaches this channel. The clinician thread is found by client id or by contact name. |
| | Care group to portal | A group made here shows in the portal, with groups that contain CL-001 and public groups. |
| | Care Bot settings | Greeting, requirements, name and photo reach the portal bot. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-138 | What are the care group rules, including Public groups and portal visibility? | F-1.4 |
| D-132 | What are the emergency keywords, wording and staff alert? | F-2.6 |
| D-133 | What is the runtime for bot or human first, hand-off phrases and working time? | F-2.7, F-3.6, F-3.8 |
| D-137 | What are the attachment limits and allowed types? | F-4.1 |
| D-141 | What is the source of delivery and read receipts? | F-4.3 |
| D-140 | Which roster supplies assignees? | F-5.6 |
| D-18 | Which roles may edit Companion settings? | Roles |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version. |
