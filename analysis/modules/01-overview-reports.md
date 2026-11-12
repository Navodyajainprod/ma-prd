# G1 — Overview (dashboard) + Reports — Gap Analysis
_Sources:_ PRD files `content/client/overview.md`, `content/client/reports.md` | Prototype routes `/` → `src/app/pages/Overview.tsx`; `/reports` (also `/admin/reports`, `/admin/campaigns`) → `src/app/pages/Reports.tsx`, `src/app/components/reports/ReportViewerModal.tsx`, `src/app/components/reports/CustomReportBuilderModal.tsx`; supporting `src/lib/reportEngine.ts`, `src/app/context/InvoiceContext.tsx`, `src/lib/processLogsStore.ts`, `src/lib/tasksStore.ts`, `src/lib/notificationsStore.ts`, `src/lib/onboardingWorkspace.ts` | Analysed 2026-11-12

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
|---|---|---|---|---|---|---|---|
| Overview dashboard (`/`) | 0 | 0 | 9 | 1 | 2 | 10 | 0% |
| Reports list (`/reports`) | 0 | 0 | 5 | 0 | 4 | 5 | 0% |
| Report viewer (modal) | 0 | 0 | 8 | 1 | 0 | 7 | 0% |
| Report builder (modal) | 0 | 0 | 7 | 0 | 0 | 4 | 0% |
| **Totals** | **0** | **0** | **29** | **2** | **6** | **26** | **0%** |

Overall coverage: 0% · PRD-backed coverage: 0% (every screen falls under a PRD file, so the two figures are the same).

Why the score is zero: the two PRD files describe a different product from the one that was built. The Overview PRD describes a clinical command centre with appointment triage counters and an activity feed. The built Overview is a dashboard of call and automation analytics plus a task list. The Reports PRD describes accounts-receivable (AR) aging and collection-rate reporting. What was built is a general report library with a custom report builder, and neither AR feature exists.

## Route map
| Route | Page / component | PRD file |
|---|---|---|
| `/` (index, inside the signed-in layout) | `src/app/pages/Overview.tsx` | `content/client/overview.md` |
| `/reports` | `src/app/pages/Reports.tsx` + `components/reports/ReportViewerModal.tsx` + `components/reports/CustomReportBuilderModal.tsx` | `content/client/reports.md` |
| `/admin/reports`, `/admin/campaigns` | The same `Reports.tsx` mounted under the admin layout (`src/app/routes.tsx:339-340`). It is not linked from the admin sidebar. | none |

---

## A. Product map — as built

### A1. Overview dashboard
**Purpose.** A home screen titled "Overview Analytics". It shows "call performance, automation health, active tasks, and team notifications" (`Overview.tsx:204-205`).

**User roles.** No role gating. The route only requires a signed-in user (`routes.tsx:215-221`), and the nav item has no role restriction (`navigation.ts:59-62`).

**Screens.** One page:
1. A header with four filter dropdowns.
2. A row of four KPI cards.
3. An Active Tasks list and a Call Distribution donut, side by side.
4. A Conversion Overview bar chart and a Performance Analysis insight panel, side by side.

**Step-by-step flow.**
1. The user opens `/`. The page reads call logs, tasks and notifications from the browser stores (`Overview.tsx:136-138`).
2. The page refreshes itself when calls, tasks, notifications or the active organisation change (`Overview.tsx:140-170`).
3. **Fresh-workspace state.** A newly signed-up organisation is treated as "fresh". Its KPIs show 0 with "No calls registered yet" and "Clean record". The donut is replaced by a dashed "0 TOTAL CALLS" placeholder. The funnel shows "No Funnel Activity Yet", and the insight panel shows onboarding tips (`Overview.tsx:172-178, 316, 521-534, 608-615, 645-660`).
4. **Filters.** The user can pick a process, stage, date range and call type. **None of the four filters affects any number on the page** (`Overview.tsx:131-134, 221-292`). See E-06.
5. **Active Tasks.** The panel shows the first 5 tasks in the store, each with a checklist progress ring or a checkbox, an important star, a deadline, an "x/y done" count and a stage badge. Clicking a row opens `/tasks/:id`, or `/admin/tasks/:id` for an admin-scoped task. "View all tasks" opens `/tasks` (`Overview.tsx:186-188, 412-418, 428-438`). The empty state reads "No active tasks." (`Overview.tsx:422-425`).
6. Loading and error states are **not handled**: the stores are read synchronously and nothing reports a failure.

**Business rules.**
- Fresh workspace means the active organisation is the signup organisation, or an organisation named "Eye Mantra" or flagged as a signup organisation. The Demo organisation is never fresh (`onboardingWorkspace.ts:126-146`).
- Call logs are kept per organisation (`processLogsStore.ts:76-105`). **Tasks and notifications are not kept per organisation**: every organisation sees the same list (`tasksStore.ts:818-835`).

**KPIs & metrics**
| Metric | Where shown | Source / formula | Citation |
|---|---|---|---|
| Total Calls | KPI card 1 and donut centre | Count of the organisation's stored call logs. If the store is empty in a non-fresh workspace it shows **573** instead, which is **hardcoded – formula undefined**. | `Overview.tsx:174, 313, 561` |
| Completed | KPI card 2 | Count of call logs with status "Completed". Falls back to a hardcoded 179 when the store is empty. | `Overview.tsx:175` |
| Success rate | Subtitle of KPI card 2 | Completed ÷ Total Calls × 100, to one decimal place. The total includes calls that are still Pending or In Progress. | `Overview.tsx:177, 337` |
| Failed / Missed | KPI card 3 | Count of call logs with status "Failed". Falls back to a hardcoded 21. No "Missed" status is counted. | `Overview.tsx:176, 355` |
| Avg. Duration ("per successful call") | KPI card 4 | **hardcoded – formula undefined**: always "0m 14s" (or "0m 00s" in a fresh workspace) | `Overview.tsx:178, 376-380` |
| Active Tasks count | Badge on the task panel | Count of **all** tasks in the store, including completed and admin-scoped tasks | `Overview.tsx:403` |
| Call Distribution (10 outcome slices) | Donut chart | **hardcoded – formula undefined**. The slices sum to 573, while the centre shows the computed Total Calls. | `Overview.tsx:80-91, 540, 561` |
| Conversion Overview (6 stages, 573 down to 142) | Bar chart | **hardcoded – formula undefined** | `Overview.tsx:93-100, 619` |
| Peak completion of 86.4% between 2:00 PM and 4:30 PM; AI handled 74% of intakes | Performance Analysis panel | **hardcoded – formula undefined** | `Overview.tsx:666, 673` |
| Daily volume trend (Jul 7 to Aug 13) | Not shown. The data is defined but never rendered. | — | `Overview.tsx:47-78, 103-126` |

