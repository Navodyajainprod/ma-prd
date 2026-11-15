---
title: "Chats: Inbox and Care Groups"
product: "client"
module: "chat"
channel: "chat"
route: "/chats"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | CHATS: INBOX AND CARE GROUPS |
| Route | `/chats` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A two-pane console. The left pane lists the threads of one channel. The right pane shows the selected thread with a header, the message stream and a composer. Care groups are created and managed here, on the Companion channel. |
| **Who uses it** | Care Coordinator (triages and replies). Physician (receives assigned threads). No role is checked: any signed-in user can read every thread, assign, and create groups. |
| **Where you start it** | **Chats** in the sidebar (`/chats`). A client's Activity timeline and the Process call-log viewer also open a thread for that client. |
| **Where the result goes** | The shared conversation store (read by the patient portal), and the client's Activity timeline for every sent message. |
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
| Companion | Care groups in the patient portal | A group created here shows in the portal Messages screen at once, because both read one browser store. The portal also lists every group that contains client CL-001 and every public group to any patient. | [View Companion Messages](/companion/chat) |
| Companion | Patient messages | Messages a patient sends in the portal arrive in the Companion channel here. | [View Companion Messages](/companion/chat) |
| Client (Clients) | Activity timeline | Every message or template sent here is written to the linked client's Activity timeline. A thread with no client is logged against client CL-001. Companion messages are logged as WhatsApp. | [View Clients](/client/clients) |
| Client (Clients, Process) | Open a thread from elsewhere | A client's Activity entry and the Process call-log viewer open Chats with a client id, channel and thread id, and the matching thread is selected. | [View Process Kanban](/client/processes/kanban) |
| Client (Workflows) | Template link from a step | A workflow step editor links to the WhatsApp Templates view. | [View WhatsApp](/client/chat/whatsapp) |
| Client (Tasks) | Task share | A task shared to the client portal posts a plain text message into the patient's chat. | [View Tasks by me](/client/tasks/tasks-by-me) |

## 1. Module Summary

### The story in one minute

Priya Nair opens **Chats** at the start of her shift. The sidebar folds to its rail and the page shows an **Omnichannel** badge. The channel picker reads WhatsApp, because that is the default. She switches to SMS, types "Sarah" in the search box and the list narrows. She opens Sarah Johnson's thread and the unread dot clears. Sarah is asking about a cataract follow-up. Priya hovers a bubble, presses Reply and types an answer. She opens the gear and assigns the thread to Dr. Anita Rao, and a toast confirms it. Dr. Rao gets no alert. Later Priya switches to Companion and presses **New Group** to start a care group for Sarah's recovery.

### What is real and what is not

- **Real in the prototype:** the channel picker, search, unread badge, thread header states, assigning a responsible person, the Reply quote, attaching a file as a chip, the care group drawers, and the write to the client's Activity timeline.
- **Simulated:** all threads come from a browser store seeded with sample data. Every sent message is stamped read at once. Attachments keep only a name, size and type. Download shows a browser alert. Three different assignee lists are in use.
- **Not built:** an All channels view, sorting by last activity, match highlighting, resolve and open or resolved views, notifying the assignee, a Private or Public group picker, rename and archive, enforced posting limits, file size limits, failed state and retry.

### Journey position

```
Inbound or staff message ─▶ Thread list ─▶ Open thread ─▶ Reply / assign / attach ─┬▶ Client Activity timeline
                                                                                    └▶ Patient portal (care groups)
```

## 2. Feature Requests

### F-1: Inbox, channels and search

