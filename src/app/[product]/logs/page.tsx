import { notFound } from "next/navigation";
import { Metadata } from "next";
import PrdLayoutClient from "@/components/PrdLayoutClient";
import { Clock, History, Calendar, FileEdit, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    product: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = params.product.toUpperCase();
  return {
    title: `Date & Edit Logs | ${product} - MantraAssist PRD`,
    description: `Audited changelog and version history for MantraAssist ${product} modules.`,
  };
}

const LOG_ENTRIES = {
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
        event: "Cross-Product Sync Specification Added",
        module: "Chats & Care Groups",
        author: "MantraAssist Product Core",
        status: "In Review",
        note: "Added cross-product propagation to Companion portal for staff-created Care Groups.",
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
        module: "Chats & Care Groups",
        section: "Cover & Overview",
        change: "Established the Unified Conversation Threading Invariant and multi-channel scope.",
      },
      {
        date: "2026-11-10",
        module: "Chats & Care Groups",
        section: "Section 2 (How It Works Today)",
        change: "Documented existing channel tabs, responsible member assignment, and WhatsApp 24h Meta window.",
      },
      {
        date: "2026-11-10",
        module: "Chats & Care Groups",
        section: "Section 5 & 6 (Core Rule & FRs)",
        change: "Defined FR-1 through FR-8 including slide-over group drawer, message replies, and 25MB attachment limit.",
      },
      {
        date: "2026-11-10",
        module: "Chats & Care Groups",
        section: "Section 7 (Worked Examples)",
        change: "Authored 12 clinical situations covering care team groups, MRI attachments, and member removals.",
      },
      {
        date: "2026-11-10",
        module: "Chats & Care Groups",
        section: "Section 10 & 11 (Decisions & AC)",
        change: "Enforced drawers instead of modals, no colorful badges, and 10 precise acceptance criteria.",
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
        note: "Specification extracted from PatientMessagesScreen.tsx, PatientCareBotScreen.tsx, and PatientGroupInfoDrawer.tsx.",
      },
      {
        date: "2026-11-10",
        event: "Care Bot Renaming & Shortcuts",
        module: "Chat & Care Bot",
        author: "MantraAssist Product Core",
        status: "In Review",
        note: "Renamed to Care Chat Bot with explicit AI badge and 5 fixed health action cards.",
      },
      {
        date: "2026-11-10",
        event: "Status Transition to In Review",
        module: "Chat & Care Bot",
        author: "Patient Experience Team",
        status: "In Review",
        note: "Tri-Entity Care Boundary Invariant verified across doctor, bot, and group channels.",
      },
    ],
    edits: [
      {
        date: "2026-11-10",
        module: "Chat & Care Bot",
        section: "Cross-Product Summary",
        change: "Specified patient reception of Care Groups created by clinical staff in Client workspace.",
      },
      {
        date: "2026-11-10",
        module: "Chat & Care Bot",
        section: "Section 1 & 5 (Overview & Core Rule)",
        change: "Enforced Tri-Entity Care Boundary Invariant strictly isolating Bot, Doctor, and Groups.",
      },
      {
        date: "2026-11-10",
        module: "Chat & Care Bot",
        section: "Section 6 (Requirements)",
        change: "Authored FR-1 through FR-8 covering Care Chat Bot shortcuts, replies, media, and leave drawer.",
      },
      {
        date: "2026-11-10",
        module: "Chat & Care Bot",
        section: "Section 7 & 8 (Worked Examples & UI)",
        change: "Documented 12 worked examples and patient drawer UI spec (Members, Files, Tasks tabs).",
      },
    ],
  },
  admin: {
    dates: [
      {
        date: "2026-11-10",
        event: "Platform Module Architecture Cataloged",
        module: "All Admin Modules",
        author: "MantraAssist Product Core",
        status: "Planning",
        note: "Inventoried 17 admin modules from AdminSidebar.tsx and AdminProcessTemplates.tsx.",
      },
    ],
    edits: [
      {
        date: "2026-11-10",
        module: "Platform Blueprints",
        section: "Workflows & Automations",
        change: "Cataloged master process templates, AI chatbot triggers, and credit plans.",
      },
    ],
  },
};

export default function LogsPage({ params }: PageProps) {
  const validProducts = ["client", "admin", "companion"] as const;
  const product = params.product.toLowerCase() as (typeof validProducts)[number];

  if (!validProducts.includes(product)) {
    notFound();
  }

  const data = LOG_ENTRIES[product] || LOG_ENTRIES.client;

  return (
    <PrdLayoutClient product={product} prd={null}>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-8 space-y-10">
        {/* Header Block */}
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 px-2 py-0.5 rounded-md">
              {product.toUpperCase()} AUDIT
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 px-2 py-0.5 rounded-md">
              Changelog & Versioning
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Date & Edit Logs
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            Immutable audit record of all document milestones, clinical reviews, status changes, and section-by-section revisions for MantraAssist {product}.
          </p>
        </div>

        {/* Section 1: Date Log */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Date Log (Milestones & Status)
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
                    Event / Milestone
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

        {/* Back to Chat PRD CTA */}
        <div className="pt-4">
          <Link
            href={`/${product}/chat`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <span>Return to Chat PRD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </PrdLayoutClient>
  );
}

