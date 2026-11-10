import { NextResponse } from "next/server";
import { ALL_MODULES } from "@/lib/modulesConfig";
import { loadPrd } from "@/lib/prdLoader";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const moduleIdsParam = searchParams.get("modules");

  const moduleIds = moduleIdsParam ? moduleIdsParam.split(",") : ALL_MODULES.map((m) => m.id);

  const results = moduleIds.map((id) => {
    const modDef = ALL_MODULES.find((m) => m.id === id);
    const clientPrd = loadPrd("client", id);
    const adminPrd = loadPrd("admin", id);
    const companionPrd = loadPrd("companion", id);
    const receptionPrd = loadPrd("ai-receptionist", id);

    return {
      moduleId: id,
      moduleName: modDef?.name || id,
      clientContent: clientPrd?.rawFullMarkdown || null,
      adminContent: adminPrd?.rawFullMarkdown || null,
      companionContent: companionPrd?.rawFullMarkdown || null,
      receptionContent: receptionPrd?.rawFullMarkdown || null,
      hasAnyPrd: Boolean(clientPrd || adminPrd || companionPrd || receptionPrd),
    };
  });

  return NextResponse.json({ modules: results });
}
