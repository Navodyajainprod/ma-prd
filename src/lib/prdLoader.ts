import fs from "fs";
import path from "path";

/**
 * Pure zero-dependency frontmatter parser to eliminate Webpack esprima/gray-matter chunk errors
 */
function parseFrontmatter(fileContent: string): { data: Record<string, string>; content: string } {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: fileContent };
  }

  const rawYaml = match[1];
  const body = match[2];
  const data: Record<string, string> = {};

  rawYaml.split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      let val = line.substring(colonIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      data[key] = val;
    }
  });

  return { data, content: body };
}

export interface FeaturePart {
  number: number;
  title: string;
  slug: string;
}

export interface FeatureItem {
  id: string; // e.g. "F-1"
  title: string; // e.g. "Omnichannel Thread Aggregation & Channel Filtering"
  slug: string; // e.g. "f-1"
  parts: FeaturePart[];
  rawMarkdown: string;
}

export interface SubSection {
  number: string; // e.g. "3.1"
  title: string; // e.g. "Feature Request Summary"
  slug: string;
  rawMarkdown: string;
}

export interface PrdSection {
  number: number;
  title: string;
  slug: string;
  rawMarkdown: string;
  features?: FeatureItem[];
  subSections?: SubSection[];
}

export interface PrdDocument {
  title: string;
  product: "client" | "admin" | "companion";
  module: string;
  channel?: string;
  status: string;
  created_date: string;
  last_updated: string;
  headerTableRaw: string;
  crossProductSummaryRaw: string | null;
  dateLog: string[];
  editLog: { date: string; section: string; change: string }[];
  sections: PrdSection[];
  rawFullMarkdown: string;
}

