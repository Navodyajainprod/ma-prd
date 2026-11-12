---
title: "Walk-In Registration, Voice Intake & Booking"
product: "ai-receptionist"
module: "checkin"
channel: "walk-in"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Check-In & Booking - Walk-In Registration (`/reception/walk-in`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | New Patient CRM Record Creation | Approving kiosk walk-in registration creates a full patient profile immediately inside the clinic CRM alongside their intake details. | [View in Client](/client/clients) |
| Client | Walk-In Appointment Slot Creation | Selecting a clinic service and doctor creates an active walk-in appointment in the clinic schedule marked Arrived with its queue token. | [View in Client](/client/appointments/list) |
| Client | Default Onboarding Workflow Assignment | Newly onboarded walk-in patients enter the clinic's configured Default Onboarding Process automatically so coordinators see them on the Kanban board. | [View in Client](/client/processes/kanban) |
| Client | Clinic Services Menu | Service cards shown to walk-in visitors pull names, durations, and fees directly from the practice's Services catalog. | [View in Client](/client/services) |
| Client | Reception Settings Defaults | Controls which onboarding process receives walk-ins and how station tokens are prefixed. | [View in Client](/client/settings/reception) |

## 1. Module Summary
- The **Walk-In Registration, Voice Intake & Booking** workflow enables unscheduled or first-time clinic visitors to register themselves, choose whether to enroll facial biometrics, select a medical service and clinician, and obtain a waiting queue token directly at `/reception/walk-in`.
- Guided step indicators adapt automatically (`5 steps` for adults, `4 steps` for underage minors), supported by hands-free voice dictation for name and visit reason fields, automatic duplicate face-profile merging, and live sync into the clinic's CRM, Appointments list, and Onboarding Pipeline.

## 2. Feature Requests

### F-1: New Patient Details, Voice Dictation & Minor 4-Step Rule (`New Patient Details`)
#### 1. What it does
First-time visitors whose phone number has no existing profile enter **New Patient Details** to complete four clean fields: **Full Legal Name \***, **Age \***, **Gender**, and **Reason for Visit** (plus optional email). Inline microphone buttons beside Full Legal Name and Reason for Visit let visitors dictate answers naturally instead of typing on glass. Submitting checks the entered age:
- **Adults (`18+`):** Keeps all **5 steps** (`Details -> Face -> Review -> Service & Doctor -> Token`) and proceeds to **Register your face**.
- **Minors (`under 18`):** Automatically disables biometric capture, collapses the progress bar cleanly from **5 steps to 4**, skips **Register your face** entirely, and jumps straight to **Review & Approval**.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Core Demographics Form | Intake Form | Captures required Full Legal Name & Age plus Gender, Reason for Visit, and Email | Validates non-empty Legal Name before continuing |
| F-1.2: Inline Mic Dictation | Voice Input | Populates Full Name and Reason for Visit hands-free from speech | Helpful for elderly or busy visitors |
| F-1.3: Under-18 Minor Bypass | Privacy Rule | Skips face registration automatically and adjusts step dots from 5 to 4 when age < 18 | Marks biometrics `"Not available (under 18)"` |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Adult taps mic next to Reason for Visit and says "Severe knee pain since Tuesday" | Dictates visit reason and enters Age 34 | **Field fills cleanly; tapping Next opens optional Register your face (Step 2 of 5)** |
| 2 | Parent registers a 12-year-old child | Enters Age 12 and child's name | **Step tracker adjusts to 4 steps; face screen is bypassed directly to Review** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | First-Time Walk-In | When registering on a standing screen, I want to dictate my name and reason for visiting cleanly, so that intake takes seconds. |
| F-1-J2 | Parent / Guardian | When registering a minor child, I want the kiosk to skip facial biometric collection automatically, so that my child's privacy is protected. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given **Full Legal Name** is empty, when Next is tapped, then an inline error notice MUST block advancement. |
| F-1-2 | Given **Age < 18**, when details are submitted, then the face registration step MUST be skipped and total progress steps MUST display `4`. |

---

### F-2: Optional Adult Face Enrollment & Duplicate Profile Prevention (`Register your face`)
#### 1. What it does
For adult walk-ins (`18+`), **Register your face** displays the **Biometric Privacy & Consent** notice explaining that an encrypted mathematical template is stored (never raw photographs) and can be revoked anytime. Visitors freely choose either:
- **Skip for now:** Advances straight to **Review & Approval** with zero delay or priority penalty.
- **Register my face:** Guides the visitor through capturing **3 quick angles (Front -> Left -> Right)** to ensure accurate recognition across angles, checking against existing enrolled templates (`0.85` high-similarity threshold). If a matching profile already exists in the system, the kiosk offers to merge cleanly (`"Yes, that's me"`) instead of creating a duplicate patient record!

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Privacy Consent vs Skip | Opt-In Screen | Presents clear **Register my face** alongside unpenalized **Skip for now** | Never mandatory for walk-in care |
| F-2.2: 3-Angle Face Capture | Guided Scan | Captures Front, slight Left, and slight Right views in ~4.5 seconds | Improves future check-in accuracy |
| F-2.3: Duplicate Face Guard | De-Duplication | Alerts if face strongly matches an existing record (`>= 0.85`) and lets visitor merge | Prevents duplicate CRM records under alternate numbers |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Adult prefers not to use biometrics | Taps Skip for now | **Proceeds immediately to Review & Approval with identical booking priority** |
| 2 | Patient had enrolled earlier under an old phone number | Taps Register my face and completes 3 angles | **System detects strong existing match and offers one-tap profile confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Privacy-Sensitive Adult | When asked about face check-in, I want a clear Skip option with no waiting penalty, so that enrollment remains truly voluntary. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given **Skip for now** is tapped, then the visitor MUST advance to Review & Approval with zero biometric templates saved. |
| F-2-2 | Given face registration strongly matches an existing profile, then a duplicate-profile confirmation choice MUST appear before creating a second profile. |

---

### F-3: Review & Approval Gate + CRM Profile & Onboarding Sync
#### 1. What it does
Before creating a permanent patient profile, **Review & Approval** displays a clean summary of entered Name, Age, Gender, Phone, Email, Visit Reason, and Biometric choice (**Enrolled**, **Skipped**, or **Not available (under 18)**) alongside three clear controls (also supported by voice):
- **Approve & Continue:** Creates the official clinic CRM client record, saves any consented face template with timestamped audit log, enrolls the patient into the clinic's **Default Onboarding Process** automatically, and opens **Service & Doctor Selection**.
- **Edit Details:** Steps safely back to **New Patient Details** to fix typos.
- **Decline / Exit:** Aborts registration with zero records persisted and resets to Home.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Final Registration Summary | Review Screen | Summarizes all typed/dictated intake data and biometric consent state | Prevents accidental typos entering CRM |
| F-3.2: Atomic Creation on Approve | Sync Action | Saves CRM profile, consented face vector, audit entry, and default onboarding process together | Nothing written if user Declines |
| F-3.3: Edit / Decline Controls | Action Buttons | Permits editing fields freely or cancelling cleanly prior to commit | Works via touch or voice commands |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor notices typo in age on Review card | Taps Edit Details | **Returns to New Patient Details with form inputs preserved for quick correction** |
| 2 | Visitor approves final summary | Taps Approve & Continue | **Patient record & default onboarding pipeline entry are created; Service Selection opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Walk-In Visitor | Before my file is saved, I want a chance to review my details and edit typos or back out completely, so that my clinic chart is accurate. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given **Decline / Exit** is tapped on Review, then zero patient records or biometric templates MUST be created. |
| F-3-2 | Given **Approve & Continue** is tapped, then the patient profile MUST appear in the clinic CRM and advance to **Service & Doctor Selection**. |

---

### F-4: Walk-In Service, Clinician Selection (`Next Available`) & Token Print
#### 1. What it does
Both newly registered patients and returning visitors without an appointment today arrive at **Service & Doctor Selection** to complete their walk-in booking:
1. **Pick Clinical Service:** Select from clinic services (e.g., General Consultation, Specialty Workup, Eye Checkup, Physiotherapy) showing duration and fee context.
2. **Pick Clinician or "⚡ Next Available":** Choose **⚡ Next Available** for fastest queueing or select a specific doctor card.
3. **Confirm Booking & Issue Token:** Books the walk-in slot immediately marked **Arrived**, updates the front-desk schedule across open clinic screens, and displays the issued station token (`D-044`), assigned consultation room, walking directions, estimated wait time, and SMS/WhatsApp pass actions.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Clinic Service Catalog Cards | Service Picker | Lists available walk-in services with clear pricing and durations | Pulls directly from clinic Services setup |
| F-4.2: "⚡ Next Available" vs Specific Doctor | Doctor Picker | Automatically picks shortest queue when Next Available is chosen, or assigns preferred clinician | Filters clinicians cleanly |
| F-4.3: Walk-In Slot & Token Issuance | Commit & Ticket | Creates arrived walk-in booking in clinic schedule and generates station token | Broadcasts update live to Reception Desk |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Urgent walk-in wants fastest doctor | Selects "General Consultation" and taps "⚡ Next Available", confirms | **Walk-in appointment marked Arrived on schedule; kiosk issues token (`D-044`) and points to shortest-queue doctor room** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Unscheduled Patient | When walking in without an appointment, I want to pick my service and either a specific doctor or the fastest available doctor and get a queue number immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given service and clinician (or **⚡ Next Available**) are selected and confirmed, then an arrived walk-in appointment and a numbered queue token MUST be generated immediately. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Patient Details, Dictation & Minor Rule | F-1.1 to F-1.3 | Collects intake demographics via touch or voice and bypasses face steps for under-18 minors. |
| F-2 | Optional Face Capture & Deduplication | F-2.1 to F-2.3 | Offers voluntary 3-angle adult biometric registration with duplicate profile prevention. |
| F-3 | Review Gate & CRM Pipeline Sync | F-3.1 to F-3.3 | Lets visitors review/edit/cancel before creating CRM, biometric, and onboarding workflow records. |
| F-4 | Walk-In Service/Doctor Booking & Token | F-4.1 to F-4.3 | Books walk-in slots with "Next Available" support, syncs desk calendars, and issues tokens. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | New Walk-In Patient | Complete registration rapidly with voice help, optional face check-in, and final review accuracy. | F-1, F-2, F-3 |
| 2 | Unscheduled Returning Patient | Book a walk-in consultation with the fastest available doctor and receive a token immediately. | F-4 |
