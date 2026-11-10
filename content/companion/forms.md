---
title: "Intake Forms, Medical History & Digital Signature"
product: "companion"
module: "forms"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | COMPANION |
| Module | FORMS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Forms module allows patients to complete clinical intake questionnaires on their phone before visiting the clinic: entering medical histories, reviewing consent documents, and signing with their fingertip on a digital signature pad.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Mobile Patient Intake Form & Touch Signature Pad
#### 1. What it does
Presents structured digital intake questionnaires with autosave, progress indicators, medical history checkboxes, and a touch-sensitive fingertip signature pad.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Digital Questionnaire Runner | Form UI | Clean single-column mobile form with progress bar and auto-save on field change | Saves incomplete drafts |
| F-1.2: Touchscreen Signature Pad | Canvas Component | Captures patient fingertip or stylus signature with clear and undo buttons | Embeds vector signature into PDF |
| F-1.3: Submission Confirmation Card | Success UI | Confirms completed intake and displays green checkmark: 'Your intake has been received by Dr. Jenkins' | Locks submitted form |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New patient completes registration at home | Fills allergy screening, signs consent pad with finger, and taps submit | **Form syncs to clinic EHR and eliminates waiting room paperwork** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | Before arriving at the clinic, I want to fill out medical forms on my couch, so that I don't have to fill out clipboards in the waiting room. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Submitted forms lock against subsequent edits and append a cryptographic signature timestamp. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Mobile Patient Intake Form & Touch Signature Pad | F-1.1, F-1.2, F-1.3 | Presents structured digital intake questionnaires with autosave, progress indicators, medical history checkboxes, and a touch-sensitive fingertip signature pad. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | Before arriving at the clinic, I want to fill out medical forms on my couch, so that I don't have to fill out clipboards in the waiting room. | F-1 |
