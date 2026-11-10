import path from "path";
import { formatPrd, savePrd } from "./generator_helpers.mjs";

const rootDir = process.cwd();

const receptionPrds = [
  // ── 1. Check-In: Scheduled Check-In ──
  {
    product: "ai-receptionist",
    module: "checkin",
    channel: "scheduled",
    dest: "content/ai-receptionist/checkin/scheduled.md",
    title: "Scheduled Appointment Check-In & Biometric Verification",
    summary: "The Scheduled Check-In flow enables pre-booked patients to authenticate at the clinic kiosk using contactless face recognition or their mobile number. Upon verification, it disambiguates family profiles, confirms today's appointment with their physician, issues an automated queue ticket (e.g., 'D-042'), and provides room wayfinding directions.",
    crossProduct: {
      related: "Client",
      change: "Patient Arrival & Queue Status",
      description: "When patient confirms check-in at the kiosk, their appointment status transitions from 'Booked' to 'Arrived' on the Client calendar, and the provider receives a desktop chime notification.",
      link: "/client/appointments/calendar",
    },
    features: [
      {
        id: "F-1",
        name: "Contactless Face Recognition Scan & Phone Keypad Fallback",
        whatItDoes: "Matches patient facial scan against enrolled 512-dimensional vector embeddings with instantaneous recognition. When lighting or occlusion prevents matching, the kiosk seamlessly presents a touch-friendly 10-key numeric dialpad for phone number entry followed by a 4-digit SMS OTP verification (mock code 1234). To confirm: What is the maximum expiration window for the 4-digit verification OTP on the public kiosk screen?",
        includes: [
          ["F-1.1: WebCam Biometric Viewport", "Camera Feed", "Live video frame with circular oval guide and scanning laser animation", "Operates at 30fps"],
          ["F-1.2: Touch Keypad Phone Dialpad", "Touch Dialpad", "High-contrast numeric pad with phone country code and quick paste", "Audio feedback on tap"],
          ["F-1.3: 4-Digit OTP Verification Screen", "PIN Input", "Auto-advancing 4-cell OTP input with countdown timer and resend trigger", "Mock code 1234 supported"],
          ["F-1.4: Multi-Patient Family Disambiguation", "Profile Selector", "Lists family members associated with phone number (Self, Spouse, Child)", "Prevents check-in collision"],
        ],
        examples: [
          ["Scheduled patient arrives at clinic lobby", "Stands in front of kiosk screen", "Camera recognizes face embedding and displays 'Welcome back, Johnathan Doe!'"],
          ["Face scan fails due to mask", "Taps 'Enter Phone Number' and enters '555-0192'", "Receives OTP, enters '1234', and selects 'Johnathan (Self)'"],
        ],
        jobs: [
          ["F-1-J1", "Scheduled Patient", "When I arrive at the clinic, I want to authenticate in under 5 seconds, so that I do not have to wait in line at the physical reception desk."],
        ],
        criteria: [
          ["F-1-1", "Face recognition match with confidence > 85% bypasses phone number entry."],
          ["F-1-2", "Entering correct phone and OTP loads all appointments matching the phone number for today."],
        ],
      },
      {
        id: "F-2",
        name: "Appointment Confirmation & Automated Queue Token Issuance",
        whatItDoes: "Displays today's scheduled appointment details (Doctor Name, Specialty, Time, Consultation Room) and generates a priority queue ticket (e.g. 'D-042'). Calculates estimated wait time, displays currently serving token ('Now serving D-038'), and dispatches a digital pass with directions to the patient's phone.",
        includes: [
          ["F-2.1: Today's Appointment Review Card", "Data Card", "Displays Doctor Avatar, Specialty, Appointment Time, and Scheduled Service", "Presents 'Confirm Check-In' CTA"],
          ["F-2.2: Live Token Generation Card", "Ticket Widget", "Prominent token ticket display (e.g. 'D-042') with assigned station room", "High-contrast clinical glass style"],
          ["F-2.3: Current Serving & Wait Time ETA", "Status Bar", "Shows currently examined token ('Now Serving: D-038') and calculated wait time", "Refreshes via live queue store"],
          ["F-2.4: SMS Pass Dispatch & Directions Trigger", "Action Group", "One-tap button to text ticket pass to phone and launch interactive wayfinding map", "Sends instant SMS pass"],
        ],
        examples: [
          ["Patient confirms appointment with Dr. Sharma", "Taps 'Confirm Check-In'", "Kiosk assigns ticket D-042, notifies that 4 patients are ahead (est. 18 min), and prints/texts pass"],
        ],
        jobs: [
          ["F-2-J1", "Patient", "After confirming my visit, I want a clear queue ticket and wait estimate, so that I know where to go and how long I will wait."],
        ],
        criteria: [
          ["F-2-1", "Upon confirmation, Queue Ticket status is set to 'waiting' and dispatched to provider station."],
          ["F-2-2", "Tapping 'Send SMS Pass' delivers full consultation room directions and live tracking link."],
        ],
      },
    ],
  },

  // ── 2. Check-In: Walk-In Registration ──
  {
    product: "ai-receptionist",
    module: "checkin",
    channel: "walk-in",
    dest: "content/ai-receptionist/checkin/walk-in.md",
    title: "Walk-In Patient Registration & Immediate Triage",
    summary: "The Walk-In Registration workflow enables unscheduled patients to sign up on-the-spot. It captures demographics, chief medical complaint, biometric consent, assigns an available provider or service, provisions a client record in MantraAssist, and issues an immediate queue ticket.",
    crossProduct: {
      related: "Client",
      change: "Patient Demographic Record & Appointment Creation",
      description: "Walk-in intake creates a new patient in Client > Patients, marks source as 'Walked In', and appends an urgent walk-in appointment to today's schedule.",
      link: "/client/clients",
    },
    features: [
      {
        id: "F-1",
        name: "Walk-In Demographic Intake & Biometric Consent Capture",
        whatItDoes: "Guides the walk-in patient through phone verification, demographic collection (Full Name, Age, Gender, Email), reason for visit, and optional biometric face consent for accelerated future check-ins. To confirm: Are walk-in patients required to capture biometric face templates or can face consent be completely opted out without staff override?",
        includes: [
          ["F-1.1: Phone & Identity Verification", "Keypad", "Phone number entry and 4-digit OTP check to detect existing client records", "Pre-populates known records"],
          ["F-1.2: Demographic Intake Form", "Touch Form", "Clean on-screen inputs for First Name, Last Name, Age slider/input, Gender picker", "Large touch targets"],
          ["F-1.3: Chief Complaint & Symptoms Selector", "Tag Grid", "Pre-set reason chips (General Consultation, Fever/Flu, Prescription Refill, Skin Check, Custom text)", "Quick single-tap selection"],
          ["F-1.4: Biometric Consent Toggle", "Consent Card", "HIPAA-compliant opt-in toggle explaining face vector storage for fast check-in", "Explicit audit timestamped"],
        ],
        examples: [
          ["New patient walks into clinic", "Selects 'Walk-In Registration' on kiosk", "Enters phone, fills name 'Jane Smith', age 32, chooses 'General Consultation', and opts into face check-in"],
        ],
        jobs: [
          ["F-1-J1", "Walk-In Patient", "When I visit without an appointment, I want to register quickly, so that I can be placed in line to see a doctor."],
        ],
        criteria: [
          ["F-1-1", "Validating form creates a new Patient record in MantraAssist with source 'Walked In'."],
          ["F-1-2", "If phone matches an existing patient, past demographic fields pre-fill automatically."],
        ],
      },
      {
        id: "F-2",
        name: "Service & Provider Selection with Immediate Queue Placement",
        whatItDoes: "Allows walk-in patients to pick their required clinical department (General OPD, Pediatrics, Dermatology) and select an available doctor or opt for 'Next Available Provider'. Issues an immediate walk-in token (e.g. 'D-088') and prints/texts directions. To confirm: Can walk-in patients select a specific doctor if that provider's schedule has zero open immediate slots?",
        includes: [
          ["F-2.1: Department & Specialty Grid", "Card Grid", "Visual service cards displaying consultation fee, average wait time, and room wing", "Shows live availability"],
          ["F-2.2: Provider Picker ('Next Available')", "Selector", "Defaults to 'Next Available Doctor' with option to select specific on-duty practitioner", "Displays doctor photos"],
          ["F-2.3: Immediate Token & Ticket Generation", "Ticket Card", "Renders token 'D-088', station name ('Consultation Room 102'), and estimated wait time", "Presents SMS send button"],
        ],
        examples: [
          ["Patient completes intake", "Selects 'General Practice' with 'Next Available Doctor'", "System assigns Dr. Rajesh Patel (Room 102), issues token D-088, and updates wait queue"],
        ],
        jobs: [
          ["F-2-J1", "Walk-In Patient", "I want the fastest available doctor, so that my wait time is minimized."],
        ],
        criteria: [
          ["F-2-1", "Walk-in ticket is queued with priority 0 or urgent based on symptom triage."],
          ["F-2-2", "Assigned doctor station immediately receives notification of new walk-in patient."],
        ],
      },
    ],
  },

  // ── 3. Wayfinding & Directions: Department Directory ──
  {
    product: "ai-receptionist",
    module: "directions",
    channel: "departments",
    dest: "content/ai-receptionist/directions/departments.md",
    title: "Clinic Wayfinding & Department Directory",
    summary: "The Department Directory allows visitors, patients, and caregivers to explore the clinic layout by zone. It organizes physical locations into three primary categories: Clinical & Doctors (OPD), Pharmacy & Labs, and Facilities & Restrooms, providing quick routes from the kiosk location.",
    crossProduct: {
      related: "Companion",
      change: "Patient Floor Navigation",
      description: "When a patient views directions on the kiosk, they can tap 'Send to Phone' to open the exact same route instructions within the Companion web app.",
      link: "/companion/today",
    },
    features: [
      {
        id: "F-1",
        name: "Categorized Zone Directory & Room Listings",
        whatItDoes: "Displays clinic destinations grouped by operational category: Clinical Consultations, Diagnostic Labs & Pharmacy, and Public Amenities. Each destination displays floor level, wing name, and estimated walking steps from the current kiosk station.",
        includes: [
          ["F-1.1: Category Tab Bar", "Nav Tabs", "Three primary zones: Clinical & Doctors, Pharmacy & Labs, Facilities & Restrooms", "Icon badges for each zone"],
          ["F-1.2: Destination Room Cards", "List Cards", "Shows Room Name (e.g. 'Main Pharmacy & Dispensing'), Wing ('Ground Floor Lobby'), and Walk Time ('1 min')", "Tap to view route"],
          ["F-1.3: Visual Wing Color Coded Badges", "Badge UI", "Color-coded indicators: Blue (Clinical Wing B), Green (Pharmacy), Orange (Diagnostics)", "Matches physical signage"],
          ["F-1.4: Search Destination Input", "Search Field", "Instant real-time search filtering rooms by doctor name, test type, or facility", "Auto-completes as typed"],
        ],
        examples: [
          ["Visitor enters clinic seeking blood test laboratory", "Taps 'Pharmacy & Labs' category tab", "Taps 'Diagnostic Lab 1 & Blood Collection' to view corridor route"],
        ],
        jobs: [
          ["F-1-J1", "Clinic Visitor", "When I need to find a department, I want a structured directory, so that I don't wander around the clinic lost."],
        ],
        criteria: [
          ["F-1-1", "Selecting a department lists all active rooms belonging to that category."],
          ["F-1-2", "Deactivated rooms configured in settings do not appear in the public directory."],
        ],
      },
      {
        id: "F-2",
        name: "Interactive Floor Selector & Facility Amenities Locator",
        whatItDoes: "Provides quick toggles for Ground Floor and 1st Floor Specialty Wings, highlighting essential amenities including wheelchair-accessible restrooms, drinking water stations, prayer rooms, and elevator banks.",
        includes: [
          ["F-2.1: Floor Switcher (Ground / Level 1)", "Pill Switcher", "Instant toggle between Ground Floor Main Clinic and Level 1 Specialty Suites", "Displays floor occupancy"],
          ["F-2.2: Essential Amenities Card Grid", "Card Grid", "Dedicated cards for Restrooms, Water Stations, Elevator, and Emergency Exit", "Clear international icons"],
          ["F-2.3: Accessibility Route Highlighting", "Filter Toggle", "Toggles step-free and wheelchair-accessible path instructions via central elevator", "ADA compliant guidance"],
        ],
        examples: [
          ["Elderly patient with wheelchair needs restroom", "Toggles 'Accessible Route' on Facilities tab", "System directs to Ground Floor Central Corridor restroom with zero stairs"],
        ],
        jobs: [
          ["F-2-J1", "Patient / Visitor", "I want to locate restrooms and elevators immediately, so that I can navigate comfortably."],
        ],
        criteria: [
          ["F-2-1", "Accessible routes prioritize elevator banks over stairs across all multi-floor routes."],
        ],
      },
    ],
  },

  // ── 4. Wayfinding & Directions: Room-by-Room Route ──
  {
    product: "ai-receptionist",
    module: "directions",
    channel: "rooms",
    dest: "content/ai-receptionist/directions/rooms.md",
    title: "Turn-by-Turn Wayfinding & Interactive Floor Routing",
    summary: "The Room-by-Room Route PRD specifies the detailed turn-by-turn guidance engine. It displays landmark-based navigation instructions (e.g. 'Turn right at the main corridor, follow the blue line to Diagnostic Lab 1'), interactive visual route maps, and multi-channel delivery via SMS and thermal ticket printing.",
    crossProduct: {
      related: "Client",
      change: "Station & Room Route Editing",
      description: "Clinic administrators configure station names, floor wings, and landmark instructions in Client Settings > Reception Kiosk, which immediately updates the kiosk route engine.",
      link: "/client/settings/reception",
    },
    features: [
      {
        id: "F-1",
        name: "Turn-by-Turn Landmark Route Display",
        whatItDoes: "Generates clear, step-by-step physical walking directions starting from the current kiosk position to the target station. Incorporates visible clinic landmarks, painted floor guideline colors, corridor names, and room door numbers.",
        includes: [
          ["F-1.1: Route Hero Header", "Banner", "Displays Destination Room Name, Wing/Floor, and Total Walking Distance in meters/steps", "Bold high-contrast font"],
          ["F-1.2: Landmark Step Sequence", "Step List", "Numbered sequence with icon indicators (Walk straight, Turn right, Take elevator, Destination on left)", "Step-by-step layout"],
          ["F-1.3: Visual Floor Line Guide Indicator", "Color Chip", "Identifies painted floor line to follow (e.g. 'Follow the Blue Line on the floor')", "Matches physical clinic paint"],
          ["F-1.4: Aria Voice Navigation Readout", "Audio Prompt", "Aria avatar speaks aloud the walking direction in patient's chosen language", "Clear natural voice"],
        ],
        examples: [
          ["Patient checks in for Dr. Rajesh Patel (Room 102)", "Kiosk displays Room Route screen", "Step 1: Walk past reception. Step 2: Take Hallway B on right. Step 3: Room 102 is 3rd door on right."],
        ],
        jobs: [
          ["F-1-J1", "Patient", "When navigating to my doctor's exam room, I want clear landmark directions, so that I arrive without getting lost."],
        ],
        criteria: [
          ["F-1-1", "Instructions automatically adapt if destination is on Level 1, injecting elevator guidance."],
          ["F-1-2", "Text matches the station instructions configured in the clinic's reception settings."],
        ],
      },
      {
        id: "F-2",
        name: "Mobile Pass Dispatch & Thermal Ticket Route Printing",
        whatItDoes: "Allows visitors to take directions with them by sending the route link directly to their mobile number via SMS or printing a thermal receipt containing room instructions and a scannable QR code. To confirm: Should turn-by-turn wayfinding instructions be automatically printed on thermal paper tickets or sent exclusively via SMS pass?",
        includes: [
          ["F-2.1: SMS Route Link Dispatcher", "Action Button", "Dispatches instant SMS with URL opening interactive route on mobile browser", "Includes room number"],
          ["F-2.2: Thermal Ticket Printing Interface", "Print Hook", "Triggers connected ESC/POS thermal printer to output route slip with queue token", "Fast 2-second print"],
          ["F-2.3: QR Code Route Transfer", "On-Screen QR", "Displays dynamic QR code on kiosk screen that opens mobile map when scanned by phone camera", "No typing required"],
        ],
        examples: [
          ["Patient receives token at kiosk", "Scans on-screen QR code with smartphone", "Mobile browser opens live route with room directions and current queue count"],
        ],
        jobs: [
          ["F-2-J1", "Patient", "I want to have the directions on my smartphone, so that I can reference them while walking through hallways."],
        ],
        criteria: [
          ["F-2-1", "Scanning on-screen QR code opens mobile companion route without requiring patient login."],
        ],
      },
    ],
  },

  // ── 5. My Visit & Live Queue ──
  {
    product: "ai-receptionist",
    module: "my-visit",
    dest: "content/ai-receptionist/my-visit.md",
    title: "My Visit & Real-Time Queue Status Monitor",
    summary: "The My Visit module displays the patient's active queue position, current serving ticket, estimated wait time, attending provider details, and stage progression. It allows waiting patients to re-check their status at any kiosk terminal by tapping their token or entering their phone number.",
    crossProduct: {
      related: "Client",
      change: "Queue Call & Complete Events",
      description: "When the provider clicks 'Call Next' or 'Mark Complete' in Client, the kiosk queue display immediately updates the current serving token in real time.",
      link: "/client/overview",
    },
    features: [
      {
        id: "F-1",
        name: "Live Queue Monitor & Ticket Tracking Card",
        whatItDoes: "Presents a prominent, high-contrast display of the patient's issued ticket (e.g. 'D-042') alongside the token currently inside the consultation room ('Now Serving: D-038'). Highlights queue differential (e.g. '4 patients ahead') and updates dynamically. To confirm: How frequently should the kiosk queue poll the backend WebSocket server for ticket position updates (e.g. 3-second heartbeat vs real-time SSE)?",
        includes: [
          ["F-1.1: Active Patient Token Badge", "Hero Badge", "Large high-visibility badge showing patient's assigned token number", "Pulsing border when next"],
          ["F-1.2: Current Serving Token Indicator", "Status Card", "Real-time indicator showing token currently in doctor's office", "Audible chime on change"],
          ["F-1.3: Patients Ahead Counter", "Count Metric", "Displays exact number of patients in queue ahead of current ticket", "Calculates dynamic wait"],
          ["F-1.4: Estimated Wait Time Countdown", "Timer Display", "Projected wait time in minutes based on provider average consultation duration", "Updates dynamically"],
        ],
        examples: [
          ["Patient checks kiosk screen in waiting area", "Taps 'Track My Visit' and enters token 'D-042'", "Screen shows: 'Now Serving D-040 | 1 patient ahead | Est. wait: 6 minutes'"],
        ],
        jobs: [
          ["F-1-J1", "Waiting Patient", "While in the waiting room, I want to see how many people are ahead of me, so that I know when to approach the doctor's door."],
        ],
        criteria: [
          ["F-1-1", "When doctor advances queue, screen updates within 2 seconds without page refresh."],
          ["F-1-2", "When patient's token is called, display turns green and sounds an arrival chime."],
        ],
      },
      {
        id: "F-2",
        name: "Multi-Stage Journey Progress Tracker",
        whatItDoes: "Tracks the patient across their complete clinical visit journey: Check-In -> Vitals / Triage -> Doctor Consultation -> Diagnostic Tests -> Pharmacy / Billing -> Discharge. Displays completed stages and highlights the current pending station.",
        includes: [
          ["F-2.1: Multi-Step Clinical Stepper", "Horizontal Stepper", "Visual progress bar showing past, active, and upcoming journey milestones", "Completed steps checked"],
          ["F-2.2: Next Station Guidance Card", "Action Card", "Directs patient to their next destination once consultation finishes (e.g. 'Proceed to Pharmacy Counter A')", "Includes room wing"],
          ["F-2.3: Re-Send SMS Update Button", "Button", "Allows patient to trigger an updated SMS alert with their latest queue position", "Delivered in seconds"],
        ],
        examples: [
          ["Doctor completes consultation and orders lab work", "Patient checks kiosk monitor", "Stepper shows Doctor Consultation as 'Done' and activates 'Diagnostic Lab 1' as next station"],
        ],
        jobs: [
          ["F-2-J1", "Patient", "After seeing the doctor, I want to know where to go next for my tests, so that I don't leave without completing my visit."],
        ],
        criteria: [
          ["F-2-1", "Journey stepper automatically highlights the active station linked to patient's journey ID."],
        ],
      },
    ],
  },

  // ── 6. Aria Voice & Avatar Stage ──
  {
    product: "ai-receptionist",
    module: "avatar",
    dest: "content/ai-receptionist/avatar.md",
    title: "Aria Voice & Interactive Clinical Avatar Stage",
    summary: "The Aria Avatar Stage provides a lifelike, full-screen interactive receptionist experience. Powered by an animated 3D video avatar, real-time Whisper speech recognition, dual-language synthesis (English and Hindi), and a live caption stream, Aria greets visitors, answers questions, and guides them through check-in.",
    crossProduct: {
      related: "Client",
      change: "Voice Model & Prompt Configuration",
      description: "Clinic administrators configure Aria's greeting phrase, voice tone, speech model, and custom medical clinic prompts in Client Settings > AI Voices / Models.",
      link: "/client/settings/voices",
    },
    features: [
      {
        id: "F-1",
        name: "Animated Aria 3D Video Avatar & Lip-Sync Animation",
        whatItDoes: "Renders the Aria clinical receptionist avatar on a modern glassmorphic stage. Plays idle breathing animations when listening and smoothly transitions to lip-synced talking video clips synchronized with TTS speech output. To confirm: What fallback voice model is utilized when Web Speech API offline synthesis is required during clinic internet interruptions?",
        includes: [
          ["F-1.1: Clinical Glassmorphic Stage", "Stage Viewport", "Deep navy-to-slate gradient viewport with frosted glass cards and ambient glow", "100vh full-screen layout"],
          ["F-1.2: Seamless Video Avatar Looper", "Video Player", "High-definition MP4/WebM avatar seamlessly switching between idle and speech states", "Zero latency transition"],
          ["F-1.3: Real-Time Audio Waveform Visualizer", "Canvas Waveform", "Dynamic pulsating frequency visualizer reacting to incoming microphone voice input", "Smooth Web Audio API"],
          ["F-1.4: Dual-Language Toggle (EN / HI)", "Language Pill", "One-tap switcher toggling Aria's spoken dialect and UI labels between English and Hindi", "Instant language switch"],
        ],
        examples: [
          ["Visitor approaches kiosk terminal", "Aria greets visitor: 'Hello! Welcome to Mantra Care. How can I assist you today?'", "Avatar speaks while waveform pulses and captions appear"],
          ["Visitor speaks Hindi: 'Mera check-in karna hai'", "Aria detects Hindi speech", "Switches to Hindi: 'Namaste! Kripya apna phone number batayein'"],
        ],
        jobs: [
          ["F-1-J1", "Clinic Visitor", "When I walk up to the kiosk, I want an approachable, conversational guide, so that I can complete my tasks naturally without confusing menus."],
        ],
        criteria: [
          ["F-1-1", "Avatar video transitions between idle and speaking states without video flicker."],
          ["F-1-2", "Audio waveform reacts in real time to ambient speech input when mic is unmuted."],
        ],
      },
      {
        id: "F-2",
        name: "Whisper Speech-to-Text & Real-Time Live Caption Bar",
        whatItDoes: "Captures patient voice input, streams audio through OpenAI Whisper STT, parses clinical intents (check-in, directions, billing, doctor inquiry), and renders accessibility-compliant live subtitles across the bottom of the stage.",
        includes: [
          ["F-2.1: Live Subtitle Caption Bar", "Caption Bar", "High-contrast caption bar displaying transcribed user speech and Aria's synthesized response", "ADA compliant font"],
          ["F-2.2: Speech Intent Classifier", "Intent Engine", "Categorizes voice commands: 'Check in for Dr. Sharma', 'Where is the restroom?', 'Pay bill'", "Routes to target flow"],
          ["F-2.3: Mic Mute / Volume Controller", "Controls", "Hardware mute toggle, listening timeout indicator, and audio volume slider", "Protects patient privacy"],
        ],
        examples: [
          ["Patient speaks: 'Where is Dr. Sharma's room?'", "Transcribed on caption bar in real time", "Aria replies: 'Dr. Sharma is in Consultation Room 101 on Ground Floor. Let me show you the route!' and opens directions"],
        ],
        jobs: [
          ["F-2-J1", "Hearing-Impaired / Multilingual Patient", "I want to read live captions on screen, so that I can follow Aria's spoken instructions clearly."],
        ],
        criteria: [
          ["F-2-1", "Live captions render each spoken sentence with under 300ms latency."],
          ["F-2-2", "Unrecognized speech prompts empathetic re-query: 'I didn't quite catch that, could you repeat or tap the screen?'"],
        ],
      },
    ],
  },

  // ── 7. Outstanding Dues & QR Payments: Invoices ──
  {
    product: "ai-receptionist",
    module: "billing",
    channel: "invoices",
    dest: "content/ai-receptionist/billing/invoices.md",
    title: "Patient Invoice Lookup & Outstanding Dues Breakdown",
    summary: "The Outstanding Dues PRD defines the kiosk billing lookup workflow. Patients enter their registered mobile number to retrieve outstanding consultation copays, lab diagnostic fees, and pharmacy charges prior to consultation or departure.",
    crossProduct: {
      related: "Companion",
      change: "Patient Invoice Ledger Synchronization",
      description: "Invoices settled at the kiosk immediately reflect as 'Paid' in the Companion app billing ledger and update the practice revenue logs in Client.",
      link: "/companion/billing",
    },
    features: [
      {
        id: "F-1",
        name: "Phone-Based Invoice Discovery & Patient Billing History",
        whatItDoes: "Permits patients to look up pending or past invoices using their verified phone number. Surfaces itemized clinical services, insurance adjustments, already paid deposits, and remaining balance due.",
        includes: [
          ["F-1.1: Phone Keypad Lookup", "Keypad", "High-contrast numeric dialpad for fast phone number entry with OTP safety check", "Prevents unauthorized viewing"],
          ["F-1.2: Unpaid Invoices List", "Data List", "Displays invoice cards with invoice number, consultation date, doctor, and balance amount", "High-contrast balance badge"],
          ["F-1.3: Itemized Fee Breakdown Drawer", "Details View", "Lists individual fee lines (e.g. 'Consultation Fee $75.00', 'CBC Blood Test $35.00')", "Shows clear tax/copay rows"],
          ["F-1.4: One-Tap Pay Now CTA", "Action Button", "Launches dynamic QR code payment modal for immediate settlement", "Prominent green button"],
        ],
        examples: [
          ["Patient arrives for follow-up with $45 unpaid lab balance", "Enters phone on kiosk billing screen", "Kiosk displays Invoice #INV-2026-089 for $45.00 with 'Pay Now' CTA"],
        ],
        jobs: [
          ["F-1-J1", "Patient", "Before seeing my doctor, I want to review and pay my copay on the kiosk, so that I don't need to wait in line at billing."],
        ],
        criteria: [
          ["F-1-1", "Entering phone retrieves all unpaid invoices associated with the patient's client record."],
          ["F-1-2", "Fully paid invoices are marked with green 'Paid' checkmark and can print receipts."],
        ],
      },
    ],
  },

  // ── 8. Outstanding Dues & QR Payments: QR Pay ──
  {
    product: "ai-receptionist",
    module: "billing",
    channel: "qr-pay",
    dest: "content/ai-receptionist/billing/qr-pay.md",
    title: "Dynamic QR Code Payment & Instant Settlement",
    summary: "The Dynamic QR Checkout PRD defines the contactless kiosk payment modal. Generates dynamic UPI, Apple Pay, and debit/credit QR codes on screen, listens for webhook payment confirmation, celebrates successful payment with confetti, and prints thermal receipts.",
    crossProduct: {
      related: "Client",
      change: "Payment Ledger Entry & Receipt Generation",
      description: "Successful QR checkout logs an audited transaction in Client > Invoices, updates invoice status to 'Paid', and sends an SMS receipt to patient.",
      link: "/client/invoices",
    },
    features: [
      {
        id: "F-1",
        name: "Dynamic UPI / Contactless Payment QR Modal",
        whatItDoes: "Generates an encrypted dynamic QR code representing the exact invoice balance. Patients scan the code with any UPI or mobile banking app (GPay, PhonePe, Paytm, Banking Apps). Listens for payment webhook and completes transaction without touching hardware. To confirm: What is the UPI payment webhook timeout before the kiosk prompts the patient to visit the physical billing counter?",
        includes: [
          ["F-1.1: High-Resolution QR Canvas", "Canvas Code", "Dynamically rendered QR code encoded with merchant VPA, invoice ID, and amount", "Scannable from 1 meter away"],
          ["F-1.2: Payment Amount & Merchant Header", "Header Card", "Displays Practice Name, Invoice Number, and exact charge in bold currency", "Clear verified trust seal"],
          ["F-1.3: Real-Time Polling & Webhook Listener", "Status Listener", "Detects bank payment settlement within 1.5 seconds and triggers success state", "Zero button press needed"],
          ["F-1.4: Payment Success Animation & Confetti", "Animation", "Celebratory confetti burst, checkmark confirmation, and auto-dismiss timer", "Positive patient experience"],
        ],
        examples: [
          ["Patient taps 'Pay Now' on $50 consultation fee", "Modal generates dynamic QR code on screen", "Patient scans with phone, enters UPI PIN; kiosk plays success chime and prints receipt"],
        ],
        jobs: [
          ["F-1-J1", "Patient", "I want to pay my medical bill using my smartphone camera, so that I can settle dues quickly without handling plastic cards or cash."],
        ],
        criteria: [
          ["F-1-1", "Upon payment webhook confirmation, invoice status updates to 'Paid' instantly."],
          ["F-1-2", "Kiosk prints thermal receipt and displays confirmation screen for 10 seconds."],
        ],
      },
    ],
  },

  // ── 9. Kiosk Settings & Queue Rules: Physical Stations ──
  {
    product: "ai-receptionist",
    module: "settings",
    channel: "stations",
    dest: "content/ai-receptionist/settings/stations.md",
    title: "Physical Station CRUD & Department Allocation",
    summary: "The Physical Stations PRD specifies the administrative configuration interface for physical clinic destinations. Allows clinic managers to create, edit, deactivate, and assign doctors to Consultation Rooms, Diagnostic Labs, Billing Counters, and Pharmacy Dispensary Stations.",
    crossProduct: {
      related: "Client",
      change: "Station Taxonomy & Provider Assignment",
      description: "Stations configured here immediately define the room picker options in Client appointments and the physical destination badges across all kiosk screens.",
      link: "/client/settings/organization",
    },
    features: [
      {
        id: "F-1",
        name: "Station Management Table & Provider Linkage",
        whatItDoes: "Provides a full CRUD data table of physical clinic spaces. Each station defines Name, Station Type (doctor_room, pharmacy, lab, billing, desk, custom), assigned Room Number, Floor/Wing, walking directions landmark text, and active status toggle.",
        includes: [
          ["F-1.1: Station Roster Data Table", "Data Table", "Columns: Station Name, Type, Assigned Provider, Floor/Wing, Status Toggle, Actions", "Search and filter by wing"],
          ["F-1.2: Add / Edit Station Modal", "Form Modal", "Inputs for Name, Type dropdown, Room Number, Wing selector, Directions text", "Instant validation"],
          ["F-1.3: Assigned Practitioner Binding", "Dropdown Picker", "Binds station to active clinic doctor (e.g. Dr. Rajesh Patel assigned to Room 102)", "Updates route automatically"],
          ["F-1.4: Active Status Switch", "Toggle Switch", "Toggles station between Active and Under Maintenance, removing closed rooms from kiosk directory", "Immediate kiosk sync"],
        ],
        examples: [
          ["Clinic opens new Pediatrics wing on 1st Floor", "Manager clicks 'Add Station'", "Enters 'Dr. Priya Nair - Room 204', selects 1st Floor Wing, enters directions, and activates"],
        ],
        jobs: [
          ["F-1-J1", "Clinic Manager", "I want to configure our physical consultation rooms and doctor assignments, so that kiosk wayfinding directions are always accurate."],
        ],
        criteria: [
          ["F-1-1", "Saving a station immediately updates the Reception kiosk wayfinding directory and room database."],
          ["F-1-2", "Deactivating a station prevents tokens from being dispatched to that room."],
        ],
      },
    ],
  },

  // ── 10. Kiosk Settings & Queue Rules: Queue Configuration ──
  {
    product: "ai-receptionist",
    module: "settings",
    channel: "queue",
    dest: "content/ai-receptionist/settings/queue.md",
    title: "Queue Taxonomy, Token Prefixes & Buffer Rules",
    summary: "The Queue Configuration PRD defines the operational rules governing ticket generation, early arrival check-in buffers, late arrival grace periods, aging caps, and token taxonomy across doctor rooms, labs, billing counters, and pharmacies.",
    crossProduct: {
      related: "Client",
      change: "Global Practice Queue Policy",
      description: "Queue timing buffers set here govern the appointment check-in eligibility rules enforced across Client front-desk triage and kiosk check-in.",
      link: "/client/processes/stages",
    },
    features: [
      {
        id: "F-1",
        name: "Token Prefix Taxonomy & Arrival Buffer Configuration",
        whatItDoes: "Configures single-letter token prefixes for clinic departments (Doctor: 'D-', Pharmacy: 'P-', Lab: 'L-', Billing: 'B-', Desk: 'R-') and sets strict timing buffer windows for patient arrivals. To confirm: When a patient arrives later than the 15-minute late grace window, should the queue manager automatically re-sequence them to the end of the line or require manual receptionist triage?",
        includes: [
          ["F-1.1: Token Prefix Taxonomy Form", "Input Grid", "Configurable prefix inputs for Doctor (D-), Pharmacy (P-), Lab (L-), Billing (B-), Desk (R-)", "Enforces unique single letter"],
          ["F-1.2: Early Arrival Buffer Slider", "Time Input", "Configures how early a patient can check in prior to appointment (Default: 30 minutes)", "Min 10m / Max 120m"],
          ["F-1.3: Late Arrival Grace Period", "Time Input", "Configures grace window for delayed patients before slot forfeiture (Default: 15 minutes)", "Min 5m / Max 60m"],
          ["F-1.4: Queue Aging Cap Setting", "Time Input", "Configures maximum wait threshold before ticket priority automatically escalates (Default: 45m)", "Prevents patient neglect"],
          ["F-1.5: Supported Kiosk Languages", "Multi-Select", "Checkboxes for enabled kiosk languages (English, Hindi, Spanish, Arabic)", "Controls Aria language options"],
        ],
        examples: [
          ["Patient arrives 40 minutes prior to appointment", "Kiosk checks early arrival buffer (30m)", "Kiosk displays friendly message: 'Check-in opens at 2:00 PM (30 min before your appointment)'"],
          ["Administrator sets Doctor Prefix to 'D-'", "Clicks 'Save Queue Configuration'", "All subsequent doctor consultation tickets format as D-001, D-002, etc."],
        ],
        jobs: [
          ["F-1-J1", "Clinic Operations Director", "I want to set arrival buffers and queue prefix rules, so that our patient queue runs orderly and avoids crowded waiting areas."],
        ],
        criteria: [
          ["F-1-1", "Patients arriving earlier than earlyArrivalBufferMin cannot issue a token until the window opens."],
          ["F-1-2", "Tokens increment sequentially per department prefix and reset daily at midnight."],
        ],
      },
    ],
  },
];

receptionPrds.forEach((p) => {
  const content = formatPrd(p);
  const fullPath = path.join(rootDir, p.dest);
  savePrd(fullPath, content);
});

console.log(`Generated ${receptionPrds.length} AI Receptionist PRDs successfully.`);

