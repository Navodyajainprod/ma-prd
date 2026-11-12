---
title: "My Tasks — Assigned Clinic & Admin Work Inbox"
product: "client"
module: "tasks"
channel: "my-tasks"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | Client (Clinic Practice Management) |
| :--- | :--- |
| Module | Tasks Queue - My Tasks Tab (`/tasks` -> `My Tasks` & `/tasks/:taskId`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Top-Down Role & Organization Delegation | Platform Administrators scope compliance and governance tasks to specific clinic roles (such as Lead Physician or Clinical Director), routing them straight into matching staff members' **My Tasks** inbox. | [View in Admin](/admin/tasks) |
| Client | Delegated Team & Patient Tasks (`Tasks by me`) | Tasks assigned outward by clinicians or created for patients live separately under **Tasks by me** so incoming action items stay focused and uncluttered. | [View in Tasks by me](/client/tasks/tasks-by-me) |
| Companion | Patient Deliverable Mirroring | While clinic staff use **My Tasks** for team/Admin assignments, patient-contact tasks created under **Tasks by me** appear in the patient's mobile **My Tasks** list and reflect back once completed. | [View in Companion](/companion/tasks) |
| Client | Team Profiles & Active Clinician Identity | Matches incoming task assignees and organizational roles against the signed-in team member's profile and role directory. | [View in Client Team](/client/settings/team) |

## 1. Module Summary
- The **My Tasks** tab inside Client Tasks Queue provides every clinician, nurse, and coordinator with a calm, focused execution inbox displaying strictly the tasks assigned directly to them—whether delegated by another clinic teammate or pushed top-down from **Admin** by role.
- To prevent accidental edits, deleted assignments, or workflow noise, **My Tasks** intentionally omits the Workflow switcher, `STAGE` column and inline stage badges, **New Task** creation button, **Share** button, and **Delete** controls—letting assignees jump straight into reviewing multimedia deliverables, checking off their own work, and marking assignments done.

## 2. Feature Requests

### F-1: Focused Assigned Inbox & Incoming Role Routing (`My Tasks` Tab)
#### 1. What it does
Filters the clinic task table down to items where the signed-in user matches as a direct assignee, multi-assignee, responsible person, or matching clinical role, while excluding corporate admin-private oversight unless explicitly targeted:
- **Live Badge Count (`My Tasks (N)`):** Shows the exact count of incoming assigned tasks right on the segmented tab toggle.
- **Role-Targeted Admin Handoff:** Corporate rollouts scoped in `/admin/tasks` to a user's clinic role (e.g., `Lead Physician`, `Care Coordinator`) arrive automatically in **My Tasks** under `ASSIGNED BY` (`Super Admin` / `Platform Administrator`).
- **Streamlined Execution Columns:** Displays **`TASK ID`**, **`TASK NAME`**, **`ASSIGNED BY`**, **`OBSERVERS`**, **`DEADLINE`**, and **`CHECKLIST`** (`Your Progress` ring)—cleanly omitting internal `WORKFLOW` and `STAGE` columns.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Assignee & Role Match Filter | Scope Filter | Surfaces tasks assigned by teammate name or matching Admin org-role targeting | Includes all workflows seamlessly without needing a dropdown filter |
| F-1.2: Streamlined Table Columns | Inbox Layout | Displays `TASK ID`, `TASK NAME`, `ASSIGNED BY`, `OBSERVERS`, `DEADLINE`, `CHECKLIST` | Keeps assignee view distraction-free |
| F-1.3: Unified Keyword Search | Search Bar | Searches incoming tasks by title, `TSK-*` code, creator, observers, or project | Works across all assigned items |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Super Admin delegates `TSK-102` (`Quarterly Provider Credentialing`) in Admin; clinic nurse assigns `TSK-101` (`Verify Patient Insurance Eligibility`) | Dr. Mehta opens Client Tasks -> **My Tasks** | **Both `TSK-102` (`ASSIGNED BY: Super Admin`) and `TSK-101` appear in `My Tasks (N)` ready for execution** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Attending Physician | When starting clinic morning rounds, I want one clean inbox of tasks assigned to me across teammates and Admin compliance teams without administrative clutter. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Switching to **My Tasks** displays only tasks assigned to the current clinician/role across all workflows and hides the Workflow dropdown and `STAGE` column. |

---

### F-2: Strict Assignee Governance & Permission Guardrails
#### 1. What it does
Enforces clear role boundaries between executing a task assigned to you (**My Tasks**) and owning/managing a delegated pipeline (**Tasks by me**):
- **Hidden Toolbar & Row Governance Controls:** Inside **My Tasks**, the **New Task** CTA button, **Workflow Switcher** dropdown, **Share** button, and **Delete** row/header actions are hidden so an assignee cannot delete or re-scope an assignment given to them.
- **Allowed Execution Actions Only:** Row clicks always open the full **Task Detail Page** (`/tasks/:taskId`, never the quick-edit drawer), and row actions offer solely **`View Details`** and **`Mark Completed`** (`Task Completed` toast).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Toolbar Simplification | UI Guardrail | Hides Workflow filter and **New Task** CTA while viewing **My Tasks** | Creation/delegation lives cleanly inside `Tasks by me` |
| F-2.2: Non-Destructive Action Set | Permission Rule | Limits row menu to **View Details** and **Mark Completed**; hides **Delete** and **Share** | Protects Admin and supervisor accountability |
| F-2.3: Detail-First Navigation | Click Behavior | Clicking any **My Tasks** row routes directly to `/tasks/:taskId` | Contrasts cleanly with click-to-edit inside `Tasks by me` |

#### 3. Worked example
| # | Situation | What the user sees | Result |
| :--- | :--- | :--- | :--- |
| 1 | Nurse opens a task assigned to them in **My Tasks** and checks row options | Opens 3-dot row menu and clicks row | **Menu lists `View Details` and `Mark Completed` with zero Delete option; clicking row opens `/tasks/:taskId` directly** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Supervisor | When delegating critical compliance or insurance verification chores, I want assignees unable to delete their assigned tasks while focused on completing deliverables. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **My Tasks** row actions and detail header MUST NOT expose **Delete** or **Share** controls, and clicking a row MUST navigate to `/tasks/:taskId`. |

---

### F-3: Task Execution Detail & Personal Progress Ring (`/tasks/:taskId`)
#### 1. What it does
Opening any task from **My Tasks** displays a clean, centered single-column workspace optimized for finishing assigned deliverables:
- **Personal Header & Task Info:** Subtitle highlights `Assigned to you • Created [Date]`, hiding internal workflow stage badges, alongside `TSK-*` code, **Important** star toggle, overall `In Progress` / `Completed` status pill, full brief description, scheduled `Deadline`, and attached `Observers`.
- **Personal Progress Ring:** Shows **`Your Progress: X/Y Items Completed`** tracking strictly the signed-in user's own deliverables (`"You have completed all items assigned to you"` vs `"Check off your deliverables below as you finish them"`), without showing multi-member admin management controls.
- **Line-by-Line Multimedia Deliverables:** Renders each step sequentially with images, inline video playback, downloadable documents (`File`), external URLs, and framed Custom HTML guidance blocks. Clicking **`Mark as done`** checks off the user's copy immediately (`Done (Undo)` + toast), updates any team/Admin breakdown on the sender's side, and automatically marks the overall task **`Completed`** once every assignee finishes.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Assignee-Only Task Info Header | Focused View | Displays code, Important star, description, deadline, observers, and clean `Assigned to you` subtitle | Hides internal stage badges and creator-only controls |
| F-3.2: Per-User **Your Progress** Ring | Progress Tracker | Counts strictly `X/Y` deliverables finished by the signed-in assignee | Independent of teammates' copies on multi-assignee tasks |
| F-3.3: Deliverable Completion Toggle | Check-Off Control | Toggles **Mark as done / Done (Undo)** per item and auto-completes overall task when all assignees hit `100%` | Fires `"Task Completed"` alert upon full closure |

#### 3. Worked example
| # | Situation | What the clinician does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dr. Mehta opens `TSK-101` (`Verify Patient Insurance Eligibility`) from **My Tasks** and checks off the final CPT confirmation item | Clicks **Mark as done** on Deliverable 2 | **Progress ring fills to `100%`, header flips to `Completed`, and attached Observers see the completion update live** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Team Assignee | When completing multi-step deliverables containing protocols, files, or links, I want clear progress tracking of my exact remaining items without interfering with teammates' copies. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Tapping **Mark as done** inside a **My Tasks** detail view updates `Your Progress: X/Y Items Completed` immediately and reverts cleanly on **Undo**. |

---

### F-4: Overdue Deadline Monitoring & Observer Visibility
#### 1. What it does
Keeps time-sensitive assignments visible before consultation slots begin:
- Tasks past their planned `deadline` trigger a single deduplicated `"Task Overdue Alert"` notification naming the assignee and surfacing attached Observers.
- Notifications link directly back to `/tasks/:taskId` so the clinician opens **My Tasks** execution view in one tap from the top bell drawer.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Deep-Link Overdue Notification | Bell Alert | Links `"Task Overdue Alert"` directly to `/tasks/:taskId` for immediate action | Deduplicated per overdue task |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Assigned task passes due time before clinic check-in | Bell notification alerts assignee and listed Observers | **Clicking alert opens `/tasks/:taskId` directly in execution mode** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Assigned Staff Member | When a task is about to miss or has missed its deadline, I want one click from my notification bell to land straight on the checklist items I need to finish. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Overdue client tasks generate a notification linking cleanly to `/tasks/:taskId` without duplicate spam. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Focused Assigned Inbox (`My Tasks` Tab) | F-1.1 to F-1.3 | Surfaces direct staff assignments and top-down Admin role tasks in one uncluttered queue. |
| F-2 | Strict Assignee Governance Guardrails | F-2.1 to F-2.3 | Hides creation, stage editing, Share, and Delete controls while routing rows straight to execution. |
| F-3 | Personal Progress Ring & Deliverable Execution | F-3.1 to F-3.3 | Tracks `Your Progress` per assignee across multimedia deliverables with instant clinic/Admin sync. |
| F-4 | Overdue Deadline Monitoring & Deep Links | F-4.1 | Alerts assignees and observers on deadline breach with 1-click links into `/tasks/:taskId`. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Attending Physician / Nurse | Review incoming tasks from teammates and Admin roles cleanly without administrative stage or delete clutter. | F-1, F-2 |
| 2 | Assigned Staff Member | Complete multimedia deliverables line by line and jump straight from overdue notifications to execution. | F-3, F-4 |
