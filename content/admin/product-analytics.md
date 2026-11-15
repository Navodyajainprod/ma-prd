---
title: "Product Analytics: Overview, Calls, Usage, Process Movement and Revenue"
product: "admin"
module: "product-analytics"
route: "/admin/product-analytics/overview"
status: "In Review"
build_status: "Simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | ADMIN |
| Module | PRODUCT-ANALYTICS |
| Route | `/admin/product-analytics/overview` |
| Status | In Review |
| Build status | Simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | Five read-only dashboards for Mantra platform staff: **Overview**, **Voice Calls**, **Organization Usage**, **Process Movement** and **Revenue & Invoices**. Almost every number is a fixed value or is computed from a fixed mock baseline. These screens have no PRD page in the earlier PRD. |
| **Who uses it** | Platform Admin. No role is checked: any signed-in user who opens a URL sees every page. |
| **Where you start it** | **Calls** under PRODUCT ANALYTICS in the admin sidebar (`/admin/product-analytics/calls`). The other four pages have no sidebar entry. Overview is opened by URL. Organization Usage is reached from a link on Overview. Process Movement and Revenue & Invoices are opened by URL. |
| **Where the result goes** | Nowhere. The pages only display and export CSV files. They read no tenant data. |
| **How real is it** | 0 features work, 5 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Call Logs) | Voice call data | Not connected. Voice Calls analytics uses its own mock baseline. The tenant call log reads a different store. Organization names and codes differ. | [View Call Logs](/client/call-logs) |
| Client (Invoices) | Revenue and invoices | Not connected. Revenue & Invoices shows hardcoded cards and a table of six seed platform invoices. It reads no tenant invoice. | [View Invoices](/client/invoices) |
| Client (Processes) | Process movement | Not connected. The funnel, KPIs and bottlenecks are fixed values and read no tenant process or stage. | [View Process Board](/client/processes/kanban) |
| Admin (Workspace Billing) | MRR and subscriptions | Net MRR and tier figures are hardcoded and do not match Workspace Billing, Orders or Subscriptions. | [View Workspace Billing](/admin/workspace-billing) |
| Admin (Organizations) | Organization names and usage | The names, ids and counts on these pages are their own seed rows. They do not read the organization list. | [View Organizations](/admin/organizations) |
| Admin (Roles) | Analytics permissions | Seeded admin roles grant analytics permission keys that match no module (G13-E-101). | [View Roles](/admin/roles) |

## 1. Module Summary

### The story in one minute

Leo Martin opens **Calls** from the admin sidebar to see how voice calls are going. Four cards show Completed, Incomplete, Failed and Avg Call Duration. He clicks the bar of one clinic and every figure recalculates for it. He then types the Overview address and sees six headline figures: Organizations, Active Agents, Calls Processed, Automations, Net MRR and Resolution. He changes the date range and nothing moves. He notices Overview says 34,890 calls while the Calls page says 35,290. He opens Revenue & Invoices and sees cards that do not add up to the invoice table below. He exports a CSV from each page for the board pack and writes down which figures to trust. He finds none he can.

### What is real and what is not

- **Real in the prototype:** the drill-down links on Overview, filtering by organization and search on Voice Calls, search and status filter on Organization Usage, the detail drawer and the CSV exports.
- **Simulated:** every headline figure. Overview, Organization Usage, Process Movement and Revenue & Invoices show fixed values. Voice Calls computes from a fixed mock baseline, with a synthetic time series and fixed trend badges. Date ranges rescale the baseline by fixed factors.
- **Not built:** working date, organization and search filters on Overview, Process Movement and Revenue & Invoices, a custom date range on Voice Calls, loading and error states, and any link to real tenant data.

### Journey position

```
Tenant calls, processes, invoices  ─ ─ (not connected) ─ ─▶  Platform analytics (fixed or mock values)
```

## 2. Feature Requests

### F-1: Overview

