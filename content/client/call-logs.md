---
title: "Call Logs, Telephony Hub & AI Transcription"
product: "client"
module: "call-logs"
route: "/call-logs and /call-logs/:id"
status: "In Review"
build_status: "Simulated"
created_date: "2026-11-10"
last_updated: "2026-11-14"
---

| Product | CLIENT |
| Module | CALL-LOGS |
| Route | `/call-logs` and `/call-logs/:id` |
| Status | In Review |
| Build status | Simulated |
| Created | 2026-11-10 |
| Last updated | 2026-11-14 |

## At a glance

| | |
| :--- | :--- |
| **What it is** | A list of call and outreach rows, each tied to a client, a process and a stage. A row opens a Conversation Details drawer with a recording card, a summary, a transcript and a retry history. A second detail page at `/call-logs/:id` shows fixed content. |
| **Who uses it** | Front-desk Staff (follow up on calls). Practice Manager (reviews calls). No role is checked: any signed-in user can play recordings and read transcripts. |
| **Where you start it** | **Call Logs** in the sidebar. The same drawer also opens from a client profile, an appointment's details and the Process board. |
| **Where the result goes** | Nowhere beyond the page. Scheduled calls are not saved. Rows written by the kiosk and by processes feed this list, the Process board, the client profile, Overview and the patient portal status screen. |
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
| AI Receptionist (kiosk) | Walk-in registration, appointment booking and walk-in check-in | Each one writes a row for the client in the default process. The row is labelled "WhatsApp" with status In Progress because the kiosk passes no channel. | [View Kiosk Walk-in](/ai-receptionist/checkin/walk-in) |
| AI Receptionist (kiosk) | Scheduled check-in | The kiosk booking path writes a row at stage "Confirmed", updating the client's existing row if there is one. | [View Kiosk Scheduled Check-in](/ai-receptionist/checkin/scheduled) |
| Client (Workflows) | Process test chat and process entry | The Test Process chat and a stage move write or update a row for the client and process. There is no real telephony. | [View Workflows](/client/workflows) |
| Client (Process) | Stage change | A stage change on a row updates the client and deal records. The Process board and the client profile read and write the same store. | [View Process Kanban](/client/processes/kanban) |
| Client (Scribe) | Consultation notes | Separate page. Call Logs holds calls. Scribe holds consultation sessions. | [View Scribe](/client/scribe) |
| Client (Appointments) | Calls tab in an appointment | The appointment drawer lists calls by client, not by appointment. When the client has none it invents two sample completed calls. No call is linked to an appointment. | [View Appointments](/client/appointments/list) |
| Client (Clients) | Client profile | The profile opens the same Conversation Details drawer. | [View Clients](/client/clients) |
| Client (Overview) | Call statistics | Overview reads the same store. Reports carries its own static list of calls. | [View Overview](/client/overview) |
| Companion | Status screen | The patient portal status screen reads the same rows. | [View Companion Today](/companion/today) |

## 1. Module Summary

### The story in one minute

Meera Iyer opens **Call Logs** at the start of her shift. She sees one row for each client and process, with the previous stage, the last stage, a status badge, the date and the duration. She types "Sarah" and the list narrows to Sarah Johnson. She clicks the Call ID and the Conversation Details drawer slides in. She presses play and the bar jumps forward, but no sound is heard. The transcript shows a nine-line chat between an AI Assistant and Sarah. Meera notices that every call she opens reads the same. She presses **Schedule Call**, picks Sarah, a process and a time, and a Pending row appears at the top. When she refreshes, it is gone.

### What is real and what is not

- **Real in the prototype:** the list with search by client name, the rows written by the kiosk and by processes, the Conversation Details drawer opening from four screens, the Export modal and the empty state.
- **Simulated:** the recording player (no audio), the summary, the transcript and the retry history (the same fixed content for every call), the rating (not saved), Schedule Call, Trigger Calls and Cancel Scheduled (page memory only), Delete (a toast only), the advanced filter (applies nothing) and the whole `/call-logs/:id` page.
- **Not built:** click-to-dial, sortable columns, Phone and Assigned Process columns, Missed and Voicemail outcomes, intent tags, transcript search, the Call Review tab, staff versus AI attribution, any link from a call to an appointment or a task, and role control on recordings.

