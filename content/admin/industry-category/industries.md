---
title: "Vertical Clinical Blueprints & Practice Templates"
product: "admin"
module: "industry-category"
channel: "industries"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | INDUSTRY-CATEGORY |
| Channel | INDUSTRIES |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Vertical Industries tab manages specialized practice templates (e.g., Dental Practice, Dermatology Clinic, Mental Health Therapy, Pediatric Care). Each blueprint pre-configures specialized custom fields, intake forms, clinical processes, and terminology overrides.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Pre-Packaged Vertical Industry Blueprints
#### 1. What it does
Defines vertical practice profiles that bundle specialized modules, pre-built clinical workflows, and default intake questionnaires for instant practice onboarding.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Industry Blueprints Grid | Card Grid | Cards for Dental, Dermatology, Psychology, Physical Therapy, General Practice | Shows active tenant counts |
| F-1.2: Clinical Terminology Overrides | Dictionary | Configures specialty labels: 'Patient' vs 'Client', 'Dentist' vs 'Doctor', 'Exam' vs 'Session' | Overridden in client UI |
| F-1.3: Blueprint Module Preset Bundler | Toggles | Pre-selects active modules and workflows when a tenant is provisioned with this blueprint | Automates tenant setup |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dental practice signs up for MantraAssist | System assigns 'Dental Clinic' blueprint | **Workspace automatically opens with dental chart fields, tooth charting, and dental recall workflows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Onboarding Lead | When provisioning a new medical specialty clinic, I want pre-packaged blueprints, so that the clinic is fully configured out of the box. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Tenants provisioned with an industry blueprint inherit all pre-configured fields and terminology overrides. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Pre-Packaged Vertical Industry Blueprints | F-1.1, F-1.2, F-1.3 | Defines vertical practice profiles that bundle specialized modules, pre-built clinical workflows, and default intake questionnaires for instant practice onboarding. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Onboarding Lead | When provisioning a new medical specialty clinic, I want pre-packaged blueprints, so that the clinic is fully configured out of the box. | F-1 |
