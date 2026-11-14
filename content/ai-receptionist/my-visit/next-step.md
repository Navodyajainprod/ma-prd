---
title: "Process Stage & Personalized Next-Step Guidance"
product: "ai-receptionist"
module: "my-visit"
channel: "next-step"
route: "/reception/my-visit"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | MY VISIT: NEXT-STEP GUIDANCE (`/reception/my-visit`) |
| Route | `/reception/my-visit` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A kiosk card that shows the patient's next stage in a clinic process, with a **View Details** sheet of guidance text. It has no address of its own: it opens by voice or from the check-in flow. |
| **Who uses it** | Patient (at the lobby kiosk). Care Coordinator (writes the stage titles, descriptions and guidance in Process settings). |
| **Where you start it** | Asking Aria "What's next?" or "My status", then confirming by face or phone. |
| **Where the result goes** | Nowhere. It only displays. Moving a patient's card on the Process board changes what it shows. |
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
| Client (Process board) | Stage position | The card shows the patient's next enabled stage in a process connected to AI Receptionist. If the patient is in no such process, the kiosk uses the first AI-connected process. | [View Process Board](/client/processes/kanban) |
| Client (Process list) | Stage card text and guidance | A coordinator writes the card title, description and guidance sheet for each stage. The kiosk shows them. | [View Process List](/client/processes/list) |
| Client (Reception Settings) | Connection to the kiosk | A process is shown only when it is connected to AI Receptionist. | [View Reception Settings](/client/settings/reception) |
| Companion | Same instructions on the phone | Not connected. Companion Today does not read the kiosk's stage card. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson finishes intake and asks Aria, "What's next for me?" The kiosk asks her to confirm by phone. It then looks for a process connected to AI Receptionist and shows the next stage as a card. The card has the stage's color, a title, a short description and her name and client ID. Aria reads the title aloud. Sarah taps **View Details**. A guidance sheet opens that a coordinator wrote. Parts of it are filled in for her. But the doctor, time, room and invoice values in that sheet are fixed sample values, not hers. Meera Iyer, at the desk, controls which stages Sarah can see by moving her card on the Process board.

**Naming note:** the old PRD said "Clinic Coordinator" and "Practice Coordinator". The role used here is Care Coordinator.

### What is real and what is not

- **Real in the prototype:** the voice and touch trigger, the stage card with accent, title, description and voice readout, and the View Details sheet that shows the coordinator's guidance text.
- **Simulated:** the appointment and invoice values in the sheet are fixed samples (G11-E-32). If a patient is in no AI-connected process, the kiosk shows the first one. Hidden staff-only stages can still appear in two cases (G11-E-33).
- **Not built:** a "Step X of Y" label, blanking of unfilled markers, and safe display of the guidance text.

### Journey position

```
"What's next?" ─▶ Verify (face or phone) ─▶ Find process ─▶ Stage card ─▶ View Details
```

## 2. Feature Requests

### F-1: Ask "What's next?" and find the stage

#### 1. What it does
Sarah asks for her next step by voice, or opens the flow from check-in. After face or phone confirmation the kiosk finds a process connected to AI Receptionist and picks the next enabled stage. If she is in none, it uses the first AI-connected process. With several people on one phone number the kiosk picks the first one without asking.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Voice and touch trigger | Voice intent | "What's next?" and "My status" start the flow after verification | ● Works | G11-I-135 |
| F-1.2: AI-connected process lookup | Rule | Uses the patient's process that is connected to AI Receptionist | ◐ Simulated | Falls back to the first AI-connected process (G11-I-136, G11-E-33). Decision needed: D-126 |
| F-1.3: Household member | Rule | On a phone with several profiles, the first match is taken silently | ◐ Simulated | The picker is skipped (G11-E-07) |
| F-1.4: Verification | Rule | Face or phone confirmation before the card | ◐ Simulated | Phone code 1234 or 0000 works for any number, and the face match is a mock (G11-E-03, G11-E-01). Decision needed: D-41 |
| F-1.5: No process or no stage | State | A patient in no AI-connected process | ○ Not built | No dedicated message. Decision needed: D-126 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah has finished intake | Says "What's next for me?" and confirms by phone | **The stage card of her process opens** |
| 2 | Sarah's phone number is shared with her husband | Confirms by phone | **The first matching person's card opens. No picker is shown** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | Between intake, tests and follow-ups, I want to ask what is next, so that I see my current step without asking staff. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a verified patient, **when** they ask what is next, **then** the card of the next enabled stage in an AI-connected process is shown. |
| F-1-2 | **Given** the patient is in no AI-connected process, **then** the first AI-connected process is used. |
| F-1-3 | **Given** several profiles share the phone, **then** the first is chosen without a picker. |

