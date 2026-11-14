---
title: "Corporate Tasks, Cross-Org Delegation & Governance"
product: "admin"
module: "tasks"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | Admin (Platform Control & Operations) |
| :--- | :--- |
| Module | Workspace - Corporate & Cross-Organization Tasks (`/admin/tasks`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Top-Down Role & Organization Delegation | Tasks scoped by Admin to clinic roles or organizations route directly into matching staff members' **My Tasks** list while keeping corporate oversight isolated from internal clinic boards. | [View in Client My Tasks](/client/tasks/my-tasks) |
| Client | Clinic-Scoped Scheduling Separation | While Client **Tasks by me** manages full deadline dates, recurring schedules, and workflow pipelines for practice & patient care flows, Admin tasks omit workflow pipeline selection and scheduling parameters, focusing strictly on scoping, roles, priority, observers, and deliverables. | [View in Tasks by me](/client/tasks/tasks-by-me) |
| Companion | Strict Patient Portal Firewall | Administrative and corporate tasks never appear inside any patient's Companion task feed and return a locked access guard if opened directly. | [View in Companion](/companion/tasks) |
| Admin | Organization & Role Scoping Catalog | Organization rosters and industry role catalogs supply the selectable industries, regions, and role targets used in Admin task scoping rules. | [View Organizations](/admin/organizations) |
| Admin | Role Permission Directory | Role definitions determine which clinical and operational titles (such as Clinical Director, Lead Physician, Practice Billing Specialist) can receive cross-org task assignments. | [View Roles](/admin/roles) |

## 1. Module Summary
- The **Corporate Tasks, Cross-Org Delegation & Governance** module lets Platform Administrators create, scope, assign, and track operational, compliance, and billing governance tasks across tenant organizations from `/admin/tasks`.
- Corporate tasks operate in a strictly scoped workspace without deadline, recurring-schedule, or workflow pipeline configuration: Admins define industry/region/organization scoping, target roles, priority (`Mark as Important`), `Observers`, and multi-step `Task Studio` deliverables—routing assignments straight into **Client Portal (`My Tasks`)** while remaining invisible inside patient-facing **Companion** feeds.

## 2. Feature Requests

### F-1: Corporate Tasks Console & Workspace Isolation (`/admin/tasks`)
#### 1. What it does
Provides a dedicated administrative table displaying only corporate-scoped tasks so platform governance work never mixes with individual clinic day-to-day patient chores. Key table columns include:
- **`TASK ID`** (`TSK-*` monospace code)
- **`TASK NAME`** (clickable row opening Task Details or Edit drawer)
- **`SCOPE`** (targeted industry categories and regional scoping summary, or `"Global"`)
- **`ORGANIZATION`** (assigned tenant organization name)
- **`ROLE / RESPONSIBLE`** (targeted organizational role or lead assignee)
- **`CHECKLIST`** (deliverable and multi-assignee completion progress)
- **`STAGE`**
Note: The `DEADLINE` column and deadline-tracking copy are omitted from the Admin tasks workspace (`Corporate operational assignments, cross-organization delegation, and checklists`). The **Workflow Switcher** dropdown is also omitted from the Admin header to keep corporate governance tasks streamlined, alongside unified keyword search and row actions (**Edit Task**, **Mark Completed**, **Delete**).

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Corporate Scope Filter | Isolation Rule | Displays only platform/corporate tasks in `/admin/tasks` while excluding them from clinic-only boards | Keeps corporate governance separate from patient chores |
| F-1.2: Admin Governance Columns | Data Table | Surfaces `TASK ID`, `TASK NAME`, `SCOPE`, `ORGANIZATION`, `ROLE / RESPONSIBLE`, `CHECKLIST`, `STAGE` | Scheduling/deadline column omitted for Admin tasks |
| F-1.3: Unified Keyword Search | Filter Controls | Searches across codes, roles, observers, and projects (Workflow Switcher filter omitted in Admin) | Instant client-side filtering |
| F-1.4: Row Lifecycle Actions | Quick Actions | Supports **Edit Task**, one-click **Mark Completed** (`Task Completed`), and **Delete** | Confirms before permanent deletion |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Platform Operations reviews active Q4 compliance checklists across all US healthcare clinics | Opens `/admin/tasks`, filters **Compliance & Credentialing**, and inspects `TSK-102` (`Quarterly Provider Credentialing & CAQH Audit`) | **Table displays targeted Healthcare scope, clinic organization, Clinical Director role, checklist progress, and stage cleanly without deadline columns** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Administrator | When managing platform-wide compliance and revenue audits, I want one clean admin tasks table organized by scope, organization, and role without scheduling clutter. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | `/admin/tasks` displays corporate-scoped tasks with `SCOPE`, `ORGANIZATION`, `ROLE / RESPONSIBLE`, and `CHECKLIST` columns, omitting the `DEADLINE` column and clinic/patient tasks. |
| F-1-2 | Clicking **Mark Completed** updates the task to `Task Completed` and reflects the updated status across assignees. |

---

### F-2: Two-Step Admin Task Composer (`Configure` & `Task Studio`, Scheduling Omitted)
#### 1. What it does
Selecting **New Task** (or **Edit Task**) opens a two-step authoring drawer tailored for cross-organization rollout:
- **Step 1 — Configure (Scoping, Roles & Task Parameters):** Admins specify Task Title, Description, **Admin Scoping Rules** (selecting industry verticals such as *Healthcare*, *Automobile*, *Coaching & Advisory*, *Household Care*, *IT/Tech*, *Real Estate*, plus country/org filters), and **Target Organization Roles** (filtered dynamically from the selected industry role catalog—or all roles across industries when unscoped)—omitting the Workflow Pipeline selector (which is reserved for clinic/client tasks). Under **Task Parameters**, Admin exposes **`Mark as Important`** priority toggle and **`Observers`**—explicitly omitting scheduling inputs (`Schedule`, `Deadline Date`, `Target Time`, and `Repeat` recurrence).
- **Step 2 — Task Studio (`Builder` & `Preview`):** Builds ordered multi-step deliverables with optional attachments: **File** (up to `1MB`), **Image** (upload or URL), **Video** (upload or URL), **External URL**, or **Sandboxed Custom HTML Block**—and validates HTTP/HTTPS URLs plus at least one deliverable before saving. In **Preview** mode, Admin tasks display title, description, priority badge, and interactive deliverable completion without scheduled due/repeat chips.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Industry Scoping Rules | Targeting Builder | Scopes administrative tasks by industry category, country/region, and organization criteria | Defaults to `"Global"` if unscoped |
| F-2.2: Dynamic Industry Role Picker | Role Selector | Populates target roles matching selected industries (e.g., *Clinical Director*, *Lead Physician*, *Practice Billing Specialist*) | Exposes full cross-industry catalog when unscoped |
| F-2.3: Streamlined **Task Parameters** | Priority & Observers | Exposes **Mark as Important** priority toggle and **Observers** multi-select while omitting deadline dates, target times, and recurrence settings | Keeps Admin task creation lightweight for now |
| F-2.4: Task Studio & Preview | Deliverable Builder | Adds multimedia/HTML instruction blocks and tests interactive check-offs in **Preview** mode | Enforces non-empty studio items and safe URLs |

#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Admin rolls out a cross-org compliance checklist for Healthcare clinics | Sets Scoping Rule to **Healthcare (US)**, selects **Clinical Director**, toggles **Mark as Important**, adds Observers (with zero deadline/repeat steps), adds 2 CAQH deliverables in Task Studio, and saves | **Task saves with `SCOPE = Healthcare`, appears in `/admin/tasks`, and pushes straight into targeted Clinical Directors' Client `My Tasks` list** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Compliance Program Manager | When rolling out standardized cross-org checklists by industry and role, I want quick scoping, priority, and deliverable authoring without mandatory deadline or recurrence fields. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Adding **Healthcare** scoping restricts selectable target roles cleanly to Healthcare roles, while clearing scoping exposes roles across all configured industries. |
| F-2-2 | In Admin mode, Step 1 shows `Task Parameters` (`Mark as Important` + `Observers`) with Workflow Pipeline, `Schedule` (`Deadline Date` / `Target Time`), and `Repeat` hidden, saving corporate tasks cleanly without workflow pipeline selection or `deadline` / `recurrence` fields. |

---

### F-3: Task Detail Workspace, Per-Person Tracking & Auto-Completion (`/admin/tasks/:taskId`)
#### 1. What it does
Opening an assigned task from `/admin/tasks` navigates to a single-column **Task Detail Page** containing:
- **Task Info Header:** Displays `TSK-*` code, **Important** badge, current **Workflow Stage** badge, overall status pill (`Completed` vs `In Progress`), full description, **Observers** list (omitting the `Deadline` metadata box for Admin tasks), **Share** action (`SMS`, `WhatsApp`, `Email`, `Client Portal`, or Copy Link), and **Delete Task** button.
- **Per-Person Progress Tracker:** Shows **`Overall Completion: X/Y People Finished`** with an interactive circular progress ring and an expandable **View Breakdown / Hide Details** list displaying every responsible member's individual progress (`completed/total items` and `Done` / `%` badge).
- **Deliverables & Studio Items:** Renders every item sequentially with per-person **Mark as done / Done (Undo)** toggles and inline viewers (images, HTML5 video controls, external links, file downloads, and sandboxed HTML cards). Once all responsible members complete all deliverables, the overall task automatically transitions to **`Completed`** (`Task Completed` stage) and issues a completion notification.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Overall & Per-Person Breakdown | Progress Tracker | Aggregates how many assignees finished every studio item with expandable per-person rows | Metadata displays `Observers` cleanly with `Deadline` hidden |
| F-3.2: Multi-Format Resource Viewer | Studio Renderer | Displays uploaded/linked images, videos, downloadable documents, URLs, and sandboxed HTML briefs inline | Renders safely inside framed containers |
| F-3.3: Automatic Stage Completion | State Engine | Flips task status to `Completed` (`Task Completed` stage) when all assignees check off all items | Reverts cleanly to `In Progress` if an item is unchecked |
| F-3.4: Multi-Channel **Share** Action | Distribution Drawer | Shares task summaries and direct links via SMS, WhatsApp, Email, Client Portal chat, or Clipboard | Reaches external stakeholders cleanly |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinical Director in Client Portal completes the final CAQH deliverable for `TSK-102` | Item completion hits `100%` across all assigned roles | **Task transitions automatically to `Completed` (`Task Completed`) and notifies observers & Platform Admin** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Operations Auditor | When multiple clinic leaders owe deliverables on one rollout task, I want an expandable per-person breakdown, so that I see exactly who finished and who is still pending. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | `/admin/tasks/:taskId` omits the `Deadline` metadata box while displaying `Observers`, and auto-completes (`Task Completed`) once all responsible people finish all studio items. |

---

### F-4: Cross-Product Visibility Boundaries & Scope Protection
#### 1. What it does
Enforces strict data boundaries across the three MantraAssist products:
- **Client Portal Handoff:** Corporate tasks appear inside a clinic staff member's **My Tasks** tab in Client Portal whenever their role or name matches the target assignee—enabling top-down execution without exposing internal platform scoping controls to general clinic workflows.
- **Companion App Isolation:** Administrative tasks are explicitly excluded from Patient Companion (`/patient/tasks`) and blocked with a `"Task Not Available"` lock card even if a user navigates directly to `/patient/tasks/:taskId`.
- **Overdue Scanner Exemption:** Because Admin tasks omit scheduling/deadline parameters for now, automated overdue deadline notifications skip Admin-scoped tasks cleanly while continuing to monitor scheduled clinic and patient tasks.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Tenant vs Patient Firewall | Privacy Boundary | Excludes admin tasks from patient portals and general clinic self-boards | Prevents internal audits or billing memos from leaking to patients |
| F-4.2: Overdue Monitor Exemption | Scope Sync | Excludes Admin-scoped tasks from automated deadline-breach alerts while preserving client alerts | Matches omission of Admin scheduling parameters |

#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | A patient manually visits the URL ID of an internal admin task (`TSK-105` Billing Reconciliation) | Companion portal verifies task scope against patient access rules | **Companion blocks access immediately with `"Task Not Available"` lock screen and `"Return to My Tasks"` button** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Security & Compliance Officer | When managing multi-tenant corporate tasks alongside patient apps, I want hard enforcement ensuring internal governance tasks never appear in a patient portal. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Admin-scoped tasks MUST NEVER render in `/patient/tasks` or `/patient/tasks/:taskId` and MUST NOT emit overdue deadline notifications while Admin scheduling is disabled. |

---

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Corporate Tasks Console & Workspace Isolation | F-1.1 to F-1.4 | Manages cross-org admin tasks cleanly with scope, organization, role, and checklist columns. |
| F-2 | Two-Step Admin Task Composer (Scheduling Omitted) | F-2.1 to F-2.4 | Scopes tasks by industry/org/role with `Mark as Important` + `Observers` and multimedia deliverables (no schedule/repeat fields). |
| F-3 | Task Detail, Per-Person Tracking & Auto-Completion | F-3.1 to F-3.4 | Tracks individual assignee progress with expandable breakdowns and auto-completes at 100%. |
| F-4 | Cross-Product Privacy Boundaries & Scope Protection | F-4.1 to F-4.2 | Connects Admin delegation to Client `My Tasks`, blocks Patient Companion access, and exempts Admin from overdue alerts. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Administrator | Scope operational and compliance tasks across industries/organizations with priority and observers, without scheduling clutter. | F-1, F-2, F-3 |
| 2 | Security & Compliance Officer | Guarantee corporate tasks never leak to patient portals. | F-4 |
