---
title: "Insurance Claims, EDI Billing & Clearinghouse"
product: "client"
module: "claims"
route: "/claims"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | CLAIMS |
| Route | `/claims` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A claims table with a clickable stage bar, a claim drawer (create and edit), a submit modal with a simulated clearinghouse, a clearinghouse status modal and a printable CMS-1500 form. |
| **Who uses it** | Billing Specialist (types, submits and tracks claims). No role is checked: any signed-in user can create and submit claims. |
| **Where you start it** | **Insurance & Claims** in the sidebar (`/claims`), then **Create Claim**. |
| **Where the result goes** | The claims table and the claim record only. Nothing reaches invoices, the appointment or the client. No file is sent to a payer. |
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
| Client (Invoices) | Invoice to claim | Not connected. The claim builder that would read invoices is not mounted on any page. An insurance payment on an invoice keeps payer and claim reference as free text and updates no claim (G7-C-31). | [View Invoices](/client/invoices) |
| Client (Scribe) | Diagnosis codes for claims | Not connected. The builder that would read the latest Scribe session (ICD-10 and provider) is not mounted. The live **Create Claim** button opens an empty form (G7-C-28, G3-X-06). | [View Scribe](/client/scribe) |
| Client (Appointments) | Appointment to claim | Not connected. The claim stores no appointment reference. Seeded claims carry appointment ids that are never shown. | [View Appointments](/client/appointments/list) |
| Client (Workflows) | Insurance workflow | The stages come from the insurance workflow process. The workflow gear opens it. A second "Claims Management" process exists and this page does not use it (G7-C-30). | [View Workflows](/client/workflows) |
| Client (Settings) | Provider NPI from Team | Not connected. The provider NPI is free text (G7-C-27). | [View Team Settings](/client/settings/team) |
| AI Receptionist | Kiosk ledger | The kiosk billing ledger does not include claims. | [View Kiosk Invoices](/ai-receptionist/billing/invoices) |

## 1. Module Summary

### The story in one minute

Daniel Brooks opens **Insurance & Claims** and sees five claims already in the table. He presses **Create Claim**. A drawer opens empty, with a new number, today's date and place of service "11 - Office". Nothing is filled from Sarah Johnson's appointment, invoice or consultation. Daniel types her name, the payer, the policy number, an ICD-10 code and a CPT code. He presses **Create Claim** in the drawer and the claim lands in Ready to Submit. He opens **Submit / View Status**. A checklist shows green ticks. He presses **Submit Electronically**, waits about a second, and the claim moves to Submitted with a tracking number. He then opens the CMS-1500 and prints it. The payer ID on the form reads PAY-001.

### What is real and what is not

- **Real in the prototype:** the claims table with search, presets, payer filter and export, the claim drawer, claim creation from typed values, the stage bar, the Submit modal choices and the printable CMS-1500 with JSON export.
- **Simulated:** the pre-flight checklist (always green), the electronic submission (always succeeds), the clearinghouse numbers and rejection text, the payer ID (always PAY-001), the Allowed Amount, the activity history and the patient email. Edits to an existing claim are not saved.
- **Not built:** a claim made from an appointment, invoice or Scribe session, a Kanban board on this page, real scrubbing, eligibility checks, an EDI 837 file, a delete action and role control.

### Journey position

```
Appointment ─▶ Scribe ─▶ Invoice ─ ✕ ─▶ Create Claim (typed) ─▶ Submit (simulated) ─▶ CMS-1500
```

## 2. Feature Requests

### F-1: Claims table and filters

