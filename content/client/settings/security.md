---
title: "Security, Two-Factor Authentication & Session Timeout"
product: "client"
module: "settings"
channel: "security"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SETTINGS |
| Channel | SECURITY |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Security & MFA tab configures practice authentication policies: mandatory Two-Factor Authentication (2FA) enforcement, inactivity session auto-lock timers, and IP address allowlisting.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Two-Factor Authentication (2FA) Enforcement & Session Timeout
#### 1. What it does
Enforces mandatory TOTP 2FA for all staff members logging in to the practice tenant and configures the automatic session lock idle timeout (e.g. 15 minutes of inactivity).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Enforce 2FA Toggle | Toggle Switch | Mandates that all staff set up authenticator app 2FA upon their next login | Cannot be bypassed by non-admins |
| F-1.2: Inactivity Timeout Selector | Dropdown | Configures session lock timeout: 5m, 15m, 30m, 60m | Recommended 15m for HIPAA |
| F-1.3: IP Address Allowlist | Textarea | Restricts login to specified clinic static IP addresses or CIDR subnets | Blocks unauthorized remote logins |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Practice enforces 15m auto-lock | Doctor steps away from workstation for 16 minutes | **Screen locks automatically with password re-prompt to protect patient privacy** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Administrator | When protecting patient health information, I want automatic workstation locking, so that unattended screens do not expose patient charts. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given 15 minutes of zero keyboard/mouse activity, the application locks and requires password re-entry. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Two-Factor Authentication (2FA) Enforcement & Session Timeout | F-1.1, F-1.2, F-1.3 | Enforces mandatory TOTP 2FA for all staff members logging in to the practice tenant and configures the automatic session lock idle timeout (e. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Administrator | When protecting patient health information, I want automatic workstation locking, so that unattended screens do not expose patient charts. | F-1 |
