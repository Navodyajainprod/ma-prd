---
title: "Clinic Zones & Department Directory"
product: "ai-receptionist"
module: "directions"
channel: "departments"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Wayfinding & Directions - Clinic Zones & Departments (`/reception/directions`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Clinic Rooms & Reception Stations Sync | Consultation suites, dental clinics, diagnostic labs, and custom rooms configured in Reception Settings appear automatically inside the kiosk's department categories. | [View in Client](/client/settings/reception) |
| Client | Service-to-Location Alignment | Diagnostic, pharmacy, and consultation departments mirror the clinical services offered by the practice. | [View in Client](/client/services) |
| Companion | Consistent Facility Information | Room names and clinic locations patients view inside Companion align cleanly with lobby department wayfinding. | [View in Companion](/companion/today) |

## 1. Module Summary
- The **Clinic Zones & Department Directory** gives arriving patients, caregivers, and visitors an instant interactive map of clinic zones at `/reception/directions`, accessible from the Home **Directions** button, Floating Right Dock, or asking *"Directions"* aloud.
- Dynamically organizing clinic locations across core zones (**Clinical & Doctors**, **Pharmacy & Labs**, **Facilities & Restrooms**, plus active **Dental**, **Diagnostics**, **Clinical**, and **Other** rooms configured in clinic settings), visitors browse cleanly from Zone -> Room -> Walking Directions with spoken overview support.

## 2. Feature Requests

### F-1: Dynamic Multi-Zone Department Grid (`/reception/directions`)
#### 1. What it does
Opening **Directions** loads the **Clinic Departments** grid pairing static facility landmarks with live rooms managed by clinic administrators in Reception Settings. Core zones cover **Clinical & Doctors** (consultation suites), **Pharmacy & Labs** (dispensary and specimen counters), and **Facilities & Restrooms** (washrooms, water stations, waiting lounge), while active clinic rooms automatically expand into **Dental**, **Diagnostics**, **Clinical**, or **Other** categories whenever configured by staff — showing exact active room counts per zone without manual kiosk updates.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Core Facility & Service Zones | Category Grid | Groups Clinical & Doctors, Pharmacy & Labs, and Facilities & Restrooms in large touch cards | Instant 1-tap drill-down |
| F-1.2: Live Clinic Room Merge | Auto Sync | Automatically includes active Dental, Diagnostics, Clinical, and Other rooms added by clinic admins | Prevents kiosk maps from going stale |
| F-1.3: Spoken Directory Welcome | Audio Prompt | Aria summarizes department browsing instructions cleanly in English or Hindi | Synced with bottom live captions |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic administrator adds a new Dental Room in Settings | Saves active Dental suite with walking directions | **Dental category card with live room count appears automatically inside kiosk Directions** |
| 2 | Visitor taps Directions on lobby screen | Selects **Directions** from Home or Dock | **Clean department grid displays all active clinic zones with clear icons and room totals** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | New Clinic Visitor | When looking for a department in an unfamiliar building, I want clear visual categories showing how many rooms belong to each zone, so that I can find where I need to go without waiting in line at the reception desk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given **Directions** is opened, then core zones (**Clinical & Doctors**, **Pharmacy & Labs**, **Facilities & Restrooms**) plus any active configured clinic room categories MUST render with accurate room counts. |

---

### F-2: Department Room Listing & Quick Navigation (`DIRECTIONS_ROOMS`)
#### 1. What it does
Tapping any department card transitions immediately into that department's **Room Listing**, showing every active consultation cabin, dispensary window, lab, or facility within that zone. Each room card previews the **Room / Counter Name**, short **Room Number badge** (e.g., `Room 101`), **Floor / Wing label**, and **Assigned Clinician** where applicable, alongside a single-tap **Back to Categories** button to explore another wing.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Department Room Cards | Selection List | Lists all rooms inside the chosen zone with floor badges and doctor names | Hides inactive rooms cleanly |
| F-2.2: URL-Synced Department Route | Navigation | Updates route path cleanly (`/reception/directions/:categoryId`) as visitors browse | Supports deep links & Back button |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor taps **Pharmacy & Labs** | Selects category tile | **Opens room list displaying Pharmacy Counter A and Diagnostic Lab 1 with floor indicators** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Visitor Seeking Doctor / Facility | After tapping a clinic zone, I want to see each room's number, floor, and doctor name clearly before viewing detailed walking steps. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a department category is tapped, then only rooms belonging to that active category MUST appear with floor/room badges and a functional back control to Categories. |

---

### F-3: Quiet Return-Home & Check-In Transition Shortcuts
#### 1. What it does
Visitors who simply wanted to locate a restroom or pharmacy can tap **Home** or **Start over** immediately, or use the Right Dock anytime to switch straight into **Appointment Check-In** once they orient themselves inside the building. Active camera streams from earlier steps stay closed while browsing directions to preserve comfort and battery life.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: One-Tap Exit or Switch | Dock & Header Controls | Lets visitors return to Home or jump into Check-In / Billing cleanly | Participates in global 60s privacy reset |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor checks where Pediatrics is, then decides to check in | Taps **Appointment** on the Right Dock | **Opens Check-In immediately without needing to navigate back to Home first** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Multi-Tasking Visitor | After checking where a room is located, I want to either return Home or jump straight to Check-In in one tap. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given a visitor is viewing Department Categories or Rooms, then tapping **Home** MUST return cleanly to the ambient lobby screen and tapping **Appointment** MUST launch Check-In. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Dynamic Multi-Zone Department Grid | F-1.1 to F-1.3 | Displays Clinical, Pharmacy/Labs, Facilities, and synced active clinic categories with room counts. |
| F-2 | Department Room Listing | F-2.1 to F-2.2 | Previews room numbers, floor wings, and assigned doctors inside any chosen zone. |
| F-3 | Quick Home & Check-In Switching | F-3.1 | Connects wayfinding cleanly back to Home or into Check-In/Billing via the Right Dock. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Unfamiliar Clinic Visitor | Browse clinic wings, rooms, and facilities independently without queuing at front reception. | F-1, F-2, F-3 |
