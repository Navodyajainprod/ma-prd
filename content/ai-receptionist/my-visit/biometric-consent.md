---
title: "Biometric Consent, Minor Safeguards & Revocation"
product: "ai-receptionist"
module: "my-visit"
channel: "biometric-consent"
route: "/reception/*"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-12"
last_updated: "2026-11-14"
---

| Product | AI RECEPTIONIST |
| Module | MY VISIT: BIOMETRIC PRIVACY AND CONSENT (`/reception/*`) |
| Route | `/reception/*` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-12 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The privacy rules around the kiosk camera: a greeting that never identifies anyone, a first-name gate before a face match shows anything, no face enrolment for under-18s, an opt-in step with a free Skip, and a staff card on the client profile to delete or withdraw face data. |
| **Who uses it** | Patient (at the kiosk, including a parent registering a child). Front-desk Staff (manage face data on the client profile). Practice Admin (would review audit history). |
| **Where you start it** | The kiosk home screen (greeting), **Start scanning** (check-in), the walk-in registration step **Register your face**, and the **Biometric Face Check-in** card on a client profile. |
| **Where the result goes** | A face record on the client, and audit entries that stay in the kiosk browser's own storage. |
| **How real is it** | 0 features work, 4 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Clients) | Biometric Face Check-in card | The client profile shows enrolled or not, with **Delete face data**, **Withdraw Consent** and **Enroll Face Check-in**. Quick Enroll saves a made-up face record with consent set to true. | [View Clients](/client/clients) |
| Client (Audit logs) | Consent audit trail | Not connected. Face enrolled, skipped and deleted events are saved in the kiosk browser's own storage, not in the clinic audit log. | [View Audit Logs](/client/settings/audit-logs) |
| Client (Security) | Clinic security standards | No link from the kiosk privacy rules to security settings exists in the prototype. | [View Security](/client/settings/security) |
| Client (Reception Settings) | Kiosk deployment | The kiosk's clinic settings come from Reception Settings. They hold no consent rules. | [View Reception Settings](/client/settings/reception) |
| Companion | Phone as the alternative | A patient who skips the face step still checks in by phone. Companion does not show or manage face consent. | [View Companion Today](/companion/today) |
| Admin | Role permissions | Not connected. No role limits who may enrol or delete face data. | [View Roles](/admin/roles) |

## 1. Module Summary

### The story in one minute

Sarah Johnson stops near the idle kiosk. Aria greets her but does not say her name. The camera only measures how close she stands. A small camera icon in the corner shows it is on. Later Sarah taps **Start scanning** to check in. The kiosk shows "Hi Sarah, is this you?" and nothing more until she taps **Yes, that's me**. A walk-in adult sees **Register your face** with a plain explanation and a **Skip for now** button that costs nothing. A child under 18 is never offered it. If Sarah later asks Meera Iyer to remove her face data, Meera opens Sarah's profile and presses **Delete face data**. The prototype does not match a real face at all, and the saved face is a set of plain numbers.

### What is real and what is not

- **Real in the prototype:** a greeting that never matches, the first-name gate, the under-18 exclusion, the opt-in text with a free Skip, the kiosk consent guard, and the staff Delete face data and Withdraw Consent buttons with a confirmation.
- **Simulated:** the face match and the 3-sample enrolment use fixed test values (G11-E-01, G11-E-02). Templates are plain number lists, not encrypted (G11-E-12). Audit events stay in the kiosk browser (G11-E-13). Staff Quick Enroll fabricates consent (G11-E-14).
- **Not built:** a persistent text notice "Camera active for greeting only", withdrawal of consent at the kiosk itself, and a clinic-wide audit trail.

### Journey position

```
Idle greeting (no match) ─▶ Start scanning ─▶ First-name gate ─▶ Opt-in / Skip ─▶ Staff: Delete face data
```

## 2. Feature Requests

### F-1: Greeting is separate from saved biometrics

