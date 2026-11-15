---
title: "AI Voices, LLM Model Bindings & Speech Profiles"
product: "client"
module: "settings"
channel: "voices"
route: "/settings/voices"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS: AI VOICES / MODELS |
| Route | `/settings/voices` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **AI Voices / Models** tab of Client Settings. It has two modes, **Models** and **Voices**. Each lists the items the platform admin has published. The workspace switches each one on or off. |
| **Who uses it** | Practice Admin (decides which models and voices the clinic may use). Only the SystemAdmin role passes the Settings guard. |
| **Where you start it** | **Settings**, then **AI Voices / Models** in the sidebar (`/settings/voices`). The old address `voice-config` opens the same tab. |
| **Where the result goes** | A browser store read by the Process Automations pickers. Switching an item off hides it there. Nothing else reads it. |
| **How real is it** | 0 features work, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | AI Voices and Models catalogue | Only items the admin has switched on appear in the two modes. The admin and this tab read and write the same browser store. | [View Admin AI Voices & Models](/admin/ai-voices-models) |
| Client (Automation) | Process Automations pickers | A model or voice switched off here is not offered in the automation pickers. The toast says an item switched on becomes "default" there. | [View Automation](/client/automation) |
| AI Receptionist | Kiosk avatar voice | Not connected. The only voice list that names its own voices belongs to an unreachable legacy page. | [View Kiosk Shell](/ai-receptionist/avatar/kiosk-shell) |
| Client (Call Logs) | Phone agent voice | Not connected in what the analysis covers. No setting here reaches a call. | [View Call Logs](/client/call-logs) |

## 1. Module Summary

### The story in one minute

Rohan Mehta, the Practice Admin, opens **Settings** and chooses **AI Voices / Models**. The page opens on **Models**. He sees cards for the models the platform admin has published, each with a provider and a context window. He types "claude" in the search box and one card remains. He leaves it on and switches off a model he does not want his team to pick. A toast confirms and the change is saved at once. He switches to **Voices** and filters by **Gender**, **Accent**, **Language** and **Tone**. He presses play on a warm Indian-English voice. He hears a short greeting, but it comes from his browser's own speech engine and not from the vendor voice. He switches off two voices he does not like. Later, in Process Automations, those two are no longer offered.

### What is real and what is not

- **Real in the prototype:** the two modes, the list of admin-published items, search and filters, the per-item switch that saves at once, and the second level of availability (admin on, then workspace on).
- **Simulated:** the voice preview, which uses the browser's built-in speech with a fixed rate (G10-E-28). The context window shown on a model card is a fixed value.
- **Not built:** a single active model drop-down, a temperature slider, a mandatory emergency guardrail prompt, a speech-rate slider, and any link from a chosen voice to the phone greeting or the kiosk avatar.

### Journey position

```
Admin publishes ─▶ Settings: AI Voices / Models (workspace on/off) ─▶ Process Automations pickers
```

## 2. Feature Requests

### F-1: Choose the models the workspace may use

#### 1. What it does
Rohan opens the **Models** mode. Cards show every model the admin has activated. Each card has the model name, the provider, the context window and a switch. Search, a **Provider** filter and a **Status** filter narrow the list. Switching a card off hides that model from Process Automations. Several models can be on at the same time.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Model cards | Cards | One card per model the admin has activated. Name, provider and context window | ◐ Simulated | The context window is a fixed value, not read from the vendor (G13-AI-13). Hardcoded, formula undefined |
| F-1.2: Search and filters | Search, selects | Search covers name, provider and description. **Provider**: Google, OpenAI, Anthropic, DeepSeek, Meta. **Status**: Active, Inactive. A **Reset** button clears them | ● Works | **Active** means switched on in this workspace |
| F-1.3: Workspace switch | Switch | Turns a model on or off for this workspace and saves at once. Toast "<model> activated (now default in Process Automations)" or "<model> deactivated (disabled in Process Automations)" | ● Works | Several can be on. Decision needed: D-134 |
| F-1.4: Hidden when the admin switches it off | Rule | A model the admin has deactivated does not appear here at all | ● Works | |
| F-1.5: Nothing enabled | Rule | If no model is enabled in both places, consumers still get one: the admin-active models, or the first model in the list | ● Works | Decision needed: D-134 |
| F-1.6: Empty search | State | "No AI models found matching your search." | ● Works | |
| F-1.7: Single model drop-down (GPT-4o, Claude 3.5, Gemini 1.5) | Select | Described in the earlier PRD | ○ Not built | The tab lists admin-published models with an on/off switch each. Decision needed: D-134 |
| F-1.8: Temperature slider, 0.0 to 1.0 | Slider | Described in the earlier PRD | ○ Not built | Decision needed: D-134 |
| F-1.9: Mandatory emergency guardrail prompt | Text | Earlier intent: a 911 redirect injected into every bot prompt that cannot be disabled | ○ Not built | Safety-relevant. No such prompt exists here. Decision needed: D-134 |

