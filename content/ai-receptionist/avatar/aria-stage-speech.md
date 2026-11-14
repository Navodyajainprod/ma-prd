---
title: "Aria Lip-Sync Stage, Speech Capture & Intent Routing"
product: "ai-receptionist"
module: "avatar"
channel: "aria-stage-speech"
route: "/reception/*"
status: "In Review"
build_status: "Works"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | AVATAR: STAGE, SPEECH AND INTENT |
| Route | `/reception/*` |
| Status | In Review |
| Build status | Works |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | Aria's video stage and status halo, the microphone capture rules, the speech-to-text path with a browser fallback, the spoken-phrase router and the hands-free commands inside each screen. |
| **Who uses it** | Patient (the walk-up visitor). No sign-in and no role is checked. |
| **Where you start it** | Wake the kiosk, then speak. Voice works on the home screen and inside every task screen. |
| **Where the result goes** | A spoken phrase opens a screen: directions, check-in, billing, feedback, My Visit or Next Step. Nothing is stored. |
| **How real is it** | 3 features work, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Voices) | Clinic voice settings | The kiosk speaks in English or Hindi. Whether the Voices settings choose the voice Aria uses is not traced. | [View Voices](/client/settings/voices) |
| Client (Knowledge Base) | Clinic questions | Not connected. Answers come from a mock lookup inside the kiosk, not from the clinic's Knowledge Base. | [View Knowledge Base](/client/knowledge-base) |
| Admin (AI voices and models) | Speech models | Not connected as far as traced. The kiosk sends audio to its own speech service address and falls back to browser speech. | [View AI Voices and Models](/admin/ai-voices-models) |
| Companion | Private chat on a phone | Not connected. The kiosk voice router and the Companion chat share nothing. | [View Companion Chat](/companion/chat/chat) |

## 1. Module Summary

### The story in one minute

Sarah Johnson wakes the kiosk and watches Aria speak. Her mouth moves in time and settles closed when she stops. A halo around Aria turns blue while she speaks and a pill under her reads **Speaking**. When it is Sarah's turn the halo pulses and the pill reads **Listening**. The lobby air conditioning hums and Sarah asks, "Where is the pharmacy?" The kiosk keeps the first word, ignores a cough, and closes the phrase after a short silence. The phrase goes to a speech service, and if that is not available, to the browser's own recognition. The router finds the pharmacy room first and opens its walking card. When Sarah says "Yes, that's me" on a later screen, it works like the button.

### What is real and what is not

- **Real in the prototype:** the single video stage, the six-state halo and pill, the capture timing rules, the echo guard, the browser-speech fallback, the priority router with its one-time prompt, and the hands-free commands.
- **Simulated:** answers to clinic questions come from a mock lookup, not from the Knowledge Base.
- **Not built:** a notice or consent step before visitor audio is sent to a server speech service, and a message when the microphone is denied.

### Journey position

```
Wake ─▶ Aria speaks ─▶ Visitor speaks ─▶ Capture ─▶ Speech to text ─▶ Router ─▶ Screen opens ─▶ Voice commands inside the screen
```

## 2. Feature Requests

### F-1: Single stage, rest poses and reduced motion

#### 1. What it does
Aria is one continuous video. It does not flash black between idle and talking clips. When she stops talking her mouth settles closed within about 0.7 seconds. If the video cannot load, a still portrait shows. If the device asks for reduced motion, she stays paused and the captions keep running.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Single continuous stage | Video | One video element stays on screen across all screens | ● Works | The single-element rule is covered by a unit test |
| F-1.2: Closed-mouth settle | Motion | After speech, playback coasts to a closed-mouth rest frame | ● Works | |
| F-1.3: Portrait fallback | State | Shows a still portrait when the video cannot load | ● Works | |
| F-1.4: Reduced motion | Accessibility | Pauses the video on a neutral frame. Captions and the pill keep updating | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Aria finishes the greeting | Sarah waits | **Aria's mouth settles closed and she holds a calm pose** |
| 2 | The terminal has reduced motion on | Sarah taps **Appointment** | **Aria stays still while captions and the pill guide each step** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I watch Aria on a large lobby screen, I want smooth speech and calm pauses, so that the kiosk feels reassuring. |
| F-1-J2 | Patient | When motion bothers me, I want my device setting respected, so that I can still read every caption. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** Aria stops speaking, **then** the portrait settles on a closed-mouth frame without a black flash. |
| F-1-2 | **Given** the device has reduced motion on, **then** the video stays paused and captions stay readable. |
| F-1-3 | **Given** the video fails to load, **then** the still portrait shows. |

