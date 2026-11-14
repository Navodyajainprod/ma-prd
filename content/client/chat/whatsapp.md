---
title: "Chats: WhatsApp Channel"
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
| Module | CHATS: WHATSAPP CHANNEL |
| Route | `/chats?channel=whatsapp` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The WhatsApp view of the Chats inbox with a number switcher, an **Inbox** and **Templates** toggle, a template library with a builder, and a template sender in the composer. |
| **Who uses it** | Care Coordinator (replies, sends templates). Practice Manager (keeps the template library). No role is checked. |
| **Where you start it** | **Chats** in the sidebar. WhatsApp is the default channel. `/chats?tab=templates` opens the Templates view, and a workflow step editor links there. |
| **Where the result goes** | The shared conversation store and the client's Activity timeline. Nothing is sent through WhatsApp or Meta. |
| **How real is it** | 0 features work, 4 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Outreach by WhatsApp | Not connected. Messages stay in the browser store and nothing reaches a patient's phone. The portal does not show WhatsApp threads. | [View Companion Messages](/companion/chat) |
| Client (Clients) | Activity timeline | Each message or template sent is written to the client's Activity timeline as WhatsApp. | [View Clients](/client/clients) |
| Client (Workflows) | Link from a workflow step | A step editor links to this channel's Templates view. | [View Workflows](/client/workflows) |
| Client (Chats) | Shared inbox | Search, assignment, reply, attach and receipts are described on the inbox page. Care groups also appear in this list. | [View Chats Inbox](/client/chat/chat) |

## 1. Module Summary

### The story in one minute

Priya Nair opens **Chats**. WhatsApp is already chosen. A number dropdown lists the clinic's WhatsApp numbers, and she picks the Uptown line. The label changes but the list stays the same. Sarah Johnson's thread has an unread badge. Priya opens it and types a reply. Nothing warns her about the 24 hour window, because the window is forced open for every thread. She opens the gear, presses **Share Template Message** and clicks "Appointment Follow-up". It sends at once, with no preview. The message greets Sarah as "there" because the name placeholder has no data. Then Priya switches to **Templates**, writes a new template and presses **Request approval**. It shows Approved straight away.

### What is real and what is not

- **Real in the prototype:** the thread list and unread badge, search, the Inbox and Templates toggle, creating, editing and deleting templates, and the hidden **New Group** button.
- **Simulated:** the number switcher changes a label only. The 24 hour window is forced open. A template sent from a thread fills unknown fields with "there". **Request approval** approves the template at once. No message leaves the browser.
- **Not built:** the window countdown, expiry banner and freeform lock, the variable form and preview before sending, clickable quick reply buttons, and a remembered number.

### Journey position

```
Staff message or template ─▶ WhatsApp thread ─▶ Client Activity timeline
Template builder ─▶ Request approval (auto-approved) ─▶ Template sender
```

## 2. Feature Requests

### F-1: WhatsApp threads and number switcher

#### 1. What it does
Priya sees every WhatsApp thread with name, snippet, time and an unread badge. The top bar has a number switcher and an **Inbox** and **Templates** toggle. She searches and opens a thread as on any channel.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: WhatsApp thread list | List | One row per thread, including care groups, with unread badge | ◐ Simulated | A browser store with sample data and cross-tab sync stands in for a webhook. Groups are listed here by mistake (G4-E-03) |
| F-1.2: Unread counter | Badge | Clears when the thread is opened | ● Works | |
| F-1.3: Number switcher | Dropdown | Lists numbers from saved WhatsApp integrations plus numbers on threads | ◐ Simulated | Changes only its label. The list is not filtered and the sender does not change (G4-E-01). Decision needed: D-139 |
| F-1.4: Remember the number | Rule | Keep the chosen number between sessions | ○ Not built | The default is reset each time |
| F-1.5: Inbox and Templates toggle | Toggle | Switches between threads and the template library | ● Works | |
| F-1.6: New Group hidden | Rule | No New Group button on WhatsApp | ● Works | |
| F-1.7: Responsible assignment | Modal | Gear then **Assign Responsible**. Sets the assignee and turns the bot off | ◐ Simulated | No audit event and no alert to the assignee (G4-E-04). Decision needed: D-140 |

