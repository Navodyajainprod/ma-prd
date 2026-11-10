"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu } from "lucide-react";
import { PRODUCTS, ProductId, getProductLink } from "@/lib/modulesConfig";
import Tooltip from "./Tooltip";
import SearchDropdown from "./SearchDropdown";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export default function Header({
  onToggleMobileSidebar,
}: HeaderProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Determine current active product and module from pathname
  const segments = pathname.split("/").filter(Boolean);
  const activeProduct = (segments[0] || "client") as ProductId;
  const activeModule = segments[1] || "";

  // Persistent theme management: default to dark
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ma_prd_theme");
      if (stored === "light") {
        document.documentElement.classList.remove("dark");
        setTheme("light");
      } else {
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
    <header className="sticky top-0 z-40 w-full h-14 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
      <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Trigger + Logo */}
        <div className="flex items-center gap-3 shrink-0">
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

          <Link href={getProductLink(activeProduct || "client")} className="flex items-center gap-2.5 group">
            <div className="relative h-6 w-24 sm:w-28 md:w-32">
              <Image
                src="/ma_logo.png"
                alt="MantraAssist"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden lg:inline-block text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400">
              PRD
            </span>
          </Link>
        </div>

        {/* Center: Product Switcher Links (Client | Admin | Companion | AI Receptionist) */}
        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 h-full overflow-x-auto no-scrollbar shrink-0">
          {PRODUCTS.map((prod) => {
            const isActive = activeProduct === prod.id;
            const targetHref = activeModule ? `/${prod.id}/${activeModule}` : getProductLink(prod.id);

            return (
              <Link
                key={prod.id}
                href={targetHref}
                className={`h-full flex items-center px-1 text-xs sm:text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
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

        {/* Right: Inline Dropdown Search + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <SearchDropdown />

          <Tooltip
            content={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
            position="bottom"
            align="right"
          >
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors border border-slate-200/60 dark:border-zinc-800"
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
    </header>
  );
}
