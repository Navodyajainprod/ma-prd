---
title: "SMS Carrier Messaging, 10DLC Compliance & Segment Calculator"
product: "Client"
module: "chat"
channel: "sms"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | Client |
| Module | Chats & Care Groups - SMS Channel (`/chats?channel=sms`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Dual-Channel Patient Communication | When a patient is registered in the clinic system with a mobile number, urgent clinical notices sent via SMS reach their mobile carrier inbox even when the patient does not have mobile data enabled. | [View in Companion](/companion/chat) |

## 1. Module Summary
- The SMS channel in Client Chats provides standard cellular carrier text messaging integrated with registered 10DLC (10-Digit Long Code) healthcare carrier campaigns. It enables practice staff to send text reminders, appointment confirmations, and triage responses to any SMS-enabled phone number.
- Front desk triage agents, care coordinators, and practice billing specialists use this module.
- Accessed in the Client workspace via Chats & Care Groups > SMS.

## 2. Feature Requests

### F-1: Direct Patient SMS Conversation Threading & Number Binding
#### 1. What it does
Aggregates inbound and outbound cellular SMS messages into dedicated 1:1 patient threads linked to the patient's verified mobile phone number. Staff can view past communication history, patient demographic snippets, and transport carrier indicators.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Mobile Number Validation | Logic | Verifies international E.164 phone formatting before dispatch | Highlights invalid country codes |
| F-1.2: SMS Thread Stream | UI List | Renders SMS threads with cellular icon, patient name, and last snippet | Real-time webhook update |
| F-1.3: Thread Search Bar | Input | Filters threads by patient phone number or name | Substring search |
| F-1.4: Inbound Unread Counter | UI Badge | Flags unread cellular SMS responses | Clears on click |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient text arrives from +1-555-0142 | Patient texts: "Running 15 mins late" | **Thread appears in SMS channel with blue SMS badge and unread dot** |
| 2 | Staff enters "+1-555" into search bar | Staff searches phone digits | **List filters instantly to matching patient phone number** |
| 3 | Staff types reply and hits Send | Sends: "Thank you for letting us know." | **Message posts with single check (sent) and carrier delivery timestamp** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Receptionist | When patients without smartphones or mobile apps need communication, I want to message them via standard SMS, so that they receive care updates without downloading an app. |
| F-1-J2 | Practice Coordinator | When triaging phone inquiries, I want to search directly by phone number, so that I can open the corresponding patient thread immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given an inbound SMS message from an existing patient, when received, then it is automatically mapped to the patient's chart and contact profile. |
| F-1-2 | Given any SMS thread, when viewed in the Client topbar, then the "New Group" button is hidden. |

### F-2: 10DLC Healthcare Compliance & Automated Opt-Out Handling
#### 1. What it does
Enforces cellular carrier regulations (A2P 10DLC) for healthcare text messaging. Monitors carrier keyword opt-outs (STOP, UNSUBSCRIBE, CANCEL) and opt-ins (START, UNSTOP). When a patient texts STOP, the system locks outbound SMS to that number, surfaces an opt-out banner, and logs the compliance event.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Automated STOP Interceptor | Logic | Detects carrier STOP keywords and flags contact as opted-out | Blocks carrier transmission |
| F-2.2: Opt-Out Warning Banner | UI Banner | Displays amber warning banner: "Patient has opted out of SMS messaging" | Explains re-opt-in keyword |
| F-2.3: Re-opt-in (START/UNSTOP) | Logic | Re-enables SMS messaging when patient texts START or UNSTOP | Restores composer input |
| F-2.4: Healthcare Compliance Audit | Data Log | Preserves immutable audit log of all opt-out and opt-in timestamps | For TCPA compliance |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient texts "STOP" to clinic number | Patient sends opt-out keyword | **System locks composer, marks status as "Opted Out", and posts confirmation notice** |
| 2 | Staff attempts to send message to opted-out patient | Staff views composer in SMS thread | **Composer displays disabled input with message: "Patient has opted out of SMS. Outbound messaging is blocked."** |
| 3 | Patient subsequently texts "UNSTOP" | Patient sends re-subscribe keyword | **System unblocks thread and re-enables message input immediately** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Compliance Officer | When patients request to stop messages, I want automated carrier opt-out enforcement, so that TCPA regulations and carrier compliance are strictly maintained. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a patient text containing "STOP", when received, then outbound SMS is immediately disabled for that phone number. |
| F-2-2 | Given an opted-out contact, when staff views the thread, then an explicit compliance banner is visible and composer is locked. |

### F-3: GSM-7 & UCS-2 Character Segment Calculator & Cost Preview
#### 1. What it does
Calculates cellular SMS message segments in real time as staff types. Displays character count and segment count (160 characters per segment for standard GSM-7 text; 70 characters per segment if Unicode or emojis are included) to optimize carrier message dispatch costs.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Character & Segment Counter | UI Indicator | Shows character count and segment tally (e.g. "142/160 (1 segment)") | Placed at bottom right of composer |
| F-3.2: Unicode / Emoji Detector | Logic | Detects non-GSM-7 characters and switches calculation threshold to 70 chars | Warns user of Unicode penalty |
| F-3.3: Segment Warning Badge | UI Badge | Warns staff when message exceeds 3 segments (> 480 characters) | Encourages concise phrasing |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff types standard text: "Your prescription is ready for pickup." | Types 41 characters | **Counter displays "41/160 (1 segment)" in subtle monochrome text** |
| 2 | Staff adds medical emoji (💊) to message | Inserts emoji | **Counter transitions calculation: "43/70 (1 segment, Unicode)"** |
| 3 | Staff types lengthy 350-character clinical guide | Types text | **Counter indicates "350/480 (3 segments)"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Front Desk Staff | When drafting SMS reminders, I want to see character and segment counts, so that I keep messages concise and avoid unnecessary carrier segment costs. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given standard ASCII text, when entered in composer, then segments calculate based on 160 characters per segment. |
| F-3-2 | Given Unicode or emoji characters, when entered, then segment calculation switches to 70 characters per segment. |

### F-4: SMS Topbar Controls & Scoped Action Scoping
#### 1. What it does
Configures topbar actions specific to the SMS channel. Staff have access to sender ID selectors, contact search, and unread filters. "New Group" is strictly hidden (as multi-party groups are unsupported on cellular SMS and scoped exclusively to Companion). "Message Actions & Settings" cog is enabled on message bubbles.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Sender Number Display | UI Tag | Displays the outbound practice SMS number being used | Verified 10DLC number |
| F-4.2: New Group Button Removal | Policy | Strictly hides "New Group" button on SMS channel | Cellular carrier group unsupported |
| F-4.3: Message Actions Cog | UI Control | Contextual menu on message bubbles (Copy, Quote, Resend) | Active on SMS bubbles |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff inspects SMS channel topbar | Filters to SMS channel | **Topbar displays SMS sender ID and search; "New Group" button is absent** |
| 2 | Message delivery fails due to invalid carrier number | Gateway reports carrier error 30008 | **Error banner displays next to bubble with "Delivery failed - click to retry"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Coordinator | When triaging SMS chats, I want a clean topbar without group buttons, so that workflow actions match carrier capabilities. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given the SMS channel view, then the "New Group" button is hidden from the topbar. |
| F-4-2 | Given a failed SMS dispatch, then an inline retry trigger and failure reason are displayed. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Direct Patient SMS Threading & Number Binding | F-1.1 Number Validation, F-1.2 Thread Stream, F-1.3 Phone Search, F-1.4 Unread Counter | Cellular SMS patient messaging mapped to contact charts with phone number searching. |
| F-2 | 10DLC Healthcare Compliance & Automated Opt-Out | F-2.1 STOP Interceptor, F-2.2 Opt-Out Banner, F-2.3 Re-opt-in, F-2.4 Audit Log | Automated carrier STOP/UNSTOP compliance engine with composer locking and TCPA audit tracking. |
| F-3 | GSM-7 & UCS-2 Character Segment Calculator | F-3.1 Character Counter, F-3.2 Unicode Detector, F-3.3 Segment Warning | Real-time segment calculator estimating message limits (160 GSM / 70 Unicode) and costs. |
| F-4 | SMS Topbar Controls & Scoped Action Scoping | F-4.1 Sender Display, F-4.2 Group Button Removal, F-4.3 Message Actions | Clean SMS topbar omitting group creation while supporting message actions and delivery retries. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist | When patients without smartphones or mobile apps need communication, I want to message them via standard SMS, so that they receive care updates without downloading an app. | F-1 |
| 2 | Practice Coordinator | When triaging phone inquiries, I want to search directly by phone number, so that I can open the corresponding patient thread immediately. | F-1 |
| 3 | Compliance Officer | When patients request to stop messages, I want automated carrier opt-out enforcement, so that TCPA regulations and carrier compliance are strictly maintained. | F-2 |
| 4 | Front Desk Staff | When drafting SMS reminders, I want to see character and segment counts, so that I keep messages concise and avoid unnecessary carrier segment costs. | F-3 |
| 5 | Practice Coordinator | When triaging SMS chats, I want a clean topbar without group buttons, so that workflow actions match carrier capabilities. | F-4 |

### Open Items
- To confirm: Should outbound SMS allow MMS attachments (images/vCards) or remain strictly text-only across carrier trunks?
- To confirm: Can multiple practice SMS numbers be configured per department or is one central 10DLC number shared?

