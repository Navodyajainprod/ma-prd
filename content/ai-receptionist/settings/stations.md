---
title: "Clinic Stations & Process Stage Guidance"
product: "ai-receptionist"
module: "settings"
channel: "stations"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Settings & Configuration - Clinic Stations & Process Stage Guidance |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Reception Kiosk Settings Console | Practice managers create, edit, activate, or remove rooms and desks right inside Reception Settings without leaving the clinic portal. | [View in Client](/client/settings/reception) |
| Client | Process Kanban Stage Templates | Stage-level portal and kiosk cards configured inside Process workflows render directly on the kiosk's My Visit next-step view for active patients. | [View in Client](/client/processes/kanban) |
| Client | Process List Management | Lists and organizes multi-stage care journeys whose individual steps carry custom patient-facing kiosk guidance. | [View in Client](/client/processes/list) |
| Client | Dynamic Custom Fields | Patient, appointment, invoice, and stage variables inserted into card templates resolve from live practice records and custom fields. | [View in Client](/client/settings/custom-fields) |
| AI Receptionist | Department Directory & Wayfinding | Rooms and desks marked Active here populate the kiosk's zone directory and turn-by-turn wayfinding cards automatically. | [View in AI Receptionist](/ai-receptionist/directions/departments) |
| AI Receptionist | Next Step Stage Guidance | Patient stage cards authored in Stage Portal & Reception Settings appear inside the kiosk's Next Step view. | [View in AI Receptionist](/ai-receptionist/my-visit/next-step) |

## 1. Module Summary
- **Clinic Stations & Process Stage Guidance** defines the physical layout and dynamic instruction templates that power every self-service screen in the clinic lobby.
- Clinic administrators manage physical consulting rooms and service counters inside **Clinic Rooms & Desks**, while care coordinators design personalized, stage-specific instruction cards inside **Stage Portal & Reception Settings** so visitors always see the right room, token, provider, and next step at the exact moment they arrive.

## 2. Feature Requests

### F-1: Clinic Rooms & Desks Directory Management (`Clinic Rooms & Desks`)
#### 1. What it does
Gives clinic operations teams a centralized table to register and maintain every physical point of care or service counter served by the kiosk (`Doctor Room`, `Pharmacy`, `Diagnostic Lab`, `Billing Desk`, and `Front Desk`). Selecting **Add Room** opens a guided creation dialog with station name validation (`"Please enter a room name"`), room number, station category, assigned provider name, and active toggle; confirmation immediately updates kiosk wayfinding, walk-in doctor booking lists, and queue token issuance with a `"Room added successfully"` toast. Clicking **Delete Room** removes decommissioned counters cleanly so visitors are never routed to an inactive desk.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Five Station Types | Station Catalog | Classifies locations as Doctor Room, Pharmacy, Diagnostic Lab, Billing Desk, or Front Desk | Maps automatically to kiosk zone cards |
| F-1.2: Add Room Modal | Creation Flow | Captures station name (required), room number, category, assigned provider, and active status | Shows `"Room added successfully"` on save |
| F-1.3: Inline Edit & Active Toggle | Station Control | Lets staff rename counters, update assigned practitioners, or temporarily deactivate a room | Shows `"Room updated successfully"` on save |
| F-1.4: Delete Room Action | Lifecycle Control | Permanently deletes retired desks or temporary pop-up booths from kiosk routing | Updates kiosk directory immediately |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic opens a second blood collection bay | Clicks **Add Room**, names it `Lab Bay B`, sets Room `#204`, picks `Diagnostic Lab`, marks Active | **`Lab Bay B` appears immediately inside Directions and lab queue routing with toast `"Room added successfully"`** |
| 2 | Dr. Rao takes leave for the afternoon | Toggles Dr. Rao's `Doctor Room` off or updates the covering provider name | **Walk-in booking and check-in reflect the updated room coverage cleanly** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Operations Lead | When opening or reassigning rooms, I want one menu to maintain active desks and doctors, so that lobby kiosks never misroute arriving patients. |
| F-1-J2 | Visiting Patient | When checking in or asking Aria for directions, I want room numbers and covering clinician names to match the hallway outside, so that I walk straight to the right door. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-AC1 | Submitting **Add Room** without a room name displays `"Please enter a room name"` and prevents saving an unnamed station. |
| F-1-AC2 | Saving a new or edited station displays `"Room added successfully"` or `"Room updated successfully"` and reflects immediately in kiosk wayfinding. |

---