export function getPrdPath(product: string, moduleName: string, channelName?: string): string | null {
  // If specific channel is requested (e.g. whatsapp, sms, website, companion)
  if (channelName) {
    if (product !== "client") {
      // Sub-channels only exist for Client
      return null;
    }
    const channelPaths = [
      path.join(process.cwd(), "content", product, moduleName, `${channelName}.md`),
      path.join(process.cwd(), "content", product, `${moduleName}-${channelName}.md`),
    ];
    for (const p of channelPaths) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  const possiblePaths = [
    path.join(process.cwd(), "content", product, moduleName, `${moduleName}.md`),
    path.join(process.cwd(), "content", product, moduleName, "prd.md"),
    path.join(process.cwd(), "content", product, moduleName, "chat.md"),
    path.join(process.cwd(), "content", product, `${moduleName}.md`),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Also check if directory has any .md file
  const dirPath = path.join(process.cwd(), "content", product, moduleName);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    const mdFile = files.find((f) => f.endsWith(".md"));
    if (mdFile) return path.join(dirPath, mdFile);
  }

  return null;
}

export function loadPrd(
  product: "client" | "admin" | "companion",
  moduleName: string,
  channelName?: string
): PrdDocument | null {
  const filePath = getPrdPath(product, moduleName, channelName);
  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = parseFrontmatter(fileContent);

  // 1. Clean content of any legacy Item | Detail text
  const cleanContent = content.replace(/\|[\s]*Item[\s]*\|[\s]*Detail[\s]*\|[\s\S]*?(?=\n\n|\n(?=[#|`])|$)/gi, "");

  // 2. Extract Cross-Product Summary Table
  let crossProductSummaryRaw: string | null = null;
  const crossProductMatch = cleanContent.match(/##\s+Cross-product Summary([\s\S]*?)(?=##\s+\d+\.|$)/i);
  if (crossProductMatch) {
    crossProductSummaryRaw = crossProductMatch[1]
      .split("\n")
      .filter((line) => !/^[-*_\s]{3,}$/.test(line.trim()))
      .join("\n")
      .trim();
  }

  // 3. Extract Logs (Date Log & Edit Log)
  const dateLog: string[] = [];
  const editLog: { date: string; section: string; change: string }[] = [];
  const logsMatch = cleanContent.match(/###\s+Logs([\s\S]*?)(?=##\s+Cross-product Summary|##\s+\d+\.|$)/i);
  if (logsMatch) {
    const logsText = logsMatch[1];
    
    // Parse Date Log bullet items
    const dateLogMatch = logsText.match(/####\s+Date Log([\s\S]*?)(?=####\s+Edit Log|$)/i);
    if (dateLogMatch) {
      const bulletLines = dateLogMatch[1].split("\n").filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "));
      bulletLines.forEach((line) => {
        dateLog.push(line.trim().replace(/^[-*]\s+/, ""));
      });
    }

    // Parse Edit Log table
    const editLogMatch = logsText.match(/####\s+Edit Log([\s\S]*?)$/i);
    if (editLogMatch) {
      const tableLines = editLogMatch[1].split("\n").filter((l) => l.trim().startsWith("|"));
      if (tableLines.length >= 3) {
        // Skip header and separator
        for (let rowIdx = 2; rowIdx < tableLines.length; rowIdx++) {
          const cells = tableLines[rowIdx].split("|").slice(1, -1).map((c) => c.trim());
          if (cells.length >= 3) {
            editLog.push({
              date: cells[0],
              section: cells[1],
              change: cells[2],
            });
          }
        }
      }
    }
  }

  // 4. Parse Sections (Section 1, 2, 3)
  const sectionHeaderRegex = /^##\s+(\d+)\.\s+([^\n]+)$/gm;
  const sectionMatches: { number: number; title: string; index: number; fullMatch: string }[] = [];
  let secMatch;
  while ((secMatch = sectionHeaderRegex.exec(cleanContent)) !== null) {
    sectionMatches.push({
      number: parseInt(secMatch[1], 10),
      title: secMatch[2].trim(),
      index: secMatch.index,
      fullMatch: secMatch[0],
    });
  }

  const sections: PrdSection[] = [];

  for (let i = 0; i < sectionMatches.length; i++) {
    const current = sectionMatches[i];
    const startIndex = current.index;
    const endIndex = i < sectionMatches.length - 1 ? sectionMatches[i + 1].index : cleanContent.length;
    let sectionBody = cleanContent.substring(startIndex, endIndex).trim();

    // Remove any trailing or leading horizontal rule dashes (---)
    sectionBody = sectionBody
      .split("\n")
      .filter((line) => !/^[-*_\s]{3,}$/.test(line.trim()))
      .join("\n")
      .trim();

    const slug = `section-${current.number}`;

    // Section 2: Parse individual features (F-1, F-2, ...) and their 5 parts
    let features: FeatureItem[] | undefined = undefined;
    if (current.number === 2) {
      features = [];
      const featureHeaderRegex = /^###\s+(F-\d+)[\s:]*([^\n]+)$/gm;
      const featMatches: { id: string; title: string; index: number; fullMatch: string }[] = [];
      let fMatch;
      while ((fMatch = featureHeaderRegex.exec(sectionBody)) !== null) {
        featMatches.push({
          id: fMatch[1].trim(),
          title: fMatch[2].trim(),
          index: fMatch.index,
          fullMatch: fMatch[0],
        });
      }

      for (let fIdx = 0; fIdx < featMatches.length; fIdx++) {
        const curFeat = featMatches[fIdx];
        const fStart = curFeat.index;
        const fEnd = fIdx < featMatches.length - 1 ? featMatches[fIdx + 1].index : sectionBody.length;
        const featBody = sectionBody.substring(fStart, fEnd).trim();
        const featSlug = curFeat.id.toLowerCase();

        // Parse the 5 parts
        const parts: FeaturePart[] = [
          { number: 1, title: "What it does", slug: `${featSlug}-what-it-does` },
          { number: 2, title: "What it includes", slug: `${featSlug}-what-it-includes` },
          { number: 3, title: "Worked example", slug: `${featSlug}-worked-example` },
          { number: 4, title: "Jobs to be done", slug: `${featSlug}-jobs-to-be-done` },
          { number: 5, title: "Acceptance criteria", slug: `${featSlug}-acceptance-criteria` },
        ];

        features.push({
          id: curFeat.id,
          title: curFeat.title,
          slug: featSlug,
          parts,
          rawMarkdown: featBody,
        });
      }
    }

    // Section 3: Parse sub-sections (3.1 Feature Request Summary, 3.2 Jobs to be Done)
    let subSections: SubSection[] | undefined = undefined;
    if (current.number === 3) {
      subSections = [];
      const subRegex = /^###\s+(\d+\.\d+)[\s:]*([^\n]+)$/gm;
      let sMatch;
      const sMatches: { num: string; title: string; index: number }[] = [];
      while ((sMatch = subRegex.exec(sectionBody)) !== null) {
        sMatches.push({
          num: sMatch[1].trim(),
          title: sMatch[2].trim(),
          index: sMatch.index,
        });
      }

      for (let sIdx = 0; sIdx < sMatches.length; sIdx++) {
        const curSub = sMatches[sIdx];
        const sStart = curSub.index;
        const sEnd = sIdx < sMatches.length - 1 ? sMatches[sIdx + 1].index : sectionBody.length;
        const subBody = sectionBody.substring(sStart, sEnd).trim();
        const subSlug = `section-${curSub.num.replace(".", "-")}`;

        subSections.push({
          number: curSub.num,
          title: curSub.title,
          slug: subSlug,
          rawMarkdown: subBody,
        });
      }
    }

    sections.push({
      number: current.number,
      title: current.title,
      slug,
      rawMarkdown: sectionBody,
      features,
      subSections,
    });
  }

  return {
    title: frontmatter.title || `${product} ${moduleName} PRD`,
    product,
    module: moduleName,
    channel: channelName || frontmatter.channel,
    status: frontmatter.status || "In Review",
    created_date: frontmatter.created_date || "2026-11-10",
    last_updated: frontmatter.last_updated || "2026-11-10",
    headerTableRaw: "",
    crossProductSummaryRaw,
    dateLog,
    editLog,
    sections,
    rawFullMarkdown: content,
  };
}

export function hasPrd(product: "client" | "admin" | "companion", moduleName: string, channelName?: string): boolean {
  return getPrdPath(product, moduleName, channelName) !== null;
}
