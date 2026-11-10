---
title: "Walk-In Patient Registration & Immediate Triage"
product: "ai-receptionist"
module: "checkin"
channel: "walk-in"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | CHECKIN |
| Channel | WALK-IN |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Patient Demographic Record & Appointment Creation | Walk-in intake creates a new patient in Client > Patients, marks source as 'Walked In', and appends an urgent walk-in appointment to today's schedule. | [View in Client](/client/clients) |

## 1. Module Summary
- The Walk-In Registration workflow enables unscheduled patients to sign up on-the-spot. It captures demographics, chief medical complaint, biometric consent, assigns an available provider or service, provisions a client record in MantraAssist, and issues an immediate queue ticket.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Walk-In Demographic Intake & Biometric Consent Capture
#### 1. What it does
Guides the walk-in patient through phone verification, demographic collection (Full Name, Age, Gender, Email), reason for visit, and optional biometric face consent for accelerated future check-ins. To confirm: Are walk-in patients required to capture biometric face templates or can face consent be completely opted out without staff override?

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Phone & Identity Verification | Keypad | Phone number entry and 4-digit OTP check to detect existing client records | Pre-populates known records |
| F-1.2: Demographic Intake Form | Touch Form | Clean on-screen inputs for First Name, Last Name, Age slider/input, Gender picker | Large touch targets |
| F-1.3: Chief Complaint & Symptoms Selector | Tag Grid | Pre-set reason chips (General Consultation, Fever/Flu, Prescription Refill, Skin Check, Custom text) | Quick single-tap selection |
| F-1.4: Biometric Consent Toggle | Consent Card | HIPAA-compliant opt-in toggle explaining face vector storage for fast check-in | Explicit audit timestamped |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New patient walks into clinic | Selects 'Walk-In Registration' on kiosk | **Enters phone, fills name 'Jane Smith', age 32, chooses 'General Consultation', and opts into face check-in** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Walk-In Patient | When I visit without an appointment, I want to register quickly, so that I can be placed in line to see a doctor. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Validating form creates a new Patient record in MantraAssist with source 'Walked In'. |
| F-1-2 | If phone matches an existing patient, past demographic fields pre-fill automatically. |

### F-2: Service & Provider Selection with Immediate Queue Placement
#### 1. What it does
Allows walk-in patients to pick their required clinical department (General OPD, Pediatrics, Dermatology) and select an available doctor or opt for 'Next Available Provider'. Issues an immediate walk-in token (e.g. 'D-088') and prints/texts directions. To confirm: Can walk-in patients select a specific doctor if that provider's schedule has zero open immediate slots?

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Department & Specialty Grid | Card Grid | Visual service cards displaying consultation fee, average wait time, and room wing | Shows live availability |
| F-2.2: Provider Picker ('Next Available') | Selector | Defaults to 'Next Available Doctor' with option to select specific on-duty practitioner | Displays doctor photos |
| F-2.3: Immediate Token & Ticket Generation | Ticket Card | Renders token 'D-088', station name ('Consultation Room 102'), and estimated wait time | Presents SMS send button |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient completes intake | Selects 'General Practice' with 'Next Available Doctor' | **System assigns Dr. Rajesh Patel (Room 102), issues token D-088, and updates wait queue** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Walk-In Patient | I want the fastest available doctor, so that my wait time is minimized. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Walk-in ticket is queued with priority 0 or urgent based on symptom triage. |
| F-2-2 | Assigned doctor station immediately receives notification of new walk-in patient. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Walk-In Demographic Intake & Biometric Consent Capture | F-1.1, F-1.2, F-1.3, F-1.4 | Guides the walk-in patient through phone verification, demographic collection (Full Name, Age, Gender, Email), reason for visit, and optional biometric face consent for accelerated future check-ins. |
| F-2 | Service & Provider Selection with Immediate Queue Placement | F-2.1, F-2.2, F-2.3 | Allows walk-in patients to pick their required clinical department (General OPD, Pediatrics, Dermatology) and select an available doctor or opt for 'Next Available Provider'. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Walk-In Patient | When I visit without an appointment, I want to register quickly, so that I can be placed in line to see a doctor. | F-1 |
| 2 | Walk-In Patient | I want the fastest available doctor, so that my wait time is minimized. | F-2 |