#### 1. What it does
Leo opens `/admin/product-analytics/overview`. A date range picker and a search box sit at the top. Six cards show **Organizations**, **Active Agents**, **Calls Processed**, **Automations**, **Net MRR** and **Resolution** with percentage deltas. Below are a **Platform Interaction Volume** chart, a **Telephony & AI Subsystems** panel and a **Top Active Healthcare Workspaces** table. Links lead to Calls and Organization Usage.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Six headline cards | KPI | Organizations 18, Active Agents 42, Calls Processed 34,890, Automations 128,450, Net MRR $12,840, Resolution 91.4 percent, with deltas | ◐ Simulated | Hardcoded, formula undefined (G13-AN-01). Decision needed: D-96 |
| F-1.2: Platform Interaction Volume | Chart | Bars, a peak throughput of 4,680 per hour and a 99.98 percent success rate | ◐ Simulated | Hardcoded, formula undefined (G13-AN-02) |
| F-1.3: Telephony & AI Subsystems | Panel | Latency values and "Operational" badges | ◐ Simulated | Hardcoded, formula undefined (G13-AN-03) |
| F-1.4: Top Active Healthcare Workspaces | Table | The first four seed rows | ◐ Simulated | Not sorted despite the "ranked" idea. The status pill is always green (G13-E-77) |
| F-1.5: Date range and search | Controls | Rendered at the top | ○ Not built | They change nothing (G13-E-76) |
| F-1.6: Export CSV | Button | Exports the headline figures | ◐ Simulated | CSV labels differ from the cards (G13-E-78) |
| F-1.7: Drill-down links | Link | Opens Voice Calls and Organization Usage | ● Works | |
| F-1.8: Figures agree across pages | Rule | Calls shows 34,890 here and 35,290 on Voice Calls | ○ Not built | (G13-E-78). Decision needed: D-96 |
| F-1.9: Empty, loading, error and permission states | State | None exist | ○ Not built | |

#### 3. Worked example
Leo prepares the monthly platform summary.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He opens Overview | Reads the six cards | **Fixed figures appear, for example Calls Processed 34,890** |
| 2 | He wants last quarter | Changes the date range | **Nothing changes** |
| 3 | He wants detail | Presses the Calls link | **Voice Calls opens and shows 35,290 calls** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Platform Admin | When reviewing the platform, I want one summary of organizations, calls and revenue, so that I can see how the business is doing. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the page opens, **then** the six cards show fixed values. They are not computed from any data. |
| F-1-2 | **Given** the date range or search box is changed, **then** no figure changes. |
| F-1-3 | **Given** Export CSV is pressed, **then** a file is produced with labels that differ from the cards. |

### F-2: Voice Calls

#### 1. What it does
Leo opens **Calls**. Filters hold a search box, an Organization dropdown and a date range of 7 days, 30 days, Quarter or Custom, with a Reset. Four cards show **Completed**, **Incomplete**, **Failed** and **Avg Call Duration**. A **Calls by Organization** bar chart, a **Call Distribution** donut, an **Inbound vs Outbound Over Time** area chart and an **Organization Telemetry Breakdown** table follow. Clicking a bar or a row filters the whole page to that organization.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Completed, Incomplete, Failed | KPI | Sums across the filtered organizations, with each as a percentage of total | ◐ Simulated | Computed from a fixed mock baseline (G13-AN-09). Decision needed: D-84 |
| F-2.2: Avg Call Duration | KPI | A call-weighted average across all calls | ◐ Simulated | The tooltip and footer say successful calls only (G13-E-79). Decision needed: D-84 |
| F-2.3: Trend badges | Display | +4.8, -1.6, -0.9 and +8.2 percent | ◐ Simulated | Hardcoded, formula undefined (G13-AN-11) |
| F-2.4: Calls by Organization | Chart | Inbound and Outbound per organization, sort, top 10 toggle, click to filter | ◐ Simulated | Counts come from the mock baseline (G13-AN-18) |
| F-2.5: Call Distribution | Chart | Donut of outcome shares | ◐ Simulated | The Incomplete segment is smaller than the Incomplete card for the same filter (G13-E-80) |
| F-2.6: Inbound vs Outbound Over Time | Chart | Calls per day or week | ◐ Simulated | A synthetic spread with weekday weights (G13-AN-13) |
| F-2.7: Organization Telemetry Breakdown | Table | Totals, outcomes, average duration and completion rate per organization | ◐ Simulated | Completion rate is the stored baseline or completed divided by total |
| F-2.8: Organization filter, search, Reset | Controls | Filter by dropdown, bar or row, with a toast "Filtered telemetry to ..." | ● Works | |
| F-2.9: Date presets | Control | 7 days, 30 days and Quarter rescale the baseline | ◐ Simulated | Fixed scaling factors, not real dates |
| F-2.10: Custom date range | Control | Accepts dates | ○ Not built | The dates are ignored and the figures are always half of the 30-day figures (G13-E-81). Decision needed: D-84 |
| F-2.11: Export CSV | Button | Exports the filtered view | ◐ Simulated | Two export buttons do the same thing (G13-E-82) |
| F-2.12: Empty state | State | Bar chart and table show empty messages | ● Works | |
| F-2.13: Loading, error and permission states | State | A loading view and an error banner with Retry are coded but never shown | ○ Not built | (G13-E-82) |

