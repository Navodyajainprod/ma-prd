// Generates content/reference/build-status.md: module x count of ● / ◐ / ○ rows.
// Usage: node scripts/build-status-board.mjs
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const OUT = path.join(CONTENT, "reference", "build-status.md");
const PRODUCT_ORDER = ["client", "admin", "companion", "ai-receptionist"];
const PRODUCT_LABEL = { client: "Client", admin: "Admin", companion: "Companion", "ai-receptionist": "AI Receptionist" };
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

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = {};
  if (m) for (const l of m[1].split("\n")) {
    const kv = l.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
  }
  return meta;
}

function countRows(text) {
  const counts = { "●": 0, "◐": 0, "○": 0 };
  let features = 0;
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length) {
    if (/^### F-\d+: /.test(lines[i])) features++;
    if (lines[i].trim().startsWith("|") && i + 1 < lines.length && /^\|[\s:\-|]+\|\s*$/.test(lines[i + 1].trim())) {
      const header = lines[i].trim().split("|").slice(1, -1).map((c) => c.trim());
      const col = header.indexOf("Status");
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        if (col >= 0 && header[0] === "Item") {
          const cell = lines[j].trim().split("|").slice(1, -1).map((c) => c.trim())[col] || "";
          const mk = cell.match(/^(●|◐|○)/);
          if (mk) counts[mk[1]]++;
        }
        j++;
      }
      i = j;
    } else i++;
  }
  return { counts, features };
}

const BADGE = {
  "Works": "● Works",
  "Partly simulated": "◐ Partly simulated",
  "Simulated": "◐ Simulated",
  "Not built": "○ Not built",
};

const files = walk(CONTENT).filter((f) => !f.startsWith(path.join(CONTENT, "reference")));
const byProduct = Object.fromEntries(PRODUCT_ORDER.map((p) => [p, []]));
for (const f of files) {
  const text = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  const meta = frontmatter(text);
  const rel = path.relative(CONTENT, f).replace(/\\/g, "/");
  const product = rel.split("/")[0];
  if (!byProduct[product]) continue;
  const { counts, features } = countRows(text);
  byProduct[product].push({ rel, title: meta.title || rel, build: meta.build_status || "", features, counts });
}

const sum = (rows) => rows.reduce((a, r) => ({
  files: a.files + 1, features: a.features + r.features,
  w: a.w + r.counts["●"], s: a.s + r.counts["◐"], n: a.n + r.counts["○"],
}), { files: 0, features: 0, w: 0, s: 0, n: 0 });

const all = PRODUCT_ORDER.flatMap((p) => byProduct[p]);
const total = sum(all);
const pct = (a, t) => (t === 0 ? "0%" : `${Math.round((100 * a) / t)}%`);
const rowsOf = (t) => t.w + t.s + t.n;

const out = [];
out.push("---");
out.push('title: "Build status board"');
out.push('product: "reference"');
out.push('module: "reference"');
out.push('channel: "build-status"');
out.push('status: "In Review"');
out.push('created_date: "2026-11-14"');
out.push(`last_updated: "${TODAY}"`);
out.push("---", "");
out.push("| Product | REFERENCE |", "| Module | BUILD STATUS BOARD |", "| Status | In Review |", "| Generated | by `scripts/build-status-board.mjs` from the status marks in every PRD page |", `| Last updated | ${TODAY} |`, "");
out.push("## 1. How to read this board", "");
out.push("Every row in a feature's \"What it includes\" table carries one mark. This board counts those rows for each page.", "");
out.push("| Mark | Meaning |", "| :--- | :--- |", "| ● Works | Behaves as described in the prototype. |", "| ◐ Simulated | Looks live on screen but uses preset or placeholder data, or only shows a confirmation. |", "| ○ Not built | Described so the intent is not lost. Nothing happens in the prototype. |", "");
out.push("The page's overall build status is set by the page itself: **Works** if at least 80% of rows are ●; **Not built** if at least 80% are ○; **Simulated** if at most 20% are ● and ○ is not the majority; otherwise **Partly simulated**.", "");
out.push("## 2. Totals by product", "");
out.push("| Product | Pages | Features | Rows | ● Works | ◐ Simulated | ○ Not built | Share working |", "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |");
for (const p of PRODUCT_ORDER) {
  const t = sum(byProduct[p]);
  out.push(`| ${PRODUCT_LABEL[p]} | ${t.files} | ${t.features} | ${rowsOf(t)} | ${t.w} | ${t.s} | ${t.n} | ${pct(t.w, rowsOf(t))} |`);
}
out.push(`| **All products** | ${total.files} | ${total.features} | ${rowsOf(total)} | ${total.w} | ${total.s} | ${total.n} | ${pct(total.w, rowsOf(total))} |`, "");
let n = 3;
for (const p of PRODUCT_ORDER) {
  out.push(`## ${n}. ${PRODUCT_LABEL[p]}`, "");
  out.push("| Page | File | Build status | Features | Works rows | Simulated rows | Not built rows |", "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |");
  for (const r of byProduct[p].sort((a, b) => a.rel.localeCompare(b.rel))) {
    out.push(`| ${r.title.replace(/\|/g, "/")} | \`${r.rel}\` | ${BADGE[r.build] || r.build || "unset"} | ${r.features} | ${r.counts["●"]} | ${r.counts["◐"]} | ${r.counts["○"]} |`);
  }
  out.push("");
  n++;
}
out.push(`## ${n}. Change log`, "", "| Date | Change |", "| :--- | :--- |", `| ${TODAY} | Generated from the status marks in every PRD page. |`, "");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out.join("\r\n"));
console.log(`wrote ${path.relative(ROOT, OUT)}: ${total.files} pages, ${total.features} features, ● ${total.w}  ◐ ${total.s}  ○ ${total.n}`);
