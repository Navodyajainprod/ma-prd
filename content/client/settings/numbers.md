---
title: "Settings: Phone Numbers and Country Routing"
product: "client"
module: "settings"
channel: "numbers"
route: "/settings/numbers"
status: "In Review"
build_status: "Simulated"
created_date: "2026-11-14"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS |
| Route | `/settings/numbers` |
| Status | In Review |
| Build status | Simulated |
| Created | 2026-11-14 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A table of phone numbers with country routing, plus an **Add Number** window and a Verify Caller ID flow. The page is the telephony part of the Integrations tab. |
| **Who uses it** | Practice Admin (sets up numbers). The Settings area is limited to the System Admin role. |
| **Where you start it** | **Numbers** in the Settings left menu (`/settings/numbers`). |
| **Where the result goes** | Nowhere outside the page. No number is added to the table, and routing rows live in page state. |
| **How real is it** | 0 features work, 2 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client (Integrations) | Telephony tab | `/settings/numbers` opens the Integrations tab on its telephony section. Both are one screen. | [View Integrations](/client/settings/integrations) |
| Client (Process) | Process assignment | A number row lists the processes it is linked to. Nothing reads the link when a call is placed. | [View Process List](/client/processes/list) |
| Client (Billing) | Credits for calls | The country price list is fixed data. No credit is charged when a number is added. | [View Billing](/client/settings/billing) |
| Admin | Telephony numbers and carriers | Not connected. How a client number relates to admin-managed numbers is undecided. | [View Admin Organizations](/admin/organizations) |

## 1. Module Summary

### The story in one minute

Rohan Mehta is the Practice Admin. He opens **Numbers** in Settings and sees a table of phone numbers. Each row shows the country, a priority, the countries it serves, the processes it is assigned to, the provider, the cost per minute in and out, the direction and a verified flag. He presses **Add Number** and a window offers six ways to get one: Free Vapi Number, Free Vapi SIP, Import Twilio, Import Vonage, Import Telnyx and BYO SIP Trunk. He picks one and confirms. A success message appears and the window closes. The table has not changed. He then adds a routing row by hand with a number that starts with a plus sign. The row appears. When he reloads the page, it is gone and the original rows are back.

### What is real and what is not

- **Real in the prototype:** the table with its columns, the column re-order saved in the browser, and the form that adds a routing row.
- **Simulated:** every **Add Number** option only shows a success message. The rows are seeded and reset on reload. Verify Caller ID is a screen flow with no confirmed carrier check. Delete has no confirmation.
- **Not built:** buying a number with an inventory search, a price and a credit charge, and a number inventory.

### Journey position

```
Settings ─▶ Numbers ─▶ Add Number ─▶ Success toast only
                  └──▶ Routing row ─▶ Page state (lost on reload)
```

## 2. Feature Requests

### F-1: Number table and routing

#### 1. What it does
Rohan sees every number with its routing in one table. The columns are phone, country, priority, countries served, processes, provider, cost in, cost out, direction, status and verified. He can re-order columns, and the order is remembered in his browser. A row menu holds edit, verify and delete. A number is linked to one or more processes and to the countries it serves. The rows he sees at first are seeded sample rows.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Number table | Table | Phone, country, priority, countries served, processes, provider, cost in and out, direction, status, verified | ◐ Simulated | The starting rows are hardcoded seed rows (G10-E-35) |
| F-1.2: Column re-order | Control | Re-order columns and keep the order in the browser | ● Works | |
| F-1.3: Add routing row | Form | Needs a phone starting with +, a country and a provider. Verified is set to true for the United States | ◐ Simulated | Rows live in page state and reset on reload (G10-E-35) |
| F-1.4: Assign to processes and countries | Multi-select | Links a number to processes and countries served | ◐ Simulated | Kept on the row only. Nothing routes a call by it |
| F-1.5: Edit | Row action | Edits a routing row | ◐ Simulated | Reset on reload (G10-E-35) |
| F-1.6: Verify Caller ID | Modal | Opens the verify flow from the row menu | ◐ Simulated | No carrier check was confirmed (unverified) |
| F-1.7: Delete | Row action | Removes the row at once | ◐ Simulated | No confirmation (G10-E-36). The row returns on reload |
| F-1.8: Role control | Rule | Settings is limited to System Admin. No finer rule | ○ Not built | Decision needed: D-12 |

