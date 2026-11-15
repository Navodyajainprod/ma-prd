---
title: "My Tasks: Assigned Clinic and Admin Work Inbox"
product: "client"
module: "tasks"
channel: "my-tasks"
route: "/tasks (My Tasks tab) and /tasks/:taskId"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | TASKS: MY TASKS |
| Route | `/tasks` (My Tasks tab) and `/tasks/:taskId` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A tab on the Tasks page that lists the tasks "assigned to me", plus a detail page where the assignee checks off deliverables one by one. |
| **Who uses it** | Care Coordinator, Physician and other clinic staff who receive work. No role is checked: any signed-in user can open it. |
| **Where you start it** | **Tasks** in the sidebar (`/tasks`, My Tasks is the default tab), a row click, or a **Task Overdue Alert** in the bell. |
| **Where the result goes** | The task's overall status and checklist, which the creator sees in Tasks by me, and a shared bell notification when every deliverable is done. |
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
| Admin | Role-targeted corporate tasks | Not connected. Admin tasks aimed at a clinic role never reach this tab, because the Tasks page hides every Admin-scope task from clinic users. | [View Admin Tasks](/admin/tasks) |
| Client (Tasks by me) | Delegated tasks | Tasks the user hands to others sit in Tasks by me. The same task record is edited there and checked off here. | [View Tasks by me](/client/tasks/tasks-by-me) |
| Companion | Patient task checklist | A patient checks off a task in the portal and this tab's checklist and status read the same record. A task assigned to a patient does not appear here. | [View Companion Tasks](/companion/tasks) |
| Client (Workflows) | Task workflows and automation | Task stages come from a workflow of type task. No automation or workflow step creates a task for this tab. | [View Workflows](/client/workflows) |
| Client (Team settings) | Who counts as me | The tab does not read the team profile. "Assigned to me" is a text match on the signed-in name plus fixed rules. | [View Team](/client/settings/team) |

## 1. Module Summary

### The story in one minute

Priya Nair, a Care Coordinator, opens **Tasks** at 8:30. The **My Tasks** tab is already selected and its label reads **My Tasks (3)**. The table has no Workflow switcher, no **New Task** button and no Stage column. She sees **TSK-101 Verify Patient Insurance Eligibility**, assigned by a colleague, with a progress ring on **CHECKLIST**. She clicks the row and the detail page opens with "Assigned to you". She reads the instructions, opens a PDF and presses **Mark as done** on the first item. The ring moves to 1/2. When she finishes the second item the task flips to Completed and a "Task Completed" notice appears in the bell. Later the bell shows a **Task Overdue Alert** for another task and one click takes her to it.

**Naming note:** the earlier PRD calls the clinic app the "Client Portal" and a task pipeline a "process template". The screen says Client and Workflow. Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the My Tasks table and its columns, search, the hidden manager controls, the detail page with the personal progress ring, per-item check-off with undo, the Task Not Found page, and automatic completion once every responsible person finishes.
- **Simulated:** who counts as "assigned to me" (a name match with hardcoded names), the row **Mark Completed** (it closes the task without touching deliverables), and every notification (one shared bell, no recipient).
- **Not built:** Admin role-targeted tasks arriving here, role control over who can act on a task, and a loading or error state.

### Journey position

```
Admin task (role) ─✕─▶ My Tasks ─▶ Task detail ─▶ Mark as done ─▶ Task Completed ─▶ Bell notice
Web form or workflow ─✕─▶ Task
```

## 2. Feature Requests

### F-1: Assigned inbox

#### 1. What it does
Priya opens the **My Tasks** tab and sees only the tasks that pass the "assigned to me" test. The tab label carries the count. The columns are **TASK ID**, **TASK NAME**, **ASSIGNED BY**, **OBSERVERS**, **DEADLINE** and **CHECKLIST**. **ASSIGNED BY** shows the creator and defaults to "Admin". **CHECKLIST** shows her own done and total items. The table has no Workflow column and no Stage column. A search box filters the rows.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: "Assigned to me" filter | Rule | Shows non-Admin tasks whose assignee, assignee list or responsible people contain the signed-in name, in either direction | ◐ Simulated | Also matches any name containing "alistair" or "lead physician" and any assignee role containing "physician" or "clinician". With no signed-in name the user is "Dr. Alistair Mehta" (G5-E-16) |
| F-1.2: Tab count | Metric | **My Tasks (N)** counts the tasks that pass the filter | ◐ Simulated | Inherits the name match (G5-M-04) |
| F-1.3: Table columns | Table | TASK ID, TASK NAME, ASSIGNED BY, OBSERVERS, DEADLINE, CHECKLIST | ● Works | Workflow and Stage columns are hidden on this tab |
| F-1.4: Search | Search box | Matches title, `TSK-` code, assignee name, assignees, observers, workflow and project | ● Works | The creator's name is not searched. The workflow filter is ignored on this tab (G5-M-05) |
| F-1.5: Admin role-targeted tasks | Hand-off | Admin tasks aimed at a clinic role should arrive here under ASSIGNED BY | ○ Not built | Admin-scope tasks are always hidden from `/tasks` (G5-M-02). Decision needed: D-105 |
| F-1.6: Empty state | State | "No tasks found matching your filters." | ● Works | |
| F-1.7: Loading and error states | State | None exist | ○ Not built | Tasks are stored in the browser, so nothing loads or fails |

