import { notFound, redirect } from "next/navigation";
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
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = params.product as "client" | "admin" | "companion";
  const modDef = getModuleById(params.module);
  const modName = modDef?.name || params.module;
  
  return {
    title: `${modName} PRD | ${product.toUpperCase()} - MantraAssist`,
    description: `Product Requirements Document for ${modName} in MantraAssist ${product}.`,
  };
}

export default function PrdPage({ params }: PageProps) {
  const validProducts = ["client", "admin", "companion"] as const;
  const product = params.product.toLowerCase() as (typeof validProducts)[number];

  if (!validProducts.includes(product)) {
    notFound();
  }

  const moduleId = params.module.toLowerCase();

  // If visiting client/chat without channel, redirect to client/chat/whatsapp
  if (product === "client" && moduleId === "chat") {
    redirect("/client/chat/whatsapp");
  }

  const modDef = getModuleById(moduleId);

  // Attempt to load PRD
  const prd = loadPrd(product, moduleId);

  // Check presence of PRD in other products
  const hasPrdInOtherProducts = {
    client: hasPrd("client", moduleId),
    admin: hasPrd("admin", moduleId),
    companion: hasPrd("companion", moduleId),
  };

  // If PRD exists, render document view
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

  // If PRD is not yet created ("Soon" state)
  return (
    <PrdLayoutClient product={product} prd={null}>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
          <span className="capitalize">{product}</span>
          <span className="text-slate-300 dark:text-zinc-700">/</span>
          <span className="text-slate-800 dark:text-zinc-200 font-semibold">{modDef?.name || moduleId}</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          {modDef?.name || moduleId}
        </h1>

        <ProductSwitchCtas
          currentProduct={product}
          currentModule={moduleId}
          hasPrdInProduct={hasPrdInOtherProducts}
        />

        <div className="p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] shadow-2xs space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
              {product.toUpperCase()}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              {modDef?.category || "WORKSPACE"}
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {modDef?.name || moduleId}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              {modDef?.description || "Module discovered in ma-figma codebase."}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50/50 dark:bg-[#09090b]/40 flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-semibold text-slate-800 dark:text-zinc-200">
                PRD In Authoring Pipeline
              </p>
              <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">
                The detailed feature specification, worked examples, and acceptance criteria for {modDef?.name || moduleId} are being prepared.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PrdLayoutClient>
  );
}
