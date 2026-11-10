---
title: "Team Members, Role Assignment & Practitioner NPI Registry"
product: "client"
module: "settings"
channel: "team"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SETTINGS |
| Channel | TEAM |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Team & Roles tab provides staff roster management: inviting providers via email, assigning role-based permissions (Admin, Doctor, Nurse, Coordinator, Billing), verifying practitioner NPI numbers, and configuring granular access controls.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Staff Roster Directory & Email Invitation Flow
#### 1. What it does
Lists all practice team members with their avatar, email, assigned role, department, and active status. Administrators can dispatch email invitations with one-click role assignment.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Invite Team Member Modal | Modal | Captures First Name, Last Name, Email, and Role (Admin, Doctor, Nurse, Coordinator, Billing) | Dispatches secure token invite link |
| F-1.2: Status Tag & Resend Invite | UI Actions | Displays 'Active' or 'Pending Invite' status; provides one-click 'Resend Invite' button | Invite expires after 7 days |
| F-1.3: Active Status Toggle | Switch | Instantly deactivates former employee accounts without deleting historical encounter logs | Revokes active session tokens |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin invites a new clinical coordinator | Enters 'ananya.reddy@clinic.com' and assigns 'Coordinator' role | **Ananya receives email invite and logs in to set password** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Administrator | When hiring staff, I want to send role-based email invites, so that new employees receive immediate access to their designated workspace. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given an invited team member, clicking 'Resend Invite' re-dispatches the onboarding email with a fresh security token. |

### F-2: Practitioner NPI & State Medical License Registry
#### 1. What it does
Captures and validates clinician credentials: 10-digit National Provider Identifier (NPI), state medical licensing numbers, and taxonomy codes required for insurance claim submissions.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: 10-Digit NPI Field | Text Input | Stores clinician NPI number with format validation | Auto-merges into CMS-1500 claims |
| F-2.2: State License Number | Text Input | Stores state license ID and expiration date with renewal reminder alerts | Warns 30 days before expiration |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor enters credential profile | Fills NPI '1234567890' and State License 'MD-98765' | **Credentials automatically populate into electronic insurance claims and prescription footers** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Physician | When onboarding, I want to store my NPI and medical license, so that clinical documentation and billing codes carry my verified credentials. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a doctor with recorded NPI, generated insurance claims include the doctor's NPI in Box 24J/33. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Staff Roster Directory & Email Invitation Flow | F-1.1, F-1.2, F-1.3 | Lists all practice team members with their avatar, email, assigned role, department, and active status. |
| F-2 | Practitioner NPI & State Medical License Registry | F-2.1, F-2.2 | Captures and validates clinician credentials: 10-digit National Provider Identifier (NPI), state medical licensing numbers, and taxonomy codes required for insurance claim submissions. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Administrator | When hiring staff, I want to send role-based email invites, so that new employees receive immediate access to their designated workspace. | F-1 |
| 2 | Physician | When onboarding, I want to store my NPI and medical license, so that clinical documentation and billing codes carry my verified credentials. | F-2 |
