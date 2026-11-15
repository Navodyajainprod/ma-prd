---
title: "Ambient Presence & Wake Flow"
product: "ai-receptionist"
module: "avatar"
channel: "ambient-presence"
route: "/reception"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | AVATAR: AMBIENT PRESENCE AND WAKE |
| Route | `/reception` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The standing lobby home of the kiosk. Aria waits with four quick-action tiles and a **Start** button, and wakes when someone stands close to the screen. |
| **Who uses it** | Patient (the walk-up visitor). Practice Admin or an installer uses the `?debug=1` strip. No sign-in and no role is checked. |
| **Where you start it** | Open `/reception`, `/reception/landing` or `/reception/avatar`. Standing close to the screen, tapping **Start** or tapping a tile wakes it. |
| **Where the result goes** | Into the flow the visitor chooses: appointment check-in, billing, feedback or directions. Nothing is stored. |
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
| Client (Reception settings) | Clinic name, colour, greeting phrase, flags | The home screen takes the clinic name and colour, a custom greeting phrase and the billing flag from Reception Settings. The Billing tile follows the payments flag. | [View Reception Settings](/client/settings/reception) |
| Client (Voices) | Greeting voice | Aria speaks the greeting in the active kiosk language. Whether the Voices settings choose her voice is not traced. | [View Voices](/client/settings/voices) |
| Client (Appointments) | Appointment tile | The tile opens check-in. The check-in looks up the visitor's appointment, but does not update the clinic's appointment record. | [View Appointments](/client/appointments/calendar) |
| Client (Invoices) | Billing tile | The tile opens the phone-verified invoice lookup. | [View Invoices](/client/invoices) |
| Companion | Check in on a phone | Not connected. No link from the home screen to the patient portal exists. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson walks into the lobby with her husband. The kiosk shows Aria at rest with four tiles around her. A few people walk past in the background and nothing happens. Sarah stops in front of the screen. After two close readings in a row, Aria wakes. She pauses for a moment and greets Sarah aloud, with captions under her. Sarah does not want to talk, so she taps **Appointment** while the greeting plays. The greeting stops and check-in opens. A small camera icon in the top corner says the camera is for greeting only. On a tablet with no camera permission the same screen works by touch alone.

### What is real and what is not

- **Real in the prototype:** the home screen and its aliases, the distance and dwell wake rule, the camera icon with its tooltip, the 5-phase welcome, the four tiles and **Start** button, the camera-free touch fallback, and the `?debug=1` strip.
- **Simulated:** the visitor wipe on return to home. It clears most details but not invoices, next-step data or face samples.
- **Not built:** the `/reception/idle` route (it shows Not Found) and a persistent text pill that reads "Camera active for greeting only".

### Journey position

```
Home (Aria at rest) ─▶ Wake (approach or Start) ─▶ Greeting ─▶ Tile or voice ─┬▶ Appointment ─▶ Billing ─▶ Directions
```

## 2. Feature Requests

### F-1: Home route and visitor reset

#### 1. What it does
The kiosk home is the first screen. `/reception`, `/reception/landing` and `/reception/avatar` all open it. Each time the kiosk returns home, the details of the last visitor should disappear. Most do. Some do not.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Canonical home | Route | `/reception` and `/reception/landing` open the home screen | ● Works | |
| F-1.2: `/reception/idle` | Route | The earlier PRD expects it to open home | ○ Not built | The route is not registered and the app shows Not Found (G11-E-30) |
| F-1.3: Visitor wipe on return | Rule | Clears the entered phone, code, matched patient, visit summary and form on return to home | ◐ Simulated | Invoices, the selected invoice, the QR image, next-step data and captured face samples are not cleared (G11-E-10) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The last patient taps **Home** on a bill screen | Returns to the lobby screen | **The name and phone are gone and the home stage shows. The invoice data stays in kiosk memory** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When the person before me steps away, I want all of their details gone from the screen, so that my own visit starts clean and theirs stays private. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a visitor returns home, **then** the entered phone, code, matched patient and visit summary are cleared. Invoice data is not cleared. |
| F-1-2 | **Given** a browser opens `/reception/idle`, **then** the Not Found page shows. |

### F-2: Close-proximity greeting and camera notice

#### 1. What it does
While the home screen waits, the browser's face detector, when the browser has one and the camera is allowed, measures only how big a face looks in the frame, about 5 times a second. People far away are ignored. When one face is close for two checks in a row, Aria wakes. Nothing is matched and no image is stored. A small camera icon with a tooltip tells the visitor the camera is for greeting only.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Distance and dwell filter | Rule | A face under 14% of frame height is ignored. At 30% or more for 2 checks in a row, the welcome starts. Checks run every 200 ms | ● Works | |
| F-2.2: No identification | Privacy rule | Only face size is read. No matching runs and no image is stored | ● Works | |
| F-2.3: Camera icon and tooltip | Badge | A small camera icon with a green dot appears while the camera is on. The tooltip reads "Camera active for greeting only" on hover or long press | ● Works | A weaker notice than the earlier PRD. Decision needed: D-35 |
| F-2.4: Persistent text pill | Badge | The earlier PRD asked for a constant green pill reading "Camera active for greeting only" | ○ Not built | Decision needed: D-35 |
| F-2.5: Touch-first fallback | State | With the camera denied or no face detector, the home screen works by tap and **Start** | ● Works | With no detector, wake is silently manual and no message says so |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Meera walks behind the chairs | Passes in the background | **The kiosk stays calm and silent** |
| 2 | Sarah stands in front of the screen | Stays close for two checks | **Aria wakes and greets her. Nobody is identified** |
| 3 | The tablet camera is blocked | Sarah taps **Start** | **The welcome and every flow work by touch** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I stand in front of the kiosk, I want Aria to greet me without greeting everyone who walks past, so that the lobby stays calm. |
| F-2-J2 | Patient | When the home camera is on, I want to be told it is only for greeting, so that I know it does not scan or identify me. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a face below the close threshold, **then** Aria stays at rest and plays no welcome. |
| F-2-2 | **Given** home mode is active, **then** no face matching runs and no image is stored. |
| F-2-3 | **Given** the camera is on, **then** a camera icon shows with the tooltip "Camera active for greeting only". No persistent text pill shows. |
| F-2-4 | **Given** the camera is denied or unsupported, **then** the tiles and **Start** still open every flow. |

