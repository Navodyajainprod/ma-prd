---
title: "In-app Product Guide"
product: "client"
module: "help"
channel: "guide"
route: "/guide and /guide/:slug"
status: "In Review"
build_status: "Works"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | HELP |
| Route | `/guide` and `/guide/:slug` |
| Status | In Review |
| Build status | Works |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A help centre inside the app. A home page, a sidebar of 15 topic pages, an on-this-page index, a search box and a **Back to app** button. |
| **Who uses it** | Practice Manager and any new staff member who is stuck. No role is checked: any signed-in user can open it. |
| **Where you start it** | `/guide`, `/guide/:slug`, or a guide link from a screen such as Process settings. |
| **Where the result goes** | Nowhere. The guide only explains. **Back to app** returns to the page the user came from. |
| **How real is it** | 1 feature works, 1 is partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Process) | Deep links from Process | Process screens link to a guide topic and section, for example the flow builder canvas under Process settings. | [View Process List](/client/processes/list) |
| Client (Clients) | Topic pages | The Clients topic explains the Clients screens. | [View Clients](/client/clients) |
| Client (Scribe) | AI Scribe topic | The AI Scribe topic explains the Scribe screens. | [View Scribe](/client/scribe) |
| Client (Settings) | Team and organization topic | The topic covers the team and the organisation settings. | [View Team](/client/settings/team) |
| Client (Invoices) | Missing topic | There is no topic for Invoices, Claims, Reports, Tasks, Receptionist or Automation. | [View Invoices](/client/invoices) |

## 1. Module Summary

### The story in one minute

Asha Verma, the practice manager, is setting up a new flow and gets stuck on the canvas. She presses the guide link on the Process screen. The guide opens on the Process Settings topic, scrolled to the flow builder section. The sidebar lists the other topics and the right-hand index lists the sections of this one. She types "stage" into **Search the guide...** and sees up to eight matches. She opens one. Then she presses **Back to app** and is on the screen where she started. Later she types a topic that does not exist into the address bar and the guide home opens with no message. She also looks for a page on Invoices and finds none.

### What is real and what is not

- **Real in the prototype:** the home page, 15 topic pages, the sidebar, the on-this-page index, the search, section deep links and the back button.
- **Simulated:** an unknown topic address silently shows the guide home instead of a not-found message.
- **Not built:** guide pages for Reports, Tasks, Invoices, Claims, Receptionist and Automation.

### Journey position

```
Any screen ─▶ Guide link ─▶ Topic section ─▶ Search or sidebar ─▶ Back to app
```

## 2. Feature Requests

### F-1: Browse and search the guide

#### 1. What it does
Asha opens `/guide` and sees the **MantraAssist Product Guide** home. It explains the product, shows the chain Organization, Processes, Stages, Workflow Steps and In-Call Events, and lists the topic cards under **Browse the guide**. The sidebar holds 15 topics: Dashboard, Clients, Call Logs, Process Settings, Web Forms, Knowledge Base, Chats, Appointments, Services, Team and Organization, Organizations, Billing and Payments, Settings, Deals and AI Scribe. On a topic page the right-hand index lists the sections. The search box finds a topic or section.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Guide home | Page | Product overview, the five-step chain and topic cards | ● Works | |
| F-1.2: Topic pages | Pages | 15 topics, each with an intro and sections | ● Works | Topic text was not checked against current screens |
| F-1.3: Sidebar | Navigation | Lists every topic and marks the current one. A mobile menu exists | ● Works | |
| F-1.4: On-this-page index | Navigation | Lists the sections of the open topic | ● Works | |
| F-1.5: Search | Search box | **Search the guide...** matches topic titles, section titles and section text and shows up to eight results | ● Works | |
| F-1.6: Unknown topic | State | An unknown slug shows the guide home with no message | ◐ Simulated | (G14-E-22). Decision needed: D-10 |
| F-1.7: Missing topics | Content | No pages for Reports, Tasks, Invoices, Claims, Receptionist or Automation | ○ Not built | (G14-E-22). Decision needed: D-10 |

#### 3. Worked example
Asha looks for help.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She opens `/guide` | Types "stage" in the search box | **Up to eight matching sections are listed** |
| 2 | She opens `/guide/not-a-topic` | Looks at the page | **The guide home shows with no not-found message** |
| 3 | She wants to read about invoices | Scans the sidebar | **There is no Invoices topic** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Manager | When I am stuck, I want an answer inside the app, so that I can learn without asking a colleague. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** `/guide`, **then** the home page shows with a card for each of the 15 topics. |
| F-1-2 | **Given** text in the search box, **then** at most eight matching sections are shown. |
| F-1-3 | **Given** a slug that matches no topic, **then** the guide home shows with no error message. |
| F-1-4 | **Given** a screen not in the 15 topics, **then** the guide has no page for it. |

### F-2: Deep links and Back to app

#### 1. What it does
A screen can open the guide on a topic and a section, for example `/guide/process-settings#flow-builder-canvas`. The page scrolls to the section. **Back to app** returns to the page Asha came from, or one step back when none was passed.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Section deep link | Link | A topic slug plus a section anchor opens the topic and scrolls to the section | ● Works | Process screens use this |
| F-2.2: Back to app | Button | Goes to the page the user came from, or one step back | ● Works | Hidden on narrow screens |
| F-2.3: Access | Rule | Any signed-in user can open the guide | ● Works | Decision needed: D-10 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Asha is on the flow builder | Presses the guide link | **The guide opens at the flow builder section** |
| 2 | She has read enough | Presses **Back to app** | **She is back on the flow builder** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | While building a flow, I want help for the exact part I am on, so that I do not lose my place. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a guide address with a section anchor, **then** the topic opens and scrolls to that section. |
| F-2-2 | **Given** the user opened the guide from a screen, **when** Back to app is pressed, **then** that screen opens again. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Browse and search the guide | F-1.1 – F-1.7 | ● / ◐ / ○ | 15 topics and search work; unknown topic is silent; six screens have no page. |
| F-2 | Deep links and Back to app | F-2.1 – F-2.3 | ● Works | Section links and the back button work. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Manager | Get an answer inside the app | F-1 |
| 2 | Practice Manager | Get help for the exact part I am on | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open the guide, search, follow deep links | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

No earlier PRD covers the guide. Decision needed: D-10.

## 5. Metrics and definitions

No metric is shown in the guide.

## 6. Cross-module journeys this module appears in

This module is in none of the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-10 | Which additional guide topics are required, and should unknown topics show not found? | F-1.6, F-1.7, F-2.3 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