#### 1. What it does
Priya opens **Chats** and sees one channel at a time. The picker offers WhatsApp, SMS, Website, Email and Companion. Each row shows initials or a group icon, the name, the assignee's initials, the last message, a time and an unread badge. She types in the search box and the list filters on name, phone and last message. Email opens a separate webmail that another PRD covers.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Thread list | List | One row per thread of the chosen channel, with initials, name, assignee initials, last message, time and unread badge | ◐ Simulated | Threads come from a browser store seeded with sample data. No live channel feeds it |
| F-1.2: Channel picker | Dropdown | WhatsApp, SMS, Website, Email, Companion. Default is WhatsApp. Search text is kept when the channel changes | ● Works | |
| F-1.3: All channels view | View | One list across every channel | ○ Not built | The code can show it but the picker cannot choose it. Decision needed: D-139 |
| F-1.4: Search | Search box | Case-insensitive match on contact name, phone and last message | ● Works | Matches are not highlighted |
| F-1.5: Match highlighting | Display | Highlight the matched text in the list | ○ Not built | |
| F-1.6: Newest first order | Rule | Threads sorted by last activity, a new message moves its thread up | ○ Not built | Rows keep stored order and sending does not move a row. Decision needed: D-139 |
| F-1.7: Unread badge | Badge | Counts unread inbound messages on the thread. Opening the thread sets it to 0 | ● Works | Seed counts are mock values |
| F-1.8: Open a thread | Action | Selecting a row opens it and scrolls the stream to the bottom | ● Works | |
| F-1.9: Empty states | State | "Select a channel", "No conversations found.", "Select a conversation" | ◐ Simulated | When a channel has no threads, the thread opened from another channel stays open and can be replied to (G4-E-14) |
| F-1.10: Loading and error states | State | None exist | ○ Not built | All data is browser-local, so nothing loads or fails |
| F-1.11: Resolve, open or resolved status, Unread and Assigned to me views | Status | A resolve handler and view filters exist in code | ○ Not built | No control calls them (G4-E-06). Decision needed: D-140 |
| F-1.12: Sample data reset | Rule | When fewer than 20 WhatsApp or 20 SMS threads are stored, the whole store is replaced with seed data | ◐ Simulated | New groups and messages can be lost (G4-E-15) |
| F-1.13: URL channel link | Link | `/chats?channel=` selects a channel | ◐ Simulated | Only the email value is read. A navigation request for Companion falls back to All (G4-E-13) |

#### 3. Worked example
Priya looks for Sarah across channels.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Page opens | Reads the picker | **WhatsApp is chosen and its threads are listed** |
| 2 | She wants SMS | Picks **SMS** and types "Johnson" | **The SMS list narrows to matching rows. The text stays if she changes channel** |
| 3 | Sarah's thread has a badge | Clicks the row | **The badge clears and the stream scrolls to the last message** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When messages arrive on several channels, I want to see them in one inbox, so that no patient message is overlooked. |
| F-1-J2 | Care Coordinator | When a patient calls about an earlier message, I want to search by name or number, so that I can open their thread at once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the picker, **when** the user chooses a channel, **then** only that channel's threads are listed. There is no All channels choice. |
| F-1-2 | **Given** a search text, **when** the channel changes, **then** the text is kept. |
| F-1-3 | **Given** a thread with unread messages, **when** it is opened, **then** its badge is cleared and saved. |
| F-1-4 | **Given** a message is sent, **then** the thread keeps its place in the list. |

### F-2: Assign a responsible person and hand over from the bot

#### 1. What it does
The header of a thread shows one of three states. **Bot Active** means the bot is replying. A name means someone is assigned. **Unassigned** has nothing behind it. Priya opens the composer gear, presses **Assign Responsible** and picks Dr. Rao. The assignee is set, the bot is turned off and a toast confirms it.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Header states | Button | Bot Active, Assigned with a name, or Unassigned | ◐ Simulated | Names come from a short fixed list, so the header can show the wrong person or "Team Member" (G4-E-04) |
| F-2.2: Pause the bot | Action | Clicking Bot Active pauses the bot | ● Works | A paused bot cannot be resumed from the header (G4-E-05) |
| F-2.3: Assign Responsible | Modal | Lists team members and sets the assignee, turns the bot off and shows a toast | ◐ Simulated | The list falls back to ten fixed names. Three different rosters are in use (G4-E-04). Decision needed: D-140 |
| F-2.4: Unassigned button | Button | Clicking it should open a bot chooser | ○ Not built | The chooser is switched off, so nothing happens. Website threads have no gear and cannot be assigned (G4-E-05) |
| F-2.5: Notify the assignee | Alert | Tell the person a thread was assigned | ○ Not built | A toast to the sender only. Decision needed: D-140 |
| F-2.6: Automatic hand-over | Rule | Bot falls back to a human on escalation | ○ Not built | Only manual: pause the bot or assign a person |
| F-2.7: Role control | Rule | Any signed-in user can read and assign any thread | ○ Not built | "Me" is fixed as user 1. Decision needed: D-18 |

