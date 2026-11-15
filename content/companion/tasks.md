---
title: "Patient My Tasks, Care Protocols and Live Sync"
product: "companion"
module: "tasks"
route: "/patient/tasks and /patient/tasks/:taskId"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | COMPANION |
| Module | TASKS |
| Route | `/patient/tasks` and `/patient/tasks/:taskId` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A patient task list with Action Needed and Done counts, and a detail screen where the patient checks off numbered deliverables with images, video, files, links and instruction blocks. |
| **Who uses it** | Patient. The clinic's Care Coordinator creates the tasks. |
| **Where you start it** | **Tasks** in the portal drawer, the recent tasks card on Today, a **Task Assigned** chat message, or a direct link. |
| **Where the result goes** | The same task record the clinic reads in Tasks by me. A completion raises a notice in the shared bell. |
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
| Client (Tasks by me) | Assignment and live completion | A task made for **Contacts** shows in each chosen patient's list. Several contacts can be picked, and a Category with nobody ticked assigns every contact in it. The patient's check-offs and the auto-completion are written to the same browser store the clinic reads. The clinic picks patients from a static catalog. | [View Tasks by me](/client/tasks/tasks-by-me) |
| Companion (Chat) | Task Assigned message | **Share** then **Client Portal** posts a plain text message "Task Assigned" with title, stage, deadline and a link. It is text, not a card. | [View Companion Chat](/companion/chat/chat) |
| Companion (Today) | Recent tasks | Today shows the three most recent tasks with the same visibility rules. | [View Today](/companion/today) |
| Admin | Corporate task firewall | Admin tasks are left out of the list and a direct link shows **Task Not Available**. Sharing an Admin task to the Client Portal can still put it in a chat. | [View Admin Tasks](/admin/tasks) |
| Client (Workflows) | Tasks from automation | Not connected. No automation or form creates a patient task, and the refill-to-task idea in Pharmacy is not built. | [View Pharmacy](/companion/pharmacy) |

## 1. Module Summary

### The story in one minute

Sarah Johnson opens **Tasks** in her portal the evening before her cataract surgery. The header shows **Action Needed** and **Done** counts, and the **Action Needed** tab is selected. A row reads "Complete Intake Medical History", with a ring at 2/3 and a due date. Titles carry no `TSK-` code and no bracket tags. She taps the row. The detail screen shows "Assigned by your clinical care team" and three numbered items. She plays the fasting video under item 3, reads the instruction block and presses **Mark as done**. The ring fills, a toast appears and the task becomes Completed. Priya Nair, the Care Coordinator, sees the same task finished on her side.

### What is real and what is not

- **Real in the prototype:** the list with counts, tabs and search, the clean titles, the detail screen with Mark as done and Undo, the rich resource cards, the live sync with the clinic (one shared browser store) and the lock screen.
- **Simulated:** which tasks a patient sees (a name-contains match, and portal tasks with no named patient show for everyone), the notice to the clinic (a shared bell with no recipient), and link and file addresses that are not checked.
- **Not built:** a real per-patient identity check, a Task Assigned card in chat, tasks created from refills or automation, and a loading or error state.

### Journey position

```
Staff creates task ─▶ Patient list ─▶ Detail ─▶ Mark as done ─▶ Task Completed ─▶ Clinic Tasks by me
Staff Share ─▶ Chat text "Task Assigned" ─▶ Patient list
```

## 2. Feature Requests

### F-1: Task list, counts and search