### F-3: Five-phase welcome

#### 1. What it does
The welcome starts from a close approach or the **Start** button (**शुरू करें** in Hindi). Aria rests, pauses about 0.3 seconds, greets aloud in the active language (or the clinic's custom phrase), waits about 0.2 seconds so her speaker clears, then listens. After a request she shows a thinking message and moves to the flow.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Attentive lead-in | Cue | Dormant, then Engaged after a 0.3 second pause | ● Works | |
| F-3.2: Spoken greeting | Voice | Speaks in the active language. A custom clinic greeting phrase replaces the default | ● Works | The phrase comes from Reception Settings |
| F-3.3: Listening hand-off | Timing | A 0.2 second buffer, then the microphone opens with live captions | ● Works | |
| F-3.4: Routing | Phase | Shows a thinking message such as "One moment, directing your visit..." and opens the matching flow | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A quiet morning | Sarah taps **Start** | **Aria pauses, greets aloud with captions, then opens the microphone** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I wake the kiosk by walking up or tapping, I want Aria to finish speaking before she expects me to talk, so that my first words are heard. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** **Start** is tapped or the close rule fires, **then** the greeting plays before the microphone opens, with a short buffer after the speech. |

### F-4: Quick actions and the Start button

#### 1. What it does
Four tiles surround Aria: **Appointment**, **Billing**, **Feedback** and **Directions**, in English or Hindi. On a wide screen (1280 pixels or more) two sit on each side. On a narrow tablet they wrap into a grid at the bottom. A **Start** button sits at the bottom left. Tapping any tile stops the greeting and opens that flow. The **Billing** tile follows the clinic's payments setting.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Wide layout | Layout | Two tiles on each side of Aria on wide screens | ● Works | |
| F-4.2: Compact layout | Layout | Tiles wrap into a bottom grid on small screens | ● Works | |
| F-4.3: Tile bypass | Action | A tap stops the greeting and opens the flow | ● Works | Works even when muted |
| F-4.4: Billing tile flag | Rule | The tile is hidden when the clinic turns payments off | ● Works | Not in the earlier PRD |
| F-4.5: Feedback tile | Action | Opens `/reception/feedback` | ○ Not built | The route shows Not Found (G11-E-30) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The greeting is playing | Sarah taps **Directions** | **The greeting stops and the departments open** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient | When I do not want to speak in a crowded room, I want large one-tap shortcuts, so that I can finish without talking. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a tile is tapped, **then** the greeting audio stops and the matching screen opens. For **Feedback** that screen is the Not Found page. |
| F-4-2 | **Given** the clinic turned payments off, **then** the Billing tile does not show. |

### F-5: Installer diagnostic strip

#### 1. What it does
A technician opens `/reception?debug=1` and sees a thin strip with the wake phase, the screen and the camera state (Active, Denied or Off). Normal URLs show nothing.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: `?debug=1` strip | Installer tool | Shows `[DEBUG] Phase` and `Screen` and the camera state | ● Works | `?debug=true` works too |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | An installer tests the standee angle | Opens `/reception?debug=1` and steps close | **The strip moves from dormant to engaged, greeting and listening** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | When I set up the standee, I want a status strip, so that I can check the wake rule without browser tools. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** `?debug=1` is missing from the URL, **then** no diagnostic strip shows. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Home route and visitor reset | F-1.1 – F-1.3 | ● / ◐ / ○ | Home works; wipe is partial; the idle route is Not Found. |
| F-2 | Close-proximity greeting and camera notice | F-2.1 – F-2.5 | ● / ○ | Wake rule works; notice is an icon, not a pill. |
| F-3 | Five-phase welcome | F-3.1 – F-3.4 | ● Works | Greeting, buffer, listening, routing. |
| F-4 | Quick actions and Start | F-4.1 – F-4.5 | ● / ○ | Tiles work; Feedback opens Not Found. |
| F-5 | Installer diagnostic strip | F-5.1 | ● Works | `?debug=1` shows phase, screen and camera. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Start with the last visitor's details gone | F-1 |
| 2 | Patient | Be greeted only when I walk up | F-2 |
| 3 | Patient | Know the camera is for greeting only | F-2 |
| 4 | Patient | Be heard after the greeting finishes | F-3 |
| 5 | Patient | Use one-tap shortcuts without speaking | F-4 |
| 6 | Practice Admin | Check the wake rule at installation | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor with the kiosk URL | Wake the kiosk, tap any tile, use `?debug=1` | Nothing. No sign-in is needed |

The earlier PRD names no role. Decision needed: D-35 for the camera notice, D-41 for what a verified visit may do.

## 5. Metrics and definitions

No metric is shown. The wake rule reads face height as a share of frame height: 14% noticed, 30% close, 2 checks in a row.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Kiosk check-in → Appointment → Billing | Start of the journey | Home, wake and tile choice. No identity is read here. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-35 | Is a persistent camera notice pill required, and how is biometric consent handled? | F-2.3, F-2.4 |
| D-41 | What may a successful verification authorise, and for how long? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
