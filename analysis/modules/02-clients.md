# G2 — Clients (Contacts list + client profile) — Gap Analysis
_Sources:_ PRD files `content/client/clients.md` | Prototype routes `/clients`, `/clients/:id` (incl. `/clients/new`) → `src/app/pages/Clients.tsx`, `src/app/pages/ClientProfile.tsx`, `src/app/components/activity/ActivityTab.tsx`, `src/app/components/contacts/ContactDetailDrawer.tsx`, `src/app/components/clients/*`, `src/app/components/profile/DocumentsTab.tsx`, `src/app/components/profile/DraggableOverviewSections.tsx`, `src/lib/clientsStore.ts`, `src/lib/clientProcessState.ts`, `src/lib/contactCategoriesStore.ts`, `src/lib/websiteChatSimulator.ts`, `src/data/canonicalClients.ts`, `src/app/components/common/DataExportModal.tsx`; entry points followed as cross-references: `src/reception/lib/api/mockMaClient.ts`, `src/app/components/chats/WebmailView.tsx`, `src/app/pages/patient/PatientLoginScreen.tsx` | Analysed 2026-11-12

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| L. Contacts directory (`/clients`) | 2 | 0 | 8 | 4 | 2 | 9 | 14.3% |
| C. Contact creation, matching & lifecycle (all entry points) | 1 | 0 | 6 | 1 | 1 | 8 | 12.5% |
| P. Contact profile drawer (`/clients/:id`, `/clients/new`) | 2 | 5 | 6 | 1 | 2 | 10 | 32.1% |
| **Total** | **5** | **5** | **20** | **6** | **5** | **27** | **20.8%** |

Overall coverage: 20.8% · PRD-backed coverage: 20.8% (all three sub-modules are covered by `clients.md`)

