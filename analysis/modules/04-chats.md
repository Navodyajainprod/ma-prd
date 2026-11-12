# G4 — Chats (unified inbox: Chat, SMS, WhatsApp, Website widget, Companion) — Gap Analysis
_Sources:_ PRD files `content/client/chat/chat.md`, `sms.md`, `whatsapp.md`, `website.md`, `companion.md` | Prototype route `/chats` → `src/app/pages/Chats.tsx`, `src/app/components/chats/**` (ConversationHeader, MessageThreadList, MessageComposerBar, CreateGroupChatDrawer, GroupChatSettingsDrawer, AssignResponsibleModal, AssignChatbotModal, RequestTemplateApprovalModal, WebsiteWidgetSettingsTab, TestWebsiteChatDrawer, CompanionSettingsTab, ConversationThreadDrawer), `src/lib/useConversations.ts`, `useWhatsAppNumbers.ts`, `useWhatsappTemplates.ts`, `websiteWidgetStore.ts`, `websiteChatSimulator.ts`, `companionWidgetStore.ts`, `chatbotTestReply.ts`; cross-refs `src/app/pages/patient/PatientMessagesScreen.tsx`, `PatientCareBotScreen.tsx`, `src/app/components/activity/ActivityTab.tsx`, `src/app/pages/Deals.tsx` | Analysed 2026-11-12

> Scope note: the Email channel (webmail, Email Agent, email templates) lives inside `/chats` but belongs to another module group. It appears here only as a cross-reference. Legacy Campaigns/Chatbot tabs are switched off in code (`Chats.tsx:806`) and are not analysed.

## Status summary

| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
|---|---|---|---|---|---|---|---|
| I — Unified inbox & care groups (`chat.md`) | 8 | 6 | 4 | 1 | 8 | 13 | 57.9% |
| S — SMS channel (`sms.md`) | 4 | 2 | 0 | 1 | 5 | 2 | 71.4% |
| W — WhatsApp channel (`whatsapp.md`) | 2 | 4 | 1 | 2 | 3 | 3 | 44.4% |
| WEB — Website widget channel (`website.md`) | 12 | 0 | 5 | 2 | 5 | 5 | 63.2% |
| C — Companion channel (`companion.md`) | 9 | 3 | 2 | 0 | 3 | 4 | 75.0% |
| **Totals** | **35** | **15** | **12** | **6** | **24** | **27** | **62.5%** |

Overall coverage: 62.5% · PRD-backed coverage: 62.5% (every sub-module has a PRD file; the Email channel is excluded because it belongs to another group). The defect column counts C-table rows. Some rows share one E entry, so section E lists 24 unique defects.

## Route map

| Route | Page / component | PRD file |
|---|---|---|
| `/chats` (default channel WhatsApp) | `src/app/pages/Chats.tsx` | `chat.md` |
| `/chats` → channel picker "SMS" (the PRD's `?channel=sms` is **not** read by the URL handler) | `Chats.tsx` + shared chat components | `sms.md` |
| `/chats` → "WhatsApp" (Inbox / Templates sub-modes); `/chats?tab=templates` | `Chats.tsx` | `whatsapp.md` |
| `/chats` → "Website" + Website Widget Settings drawer + Test Website Chat drawer | `Chats.tsx`, `WebsiteWidgetSettingsTab.tsx`, `TestWebsiteChatDrawer.tsx` | `website.md` |
| `/chats` → "Companion" + New Group + Companion Settings drawer | `Chats.tsx`, `CreateGroupChatDrawer.tsx`, `GroupChatSettingsDrawer.tsx`, `CompanionSettingsTab.tsx` | `companion.md` |
| `/chats?channel=email`, `/email-agent`, `/agents/email-agent` (redirect) | `WebmailView.tsx`, `EmailAgentRulesView.tsx` | other group (cross-ref) |
| `/patient/messages` (patient portal; consumes groups) | `pages/patient/PatientMessagesScreen.tsx` | Companion product (cross-ref) |

Route registration: `src/app/routes.tsx:269-271`. Nav item: `src/app/config/navigation.ts:85-88`.

---

## A. Product map — as built

### A-I. Unified inbox & care groups

**Purpose.** One two-pane console. The left pane lists the threads of one channel and the right pane shows the selected thread, with a header, the message stream and a composer. Opening Chats collapses the main sidebar to its rail (`Chats.tsx:815-817`).

**User roles.** No role gating. `/chats` sits outside the settings guard (`routes.tsx:252-269`). Any signed-in user can read every thread, open both settings drawers and create groups. "Me" is hardcoded as user id "1" (`Chats.tsx:227`). Group creation always records "Clinic Admin" as owner (`CreateGroupChatDrawer.tsx:133-134`).

**Screens.** Page header with "Omnichannel" badge, a "(dev)" simulator link and "How Chats Works" (`Chats.tsx:2071-2095`). Top bar with channel picker, per-channel controls and search (`Chats.tsx:2098-2800`). Thread list (`2817-2900`). Conversation pane (`2905-2950`).

**Flows**
1. **Pick a channel.** The channel picker is a dropdown with WhatsApp, SMS, Website, Email and Companion (`Chats.tsx:2098-2224`). The default is WhatsApp (`872`). "All Channels" can be displayed (`2154-2160`) but cannot be chosen from the dropdown. It is reached only when another screen navigates in with a channel the handler does not recognise (`1326-1330`). Changing channel keeps the search text (`1224-1228`).
2. **Search.** A case-insensitive substring search over contact name, phone and last-message text (`Chats.tsx:1562`). Matches are not highlighted.
3. **Thread list.** Each row shows initials (or a group icon), name, the assignee's initials, the last message, a time and an unread badge (`Chats.tsx:2840-2898`). Rows keep their stored order and are **not sorted** by last activity. Sending a message updates the thread in place without moving it (`useConversations.ts:1384-1395`).
4. **Empty states.** With no channel: "Select a channel" (`Chats.tsx:2821-2833`). With no matches: "No conversations found." (`2834-2837`). With no thread selected: "Select a conversation" (`2938-2950`). Not handled: when a channel has zero threads, the previously selected thread from another channel stays open on the right (`1578-1585`). Loading and error states do not exist because the data is local.
5. **Open a thread.** Selecting a thread sets its unread count to 0 and saves it (`Chats.tsx:1348-1352`). The stream auto-scrolls to the bottom (`MessageThreadList.tsx:32-36`).
6. **Header.** Shows name and phone (`ConversationHeader.tsx:53-60`). Group threads show "Group Settings" (`65-75`). Companion threads show no assignment button (`36-39, 76`). Other channels show one of three states (`78-106`):
   - "Bot Active": click pauses the bot (`Chats.tsx:1417-1423`).
   - "Assigned: name": click opens the Assign Responsible modal.
   - "Unassigned": click tries to open the chatbot modal, which is switched off, so nothing happens (`Chats.tsx:3748-3757`, `806`).
7. **Assign responsible (WhatsApp/SMS).** Composer gear → "Assign Responsible" → modal (`MessageComposerBar.tsx:510-540, 622-628`). The modal lists team-store members, with a hardcoded 10-person fallback (`AssignResponsibleModal.tsx:20-29, 76-90`). Choosing someone sets the assignee, turns the bot off and shows a toast (`Chats.tsx:1425-1439`). No notification is sent to the assignee.
8. **Reply/quote.** Hovering a bubble shows a Reply icon (`MessageThreadList.tsx:63-73, 183-193`). The composer then shows "Replying to …" with a cancel X (`MessageComposerBar.tsx:268-296`). The sent bubble carries a quote block (`MessageThreadList.tsx:82-92`), which is **not clickable**.
9. **Attach.** The paperclip opens the system file picker for one file (`MessageComposerBar.tsx:258-264, 318-326`). A chip shows name and size, with a remove X (`297-316`). There is no size or type check, no drag-drop and no multiple files. Only name, size and type are stored, not the file itself (`180-195`). In the thread, the attachment card's Download button shows a browser alert (`MessageThreadList.tsx:124-133`).
10. **Send.** Enter or the Send button sends. Send is disabled when there is no text and no file (`MessageComposerBar.tsx:546-572`). The message is saved with status "read" straight away (`useConversations.ts:1366-1376`). It is also written to the linked client's Activity timeline (`1411-1430`).
11. **Delivery receipts.** Only two glyphs exist: a double check for "read" and a single check for everything else (`MessageThreadList.tsx:171-179`). There is no tooltip, no failed state and no retry.
12. **Care groups (Companion only).**
    - "New Group" appears only on the Companion channel (`Chats.tsx:2770-2779`).
    - The drawer collects name, description, members (Contacts / Team tabs), moderator toggles, "who can add members" and "who can post" (`CreateGroupChatDrawer.tsx:39-46, 240-270`).
    - Team candidates are 4 hardcoded staff plus the team store (`27-32, 59-75`). Contacts come from the client list (`49-56`).
    - "Clinic Admin" is preselected as owner and moderator and cannot be removed (`41-42, 92-112`).
    - Validation: name is required (toast, and the button is disabled) and at least one member is required (`117-124, 170`).
    - Group type is always "private" and auto-delete is always "never" (`128-129`).
    - The new group is added to the top of the store with a system message (`useConversations.ts:1432-1481`).
    - Groups also appear in the WhatsApp channel list (`Chats.tsx:1568`).
13. **Group settings.**
    - Edit description, who can add members and who can post. Save closes with a toast (`GroupChatSettingsDrawer.tsx:83-92`).
    - Add or remove members and toggle moderators. These save immediately, and removal has no confirmation (`95-117`).
    - There is no rename and no archive.
    - "Who can post" is **not enforced**: the composer always allows posting (`MessageComposerBar.tsx:107-109`).
14. **Arrive from another screen.** Navigation state with thread id, client id, contact name or phone selects the matching thread and its channel (`Chats.tsx:876-930, 1316-1345`).

**Business rules**
- Threads are stored in browser storage under one key and synced across tabs (`useConversations.ts:98, 1119-1167, 1235-1253`).
- If fewer than 20 WhatsApp or 20 SMS threads are stored, the whole store is replaced with seed data (`1125-1130`).
- Task-assignment text is stripped from WhatsApp and SMS threads (`1082-1117`).
- Conversation status (open/resolved) and view filters exist in code but have no UI. The handler for "Mark resolved" is never called (`Chats.tsx:935-936, 1410-1415, 1569-1573`).

**KPIs & metrics.** The per-thread unread badge is computed. It counts unread inbound messages stored on the thread, cleared on open (`Chats.tsx:1348-1352, 2891-2895`). The seed counts are mock values. Cross-ref: the Email unread count starts at 7, which is **hardcoded – formula undefined** (`Chats.tsx:951`, owned by the Email group).

**Cross-module references.** See the "Cross-module hand-offs" table at the end of section E.

### A-S. SMS channel
- **Screens/controls.** The channel picker shows "SMS". The top bar adds a number dropdown listing distinct inbox numbers found on SMS threads (`Chats.tsx:1538-1540, 2256-2307`). Choosing a number changes only the label: the list is not filtered (`1574`) and the sending number does not change.
- **Composer gear (SMS).** "Share Template Message", which offers the WhatsApp templates, and "Assign Responsible" (`MessageComposerBar.tsx:510-540`). There is no Copy, Quote or Resend.
- **Not built.** E.164 validation, STOP/START handling, an opt-out banner or composer lock, a compliance audit log, the character/segment counter and failure retry. None of these terms appear in Chats code.
- **Linking to a client.** Threads carry a client id. Lookups from other screens match by client id, then by phone or name substring in both directions (`useConversations.ts:1259-1286`). Chats has no "link to client" or "create contact" action.
- **New Group** is hidden (`Chats.tsx:2770`).

### A-W. WhatsApp channel
- **Number switcher.** Lists numbers from saved WhatsApp integrations plus thread inbox numbers (`Chats.tsx:1533-1537`; `useWhatsAppNumbers.ts:14-17, 19-56`). It does not filter the list (`Chats.tsx:1574`) and is not remembered between sessions (`874`).
- **Inbox / Templates toggle** in the top bar (`Chats.tsx:2229-2254`).
- **Templates tab.** A table plus a builder drawer for create, edit, delete, a template library, variable mapping and "Request approval". The approval modal marks the template approved on submit (`Chats.tsx:1694-1815, 1866-1875`; `RequestTemplateApprovalModal.tsx:51-56`). Templates are stored in browser storage, seeded with 3 defaults (`useWhatsappTemplates.ts:6-80`).
- **24-hour window.** It is calculated from the last inbound message, but the result is forced to "24h remaining, freeform allowed" for every thread (`useConversations.ts:1171-1233`, comment at `1224`). The composer receives it but never uses it (`MessageComposerBar.tsx:31, 77`). No countdown, banner or lock is shown.
- **Send template.** Gear → "Share Template Message" → a modal listing templates that are approved or have no status, with name, category and body. Clicking a template sends it at once, with no preview or variable form (`MessageComposerBar.tsx:111, 581-616`). Variables are filled by a test resolver that returns "there" for every unknown placeholder (`useConversations.ts:1506`; `chatbotTestReply.ts:126-151`). Buttons render as non-clickable chips (`MessageThreadList.tsx:147-158`).
- **New Group** is hidden. Group threads still appear in the WhatsApp list (`Chats.tsx:1568`).

### A-WEB. Website widget channel
- **Top bar.** A settings cog opens "Website Widget Settings" (`Chats.tsx:2781-2791, 3552-3595`). There is no "Test Widget Chat" button in the top bar. The simulator opens from the small "(dev)" link in the page header (`2080-2092`) and from the test form inside the settings drawer (`WebsiteWidgetSettingsTab.tsx:501-560, 622`).
- **Thread pane.** The composer has no gear (`MessageComposerBar.tsx:328`). The header shows "Bot Active", "Assigned" or a dead "Unassigned" button, so a website thread cannot be assigned or taken over. Sending a message does not pause the bot (`Chats.tsx:1512-1519`). Only one seeded visitor thread exists (`useConversations.ts:968-985`).
- **Not built.** Presence, page URL, visitor metadata, resolve/archive.
- **Settings drawer.** Five sections (`WebsiteWidgetSettingsTab.tsx:840, 948, 1232, 1276, 1757`):
  1. *Design and position*: theme colour and mode, bot name, remove signature, six position presets (`753-758, 881, 919-938`).
  2. *Pre-chat form*:
     - Enable toggle, greeting, and checkboxes for Name, Email, Phone and Requirement (`961-1058`).
     - Requirement rows have a label plus cascading **Process Entity** (Processes, Appointment, Invoice, Insurance & Claims, Task) → **Workflow Name** (from the process store, filtered by entity and organisation, falling back to entity defaults) → **Stage** (`175-183, 190-203, 345-417`).
     - Changing the entity resets the workflow and stage to the first options; changing the workflow resets the stage (`374-408`).
     - **Auto Create Contact** toggle with a **Contact Category** dropdown fed by the contact-categories store (`187, 1185-1225`).
  3. *First Responder*: AI Assistant / Human Agent radio (`1232-1270`).
  4. *Responsible Settings*:
     - Working-hours toggle plus a branch picker whose schedule is read-only and "Synced from Org Data" (`1305-1360`).
     - Members picked from the organisation's team roster (`143-160, 1372-1480`).
     - Distribution: Simultaneous broadcast / Round-robin / Sequential priority (`1496-1503`).
     - Sequential mode shows a drag-to-reorder list labelled "Priority 1 (First Responder)" and "Fallback #n", with no arrows (`437-460, 1508-1600`).
     - Agent display: user / custom / hide, with custom profiles (`1637-1700`).
  5. *Embed code*: a copyable script snippet (`484-497`).
- **Save behaviour.**
  - Every edit autosaves to browser storage unless Auto Create is on with no category (`296-302`).
  - "Save Configuration" checks that every requirement is fully mapped and that a category is chosen, then shows a toast (`315-330`; footer `Chats.tsx:3572-3580`).
  - Because of autosave, invalid mappings are already saved and "Cancel" cannot undo anything.
- **Simulator logic** (`websiteChatSimulator.ts`).
  - Finds an existing client by phone, email **or name alone**. Otherwise it creates a contact with the category, or "Lead" when Auto Create is off (`81-107`; callers `WebsiteWidgetSettingsTab.tsx:524-526`, `TestWebsiteChatDrawer.tsx:98-100`). A placeholder phone is used when none is given (`101`).
  - Resolves the mapped workflow and stage, and builds the stage prompt from the stage pitch, description or process description (`35-67, 109-115`).
  - Replies with the stage automation's output (header, buttons) when it fires, or with the prompt otherwise (`133-153`).
  - Logs activity and pushes both messages into the Website inbox (`117-131, 155-168`).
  - The Test Website Chat drawer labels each AI turn "Workflow Prompt: <workflow> · <stage>" (`TestWebsiteChatDrawer.tsx:123`). Stage moves update the process call log and activity (`146-175`).
- **Configured but unused anywhere.** Working hours, distribution, priority queue and transfer phrases (repo-wide search finds no reader outside the settings tab and store).

### A-C. Companion channel
- **Top bar.** "New Group" plus a settings cog (`Chats.tsx:2770-2791`).
- **Header.** No assignment button (`ConversationHeader.tsx:36-39, 76`).
- **Composer gear (Companion).**
  - "Pause/Resume Care Bot" with an Active/Paused badge (`MessageComposerBar.tsx:348-385`).
  - "Assign Responsible" opens a small popover above the gear with search, an "Unassigned" option and active team-store members only (`123-127, 386-505`).
  - Assigning someone turns the bot off and shows a toast. Unassigning shows "Conversation unassigned" (`Chats.tsx:1425-1439`).
  - No template option.
- **Companion Settings drawer.**
  - Welcome greeting (`CompanionSettingsTab.tsx:144-156`).
  - Requirement → Process mapping (process only, no stage). At least one row must remain (`158-215, 120-140`).
  - Bot name and profile photo. The photo must be under 20MB, is compressed, and **saves immediately** (`217-300, 86-116`).
  - "Save Settings" saves the rest (`35-38`; `Chats.tsx:3614-3620`).
  - The stored config also has first responder, auto-responder and hand-off phrases, but none of them has UI (`companionWidgetStore.ts:18-21, 44-47`).
- **Portal side (cross-ref).** The patient Care Bot shows the configured requirements as buttons (`PatientCareBotScreen.tsx:51, 425-437`). The patient messages screen lists groups the patient belongs to, but also lists **every group containing client CL-001** and every public group (`PatientMessagesScreen.tsx:126-134`). No emergency-keyword handling was found.

---

## B. Product map — per PRD

### B-I. `chat.md`
- **Purpose.** Unified omnichannel console across WhatsApp, SMS, Website, Email and Companion, plus staff-moderated care groups (`chat.md § 1. Module Summary`). Roles: clinicians, care coordinators, admins, triage agents. No permission rules are given.
- **F-1** (`§ F-1`): "All" + channel filter tabs, threads sorted newest first with delivery badges and unread counters, search over name/phone/snippet with highlighting, responsible assignment with a notification to the assignee, and a bot toggle with fallback to a human.
- **F-2** (`§ F-2`):
  - "New Group" on Companion only.
  - Drawer: name, description, Private/Public type, members, moderators; at least one staff moderator.
  - Settings drawer: title, members, posting permission, archive.
  - "Who can post" enforced on client and server, and the patient composer disabled.
  - Propagation to Companion within 500ms, with an audit trail when a patient is removed.
- **F-3** (`§ F-3`): hover Reply, a staging banner, a quote card that scrolls to and highlights the original, and reply metadata kept in exports.
- **F-4** (`§ F-4`): paperclip and drag-drop, a 25MB limit with a toast, PDF/PNG/JPG/DOCX, multiple file chips, preview thumbnails, and a secure download with a token.
- **F-5** (`§ F-5`): pending / sent / delivered / read / failed glyphs, timestamp tooltips, a failure banner with retry, and WhatsApp window enforcement.

### B-S. `sms.md`
- **F-1:** E.164 validation, an SMS thread stream, phone search, an unread counter that clears on open, inbound SMS auto-mapped to the patient chart, and no New Group.
- **F-2:** a STOP/UNSUBSCRIBE/CANCEL interceptor, an opt-out banner and composer lock, START/UNSTOP re-opt-in, and an immutable TCPA audit log.
- **F-3:** GSM-7 160 / UCS-2 70 segment counter, Unicode detection, and a warning above 3 segments.
- **F-4:** sender-number display, New Group hidden, a message-actions cog (Copy, Quote, Resend), and failure reason plus retry.

### B-W. `whatsapp.md`
- **F-1:** a multi-number switcher that filters threads and is remembered across sessions, a live stream with unread counts, and responsible assignment with notification and audit.
- **F-2:** a 24h countdown, an expiry banner with "Send Template", a freeform lock (text and files), and reopening when the patient replies.
- **F-3:** a template picker drawer (search, categories), a variable form auto-filled from the chart, a live preview, up to 3 quick-reply buttons, and validation of missing variables.
- **F-4:** top-bar phone switcher and Templates button, New Group hidden, and a message-actions cog (copy, quote reply, forward).

### B-WEB. `website.md`
- **F-1:** a live session card (presence, page, duration), a visitor metadata panel, a human takeover switch (the AI pauses when a human sends), and resolve & archive.
- **F-2:** a requirement → Process Entity / Workflow Name / Stage prompt resolver, stage-specific replies, action cards, escalation to the Responsible queue, and a simulator header showing the workflow and stage.
- **F-3:**
  - Greeting and field checkboxes.
  - The requirement mapping row builder with cascading filters.
  - Auto Create Contact with a Contact Category.
  - Save validation for an unmapped requirement or a missing category.
  - The contact is created under the category without process enrolment.
- **F-4:**
  - Responsible members from the organisation roster.
  - Three distribution modes, and a drag-to-reorder priority list without arrows.
  - Persistence.
  - Working hours (toggle, days, time ranges, timezone).
  - Out-of-office reply and a 30-second fall-through.
- **F-5:** settings cog and "Test Widget Chat" button in the top bar, New Group hidden, and no message-actions cog in the composer.

### B-C. `companion.md`
- **F-1:** Companion-only New Group, the drawer, staff-moderator enforcement with an explicit message, propagation within 500ms, and posting permissions.
- **F-2:** an AI Care Bot with intent classification, process-tailored replies, deep-link shortcuts, and emergency keyword escalation (911).
- **F-3:** a settings cog; the drawer holds requirement → process mapping, an AI First Responder toggle and working-time preferences.
- **F-4:** 25MB attachments, quoting and read receipts.
- **F-5:**
  - No top-bar assignment button.
  - Bot pause/resume and Assign Responsible in the composer gear.
  - No templates.
  - A concise popover above the gear listing organisation team members plus "Unassigned".
  - Assigning someone pauses the bot.

---

## C. Findings

### C-I. Unified inbox & care groups (`chat.md`)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G4-I-01 | Flow | Cross-channel "All" view with filter tabs | Contradicts or stale | chat.md § F-1 (F-1.2) | Chats.tsx:872, 2098-2224, 1326-1330 | Built as a single-channel dropdown, so a coordinator cannot see every channel at once (F-1-J1). |
| G4-I-02 | Rule | Threads sorted newest first; a new message moves the thread to the top | PRD-only (not built) | chat.md § F-1 AC F-1-1 | Chats.tsx:1561-1576; useConversations.ts:1384-1395 | Stored order only. |
| G4-I-03 | Flow | Filter threads by channel | Matches | chat.md § F-1 AC F-1-2 | Chats.tsx:1564-1568 | |
| G4-I-04 | Rule | Group threads shown under WhatsApp | Prototype defect | chat.md § F-2 | Chats.tsx:1568 | see E-03 |
| G4-I-05 | Flow | Substring search over name/phone/snippet, kept when the channel changes | Matches | chat.md § F-1 (F-1.3) | Chats.tsx:1562, 1224-1228 | |
| G4-I-06 | Flow | Highlight matched text | PRD-only (not built) | chat.md § F-1 example 3 | Chats.tsx:2862-2880 | |
| G4-I-07 | Flow | Unread badge, cleared on open | Matches | chat.md § F-1 (F-1.1) | Chats.tsx:1348-1352, 2891-2895 | |
| G4-I-08 | Flow | Assign responsible updates the header and store | Partial (PRD less detailed) | chat.md § F-1 AC F-1-3 | Chats.tsx:1425-1439; MessageComposerBar.tsx:510-540 | The PRD does not say assignment turns the bot off or which screen hosts it (gear → modal). |
| G4-I-09 | Flow | Notify the assignee | PRD-only (not built) | chat.md § F-1 example 4 | Chats.tsx:1425-1439 | Toast only. |
| G4-I-10 | Rule | Single assignee roster | Prototype defect | chat.md § F-1 | Chats.tsx:229-235; ConversationHeader.tsx:27-31; AssignResponsibleModal.tsx:20-29 | see E-04 |
| G4-I-11 | Flow | Bot toggle with fallback to a human | Partial (PRD less detailed) | chat.md § F-1 (F-1.5) | Chats.tsx:1417-1423; ConversationHeader.tsx:78-87 | Header pauses the bot; assigning a human sets it off. No automatic escalation. |
| G4-I-12 | Flow | "Unassigned" header button | Prototype defect | chat.md § F-1 | ConversationHeader.tsx:98-105; Chats.tsx:806, 3748-3757 | see E-05 |
| G4-I-13 | Flow | Resolve thread and open/resolved/unread/assigned-to-me views | Prototype defect | (website.md § F-1.4) | Chats.tsx:935-936, 1410-1415, 1569-1573 | see E-06 |
| G4-I-14 | Rule | Conversation status lifecycle (open/resolved) and inbox views | Missing in PRD | — | Chats.tsx:935, 1410-1415 | chat.md never defines status or views (intended behaviour for E-06). |
| G4-I-15 | Rule | "New Group" visible only on Companion | Matches | chat.md § F-2 AC F-2-1 | Chats.tsx:2770-2779 | |
| G4-I-16 | Flow | Create group: name, description, members (contacts/team), moderators, who can post | Matches | chat.md § F-2 (F-2.2/F-2.3/F-2.5) | CreateGroupChatDrawer.tsx:39-46, 117-141 | |
| G4-I-17 | Flow | Group type Private/Public picker | PRD-only (not built) | chat.md § F-2 (F-2.2) | CreateGroupChatDrawer.tsx:128 | Always private. |
| G4-I-18 | Rule | "Who can add members" permission | Missing in PRD | — | CreateGroupChatDrawer.tsx:43, 240-250; GroupChatSettingsDrawer.tsx:35 | |
| G4-I-19 | Rule | Name required; at least one staff moderator | Partial (PRD less detailed) | chat.md § F-2 examples 2-3 | CreateGroupChatDrawer.tsx:41-42, 92-124 | A moderator is guaranteed by a locked owner ("Clinic Admin"), not by a validation message. |
| G4-I-20 | X-ref | Group visible in the patient's Companion portal | Matches | chat.md § Cross-product Summary | useConversations.ts:1432-1481; PatientMessagesScreen.tsx:126-134 | Same store. Timing is instant locally. |
| G4-I-21 | X-ref | [SECURITY] Portal group visibility scope | Prototype defect | chat.md § F-2 | PatientMessagesScreen.tsx:131-133 | see E-07 |
| G4-I-22 | Flow | Group settings: description, members, moderators, permissions | Partial (PRD less detailed) | chat.md § F-2 (F-2.4) | GroupChatSettingsDrawer.tsx:83-117 | Member and moderator changes save instantly; settings save on "Save Changes". |
| G4-I-23 | Flow | Rename and archive a group; audit log on removal | PRD-only (not built) | chat.md § F-2 (F-2.4, ex. 5) | GroupChatSettingsDrawer.tsx:83-117 | |
| G4-I-24 | Flow | Remove a member without confirmation | Prototype defect | chat.md § F-2 | GroupChatSettingsDrawer.tsx:101-110 | see E-08 |
| G4-I-25 | Rule | "Moderators only" posting enforced | Prototype defect | chat.md § F-2 AC F-2-3 | MessageComposerBar.tsx:107-109 | see E-09 |
| G4-I-26 | Flow | Hover Reply, staging banner, quote card, reply metadata saved | Matches | chat.md § F-3 | MessageThreadList.tsx:63-92; MessageComposerBar.tsx:155-177, 268-296 | |
| G4-I-27 | Flow | Click a quote to scroll to and highlight the original | PRD-only (not built) | chat.md § F-3 AC F-3-3 | MessageThreadList.tsx:82-92 | |
| G4-I-28 | Flow | Paperclip, staged chip, remove before send | Matches | chat.md § F-4 (F-4.1/F-4.3) | MessageComposerBar.tsx:180-195, 297-326 | |
| G4-I-29 | Rule | 25MB limit, type list, drag-drop, multiple files, previews | PRD-only (not built) | chat.md § F-4 AC F-4-1/F-4-2 | MessageComposerBar.tsx:180-195 | |
| G4-I-30 | Flow | Download attachment | Prototype defect | chat.md § F-4 AC F-4-3 | MessageThreadList.tsx:124-133 | see E-10 |
| G4-I-31 | Flow | Delivery status glyphs | Partial (PRD less detailed) | chat.md § F-5 (F-5.1) | MessageThreadList.tsx:171-179 | Only "read" or a single check; delivered looks the same as sent. |
| G4-I-32 | Rule | Status set to "read" at send time | Prototype defect | chat.md § F-5 AC F-5-1 | useConversations.ts:1371 | see E-11 |
| G4-I-33 | Flow | Timestamp tooltip, failed state, retry | PRD-only (not built) | chat.md § F-5 AC F-5-2/F-5-3 | MessageThreadList.tsx:165-180 | |
| G4-I-34 | X-ref | Deep link into a thread from Activity/Deals (client id / thread id / phone / name) | Missing in PRD | — | Chats.tsx:876-930, 1316-1345; ActivityTab.tsx:1653-1658; Deals.tsx:3975-3998 | |
| G4-I-35 | X-ref | Sent messages written to the client Activity timeline | Missing in PRD | — | useConversations.ts:1411-1430, 1532-1548 | |
| G4-I-36 | X-ref | Email channel inside Chats | Partial (PRD less detailed) | chat.md § F-1 | Chats.tsx:2795-2815 | Built as a separate webmail with Agent and Templates sub-modes (other group). |
| G4-I-37 | Flow | URL `?channel=` deep links | Prototype defect | sms/whatsapp/website/companion.md header tables | Chats.tsx:823-850, 1326-1330 | see E-13 |
| G4-I-38 | Flow | Empty channel leaves another channel's thread open | Prototype defect | chat.md § F-1 | Chats.tsx:1578-1585 | see E-14 |
| G4-I-39 | Rule | Store re-seeded when fewer than 20 WhatsApp/SMS threads | Prototype defect | — | useConversations.ts:1125-1130 | see E-15 |
| G4-I-40 | X-ref | [SECURITY] Activity write-back attribution | Prototype defect | — | useConversations.ts:1413-1414, 1533-1535 | see E-12 |

### C-S. SMS channel (`sms.md`)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G4-S-01 | Flow | SMS thread stream (name, snippet, time, unread) | Matches | sms.md § F-1 (F-1.2) | Chats.tsx:1564-1568, 2840-2898 | No live webhook (local store with cross-tab sync). |
| G4-S-02 | Rule | E.164 number validation | PRD-only (not built) | sms.md § F-1 (F-1.1) | — | |
| G4-S-03 | Flow | Search by phone digits | Matches | sms.md § F-1 (F-1.3) | Chats.tsx:1562 | |
| G4-S-04 | Flow | Unread counter clears on click | Matches | sms.md § F-1 (F-1.4) | Chats.tsx:1348-1352 | |
| G4-S-05 | X-ref | Inbound SMS mapped to the patient chart and contact | Partial (PRD less detailed) | sms.md § F-1 AC F-1-1 | useConversations.ts:58-61, 1259-1286 | Threads carry a client id; the matching rule is not specified, and there is no link/create action in Chats. |
| G4-S-06 | Rule | [SECURITY] Client-to-thread matching precision | Prototype defect | sms.md § F-1 AC F-1-1 | useConversations.ts:1273-1285; ConversationThreadDrawer.tsx:46-53 | see E-16 |
| G4-S-07 | Rule | STOP/START interception, opt-out banner, composer lock | PRD-only (not built) | sms.md § F-2 | — | Compliance gap (TCPA). |
| G4-S-08 | Rule | Opt-in/out audit log | PRD-only (not built) | sms.md § F-2 (F-2.4) | — | |
| G4-S-09 | Rule | GSM-7/UCS-2 segment counter and warning | PRD-only (not built) | sms.md § F-3 | — | |
| G4-S-10 | Rule | New Group hidden on SMS | Matches | sms.md § F-4 AC F-4-1 | Chats.tsx:2770 | |
| G4-S-11 | Flow | Sender number display | Partial (PRD less detailed) | sms.md § F-4 (F-4.1) | Chats.tsx:1538-1540, 2256-2307 | Dropdown of thread inbox numbers; it neither filters nor sets the sender (E-01). |
| G4-S-12 | Flow | Message-actions cog content (Copy/Quote/Resend) | Contradicts or stale | sms.md § F-4 (F-4.3) | MessageComposerBar.tsx:510-540 | The cog is in the composer and holds Share Template + Assign Responsible; Reply is a hover icon. |
| G4-S-13 | Flow | Failure reason and retry | PRD-only (not built) | sms.md § F-4 AC F-4-2 | — | |
| G4-S-14 | Rule | WhatsApp templates offered and sent on SMS | Prototype defect | sms.md § F-4 | MessageComposerBar.tsx:510-522, 581-616 | see E-17 |

### C-W. WhatsApp channel (`whatsapp.md`)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G4-W-01 | Flow | Multi-number switcher lists the clinic numbers | Partial (PRD less detailed) | whatsapp.md § F-1 (F-1.1) | Chats.tsx:1533-1537, 2256-2307; useWhatsAppNumbers.ts:14-56 | Labels are raw numbers; no location names. |
| G4-W-02 | Rule | Switcher filters threads by number | Prototype defect | whatsapp.md § F-1 AC F-1-1 | Chats.tsx:1574 | see E-01 |
| G4-W-03 | Rule | Selected number remembered across sessions | PRD-only (not built) | whatsapp.md § F-1 (F-1.1) | Chats.tsx:874 | |
| G4-W-04 | Flow | Live inbound stream with unread badges | Matches | whatsapp.md § F-1 (F-1.2/F-1.3) | useConversations.ts:1237-1246; Chats.tsx:2891-2895 | Cross-tab sync stands in for the webhook. |
| G4-W-05 | Flow | Responsible assignment | Partial (PRD less detailed) | whatsapp.md § F-1 (F-1.4) | MessageComposerBar.tsx:526-540; Chats.tsx:1425-1439 | Modal, not a dropdown; no audit event. |
| G4-W-06 | Rule | 24h window countdown, expiry banner, freeform lock, reopen | Contradicts or stale | whatsapp.md § F-2 | useConversations.ts:1171-1233 (1224, 1229-1231); MessageComposerBar.tsx:31, 77 | Logic exists but is forced open "per user request"; the composer ignores it. |
| G4-W-07 | Flow | Template picker lists approved templates with category | Partial (PRD less detailed) | whatsapp.md § F-3 (F-3.1) | MessageComposerBar.tsx:111, 581-616 | A modal, not a drawer; no search; sends on click. |
| G4-W-08 | Flow | Variable form auto-filled from the chart, blocked if empty | PRD-only (not built) | whatsapp.md § F-3 (F-3.2) AC F-3-2/F-3-3 | — | |
| G4-W-09 | Rule | Template variables filled with real data | Prototype defect | whatsapp.md § F-3 | useConversations.ts:1506; chatbotTestReply.ts:149-150 | see E-18 |
| G4-W-10 | Flow | Live preview before sending | PRD-only (not built) | whatsapp.md § F-3 (F-3.3) | MessageComposerBar.tsx:581-616 | A preview exists only in the template builder. |
| G4-W-11 | Flow | Quick-reply buttons | Partial (PRD less detailed) | whatsapp.md § F-3 (F-3.4) | MessageThreadList.tsx:147-158 | Rendered as non-interactive chips; no 3-button limit seen in the send flow. |
| G4-W-12 | Flow | Top bar: number switcher, Templates access, New Group hidden | Matches | whatsapp.md § F-4 AC F-4-1/F-4-2 | Chats.tsx:2229-2307, 2770 | Templates is an Inbox/Templates toggle. |
| G4-W-13 | Flow | Message-actions cog (copy, quote, forward) | Contradicts or stale | whatsapp.md § F-4 (F-4.4) | MessageComposerBar.tsx:510-540; MessageThreadList.tsx:63-73 | Same as S-12. |
| G4-W-14 | Flow | Template management tab (create/edit/delete, library, variable mapping, request approval) | Missing in PRD | — | Chats.tsx:1694-1815, 2955-3300; useWhatsappTemplates.ts:6-80 | |
| G4-W-15 | Rule | Meta approval status | Prototype defect | — | Chats.tsx:1866-1875; RequestTemplateApprovalModal.tsx:51-56 | see E-19 |

### C-WEB. Website widget channel (`website.md`)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G4-WEB-01 | Flow | Live session card (presence, page URL, duration) | PRD-only (not built) | website.md § F-1 (F-1.1) | useConversations.ts:968-985 | |
| G4-WEB-02 | Flow | Visitor metadata panel | PRD-only (not built) | website.md § F-1 (F-1.2) | — | |
| G4-WEB-03 | Flow | Human takeover; AI pauses when a human sends | PRD-only (not built) | website.md § F-1 (F-1.3) AC F-1-2 | Chats.tsx:1512-1519 | Website threads cannot even be assigned (E-05). |
| G4-WEB-04 | Flow | Resolve & archive session | Prototype defect | website.md § F-1 (F-1.4) | Chats.tsx:1410-1415 | see E-06 |
| G4-WEB-05 | Rule | Requirement → Entity/Workflow/Stage prompt resolution | Matches | website.md § F-2 AC F-2-1 | websiteChatSimulator.ts:35-67, 109-115 | Built in the simulator only. |
| G4-WEB-06 | Flow | Stage-specific reply and action buttons | Matches | website.md § F-2 (F-2.2/F-2.3) | websiteChatSimulator.ts:133-153; TestWebsiteChatDrawer.tsx:146-175 | |
| G4-WEB-07 | Flow | Simulator shows the active Workflow · Stage | Matches | website.md § F-2 AC F-2-2 | TestWebsiteChatDrawer.tsx:123 | |
| G4-WEB-08 | Flow | Escalation to the Responsible queue | PRD-only (not built) | website.md § F-2 (F-2.4) AC F-2-3 | — | |
| G4-WEB-09 | Flow | Greeting and Name/Email/Phone/Requirement checkboxes | Matches | website.md § F-3 (F-3.1/F-3.2) | WebsiteWidgetSettingsTab.tsx:961-1058 | |
| G4-WEB-10 | Rule | Cascading Entity → Workflow → Stage with resets | Matches | website.md § F-3 (F-3.3/F-3.4) AC F-3-1/F-3-2 | WebsiteWidgetSettingsTab.tsx:175-203, 345-417, 1083 | |
| G4-WEB-11 | Rule | Save blocked for an unmapped requirement or missing category | Matches | website.md § F-3 example 5 | WebsiteWidgetSettingsTab.tsx:315-330 | |
| G4-WEB-12 | Rule | Autosave bypasses validation; Cancel cannot revert | Prototype defect | website.md § F-3 | WebsiteWidgetSettingsTab.tsx:296-302; Chats.tsx:3565-3568 | see E-20 |
| G4-WEB-13 | Rule | Auto Create Contact with Contact Category (not Entity) | Matches | website.md § F-3 (F-3.5/F-3.6) AC F-3-3/F-3-4 | WebsiteWidgetSettingsTab.tsx:187, 1185-1225; websiteChatSimulator.ts:98-105 | |
| G4-WEB-14 | Rule | Contact created when Auto Create is OFF | Prototype defect | website.md § F-3 | websiteChatSimulator.ts:94-106; WebsiteWidgetSettingsTab.tsx:524-526 | see E-21 |
| G4-WEB-15 | Rule | [SECURITY] Visitor matched to an existing client by name alone | Prototype defect | website.md § F-3 | websiteChatSimulator.ts:84-89 | see E-22 |
| G4-WEB-16 | Rule | Placeholder phone saved on contacts | Prototype defect | website.md § F-3 | websiteChatSimulator.ts:101, 161 | see E-23 |
| G4-WEB-17 | Rule | Responsible members from the org roster only | Matches | website.md § F-4 (F-4.1) | WebsiteWidgetSettingsTab.tsx:143-160 | |
| G4-WEB-18 | Rule | Three distribution modes | Matches | website.md § F-4 (F-4.2) | WebsiteWidgetSettingsTab.tsx:1496-1503 | Stored values use different names (see glossary). |
| G4-WEB-19 | Flow | Drag-to-reorder priority list, no arrows, saved | Matches | website.md § F-4 (F-4.3/F-4.4) AC F-4-1 | WebsiteWidgetSettingsTab.tsx:437-460, 1508-1600 | |
| G4-WEB-20 | Rule | Working hours as toggle, days, time ranges, timezone | Contradicts or stale | website.md § F-4 (F-4.5) | WebsiteWidgetSettingsTab.tsx:1305-1360 | Built as a branch picker with a read-only schedule synced from org data. |
| G4-WEB-21 | Rule | Out-of-office reply, routing, 30s fall-through | PRD-only (not built) | website.md § F-4 examples 3-4, AC F-4-2 | websiteWidgetStore.ts:20-58 | Stored, never read. |
| G4-WEB-22 | Flow | Widget Settings cog in the top bar | Matches | website.md § F-5 (F-5.1) | Chats.tsx:2781-2791 | |
| G4-WEB-23 | Flow | "Test Widget Chat" button in the top bar | Contradicts or stale | website.md § F-5 (F-5.2) AC F-5-1 | Chats.tsx:2080-2092; WebsiteWidgetSettingsTab.tsx:622 | Only a "(dev)" link in the page header plus an in-drawer test form. |
| G4-WEB-24 | Rule | New Group hidden; composer gear removed | Matches | website.md § F-5 (F-5.3/F-5.4) AC F-5-2 | Chats.tsx:2770; MessageComposerBar.tsx:328 | |
| G4-WEB-25 | Flow | Design section (theme, mode, bot name, signature, position) and embed code | Missing in PRD | — | WebsiteWidgetSettingsTab.tsx:753-938, 484-497 | |
| G4-WEB-26 | Rule | First Responder AI/Human choice | Missing in PRD | — | WebsiteWidgetSettingsTab.tsx:1232-1270, 490 | |
| G4-WEB-27 | Flow | Agent display (user/custom/hide) with custom profiles | Missing in PRD | — | WebsiteWidgetSettingsTab.tsx:1637-1700 | |
| G4-WEB-28 | X-ref | Test bot stage moves update the process call log and activity | Missing in PRD | — | TestWebsiteChatDrawer.tsx:150-170 | |
| G4-WEB-29 | X-ref | Simulator conversations appear in the Website inbox | Missing in PRD | — | websiteChatSimulator.ts:155-168 | |

### C-C. Companion channel (`companion.md`)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G4-C-01 | Rule | "New Group" exclusive to the Companion top bar | Matches | companion.md § F-1 AC F-1-1 | Chats.tsx:2770-2779 | |
| G4-C-02 | Rule | Staff-moderator enforcement with an explicit message | Partial (PRD less detailed) | companion.md § F-1 (F-1.3), example 3 | CreateGroupChatDrawer.tsx:41-42, 92-112 | Implicit locked owner moderator; no "At least one Staff Moderator" message. |
| G4-C-03 | X-ref | Group propagates to the patient portal | Matches | companion.md § F-1 AC F-1-2 | PatientMessagesScreen.tsx:126-134 | |
| G4-C-04 | X-ref | [SECURITY] Portal group scope | Prototype defect | companion.md § F-1 | PatientMessagesScreen.tsx:131-133 | see E-07 |
| G4-C-05 | Rule | Posting permission enforced | Prototype defect | companion.md § F-1 (F-1.5) | MessageComposerBar.tsx:107-109 | see E-09 |
| G4-C-06 | X-ref | Care Bot requirement shortcuts in the portal | Partial (PRD less detailed) | companion.md § F-2 | PatientCareBotScreen.tsx:51, 425-437 | Requirement buttons come from settings; classifier and deep links are owned by the Companion product. |
| G4-C-07 | Rule | Emergency keyword escalation (911) | PRD-only (not built) | companion.md § F-2 (F-2.4) AC F-2-3 | — | No emergency handling found in the Care Bot screens. Patient-safety gap. |
| G4-C-08 | Flow | Companion Settings cog in the top bar | Matches | companion.md § F-3 AC F-3-1 | Chats.tsx:2781-2791 | |
| G4-C-09 | Rule | Requirement → Process mapping | Matches | companion.md § F-3 AC F-3-2 | CompanionSettingsTab.tsx:120-215 | Process only (no stage), unlike Website. |
| G4-C-10 | Rule | AI First Responder toggle | PRD-only (not built) | companion.md § F-3 (F-3.3) | companionWidgetStore.ts:18-21 | Field stored, no UI. |
| G4-C-11 | Rule | Working time preferences | PRD-only (not built) | companion.md § F-3 (F-3.4) | — | |
| G4-C-12 | Flow | Attachments, quoting, read receipts | Partial (PRD less detailed) | companion.md § F-4 | as I-26 to I-33 | Same gaps as the shared composer. |
| G4-C-13 | Rule | No top-bar assignment button on Companion | Matches | companion.md § F-5 AC F-5-1 | ConversationHeader.tsx:36-39, 76 | |
| G4-C-14 | Flow | Pause/Resume Care Bot in the gear with an Active/Paused badge | Matches | companion.md § F-5 AC F-5-3 | MessageComposerBar.tsx:348-385; Chats.tsx:1417-1423 | |
| G4-C-15 | Rule | Template option hidden on Companion | Matches | companion.md § F-5 AC F-5-2 | MessageComposerBar.tsx:348-350 | |
| G4-C-16 | Flow | Concise popover above the gear: org members plus Unassigned | Matches | companion.md § F-5 AC F-5-4/F-5-5 | MessageComposerBar.tsx:123-127, 386-505 | |
| G4-C-17 | Rule | Assigning someone pauses the bot, with a toast; unassign toast | Matches | companion.md § F-5 examples 4-5 | Chats.tsx:1425-1439 | The bot is set "off" rather than "paused". |
| G4-C-18 | Flow | Bot identity: name and profile photo (under 20MB, compressed) | Missing in PRD | — | CompanionSettingsTab.tsx:86-116, 217-300 | |
| G4-C-19 | Rule | Photo saves outside Save/Cancel | Prototype defect | — | CompanionSettingsTab.tsx:102, 114 | see E-24 |
| G4-C-20 | Rule | Header/list assignee names vs popover roster | Prototype defect | companion.md § F-5 | Chats.tsx:229-235, 2846 | see E-04 |
| G4-C-21 | Flow | Welcome greeting for the Care Bot | Missing in PRD | — | CompanionSettingsTab.tsx:144-156 | |

---

## D. Correct flow as built (PRD-ready)

> Each block below can replace the whole PRD file. Defects are written as their intended behaviour. Unclear items say `Decision needed`.

### D-1 — replacement for `content/client/chat/chat.md`

| Product | Client |
| :--- | :--- |
| Module | Chats & Care Groups (`/chats`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Care groups | A Care Group created on the Companion channel appears in the patient's Companion messages for patients who are members, or for every patient when the group is Public (Decision needed: keep Public groups? see G4-Q-06). | [View in Companion](/companion/chat) |
| Client profile (Activity) | Thread hand-off | "Open in Chats" on an activity entry opens Chats on that channel with the matching thread selected. Every message staff send is written back to that client's Activity timeline. | /clients |
| Process | Template links | Process step editors link to WhatsApp Templates (`/chats?tab=templates`). | /deals |

## 1. Module Summary
- A two-pane messaging console. The left pane lists the threads of the selected channel (WhatsApp, SMS, Website, Email, Companion). The right pane shows the thread header, message stream and composer.
- Users: clinicians, care coordinators, practice admins, triage staff. Decision needed: which roles may view, assign and configure (see G4-Q-19).
- Access: main navigation → Chats (`/chats`). Opening Chats collapses the main sidebar to its rail.

## 2. Feature Requests

### F-1: Channel inbox, search, status & assignment
#### 1. What it does
Shows one channel's threads at a time, with search, unread badges, status views and responsible assignment.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Channel picker | Dropdown | WhatsApp, SMS, Website, Email, Companion. Default WhatsApp. | Decision needed: add "All channels" (see G4-Q-01) |
| F-1.2: Thread list | List | Initials or group icon, name, assignee initials, last message, time, unread badge | Decision needed: sort rule (see G4-Q-02) |
| F-1.3: Search | Input | Case-insensitive substring over name, phone and last message; kept when the channel changes | |
| F-1.4: Unread badge | Badge | Count of unread inbound messages; cleared when the thread is opened | |
| F-1.5: Status & views | Control | Mark a thread Resolved/Open; views All, Open, Resolved, Unread, Assigned to me | Decision needed (see G4-Q-05) |
| F-1.6: Responsible assignment | Modal / popover | Choose an organisation team member or Unassigned. Assigning someone turns the bot off. A toast confirms. | One roster for every screen (see G4-Q-04) |
| F-1.7: Bot status | Header control | "Bot Active" pauses the bot. When nobody is assigned, the header offers assignment. | |
| F-1.8: Deep link | Navigation | Arriving with a thread id, client id, name or phone selects that thread and its channel. `?channel=<id>` selects that channel. | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator opens Chats | — | **WhatsApp threads are shown; the sidebar collapses** |
| 2 | Searches "Johnson" | Types in search | **Only threads whose name, phone or last message contains "johnson" remain** |
| 3 | Opens a thread with 2 unread | Clicks it | **The badge clears; the stream scrolls to the newest message** |
| 4 | Assigns Dr. Mehta | Gear → Assign Responsible → Dr. Mehta | **The header shows "Assigned: Dr. Mehta", the bot turns off, and a toast confirms** |
| 5 | Switches to a channel with no threads | Picks Website | **The list shows "No conversations found." and the right pane shows "Select a conversation"** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Care Coordinator | When inquiries arrive on several channels, I want to triage each channel's threads quickly, so that no patient message is overlooked. |
| F-1-J2 | Triage Staff | When looking for a patient, I want to search by name or number, so that I can open their thread immediately. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a channel is selected, then only that channel's threads are listed. Groups appear only under Companion. |
| F-1-2 | Given a search term, then threads whose name, phone or last message contains it (case-insensitive) are listed, and the term survives a channel change. |
| F-1-3 | Given a thread with unread messages, when it is opened, then its unread count becomes 0 and is saved. |
| F-1-4 | Given a responsible is chosen, then the header and list show that person from the same roster, and the bot turns off. |
| F-1-5 | Given the selected channel has no threads, then no thread from another channel stays open. |
| F-1-6 | Given every header assignment control, then clicking it opens a working assignment picker. |

### F-2: Care groups (Companion only)
#### 1. What it does
Staff create moderated groups of patient contacts and team members on the Companion channel.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: New Group | Button | Visible only on the Companion channel | |
| F-2.2: Create Group drawer | Drawer | Name (required), description, members (Contacts / Team tabs), moderator toggle per member, who can add members, who can post | The creator is owner and locked moderator |
| F-2.3: Group Settings drawer | Drawer | Edit description and permissions (Save Changes); add/remove members and toggle moderators | Removal asks for confirmation |
| F-2.4: Posting permission | Rule | "Moderators only" disables the composer for non-moderators in Client and Companion, with "Only moderators can post in this group" | |
| F-2.5: Portal sync | Data | The group appears in each member patient's Companion messages | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Create "Post-Op Knee Rehab" | New Group → name, add Sarah and Dr. Mehta → Create | **The group is added to the top of the Companion list with a "created by" system message; Sarah sees it in Companion** |
| 2 | Blank name | Clicks Create | **Blocked: "Chat name is required"** |
| 3 | Tries to remove the owner | Unticks the owner | **Blocked: "Owner cannot be removed from group"** |
| 4 | Sets Moderators only | Group Settings → Who can post → Save | **Non-moderators see a disabled composer** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Care Coordinator | When coordinating complex care, I want a group with the patient and specialists, so that everyone shares context. |
| F-2-J2 | Moderator | When posting critical updates, I want to restrict posting to moderators, so that instructions are not buried. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | New Group is visible on Companion and hidden on every other channel. |
| F-2-2 | A group cannot be created without a name or without at least one member; the owner is always a moderator. |
| F-2-3 | A group is visible in Companion only to patients who are members (Public rule: see G4-Q-06). |
| F-2-4 | Removing a member asks for confirmation. |
#### Not yet built
Group type picker (Private/Public), rename, archive with history kept, audit log of membership changes. Decision needed on archive vs auto-delete (see G4-Q-07).

### F-3: Contextual replies
#### 1. What it does
Staff quote a message when replying.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Reply icon on hover | Control | Shown beside each bubble | |
| F-3.2: Reply banner | Composer | "Replying to <name>: <text>" with cancel X | Cleared on send |
| F-3.3: Quote block | Bubble | Sender name and quoted text above the reply | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient asks about dosage | Hover → Reply, type, Enter | **The sent bubble shows the quoted question** |
| 2 | Changes their mind | Clicks X on the banner | **The banner closes; a normal message is sent** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Clinician | When answering one question in a busy thread, I want to quote it, so that the patient knows what I'm answering. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Hovering any bubble shows a Reply icon. |
| F-3-2 | A message sent while the banner is open stores and shows the quoted message's id, sender and text. |
#### Not yet built
Clicking a quote scrolls to and highlights the original.

### F-4: Attachments
#### 1. What it does
Staff attach a file to a message.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Paperclip | Button | Opens the file picker (one file) | |
| F-4.2: Staged chip | Chip | Name, size, remove X | |
| F-4.3: Attachment card | Bubble | Name, size, Download | Download returns the actual file |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Attach a 4.2 MB PDF | Paperclip → choose → Send | **The bubble shows the file card "4.2 MB"; the thread's last message reads "[Attachment: name]" when there is no text** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinician | When sharing results, I want to attach the PDF, so that the patient can review it. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Send is enabled with a staged file and no text. |
| F-4-2 | Download on a card delivers the stored file. |
#### Not yet built
Decision needed: size limit and allowed types per channel (see G4-Q-08). Drag-drop, multiple files and previews.

### F-5: Delivery status
#### 1. What it does
Shows the transport state of outbound messages.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Status glyph | Icon | Single check = sent/delivered; double check = read | Decision needed: a source for real receipts per channel (see G4-Q-09) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Staff send a message | Send | **A single check shows until the channel reports read** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Care Coordinator | When sending urgent guidance, I want to know it was read, so that I can follow up if not. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | A new outbound message starts as sent and changes only on a channel receipt. |
#### Not yet built
A distinct delivered glyph, timestamp tooltip, failed state with retry.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Channel inbox, search, status & assignment | F-1.1–F-1.8 | Per-channel thread triage with search, unread, status views and one assignment roster. |
| F-2 | Care groups | F-2.1–F-2.5 | Companion-only moderated groups synced to member patients. |
| F-3 | Contextual replies | F-3.1–F-3.3 | Quote a message when replying. |
| F-4 | Attachments | F-4.1–F-4.3 | Single-file attachments with download. |
| F-5 | Delivery status | F-5.1 | Sent/read glyphs driven by channel receipts. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | Triage every channel's threads quickly | F-1 |
| 2 | Triage Staff | Find a patient's thread by name or number | F-1 |
| 3 | Care Coordinator | Build a care group with the patient | F-2 |
| 4 | Moderator | Restrict posting to moderators | F-2 |
| 5 | Clinician | Quote the question being answered | F-3 |
| 6 | Clinician | Attach documents | F-4 |
| 7 | Care Coordinator | Know whether guidance was read | F-5 |

### D-2 — replacement for `content/client/chat/sms.md`

| Product | Client |
| :--- | :--- |
| Module | Chats & Care Groups – SMS Channel (`/chats?channel=sms`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Client profile (Activity) | SMS history | SMS sent from Chats are logged on the client's Activity timeline as SMS; "Open in Chats" from an SMS entry opens the thread. | /clients |

## 1. Module Summary
- SMS threads with patients, shown through the shared Chats console.
- Users: front desk, care coordinators, billing staff.
- Access: Chats → channel picker → SMS (or `/chats?channel=sms`).

## 2. Feature Requests

### F-1: SMS threads & number binding
#### 1. What it does
Lists SMS threads, each tied to a patient phone number and, when known, a client record.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: SMS thread list | List | Name, last message, time, unread badge | |
| F-1.2: Phone search | Input | Substring match on number, name or last message | |
| F-1.3: Unread badge | Badge | Clears on open | |
| F-1.4: Client link | Data | A thread carries the client id; other screens open it by client id, then exact phone | Decision needed: match rule and link/create action (see G4-Q-20) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Search "+1-555" | Types digits | **Matching threads remain** |
| 2 | Opens the thread | Clicks | **Unread clears** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Receptionist | When a patient has no app, I want to text them, so that they still get updates. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | A thread opened from a client screen is that client's thread, never a partial name or number match. |
| F-1-2 | New Group is hidden on SMS. |
#### Not yet built
E.164 validation.

### F-2: Opt-out compliance
#### Not yet built
STOP/UNSUBSCRIBE/CANCEL interception, opt-out banner and composer lock, START/UNSTOP re-opt-in, immutable audit log (as in the previous PRD § F-2). No part of this exists in the prototype.

### F-3: Segment calculator
#### Not yet built
GSM-7 160 / UCS-2 70 counter, Unicode warning, >3-segment warning.

### F-4: SMS top bar & composer actions
#### 1. What it does
Channel-specific controls.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Number selector | Dropdown | Lists the practice SMS numbers found on threads | Decision needed: filter vs sender choice (see G4-Q-11) |
| F-4.2: Composer gear | Menu | Assign Responsible | Decision needed: SMS templates and Copy/Resend actions (see G4-Q-12, G4-Q-13) |
| F-4.3: Reply | Hover icon | Quote reply (shared F-3) | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Inspect the SMS top bar | Select SMS | **Channel picker, number selector and search; no New Group** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Coordinator | When triaging SMS, I want only controls that SMS supports. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | New Group is not rendered on SMS. |
| F-4-2 | WhatsApp templates are not offered on SMS. |
#### Not yet built
Failure reason and retry.

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | SMS threads & number binding | F-1.1–F-1.4 | Phone-searchable SMS threads tied to client records. |
| F-2 | Opt-out compliance | not built | STOP/START enforcement and audit. |
| F-3 | Segment calculator | not built | Live segment count. |
| F-4 | Top bar & composer actions | F-4.1–F-4.3 | Number selector, assignment and reply. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist | Text patients without the app | F-1 |
| 2 | Compliance Officer | Enforce opt-outs | F-2 |
| 3 | Front Desk | Keep texts short | F-3 |
| 4 | Coordinator | See only SMS-relevant controls | F-4 |

### D-3 — replacement for `content/client/chat/whatsapp.md`

| Product | Client |
| :--- | :--- |
| Module | Chats & Care Groups – WhatsApp Channel (`/chats?channel=whatsapp`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Settings / Integrations | WhatsApp numbers | Numbers saved in the WhatsApp integration appear in the number selector. | /settings |
| Process | Templates | Process steps link to the Templates tab. | /deals |

## 1. Module Summary
- WhatsApp Business threads plus the practice's WhatsApp template library.
- Users: front desk, care coordinators, medical assistants.
- Access: Chats → WhatsApp (default channel). Inbox / Templates toggle in the top bar.

## 2. Feature Requests

### F-1: WhatsApp inbox & number selector
#### 1. What it does
Lists WhatsApp threads; staff pick which clinic number to work in.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Number selector | Dropdown | Integration numbers plus numbers found on threads; selecting one shows only that number's threads | Decision needed: remember selection (see G4-Q-11) |
| F-1.2: Thread list | List | Updates when another tab or simulator changes the data | |
| F-1.3: Responsible | Modal | Gear → Assign Responsible | Shared F-1.6 |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Two numbers configured | Selects +1 (555) 987-6543 | **Only threads routed to that number are listed** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Coordinator | When patients message different locations, I want to work one number at a time. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Selecting a number lists only threads with that inbox number. |
| F-1-2 | New Group is hidden; care groups do not appear under WhatsApp. |

### F-2: 24-hour service window
#### 1. What it does
Decision needed: re-enable enforcement (see G4-Q-10). The window is calculated from the patient's last inbound message as 24 h minus hours elapsed, rounded to 0.1 h. Today it is not shown or enforced.
#### Not yet built
Countdown, expiry banner, freeform/file lock, reopen on a patient reply.

### F-3: Send approved template
#### 1. What it does
Staff send an approved template into a thread.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Template picker | Modal | Approved templates with name, category and body | Templates without a status count as approved |
| F-3.2: Send | Action | Posts the template message (body, buttons) with a template origin and logs it to Activity | Variables filled from the contact's record |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Remind Sarah | Gear → Share Template Message → "Appointment Reminder" | **The message appears with the contact's real name and appointment values; a toast shows "Template sent"** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Medical Assistant | When outside the window, I want approved, personalised templates. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Only approved templates (or those without a status) are listed. |
| F-3-2 | No placeholder is sent with generic filler text. Decision needed: behaviour when a value is missing (see G4-Q-14). |
#### Not yet built
Variable form, live preview before sending, interactive quick replies, search and category grouping.

### F-4: Template library management
#### 1. What it does
The Templates tab lists templates (name, identifier, category, language, approval status) and opens a builder.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Template table | Table | Search by name, identifier, category, body; bulk select | |
| F-4.2: Builder drawer | Drawer | Header, body, footer, buttons, variable mapping, preview | |
| F-4.3: Library | Drawer | Start from a library template | |
| F-4.4: Request approval | Modal | Submits for approval | Decision needed: approval states and who sets them (see G4-Q-14) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Create a reminder | Templates → New Template → fill → Save | **The template appears in the table** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Practice Manager | Standardise outreach wording. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | A saved template appears in the table and, once approved, in the composer picker. |

### F-5: Top bar & composer actions
#### 1. What it does
Shows the controls specific to the WhatsApp channel.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Channel picker, Inbox/Templates toggle, number selector, search | Top bar | | |
| F-5.2: Composer gear | Menu | Share Template Message, Assign Responsible | Decision needed: Copy/Forward (see G4-Q-12) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Open WhatsApp | — | **Toggle, number selector and search; no New Group** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Coordinator | Focused WhatsApp controls. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | New Group is not rendered on WhatsApp. |

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Inbox & number selector | F-1.1–F-1.3 | Per-number WhatsApp triage. |
| F-2 | 24h window | not built | Decision needed. |
| F-3 | Send approved template | F-3.1–F-3.2 | Personalised approved templates. |
| F-4 | Template library | F-4.1–F-4.4 | Build and submit templates. |
| F-5 | Top bar & composer | F-5.1–F-5.2 | WhatsApp-specific controls. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator | Work one clinic number at a time | F-1 |
| 2 | Clinic Staff | Know when freeform is allowed | F-2 |
| 3 | Medical Assistant | Send personalised templates | F-3 |
| 4 | Practice Manager | Maintain approved wording | F-4 |

### D-4 — replacement for `content/client/chat/website.md`

| Product | Client |
| :--- | :--- |
| Module | Chats & Care Groups – Website Channel (`/chats?channel=website`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Process & Workflows | Requirement mapping | Workflow and stage options come from the Process store for the chosen entity; the stage's prompt drives the AI reply. Stage moves in the test bot update the client's process stage and Activity. | /deals |
| Contacts | Auto Create Contact | A visitor submission creates a contact under the chosen Contact Category without process enrolment. | /clients |
| Settings / Organization | Branches & team | Working hours follow the chosen branch's schedule; responsible members come from the organisation roster. | /settings |

## 1. Module Summary
- Website visitor chats plus the configuration of the embeddable widget and its AI first responder.
- Users: practice admins (settings); triage staff (threads).
- Access: Chats → Website. The top-bar cog opens Website Widget Settings.

## 2. Feature Requests

### F-1: Website threads
#### 1. What it does
Visitor conversations appear in the Website channel list.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Thread list & pane | List | Shared console; no composer gear | |
| F-1.2: Assignment / takeover | Header | Assign a team member; sending as a human pauses the AI | Decision needed (see G4-Q-18) |
| F-1.3: Resolve | Action | Mark resolved / reopen | Decision needed (see G4-Q-05) |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | A test visitor submits the form | — | **A thread for the visitor appears with the visitor message and the AI reply** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Triage Coordinator | See and answer website visitors. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Website threads can be assigned to a team member from the header. |
#### Not yet built
Presence, page URL, duration, visitor metadata panel, archive.

### F-2: Process-driven AI first responder
#### 1. What it does
For the visitor's requirement, the AI loads the mapped workflow stage. It replies with the stage automation's output (text, header, buttons) when that automation fires. Otherwise it replies with the stage prompt, taken in this order: stage greeting (comprehensive mode), stage pitch, stage description, process description.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Stage prompt resolver | Logic | Requirement → entity / workflow / stage → prompt | Falls back to the workflow's first stage |
| F-2.2: Reply | Generator | Stage automation output, else the prompt, else a generic acknowledgement | |
| F-2.3: Action buttons | Bubble | Buttons configured on the stage | |
| F-2.4: Test Website Chat | Drawer | First message → pre-chat form → live chat; each AI turn labelled "Workflow Prompt: <workflow> · <stage>"; stage moves update the process stage and Activity; messages sync to the inbox | Decision needed: placement (see G4-Q-16) |
#### 3. Worked example
| # | Situation | What the visitor does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Chooses "Book an Appointment" (Appointment → Appointment Flow → Booked) | Submits form | **The reply uses the Booked stage prompt; the label reads "Appointment Flow · Booked"** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Website Visitor | Get answers for my specific need. |
| F-2-J2 | Practice Admin | Make each requirement follow its workflow script. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a mapped requirement, the AI uses that stage's prompt. |
| F-2-2 | The simulator shows the active workflow and stage on each AI turn. |
#### Not yet built
Escalation to a human queue when asked or unresolved. Transfer phrases (see G4-Q-18).

### F-3: Pre-chat form, requirement mapping & Auto Create Contact
#### 1. What it does
Configures the visitor form and how each requirement maps to a workflow stage and contact category.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Enable pre-chat form, greeting | Toggle / text | | |
| F-3.2: Field checkboxes | Checkboxes | Full Name, Email, Phone, Requirement | Requirement shows the mapping list |
| F-3.3: Requirement rows | Row builder | Label + Process Entity (Processes, Appointment, Invoice, Insurance & Claims, Task) + Workflow Name + Stage; add/remove | New row defaults to Processes and the first workflow and stage |
| F-3.4: Cascade | Rule | An entity change resets workflow and stage to the first options; a workflow change resets stage | Workflows filtered by the active organisation |
| F-3.5: Auto Create Contact | Toggle | When ON, a Contact Category dropdown from the categories store is shown | |
| F-3.6: Save | Footer | Blocks save for an unmapped requirement or missing category; changes apply only on Save; Cancel discards | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Map "Billing & Invoices" | Entity Invoice → Billing & Invoicing → Draft | **The row saves with all three values** |
| 2 | Auto Create ON, no category | Save Configuration | **Blocked: "Please select a Contact Category…"** |
| 3 | Visitor "John Doe" submits with Auto Create ON (Lead) | — | **Contact John Doe is created under Lead and not enrolled in a process** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | Map each requirement to a workflow stage. |
| F-3-J2 | Front-Desk Lead | File new website contacts in the right category. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Each requirement shows a label and three cascading dropdowns. |
| F-3-2 | Save is blocked with the relevant message when a row is incomplete or a category is missing, and nothing is stored. |
| F-3-3 | With Auto Create OFF, no contact is created. Decision needed: how a visitor is matched to an existing contact (see G4-Q-17). |
| F-3-4 | Contacts without a phone are stored without a phone. |

### F-4: First responder & Responsible Settings
#### 1. What it does
Chooses AI or human first response and the team that receives chats.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: First Responder | Radio | AI Assistant / Human Agent | |
| F-4.2: Working hours | Toggle + branch | Uses the selected organisation branch's schedule and timezone (read-only, synced) | Decision needed (see G4-Q-15) |
| F-4.3: Members | Picker | Organisation team members only; availability by branch shown when hours are on | |
| F-4.4: Distribution | Dropdown | Simultaneous broadcast / Round-robin / Sequential priority | |
| F-4.5: Priority list | Drag list | Priority 1 (First Responder), Fallback #n; no arrows | |
| F-4.6: Agent display | Dropdown | User profile / custom profile (name, position, avatar) / hide | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Sequential mode | Drags Dr. Mehta to the top | **Dr. Mehta becomes Priority 1** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Clinic Admin | Set an escalation order simply. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Sequential mode shows a numbered drag list without arrows, and the order is saved. |
#### Not yet built
Routing of live chats by mode and order, the 30-second fall-through, and the out-of-office reply (Decision needed: text, see G4-Q-18).

### F-5: Design, embed & top bar
#### 1. What it does
Covers the widget's look and placement, its install snippet, and the Website top bar.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: Design | Section | Theme colour (presets/custom), light/dark, bot name, remove signature, 6 positions, live mock-up | |
| F-5.2: Embed code | Section | Copyable script with bot name, colour, mode, position, first responder | |
| F-5.3: Top bar | Controls | Settings cog; New Group hidden; composer has no gear | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Copy embed | Clicks copy | **Toast: "Widget embed code copied to clipboard!"** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Practice Admin | Brand and install the widget. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | The Website top bar shows the settings cog and no New Group; the composer has no gear. |

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Website threads | F-1.1–F-1.3 | Visitor threads in the inbox. |
| F-2 | Process-driven AI | F-2.1–F-2.4 | Stage-prompt replies and a simulator. |
| F-3 | Pre-chat form & mapping | F-3.1–F-3.6 | Entity/workflow/stage mapping and contact category. |
| F-4 | First responder & Responsible | F-4.1–F-4.6 | AI/human, team, distribution, priority. |
| F-5 | Design, embed & top bar | F-5.1–F-5.3 | Look, install, controls. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Triage Coordinator | Answer visitors | F-1 |
| 2 | Website Visitor | Get relevant answers | F-2 |
| 3 | Practice Manager | Map requirements to stages | F-3 |
| 4 | Clinic Admin | Set the escalation order | F-4 |
| 5 | Practice Admin | Brand and install the widget | F-5 |

### D-5 — replacement for `content/client/chat/companion.md`

| Product | Client |
| :--- | :--- |
| Module | Chats & Care Groups – Companion Channel (`/chats?channel=companion`) |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary
| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion | Care Bot configuration | The bot name, photo, greeting and requirement buttons set here appear in the patient's Care Bot. | [View in Companion](/companion/chat) |
| Companion | Care groups | Groups created here appear for member patients. | [View in Companion](/companion/chat) |

## 1. Module Summary
- Staff–patient threads with Companion portal users, care groups, and Care Bot settings.
- Users: physicians, coordinators, medical assistants; admins for settings.
- Access: Chats → Companion.

## 2. Feature Requests

### F-1: Care groups
See D-1 § F-2 (identical behaviour; New Group appears only here).

### F-2: Care Bot behaviour
#### 1. What it does
The patient's Care Bot shows the configured requirement buttons after the greeting.
#### Not yet built
Process classification of free text, portal deep-link shortcuts, and emergency keyword escalation (Decision needed: keyword list and wording, see G4-Q-21). AI First Responder toggle and working time (see G4-Q-18).

### F-3: Companion Settings
#### 1. What it does
The top-bar cog opens Companion Settings.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Welcome greeting | Text | First Care Bot message | |
| F-3.2: Requirement → Process | Rows | Label + process; add/remove; at least one row | No stage (unlike Website) |
| F-3.3: Bot identity | Name, photo | Photo under 20MB, compressed; applied on Save | |
| F-3.4: Save / Cancel | Footer | Save stores everything; Cancel discards | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Map "Physical Therapy Intake" to "Rehab Intake" | Choose process → Save Settings | **The patient sees the button; the mapping is stored** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Admin | Map portal choices to processes. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | The Companion top bar shows the settings cog. |
| F-3-2 | Each requirement maps to one organisational process. |

### F-4: Media, quoting, receipts
Shared with D-1 § F-3 to F-5.

### F-5: Composer controls & assignment
#### 1. What it does
On Companion, bot control and assignment live in the composer gear.
#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-5.1: No header assignment | Rule | The header shows name and phone only | |
| F-5.2: Pause/Resume Care Bot | Gear item | Badge Active/Paused; toast | |
| F-5.3: No templates | Rule | | |
| F-5.4: Assign popover | Popover above the gear | Search, Unassigned, active organisation team members | The same roster is used in list and header |
| F-5.5: Assign effect | Rule | Assigning someone turns the bot off; toasts "Assigned to X" / "Conversation unassigned" | |
#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Assign Dr. Akshita Sharma | Gear → Assign Responsible → select | **The responsible is updated, the bot turns off, and a toast confirms** |
#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-5-J1 | Care Coordinator | Take over from the bot without leaving the thread. |
#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-5-1 | The header has no assignment button on Companion. |
| F-5-2 | The gear has no template option. |
| F-5-3 | The popover lists only organisation team members and Unassigned. |

## 3. Comprehensive Summary
### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Care groups | see D-1 F-2 | Companion-only groups. |
| F-2 | Care Bot behaviour | not built (classification, emergency) | Requirement buttons only. |
| F-3 | Companion Settings | F-3.1–F-3.4 | Greeting, mapping, identity. |
| F-4 | Media & receipts | shared | As the unified inbox. |
| F-5 | Composer controls | F-5.1–F-5.5 | Bot pause and assignment in the gear. |
### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Care Coordinator | Build groups | F-1 |
| 2 | Patient | Get routed by the Care Bot | F-2 |
| 3 | Practice Admin | Configure the bot | F-3 |
| 4 | Care Coordinator | Take over from the bot | F-5 |

---

## E. Prototype defects

| ID | What's wrong | File:line | Severity | Related C row |
|---|---|---|---|---|
| G4-E-01 | The number selector (WhatsApp/SMS) changes only its label; the thread list ignores it. | Chats.tsx:1574 | High | W-02, S-11 |
| G4-E-03 | Care-group threads also appear under the WhatsApp channel. | Chats.tsx:1568 | Medium | I-04 |
| G4-E-04 | Three different assignee rosters. The list and header use 5 hardcoded names, the WhatsApp/SMS modal falls back to 10 hardcoded names, and the Companion popover uses the team store. Ids collide, so the header can show the wrong person or "Team Member". | Chats.tsx:229-235, 2846; ConversationHeader.tsx:27-31, 45; AssignResponsibleModal.tsx:20-29; MessageComposerBar.tsx:123-127 | Medium | I-10, C-20 |
| G4-E-05 | The "Unassigned" header button opens the chatbot modal, which is switched off, so the click does nothing. Website threads (no gear) can never be assigned, and a paused bot cannot be resumed from the header. | ConversationHeader.tsx:98-105; Chats.tsx:806, 3748-3757 | High | I-12 |
| G4-E-06 | Resolve/reopen and the Open/Resolved/Unread/Assigned-to-me views exist in code but have no UI. Status is invisible and cannot be changed. | Chats.tsx:936, 1410-1415, 1569-1573 | Medium | I-13, WEB-04 |
| G4-E-07 | [SECURITY] The patient portal lists every group containing client CL-001, and every public group, to any signed-in patient. Leaving a group also strips CL-001. | PatientMessagesScreen.tsx:131-133, 227-228 | Critical | I-21, C-04 |
| G4-E-08 | Removing a group member happens instantly with no confirmation. | GroupChatSettingsDrawer.tsx:101-110 | Low | I-24 |
| G4-E-09 | "Who can post: Moderators only" is never enforced; posting is always allowed. | MessageComposerBar.tsx:107-109; PatientMessagesScreen.tsx:760 | High | I-25, C-05 |
| G4-E-10 | Attachments store only name, size and type. Download shows a browser alert instead of a file. | MessageComposerBar.tsx:180-195; MessageThreadList.tsx:124-133 | Medium | I-30 |
| G4-E-11 | Every sent message and template is saved as "read" immediately, so receipts are fabricated. | useConversations.ts:1371, 1514 | Medium | I-32 |
| G4-E-12 | [SECURITY] Activity write-back attributes messages from threads without a client to client CL-001. Companion messages are logged as WhatsApp, and templates are always logged as WhatsApp (even on SMS). | useConversations.ts:1413-1414, 1533-1535 | High | I-40, S-14 |
| G4-E-13 | `?channel=` is honoured only for email. Navigation state with channel "companion" switches to "All". | Chats.tsx:823-850, 1326-1330 | Medium | I-37 |
| G4-E-14 | When the selected channel has no threads, the previous channel's thread stays open and can be replied to. | Chats.tsx:1578-1585 | Medium | I-38 |
| G4-E-15 | If fewer than 20 WhatsApp or 20 SMS threads are stored, all stored conversations (including new groups and messages) are replaced with seed data. | useConversations.ts:1125-1130 | High | I-39 |
| G4-E-16 | [SECURITY] Client → thread lookup uses two-way substring matching on phone and name ("Sarah" matches "Sarah Johnson"). The inline thread drawer falls back to client CL-001 and a fixed number, so staff can open or write into another person's thread. | useConversations.ts:1273-1285; ConversationThreadDrawer.tsx:46-53 | High | S-06 |
| G4-E-17 | The SMS composer offers WhatsApp templates ("Share Template Message"). | MessageComposerBar.tsx:510-522, 581-616 | Medium | S-14 |
| G4-E-18 | Live template sends fill variables with a test resolver, so unknown placeholders become "there" instead of contact data. | useConversations.ts:1506; chatbotTestReply.ts:149-150 | High | W-09 |
| G4-E-19 | "Request approval" marks a template approved immediately (fabricated Meta approval). | Chats.tsx:1866-1875; RequestTemplateApprovalModal.tsx:51-56 | Medium | W-15 |
| G4-E-20 | Website settings autosave every edit, bypassing Save validation (incomplete requirement mappings are saved). "Cancel" cannot discard changes. | WebsiteWidgetSettingsTab.tsx:296-302; Chats.tsx:3565-3568 | Medium | WEB-12 |
| G4-E-21 | The visitor simulator creates a contact (category "Lead") even when Auto Create Contact is OFF. | websiteChatSimulator.ts:94-106; WebsiteWidgetSettingsTab.tsx:524-526; TestWebsiteChatDrawer.tsx:98-100 | High | WEB-14 |
| G4-E-22 | [SECURITY] A website visitor is linked to any existing client with the same name, even with a different email or phone. Their chat is then attached to that client's record. | websiteChatSimulator.ts:84-89 | High | WEB-15 |
| G4-E-23 | Contacts and threads created without a phone get a placeholder number ("+1 (555) 019-9090" / "+1 (555) 345-6789"). | websiteChatSimulator.ts:101, 161; TestWebsiteChatDrawer.tsx:190, 211 | Medium | WEB-16 |
| G4-E-24 | The Companion bot photo upload and remove save immediately, outside Save/Cancel. | CompanionSettingsTab.tsx:102, 114 | Low | C-19 |

(There is no E-02: the disabled 24h window is a deliberate code choice and is logged as Contradicts, G4-W-06.)

### Cross-module hand-offs (file refs both sides)

| Trigger | Data passed | Target | Refs |
|---|---|---|---|
| Activity entry "open in Chats" | client id, channel, thread/email id | Chats selects channel and thread | ActivityTab.tsx:988, 1653-1658 → Chats.tsx:876-930, 1316-1345 |
| Deals call-log viewer entry | client id, channel, thread/email id | Chats | Deals.tsx:3975-3998 → Chats.tsx:1316-1345 |
| Activity inline thread drawer | client id, phone, name, channel | find-or-create thread | ActivityTab.tsx:1820, 2301 → ConversationThreadDrawer.tsx:46-62; useConversations.ts:1288-1349 |
| Staff send / template send | message text, channel type, client id | client Activity timeline | useConversations.ts:1411-1430, 1532-1548 |
| Website visitor submission (simulator) | name, email, phone, category, workflow/stage | Contacts (new contact), Activity, Website inbox | websiteChatSimulator.ts:99-105, 117-131, 155-168 |
| Test Website Chat stage move | client id, workflow, stage | Process call-log stage + Activity | TestWebsiteChatDrawer.tsx:150-170 |
| Create / update group | group config (members, permissions) | Patient portal messages | useConversations.ts:1432-1500 → PatientMessagesScreen.tsx:126-134 |
| Companion Settings save | greeting, requirements, bot name/photo | Patient Care Bot | companionWidgetStore.ts:92-120 → PatientCareBotScreen.tsx:51-66, 425; CareBotDrawer.tsx:40-49 |
| Website requirement mapping | entity → process list | Process store / contact categories | WebsiteWidgetSettingsTab.tsx:104, 187, 190-203 |
| Process step editor | link | `/chats?tab=templates` | StepParametersFields.tsx:3098 → Chats.tsx:837-841 |

## Open questions for PM

1. **G4-Q-01** Should the inbox offer an "All channels" view, as the PRD says, or stay one channel at a time as built? (G4-I-01)
2. **G4-Q-02** What is the thread sort rule (last inbound vs last activity)? Does sending a message move the thread to the top? (G4-I-02)
3. **G4-Q-03** Should care groups ever appear outside the Companion channel? (G4-E-03)
4. **G4-Q-04** Which roster is the single source for assignees (organisation team store?), and should assignment notify the assignee? (G4-E-04, G4-I-09)
5. **G4-Q-05** Is an open/resolved status, with Unread / Assigned-to-me views, intended for all channels? Where does "Resolve" live? (G4-I-14, G4-E-06, G4-WEB-04)
6. **G4-Q-06** Keep the Private/Public group type? If kept, should Public groups really be visible to every patient? (G4-I-17, G4-E-07)
7. **G4-Q-07** Archive (history kept) vs the stored auto-delete options (never/24h/7d/30d): which retention model applies to care groups? (G4-I-23)
8. **G4-Q-08** Attachment limits and allowed types per channel (25MB is above WhatsApp/SMS carrier limits). (G4-I-29)
9. **G4-Q-09** What is the source of delivery and read receipts per channel? Does the Website channel have receipts at all? (G4-I-31, G4-E-11)
10. **G4-Q-10** The 24h WhatsApp window was disabled "per user request". Should countdown and lock be restored, and in which release? (G4-W-06)
11. **G4-Q-11** Is the number selector a list filter, the outbound sender, or both? Should it persist per user? (G4-E-01, G4-S-11, G4-W-03)
12. **G4-Q-12** What belongs in the per-channel message actions (Copy, Quote, Resend, Forward), and should it be a per-bubble menu or the composer gear? (G4-S-12, G4-W-13)
13. **G4-Q-13** Are templates allowed on SMS (SMS-specific templates), or WhatsApp only? (G4-E-17)
14. **G4-Q-14** What are the template approval states and who sets them (Meta webhook vs manual)? What happens when a variable has no value? (G4-E-19, G4-E-18, D-3 F-3)
15. **G4-Q-15** Website working hours: branch-synced read-only schedule (as built) or custom days/times/timezone (as PRD)? (G4-WEB-20)
16. **G4-Q-16** Where should "Test Widget Chat" live: a top-bar button (PRD) or the "(dev)" link plus the in-drawer form (built)? (G4-WEB-23)
17. **G4-Q-17** With Auto Create Contact OFF, should a visitor still be linked to a contact? Which fields must match before reusing an existing contact? (G4-E-21, G4-E-22)
18. **G4-Q-18** First responder, transfer phrases, routing modes and the out-of-office text are configured but never applied. What is the runtime behaviour, and the out-of-office wording? Does Companion need the same First Responder and working-time controls? (G4-WEB-21, G4-C-10, G4-C-11, D-4 F-1.2)
19. **G4-Q-19** Role gating: which roles may view all threads, assign, and edit the Website/Companion settings? Today there is no gating. (A-I roles)
20. **G4-Q-20** How should an unknown number be linked to an existing client, or a new contact created, from inside a thread? (G4-S-05, G4-E-16)
21. **G4-Q-21** Companion emergency escalation: keyword list, wording, and whether staff are alerted. (G4-C-07)
22. **G4-Q-22** Messages from threads with no linked client: should they be logged anywhere? (G4-E-12)
