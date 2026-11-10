---
title: "Care Team Tasks Queue & SLA Management"
product: "client"
module: "tasks"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | TASKS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Prescribed Task Delegation | When clinicians assign patient-facing home health tasks (e.g. blood sugar logs, medication check-off), they synchronize to the patient's Tasks tab in the Companion portal. | [View in Companion](/companion/tasks) |

## 1. Module Summary
- The Tasks Queue module provides a collaborative clinical task management system for healthcare teams. Staff can assign follow-up tasks, set priority flags, monitor SLA countdowns, and link tasks directly to patient EHR charts.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Collaborative Care Team Task Checklist
#### 1. What it does
Displays tasks in a structured list with one-click checkbox completion. Each task includes Title, Description, Associated Patient, Assigned Staff, Due Date, and Priority Flag (Low, Medium, High, Urgent).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Priority Flag Badges | UI Tags | Color-coded priority tags: Low (gray), Medium (blue), High (amber), Urgent (red) | Sortable by priority |
| F-1.2: One-Click Checkbox Completion | Checkbox | Marks task as completed, logs completion timestamp and user ID, and strikes through text | Triggers completion toast |
| F-1.3: Create Task Modal | Modal | Quick modal to create task with patient typeahead search, due date picker, and assignee | Assigns to active team member |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor delegates lab follow-up to nurse | Creates task 'Review potassium levels with Sarah Johnson', priority High, due today | **Task appears on nurse's dashboard with red high-priority tag** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinician | When finishing a visit, I want to assign follow-up tasks to nursing staff, so that care plan instructions are executed reliably. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Clicking a task completion checkbox updates its state to completed and logs the user who checked it off. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Collaborative Care Team Task Checklist | F-1.1, F-1.2, F-1.3 | Displays tasks in a structured list with one-click checkbox completion. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinician | When finishing a visit, I want to assign follow-up tasks to nursing staff, so that care plan instructions are executed reliably. | F-1 |