#### 3. Worked example
Leo checks one clinic after a complaint.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A clinic reports dropped calls | Clicks its bar in **Calls by Organization** | **A toast names the clinic and every card, chart and table recalculates for it** |
| 2 | He picks a custom range | Enters two dates | **The dates are ignored and the figures do not match the range** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Platform Admin | When call quality drops, I want call outcomes by organization, so that I can find the failing clinic. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** an organization is chosen, **then** all cards, charts and the table show that organization's mock figures. |
| F-2-2 | **Given** a custom date range, **then** the dates are ignored. |
| F-2-3 | **Given** Avg Call Duration, **then** it averages all calls although the label says successful calls only. |
| F-2-4 | **Given** the data cannot load, **then** nothing is shown because the error banner is never triggered. |

### F-3: Organization Usage

#### 1. What it does
Leo opens `/admin/product-analytics/organization-usage` from the link on Overview. A search box and a status filter sit above a table with Org ID, Organization, Industry, Plan Tier, Users, Numbers, Calls (30d), Storage, Tasks/Mo, AI Accuracy and Status. Clicking a row opens a detail drawer with tiles and a storage bar.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Usage table | Table | One row per seed organization | ◐ Simulated | Every value is fixed. Hardcoded, formula undefined (G13-AN-19). Decision needed: D-96 |
| F-3.2: Storage quota | Display | Shows "N MB / 10,000 MB" | ◐ Simulated | The 10,000 MB quota is hardcoded (G13-AN-20) |
| F-3.3: Search and status filter | Controls | Search by organization, id, industry or plan. Status filter has Active, Trial and Past due | ◐ Simulated | There is no Suspended option (G13-E-83) |
| F-3.4: Detail drawer | Drawer | Tiles and a storage bar for the chosen organization | ◐ Simulated | The status pill is always green (G13-E-83) |
| F-3.5: Export | Button | Exports the filtered rows | ● Works | |
| F-3.6: Empty state | State | A generic empty message | ● Works | |
| F-3.7: Loading, error and permission states | State | None exist | ○ Not built | |

#### 3. Worked example
Leo looks at trial clinics.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants trial accounts | Sets the status filter to **Trial** and exports | **A CSV of the fixed trial rows downloads** |
| 2 | A clinic is suspended | Looks for a Suspended filter | **No Suspended option exists** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Platform Admin | When planning capacity, I want each organization's users, numbers, calls and storage together, so that I can spot heavy use. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the page opens, **then** each row shows fixed values. |
| F-3-2 | **Given** a row is clicked, **then** a drawer opens with its tiles and a storage bar out of 10,000 MB. |
| F-3-3 | **Given** a suspended organization, **then** no filter option exists for it and the drawer pill is green. |

### F-4: Process Movement

