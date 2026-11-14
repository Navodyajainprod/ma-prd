// Generates content/reference/open-decisions.md from analysis/decisions.md.
// For each decision it lists the PRD pages whose "7. Open decisions" table (or Decision needed notes) mention it.
// Usage: node scripts/build-decisions-page.mjs
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const DECISIONS = path.join(ROOT, "analysis", "decisions.md");
const OUT = path.join(CONTENT, "reference", "open-decisions.md");
const TODAY = "2026-11-14";

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith(".md")) out.push(full);
  }
  return out;
}

// 1. which pages mention which decision
const pages = {};
for (const f of walk(CONTENT)) {
  const rel = path.relative(CONTENT, f).replace(/\\/g, "/");
  if (rel.startsWith("reference/")) continue;
  const text = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  const title = (text.match(/^title:\s*"(.*)"$/m) || [])[1] || rel;
  const url = "/" + rel.replace(/\.md$/, "");
  for (const id of new Set(text.match(/\bD-\d+\b/g) || [])) {
    (pages[id] = pages[id] || []).push({ title: title.replace(/[|\[\]]/g, " "), url });
  }
}

// 2. decisions by theme
const lines = fs.readFileSync(DECISIONS, "utf8").replace(/\r\n/g, "\n").split("\n");
const themes = [];
let current = null;
for (const l of lines) {
  const h = l.match(/^## (\d+)\. (.+)$/);
  if (h) { current = { n: parseInt(h[1], 10), title: h[2].trim(), rows: [] }; themes.push(current); continue; }
  if (/^## /.test(l)) { current = null; continue; }
  const r = l.match(/^\| (D-\d+) \| (.*) \|$/);
  if (r && current) {
    const cells = l.trim().split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length >= 6) current.rows.push({ id: cells[0], question: cells[1], why: cells[2], priority: cells[5] });
  }
}

const total = themes.reduce((a, t) => a + t.rows.length, 0);
const byPriority = { P0: 0, P1: 0, P2: 0 };
themes.forEach((t) => t.rows.forEach((r) => { if (byPriority[r.priority] !== undefined) byPriority[r.priority]++; }));

const pageCell = (id) => {
  const list = pages[id];
  if (!list || list.length === 0) return "No page raises it yet";
  const seen = new Set();
  return list.filter((p) => !seen.has(p.url) && seen.add(p.url)).sort((a, b) => a.url.localeCompare(b.url)).map((p) => `[${p.title}](${p.url})`).join(", ");
};

const out = [];
out.push("---", 'title: "Open decisions"', 'product: "reference"', 'module: "reference"', 'channel: "open-decisions"', 'status: "In Review"', 'created_date: "2026-11-14"', `last_updated: "${TODAY}"`, "---", "");
out.push("| Product | REFERENCE |", "| Module | OPEN DECISIONS |", "| Status | In Review |", "| Generated | by `scripts/build-decisions-page.mjs` from `analysis/decisions.md` and the decision notes in every PRD page |", `| Last updated | ${TODAY} |`, "");
out.push("## 1. How to read this page", "");
out.push(`The PRD describes the prototype as built. Where the intended behaviour is not decided, the page says "Decision needed" and points here. There are **${total} open decisions**: ${byPriority.P0} at P0, ${byPriority.P1} at P1 and ${byPriority.P2} at P2. None is answered in the PRD.`, "");
out.push("| Priority | Meaning |", "| :--- | :--- |", "| P0 | Blocks the PRD, or is a security, compliance, safety or revenue risk. |", "| P1 | Needed for the PRD to be accurate. |", "| P2 | Detail. |", "");
let n = 2;
for (const pr of ["P0", "P1", "P2"]) {
  out.push(`## ${n}. ${pr} decisions (${byPriority[pr]})`, "");
  for (const t of themes) {
    const rows = t.rows.filter((r) => r.priority === pr).sort((a, b) => parseInt(a.id.slice(2), 10) - parseInt(b.id.slice(2), 10));
    if (rows.length === 0) continue;
    out.push(`### ${t.title}`, "");
    out.push("| ID | Decision | Why it matters | PRD pages that raise it |", "| :--- | :--- | :--- | :--- |");
    for (const r of rows) out.push(`| ${r.id} | ${r.question} | ${r.why} | ${pageCell(r.id)} |`);
    out.push("");
  }
  n++;
}
out.push(`## ${n}. Change log`, "", "| Date | Change |", "| :--- | :--- |", `| ${TODAY} | Generated from the decision register and the decision notes in every PRD page. |`, "");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out.join("\r\n"));
const unreferenced = themes.flatMap((t) => t.rows).filter((r) => !pages[r.id]).length;
console.log(`wrote ${path.relative(ROOT, OUT)}: ${total} decisions (P0 ${byPriority.P0}, P1 ${byPriority.P1}, P2 ${byPriority.P2}); ${unreferenced} not yet raised by any page`);
