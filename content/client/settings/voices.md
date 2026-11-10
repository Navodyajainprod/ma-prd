---
title: "AI Voices, LLM Model Bindings & Speech Profiles"
product: "client"
module: "settings"
channel: "voices"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SETTINGS |
| Channel | VOICES |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The AI Voices & Models tab configures the generative AI parameters used by MantraAssist: LLM model selection (GPT-4o, Claude 3.5, Gemini 1.5 Pro), temperature, system prompt guardrails, and synthetic speech synthesis voice profiles via ElevenLabs and OpenAI TTS.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: LLM Model Binding & Clinical Safety Guardrails
#### 1. What it does
Allows administrators to select which AI models power their clinic's automated triage responders and AI Scribe, configure creativity temperature (0.0 to 1.0), and inject required clinical disclaimers.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Model Provider Selector | Dropdown | Selects active model: GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro | Default is GPT-4o |
| F-1.2: Temperature Slider | Slider Control | Adjusts response determinism from 0.0 (strictly clinical) to 1.0 (conversational) | Recommended 0.2 for medical triage |
| F-1.3: Emergency Guardrail Prompt | Textarea | Injects mandatory 911 / emergency redirect instructions into every bot prompt | Cannot be disabled |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin configures bot temperature | Sets slider to 0.2 and enters clinic disclaimer | **AI responder adheres strictly to clinical protocols with deterministic responses** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Medical Director | When deploying AI triage, I want low temperature and mandatory emergency guardrails, so that patient safety is strictly maintained. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given an emergency triage keyword (e.g. chest pain), the AI responder immediately returns the mandatory emergency directive. |

### F-2: Synthetic Voice Selection & Speech Speed Preview
#### 1. What it does
Configures the synthetic voice used by telephony IVR and kiosk avatar: voice identity (Aria, Roger, Sarah), speech rate multiplier (0.8x to 1.5x), and live audio sample preview.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Voice Profile Dropdown | Dropdown | Selects ElevenLabs / OpenAI voice profile with accent and gender tags | Includes preview play button |
| F-2.2: Speech Rate Slider | Slider Control | Adjusts speech speed from 0.8x to 1.4x | Default is 1.0x |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin tests voice profile | Selects 'Aria (Female, Warm Clinical)' and clicks play sample | **Sample audio plays in browser; admin confirms voice for clinic reception kiosk** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When configuring our phone greeting, I want a warm, professional voice, so that patients feel comfortable when calling the clinic. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Clicking the play sample button streams the synthetic voice preview audio with current speed settings. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | LLM Model Binding & Clinical Safety Guardrails | F-1.1, F-1.2, F-1.3 | Allows administrators to select which AI models power their clinic's automated triage responders and AI Scribe, configure creativity temperature (0. |
| F-2 | Synthetic Voice Selection & Speech Speed Preview | F-2.1, F-2.2 | Configures the synthetic voice used by telephony IVR and kiosk avatar: voice identity (Aria, Roger, Sarah), speech rate multiplier (0. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Medical Director | When deploying AI triage, I want low temperature and mandatory emergency guardrails, so that patient safety is strictly maintained. | F-1 |
| 2 | Practice Manager | When configuring our phone greeting, I want a warm, professional voice, so that patients feel comfortable when calling the clinic. | F-2 |
