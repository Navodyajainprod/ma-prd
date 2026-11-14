---
title: "Messages: Care Chat Bot, Clinician and Care Groups"
product: "companion"
module: "chat"
route: "/patient/messages"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | COMPANION |
| Module | MESSAGES: CARE CHAT BOT, CLINICIAN AND CARE GROUPS |
| Route | `/patient/messages` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The patient's message screen: a list with the clinician chat, care groups and the Care Bot, a thread pane with a composer, five Care Bot shortcut cards, and a group information drawer with a **Leave Group** action. |
| **Who uses it** | Patient (reads and sends). Care Coordinator (answers from the clinic side). Dr. Anita Rao appears only as the person a thread is assigned to. |
| **Where you start it** | The **Messages** item in the patient portal, or a link with `?chat=` that opens one conversation. |
| **Where the result goes** | The shared conversation store, so the clinic sees it in the Companion channel of Chats. |
| **How real is it** | 0 features work, 6 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Chats) | Care groups | A group made in Chats shows here at once, from the same browser store. The portal lists a group when the patient is a member, when it contains client CL-001, or when it is public. | [View Companion channel](/client/chat/companion) |
| Client (Chats) | Patient messages | A message sent here is stored in the shared store and shows in the Companion channel of Chats. | [View Chats Inbox](/client/chat/chat) |
| Client (Chats) | Care Bot settings | The full page Care Bot reads the greeting, requirement buttons, bot name and photo from Companion Settings. This Messages screen uses its own five shortcut cards. | [View Companion channel](/client/chat/companion) |
| Client (Tasks) | Task share | A task shared to the client portal posts a plain text message into the patient's chat. | [View Tasks by me](/client/tasks/tasks-by-me) |
| Companion (Tasks) | Group Tasks tab | The group drawer lists tasks tied to the group. | [View Companion Tasks](/companion/tasks) |

## 1. Module Summary

### The story in one minute

Sarah Johnson opens **Messages**. The list shows her clinician first, then her care groups, then the Care Bot. She taps the clinician and types a question about her eye drops. Her message shows a double tick at once. The clinic sees it in Chats. She switches to the Care Bot and taps **Billing & Insurance**. A short text answer comes back after a moment. Then she opens the group "Cataract Recovery", taps the info icon and reads the Members & Admin tab. She presses **Leave Group** and confirms. She is taken to the next chat in her list. Nothing here warns her if she types about chest pain.

### What is real and what is not

- **Real in the prototype:** the conversation list, sending text, the reply quote, the five shortcut cards, the group information drawer and **Leave Group** with its confirmation.
- **Simulated:** every tick is a double tick. A made up clinician thread is shown when the clinic has none. Bot replies are canned text. The Care Bot here is one thread shared by every patient. Attachments keep only a name, size and type. Group visibility is wider than membership.
- **Not built:** unread badges, an out of hours notice, a clinician credential tag, emergency escalation, a 25MB limit, locking the composer in a moderators only group, group archive, and family caregiver accounts.

**Naming note:** the earlier PRD named the bot "Care Chat Bot" and put it first. The screen shows "Care Bot" and puts the clinician first. Decision needed: D-133.

### Journey position

```
Sarah opens Messages ─▶ Clinician / Care group / Care Bot ─▶ Send ─▶ Companion channel in Chats
                                                    └▶ Group info ─▶ Leave Group
```

## 2. Feature Requests

### F-1: The conversation list

#### 1. What it does
Sarah sees three kinds of conversation in a fixed order: the clinician chat, then her care groups, then the Care Bot. There is no button to start a new chat. On a phone the list and the thread are separate views and the link carries `?chat=` for the open one.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: List order | List | Clinician, then care groups, then Care Bot | ● Works | The earlier PRD put the bot first. Decision needed: D-133 |
| F-1.2: Clinician conversation | Item | The first clinic conversation whose client id is the patient, or for a non group whose contact name equals the patient's name | ◐ Simulated | Can pick the patient's own Companion bot conversation (G12-E-30) |
| F-1.3: Invented clinician thread | State | When the clinic has none, a thread from "Dr. Alistair Mehta" with a greeting is shown | ◐ Simulated | Shown to every patient, and bot replies name that doctor (G12-E-29) |
| F-1.4: No new chat | Rule | No control to start a chat with other staff or patients | ● Works | |
| F-1.5: Unread badges | Badge | Show a count of new messages in real time | ○ Not built | The count exists in data but is not shown (G12-I-84) |
| F-1.6: Phone layout | Layout | List and thread are separate views tracked by `?chat=` | ● Works | |