**Naming note:** the earlier PRD called the list a "VoIP call log stream" with Missed and Voicemail outcomes. The prototype shows Completed, Pending, Failed and In Progress, and its rows are one per client and process, not one per call. Decision needed: D-83, D-85.

### Journey position

```
Call / kiosk / stage move ─▶ Call Log row ─▶ Conversation Details ─┬▶ Recording and transcript (fixed content)
                                                                    └▶ Appointment (no link) ─▶ Scribe
```

## 2. Feature Requests

### F-1: Call log list, search and export

#### 1. What it does
Meera opens `/call-logs`. The header shows a **Telephony** badge and a **How Calls Works** help modal. Under it are a search box ("Search call logs..."), a filter button, **Export** and **Schedule Call**. The table has one row for each client and process. The demo workspace starts with 5 process rows and 21 sample calls. A fresh workspace starts empty. The list reloads on store changes, window focus and tab visibility.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-1.1: Call table | Table | Columns: Call ID (opens the drawer), Previous Stage, Last Stage, Client, Status, Date & Time, Duration. Row actions: View, Call, Delete | ● Works | No phone column, no process column and no sorting |
| F-1.2: Direction icon and status badge | Display | An outbound or inbound phone icon beside the client. Completed is green, Pending amber, anything else red | ◐ Simulated | In Progress rows from processes and the kiosk show the red error badge, and SMS or WhatsApp rows show the inbound icon (G3-E-13) |
| F-1.3: Search | Search box | Filters by client name | ● Works | Name only. Phone is not searched |
| F-1.4: Advanced filter | Modal | Saved-search chips, Name, Responsible person, Stage group, Comment, Created on, and optional fields | ◐ Simulated | The Search button only closes the modal. Call type, Status and Duration are not connected (G3-E-09) |
| F-1.5: Export | Modal | Date range and status filters (Completed, Failed, Pending). Fields: Call ID, Client Name, Call Type, Status, Process, Stage, Duration, Date & Time | ◐ Simulated | File download not re-checked in code (unverified) |
| F-1.6: Row model | Rule | One row is kept per client and process. A new stage or date overwrites the existing row. Rows from SMS, WhatsApp and kiosk events are included | ◐ Simulated | Not one entry per call (G3-L-17). Decision needed: D-85 |
| F-1.7: Process and stage on each row | Rule | A row with no process gets one derived from its stage, for example Slot Selection becomes Appointment Scheduling | ● Works | |
| F-1.8: Empty state | State | "No call logs found matching your filters." | ● Works | |
| F-1.9: Loading and error states | State | None exist | ○ Not built | All data is browser-local |
| F-1.10: Client filter banner | Banner | A "Showing call logs for <client>" banner with Clear Filter is coded | ○ Not built | No screen sends a client to it. The help text promises date-range filtering but the buttons are never shown (G3-E-16) |
| F-1.11: Phone and Assigned Process columns, sortable columns, relative dates | Table | Described in the earlier PRD | ○ Not built | Dates show as "YYYY-MM-DD HH:MM". Decision needed: D-86 |
| F-1.12: Missed and Voicemail outcomes | Status | Described in the earlier PRD | ○ Not built | The retry tab also uses BUSY and NO ANSWER. Decision needed: D-83 |
| F-1.13: Role control | Rule | Any signed-in user can view calls and recordings | ○ Not built | (G3-E-33). Decision needed: D-14 |

#### 3. Worked example
Meera checks what came in overnight.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | The list is open | Types **Sarah** in the search box | **Only Sarah Johnson's row remains** |
| 2 | She wants only missed calls | Opens the filter and presses **Search** | **The modal closes and the list does not change** |
| 3 | The kiosk registered a walk-in | Looks at the top of the list | **A row for the walk-in shows WhatsApp and an In Progress badge in red** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Front-desk Staff | When following up on calls, I want a clear log of each client's contact and stage, so that patient inquiries are addressed quickly. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | **Given** a client already has a row for a process, **when** another event arrives for that process, **then** the existing row is updated and no new row is added. |
| F-1-2 | **Given** text in the search box, **when** it matches a client name, **then** only those rows show. Phone numbers are not matched. |
| F-1-3 | **Given** the advanced filter, **when** the user presses Search, **then** the modal closes and no filter is applied. |
| F-1-4 | **Given** no row matches, **then** the empty message is shown. |

