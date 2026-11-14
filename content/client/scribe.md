---
title: "AI Clinical Scribe & Automated SOAP Notes"
product: "client"
module: "scribe"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SCRIBE |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## 1. Module Summary
- The AI Clinical Scribe module provides ambient clinical listening and voice consultation transcription. It listens to in-person or telehealth doctor-patient encounters, transcribes medical dialogue via Whisper, and synthesizes structured clinical notes ready for doctor sign-off and EHR sync.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Ambient Consultation Audio Recording & Stream
#### 1. What it does
Captures ambient clinical audio via a single 'Start Ambient Recording' microphone button, displaying real-time audio waveform activity, timer, and pause/restart controls, or allows direct audio file upload.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Start/Stop Recording Button | Audio Button | Large prominent toggle button with recording duration timer and pulse indicator | Red pulse during recording |
| F-1.2: Real-Time Audio Waveform | Canvas Visualizer | Renders live audio frequency bars confirming active microphone capture | Detects speech pause |
| F-1.3: Audio Mute & Resume Toggle | Button | Allows doctor to temporarily pause recording during private patient exams | Zero data recorded while paused |
| F-1.4: Finish & Save Consultation | Action Button | Transitions from Step 1 (Recording) to Step 2 (Assignment & Metadata) | Preserves captured audio stream |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor enters exam room and begins visit | Clicks 'Start Ambient Recording' | **Microphone streams audio, timer begins, and waveform confirms voice capture** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Physician | During patient consultations, I want ambient listening recording the dialogue, so that I can maintain eye contact instead of typing on a keyboard. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Starting recording captures microphone input and displays elapsed encounter duration. |

---

### F-2: Consultation Assignment, Linking & Save (Step 2)
#### 1. What it does
In Step 2 of the AI Scribe popup, clinicians assign encounter metadata using four clean, focused inputs: Contact, Link Appointment, Session Date / Appointment Date, and Attendee Name (Team Member). Extraneous fields (such as manual Age, Gender, Link Entity dropdown, and Consultation Title inputs) are omitted; consultation titles are generated automatically as `${patientName}_Consultation_${sessionDate}`. Saving is triggered by a single **Save** button.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Contact Selector | Dropdown & Input | Searchable client dropdown with "+ New / Walk-in" toggle for typing unlisted patient names | Auto-filters appointments for selected contact |
| F-2.2: Link Appointment Dropdown | Select Dropdown | Allows linking an existing appointment for the selected contact or selecting "No appointment linked" | Auto-updates date and attendee when selected |
| F-2.3: Session Date / Appointment Date | Date Picker | Editable date input for the consultation date | In Client Profile, filled/edited by user (defaults to today); in Appointment Drawer, pre-filled with appointment date |
| F-2.4: Attendee Name | Select Dropdown | Lists organization team members (`useTeamMembers`); pre-filled with active user or appointment provider | Captures responsible clinician/provider |
| F-2.5: Save Action Button | Action Button | Simple, prominent **Save** button (with check icon) replacing verbose "Generate SOAP Notes" | Saves session and creates timeline activity |

#### 3. Contextual Pre-Fill Behavior
- **From Contact Profile (`ClientProfile.tsx`)**:
  - **Contact**: Pre-filled with the current client profile name and ID.
  - **Link Appointment**: Lists all scheduled appointments for this specific client, defaulting to "No appointment linked".
  - **Session Date / Appointment Date**: Filled and editable by the clinician (defaults to current date `YYYY-MM-DD`).
  - **Attendee Name**: Pre-filled from the currently authenticated team member (`user.name`).
- **From Appointment Drawer (`AppointmentDetailDrawer.tsx`)**:
  - **Contact**: Pre-filled automatically with the appointment's client name and ID.
  - **Link Appointment**: Pre-filled automatically with the active appointment (`APT-<id>`).
  - **Session Date / Appointment Date**: Pre-filled automatically with the appointment's scheduled date (`effectiveAppt.date`).
  - **Attendee Name**: Pre-filled automatically with the appointment's attending clinician/provider (`effectiveAppt.employeeName`).

