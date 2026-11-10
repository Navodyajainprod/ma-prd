---
title: "Reports, Practice Analytics & Financial KPIs"
product: "client"
module: "reports"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | CLIENT |
| Module | REPORTS |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |

## 1. Module Summary
- The Reports & Analytics module provides executive clinical intelligence: accounts receivable aging reports, clinician encounter productivity, patient appointment attendance and no-show rates, and automated scheduled PDF/Excel reports.
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests

### F-1: Revenue Cycle & Accounts Receivable Aging Reports
#### 1. What it does
Renders accounts receivable aging breakdown across standard financial aging buckets (0-30 days, 31-60 days, 61-90 days, 90+ days) and tracks overall collection rate percentages.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: AR Aging Buckets Chart | Bar Chart | Visual bar chart showing outstanding balances across aging time brackets | Identifies overdue balances |
| F-1.2: Collection Rate KPI Card | Metric Card | Calculates percentage of total billed charges successfully collected within 60 days | Compares to prior month |
| F-1.3: Export Report to Excel/PDF | Button | Exports financial summary data to formatted XLSX spreadsheet or PDF report | Instant file generation |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Practice administrator reviews month-end financials | Opens AR Aging Report | **Identifies $12,400 in the 61-90 days bucket and assigns follow-up tasks to billing staff** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Administrator | When reviewing clinic finances, I want aging accounts receivable reports, so that we can collect overdue payments before they become bad debt. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | AR aging reports categorize unpaid invoices into accurate 30-day brackets based on invoice due dates. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Revenue Cycle & Accounts Receivable Aging Reports | F-1.1, F-1.2, F-1.3 | Renders accounts receivable aging breakdown across standard financial aging buckets (0-30 days, 31-60 days, 61-90 days, 90+ days) and tracks overall collection rate percentages. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Administrator | When reviewing clinic finances, I want aging accounts receivable reports, so that we can collect overdue payments before they become bad debt. | F-1 |
