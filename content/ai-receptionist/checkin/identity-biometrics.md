---
title: "Identity Gate & Face Biometrics"
product: "ai-receptionist"
module: "checkin"
channel: "identity-biometrics"
route: "/reception/appointment"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | CHECK-IN: IDENTITY GATE AND FACE BIOMETRICS |
| Route | `/reception/appointment` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The one entry screen for check-in, My Visit and Next Step. A mirrored camera with an oval guide, coaching hints, a 3-2-1 countdown, a match step, a first-name privacy screen and a phone fallback. |
| **Who uses it** | Patient (the walk-up visitor). Front-desk Staff see the enrolment on the client profile. No sign-in and no role is checked. |
| **Where you start it** | The **Appointment** tile, the **Appointment** dock button, **Go to Check-in** from My Visit, speaking, or opening `/reception/appointment`. |
| **Where the result goes** | A confirmed match goes to the Visit Summary, to walk-in service selection, to Billing or to Next Step. A failed scan goes to the phone keypad. |
| **How real is it** | 2 features work, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Clients) | Face enrolment on the client profile | A face card on the client profile shows enrolment and lets staff delete the template. Quick Enroll there builds a template from a dummy vector with consent set to true, and the card shows a fixed enrolled date for some patients (G11-E-14). | [View Clients](/client/clients) |
| Client (Appointments) | Today's appointment after a match | After the visitor confirms, the kiosk looks for an appointment. The lookup is not limited to today and can invent a visit (G11-E-20, G11-E-21). | [View Appointments](/client/appointments/calendar) |
| Client (Audit logs) | Match, enrolment and check-in events | Written only to the kiosk browser's storage, not to the clinic audit trail (G11-E-13). | [View Audit Logs](/client/settings/audit-logs) |
| Companion | Visit continuity | No hand-off was found. Nothing from the kiosk scan reaches Companion Today. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson taps **Appointment**. A mirrored camera view opens with an oval guide and two buttons, **Start scanning** and **Use phone number instead**. She stands too far away and the hint tells her to step closer. The oval turns green when she is centred. She presses **Start scanning**. A 3, 2, 1 countdown runs and a sweep crosses the oval. The kiosk says "Hi Sarah, is this you?" with a match percentage and shows nothing else. She presses **Yes, that's me**. Aria then speaks her full name and her visit details aloud. In the prototype the scan sends one fixed test pattern, and the matcher returns the first enrolled patient when nothing matches, so any face would be greeted with a patient's name.

### What is real and what is not

- **Real in the prototype:** the entry screen, the mirrored camera, the framing hints, the countdown and cancel, the first-name privacy screen, the three-attempt phone fallback, and the camera stopping when the visitor leaves.
- **Simulated:** the face match itself (a fixed test vector and a fallback that returns the first enrolled patient at 94%), and the routing after **Yes, that's me**, which treats almost every summary as a scheduled visit.
- **Not built:** a warning when several faces match, and **Not me** leading to the phone keypad as the earlier PRD said.

### Journey position

```
Appointment tile ─▶ Camera ─▶ Countdown ─▶ Match ─▶ "Hi Sarah, is this you?" ─┬▶ Yes ─▶ Visit Summary or walk-in
                                                                              ├▶ Not me ─▶ Scan start
                                                                              └▶ 3 failures ─▶ Phone keypad
```

## 2. Feature Requests

### F-1: Unified entry and live camera mirror

