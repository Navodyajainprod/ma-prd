---
title: "Appointments Table, Status Triage & Check-In Action"
product: "client"
module: "appointments"
channel: "list"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | APPOINTMENTS |
| Channel | LIST |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| AI Receptionist | Kiosk Check-In Real-Time Status Reflection | When a patient checks in via the AI Receptionist kiosk, their status in the Appointments List updates to 'Arrived' with a green arrival timestamp badge. | [View in AI Receptionist](/ai-receptionist/checkin/scheduled) |

## 1. Module Summary
- The Appointments List tab provides a high-density tabular view of all clinic appointments. Staff can filter by status (Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show), search by patient or provider, trigger immediate patient arrival check-in, and execute bulk rescheduling or export operations.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Filterable Appointments Data Table with Status Badges
#### 1. What it does
Displays scheduled visits in a structured table with sortable columns for Patient Name, Provider, Date/Time, Status, Assigned Room, Visit Reason, and Copay Amount. Includes quick status pills for rapid filtering.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Multi-Status Filter Pills | UI Filters | Quick filter buttons: All, Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show | Shows count badges |
| F-1.2: Patient & Provider Search | Search Input | Typeahead query filtering table rows by patient name, phone number, or provider name | Instant client-side filter |
| F-1.3: Date Range Picker | Date Range | Filters appointments by Today, Tomorrow, This Week, This Month, or custom date range | Defaults to Today |
| F-1.4: Sortable Column Headers | Table Header | Sorts table ascending/descending by appointment time, patient name, or status | Visual sort indicator |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist wants to see all arrived patients currently in the waiting lounge | Clicks 'Arrived' filter pill | **Table filters to show only patients with 'Arrived' status and their arrival timestamps** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Receptionist | When managing the waiting area, I want to filter by 'Arrived' status, so that I know which patients are ready for nursing triage. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given the appointments table, clicking any status filter pill isolates appointments matching that specific status. |

### F-2: Patient Arrival Check-In Action & Queue Trigger
#### 1. What it does
Provides a single-click 'Mark Arrived' button on appointment rows. Clicking this action sets the appointment status to 'Arrived', logs the check-in time, generates a digital queue token, and alerts the attending clinician via desktop notification.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Mark Arrived Button | Button | Action button on table row transitioning appointment from Confirmed to Arrived | Changes to green arrived badge |
| F-2.2: Arrival Timestamp Logger | Logic | Records exact arrival time and calculates waiting duration against scheduled time | Displayed in 'Wait Time' column |
| F-2.3: Provider Notification Alert | Toast Notification | Fires in-app toast notification to assigned clinician: 'Patient [Name] has arrived' | Includes sound chime |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient arrives at clinic reception desk | Receptionist clicks 'Mark Arrived' on Sarah Johnson's appointment row | **Status turns green 'Arrived', arrival time 10:02 AM is logged, and Dr. Jenkins receives notification** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Front Desk Staff | When a patient walks in, I want to mark them arrived with one click, so that their waiting timer starts and the doctor is notified. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a confirmed appointment, clicking 'Mark Arrived' transitions status to Arrived and records the current timestamp. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Filterable Appointments Data Table with Status Badges | F-1.1, F-1.2, F-1.3, F-1.4 | Displays scheduled visits in a structured table with sortable columns for Patient Name, Provider, Date/Time, Status, Assigned Room, Visit Reason, and Copay Amount. |
| F-2 | Patient Arrival Check-In Action & Queue Trigger | F-2.1, F-2.2, F-2.3 | Provides a single-click 'Mark Arrived' button on appointment rows. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist | When managing the waiting area, I want to filter by 'Arrived' status, so that I know which patients are ready for nursing triage. | F-1 |
| 2 | Front Desk Staff | When a patient walks in, I want to mark them arrived with one click, so that their waiting timer starts and the doctor is notified. | F-2 |
