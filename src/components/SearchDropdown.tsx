"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, ArrowRight, CornerDownLeft } from "lucide-react";
import { ALL_MODULES, ProductId } from "@/lib/modulesConfig";

export interface SearchItem {
  id: string;
  title: string;
  product: ProductId;
  productLabel: string;
  module: string;
  section?: string;
  subtitle: string;
  href: string;
  keywords: string;
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
  // ── Client Modules & Tabs ──
  {
    id: "client-chat-whatsapp",
    title: "WhatsApp Messaging & 24h Meta Window",
    product: "client",
    productLabel: "Client",
    module: "Chats & Care Groups",
    section: "WhatsApp Channel",
    subtitle: "Meta Business Cloud API, 24h countdown timer, approved HSM templates",
    href: "/client/chat/whatsapp",
    keywords: "whatsapp meta 24h service window template hsm client chat",
  },
  {
    id: "client-chat-sms",
    title: "SMS Messaging & Segment Calculator",
    product: "client",
    productLabel: "Client",
    module: "Chats & Care Groups",
    section: "SMS Channel",
    subtitle: "Carrier text messaging, 10DLC compliance, GSM-7 and UCS-2 segment calculator",
    href: "/client/chat/sms",
    keywords: "sms 10dlc carrier opt-out stop gsm ucs segment calculator client chat",
  },
  {
    id: "client-chat-website",
    title: "Website Live Chat & Process Responder",
    product: "client",
    productLabel: "Client",
    module: "Chats & Care Groups",
    section: "Website Channel",
    subtitle: "Live visitor chat widget, AI First Responder, 5-section Widget Settings drawer",
    href: "/client/chat/website",
    keywords: "website chat widget visitor process responder live chat client",
  },
  {
    id: "client-chat-companion",
    title: "Companion Channel & Multi-Party Care Groups",
    product: "client",
    productLabel: "Client",
    module: "Chats & Care Groups",
    section: "Companion Channel",
    subtitle: "Patient portal messaging, Care Bot handoff, Care Group creation with members",
    href: "/client/chat/companion",
    keywords: "companion care group carebot pause resume patient portal client chat",
  },
  {
    id: "client-appointments-calendar",
    title: "Appointments Calendar & Provider Schedule",
    product: "client",
    productLabel: "Client",
    module: "Appointments & Visits",
    section: "Calendar Schedule",
    subtitle: "Provider Day/Week/Month calendar views, room assignments, slot booking",
    href: "/client/appointments/calendar",
    keywords: "appointments calendar provider schedule slots room client",
  },
  {
    id: "client-appointments-list",
    title: "Appointments Table & Status Management",
    product: "client",
    productLabel: "Client",
    module: "Appointments & Visits",
    section: "Appointments List",
    subtitle: "Filterable table with status badges (Confirmed, Arrived, In Progress, Completed)",
    href: "/client/appointments/list",
    keywords: "appointments list table status filter checkin client",
  },
  {
    id: "client-appointments-availability",
    title: "Provider Working Hours & Availability",
    product: "client",
    productLabel: "Client",
    module: "Appointments & Visits",
    section: "Working Hours & Buffer",
    subtitle: "Weekly recurring availability rules, buffer intervals, and exception days-off",
    href: "/client/appointments/availability",
    keywords: "appointments availability working hours buffer days off slots client",
  },
  {
    id: "client-overview",
    title: "Overview Dashboard & Clinical Activity Feed",
    product: "client",
    productLabel: "Client",
    module: "Overview Dashboard",
    subtitle: "Daily visit agendas, conversion funnel metrics, real-time activity stream",
    href: "/client/overview",
    keywords: "overview dashboard agenda activity feed funnel metrics client",
  },
  {
    id: "client-clients",
    title: "Contact & Patient EHR Directory",
    product: "client",
    productLabel: "Client",
    module: "Contact / Patients",
    subtitle: "Patient demographic profiles, clinical intake records, encounters, and timeline",
    href: "/client/clients",
    keywords: "patients contact directory ehr chart encounters client",
  },
  {
    id: "client-call-logs",
    title: "Call Logs & Telephony Hub",
    product: "client",
    productLabel: "Client",
    module: "Call Logs & Telephony",
    subtitle: "VoIP call recordings, audio player, AI transcriptions, sentiment tags",
    href: "/client/call-logs",
    keywords: "call logs telephony voip recordings transcript audio player client",
  },
  {
    id: "client-processes-kanban",
    title: "Clinical Process Kanban Board",
    product: "client",
    productLabel: "Client",
    module: "Process & Deals",
    section: "Kanban Board",
    subtitle: "Drag-and-drop clinical stages, deal values, and bottleneck diagnostics",
    href: "/client/processes/kanban",
    keywords: "process deals kanban pipeline stages drag drop client",
  },
  {
    id: "client-processes-list",
    title: "Process Instances List & SLA Indicators",
    product: "client",
    productLabel: "Client",
    module: "Process & Deals",
    section: "Instances List",
    subtitle: "Filterable tabular workflow view with stage duration and responsible filters",
    href: "/client/processes/list",
    keywords: "process instances list sla stage duration deals client",
  },
  {
    id: "client-tasks-my",
    title: "Client My Tasks Inbox",
    product: "client",
    productLabel: "Client",
    module: "Tasks Queue",
    section: "My Tasks",
    subtitle: "Focused work inbox for tasks assigned to you by clinic teammates or Admin roles",
    href: "/client/tasks/my-tasks",
    keywords: "tasks queue my tasks inbox assignee checklist admin delegation client",
  },
  {
    id: "client-tasks-by-me",
    title: "Client Tasks by Me & Task Studio",
    product: "client",
    productLabel: "Client",
    module: "Tasks Queue",
    section: "Tasks by me",
    subtitle: "Delegate Team Member & Companion Client Contact tasks, workflow stages, and share links",
    href: "/client/tasks/tasks-by-me",
    keywords: "tasks by me delegate workflow studio companion share checklist client",
  },
  {
    id: "client-scribe",
    title: "AI Clinical Scribe & SOAP Notes",
    product: "client",
    productLabel: "Client",
    module: "AI Clinical Scribe",
    subtitle: "Ambient voice recording, Whisper transcription, and structured SOAP clinical notes",
    href: "/client/scribe",
    keywords: "scribe ai soap notes ambient audio transcription whisper client",
  },
  {
    id: "client-services",
    title: "Product & Services Catalog",
    product: "client",
    productLabel: "Client",
    module: "Product & Services",
    subtitle: "Billable consultations, medical procedures, lab panels, and wellness care packages",
    href: "/client/services",
    keywords: "services products catalog billable consultations procedures pricing client",
  },
  {
    id: "client-invoices",
    title: "Invoices & Billing Ledger",
    product: "client",
    productLabel: "Client",
    module: "Invoices & Billing",
    subtitle: "Patient billing ledger, copay checkout, automated recurring invoices",
    href: "/client/invoices",
    keywords: "invoices billing copay payments ledger revenue client",
  },
  {
    id: "client-claims",
    title: "Insurance & Claims Management",
    product: "client",
    productLabel: "Client",
    module: "Insurance & Claims",
    subtitle: "EDI claim generation, clearinghouse integration, electronic remittance (ERA)",
    href: "/client/claims",
    keywords: "claims insurance edi clearinghouse era remittance authorization client",
  },
  {
    id: "client-reports",
    title: "Reports & Clinical Analytics",
    product: "client",
    productLabel: "Client",
    module: "Reports & Analytics",
    subtitle: "Revenue cycle, clinician productivity, and appointment attendance KPIs",
    href: "/client/reports",
    keywords: "reports analytics kpi revenue clinician attendance client",
  },
  {
    id: "client-workflows",
    title: "Workflow Designer Canvas",
    product: "client",
    productLabel: "Client",
    module: "Workflow Designer",
    subtitle: "Visual node-based canvas for automated trigger-condition-action clinical pipelines",
    href: "/client/workflows",
    keywords: "workflows designer visual canvas triggers actions nodes client",
  },
  {
    id: "client-automation",
    title: "Global Automation Engine",
    product: "client",
    productLabel: "Client",
    module: "Global Automation",
    subtitle: "System-wide automated rules for patient status transitions and reminders",
    href: "/client/automation",
    keywords: "automation global rules triggers escalations reminders client",
  },
  {
    id: "client-knowledge-base",
    title: "Clinic Knowledge Base & FAQs",
    product: "client",
    productLabel: "Client",
    module: "Knowledge Base",
    subtitle: "Medical protocol repository, triage FAQ documents, and practice operational guides",
    href: "/client/knowledge-base",
    keywords: "knowledge base protocols faqs clinical guides client",
  },
  {
    id: "client-web-forms",
    title: "Webforms & Digital Intake Builder",
    product: "client",
    productLabel: "Client",
    module: "Webforms & Intake",
    subtitle: "Embeddable intake form builder with customizable fields and signature collection",
    href: "/client/web-forms",
    keywords: "webforms forms intake builder signature embed client",
  },
  {
    id: "client-settings-organization",
    title: "Practice Profile & Clinic Details",
    product: "client",
    productLabel: "Client",
    module: "Settings & Team",
    section: "Organization",
    subtitle: "Clinic name, branding logo, operating timezone, and multi-location addresses",
    href: "/client/settings/organization",
    keywords: "settings organization clinic profile branding address client",
  },
  {
    id: "client-settings-team",
    title: "Team Members & Access Control",
    product: "client",
    productLabel: "Client",
    module: "Settings & Team",
    section: "Team & Roles",
    subtitle: "Staff directory, provider invitations, credential verification, and permissions",
    href: "/client/settings/team",
    keywords: "settings team members roles permissions invite staff client",
  },
  {
    id: "client-settings-reception",
    title: "Reception Kiosk & Stations Settings",
    product: "client",
    productLabel: "Client",
    module: "Settings & Team",
    section: "Reception Kiosk",
    subtitle: "Physical room stations CRUD, token prefixes (D-, P-, L-, B-, R-), and queue buffers",
    href: "/client/settings/reception",
    keywords: "settings reception stations queue tokens rooms kiosk client",
  },

