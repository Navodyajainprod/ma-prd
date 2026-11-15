---
title: "Walk-In Registration, Voice Intake & Booking"
product: "ai-receptionist"
module: "checkin"
channel: "walk-in"
route: "/reception/walk-in"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | CHECK-IN: WALK-IN REGISTRATION |
| Route | `/reception/walk-in` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The path for a visitor with no booking: **New Patient Details** with dictation, an optional face enrolment, **Review and Approve**, then a service and doctor choice, a walk-in booking and a queue token. |
| **Who uses it** | Patient (a first-time visitor, a parent or a known patient with no booking). Front-desk Staff see the result in the clinic. No sign-in and no role is checked. |
| **Where you start it** | After phone verification finds no profile (`/reception/walk-in`), or from a known patient with no appointment today. |
| **Where the result goes** | A new client, a default onboarding process with a deal and a call log row, a walk-in appointment in two stores, and a queue token. |
| **How real is it** | 0 features work, 4 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Clients) | New client record | Approving the registration creates a client with the intake details. A known number is pre-filled but a second record is still created. Duplicates use name plus the last 10 digits, a different rule from the chat and form paths (G11-E-28). | [View Clients](/client/clients) |
| Client (Appointments) | Walk-in appointment | The booking saves a copy in the kiosk's own store as Confirmed and a second record in the clinic's store under a different id. No link joins them and the clinic record never shows Arrived (G11-E-27, G11-E-42). | [View Appointments List](/client/appointments/list) |
| Client (Process Kanban) | Default onboarding process and deal | The client enters the default onboarding process at the stage Initial Contact. A deal of a fixed 150 is created whatever the service (G11-E-29). | [View Process Kanban](/client/processes/kanban) |
| Client (Call Logs) | Process call log row | A call log row for the client is written and is labelled WhatsApp. | [View Call Logs](/client/call-logs) |
| Client (Services) | Service picker | Service names, durations and prices come from the Services catalogue. With none configured, three built-in services show. | [View Services](/client/services) |
| Client (Reception settings) | Default onboarding and token prefixes | Reception Settings choose the onboarding process and station prefixes. The onboarding process can be overridden by the appointment default (G9-E-10). | [View Reception Settings](/client/settings/reception) |

## 1. Module Summary

### The story in one minute

Sarah Johnson walks in with a sore knee and no booking. The kiosk finds no profile for her number and opens **New Patient Details**. She taps the microphone beside **Reason for Visit** and says, "Severe knee pain since Tuesday". She types her name and age 34. A consent screen offers **Register my face** and **Skip for now**. She skips. **Review and Approve** shows her details. She presses **Approve & Continue**. A client record, an onboarding process, a deal and an audit entry are created. She picks a service and presses **Next Available**. The kiosk books a walk-in and shows a token. The clinic's appointment record for the walk-in says Confirmed, not Arrived, and Meera Iyer sees it only in the queue.

### What is real and what is not

- **Real in the prototype:** the details form with its required name, dictation, the under-18 rule, the consent choice with a clear skip, the review screen with Edit and Decline, record creation on Approve, and the service picker.
- **Simulated:** face capture and the duplicate guard (constant samples), the pre-fill of a known patient (which still creates a second record), **Next Available**, the booking records, the token number and the SMS pass.
- **Not built:** encrypted face storage, error messages for a failed service or doctor load, and an Arrived walk-in in the clinic's appointment record.

### Journey position

```
Phone verified, no profile ─▶ Details ─▶ Face (optional, adults) ─▶ Review ─▶ Approve ─▶ Service and doctor ─▶ Book ─▶ Token
                                                                               └▶ client + onboarding process + deal + audit
```

## 2. Feature Requests

### F-1: New patient details, dictation and minor rule

#### 1. What it does
**New Patient Details** asks for **Full Legal Name**, **Age**, **Gender**, **Reason for Visit** and an optional email. A microphone button beside the name and the reason lets Sarah dictate. An empty name blocks Next. An age under 18 skips the face step and the step count drops from 5 to 4.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Details form | Form | Name (required), age, gender, reason and email | ● Works | |
| F-1.2: Dictation | Voice | Microphone buttons fill name and reason from speech | ● Works | |
| F-1.3: Under-18 rule | Rule | An age under 18 skips the face step and shows 4 steps | ● Works | The age is typed by the visitor. Decision needed: D-36 |
| F-1.4: Empty name | State | An empty name shows an inline notice and blocks Next | ● Works | |
| F-1.5: Known number on the walk-in route | Rule | A known patient is pre-filled, then Approve creates a new client anyway | ◐ Simulated | A second record is possible (G11-E-28). Decision needed: D-22 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | An adult dictates a reason | Taps the microphone and says "Severe knee pain since Tuesday", then enters age 34 | **The field fills and Next opens Register your face** |
| 2 | A parent registers a 12-year-old | Enters age 12 | **The step marker shows 4 steps and the face screen is skipped** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I register on a standing screen, I want to dictate my name and reason, so that intake takes seconds. |
| F-1-J2 | Patient | When I register my child, I want the kiosk to skip face collection, so that my child's privacy is protected. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** **Full Legal Name** is empty, **when** Next is pressed, **then** an inline notice blocks the step. |
| F-1-2 | **Given** an age under 18, **then** the face step is skipped and the marker shows 4 steps. |
| F-1-3 | **Given** a known number on the walk-in route, **when** the visitor approves, **then** a new client is still created. |

