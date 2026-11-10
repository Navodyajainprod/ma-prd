---
title: "Scheduled Appointment Check-In & Biometric Verification"
product: "ai-receptionist"
module: "checkin"
channel: "scheduled"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | CHECKIN |
| Channel | SCHEDULED |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Patient Arrival & Queue Status | When patient confirms check-in at the kiosk, their appointment status transitions from 'Booked' to 'Arrived' on the Client calendar, and the provider receives a desktop chime notification. | [View in Client](/client/appointments/calendar) |

## 1. Module Summary
- The Scheduled Check-In flow enables pre-booked patients to authenticate at the clinic kiosk using contactless face recognition or their mobile number. Upon verification, it disambiguates family profiles, confirms today's appointment with their physician, issues an automated queue ticket (e.g., 'D-042'), and provides room wayfinding directions.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Contactless Face Recognition Scan & Phone Keypad Fallback
#### 1. What it does
Matches patient facial scan against enrolled 512-dimensional vector embeddings with instantaneous recognition. When lighting or occlusion prevents matching, the kiosk seamlessly presents a touch-friendly 10-key numeric dialpad for phone number entry followed by a 4-digit SMS OTP verification (mock code 1234). To confirm: What is the maximum expiration window for the 4-digit verification OTP on the public kiosk screen?

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: WebCam Biometric Viewport | Camera Feed | Live video frame with circular oval guide and scanning laser animation | Operates at 30fps |
| F-1.2: Touch Keypad Phone Dialpad | Touch Dialpad | High-contrast numeric pad with phone country code and quick paste | Audio feedback on tap |
| F-1.3: 4-Digit OTP Verification Screen | PIN Input | Auto-advancing 4-cell OTP input with countdown timer and resend trigger | Mock code 1234 supported |
| F-1.4: Multi-Patient Family Disambiguation | Profile Selector | Lists family members associated with phone number (Self, Spouse, Child) | Prevents check-in collision |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Scheduled patient arrives at clinic lobby | Stands in front of kiosk screen | **Camera recognizes face embedding and displays 'Welcome back, Johnathan Doe!'** |
| 2 | Face scan fails due to mask | Taps 'Enter Phone Number' and enters '555-0192' | **Receives OTP, enters '1234', and selects 'Johnathan (Self)'** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Scheduled Patient | When I arrive at the clinic, I want to authenticate in under 5 seconds, so that I do not have to wait in line at the physical reception desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Face recognition match with confidence > 85% bypasses phone number entry. |
| F-1-2 | Entering correct phone and OTP loads all appointments matching the phone number for today. |

### F-2: Appointment Confirmation & Automated Queue Token Issuance
#### 1. What it does
Displays today's scheduled appointment details (Doctor Name, Specialty, Time, Consultation Room) and generates a priority queue ticket (e.g. 'D-042'). Calculates estimated wait time, displays currently serving token ('Now serving D-038'), and dispatches a digital pass with directions to the patient's phone.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Today's Appointment Review Card | Data Card | Displays Doctor Avatar, Specialty, Appointment Time, and Scheduled Service | Presents 'Confirm Check-In' CTA |
| F-2.2: Live Token Generation Card | Ticket Widget | Prominent token ticket display (e.g. 'D-042') with assigned station room | High-contrast clinical glass style |
| F-2.3: Current Serving & Wait Time ETA | Status Bar | Shows currently examined token ('Now Serving: D-038') and calculated wait time | Refreshes via live queue store |
| F-2.4: SMS Pass Dispatch & Directions Trigger | Action Group | One-tap button to text ticket pass to phone and launch interactive wayfinding map | Sends instant SMS pass |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient confirms appointment with Dr. Sharma | Taps 'Confirm Check-In' | **Kiosk assigns ticket D-042, notifies that 4 patients are ahead (est. 18 min), and prints/texts pass** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | After confirming my visit, I want a clear queue ticket and wait estimate, so that I know where to go and how long I will wait. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Upon confirmation, Queue Ticket status is set to 'waiting' and dispatched to provider station. |
| F-2-2 | Tapping 'Send SMS Pass' delivers full consultation room directions and live tracking link. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Contactless Face Recognition Scan & Phone Keypad Fallback | F-1.1, F-1.2, F-1.3, F-1.4 | Matches patient facial scan against enrolled 512-dimensional vector embeddings with instantaneous recognition. |
| F-2 | Appointment Confirmation & Automated Queue Token Issuance | F-2.1, F-2.2, F-2.3, F-2.4 | Displays today's scheduled appointment details (Doctor Name, Specialty, Time, Consultation Room) and generates a priority queue ticket (e. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Scheduled Patient | When I arrive at the clinic, I want to authenticate in under 5 seconds, so that I do not have to wait in line at the physical reception desk. | F-1 |
| 2 | Patient | After confirming my visit, I want a clear queue ticket and wait estimate, so that I know where to go and how long I will wait. | F-2 |