#### 1. What it does
Daniel opens `/claims`. The table has Claim ID, Title (`<Patient>_Claim_<date>`), a clickable Stages bar, Client, Insurance Payer, Service Date and Billed Amount. Above it are the preset chips **All**, **Ready to Submit**, **Submitted & Review**, **Paid Claims** and **Drafts**, a payer filter, a search box and, when more than one insurance process exists, a process selector. A row menu holds **Edit Claim**, **Submit / View Status** and **View CMS-1500 Form**. The page shows a table only. It has no Kanban board.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Claims table | Table | Claim ID, Title, Stages, Client, Insurance Payer, Service Date, Billed Amount. Five seeded claims load on first visit | ● Works | G7-C-01 |
| F-1.2: Stage bar | Control | Click a stage to move the claim. Status is worked out from the stage name | ◐ Simulated | The table and the drawer use two different rules (G7-E-27). Decision needed: D-75 |
| F-1.3: Presets and counts | Chips | Count by status | ◐ Simulated | "Submitted & Review" counts Accepted claims but its filter leaves them out (G7-E-30) |
| F-1.4: Search | Search | Matches claim number, patient, payer name and id, ICD-10 code and text, CPT code and text | ● Works | G7-C-02 |
| F-1.5: Payer filter and process selector | Select | Filters by payer. The selector shows only with more than one insurance process | ● Works | |
| F-1.6: Export | Modal | Claim number, patient, payer, policy, service date, billed, status, CPT, ICD-10 | ◐ Simulated | File download not re-checked in code (unverified). G7-C-25 |
| F-1.7: Workflow gear | Link | Opens the insurance workflow | ● Works | |
| F-1.8: Empty state | State | "No insurance claims found matching your filters." | ● Works | |
| F-1.9: Loading and error states | State | None exist for the list | ○ Not built | All data is browser-local |
| F-1.10: Kanban board | View | No Kanban view exists on this page | ○ Not built | Only the table and its stage bar |
| F-1.11: Delete claim | Action | A store function exists and no control uses it | ○ Not built | G7-C-17. Decision needed: D-32 |

#### 3. Worked example
Daniel checks what is ready to go.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants the claims waiting to be sent | Presses **Ready to Submit** | **Only Ready to Submit claims are listed** |
| 2 | He looks at **Submitted & Review** | Reads the count, then presses the chip | **The count includes Accepted claims but the list does not, so they differ** |
| 3 | He types a payer name | Searches | **Matching claims are listed, or the empty message shows** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Billing Specialist | When starting my day, I want to see which claims are ready, submitted or paid, so that I know what needs action. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the claims page, **then** it lists claims in a table with a stage bar and no Kanban view. |
| F-1-2 | **Given** a stage name, **when** it is clicked in the table or the drawer, **then** the status is set by a rule that differs between the two places. |
| F-1-3 | **Given** no claim matches, **then** the empty message is shown. |
| F-1-4 | **Given** the Submitted & Review chip, **then** its count includes Accepted claims and the list does not. |

### F-2: Create and edit a claim

#### 1. What it does
Daniel presses **Create Claim**. A drawer opens in create mode with the claim number `CLM-<year>-<4 random digits>`, today as service date, place of service "11 - Office" and type "Professional (CMS-1500 / 837P)". He types patient, date of birth, phone, email, payer name, policy and group numbers, diagnosis codes and procedure codes (comma separated), provider NPI, prior authorisation and amounts. He presses **Save as Draft** or **Create Claim**, which means Ready to Submit. Nothing is read from an appointment, an invoice or a Scribe session. Opening an existing claim shows a stage ribbon and the tabs **Overview**, **Documents** and **CPT & Diagnoses**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Create Claim drawer | Drawer | Empty form with typed fields. Overview has Claim Details, Patient and Policy Information, Billing and Diagnosis and any custom fields | ● Works | G7-C-03 |
| F-2.2: Save as Draft / Create Claim | Button | Saves the claim as Draft or as Ready to Submit | ● Works | |
| F-2.3: Required fields | State | None. A blank patient saves as "Unnamed Client" and a blank payer as "Self-Pay / Commercial" | ○ Not built | The earlier PRD said mandatory fields are validated (G7-C-05). Decision needed: D-78 |
| F-2.4: Payer ID | Field | The drawer has no usable payer ID capture. Every new claim is saved with the placeholder PAY-001 | ◐ Simulated | Electronic claims cannot route to the right payer (G7-C-04, G7-E-25) |
| F-2.5: Service lines | Rule | Each CPT code becomes one line, the billed amount is split evenly, units 1. Diagnosis pointers A to D go in entry order | ● Works | G7-C-06 |
| F-2.6: Claim numbering | Rule | `CLM-YYYY-####` with a random suffix | ◐ Simulated | Numbers can repeat (G7-C-18). Decision needed: D-70 |
| F-2.7: Provider details | Field | Provider NPI is free text. Billing provider tax ID and address default to fixed demo values | ◐ Simulated | Not read from Team credentials (G7-C-27). Decision needed: D-78 |
| F-2.8: Edit existing claim | Drawer | Changes appear as per-claim overrides in the drawer | ◐ Simulated | The save routine is not connected to any button, so the claim and the table never change (G7-C-16, G7-E-28) |
| F-2.9: Activity feed | Timeline | Lists recorded events | ◐ Simulated | When history is empty the drawer writes made-up entries, including "Real-time 270/271 Eligibility Verified" (G7-C-22, G7-E-29) |
| F-2.10: Patient email | Display | Overview and Documents show an email for the patient | ◐ Simulated | It is made up from the patient id as example.com. Placeholder contact data looks real (G7-E-32) |
| F-2.11: Claim from appointment, invoice or Scribe | Auto-fill | A claim builder that would read these exists in code | ○ Not built | The builder is not mounted on any page. The live Create Claim button opens an empty form (G7-C-28, G3-X-06). Decision needed: D-76 |
| F-2.12: Eligibility verification | Check | Described in the earlier PRD (verify patient insurance) | ○ Not built | G7-C-23 |
| F-2.13: Role control | Rule | Any signed-in user can create and edit claims | ○ Not built | G7-C-32. Decision needed: D-15 |