#### 3. Worked example
Priya picks a clinic line.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Two WhatsApp numbers are listed | Picks the Uptown number | **The label changes. All threads stay listed** |
| 2 | She opens Sarah's thread | Clicks the row | **The unread badge clears** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When patients message different clinic lines, I want to switch numbers, so that I can triage each location apart. |
| F-1-J2 | Care Coordinator | When new messages arrive, I want to see unread badges, so that urgent questions are answered quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the number switcher, **when** a number is picked, **then** only its label changes and every thread stays listed. |
| F-1-2 | **Given** the WhatsApp channel, **then** New Group is hidden and the Inbox and Templates toggle is shown. |
| F-1-3 | **Given** a thread is opened, **then** its unread badge clears. |

### F-2: The 24 hour service window

#### 1. What it does
Meta allows free text only within 24 hours of the patient's last message. The code works the window out from the last inbound message, but then forces every thread to "24h remaining, freeform allowed". The composer never reads it. Priya sees no countdown, no banner and no lock.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Window calculation | Rule | Worked out from the last inbound message, then forced open for every thread | ◐ Simulated | Forced open "per user request" (G4-W-06). Decision needed: D-135 |
| F-2.2: Countdown above the composer | Indicator | Show hours remaining | ○ Not built | (G4-W-06) |
| F-2.3: Expiry banner with Send Template | Banner | Warn when the window has closed | ○ Not built | (G4-W-06) |
| F-2.4: Freeform lock | Rule | Disable text and files when the window has closed | ○ Not built | The composer ignores the window. Decision needed: D-135 |
| F-2.5: Re-open on a new reply | Rule | Unlock and reset the timer when the patient replies | ○ Not built | Nothing to reset |

#### 3. Worked example
Priya writes to a patient who last replied three days ago.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The last inbound message is old | Opens the thread and types | **The composer is open and no warning shows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When the 24 hour window has closed, I want clear guidance to use an approved template, so that delivery does not fail. |
| F-2-J2 | Practice Admin | When reviewing compliance, I want the window rule enforced, so that the clinic avoids carrier penalties. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** any WhatsApp thread, **then** the window is treated as open. No countdown, banner or lock is shown. |
| F-2-2 | **Given** a thread whose last inbound message is older than 24 hours, **when** staff type, **then** freeform text and files are allowed. |

### F-3: Send a template from a thread

#### 1. What it does
Priya opens the composer gear and presses **Share Template Message**. A modal lists templates that are approved or have no status, with name, category and body. She clicks one and it sends at once. There is no preview and no form for variables.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Template picker | Modal | Lists approved or unmarked templates with name, category and body | ● Works | A modal, not a drawer. No search |
| F-3.2: Send on click | Action | Sends the template into the thread | ◐ Simulated | Nothing is delivered. The message is saved as read (G4-E-11) |
| F-3.3: Variable values | Rule | Fills placeholders from data | ◐ Simulated | A test resolver returns "there" for every unknown placeholder (G4-E-18). Decision needed: D-136 |
| F-3.4: Variable form, blocked when empty | Form | Auto-fill from the patient chart and block an empty value | ○ Not built | (G4-W-08) |
| F-3.5: Preview before sending | Preview | Show the exact message | ○ Not built | A preview exists only in the builder (G4-W-10) |
| F-3.6: Quick reply buttons | Display | Buttons on a sent template | ◐ Simulated | Shown as chips that do nothing (G4-W-11) |