**Cross-module references.** Calls come from the Call/Process Logs store (`processLogsStore.ts:76`). Tasks come from the Tasks store, and each row deep-links into the Tasks module (`tasksStore.ts:818`; `Overview.tsx:433, 413`). Notifications are loaded from the notifications store but never displayed (`Overview.tsx:138, 180-194`).

### A2. Reports list
**Purpose.** A library of saved report definitions. The page header promises reports "from live operational data" (`Reports.tsx:107-108`).

**User roles.** No role gating (`navigation.ts:135-138`). The same page is also mounted under `/admin` (`routes.tsx:339-340`).

**Screens and flow.**
1. **Table.** Columns are Report Name (with a "Shared" badge when the report is shared), Type (Template or Custom), Data Source and Last Run (`Reports.tsx:233-296`). Clicking the name or the row opens the viewer (`Reports.tsx:241, 351`).
2. **Search** matches name, description or data source (`Reports.tsx:43-48`).
3. **Preset chips:**
   - All Reports, Templates, Custom Reports, Appointments Data, Processes Data. Each chip shows a count (`Reports.tsx:124-175`).
   - The advanced filter offers Report Name, Report Type and Data Source, with seven data sources (`Reports.tsx:176-223`).
   - Every preset and filter works by writing a word into the search box, so the type filters do not work. See E-11.
4. **Row actions** (`Reports.tsx:298-322`):
   - View, for every report.
   - Edit, for custom reports only.
   - Duplicate. This saves a copy named "(Copy)" as a Custom report and shows a toast (`Reports.tsx:65-91`).
   - Delete, for custom reports only. It deletes at once with no confirmation (`Reports.tsx:98-101`).
5. **Bulk "Delete Selected"** removes only the custom reports in the selection, without confirmation, and always says "Deleted selected reports" (`Reports.tsx:324-339`).
6. **"Create Report"** opens the builder (`Reports.tsx:93-96, 224-228`). "How Reports Works" opens a help modal (`Reports.tsx:374-386`).
7. **States.** The empty-result message is "No reports found matching your filters." (`Reports.tsx:353`). Loading and error states are not handled.

**Business rules.**
- Report definitions are saved in one browser-wide store that is **not separated by organisation** (`InvoiceContext.tsx:398-426`).
- Six reports are seeded, and all six are typed "custom", so the Templates count is 0 (`InvoiceContext.tsx:208-317`).
- "Last Run" is set to the time the report was last saved. Viewing a report does not update it (`InvoiceContext.tsx:703-711`).

**KPIs.** The only numbers on the list are the preset counts: the number of reports of each type or data source (`Reports.tsx:128-168`).

### A3. Report viewer (modal)
**Flow.**
1. Opening a report loads that data source's rows (`ReportViewerModal.tsx:99-102`). It then applies the report's saved period and conditions (`ReportViewerModal.tsx:82-96, 105-193`) and sorts by the saved sort field (`ReportViewerModal.tsx:196-222`).
2. **Calculated Metrics cards.** There is one card per column calculation (count, sum, avg, min or max) (`ReportViewerModal.tsx:225-283, 509-527`). Money fields (`amount`, `cost`, `value`) show as `$x.xx`, and days-in-stage shows as "days".
3. **Chart.** The chart can be a bar, stacked bar, line or pie chart. It is grouped by the X field, optionally split into series, and measured by count or by sum, avg, min or max of a field (`ReportViewerModal.tsx:289-312, 530-651`; `reportEngine.ts:390-546`).
4. **Drill-down.** Clicking a bar or pie slice filters the table and the export to that category. A chip clears the drill-down (`ReportViewerModal.tsx:286, 315-322, 554-562, 609, 640`). Line charts cannot be drilled into.
5. **Table.** The table shows the selected columns, with status badges and money formatting (`ReportViewerModal.tsx:705-725`). It pages at 20 rows, lets the user customise columns, and has a "Totals / Summary" footer per calculation (`ReportViewerModal.tsx:728-789`).
6. **Filter panel.** The panel offers four reporting-period choices, an AND/OR toggle that applies to every condition, a per-condition AND/OR, and field / operator (equals, contains, between, greater than, less than) / value rows. Reset returns to the saved definition. "Apply Filters" only closes the panel, because filters already apply live (`ReportViewerModal.tsx:799-1016`). Filter changes are **not saved** back to the report.
7. **Empty state.** "No records match the configured filter criteria" shows the active timeframe and rule count, with a "Show All N Records" reset (`ReportViewerModal.tsx:681-702`).
8. **Export.** "Export CSV Dataset" downloads the visible columns of the rows after drill-down. The file is named `<report>[_<category>]_export.csv`. If there are no rows it shows the error toast "No data available to export" (`ReportViewerModal.tsx:334-358`).

**Data sources** (`InvoiceContext.tsx:915-971`)
| Source | Origin |
|---|---|
| revenue | Live invoices from the Invoices module, excluding void invoices. Status values: draft, sent, viewed, partial, paid, overdue. |
| calls | 20 static mock rows with dates relative to today, plus computed shift and duration buckets. **This is not the Call Logs store.** (`InvoiceContext.tsx:87-123, 933-955`) |
| appointments, processes, team, messaging | Static mock rows (`InvoiceContext.tsx:125-206`) |
| clients | 10 static rows. Every custom client field is given a made-up value such as "\<Label\> 1/2/3" (`InvoiceContext.tsx:957-967`). |

**Metrics.** Every viewer metric is computed from the rows above. Formulas:
- Count = number of non-empty values.
- Sum and avg = sum and mean of the numeric values, after stripping non-numeric characters.
- Min and max = smallest and largest numeric value.
- All formulas are at `ReportViewerModal.tsx:228-281`; chart values are at `reportEngine.ts:486-534`.

The six seeded reports are:
- Calls by shift (count)
- 1–2 minute calls by weekday (count, filtered to durations between 60 and 120 seconds)
- Appointments by weekday, split by service (stacked count)
- Processes by process name (count)
- Clients × total appointments (sum of the appointments count)
- **Revenue by service (sum of invoice total)**

All seeds are at `InvoiceContext.tsx:208-317`.

### A4. Report builder (modal)
**Flow.**
1. **Step 1: Data source.** The user picks one of six sources: calls, appointments, processes, clients, revenue or team. Messaging is not offered (`CustomReportBuilderModal.tsx:528-568`). Each source pre-selects its first 6 fields and a default chart (`CustomReportBuilderModal.tsx:216-255`).
2. **Step 2: Fields & rules.**
   - Name is required ("Please enter a report name") and description is optional (`:571-597, 410-414`).
   - **Reporting period:** This Month, Last Month, This Week (Last 7 Days), Today, All, or Custom (Last X Days, 1–365) (`:612-637`).
   - **Columns:** add with a searchable picker, reorder, and remove. At least one column must stay ("Report must have at least one column") (`:280-310`).
   - **Per-column calculation:** numeric fields can use sum, avg, count, min or max; other fields can only use count (`:265-277`). There is also a "% Total" checkbox (`:765-767`).
   - **Sort:** field and direction.
   - **Filter conditions:** one-click presets, AND/OR logic, and the operators equals, between, contains, greater than and less than (`:313-335, 939, 1068-1072`).
   - **Chart:** a show/hide toggle and the chart type. The X field comes from the source's fields; when the X field is a date it can be grouped by weekday, exact date or month. The Y value is a record count or a sum, avg, min or max of a field. A breakdown series is optional (`:1171-1372`).
   - **Live preview:** a chart plus the first 5 matching rows (`:338-407, 1400-1516`).