#### 3. Worked example
Daniel bills Sarah's cataract consultation.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer opens empty | Types Sarah's details, ICD-10 **H25.9** and CPT **92004** | **The form holds only what he typed. No appointment, invoice or Scribe data appears** |
| 2 | He leaves the payer blank | Presses **Create Claim** | **The claim is saved as Ready to Submit with the payer "Self-Pay / Commercial" and payer ID PAY-001** |
| 3 | He opens the claim and fixes the policy number | Edits and closes | **The drawer shows the change. The table and the claim record keep the old value** |
| 4 | He opens a claim with no history | Reads the activity feed | **Entries appear that never happened, including a 270/271 eligibility check** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Billing Specialist | After a visit, I want a claim built from the appointment, invoice and consultation note, so that I do not retype codes and amounts. |
| F-2-J2 | Billing Specialist | When a claim is wrong, I want to correct it and have the change saved, so that the payer receives the right data. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** Create Claim is pressed, **then** an empty drawer opens with a new number, today's date and place of service 11. No appointment, invoice or Scribe data is read. |
| F-2-2 | **Given** a blank patient or payer, **when** the claim is saved, **then** it is saved as "Unnamed Client" or "Self-Pay / Commercial". Nothing is blocked. |
| F-2-3 | **Given** any new claim, **then** its payer ID is PAY-001. |
| F-2-4 | **Given** an edit to an existing claim, **when** the drawer is closed, **then** the claim record is unchanged. |
| F-2-5 | **Given** a claim with no history, **when** the drawer opens, **then** made-up activity entries are written. |

### F-3: Submit, track and print

