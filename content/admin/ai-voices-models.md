---
title: "AI Voices and Models: Global Availability Switchboard"
product: "admin"
module: "ai-voices-models"
route: "/admin/ai-voices-models"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | AI VOICES MODELS |
| Route | `/admin/ai-voices-models` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | Two card grids, **AI Models** and **AI Voices**, with an on/off switch per item, filters and a voice preview. It is a global switch for what tenants may use. It does not hold keys, URLs, rate limits or failover. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user who opens the URL can switch items. |
| **Where you start it** | **AI Voices & Models** under INTEGRATIONS in the admin sidebar (`/admin/ai-voices-models`, also `/admin/ai-voices` and `/admin/voice-config`). |
| **Where the result goes** | Client Settings AI Voices and Models and the process call and chat setup pickers offer only admin-active items. My AI Receptionist does not. |
| **How real is it** | 0 features work, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Settings) | AI Voices and Models | Client Settings shows only items the admin switched on. The tenant then enables its own from that list. | [View Voices](/client/settings/voices) |
| Client (Processes) | Call and chat setup pickers | The process call and chat setup drawers read the same stores. | [View Voices](/client/settings/voices) |
| AI Receptionist | My AI Receptionist | Not connected. It uses its own hardcoded voice and voice library and ignores admin activation (G13-E-38). | [View Reception](/client/settings/reception) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **AI Voices & Models**. The mode switch reads "AI Models" and "AI Voices", each with active and total counts. He filters voices by provider ElevenLabs and gender, and presses the play icon on one. The preview speaks in his browser's own voice, not the provider's. He likes it and switches it on. A toast says it is now available to client organizations. Dr. Anita Rao's clinic admin opens Client Settings and sees the new voice in the list. Leo switches a model off and a toast says it is hidden. Nothing asks him to confirm either switch, and nothing records who did it.

### What is real and what is not

- **Real in the prototype:** the model and voice cards, filters, the on/off switches saved at once, the active and total counts, and the effect on Client Settings and the process pickers.
- **Simulated:** the voice preview uses the browser's speech synthesis, not the provider's audio. Context window and latency are hardcoded.
- **Not built:** API key and base URL management, rate limits, automated failover, a token usage meter, bulk activate or deactivate buttons, create, edit and delete, and audit entries.

### Journey position

```
Switch model or voice on ─▶ Saved at once ─┬▶ Client Settings list (tenant enables its own)
                                            ├▶ Process call and chat pickers
                                            └▶ My AI Receptionist (not connected)
```

## 2. Feature Requests

### F-1: Switch models and voices on or off

#### 1. What it does
Leo switches between **AI Models** and **AI Voices**. Models show as cards with logo, name, provider and context window and a switch. Voices show a play icon, name and role, provider, language, accent, gender and tone and a switch. Switching saves at once and a toast says it is available to or hidden from client organizations.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Model cards | Card grid | Seven seeded models with a switch. Filters by provider, status and search | ● Works | |
| F-1.2: Voice cards | Card grid | 24 seeded voices from OpenAI, ElevenLabs and Cartesia. Filters by provider, gender, accent, language and search, plus Reset | ● Works | |
| F-1.3: On/off switch | Toggle | Saves at once with a toast. No confirmation | ● Works | Two levels: admin offers and tenant enables |
| F-1.4: Active and total counts | Labels | "AI Models (active/total)" and "AI Voices (active/total)" | ● Works | Computed |
| F-1.5: Context window | Label | Shown on model cards | ◐ Simulated | Hardcoded, formula undefined. Decision needed: D-134 |
| F-1.6: Latency | Data | Stored for each model but never shown | ◐ Simulated | Hardcoded, formula undefined. Decision needed: D-134 |
| F-1.7: Empty state | State | Shown when no card matches | ● Works | |
| F-1.8: Loading, error and permission states | State | None exist | ○ Not built | |
| F-1.9: Bulk activate or deactivate | Button | The logic exists but no button uses it | ○ Not built | (G13-E-39) |
| F-1.10: Add, edit, delete a model or voice | Action | No such control | ○ Not built | |
| F-1.11: Audit entry for a switch | Log | None written | ○ Not built | Decision needed: D-42 |

#### 3. Worked example
Leo offers a new voice to every clinic.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A voice should be offered | Switches it on | **A toast says it is available to client organizations** |
| 2 | He wants to hear it first | Presses the play icon | **The browser's own speech voice reads a sample, not the provider's audio** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When approving AI providers, I want to control which models and voices tenants can pick, so that clinics only use approved options. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a switch is turned on or off, **then** it is saved at once with a toast and no confirmation. |
| F-1-2 | **Given** a voice preview, **when** play is pressed, **then** browser speech synthesis is used, not provider audio. |
| F-1-3 | **Given** the page, **then** there is no control to bulk switch, to add or to delete. |

### F-2: Effect on tenants

#### 1. What it does
What Leo switches on becomes the list a clinic sees in Client Settings and in the process call and chat setup pickers. The tenant then enables its own items from that list.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Client Settings list | Hand-off | Shows only admin-active models and voices | ● Works | |
| F-2.2: Process pickers | Hand-off | Call and chat setup use the same stores | ● Works | |
| F-2.3: Fallback with nothing active | Rule | With no active model the first model is used. With no active voice all voices are returned | ● Works | Decision needed: D-134 |
| F-2.4: My AI Receptionist | Hand-off | Uses its own hardcoded voice and library | ○ Not built | Admin activation is ignored (G13-E-38) |
| F-2.5: Master API keys, base URLs, rate limits | Config | Described in the earlier PRD | ○ Not built | No such fields exist. Decision needed: D-02 |
| F-2.6: Automated failover and token usage meter | Logic | Described in the earlier PRD | ○ Not built | Nothing like it exists |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Leo switches every voice off | A clinic admin opens Client Settings | **All voices are shown, because the fallback returns every voice when none is active** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | After I switch an item, I want tenants to see the change, so that approvals take effect without a release. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a voice is active, **then** it appears in Client Settings and the process pickers. |
| F-2-2 | **Given** no voice is active, **then** all voices are offered to tenants. |
| F-2-3 | **Given** a voice is switched off, **then** My AI Receptionist still uses its own list. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Switch models and voices | F-1.1 – F-1.11 | ● / ◐ / ○ | Switches work; preview and model facts are placeholders. |
| F-2 | Effect on tenants | F-2.1 – F-2.6 | ● / ○ | Client Settings and pickers follow; Receptionist does not. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | Control which models and voices tenants can pick | F-1 |
| 2 | Platform Admin | Have tenants see an approval at once | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/admin/ai-voices-models` and switch any model or voice | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

Only the admin sidebar hides the item from admin roles that cannot read the module. The earlier PRD named an infrastructure lead and set no access rule. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Active / total models and voices | Mode switch | Count of active items over all items |
| Context window | Model card | **Hardcoded, formula undefined** |
| Latency | Stored, not shown | **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys in the Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-02 | Is the PRD a prototype-only description, and are unbuilt features such as keys and failover kept as a marked roadmap? | F-2.5 |
| D-12 | Must permissions block direct URLs and actions on admin pages? | Roles table |
| D-42 | Which admin actions must be audited, including AI switches? | F-1.11 |
| D-134 | What do tenants get when no model or voice is active, and where do context window and latency come from? | F-1.5, F-1.6, F-2.3 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
