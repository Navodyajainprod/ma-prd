---
title: "HIPAA Security Audit Logs & Access History"
product: "client"
module: "settings"
channel: "audit-logs"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SETTINGS |
| Channel | AUDIT-LOGS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Audit Logs tab records an immutable security ledger of all user authentications, patient record access events, medical record exports, and administrative configuration updates required for HIPAA compliance audits.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Immutable HIPAA Event Ledger & Access Trail
#### 1. What it does
Captures and displays all system actions with timestamp, user ID, user name, IP address, action type (LOGIN, PHI_VIEW, RECORD_EXPORT, PERMISSION_CHANGE), and target patient ID.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Audit Event Table | Data Table | Columns: Timestamp, Actor, Action, Entity Type, Record ID, IP Address | Read-only immutable log |
| F-1.2: Action Type Filter | Dropdown | Filters events by Logins, Record Views, Chart Edits, Exports, and Deletions | Aids security audits |
| F-1.3: Compliance CSV Export | Button | Exports selected audit log range as a signed CSV file for compliance auditors | Logs the export event itself |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Compliance officer reviews chart access | Filters by patient 'Sarah Johnson' | **Audit trail lists every staff member who opened or edited Sarah's chart with timestamps** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Compliance Officer | When conducting a HIPAA audit, I want an immutable access trail, so that I can demonstrate compliance with federal security rules. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Every patient chart view event is logged with actor ID, IP address, and exact UTC timestamp. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Immutable HIPAA Event Ledger & Access Trail | F-1.1, F-1.2, F-1.3 | Captures and displays all system actions with timestamp, user ID, user name, IP address, action type (LOGIN, PHI_VIEW, RECORD_EXPORT, PERMISSION_CHANGE), and target patient ID. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Compliance Officer | When conducting a HIPAA audit, I want an immutable access trail, so that I can demonstrate compliance with federal security rules. | F-1 |