#### 1. What it does
On a Draft or Ready to Submit claim, Daniel chooses **Submit / View Status**. A modal shows a "Pre-Flight Submission Checklist" and two choices: **Submit Electronically**, or **Submit & Print CMS-1500**, plus a preview-only option. After an electronic submit, the same row action opens a **Clearinghouse Status** modal. **View CMS-1500 Form** shows the printable CMS-1500 (02/12) with **Print** and **Export JSON**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Pre-flight checklist | Checklist | Shows green ticks | ◐ Simulated | No check runs. A claim missing diagnosis or NPI still passes (G7-C-07, G7-C-08, G7-C-33, G7-E-26) |
| F-3.2: Submit Electronically | Button | A 1.2 second wait, then Submitted with a tracking id, batch id and EDI control number | ◐ Simulated | Always succeeds. No clearinghouse is called. An error shows only if the claim vanished (G7-C-12) |
| F-3.3: Submit & Print CMS-1500 and Preview only | Button | Sets Submitted and opens the CMS-1500, or opens it without submitting | ● Works | G7-C-12 |
| F-3.4: Clearinghouse Status | Modal | Tracking, batch and EDI numbers and a financial summary for submitted, accepted and paid claims | ◐ Simulated | Missing numbers fall back to fixed demo values. The rejection reason shows only for Rejected, with canned text when blank (G7-C-11, G7-C-13, G7-E-31) |
| F-3.5: CMS-1500 view | Modal | Printable form. **Print** opens the browser print dialog. **Export JSON** saves the claim as JSON | ● Works | G7-C-14. The payer ID on the form is PAY-001 |
| F-3.6: EDI 837 file | File | The earlier PRD said EDI 837 claims are generated | ○ Not built | Only a JSON export exists (G7-C-24) |
| F-3.7: Block submission on missing ICD-10 or NPI | Rule | Described in the earlier PRD | ○ Not built | Nothing blocks a submit (G7-C-08). Decision needed: D-78 |
| F-3.8: Real-time scrubber with red flags | Rule | Described in the earlier PRD | ○ Not built | G7-C-07 |
| F-3.9: Role check on submit | Rule | Any signed-in user can submit to a payer | ○ Not built | G7-C-32. Decision needed: D-15 |

#### 3. Worked example
Daniel sends Sarah's claim.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Claim has no diagnosis code | Opens **Submit / View Status** | **The checklist shows all green ticks** |
| 2 | He is ready | Presses **Submit Electronically** | **After about a second the claim is Submitted with a tracking number. Nothing is sent** |
| 3 | He wants a paper copy | Opens **View CMS-1500 Form**, presses **Print** | **The browser print dialog opens with the form. The payer ID reads PAY-001** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Billing Specialist | When billing commercial insurers, I want pre-submission claim scrubbing, so that avoidable coding errors and claim denials are eliminated. |
| F-3-J2 | Billing Specialist | After submitting, I want to see the clearinghouse status, so that I can follow up on rejections. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** any claim, **when** the submit modal opens, **then** the checklist shows green ticks and no check has run. |
| F-3-2 | **Given** Submit Electronically, **then** the claim becomes Submitted after about 1.2 seconds with generated tracking, batch and EDI numbers. Nothing is transmitted. |
| F-3-3 | **Given** View CMS-1500 Form, **when** Print is pressed, **then** the browser print dialog opens. No 837 file is produced. |
| F-3-4 | **Given** a claim missing ICD-10 or NPI, **when** it is submitted, **then** it is not blocked. |

### F-4: Status handling and financial figures

#### 1. What it does
A claim has one of eight statuses: Draft, Ready to Submit, Submitted, Accepted, Under Review, Paid, Denied and Rejected. The stage bar and ribbon show the insurance workflow stages: Draft & Intake, Coverage Verified, Submitted (837P), Under Review, Paid & Settled and Denied. The **CPT & Diagnoses** tab shows four financial cards, the service lines, the diagnosis list and a clearinghouse block.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Status set | Rule | Eight statuses. The earlier PRD listed Draft, Submitted, Acknowledged, Paid, Denied | ◐ Simulated | Acknowledged does not exist. Decision needed: D-75 (G7-C-09) |
| F-4.2: Stage to status | Rule | Status is inferred from the stage name, with two rule sets | ◐ Simulated | A Denied stage becomes Rejected from the table and Denied from the drawer. Coverage Verified becomes Accepted or Ready to Submit (G7-E-27) |
| F-4.3: Total Billed Charge | Card | The claim's billed amount | ● Works | G7-C-21 |
| F-4.4: Allowed Amount | Card | Billed times 0.85 | ◐ Simulated | Hardcoded, formula undefined (G7-E-33). Decision needed: D-77 |
| F-4.5: Amount Paid by Payer | Card | The claim's paid amount | ● Works | G7-C-21 |
| F-4.6: Patient Responsibility | Card | Billed times 0.85 minus the paid amount, minimum 0 | ◐ Simulated | Depends on the placeholder ratio (G7-E-33). Decision needed: D-77 |
| F-4.7: Denial reason code | Display | Denial reason shown for a Rejected claim | ◐ Simulated | Shown only for status Rejected, with canned fallback text (G7-C-11, G7-E-31) |

