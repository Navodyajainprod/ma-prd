import path from "path";
import { formatPrd, savePrd } from "./generator_helpers.mjs";

const rootDir = process.cwd();

const companionPrds = [
  {
    product: "companion",
    module: "today",
    dest: "content/companion/today.md",
    title: "Today's Visit Agenda, Live Queue & Doctor ETA",
    summary: "The Today tab serves as the patient's personal appointment command center on visit day. It displays their upcoming consultation time, attending physician details, live queue ticket number, current serving token, and clear consultation room wayfinding directions.",
    crossProduct: {
      related: "Client",
      change: "Patient Arrival Synchronization",
      description: "When the patient taps 'I Have Arrived' on their Today visit card, the appointment updates to 'Arrived' on the clinic's appointments schedule in Client.",
      link: "/client/appointments/list",
    },
    features: [
      {
        id: "F-1",
        name: "Patient Daily Visit Card & Doctor ETA Tracker",
        whatItDoes: "Displays today's appointment card with appointment time, attending doctor name, clinic address, and dynamic estimated wait time.",
        includes: [
          ["F-1.1: Appointment Header Card", "UI Card", "Shows Doctor Avatar, Doctor Name, Specialty, Clinic Suite, and Scheduled Time", "Highlighted in blue"],
          ["F-1.2: One-Tap 'I Have Arrived' Button", "Button", "Allows patient to confirm arrival from clinic parking lot or lobby", "Activates within geofence"],
          ["F-1.3: Doctor ETA & Wait Time Counter", "Time Indicator", "Displays live estimate of minutes remaining until consultation begins", "Updates dynamically"],
        ],
        examples: [
          ["Patient arrives at clinic building", "Opens Companion app on phone and taps 'I Have Arrived'", "Appointment card confirms arrival, issues ticket 'D-104', and notifies Dr. Jenkins"],
        ],
        jobs: [
          ["F-1-J1", "Patient", "On the day of my appointment, I want to check in from my phone, so that I don't have to wait in line at the physical reception desk."],
        ],
        criteria: [
          ["F-1-1", "Tapping 'I Have Arrived' changes status to checked-in and triggers the queue token card."],
        ],
      },
      {
        id: "F-2",
        name: "Real-Time Queue Position & Current Serving Ticket",
        whatItDoes: "Renders the patient's queue ticket number (e.g. 'D-104') alongside the ticket currently being served (e.g. 'D-102') and how many patients are ahead in line.",
        includes: [
          ["F-2.1: Queue Ticket Display", "Badge Card", "Large prominent ticket badge e.g. 'D-104' with animated pulse when next in line", "Clear high-contrast display"],
          ["F-2.2: Current Serving Counter", "Counter Card", "Displays current ticket number being examined by the physician", "Refreshes in real time"],
          ["F-2.3: Consultation Room Wayfinding Banner", "Banner", "Displays clear destination instruction: 'Please proceed to Room 204 on 2nd Floor'", "Shows room number"],
        ],
        examples: [
          ["Patient waits in lobby", "Screen updates: 'Now Serving: D-103 (1 patient ahead)'", "Patient prepares to walk to exam room when their number is called"],
        ],
        jobs: [
          ["F-2-J1", "Patient", "While waiting for the doctor, I want to see my queue progress, so that I know exactly when it is my turn."],
        ],
        criteria: [
          ["F-2-1", "When the clinic calls the patient's token, the Companion app displays a full-screen notification with room directions."],
        ],
      },
    ],
  },
  {
    product: "companion",
    module: "appointments",
    dest: "content/companion/appointments.md",
    title: "Patient Appointment Booking & Visit History",
    summary: "The Visits & Booking module allows patients to book upcoming doctor appointments, select available consultation time slots, reschedule existing visits, and review past medical encounter histories.",
    features: [
      {
        id: "F-1",
        name: "Patient Self-Service Slot Booking & Rescheduling",
        whatItDoes: "Enables patients to browse available clinical specialties, choose their preferred physician, pick an available calendar time slot, and confirm appointment booking.",
        includes: [
          ["F-1.1: Provider & Specialty Browser", "List Selector", "Lists available clinic practitioners with photos, bios, and consultation fees", "Filters by specialty"],
          ["F-1.2: Calendar Date & Time Slot Picker", "Slot Grid", "Renders available 15/30m open appointment slots for selected date", "Locks slot during checkout"],
          ["F-1.3: One-Click Reschedule / Cancel", "Action Button", "Allows patient to reschedule or cancel with mandatory cancellation reason", "Requires 24h notice"],
        ],
        examples: [
          ["Patient needs follow-up visit with Dr. Jenkins", "Selects Dr. Jenkins, chooses Thursday 2:30 PM slot, and taps 'Confirm Booking'", "Visit is booked immediately; patient receives calendar invite and confirmation SMS"],
        ],
        jobs: [
          ["F-1-J1", "Patient", "When I need medical advice, I want to book an appointment directly from my phone, so that I don't have to call during office hours."],
        ],
        criteria: [
          ["F-1-1", "Selected appointment slots lock immediately to prevent duplicate bookings across patients."],
        ],
      },
    ],
  },
  {
    product: "companion",
    module: "tasks",
    dest: "content/companion/tasks.md",
    title: "Patient Prescribed Care Tasks & Reminders",
    summary: "The Tasks module provides a patient-facing health checklist: completing pre-operative fasting instructions, logging daily vitals (blood pressure, glucose), and checking off post-consultation care tasks.",
    features: [
      {
        id: "F-1",
        name: "Prescribed Health Checklist & Vitals Logging",
        whatItDoes: "Lists doctor-prescribed health tasks with due dates, instruction cards, and one-tap completion checkboxes that update clinician records in real time.",
        includes: [
          ["F-1.1: Health Task Checklist", "Checklist", "Displays task title, clinical instruction, due time, and completion checkbox", "Organized by Today vs Upcoming"],
          ["F-1.2: Vitals Input Modal", "Input Form", "Captures numeric vitals data (e.g. Blood Pressure '120/80', Blood Glucose '95 mg/dL')", "Validates physiological ranges"],
        ],
        examples: [
          ["Hypertension patient logs morning blood pressure", "Taps 'Log Blood Pressure' task, enters 122/82, and taps save", "Task checks off with green badge and reading logs to patient chart in Client"],
        ],
        jobs: [
          ["F-1-J1", "Patient", "When managing a chronic condition, I want a daily health task checklist, so that I stay compliant with my doctor's care plan."],
        ],
        criteria: [
          ["F-1-1", "Completed tasks update immediately in the clinician's Client Tasks Queue."],
        ],
      },
    ],
  },
  {
    product: "companion",
    module: "documents",
    dest: "content/companion/documents.md",
    title: "Medical Records, Lab Reports & Secure Downloads",
    summary: "The Health Records module gives patients access to their clinical diagnostic documents: blood test panels, imaging reports (X-Ray, MRI), consultation summaries, and downloadable PDF care instructions.",
    features: [
      {
        id: "F-1",
        name: "Diagnostic Lab Reports Vault & In-App PDF Preview",
        whatItDoes: "Organizes patient medical documents by date and category with in-app PDF previewing, full-text search, and encrypted file downloads.",
        includes: [
          ["F-1.1: Documents List Table", "File List", "Displays file name, issuing clinician, test date, and file size with PDF/Image icon", "Sortable by date"],
          ["F-1.2: In-App PDF Viewer", "Document Viewer", "Renders multi-page lab reports directly on mobile screen with zoom controls", "Includes clinical watermark"],
          ["F-1.3: Patient Document Upload Button", "File Uploader", "Enables uploading past medical records or outside lab results to share with clinic doctor", "Accepts PDF, JPG, PNG"],
        ],
        examples: [
          ["Patient checks recent blood test results", "Taps 'Comprehensive Metabolic Panel (Nov 8)'", "PDF opens smoothly in app showing normal glucose and lipid values"],
        ],
        jobs: [
          ["F-1-J1", "Patient", "When visiting a specialist, I want all my diagnostic lab reports on my phone, so that I can share test histories effortlessly."],
        ],
        criteria: [
          ["F-1-1", "Diagnostic documents uploaded by clinic staff appear in the patient vault immediately upon physician release."],
        ],
      },
    ],
  },
  {
    product: "companion",
    module: "forms",
    dest: "content/companion/forms.md",
    title: "Intake Forms, Medical History & Digital Signature",
    summary: "The Forms module allows patients to complete clinical intake questionnaires on their phone before visiting the clinic: entering medical histories, reviewing consent documents, and signing with their fingertip on a digital signature pad.",
    features: [
      {
        id: "F-1",
        name: "Mobile Patient Intake Form & Touch Signature Pad",
        whatItDoes: "Presents structured digital intake questionnaires with autosave, progress indicators, medical history checkboxes, and a touch-sensitive fingertip signature pad.",
        includes: [
          ["F-1.1: Digital Questionnaire Runner", "Form UI", "Clean single-column mobile form with progress bar and auto-save on field change", "Saves incomplete drafts"],
          ["F-1.2: Touchscreen Signature Pad", "Canvas Component", "Captures patient fingertip or stylus signature with clear and undo buttons", "Embeds vector signature into PDF"],
          ["F-1.3: Submission Confirmation Card", "Success UI", "Confirms completed intake and displays green checkmark: 'Your intake has been received by Dr. Jenkins'", "Locks submitted form"],
        ],
        examples: [
          ["New patient completes registration at home", "Fills allergy screening, signs consent pad with finger, and taps submit", "Form syncs to clinic EHR and eliminates waiting room paperwork"],
        ],
        jobs: [
          ["F-1-J1", "Patient", "Before arriving at the clinic, I want to fill out medical forms on my couch, so that I don't have to fill out clipboards in the waiting room."],
        ],
        criteria: [
          ["F-1-1", "Submitted forms lock against subsequent edits and append a cryptographic signature timestamp."],
        ],
      },
    ],
  },
  {
    product: "companion",
    module: "billing",
    dest: "content/companion/billing.md",
    title: "Patient Copays, Invoices & Digital Checkout",
    summary: "The Billing & Invoices module enables patients to review outstanding clinic copays, inspect itemized charge breakdowns, and pay securely via Credit/Debit Card or UPI with instant receipt downloads.",
    features: [
      {
        id: "F-1",
        name: "Outstanding Copay Ledger & Digital Payment Checkout",
        whatItDoes: "Displays outstanding patient balances with itemized consultation and lab charges, integrating Stripe / UPI checkout for one-tap bill payment.",
        includes: [
          ["F-1.1: Outstanding Balance Card", "Summary Card", "Highlights total amount due with breakdown: Doctor Copay, Diagnostic Tests, Pharmacy", "Prominent 'Pay Now' button"],
          ["F-1.2: Instant Payment Gateway Checkout", "Payment Modal", "Supports Credit Card, Apple Pay, Google Pay, and UPI QR code payment rails", "PCI-DSS compliant"],
          ["F-1.3: Payment Receipt PDF Download", "Receipt Generator", "Generates downloadable tax receipt with payment reference ID and clinic address", "Saved to payment history"],
        ],
        examples: [
          ["Patient receives bill notification for $35 copay", "Opens Billing tab, taps 'Pay Now', confirms with Apple Pay", "Payment processes in 2 seconds; receipt is saved and balance resets to $0.00"],
        ],
        jobs: [
          ["F-1-J1", "Patient", "When paying my medical bill, I want a secure one-tap mobile checkout, so that I can settle copays without waiting at the cashier desk."],
        ],
        criteria: [
          ["F-1-1", "Successful digital payments immediately update the patient's balance to zero and mark the invoice paid in Client Billing."],
        ],
      },
    ],
  },
  {
    product: "companion",
    module: "pharmacy",
    dest: "content/companion/pharmacy.md",
    title: "Prescriptions, Medication Schedule & Refill Requests",
    summary: "The Prescriptions & Meds module tracks patient active medications: displaying drug names, dosages, daily schedules, prescribing doctors, and providing a one-tap prescription refill request button.",
    features: [
      {
        id: "F-1",
        name: "Active Medication Schedule & Prescription Refills",
        whatItDoes: "Displays current medications with dosage instructions (e.g. 'Metformin 500mg, Take 1 tablet twice daily with meals') and provides an automated refill request button sent directly to the prescribing doctor.",
        includes: [
          ["F-1.1: Active Prescriptions Card List", "Prescription Cards", "Shows Drug Name, Dosage, Frequency, Prescribing Doctor, and Remaining Refills", "Color-coded pill icons"],
          ["F-1.2: One-Tap Refill Request Button", "Action Button", "Sends an automated refill approval task directly to prescribing clinician", "Notifies patient upon approval"],
          ["F-1.3: Dispensing Pharmacy Details", "Info Card", "Displays designated clinic or retail pharmacy address, hours, and phone number", "Includes directions link"],
        ],
        examples: [
          ["Patient runs low on blood pressure medication", "Taps 'Request Refill' on Lisinopril prescription card", "Refill request routes to Dr. Jenkins in Client; doctor approves with one click"],
        ],
        jobs: [
          ["F-1-J1", "Patient", "When my medication is running out, I want to request a refill from my phone, so that my doctor can approve it without an in-person appointment."],
        ],
        criteria: [
          ["F-1-1", "Refill requests create a task in the prescribing clinician's queue with previous prescription details."],
        ],
      },
    ],
  },
];

companionPrds.forEach((spec) => {
  const content = formatPrd(spec);
  const fullPath = path.join(rootDir, spec.dest);
  savePrd(fullPath, content);
});

console.log(`Generated ${companionPrds.length} Companion PRDs successfully.`);

