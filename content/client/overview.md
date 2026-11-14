---
title: "Overview: Analytics Dashboard"
product: "client"
module: "overview"
route: "/"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | OVERVIEW |
| Route | `/` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The home screen, titled "Overview Analytics". Four filter dropdowns, four call KPI cards, an Active Tasks list, a Call Distribution donut, a Conversion Overview bar chart and a Performance Analysis panel. |
| **Who uses it** | Practice Manager (reads the numbers and the task list). No role is checked: any signed-in user sees the page. |
| **Where you start it** | **Overview** in the sidebar (`/`). It is the first page after sign-in. |
| **Where the result goes** | Nothing is created here. Task rows link to `/tasks/:id` or `/admin/tasks/:id`, and **View all tasks** opens `/tasks`. |
| **How real is it** | 0 features work, 3 are partly simulated, 0 are not built. See the legend below. Most numbers are hardcoded. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Call Logs) | Call counts | Total Calls, Completed and Failed come from the organisation's call-log store. Reports uses separate static mock calls, so the two pages disagree (G1-E-09). | [View Call Logs](/client/call-logs) |
| Client (Tasks) | Active Tasks list | Shows the first 5 tasks from one shared store, including completed and platform admin tasks. Each row opens the task. | [View My Tasks](/client/tasks/my-tasks) |
| Client (Process) | Conversion funnel and filters | The funnel and the process and stage filters are not connected to the Process board. Their numbers and options are hardcoded. | [View Process Board](/client/processes/kanban) |
| Client (Appointments) | Visit triage counters | Not connected. The page holds no appointment data. | [View Appointments](/client/appointments/list) |
| Client (Reports) | Analytics | Reports is a separate library of saved reports. Nothing on the Overview links to it. | [View Reports](/client/reports) |

## 1. Module Summary

### The story in one minute

Asha Verma opens MantraAssist on Monday morning and lands on the **Overview** page. Four cards sit on top: Total Calls, Completed, Failed / Missed and Avg. Duration. Total Calls is a real count of the organisation's call logs. Avg. Duration always reads "0m 14s". Below, an Active Tasks list shows five tasks. One of them was created by the platform admin team, and a completed task sits in the list too. She picks a process in the filter dropdown at the top and nothing changes. The donut shows ten call outcomes that add up to 573, while its centre shows about 26 total calls. She clicks a task row and the task opens.

**Naming note:** the page header reads "Overview Analytics". The earlier PRD called it "Overview Dashboard & Clinical Activity Feed" and described appointment triage counters and an activity feed. The prototype has neither. Decision needed: D-03.

### What is real and what is not

- **Real in the prototype:** the Total Calls, Completed and Failed counts and the success rate, the live refresh when calls, tasks or the organisation change, the zero-state for a fresh workspace, and the Active Tasks list with links to each task.
- **Simulated:** Avg. Duration, the Call Distribution donut, the Conversion Overview funnel, the Performance Analysis text and all four filters are hardcoded or do nothing. The 573, 179 and 21 fallback numbers appear when a non-fresh organisation has no calls. Active Tasks shows every task in the store.
- **Not built:** the appointment triage counters, the multi-channel activity feed, a notifications panel, the daily trend chart and one-click staff shortcuts.

### Journey position

```
Call logs / Tasks / Notifications stores ─▶ Overview ─┬▶ KPI cards (computed)
                                                      ├▶ Donut, funnel, insights (hardcoded)
                                                      └▶ Active Tasks ─▶ Task page
```

## 2. Feature Requests

### F-1: Call KPI cards and workspace states

