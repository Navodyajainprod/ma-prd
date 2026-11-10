---
title: "Commercial Plan Categories & Packaging Tiers"
product: "admin"
module: "plans"
channel: "categories"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | PLANS |
| Channel | CATEGORIES |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Plan Categories tab groups subscription plans into commercial packaging categories (e.g., Practice Tiers, Enterprise Blueprints, Add-On Bundles) for structured public pricing display.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Commercial Packaging Categories Registry
#### 1. What it does
Defines pricing display groups and promotional tags (e.g. 'Most Popular', 'Best for Large Clinics') displayed on public signup and checkout pages.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Plan Categories Table | Data Table | Lists category title, badge label, display sort order, and linked plans | Editable |
| F-1.2: Promotional Badge Selector | Dropdown | Assigns marketing highlight badges ('Popular', 'New', 'Enterprise Exclusive') | Renders on checkout UI |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin sets 'Most Popular' badge on Growth Plan Category | Saves configuration | **Public pricing page highlights Growth plan with prominent ribbon** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Marketing Lead | When launching new tiers, I want packaging categories, so that our checkout pages guide users to the recommended plans. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Assigned category badges display accurately on tenant upgrade screens and signup flows. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Commercial Packaging Categories Registry | F-1.1, F-1.2 | Defines pricing display groups and promotional tags (e. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Marketing Lead | When launching new tiers, I want packaging categories, so that our checkout pages guide users to the recommended plans. | F-1 |