### F-2: Schedule, trigger, cancel, dial and delete

#### 1. What it does
Meera presses **Schedule Call** and a drawer opens. She searches for a client, picks a process and a stage, picks a day on a calendar and sets a 24-hour time. A short pause follows. A **Pending** outbound row appears at the top and a success toast shows. She can also select rows and press **Trigger Calls** or **Cancel Scheduled**. None of these actions is saved.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-2.1: Schedule Call drawer | Drawer | Client search (email, phone or name), process, stage, calendar (past days disabled), time spinner. The button is disabled until a client and a date are set | ◐ Simulated | The new row lives in page memory only and is lost on refresh or window refocus (G3-E-11) |
| F-2.2: Process and stage choice | Select | The stage list shows only for processes in a fixed process-to-stage map | ◐ Simulated | Client processes such as "Client Intake" are not in the map, so no stage list shows and the stage falls back silently. Times earlier today are accepted (G3-E-15) |
| F-2.3: Trigger Calls | Bulk action | Choose Start Immediately or Schedule for Later (date and time required) and confirm | ◐ Simulated | Shows a success toast. No calls are created (G3-E-12) |
| F-2.4: Cancel Scheduled | Bulk action | Enabled only if a selected row has a scheduled call. A confirm modal says the action cannot be undone | ◐ Simulated | Clears the scheduled flag in page memory only (G3-E-11) |
| F-2.5: Click-to-dial | Row action | The **Call** action shows "Call feature coming soon" | ○ Not built | (G3-E-08). Decision needed: D-61 |
| F-2.6: Delete and Delete Selected | Row and bulk action | Shows a success toast with no confirmation | ◐ Simulated | Nothing is removed (G3-E-10). Decision needed: D-33 |
| F-2.7: Retry policy | Rule | What counts as a retry, maximum attempts and spacing are not defined | ○ Not built | Decision needed: D-88 |

#### 3. Worked example
Meera books a callback for Sarah.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah asked for a call tomorrow at 10:00 | Presses **Schedule Call**, picks Sarah, a day and 10:00, then confirms | **A Pending row appears and a success toast shows** |
| 2 | Later that day | Switches tabs and comes back | **The Pending row is gone** |
| 3 | She tries to remove an old row | Presses **Delete** | **A "deleted" toast shows and the row stays** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Front-desk Staff | When a patient asks to be called back, I want to schedule the call against their process and stage, so that the callback is not forgotten. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | **Given** a client and a date are chosen, **when** the user confirms, **then** a Pending outbound row appears at the top and a toast shows. The row is not saved. |
| F-2-2 | **Given** rows are selected, **when** Trigger Calls is confirmed, **then** a toast shows and no call is created. |
| F-2-3 | **Given** a row, **when** Delete is pressed, **then** a toast says it was deleted and the row remains. |
| F-2-4 | **Given** a row, **when** Call is pressed, **then** the message "Call feature coming soon" shows. |

### F-3: Conversation Details drawer

