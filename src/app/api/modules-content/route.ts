import { NextResponse } from "next/server";
import { ALL_MODULES, ModuleDefinition, ProductId } from "@/lib/modulesConfig";
import { loadPrd } from "@/lib/prdLoader";

function loadCombinedModuleMarkdown(product: ProductId, id: string, modDef?: ModuleDefinition): string | null {
  const subs = modDef?.submodulesByProduct?.[product] || modDef?.submodules;
  if (subs && subs.length > 0) {
    const parts = subs
      .map((sub) => loadPrd(product, id, sub.channel || sub.id)?.rawFullMarkdown)
      .filter((content): content is string => Boolean(content));
    if (parts.length > 0) {
      return parts.join("\n\n---\n\n");
    }
  }
  return loadPrd(product, id)?.rawFullMarkdown || null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const moduleIdsParam = searchParams.get("modules");

  const moduleIds = moduleIdsParam ? moduleIdsParam.split(",") : ALL_MODULES.map((m) => m.id);

  const results = moduleIds.map((id) => {
    const modDef = ALL_MODULES.find((m) => m.id === id);
    const clientContent = loadCombinedModuleMarkdown("client", id, modDef);
    const adminContent = loadCombinedModuleMarkdown("admin", id, modDef);
    const companionContent = loadCombinedModuleMarkdown("companion", id, modDef);
    const receptionContent = loadCombinedModuleMarkdown("ai-receptionist", id, modDef);

    return {
      moduleId: id,
      moduleName: modDef?.name || id,
      clientContent,
      adminContent,
      companionContent,
      receptionContent,
      hasAnyPrd: Boolean(clientContent || adminContent || companionContent || receptionContent),
    };
  });

  return NextResponse.json({ modules: results });
}
