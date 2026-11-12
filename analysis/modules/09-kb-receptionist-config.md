# G9 — Knowledge Base + AI Receptionist (client-side configuration) — Gap Analysis
_Sources:_ PRD files `content/client/knowledge-base.md`, `content/client/settings/reception.md`, `content/ai-receptionist/settings/architecture.md`, `content/ai-receptionist/settings/queue.md`, `content/ai-receptionist/settings/stations.md` | Prototype routes/files `/knowledge-base` → `src/app/pages/KnowledgeBase.tsx`; `/settings/reception` (and `/receptionist` redirect) → `src/app/pages/Settings.tsx` → `src/app/components/reception/ReceptionSettingsTab.tsx`; stores `src/lib/receptionSettingsStore.ts`, `src/lib/roomsStore.ts`; unrouted `src/app/pages/MyAIReceptionist.tsx`; kiosk cross-reference `src/reception/avatar/AvatarReceptionView.tsx`, `src/reception/lib/api/mockMaClient.ts` | Analysed 2026-11-12

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Knowledge Base (`/knowledge-base`) | 0 | 1 | 10 | 2 | 4 | 7 | 3.8% |
| AI Receptionist settings: Kiosk & Terminals (incl. queue rules) | 12 | 2 | 2 | 1 | 1 | 6 | 76.5% |
| AI Receptionist settings: Clinic Rooms & Desks | 8 | 0 | 5 | 2 | 0 | 5 | 53.3% |
| Live sync / reliability (architecture.md, config-related cross-refs) | 4 | 2 | 0 | 0 | 1 | 0 | 83.3% |
| Legacy "My AI Receptionist" page (unrouted) | 0 | 0 | 0 | 0 | 0 | 1 | No PRD |
| **Totals** | **24** | **5** | **17** | **5** | **6** | **19** | **52.0%** |

Overall coverage: 52.0% · PRD-backed coverage: 52.0% (the only No-PRD screen contributes no countable rows)

## Route map
| Route(s) | Page file | PRD file |
| :--- | :--- | :--- |
| `/knowledge-base` (`routes.tsx:237`; sidebar CUSTOMIZATIONS group `navigation.ts:155-159`) | `src/app/pages/KnowledgeBase.tsx` | `content/client/knowledge-base.md` |
| `/settings/reception` (also `/settings/ai-receptionist`, `/settings/receptionist`; `Settings.tsx:851-852`) behind `SettingsGuard` (`routes.tsx:252-256`) | `Settings.tsx:8139` → `components/reception/ReceptionSettingsTab.tsx` | `content/client/settings/reception.md`; `content/ai-receptionist/settings/queue.md`; `content/ai-receptionist/settings/stations.md` |
| `/receptionist` | Redirects to `/settings/reception` (`routes.tsx:262`) | reception.md (redirect itself undocumented) |
| none (no route imports it) | `src/app/pages/MyAIReceptionist.tsx` (legacy, 4,157 lines) | none |
| `/reception?terminal=…&org=…` (kiosk, owned by kiosk agent) | `src/reception/avatar/AvatarReceptionView.tsx` | `content/ai-receptionist/settings/architecture.md` + kiosk PRDs (cross-ref only) |

---

## A. Product map — as built

### A1. Knowledge Base
**Purpose.** A list of "knowledge sources" (reference material for the AI). Each source is restricted to selected workflows (processes) and stages. Header copy: "Give your AI reference material, scoped to the exact processes and stages where it should be used." (`KnowledgeBase.tsx:1537-1542`).

**User roles.** No role gating. The sidebar item has no role restriction (`navigation.ts:155-159`; roles omitted means every role sees it, `navigation.ts:40`). The page has no permission check. A `knowledgeBase` permission row exists in the roles drawer (`RolesPermissionsDrawer.tsx:47`), but nothing enforces it on this page.

**Screens.** Page header with a "How Knowledge Base Works" help modal. A topbar with search, type presets, type filter fields, a type dropdown, list/grid toggle and a "Create Knowledge Base" primary action (`:1545-1641`). A bulk-selection bar (`:1644-1675`). A list table (Actions, Name, Type, Scope, Tags, Status, Created) or a grid of cards (`:1684-1824`). A Create/Edit drawer (`:712-1046`). A delete confirmation modal (`:1059-1100`).

**Step-by-step flows.**
1. **Open page.** Sources load from browser storage. In the demo workspace, a demo key or 4 seed sources load. In a fresh workspace, an org-specific key, a signup key or a global key loads, otherwise the list is empty. Any other workspace uses the global key or the seeds (`:1182-1219`). The page reloads when the store, the org or storage changes (`:1251-1265`). There is no loading or error state; parse errors fall back silently to the seeds.
2. **Filter/search.** Presets are All Sources, Text Articles, File Documents and URLs & Links, each with a count (`:1550-1579`). Search matches the **source name only** (substring), not the content (`:1283-1286`). Changing either resets to page 1 (`:1456-1457`).
3. **Empty state.** When no rows match, the page shows "No Knowledge Bases yet … Create Knowledge Base" (`:1678-1683`, `:1105-1124`). This copy also appears when a search or filter simply matches nothing (defect E-05).
4. **Create.** "Create Knowledge Base" opens the drawer (`:1632-1640`). The fields are:
   - Name* (`:721-733`)
   - Tags / Categories: a combo box of 10 preset tags, and Enter adds a custom tag (`:84-95`, `:736-760`)
   - Scope*: an "All" checkbox, or a process tree with per-stage checkboxes, where all stages checked collapses to "whole process" (`:431-545`). The tooltip reads "only be used by the AI when it's active in the selected process and stage".
   - Content type: Text, File, or URL. URL is disabled with the tooltip "Coming soon" (`:960-988`).
   - Text: a textarea; the title is derived from the first 40 characters (`:991-1005`).
   - File: a single-file picker for PDF/DOC/DOCX/TXT/CSV. Only the file name and size are kept (`:1027-1039`, `:653-657`).
5. **Validation on Save** (`:659-688`), each shown as a toast:
   - "Please enter a Knowledge Base name"
   - "Please select at least one process or stage"
   - "Please enter some content" (text)
   - "Please upload a file" (file)
   - On success: "Knowledge Base created" / "Knowledge Base updated".
6. **Status.** Text sources save as Completed. Files save as Pending and flip to Completed after a 2-second timer (`:678`, `:669`, `:1498-1502`). "Processing" and "Failed" exist as styles but are never set (`:216-221`).
7. **Edit.** Use the row action, the card menu or a click on the name (`:1781-1790`, `:340-345`). The drawer pre-fills from the source. A URL source is forced into "Text" mode with empty content, so it cannot be saved (`:625-630`; defect E-04).
8. **Delete.** Single delete (row/card) or bulk "Delete Selected" (table bulk action or bulk bar) opens a confirmation modal: "This will permanently remove the selected reference material and the AI will no longer have access to it." Toast: "Knowledge source(s) deleted" (`:1506-1517`).
9. **Copy KB ID.** The grid card footer copies the ID and shows "KB ID copied to clipboard" (`:192-212`, `:409`).
10. **Deep-link from Workflows.** On the Process page, the "add knowledge" button navigates to `/knowledge-base?action=create&processId=…&processName=…` with the process's stages in navigation state (`Process.tsx:4306`; admin template equivalent `AdminProcessTemplates.tsx:3925`). The drawer opens pre-scoped to that process. The process is appended to the in-memory process tree for this visit only (`KnowledgeBase.tsx:1357-1409`).

**Business rules.**
- Every source needs a name and either "All Processes" or at least one process/stage (`:660-661`).
- Scope is stored as a process ID plus stage IDs. An empty stage list means all stages (`:104-107`, `:457-488`).
- The process list in the scope picker is a **hardcoded seed** of 2 processes (Patient Intake, Follow-up Calls), not the live Workflows list (`:62-80`, `:1238`). Defect E-03.
- URL sources exist only in seed data ("single-page-only", `:132-137`, `:1141-1152`). Users cannot create them.
- There is no draft/publish state, no folders and no article body viewer.

**KPIs & metrics.**
| Name | Where shown | Formula | Citation |
| :--- | :--- | :--- | :--- |
| Source count per type (All / Text / Files / URLs) | Topbar presets and dropdown | Count of stored sources, total or by type | `KnowledgeBase.tsx:1554-1575`, `:1610-1613` |
| Selected count | Bulk bar | Number of selected rows | `:1649` |

**Cross-module references.**
- Workflows/Process deep-link (above).
- **No AI channel reads this store.** The store is exported (`:1179-1226`), but nothing outside the page imports it.
- The kiosk "knowledge base" query returns 3 hardcoded answers (parking, hours, pharmacy) plus an escalation fallback (`mockMaClient.ts:1727-1745`), and no kiosk screen calls it.
- Chatbots carry an always-empty knowledge list (`ChatbotTab.tsx:44`, `:110`).
- An unused `components/KnowledgeBaseTab.tsx` exists that no file imports.
- Admin Knowledge Base (`/admin/knowledge-base`) belongs to another agent.

### A2. AI Receptionist settings — Kiosk & Terminals
**Purpose.** Configure kiosk branding, which kiosk features are on, queue rules and named kiosk terminals. File header: `ReceptionSettingsTab.tsx:1-9`.

