---
title: "Roles & Permissions Master RBAC Matrix"
product: "admin"
module: "roles"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | ROLES |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Roles & Permissions module establishes the system-wide Role-Based Access Control (RBAC) matrix. Superadmins define base permissions across all modules (Read, Add, Edit, Delete, Export, Import) for Doctors, Nurses, Coordinators, and Billing Specialists.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Granular RBAC Permission Matrix & Custom Role Studio
#### 1. What it does
Displays a full grid of permissions across 18 platform modules and 6 standard roles, allowing granular toggle of Read, Add, Edit, Delete, Export, and Import capabilities.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: RBAC Permission Matrix Grid | Matrix Table | Columns: Module Name; Rows: Permissions (Read, Add, Edit, Delete, Export, Import) | One-click toggle buttons |
| F-1.2: Custom Role Creator | Modal | Clones an existing role and customizes specific overrides (e.g. 'Lead Dental Hygienist') | Assigns to tenant users |
| F-1.3: PHI Export Permission Gate | Strict Security Gate | Special security flag requiring multi-factor re-authentication to grant 'Export' rights | Prevents unauthorized bulk downloads |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin disables 'Delete' permission on Patient records for Receptionist role | Toggles off 'Delete' in Clients row for Receptionist | **Receptionists no longer see delete button on patient charts** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Security Officer | When defining clinic roles, I want fine-grained permission controls, so that staff members only have access to actions required for their job. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Users lacking a specific permission (e.g. Export) have the corresponding UI buttons hidden and API endpoints blocked. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Granular RBAC Permission Matrix & Custom Role Studio | F-1.1, F-1.2, F-1.3 | Displays a full grid of permissions across 18 platform modules and 6 standard roles, allowing granular toggle of Read, Add, Edit, Delete, Export, and Import capabilities. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Security Officer | When defining clinic roles, I want fine-grained permission controls, so that staff members only have access to actions required for their job. | F-1 |
