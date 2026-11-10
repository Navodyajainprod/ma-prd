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
    description: "Collaborative care team task checklist with priority flags, SLA tracking, and patient chart deep-links.",
    availableIn: { client: true, admin: true, companion: true, "ai-receptionist": false },
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
          name: "Reception Kiosk",
          channel: "reception",
          description: "Physical room stations CRUD, token prefixes (D-, P-, L-, B-, R-), and queue buffer settings.",
        },
      ],
      "ai-receptionist": [
        {
          id: "stations",
          name: "Physical Stations",
          channel: "stations",
          description: "CRUD management for Doctor Rooms, Diagnostic Labs, Billing Counters, and Dispensary Stations.",
        },
        {
          id: "queue",
          name: "Queue Configuration",
          channel: "queue",
          description: "Token prefix taxonomy, early arrival buffers, late grace periods, and default intake flows.",
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
          name: "Outstanding Dues",
          channel: "invoices",
          description: "Mobile phone lookup of unpaid invoices, consultation charges, and diagnostic fees.",
        },
        {
          id: "qr-pay",
          name: "Dynamic QR Checkout",
          channel: "qr-pay",
          description: "Instant UPI/Card QR code modal with real-time webhook confirmation and token generation.",
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
    description: "Patient check-in, face recognition verification, walk-in registration, and automated queue token issuance.",
    availableIn: { client: false, admin: false, companion: false, "ai-receptionist": true },
    submodulesByProduct: {
      "ai-receptionist": [
        {
          id: "scheduled",
          name: "Scheduled Check-In",
          channel: "scheduled",
          description: "Face recognition and phone verification for scheduled appointments with doctor matching.",
        },
        {
          id: "walk-in",
          name: "Walk-In Registration",
          channel: "walk-in",
          description: "New and returning patient walk-in registration, face enrollment, doctor/service selection.",
        },
      ],
    },
  },
  {
    id: "directions",
    name: "Wayfinding & Directions",
    category: "AI RECEPTIONIST KIOSK",
    description: "Interactive clinic navigation, department directories, room routing, and facility wayfinding.",
    availableIn: { client: false, admin: false, companion: false, "ai-receptionist": true },
    submodulesByProduct: {
      "ai-receptionist": [
        {
          id: "departments",
          name: "Department Directory",
          channel: "departments",
          description: "Categorized clinic zones: Doctor Consultation (OPD), Labs, Pharmacy, and Facilities.",
        },
        {
          id: "rooms",
          name: "Room-by-Room Route",
          channel: "rooms",
          description: "Turn-by-turn interactive wayfinding, floor map navigation, elevator and corridor guidance.",
        },
      ],
    },
  },
  {
    id: "my-visit",
    name: "My Visit & Live Queue",
    category: "AI RECEPTIONIST KIOSK",
    description: "Real-time queue ticket tracking, current serving token display, estimated wait time, and next step instructions.",
    availableIn: { client: false, admin: false, companion: false, "ai-receptionist": true },
  },
  {
    id: "avatar",
    name: "Aria Voice & Avatar Stage",
    category: "AI RECEPTIONIST KIOSK",
    description: "Clinical glassmorphic stage featuring the animated Aria avatar, Whisper speech recognition, and bilingual speech.",
    availableIn: { client: false, admin: false, companion: false, "ai-receptionist": true },
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
