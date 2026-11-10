---
title: "Turn-by-Turn Wayfinding & Interactive Floor Routing"
product: "ai-receptionist"
module: "directions"
channel: "rooms"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | DIRECTIONS |
| Channel | ROOMS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Station & Room Route Editing | Clinic administrators configure station names, floor wings, and landmark instructions in Client Settings > Reception Kiosk, which immediately updates the kiosk route engine. | [View in Client](/client/settings/reception) |

## 1. Module Summary
- The Room-by-Room Route PRD specifies the detailed turn-by-turn guidance engine. It displays landmark-based navigation instructions (e.g. 'Turn right at the main corridor, follow the blue line to Diagnostic Lab 1'), interactive visual route maps, and multi-channel delivery via SMS and thermal ticket printing.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Turn-by-Turn Landmark Route Display
#### 1. What it does
Generates clear, step-by-step physical walking directions starting from the current kiosk position to the target station. Incorporates visible clinic landmarks, painted floor guideline colors, corridor names, and room door numbers.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Route Hero Header | Banner | Displays Destination Room Name, Wing/Floor, and Total Walking Distance in meters/steps | Bold high-contrast font |
| F-1.2: Landmark Step Sequence | Step List | Numbered sequence with icon indicators (Walk straight, Turn right, Take elevator, Destination on left) | Step-by-step layout |
| F-1.3: Visual Floor Line Guide Indicator | Color Chip | Identifies painted floor line to follow (e.g. 'Follow the Blue Line on the floor') | Matches physical clinic paint |
| F-1.4: Aria Voice Navigation Readout | Audio Prompt | Aria avatar speaks aloud the walking direction in patient's chosen language | Clear natural voice |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient checks in for Dr. Rajesh Patel (Room 102) | Kiosk displays Room Route screen | **Step 1: Walk past reception. Step 2: Take Hallway B on right. Step 3: Room 102 is 3rd door on right.** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | When navigating to my doctor's exam room, I want clear landmark directions, so that I arrive without getting lost. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Instructions automatically adapt if destination is on Level 1, injecting elevator guidance. |
| F-1-2 | Text matches the station instructions configured in the clinic's reception settings. |

### F-2: Mobile Pass Dispatch & Thermal Ticket Route Printing
#### 1. What it does
Allows visitors to take directions with them by sending the route link directly to their mobile number via SMS or printing a thermal receipt containing room instructions and a scannable QR code. To confirm: Should turn-by-turn wayfinding instructions be automatically printed on thermal paper tickets or sent exclusively via SMS pass?

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: SMS Route Link Dispatcher | Action Button | Dispatches instant SMS with URL opening interactive route on mobile browser | Includes room number |
| F-2.2: Thermal Ticket Printing Interface | Print Hook | Triggers connected ESC/POS thermal printer to output route slip with queue token | Fast 2-second print |
| F-2.3: QR Code Route Transfer | On-Screen QR | Displays dynamic QR code on kiosk screen that opens mobile map when scanned by phone camera | No typing required |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient receives token at kiosk | Scans on-screen QR code with smartphone | **Mobile browser opens live route with room directions and current queue count** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | I want to have the directions on my smartphone, so that I can reference them while walking through hallways. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Scanning on-screen QR code opens mobile companion route without requiring patient login. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Turn-by-Turn Landmark Route Display | F-1.1, F-1.2, F-1.3, F-1.4 | Generates clear, step-by-step physical walking directions starting from the current kiosk position to the target station. |
| F-2 | Mobile Pass Dispatch & Thermal Ticket Route Printing | F-2.1, F-2.2, F-2.3 | Allows visitors to take directions with them by sending the route link directly to their mobile number via SMS or printing a thermal receipt containing room instructions and a scannable QR code. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | When navigating to my doctor's exam room, I want clear landmark directions, so that I arrive without getting lost. | F-1 |
| 2 | Patient | I want to have the directions on my smartphone, so that I can reference them while walking through hallways. | F-2 |
