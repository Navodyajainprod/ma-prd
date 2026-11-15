---
title: "Third-Party Integrations, Twilio SIP & Webhooks"
product: "client"
module: "settings"
channel: "integrations"
route: "/settings/integrations"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | SETTINGS: INTEGRATIONS |
| Route | `/settings/integrations` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | The **Integrations** tab of Client Settings. A catalogue of cards by category, a drawer to enter credentials, test, save and disconnect, and a **Telephony** sub-tab with SIP trunks and phone numbers. |
| **Who uses it** | Practice Admin (connects external systems). Only the SystemAdmin role passes the Settings guard. |
| **Where you start it** | **Settings**, then **Integrations** (`/settings/integrations`). The **Telephony** category tab also holds the number list that opens at `/settings/numbers`. |
| **Where the result goes** | A connected flag and the entered credentials, kept in the browser under one key per integration, plus an activity log entry. No call goes to any outside system. |
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
| Client (Chats) | WhatsApp, SMS and mailbox | Connecting WhatsApp Business, Twilio SMS or a mailbox here is meant to feed the chat channels. The connection is a stored flag and no message is exchanged. | [View Chats](/client/chat/chat) |
| Client (Call Logs) | Telephony | Telephony cards and SIP trunks are meant to feed calls. They are page data and nothing places or receives a call. | [View Call Logs](/client/call-logs) |
| Client (Clients) | CRM sync and lead forms | Meta Lead Ads and CRM cards are meant to create or update contacts. The setup screens exist and nothing is synced. | [View Clients](/client/clients) |
| Client (Settings, Custom Fields) | Field Mapping tab | The mapping form can prefill from the field registry shown in Sections / Fields. It only copies a label and key. No field is created or linked. | [View Custom Fields](/client/settings/custom-fields) |
| Client (Settings, Numbers) | Add Number | The number table is on the Telephony sub-tab and is described on the Numbers page. Every **Add Number** option only shows a success toast (G10-E-34). | [View Organization Settings](/client/settings/organization) |
| Admin | Telephony numbers and providers | Admin-managed numbers and carriers are separate from this tab. How they relate is open. Decision needed: D-61. | [View Admin AI Voices & Models](/admin/ai-voices-models) |

## 1. Module Summary

### The story in one minute

Rohan Mehta, the Practice Admin, opens **Settings** and **Integrations**. Tabs run across the top: **All Integrations**, **EHR**, **CRM**, **Telephony**, **Mailbox**, **SMS** and **Marketing**. He types "hubspot" in the search box and opens the card. A drawer asks for credentials. He fills the required fields and presses **Test Connection**. After a second a green result says "Handshake verified (HTTP 200 OK)" with 124 ms. He presses **Save** and the card shows Connected. He notices Twilio and Gmail already show Connected although nobody entered credentials. He opens the **Telephony** tab, sees a list of SIP trunks and presses **Add SIP Trunk**. The new trunk is in the list until he reloads the page. The check never contacted HubSpot.

### What is real and what is not

- **Real in the prototype:** the Field Mapping tab for editing and adding mappings, the category tabs and search, the credential drawer with required-field checks, Save and Disconnect, the activity log entry on connect, and the WhatsApp numbers list on the WhatsApp card.
- **Simulated:** **Test Connection** always succeeds after a short wait when the required fields are filled. The status badge is a stored flag, not a live check, and Twilio and Gmail start connected. Credentials sit in plain browser storage. The SIP trunk list is seeded page data. **Add Number** only shows a toast.
- **Not built:** applying a field mapping to incoming data, Stripe Connect, a real handshake, a live status ping, a confirmation before Disconnect, and encrypted credential storage.

### Journey position

```
Integrations card ─▶ credentials drawer ─▶ Test (simulated) ─▶ Save: connected flag + activity log ─▶ (no outside call)
```

## 2. Feature Requests

### F-1: Browse the integration catalogue