#### 1. What it does
Leo opens `/admin/product-analytics/process-movement`. An Organization filter and a date range sit at the top. KPI cards show Active Workflows, In-Flight Tasks, Overall Completion and Identified Bottlenecks. A five-stage funnel shows entered, completed and conversion with bottleneck badges. Three bottleneck cards carry the same recommendation text.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: KPI cards | KPI | Active Workflows 14, In-Flight Tasks 1,420, Overall Completion 83.6 percent | ◐ Simulated | Hardcoded, formula undefined. Overall Completion contradicts the funnel, about 60.8 percent (G13-AN-23, G13-E-84). Decision needed: D-97 |
| F-4.2: Identified Bottlenecks | KPI | Count of entries in a fixed bottleneck list | ◐ Simulated | There is no bottleneck rule (G13-AN-24). Decision needed: D-97 |
| F-4.3: Five-stage funnel | Chart | Entered, completed, conversion, dwell, wait and stuck per stage. Bar width is entered divided by a fixed 2,500 | ◐ Simulated | Hardcoded, formula undefined (G13-AN-23). One bottleneck stage is not in the funnel (G13-E-84) |
| F-4.4: Bottleneck cards | Cards | Three cards with the same fixed recommendation | ◐ Simulated | |
| F-4.5: Organization and date filters | Controls | Rendered at the top | ○ Not built | They change nothing. Every organization shows the code ORG-0001 (G13-E-76, G13-E-84) |
| F-4.6: Export | Button | Exports the funnel | ● Works | |
| F-4.7: Empty, loading, error and permission states | State | None exist | ○ Not built | |

#### 3. Worked example
Leo looks for stuck work.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants one clinic's flow | Picks a clinic in the Organization filter | **Nothing changes** |
| 2 | He compares totals | Reads Overall Completion and the funnel | **83.6 percent against a funnel near 60.8 percent** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Platform Admin | When work seems slow, I want to see where processes get stuck, so that I can help the clinic. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** the page opens, **then** all KPIs and funnel stages show fixed values. |
| F-4-2 | **Given** the Organization or date filter is changed, **then** nothing changes. |
| F-4-3 | **Given** the bottleneck cards, **then** each carries the same recommendation text. |

### F-5: Revenue & Invoices

#### 1. What it does
Leo opens `/admin/product-analytics/revenue-invoices`. A date range sits at the top. Cards show **Net Monthly MRR**, **Settled Invoiced (30d)**, **Open Invoices** and **Overdue Balance**. **Revenue by Subscription Tier** and **Monthly MRR Growth** bars follow, then a **Recent Invoices** table without paging or actions.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Revenue cards | KPI | MRR $12,840, projected ARR, settled $13,401, collection rate 94.3 percent, open $660, overdue $149, "1 organization past due" | ◐ Simulated | Hardcoded, formula undefined (G13-AN-28). Decision needed: D-98 |
| F-5.2: Revenue by Subscription Tier | Chart | MRR and percentage per tier | ◐ Simulated | Tier MRRs sum to $5,852 against $12,840 and the percentages do not follow the amounts (G13-E-85) |
| F-5.3: Monthly MRR Growth | Chart | Bars and a "+41.1% 6-Mo Gain" | ◐ Simulated | Hardcoded, formula undefined. Bar height is month value divided by a fixed 14,000 (G13-AN-28) |
| F-5.4: Recent Invoices | Table | Six seed invoices | ◐ Simulated | The table does not match the cards (G13-E-85) |
| F-5.5: Date range | Control | Rendered at the top | ○ Not built | It changes nothing (G13-E-76) |
| F-5.6: Export | Button | Exports the invoice table | ● Works | |
| F-5.7: Empty, loading, error and permission states | State | None exist | ○ Not built | |

