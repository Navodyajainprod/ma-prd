---
title: "Corporate Tasks, Cross-Org Delegation and Governance"
product: "admin"
module: "tasks"
route: "/admin/tasks"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | TASKS |
| Route | `/admin/tasks` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The shared Tasks page in the admin shell. It lists only Admin-scope tasks and has the same two-step composer as the clinic, with industry and role scoping and no deadline or repeat. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user can open `/admin/tasks` and create tasks. |
| **Where you start it** | **Tasks** in the admin sidebar (`/admin/tasks`). |
| **Where the result goes** | Only this page. Admin tasks are not delivered to clinic My Tasks, are hidden from the Companion task list, and are skipped by the overdue alert. |
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
| Client (My Tasks) | Role-targeted delegation | Not connected. An Admin task aimed at a clinic role is saved but never appears in any clinic My Tasks, because clinic users never see Admin-scope tasks. | [View My Tasks](/client/tasks/my-tasks) |
| Client (Tasks by me) | Same page, other scope | The clinic tab shares the page and the composer. It adds deadline and repeat, which Admin tasks omit. Tasks made there never appear here. | [View Tasks by me](/client/tasks/tasks-by-me) |
| Companion | Patient firewall | Admin tasks are left out of every patient's list and a direct link shows **Task Not Available**. The Share drawer on an Admin task can still post it into a patient's chat. | [View Companion Tasks](/companion/tasks) |
| Admin (Organizations) | Scope and organization | The ORGANIZATION column shows "Demo Mantra Care" for every Admin task. No organization is chosen in the composer. | [View Organizations](/admin/organizations) |
| Admin (Roles, Industries) | Role catalog | The scope and role pickers use the industry role catalog and stored custom roles. | [View Roles](/admin/roles) |

## 1. Module Summary

### The story in one minute

Leo Martin, a Platform Admin, opens **Tasks** in the admin shell. The subtitle reads "Corporate operational assignments, cross-organization delegation, and checklists". The table lists only Admin tasks, with **TASK ID**, **TASK NAME**, **SCOPE**, **ORGANIZATION**, **ROLE / RESPONSIBLE** and **CHECKLIST**. He presses **New Task** for a credentialing audit. He sets an industry scope, keeps the role **Lead Physician**, marks it important and adds observers. There is no deadline and no repeat. He builds two deliverables in Task Studio and saves. The task appears in his table. He expects clinic directors to find it in their inbox. It does not reach them. He also finds that any signed-in clinic user could have opened this page.

### What is real and what is not

- **Real in the prototype:** the Admin-only table, the Workflow switcher and search, the composer with industry scoping, the role picker, Task Studio and Preview, and the Companion and overdue exclusions.
- **Simulated:** the ORGANIZATION column (a fixed name), Mark Completed (closes without deliverables), the creator detail page (unreachable) and the Share drawer (it can post an internal task into a patient chat).
- **Not built:** delivery to clinic My Tasks, organization targeting, a STAGE column, a deadline, a role check on the page and a loading or error state.

### Journey position

```
/admin/tasks ─▶ New Task (scope, role) ─▶ Saved ─┬▶ Admin table
                                                 ├▶ Clinic My Tasks ✕
                                                 └▶ Companion hidden (Share can leak)
```

## 2. Feature Requests

### F-1: Corporate tasks table

#### 1. What it does
Leo opens `/admin/tasks` and sees only Admin-scope tasks. A Workflow switcher, a search box and a **New Task** button sit above the table. The row menu holds **Edit Task**, **Mark Completed** and **Delete**. There is no **STAGE** column and no **DEADLINE** column.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Admin-only scope | Rule | Shows only Admin-scope tasks. Clinic and patient tasks are not listed | ● Works | |
| F-1.2: Columns | Table | TASK ID, TASK NAME, SCOPE (scope name or industry list), ORGANIZATION, ROLE / RESPONSIBLE, CHECKLIST | ◐ Simulated | ORGANIZATION reads "Demo Mantra Care" for every task (G5-E-27). Decision needed: D-105 |
| F-1.3: Workflow switcher and search | Controls | Filters by task workflow and searches the rows | ● Works | |
| F-1.4: Edit Task | Row action | Opens the composer pre-filled | ◐ Simulated | Saving clears every person's deliverable completion (G5-E-20) |
| F-1.5: Mark Completed | Row action | Sets the task to Completed with a toast | ◐ Simulated | No deliverable is checked (G5-E-18). Decision needed: D-108 |
| F-1.6: Delete | Row action | Browser confirm, then removes the task | ● Works | |
| F-1.7: Empty state | State | "No tasks found matching your filters." | ● Works | |
| F-1.8: STAGE column | Column | Shown in the earlier PRD | ○ Not built | Decision needed: D-105 |
| F-1.9: Role check on the page | Rule | Only a Platform Admin should open it | ○ Not built | Any signed-in user can open it and create cross-org tasks (G5-E-28). Decision needed: D-12 |
| F-1.10: Loading and error states | State | None exist | ○ Not built | Tasks are stored in the browser |

