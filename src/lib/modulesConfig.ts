export type ProductId = "client" | "admin" | "companion" | "ai-receptionist";

export interface SubModuleDefinition {
  id: string;
  name: string;
  channel: string;
  description: string;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  category: string;
  iconName?: string;
  description: string;
  availableIn: Record<ProductId, boolean>;
  submodulesByProduct?: Partial<Record<ProductId, SubModuleDefinition[]>>;
  submodules?: SubModuleDefinition[];
}

export interface ProductConfig {
  id: ProductId;
  name: string;
  badge: string;
  description: string;
}

export const PRODUCTS: ProductConfig[] = [
  {
    id: "client",
    name: "Client",
    badge: "Clinical Console",
    description: "The primary MantraAssist workspace for healthcare providers, doctors, receptionists, and practice coordinators.",
  },
  {
    id: "admin",
    name: "Admin",
    badge: "Platform Control",
    description: "The superadmin console for platform configurations, industry blueprints, AI voice models, billing plans, and organizational policies.",
  },
  {
    id: "companion",
    name: "Companion",
    badge: "Patient Portal",
    description: "The patient-facing portal and AI health companion providing visit tracking, doctor messaging, intake forms, billing, and care groups.",
  },
  {
    id: "ai-receptionist",
    name: "AI Receptionist",
    badge: "Kiosk & Voice Surface",
    description: "The on-premise voice avatar and touch kiosk console for patient check-in, wayfinding, walk-in registration, and queue ticketing.",
  },
];