#### 3. Worked example
Priya checks her morning list.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A teammate assigned her TSK-101 | Opens **Tasks** | **TSK-101 is listed with the teammate's name under ASSIGNED BY and the tab reads My Tasks (N)** |
| 2 | She wants one task | Types "eligibility" in search | **Only matching rows remain** |
| 3 | Platform Admin sent a task to all Care Coordinators | Looks for it | **It is not listed. Admin tasks never reach this tab** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When I start my shift, I want one list of the tasks assigned to me, so that I can work through them without hunting. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the My Tasks tab, **then** the Workflow switcher, the **New Task** button and the Stage column are not shown. |
| F-1-2 | **Given** a task whose assignee or responsible person contains the signed-in name, **when** the tab opens, **then** the task is listed. A task whose assignee role contains "physician" or "clinician" is also listed for every user. |
| F-1-3 | **Given** an Admin-scope task, **when** the tab opens, **then** the task is not listed, even if its target role matches the user. |
| F-1-4 | **Given** no task matches the search, **then** "No tasks found matching your filters." is shown. |

### F-2: Row actions and guardrails

#### 1. What it does
The row menu offers only **View Details** and **Mark Completed**. Clicking a row, or the task name, opens the detail page and never the edit drawer. There is no **Delete**, no **Share** and no **New Task** on this tab.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Hidden manager controls | Rule | Workflow switcher, New Task, Stage column, Delete and Share are hidden | ● Works | |
| F-2.2: Row click | Navigation | Row, task name or **View Details** opens `/tasks/:taskId` | ● Works | |
| F-2.3: Mark Completed | Row action | Moves the whole task to "Task Completed" with a toast | ◐ Simulated | No deliverable is checked, CHECKLIST still reads 0/3 and the next uncheck reopens the task (G5-E-18). Decision needed: D-108 |
| F-2.4: Role control | Rule | Any signed-in user can act on any task shown | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Priya opens the row menu on TSK-101.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Menu opens | Reads the options | **Only View Details and Mark Completed are listed** |
| 2 | She presses Mark Completed | Confirms nothing else | **The task shows Completed and a toast says Task Completed. Her checklist is unchanged** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When I delegate a compliance chore, I want assignees unable to delete or re-scope it, so that the assignment stays accountable. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a My Tasks row, **when** the user opens the row menu, **then** only View Details and Mark Completed are offered. |
| F-2-2 | **Given** a My Tasks row, **when** the user clicks it, **then** `/tasks/:taskId` opens, not the edit drawer. |
| F-2-3 | **Given** Mark Completed is pressed, **then** the task becomes Completed for all assignees and no deliverable is checked. |

### F-3: Task detail and personal progress

#### 1. What it does
The detail page is a single column. The subtitle reads "Assigned to you • Created <date>". Under it are the `TSK-` code, an **Important** star, a status pill, the description, the deadline (or "No scheduled deadline") and the observers. A ring reads **Your Progress: X/Y Items Completed**. Each deliverable is a card with its image, video, file, link or framed HTML. Priya presses **Mark as done** and the card flips to **Done (Undo)** with a toast.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Assignee header | Display | Subtitle, code, Important star, status pill, deadline, observers. No stage badge, Share or Delete | ● Works | |
| F-3.2: Your Progress ring | Metric | Items the signed-in user checked divided by all items | ● Works | Independent of teammates' copies |
| F-3.3: Mark as done / Undo | Toggle | Checks off or reopens one deliverable for the signed-in user, with a toast | ● Works | |
| F-3.4: Deliverable viewer | Display | Shows images, video, downloadable files, external links and sandboxed HTML | ● Works | |
| F-3.5: Auto-complete | Rule | When every responsible person has checked every item the task becomes Completed and a "Task Completed" notice is raised. Unchecking any item returns it to In Progress | ● Works | The notice goes to the one shared bell (G5-E-29) |
| F-3.6: Observers see completion | Notice | Observers should see completion updates | ◐ Simulated | There is no per-recipient delivery. The bell is shared by whoever uses the browser (G5-E-29). Decision needed: D-107 |
| F-3.7: Task Not Found | State | "Task Not Found" with **Return to Tasks** | ● Works | |
| F-3.8: Creator view for non-assignees | Navigation | A task that fails the assigned test is sent to the edit drawer instead of the detail page | ◐ Simulated | The creator's Overall Completion view cannot be reached this way (G5-E-19). Decision needed: D-108 |