#### 1. What it does
Rohan sees cards in two columns, each with a logo, a name, a short description and a Connected or Not connected state. Tabs filter by category. A search box narrows by name and description and shows a counter. A card opens its drawer.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Category tabs | Tabs | **All Integrations**, **EHR**, **CRM**, **Telephony**, **Mailbox**, **SMS**, **Marketing** | ● Works | |
| F-1.2: Catalogue | Cards | EHR: Cliniko, Healthie, MantraCare, Epic, Athena Health. CRM: Phorest, Bitrix 24, HubSpot, Salesforce, Custom API, Custom Webhook. Telephony: Twilio, Tata Tele, Exotel, Zadarma, Other Provider. Mailbox: Gmail, Outlook, Other (IMAP/SMTP). SMS: Twilio. Marketing: Meta Lead Ads, WhatsApp Business | ● Works | The old PRD named only Twilio, Meta WhatsApp, Stripe and webhooks (G10-I-88) |
| F-1.3: Search | Search | Search covers name and description. The counter shows how many cards match | ● Works | |
| F-1.4: Status badge | Badge | Shows Connected or Not connected from a stored flag | ◐ Simulated | Not a live check. Twilio and Gmail start Connected regardless of credentials, and Salesforce does too until a saved setting exists (G10-E-33). Decision needed: D-62 |
| F-1.5: Empty state | State | "No integrations found" with a **Clear search query** link | ● Works | |
| F-1.6: Stripe Connect payment keys | Card | Described in the earlier PRD | ○ Not built | No Stripe card exists. Decision needed: D-62 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rohan wants only mailbox options | Presses the **Mailbox** tab | **Gmail, Outlook and Other (IMAP/SMTP) are listed** |
| 2 | He searches for "stripe" | Types it in the search box | **"No integrations found" is shown** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Admin | When I set up the clinic, I want to see every system we can connect, so that I pick the right ones. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a category tab, **then** only cards of that category are listed. |
| F-1-2 | **Given** no card matches the search, **then** "No integrations found" is shown. |
| F-1-3 | **Given** a fresh browser, **then** Twilio and Gmail show Connected with no credentials entered. |

### F-2: Connect, test and disconnect

#### 1. What it does
Rohan opens a card and a drawer shows the credential fields for that system. **Test Connection** checks that the required fields are filled. **Save** marks the integration connected and writes an entry to its activity log. **Disconnect** clears the credentials and flips the flag.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Credential fields | Drawer | Fields differ per integration. Fields marked with an asterisk are required | ● Works | Examples from the earlier PRD, such as Twilio SID and token, are one set among many |
| F-2.2: Test Connection | Button | If a required field is empty, shows "Required: <names>" and a toast. Otherwise waits about one second, then shows "Handshake verified (HTTP 200 OK)", 124 ms and an account name, with a toast "<name> connected" | ◐ Simulated | Always succeeds. The latency is fixed. In the page version success is set before the required-field check (G10-E-31). Decision needed: D-62 |
| F-2.3: Save | Button | Marks connected, stores the config under a key per integration, adds an activity log entry | ◐ Simulated | Connected is set after a test or when already connected. Credentials sit in plain browser storage (G10-E-30). Decision needed: D-62 |
| F-2.4: Disconnect | Button | Clears credentials and marks not connected at once | ◐ Simulated | No confirmation (G10-E-32). Decision needed: D-62 |
| F-2.5: Sync schedule and activity log | Panel | Shows connection events and a sync schedule for CRM and lead integrations | ◐ Simulated | Nothing contacts the outside system. Entries are written by the page itself |
| F-2.6: Field mapping and process choice | Section | Bitrix, Salesforce and Meta Lead Ads offer mapping and a process to receive leads | ◐ Simulated | Nothing is sent. Meta forms are three fixed sample forms |
| F-2.7: Custom API and Custom Webhook | Card | Stores an endpoint entry in the browser | ◐ Simulated | Nothing is dispatched to the endpoint. The earlier PRD described outbound webhook dispatchers |
| F-2.8: Verified handshake and live status | Check | Earlier intent: "Test Connection" returns HTTP 200 and a live Connected or Disconnected ping | ○ Not built | Decision needed: D-62 |

#### 3. Worked example
Rohan connects HubSpot.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Drawer is open, a required field is empty | Presses **Test Connection** | **"Required: <field>" shows and a toast asks him to fill required fields** |
| 2 | All required fields are filled | Presses **Test Connection** | **After about a second a green "Handshake verified (HTTP 200 OK)" shows. HubSpot was never contacted** |
| 3 | He changes his mind | Presses **Disconnect** | **Credentials are cleared and the card shows Not connected. No confirmation is asked** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Admin | When connecting an external system, I want to test the connection before I rely on it, so that I know it will work before going live. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a required field is empty, **when** Test Connection is pressed, **then** "Required: <names>" is shown and no success is reported. |
| F-2-2 | **Given** all required fields are filled, **when** Test Connection is pressed, **then** a success with HTTP 200 OK and 124 ms is shown whatever the credentials are. |
| F-2-3 | **Given** a connected integration, **when** Disconnect is pressed, **then** credentials are cleared at once with no confirmation. |
| F-2-4 | **Given** Save on a tested integration, **then** it shows Connected and an activity log entry is added. |

### F-3: Telephony sub-tab: SIP trunks and phone numbers

