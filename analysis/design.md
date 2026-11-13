# How the PRD is designed

_Analysed 2026-11-13. Source: `E:\ma-prd` (73 Markdown files in `content/` plus the Next.js reader app in `src/`). Every number below was counted from the files, and every behaviour of the reader was read from its code. Paths are relative to `E:\ma-prd` unless stated._

This document explains **how the PRD is structured**: how files are organised, what one file looks like, how the reader app turns files into pages, and where the structure is inconsistent. `content_summary.md` explains **what the PRD says**.

---

## 1. What the PRD is

- A set of **73 Markdown files**, one per module or per tab of a module, covering **four products**.
- A small **Next.js 14 reader app** that turns the files into a browsable site with a sidebar, a table of contents, a product switcher, search, a download drawer and a change-log page.
- The stub files describe their source as "MantraAssist figma codebase specifications". One hand-written file says it was "authored based on `ma-figma` source of truth". So the PRD documents the Figma-derived prototype's behaviour. It is not a record of a shipped product.

## 2. Repository layout

```
ma-prd/
├─ content/                      ← the PRD itself (73 .md files)
│  ├─ client/        33 files    clinic staff workspace
│  ├─ admin/         15 files    platform super-admin console
│  ├─ companion/      8 files    patient portal
│  └─ ai-receptionist/ 17 files  lobby kiosk (voice avatar "Aria")
├─ src/
│  ├─ lib/modulesConfig.ts       registry: products, modules, tabs, sidebar categories
│  ├─ lib/prdLoader.ts           finds a file for a URL and splits it into sections
│  ├─ components/PrdRenderer.tsx custom Markdown renderer
│  ├─ components/TableOfContents.tsx, Sidebar.tsx, Header.tsx, SearchDropdown.tsx,
│  │               DownloadModuleDrawer.tsx, ProductSwitchCtas.tsx
│  └─ app/
│     ├─ [product]/[module]/page.tsx             module page (redirects to first tab)
│     ├─ [product]/[module]/[channel]/page.tsx   tab page
│     ├─ [product]/logs/page.tsx                 "Date & Edit Logs" page
│     └─ api/modules-content/route.ts            bundle of PRDs for download
└─ scripts/                      generators that wrote the first version of most files
```

## 3. Information architecture

### 3.1 Four products

| Product (URL id) | Badge in the app | Audience | Files |
|---|---|---|--:|
| `client` | Clinical Console | clinic doctors, receptionists, coordinators | 33 |
| `admin` | Platform Control | platform super-admins | 15 |
| `companion` | Patient Portal | patients and their families | 8 |
| `ai-receptionist` | Kiosk & Voice Surface | lobby visitors, plus the front desk that configures it | 17 |

### 3.2 Product → module → tab

The registry (`src/lib/modulesConfig.ts`) has **35 module definitions**. Each module says which products it appears in (`availableIn`), a sidebar category, and optionally a list of **tabs** (called *channels* in code) per product.

- A module can appear in several products and then has **one file per product**. Examples: Chats and Appointments in Client and Companion; Tasks in Client, Admin and Companion; Billing in Companion and AI Receptionist; Settings in Client and AI Receptionist.
- A module with tabs has **one file per tab**. The module's own URL has no page of its own: it redirects to the first tab (`[product]/[module]/page.tsx`).

Modules with tabs:

| Product | Module | Tabs |
|---|---|---|
| Client | Chats | whatsapp, sms, website, companion |
| Client | Process & Deals | kanban, list |
| Client | Tasks | my-tasks, tasks-by-me |
| Client | Appointments | calendar, list, availability |
| Client | Settings | organization, team, billing, voices, custom-fields, integrations, audit-logs, security, reception |
| Admin | Industry & Categories | categories, industries |
| Admin | Custom Fields | fields, sections |
| Admin | Billing Plans | plans, categories, pricing, actions |
| AI Receptionist | Check-In & Booking | identity-biometrics, phone-otp, scheduled, walk-in |
| AI Receptionist | Wayfinding & Directions | departments, rooms |
| AI Receptionist | My Visit | tracker, next-step, biometric-consent |
| AI Receptionist | Aria Ambient & Kiosk Shell | ambient-presence, aria-stage-speech, kiosk-shell |
| AI Receptionist | Billing | invoices, qr-pay |
| AI Receptionist | Settings | stations, queue, architecture |

