import path from "path";
import { formatPrd, savePrd } from "./generator_helpers.mjs";

const rootDir = process.cwd();

const clientPrds = [
  // ── Appointments (3 tabs) ──
  {
    product: "client",
    module: "appointments",
    channel: "calendar",
    dest: "content/client/appointments/calendar.md",
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
    dest: "content/client/appointments/list.md",
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
    dest: "content/client/appointments/availability.md",
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

  // ── Processes (2 tabs) ──
  {
    product: "client",
    module: "processes",
    channel: "kanban",
    dest: "content/client/processes/kanban.md",
    title: "Clinical Process Pipeline Kanban Board",
    summary: "The Kanban Board within Process & Deals provides a visual, drag-and-drop clinical workflow board. Practice staff, coordinators, and medical assistants use this board to track patients moving across multi-stage care protocols (e.g. Lead Intake -> Insurance Verification -> Clinical Consultation -> Lab Diagnostic -> Post-Op Follow-up).",
    crossProduct: {
      related: "Companion",
      change: "Patient Workflow Stage Stepper Visualization",
      description: "When staff advance a patient across stages on the Kanban Board, the patient's Care Journey stepper in the Companion portal updates automatically to reflect their current clinical stage.",
      link: "/companion/today",
    },
    features: [
      {
        id: "F-1",
        name: "Visual Drag-and-Drop Stage Columns & Deal Cards",
        whatItDoes: "Renders active clinical processes as columns of stages with draggable patient cards. Moving a card from one column to another executes stage transition rules, updates timestamps, and triggers automated stage automations.",
        includes: [
          ["F-1.1: Multi-Stage Column Layout", "UI Columns", "Displays sequential columns with stage name, card count badge, and total revenue sum", "Configurable per process"],
          ["F-1.2: Draggable Process Card", "UI Card", "Cards display patient avatar, patient name, responsible coordinator, days in stage, and deal value", "Drag-and-drop support"],
          ["F-1.3: Quick Process Switcher", "Dropdown", "Switches between active clinical processes (e.g. Bariatric Care, Dental Implant, General Intake)", "Persists selected process"],
        ],
        examples: [
          ["Coordinator verifies patient insurance", "Drags Sarah Johnson's card from 'Insurance Verification' to 'Ready for Consultation'", "Card moves smoothly; stage update is logged, and attending physician is notified"],
        ],
        jobs: [
          ["F-1-J1", "Care Coordinator", "When reviewing my patient caseload, I want to visualize where each patient is in their care journey, so that I can eliminate clinical bottlenecks."],
        ],
        criteria: [
          ["F-1-1", "Given a patient card on the Kanban board, dragging it to an adjacent stage updates its stage state immediately across the database."],
        ],
      },
      {
        id: "F-2",
        name: "Stage Deal Value & Revenue Forecasting Metrics",
        whatItDoes: "Calculates and displays the aggregate commercial value of treatment plans currently residing in each stage column, along with weighted stage probabilities to estimate upcoming monthly clinic revenue.",
        includes: [
          ["F-2.1: Column Total Revenue Header", "UI Badge", "Displays sum of all patient deal values currently in that stage column", "Updates dynamically"],
          ["F-2.2: Stage Probability Weighting", "Metric", "Multiplies total column value by stage conversion probability percentage", "Shown in pipeline analytics"],
        ],
        examples: [
          ["Practice manager reviews 'Scheduled Surgery' stage", "Column header displays '$48,500 across 7 patients'", "Practice manager verifies revenue projection for the upcoming surgical block"],
        ],
        jobs: [
          ["F-2-J1", "Practice Manager", "When forecasting monthly clinic revenue, I want to see treatment values grouped by stage, so that I can track pending surgical conversions."],
        ],
        criteria: [
          ["F-2-1", "Given patient cards with treatment plan values, each column header accurately sums the active values in real time."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "processes",
    channel: "list",
    dest: "content/client/processes/list.md",
    title: "Process Instances Data Table & SLA Indicators",
    summary: "The Instances List tab provides a tabular, high-density view of all active and completed process instances. Coordinators can filter by responsible team member, identify instances exceeding stage SLA thresholds, and execute bulk reassignments.",
    features: [
      {
        id: "F-1",
        name: "Process Instances Filterable Table & SLA Countdown",
        whatItDoes: "Lists all running patient process instances with sortable columns: Patient Name, Process Name, Current Stage, Responsible Staff, Days in Stage, Deal Value, and SLA Timer.",
        includes: [
          ["F-1.1: Sortable Instances Table", "Data Table", "Displays patient name, current stage, responsible coordinator, and elapsed time in stage", "Sortable by any column"],
          ["F-1.2: SLA Violation Warning Badge", "UI Tag", "Highlights instances that have remained in a stage longer than the maximum allowed SLA in red", "Visual bottleneck alert"],
          ["F-1.3: Responsible Member Filter", "Dropdown", "Filters instance table to show only items assigned to a specific team member", "Includes 'Unassigned' option"],
        ],
        examples: [
          ["Supervisor checks for delayed patient charts", "Sorts table by 'Days in Stage' descending", "Three instances show red 'SLA Overdue (+3 days)' badge; supervisor reassigns them to clear backlog"],
        ],
        jobs: [
          ["F-1-J1", "Clinic Supervisor", "When monitoring care protocol compliance, I want to spot SLA violations, so that patients are not left waiting between clinical stages."],
        ],
        criteria: [
          ["F-1-1", "Given instances exceeding stage SLA thresholds, the system renders a high-visibility warning indicator."],
        ],
      },
    ],
  },

  // ── Settings (9 tabs) ──
  {
    product: "client",
    module: "settings",
    channel: "organization",
    dest: "content/client/settings/organization.md",
    title: "Practice Profile, Clinic Branding & Operating Locations",
    summary: "The Organization Settings tab allows practice administrators to configure clinic identity details: practice legal name, public branding logo, operational timezone, contact phone/email, and multi-location branch physical addresses.",
    features: [
      {
        id: "F-1",
        name: "Practice Legal Profile & Custom Brand Assets",
        whatItDoes: "Stores clinic profile metadata including legal entity name, medical director name, tax ID (EIN/GST), public brand logo upload, and brand primary color hex code.",
        includes: [
          ["F-1.1: Clinic Brand Logo Upload", "Image Uploader", "Uploads PNG/SVG practice logo used across headers, patient invoices, and companion portal", "Max 5MB file size"],
          ["F-1.2: Legal Entity Name & Tax ID", "Text Inputs", "Stores registered business name and clinical tax identification number", "Rendered on billing receipts"],
          ["F-1.3: Brand Primary Color Picker", "Color Input", "Sets brand primary color used for accents and buttons across patient-facing surfaces", "Hex code format"],
        ],
        examples: [
          ["Clinic admin sets practice branding", "Uploads 'Metro Health' logo and enters primary blue #1456f0", "Logo updates across client console topbar, patient invoices, and companion header"],
        ],
        jobs: [
          ["F-1-J1", "Practice Administrator", "When configuring our clinic workspace, I want our official branding and legal details recorded, so that invoices and communications look professional."],
        ],
        criteria: [
          ["F-1-1", "Given an uploaded logo, the image renders cleanly across client topbar and patient invoice headers."],
        ],
      },
      {
        id: "F-2",
        name: "Multi-Location Facility Registry & Geolocation",
        whatItDoes: "Manages physical practice clinic locations (e.g. Downtown Main Clinic, Westside Outpatient Center) with complete street address, suite number, and contact details.",
        includes: [
          ["F-2.1: Add Location Modal", "Modal", "Form capturing Location Name, Street Address, City, State, ZIP, and Phone Number", "Supports multi-location tenants"],
          ["F-2.2: Location Switcher Support", "Logic", "Associates staff members and appointment rooms with specific physical locations", "Filters data by active location"],
        ],
        examples: [
          ["Admin adds second branch location", "Fills 'Westside Outpatient, 450 Medical Pkwy'", "Location becomes available in appointment room selectors and patient booking dropdowns"],
        ],
        jobs: [
          ["F-2-J1", "Practice Administrator", "When opening a satellite clinic, I want to add its location to our tenant, so that appointments can be scheduled specifically for that site."],
        ],
        criteria: [
          ["F-2-1", "Given multiple configured locations, staff can filter appointment calendars and rooms by location."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "settings",
    channel: "team",
    dest: "content/client/settings/team.md",
    title: "Team Members, Role Assignment & Practitioner NPI Registry",
    summary: "The Team & Roles tab provides staff roster management: inviting providers via email, assigning role-based permissions (Admin, Doctor, Nurse, Coordinator, Billing), verifying practitioner NPI numbers, and configuring granular access controls.",
    features: [
      {
        id: "F-1",
        name: "Staff Roster Directory & Email Invitation Flow",
        whatItDoes: "Lists all practice team members with their avatar, email, assigned role, department, and active status. Administrators can dispatch email invitations with one-click role assignment.",
        includes: [
          ["F-1.1: Invite Team Member Modal", "Modal", "Captures First Name, Last Name, Email, and Role (Admin, Doctor, Nurse, Coordinator, Billing)", "Dispatches secure token invite link"],
          ["F-1.2: Status Tag & Resend Invite", "UI Actions", "Displays 'Active' or 'Pending Invite' status; provides one-click 'Resend Invite' button", "Invite expires after 7 days"],
          ["F-1.3: Active Status Toggle", "Switch", "Instantly deactivates former employee accounts without deleting historical encounter logs", "Revokes active session tokens"],
        ],
        examples: [
          ["Admin invites a new clinical coordinator", "Enters 'ananya.reddy@clinic.com' and assigns 'Coordinator' role", "Ananya receives email invite and logs in to set password"],
        ],
        jobs: [
          ["F-1-J1", "Practice Administrator", "When hiring staff, I want to send role-based email invites, so that new employees receive immediate access to their designated workspace."],
        ],
        criteria: [
          ["F-1-1", "Given an invited team member, clicking 'Resend Invite' re-dispatches the onboarding email with a fresh security token."],
        ],
      },
      {
        id: "F-2",
        name: "Practitioner NPI & State Medical License Registry",
        whatItDoes: "Captures and validates clinician credentials: 10-digit National Provider Identifier (NPI), state medical licensing numbers, and taxonomy codes required for insurance claim submissions.",
        includes: [
          ["F-2.1: 10-Digit NPI Field", "Text Input", "Stores clinician NPI number with format validation", "Auto-merges into CMS-1500 claims"],
          ["F-2.2: State License Number", "Text Input", "Stores state license ID and expiration date with renewal reminder alerts", "Warns 30 days before expiration"],
        ],
        examples: [
          ["Doctor enters credential profile", "Fills NPI '1234567890' and State License 'MD-98765'", "Credentials automatically populate into electronic insurance claims and prescription footers"],
        ],
        jobs: [
          ["F-2-J1", "Physician", "When onboarding, I want to store my NPI and medical license, so that clinical documentation and billing codes carry my verified credentials."],
        ],
        criteria: [
          ["F-2-1", "Given a doctor with recorded NPI, generated insurance claims include the doctor's NPI in Box 24J/33."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "settings",
    channel: "billing",
    dest: "content/client/settings/billing.md",
    title: "Subscription Plans, Payment Methods & Wallet Credits",
    summary: "The Billing & Plans tab allows administrators to manage their MantraAssist subscription tier, view credit balances (for AI Voice, Scribe minutes, and SMS segments), top up their wallet, and download past tax invoices.",
    features: [
      {
        id: "F-1",
        name: "Subscription Tier Display & Add-On Credit Balance",
        whatItDoes: "Displays current practice subscription plan (Starter, Growth, Enterprise), monthly renewal date, remaining credit balance in the practice wallet, and credit consumption meters.",
        includes: [
          ["F-1.1: Active Plan Card", "UI Card", "Shows plan tier name, monthly cost, renewal date, and included quotas", "Highlights upgrade options"],
          ["F-1.2: Live Wallet Credit Meter", "Progress Bar", "Displays remaining credits in clinic balance with color indicator (Green > 1000, Amber < 500, Red < 100)", "Updates in real time"],
          ["F-1.3: Top Up Credits Button", "Button & Modal", "Opens instant credit bundle purchase modal (1,000 / 5,000 / 10,000 credits)", "Charges saved Stripe card"],
        ],
        examples: [
          ["Admin checks credit balance", "Card shows '850 credits remaining'", "Admin clicks 'Top Up Credits', selects 5,000 bundle, and balance updates to 5,850 instantly"],
        ],
        jobs: [
          ["F-1-J1", "Practice Manager", "When credit balance runs low, I want to top up our wallet instantly, so that AI Scribe and patient SMS messaging are not interrupted."],
        ],
        criteria: [
          ["F-1-1", "Given a successful credit purchase, the practice wallet balance increments immediately and logs an invoice."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "settings",
    channel: "voices",
    dest: "content/client/settings/voices.md",
    title: "AI Voices, LLM Model Bindings & Speech Profiles",
    summary: "The AI Voices & Models tab configures the generative AI parameters used by MantraAssist: LLM model selection (GPT-4o, Claude 3.5, Gemini 1.5 Pro), temperature, system prompt guardrails, and synthetic speech synthesis voice profiles via ElevenLabs and OpenAI TTS.",
    features: [
      {
        id: "F-1",
        name: "LLM Model Binding & Clinical Safety Guardrails",
        whatItDoes: "Allows administrators to select which AI models power their clinic's automated triage responders and AI Scribe, configure creativity temperature (0.0 to 1.0), and inject required clinical disclaimers.",
        includes: [
          ["F-1.1: Model Provider Selector", "Dropdown", "Selects active model: GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro", "Default is GPT-4o"],
          ["F-1.2: Temperature Slider", "Slider Control", "Adjusts response determinism from 0.0 (strictly clinical) to 1.0 (conversational)", "Recommended 0.2 for medical triage"],
          ["F-1.3: Emergency Guardrail Prompt", "Textarea", "Injects mandatory 911 / emergency redirect instructions into every bot prompt", "Cannot be disabled"],
        ],
        examples: [
          ["Admin configures bot temperature", "Sets slider to 0.2 and enters clinic disclaimer", "AI responder adheres strictly to clinical protocols with deterministic responses"],
        ],
        jobs: [
          ["F-1-J1", "Medical Director", "When deploying AI triage, I want low temperature and mandatory emergency guardrails, so that patient safety is strictly maintained."],
        ],
        criteria: [
          ["F-1-1", "Given an emergency triage keyword (e.g. chest pain), the AI responder immediately returns the mandatory emergency directive."],
        ],
      },
      {
        id: "F-2",
        name: "Synthetic Voice Selection & Speech Speed Preview",
        whatItDoes: "Configures the synthetic voice used by telephony IVR and kiosk avatar: voice identity (Aria, Roger, Sarah), speech rate multiplier (0.8x to 1.5x), and live audio sample preview.",
        includes: [
          ["F-2.1: Voice Profile Dropdown", "Dropdown", "Selects ElevenLabs / OpenAI voice profile with accent and gender tags", "Includes preview play button"],
          ["F-2.2: Speech Rate Slider", "Slider Control", "Adjusts speech speed from 0.8x to 1.4x", "Default is 1.0x"],
        ],
        examples: [
          ["Admin tests voice profile", "Selects 'Aria (Female, Warm Clinical)' and clicks play sample", "Sample audio plays in browser; admin confirms voice for clinic reception kiosk"],
        ],
        jobs: [
          ["F-2-J1", "Practice Manager", "When configuring our phone greeting, I want a warm, professional voice, so that patients feel comfortable when calling the clinic."],
        ],
        criteria: [
          ["F-2-1", "Clicking the play sample button streams the synthetic voice preview audio with current speed settings."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "settings",
    channel: "custom-fields",
    dest: "content/client/settings/custom-fields.md",
    title: "Custom Fields, Dynamic Layout & Data Dictionary",
    summary: "The Custom Fields tab allows clinics to extend standard EHR entities (Patients, Appointments, Processes, Tasks) with specialty-specific custom attributes (e.g., Blood Group, Referring Physician, Preferred Language, Teeth Numbering) and organize them into grouped accordion sections.",
    features: [
      {
        id: "F-1",
        name: "Entity Field Builder & Specialty Attribute Manager",
        whatItDoes: "Enables adding custom fields to core entities with configurable field types: Text, Number, Dropdown Select, Multi-Select Checkboxes, Date Picker, Currency, and Boolean Yes/No.",
        includes: [
          ["F-1.1: Add Custom Field Modal", "Modal", "Captures Field Label, API Key, Entity (Client, Appointment, Process), and Field Type", "Validates unique key"],
          ["F-1.2: Dropdown Option List Manager", "Tags Input", "Adds and reorders select options for dropdown fields with optional badge colors", "Supports unlimited options"],
          ["F-1.3: Mandatory & Visible Flags", "Toggles", "Configures whether field is required on intake and visible on patient portal", "Enforces intake validation"],
        ],
        examples: [
          ["Dental clinic adds 'Tooth Number' field to appointments", "Creates Number field 'tooth_number' on Appointment entity", "Field appears on appointment drawer and intake forms"],
        ],
        jobs: [
          ["F-1-J1", "Clinic Administrator", "When tracking specialty clinical data, I want custom fields on patient charts, so that our EHR matches our specialty workflow."],
        ],
        criteria: [
          ["F-1-1", "Given a newly added custom field, it immediately appears on the corresponding entity drawer and edit forms."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "settings",
    channel: "integrations",
    dest: "content/client/settings/integrations.md",
    title: "Third-Party Integrations, Twilio SIP & Webhooks",
    summary: "The Integrations tab manages external service connections: Twilio SIP Telephony credentials, Meta WhatsApp Business API tokens, Stripe Connect payment gateway keys, and outbound custom webhook dispatchers.",
    features: [
      {
        id: "F-1",
        name: "Twilio Telephony & Meta WhatsApp API Credential Binding",
        whatItDoes: "Stores API credentials and verifies connectivity for carrier telecom trunks (Twilio Account SID, Auth Token) and Meta WhatsApp Cloud API (WABA ID, Access Token).",
        includes: [
          ["F-1.1: Twilio SIP Connection Card", "Config Card", "Input fields for Account SID, Auth Token, and default Caller ID phone number", "Includes 'Test Connection' button"],
          ["F-1.2: Meta WhatsApp Cloud Card", "Config Card", "Input fields for WABA ID, Phone Number ID, and Permanent System Token", "Verifies Meta webhook handshake"],
          ["F-1.3: Connection Status Indicator", "UI Badge", "Displays live 'Connected' (green) or 'Disconnected' (red) ping status", "Diagnostic error tooltips"],
        ],
        examples: [
          ["Admin enters Twilio credentials", "Pastes SID and Auth Token, clicks 'Test Connection'", "System verifies SIP trunk and displays green 'Connected' badge with active phone numbers"],
        ],
        jobs: [
          ["F-1-J1", "Practice Administrator", "When connecting our telephony, I want real-time API connection testing, so that I can verify call routing before going live."],
        ],
        criteria: [
          ["F-1-1", "Given valid Twilio credentials, testing connection returns HTTP 200 and displays green connected badge."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "settings",
    channel: "audit-logs",
    dest: "content/client/settings/audit-logs.md",
    title: "HIPAA Security Audit Logs & Access History",
    summary: "The Audit Logs tab records an immutable security ledger of all user authentications, patient record access events, medical record exports, and administrative configuration updates required for HIPAA compliance audits.",
    features: [
      {
        id: "F-1",
        name: "Immutable HIPAA Event Ledger & Access Trail",
        whatItDoes: "Captures and displays all system actions with timestamp, user ID, user name, IP address, action type (LOGIN, PHI_VIEW, RECORD_EXPORT, PERMISSION_CHANGE), and target patient ID.",
        includes: [
          ["F-1.1: Audit Event Table", "Data Table", "Columns: Timestamp, Actor, Action, Entity Type, Record ID, IP Address", "Read-only immutable log"],
          ["F-1.2: Action Type Filter", "Dropdown", "Filters events by Logins, Record Views, Chart Edits, Exports, and Deletions", "Aids security audits"],
          ["F-1.3: Compliance CSV Export", "Button", "Exports selected audit log range as a signed CSV file for compliance auditors", "Logs the export event itself"],
        ],
        examples: [
          ["Compliance officer reviews chart access", "Filters by patient 'Sarah Johnson'", "Audit trail lists every staff member who opened or edited Sarah's chart with timestamps"],
        ],
        jobs: [
          ["F-1-J1", "Compliance Officer", "When conducting a HIPAA audit, I want an immutable access trail, so that I can demonstrate compliance with federal security rules."],
        ],
        criteria: [
          ["F-1-1", "Every patient chart view event is logged with actor ID, IP address, and exact UTC timestamp."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "settings",
    channel: "security",
    dest: "content/client/settings/security.md",
    title: "Security, Two-Factor Authentication & Session Timeout",
    summary: "The Security & MFA tab configures practice authentication policies: mandatory Two-Factor Authentication (2FA) enforcement, inactivity session auto-lock timers, and IP address allowlisting.",
    features: [
      {
        id: "F-1",
        name: "Two-Factor Authentication (2FA) Enforcement & Session Timeout",
        whatItDoes: "Enforces mandatory TOTP 2FA for all staff members logging in to the practice tenant and configures the automatic session lock idle timeout (e.g. 15 minutes of inactivity).",
        includes: [
          ["F-1.1: Enforce 2FA Toggle", "Toggle Switch", "Mandates that all staff set up authenticator app 2FA upon their next login", "Cannot be bypassed by non-admins"],
          ["F-1.2: Inactivity Timeout Selector", "Dropdown", "Configures session lock timeout: 5m, 15m, 30m, 60m", "Recommended 15m for HIPAA"],
          ["F-1.3: IP Address Allowlist", "Textarea", "Restricts login to specified clinic static IP addresses or CIDR subnets", "Blocks unauthorized remote logins"],
        ],
        examples: [
          ["Practice enforces 15m auto-lock", "Doctor steps away from workstation for 16 minutes", "Screen locks automatically with password re-prompt to protect patient privacy"],
        ],
        jobs: [
          ["F-1-J1", "Practice Administrator", "When protecting patient health information, I want automatic workstation locking, so that unattended screens do not expose patient charts."],
        ],
        criteria: [
          ["F-1-1", "Given 15 minutes of zero keyboard/mouse activity, the application locks and requires password re-entry."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "settings",
    channel: "reception",
    dest: "content/client/settings/reception.md",
    title: "Reception Kiosk, Stations CRUD & Queue Rules",
    summary: "The Reception Kiosk Settings tab allows practice administrators to configure physical clinic stations (Doctor consultation rooms, Labs, Pharmacy, Billing counters), set queue token prefixes (D-, P-, L-, B-, R-), and define arrival buffers for kiosk check-in.",
    crossProduct: {
      related: "AI Receptionist",
      change: "Kiosk Station & Queue Configuration Propagation",
      description: "Stations and queue buffers configured in Client Settings dictate the physical room routing, wayfinding maps, and token prefixes generated by the AI Receptionist kiosk.",
      link: "/ai-receptionist/settings/stations",
    },
    features: [
      {
        id: "F-1",
        name: "Physical Stations & Consultation Rooms CRUD",
        whatItDoes: "Provides an administrative interface to create, edit, and delete physical stations within the clinic: Station Name, Station Type (doctor_room, lab, billing, pharmacy, reception_desk), Room Number, Assigned Clinician, and Active Toggle.",
        includes: [
          ["F-1.1: Station List Table", "Data Table", "Displays all configured stations with type badges, room numbers, and assigned providers", "Editable inline or via modal"],
          ["F-1.2: Add/Edit Station Modal", "Modal", "Captures Station Name, Type dropdown, Room Number, Provider Name, and Active switch", "Persists to localStorage and DB"],
          ["F-1.3: Delete Station Confirmation", "Dialog", "Confirms station deletion with validation that no active appointments are currently routed there", "Protects active visits"],
        ],
        examples: [
          ["Admin adds new Diagnostic Lab station", "Enters 'Phlebotomy Room', type 'lab', room '104'", "Station appears in wayfinding directory and kiosk directions immediately"],
        ],
        jobs: [
          ["F-1-J1", "Clinic Manager", "When setting up clinic rooms, I want to register our physical stations, so that the AI Receptionist kiosk routes patients to the correct doors."],
        ],
        criteria: [
          ["F-1-1", "Given an active station, it appears as an available destination in AI Receptionist directions and check-in routing."],
        ],
      },
      {
        id: "F-2",
        name: "Queue Token Prefix Taxonomy & Timing Buffers",
        whatItDoes: "Configures token prefix characters for each station type (Doctor: D-, Pharmacy: P-, Lab: L-, Billing: B-, Reception Desk: R-) and sets kiosk arrival buffers: Early arrival buffer (30m), Late arrival grace window (15m), and Queue aging cap (45m).",
        includes: [
          ["F-2.1: Token Prefix Inputs", "Text Inputs", "Configures 1-2 character prefix for Doctor, Pharmacy, Lab, Billing, and Desk tokens", "Defaults to D-, P-, L-, B-, R-"],
          ["F-2.2: Early Arrival Buffer Min", "Number Input", "Minutes before appointment patient is permitted to check in at kiosk (default: 30m)", "Prevents premature queue congestion"],
          ["F-2.3: Late Arrival Grace Min", "Number Input", "Minutes after appointment time patient can still check in without staff override (default: 15m)", "Routes tardy visits to front desk"],
        ],
        examples: [
          ["Patient arrives 20 minutes before 10:00 AM visit", "Kiosk permits check-in because 20m < 30m early buffer", "Kiosk issues ticket 'D-102' and updates appointment to Arrived"],
          ["Patient arrives 45 minutes late", "Kiosk flags arrival exceeds 15m grace window", "Aria prompts patient: 'Your appointment was scheduled for 10:00 AM. Please speak with the front desk coordinator.'"],
        ],
        jobs: [
          ["F-2-J1", "Practice Manager", "When managing patient queue flow, I want arrival buffers enforced, so that late arrivals do not disrupt the scheduled doctor timeline."],
        ],
        criteria: [
          ["F-2-1", "Patients arriving past the late arrival window are directed to front desk staff rather than issued an automated token."],
        ],
      },
    ],
  },

  // ── Client Single Page Modules ──
  {
    product: "client",
    module: "overview",
    dest: "content/client/overview.md",
    title: "Overview Dashboard & Clinical Activity Feed",
    summary: "The Overview Dashboard serves as the central command center for the practice. It consolidates daily appointment visit counts, real-time clinical activity events, revenue conversion funnel metrics, and one-click staff shortcuts.",
    features: [
      {
        id: "F-1",
        name: "Daily Appointment Visit Triage Counters",
        whatItDoes: "Renders live KPI summary cards for Today's patient volume: Total Scheduled, Arrived & Waiting, Currently In Consultation, Completed Visits, and Cancelled/No-Shows.",
        includes: [
          ["F-1.1: Scheduled Visits KPI Card", "Metric Card", "Displays total count of appointments booked for today", "Clickable to open Appointments Calendar"],
          ["F-1.2: Arrived & In Lounge Counter", "Metric Card", "Displays live count of patients physically checked in and waiting", "Highlighted in amber if wait > 20m"],
          ["F-1.3: Completed Consultations Card", "Metric Card", "Tracks total clinical encounters concluded today", "Shows progress bar against daily goal"],
        ],
        examples: [
          ["Coordinator opens dashboard at 11:00 AM", "Card shows '18 Scheduled, 4 Arrived & Waiting, 6 Completed'", "Coordinator sees waiting lounge volume at a glance"],
        ],
        jobs: [
          ["F-1-J1", "Clinic Coordinator", "When beginning my shift, I want to see today's appointment volume at a glance, so that I can anticipate waiting room staffing needs."],
        ],
        criteria: [
          ["F-1-1", "KPI counters update automatically when appointments are checked in or completed without full page refresh."],
        ],
      },
      {
        id: "F-2",
        name: "Real-Time Multi-Channel Activity Feed",
        whatItDoes: "Displays a chronological live audit stream of practice events: inbound patient messages (WhatsApp, SMS, Website), form submissions, bill payments, and call logs.",
        includes: [
          ["F-2.1: Activity Event Stream", "UI Feed", "Shows event icon, patient name, action snippet, and relative timestamp (e.g. '2m ago')", "Clickable to jump to record"],
          ["F-2.2: Channel Filter Toggles", "Filter Pills", "Filters activity feed by Chats, Forms, Billing, or Calls", "Allows focused triage"],
        ],
        examples: [
          ["Patient completes intake form on mobile", "Feed displays 'Sarah Johnson submitted Medical Intake Form (2m ago)'", "Coordinator clicks feed item and opens Sarah's submitted form"],
        ],
        jobs: [
          ["F-2-J1", "Medical Assistant", "When monitoring patient actions, I want a unified real-time feed, so that I can respond immediately to new form submissions and messages."],
        ],
        criteria: [
          ["F-2-1", "Incoming patient actions appear at the top of the activity feed in real time."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "clients",
    dest: "content/client/clients.md",
    title: "Contact & Patient EHR Directory",
    summary: "The Contact / Patients module provides a complete EHR demographic directory and clinical profile view. Staff can search patients, view clinical histories, triage prospective leads versus active patients, and export records under HIPAA compliance controls.",
    crossProduct: {
      related: "Companion",
      change: "Patient Demographic Profile Sync",
      description: "Edits to contact details (phone, email, emergency contact) made in the Client directory synchronize seamlessly to the patient's profile in the Companion portal.",
      link: "/companion/today",
    },
    features: [
      {
        id: "F-1",
        name: "Comprehensive Patient Directory Search & Category Filters",
        whatItDoes: "Provides real-time typeahead search across patient name, phone number, email, date of birth, and patient ID / MRN. Includes quick tabs for Leads, Patients, and Archived contacts.",
        includes: [
          ["F-1.1: Real-Time Patient Search Bar", "Search Input", "Searches patient database across multiple demographic attributes simultaneously", "Debounced 200ms input"],
          ["F-1.2: Category Switcher (Leads vs Patients)", "Tabs", "Filters directory between prospective inquiries (Leads) and registered clinic patients", "Shows count badges"],
          ["F-1.3: New Patient Registration Button", "Button & Modal", "Opens quick patient registration modal capturing Name, Phone, Email, DOB, and Gender", "Validates duplicate phone"],
        ],
        examples: [
          ["Receptionist searches for incoming caller", "Types '+1-555-0199' into search bar", "Directory isolates Sarah Johnson's chart within 100ms"],
        ],
        jobs: [
          ["F-1-J1", "Receptionist", "When a patient calls the clinic, I want to find their chart instantly by phone number, so that I have their medical context on screen."],
        ],
        criteria: [
          ["F-1-1", "Searching by patient phone or MRN returns matching patient records with sub-second latency."],
        ],
      },
      {
        id: "F-2",
        name: "EHR Patient Profile Drawer & Encounter Timeline",
        whatItDoes: "Displays comprehensive patient details in a slide-over drawer: Demographics, Insurance Policies, Past Appointments, Active Processes, Clinical Notes, and Form Submissions.",
        includes: [
          ["F-2.1: Patient Profile Drawer", "Drawer", "Slide-over drawer organized into tabs: Overview, History, Documents, Processes", "Keeps directory visible behind"],
          ["F-2.2: Clinical Encounter Timeline", "Timeline", "Chronological list of all doctor consultations, vitals, prescriptions, and billing events", "Includes practitioner attribution"],
        ],
        examples: [
          ["Doctor reviews patient chart before consultation", "Clicks patient card in directory", "Drawer opens showing past diagnoses, current medications, and previous visit notes"],
        ],
        jobs: [
          ["F-2-J1", "Physician", "When preparing for a visit, I want a complete encounter timeline, so that I understand the patient's full medical history."],
        ],
        criteria: [
          ["F-2-1", "Opening a patient chart drawer displays historical encounters in descending chronological order."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "call-logs",
    dest: "content/client/call-logs.md",
    title: "Call Logs, Telephony Hub & AI Transcription",
    summary: "The Call Logs module provides a unified VoIP telephony communications hub. It logs all inbound and outbound clinical calls, provides an integrated audio player for recordings, displays AI transcriptions with sentiment tagging, and supports scheduling callback reminders.",
    features: [
      {
        id: "F-1",
        name: "Inbound & Outbound VoIP Call Log Stream",
        whatItDoes: "Displays a complete log of telephone calls handled by clinic staff and AI voice agents with sortable columns: Call Direction, Patient Name, Phone Number, Duration, Date/Time, Call Outcome (Completed, Missed, Voicemail), and Assigned Process.",
        includes: [
          ["F-1.1: Call Direction & Status Icons", "UI Icons", "Visual icons distinguishing Inbound, Outbound, Missed, and Voicemail calls", "Color-coded status"],
          ["F-1.2: Duration & Timestamp Display", "Text", "Displays call duration (e.g. '4:32') and timestamp with relative date", "Accurate to second"],
          ["F-1.3: Direct Click-to-Dial Action", "Button", "Triggers outbound phone dialer directly from any call log row", "Launches softphone"],
        ],
        examples: [
          ["Staff member triages missed calls", "Filters call log by 'Missed Calls'", "List displays 3 patients who called after hours; staff clicks dialer icon to call them back"],
        ],
        jobs: [
          ["F-1-J1", "Front Desk Staff", "When following up on missed calls, I want a clear log with one-click callback, so that patient inquiries are addressed quickly."],
        ],
        criteria: [
          ["F-1-1", "Every telephone call placed or received through the system generates a corresponding log entry with duration and status."],
        ],
      },
      {
        id: "F-2",
        name: "Integrated Audio Player & Dual-Speaker AI Transcription",
        whatItDoes: "Provides an in-app audio waveform player to listen to call recordings, accompanied by full speaker-diarized AI transcriptions (Agent vs Patient) with sentiment and clinical intent tags.",
        includes: [
          ["F-2.1: Waveform Audio Player", "Player", "Play, pause, audio scrub bar, and speed multiplier (1.0x, 1.25x, 1.5x)", "Audio download support"],
          ["F-2.2: Diarized AI Transcript Pane", "Transcript UI", "Shows alternating speech bubbles for Staff and Patient with timestamps", "Searchable text"],
          ["F-2.3: Sentiment & Intent Tags", "AI Tags", "Tags call intent: 'Appointment Booking', 'Prescription Refill', 'Billing Query'; sentiment: Positive/Urgent", "Generated via Whisper LLM"],
        ],
        examples: [
          ["Supervisor reviews patient dispute call", "Opens call details, plays audio recording at 1.25x, and reads highlighted transcript", "Confirms coordinator provided correct appointment cancellation policy"],
        ],
        jobs: [
          ["F-2-J1", "Quality Assurance Supervisor", "When evaluating staff communication, I want synchronized audio and transcripts, so that I can verify call quality and protocol compliance."],
        ],
        criteria: [
          ["F-2-1", "Calls with recorded audio provide interactive playback and full text transcription."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "tasks",
    dest: "content/client/tasks.md",
    title: "Care Team Tasks Queue & SLA Management",
    summary: "The Tasks Queue module provides a collaborative clinical task management system for healthcare teams. Staff can assign follow-up tasks, set priority flags, monitor SLA countdowns, and link tasks directly to patient EHR charts.",
    crossProduct: {
      related: "Companion",
      change: "Patient Prescribed Task Delegation",
      description: "When clinicians assign patient-facing home health tasks (e.g. blood sugar logs, medication check-off), they synchronize to the patient's Tasks tab in the Companion portal.",
      link: "/companion/tasks",
    },
    features: [
      {
        id: "F-1",
        name: "Collaborative Care Team Task Checklist",
        whatItDoes: "Displays tasks in a structured list with one-click checkbox completion. Each task includes Title, Description, Associated Patient, Assigned Staff, Due Date, and Priority Flag (Low, Medium, High, Urgent).",
        includes: [
          ["F-1.1: Priority Flag Badges", "UI Tags", "Color-coded priority tags: Low (gray), Medium (blue), High (amber), Urgent (red)", "Sortable by priority"],
          ["F-1.2: One-Click Checkbox Completion", "Checkbox", "Marks task as completed, logs completion timestamp and user ID, and strikes through text", "Triggers completion toast"],
          ["F-1.3: Create Task Modal", "Modal", "Quick modal to create task with patient typeahead search, due date picker, and assignee", "Assigns to active team member"],
        ],
        examples: [
          ["Doctor delegates lab follow-up to nurse", "Creates task 'Review potassium levels with Sarah Johnson', priority High, due today", "Task appears on nurse's dashboard with red high-priority tag"],
        ],
        jobs: [
          ["F-1-J1", "Clinician", "When finishing a visit, I want to assign follow-up tasks to nursing staff, so that care plan instructions are executed reliably."],
        ],
        criteria: [
          ["F-1-1", "Clicking a task completion checkbox updates its state to completed and logs the user who checked it off."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "scribe",
    dest: "content/client/scribe.md",
    title: "AI Clinical Scribe & Automated SOAP Notes",
    summary: "The AI Clinical Scribe module provides ambient clinical listening and voice consultation transcription. It listens to in-person or telehealth doctor-patient encounters, transcribes medical dialogue via Whisper, and synthesizes structured SOAP clinical notes ready for doctor sign-off and EHR sync.",
    features: [
      {
        id: "F-1",
        name: "Ambient Consultation Audio Recording & Stream",
        whatItDoes: "Captures ambient clinical audio via a single 'Start Consultation' microphone button, displaying real-time audio waveform activity and background noise cancellation status.",
        includes: [
          ["F-1.1: Start/Stop Recording Button", "Audio Button", "Large prominent toggle button with recording duration timer and pulse indicator", "Red pulse during recording"],
          ["F-1.2: Real-Time Audio Waveform", "Canvas Visualizer", "Renders live audio frequency bars confirming active microphone capture", "Detects speech pause"],
          ["F-1.3: Audio Mute & Resume Toggle", "Button", "Allows doctor to temporarily pause recording during private patient undressing or exams", "Zero data recorded while paused"],
        ],
        examples: [
          ["Doctor enters exam room and begins visit", "Clicks 'Start Consultation' on laptop", "Microphone streams audio, timer begins, and waveform confirms voice capture"],
        ],
        jobs: [
          ["F-1-J1", "Physician", "During patient consultations, I want ambient listening recording the dialogue, so that I can maintain eye contact instead of typing on a keyboard."],
        ],
        criteria: [
          ["F-1-1", "Starting recording captures microphone input and displays elapsed encounter duration."],
        ],
      },
      {
        id: "F-2",
        name: "Automated Structured SOAP Note Synthesis",
        whatItDoes: "Synthesizes the conversation transcript into structured clinical SOAP notes: Subjective (chief complaint, history of present illness), Objective (vital signs, physical exam observations), Assessment (differential diagnosis, clinical impressions), and Plan (medications, diagnostics, follow-up).",
        includes: [
          ["F-2.1: 4-Section SOAP Note Container", "UI Card", "Structured accordion or tabbed view dividing Subjective, Objective, Assessment, and Plan", "Formatted with medical bullet points"],
          ["F-2.2: Clinician Rich-Text Editor", "Inline Editor", "Allows doctor to edit, add, or delete wording prior to final sign-off", "Preserves version history"],
          ["F-2.3: Sign & Attach to Chart Button", "Action Button", "Digitally signs note with clinician credentials and attaches it permanently to patient encounter", "Locks note from further edit"],
        ],
        examples: [
          ["Doctor concludes 15-minute consultation", "Clicks 'End Consultation & Generate Note'", "AI generates complete SOAP note within 8 seconds; doctor reviews, edits dosage, and clicks 'Sign & Attach'"],
        ],
        jobs: [
          ["F-2-J1", "Physician", "When the encounter ends, I want a structured SOAP note generated automatically, so that I can finish my clinical charting in under 60 seconds."],
        ],
        criteria: [
          ["F-2-1", "Generated SOAP notes strictly follow the 4-part Subjective, Objective, Assessment, Plan structure."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "services",
    dest: "content/client/services.md",
    title: "Product & Services Catalog Management",
    summary: "The Product & Services module provides a centralized catalog of billable clinical consultations, procedures, laboratory panels, and wellness care packages with standard pricing, tax rates, and duration allocations.",
    features: [
      {
        id: "F-1",
        name: "Clinical Services Catalog & Fee Schedule",
        whatItDoes: "Maintains billable items with item codes (CPT/HCPCS), service name, clinical category (Consultations, Procedures, Diagnostics, Pharmacy), standard price, and duration in minutes.",
        includes: [
          ["F-1.1: Services Data Table", "Data Table", "Columns: Code, Service Name, Category, Price, Tax Rate, Duration, Status", "Searchable by name and code"],
          ["F-1.2: Add Service Modal", "Modal", "Captures Service Name, Code, Category, Price, Duration, and Description", "Validates unique item code"],
          ["F-1.3: Active Status Toggle", "Switch", "Enables or disables service availability in appointment booking and invoicing", "Disables retired services"],
        ],
        examples: [
          ["Practice adds 'Comprehensive Dermatology Consultation'", "Enters code 'CPT-99204', price '$180', duration '30m'", "Service becomes selectable in appointment booking and invoicing checkout"],
        ],
        jobs: [
          ["F-1-J1", "Practice Manager", "When updating our clinic fee schedule, I want a centralized catalog, so that appointment booking and billing use consistent pricing."],
        ],
        criteria: [
          ["F-1-1", "Services marked as active appear as selectable options in appointment drawers and invoice creation."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "invoices",
    dest: "content/client/invoices.md",
    title: "Invoices, Patient Billing Ledger & POS Checkout",
    summary: "The Invoices & Billing module manages practice revenue: generating itemized patient invoices, tracking payment statuses (Paid, Pending, Overdue, Void), collecting copays via credit card or UPI, and dispatching digital payment links.",
    crossProduct: {
      related: "Companion",
      change: "Patient Invoice & Payment Portal Sync",
      description: "Invoices generated in the Client billing ledger appear immediately in the patient's Companion portal with a 'Pay Now' button for self-service payment.",
      link: "/companion/billing",
    },
    features: [
      {
        id: "F-1",
        name: "Patient Invoicing Ledger & Payment Status Tracker",
        whatItDoes: "Displays all clinic invoices with sortable columns: Invoice Number, Patient Name, Issue Date, Due Date, Total Amount, Balance Due, and Status (Draft, Pending, Paid, Overdue, Cancelled).",
        includes: [
          ["F-1.1: Status Filter Tabs", "Tabs", "Filters invoices by All, Pending Payment, Paid, and Overdue", "Shows outstanding dollar sums"],
          ["F-1.2: Generate Invoice Modal", "Modal", "Selects patient, adds line items from services catalog, applies discounts/taxes, and sets due date", "Calculates subtotal and total"],
          ["F-1.3: Download PDF Receipt", "Button", "Generates branded PDF invoice with clinic logo, patient address, and line item details", "One-click download"],
        ],
        examples: [
          ["Front desk creates invoice for consultation and blood test", "Selects Sarah Johnson, adds 'Office Visit ($150)' and 'CBC Panel ($45)'", "System generates Invoice #INV-1049 for $195 and prompts payment collect"],
        ],
        jobs: [
          ["F-1-J1", "Billing Specialist", "When a visit is completed, I want to create an itemized invoice, so that the patient receives an accurate record of clinical charges."],
        ],
        criteria: [
          ["F-1-1", "Creating an invoice calculates line items, taxes, and balance due accurately and assigns a sequential invoice ID."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "claims",
    dest: "content/client/claims.md",
    title: "Insurance Claims, EDI Billing & Clearinghouse",
    summary: "The Insurance & Claims module facilitates healthcare reimbursement: verifying patient insurance eligibility, generating standard electronic EDI 837 claims with ICD-10 and CPT codes, and tracking clearinghouse submission statuses.",
    features: [
      {
        id: "F-1",
        name: "Electronic EDI Claim Generation & Diagnosis Code Mapping",
        whatItDoes: "Generates electronic insurance claims linking patient encounter charges to ICD-10 diagnosis codes and CPT procedure codes with provider NPI numbers for submission to clearinghouses.",
        includes: [
          ["F-1.1: Claim Builder Form", "Form", "Captures Payer ID, Policy Number, Primary Diagnosis ICD-10, Procedure CPT, and Billed Amount", "Validates mandatory claim fields"],
          ["F-1.2: Real-Time Scrubber Validation", "Logic", "Validates claim rules to prevent rejections (checks missing NPI, invalid code format)", "Flags errors in red"],
          ["F-1.3: Clearinghouse Submission Status", "Status Badge", "Tracks claim lifecycle: Draft, Submitted, Acknowledged, Paid, Denied", "Displays denial reason code"],
        ],
        examples: [
          ["Biller submits claim for dermatology biopsy", "Attaches ICD-10 'L82.1' and CPT '11102', clicks 'Submit Claim'", "Claim passes automated scrubber and submits to clearinghouse with confirmation #CLM-892"],
        ],
        jobs: [
          ["F-1-J1", "Insurance Biller", "When billing commercial insurers, I want pre-submission claim scrubbing, so that avoidable coding errors and claim denials are eliminated."],
        ],
        criteria: [
          ["F-1-1", "Claims missing required ICD-10 diagnosis or provider NPI are blocked from submission with specific field error alerts."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "reports",
    dest: "content/client/reports.md",
    title: "Reports, Practice Analytics & Financial KPIs",
    summary: "The Reports & Analytics module provides executive clinical intelligence: accounts receivable aging reports, clinician encounter productivity, patient appointment attendance and no-show rates, and automated scheduled PDF/Excel reports.",
    features: [
      {
        id: "F-1",
        name: "Revenue Cycle & Accounts Receivable Aging Reports",
        whatItDoes: "Renders accounts receivable aging breakdown across standard financial aging buckets (0-30 days, 31-60 days, 61-90 days, 90+ days) and tracks overall collection rate percentages.",
        includes: [
          ["F-1.1: AR Aging Buckets Chart", "Bar Chart", "Visual bar chart showing outstanding balances across aging time brackets", "Identifies overdue balances"],
          ["F-1.2: Collection Rate KPI Card", "Metric Card", "Calculates percentage of total billed charges successfully collected within 60 days", "Compares to prior month"],
          ["F-1.3: Export Report to Excel/PDF", "Button", "Exports financial summary data to formatted XLSX spreadsheet or PDF report", "Instant file generation"],
        ],
        examples: [
          ["Practice administrator reviews month-end financials", "Opens AR Aging Report", "Identifies $12,400 in the 61-90 days bucket and assigns follow-up tasks to billing staff"],
        ],
        jobs: [
          ["F-1-J1", "Practice Administrator", "When reviewing clinic finances, I want aging accounts receivable reports, so that we can collect overdue payments before they become bad debt."],
        ],
        criteria: [
          ["F-1-1", "AR aging reports categorize unpaid invoices into accurate 30-day brackets based on invoice due dates."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "workflows",
    dest: "content/client/workflows.md",
    title: "Workflow Designer Canvas & Trigger-Action Pipelines",
    summary: "The Workflow Designer provides an interactive node-based canvas for authoring automated clinical care pathways. Coordinators can connect Trigger nodes (e.g. Appointment Booked, Patient Arrived), Condition nodes (e.g. If First Visit, If High Risk), and Action nodes (e.g. Send SMS, Create Task, Generate Bill).",
    features: [
      {
        id: "F-1",
        name: "Interactive Node Canvas & Visual Pipeline Authoring",
        whatItDoes: "Provides an infinite draggable canvas with zoom controls, mini-map navigation, and drag-and-drop node palette allowing users to wire clinical automation pipelines with curved connection lines.",
        includes: [
          ["F-1.1: Drag-and-Drop Node Canvas", "Visual Canvas", "Interactive canvas with pan, zoom (25% - 200%), and grid snapping", "Supports complex branching"],
          ["F-1.2: Node Palette Drawer", "Palette", "Draggable node catalog categorized into Triggers, Conditions, Actions, and Delays", "Searchable node list"],
          ["F-1.3: Bezier Connection Wires", "Wire Connector", "Click and drag from node output ports to input ports with visual connection line", "Validates compatible port types"],
        ],
        examples: [
          ["Coordinator designs post-op care flow", "Drags 'Patient Checked Out' trigger, connects 'Wait 24h' delay node, connects 'Send WhatsApp Care Check' action", "Activates workflow; post-op patients automatically receive check-in message 24 hours later"],
        ],
        jobs: [
          ["F-1-J1", "Clinical Coordinator", "When establishing standardized care protocols, I want a visual workflow canvas, so that I can design patient follow-up pipelines without writing code."],
        ],
        criteria: [
          ["F-1-1", "Valid connections between trigger, condition, and action nodes execute in sequence when trigger events occur."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "automation",
    dest: "content/client/automation.md",
    title: "Global Automation Engine & Event Triggers",
    summary: "The Global Automation module houses the system-wide automated event rules engine. It automates patient lifecycle transitions, appointment reminder dispatch cadences, and SLA escalation alerts across all clinic modules.",
    features: [
      {
        id: "F-1",
        name: "Global Automated Rule Registry & Execution Log",
        whatItDoes: "Displays an administrative list of active automated clinical rules with rule name, trigger event, execution condition, action sequence, and an instant enable/disable toggle switch.",
        includes: [
          ["F-1.1: Automated Rules Table", "Data Table", "Lists rule title, trigger, action summary, execution count, and active switch", "Searchable by rule name"],
          ["F-1.2: Execution Audit Log Drawer", "Drawer", "Slide-over drawer detailing past rule firings with success/failure status and execution timestamps", "Aids troubleshooting"],
        ],
        examples: [
          ["Admin checks automated appointment reminders", "Observes rule 'Send SMS 48h before visit' executed 42 times today with 100% success", "Confirms patients received automated reminders"],
        ],
        jobs: [
          ["F-1-J1", "Practice Administrator", "When automating routine communications, I want centralized rule monitoring, so that I can verify automations are executing reliably."],
        ],
        criteria: [
          ["F-1-1", "Disabling an automation rule immediately stops it from triggering on subsequent system events."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "knowledge-base",
    dest: "content/client/knowledge-base.md",
    title: "Clinic Knowledge Base & Protocol Repository",
    summary: "The Knowledge Base module provides a structured clinical protocol and operational guideline repository. Staff can author medical SOPs, triage FAQs, and practice guides, and the AI bot references these articles for automated patient responses.",
    features: [
      {
        id: "F-1",
        name: "Medical Protocol Repository & Semantic Search",
        whatItDoes: "Stores clinical guidelines and front desk FAQs categorized into folders. Features full-text and semantic keyword search to surface clinical protocols in seconds.",
        includes: [
          ["F-1.1: Category Folder Navigation", "Sidebar Tree", "Organizes articles into folders: Clinical Protocols, Front Desk FAQs, Insurance Policies", "Collapsible folder hierarchy"],
          ["F-1.2: Semantic Article Search", "Search Input", "Searches article titles and contents with keyword highlighting", "Sub-second query response"],
          ["F-1.3: Markdown Article Viewer", "Reader View", "Clean reader view supporting formatted text, tables, callout warnings, and embedded diagrams", "Printable article view"],
        ],
        examples: [
          ["Medical assistant needs triage protocol for pediatric fever", "Types 'fever triage' into Knowledge Base search", "Article 'Pediatric Fever Management Protocol' opens with temperature thresholds and triage steps"],
        ],
        jobs: [
          ["F-1-J1", "Medical Assistant", "When a patient presents with specific symptoms, I want quick access to approved clinic protocols, so that clinical care is safe and standardized."],
        ],
        criteria: [
          ["F-1-1", "Articles published in the Knowledge Base are indexed and retrievable via search instantly."],
        ],
      },
    ],
  },
  {
    product: "client",
    module: "web-forms",
    dest: "content/client/web-forms.md",
    title: "Webforms, Digital Intake & Signature Collection",
    summary: "The Webforms & Intake module allows clinics to build responsive digital patient intake questionnaires with customizable fields, digital signature collection, iframe embedding, and automated CRM patient chart ingestion.",
    features: [
      {
        id: "F-1",
        name: "Visual Intake Form Builder & Shareable Public URL",
        whatItDoes: "Enables dragging and dropping form fields (Personal Info, Medical History Checkboxes, Insurance Card Upload, Digital Signature) to construct digital intake questionnaires that can be shared via link or embedded on the clinic website.",
        includes: [
          ["F-1.1: Drag-and-Drop Form Builder", "Visual Builder", "Palette of field components: Text, Phone, Date of Birth, Checkbox Group, File Upload, Signature Pad", "Live preview toggle"],
          ["F-1.2: Public Shareable URL & Embed Code", "Code Generator", "Generates public web link and HTML iframe embed snippet for clinic website integration", "SSL encrypted link"],
          ["F-1.3: Automated Patient Chart Ingestion", "Logic", "Form submissions automatically populate new or existing patient charts and create an intake timeline event", "Eliminates manual data entry"],
        ],
        examples: [
          ["Clinic sends intake form link before visit", "Patient receives SMS link, fills medical history and signs on phone screen", "Submitted form syncs to patient's chart in Client and notifies front desk"],
        ],
        jobs: [
          ["F-1-J1", "Practice Coordinator", "Before patients arrive, I want them to complete intake forms digitally on their phone, so that waiting room clipboards are eliminated."],
        ],
        criteria: [
          ["F-1-1", "Submitted webforms automatically create or update patient demographic and medical records in the CRM."],
        ],
      },
    ],
  },
];

clientPrds.forEach((spec) => {
  const content = formatPrd(spec);
  const fullPath = path.join(rootDir, spec.dest);
  savePrd(fullPath, content);
});

console.log(`Generated ${clientPrds.length} Client PRDs successfully.`);

