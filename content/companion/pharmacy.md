---
title: "Prescriptions, Medication Schedule & Refill Requests"
product: "companion"
module: "pharmacy"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | COMPANION |
| Module | PHARMACY |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Prescriptions & Meds module tracks patient active medications: displaying drug names, dosages, daily schedules, prescribing doctors, and providing a one-tap prescription refill request button.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Active Medication Schedule & Prescription Refills
#### 1. What it does
Displays current medications with dosage instructions (e.g. 'Metformin 500mg, Take 1 tablet twice daily with meals') and provides an automated refill request button sent directly to the prescribing doctor.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Active Prescriptions Card List | Prescription Cards | Shows Drug Name, Dosage, Frequency, Prescribing Doctor, and Remaining Refills | Color-coded pill icons |
| F-1.2: One-Tap Refill Request Button | Action Button | Sends an automated refill approval task directly to prescribing clinician | Notifies patient upon approval |
| F-1.3: Dispensing Pharmacy Details | Info Card | Displays designated clinic or retail pharmacy address, hours, and phone number | Includes directions link |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient runs low on blood pressure medication | Taps 'Request Refill' on Lisinopril prescription card | **Refill request routes to Dr. Jenkins in Client; doctor approves with one click** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When my medication is running out, I want to request a refill from my phone, so that my doctor can approve it without an in-person appointment. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Refill requests create a task in the prescribing clinician's queue with previous prescription details. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Active Medication Schedule & Prescription Refills | F-1.1, F-1.2, F-1.3 | Displays current medications with dosage instructions (e. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | When my medication is running out, I want to request a refill from my phone, so that my doctor can approve it without an in-person appointment. | F-1 |
