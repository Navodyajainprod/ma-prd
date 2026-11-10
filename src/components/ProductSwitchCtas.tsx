"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Tooltip from "./Tooltip";
import { PRODUCTS } from "@/lib/modulesConfig";

interface ProductSwitchCtasProps {
  currentProduct: "client" | "admin" | "companion";
  currentModule: string;
  hasPrdInProduct: {
    client: boolean;
    admin: boolean;
    companion: boolean;
  };
}

export default function ProductSwitchCtas({
  currentProduct,
  currentModule,
  hasPrdInProduct,
}: ProductSwitchCtasProps) {
  const otherProducts = PRODUCTS.filter((p) => p.id !== currentProduct);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {otherProducts.map((p) => {
        const hasPrd = hasPrdInProduct[p.id as keyof typeof hasPrdInProduct];

        if (hasPrd) {
          return (
            <Link
              key={p.id}
              href={`/${p.id}/${currentModule}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs"
            >
              <span>View in {p.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            </Link>
          );
        }

        return (
          <Tooltip key={p.id} content="Not documented yet" position="bottom">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 dark:text-zinc-600 bg-slate-100/60 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg cursor-not-allowed opacity-75"
            >
              <span>View in {p.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