#### 3. Worked example
Rohan limits the models his team can pick.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Five models are listed | Types **claude** in the search box | **Only the matching card remains** |
| 2 | He wants one model off | Clears the search and switches that card off | **A toast says it is disabled in Process Automations and the Status filter now counts it as Inactive** |
| 3 | He looks for a temperature control | Scans the page | **There is none** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When my team builds automations, I want to switch off models we do not want to use, so that only approved models are offered. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the admin has deactivated a model, **when** Rohan opens Models, **then** the model is not listed. |
| F-1-2 | **Given** a listed model, **when** its switch is turned off, **then** the change is saved at once and a toast says it is disabled in Process Automations. |
| F-1-3 | **Given** more than one model is on, **then** all of them stay on. No single active model is enforced. |
| F-1-4 | **Given** the page, **then** it has no temperature slider and no guardrail prompt field. |

### F-2: Choose and preview voices

#### 1. What it does
Rohan switches to **Voices**. Cards show every voice the admin has activated with its gender, accent, language and tone. Filters for **Gender**, **Accent**, **Language** and **Tone** and a search box narrow the list. A play button reads a short greeting aloud. A switch turns the voice on or off for the workspace and saves at once.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Voice cards | Cards | One card per voice the admin has activated, from OpenAI, ElevenLabs and Deepgram. Name, gender, country and tags | ● Works | |
| F-2.2: Filters and search | Selects, search | **Gender**: Female, Male. **Accent**: American, British, Australian, Canadian, Irish, European, Latin American, Indian, East Asian. **Language**: English, Spanish, French, German, Japanese, Hindi, Portuguese. **Tone**: Professional, Formal, Friendly, Casual, Empathetic, Energetic | ● Works | |
| F-2.3: Preview | Button | Speaks a canned greeting with the browser's built-in speech engine. The pitch changes with gender. Pressing again stops it | ◐ Simulated | Not the vendor voice and not the speed chosen (G10-E-28). Decision needed: D-134 |
| F-2.4: Workspace switch | Switch | Turns a voice on or off for this workspace and saves at once. Toast "<voice> voice activated (now default in Process Automations)" or "<voice> voice deactivated (disabled in Process Automations)" | ● Works | |
| F-2.5: Nothing enabled | Rule | If no voice is enabled in both places, consumers get the full voice list | ● Works | Decision needed: D-134 |
| F-2.6: Empty result | State | "No voices found matching your search and filters." | ● Works | |
| F-2.7: Speech-rate slider, 0.8x to 1.4x or 1.5x | Slider | Described in the earlier PRD (the two figures disagreed) | ○ Not built | Decision needed: D-134 |
| F-2.8: Voice used by the phone greeting and the kiosk avatar | Link | Earlier intent: the chosen voice speaks on the phone line and at the kiosk | ○ Not built | No connection found in the analysis (unverified in code). The legacy My AI Receptionist page keeps its own voice list (G13-AI-15) |

