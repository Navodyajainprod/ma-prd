---
title: "Forms: Intake, Consent and Signature"
product: "companion"
module: "forms"
route: "/patient/forms"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | COMPANION |
| Module | FORMS |
| Route | `/patient/forms` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A forms list with **To complete** and **Completed** tabs, and a fill screen at `/patient/forms/:id` with required-field checks and an optional signature pad. |
| **Who uses it** | Patient. Meera Iyer shares forms from the clinic side. Nothing on `/patient` is protected (G12-E-01). |
| **Where you start it** | **Forms** in the portal drawer, the forms row on Today, or the Care Bot intake shortcut. |
| **Where the result goes** | A completed submission in the shared submissions store, shown on the client profile's Forms tab. |
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
| Client (Web Forms) | Form definitions and sharing | Form definitions come from the clinic's Web Forms. A form shared to a patient appears as pending, whatever channel was picked, though SMS, WhatsApp and email send nothing. | [View Web Forms](/client/web-forms) |
| Client (Clients) | Client profile | A completed submission is visible on the client profile. Answers do not update client fields. | [View Clients](/client/clients) |
| Companion | Today and Care Bot | The Today row and the bot's Medical Intake shortcut open this list. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Sarah Johnson opens **Forms**. Under **To complete** she finds an intake form that Meera Iyer shared and every default intake form. She taps one. Her name, email and phone are already filled in. So are a birth date of 09/14/1990 and "Blue Cross Blue Shield", which are not hers. She fixes them, leaves a required field empty and sees an inline message. She draws her signature, clears it and signs again. She submits. A toast confirms and she returns to the list. The form is now under **Completed**. She taps it and sees every answer and the signature. The same link still opens the form for editing.

### What is real and what is not

- **Real in the prototype:** the two tabs, the fill screen, required-field checks, the signature pad, submission to the client profile and the read-only review.
- **Simulated:** the prefilled birth date and insurer shown to every patient, the pending list (default intake forms for everyone), and a signature that is optional even on consent forms.
- **Not built:** autosave, progress bar, undo on the pad, a lock after submission, a vector signature in a PDF, a cryptographic timestamp, a confirmation card naming the doctor, and answers updating client fields.

### Journey position

```
Web Forms share ─▶ Forms (To complete) ─▶ Fill and sign ─▶ Submit ─▶ Completed + client profile
```

## 2. Feature Requests

### F-1: Form lists and review

#### 1. What it does
The list has **To complete** and **Completed** tabs. To complete holds forms the clinic sent plus every intake form not yet done. Completed holds Sarah's submissions. Tapping one opens a read-only view with each answer and the signature image.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: To complete tab | List | Pending submissions the clinic sent, plus every form of type intake not yet completed | ◐ Simulated | Every patient sees the default intake forms. Pending forms match by digits-only id (XM-07) |
| F-1.2: Form source | Rule | Reads a browser copy of the forms and falls back to a sample list | ◐ Simulated | (XM-07) |
| F-1.3: Completed tab | List | This patient's completed submissions with date | ● Works | |
| F-1.4: Review | Modal | Read-only answers and the signature image | ● Works | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Meera shares an intake form by SMS | Sarah opens **To complete** | **The form is there, though no SMS was sent** |
| 2 | A past consent | Opens **Completed** and taps it | **Answers and the signature show read-only** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Patient | After I submit a form, I want to see what I sent, so that I can check it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a pending submission or an uncompleted intake form, **then** it is listed under To complete. |
| F-1-2 | **Given** a completed submission of this patient, **when** tapped, **then** a read-only view shows answers and signature. |

### F-2: Fill, sign and submit

#### 1. What it does
The fill screen finds the form by number among the clinic's web forms. Name, email and phone come from the profile. Required fields show an inline message and a toast. The signature pad accepts a finger or mouse, with clear and re-sign. Submit completes the clinic's pending submission or adds a new one.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Form runner | Form | Single form found by number | ● Works | |
| F-2.2: Profile prefill | Rule | Name, email and phone from the profile | ● Works | |
| F-2.3: Invented prefill | Rule | Birth date 09/14/1990 and insurer "Blue Cross Blue Shield" for everyone | ◐ Simulated | Submitted as the patient's answers (G12-E-22) |
| F-2.4: Required-field check | State | Inline message and toast | ● Works | |
| F-2.5: Signature pad | Pad | Draw, clear and re-sign | ● Works | No undo |
| F-2.6: Signature optional | Rule | Submit works with no signature, even on consent forms | ◐ Simulated | (G12-E-23). Decision needed: D-147 |
| F-2.7: Submit | Action | Completes the pending submission or adds a completed one with answers, signature image and "Signed At" text. Toast, then back to the list | ● Works | "Signed At" is local time text |
| F-2.8: Sent to the client record | Hand-off | Shown on the client profile's Forms tab | ● Works | Answers do not update client fields. Decision needed: D-23 |
| F-2.9: Lock after submission | Rule | Submitted form cannot be edited | ○ Not built | The link still opens and can be submitted again (G12-E-23) |
| F-2.10: Autosave and progress bar | Feature | Drafts and a progress indicator | ○ Not built | Decision needed: D-147 |
| F-2.11: Undo, vector signature in PDF, cryptographic timestamp | Feature | Described in the earlier PRD | ○ Not built | Decision needed: D-147 |
| F-2.12: Confirmation card naming the doctor | Notice | "Your intake has been received by Dr. Jenkins" | ○ Not built | A toast only |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Intake form opens | Reviews the fields | **Birth date and insurer are already filled with someone else's values** |
| 2 | She signs and submits | Presses submit | **The form moves to Completed and shows on her client profile** |
| 3 | Later | Opens the same link | **The form opens again and can be resubmitted** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient | Before I arrive, I want to fill and sign forms on my phone, so that I skip the clipboard. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a required field is empty, **when** the user submits, **then** an inline message and a toast show and nothing is saved. |
| F-2-2 | **Given** any patient, **when** a form opens, **then** birth date and insurer are prefilled with fixed values. |
| F-2-3 | **Given** a consent form with no signature, **when** submitted, **then** it is accepted. |
| F-2-4 | **Given** a completed form, **when** its link is opened, **then** it can be submitted again. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Form lists and review | F-1.1 – F-1.4 | ◐ / ● | Tabs and review work; every patient gets default forms. |
| F-2 | Fill, sign and submit | F-2.1 – F-2.12 | ● / ◐ / ○ | Submission works; fake prefill, optional signature, no lock. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Patient | See what I submitted | F-1 |
| 2 | Patient | Fill and sign forms on my phone | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Anyone with the link | Fill and submit forms for any patient by changing the path or `?clientId=` | Nothing |
| Clinic staff | Share forms and read submissions on the client profile | Nothing on this page |

The earlier PRD named the patient only. Decision needed: D-46.

## 5. Metrics and definitions

No metric is shown on `/patient/forms`.

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Patient portal with Appointments and Invoices | Staff shares a form | A pending form appears whatever channel was picked. Every patient also sees default intake forms. |
| | Patient submits a form | Shown on the client profile Forms tab. Answers do not update client fields. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-23 | Do portal form answers stay a submission record or update client fields? | F-2.8 |
| D-46 | What is the patient authentication model? | Roles |
| D-147 | Autosave, mandatory signature, lock, timestamp meaning, and consent in the stage drawer or Forms? | F-2.6, F-2.10, F-2.11 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