#### 1. What it does
Sarah opens **Tasks** and sees two counts, **Action Needed** and **Done**. Three tabs, **Action Needed (N)**, **Completed (N)** and **All Tasks (N)**, sit above a **Search deliverables...** box. Each row has a ring (X/Y done), an Important star, a cleaned title, a due date and a status pill. With nothing to show the screen says "All Caught Up!". Today also shows her three most recent tasks.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Action Needed and Done counts | Metric | Count of tasks by the patient's own completed deliverables | ● Works | Updates as items are checked |
| F-1.2: Tabs and search | Filter | Action Needed (default), Completed, All Tasks, with search over cleaned title, description and deliverable titles | ● Works | |
| F-1.3: Title cleaning | Rule | Drops a leading `[tag]` and a `TSK-123:` prefix | ● Works | |
| F-1.4: Row card | Row | Ring, star, due date and status pill. Tapping opens `/patient/tasks/:taskId` | ● Works | |
| F-1.5: Empty states | State | "All Caught Up!" or "No matching tasks found" | ● Works | |
| F-1.6: Which tasks a patient sees | Rule | Never Admin tasks. Portal-scope or client-contact tasks assigned by id, by a name that contains the patient's name, in the assignee lists, or portal tasks with no named person | ◐ Simulated | A short name such as "Ann" matches "Joanna". Portal tasks with no named patient show for everyone (G12-E-36). Decision needed: D-106 |
| F-1.7: Recent tasks on Today | Card | The three most recent tasks with progress | ● Works | Same rules as this list |
| F-1.8: Loading and error states | State | None exist | ○ Not built | Tasks are stored in the browser |

#### 3. Worked example
Sarah prepares for her visit.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | List opens | Reads the header | **Action Needed shows 2 and Done shows 1** |
| 2 | She wants the intake task | Types "history" in search | **Only matching tasks remain, titles without TSK codes** |
| 3 | She finishes everything | Opens the list | **The Action Needed tab shows "All Caught Up!"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I prepare for a visit, I want a clean list of what still needs my action, so that I do not miss a step. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a task title with `TSK-123:` or a `[tag]` prefix, **then** the portal shows the title without it. |
| F-1-2 | **Given** a tab choice, **then** the rows match the patient's own completion state. |
| F-1-3 | **Given** a patient named "Ann", **then** a task assigned to a name containing "ann" is also shown to her. |
| F-1-4 | **Given** a portal task with no named patient, **then** every patient sees it. |

### F-2: Task detail and live sync

#### 1. What it does
Sarah taps a row. The page shows **Back to My Tasks**, a **Priority Care** badge when the task is important, the title, "Assigned by your clinical care team • <date>", a progress ring and "X/Y items completed (Z%)". Numbered cards list the steps. **Mark as done** turns a card green and a toast appears. **Completed (Undo)** reverses it.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Header and progress | Display | Badge, title, assigned-by line, ring and progress text. No clinic stage shows | ● Works | |
| F-2.2: Mark as done and Undo | Toggle | Records this patient's completion and time per item, with a toast | ● Works | |
| F-2.3: Auto-close and reopen | Rule | When all responsible people are done the task is Completed. Undo reopens it | ● Works | |
| F-2.4: Sync to the clinic | Hand-off | The clinic's table and breakdown read the same record | ● Works | One browser store, so it works in one browser only |
| F-2.5: Notice to the clinic | Notice | A "Task Completed" notice is raised | ◐ Simulated | It has no recipient and goes to the shared bell (G5-E-29). Decision needed: D-107 |

#### 3. Worked example
Sarah finishes the third item.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Two of three done | Presses **Mark as done** on item 3 | **The ring shows 100 percent, 3/3 items completed, and the task is Completed** |
| 2 | She tapped by mistake | Presses **Completed (Undo)** | **The item reopens and the task returns to Action Needed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I finish a step my doctor asked for, I want one tap to check it off and undo it, so that my care team sees it. |
| F-2-J2 | Care Coordinator | After I assign a task to a patient, I want to see their progress, so that I know whether to follow up. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a task detail, **when** Mark as done is pressed, **then** X/Y and the percent update at once and the clinic side reads the new state. |
| F-2-2 | **Given** all responsible people are done, **then** the task is Completed. **When** Undo is pressed, **then** it returns to Action Needed. |

### F-3: Rich resources in each step

#### 1. What it does
Clinic-authored deliverables render in the patient's card. Sarah sees images, plays video with controls, downloads a file, opens a link and reads a framed **Clinical Instructions & Protocol** block.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Image and video | Display | Inline image and a player with controls | ● Works | |
| F-3.2: File download and link | Display | A file card with name and size, and a link opening in a new tab | ◐ Simulated | Link and file addresses are not checked to be web addresses (G12-E-37) |
| F-3.3: Instruction block | Display | Formatted HTML in a framed, scrollable box | ● Works | |

