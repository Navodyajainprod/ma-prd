---
title: "AI Scribe: Ambient Consultation Notes"
product: "client"
module: "scribe"
route: "/scribe"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | AI SCRIBE |
| Route | `/scribe` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A recorder and a list of consultation sessions. A session ends in a transcript, a clinical summary and a prescription document filed on the patient's record. |
| **Who uses it** | Physician (records and reviews). Billing staff (reuse the clinical text on invoices). No role is checked: any signed-in user can use it. |
| **Where you start it** | The **Add Scribe** button on `/scribe`, or from Clients, Client Profile, Appointments, an appointment's details, the Process board, an invoice and the AI assistant capsule. |
| **Where the result goes** | Client activity timeline, the patient's Documents, and (as text only) an invoice's notes. |
| **How real is it** | 0 features work, 6 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Client Profile) | Activity entry and prescription document | Pressing **Save** adds a "Scribe Recorded" or "Scribe Uploaded" entry to the client's timeline and files a prescription document in the client's Documents. | [View Clients](/client/clients) |
| Client (Invoices) | Fill invoice from Scribe | Starting Scribe from an invoice copies a transcript excerpt, the chief complaint and the diagnosis into the invoice's notes fields. No billable lines are produced. | [View Invoices](/client/invoices) |
| Client (Appointments) | Launch point | Scribe starts from an appointment with the patient, the linked appointment, its date, the attending provider and the process prefilled. The session keeps the appointment only as a generic record id, not as an appointment link. | [View Appointments](/client/appointments/list) |
| Client (Claims) | Diagnosis codes for claims | Not connected. The claim builder that reads Scribe data is not mounted on any page. | [View Claims](/client/claims) |

## 1. Module Summary

### The story in one minute

Dr. Anita Rao has a cataract consultation with Sarah Johnson at 10:30. She opens Sarah's appointment and taps **AI Scribe**. A small popup opens already knowing the patient. She presses **Start Ambient Recording** and a timer starts. When the visit ends she presses **Finish & Save Consultation**. Step 2 of 2 already shows Sarah as the contact, the linked appointment, the appointment date and the attending provider. She checks them and presses **Save**. The popup closes at once and a toast says the consultation is saved. There is no confirmation screen. Behind the scenes a prescription document has been filed in Sarah's Documents and a line has been added to her activity timeline. Later she opens the transcript from the Scribe console: a drawer slides in from the right with the summary and a Doctor / Patient conversation. From the console she can share the prescription over WhatsApp or hand the diagnosis text to billing.

### What is real and what is not

- **Real in the prototype:** the launch points, the contact, appointment, date and attendee assignment, the session list with search, the activity entry, the prescription document filed in Documents, and the invoice text fill.
- **Simulated:** the recording. The microphone is never accessed, and every saved session uses the same preset cataract consultation with only the patient's name swapped in. The playback bar is a counting timer. WhatsApp sending and PDF download only show a confirmation.
- **Not built:** a SOAP note view, note editing, sign-off, EHR sync, and any link from a session to a claim.

### Journey position

```
Appointment ─▶ Scribe record ─▶ Assign ─▶ Save ─▶ Review ─┬▶ Client timeline
                                                          ├▶ Patient Documents (prescription)
                                                          ├▶ WhatsApp share (simulated)
                                                          └▶ Invoice notes (text only)
```

## 2. Feature Requests

### F-1: Record a consultation or upload audio

#### 1. What it does
Dr. Rao taps Add Scribe and a draggable popup opens on its **Record** step. She chooses **Live Ambient** or **Upload Audio**. In Live mode a timer runs and a pulse with animated bars reads "Listening to Consultation...". Pause, Resume and Restart control it. In Upload mode she picks an audio file and sees "Loaded audio: <file name>". Once recording has started, or in Upload mode, the main button reads **Finish & Save Consultation** and moves to step 2.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Live Ambient / Upload Audio switch | Toggle | Chooses how the consultation is captured | ● Works | |
| F-1.2: Start Ambient Recording | Button | The big microphone button or the bottom button. Starts a one-second timer and shows "Ambient microphone listening started" | ◐ Simulated | The microphone is never accessed (see G3-E-17) |
| F-1.3: Pause / Resume | Button | Stops and restarts the timer with a toast | ◐ Simulated | Nothing is captured either way |
| F-1.4: Restart | Button | Resets the timer and the session | ● Works | |
| F-1.5: Upload Audio | File input | Accepts an audio file and confirms its name | ◐ Simulated | The file is ignored. Finish & Save Consultation is available without a file (G3-E-28) |
| F-1.6: Live waveform, speech-pause detection, noise-cancellation status | Display | Described in the earlier PRD | ○ Not built | Only a decorative animation exists |
| F-1.7: Patient consent before recording | Step | No consent step exists | ○ Not built | Decision needed: see D-34 |
| F-1.8: Finish & Save Consultation | Button | Pauses a running timer and opens step 2 of 2 | ● Works | |

