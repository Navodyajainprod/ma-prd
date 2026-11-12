---
title: "Biometric Consent, Minor Safeguards & Revocation"
product: "ai-receptionist"
module: "my-visit"
channel: "biometric-consent"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | My Visit & Process Guidance - Biometric Privacy & Consent (`/reception/*`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Staff Biometric Status & Deletion (`Biometric Face Check-in`) | Inside Client profiles, staff see whether a patient is enrolled (`Enrolled on ...` vs `Not enrolled`), enroll them on request, or permanently delete their face data (`Delete face data`). | [View in Client](/client/clients) |
| Client | Reception Facility Governance | Clinic reception configuration governs lobby deployment alongside patient privacy guarantees. | [View in Client](/client/settings/reception) |
| Client | Biometric Consent & Revocation Audit Trail | Enrollment grants, kiosk check-ins, and biometric deletions append timestamped entries inside the clinic audit logs and client profile timeline. | [View in Client](/client/settings/audit-logs) |
| Client | Clinic Security Standards | Aligns lobby zero-PHI gates, minor protection, and consent revocation with clinic security controls. | [View in Client](/client/settings/security) |
| Companion | Passwordless / Non-Biometric Alternative | Patients who choose `"Skip for now"` or delete face data retain full visit tracking via phone and Companion Today. | [View in Companion](/companion/today) |
| Admin | Role-Based Privacy Permissions | Platform role policies control administrative access to compliance and client data controls. | [View in Admin](/admin/roles) |

## 1. Module Summary
- Public waiting-room kiosks using cameras require crystal-clear privacy boundaries so patients trust that passive lobby greeters never covertly track passersby or retain photos without permission.
- This specification covers the end-to-end **biometric privacy guarantees, consent choices, minor exclusions, audit history, and one-click staff revocation** spanning both the lobby kiosk and MantraAssist front-desk client profiles (**Biometric Face Check-in**).

## 2. Feature Requests

### F-1: Strict Separation Between Passive Lobby Greeting & Saved Biometrics
#### 1. What it does
Camera activity on the AI Receptionist operates in two strictly isolated modes so visitors walking past an idle screen are never identified or profiled:
1. **Ephemeral Ambient Approach Sensing (Home Screen):** Checks only approximate face size on screen (`>= 30%` height sustained briefly) purely to trigger a friendly spoken greeting — **zero facial matching runs, zero photos are captured, and nothing is saved**. A permanent top-right badge displays **"Camera active for greeting only"**.
2. **Intentional Biometric Check-In / Registration:** Runs ONLY when a patient actively initiates Appointment Check-In (`Start scanning`) or explicitly opts in during adult onboarding (`Register my face`), storing compact mathematical vector representations rather than raw saved camera photographs.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Zero-Identification Lobby Greeting | Privacy Boundary | Guarantees passive approach sensing never queries patient identity or saves images | Discarded in memory immediately |
| F-1.2: `"Camera active for greeting only"` Indicator | Transparency Pill | Displays clear camera purpose right on the standing lobby display | Reassures waiting-room visitors |
| F-1.3: Encrypted Vector Representation | Privacy Storage | Stores compact numeric template representation with consent timestamp rather than photo archives | Cannot reconstruct raw camera snapshots |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Enrolled patient stops briefly near idle home kiosk | Stands before home screen | **Aria greets generally without displaying their name, phone, or appointment on the public home screen** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Privacy Compliance Officer | When deploying a camera-enabled greeting kiosk in a clinic lobby, I want passive approach detection completely separated from biometric recognition so no one is silently tracked. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given the kiosk is on the passive Home screen, then facial recognition matching and template saving MUST NOT execute regardless of how long a visitor stands in view. |

---

### F-2: Zero-PHI Confirmation (`Privacy Verification`) & Mandatory Under-18 Exclusion
#### 1. What it does
Two strict safeguards protect patient confidentiality and underage minors across every check-in:
1. **Zero-PHI Pre-Confirmation (`Privacy Verification`):** Even after an accurate face scan match, no full surname, phone number, medical appointment, doctor, or bill appears until the visitor confirms **`"Hi <FirstName>, is this you?"`** -> **Yes, that's me**. Selecting **Not me** clears the tentative match instantly.
2. **Automatic Under-18 Minor Prohibition:** Whenever walk-in intake records an age **under 18**, the kiosk automatically bypasses **Register your face** (`Step X of 4` instead of `5`), stores zero templates, and stamps **`"Not available (under 18)"`** cleanly on the review summary.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: First-Name-Only Gate | Presentation Guard | Reveals only first name + match percentage prior to **Yes, that's me** tap | Prevents lobby shoulder-surfing |
| F-2.2: Minor Exclusion (`under 18`) | Safety Rule | Suppresses biometric consent & capture completely when patient age is below 18 | Enforced automatically in UI and step tracker |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | False tentative match occurs for another patient | Sees `"Hi Rohan, is this you?"` and taps **Not me** | **Zero surname, schedule, or phone data is ever shown; clears safely to Phone check-in** |
| 2 | Parent checks in a 14-year-old child | Enters Age 14 in New Patient Details | **Face enrollment screen skipped automatically; summary notes `"Not available (under 18)"`** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Parent / Pediatric Clinic | When registering children under 18 at the kiosk, I want facial biometric capture prevented automatically with zero exceptions. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a tentative face match occurs, then full name, phone, doctor, and invoice data MUST stay hidden until **Yes, that's me** is selected. |
| F-2-2 | Given patient age is under 18, then biometric enrollment MUST NOT appear and zero biometric templates MUST be stored. |

---

### F-3: Informed Adult Opt-In, Unpenalized **Skip for now** & Audit History
#### 1. What it does
During adult walk-in registration, **Register your face** displays an explicit **Biometric Privacy & Consent** explanation: *"We save an encrypted biometric vector template... We do not store raw photos or share your biometrics. You may revoke consent anytime."*
- **True Voluntary Choice:** Tapping **Skip for now** moves straight into Review and Walk-In Booking with identical wait priority and full clinic care.
- **Explicit Consent Requirement:** Biometric templates cannot be saved unless explicit consent is granted (`Register my face`).
- **Duplicate Enrollment Prevention & Audit Log:** Checks strongly similar templates (`0.85` collision guard) to prevent duplicate patient profiles and appends timestamped **face enrolled** and **face deleted** audit records visible inside the client's activity history.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Voluntary **Skip for now** | Opt-Out Choice | Advances identically to booking without requiring facial enrollment | Zero queue or service penalty |
| F-3.2: Consent Validation Guard | Policy Enforcer | Rejects saving any face vector without verified patient consent | Prevents accidental silent enrollment |
| F-3.3: Timestamped Biometric Audit Feed | Compliance Trail | Logs enrollment and deletion dates clearly on the patient's profile timeline | Full lifecycle traceability |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Adult patient prefers phone check-in only | Taps **Skip for now** on Biometric Privacy & Consent | **Proceeds immediately to Review & Service Selection; zero face data saved** |
| 2 | Adult completes 3-angle registration and approves | Taps **Approve & Continue** on Review | **Consent timestamp and enrolled status record cleanly in audit log and patient profile** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Clinic Auditor | When reviewing privacy compliance, I want clear timestamped proof of when patients opted in or withdrew facial biometric consent. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given an adult visitor selects **Skip for now**, then walk-in booking MUST proceed identically with zero biometric templates persisted. |
| F-3-2 | Given biometric consent is granted or revoked, then a corresponding timestamped audit event MUST appear in the clinic audit history. |

---

### F-4: Front-Desk **Biometric Face Check-in** Controls & Permanent Deletion
#### 1. What it does
Whenever a patient asks front-desk staff in person or by phone to remove their stored face data, MantraAssist provides the **Biometric Face Check-in** card inside Client management (*"Autonomous AI Receptionist patient identification"*):
- **Live Enrollment Status:** Displays **`Enrolled on [date]`** when active or **`Not enrolled`** otherwise.
- **Instant Consent Revocation (`Delete face data`):** Clicking **Delete face data** confirms permanent removal, erases the stored biometric template, clears enrollment flags on the client profile, logs a biometric deletion event to the patient's timeline, and flips the status immediately to **Not enrolled**. Future kiosk face scans will no longer recognize that patient.
- **Quick Staff Enrollment (`Enroll Face Check-in`):** When not enrolled, authorized staff can enroll a patient upon request directly from their profile card.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Enrollment Status Badge | Staff Card | Shows `"Enrolled on ..."` date vs `"Not enrolled"` inside patient profile | Synced live with kiosk store |
| F-4.2: **Delete face data** Action | Consent Purge | Confirms deletion, erases stored face vector, and appends audit deletion entry | Immediate right-to-be-forgotten compliance |
| F-4.3: **Enroll Face Check-in** Control | Staff Action | Allows staff to enable biometric check-in when requested by an adult patient | Available whenever status is Not enrolled |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient asks receptionist to erase their stored face scan | Receptionist opens Client profile -> **Biometric Face Check-in** -> clicks **Delete face data** -> confirms | **Face template permanently purged, timeline logs deletion, card shows "Not enrolled", and kiosk scan no longer matches** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front Desk Manager | When a patient requests removal of their facial check-in data, I want a one-click deletion control with confirmation that immediately disables face recognition on all lobby kiosks. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given staff click **Delete face data** and confirm, then the card status MUST update immediately to **Not enrolled**, an audit deletion record MUST log, and subsequent kiosk face scans MUST NOT match that patient. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Passive Greeting vs Biometric Isolation | F-1.1 to F-1.3 | Keeps lobby home presence strictly non-identifying with transparent `"Camera active for greeting only"` notice. |
| F-2 | Zero-PHI Confirmation & Minor Exclusion | F-2.1 to F-2.2 | Hides sensitive info until first-name confirmation and blocks under-18 biometric collection automatically. |
| F-3 | Informed Opt-In & Audit History | F-3.1 to F-3.3 | Supports unpenalized **Skip for now**, mandatory consent validation, duplicate checks, and audit trails. |
| F-4 | Front-Desk Status & Permanent Deletion | F-4.1 to F-4.3 | Gives clinic staff live status badges, quick enrollment, and one-click **Delete face data** purge. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Patient & Parent | Trust that lobby kiosks never silently profile visitors, protect children automatically, and offer fair opt-out choices. | F-1, F-2, F-3 |
| 2 | Privacy Lead & Front Desk | Honor deletion requests instantaneously from Client profiles with verifiable audit timestamps. | F-3, F-4 |
