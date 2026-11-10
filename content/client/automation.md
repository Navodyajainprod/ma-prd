---
title: "Global Automation Engine & Event Triggers"
product: "client"
module: "automation"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | AUTOMATION |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Global Automation module houses the system-wide automated event rules engine. It automates patient lifecycle transitions, appointment reminder dispatch cadences, and SLA escalation alerts across all clinic modules.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Global Automated Rule Registry & Execution Log
#### 1. What it does
Displays an administrative list of active automated clinical rules with rule name, trigger event, execution condition, action sequence, and an instant enable/disable toggle switch.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Automated Rules Table | Data Table | Lists rule title, trigger, action summary, execution count, and active switch | Searchable by rule name |
| F-1.2: Execution Audit Log Drawer | Drawer | Slide-over drawer detailing past rule firings with success/failure status and execution timestamps | Aids troubleshooting |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin checks automated appointment reminders | Observes rule 'Send SMS 48h before visit' executed 42 times today with 100% success | **Confirms patients received automated reminders** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Administrator | When automating routine communications, I want centralized rule monitoring, so that I can verify automations are executing reliably. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Disabling an automation rule immediately stops it from triggering on subsequent system events. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Global Automated Rule Registry & Execution Log | F-1.1, F-1.2 | Displays an administrative list of active automated clinical rules with rule name, trigger event, execution condition, action sequence, and an instant enable/disable toggle switch. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Administrator | When automating routine communications, I want centralized rule monitoring, so that I can verify automations are executing reliably. | F-1 |