#### 1. What it does
Asha opens `/` and reads four cards. **Total Calls** counts the organisation's call logs. **Completed** shows the completed count with a success rate. **Failed / Missed** counts calls with status Failed. **Avg. Duration** reads "per successful call". The page reloads its numbers when calls, tasks, notifications or the active organisation change. A new organisation sees zeros and onboarding tips.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Total Calls | KPI | Count of the organisation's stored call logs | ◐ Simulated | A non-fresh organisation with no logs shows 573 (G1-E-02). Differs from Reports › Calls (G1-E-09). Decision needed: D-83 |
| F-1.2: Completed and success rate | KPI | Count of calls with status Completed. Subtitle is Completed divided by Total Calls | ◐ Simulated | Falls back to 179. Total includes Pending and In Progress calls (G1-E-02). Decision needed: D-84 |
| F-1.3: Failed / Missed | KPI | Count of calls with status Failed | ◐ Simulated | Falls back to 21. No Missed status is counted (G1-E-02). Decision needed: D-84 |
| F-1.4: Avg. Duration | KPI | Always "0m 14s" (or "0m 00s" in a fresh workspace) | ◐ Simulated | Hardcoded, formula undefined (G1-E-01). Decision needed: D-84 |
| F-1.5: Fresh workspace state | State | KPIs show 0 with "No calls registered yet" and "Clean record". A dashed "0 TOTAL CALLS" placeholder replaces the donut. The funnel shows "No Funnel Activity Yet". The insight panel shows onboarding tips | ● Works | The Demo organisation is never fresh |
| F-1.6: Live refresh | Rule | The page recomputes when calls, tasks, notifications or the active organisation change | ● Works | |
| F-1.7: Notifications panel | Panel | Notifications and an unread count are loaded, but nothing is shown | ○ Not built | The subtitle promises "team notifications" (G1-E-08). Decision needed: D-144 |
| F-1.8: Loading and error states | State | None exist | ○ Not built | Stores are read at once |
| F-1.9: Role control | Rule | Any signed-in user sees the page | ○ Not built | Decision needed: D-19 |
| F-1.10: Daily appointment triage counters | Cards | Total Scheduled, Arrived and Waiting, In Consultation, Completed, Cancelled or No-Show, amber after a 20-minute wait, a goal bar, a link to the calendar | ○ Not built | Described in the earlier PRD. The page has no appointment data. Decision needed: D-03 |
| F-1.11: Daily volume trend chart | Chart | Data and tooltip are defined but never drawn | ○ Not built | Mentioned in the in-app guide (G1-E-10) |

#### 3. Worked example
Asha checks call volume.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The Demo organisation has about 26 logged calls | Opens **Overview** | **Total Calls shows that count and Completed shows its success rate** |
| 2 | She looks at Avg. Duration | Reads the card | **It reads "0m 14s", whatever the calls were** |
| 3 | A brand new organisation signs up | Opens **Overview** | **Every card shows 0 and the funnel reads "No Funnel Activity Yet"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When I start my day, I want to see how many calls were handled and how many failed, so that I know whether the call flow is healthy. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** call logs exist, **then** Total Calls equals their count and the success rate is Completed divided by Total Calls to one decimal place. |
| F-1-2 | **Given** a non-fresh organisation with no logs, **then** the cards show 573, 179 and 21. |
| F-1-3 | **Given** any state, **then** Avg. Duration shows "0m 14s" (fresh workspace "0m 00s"). |
| F-1-4 | **Given** a fresh workspace, **then** cards show 0 and the donut is a dashed placeholder. |
| F-1-5 | **Given** a call, task or organisation change, **then** the page recomputes without a reload. |

### F-2: Filters, call distribution, conversion funnel and insights

#### 1. What it does
Asha sees four dropdowns for process, stage, date range and call type. Below the cards, a donut shows **Call Distribution**, a bar chart shows **Conversion Overview** and a panel shows **Performance Analysis**. All of it is fixed content. Changing a filter changes nothing.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Filters | Dropdowns | Process, stage, date range, call type. The card caption says "Across selected filters" | ◐ Simulated | No filter changes any number. Option lists are hardcoded (G1-E-06). Decision needed: D-90 |
| F-2.2: Call Distribution | Donut | Ten outcome slices adding to 573. Centre shows the computed Total Calls | ◐ Simulated | Hardcoded, formula undefined. Most categories (Skipped, Queued, Busy) are not call statuses, so the donut contradicts its centre (G1-E-03). Decision needed: D-83 |
| F-2.3: Conversion Overview | Bar chart | Six stages from 573 down to 142 | ◐ Simulated | Hardcoded, formula undefined (G1-E-04). Decision needed: D-90 |
| F-2.4: Performance Analysis | Text panel | "Peak completion of 86.4% between 2:00 PM and 4:30 PM" and "AI handled 74% of intakes" | ◐ Simulated | Hardcoded, formula undefined (G1-E-05). Decision needed: D-90 |
| F-2.5: Multi-channel activity feed | Feed | WhatsApp, SMS and website messages, forms, payments and calls with channel pills (Chats, Forms, Billing, Calls) | ○ Not built | Described in the earlier PRD. Decision needed: D-03 |

#### 3. Worked example
Asha tries to narrow the view.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Cards and charts are showing | Picks a process in the first dropdown | **No number or chart changes** |
| 2 | The donut centre says about 26 | Compares the slices | **The slices add up to 573** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When I review performance, I want to filter by process and period, so that I see one workflow's results. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** any filter is changed, **then** no card, chart or panel changes. |
| F-2-2 | **Given** a non-fresh workspace, **then** the donut, funnel and insights show the same fixed numbers every time. |

