---
title: "Clients: Contacts Directory and Profile"
product: "client"
module: "clients"
route: "/clients and /clients/:id"
status: "In Review"
build_status: "Partly simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | CLIENTS |
| Route | `/clients` and `/clients/:id` |
| Status | In Review |
| Build status | Partly simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | One directory of every contact, split by category (Lead, Client, Supplier, Vendor and any category added), and a wide profile drawer for each contact. Contacts also enter the directory from six other places, each with its own matching rule. |
| **Who uses it** | Front-desk Staff (find, add and update contacts). Care Coordinator and Physician (read the profile and timeline). No role is checked: any signed-in user can delete, import and export. |
| **Where you start it** | **Clients** in the sidebar (`/clients`), a name link in the list, the Process board or a process drawer (`/clients/:id`), and **Add <Category>** (`/clients/new`). |
| **Where the result goes** | The shared contact store that the patient portal, the kiosk, Chats, Appointments, Invoices and the Process board all read. Profile edits show in the patient portal. |
| **How real is it** | 0 features work, 3 are partly simulated, 0 are not built. See the legend below. |

**Build-status legend used on every row of this PRD**

| Mark | Meaning |
| :--- | :--- |
| ● Works | Behaves as described in the prototype. |
| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |
| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Profile sync and active patient | The patient portal reads the same contact store, so edits to phone, email or name show there. There is no emergency contact field. Opening any profile also makes that contact the portal's active patient in the same browser (G2-E-17). | [View Companion Today](/companion/today) |
| Companion | Portal self-registration | A new patient who registers in the portal becomes a contact with no duplicate check and placeholder email, phone and location when left blank. | [View Companion Today](/companion/today) |
| AI Receptionist | Kiosk walk-in | An approved walk-in creates a contact, or updates one that matches by name and phone (or name alone when a phone is missing). Source is "Walked In". | [View Kiosk Walk-in](/ai-receptionist/checkin/walk-in) |
| Client (Web Forms) | Create submitter as client | A submit in the form Preview or Test page can create or update a contact, matched by email or phone. The write goes to session storage only, so the contact may not appear here (G2-E-13). | [View Web Forms](/client/web-forms) |
| Client (Chats) | Website chat and Webmail | The website chat widget creates or matches a contact by phone, email or name alone (G2-E-14). Webmail has a "create contact" action with the kiosk matching rule. | [View Website Chat](/client/chat/website) |
| Client (Appointments) | Appointments tab | The tab lists appointments matched by email, phone, contact id or name, so another patient with the same name shows up (G2-E-19). | [View Appointments](/client/appointments/list) |
| Client (Invoices) | Invoices tab | Lists the contact's invoices, with Add Payment, View Invoice and Delete / Void. Creating one needs an invoice automation. | [View Invoices](/client/invoices) |
| Client (Scribe) | Scribe in the timeline | The composer can start a consultation. **Fill with AI** copies scribe notes, diagnosis, chief complaint and symptoms into contact fields. | [View Scribe](/client/scribe) |
| Client (Process) | Process assignment | **Assign Process** writes a process log entry and creates or updates a deal card on the Process board. | [View Process Board](/client/processes/kanban) |
| Client (Claims) | Claims tab | Not connected. The profile has no Claims, Calls, Chats or Tasks tab. | [View Claims](/client/claims) |

## 1. Module Summary

### The story in one minute

Meera Iyer is at the front desk when Sarah Johnson calls to move her appointment. Meera opens **Clients**, which shows the "Contacts" page on the Leads category. She switches the dropdown to **Client** and types "Sarah" in the search box. One row appears. She clicks the name and a wide drawer slides over the list. The Overview tab shows Sarah's contact details on the left and her activity timeline on the right. Meera opens the Appointments tab, finds the visit and reschedules it. Later that day a stranger named Sarah Johnson chats with the website widget. The widget matches by name alone, so those messages land on the real Sarah's record. Meera notices because the timeline shows a conversation she did not expect.

