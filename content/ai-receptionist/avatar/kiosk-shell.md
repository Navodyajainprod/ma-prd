---
title: "Split Kiosk Shell, Dock, Timer & Staff Alert"
product: "ai-receptionist"
module: "avatar"
channel: "kiosk-shell"
route: "/reception"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | AVATAR: KIOSK SHELL |
| Route | `/reception` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The frame around every kiosk task screen: Aria on the left with live captions, the task card on the right, a floating dock, an English and Hindi switch, a Mute button, a 60-second inactivity reset with a **Start over** button, and a **Call Staff** overlay. |
| **Who uses it** | Patient (the walk-up visitor). No sign-in and no role: anyone who opens the kiosk URL uses it. Practice Admin sets the clinic name, colour and feature flags elsewhere, in Reception Settings. |
| **Where you start it** | Leave the home screen by tapping a tile, a dock button, speaking, or opening a kiosk URL such as `/reception/appointment`. |
| **Where the result goes** | Nowhere. The shell holds screen state only. The audit entries it writes for directions views stay in the kiosk browser. |
| **How real is it** | 2 features work, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Reception settings) | Clinic name, colour, greeting, terminal label, feature flags | The shell reads these settings from the reception settings store. The clinic can hide Billing by turning the payments feature off. The URL values `org`, `terminal`, `terminalName` and `location` also set the clinic and terminal. Unverified: which organisation a kiosk takes when no `org` is given (G9). | [View Reception Settings](/client/settings/reception) |
| Client (Voices) | English and Hindi switch, Mute | The dock switch changes the kiosk's screen copy, spoken language and speech listener. Whether the Voices settings change Aria's voice is not traced. | [View Voices](/client/settings/voices) |
| Client (Clients) | Wipe of visitor details | The 60-second reset clears the phone, code, matched patient and visit summary. It does not clear invoices, QR data, next-step data or captured face samples (G11-E-10). | [View Clients](/client/clients) |
| Client (Appointments, Invoices) | Dock shortcuts | The dock jumps to the appointment check-in, billing, directions and My Visit screens. | [View Appointments](/client/appointments/calendar) |
| Client (Audit logs) | Directions audit entries | Directions views are logged, but only in the kiosk browser, not in the clinic audit trail (G11-E-13). | [View Audit Logs](/client/settings/audit-logs) |
| Companion | Hand-off after Call Staff | Not connected. Call Staff sends nothing anywhere, so nothing continues on Companion (G11-E-31). | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson walks up to the lobby kiosk and taps **Appointment**. The home screen gives way to a split layout. Aria stays on the left and her captions run under her. The check-in card sits on the right with the title **Face Check-in** and a **Step 1 of 3** marker. A dock on the right edge lets her jump to **Billing** or **Directions** at any time. Halfway through typing her number she taps **हिन्दी**. The words change and her digits stay. She gets confused and taps **Call Staff**. An overlay says the front desk has been notified. Nothing actually reaches Meera Iyer. A countdown beside **Start over** shows how long she has left. When she walks away, it reaches zero and the kiosk returns to the home screen.

### What is real and what is not

- **Real in the prototype:** the split stage with captions, screen titles and step counts, the dock, the language switch, Mute, the 60-second watchdog with a visible countdown, the Call Staff overlay, and the 3-second toasts.
- **Simulated:** the reset clears most visitor data but not all of it. The Call Staff overlay says the front desk is notified and sends nothing. Directions audit entries stay in the kiosk browser.
- **Not built:** a Feedback screen (the route shows Not Found), timer restart on scroll or speech, and a timer pause during payment or face capture.

### Journey position

```
Home ─▶ [ Shell: Aria + task card + dock + 60 s timer ] ─▶ any check-in, billing, directions or My Visit screen ─▶ Start over ─▶ Home
```

## 2. Feature Requests

### F-1: Split stage with live captions

#### 1. What it does
Sarah leaves the home screen and the page splits in two. The left half is the dark Aria stage with the badge **Aria • Clinic AI Avatar** and the badge **Voice & Touch Enabled**. A caption card sits under Aria with animated voice bars and a live label such as **You are speaking...**, **You said**, **Aria Speaking** or **Listening...**. The right half is a bright task card. The clinic's name, brand colour and greeting come from Reception Settings.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Identity header | Banner | Shows the Aria name badge and the **Voice & Touch Enabled** badge on every task screen | ● Works | |
| F-1.2: Continuous Aria pane | Layout | Keeps Aria on the left while the right card changes from step to step | ● Works | |
| F-1.3: Live caption card | Display | Shows what Aria says and what she heard, with a waveform. Readable when muted | ● Works | |
| F-1.4: Task panel | Layout | Large cards, forms and buttons on a light background with room for the dock | ● Works | |
| F-1.5: Clinic branding and flags | Setting | Clinic name, brand colour, greeting phrase, terminal label, voice and payments flags come from Reception Settings or the URL | ● Works | Not in the earlier PRD (G11-I-09). Unverified: which organisation is used when none is given (G9) |