3. **Save.** Editing a custom report overwrites it. Saving after opening a template creates a new custom report. After saving, the viewer opens (`:410-451`; `Reports.tsx:371`).
4. Cancel closes the modal without confirmation. Nothing is lost except the unsaved draft.

**Business rules.** Saved reports are always typed "custom" (`:420`). Axis labels are generated again from the field labels on every save (`:369-389, 442-443`).

### A5. Cross-module consistency
| Metric | Overview | Reports | Other module | Consistent? |
|---|---|---|---|---|
| Total calls / call outcomes | The organisation's call-log store (≈26 calls for Demo, statuses Completed, Failed, Pending) | 20 static mock calls (statuses Completed, Failed, Handoff) | Call Logs page reads the same store as Overview | **No** (E-09) |
| Call outcome categories | 10 hardcoded categories (Skipped, Queued, Busy and so on) | Completed, Failed, Handoff | Completed, Failed, Pending | **No** (E-03) |
| "This Month" / "Last Month" | — | Builder labels these as calendar months, but the engine uses the last 30 / last 90 days | — | **No** (E-18) |
| Revenue | — | Sum of all non-void invoices, drafts included | An unused helper defines "collected" as paid only (`InvoiceContext.tsx:721-723`) | **No** (E-22) |
| Same calculation shown twice in the viewer | — | Cards use the filtered rows; the footer uses the drill-down rows, and the two format min/max differently | — | **No** (E-16) |

---

## B. Product map — per PRD

### B1. Overview (`overview.md`)
- **Purpose:** "central command center" combining daily visit counts, real-time clinical activity, revenue conversion funnel metrics and staff shortcuts (`overview.md § 1. Module Summary`).
- **Roles:** Clinic Coordinator and Medical Assistant appear in the jobs to be done. No permissions are specified.
- **F-1 Daily Appointment Visit Triage Counters** (`§ F-1`):
  - Cards for Total Scheduled, Arrived & Waiting, In Consultation, Completed and Cancelled/No-Show.
  - F-1.1: the Scheduled card is clickable and opens the appointments calendar.
  - F-1.2: the Arrived card turns amber when the wait is over 20 minutes.
  - F-1.3: the Completed card shows a progress bar against a daily goal.
  - AC F-1-1: the counters update without a page refresh.
- **F-2 Real-Time Multi-Channel Activity Feed** (`§ F-2`):
  - Events: WhatsApp, SMS and website messages, form submissions, payments and calls, each with an icon, patient, snippet and relative time, and clickable to the record (F-2.1).
  - Channel filter pills: Chats, Forms, Billing, Calls (F-2.2).
  - AC F-2-1: new events appear at the top in real time.
- Formulas, date ranges, empty states, roles and exports are not specified.

### B2. Reports (`reports.md`)
- **Purpose:** AR aging, clinician encounter productivity, appointment attendance and no-show rates, and automated scheduled PDF/Excel reports (`reports.md § 1. Module Summary`).
- **F-1 Revenue Cycle & AR Aging** (`§ F-1`):
  - F-1.1: an AR aging bar chart with buckets of 0–30, 31–60, 61–90 and 90+ days.
  - F-1.2: a Collection Rate card, defined as the % of billed charges collected within 60 days, compared with the prior month.
  - F-1.3: export to XLSX or PDF.
  - AC F-1-1: unpaid invoices are bucketed by due date.
- No report library, builder, filters, drill-down, sharing or roles are described.

---

## C. Findings

### C1. Overview dashboard
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G1-OV-01 | Flow | Row of four call KPI cards (Total, Completed, Failed/Missed, Avg Duration) | Missing in PRD | — | `Overview.tsx:299-383` | This is the main content of the built dashboard. The PRD does not mention it. |
| G1-OV-02 | Metric | Total Calls = count of the organisation's call logs | Missing in PRD | — | `Overview.tsx:174` | Computed. |
| G1-OV-03 | Metric | Completed count and success rate = Completed ÷ all calls | Missing in PRD | — | `Overview.tsx:175, 177` | The total includes Pending calls (G1-Q-09). |
| G1-OV-04 | Metric | Failed/Missed = count of Failed | Missing in PRD | — | `Overview.tsx:176` | No "Missed" status is counted. |
| G1-OV-05 | Metric | Avg Duration | Prototype defect | — | `Overview.tsx:178` | See E-01 |
| G1-OV-06 | Metric | Call Distribution donut | Prototype defect | — | `Overview.tsx:80-91` | See E-03 |
| G1-OV-07 | Metric | Conversion Overview funnel | Prototype defect | `overview.md § 1` (mentions "revenue conversion funnel metrics") | `Overview.tsx:93-100` | See E-04 |
| G1-OV-08 | Metric | Performance Analysis insights | Prototype defect | — | `Overview.tsx:662-676` | See E-05 |
| G1-OV-09 | Flow | Process, stage, date and call-type filters | Prototype defect | — | `Overview.tsx:131-134` | See E-06 |
| G1-OV-10 | Flow | Active Tasks panel (top 5, progress, deep-link, View all) | Missing in PRD | `overview.md § 1` ("one-click staff shortcuts", vague) | `Overview.tsx:387-507` | |
| G1-OV-11 | Rule | Which tasks the panel shows (all statuses, all scopes, all organisations) | Prototype defect | — | `Overview.tsx:186-188, 403` | See E-07 [SECURITY] |
| G1-OV-12 | Flow | Fresh-workspace zero and empty states | Missing in PRD | — | `Overview.tsx:172-178, 521-534, 608-660` | |
| G1-OV-13 | Rule | Live refresh when the call, task or organisation stores change | Missing in PRD | `overview.md § F-1 AC F-1-1` (the same idea, but for appointment counters) | `Overview.tsx:140-170` | |
| G1-OV-14 | Flow | Daily appointment triage counters (F-1.1–F-1.3: amber after a 20-minute wait, goal progress, link to calendar) | PRD-only (not built) | `overview.md § F-1` | — | The page has no appointment data at all. |
| G1-OV-15 | Flow | Multi-channel activity feed and channel filter pills (F-2.1, F-2.2) | PRD-only (not built) | `overview.md § F-2` | — | |
| G1-OV-16 | Flow | Notifications widget | Prototype defect | — | `Overview.tsx:138, 180-194, 205` | See E-08 |
| G1-OV-17 | Rule | Module purpose: clinical command centre (PRD) versus call and automation analytics (built) | Contradicts or stale | `overview.md § 1. Module Summary` | `Overview.tsx:204-205` | G1-Q-01 |
| G1-OV-18 | X-ref | Calls total agrees with Reports › Calls | Prototype defect | — | `Overview.tsx:174`; `InvoiceContext.tsx:933` | See E-09 |
| G1-OV-19 | X-ref | Task row → `/tasks/:id` or `/admin/tasks/:id`; "View all" → `/tasks` | Missing in PRD | — | `Overview.tsx:413, 433` | |
| G1-OV-20 | Rule | No role gating on the dashboard | Missing in PRD | — | `routes.tsx:215-221`; `navigation.ts:59-62` | G1-Q-16 |
| G1-OV-21 | Metric | Daily volume trend chart (data defined, never rendered) | Prototype defect | — | `Overview.tsx:47-78` | See E-10 |
| G1-OV-22 | Metric | 573 / 179 / 21 fallback values | Prototype defect | — | `Overview.tsx:174-176` | See E-02 |

