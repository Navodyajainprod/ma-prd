---
title: "Voice Deep-Linking & Turn-by-Turn Room Guide"
product: "ai-receptionist"
module: "directions"
channel: "rooms"
route: "/reception/directions/:categoryId/:roomId"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | DIRECTIONS: ROOM GUIDE AND VOICE DEEP-LINKING (`/reception/directions/:categoryId/:roomId`) |
| Route | `/reception/directions/:categoryId/:roomId` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A room card with the room name, floor or wing and plain walking text, read aloud by Aria. A visitor reaches it by tapping a room or by asking for a place, a doctor or a room by voice. |
| **Who uses it** | Patient (any visitor at the lobby kiosk). No sign-in and no identity check. |
| **Where you start it** | A room in the room list, or a spoken request on any kiosk screen such as "Where is the washroom?". The address `/reception/directions/:categoryId/:roomId` also opens it. |
| **Where the result goes** | Nowhere. It only shows and speaks directions. |
| **How real is it** | 0 features work, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Reception Settings) | Room directions text | The walking text is the Direction field an admin writes on a room. With none, the card says "Room N is located at <location>. Please follow hallway signs." | [View Reception Settings](/client/settings/reception) |
| Client (Services) | Doctor and service matching | Voice matching reads room titles, numbers and the assigned doctor on the room. It does not read the Services page. | [View Services](/client/services) |
| Companion | Room continuity | Not connected. Companion has no directions screen that reads the same room data. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson is late and needs the washroom. She does not touch the screen. She says, "Where is the washroom?" Aria hears her, skips the department grid and opens the room card at once. A **Direct Match** pill sits on the card. The card shows the room name, the floor or wing and the walking text. Aria reads the text aloud. Sarah can also ask in Hindi, for example "Dawai kahan milegi?". The text itself is read as written, so a Hindi visitor hears the same words. Sarah taps **Done & Return Home** when she has what she needs. The card has no clinician row, no walking time and no **Start Check-in** button.

### What is real and what is not

- **Real in the prototype:** voice match by room name, doctor or English and Hindi words, the Direct Match pill, the room card with floor or wing and walking text, the spoken readout, the context-aware Back control and the Done button.
- **Simulated:** the Hindi readout speaks the same untranslated text (G11-E-37).
- **Not built:** the assigned clinician row, the walking time estimate and a Start Check-in button on the card.

### Journey position

```
Voice or room list ─▶ Room card (Direct Match) ─▶ Spoken readout ─▶ Back / Done & Return Home
```

## 2. Feature Requests

### F-1: Find a room by voice

#### 1. What it does
Sarah asks Aria for a room name, a room number, a doctor or an everyday word in English or Hindi. The kiosk checks specific places and doctors first. It then opens the matching room card directly. A **Direct Match** pill tells her it was a voice hit.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Room, number and doctor match | Voice | Matches spoken text to room titles, numbers and assigned doctors, ahead of the general menus | ● Works | G11-I-91 |
| F-1.2: English and Hindi words | Voice | Understands everyday words such as washroom, pharmacy and dawai | ● Works | Covered by an automated test in the prototype |
| F-1.3: Direct Match pill | Badge | Shown on the card when the visitor arrived by voice | ● Works | |
| F-1.4: Skip category menus | Rule | A voice hit opens the room card without the grid or the list | ● Works | |
| F-1.5: No match | State | An unclear phrase gets one polite prompt | ● Works | The speech stage belongs to the Aria speech page |
| F-1.6: Room edits | Rule | Voice matching reads the rooms loaded when the screen opened | ◐ Simulated | A room added by an admin is not matched on a running kiosk until reload (G11-E-36) |

#### 3. Worked example
Sarah needs the pharmacy.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Home screen is showing | Says "Where is the washroom please?" | **The room card opens with a Direct Match pill and Aria reads the walking text** |
| 2 | She asks in Hindi | Says "Dawai kahan milegi?" | **The pharmacy room card opens directly** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When I ask aloud for a restroom, a doctor or the pharmacy, I want directions at once, so that I do not tap through menus. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a spoken request names an active room, a doctor or a known English or Hindi word, **then** the room card opens directly with a Direct Match pill. |
| F-1-2 | **Given** a room was added after the kiosk screen opened, **then** voice matching does not find it until the screen reloads. |

