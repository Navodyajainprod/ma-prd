---
title: "Sidebar Navigation Layout Editor & Feature Flags"
product: "admin"
module: "sidebar-config"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | SIDEBAR-CONFIG |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Sidebar Configuration module allows superadmins to customize the default navigation layout across all client and admin workspaces: reordering menu categories, toggling module visibility, and enforcing role-based menu restrictions.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Visual Navigation Tree Editor & Module Visibility Toggles
#### 1. What it does
Provides a drag-and-drop navigation editor to reorder menu items, group modules into custom sections (e.g. WORKSPACE, REVENUE, SETTINGS), and toggle module feature flags platform-wide.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Navigation Tree Canvas | Drag Tree | Visual tree structure representing sidebar hierarchy with drag handles for reordering | Saves layout JSON |
| F-1.2: Module Visibility Switches | Switches | Enables or hides specific modules globally or per plan tier | Immediate client-side sync |
| F-1.3: Role Access Menu Filter | Dropdown | Selects which user roles are permitted to see specific navigation links | Enforces RBAC navigation |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin hides unreleased 'AI Scribe' from Starter plan users | Toggles visibility off for Starter tier | **Starter tier sidebars automatically remove Scribe link from their left menu** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Architect | When releasing new modules in beta, I want to control menu visibility by tier, so that only entitled users see new navigation links. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Changes saved in Sidebar Configuration update navigation menus for affected users on their next session. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Visual Navigation Tree Editor & Module Visibility Toggles | F-1.1, F-1.2, F-1.3 | Provides a drag-and-drop navigation editor to reorder menu items, group modules into custom sections (e. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Architect | When releasing new modules in beta, I want to control menu visibility by tier, so that only entitled users see new navigation links. | F-1 |
