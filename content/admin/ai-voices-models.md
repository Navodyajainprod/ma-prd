---
title: "Global AI Voice & Model Registry"
product: "admin"
module: "ai-voices-models"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ADMIN |
| Module | AI-VOICES-MODELS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The AI Voice & Models module manages platform-wide generative AI infrastructure: registering LLM endpoints (OpenAI, Anthropic, Gemini, DeepSeek), tracking API token consumption, and configuring global ElevenLabs synthetic voice libraries.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Global LLM Model Registry & Endpoint Bindings
#### 1. What it does
Maintains master API key configurations, base URLs, rate limits, and fallback routing for foundation model providers (OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Model Endpoints Table | Data Table | Columns: Provider, Model ID, Status, Average Latency, Fallback Order, Error Rate | Real-time health status |
| F-1.2: Automated Failover Router | Logic | Automatically routes AI requests to secondary model if primary provider encounters HTTP 500 or timeout | Zero downtime for clinic bots |
| F-1.3: Global Token Usage Meter | Analytics Card | Tracks total input/output tokens consumed across all tenants today | Cost forecasting tracker |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | OpenAI experiences brief API latency spike | Failover router detects 3s timeout and switches requests to Claude 3.5 Sonnet | **Patient AI triage responses continue without interruption** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Infrastructure Lead | When managing AI infrastructure, I want automated multi-provider failover, so that clinic AI responders never go offline during third-party outages. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | AI requests failing on primary endpoint automatically retry against the secondary fallback model within 2 seconds. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Global LLM Model Registry & Endpoint Bindings | F-1.1, F-1.2, F-1.3 | Maintains master API key configurations, base URLs, rate limits, and fallback routing for foundation model providers (OpenAI GPT-4o, Anthropic Claude 3. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Infrastructure Lead | When managing AI infrastructure, I want automated multi-provider failover, so that clinic AI responders never go offline during third-party outages. | F-1 |
