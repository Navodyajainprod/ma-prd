import fs from "fs";
import path from "path";

// Define the comprehensive specification dataset for all modules across all 4 products
const PRD_DATA = [
  // ─────────────────────────────────────────────────────────────
  // 1. CLIENT PRODUCT
  // ─────────────────────────────────────────────────────────────
  // Appointments (Tabs: calendar, list, availability)
  {
    product: "client",
    module: "appointments",
    channel: "calendar",
    title: "Appointments Calendar & Multi-Provider Schedule",
    summary: "The Appointments Calendar in the Client workspace provides a multi-provider clinical scheduling surface supporting Day, Week, and Month views. Clinical coordinators and doctors use this view to manage daily patient visit volume, allocate consultation rooms, detect schedule conflicts, and drag-and-drop appointments to reschedule in real time.",
    crossProduct: {
      related: "Companion",
      change: "Patient Appointment Booking Synchronization",
      description: "When patients book or reschedule appointment slots through the Companion portal, booked visits appear immediately on the provider's calendar grid with real-time slot locking.",
      link: "/companion/appointments",
    },
    features: [
      {
        id: "F-1",
        name: "Provider Timeline Grid & View Mode Switcher",
        whatItDoes: "Renders provider appointment schedules in Day, Week, and Month view layouts with configurable 15, 30, and 60-minute time slot increments. Practice coordinators can toggle between an all-provider column view and individual clinician schedules.",
        includes: [
          ["F-1.1: Day/Week/Month View Switcher", "UI Toggle", "Switches between 1-day multi-column, 7-day week, and monthly calendar layouts", "Persists view mode across sessions"],
          ["F-1.2: Provider Column Headers", "UI Grid", "Displays provider avatar, name, and specialty as column headers in Day view", "Filters by selected provider"],
          ["F-1.3: Current Time Indicator Line", "UI Indicator", "Renders a red horizontal line tracking the real-time wall-clock hour across the calendar", "Updates every minute"],
          ["F-1.4: Time Slot Granularity Selector", "Dropdown", "Adjusts slot grid intervals between 15m, 30m, and 60m blocks", "Default is 30 minutes"],
        ],
        examples: [
          ["Practice coordinator reviews today's clinic schedule", "Selects Day view and all providers", "Calendar displays side-by-side columns for each active doctor with scheduled bookings"],
          ["Clinician reviews their weekly caseload", "Selects Week view and filters to their own name", "Renders 7-day personal schedule with confirmed patient visit blocks"],
        ],
        jobs: [
          ["F-1-J1", "Practice Coordinator", "When reviewing clinic capacity, I want to view all doctor schedules side-by-side, so that I can balance patient volume across available practitioners."],
          ["F-1-J2", "Doctor", "When starting my clinic day, I want to view my sequential appointments, so that I can prepare patient charts in advance."],
        ],
        criteria: [
          ["F-1-1", "Given the calendar view, when switching between Day, Week, and Month modes, the appointment grid updates instantly without full page reload."],
          ["F-1-2", "Given multiple providers, when filtering by a specific doctor, only that doctor's appointment blocks are visible."],
        ],
      },
      {
        id: "F-2",
        name: "Room Allocation & Clinical Resource Assignment",
        whatItDoes: "Assigns physical consultation rooms and specialized medical equipment (e.g., Ultrasound Room 2, Minor Procedure Room) to scheduled appointments, preventing double-booking of physical clinic resources.",
        includes: [
          ["F-2.1: Room Tag Selector", "Dropdown", "Assigns an active examination room (e.g. Exam Room 1-4, Procedure Suite) to the appointment", "Shows room availability"],
          ["F-2.2: Room Double-Booking Alert", "Warning Modal", "Triggers warning toast if another provider has already reserved the room for that time window", "Blocks save unless override confirmed"],
          ["F-2.3: Equipment Flag Tag", "Tag", "Attaches specialized clinical equipment tags (e.g., ECG, Dermatoscope) to the booking card", "Visual indicator on appointment card"],
        ],
        examples: [
          ["Coordinator assigns Exam Room 2 to Dr. Jenkins", "Selects Exam Room 2 from room dropdown", "Room badge 'Exam 2' appears on appointment block and reserves the room in room schedule"],
          ["Another staff member tries to assign Exam Room 2 at the same time", "Selects Exam Room 2 for conflicting booking", "System displays conflict warning: 'Exam Room 2 is already reserved by Dr. Jenkins'"],
        ],
        jobs: [
          ["F-2-J1", "Clinic Administrator", "When scheduling procedures, I want rooms and equipment checked for conflicts, so that doctors do not arrive to an occupied exam room."],
        ],
        criteria: [
          ["F-2-1", "Given an occupied room, when another appointment is assigned to the same room during overlapping times, the system flags a double-booking warning."],
        ],
      },
      {
        id: "F-3",
        name: "Interactive Drag-and-Drop Rescheduling & Patient Alert",
        whatItDoes: "Allows clinical staff to click, drag, and drop appointment cards to different time slots or different providers on the calendar grid. Moving an appointment automatically recalculates times and prompts an automated SMS/WhatsApp notification to the patient.",
        includes: [
          ["F-3.1: Draggable Appointment Card", "UI Component", "Appointment cards support mouse drag with shadow drop preview and time snapping", "Snaps to nearest slot grid interval"],
          ["F-3.2: Reschedule Confirmation Modal", "Modal", "Prompts coordinator to confirm new date/time/provider with checkbox to notify patient", "Shows before-and-after times"],
          ["F-3.3: Patient Notification Webhook", "Logic", "Dispatches automated WhatsApp/SMS message: 'Your appointment has been moved to [New Time]'", "Logs dispatch in patient thread"],
        ],
        examples: [
          ["Patient calls to delay appointment by 1 hour", "Staff drags appointment card from 10:00 AM to 11:00 AM", "Confirmation modal prompts 'Reschedule Sarah Johnson to 11:00 AM?'; staff clicks Confirm and patient receives SMS"],
        ],
        jobs: [
          ["F-3-J1", "Medical Assistant", "When a patient requests a time change over the phone, I want to drag their appointment to the new slot, so that rescheduling takes less than 5 seconds."],
        ],
        criteria: [
          ["F-3-1", "Given an appointment card, when dragged and dropped to a new time slot, the appointment record updates and an audit event is logged."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "appointments",
    channel: "list",
    title: "Appointments Table, Status Triage & Check-In Action",
    summary: "The Appointments List tab provides a high-density tabular view of all clinic appointments. Staff can filter by status (Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show), search by patient or provider, trigger immediate patient arrival check-in, and execute bulk rescheduling or export operations.",
    crossProduct: {
      related: "AI Receptionist",
      change: "Kiosk Check-In Real-Time Status Reflection",
      description: "When a patient checks in via the AI Receptionist kiosk, their status in the Appointments List updates to 'Arrived' with a green arrival timestamp badge.",
      link: "/ai-receptionist/checkin/scheduled",
    },
    features: [
      {
        id: "F-1",
        name: "Filterable Appointments Data Table with Status Badges",
        whatItDoes: "Displays scheduled visits in a structured table with sortable columns for Patient Name, Provider, Date/Time, Status, Assigned Room, Visit Reason, and Copay Amount. Includes quick status pills for rapid filtering.",
        includes: [
          ["F-1.1: Multi-Status Filter Pills", "UI Filters", "Quick filter buttons: All, Confirmed, Arrived, In Progress, Completed, Cancelled, No-Show", "Shows count badges"],
          ["F-1.2: Patient & Provider Search", "Search Input", "Typeahead query filtering table rows by patient name, phone number, or provider name", "Instant client-side filter"],
          ["F-1.3: Date Range Picker", "Date Range", "Filters appointments by Today, Tomorrow, This Week, This Month, or custom date range", "Defaults to Today"],
          ["F-1.4: Sortable Column Headers", "Table Header", "Sorts table ascending/descending by appointment time, patient name, or status", "Visual sort indicator"],
        ],
        examples: [
          ["Receptionist wants to see all arrived patients currently in the waiting lounge", "Clicks 'Arrived' filter pill", "Table filters to show only patients with 'Arrived' status and their arrival timestamps"],
        ],
        jobs: [
          ["F-1-J1", "Receptionist", "When managing the waiting area, I want to filter by 'Arrived' status, so that I know which patients are ready for nursing triage."],
        ],
        criteria: [
          ["F-1-1", "Given the appointments table, clicking any status filter pill isolates appointments matching that specific status."],
        ],
      },
      {
        id: "F-2",
        name: "Patient Arrival Check-In Action & Queue Trigger",
        whatItDoes: "Provides a single-click 'Mark Arrived' button on appointment rows. Clicking this action sets the appointment status to 'Arrived', logs the check-in time, generates a digital queue token, and alerts the attending clinician via desktop notification.",
        includes: [
          ["F-2.1: Mark Arrived Button", "Button", "Action button on table row transitioning appointment from Confirmed to Arrived", "Changes to green arrived badge"],
          ["F-2.2: Arrival Timestamp Logger", "Logic", "Records exact arrival time and calculates waiting duration against scheduled time", "Displayed in 'Wait Time' column"],
          ["F-2.3: Provider Notification Alert", "Toast Notification", "Fires in-app toast notification to assigned clinician: 'Patient [Name] has arrived'", "Includes sound chime"],
        ],
        examples: [
          ["Patient arrives at clinic reception desk", "Receptionist clicks 'Mark Arrived' on Sarah Johnson's appointment row", "Status turns green 'Arrived', arrival time 10:02 AM is logged, and Dr. Jenkins receives notification"],
        ],
        jobs: [
          ["F-2-J1", "Front Desk Staff", "When a patient walks in, I want to mark them arrived with one click, so that their waiting timer starts and the doctor is notified."],
        ],
        criteria: [
          ["F-2-1", "Given a confirmed appointment, clicking 'Mark Arrived' transitions status to Arrived and records the current timestamp."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "appointments",
    channel: "availability",
    title: "Provider Weekly Working Hours, Buffer & Days-Off Rules",
    summary: "The Working Hours & Buffer tab allows practice managers and clinicians to define recurring weekly availability schedules, configure pre-and-post visit buffer intervals, and designate planned days off and holiday blackouts.",
    features: [
      {
        id: "F-1",
        name: "Weekly Recurring Availability Hours Configuration",
        whatItDoes: "Enables clinicians to configure working hours for each day of the week (Monday through Sunday), including start time, end time, and split shifts (e.g. 09:00 - 13:00 and 14:00 - 17:00 with a 1-hour lunch break).",
        includes: [
          ["F-1.1: Day-of-Week Enabled Toggles", "Toggle Switches", "Individual switches enabling or disabling availability for Monday through Sunday", "Disabling day blocks all bookings"],
          ["F-1.2: Shift Start/End Time Pickers", "Time Inputs", "Configures shift start and end times in 15-minute increments", "Validates end time > start time"],
          ["F-1.3: Split Shift / Break Intervals", "Button & Input", "Allows adding secondary shift blocks to accommodate midday breaks or hospital rounds", "Supports up to 3 shifts per day"],
        ],
        examples: [
          ["Dr. Patel sets working hours for Tuesdays", "Enables Tuesday, sets 09:00 - 12:30 and 13:30 - 17:00", "Calendar slots are generated only within these hours; 12:30 - 13:30 is shaded as lunch break"],
        ],
        jobs: [
          ["F-1-J1", "Doctor", "When setting my clinic hours, I want to block out lunch breaks and hospital rounds, so that patients cannot book when I am unavailable."],
        ],
        criteria: [
          ["F-1-1", "Given disabled days or unconfigured time blocks, appointment booking slots are unavailable on both staff calendar and patient companion portal."],
        ],
      },
      {
        id: "F-2",
        name: "Pre-Visit Intake & Post-Visit Sanitization Buffer Rules",
        whatItDoes: "Defines automated buffer intervals before and after appointments (e.g., 10 minutes prior for nursing intake, 10 minutes post for room sanitization and charting). Buffers prevent back-to-back appointment overlap.",
        includes: [
          ["F-2.1: Pre-Visit Buffer Selector", "Dropdown", "Sets buffer before appointment start (0m, 5m, 10m, 15m) for patient intake", "Padded to calendar slot"],
          ["F-2.2: Post-Visit Buffer Selector", "Dropdown", "Sets buffer after appointment end (0m, 5m, 10m, 15m, 30m) for charting", "Blocks immediate re-booking"],
          ["F-2.3: Slot Quantization Interval", "Dropdown", "Rounds slot start times to fixed intervals (e.g., :00, :15, :30, :45)", "Ensures neat grid alignment"],
        ],
        examples: [
          ["Clinic sets 10-minute post-visit buffer", "Patient books 30-minute appointment at 10:00 AM", "Appointment spans 10:00 - 10:30; system automatically blocks 10:30 - 10:40 buffer; next available slot is 10:40 AM"],
        ],
        jobs: [
          ["F-2-J1", "Practice Manager", "When configuring appointment slots, I want automated sanitization buffers, so that providers have time to clean exam rooms between patients."],
        ],
        criteria: [
          ["F-2-1", "Given a post-visit buffer of 10m, the subsequent available booking slot is scheduled starting after the buffer interval."],
        ],
      },
    ],
  },
];

// Helper to write a complete markdown PRD
function buildMarkdownPrd(spec) {
  const channelMeta = spec.channel ? `\n| Channel | ${spec.channel.toUpperCase()} |` : "";
  const channelFrontmatter = spec.channel ? `channel: "${spec.channel}"\n` : "";
  
  let crossProductSection = "";
  if (spec.crossProduct) {
    crossProductSection = `
## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| ${spec.crossProduct.related} | ${spec.crossProduct.change} | ${spec.crossProduct.description} | [View in ${spec.crossProduct.related}](${spec.crossProduct.link}) |
`;
  }

  let featuresContent = "";
  spec.features.forEach((f) => {
    featuresContent += `
### ${f.id}: ${f.name}
#### 1. What it does
${f.whatItDoes}

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
${f.includes.map(([item, type, desc, notes]) => `| ${item} | ${type} | ${desc} | ${notes} |`).join("\n")}

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
${f.examples.map(([sit, action, res], idx) => `| ${idx + 1} | ${sit} | ${action} | **${res}** |`).join("\n")}

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
${f.jobs.map(([id, user, job]) => `| ${id} | ${user} | ${job} |`).join("\n")}

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
${f.criteria.map(([id, crit]) => `| ${id} | ${crit} |`).join("\n")}
`;
  });

  // Comprehensive Summary tables
  const summaryRows = spec.features.map((f) => {
    const subList = f.includes.map((i) => i[0].split(":")[0]).join(", ");
    return `| ${f.id} | ${f.name} | ${subList} | ${f.whatItDoes.split(".")[0]}. |`;
  }).join("\n");

  const jobsRows = spec.features.flatMap((f) => f.jobs).map((j, idx) => {
    return `| ${idx + 1} | ${j[1]} | ${j[2]} | ${j[0].split("-")[0]}-${j[0].split("-")[1]} |`;
  }).join("\n");

  return `---
title: "${spec.title}"
product: "${spec.product}"
module: "${spec.module}"
${channelFrontmatter}status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ${spec.product.replace("-", " ").toUpperCase()} |
| Module | ${spec.module.toUpperCase()} |${channelMeta}
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |
${crossProductSection}
## 1. Module Summary
- ${spec.summary}
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests
${featuresContent}
## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
${summaryRows}

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
${jobsRows}
`;
}

console.log("Ready to generate PRDs");

