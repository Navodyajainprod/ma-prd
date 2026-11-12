---
title: "Process Stage & Personalized Next-Step Guidance"
product: "ai-receptionist"
module: "my-visit"
channel: "next-step"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | My Visit & Process Guidance - Next-Step Guidance (`/reception/my-visit`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Process Pipeline & Stage Visibility | Only processes connected to AI Receptionist and stages enabled for patient/kiosk display surface on the lobby Next-Step cards; moving a patient card in Kanban updates kiosk guidance live. | [View in Client](/client/processes/kanban) |
| Client | Process List & Stage Builder | Coordinators author Card Titles, Card Descriptions, and HTML guidance sheets inside Stage Portal & Reception Settings. | [View in Client](/client/processes/list) |
| Client | Station & Stage Guidance Settings | Reception Settings configures station mappings while stage templates populate personalized doctor, room, and invoice details cleanly. | [View in Client](/client/settings/reception) |
| Companion | Shared Next-Step Instructions | Personalized care instructions and stage cards shown at the kiosk mirror the patient's mobile Companion experience. | [View in Companion](/companion/today) |

## 1. Module Summary
- The **Process Stage & Personalized Next-Step Guidance** experience turns clinical workflows configured by clinic staff into clear, patient-friendly next actions right at the lobby kiosk.
- When a verified patient asks Aria *"What's next?"* or *"My status"*, or navigates inside My Visit, the kiosk reads their current stage in any **AI Receptionist-connected process**, filters out internal-only staff stages, and presents a branded summary card plus a rich **"View Details"** instruction sheet filled automatically with their actual name, doctor, room, appointment time, and balance.

## 2. Feature Requests

### F-1: Voice & Touch `"What's Next?"` Process Discovery
#### 1. What it does
Visitors can check what step comes next in their clinical journey by asking Aria *"What's next?"*, *"What is my status?"*, or *"Next step"*, or by opening Next-Step guidance after verifying via Phone & OTP. Once verified, the kiosk locates the patient's active **AI Receptionist-connected process** (automatically using their assigned clinic pipeline or matching active care workflow) and prepares their current or next patient-visible stage cleanly.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Conversational Next-Step Trigger | Voice Intent | Understands natural queries (`"What's next?"`, `"My status"`) anywhere on kiosk | Initiates quick verification if visitor is unauthenticated |
| F-1.2: AI-Connected Process Lookup | Workflow Resolution | Inspects processes marked enabled for AI Receptionist in Process settings | Ignores internal back-office workflows automatically |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Post-intake patient asks Aria "What's next for me?" | Speaks phrase and verifies phone/OTP | **Kiosk resolves their active onboarding workflow and opens their customized Next-Step stage card** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Returning / Multi-Step Patient | Between intake, lab tests, and follow-ups, I want to ask "What's next?" and immediately see my current step in the clinic's care workflow. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a verified patient is enrolled in a process connected to AI Receptionist, when asking `"What's next?"`, then the kiosk MUST display their active process stage card rather than internal back-office workflows. |

---

### F-2: Patient-Friendly Stage Summary Cards & Visibility Filtering
#### 1. What it does
Instead of exposing internal operational column names (like *"Verify Insurance — Billing Hold"*), each patient-visible stage renders its dedicated **Next-Step Summary Card** authored by clinic coordinators:
- **Stage Card Header & Color Accent:** Displays the stage's accent dot, custom **Card Title** (or friendly stage name fallback), process progress position (e.g., *Step 2 of 4*), and **Card Description** summarizing the immediate action.
- **Voice Readout:** Aria reads the stage title and summary aloud in clear language.
- **Internal Stage Hiding:** Stages toggled OFF for patient/kiosk visibility are skipped automatically so internal staff triage notes never display publicly on lobby glass, advancing cleanly to the next visible patient milestone.
- **Action Button:** Prominent **View Details** CTA (also triggered by saying *"View Details"*) opens the full instruction sheet.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Custom Stage Card Presentation | UI Card | Displays stage color badge, **Card Title**, step position, and **Card Description** | Concise and easy to scan in 3 seconds |
| F-2.2: Patient Visibility Filter | Privacy Guard | Hides staff-only workflow stages automatically from lobby display | Respects per-stage coordinator toggles |
| F-2.3: **"View Details"** Voice & Touch CTA | Drill-Down | Opens full formatted guidance page via tap or spoken *"View Details"* | Keeps summary card uncluttered |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff move patient from `"Internal Triage Review"` (hidden) into `"Pre-Consult Vitals"` (visible) | Patient checks Next Step at kiosk | **Hidden triage stage stays invisible; kiosk displays "Proceed to Vitals Station" card and View Details CTA** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinic Coordinator | When designing internal process stages, I want staff-only columns hidden from patients while exposing clear patient-friendly card titles and summaries. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a workflow stage has kiosk/portal visibility turned OFF, then that stage MUST NOT be shown on the kiosk Next-Step card. |
| F-2-2 | Given a visible stage has custom **Card Title** and **Card Description**, then both MUST display prominently alongside **View Details**. |

---

### F-3: Dynamic Personalized Guidance Sheet (**View Details**)
#### 1. What it does
Selecting **View Details** (by tap or voice) opens the rich **Next-Step Details** preparation screen designed by coordinators using the visual guidance editor, automatically substituting live patient and visit placeholders:
- **Patient Fields:** Full Name, First Name, Last Name, Phone, Email, Client ID.
- **Appointment Fields:** Date, Time, Consultation/Service Name, Assigned Doctor, Consultation Room.
- **Billing & Stage Fields:** Invoice ID, Invoice Total, Outstanding Balance Due, Payment Status, Current Stage Name, Active Care Workflow, and Clinic Name.
- **Clean Unresolved Placeholder Guard:** Any optional variable missing data for that patient cleanly resolves blank rather than showing raw unfilled placeholder brackets on the lobby screen! Also includes a clear Back action returning to the Stage Summary Card or Home.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Rich HTML Guidance Canvas | Instruction Sheet | Displays formatted headings, checklists, fasting instructions, and room notes | Easily authored by non-technical coordinators |
| F-3.2: Live Patient & Visit Merge | Personalization | Fills real patient name, doctor, time, room, and open invoice amounts dynamically | Reflects latest calendar and billing values |
| F-3.3: Placeholder Cleanup Guard | Display Polish | Hides unresolved optional fields cleanly so raw placeholder markers never appear | Guarantees clean copy even on walk-ins without invoices |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Fasting Lab stage card inserts **Patient First Name**, **Appointment Provider**, and **Invoice Balance Due** fields | Patient taps **View Details** | **Displays: "Welcome, Priya! Please proceed to Lab 1 before seeing Dr. Mehta at 10:30 AM. Current balance due: $0.00."** |
| 2 | Patient has no open invoice yet | Guidance sheet includes optional Invoice Balance Due field | **Unfilled field disappears cleanly with zero raw placeholder text on screen** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Patient Preparing for Next Step | When I open "View Details", I want step-by-step instructions tailored with my own doctor, room, time, and balance rather than generic boilerplate. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given **View Details** opens for a patient with an active appointment, then personalized patient and appointment details MUST display real values and zero unfilled placeholder markers MUST remain visible. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Voice & Touch `"What's Next?"` Lookup | F-1.1 to F-1.2 | Authenticates visitors and finds their active stage inside AI-connected clinic workflows. |
| F-2 | Stage Summary Cards & Visibility Filter | F-2.1 to F-2.3 | Displays custom card titles, descriptions, and View Details while hiding staff-only stages. |
| F-3 | Personalized Rich **View Details** Sheet | F-3.1 to F-3.3 | Substitutes live patient, doctor, room, and billing variables cleanly with zero raw tokens. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Patient | Ask "What's next?" and read clear, personalized preparation steps tailored to my exact visit stage. | F-1, F-2, F-3 |
| 2 | Practice Coordinator | Control which internal workflow stages patients see and author rich instructions centrally. | F-2, F-3 |