### F-2: Optional face enrolment and duplicate guard

#### 1. What it does
For an adult, **Register your face** shows a **Biometric Privacy & Consent** notice with **Register my face** and **Skip for now**. Skip goes straight to review. Register runs a three-sample capture and a duplicate check at a 0.85 similarity. The capture takes nothing from the camera: it averages three constant vectors, so every enrolee gets near-identical templates and the duplicate check can flag new patients as existing.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Consent and Skip | Screen | Shows **Register my face** beside **Skip for now**. Skip saves nothing and costs no priority | ● Works | |
| F-2.2: Three-angle capture | Capture | Runs a front, left and right capture | ◐ Simulated | Three constant vectors, nothing from the camera (G11-E-02) |
| F-2.3: Duplicate face guard | Rule | A match of 0.85 or more offers "Yes, that's me" to link to the existing record | ◐ Simulated | Constant templates flag new patients, and "Yes, that's me" links with no further check (G11-E-02, G11-E-08). Decision needed: D-40 |
| F-2.4: Encrypted template storage | Security | The consent text says the template is encrypted | ○ Not built | Stored as a plain number list in the browser (G11-E-12). Decision needed: D-37 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah prefers no biometrics | Taps **Skip for now** | **Review and Approve opens with no template saved** |
| 2 | A visitor registers a face | Taps **Register my face** | **The kiosk may report an existing patient even for a new person** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I am asked about face check-in, I want a clear Skip with no penalty, so that enrolment stays voluntary. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** **Skip for now** is pressed, **then** the visitor reaches review and no template is saved. |
| F-2-2 | **Given** **Register my face** is pressed, **then** three constant sample vectors are averaged and the camera image is not used. |
| F-2-3 | **Given** a duplicate warning, **when** the visitor presses "Yes, that's me", **then** the visitor is linked to the existing record with no further check. |

### F-3: Review, approve and record creation

#### 1. What it does
**Review and Approve** shows the name, age, gender, phone, email, reason and the face choice (Enrolled, Skipped or Not available (under 18)). **Approve & Continue** creates the client, any consented face template, an audit entry and the default onboarding process. **Edit Details** returns to the form. **Decline / Exit** saves nothing and goes home.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Review summary | Screen | Shows the entered data and the face choice | ● Works | |
| F-3.2: Edit and Decline | Buttons | Edit returns to the form. Decline resets with nothing saved | ● Works | Both answer by voice |
| F-3.3: Create on Approve | Action | Creates the client, face template, audit entry and default onboarding process | ◐ Simulated | Written in sequence, not as one transaction. Audit stays in the kiosk browser (G11-E-13). Decision needed: D-22 |
| F-3.4: Deal and call log row | Action | Also creates a deal of a fixed 150 and a call log row labelled WhatsApp | ◐ Simulated | Not in the earlier PRD (G11-E-29). Decision needed: D-101 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah sees a typo in her age | Presses **Edit Details** | **The form returns with her answers kept** |
| 2 | Sarah approves | Presses **Approve & Continue** | **A client, an onboarding process and a deal of 150 appear and service selection opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | Before my file is saved, I want to review my details and fix typos or back out, so that my record is correct. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** **Decline / Exit** is pressed, **then** no client and no template is created. |
| F-3-2 | **Given** **Approve & Continue** is pressed, **then** a client appears in the clinic's clients and service selection opens. A deal of 150 is also created. |

### F-4: Service, doctor, booking and token