#### 3. Worked example
Rohan adds a routing row.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | He has a US number | Enters a phone starting with **+**, a country and a provider | **The row appears and is marked verified because the country is the United States** |
| 2 | He deletes a seeded row | Chooses delete | **The row goes at once with no confirmation** |
| 3 | He reloads the page | Reloads | **His added row is gone and the deleted seed row is back** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I set up telephony, I want to see each number with its countries, processes and cost, so that I know which number serves which calls. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the routing form, **when** the phone does not start with +, or country or provider is empty, **then** the row is not added. |
| F-1-2 | **Given** a United States number, **when** the row is added, **then** it is marked verified. |
| F-1-3 | **Given** a delete, **then** the row is removed with no confirmation. |
| F-1-4 | **Given** a page reload, **then** added and edited rows are lost and the seed rows return. |

### F-2: Add Number options

#### 1. What it does
Rohan presses **Add Number**. A window lists Free Vapi Number, Free Vapi SIP, Import Twilio, Import Vonage, Import Telnyx and BYO SIP Trunk. He picks one and confirms. The page shows a success message and closes the window. Nothing is added.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Six options | Modal | Free Vapi Number, Free Vapi SIP, Import Twilio, Import Vonage, Import Telnyx, BYO SIP Trunk | ◐ Simulated | Each confirm only shows a success toast and closes. No number is added (G10-E-34). Decision needed: D-61 |
| F-2.2: Country price list | Data | A per-country price list exists in the code | ◐ Simulated | The only handler that reads it is never called. No price is shown at purchase (G10-E-37) |
| F-2.3: Credit charge | Rule | Buying a number charges credits | ○ Not built | No credit is charged (G10-E-37). Decision needed: D-61 |
| F-2.4: Number inventory search | Search | Search available numbers by country | ○ Not built | |

#### 3. Worked example
Rohan tries to import a Twilio number.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The window is open | Picks **Import Twilio** and confirms | **A success message shows and the window closes** |
| 2 | He looks at the table | Looks for the number | **It is not there** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When the clinic needs a new line, I want to get or import a number and see its price, so that I can start using it. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** any Add Number option, **when** it is confirmed, **then** a success toast shows and the window closes. |
| F-2-2 | **Given** a confirmed option, **then** no row is added and no credit is charged. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Number table and routing | F-1.1 – F-1.8 | ◐ / ● / ○ | Table and form show; rows are seeded and reset on reload. |
| F-2 | Add Number options | F-2.1 – F-2.4 | ◐ / ○ | Success toast only; no number, price or charge. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | See each number with its countries, processes and cost | F-1 |
| 2 | Practice Admin | Get or import a number and see its price | F-2 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| System Admin (the default role) | Everything on the page | Nothing |
| Any other role | Nothing: Settings shows a message and sends the user to the home page | The whole Settings area |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The active role comes from browser storage and defaults to System Admin, so in practice everyone who signs in has access. No earlier PRD covers this page. Decision needed: D-12.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Cost in and out | Table columns | Fixed values on each row. **Hardcoded, formula undefined** |
| Country price | Price list | Fixed data. Not used anywhere at purchase |

## 6. Cross-module journeys this module appears in

This page is not a step in the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-61 | Which telephony model applies: self-service purchase, import or admin allocation, with what charge and process assignment? | F-2.1, F-2.3 |
| D-12 | Must permissions block direct URL access and each action, and which roles may manage numbers? | F-1.8 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Written to describe the prototype as built. |