#### 3. Worked example
A claim for 200 has a payer payment of 100.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He opens **CPT & Diagnoses** | Reads the cards | **Allowed Amount reads 170 and Patient Responsibility reads 70. Neither comes from a payer contract** |
| 2 | He clicks the Denied stage in the table | Reads the status | **The status shows Rejected. The same click in the drawer shows Denied** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Billing Specialist | When a payer responds, I want the claim status and amounts to be right, so that I can bill the patient correctly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a claim, **then** Allowed Amount equals billed times 0.85 whatever the payer contract. |
| F-4-2 | **Given** a Denied stage, **when** it is chosen in the table, **then** the status is Rejected. In the drawer it is Denied. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Claims table and filters | F-1.1 – F-1.11 | ● / ◐ / ○ | Table, search and filters work; two stage rules; no Kanban or delete. |
| F-2 | Create and edit a claim | F-2.1 – F-2.13 | ● / ◐ / ○ | Typed claim works; payer ID fixed, edits unsaved, no auto-fill. |
| F-3 | Submit, track and print | F-3.1 – F-3.9 | ◐ / ● / ○ | Green checklist and simulated submit; CMS-1500 prints. |
| F-4 | Status and financial figures | F-4.1 – F-4.7 | ◐ / ● | Two status maps; Allowed Amount is billed times 0.85. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Billing Specialist | See which claims are ready, submitted or paid | F-1 |
| 2 | Billing Specialist | Build a claim from the appointment, invoice and note | F-2 |
| 3 | Billing Specialist | Correct a claim and have the change saved | F-2 |
| 4 | Billing Specialist | Scrub a claim before submitting | F-3 |
| 5 | Billing Specialist | See the clearinghouse status after submitting | F-3 |
| 6 | Billing Specialist | Trust the claim status and amounts | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Create, edit, advance, submit and print claims, export | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names an Insurance Biller and says nothing about who may submit to a payer. Decision needed: D-15.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| All, Ready, Submitted & Review, Paid, Drafts counts | Preset chips | Count by status. Submitted & Review includes Accepted but its filter does not (G7-E-30) |
| Total Billed Charge | CPT & Diagnoses tab | The claim's billed amount |
| Allowed Amount | CPT & Diagnoses tab, Overview default | Billed times 0.85. **Hardcoded, formula undefined** |
| Amount Paid by Payer | CPT & Diagnoses tab | The claim's paid amount |
| Patient Responsibility | CPT & Diagnoses tab | Billed times 0.85 minus paid, minimum 0. **Hardcoded, formula undefined** |
| Line charge | Service lines | Billed amount divided equally across CPT codes |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Call → Receptionist → Appointment → Scribe → Invoice → **Claim** | Invoice to Claim | Not connected. The claim is typed by hand. |
| | Create Claim from appointment, invoice and Scribe | Not built. The builder is not mounted. Create Claim opens an empty form. |
| | Insurance payment on an invoice | Free text payer and claim reference. The claim is not updated. |
| | Submit | Simulated clearinghouse, always succeeds. The payer ID is PAY-001. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-15 | Which roles may create and submit claims? | F-2.13, F-3.9 |
| D-32 | Can a claim be deleted once referenced, or only closed? | F-1.11 |
| D-70 | What claim number format is used and must it be unique? | F-2.6 |
| D-75 | Which claims process and status set are canonical, with one stage-to-status mapping? | F-1.2, F-4.1, F-4.2 |
| D-76 | Should claims be built from appointment, invoice and Scribe data, and should insurance payments on invoices update claims? | F-2.11 |
| D-77 | What are the formula and data source for Allowed Amount and Patient Responsibility? | F-4.4, F-4.6 |
| D-78 | Which claim fields are mandatory and does provider NPI come from Team credentials? | F-2.3, F-2.7, F-3.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