### F-2: Six-state halo and status pill

#### 1. What it does
A soft halo around Aria and a dark pill under her show what she is doing, even when the kiosk is muted. The pill ends with "Aria • Virtual AI Receptionist". The six states are idle, speaking, listening, thinking, success and apologetic.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Six colour states | Halo | A halo colour for idle, speaking, listening, thinking, success and apologetic | ● Works | |
| F-2.2: Status pill | Badge | Reads **Ready**, **Speaking**, **Listening**, a thinking message, **Verified** or **Assistance** | ● Works | The thinking message is context text such as "Verifying security code..." |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah enters the fourth digit of her code | Taps the last digit | **The halo turns to thinking blue and the pill shows a verifying message** |
| 2 | Her token is issued | Confirms check-in | **The halo turns green and the pill reads Verified** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When the kiosk is muted or I cannot hear well, I want clear visual states, so that I know when Aria is speaking, thinking or listening. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** each of the six states, **then** the halo colour and the pill label for that state show. |

### F-3: Noise-filtered speech capture and browser backup

#### 1. What it does
Sarah speaks and the kiosk captures her phrase. It keeps about 0.6 seconds before her voice crosses the threshold so the first word is not cut. It ignores sounds under 0.4 seconds, such as a cough. It ends the phrase after 0.8 seconds of silence or after 8 seconds. After Aria speaks, it waits about 0.45 seconds so she does not hear herself. The audio goes to a server speech service with an 8-second timeout. If that fails or is not set up, the browser's own English or Hindi recognition takes over.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: 0.6 s pre-roll | Buffer | Keeps audio from just before the voice starts | ● Works | |
| F-3.2: Burst and silence rules | Rule | Ignores bursts under 0.4 s. Ends on 0.8 s of silence or at 8 s | ● Works | |
| F-3.3: Echo guard | Rule | Waits about 0.45 s after Aria speaks | ● Works | |
| F-3.4: Server speech with browser fallback | Service | Sends audio to the speech service, times out at 8 s and then uses browser recognition | ● Works | Offline or unset service falls back to browser speech |
| F-3.5: Notice before audio leaves the kiosk | Notice | Visitor audio is sent to a server service with no notice, consent or retention wording | ○ Not built | Decision needed: D-34 |
| F-3.6: Microphone denied message | State | No dedicated message shows. The kiosk falls back quietly | ○ Not built | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The air conditioning hums | Sarah asks, "Where is the pharmacy?" | **The first word is kept and capture ends after 0.8 seconds of silence** |
| 2 | A visitor coughs | Makes a 0.2 second sound | **It is ignored and no apology prompt follows** |
| 3 | No speech service is set up | Sarah speaks a command | **Browser speech recognition handles it** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I talk in a noisy lobby, I want my first words kept and coughs ignored, so that I am not misheard. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a sound under 0.4 seconds, **then** it is discarded without a transcription request. |
| F-3-2 | **Given** the speech service is unset or takes more than 8 seconds, **then** the kiosk uses browser speech recognition. |
| F-3-3 | **Given** a visitor speaks, **then** the audio is sent to the speech service and no notice, consent step or retention rule is shown. |

### F-4: Priority intent routing

