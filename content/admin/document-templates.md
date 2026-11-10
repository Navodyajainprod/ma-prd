---
title: "Clinical Document Templates Master Registry"
product: "admin"
module: "document-templates"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | DOCUMENT-TEMPLATES |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Document Templates module maintains system-wide master clinical documents: Medical Referral Letters, Post-Op Discharge Summaries, Telehealth Informed Consent Forms, and HIPAA Privacy Disclosures with dynamic placeholder merge tags.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Master Clinical Document Template Builder
#### 1. What it does
Provides a rich-text document editor supporting dynamic placeholder tags (e.g. `{{patient.name}}`, `{{provider.npi}}`, `{{diagnosis.primary}}`, `{{date}}`) that auto-populate from patient records.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Master Templates Table | Data Table | Columns: Template Title, Category (Consent, Referral, Discharge), Version, Variables Count, Status | Searchable |
| F-1.2: Rich-Text Document Editor | Editor | Formatting toolbar: Bold, Italic, Tables, Headers, Page Breaks, and Placeholder Tag Inserter | Includes PDF export preview |
| F-1.3: Dynamic Variable Auto-Populator | Logic | Maps template tags directly to database attributes upon document generation | Validates unpopulated tags |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin creates 'Cardiology Referral Template' | Inserts tags `{{patient.name}}`, `{{referring_provider.name}}`, `{{reason_for_referral}}` | **Doctors in any tenant can generate personalized cardiology referral letters in one click** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinical Content Lead | When authoring clinical forms, I want standard merge tags, so that letters and summaries automatically pull verified patient and provider data. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Generating a document replaces all merge tags with corresponding patient and clinic values without manual typing. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Master Clinical Document Template Builder | F-1.1, F-1.2, F-1.3 | Provides a rich-text document editor supporting dynamic placeholder tags (e. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinical Content Lead | When authoring clinical forms, I want standard merge tags, so that letters and summaries automatically pull verified patient and provider data. | F-1 |