#### 3. Worked example
Sarah follows a recovery routine.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Item 1 has a video | Plays it in the card | **It plays inline** |
| 2 | Item 2 has a protocol | Reads the box | **A framed checklist shows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When a step needs a video or handout, I want it inside the step, so that I do not search my email. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a step authored with image, video, file, link or HTML, **then** the matching card renders in the detail screen. |
| F-3-2 | **Given** a link address that is not http or https, **then** it is still placed in the link. |

### F-4: Privacy scoping and lock screen

#### 1. What it does
The portal keeps Admin tasks out of the list. A direct link to a missing, Admin or unmatched task shows **Task Not Available** with a lock icon and **Return to My Tasks**. The screen shows no task content.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Admin exclusion | Rule | Admin tasks never appear in the list or the detail | ● Works | The Admin Share drawer can still post one into a chat (G5-E-26) |
| F-4.2: Patient match guard | Rule | Matches the signed-in patient by id or name contains | ◐ Simulated | Loose name match. The "no active patient" denial can never trigger because a visitor with no session becomes the first client (G12-E-36, unverified) |
| F-4.3: Task Not Available | State | Lock screen for missing, Admin or unmatched tasks | ● Works | |
| F-4.4: Tasks from refills | Hand-off | A refill request creates a task for the prescriber | ○ Not built | Described in the Pharmacy PRD, nothing exists (G12-I-109) |

#### 3. Worked example
A patient opens an Admin task link.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Link to an Admin task | Opens it | **Task Not Available and Return to My Tasks. No title shows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When I open a task link from a message, I want to see only my own tasks, so that my care stays private. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** an Admin-scope task, **then** it is not listed and its link shows Task Not Available. |
| F-4-2 | **Given** a task whose name contains the patient's name, **then** it is treated as theirs. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Task list, counts and search | F-1.1 – F-1.8 | ● / ◐ / ○ | List works; visibility uses a loose name match. |
| F-2 | Task detail and live sync | F-2.1 – F-2.5 | ● / ◐ | Check-off and sync work; notice has no recipient. |
| F-3 | Rich resources in each step | F-3.1 – F-3.3 | ● / ◐ | Resources render; links unchecked. |
| F-4 | Privacy scoping and lock screen | F-4.1 – F-4.4 | ● / ◐ / ○ | Admin firewall works; patient match is loose. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | See what still needs my action | F-1 |
| 2 | Patient | Check off a step and undo it | F-2 |
| 3 | Care Coordinator | See a patient's progress | F-2 |
| 4 | Patient | See a video or handout inside the step | F-3 |
| 5 | Patient | See only my own tasks | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Patient (signed in to the portal) | See tasks that match by id or name, check off items | Admin tasks, tasks that do not match |
| Another patient with a similar name | See a task whose name contains theirs | Nothing further |
| Signed-out visitor | Treated as the first client in the list (unverified, G12-E-01) | Nothing |

The earlier PRD promises "zero leaked task content" and "cross-patient isolation". The prototype does not enforce a real identity. Decision needed: D-106.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Action Needed and Done | List header | Count of tasks by the patient's own completed deliverables compared with all deliverables |
| Row ring (X/Y done) | List | Deliverables this patient checked out of all deliverables |
| X/Y items completed (Z%) | Detail | The same ratio, with the percent |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal ↔ Appointments / Invoices | Staff creates a task for a client contact | Reaches the list by id or name contains. Portal tasks with no named patient show for everyone. |
| | Patient completes a task | Auto-completes the task and raises a notice in the shared bell. |
| | Staff shares a task to the Client Portal | A plain text message with a link, not a card. |
| Web form → Client → Process → Task | Task for staff | Not connected. No automation creates a task. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-106 | May a portal task with no named patient show for everyone, and is Admin task sharing to patients disabled? | F-1.6, F-4.1, F-4.2 |
| D-107 | Who receives each task notification, and should the chat notice be a card? | F-2.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Updated to the task UI changed on 2026-11-13 and 2026-11-14 (the contact picker now takes several contacts or a whole category). |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version. |
