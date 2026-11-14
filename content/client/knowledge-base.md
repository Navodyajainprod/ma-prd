---
title: "Knowledge Base: Reference Sources for the AI"
product: "client"
module: "knowledge-base"
route: "/knowledge-base"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | KNOWLEDGE BASE |
| Route | `/knowledge-base` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A list of knowledge sources, each a pasted text or an uploaded file name, scoped to chosen processes and stages. It has a search box, type presets, a list and grid view, a create and edit drawer and a delete confirmation. It is not a folder tree of readable articles. |
| **Who uses it** | Practice Admin (adds and scopes sources). Care Coordinator (adds knowledge from a process). No role is checked: any signed-in user can add, edit and delete sources. |
| **Where you start it** | **Knowledge Base** in the sidebar (`/knowledge-base`, under CUSTOMIZATIONS), or the add-knowledge button on a process in **Workflows**. |
| **Where the result goes** | Browser storage only. No AI channel reads the sources, so nothing a clinic adds reaches the kiosk, the chatbots or a phone agent. |
| **How real is it** | 0 features work, 4 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Workflows) | Add knowledge from a process | The add-knowledge button on a process opens the create drawer already scoped to that process. The process exists in the picker for that visit only, so after a reload its scope chips disappear (G9-E-03). | [View Workflows](/client/workflows) |
| AI Receptionist | Kiosk answers | Not connected. The kiosk's knowledge answer is three hardcoded replies (parking, hours, pharmacy) and an escalation fallback, and no kiosk screen calls it. Decision needed: D-127. | [View Kiosk Shell](/ai-receptionist/avatar/ambient-presence) |
| Client (Chats) | Chatbots | Not connected. Chatbots carry a knowledge list that is always empty. Decision needed: D-127. | [View Chats](/client/chat/chat) |

## 1. Module Summary

### The story in one minute

Rohan Mehta opens **Knowledge Base**. The header reads "Give your AI reference material, scoped to the exact processes and stages where it should be used." He presses **Create Knowledge Base**. He types a name, adds the tags FAQ and Policy, and ticks one process and two of its stages. He pastes the clinic's cancellation policy as text and saves. The toast says "Knowledge Base created" and the source is Completed. He adds a PDF next. Its status shows Pending and flips to Completed two seconds later, but only the file name and size are kept. Later he deletes an old source. The dialog says the AI will no longer have access to it, though no AI ever did.

### What is real and what is not

- **Real in the prototype:** the source list with name search, type presets with counts, list and grid views, creating and editing text and file sources, tags, scoping to processes and stages, copy of the source id, single and bulk delete with a confirmation, and the add-knowledge link from Workflows.
- **Simulated:** file ingestion and its Pending to Completed status, the process picker (two fixed sample processes), URL sources (seed data only), the help text, and the delete warning about AI access. Sources sit in one global storage key outside demo and fresh workspaces.
- **Not built:** any AI channel reading a source, folders, content search with highlighting, a reader and print view, publish and index, role control, and URL sources that users can create.

**Naming note:** the earlier PRD described authored Markdown "articles" in folders (Clinical Protocols, Front Desk FAQs, Insurance Policies). The prototype has "sources" with tags. Decision needed: D-04.

### Journey position

```
Create source ─▶ Scope to process and stage ─▶ Stored in browser ─▶ (no AI channel reads it)
```

## 2. Feature Requests

### F-1: Find and browse sources

#### 1. What it does
Rohan opens `/knowledge-base`. The topbar has a search box, presets **All Sources**, **Text Articles**, **File Documents** and **URLs & Links** with counts, a type dropdown and a list or grid toggle. The list columns are Actions, Name, Type, Scope, Tags, Status and Created. Pages hold 20, 50 or 100 rows. A grid card footer copies the source id. A **How Knowledge Base Works** help modal explains the page.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Type presets and counts | Chips | All Sources, Text Articles, File Documents, URLs and Links, each with a count | ● Works | |
| F-1.2: Name search | Search | Matches the source name only, as a substring | ● Works | |
| F-1.3: Search inside content, with highlighting | Search | Earlier PRD: semantic search over titles and contents, sub-second | ○ Not built | Decision needed: D-04 |
| F-1.4: List and grid views | Views | A table or cards. Pagination of 20, 50 or 100 | ● Works | |
| F-1.5: Empty state | State | "No Knowledge Bases yet" with a **Create Knowledge Base** button | ◐ Simulated | Also shown when a search or filter matches nothing (G9-E-05) |
| F-1.6: Loading and error states | State | None. A parse error falls back silently to the seed sources | ○ Not built | |
| F-1.7: Copy KB ID | Action | Copies the id and shows "KB ID copied to clipboard" | ● Works | What the id is for is open. Decision needed: D-131 |
| F-1.8: Category folder tree | Navigation | Earlier PRD: Clinical Protocols, Front Desk FAQs, Insurance Policies | ○ Not built | Tags replace folders. Decision needed: D-04 |
| F-1.9: Reader view, printable | Screen | Earlier PRD: formatted article with tables, callouts and diagrams | ○ Not built | A text source can only be read by opening Edit. Decision needed: D-04 |

