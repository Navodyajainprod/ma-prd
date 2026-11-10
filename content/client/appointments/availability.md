---
title: "Provider Weekly Working Hours, Buffer & Days-Off Rules"
product: "client"
module: "appointments"
channel: "availability"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | APPOINTMENTS |
| Channel | AVAILABILITY |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Working Hours & Buffer tab allows practice managers and clinicians to define recurring weekly availability schedules, configure pre-and-post visit buffer intervals, and designate planned days off and holiday blackouts.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Weekly Recurring Availability Hours Configuration
#### 1. What it does
Enables clinicians to configure working hours for each day of the week (Monday through Sunday), including start time, end time, and split shifts (e.g. 09:00 - 13:00 and 14:00 - 17:00 with a 1-hour lunch break).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Day-of-Week Enabled Toggles | Toggle Switches | Individual switches enabling or disabling availability for Monday through Sunday | Disabling day blocks all bookings |
| F-1.2: Shift Start/End Time Pickers | Time Inputs | Configures shift start and end times in 15-minute increments | Validates end time > start time |
| F-1.3: Split Shift / Break Intervals | Button & Input | Allows adding secondary shift blocks to accommodate midday breaks or hospital rounds | Supports up to 3 shifts per day |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dr. Patel sets working hours for Tuesdays | Enables Tuesday, sets 09:00 - 12:30 and 13:30 - 17:00 | **Calendar slots are generated only within these hours; 12:30 - 13:30 is shaded as lunch break** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Doctor | When setting my clinic hours, I want to block out lunch breaks and hospital rounds, so that patients cannot book when I am unavailable. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given disabled days or unconfigured time blocks, appointment booking slots are unavailable on both staff calendar and patient companion portal. |

### F-2: Pre-Visit Intake & Post-Visit Sanitization Buffer Rules
#### 1. What it does
Defines automated buffer intervals before and after appointments (e.g., 10 minutes prior for nursing intake, 10 minutes post for room sanitization and charting). Buffers prevent back-to-back appointment overlap.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Pre-Visit Buffer Selector | Dropdown | Sets buffer before appointment start (0m, 5m, 10m, 15m) for patient intake | Padded to calendar slot |
| F-2.2: Post-Visit Buffer Selector | Dropdown | Sets buffer after appointment end (0m, 5m, 10m, 15m, 30m) for charting | Blocks immediate re-booking |
| F-2.3: Slot Quantization Interval | Dropdown | Rounds slot start times to fixed intervals (e.g., :00, :15, :30, :45) | Ensures neat grid alignment |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic sets 10-minute post-visit buffer | Patient books 30-minute appointment at 10:00 AM | **Appointment spans 10:00 - 10:30; system automatically blocks 10:30 - 10:40 buffer; next available slot is 10:40 AM** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When configuring appointment slots, I want automated sanitization buffers, so that providers have time to clean exam rooms between patients. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a post-visit buffer of 10m, the subsequent available booking slot is scheduled starting after the buffer interval. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Weekly Recurring Availability Hours Configuration | F-1.1, F-1.2, F-1.3 | Enables clinicians to configure working hours for each day of the week (Monday through Sunday), including start time, end time, and split shifts (e. |
| F-2 | Pre-Visit Intake & Post-Visit Sanitization Buffer Rules | F-2.1, F-2.2, F-2.3 | Defines automated buffer intervals before and after appointments (e. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Doctor | When setting my clinic hours, I want to block out lunch breaks and hospital rounds, so that patients cannot book when I am unavailable. | F-1 |
| 2 | Practice Manager | When configuring appointment slots, I want automated sanitization buffers, so that providers have time to clean exam rooms between patients. | F-2 |
