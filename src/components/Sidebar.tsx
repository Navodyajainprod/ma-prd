"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  LayoutDashboard,
  Users,
  Phone,
  RefreshCw,
  CheckSquare,
  Calendar,
  Stethoscope,
  Package,
  Receipt,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  Zap,
  Database,
  FileText,
  Settings,
  Building2,
  FolderTree,
  FileCode,
  LayoutTemplate,
  Shield,
  Sparkles,
  CreditCard,
  UserCog,
  FileClock,
  Clock,
  History,
  ChevronDown,
  ChevronRight,
  Globe,
  Radio,
} from "lucide-react";
import { getModulesForProduct } from "@/lib/modulesConfig";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  chat: MessageSquare,
  overview: LayoutDashboard,
  clients: Users,
  "call-logs": Phone,
  processes: RefreshCw,
  tasks: CheckSquare,
  appointments: Calendar,
  scribe: Stethoscope,
  services: Package,
  invoices: Receipt,
  claims: ShieldCheck,
  reports: BarChart3,
  workflows: SlidersHorizontal,
  automation: Zap,
  "knowledge-base": Database,
  "web-forms": FileText,
  settings: Settings,
  organizations: Building2,
  "industry-category": FolderTree,
  "document-templates": FileCode,
  "custom-fields": SlidersHorizontal,
  "sidebar-config": LayoutTemplate,
  roles: Shield,
  "ai-voices-models": Sparkles,
  plans: CreditCard,
  users: UserCog,
  today: Clock,
  documents: FileClock,
  pharmacy: Package,
};

interface SidebarProps {
  product: "client" | "admin" | "companion";
  onCloseMobile?: () => void;
}

export default function Sidebar({ product, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentModule = segments[1] || "chat";
  const currentChannel = segments[2] || (product === "client" && currentModule === "chat" ? "whatsapp" : "");
  const isLogsPage = currentModule === "logs";

  // Accordion state for modules with submodules (strictly Client Chat channels)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    chat: product === "client",
  });

  useEffect(() => {
    if (product === "client" && currentModule === "chat") {
      setExpandedModules((prev) => ({ ...prev, chat: true }));
    }
  }, [product, currentModule]);

  const toggleModuleExpand = (modId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const modules = useMemo(() => getModulesForProduct(product), [product]);

  // Group modules by category
  const categories = useMemo(() => {
    const map = new Map<string, typeof modules>();
    modules.forEach((mod) => {
      const cat = mod.category || "GENERAL";
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(mod);
    });
    return Array.from(map.entries());
  }, [modules]);

  return (
    <aside className="w-64 min-w-[256px] max-w-[256px] h-full flex flex-col bg-slate-50/70 dark:bg-[#0c0c0e] border-r border-slate-200/80 dark:border-zinc-800 select-none overflow-y-auto transition-colors">
      {/* Product Banner */}
      <div className="p-4 border-b border-slate-200/60 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            {product.toUpperCase()} SPECIFICATION
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
            v1.0
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-3 space-y-6">
        {categories.map(([categoryTitle, categoryModules]) => (
          <div key={categoryTitle} className="space-y-1">
            <h3 className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              {categoryTitle}
            </h3>

            <div className="space-y-0.5 pt-1">
              {categoryModules.map((mod) => {
                const Icon = ICON_MAP[mod.id] || FileText;
                const hasSubmodules = Boolean(product === "client" && mod.submodules && mod.submodules.length > 0);
                const isExpanded = expandedModules[mod.id] ?? false;
                const isParentActive = !isLogsPage && currentModule === mod.id;
                const isReady =
                  mod.id === "chat" && (product === "client" || product === "companion");

                if (hasSubmodules && mod.submodules) {
                  return (
                    <div key={mod.id} className="space-y-0.5">
                      {/* Parent Item with Dropdown Toggle */}
                      <div
                        className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isParentActive
                            ? "bg-slate-200/80 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold"
                            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                        }`}
                        onClick={(e) => toggleModuleExpand(mod.id, e)}
                      >
                        <Link
                          href={`/${product}/${mod.id}/${mod.submodules[0].id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onCloseMobile) onCloseMobile();
                          }}
                          className="flex items-center gap-2.5 min-w-0 flex-1"
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isParentActive
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300"
                            }`}
                          />
                          <span className="truncate">{mod.name}</span>
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => toggleModuleExpand(mod.id, e)}
                          className="p-1 -mr-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded"
                          aria-label="Toggle channels dropdown"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Dropdown Sub-Channels: WhatsApp, SMS, Website, Companion */}
                      {isExpanded && (
                        <div className="pl-6 space-y-0.5 pt-0.5 border-l border-slate-200 dark:border-zinc-800/80 ml-4">
                          {mod.submodules.map((sub) => {
                            const isSubActive =
                              isParentActive && (currentChannel === sub.id || (!segments[2] && sub.id === "whatsapp"));

                            return (
                              <Link
                                key={sub.id}
                                href={`/${product}/${mod.id}/${sub.id}`}
                                onClick={onCloseMobile}
                                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                  isSubActive
                                    ? "bg-slate-900 text-white dark:bg-zinc-700 dark:text-white font-semibold shadow-2xs"
                                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                                }`}
                              >
                                <span className="truncate">{sub.name}</span>
                                {isSubActive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={mod.id}
                    href={`/${product}/${mod.id}`}
                    onClick={onCloseMobile}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isParentActive
                        ? "bg-slate-900 text-white dark:bg-zinc-800 dark:text-white font-semibold shadow-2xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isParentActive
                            ? "text-white dark:text-white"
                            : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300"
                        }`}
                      />
                      <span className="truncate">{mod.name}</span>
                    </div>

                    {!isReady && (
                      <span className="shrink-0 text-[10px] text-slate-400 dark:text-zinc-500 font-normal">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Dedicated Date & Edit Logs Navigation Page in Left Sidebar */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 space-y-1">
          <h3 className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            AUDIT & LOGS
          </h3>
          <Link
            href={`/${product}/logs`}
            onClick={onCloseMobile}
            className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              isLogsPage
                ? "bg-slate-900 text-white dark:bg-zinc-800 dark:text-white font-semibold shadow-2xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <History
                className={`w-4 h-4 shrink-0 ${
                  isLogsPage
                    ? "text-white dark:text-white"
                    : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300"
                }`}
              />
              <span className="truncate">Date & Edit Logs</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 shrink-0">
              Page
            </span>
          </Link>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/60 dark:border-zinc-800 text-[11px] text-slate-400 dark:text-zinc-500 flex items-center justify-between">
        <span>MantraAssist</span>
        <span className="font-mono text-[10px]">Verified</span>
      </div>
    </aside>
  );
}