#### 3. Worked example
Dr. Rao starts Scribe from Sarah Johnson's appointment.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Popup opens on the Record step | Presses **Start Ambient Recording** | **A timer runs and "Listening to Consultation..." appears** |
| 2 | Patient steps out for a test | Presses **Pause**, then **Resume** | **Timer stops, then continues** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Physician | During a consultation, I want recording to run in the background, so that I can keep eye contact instead of typing. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the Record step, **when** the user presses Start Ambient Recording, **then** a timer counts up and the popup shows it is listening. |
| F-1-2 | **Given** recording is running, **when** the user presses Pause, **then** the timer stops until Resume. |
| F-1-3 | **Given** Upload Audio is chosen, **when** a file is picked, **then** a toast shows its name. Finish & Save Consultation is available with or without a file. |

### F-2: Assign the contact, appointment and attendee

#### 1. What it does
**Finish & Save Consultation** moves the popup to **Step 2 of 2**. Here the clinician says who the consultation was for, which appointment it belongs to, on what date and who attended. There are four inputs and one **Save** button. There is no age, gender, title or entity field. The title is generated as "<patient>_Consultation_<date>". **Back to Recording** returns to step 1.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Contact | Search / text | Search existing clients by name, id or phone, or press **+ New / Walk-in** and type a name | ◐ Simulated | With no launch context the **first client in the list is preselected** without telling the user. A walk-in gets a temporary id and is never created as a client. An empty walk-in name saves as "Walk-in Patient" (G3-E-18) |
| F-2.2: Link Appointment | Select | Lists the contact's appointments plus **No appointment linked**. Picking one sets the date and the attendee | ◐ Simulated | The appointment is stored as a generic record id, not as an appointment link (G3-E-31) |
| F-2.3: Session Date / Appointment Date | Date | Defaults to today, or to the appointment date when launched from an appointment | ● Works | |
| F-2.4: Attendee Name | Select | Lists team members with their role. Defaults to the appointment's provider, else the signed-in user | ● Works | Any user may pick any team member. Decision needed: D-14 |
| F-2.5: Validation | Rule | **Save** runs with empty or default fields | ○ Not built | |
| F-2.6: Title | Rule | Generated as "<patient>_Consultation_<date>" and not editable | ● Works | |
| F-2.7: Age and gender | Rule | No field. Age and gender come from the client record, else 42 and Female | ◐ Simulated | These defaults reach the summary and prescription (G3-E-21) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Started from Sarah's appointment | Presses **Finish & Save Consultation** | **Sarah, the appointment, its date and the attending provider are already filled in** |
| 2 | Started from the Add Scribe button | Presses **Finish & Save Consultation** | **The first client in the list is preselected, the appointment is "No appointment linked", the date is today and the attendee is the signed-in user. The doctor must change the contact by hand** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Physician | When I save a consultation, I want it attached to the right patient and visit, so that the record is correct. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** Scribe was launched from an appointment, **when** step 2 opens, **then** the contact, the linked appointment, its date and its provider are prefilled. |
| F-2-2 | **Given** Scribe was launched from a client profile, invoice or process, **when** step 2 opens, **then** the contact is prefilled, the appointment is "No appointment linked" and the attendee is the signed-in user. |
| F-2-3 | **Given** Scribe was launched with no context, **when** step 2 opens, **then** the first client in the list is selected. |
| F-2-4 | **Given** any state of step 2, **when** the user presses Save, **then** the session is saved. No field is validated. |

### F-3: Save and review the transcript

