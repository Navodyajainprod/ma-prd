---
title: "Tasks by me: Team Delegation, Patient Tasks and Sharing"
product: "client"
module: "tasks"
channel: "tasks-by-me"
route: "/tasks (Tasks by me tab)"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | TASKS: TASKS BY ME |
| Route | `/tasks` (Tasks by me tab) |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A tab on the Tasks page with a table of delegated tasks, a two-step **New Task** composer with a multimedia Task Studio, and a Share drawer. |
| **Who uses it** | Care Coordinator (creates and follows tasks for staff and patients). Practice Manager (oversees). No role is checked: any signed-in user sees and changes every task on the tab. |
| **Where you start it** | **Tasks** in the sidebar, then the **Tasks by me** tab and **New Task**. A row click opens the edit drawer. |
| **Where the result goes** | Staff My Tasks (by name match), the patient's Companion task list, and the patient's Companion chat when shared. A shared bell raises notices. |
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
| Companion | Patient task list | A task created for a **Client Contact** is saved with portal scope and appears in that patient's task list. The patient's check-offs flow back to this tab. The contact list is a static catalog, not the live Clients. | [View Companion Tasks](/companion/tasks) |
| Client (Chats) | Share to Client Portal | **Share** then **Client Portal** posts a plain text message "Task Assigned" with title, stage, deadline and the link `/patient/tasks` into the patient's Companion chat, and raises a bell notice. It is text, not a card. | [View Companion Chat](/client/chat/companion) |
| Client (My Tasks) | Incoming work | A task whose assignee matches the signed-in name shows in My Tasks. Everything else, including other staff's and patients' tasks, shows here. | [View My Tasks](/client/tasks/my-tasks) |
| Client (Workflows) | Task workflows and automation | Task pipelines and stages come from Workflows. Staff come from the live team list. No automation or workflow step creates tasks. | [View Workflows](/client/workflows) |
| Client (Team settings) | Staff list | The Team Member picker reads the team list. | [View Team](/client/settings/team) |
| Admin | Admin tasks | Tasks created here never appear in `/admin/tasks`. Admin tasks never appear here. | [View Admin Tasks](/admin/tasks) |

## 1. Module Summary

### The story in one minute

Priya Nair, a Care Coordinator, opens the **Tasks by me** tab. The label reads **Tasks by me (N)**. She presses **New Task**, types "Pre-op intake" and picks a Workflow Pipeline. She chooses **Client Contact**, picks Sarah Johnson and leaves the deadline at tomorrow 17:00. On the second step, **Task Studio**, she adds a video, a PDF and an instruction block, then checks the **Preview**. She saves. The task appears in the table at its first stage, and in Sarah's portal task list. Priya clicks a stage on the bar to move it. She presses **Share** and **Client Portal**, and a plain text "Task Assigned" message lands in Sarah's chat. She notices the table also lists tasks other staff created.

**Naming note:** the earlier PRD calls the screen's Workflow a process template and the clinic app the Client Portal. Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the table with its columns, the Workflow switcher, the clickable stage bar, the two-step composer with validation, Task Studio and Preview, delivery to the patient's task list, the Client Portal share into chat, and auto-completion.
- **Simulated:** which tasks the tab shows (every non-Admin task not assigned to me), the contact list (static), SMS, WhatsApp and Email sharing (a success toast only), recurrence (saved, never run), and the default "Assigned Staff" when nobody is picked.
- **Not built:** the creator's Overall Completion and breakdown view (unreachable), recurring task creation, automation that creates tasks, ownership and delete rules, and a loading or error state.

### Journey position

```
Tasks by me ─▶ New Task ─▶ Task Studio ─▶ Saved ─┬▶ Staff My Tasks (name match)
                                                 ├▶ Patient task list (Companion)
                                                 └▶ Share ─▶ Companion chat text
```

## 2. Feature Requests

### F-1: Delegated task table and stage control

