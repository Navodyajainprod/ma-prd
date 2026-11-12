---
title: "Patient My Tasks, Clinical Protocols & Live Sync"
product: "companion"
module: "tasks"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | Companion (Patient Mobile & Web Portal) |
| :--- | :--- |
| Module | Care Plan - My Tasks (`/patient/tasks` & `/patient/tasks/:taskId`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Care Team Assignment & Live Completion Sync | Whenever clinicians assign a task to a **Client Contact** in **Tasks by me**, it appears immediately inside **My Tasks**; checking off deliverables updates clinic progress trackers live and auto-completes the task when finished. | [View in Client Tasks by me](/client/tasks/tasks-by-me) |
| Companion | Care Chat Task Notifications | When coordinators use **Share -> Client Portal**, a `Task Assigned` card with stage, deadline, and direct portal link arrives straight inside the patient's Companion Chat conversation. | [View in Companion Chat](/companion/chat/chat) |
| Companion | Today's Agenda & Intake Forms Coordination | Keeps prescribed pre-visit checklists, HIPAA consent steps, and post-consult routines aligned alongside upcoming appointments and forms. | [View in Companion Today](/companion/today) |
| Admin | Corporate Task Firewall | Corporate and multi-org administrative tasks stay strictly hidden from the patient portal—never appearing in lists and blocking direct URL access safely. | [View in Admin](/admin/tasks) |

## 1. Module Summary
- The **Patient My Tasks, Clinical Protocols & Live Sync** module gives patients a calm, mobile-friendly **My Tasks** center (`/patient/tasks`) to review care-team instructions, read rich multimedia guides, check off prescribed deliverables step by step, and stay synchronized with their care team without exposed internal clinic jargon.
- Every item completion updates the care team's Client Portal console in real time, while internal clinic task codes (`TSK-*`), internal brackets, workflow stage controls, and corporate Admin tasks stay cleanly stripped or blocked from patient view.

## 2. Feature Requests

### F-1: Patient **My Tasks** Hub, Summary Counters & Search (`/patient/tasks`)
#### 1. What it does
Displays all portal-scoped and patient-assigned tasks personalized to the active patient profile, organized for fast daily check-ins:
- **Live Status Pills:** Header displays instant counts for **`Action Needed`** (blue clock pill) and **`Done`** (emerald check pill).
- **Three Filter Tabs + Instant Search:** Switches cleanly between **`Action Needed (N)`** (default), **`Completed (N)`**, and **`All Tasks (N)`**, paired with a live **`Search deliverables...`** input matching cleaned task titles, descriptions, and individual deliverable titles.
- **Clean Patient-Friendly Rows:** Each row displays a circular completion ring (`X/Y done`), optional Important star, sanitized title (automatically stripping internal `[bracket]` tags and `TSK-*` tracking codes), due date (`Calendar` label), and crisp `Action Needed` / `Completed` status pill. When no items match, shows a warm **`"All Caught Up!"`** (or search reset) empty card.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: `Action Needed` & `Done` Summary Pills | Status Header | Summarizes remaining actionable deliverables vs completed tasks at a glance | Updates live as items are checked off |
| F-1.2: Tab Switcher & Deliverables Search | Filter Controls | Switches across `Action Needed`, `Completed`, and `All Tasks` and filters across task + item text | Hides technical workflow/stage clutter |
| F-1.3: Clean Title Sanitization | Patient Copy Hygiene | Strips `[admin]` brackets and `TSK-###:` codes automatically from patient-facing headlines | Keeps language welcoming and human |
| F-1.4: Progress Ring Row Cards | Visual Tracker | Shows `X/Y done` ring, due date, and priority star per assigned care task | Tapping opens `/patient/tasks/:taskId` |

#### 3. Worked example
| # | Situation | What the patient does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah opens My Tasks before her appointment | Views `Action Needed (2)` pill, scans `Complete Intake Medical History & HIPAA Consent` (`2/3 done`), and taps the row | **Opens the task deliverable page cleanly without exposing internal `TSK-104` tracking codes** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Outpatient Patient | When preparing for a clinic visit or recovery routine, I want a clean list showing only what still needs my action vs what I already finished. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Internal prefixes (`TSK-###:` and `[...]`) are stripped cleanly from all titles in `/patient/tasks` and `/patient/tasks/:taskId`. |
| F-1-2 | Filtering between `Action Needed`, `Completed`, and `All Tasks` immediately updates the displayed rows to match the patient's own deliverable completion state. |

---

### F-2: Deliverable Execution Screen & Live Clinic Sync (`/patient/tasks/:taskId`)
#### 1. What it does
Tapping any task opens a focused single-column execution screen built around **Task Info** and numbered **Your Deliverables**:
- **Task Info Card:** Shows **`Back to My Tasks`**, optional **`Priority Care`** star badge, sanitized title, `Assigned by your clinical care team • [Date]`, large circular progress ring, calm blue clinical summary box, due date, and exact **`X/Y items completed (Z%)`** progress text.
- **Numbered Deliverable Cards (`Mark as done` / `Completed (Undo)`):** Lists each clinical step (`1`, `2`, `3` turning emerald `✓` on completion) with optional priority star, instructions, and a prominent **`Mark as done`** button. Checking off an item immediately triggers a confirmation toast, updates the progress ring in place, updates the clinician's **View Breakdown** inside Client Portal, and automatically transitions the overall clinical task to **`Completed`** (`"Task Completed"` notification) once all responsible assignees finish. Accidentally tapped items revert cleanly via **`Completed (Undo)`**.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Patient Progress Ring & Header | Status Card | Displays patient-specific `%` progress, due date, and `Priority Care` badge | Never exposes clinic internal workflow stages |
| F-2.2: One-Tap **Mark as done / Undo** | Completion Control | Records per-patient item completion timestamp and toggles visual state cleanly | Syncs bi-directionally to Client Portal instantly |
| F-2.3: Automatic Task Closure Handoff | Cross-Product Trigger | Marks the shared care task Completed and alerts the clinician when the patient checks off their final deliverable | Reopens cleanly if patient taps `Undo` |

#### 3. Worked example
| # | Situation | What the patient does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient finishes the third item (`E-sign HIPAA disclosure agreement`) in their onboarding task | Taps **`Mark as done`** on Item 3 | **Progress ring fills to `100%` (`3/3 items completed`), badge turns `Completed`, and clinician's Client Tasks dashboard marks Sarah `Done` + completes the task** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Patient at Home | When I finish each step my doctor requested, I want one tap to check it off—and undo if tapped by mistake—knowing my care team sees it immediately. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Tapping **`Mark as done`** updates `X/Y items completed (%)` immediately and synchronizes completion state to Client Portal's Task Detail breakdown. |
| F-2-2 | Tapping **`Completed (Undo)`** reverses item completion cleanly and restores the task to `Action Needed`. |

---

### F-3: Rich Multimedia Clinical Resources & Downloads
#### 1. What it does
Clinician-authored **Task Studio** deliverables render natively inside each patient card so patients never have to hunt across emails or apps for supporting guides:
- **Images:** Displays high-resolution diagrams, device setup photos, or exercise guides cleanly inside rounded cards.
- **Videos:** Embedded inline video player with full playback controls for physiotherapy routines or inhaler demonstrations.
- **Downloadable Files:** Displays attachment card with filename and file size (`Download Document`) for one-tap PDF/consent downloads.
- **External URLs:** Highlighted link pills opening trusted educational portals or external questionnaires in a safe new tab.
- **Clinical Instructions & Protocol (`HTML` Block):** Renders formatted prep checklists (such as fasting rules, medication hold windows, or pre-op steps) inside a cleanly framed **`Clinical Instructions & Protocol`** box.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Inline Photo & Video Cards | Visual Guidance | Displays clinical diagrams and embedded instructional videos directly below task steps | Supports playback controls without leaving app |
| F-3.2: Safe Document Download & Links | File & URL Delivery | Provides direct file downloads (showing size/name) and external educational links | Eliminates scattered attachments |
| F-3.3: Framed Protocol HTML Sheet | Rich Prep Instructions | Displays formatted clinical protocol HTML safely inside an isolated scrollable panel | Keeps formatting legible on mobile & web |

#### 3. Worked example
| # | Situation | What the patient does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Physical therapy recovery task includes an exercise clip and fasting prep checklist | Taps play on the inline video inside Item 1 and reads the **`Clinical Instructions & Protocol`** block below Item 2 | **Patient follows visual exercise technique and formatted prep checklist right inside the task card** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Post-Op Patient | When instructions require exercises or PDF handouts, I want videos, documents, and checklists right inside each step so I don't search through old emails. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Every Task Studio resource type (`image`, `video`, `url`, `file`, `html`) authored in Client Portal renders cleanly inside the matching deliverable card in `/patient/tasks/:taskId`. |

---

### F-4: Strict Patient Privacy Scoping & Corporate Admin Firewall
#### 1. What it does
Enforces strict patient-level authorization before rendering any task list or detail page:
- **Admin Scope Lockout:** Tasks created in **Admin (`/admin/tasks`)** never appear in `/patient/tasks` lists under any filter.
- **Cross-Patient Isolation:** Displays only tasks targeted to the Patient Portal or explicitly assigned to the signed-in patient's ID/name (`assignee`, multi-assignee list, or responsible people)—preventing any patient from viewing another patient's tasks or internal clinic-staff tasks.
- **Direct URL Lock Screen:** If a user opens a restricted, Admin-only, missing, or another patient's task ID directly via `/patient/tasks/:taskId`, Companion displays a safe **`Task Not Available`** lock screen (`Lock` icon + permission note) with a clear **`Return to My Tasks`** button.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Admin Scope Exclusion | Hard Firewall | Blocks all corporate administrative tasks from patient queries and detail pages | Protects clinic billing, audit, and staffing memos |
| F-4.2: Active Patient Match Guard | Identity Filter | Verifies signed-in patient matches the task's contact target or portal visibility before display | Prevents cross-patient data leakage |
| F-4.3: `"Task Not Available"` Recovery View | Safe Fallback | Replaces unauthorized detail links with a lock screen and `Return to My Tasks` CTA | Never leaks partial task titles or descriptions |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | User navigates to `/patient/tasks/tsk-002` (an Admin credentialing audit) or another patient's task URL | Authorization guard checks scope (`admin`) and patient identity match | **Blocked immediately; displays `"Task Not Available"` lock card with `"Return to My Tasks"` action** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Patient Privacy & Trust Lead | When patients open deep links from notifications or bookmarks, I want strict scoping checks so internal admin tasks or other patients' records are never accessible. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Navigating to any Admin-scoped task, internal staff task, or another patient's task ID at `/patient/tasks/:taskId` MUST render `"Task Not Available"` with zero leaked task content. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Patient **My Tasks** Hub & Search | F-1.1 to F-1.4 | Shows `Action Needed` vs `Completed` counters, progress rings, search, and clean sanitized titles. |
| F-2 | Deliverable Execution & Live Clinic Sync | F-2.1 to F-2.3 | Lets patients toggle `Mark as done` / `Undo` per item and syncs progress + closure to Client Portal. |
| F-3 | Rich Multimedia Clinical Resources | F-3.1 to F-3.3 | Renders inline photos, videos, external URLs, file downloads, and framed HTML protocols. |
| F-4 | Privacy Scoping & Admin Firewall | F-4.1 to F-4.3 | Restricts access strictly to the signed-in patient's portal tasks and blocks Admin/internal items cleanly. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Outpatient / Post-Op Patient | Track action-needed steps, follow videos/protocols, and check off completed care tasks smoothly. | F-1, F-2, F-3 |
| 2 | Patient Privacy & Trust Lead | Guarantee patients see only their own care deliverables with zero Admin or cross-patient leaks. | F-4 |
