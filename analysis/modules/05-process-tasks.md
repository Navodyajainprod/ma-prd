# G5 — Process (Pipeline Kanban/List) + Tasks — Gap Analysis
_Sources:_ PRD files `content/client/processes/kanban.md`, `content/client/processes/list.md`, `content/client/tasks/my-tasks.md`, `content/client/tasks/tasks-by-me.md`, `content/admin/tasks.md` | Prototype routes `/deals`, `/tasks`, `/tasks/:taskId`, `/admin/tasks`, `/admin/tasks/:taskId` → `src/app/pages/Deals.tsx`, `src/app/components/deals/ProcessDetailDrawer.tsx`, `src/app/components/deals/RequiredFieldsModal.tsx`, `src/app/pages/Tasks.tsx`, `src/app/pages/TaskDetailPage.tsx`, `src/app/components/tasks/TaskQuickCreateDrawer.tsx`, `src/app/components/tasks/ShareTaskDrawer.tsx`, `src/lib/tasksStore.ts`, `src/lib/processLogsStore.ts`, `src/lib/useAutomationStore.ts`, `src/lib/processFieldValidation.ts`, `src/lib/useProcessStore.ts` | Analysed 2026-11-12

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Process — Kanban view (`/deals`, Kanban) | 3 | 3 | 5 | 2 | 3 | 3 | 34.6% |
| Process — List view (`/deals`, List) | 1 | 0 | 6 | 1 | 4 | 7 | 12.5% |
| Process — Detail drawer (opened from List) | 0 | 0 | 6 | 0 | 0 | 3 | No PRD |
| Tasks — My Tasks (`/tasks` tab + `/tasks/:taskId`) | 8 | 2 | 1 | 1 | 0 | 2 | 75.0% |
| Tasks — Tasks by me (`/tasks` tab + create/edit drawer + Share) | 13 | 2 | 2 | 0 | 1 | 8 | 82.4% |
| Tasks — Admin (`/admin/tasks`, `/admin/tasks/:taskId`) | 8 | 1 | 0 | 2 | 0 | 4 | 77.3% |
| **Totals** | **33** | **8** | **20** | **6** | **8** | **27** | **55.2%** |

Overall coverage: 55.2% · PRD-backed coverage: 60.7%

(Overall = (33 + 0.5×8) ÷ (33+8+20+6) = 37 ÷ 67. PRD-backed excludes the detail drawer: 37 ÷ 61.)

## Route map
| Route | Page file | Sidebar label | PRD file |
| :--- | :--- | :--- | :--- |
| `/deals` (List and Kanban toggle) | `src/app/pages/Deals.tsx` | **Process** (client nav, `src/app/config/navigation.ts:91-94`) | `client/processes/kanban.md`, `client/processes/list.md` |
| `/deals?process=<name>` (fixed-process mode, opened from the Workflows gear menu) | `src/app/pages/Deals.tsx` | — | none (not described) |
| `/process` | `src/app/pages/Process.tsx` | **Workflows** (`navigation.ts:150-152`) | other agent — cross-reference only |
| `/tasks` (tabs "My Tasks" / "Tasks by me") | `src/app/pages/Tasks.tsx` | Tasks | `client/tasks/my-tasks.md`, `client/tasks/tasks-by-me.md` |
| `/tasks/:taskId` | `src/app/pages/TaskDetailPage.tsx` | — | `my-tasks.md § F-3`, `tasks-by-me.md § F-3` |
| `/tasks?editTaskId=<id>` | `Tasks.tsx` → `TaskQuickCreateDrawer.tsx` | — | `tasks-by-me.md § F-1.3` |
| `/admin/tasks`, `/admin/tasks/:taskId` | same `Tasks.tsx` / `TaskDetailPage.tsx` in admin mode (`src/app/routes.tsx:337-338`) | Tasks (`AdminSidebar.tsx:118`) | `admin/tasks.md` |
| `/patient/tasks`, `/patient/tasks/:taskId` | `PatientTasksScreen.tsx`, `PatientTaskDetailPage.tsx` | Companion | companion PRDs — cross-reference only |

---

## A. Product map — as built

### A.1 Process (route `/deals`, sidebar "Process")

**Purpose.** A pipeline board for client "process records" (one record per client per process). Staff can view records as a table or as stage columns, move records between stages, fill in stage-required fields, and open a detail drawer.

**User roles.** No role gating. The route is only wrapped in the "signed in" check (`src/app/components/auth/ProtectedRoute.tsx:4-12`, `src/app/routes.tsx:214-232`).

**Which entity types a process can hold.** The process store supports client, appointment, invoice, insurance, claim and task processes (`src/lib/useProcessStore.ts:92`, `:174`). This page lists **only client processes** (processes with no type or with type "client") (`Deals.tsx:762-764`). If none are configured it falls back to two built-in processes, "Client Intake" and "Client Reactivation" (`Deals.tsx:767-774`). Other entity types have their own pipelines in other modules. The Workflows gear menu links appointment, invoice and insurance pipelines to their own screens (`src/app/components/workflow/WorkflowGearDropdown.tsx:56-170`).

**Two record sets.** The List view shows process records from the process-log store (`Deals.tsx:310-315`, `:2668`). The Kanban view shows a different, separately seeded "deals" list (`Deals.tsx:95-123`, `:565-595`, `:2784`). See G5-E-01.

**Screens**
1. Page header: the title is "Process" with a "Pipeline" badge. In fixed-process mode the title becomes the process name (`Deals.tsx:2019-2028`). A "How Process Works" help modal is available (`:4142-4154`).
2. Toolbar: process switcher, search, List/Kanban toggle, gear menu (process settings link), and a filter modal (`:2060-2160`).
3. List view table (`:2666-2683`).
4. Kanban view (`:2687-3083`).
5. Process detail drawer (`:3852-4127`, `components/deals/ProcessDetailDrawer.tsx`).
6. Required-fields modal (`:4129-4140`, `components/deals/RequiredFieldsModal.tsx`).
7. Bulk "Trigger Calls" and "Cancel Scheduled Calls" modals (`:3086-3200`).

**Step-by-step flows**

*F-A1 Choose a process*
1. When the page loads, the process comes from the URL (`?process=`, `?processName=` or `?processId=`). Without a URL value it uses the last selection saved for the browser session, otherwise "Client Intake" (`Deals.tsx:545-561`).
2. Without a URL value, the switcher lists every client process plus the two defaults. Choosing one filters both views (`:2081-2113`). There is no "All processes" option. The page always shows exactly one process (`:802-812`).
3. In fixed-process mode (opened from the Workflows gear menu via `/deals?process=<name>`, `WorkflowGearDropdown.tsx:58`), the switcher is replaced by a read-only process badge and the page title becomes the process name (`Deals.tsx:541-544`, `:2063-2071`).
4. The gear menu opens the process configuration in Workflows (`/process`) (`Deals.tsx:2153-2158`, `WorkflowGearDropdown.tsx:185`).

*F-A2 List view*
1. The table shows the columns Process ID (shown as `PRC-…`, which opens the drawer), Title (`<client>_Process_<date>`), Stage (a clickable segmented stage bar), Client (opens the client profile), Created, Activity ("Last contact – date · stage", or "Scheduled call · Follow up needed" in red for pending), Responsible (taken from the client record, else "Unassigned"), and Alert (the number of missing required fields) (`Deals.tsx:1806-1977`).
2. Search matches the client name only (`:1509-1510`).
3. Clicking a row or a Process ID opens the detail drawer (`:2677-2682`, `:1820-1825`).
4. Row actions: **View** opens the drawer. **Edit** shows a "coming soon" toast. **Delete** shows a "Delete coming soon" error toast (`:1980-1999`).
5. Bulk actions (shown after selecting rows): **Trigger Calls** offers "immediate" or "scheduled" with a date and time. Confirm shows a success toast but creates no call (`:1470-1482`). **Cancel Scheduled Calls** appears only if a selected row has a scheduled call, and clears that flag after confirmation (`:2008-2013`, `:1484-1495`).
6. Empty state: "No deals or processes found matching your filters." (`:2676`). Loading and error states are not handled (all data is local).
7. The filter modal offers saved-filter presets (Process in progress, Test process, Closed process, MC EAP) and fields (Name, Responsible person, Stage group, Created on, plus optional Call type, Status, Duration, Client name, Phone, Email, Notes). It also has Add field, Restore default and Reset. **Search only closes the modal. No filter is applied** (`:2162-2529`; the filter logic at `:1508-1526` uses only search, client and process). See G5-E-06 and G5-E-07.

*F-A3 Move a record to another stage (List stage bar)*
1. The user clicks a stage on the row's segmented bar (`Deals.tsx:1855-1866`).
2. The system checks the fields marked required for the target stage in the process field registry (`:1716-1723`, `src/lib/processFieldValidation.ts:60-99`).
3. If fields are missing, the required-fields modal ("Required Fields Needed") lists them. Each one must be filled ("<label> is required.") before **Save & Move Stage** (`RequiredFieldsModal.tsx:83-104`, `:129`, `:338`). Cancel leaves the stage unchanged.
4. On success: the record's stage is saved (`Deals.tsx:1772-1774`). The client record's single "stage" field is set and the process is added to the client's process list (`:1775-1787`). Every Kanban deal for the same client name is rewritten to this process and stage (`:1789-1791`, see G5-E-02). A stage move is logged and automation events are emitted (`:1796-1802`, `:1105-1163`). A "Stage moved to … ✓" toast appears.
5. The record's "date" is overwritten with the time of the move, so the **Created** column changes (`src/lib/processLogsStore.ts:210`, see G5-E-10).

*F-A4 Kanban view*
1. The columns are the selected process's stages from Workflows configuration (name, colour, final-stage flag), or the built-in defaults (`Deals.tsx:950-982`, `:2780-2783`).
2. Column header: the stage name, a card-count badge and the process name (`:2922-2940`). A column total value is computed but **not displayed** (`:2785`).
3. Card fields: client name (opens the client profile), process name, status pill (In Progress / Won / Lost), created date, "Activity: No activities" (always this text), and the responsible person's first name (`:2968-3076`). The card does not show a value, days in stage or an avatar.
4. Dragging a card onto any column (not only an adjacent one) runs the same required-field check and modal as F-A3 (`:2802-2862`). On success it updates the deal stage, the matching process record (or creates one, `processLogsStore.ts:225-237`), the client stage and process list, and logs the stage move with its automation events. The toast reads "Deal moved to … ✓" (`Deals.tsx:2864-2916`).
5. Card menu (⋯): **Edit** and **Call** do nothing (`:2999-3009`). **Delete** removes the deal immediately, with no confirmation, and shows "Deal deleted" (`:3010-3017`).
6. Empty column: no placeholder. Cards on new processes: none, because deals exist only for the seeded processes (see G5-E-01).