**User roles.** **SystemAdmin only.** `SettingsGuard` redirects any other role to `/` with the toast "Access restricted: Settings requires System Admin privileges." (`SettingsGuard.tsx:7-20`). The sidebar entry "AI Receptionist" sits above "AI Voices / Models" (`SidebarMenuContext.tsx:87`, `:123-137`). The Settings in-page tab label is "AI Receptionist" (`Settings.tsx:3878`).

**Screens.** One topbar with two modes, "Kiosk & Terminals" and "Clinic Rooms & Desks" (the second shows a room-count badge) (`:513-528`). In Kiosk mode the topbar shows the "Unsaved changes" pill, Refresh and "Save settings" (`:568-601`). Four stacked sections follow (`:604-930`).

**Step-by-step flows.**
1. **Load.** The page reads this organization's saved config. It falls back to a shared "last saved" config only if that config belongs to the same organization, and otherwise uses defaults built from the org's name/phone/email (`receptionSettingsStore.ts:39-111`; tab `:142-157`). There is no loading or error UI.
2. **Clinic & persona** (`:607-704`). Fields: Clinic Name, Support Phone, Support Email, Primary Color (swatch plus hex text; an invalid hex falls back to `#2f2447` for the swatch, `:508`) and Greeting Phrase. None of these fields are validated (email format, phone, hex). Every edit marks the draft dirty (`:253-256`).
3. **Kiosk features** (`:706-755`). Six switches: Walk-in, Face check-in, QR check-in, Voice, Payments, Print token. Defaults: all on except Print token (`receptionSettingsStore.ts:19-26`).
4. **Queue & Onboarding Rules** (`:757-838`):
   - Late Arrival Window slider: 5–45 in steps of 5, default 15. Help text: "> X m late are automatically downgraded to Priority 0".
   - Anti-Starvation Queue Aging Cap slider: 20–90 in steps of 5, default 45. Help text: "Walk-in tickets waiting > X m receive an automatic priority boost".
   - Default Onboarding Process: a fixed dropdown of 4 names, Appointment Scheduling (Default), Patient Intake, Follow-up Calls and Clinical Visit Journey (`:820-831`).
   - There are no token prefix inputs and no early-arrival input.
5. **Receptionist terminals** (`:840-928`). Two default terminals: Front Desk/Lobby and OPD Desk/Floor 1 (`receptionSettingsStore.ts:28-31`).
   - "+ Add terminal" appends "Reception Terminal N" / "Desk N" (`:271-288`).
   - Name and Location Label are edited inline.
   - **Remove** deletes the row from the draft with no confirmation (`:299-303`).
   - Empty state: "No terminals configured yet. Click "+ Add terminal" to provision a kiosk station." (`:863-868`).
6. **Launch** (`:306-315`). Writes the current draft to storage, then opens `/reception?terminal=&terminalName=&location=&org=` in a new tab. The kiosk header shows "• AI Receptionist • Name (Location)" (`AvatarReceptionView.tsx:478-489`, `:3827`). The "Unsaved changes" pill stays visible even though the draft was just written (E-11).
7. **Save settings.** Saves under an org-specific key **and** a shared key, broadcasts a change event, and shows the toast "AI Receptionist settings saved". On failure the toast is "Failed to save settings" (`:241-251`; `receptionSettingsStore.ts:125-131`).
8. **Refresh.** Reloads from storage, discards unsaved edits **without confirmation**, and shows the toast "AI Receptionist settings refreshed" (`:142-153`, `:577-584`). Leaving the page with unsaved edits gives no warning.

**What each setting changes on the kiosk (verified in kiosk code).**
| Setting | Kiosk effect | Citation |
| :--- | :--- | :--- |
| Clinic Name | Brand name in kiosk header/greeting | `AvatarReceptionView.tsx:476`, `:1489-1492` |
| Greeting Phrase | Spoken English greeting. The Hindi greeting ignores it and always uses a generated phrase | `:1493-1497` |
| Primary Color | Brand-colored element background | `:3818` |
| Voice toggle | Off: the kiosk does not auto-start listening after the greeting | `:1508`, `:1523` |
| Payments toggle | Off: hides the billing entry points | `:3893`, `:4010` |
| Walk-in / Face check-in / QR check-in / Print token | **No effect.** No kiosk code reads them | grep: no consumer (E-08) |
| Support Phone / Email | **No effect.** No kiosk code reads them | grep: no consumer |
| Terminals | Header label for a launched terminal | `:478-489` |
| Late Arrival Window / Aging Cap | **No effect.** Stored, never read by queue logic | `receptionSettingsStore.ts:62-64`; no consumer (E-09) |
| Default Onboarding Process | Used for kiosk walk-ins, **unless** the appointment-default-process key is set, which takes precedence | `mockMaClient.ts:708-721` (E-10) |
| Token prefixes (not editable) | Fixed defaults D-/P-/L-/B-/R- used to mint `PREFIX-###` | `receptionSettingsStore.ts:55-61`; `mockMaClient.ts:1273-1285` |

**Business rules.** Config is per organization, with a shared fallback (E-13). Slider ranges and defaults are as listed in step 4. Terminal IDs are timestamp-based.

**KPIs & metrics.** None. The rooms badge in the topbar counts unified rooms (`:524`).

**Cross-module references.** Kiosk (above). Organization profile (default name/phone/email, `:88-98`). Process module: the dropdown is static, not linked to live processes.

### A3. AI Receptionist settings — Clinic Rooms & Desks
**Purpose.** One table of every room the kiosk can route to. It combines Products & Services rooms (from the services room store) with standalone "AI Receptionist" rooms (kiosk station list) (`:169-215`).

**User roles.** SystemAdmin only (same guard as A2).

**Screens.**
- Topbar: search ("Search rooms, room #, providers, locations, or services..."), presets All Rooms / Products & Services / AI Receptionist / Active Only with counts, and "Add Room" (`:529-594`).
- Table with columns Room Label, Room Number (`#n` chip), Direction (falls back to Location), Responsible, Active (clickable pill) (`:423-485`). Row actions: Edit Room / Disable or Activate Room / Delete Room (`:487-504`). Clicking a row opens Edit. Column customization is on, there is no row selection, and pages hold 20 rows (`:934-945`).
- Add/Edit drawer (`:949-1068`).

**Step-by-step flows.**
1. **Merge.** Products & Services rooms always show. A standalone station is hidden if its ID or room number matches a Products & Services room (`:191-199`). Standalone rows are listed first (`:214`).
2. **Search** covers name, number, direction, location, responsible and service (`:217-234`). Empty state: "No rooms match your filter. Click Add Room to configure an AI Receptionist room." (`:942`).
3. **Add Room** opens the drawer with the subtitle "AI Receptionist room · No product or service attached". Fields:
   - Room Label* (native `required`)
   - Type: Doctor Room / Pharmacy / Diagnostic Lab / Billing Desk / Front Desk
   - Room Number
   - Direction
   - Location / Floor Wing
   - Responsible (free text)
   - Active
   A whitespace-only label shows the toast "Please enter a room name". Success toast: "AI Receptionist room added (no service attached)" (`:346-399`).
4. **Edit, Products & Services room.** The subtitle reads "Products & Services room · Attached to {service}". Type is hidden. Saving **writes back to the Products & Services room record** (name, number, location, direction, responsible, active). Empty fields keep their previous values, so they cannot be cleared (E-18). Toast: "Room updated successfully" (`:353-362`).
5. **Edit, standalone room.** Updates the station. Toast: "Room updated successfully" (`:363-379`).
6. **Activate/Disable** via the pill or row action. Toast: "Room activated/disabled" (`:412-421`).
7. **Delete** uses a native browser `confirm("Remove …?")`. For a Products & Services room it **deletes the room from Products & Services** (toast "Room removed from Products & Services"). Otherwise the toast is "Room removed" (`:401-410`; `roomsStore.ts:167-173`). See E-14.

**Business rules.**
- Rooms created here never carry a product or service (`:381-395`).
- The Product/Service name is not shown in the table, only in the drawer subtitle (`:953-957`).
- There is no source badge column.
- Storage is global browser storage: the rooms key `mantra_rooms_v1` (`roomsStore.ts:33`) and the stations key (`ReceptionSettingsTab.tsx:56`, `:236-239`). Neither is filtered by organization (E-17).

**Kiosk effect.**
- **Directions directory.** Built from active Products & Services rooms only (`mockMaClient.ts:563`, `:593-615`). Standalone rooms are used only as a fallback when no Products & Services rooms exist (`:624-635`). With the 5 seeded service rooms, standalone rooms never appear (E-15).
- **Station list.** Filtered to the kiosk's default org ID (`:557`, `:54`), so standalone rooms saved under a real org ID (e.g. "eye-mantra") are dropped.
- **Room type.** Every Products & Services room becomes a "Doctor Room" station (`:515`), so its tickets always get the D- prefix (E-16).

**KPIs & metrics.** Preset counts: All, Products & Services, AI Receptionist, Active (`:540-563`). All are computed counts.

**Cross-module references.** Products & Services (`Services.tsx`, `ServiceDrawer.tsx:235` share the rooms store). Appointment room allocation (`appointmentService.ts:718`, patient booking screens) through the room-finder (`roomsStore.ts:183+`). Kiosk directory and walk-in booking.