### F-3: Active Tasks

#### 1. What it does
Beside the donut, an **Active Tasks** panel lists the first five tasks in the store. Each row has a progress ring or a checkbox, an important star, a deadline, an "x/y done" count and a stage badge. Asha clicks a row and the task opens. **View all tasks** opens the full list.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Task list | List | The first 5 tasks of one shared store | ◐ Simulated | Not filtered by organisation, status or person. Completed and platform admin tasks appear (G1-E-07). Decision needed: D-91 |
| F-3.2: Count badge | Badge | Count of every task in the store | ◐ Simulated | Includes completed and admin tasks (G1-E-07) |
| F-3.3: Row link | Link | Opens `/tasks/:id`, or `/admin/tasks/:id` for an admin-scoped task | ● Works | |
| F-3.4: View all tasks | Link | Opens `/tasks` | ● Works | |
| F-3.5: Empty state | State | "No active tasks." | ● Works | |
| F-3.6: One-click staff shortcuts | Shortcuts | Mentioned in the earlier PRD summary | ○ Not built | Only the task links exist |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A platform admin task was assigned to the clinic | Looks at the panel | **The task appears with the clinic's own tasks, and a completed task counts as active** |
| 2 | She clicks the admin task | Clicks the row | **The admin task page opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When the day starts, I want to see what is on my team's task list, so that I can follow up what is due. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** tasks exist, **then** the panel shows the first five from the shared store, whatever status, scope or organisation. |
| F-3-2 | **Given** no tasks exist, **then** "No active tasks." shows. |
| F-3-3 | **Given** a row is clicked, **then** the task opens, or the admin task for an admin-scoped task. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Call KPI cards and workspace states | F-1.1 – F-1.11 | ◐ / ● / ○ | Counts are computed with hardcoded fallbacks; Avg. Duration is fixed. |
| F-2 | Filters, donut, funnel, insights | F-2.1 – F-2.5 | ◐ / ○ | All hardcoded; filters do nothing. |
| F-3 | Active Tasks | F-3.1 – F-3.6 | ● / ◐ / ○ | Links work; the list shows every task. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | See how many calls were handled and failed | F-1 |
| 2 | Practice Manager | Filter performance by process and period | F-2 |
| 3 | Practice Manager | See what is on the team's task list | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | See the dashboard and open any listed task | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named a Clinic Coordinator and a Medical Assistant and said nothing about access. Decision needed: D-19.

## 5. Metrics and definitions

Most numbers on this page are hardcoded.

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Total Calls | Card 1 and donut centre | Count of the organisation's call logs. Non-fresh organisations with none show 573. **Hardcoded, formula undefined** for the fallback |
| Completed | Card 2 | Count of calls with status Completed. Fallback 179 |
| Success rate | Card 2 subtitle | Completed divided by Total Calls times 100, one decimal. Total includes Pending and In Progress |
| Failed / Missed | Card 3 | Count of calls with status Failed. Fallback 21 |
| Avg. Duration | Card 4 | **Hardcoded, formula undefined** ("0m 14s") |
| Active Tasks count | Panel badge | Count of all tasks in the store |
| Call Distribution | Donut | **Hardcoded, formula undefined** (ten slices summing to 573) |
| Conversion Overview | Bar chart | **Hardcoded, formula undefined** (573 down to 142) |
| Peak completion 86.4 percent, AI handled 74 percent | Performance Analysis | **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

The Overview is not a step in any of the four journeys. It only reads call logs and tasks.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-03 | Is the Overview a call and automation analytics dashboard (as built), a clinical command centre (as PRD), or both? | Naming note, F-1.10, F-2.5 |
| D-19 | Which roles may open the Overview and Reports? | F-1.9 |
| D-83 | What is the canonical call outcome set, with one data source shared by Overview, Reports and Call Logs? | F-1.1, F-2.2 |
| D-84 | How are Avg. Duration, success rate, Missed and Incomplete defined? | F-1.2, F-1.3, F-1.4 |
| D-90 | What are the funnel, insights and filter options, and where do they come from? | F-2.1, F-2.3, F-2.4 |
| D-91 | Which tasks appear in Active Tasks (mine or team, which statuses, admin tasks)? | F-3.1 |
| D-144 | Should the dashboard show a notifications panel? | F-1.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