#### 1. What it does
Sarah picks a service with its price and duration from the catalogue. She picks a doctor card or **Next Available**, which means no doctor is chosen and the first listed doctor is used. The kiosk books a walk-in, issues a numbered token and shows the room, directions and wait with an SMS button.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Service picker | Cards | Shows services with prices and durations from the Services catalogue. Three built-in services show when none are set | ● Works | |
| F-4.2: Load failure message | State | A failed service or doctor load leaves an empty picker with no message | ○ Not built | G11-E-41 |
| F-4.3: Next Available | Rule | Takes the first listed doctor, not the shortest queue | ◐ Simulated | G11-E-26. Decision needed: D-123 |
| F-4.4: Walk-in booking | Action | Saves an appointment as Confirmed in the kiosk's own store and a second record in the clinic's store under a different id. Check-in marks only the kiosk copy | ◐ Simulated | G11-E-27 |
| F-4.5: Arrived in the clinic schedule | Sync | The earlier PRD said the walk-in is marked Arrived in the clinic schedule | ○ Not built | G11-E-42, XM-02. Decision needed: D-122 |
| F-4.6: Token number | Rule | "D-" plus the count of all reception appointments plus 1 | ◐ Simulated | G11-E-24. Decision needed: D-124 |
| F-4.7: Token screen and SMS | Display | Shows token, room, directions and wait, with an SMS button that only logs. The summary shows the raw phone as the "masked" phone | ◐ Simulated | G11-E-22, G11-E-25, G11-E-34 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | An urgent walk-in wants the fastest doctor | Picks General Consultation, presses **Next Available**, confirms | **A token shows. The doctor is the first listed, not the shortest queue** |
| 2 | Meera checks the calendar | Opens the Appointments list | **The walk-in shows as Confirmed, not Arrived** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When I walk in without a booking, I want to pick a service and a doctor or the fastest one, so that I get a queue number straight away. |
| F-4-J2 | Front-desk Staff | When a walk-in registers at the kiosk, I want them to appear in the schedule as Arrived, so that I can call them without asking. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a service and a doctor or **Next Available**, **when** the visitor confirms, **then** a walk-in appointment and a numbered token are created. |
| F-4-2 | **Given** **Next Available**, **then** the first listed doctor is used. |
| F-4-3 | **Given** a walk-in booking, **then** the clinic's appointment record shows Confirmed and not Arrived. |
| F-4-4 | **Given** the service load fails, **then** the picker is empty and no message shows. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | New patient details, dictation, minor rule | F-1.1 – F-1.5 | ● / ◐ | Form, dictation and minor rule work; a known number is re-registered. |
| F-2 | Optional face enrolment and duplicate guard | F-2.1 – F-2.4 | ● / ◐ / ○ | Skip works; capture uses constants; no encryption. |
| F-3 | Review, approve and record creation | F-3.1 – F-3.4 | ● / ◐ | Review works; Approve also adds a fixed 150 deal. |
| F-4 | Service, doctor, booking and token | F-4.1 – F-4.7 | ● / ◐ / ○ | Booking and token made; never Arrived in the clinic record. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Dictate my name and reason | F-1 |
| 2 | Patient | Skip face collection for my child | F-1 |
| 3 | Patient | Keep face enrolment voluntary | F-2 |
| 4 | Patient | Review my details before they are saved | F-3 |
| 5 | Patient | Pick a service and doctor and get a number | F-4 |
| 6 | Front-desk Staff | See walk-ins in the schedule as Arrived | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor with the kiosk URL | Register as a patient, enrol a face, book and get a token | Nothing |
| Front-desk Staff | Nothing here. They see the new client, process and deal in the clinic | Not applicable |

The earlier PRD named the visitor and no access rule. Decision needed: D-41.

## 5. Metrics and definitions

| Metric | Formula |
| :--- | :--- |
| Deal amount on registration | **Hardcoded, formula undefined**: a fixed 150 whatever the service (G11-E-29) |
| Token number | "D-" plus the count of all reception appointments plus 1 |
| Wait on the token screen | **Hardcoded, formula undefined** (G11-E-22) |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → Billing | Walk-in registration approved (2.6) | Client created; duplicate rule differs from other paths; known numbers get a second record. |
| | Onboarding process and deal (2.7) | Default onboarding process, a fixed 150 deal and a call log row labelled WhatsApp. |
| | Service and doctor booking (2.8) | Two records under different ids, created as Confirmed. Not Arrived. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-36 | Is the visitor-typed age enough to exclude minors from biometrics? | F-1.3 |
| D-22 | For a kiosk walk-in match, link, offer the household picker or create new? | F-1.5, F-3.3 |
| D-40 | What second check goes with "Yes, that's me" on a duplicate-face warning? | F-2.3 |
| D-37 | What protection at rest and retention apply to face templates? | F-2.4 |
| D-101 | Should a walk-in registration create a deal, and with what amount? | F-3.4 |
| D-123 | How is shortest queue defined for Next Available, and how are waits computed? | F-4.3 |
| D-122 | Should kiosk check-in mark the appointment Arrived? | F-4.5 |
| D-124 | Is the token one sequence per station per day? | F-4.6 |
| D-41 | What may a successful verification authorise? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