#### 1. What it does
The idle home screen only checks how large a face appears. When someone stands close, Aria greets them. No match runs and no photo is saved. A scan runs only when a visitor taps **Start scanning** or chooses to register. The camera icon in the corner tells visitors the camera is on.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Greeting with no matching | Rule | The home screen measures face size only and never identifies anyone | ● Works | G11-I-144 |
| F-1.2: Camera notice | Indicator | A camera icon with a tooltip shows the camera is on | ◐ Simulated | The old PRD asked for a persistent text pill "Camera active for greeting only" (G11-I-145). Decision needed: D-35 |
| F-1.3: Stored template | Storage | Saves a numeric face template with a consent time, and no photos | ◐ Simulated | The template is a plain number list in browser storage, not encrypted (G11-E-12). No photos are saved. Decision needed: D-37 |
| F-1.4: Face match | Rule | Compares the scan with enrolled templates | ◐ Simulated | One fixed test value is sent and the mock matcher can return the first enrolled patient (G11-E-01) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah stops near the idle kiosk | Stands in view | **Aria greets her. No name, phone or appointment is shown** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I run a camera kiosk in the lobby, I want greeting kept separate from recognition, so that no one is silently identified. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the home screen, **then** no match runs and no template is saved, however long a visitor stands in view. |
| F-1-2 | **Given** a template is saved, **then** it is stored as plain numbers in browser storage with the consent time. |

### F-2: First-name gate and the under-18 rule

#### 1. What it does
After a face match the kiosk shows only "Hi <FirstName>, is this you?" with a match percentage. Sarah taps **Yes, that's me** or **Not me**. A walk-in whose typed age is under 18 never sees the face step. The review says "Not available (under 18)".

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: First-name gate | Screen | Shows only the first name and a match percentage until the visitor confirms | ● Works | G11-I-147. The match itself is a mock, so the name shown may not be the visitor's (G11-E-01) |
| F-2.2: Not me | Button | Clears the tentative match and returns to the scan start | ● Works | The old PRD sent the visitor to the phone keypad. Decision needed: D-129 |
| F-2.3: Under-18 exclusion | Rule | Hides the face step and the review shows "Not available (under 18)" | ● Works | G11-I-148. The check uses the typed age. Decision needed: D-36 |
| F-2.4: Duplicate-face warning | Rule | Flags a close template at 0.85 and "Yes, that's me" links the visitor to the existing record | ◐ Simulated | Enrolment samples are constants, so new patients are flagged as existing, and Yes needs no further check (G11-E-02, G11-E-08). Decision needed: D-40 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The kiosk offers "Hi Rohan, is this you?" to someone else | Taps **Not me** | **The match is cleared and no surname or phone was shown** |
| 2 | A parent registers a 14-year-old | Types age 14 | **No face step. The review says "Not available (under 18)"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | When I register a child under 18 at the kiosk, I want face capture prevented automatically, so that no child's face is stored. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a tentative match, **then** only the first name and match percentage show until Yes, that's me is tapped. |
| F-2-2 | **Given** a typed age under 18, **then** the face step is skipped and no template is stored. |
| F-2-3 | **Given** Not me, **then** the match is cleared and the scan start opens. |

### F-3: Opt-in, Skip for now and audit

#### 1. What it does
A walk-in adult sees **Biometric Privacy & Consent** with an explicit explanation. **Register my face** starts a three-sample capture. **Skip for now** moves on to Review with the same priority and nothing saved. The kiosk writes an audit entry for enrolled, skipped and deleted.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Opt-in text | Screen | Explains that a template is saved, no photos are kept and consent can be revoked | ● Works | G11-I-149 |
| F-3.2: Skip for now | Button | Continues to Review with nothing saved | ● Works | |
| F-3.3: Consent guard | Rule | The kiosk saves no template without consent | ● Works | Staff Quick Enroll bypasses it (G11-E-14) |
| F-3.4: Audit events | Log | Enrolled, skipped and deleted events with a time | ◐ Simulated | Saved only in the kiosk browser, not in the clinic audit log (G11-E-13). Decision needed: D-42 |
| F-3.5: Withdraw consent at the kiosk | Action | Described nowhere in the old PRD | ○ Not built | Only staff can withdraw. Decision needed: D-35 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah prefers the phone | Taps **Skip for now** | **Review opens. No face data is saved** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When I review privacy compliance, I want timestamped proof of opt-in and withdrawal, so that I can show consent history. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** Skip for now, **then** booking continues the same way and no template is saved. |
| F-3-2 | **Given** consent is granted or removed, **then** an audit entry is stored in the kiosk browser only. |