#### 3. Worked example
Sarah steps through face scan, phone, code and visit summary.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Four screens in a row | Moves from step to step | **Aria and her captions stay on the left while the task card changes on the right** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I use the kiosk in a noisy waiting room, I want everything Aria says and hears shown as large captions, so that I never miss an instruction. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** any task screen outside the home view, **when** it opens, **then** the Aria pane with both badges and the caption card shows beside the task card. |

### F-2: Screen titles and Step X of Y

#### 1. What it does
Each screen has a plain title and a step marker so Sarah knows where she is. A scheduled visit has 3 steps and billing has 2. A walk-in has 5 steps for an adult and 4 for a child under 18, because the face step is skipped.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Screen titles | Header | Task titles such as **Face Check-in**, **Phone Number Check-in**, **Security Code Verification**, **Visit Summary & Room Assignment**, **New Patient Details** and **Register your face**, in English and Hindi | ● Works | |
| F-2.2: Step X of Y dots | Indicator | Shows the step count for the flow | ● Works | Scheduled 3, billing 2, walk-in 4 or 5 |
| F-2.3: Minor rule | Rule | Under 18 collapses 5 steps to 4 | ● Works | The age is typed by the visitor. Decision needed: D-36 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A parent registers a 14-year-old | Types age 14 on **New Patient Details** | **The marker shows 4 steps and the face screen is skipped** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | During multi-step intake, I want to see which step I am on and how many remain, so that I do not wonder why a step disappeared. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a walk-in with an age under 18, **when** details are submitted, **then** the step marker shows 4 steps. |
| F-2-2 | **Given** a walk-in aged 18 or more, **then** the marker shows 5 steps. |

### F-3: Dock, language switch and Mute

#### 1. What it does
A dock on the right edge has six buttons: **Home**, **Appointment**, **Billing**, **Feedback**, **Directions** and **My Visit**. Beside it are an **EN / हिन्दी** switch and a **Mute** button. Sarah changes language in the middle of typing her number and the digits stay. She taps Mute and Aria goes quiet while the captions stay on screen.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Six-button dock | Menu | Jumps straight between the six flows and highlights the active one | ● Works | **Billing** is hidden when the clinic turns payments off |
| F-3.2: English and Hindi switch | Toggle | Changes screen copy, Aria's voice language and the speech listener, and keeps typed digits and answers | ● Works | |
| F-3.3: Mute | Toggle | Stops speech at once. Captions and the waveform stay | ● Works | |
| F-3.4: Hindi directions text | Content | Room directions are spoken with the same text in Hindi mode | ◐ Simulated | Room text is not translated (G11-E-37) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah typed 6 digits of her number | Taps **हिन्दी** | **Prompts and Aria's voice switch to Hindi and the 6 digits stay** |
| 2 | Meera takes a call beside the kiosk | Taps **Mute** | **Speech stops. Captions stay on screen** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I help a parent halfway through check-in, I want to switch language without losing what we typed, so that we do not start again. |
| F-3-J2 | Front-desk Staff | When I take a call next to the kiosk, I want to mute Aria in one tap, so that I can talk without stopping a patient's check-in. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** digits are typed on **Phone Number Check-in**, **when** the language is switched, **then** the copy and speech language change and the digits stay. |
| F-3-2 | **Given** Aria is speaking, **when** Mute is pressed, **then** speech stops and captions stay. |
| F-3-3 | **Given** the clinic turned payments off, **then** the dock and the home screen do not offer Billing. |

### F-4: 60-second privacy reset and Start over

#### 1. What it does
A lobby kiosk is public, so an abandoned screen is a privacy risk. On every screen except home, a countdown from 60 seconds runs beside **Start over**. A tap, key press or mouse move puts it back to 60 (checked once a second). At zero, or when someone taps **Start over**, the kiosk stops the timers, camera and speech, clears the entered phone, code, matched patient, visit summary, token, face state, form and directions choice, and returns to the home screen.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: 60-second watchdog | Timer | Counts down on every screen except home | ● Works | |
| F-4.2: Restart on touch, key, mouse | Rule | Any of these restores 60 seconds, at most once a second | ● Works | |
| F-4.3: Countdown and Start over | Button | Shows the seconds left beside a one-tap reset | ● Works | |
| F-4.4: Stop hardware and speech | Rule | Stops the camera, speech and timers at reset | ● Works | |
| F-4.5: Clear visitor data | Rule | Clears phone, code, token, matched patient, summary, face state, form and directions choice | ◐ Simulated | Invoices, the selected invoice, the QR image, the paid flag, next-step data and captured face samples are not cleared (G11-E-10) |
| F-4.6: Restart on scroll or speech | Rule | Only touch, key and mouse restart the timer | ○ Not built | The earlier PRD also listed scroll and spoken input |
| F-4.7: Pause during payment or face capture | Rule | The timer keeps running during both | ○ Not built | Decision needed: D-129 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah reads her token and walks off | Leaves the kiosk alone for 60 seconds | **The countdown reaches 0, the name and token clear, and the home screen returns** |
| 2 | Sarah pauses while reading | Touches the screen with 25 seconds left | **The countdown returns to 60** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When I walk away and leave my details on screen, I want the kiosk to clear them within a minute, so that the next person cannot read them. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** any screen except home receives no touch, key or mouse input for 60 seconds, **when** the countdown ends, **then** the kiosk stops camera and speech, clears the entered and matched patient data and shows the home screen. |
| F-4-2 | **Given** the countdown is running, **when** the visitor touches the screen, **then** it returns to 60 seconds. Scrolling or speaking does not restart it. |
| F-4-3 | **Given** a bill was open at reset, **then** the invoice data is not cleared from kiosk memory. |