#### 1. What it does
Rohan presses **Telephony**. The tab shows a SIP trunks panel above the phone numbers table. The panel lists trunks with provider, label, country, number, direction and an active switch. He filters by **All**, **Inbound** or **Outbound**. **Add SIP Trunk** asks for a direction first, then shows a form. The phone numbers table and its own **Add Number** button belong to the Numbers page, which is written separately. This page only records the hand-off.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: SIP trunk list | Table | Seven seeded trunks (Twilio, Plivo, Zadarma) with direction and active switch. Counts by direction | ◐ Simulated | Seed data held in page state. Reloading restores the seven rows |
| F-3.2: Direction filter | Segmented control | **All**, **Inbound**, **Outbound** with counts | ● Works | |
| F-3.3: Add SIP Trunk | Form | Choose Inbound or Outbound. Trunk Name or Label and phone number are required. Outbound adds priority, username or API key and password. Toast "SIP trunk added successfully" or "Inbound trunk added successfully" | ◐ Simulated | The new row lives in page state only. No carrier is contacted |
| F-3.4: Activate, deactivate, remove | Switch, row action | Toast "SIP trunk activated" or "SIP trunk deactivated". Remove deletes the row and toasts "SIP trunk removed" | ◐ Simulated | Remove has no confirmation |
| F-3.5: Add Number hand-off | Button | The numbers table has an **Add Number** modal with six options: Free Vapi Number, Free Vapi SIP, Import Twilio, Import Vonage, Import Telnyx, BYO SIP Trunk | ◐ Simulated | Each option only shows a success toast and closes. No number is added (G10-E-34). Decision needed: D-61 |
| F-3.6: Twilio SID, auth token and caller ID card with Test Connection | Card | Described in the earlier PRD | ○ Not built | Twilio is a catalogue card with the common drawer (F-2) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rohan wants only incoming lines | Presses **Inbound** | **Only inbound trunks are listed** |
| 2 | He adds an outbound trunk | Presses **Add SIP Trunk**, chooses outbound and fills the form | **A toast confirms and the row is listed until the page is reloaded** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | When connecting our telephony, I want to add the clinic's trunks and numbers, so that calls can be routed before we go live. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** the Telephony tab, **then** seven trunks are listed on first load. |
| F-3-2 | **Given** a trunk is added, **when** the page is reloaded, **then** the new trunk is gone. |
| F-3-3 | **Given** an Add Number option is confirmed, **then** a success toast shows and no number is added. |

### F-4: WhatsApp numbers

#### 1. What it does
On the WhatsApp Business card Rohan sees a list of connected numbers. He adds a number and it appears with a generated business account id. He disconnects a number from the list.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Numbers list | List | Lists connected WhatsApp numbers | ◐ Simulated | |
| F-4.2: Add number | Form | An empty number shows "Please enter a valid phone number". A number is added with a mock account id | ◐ Simulated | The id is a generated placeholder. No Meta call is made |
| F-4.3: Disconnect number | Action | Removes the number from the list | ◐ Simulated | |
| F-4.4: Meta handshake with WABA ID and system token | Check | Described in the earlier PRD | ○ Not built | See F-2.8 |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Rohan adds the clinic line | Enters the number and saves | **The number is listed with a generated id. Nothing is verified with Meta** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Admin | When patients message us on WhatsApp, I want to connect the clinic's number, so that chats reach the team. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** an empty number, **when** the user saves, **then** "Please enter a valid phone number" is shown. |
| F-4-2 | **Given** a number is saved, **then** it is listed with a generated business account id. |

### F-5: Field Mapping tab of the integration drawer