### F-2: Room card and spoken directions

#### 1. What it does
The room card shows the room name, the floor or wing and large walking text. Aria reads the text as soon as it opens, unless the kiosk is muted. The room number is part of the floor or wing text. The address follows the visitor so the card can be bookmarked or refreshed.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Landmark card | Card | Shows the room name, floor or wing and walking text | ● Works | G11-I-92. The text is the room's Direction field, or a generic fallback sentence (G11-I-97) |
| F-2.2: Spoken readout | Audio | Reads the walking text aloud when the card opens | ◐ Simulated | In Hindi mode the same untranslated text is spoken (G11-E-37) |
| F-2.3: Deep-link address | Route | `/reception/directions/:categoryId/:roomId` | ● Works | An unknown room falls back to the room list |
| F-2.4: Assigned clinician row | Field | Described in the earlier PRD | ○ Not built | Decision needed: D-125 |
| F-2.5: Walking time (about 1 to 2 minutes) | Field | Described in the earlier PRD | ○ Not built | Decision needed: D-125 |
| F-2.6: Hindi walking text | Content | Described in the earlier PRD as spoken in Hindi | ○ Not built | Rooms have one text field |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah taps **Pharmacy Counter A** in the list | Reads the card | **The room name, floor or wing and walking text show, and Aria reads them. No clinician and no walk time are shown** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I get directions to a room, I want large text and clear spoken landmarks, so that I do not miss a turn. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the room card opens, **then** the room name, floor or wing and walking text show together and the text is spoken unless muted. |
| F-2-2 | **Given** Hindi is selected, **then** the spoken walking text is the same text as in English. |
| F-2-3 | **Given** a room has no Direction text, **then** the card says "Room N is located at <location>. Please follow hallway signs." |

### F-3: Back, Done and the next step

#### 1. What it does
**Back** takes Sarah to the room list if she browsed, or to Home if she arrived by voice. **Done & Return Home** clears the session. The card has no button to start check-in. She uses the dock for that.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Context-aware Back | Button | Returns to the room list after browsing, or to Home after a voice jump | ● Works | G11-I-95 |
| F-3.2: Done & Return Home | Button | Clears the session and shows the home screen | ● Works | |
| F-3.3: Start Check-in button | Button | Described in the earlier PRD | ○ Not built | Only Back and Done exist. The dock still opens Check-In. Decision needed: D-125 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah browsed Diagnostics and opened a lab | Taps Back | **The Diagnostics room list opens** |
| 2 | She arrived by voice | Taps Back | **Home opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | After reading directions, I want to go back to the list or Home in one tap, so that I can check another place. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the card was opened from the room list, **when** Back is tapped, **then** the list opens. |
| F-3-2 | **Given** the card was opened by voice, **when** Back is tapped, **then** Home opens. |
| F-3-3 | **Given** the room card, **then** there is no Start Check-in button. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Find a room by voice | F-1.1 – F-1.6 | ● / ◐ | Voice match works; new rooms need a reload. |
| F-2 | Room card and spoken directions | F-2.1 – F-2.6 | ● / ◐ / ○ | Card and readout work; clinician and walk time absent; Hindi is not translated. |
| F-3 | Back, Done and next step | F-3.1 – F-3.3 | ● / ○ | Back and Done work; no Start Check-in. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Get directions at once by asking aloud | F-1 |
| 2 | Patient | Read and hear clear landmarks | F-2 |
| 3 | Patient | Go back or Home in one tap | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor at the kiosk | Ask for or open any room card | Nothing. The kiosk routes sit outside sign-in |
| Front-desk Staff (Meera) | Write room directions in Reception Settings | Nothing is checked |

The old PRD named visitors only and set no access rules. Decision needed: D-46.

## 5. Metrics and definitions

The screen shows no metric. The old PRD's "about 1 to 2 minute walk" estimate is not built, so no formula exists.

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys. It is an information screen with no hand-off.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-125 | Should the room card show the assigned clinician, a walking time and a Start Check-in button, and where do departments come from? | F-2.4, F-2.5, F-3.3 |
| D-46 | What is the kiosk and patient access model? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