#### 3. Worked example
Priya passes Sarah's question to the doctor.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah's SMS thread is open, bot active | Opens the gear and chooses **Assign Responsible**, then Dr. Anita Rao | **The header shows the assignment, the bot is off and a toast confirms** |
| 2 | Priya wants the bot back | Clicks the header | **Nothing resumes the bot from here** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When a question needs a clinician, I want to assign the thread, so that the right person owns the answer. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the gear menu on WhatsApp or SMS, **when** a person is chosen, **then** the assignee is set, the bot is turned off and a toast shows. No notification is sent. |
| F-2-2 | **Given** the header reads Unassigned, **when** it is clicked, **then** nothing happens. |
| F-2-3 | **Given** a Website thread, **then** there is no gear and no way to assign it. |

### F-3: Care groups

#### 1. What it does
On the Companion channel only, Priya presses **New Group**. A drawer asks for a name, a description, members from the Contacts and Team tabs, moderators, who can add members and who can post. "Clinic Admin" is already owner and moderator and cannot be removed. She saves and the group goes to the top of the list with a system message. The patient sees it in the portal. Group Settings in the thread header edits it afterwards.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: New Group button | Button | Opens the drawer. Shown only on the Companion channel | ● Works | |
| F-3.2: Create Group drawer | Drawer | Name, description, members, moderators, who can add members, who can post | ● Works | Owner is always "Clinic Admin" |
| F-3.3: Validation | State | A name and at least one member are required. The button is disabled until then | ● Works | No "at least one staff moderator" message. The locked owner covers it |
| F-3.4: Private or Public type | Field | Choose the group type | ○ Not built | Always private. The portal still shows public groups to everyone. Decision needed: D-138 |
| F-3.5: Group Settings drawer | Drawer | Edit description, who can add members, who can post. Add and remove members and moderators | ● Works | Member changes save at once. Settings save on **Save Changes** |
| F-3.6: Remove member | Action | Removes the member at once | ◐ Simulated | No confirmation (G4-E-08) |
| F-3.7: Who can post | Rule | Moderators only or all members | ◐ Simulated | Saved but not enforced. The composer always allows posting (G4-E-09) |
| F-3.8: Rename, archive, audit log | Action | Rename a group, archive it, log a removal | ○ Not built | Decision needed: D-138 |
| F-3.9: Groups on other channels | Rule | Care groups also appear in the WhatsApp channel list | ◐ Simulated | (G4-E-03). Decision needed: D-138 |
| F-3.10: Portal visibility | Hand-off | The patient portal reads the same store | ◐ Simulated | Shows every group containing CL-001 and every public group to any patient (G4-E-07). Decision needed: D-138 |