#### 3. Worked example
Leo reviews the credentialing checklist.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Page opens | Picks **Compliance & Credentialing** in the switcher | **Only Admin tasks of that workflow are listed. No deadline or stage column shows** |
| 2 | He reads the row | Looks at ORGANIZATION | **It reads Demo Mantra Care, whatever the intended organization** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When I manage platform-wide compliance work, I want one table of corporate tasks by scope and role, so that I can see what is open. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** `/admin/tasks`, **then** only Admin-scope tasks are listed, with no STAGE or DEADLINE column. |
| F-1-2 | **Given** any Admin task, **then** ORGANIZATION shows "Demo Mantra Care". |
| F-1-3 | **Given** a signed-in user with any clinic role, **when** they open `/admin/tasks`, **then** the page opens. |

### F-2: Admin task composer

#### 1. What it does
**New Task** opens two steps. **Configure** takes a title, description, a **Workflow Pipeline**, **Admin Control** scoping rules and **Target roles**. It also takes **Mark as Important** and **Observers**. Deadline, time and repeat are hidden. **Task Studio** builds the deliverables and has a **Preview**. The task is saved with no deadline and no recurrence.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Industry scoping | Rules | Scope by industry category and related criteria | ◐ Simulated | The scope is stored and shown in the table. It routes nothing (G5-M-02) |
| F-2.2: Target roles | Picker | Lists roles of the scoped industries plus stored custom roles, or all roles when unscoped. **Lead Physician** is pre-selected | ◐ Simulated | Saved on the task but no clinic user receives it (G5-M-02). Decision needed: D-105 |
| F-2.3: Organization targeting | Field | Pick the organizations that get the task | ○ Not built | The composer never captures an organization (G5-E-27). Decision needed: D-105 |
| F-2.4: Important and Observers | Toggle, list | Priority flag and observers | ● Works | |
| F-2.5: Scheduling | Fields | Deadline, target time and repeat | ○ Not built | Deliberately hidden. The task has no deadline or recurrence |
| F-2.6: Task Studio and Preview | Builder | Same item types, 1MB file limit and http or https check as the clinic composer. Preview has test check-offs | ● Works | At least one item is required |
| F-2.7: Task code | Rule | `TSK-` plus task count plus 101 | ◐ Simulated | A code can repeat after a delete (G5-E-23) |

#### 3. Worked example
Leo rolls out a credentialing checklist.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Configure step | Sets a Healthcare scope, keeps **Lead Physician**, turns on **Mark as Important**, adds observers | **Only roles for that industry are offered** |
| 2 | Studio step | Adds two items and saves | **The task appears in the admin table with its scope. It does not appear in any clinic inbox** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When I roll out a standard checklist by industry and role, I want quick scoping and deliverable authoring, so that I need no deadline for it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a Healthcare scope, **then** the role list is limited to that industry's roles. **When** the scope is cleared, **then** all roles show. |
| F-2-2 | **Given** admin mode, **then** Deadline, Target Time and Repeat are not shown and the saved task has no deadline or recurrence. |
| F-2-3 | **Given** Task Studio, **when** there is no item or a URL is not http or https, **then** the task is not saved. |

### F-3: Task detail and sharing

#### 1. What it does
`/admin/tasks/:taskId` is meant to show the Overall Completion ring, **View Breakdown**, **Share** and **Delete**, without the deadline. A task that fails the "assigned to me" test is sent to the edit drawer before the page renders, so Leo cannot normally reach it.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Manager detail page | Page | Overall Completion, per-person breakdown, stage badge, Share, Delete | ◐ Simulated | Unreachable for normal Admin tasks (G5-E-19). Decision needed: D-108 |
| F-3.2: Auto-complete | Rule | Completes when all responsible people finish all items and raises a "Task Completed" notice | ● Works | The notice has no recipient (G5-E-29). Decision needed: D-107 |
| F-3.3: Share by SMS, WhatsApp or Email | Channels | Success toast | ◐ Simulated | Nothing is sent (G5-E-24) |
| F-3.4: Share to Client Portal | Channel | Posts the task title, stage and link into a patient's Companion chat | ◐ Simulated | It can put an internal Admin task in a patient chat (G5-E-26). Decision needed: D-106 |
| F-3.5: Delete from the detail header | Permission | Shown on the admin path | ◐ Simulated | Otherwise depends on the creator's display name containing "admin" (G5-E-25). Decision needed: D-21 |

