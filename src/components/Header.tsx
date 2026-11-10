"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, Menu } from "lucide-react";
import { PRODUCTS } from "@/lib/modulesConfig";
import Tooltip from "./Tooltip";

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleMobileSidebar?: () => void;
}

export default function Header({
  onOpenSearch,
  onToggleMobileSidebar,
}: HeaderProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Determine current active product and module from pathname
  const segments = pathname.split("/").filter(Boolean);
  const activeProduct = segments[0] || "client";
  const activeModule = segments[1] || "chat";

  // Persistent theme management: default to dark, preserve across all product changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ma_prd_theme");
      if (stored === "light") {
        document.documentElement.classList.remove("dark");
        setTheme("light");
      } else {
        // Blackish dark theme by default
        document.documentElement.classList.add("dark");
        setTheme("dark");
      }
    } catch {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    try {
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("ma_prd_theme", "dark");
        setTheme("dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("ma_prd_theme", "light");
        setTheme("light");
      }
    } catch {
      setTheme(nextTheme);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md transition-colors">
      {/* ── Row 1: Top Bar (Logo, Search, Light/Dark Toggle) ── */}
      <div className="w-full h-14 border-b border-slate-200/80 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger + Logo */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href={`/${activeProduct}/chat`} className="flex items-center gap-2.5 group">
            <div className="relative h-6 w-28 sm:w-32">
              <Image
                src="/ma_logo.png"
                alt="MantraAssist"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400">
              PRD
            </span>
          </Link>
        </div>

        {/* Right: Search + Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Palette Trigger (Cmd/Ctrl+K) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors shadow-2xs"
            title="Search PRDs"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search PRDs...</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle Button with Edge-Safe Tooltip */}
          <Tooltip
            content={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
            position="bottom"
            align="right"
          >
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors border border-slate-200/60 dark:border-zinc-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* ── Row 2: Product Tabs Directly Under Top Bar (Client | Admin | Companion) ── */}
      <div className="w-full h-10 border-b border-slate-200/80 dark:border-zinc-800 px-4 sm:px-6 flex items-center bg-slate-50/50 dark:bg-[#09090b]">
        <nav className="flex items-center gap-6 h-full">
          {PRODUCTS.map((prod) => {
            const isActive = activeProduct === prod.id;
            return (
              <Link
                key={prod.id}
                href={`/${prod.id}/${activeModule}`}
                className={`h-full flex items-center px-1 text-xs sm:text-[13px] font-medium transition-colors border-b-2 ${
                  isActive
                    ? "border-[#1456f0] text-slate-900 dark:text-white font-semibold"
                    : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                {prod.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