#### 3. Worked example
Sarah opens Messages on her phone.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The list is shown | Reads it | **Clinician first, groups next, Care Bot last** |
| 2 | She taps the clinician | Taps the row | **The thread opens and the link carries the chat id** |
| 3 | She looks for a way to message other staff | Scans the screen | **No new chat control exists** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I open Messages, I want to tell apart my doctor, my care groups and the bot, so that I write in the right place. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a signed-in patient, **when** Messages opens, **then** the list shows the clinician chat, then care groups, then the Care Bot. |
| F-1-2 | **Given** the clinic has no conversation with the patient, **then** an invented thread from "Dr. Alistair Mehta" is shown. |
| F-1-3 | **Given** the list, **then** no control starts a new chat and no unread badge is shown. |

### F-2: The Care Bot

#### 1. What it does
Sarah opens the Care Bot and sees five shortcut cards: **Book an Appointment**, **Billing & Insurance**, **Medical Intake & Questionnaires**, **Connect with Responsible Care Team** and **Check in for Today's Visit**. A tap sends a prepared question. A canned text answer follows after 650 milliseconds. The same bot is also on the full page at `/patient/care-bot`, with its own settings.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Shortcut cards | Cards | Five cards that fill and send a question | ● Works | |
| F-2.2: Keyword replies | Reply | Canned text chosen by words in the message | ◐ Simulated | Plain text only. No button and no live balance (G12-I-86) |
| F-2.3: Check in reply | Reply | "Check In Confirmed" | ◐ Simulated | No appointment is marked (G12-E-26) |
| F-2.4: One shared thread | Rule | The Messages bot is one conversation for all patients | ◐ Simulated | One patient's bot messages are stored where every patient reads them (G12-E-27). Decision needed: D-133 |
| F-2.5: Sender sides | Rule | This screen and the full page bot store the patient's message on opposite sides | ◐ Simulated | The clinic inbox can show swapped sides (G12-E-34) |
| F-2.6: Reply buttons and deep links | Buttons | Link to booking, billing, forms and status | ○ Not built | Replies are plain text |
| F-2.7: Emergency escalation | Rule | Detect chest pain and similar and show 911 guidance | ○ Not built | Patient safety gap (G4-C-07, G12-I-88). Decision needed: D-132 |
| F-2.8: Full page Care Bot | Page | A bot per patient in the Companion channel, using clinic settings | ◐ Simulated | Described on the Companion channel page of Chats |

#### 3. Worked example
Sarah asks the bot about bills and then about chest pain.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She wants her bills | Taps **Billing & Insurance** | **A plain text answer pointing to the Billing tab appears** |
| 2 | She types "severe chest pain" | Presses Send | **The default reply says the care team has the update. No emergency guidance appears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I need to book or check a balance, I want to tap a card, so that I do not type on my phone. |
| F-2-J2 | Patient | When I have a routine question after hours, I want an instant reply, so that I do not wait for the office. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a shortcut card is tapped, **then** its question is sent and a canned reply follows after 650 milliseconds. |
| F-2-2 | **Given** a message with emergency words, **then** the default reply is shown and no emergency guidance appears. |
| F-2-3 | **Given** two patients open the Care Bot in Messages, **then** both read the same conversation. |

### F-3: Messages with the clinician

#### 1. What it does
Sarah writes to her clinician and the clinic sees it in Chats. The header shows the name and a line of text. Her own messages always show a double tick. A clinician reply from Chats appears in her thread.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Send a message | Composer | Adds the message on the patient side of the shared conversation | ◐ Simulated | Shared browser store, no server |
| F-3.2: Clinician header | Header | Name and a line of text | ◐ Simulated | No credentials or verified badge. The fallback name is fixed (G12-I-90) |
| F-3.3: Ticks | Glyph | A double tick on every patient message | ◐ Simulated | No real sent, delivered or read state (G12-E-31) |
| F-3.4: Clinician reply | Hand-off | A reply sent in Chats shows in the thread | ● Works | |
| F-3.5: Out of hours notice | Notice | Show the clinic's response hours | ○ Not built | Needs a source for clinic hours (G12-I-92). Decision needed: D-133 |
| F-3.6: Clinician attribution tag | Tag | Show name and credentials on each reply | ○ Not built | |

