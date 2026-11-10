import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { loadPrd, hasPrd } from "@/lib/prdLoader";
import { getModuleById, getModulesForProduct, getProductLink, ProductId } from "@/lib/modulesConfig";
import PrdRenderer from "@/components/PrdRenderer";
import PrdLayoutClient from "@/components/PrdLayoutClient";

interface PageProps {
  params: {
    product: string;
    module: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = params.product as ProductId;
  const modDef = getModuleById(params.module);
  const modName = modDef?.name || params.module;
  
  return {
    title: `${modName} PRD | ${product.replace("-", " ").toUpperCase()} - MantraAssist`,
    description: `Product Requirements Document for ${modName} in MantraAssist ${product}.`,
  };
}

export default function PrdPage({ params }: PageProps) {
  const validProducts = ["client", "admin", "companion", "ai-receptionist"] as const;
  const product = params.product.toLowerCase() as (typeof validProducts)[number];

  if (!validProducts.includes(product)) {
    notFound();
  }

  const moduleId = params.module.toLowerCase();
  const modDef = getModuleById(moduleId);

  // If this module has submodules/tabs for this product, redirect directly to the first tab
  const productMods = getModulesForProduct(product);
  const currentModDef = productMods.find((m) => m.id === moduleId) || modDef;
  if (currentModDef?.submodules && currentModDef.submodules.length > 0) {
    redirect(`/${product}/${moduleId}/${currentModDef.submodules[0].id}`);
  }

  // Attempt to load PRD
  const prd = loadPrd(product, moduleId);

  // If PRD does not exist in this product, open that product's first module
  if (!prd) {
    const fallbackLink = getProductLink(product);
    if (fallbackLink && fallbackLink !== `/${product}/${moduleId}`) {
      redirect(fallbackLink);
    }
    notFound();
  }

  // Check presence of PRD in other products
  const hasPrdInOtherProducts: Record<ProductId, boolean> = {
    client: hasPrd("client", moduleId),
    admin: hasPrd("admin", moduleId),
    companion: hasPrd("companion", moduleId),
    "ai-receptionist": hasPrd("ai-receptionist", moduleId),
  };

  // If PRD exists, render document view
  return (
    <PrdLayoutClient product={product} prd={prd}>
      <PrdRenderer
        prd={prd}
        hasPrdInOtherProducts={hasPrdInOtherProducts}
      />
    </PrdLayoutClient>
  );
}
