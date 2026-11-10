---
title: "Call Logs, Telephony Hub & AI Transcription"
product: "client"
module: "call-logs"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | CALL-LOGS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Call Logs module provides a unified VoIP telephony communications hub. It logs all inbound and outbound clinical calls, provides an integrated audio player for recordings, displays AI transcriptions with sentiment tagging, and supports scheduling callback reminders.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Inbound & Outbound VoIP Call Log Stream
#### 1. What it does
Displays a complete log of telephone calls handled by clinic staff and AI voice agents with sortable columns: Call Direction, Patient Name, Phone Number, Duration, Date/Time, Call Outcome (Completed, Missed, Voicemail), and Assigned Process.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Call Direction & Status Icons | UI Icons | Visual icons distinguishing Inbound, Outbound, Missed, and Voicemail calls | Color-coded status |
| F-1.2: Duration & Timestamp Display | Text | Displays call duration (e.g. '4:32') and timestamp with relative date | Accurate to second |
| F-1.3: Direct Click-to-Dial Action | Button | Triggers outbound phone dialer directly from any call log row | Launches softphone |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff member triages missed calls | Filters call log by 'Missed Calls' | **List displays 3 patients who called after hours; staff clicks dialer icon to call them back** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front Desk Staff | When following up on missed calls, I want a clear log with one-click callback, so that patient inquiries are addressed quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Every telephone call placed or received through the system generates a corresponding log entry with duration and status. |

### F-2: Integrated Audio Player & Dual-Speaker AI Transcription
#### 1. What it does
Provides an in-app audio waveform player to listen to call recordings, accompanied by full speaker-diarized AI transcriptions (Agent vs Patient) with sentiment and clinical intent tags.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Waveform Audio Player | Player | Play, pause, audio scrub bar, and speed multiplier (1.0x, 1.25x, 1.5x) | Audio download support |
| F-2.2: Diarized AI Transcript Pane | Transcript UI | Shows alternating speech bubbles for Staff and Patient with timestamps | Searchable text |
| F-2.3: Sentiment & Intent Tags | AI Tags | Tags call intent: 'Appointment Booking', 'Prescription Refill', 'Billing Query'; sentiment: Positive/Urgent | Generated via Whisper LLM |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Supervisor reviews patient dispute call | Opens call details, plays audio recording at 1.25x, and reads highlighted transcript | **Confirms coordinator provided correct appointment cancellation policy** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Quality Assurance Supervisor | When evaluating staff communication, I want synchronized audio and transcripts, so that I can verify call quality and protocol compliance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Calls with recorded audio provide interactive playback and full text transcription. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Inbound & Outbound VoIP Call Log Stream | F-1.1, F-1.2, F-1.3 | Displays a complete log of telephone calls handled by clinic staff and AI voice agents with sortable columns: Call Direction, Patient Name, Phone Number, Duration, Date/Time, Call Outcome (Completed, Missed, Voicemail), and Assigned Process. |
| F-2 | Integrated Audio Player & Dual-Speaker AI Transcription | F-2.1, F-2.2, F-2.3 | Provides an in-app audio waveform player to listen to call recordings, accompanied by full speaker-diarized AI transcriptions (Agent vs Patient) with sentiment and clinical intent tags. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front Desk Staff | When following up on missed calls, I want a clear log with one-click callback, so that patient inquiries are addressed quickly. | F-1 |
| 2 | Quality Assurance Supervisor | When evaluating staff communication, I want synchronized audio and transcripts, so that I can verify call quality and protocol compliance. | F-2 |