#### 3. Worked example
Sarah asks a dosage question.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The clinician thread is open | Types a question and presses Send | **The message shows a double tick at once** |
| 2 | Priya replies in Chats | Sends from the Companion channel | **The reply appears in Sarah's thread** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I have a non urgent medical question, I want to message my doctor, so that I get advice without a visit. |
| F-3-J2 | Patient | When I get an answer, I want to see who wrote it, so that I know it came from my care team. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a patient message is sent, **then** it shows a double tick whatever happens next. |
| F-3-2 | **Given** a reply from the clinic, **then** it appears in the thread with the clinic's name and no credential tag. |

### F-4: Care groups

#### 1. What it does
Care groups made in Chats appear under the clinician chat. Sarah reads messages from several people and can post. The list does not limit groups to the ones she belongs to.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Group list | List | Groups where the patient is a member, or that contain CL-001, or are public, minus groups she left | ◐ Simulated | Any patient sees groups they do not belong to (G12-E-28, G4-E-07). Decision needed: D-138 |
| F-4.2: Multi author stream | Stream | Messages from several people | ● Works | |
| F-4.3: Posting limit | Rule | A moderators only group locks the composer | ○ Not built | The composer is always open (G12-E-32, G4-E-09). Decision needed: D-138 |
| F-4.4: Archive | Rule | An archived group is closed to the patient | ○ Not built | No archive exists. Decision needed: D-138 |
| F-4.5: Caregiver accounts | Role | Family caregivers use the screen | ○ Not built | No caregiver sign-in or role (G12-I-100). Decision needed: D-46 |

#### 3. Worked example
Sarah checks her groups.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A group is public but she is not a member | Opens Messages | **The group is listed for her** |
| 2 | A group allows moderators only | Types in it | **The message posts** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When I take part in therapy, I want one group with all my clinicians, so that everyone stays aligned. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a group in the store, **when** the patient is a member, contains CL-001 or the group is public, **then** it is listed unless she left it. |
| F-4-2 | **Given** a moderators only group, **then** the patient composer is open. |

### F-5: Replies and attachments

#### 1. What it does
Sarah hovers or taps a message, presses Reply and sees a banner with the quote. She can attach a file with the paperclip. The sent bubble shows the quote and a file card.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Reply with quote | Action | A banner above the composer and a quote block on the sent bubble | ● Works | |
| F-5.2: Attachment | Upload | A staged chip, then a file card | ◐ Simulated | Only name, size and type are kept. The file is not sent (G12-E-33). Decision needed: D-137 |
| F-5.3: 25MB limit | Rule | Reject a larger file with an error | ○ Not built | No size check (G12-I-97). Decision needed: D-137 |

#### 3. Worked example
Sarah sends a lab report.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She picks lab_results.pdf | Taps the paperclip | **A chip shows its name and size** |
| 2 | She sends | Presses Send | **A file card shows. The clinic gets the name only, not the file** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Patient | When I answer a question, I want to quote it, so that my doctor knows what I mean. |
| F-5-J2 | Patient | When I have a lab report, I want to attach it, so that my care team can review it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** Reply is pressed, **when** a message is sent, **then** the bubble carries a quote block. |
| F-5-2 | **Given** a file of any size is attached and sent, **then** a card shows and no file is delivered. |

### F-6: Group information and Leave Group