### C2. Reports list
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G1-RL-01 | Flow | Report library table with search, Create, and a help modal | Missing in PRD | — | `Reports.tsx:103-356, 374-386` | |
| G1-RL-02 | Flow | Preset chips and advanced filters (type, data source) | Missing in PRD | — | `Reports.tsx:124-223` | |
| G1-RL-03 | Rule | Templates, Custom and Report Type filters return the right rows | Prototype defect | — | `Reports.tsx:43-48, 136-154` | See E-11 |
| G1-RL-04 | Rule | Pre-built template library | Prototype defect | — | `InvoiceContext.tsx:208-317` | See E-12 |
| G1-RL-05 | Flow | Row actions: View, Edit (custom), Duplicate, Delete (custom); "Shared" badge | Missing in PRD | — | `Reports.tsx:247-251, 298-322` | Nothing in the product can share a report (G1-Q-15). |
| G1-RL-06 | Flow | Single and bulk delete | Prototype defect | — | `Reports.tsx:98-101, 324-339` | See E-13 |
| G1-RL-07 | Rule | Duplicate always creates an editable Custom copy | Missing in PRD | — | `Reports.tsx:65-91` | |
| G1-RL-08 | Rule | "Last Run" column | Prototype defect | — | `InvoiceContext.tsx:708` | See E-14 |
| G1-RL-09 | Rule | Report storage scope and admin mount | Prototype defect | — | `InvoiceContext.tsx:398-426`; `routes.tsx:339-340` | See E-15 [SECURITY] |
| G1-RL-10 | Rule | No role gating on Reports, which includes revenue data | Missing in PRD | — | `navigation.ts:135-138` | [SECURITY] G1-Q-16 |
| G1-RL-11 | Metric | AR aging bucket chart (0–30, 31–60, 61–90, 90+ days, by due date) | PRD-only (not built) | `reports.md § F-1.1, AC F-1-1` | — | Not possible with the builder: it has no age-bucket rules for dates. |
| G1-RL-12 | Metric | Collection Rate (collected within 60 days ÷ billed, compared with prior month) | PRD-only (not built) | `reports.md § F-1.2` | — | |
| G1-RL-13 | Flow | Automated scheduled PDF/Excel reports | PRD-only (not built) | `reports.md § 1` | — | |
| G1-RL-14 | Metric | Clinician encounter productivity; attendance and no-show **rates** | PRD-only (not built) | `reports.md § 1` | — | Counts by status can be built; a rate percentage cannot. |

### C3. Report viewer
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G1-RV-01 | Flow | Viewer layout: metric cards, chart, table, totals footer | Missing in PRD | — | `ReportViewerModal.tsx:429-796` | |
| G1-RV-02 | Metric | Calculated metric cards: count, sum, avg, min, max | Missing in PRD | — | `ReportViewerModal.tsx:225-283` | Computed. |
| G1-RV-03 | Metric | Cards and footer agree for the same calculation | Prototype defect | — | `ReportViewerModal.tsx:229, 752` | See E-16 |
| G1-RV-04 | Flow | Bar, stacked, line and pie charts with a breakdown series | Missing in PRD | `reports.md § F-1.1` (bar chart only) | `ReportViewerModal.tsx:570-645` | |
| G1-RV-05 | Flow | Chart drill-down filters the table and the export | Missing in PRD | — | `ReportViewerModal.tsx:315-322, 609, 640` | |
| G1-RV-06 | Flow | Drill-down state handling | Prototype defect | — | `ReportViewerModal.tsx:82-96, 484` | See E-17 |
| G1-RV-07 | Flow | Runtime filter panel: period, AND/OR, conditions, reset | Missing in PRD | — | `ReportViewerModal.tsx:799-1016` | |
| G1-RV-08 | Rule | Reporting-period definitions | Prototype defect | — | `ReportViewerModal.tsx:110-127, 825-828` | See E-18 |
| G1-RV-09 | Flow | Export format | Contradicts or stale | `reports.md § F-1.3` (XLSX/PDF) | `ReportViewerModal.tsx:334-358` (CSV only) | G1-Q-14 |
| G1-RV-10 | Flow | No-match empty state with "Show All" reset | Missing in PRD | — | `ReportViewerModal.tsx:681-702` | |
| G1-RV-11 | Rule | Non-revenue data sources are live | Prototype defect | — | `InvoiceContext.tsx:159-206` | See E-20 |
| G1-RV-12 | Rule | Values for client custom fields | Prototype defect | — | `InvoiceContext.tsx:957-967` | See E-21 |
| G1-RV-13 | Metric | Revenue total definition | Prototype defect | — | `InvoiceContext.tsx:916-930` | See E-22 |
| G1-RV-14 | Rule | Viewer filter changes are for this session only and are not saved | Missing in PRD | — | `ReportViewerModal.tsx:82-96, 1000-1003` | G1-Q-13 |
| G1-RV-15 | Metric | Chart aggregation with a breakdown series | Prototype defect | — | `reportEngine.ts:442-447` | See E-23 |
| G1-RV-16 | X-ref | Revenue reports read live invoices from Invoices/Billing | Missing in PRD | — | `InvoiceContext.tsx:916-930` | |