#### 3. Worked example
Rohan looks for the cancellation policy.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He wants only files | Presses **File Documents** | **Only file sources are listed, with the count on the chip** |
| 2 | He types words from inside a policy | Searches | **Nothing matches. Search reads the name only, and the page shows "No Knowledge Bases yet"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I maintain reference material, I want to find a source by name and type, so that I can check or change it quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a search term, **then** only sources whose name contains it are listed. Content is not searched. |
| F-1-2 | **Given** no row matches a search or filter, **then** the first-run "No Knowledge Bases yet" message shows. |
| F-1-3 | **Given** a grid card, **when** Copy KB ID is used, **then** the id is copied and a toast confirms. |

### F-2: Create and edit a source

#### 1. What it does
**Create Knowledge Base** opens a drawer. Rohan enters a **Name**, chooses tags, picks the **Scope**, picks a content type and fills it in. He saves. Edit opens the same drawer filled with the source. A source made from the Workflows deep link opens already scoped to that process.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Name and tags | Fields | Name is required. A combo of 10 preset tags (Feedback, Plan Details, Complaints, FAQ, Pricing, Policy, Refund, Onboarding, Support, Billing). Enter adds a custom tag | ● Works | The presets are generic, not clinic categories. Decision needed: D-131 |
| F-2.2: Scope | Picker | An All checkbox, or a process tree with per-stage boxes. All stages ticked collapses to the whole process | ◐ Simulated | The tree lists two fixed sample processes, not the live Workflows (G9-E-03) |
| F-2.3: Text source | Content | A textarea. The title is taken from the first 40 characters | ● Works | |
| F-2.4: File source | Content | A single picker for PDF, DOC, DOCX, TXT or CSV | ◐ Simulated | Only the file name and size are kept (G9-E-06) |
| F-2.5: URL source | Content | The URL option is disabled with the tooltip "Coming soon" | ○ Not built | URL sources exist only as seed data |
| F-2.6: Save checks | State | Toasts: "Please enter a Knowledge Base name", "Please select at least one process or stage", "Please enter some content", "Please upload a file". Success: "Knowledge Base created" or "Knowledge Base updated" | ● Works | |
| F-2.7: Status | Badge | Text saves as Completed. A file saves as Pending and flips to Completed after a 2 second timer | ◐ Simulated | Processing and Failed are never set (G9-E-06). Decision needed: D-131 |
| F-2.8: Edit | Drawer | Row action, card menu or a click on the name | ◐ Simulated | Editing a URL source opens in Text mode with empty content and cannot be saved (G9-E-04) |
| F-2.9: Add from a process | Deep link | Opens the drawer scoped to that process, with its stages | ◐ Simulated | The process lives in the picker for that visit only (G9-E-03) |
| F-2.10: Help modal | Text | Says URLs can be added and that "AI reviews scoped material first" | ◐ Simulated | URL is disabled and no AI reads sources (G9-E-07) |
| F-2.11: Authored Markdown articles | Content | Earlier PRD: staff author clinical protocols and FAQs | ○ Not built | Decision needed: D-04 |

#### 3. Worked example
Rohan adds the cancellation policy.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He saves with no scope | Presses save | **"Please select at least one process or stage"** |
| 2 | He ticks a process and pastes the text | Saves | **"Knowledge Base created". The source shows Completed** |
| 3 | He uploads a PDF | Saves | **Status Pending, then Completed after 2 seconds. Only the name and size are stored** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When the AI needs approved answers, I want to add reference material for a given process and stage, so that it uses the right material in the right place. |
| F-2-J2 | Care Coordinator | When I am editing a process, I want to add knowledge from there, so that I do not switch pages. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** no name, no scope, or no content for the chosen type, **when** the user saves, **then** the matching toast shows and nothing is saved. |
| F-2-2 | **Given** a file source is saved, **then** its status is Pending and becomes Completed after 2 seconds. The file content is not stored. |
| F-2-3 | **Given** the URL option, **then** it is disabled. |
| F-2-4 | **Given** the add-knowledge button on a process, **then** the drawer opens scoped to that process. |

### F-3: Delete sources