### 3.3 Sidebar categories (set in the registry, not in the files)

| Product | Categories (in order) |
|---|---|
| Client | WORKSPACE · REVENUE & INSIGHTS · CUSTOMIZATIONS · SETTINGS |
| Admin | WORKSPACE (Tasks only) · ORGANIZATION MANAGEMENT · BLUEPRINTS & AUTOMATION · PLATFORM CONTROL · AI ENGINE & AGENTS · COMMERCE & BILLING · SECURITY & USERS |
| Companion | PATIENT COMPANION (Today, Documents, Forms, Billing, Pharmacy) · WORKSPACE (Appointments, Tasks, Chat). The registry sorts modules into the fixed order Today, Appointments, Tasks, Documents, Forms, Billing, Pharmacy, Chat, but the sidebar then groups them by category, so that order is split into the two groups. |
| AI Receptionist | AI RECEPTIONIST KIOSK (Check-In, Directions, My Visit, Avatar, Billing) · KIOSK SETTINGS |

### 3.4 URL scheme and file lookup

`/{product}/{module}` or `/{product}/{module}/{tab}`. The loader (`getPrdPath` in `prdLoader.ts`) tries these paths in order and takes the first that exists:

| Request | Paths tried |
|---|---|
| Tab | `content/{product}/{module}/{tab}.md` → `content/{product}/{module}-{tab}.md` → `content/{product}/{tab}.md` |
| Module with no tabs | `content/{product}/{module}.md` → `content/{product}/{module}/{module}.md` → `content/{product}/{module}/prd.md` → `content/{product}/{module}/chat.md` → any `.md` in that folder |

The same scheme is used by the **cross-product links** inside the files, for example `[View in Companion](/companion/today)`. All 121 of them point at a file that exists.

### 3.5 Registry versus files

I replayed the lookup for every module and tab in the registry:

- **Every registered module and tab has a file.** There are no dead sidebar entries.
- **One file is unreachable:** `content/client/chat/chat.md` (234 lines, five features about the unified inbox and care groups). Client Chats has four tabs, so its URL redirects to the first tab and the parent document is never rendered. The download bundle uses the tabs too, so the file is left out there as well.

## 4. Anatomy of one PRD file

All 73 files follow the same three numbered sections, and 71 carry the header table. The two exceptions are in section 9.

```
---                                   ← frontmatter (read by the app)
title / product / module / [channel] / status / created_date / last_updated
---
| Product | … |                       ← header table (a copy of the metadata, for people reading raw Markdown)
| Module  | … |  | Status | … |  | Created | … |  | Last updated | … |

## Cross-product Summary              ← optional (35 of 73 files)
## 1. Module Summary                  ← 2–3 bullets
## 2. Feature Requests
### F-1: <feature title>
#### 1. What it does                  ← prose
#### 2. What it includes              ← table: Item | Type | What it does | Notes
#### 3. Worked example                ← table: # | Situation | What the user does | Result
#### 4. Jobs to be done               ← table: # | User | Job to be done
#### 5. Acceptance criteria           ← table: # | Criteria
### F-2: …
## 3. Comprehensive Summary
### 3.1 Feature Request Summary       ← table: ID | Feature | Sub-features | One-line summary
### 3.2 Jobs to be Done               ← table: # | User | Job to be done | Feature(s)
```

### 4.1 What each part is for

