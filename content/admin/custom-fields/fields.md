---
title: "Global Custom Fields Master Data Dictionary"
product: "admin"
module: "custom-fields"
channel: "fields"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | CUSTOM-FIELDS |
| Channel | FIELDS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Custom Field Ingestion in Practice Settings | Fields configured in the Admin master dictionary appear as available selectable fields for clinic coordinators in Client Settings > Custom Fields. | [View in Client](/client/settings/custom-fields) |

## 1. Module Summary
- The Fields Master tab in the Admin workspace manages the platform-wide clinical data dictionary. Superadmins configure reusable field definitions, assign data types (Text, Number, Dropdown, Multi-select, Date, Boolean), and set validation formulas that automatically propagate to tenant EHR instances.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Global Clinical Data Dictionary & Field Creation
#### 1. What it does
Defines master data fields with unique API keys, human-readable labels, entity associations (Client, Appointment, Process, Task), and data type constraints.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Master Fields Data Table | Data Table | Columns: Field Label, Key, Entity, Type, Validation, Required, Status | Sortable by entity |
| F-1.2: Add Field Drawer | Drawer | Slide-over drawer capturing Field Name, Key, Entity Selector, Data Type, and Placeholder | Validates alphanumeric key |
| F-1.3: Data Type Support Matrix | Dropdown | Supports: Text, Number, Single-Select Dropdown, Multi-Select Tags, Date Picker, Currency, Boolean | Enforces type safety |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin registers 'Blood Type' clinical field | Creates dropdown field 'blood_type' on Client entity with options A+, A-, B+, B-, O+, O-, AB+, AB- | **Field becomes available globally across all tenant intake forms** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Administrator | When standardizing clinical schemas, I want a master data dictionary, so that all tenant practices collect structured, normalized health data. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Creating a master field registers its key and enforces validation formulas across all tenant schemas. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Global Clinical Data Dictionary & Field Creation | F-1.1, F-1.2, F-1.3 | Defines master data fields with unique API keys, human-readable labels, entity associations (Client, Appointment, Process, Task), and data type constraints. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Administrator | When standardizing clinical schemas, I want a master data dictionary, so that all tenant practices collect structured, normalized health data. | F-1 |