#### 1. What it does
**Save** stores the session, shows a toast and closes the popup at once. There is no confirmation screen, no "Consultation Transcribed!" message and no **Attested** badge. The new session appears in the console list. Dr. Rao opens it with a row click or **View Transcript**. A drawer slides in from the right, titled "Conversation with <patient>". It has a recording card, a summary and the transcript. Clicking the dimmed backdrop closes it.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Session content | Generation | Builds the session from one preset ophthalmology (cataract) consultation, swapping in the patient's name. Duration is the timer value, or 78 seconds if zero | ◐ Simulated | Not derived from the audio (G3-E-17) |
| F-3.2: Recording card | Player | Play and pause, scrub, speeds, star rating | ◐ Simulated | A counting timer, no audio. The rating is not saved (G3-E-27) |
| F-3.3: Summary | Card | A narrative from age, gender, doctor, chief complaint, diagnosis and medicines | ◐ Simulated | Unknown gender is guessed from first names. Unknown age defaults to 34 or 45 (G3-E-26) |
| F-3.4: Transcript | Timeline | Doctor and Patient turns with the patient's name substituted | ◐ Simulated | |
| F-3.5: Attestation and sign-off | Action | No badge and no sign-off action exists | ○ Not built | The earlier "Attested" badge is gone. Decision needed: D-79 |
| F-3.6: Console list | Table | Name, workflow, duration, responsible doctor, created at, status. Search matches patient name, diagnosis and transcript text. Empty state: "No Transcripts Found. Click the + button above to record your first consultation." | ● Works | The "Completed" and "Upcoming" chips type the word into search. The Status filter does nothing (G3-E-25) |
| F-3.7: Session storage | Rule | Sessions live in browser session storage | ◐ Simulated | They disappear when the tab closes. Documents and timeline entries they created remain (G3-E-24). Decision needed: D-38 |
| F-3.8: Save and close | Action | **Save** stores the session, files the prescription, shows the toast "AI Scribe consultation saved for <patient>!" and closes the popup | ● Works | Most launch points add a second toast of their own ("recorded for" or "saved for"). The console, the assistant capsule and the floating widget add none |
| F-3.9: Detail drawer | Drawer | Slides in from the right at full height with a dismissible backdrop | ● Works | It does not open by itself after Save |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visit ends, step 2 is filled | Presses **Save** | **A toast shows and the popup closes. No confirmation screen appears** |
| 2 | Doctor wants to check | Clicks the new row in the console | **A drawer slides in from the right with the summary and Doctor / Patient turns. There is no SOAP view** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Physician | After the visit, I want to check what was captured, so that I can trust the note. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** Save is pressed, **then** a session is saved with status Completed, the chosen attendee as doctor and the preset consultation content, a toast shows and the popup closes. |
| F-3-2 | **Given** the transcript drawer is open, **then** it slides in from the right and shows a recording card, a summary and the Doctor / Patient transcript. It shows no SOAP view, no edit control and no sign action. |
| F-3-3 | **Given** the console list has no sessions, **then** the empty message is shown. |

### F-4: Clinical note and prescription document

#### 1. What it does
Pressing **Save** also files a **prescription document** in the patient's Documents. The code also prepares an 11-section note template, but no screen shows it.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Extracted data | Data | Chief complaint, vitals, diagnosis with ICD-10, secondary diagnoses, medications (drug, dose, frequency, duration, instructions), investigations, advice, follow-up, doctor notes | ◐ Simulated | From the preset session. No CPT or procedure codes exist |
| F-4.2: Prescription document | Document | Filed as category "Medical / Intake", type PDF, status **Verified**, uploaded by "<attendee> (AI Scribe)" | ◐ Simulated | Carries fixed doctor credentials. Age and gender show the client's values, else 42 and Female (G3-E-21) |
| F-4.3: Download PDF | Row action | Files another prescription document and shows "Prescription downloaded…" | ◐ Simulated | Nothing is downloaded and each click adds a duplicate |
| F-4.4: SOAP note, editor, version history | Note | Described in the earlier PRD | ○ Not built | Decision needed: D-79 |
| F-4.5: Sign & Attach to Chart, lock | Action | Described in the earlier PRD | ○ Not built | Decision needed: D-79 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah's session saved | Opens Sarah's Documents | **A prescription document marked Verified is there** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Physician | When the visit ends, I want a structured note and prescription produced, so that I finish charting quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a session is saved, **then** one prescription document is added to the patient's Documents with status Verified. |
| F-4-2 | **Given** Download PDF is pressed, **then** an additional prescription document is added and a confirmation toast shows. No file is downloaded. |

### F-5: Share and manage sessions

#### 1. What it does
Each row of the console has four actions: **View Transcript**, **Download PDF**, **Share via WhatsApp** and **Delete Record**. A bulk **Delete Selected** is also available.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Share via WhatsApp | Modal | Previews a message with a prescription link and Send shows a success toast | ◐ Simulated | The link is the same for every patient and nothing is sent (G3-E-22) |
| F-5.2: Delete record / Delete Selected | Action | Removes the session immediately | ● Works | No confirmation and no audit entry (G3-E-23). Decision needed: D-33 |
| F-5.3: Retention | Rule | No retention rule is applied | ○ Not built | The 90-day setting is unused. Decision needed: D-38 |
| F-5.4: Role control | Rule | Any signed-in user can open, record, share and delete | ○ Not built | Decision needed: D-14 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient asks for the prescription | Presses **Share via WhatsApp**, then **Send** | **A success message appears. No message is sent** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Physician | After the visit, I want to send the prescription at once, so that the patient can go to the pharmacy. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** Delete Record is pressed, **then** the session is removed at once with no confirmation. |
| F-5-2 | **Given** Send is pressed in the WhatsApp modal, **then** a success toast shows and no message is delivered. |