| Part | Question it answers | Typical content |
|---|---|---|
| Frontmatter | Which document is this? | Title, product, module, tab, status, two dates |
| Cross-product Summary | What does this change in the other products? | One row per related product and behaviour, with a link |
| 1. Module Summary | What is this module and who uses it? | Purpose in one sentence, then scope or access notes |
| F-n "What it does" | What is the feature? | One paragraph; the longer files add numbered lists |
| F-n "What it includes" | What are its parts? | Sub-features `F-n.m`, each with a UI type (Button, Drawer, Tabs…), behaviour and a note |
| F-n "Worked example" | What does it look like in use? | Situation → action → **bold result** |
| F-n "Jobs to be done" | Why does a user want it? | "When …, I want …, so that …" for a named persona |
| F-n "Acceptance criteria" | How do we know it works? | Testable statements |
| 3.1 / 3.2 | What is in this document at a glance? | Roll-ups of the features and the jobs above (no new information) |

### 4.2 ID scheme

| ID | Meaning | Example |
|---|---|---|
| `F-n` | Feature n in this file (restarts in every file) | `F-2` |
| `F-n.m` | Sub-feature m of feature n, in the "What it includes" table | `F-2.3` |
| `F-n-Jm` | Job to be done m of feature n | `F-1-J2` |
| `F-n-m` | Acceptance criterion m of feature n (242 rows) | `F-1-3` |
| `F-n-ACm` | Same, written with an `AC` prefix (18 rows, 4 files) | `F-2-AC1` |

IDs are only unique within a file, so a reference from outside needs the file as well (for example "scheduled.md F-3.2").

### 4.3 The Cross-product Summary

A four-column table: **Related product · Feature / change · How it shows up in this product · Link**.

- It records *behaviour that crosses a product boundary*, written from the receiving side. Example from `scheduled.md`: Client / "Appointments Calendar & Arrived Status" / "confirming check-in switches the calendar slot immediately to Arrived".
- The link is `[View in <Product>](/product/module[/tab])`.
- The 121 rows are heavily uneven: the AI Receptionist files hold 83 of them, 59 pointing at Client (see `content_summary.md`).

## 5. How the content is written

| Convention | What the files do |
|---|---|
| **Voice** | Plain present tense, describing the system ("The kiosk summarizes…"), not instructions to build it. |
| **Granularity** | The feature is the unit. Each "includes" row is one visible control, rule or behaviour. |
| **Bold** | Bold marks the *result* in worked examples, UI labels and key terms. |
| **Backticks** | Used for routes (`/reception/appointment`), IDs (`D-042`), formulas (`max(5, (waiting + 1) * 10)`) and storage keys. |
| **Jobs to be done** | Always "When …, I want …, so that …", with a persona in the "User" column. |
| **Acceptance criteria** | Three styles: a plain statement (most stub files); *Given … when … then …* (32 files); *… MUST …* (17 files). |
| **Cross-references** | By URL link in the Cross-product Summary. Inside prose, features are referred to by name. |
| **Language** | Product terms are capitalised as proper names (Process, Companion, Care Group, Aria). |
| **Not in the template** | Roles and permissions, error and empty states, metrics and formulas, data model, non-functional requirements and open questions have no section. They appear only if an author writes them inside a feature. A previous "Open Items" section was removed from every file (commit `ae5e6ff`) and the renderer skips such a heading if it reappears. |

## 6. How the reader app uses the structure

`loadPrd(product, module, tab)` in `src/lib/prdLoader.ts` does the following, in order:

1. **Finds the file** (section 3.4) and reads the frontmatter with a small hand-written parser. It accepts only simple `key: value` lines, so a multi-line value will not work.
2. **Deletes legacy "Item | Detail" tables.**
3. **Extracts the Cross-product Summary** by its heading text, up to the next numbered `##`.
4. **Extracts logs** if a `### Logs` block exists: bullets under `#### Date Log` and rows of the table under `#### Edit Log`.
5. **Splits the body at `## <number>. <title>`.** Anything else at `##` level is not a section.
6. **Section 2:** splits at `### F-<number>` headings. For every feature it builds a fixed list of five parts (What it does, What it includes, Worked example, Jobs to be done, Acceptance criteria) *without checking that the file contains them*.
7. **Section 3:** splits at `### <n>.<n>`.
8. Returns title, product, module, tab, status and dates from the frontmatter. If a key is missing it falls back to status "In Review" and the date 2026-11-10.

`PrdRenderer.tsx` is **custom code, not a general Markdown library**. It recognises tables, blockquotes (`>`), `###` and `####` headings, bullet and numbered lists, and inline bold, code and links. It hides `#` and `##` headings (the sections draw their own), horizontal rules, "Open Items" and "To confirm:" lines. `TableOfContents.tsx` is built from the same parsed structure, so the contents list always shows five parts per feature.

**What the app ignores or does not read**

- **The header table** is not displayed (`headerTableRaw` is set to an empty string). Metadata on the page comes from the frontmatter only. The table exists for people reading the raw file.
- **The Logs block** in the Markdown is parsed but only two files have one. The **"Date & Edit Logs" page is separate**: `src/app/[product]/logs/page.tsx` holds a hard-coded list of 33 dated entries across the four products. Editing a file's `last_updated` or Logs does not update that page.
- **Frontmatter `product`** is not used for routing; the product comes from the URL.

**What the loader depends on:** section headings written `## <number>. …`; feature headings written `### F-<number>…`; part headings written `#### <number>. …`; and single-line frontmatter values. A file that departs from these will be split or listed incorrectly.

**Download bundle:** `src/app/api/modules-content/route.ts` joins the raw Markdown of a module's tabs (or the single file) with `---` separators, for each product where the module exists.

## 7. How the files were produced

| Mode | Files | Evidence |
|---|---|---|
| **Generated stub** | 45 | `scripts/generate_admin_prds.mjs`, `generate_client_prds.mjs`, `generate_companion_prds.mjs`, `generate_reception_prds.mjs`, with `generator_helpers.mjs` (`formatPrd`) and `prd_builder_engine.mjs`. Each file is written from a JavaScript object (title, summary, one cross-product row, features with their five parts). All 45 share two identical Module Summary bullets ("Documented directly from MantraAssist figma codebase specifications…" and "Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization."). |
| **Hand-expanded** | 28 | The 17 AI Receptionist pages, the 5 Client chat files plus Companion chat, the 3 task files, Admin tasks, and Client AI Receptionist settings. They have 3 to 6 features each, much longer prose, route-bearing header rows and a Cross-product Summary in every file. |

Timeline from git (`git log -- content`):

| Date | What happened |
|---|---|
| 2026-11-10 | Initial commit (app and channel specifications); chat PRD extended (F-5 for Companion composer actions); "Open Items" removed from all files; **full PRD suite across all four products**. |
| 2026-11-12 | AI Receptionist expanded to 17 pages with cross-product summaries; Tasks PRDs expanded; Website widget requirement mapping added; AI Receptionist settings page updated. |

All 73 files have status **In Review**. Creation dates are 2026-11-10 (51 files) or 2026-11-12 (22); last-updated dates are 2026-11-10 (50) or 2026-11-12 (23).

## 8. Checklist for a new or revised PRD file