### F-2: Station Visibility Across Kiosk Check-In, Booking & Wayfinding
#### 1. What it does
Ensures every room entry serves as a single shared clinic reference rather than maintaining separate lists for booking, queueing, and directions:
- **Walk-In Booking:** Active `Doctor Room` entries determine which clinician room assignments accompany each newly booked walk-in token.
- **Department & Room Wayfinding:** Active rooms across Doctor Rooms, Pharmacy, Diagnostic Lab, Billing Desk, and Front Desk populate zone directories with floor and wing hints.
- **Queue Token Association:** Checking in for a scheduled visit or walk-in pairs the issued ticket directly with its destination station name and room number.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Active Filtering | Visibility Rule | Hides paused or under-maintenance rooms from patient-facing self-service selection | Preserves existing closed records without disruption |
| F-2.2: Facility Map Alignment | Sync Behavior | Aligns kiosk station entries with the practice's primary facility room registry | Keeps front-desk and kiosk terminology identical |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Practice renames `Room 102` to `Eye Suite 102` in settings | Station updates across directions, check-in confirmation, and My Visit cards | **Patients see `Eye Suite 102` on their confirmation card and hallway directions** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Administrator | When updating room labels once, I want check-in, directions, and staff views to stay aligned automatically, so that no manual re-entry is needed. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-AC1 | Deactivating a room removes it from self-service walk-in doctor/station selection without breaking previously issued historical tickets. |

---

### F-3: **Stage Portal & Reception Settings** Card Composer (`Stage Portal & Reception Settings`)
#### 1. What it does
Allows care coordinators working inside any Process stage to configure what a patient in that exact stage reads on the kiosk's **My Visit -> Next Step** screen. Opening **Stage Portal & Reception Settings** exposes:
- **Card Title \*** and **Card Description** inputs summarizing the milestone.
- **Dual Editor Tabs (`HTML` and `Preview`):** Teams write rich formatted guidance in HTML (with checklists, preparation instructions, or fasting reminders) and toggle **Preview** to verify the live card layout before publishing.
- **`{ } Select Fields` Variable Picker:** A searchable multi-select drawer organized cleanly across four clinical categories—**`CLIENTS`**, **`APPOINTMENTS`**, **`INVOICES`**, and **`STAGE`**—letting authors drop live placeholders (such as patient first name, appointment time, assigned doctor, invoice balance, or stage status) straight into the card without manual typing mistakes, then save with **APPLY** or discard with **CANCEL**.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Card Header Editor | Stage Metadata | Captures required `Card Title *` and helper `Card Description` | Shown at the top of the kiosk Next Step card |
| F-3.2: HTML & Live Preview Tabs | Content Composer | Switches between markup authoring and rendered patient card preview | Verifies typography and readability before saving |
| F-3.3: `{ } Select Fields` Picker | Dynamic Fields | Searchable variable selector grouped under `CLIENTS`, `APPOINTMENTS`, `INVOICES`, and `STAGE` | Replaces manual field lookup |
| F-3.4: Apply / Cancel Controls | Publish Actions | Commits changes cleanly into the stage workflow or cancels edits cleanly | Applies immediately when a matched patient visits kiosk |

#### 3. Worked example
| # | Situation | What the coordinator does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator configures pre-lab fasting instructions on a Diagnostics stage | Opens **Stage Portal & Reception Settings**, enters `Card Title *` `"Pre-Lab Verification"`, inserts Patient First Name and Appointment Time from **Select Fields**, checks **Preview**, clicks **APPLY** | **When checked-in patients in Diagnostics ask Aria "What is my next step?", the personalized card renders live on the kiosk** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Care Program Designer | When building patient care stages, I want a live preview and searchable variable picker for kiosk cards, so that every visitor gets personalized next-step instructions automatically. |
| F-3-J2 | Returning Patient | When advancing through multi-step clinical care, I want the kiosk to tell me what happens at my current stage, so that I never wait confused between departments. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-AC1 | **`Stage Portal & Reception Settings`** enforces **`Card Title *`**, organizes dynamic fields under `CLIENTS`, `APPOINTMENTS`, `INVOICES`, and `STAGE`, previews rendered formatting accurately, and saves cleanly via **APPLY**. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Clinic Rooms & Desks Directory Management | F-1.1 to F-1.4 | Creates, edits, toggles, and deletes physical kiosk stations across all five clinic categories. |
| F-2 | Station Visibility Across Check-In & Directions | F-2.1 to F-2.2 | Keeps active rooms synchronized cleanly between lobby wayfinding, booking, and queue tickets. |
| F-3 | Stage Portal & Reception Settings Card Composer | F-3.1 to F-3.4 | Builds dynamic HTML/Preview kiosk next-step cards using searchable clinic field variables. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Operations Lead | Maintain accurate room numbers, categories, and provider coverage once for all waiting-room kiosks. | F-1, F-2 |
| 2 | Care Program Designer | Author personalized stage instructions with live preview and dynamic patient fields for My Visit kiosk screens. | F-3 |
