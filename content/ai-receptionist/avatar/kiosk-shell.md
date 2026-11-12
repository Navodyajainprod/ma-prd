---
title: "Split Kiosk Shell, Dock, Timer & Staff Alert"
product: "ai-receptionist"
module: "avatar"
channel: "kiosk-shell"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Avatar & Voice Experience - Split Kiosk Shell & Safety Controls (`/reception/*`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Reception Settings Context | Clinic rooms and settings configured by clinic administrators link smoothly into Dock workflows across every active screen. | [View in Client](/client/settings/reception) |
| Client | Voice & Bilingual Synthesis | Switching `EN / हिन्दी` or `Mute` in the kiosk dock immediately controls spoken audio and captions throughout the lobby visit. | [View in Client](/client/settings/voices) |
| Client | Patient Identity Protection | The kiosk's automatic `60-second` inactivity timer wipes open patient summaries and clinic bills if someone leaves mid-session. | [View in Client](/client/clients) |
| Client | Appointments & Billing Access | Persistent dock shortcuts let visitors jump directly between Check-In, Directions, Billing, and Visit Tracking anytime. | [View in Client](/client/appointments/calendar) |
| Companion | Continuity After Escalation | Visitors who request front-desk help or step away from the kiosk can continue checking their queue status cleanly on Companion. | [View in Companion](/companion/today) |

## 1. Module Summary
- The **Split Kiosk Shell, Dock, Timer & Staff Alert** frames every interactive screen once a visitor leaves the standing home view, spanning all check-in, wayfinding, visit tracking, next-step guidance, billing, and feedback screens.
- Pairing a continuous **left-side Aria companion panel** (live subtitles + voice bars) with a bright, high-contrast **right-side task workspace**, the shell adds permanent **Right Navigation Dock** shortcuts, instant **EN / हिन्दी** language switching, audio **Mute**, a transparent **60-second automatic privacy wipe (`Start over`)**, and one-tap **Call Staff** desk escalation.

## 2. Feature Requests

### F-1: 50/50 Split Active Stage & Overlapping Live Caption Bar
#### 1. What it does
As soon as a visitor opens any active flow (`Face Check-in`, `Phone Number Check-in`, `Directions`, `Billing`, `My Visit`, or `Feedback`), the viewport splits into two balanced halves:
- **Left Half (Dark Aria Companion Stage):** Top bar displays **Aria • Clinic AI Avatar** and **Voice & Touch Enabled** badge; Aria remains centered without reloading across screens; and an overlapping frosted glass caption card below shows `8` animated voice waveform bars plus live labels (**"You are speaking..."**, **"You said"**, contextual thinking updates, **"Aria Speaking"**, or **"Listening..."** in English or Hindi).
- **Right Half (High-Contrast Task Workspace):** Bright translucent card displaying step forms, keypads, cards, and action buttons with comfortable right spacing for the floating dock.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Consistent Identity Header | Stage Banner | Displays **Aria • Clinic AI Avatar** and **Voice & Touch Enabled** across flows | Reassures first-time users both modes work |
| F-1.2: Continuous Left Companion Pane | Split Layout | Keeps Aria visible and speaking smoothly across multi-step screen transitions | Zero disorienting full-page jumps |
| F-1.3: Overlapping Live Caption Glass Card | Accessibility Readout | Shows real-time spoken dialogue, recognized visitor speech, and animated voice bars | Readable even when muted or in loud rooms |
| F-1.4: Bright Right Task Panel | Workspace Card | Renders large, accessible interactive forms and cards cleanly on light background | Maximizes legibility under lobby lighting |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor steps through Face Scan -> Phone -> OTP -> Visit Summary | Progresses across 4 consecutive screens | **Aria stays steady with synced captions on the left while task steps update smoothly on the right** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Hard-of-Hearing Visitor | When using the kiosk in a noisy waiting room, I want everything Aria says and hears displayed in large live captions on the left, so that I never miss an instruction. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given any active workflow outside the ambient home screen, then the left Aria companion panel with **Aria • Clinic AI Avatar**, **Voice & Touch Enabled**, and live caption readout MUST render alongside the right task panel. |

---

### F-2: Contextual Screen Titles & Adaptive Step Progress (`Step X of Y`)
#### 1. What it does
Top headers on the right-side panel keep visitors oriented at all times with clear action titles — **Face Check-in**, **Privacy Verification**, **Phone Number Check-in**, **Security Code Verification**, **Select Patient Profile**, **Visit Summary & Room Assignment**, **Billing & Touchless QR Payment** (or **Touchless QR Checkout • #INV**), **New Patient Details**, and **Register your face** — paired with dynamic step progress dots (`Step X of Y`). Underage walk-ins (`under 18`) automatically collapse from **5 steps to 4** so visitors never wonder why a step disappeared.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Plain-Language Screen Titles | Header Strip | Shows clear task-oriented titles for every check-in, onboarding, billing, and direction screen | Translates dynamically into Hindi & English |
| F-2.2: Adaptive Step Progress Dots | Indicator | Displays exact remaining steps (`4` for minor walk-ins vs `5` for adult walk-ins vs scheduled) | Prevents confusing skipped step dots |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Parent registers a 14-year-old vs an adult registering themselves | Completes New Patient Details | **Minor registration shows 4 steps total (skipping face enrollment); adult registration shows 5 steps** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Walk-In Visitor | When completing multi-step intake, I want to know clearly which step I am on and how many steps remain. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given an active onboarding workflow for a visitor under 18, then the step progress indicator MUST display 4 total steps instead of 5. |

---

### F-3: Floating Right Navigation Dock, Live `EN / हिन्दी` Switcher & Audio Mute
#### 1. What it does
Pinned cleanly to the right side of every active screen, the **Floating Right Dock** provides instant one-tap jumping and global preferences:
- **6 Direct Flow Buttons:** **Home**, **Appointment**, **Billing**, **Feedback**, **Directions**, and **My Visit** (highlighting the active module clearly).
- **Live `EN / हिन्दी` Toggle:** Switches screen copy, Aria's voice language, and speech recognition between English and Hindi immediately **without erasing partially entered phone digits or form answers**.
- **Audio `Mute / Unmute` Toggle:** Immediately stops any current spoken audio and silences voice output across steps while keeping visual waveforms and live text captions visible.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: 6-Flow Shortcut Rail | Dock Menu | Jumps directly between Home, Appointment, Billing, Feedback, Directions, and My Visit | Highlights active workflow automatically |
| F-3.2: Preserving Bilingual Toggle | Language Switch | Flips UI copy, spoken voice, and speech listener (`EN` <-> `हिन्दी`) mid-flow | Retains entered inputs safely |
| F-3.3: Instant `Mute / Unmute` Control | Sound Control | Cuts active TTS immediately and stays quiet until unmuted | Captions stay visible for silent reading |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor enters 6 digits of phone number, then prefers Hindi instructions | Taps **हिन्दी** toggle in the dock | **Headings, prompts, and Aria voice switch to Hindi immediately while keeping all 6 typed digits intact** |
| 2 | Patient checking Directions wants to view queue wait time | Taps **My Visit** in Right Dock | **Opens My Visit tracker directly without returning Home first** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Bilingual Community Visitor | When assisting an elderly parent halfway through check-in, I want to switch between English and Hindi without losing the details we already typed. |
| F-3-J2 | Clinic Staff Nearby | When taking a phone call next to the kiosk, I want to mute voice audio in one tap without disrupting visual patient check-in. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given a visitor toggles **EN / हिन्दी** midway through **Phone Number Check-in**, then UI text and speech locale MUST update immediately without clearing entered digits. |
| F-3-2 | Given **Mute** is activated while Aria is speaking, then voice audio MUST silence immediately while live captions remain visible. |

---

### F-4: Transparent **60-Second** Auto Privacy Reset & **Start over** Countdown
#### 1. What it does
Because lobby kiosks sit in public waiting rooms, leaving a completed token, phone number, or bill on screen poses a privacy risk if a patient walks away without tapping Done. Across every active screen outside Home, a visible **60-second inactivity countdown** ticks beside **Start over**:
- Any tap, keypress, scroll, or spoken response resets the countdown seamlessly back to **60s** so someone actively reading is never interrupted.
- Tapping **Start over** manually — or letting the countdown reach **0s** — immediately stops camera/microphone streams, clears all patient/appointment/billing details from screen, and returns cleanly to the standing home view.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: `60s` Inactivity Watchdog | Privacy Timer | Counts down from 60 seconds strictly on non-home active workflows | Disabled when resting on Home |
| F-4.2: Interaction Heartbeat | Timer Reset | Restores full 60s on pointer taps, typing, or speech activity | Prevents premature cutoffs during reading |
| F-4.3: Visible Countdown + **Start over** | Header Utility | Shows remaining seconds clearly alongside a one-tap reset button | Encourages polite manual session clearing |
| F-4.4: Complete Hardware & PHI Clear | Auto Reset | Closes camera feeds, silences voice, and wipes patient data at `0s` | Protects the next lobby visitor's privacy |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor reads their issued token and walks toward Room 101 without tapping Finish | Leaves kiosk untouched for 60 seconds | **Countdown reaches 0s, erases patient name/token, stops streams, and resets to Home** |
| 2 | Patient pauses 35s reading Next-Step prep text, then scrolls down | Touches screen at 25s left | **Timer jumps back to 60s seamlessly without closing their instructions** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Privacy Compliance Lead | When a patient walks away leaving personal schedules or bills open, I want the kiosk to wipe the screen automatically within 60 seconds. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given an active non-home screen receives zero taps, keystrokes, or voice input for 60 seconds, then the kiosk MUST wipe all visitor session data and return to Home. |
| F-4-2 | Given a visitor interacts when 15 seconds remain, then the timer MUST reset back to 60 seconds. |

---

### F-5: **Call Staff** Desk Assistance, Feedback Placeholder (`/reception/feedback`) & Status Toasts
#### 1. What it does
No self-service patient should ever feel stuck on a terminal:
- **Call Staff Modal:** Always one tap away, clicking **Call Staff** opens the reassuring **Staff Assistance Summoned** overlay (`"The front desk has been notified and someone is on the way."`) with a single **Got it, thanks** button — preserving whatever form or screen the patient had open underneath so front-desk staff can step over and assist right where they left off.
- **Patient Feedback (`/reception/feedback`):** Tapping **Feedback** on Home, Dock, or by voice opens the clean Feedback preview screen with navigation back home.
- **Non-Blocking Toast Alerts:** Short auto-dismissing (`3-second`) status banners confirm actions like `"Payment URI copied to clipboard"`, SMS pass delivery, or validation notices cleanly at the top without shifting layout.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: **Call Staff** Trigger & Overlay | Escalation Modal | Displays **"Staff Assistance Summoned"** (`"The front desk has been notified and someone is on the way."`) + **Got it, thanks** | Retains underlying entered form state |
| F-5.2: Feedback Route (`/reception/feedback`) | Feedback Screen | Renders planned patient experience module inside consistent split layout | Accessible via Home, Dock, and voice |
| F-5.3: Auto-Dismiss Status Banners | Toast Feedback | Announces link copies, sync refreshes, and alerts cleanly without jarring layout jumps | Accessible live region announcements |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor gets confused verifying OTP | Taps **Call Staff** in the utility bar | **Modal confirms front desk is on the way; tapping Got it, thanks returns them to OTP with entered phone preserved** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Overwhelmed Visitor | When I need human help at any point in check-in or billing, I want one clear **Call Staff** button that alerts reception without erasing my progress. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Given **Call Staff** is tapped on any active screen, then **Staff Assistance Summoned** (`"The front desk has been notified and someone is on the way."`) MUST display while preserving underlying form inputs upon dismissal. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | 50/50 Split Active Stage & Live Captions | F-1.1 to F-1.4 | Keeps Aria + animated waveforms + live dialogue captions alongside clean interactive panels. |
| F-2 | Screen Titles & Adaptive Step Counter | F-2.1 to F-2.2 | Orients visitors with clear titles and adaptive `4`-step minor vs `5`-step adult indicators. |
| F-3 | Floating Right Dock (`EN/हिन्दी` & `Mute`) | F-3.1 to F-3.3 | Enables instant 6-module switching, state-preserving language switch, and sound mute. |
| F-4 | `60s` Auto Privacy Reset & `Start over` | F-4.1 to F-4.4 | Wipes abandoned visitor sessions automatically after 60 seconds of inactivity. |
| F-5 | `Call Staff` Escalation, Feedback & Toasts | F-5.1 to F-5.3 | Summons human front-desk assistance non-destructively and displays accessible status banners. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Bilingual & Accessible Visitor | Navigate freely with live captions, instant EN/Hindi switching, audio mute, and clear step counters. | F-1, F-2, F-3 |
| 2 | Privacy Lead & Confused Visitor | Protect abandoned screens via automatic `60s` reset while keeping human staff 1 tap away. | F-4, F-5 |