#### 1. What it does
Meera clicks a Call ID or **View**. The drawer shows the call ID, the client's initial and name, and the client's phone. It has two tabs, **Overview** and **Retry History**. Overview has a Recording card, a Summary card and a Transcription card. The same drawer opens from a client profile, an appointment's details and the Process board. If the call cannot be found, the drawer falls back to the first call in the store.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-3.1: Header | Display | Call ID, client name, client phone | ◐ Simulated | If no phone is found a fixed number is shown as the client's phone (G3-E-05) |
| F-3.2: Recording card | Player | Play and pause, a progress bar, speeds 1x, 1.25x, 1.5x and 2x, Download, a 1 to 5 star rating | ◐ Simulated | No audio exists. The bar jumps between 15 and 50 percent. Download has no handler. The card also shows for Failed and Pending calls (G3-E-03). Decision needed: D-38 |
| F-3.3: Summary | Card | A templated paragraph about an "outbound follow-up call … to a prospective customer" | ◐ Simulated | The same for every call, including inbound ones (G3-E-02) |
| F-3.4: Transcription | Chat | Bubbles labelled "AI Assistant" and "Client" | ◐ Simulated | Every call shows the same 9 lines with only the first name and stage swapped. The header always says "17 Messages". No timestamps shown and no search (G3-E-02) |
| F-3.5: Retry History | Table | Call type, process, initial stage, updated stage, status, created at, scheduled on | ◐ Simulated | Five invented attempts for every call, most dated "Oct 10, 2026" (G3-E-04). Decision needed: D-88 |
| F-3.6: Rating | Stars | A 1 to 5 star rating held on screen | ◐ Simulated | Not saved (G3-E-06). Decision needed: D-82 |
| F-3.7: Call Review panel | Panel | Outcome, happiness, disconnect reason, barge-in, tool failure, loop, talk time and fields updated | ○ Not built | The panel is coded with no tab button, so it cannot be opened. Most values are seeded random numbers (G3-E-01). Decision needed: D-87 |
| F-3.8: Close | Action | Closing resets the tab, playback and rating | ● Works | |
| F-3.9: Empty state | State | With no call and an empty store the drawer body is blank | ○ Not built | No message is shown |
| F-3.10: Intent tags, waveform, transcript search and timestamps, audio download | Display | Described in the earlier PRD (Appointment Booking, Prescription Refill, Billing Query, Positive and Urgent) | ○ Not built | Only a plain bar exists. Decision needed: D-87 |
| F-3.11: Staff versus AI speaker | Rule | The earlier PRD showed Staff and Patient | ○ Not built | Every call reads as "AI Assistant" and "Client". Decision needed: D-85 |
| F-3.12: Role control on recordings and transcripts | Rule | Any signed-in user can play recordings and read transcripts | ○ Not built | (G3-E-33). Decision needed: D-14 |

#### 3. Worked example
Meera checks a call for Asha Verma, who manages quality.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A call row is listed | Clicks the **Call ID** | **The drawer opens on Overview** |
| 2 | She wants to hear it | Presses **play** and picks **1.25x** | **The bar jumps forward and no sound is heard** |
| 3 | She opens an inbound call | Reads the transcript | **It is the same AI Assistant script as every other call** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When evaluating staff communication, I want synchronized audio and transcripts, so that I can verify call quality and protocol compliance. |
| F-3-J2 | Front-desk Staff | When a patient disputes what was said, I want to open the call from their record, so that I can answer from the facts. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | **Given** any call, **when** the drawer opens, **then** the transcript is the same nine fixed lines with the client's first name and stage filled in. |
| F-3-2 | **Given** the Recording card, **when** play is pressed, **then** the progress bar moves and no audio plays. Download does nothing. |
| F-3-3 | **Given** the drawer, **then** the Retry History tab shows five invented attempts. |
| F-3-4 | **Given** a rating is chosen, **when** the drawer is closed, **then** the rating is discarded. |
| F-3-5 | **Given** any signed-in user, **when** they open a call, **then** the recording and transcript are shown. |

### F-4: Call detail page

#### 1. What it does
`/call-logs/:id` is a full page. It is reachable only by typing the address. It shows a Summary, **Rating & Feedback** with half stars and a text box, a Call Relationship section, a Recording card, a Transcript with a download button and **AI Insights**. It shows the same hardcoded call for Sarah Johnson whatever id is in the address.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-4.1: Page content | Page | Summary, recording, transcript and policy details for Sarah Johnson | ◐ Simulated | Same content for any id (G3-E-07). Decision needed: D-86 |
| F-4.2: Rating & Feedback | Form | Half-star rating and a text box with **Save Feedback** | ◐ Simulated | Shows a toast only (G3-E-06) |
| F-4.3: Call Relationship | Section | Parent and child calls | ◐ Simulated | The data is simulated (G3-E-07) |
| F-4.4: AI Insights | Cards | Positive Sentiment, Call Quality, Efficiency Score ("20% faster than average"), Key Information Captured | ◐ Simulated | Static text. Hardcoded, formula undefined |
| F-4.5: Link from the app | Navigation | No screen links to this page | ○ Not built | It links only to itself |

#### 3. Worked example
Meera types the address of call 1042.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | She opens `/call-logs/1042` | Reads the page | **It shows Sarah Johnson's call, the same as for any other id** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Manager | After a call, I want to rate it and leave feedback, so that quality is tracked over time. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | **Given** any call id in the address, **then** the page shows the same fixed call. |
| F-4-2 | **Given** Save Feedback is pressed, **then** a toast shows and nothing is saved. |

### F-5: Hand-offs that write Call Log rows

#### 1. What it does
Most rows are not telephone calls. The kiosk and processes write them. Meera sees a row appear when a walk-in registers at the kiosk or when a client enters a stage. A call that books an appointment creates no appointment.

#### 2. What it includes
| Item | Type | What it does (as built) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F-5.1: Kiosk writes a row | Hand-off | Walk-in registration (stage "Initial Contact"), appointment booking (stage "Confirmed") and walk-in check-in (stage "Initial Contact") write or update a row in the default process | ◐ Simulated | The channel is not passed, so rows read "WhatsApp" with status In Progress (G3-X-01, G3-E-14). Decision needed: D-85 |
| F-5.2: Process and test chat write a row | Hand-off | The Test Process chat and process entry write or update a row for the client, process and stage | ● Works | One row per client and process |
| F-5.3: Stage change sync | Hand-off | A stage change on a row updates the client and deal records | ● Works | Detail belongs to the Process pages |
| F-5.4: Call to Appointment | Link | The transcript says "I've scheduled your consultation" | ○ Not built | No appointment is created or linked (see the Call to Claim journey). Decision needed: D-89 |
| F-5.5: Task from a call | Action | No control creates a task | ○ Not built | Decision needed: D-89 |
| F-5.6: Appointment Calls tab | Hand-off | Lists calls by client | ◐ Simulated | When the client has none, two invented completed calls with recordings are shown (G3-E-32) |
| F-5.7: Unused call list | Data | A separate 100-call seed with different stages sits in the page code | ○ Not built | Never used. Reports shows its own static list (G3-E-34) |

#### 3. Worked example
Sarah walks in at the kiosk.

| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sarah registers as a walk-in | Meera opens **Call Logs** | **A row for Sarah shows WhatsApp, In Progress, stage Initial Contact** |
| 2 | A call transcript says an appointment was booked | Meera opens the Appointments page | **No appointment was created by the call** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Front-desk Staff | After a call that books a visit, I want the call to link to the appointment, so that I can see what was agreed without searching. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | **Given** a kiosk registration, booking or check-in, **then** a Call Log row is written or updated with channel "WhatsApp" and status In Progress. |
| F-5-2 | **Given** a call transcript that mentions a booked appointment, **then** no appointment is created or linked. |
| F-5-3 | **Given** a client with no calls, **when** the appointment's Calls tab opens, **then** two sample calls are shown. |

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | Build status | One-line summary |
| :--- | :--- | :--- | :--- | :--- |
| F-1 | Call log list, search and export | F-1.1 – F-1.13 | ● / ◐ / ○ | List and name search work; filter applies nothing; one row per client and process. |
| F-2 | Schedule, trigger, cancel, dial, delete | F-2.1 – F-2.7 | ◐ / ○ | Every action shows a result but nothing is saved. |
| F-3 | Conversation Details drawer | F-3.1 – F-3.12 | ◐ / ○ | Same canned transcript and a fake player for every call. |
| F-4 | Call detail page | F-4.1 – F-4.5 | ◐ / ○ | Fixed content for any id; no link to it. |
| F-5 | Hand-offs that write rows | F-5.1 – F-5.7 | ◐ / ● / ○ | Kiosk and processes write rows; no link to appointments. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Front-desk Staff | Follow up on calls from a clear log | F-1 |
| 2 | Front-desk Staff | Schedule a callback against a process and stage | F-2 |
| 3 | Practice Manager | Verify call quality from audio and transcript | F-3 |
| 4 | Front-desk Staff | Open a call from a patient's record | F-3 |
| 5 | Practice Manager | Rate a call and leave feedback | F-4 |
| 6 | Front-desk Staff | Link a call to the appointment it booked | F-5 |

