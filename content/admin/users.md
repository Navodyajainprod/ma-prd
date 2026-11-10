---
title: "Platform Superadmin Directory & Enterprise SSO"
product: "admin"
module: "users"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | USERS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Platform Users module manages superadmin accounts, enterprise Single Sign-On (SSO) identity provider bindings (SAML 2.0 / Okta / Azure AD), and active administrative session revocation.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Superadmin Directory & Enterprise SAML / OIDC SSO
#### 1. What it does
Lists all administrative user accounts, their access tier, assigned tenants, MFA enrollment status, and configures enterprise SAML 2.0 / OIDC Single Sign-On identity providers.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Superadmin User Table | Data Table | Columns: Name, Email, Admin Level, MFA Enrolled, Last Login, Active Sessions | Searchable |
| F-1.2: Enterprise SSO Configuration Card | Config Card | Input fields for SAML Metadata URL, Entity ID, and X.509 Certificate | Supports Okta, Azure AD, Google SSO |
| F-1.3: Revoke All Sessions Button | Emergency Action | Immediately terminates all active JWT tokens and sessions for a compromised account | Forces password reset |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Security officer investigates compromised laptop | Locates admin account and clicks 'Revoke All Sessions' | **User is logged out of all active browsers immediately and MFA is reset** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Security Officer | When protecting platform access, I want enterprise SSO and instant session revocation, so that superadmin credentials cannot be compromised. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Clicking 'Revoke All Sessions' invalidates all active session tokens for the selected user immediately. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Superadmin Directory & Enterprise SAML / OIDC SSO | F-1.1, F-1.2, F-1.3 | Lists all administrative user accounts, their access tier, assigned tenants, MFA enrollment status, and configures enterprise SAML 2. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Security Officer | When protecting platform access, I want enterprise SSO and instant session revocation, so that superadmin credentials cannot be compromised. | F-1 |