### A4. Live sync / reliability (config-relevant cross-references only)
- **Config changes.** Reach open kiosks in the same browser profile through the change event and the storage event (`receptionSettingsStore.ts:133-146`; kiosk subscribes at `AvatarReceptionView.tsx:469-474`).
- **Rooms.** Re-read whenever the kiosk asks for stations or directions (`mockMaClient.ts:495-557`).
- **Duplicate protection.** 24-hour TTL (`mockMaClient.ts:55`, `:477-482`).
- **Inactivity reset.** 60 seconds (`AvatarReceptionView.tsx:125`).
- **Queue outcomes.** No-show/left; "left" is stored as cancelled (`mockMaClient.ts:1668-1673`).
- **Audit events.** Logged from the kiosk.
- **Sync limit.** All sync is browser-local storage. There is no cross-device sync.
- The kiosk agent owns the depth review of these items.

### A5. Legacy "My AI Receptionist" page
`MyAIReceptionist.tsx` is not routed: `/receptionist` redirects to settings (`routes.tsx:262`), and no file imports the page. It contains a phone-agent configuration UI:
- greeting
- custom commands prompt
- add text, crawl a website and upload a document as training material
- voice library and clone voice
- languages
- call transfer scenarios
- booking scenarios
- weekly availability

All of it is held in component state only (`MyAIReceptionist.tsx:9-80`). It overlaps both the Knowledge Base (website/document ingestion) and the AI Voices settings. Logged as E-19.

---

## B. Product map — per PRD

### B1. Knowledge Base (`knowledge-base.md`)
- **Purpose:** a "clinical protocol and operational guideline repository". Staff author medical SOPs, triage FAQs and practice guides, and "the AI bot references these articles for automated patient responses" (`§ 1. Module Summary`).
- **Roles:** Medical Assistant (JTBD F-1-J1). No permissions are described.
- **Screens/flows** (`§ F-1 → 2. What it includes`):
  - F-1.1 category folder tree (Clinical Protocols, Front Desk FAQs, Insurance Policies; collapsible)
  - F-1.2 semantic search over titles **and contents** with keyword highlighting, sub-second
  - F-1.3 Markdown reader view (tables, callouts, diagrams; printable)
- **Worked example:** typing "fever triage" opens "Pediatric Fever Management Protocol".
- **Rules:** articles that are published are indexed and retrievable instantly (`§ F-1 → 5. Acceptance criteria F-1-1`).
- **Not described:** source types, file upload, process/stage scoping, tags, status, create/edit/delete, IDs, which AI channels use the content, org scoping.
- **KPIs:** none. **Cross-refs:** none (no Cross-product Summary section).

### B2. AI Receptionist Settings (`reception.md`)
- **Placement:** Settings sidebar, above AI Voices / Models. One topbar switches between Kiosk & Terminals and Clinic Rooms & Desks (`§ 1. Module Summary`).
- **F-1 Clinic & persona.** Clinic Name, Support Phone, Support Email, Primary Color (swatch + hex) and Greeting Phrase "spoken by Aria". Changes persist per organization and sync live. The topbar holds Refresh / Save settings / Unsaved changes. AC: saving updates kiosk headers and greetings immediately (`§ F-1`).
- **F-2 Kiosk features.** Six toggles with exact copy. F-2.2: applied directly to kiosk UIs. Worked example: Payments and Print token off hides bill pay (`§ F-2`).
- **F-3 Queue & Onboarding Rules** (inside Kiosk & Terminals):
  - Late Arrival Window 5–45/5/15
  - Aging Cap 20–90/5/45
  - Default Onboarding Process from four names
  - No Queue tab and **no Token Numbering Prefixes** (`§ F-3`, AC F-3-AC1)
- **F-4 Terminals.** Add terminal, Name, Location Label, Launch (persists settings and opens a tagged tab), Remove (`§ F-4`).
- **F-5 Rooms table:**
  - unified Products & Services plus standalone rooms
  - "source badge" and "attached Product / Service badge", with standalone rooms showing "None attached" in a Product / Service column (`§ F-5 → 1`)
  - but F-5.2/AC1 require exactly 5 columns (Room Label, Room Number, Direction, Responsible, Active) "with no extra subtext"
  - presets All Rooms / Products & Services / AI Receptionist / Active Only
  - drawer fields as built
- **Cross-product Summary:** kiosk greeting/branding, stations, queue rules ("control live kiosk queue fairness"), sync, Walk-in toggle "displays walk-in registration on kiosks", Products & Services rooms with service badge, Process Kanban pipelines "selectable inside Default Onboarding Process".
- **Roles:** Practice Manager, Operations Lead/Director, Front-Desk Supervisor, Facilities Lead (JTBDs). No permission rule.

### B3. Queue Rules (`queue.md`)
- F-1 configurable token prefixes D-/P-/L-/B-/R- (AC F-1-AC1: "Token prefixes configured in Reception Settings immediately format newly issued kiosk tickets").
- F-2 Late Arrival Window (5–45/5/15) plus an **Early Arrival Buffer of 30m**.
- F-3 Aging Cap (20–90/5/45) with priority promotion.
- F-4 Default Onboarding Process: four tracks, Stage 1 auto-enrolment of new walk-ins.

### B4. Stations (`stations.md`)
- **F-1 Clinic Rooms & Desks:**
  - five station types
  - an "Add Room **Modal**" with name validation "Please enter a room name"
  - toasts "Room added successfully" / "Room updated successfully"
  - delete removes the room from kiosk routing
- **F-2 Visibility:** active Doctor Rooms drive walk-in booking; **all active rooms** of all five types populate kiosk zone directories; tickets are paired with the station; deactivated rooms are hidden from self-service and historic tickets are preserved.
- **F-3 Stage Portal & Reception Settings card composer:** HTML/Preview, field picker with CLIENTS / APPOINTMENTS / INVOICES / STAGE, APPLY/CANCEL. Configured in Process stages.

### B5. Architecture (`architecture.md`)
- F-1 unified sync of CRM, schedule, billing, rooms and audit; instant multi-screen broadcast "across kiosk terminals and front-desk browsers"; room edits propagate to lobby screens.
- F-2 24-hour duplicate protection.
- F-3 queue outcomes Waiting / In Service / Completed / No Show / Left, with People Ahead recalculation.
- F-4 60-second privacy reset; voice and camera fallback.

---

## C. Findings

### C1. Knowledge Base
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G9-KB-01 | Flow | A repository of reference material that staff author for the AI | Partial (PRD less detailed) | knowledge-base.md § 1. Module Summary | `KnowledgeBase.tsx:1537-1542`, `:712-1046` | Same intent. The PRD describes none of the authoring flow that is built |
| G9-KB-02 | Rule | Content model: "sources" of type Text / File (PDF, DOC, DOCX, TXT, CSV) / URL (disabled, "Coming soon") vs authored Markdown "articles" | Contradicts or stale | § F-1 (F-1.3 Markdown Article Viewer) | `:99`, `:960-1043` | PRD and build disagree on what a KB item is: an article vs an uploaded or pasted source |
| G9-KB-03 | Rule | Each source is scoped to All Processes or selected processes/stages; the AI uses it only in that process and stage | Missing in PRD | — | `:104-107`, `:431-545`, `:660-661` | Core rule of the built design. Undocumented |
| G9-KB-04 | Flow | Category folder tree (Clinical Protocols / Front Desk FAQs / Insurance Policies) | PRD-only (not built) | § F-1 → F-1.1 | — | The build has free-form tags instead (see KB-16) |
| G9-KB-05 | Flow | Search: PRD wants semantic full-text search with highlighting; build matches the name only | Contradicts or stale | § F-1 → F-1.2, worked example | `:1283-1286` | The PRD worked example ("fever triage" finding an article by its content) would fail |
| G9-KB-06 | Flow | Reader view (formatted, printable) | PRD-only (not built) | § F-1 → F-1.3 | — | No way to read a source's content except via Edit (text only) |
| G9-KB-07 | Rule | Processing status lifecycle Pending / Processing / Completed / Failed shown per source | Missing in PRD | — | `:100`, `:216-235` | Simulated in the prototype, see E-06 |
| G9-KB-08 | Rule | Published articles are indexed and retrievable instantly; publish state | PRD-only (not built) | § F-1 → 5. AC F-1-1 | — | No draft/publish concept, no index |
| G9-KB-09 | X-ref | The AI (voice, chat, kiosk) references KB content when answering | PRD-only (not built) | § 1. Module Summary | Store exported `:1179-1226`, no importer; `ChatbotTab.tsx:110` | The PRD also does not say which channels use it or how scoping applies per channel (Q-01) |
| G9-KB-10 | X-ref | Kiosk "knowledge base" answers | Prototype defect | — | `mockMaClient.ts:1727-1745` | See E-01 |
| G9-KB-11 | Flow | Edit source (pre-filled drawer, keeps status and created date) | Missing in PRD | — | `:618-631`, `:1781-1790` | |
| G9-KB-12 | Flow | Delete single or bulk with confirmation modal | Missing in PRD | — | `:1059-1100`, `:1506-1517` | |
| G9-KB-13 | Flow | List/grid views, type presets with counts, pagination of 20/50/100 | Missing in PRD | — | `:1550-1631`, `:1228` | |
| G9-KB-14 | Flow | Copy KB ID (grid card) | Missing in PRD | — | `:192-212` | The purpose of the ID is unclear (Q-03) |
| G9-KB-15 | X-ref | Workflows/Process "add knowledge" deep-link opens drawer pre-scoped to that process | Missing in PRD | — | `Process.tsx:4306`; `KnowledgeBase.tsx:1357-1409` | Cross-module hand-off |
| G9-KB-16 | Rule | Tags: 10 presets (Feedback, Plan Details, Complaints, FAQ, Pricing, Policy, Refund, Onboarding, Support, Billing) plus custom tags | Missing in PRD | — | `:84-95`, `:736-760` | The presets are generic SaaS terms, not clinic categories (Q-02) |
| G9-KB-17 | Rule | Empty state "No Knowledge Bases yet" with Create CTA | Missing in PRD | — | `:1105-1124` | |
| G9-KB-18 | Rule | [SECURITY] Access: every role sees and edits the KB; no permission check | Missing in PRD | — | `navigation.ts:155-159`; `RolesPermissionsDrawer.tsx:47` | The AI's reference material can be changed by Agent or Reception roles (Q-04) |
| G9-KB-19 | Rule | [SECURITY] Org isolation of sources | Prototype defect | — | `:1212-1223` | See E-02 |
| G9-KB-20 | Rule | Scope picker shows the live list of Workflows | Prototype defect | — | `:62-80`, `:1238` | See E-03 |
| G9-KB-21 | Flow | Edit a URL source | Prototype defect | — | `:625-630` | See E-04 |
| G9-KB-22 | Flow | Empty state when a search or filter matches nothing | Prototype defect | — | `:1678-1683` | See E-05 |
| G9-KB-23 | Rule | File ingestion and processing status | Prototype defect | — | `:653-657`, `:1498-1502` | See E-06 |
| G9-KB-24 | Rule | Help modal claims URL sources and "AI reviews scoped material first" | Prototype defect | — | `:1847-1852` | See E-07 |

