"use client";

import React, { useEffect, useState } from "react";
import { PrdDocument } from "@/lib/prdLoader";

interface TableOfContentsProps {
  prd: PrdDocument;
}

export default function TableOfContents({ prd }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Collect all element IDs to observe
    const ids: string[] = [];
    if (prd.crossProductSummaryRaw) {
      ids.push("cross-product-summary");
    }

    prd.sections.forEach((sec) => {
      ids.push(sec.slug);
      if (sec.number === 2 && sec.features) {
        sec.features.forEach((feat) => {
          ids.push(feat.slug);
          feat.parts.forEach((p) => ids.push(p.slug));
        });
      }
      if (sec.number === 3 && sec.subSections) {
        sec.subSections.forEach((sub) => ids.push(sub.slug));
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible entries
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Select topmost intersecting element
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-90px 0px -65% 0px",
        threshold: 0,
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [prd]);

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -95;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="w-64 min-w-[256px] max-w-[256px] hidden xl:block p-4 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto select-none border-l border-slate-200/80 dark:border-zinc-800 transition-colors">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">
        On this page
      </p>

      <div className="space-y-3 text-xs">
        {prd.crossProductSummaryRaw && (
          <button
            type="button"
            onClick={() => scrollToElement("cross-product-summary")}
            className={`w-full text-left py-1 px-2 rounded-md transition-colors truncate block ${
              activeId === "cross-product-summary"
                ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/30"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
            }`}
          >
            Cross-product Summary
          </button>
        )}

        {prd.sections.map((sec) => (
          <div key={sec.slug} className="space-y-1">
            <button
              type="button"
              onClick={() => scrollToElement(sec.slug)}
              className={`w-full text-left py-1 px-2 rounded-md transition-colors font-medium truncate block ${
                activeId === sec.slug
                  ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/30"
                  : "text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {sec.number}. {sec.title}
            </button>

            {/* Feature Requests Breakdown: list each feature and its 5 parts */}
            {sec.number === 2 && sec.features && (
              <div className="pl-2 space-y-2 border-l border-slate-200/60 dark:border-zinc-800 ml-2 pt-1">
                {sec.features.map((feat) => {
                  const isFeatureActive = activeId === feat.slug;
                  return (
                    <div key={feat.slug} className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => scrollToElement(feat.slug)}
                        className={`w-full text-left py-0.5 px-2 rounded text-[11px] font-medium transition-colors truncate block ${
                          isFeatureActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/40 dark:bg-blue-950/20"
                            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                        }`}
                        title={`${feat.id}: ${feat.title}`}
                      >
                        <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 mr-1">
                          {feat.id}:
                        </span>
                        {feat.title}
                      </button>

                      {/* The 5 parts for this feature */}
                      <div className="pl-3 space-y-0.5">
                        {feat.parts.map((p) => {
                          const isPartActive = activeId === p.slug;
                          return (
                            <button
                              key={p.slug}
                              type="button"
                              onClick={() => scrollToElement(p.slug)}
                              className={`w-full text-left py-0.5 px-1.5 rounded text-[10px] transition-colors truncate block ${
                                isPartActive
                                  ? "text-blue-600 dark:text-blue-400 font-medium"
                                  : "text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                              }`}
                            >
                              {p.number}. {p.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Section 3 Sub-sections */}
            {sec.number === 3 && sec.subSections && (
              <div className="pl-2 space-y-0.5 border-l border-slate-200/60 dark:border-zinc-800 ml-2 pt-1">
                {sec.subSections.map((sub) => {
                  const isSubActive = activeId === sub.slug;
                  return (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => scrollToElement(sub.slug)}
                      className={`w-full text-left py-0.5 px-2 rounded text-[11px] transition-colors truncate block ${
                        isSubActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                      }`}
                    >
                      {sub.number} {sub.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