export const ALL_MODULES: ModuleDefinition[] = [
  // ── Client Modules ──
  {
    id: "overview",
    name: "Overview Dashboard",
    category: "WORKSPACE",
    description: "Central dashboard with daily visit agendas, real-time clinical activity feed, and conversion funnel metrics.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "clients",
    name: "Contact / Patients",
    category: "WORKSPACE",
    description: "Comprehensive EHR patient chart, demographic directory, clinical intake histories, and encounter logs.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "call-logs",
    name: "Call Logs & Telephony",
    category: "WORKSPACE",
    description: "VoIP and SIP dialer hub with call recordings, transcriptions, voicemail triage, and telecom performance.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "chat",
    name: "Chats & Care Groups",
    category: "WORKSPACE",
    description: "Unified omnichannel inbox across WhatsApp, SMS, Website, Email, and Companion channels plus multi-party Care Groups.",
    availableIn: { client: true, admin: false, companion: true, "ai-receptionist": false },
    submodulesByProduct: {
      client: [
        {
          id: "whatsapp",
          name: "WhatsApp",
          channel: "whatsapp",
          description: "WhatsApp Business API, Meta 24-hour window tracker, and approved HSM templates.",
        },
        {
          id: "sms",
          name: "SMS",
          channel: "sms",
          description: "Carrier SMS text messaging, 10DLC compliance, and character segment calculator.",
        },
        {
          id: "website",
          name: "Website",
          channel: "website",
          description: "Live website chat widget, Process-Driven AI First Responder, and 5-section Widget Settings drawer.",
        },
        {
          id: "companion",
          name: "Companion",
          channel: "companion",
          description: "Patient portal channel, Multi-Party Care Groups (exclusive New Group CTA), and Process-Driven Care Bot.",
        },
      ],
    },
  },
  {
    id: "processes",
    name: "Process & Deals",
    category: "WORKSPACE",
    description: "Kanban and list-based clinical workflows (Client Intake, Care Protocols, Discharge Follow-ups).",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
    submodulesByProduct: {
      client: [
        {
          id: "kanban",
          name: "Kanban Board",
          channel: "kanban",
          description: "Drag-and-drop visual pipeline stages, deal values, and bottleneck diagnostics.",
        },
        {
          id: "list",
          name: "Instances List",
          channel: "list",
          description: "Filterable tabular workflow view with stage duration, responsible filters, and SLA indicators.",
        },
      ],
    },
  },
  {
    id: "tasks",
    name: "Tasks Queue",
    category: "WORKSPACE",
    description: "Cross-product task delegation across Admin (org/role scoping), Client (My Tasks vs Tasks by me), and Patient Companion (deliverables & live sync).",
    availableIn: { client: true, admin: true, companion: true, "ai-receptionist": false },
    submodulesByProduct: {
      client: [
        {
          id: "my-tasks",
          name: "My Tasks",
          channel: "my-tasks",
          description: "Focused work inbox for tasks assigned to you by clinic teammates or top-down Admin role delegations.",
        },
        {
          id: "tasks-by-me",
          name: "Tasks by me",
          channel: "tasks-by-me",
          description: "Delegation workspace for Team Member & Client Contact (Companion) tasks, Workflow stages, Task Studio, and Sharing.",
        },
      ],
    },
  },
  {
    id: "appointments",
    name: "Appointments & Visits",
    category: "WORKSPACE",
    description: "Multi-provider clinical schedule calendar, room assignments, visit reasons, and waitlist management.",
    availableIn: { client: true, admin: false, companion: true, "ai-receptionist": false },
    submodulesByProduct: {
      client: [
        {
          id: "calendar",
          name: "Calendar Schedule",
          channel: "calendar",
          description: "Provider Day, Week, and Month calendar with room allocations and slot booking.",
        },
        {
          id: "list",
          name: "Appointments List",
          channel: "list",
          description: "Filterable appointments table with status badges, search, and bulk operations.",
        },
        {
          id: "availability",
          name: "Working Hours & Buffer",
          channel: "availability",
          description: "Weekly recurring availability rules, buffer intervals, and exception days-off.",
        },
      ],
    },
  },
  {
    id: "scribe",
    name: "AI Clinical Scribe",
    category: "WORKSPACE",
    description: "Ambient listening and voice consultation transcription generating structured SOAP clinical notes.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "services",
    name: "Product & Services",
    category: "REVENUE & INSIGHTS",
    description: "Catalog of billable clinical consultations, procedures, lab panels, and wellness care packages.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "invoices",
    name: "Invoices & Billing",
    category: "REVENUE & INSIGHTS",
    description: "Patient billing ledger, copay checkout, automated recurring invoices, and payment tracking.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "claims",
    name: "Insurance & Claims",
    category: "REVENUE & INSIGHTS",
    description: "EDI claim generation, clearinghouse integration, electronic remittance (ERA), and prior authorization.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    category: "REVENUE & INSIGHTS",
    description: "Executive revenue cycle, clinician productivity, patient appointment attendance, and retention KPIs.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "workflows",
    name: "Workflow Designer",
    category: "CUSTOMIZATIONS",
    description: "Visual node-based canvas to author automated trigger-condition-action clinical pipelines.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "automation",
    name: "Global Automation",
    category: "CUSTOMIZATIONS",
    description: "System-wide automated rules for patient status transitions, appointment reminders, and SLA escalations.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    category: "CUSTOMIZATIONS",
    description: "Clinic medical protocol repository, triage FAQ documents, and practice operational guides.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "web-forms",
    name: "Webforms & Intake",
    category: "CUSTOMIZATIONS",
    description: "Embeddable patient intake form builder with customizable fields, signature collection, and CRM sync.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": false },
  },
  {
    id: "settings",
    name: "Settings & Team",
    category: "SETTINGS",
    description: "Practice details, provider credentials, operating hours, notification preferences, and team roles.",
    availableIn: { client: true, admin: false, companion: false, "ai-receptionist": true },
    submodulesByProduct: {
      client: [
        {
          id: "organization",
          name: "Organization",
          channel: "organization",
          description: "Practice profile, clinic branding, operating timezone, and multi-location addresses.",
        },
        {
          id: "team",
          name: "Team & Roles",
          channel: "team",
          description: "Staff roster, provider invitations, credential verification, and permission assignment.",
        },
        {
          id: "billing",
          name: "Billing & Plans",
          channel: "billing",
          description: "Practice subscription tier, payment methods, credit replenishment, and invoice history.",
        },
        {
          id: "voices",
          name: "AI Voices / Models",
          channel: "voices",
          description: "LLM endpoint bindings, prompt parameters, and ElevenLabs speech synthesis profiles.",
        },
        {
          id: "custom-fields",
          name: "Custom Fields",
          channel: "custom-fields",
          description: "Entity custom attributes, layout drag-and-drop, and mandatory data requirements.",
        },
        {
          id: "integrations",
          name: "Integrations",
          channel: "integrations",
          description: "Third-party APIs: Twilio SIP telephony, Stripe checkout, Meta WhatsApp Cloud, webhooks.",
        },
        {
          id: "audit-logs",
          name: "Audit Logs",
          channel: "audit-logs",
          description: "HIPAA-compliant system audit trail tracking user authentication, data access, and edits.",
        },
        {
          id: "security",
          name: "Security & MFA",
          channel: "security",
          description: "Two-factor authentication, session inactivity timeouts, and password complexity enforcement.",
        },
        {
          id: "reception",
          name: "AI Receptionist",
          channel: "reception",
          description: "Full-width horizontal clinic persona, kiosk features, queue & onboarding rules, multi-terminal launching, and unified clinic rooms (Products & Services + standalone).",
        },
      ],
      "ai-receptionist": [
        {
          id: "stations",
          name: "Stations & Stage Guidance",
          channel: "stations",
          description: "Managing Clinic Rooms & Desks alongside Stage Portal & Reception Settings card design and dynamic fields.",
        },
        {
          id: "queue",
          name: "Queue Rules & Intake Defaults",
          channel: "queue",
          description: "Token prefix taxonomy (D-, P-, L-, B-, R-), late arrival grace window, anti-starvation aging cap, and default onboarding track.",
        },
        {
          id: "architecture",
          name: "Live Sync, Duplicate Safety & Reliability",
          channel: "architecture",
          description: "Real-time kiosk and front-desk synchronization, 24-hour double-tap protection, ordered ticket progress, and 60s privacy reset.",
        },
      ],
    },
  },

  // ── Admin Modules ──
  {
    id: "organizations",
    name: "Organizations & Clinics",
    category: "ORGANIZATION MANAGEMENT",
    description: "Multi-tenant practice provisioner, clinic branding, storage allocation, and subscription status.",
    availableIn: { client: false, admin: true, companion: false, "ai-receptionist": false },
  },
  {
    id: "industry-category",
    name: "Industry & Categories",
    category: "BLUEPRINTS & AUTOMATION",
    description: "Pre-configured vertical clinical blueprints (Dental, Dermatology, Mental Health, General Practice).",
    availableIn: { client: false, admin: true, companion: false, "ai-receptionist": false },
    submodulesByProduct: {
      admin: [
        {
          id: "categories",
          name: "Industry Categories",
          channel: "categories",
          description: "Top-level clinical taxonomy classifications and vertical grouping structures.",
        },
        {
          id: "industries",
          name: "Vertical Industries",
          channel: "industries",
          description: "Specialized clinical specialty profiles: Dental, Dermatology, Therapy, Cardiology.",
        },
      ],
    },
  },
  {
    id: "document-templates",
    name: "Document Templates",
    category: "BLUEPRINTS & AUTOMATION",
    description: "System master templates for referral letters, discharge summaries, and clinical consent docs.",
    availableIn: { client: false, admin: true, companion: false, "ai-receptionist": false },
  },
  {
    id: "custom-fields",
    name: "Custom Fields Master",
    category: "BLUEPRINTS & AUTOMATION",
    description: "Global clinical data dictionary, entity field configuration, and validation formulas.",
    availableIn: { client: false, admin: true, companion: false, "ai-receptionist": false },
    submodulesByProduct: {
      admin: [
        {
          id: "fields",
          name: "Fields Master",
          channel: "fields",
          description: "Global field definitions, data types (Text, Number, Date, Select), and validation formulas.",
        },
        {
          id: "sections",
          name: "Sections & Layout",
          channel: "sections",
          description: "Grouped layout containers, accordion headers, and role-based field visibility rules.",
        },
      ],
    },
  },
  {
    id: "sidebar-config",
    name: "Sidebar Configuration",
    category: "PLATFORM CONTROL",
    description: "Granular menu layout editor, feature flag toggles, and role-based navigation permissions.",
    availableIn: { client: false, admin: true, companion: false, "ai-receptionist": false },
  },
  {
    id: "roles",
    name: "Roles & Permissions",
    category: "PLATFORM CONTROL",
    description: "RBAC matrix managing access rights for Doctors, Nurses, Coordinators, and Billing Agents.",
    availableIn: { client: false, admin: true, companion: false, "ai-receptionist": false },
  },
  {
    id: "ai-voices-models",
    name: "AI Voice & Models",
    category: "AI ENGINE & AGENTS",
    description: "LLM endpoint bindings, prompt engineering parameters, and speech synthesis voice models.",
    availableIn: { client: false, admin: true, companion: false, "ai-receptionist": false },
  },
  {
    id: "plans",
    name: "Billing Plans & Addons",
    category: "COMMERCE & BILLING",
    description: "Practice subscription tier pricing, add-on credit limits (AI voice, SMS), and feature gates.",
    availableIn: { client: false, admin: true, companion: false, "ai-receptionist": false },
    submodulesByProduct: {
      admin: [
        {
          id: "plans",
          name: "Industry Plans",
          channel: "plans",
          description: "Master subscription tiers (Starter, Growth, Enterprise) with quotas and feature access gates.",
        },
        {
          id: "categories",
          name: "Plan Categories",
          channel: "categories",
          description: "Commercial tier groupings and packaging display categories.",
        },
        {
          id: "pricing",
          name: "Packed Pricing",
          channel: "pricing",
          description: "Credit bundles, team member seat packs, and country-specific telephony pricing.",
        },
        {
          id: "actions",
          name: "Credit Actions",
          channel: "actions",
          description: "Credit consumption deduction rules per minute of AI voice, SMS segment, or transcription.",
        },
      ],
    },
  },
  {
    id: "users",
    name: "Platform Users",
    category: "SECURITY & USERS",
    description: "Global admin user directory, SSO identity providers, MFA policies, and session revoking.",
    availableIn: { client: false, admin: true, companion: false, "ai-receptionist": false },
  },

  // ── Companion Modules ──
  {
    id: "today",
    name: "Today's Visit Agenda",
    category: "PATIENT COMPANION",
    description: "Patient daily appointment dashboard, live queue status, check-in card, and doctor ETA tracker.",
    availableIn: { client: false, admin: false, companion: true, "ai-receptionist": false },
  },
  {
    id: "documents",
    name: "Health Records & Files",
    category: "PATIENT COMPANION",
    description: "Patient lab reports, medical chart history, consultation summaries, and secure file downloads.",
    availableIn: { client: false, admin: false, companion: true, "ai-receptionist": false },
  },
  {
    id: "forms",
    name: "Intake Forms & History",
    category: "PATIENT COMPANION",
    description: "Pre-visit questionnaires, medical history intake, dynamic form submissions, and digital signature.",
    availableIn: { client: false, admin: false, companion: true, "ai-receptionist": false },
  },
  {
    id: "billing",
    name: "Billing & Invoices",
    category: "PATIENT COMPANION",
    description: "Patient copay ledger, itemized invoices, digital payment gateway checkout, and receipt history.",
    availableIn: { client: false, admin: false, companion: true, "ai-receptionist": true },
    submodulesByProduct: {
      "ai-receptionist": [
        {
          id: "invoices",
          name: "Billing Lookup & Ledger",
          channel: "invoices",
          description: "Phone and OTP verified invoice lookup, USD balance summaries, partial payments, and settled receipts.",
        },
        {
          id: "qr-pay",
          name: "Touchless QR Checkout",
          channel: "qr-pay",
          description: "Scannable Touchless QR Settlement card with wallet chips, copy-link shortcut, live billing sync, and payment confirmation.",
        },
      ],
    },
  },
  {
    id: "pharmacy",
    name: "Prescriptions & Meds",
    category: "PATIENT COMPANION",
    description: "Active medication schedule, refill requests, pharmacy locator, and dosage instructions.",
    availableIn: { client: false, admin: false, companion: true, "ai-receptionist": false },
  },

  // ── AI Receptionist Modules ──
  {
    id: "checkin",
    name: "Check-In & Booking",
    category: "AI RECEPTIONIST KIOSK",
    description: "Biometric face scan, Phone/OTP & family disambiguation, scheduled check-in, and walk-in registration & booking.",
    availableIn: { client: false, admin: false, companion: false, "ai-receptionist": true },
    submodulesByProduct: {
      "ai-receptionist": [
        {
          id: "identity-biometrics",
          name: "Identity Gate & Biometrics",
          channel: "identity-biometrics",
          description: "Camera face-scan oval, 3-2-1 capture countdown, silent profile matching, and first-name confirmation gate.",
        },
        {
          id: "phone-otp",
          name: "Phone, OTP & Family Picker",
          channel: "phone-otp",
          description: "12-key touch and voice keypad, 4-digit OTP verification, formatted number lookup, and shared-phone family picker.",
        },
        {
          id: "scheduled",
          name: "Scheduled Check-In",
          channel: "scheduled",
          description: "3-card verification summary (patient, appointment, room), arrival confirmation, staff sync, and live queue token issuance.",
        },
        {
          id: "walk-in",
          name: "Walk-In Registration & Booking",
          channel: "walk-in",
          description: "Voice-assisted onboarding form, automatic under-18 biometric skip, 3-angle face capture, and Service -> Doctor booking.",
        },
      ],
    },
  },
  {
    id: "directions",
    name: "Wayfinding & Directions",
    category: "AI RECEPTIONIST KIOSK",
    description: "Interactive 3-zone clinic directory synced with Reception Settings, spoken room lookup, and step-by-step hallway guidance.",
    availableIn: { client: false, admin: false, companion: false, "ai-receptionist": true },
    submodulesByProduct: {
      "ai-receptionist": [
        {
          id: "departments",
          name: "Department Directory & Sync",
          channel: "departments",
          description: "3-zone clinic directory dynamically synced with active Reception stations and clinic room settings.",
        },
        {
          id: "rooms",
          name: "Room Routes & Voice Deep-Link",
          channel: "rooms",
          description: "Room detail cards, bilingual spoken room matching, Direct Match highlight, wing guidance, and context-aware Back return.",
        },
      ],
    },
  },
  {
    id: "my-visit",
    name: "My Visit & Process Guidance",
    category: "AI RECEPTIONIST KIOSK",
    description: "Live queue ticket tracking, dynamic Process Stage next-step guidance, and biometric consent governance.",
    availableIn: { client: false, admin: false, companion: false, "ai-receptionist": true },
    submodulesByProduct: {
      "ai-receptionist": [
        {
          id: "tracker",
          name: "Active Visit & Queue Tracker",
          channel: "tracker",
          description: "Live ticket prioritization (In Service, Waiting, Completed), People Ahead wait estimate, and real-time nurse call progression.",
        },
        {
          id: "next-step",
          name: "Process Stage Next Steps",
          channel: "next-step",
          description: "Voice- and menu-driven stage cards with personalized care instructions configured in Process Reception Settings.",
        },
        {
          id: "biometric-consent",
          name: "Biometric Consent & Governance",
          channel: "biometric-consent",
          description: "Camera privacy rules, first-name identity gate, under-18 exclusion, audit trail visibility, and self-service or staff removal.",
        },
      ],
    },
  },
  {
    id: "avatar",
    name: "Aria Ambient, Voice & Kiosk Shell",
    category: "AI RECEPTIONIST KIOSK",
    description: "Walk-up ambient greeting, lifelike Aria speaking avatar, bilingual voice recognition, intent routing, and split kiosk shell.",
    availableIn: { client: false, admin: false, companion: false, "ai-receptionist": true },
    submodulesByProduct: {
      "ai-receptionist": [
        {
          id: "ambient-presence",
          name: "Ambient Presence & Wake Flow",
          channel: "ambient-presence",
          description: "Passive lobby approach detection, dormant -> engaged -> greeting -> listening -> routing sequence, and responsive home screen.",
        },
        {
          id: "aria-stage-speech",
          name: "Aria Stage, Voice & Intents",
          channel: "aria-stage-speech",
          description: "Smooth animated Aria portrait, 6 status halo states, bilingual English/Hindi speech capture with fallback, and smart intent routing.",
        },
        {
          id: "kiosk-shell",
          name: "Split Kiosk Shell, Dock & Alerts",
          channel: "kiosk-shell",
          description: "50/50 split stage, step dots, Floating Right Dock, EN/HI switcher, 60s privacy reset countdown, Call Staff alert, and feedback prompt.",
        },
      ],
    },
  },
];