### C2. AI Receptionist settings — Kiosk & Terminals
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G9-KT-01 | Flow | Single topbar switching Kiosk & Terminals / Clinic Rooms & Desks | Matches | reception.md § 1; § F-1 | `ReceptionSettingsTab.tsx:513-528` | |
| G9-KT-02 | Flow | Topbar Unsaved changes pill, Refresh, Save settings (Kiosk mode only) | Matches | reception.md § F-1 → F-1.1 | `:568-601` | |
| G9-KT-03 | Flow | Clinic & persona: Clinic Name, Support Phone, Support Email, Primary Color (swatch + hex), Greeting Phrase | Matches | reception.md § F-1 → F-1.2, F-1.3 | `:607-704` | No field validation, in either the PRD or the build (Q-06) |
| G9-KT-04 | X-ref | Greeting Phrase spoken by the kiosk | Partial (PRD less detailed) | reception.md § F-1 AC1 | `AvatarReceptionView.tsx:1493-1497` | Used for English only. Hindi always uses a generated greeting; the PRD is silent on languages (Q-07) |
| G9-KT-05 | X-ref | Primary Color and Clinic Name brand the kiosk | Matches | reception.md § Cross-product Summary row 1 | `AvatarReceptionView.tsx:476`, `:3818` | |
| G9-KT-06 | X-ref | Support Phone / Email shown on the kiosk | Partial (PRD less detailed) | reception.md § F-1 | no kiosk consumer | Saved but never displayed. The PRD never says where they appear (Q-08) |
| G9-KT-07 | Flow | Six feature toggles with exact copy, persisted on Save | Matches | reception.md § F-2 → F-2.1, AC1 | `:58-69`, `:706-755`; defaults `receptionSettingsStore.ts:19-26` | |
| G9-KT-08 | X-ref | Toggles enforced on the kiosk | Prototype defect | reception.md § F-2 → F-2.2 | `AvatarReceptionView.tsx:1508`, `:1523`, `:3893`, `:4010` | See E-08 |
| G9-KT-09 | Rule | Late Arrival Window slider 5–45, step 5, default 15 | Matches | reception.md § F-3; queue.md § F-2 AC1 | `:777-791`; `receptionSettingsStore.ts:62` | |
| G9-KT-10 | Rule | Anti-Starvation Aging Cap slider 20–90, step 5, default 45 | Matches | reception.md § F-3; queue.md § F-3 AC1 | `:800-814`; `receptionSettingsStore.ts:64` | |
| G9-KT-11 | X-ref | Late window and aging cap applied to kiosk queue ordering | Prototype defect | queue.md § F-2, § F-3; reception.md § Cross-product row 3 | no consumer | See E-09 |
| G9-KT-12 | Flow | Default Onboarding Process selector | Matches | reception.md § F-3 → F-3.3; queue.md § F-4 | `:819-835` | |
| G9-KT-13 | X-ref | Walk-ins enrolled into the selected process | Prototype defect | queue.md § F-4 AC1 | `mockMaClient.ts:718-721` | See E-10 |
| G9-KT-14 | Rule | Process options are a fixed list of four names, not live Workflows | Matches | reception.md § F-3; queue.md § F-4 | `:826-831` | Conflicts with reception.md § Cross-product row 7 ("Process Kanban configures the pipelines selectable"); Q-09 |
| G9-KT-15 | Rule | Token numbering prefixes: reception.md says none; queue.md says configurable in Reception Settings | Contradicts or stale | reception.md § F-3 AC1 vs queue.md § F-1 AC1 | No UI; fixed defaults `receptionSettingsStore.ts:55-61` used in `mockMaClient.ts:1282-1285` | queue.md is stale relative to the build and reception.md (Q-10) |
| G9-KT-16 | Rule | Early Arrival Buffer of 30m | PRD-only (not built) | queue.md § F-2 → F-2.2 | stored default only `receptionSettingsStore.ts:63` | No UI and no enforcement |
| G9-KT-17 | Flow | Terminals: + Add terminal, inline Name/Location, Remove, empty state | Matches | reception.md § F-4 AC1 | `:271-303`, `:840-928` | Remove has no confirmation (E-12) |
| G9-KT-18 | Flow | Launch persists settings and opens a tagged kiosk tab; header shows "Name (Location)" | Matches | reception.md § F-4 → F-4.3, worked example | `:306-315`; `AvatarReceptionView.tsx:478-489`, `:3827` | |
| G9-KT-19 | Flow | Launch with unsaved draft | Prototype defect | reception.md § F-4 | `:306-307` | See E-11 |
| G9-KT-20 | Flow | Refresh / leave page with unsaved edits; Remove terminal | Prototype defect | reception.md § F-1.1 | `:142-153`, `:299-303` | See E-12 |
| G9-KT-21 | Rule | [SECURITY] Config persists per organization | Prototype defect | reception.md § F-1 AC1, § F-2 AC1 | `receptionSettingsStore.ts:113-131` | See E-13 |
| G9-KT-22 | Rule | [SECURITY] Only SystemAdmin can open AI Receptionist settings | Missing in PRD | — (JTBDs name Practice Manager, Ops Lead, Front-Desk Supervisor) | `SettingsGuard.tsx:7-20`; `routes.tsx:252-262` | The personas the PRD names would be locked out (Q-05) |
| G9-KT-23 | Flow | Sidebar placement "AI Receptionist" above "AI Voices / Models" | Matches | reception.md § 1 | `SidebarMenuContext.tsx:87`, `:123-137` | |
| G9-KT-24 | Flow | `/receptionist`, `/settings/ai-receptionist`, `/settings/receptionist` redirect to this tab | Missing in PRD | — | `routes.tsx:262`; `Settings.tsx:851-852` | |

