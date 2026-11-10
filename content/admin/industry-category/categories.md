---
title: "Healthcare Vertical Industry Categories Taxonomy"
product: "admin"
module: "industry-category"
channel: "categories"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | INDUSTRY-CATEGORY |
| Channel | CATEGORIES |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Industry Categories tab establishes top-level healthcare classifications (e.g., Primary Care, Dental Health, Mental & Behavioral Health, Surgical Specialties) that group vertical industry blueprints.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Master Healthcare Category Registry
#### 1. What it does
Lists and manages high-level clinical taxonomy categories, tracking how many vertical practice templates and tenant clinics belong to each category.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Categories Table | Data Table | Columns: Category Name, Code, Description, Sub-Industries Count, Active Status | Searchable |
| F-1.2: Add Category Modal | Modal | Captures Category Name (e.g. 'Allied Health') and Description | Generates taxonomy code |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Superadmin creates 'Specialized Therapy' category | Fills name and description | **Category becomes selectable when creating new vertical industry blueprints** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Architect | When scaling our SaaS platform, I want structured industry categories, so that practice blueprints are organized logically. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Creating a category allows it to immediately group new vertical industry templates. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Master Healthcare Category Registry | F-1.1, F-1.2 | Lists and manages high-level clinical taxonomy categories, tracking how many vertical practice templates and tenant clinics belong to each category. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Architect | When scaling our SaaS platform, I want structured industry categories, so that practice blueprints are organized logically. | F-1 |