#### 1. What it does
Priya opens **Tasks by me** and sees every non-Admin task that does not pass the "assigned to me" test, whether or not she created it. A **Workflow** switcher offers **All Workflows** and each task workflow. The columns are **TASK ID**, **WORKFLOW**, **STAGE**, **TASK NAME**, **RESPONSIBLE** ("<first> +N more" with a tooltip), **OBSERVERS**, **DEADLINE** and **CHECKLIST** ("x/y finished" with a per-person tooltip). She clicks a stage on the **STAGE** bar and the task moves with a "Task moved to …" toast. A row click opens the edit drawer. The row menu holds **Edit Task**, **Mark Completed** and **Delete**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Tab scope | Rule | Lists every non-Admin task that fails the "assigned to me" test, including other staff's tasks and all patient tasks | ◐ Simulated | It is not limited to tasks the user created. Any user can edit or delete them (G5-E-17). Decision needed: D-21 |
| F-1.2: Workflow switcher | Dropdown | All Workflows plus each task workflow | ● Works | Hidden on My Tasks |
| F-1.3: Table columns | Table | The eight columns above with a count on the tab label | ● Works | |
| F-1.4: Stage bar | Control | Click a stage to move the task. Completed or won sets Completed, overdue or lost sets Deferred, created sets Pending, any other stage sets In Progress | ● Works | A "Task Stage Updated" notice goes to the shared bell (G5-E-29) |
| F-1.5: Click to edit | Navigation | A row or name click opens the edit drawer pre-filled | ● Works | |
| F-1.6: Mark Completed | Row action | Sets the whole task to Completed without checking any deliverable | ◐ Simulated | CHECKLIST can still read 0/3 (G5-E-18). Decision needed: D-108 |
| F-1.7: Delete | Row action | Browser confirm "Delete task TSK-…?" then removes the task | ◐ Simulated | Allowed on anyone's task (G5-E-17). Decision needed: D-21 |
| F-1.8: Empty state | State | "No tasks found matching your filters." | ● Works | |
| F-1.9: Loading and error states | State | None exist | ○ Not built | Tasks are stored in the browser |
| F-1.10: Show only tasks I created | Rule | Tasks by me should mean created by me | ○ Not built | Decision needed: D-21 |

#### 3. Worked example
Priya reviews what she handed out.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She wants one pipeline | Picks a workflow in the switcher | **Only that workflow's tasks remain** |
| 2 | A task is finished | Clicks the Task Completed stage on its bar | **The task moves with a toast and shows Completed** |
| 3 | She scrolls | Reads the list | **It includes tasks created by other staff and patient tasks** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When I oversee tasks delegated to staff and patients, I want to filter by workflow and move stages in the table, so that I update many tasks quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the Tasks by me tab, **then** the Workflow switcher, **New Task**, the WORKFLOW and STAGE columns and the Delete row action are shown. |
| F-1-2 | **Given** a non-Admin task that is not assigned to the signed-in user, **then** it is listed whoever created it, and the user can edit or delete it. |
| F-1-3 | **Given** a click on a stage, **then** the task moves and its status follows the stage name. |
| F-1-4 | **Given** a row click, **then** the edit drawer opens pre-filled. |

### F-2: Create and edit a task (Configure and Task Studio)

#### 1. What it does
**New Task** opens a two-step drawer. **Configure** asks for a title, description, a **Workflow Pipeline**, who is responsible, a deadline, the Important flag, observers and an optional repeat. **Task Studio** builds the deliverables one by one and has a **Preview**. Priya presses **Next** and the drawer checks the title and workflow. She saves and the task takes the workflow's first stage and a `TSK-` code.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Title, description, Workflow Pipeline | Fields | Title and Workflow Pipeline are required at Next | ● Works | |
| F-2.2: Responsible type | Switch | **Team Member** offers a role filter (All Roles or a staff title) over the live team list. **Client Contact** offers a category filter (All Categories, Client, Lead, Supplier, Vendor) | ◐ Simulated | Client Contact reads a static client catalog, so new clients cannot be picked (G5-E-22) |
| F-2.3: Responsible person | Field | Not required. With none, the task is saved as "Assigned Staff" | ◐ Simulated | (G5-E-21) |
| F-2.4: Deadline | Date and time | Defaults to tomorrow 17:00 | ● Works | |
| F-2.5: Important and Observers | Toggle, list | Marks priority and lists observers | ● Works | |
| F-2.6: Repeat settings | Fields | Every N days, weeks, months or years, skip weekends, stop never, after N or on a date | ◐ Simulated | Stored on the task. Nothing ever creates the next task (G5-B-14, G5-Q-13). Decision needed: D-109 |
| F-2.7: Task Studio | Builder | Each item has a title, description, Important star and an optional resource: File up to 1MB, Image or Video by upload or URL, External URL or Custom HTML | ● Works | Save requires at least one item, a title on every item and http or https URLs |
| F-2.8: Preview | Tab | Shows the deliverable cards with test check-offs before saving | ● Works | |
| F-2.9: Task code | Rule | `TSK-` plus the task count plus 101 | ◐ Simulated | After a delete the next task reuses a code (G5-E-23) |
| F-2.10: Edit | Action | Saves every field again | ◐ Simulated | Clears every person's deliverable completion, including patients' (G5-E-20). Decision needed: D-108 |
| F-2.11: Create on a schedule or from automation | Hand-off | Recurring tasks and tasks created by a workflow or form | ○ Not built | No scheduler and no automation action exist (G5-Q-13, G5-Q-18). Decision needed: D-110 |

