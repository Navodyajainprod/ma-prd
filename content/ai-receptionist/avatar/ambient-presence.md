---
title: "Ambient Presence & Wake Flow"
product: "ai-receptionist"
module: "avatar"
channel: "ambient-presence"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Avatar & Voice Experience - Ambient Presence & Wake (`/reception`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Reception Facility Context | Kiosk configuration and clinic rooms managed in Client Reception Settings drive what visitors can act on right after waking Aria. | [View in Client](/client/settings/reception) |
| Client | Clinic AI Voice Configuration | Organization voice channel settings define Aria's active reception voice persona used during welcome greetings. | [View in Client](/client/settings/voices) |
| Client | Scheduled Visits Entry | Tapping Appointment on the home screen opens check-in connected directly to today's clinic appointment calendar. | [View in Client](/client/appointments/calendar) |
| Client | Billing & Invoice Access | Tapping Billing on the home screen launches phone-verified invoice lookup backed by Client Billing. | [View in Client](/client/invoices) |
| Companion | Mobile Alternative | Visitors who prefer checking in or tracking queues on their own smartphone can continue seamlessly inside the Companion portal. | [View in Companion](/companion/today) |

## 1. Module Summary
- The **Ambient Presence & Wake Flow** defines the standing lobby home screen of Aria (`/reception`), designed as a calm, approachable clinic greeter ready for walk-up visitors.
- Combining gentle **close-proximity presence sensing** with large **one-tap Quick Action cards** (`Appointment`, `Billing`, `Feedback`, `Directions`) and a manual **Start** button, Aria welcomes patients who stop in front of the terminal while ignoring passersby across the waiting room.
- Every visit begins on a clean, private home screen with any prior patient details completely cleared between visitors.

## 2. Feature Requests

### F-1: Canonical Lobby Home & Privacy-Clean Session Reset
#### 1. What it does
Whether a kiosk opens `/reception`, `/reception/landing`, or `/reception/idle`, it normalizes cleanly to the canonical home screen and presents Aria's welcoming lobby presence. Whenever the kiosk returns home from an appointment, check-in, visit tracker, or billing screen, all prior patient names, phone numbers, verification codes, and invoice views clear immediately so no waiting-room visitor can ever see the previous person's information.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Normalized Home Route | Navigation | Opens the unified standing lobby experience consistently across legacy or canonical entry paths | Prevents stale history back-navigation |
| F-1.2: Instant Visitor Session Wipe | Privacy Safeguard | Clears prior patient selection, entered phone/OTP digits, onboarding drafts, and bills on return | Guarantees clean privacy slate per visitor |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Previous patient finishes checking out and taps Home | Returns to `/reception` lobby screen | **Previous patient's invoice and name disappear instantly; next visitor sees fresh home stage** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Privacy Lead | When one visitor steps away and the next walks up, I want all previous visitor details erased immediately, so that private health or billing info never leaks. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a visitor finishes any flow and returns Home, then all previous patient, appointment, and invoice details MUST be cleared before displaying the ambient screen. |

---

### F-2: Passive Close-Proximity Greeting & Privacy Disclosure
#### 1. What it does
While waiting in the lobby, the kiosk samples camera presence gently (`5 times per second`) solely to notice when someone steps up closely and pauses intentionally in front of the screen:
- **Distant Lobby Movement Ignored:** Staff and patients walking across the waiting area (`under 14%` frame size) or passing briefly without pausing never trigger false audio interruptions.
- **Intentional Approach Wake:** Only when someone stands close (`at least 30%` height ratio) for **two consecutive checks** does Aria wake up and greet them warmly.
- **Zero Passive Identification & Clear Notice:** Ambient camera presence measures distance only — it **never runs face recognition or saves images**. A clear persistent top-right green status badge reads **"Camera active for greeting only"**.
- **Camera-Free Degrade:** If a clinic tablet disables camera permissions or runs on unsupported hardware, the kiosk stays 100% operational via the manual **Start** button and Quick Action tiles.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Distance & Dwell Filter | Approach Logic | Distinguishes close stationary visitors (`>= 30%` height for 2 ticks) from passing background foot traffic | Stops annoying repeated lobby greetings |
| F-2.2: Non-Identifying Camera Promise | Privacy Control | Evaluates distance ephemerally in memory with zero biometric matching or photo storage | Preserves lobby visitor anonymity |
| F-2.3: `"Camera active for greeting only"` Pill | Transparency Badge | Displays a constant visible status notice near the camera indicator | Builds visitor trust at a glance |
| F-2.4: Touch-First Fallback | Hardware Resilience | Operates seamlessly via touch buttons if camera permission is denied | Never blocks kiosk check-in |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist walks behind waiting chairs | Passes through distant background view (`9%` ratio) | **Kiosk stays calm and silent with zero unwanted greeting** |
| 2 | Patient steps directly up to the standee and pauses | Stands within close greeting zone for ~0.4 seconds | **Aria shifts smoothly into attentive greeting without identifying them yet** |
| 3 | Tablet has camera permission turned off | Approaching visitor taps **Start** or **Appointment** | **Full voice and touch reception workflows launch immediately** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Approaching Visitor | When I walk up and stand in front of the kiosk, I want Aria to greet me naturally without bothering people sitting behind me. |
| F-2-J2 | Privacy Compliance Officer | When the home camera is active for greetings, I want visitors clearly informed that it is for greeting only and does not scan or identify them passively. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given background lobby motion below the close-proximity dwell threshold, then Aria MUST remain resting and MUST NOT play welcome audio. |
| F-2-2 | Given ambient mode is active, then facial matching MUST NOT execute and **"Camera active for greeting only"** MUST communicate camera purpose clearly. |

---

### F-3: 5-Phase Natural Welcome Sequence
#### 1. What it does
Whether triggered automatically by a close approach or manually by tapping the bottom-left **Start** (`शुरू करें` in Hindi) button, Aria executes a natural **5-phase conversational welcome**:
1. **Dormant:** Calm resting posture waiting in the lobby.
2. **Engaged (`0.3s` pause):** Brief attentive posture shift signaling she noticed the visitor.
3. **Greeting:** Speaks the warm clinic welcome in the active language (`"Welcome to MantraCare! How can I help you today?"` or localized Hindi equivalent `"नमस्ते, MantraCare में आपका स्वागत है! मैं आज आपकी क्या सहायता कर सकती हूँ?"`).
4. **Listening (`0.2s` echo buffer):** Waits briefly after finishing her sentence so her own speaker output clears, then opens the microphone with live caption feedback.
5. **Routing:** Shows a brief thinking/understanding confirmation (`"One moment, directing your visit..."`) while transitioning smoothly to the visitor's requested workflow.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Attentive Lead-In (`0.3s`) | Conversational Cue | Smoothly bridges silent rest into spoken greeting without abrupt audio cuts | Prevents duplicate trigger overlaps |
| F-3.2: Bilingual Greeting | Voice Prompt | Welcomes visitors clearly in English or Hindi matching selected kiosk language | Synchronized with bottom live captions |
| F-3.3: Post-Speech Listening Handoff | Mic Timing | Adds a brief `0.2s` pause before listening so Aria does not hear her own voice | Ensures clean first-word capture |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor taps **Start** on a quiet morning | Taps **Start** in bottom-left corner | **Aria pauses briefly, greets visitor aloud with synced captions, opens mic, and listens for their request** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Lobby Visitor | When waking the kiosk by approach or tap, I want natural turn-taking pacing, so that Aria finishes speaking cleanly before expecting me to talk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given **Start** is tapped or close dwell triggers, then Aria MUST play the greeting before opening active voice listening with a brief post-speech buffer. |

---

### F-4: Responsive Flanking Quick Actions & Bottom **Start** Bar
#### 1. What it does
For visitors who prefer quiet touchscreen navigation over speaking out loud, the `AMBIENT` home screen surrounds Aria with four primary shortcuts translated dynamically between English and Hindi:
- **Appointment** (`अपॉइंटमेंट`) -> opens unified Face/Phone Check-In
- **Billing** (`बिलिंग`) -> opens Phone/OTP Billing Lookup
- **Feedback** (`प्रतिक्रिया`) -> opens Patient Feedback preview
- **Directions** (`दिशा-निर्देश`) -> opens Clinic Department & Room Wayfinding

On large lobby kiosks (`>= 1280px` wide), these tiles sit symmetrically two to the left and two to the right of Aria; on compact portrait tablets, they wrap cleanly into a neat bottom grid above the footer containing **Start** and the live voice caption bar. Tapping any Quick Action interrupts ongoing greeting audio immediately and jumps straight to that task.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Desktop Symmetrical Columns | Responsive Layout | Places `Appointment` & `Billing` left and `Feedback` & `Directions` right of Aria on wide screens | Balanced lobby kiosk geometry |
| F-4.2: Compact Grid Reflow | Mobile/Tablet Layout | Wraps all 4 Quick Action cards cleanly below Aria on smaller viewports | Zero clipping or horizontal scrolling |
| F-4.3: Direct Touch Bypass | Fast Action | Interrupts greeting TTS and jumps straight into the selected workflow | Works even while microphone is muted or silent |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Quiet patient wants directions without talking aloud | Taps **Directions** right away while greeting plays | **Greeting stops cleanly and Clinic Department Directory opens immediately** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Silent / Shy Visitor | When standing in a crowded waiting room, I want large one-tap shortcuts for my top clinic tasks, so that I don't have to speak aloud if I prefer privacy. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given any of the four Quick Action buttons (`Appointment`, `Billing`, `Feedback`, `Directions`) is tapped on the home screen, then the kiosk MUST stop ambient greeting audio and open the matching screen immediately. |

---

### F-5: Field Installer Diagnostic Mode (`?debug=1`)
#### 1. What it does
During physical standee installation or lighting calibration inside a clinic lobby, field technicians can load `/reception?debug=1` (or `?debug=true`) to view an unobtrusive top diagnostic status strip displaying the current wake phase, active screen, and camera status (`[DEBUG] Phase | Screen`). Standard clinic kiosk URLs omit this parameter so patients never see diagnostic overlays.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Query Flag Toggle | Installer Tool | Activates live phase/screen calibration badge strictly when `?debug=1` or `?debug=true` is appended | Hidden completely in normal production URLs |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Technician tests standee angle in bright sunlight | Opens `/reception?debug=1` and steps into range | **Live HUD confirms switch from `dormant` to `engaged` -> `greeting` -> `listening`** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Kiosk Installer | When calibrating standee tilt and distance in a lobby, I want an optional debug status strip, so that I can verify approach triggers without opening browser tools. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Given `?debug=1` is omitted from the kiosk URL, then zero diagnostic status badges MUST appear on screen. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Canonical Home & Session Reset | F-1.1 to F-1.2 | Normalizes lobby URLs and erases prior visitor data completely between sessions. |
| F-2 | Close-Proximity Greeting & Privacy | F-2.1 to F-2.4 | Greets visitors who pause nearby without matching biometrics or reacting to background traffic. |
| F-3 | 5-Phase Natural Welcome | F-3.1 to F-3.3 | Coordinates attentive pause, bilingual greeting, echo buffer, listening, and routing seamlessly. |
| F-4 | Responsive Quick Actions & Start Bar | F-4.1 to F-4.3 | Displays bilingual `Appointment`, `Billing`, `Feedback`, and `Directions` tiles across kiosk & tablet sizes. |
| F-5 | Field Calibration Mode | F-5.1 | Provides optional `?debug=1` telemetry overlay during physical lobby setup. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Lobby Visitor | Be greeted naturally on approach or launch any top reception task quietly with one tap. | F-2, F-3, F-4 |
| 2 | Privacy Lead & Installer | Keep camera presence strictly anonymous between sessions while simplifying lobby calibration. | F-1, F-2, F-5 |
