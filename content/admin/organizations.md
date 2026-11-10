---
title: "Multi-Tenant Practice Provisioning & Clinic Management"
product: "admin"
module: "organizations"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | ORGANIZATIONS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Organizations module manages multi-tenant clinic accounts: provisioning new practice workspaces, allocating database storage quotas, assigning industry blueprints, and monitoring tenant subscription statuses.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Multi-Tenant Clinic Directory & Workspace Provisioner
#### 1. What it does
Lists all tenant practices across the platform with search, status filters (Active, Trial, Suspended), industry blueprint tags, storage usage, and primary administrator contact details.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Tenants Data Table | Data Table | Columns: Organization Name, Slug, Blueprint, Subscription, Users Count, Created Date, Status | Searchable |
| F-1.2: Provision Organization Modal | Modal | Captures Practice Name, Custom Slug, Owner Email, Industry Blueprint, and Plan Tier | Provisions workspace instantly |
| F-1.3: Tenant Impersonation & Support Login | Action Button | Allows authorized superadmins to log into tenant workspace in read-only support mode | Logged in audit trail |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Superadmin provisions 'Downtown Dental Specialists' | Selects 'Dental Clinic' blueprint and Growth plan | **Tenant workspace is provisioned with custom URL 'downtown-dental.mantraassist.com'** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Superadmin | When onboarding a new clinic customer, I want to provision their tenant workspace with one click, so that their practice is ready immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Provisioning an organization creates isolated database records and dispatches an owner activation email. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Multi-Tenant Clinic Directory & Workspace Provisioner | F-1.1, F-1.2, F-1.3 | Lists all tenant practices across the platform with search, status filters (Active, Trial, Suspended), industry blueprint tags, storage usage, and primary administrator contact details. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Superadmin | When onboarding a new clinic customer, I want to provision their tenant workspace with one click, so that their practice is ready immediately. | F-1 |