### C3. AI Receptionist settings — Clinic Rooms & Desks
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G9-RM-01 | Flow | Unified table of Products & Services rooms plus standalone AI Receptionist rooms | Matches | reception.md § F-5 → 1; stations.md § F-1 | `ReceptionSettingsTab.tsx:169-215`, `:933-946` | |
| G9-RM-02 | Rule | Dedupe: a standalone station is hidden if its ID or room number matches a service room; standalone rows are listed first | Missing in PRD | — | `:191-199`, `:214` | Two rooms with the same number from different sources collapse silently |
| G9-RM-03 | Rule | Five columns: Room Label, Room Number, Direction, Responsible, Active | Matches | reception.md § F-5 → F-5.2, AC1 | `:423-485` | |
| G9-RM-04 | Rule | Source badge and Product/Service column ("None attached") | Contradicts or stale | reception.md § F-5 → 1 and worked example vs F-5.2/AC1 | Not shown; service name appears only in the drawer subtitle `:953-957` | The PRD contradicts itself. The build follows the 5-column AC (Q-11) |
| G9-RM-05 | Flow | Topbar search, four presets with counts, Add Room | Matches | reception.md § F-5 → F-5.1 | `:529-594` | Search also covers location, provider and service (undocumented detail) |
| G9-RM-06 | Rule | Direction column falls back to Location when Direction is empty | Missing in PRD | — | `:450-452` | |
| G9-RM-07 | Flow | Add/Edit side drawer with Room Label*, Type, Room Number, Direction, Location / Floor Wing, Responsible, Active | Matches | reception.md § F-5 → F-5.3 | `:949-1068` | stations.md § F-1.2 still says "Modal" (stale wording) |
| G9-RM-08 | Rule | Success toast copy: "Room added successfully" vs built "AI Receptionist room added (no service attached)" | Contradicts or stale | stations.md § F-1 AC2 | `:395` | Update copy |
| G9-RM-09 | Rule | Validation "Please enter a room name" | Matches | stations.md § F-1 AC1 | `:348-351` | The browser's native "required" prompt fires first for an empty field. The toast appears only for a whitespace-only name |
| G9-RM-10 | Rule | Type is hidden when editing a Products & Services room | Missing in PRD | — | `:994-1009` | |
| G9-RM-11 | X-ref | Editing a Products & Services room here writes back to the Products & Services record | Missing in PRD | — | `:353-362`; `roomsStore.ts:153` | Cross-module write path |
| G9-RM-12 | Flow | Activate/Disable via pill and row action | Matches | reception.md § F-5 → 1; stations.md § F-1.3 | `:412-421`, `:464-484` | |
| G9-RM-13 | Flow | Delete Room (incl. Products & Services rooms) | Prototype defect | stations.md § F-1.4 | `:401-410` | See E-14 |
| G9-RM-14 | X-ref | Active rooms of all types populate the kiosk directory and walk-in routing | Prototype defect | stations.md § F-2; reception.md § Cross-product row 2 | `mockMaClient.ts:557`, `:563`, `:593-635` | See E-15 |
| G9-RM-15 | X-ref | Ticket prefix follows station type | Prototype defect | queue.md § F-1; stations.md § F-2 | `mockMaClient.ts:515`, `:1282-1283` | See E-16 |
| G9-RM-16 | X-ref | Deactivated rooms hidden from the kiosk directory | Matches | stations.md § F-2 → F-2.1 | `mockMaClient.ts:563`, `:629` | |
| G9-RM-17 | Rule | [SECURITY] Rooms and stations isolated per organization | Prototype defect | reception.md § 1 (per-org) | `roomsStore.ts:33`; `ReceptionSettingsTab.tsx:56`, `:133-140` | See E-17 |
| G9-RM-18 | Flow | Clearing fields on a Products & Services room | Prototype defect | — | `:356-358` | See E-18 |
| G9-RM-19 | X-ref | Stage Portal & Reception Settings card composer | Matches | stations.md § F-3 | `components/process/StagePortalReceptionSettingsModal.tsx` (exists) | Existence only. Process agent owns the detail |
| G9-RM-20 | Rule | Empty state "No rooms match your filter. Click Add Room…"; row click opens Edit | Missing in PRD | — | `:942-943` | |

### C4. Live sync / reliability (config-related cross-references)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G9-AR-01 | X-ref | Settings changes propagate to open kiosks without refresh | Matches | architecture.md § F-1 → F-1.2; reception.md § F-1 | `receptionSettingsStore.ts:133-146`; `AvatarReceptionView.tsx:469-474` | Same browser profile only (see AR-07) |
| G9-AR-02 | X-ref | Room edits propagate to lobby screens | Partial (PRD less detailed) | architecture.md § F-1 worked example | `mockMaClient.ts:495-557` | Products & Services rooms only; standalone rooms are lost (E-15) |
| G9-AR-03 | X-ref | 24-hour duplicate protection | Matches | architecture.md § F-2 | `mockMaClient.ts:55`, `:477-482` | Kiosk agent owns the depth review |
| G9-AR-04 | X-ref | Queue outcomes incl. "Left" | Partial (PRD less detailed) | architecture.md § F-3 | `mockMaClient.ts:1668-1673` | "Left" is stored as Cancelled. Kiosk agent to confirm |
| G9-AR-05 | X-ref | 60-second privacy reset | Matches | architecture.md § F-4 | `AvatarReceptionView.tsx:125` | |
| G9-AR-06 | X-ref | Kiosk audit events | Matches | architecture.md § F-1 | `mockMaClient.ts` (logAuditEvent) | Existence only |
| G9-AR-07 | X-ref | Sync across separate devices (kiosk terminal ↔ desk browser) | PRD-only (not built) | architecture.md § 1, § F-1.2 | browser storage only | Expected prototype limitation, but the PRD presents it as live behaviour |

### C5. Legacy page
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G9-LG-01 | Flow | "My AI Receptionist" phone-agent config page | Prototype defect | none | `MyAIReceptionist.tsx:9-80`; `routes.tsx:262` | See E-19 |

---

## D. Correct flow as built (PRD-ready)

> D1 replaces `content/client/knowledge-base.md`. D2 replaces `content/client/settings/reception.md`. D3 replaces `content/ai-receptionist/settings/queue.md`. D4 replaces `content/ai-receptionist/settings/stations.md`. `architecture.md` is kiosk runtime and is left to the kiosk agent. The only G9 delta for it is AR-07 (Q-14).

### D1 — `content/client/knowledge-base.md`

```markdown
---
title: "Knowledge Base"
product: "client"
module: "knowledge-base"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| :--- | :--- |
| Module | KNOWLEDGE-BASE |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Workflows (Process) | "Add knowledge" on a workflow opens Create Knowledge Base already scoped to that workflow and its stages. | [View in Client](/client/processes/list) |
| AI Receptionist | Kiosk answers | Decision needed: which channels (kiosk voice, phone voice, chat) read Knowledge Base sources, and how process/stage scope applies to a kiosk visitor who is not yet in a workflow (see G9-Q-01). | [View in AI Receptionist](/ai-receptionist/avatar/ambient-presence) |
| Client | Chats (chatbots) | Decision needed: whether chatbots attach Knowledge Base sources (see G9-Q-01). | [View in Client](/client/chats) |

## 1. Module Summary
- Knowledge Base is under **Customizations** in the Client sidebar. It holds **knowledge sources**: reference material the AI uses when it answers.
- Each source is **Text** (pasted) or **File** (PDF, DOC, DOCX, TXT, CSV). Each source is **scoped** to All Processes or to selected workflows and stages. The AI uses a source only while it is working in that workflow/stage.
- Sources carry tags, a processing status and a copyable KB ID. They are listed in a table or grid with type filters and search.

## 2. Feature Requests

### F-1: Knowledge Source List
#### 1. What it does
Lists every knowledge source with Name, Type, Scope, Tags, Status and Created. Users switch between list and grid. They filter by type preset (All Sources, Text Articles, File Documents, URLs & Links, each with a count) and search by source name.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Type presets & filter | Topbar | Filters by All / Text / Files / URLs with live counts | Resets to page 1 |
| F-1.2: Name search | Search | Matches source names (contains) | Decision needed: should search also cover content (see G9-Q-12) |
| F-1.3: List / Grid view | View toggle | Table (20/50/100 per page) or cards showing scope chips (2 + "more"), tags, KB ID, status, date | |
| F-1.4: Copy KB ID | Action | Copies the source ID; toast "KB ID copied to clipboard" | Decision needed: purpose of KB ID (see G9-Q-03) |
| F-1.5: Empty states | State | No sources: "No Knowledge Bases yet" with Create button. Filter with no matches: a "no sources match your filters" message | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Manager looks for insurance material | Selects **File Documents**, types "insurance" | **"Insurance Policy FAQs" (File, Patient Intake (All Stages), Completed) is shown** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When reviewing what the AI knows, I want every source with its scope and status in one list, so that I can spot gaps or stale material. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-AC1 | Presets show live counts per type, and search narrows the list by name. |
| F-1-AC2 | A filter with no matches shows a no-match message, not the first-run empty state. |

### F-2: Create / Edit Knowledge Source (drawer)
#### 1. What it does
"Create Knowledge Base" opens a right-side drawer with these fields:
- **Name\***
- **Tags / Categories**: preset list plus custom tags (Enter)
- **Scope\***: "All", or a workflow tree with per-stage checkboxes. Checking every stage means the whole workflow
- **Content type**: Text or File. URL shows as "Coming soon"
- Text: the title comes from the first 40 characters
- File: one file of type PDF, DOC, DOCX, TXT or CSV

Edit opens the same drawer pre-filled.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Scope picker | Tree | Lists the organization's live workflows and their stages | |
| F-2.2: Validation | Toasts | "Please enter a Knowledge Base name", "Please select at least one process or stage", "Please enter some content", "Please upload a file" | |
| F-2.3: Processing status | Badge | New text sources are Completed. Files are Pending → Processing → Completed or Failed once ingested | Decision needed: failure handling and retry (see G9-Q-13) |
| F-2.4: Prefill from Workflows | Deep link | `/knowledge-base?action=create&processId=…` opens the drawer scoped to that workflow | |
| F-2.5: Tag presets | Combo | Preset tags plus free text | Decision needed: clinic-specific preset list (see G9-Q-02) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic adds a refund policy for follow-up calls only | Name "Cancellation & Refund Policy", tags Policy, Refund, scope Follow-up Calls → Post-Visit Check, Text, pastes policy, Save | **Toast "Knowledge Base created"; source shows Completed with scope "Follow-up Calls > Post-Visit Check"** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When the AI handles a specific workflow stage, I want to give it material that applies only there, so that it does not quote irrelevant policies. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-AC1 | A source cannot be saved without a name and a scope (All, or at least one workflow/stage). |
| F-2-AC2 | Editing any source, including file sources, keeps its type and content. |
| F-2-AC3 | The scope picker lists the organization's current workflows and stages. |

### F-3: Delete Knowledge Sources
#### 1. What it does
Single delete (row/card menu) or bulk "Delete Selected" opens a confirmation listing the items: "This will permanently remove the selected reference material and the AI will no longer have access to it."
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Confirm modal | Modal | Cancel / Delete | Toast "Knowledge source(s) deleted" |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Outdated catalogue | Selects it, **Delete Selected**, confirms | **Source removed; selection cleared** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When material is retired, I want to remove it safely, so that the AI stops using it. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-AC1 | No source is deleted without confirmation. |

### F-4: Access & Isolation
#### 1. What it does
Sources belong to one organization and are visible only within it. Decision needed: which roles may view, create, edit and delete sources (see G9-Q-04).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Organization scoping | Rule | Sources are stored and listed per organization | |
| F-4.2: Role permissions | Rule | Decision needed (see G9-Q-04) | Roles drawer already lists a Knowledge Base permission |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | User switches organization | Opens Knowledge Base | **Only that organization's sources are listed** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinic Owner | When several clinics share the platform, I want our reference material kept private, so that another clinic's AI never uses it. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-AC1 | Switching organization never shows another organization's sources. |

### Not yet built
- **URL sources** (single page; shown as "Coming soon").
- **AI consumption** of sources by kiosk, voice and chat, with scope enforcement (G9-Q-01).
- **Folders** (Clinical Protocols, Front Desk FAQs, Insurance Policies), **content search with highlighting**, and a **reader/print view**. These are from the earlier PRD. Decision needed: keep or drop (see G9-Q-12).
- **Real file ingestion and processing status**.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Knowledge Source List | F-1.1–F-1.5 | Lists sources by type with search, list/grid and KB ID copy. |
| F-2 | Create / Edit Knowledge Source | F-2.1–F-2.5 | Drawer for text/file sources scoped to workflows and stages. |
| F-3 | Delete Knowledge Sources | F-3.1 | Confirmed single or bulk deletion. |
| F-4 | Access & Isolation | F-4.1–F-4.2 | Sources are private to the organization; role permissions to be decided. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Give the AI scoped, current reference material and retire stale material. | F-1, F-2, F-3 |
| 2 | Clinic Owner | Keep reference material private to my organization. | F-4 |
```