#### 3. Worked example
Priya sets a home routine for Sarah.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer open on Configure | Picks **Client Contact**, selects Sarah Johnson and a workflow, presses **Next** | **Task Studio opens** |
| 2 | Studio step | Adds a video item and an HTML item, opens **Preview**, saves | **The task is saved at the first stage and a New Task Assigned notice appears** |
| 3 | A week later | Edits the description | **Sarah's progress on every item is reset to zero** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When I delegate home care or a staff chore, I want one composer with videos, files and instructions and a preview, so that the assignee knows exactly what to do. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** Configure, **when** the title or workflow is empty and Next is pressed, **then** the drawer does not advance. |
| F-2-2 | **Given** Task Studio, **when** there is no item, an item has no title or a URL is not http or https, **then** the task is not saved. |
| F-2-3 | **Given** no responsible person, **when** the task is saved, **then** it is saved as "Assigned Staff". |
| F-2-4 | **Given** a saved task is edited, **then** all deliverable completion is cleared. |
| F-2-5 | **Given** repeat settings, **when** the task is saved, **then** they are stored and no further task is created. |

### F-3: Detail, Share and completion

#### 1. What it does
The detail page has a creator view with **Overall Completion**, **View Breakdown**, a stage badge, **Share** and **Delete**. Priya cannot normally reach it, because a task that is not assigned to her sends her to the edit drawer. **Share** offers SMS, WhatsApp, Email, **Client Portal** and Copy link. When every responsible person finishes every item the task completes.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Creator detail view | Page | Overall Completion ring, per-person breakdown, stage badge, Share, Delete | ◐ Simulated | The page exists but is unreachable for tasks that fail the assigned test (G5-E-19). Decision needed: D-108 |
| F-3.2: Share to Client Portal | Channel | Posts "Task Assigned: <title>, Stage, Deadline, Link /patient/tasks" as plain text in the patient's chat and raises a bell notice | ● Works | Recipients come from the static catalog (G5-E-22). The notice is text, not a card. Decision needed: D-107 |
| F-3.3: Share by SMS, WhatsApp or Email | Channels | Choose account, recipients and message | ◐ Simulated | A success toast shows and nothing is sent (G5-E-24) |
| F-3.4: Copy link | Action | Copies the task link | ● Works | |
| F-3.5: Auto-complete | Rule | Completes when all responsible people finish and reopens on uncheck, with a "Task Completed" notice | ● Works | Notices go to the shared bell (G5-E-29) |
| F-3.6: Delete from the detail header | Permission | Shown on the admin path or when the creator's display name contains "admin" | ◐ Simulated | The rule depends on a name (G5-E-25). Decision needed: D-21 |
| F-3.7: Notifications | Notice | New Task Assigned, Task Reassigned, Task Stage Updated and Task Completed | ◐ Simulated | One shared bell with no recipient (G5-E-29). Decision needed: D-107 |

#### 3. Worked example
Priya nudges Sarah.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The task is open for sharing | Presses **Share**, **Client Portal**, selects Sarah, sends | **A plain text "Task Assigned" message appears in Sarah's chat and a bell notice is raised** |
| 2 | She tries SMS instead | Sends by **SMS** | **A success toast shows. No SMS is sent** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Coordinator | When a patient has not started a task, I want to send it to their chat, so that they see it where they already talk to us. |
| F-3-J2 | Practice Manager | When several people owe items on one task, I want a per-person breakdown, so that I know who is still pending. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** Share then Client Portal, **when** it is sent, **then** a plain text message with the link `/patient/tasks` is added to the patient's Companion chat. |
| F-3-2 | **Given** Share by SMS, WhatsApp or Email, **when** Send is pressed, **then** a success toast shows and nothing is sent. |
| F-3-3 | **Given** several responsible people, **then** the task stays In Progress until all have finished all items. |
| F-3-4 | **Given** a task that fails the assigned test, **when** its detail link is opened, **then** the edit drawer opens instead of the creator view. |

