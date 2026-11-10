---
title: "Process Instances Data Table & SLA Indicators"
product: "client"
module: "processes"
channel: "list"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | PROCESSES |
| Channel | LIST |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Instances List tab provides a tabular, high-density view of all active and completed process instances. Coordinators can filter by responsible team member, identify instances exceeding stage SLA thresholds, and execute bulk reassignments.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Process Instances Filterable Table & SLA Countdown
#### 1. What it does
Lists all running patient process instances with sortable columns: Patient Name, Process Name, Current Stage, Responsible Staff, Days in Stage, Deal Value, and SLA Timer.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Sortable Instances Table | Data Table | Displays patient name, current stage, responsible coordinator, and elapsed time in stage | Sortable by any column |
| F-1.2: SLA Violation Warning Badge | UI Tag | Highlights instances that have remained in a stage longer than the maximum allowed SLA in red | Visual bottleneck alert |
| F-1.3: Responsible Member Filter | Dropdown | Filters instance table to show only items assigned to a specific team member | Includes 'Unassigned' option |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Supervisor checks for delayed patient charts | Sorts table by 'Days in Stage' descending | **Three instances show red 'SLA Overdue (+3 days)' badge; supervisor reassigns them to clear backlog** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Supervisor | When monitoring care protocol compliance, I want to spot SLA violations, so that patients are not left waiting between clinical stages. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given instances exceeding stage SLA thresholds, the system renders a high-visibility warning indicator. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Process Instances Filterable Table & SLA Countdown | F-1.1, F-1.2, F-1.3 | Lists all running patient process instances with sortable columns: Patient Name, Process Name, Current Stage, Responsible Staff, Days in Stage, Deal Value, and SLA Timer. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Supervisor | When monitoring care protocol compliance, I want to spot SLA violations, so that patients are not left waiting between clinical stages. | F-1 |
