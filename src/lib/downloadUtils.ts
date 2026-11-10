export function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadSectionMd(
  prdName: string,
  sectionNumber: number,
  sectionTitle: string,
  sectionMarkdown: string
) {
  const sanitizedPrdName = prdName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const sanitizedTitle = sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const filename = `${sanitizedPrdName}-${sectionNumber}-${sanitizedTitle}.md`;
  
  downloadFile(filename, sectionMarkdown);
}

export interface ModulePrdContent {
  moduleId: string;
  moduleName: string;
  clientContent?: string | null;
  adminContent?: string | null;
  companionContent?: string | null;
  receptionContent?: string | null;
}

export function buildMultiModuleMarkdown(modules: ModulePrdContent[]): { filename: string; content: string } {
  const parts: string[] = [];

  for (const mod of modules) {
    const hasAnyContent =
      mod.clientContent ||
      mod.adminContent ||
      mod.companionContent ||
      mod.receptionContent;
    if (!hasAnyContent) continue;

    parts.push(`# ${mod.moduleName}\n`);

    if (mod.clientContent) {
      parts.push(`## Client\n\n${mod.clientContent.trim()}\n`);
    }

    if (mod.adminContent) {
      parts.push(`## Admin\n\n${mod.adminContent.trim()}\n`);
    }

    if (mod.companionContent) {
      parts.push(`## Companion\n\n${mod.companionContent.trim()}\n`);
    }

    if (mod.receptionContent) {
      parts.push(`## AI Receptionist\n\n${mod.receptionContent.trim()}\n`);
    }

    parts.push("\n---\n");
  }

  const dateStr = new Date().toISOString().split("T")[0];
  const filename = modules.length === 1 
    ? `${modules[0].moduleId}-prd-${dateStr}.md` 
    : `ma-prds-${dateStr}.md`;

  return {
    filename,
    content: parts.join("\n"),
  };
}