#### 3. Worked example
Leo shares a task.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The detail page is open | Presses **Share**, **Client Portal**, selects Sarah Johnson | **The internal task's title, stage and link arrive in Sarah's chat** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When several clinics owe items on one rollout, I want a per-person breakdown, so that I see who is pending. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an Admin task not assigned to the user, **when** its detail link opens, **then** the edit drawer opens, not the manager page. |
| F-3-2 | **Given** Share then Client Portal on an Admin task, **when** it is sent, **then** the message is posted to the patient's chat. |
| F-3-3 | **Given** every responsible person has finished, **then** the task is Completed. |

### F-4: Boundaries with clinic and patient products

#### 1. What it does
Admin tasks are meant to stay away from patients and to reach clinic staff by role. The patient side blocks them. The clinic side does not receive them.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Patient firewall | Rule | Admin tasks never appear in a patient's list and a direct link shows **Task Not Available** | ● Works | See F-3.4 for the share leak (G5-A-12) |
| F-4.2: Overdue exemption | Rule | The overdue scan skips Admin tasks | ● Works | They have no deadline |
| F-4.3: Delivery to clinic My Tasks | Hand-off | Role-targeted tasks arrive in matching staff's My Tasks | ○ Not built | Clinic users never see Admin-scope tasks (G5-M-02). Decision needed: D-105 |
| F-4.4: Clinic tasks stay out of Admin | Rule | Tasks made in Tasks by me never show here | ● Works | |

#### 3. Worked example
A patient opens an Admin task link.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Link to an Admin task | Opens `/patient/tasks/<id>` | **Task Not Available with Return to My Tasks. No task content shows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Platform Admin | When I create internal governance tasks, I want them hidden from patients, so that audit and billing memos never leak. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** an Admin task, **then** it is not listed in `/patient/tasks` and its link shows Task Not Available. |
| F-4-2 | **Given** an Admin task past any date, **then** no overdue alert is raised. |
| F-4-3 | **Given** a role-targeted Admin task, **then** no clinic My Tasks list receives it. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Corporate tasks table | F-1.1 – F-1.10 | ● / ◐ / ○ | Admin-only list works; organization is fixed text; no role check. |
| F-2 | Admin task composer | F-2.1 – F-2.7 | ● / ◐ / ○ | Scoping and roles are saved but route nowhere. |
| F-3 | Task detail and sharing | F-3.1 – F-3.5 | ● / ◐ | Detail is unreachable; share can leak. |
| F-4 | Boundaries with clinic and patient | F-4.1 – F-4.4 | ● / ○ | Patient firewall works; clinic delivery does not. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | See corporate tasks by scope and role | F-1 |
| 2 | Platform Admin | Roll out a checklist by industry and role | F-2 |
| 3 | Platform Admin | See who is pending on a rollout task | F-3 |
| 4 | Platform Admin | Keep internal tasks away from patients | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/tasks`, create, edit, complete and delete Admin tasks, share them | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |
| Patient | Nothing here | Admin task content (lock screen) |

The earlier PRD names the Platform Administrator and a compliance or security officer and assumes only they reach this page. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| CHECKLIST | Table | People who finished all items out of people responsible |
| ORGANIZATION | Table | **Hardcoded, formula undefined**: the fixed name "Demo Mantra Care" |
| SCOPE | Table | The saved scope name or industry list |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal ↔ Appointments / Invoices | Admin task visibility for patients | Hidden from the list and blocked by link. Share to Client Portal can still post one into a chat. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-12 | Who may open `/admin/*` and must permissions block direct URLs? | F-1.9 |
| D-21 | Who may delete a task from the detail header? | F-3.5 |
| D-105 | Should Admin role-targeted tasks appear in clinic My Tasks, should they target organizations, and keep or drop the STAGE column? | F-1.2, F-1.8, F-2.2, F-2.3, F-4.3 |
| D-106 | Is Client Portal share disabled for Admin tasks? | F-3.4 |
| D-107 | Who receives each task notification? | F-3.2 |
| D-108 | What does Mark Completed mean and how does a creator reach Overall Completion? | F-1.5, F-3.1 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version. |