### D2 — `content/client/settings/reception.md`

```markdown
---
title: "AI Receptionist Settings"
product: "client"
module: "settings"
channel: "reception"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | Client (Clinic Practice Management) |
| :--- | :--- |
| Module | Settings & Administration - AI Receptionist |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| AI Receptionist | Kiosk Shell & Ambient Greeting | Clinic Name and Primary Color brand the kiosk; Greeting Phrase is spoken as the English welcome. Decision needed: Hindi/other-language greeting (see G9-Q-07). | [View in AI Receptionist](/ai-receptionist/avatar/ambient-presence) |
| AI Receptionist | Kiosk feature toggles | Each of the six toggles shows or hides its kiosk entry point (Walk-in, Face check-in, QR check-in, Voice listening, Payments, Print token). | [View in AI Receptionist](/ai-receptionist/checkin/walk-in) |
| AI Receptionist | Clinic Stations | Active rooms from both sources populate kiosk directions, walk-in routing and ticket station. | [View in AI Receptionist](/ai-receptionist/settings/stations) |
| AI Receptionist | Queue Rules | Late Arrival Window and Aging Cap govern kiosk check-in tolerance and queue priority; Default Onboarding Process receives new walk-ins. | [View in AI Receptionist](/ai-receptionist/settings/queue) |
| AI Receptionist | Terminals | Launch opens a kiosk tab labelled "Terminal Name (Location)". | [View in AI Receptionist](/ai-receptionist/settings/architecture) |
| Client | Products & Services | Rooms created in Products & Services appear in Clinic Rooms & Desks. Editing one here updates it in Products & Services. | [View in Client](/client/services) |
| Client | Organization | Clinic Name, Support Phone and Support Email default from the organization profile. | [View in Client](/client/settings/organization) |

## 1. Module Summary
- **AI Receptionist** is in the Client sidebar **Settings** section, above **AI Voices / Models**. `/receptionist`, `/settings/ai-receptionist` and `/settings/receptionist` redirect here. Access: Decision needed (built as System Admin only; see G9-Q-05).
- One **topbar** switches between **Kiosk & Terminals** and **Clinic Rooms & Desks**, the latter with a room-count badge.
- **Kiosk & Terminals** shows **Unsaved changes**, **Refresh** and **Save settings** in the topbar above four sections: **Clinic & persona**, **Kiosk features**, **Queue & Onboarding Rules**, **Receptionist terminals**. All settings are saved per organization.
- **Clinic Rooms & Desks** shows search, source presets and **Add Room** above a five-column rooms table.

## 2. Feature Requests

### F-1: Unified Topbar & Clinic & Persona
#### 1. What it does
The topbar switches mode and carries Unsaved changes / Refresh / Save settings in Kiosk mode. **Clinic & persona** has a row of Clinic Name, Support Phone, Support Email and Primary Color (swatch plus hex, default `#2f2447`), and a full-width **Greeting Phrase**. Defaults come from the organization profile.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Save / Refresh / Unsaved | Topbar | Save writes all Kiosk & Terminals settings ("AI Receptionist settings saved"). Refresh reloads saved values ("AI Receptionist settings refreshed") | Refresh and leaving the page ask for confirmation when there are unsaved changes |
| F-1.2: Branding & contact row | Inputs | Clinic Name, Support Phone, Support Email, Primary Color | Decision needed: where support contacts appear on the kiosk (see G9-Q-08) and validation rules (see G9-Q-06) |
| F-1.3: Greeting Phrase | Textarea | Spoken English welcome on the kiosk | |
#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Clinic configures "Navodya Eye Clinic" | Updates name, colour and greeting, clicks **Save settings** | **Open kiosks re-brand and use the new greeting without reload** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When setting up a location, I want kiosk identity in one place, so that every kiosk greets visitors as our clinic. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-AC1 | Saving persists settings for the current organization only and updates open kiosks of that organization. |
| F-1-AC2 | Unsaved changes are never discarded without confirmation. |

### F-2: Kiosk Features
#### 1. What it does
Six switches, each with its description: **Walk-in** (on), **Face check-in** (on), **QR check-in** (on), **Voice** (on), **Payments** (on), **Print token** (off by default).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Feature switches | Switches | Saved with Save settings | |
| F-2.2: Kiosk enforcement | Behaviour | Voice off: the kiosk does not listen after greeting. Payments off: billing entry points hidden. Walk-in / Face / QR / Print token off: the matching kiosk option is hidden | |
#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Kiosk without printer, no bill pay | Turns off Print token and Payments, saves | **Kiosk hides bill-pay and printed tokens; other options remain** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Operations Lead | When hardware differs per site, I want to switch workflows on or off, so that kiosks never offer what we cannot fulfil. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-AC1 | Each toggle, once saved, shows or hides its kiosk entry point. |

### F-3: Queue & Onboarding Rules
#### 1. What it does
A three-column section inside Kiosk & Terminals:
- **Late Arrival Window**: 5–45 min, step 5, default 15
- **Anti-Starvation Queue Aging Cap**: 20–90 min, step 5, default 45
- **Default Onboarding Process**: Appointment Scheduling (Default), Patient Intake, Follow-up Calls, Clinical Visit Journey

There are no token-prefix inputs; prefixes are fixed defaults (see queue.md).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Late Arrival Window | Slider | Appointments checking in later than this lose appointment priority | Behaviour defined in queue.md |
| F-3.2: Aging Cap | Slider | Walk-ins waiting longer than this get a priority boost | |
| F-3.3: Default Onboarding Process | Select | New kiosk walk-ins enter this process | Decision needed: fixed list vs live workflows, and precedence over the appointment default process (see G9-Q-09) |
#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Peak-hour tuning | Sets Late 15m, Cap 40m, process Clinical Visit Journey, saves | **All kiosk settings save together** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Operations Director | When tuning fairness, I want arrival and aging rules beside kiosk settings, so that I save everything once. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-AC1 | Sliders use the stated ranges, steps and defaults, and saved values govern the kiosk queue. |

### F-4: Receptionist Terminals
#### 1. What it does
Defaults: Front Desk (Lobby) and OPD Desk (Floor 1). **+ Add terminal** appends "Reception Terminal N" / "Desk N". Name and Location Label are edited inline. **Remove** removes a terminal after confirmation. **Launch** saves the current settings and opens `/reception` in a new tab, labelled "Terminal Name (Location)". Empty state: "No terminals configured yet…".
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Add terminal | Action | Adds an editable row | |
| F-4.2: Name & Location | Inputs | Shown in the kiosk header | |
| F-4.3: Launch / Remove | Actions | Launch saves settings (clearing Unsaved changes) then opens the kiosk; Remove asks for confirmation | |
#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Lobby and Floor 1 desks | Launches OPD Desk | **Kiosk tab shows "AI Receptionist • OPD Desk (Floor 1)"** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-Desk Supervisor | When running several kiosks, I want each named and launched from settings, so that staff open the right session. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-AC1 | Launch opens a kiosk for the current organization with the terminal label, using just-saved settings. |

