---
title: "Master Subscription Plans & Feature Gates Matrix"
product: "admin"
module: "plans"
channel: "plans"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | PLANS |
| Channel | PLANS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Industry Plans tab configures commercial subscription tiers (Starter, Growth, Enterprise). Superadmins define monthly/annual pricing, user seat limits, credit allowances, and feature flag gates.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Subscription Plans Matrix & Quota Allocation
#### 1. What it does
Maintains plan tiers with pricing, included clinician seat quotas, storage limits, and feature toggles (AI Scribe, Telephony, Multi-Location).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Plans Table | Data Table | Columns: Plan Name, Category, Monthly Price, Annual Price, Seat Quota, Active Tenants | Includes edit drawer |
| F-1.2: Feature Gate Toggles | Toggles | Granular feature access switches for each plan tier (e.g. Scribe enabled on Growth+) | Enforced by API middleware |
| F-1.3: Monthly Credit Allowance | Number Input | Sets free recurring credit allowance included with subscription each billing cycle | Replenished on 1st of month |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin updates Growth tier features | Enables 'AI Scribe' and sets 2,500 monthly credits | **All Growth tier tenants gain access to AI Scribe on their next session** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Revenue Officer | When packaging our product tiers, I want flexible feature gating, so that enterprise features drive tier upgrades. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Features disabled on a plan tier are inaccessible and display an upgrade prompt in tenant workspaces. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Subscription Plans Matrix & Quota Allocation | F-1.1, F-1.2, F-1.3 | Maintains plan tiers with pricing, included clinician seat quotas, storage limits, and feature toggles (AI Scribe, Telephony, Multi-Location). |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Revenue Officer | When packaging our product tiers, I want flexible feature gating, so that enterprise features drive tier upgrades. | F-1 |
