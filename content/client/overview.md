---
title: "Overview Dashboard & Clinical Activity Feed"
product: "client"
module: "overview"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | OVERVIEW |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Overview Dashboard serves as the central command center for the practice. It consolidates daily appointment visit counts, real-time clinical activity events, revenue conversion funnel metrics, and one-click staff shortcuts.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Daily Appointment Visit Triage Counters
#### 1. What it does
Renders live KPI summary cards for Today's patient volume: Total Scheduled, Arrived & Waiting, Currently In Consultation, Completed Visits, and Cancelled/No-Shows.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Scheduled Visits KPI Card | Metric Card | Displays total count of appointments booked for today | Clickable to open Appointments Calendar |
| F-1.2: Arrived & In Lounge Counter | Metric Card | Displays live count of patients physically checked in and waiting | Highlighted in amber if wait > 20m |
| F-1.3: Completed Consultations Card | Metric Card | Tracks total clinical encounters concluded today | Shows progress bar against daily goal |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator opens dashboard at 11:00 AM | Card shows '18 Scheduled, 4 Arrived & Waiting, 6 Completed' | **Coordinator sees waiting lounge volume at a glance** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Coordinator | When beginning my shift, I want to see today's appointment volume at a glance, so that I can anticipate waiting room staffing needs. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | KPI counters update automatically when appointments are checked in or completed without full page refresh. |

### F-2: Real-Time Multi-Channel Activity Feed
#### 1. What it does
Displays a chronological live audit stream of practice events: inbound patient messages (WhatsApp, SMS, Website), form submissions, bill payments, and call logs.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Activity Event Stream | UI Feed | Shows event icon, patient name, action snippet, and relative timestamp (e.g. '2m ago') | Clickable to jump to record |
| F-2.2: Channel Filter Toggles | Filter Pills | Filters activity feed by Chats, Forms, Billing, or Calls | Allows focused triage |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient completes intake form on mobile | Feed displays 'Sarah Johnson submitted Medical Intake Form (2m ago)' | **Coordinator clicks feed item and opens Sarah's submitted form** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Medical Assistant | When monitoring patient actions, I want a unified real-time feed, so that I can respond immediately to new form submissions and messages. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Incoming patient actions appear at the top of the activity feed in real time. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Daily Appointment Visit Triage Counters | F-1.1, F-1.2, F-1.3 | Renders live KPI summary cards for Today's patient volume: Total Scheduled, Arrived & Waiting, Currently In Consultation, Completed Visits, and Cancelled/No-Shows. |
| F-2 | Real-Time Multi-Channel Activity Feed | F-2.1, F-2.2 | Displays a chronological live audit stream of practice events: inbound patient messages (WhatsApp, SMS, Website), form submissions, bill payments, and call logs. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Coordinator | When beginning my shift, I want to see today's appointment volume at a glance, so that I can anticipate waiting room staffing needs. | F-1 |
| 2 | Medical Assistant | When monitoring patient actions, I want a unified real-time feed, so that I can respond immediately to new form submissions and messages. | F-2 |