**Naming note:** the sidebar says "Clients", the page header says "Contacts", the not-found screen says "Client not found" and the earlier PRD said "Patients". Decision needed: D-01.

### What is real and what is not

- **Real in the prototype:** the category dropdown with counts, search, the table and its paging, opening a profile, inline field editing, the activity timeline, the Forms, Product/Services tabs, process assignment, and a real export file.
- **Simulated:** CSV import, Schedule Call and Trigger Calls (only a toast), Send Invite (opens the portal login on the staff member's own machine), webhook import (not saved), saved filters (no handler), and several filters that change nothing. Each entry point matches duplicates by its own rule, and the website widget can merge strangers.
- **Not built:** search by date of birth or MRN, an Archived view, structured diagnoses, medications and vitals, insurance policies, Claims, Calls, Chats and Tasks tabs, role control, and the staff cards for deleting face data.

### Journey position

```
Web form / Kiosk walk-in / Website chat / Portal / Manual ─▶ Contact store ─▶ Directory ─▶ Profile ─┬▶ Appointments tab
                                                                                                    ├▶ Invoices tab
                                                                                                    └▶ Scribe, Documents, Forms
```

## 2. Feature Requests

### F-1: Contacts directory, search, filters and bulk actions

#### 1. What it does
Meera opens `/clients` and sees the "Contacts" page. A top bar holds the category dropdown (it starts on Leads), a search box, a filter button, **Import**, **Export** and **Add <Category>**. The table shows Name, Email, Phone, Source, Responsible, Last Contact and Status, 20 rows at a time. A row menu holds **View Contact**, **Send Invite**, **Call** and **Delete**. Selecting rows adds **Trigger Calls** and **Delete Selected**. A **How Contacts Work** help button explains the page.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Category dropdown | Dropdown | Lists Lead, Client, Supplier, Vendor and added categories with a live count. Choosing one filters the table and returns to page 1. A contact with no category counts as Lead | ● Works | Old PRD tabs Leads, Patients and Archived became this dropdown |
| F-1.2: Add Category | Modal | A name, saved for every user of this browser, becomes the active view | ● Works | Duplicates that differ only in case are dropped silently. No role check. Decision needed: D-25 |
| F-1.3: Search | Search | Matches name, email, phone, category or company on every keystroke | ● Works | |
| F-1.4: Filter modal | Modal | Presets All, Active and Inactive, plus Name, Responsible, Status, Created on, Processes, Last Contact and optional fields | ◐ Simulated | Only name, responsible, status, processes and last contact change the list. The Active and Inactive presets, Created on and the optional fields do nothing (G2-E-01, G2-E-02) |
| F-1.5: Save filter | Button | No handler | ○ Not built | (G2-E-03). Decision needed: D-25 |
| F-1.6: Table and paging | Table | Seven columns, 20 rows per page, row selection, Status badge | ● Works | The Pending badge exists but nothing sets it. Decision needed: D-01 |
| F-1.7: View Contact | Row action | Opens `/clients/<id>` over the list | ● Works | |
| F-1.8: Send Invite | Row action | Opens the patient portal login for that contact in a new tab on the staff member's own machine | ◐ Simulated | Nothing is sent. A finished invite modal exists but is not used (G2-E-05). Decision needed: D-28 |
| F-1.9: Call and Schedule Call | Drawer | Calendar and time, with a warning when the contact has no phone | ◐ Simulated | Confirm only shows a toast. No call or schedule is created (G2-E-06) |
| F-1.10: Row Delete | Row action | Removes the contact at once | ◐ Simulated | No confirmation (G2-E-04). Seed contacts return after deletion (G2-E-12). Decision needed: D-13 |
| F-1.11: Trigger Calls | Bulk action | Immediate or scheduled, confirm disabled until a date and time are set | ◐ Simulated | Only a toast (G2-E-06) |
| F-1.12: Delete Selected | Bulk action | Asks for a browser confirmation, then removes the rows | ● Works | |
| F-1.13: Import, CSV tab | Drawer | Accepts only a CSV file, then toasts "Importing…" | ◐ Simulated | Nothing is parsed and no contact is created. Download template gives no file (G2-E-07). Decision needed: D-26 |
| F-1.14: Import, Webhook tab | Form | Builds webhook configs with label, process, stage, fields, API key and method, and a copyable URL | ◐ Simulated | Configs are lost on reload and the first has a hardcoded "Production Key" (G2-E-08) |
| F-1.15: Import, Integration tab | Tab | Shared integrations component | ◐ Simulated | Unverified |
| F-1.16: Export | Modal | Excel or CSV, all or selected fields, a date range on Last Contact, then a real file | ◐ Simulated | Exports every contact, ignoring category, search and selection, for any signed-in user, with no audit entry (G2-E-09). Decision needed: D-13, D-26 |
| F-1.17: Empty state | State | "No clients found matching your filters." | ● Works | |
| F-1.18: Loading and error states | State | None exist | ○ Not built | Data is local |
| F-1.19: Role control | Rule | Any signed-in user can delete, import, export and add categories | ○ Not built | Decision needed: D-13 |
| F-1.20: Search by date of birth or patient ID, 200 ms debounce | Search | Described in the earlier PRD | ○ Not built | The contact has no date of birth or MRN field |
| F-1.21: Archived view | Tab | Described in the earlier PRD | ○ Not built | Only Delete exists. Decision needed: D-01 |

#### 3. Worked example
Meera looks for a caller.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The page opens on Leads | Switches the dropdown to **Client** and types "Sarah" | **The table keeps rows whose name, email, phone, category or company contains "Sarah"** |
| 2 | Manager asks for a list | Presses **Export** and picks CSV | **A file with every contact in the database downloads, not just the Client category** |
| 3 | Meera tries the **Active Contacts** preset | Applies it | **The list does not change** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front-desk Staff | When a patient calls the clinic, I want to find their contact by name, phone or email, so that I have their details on screen. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** the directory, **when** the user types in search, **then** the table keeps contacts whose name, email, phone, category or company contains the text. |
| F-1-2 | **Given** a category is chosen, **then** only contacts of that category show. A contact with no category shows under Lead. |
| F-1-3 | **Given** Export is used, **then** the file holds all contacts whatever the visible filter. |
| F-1-4 | **Given** a row's Delete is pressed, **then** the contact is removed with no confirmation. Delete Selected asks first. |
| F-1-5 | **Given** a CSV is imported, Schedule Call or Trigger Calls is confirmed, **then** only a toast shows and nothing is created. |
| F-1-6 | **Given** no row matches, **then** "No clients found matching your filters." shows. |

### F-2: Create a contact and match duplicates, from every entry point

#### 1. What it does
Contacts enter the store from several places. Meera adds one by hand with **Add Client**, which opens the profile in new mode. Elsewhere, the kiosk, Webmail, the website widget, the patient portal and the web form each create contacts by themselves. Each applies its own rule to decide whether a person already exists.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Manual create | Drawer | Save Contact needs only a name ("Please enter a client name"). No duplicate check | ◐ Simulated | ID is random `CL-100` to `CL-999` and can clash, so two people may share one URL (G2-E-10, G2-E-11) |
| F-2.2: Manual defaults | Rule | Category from the page, status Active, responsible "Unassigned", stage "Initial Contact" if a process is chosen, current layout and custom fields saved, activity "Client got created" | ● Works | |
| F-2.3: Kiosk walk-in | Hand-off | Match by id, else by normalised name and last 10 phone digits, or by name alone when a phone is missing. A match is updated and moved to the top. Process is the default appointment process, stage "Client Checked In" | ◐ Simulated | A second record can still be created on approve (G2-E-11). Decision needed: D-22 |
| F-2.4: Webmail create contact | Action | Same rule as the kiosk. Source "Email Inquiry", chosen process and stage | ◐ Simulated | (G2-E-11) |
| F-2.5: Website chat widget | Hand-off | Matches by phone digits or email or name alone. Category from the widget (default Lead), no process, id `CL-SIM-<time>` | ◐ Simulated | Name alone can attach a stranger to a real person's record (G2-E-14). Saved to session storage only, so the contact may not show here (G2-E-13) |
| F-2.6: Portal self-registration | Hand-off | No required field, no dedupe, random id, three processes assigned, stage "Client Checked In" | ◐ Simulated | Blank fields get "<name>@example.com", "5551234567" and "New York, NY" (G2-E-15, G2-E-10) |
| F-2.7: Web form submitter | Hand-off | With "Create submitter as client profile" on, matches by email or phone digits, exact | ◐ Simulated | No contact category. Session storage only (G2-E-11, G2-E-13) |
| F-2.8: Process assignment effects | Rule | Assigning a process writes a process log entry and a deal card "<Name> - <Process>". Field edits emit events for automations | ● Works | |
| F-2.9: Custom fields | Rule | Sections and fields come from the Field Registry for the active organisation. Users can add fields and mark one required inline | ◐ Simulated | Required fields show an asterisk but nothing enforces them (G2-E-16) |
| F-2.10: Category and status edits | Rule | Each saves at once on the profile. No archive state | ● Works | Seed contacts CL-001 and up return after deletion and their seed category overwrites edits (G2-E-12). Decision needed: D-29 |
| F-2.11: CSV and webhook import creating contacts | Import | Described in the earlier PRD and the Import drawer | ○ Not built | See F-1.13. Decision needed: D-26 |
| F-2.12: Required Name, Phone, Email, DOB, Gender | Rule | The earlier PRD required all five | ○ Not built | Only Name is required. Decision needed: D-24 |
| F-2.13: Duplicate-phone block or warning | Rule | Described in the earlier PRD | ○ Not built | Manual create never warns. Decision needed: D-22 |
| F-2.14: Emergency contact sync | Field | Described in the earlier PRD | ○ Not built | The contact has no emergency contact field |

#### 3. Worked example
A website visitor and a real patient share a name.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A visitor named Sarah Johnson uses the website widget with a different phone and email | Sends a first message | **The widget attaches the chat to the existing Sarah Johnson record** |
| 2 | Meera adds a new walk-in with the same name and no phone | Saves | **Manual create has no check, so a second Sarah Johnson exists** |
| 3 | The same Sarah registers in the portal | Registers with blank phone | **A new contact is created with placeholder phone and email** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Front-desk Staff | When a new person arrives from any channel, I want one contact per person, so that their history stays together. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** Add Client, **when** only a name is entered, **then** the contact saves. Without a name, "Please enter a client name" shows. |
| F-2-2 | **Given** the website widget, **when** a visitor's name matches an existing contact, **then** the chat attaches to that contact even if phone and email differ. |
| F-2-3 | **Given** a kiosk walk-in, **when** name and last 10 phone digits match, **then** the contact is updated, not duplicated. |
| F-2-4 | **Given** portal registration with blank fields, **then** a contact is created with placeholder email, phone and location. |
| F-2-5 | **Given** a field is marked required, **when** it is empty, **then** Save Contact still succeeds. |

### F-3: Contact profile drawer

#### 1. What it does
Meera clicks Sarah's name and the profile opens in a wide drawer over the list. The header has an initials avatar, the name, a status badge, a **Category** badge, **Send Invite** and close. Seven tabs follow: **Overview**, **Processes**, **Forms**, **Appointments**, **Invoices**, **Documents** and **Product/Services**. Each field on Overview saves when edited.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Open and not found | Drawer | Opens over the list. An unknown id shows "Client not found" with a back link | ● Works | |
| F-3.2: New mode | Drawer | `/clients/new` shows "Add New Contact", a "New Contact" badge and **Save Contact** | ● Works | See F-2.1 |
| F-3.3: Overview sections | Sections | Contact Details, Company and Professional, and organisation custom sections. Drag to reorder, edit inline | ● Works | No validation, email format is not checked. Moving sections saves the layout for all contacts. Decision needed: D-25 |
| F-3.4: Activity timeline | Timeline | Newest first, filter tabs per process, composer for Comment, WhatsApp, Call, SMS, Email, Appointment, Scribe | ◐ Simulated | Call Again and Cancel Appointment only add a log entry (G2-E-25). Seed contacts CL-001 to CL-012 show sample entries. A missing id writes to CL-001 (G2-E-26) |
| F-3.5: Processes tab | Tab | Lists processes with a stage bar and the Process Detail drawer. **Assign Process** adds a process and stage | ◐ Simulated | Edit says "coming soon". Delete says "Process entry removed" but removes nothing. With no log, status comes from sample deals and "Apr 10, 2024" (G2-E-18, G2-E-23) |
| F-3.6: Forms tab | Tab | Forms (submissions with status, sent, submitted) and Form Flows, each searchable | ● Works | |
| F-3.7: Appointments tab | Tab | Search, process filter, Reschedule, Mark as Complete, No Show, Cancel / Delete. Booking is blocked until the process has an appointment automation | ◐ Simulated | Matches by email, phone, id or name, so same-name patients appear (G2-E-19). Cancel / Delete removes the record with no confirmation (G2-E-20) |
| F-3.8: Invoices tab | Tab | Lists invoices with Add Payment, View Invoice, Delete / Void. Creating needs an invoice automation | ◐ Simulated | No confirmation on Delete / Void. Process ID can read "PROC-INV-01" (G2-E-21) |
| F-3.9: Documents tab | Tab | Generate from template, upload, preview, download, delete, manage templates | ◐ Simulated | Deletes have no confirmation (G2-E-22) |
| F-3.10: Product/Services tab | Tab | Assign from the catalogue, remove, or create a product and assign it | ● Works | Remove has no confirmation |
| F-3.11: Fill with AI | Action | Copies scribe notes, diagnosis, chief complaint and symptoms into contact fields | ◐ Simulated | The scribe content is a preset (see Scribe) |
| F-3.12: Portal active patient | Rule | Opening a profile or assigning a process makes that contact the patient portal's active patient in the same browser | ◐ Simulated | (G2-E-17) |
| F-3.13: Face check-in and visit journey cards | Cards | Built, but mounted nowhere | ○ Not built | Staff cannot withdraw consent or delete face data here (G2-E-24) |
| F-3.14: Claims, Calls, Chats and Tasks tabs | Tabs | Reached only through timeline entries | ○ Not built | Decision needed: D-27 |
| F-3.15: Diagnoses, medications, vitals, insurance, encounter timeline | Data | Described in the earlier PRD | ○ Not built | Only scribe-filled free text exists |
| F-3.16: Role control | Rule | Every tab and action is open to any signed-in user | ○ Not built | Decision needed: D-13 |

#### 3. Worked example
Meera prepares for Sarah's visit.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The list is open | Clicks **Sarah Johnson** | **The drawer opens on Overview with details and the timeline** |
| 2 | She checks the visit | Opens **Appointments** | **Sarah's appointments show, plus any other patient named Sarah Johnson** |
| 3 | She edits Sarah's phone | Types a new number | **It saves at once and the portal reads the same number** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Front-desk Staff | When a patient calls, I want their details, visits and bills in one place, so that I can answer without switching screens. |
| F-3-J2 | Physician | When preparing for a visit, I want the contact's timeline, forms and documents, so that I know what happened before. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** a contact, **when** the profile opens, **then** the timeline shows newest first. |
| F-3-2 | **Given** a field is edited on Overview, **then** it saves at once with no validation. |
| F-3-3 | **Given** two patients share a name, **when** one profile's Appointments tab opens, **then** both patients' appointments are listed. |
| F-3-4 | **Given** Cancel / Delete on an appointment, **then** it is removed with no confirmation and no slot is released. |
| F-3-5 | **Given** a profile opens, **then** that contact becomes the patient portal's active patient in the same browser. |
| F-3-6 | **Given** an unknown contact id, **then** "Client not found" shows. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Contacts directory | F-1.1 – F-1.21 | ● / ◐ / ○ | Search and categories work; import, calls and invite are simulated. |
| F-2 | Create and match contacts | F-2.1 – F-2.14 | ◐ / ● / ○ | Six entry points, six matching rules. |
| F-3 | Contact profile drawer | F-3.1 – F-3.16 | ● / ◐ / ○ | Inline editing works; tabs match by name and delete unconfirmed. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front-desk Staff | Find a contact by name, phone or email | F-1 |
| 2 | Front-desk Staff | Keep one contact per person across channels | F-2 |
| 3 | Front-desk Staff | See details, visits and bills in one place | F-3 |
| 4 | Physician | See the contact's timeline, forms and documents before a visit | F-3 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | Open, search, add, edit, delete and bulk delete contacts, add categories, import, export the whole database, use every profile tab | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD names the Receptionist and Physician as users and promised export "under HIPAA compliance controls". No role is defined. Decision needed: D-13.

## 5. Metrics and definitions

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Category count | Dropdown badge | Contacts whose category matches, ignoring case. Unknown categories count as Lead |
| Results count | Top bar | Contacts left after category, search and filters |
| Activity count per process tab | Timeline tabs | Entries for that process, All is every entry |
| Forms and Form Flows badges | Forms tab | Count of this contact's submissions and flow rows |
| Last activity on a sample deal | Processes tab | **Hardcoded, formula undefined** ("Apr 10, 2024") |
| Invoice Balance | Invoices tab | Owned by Invoices |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| Web form → **Client** → Process → Task | Form submit to client | Created or updated by email or phone. Session storage only, so it may not show in the directory. No contact category. |
| | Submit to Forms tab | The submission appears on the client's Forms tab. No timeline event. |
| | Client to Process | A text stage only. No process log row, no deal card. |
| | Website chat to client | Matched by phone, email or name alone. Category from the widget, no process. |
| Kiosk check-in → Appointment → Billing | Walk-in approval | Creates or updates a client by name and phone. A second record can still appear. |
| Patient portal ↔ Appointments / Invoices | Self-registration | Creates a contact with no duplicate check and placeholder data. |
| | Profile Appointments and Invoices tabs | Pull appointments (matched by name too) and invoices into the contact. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-01 | Which names are canonical (Clients, Contacts, Patients), and are Archived and Pending real statuses? | Naming note, F-1.6, F-1.21 |
| D-13 | Which roles may delete, bulk-delete, import, export, add categories and mark fields required, and must exports be audited? | F-1.10, F-1.16, F-1.19, F-3.16 |
| D-22 | What is the single matching rule for every entry point, and should manual create warn about an existing contact? | F-2.3, F-2.13 |
| D-24 | What is the minimum required field set to create a contact? | F-2.12 |
| D-25 | Are categories, saved filters and section layouts org-wide or per user? | F-1.2, F-1.5, F-3.3 |
| D-26 | What are the CSV import rules, and does export cover the current filter or the whole database? | F-1.13, F-1.16, F-2.11 |
| D-27 | Should the profile have Claims, Calls, Chats and Tasks tabs? | F-3.14 |
| D-28 | Should Send Invite go through email, SMS or WhatsApp, and should staff open the portal for a patient? | F-1.8 |
| D-29 | Should seed and demo contacts be deletable and editable like any other? | F-2.10 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
