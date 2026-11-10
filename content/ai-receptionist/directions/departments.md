---
title: "Clinic Wayfinding & Department Directory"
product: "ai-receptionist"
module: "directions"
channel: "departments"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | DIRECTIONS |
| Channel | DEPARTMENTS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Floor Navigation | When a patient views directions on the kiosk, they can tap 'Send to Phone' to open the exact same route instructions within the Companion web app. | [View in Companion](/companion/today) |

## 1. Module Summary
- The Department Directory allows visitors, patients, and caregivers to explore the clinic layout by zone. It organizes physical locations into three primary categories: Clinical & Doctors (OPD), Pharmacy & Labs, and Facilities & Restrooms, providing quick routes from the kiosk location.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Categorized Zone Directory & Room Listings
#### 1. What it does
Displays clinic destinations grouped by operational category: Clinical Consultations, Diagnostic Labs & Pharmacy, and Public Amenities. Each destination displays floor level, wing name, and estimated walking steps from the current kiosk station.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Category Tab Bar | Nav Tabs | Three primary zones: Clinical & Doctors, Pharmacy & Labs, Facilities & Restrooms | Icon badges for each zone |
| F-1.2: Destination Room Cards | List Cards | Shows Room Name (e.g. 'Main Pharmacy & Dispensing'), Wing ('Ground Floor Lobby'), and Walk Time ('1 min') | Tap to view route |
| F-1.3: Visual Wing Color Coded Badges | Badge UI | Color-coded indicators: Blue (Clinical Wing B), Green (Pharmacy), Orange (Diagnostics) | Matches physical signage |
| F-1.4: Search Destination Input | Search Field | Instant real-time search filtering rooms by doctor name, test type, or facility | Auto-completes as typed |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor enters clinic seeking blood test laboratory | Taps 'Pharmacy & Labs' category tab | **Taps 'Diagnostic Lab 1 & Blood Collection' to view corridor route** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Visitor | When I need to find a department, I want a structured directory, so that I don't wander around the clinic lost. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Selecting a department lists all active rooms belonging to that category. |
| F-1-2 | Deactivated rooms configured in settings do not appear in the public directory. |

### F-2: Interactive Floor Selector & Facility Amenities Locator
#### 1. What it does
Provides quick toggles for Ground Floor and 1st Floor Specialty Wings, highlighting essential amenities including wheelchair-accessible restrooms, drinking water stations, prayer rooms, and elevator banks.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Floor Switcher (Ground / Level 1) | Pill Switcher | Instant toggle between Ground Floor Main Clinic and Level 1 Specialty Suites | Displays floor occupancy |
| F-2.2: Essential Amenities Card Grid | Card Grid | Dedicated cards for Restrooms, Water Stations, Elevator, and Emergency Exit | Clear international icons |
| F-2.3: Accessibility Route Highlighting | Filter Toggle | Toggles step-free and wheelchair-accessible path instructions via central elevator | ADA compliant guidance |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Elderly patient with wheelchair needs restroom | Toggles 'Accessible Route' on Facilities tab | **System directs to Ground Floor Central Corridor restroom with zero stairs** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient / Visitor | I want to locate restrooms and elevators immediately, so that I can navigate comfortably. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Accessible routes prioritize elevator banks over stairs across all multi-floor routes. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Categorized Zone Directory & Room Listings | F-1.1, F-1.2, F-1.3, F-1.4 | Displays clinic destinations grouped by operational category: Clinical Consultations, Diagnostic Labs & Pharmacy, and Public Amenities. |
| F-2 | Interactive Floor Selector & Facility Amenities Locator | F-2.1, F-2.2, F-2.3 | Provides quick toggles for Ground Floor and 1st Floor Specialty Wings, highlighting essential amenities including wheelchair-accessible restrooms, drinking water stations, prayer rooms, and elevator banks. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Visitor | When I need to find a department, I want a structured directory, so that I don't wander around the clinic lost. | F-1 |
| 2 | Patient / Visitor | I want to locate restrooms and elevators immediately, so that I can navigate comfortably. | F-2 |
