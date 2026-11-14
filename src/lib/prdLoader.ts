import fs from "fs";
import path from "path";
import { ProductId } from "./modulesConfig";

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
  product: ProductId;
  module: string;
  channel?: string;
  status: string;
  route?: string;
  buildStatus?: string;
  created_date: string;
  last_updated: string;
  headerTableRaw: string;
  atAGlanceRaw: string | null;
  statusCounts: StatusCounts;
  changeLog: ChangeLogRow[];
  crossProductSummaryRaw: string | null;
  dateLog: string[];
  editLog: { date: string; section: string; change: string }[];
  sections: PrdSection[];
  rawFullMarkdown: string;
}

/** Counts of the Status marks (● Works, ◐ Simulated, ○ Not built) found in "Status" table columns of section 2. */
export interface StatusCounts {
  works: number;
  simulated: number;
  notBuilt: number;
  total: number;
}

export interface ChangeLogRow {
  date: string;
  change: string;
}

export interface ChangeLogEntry {
  date: string;
  module: string;
  section: string;
  change: string;
}

/** Same slug rule the renderer uses for part headings, so table-of-contents links match the page anchors. */
function slugifyPartTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Returns the text under a `##` heading (matched by headingRegex) up to the next `##` heading. */
function extractBlock(content: string, headingRegex: RegExp): string | null {
  const m = headingRegex.exec(content);
  if (!m) return null;
  const rest = content.slice(m.index + m[0].length);
  const next = rest.search(/^##[ \t]+/m);
  const block = (next === -1 ? rest : rest.slice(0, next))
    .split(/\r?\n/)
    .filter((line) => !/^[-*_\s]{3,}$/.test(line.trim()))
    .join("\n")
    .trim();
  return block.length > 0 ? block : null;
}

/** Splits a Markdown table row into trimmed cells. */
function tableCells(line: string): string[] {
  return line.trim().split("|").slice(1, -1).map((c) => c.trim());
}

/** Counts status marks in every table that has a "Status" column. */
function computeStatusCounts(markdown: string): StatusCounts {
  const counts: StatusCounts = { works: 0, simulated: 0, notBuilt: 0, total: 0 };
  let inTable = false;
  let rowIdx = 0;
  let statusCol = -1;

  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.startsWith("|")) {
      inTable = false;
      statusCol = -1;
      rowIdx = 0;
      continue;
    }
    const cells = tableCells(line);
    if (!inTable) {
      inTable = true;
      rowIdx = 0;
      statusCol = cells.findIndex((c) => c.replace(/\*+/g, "").trim().toLowerCase() === "status");
      continue;
    }
    rowIdx++;
    if (rowIdx === 1) continue; // separator row
    if (statusCol < 0 || statusCol >= cells.length) continue;
    const mark = cells[statusCol].match(/[●◐○]/);
    if (!mark) continue;
    if (mark[0] === "●") counts.works++;
    else if (mark[0] === "◐") counts.simulated++;
    else counts.notBuilt++;
    counts.total++;
  }
  return counts;
}

/** Reads the dated rows of the "Change log" table (first column date, remaining columns joined). */
function parseChangeLog(markdown: string): ChangeLogRow[] {
  const rows: ChangeLogRow[] = [];
  let inTable = false;
  let rowIdx = 0;
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.startsWith("|")) {
      inTable = false;
      rowIdx = 0;
      continue;
    }
    if (!inTable) {
      inTable = true;
      rowIdx = 0;
      continue; // header row
    }
    rowIdx++;
    if (rowIdx === 1) continue; // separator row
    const cells = tableCells(line);
    if (cells.length >= 2 && cells[0]) {
      rows.push({ date: cells[0], change: cells.slice(1).filter(Boolean).join(" \u00b7 ") });
    }
  }
  return rows;
}

