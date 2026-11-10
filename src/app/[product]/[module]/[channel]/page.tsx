import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { loadPrd, hasPrd } from "@/lib/prdLoader";
import { getModuleById, getProductLink, ProductId } from "@/lib/modulesConfig";
import PrdRenderer from "@/components/PrdRenderer";
import PrdLayoutClient from "@/components/PrdLayoutClient";

interface PageProps {
  params: {
    product: string;
    module: string;
    channel: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = params.product as ProductId;
  const modDef = getModuleById(params.module);
  const modName = modDef?.name || params.module;
  const channelName = params.channel.toUpperCase();
  
  return {
    title: `${channelName} PRD | ${modName} - MantraAssist ${product.replace("-", " ").toUpperCase()}`,
    description: `Product Requirements Document for ${channelName} in MantraAssist ${product}.`,
  };
}

export default function ChannelPrdPage({ params }: PageProps) {
  const validProducts = ["client", "admin", "companion", "ai-receptionist"] as const;
  const product = params.product.toLowerCase() as (typeof validProducts)[number];

  if (!validProducts.includes(product)) {
    notFound();
  }

  const moduleId = params.module.toLowerCase();
  const channelId = params.channel.toLowerCase();

  // Attempt to load Channel-specific PRD
  const prd = loadPrd(product, moduleId, channelId);

  // If PRD not found, redirect to product fallback
  if (!prd) {
    const fallbackUrl = getProductLink(product, moduleId);
    if (fallbackUrl && fallbackUrl !== `/${product}/${moduleId}/${channelId}`) {
      redirect(fallbackUrl);
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

  return (
    <PrdLayoutClient product={product} prd={prd}>
      <PrdRenderer
        prd={prd}
        hasPrdInOtherProducts={hasPrdInOtherProducts}
      />
    </PrdLayoutClient>
  );
}
