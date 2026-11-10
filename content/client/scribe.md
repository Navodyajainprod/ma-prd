---
title: "AI Clinical Scribe & Automated SOAP Notes"
product: "client"
module: "scribe"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | SCRIBE |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The AI Clinical Scribe module provides ambient clinical listening and voice consultation transcription. It listens to in-person or telehealth doctor-patient encounters, transcribes medical dialogue via Whisper, and synthesizes structured SOAP clinical notes ready for doctor sign-off and EHR sync.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Ambient Consultation Audio Recording & Stream
#### 1. What it does
Captures ambient clinical audio via a single 'Start Consultation' microphone button, displaying real-time audio waveform activity and background noise cancellation status.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Start/Stop Recording Button | Audio Button | Large prominent toggle button with recording duration timer and pulse indicator | Red pulse during recording |
| F-1.2: Real-Time Audio Waveform | Canvas Visualizer | Renders live audio frequency bars confirming active microphone capture | Detects speech pause |
| F-1.3: Audio Mute & Resume Toggle | Button | Allows doctor to temporarily pause recording during private patient undressing or exams | Zero data recorded while paused |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor enters exam room and begins visit | Clicks 'Start Consultation' on laptop | **Microphone streams audio, timer begins, and waveform confirms voice capture** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Physician | During patient consultations, I want ambient listening recording the dialogue, so that I can maintain eye contact instead of typing on a keyboard. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Starting recording captures microphone input and displays elapsed encounter duration. |

### F-2: Automated Structured SOAP Note Synthesis
#### 1. What it does
Synthesizes the conversation transcript into structured clinical SOAP notes: Subjective (chief complaint, history of present illness), Objective (vital signs, physical exam observations), Assessment (differential diagnosis, clinical impressions), and Plan (medications, diagnostics, follow-up).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: 4-Section SOAP Note Container | UI Card | Structured accordion or tabbed view dividing Subjective, Objective, Assessment, and Plan | Formatted with medical bullet points |
| F-2.2: Clinician Rich-Text Editor | Inline Editor | Allows doctor to edit, add, or delete wording prior to final sign-off | Preserves version history |
| F-2.3: Sign & Attach to Chart Button | Action Button | Digitally signs note with clinician credentials and attaches it permanently to patient encounter | Locks note from further edit |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Doctor concludes 15-minute consultation | Clicks 'End Consultation & Generate Note' | **AI generates complete SOAP note within 8 seconds; doctor reviews, edits dosage, and clicks 'Sign & Attach'** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Physician | When the encounter ends, I want a structured SOAP note generated automatically, so that I can finish my clinical charting in under 60 seconds. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Generated SOAP notes strictly follow the 4-part Subjective, Objective, Assessment, Plan structure. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Ambient Consultation Audio Recording & Stream | F-1.1, F-1.2, F-1.3 | Captures ambient clinical audio via a single 'Start Consultation' microphone button, displaying real-time audio waveform activity and background noise cancellation status. |
| F-2 | Automated Structured SOAP Note Synthesis | F-2.1, F-2.2, F-2.3 | Synthesizes the conversation transcript into structured clinical SOAP notes: Subjective (chief complaint, history of present illness), Objective (vital signs, physical exam observations), Assessment (differential diagnosis, clinical impressions), and Plan (medications, diagnostics, follow-up). |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Physician | During patient consultations, I want ambient listening recording the dialogue, so that I can maintain eye contact instead of typing on a keyboard. | F-1 |
| 2 | Physician | When the encounter ends, I want a structured SOAP note generated automatically, so that I can finish my clinical charting in under 60 seconds. | F-2 |