#### 3. Worked example
Priya finishes TSK-101.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Two items, none done | Presses **Mark as done** on item 1 | **The ring reads 1/2 and the card shows Done (Undo)** |
| 2 | She taps the wrong item | Presses **Done (Undo)** | **The item reopens and the ring drops** |
| 3 | She finishes item 2 and she is the only assignee | Presses **Mark as done** | **The status pill shows Completed and a Task Completed notice appears in the bell** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator | While working through a multi-step task, I want to see my own remaining items, so that I finish without disturbing teammates' copies. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a task shown in My Tasks, **when** the user presses Mark as done, **then** Your Progress updates at once and Undo reverses it. |
| F-3-2 | **Given** every responsible person has checked every item, **then** the task is Completed. **When** any item is unchecked, **then** it returns to In Progress. |
| F-3-3 | **Given** a task id that does not exist, **then** the Task Not Found page is shown. |

### F-4: Overdue alerts

#### 1. What it does
When a task passes its deadline, one **Task Overdue Alert** appears in the bell. It names the assignee and the observers and links to the task. The check runs when the page loads and every 60 seconds. It skips completed tasks and Admin tasks.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Overdue alert | Notification | One alert per overdue task, with a link to `/tasks/:taskId` | ◐ Simulated | The alert has no recipient: it goes to the shared bell (G5-E-29). Decision needed: D-107 |
| F-4.2: Move to the Overdue stage | Rule | A passed deadline moves the task to the Task Overdue stage | ○ Not built | Only the alert is raised. Decision needed: D-109 |

#### 3. Worked example
A task's deadline passes at 17:00.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The page is open | Waits up to a minute | **A Task Overdue Alert appears once in the bell** |
| 2 | Priya clicks it | Clicks the notice | **The task detail page opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Care Coordinator | When a task misses its deadline, I want one click from the bell to the task, so that I can finish it quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** an open non-Admin task past its deadline, **then** one Task Overdue Alert is raised and not repeated. |
| F-4-2 | **Given** the alert, **when** it is clicked, **then** `/tasks/:taskId` opens. The task's stage does not change. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Assigned inbox | F-1.1 – F-1.7 | ● / ◐ / ○ | Table and search work; "assigned to me" is a name match; Admin tasks never arrive. |
| F-2 | Row actions and guardrails | F-2.1 – F-2.4 | ● / ◐ / ○ | Manager controls hidden; Mark Completed skips deliverables. |
| F-3 | Task detail and personal progress | F-3.1 – F-3.8 | ● / ◐ | Check-off, undo and auto-complete work; notices have no recipient. |
| F-4 | Overdue alerts | F-4.1 – F-4.2 | ◐ / ○ | One alert per task; no stage move. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | See my assigned tasks in one list | F-1 |
| 2 | Practice Manager | Keep assignees from deleting or re-scoping a task | F-2 |
| 3 | Care Coordinator | See my own remaining items and finish them | F-3 |
| 4 | Care Coordinator | Jump from an overdue notice to the task | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/tasks`, see tasks matching the name test (and any task with a "physician" or "clinician" assignee role), check off items, press Mark Completed | New Task, Delete and Share on this tab |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names the Attending Physician, nurse and Practice Supervisor and says nothing about who may close a task. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| My Tasks (N) | Tab label | Count of non-Admin tasks that pass the "assigned to me" test |
| CHECKLIST | Table | The signed-in user's checked items divided by all items |
| Your Progress | Detail page | Items the signed-in user checked divided by all items |
| Status pill | Detail page | Completed once every responsible person has checked every item, otherwise In Progress |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Web form → Client → Process → **Task** | Submit leads to a task for staff | Not connected. No form, automation or process action creates a task. Tasks are made by hand in Tasks by me. |
| Patient portal ↔ Appointments / Invoices | Patient completes a task | The patient's check-offs update the same task record that this tab reads. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical: Process, Workflow and Pipeline, Client Portal and Client? | Naming note |
| D-12 | Must permissions block each action and direct URLs, and who may close a task? | F-2.4 |
| D-105 | Should Admin role-targeted tasks appear in clinic My Tasks, and how is a role matched to a user? | F-1.5 |
| D-107 | Who receives each task notification? | F-3.6, F-4.1 |
| D-108 | Does Mark Completed close the task for everyone or only my items, and how does a creator reach Overall Completion? | F-2.3, F-3.8 |
| D-109 | Should a passed deadline move the task to Task Overdue? | F-4.2 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version. |
