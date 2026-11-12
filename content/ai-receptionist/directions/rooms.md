---
title: "Voice Deep-Linking & Turn-by-Turn Room Guide"
product: "ai-receptionist"
module: "directions"
channel: "rooms"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Wayfinding & Directions - Room Guide & Voice Deep-Linking (`/reception/directions/:cat/:room`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Room Directions & Landmark Authoring | Walking instructions, floor labels, and doctor-room links edited by admins in Reception Settings update the kiosk's room guide cards and voice matching automatically. | [View in Client](/client/settings/reception) |
| Client | Provider & Service Location Consistency | Consultation services and provider assignments match the physical rooms visitors ask for by doctor or room name. | [View in Client](/client/services) |
| Companion | Visit Room Continuity | Room names and arrival instructions match across lobby walking cards and the patient's mobile Companion app. | [View in Companion](/companion/today) |

## 1. Module Summary
- The **Voice Deep-Linking & Turn-by-Turn Room Guide** brings visitors directly to plain-language walking directions for any clinic room (`/reception/directions/:category/:room`) either by drilling down from Departments or by speaking naturally to Aria (*"Where is the washroom?"*, *"Where is Dr. Sharma?"*, *"Dawai kahan milegi?"*).
- High-priority bilingual voice matching jumps straight to the **Room Directions Result** card (skipping category menus completely), displays a **Direct Match** pill, reads walking landmarks aloud in English or Hindi, and provides clear follow-up CTAs.

## 2. Feature Requests

### F-1: Bilingual Direct Voice Wayfinding & Synonym Matching
#### 1. What it does
When a visitor asks Aria where to go — whether by **room name** (*"Lab 1"*), **room number** (*"Room 101"*), **doctor name** (*"Dr. Sharma"*), or everyday **English/Hindi terms** (*washroom, toilet, restroom, baathroom, shauchalaya, pharmacy, dawai, water, paani, cash/billing counter*) — the kiosk prioritizes specific destination matching ahead of all general menus. Instead of landing on top-level Department Categories, the kiosk jumps straight to the matching **Room Directions Result** card, tags it with a **`Direct Match`** badge, and reads the directions aloud.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Live Room & Doctor Voice Scan | Voice Matching | Searches active room titles, room numbers, and assigned provider names | Reflects newly added clinic rooms automatically |
| F-1.2: English & Hindi Synonym Map | Bilingual Resolver | Understands colloquial words (`dawai`, `paani`, `washroom`, `baathroom`, `lab`, `billing`) | Bridges everyday patient phrasing to official room names |
| F-1.3: `Direct Match` Badge & Skip-Ahead | Instant UX | Bypasses Category and Room list menus straight into the exact room guide | Saves time for hurried or distressed visitors |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor needs restroom urgently and says "Where is the washroom please?" | Speaks question on Home or active screen | **Kiosk skips category grids and opens Ground Floor Restroom directions with a Direct Match badge and spoken guidance** |
| 2 | Hindi speaker asks "Dawai kahan milegi?" | Speaks Hindi pharmacy query | **Matches Pharmacy Counter A directly and speaks directions aloud** |
| 3 | Patient asks "Where is the billing counter?" | Mentions both "where is" and "billing" | **Specific room match beats generic Billing checkout, opening Billing Desk directions** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Visitor in a Hurry | When I ask Aria aloud for a restroom, doctor, or pharmacy in English or Hindi, I want walking directions immediately without tapping through category menus. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a visitor speaks a query matching an active room, doctor, or English/Hindi synonym, then the kiosk MUST navigate directly to that room's **Room Directions Result** screen and display **Direct Match**. |

---

### F-2: Large-Print Walking Directions Card & Spoken Landmarks
#### 1. What it does
On the **Room Directions Result** card, visitors see high-contrast, easy-to-scan spatial landmarks tailored for standing lobby reading:
- **Header Metadata:** Category zone badge, **Direct Match** pill (when voice-matched), prominent **Room Number** tag (e.g., `Room 101`), and large **Room / Destination Name**.
- **Location & Doctor Row:** Clear **Floor / Wing** badge and **Assigned Clinician** name (for doctor rooms).
- **Turn-by-Turn Walking Text:** Generous large-font walking instructions using real physical landmarks (e.g., *"Walk past reception desk, turn left at water station, restrooms are on the left."*), paired with estimated walking time (`~1–2 min walk`).
- **Spoken Readout:** Aria automatically reads the walking instructions aloud in English or Hindi (unless muted) so visually impaired visitors hear every turn clearly.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Structured Landmark Card | Visual Card | Displays Zone badge, Room `#`, Floor/Wing, Assigned Doctor, and large walking copy | High contrast for effortless reading |
| F-2.2: Automatic Spoken Guidance | Audio Output | Reads room landmarks aloud in English or Hindi upon opening | Respects global Mute toggle |
| F-2.3: Direct Deep-Link URL | Route Sync | Updates URL to `/reception/directions/:categoryId/:roomId` | Supports direct refresh or bookmarking |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor opens **Pharmacy Counter A** | Views Directions Result card | **Card shows Pharmacy & Labs badge, Counter A, Ground Floor location, crisp walking path, and Aria reads directions aloud** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Visually Impaired / Senior Visitor | When getting directions to a room, I want large legible text plus clear spoken landmark instructions so I don't miss a turn. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a room directions card opens, then Room Name, Floor/Wing, landmark walking text, and spoken guidance (when unmuted) MUST present together. |

---

### F-3: Context-Aware Back Navigation & **Start Check-in** / **Done & Return Home** CTAs
#### 1. What it does
To keep navigation intuitive regardless of how a visitor reached a room guide:
- **Context-Aware Back Control:** When arriving via browsing **Departments -> Rooms**, Back returns cleanly to that department's room list; when jumping via **Voice Direct Match**, Back returns smoothly to Home (or Departments) cleanly without dead-ends.
- **Action Footer:** Provides **Done & Return Home** (clearing the session back to the lobby home screen) plus **Start Check-in** for visitors who came looking for a doctor's suite first and now want to get a queue token.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Smart Back Behavior | Navigation | Returns to Room List after browse entry or Home/Directory after direct voice jump | Eliminates confusing extra hops |
| F-3.2: **Done & Return Home** + **Start Check-in** | Footer CTAs | Lets visitor exit cleanly or launch Check-In directly from directions | Connects wayfinding smoothly into care |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient arrived via voice *"Where is Dr. Sharma?"*, sees Room 101, then wants to check in | Taps **Start Check-in** in footer | **Transitions cleanly straight into Face Check-In** |
| 2 | Visitor browsed Facilities -> Restroom and wants to check another facility | Taps Back arrow | **Returns to Facilities room list cleanly** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Visiting Relative or Patient | After reading directions, I want to return cleanly to the room list, go back Home, or jump directly to Check-In in one tap. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given a visitor opened Room Directions via Category/Room browsing, when Back is tapped, then the kiosk MUST return to that category's Room List; tapping **Done & Return Home** MUST reset to Home. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Bilingual Direct Voice Wayfinding | F-1.1 to F-1.3 | Resolves English/Hindi room, doctor, and synonym speech directly to the target room guide. |
| F-2 | Large-Print Walking Directions & Audio | F-2.1 to F-2.3 | Displays floor, room `#`, doctor, and physical landmark steps while reading guidance aloud. |
| F-3 | Context-Aware Back & Check-In CTAs | F-3.1 to F-3.2 | Provides smart back history plus one-tap **Done & Return Home** or **Start Check-in** actions. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | English or Hindi Visitor | Ask aloud for any room or facility and get turn-by-turn spoken and large-print directions instantly. | F-1, F-2 |
| 2 | Self-Navigating Patient | Transition smoothly from finding a doctor's room straight into checking in for care. | F-3 |
