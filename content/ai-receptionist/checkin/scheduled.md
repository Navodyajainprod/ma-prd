---
title: "Scheduled Check-In & Token Issuance"
product: "ai-receptionist"
module: "checkin"
channel: "scheduled"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Check-In & Booking - Scheduled Check-In (`/reception/appointment`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Appointments Calendar & Arrived Status | Pre-booked visits scheduled by clinic staff appear automatically on the kiosk today lookup, and confirming check-in switches the calendar slot immediately to Arrived with its token number. | [View in Client](/client/appointments/calendar) |
| Client | Patient Timeline & Audit History | Confirming kiosk check-in logs a structured arrival event on the patient's profile timeline alongside assigned doctor and room. | [View in Client](/client/clients) |
| Client | Automation Triggers | Kiosk arrival broadcasts notify front-desk staff and downstream clinic workflows immediately when a patient checks in. | [View in Client](/client/automation) |
| Companion | Token & Queue Status Visibility | Issued consultation tokens (`D-042`) and live queue waits sync simultaneously to the patient's Companion portal. | [View in Companion](/companion/today) |

## 1. Module Summary
- The **Scheduled Check-In & Token Issuance** flow welcomes patients who already booked an appointment by phone, web portal, or front desk, taking them from verified identity straight to an issued queue ticket in a single confirmation tap.
- Automatically reading live clinic appointments scheduled for today, the kiosk summarizes patient identity, appointment details, consultation room, and live estimated wait in a clear **3-card Verification Stack**, then marks the visit **Arrived** and issues a numbered station token.

## 2. Feature Requests

### F-1: Today's Appointment Lookup & Scheduled Arrival Validation
#### 1. What it does
As soon as a returning patient verifies via Face Confirmation or Phone/OTP, the kiosk queries today's clinic appointments belonging to that patient across front-desk and web bookings (filtering for active upcoming today slots). When an active booking is found, the kiosk assembles the visit summary using the clinic's doctor-to-room assignments and calculates realistic waiting duration based on patients already waiting in that room (`at least 5 minutes`, scaling by active queue length). If no scheduled appointment is found for today, the kiosk greets the patient by name and transitions smoothly to Service & Doctor selection for a walk-in consultation.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Same-Day Slot Lookup | Search Rule | Matches today's scheduled/pending appointments booked from Desk, Phone, Web, or Kiosk | Recognizes patients seamlessly regardless of booking source |
| F-1.2: Dynamic Doctor-Room Pairing | Resource Map | Matches the booked clinician directly to their active consultation room | Uses clinic room configuration from Reception Settings |
| F-1.3: Dynamic Wait Estimator | Queue Math | Calculates live estimated wait (`max(5, (waiting + 1) * 10)` minutes) from room queue | Reflects current waiting-room volume |
| F-1.4: Walk-In Fallback | Graceful Branch | Routes returning patients with no today appointment cleanly to walk-in booking | Avoids dead-end "no appointment found" errors |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah was booked by phone for 11:00 AM with Dr. Sharma and arrives at 10:50 AM | Verifies face or phone OTP at kiosk | **Kiosk matches her 11:00 AM slot, resolves Dr. Sharma's Room, calculates live wait, and loads Visit Summary** |
| 2 | Registered patient arrives without a booking today | Verifies phone OTP | **Aria welcomes them back and opens walk-in Service & Doctor selection instead of showing an error** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Scheduled Patient | When checking in for an appointment booked over the phone, I want the kiosk to find my visit automatically, so that I do not repeat my details at the lobby. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a patient has an active appointment scheduled today in the clinic calendar, when identity verification succeeds, then the kiosk MUST display **Visit Summary & Room Assignment**. |
| F-1-2 | Given a verified returning patient has zero scheduled appointments today, then the kiosk MUST transition smoothly to walk-in service selection. |

---

### F-2: 3-Card Visit Verification Summary (`Visit Summary & Room Assignment`)
#### 1. What it does
Before generating a queue token, the kiosk presents a structured **3-Card Verification Stack** on **Visit Summary & Room Assignment** so the visitor can confirm every detail at a glance:
1. **Card 1 — Patient Identity Card:** Verified patient full name, age/gender summary, masked phone number (e.g., `***-***-7890`), and biometric check-in badge.
2. **Card 2 — Scheduled Appointment Card:** Service/consultation type, assigned doctor name, appointment date/time, and booking source label.
3. **Card 3 — Assigned Consultation Room & Estimated Wait Card:** Target room name, floor/wing directions, and current estimated waiting duration, paired with the primary **Confirm check-in & Print Token** button (and secondary back/cancel options).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Patient Card | Verification Card | Displays confirmed name, demographics, and masked phone for security | Never exposes raw full phone digits publicly |
| F-2.2: Appointment Card | Verification Card | Summarizes consultation service, clinician, and scheduled slot time | Confirms booking accuracy prior to token print |
| F-2.3: Room & Wait Card | Verification Card | Shows target consultation room, floor location, and estimated minutes until called | Reassures visitor where to head after confirmation |
| F-2.4: Confirm Check-In CTA | Action Button | Displays high-contrast **Confirm check-in & Print Token** trigger | Also responds to voice confirmation commands |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor reviews **Visit Summary & Room Assignment** | Checks Card 1 (Name + masked phone), Card 2 (Cardiology with Dr. Mehta at 2:00 PM), Card 3 (Room 102, ~15m wait) | **Taps Confirm check-in & Print Token with full confidence in room assignment** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Arriving Patient | When confirming my visit, I want to verify my doctor, room, and wait time cleanly in one view, so that I catch any scheduling mix-up before joining the queue. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given **Visit Summary & Room Assignment** loads, then all 3 cards (Patient Identity, Appointment Details, Assigned Room & Wait) and **Confirm check-in & Print Token** MUST be visible. |

---

### F-3: Duplicate-Safe Arrival Confirmation, Token Screen & Mobile Pass Dispatch
#### 1. What it does
Tapping **Confirm check-in & Print Token** triggers a duplicate-safe arrival submission: rapid double-taps cannot generate two sequential queue numbers. Upon success:
- The clinic appointment status updates live to **Arrived** with the assigned token number stamped on the schedule.
- The kiosk opens the **Token Issued** confirmation view showing the oversized token badge (e.g., **`D-042`**), target station/room, walking directions, current waiting position, and Aria's spoken celebration prompt.
- Visitors can tap to receive a digital pass via **SMS** or **WhatsApp** to their registered number, view live visit tracking, or tap to return cleanly to the lobby home screen.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Double-Tap Protection | Reliability Guard | Prevents duplicate queue tokens if a visitor taps Confirm multiple times quickly | Safe within 24-hour idempotency window |
| F-3.2: Live Schedule Sync | Status Sync | Updates appointment status to **Arrived** and alerts clinic calendar views | Staff see arrival instantly without calling desk |
| F-3.3: Issued Token Display | Confirmation View | Shows giant prefix token (`D-042`), room directions, and queue wait estimate | Aria speaks confirmation when unmuted |
| F-3.4: SMS / WhatsApp Digital Pass | Mobile Action | Sends the token number and room directions to the visitor's mobile device | Reduces paper handling |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient double-taps Confirm check-in & Print Token rapidly | Taps primary confirm CTA twice in 1 second | **Only one token (`D-042`) is created and shown; calendar switches slot to Arrived** |
| 2 | Patient wants ticket on mobile phone | Taps SMS or WhatsApp pass action on Token screen | **Digital token confirmation is dispatched to their phone and toast confirms delivery** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Front Desk Coordinator | When patients check themselves in at the lobby screen, I want the clinic calendar to mark them Arrived with their token automatically, so that I don't have to manually ask who is waiting. |
| F-3-J2 | Patient | When my token is issued, I want a copy on SMS or WhatsApp plus walking directions, so that I know my queue number and where to sit. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given **Confirm check-in & Print Token** is tapped once or multiple times rapidly, then exactly ONE queue ticket MUST be issued for that appointment. |
| F-3-2 | Given token issuance succeeds, then the appointment status in the clinic calendar MUST transition to **Arrived** and display the assigned token badge. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Same-Day Appointment Lookup & Walk-In Branch | F-1.1 to F-1.4 | Matches today's clinic bookings, pairs doctor rooms, calculates waits, or transitions cleanly to walk-in. |
| F-2 | 3-Card Visit Verification Stack | F-2.1 to F-2.4 | Summarizes patient identity, scheduled clinician/time, and room/wait before confirmation. |
| F-3 | Duplicate-Safe Confirmation & Mobile Pass | F-3.1 to F-3.4 | Issues one unique station token, updates clinic schedule to Arrived, and sends SMS/WhatsApp passes. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Pre-Booked Patient | Review appointment room details and receive my queue token in one tap with optional SMS/WhatsApp pass. | F-1, F-2, F-3 |
| 2 | Reception Staff | Eliminate manual arrival check-offs as self-checked patients turn Arrived live on the clinic calendar. | F-3 |