### F-4: Patient tasks in Companion

#### 1. What it does
A task saved for a **Client Contact** has portal scope. Sarah sees it in her task list, opens it and checks off items. Priya's table and breakdown read the same record.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Publish to the patient | Hand-off | Client Contact tasks appear in the patient's list and detail | ● Works | |
| F-4.2: Completion sync | Hand-off | The patient's check-offs and auto-completion show on the staff side | ● Works | Same browser store |
| F-4.3: Patient match | Rule | The portal matches the patient by id or by name containing the patient's name | ◐ Simulated | Another patient with a similar name can see the task (G12-E-36). Decision needed: D-106 |
| F-4.4: Contact list | Source | Reads the static client catalog | ◐ Simulated | Newly added clients cannot be assigned or messaged (G5-E-22) |
| F-4.5: Tasks from forms, automation or recurrence | Hand-off | A new lead or a rule creates a task for staff | ○ Not built | Decision needed: D-110 |

#### 3. Worked example
Sarah completes the task.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah checks the last item in the portal | Presses **Mark as done** | **Priya's CHECKLIST reads finished and the task is Completed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When my care team gives me a task, I want to see it on my phone, so that I can finish it before my visit. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a task saved with Responsible type Client Contact, **then** the selected patient sees it in the portal task list. |
| F-4-2 | **Given** the patient finishes all items, **then** the staff side shows the task Completed. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Delegated task table and stage control | F-1.1 – F-1.10 | ● / ◐ / ○ | Table and stage bar work; shows everyone's tasks, editable by anyone. |
| F-2 | Create and edit a task | F-2.1 – F-2.11 | ● / ◐ / ○ | Composer and Studio work; edit wipes progress; recurrence not run. |
| F-3 | Detail, Share and completion | F-3.1 – F-3.7 | ● / ◐ | Portal share works; other channels only toast; creator view unreachable. |
| F-4 | Patient tasks in Companion | F-4.1 – F-4.5 | ● / ◐ / ○ | Publish and sync work; matching by name; no automation. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | Filter and move delegated tasks quickly | F-1 |
| 2 | Care Coordinator | Create a task with rich instructions and a preview | F-2 |
| 3 | Care Coordinator | Send a task to a patient's chat | F-3 |
| 4 | Practice Manager | See who is still pending on a task | F-3 |
| 5 | Patient | See my care team's task on my phone | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | See, edit, move, complete and delete every non-Admin task not assigned to them, create tasks, share | Admin tasks (never listed here) |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD says "creators and authorised admins" may delete and implies the tab shows tasks the user delegated. The prototype enforces neither. Decision needed: D-21.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Tasks by me (N) | Tab label | Count of non-Admin tasks that fail the "assigned to me" test |
| CHECKLIST | Table | Number of people who finished all items out of the people responsible, with a per-person tooltip |
| Overall Completion | Creator detail view | People who finished every item out of all responsible people. Not reachable for most tasks (G5-E-19) |
| Task code | Saved task | `TSK-` plus task count plus 101 |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Web form → Client → Process → **Task** | Submit leads to a task for staff | Not connected. Tasks are made only by hand here. The client picker is a static list, so a form-created client cannot be chosen. |
| Patient portal ↔ Appointments / Invoices | Staff creates a task for a client contact | Reaches the portal list. Matched by id or name containing. Portal tasks with no named patient show for every patient. |
| | Patient completes a task | Auto-completes and notifies the shared bell. |
| | Staff shares a task to the Client Portal | A plain text message in the patient's chat. The default recipient is CL-001 when the assignee is not a contact. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical: Process, Workflow and Pipeline, Client Portal and Client? | Naming note |
| D-21 | Does Tasks by me mean created by me, who may delete a task, and may managers see all tasks? | F-1.1, F-1.7, F-1.10, F-3.6 |
| D-106 | Is Client Portal share disabled for Admin tasks, and may a portal task with no named patient show for everyone? | F-4.3 |
| D-107 | Who receives each task notification, and should the chat notice be a card? | F-3.2, F-3.7 |
| D-108 | What does Mark Completed mean, how does a creator reach Overall Completion, and what happens to completion on edit? | F-1.6, F-2.10, F-3.1 |
| D-109 | Is recurrence created on completion or on a schedule, and does a passed deadline move the stage? | F-2.6 |
| D-110 | Which workflow steps must really run, including Create task? | F-2.11, F-4.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version. |
