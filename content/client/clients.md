---
title: "Contact & Patient EHR Directory"
product: "client"
module: "clients"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | CLIENTS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient Demographic Profile Sync | Edits to contact details (phone, email, emergency contact) made in the Client directory synchronize seamlessly to the patient's profile in the Companion portal. | [View in Companion](/companion/today) |

## 1. Module Summary
- The Contact / Patients module provides a complete EHR demographic directory and clinical profile view. Staff can search patients, view clinical histories, triage prospective leads versus active patients, and export records under HIPAA compliance controls.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Comprehensive Patient Directory Search & Category Filters
#### 1. What it does
Provides real-time typeahead search across patient name, phone number, email, date of birth, and patient ID / MRN. Includes quick tabs for Leads, Patients, and Archived contacts.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Real-Time Patient Search Bar | Search Input | Searches patient database across multiple demographic attributes simultaneously | Debounced 200ms input |
| F-1.2: Category Switcher (Leads vs Patients) | Tabs | Filters directory between prospective inquiries (Leads) and registered clinic patients | Shows count badges |
| F-1.3: New Patient Registration Button | Button & Modal | Opens quick patient registration modal capturing Name, Phone, Email, DOB, and Gender | Validates duplicate phone |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist searches for incoming caller | Types '+1-555-0199' into search bar | **Directory isolates Sarah Johnson's chart within 100ms** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Receptionist | When a patient calls the clinic, I want to find their chart instantly by phone number, so that I have their medical context on screen. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Searching by patient phone or MRN returns matching patient records with sub-second latency. |

### F-2: EHR Patient Profile Drawer & Encounter Timeline
#### 1. What it does
Displays comprehensive patient details in a slide-over drawer: Demographics, Insurance Policies, Past Appointments, Active Processes, Clinical Notes, and Form Submissions.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Patient Profile Drawer | Drawer | Slide-over drawer organized into tabs: Overview, History, Documents, Processes | Keeps directory visible behind |
| F-2.2: Clinical Encounter Timeline | Timeline | Chronological list of all doctor consultations, vitals, prescriptions, and billing events | Includes practitioner attribution |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor reviews patient chart before consultation | Clicks patient card in directory | **Drawer opens showing past diagnoses, current medications, and previous visit notes** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Physician | When preparing for a visit, I want a complete encounter timeline, so that I understand the patient's full medical history. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Opening a patient chart drawer displays historical encounters in descending chronological order. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Comprehensive Patient Directory Search & Category Filters | F-1.1, F-1.2, F-1.3 | Provides real-time typeahead search across patient name, phone number, email, date of birth, and patient ID / MRN. |
| F-2 | EHR Patient Profile Drawer & Encounter Timeline | F-2.1, F-2.2 | Displays comprehensive patient details in a slide-over drawer: Demographics, Insurance Policies, Past Appointments, Active Processes, Clinical Notes, and Form Submissions. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist | When a patient calls the clinic, I want to find their chart instantly by phone number, so that I have their medical context on screen. | F-1 |
| 2 | Physician | When preparing for a visit, I want a complete encounter timeline, so that I understand the patient's full medical history. | F-2 |
