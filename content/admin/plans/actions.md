---
title: "Credit Actions Master & Consumption Deduction Rules"
product: "admin"
module: "plans"
channel: "actions"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | PLANS |
| Channel | ACTIONS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Credit Actions tab manages the rate at which system activities deduct wallet credits: 1 minute of AI voice conversation, 1 SMS carrier segment, 1 minute of AI Scribe consultation transcription, or 1 LLM query execution.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Credit Consumption Deduction Rules Registry
#### 1. What it does
Defines the exact credit cost deducted per unit of platform automation: AI Scribe, WhatsApp Conversation, SMS Text, Phone Call Minute, and LLM Token.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Credit Actions Table | Data Table | Columns: Action Key, Action Name, Consumption Unit, Credits Deducted, Description | e.g. 'scribe_minute = 3 credits' |
| F-1.2: Edit Credit Deduction Modal | Modal | Adjusts credit deduction formula per unit with effective start date | Audited change |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin updates AI Scribe cost | Sets 1 minute of audio transcription = 3 credits | **A 10-minute doctor consultation deducts 30 credits from practice wallet** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Operations | When operational costs change, I want to adjust credit deduction rates, so that platform margins remain sustainable. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | System activities deduct credits matching the active rates defined in the Credit Actions master table. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Credit Consumption Deduction Rules Registry | F-1.1, F-1.2 | Defines the exact credit cost deducted per unit of platform automation: AI Scribe, WhatsApp Conversation, SMS Text, Phone Call Minute, and LLM Token. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Operations | When operational costs change, I want to adjust credit deduction rates, so that platform margins remain sustainable. | F-1 |
