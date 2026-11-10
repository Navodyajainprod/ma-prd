"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, CheckCircle2, History } from "lucide-react";
import { PrdDocument } from "@/lib/prdLoader";
import { downloadFile } from "@/lib/downloadUtils";
import { ProductId } from "@/lib/modulesConfig";
import ProductSwitchCtas from "./ProductSwitchCtas";

interface PrdRendererProps {
  prd: PrdDocument;
  hasPrdInOtherProducts: Record<ProductId, boolean>;
}

/**
 * High-fidelity Markdown-to-JSX renderer specifically crafted for PRD documents
 */
function MarkdownBlock({
  content,
  currentFeatureId = "",
}: {
  content: string;
  currentFeatureId?: string;
}) {
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let i = 0;
  let activeFeature = currentFeatureId;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Skip dashes (---, ___, ***), raw markdown headers (# ..., ## ...), legacy "Item | Detail" lines, and Open Items
    if (
      trimmed === "" ||
      /^[-*_\s]{3,}$/.test(trimmed) ||
      trimmed.startsWith("# ") ||
      trimmed.startsWith("## ") ||
      /^###\s*Open Items/i.test(trimmed) ||
      /^(-\s*)?To confirm:/i.test(trimmed) ||
      /^\|\s*Item\s*\|\s*Detail\s*\|/i.test(trimmed) ||
      /^\|\s*:?---+\s*\|\s*:?---+\s*\|/i.test(trimmed)
    ) {
      i++;
      continue;
    }

    // 2. Check for Table: starts with `|`
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        const bodyRows = tableLines.slice(2).map((r) =>
          r
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim())
        );

        renderedElements.push(
          <div
            key={`table-${i}`}
            className="mt-2.5 mb-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 shadow-2xs"
          >
            <table className="w-full text-left text-xs sm:text-[13px] border-collapse">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                  {headerRow.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[11px]"
                    >
                      {formatInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 bg-white dark:bg-[#0c0c0e]">
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="py-2.5 px-3.5 text-slate-700 dark:text-zinc-300 align-top leading-relaxed tabular-nums"
                      >
                        {formatInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 3. Callout Blockquote: starts with `>`
    if (trimmed.startsWith(">")) {
      const calloutLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        calloutLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }

      renderedElements.push(
        <div
          key={`callout-${i}`}
          className="my-4 p-4 rounded-r-xl border-l-4 border-l-[#1456f0] border-y border-r border-slate-200/80 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-slate-800 dark:text-zinc-200 text-xs sm:text-[13px] leading-relaxed shadow-2xs space-y-1"
        >
          {calloutLines.map((cLine, cIdx) => (
            <p key={cIdx}>{formatInlineMarkdown(cLine)}</p>
          ))}
        </div>
      );
      continue;
    }

    // 4. Feature Heading: `### F-1: <Title>` or Sub-section: `### 3.1 <Title>`
    if (trimmed.startsWith("### ")) {
      const headingText = trimmed.replace(/^###\s+/, "");
      const fMatch = headingText.match(/^(F-\d+)[\s:]*(.*)$/);
      const subMatch = headingText.match(/^(\d+\.\d+)[\s:]*(.*)$/);

      let anchorId = "";
      if (fMatch) {
        activeFeature = fMatch[1].toLowerCase();
        anchorId = activeFeature;
      } else if (subMatch) {
        anchorId = `section-${subMatch[1].replace(".", "-")}`;
      } else {
        anchorId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      }

      renderedElements.push(
        <h3
          key={`h3-${i}`}
          id={anchorId}
          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-12 mb-4 tracking-tight scroll-mt-24 pt-5 border-t border-slate-200 dark:border-zinc-800 first:border-t-0 first:pt-0 first:mt-4"
        >
          {formatInlineMarkdown(headingText)}
        </h3>
      );
      i++;
      continue;
    }

    // 5. Part Heading: `#### 1. What it does`, `#### 2. What it includes`, etc.
    if (trimmed.startsWith("#### ")) {
      const partText = trimmed.replace(/^####\s+/, "");
      const partMatch = partText.match(/^(\d+)\.\s+(.*)$/);
      let partSlug = "";
      if (partMatch && activeFeature) {
        const partName = partMatch[2].toLowerCase().replace(/[^a-z0-9]+/g, "-");
        partSlug = `${activeFeature}-${partName}`;
      } else {
        partSlug = partText.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      }

      const isFirstPart = partMatch && partMatch[1] === "1";

      renderedElements.push(
        <h4
          key={`h4-${i}`}
          id={partSlug}
          className={`text-xs sm:text-[13px] font-bold text-slate-900 dark:text-zinc-100 mb-2 scroll-mt-24 ${
            isFirstPart
              ? "mt-4"
              : "pt-7 sm:pt-8 mt-2"
          }`}
        >
          {formatInlineMarkdown(partText)}
        </h4>
      );
      i++;
      continue;
    }

    // 6. Unordered List: starts with `- ` or `* `
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
      ) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }

      renderedElements.push(
        <ul
          key={`ul-${i}`}
          className="my-3 space-y-1.5 pl-5 list-disc text-xs sm:text-[13px] text-slate-700 dark:text-zinc-300"
        >
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              {formatInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Ordered List: starts with `1. `, `2. `, etc.
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }

      renderedElements.push(
        <ol
          key={`ol-${i}`}
          className="my-3 space-y-1.5 pl-5 list-decimal text-xs sm:text-[13px] text-slate-700 dark:text-zinc-300"
        >
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              {formatInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 8. Standard Paragraph
    renderedElements.push(
      <p
        key={`p-${i}`}
        className="mt-1.5 mb-4 text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-zinc-300"
      >
        {formatInlineMarkdown(rawLine)}
      </p>
    );

    i++;
  }

  return <div className="space-y-1">{renderedElements}</div>;
}

/**
 * Formats inline bold (**text**), inline code (`code`), and markdown links [text](url)
 */
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;

  let keyCounter = 0;
  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);

    const matches = [
      linkMatch ? { type: "link", match: linkMatch, index: linkMatch.index! } : null,
      boldMatch ? { type: "bold", match: boldMatch, index: boldMatch.index! } : null,
      codeMatch ? { type: "code", match: codeMatch, index: codeMatch.index! } : null,
    ].filter(Boolean) as { type: string; match: RegExpMatchArray; index: number }[];

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const earliest = matches[0];

    if (earliest.index > 0) {
      parts.push(remaining.substring(0, earliest.index));
    }

    if (earliest.type === "link") {
      const label = earliest.match[1];
      const url = earliest.match[2];
      parts.push(
        <Link
          key={`link-${keyCounter++}`}
          href={url}
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-0.5"
        >
          {label}
        </Link>
      );
    } else if (earliest.type === "bold") {
      const boldText = earliest.match[1];
      parts.push(
        <strong
          key={`bold-${keyCounter++}`}
          className="font-semibold text-slate-900 dark:text-white"
        >
          {boldText}
        </strong>
      );
    } else if (earliest.type === "code") {
      const codeText = earliest.match[1];
      parts.push(
        <code
          key={`code-${keyCounter++}`}
          className="px-1.5 py-0.5 mx-0.5 text-[11px] font-mono bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-slate-800 dark:text-zinc-200"
        >
          {codeText}
        </code>
      );
    }

    remaining = remaining.substring(earliest.index + earliest.match[0].length);
  }

  return parts;
}

export default function PrdRenderer({
  prd,
  hasPrdInOtherProducts,
}: PrdRendererProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Revived Module/Channel-Level Markdown Download
  const handleDownloadModule = () => {
    const channelSuffix = prd.channel ? `-${prd.channel}` : "";
    const filename = `${prd.product.toLowerCase()}-${prd.module}${channelSuffix}-prd.md`;
    downloadFile(filename, prd.rawFullMarkdown);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const channelLabel = prd.channel ? prd.channel.charAt(0).toUpperCase() + prd.channel.slice(1) : "";

  const moduleDisplayName =
    prd.module === "chat"
      ? prd.channel
        ? `Chats & Care Groups - ${channelLabel} Channel (/chats?channel=${prd.channel})`
        : prd.product === "companion"
        ? "Patient Messaging & Care Hub (/patient/messages)"
        : "Chats & Care Groups (/chats)"
      : prd.module;

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-8 space-y-6">
      {/* ── Top Header Area: Breadcrumb, Page Title & Revived Module-Wise Download Button ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-2">
        <div className="space-y-1.5 min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
            <Link
              href={`/${prd.product}/chat`}
              className="hover:text-slate-800 dark:hover:text-zinc-200 transition-colors capitalize"
            >
              {prd.product}
            </Link>
            <span className="text-slate-300 dark:text-zinc-700">/</span>
            <Link
              href={`/${prd.product}/chat`}
              className="hover:text-slate-800 dark:hover:text-zinc-200 transition-colors truncate"
            >
              {prd.module === "chat" ? (prd.product === "companion" ? "Patient Messaging & Care Hub" : "Chats & Care Groups") : prd.module}
            </Link>
            {channelLabel && (
              <>
                <span className="text-slate-300 dark:text-zinc-700">/</span>
                <span className="text-slate-800 dark:text-zinc-200 font-semibold">{channelLabel}</span>
              </>
            )}
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {prd.title}
          </h1>
        </div>

        {/* Revived Module-Wise Download .md Button */}
        <button
          type="button"
          onClick={handleDownloadModule}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 rounded-lg shadow-2xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
          title="Download Full Module PRD as Markdown"
        >
          {downloadSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">Downloaded (.md)</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>Download .md</span>
            </>
          )}
        </button>
      </div>

      {/* ── Buttons to Open the Same Module in the Other Two Products ── */}
      <ProductSwitchCtas
        currentProduct={prd.product}
        currentModule={prd.module}
        hasPrdInProduct={hasPrdInOtherProducts}
      />

      {/* ── Clean Metadata Table (Strictly NO "Item | Detail" text) ── */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 shadow-2xs">
        <table className="w-full text-left text-xs sm:text-[13px] border-collapse">
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 bg-white dark:bg-[#0c0c0e]">
            <tr>
              <td className="py-2.5 px-3.5 font-medium text-slate-500 dark:text-zinc-400 w-36 bg-slate-50/70 dark:bg-zinc-900/40">Product</td>
              <td className="py-2.5 px-3.5 text-slate-900 dark:text-white font-semibold capitalize">{prd.product}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3.5 font-medium text-slate-500 dark:text-zinc-400 bg-slate-50/70 dark:bg-zinc-900/40">Module</td>
              <td className="py-2.5 px-3.5 text-slate-800 dark:text-zinc-200">{moduleDisplayName}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3.5 font-medium text-slate-500 dark:text-zinc-400 bg-slate-50/70 dark:bg-zinc-900/40">Status</td>
              <td className="py-2.5 px-3.5 text-slate-800 dark:text-zinc-200">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  {prd.status}
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-3.5 font-medium text-slate-500 dark:text-zinc-400 bg-slate-50/70 dark:bg-zinc-900/40">Created</td>
              <td className="py-2.5 px-3.5 text-slate-800 dark:text-zinc-200 font-mono text-xs">{prd.created_date}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3.5 font-medium text-slate-500 dark:text-zinc-400 bg-slate-50/70 dark:bg-zinc-900/40">Last updated</td>
              <td className="py-2.5 px-3.5 text-slate-800 dark:text-zinc-200 font-mono text-xs">{prd.last_updated}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── PRD Sections ── */}
      <div className="space-y-14 pt-4">
        {/* Cross-Product Summary (if present) */}
        {prd.crossProductSummaryRaw && (
          <section
            id="cross-product-summary"
            className="scroll-mt-24 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/40 space-y-2 shadow-2xs"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
              Cross-product Summary
            </h2>
            <div>
              <MarkdownBlock content={prd.crossProductSummaryRaw} />
            </div>
          </section>
        )}

        {/* Sections 1, 2, and 3 */}
        {prd.sections.map((sec) => (
          <section key={sec.slug} id={sec.slug} className="scroll-mt-24 pt-6 border-t border-slate-200/80 dark:border-zinc-800">
            {/* Clean Section Heading without Section-Level Download Button */}
            <div className="pb-3 mb-6 border-b border-slate-200/70 dark:border-zinc-800/80">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="font-mono text-sm text-slate-400 dark:text-zinc-500">
                  {sec.number}.
                </span>
                <span>{sec.title}</span>
              </h2>
            </div>

            {/* Section Content */}
            <div className="text-slate-700 dark:text-zinc-300">
              <MarkdownBlock
                content={sec.rawMarkdown.replace(/^##\s+\d+\.\s+[^\n]+\n?/, "")}
              />
            </div>
          </section>
        ))}
      </div>

      {/* Footer Audit Link to Date & Edit Logs in Sidebar */}
      <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
        <span>MantraAssist {prd.product.toUpperCase()} PRD</span>
        <Link
          href={`/${prd.product}/logs`}
          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          <History className="w-3.5 h-3.5" />
          <span>View Date & Edit Logs</span>
        </Link>
      </div>
    </article>
  );
}