### C4. Report builder
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G1-RB-01 | Flow | Two-step builder (data source → fields & rules); name required | Missing in PRD | — | `CustomReportBuilderModal.tsx:410-414, 523-568` | |
| G1-RB-02 | Rule | Default fields and chart for each source | Missing in PRD | — | `CustomReportBuilderModal.tsx:216-255` | |
| G1-RB-03 | Flow | Column add, remove and reorder (at least one); calculation options per column | Missing in PRD | — | `CustomReportBuilderModal.tsx:265-310` | |
| G1-RB-04 | Rule | "Custom (Last X Days)" period | Prototype defect | — | `CustomReportBuilderModal.tsx:426, 622-637` | See E-19 |
| G1-RB-05 | Flow | Sort, filter conditions, one-click presets, AND/OR | Missing in PRD | — | `CustomReportBuilderModal.tsx:313-335, 939-1072` | |
| G1-RB-06 | Flow | X/Y chart builder: date interval, aggregation, breakdown, chart type, show/hide | Missing in PRD | — | `CustomReportBuilderModal.tsx:1171-1372` | |
| G1-RB-07 | Flow | Live preview chart and 5-row sample | Missing in PRD | — | `CustomReportBuilderModal.tsx:398-407, 1400-1516` | |
| G1-RB-08 | Rule | Save overwrites a custom report, creates a new one when started from a template, then opens the viewer | Missing in PRD | — | `CustomReportBuilderModal.tsx:416-451`; `Reports.tsx:371` | |
| G1-RB-09 | Rule | "% Total" option | Prototype defect | — | `CustomReportBuilderModal.tsx:85, 765-767` | See E-24 |
| G1-RB-10 | Rule | Messaging data source | Prototype defect | — | `CustomReportBuilderModal.tsx:528-536` | See E-25 |
| G1-RB-11 | Rule | Custom axis labels kept when a report is edited | Prototype defect | — | `CustomReportBuilderModal.tsx:369-389, 442-443` | See E-26 |

---

## D. Correct flow as built (PRD-ready)

### D1. Replacement for `content/client/overview.md`

| Product | CLIENT |
|---|---|
| Module | OVERVIEW |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

#### Cross-product Summary
| Direction | Other module | What is exchanged |
|---|---|---|
| Reads | Call / Process Logs (client) | The active organisation's call records and statuses feed the call KPI cards and charts. |
| Reads | Tasks (client and admin) | The task list, its checklist progress and its stage. Rows deep-link to the task detail page. |
| Reads | Onboarding / Organisations | Whether the workspace is fresh decides whether zero and empty states are shown. |
| Reads (intended) | Notifications | Decision needed: should the dashboard show a notifications panel? (see G1-Q-08) |
| Must agree with | Reports › Calls data source | Call totals and outcome categories must use the same definitions (see G1-Q-03). |

#### 1. Module Summary
- The Overview is the signed-in home page ("Overview Analytics"). It summarises call performance for the active organisation, AI automation health, and the user's active tasks.
- All figures are for the active organisation only. They refresh without a page reload when calls, tasks or the active organisation change.
- A newly created ("fresh") workspace shows zero states and onboarding guidance instead of charts.
- Decision needed: should this page also be the clinical command centre described earlier, with appointment triage and an activity feed? (see G1-Q-01)

#### 2. Feature Requests

##### F-1: Call Performance KPI Cards
###### 1. What it does
Shows four cards for the selected filters: Total Calls, Completed (with success rate), Failed / Missed, and Avg. Duration.
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Total Calls | Metric Card | Number of call records for the active organisation in the filter scope | Subtitle "Across selected filters". In a fresh workspace: 0, "No calls registered yet". |
| F-1.2: Completed | Metric Card | Number of calls with status Completed. Subtitle: success rate = Completed ÷ Total Calls × 100, to one decimal place. | Decision needed: should Pending and In-Progress calls be left out of the total? (see G1-Q-09) |
| F-1.3: Failed / Missed | Metric Card | Number of calls with status Failed | Subtitle "Requires attention", or "Clean record" when the workspace is fresh. Decision needed: which statuses count as "Missed"? (see G1-Q-09) |
| F-1.4: Avg. Duration | Metric Card | Average length of a successful call | Decision needed: define formula for Avg. Duration (see G1-Q-02) |
###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The organisation has 26 calls: 22 Completed, 2 Failed, 2 Pending | Opens the Overview | **The cards show Total 26, Completed 22 (84.6% success rate) and Failed 2** |
| 2 | A brand-new organisation from signup | Opens the Overview | **Every card shows 0 with zero-state captions** |
###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice manager | When I start my day, I want to see call volume and outcomes at a glance, so that I know whether the AI receptionist is performing. |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | The figures count only the active organisation's call records and update without a page reload when call records change or the organisation is switched. |
| F-1-2 | When there are no call records, every card shows 0. Sample or placeholder numbers are never shown. |
| F-1-3 | Total Calls on the Overview equals the call count that Reports and Call Logs show for the same scope (see G1-Q-03). |

##### F-2: Dashboard Filters
###### 1. What it does
Lets the user narrow all cards and charts by process, stage, date range and call type.
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Filter by process | Dropdown | All Processes or a single process | Decision needed: should the options come from the organisation's own processes? (see G1-Q-06) |
| F-2.2: Filter by stage | Dropdown | All Stages or a single stage | Same question as F-2.1 |
| F-2.3: Filter by date | Dropdown | All Time, Today, Last 7 Days, This Month | Decision needed: is "This Month" the calendar month or the last 30 days? (see G1-Q-06) |
| F-2.4: Filter by call type | Dropdown | All, Outbound, Inbound | |
###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Manager wants today's inbound performance | Chooses Today and Inbound | **Every card and chart recalculates for today's inbound calls only** |
###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice manager | When a process underperforms, I want to filter the dashboard to it, so that I can find the cause. |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Changing any filter recalculates F-1, F-3 and F-4. |

##### F-3: Call Distribution and Conversion Charts
###### 1. What it does
A donut chart shows calls split by outcome, with Total Calls in the centre. A bar chart shows how many contacts reach each funnel stage.
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Call Distribution | Donut + legend | Calls by outcome; the centre shows Total Calls | Decision needed: define the outcome categories and their source (see G1-Q-03). The slices must add up to the centre total. |
| F-3.2: Conversion Overview | Bar chart | Contacts reaching each stage | Decision needed: define formula for funnel stage counts (see G1-Q-04) |
| F-3.3: Performance Analysis | Insight cards | Peak call windows and the share of work automated | Decision needed: define formula for the peak completion window and the automated-intake % (see G1-Q-05) |
| F-3.4: Fresh workspace | Empty state | Dashed "0 TOTAL CALLS" ring; "No Funnel Activity Yet"; onboarding tips ("Fresh Workspace Ready", "AI Engine Primed") | |
###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | 26 calls, of which 22 Completed | Looks at the donut | **The centre shows 26 and the Completed slice is 22** |
###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice manager | I want to see where callers drop out, so that I can fix the bottleneck. |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Every chart value is calculated from the organisation's records. When there is no data the chart shows its empty state. |