### F-6: Hand-offs to the timeline, invoices and claims

#### 1. What it does
A saved session writes to the client timeline. Started from an invoice, it fills text fields on that invoice. It does not reach claims.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-6.1: Activity timeline | Entry | Adds "Scribe Recorded" or "Scribe Uploaded" with diagnosis, medicines and a transcript preview | ● Works | |
| F-6.2: Fill invoice | Action | From the invoice drawer, copies a transcript excerpt, chief complaint and diagnosis into the invoice's notes fields | ◐ Simulated | No billable lines are produced and the invoice's totals do not change (G3-E-29). Decision needed: D-76 |
| F-6.3: Claim from session | Auto-fill | A claim builder that would read the session's ICD-10 code and provider exists in code | ○ Not built | The builder is not mounted on any page. The live Create Claim button opens an empty form (G7-C-28) |
| F-6.4: Appointment link | Link | The session's own appointment field is never set. The chosen appointment is kept only as a record id | ○ Not built | See F-2.2 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Biller opens Scribe from an invoice | Saves a session | **Notes, diagnosis and chief complaint appear on the invoice. Line items stay as they were** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-6-J1 | Billing Specialist | When billing a visit, I want the clinical text from the note, so that I do not retype it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-6-1 | **Given** a session is saved, **then** the client's timeline gets one Scribe entry. |
| F-6-2 | **Given** Scribe was launched from an invoice, **when** the session is saved, **then** the invoice's notes, diagnosis and chief complaint fields are filled. Invoice lines and totals are unchanged. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Record or upload audio | F-1.1 – F-1.8 | ◐ Simulated | Timer and pulse only; no microphone. |
| F-2 | Assign contact, appointment and attendee | F-2.1 – F-2.7 | ● / ◐ / ○ | Four inputs and Save; first client preselected without launch context. |
| F-3 | Save and review transcript | F-3.1 – F-3.9 | ◐ Simulated | Save closes the popup with a toast; preset consultation in a slide-over drawer; no SOAP view. |
| F-4 | Note and prescription document | F-4.1 – F-4.5 | ◐ / ○ | Prescription filed; note, edit and sign-off absent. |
| F-5 | Share and manage sessions | F-5.1 – F-5.4 | ◐ / ● | Delete works; sending and download are simulated. |
| F-6 | Hand-offs | F-6.1 – F-6.4 | ● / ◐ / ○ | Timeline works; invoice text only; claims not connected. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Physician | Keep eye contact during the consultation | F-1 |
| 2 | Physician | Attach the consultation to the right patient and visit | F-2 |
| 3 | Physician | Check what was captured | F-3 |
| 4 | Physician | Finish charting quickly | F-4 |
| 5 | Physician | Send the prescription at once | F-5 |
| 6 | Billing Specialist | Reuse clinical text when billing | F-6 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/scribe`, record, pick any attendee, save, view any transcript, share, delete | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names the Physician as the user and says nothing about access. Decision needed: D-14.

## 5. Metrics and definitions

No metric is shown on `/scribe`. An unused helper would compute "time saved" as sessions × 8.5 minutes minus recorded minutes, and "average confidence" as a fixed 98.4. Both are placeholders. **Hardcoded, formula undefined.**

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Call → Receptionist → Appointment → **Scribe** → Invoice → Claim | Appointment to Scribe | Opens with patient, appointment, date, attendee and process prefilled. Appointment stored as a generic record id. |
| | Scribe inside the appointment drawer | The appointment's notes are replaced by the Scribe summary. |
| | Scribe to Invoice | Text only. No billable lines. |
| | Scribe to Claim | Not connected. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-34 | Is patient consent required before recording, and how is it stored? | F-1.7 |
| D-14 | Which roles may record, view, sign and issue prescriptions? | F-2.4, F-5.4 |
| D-79 | Which note template (SOAP or the 11-section layout), who signs, what locks? | F-3.5, F-4.4, F-4.5 |
| D-76 | What may Scribe push to invoices and claims? | F-6.2, F-6.3 |
| D-33 | Can sessions be deleted, by whom, with what audit? | F-5.2 |
| D-38 | Retention period for audio and transcripts | F-3.7, F-5.3 |
| D-81 | Which speech-to-text engine is named in the product (Whisper or Deepgram Nova-2 Medical)? | F-1 |
| D-82 | What does the 1–5 star rating measure? | F-3.2 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Updated to the popup flow changed on 2026-11-14 (confirm step removed, step 2 streamlined, detail as a slide-over drawer). |
| 2026-11-13 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |

