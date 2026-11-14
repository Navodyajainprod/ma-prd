---
title: "Reports: Library, Viewer and Builder"
product: "client"
module: "reports"
route: "/reports"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | REPORTS |
| Route | `/reports` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A library of saved report definitions, a viewer modal with metric cards, a chart, a drill-down and a table, and a two-step builder for custom reports. |
| **Who uses it** | Practice Manager (builds and reads reports). No role is checked: any signed-in user can open every report, including revenue, and delete custom ones. |
| **Where you start it** | **Reports** in the sidebar (`/reports`). The same page is also mounted at `/admin/reports` and `/admin/campaigns`. |
| **Where the result goes** | Saved report definitions, and a downloaded CSV file. Nothing is scheduled or sent. |
| **How real is it** | 0 features work, 3 are partly simulated, 0 are not built. See the legend below. Only the Revenue source reads live data. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Invoices) | Revenue source | Revenue reports read live invoices, excluding void ones. Draft, sent, viewed, partial and overdue invoices are all counted, so "Total Revenue" includes unbilled and unpaid amounts (G1-E-22). | [View Invoices](/client/invoices) |
| Client (Overview) | Call numbers | The Calls source is 20 static mock rows, not the Call Logs store the Overview reads. The two pages disagree (G1-E-09). | [View Overview](/client/overview) |
| Client (Call Logs) | Calls source | Not connected. Reports does not read the Call Logs store. | [View Call Logs](/client/call-logs) |
| Client (Clients) | Clients source | Ten static rows. Every custom client field gets a made-up value such as "<Label> 1" (G1-E-21). | [View Clients](/client/clients) |
| Client (Appointments) | Appointments source | Static mock rows, not the appointment store. | [View Appointments](/client/appointments/list) |
| Client (Process) | Processes source | Static mock rows, not the Process board. | [View Process Board](/client/processes/kanban) |

## 1. Module Summary

### The story in one minute

Asha Verma opens **Reports** and sees six saved reports, all marked Custom. She clicks **Revenue by service** and a viewer opens with metric cards, a bar chart and a table. The revenue total includes draft and unpaid invoices. She clicks one bar and the table narrows to that category. She chooses **Export CSV Dataset** and a file downloads. Then she presses **Create Report**, picks **Appointments**, names the report and adds columns. A live preview shows a chart and five rows. She saves and the viewer opens. The same report is also visible to every other organisation, because saved reports are not kept per organisation.

**Naming note:** the earlier PRD called this "Reports, Practice Analytics & Financial KPIs" and described accounts-receivable aging and a collection rate. The prototype has a report library, a viewer and a builder instead. Decision needed: D-03.

### What is real and what is not

- **Real in the prototype:** the report table with search, the viewer with chart, drill-down and table, the filter panel, CSV export, the builder with live preview, and saving, duplicating and deleting custom reports.
- **Simulated:** every data source except Revenue is a fixed set of mock rows. The Template, Custom and type filters do not work. "This Month" means the last 30 days. Revenue counts drafts and unpaid invoices. Saved reports are shared by every organisation.
- **Not built:** AR aging buckets, the Collection Rate card, XLSX and PDF export, scheduled reports, clinician productivity and no-show rates, pre-built templates, sharing and the "% Total" option.

### Journey position

```
Builder ─▶ Saved report ─▶ Library ─▶ Viewer ─┬▶ Chart drill-down ─▶ Table
                                               └▶ Export CSV
```

## 2. Feature Requests

### F-1: Report library

#### 1. What it does
Asha opens `/reports` and sees a table with Report Name (and a **Shared** badge when set), Type, Data Source and Last Run. A search box and preset chips sit above it: **All Reports**, **Templates**, **Custom Reports**, **Appointments Data** and **Processes Data**, each with a count. **Create Report** opens the builder and **How Reports Works** opens a help modal. A row menu holds **View**, **Edit**, **Duplicate** and **Delete**.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Report table | Table | Name, Type, Data Source, Last Run. A click opens the viewer | ◐ Simulated | Last Run is the last save time. Viewing never updates it (G1-E-14). Nothing can share a report, so Shared is never set. Decision needed: D-95 |
| F-1.2: Search | Search | Matches name, description or data source | ● Works | |
| F-1.3: Preset chips and filters | Chips | Each chip and the advanced filter (Report Name, Report Type, Data Source of seven) writes a word into the search box | ◐ Simulated | Templates, Custom Reports and the type filter return no rows. A data-source chip also catches names containing the word (G1-E-11) |
| F-1.4: Row actions | Menu | View for all. Edit for custom. Duplicate saves "(Copy)" as a Custom report | ● Works | |
| F-1.5: Delete and Delete Selected | Action | Delete removes a custom report. Bulk delete skips templates and always says "Deleted selected reports" | ◐ Simulated | No confirmation (G1-E-13) |
| F-1.6: Create Report and help | Buttons | Opens the builder. Help modal explains the page | ◐ Simulated | Help mentions pre-built templates that do not exist (G1-E-12) |
| F-1.7: Seeded reports | Data | Six reports: Calls by shift, 1 to 2 minute calls by weekday, Appointments by weekday split by service, Processes by process name, Clients by total appointments, Revenue by service | ◐ Simulated | All six are typed Custom, so there are no templates (G1-E-12). Decision needed: D-92 |
| F-1.8: Storage scope | Rule | Definitions live in one browser-wide store, also reachable at `/admin/reports` and `/admin/campaigns` | ◐ Simulated | Not separated by organisation, so every organisation sees and edits the same reports (G1-E-15). Decision needed: D-19 |
| F-1.9: Empty state | State | "No reports found matching your filters." | ● Works | |
| F-1.10: Loading and error states | State | None exist | ○ Not built | |
| F-1.11: Role control | Rule | Any signed-in user can open revenue and team reports | ○ Not built | Decision needed: D-19 |
| F-1.12: AR aging buckets chart | Chart | 0 to 30, 31 to 60, 61 to 90 and 90+ days, by due date | ○ Not built | Described in the earlier PRD. The builder has no age buckets |
| F-1.13: Collection Rate card | KPI | Percent of billed charges collected within 60 days, compared with the prior month | ○ Not built | Decision needed: D-67 |
| F-1.14: Scheduled PDF or Excel reports, clinician productivity, attendance and no-show rates | Reports | Described in the earlier PRD | ○ Not built | Counts by status can be built. A rate cannot |

#### 3. Worked example
Asha looks for her own reports.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The page shows **Custom Reports (6)** | Presses the chip | **No rows show, because the chip searches the word "custom" in names** |
| 2 | She wants a copy to change | Chooses **Duplicate** on a report | **A "(Copy)" report is saved as Custom and a toast shows** |
| 3 | She deletes the copy | Chooses **Delete** | **It is removed at once with no confirmation** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When I need a number, I want to find a saved report quickly, so that I do not rebuild it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the library, **when** the user types, **then** reports whose name, description or data source contains the text show. |
| F-1-2 | **Given** the Templates or Custom Reports chip, **when** pressed, **then** the word is written to search and no report is returned. |
| F-1-3 | **Given** a custom report, **when** Delete is chosen, **then** it is removed at once. |
| F-1-4 | **Given** no report matches, **when** the table renders, **then** "No reports found matching your filters." shows. |

### F-2: Report viewer