  // ── Admin Modules & Tabs ──
  {
    id: "admin-custom-fields-fields",
    title: "Custom Fields Master Data Dictionary",
    product: "admin",
    productLabel: "Admin",
    module: "Custom Fields Master",
    section: "Fields Master",
    subtitle: "Global field definitions, data types (Text, Number, Date, Select), and validations",
    href: "/admin/custom-fields/fields",
    keywords: "admin custom fields dictionary types validation",
  },
  {
    id: "admin-custom-fields-sections",
    title: "Sections & Layout Master",
    product: "admin",
    productLabel: "Admin",
    module: "Custom Fields Master",
    section: "Sections & Layout",
    subtitle: "Grouped layout containers, accordion headers, and role-based field visibility rules",
    href: "/admin/custom-fields/sections",
    keywords: "admin custom fields sections layout accordion visibility",
  },
  {
    id: "admin-industry-category-categories",
    title: "Healthcare Industry Categories",
    product: "admin",
    productLabel: "Admin",
    module: "Industry & Categories",
    section: "Industry Categories",
    subtitle: "Top-level clinical taxonomy classifications and vertical grouping structures",
    href: "/admin/industry-category/categories",
    keywords: "admin industry categories taxonomy healthcare groupings",
  },
  {
    id: "admin-industry-category-industries",
    title: "Vertical Clinical Blueprints",
    product: "admin",
    productLabel: "Admin",
    module: "Industry & Categories",
    section: "Vertical Industries",
    subtitle: "Specialized clinical specialty profiles: Dental, Dermatology, Therapy, Cardiology",
    href: "/admin/industry-category/industries",
    keywords: "admin industries vertical blueprints dental dermatology therapy",
  },
  {
    id: "admin-plans-plans",
    title: "Industry Subscription Plans",
    product: "admin",
    productLabel: "Admin",
    module: "Billing Plans & Addons",
    section: "Industry Plans",
    subtitle: "Master subscription tiers (Starter, Growth, Enterprise) with quotas and feature gates",
    href: "/admin/plans/plans",
    keywords: "admin plans subscription tiers quotas pricing starter growth enterprise",
  },
  {
    id: "admin-plans-pricing",
    title: "Packed Pricing & Credit Bundles",
    product: "admin",
    productLabel: "Admin",
    module: "Billing Plans & Addons",
    section: "Packed Pricing",
    subtitle: "Credit bundles, team member seat packs, and country-specific telephony pricing",
    href: "/admin/plans/pricing",
    keywords: "admin plans pricing credits bundles seats country rates",
  },
  {
    id: "admin-plans-actions",
    title: "Credit Actions & Rate Cards",
    product: "admin",
    productLabel: "Admin",
    module: "Billing Plans & Addons",
    section: "Credit Actions",
    subtitle: "Credit deduction rules per minute of AI voice, SMS segment, or transcription",
    href: "/admin/plans/actions",
    keywords: "admin plans credit actions rate card per minute sms voice cost",
  },
  {
    id: "admin-organizations",
    title: "Multi-Tenant Practice Provisioning",
    product: "admin",
    productLabel: "Admin",
    module: "Organizations & Clinics",
    subtitle: "Multi-tenant practice provisioner, clinic branding, storage allocation, and status",
    href: "/admin/organizations",
    keywords: "admin organizations clinics multi tenant provisioning branding",
  },
  {
    id: "admin-document-templates",
    title: "Clinical Document Templates Master",
    product: "admin",
    productLabel: "Admin",
    module: "Document Templates",
    subtitle: "Master templates for referral letters, discharge summaries, and consent docs",
    href: "/admin/document-templates",
    keywords: "admin document templates referral discharge consent clinical master",
  },
  {
    id: "admin-sidebar-config",
    title: "Sidebar Navigation Layout Editor",
    product: "admin",
    productLabel: "Admin",
    module: "Sidebar Configuration",
    subtitle: "Granular menu layout editor, feature flag toggles, and role-based permissions",
    href: "/admin/sidebar-config",
    keywords: "admin sidebar navigation menu layout editor role permissions",
  },
  {
    id: "admin-roles",
    title: "Platform Roles & Permissions Matrix",
    product: "admin",
    productLabel: "Admin",
    module: "Roles & Permissions",
    subtitle: "RBAC matrix managing access rights for Doctors, Nurses, Coordinators, and Billing",
    href: "/admin/roles",
    keywords: "admin roles permissions rbac doctor coordinator billing access",
  },
  {
    id: "admin-ai-voices-models",
    title: "Global AI Voice & Model Registry",
    product: "admin",
    productLabel: "Admin",
    module: "AI Voice & Models",
    subtitle: "LLM endpoint bindings, prompt engineering parameters, and speech synthesis models",
    href: "/admin/ai-voices-models",
    keywords: "admin ai voice models llm endpoints speech synthesis elevenlabs",
  },
  {
    id: "admin-users",
    title: "Platform Superadmin Directory",
    product: "admin",
    productLabel: "Admin",
    module: "Platform Users",
    subtitle: "Global admin user directory, SSO identity providers, MFA policies, and sessions",
    href: "/admin/users",
    keywords: "admin users platform directory sso mfa security sessions",
  },