##### F-4: Active Tasks Panel
###### 1. What it does
Lists up to 5 of the user's active tasks, each with checklist progress, and links to the Tasks module.
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Task row | List row | Title, important star, deadline, "x/y done" ring, stage badge | Clicking opens the task detail page |
| F-4.2: Count badge | Badge | Number of active tasks | Decision needed: which statuses and scopes count as active? (see G1-Q-07) |
| F-4.3: View all tasks | Link | Opens `/tasks` | |
| F-4.4: Empty state | Text | "No active tasks." | |
###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A coordinator has 3 open tasks | Clicks the first row | **The task detail page opens** |
###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Staff member | When I land on the app, I want my open tasks visible, so that nothing slips. |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | The panel shows only tasks that belong to the active organisation and that the user may see. Platform-admin tasks are never shown on the client dashboard. |
| F-4-2 | Tasks with status completed are left out of the list and the count. |

##### Not yet built
| ID | Item | Source |
| :--- | :--- | :--- |
| NB-1 | Daily appointment triage counters: Scheduled (opens calendar), Arrived & Waiting (amber after 20 minutes), In Consultation, Completed (progress against daily goal), Cancelled/No-Show | Previous PRD F-1 |
| NB-2 | Real-time multi-channel activity feed with Chats, Forms, Billing and Calls filter pills, each item opening its record | Previous PRD F-2 |
| NB-3 | Daily call-volume trend chart | Data prepared in the prototype but not rendered |
| NB-4 | Notifications panel | Decision needed (see G1-Q-08) |

#### 3. Comprehensive Summary
##### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Call Performance KPI Cards | F-1.1–F-1.4 | Total, Completed with success rate, Failed and Avg Duration for the organisation's calls |
| F-2 | Dashboard Filters | F-2.1–F-2.4 | Process, stage, date and call-type filters that drive every widget |
| F-3 | Call Distribution & Conversion Charts | F-3.1–F-3.4 | Outcome donut, stage funnel and insight cards, with fresh-workspace states |
| F-4 | Active Tasks Panel | F-4.1–F-4.4 | The top 5 active tasks, deep-linked into Tasks |
##### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice manager | See call volume and outcomes at a glance | F-1 |
| 2 | Practice manager | Narrow the dashboard to a process, period or direction | F-2 |
| 3 | Practice manager | Find where callers drop out | F-3 |
| 4 | Staff member | See my open tasks | F-4 |

### D2. Replacement for `content/client/reports.md`

| Product | CLIENT |
|---|---|
| Module | REPORTS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

#### Cross-product Summary
| Direction | Other module | What is exchanged |
|---|---|---|
| Reads | Invoices / Billing | Live non-void invoices (id, client, amount, status, due date, created date, service, payment mode) for the Revenue data source |
| Reads (intended) | Call Logs, Appointments, Processes, Clients, Team, Messaging | Each module's records for the data source of the same name. Decision needed: confirm the live source for each (see G1-Q-10) |
| Reads | Custom Fields registry | Client custom fields become reportable columns |
| Must agree with | Overview | Call totals and outcome definitions (see G1-Q-03) |

#### 1. Module Summary
- Reports is a library of saved report definitions. Each one runs over a single operational data source and shows calculated metrics, an optional chart and a data table, with drill-down and CSV export.
- Users create custom reports with a two-step builder. Any report can be duplicated into an editable custom copy.
- Report definitions belong to the active organisation.
- Decision needed: which pre-built templates ship, and which roles may see financial data sources? (see G1-Q-10, G1-Q-16)

#### 2. Feature Requests

##### F-1: Report Library
###### 1. What it does
Lists the saved reports with their type, data source and last run. Users can search, filter, view, edit, duplicate and delete.
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Reports table | Table | Name (with "Shared" badge), Type (Template or Custom), Data Source, Last Run | Clicking the name or the row opens the viewer |
| F-1.2: Search | Input | Matches name, description or data source | |
| F-1.3: Presets & filters | Chips / panel | All, Templates, Custom, plus one per data source. Each shows a count, and the result list matches the count. | Filtering is by the report's type and data source, not by a text search |
| F-1.4: Row actions | Menu | View; Edit (custom only); Duplicate (creates a Custom copy "\<name\> (Copy)"); Delete (custom only) | Delete asks for confirmation |
| F-1.5: Bulk delete | Bulk action | Deletes the selected custom reports | Asks for confirmation. Templates are skipped, and the toast reports how many were deleted and how many were skipped. |
| F-1.6: Last Run | Column | Decision needed: should this be the last time the report was viewed or exported, or the last time it was edited? (see G1-Q-11) | |
###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The library has 6 custom reports | Clicks "Custom Reports" | **All 6 custom reports are listed** |
###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice administrator | I want one place for all practice reports, so that I can re-run them whenever I need to. |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Only the active organisation's reports are listed. |
| F-1-2 | Templates cannot be edited or deleted. Duplicating a template creates an editable custom report. |

##### F-2: Report Viewer
###### 1. What it does
Runs a report over its data source and shows calculated metrics, a chart, a data table with totals, a runtime filter panel, drill-down and CSV export.
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Calculated Metrics | Metric cards | One card per column calculation. Count = non-empty values; Sum and Avg = total and mean of numeric values; Min and Max = smallest and largest. Money fields show as $x.xx. | The cards and the table footer use the same rows and the same formatting |
| F-2.2: Chart | Bar / stacked bar / line / pie | Groups rows by the X field (optionally weekday, date or month for date fields) and plots a count, or a sum, avg, min or max of a field, optionally split by a breakdown field | The breakdown series applies the chosen aggregation |
| F-2.3: Drill-down | Interaction | Clicking a category filters the table, the record counts and the export. The drill-down resets when another report is opened. | Applies to every chart type |
| F-2.4: Data table | Table | Selected columns, status badges, 20 rows per page, customisable columns, Totals / Summary footer | |
| F-2.5: Filter panel | Side panel | Reporting period, AND/OR logic for all conditions and for each condition, conditions (equals, contains, between, greater than, less than), Reset | Decision needed: can these changes be saved back to the report? (see G1-Q-13) |
| F-2.6: Empty state | State | "No records match the configured filter criteria" with the active timeframe, the rule count and "Show All N Records" | |
| F-2.7: Export | Button | Downloads the visible columns of the current rows (after drill-down) as CSV, named `<report>[_<category>]_export.csv`. If there are no rows: "No data available to export". | Decision needed: are XLSX and PDF also needed? (see G1-Q-14) |
###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Opens "Calls: Working Hours vs After Hours" | Clicks the "After Working Hours" bar, then Export | **The table and the CSV contain only the after-hours calls** |
###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice administrator | I want to drill into a chart segment and export it, so that I can act on those records. |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Every reporting-period option filters on the data source's primary date field. Decision needed: are periods calendar-based or rolling? (see G1-Q-11) |
| F-2-2 | Every data source reads the live records of its module. Values are never generated for display. |
| F-2-3 | Revenue figures use the invoice statuses agreed in G1-Q-12. |