#### 1. What it does
The info icon in a group header opens a drawer with three tabs: **Members & Admin**, **Files** and **Tasks**. A **Leave Group** button asks for confirmation. After she confirms, Sarah is removed from the group's members and the group stays hidden for her on this browser.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-6.1: Info drawer | Drawer | Right side drawer with a member search | ● Works | |
| F-6.2: Members & Admin tab | List | Members with roles | ● Works | |
| F-6.3: Files tab | List | Files shared in the group, with a download icon | ◐ Simulated | Download only shows a toast. Files are name only |
| F-6.4: Tasks tab | List | Tasks tied to the group | ● Works | |
| F-6.5: Leave Group | Button | Confirmation, then removes the patient and CL-001 from the members and hides the group | ● Works | The hidden list is kept in this browser only |
| F-6.6: After leaving | Rule | The next chat in the list opens and a toast confirms | ● Works | |

#### 3. Worked example
Sarah leaves a group.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The group info drawer is open | Presses **Leave Group** | **A confirmation dialog appears** |
| 2 | She confirms | Presses confirm | **A toast says she left. The next chat opens** |
| 3 | She changes her mind | Presses cancel | **She stays in the group** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-6-J1 | Patient | When I need an old care guide, I want a files list, so that I do not scroll through messages. |
| F-6-J2 | Patient | When my program ends, I want to leave the group, so that my list stays tidy. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-6-1 | **Given** a group chat, **when** the info icon is pressed, **then** a drawer opens with Members & Admin, Files and Tasks. |
| F-6-2 | **Given** Leave Group is confirmed, **then** the patient is removed from the member list, the group is hidden for her and the next chat opens. |
| F-6-3 | **Given** the Files tab, **when** download is pressed, **then** a toast shows and no file is saved. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Conversation list | F-1.1 – F-1.6 | ● / ◐ / ○ | Fixed order; invented clinician thread; no unread badges. |
| F-2 | Care Bot | F-2.1 – F-2.8 | ● / ◐ / ○ | Cards work; canned text; shared thread; no emergency path. |
| F-3 | Messages with clinician | F-3.1 – F-3.6 | ● / ◐ / ○ | Send works; ticks always double. |
| F-4 | Care groups | F-4.1 – F-4.5 | ● / ◐ / ○ | Groups wider than membership; no posting lock. |
| F-5 | Replies and attachments | F-5.1 – F-5.3 | ● / ◐ / ○ | Quote works; file not delivered. |
| F-6 | Group info and Leave Group | F-6.1 – F-6.6 | ● / ◐ | Drawer and leave work; download is a toast. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Tell apart my doctor, groups and the bot | F-1 |
| 2 | Patient | Tap a card instead of typing | F-2 |
| 3 | Patient | Get an instant reply after hours | F-2 |
| 4 | Patient | Message my doctor with a non urgent question | F-3 |
| 5 | Patient | See who wrote an answer | F-3 |
| 6 | Patient | Keep one group with all my clinicians | F-4 |
| 7 | Patient | Quote the question I answer | F-5 |
| 8 | Patient | Attach a lab report | F-5 |
| 9 | Patient | Find an old care guide in a files list | F-6 |
| 10 | Patient | Leave a group when my program ends | F-6 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Patient in the portal | Send messages, use the bot, read and post in listed groups, leave groups | Starting a new chat |
| Any patient | Also sees public groups and groups that contain CL-001, and the shared Care Bot thread | Nothing |
| Family caregiver | Nothing separate: no caregiver sign-in or role exists | Not applicable |

The earlier PRD named authenticated patients and designated family caregivers. Decision needed: D-46.

## 5. Metrics and definitions

No metric is shown on this screen. A count of unread messages exists in the data but is not displayed.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal ↔ Appointments / Invoices | Staff shares a task to the Client Portal | A plain text message is posted in the patient's chat. The default recipient is CL-001 when the assignee is not a contact. |
| | Patient sends a message | The message reaches the Companion channel in Chats. The clinician thread is found by client id or by contact name. Groups show for members, CL-001 and public groups. The bot is one shared conversation. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-133 | What is the runtime for bot or human first, channel order, one thread per patient for the bot, and clinic hours? | F-1.1, F-2.4, F-3.5 |
| D-132 | What are the emergency keywords, wording and staff alert? | F-2.7 |
| D-138 | What are the care group rules, including public groups, archive and leaving? | F-4.1, F-4.3, F-4.4 |
| D-137 | What are the attachment limits and allowed types? | F-5.2, F-5.3 |
| D-46 | What is the patient sign-in model, and do caregivers have accounts? | F-4.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version. |