  // ── Companion Modules ──
  {
    id: "companion-chat",
    title: "Patient Messaging & Care Bot",
    product: "companion",
    productLabel: "Companion",
    module: "Chats & Care Groups",
    subtitle: "Secure patient messaging, Care Bot shortcuts, 1:1 doctor consultations, Care Groups",
    href: "/companion/chat",
    keywords: "companion patient chat care bot shortcuts doctor care group messages",
  },
  {
    id: "companion-today",
    title: "Today's Visit Agenda & Live Queue",
    product: "companion",
    productLabel: "Companion",
    module: "Today's Visit Agenda",
    subtitle: "Patient daily dashboard, live queue token tracker, and doctor ETA status card",
    href: "/companion/today",
    keywords: "companion today visit agenda queue token doctor eta checkin status",
  },
  {
    id: "companion-appointments",
    title: "Patient Appointment Booking & Visits",
    product: "companion",
    productLabel: "Companion",
    module: "Appointments & Visits",
    subtitle: "Book doctor consultations, select time slots, reschedule, and view visit history",
    href: "/companion/appointments",
    keywords: "companion appointments booking visit doctor slot reschedule",
  },
  {
    id: "companion-tasks",
    title: "Prescribed Health Tasks & Reminders",
    product: "companion",
    productLabel: "Companion",
    module: "Tasks Queue",
    subtitle: "Patient-prescribed health tasks, medication schedules, pre-op checklists",
    href: "/companion/tasks",
    keywords: "companion tasks prescribed checklist medication vitals instructions",
  },
  {
    id: "companion-documents",
    title: "Medical Records & Lab Reports",
    product: "companion",
    productLabel: "Companion",
    module: "Health Records & Files",
    subtitle: "Diagnostic lab reports, consultation summaries, imaging PDFs, and downloads",
    href: "/companion/documents",
    keywords: "companion documents records lab reports files pdf download",
  },
  {
    id: "companion-forms",
    title: "Intake Forms & Digital Signature",
    product: "companion",
    productLabel: "Companion",
    module: "Intake Forms & History",
    subtitle: "Pre-visit clinical questionnaires, medical history intake, and signature pad",
    href: "/companion/forms",
    keywords: "companion forms intake medical history digital signature questionnaires",
  },
  {
    id: "companion-billing",
    title: "Patient Copays & Billing Checkout",
    product: "companion",
    productLabel: "Companion",
    module: "Billing & Invoices",
    subtitle: "Outstanding copays, itemized invoice breakdown, UPI / card payment, receipts",
    href: "/companion/billing",
    keywords: "companion billing copay invoices payment upi card receipts",
  },
  {
    id: "companion-pharmacy",
    title: "Medication Schedule & Pharmacy",
    product: "companion",
    productLabel: "Companion",
    module: "Prescriptions & Meds",
    subtitle: "Active prescriptions, refill requests, pharmacy locator, and dosage instructions",
    href: "/companion/pharmacy",
    keywords: "companion pharmacy prescriptions medications refill dosage schedule",
  },