#### 1. What it does
There is one place to identify yourself. It opens from the home tile, the dock, My Visit or a spoken request. The front camera shows a mirrored picture inside an oval guide with four corner brackets. A status badge reads **Ready**, **Starting**, **Scanning**, **Verified** or **Try again**. Below sit **Start scanning**, **Cancel scanning**, **Try again** and **Use phone number instead**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Single entry screen | Navigation | Opens from the tile, the dock, My Visit or voice. Clears the previous visitor's session | ● Works | |
| F-1.2: Mirrored camera window | Viewport | Shows the front camera, mirrored | ● Works | |
| F-1.3: Oval guide and brackets | Guide | A dashed oval and corner brackets frame the face | ● Works | |
| F-1.4: Status badge | Badge | Shows the camera state in English or Hindi | ● Works | |
| F-1.5: Action bar and phone escape | Buttons | **Start scanning** and **Use phone number instead** stay visible | ● Works | |
| F-1.6: Camera stops on exit | Rule | The camera stops when the visitor leaves the screen or the kiosk resets | ● Works | |
| F-1.7: Camera denied | State | The screen stays usable and the phone button stays active | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah taps **Appointment** | Looks at the screen | **The camera, the oval, Start scanning and Use phone number instead show** |
| 2 | The tablet camera is blocked | Sarah taps **Use phone number instead** | **The phone keypad opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I start check-in, I want one place to identify myself, so that I do not guess between scheduled and walk-in queues. |
| F-1-J2 | Front-desk Staff | When the kiosk camera fails, I want patients to see a phone option, so that the lobby queue does not stall. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a visitor opens check-in, **then** the camera preview, oval guide, **Start scanning** and **Use phone number instead** show. |
| F-1-2 | **Given** the visitor leaves the screen or the kiosk resets, **then** the camera stops. |
| F-1-3 | **Given** camera permission is denied, **then** **Use phone number instead** stays active. |

### F-2: Distance and centring coaching

#### 1. What it does
While Sarah stands in front of the camera, the kiosk checks how far she is and how centred she is. A hint above the frame says to step back, step closer or move to the centre. When she is well placed, the oval and brackets turn green.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Distance hints | Hint | Says when the visitor is too close or too far | ● Works | Without a browser face detector the hints are canned, timed lines |
| F-2.2: Centring hint | Hint | Says when the face is off centre | ● Works | |
| F-2.3: Green ready state | Visual | Oval and brackets turn green when placed well | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah stands two metres back | Waits | **The guide stays blue and asks her to move closer** |
| 2 | She steps into the centre | Aligns her face | **The oval turns green** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I position myself, I want clear cues, so that my scan works the first time. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a face is too far, too close or off centre, **then** the guide stays blue and a hint shows. |
| F-2-2 | **Given** the face is centred and in range, **then** the oval and brackets turn green. |

### F-3: Countdown, matching and three-attempt fallback

#### 1. What it does
**Start scanning** begins a 3, 2, 1 countdown that **Cancel scanning** can stop. A scan times out after 8 seconds. The kiosk tries to match at about 4.5 seconds. A match goes to the privacy screen. A miss shows **Try again** and keeps the phone button. After three failures it shows "Multiple attempts reached. Please use phone number check-in." and goes to the phone keypad.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: 3-2-1 countdown and cancel | Timer | Counts down before the scan. **Cancel scanning** stops it | ● Works | |
| F-3.2: Match against enrolled templates | Verification | Sends one fixed test vector. When nothing matches, the matcher returns the first enrolled patient at 94% | ◐ Simulated | No real face is compared (G11-E-01). Templates are stored as plain number lists in the browser (G11-E-12). Decision needed: D-37 |
| F-3.3: Three-failure fallback | Rule | After 3 failed scans, shows the message and opens the phone keypad | ● Works | Retry and lockout limits are undecided. Decision needed: D-46 |
| F-3.4: Several faces match | Rule | The matcher reports several matches but the kiosk never reads the flag | ○ Not built | Decision needed: D-40 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah is enrolled | Presses **Start scanning** and holds still | **The kiosk names her and asks her to confirm** |
| 2 | A visitor who is not enrolled scans | Presses **Start scanning** | **If anyone is enrolled, the kiosk still names the first enrolled patient (G11-E-01)** |
| 3 | A scan fails three times | Presses **Try again** twice more | **The multi-attempt message shows and the phone keypad opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I check in, I want a short countdown before the scan, so that motion blur does not cause a failure. |
| F-3-J2 | Patient | When my face is not recognised after a few tries, I want the kiosk to move to phone check-in, so that I am not stuck. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** **Start scanning** is pressed, **then** a 3-2-1 countdown runs and **Cancel scanning** stops it. |
| F-3-2 | **Given** three failed scans, **then** the multi-attempt message shows and the phone keypad opens. |
| F-3-3 | **Given** a scan, **then** the kiosk sends a fixed test vector and does not compare the visitor's real face. |

### F-4: First-name confirmation and routing