export function getPrdPath(product: string, moduleName: string, channelName?: string): string | null {
  // The "reference" module is shared by all four products: its pages live once in content/reference/
  if (moduleName === "reference") {
    if (!channelName) return null;
    const refPath = path.join(process.cwd(), "content", "reference", `${channelName}.md`);
    return fs.existsSync(refPath) ? refPath : null;
  }

  // If specific channel / tab is requested (e.g. whatsapp, calendar, fields, scheduled)
  if (channelName) {
    const channelPaths = [
      path.join(process.cwd(), "content", product, moduleName, `${channelName}.md`),
      path.join(process.cwd(), "content", product, `${moduleName}-${channelName}.md`),
      path.join(process.cwd(), "content", product, `${channelName}.md`),
    ];
    for (const p of channelPaths) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  const possiblePaths = [
    path.join(process.cwd(), "content", product, `${moduleName}.md`),
    path.join(process.cwd(), "content", product, moduleName, `${moduleName}.md`),
    path.join(process.cwd(), "content", product, moduleName, "prd.md"),
    path.join(process.cwd(), "content", product, moduleName, "chat.md"),
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
  product: ProductId,
  moduleName: string,
  channelName?: string
): PrdDocument | null {
  const filePath = getPrdPath(product, moduleName, channelName);
  if (!filePath) return null;
  return parsePrdFile(filePath, product, moduleName, channelName);
}

function parsePrdFile(
  filePath: string,
  product: ProductId,
  moduleName: string,
  channelName?: string
): PrdDocument {
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

  // 2b. Extract the "At a glance" block (v2 template)
  const atAGlanceRaw = extractBlock(cleanContent, /^##[ \t]+At a glance[^\r\n]*\r?\n/im);

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

        // Parts are read from the `#### n. Title` headings that the feature actually contains
        const parts: FeaturePart[] = [];
        const partRegex = /^####\s+(\d+)\.\s+([^\r\n]+)$/gm;
        let partMatch;
        while ((partMatch = partRegex.exec(featBody)) !== null) {
          const partTitle = partMatch[2].trim();
          parts.push({
            number: parseInt(partMatch[1], 10),
            title: partTitle,
            slug: `${featSlug}-${slugifyPartTitle(partTitle)}`,
          });
        }

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

  const featureSection = sections.find((s) => s.number === 2);
  const statusCounts = computeStatusCounts(featureSection ? featureSection.rawMarkdown : "");
  const changeLogSection = sections.find((s) => s.number === 8);
  const changeLog = changeLogSection ? parseChangeLog(changeLogSection.rawMarkdown) : [];

  return {
    title: frontmatter.title || `${product} ${moduleName} PRD`,
    product,
    module: moduleName,
    channel: channelName || frontmatter.channel,
    status: frontmatter.status || "In Review",
    route: frontmatter.route || undefined,
    buildStatus: frontmatter.build_status || undefined,
    created_date: frontmatter.created_date || "2026-11-10",
    last_updated: frontmatter.last_updated || "2026-11-10",
    headerTableRaw: "",
    atAGlanceRaw,
    statusCounts,
    changeLog,
    crossProductSummaryRaw,
    dateLog,
    editLog,
    sections,
    rawFullMarkdown: content,
  };
}

/** Collects the "Change log" rows of every PRD file of a product, newest first. */
export function loadChangeLogs(product: ProductId): ChangeLogEntry[] {
  const root = path.join(process.cwd(), "content", product);
  const entries: ChangeLogEntry[] = [];

  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(full);
      } else if (item.name.endsWith(".md")) {
        const { data } = parseFrontmatter(fs.readFileSync(full, "utf-8"));
        const prd = parsePrdFile(full, product, data.module || path.basename(item.name, ".md"), data.channel);
        prd.changeLog.forEach((row) =>
          entries.push({ date: row.date, module: prd.title, section: "Change log", change: row.change })
        );
      }
    }
  };

  walk(root);
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function hasPrd(product: ProductId, moduleName: string, channelName?: string): boolean {
  return getPrdPath(product, moduleName, channelName) !== null;
}
