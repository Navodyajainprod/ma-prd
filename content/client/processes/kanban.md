---
title: "Clinical Process Pipeline Kanban Board"
product: "client"
module: "processes"
channel: "kanban"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | PROCESSES |
| Channel | KANBAN |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Workflow Stage Stepper Visualization | When staff advance a patient across stages on the Kanban Board, the patient's Care Journey stepper in the Companion portal updates automatically to reflect their current clinical stage. | [View in Companion](/companion/today) |

## 1. Module Summary
- The Kanban Board within Process & Deals provides a visual, drag-and-drop clinical workflow board. Practice staff, coordinators, and medical assistants use this board to track patients moving across multi-stage care protocols (e.g. Lead Intake -> Insurance Verification -> Clinical Consultation -> Lab Diagnostic -> Post-Op Follow-up).
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Visual Drag-and-Drop Stage Columns & Deal Cards
#### 1. What it does
Renders active clinical processes as columns of stages with draggable patient cards. Moving a card from one column to another executes stage transition rules, updates timestamps, and triggers automated stage automations.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Multi-Stage Column Layout | UI Columns | Displays sequential columns with stage name, card count badge, and total revenue sum | Configurable per process |
| F-1.2: Draggable Process Card | UI Card | Cards display patient avatar, patient name, responsible coordinator, days in stage, and deal value | Drag-and-drop support |
| F-1.3: Quick Process Switcher | Dropdown | Switches between active clinical processes (e.g. Bariatric Care, Dental Implant, General Intake) | Persists selected process |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator verifies patient insurance | Drags Sarah Johnson's card from 'Insurance Verification' to 'Ready for Consultation' | **Card moves smoothly; stage update is logged, and attending physician is notified** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When reviewing my patient caseload, I want to visualize where each patient is in their care journey, so that I can eliminate clinical bottlenecks. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a patient card on the Kanban board, dragging it to an adjacent stage updates its stage state immediately across the database. |

### F-2: Stage Deal Value & Revenue Forecasting Metrics
#### 1. What it does
Calculates and displays the aggregate commercial value of treatment plans currently residing in each stage column, along with weighted stage probabilities to estimate upcoming monthly clinic revenue.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Column Total Revenue Header | UI Badge | Displays sum of all patient deal values currently in that stage column | Updates dynamically |
| F-2.2: Stage Probability Weighting | Metric | Multiplies total column value by stage conversion probability percentage | Shown in pipeline analytics |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Practice manager reviews 'Scheduled Surgery' stage | Column header displays '$48,500 across 7 patients' | **Practice manager verifies revenue projection for the upcoming surgical block** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When forecasting monthly clinic revenue, I want to see treatment values grouped by stage, so that I can track pending surgical conversions. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given patient cards with treatment plan values, each column header accurately sums the active values in real time. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Visual Drag-and-Drop Stage Columns & Deal Cards | F-1.1, F-1.2, F-1.3 | Renders active clinical processes as columns of stages with draggable patient cards. |
| F-2 | Stage Deal Value & Revenue Forecasting Metrics | F-2.1, F-2.2 | Calculates and displays the aggregate commercial value of treatment plans currently residing in each stage column, along with weighted stage probabilities to estimate upcoming monthly clinic revenue. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | When reviewing my patient caseload, I want to visualize where each patient is in their care journey, so that I can eliminate clinical bottlenecks. | F-1 |
| 2 | Practice Manager | When forecasting monthly clinic revenue, I want to see treatment values grouped by stage, so that I can track pending surgical conversions. | F-2 |
