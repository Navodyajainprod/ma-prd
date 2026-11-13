# Gap matrix: module × status

_Built 2026-11-13 from the "Status summary" table and section E of each file in `analysis/modules/`. Counts come from the C-table totals in each module file, not from re-reading the code._

## How to read this

- **Coverage %** = (Matches + 0.5 × Partial) ÷ (Matches + Partial + Missing in PRD + Contradicts). **PRD-only** and **Prototype defect** rows are excluded.
- **Overall** includes screens that have no PRD file, so their built-but-undocumented items count as "Missing in PRD". **PRD-backed** leaves those screens out.
- Coverage measures how completely the PRD describes the prototype. It does **not** measure prototype quality. A module can score 74% and still carry critical defects (see the Reception kiosk).
- Most of the gap is "Missing in PRD" (491 of 936 scored items, 52%). The PRDs are mostly short single-feature stubs, so the prototype is far larger than the documents describing it.

## Status counts by module

| # | Module group | Module file | M | P | Missing in PRD | Contradicts | PRD-only | Overall cov. | PRD-backed cov. |
|---|---|---|--:|--:|--:|--:|--:|--:|--:|
| G1 | Overview + Reports | `01-overview-reports.md` | 0 | 0 | 29 | 2 | 6 | 0.0% | 0.0% |
| G2 | Clients | `02-clients.md` | 5 | 5 | 20 | 6 | 5 | 20.8% | 20.8% |
| G3 | Call Logs + AI Scribe | `03-call-logs-scribe.md` | 6 | 2 | 21 | 6 | 12 | 20.0% | 20.0% |
| G4 | Chats | `04-chats.md` | 35 | 15 | 12 | 6 | 24 | 62.5% | 62.5% |
| G5 | Process + Tasks | `05-process-tasks.md` | 33 | 8 | 20 | 6 | 8 | 55.2% | 60.7% |
| G6 | Appointments | `06-appointments.md` | 4 | 5 | 28 | 6 | 19 | 15.1% | 24.1% |
| G7 | Services + Invoices + Claims | `07-services-invoices-claims.md` | 5 | 21 | 46 | 5 | 7 | 20.1% | 20.1% |
| G8 | Workflows/Automation + Web Forms | `08-workflows-webforms.md` | 3 | 9 | 34 | 2 | 4 | 15.6% | 15.6% |
| G9 | Knowledge Base + AI Receptionist config | `09-kb-receptionist-config.md` | 24 | 5 | 17 | 5 | 6 | 52.0% | 52.0% |
| G10 | Client Settings | `10-settings.md` | 0 | 23 | 26 | 5 | 11 | 21.3% | 24.0% |
| G11 | Reception kiosk | `11-reception-kiosk.md` | 71 | 8 | 17 | 6 | 13 | 73.5% | 73.5% |
| G12 | Companion / Patient portal | `12-companion.md` | 22 | 20 | 27 | 1 | 20 | 45.7% | 50.0% |
| G13 | Super Admin | `13-super-admin.md` | 11 | 26 | 163 | 20 | 33 | 10.9% | 17.6% |
| G14 | Prototype-only (auth, onboarding, pricing…) | `14-prototype-only.md` | 0 | 3 | 31 | 0 | 1 | 4.4% | No PRD |
| | **Total** | | **219** | **150** | **491** | **76** | **169** | **31.4%** | **37.3%** |

Worked totals: overall = (219 + 0.5 × 150) ÷ (219 + 150 + 491 + 76) = 294 ÷ 936 = 31.41%. PRD-backed = 292.5 ÷ 784 = 37.31%, which leaves out G14 and the no-PRD screens inside G1, G5, G6, G10, G12 and G13.

## Prototype defects by module (section E)

"E rows" are distinct defects listed in each file's section E. Severity is as rated by each module agent. The [SECURITY] column counts E rows whose text carries the tag on the same line, so it can undercount.

| Module | E rows | Critical | High | Medium | Low | [SECURITY] E rows | Open questions |
|---|--:|--:|--:|--:|--:|--:|--:|
| G1 Overview + Reports | 26 | 0 | 9 | 9 | 8 | 2 | 18 |
| G2 Clients | 26 | 0 | 13 | 11 | 2 | 6 | 12 |
| G3 Call Logs + Scribe | 34 | 3 | 13 | 15 | 3 | 8 | 20 |
| G4 Chats | 23 | 1 | 9 | 11 | 2 | 4 | 22 |
| G5 Process + Tasks | 31 | 0 | 8 | 12 | 10 | 6 | 23 |
| G6 Appointments | 28 | 0 | 6 | 15 | 7 | 2 | 17 |
| G7 Services + Invoices + Claims | 33 | 2 | 16 | 9 | 6 | 5 | 23 |
| G8 Workflows + Web Forms | 28 | 0 | 8 | 14 | 6 | 2 | not counted |
| G9 KB + Receptionist config | 19 | 0 | 9 | 4 | 6 | 3 | 16 |
| G10 Settings | 38 | 1 | 11 | 20 | 6 | 11 | not counted |
| G11 Reception kiosk | 42 | 4 | 15 | 16 | 7 | 20 | 28 |
| G12 Companion | 37 | 7 | 13 | 14 | 3 | 17 | 20 |
| G13 Super Admin | 103 | 5 | 21 | 37 | 40 | 20 | 33 |
| G14 Prototype-only | 24 | 4 | 8 | 8 | 4 | 9 | not counted |
| **Total** | **492** | **27** | **159** | **195** | **110** | **≥ 115** | |

Severity counts add to 491, not 492. One G5 row has no severity value that the count could read. Question counts for G8, G10 and G14 were not totalled from the files. See `decisions.md` for the consolidated list.

## Reading the matrix

- **Closest to the PRD:** Reception kiosk (74%), Chats (63%), Process + Tasks (55–61%) and Knowledge Base + Receptionist config (52%). The PRDs for these were written against the built screens.
- **Furthest from the PRD:**
  - **Overview + Reports (0%):** the PRDs describe a different product.
  - **Super Admin (11% overall, 18% PRD-backed):** 16 screens have no PRD at all.
  - **Prototype-only screens (4%):** auth, onboarding, pricing and the like have no PRD.
- **Most "Contradicts" rows:** Super Admin (20), then G2, G3, G4, G5, G6 and G11 (6 each). These are where PRD and prototype disagree on intended behaviour, so each needs a PM decision.
- **Most defects:** Super Admin (103), Reception kiosk (41), Settings (38), Companion (37). The Reception kiosk and Companion also hold the most [SECURITY] rows.
- **Screens with no PRD file:** Appointments booking drawer and lifecycle, Process detail drawer, Settings Numbers and Notifications, Companion sign-in and profile, 16 Super Admin screens, and all of G14. Each module file's section D contains a proposed PRD block for these.

## Caveats

- Status labels were assigned by 14 separate agents with the same rubric, so borderline calls (Partial vs Missing) will vary between modules.
- Coverage figures treat a short PRD that names a feature once as "Partial" or "Matches", whatever the depth. Compare the module files' section C for detail.
- Line-number citations were checked by the module agents and spot-checked by the orchestrator, but not exhaustively. The G14, G10, G12 and G8 agents each flagged some line ranges as approximate.
