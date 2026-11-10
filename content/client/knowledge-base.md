---
title: "Clinic Knowledge Base & Protocol Repository"
product: "client"
module: "knowledge-base"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | KNOWLEDGE-BASE |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Knowledge Base module provides a structured clinical protocol and operational guideline repository. Staff can author medical SOPs, triage FAQs, and practice guides, and the AI bot references these articles for automated patient responses.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Medical Protocol Repository & Semantic Search
#### 1. What it does
Stores clinical guidelines and front desk FAQs categorized into folders. Features full-text and semantic keyword search to surface clinical protocols in seconds.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Category Folder Navigation | Sidebar Tree | Organizes articles into folders: Clinical Protocols, Front Desk FAQs, Insurance Policies | Collapsible folder hierarchy |
| F-1.2: Semantic Article Search | Search Input | Searches article titles and contents with keyword highlighting | Sub-second query response |
| F-1.3: Markdown Article Viewer | Reader View | Clean reader view supporting formatted text, tables, callout warnings, and embedded diagrams | Printable article view |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Medical assistant needs triage protocol for pediatric fever | Types 'fever triage' into Knowledge Base search | **Article 'Pediatric Fever Management Protocol' opens with temperature thresholds and triage steps** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Medical Assistant | When a patient presents with specific symptoms, I want quick access to approved clinic protocols, so that clinical care is safe and standardized. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Articles published in the Knowledge Base are indexed and retrievable via search instantly. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Medical Protocol Repository & Semantic Search | F-1.1, F-1.2, F-1.3 | Stores clinical guidelines and front desk FAQs categorized into folders. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Medical Assistant | When a patient presents with specific symptoms, I want quick access to approved clinic protocols, so that clinical care is safe and standardized. | F-1 |
