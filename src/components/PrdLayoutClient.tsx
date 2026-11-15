"use client";

import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import TableOfContents from "./TableOfContents";
import { PrdDocument } from "@/lib/prdLoader";
import { ProductId } from "@/lib/modulesConfig";

interface PrdLayoutClientProps {
  product: ProductId;
  prd?: PrdDocument | null;
  children: React.ReactNode;
}

export default function PrdLayoutClient({
  product,
  prd = null,
  children,
}: PrdLayoutClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-[#0f172a] dark:text-[#f4f4f5] transition-colors">
      {/* ── Sticky Top Bar with Integrated Product Switcher & Search ── */}
      <Header
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((v) => !v)}
      />

      {/* ── Main Layout Container ── */}
      <div className="flex-1 flex w-full relative">
        {/* Left Desktop Sidebar (Hidden on mobile) */}
        <div className="hidden md:block sticky top-14 h-[calc(100vh-3.5rem)] shrink-0 z-30 w-64">
          <Sidebar product={product} />
        </div>

        {/* Mobile Sidebar Slide-Over Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <div className="relative w-[85vw] max-w-[320px] bg-white dark:bg-[#0c0c0e] h-full shadow-2xl z-10 flex flex-col border-r border-slate-200 dark:border-zinc-800 animate-in slide-in-from-left duration-200">
              <Sidebar product={product} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Centre: Main Content Column */}
        <main className="flex-1 min-w-0 pb-16 overflow-x-hidden">
          {children}
        </main>

        {/* Right: Table of Contents (Hidden on mobile) */}
        {prd && <TableOfContents prd={prd} />}
      </div>
    </div>
  );
}