### F-4: Staff Biometric Face Check-in card

#### 1. What it does
On a client profile, Meera sees the **Biometric Face Check-in** card with the enrolled date or **Not enrolled**. **Delete face data** and **Withdraw Consent** each ask for confirmation, then remove the stored face data. **Enroll Face Check-in** is offered when the client is not enrolled.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Status | Badge | Shows "Enrolled on <date>" or "Not enrolled" | ◐ Simulated | One path shows a hard-coded date for clients enrolled only on the record (G11-E-14) |
| F-4.2: Delete face data | Action | Asks for confirmation, deletes the template and flips the card to Not enrolled | ● Works | G11-I-152 |
| F-4.3: Withdraw Consent | Action | Same deletion with its own confirmation | ● Works | Not in the old PRD (G11-I-154) |
| F-4.4: Enroll Face Check-in | Action | Saves a template from a dummy value with consent set to true | ◐ Simulated | Fabricates consent and data (G11-E-14). Decision needed: D-35 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah asks Meera to remove her face scan | Meera presses **Delete face data** and confirms | **The card shows Not enrolled and the template is removed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-desk Staff | When a patient asks me to remove their face data, I want a one-click deletion with confirmation, so that face check-in stops for them. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** Delete face data is confirmed, **then** the card shows Not enrolled and the template is removed. |
| F-4-2 | **Given** Enroll Face Check-in is pressed, **then** a template is saved from a dummy value with consent true. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Greeting separate from biometrics | F-1.1 – F-1.4 | ● / ◐ | Greeting never matches; match and storage are simulated. |
| F-2 | First-name gate and under-18 rule | F-2.1 – F-2.4 | ● / ◐ | Gate and minor rule work; duplicate guard is unsound. |
| F-3 | Opt-in, Skip and audit | F-3.1 – F-3.5 | ● / ◐ / ○ | Opt-in and Skip work; audit stays in the kiosk; no kiosk withdrawal. |
| F-4 | Staff face card | F-4.1 – F-4.4 | ● / ◐ | Delete and Withdraw work; Quick Enroll fabricates consent. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Keep greeting separate from recognition | F-1 |
| 2 | Patient | Prevent face capture for children under 18 | F-2 |
| 3 | Practice Admin | Keep timestamped proof of consent and withdrawal | F-3 |
| 4 | Front-desk Staff | Remove a patient's face data in one click | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any visitor at the kiosk | Be greeted, scan, opt in or skip | Nothing. The kiosk has no sign-in |
| Front-desk Staff (Meera) | Delete, withdraw and quick-enrol face data on the client profile | Nothing. Any signed-in user can |

The old PRD named staff and patients but set no role rules for deleting or enrolling. Decision needed: D-35.

## 5. Metrics and definitions

The module shows no metric. The only figures are the face match percentage and the 0.85 duplicate threshold. Both come from the mock matcher, not a real engine. **Hardcoded, formula undefined.**

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys. The kiosk check-in journey uses face matching, described on the Check-In pages.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-35 | How are biometric consent and withdrawal handled: staff capture, kiosk withdrawal, a persistent camera notice? | F-1.2, F-3.5, F-4.4 |
| D-36 | Is a typed age enough to exclude minors from biometrics? | F-2.3 |
| D-37 | What protection at rest and retention period apply to face templates? | F-1.3 |
| D-40 | What second check applies to a duplicate-face warning? | F-2.4 |
| D-42 | Which kiosk biometric events must be audited, and where? | F-3.4 |
| D-129 | Where should Not me lead? | F-2.2 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-12 | First version (generated stub). |
