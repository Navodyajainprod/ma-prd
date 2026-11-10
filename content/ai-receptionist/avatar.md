---
title: "Aria Voice & Interactive Clinical Avatar Stage"
product: "ai-receptionist"
module: "avatar"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | AI RECEPTIONIST |
| Module | AVATAR |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Voice Model & Prompt Configuration | Clinic administrators configure Aria's greeting phrase, voice tone, speech model, and custom medical clinic prompts in Client Settings > AI Voices / Models. | [View in Client](/client/settings/voices) |

## 1. Module Summary
- The Aria Avatar Stage provides a lifelike, full-screen interactive receptionist experience. Powered by an animated 3D video avatar, real-time Whisper speech recognition, dual-language synthesis (English and Hindi), and a live caption stream, Aria greets visitors, answers questions, and guides them through check-in.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Animated Aria 3D Video Avatar & Lip-Sync Animation
#### 1. What it does
Renders the Aria clinical receptionist avatar on a modern glassmorphic stage. Plays idle breathing animations when listening and smoothly transitions to lip-synced talking video clips synchronized with TTS speech output. To confirm: What fallback voice model is utilized when Web Speech API offline synthesis is required during clinic internet interruptions?

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Clinical Glassmorphic Stage | Stage Viewport | Deep navy-to-slate gradient viewport with frosted glass cards and ambient glow | 100vh full-screen layout |
| F-1.2: Seamless Video Avatar Looper | Video Player | High-definition MP4/WebM avatar seamlessly switching between idle and speech states | Zero latency transition |
| F-1.3: Real-Time Audio Waveform Visualizer | Canvas Waveform | Dynamic pulsating frequency visualizer reacting to incoming microphone voice input | Smooth Web Audio API |
| F-1.4: Dual-Language Toggle (EN / HI) | Language Pill | One-tap switcher toggling Aria's spoken dialect and UI labels between English and Hindi | Instant language switch |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor approaches kiosk terminal | Aria greets visitor: 'Hello! Welcome to Mantra Care. How can I assist you today?' | **Avatar speaks while waveform pulses and captions appear** |
| 2 | Visitor speaks Hindi: 'Mera check-in karna hai' | Aria detects Hindi speech | **Switches to Hindi: 'Namaste! Kripya apna phone number batayein'** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Visitor | When I walk up to the kiosk, I want an approachable, conversational guide, so that I can complete my tasks naturally without confusing menus. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Avatar video transitions between idle and speaking states without video flicker. |
| F-1-2 | Audio waveform reacts in real time to ambient speech input when mic is unmuted. |

### F-2: Whisper Speech-to-Text & Real-Time Live Caption Bar
#### 1. What it does
Captures patient voice input, streams audio through OpenAI Whisper STT, parses clinical intents (check-in, directions, billing, doctor inquiry), and renders accessibility-compliant live subtitles across the bottom of the stage.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Live Subtitle Caption Bar | Caption Bar | High-contrast caption bar displaying transcribed user speech and Aria's synthesized response | ADA compliant font |
| F-2.2: Speech Intent Classifier | Intent Engine | Categorizes voice commands: 'Check in for Dr. Sharma', 'Where is the restroom?', 'Pay bill' | Routes to target flow |
| F-2.3: Mic Mute / Volume Controller | Controls | Hardware mute toggle, listening timeout indicator, and audio volume slider | Protects patient privacy |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient speaks: 'Where is Dr. Sharma's room?' | Transcribed on caption bar in real time | **Aria replies: 'Dr. Sharma is in Consultation Room 101 on Ground Floor. Let me show you the route!' and opens directions** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Hearing-Impaired / Multilingual Patient | I want to read live captions on screen, so that I can follow Aria's spoken instructions clearly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Live captions render each spoken sentence with under 300ms latency. |
| F-2-2 | Unrecognized speech prompts empathetic re-query: 'I didn't quite catch that, could you repeat or tap the screen?' |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Animated Aria 3D Video Avatar & Lip-Sync Animation | F-1.1, F-1.2, F-1.3, F-1.4 | Renders the Aria clinical receptionist avatar on a modern glassmorphic stage. |
| F-2 | Whisper Speech-to-Text & Real-Time Live Caption Bar | F-2.1, F-2.2, F-2.3 | Captures patient voice input, streams audio through OpenAI Whisper STT, parses clinical intents (check-in, directions, billing, doctor inquiry), and renders accessibility-compliant live subtitles across the bottom of the stage. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Visitor | When I walk up to the kiosk, I want an approachable, conversational guide, so that I can complete my tasks naturally without confusing menus. | F-1 |
| 2 | Hearing-Impaired / Multilingual Patient | I want to read live captions on screen, so that I can follow Aria's spoken instructions clearly. | F-2 |