#### 1. What it does
A match does not put health details on a public screen. The privacy screen shows only the first name and a match percentage: "Hi Sarah, is this you?" with **Yes, that's me** and **Not me**. After **Yes, that's me**, Aria speaks the full name and the visit details aloud. The kiosk then routes by the flow the visitor started: Visit Summary, walk-in service selection, Billing or Next Step. **Not me** clears the candidate and returns to the scan start, where the phone button is still available.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: First-name gate | Card | Shows the first name and the match percentage with the two buttons. No surname, phone, doctor or bill shows | ● Works | |
| F-4.2: Spoken details after confirmation | Voice | Aria speaks the full name, bill count and visit details aloud | ● Works | Spoken in a public lobby. Not in the earlier PRD. Decision needed: D-39 |
| F-4.3: Route after **Yes, that's me** | Router | Goes to the Visit Summary, to walk-in service selection, to Billing or to Next Step | ◐ Simulated | Any summary with status "confirmed" is treated as a scheduled visit, so almost everyone goes to the appointment screen (G11-E-21). A face match can also open Billing. Decision needed: D-40 |
| F-4.4: **Not me** returns to scan start | Action | Clears the candidate and returns to the scan start. Phone entry stays available | ● Works | Decision needed: D-129 |
| F-4.5: **Not me** opens the phone keypad | Action | The earlier PRD sent the visitor to the phone keypad | ○ Not built | Built behaviour is F-4.4 |
| F-4.6: Voice commands | Voice | "Yes, that's me" and "Not me" work like the buttons | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The kiosk shows "Hi Sarah, is this you?" | Sarah presses **Yes, that's me** | **Her visit opens and Aria reads her details aloud** |
| 2 | The wrong person is named | The visitor presses **Not me** | **The candidate clears and the scan start shows. The phone button is still there** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When I confirm my identity in a public lobby, I want only my first name shown until I say it is me, so that bystanders cannot read my details. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a match, **when** the privacy screen shows, **then** only the first name and match percentage appear before **Yes, that's me**. |
| F-4-2 | **Given** **Not me** is pressed, **then** the candidate is cleared and the scan start shows. |
| F-4-3 | **Given** **Yes, that's me** is pressed, **then** Aria speaks the full name and visit details. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Unified entry and camera mirror | F-1.1 – F-1.7 | ● Works | One screen, mirrored camera, phone escape. |
| F-2 | Distance and centring coaching | F-2.1 – F-2.3 | ● Works | Hints and green oval. |
| F-3 | Countdown, matching and fallback | F-3.1 – F-3.4 | ● / ◐ / ○ | Countdown works; the match is not real. |
| F-4 | First-name confirmation and routing | F-4.1 – F-4.6 | ● / ◐ / ○ | First name only; routing is distorted by an invented visit. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Identify myself in one place | F-1 |
| 2 | Front-desk Staff | Keep a phone option when the camera fails | F-1 |
| 3 | Patient | Get my scan right the first time | F-2 |
| 4 | Patient | Have a short countdown before the scan | F-3 |
| 5 | Patient | Move to phone check-in after failed scans | F-3 |
| 6 | Patient | Keep my details off a public screen until I confirm | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor with the kiosk URL | Scan, confirm, and reach a visit, bills or next step after a (simulated) match | Nothing. No sign-in is needed |
| Front-desk Staff | View and delete a face template on the client profile | Nothing is checked by role |

The earlier PRD says personal data appears only after a verified, confirmed identity. With a simulated match that promise does not hold. Decision needed: D-40 and D-41.

## 5. Metrics and definitions

The privacy screen shows a match percentage. It comes from the mock matcher, and the fallback match is fixed at 94% (G11-E-01). **Hardcoded, formula undefined.**

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → Billing | Identify the visitor | Simulated face match, then first-name confirmation. |
| | Look up the appointment | After **Yes, that's me**; not limited to today and can show an invented visit (G11-E-20, G11-E-21). |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-37 | What protection at rest and retention apply to stored face templates? | F-3.2 |
| D-39 | What may appear on screen or be spoken in a public lobby after verification? | F-4.2 |
| D-40 | What safeguards apply to a face match: several matches, and may it open Billing? | F-3.4, F-4.3 |
| D-41 | What may a successful verification authorise, and for how long? | Section 4 |
| D-46 | What are the retry and lockout limits for face scans and OTP? | F-3.3 |
| D-129 | Where should **Not me** lead? | F-4.4, F-4.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
