---
title: "Chats: SMS Channel"
product: "client"
module: "chat"
channel: "sms"
route: "/chats?channel=sms"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | CHATS: SMS CHANNEL |
| Route | `/chats?channel=sms` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The SMS view of the Chats inbox: a thread list for text conversations, the shared message stream and composer, and an inbox number dropdown. |
| **Who uses it** | Care Coordinator (triage, reminders). Front-desk Staff (text replies). No role is checked. |
| **Where you start it** | **Chats** in the sidebar, then **SMS** in the channel picker. The address `/chats?channel=sms` does not select SMS: only the email value is read from the address. |
| **Where the result goes** | The shared conversation store and the client's Activity timeline. No carrier is connected. |
| **How real is it** | 0 features work, 2 are partly simulated, 2 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Dual-channel patient messaging | Not connected. SMS threads live in the same browser store as the portal, but no text is sent to a phone and a portal user never sees an SMS thread. | [View Companion Messages](/companion/chat) |
| Client (Clients) | Activity timeline and client matching | A sent SMS is written to the client's Activity timeline. A client is matched to a thread by id, then by a name or phone fragment in either direction. | [View Clients](/client/clients) |
| Client (Chats) | Shared inbox | SMS uses the inbox, search, assignment, reply and attach features described on the inbox page. | [View Chats Inbox](/client/chat/chat) |

## 1. Module Summary

### The story in one minute

Priya Nair picks **SMS** in the channel picker. The top bar shows a number dropdown with the clinic's SMS numbers. She picks one and the label changes, but the list does not. She types "555" in the search box and the list narrows to numbers that contain it. She opens Sarah Johnson's thread and reads that Sarah is running late. She types a reply and presses Enter. The bubble shows a double check straight away. She opens the gear and sees **Share Template Message** and **Assign Responsible**. The template list offers WhatsApp templates. There is no counter for text length and nothing stops a message to someone who texted STOP.

### What is real and what is not

- **Real in the prototype:** the SMS thread list, search by name or phone, the unread badge, and the hidden **New Group** button.
- **Simulated:** the number dropdown changes only its label. Threads and messages come from a browser store and no carrier is involved. Sent messages are marked read at once.
- **Not built:** number validation, STOP and START handling, the opt-out banner and composer lock, the opt-out audit log, the segment counter, the Copy, Quote and Resend actions, and failure retry.

### Journey position

```
Staff or patient text ─▶ SMS thread ─▶ Reply / template / assign ─▶ Client Activity timeline
```

## 2. Feature Requests

### F-1: SMS threads and the inbox number

#### 1. What it does
Priya sees one row per SMS thread with name, last message, time and unread badge. She searches by name or phone digits. The top bar lists the distinct inbox numbers found on SMS threads. Selecting one changes the label only.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: SMS thread list | List | One row per SMS thread with name, snippet, time and unread badge | ◐ Simulated | From a browser store with sample data. No webhook or carrier feeds it |
| F-1.2: Search | Search box | Substring match on name, phone and last message | ● Works | |
| F-1.3: Unread counter | Badge | Clears when the thread is opened | ● Works | |
| F-1.4: Inbox number dropdown | Dropdown | Lists the distinct numbers on SMS threads | ◐ Simulated | Changes only the label. The list is not filtered and the sending number does not change (G4-E-01). Decision needed: D-139 |
| F-1.5: Phone number validation | Rule | Check E.164 formatting before sending | ○ Not built | |
| F-1.6: Link a thread to a client | Rule | Each thread carries a client id. Lookups from other screens match by id, then by name or phone fragment | ◐ Simulated | "Sarah" matches "Sarah Johnson". The inline drawer can fall back to client CL-001 (G4-E-16). Decision needed: D-22 |
| F-1.7: Link or create a contact in a thread | Action | Link an unknown number to a client, or create a contact | ○ Not built | Decision needed: D-22 |
| F-1.8: Empty state | State | "No conversations found." when search matches nothing | ● Works | |

#### 3. Worked example
Priya finds a late patient.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | SMS is chosen | Types "Sarah" in search | **The list narrows to Sarah's thread** |
| 2 | She opens it | Clicks the row | **The unread badge clears** |
| 3 | She picks another inbox number | Chooses it in the dropdown | **The label changes. The same threads stay listed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front-desk Staff | When a patient without a smartphone needs an update, I want to text them, so that they get care news without an app. |
| F-1-J2 | Care Coordinator | When triaging a call, I want to search by phone number, so that I can open the right thread at once. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** SMS is chosen, **when** a number is typed in search, **then** threads whose phone contains it are listed. |
| F-1-2 | **Given** the inbox number dropdown, **when** a number is picked, **then** only the label changes. |
| F-1-3 | **Given** a thread, **when** it is opened, **then** its unread badge clears. |

### F-2: Opt-out compliance