#### 1. What it does
Asha clicks a report and a modal opens. It shows a card for each column calculation, a chart, a table with a totals footer and a filter panel. She clicks a bar to drill into one category and exports what she sees.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Calculated Metrics cards | Cards | One per column calculation: count, sum, avg, min or max. Money fields show as `$x.xx` | ◐ Simulated | Cards use all filtered rows and ignore drill-down. The footer uses drill-down rows (G1-E-16) |
| F-2.2: Chart | Chart | Bar, stacked bar, line or pie, grouped by an X field, optional series, count or aggregate | ◐ Simulated | With a series, avg, min and max are calculated as sums (G1-E-23) |
| F-2.3: Drill-down | Interaction | A click on a bar or slice filters the table and export. A chip clears it | ◐ Simulated | Not cleared when another report opens. Line charts cannot be drilled (G1-E-17) |
| F-2.4: Table | Table | Selected columns, 20 rows per page, column customisation, Totals / Summary footer | ◐ Simulated | See F-2.1 (G1-E-16) |
| F-2.5: Filter panel | Panel | Period, AND/OR toggle, per-condition AND/OR, and field, operator and value rows. Reset returns to the saved definition | ◐ Simulated | Apply Filters only closes the panel. The viewer has no "Today" option (G1-E-18). Decision needed: D-93 |
| F-2.6: Export CSV Dataset | Button | Downloads visible columns of the rows after drill-down as `<report>_export.csv`. With no rows, an error toast says "No data available to export" | ● Works | |
| F-2.7: No-match state | State | "No records match the configured filter criteria" with the timeframe, rule count and **Show All N Records** | ● Works | |
| F-2.8: Revenue source | Data | Live invoices, void excluded | ◐ Simulated | Counts draft and unpaid invoices, so "Total Revenue" overstates money received (G1-E-22). Decision needed: D-67 |
| F-2.9: Other sources | Data | Calls (20 rows), Appointments, Processes, Team, Messaging (static rows), Clients (10 rows) | ◐ Simulated | Never change and are not the live modules. The page says "live operational data" (G1-E-20, G1-E-09, G1-E-21). Decision needed: D-92 |
| F-2.10: Reporting periods | Rule | This Month, Last Month, This Week, All | ◐ Simulated | "This Month" is the last 30 days and "Last Month" the last 90 (G1-E-18). Decision needed: D-90 |
| F-2.11: Save viewer filters | Action | Filter changes last for the session | ○ Not built | Decision needed: D-93 |
| F-2.12: XLSX and PDF export | Export | Described in the earlier PRD | ○ Not built | CSV only. Decision needed: D-94 |

#### 3. Worked example
Asha reviews revenue.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | **Revenue by service** is open | Reads the total | **The total counts draft and unpaid invoices as revenue** |
| 2 | She clicks one bar | Clicks it | **The table shows that category only and the cards keep the whole total** |
| 3 | She exports | Presses **Export CSV Dataset** | **A CSV of the visible columns for that category downloads** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When I review a report, I want to narrow it by category and period, so that I can find where a number comes from. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a drill-down, **when** the table renders, **then** the table and export show only that category, while the metric cards still use all filtered rows. |
| F-2-2 | **Given** a Revenue report, **when** it opens, **then** it includes draft, sent, viewed, partial, paid and overdue invoices and excludes void ones. |
| F-2-3 | **Given** no rows, **when** Export CSV Dataset is pressed, **then** an error toast shows and no file downloads. |
| F-2-4 | **Given** the filter panel, **when** Apply Filters is pressed, **then** the panel closes. Filters already applied live and are not saved. |

### F-3: Report builder

#### 1. What it does
Asha presses **Create Report**. In step one she picks a data source. In step two she names the report, sets a period, chooses columns and calculations, sorts, adds filter conditions and sets up a chart. A live preview shows the chart and five rows. **Save** opens the viewer.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Data source | Step | Calls, Appointments, Processes, Clients, Revenue or Team. Each pre-selects its first 6 fields and a default chart | ● Works | |
| F-3.2: Messaging source | Source | Has data and a list filter but is not offered | ○ Not built | (G1-E-25). Decision needed: D-92 |
| F-3.3: Name and description | Fields | Name required ("Please enter a report name"). Description optional | ● Works | |
| F-3.4: Reporting period | Select | This Month, Last Month, This Week, Today, All, Custom (Last X Days, 1 to 365) | ◐ Simulated | Custom saves the days but returns every row. This Month is 30 days (G1-E-18, G1-E-19) |
| F-3.5: Columns | Picker | Add with a searchable picker, reorder, remove. At least one must stay ("Report must have at least one column") | ● Works | |
| F-3.6: Column calculations | Select | Numeric fields: sum, avg, count, min, max. Others: count | ● Works | |
| F-3.7: % Total | Checkbox | Shown per column | ○ Not built | Neither saved nor applied (G1-E-24). Decision needed: D-93 |
| F-3.8: Sort and filter conditions | Rules | Sort field and direction. Conditions with presets, AND/OR, equals, between, contains, greater than, less than | ● Works | |
| F-3.9: Chart setup | Controls | Show or hide, chart type, X field (dates by weekday, date or month), count or aggregate, optional series | ◐ Simulated | Same aggregation fault as the viewer (G1-E-23) |
| F-3.10: Live preview | Preview | Chart and the first 5 matching rows | ● Works | |
| F-3.11: Save | Action | Editing overwrites. A template starts a new Custom report. The viewer then opens | ◐ Simulated | Custom axis labels are replaced by generated ones on save (G1-E-26) |
| F-3.12: Cancel | Action | Closes with no confirmation | ● Works | The draft is lost |

