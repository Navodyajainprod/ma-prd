---
title: "Patient Appointment Booking & Visit History"
product: "companion"
module: "appointments"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | COMPANION |
| Module | APPOINTMENTS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Visits & Booking module allows patients to book upcoming doctor appointments, select available consultation time slots, reschedule existing visits, and review past medical encounter histories.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Patient Self-Service Slot Booking & Rescheduling
#### 1. What it does
Enables patients to browse available clinical specialties, choose their preferred physician, pick an available calendar time slot, and confirm appointment booking.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Provider & Specialty Browser | List Selector | Lists available clinic practitioners with photos, bios, and consultation fees | Filters by specialty |
| F-1.2: Calendar Date & Time Slot Picker | Slot Grid | Renders available 15/30m open appointment slots for selected date | Locks slot during checkout |
| F-1.3: One-Click Reschedule / Cancel | Action Button | Allows patient to reschedule or cancel with mandatory cancellation reason | Requires 24h notice |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient needs follow-up visit with Dr. Jenkins | Selects Dr. Jenkins, chooses Thursday 2:30 PM slot, and taps 'Confirm Booking' | **Visit is booked immediately; patient receives calendar invite and confirmation SMS** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I need medical advice, I want to book an appointment directly from my phone, so that I don't have to call during office hours. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Selected appointment slots lock immediately to prevent duplicate bookings across patients. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Patient Self-Service Slot Booking & Rescheduling | F-1.1, F-1.2, F-1.3 | Enables patients to browse available clinical specialties, choose their preferred physician, pick an available calendar time slot, and confirm appointment booking. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | When I need medical advice, I want to book an appointment directly from my phone, so that I don't have to call during office hours. | F-1 |
