---
title: "Product & Services Catalog Management"
product: "client"
module: "services"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SERVICES |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Product & Services module provides a centralized catalog of billable clinical consultations, procedures, laboratory panels, and wellness care packages with standard pricing, tax rates, and duration allocations.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Clinical Services Catalog & Fee Schedule
#### 1. What it does
Maintains billable items with item codes (CPT/HCPCS), service name, clinical category (Consultations, Procedures, Diagnostics, Pharmacy), standard price, and duration in minutes.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Services Data Table | Data Table | Columns: Code, Service Name, Category, Price, Tax Rate, Duration, Status | Searchable by name and code |
| F-1.2: Add Service Modal | Modal | Captures Service Name, Code, Category, Price, Duration, and Description | Validates unique item code |
| F-1.3: Active Status Toggle | Switch | Enables or disables service availability in appointment booking and invoicing | Disables retired services |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Practice adds 'Comprehensive Dermatology Consultation' | Enters code 'CPT-99204', price '$180', duration '30m' | **Service becomes selectable in appointment booking and invoicing checkout** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When updating our clinic fee schedule, I want a centralized catalog, so that appointment booking and billing use consistent pricing. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Services marked as active appear as selectable options in appointment drawers and invoice creation. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Clinical Services Catalog & Fee Schedule | F-1.1, F-1.2, F-1.3 | Maintains billable items with item codes (CPT/HCPCS), service name, clinical category (Consultations, Procedures, Diagnostics, Pharmacy), standard price, and duration in minutes. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | When updating our clinic fee schedule, I want a centralized catalog, so that appointment booking and billing use consistent pricing. | F-1 |
