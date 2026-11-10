import { notFound } from "next/navigation";
import { Metadata } from "next";
import { loadPrd, hasPrd } from "@/lib/prdLoader";
import { getModuleById } from "@/lib/modulesConfig";
import PrdRenderer from "@/components/PrdRenderer";
import PrdLayoutClient from "@/components/PrdLayoutClient";
import ProductSwitchCtas from "@/components/ProductSwitchCtas";
import { Clock } from "lucide-react";

interface PageProps {
  params: {
    product: string;
    module: string;
    channel: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = params.product as "client" | "admin" | "companion";
  const modDef = getModuleById(params.module);
  const modName = modDef?.name || params.module;
  const channelName = params.channel.toUpperCase();
  
  return {
    title: `${channelName} Channel PRD | ${modName} - MantraAssist ${product.toUpperCase()}`,
    description: `Product Requirements Document for ${channelName} in MantraAssist ${product}.`,
  };
}

export default function ChannelPrdPage({ params }: PageProps) {
  const validProducts = ["client", "admin", "companion"] as const;
  const product = params.product.toLowerCase() as (typeof validProducts)[number];

  if (product !== "client") {
    notFound();
  }

  const moduleId = params.module.toLowerCase();
  const channelId = params.channel.toLowerCase();
  const modDef = getModuleById(moduleId);

  // Attempt to load Channel-specific PRD
  const prd = loadPrd(product, moduleId, channelId);

  // Check presence of PRD in other products
  const hasPrdInOtherProducts = {
    client: hasPrd("client", moduleId),
    admin: hasPrd("admin", moduleId),
    companion: hasPrd("companion", moduleId),
  };

  if (prd) {
    return (
      <PrdLayoutClient product={product} prd={prd}>
        <PrdRenderer
          prd={prd}
          hasPrdInOtherProducts={hasPrdInOtherProducts}
        />
      </PrdLayoutClient>
    );
  }

  return (
    <PrdLayoutClient product={product} prd={null}>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
          <span className="capitalize">{product}</span>
          <span className="text-slate-300 dark:text-zinc-700">/</span>
          <span>{modDef?.name || moduleId}</span>
          <span className="text-slate-300 dark:text-zinc-700">/</span>
          <span className="text-slate-800 dark:text-zinc-200 font-semibold capitalize">{channelId}</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          {channelId.toUpperCase()} Channel PRD
        </h1>

        <ProductSwitchCtas
          currentProduct={product}
          currentModule={moduleId}
          hasPrdInProduct={hasPrdInOtherProducts}
        />

        <div className="p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] shadow-2xs space-y-5">
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50/50 dark:bg-[#09090b]/40 flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-semibold text-slate-800 dark:text-zinc-200">
                Channel Specification In Authoring Pipeline
              </p>
              <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">
                The detailed feature specification and workflow requirements for the {channelId} channel are being documented.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PrdLayoutClient>
  );
}

