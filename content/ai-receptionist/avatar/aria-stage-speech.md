---
title: "Aria Lip-Sync Stage, Speech Capture & Intent Routing"
product: "ai-receptionist"
module: "avatar"
channel: "aria-stage-speech"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Avatar & Voice Experience - Stage, Speech & Intent (`/reception/*`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Voice & AI Channel Settings | Clinic voice configuration connects the organization's AI Reception channel for spoken prompts and bilingual clinic delivery. | [View in Client](/client/settings/voices) |
| Client | Clinic Knowledge Base | Questions about clinic timings, preparation, or policies draw answers from the practice's Knowledge Base. | [View in Client](/client/knowledge-base) |
| Client | AI Automation & Triage | Shares conversational intent understanding principles between lobby voice assistance and clinic automation flows. | [View in Client](/client/automation) |
| Client | Call Logs & Voice AI | Unifies telephone voice-AI patient conversations alongside in-clinic lobby voice assistance. | [View in Client](/client/call-logs) |
| Admin | Platform Voice & Model Catalog | Admin-configured AI speech and voice models underpin multilingual speech synthesis and transcription quality. | [View in Admin](/admin/ai-voices-models) |
| Companion | AI Patient Chat | Gives patients a private text-based companion assistant on their phone outside the public waiting area. | [View in Companion](/companion/chat/chat) |

## 1. Module Summary
- The **Aria Lip-Sync Stage, Speech Capture & Intent Routing** module delivers Aria's lifelike visual presence, noisy-lobby speech recognition, and smart intent understanding across every AI Receptionist screen.
- Visually, Aria speaks with fluid synchronized lip motion that settles naturally to a closed-mouth resting expression without awkward mid-word freezes or black screen flashes, paired with clear color-coded status halos and accessible reduced-motion support.
- Conversationally, noisy waiting-room speech filtering, bilingual English/Hindi recognition with automatic browser speech backup, priority-ranked intent routing, and in-screen voice commands let patients navigate end-to-end hands-free.

## 2. Feature Requests

### F-1: Flicker-Free Lip-Sync Stage & Natural Resting Poses
#### 1. What it does
Unlike clunky dual-clip avatars that flash black or jerk awkwardly between idle and talking animations, Aria renders cleanly inside a single continuous video stage (falling back to a crisp static portrait only if media fails to load):
- **Synced Lip Tempo:** Playback adjusts smoothly to match Aria's speaking speed without exaggerated fast or slow motion.
- **Closed-Mouth Settle:** Whenever Aria finishes a sentence, playback coasts gently forward (within at most `0.7 seconds`) to one of eleven calibrated closed-mouth resting frames — never freezing abruptly with her mouth open mid-syllable.
- **Reduced Motion Accessibility:** If the device has reduced-motion accessibility enabled, Aria remains calmly paused in a neutral resting posture while status pills and live captions continue updating clearly.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Single Continuous Stage | Video Engine | Keeps one seamless portrait stream active across all 24 workflow screens | Prevents black-frame swap flicker |
| F-1.2: Closed-Mouth Rest Settle | Motion Smoothness | Waits up to 0.7s or glides to the closest neutral closed-mouth pose when stopping | Eliminates awkward frozen expressions |
| F-1.3: Portrait Fallback | Media Resilience | Displays a static high-resolution avatar portrait automatically if video cannot load | Keeps stage presentable offline |
| F-1.4: Reduced Motion Mode | Accessibility | Honors OS reduced-motion preferences cleanly without disabling captions or voice | Supports sensitive visitors |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Aria finishes saying "Welcome to MantraCare!" | Completes greeting and switches to listening | **Mouth closes smoothly onto the nearest resting frame within 0.7s and holds a calm attentive pose** |
| 2 | Kiosk runs on a terminal with Reduced Motion turned on | Visitor taps Appointment | **Aria stays calmly still while live status chips and spoken captions guide every step** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Waiting-Room Patient | When watching Aria speak on a large lobby screen, I want natural lip movement and smooth pauses, so that the experience feels calm and reassuring. |
| F-1-J2 | Accessibility Lead | When visitors have motion sensitivity, I want OS reduced-motion settings respected while preserving full text and caption clarity. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given Aria transitions from speaking to resting, then her portrait MUST settle seamlessly onto a neutral closed-mouth pose within 0.7 seconds without black screen flicker. |
| F-1-2 | Given OS reduced-motion preference is enabled, then video animation MUST stay paused on a neutral frame while all captions remain legible. |

---

### F-2: Six-State Ambient Glow Halo & Live Status Pill (`Aria • Virtual AI Receptionist`)
#### 1. What it does
Surrounding Aria's silhouette, a soft ambient halo and dark glass identity pill (`Aria • Virtual AI Receptionist`) communicate her exact activity state even when the kiosk is muted or across a noisy lobby:
- **Ready (Cool Soft Blue Glow + Green Dot):** Waiting calmly for touch or voice input.
- **Speaking (Bright Clinical Blue Glow):** Actively speaking guidance aloud.
- **Listening (Vibrant Blue Pulse + Mic Badge):** Microphone open and actively capturing visitor speech.
- **Thinking (Light Blue Glow + Spinner):** Looking up schedules, verifying codes, or routing requests (accompanied by helpful messages like `"Verifying security code..."`).
- **Verified (Emerald Green Glow):** Check-in token issued or QR invoice payment reconciled.
- **Assistance (Slate Glow):** Offering gentle clarification on unrecognized speech.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: 6 Color-Coded Glow States | Visual Aura | Shifts backdrop aura subtly between Ready, Speaking, Listening, Thinking, Verified, and Assistance | Instant pre-attentive awareness |
| F-2.2: Live Glass Status Badge | Accessibility Cue | Displays icon + state word (`Ready`, `Speaking`, `Listening`, contextual thinking text, `Verified`, `Assistance`) | Essential for deaf or hard-of-hearing patients |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor submits 4-digit OTP | Enters final digit | **Aura shifts to soft Thinking blue and status pill displays "Verifying security code..." until results load** |
| 2 | Patient receives queue token D-042 | Confirms check-in | **Aura turns celebratory Emerald Green and badge reads "Verified"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Hard-of-Hearing Visitor | When kiosk sound is muted or soft, I want clear visual status lights and badges, so that I always know when Aria is speaking, thinking, or listening to me. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given each of the six interaction states (`idle`, `speaking`, `listening`, `thinking`, `success`, `apologetic`), then the ambient halo and status pill MUST display its corresponding label and color cue. |

---

### F-3: Noise-Filtered Clinic Speech Capture & Automatic Voice Backup
#### 1. What it does
Hospital lobbies have HVAC hum, footsteps, and distant conversations. To ensure reliable voice interaction without hearing Aria's own speakers:
- **Opening-Syllable Pre-Buffer:** Retains ~`0.6 seconds` of audio right before voice threshold crossing so words like *"Where..."* or *"Check in..."* are never clipped at the start.
- **Noise & Burst Filtering:** Adapts continuously to background lobby noise levels, discards short coughs, taps, or bangs (`under 0.40 seconds`), and concludes listening automatically after `0.8 seconds` of trailing silence (up to `8 seconds` max per phrase).
- **Acoustic Echo Guard:** Pauses microphone capture briefly (`~0.45 seconds`) after Aria finishes speaking so she never mistakes her own voice for a patient's request.
- **Seamless Server-to-Browser Backup:** Uses high-accuracy English and Hindi Whisper speech transcription when configured (with an `8-second` timeout guard), and falls back automatically to native browser speech recognition (`English` / `Hindi`) if cloud speech keys are absent or offline.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: 0.6s Speech Pre-Roll | Capture Buffer | Keeps opening fraction of a second prior to threshold onset | Prevents cut-off first words |
| F-3.2: Click/Cough & Silence Rules | Smart Segmentation | Ignores bursts `< 0.40s`; closes phrase cleanly after `0.8s` silence or `8s` limit | Fast response without premature cutoffs |
| F-3.3: Speaker Echo Protection | Acoustic Guard | Mutes mic output monitoring and waits `~0.45s` after Aria speaks | Zero self-triggering loops |
| F-3.4: Dual Transcription Stack | Cloud + Local Backup | Prefers Whisper speech transcription (`en`/`hi`) and auto-switches to browser speech when offline/unconfigured | Guarantees voice availability everywhere |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Lobby AC hums steadily while patient asks "Where is pharmacy?" | Speaks naturally at conversational volume | **Pre-buffer preserves "Where"; trailing silence ends capture at 0.8s; transcript resolves cleanly** |
| 2 | Visitor coughs briefly (`0.2s`) | Single sharp sound occurs | **Ignored locally as sub-0.40s burst with no false apology prompt** |
| 3 | Clinic runs offline static demo without cloud speech API key | Speaks voice command | **Automatically switches to browser speech recognition so voice workflows keep working** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient in Noisy Lobby | When talking to the kiosk with ambient room noise, I want my opening words captured intact without triggering false responses to coughs or echoes. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given captured sound lasts less than 0.40 seconds, then it MUST be discarded locally without submitting a transcription request. |
| F-3-2 | Given cloud speech transcription is unconfigured or times out after 8 seconds, then the kiosk MUST degrade cleanly to browser speech recognition without locking the screen. |

---

### F-4: Smart Priority Intent Understanding & Anti-Loop Protection
#### 1. What it does
Every recognized phrase evaluates strictly from **most specific to most general**, ensuring direct questions always win over broad menus:
1. **Priority 1 — Direct Room, Doctor & Bilingual Synonyms:** Recognizes specific room names/numbers, doctor names, or common English/Hindi everyday words (*washroom, bathroom, dawai/pharmacy, paani/water, lab, billing counter*) and jumps straight to the matching room's walking directions card!
2. **Priority 2 — Department Category:** Broad zone names (*Clinical & Doctors, Pharmacy & Labs, Facilities*) open that category's room list.
3. **Priority 2.4 & 2.5 — Visit Status & Next Steps:** Phrases like *"View Details"*, *"What's next?"*, or *"My status"* route into active visit progress or step instructions.
4. **Priority 3A–3D — Top Workflows:** Evaluates Feedback (**3A**), Appointment / Check-in / Walk-in (**3B**), Billing / Invoice Pay (**3C**), and Generic Directions (**3D**). Note that *"Where is the billing counter?"* matches Priority 1 room directions instead of opening invoice payment!
5. **Priority 4 — Non-Looping Helpful Clarification:** On the **first** unclear phrase, Aria gently asks the visitor to tap an option or state Appointment, Billing, Directions, or My Visit. If repeated unrelated lobby chatter continues afterward, she stays quietly attentive without nagging spoken apologies on loop.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Direct Destination Override | Priority 1 | Routes room, doctor, and EN/HI synonym queries straight to Walking Directions | Skips category selection menus |
| F-4.2: Category & Status Intents | Priority 2–2.5 | Matches department names, `"View Details"`, and `"What's next / My status"` | Smooth conversational care guidance |
| F-4.3: Core Module Intents | Priority 3A–3D | Opens Feedback, Check-In, Billing, or Directions directory when spoken broadly | Specific location queries always beat broad keywords |
| F-4.4: Anti-Loop Silence Guard | Priority 4 | Speaks gentle clarification once; stays quiet on consecutive background chatter | Keeps clinic waiting rooms peaceful |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Hindi speaker asks "Dawai kahan milegi?" | Speaks Hindi query for medicine/pharmacy | **Priority 1 matches Pharmacy Counter directly and displays & speaks directions** |
| 2 | Background conversation triggers 3 garbled transcripts | Unrelated chatter hits mic thrice | **Aria prompts gently on miss #1, then resumes quiet listening on misses #2–#3 without repeating apologies** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Visitor Asking Specific Question | When I ask for a specific doctor, pharmacy, or restroom, I want to jump directly to its walking directions rather than landing on a generic menu. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given a visitor says `"Where is the pharmacy?"`, then the kiosk MUST open the Pharmacy walking directions directly rather than the top-level Directions categories. |
| F-4-2 | Given two consecutive unrecognized utterances occur, then Aria MUST speak the clarification message only once and MUST NOT loop spoken errors repeatedly. |

---

### F-5: Hands-Free In-Screen Voice Commands
#### 1. What it does
Voice control remains active inside every task step so patients holding bags, crutches, or young children can progress cleanly without tapping glass:
- **Face Check-In:** Say *"Start scan"* to launch countdown or *"Use phone"* to switch screens.
- **Privacy Confirmation:** Say *"Yes, that's me"* / *"Correct"* to confirm, or *"Not me"* / *"No"* to reject safely.
- **Phone & OTP Keypads:** Speak digits naturally to populate numbers, plus *"Clear"*, *"Send"*, *"Verify"*, or *"Continue"*.
- **Onboarding & Global Navigation:** Dictate Name and Reason for Visit, say *"Approve"* / *"Edit"* / *"Skip"*, or speak *"Back"*, *"Home"*, and *"Start over"* from any step.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Identity & Confirm Voice Actions | Check-In Control | Maps spoken `"start"`, `"use phone"`, `"yes that's me"`, `"not me"` hands-free | Accessible touch parity |
| F-5.2: Spoken Keypad Digits | Input Commands | Appends spoken numbers to Phone/OTP fields and executes Send/Verify | Eliminates small-button squinting |
| F-5.3: Global Navigation Commands | Exit & Backtrack | Recognizes `"back"`, `"home"`, and `"start over"` across all 24 workflow states | Works identically to dock buttons |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Visitor holding child says "Yes, that's me" on Privacy Verification | Speaks confirmation phrase | **Confirms match and loads Visit Summary hands-free** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Hands-Full / Mobility-Limited Patient | When checking in with luggage or mobility aids, I want to answer confirmations, speak phone numbers, and go back entirely by voice. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | Given the kiosk is on **Privacy Verification** and the visitor says `"Yes, that's me"`, then identity confirmation MUST trigger identically to tapping the confirmation button. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Flicker-Free Lip-Sync & Rest Poses | F-1.1 to F-1.4 | Single continuous avatar stage settling smoothly onto closed-mouth rest frames with reduced-motion support. |
| F-2 | Six-State Glow Halo & Status Badge | F-2.1 to F-2.2 | Communicates Ready, Speaking, Listening, Thinking, Verified, and Assistance visually at all times. |
| F-3 | Noise-Filtered Speech Capture & Backup | F-3.1 to F-3.4 | Preserves opening words, drops short bursts/echoes, and fails over gracefully to browser speech. |
| F-4 | Priority Intent Routing & Anti-Loop | F-4.1 to F-4.4 | Ranks room/doctor/bilingual queries ahead of broad flows and suppresses repetitive error loops. |
| F-5 | Hands-Free Screen Voice Commands | F-5.1 to F-5.3 | Supports voice scan, identity confirm, digit dictation, review actions, and `"Start over"` across screens. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | All Clinic Visitors | Interact smoothly with a natural, expressive digital receptionist in noisy waiting rooms or hands-free. | F-1, F-2, F-3, F-5 |
| 2 | Bilingual & Question-Driven Visitors | Get routed directly to answers, rooms, or tasks in English or Hindi without hearing repeated error prompts. | F-4 |
