import { notFound } from "next/navigation";
import { Metadata } from "next";
import PrdLayoutClient from "@/components/PrdLayoutClient";
import { Clock, History, Calendar, FileEdit, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductId, getProductLink } from "@/lib/modulesConfig";

interface PageProps {
  params: {
    product: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = params.product.replace("-", " ").toUpperCase();
  return {
    title: `Date & Edit Logs | ${product} - MantraAssist PRD`,
    description: `Audited changelog and version history for MantraAssist ${product} modules.`,
  };
}

const LOG_ENTRIES: Record<
  ProductId,
  {
    dates: { date: string; event: string; module: string; author: string; status: string; note: string }[];
    edits: { date: string; module: string; section: string; change: string }[];
  }
> = {
  client: {
    dates: [
      {
        date: "2026-11-10",
        event: "PRD Created & Drafted",
        module: "Chats & Care Groups",
        author: "MantraAssist Product Core",
        status: "In Review",
        note: "Initial specification authored from ma-figma source of truth (Chats.tsx, CreateGroupChatDrawer.tsx, useConversations.ts).",
      },
      {
        date: "2026-11-10",
        event: "Multi-Module PRD Expansion",
        module: "All Client Modules",
        author: "MantraAssist Product Core",
        status: "In Review",
        note: "Authored full PRDs across Appointments, Settings, Process, Overview, Contacts, Telephony, Scribe, Invoices, Claims, and Workflows.",
      },
      {
        date: "2026-11-10",
        event: "Status Transition to In Review",
        module: "Chats & Care Groups",
        author: "Clinical Architecture Team",
        status: "In Review",
        note: "Completed FR-1 through FR-8 requirements, worked examples, and acceptance criteria.",
      },
    ],
    edits: [
      {
        date: "2026-11-10",
        module: "Chats & Care Groups",
        section: "Section 2 & 8 (Website Composer Scoping)",
        change: "Removed the 'Message Actions & Settings' button from the chat composer specifically on the Website channel.",
      },
      {
        date: "2026-11-10",
        module: "Chats & Care Groups",
        section: "Section 2 & 6 (Top Bar Group Action Scoping)",
        change: "Restricted 'New Group' button visibility strictly to the Companion channel in the top bar; removed from WhatsApp, SMS, Website, and Email.",
      },
      {
        date: "2026-11-10",
        module: "Appointments & Visits",
        section: "Calendar, List & Availability",
        change: "Authored individual tab PRD pages for provider schedules, appointments table, and weekly working hours buffers.",
      },
      {
        date: "2026-11-10",
        module: "Settings & Team",
        section: "9 Sub-Tabs Specification",
        change: "Documented Organization Profile, Team Roles, Billing, AI Voices, Custom Fields, Integrations, Audit Logs, Security, and Reception Kiosk settings.",
      },
    ],
  },
  admin: {
    dates: [
      {
        date: "2026-11-10",
        event: "Admin Platform PRD Suite Created",
        module: "Platform Control & Blueprints",
        author: "Platform Engineering",
        status: "In Review",
        note: "Authored specifications for Multi-Tenant Organizations, Custom Fields Master, Industry Categories, Plans & Credits, and AI Voices.",
      },
      {
        date: "2026-11-10",
        event: "RBAC & Sidebar Navigation Rules Defined",
        module: "Security & Control",
        author: "Platform Engineering",
        status: "In Review",
        note: "Specified granular menu editor, feature flags, and role studio permissions matrix.",
      },
    ],
    edits: [
      {
        date: "2026-11-10",
        module: "Custom Fields Master",
        section: "Fields & Sections Tabs",
        change: "Documented global data dictionary, validation formulas, and grouped accordion section layouts.",
      },
      {
        date: "2026-11-10",
        module: "Billing Plans & Addons",
        section: "Plans, Pricing & Credit Actions",
        change: "Documented industry tiers, packed pricing seat bundles, and per-minute credit deduction rate cards.",
      },
    ],
  },
  companion: {
    dates: [
      {
        date: "2026-11-10",
        event: "PRD Created & Drafted",
        module: "Chat & Care Bot",
        author: "MantraAssist Product Core",
        status: "In Review",
        note: "Initial patient portal messaging specification covering Care Chat Bot shortcuts and multi-party Care Groups.",
      },
      {
        date: "2026-11-10",
        event: "Full Patient Suite Specification Added",
        module: "All Companion Modules",
        author: "Patient Experience Team",
        status: "In Review",
        note: "Authored PRDs for Today's Agenda, Visit Booking, Health Records, Prescriptions, Intake Forms, and Copay Checkout.",
      },
    ],
    edits: [
      {
        date: "2026-11-10",
        module: "Today's Visit Agenda",
        section: "Queue Tracker & Doctor ETA",
        change: "Documented real-time queue position display, check-in card, and doctor room routing instructions.",
      },
      {
        date: "2026-11-10",
        module: "Billing & Invoices",
        section: "Copay Ledger & UPI/Card Payment",
        change: "Documented itemized copay breakdown, digital payment gateway checkout, and invoice receipt history.",
      },
    ],
  },
  "ai-receptionist": {
    dates: [
      {
        date: "2026-11-12",
        event: "User-Flow PRD Rewrite & Cross-Product Summary Parity (17 Pages)",
        module: "All AI Receptionist Modules",
        author: "Hardware & AI Experience Core",
        status: "In Review",
        note: "Rewrote all 17 AI Receptionist PRDs and Reception Kiosk Settings in clean product/user-flow language with complete Cross-product Summary tables, worked examples, JTBDs, acceptance criteria, and verified clinic rules ($ USD billing, 5 station types, 5–45m & 20–90m queue sliders).",
      },
      {
        date: "2026-11-10",
        event: "AI Receptionist PRD Suite Created",
        module: "Kiosk & Touch Console",
        author: "Hardware & AI Experience Core",
        status: "In Review",
        note: "Initial baseline PRDs created for AI Receptionist modules.",
      },
    ],
    edits: [
      {
        date: "2026-11-12",
        module: "Cross-Product & User-Flow Rewrite",
        section: "All 17 Pages + Reception Settings",
        change: "Replaced technical notes with clear patient, visitor, clinician, and admin user-flow documentation across all 17 AI Receptionist PRDs and Client Reception Settings, with full Cross-product Summary navigation links and exact clinic labels.",
      },
      {
        date: "2026-11-12",
        module: "Check-In & Booking",
        section: "4 Dedicated Tab Pages",
        change: "Documented Identity Gate & Biometrics, Phone/OTP & Family Picker, Scheduled Check-In (3-card verification + instant queue token), and Walk-In Registration & Booking (voice fields, under-18 skip, 3-angle face enrollment, duplicate check, Service -> Doctor).",
      },
      {
        date: "2026-11-12",
        module: "Aria Ambient, Voice & Kiosk Shell",
        section: "3 Dedicated Tab Pages",
        change: "Documented Ambient Presence & Wake Flow, Aria Stage/Bilingual Voice/Intent Engine (6 status halos, English & Hindi fallback), and Split Kiosk Shell (Floating Dock, EN/HI toggle, 60s privacy reset, Call Staff alert, and Feedback prompt).",
      },
      {
        date: "2026-11-12",
        module: "My Visit & Process Guidance",
        section: "3 Dedicated Tab Pages",
        change: "Documented Active Visit & Queue Tracker (Now Serving & People Ahead updates), Process Stage Next Steps (personalized workflow cards), and Biometric Consent & Governance (privacy boundaries, first-name confirmation, and deletion options).",
      },
      {
        date: "2026-11-12",
        module: "Wayfinding, Billing & Kiosk Settings",
        section: "7 Dedicated Tab Pages",
        change: "Documented 3-Zone Department Directory, Spoken Room Deep-Linking, Phone/OTP Billing Lookup, Touchless $ USD QR Checkout, Clinic Rooms & Stage Guidance Builder, Queue Prefixes/Fairness Sliders, and Live Sync & 24h Duplicate Safety.",
      },
      {
        date: "2026-11-10",
        module: "Check-In, Billing & Wayfinding",
        section: "Initial Baseline",
        change: "Published initial baseline PRDs for scheduled/walk-in check-in, invoices/QR pay, and directions.",
      },
    ],
  },
};

export default function LogsPage({ params }: PageProps) {
  const validProducts = ["client", "admin", "companion", "ai-receptionist"] as const;
  const product = params.product.toLowerCase() as (typeof validProducts)[number];

  if (!validProducts.includes(product)) {
    notFound();
  }

  const data = LOG_ENTRIES[product] || { dates: [], edits: [] };
  const returnHref = getProductLink(product);

  return (
    <PrdLayoutClient product={product} prd={null}>
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-8 space-y-10">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
            <span className="capitalize">{product.replace("-", " ")}</span>
            <span className="text-slate-300 dark:text-zinc-700">/</span>
            <span className="text-slate-800 dark:text-zinc-200 font-semibold">Audit & Logs</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                Date & Edit Logs
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                Complete audit trail of document creation, milestone transitions, and section-by-section revisions for MantraAssist {product.replace("-", " ").toUpperCase()}.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Date Log */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Date Log (Milestones & Status History)
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                  <th className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
                    Date
                  </th>
                  <th className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
                    Milestone / Event
                  </th>
                  <th className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
                    Module
                  </th>
                  <th className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
                    Status
                  </th>
                  <th className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
                    Audited Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 bg-white dark:bg-[#0c0c0e]">
                {data.dates.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white">
                      {item.event}
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 dark:text-zinc-300">
                      {item.module}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {item.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Edit Log */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Edit Log (Section Revisions)
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                  <th className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
                    Date
                  </th>
                  <th className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
                    Module
                  </th>
                  <th className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
                    Section Edited
                  </th>
                  <th className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">
                    What Changed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 bg-white dark:bg-[#0c0c0e]">
                {data.edits.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white">
                      {item.module}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                      {item.section}
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {item.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Back to Module PRD CTA */}
        <div className="pt-4">
          <Link
            href={returnHref}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <span>Return to Module PRD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </PrdLayoutClient>
  );
}