##### F-3: Custom Report Builder
###### 1. What it does
A two-step builder: choose a data source, then configure the columns, calculations, period, sort, filters and chart, with a live preview.
###### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Data source | Card picker | Calls, Appointments, Processes, Clients, Revenue, Team | Each source starts with sensible default columns and chart. Decision needed: should Messaging be offered? (see G1-Q-18) |
| F-3.2: Name & description | Inputs | Name is required ("Please enter a report name") | |
| F-3.3: Reporting period | Dropdown | This Month, Last Month, This Week, Today, All, Custom (last 1–365 days) | The custom number of days is applied |
| F-3.4: Columns | Table + picker | Add, remove and reorder; at least one column must remain; calculation per column (numeric fields: sum, avg, count, min, max; other fields: count) | Decision needed: what should "% Total" do? (see G1-Q-17) |
| F-3.5: Sort & filters | Controls | Sort field and direction; conditions with one-click presets and AND/OR | |
| F-3.6: Chart builder | Controls | Show/hide, chart type, X field and date interval, Y count or field aggregation, breakdown series, axis labels | Custom axis labels are kept when a report is edited |
| F-3.7: Live preview | Panel | Chart preview and the first 5 matching rows, calculated the same way the viewer calculates them | |
| F-3.8: Save | Button | Saving a custom report updates it. Saving from a template creates a new custom report. After saving, the viewer opens. | |
###### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Wants average appointment duration by provider | Picks Appointments, sets X = Provider and Y = Avg of Duration, saves | **The viewer opens with one bar per provider showing the average minutes** |
###### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice administrator | I want to answer ad-hoc questions without engineering help. |
###### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | The preview and the saved report show the same numbers for the same settings. |

##### Not yet built
| ID | Item | Source |
| :--- | :--- | :--- |
| NB-1 | AR aging chart: unpaid invoices in buckets of 0–30, 31–60, 61–90 and 90+ days by due date | Previous PRD F-1.1 / AC F-1-1 |
| NB-2 | Collection Rate card: % of billed charges collected within 60 days, compared with the prior month | Previous PRD F-1.2 (see G1-Q-12) |
| NB-3 | XLSX and PDF export | Previous PRD F-1.3 (see G1-Q-14) |
| NB-4 | Automated scheduled report delivery | Previous PRD § 1 |
| NB-5 | Clinician encounter productivity; appointment attendance and no-show rate reports | Previous PRD § 1 |
| NB-6 | Report sharing (the "Shared" badge exists but nothing can share a report) | Prototype (see G1-Q-15) |
| NB-7 | Pre-built read-only template library | Prototype help text (see G1-Q-10) |

#### 3. Comprehensive Summary
##### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Report Library | F-1.1–F-1.6 | List, search, filter, duplicate and delete saved reports |
| F-2 | Report Viewer | F-2.1–F-2.7 | Metrics, chart, drill-down, filter panel, table and CSV export |
| F-3 | Custom Report Builder | F-3.1–F-3.8 | Two-step builder with a live preview |
##### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice administrator | One place for all reports | F-1 |
| 2 | Practice administrator | Drill into a segment and export it | F-2 |
| 3 | Practice administrator | Answer ad-hoc questions myself | F-3 |