#### 3. Worked example
Asha builds an appointments report.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The builder is on step one | Picks **Appointments** | **Six fields and a default chart are pre-selected** |
| 2 | She leaves the name empty | Saves | **"Please enter a report name" shows** |
| 3 | She picks **Custom (Last X Days)** with 7 | Saves | **The report shows every row, not the last 7 days** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When a standard report does not answer my question, I want to build my own from a data source, so that I get the numbers I need. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** step two, **when** the name is empty, **then** "Please enter a report name" shows. |
| F-3-2 | **Given** one column left, **when** it is removed, **then** "Report must have at least one column" shows. |
| F-3-3 | **Given** a report is saved, **when** the builder closes, **then** its Type is Custom and the viewer opens. |
| F-3-4 | **Given** Custom (Last X Days), **when** the report runs, **then** the day count is saved but every row is returned. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Report library | F-1.1 – F-1.14 | ◐ / ● / ○ | Search and actions work; type filters do not; old AR aging is absent. |
| F-2 | Report viewer | F-2.1 – F-2.12 | ◐ / ● / ○ | Chart, drill-down and CSV work; sources are mock except Revenue. |
| F-3 | Report builder | F-3.1 – F-3.12 | ● / ◐ / ○ | Builder and preview work; periods and % Total do not. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Find a saved report quickly | F-1 |
| 2 | Practice Manager | Narrow a report by category and period | F-2 |
| 3 | Practice Manager | Build my own report from a data source | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open every report (including Revenue and Team), build, edit, duplicate and delete custom reports, export CSV | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named the Practice Administrator and said nothing about access. Decision needed: D-19.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Preset counts | Library chips | Number of reports of each type or data source |
| Count | Viewer cards, footer | Number of non-empty values |
| Sum and avg | Viewer cards, footer | Sum and mean of numeric values after stripping non-numeric characters |
| Min and max | Viewer cards, footer | Smallest and largest numeric value |
| Chart value | Viewer, preview | Count of records, or sum, avg, min or max of a field. With a series, avg, min and max are sums |
| Revenue by service | Seeded report | Sum of invoice totals for every non-void invoice, drafts included (G1-E-22) |
| This Month, Last Month | Periods | Last 30 days and last 90 days, not calendar months (G1-E-18) |
| Last Run | Library | Time of the last save (G1-E-14) |
| Mock source data | Calls, Appointments, Processes, Team, Messaging, Clients | **Hardcoded, formula undefined** |

## 6. Cross-module journeys this module appears in

Reports is not a step in any of the four journeys. Its Revenue source reads invoices, but no journey passes through it.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-03 | Is this module a report library and builder (as built) or the AR aging and collection reporting of the earlier PRD? | Naming note, F-1.12, F-1.14 |
| D-19 | Which roles may open Reports, especially Revenue and Team, and should `/admin/reports` and `/admin/campaigns` exist? | F-1.8, F-1.11 |
| D-67 | Which invoice statuses count as revenue, billed and collected, and how is collection rate measured? | F-1.13, F-2.8 |
| D-90 | Are reporting periods calendar-based or rolling, and what does Last Run mean? | F-2.10 |
| D-92 | Which pre-built templates ship, which live module feeds each source, and should Messaging be a source? | F-1.7, F-2.9, F-3.2 |
| D-93 | Can viewer filter changes be saved, and what should % Total do? | F-2.5, F-2.11, F-3.7 |
| D-94 | Is CSV enough, or are XLSX and PDF required? | F-2.12 |
| D-95 | What is the sharing model behind the Shared badge? | F-1.1 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |