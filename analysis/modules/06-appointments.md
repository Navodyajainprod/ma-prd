# G6 — Appointments (calendar, list, availability) — Gap Analysis
_Sources:_ PRD files `content/client/appointments/calendar.md`, `list.md`, `availability.md` | Prototype routes `/appointments` → `src/app/pages/Appointments.tsx`, `src/app/components/appointments/**`, `src/lib/appointmentService.ts`, `src/lib/serviceAvailability.ts`, `src/lib/roomsStore.ts`, `src/lib/invoiceService.ts` (cross-ref), `src/lib/useProcessStore.ts` (cross-ref), `src/reception/lib/api/mockMaClient.ts` (cross-ref), `src/app/pages/patient/PatientBookingScreen.tsx` (cross-ref) | Analysed 2026-11-12

## Status summary
| Sub-module/screen | Matches | Partial | Missing in PRD | Contradicts/stale | PRD-only | Prototype defects | Coverage % |
|---|---|---|---|---|---|---|---|
| Calendar (calendar.md) | 3 | 1 | 2 | 1 | 9 | 2 | 50.0% |
| List (list.md) | 0 | 2 | 7 | 2 | 8 | 7 | 9.1% |
| Availability (availability.md) | 1 | 2 | 3 | 3 | 2 | 5 | 22.2% |
| Booking drawer, lifecycle and detail drawer (no PRD file) | 0 | 0 | 16 | 0 | 0 | 14 | No PRD |
| **Totals** | **4** | **5** | **28** | **6** | **19** | **28** | — |

Overall coverage: 15.1% (6.5 ÷ 43) · PRD-backed coverage: 24.1% (6.5 ÷ 27)

## Route map
| Route | Page / component | PRD file |
|---|---|---|
| `/appointments` (List mode, the default) | `src/app/pages/Appointments.tsx` (table at 1597-1869) | `content/client/appointments/list.md` |
| `/appointments` (Calendar mode) | `src/app/components/appointments/AppointmentCalendarView.tsx` | `content/client/appointments/calendar.md` |
| `/appointments` (Availability mode) | `src/app/components/appointments/TeamAvailabilityTab.tsx`, `TargetUserLocationBar.tsx`, `TargetUserDropdown.tsx` | `content/client/appointments/availability.md` |
| `/appointments` → "Book Appointment" / "Reschedule" drawer | `src/app/components/appointments/ScheduleAppointmentDrawer.tsx` | none |
| `/appointments` → row click / ID click | `src/app/components/appointments/AppointmentDetailDrawer.tsx` | none |
| `/appointments?processId=…` or `?process=…` | same page, workflow locked to one process (Appointments.tsx:197-217) | none |
| `/appointments?id=…` | same page, list filtered to that appointment's client (Appointments.tsx:367-381) | none |
| Not rendered anywhere | `AppointmentCard.tsx`, `AppointmentFilterModal.tsx` (imported but unused) | — |

Client nav entry: "Appointments" → `/appointments` (src/app/config/navigation.ts:96-101).

---

## A. Product map — as built

### A.1 Shared shell (all three modes)
**Purpose.** One page for scheduling and managing appointments. A segmented control switches between List, Calendar and Availability (Appointments.tsx:1213-1219). The page opens on List (Appointments.tsx:167).

**User roles.** No role gating. The code contains an "admin vs provider" switch that would limit a provider to their own appointments and hide the provider filter. It is a fixed internal value that no screen can change (Appointments.tsx:338-340), so every signed-in client user sees and can act on all providers' appointments.

**Toolbar.**
1. Workflow (process) selector: lists the appointment workflows that match the organisation and defaults to the first. When the URL names a process, it shows a fixed badge instead (Appointments.tsx:185-193, 1152-1210).
2. Stage filter pills: an "All" pill plus one pill per stage of the selected workflow, each with a count (Appointments.tsx:1223-1238).
3. Search box, which searches appointment ID, client name, email, phone, notes and title (Appointments.tsx:998-1009). It is hidden in Availability mode.
4. Filters → Provider dropdown (Appointments.tsx:1239-1255).
5. Import, Export, "Book Appointment" primary button, and a workflow gear menu (Appointments.tsx:1256-1277).
6. Amber "Automated Appointment Booking is locked" banner when no appointment automation exists (Appointments.tsx:1135-1145). In practice the check always passes, because the default appointment workflow counts as automation (appointmentService.ts:26-33).

### A.2 Calendar
**Screens.** A month grid on the left and a "Scheduled" side panel for the selected day on the right (AppointmentCalendarView.tsx:89-371).

**Flow.**
1. The month grid shows weekday headers, today highlighted, and up to 3 appointment titles per day plus "+N more" (AppointmentCalendarView.tsx:147-229).
2. Prev / Today / Next navigation (AppointmentCalendarView.tsx:76-127).
3. Clicking a day selects it. The side panel lists that day's appointments with title, a time range (start plus duration), provider and location (AppointmentCalendarView.tsx:286-370).
4. Empty day: the panel says "No appointments scheduled" and offers a book button. A "Book for this day" button is always shown. Both open the booking drawer with the date pre-filled (AppointmentCalendarView.tsx:262-285; Appointments.tsx:1584-1593).
5. Clicking an appointment card opens the **Reschedule** drawer, not the details drawer (AppointmentCalendarView.tsx:306).
6. The toolbar provider filter applies to the calendar (Appointments.tsx:620-626).
7. Not handled: Day and Week views (the state exists but nothing renders it; Appointments.tsx:168, 645-677), provider columns, the current-time line, slot granularity, drag-and-drop, and room tags. Every status, including cancelled and no-show, shows the same way. The side-panel badge always reads "✓ CONFIRMED" (AppointmentCalendarView.tsx:323). Dot colours follow list position, not status (AppointmentCalendarView.tsx:197-204).

**KPIs.** "N appointments" for the selected day = the number of appointments on that date that pass the provider filter (AppointmentCalendarView.tsx:86, 249). Computed.

### A.3 List
**Screens.** A table with columns Appointment ID (APT-0000 format), Title (`<client>_Appointment_<date>`), Stages (a segmented stage bar), Client, Date, Time (with duration), Provider and Service (Appointments.tsx:1603-1792).

**Flow.**
1. Rows are filtered by search, provider, stage pill and the selected workflow (Appointments.tsx:998-1061).
2. Clicking a row, the ID or the client name opens the detail drawer (Appointments.tsx:1612-1618, 1794-1797).
3. Clicking a stage in the stage bar moves the appointment to that stage right away (no confirmation). This saves the change, logs a stage move and an activity entry, and shows a toast (Appointments.tsx:254-306, 1700-1705).
4. Row actions (Appointments.tsx:1800-1866):
   - View Details.
   - Edit Details. This opens the same drawer as View.
   - Reschedule. Opens the booking drawer in reschedule mode.
   - Mark as Complete. Hidden when the appointment is already complete.
   - No Show. Hidden for no-show or cancelled appointments.
   - Cancel / Delete. Runs immediately with **no confirmation**.
5. Empty state: "No appointments found. Adjust your filters or book a new appointment." (Appointments.tsx:1798).
6. Import drawer (Appointments.tsx:1281-1535):
   - CSV: download a template, upload the file, Import. Errors are shown for no file, no data rows and a parse failure (Appointments.tsx:463-506).
   - Webhook: shows an endpoint URL and a sample payload (Appointments.tsx:1450-1491).
   - Integration: the shared integrations tab (Appointments.tsx:1494-1499).
7. Export: the shared export modal, with status options Scheduled / Completed / Cancelled / No-Show / Pending Accept and 12 fields (Appointments.tsx:1538-1570).
8. Not handled: sorting, a date range filter (the state exists but is unused; Appointments.tsx:316), a check-in or "Mark Arrived" action, room, copay and wait-time columns, bulk actions (row selection state exists but is unused; Appointments.tsx:309), and a loading state (data loads synchronously from browser storage).

**KPIs.** Each pill count is the number of appointments, across **all** workflows, whose current stage is that stage or whose status equals the stage's system category. "All" = the total number of appointments (Appointments.tsx:1227, 1234). Computed, but the table under it is filtered by workflow, so the counts do not match the rows shown (see G6-E-03).

### A.4 Booking drawer (Schedule / Reschedule)
**Flow.**
1. **Service** (required): lists services marked "available for appointment", showing a prepaid marker, price and duration (ScheduleAppointmentDrawer.tsx:484-530, 1213, 1314-1333). Choosing a service:
   - sets the title;
   - adds an invoice line item at the service price and tax;
   - turns on invoice generation if the service is prepaid or an appointment-to-invoice automation exists;
   - swaps the provider if the current one is not assigned to that service (ScheduleAppointmentDrawer.tsx:1117-1149).
2. **Location** (required): only locations where the service is enabled are listed. If only one qualifies, it is picked automatically (ScheduleAppointmentDrawer.tsx:623-641). The session type follows the location: "Online" or virtual means video, anything else means in person (ScheduleAppointmentDrawer.tsx:1090-1099).
3. **Participants**: "Schedule For" is the client (required). "Responsible (Optional)" is a provider, filtered by the service's per-location staff list, the service's assigned staff, and the provider's active locations (ScheduleAppointmentDrawer.tsx:651-682, 761-826, 1352-1377). When a provider is chosen, the drawer shows an auto-allocated room box or "No room mapped" (ScheduleAppointmentDrawer.tsx:828-842, 1379-1407).
4. **Schedule**: Date (required) and Available Slots.
   - **Specialist mode** (provider chosen). Slots start from the provider's hours for that location (first shift only), clamped to the location's hours. They step by the service duration. A full-day day off, a location closure, a disabled weekday, or a service not offered at that location produces no slots and a reason. A half-day off removes the morning or afternoon. A slot is disabled when the same provider already has an appointment, not cancelled, starting at exactly that time (ScheduleAppointmentDrawer.tsx:845-1043).
   - **Service mode** (no provider). Slots run across the location's open hours, stepping by the service duration. Each slot shows "N left" from seat capacity: the location seat override, else the service's maximum seats, else 1. Every overlapping service-mode booking that is not cancelled takes a seat (serviceAvailability.ts:63-201; ScheduleAppointmentDrawer.tsx:1045-1088, 1434-1500).
   - The first open slot is picked automatically (ScheduleAppointmentDrawer.tsx:1101-1114).
   - A provider notice shows a day off, inactive-at-location or not-scheduled warning, or "available" (ScheduleAppointmentDrawer.tsx:684-754, 1517-1531).
   - Prompts are shown until service, location and date are filled. With no slots, an amber message explains why (ScheduleAppointmentDrawer.tsx:1434-1456).
5. **Save**: "Book Appointment" or "Save Changes" stays disabled until service, location, client and date are filled. In create mode it also needs an appointment automation (ScheduleAppointmentDrawer.tsx:1179-1183, 1281-1291). A slot is **not** required (see G6-E-16).
6. **Create** (Appointments.tsx:725-812 → appointmentService.ts:630-851):
   - The workflow comes from, in order: a matching booking rule, the workflow assigned to the service, then the chosen workflow. The appointment enters that workflow's initial stage (appointmentService.ts:653-700).
   - The client is matched to an existing record by email, name or phone (appointmentService.ts:702-716). A room is found through the rooms mapping (appointmentService.ts:718-725).
   - The system saves the appointment, logs "appointment booked" and "stage set" activity, creates an invoice when requested or when the automation applies, emits `appointment.booked` and shows a toast (with the invoice number if one was created) (appointmentService.ts:757-850; Appointments.tsx:803-807).
   - Duration is always saved as 60 minutes (Appointments.tsx:780). Every staff booking's source is set to "Inbound Call" (Appointments.tsx:424, 792).
7. **Reschedule**: only the new date, time and note are saved. The system appends the note, logs "rescheduled (was …)" activity and emits `appointment.rescheduled` (Appointments.tsx:744-751; appointmentService.ts:857-912). Changes to service, location or provider made in the drawer are discarded.

### A.5 Lifecycle actions (service layer)
| Action | What happens | Citation |
|---|---|---|
| Cancel | Status becomes cancelled. A reason is added to the notes, activity is logged and `appointment.cancelled` is emitted. The linked invoice is voided, **including a paid one** when the appointment holds the invoice ID. The stage does not change. | appointmentService.ts:918-969 |
| Complete | Moves to the completed stage chosen by a completion rule, else the process's completed or final stage. Logs a stage move and activity and emits `appointment.completed`. | appointmentService.ts:975-1057 |
| No-show | Status and stage become no-show. Logs a stage move and activity and emits `appointment.no_show`. The invoice is untouched. | appointmentService.ts:1064-1132 |
| Check-in | Records the check-in time and emits `appointment.checked_in` and `client.checked_in`. **The status does not change.** | appointmentService.ts:1138-1162 |
| Move to stage | Sets the stage. Status becomes completed or cancelled only for those categories; every other stage sets "scheduled". | appointmentService.ts:1167-1245 |

Default appointment workflow stages: Booked → Reminder (sends a WhatsApp reminder step on entry) → Completed / Reschedule / No-show. **There is no Cancelled stage** (useProcessStore.ts:383, 391-530, 421-440).

### A.6 Detail drawer
- **Header**: a stage ribbon. Clicking a stage moves the appointment there (AppointmentDetailDrawer.tsx:457-502).
- **Overview**: editable sections. Changing the date or time reschedules immediately, with no availability check. Changes to notes, name, email or phone are saved (AppointmentDetailDrawer.tsx:333-381). There is an activity feed and an "AI Scribe" fill (AppointmentDetailDrawer.tsx:383-453).
- **Documents**: the shared documents tab.
- **Invoices**: invoices linked to the appointment **or to any invoice whose client name matches**, with search, status filter, create invoice (gated on invoice automation), view and record payment (AppointmentDetailDrawer.tsx:623-646, 880-1036).
  - KPIs: Total Invoiced = sum of non-void totals; Paid = sum of paid totals; Outstanding = sum of totals that are sent, viewed or overdue (AppointmentDetailDrawer.tsx:648-655, 927-939). Computed.
- **Calls**: the client's call logs. When there are none, it **shows two made-up calls** (AppointmentDetailDrawer.tsx:658-697).
- The page passes Complete, No-show, Cancel and Reschedule handlers, but the drawer never calls them (AppointmentDetailDrawer.tsx:71-74, 115-118).

### A.7 Availability
**Screens.** A team member picker and a location picker, with "Manage Slots" and "Days Off" sub-tabs (TargetUserLocationBar.tsx:206-236; TeamAvailabilityTab.tsx:712-721).

**Flow (Slots).**
1. Each member and location pair has its own weekly schedule. The default copies the location's hours, Monday to Friday 09:00-17:00 (TeamAvailabilityTab.tsx:86-110, 385-410).
2. Day toggles. Turning on a day the location is closed shows an error (TeamAvailabilityTab.tsx:456-485).
3. Add or remove shifts with no cap. Times come from 30-minute options between 06:00 and 22:00 (TeamAvailabilityTab.tsx:60-65, 487-525). A start before the location opens, or an end after it closes, is pulled back to the location's hours with an info toast (TeamAvailabilityTab.tsx:527-545). End-after-start is **not** checked.
4. Save checks the member's other locations for overlapping shifts and blocks the save with an error that names the overlap (TeamAvailabilityTab.tsx:565-606). The schedule is then saved and a success toast shown (TeamAvailabilityTab.tsx:611-646).
5. A per-member "active at location" switch is in the location bar (TargetUserLocationBar.tsx:157-167).

**Flow (Days Off).**
1. Add a start date, an optional end date, a time window, a reason and "Repeat yearly". The start date is required and duplicates are rejected (TeamAvailabilityTab.tsx:651-698).
2. A time window becomes "All Day", "Morning (Until 1 PM)" or "Afternoon (After 1 PM)" (TeamAvailabilityTab.tsx:666-671).
3. A range is saved as a text label ("A to B"), and "Repeat yearly" is saved only as text in the reason (TeamAvailabilityTab.tsx:656-659, 673-676).
4. Remove runs with no confirmation (TeamAvailabilityTab.tsx:700-707).

**Not built:** buffers, lunch shading on the calendar, and slot quantisation.

### A.8 Cross-module references (as built)
| Trigger | Data passed | Target | Refs |
|---|---|---|---|
| Patient portal booking | client, service, provider, date/time, duration from service, source "MA-Client" | same appointment store, so it appears in List and Calendar | PatientBookingScreen.tsx:391, 672-692 → appointmentService.ts:630 |
| Kiosk walk-in or kiosk booking | source "Walked In" or "MA-Client", "Confirmed" stage, room and token kept in the kiosk store | kiosk store plus appointment store (forced create, different ID) | mockMaClient.ts:1158-1186 |
| Kiosk check-in | kiosk appointment ID | `checkInAppointment` (sets the check-in time only) | mockMaClient.ts:1232, 1378-1383; PatientCheckinScreen.tsx:83-89 |
| AI / automation rule "book appointment" | params time and date, source "ai" | appointment store | ruleEngine.ts:967-975 |
| Booking with an invoice | appointment ID, client, line items, discount | Invoices (one invoice per appointment) | appointmentService.ts:801-834 → invoiceService.ts:581-610 |
| Cancel | invoice ID | invoice voided | appointmentService.ts:958-966 → invoiceService.ts:938-952 |
| Every lifecycle change | activity entry, stage-move log, event bus events | Client activity timeline, Automation | appointmentService.ts:765, 837, 905, 956, 1054, 1129, 1151 |
| Gear menu / banner | workflow ID | `/automation`, Processes | Appointments.tsx:1141, 1271-1276 |

---

## B. Product map — per PRD

### B.1 Calendar (`calendar.md`)
- **Purpose**: a calendar of all providers' schedules with Day, Week and Month views, room allocation, conflict detection and drag-and-drop rescheduling (`calendar.md § 1. Module Summary`).
- **Roles**: Practice Coordinator, Doctor, Clinic Administrator, Medical Assistant (`§ 3.2`). No permissions defined.
- **F-1** (`§ F-1`): Day, Week and Month switcher, with the chosen view kept across sessions. Provider column headers in Day view. A red current-time line updated every minute. 15, 30 or 60-minute slot granularity, default 30. AC: switching views does not reload the page, and the provider filter shows only that doctor.
- **F-2** (`§ F-2`): a room selector showing availability, a room double-booking warning that blocks save unless overridden, and equipment tags. AC: overlapping use of a room is flagged.
- **F-3** (`§ F-3`): drag-and-drop with snapping, a confirmation modal showing before and after with a "notify patient" checkbox, and a WhatsApp or SMS message logged in the patient thread. AC: the record is updated and an audit event logged.
- **Cross-product** (`§ Cross-product Summary`): Companion bookings appear immediately with "real-time slot locking".
- **KPIs**: none.

### B.2 List (`list.md`)
- **Purpose**: a dense table with status filters, search, a "Mark Arrived" check-in, bulk reschedule and export (`list.md § 1. Module Summary`).
- **F-1** (`§ F-1`): columns Patient, Provider, Date/Time, Status, Room, Visit Reason and Copay. Status pills All / Confirmed / Arrived / In Progress / Completed / Cancelled / No-Show with counts. Typeahead search on patient, phone and provider. A date range filter (Today, Tomorrow, This Week, This Month, custom) defaulting to Today. Sortable columns.
- **F-2** (`§ F-2`): a "Mark Arrived" button moves an appointment from Confirmed to Arrived, records the arrival time, starts a wait-time column, creates a queue token, and notifies the clinician with a toast and chime.
- **Cross-product** (`§ Cross-product Summary`): kiosk check-in sets "Arrived" with a green timestamp badge.
- **KPIs**: pill counts (no formula given) and Wait Time = arrival time compared with scheduled time (`§ F-2.2`).

### B.3 Availability (`availability.md`)
- **Purpose**: weekly hours, buffers, days off and holiday blackouts (`availability.md § 1. Module Summary`).
- **F-1** (`§ F-1`): day toggles, 15-minute time pickers with end-after-start validation, and up to 3 shifts per day. AC: disabled or unconfigured times cannot be booked from the staff calendar or the patient portal. Lunch breaks are shaded on the calendar.
- **F-2** (`§ F-2`): a pre-visit buffer (0, 5, 10 or 15 minutes), a post-visit buffer (0, 5, 10, 15 or 30 minutes), and slot quantisation to :00, :15, :30 or :45. AC: after a 10-minute post buffer, the next slot starts after the buffer.
- Days off and holidays appear only in the summary. There is no feature section for them.

---

## C. Findings

### C.1 Calendar
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G6-C-01 | Flow | Month grid with prev/today/next and up to 3 items per day | Partial (PRD less detailed) | calendar.md § F-1.1 | AppointmentCalendarView.tsx:76-229 | Month view is built. The PRD does not describe the "+N more" overflow or the day-selection panel. The view choice is not kept across sessions. |
| G6-C-02 | Flow | Day and Week views, provider column headers | PRD-only (not built) | § F-1.1, F-1.2 | Appointments.tsx:168, 645-677 (unused) | Coordinators cannot compare providers side by side. |
| G6-C-03 | Flow | Red current-time line | PRD-only (not built) | § F-1.3 | — | |
| G6-C-04 | Flow | 15/30/60-minute granularity selector | PRD-only (not built) | § F-1.4 | — | |
| G6-C-05 | Rule | Provider filter limits the calendar to one provider | Matches | § F-1 AC F-1-2 | Appointments.tsx:620-626, 1239-1255 | |
| G6-C-06 | Flow | Side panel for the selected day with "Book for this day" and empty state | Missing in PRD | — | AppointmentCalendarView.tsx:233-370 | |
| G6-C-07 | Flow | Side-panel status badge | Prototype defect | — | AppointmentCalendarView.tsx:323 | see G6-E-01 |
| G6-C-08 | Rule | Status not distinguished on the grid (dot colour by position) | Prototype defect | — | AppointmentCalendarView.tsx:197-204 | see G6-E-02 |
| G6-C-09 | Flow | Clicking a calendar appointment opens Reschedule | Missing in PRD | — | AppointmentCalendarView.tsx:306 | Product decision: should it open Details instead? (G6-Q-01) |
| G6-C-10 | Rule | Room assignment | Contradicts or stale | § F-2.1 | roomsStore.ts:183-223; ScheduleAppointmentDrawer.tsx:828-842, 1379-1407 | The PRD has a manual room dropdown. The build auto-allocates from the service + location + provider mapping, and the user cannot pick a room. |
| G6-C-11 | Rule | Room double-booking warning | PRD-only (not built) | § F-2.2, AC F-2-1 | — | No time-based room check anywhere. Two providers mapped to one room can overlap. |
| G6-C-12 | Flow | Equipment tags | PRD-only (not built) | § F-2.3 | — | |
| G6-C-13 | Flow | Drag-and-drop rescheduling | PRD-only (not built) | § F-3.1, AC F-3-1 | — | Rescheduling is done through the drawer instead (see G6-B rows). |
| G6-C-14 | Flow | Reschedule confirmation modal with "notify patient" | PRD-only (not built) | § F-3.2 | — | |
| G6-C-15 | Rule | Patient SMS/WhatsApp on reschedule | PRD-only (not built) | § F-3.3 | appointmentService.ts:905 | Only the `appointment.rescheduled` event is emitted. A message goes out only if an automation is set up. (G6-Q-14) |
| G6-C-16 | X-ref | Companion bookings appear on the calendar | Matches | § Cross-product Summary | PatientBookingScreen.tsx:672-692 | Same store. |
| G6-C-17 | Rule | Companion "real-time slot locking" | PRD-only (not built) | § Cross-product Summary | appointmentService.ts:630-758 | No lock or server-side conflict check (see G6-E-19). |
| G6-C-18 | Rule | Reschedule writes an audit entry | Matches | § F-3 AC F-3-1 | appointmentService.ts:885-902 | Activity entry "rescheduled … was previously …". |

### C.2 List
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G6-L-01 | Flow | Table columns | Contradicts or stale | list.md § F-1 | Appointments.tsx:1603-1792 | Built: ID, Title, Stages, Client, Date, Time, Provider, Service. PRD: Room, Visit Reason, Copay, Wait Time. Neither has the other's extra columns. |
| G6-L-02 | Rule | Status filter vocabulary | Contradicts or stale | § F-1.1 | Appointments.tsx:1223-1238; useProcessStore.ts:383 | The PRD has Confirmed, Arrived, In Progress, Completed, Cancelled and No-Show. The build shows the workflow's stages (Booked, Reminder, Completed, Reschedule, No-show). There is no Arrived, In Progress or Cancelled pill. (G6-Q-03) |
| G6-L-03 | Metric | Pill counts | Prototype defect | § F-1.1 | Appointments.tsx:1227, 1234 | see G6-E-03 |
| G6-L-04 | Flow | Search | Partial (PRD less detailed) | § F-1.2 | Appointments.tsx:998-1009 | The build also searches email, notes, title and appointment ID. |
| G6-L-05 | Flow | Search by provider name | PRD-only (not built) | § F-1.2 | Appointments.tsx:1001-1009 | |
| G6-L-06 | Flow | Date range filter, default Today | PRD-only (not built) | § F-1.3 | Appointments.tsx:316 (unused) | The list shows all dates, so the "today" job is not supported. |
| G6-L-07 | Flow | Sortable columns | PRD-only (not built) | § F-1.4 | — | |
| G6-L-08 | Flow | Workflow selector and locked-workflow mode from URL | Missing in PRD | — | Appointments.tsx:185-230, 1152-1210 | |
| G6-L-09 | Flow | Provider filter in Filters | Missing in PRD | — | Appointments.tsx:1239-1255 | |
| G6-L-10 | Flow | Inline stage change from row stage bar, with stage-move log and activity | Missing in PRD | — | Appointments.tsx:254-306, 1700-1705 | |
| G6-L-11 | Rule | Stage and status kept in sync | Prototype defect | — | Appointments.tsx:255-259; appointmentService.ts:1190-1194 | see G6-E-04 |
| G6-L-12 | Flow | Row actions: View, Edit, Reschedule, Complete, No Show, Cancel/Delete | Missing in PRD | — | Appointments.tsx:1800-1866 | |
| G6-L-13 | Flow | "Edit Details" action | Prototype defect | — | Appointments.tsx:1810-1815 | see G6-E-05 |
| G6-L-14 | Flow | Cancel/Delete has no confirmation | Prototype defect | — | Appointments.tsx:1853-1864 | see G6-E-06 |
| G6-L-15 | Flow | "Mark Arrived" button | PRD-only (not built) | § F-2.1, AC F-2-1 | — | No staff-side check-in. |
| G6-L-16 | Metric | Arrival timestamp and Wait Time column | PRD-only (not built) | § F-2.2 | appointmentService.ts:1145 | The check-in time is stored when the kiosk checks a patient in, but it is never shown. |
| G6-L-17 | Flow | Clinician "patient arrived" toast and chime | PRD-only (not built) | § F-2.3 | — | |
| G6-L-18 | Flow | Queue token on check-in | PRD-only (not built) | § F-2 What it does | mockMaClient.ts:1161 | A token exists only in the kiosk store and is not shown in the List. |
| G6-L-19 | X-ref | Kiosk check-in shows "Arrived" in List | Prototype defect | § Cross-product Summary | appointmentService.ts:1138-1147; mockMaClient.ts:1232, 1382 | see G6-E-07 |
| G6-L-20 | Flow | Import by CSV, webhook or integration | Missing in PRD | — | Appointments.tsx:463-506, 1281-1535 | |
| G6-L-21 | Flow | CSV import mapping | Prototype defect | — | Appointments.tsx:450, 485-495 | see G6-E-08 |
| G6-L-22 | Flow | Export | Partial (PRD less detailed) | § 1. Module Summary ("export operations") | Appointments.tsx:1538-1570 | The PRD only names export. The build has a status filter and 12 fields. |
| G6-L-23 | Flow | Bulk rescheduling | PRD-only (not built) | § 1. Module Summary | Appointments.tsx:309 (unused) | |
| G6-L-24 | Flow | Deep link `?id=` filters to the appointment's client | Missing in PRD | — | Appointments.tsx:367-381 | |
| G6-L-25 | Rule | Booking blocked without appointment automation (banner, button, drawer) | Missing in PRD | — | Appointments.tsx:1135-1145, 1258-1269; appointmentService.ts:639-648 | Effectively always unlocked (appointmentService.ts:30-33). |
| G6-L-26 | Flow | "How Appointments Works" help text | Prototype defect | — | Appointments.tsx:2031-2036 | see G6-E-09 |

### C.3 Availability
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G6-A-01 | Flow | Weekly day toggles and hours per member, per location | Partial (PRD less detailed) | availability.md § F-1.1 | TeamAvailabilityTab.tsx:385-485 | The PRD does not mention per-location schedules or clamping to location hours. |
| G6-A-02 | Rule | Time picker increments | Contradicts or stale | § F-1.2 | TeamAvailabilityTab.tsx:60-65 | PRD: 15-minute steps. Build: 30-minute options from 06:00 to 22:00. |
| G6-A-03 | Rule | Split shifts, cap of 3 | Contradicts or stale | § F-1.3 | TeamAvailabilityTab.tsx:487-507 | The build has no cap. |
| G6-A-04 | Rule | Disabled days or times cannot be booked from the staff drawer or the portal | Matches | § F-1 AC F-1-1 | ScheduleAppointmentDrawer.tsx:987-993; PatientBookingScreen.tsx:514-531 | Specialist mode only. Service mode ignores provider hours by design (serviceAvailability.ts:199). Weakened by G6-E-11. |
| G6-A-05 | Flow | Lunch break shaded on calendar | PRD-only (not built) | § F-1 worked example | — | |
| G6-A-06 | Rule | Pre-visit and post-visit buffers | PRD-only (not built) | § F-2.1, F-2.2, AC F-2-1 | — | Back-to-back slots are generated. (G6-Q-05) |
| G6-A-07 | Rule | Slot quantisation | Contradicts or stale | § F-2.3 | ScheduleAppointmentDrawer.tsx:1014; serviceAvailability.ts:142 | The build steps by service duration from the shift start (for example, 45-minute slots at 09:00, 09:45, 10:30), not on fixed :00/:15/:30/:45 marks. (G6-Q-06) |
| G6-A-08 | Flow | Days off: date or range, time window, reason, repeat yearly, remove | Partial (PRD less detailed) | § 1. Module Summary | TeamAvailabilityTab.tsx:651-707 | The PRD only mentions days off in the summary. |
| G6-A-09 | Rule | Day-off ranges and "repeat yearly" block bookings | Prototype defect | — | TeamAvailabilityTab.tsx:656-659, 673-676 | see G6-E-12 |
| G6-A-10 | Rule | Partial-day off precision | Prototype defect | — | TeamAvailabilityTab.tsx:666-671 | see G6-E-13 |
| G6-A-11 | Rule | Overlap check across a member's locations on save | Missing in PRD | — | TeamAvailabilityTab.tsx:565-606 | |
| G6-A-12 | Rule | Location hours and closures limit member hours and slots | Missing in PRD | — | TeamAvailabilityTab.tsx:112-157, 527-545; ScheduleAppointmentDrawer.tsx:899-927 | |
| G6-A-13 | Rule | Member active/inactive per location | Missing in PRD | — | TargetUserLocationBar.tsx:157-167 | |
| G6-A-14 | Rule | Hidden availability override for "admin" / ID 1 | Prototype defect | — | ScheduleAppointmentDrawer.tsx:971-974 | see G6-E-14 |
| G6-A-15 | Rule | Second and third shifts are used for booking | Prototype defect | § F-1.3 | ScheduleAppointmentDrawer.tsx:939-944 | see G6-E-11 |
| G6-A-16 | Rule | End time after start time | Prototype defect | § F-1.2 | TeamAvailabilityTab.tsx:527-561 | see G6-E-10 |

### C.4 Booking drawer, lifecycle and detail drawer (no PRD file)
| ID | Type | Item | Status | PRD ref | Prototype ref | Notes / impact |
|---|---|---|---|---|---|---|
| G6-B-01 | Flow | Four-section booking drawer (Service → Location → Participants → Schedule), with required fields and disabled save | Missing in PRD | — | ScheduleAppointmentDrawer.tsx:1179-1183, 1281-1291, 1314-1500 | |
| G6-B-02 | Rule | Only services "available for appointment" are offered, showing prepaid, price and duration | Missing in PRD | — | ScheduleAppointmentDrawer.tsx:505-506, 1213 | |
| G6-B-03 | Rule | Locations limited to those where the service is enabled; a single option is auto-picked; session type follows location | Missing in PRD | — | ScheduleAppointmentDrawer.tsx:623-641, 1090-1099 | |
| G6-B-04 | Rule | Specialist mode vs service mode depends on whether a responsible provider is chosen | Missing in PRD | — | ScheduleAppointmentDrawer.tsx:643-649 | |
| G6-B-05 | Rule | Specialist slot generation (provider hours × location hours × days off × service duration) | Missing in PRD | — | ScheduleAppointmentDrawer.tsx:845-1043 | |
| G6-B-06 | Rule | Service-mode seat capacity per slot ("N left") | Missing in PRD | — | serviceAvailability.ts:118-197 | |
| G6-B-07 | Rule | Provider double-booking detection | Prototype defect | — | ScheduleAppointmentDrawer.tsx:995-1009 | see G6-E-15 |
| G6-B-08 | Rule | Booking requires a valid open slot | Prototype defect | — | ScheduleAppointmentDrawer.tsx:1102-1114, 1179-1183 | see G6-E-16 |
| G6-B-09 | Rule | Saved duration equals the service duration | Prototype defect | — | Appointments.tsx:780 | see G6-E-17 |
| G6-B-10 | X-ref | Booking sources: staff, portal "MA-Client", kiosk "Walked In", AI/rule "ai", import; booking rules can match on source | Missing in PRD | — | appointmentService.ts:183, 244-262; PatientBookingScreen.tsx:689; mockMaClient.ts:1158, 1169; ruleEngine.ts:975 | |
| G6-B-11 | Rule | Staff can choose the booking source | Prototype defect | — | Appointments.tsx:424, 792 | see G6-E-18 |
| G6-B-12 | Rule | Conflicts checked when saving through any channel | Prototype defect | — | appointmentService.ts:630-758 | see G6-E-19 |
| G6-B-13 | Rule | Workflow routing: matching booking rule → workflow assigned to the service → chosen workflow; initial stage | Missing in PRD | — | appointmentService.ts:653-700 | |
| G6-B-14 | Rule | Booking gated on appointment automation | Missing in PRD | — | appointmentService.ts:26-33, 639-648 | |
| G6-B-15 | X-ref | Invoice at booking: on by default for prepaid services or when an appointment-to-invoice automation exists; service price and tax as line item; one invoice per appointment; invoice number in toast | Missing in PRD | — | ScheduleAppointmentDrawer.tsx:1117-1145; appointmentService.ts:801-834; invoiceService.ts:601-610; Appointments.tsx:803-807 | |
| G6-B-16 | Rule | Prepaid deposit honoured | Prototype defect | — | ScheduleAppointmentDrawer.tsx:1120-1122, 1142 | see G6-E-20 |
| G6-B-17 | Rule | Invoice fallback values | Prototype defect | — | appointmentService.ts:814, 819 | see G6-E-21 |
| G6-B-18 | Flow | Reschedule saves every edited field | Prototype defect | — | Appointments.tsx:744-745; appointmentService.ts:869-875 | see G6-E-22 |
| G6-B-19 | Flow | Cancel: status, reason, activity, event, linked invoice voided | Missing in PRD | — | appointmentService.ts:918-969 | |
| G6-B-20 | Rule | Cancel never voids a paid invoice | Prototype defect | — | appointmentService.ts:958-966 | see G6-E-23 |
| G6-B-21 | Flow | Complete: rule-driven or default completed stage, stage-move log, event | Missing in PRD | — | appointmentService.ts:975-1057 | |
| G6-B-22 | Flow | No-show: status and stage, activity, event (invoice untouched) | Missing in PRD | — | appointmentService.ts:1064-1132 | No-show fee is undefined. (G6-Q-10) |
| G6-B-23 | Flow | Detail drawer: stage ribbon, Overview, Documents, Invoices, Calls, AI Scribe fill | Missing in PRD | — | AppointmentDetailDrawer.tsx:128, 383-502, 779-1036 | |
| G6-B-24 | Rule | Drawer date/time edit is checked against availability | Prototype defect | — | AppointmentDetailDrawer.tsx:355-367 | see G6-E-24 |
| G6-B-25 | Flow | Calls tab data | Prototype defect | — | AppointmentDetailDrawer.tsx:668-697 | see G6-E-25 |
| G6-B-26 | Metric | Invoices tab KPIs: Total Invoiced, Paid, Outstanding | Missing in PRD | — | AppointmentDetailDrawer.tsx:648-655, 927-939 | Computed: Total = sum of non-void totals; Paid = sum of paid totals; Outstanding = sum of sent, viewed and overdue totals. |
| G6-B-27 | Rule | Invoices tab scope | Prototype defect | — | AppointmentDetailDrawer.tsx:624-633 | see G6-E-26 |
| G6-B-28 | Flow | Complete / No-show / Cancel from drawer | Prototype defect | — | AppointmentDetailDrawer.tsx:71-74, 115-118 | see G6-E-27 |
| G6-B-29 | Rule | [SECURITY] Role-based visibility and actions | Prototype defect | — | Appointments.tsx:338-340 | see G6-E-28 |
| G6-B-30 | Rule | Reminders: a "Reminder" stage sends a WhatsApp step when the appointment enters it; no time-based reminder schedule | Missing in PRD | — | useProcessStore.ts:421-440 | (G6-Q-11) |

---

## D. Correct flow as built (PRD-ready)

### D.1 Replacement for `content/client/appointments/calendar.md`

| Product | CLIENT |
| :--- | :--- |
| Module | APPOINTMENTS |
| Channel | CALENDAR |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Companion (patient portal) | Patient self-booking | Appointments booked in the portal (source "MA-Client") are saved to the same appointment list and appear on the calendar on the booked date. | [View in Companion](/companion/appointments) |
| AI Receptionist (kiosk) | Walk-in and kiosk bookings | Kiosk bookings (source "Walked In" or "MA-Client") appear on the calendar. | [View in AI Receptionist](/ai-receptionist/checkin/scheduled) |
| Automation | Reschedule event | Rescheduling emits an "appointment rescheduled" event that automations can use to message the patient. | [View in Automation](/automation) |

## 1. Module Summary
- The Calendar mode of Appointments shows a month grid of appointments and a side panel listing the selected day's appointments, with a quick way to book on that day.
- The toolbar's provider filter and search apply to the calendar.
- Clicking an appointment in the side panel opens the reschedule drawer.

## 2. Feature Requests

### F-1: Month Calendar Grid & Day Panel
#### 1. What it does
Shows the month with up to three appointment titles per day and "+N more", highlights today, and lists the selected day's appointments in a side panel.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Month navigation | Buttons | Previous month, Today, next month | Today also selects today's date |
| F-1.2: Day cell | Grid cell | Shows up to three appointment titles and "+N more" | Clicking selects the day |
| F-1.3: Day panel | Side panel | Lists the selected day's appointments with title, start–end time (start plus duration), provider, location and status | The count shows the number of appointments on that date after the provider filter |
| F-1.4: Book for this day | Button | Opens the booking drawer with the date pre-filled | Also shown inside the empty state |
| F-1.5: Provider filter | Toolbar filter | Limits the grid and panel to one provider | |
| F-1.6: Status display | Badge / colour | Shows each appointment's real status (Booked, Completed, Cancelled, No-show, Rescheduled) | Decision needed: should cancelled and no-show appointments be hidden or styled differently? (see G6-Q-02) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Coordinator reviews 14 November | Clicks 14 in the month grid | **The panel lists that day's appointments with time ranges and providers** |
| 2 | The day has no bookings | Clicks "Book for this day" | **The booking drawer opens with 14 November pre-filled** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Practice Coordinator | When reviewing clinic capacity, I want to see the month at a glance and open any day, so that I can spot busy and empty days. |
| F-1-J2 | Doctor | When starting my day, I want to filter to my own appointments, so that I can prepare in advance. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given the month grid, when a day is clicked, the panel lists only that date's appointments that pass the provider filter. |
| F-1-2 | Given a provider filter, only that provider's appointments appear in the grid and the panel. |
| F-1-3 | Given an appointment of any status, the panel badge shows that appointment's actual status. |

### F-2: Room Allocation
#### 1. What it does
Assigns a room automatically from the rooms setup, using the selected service, the physical location and the responsible provider. The room is shown in the booking drawer and stored on the appointment.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Auto-allocated room | Read-only box | Shows room number, name, location and directions | Shown only when a physical location, a service and a provider are chosen |
| F-2.2: No room mapped | Notice | Shown when no room matches | Booking still allowed |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Room 2 at Main Clinic is mapped to Dr. Jenkins | Books Dr. Jenkins at Main Clinic | **"Auto-allocated Room #2" appears and is saved on the appointment** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Clinic Administrator | When booking, I want the room filled in for me, so that the patient and the kiosk know where to go. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a room mapped to the service, location and provider, the booking stores that room. |
| F-2-2 | Given an online location, no room is allocated. |

### F-3: Reschedule from Calendar
#### 1. What it does
Clicking an appointment in the day panel opens the reschedule drawer, where a new date and slot can be picked. Saving updates the appointment, logs an activity entry showing the previous date and time, and emits an "appointment rescheduled" event.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Reschedule drawer | Drawer | Pre-filled with the current details | See List / Booking PRD |
| F-3.2: Audit entry | Logic | "Rescheduled to X (was Y)" activity entry | |
| F-3.3: Patient notification | Logic | Decision needed: automatic message or opt-in checkbox? (see G6-Q-14) | Today it is sent only if an automation is set up |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient asks to move from 10:00 to 11:00 | Opens the appointment from the day panel, picks 11:00, clicks Save Changes | **The appointment moves to 11:00 and the activity log records the old time** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Medical Assistant | When a patient asks for a new time, I want to reschedule from the calendar, so that the change is quick and recorded. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given a rescheduled appointment, the record shows the new date and time and an activity entry records the previous ones. |
| F-3-2 | Given a new slot, it must pass the same availability and conflict rules as a new booking (see the Booking PRD). |

### Not yet built
- Day and Week views, provider columns, current-time line, 15/30/60-minute granularity (Decision needed: required for MVP? see G6-Q-01).
- Manual room selection, a room double-booking warning, equipment tags (see G6-Q-02).
- Drag-and-drop rescheduling with a confirmation modal.
- Real-time slot locking for portal bookings.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Month Calendar Grid & Day Panel | F-1.1–F-1.6 | Month view with a day panel, provider filter and book-for-day. |
| F-2 | Room Allocation | F-2.1, F-2.2 | Room assigned automatically from service, location and provider. |
| F-3 | Reschedule from Calendar | F-3.1–F-3.3 | Open an appointment from the calendar and move it with an audit entry. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Practice Coordinator | See the month and open any day to check capacity. | F-1 |
| 2 | Doctor | Filter to my own appointments. | F-1 |
| 3 | Clinic Administrator | Have the room filled in automatically. | F-2 |
| 4 | Medical Assistant | Reschedule quickly with a record of the change. | F-3 |

---

### D.2 Replacement for `content/client/appointments/list.md`

| Product | CLIENT |
| :--- | :--- |
| Module | APPOINTMENTS |
| Channel | LIST |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| AI Receptionist (kiosk) | Kiosk check-in | When a patient checks in at the kiosk, the matching appointment records the check-in time. Decision needed: should the appointment also move to an "Arrived" status, and should the List show the time and queue token? (see G6-Q-04) | [View in AI Receptionist](/ai-receptionist/checkin/scheduled) |
| Processes / Automation | Appointment workflows | The List is scoped to one appointment workflow, and the stage pills are that workflow's stages. | [View Processes](/deals) |
| Invoices | Cancel voids the invoice | Cancelling an appointment voids its unpaid invoice. | [View in Invoices](/invoices) |

## 1. Module Summary
- The List mode is the default view of Appointments. It shows a table of appointments for the selected workflow, with stage pills, search, a provider filter, import and export.
- Each row has a stage bar for quick stage moves and actions for View, Reschedule, Complete, No Show and Cancel.
- Clicking a row opens the appointment detail drawer.

## 2. Feature Requests

### F-1: Workflow-Scoped Appointments Table
#### 1. What it does
Lists appointments in the selected appointment workflow, with stage filter pills, search and a provider filter.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Workflow selector | Dropdown | Picks the appointment workflow. A URL with a process shows a fixed badge instead | Defaults to the first workflow for the organisation |
| F-1.2: Stage pills | Filters | "All" plus one pill per stage of the selected workflow | Count = appointments in the selected workflow at that stage. Decision needed: final status vocabulary (see G6-Q-03) |
| F-1.3: Search | Search input | Matches appointment ID, client name, email, phone, notes and title | Client-side, instant |
| F-1.4: Provider filter | Filter | Limits rows to one provider | |
| F-1.5: Columns | Table | Appointment ID (APT-0000), Title, Stages, Client, Date, Time (with duration), Provider, Service | Decision needed: add Room, Visit Reason, Copay? (see G6-Q-03) |
| F-1.6: Empty state | Message | "No appointments found. Adjust your filters or book a new appointment." | |
| F-1.7: Deep link | URL | `?id=` opens the List filtered to that appointment's client | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist wants no-shows | Clicks the "No-show" pill | **The table shows only no-show appointments in this workflow, and the pill count equals the row count** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Receptionist | When managing the day, I want to filter by stage and provider, so that I can work the right queue. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a stage pill, clicking it shows only appointments at that stage in the selected workflow. |
| F-1-2 | Given any pill, its count equals the number of rows it would show. |

### F-2: Row Actions & Stage Moves
#### 1. What it does
Lets staff move an appointment through its lifecycle from the table.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Stage bar | Inline control | Moves the appointment to the clicked stage, logs a stage move and an activity entry | The status follows the stage category (Completed, Cancelled, No-show, Rescheduled, Booked) |
| F-2.2: View Details | Action | Opens the detail drawer | |
| F-2.3: Edit Details | Action | Opens the detail drawer with its sections ready to edit | |
| F-2.4: Reschedule | Action | Opens the booking drawer in reschedule mode | |
| F-2.5: Mark as Complete | Action | Moves to the completed stage (by rule or default) | Hidden when already complete |
| F-2.6: No Show | Action | Sets no-show status and stage | Hidden when no-show or cancelled |
| F-2.7: Cancel | Action (danger) | After confirmation, sets cancelled, logs the reason and voids the unpaid invoice | Paid invoices are not voided. Decision needed: refund or credit for paid/prepaid (see G6-Q-09) |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient cancels by phone | Chooses Cancel and confirms | **Status becomes Cancelled, the activity log records it, and an unpaid invoice is voided** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Front Desk Staff | When a visit ends or is missed, I want to update it in one click, so that records and billing stay right. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given Cancel, a confirmation is required before anything changes. |
| F-2-2 | Given a stage move to No-show, the status becomes No-show. |
| F-2-3 | Given a paid invoice, cancelling the appointment does not void it. |

### F-3: Import & Export
#### 1. What it does
Brings appointments in from CSV, webhook or an integration, and exports filtered appointments.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: CSV import | Upload | Template download, then upload. Each row becomes an appointment using its service, provider, date, time (HH:MM) and duration | Errors for no file, no data rows, parse failure |
| F-3.2: Webhook | Info | Endpoint and sample payload | |
| F-3.3: Integration | Tab | Shared integration sync | |
| F-3.4: Export | Modal | Status filter, 12 fields (ID, client, contact, date, time, duration, status, service, provider, location, notes) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Migrating from another system | Uploads the CSV template | **"Imported N appointment(s)" and the rows appear in the List** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Practice Manager | When onboarding, I want to import my existing bookings, so that I do not re-key them. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given a CSV row with service and provider, the imported appointment uses them. |

### Not yet built
- "Mark Arrived" button, arrival time, Wait Time column, clinician notification, queue token in the List (see G6-Q-04).
- Date range filter (Today default), sortable columns, provider-name search.
- Bulk reschedule.
- Role-based scoping: Decision needed: which roles can see other providers' appointments and cancel them? (see G6-Q-12)

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Workflow-Scoped Appointments Table | F-1.1–F-1.7 | Table of appointments per workflow with stage pills, search and provider filter. |
| F-2 | Row Actions & Stage Moves | F-2.1–F-2.7 | Lifecycle actions and stage moves from the table. |
| F-3 | Import & Export | F-3.1–F-3.4 | CSV, webhook and integration import, plus export. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist | Filter by stage and provider. | F-1 |
| 2 | Front Desk Staff | Update visits in one click. | F-2 |
| 3 | Practice Manager | Import existing bookings. | F-3 |

---

### D.3 Replacement for `content/client/appointments/availability.md`

| Product | CLIENT |
| :--- | :--- |
| Module | APPOINTMENTS |
| Channel | AVAILABILITY |
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Settings → Locations | Location hours and closures | Member hours cannot fall outside location hours. Closed days cannot be enabled. | [View Locations](/settings) |
| Companion (patient portal) | Provider slots | Portal specialist slots use the same member hours and days off. | [View in Companion](/companion/appointments) |

## 1. Module Summary
- The Availability mode sets each team member's weekly working hours per location, and their days off.
- Hours are limited by the location's opening hours. A member cannot work overlapping hours at two locations.
- Booking slots in specialist mode come from these hours.

## 2. Feature Requests

### F-1: Weekly Hours per Member and Location
#### 1. What it does
For a selected member and location, sets which weekdays they work and one or more shifts per day.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Member and location pickers | Dropdowns | Choose whose schedule and where | A per-location "active" switch is available |
| F-1.2: Day toggles | Switches | Enable or disable each weekday | Days the location is closed cannot be enabled |
| F-1.3: Shift times | Time selects | Start and end from 06:00 to 22:00 | Clamped to location hours. End must be after start. Decision needed: 15- or 30-minute steps (see G6-Q-06) |
| F-1.4: Multiple shifts | Button | Add or remove shifts per day | Decision needed: cap of 3? (see G6-Q-16) |
| F-1.5: Save with overlap check | Button | Blocks save if a shift overlaps the member's shift at another location, naming the overlap | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dr. Patel works Tuesday 09:00–12:30 and 13:30–17:00 | Enables Tuesday and adds two shifts | **Specialist booking slots are offered only inside both shifts** |
| 2 | Dr. Patel already works Tuesday mornings at Branch B | Saves a Tuesday 09:00 shift at Main Clinic | **Save is blocked: "Overlap detected on Tuesday…"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Doctor | When setting my hours, I want breaks and other sites respected, so that patients cannot book me when I am unavailable. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given disabled days or times outside every shift, no specialist slots are offered in the staff drawer or the patient portal. |
| F-1-2 | Given two shifts in a day, slots are generated in both. |
| F-1-3 | Given an end time at or before the start time, save is blocked with an error. |

### F-2: Days Off
#### 1. What it does
Records a member's days off across all locations.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Date or range | Date inputs | Single day or a start–end range | Every date in the range blocks bookings |
| F-2.2: Time window | Time inputs | All day or part of a day | Decision needed: exact window vs morning/afternoon (see G6-Q-17) |
| F-2.3: Reason | Text | Optional | |
| F-2.4: Repeat yearly | Checkbox | The day off recurs every year | |
| F-2.5: Remove | Action | Deletes a day off | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Dr. Patel is away 20–22 Dec | Adds a range | **No specialist slots are offered on 20, 21 or 22 Dec, and the drawer shows the day-off reason** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When staff take leave, I want their calendar blocked, so that no one is booked by mistake. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a day-off range, every date in it has no slots for that member. |
| F-2-2 | Given a repeat-yearly day off, the same date is blocked in later years. |

### Not yet built
- Pre-visit and post-visit buffers (see G6-Q-05).
- Slot quantisation to fixed marks (today slots step by service duration; see G6-Q-06).
- Lunch-break shading on the calendar.

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Weekly Hours per Member and Location | F-1.1–F-1.5 | Weekly shifts per member per location, limited by location hours, no cross-location overlap. |
| F-2 | Days Off | F-2.1–F-2.5 | Full or partial days off, ranges and yearly repeats that block bookings. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Doctor | Keep patients from booking outside my hours. | F-1 |
| 2 | Practice Manager | Block calendars during leave. | F-2 |

---

### D.4 New file proposal: `content/client/appointments/booking.md` (layout of list.md)

| Product | CLIENT |
| :--- | :--- |
| Module | APPOINTMENTS |
| Channel | BOOKING |
| Status | Draft |
| Created | 2026-11-12 |
| Last updated | 2026-11-12 |

## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| Services | Bookable services | Only services marked "available for appointment" can be booked. Duration, price, tax, prepaid flag, seats, locations and assigned staff come from the service. | [View Services](/services) |
| Invoices | Invoice on booking | An invoice is created at booking for prepaid services or when an appointment-to-invoice automation exists, one per appointment. | [View in Invoices](/invoices) |
| Rooms | Room auto-allocation | The room comes from the service, location and provider mapping. | [View Rooms](/settings) |
| Companion / AI Receptionist / Automation | Other booking sources | Portal ("MA-Client"), kiosk ("Walked In"), AI/rule ("ai") and import bookings use the same booking rules and appear in this module. | — |
| Activity / Automation | Lifecycle events | Booked, rescheduled, cancelled, completed, no-show and checked-in events are logged and trigger automations. | [View in Automation](/automation) |

## 1. Module Summary
- A single drawer books or reschedules an appointment in four steps: Service, Location, Participants, Schedule.
- Without a responsible provider, booking is by service seats at a location. With a provider, booking uses the provider's hours.
- The appointment enters a workflow stage, can create an invoice, and every lifecycle change is logged.

## 2. Feature Requests

### F-1: Booking Drawer
#### 1. What it does
Guides staff through Service → Location → Participants → Schedule and books the appointment.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-1.1: Service | Dropdown (required) | Bookable services with prepaid marker, price and duration | Sets the title and invoice line; resets the provider if not assigned to the service |
| F-1.2: Location | Dropdown (required) | Locations where the service is enabled | Auto-picked when only one qualifies; online means video |
| F-1.3: Schedule For | Dropdown (required) | The client | |
| F-1.4: Responsible | Dropdown (optional) | Providers assigned to the service at that location and active there | Chosen = specialist mode; empty = service mode |
| F-1.5: Date and slot | Date + slot grid (required) | Open slots only | First open slot is pre-selected; save is blocked when no open slot is selected |
| F-1.6: Booking source | Select | Decision needed: allowed values for staff bookings (see G6-Q-13) | |
| F-1.7: Room box | Read-only | Auto-allocated room or "No room mapped" | |
| F-1.8: Book button | Button | Disabled until all required fields and an open slot are set | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient wants a 30-min follow-up with Dr. Smith on Tuesday | Picks service, Main Clinic, the client, Dr. Smith, Tuesday and the 10:30 slot | **The appointment is saved for 10:30–11:00 at the service's duration, in the workflow's first stage, with the room** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-1-J1 | Receptionist | When a patient calls, I want to see only valid slots, so that I never double-book. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-1-1 | Given a booking, its saved duration equals the service duration. |
| F-1-2 | Given no open slot, the Book button stays disabled. |

### F-2: Slot & Conflict Rules
#### 1. What it does
Works out which times can be booked.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-2.1: Specialist slots | Logic | All of the provider's shifts at the location ∩ location hours, minus days off and closures, stepping by service duration | |
| F-2.2: Provider conflict | Logic | A slot is unavailable if it overlaps any of the provider's non-cancelled appointments | Decision needed: do completed or no-show appointments free the slot? Override allowed? (see G6-Q-07) |
| F-2.3: Service seats | Logic | Seats = location seat override, else service maximum seats, else 1. Remaining = seats minus overlapping non-cancelled service-mode bookings | Shown as "N left" |
| F-2.4: Every channel | Logic | The same rules apply to staff, portal, kiosk, AI and import bookings when they are saved | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Group class has 5 seats, 3 booked at 09:00 | Opens the 09:00 slot | **"2 left"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-2-J1 | Practice Manager | When bookings come from many channels, I want one set of rules, so that no channel overbooks. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-2-1 | Given a 09:00–10:00 booking, a 09:30 slot for the same provider is unavailable. |

### F-3: Workflow, Invoice & Prepaid
#### 1. What it does
Places the appointment in a workflow and handles billing.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-3.1: Workflow routing | Logic | Matching booking rule → workflow assigned to the service → chosen workflow; enters its initial stage | |
| F-3.2: Invoice at booking | Logic | For prepaid services or an appointment-to-invoice automation; line = service price and tax; one per appointment; the invoice number shows in the toast | Requires a known client |
| F-3.3: Prepaid amount | Logic | Decision needed: full price vs configured deposit, and is payment required before confirmation? (see G6-Q-08) | |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Books a prepaid Initial Consultation | Saves | **"Appointment scheduled — Invoice … created!"** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-3-J1 | Billing Staff | When a prepaid service is booked, I want the invoice created right away, so that payment can be collected. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-3-1 | Given an appointment with an invoice, rebooking or retrying does not create a second invoice. |

### F-4: Lifecycle (Reschedule, Cancel, Complete, No-show, Check-in, Reminders)
#### 1. What it does
Moves the appointment through its life, logs each step and emits events.

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
| F-4.1: Reschedule | Action | Saves the new date, time and any changed service, location or provider after slot validation; logs the previous time | Decision needed: allow changing provider/service/location? (see G6-Q-15) |
| F-4.2: Cancel | Action | Confirm; status Cancelled; reason in notes; unpaid invoice voided | Decision needed: paid/prepaid handling (see G6-Q-09) |
| F-4.3: Complete | Action | Completed stage by rule or default | |
| F-4.4: No-show | Action | No-show status and stage | Decision needed: no-show fee (see G6-Q-10) |
| F-4.5: Check-in | Logic | Records check-in time from the kiosk | Decision needed: status change to Arrived (see G6-Q-04) |
| F-4.6: Reminders | Stage step | The "Reminder" stage sends a WhatsApp message on entry | Decision needed: time-based schedule (see G6-Q-11) |
| F-4.7: Detail drawer | Drawer | Stage ribbon; Overview (editable, activity, AI Scribe fill); Documents; Invoices (this appointment's invoices, Total Invoiced = non-void total, Paid = paid total, Outstanding = sent/viewed/overdue total); Calls (the client's real call logs) | Date and time edits go through the reschedule rules |

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
| 1 | Patient misses the visit | Marks No Show | **Status and stage become No-show, the activity log records it, and the no-show event fires** |

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
| F-4-J1 | Front Desk Staff | When things change, I want one place to update the visit, so that billing and automations stay in step. |

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
| F-4-1 | Given each lifecycle action, an activity entry and the matching event are produced. |
| F-4-2 | Given the Invoices tab, only invoices linked to this appointment or this client's record are shown. |

### Not yet built
- Role-based permissions (see G6-Q-12).

## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
| F-1 | Booking Drawer | F-1.1–F-1.8 | Four-step booking with only valid slots. |
| F-2 | Slot & Conflict Rules | F-2.1–F-2.4 | Provider hours, overlap conflicts and service seats for every channel. |
| F-3 | Workflow, Invoice & Prepaid | F-3.1–F-3.3 | Workflow routing and invoice on booking. |
| F-4 | Lifecycle | F-4.1–F-4.7 | Reschedule, cancel, complete, no-show, check-in, reminders, detail drawer. |

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
| 1 | Receptionist | Only see valid slots. | F-1, F-2 |
| 2 | Practice Manager | One rule set across channels. | F-2 |
| 3 | Billing Staff | Invoice prepaid bookings immediately. | F-3 |
| 4 | Front Desk Staff | Update visits in one place. | F-4 |

---