### F-5: Clinic Rooms & Desks
#### 1. What it does
- One table combines **Products & Services rooms** with **standalone AI Receptionist rooms** (no product/service). A standalone room with the same ID or room number as a service room is not listed twice.
- Columns: Room Label, Room Number, Direction (shows Location if Direction is empty), Responsible, Active (clickable).
- Presets: All Rooms, Products & Services, AI Receptionist, Active Only. Search covers label, number, direction, location, responsible and service.
- Row actions: Edit Room, Disable/Activate Room, Delete Room. Clicking a row opens Edit.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Topbar search, presets, Add Room | Topbar | As above | |
| F-5.2: Five-column table | Table | No source or service column; the service shows in the drawer subtitle | Decision needed: show source/service badge? (see G9-Q-11) |
| F-5.3: Add/Edit drawer | Drawer | Room Label\*, Type (Doctor Room, Pharmacy, Diagnostic Lab, Billing Desk, Front Desk; standalone only), Room Number, Direction, Location / Floor Wing, Responsible, Active | Toasts: "Room added successfully" / "Room updated successfully"; validation "Please enter a room name" |
| F-5.4: Editing a Products & Services room | Rule | Saves back to Products & Services; any field can be changed or cleared | |
| F-5.5: Delete | Rule | Confirmation dialog. Decision needed: may a Products & Services room be deleted from here? (see G9-Q-15) | |
#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Add standalone "Main Pharmacy Counter" | **Add Room**, Type Pharmacy, Room "Counter A", Active, **Create Room** | **Row appears under AI Receptionist preset and in kiosk directions** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Facilities Lead | When adding non-service destinations, I want rooms without a service, so that kiosks can route to them. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-AC1 | Both sources render in the five-column table; rooms are stored and listed per organization. |
| F-5-AC2 | Active rooms of both sources appear in kiosk directions; inactive rooms do not. |

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Topbar & Clinic & Persona | F-1.1–F-1.3 | Branding, contacts and greeting, with guarded save/refresh. |
| F-2 | Kiosk Features | F-2.1–F-2.2 | Six toggles that show or hide kiosk options. |
| F-3 | Queue & Onboarding Rules | F-3.1–F-3.3 | Late window, aging cap, default walk-in process. |
| F-4 | Receptionist Terminals | F-4.1–F-4.3 | Named terminals launched as labelled kiosk tabs. |
| F-5 | Clinic Rooms & Desks | F-5.1–F-5.5 | Unified rooms table and drawer across Products & Services and standalone rooms. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Brand kiosks and keep one room inventory. | F-1, F-5 |
| 2 | Operations Director | Control kiosk workflows and queue fairness. | F-2, F-3 |
| 3 | Front-Desk Supervisor | Launch the right kiosk per desk. | F-4 |
```

### D3 — `content/ai-receptionist/settings/queue.md`

```markdown
---
title: "Queue Rules & Intake Defaults"
product: "ai-receptionist"
module: "settings"
channel: "queue"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Settings & Configuration - Queue Rules & Intake Defaults |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Reception Settings | Late Arrival Window, Aging Cap and Default Onboarding Process are set in Settings → AI Receptionist → Kiosk & Terminals. | [View in Client](/client/settings/reception) |
| Client | Workflows | New kiosk walk-ins enter the Default Onboarding Process. | [View in Client](/client/processes/kanban) |
| AI Receptionist | Check-in & My Visit | Tickets use station-type prefixes and queue priority rules. | [View in AI Receptionist](/ai-receptionist/my-visit/tracker) |

## 1. Module Summary
- Defines ticket numbering, arrival tolerance, queue aging and the walk-in onboarding default for kiosk queues.

## 2. Feature Requests

### F-1: Token Prefixes (fixed)
#### 1. What it does
Tickets are numbered `PREFIX-###` per station queue, using fixed prefixes: Doctor Room `D-`, Pharmacy `P-`, Diagnostic Lab `L-`, Billing Desk `B-`, Front Desk `R-`. Prefixes are not editable in Settings. Decision needed: make them editable later? (see G9-Q-10)
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Prefix by station type | Rule | The ticket prefix follows the destination station's type | Products & Services rooms need a type (see G9-Q-16) |
#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Lab walk-in | Ticket issued at a Diagnostic Lab station | **`L-004`** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Waiting Room Coordinator | Distinguish department queues at a glance. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-AC1 | Each ticket's prefix matches its destination station type. |

### F-2: Late Arrival Window
#### 1. What it does
Slider 5–45 min, step 5, default 15. Appointments checking in later than the window are downgraded to standard (walk-in) priority.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Late slider | Setting | As above | |
#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Window 20m, slot 10:00, arrival 10:14 | Inside window | **Checked in with appointment priority** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinic Manager | Let slightly late patients check in without desk override. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-AC1 | The saved window determines whether an arriving appointment keeps priority. |

### F-3: Anti-Starvation Queue Aging Cap
#### 1. What it does
Slider 20–90 min, step 5, default 45. Walk-in tickets waiting longer than the cap are promoted ahead of fresh routine arrivals.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Aging cap slider | Setting | As above | |
#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Walk-in waited 46m, cap 45m | Threshold crossed | **Walk-in promoted** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Walk-In Patient | Not be bumped indefinitely. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-AC1 | Tickets past the saved cap are ordered ahead of newer routine tickets. |

### F-4: Default Onboarding Process
#### 1. What it does
Options: Appointment Scheduling (Default), Patient Intake, Follow-up Calls, Clinical Visit Journey. A new kiosk walk-in enters the selected process. Decision needed: precedence vs the appointment-level default process (see G9-Q-09).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Process picker | Select | As above | |
#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Picker set to Patient Intake; walk-in registers | Client created | **Client enters Patient Intake** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front-Desk Lead | Route kiosk walk-ins into our intake workflow. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-AC1 | Subsequent walk-ins enter the newly saved process. |

### Not yet built
- **Early Arrival Buffer** (30 min default): stored but has no setting and no enforcement.
- **Enforcement** of the Late Arrival Window and Aging Cap in queue ordering.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Token Prefixes | F-1.1 | Fixed station-type prefixes. |
| F-2 | Late Arrival Window | F-2.1 | 5–45m tolerance. |
| F-3 | Aging Cap | F-3.1 | 20–90m promotion threshold. |
| F-4 | Default Onboarding Process | F-4.1 | Walk-in process routing. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator | Clear, fair queues. | F-1, F-2, F-3 |
| 2 | Front-Desk Lead | Auto-route walk-ins. | F-4 |
```

### D4 — `content/ai-receptionist/settings/stations.md`

```markdown
---
title: "Clinic Stations & Process Stage Guidance"
product: "ai-receptionist"
module: "settings"
channel: "stations"
status: "In Review"
created_date: "2026-11-12"
last_updated: "2026-11-12"
---

| Product | AI Receptionist |
| :--- | :--- |
| Module | Settings & Configuration - Clinic Stations & Stage Guidance |
| Status | In Review |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client | Reception Settings → Clinic Rooms & Desks | Rooms are managed there (drawer). | [View in Client](/client/settings/reception) |
| Client | Products & Services | Service rooms are part of the same room list. | [View in Client](/client/services) |
| Client | Workflows | Stage Portal & Reception Settings cards render on kiosk My Visit → Next Step. | [View in Client](/client/processes/kanban) |
| AI Receptionist | Directions | Active rooms populate the kiosk directory. | [View in AI Receptionist](/ai-receptionist/directions/departments) |

## 1. Module Summary
- Rooms (stations) are the single list kiosks use for directions, walk-in routing and ticket destinations. Stage cards give patients next-step guidance.

## 2. Feature Requests

### F-1: Clinic Rooms & Desks Management
#### 1. What it does
Add Room opens a side **drawer**: Room Label\*, Type (Doctor Room, Pharmacy, Diagnostic Lab, Billing Desk, Front Desk), Room Number, Direction, Location / Floor Wing, Responsible, Active. Edit, Activate/Disable and Delete (with confirmation) are available per row.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Five types | Catalog | As above | |
| F-1.2: Drawer | Form | "Please enter a room name" when the label is empty; "Room added successfully" / "Room updated successfully" | |
| F-1.3: Active toggle | Control | Pill in table or row action | |
| F-1.4: Delete | Control | Confirmation required | |
#### 3. Worked example
| # | Situation | What the admin does | Result |
| :--- | :--- | :--- | :--- |
| 1 | New lab bay | Adds "Lab Bay B", #204, Diagnostic Lab, Active | **Appears in kiosk directions and lab queue** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Operations Lead | Maintain one accurate room list for kiosks. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-AC1 | An unnamed room cannot be saved. |
| F-1-AC2 | Saved rooms reflect in kiosk directions for the same organization. |

### F-2: Station Visibility on the Kiosk
#### 1. What it does
Active rooms from Products & Services and from AI Receptionist populate kiosk directions (grouped by category) and walk-in routing. Inactive rooms are hidden; historic tickets are kept. A Products & Services room uses its own type for directory grouping and ticket prefix. Decision needed: how the type is set for service rooms (see G9-Q-16).
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Active filtering | Rule | Inactive rooms are hidden from self-service | |
| F-2.2: Shared registry | Rule | Renames propagate to directions and tickets | |
#### 3. Worked example
| # | Situation | What happens | Result |
| :--- | :--- | :--- | :--- |
| 1 | Room 102 renamed "Eye Suite 102" | Kiosk re-reads rooms | **New name on directions and confirmation** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Administrator | Update a room once everywhere. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-AC1 | Deactivating a room removes it from kiosk selection without affecting issued tickets. |