#### 4. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinician clicks "AI Scribe" from an active appointment drawer | Finishes recording and reviews Step 2 | **Contact, Appointment ID, Appointment Date, and Attending Doctor are all pre-filled. Clinician clicks 'Save'.** |
| 2 | Clinician starts AI Scribe from a client's profile page | Enters Step 2 | **Contact is pre-filled, Appointment defaults to 'No appointment linked', user sets session date, attendee defaults to user, and clicks 'Save'.** |

#### 5. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinician | When recording concludes, I want my encounter metadata (contact, appointment, date, attendee) automatically pre-filled, so that I can save the consultation in one click. |

#### 6. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Step 2 only displays Contact, Link Appointment, Session Date, and Attendee Name fields. |
| F-2-2 | The primary action button is labeled 'Save' and replaces 'Confirm & Generate SOAP Notes'. |
| F-2-3 | Opening scribe from an appointment drawer automatically pre-fills contact, appointment ID, appointment date, and attending provider. |
| F-2-4 | Opening scribe from a client profile pre-fills the contact, lists that client's appointments, and allows the clinician to edit the session date. |

---

### F-3: Scribe Detail Slide-Over Drawer
#### 1. What it does
Renders the complete consultation review, simulated audio playback, clinical narrative summary, and turn-by-turn dialogue transcript inside a full-height right-side slide-over **Drawer** (`TranscriptDetailDrawer`), replacing legacy centered modal popups.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Right Slide-Over Panel | Drawer Shell | Full-height panel sliding in from the right viewport (`w-full max-w-4xl bg-[#f8fafc] border-l`) with background backdrop overlay | Consistent with all app drawers |
| F-3.2: Audio Playback Card | Media Player | Scrub bar, play/pause controls, speed toggle (1x, 1.25x, 1.5x, 2x), and encounter timestamp | Displays total audio duration |
| F-3.3: Clinical Narrative Summary | Info Card | Structured summary synthesizing patient demographics, attending clinician, diagnosis, medications, and follow-up timeline | Clean high-level briefing |
| F-3.4: Dialogue Transcript Feed | Chat Timeline | Turn-by-turn speech transcript attributing dialogue to Doctor and Patient with personalized identifiers | Scrollable message stream |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinician clicks "View Transcript" on a consultation row | Views consultation details | **Slide-over drawer smoothly animates from the right, displaying audio playback, clinical summary, and dialogue.** |

#### 4. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Scribe detail view must open as a slide-over drawer from the right edge, covering full viewport height with a dismissible backdrop. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Ambient Consultation Audio Recording & Stream | F-1.1, F-1.2, F-1.3, F-1.4 | Ambient audio capture and audio file upload with live waveform, duration timer, and pause controls. |
| F-2 | Consultation Assignment, Linking & Save (Step 2) | F-2.1, F-2.2, F-2.3, F-2.4, F-2.5 | 4-field Step 2 (Contact, Link Appointment, Session Date, Attendee Name) with smart pre-filling from profile or appointment and 1-click 'Save'. |
| F-3 | Scribe Detail Slide-Over Drawer | F-3.1, F-3.2, F-3.3, F-3.4 | Right-side full-height slide-over drawer displaying encounter recording playback, clinical narrative, and turn-by-turn dialogue. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Physician | During patient consultations, I want ambient listening recording the dialogue, so that I can maintain eye contact instead of typing on a keyboard. | F-1 |
| 2 | Clinician | When recording concludes, I want contact, appointment, date, and attendee pre-filled, so that I can save the consultation in one click. | F-2 |
| 3 | Clinician | When reviewing past encounters, I want the full recording, summary, and transcript in a slide-over drawer, so that I can reference notes without losing my place. | F-3 |