### F-5: Call Staff, Feedback and toasts

#### 1. What it does
Sarah taps **Call Staff**. An overlay titled **Staff Assistance Summoned** opens with the text "The front desk has been notified and someone is on the way." and a **Got it, thanks** button. Her screen stays underneath. No alert goes anywhere. The **Feedback** tile and dock button open the app's Not Found page. Short messages appear as toasts for 3 seconds.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Call Staff overlay | Modal | Opens the overlay and keeps the screen and entered values under it | ● Works | |
| F-5.2: Staff alert | Notification | Tells the front desk which kiosk needs help | ○ Not built | The overlay says the desk is notified. No alert, task or queue entry is sent (G11-E-31). Decision needed: D-128 |
| F-5.3: Feedback screen | Screen | The tile and dock button go to `/reception/feedback` | ○ Not built | The route is not registered and shows Not Found (G11-E-30) |
| F-5.4: Toasts | Banner | Short banners that close after 3 seconds | ● Works | Billing also uses a second toast library |
| F-5.5: Directions audit entries | Log | Directions views are written to a kiosk audit log | ◐ Simulated | Kept in the kiosk browser only (G11-E-13). Decision needed: D-42 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah is stuck on the code screen | Taps **Call Staff**, then **Got it, thanks** | **The overlay opens and closes, and her phone digits are still there. Meera is not alerted** |
| 2 | Sarah wants to leave feedback | Taps **Feedback** | **A Not Found page opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Patient | When I need a person at any step, I want one clear button that calls the front desk without losing my progress, so that I am never stuck at the kiosk. |
| F-5-J2 | Front-desk Staff | When a patient asks the kiosk for help, I want to see an alert with the kiosk name, so that I can walk over. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** a visitor taps **Call Staff**, **then** the **Staff Assistance Summoned** overlay shows and the screen under it keeps its entered values. No alert is sent to staff. |
| F-5-2 | **Given** a visitor taps **Feedback**, **then** the app's Not Found page opens. |
| F-5-3 | **Given** a toast shows, **then** it closes after 3 seconds. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Split stage with live captions | F-1.1 – F-1.5 | ● Works | Aria, captions and task card as described. |
| F-2 | Screen titles and Step X of Y | F-2.1 – F-2.3 | ● Works | Titles and step counts, 4 steps for minors. |
| F-3 | Dock, language switch and Mute | F-3.1 – F-3.4 | ● / ◐ | Works; Hindi room text is not translated. |
| F-4 | 60-second privacy reset | F-4.1 – F-4.7 | ● / ◐ / ○ | Resets, but not every data item is cleared. |
| F-5 | Call Staff, Feedback and toasts | F-5.1 – F-5.5 | ● / ○ | Overlay works; no alert is sent and Feedback is a Not Found page. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Read captions in a noisy room | F-1 |
| 2 | Patient | See which step I am on | F-2 |
| 3 | Patient | Switch language without losing input | F-3 |
| 4 | Front-desk Staff | Mute Aria in one tap | F-3 |
| 5 | Patient | Have my details cleared when I walk away | F-4 |
| 6 | Patient | Call the front desk without losing progress | F-5 |
| 7 | Front-desk Staff | See an alert when a patient asks for help | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor with the kiosk URL | Use every kiosk screen. No sign-in is needed | Nothing |
| Practice Admin | Sets clinic name, colour and flags in Reception Settings | Not applicable to the kiosk screen |

The earlier PRD names only the visitor. Decision needed: D-41.

## 5. Metrics and definitions

The only number the shell shows is the countdown, computed as 60 seconds minus the time since the last touch, key or mouse activity.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → Billing | Every step | The shell frames each screen. Its reset does not clear invoice data (G11-E-10). |
| | Call Staff | Overlay only. No alert reaches the front desk. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-36 | Is the visitor-typed age enough to exclude minors from biometrics? | F-2.3 |
| D-41 | What may a successful verification authorise, and for how long? | Section 4 |
| D-42 | Which events must be audited, and where is the log kept? | F-5.5 |
| D-128 | How is the front desk alerted by Call Staff, and which kiosk? | F-5.2 |
| D-129 | Should the 60-second timer pause during payment or face capture? | F-4.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
