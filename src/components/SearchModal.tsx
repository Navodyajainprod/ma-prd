"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, ArrowRight, CornerDownLeft } from "lucide-react";
import { ALL_MODULES } from "@/lib/modulesConfig";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCHABLE_ITEMS = [
  // Modules
  ...ALL_MODULES.map((m) => ({
    type: "module" as const,
    title: m.name,
    subtitle: `${m.category} • ${m.description}`,
    href: `/client/${m.id}`,
    keywords: `${m.name} ${m.category} ${m.description}`,
  })),
  // Logs page
  {
    type: "page" as const,
    title: "Client: Date & Edit Logs",
    subtitle: "Audit & Version History • Complete changelog of document milestones and section edits",
    href: "/client/logs",
    keywords: "client date edit logs changelog audit history",
  },
  {
    type: "page" as const,
    title: "Companion: Date & Edit Logs",
    subtitle: "Audit & Version History • Patient portal communication changelog",
    href: "/companion/logs",
    keywords: "companion date edit logs changelog audit history",
  },
  // Chat Sections - Client
  {
    type: "section" as const,
    title: "Client: Chat Requirements (FR-1 to FR-8)",
    subtitle: "Section 6 • Omnichannel thread aggregation, group creation, replies",
    href: "/client/chat#section-6-requirements",
    keywords: "client chat requirements fr-1 omnichannel group replies attachments",
  },
  {
    type: "section" as const,
    title: "Client: The Unified Conversation Threading Invariant",
    subtitle: "Section 5 • Core rule, validity conditions, input table",
    href: "/client/chat#section-5-the-unified-conversation-threading-invariant",
    keywords: "client chat core rule invariant threading validity conditions",
  },
  {
    type: "section" as const,
    title: "Client: Worked Examples (12 clinical scenarios)",
    subtitle: "Section 7 • Care team scenarios, file attachments, WhatsApp window",
    href: "/client/chat#section-7-worked-examples",
    keywords: "client chat worked examples situations results",
  },
  {
    type: "section" as const,
    title: "Companion: Care Chat Bot Shortcuts & Triage",
    subtitle: "Section 6 & 7 • Quick action buttons for appointment booking, billing, check-in",
    href: "/companion/chat#section-6-requirements",
    keywords: "companion care chat bot shortcuts appointment billing intake checkin",
  },
  {
    type: "section" as const,
    title: "Companion: The Tri-Entity Care Boundary Invariant",
    subtitle: "Section 5 • Strict partition of Bot, Doctor, and Care Groups",
    href: "/companion/chat#section-5-the-tri-entity-care-boundary-invariant",
    keywords: "companion core rule tri-entity care boundary bot doctor care groups",
  },
  {
    type: "section" as const,
    title: "Companion: Cross-Product Summary",
    subtitle: "Staff-initiated Care Groups appearing in patient portal",
    href: "/companion/chat#cross-product-summary",
    keywords: "cross product summary companion client groups sync",
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = query.trim() === ""
    ? SEARCHABLE_ITEMS.slice(0, 8)
    : SEARCHABLE_ITEMS.filter((item) =>
        item.keywords.toLowerCase().includes(query.toLowerCase()) ||
        item.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);

  const handleSelect = (item: (typeof SEARCHABLE_ITEMS)[0]) => {
    router.push(item.href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog (Blackish Dark Theme) */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#0c0c0e] rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden z-10 animate-in zoom-in-95 duration-150 select-none"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-zinc-800">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search PRD modules, requirements, invariants..."
            className="w-full py-3.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-zinc-400">
              No matching PRD sections or modules found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.href}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 dark:bg-zinc-800/80 text-blue-900 dark:text-white"
                      : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-850"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400 dark:text-zinc-500"
                      }`}
                    />
                    <div className="truncate">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <CornerDownLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard hints footer */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-[#09090b] flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="font-mono bg-white dark:bg-zinc-800 border dark:border-zinc-700 px-1 rounded">↑</kbd><kbd className="font-mono bg-white dark:bg-zinc-800 border dark:border-zinc-700 px-1 rounded">↓</kbd></span>
            <span>Select <kbd className="font-mono bg-white dark:bg-zinc-800 border dark:border-zinc-700 px-1 rounded">↵</kbd></span>
          </div>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