### F-2: Stage summary card

#### 1. What it does
The card shows the stage's accent color, the card title (or the stage name), a description, and the patient's name and client ID. Aria reads the title and summary. **View Details** opens the sheet. Staff can turn a stage off for kiosk display. The filter applies when a visible next stage exists.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Card title and description | Card | Shows the stage's accent, title and description, with a voice readout | ● Works | G11-I-137 |
| F-2.2: Patient name and client ID | Display | Shown on the card in the public lobby | ◐ Simulated | Not masked (G11-E-34). Decision needed: D-39 |
| F-2.3: View Details button | Button | Opens the guidance sheet by tap or voice | ● Works | |
| F-2.4: Hide staff-only stages | Rule | Stages turned off for kiosk display are skipped | ◐ Simulated | If no visible next stage exists, the card falls back to the current or first stage, which may be staff-only (G11-E-33) |
| F-2.5: "Step X of Y" | Label | Described in the earlier PRD | ○ Not built | G11-I-138 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Meera moves Sarah from a hidden triage stage to a visible Vitals stage | Sarah asks what is next | **The Vitals card shows with her name and client ID** |
| 2 | No visible stage lies ahead | Sarah asks what is next | **The current or first stage is shown, even if it is staff-only** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When I design process stages, I want staff-only columns hidden from patients and clear card titles shown, so that the lobby screen never shows internal notes. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a visible next stage, **then** the card shows its title, description and a View Details button. |
| F-2-2 | **Given** no visible next stage, **then** the current or first stage is shown even if it is hidden from patients. |
| F-2-3 | **Given** the card, **then** the patient's name and client ID are visible on the lobby screen. |

### F-3: View Details guidance sheet

#### 1. What it does
**View Details** opens the guidance a coordinator wrote for that stage. The kiosk replaces markers such as the patient's name with values. For appointment and invoice markers it inserts fixed sample values. Other markers are left as typed. The text is shown as raw HTML.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Guidance sheet | Sheet | Shows the stage's formatted guidance | ● Works | |
| F-3.2: Patient markers | Merge | Fills the patient's own name, phone, email and client ID | ● Works | |
| F-3.3: Appointment and invoice markers | Merge | Fills doctor, time, room, invoice number and balance | ◐ Simulated | Fixed sample values such as "Dr. Rajesh Patel", "11:30 AM" and "$78.75", not the patient's (G11-E-32). Decision needed: D-39 |
| F-3.4: Unfilled markers | Rule | Described in the earlier PRD: blank when missing | ○ Not built | Unknown markers stay on screen as typed (G11-E-32) |
| F-3.5: Safe display | Rule | Guidance HTML is shown without cleaning | ◐ Simulated | A name typed at the kiosk can run script text on the screen (G11-E-09) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The Vitals sheet uses doctor and room markers | Sarah taps **View Details** | **Her name is right. The doctor, time and room are the same fixed sample values for every patient** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient | When I open View Details, I want steps for my own doctor, room, time and balance, so that I am not given generic text. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** View Details opens, **then** patient markers show the patient's own values. |
| F-3-2 | **Given** appointment or invoice markers, **then** fixed sample values are shown, not the patient's. |
| F-3-3 | **Given** a marker the kiosk does not know, **then** it stays on screen unchanged. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Ask what is next | F-1.1 – F-1.5 | ● / ◐ / ○ | Trigger works; process fallback and household pick are unsafe. |
| F-2 | Stage summary card | F-2.1 – F-2.5 | ● / ◐ / ○ | Card works; staff-only stage can leak; no Step X of Y. |
| F-3 | View Details sheet | F-3.1 – F-3.5 | ● / ◐ / ○ | Patient fields work; appointment and invoice values are samples. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | See my current step without asking staff | F-1 |
| 2 | Care Coordinator | Hide staff-only stages and show clear cards | F-2 |
| 3 | Patient | Read steps for my own visit | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor at the kiosk | Open Next Step after a phone code or a mock face match | Nothing real. The phone code works for any number |
| Care Coordinator | Write stage cards and guidance in Process settings | Nothing is checked |

The old PRD described a verified patient only. Decision needed: D-41.

## 5. Metrics and definitions

The screen shows no metric. The invoice balance in the guidance sheet is a fixed sample value. **Hardcoded, formula undefined.**

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys. It reads process data from Workflows and Process settings.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-126 | If a verified patient is in no AI-connected process, what should Next Step show? | F-1.2, F-1.5 |
| D-41 | What may a successful verification authorise and for how long? | F-1.4 |
| D-39 | Which details may appear on screen or be spoken in a public lobby? | F-2.2, F-3.3 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