  // ── AI Receptionist Modules & Tabs ──
  {
    id: "ai-receptionist-checkin-identity-biometrics",
    title: "Identity Gate & Face Biometrics",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Check-In & Booking",
    section: "Identity Gate & Biometrics",
    subtitle: "Mirrored webcam oval scan, 3-2-1 capture, cosine similarity matching (0.70 threshold), and zero-PHI confirm gate",
    href: "/ai-receptionist/checkin/identity-biometrics",
    keywords: "ai receptionist face scan biometrics cosine similarity oval confirm gate privacy kiosk",
  },
  {
    id: "ai-receptionist-checkin-phone-otp",
    title: "Phone Keypad, OTP & Family Picker",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Check-In & Booking",
    section: "Phone, OTP & Family Picker",
    subtitle: "12-key touch/voice keypad, 4-digit OTP (5m expiry), 6-field normalized lookup, and multi-profile family picker",
    href: "/ai-receptionist/checkin/phone-otp",
    keywords: "ai receptionist phone keypad otp 1234 family picker multiple profiles lookup kiosk",
  },
  {
    id: "ai-receptionist-checkin-scheduled",
    title: "Scheduled Appointment Check-In",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Check-In & Booking",
    section: "Scheduled Check-In",
    subtitle: "3-card verification stack (patient, appointment, station), arrival confirmation, EventBus sync, and TokenAndCurrentServingCard",
    href: "/ai-receptionist/checkin/scheduled",
    keywords: "ai receptionist checkin scheduled appointment details summary confirm token queue eventbus kiosk",
  },
  {
    id: "ai-receptionist-checkin-walk-in",
    title: "Walk-In Registration & Booking",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Check-In & Booking",
    section: "Walk-In Registration & Booking",
    subtitle: "Voice-assisted onboarding, strict <18 biometric skip, 3-angle face capture, 0.85 duplicate check, and Service -> Doctor booking",
    href: "/ai-receptionist/checkin/walk-in",
    keywords: "ai receptionist walkin onboarding under 18 minor 3 angle face duplicate check service doctor next available kiosk",
  },
  {
    id: "ai-receptionist-billing-invoices",
    title: "Billing Lookup & Invoice Ledger",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Billing & Invoices",
    section: "Billing Lookup & Ledger",
    subtitle: "Phone/OTP gated unpaid invoice lookup, itemized dues, partial payment balance computation, and settled badges",
    href: "/ai-receptionist/billing/invoices",
    keywords: "ai receptionist billing lookup phone otp unpaid invoices partial payment settled ledger kiosk",
  },
  {
    id: "ai-receptionist-billing-qr-pay",
    title: "Touchless UPI QR Checkout & Reconciliation",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Billing & Invoices",
    section: "Touchless UPI QR Checkout",
    subtitle: "UPI deep-link QR modal (GPay/PhonePe/Paytm/BHIM), Copy Link, recordPayment reconciliation, confetti, and MantraAssist sync",
    href: "/ai-receptionist/billing/qr-pay",
    keywords: "ai receptionist upi qr code pay gpay phonepe paytm bhim apple pay confetti reconciliation kiosk",
  },
  {
    id: "ai-receptionist-directions-departments",
    title: "Department Directory & Room Sync",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Wayfinding & Directions",
    section: "Department Directory & Sync",
    subtitle: "3 clinic zones synced from ma_reception_stations and mantra_rooms_v1 with dental/imaging/clinical auto-mapping",
    href: "/ai-receptionist/directions/departments",
    keywords: "ai receptionist directions departments clinical pharmacy lab restrooms sync stations roomsStore kiosk",
  },
  {
    id: "ai-receptionist-directions-rooms",
    title: "Room Routes & Voice Deep-Linking",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Wayfinding & Directions",
    section: "Room Routes & Voice Deep-Link",
    subtitle: "Room directional cards, bilingual EN/HI voice synonym deep-linking, Direct Match badge, and context-aware Back action",
    href: "/ai-receptionist/directions/rooms",
    keywords: "ai receptionist directions rooms voice deep link direct match hindi synonyms pharmacy washroom kiosk",
  },
  {
    id: "ai-receptionist-my-visit-tracker",
    title: "Active Visit & Live Queue Tracker",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "My Visit & Process Guidance",
    section: "Active Visit & Queue Tracker",
    subtitle: "Live QueueTicket lookup (in_service > waiting > completed), Now Serving card, empty CTA, and staff VisitJourneyCard advance",
    href: "/ai-receptionist/my-visit/tracker",
    keywords: "ai receptionist my visit queue ticket tracker serving wait eta visitJourneyCard completeTicket kiosk",
  },
  {
    id: "ai-receptionist-my-visit-next-step",
    title: "Process Stage & Next-Step Guidance",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "My Visit & Process Guidance",
    section: "Process Stage Next Steps",
    subtitle: "Voice- and menu-driven stage cards and dynamic HTML instructions with {{variable}} substitution filtered by process settings",
    href: "/ai-receptionist/my-visit/next-step",
    keywords: "ai receptionist next step process stage guidance whats next view details html variable template kiosk",
  },
  {
    id: "ai-receptionist-my-visit-biometric-consent",
    title: "Biometric Consent & Governance",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "My Visit & Process Guidance",
    section: "Biometric Consent & Governance",
    subtitle: "Ephemeral FaceDetector bounds, zero-PHI gate, <18 prohibition, audit events, and staff FaceCheckinCard consent deletion",
    href: "/ai-receptionist/my-visit/biometric-consent",
    keywords: "ai receptionist biometric consent privacy minor delete face data faceCheckinCard audit event kiosk",
  },
  {
    id: "ai-receptionist-avatar-ambient-presence",
    title: "Ambient Presence & Wake Flow",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Aria Ambient, Voice & Kiosk Shell",
    section: "Ambient Presence & Wake Flow",
    subtitle: "5 FPS FaceDetector thresholds (0.14/0.30, dwell 2), dormant->engaged->greeting->listening->routing loop, and responsive home",
    href: "/ai-receptionist/avatar/ambient-presence",
    keywords: "ai receptionist ambient presence facedetector camera wake greeting quick actions responsive debug kiosk",
  },
  {
    id: "ai-receptionist-avatar-aria-stage-speech",
    title: "Aria Lip-Sync Stage, Whisper STT & Intent Engine",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Aria Ambient, Voice & Kiosk Shell",
    section: "Aria Stage, Whisper STT & Intents",
    subtitle: "Single <video> REST_POINTS choreography, 6 RGBA states, Whisper WebAudio WAV STT, WebSpeech fallback, and 2-stage intent engine",
    href: "/ai-receptionist/avatar/aria-stage-speech",
    keywords: "ai receptionist aria video rest points whisper stt groq webspeech intent engine voice command hindi english kiosk",
  },
  {
    id: "ai-receptionist-avatar-kiosk-shell",
    title: "Split Kiosk Shell, Dock, Timer & Staff Alert",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Aria Ambient, Voice & Kiosk Shell",
    section: "Split Kiosk Shell, Dock & Alerts",
    subtitle: "50/50 split layout, progress dots, Floating Right Dock, EN/HI switch, Mute, 60s inactivity reset, Call Staff modal, and Feedback",
    href: "/ai-receptionist/avatar/kiosk-shell",
    keywords: "ai receptionist kiosk shell dock language toggle mute 60s countdown inactivity call staff feedback toast",
  },
  {
    id: "ai-receptionist-settings-stations",
    title: "Physical Stations & Stage Guidance Builder",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Settings & Team",
    section: "Stations & Stage Guidance",
    subtitle: "Clinic Rooms & Desks CRUD (ma_reception_stations) and Process Stage HTML/Preview template & { } field builder",
    href: "/ai-receptionist/settings/stations",
    keywords: "ai receptionist settings stations crud doctor room lab billing desk stage guidance html preview variable kiosk",
  },
  {
    id: "ai-receptionist-settings-queue",
    title: "Queue Rules, Token Prefixes & Onboarding Defaults",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Settings & Team",
    section: "Queue Rules & Intake Defaults",
    subtitle: "Token prefixes (D-, P-, L-, B-, R-), Late Grace Window (5-45m), Anti-Starvation Cap (20-90m), and Default Onboarding Process",
    href: "/ai-receptionist/settings/queue",
    keywords: "ai receptionist settings queue prefixes grace window anti starvation aging default process ma_appointment_default_process",
  },
  {
    id: "ai-receptionist-settings-architecture",
    title: "IMaClient Contract, Persistence & Sync",
    product: "ai-receptionist",
    productLabel: "AI Receptionist",
    module: "Settings & Team",
    section: "IMaClient, Sync & Event Bus",
    subtitle: "IMaClient TypeScript interface, 9 ma_reception_* localStorage keys, 24h idempotency, subscribeToQueue, and EventBus",
    href: "/ai-receptionist/settings/architecture",
    keywords: "ai receptionist imaclient mockmaclient localstorage idempotency eventbus audit appointments_v1 clientsstore",
  },
];

