---
title: "Identity Gate & Face Biometrics"
product: "ai-receptionist"
module: "checkin"
channel: "identity-biometrics"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Check-In & Booking - Identity Gate & Face Biometrics (`/reception/appointment`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Biometric Enrollment Status & Revocation | Face templates registered at the lobby kiosk sync to the patient's profile, allowing front-desk staff to inspect enrollment dates or delete biometric data upon request. | [View in Client](/client/clients) |
| Client | Today's Appointment Lookup | Once a returning patient confirms their identity on the kiosk, today's bookings created by clinic staff load immediately so patients skip extra forms. | [View in Client](/client/appointments/calendar) |
| Client | Reception Audit Trail | Biometric matches, enrollments, deletions, and arrivals record structured activity entries for clinic compliance tracking. | [View in Client](/client/settings/audit-logs) |
| Companion | Visit Continuity | Patients who prefer skipping face scan or check in at the kiosk see synchronized arrival and queue status on their Companion Today view. | [View in Companion](/companion/today) |

## 1. Module Summary
- The **Identity Gate & Face Biometrics** flow serves as the single unified starting point when a visitor begins appointment check-in, walk-in registration, visit tracking, or next-step lookup on the AI Receptionist kiosk (`/reception/appointment`).
- Instead of confusing arriving patients with separate "Scheduled" vs "Walk-In" buttons upfront, the kiosk opens one fast camera verification screen alongside a persistent option to switch to mobile phone and OTP verification anytime.
- Strict patient privacy rules ensure zero personal health information is shown on screen until an identified visitor explicitly confirms their first-name greeting.

## 2. Feature Requests

### F-1: Unified Check-In Entry & Live Camera Mirror
#### 1. What it does
Whether a visitor taps **Appointment & Check-in** on the home screen, taps **Appointment** on the side dock, selects **Go to Check-in** from Visit Tracking, or asks Aria aloud to check in, the kiosk navigates to `/reception/appointment` and activates the front-facing camera in a comfortable mirrored preview. A centered oval alignment guide with four corner brackets and a top status badge (**Ready**, **Starting**, **Scanning**, **Verified**, or **Try again**) frames the visitor, while a floating action bar below provides **Start scanning**, **Cancel scanning**, **Try again**, and **Use phone number instead**.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Single Entry Flow | Navigation | Opens the unified identification screen from home tiles, dock shortcuts, visit empty state, or voice requests | Clears any prior visitor session cleanly |
| F-1.2: Mirrored Camera Window | UI Viewport | Displays live front-camera video mirrored naturally for easy head positioning | Automatically closes camera when leaving check-in |
| F-1.3: Oval Alignment Frame | Visual Guide | Shows dashed oval guide and corner brackets that turn green when centered | Helps visitors frame their face quickly |
| F-1.4: Top-Left Camera Badge | UI Status | Shows bilingual status (`Ready`, `Starting`, `Scanning`, `Verified`, `Try again`) alongside framing hints | Translated live in English & Hindi |
| F-1.5: Action Bar & Phone Escape | Control Bar | Keeps **Start scanning** and **Use phone number instead** visible below the camera frame | Remains usable even if camera access is blocked |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Returning patient taps Appointment on the lobby home screen | Opens check-in view with live mirrored camera | **Blue oval guide, Start scanning CTA, and Use phone number instead appear immediately** |
| 2 | Patient says "I have an appointment with Dr. Sharma" | Speaks check-in phrase on home screen | **Kiosk opens face check-in automatically with spoken Aria guidance** |
| 3 | Tablet camera permission is disabled | Opens check-in screen without webcam feed | **Patient taps Use phone number instead to proceed without getting blocked** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Arriving Patient | When starting check-in at a lobby kiosk, I want one clear place to verify myself, so that I do not have to guess between scheduled and walk-in queues upfront. |
| F-1-J2 | Front Desk Staff | When kiosk camera hardware has issues, I want patients to always see a phone fallback button, so that the lobby queue never stalls. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a visitor selects Appointment or asks to check in, when the screen opens, then the camera preview, alignment guide, **Start scanning**, and **Use phone number instead** MUST be displayed. |
| F-1-2 | Given the visitor leaves the check-in screen or resets the session, when the screen closes, then the active camera feed stops immediately. |
| F-1-3 | Given camera permission is denied, when the visitor views the check-in panel, then **Use phone number instead** MUST remain active and clickable. |

---

### F-2: Real-Time Face Distance & Centering Coaching
#### 1. What it does
While the visitor stands before the camera, the kiosk continuously evaluates face distance and centering inside the oval guide and displays gentle live coaching hints above the frame:
- **Too Close:** Prompts the visitor to step slightly back.
- **Too Far:** Prompts the visitor to step closer to the screen.
- **Off Center:** Guides the visitor to center their face inside the oval.
- **Aligned:** Once properly positioned and centered, the oval guide and corner brackets turn emerald green so the visitor knows they are ready to scan.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Distance Guidance | Live Hint | Detects when a visitor stands too far away or too close to the kiosk camera | Updates banner message immediately |
| F-2.2: Centering Check | Alignment Logic | Checks horizontal and vertical alignment inside the oval reticle | Prompts slight head centering if off-target |
| F-2.3: Green Ready State | Visual Feedback | Switches brackets and dashed oval to green once distance and centering pass | Signals optimal capture framing |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor stands two meters back | Looks at kiosk from a distance | **Guide stays blue and prompts visitor to move closer** |
| 2 | Visitor steps forward into center | Aligns face inside oval frame | **Oval and corner brackets turn emerald green confirming ideal framing** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | First-Time Kiosk User | When positioning in front of the camera, I want clear visual cues to step closer or center my head, so that my face scan succeeds on the first try. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a face stands too far, too close, or off-center, when live framing evaluates, then the oval border remains blue and displays a corrective hint. |
| F-2-2 | Given the face is comfortably centered and within distance range, then the oval border and corner brackets MUST switch to green. |

---

### F-3: 3-2-1 Countdown, Face Matching & 3-Attempt Phone Fallback
#### 1. What it does
Tapping **Start scanning** (or saying "Start scan") begins a brief **3 -> 2 -> 1** countdown so the visitor holds steady, followed by a scanning sweep across the oval to compare against enrolled patient templates.
- If **matched** against a consented profile, the kiosk proceeds to the private confirmation gate.
- If **unmatched**, the kiosk gently displays **Try again** while still keeping **Use phone number instead** visible. After **3 unsuccessful attempts**, the kiosk stops retrying, displays `"Multiple attempts reached. Please use phone number check-in."`, and routes the visitor cleanly into mobile OTP verification.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: 3-2-1 Countdown | Timer | Counts down 3 seconds before capturing so visitors look steadily at the lens | Can be cancelled anytime via Cancel scanning |
| F-3.2: Consented Template Match | Verification | Checks against previously consented adult patient profiles | Never matches unconsented visitors |
| F-3.3: 3-Attempt Escalation | Guardrail | Allows up to 3 scan retries before directing visitor to phone verification | Prevents frustrating endless retries |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Enrolled patient scans face | Taps Start scanning, waits through 3-2-1 countdown | **Scan matches profile and advances to Privacy Verification** |
| 2 | Visitor wearing heavy sunglasses fails 3 scans | Tries Start scanning / Try again three times | **Kiosk shows "Multiple attempts reached. Please use phone number check-in." and opens phone keypad** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Returning Patient | When checking in quickly, I want a short countdown before capture, so that blurry motion doesn't cause false failures. |
| F-3-J2 | Unregistered Visitor | When my face is not recognized after a few tries, I want the kiosk to transition cleanly to phone check-in, so that I am not stuck retrying endlessly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given **Start scanning** is activated, when capture begins, then a **3-2-1** countdown runs prior to matching and can be aborted by **Cancel scanning**. |
| F-3-2 | Given face matching fails 3 consecutive times, then the kiosk MUST display the multi-attempt message and transition to phone number check-in. |

---

### F-4: Zero-PHI Identity Confirmation & Automatic Flow Routing
#### 1. What it does
Even when facial recognition finds a match, **zero private health information is displayed on the public screen** prior to explicit visitor confirmation. The **Privacy Verification** screen shows only the patient's **first name** and match confidence (e.g., `"Hi Sunita, is this you?"` with **Yes, that's me** and **Not me** buttons):
- **Tapping "Yes, that's me":** Checks whether the patient has a scheduled appointment today. If yes, loads **Visit Summary & Room Assignment** immediately; if no scheduled appointment exists today, welcomes the returning patient and routes smoothly into Walk-In Service & Clinician Selection.
- **Tapping "Not me":** Immediately clears the matched profile without revealing surnames, phone numbers, doctors, or times, and routes safely to the phone keypad.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: First-Name-Only Gate | Privacy Card | Displays only first name + match percentage with **Yes, that's me** and **Not me** | Hides surname, phone, doctor, and invoice data |
| F-4.2: Scheduled vs Walk-In Auto-Split | Post-Confirm Router | Checks today's schedule automatically after confirmation | Scheduled visits jump to summary; unscheduled returning patients pick service |
| F-4.3: Safe Rejection Reset | Guard | Clears matched state instantly if user selects **Not me** | Supports voice `"Yes, that's me"` and `"Not me"` |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Matched visitor sees `"Hi Sunita, is this you?"` and confirms | Taps Yes, that's me | **Kiosk finds her 10:30 AM consultation today and opens Visit Summary** |
| 2 | Wrong person was tentatively matched | Taps Not me | **Profile clears immediately with zero private details exposed; phone keypad opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinic Patient | When confirming my face match in a public waiting room, I want my surname and appointment details hidden until I confirm it's me, so that bystanders cannot read my private information. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given a face match succeeds, when the confirmation screen renders, then surnames, phone numbers, appointment times, and medical IDs MUST NOT appear before **Yes, that's me** is selected. |
| F-4-2 | Given **Not me** is selected, then the kiosk MUST discard the candidate profile and transition to phone number check-in. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Unified Check-In Entry & Live Camera Mirror | F-1.1 to F-1.5 | Single mirrored camera check-in gate with oval framing guide and persistent phone escape. |
| F-2 | Real-Time Face Distance & Centering Coaching | F-2.1 to F-2.3 | Evaluates distance and centering live, turning the frame green when optimally aligned. |
| F-3 | 3-2-1 Countdown, Matching & 3-Attempt Fallback | F-3.1 to F-3.3 | Runs a steady 3-second countdown, matches consented templates, and routes to phone check-in after 3 misses. |
| F-4 | Zero-PHI Confirmation & Auto-Routing | F-4.1 to F-4.3 | Shows first-name confirmation only before revealing schedules or routing returning walk-ins. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Arriving Patient | Verify identity quickly at a single lobby screen without guessing appointment vs walk-in tracks upfront. | F-1, F-2, F-3 |
| 2 | Privacy-Conscious Visitor | Ensure personal appointment and health details remain hidden until identity is explicitly confirmed. | F-4 |
