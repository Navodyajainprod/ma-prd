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
  availableIn: {
    client: boolean;
    admin: boolean;
    companion: boolean;
  };
  submodules?: SubModuleDefinition[];
}

export interface ProductConfig {
  id: "client" | "admin" | "companion";
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
];

export const ALL_MODULES: ModuleDefinition[] = [
  // ── Client Modules ──
  {
    id: "chat",
    name: "Chats & Care Groups",
    category: "WORKSPACE",
    description: "Unified omnichannel inbox across WhatsApp, SMS, Website, Email, and Companion channels plus multi-party Care Groups.",
    availableIn: { client: true, admin: false, companion: true },
    submodules: [
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
  {
    id: "overview",
    name: "Overview Dashboard",
    category: "WORKSPACE",
    description: "Central dashboard with daily visit agendas, real-time clinical activity feed, and conversion funnel metrics.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "clients",
    name: "Contact / Patients",
    category: "WORKSPACE",
    description: "Comprehensive EHR patient chart, demographic directory, clinical intake histories, and encounter logs.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "call-logs",
    name: "Call Logs & Telephony",
    category: "WORKSPACE",
    description: "VoIP and SIP dialer hub with call recordings, transcriptions, voicemail triage, and telecom performance.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "processes",
    name: "Process & Deals",
    category: "WORKSPACE",
    description: "Kanban and list-based clinical workflows (Client Intake, Care Protocols, Discharge Follow-ups).",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "tasks",
    name: "Tasks Queue",
    category: "WORKSPACE",
    description: "Collaborative care team task checklist with priority flags, SLA tracking, and patient chart deep-links.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "appointments",
    name: "Appointments & Visits",
    category: "WORKSPACE",
    description: "Multi-provider clinical schedule calendar, room assignments, visit reasons, and waitlist management.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "scribe",
    name: "AI Clinical Scribe",
    category: "WORKSPACE",
    description: "Ambient listening and voice consultation transcription generating structured SOAP clinical notes.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "services",
    name: "Product & Services",
    category: "REVENUE & INSIGHTS",
    description: "Catalog of billable clinical consultations, procedures, lab panels, and wellness care packages.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "invoices",
    name: "Invoices & Billing",
    category: "REVENUE & INSIGHTS",
    description: "Patient billing ledger, copay checkout, automated recurring invoices, and payment tracking.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "claims",
    name: "Insurance & Claims",
    category: "REVENUE & INSIGHTS",
    description: "EDI claim generation, clearinghouse integration, electronic remittance (ERA), and prior authorization.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    category: "REVENUE & INSIGHTS",
    description: "Executive revenue cycle, clinician productivity, patient appointment attendance, and retention KPIs.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "workflows",
    name: "Workflow Designer",
    category: "CUSTOMIZATIONS",
    description: "Visual node-based canvas to author automated trigger-condition-action clinical pipelines.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "automation",
    name: "Global Automation",
    category: "CUSTOMIZATIONS",
    description: "System-wide automated rules for patient status transitions, appointment reminders, and SLA escalations.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    category: "CUSTOMIZATIONS",
    description: "Clinic medical protocol repository, triage FAQ documents, and practice operational guides.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "web-forms",
    name: "Webforms & Intake",
    category: "CUSTOMIZATIONS",
    description: "Embeddable patient intake form builder with customizable fields, signature collection, and CRM sync.",
    availableIn: { client: true, admin: false, companion: false },
  },
  {
    id: "settings",
    name: "Settings & Team",
    category: "SETTINGS",
    description: "Practice details, provider credentials, operating hours, notification preferences, and team roles.",
    availableIn: { client: true, admin: false, companion: false },
  },

  // ── Admin Modules ──
  {
    id: "organizations",
    name: "Organizations & Clinics",
    category: "ORGANIZATION MANAGEMENT",
    description: "Multi-tenant practice provisioner, clinic branding, storage allocation, and subscription status.",
    availableIn: { client: false, admin: true, companion: false },
  },
  {
    id: "industry-category",
    name: "Industry & Categories",
    category: "BLUEPRINTS & AUTOMATION",
    description: "Pre-configured vertical clinical blueprints (Dental, Dermatology, Mental Health, General Practice).",
    availableIn: { client: false, admin: true, companion: false },
  },
  {
    id: "document-templates",
    name: "Document Templates",
    category: "BLUEPRINTS & AUTOMATION",
    description: "System master templates for referral letters, discharge summaries, and clinical consent docs.",
    availableIn: { client: false, admin: true, companion: false },
  },
  {
    id: "custom-fields",
    name: "Custom Fields Master",
    category: "BLUEPRINTS & AUTOMATION",
    description: "Global clinical data dictionary, entity field configuration, and validation formulas.",
    availableIn: { client: false, admin: true, companion: false },
  },
  {
    id: "sidebar-config",
    name: "Sidebar Configuration",
    category: "PLATFORM CONTROL",
    description: "Granular menu layout editor, feature flag toggles, and role-based navigation permissions.",
    availableIn: { client: false, admin: true, companion: false },
  },
  {
    id: "roles",
    name: "Roles & Permissions",
    category: "PLATFORM CONTROL",
    description: "RBAC matrix managing access rights for Doctors, Nurses, Coordinators, and Billing Agents.",
    availableIn: { client: false, admin: true, companion: false },
  },
  {
    id: "ai-voices-models",
    name: "AI Voice & Models",
    category: "AI ENGINE & AGENTS",
    description: "LLM endpoint bindings, prompt engineering parameters, and speech synthesis voice models.",
    availableIn: { client: false, admin: true, companion: false },
  },
  {
    id: "plans",
    name: "Billing Plans & Addons",
    category: "COMMERCE & BILLING",
    description: "Practice subscription tier pricing, add-on credit limits (AI voice, SMS), and feature gates.",
    availableIn: { client: false, admin: true, companion: false },
  },
  {
    id: "users",
    name: "Platform Users",
    category: "SECURITY & USERS",
    description: "Global admin user directory, SSO identity providers, MFA policies, and session revoking.",
    availableIn: { client: false, admin: true, companion: false },
  },

  // ── Companion Modules ──
  {
    id: "today",
    name: "Today's Visit Agenda",
    category: "PATIENT COMPANION",
    description: "Patient daily appointment dashboard, live queue status, check-in card, and doctor ETA tracker.",
    availableIn: { client: false, admin: false, companion: true },
  },
  {
    id: "documents",
    name: "Health Records & Files",
    category: "PATIENT COMPANION",
    description: "Patient lab reports, medical chart history, consultation summaries, and secure file downloads.",
    availableIn: { client: false, admin: false, companion: true },
  },
  {
    id: "pharmacy",
    name: "Prescriptions & Meds",
    category: "PATIENT COMPANION",
    description: "Active medication schedule, refill requests, pharmacy locator, and dosage instructions.",
    availableIn: { client: false, admin: false, companion: true },
  },
];

export function getModulesForProduct(product: "client" | "admin" | "companion"): ModuleDefinition[] {
  return ALL_MODULES
    .filter((mod) => mod.availableIn[product])
    .map((mod) => {
      // Omnichannel inbox channels (WhatsApp, SMS, Website, Companion) exist strictly within Client.
      // Companion (Patient Portal) and Admin do NOT have WhatsApp, SMS, or Website channels.
      if (product !== "client" && mod.submodules) {
        const { submodules, ...rest } = mod;
        if (product === "companion" && mod.id === "chat") {
          return {
            ...rest,
            description: "Secure patient messaging, Care Chat Bot with clinical shortcuts, 1:1 doctor consultations, and multi-party Care Groups.",
          };
        }
        return rest;
      }
      return mod;
    });
}

export function getModuleById(id: string): ModuleDefinition | undefined {
  return ALL_MODULES.find((mod) => mod.id === id);
}
