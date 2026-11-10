---
title: "Physical Station CRUD & Department Allocation"
product: "ai-receptionist"
module: "settings"
channel: "stations"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | SETTINGS |
| Channel | STATIONS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Station Taxonomy & Provider Assignment | Stations configured here immediately define the room picker options in Client appointments and the physical destination badges across all kiosk screens. | [View in Client](/client/settings/organization) |

## 1. Module Summary
- The Physical Stations PRD specifies the administrative configuration interface for physical clinic destinations. Allows clinic managers to create, edit, deactivate, and assign doctors to Consultation Rooms, Diagnostic Labs, Billing Counters, and Pharmacy Dispensary Stations.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Station Management Table & Provider Linkage
#### 1. What it does
Provides a full CRUD data table of physical clinic spaces. Each station defines Name, Station Type (doctor_room, pharmacy, lab, billing, desk, custom), assigned Room Number, Floor/Wing, walking directions landmark text, and active status toggle.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Station Roster Data Table | Data Table | Columns: Station Name, Type, Assigned Provider, Floor/Wing, Status Toggle, Actions | Search and filter by wing |
| F-1.2: Add / Edit Station Modal | Form Modal | Inputs for Name, Type dropdown, Room Number, Wing selector, Directions text | Instant validation |
| F-1.3: Assigned Practitioner Binding | Dropdown Picker | Binds station to active clinic doctor (e.g. Dr. Rajesh Patel assigned to Room 102) | Updates route automatically |
| F-1.4: Active Status Switch | Toggle Switch | Toggles station between Active and Under Maintenance, removing closed rooms from kiosk directory | Immediate kiosk sync |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic opens new Pediatrics wing on 1st Floor | Manager clicks 'Add Station' | **Enters 'Dr. Priya Nair - Room 204', selects 1st Floor Wing, enters directions, and activates** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Manager | I want to configure our physical consultation rooms and doctor assignments, so that kiosk wayfinding directions are always accurate. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Saving a station immediately updates the Reception kiosk wayfinding directory and room database. |
| F-1-2 | Deactivating a station prevents tokens from being dispatched to that room. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Station Management Table & Provider Linkage | F-1.1, F-1.2, F-1.3, F-1.4 | Provides a full CRUD data table of physical clinic spaces. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Manager | I want to configure our physical consultation rooms and doctor assignments, so that kiosk wayfinding directions are always accurate. | F-1 |
