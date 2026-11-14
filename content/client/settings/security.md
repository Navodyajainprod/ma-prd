---
title: "Security Policies & Member Security"
product: "client"
module: "settings"
channel: "security"
route: "/settings/security"
status: "In Review"
build_status: "Simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS |
| Route | `/settings/security` |
| Status | In Review |
| Build status | Simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | Security controls in two drawers: five policy cards on the **Security** tab of the organization drawer, and a **Security** tab in each member's drawer. There is no Security page. |
| **Who uses it** | Practice Admin. Only the System Admin role passes the Settings guard. |
| **Where you start it** | **Settings**, **Organization**, open an organization, then its **Security** tab. Or **Settings**, **Team**, open a member, then **Security**. `/settings/security` redirects to the Organization tab and the Settings menu has no Security item. |
| **Where the result goes** | Nowhere. The controls change drawer state. No login, page or timer reads them. |
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
| Client (Team) | Member security | The member drawer has a Security tab with password, two-factor, sessions and idle timeout. | [View Team](/client/settings/team) |
| Client (Organization) | Policy cards | Organization-wide policies sit in the organization drawer. They are not part of its Save (G10-E-12). | [View Organization](/client/settings/organization) |
| Client (AI Receptionist settings) | Spam-call shielding | The robo-call card and blocked-numbers list sit here as screen controls only. Nothing blocks a call. | [View Reception settings](/client/settings/reception) |

## 1. Module Summary

### The story in one minute

Rohan Mehta wants every staff member to use two-factor sign-in and to be locked out after 15 minutes idle. He opens the organization drawer and finds the **Security** tab. Five cards are there. He switches on the two-factor policy and keeps the 3-day grace period. He picks a 15 minute timeout and a minimum password length of 12. He saves the drawer. The toast says success. He reopens the drawer and the policies are back to their defaults. Nobody was ever asked for a code, and no screen locks after idle. In a member drawer he changes a password with any current password. It is accepted.

### What is real and what is not

- **Real in the prototype:** the screens themselves and their controls.
- **Simulated:** every policy and every member setting. They change local screen state. Saving writes only profile fields. The member password check accepts any non-empty current password.
- **Not built:** saving and enforcing policies, an IP allowlist, an idle lock with password re-prompt, a 5 minute option and a standalone Security page.

### Journey position

```
Organization drawer ─▶ Security tab ─▶ Toggle policy ─▶ Save ─▶ (not stored, not enforced)
Team member drawer ─▶ Security tab ─▶ Password, 2FA, sessions, idle timeout (local state)
```

## 2. Feature Requests

### F-1: Organization security policies

#### 1. What it does
Rohan opens an organization and its **Security** tab. Five accordion cards offer spam-call protection, a two-factor policy, an inactivity timeout and password rules. He sets values and presses Save. The values do not survive.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Two-factor policy | Toggle, select | Enforce toggle and a grace period in days (default 3) | ◐ Simulated | Not saved and not read at login (G10-E-12). Decision needed: D-45 |
| F-1.2: Inactivity timeout | Select, switch | 15 min, 30 min, 1 h, 4 h or 8 h, with a lock-on-idle switch | ◐ Simulated | No listener acts on it (G10-E-12). Decision needed: D-45 |
| F-1.3: Password complexity | Select, switches | Minimum length 8 to 16, special characters, numbers | ◐ Simulated | Applies to no password field (G10-E-12) |
| F-1.4: Spam-call protection | Controls | Robo-call shielding with sensitivity, auto-block spam, blocked-numbers list | ◐ Simulated | Screen state only (G10-E-12) |
| F-1.5: Where to find it | State | `/settings/security` lands on Organization and no menu item exists | ◐ Simulated | (G10-E-14). Decision needed: D-45 |
| F-1.6: Policies saved and applied to every member | Rule | Described in the earlier PRD | ○ Not built | Drawer Save writes only profile fields (G10-E-12). Decision needed: D-45 |
| F-1.7: 5 minute timeout option | Option | The earlier PRD offered 5, 15, 30 and 60 minutes | ○ Not built | Neither screen offers 5 minutes (G10-I-31) |
| F-1.8: Auto-lock after idle with password re-prompt | Rule | Described in the earlier PRD | ○ Not built | Decision needed: D-45 |
| F-1.9: IP address allowlist | Textarea | Described in the earlier PRD | ○ Not built | No field exists |

#### 3. Worked example
Rohan sets the policy.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants two-factor for all staff | Turns on the policy, saves the drawer | **A success toast shows. Reopening shows the old values** |
| 2 | Priya sits idle for an hour | Does nothing | **Nothing locks and no code is asked for** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When protecting patient health information, I want automatic locking and two-factor sign-in, so that unattended screens do not expose patient charts. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a policy changed in the drawer, **when** the drawer is saved, **then** a success message shows and the policy is not stored. |
| F-1-2 | **Given** any idle time, **then** no lock, sign-out or code prompt happens. |
| F-1-3 | **Given** the address `/settings/security`, **then** the Organization tab opens. |

### F-2: Member security

#### 1. What it does
In a member's drawer, the **Security** tab lets Rohan change a password, turn on two-factor with a method, see active sessions and set an idle timeout.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Change password | Form | Current password must be non-empty. New password needs 8 or more characters and a match | ◐ Simulated | No credential is checked (G10-E-13). Decision needed: D-45 |
| F-2.2: Two-factor method | Switch, select | Turns two-factor on and picks a method | ◐ Simulated | Local state (G10-E-13) |
| F-2.3: Active sessions | List | Lists devices with a sign-out-others action | ◐ Simulated | Local state, no real session exists (G10-E-13) |
| F-2.4: Idle timeout | Select | 15, 30, 60 or 240 minutes | ◐ Simulated | Differs from the organization card, which offers 15 min to 8 h (G10-I-31) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Priya forgot her password | Rohan types any text as current password and a new 12-character password | **The change is accepted** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When a member's access needs tightening, I want to reset their password and review sessions, so that the account stays safe. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** any non-empty current password, a new password of 8 or more characters and a matching confirmation, **then** the change is accepted. |
| F-2-2 | **Given** a two-factor, session or timeout change, **then** only screen state changes. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Organization security policies | F-1.1 – F-1.9 | ◐ / ○ | Controls exist but are not saved or enforced. |
| F-2 | Member security | F-2.1 – F-2.4 | ◐ Simulated | Password, two-factor, sessions and timeout are local state. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Protect patient information with locking and two-factor | F-1 |
| 2 | Practice Admin | Reset a password and review sessions | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| System Admin (the default role, read from browser storage) | Open the organization and member drawers and change every control | Nothing. Nothing is stored |
| Any other role | Sees Settings in the menu | Opening it. A click returns to the home page |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names no role. Decision needed: D-45.

## 5. Metrics and definitions

No metric is shown on the security screens.

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-45 | What is the staff authentication model, where do security policies live and how are they enforced, how is the current password verified, is idle lock required and does it lock or sign out? | F-1.1, F-1.2, F-1.5, F-1.6, F-1.8, F-2.1 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