## 4. Roles and access (as built)

| Who | Can do | Is blocked from |
| :--- | :--- | :--- |
| Any signed-in user | View all rows, play recordings, read transcripts, schedule calls, press Delete, export | Nothing |
| Signed-out visitor | Nothing (sent to sign-in) | Everything |

The earlier PRD named Front-desk Staff and a Quality Assurance Supervisor as users and said nothing about access. Decision needed: D-14.

## 5. Metrics and definitions

The list shows no metric. The drawer shows these.

| Metric | Where | Formula as built |
| :--- | :--- | :--- |
| Message count | Transcription header | Always "17 Messages". **Hardcoded, formula undefined** |
| Call Outcome | Call Review (cannot be opened) | Not Completed gives "No Outcome". Completed with a changed stage gives "Stage Advanced". Otherwise "No Change" |
| Follow-up date | Call Review (cannot be opened) | **Hardcoded, formula undefined** (a seeded random 3 to 14 days after a fixed date) |
| Disconnect reason, barge-in count, tool failure, loop, happiness, talk time, warmth, silence | Call Review (cannot be opened) | **Hardcoded, formula undefined** (seeded random from the call id) |
| Sentiment, Call Quality, Efficiency Score | `/call-logs/:id` | **Hardcoded, formula undefined** (static text) |

## 6. Cross-module journeys this module appears in

| Journey | Step | What happens as built |
| :--- | :--- | :--- |
| **Call** → Receptionist → Appointment → Scribe → Invoice → Claim | A contact enters an AI-handled stage | There is no real telephony. Rows come from the process test chat, the kiosk or a stage move. One row per client and process, channel "WhatsApp" by default. |
| | Call to Appointment | Not connected. The transcript says an appointment was booked and none is created or linked. |
| | Appointment's Calls tab | Lists calls by client. Invents two sample calls when there are none. |
| Web form → Client → Process → Task | Widget bot moves a visitor to a stage | A row is created if none exists. It shows on the Process List only, not the Kanban. |

Full journey: see Journeys page.

## 7. Open decisions

| ID | Decision | Affects |
| :--- | :--- | :--- |
| D-83 | What is the canonical call outcome set (Completed, Missed, Voicemail, Failed, Pending, In Progress, BUSY, NO ANSWER)? | F-1.2, F-1.12 |
| D-85 | Is Call Logs telephone-only or does it include SMS, WhatsApp and kiosk events, is each call its own entry, and how are human-handled calls shown? | F-1.6, F-3.11, F-5.1 |
| D-86 | Which columns and which call-detail surface (drawer or page) are canonical? | F-1.11, F-4.1 |
| D-61 | Who places click-to-dial calls (trunk or softphone)? | F-2.5 |
| D-33 | Can call logs be deleted, by whom, with what confirmation and audit? | F-2.6 |
| D-87 | What are the formulas for call review metrics, and should the Call Review tab be shown? | F-3.7, F-3.10 |
| D-14 | Which roles may listen to recordings and read transcripts? | F-1.13, F-3.12 |
| D-38 | What is the retention period for call recordings? | F-3.2 |
| D-82 | What does the star rating measure and where is it reported? | F-3.6 |
| D-88 | What is the retry policy? | F-2.7, F-3.5 |
| D-89 | Should a call link to the appointment it booked, and can staff create a task from a call? | F-5.4, F-5.5 |

## 8. Change log

| Date | Change |
| :--- | :--- |
| 2026-11-14 | Rewritten to describe the prototype as built. Added status marks, roles, metrics, journeys and decisions. |
| 2026-11-10 | First version (generated stub). |
