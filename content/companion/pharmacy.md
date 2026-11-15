---
title: "Pharmacy: Pickup and Prescriptions"
product: "companion"
module: "pharmacy"
route: "/patient/pharmacy"
status: "In Review"
build_status: "Simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | COMPANION |
| Module | PHARMACY |
| Route | `/patient/pharmacy` |
| Status | In Review |
| Build status | Simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A pickup banner, a fixed list of three medicines and a **Proceed to Billing** button. It is not in the portal drawer. |
| **Who uses it** | Patient. Dr. Anita Rao is the prescriber the earlier PRD had in mind, but no prescription data is read. Nothing on `/patient` is protected (G12-E-01). |
| **Where you start it** | The URL `/patient/pharmacy`. A "Move to Pharmacy" stage names this route, but nothing links to it in the screens checked. |
| **Where the result goes** | **Proceed to Billing** sets the patient's stage to "Pay Bill" and opens Billing. |
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
| Client (Processes) | Pharmacy and Pay Bill stages | The "Move to Pharmacy" stage names this page. **Proceed to Billing** moves the patient to "Pay Bill". | [View Process Kanban](/client/processes/kanban) |
| Companion | Billing | The next step after pharmacy. | [View Companion Billing](/companion/billing) |
| Client (Scribe) | Prescription | Not connected. The medicines shown are fixed and do not come from a Scribe prescription or any clinic record. | [View Scribe](/client/scribe) |

## 1. Module Summary

### The story in one minute

Sarah Johnson opens `/patient/pharmacy` after her visit. A banner says "Prescription Ready for Pickup at Pharmacy Counter 3", on the ground floor of the East Clinical Wing, with her patient id. Below it are three medicines: Amoxicillin, Paracetamol and Vitamin D3, each with a dose, a duration, a note and a price. Dr. Anita Rao prescribed none of them. Every patient sees the same list. Sarah presses **Proceed to Billing**. Her stage becomes "Pay Bill" and Billing opens.

### What is real and what is not

- **Real in the prototype:** the **Proceed to Billing** button and its stage change.
- **Simulated:** the banner and the whole medicine list. They are fixed text shown to every patient as their own prescription (G12-E-35).
- **Not built:** real prescriptions, the prescriber, refills left, a refill request, a medication schedule, pharmacy hours, phone and directions, and a drawer item.

### Journey position

```
Stage "Move to Pharmacy" ─▶ Pharmacy ─▶ Proceed to Billing ─▶ Stage "Pay Bill" ─▶ Billing
```

## 2. Feature Requests

### F-1: Pickup information and medicines

#### 1. What it does
Sarah sees where to collect medicines and a list of three items. Nothing on the page comes from her record.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Pickup banner | Banner | "Prescription Ready for Pickup at Pharmacy Counter 3 ... Ground Floor, East Clinical Wing" with the patient id | ◐ Simulated | Fixed text for every clinic and patient (G12-E-35). Decision needed: D-146 |
| F-1.2: Medicine list | List | Amoxicillin, Paracetamol and Vitamin D3 with dose, duration, note and price | ◐ Simulated | The same for every patient (G12-E-35). Decision needed: D-146 |
| F-1.3: The patient's own prescriptions | List | Prescribed items from the clinic | ○ Not built | No source module exists. Decision needed: D-146 |
| F-1.4: Empty state | State | A message when there is nothing to collect | ○ Not built | |
| F-1.5: Prescriber, frequency, refills left | Card | Described in the earlier PRD | ○ Not built | |
| F-1.6: Pharmacy hours, phone, directions | Card | Described in the earlier PRD | ○ Not built | Only the counter and wing text exist |
| F-1.7: Refill request | Button | One-tap request routed to the prescriber as a task | ○ Not built | No button exists |
| F-1.8: Medication schedule | List | Daily schedule | ○ Not built | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah has no prescription | Opens `/patient/pharmacy` | **The banner and three medicines still show** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | After my visit, I want to know where to collect my medicines, so that I go to the right counter. |
| F-1-J2 | Patient | When my medication runs low, I want to request a refill from my phone, so that my doctor can approve it without a visit. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** any patient, **when** the page opens, **then** the same banner and three medicines are shown. |
| F-1-2 | **Given** the page, **when** the patient looks for a refill control, **then** none exists. |

### F-2: Proceed to Billing

#### 1. What it does
Sarah presses **Proceed to Billing**. Her stage is set to "Pay Bill" and Billing opens.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Proceed to Billing | Button | Sets the stage to "Pay Bill" and opens Billing | ● Works | |
| F-2.2: Entry from the portal | Navigation | Reached from the pathway stage or by URL | ○ Not built | Not in the drawer. Nothing links to it in the screens checked (unverified). Decision needed: D-146 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah is done at the counter | Presses **Proceed to Billing** | **Her stage becomes Pay Bill and Billing opens** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | After collecting medicines, I want to move straight to my bill, so that I settle it before leaving. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** the pharmacy page, **when** Proceed to Billing is pressed, **then** the patient's stage is "Pay Bill" and Billing opens. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Pickup information and medicines | F-1.1 – F-1.8 | ◐ / ○ | Fixed banner and medicines; no refills. |
| F-2 | Proceed to Billing | F-2.1 – F-2.2 | ● / ○ | Button works; no drawer entry. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Know where to collect my medicines | F-1 |
| 2 | Patient | Request a refill from my phone | F-1 |
| 3 | Patient | Move straight to my bill | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Anyone with the link | Open the page and move any patient to "Pay Bill" by changing the path or `?clientId=` | Nothing |

The earlier PRD named the patient only. Decision needed: D-46.

## 5. Metrics and definitions

The page shows a price per medicine. **Hardcoded, formula undefined.**

## 6. Cross-module journeys this module appears in

This module is not a step in the four documented journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-46 | What is the patient authentication model? | Roles |
| D-146 | Where do prescriptions come from, should prices show, is pharmacy a drawer item, and how are refills routed? | F-1.1 – F-1.8, F-2.2 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
