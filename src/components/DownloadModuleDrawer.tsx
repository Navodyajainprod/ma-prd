"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Check, AlertCircle, Loader2 } from "lucide-react";
import { ALL_MODULES, ModuleDefinition } from "@/lib/modulesConfig";
import { buildMultiModuleMarkdown, downloadFile } from "@/lib/downloadUtils";

interface DownloadModuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadModuleDrawer({
  isOpen,
  onClose,
}: DownloadModuleDrawerProps) {
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(["chat"]);
  const [isLoading, setIsLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleModule = (id: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedModuleIds(ALL_MODULES.map((m) => m.id));
  };

  const deselectAll = () => {
    setSelectedModuleIds([]);
  };

  const handleDownload = async () => {
    if (selectedModuleIds.length === 0) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/modules-content?modules=${selectedModuleIds.join(",")}`);
      const data = await res.json();

      const { filename, content } = buildMultiModuleMarkdown(data.modules);
      
      if (!content.trim()) {
        alert("Selected modules do not have documented PRDs yet.");
        return;
      }

      downloadFile(filename, content);
      onClose();
    } catch (err) {
      console.error("Failed to generate multi-module markdown", err);
      alert("Error generating download. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel (Blackish Dark Theme) */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#0c0c0e] h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-zinc-800 animate-in slide-in-from-right duration-250 ease-out select-none">
        {/* Drawer Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Download PRD by Module (.md)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Description & Bulk Actions */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-[#09090b]/60">
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-3">
            Select one or more modules below. This bundles the full content across all four products (Client, Admin, Companion, AI Receptionist) into a single unified Markdown document.
          </p>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
              {selectedModuleIds.length} of {ALL_MODULES.length} selected
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs cursor-pointer"
              >
                Select all
              </button>
              <span className="text-slate-300 dark:text-zinc-700">•</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 text-xs cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Module Multi-Select Checklist */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {ALL_MODULES.map((mod) => {
            const isChecked = selectedModuleIds.includes(mod.id);

            return (
              <div
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isChecked
                    ? "bg-blue-50/40 dark:bg-zinc-800/60 border-blue-200 dark:border-zinc-700"
                    : "bg-white dark:bg-[#121215] border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate">
                      {mod.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 shrink-0">
                      Documented
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                    {mod.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer with Commit Button */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#09090b]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={selectedModuleIds.length === 0 || isLoading}
            onClick={handleDownload}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating .md...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>
                  Download {selectedModuleIds.length} Module{selectedModuleIds.length === 1 ? "" : "s"} (.md)
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
