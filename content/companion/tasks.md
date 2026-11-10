---
title: "Patient Prescribed Care Tasks & Reminders"
product: "companion"
module: "tasks"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | COMPANION |
| Module | TASKS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Tasks module provides a patient-facing health checklist: completing pre-operative fasting instructions, logging daily vitals (blood pressure, glucose), and checking off post-consultation care tasks.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Prescribed Health Checklist & Vitals Logging
#### 1. What it does
Lists doctor-prescribed health tasks with due dates, instruction cards, and one-tap completion checkboxes that update clinician records in real time.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Health Task Checklist | Checklist | Displays task title, clinical instruction, due time, and completion checkbox | Organized by Today vs Upcoming |
| F-1.2: Vitals Input Modal | Input Form | Captures numeric vitals data (e.g. Blood Pressure '120/80', Blood Glucose '95 mg/dL') | Validates physiological ranges |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Hypertension patient logs morning blood pressure | Taps 'Log Blood Pressure' task, enters 122/82, and taps save | **Task checks off with green badge and reading logs to patient chart in Client** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When managing a chronic condition, I want a daily health task checklist, so that I stay compliant with my doctor's care plan. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Completed tasks update immediately in the clinician's Client Tasks Queue. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Prescribed Health Checklist & Vitals Logging | F-1.1, F-1.2 | Lists doctor-prescribed health tasks with due dates, instruction cards, and one-tap completion checkboxes that update clinician records in real time. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | When managing a chronic condition, I want a daily health task checklist, so that I stay compliant with my doctor's care plan. | F-1 |
