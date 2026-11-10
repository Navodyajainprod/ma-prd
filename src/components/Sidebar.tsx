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
  UserCheck,
  Navigation,
  Activity,
  Bot,
} from "lucide-react";
import { getModulesForProduct, ProductId } from "@/lib/modulesConfig";

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
  forms: FileText,
  billing: Receipt,
  checkin: UserCheck,
  directions: Navigation,
  "my-visit": Activity,
  avatar: Bot,
};

interface SidebarProps {
  product: ProductId;
  onCloseMobile?: () => void;
}

export default function Sidebar({ product, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentModule = segments[1] || "";
  const currentChannel = segments[2] || "";
  const isLogsPage = currentModule === "logs";

  // Accordion state for modules with submodules
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [currentModule]: true,
  });

  useEffect(() => {
    if (currentModule) {
      setExpandedModules((prev) => ({ ...prev, [currentModule]: true }));
    }
  }, [currentModule]);

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
            {product.replace("-", " ").toUpperCase()} SPECIFICATION
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
            <h3 className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              {categoryTitle}
            </h3>

            <div className="space-y-0.5 pt-1">
              {categoryModules.map((mod) => {
                const Icon = ICON_MAP[mod.id] || FileText;
                const hasSubmodules = Boolean(mod.submodules && mod.submodules.length > 0);
                const isExpanded = expandedModules[mod.id] ?? false;
                const isParentActive = !isLogsPage && currentModule === mod.id;

                if (hasSubmodules && mod.submodules) {
                  return (
                    <div key={mod.id} className="space-y-0.5">
                      {/* Parent Item with Dropdown Toggle */}
                      <div
                        className={`group flex items-center justify-between px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                          isParentActive
                            ? "text-slate-900 dark:text-white font-semibold"
                            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
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
                                ? "text-[#1456f0] dark:text-blue-400"
                                : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300"
                            }`}
                          />
                          <span className="truncate">{mod.name}</span>
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => toggleModuleExpand(mod.id, e)}
                          className="p-1 -mr-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded"
                          aria-label="Toggle child pages"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Dropdown Child Pages with Thin Accent Line */}
                      {isExpanded && (
                        <div className="pl-4 space-y-0.5 pt-0.5 border-l border-slate-200 dark:border-zinc-800/80 ml-3.5">
                          {mod.submodules.map((sub, sIdx) => {
                            const isSubActive =
                              isParentActive && (currentChannel === sub.id || (!segments[2] && sIdx === 0));

                            return (
                              <Link
                                key={sub.id}
                                href={`/${product}/${mod.id}/${sub.id}`}
                                onClick={onCloseMobile}
                                className={`flex items-center justify-between py-1 text-xs transition-colors border-l-2 pl-2.5 ${
                                  isSubActive
                                    ? "border-[#1456f0] text-[#1456f0] dark:text-blue-400 font-semibold"
                                    : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                                }`}
                              >
                                <span className="truncate">{sub.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Single-page module (no submodules)
                return (
                  <Link
                    key={mod.id}
                    href={`/${product}/${mod.id}`}
                    onClick={onCloseMobile}
                    className={`group flex items-center justify-between py-1.5 text-xs font-medium transition-colors border-l-2 pl-2 ${
                      isParentActive
                        ? "border-[#1456f0] text-[#1456f0] dark:text-blue-400 font-semibold"
                        : "border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isParentActive
                            ? "text-[#1456f0] dark:text-blue-400"
                            : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300"
                        }`}
                      />
                      <span className="truncate">{mod.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Dedicated Date & Edit Logs Navigation Page */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 space-y-1">
          <h3 className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            AUDIT & LOGS
          </h3>
          <Link
            href={`/${product}/logs`}
            onClick={onCloseMobile}
            className={`group flex items-center justify-between py-1.5 text-xs font-medium transition-colors border-l-2 pl-2 ${
              isLogsPage
                ? "border-[#1456f0] text-[#1456f0] dark:text-blue-400 font-semibold"
                : "border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <History
                className={`w-4 h-4 shrink-0 ${
                  isLogsPage
                    ? "text-[#1456f0] dark:text-blue-400"
                    : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300"
                }`}
              />
              <span className="truncate">Date & Edit Logs</span>
            </div>
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