#### 3. Worked example
Priya sends a reminder.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah's thread is open | Opens the gear and presses **Share Template Message** | **A list of approved templates opens** |
| 2 | She clicks "Appointment Follow-up" | Clicks the template | **It sends at once and greets Sarah as "there"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator | When I reach out after hours, I want to send an approved reminder with the patient's details, so that outreach is quick and personal. |
| F-3-J2 | Practice Manager | When standardising messages, I want approved wording, so that disclaimers are used every time. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the picker, **then** templates whose status is approved or empty are listed. |
| F-3-2 | **Given** a template is clicked, **then** it is sent at once with no preview or form. |
| F-3-3 | **Given** a placeholder with no data, **then** it is filled with "there". |

### F-4: Template library

#### 1. What it does
Priya switches to **Templates**. A table lists templates, seeded with three defaults. A builder drawer creates and edits them, with variable mapping and a template library to copy from. **Request approval** opens a modal. Submitting it marks the template Approved at once.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Template table | Table | Lists templates with a row menu | ● Works | Stored in the browser |
| F-4.2: Create, edit, delete | Drawer | Builder with a live preview | ● Works | |
| F-4.3: Library | List | Copy a ready made template into your set | ● Works | |
| F-4.4: Variable mapping | Fields | Map each placeholder to a data field | ● Works | Not used when a template is sent (G4-E-18) |
| F-4.5: Request approval | Modal | Marks the template Approved at once | ◐ Simulated | No Meta review (G4-E-19). Decision needed: D-136 |
| F-4.6: Approval states | Rule | States set by Meta | ○ Not built | Decision needed: D-136 |

#### 3. Worked example
Priya adds a template.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She builds "Lab ready" | Saves it | **It is listed in the table** |
| 2 | She presses **Request approval** | Submits | **The status turns Approved at once** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Manager | When the clinic needs a new message, I want to build it and submit it for approval, so that only approved wording is used. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** Request approval is submitted, **then** the template is marked approved with no outside review. |
| F-4-2 | **Given** a new template, **when** it is saved, **then** it is stored in the browser and listed. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Threads and number switcher | F-1.1 – F-1.7 | ● / ◐ / ○ | Threads work from sample data; switcher changes a label. |
| F-2 | 24 hour service window | F-2.1 – F-2.5 | ◐ / ○ | Window forced open; no countdown or lock. |
| F-3 | Send a template | F-3.1 – F-3.6 | ● / ◐ / ○ | Sends on click; unknown fields become "there". |
| F-4 | Template library | F-4.1 – F-4.6 | ● / ◐ / ○ | Builder works; approval is automatic. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | Switch between clinic phone numbers | F-1 |
| 2 | Care Coordinator | See unread badges as messages arrive | F-1 |
| 3 | Care Coordinator | Get guidance when the 24 hour window has closed | F-2 |
| 4 | Practice Admin | Have the window rule enforced | F-2 |
| 5 | Care Coordinator | Send an approved reminder with patient details | F-3 |
| 6 | Practice Manager | Use approved wording every time | F-3 |
| 7 | Practice Manager | Build a template and submit it for approval | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Read and reply to every thread, send templates, build and delete templates, request approval | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named front desk staff, coordinators, medical assistants and the practice manager. It did not say who may approve templates. Decision needed: D-18.

## 5. Metrics and definitions

The unread badge is the only figure here. It counts unread inbound messages on the thread and clears on open. Seed values are mock. The 24 hour window is computed from the last inbound message but forced to "24h remaining" on every thread, so no remaining time is shown.

## 6. Cross-module journeys this module appears in

This channel appears in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-139 | Is the number selector a list filter, the sending number or both, and is it remembered per user? | F-1.3, F-1.4 |
| D-140 | Which roster supplies assignees, and should assignment notify? | F-1.7 |
| D-135 | Should the 24 hour countdown and lock be restored, and in which release? | F-2.1, F-2.4 |
| D-136 | What are the template approval states, who sets them, and what happens when a variable has no value? | F-3.3, F-4.5, F-4.6 |
| D-18 | Which roles may send templates and approve them? | Roles |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version. |
