---
title: "Appointments Calendar & Multi-Provider Schedule"
product: "client"
module: "appointments"
channel: "calendar"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | APPOINTMENTS |
| Channel | CALENDAR |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Appointment Booking Synchronization | When patients book or reschedule appointment slots through the Companion portal, booked visits appear immediately on the provider's calendar grid with real-time slot locking. | [View in Companion](/companion/appointments) |

## 1. Module Summary
- The Appointments Calendar in the Client workspace provides a multi-provider clinical scheduling surface supporting Day, Week, and Month views. Clinical coordinators and doctors use this view to manage daily patient visit volume, allocate consultation rooms, detect schedule conflicts, and drag-and-drop appointments to reschedule in real time.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Provider Timeline Grid & View Mode Switcher
#### 1. What it does
Renders provider appointment schedules in Day, Week, and Month view layouts with configurable 15, 30, and 60-minute time slot increments. Practice coordinators can toggle between an all-provider column view and individual clinician schedules.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Day/Week/Month View Switcher | UI Toggle | Switches between 1-day multi-column, 7-day week, and monthly calendar layouts | Persists view mode across sessions |
| F-1.2: Provider Column Headers | UI Grid | Displays provider avatar, name, and specialty as column headers in Day view | Filters by selected provider |
| F-1.3: Current Time Indicator Line | UI Indicator | Renders a red horizontal line tracking the real-time wall-clock hour across the calendar | Updates every minute |
| F-1.4: Time Slot Granularity Selector | Dropdown | Adjusts slot grid intervals between 15m, 30m, and 60m blocks | Default is 30 minutes |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Practice coordinator reviews today's clinic schedule | Selects Day view and all providers | **Calendar displays side-by-side columns for each active doctor with scheduled bookings** |
| 2 | Clinician reviews their weekly caseload | Selects Week view and filters to their own name | **Renders 7-day personal schedule with confirmed patient visit blocks** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Coordinator | When reviewing clinic capacity, I want to view all doctor schedules side-by-side, so that I can balance patient volume across available practitioners. |
| F-1-J2 | Doctor | When starting my clinic day, I want to view my sequential appointments, so that I can prepare patient charts in advance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given the calendar view, when switching between Day, Week, and Month modes, the appointment grid updates instantly without full page reload. |
| F-1-2 | Given multiple providers, when filtering by a specific doctor, only that doctor's appointment blocks are visible. |

### F-2: Room Allocation & Clinical Resource Assignment
#### 1. What it does
Assigns physical consultation rooms and specialized medical equipment (e.g., Ultrasound Room 2, Minor Procedure Room) to scheduled appointments, preventing double-booking of physical clinic resources.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Room Tag Selector | Dropdown | Assigns an active examination room (e.g. Exam Room 1-4, Procedure Suite) to the appointment | Shows room availability |
| F-2.2: Room Double-Booking Alert | Warning Modal | Triggers warning toast if another provider has already reserved the room for that time window | Blocks save unless override confirmed |
| F-2.3: Equipment Flag Tag | Tag | Attaches specialized clinical equipment tags (e.g., ECG, Dermatoscope) to the booking card | Visual indicator on appointment card |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator assigns Exam Room 2 to Dr. Jenkins | Selects Exam Room 2 from room dropdown | **Room badge 'Exam 2' appears on appointment block and reserves the room in room schedule** |
| 2 | Another staff member tries to assign Exam Room 2 at the same time | Selects Exam Room 2 for conflicting booking | **System displays conflict warning: 'Exam Room 2 is already reserved by Dr. Jenkins'** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinic Administrator | When scheduling procedures, I want rooms and equipment checked for conflicts, so that doctors do not arrive to an occupied exam room. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given an occupied room, when another appointment is assigned to the same room during overlapping times, the system flags a double-booking warning. |

### F-3: Interactive Drag-and-Drop Rescheduling & Patient Alert
#### 1. What it does
Allows clinical staff to click, drag, and drop appointment cards to different time slots or different providers on the calendar grid. Moving an appointment automatically recalculates times and prompts an automated SMS/WhatsApp notification to the patient.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Draggable Appointment Card | UI Component | Appointment cards support mouse drag with shadow drop preview and time snapping | Snaps to nearest slot grid interval |
| F-3.2: Reschedule Confirmation Modal | Modal | Prompts coordinator to confirm new date/time/provider with checkbox to notify patient | Shows before-and-after times |
| F-3.3: Patient Notification Webhook | Logic | Dispatches automated WhatsApp/SMS message: 'Your appointment has been moved to [New Time]' | Logs dispatch in patient thread |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient calls to delay appointment by 1 hour | Staff drags appointment card from 10:00 AM to 11:00 AM | **Confirmation modal prompts 'Reschedule Sarah Johnson to 11:00 AM?'; staff clicks Confirm and patient receives SMS** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Medical Assistant | When a patient requests a time change over the phone, I want to drag their appointment to the new slot, so that rescheduling takes less than 5 seconds. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given an appointment card, when dragged and dropped to a new time slot, the appointment record updates and an audit event is logged. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Provider Timeline Grid & View Mode Switcher | F-1.1, F-1.2, F-1.3, F-1.4 | Renders provider appointment schedules in Day, Week, and Month view layouts with configurable 15, 30, and 60-minute time slot increments. |
| F-2 | Room Allocation & Clinical Resource Assignment | F-2.1, F-2.2, F-2.3 | Assigns physical consultation rooms and specialized medical equipment (e. |
| F-3 | Interactive Drag-and-Drop Rescheduling & Patient Alert | F-3.1, F-3.2, F-3.3 | Allows clinical staff to click, drag, and drop appointment cards to different time slots or different providers on the calendar grid. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Coordinator | When reviewing clinic capacity, I want to view all doctor schedules side-by-side, so that I can balance patient volume across available practitioners. | F-1 |
| 2 | Doctor | When starting my clinic day, I want to view my sequential appointments, so that I can prepare patient charts in advance. | F-1 |
| 3 | Clinic Administrator | When scheduling procedures, I want rooms and equipment checked for conflicts, so that doctors do not arrive to an occupied exam room. | F-2 |
| 4 | Medical Assistant | When a patient requests a time change over the phone, I want to drag their appointment to the new slot, so that rescheduling takes less than 5 seconds. | F-3 |