export function getModulesForProduct(product: ProductId): ModuleDefinition[] {
  const mods = ALL_MODULES
    .filter((mod) => mod.availableIn[product])
    .map((mod) => {
      const subs = mod.submodulesByProduct?.[product];
      let cat = mod.category;
      if (product === "ai-receptionist") {
        cat = mod.id === "settings" ? "KIOSK SETTINGS" : "AI RECEPTIONIST KIOSK";
      }
      return {
        ...mod,
        category: cat,
        submodules: subs || undefined,
      };
    });

  if (product === "companion") {
    const order = ["today", "appointments", "tasks", "documents", "forms", "billing", "pharmacy", "chat"];
    mods.sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
  }

  if (product === "ai-receptionist") {
    const order = ["checkin", "directions", "my-visit", "avatar", "billing", "settings"];
    mods.sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
  }

  return mods;
}

export function getModuleById(id: string): ModuleDefinition | undefined {
  return ALL_MODULES.find((mod) => mod.id === id);
}

export function getProductLink(targetProductId: ProductId, currentModuleId?: string): string {
  const targetModules = getModulesForProduct(targetProductId);
  if (!targetModules || targetModules.length === 0) return `/${targetProductId}`;

  if (currentModuleId) {
    const match = targetModules.find((m) => m.id === currentModuleId);
    if (match) {
      if (match.submodules && match.submodules.length > 0) {
        return `/${targetProductId}/${match.id}/${match.submodules[0].id}`;
      }
      return `/${targetProductId}/${match.id}`;
    }
  }

  // Fallback to first module of target product
  const firstMod = targetModules[0];
  if (firstMod.submodules && firstMod.submodules.length > 0) {
    return `/${targetProductId}/${firstMod.id}/${firstMod.submodules[0].id}`;
  }
  return `/${targetProductId}/${firstMod.id}`;
}
