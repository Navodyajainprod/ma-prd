---
title: "Custom Fields, Dynamic Layout & Data Dictionary"
product: "client"
module: "settings"
channel: "custom-fields"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SETTINGS |
| Channel | CUSTOM-FIELDS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Custom Fields tab allows clinics to extend standard EHR entities (Patients, Appointments, Processes, Tasks) with specialty-specific custom attributes (e.g., Blood Group, Referring Physician, Preferred Language, Teeth Numbering) and organize them into grouped accordion sections.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Entity Field Builder & Specialty Attribute Manager
#### 1. What it does
Enables adding custom fields to core entities with configurable field types: Text, Number, Dropdown Select, Multi-Select Checkboxes, Date Picker, Currency, and Boolean Yes/No.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Add Custom Field Modal | Modal | Captures Field Label, API Key, Entity (Client, Appointment, Process), and Field Type | Validates unique key |
| F-1.2: Dropdown Option List Manager | Tags Input | Adds and reorders select options for dropdown fields with optional badge colors | Supports unlimited options |
| F-1.3: Mandatory & Visible Flags | Toggles | Configures whether field is required on intake and visible on patient portal | Enforces intake validation |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dental clinic adds 'Tooth Number' field to appointments | Creates Number field 'tooth_number' on Appointment entity | **Field appears on appointment drawer and intake forms** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Administrator | When tracking specialty clinical data, I want custom fields on patient charts, so that our EHR matches our specialty workflow. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a newly added custom field, it immediately appears on the corresponding entity drawer and edit forms. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Entity Field Builder & Specialty Attribute Manager | F-1.1, F-1.2, F-1.3 | Enables adding custom fields to core entities with configurable field types: Text, Number, Dropdown Select, Multi-Select Checkboxes, Date Picker, Currency, and Boolean Yes/No. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Administrator | When tracking specialty clinical data, I want custom fields on patient charts, so that our EHR matches our specialty workflow. | F-1 |