#### 3. Worked example
Priya sets up a recovery group.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | On Companion | Presses **New Group**, names it "Post-Op Cataract Care", adds Sarah and Dr. Rao | **The group is created and appears at the top of the list** |
| 2 | She leaves the name empty | Tries to create | **The Create button stays disabled and a message asks for a name** |
| 3 | She sets who can post to moderators only | Saves in Group Settings | **The setting is stored, but a member can still post** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator | When a patient needs several specialists, I want to create a care group with them, so that everyone shares one conversation. |
| F-3-J2 | Care Coordinator | When a group is broadcast only, I want posting limited to moderators, so that instructions are not buried. |
| F-3-J3 | Practice Admin | When a patient finishes a program, I want to archive the group and keep its history, so that records are preserved. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the Companion channel, **then** New Group is visible. On every other channel it is hidden. |
| F-3-2 | **Given** a name and one member, **when** Create is pressed, **then** a private group is stored with Clinic Admin as owner and appears in the patient portal. |
| F-3-3 | **Given** Who can post is Moderators only, **when** a member opens the thread, **then** the composer is still open. |
| F-3-4 | **Given** a member is removed in Group Settings, **then** removal is immediate with no confirmation. |

### F-4: Replies and attachments

#### 1. What it does
Priya hovers a bubble and presses the Reply icon. The composer shows "Replying to ..." with a cancel X. The sent bubble carries a quote block. The paperclip opens the file picker for one file. A chip shows its name and size with a remove X. Send is off until there is text or a file.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Reply icon | Control | Appears on hover of a bubble | ● Works | |
| F-4.2: Reply banner | Block | "Replying to ..." above the composer with a cancel X | ● Works | |
| F-4.3: Quote block | Block | The sent bubble embeds the quoted text | ● Works | Reply data is saved on the message |
| F-4.4: Jump to the original | Action | Clicking the quote scrolls to and highlights the message | ○ Not built | The quote is not clickable |
| F-4.5: Paperclip and chip | Control | One file, with name and size and a remove X | ● Works | |
| F-4.6: Attachment storage | Data | Name, size and type only | ◐ Simulated | The file itself is not kept (G4-E-10) |
| F-4.7: Download | Button | Shows a browser alert | ◐ Simulated | No file is delivered (G4-E-10) |
| F-4.8: Limits and previews | Rule | 25MB limit, allowed types, drag and drop, several files, previews | ○ Not built | Decision needed: D-137 |

#### 3. Worked example
Priya answers a specific question.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah asked about eye drops in message 3 | Hovers it and presses Reply | **The composer shows "Replying to Sarah Johnson"** |
| 2 | Priya attaches a care sheet | Picks a PDF with the paperclip | **A chip shows its name and size** |
| 3 | She sends | Presses Send | **The bubble shows the quote and an attachment card. Its Download button shows an alert** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Care Coordinator | When a thread is busy, I want to quote the question I am answering, so that the patient knows which concern I address. |
| F-4-J2 | Physician | When sharing lab results, I want to attach a PDF in the thread, so that the patient can review it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** Reply is pressed, **when** a message is sent, **then** its bubble embeds a quote block that is not clickable. |
| F-4-2 | **Given** a file of any size or type, **when** it is picked, **then** a chip shows. No size or type check runs. |
| F-4-3 | **Given** an attachment card, **when** Download is pressed, **then** a browser alert appears and no file is saved. |

### F-5: Delivery receipts and the client timeline

#### 1. What it does
Each sent bubble carries a check mark. A double check means read. Everything else shows one check. A sent message is also written to the linked client's Activity timeline.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Check marks | Glyph | Double check for read, single check for anything else | ◐ Simulated | Every sent message is saved as read at once (G4-E-11). Decision needed: D-141 |
| F-5.2: Timestamp tooltip, failed state, retry | Display | Show exact times, failures and a retry | ○ Not built | |
| F-5.3: Activity write-back | Hand-off | Writes each sent message and template to the client's Activity timeline | ◐ Simulated | A thread with no client is logged to CL-001. Companion messages and SMS templates are logged as WhatsApp (G4-E-12). Decision needed: D-31 |
| F-5.4: Open from Activity or Process | Link | A client id, channel or thread id selects the thread and channel | ● Works | |
| F-5.5: Inline thread drawer | Drawer | Finds or creates a thread from a client's Activity | ◐ Simulated | Client matching is by name or phone fragment, with a fallback to CL-001 (G4-E-16). Decision needed: D-22 |