#### 1. What it does
Every phrase is checked from the most specific to the most general. A named room, a doctor or a common English or Hindi word such as washroom, dawai or paani goes straight to that room's directions. Next come department names, then "View Details", "What's next" and "My status", then Feedback, Appointment, Billing and Directions. On the first unclear phrase Aria asks the visitor to tap an option or say Appointment, Billing, Directions or My Visit. She does not repeat the apology on later chatter.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Room and doctor first | Rule | Room names, doctor names and English or Hindi synonyms open the room's directions | ● Works | Tests cover pharmacy, lab, restroom, doctor and gibberish |
| F-4.2: Department and status | Rule | Department names, "View Details", "What's next" and "My status" route to the matching screen | ● Works | |
| F-4.3: Core workflows | Rule | Feedback, Appointment, Billing and Directions words open their flows | ● Works | "Where is the billing counter?" matches a room, not payment |
| F-4.4: One-time clarification | Rule | Speaks one prompt on the first unclear phrase and stays quiet after | ● Works | |
| F-4.5: Clinic question answers | Lookup | Questions are answered from a lookup inside the kiosk | ◐ Simulated | Mock lookup. Not wired to the Knowledge Base |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A Hindi speaker asks about medicine | Says "Dawai kahan milegi?" | **The pharmacy walking directions open and are read out** |
| 2 | Background chatter is garbled three times | Nobody addresses the kiosk | **Aria prompts once and then stays quiet** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When I ask for a specific room or doctor, I want its directions straight away, so that I skip the menus. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a visitor says "Where is the pharmacy?", **then** the pharmacy directions open, not the department list. |
| F-4-2 | **Given** two unclear phrases in a row, **then** Aria speaks the clarification once. |
| F-4-3 | **Given** a visitor asks a clinic question, **then** the answer comes from the mock lookup, not the Knowledge Base. |

### F-5: Hands-free commands inside screens

#### 1. What it does
Sarah holds her child's hand and cannot tap. On the face screen she says "Start scan". On the privacy screen she says "Yes, that's me". On the keypad she says her digits and then "Send". She says "Back", "Home" or "Start over" from any step.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Identity commands | Voice | "Start scan", "Use phone", "Yes, that's me", "Not me" | ● Works | |
| F-5.2: Spoken digits | Voice | Adds spoken digits to the phone and code fields, with "Clear", "Send", "Verify" and "Continue" | ● Works | |
| F-5.3: Intake commands | Voice | Dictates name and reason, and answers "Approve", "Edit" and "Skip" | ● Works | |
| F-5.4: Global navigation | Voice | "Back", "Home" and "Start over" | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah holds her child on the privacy screen | Says "Yes, that's me" | **Identity is confirmed and the Visit Summary opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Patient | When my hands are full, I want to confirm, speak my number and go back by voice, so that I can finish check-in. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** the privacy screen, **when** the visitor says "Yes, that's me", **then** it acts like the confirm button. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Single stage, rest poses and reduced motion | F-1.1 – F-1.4 | ● Works | One video, settle, portrait fallback, reduced motion. |
| F-2 | Six-state halo and status pill | F-2.1 – F-2.2 | ● Works | Colour and label for each state. |
| F-3 | Noise-filtered speech capture | F-3.1 – F-3.6 | ● / ○ | Capture rules work; no notice for audio sent out. |
| F-4 | Priority intent routing | F-4.1 – F-4.5 | ● / ◐ | Router works; clinic answers are a mock. |
| F-5 | Hands-free commands | F-5.1 – F-5.4 | ● Works | Voice twins of the main buttons. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Watch smooth, calm speech | F-1 |
| 2 | Patient | Have motion settings respected | F-1 |
| 3 | Patient | See clear visual states | F-2 |
| 4 | Patient | Be understood in a noisy lobby | F-3 |
| 5 | Patient | Reach a room or doctor by voice | F-4 |
| 6 | Patient | Finish check-in hands-free | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor with the kiosk URL | Speak to the kiosk and use every voice command | Nothing. No sign-in is needed |

The earlier PRD names no role and no privacy notice. Decision needed: D-34 for notice and consent on voice, D-41 for what a verified visit may do.

## 5. Metrics and definitions

No metric is shown. The capture rules use fixed values: 0.6 s pre-roll, 0.4 s burst filter, 0.8 s silence, 8 s maximum, 0.45 s echo guard, 8 s service timeout.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → Billing | Every spoken step | Voice and touch run in parallel. Voice commands mirror the on-screen buttons. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-34 | What notice, consent and retention apply when visitor voice is sent to a server? | F-3.5 |
| D-41 | What may a successful verification authorise, and for how long? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
