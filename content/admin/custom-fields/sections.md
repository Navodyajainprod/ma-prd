---
title: "Sections & Form Layout Master Architecture"
product: "admin"
module: "custom-fields"
channel: "sections"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | CUSTOM-FIELDS |
| Channel | SECTIONS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Sections Master tab organizes fields into grouped UI accordion sections (e.g. Demographics, Insurance Policies, Clinical History, Emergency Contacts) and configures role-based section visibility rules.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Section Containers & Visual Accordion Ordering
#### 1. What it does
Defines grouped layout containers for entity drawer forms. Superadmins can reorder sections via drag handles, configure default expanded/collapsed states, and assign fields into specific sections.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Section Reordering Tree | Drag List | Drag-and-drop list of layout sections with handle indicators | Persists order sequence |
| F-1.2: Add Section Modal | Modal | Captures Section Title, Entity Association, and Default Expanded Toggle | Creates new grouping container |
| F-1.3: Role-Based Section Gate | Permissions Matrix | Hides or displays entire sections based on user role (e.g. 'Billing Info' hidden from Nurses) | Enforces least-privilege view |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin sets up 'Insurance Details' section | Creates section on Client entity, marks default expanded, and restricts edit to Billing and Admin roles | **Clinicians see insurance as read-only accordion** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Administrator | When organizing dense clinical forms, I want collapsible section containers, so that practitioners are not overwhelmed by unstructured fields. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Reordering sections updates the display order on entity drawers across all client portals. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Section Containers & Visual Accordion Ordering | F-1.1, F-1.2, F-1.3 | Defines grouped layout containers for entity drawer forms. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Administrator | When organizing dense clinical forms, I want collapsible section containers, so that practitioners are not overwhelmed by unstructured fields. | F-1 |
