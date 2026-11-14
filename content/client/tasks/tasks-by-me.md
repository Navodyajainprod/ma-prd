---
title: "Tasks by Me — Team Delegation, Patient Portal Sync & Sharing"
product: "client"
module: "tasks"
channel: "tasks-by-me"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | Client (Clinic Practice Management) |
| :--- | :--- |
| Module | Tasks Queue - Tasks by Me Tab (`/tasks` -> `Tasks by me` & `/tasks/:taskId`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Deliverable & Care Protocol Sync | Assigning a task in **Tasks by me** to a **Client Contact** publishes it directly into that patient's **My Tasks** list in the Companion App and syncs live completion back to Client breakdown panels. | [View in Companion](/companion/tasks) |
| Client | Companion Chat Task Dispatch | Clicking **Share -> Client Portal** from Task Details posts a formatted `Task Assigned` message with stage, deadline, and direct task link straight into the patient's Companion Chat thread. | [View in Client Chats](/client/chat/companion) |
| Client | Personal Work Inbox (`My Tasks`) | Incoming tasks assigned to the signed-in clinician stay separated inside the **My Tasks** tab away from outward team and patient delegations. | [View in My Tasks](/client/tasks/my-tasks) |
| Client | Workflows, Team & Client CRM | Delegated tasks pull task pipelines from Workflows, staff assignees from Team settings, and patient contacts from Clients CRM. | [View in Client Workflows](/client/workflows) |
| Admin | Governance Scope Boundary | Clinic-delegated tasks in **Tasks by me** stay inside the practice tenant and never mix into corporate `/admin/tasks` governance boards. | [View in Admin](/admin/tasks) |

## 1. Module Summary
- The **Tasks by Me — Team Delegation, Patient Portal Sync & Sharing** tab empowers clinicians, care coordinators, and practice leads to create, structure, stage-track, and distribute multi-step tasks outward to either **Clinic Team Members** or **Client Contacts (Patients)**.
- Unlike the simplified execution view in **My Tasks**, **Tasks by me** unlocks the full management toolset: the **Workflow Switcher**, interactive inline **Segmented Stage Bar**, click-to-edit drawer, two-step multimedia **Task Studio**, multi-assignee **Overall Completion** breakdowns, multi-channel **Share Task** (including Companion Chat push), and **Delete** controls.

## 2. Feature Requests

### F-1: Delegated Pipeline Table & Inline Stage Control (`Tasks by me` Tab)
#### 1. What it does
Displays every non-admin task delegated outward (`Tasks by me (N)` badge) with full operational oversight controls:
- **Workflow Switcher Dropdown:** Filters the table cleanly across specific task process templates (such as *Task Workflow*, *Compliance & Credentialing*, or *Patient Care Follow-up*), keeping users focused on one specific workflow at a time ("All Workflows" option removed).
- **Delegation Columns (`WORKFLOW`, `STAGE`, `RESPONSIBLE`):** Shows workflow name, an interactive inline **Segmented Stage Bar** (`Task Created`, `Task Completed`, `Task Overdue`, or custom process stages) for instant 1-click progression, and primary assignee with `+N more` multi-assignee tooltip.
- **Click-to-Edit & Management Actions:** Clicking a delegated task opens the pre-populated **Edit Task Drawer** cleanly (`?editTaskId=`) for fast scope, deadline, or studio updates; clicking **`New Task`** opens the creation wizard; and row actions provide **`Edit Task`**, **`Mark Completed`**, and **`Delete`** (with confirmation).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Workflow Switcher | Pipeline Filter | Filters delegated tasks by specific workflow pipeline (focuses on dedicated workflows without an "All Workflows" option) | Active only in `Tasks by me` |
| F-1.2: Inline **Segmented Stage Bar** | Stage Control | Advances a task's stage directly inside the table row with instant toast feedback | Updates stage across detail and chat shares |
| F-1.3: Click-to-Edit Drawer Flow | Edit Shortcut | Opens the creator drawer pre-loaded with existing task settings and studio deliverables | Contrast with `My Tasks` detail navigation |
| F-1.4: Full Row Lifecycle Menu | Row Actions | Exposes **Edit Task**, **Mark Completed**, and **Delete** per delegated row | Includes confirmation prompt before deletion |

#### 3. Worked example
| # | Situation | What the coordinator does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Nurse wants to edit deliverables and advance stage on a patient prep task | Switches to **`Tasks by me`**, filters *Clinical & Operational Tasks*, clicks the row to tweak Step 2 instructions, then clicks `Task Completed` on the inline stage bar | **Edits save cleanly via the drawer and the inline bar highlights the updated stage with confirmation toast** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When overseeing dozens of tasks delegated to staff and patients, I want workflow filters, inline stage bars, and 1-click editing right in the table. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Switching to **Tasks by me** exposes the **Workflow Switcher**, **New Task** CTA, `WORKFLOW`, inline `STAGE` bar, `RESPONSIBLE`, and **Delete** row action. |
| F-1-2 | Clicking a delegated task row in **Tasks by me** opens the Edit Task drawer pre-filled with that task's details. |

---

### F-2: Two-Step Task Creation Wizard (`Configure` & `Task Studio`)
#### 1. What it does
Clicking **New Task** (or editing a delegated task) guides authors cleanly through two steps:
- **Step 1 — Configure (Audience, Pipeline & Recurrence):**
  - Captures Title, Description, required **Workflow Pipeline**, Priority Star (`Important`), Deadline Date & Time, **Observers**, and **Recurring Schedule** (`every N days/weeks/months/years`, `skipWeekends`, stop `never` / after `count` / `on date`).
  - **Responsible Type Selector (`Team Member` vs `Client Contact`):** Selecting **`Team Member`** filters clinic staff by role (`All Roles` or specific staff title) for internal delegation; selecting **`Client Contact`** filters CRM patients/clients (`All Categories`, `Client`, `Lead`, etc.) and automatically configures portal delivery so the task syncs directly to the **Companion App**!
- **Step 2 — Task Studio (`Builder` & `Preview`):**
  - Builds sequential deliverable cards attaching **File (`Max 1MB`)**, **Image** (upload or `http/https` URL), **Video** (upload or `http/https` URL), **External URL**, or **Sandboxed Custom HTML Block** alongside optional item importance star.
  - Enforces non-empty deliverable titles and valid `http://` / `https://` URLs before saving; toggles to interactive **Preview** mode so authors can test-check deliverables prior to publishing.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: **`Team Member` vs `Client Contact`** Switcher | Cross-Product Router | Routes `Team Member` tasks to staff `My Tasks` and `Client Contact` tasks straight into Patient Companion `/patient/tasks` | Bridges clinical ops and patient homework in one UI |
| F-2.2: Recurrence & Time Planning | Automation Rules | Schedules repeating clinic checklists or chronic patient routines with weekend skipping | Supports fixed count or end-date limits |
| F-2.3: Multimedia **Task Studio** | Content Authoring | Attaches files, images, playable videos, external links, and custom HTML blocks per step | Validates `http/https` schemes and `1MB` upload bounds |
| F-2.4: Interactive **Preview** Tab | Author QA | Simulates the finished deliverable cards inside the drawer before publishing | Ensures patient-ready clarity |

#### 3. Worked example
| # | Situation | What the clinician does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Physical therapist delegates a home mobility routine to patient Sarah Johnson | Opens **New Task**, selects **`Client Contact` -> Sarah Johnson**, picks *Clinical & Operational Tasks*, adds an exercise demo Video + HTML protocol block in **Task Studio**, previews, saves | **Task publishes immediately into Sarah's Companion App `My Tasks` list with multimedia video and instructions** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Treating Clinician | When prescribing home care homework or delegating internal nurse tasks, I want one two-step composer supporting videos, files, and HTML protocols with live preview. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Saving a task with **`Responsible Type = Client Contact`** publishes it with portal visibility so the selected patient sees it inside Companion App immediately. |
| F-2-2 | Step 2 rejects missing deliverable titles or non-HTTP/HTTPS URLs with clear error toasts. |

---

### F-3: **Overall Completion** Breakdown & **Share Task** Dispatch (`/tasks/:taskId`)
#### 1. What it does
When opening full **Task Details** (`/tasks/:taskId`) for a delegated task, creators and managers access full oversight and distribution tools unavailable inside **My Tasks**:
- **Stage Badge & `Overall Completion: X/Y People Finished`:** Displays active workflow stage pill and circular progress ring tracking how many responsible staff members or patients have finished `100%` of deliverables.
- **Expandable Per-Person Breakdown (`View Breakdown / Hide Details`):** Lists each assigned person (name, role, `completed/total items`, and `Done` / `%` pill)—reflecting real-time updates whenever a patient taps **Mark as done** in the Companion App! Once all assignees hit `100%`, overall status switches automatically to **`Completed`** (`Task Completed`).
- **Multi-Channel `Share` Drawer:** Distributes task briefs, stage, deadline, and direct links via **`SMS`**, **`WhatsApp`**, **`Email`**, **Copy Link**, or **`Client Portal`** (which posts a `📋 Task Assigned` card containing direct `/patient/tasks` link straight into the selected patient's Companion Chat feed + bell alert). Includes header **`Delete Task`** for authorized creators/admins.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Expandable **View Breakdown** Panel | Multi-Assignee Oversight | Displays per-person item counts and completion badges in real time | Reflects live Patient Companion & staff check-offs |
| F-3.2: Multi-Channel **Share Task** Drawer | Distribution Engine | Sends briefs via connected SMS, WhatsApp, Email accounts, or direct **Client Portal** Companion Chat | Keeps task cards out of external WhatsApp channels accidentally |
| F-3.3: Automatic 100% Completion Sync | Lifecycle Automation | Closes overall task (`Task Completed`) and notifies creator once every assignee completes all items | Prevents premature sign-off |

#### 3. Worked example
| # | Situation | What the coordinator does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient hasn't started pre-op intake checklist due tomorrow | Opens Task Details -> clicks **Share**, selects **Client Portal**, chooses *Sarah Johnson*, clicks send | **Formatted `Task Assigned` message + notification post straight to Sarah's Companion Care Chat; when Sarah completes deliverables, `View Breakdown` turns `Done` live** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Manager | When nudging overdue patients or checking which assignees still owe deliverables, I want 1-click Companion Chat sharing and a live per-person progress breakdown. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Sharing via **Client Portal** posts the task summary and `/patient/tasks` link directly into the chosen patient's Companion Chat stream. |
| F-3-2 | Multi-assignee tasks remain `In Progress` until every responsible member completes all deliverables, then transition automatically to `Completed`. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Delegated Pipeline Table & Inline Stage Control | F-1.1 to F-1.4 | Filters tasks by workflow, moves stages inline, edits on click, and supports delete/complete actions. |
| F-2 | Two-Step Task Creation Wizard (`Configure` & `Studio`) | F-2.1 to F-2.4 | Assigns to Clinic Team or Client Contacts (Companion App) with recurrence and multimedia Task Studio. |
| F-3 | Overall Completion Breakdown & **Share Task** Drawer | F-3.1 to F-3.3 | Tracks per-person progress live, pushes alerts to Companion Chat, and auto-closes at `100%`. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | Delegate internal staff and patient tasks via rich multimedia Task Studio and manage workflow stages inline. | F-1, F-2 |
| 2 | Supervising Clinician | Track exactly which staff members or patients completed deliverables and nudge pending contacts via Companion Chat. | F-3 |