### F-3: Stage Portal & Reception Settings Card Composer
(Unchanged from the current PRD; owned by the Workflows/Process analysis.)

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Rooms Management | F-1.1–F-1.4 | Drawer-based room create/edit/toggle/delete. |
| F-2 | Kiosk Visibility | F-2.1–F-2.2 | Active rooms of both sources drive kiosk routing. |
| F-3 | Stage Card Composer | — | Next-step cards from workflow stages. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Operations Lead | One room list for all kiosk routing. | F-1, F-2 |
```

---

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
| :--- | :--- | :--- | :--- | :--- |
| G9-E-01 | The Knowledge Base is not connected to any AI channel. The kiosk "knowledge base" query returns 3 hardcoded answers (parking, hours, pharmacy) plus an escalation fallback, and no kiosk screen calls it. Chatbots carry an always-empty knowledge list. Content a clinic adds never reaches the AI, yet the delete modal claims "the AI will no longer have access to it". Fabricated/placeholder behaviour presented as real | `mockMaClient.ts:1727-1745`; `KnowledgeBase.tsx:1179-1226` (no importer); `ChatbotTab.tsx:110` | High | KB-09, KB-10 |
| G9-E-02 | [SECURITY] Outside fresh/demo workspaces, KB sources are read and written under one global storage key, with no organization key. Every save writes the global key, even in a fresh workspace that read an org-specific key. Sources can leak across organizations | `KnowledgeBase.tsx:1195-1223` | High | KB-19 |
| G9-E-03 | The scope picker lists a hardcoded seed of 2 processes, not the live Workflows. Processes added via deep-link exist for that visit only, so after reload their scope chips disappear (a scope whose process is unknown renders nothing) | `KnowledgeBase.tsx:62-80`, `:1238`, `:1370-1400`, `:256-257` | High | KB-20 |
| G9-E-04 | Editing a URL source opens in Text mode with empty content. Save fails with "Please enter some content", or converts the URL into a text source | `KnowledgeBase.tsx:625-630`, `:674-678` | Medium | KB-21 |
| G9-E-05 | When a search or filter returns no rows, the page shows the first-run "No Knowledge Bases yet" empty state, not a no-match message | `KnowledgeBase.tsx:1678-1683` | Low | KB-22 |
| G9-E-06 | File upload keeps only the file name and size, not the content. "Pending → Completed" is a fake 2-second timer that does not run if the page is left. Failed/Processing are never set | `KnowledgeBase.tsx:653-657`, `:1498-1502` | Medium | KB-23 |
| G9-E-07 | The help modal says you can add URLs and that the "AI reviews scoped material first", but URL is disabled and no AI reads the KB | `KnowledgeBase.tsx:1847-1852`, `:976-988` | Low | KB-24 |
| G9-E-08 | Four of the six kiosk toggles (Walk-in, Face check-in, QR check-in, Print token) have no effect on the kiosk. Only Voice and Payments are read | `AvatarReceptionView.tsx:1508`, `:1523`, `:3893`, `:4010`; toggles `ReceptionSettingsTab.tsx:58-69` | High | KT-08 |
| G9-E-09 | The Late Arrival Window and Aging Cap are saved but never read by any queue or check-in logic. The UI promises "downgraded to Priority 0" and "automatic priority boost" | `ReceptionSettingsTab.tsx:777-814`; `receptionSettingsStore.ts:62-64` (no consumer) | High | KT-11 |
| G9-E-10 | When an appointment-default-process value exists, it silently overrides the Default Onboarding Process chosen here for kiosk walk-ins | `mockMaClient.ts:718-721` | Medium | KT-13 |
| G9-E-11 | Launch writes the unsaved draft to storage (it publishes to kiosks without Save), but the "Unsaved changes" pill stays visible | `ReceptionSettingsTab.tsx:306-307`, `:571-576` | Low | KT-19 |
| G9-E-12 | Refresh discards unsaved edits without confirmation. There is no warning when leaving with unsaved changes. Removing a terminal has no confirmation | `ReceptionSettingsTab.tsx:142-153`, `:577-584`, `:299-303` | Low | KT-20 |
| G9-E-13 | [SECURITY] Save also writes a shared "last saved" config key. A kiosk opened without, or with an unknown, `org` parameter falls back to that key and shows whichever organization saved last (branding, contacts, terminals). The kiosk's ticket logic also reads the shared key | `receptionSettingsStore.ts:113-131`; `AvatarReceptionView.tsx:461-466`; `mockMaClient.ts:1273` | High | KT-21 |
| G9-E-14 | Delete Room uses a native browser confirm. For a Products & Services room it permanently deletes the room from Products & Services, breaking that service's room allocation. Destructive cross-module action with weak confirmation | `ReceptionSettingsTab.tsx:401-410`; `roomsStore.ts:167-173` | High | RM-13 |
| G9-E-15 | Standalone AI Receptionist rooms do not reach kiosk directions. The directory is built from Products & Services rooms and uses stations only when none exist (5 are seeded). The kiosk station list also filters to the default org ID, dropping rooms saved under the active org (e.g. "eye-mantra") | `mockMaClient.ts:557`, `:563`, `:593-635`, `:54`; `ReceptionSettingsTab.tsx:382-385` | High | RM-14 |
| G9-E-16 | Every Products & Services room becomes a "Doctor Room" station, so its tickets always use `D-` and grouping is guessed from the service name | `mockMaClient.ts:515-521` | Medium | RM-15 |
| G9-E-17 | [SECURITY] The rooms and stations lists are global browser storage, not per organization. The settings table shows every org's rooms | `roomsStore.ts:33`, `:109-125`; `ReceptionSettingsTab.tsx:56`, `:133-140` | High | RM-17 |
| G9-E-18 | When editing a Products & Services room, an emptied Room Number, Location or Direction field keeps its old value, so these fields cannot be cleared | `ReceptionSettingsTab.tsx:356-358` | Low | RM-18 |
| G9-E-19 | The orphaned 4,157-line "My AI Receptionist" page is unreachable (`/receptionist` redirects) but still ships. It has state-only KB ingestion (crawl/upload), a voice library, transfers and booking scenarios that duplicate other modules | `MyAIReceptionist.tsx:9-80`; `routes.tsx:262` | Low | LG-01 |

## Open questions for PM
1. **G9-Q-01:** Which AI channels read Knowledge Base sources (kiosk voice, phone voice agent, chat/chatbots)? How does process/stage scope apply to a kiosk visitor or caller who is not yet in a workflow ("All Processes" only?)? (KB-09, E-01, D1 Cross-product)
2. **G9-Q-02:** Should the tag presets be clinic-specific (e.g. Clinical Protocols, Front Desk FAQs, Insurance) instead of Pricing/Refund/Plan Details? (KB-16, D1 F-2.5)
3. **G9-Q-03:** What is the KB ID for? Is it referenced in workflow steps or prompts? (KB-14, D1 F-1.4)
4. **G9-Q-04:** [SECURITY] Which roles may view, create, edit or delete KB sources? Today every role can. (KB-18, D1 F-4.2)
5. **G9-Q-05:** [SECURITY] AI Receptionist settings are SystemAdmin-only, but the PRD's personas are Practice Manager, Ops Lead and Front-Desk Supervisor. Should Admin/Manager get access, perhaps to Rooms only? (KT-22, D2 § 1)
6. **G9-Q-06:** Validation rules for Support Email, Support Phone and the hex color? (KT-03, D2 F-1.2)
7. **G9-Q-07:** Should the Greeting Phrase support per-language versions? Hindi ignores it today. (KT-04, D2 Cross-product)
8. **G9-Q-08:** Where should Support Phone and Support Email appear on the kiosk? They are not shown today. (KT-06, D2 F-1.2)
9. **G9-Q-09:** Should Default Onboarding Process list live Workflows rather than 4 fixed names? Which wins: this setting or the appointment-level default process? (KT-13, KT-14, E-10, D2 F-3.3, D3 F-4)
10. **G9-Q-10:** Token prefixes: confirm they stay fixed (reception.md) and queue.md F-1 is retired, or add an editor? (KT-15, D3 F-1)
11. **G9-Q-11:** Should the rooms table show a source badge and the attached Product/Service ("None attached"), or keep the clean 5 columns? reception.md says both. (RM-04, D2 F-5.2)
12. **G9-Q-12:** Are the original KB concepts (folders, content search with highlighting, reader/print view, publish/index) still wanted? (KB-04, KB-05, KB-06, KB-08, D1 Not yet built)
13. **G9-Q-13:** What happens when file processing fails (Failed status, retry, notification)? (KB-07, E-06, D1 F-2.3)
14. **G9-Q-14:** architecture.md promises live sync across separate devices. Mark it as a backend requirement, out of prototype scope? (AR-07)
15. **G9-Q-15:** May a Products & Services room be deleted from AI Receptionist settings, or only deactivated or unlinked? (RM-13, E-14, D2 F-5.5)
16. **G9-Q-16:** How is the station type (and so the ticket prefix and directory group) set for Products & Services rooms? Add a Type field there? (RM-15, E-16, D4 F-2)