*F-A5 Detail drawer* (see A.1-D below).

**Business rules**
- R-P1 Required-field gate: a move into a stage is blocked until every field marked required for that stage has a value (`processFieldValidation.ts:85-99`, `RequiredFieldsModal.tsx:83-97`). This applies to the List bar, Kanban drag and drawer ribbon.
- R-P2 Every stage move writes an audit "stage move" entry (only the latest 500 are kept). It also emits the "stage entered", "<type> entered stage" and "stage exited" events (`src/lib/useAutomationStore.ts:551-583`). The rule engine listens to all events and runs any matching workflow automations (`src/lib/ruleEngine.ts:1041-1055`, loaded at `src/main.tsx:5`).
- R-P3 A stage move adds a "stage change" activity entry to the client timeline (`Deals.tsx:1146-1160`).
- R-P4 The client keeps a single "current stage" that is overwritten by the latest move in any process (`Deals.tsx:1779-1783`).
- R-P5 The process selection is remembered for the browser session (`Deals.tsx:558-562`).
- R-P6 Fixed-process mode hides the switcher (`Deals.tsx:2063-2071`).
- R-P7 The stage→process fallback maps a known stage name to its process. Unknown stages default to "Client Intake" (`Deals.tsx:167-184`).

**KPIs & metrics**
| Metric | Where | Formula / status | Citation |
| :--- | :--- | :--- | :--- |
| Column card count | Kanban column header | Number of deals whose stage equals this column | `Deals.tsx:2784`, `:2935` |
| Column total value | not shown | Sum of the amounts of deals in the column, computed but never rendered | `Deals.tsx:2785` |
| Missing required fields count | List "Alert" column | Number of fields required for the current stage that are empty | `Deals.tsx:1915-1975` |
| Total records (pagination) | not used by the visible table | **hardcoded – formula undefined** (5380) | `Deals.tsx:911` |

**Cross-module references (as built)**
- Client name → Client profile `/clients/:id` (`Deals.tsx:1874`, `:2975`).
- Stage move → client record stage and process list (`Deals.tsx:1775-1787`).
- Stage move → rule engine / Workflows automations (`useAutomationStore.ts:563-581`, `ruleEngine.ts:1046`).
- Stage move → Companion status stepper. The Companion status screen re-reads process records on change (`processLogsStore.ts:200-213`, `src/app/pages/patient/PatientStatusScreen.tsx:46`, `:240`).
- Gear → Workflows `/process` (`WorkflowGearDropdown.tsx:59-71`, `:185`).
- A client filter banner ("Showing deals for …") is built for arrival from another screen with a client in navigation state (`Deals.tsx:1222-1233`, `:2033-2058`), but no screen sends that state (see G5-E-31).

### A.1-D Process detail drawer (no PRD)
1. Opens from a List row or Process ID (`Deals.tsx:3852-3858`).
2. Header: the record title and `#ID`, plus a chevron stage ribbon showing the process stages (`ProcessDetailDrawer.tsx:1083-1110`).
3. Clicking a stage runs the required-field gate (its own modal). On success it logs the stage move and activity, then hands the move to the page (`ProcessDetailDrawer.tsx:833-858`, `:788-831`). The page logs the move a **second** time (`Deals.tsx:4021-4043`). See G5-E-13.
4. Tabs: Overview (two-column field view with inline edit, add or select fields, and add an activity/note), History (stage and field timeline with filters) and Documents (with a count) (`ProcessDetailDrawer.tsx:1115-1145`, `:1162`, `:1263`, `:1381`). Inline field edits are saved to the process record with a "Saved ✓" toast (`Deals.tsx:4066-4086`).
5. The activity feed shows real activity for the client and process. If there is none, it shows **seven fabricated demo entries** (WhatsApp, call, email, appointment, process completed) (`Deals.tsx:3860-3956`). See G5-E-12.
6. Activity drill-through: call → call detail drawer; WhatsApp, SMS or email → `/chats` with client and channel; appointment → `/appointments`; stage entries → History tab (`Deals.tsx:3958-4019`).
7. AI Scribe can pre-fill process fields (`ProcessDetailDrawer.tsx:928`).
8. Cross-process "next process" transitions are computed, but the hand-off action is never triggered from the UI (`ProcessDetailDrawer.tsx:717-748`). See G5-E-14.

### A.2 Tasks — shared model
- **Store:** tasks are kept in the browser (`src/lib/tasksStore.ts:19`, `:818-849`), seeded with TSK-101 to TSK-112 (`:94-610`).
- **Task fields:** code `TSK-n`, title, description, creator, status (pending / in progress / completed / deferred), workflow and stage, Important flag, scope (client / portal / admin), primary assignee and assignee list, responsible people, deadline (text plus date and time), recurrence, observers, and "studio" deliverables with per-person completion (`src/types/task.ts`).
- **Task workflows** are processes of type "task" configured in Workflows. The built-in default stages are "Task Created", "Task Completed" and "Task Overdue" (`Tasks.tsx:46-50`, `TaskDetailPage.tsx:127-138`).
- **Creation sources (as built):** only manual creation from the "New Task" drawer, in client "Tasks by me" and in Admin (`Tasks.tsx:674-683`, `TaskQuickCreateDrawer.tsx:1094-1139`). No automation or workflow action creates tasks. Admin "scheduling" does not exist (Admin tasks have no deadline or recurrence) (`TaskQuickCreateDrawer.tsx:1080-1082`, `:1117-1119`).
- **Status transitions:**
  - Stage-driven. A stage containing "completed" or "won" sets Completed. "Overdue" or "lost" sets Deferred. "Created" sets Pending. Any other stage sets In Progress (`tasksStore.ts:978-1027`).
  - Deliverable-driven. When every responsible person has checked every deliverable, the task becomes Completed / "Task Completed". Unchecking any item returns it to In Progress / "Task Created" (`tasksStore.ts:1229-1305`).
- **Notifications** (one shared in-app bell, not addressed to a recipient, `src/lib/notificationsStore.ts:85-100`):
  - "New Task Assigned" on create (`tasksStore.ts:886-893`).
  - "Task Reassigned" when the primary assignee changes (`:902-910`).
  - "Task Stage Updated" or "Task Completed" on stage change (`:1006-1026`).
  - "Task Completed" when all deliverables are done (`:1294-1303`).
  - "Task Overdue Alert" once per task when the deadline passes. This is checked when the page loads and every 60 seconds, and skips completed and Admin tasks (`:42-92`, `:866-871`).
  - "Task Sent to Portal Chat" on portal share (`ShareTaskDrawer.tsx:222-229`).
- **"Assigned to me" test:** a task counts as the user's if any of these matches the current user name, by substring in either direction:
  - the assignee name;
  - any assignee;
  - any responsible person.

  It also counts if the name contains "alistair" or "lead physician", or the assignee role contains "physician" or "clinician". Without a signed-in name, the user defaults to "Dr. Alistair Mehta" (client) or "Platform Administrator" (admin) (`Tasks.tsx:120-170`, `TaskDetailPage.tsx:68-117`). See G5-E-16.

