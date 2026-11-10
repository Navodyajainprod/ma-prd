import path from "path";
import { formatPrd, savePrd } from "./generator_helpers.mjs";

const rootDir = process.cwd();

const adminPrds = [
  // ── Custom Fields (2 tabs) ──
  {
    product: "admin",
    module: "custom-fields",
    channel: "fields",
    dest: "content/admin/custom-fields/fields.md",
    title: "Global Custom Fields Master Data Dictionary",
    summary: "The Fields Master tab in the Admin workspace manages the platform-wide clinical data dictionary. Superadmins configure reusable field definitions, assign data types (Text, Number, Dropdown, Multi-select, Date, Boolean), and set validation formulas that automatically propagate to tenant EHR instances.",
    crossProduct: {
      related: "Client",
      change: "Custom Field Ingestion in Practice Settings",
      description: "Fields configured in the Admin master dictionary appear as available selectable fields for clinic coordinators in Client Settings > Custom Fields.",
      link: "/client/settings/custom-fields",
    },
    features: [
      {
        id: "F-1",
        name: "Global Clinical Data Dictionary & Field Creation",
        whatItDoes: "Defines master data fields with unique API keys, human-readable labels, entity associations (Client, Appointment, Process, Task), and data type constraints.",
        includes: [
          ["F-1.1: Master Fields Data Table", "Data Table", "Columns: Field Label, Key, Entity, Type, Validation, Required, Status", "Sortable by entity"],
          ["F-1.2: Add Field Drawer", "Drawer", "Slide-over drawer capturing Field Name, Key, Entity Selector, Data Type, and Placeholder", "Validates alphanumeric key"],
          ["F-1.3: Data Type Support Matrix", "Dropdown", "Supports: Text, Number, Single-Select Dropdown, Multi-Select Tags, Date Picker, Currency, Boolean", "Enforces type safety"],
        ],
        examples: [
          ["Admin registers 'Blood Type' clinical field", "Creates dropdown field 'blood_type' on Client entity with options A+, A-, B+, B-, O+, O-, AB+, AB-", "Field becomes available globally across all tenant intake forms"],
        ],
        jobs: [
          ["F-1-J1", "Platform Administrator", "When standardizing clinical schemas, I want a master data dictionary, so that all tenant practices collect structured, normalized health data."],
        ],
        criteria: [
          ["F-1-1", "Creating a master field registers its key and enforces validation formulas across all tenant schemas."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "custom-fields",
    channel: "sections",
    dest: "content/admin/custom-fields/sections.md",
    title: "Sections & Form Layout Master Architecture",
    summary: "The Sections Master tab organizes fields into grouped UI accordion sections (e.g. Demographics, Insurance Policies, Clinical History, Emergency Contacts) and configures role-based section visibility rules.",
    features: [
      {
        id: "F-1",
        name: "Section Containers & Visual Accordion Ordering",
        whatItDoes: "Defines grouped layout containers for entity drawer forms. Superadmins can reorder sections via drag handles, configure default expanded/collapsed states, and assign fields into specific sections.",
        includes: [
          ["F-1.1: Section Reordering Tree", "Drag List", "Drag-and-drop list of layout sections with handle indicators", "Persists order sequence"],
          ["F-1.2: Add Section Modal", "Modal", "Captures Section Title, Entity Association, and Default Expanded Toggle", "Creates new grouping container"],
          ["F-1.3: Role-Based Section Gate", "Permissions Matrix", "Hides or displays entire sections based on user role (e.g. 'Billing Info' hidden from Nurses)", "Enforces least-privilege view"],
        ],
        examples: [
          ["Admin sets up 'Insurance Details' section", "Creates section on Client entity, marks default expanded, and restricts edit to Billing and Admin roles", "Clinicians see insurance as read-only accordion"],
        ],
        jobs: [
          ["F-1-J1", "Platform Administrator", "When organizing dense clinical forms, I want collapsible section containers, so that practitioners are not overwhelmed by unstructured fields."],
        ],
        criteria: [
          ["F-1-1", "Reordering sections updates the display order on entity drawers across all client portals."],
        ],
      },
    ],
  },

  // ── Industry & Categories (2 tabs) ──
  {
    product: "admin",
    module: "industry-category",
    channel: "categories",
    dest: "content/admin/industry-category/categories.md",
    title: "Healthcare Vertical Industry Categories Taxonomy",
    summary: "The Industry Categories tab establishes top-level healthcare classifications (e.g., Primary Care, Dental Health, Mental & Behavioral Health, Surgical Specialties) that group vertical industry blueprints.",
    features: [
      {
        id: "F-1",
        name: "Master Healthcare Category Registry",
        whatItDoes: "Lists and manages high-level clinical taxonomy categories, tracking how many vertical practice templates and tenant clinics belong to each category.",
        includes: [
          ["F-1.1: Categories Table", "Data Table", "Columns: Category Name, Code, Description, Sub-Industries Count, Active Status", "Searchable"],
          ["F-1.2: Add Category Modal", "Modal", "Captures Category Name (e.g. 'Allied Health') and Description", "Generates taxonomy code"],
        ],
        examples: [
          ["Superadmin creates 'Specialized Therapy' category", "Fills name and description", "Category becomes selectable when creating new vertical industry blueprints"],
        ],
        jobs: [
          ["F-1-J1", "Platform Architect", "When scaling our SaaS platform, I want structured industry categories, so that practice blueprints are organized logically."],
        ],
        criteria: [
          ["F-1-1", "Creating a category allows it to immediately group new vertical industry templates."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "industry-category",
    channel: "industries",
    dest: "content/admin/industry-category/industries.md",
    title: "Vertical Clinical Blueprints & Practice Templates",
    summary: "The Vertical Industries tab manages specialized practice templates (e.g., Dental Practice, Dermatology Clinic, Mental Health Therapy, Pediatric Care). Each blueprint pre-configures specialized custom fields, intake forms, clinical processes, and terminology overrides.",
    features: [
      {
        id: "F-1",
        name: "Pre-Packaged Vertical Industry Blueprints",
        whatItDoes: "Defines vertical practice profiles that bundle specialized modules, pre-built clinical workflows, and default intake questionnaires for instant practice onboarding.",
        includes: [
          ["F-1.1: Industry Blueprints Grid", "Card Grid", "Cards for Dental, Dermatology, Psychology, Physical Therapy, General Practice", "Shows active tenant counts"],
          ["F-1.2: Clinical Terminology Overrides", "Dictionary", "Configures specialty labels: 'Patient' vs 'Client', 'Dentist' vs 'Doctor', 'Exam' vs 'Session'", "Overridden in client UI"],
          ["F-1.3: Blueprint Module Preset Bundler", "Toggles", "Pre-selects active modules and workflows when a tenant is provisioned with this blueprint", "Automates tenant setup"],
        ],
        examples: [
          ["Dental practice signs up for MantraAssist", "System assigns 'Dental Clinic' blueprint", "Workspace automatically opens with dental chart fields, tooth charting, and dental recall workflows"],
        ],
        jobs: [
          ["F-1-J1", "Onboarding Lead", "When provisioning a new medical specialty clinic, I want pre-packaged blueprints, so that the clinic is fully configured out of the box."],
        ],
        criteria: [
          ["F-1-1", "Tenants provisioned with an industry blueprint inherit all pre-configured fields and terminology overrides."],
        ],
      },
    ],
  },

  // ── Plans & Credits (4 tabs) ──
  {
    product: "admin",
    module: "plans",
    channel: "plans",
    dest: "content/admin/plans/plans.md",
    title: "Master Subscription Plans & Feature Gates Matrix",
    summary: "The Industry Plans tab configures commercial subscription tiers (Starter, Growth, Enterprise). Superadmins define monthly/annual pricing, user seat limits, credit allowances, and feature flag gates.",
    features: [
      {
        id: "F-1",
        name: "Subscription Plans Matrix & Quota Allocation",
        whatItDoes: "Maintains plan tiers with pricing, included clinician seat quotas, storage limits, and feature toggles (AI Scribe, Telephony, Multi-Location).",
        includes: [
          ["F-1.1: Plans Table", "Data Table", "Columns: Plan Name, Category, Monthly Price, Annual Price, Seat Quota, Active Tenants", "Includes edit drawer"],
          ["F-1.2: Feature Gate Toggles", "Toggles", "Granular feature access switches for each plan tier (e.g. Scribe enabled on Growth+)", "Enforced by API middleware"],
          ["F-1.3: Monthly Credit Allowance", "Number Input", "Sets free recurring credit allowance included with subscription each billing cycle", "Replenished on 1st of month"],
        ],
        examples: [
          ["Admin updates Growth tier features", "Enables 'AI Scribe' and sets 2,500 monthly credits", "All Growth tier tenants gain access to AI Scribe on their next session"],
        ],
        jobs: [
          ["F-1-J1", "Revenue Officer", "When packaging our product tiers, I want flexible feature gating, so that enterprise features drive tier upgrades."],
        ],
        criteria: [
          ["F-1-1", "Features disabled on a plan tier are inaccessible and display an upgrade prompt in tenant workspaces."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "plans",
    channel: "categories",
    dest: "content/admin/plans/categories.md",
    title: "Commercial Plan Categories & Packaging Tiers",
    summary: "The Plan Categories tab groups subscription plans into commercial packaging categories (e.g., Practice Tiers, Enterprise Blueprints, Add-On Bundles) for structured public pricing display.",
    features: [
      {
        id: "F-1",
        name: "Commercial Packaging Categories Registry",
        whatItDoes: "Defines pricing display groups and promotional tags (e.g. 'Most Popular', 'Best for Large Clinics') displayed on public signup and checkout pages.",
        includes: [
          ["F-1.1: Plan Categories Table", "Data Table", "Lists category title, badge label, display sort order, and linked plans", "Editable"],
          ["F-1.2: Promotional Badge Selector", "Dropdown", "Assigns marketing highlight badges ('Popular', 'New', 'Enterprise Exclusive')", "Renders on checkout UI"],
        ],
        examples: [
          ["Admin sets 'Most Popular' badge on Growth Plan Category", "Saves configuration", "Public pricing page highlights Growth plan with prominent ribbon"],
        ],
        jobs: [
          ["F-1-J1", "Marketing Lead", "When launching new tiers, I want packaging categories, so that our checkout pages guide users to the recommended plans."],
        ],
        criteria: [
          ["F-1-1", "Assigned category badges display accurately on tenant upgrade screens and signup flows."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "plans",
    channel: "pricing",
    dest: "content/admin/plans/pricing.md",
    title: "Packed Pricing, Credit Bundles & Country Rates",
    summary: "The Packed Pricing tab defines credit top-up packages (e.g. 1,000, 5,000, 10,000 credits), additional team member seat packs, and country-specific telephony and SMS per-minute rate cards for over 50 countries.",
    features: [
      {
        id: "F-1",
        name: "Credit Top-Up Bundles & Seat Pack Pricing",
        whatItDoes: "Configures self-service credit bundle prices for practice wallet top-ups and sets pricing for additional clinician seat licenses beyond plan quotas.",
        includes: [
          ["F-1.1: Credit Bundles Pricing Table", "Data Table", "Defines Bundle Name, Credits Amount, Retail Price, and Unit Discount Percentage", "e.g. 5,000 credits @ $90"],
          ["F-1.2: Seat Pack License Rate", "Number Input", "Sets price per additional user seat per month (e.g. $29/seat/mo)", "Auto-billed on invoice"],
        ],
        examples: [
          ["Admin updates credit bundle pricing", "Sets 10,000 credits to $160 (20% discount)", "Tenants purchasing 10,000 credits receive discounted rate on Stripe checkout"],
        ],
        jobs: [
          ["F-1-J1", "Finance Administrator", "When pricing consumption credits, I want volume discount tiers, so that high-usage clinics are incentivized to buy larger bundles."],
        ],
        criteria: [
          ["F-1-1", "Purchasing a credit bundle charges the configured price and immediately credits the tenant wallet."],
        ],
      },
      {
        id: "F-2",
        name: "Country-Specific Telephony & SMS Rate Cards",
        whatItDoes: "Maintains international rate cards for carrier telephony: inbound call per-minute rate, outbound call rate, and SMS segment costs for over 50 countries (US, UK, India, Canada, Germany, Australia, etc.).",
        includes: [
          ["F-2.1: Country Rates Data Table", "Data Table", "Columns: Country, ISO Code, Inbound Rate ($/min), Outbound Rate ($/min), SMS Rate ($/segment)", "Searchable by country name"],
          ["F-2.2: Rate Card Bulk Editor", "Modal", "Adjusts base telephony markup percentage across all international routes", "Calculates net margin"],
        ],
        examples: [
          ["Admin checks United Kingdom rate", "Table shows UK: Inbound $0.01/min, Outbound $0.02/min, SMS $0.02/segment", "Calls placed to UK numbers deduct credits based on these exact rates"],
        ],
        jobs: [
          ["F-2-J1", "Telecom Manager", "When routing international patient calls, I want precise country rate cards, so that telephony usage is billed accurately without carrier losses."],
        ],
        criteria: [
          ["F-2-1", "Telephony call billing calculates duration in seconds and deducts credits matching destination country rates."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "plans",
    channel: "actions",
    dest: "content/admin/plans/actions.md",
    title: "Credit Actions Master & Consumption Deduction Rules",
    summary: "The Credit Actions tab manages the rate at which system activities deduct wallet credits: 1 minute of AI voice conversation, 1 SMS carrier segment, 1 minute of AI Scribe consultation transcription, or 1 LLM query execution.",
    features: [
      {
        id: "F-1",
        name: "Credit Consumption Deduction Rules Registry",
        whatItDoes: "Defines the exact credit cost deducted per unit of platform automation: AI Scribe, WhatsApp Conversation, SMS Text, Phone Call Minute, and LLM Token.",
        includes: [
          ["F-1.1: Credit Actions Table", "Data Table", "Columns: Action Key, Action Name, Consumption Unit, Credits Deducted, Description", "e.g. 'scribe_minute = 3 credits'"],
          ["F-1.2: Edit Credit Deduction Modal", "Modal", "Adjusts credit deduction formula per unit with effective start date", "Audited change"],
        ],
        examples: [
          ["Admin updates AI Scribe cost", "Sets 1 minute of audio transcription = 3 credits", "A 10-minute doctor consultation deducts 30 credits from practice wallet"],
        ],
        jobs: [
          ["F-1-J1", "Platform Operations", "When operational costs change, I want to adjust credit deduction rates, so that platform margins remain sustainable."],
        ],
        criteria: [
          ["F-1-1", "System activities deduct credits matching the active rates defined in the Credit Actions master table."],
        ],
      },
    ],
  },

  // ── Admin Single Page Modules ──
  {
    product: "admin",
    module: "organizations",
    dest: "content/admin/organizations.md",
    title: "Multi-Tenant Practice Provisioning & Clinic Management",
    summary: "The Organizations module manages multi-tenant clinic accounts: provisioning new practice workspaces, allocating database storage quotas, assigning industry blueprints, and monitoring tenant subscription statuses.",
    features: [
      {
        id: "F-1",
        name: "Multi-Tenant Clinic Directory & Workspace Provisioner",
        whatItDoes: "Lists all tenant practices across the platform with search, status filters (Active, Trial, Suspended), industry blueprint tags, storage usage, and primary administrator contact details.",
        includes: [
          ["F-1.1: Tenants Data Table", "Data Table", "Columns: Organization Name, Slug, Blueprint, Subscription, Users Count, Created Date, Status", "Searchable"],
          ["F-1.2: Provision Organization Modal", "Modal", "Captures Practice Name, Custom Slug, Owner Email, Industry Blueprint, and Plan Tier", "Provisions workspace instantly"],
          ["F-1.3: Tenant Impersonation & Support Login", "Action Button", "Allows authorized superadmins to log into tenant workspace in read-only support mode", "Logged in audit trail"],
        ],
        examples: [
          ["Superadmin provisions 'Downtown Dental Specialists'", "Selects 'Dental Clinic' blueprint and Growth plan", "Tenant workspace is provisioned with custom URL 'downtown-dental.mantraassist.com'"],
        ],
        jobs: [
          ["F-1-J1", "Superadmin", "When onboarding a new clinic customer, I want to provision their tenant workspace with one click, so that their practice is ready immediately."],
        ],
        criteria: [
          ["F-1-1", "Provisioning an organization creates isolated database records and dispatches an owner activation email."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "document-templates",
    dest: "content/admin/document-templates.md",
    title: "Clinical Document Templates Master Registry",
    summary: "The Document Templates module maintains system-wide master clinical documents: Medical Referral Letters, Post-Op Discharge Summaries, Telehealth Informed Consent Forms, and HIPAA Privacy Disclosures with dynamic placeholder merge tags.",
    features: [
      {
        id: "F-1",
        name: "Master Clinical Document Template Builder",
        whatItDoes: "Provides a rich-text document editor supporting dynamic placeholder tags (e.g. `{{patient.name}}`, `{{provider.npi}}`, `{{diagnosis.primary}}`, `{{date}}`) that auto-populate from patient records.",
        includes: [
          ["F-1.1: Master Templates Table", "Data Table", "Columns: Template Title, Category (Consent, Referral, Discharge), Version, Variables Count, Status", "Searchable"],
          ["F-1.2: Rich-Text Document Editor", "Editor", "Formatting toolbar: Bold, Italic, Tables, Headers, Page Breaks, and Placeholder Tag Inserter", "Includes PDF export preview"],
          ["F-1.3: Dynamic Variable Auto-Populator", "Logic", "Maps template tags directly to database attributes upon document generation", "Validates unpopulated tags"],
        ],
        examples: [
          ["Admin creates 'Cardiology Referral Template'", "Inserts tags `{{patient.name}}`, `{{referring_provider.name}}`, `{{reason_for_referral}}`", "Doctors in any tenant can generate personalized cardiology referral letters in one click"],
        ],
        jobs: [
          ["F-1-J1", "Clinical Content Lead", "When authoring clinical forms, I want standard merge tags, so that letters and summaries automatically pull verified patient and provider data."],
        ],
        criteria: [
          ["F-1-1", "Generating a document replaces all merge tags with corresponding patient and clinic values without manual typing."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "sidebar-config",
    dest: "content/admin/sidebar-config.md",
    title: "Sidebar Navigation Layout Editor & Feature Flags",
    summary: "The Sidebar Configuration module allows superadmins to customize the default navigation layout across all client and admin workspaces: reordering menu categories, toggling module visibility, and enforcing role-based menu restrictions.",
    features: [
      {
        id: "F-1",
        name: "Visual Navigation Tree Editor & Module Visibility Toggles",
        whatItDoes: "Provides a drag-and-drop navigation editor to reorder menu items, group modules into custom sections (e.g. WORKSPACE, REVENUE, SETTINGS), and toggle module feature flags platform-wide.",
        includes: [
          ["F-1.1: Navigation Tree Canvas", "Drag Tree", "Visual tree structure representing sidebar hierarchy with drag handles for reordering", "Saves layout JSON"],
          ["F-1.2: Module Visibility Switches", "Switches", "Enables or hides specific modules globally or per plan tier", "Immediate client-side sync"],
          ["F-1.3: Role Access Menu Filter", "Dropdown", "Selects which user roles are permitted to see specific navigation links", "Enforces RBAC navigation"],
        ],
        examples: [
          ["Admin hides unreleased 'AI Scribe' from Starter plan users", "Toggles visibility off for Starter tier", "Starter tier sidebars automatically remove Scribe link from their left menu"],
        ],
        jobs: [
          ["F-1-J1", "Platform Architect", "When releasing new modules in beta, I want to control menu visibility by tier, so that only entitled users see new navigation links."],
        ],
        criteria: [
          ["F-1-1", "Changes saved in Sidebar Configuration update navigation menus for affected users on their next session."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "roles",
    dest: "content/admin/roles.md",
    title: "Roles & Permissions Master RBAC Matrix",
    summary: "The Roles & Permissions module establishes the system-wide Role-Based Access Control (RBAC) matrix. Superadmins define base permissions across all modules (Read, Add, Edit, Delete, Export, Import) for Doctors, Nurses, Coordinators, and Billing Specialists.",
    features: [
      {
        id: "F-1",
        name: "Granular RBAC Permission Matrix & Custom Role Studio",
        whatItDoes: "Displays a full grid of permissions across 18 platform modules and 6 standard roles, allowing granular toggle of Read, Add, Edit, Delete, Export, and Import capabilities.",
        includes: [
          ["F-1.1: RBAC Permission Matrix Grid", "Matrix Table", "Columns: Module Name; Rows: Permissions (Read, Add, Edit, Delete, Export, Import)", "One-click toggle buttons"],
          ["F-1.2: Custom Role Creator", "Modal", "Clones an existing role and customizes specific overrides (e.g. 'Lead Dental Hygienist')", "Assigns to tenant users"],
          ["F-1.3: PHI Export Permission Gate", "Strict Security Gate", "Special security flag requiring multi-factor re-authentication to grant 'Export' rights", "Prevents unauthorized bulk downloads"],
        ],
        examples: [
          ["Admin disables 'Delete' permission on Patient records for Receptionist role", "Toggles off 'Delete' in Clients row for Receptionist", "Receptionists no longer see delete button on patient charts"],
        ],
        jobs: [
          ["F-1-J1", "Security Officer", "When defining clinic roles, I want fine-grained permission controls, so that staff members only have access to actions required for their job."],
        ],
        criteria: [
          ["F-1-1", "Users lacking a specific permission (e.g. Export) have the corresponding UI buttons hidden and API endpoints blocked."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "ai-voices-models",
    dest: "content/admin/ai-voices-models.md",
    title: "Global AI Voice & Model Registry",
    summary: "The AI Voice & Models module manages platform-wide generative AI infrastructure: registering LLM endpoints (OpenAI, Anthropic, Gemini, DeepSeek), tracking API token consumption, and configuring global ElevenLabs synthetic voice libraries.",
    features: [
      {
        id: "F-1",
        name: "Global LLM Model Registry & Endpoint Bindings",
        whatItDoes: "Maintains master API key configurations, base URLs, rate limits, and fallback routing for foundation model providers (OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro).",
        includes: [
          ["F-1.1: Model Endpoints Table", "Data Table", "Columns: Provider, Model ID, Status, Average Latency, Fallback Order, Error Rate", "Real-time health status"],
          ["F-1.2: Automated Failover Router", "Logic", "Automatically routes AI requests to secondary model if primary provider encounters HTTP 500 or timeout", "Zero downtime for clinic bots"],
          ["F-1.3: Global Token Usage Meter", "Analytics Card", "Tracks total input/output tokens consumed across all tenants today", "Cost forecasting tracker"],
        ],
        examples: [
          ["OpenAI experiences brief API latency spike", "Failover router detects 3s timeout and switches requests to Claude 3.5 Sonnet", "Patient AI triage responses continue without interruption"],
        ],
        jobs: [
          ["F-1-J1", "Infrastructure Lead", "When managing AI infrastructure, I want automated multi-provider failover, so that clinic AI responders never go offline during third-party outages."],
        ],
        criteria: [
          ["F-1-1", "AI requests failing on primary endpoint automatically retry against the secondary fallback model within 2 seconds."],
        ],
      },
    ],
  },
  {
    product: "admin",
    module: "users",
    dest: "content/admin/users.md",
    title: "Platform Superadmin Directory & Enterprise SSO",
    summary: "The Platform Users module manages superadmin accounts, enterprise Single Sign-On (SSO) identity provider bindings (SAML 2.0 / Okta / Azure AD), and active administrative session revocation.",
    features: [
      {
        id: "F-1",
        name: "Superadmin Directory & Enterprise SAML / OIDC SSO",
        whatItDoes: "Lists all administrative user accounts, their access tier, assigned tenants, MFA enrollment status, and configures enterprise SAML 2.0 / OIDC Single Sign-On identity providers.",
        includes: [
          ["F-1.1: Superadmin User Table", "Data Table", "Columns: Name, Email, Admin Level, MFA Enrolled, Last Login, Active Sessions", "Searchable"],
          ["F-1.2: Enterprise SSO Configuration Card", "Config Card", "Input fields for SAML Metadata URL, Entity ID, and X.509 Certificate", "Supports Okta, Azure AD, Google SSO"],
          ["F-1.3: Revoke All Sessions Button", "Emergency Action", "Immediately terminates all active JWT tokens and sessions for a compromised account", "Forces password reset"],
        ],
        examples: [
          ["Security officer investigates compromised laptop", "Locates admin account and clicks 'Revoke All Sessions'", "User is logged out of all active browsers immediately and MFA is reset"],
        ],
        jobs: [
          ["F-1-J1", "Security Officer", "When protecting platform access, I want enterprise SSO and instant session revocation, so that superadmin credentials cannot be compromised."],
        ],
        criteria: [
          ["F-1-1", "Clicking 'Revoke All Sessions' invalidates all active session tokens for the selected user immediately."],
        ],
      },
    ],
  },
];

adminPrds.forEach((spec) => {
  const content = formatPrd(spec);
  const fullPath = path.join(rootDir, spec.dest);
  savePrd(fullPath, content);
});

console.log(`Generated ${adminPrds.length} Admin PRDs successfully.`);

