---
title: "Settings: Notification Preferences"
product: "client"
module: "settings"
channel: "notifications"
route: "/settings/notifications"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS |
| Route | `/settings/notifications` (also `/account/notifications`) |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A page of 13 switches, one per module, that decide which modules may raise in-app notifications. It also holds Enable All, Disable All, a reset and a desktop push permission request. |
| **Who uses it** | Practice Admin (sets the switches). The Settings area is limited to the System Admin role. |
| **Where you start it** | **Notifications** in the Settings left menu, or `/account/notifications`, which redirects here. |
| **Where the result goes** | One key in the browser. The notification bell reads it when a module raises an item. |
| **How real is it** | 0 features work, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (all modules) | Module notifications | A switched-off module raises no in-app notification. The setting is read each time a notification is raised. | [View Organization settings](/client/settings/organization) |
| Client (Tasks) | Task alerts | Task alerts go into one shared bell for whoever uses the browser. They have no recipient (G5-E-29). | [View My Tasks](/client/tasks/my-tasks) |
| Client (Integrations) | Integrations switch | One of the 13 switches covers Integrations. | [View Integrations](/client/settings/integrations) |

## 1. Module Summary

### The story in one minute

Rohan Mehta is the Practice Admin. The front desk says the bell is too noisy. He opens **Notifications** in Settings. He sees one switch for each of 13 modules: Appointments, Billings, Calls, Chats, Clients, Dashboard, Document Templates, Integrations, Knowledge Base, Processes, Settings, Tasks and Web Forms. He turns off Dashboard and Integrations. Each change saves at once. He presses **Enable All** to try it, then **reset to defaults**. He also asks the browser for desktop push permission. The page says the change applies to "this organization". The value is kept in his own browser only, so a colleague on another computer sees no change.

### What is real and what is not

- **Real in the prototype:** the 13 module switches, Enable All, Disable All, reset to defaults, the desktop push permission request, and the check when a notification is raised.
- **Simulated:** the scope. The page says "this organization" but the setting is stored once per browser (G10-E-38).
- **Not built:** a choice of channel (email or SMS), a per-user setting and quiet hours.

### Journey position

```
Settings ─▶ Notifications ─▶ Module switch ─▶ Browser key ─▶ Bell raises or skips an item
```

## 2. Feature Requests

### F-1: Module switches

#### 1. What it does
Rohan turns a module on or off. The change saves on its own. **Enable All** and **Disable All** set every switch. A reset puts the defaults back. When a module raises a notification, the notification store first checks that module's switch. Off means the item is not raised.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Module switch | Toggle | One per module (13). Saves at once | ● Works | |
| F-1.2: Enable All, Disable All | Buttons | Set every switch | ● Works | |
| F-1.3: Reset to defaults | Button | Restores the default switches | ● Works | |
| F-1.4: Check when raising | Rule | A switched-off module raises no in-app notification | ● Works | |
| F-1.5: Scope | Rule | Page copy says "this organization". The setting is one browser-wide key | ◐ Simulated | (G10-E-38). Decision needed: D-144 |
| F-1.6: Per-user setting | Rule | Each user sets their own | ○ Not built | Decision needed: D-144 |

#### 3. Worked example
Rohan quiets two modules.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The bell is noisy | Switches off **Dashboard** and **Integrations** | **The change saves at once** |
| 2 | A dashboard event occurs | Nothing | **No in-app notification is raised for it** |
| 3 | A colleague opens the page on another computer | Opens it | **Their switches are unchanged** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When the bell is noisy, I want to switch off modules I do not need, so that staff see only what matters. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a switch, **when** it is changed, **then** it is saved at once with no save button. |
| F-1-2 | **Given** a module is off, **when** it raises a notification, **then** none is raised. |
| F-1-3 | **Given** the setting is changed on one browser, **then** other browsers are unaffected. |

### F-2: Desktop push and channels

#### 1. What it does
Rohan presses the push button and the browser asks for permission to show desktop notifications. The page offers no choice of email or SMS.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Desktop push permission | Button | Requests the browser's notification permission | ● Works | |
| F-2.2: Channel choice | Setting | Email or SMS notifications | ○ Not built | Decision needed: D-144 |
| F-2.3: Quiet hours | Setting | No quiet hours | ○ Not built | |

#### 3. Worked example
Rohan wants alerts on his desktop.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Push is not allowed yet | Presses the push permission button | **The browser asks for permission** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When I am away from the app, I want desktop alerts, so that I do not miss urgent items. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the push button, **when** it is pressed, **then** the browser asks for notification permission. |
| F-2-2 | **Given** the page, **then** it offers no email or SMS choice. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Module switches | F-1.1 – F-1.6 | ● / ◐ / ○ | Switches work and save; scope is per browser. |
| F-2 | Desktop push and channels | F-2.1 – F-2.3 | ● / ○ | Push permission works; no channels. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Switch off modules I do not need | F-1 |
| 2 | Practice Admin | Get desktop alerts when away | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| System Admin (the default role) | Change every switch | Nothing |
| Any other role | Nothing: Settings shows a message and sends the user to the home page | The whole Settings area |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The active role comes from browser storage and defaults to System Admin. No earlier PRD covers this page. Decision needed: D-12.

## 5. Metrics and definitions

The page shows no metric.

## 6. Cross-module journeys this module appears in

This page is not a step in the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-144 | Is notification scope per organisation or per user, and are channels added? | F-1.5, F-1.6, F-2.2 |
| D-12 | Must permissions block direct URL access and each action? | Roles section |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