## Route map
| Route | Page file | PRD file |
| :--- | :--- | :--- |
| `/clients` | `src/app/pages/Clients.tsx` (routes.tsx:223-228) | `content/client/clients.md` (F-1) |
| `/clients/:id` (child route; rendered as a drawer over the list through the list page's outlet) | `src/app/pages/ClientProfile.tsx` | `content/client/clients.md` (F-2) |
| `/clients/new?type=<category>` (same route, "new" mode) | `src/app/pages/ClientProfile.tsx` (ClientProfile.tsx:400, 976-1031) | `content/client/clients.md` (F-1.3) |
| Embedded profile used by other modules | `src/app/components/contacts/ContactDetailDrawer.tsx` (wraps ClientProfile) | none |

Naming: client nav says "Clients" (navigation.ts:73-76), the sidebar menu store says "Contact" (SidebarMenuContext.tsx:48), the page header says "Contacts" (Clients.tsx:1529-1531), the profile's not-found state says "Client not found / Back to Clients" (ClientProfile.tsx:2233-2240), and the PRD says "Contact & Patient EHR Directory" / "Patients".

---

## A. Product map — as built

### A-L. Contacts directory (`/clients`)
**Purpose.** One directory of every contact, split by Contact Category (Lead, Client, Supplier, Vendor, plus categories users add). From here staff search, filter, open a contact, call, import and export.

**User roles.** No role gating. The route only requires a signed-in user (ProtectedRoute.tsx:4-12). Any signed-in user can add categories, delete contacts, bulk delete, import and export the full database.

**Screens.** Page header "Contacts" + "How Contacts Work" help; top bar with category dropdown, search, filter modal, Import, Export and "Add <Category>" (Clients.tsx:1520-1630); contacts table (Clients.tsx:2888-3013); Import drawer (CSV / Webhook / Integration) (Clients.tsx:3405-4033); Export modal (Clients.tsx:4036-4058); Schedule Call drawer (Clients.tsx:4060-4336); Trigger Calls modal (Clients.tsx:4338-4437); Add Category modal (Clients.tsx:5005-5076).

**Flows.**
1. **Open the directory.** The list loads every contact from the shared contact store and shows the "Leads" category by default (Clients.tsx:137, 1458-1462). There is no loading state, because data is local. If nothing matches, the table shows "No clients found matching your filters." (Clients.tsx:3011).
2. **Switch category.** The dropdown lists every Contact Category with a live count badge, then a "+ Add Category" item (Clients.tsx:1541-1599). Choosing one filters the table to contacts of that category and goes back to page 1.
3. **Add a category.** The user enters a name. Add is disabled while the name is empty, and Enter also submits. The category is saved for all users of this browser and becomes the active view (Clients.tsx:5034-5068; contactCategoriesStore.ts:14-55). Duplicates that differ only in case are dropped silently (contactCategoriesStore.ts:48-52).
4. **Search.** Free text matches name, email, phone, category or company name (Clients.tsx:1464-1471). Search runs on every keystroke with no debounce. The result count is passed to the top bar (Clients.tsx:1619).
5. **Filter.** The filter modal has three presets (All, Active and Inactive Contacts) and fields for Name, Responsible person (multi-select), Status, Created on (with a custom range), Processes (multi-select), Last Contact, plus optional Phone, Email, Location, Company, Role and Tags (Clients.tsx:1631-2180). Only name/search, responsible, status (from the dropdown), processes and last contact actually change the list (Clients.tsx:1473-1512). The Active/Inactive presets, Created on and the optional fields do nothing (see E-01, E-02). "Save filter" is not wired up (E-03).
6. **Read the table.** Columns are Name (a link to the profile), Email, Phone (country code + number), Source, Responsible, Last Contact and Status (Clients.tsx:2890-2948). Status shows as an Active/Pending/Inactive badge. The table pages 20 rows at a time and supports row selection (Clients.tsx:3002-3012).
7. **Row actions.** View Contact opens the profile. Send Invite opens the patient-portal login, pre-filled for that contact, in a new tab on the staff member's own machine; nothing is sent (E-05). Call opens the Schedule Call drawer (calendar, time, a warning and disabled confirm when the contact has no phone). Confirming only shows a toast (E-06). Delete removes the contact at once, with no confirmation (E-04) (Clients.tsx:2951-2980, 4283-4335).
8. **Bulk actions** (with one or more rows selected). Trigger Calls offers "immediate" or "scheduled" (confirm is disabled until a date and time are set). It only shows a toast (E-06). Delete Selected asks for a browser confirmation, then removes the rows (Clients.tsx:2981-2998, 4338-4437).
9. **Import.** CSV tab: download template, drag-and-drop or pick a file (anything that is not a CSV is rejected with "Please upload a CSV file"), Import. Nothing is parsed and no contacts are created; a toast says "Importing…" (E-07) (Clients.tsx:995-1010, 1385-1397). Webhook tab: the user builds one or more webhook configs (label, process, stage, accepted fields, API key, GET/POST), which produce a copyable URL and request preview. The configs are not saved and the API key is pre-filled (E-08) (Clients.tsx:220-325, 3559-3992). Integration tab: shared integrations component (Clients.tsx:3994-3997).
10. **Export.** The user picks Excel or CSV, all fields or selected fields (Name, Email, Phone, Status, Processes, Stage, Responsible, Last Contact, Location, Company, Job Position, Country) and a date range on Last Contact date (default: up to today), then downloads a real file (Clients.tsx:4036-4058; DataExportModal.tsx:66-135, 146-270). The export takes **every** contact, not just the visible category, search or selection, and there is no permission check or audit entry (E-09).
11. **Add contact.** "Add <Category>" goes to the profile drawer in new mode with that category pre-selected (Clients.tsx:1625-1630). See A-C.

**Business rules.**
- A contact with no category is treated as "Lead" for counts and filtering (Clients.tsx:156-160, 1459).
- The predefined categories are Lead, Client, Supplier and Vendor. User-added categories are stored per browser (contactCategoriesStore.ts:14-19, 21).
- Status values in use are Active and Inactive. Pending has a badge style but no way to set it (Clients.tsx:2936-2944; canonicalClients.ts seed).

**KPIs & metrics.**
| Name | Where shown | Formula | Citation |
| :--- | :--- | :--- | :--- |
| Category count badge | Category dropdown | Number of contacts whose category matches (case-insensitive); unknown categories count as Lead | Clients.tsx:151-162 |
| Results count | Top bar | Number of contacts left after category, search and active filters | Clients.tsx:1619 |

**Cross-module references.** Processes multi-select uses the process list (ProcessStageSelect); Responsible uses the team store (Clients.tsx:528-541); Integration import tab is shared (ImportIntegrationsTab); Send Invite → patient portal login (`/patient/login?clientId=`).

### A-C. Contact creation, matching & lifecycle
**Purpose.** Contacts enter the shared contact store from six places. Each one uses a different matching rule.

**User roles.** No role gating at any entry point.

**Entry points and rules (as built).**
| Entry point | Required fields | Match/dedupe rule | Defaults written | Citation |
| :--- | :--- | :--- | :--- | :--- |
| Manual (profile drawer, new mode) | Name only | None | ID random `CL-100…999`; category from URL/selection; status Active; responsible "Unassigned"; stage "Initial Contact" if processes chosen else "Unassigned"; current layout + custom-field values saved; activity "Client got created" | ClientProfile.tsx:976-1031 |
| Kiosk / AI receptionist check-in | Name | Match by ID; else by normalised name + last 10 phone digits; name alone if either side has no phone. A match is updated and moved to the top | Process = default appointment process, stage "Client Checked In", responsible = resolved doctor, source "Walked In" | clientsStore.ts:217-301; mockMaClient.ts:763-777, 1107-1115 |
| Webmail "create contact" | Name | Same as kiosk | Source "Email Inquiry", chosen process and stage | WebmailView.tsx:420-436 |
| Website chat widget | Name | Phone digits **or** email **or** name alone | Category from the widget (default Lead), **no process**, source "website", ID `CL-SIM-<time>` | websiteChatSimulator.ts:82-109; clientProcessState.ts:87-121 |
| Patient portal self-registration | none enforced | None | ID random `CL-100…999`; placeholder email/phone when blank; three processes assigned; stage "Client Checked In" | PatientLoginScreen.tsx:208-231 |
| CSV / webhook import | — | — | Not implemented (toast only) | Clients.tsx:995-1005 |

**Lifecycle.**
- Contact Category (Lead → Client etc.) is edited on the profile's Contact Details section (ClientProfile.tsx:777-813). Edits save straight away, field by field.
- Status (Active/Inactive) is edited the same way. There is no archive state.
- Delete exists only on the list. Profile edits sync to the patient portal because both read the same store (clientsStore.ts:197-215, 392-434). Opening a profile also makes that contact the portal's active patient (E-17).
- Seed contacts (CL-001…) always come back after deletion, and their seed category always overwrites edits (E-12).

**Custom fields.** Contact sections and fields come from the Field Registry (Settings/Admin), filtered to the active organisation (ClientProfile.tsx:443-569). Users can drag sections, add fields and mark a field required inline on the profile (DraggableOverviewSections.tsx:876, 945-952). Required fields get an asterisk, but nothing enforces them (E-16).

**Cross-module side effects of creation and process assignment.** Assigning a process (on creation via the old list path, or with "Assign Process" on the profile) writes a process log entry and creates or updates a Deal card "<Name> - <Process>" at stage "<Process>: <Stage>" (ClientProfile.tsx:1033-1129). Field edits emit "field updated" / "client updated" events for the automation rule engine (ClientProfile.tsx:815-846).

### A-P. Contact profile drawer (`/clients/:id`)
**Purpose.** A full contact record in a wide right-hand drawer over the directory.

**User roles.** No role gating. Every tab and every action is open to any signed-in user.

**Screens/tabs.** Header (initials avatar, name, status badge, "Category: X" badge, Send Invite or Save Contact, close) (ClientProfile.tsx:2256-2338). Tabs: Overview, Processes, Forms, Appointments, Invoices, Documents, Product/Services (ClientProfile.tsx:2343-2374).

**Flows.**
1. **Open.** Clicking a name (list, Deals, process drawer) opens `/clients/<id>`. If the ID is not found, a full page shows "Client not found" with a back link (ClientProfile.tsx:2228-2240).
2. **Overview tab.** Left: draggable sections (Contact Details: name, category, email, phone, location, country; Company & Professional; plus org-scoped custom sections). Each field saves when edited, with no validation (email format is not checked). Moving sections also saves the layout as the global default for all contacts (ClientProfile.tsx:885-910). Right: the Activity timeline (ActivityTab).
3. **Activity timeline.** Shows real activity-log entries for the contact, newest first. Seed contacts CL-001…CL-012 with no real activity show sample entries instead (ClientProfile.tsx:1932-1967). Filter tabs per process. Composer: Comment, WhatsApp (templates), Call, SMS, Email, Appointment, Scribe (ActivityTab.tsx:1665-1671). A comment must not be empty ("Please enter a comment or note") (ActivityTab.tsx:1749-1767). Per-entry menus: Schedule Follow-Up Call, Call Again, Reply, Reschedule, Cancel Appointment, Resend Form, Fill with AI, View Scribe. Call Again and Cancel Appointment only add a log entry (E-25). Call entries open the call detail drawer. "Fill with AI" copies scribe output (notes, diagnosis, chief complaint, symptoms) into contact fields (ClientProfile.tsx:848-883).
4. **Processes tab.** Lists each process the contact is in, combining the contact's processes with process-log entries, showing a stage bar. Row click / View opens the Process Detail drawer. "Assign Process" adds a process + stage (see A-C). Edit shows "coming soon"; Delete shows "Process entry removed" but removes nothing (E-18) (ClientProfile.tsx:2462-2875).
5. **Forms tab.** Two modes: Forms (submissions for this contact: template ID, form name, status, sent, submitted; click to view) and Form Flows (flow progress), each with a search (ClientProfile.tsx:1985-2030, 2877-3029).
6. **Appointments tab.** Lists appointments whose email, phone digits, **name** or contact ID match (ClientProfile.tsx:3031-3039). Search and process filter; actions Reschedule, Mark as Complete, No Show, Cancel/Delete. Cancel/Delete removes the appointment with no confirmation (E-20). Booking is blocked with "Please build an automation first…" until the selected process has an appointment automation (ClientProfile.tsx:3299-3301, 3325).
7. **Invoices tab.** Lists the contact's invoices (Invoice ID, Process ID, title, amounts, balance, status) with search and status filter. Actions: Add Payment (blocked with "Invoice is already paid or void" when relevant), View Invoice, Delete/Void (a draft is deleted, anything else is voided, with no confirmation, E-21). Creating an invoice is blocked until an invoice automation exists (ClientProfile.tsx:3423-3710, 3650-3652).
8. **Documents tab.** Generate from template, upload, preview, download, delete documents; manage templates. Deletes have no confirmation (E-22) (DocumentsTab.tsx:365-370, 736-742).
9. **Product/Services tab.** Lists services assigned to the contact (searchable by name, description or CPT code), assign from the catalogue, remove an assignment (no confirmation), or create a new product (name and currency required) and assign it (ClientProfile.tsx:3717-4050).
10. **New mode** (`/clients/new`). Same drawer, header "Add New Contact" / "New Contact" badge, Save Contact button. Save needs only a name ("Please enter a client name") (ClientProfile.tsx:976-979, 2308-2318).

**Business rules.**
- Activity order is newest first, with a tie-break rank per event type (ClientProfile.tsx:89-104, 1952-1967).
- Process status on the Processes list comes from the latest process log (Completed → Completed, Failed → On Hold, Pending → Pending, else In Progress). Without a log it falls back to the static sample deals (E-23) (ClientProfile.tsx:1663-1726).

**KPIs & metrics.**
| Name | Where shown | Formula | Citation |
| :--- | :--- | :--- | :--- |
| Activity count per process tab | Activity timeline tabs | Count of activity entries for that process ("All" = all) | ClientProfile.tsx:1969-1972 |
| Forms / Form Flows badges | Forms tab | Count of this contact's submissions / flow progress rows | ClientProfile.tsx:2880-2882 |
| "Last activity" on Processes list (when it comes from a sample deal) | Processes tab | **hardcoded – formula undefined** ("Apr 10, 2024") | ClientProfile.tsx:1713 |
| Invoice Balance | Invoices tab | Owned by the Invoices module (see G7) | ClientProfile.tsx:3519 |

**Cross-module references.** Processes/Deals (process logs, deal cards, Process Detail drawer); Appointments (appointment service, schedule drawer); Invoices (invoice context, invoice drawer, record payment); Documents (document and template stores); Services catalogue; Web Forms (submissions, flows); Chats (WhatsApp/email threads from activity); Telephony (call detail drawer); AI Scribe (new consultation, transcript drawer, fill fields); Automation (booking and invoicing need automations; field-update events); Patient portal (Send Invite, active patient sync). **Not present as tabs:** Claims, Chats inbox, Call logs list, Tasks.

---

## B. Product map — per PRD
_All references are `content/client/clients.md`._

**Purpose.** "Complete EHR demographic directory and clinical profile view": search patients, view clinical histories, triage leads versus active patients, export under HIPAA controls (§1 Module Summary).

**User roles.** Receptionist (find a chart by phone), Physician (review encounter timeline) (§F-1.4, §F-2.4). No permissions defined.

**Screens.** Directory with search and category tabs; quick registration modal; patient profile drawer (§F-1, §F-2).

**Flows.**
1. Typeahead search across name, phone, email, DOB and patient ID/MRN, debounced 200 ms, with sub-second results (§F-1.1, §F-1.5 F-1-1).
2. Quick tabs: Leads, Patients, Archived, each with a count badge (§F-1 What it does, §F-1.2).
3. New Patient Registration modal with Name, Phone, Email, DOB and Gender; validates duplicate phone (§F-1.3).
4. Clicking a patient opens a slide-over drawer with the directory still visible, tabs Overview, History, Documents, Processes (§F-2.1). Content: demographics, insurance policies, past appointments, active processes, clinical notes, form submissions (§F-2 What it does).
5. Clinical encounter timeline: consultations, vitals, prescriptions and billing events, with practitioner attribution, newest first (§F-2.2, §F-2.5 F-2-1).

**Business rules.** Duplicate phone blocked at registration (§F-1.3). Export under HIPAA controls (§1).

**KPIs.** None defined. Latency targets: 100 ms (worked example) and sub-second (AC).

**Cross-module.** Companion: contact edits (phone, email, emergency contact) sync to the Companion patient profile (§Cross-product Summary).

---

## C. Findings

### L. Contacts directory
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G2-L-01 | Flow | Search by name, phone, email | Matches | §F-1.1 | Clients.tsx:1464-1469 | Client-side substring match |
| G2-L-02 | Flow | Search also matches category and company | Missing in PRD | — | Clients.tsx:1470-1471 | |
| G2-L-03 | Flow | Search by DOB and patient ID/MRN; 200 ms debounce; sub-second SLA | PRD-only (not built) | §F-1.1, §F-1.5 | — | No DOB or MRN field exists on the contact record |
| G2-L-04 | Flow | Category switcher: PRD Leads / Patients / Archived tabs vs built dropdown Lead / Client / Supplier / Vendor + custom | Contradicts or stale | §F-1.2 | Clients.tsx:1541-1599; contactCategoriesStore.ts:14-19 | "Patients" is called "Client"; no Archived view |
| G2-L-05 | Flow | Users can add custom contact categories | Missing in PRD | — | Clients.tsx:5005-5076 | Per-browser storage, no role gating |
| G2-L-06 | Rule | Archive lifecycle / Archived list | PRD-only (not built) | §F-1 What it does | — | Only Delete exists |
| G2-L-07 | Rule | Status Active/Inactive shown and filterable | Missing in PRD | — | Clients.tsx:1476, 2933-2945 | |
| G2-L-08 | Flow | Advanced filter modal (presets, responsible, status, processes, created on, last contact, extra fields) | Missing in PRD | — | Clients.tsx:1631-2180 | Several controls are inert, see E-01..E-03 |
| G2-L-09 | Flow | Table columns, 20-row paging, row selection, empty state | Missing in PRD | — | Clients.tsx:2888-3012 | |
| G2-L-10 | Flow | Row actions View / Send Invite / Call / Delete | Missing in PRD | — | Clients.tsx:2951-2980 | Defects E-04, E-05, E-06 |
| G2-L-11 | Flow | Bulk Trigger Calls and Delete Selected (with confirm) | Missing in PRD | — | Clients.tsx:2981-2998 | |
| G2-L-12 | Flow | Import drawer: CSV / Webhook / Integration | Missing in PRD | — | Clients.tsx:3405-4033 | Defects E-07, E-08 |
| G2-L-13 | Flow | [SECURITY] Export (xlsx/csv, field pick, date range): PRD says "under HIPAA compliance controls"; built has no permission, audit or scope controls | Contradicts or stale | §1 | Clients.tsx:4036-4058 | See E-09 |
| G2-L-14 | Flow | Add contact: PRD quick modal (Name, Phone, Email, DOB, Gender) vs built full profile drawer in new mode | Contradicts or stale | §F-1.3 | Clients.tsx:1625-1630; ClientProfile.tsx:976-1031 | |
| G2-L-15 | Rule | Module naming: Clients / Contact / Contacts vs PRD Patients | Contradicts or stale | header, §1 | navigation.ts:74; Clients.tsx:1529 | Glossary decision |
| G2-L-16 | Metric | Category count badges | Matches | §F-1.2 | Clients.tsx:151-162 | Computed |
| G2-L-17 | Flow | Status presets don't filter | Prototype defect | — | — | see E-01 |
| G2-L-18 | Flow | Created-on and extra filter fields inert | Prototype defect | — | — | see E-02 |
| G2-L-19 | Flow | Save filter not wired | Prototype defect | — | — | see E-03 |
| G2-L-20 | Flow | Row delete without confirmation | Prototype defect | — | — | see E-04 |
| G2-L-21 | Flow | Send Invite sends nothing | Prototype defect | — | — | see E-05 |
| G2-L-22 | Flow | Schedule Call / Trigger Calls not persisted | Prototype defect | — | — | see E-06 |
| G2-L-23 | Flow | CSV import no-op | Prototype defect | — | — | see E-07 |
| G2-L-24 | Flow | [SECURITY] Webhook configs unsaved, pre-filled live key | Prototype defect | — | — | see E-08 |
| G2-L-25 | Flow | [SECURITY] Unscoped, unaudited export | Prototype defect | — | — | see E-09 |

### C. Creation, matching & lifecycle
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G2-C-01 | Rule | Required fields on manual create: PRD Name, Phone, Email, DOB, Gender vs built Name only | Contradicts or stale | §F-1.3 | ClientProfile.tsx:976-979 | |
| G2-C-02 | Rule | Duplicate-phone validation at registration | PRD-only (not built) | §F-1.3 | — | Manual create has no dedupe |
| G2-C-03 | Rule | Org-scoped custom sections and fields on the contact record, editable inline | Missing in PRD | — | ClientProfile.tsx:443-569; DraggableOverviewSections.tsx:876-952 | |
| G2-C-04 | X-ref | Kiosk / AI receptionist creates or updates contacts (name + phone match) | Missing in PRD | — | clientsStore.ts:217-301; mockMaClient.ts:763-777 | |
| G2-C-05 | X-ref | Webmail "create contact" | Missing in PRD | — | WebmailView.tsx:420-436 | |
| G2-C-06 | X-ref | Website chat auto-creates contacts with category, no process | Missing in PRD | — | websiteChatSimulator.ts:82-109; clientProcessState.ts:87-121 | |
| G2-C-07 | X-ref | Patient portal self-registration creates a contact | Missing in PRD | — | PatientLoginScreen.tsx:208-231 | |
| G2-C-08 | X-ref | Companion sync: profile edits visible in portal (shared store) | Matches | §Cross-product Summary | clientsStore.ts:197-215, 392-434 | Emergency contact field does not exist |
| G2-C-09 | Rule | Process assignment creates a process log + deal card; field edits emit automation events; creation logs activity | Missing in PRD | — | ClientProfile.tsx:999-1011, 1033-1129, 815-846 | |
| G2-C-10 | Rule | Random manual/portal IDs can collide | Prototype defect | — | — | see E-10 |
| G2-C-11 | Rule | Different dedupe rules per entry point | Prototype defect | — | — | see E-11 |
| G2-C-12 | Rule | Seed contacts undeletable; category edits revert | Prototype defect | — | — | see E-12 |
| G2-C-13 | Rule | Website contacts written to the wrong storage | Prototype defect | — | — | see E-13 |
| G2-C-14 | Rule | [SECURITY] Website chat name-only match | Prototype defect | — | — | see E-14 |
| G2-C-15 | Rule | Portal registration placeholder data, no dedupe | Prototype defect | — | — | see E-15 |
| G2-C-16 | Rule | Required custom fields not enforced | Prototype defect | — | — | see E-16 |
| G2-C-17 | Rule | [SECURITY] Viewing a profile switches the portal patient | Prototype defect | — | — | see E-17 |

### P. Contact profile drawer
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G2-P-01 | Flow | Profile opens as a slide-over drawer over the directory | Matches | §F-2.1 | routes.tsx:223-228; Clients.tsx:4940; ClientProfile.tsx:2256 | |
| G2-P-02 | Flow | Tab set: PRD Overview / History / Documents / Processes vs built Overview / Processes / Forms / Appointments / Invoices / Documents / Product/Services | Contradicts or stale | §F-2.1 | ClientProfile.tsx:2343-2374 | History lives inside Overview |
| G2-P-03 | Flow | Overview: draggable sections, inline autosave of each field | Missing in PRD | — | ClientProfile.tsx:2381-2416, 777-846 | |
| G2-P-04 | Flow | Timeline content: PRD clinical encounters (consults, vitals, prescriptions, billing, practitioner) vs built communication and process events + composer | Partial (PRD less detailed) | §F-2.2 | ClientProfile.tsx:2417-2455; ActivityTab.tsx:1665-1671 | Composer, per-entry actions not in PRD |
| G2-P-05 | Rule | Timeline is newest first | Matches | §F-2.5 F-2-1 | ClientProfile.tsx:1952-1967 | |
| G2-P-06 | Flow | Diagnoses, current medications, vitals, prescriptions as structured data | PRD-only (not built) | §F-2.3 | — | Only scribe-filled free-text fields |
| G2-P-07 | Flow | Insurance policies section | PRD-only (not built) | §F-2 What it does | — | |
| G2-P-08 | Flow | Processes tab with Assign Process and Process Detail drawer | Partial (PRD less detailed) | §F-2 "Active Processes" | ClientProfile.tsx:2462-2875 | |
| G2-P-09 | Flow | Forms tab (submissions + form flows) | Partial (PRD less detailed) | §F-2 "Form Submissions" | ClientProfile.tsx:2877-3029 | |
| G2-P-10 | Flow | Appointments tab (list, complete, no-show, reschedule, cancel; booking gated by automation) | Partial (PRD less detailed) | §F-2 "Past Appointments" | ClientProfile.tsx:3031-3421 | |
| G2-P-11 | X-ref | Invoices tab (list, pay, view, delete/void; create gated by automation) | Missing in PRD | — | ClientProfile.tsx:3423-3710 | |
| G2-P-12 | X-ref | Documents tab (generate, upload, preview, download, templates) | Partial (PRD less detailed) | §F-2.1 | ClientProfile.tsx:3712-3714; DocumentsTab.tsx | |
| G2-P-13 | X-ref | Product/Services tab | Missing in PRD | — | ClientProfile.tsx:3717-4050 | |
| G2-P-14 | X-ref | AI Scribe: new consultation, view transcript, fill contact fields | Missing in PRD | — | ClientProfile.tsx:848-883; ActivityTab.tsx:924-940 | |
| G2-P-15 | X-ref | Calls and chats reached only through activity entries (call detail, thread drawers); no Claims / Calls / Chats / Tasks tabs | Missing in PRD | — | ActivityTab.tsx:22-23; ClientProfile.tsx:2430-2433 | See Q-05 |
| G2-P-16 | Flow | "Client not found" state | Missing in PRD | — | ClientProfile.tsx:2228-2240 | |
| G2-P-17 | Flow | Process Edit/Delete are stubs | Prototype defect | — | — | see E-18 |
| G2-P-18 | X-ref | [SECURITY] Appointments matched by name | Prototype defect | — | — | see E-19 |
| G2-P-19 | Flow | Appointment delete unconfirmed, bypasses service | Prototype defect | — | — | see E-20 |
| G2-P-20 | Flow | Invoice delete/void unconfirmed; placeholder process ID | Prototype defect | — | — | see E-21 |
| G2-P-21 | Flow | Document/template delete unconfirmed | Prototype defect | — | — | see E-22 |
| G2-P-22 | Metric | Sample-deal fallback + hardcoded last activity | Prototype defect | — | — | see E-23 |
| G2-P-23 | Flow | [SECURITY] Face check-in / visit journey cards unmounted | Prototype defect | — | — | see E-24 |
| G2-P-24 | Flow | Activity Call Again / Cancel Appointment only log | Prototype defect | — | — | see E-25 |
| G2-P-25 | Flow | Header Send Invite sends nothing | Prototype defect | — | — | see E-05 |
| G2-P-26 | Rule | Activity writes default to CL-001 when ID missing | Prototype defect | — | — | see E-26 |

---

## D. Correct flow as built (PRD-ready)

---
title: "Contacts Directory & Contact Profile"
product: "client"
module: "clients"
status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-12"
---

| Product | CLIENT |
| Module | CLIENTS (Contacts) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion (patient portal) | Shared contact record | Edits to a contact's details are visible straight away in the patient's portal profile. "Send Invite" gives the patient a portal login link for their record. Decision needed: delivery channel for invites (see G2-Q-04). | [View in Companion](/companion/today) |
| AI Receptionist / Kiosk | Walk-in check-in | A check-in creates the contact or updates the matching one, and enrols it in the default appointment process at "Client Checked In". | — |
| Website Widget | Visitor submission | A visitor creates a contact in the chosen Contact Category with no process; the message appears on the contact's activity. | — |
| Chats (Webmail) | Create contact from email | Creates or updates a contact with source "Email Inquiry" in the chosen process/stage. | — |
| Process / Deals | Process enrolment | Assigning a process creates a process entry and a deal card "<Name> - <Process>". | /deals |
| Appointments, Invoices, Documents, Services, Web Forms, AI Scribe | Profile tabs | Each module's records for the contact are listed and actionable from the profile. | — |
| Automation | Field-change events | Every saved field change raises "client updated" for automation rules. Appointment booking and invoice creation need a matching automation. | /automation |

## 1. Module Summary
- Contacts is the single directory of everyone the practice deals with, segmented by **Contact Category**: Lead, Client, Supplier, Vendor, plus categories the practice adds.
- Staff search and filter the directory, open a contact's profile drawer, call or schedule calls, import and export.
- The profile drawer brings together the contact's details (including organisation-specific custom fields), activity timeline, processes, form submissions, appointments, invoices, documents and assigned services.
- Contacts are created manually or automatically from the kiosk/AI receptionist, website widget, webmail and patient-portal registration. All entry points use one matching rule (Decision needed, see G2-Q-01).
- Decision needed: which roles can delete, bulk-delete, import, export and manage categories/fields (see G2-Q-02).

## 2. Feature Requests

### F-1: Contacts Directory, Search, Category & Filters
#### 1. What it does
Lists contacts for the selected Contact Category with free-text search, an advanced filter modal, row actions and bulk actions.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Search | Search input | Matches name, email, phone, category and company | Runs as the user types |
| F-1.2: Category dropdown | Dropdown | Lead / Client / Supplier / Vendor + custom categories, each with a live count; default Lead | Contacts with no category count as Lead |
| F-1.3: Add Category | Modal | Adds a custom category (name required; case-insensitive duplicates ignored) and switches to it | Decision needed: org-wide or per user (see G2-Q-03) |
| F-1.4: Filter modal | Modal | Presets All / Active / Inactive; fields Name, Responsible, Status, Processes, Created on (incl. custom range), Last Contact; optional Phone, Email, Location, Company, Role, Tags; every field narrows the list; Reset; Save filter | Decision needed: saved-filter scope (see G2-Q-06) |
| F-1.5: Table | Table | Name (opens profile), Email, Phone, Source, Responsible, Last Contact, Status badge; 20 rows per page; row selection | Empty: "No clients found matching your filters." |
| F-1.6: Row actions | Menu | View Contact; Send Invite; Call (schedule a call, blocked when no phone); Delete (with confirmation) | |
| F-1.7: Bulk actions | Bar | Trigger Calls (now or at a scheduled date and time; confirm needs date and time when scheduled); Delete Selected (with confirmation) | Scheduled calls must appear in Call Logs/activity |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist looks up a caller | Types "5551234567" in search | **The matching contact appears in the current category; switching to the right category shows it if it is in another** |
| 2 | Manager finds inactive leads | Chooses preset "Inactive Contacts" | **Only Inactive contacts are listed** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Receptionist | When a contact calls, I want to find them by phone, so that I have their record on screen. |
| F-1-J2 | Practice manager | When I plan outreach, I want to filter by status, process and responsible person, so that I can call the right group in bulk. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Search matches name, email, phone, category and company. |
| F-1-2 | Every filter control (presets, Created on, optional fields) changes the result list and the results count. |
| F-1-3 | Single delete and bulk delete both ask for confirmation. |
| F-1-4 | Scheduling a call or triggering bulk calls creates call records that appear in Call Logs and on each contact's activity. |
| F-1-5 | Category counts equal the number of contacts in each category. |

### F-2: Contact Creation, Matching & Import
#### 1. What it does
Creates contacts manually, from other modules, or by import, while avoiding duplicates.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Manual create | Drawer (new mode) | "Add <Category>" opens the profile drawer with that category set; user fills Contact Details, custom fields and processes; Save Contact | Name required. Decision needed: other required fields (see G2-Q-07). Required custom fields must be filled |
| F-2.2: Matching rule | Rule | Decision needed: one rule for all entry points (see G2-Q-01) | |
| F-2.3: Auto-create sources | Rule | Kiosk/AI receptionist (source "Walked In"), website widget (category from widget, no process, source "website"), webmail (source "Email Inquiry"), patient-portal registration | Each one matches first, then creates |
| F-2.4: Unique IDs | Rule | Every new contact gets a unique sequential ID (CL-nnn) | |
| F-2.5: CSV import | Drawer | Download template; drop/pick a CSV (non-CSV rejected); Import creates contacts using the matching rule | Decision needed: error report format (see G2-Q-08) |
| F-2.6: Webhook import | Drawer | Configure label, process, stage, accepted fields, API key and method; copy the endpoint URL; configs are saved | API keys are generated per org, never pre-filled |
| F-2.7: Integration import | Drawer | Shared integrations tab | |
| F-2.8: Export | Modal | Excel/CSV; all or selected fields; date range on Last Contact | Decision needed: scope (all vs current view) and audit/permission (see G2-Q-02, G2-Q-09) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Walk-in already in the system | Patient checks in at the kiosk with same name and phone | **Existing contact is updated and moved to the top; no duplicate** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Receptionist | When a new person contacts us through any channel, I want one record per person, so that history is not split. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | All entry points apply the same matching rule. |
| F-2-2 | No two contacts share an ID. |
| F-2-3 | Contacts created from the website widget appear in the directory immediately. |
| F-2-4 | No placeholder email or phone is stored for a contact; blank stays blank. |

### F-3: Contact Profile Drawer
#### 1. What it does
Opens a wide slide-over drawer over the directory with the contact's header and tabs.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Header | Header | Initials, name, status badge, "Category: X" badge, Send Invite, close | Not-found state: "Client not found" + back link |
| F-3.2: Overview | Tab | Draggable sections (Contact Details, Company & Professional, org custom sections); each field saves on edit and raises "client updated"; Activity timeline beside it | Decision needed: layout per contact or global (see G2-Q-10). Email/phone format validation |
| F-3.3: Activity timeline | Panel | Newest first; filter by process; composer for Comment, WhatsApp, Call, SMS, Email, Appointment, Scribe; per-entry actions (Schedule Follow-Up, Call Again, Reply, Reschedule, Cancel Appointment, Resend Form, Fill with AI, View Scribe) | Call Again places a call; Cancel Appointment cancels the real appointment after confirmation |
| F-3.4: Processes | Tab | Process list with stage bar; Assign Process (process + stage → process entry + deal card); open Process Detail drawer; edit and remove an enrolment (with confirmation) | |
| F-3.5: Forms | Tab | Submissions and form-flow progress, searchable | |
| F-3.6: Appointments | Tab | This contact's appointments (matched by contact ID); reschedule, complete, no-show, cancel (with confirmation); booking needs an appointment automation for the process | |
| F-3.7: Invoices | Tab | This contact's invoices; add payment (not for paid/void), view, delete draft / void (with confirmation); creating needs an invoice automation | |
| F-3.8: Documents | Tab | Generate from template, upload, preview, download, delete (with confirmation) | |
| F-3.9: Product/Services | Tab | Assigned services; assign from catalogue; remove; create & assign (name and currency required) | |
| F-3.10: AI Scribe | Action | Start a consultation; fill contact fields (notes, diagnosis, chief complaint, symptoms) from scribe output | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff reviews a contact before a visit | Clicks the name in the directory | **Drawer opens over the list with Overview and the newest activity first** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Physician | When preparing for a visit, I want the contact's full timeline and records in one place, so that I understand their history. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | The activity timeline is newest first. |
| F-3-2 | Each tab shows only records linked to this contact's ID. |
| F-3-3 | Every destructive action in every tab asks for confirmation. |
| F-3-4 | Opening a contact profile does not change any patient-portal session. |

### Not yet built
| ID | Item | Source |
| :--- | :--- | :--- |
| NB-1 | Search by DOB and patient ID/MRN; 200 ms debounce; sub-second SLA | old PRD F-1.1 |
| NB-2 | Archive status and Archived view | old PRD F-1 |
| NB-3 | Duplicate-phone validation at registration (superseded by the matching rule, G2-Q-01) | old PRD F-1.3 |
| NB-4 | Structured clinical data: diagnoses, medications, vitals, prescriptions, practitioner attribution | old PRD F-2.2 |
| NB-5 | Insurance policies section | old PRD F-2 |
| NB-6 | Emergency contact field (Companion sync) | old PRD Cross-product |
| NB-7 | Staff UI for biometric face check-in consent and visit journey | FaceCheckinCard / VisitJourneyCard (built, not mounted) |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Contacts Directory, Search, Category & Filters | F-1.1–F-1.7 | Category-segmented directory with search, filters, row and bulk actions. |
| F-2 | Contact Creation, Matching & Import | F-2.1–F-2.8 | Manual and automatic creation under one matching rule, plus import and export. |
| F-3 | Contact Profile Drawer | F-3.1–F-3.10 | One drawer with details, activity and every module's records for the contact. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist | Find a caller by phone | F-1 |
| 2 | Practice manager | Filter and bulk-call a segment | F-1 |
| 3 | Receptionist | One record per person across channels | F-2 |
| 4 | Physician | Full history before a visit | F-3 |

---

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
| :--- | :--- | :--- | :--- | :--- |
| G2-E-01 | The "Active Contacts" / "Inactive Contacts" presets set a value the list filter never reads, so the list doesn't change. | Clients.tsx:1663-1673 (preset), 1476 (filter uses dropdown value only) | Medium | G2-L-17 |
| G2-E-02 | The Created on filter (incl. custom range) and the optional Phone/Email/Location/Company/Role/Tags inputs are not applied. The optional inputs are not even connected to state. | Clients.tsx:1850-1851, 2054-2066, 2145-2156; filter logic 1458-1512 | Medium | G2-L-18 |
| G2-E-03 | "Save filter" in the filter modal has no handler; the panel version only shows "coming soon". | Clients.tsx:2173-2179, 2879 | Low | G2-L-19 |
| G2-E-04 | Row Delete permanently removes a contact with no confirmation (bulk delete does confirm). | Clients.tsx:2974-2977, 984-987 | High | G2-L-20 |
| G2-E-05 | "Send Invite" (list row and profile header) opens the portal login in the staff member's own browser; no invite is sent. A finished Send Invite modal (copy link, email/SMS/WhatsApp) exists but is not used anywhere. | Clients.tsx:2959-2966; ClientProfile.tsx:2319-2327; SendInviteModal.tsx:31-45 | Medium | G2-L-21, G2-P-25 |
| G2-E-06 | Schedule Call (row) and Trigger Calls (bulk) only show success toasts; no call, schedule or activity is created. | Clients.tsx:1075-1087, 1440-1452 | High | G2-L-22 |
| G2-E-07 | CSV Import shows "Importing clients from …" but parses nothing and creates no contacts; "Download template" produces no file. | Clients.tsx:995-1010 | High | G2-L-23 |
| G2-E-08 | [SECURITY] Webhook import configs live only in page state (lost on reload), and the first config comes with a hardcoded "Production Key" value shown in the UI and the URL. | Clients.tsx:220-235, 304-322 | Medium | G2-L-24 |
| G2-E-09 | [SECURITY] Export downloads the entire contact database (all categories, ignoring search, filters and selection) for any signed-in user, with no audit entry. This contradicts the PRD's "HIPAA compliance controls". | Clients.tsx:4036-4058; ProtectedRoute.tsx:4-12 | High | G2-L-13, G2-L-25 |
| G2-E-10 | Manual and portal-created contacts get a random ID from only 900 values (CL-100…CL-999), which can clash with existing contacts. The profile then opens the first match, so two people share one URL. | ClientProfile.tsx:980; PatientLoginScreen.tsx:210 | High | G2-C-10 |
| G2-E-11 | Each entry point matches duplicates differently: manual = none; portal = none; kiosk/webmail = name + phone (or name alone); website = phone OR email OR name. The same person can be duplicated or wrongly merged depending on channel. | ClientProfile.tsx:976-1031; PatientLoginScreen.tsx:208-231; clientsStore.ts:225-238; websiteChatSimulator.ts:82-88 | High | G2-C-11 |
| G2-E-12 | Deleting a seed contact doesn't stick: the store re-adds every missing seed contact on the next read, and also resets a seed contact's category to its seed value, so category edits on seed contacts revert. | clientsStore.ts:121-144 | High | G2-C-12 |
| G2-E-13 | Website-widget contacts are written only to session storage, but the contact store reads local storage first. New website contacts may never show in the directory, and the next save from elsewhere overwrites them. | clientProcessState.ts:95-117; clientsStore.ts:58; websiteChatSimulator.ts:26-32 | High | G2-C-13 |
| G2-E-14 | [SECURITY] Website chat attaches a visitor to any existing contact with the same name, even when phone and email differ, so a stranger's messages land on another person's record. | websiteChatSimulator.ts:82-88 | High | G2-C-14 |
| G2-E-15 | Portal self-registration does no duplicate check and stores made-up values when fields are blank (email "<name>@example.com", phone "5551234567", location "New York, NY"). | PatientLoginScreen.tsx:208-226 | Medium | G2-C-15 |
| G2-E-16 | Fields marked required show an asterisk, but neither Save Contact nor inline edits enforce them; only Name is checked. | DraggableOverviewSections.tsx:876; ClientProfile.tsx:976-979 | Medium | G2-C-16 |
| G2-E-17 | [SECURITY] Opening any contact profile (and assigning a process) sets that contact as the patient portal's active patient in the same browser, so a portal session can switch to another person's record. | ClientProfile.tsx:735-743, 1117-1119, 1423-1424 | High | G2-C-17 |
| G2-E-18 | Processes tab: Edit shows "Edit coming soon"; Delete says "Process entry removed" but removes nothing and has no confirmation. | ClientProfile.tsx:2853-2867 | Medium | G2-P-17 |
| G2-E-19 | [SECURITY] The Appointments tab includes any appointment whose client name matches, so a contact's tab shows other patients' appointments that share the name. | ClientProfile.tsx:3034-3039 | High | G2-P-18 |
| G2-E-20 | Appointment "Cancel / Delete" hard-deletes the appointment straight from session storage (bypassing the appointment service, so no cancellation, slot release or activity), with no confirmation. | ClientProfile.tsx:1239-1246, 3410-3415 | High | G2-P-19 |
| G2-E-21 | Invoice "Delete / Void" runs with no confirmation; the Process ID column shows a made-up "PROC-INV-01" when none is linked. | ClientProfile.tsx:3691-3703, 3464 | High | G2-P-20 |
| G2-E-22 | Document delete and document-template delete run with no confirmation. | DocumentsTab.tsx:365-370, 736-742 | Medium | G2-P-21 |
| G2-E-23 | When there is no process log, the Processes list takes status and stage from a static sample deal list inside the page, with a hardcoded "Apr 10, 2024" last activity. | ClientProfile.tsx:326, 1651, 1705-1716 | Medium | G2-P-22 |
| G2-E-24 | [SECURITY] Staff cards for biometric face check-in (withdraw consent, delete face data) and visit journey are built but mounted nowhere, so staff cannot act on a patient's request to delete biometric data. | FaceCheckinCard.tsx:1-10; VisitJourneyCard.tsx:1-10 | Medium | G2-P-23 |
| G2-E-25 | Activity "Call Again" and "Cancel Appointment" only add an activity entry: no call is placed, the real appointment stays booked, and Cancel has no confirmation. | ActivityTab.tsx:806-818, 877-896 | Medium | G2-P-24 |
| G2-E-26 | When the contact ID is missing, the activity panel writes new entries to contact CL-001 (a real seed patient). | ClientProfile.tsx:2434 | Low | G2-P-26 |

Not logged as defects (dead code, not reachable): the legacy "Add Contact" modal, the old in-page profile drawer and its Edit/Send Message/Schedule/Update Stage modals, the inline filter panel and the 5,380-row mock pagination total in Clients.tsx (e.g. Clients.tsx:468, 1139-1235, 3016-3403). None of these can be opened from the UI.

## Open questions for PM
1. **G2-Q-01** — What is the single matching rule for every entry point (manual, kiosk, website, webmail, portal, import)? For example: exact phone (last 10 digits) OR exact email, never name alone. Should manual create warn and offer to open the existing contact? (G2-E-11, G2-E-14, G2-C-02, D F-2.2)
2. **G2-Q-02** — Which roles may delete, bulk-delete, import, export, add categories and mark fields required? Must exports be audited? (G2-E-09, G2-L-13, D §1)
3. **G2-Q-03** — Are custom Contact Categories org-wide (admin-managed) or per user? (G2-L-05, D F-1.3)
4. **G2-Q-04** — Send Invite: should it send through email/SMS/WhatsApp with a copyable link (the unused modal), and should staff ever open the portal for a patient? (G2-E-05)
5. **G2-Q-05** — Should the profile have Claims, Calls, Chats and Tasks tabs, or are activity entries enough? (G2-P-15)
6. **G2-Q-06** — Saved filters: per user or shared? (G2-E-03, D F-1.4)
7. **G2-Q-07** — Besides Name, which fields are required on manual create (phone? DOB/gender as in the old PRD)? (G2-C-01, D F-2.1)
8. **G2-Q-08** — CSV import: column mapping, duplicate handling and error report format? (G2-E-07, D F-2.5)
9. **G2-Q-09** — Should export cover the current category/filter/selection or the whole database? (G2-E-09, D F-2.8)
10. **G2-Q-10** — Should a section layout change on one contact apply to all contacts (as built) or only that contact? (D F-3.2)
11. **G2-Q-11** — Is "Patient"/"Client" the category name, and are "Archived" and "Pending" real statuses? Settle naming: Clients vs Contacts vs Patients. (G2-L-04, G2-L-06, G2-L-15)
12. **G2-Q-12** — Should seed/demo contacts be deletable and editable like any other? (G2-E-12)