#### 1. What it does
The earlier PRD wanted STOP and START words to lock and unlock the composer, with a banner and an audit log. None of it is built. A patient who texts STOP is not recognised, and Priya can still send.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: STOP interceptor | Rule | Detect STOP, UNSUBSCRIBE and CANCEL and flag the contact | ○ Not built | Compliance gap (G4-S-07) |
| F-2.2: Opt-out banner and composer lock | Banner | "Patient has opted out of SMS messaging" and a disabled composer | ○ Not built | (G4-S-07) |
| F-2.3: Re-opt-in on START or UNSTOP | Rule | Re-enable sending | ○ Not built | (G4-S-07) |
| F-2.4: Opt-in and opt-out audit log | Log | Immutable log of each change | ○ Not built | (G4-S-08) |

#### 3. Worked example
A patient replies STOP.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient texts STOP | Priya opens the thread | **The thread looks normal. No banner, no lock** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When a patient asks to stop texts, I want sending blocked and logged, so that carrier and TCPA rules are met. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** an inbound message that says STOP, **then** nothing changes: the composer stays open and no banner shows. |

### F-3: Message length and segment counter

#### 1. What it does
The earlier PRD wanted a live count of characters and text segments while typing. The composer has no counter.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Character and segment counter | Display | Show characters and segments, 160 per segment | ○ Not built | (G4-S-09) |
| F-3.2: Unicode and emoji detection | Rule | Switch to 70 characters per segment | ○ Not built | (G4-S-09) |
| F-3.3: Long message warning | Badge | Warn above three segments | ○ Not built | (G4-S-09) |

#### 3. Worked example
Priya types a long reminder.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A 350 character message | Types it | **No count appears and Send stays available** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Front-desk Staff | When drafting a reminder, I want to see its length in segments, so that I keep it short and cheap. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** any text in the SMS composer, **then** no character or segment count is shown. |

### F-4: Composer, gear menu and top bar

#### 1. What it does
The composer sends on Enter or Send. The gear holds **Share Template Message** and **Assign Responsible**. **New Group** is hidden on SMS. Reply is a hover icon on each bubble.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: New Group hidden | Rule | No New Group button on SMS | ● Works | |
| F-4.2: Assign Responsible | Modal | Sets the assignee and turns the bot off | ◐ Simulated | Roster issues are on the inbox page (G4-E-04). Decision needed: D-140 |
| F-4.3: Share Template Message | Modal | Lists WhatsApp templates and sends one at once | ◐ Simulated | SMS has no templates of its own. The send is logged as WhatsApp (G4-E-17, G4-E-12). Decision needed: D-136 |
| F-4.4: Send | Button | Sends text or a file, marks it read at once | ◐ Simulated | (G4-E-11) |
| F-4.5: Copy, Quote and Resend actions | Menu | Per message actions | ○ Not built | The gear holds other items. Decision needed: D-142 |
| F-4.6: Failure reason and retry | Banner | Show carrier errors with a retry | ○ Not built | (G4-S-13) |

#### 3. Worked example
Priya replies and assigns.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah's thread is open | Types "Thank you for letting us know" and presses Enter | **The bubble shows a double check at once** |
| 2 | She opens the gear | Looks at the options | **Share Template Message and Assign Responsible are listed. Templates are the WhatsApp ones** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Care Coordinator | When triaging texts, I want a clean top bar without group buttons, so that actions match what SMS can do. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** the SMS channel, **then** New Group is hidden. |
| F-4-2 | **Given** the gear menu, **then** it offers Share Template Message and Assign Responsible only. |
| F-4-3 | **Given** a failed send, **then** no failure or retry control exists. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | SMS threads and inbox number | F-1.1 – F-1.8 | ● / ◐ / ○ | Search and unread work; number dropdown is a label only. |
| F-2 | Opt-out compliance | F-2.1 – F-2.4 | ○ Not built | No STOP or START handling. |
| F-3 | Segment counter | F-3.1 – F-3.3 | ○ Not built | No counter. |
| F-4 | Composer and top bar | F-4.1 – F-4.6 | ● / ◐ / ○ | WhatsApp templates offered on SMS; no retry. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front-desk Staff | Text patients without a smartphone | F-1 |
| 2 | Care Coordinator | Find a thread by phone number | F-1 |
| 3 | Practice Admin | Block and log texts after STOP | F-2 |
| 4 | Front-desk Staff | See message length in segments | F-3 |
| 5 | Care Coordinator | Use a clean SMS top bar | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Read and reply to every SMS thread, assign, send templates | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named receptionists, coordinators and billing staff and added a compliance officer. Decision needed: D-18.

## 5. Metrics and definitions

The unread badge is the only figure on this channel. It counts unread inbound messages on the thread and clears on open. Seed values are mock. No other metric is shown.

## 6. Cross-module journeys this module appears in

This channel appears in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-139 | Is the number selector a list filter, the sending number or both, and is it remembered per user? | F-1.4 |
| D-22 | What single rule links a thread to a client, and how is an unknown number linked or created? | F-1.6, F-1.7 |
| D-140 | Which roster supplies assignees, and should assignment notify? | F-4.2 |
| D-136 | Are templates allowed on SMS or on WhatsApp only? | F-4.3 |
| D-142 | What belongs in per-message actions and where do they live? | F-4.5 |
| D-18 | Which roles may view and assign threads? | Roles |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version. |