#### 3. Worked example
Priya sends a reply and checks the receipt.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A reply is sent | Presses Send | **A double check shows at once, before anything is delivered** |
| 2 | Sarah's Activity timeline | Opens it | **The message is listed there** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Care Coordinator | When I send urgent guidance, I want to know it was delivered and read, so that I know the patient received it. |
| F-5-J2 | Care Coordinator | When a message fails, I want a clear error and a retry, so that I can send it again. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** a message is sent, **then** it is stored with status read and shows a double check. |
| F-5-2 | **Given** a sent message on a thread with a client, **then** one entry is added to that client's Activity timeline. |
| F-5-3 | **Given** a thread with no client, **when** a message is sent, **then** the entry is attached to client CL-001. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Inbox, channels and search | F-1.1 – F-1.13 | ● / ◐ / ○ | One channel at a time; no All view, no sort, no status. |
| F-2 | Assign and hand over from the bot | F-2.1 – F-2.7 | ● / ◐ / ○ | Assignment works; three rosters, no alert, dead Unassigned button. |
| F-3 | Care groups | F-3.1 – F-3.10 | ● / ◐ / ○ | Create and edit work; posting limit not enforced. |
| F-4 | Replies and attachments | F-4.1 – F-4.8 | ● / ◐ / ○ | Quote and chip work; no file is kept. |
| F-5 | Receipts and client timeline | F-5.1 – F-5.5 | ● / ◐ / ○ | Receipts are fabricated; timeline write works. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | See messages from several channels in one inbox | F-1 |
| 2 | Care Coordinator | Search by name or number to open a thread | F-1 |
| 3 | Care Coordinator | Assign a thread to the right person | F-2 |
| 4 | Care Coordinator | Create a care group with several specialists | F-3 |
| 5 | Care Coordinator | Limit posting to moderators | F-3 |
| 6 | Practice Admin | Archive a group and keep its history | F-3 |
| 7 | Care Coordinator | Quote the question being answered | F-4 |
| 8 | Physician | Attach lab results in a thread | F-4 |
| 9 | Care Coordinator | Know a message was delivered and read | F-5 |
| 10 | Care Coordinator | See and retry a failed message | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Read every thread, assign any thread, create and edit groups, open both settings drawers | Nothing. "Me" is fixed as user 1 and a group owner is always "Clinic Admin" |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named clinical staff, coordinators, administrators and triage agents as users and did not say who sees which thread. Decision needed: D-18.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Unread badge | Thread row | Count of unread inbound messages stored on the thread, cleared on open. Seed values are mock |
| Email unread count | Email channel | Starts at 7. **Hardcoded, formula undefined** (owned by the Email module) |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Web form → Client → Process → Task (and website chat widget → Client → Process) | Visitor chat to inbox | Messages from the website simulator appear in the Website channel here. |
| Patient portal ↔ Appointments / Invoices | Patient sends a message | The message arrives in the Companion channel here. The clinician thread is found by client id or by contact name. |
| | Care group to portal | A group created here shows in the portal. The portal also shows groups that contain CL-001 and public groups. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-139 | Should the inbox offer an All channels view, what is the sort rule, and is the number selector a filter, a sender or both? | F-1.3, F-1.6 |
| D-140 | Is open or resolved status with Unread and Assigned to me views intended, which roster is the source, and should assignment notify? | F-1.11, F-2.3, F-2.5 |
| D-18 | Which roles may view all threads, assign them, and edit Website and Companion settings? | F-2.7 |
| D-138 | What are the care group rules: groups outside Companion, Private or Public, archive or auto-delete, and portal visibility? | F-3.4, F-3.8, F-3.9, F-3.10 |
| D-137 | What are the attachment limits and allowed types per channel? | F-4.8 |
| D-141 | What is the source of delivery and read receipts per channel? | F-5.1 |
| D-31 | What should be logged for threads with no linked client? | F-5.3 |
| D-22 | What single rule matches a client to a thread? | F-5.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version. |