1. Put it at `content/{product}/{module}.md`, or `content/{product}/{module}/{tab}.md` for a module with tabs, and add the module or tab to `modulesConfig.ts`. If a module has tabs, a file at the module level will never be shown.
2. Frontmatter with `title`, `product` (lower case), `module`, `channel` (tabs only), `status`, `created_date`, `last_updated`. Keep every value on one line.
3. Header table, then `## Cross-product Summary` if the behaviour appears in another product (link format `[View in X](/product/module/tab)`).
4. `## 1. Module Summary`, `## 2. Feature Requests`, `## 3. Comprehensive Summary`, in that order and with those numbers.
5. For every feature: `### F-n: Title` and the five `#### 1.`–`#### 5.` parts, in order, each as a table except "What it does".
6. Number sub-features `F-n.m`, jobs `F-n-Jm`, criteria `F-n-m` (use `F-n-m`, not the `AC` form).
7. Write each acceptance criterion so it can be tested (Given / when / then, or MUST).
8. Make 3.1 and 3.2 an exact roll-up of the features and jobs above.
9. If a behaviour needs a rule that the template has no section for (permissions, error states, metrics), put it in "What it includes" or an acceptance criterion so it is not lost.

## 9. Inconsistencies in the structure

| # | Observation | Where | Effect |
|---|---|---|---|
| 1 | One document is never shown | `client/chat/chat.md` (not reachable from the registry) | Five features about the inbox and care groups cannot be read in the app or the download bundle |
| 2 | Two files have no header table and carry a Logs block instead | `client/chat/chat.md`, `companion/chat/chat.md` | Different layout from the other 71 |
| 3 | `product` is capitalised in six files ("Client", "Companion") and lower case in the rest | the five `client/chat/*.md` files and `companion/chat/chat.md` | No effect today (the URL decides), but not consistent |
| 4 | Header "Module" row has two styles | stubs: the module id in capitals (`CLIENTS`); expanded files: a descriptive name with the route | Harder to scan or filter |
| 5 | Acceptance IDs use two styles (`F-n-m` and `F-n-ACm`) | 4 files: the 3 AI Receptionist settings pages and `client/settings/reception.md` | Searching for criteria by pattern misses 18 rows |
| 6 | Logs live in two places and neither follows the files | Markdown `### Logs` (2 files) versus the hard-coded `logs/page.tsx` (33 entries) | The change log is edited by hand and can drift from `last_updated` |
| 7 | Cross-product coverage is uneven | AI Receptionist 17 of 17 files; Client 13 of 33; Companion 3 of 8; Admin 2 of 15 | Most Admin and Client behaviour that touches other products is not recorded |
| 8 | Status and dates carry no information | every file is "In Review"; only two creation dates | No way to tell what is approved or current |
| 9 | Table of contents always lists five parts per feature | `prdLoader.ts` builds them without checking | A feature missing a part still shows a link to it |
| 10 | Persona names are not standardised | 123 different values in the "User" column of 210 jobs; for example Practice Administrator, Clinic Administrator and Platform Administrator, or Practice Manager, Practice Coordinator, Clinical Coordinator and Care Coordinator | Hard to tell which roles are meant |
| 11 | Identical boilerplate bullets | 45 files carry the same two Module Summary bullets | The summary adds no information beyond its first bullet |
| 12 | Companion sidebar splits the intended order | Companion modules keep their registry category (WORKSPACE for Appointments, Tasks and Chat; PATIENT COMPANION for the rest) and the sidebar groups by category | The fixed order Today, Appointments, Tasks, Documents, Forms, Billing, Pharmacy, Chat is shown as two groups: PATIENT COMPANION first, then WORKSPACE |

_Not counted as a problem:_ task-file titles that look as if they contain a broken character are a display artefact; the character is a real em dash.

## 10. Where to look in the code

| To change… | Edit |
|---|---|
| Add or rename a module or tab, or its sidebar group | `src/lib/modulesConfig.ts` |
| How files are found or split | `src/lib/prdLoader.ts` |
| How Markdown looks | `src/components/PrdRenderer.tsx` |
| The change-log page | `src/app/[product]/logs/page.tsx` |
| The download bundle | `src/app/api/modules-content/route.ts` |
| The PRD text of a stub file | the matching `scripts/generate_*_prds.mjs`, if you regenerate; otherwise the `.md` file directly (regenerating overwrites hand edits) |