#### 1. What it does
Rohan deletes one source from its row or card, or ticks several and presses **Delete Selected**. A confirmation modal appears. After he confirms, a toast says the source or sources were deleted.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Single delete | Action | Opens a confirmation modal, then a toast | ◐ Simulated | The modal says "the AI will no longer have access to it" but no AI had access (G9-E-01) |
| F-3.2: Bulk delete | Action | Selected count in the bulk bar, then the same modal | ◐ Simulated | Same warning (G9-E-01) |
| F-3.3: Role control | Rule | Any signed-in user can delete | ○ Not built | Decision needed: D-16 |

#### 3. Worked example
Rohan retires old material.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Three sources are obsolete | Ticks them and presses **Delete Selected** | **A confirmation modal appears** |
| 2 | He confirms | Presses confirm | **A toast shows and the sources are gone. No AI was affected** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When material is out of date, I want to remove it, so that it is no longer used. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** Delete or Delete Selected, **then** a confirmation modal is shown first. |
| F-3-2 | **Given** the user confirms, **then** the sources are removed from browser storage and a toast shows. |

### F-4: AI use, storage and access

#### 1. What it does
The page promises that the AI uses the sources only in the process and stage they are scoped to. Nothing in the prototype does this. The sources are saved in browser storage and no screen, kiosk, chatbot or phone agent reads them.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: AI reads a source | Integration | No AI channel imports the store. The kiosk answers from 3 hardcoded replies and chatbots carry an empty knowledge list | ○ Not built | (G9-E-01). Decision needed: D-127 |
| F-4.2: Scope applied when the AI answers | Rule | A source should be used only in its process and stage | ○ Not built | Needs F-4.1. Decision needed: D-127 |
| F-4.3: Storage and organisation separation | Rule | Outside demo and fresh workspaces, sources are read and written under one global key with no organisation key | ◐ Simulated | Sources can leak across organisations (G9-E-02) |
| F-4.4: Publish and index | Rule | Earlier PRD: published articles are indexed and found at once | ○ Not built | No draft or publish state and no index. Decision needed: D-04 |
| F-4.5: Role control | Rule | The roles drawer lists a Knowledge Base permission that nothing checks | ○ Not built | Decision needed: D-16 |

#### 3. Worked example
Rohan expects the kiosk to know the cancellation policy.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The policy source is saved | Asks the kiosk about cancelling | **The kiosk uses its own hardcoded replies. The source is never read** |
| 2 | Another clinic uses the same browser | Opens Knowledge Base | **It may see Rohan's sources, because one global key is used** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Admin | When a patient asks the AI a question, I want it to answer from approved clinic material, so that the answers are safe and consistent. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** a saved source, **then** no AI channel reads it. |
| F-4-2 | **Given** a workspace that is neither demo nor fresh, **then** sources are stored under one global key shared by every organisation. |
| F-4-3 | **Given** any signed-in role, **then** it can add, edit and delete sources. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Find and browse sources | F-1.1 – F-1.9 | ● / ◐ / ○ | Name search and presets work; no content search, folders or reader. |
| F-2 | Create and edit a source | F-2.1 – F-2.11 | ● / ◐ / ○ | Text sources work; files keep a name only; no URL sources. |
| F-3 | Delete sources | F-3.1 – F-3.3 | ◐ / ○ | Delete works; the AI warning is false. |
| F-4 | AI use, storage and access | F-4.1 – F-4.5 | ○ / ◐ | No AI reads sources; global storage key. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | Find a source by name and type | F-1 |
| 2 | Practice Admin | Add reference material for a process and stage | F-2 |
| 3 | Care Coordinator | Add knowledge from the process I am editing | F-2 |
| 4 | Practice Admin | Remove out-of-date material | F-3 |
| 5 | Practice Admin | Have the AI answer from approved material | F-4 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open `/knowledge-base`, add, edit and delete any source | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names the Medical Assistant as the user and describes no permissions. A Knowledge Base permission exists in the roles drawer and nothing enforces it. Decision needed: D-16.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Source count per type | Presets and type dropdown | Count of stored sources, in total or by type |
| Selected count | Bulk bar | Number of ticked rows |

## 6. Cross-module journeys this module appears in

This module is not a step in any of the four journeys. The one hand-off it has is the add-knowledge link from Workflows.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-04 | Are folders, content search with highlighting, a reader and print view and publish and index still wanted? | F-1.3, F-1.8, F-1.9, F-2.11, F-4.4 |
| D-16 | Which roles may view, create, edit and delete Knowledge Base sources? | F-3.3, F-4.5 |
| D-127 | Which AI channels read Knowledge Base sources, and how does process and stage scope apply to someone not yet in a workflow? | F-4.1, F-4.2 |
| D-131 | Should tag presets be clinic-specific, what is the KB id for, and what happens when file processing fails? | F-1.7, F-2.1, F-2.7 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