const PRODUCT_BADGE_STYLES: Record<ProductId, string> = {
  client: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
  admin: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
  companion: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
  "ai-receptionist": "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
};

export default function SearchDropdown() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut: Cmd/Ctrl + K focuses the input
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return STATIC_SEARCH_ITEMS.slice(0, 8);
    }
    return STATIC_SEARCH_ITEMS.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.module.toLowerCase().includes(q) ||
        item.productLabel.toLowerCase().includes(q) ||
        (item.section && item.section.toLowerCase().includes(q)) ||
        item.keywords.toLowerCase().includes(q)
      );
    }).slice(0, 10);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-40 sm:w-64 md:w-80">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search PRDs..."
          className="w-full pl-8 pr-12 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg hover:border-slate-300 dark:hover:border-zinc-700 focus:border-[#1456f0] focus:ring-1 focus:ring-[#1456f0] focus:outline-hidden transition-all shadow-2xs"
          aria-label="Search PRDs"
          aria-expanded={isOpen}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="absolute right-2 hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-700 pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Results Dropdown Directly Underneath Input (No Modal, No Dark Overlay) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 max-h-[380px] bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-y-auto z-50 p-1.5 select-none animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800/80 mb-1">
            <span>{query ? "Search Results" : "Suggested Specifications"}</span>
            <span>{filteredItems.length} found</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 dark:text-zinc-400">
              No matching specifications found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const badgeClass = PRODUCT_BADGE_STYLES[item.product] || "bg-slate-100 text-slate-700";

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-slate-100 dark:bg-zinc-800/80 text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/60"
                    }`}
                  >
                    <FileText
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isSelected
                          ? "text-[#1456f0] dark:text-blue-400"
                          : "text-slate-400 dark:text-zinc-500"
                      }`}
                    />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${badgeClass}`}
                        >
                          {item.productLabel}
                        </span>
                        <span className="text-[11px] font-semibold truncate text-slate-900 dark:text-zinc-100">
                          {item.title}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                        <span className="font-medium text-slate-700 dark:text-zinc-300">
                          {item.module}
                        </span>
                        {item.section && ` • ${item.section}`} — {item.subtitle}
                      </p>
                    </div>

                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-zinc-800/80 px-2 py-0.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
            <span>Use ↑↓ to navigate, Enter to select</span>
            <span>ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
}