---

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
|---|---|---|---|---|
| G1-E-01 | The Avg. Duration card always shows "0m 14s" (or "0m 00s" when fresh). It is not calculated from call durations. | `Overview.tsx:178, 376` | Medium | G1-OV-05 |
| G1-E-02 | When a non-fresh organisation has no call logs, the cards show made-up totals (573 / 179 / 21) instead of 0. | `Overview.tsx:174-176` | Medium | G1-OV-22 |
| G1-E-03 | The Call Distribution slices are hardcoded: 10 categories adding up to 573, most of which (Skipped, Queued, Busy and others) do not exist as call statuses. The centre shows the computed total (≈26 for Demo), so the donut contradicts itself. | `Overview.tsx:80-91, 540, 561` | High | G1-OV-06 |
| G1-E-04 | The Conversion Overview funnel is entirely hardcoded (573 → 142) and is presented as real data. | `Overview.tsx:93-100, 619` | High | G1-OV-07 |
| G1-E-05 | The Performance Analysis insights (86.4% peak completion between 2:00 and 4:30 PM; 74% of intakes automated) are hardcoded text. | `Overview.tsx:664-674` | Medium | G1-OV-08 |
| G1-E-06 | The four dashboard filters change nothing, although the card caption says "Across selected filters". Their option lists are also hardcoded rather than the organisation's processes and stages. | `Overview.tsx:131-134, 221-292, 316` | High | G1-OV-09 |
| G1-E-07 | [SECURITY] "Active Tasks" shows the first 5 tasks from one global store that is not filtered by organisation, status or permission. Completed tasks and platform-admin tasks (assigned to an organisation's role from the admin side) appear on the client dashboard and link to `/admin/tasks/:id`. The "active" count includes completed tasks. | `Overview.tsx:186-188, 403, 432-433`; `tasksStore.ts:170, 818-835` | High | G1-OV-11 |
| G1-E-08 | Notifications are loaded and an unread count is calculated, but nothing is shown, although the subtitle promises "team notifications". | `Overview.tsx:138, 180-194, 205` | Low | G1-OV-16 |
| G1-E-09 | The Overview's Total Calls comes from the organisation's call-log store, while Reports › Calls uses 20 separate static mock calls with a different status set (Handoff instead of Pending). The two pages disagree on the call count and outcomes. | `Overview.tsx:174`; `InvoiceContext.tsx:87-123, 933-955` | High | G1-OV-18 |
| G1-E-10 | The daily performance trend data and its tooltip are defined but never rendered, so the chart described in the in-app guide is missing. | `Overview.tsx:47-78, 103-126`; `GuidePageRoute.tsx:57-58` | Low | G1-OV-21 |
| G1-E-11 | The "Templates" and "Custom Reports" presets and the Report Type filter type the word into the search box, which searches name, description and data source, not type. "Custom Reports (6)" therefore returns no rows, and the data-source presets also catch reports whose name contains the word. | `Reports.tsx:43-48, 136-154, 188-201` | Medium | G1-RL-03 |
| G1-E-12 | All six seeded reports are typed "custom", so they can be deleted and there are no templates, although the help text says "View pre-built templates" and "build from a template". | `InvoiceContext.tsx:208-317`; `Reports.tsx:380` | Low | G1-RL-04 |
| G1-E-13 | Single and bulk delete remove reports immediately with no confirmation. Bulk delete silently skips templates but still says "Deleted selected reports". | `Reports.tsx:98-101, 324-339` | Medium | G1-RL-06 |
| G1-E-14 | "Last Run" shows the time of the last save. Running (viewing) or exporting a report never updates it. | `InvoiceContext.tsx:708`; `Reports.tsx:55-58` | Low | G1-RL-08 |
| G1-E-15 | [SECURITY] Report definitions are kept in one browser-wide store that is not separated by organisation, so every organisation (and the admin `/admin/reports` and `/admin/campaigns` routes) sees and can edit the same reports, including revenue reports. | `InvoiceContext.tsx:398-426`; `routes.tsx:339-340` | High | G1-RL-09 |
| G1-E-16 | The same column calculation gives different answers in two places. The metric cards use all filtered rows and ignore drill-down; the table footer uses the drill-down rows. Min and max also show "$x.xx" on the cards but "Max: n" in the footer. | `ReportViewerModal.tsx:225-283, 752-776` | Medium | G1-RV-03 |
| G1-E-17 | Three drill-down problems: (a) the drill-down is not cleared when another report is opened, so the new report can open filtered to a stale category; (b) line charts cannot be drilled into; (c) "Showing X of Y records" ignores the drill-down while "Data Records (n rows)" applies it. | `ReportViewerModal.tsx:82-96, 286, 484, 586-596, 658` | Low | G1-RV-06 |
| G1-E-18 | Reporting periods are mislabelled and inconsistent: (a) "This Month" is really the last 30 days and "Last Month" is the last 90 days, while the viewer labels the latter "Last 90 Days / Last Quarter"; (b) the viewer has no "Today" option and ignores a saved "Today" period, so it shows every row while the builder preview showed today only; (c) rows without a date always pass. | `ReportViewerModal.tsx:110-127, 825-828`; `reportEngine.ts:216-246`; `CustomReportBuilderModal.tsx:615-620` | High | G1-RV-08 |
| G1-E-19 | The "Custom (Last X Days)" period saves the number of days, but neither the preview nor the viewer applies it, so every row is returned. | `CustomReportBuilderModal.tsx:426, 622-637`; `reportEngine.ts:216-246`; `ReportViewerModal.tsx:110-127` | Medium | G1-RB-04 |
| G1-E-20 | The Calls, Appointments, Processes, Clients, Team and Messaging sources are static mock rows that never change, but the page presents them as "live operational data". Only Revenue reads live records. | `InvoiceContext.tsx:159-206, 933-970`; `Reports.tsx:108` | High | G1-RV-11 |
| G1-E-21 | Every client custom field is filled with made-up values ("\<Label\> 1/2/3") for reporting, so it looks like real patient data. | `InvoiceContext.tsx:957-967` | Medium | G1-RV-12 |
| G1-E-22 | Revenue rows include draft, sent, viewed, partial and overdue invoices, so the seeded "Total Revenue ($)" counts unbilled and unpaid amounts. This contradicts the separate "collected = paid" definition in the unused revenue helper. | `InvoiceContext.tsx:302-315, 916-930, 721-723` | High | G1-RV-13 |
| G1-E-23 | When a chart has a breakdown series, avg, min and max are calculated as sums, and a non-numeric field adds 1 per row. Without a breakdown, choosing sum on a field with no numeric values silently shows counts. | `reportEngine.ts:442-447, 509-519` | Medium | G1-RV-15 |
| G1-E-24 | The "% Total" checkbox per column is neither saved nor applied anywhere. | `CustomReportBuilderModal.tsx:85, 765-767, 416-446` | Low | G1-RB-09 |
| G1-E-25 | Messaging can be filtered on the list and has data, but the builder does not offer it as a source. | `CustomReportBuilderModal.tsx:528-536`; `Reports.tsx:207, 220`; `InvoiceContext.tsx:182-189` | Low | G1-RB-10 |
| G1-E-26 | Editing a report replaces its custom axis labels (for example "Clinic Shift") with generated field labels when it is saved. | `CustomReportBuilderModal.tsx:369-389, 442-443` | Low | G1-RB-11 |

## Open questions for PM
1. **G1-Q-01**: Is the Overview a call and automation analytics dashboard (as built), a clinical command centre with appointment triage and an activity feed (as in the PRD), or both? (G1-OV-17, G1-OV-14, G1-OV-15, D1 § 1)
2. **G1-Q-02**: Define Avg. Duration. Is it the mean length of Completed calls only, and over which date scope? (G1-E-01, D1 F-1.4)
3. **G1-Q-03**: What is the canonical list of call outcomes and its single source of data, shared by the Overview donut, Reports › Calls and Call Logs? (G1-E-03, G1-E-09, D1 F-3.1)
4. **G1-Q-04**: Define the conversion funnel. Are the stages taken from the selected process, and is each count "contacts that ever reached the stage" or "contacts currently in the stage"? (G1-E-04, D1 F-3.2)
5. **G1-Q-05**: Should the Performance Analysis insights be calculated (and how), or removed? (G1-E-05, D1 F-3.3)
6. **G1-Q-06**: Where do the dashboard filter options come from (the organisation's processes and stages?), and is "This Month" the calendar month? (G1-E-06, D1 F-2)
7. **G1-Q-07**: Which tasks belong in "Active Tasks": assigned to me or to the whole team, which statuses, and should admin-scope tasks ever appear? (G1-E-07, D1 F-4.2)
8. **G1-Q-08**: Should the dashboard show a notifications panel? (G1-E-08, D1 NB-4)
9. **G1-Q-09**: Success rate denominator: all calls, or only finished calls (leaving out Pending and In Progress)? Which statuses count as "Missed"? (G1-OV-03, G1-OV-04, D1 F-1.2/F-1.3)
10. **G1-Q-10**: Which pre-built read-only templates should ship (for example AR aging, collection rate, no-show rate), and which live module feeds each data source? (G1-E-12, G1-E-20, D2 NB-7)
11. **G1-Q-11**: Are reporting periods calendar-based (this month, last month) or rolling (30 or 90 days)? What should "Last Run" mean? (G1-E-18, G1-E-14, D2 F-1.6, F-2-1)
12. **G1-Q-12**: Which invoice statuses count as revenue, billed and collected? Confirm the PRD's collection rate definition (collected within 60 days of what date: invoice date or due date?). (G1-E-22, G1-RL-12, D2 NB-2)
13. **G1-Q-13**: Should filter changes made in the viewer be savable back to the report, or saved as a new report? (G1-RV-14, D2 F-2.5)
14. **G1-Q-14**: Is CSV export enough, or are the XLSX and PDF from the PRD required? (G1-RV-09, D2 F-2.7, NB-3)
15. **G1-Q-15**: What is the sharing model (share with users, roles or teams; view or edit) behind the "Shared" badge? (G1-RL-05, D2 NB-6)
16. **G1-Q-16**: Which roles may open Reports, especially the Revenue and Team sources, and the Overview? Should `/admin/reports` and `/admin/campaigns` exist? (G1-RL-10, G1-OV-20, G1-E-15)
17. **G1-Q-17**: What should "% Total" do: add a share-of-total column, or show a percentage in the footer? (G1-E-24, D2 F-3.4)
18. **G1-Q-18**: Should Messaging be a builder data source? (G1-E-25, D2 F-3.1)