#### 3. Worked example
Rohan picks a calm voice for the front desk.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Many voices are listed | Sets **Accent** to Indian and **Tone** to Empathetic | **The list narrows to matching voices** |
| 2 | He wants to hear one | Presses the play button on a card | **A short greeting plays in a browser voice. It is not the vendor voice** |
| 3 | He does not want it offered | Switches the card off | **A toast says it is disabled in Process Automations** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When choosing how our AI sounds, I want to filter and hear voices, so that I offer a warm, professional voice to patients. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the admin has deactivated a voice, **when** Rohan opens Voices, **then** the voice is not listed. |
| F-2-2 | **Given** the play button is pressed, **then** the browser speaks a canned greeting. No vendor audio is played. |
| F-2-3 | **Given** a voice switched off here, **then** it is not offered in Process Automations. |

### F-3: Where the choice comes from and where it goes

#### 1. What it does
The platform admin publishes models and voices in the admin console. Rohan's tab only filters that list. An item must be on at both levels to reach Process Automations. The tab is not protected by role beyond the Settings guard.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Two-level availability | Rule | The admin switch decides what is listed. The workspace switch decides what is offered. Both must be on | ● Works | G13-AI-10 |
| F-3.2: Shared store with Admin | Rule | The admin console and this tab write to the same browser store. A change in one shows in the other in the same browser | ◐ Simulated | There is no per-organisation separation. Decision needed: D-02 |
| F-3.3: Process Automations pickers | Hand-off | Models and voices switched off here are not offered when an automation is set up | ● Works | The toast wording "now default" is not backed by a default being set (unverified) |
| F-3.4: Failover, token usage meter, API keys, rate limits | Admin | Earlier admin intent for the catalogue | ○ Not built | Belongs to the admin page (G13-AI-02 to G13-AI-04) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Leo Martin, the Platform Admin, switches a voice off in Admin | Rohan opens Voices | **The voice is gone from his list** |
| 2 | Rohan switches off a voice that is still on in Admin | Opens an automation | **The voice is not offered** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When I retire a model or voice, I want every workspace to stop seeing it, so that nobody picks one we no longer support. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** an item is off in Admin, **then** it is not listed in any workspace tab, whatever the workspace switch says. |
| F-3-2 | **Given** an item is on in Admin and off in the workspace, **then** it is listed with its switch off and is not offered in automations. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Choose models | F-1.1 – F-1.9 | ● / ◐ / ○ | List, filters and switch work. No temperature, single-model choice or guardrail. |
| F-2 | Choose and preview voices | F-2.1 – F-2.8 | ● / ◐ / ○ | Cards, filters and switch work. Preview is a browser voice. |
| F-3 | Source and destination | F-3.1 – F-3.4 | ● / ◐ / ○ | Admin on plus workspace on. Shared store with Admin. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Switch off models the team should not use | F-1 |
| 2 | Practice Admin | Filter and hear voices before offering them | F-2 |
| 3 | Platform Admin | Retire a model or voice for every workspace | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| SystemAdmin | Open the tab, switch models and voices on or off, preview voices | Nothing. Items the admin has not published are never listed |
| Admin, Manager, Agent, Reception | See Settings in the menu | Opening it. A click sends them home with "Access restricted: Settings requires System Admin privileges." |

The role comes from browser storage and defaults to SystemAdmin, so every signed-in user is a SystemAdmin unless it is changed by hand. The earlier PRD named a Medical Director and a Practice Manager as the users. Decision needed: D-12.

## 5. Metrics and definitions

The tab shows no counts. The context window on a model card is a fixed value. **Hardcoded, formula undefined.** The admin page shows Active and total counts, which are plain counts (G13-AI-12).

## 6. Cross-module journeys this module appears in

The tab is not a step in the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-134 | Are model choice, temperature, emergency guardrail and speech rate client or admin settings, single or several active models, and what do tenants get when none is active? | F-1.3, F-1.5, F-1.7 – F-1.9, F-2.3, F-2.5, F-2.7 |
| D-02 | Is the PRD a prototype-only description, or must it state backend needs such as per-organisation separation? | F-3.2 |
| D-12 | Must roles block opening and changing AI Voices / Models, and where is the role matrix enforced? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