#### 3. Worked example
Leo prepares a finance review.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants the month's revenue | Reads the cards | **Fixed figures appear, for example MRR $12,840** |
| 2 | He checks the tiers | Adds the tier bars | **They total $5,852, not $12,840** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Platform Admin | When reviewing finances, I want recurring revenue and invoice health in one place, so that I can report to leadership. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** the page opens, **then** the cards show fixed values. |
| F-5-2 | **Given** the tier bars, **then** their MRR does not add up to the MRR card. |
| F-5-3 | **Given** the date range is changed, **then** nothing changes. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Overview | F-1.1 – F-1.9 | ◐ / ○ | Fixed figures; filters do nothing. |
| F-2 | Voice Calls | F-2.1 – F-2.13 | ◐ / ● / ○ | Computed from a mock baseline; custom dates ignored. |
| F-3 | Organization Usage | F-3.1 – F-3.7 | ◐ / ● / ○ | Fixed rows; search and export work. |
| F-4 | Process Movement | F-4.1 – F-4.7 | ◐ / ○ | Fixed funnel; filters do nothing. |
| F-5 | Revenue & Invoices | F-5.1 – F-5.7 | ◐ / ○ | Fixed cards that do not match the table. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Platform Admin | See one summary of the platform | F-1 |
| 2 | Platform Admin | Find the clinic with failing calls | F-2 |
| 3 | Platform Admin | Spot heavy use per organization | F-3 |
| 4 | Platform Admin | Find where processes get stuck | F-4 |
| 5 | Platform Admin | Report recurring revenue and invoice health | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open all five pages by URL, filter, drill down, export | Nothing. The role is read from browser storage and defaults to SystemAdmin |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The admin sidebar shows only Calls. Seeded roles grant analytics permission keys that match no module (G13-E-101). The earlier PRD has no page for these screens. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Organizations, Active Agents, Calls Processed, Automations, Net MRR, Resolution and deltas | Overview | **Hardcoded, formula undefined** |
| Interaction volume bars, peak throughput, success rate, latencies, subsystem badges, top workspaces | Overview | **Hardcoded, formula undefined** |
| Completed, Incomplete, Failed | Voice Calls | Sums across the filtered organizations, from a fixed mock baseline |
| Percent of total | Voice Calls | Count divided by total calls times 100 |
| Avg Call Duration | Voice Calls | Call-weighted average across all calls. The label says successful calls only (G13-E-79) |
| Trend badges | Voice Calls | **Hardcoded, formula undefined** |
| Donut share | Voice Calls | Count divided by total |
| Time series | Voice Calls | **Hardcoded, formula undefined.** A synthetic spread with weekday weights |
| Date scaling | Voice Calls | Fixed factors 0.233, 1, 3.0 and 0.5 for 7 days, 30 days, Quarter and Custom |
| Completion rate per row | Voice Calls | The stored 30-day value, or completed divided by total |
| Per-organization users, numbers, calls, storage, tasks, AI accuracy | Organization Usage | **Hardcoded, formula undefined** |
| Storage quota | Organization Usage | **Hardcoded, formula undefined.** 10,000 MB |
| Active Workflows, In-Flight Tasks, Overall Completion, stage figures | Process Movement | **Hardcoded, formula undefined** |
| Identified Bottlenecks | Process Movement | Count of entries in the fixed bottleneck list. No bottleneck rule exists |
| Funnel bar width | Process Movement | Entered divided by a fixed 2,500 |
| MRR, ARR, settled, collection rate, open, overdue, tier mix, growth | Revenue & Invoices | **Hardcoded, formula undefined** |
| MRR bar height | Revenue & Invoices | Month value divided by a fixed 14,000 |

## 6. Cross-module journeys this module appears in

These pages are not a step in any of the four journeys: Call to Claim, Kiosk check-in to Billing, Web form to Task, and Patient portal with Appointments and Invoices. They read none of the data those journeys create.

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-12 | Must permissions block direct URL access and each action, and who may open `/admin/*`? | Roles section |
| D-84 | How are Avg Duration, Incomplete and the date scope defined? | F-2.1, F-2.2, F-2.10 |
| D-96 | What are the formulas and sources for the Overview and Organization Usage figures, and the storage quota? | F-1.1, F-1.8, F-3.1 |
| D-97 | What is the Process Movement metric set and the bottleneck rule? | F-4.1, F-4.2 |
| D-98 | What are the formulas for the revenue metrics? | F-5.1 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