#### 1. What it does
The drawer of an integration card has four tabs: **Connection**, **Sync Settings**, **Field Mapping** and **Sync Logs**. Rohan opens **Field Mapping** on the Cliniko card. A note says the placeholders were pre-filled from Cliniko's incoming payload and can be edited. Five cards are listed: Client Name, Phone Number, Email Address, Service Name and Notes / Instructions. Each card shows a placeholder such as `{phone}`, an input for the mapped value and the incoming API variable. He adds a mapping for a field of his own. The changes are saved in the browser as he types.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Tab and counter | Tab | **Field Mapping** with a count badge of the mappings | ● Works | |
| F-5.2: Default mappings | Cards | Five preset cards. The incoming variable differs for Cliniko, Healthie and the others. The input starts with a preset sample value | ◐ Simulated | Sample values are fixed placeholders, not data from the system |
| F-5.3: Payload variables palette | Chips | "Available API payload variables for <name> (click to copy)" with a key count. Click copies the token and toasts `Copied variable <token>` | ◐ Simulated | Fixed lists for Phorest, Cliniko and Healthie and a generic list for the rest. Not read from the system |
| F-5.4: Search and module filters | Search, chips | Search covers field name and `{variable}`. Chips **All Fields**, **Contacts**, **Appointments**, **Clinical / Scribe** and **Custom Fields** with counts | ● Works | |
| F-5.5: Edit the mapped value | Input | Edits the value of a card. **Use variable key** copies the incoming variable into the input. Each change is stored at once under the integration's key | ◐ Simulated | Stored only. No screen or sync reads it, and it is saved even without pressing Save |
| F-5.6: Add Field Mapping | Form | **MantraAssist Field Label** (required), **Target Entity / Module** (Contact / Client, Appointment, Clinical / Scribe, General Custom Field), **Incoming API Variable Key**, **Default / Sample Value**. Chips offer up to 12 fields from the field registry to prefill the form. Toast "Added field mapping: <label>" | ◐ Simulated | The key and `{token}` are made from the label. A prefilled registry field is copied by label and key, not linked, and creates nothing in Sections / Fields. The variable key is starred but can be left empty |
| F-5.7: Remove a mapping | Button | A bin icon on custom mappings removes the card and toasts "Mapping removed" | ● Works | No confirmation. Default cards cannot be removed |
| F-5.8: Reset defaults | Button | Restores the five default cards and drops added ones. Toast "Field mappings reset to defaults" | ● Works | No confirmation |
| F-5.9: Empty state | State | "No field mappings match your filter" with **Clear search filter** | ● Works | |
| F-5.10: Applying mappings to incoming data | Rule | Earlier intent: incoming API values fill contact, appointment and custom fields | ○ Not built | Nothing reads the mappings when data arrives |

#### 3. Worked example
Rohan maps a VIP tier from Cliniko.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Cliniko drawer is open | Presses **Field Mapping** | **Five default cards and a palette of Cliniko variables show** |
| 2 | He needs a new field | Presses **Add Field Mapping**, enters "VIP Tier", target **Contact / Client**, variable `patient.vip_tier`, and presses **Add Mapping** | **A card "VIP Tier" with a Custom Field tag and the token `{vip_tier}` appears. No custom field is created** |
| 3 | He wants the defaults back | Presses **Reset defaults** | **The VIP Tier card disappears at once with no question** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | When an outside system sends patient data, I want to map its variables to our fields, so that records fill without retyping. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** a new integration drawer, **when** Field Mapping opens, **then** five default mappings are listed. |
| F-5-2 | **Given** a mapping is edited, **then** it is stored at once in the browser. Nothing else in the product uses it. |
| F-5-3 | **Given** Add Mapping with an empty label, **then** the button is disabled. |
| F-5-4 | **Given** Reset defaults is pressed, **then** custom mappings are removed with no confirmation. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Browse the catalogue | F-1.1 – F-1.6 | ● / ◐ / ○ | Tabs, cards and search work. Status is a stored flag. No Stripe. |
| F-2 | Connect, test and disconnect | F-2.1 – F-2.8 | ● / ◐ / ○ | Drawer works. The test always succeeds. Credentials in plain storage. |
| F-3 | Telephony sub-tab | F-3.1 – F-3.6 | ◐ / ● / ○ | Seeded trunks in page state. Add Number only toasts. |
| F-4 | WhatsApp numbers | F-4.1 – F-4.4 | ◐ / ○ | List and add with a placeholder id. |
| F-5 | Field Mapping tab | F-5.1 – F-5.10 | ● / ◐ / ○ | Mappings can be edited and added. Nothing applies them. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Admin | See every system we can connect | F-1 |
| 2 | Practice Admin | Test a connection before relying on it | F-2 |
| 3 | Practice Admin | Add trunks and numbers before going live | F-3 |
| 4 | Practice Admin | Connect the clinic's WhatsApp number | F-4 |
| 5 | Practice Admin | Map incoming variables to our fields | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| SystemAdmin | Open the tab, connect, test, save and disconnect any integration, add and remove trunks | Nothing |
| Admin, Manager, Agent, Reception | See Settings in the menu | Opening it. A click sends them home with "Access restricted: Settings requires System Admin privileges." |

The role comes from browser storage and defaults to SystemAdmin. The earlier PRD named a Practice Administrator and said nothing about who may store credentials. Decision needed: D-12.

## 5. Metrics and definitions

The tab shows one counter, the number of cards matching the tab and search. The test result shows a latency of 124 ms. **Hardcoded, formula undefined.**

## 6. Cross-module journeys this module appears in

The tab is not a step in the four journeys.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-62 | Is Stripe Connect a client or admin setting, where are credentials stored and how is a connection tested? | F-1.4, F-1.6, F-2.2 – F-2.4, F-2.8 |
| D-61 | Are numbers self-service, imported or admin-allocated, with what charge and process assignment, and do admin numbers appear here? | F-3.5, Cross-product Summary |
| D-12 | Must roles block who may connect systems and store credentials, and where is it enforced? | Section 4 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