### A.3 Tasks — My Tasks tab (`/tasks`, default tab)
**Roles:** no role gating. The tab holds every task that passes the "assigned to me" test, excluding Admin-scope tasks (`Tasks.tsx:197-209`).
**Screens and flows**
1. Tab badge "My Tasks (N)" (`Tasks.tsx:177-189`, `:604-608`).
2. Columns: TASK ID, TASK NAME, ASSIGNED BY (the creator, default "Admin"), OBSERVERS, DEADLINE, CHECKLIST (the user's own done/total) (`Tasks.tsx:242`, `:428-461`, `:465-517`).
3. Hidden on this tab: the workflow switcher, the New Task button, the stage column and Delete (`Tasks.tsx:614`, `:674-683`, `:563-576`).
4. Search across title, code, assignee name, assignees, observers, workflow and project (`Tasks.tsx:212-222`). The workflow filter is ignored on this tab (`:224-226`).
5. Row click, task name click or "View Details" → `/tasks/:taskId` (`Tasks.tsx:100-110`, `:548-551`).
6. Row "Mark Completed" moves the whole task to "Task Completed" with a toast. Deliverables are not touched (`Tasks.tsx:553-559`). See G5-E-18.
7. Empty state "No tasks found matching your filters." (`Tasks.tsx:694`).
8. Detail page in assignee mode:
   - Subtitle "Assigned to you • Created <date>" (`TaskDetailPage.tsx:199-201`).
   - Important star toggle (`:255-260`).
   - Status pill (`:~305-330`).
   - Deadline, or "No scheduled deadline" (`:342-347`).
   - Observers list.
   - No stage badge, Share or Delete (`:222`, `:288`).
   - Progress ring "Your Progress: X/Y Items Completed" (`:384-399`).
   - Deliverables rendered as images, video, files, URLs and sandboxed HTML, with "Mark as done" / "Done (Undo)" toasts (`:528-548`, `:623`).
   - Not-found state "Task Not Found" with "Return to Tasks" (`:140-169`).

### A.4 Tasks — Tasks by me tab
**Roles:** no role gating. The tab holds **every non-Admin task that does not pass the "assigned to me" test**, whether or not the user created it (`Tasks.tsx:206-208`). See G5-E-17.
**Screens and flows**
1. Badge "Tasks by me (N)". The workflow switcher offers "All Workflows" plus each task workflow (`Tasks.tsx:612-668`).
2. Columns: TASK ID, WORKFLOW, STAGE (segmented bar; clicking a stage moves the task, with toast "Task moved to …"), TASK NAME, RESPONSIBLE ("<first> +N more" with tooltip), OBSERVERS, DEADLINE, CHECKLIST ("x/y finished" for several people, with a per-person tooltip) (`Tasks.tsx:337-420`, `:518-540`).
3. Row or name click opens the edit drawer pre-filled (`Tasks.tsx:100-110`, `?editTaskId=` handled at `:76-86`). Row actions: Edit Task, Mark Completed, and Delete with browser confirm "Delete task TSK-…?" (`:546-576`).
4. **New Task** opens the two-step drawer (`TaskQuickCreateDrawer.tsx`):
   - Step 1 "Configure" asks for:
     - Title (required) and Description.
     - Workflow Pipeline (required).
     - Responsible type. "Team Member" offers a role filter "All Roles" or a staff title, over the live team list. "Client Contact" offers a category filter "All Categories / Client / Lead / Supplier / Vendor", over a **static client catalog** (`:74`, `:471-497`, see G5-E-22).
     - Deadline date and time (default tomorrow 17:00, `:574-579`).
     - Important flag and Observers.
     - Repeat: every N days, weeks, months or years, skip weekends, and stop never / after N / on a date (`:1692+`, `:1051-1062`).

     "Next" checks the title and workflow (`:956-967`).
   - Step 2 "Task Studio" has Builder and Preview views. Each item takes a title, a description, an Important star and an optional resource: File up to 1MB, Image or Video by upload or URL, External URL, or Custom HTML. Saving checks that there is at least one item, that every item has a title, and that every URL is http/https (`:136`, `:877-912`, `:969-991`). The responsible person is **not** required. With none, the task is saved with a placeholder "Assigned Staff" (`:1020-1024`, see G5-E-21).
   - On save: scope is "portal" for Client Contact tasks, else "client" (`:1108`). The stage is the workflow's first stage (default "Task Created") (`:818-819`). The code is `TSK-<count+101>` (`tasksStore.ts:875`, see G5-E-23). A "New Task Assigned" notification is sent.
5. Edit saves all fields again and **clears every person's deliverable completion** (`TaskQuickCreateDrawer.tsx:1016`, `:1078`). See G5-E-20.
6. Detail page in manager mode (Overall Completion ring, "View Breakdown / Hide Details" per-person list, stage badge, Share, Delete) exists at `TaskDetailPage.tsx:222-250`, `:384-460`. However, any task that fails the "assigned to me" test is redirected to the edit drawer before it renders (`TaskDetailPage.tsx:120-123`), so creators cannot normally reach it. See G5-E-19.
7. Share drawer channels:
   - SMS, WhatsApp and Email (choose a connected account, recipients and a message). These show a success toast but send nothing (`ShareTaskDrawer.tsx:237-260`, see G5-E-24).
   - Client Portal (choose patients from the static catalog). This posts a "📋 Task Assigned: …, Stage, Deadline, Link /patient/tasks" message into the patient's Companion chat thread and raises a bell notification (`ShareTaskDrawer.tsx:63-134`, `:208-233`).
   - Copy link (`:199-205`).
8. Companion: Client Contact ("portal") tasks appear in the patient's task list and detail. Admin tasks are excluded and show "Task Not Available" (`PatientTasksScreen.tsx:41-48`, `PatientTaskDetailPage.tsx:48`, `:104`).

### A.5 Tasks — Admin (`/admin/tasks`)
**Roles:** no role gating on `/admin/*` beyond sign-in (`routes.tsx:278-280`; `AdminLayout.tsx:46` defaults the role label to "SystemAdmin"). See G5-E-28.
1. Shows only Admin-scope tasks (`Tasks.tsx:195-197`). Subtitle "Corporate operational assignments, cross-organization delegation, and checklists" (`:592-597`).
2. Columns: TASK ID, TASK NAME, SCOPE (scope name or industry list), ORGANIZATION, ROLE / RESPONSIBLE, CHECKLIST. There is **no STAGE column** and no DEADLINE column (`Tasks.tsx:255-334`, `:488-502`, `:503-540`). ORGANIZATION shows "Demo Mantra Care" for every Admin task because the migration fills it with that value (`tasksStore.ts:796`, see G5-E-27).
3. Search, New Task, and row actions Edit Task / Mark Completed / Delete (with confirm) (`Tasks.tsx:546-576`, `:612-683`). Workflow switcher is omitted in admin mode.
4. Composer in admin mode:
   - "Admin Control" scoping rules: industry category and related criteria (`TaskQuickCreateDrawer.tsx:1296-1308`).
   - Target roles, filtered to the scoped industries' role catalog plus stored custom roles. All roles show when unscoped. "Lead Physician" is pre-selected (`:505-560`, `:732`).
   - Workflow pipeline section is omitted in admin mode (reserved for client tasks).
   - Important flag and Observers.
   - No deadline or repeat. The task is saved with no deadline or recurrence (`:1080-1082`, `:1117-1119`).
   - Same studio and Preview as the client composer.
5. Detail `/admin/tasks/:taskId` hides the deadline (`TaskDetailPage.tsx:342`) and shows Share and Delete (`:222-250`). It is subject to the same redirect as A.4 step 6.
6. Overdue alerts skip Admin tasks (`tasksStore.ts:49`).
7. Client `/tasks` never shows Admin tasks, so role-targeted Admin tasks do **not** reach clinic "My Tasks" (`Tasks.tsx:181`, `:199-201`).

---

## B. Product map — per PRD

### B.1 Process Kanban (`client/processes/kanban.md`)
- Purpose: a visual drag-and-drop clinical workflow board ("Process & Deals") tracking patients across multi-stage care protocols (`kanban.md § 1. Module Summary`).
- F-1:
  - stage columns showing name, card count and total revenue;
  - draggable cards showing avatar, patient name, coordinator, days in stage and deal value;
  - a quick process switcher that remembers the selection.

  A move runs "stage transition rules", updates timestamps and triggers stage automations. The worked example also notifies the attending physician (`§ F-1`). AC F-1-1: dragging to an **adjacent** stage updates the stage immediately across the database.
- F-2: column total revenue header; stage-probability weighting (column value × conversion probability) "shown in pipeline analytics" (`§ F-2`). AC F-2-1: headers sum values in real time.
- Cross-product: Companion care-journey stepper updates when the stage changes (`§ Cross-product Summary`).
- Roles: Care Coordinator, Practice Manager (JTBD only). No permission rules.

### B.2 Process List (`client/processes/list.md`)
- Purpose: a high-density "Instances List" of all active and completed process instances, with a responsible filter, SLA detection and bulk reassignment (`list.md § 1. Module Summary`).
- F-1:
  - sortable columns: Patient Name, Process Name, Current Stage, Responsible Staff, Days in Stage, Deal Value, SLA Timer;
  - a red SLA violation badge;
  - a responsible member filter that includes "Unassigned".

  The worked example sorts by days in stage and reassigns. AC F-1-1: instances over the SLA show a warning (`§ F-1`).

### B.3 My Tasks (`client/tasks/my-tasks.md`)
- F-1:
  - Shows tasks where the user is the direct assignee, a multi-assignee, a responsible person or a matching clinical role, **including Admin role-targeted tasks**.
  - Badge `My Tasks (N)`.
  - Columns TASK ID, TASK NAME, ASSIGNED BY, OBSERVERS, DEADLINE, CHECKLIST.
  - Search over title, code, creator, observers and project (`§ F-1`).
- F-2: hide New Task, the workflow switcher, Share and Delete. Row actions View Details and Mark Completed only. Row click goes to `/tasks/:taskId` (`§ F-2`).
- F-3: assignee-only detail header, a per-user "Your Progress" ring, and Mark as done / Done (Undo). The task auto-completes when every assignee finishes (`§ F-3`).
- F-4: one deduplicated "Task Overdue Alert" naming the assignee and observers, deep-linking to `/tasks/:taskId` (`§ F-4`).

### B.4 Tasks by me (`client/tasks/tasks-by-me.md`)
- F-1: "every non-admin task delegated outward", with the workflow switcher, columns WORKFLOW / STAGE (inline segmented bar) / RESPONSIBLE (+N more), click-to-edit drawer, and row actions Edit / Mark Completed / Delete with confirm (`§ F-1`).
- F-2: two-step wizard.
  - Configure: title, description, required workflow, Important, deadline, observers, recurrence. Responsible is Team Member (role filter) or Client Contact (category filter). A Client Contact task syncs to Companion.
  - Studio: file up to 1MB, image, video, URL or HTML, with validation and Preview (`§ F-2`).
- F-3:
  - Task Details for a delegated task: stage badge, "Overall Completion X/Y People Finished", and an expandable breakdown.
  - Share via SMS, WhatsApp, Email, Copy Link or Client Portal (posts a "Task Assigned" card plus a bell alert).
  - Delete Task for "authorized creators/admins".
  - Auto-complete at 100%, notifying the creator (`§ F-3`).
- Cross-product: tasks pull pipelines from Workflows, staff from Team and contacts from the Clients CRM. Client tasks never mix into `/admin/tasks` (`§ Cross-product Summary`).

### B.5 Admin Tasks (`admin/tasks.md`)
- F-1: corporate-only table with columns TASK ID, TASK NAME, SCOPE, ORGANIZATION, ROLE / RESPONSIBLE, CHECKLIST, **STAGE**. No DEADLINE. Workflow switcher, search, and Edit / Mark Completed / Delete with confirm (`§ F-1`).
- F-2: composer with industry, country and org scoping, a dynamic role picker, the workflow, Mark as Important and Observers. No schedule or repeat. Studio and Preview (`§ F-2`).
- F-3: detail with the Important badge, stage badge, status pill and Observers (no Deadline), Share (SMS / WhatsApp / Email / Client Portal / Copy), Delete, a per-person breakdown, and auto-completion with a notification to observers and the Platform Admin (`§ F-3`).
- F-4:
  - Admin tasks appear in clinic staff "My Tasks" when the role or name matches.
  - They are excluded from Companion, with a "Task Not Available" lock.
  - They are exempt from overdue alerts (`§ F-4`).

---

## C. Findings

### C.1 Process — Kanban view
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G5-K-01 | Flow | Drag a card between stage columns updates the stage, persists it, logs a stage move and fires automations | Partial (PRD less detailed) | kanban.md § F-1 | Deals.tsx:2802-2916; useAutomationStore.ts:551-583 | PRD does not describe what is written (record, client stage, audit, activity) or the toast |
| G5-K-02 | Rule | Required-field gate before entering a stage (modal "Required Fields Needed" → "Save & Move Stage") | Missing in PRD | — | Deals.tsx:2812-2862; RequiredFieldsModal.tsx:83-104 | Key compliance rule for all three move paths |
| G5-K-03 | Flow | Process switcher; selection remembered for the session | Matches | kanban.md § F-1 (F-1.3) | Deals.tsx:545-561, 2081-2113 | No "All processes" option; one process at a time |
| G5-K-04 | Flow | Fixed-process mode via `/deals?process=` from Workflows gear; gear opens Workflows config | Missing in PRD | — | Deals.tsx:541-544, 2063-2071, 2153-2158; WorkflowGearDropdown.tsx:58, 185 | |
| G5-K-05 | Rule | Card fields: built = client name, process, status (In Progress/Won/Lost), created, activity, responsible first name; PRD = avatar, patient name, coordinator, days in stage, deal value | Contradicts or stale | kanban.md § F-1 (F-1.2) | Deals.tsx:2968-3076 | |
| G5-K-06 | Metric | Column card-count badge | Matches | kanban.md § F-1 (F-1.1) | Deals.tsx:2784, 2935 | |
| G5-K-07 | Metric | Column total revenue header | PRD-only (not built) | kanban.md § F-2 (F-2.1) | Deals.tsx:2785 (computed, never shown) | Records on the List side have no value field at all |
| G5-K-08 | Metric | Stage-probability weighted forecast | PRD-only (not built) | kanban.md § F-2 (F-2.2) | — | No probability on stages |
| G5-K-09 | Metric | Days in stage on card | PRD-only (not built) | kanban.md § F-1 (F-1.2) | — | No stage-entered timestamp shown |
| G5-K-10 | Rule | Notification on stage move (worked example: physician notified) | Partial (PRD less detailed) | kanban.md § F-1 worked example | useAutomationStore.ts:563-581; ruleEngine.ts:1046 | Only fires if a workflow automation is configured for that stage; no built-in notice |
| G5-K-11 | Rule | Page holds client-type processes only; other entity types (appointment, invoice, insurance, claim, task) live in their own modules | Missing in PRD | — | Deals.tsx:762-774; useProcessStore.ts:92 | PRD speaks only of "patients" |
| G5-K-12 | Rule | Stage move overwrites the client's single "current stage" and adds the process to the client's process list | Missing in PRD | — | Deals.tsx:2896-2907 | A client in two processes shows only the last-moved stage |
| G5-K-13 | Flow | Kanban and List show different record sets | Prototype defect | — | — | see G5-E-01 |
| G5-K-14 | Flow | Card Delete with no confirmation | Prototype defect | — | — | see G5-E-03 |
| G5-K-15 | Flow | Card menu Edit/Call; "No activities" placeholder | Prototype defect | — | — | see G5-E-04, G5-E-05 |
| G5-K-16 | X-ref | Companion care-journey stepper reflects stage moves | Matches | kanban.md § Cross-product Summary | processLogsStore.ts:200-237; PatientStatusScreen.tsx:46, 240 | Detail owned by Companion agent |
| G5-K-17 | X-ref | Client name opens Client profile | Missing in PRD | — | Deals.tsx:2975 | |
| G5-K-18 | Rule | Drop allowed on any column (PRD AC says adjacent stage) | Partial (PRD less detailed) | kanban.md § F-1 AC F-1-1 | Deals.tsx:2780-2802 | Unclear whether "adjacent" is a restriction (G5-Q-04) |
| G5-K-19 | Rule | Naming: PRD "Process & Deals", "deal cards", "Clinical Process Pipeline"; UI nav "Process", route `/deals`, badge "Pipeline", toasts "Deal moved/deleted", help "How Process Works" | Contradicts or stale | kanban.md § 1 | navigation.ts:91-94; Deals.tsx:2019-2028, 2913, 3016 | Glossary needed (G5-Q-22) |

### C.2 Process — List view
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G5-L-01 | Flow | Client name, current stage and responsible columns | Matches | list.md § F-1 (F-1.1) | Deals.tsx:1855-1913 | |
| G5-L-02 | Metric | Days in Stage and Deal Value columns | PRD-only (not built) | list.md § F-1 | — | |
| G5-L-03 | Rule | SLA timer and red "SLA Overdue (+N days)" badge | PRD-only (not built) | list.md § F-1 (F-1.2), AC F-1-1 | — | No SLA setting on stages |
| G5-L-04 | Flow | Extra columns Process ID (`PRC-…`), Title, Created, Activity | Missing in PRD | — | Deals.tsx:1806-1906 | |
| G5-L-05 | Rule | PRD: one list of all instances across processes with a Process Name column; built: always scoped to one process | Contradicts or stale | list.md § 1, § F-1 | Deals.tsx:1518-1521, 802-812 | |
| G5-L-06 | Flow | Sortable columns | PRD-only (not built) | list.md § F-1 (F-1.1) | TableComponent.tsx (no sorting) | |
| G5-L-07 | Flow | Responsible / stage / date filters | Prototype defect | list.md § F-1 (F-1.3) | — | see G5-E-06; "Unassigned" option also absent |
| G5-L-08 | Flow | Bulk reassignment | PRD-only (not built) | list.md § 1, worked example | — | |
| G5-L-09 | Flow | Inline stage change via segmented bar with required-field gate | Missing in PRD | — | Deals.tsx:1707-1803, 1855-1866 | |
| G5-L-10 | Rule | Alert column: count of missing required fields; click to fill | Missing in PRD | — | Deals.tsx:1915-1975 | |
| G5-L-11 | Flow | Search by client name | Missing in PRD | — | Deals.tsx:1509-1510 | |
| G5-L-12 | Rule | Responsible comes from the client record, not the process record | Missing in PRD | — | Deals.tsx:1908-1913 | Two processes for one client always share one owner (G5-Q-07) |
| G5-L-13 | Flow | Bulk Cancel Scheduled Calls (with confirm) | Missing in PRD | — | Deals.tsx:1484-1495, 2008-2013 | |
| G5-L-14 | Flow | Row Edit / Delete | Prototype defect | — | — | see G5-E-08 |
| G5-L-15 | Flow | Saved filter presets | Prototype defect | — | — | see G5-E-07 |
| G5-L-16 | Rule | Created date changes on every stage move | Prototype defect | — | — | see G5-E-10 |
| G5-L-17 | Flow | Bulk Trigger Calls | Prototype defect | — | — | see G5-E-09 |
| G5-L-18 | Rule | [SECURITY] Hardcoded phone/email fallback values | Prototype defect | — | — | see G5-E-11 |
| G5-L-19 | X-ref | Client filter banner on arrival from another screen | Prototype defect | — | — | see G5-E-31 |

### C.3 Process — Detail drawer (No PRD)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G5-D-01 | Flow | Open drawer from row / Process ID; header title + ID | Missing in PRD | — | Deals.tsx:1820-1825, 2677-2682; ProcessDetailDrawer.tsx:1083-1095 | |
| G5-D-02 | Flow | Chevron stage ribbon with required-field gate | Missing in PRD | — | ProcessDetailDrawer.tsx:833-858, 1099-1110 | |
| G5-D-03 | Flow | Tabs Overview / History / Documents | Missing in PRD | — | ProcessDetailDrawer.tsx:1115-1145 | |
| G5-D-04 | Flow | Inline field edit saved to the process record | Missing in PRD | — | Deals.tsx:4066-4086 | |
| G5-D-05 | X-ref | Activity drill-through to Chats, Appointments, Call detail | Missing in PRD | — | Deals.tsx:3958-4019 | |
| G5-D-06 | X-ref | AI Scribe pre-fills process fields | Missing in PRD | — | ProcessDetailDrawer.tsx:928 | |
| G5-D-07 | Flow | Fabricated activity entries | Prototype defect | — | — | see G5-E-12 |
| G5-D-08 | Rule | Stage move logged twice → automations run twice | Prototype defect | — | — | see G5-E-13 |
| G5-D-09 | Flow | Cross-process hand-off not reachable | Prototype defect | — | — | see G5-E-14 |

### C.4 Tasks — My Tasks
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G5-M-01 | Rule | [SECURITY] "Assigned to me" matching | Prototype defect | my-tasks.md § F-1 (F-1.1) | — | see G5-E-16 |
| G5-M-02 | X-ref | Admin role-targeted tasks appear in My Tasks | Contradicts or stale | my-tasks.md § F-1; admin/tasks.md § F-4 | Tasks.tsx:181, 199-201 | Code deliberately hides all Admin tasks from `/tasks` |
| G5-M-03 | Flow | Columns TASK ID, TASK NAME, ASSIGNED BY, OBSERVERS, DEADLINE, CHECKLIST (own progress) | Matches | my-tasks.md § F-1 (F-1.2) | Tasks.tsx:242, 428-517 | |
| G5-M-04 | Metric | Tab badge `My Tasks (N)` = count of non-Admin tasks passing the assigned test | Matches | my-tasks.md § F-1 | Tasks.tsx:177-189 | Inherits E-16 |
| G5-M-05 | Flow | Search fields: built searches assignee/assignees/workflow; PRD says creator | Partial (PRD less detailed) | my-tasks.md § F-1 (F-1.3) | Tasks.tsx:212-222 | Creator name not searchable |
| G5-M-06 | Rule | Hide New Task, workflow switcher, STAGE, Delete, Share | Matches | my-tasks.md § F-2 | Tasks.tsx:614, 674-683, 563-576; TaskDetailPage.tsx:222, 288 | |
| G5-M-07 | Flow | Row actions View Details + Mark Completed | Matches | my-tasks.md § F-2 (F-2.2) | Tasks.tsx:546-559 | Behaviour of Mark Completed: see M-11 |
| G5-M-08 | Flow | Row click → `/tasks/:taskId` | Matches | my-tasks.md § F-2 (F-2.3) | Tasks.tsx:100-104, 692 | |
| G5-M-09 | Flow | Detail header: "Assigned to you • Created", code, Important toggle, status, deadline, observers, no stage badge | Matches | my-tasks.md § F-3 (F-3.1) | TaskDetailPage.tsx:199-201, 255-260, 288, 342-347 | |
| G5-M-10 | Metric | "Your Progress: X/Y Items Completed" = deliverables the signed-in user has checked ÷ all deliverables; Mark as done / Undo; auto-complete when all people finish | Matches | my-tasks.md § F-3 (F-3.2, F-3.3) | TaskDetailPage.tsx:384-399, 528-548; tasksStore.ts:614-638, 1229-1305 | |
| G5-M-11 | Rule | Row "Mark Completed" closes task without deliverables | Prototype defect | my-tasks.md § F-2 vs § F-3 | — | see G5-E-18; PRD itself is inconsistent (G5-Q-11) |
| G5-M-12 | Rule | Overdue alert, once per task, deep-link `/tasks/:taskId`, names assignee and observers | Matches | my-tasks.md § F-4 | tasksStore.ts:42-92, 866-871 | Overdue does not move the stage (G5-Q-17) |
| G5-M-13 | Rule | Alert recipients (assignee + observers) | Partial (PRD less detailed) | my-tasks.md § F-4 | notificationsStore.ts:85-100 | Bell is shared, not per-recipient; see G5-E-29 |
| G5-M-14 | Flow | "Task Not Found" state with "Return to Tasks" | Missing in PRD | — | TaskDetailPage.tsx:140-169 | |

### C.5 Tasks — Tasks by me
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G5-B-01 | Rule | [SECURITY] Tab membership | Prototype defect | tasks-by-me.md § F-1 | — | see G5-E-17 |
| G5-B-02 | Flow | Workflow switcher (All Workflows + task workflows) | Matches | tasks-by-me.md § F-1 (F-1.1) | Tasks.tsx:612-668 | |
| G5-B-03 | Flow | Columns WORKFLOW, STAGE, TASK NAME, RESPONSIBLE (+N more), OBSERVERS, DEADLINE, CHECKLIST | Matches | tasks-by-me.md § F-1 | Tasks.tsx:337-420, 465-540 | |
| G5-B-04 | Rule | Inline stage bar + stage→status mapping (completed/won→Completed; overdue/lost→Deferred; created→Pending; else In Progress) | Partial (PRD less detailed) | tasks-by-me.md § F-1 (F-1.2) | Tasks.tsx:358-372; tasksStore.ts:978-1027 | Mapping undocumented |
| G5-B-05 | Flow | Row click → edit drawer pre-filled (`?editTaskId=`) | Matches | tasks-by-me.md § F-1 (F-1.3) | Tasks.tsx:76-86, 100-110 | |
| G5-B-06 | Flow | Row actions Edit / Mark Completed / Delete (confirm) | Matches | tasks-by-me.md § F-1 (F-1.4) | Tasks.tsx:546-576 | |
| G5-B-07 | Flow | Step 1 fields incl. deadline, observers, recurrence (interval, unit, skip weekends, stop rule) | Matches | tasks-by-me.md § F-2 | TaskQuickCreateDrawer.tsx:572-590, 1051-1062, 1692+ | |
| G5-B-08 | Rule | Validation: title + workflow (step 1); ≥1 studio item, item titles, http/https URLs, 1MB uploads | Matches | tasks-by-me.md § F-2, AC F-2-2 | TaskQuickCreateDrawer.tsx:136, 877-912, 956-991 | |
| G5-B-09 | Rule | Responsible person optional | Prototype defect | — | — | see G5-E-21 |
| G5-B-10 | Flow | Team Member (role filter) vs Client Contact (category filter) | Matches | tasks-by-me.md § F-2 (F-2.1) | TaskQuickCreateDrawer.tsx:74, 471-497, 788-811 | |
| G5-B-11 | X-ref | Contact list from static catalog, not live Clients | Prototype defect | — | — | see G5-E-22 |
| G5-B-12 | X-ref | Client Contact task published to Companion task list | Matches | tasks-by-me.md § F-2, AC F-2-1 | TaskQuickCreateDrawer.tsx:1108; PatientTasksScreen.tsx:41-48 | |
| G5-B-13 | Rule | Recurrence settings captured and stored on the task | Partial (PRD less detailed) | tasks-by-me.md § F-2 (F-2.2) | TaskQuickCreateDrawer.tsx:1051-1062 | |
| G5-B-14 | Rule | Recurring instances actually generated | PRD-only (not built) | tasks-by-me.md § F-2 (F-2.2) | — | No scheduler reads the recurrence (G5-Q-13) |
| G5-B-15 | Flow | Studio Preview tab with test check-offs | Matches | tasks-by-me.md § F-2 (F-2.4) | TaskQuickCreateDrawer.tsx:762-763, 2240 | |
| G5-B-16 | Flow | Creator's Task Details (Overall Completion, breakdown, Share, Delete) | Prototype defect | tasks-by-me.md § F-3 | — | see G5-E-19 |
| G5-B-17 | X-ref | Share → Client Portal posts "Task Assigned" into Companion chat + bell | Matches | tasks-by-me.md § F-3 (F-3.2), AC F-3-1 | ShareTaskDrawer.tsx:63-134, 208-233 | |
| G5-B-18 | Flow | Share via SMS / WhatsApp / Email | Prototype defect | tasks-by-me.md § F-3 | — | see G5-E-24 |
| G5-B-19 | Rule | Auto-complete when all assignees finish; revert on uncheck; "Task Completed" notice | Matches | tasks-by-me.md § F-3 (F-3.3), AC F-3-2 | tasksStore.ts:1259-1303 | |
| G5-B-20 | Rule | Edit clears all progress | Prototype defect | — | — | see G5-E-20 |
| G5-B-21 | Rule | Task code numbering | Prototype defect | — | — | see G5-E-23 |
| G5-B-22 | Rule | Notifications on create, reassign, stage update | Missing in PRD | — | tasksStore.ts:886-893, 902-910, 1017-1025 | |
| G5-B-23 | Rule | [SECURITY] Detail-header Delete permission | Prototype defect | tasks-by-me.md § F-3 | — | see G5-E-25 |
| G5-B-24 | Rule | Client tasks never shown in `/admin/tasks` | Matches | tasks-by-me.md § Cross-product Summary | Tasks.tsx:195-197 | |
| G5-B-25 | Rule | Default deadline = tomorrow 17:00 | Missing in PRD | — | TaskQuickCreateDrawer.tsx:574-579 | |
| G5-B-26 | X-ref | Task pipelines come from Workflows (task-type processes), staff from Team | Matches | tasks-by-me.md § Cross-product Summary | Tasks.tsx:46-50; TaskQuickCreateDrawer.tsx:788-799 | No automation creates tasks (G5-Q-18) |

### C.6 Tasks — Admin
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G5-A-01 | Rule | Only Admin-scope tasks shown | Matches | admin/tasks.md § F-1 (F-1.1) | Tasks.tsx:195-197 | |
| G5-A-02 | Flow | STAGE column | Contradicts or stale | admin/tasks.md § F-1 (F-1.2) | Tasks.tsx:255-334 | Built table has no STAGE column (G5-Q-21) |
| G5-A-03 | Rule | No DEADLINE column; detail hides deadline | Matches | admin/tasks.md § F-1, § F-3 | Tasks.tsx:488-502; TaskDetailPage.tsx:342 | |
| G5-A-04 | Flow | Workflow switcher, search, Edit / Mark Completed / Delete (confirm) | Matches | admin/tasks.md § F-1 (F-1.3, F-1.4) | Tasks.tsx:546-576, 612-668 | |
| G5-A-05 | Rule | Industry scoping + role picker filtered by scoped industries; all roles when unscoped | Matches | admin/tasks.md § F-2 (F-2.1, F-2.2), AC F-2-1 | TaskQuickCreateDrawer.tsx:505-560, 1296-1308 | |
| G5-A-06 | Rule | Mark as Important + Observers; no schedule/repeat; saves no deadline/recurrence | Matches | admin/tasks.md § F-2 (F-2.3), AC F-2-2 | TaskQuickCreateDrawer.tsx:1080-1082, 1117-1119 | |
| G5-A-07 | Metric | ORGANIZATION column / org targeting | Prototype defect | admin/tasks.md § F-1, § F-2 | — | see G5-E-27 |
| G5-A-08 | Flow | Studio + Preview, same validation as client | Matches | admin/tasks.md § F-2 (F-2.4) | TaskQuickCreateDrawer.tsx:969-991 | |
| G5-A-09 | Flow | `/admin/tasks/:taskId` manager detail | Prototype defect | admin/tasks.md § F-3 | — | see G5-E-19 |
| G5-A-10 | Rule | Auto-complete notifies observers & Platform Admin | Partial (PRD less detailed) | admin/tasks.md § F-3 | tasksStore.ts:1294-1303 | Generic shared-bell notice only (G5-E-29) |
| G5-A-11 | X-ref | Admin tasks routed into clinic My Tasks | Contradicts or stale | admin/tasks.md § F-4 | Tasks.tsx:199-201 | Same as G5-M-02 |
| G5-A-12 | X-ref | Companion firewall: Admin tasks excluded; "Task Not Available" lock | Matches | admin/tasks.md § F-4 (F-4.1), AC F-4-1 | PatientTasksScreen.tsx:43; PatientTaskDetailPage.tsx:48, 104 | |
| G5-A-13 | Rule | Overdue scanner skips Admin tasks | Matches | admin/tasks.md § F-4 (F-4.2) | tasksStore.ts:49 | |
| G5-A-14 | X-ref | [SECURITY] Share Admin task to Client Portal | Prototype defect | admin/tasks.md § F-3 (F-3.4) vs § F-4 | — | see G5-E-26 |
| G5-A-15 | Rule | [SECURITY] Role gating of `/admin/tasks` | Prototype defect | — | — | see G5-E-28 |

---

## D. Correct flow as built (PRD-ready)

> Each block below can replace the matching PRD file. Defects are written as intended behaviour or as `Decision needed`.

### D.1 Replacement for `content/client/processes/kanban.md`

| Product | CLIENT |
| :--- | :--- |
| Module | PROCESSES |
| Channel | KANBAN (`/deals`, Kanban toggle; sidebar "Process") |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

#### Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient care-journey stepper | Moving a client's card updates the process record that the Companion status screen reads, so the patient's stepper shows the new stage | [View in Companion](/companion/today) |
| Client | Workflows (process configuration) | Stages, colours, final-stage flags, required fields per stage and stage automations come from Workflows; the gear icon opens that process in Workflows | [View Workflows](/client/workflows) |
| Client | Clients CRM | Client name opens the client profile; a stage move updates the client's current stage and process list | [View Clients](/client/clients) |
| Client | Automations | Each stage move emits "stage entered / exited" events that run any matching workflow automations | [View Workflows](/client/workflows) |

#### 1. Module Summary
- The Kanban view of **Process** shows one column per stage of the selected client process and one card per client record in that process.
- It holds **client-type processes only**. Appointment, invoice, insurance/claim and task pipelines are managed in their own modules.
- The same records appear in the List view. Kanban is a different layout of the same data. `Decision needed: confirm that Kanban and List show one shared record set (see G5-Q-01)`.

#### 2. Feature Requests

##### F-1: Stage Columns, Cards & Stage Moves
###### 1. What it does
Shows the selected process as stage columns. Staff drag cards between columns. Before the move completes, the system checks the fields required for the target stage.

###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Stage columns | UI Columns | Stage name and colour from Workflows, card-count badge, process name under the title | Falls back to default stages when the process has none |
| F-1.2: Process card | UI Card | Client name (opens client profile), process, status (In Progress / Won / Lost), created date, latest activity, responsible person | `Decision needed: add value and days-in-stage to the card? (see G5-Q-02, G5-Q-03)` |
| F-1.3: Process switcher | Dropdown | Lists every client process; the selection is remembered for the session | No "All processes" option (G5-Q-05) |
| F-1.4: Fixed-process mode | Navigation | Opening `/deals?process=<name>` (from the Workflows gear menu) locks the page to that process and uses it as the page title | |
| F-1.5: Required-field gate | Validation | If the target stage has required fields that are empty, a "Required Fields Needed" modal asks for them; "Save & Move Stage" saves the values and completes the move; Cancel leaves the card where it was | Same gate on List and drawer |
| F-1.6: Move side-effects | Automation | Saves the new stage on the record; sets the client's current stage and adds the process to the client's processes; writes an audit stage-move entry and a timeline activity; emits stage entered/exited events once | Toast "Moved to <stage>" |
| F-1.7: Card menu | Actions | Edit, Call, Delete. Delete asks for confirmation | `Decision needed: Edit/Call behaviour (see G5-Q-01)` |

###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | "Client Intake" requires "Insurance ID" for "Interested" | Drags Sarah Johnson from "Contacted" to "Interested" | Modal asks for Insurance ID → user fills and clicks Save & Move Stage → card moves, client stage becomes "Interested", any "on entering Interested" automation runs once |

###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When reviewing my caseload, I want to see where each client is in each process and move them forward without skipping required data. |

###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Dropping a card on another stage column saves the new stage and updates the client record. |
| F-1-2 | A move into a stage with empty required fields is blocked until those fields are filled in the modal. |
| F-1-3 | Each successful move emits exactly one stage-move event and one timeline entry. |
| F-1-4 | `Decision needed: may cards move to any stage or only adjacent stages; are final stages locked? (see G5-Q-04)` |

##### F-2: Stage Value & Forecast — **Not yet built**
| Item | Status |
| :--- | :--- |
| F-2.1: Column total value | `Decision needed: define formula for column total value and where the record value comes from (see G5-Q-02)` |
| F-2.2: Weighted forecast | `Decision needed: define formula for weighted stage forecast and where stage probability is configured (see G5-Q-02)` |
| F-2.3: Days in stage | `Decision needed: define days-in-stage start point (see G5-Q-03)` |
| F-2.4: Built-in notification on stage move | `Decision needed: built-in notice vs workflow automation only (see G5-Q-06)` |

#### 3. Comprehensive Summary
##### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Stage Columns, Cards & Stage Moves | F-1.1 – F-1.7 | Drag client records across the stages of one client process, with a required-field gate and automation events. |
| F-2 | Stage Value & Forecast (not yet built) | F-2.1 – F-2.4 | Value totals, weighted forecast, days in stage and stage-move notifications pending decisions. |

##### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | Visualise and advance each client through a process without missing required data. | F-1 |
| 2 | Practice Manager | Forecast revenue by stage. | F-2 |

### D.2 Replacement for `content/client/processes/list.md`

| Product | CLIENT |
| :--- | :--- |
| Module | PROCESSES |
| Channel | LIST (`/deals`, List toggle — default view) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

#### Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Clients CRM | Client column opens the profile; Responsible shows the client's owner | [View Clients](/client/clients) |
| Client | Workflows | Stage bar and required fields come from the process configuration | [View Workflows](/client/workflows) |
| Client | AI Receptionist / Calls | Bulk Trigger Calls and Cancel Scheduled Calls act on the selected records | [View Call Logs](/client/call-logs) |

#### 1. Module Summary
- A table of the client records in the selected process, one row per client per process. Staff can move stages inline, see missing required data and open the record drawer.

#### 2. Feature Requests

##### F-1: Process Records Table
###### 1. What it does
Lists the records of the selected process with an inline stage bar, required-data alerts and search.

###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Columns | Data Table | Process ID (`PRC-…`, opens drawer), Title (`<client>_Process_<date>`), Stage (segmented bar), Client (opens profile), Created (date the record was created), Activity (last contact or scheduled call), Responsible, Alert | Created must not change on stage moves |
| F-1.2: Inline stage bar | Stage control | Clicking a stage runs the required-field gate, then moves the record (same side-effects as Kanban F-1.6) | |
| F-1.3: Alert column | Data quality | Shows the number of required fields that are empty for the current stage; clicking opens the modal to fill them | Shows "—" when complete |
| F-1.4: Search | Search bar | Matches client name | |
| F-1.5: Filters | Filter modal | Responsible person, stage group, created-on range, and optional fields filter the table when "Search" is clicked; Reset restores defaults | Includes "Unassigned" responsible option. `Decision needed: saved filters scope (see G5-Q-08)` |
| F-1.6: Row actions | Actions | View (opens drawer). `Decision needed: Edit and Delete behaviour (see G5-Q-08)` | |
| F-1.7: Bulk actions | Actions | Trigger Calls (now or scheduled date/time) creates call jobs for the selected clients; Cancel Scheduled Calls (shown only when a selected record has one) clears them after confirmation | |
| F-1.8: Empty state | UI | "No deals or processes found matching your filters." | |

###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A record shows Alert "2" | Clicks the alert, fills the two fields, saves | Alert shows "—"; stage unchanged |

###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Clinic Supervisor | When reviewing a process, I want to see who is missing required data and move them forward from the table. |

###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Choosing a stage on the bar either moves the record or opens the required-field modal. |
| F-1-2 | The Alert column count equals the number of empty fields required by the record's current stage. |
| F-1-3 | Applying filters changes the rows shown. |

##### Not yet built
| Item | Status |
| :--- | :--- |
| Cross-process list with Process Name column | `Decision needed (see G5-Q-05)` |
| Sortable columns | Not yet built |
| Days in Stage, Deal Value columns | `Decision needed: define formula for days in stage and value (see G5-Q-02, G5-Q-03)` |
| SLA timer and red overdue badge | `Decision needed: where SLA per stage is configured (see G5-Q-03)` |
| Bulk reassignment | `Decision needed (see G5-Q-08)` |
| Responsible per process record | `Decision needed (see G5-Q-07)` |

#### 3. Comprehensive Summary
##### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Process Records Table | F-1.1 – F-1.8 | Table of one process's records with inline stage moves, required-data alerts, filters and call bulk actions. |

##### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Clinic Supervisor | Spot missing data and stalled records and act from the table. | F-1 |

### D.3 New file (proposed `content/client/processes/detail-drawer.md`, layout from `list.md`)

| Product | CLIENT |
| :--- | :--- |
| Module | PROCESSES |
| Channel | DETAIL DRAWER (opened from List) |
| Status | Draft |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

#### Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Chats / Appointments / Call logs | Activity items open the matching chat thread, appointment or call detail | [View Chats](/client/chats) |
| Client | AI Scribe | A consultation can pre-fill process fields | [View Scribe](/client/scribe) |

#### 1. Module Summary
- A right-side drawer for one process record: stage ribbon, fields, history and documents.

#### 2. Feature Requests
##### F-1: Record Drawer
###### 1. What it does
Shows and edits one record and moves its stage.
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Header | UI | Record title and ID | |
| F-1.2: Stage ribbon | Stage control | Click a stage → required-field gate → move (one stage-move event) | |
| F-1.3: Overview tab | Fields | Inline edit saved to the record; add or select fields; log an activity or note | |
| F-1.4: History tab | Timeline | Real stage, field and communication history with filters; empty state when there is none | No sample entries |
| F-1.5: Documents tab | Files | Documents linked to the record, with count | |
| F-1.6: Activity drill-through | Navigation | Call → call detail; WhatsApp/SMS/Email → Chats; appointment → Appointments | |
| F-1.7: Cross-process hand-off | Automation | `Decision needed: should staff trigger the configured "next process" transition from the drawer? (see G5-Q-23)` | |
###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Record in "Contacted" | Clicks "Interested" on the ribbon, no required fields missing | Stage changes; one history entry; automations run once |
###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Coordinator | See everything about a client's process in one place and update it. |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A ribbon stage change creates exactly one stage-move record. |
| F-1-2 | A record with no history shows an empty state, not sample data. |

#### 3. Comprehensive Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Record Drawer | F-1.1 – F-1.7 | One-record view with stage ribbon, fields, history and documents. |

### D.4 Replacement for `content/client/tasks/my-tasks.md`

| Product | Client (Clinic Practice Management) |
| :--- | :--- |
| Module | Tasks Queue - My Tasks Tab (`/tasks` -> `My Tasks` & `/tasks/:taskId`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

#### Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Admin | Role-targeted Admin tasks | `Decision needed: should Admin tasks targeted at a role appear here, and how is role matched to a signed-in user? (see G5-Q-09)` | [View in Admin](/admin/tasks) |
| Client | Tasks by me | Tasks the user created live in **Tasks by me** | [View](/client/tasks/tasks-by-me) |
| Client | Team | The signed-in team member's identity (user ID) decides what is assigned to them | [View Team](/client/settings/team) |

#### 1. Module Summary
- **My Tasks** lists the tasks where the signed-in team member is the assignee, one of the assignees, or a responsible person, matched by user identity.
- It hides creation, workflow, stage, Share and Delete controls.

#### 2. Feature Requests
##### F-1: Assigned Inbox
###### 1. What it does
Shows only the signed-in user's assigned tasks across all workflows.
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Assignment match | Scope filter | Task is shown when the user's ID is the assignee, in the assignee list or in the responsible people | No name or role guessing |
| F-1.2: Columns | Table | TASK ID, TASK NAME, ASSIGNED BY (creator), OBSERVERS, DEADLINE, CHECKLIST (user's own done/total, "NA" if no items) | |
| F-1.3: Search | Search | Title, task code, assignee, observers, workflow, project | `Decision needed: also search creator? (see G5-Q-09)` |
| F-1.4: Badge | Metric | `My Tasks (N)` = number of tasks matching F-1.1 | |
| F-1.5: Empty state | UI | "No tasks found matching your filters." | |
###### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | A nurse assigns TSK-101 to Dr. Mehta | Dr. Mehta opens My Tasks | TSK-101 is listed; the badge counts it |
###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Attending Physician | See only my assigned work in one place. |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Only tasks assigned to the signed-in user's identity appear; no workflow switcher or STAGE column. |

##### F-2: Assignee Guardrails
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Toolbar | UI | No New Task, no workflow switcher | |
| F-2.2: Row actions | Actions | View Details; `Decision needed: keep "Mark Completed" in My Tasks, and does it check all of my deliverables or close the whole task? (see G5-Q-11)` | No Delete or Share |
| F-2.3: Row click | Navigation | Opens `/tasks/:taskId` | |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | No Delete or Share control appears in My Tasks rows or detail header. |

##### F-3: Execution Detail (`/tasks/:taskId`)
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Header | View | "Assigned to you • Created <date>", task code, Important toggle, status pill, deadline ("No scheduled deadline" if none), observers; no stage badge | |
| F-3.2: Your Progress | Metric | "Your Progress: X/Y Items Completed" = deliverables checked by the signed-in user ÷ total deliverables | |
| F-3.3: Mark as done / Undo | Control | Toggles the user's own check; when every responsible person has checked every item the task becomes Completed / "Task Completed"; unchecking reverts to In Progress | |
| F-3.4: Deliverable viewers | View | Image, video player, file download, external link, sandboxed HTML | |
| F-3.5: Not found | State | "Task Not Found" with "Return to Tasks" | |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Mark as done updates Your Progress immediately; Undo reverts it. |

##### F-4: Overdue Alert
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Overdue alert | Notification | Once per task, when the deadline (date + time, or end of day) has passed and the task is not completed, send "Task Overdue Alert" naming assignee and observers, linking to `/tasks/:taskId` | Checked on load and every minute. `Decision needed: recipients (see G5-Q-16); auto-move to "Task Overdue"? (see G5-Q-17)` |

#### 3. Comprehensive Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Assigned Inbox | F-1.1 – F-1.5 | Identity-matched inbox of assigned tasks. |
| F-2 | Assignee Guardrails | F-2.1 – F-2.3 | No create, delete or share; rows open the detail page. |
| F-3 | Execution Detail | F-3.1 – F-3.5 | Personal progress and deliverable check-off with auto-completion. |
| F-4 | Overdue Alert | F-4.1 | One deep-linked alert per overdue task. |

### D.5 Replacement for `content/client/tasks/tasks-by-me.md`

| Product | Client (Clinic Practice Management) |
| :--- | :--- |
| Module | Tasks Queue - Tasks by Me Tab (`/tasks` -> `Tasks by me` & `/tasks/:taskId`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

#### Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Patient tasks | A task whose responsible type is Client Contact is published to that patient's Companion task list; check-offs there update the breakdown | [View in Companion](/companion/tasks) |
| Companion | Portal chat | Share → Client Portal posts a "📋 Task Assigned" message (stage, deadline, link) into the patient's Companion chat and raises a bell notice | [View Chats](/client/chat/companion) |
| Client | Workflows / Team / Clients | Task pipelines are task-type processes from Workflows; staff from Team; contacts from the live Clients list | [View Workflows](/client/workflows) |
| Admin | Boundary | Client tasks never appear in `/admin/tasks` | [View in Admin](/admin/tasks) |

#### 1. Module Summary
- **Tasks by me** lists the tasks the signed-in user created. `Decision needed: should managers also see tasks created by others in the practice? (see G5-Q-10)`
- It provides the workflow switcher, inline stage bar, click-to-edit drawer, two-step composer, Share and Delete.

#### 2. Feature Requests
##### F-1: Delegated Table & Inline Stage
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Workflow switcher | Filter | All Workflows or one task workflow | |
| F-1.2: Columns | Table | TASK ID, WORKFLOW, STAGE (segmented bar), TASK NAME, RESPONSIBLE ("<first> +N more" with tooltip), OBSERVERS, DEADLINE, CHECKLIST ("x/y finished" with per-person tooltip for several people; else done/total) | |
| F-1.3: Inline stage | Stage control | Clicking a stage moves the task (toast "Task moved to …"). Status follows the stage: names containing "completed"/"won" → Completed; "overdue"/"lost" → Deferred; "created" → Pending; others → In Progress. A "Task Stage Updated" or "Task Completed" notice is raised | |
| F-1.4: Click-to-edit | Navigation | Row click opens the edit drawer pre-filled (`?editTaskId=`) | |
| F-1.5: Row actions | Actions | Edit Task, Mark Completed, Delete (confirm "Delete task TSK-…?") | |
| F-1.6: Badge | Metric | `Tasks by me (N)` = tasks shown by the tab scope | |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | The tab shows the workflow switcher, New Task, WORKFLOW, STAGE, RESPONSIBLE and Delete. |
| F-1-2 | Row click opens the drawer pre-filled. |

##### F-2: Two-Step Composer
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Step 1 Configure | Form | Title (required), description, Workflow Pipeline (required), responsible type Team Member (role filter) or Client Contact (category filter: All Categories / Client / Lead / Supplier / Vendor), at least one responsible person (required), deadline date and time (default tomorrow 17:00), Important, observers | |
| F-2.2: Recurrence | Settings | Every N days/weeks/months/years, skip weekends, stop never / after N / on date; saved on the task | `Decision needed: how recurring instances are generated (see G5-Q-13)` |
| F-2.3: Step 2 Task Studio | Builder | Ordered items with title, description, Important star and optional File (≤1MB), Image/Video (upload or http/https URL), External URL, Custom HTML; at least one item; every item titled | |
| F-2.4: Preview | QA | Simulates the deliverable cards with test check-offs | |
| F-2.5: Save | Rule | New task gets the next unique `TSK-n` code, the workflow's first stage, status Pending; Client Contact tasks are portal-visible; "New Task Assigned" notice | |
| F-2.6: Edit | Rule | Saves changes; items that still exist keep each person's completion | `Decision needed (see G5-Q-19)` |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Saving with Client Contact makes the task visible in that patient's Companion task list. |
| F-2-2 | Missing titles, missing responsible person or non-http/https URLs block saving with an error toast. |

##### F-3: Creator Detail, Breakdown & Share
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Creator detail | View | Stage badge, status, "Overall Completion: X/Y People Finished" (people who checked every item ÷ responsible people), View Breakdown / Hide Details per person (name, role, done/total, Done or %) | `Decision needed: how the creator reaches this view when row click opens the drawer (see G5-Q-12)` |
| F-3.2: Share | Distribution | SMS, WhatsApp, Email (connected account, recipients, message) send the message; Copy Link; Client Portal posts the Task Assigned message into each selected patient's Companion chat and raises a bell notice | |
| F-3.3: Auto-complete | Rule | All responsible people finish all items → Completed / "Task Completed" + notice; any uncheck → In Progress | |
| F-3.4: Delete | Action | `Decision needed: who may delete from the detail header (see G5-Q-14)` | Confirm before delete |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Client Portal share posts the summary and `/patient/tasks` link into the chosen patient's chat. |
| F-3-2 | Several-assignee tasks stay In Progress until every person completes every item. |

##### Not yet built
| Item | Status |
| :--- | :--- |
| Recurring instance generation | `Decision needed (see G5-Q-13)` |
| Tasks created by workflow automations | `Decision needed (see G5-Q-18)` |

#### 3. Comprehensive Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Delegated Table & Inline Stage | F-1.1 – F-1.6 | Manage created tasks with workflow filter, inline stage and row actions. |
| F-2 | Two-Step Composer | F-2.1 – F-2.6 | Configure audience, schedule and deliverables; publish to staff or patients. |
| F-3 | Creator Detail, Breakdown & Share | F-3.1 – F-3.4 | Track per-person progress, share via channels and portal, auto-complete. |

### D.6 Replacement for `content/admin/tasks.md`

| Product | Admin (Platform Control & Operations) |
| :--- | :--- |
| Module | Workspace - Corporate & Cross-Organization Tasks (`/admin/tasks`) |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

#### Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Role delegation | `Decision needed: whether and how Admin tasks reach clinic My Tasks (see G5-Q-09)` | [View in Client My Tasks](/client/tasks/my-tasks) |
| Companion | Patient firewall | Admin tasks never appear in Companion task lists; opening one directly shows "Task Not Available"; Admin tasks cannot be shared to the Client Portal | [View in Companion](/companion/tasks) |
| Admin | Roles / Industries | Industry role catalog and stored custom roles feed the target-role picker | [View Roles](/admin/roles) |

#### 1. Module Summary
- Platform Administrators create and track corporate tasks scoped by industry and target role.
- Admin tasks have no deadline or recurrence. Access to `/admin/tasks` is limited to platform administrator roles.

#### 2. Feature Requests
##### F-1: Corporate Tasks Console
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Scope | Isolation | Only Admin-scope tasks | |
| F-1.2: Columns | Table | TASK ID, TASK NAME, SCOPE (scope name or industries, "Global" if none), ORGANIZATION, ROLE / RESPONSIBLE, CHECKLIST; no DEADLINE | `Decision needed: STAGE column (see G5-Q-21); organization source (see G5-Q-20)` |
| F-1.3: Filters | Controls | Workflow switcher, search | |
| F-1.4: Row actions | Actions | Edit Task, Mark Completed, Delete (confirm) | |
Acceptance: F-1-1 `/admin/tasks` shows only Admin tasks and no DEADLINE column. F-1-2 Mark Completed sets "Task Completed".

##### F-2: Admin Composer (scheduling omitted)
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Scoping rules | Targeting | Industry category (and related criteria) | |
| F-2.2: Target roles | Picker | Roles for the scoped industries plus custom roles; all roles when unscoped | |
| F-2.3: Parameters | Form | Workflow (required), Mark as Important, Observers; no deadline, time or repeat; saved with none | |
| F-2.4: Studio + Preview | Builder | Same rules as client composer | |
Acceptance: F-2-1 Healthcare scoping limits roles to Healthcare roles. F-2-2 Admin tasks save no deadline or recurrence.

##### F-3: Admin Task Detail
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Header | View | Code, Important, stage badge, status, Observers (no Deadline), Share (SMS / WhatsApp / Email / Copy link only), Delete (confirm) | |
| F-3.2: Breakdown | Metric | Overall Completion X/Y People Finished, per-person breakdown | `Decision needed (see G5-Q-12)` |
| F-3.3: Auto-complete | Rule | All people finish → Completed + notice | Recipients: G5-Q-16 |

##### F-4: Boundaries
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Companion firewall | Privacy | Admin tasks excluded from Companion list and detail | |
| F-4.2: Overdue exemption | Rule | Overdue scanner skips Admin tasks | |
| F-4.3: Access | Security | Only platform administrator roles can open `/admin/tasks` | |

#### 3. Comprehensive Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Corporate Tasks Console | F-1.1 – F-1.4 | Admin-only task table by scope and role. |
| F-2 | Admin Composer | F-2.1 – F-2.4 | Scope, roles, priority, observers and deliverables; no scheduling. |
| F-3 | Admin Task Detail | F-3.1 – F-3.3 | Per-person tracking and auto-completion. |
| F-4 | Boundaries | F-4.1 – F-4.3 | Patient firewall, overdue exemption, admin-only access. |

---

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
| :--- | :--- | :--- | :--- | :--- |
| G5-E-01 | Kanban and List show two different record sets. List uses process records; Kanban uses a separately seeded "deals" list. Processes created in Workflows show empty Kanban columns, and a record moved in List only shows on Kanban if a deal with the same client name exists. | Deals.tsx:310-315, 2668, 565-595, 2784 | High | G5-K-13 |
| G5-E-02 | A stage change in List or the drawer rewrites the stage of **every** Kanban deal for that client name to the current process and stage, including deals in other processes | Deals.tsx:1754, 1791, 4035 | Medium | G5-K-12, G5-K-13 |
| G5-E-03 | The Kanban card Delete removes the deal immediately, with no confirmation and no undo | Deals.tsx:3010-3017 | Medium | G5-K-14 |
| G5-E-04 | The Kanban card menu Edit and Call do nothing | Deals.tsx:2999-3009 | Low | G5-K-15 |
| G5-E-05 | The Kanban card always shows "Activity: No activities" (placeholder shown as real) | Deals.tsx:3061-3064 | Low | G5-K-15 |
| G5-E-06 | The filter modal fields (Responsible, Stage group, Created on, Call type, Status, Duration, Client, Phone, Email, Notes) are never applied. "Search" only closes the modal. | Deals.tsx:2516-2525, 1508-1526 | Medium | G5-L-07 |
| G5-E-07 | The saved filter presets ("Process in progress", "Test process", "Closed process", "MC EAP") and "Save filter" are static buttons with no action | Deals.tsx:2164-2184 | Low | G5-L-15 |
| G5-E-08 | The List row Edit shows "Edit coming soon" and Delete shows "Delete coming soon" | Deals.tsx:1985-1998 | Low | G5-L-14 |
| G5-E-09 | Bulk "Trigger Calls" shows "N calls triggered/scheduled successfully" but creates no call or schedule | Deals.tsx:1470-1482 | Medium | G5-L-17 |
| G5-E-10 | A stage move overwrites the record's date with the current time, so "Created" shows the last move time | processLogsStore.ts:210 | Low | G5-L-16 |
| G5-E-11 | [SECURITY] A hardcoded phone number "9667283405" and email "anshul@mantracare.com" are used as fallback values for every client without a phone or email. These values pre-fill the required-fields modal and can satisfy required-field checks, so a third party's contact details can be saved onto patient records. | Deals.tsx:1711-1712, 1922-1923, 2816-2817 | High | G5-L-18 |
| G5-E-12 | The drawer activity feed shows seven fabricated entries (WhatsApp template sent, email sent, appointment booked, process completed…) when a record has no real activity | Deals.tsx:3874-3956 | Medium | G5-D-07 |
| G5-E-13 | A stage change from the drawer ribbon is logged twice, once by the drawer and once by the page. Each log emits stage events, so workflow automations run twice and History shows duplicate entries. | ProcessDetailDrawer.tsx:856-857; Deals.tsx:4021-4043 | High | G5-D-08 |
| G5-E-14 | Cross-process "next process" hand-off is computed but its action is never called from the UI | ProcessDetailDrawer.tsx:717-748 | Low | G5-D-09 |
| G5-E-15 | Dead code: pagination total hardcoded to 5380; the Import, Export, AI Scribe and quick-add-deal handlers have no entry point | Deals.tsx:911, 1264-1279, 1568-1578, 649-656 | Low | — |
| G5-E-16 | [SECURITY] "Assigned to me" is decided by substring name matching plus hardcoded rules. Any task whose assignee role contains "physician" or "clinician", or whose name contains "alistair" or "lead physician", counts as the current user's. With no signed-in name the user defaults to "Dr. Alistair Mehta". Other users can see and act on tasks that are not theirs, and real assignees can miss theirs. | Tasks.tsx:120-170; TaskDetailPage.tsx:68-117 | High | G5-M-01 |
| G5-E-17 | [SECURITY] "Tasks by me" shows every non-Admin task in the workspace that is not "assigned to me", including tasks created by other staff and all patient tasks. Any user can edit or delete them. | Tasks.tsx:206-208, 563-576 | High | G5-B-01 |
| G5-E-18 | The row action "Mark Completed" (also on My Tasks) sets the whole task to Completed for all assignees without checking any deliverable. The CHECKLIST column still shows 0/3, and the next uncheck reverts the task. | Tasks.tsx:553-559; tasksStore.ts:978-1004 | Medium | G5-M-11 |
| G5-E-19 | The detail page redirects any task that fails the "assigned to me" test to the edit drawer. The creator view (Overall Completion, View Breakdown, stage badge, Share, Delete) is therefore unreachable for normal delegated tasks, on client and admin. | TaskDetailPage.tsx:120-123 | High | G5-B-16, G5-A-09 |
| G5-E-20 | Editing any task replaces its deliverables with empty completion, wiping every assignee's and patient's progress | TaskQuickCreateDrawer.tsx:1009-1017, 1078 | High | G5-B-20 |
| G5-E-21 | The responsible person is not required. A task saved with none is assigned to a placeholder "Assigned Staff". | TaskQuickCreateDrawer.tsx:1020-1024 | Medium | G5-B-09 |
| G5-E-22 | The Client Contact picker and the Share → Client Portal recipient list read a static client catalog, not the live Clients store, so newly added clients cannot be assigned or messaged | TaskQuickCreateDrawer.tsx:494, 800-809; ShareTaskDrawer.tsx:30, 190, 215 | Medium | G5-B-11 |
| G5-E-23 | The task code is "TSK-" + (task count + 101). After a delete, the next task reuses an existing code. | tasksStore.ts:875-877 | Medium | G5-B-21 |
| G5-E-24 | Share via SMS, WhatsApp or Email shows "Task shared via … successfully" but nothing is sent (the detail page passes no send handler) | ShareTaskDrawer.tsx:237-260; TaskDetailPage.tsx:640-644 | Low | G5-B-18 |
| G5-E-25 | [SECURITY] The detail-header Delete appears only on the admin path or when the creator's **display name contains "admin"**, so the permission depends on a name | TaskDetailPage.tsx:234-245 | Medium | G5-B-23 |
| G5-E-26 | [SECURITY] From the Admin task detail, Share → Client Portal can post an internal Admin task (title, stage, link) into a patient's Companion chat, breaking the patient firewall | ShareTaskDrawer.tsx:208-233 (reachable via TaskDetailPage.tsx:222-232) | High | G5-A-14 |
| G5-E-27 | The Admin ORGANIZATION column shows the hardcoded "Demo Mantra Care" for every Admin task; the composer never captures an organization | tasksStore.ts:796; TaskQuickCreateDrawer.tsx:1094-1120 | Medium | G5-A-07 |
| G5-E-28 | [SECURITY] `/admin/tasks` (and all `/admin/*`) has no role check beyond sign-in; any signed-in clinic user can open it and create cross-org tasks | routes.tsx:278-280, 337-338; ProtectedRoute.tsx:4-12; AdminLayout.tsx:46 | Medium (owned by Super-admin group) | G5-A-15 |
| G5-E-29 | Task notifications have no recipient. Overdue, created, reassigned and completed alerts go into one shared bell for whoever is using the browser. | tasksStore.ts:84-91, 886-893; notificationsStore.ts:85-100 | Medium | G5-M-13, G5-A-10 |
| G5-E-30 | Orphaned task components are never rendered (an older task drawer, content sections, patient task modal) | components/tasks/TaskDetailDrawer.tsx, TaskContentSections.tsx, PatientTaskDetailModal.tsx | Low | — |
| G5-E-31 | The "Showing deals for <client>" filter banner listens for a client passed from another screen, but no screen sends it, so the filter is unreachable | Deals.tsx:1222-1233, 2033-2058 | Low | G5-L-19 |

---

## Open questions for PM
1. **G5-Q-01** Should Kanban and List show one shared set of process records (one per client per process)? What should the Kanban card's Edit and Call do? (G5-E-01, G5-K-13, D.1 F-1.7)
2. **G5-Q-02** Does a process record carry a monetary value? If so, define the column-total and weighted-forecast formulas and where stage probabilities are set. (G5-K-07, G5-K-08, G5-L-02)
3. **G5-Q-03** Days in stage and SLA: what starts the clock (stage-entered time?), and is the SLA threshold configured per stage in Workflows? (G5-K-09, G5-L-03)
4. **G5-Q-04** Can a card move to any stage or only an adjacent one? Are final (won/lost) stages locked? (G5-K-18)
5. **G5-Q-05** Should the Process page offer an "All processes" list with a Process Name column (as the List PRD says), and should it ever show non-client entity pipelines? (G5-L-05, G5-K-11)
6. **G5-Q-06** Should a stage move notify anyone by default, or only through workflow automations? (G5-K-10)
7. **G5-Q-07** Is "Responsible" per process record or per client? Today it is the client's owner. (G5-L-12)
8. **G5-Q-08** Which List row and bulk actions are in scope (Edit, Delete, bulk reassign, bulk move, Trigger Calls), and are saved filters per user or per team? (G5-E-06, G5-E-07, G5-E-08, G5-E-09, G5-L-08)
9. **G5-Q-09** Should Admin role-targeted tasks appear in clinic My Tasks? If so, how is a target role matched to a signed-in user (role ID on the team member)? Should search include the creator? (G5-M-02, G5-A-11, G5-E-16, G5-M-05)
10. **G5-Q-10** Does "Tasks by me" mean "created by me"? Should practice managers see all practice tasks? (G5-E-17)
11. **G5-Q-11** What does "Mark Completed" mean in My Tasks: check all of my deliverables, close the task for everyone, or remove the action? (G5-E-18, G5-M-11)
12. **G5-Q-12** How does a creator reach the Overall Completion and breakdown view when row click opens the edit drawer? Options: a "View" action, or open the detail page with an Edit button. (G5-E-19, G5-B-16)
13. **G5-Q-13** Recurrence: is the next task created on completion or on a fixed schedule? Does it copy deliverables and responsible people? (G5-B-14)
14. **G5-Q-14** Who may delete a task from the detail header: the creator, admins, or a permission? (G5-E-25)
15. **G5-Q-15** Admin PRD F-3.4 allows Client Portal share, but F-4 forbids Admin tasks reaching patients. Confirm that Client Portal share is disabled for Admin tasks. (G5-E-26)
16. **G5-Q-16** Who receives each task notification (assignee, observers, creator, platform admin)? (G5-E-29, G5-M-13, G5-A-10)
17. **G5-Q-17** Should a passed deadline also move the task to the "Task Overdue" stage automatically? (G5-M-12)
18. **G5-Q-18** Is there a "Create task" automation action in Workflows, and are such tasks shown in Tasks by me? (G5-B-26)
19. **G5-Q-19** On edit, should completion be kept for unchanged deliverables, and what happens to completion on deleted or added items? (G5-E-20)
20. **G5-Q-20** Should Admin tasks target specific organizations? Where does the ORGANIZATION value come from? (G5-E-27, G5-A-07)
21. **G5-Q-21** Keep or drop the STAGE column in `/admin/tasks`? (G5-A-02)
22. **G5-Q-22** Glossary: nav "Process" → route `/deals` → badge "Pipeline" → toasts "Deal…", vs. nav "Workflows" → route `/process`, vs. PRD "Process & Deals" / "Process Instances", vs. Tasks "Workflow Pipeline". Which terms are canonical? (G5-K-19)
23. **G5-Q-23** Should the process detail drawer get its own PRD (D.3)? Should staff be able to trigger the configured cross-process hand-off from it? (G5-D-01…09, G5-E-14)