## E. Prototype defects
| ID | What's wrong | File:line | Severity | Related C row |
|---|---|---|---|---|
| G6-E-01 | The calendar side panel shows "✓ CONFIRMED" for every appointment, including cancelled, completed and no-show ones. | AppointmentCalendarView.tsx:323 | Medium | G6-C-07 |
| G6-E-02 | Calendar dot colour follows list position (blue, green, purple, amber), not status. Cancelled and no-show appointments look like active ones and count toward the day total. | AppointmentCalendarView.tsx:197-204; Appointments.tsx:620-626 | Low | G6-C-08 |
| G6-E-03 | Pill counts use all appointments across every workflow, and stage pills also match on status category. The table below is filtered to one workflow, so counts and rows disagree. | Appointments.tsx:1227, 1234 vs 1054-1058 | Low | G6-L-03 |
| G6-E-04 | Stage and status drift apart. Choosing the No-show or Reminder stage from the row bar leaves the old status. A stage move from the drawer sets every stage except Completed and Cancelled to "scheduled", so a No-show stage can show status "scheduled". The default workflow has no Cancelled stage, so cancelled appointments keep their previous stage. | Appointments.tsx:255-259; appointmentService.ts:1190-1194; useProcessStore.ts:383 | Medium | G6-L-11 |
| G6-E-05 | "Edit Details" does the same as "View Details". The old edit modal code is never shown. | Appointments.tsx:1810-1815, 894-915 | Low | G6-L-13 |
| G6-E-06 | Cancel / Delete (row action) runs with no confirmation, voids the invoice, and cannot be undone. | Appointments.tsx:1853-1864 | Medium | G6-L-14 |
| G6-E-07 | Kiosk check-in only records the check-in time. The status does not change to checked in or Arrived, and the List and Calendar never show the time or token. The kiosk looks up the appointment in its own store by its own ID before calling check-in, so a staff-booked appointment may never be updated. | appointmentService.ts:1138-1147; mockMaClient.ts:1232-1233, 1378-1383 | High | G6-L-19 |
| G6-E-08 | CSV import ignores the template's service and duration columns and has no provider column. Every row gets the first provider and first service. The template's time format "10:00 AM" does not match the HH:MM format that slot and overlap logic expect. | Appointments.tsx:450, 485-495 | Medium | G6-L-21 |
| G6-E-09 | The help modal promises "Upcoming / Done / Pending" filters and a "guided 4-step flow". The filters do not exist. | Appointments.tsx:2031-2036 | Low | G6-L-26 |
| G6-E-10 | Shift end time is not checked against start. An inverted shift saves and silently produces no slots. | TeamAvailabilityTab.tsx:527-561 | Low | G6-A-16 |
| G6-E-11 | Booking uses only the first shift of the day. Second and third shifts are ignored, so afternoon shifts after a break offer no slots. | ScheduleAppointmentDrawer.tsx:939-944 | High | G6-A-15 |
| G6-E-12 | A day-off range is saved as text ("A to B") and booking matches only the exact date, so ranges never block anything. "Repeat yearly" is saved only as text in the reason and is never applied. | TeamAvailabilityTab.tsx:656-659, 673-676; ScheduleAppointmentDrawer.tsx:696, 863 | Medium | G6-A-09 |
| G6-E-13 | A partial day off is turned into "Morning" or "Afternoon", so a one-hour absence blocks half a day, or the wrong half. | TeamAvailabilityTab.tsx:666-671; ScheduleAppointmentDrawer.tsx:1016-1018 | Low | G6-A-10 |
| G6-E-14 | Hidden override: any provider whose name contains "admin", or whose ID is 1, is treated as working on days they have disabled. | ScheduleAppointmentDrawer.tsx:971-974 | Medium | G6-A-14 |
| G6-E-15 | Provider conflict check only blocks slots that start at exactly the same time. It ignores overlap (for example, an existing 09:00 60-minute visit does not block 09:30). It treats completed and no-show visits as booked. It never checks rooms. | ScheduleAppointmentDrawer.tsx:995-1009 | High | G6-B-07 |
| G6-E-16 | An appointment can be booked with no valid slot. The form only needs a date. When no slots exist (day off, closed) or all are full, the default 09:00 or the last-picked time is kept and saved. | ScheduleAppointmentDrawer.tsx:1102-1114, 1179-1183 | High | G6-B-08 |
| G6-E-17 | Every staff booking is saved with a 60-minute duration whatever the service. This gives wrong end times, and the seat and overlap maths blocks the following slots. | Appointments.tsx:780 | High | G6-B-09 |
| G6-E-18 | The staff drawer has no source field. Every staff booking is labelled "Inbound Call", which skews reporting and source-based automation rules. | Appointments.tsx:424, 792 | Medium | G6-B-11 |
| G6-E-19 | The service layer saves any time without a conflict or capacity check. Kiosk and portal bookings bypass the gate entirely, so double booking across channels is possible. | appointmentService.ts:630-758; mockMaClient.ts:1171-1186; PatientBookingScreen.tsx:692 | Medium | G6-B-12 |
| G6-E-20 | The service's prepaid deposit type and amount are never used. The invoice is always for the full service price. | ScheduleAppointmentDrawer.tsx:1120-1122, 1142; servicesStore.ts:25-26 | Medium | G6-B-16 |
| G6-E-21 | When no line items are passed, the invoice uses a placeholder price of 150. When the client is unknown, it is linked to client "c-1", so it lands on someone else's record. | appointmentService.ts:814, 819 | Medium | G6-B-17 |
| G6-E-22 | Reschedule saves only date, time and note. Service, location or provider changes made in the drawer are silently dropped, even though the drawer lets the user make them. | Appointments.tsx:744-745; appointmentService.ts:869-875 | Medium | G6-B-18 |
| G6-E-23 | Cancelling voids the linked invoice even when it is paid (the paid check only applies when no invoice ID is stored on the appointment). This affects every prepaid booking. | appointmentService.ts:958-966; invoiceService.ts:938-952 | High | G6-B-20 |
| G6-E-24 | Editing date or time in the detail drawer reschedules immediately with no slot, day-off or conflict check. | AppointmentDetailDrawer.tsx:355-367 | Medium | G6-B-24 |
| G6-E-25 | The Calls tab shows two made-up "Completed" calls with recordings when the client has no call logs. | AppointmentDetailDrawer.tsx:668-697 | Medium | G6-B-25 |
| G6-E-26 | [SECURITY] The Invoices tab and its totals include any invoice whose client name matches, so a patient with the same name sees another patient's invoices and amounts. | AppointmentDetailDrawer.tsx:624-633, 648-655 | Medium | G6-B-27 |
| G6-E-27 | The drawer receives Complete, No-show, Cancel and Reschedule handlers but has no buttons that call them. | AppointmentDetailDrawer.tsx:71-74, 115-118 | Low | G6-B-28 |
| G6-E-28 | [SECURITY] No role gating. The provider-only view (own appointments only, no provider filter) is a fixed internal value that cannot be turned on. Every client user can see all providers' appointments and cancel any of them. | Appointments.tsx:338-340, 1107-1109, 1240 | Medium | G6-B-29 |

## Open questions for PM
1. **G6-Q-01**: Are Day and Week views with provider columns (and the current-time line and granularity) required for MVP? Should clicking a calendar appointment open Details or Reschedule? (G6-C-02, G6-C-09)
2. **G6-Q-02**: Rooms: keep auto-allocation, add a manual override, or both? Is a time-based room double-booking warning required? How should cancelled and no-show appointments look on the calendar? (G6-C-10, G6-C-11, G6-E-02)
3. **G6-Q-03**: What is the canonical appointment status list (PRD: Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show; build: workflow stages Booked, Reminder, Completed, Reschedule, No-show)? Should the default workflow have a Cancelled stage? Which List columns are required (Room, Visit Reason, Copay)? (G6-L-01, G6-L-02, G6-E-04)
4. **G6-Q-04**: Should kiosk check-in set the status to "Arrived", and should the List show the arrival time, wait time and token? Is a staff "Mark Arrived" button needed? (G6-L-15, G6-L-19, G6-E-07)
5. **G6-Q-05**: Buffers: are they set per provider, per service or per location, and do they apply in service (seat) mode? (G6-A-06)
6. **G6-Q-06**: Should slots step by service duration (as built) or snap to fixed 15-minute marks? Should time pickers use 15- or 30-minute steps? (G6-A-02, G6-A-07)
7. **G6-Q-07**: Conflict rule: is overlap the definition? Do completed or no-show appointments free the slot? Can staff override with a warning? (G6-E-15, G6-E-16)
8. **G6-Q-08**: Prepaid: invoice the full price or the configured deposit? Must payment be captured before the booking is confirmed? (G6-E-20)
9. **G6-Q-09**: Cancelling a paid or prepaid appointment: refund, credit note, or keep paid? (G6-E-23)
10. **G6-Q-10**: Should a no-show create a fee or affect the invoice? (G6-B-22)
11. **G6-Q-11**: Reminders: is a time-based schedule (for example, 24 hours before) required, or is the stage-entry WhatsApp step enough? (G6-B-30)
12. **G6-Q-12**: Roles: which roles can see other providers' appointments, book for others, cancel, and edit availability? (G6-E-28)
13. **G6-Q-13**: Which booking sources should staff be able to choose (Inbound Call, Walked In, Email, etc.)? (G6-E-18)
14. **G6-Q-14**: Reschedule notification: automatic, opt-in checkbox, or automation-only? (G6-C-14, G6-C-15)
15. **G6-Q-15**: May a reschedule change the provider, service or location, or only the date and time? (G6-E-22)
16. **G6-Q-16**: Keep the PRD cap of 3 shifts per day? (G6-A-03)
17. **G6-Q-17**: Should partial days off be stored as an exact time window? (G6-E-13)
