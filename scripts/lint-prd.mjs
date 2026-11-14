// Lint for the as-built PRD template (v2).
// Usage: node scripts/lint-prd.mjs [file ...]      (default: every .md under content/)
// Exit code 1 when any file has an error. No dependencies.
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const DECISIONS = path.join(ROOT, "analysis", "decisions.md");

const FRONTMATTER_KEYS = ["title", "product", "module", "route", "status", "build_status", "created_date", "last_updated"];
const PRODUCTS = ["client", "admin", "companion", "ai-receptionist", "reference"];
const BUILD_STATUSES = ["Works", "Partly simulated", "Simulated", "Not built"];
const PERSONAS = [
  "Physician", "Care Coordinator", "Front-desk Staff", "Billing Specialist",
  "Practice Admin", "Practice Manager", "Patient", "Platform Admin",
];
const REF_KEYS = ["title", "product", "module", "channel", "status", "created_date", "last_updated"];
const HEADER_ROWS = ["Product", "Module", "Route", "Status", "Build status", "Created", "Last updated"];
const GLANCE_LABELS = ["What it is", "Who uses it", "Where you start it", "Where the result goes", "How real is it"];
const SECTIONS = [
  { n: 1, title: /^1\. Module Summary$/ },
  { n: 2, title: /^2\. Feature Requests$/ },
  { n: 3, title: /^3\. Comprehensive Summary$/ },
  { n: 4, title: /^4\. Roles and access/ },
  { n: 5, title: /^5\. Metrics and definitions$/ },
  { n: 6, title: /^6\. Cross-module journeys/ },
  { n: 7, title: /^7\. Open decisions$/ },
  { n: 8, title: /^8\. Change log$/ },
];
const PARTS = ["What it does", "What it includes", "Worked example", "Jobs to be done", "Acceptance criteria"];
const INCLUDES_HEADER = ["Item", "Type", "What it does (as built)", "Status", "Notes"];
const SUMMARY_HEADER = ["ID", "Feature", "Sub-features", "Build status", "One-line summary"];
const JOBS_SUMMARY_HEADER = ["#", "User", "Job to be done", "Feature(s)"];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith(".md")) out.push(full);
  }
  return out;
}

function loadDecisionIds() {
  if (!fs.existsSync(DECISIONS)) return new Set();
  const ids = new Set();
  for (const line of fs.readFileSync(DECISIONS, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\| (D-\d+) \|/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

function parseTables(lines) {
  // returns [{ header, rows, line }] for every Markdown table with a separator row
  const tables = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith("|") && i + 1 < lines.length && /^\|[\s:\-|]+\|\s*$/.test(lines[i + 1].trim())) {
      const header = cells(lines[i]);
      const rows = [];
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        rows.push({ cells: cells(lines[j]), raw: lines[j], line: j + 1 });
        j++;
      }
      tables.push({ header, rows, line: i + 1, headerRaw: lines[i] });
      i = j;
    } else i++;
  }
  return tables;
}

function cells(line) {
  return line.trim().split("|").slice(1, -1).map((c) => c.trim());
}

function linkExists(href) {
  const parts = href.replace(/^\//, "").split("/");
  const [product, mod, tab] = parts;
  if (!product || !mod) return false;
  const c = (...p) => fs.existsSync(path.join(CONTENT, ...p));
  if (mod === "reference") return tab ? c("reference", `${tab}.md`) : fs.existsSync(path.join(CONTENT, "reference"));
  if (tab) return c(product, mod, `${tab}.md`) || c(product, `${mod}-${tab}.md`) || c(product, `${tab}.md`);
  if (c(product, `${mod}.md`) || c(product, mod, `${mod}.md`) || c(product, mod, "prd.md") || c(product, mod, "chat.md")) return true;
  const dir = path.join(CONTENT, product, mod);
  return fs.existsSync(dir) && fs.readdirSync(dir).some((f) => f.endsWith(".md"));
}

function expandRange(text) {
  // "F-1.1 – F-1.7" or "F-1.1, F-1.2, F-1.3" -> list of ids
  const ids = text.match(/F-\d+\.\d+/g) || [];
  if (/[–-]/.test(text.replace(/F-\d+\.\d+/g, "")) && ids.length === 2) {
    const [a, b] = ids.map((s) => parseInt(s.split(".")[1], 10));
    const f = ids[0].split(".")[0];
    const out = [];
    for (let k = a; k <= b; k++) out.push(`${f}.${k}`);
    return out;
  }
  return ids;
}

function lintFile(file, decisionIds, stats) {
  const errors = [];
  const err = (msg, line) => errors.push(line ? `line ${line}: ${msg}` : msg);
  const raw = fs.readFileSync(file, "utf8");
  const text = raw.replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const isReference = rel.startsWith("content/reference/");

  // 1. frontmatter
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = {};
  if (!fm) err("missing frontmatter");
  else {
    for (const l of fm[1].split("\n")) {
      const m = l.match(/^([A-Za-z_]+):\s*(.*)$/);
      if (!m) err(`frontmatter line is not "key: value": ${l.slice(0, 40)}`);
      else meta[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
    }
    for (const k of (isReference ? REF_KEYS : FRONTMATTER_KEYS)) if (!meta[k]) err(`frontmatter key missing or empty: ${k}`);
    if (meta.product && !PRODUCTS.includes(meta.product)) err(`frontmatter product not allowed: ${meta.product}`);
    if (meta.product && meta.product !== "reference") {
      const folder = rel.split("/")[1];
      if (folder !== meta.product) err(`frontmatter product "${meta.product}" does not match folder "${folder}"`);
    }
    if (meta.build_status && !BUILD_STATUSES.includes(meta.build_status)) err(`build_status must be one of: ${BUILD_STATUSES.join(", ")}`);
    for (const k of ["created_date", "last_updated"]) if (meta[k] && !/^\d{4}-\d{2}-\d{2}$/.test(meta[k])) err(`${k} must be YYYY-MM-DD`);
  }

  if (isReference) {
    // Reference pages have no features: check tables, decision ids and links only
    for (const t of parseTables(lines)) for (const r of t.rows) if (r.cells.length !== t.header.length) err(`table row has ${r.cells.length} cells, header has ${t.header.length}`, r.line);
    for (const id of new Set(text.match(/\bD-\d+\b/g) || [])) if (!decisionIds.has(id)) err(`${id} does not exist in analysis/decisions.md`);
    for (const m of text.matchAll(/\]\((\/[^)\s]+)\)/g)) if (!linkExists(m[1])) err(`link does not resolve to a file: ${m[1]}`, text.slice(0, m.index).split("\n").length);
    return { rel, errors };
  }

  // 2. structure: header table, At a glance, Cross-product Summary, sections 1-8 in order
  const h2 = [];
  let inFence = false;
  lines.forEach((l, i) => {
    if (l.trim().startsWith("```")) inFence = !inFence;
    if (!inFence && /^## /.test(l)) h2.push({ text: l.slice(3).trim(), line: i + 1 });
  });
  const expected = ["At a glance", "Cross-product Summary", ...SECTIONS.map((s) => s.title)];
  const found = h2.map((h) => h.text);
  let cursor = -1;
  const matchers = [(t) => t === "At a glance", (t) => t === "Cross-product Summary", ...SECTIONS.map((s) => (t) => s.title.test(t))];
  const labels = ["## At a glance", "## Cross-product Summary", ...SECTIONS.map((s) => `## ${s.n}. ...`)];
  matchers.forEach((match, idx) => {
    const at = found.findIndex((t) => match(t));
    if (at === -1) err(`missing section: ${labels[idx]}`);
    else {
      if (at < cursor) err(`section out of order: ${labels[idx]}`, h2[at].line);
      cursor = Math.max(cursor, at);
    }
  });
  if (found.length > expected.length) err(`unexpected extra ## heading(s): ${found.filter((t) => !matchers.some((m) => m(t))).join(" | ")}`);

  const tables = parseTables(lines);

  // header table
  const headerRowsFound = lines.filter((l) => /^\| (Product|Module|Route|Status|Build status|Created|Last updated) \|/.test(l)).map((l) => cells(l)[0]);
  for (const r of HEADER_ROWS) if (!headerRowsFound.includes(r)) err(`header table row missing: ${r}`);

  // At a glance
  const glanceStart = h2.find((h) => h.text === "At a glance");
  if (glanceStart) {
    const nextH = h2.find((h) => h.line > glanceStart.line);
    const glanceText = lines.slice(glanceStart.line, nextH ? nextH.line - 1 : lines.length).join("\n");
    for (const lab of GLANCE_LABELS) if (!glanceText.includes(`**${lab}**`)) err(`At a glance row missing: ${lab}`);
    if (!/Build-status legend/.test(glanceText)) err("At a glance: legend heading missing");
    for (const mk of ["● Works", "◐ Simulated", "○ Not built"]) if (!glanceText.includes(mk)) err(`At a glance legend missing: ${mk}`);
  }

  // table column counts
  for (const t of tables) {
    for (const r of t.rows) if (r.cells.length !== t.header.length) err(`table row has ${r.cells.length} cells, header has ${t.header.length}`, r.line);
  }

  // 3. features
  const sec2 = h2.find((h) => /^2\. Feature Requests/.test(h.text));
  const sec3 = h2.find((h) => /^3\. Comprehensive Summary/.test(h.text));
  const featStart = sec2 ? sec2.line : 0;
  const featEnd = sec3 ? sec3.line - 1 : lines.length;
  const featLines = lines.slice(featStart, featEnd);
  const featHeads = [];
  featLines.forEach((l, i) => {
    const m = l.match(/^### F-(\d+): (.+)$/);
    if (m) featHeads.push({ n: parseInt(m[1], 10), title: m[2], idx: i });
  });
  const features = [];
  featHeads.forEach((fh, k) => {
    const end = k + 1 < featHeads.length ? featHeads[k + 1].idx : featLines.length;
    const body = featLines.slice(fh.idx, end);
    const startLine = featStart + fh.idx + 1;
    if (fh.n !== k + 1) err(`feature ids must be sequential: found F-${fh.n}, expected F-${k + 1}`, startLine);
    // parts
    const partHeads = body.map((l, i) => ({ l, i })).filter((x) => /^#### \d+\. /.test(x.l));
    const partTitles = partHeads.map((x) => x.l.replace(/^#### \d+\. /, "").trim());
    PARTS.forEach((p, idx) => {
      if (partTitles[idx] !== p) err(`F-${fh.n}: part ${idx + 1} must be "#### ${idx + 1}. ${p}"`, startLine);
    });
    const feature = { n: fh.n, items: [], jobs: [], criteria: [], jobUsers: [] };
    // tables inside the feature
    const ftables = parseTables(body).map((t) => ({ ...t, line: t.line + startLine - 1 }));
    // what it includes
    const inc = ftables.find((t) => t.header[0] === "Item");
    if (!inc) err(`F-${fh.n}: "What it includes" table missing`, startLine);
    else {
      if (inc.header.join("|") !== INCLUDES_HEADER.join("|")) err(`F-${fh.n}: includes header must be: ${INCLUDES_HEADER.join(" | ")}`, inc.line);
      let expectM = 1;
      for (const r of inc.rows) {
        const c = r.cells;
        const id = (c[0] || "").match(/^F-(\d+)\.(\d+):/);
        if (!id) err(`F-${fh.n}: item must start "F-${fh.n}.m:"`, r.line);
        else {
          if (parseInt(id[1], 10) !== fh.n) err(`item id ${id[0]} belongs to a different feature`, r.line);
          if (parseInt(id[2], 10) !== expectM) err(`item ids must be sequential: found ${id[0]}, expected F-${fh.n}.${expectM}`, r.line);
          feature.items.push(`F-${fh.n}.${id[2]}`);
          expectM++;
        }
        const st = c[3] || "";
        const mark = st.match(/^(●|◐|○) (Works|Simulated|Not built)$/);
        if (!mark) err(`item ${c[0] ? c[0].split(":")[0] : "?"}: Status must be "● Works", "◐ Simulated" or "○ Not built"`, r.line);
        else {
          stats.rows[mark[1]]++;
          stats.total++;
          if ((mark[1] === "●" && mark[2] !== "Works") || (mark[1] === "◐" && mark[2] !== "Simulated") || (mark[1] === "○" && mark[2] !== "Not built")) err("status mark and word disagree", r.line);
        }
      }
    }
    // jobs
    const jobs = ftables.find((t) => t.header[0] === "#" && t.header[1] === "User");
    if (!jobs) err(`F-${fh.n}: "Jobs to be done" table missing`, startLine);
    else {
      let expectJ = 1;
      for (const r of jobs.rows) {
        const id = (r.cells[0] || "").match(/^F-(\d+)-J(\d+)$/);
        if (!id || parseInt(id[1], 10) !== fh.n) err(`job id must be F-${fh.n}-Jm`, r.line);
        else {
          if (parseInt(id[2], 10) !== expectJ) err(`job ids must be sequential: found ${r.cells[0]}, expected F-${fh.n}-J${expectJ}`, r.line);
          expectJ++;
        }
        feature.jobs.push(r.cells[0]);
        feature.jobUsers.push(r.cells[1]);
        if (!PERSONAS.includes(r.cells[1])) err(`persona "${r.cells[1]}" is not in the standard list`, r.line);
        if (!/^.+, I want .+, so that .+$/.test(r.cells[2] || "")) err(`job must read "<When/During/After ...>, I want ..., so that ..."`, r.line);
      }
    }
    // acceptance criteria
    const ac = ftables.find((t) => t.header[0] === "#" && t.header[1] === "Criteria");
    if (!ac) err(`F-${fh.n}: "Acceptance criteria" table missing`, startLine);
    else {
      let expectA = 1;
      for (const r of ac.rows) {
        const id = (r.cells[0] || "").match(/^F-(\d+)-(\d+)$/);
        if (!id || parseInt(id[1], 10) !== fh.n) err(`criterion id must be F-${fh.n}-m (no AC prefix)`, r.line);
        else {
          if (parseInt(id[2], 10) !== expectA) err(`criterion ids must be sequential: found ${r.cells[0]}, expected F-${fh.n}-${expectA}`, r.line);
          expectA++;
        }
        feature.criteria.push(r.cells[0]);
        if (!/\*\*Given\*\*.*\*\*then\*\*|\*\*Given\*\*.*then/i.test(r.cells[1] || "")) err("criterion must be written Given / when / then", r.line);
      }
    }
    const example = ftables.find((t) => t.header[0] === "#" && t.header[1] === "Situation");
    if (!example) err(`F-${fh.n}: "Worked example" table missing`, startLine);
    else for (const r of example.rows) if (!/\*\*.+\*\*/.test(r.cells[3] || "")) err("worked example result must be bold", r.line);
    features.push(feature);
    stats.features++;
  });
  if (features.length === 0) err("no features found");

  // 3.1 and 3.2 roll-ups
  const sum1 = tables.find((t) => t.header.join("|") === SUMMARY_HEADER.join("|"));
  if (!sum1) err(`3.1 table missing; header must be: ${SUMMARY_HEADER.join(" | ")}`);
  else {
    if (sum1.rows.length !== features.length) err(`3.1 has ${sum1.rows.length} rows but the file has ${features.length} features`, sum1.line);
    sum1.rows.forEach((r, idx) => {
      const f = features[idx];
      if (!f) return;
      if (r.cells[0] !== `F-${f.n}`) err(`3.1 row ${idx + 1} must be F-${f.n}`, r.line);
      const listed = expandRange(r.cells[2]);
      const want = f.items;
      if (listed.join(",") !== want.join(",")) err(`3.1 ${r.cells[0]}: sub-features "${r.cells[2]}" do not match the feature's items (${f.items[0] || "none"} to ${f.items[f.items.length - 1] || "none"})`, r.line);
      if (!/[●◐○]/.test(r.cells[3] || "")) err(`3.1 ${r.cells[0]}: Build status needs a mark`, r.line);
    });
  }
  const sum2 = tables.find((t) => t.header.join("|") === JOBS_SUMMARY_HEADER.join("|"));
  if (!sum2) err(`3.2 table missing; header must be: ${JOBS_SUMMARY_HEADER.join(" | ")}`);
  else {
    const allJobs = features.flatMap((f) => f.jobs.map((j, i) => ({ f: f.n, id: j, user: f.jobUsers[i] })));
    if (sum2.rows.length !== allJobs.length) err(`3.2 has ${sum2.rows.length} rows but the file has ${allJobs.length} jobs`, sum2.line);
    sum2.rows.forEach((r, idx) => {
      const j = allJobs[idx];
      if (!j) return;
      if (r.cells[0] !== String(idx + 1)) err(`3.2 row numbers must be sequential (expected ${idx + 1})`, r.line);
      if (r.cells[1] !== j.user) err(`3.2 row ${idx + 1}: user "${r.cells[1]}" differs from the job's user "${j.user}"`, r.line);
      if (r.cells[3] !== `F-${j.f}`) err(`3.2 row ${idx + 1}: Feature(s) must be F-${j.f}`, r.line);
    });
  }

  // 4. Decisions
  const decisionMentions = [...text.matchAll(/Decision needed[^|\n]*/g)];
  for (const m of decisionMentions) {
    const ids = m[0].match(/D-\d+/g);
    const lineNo = text.slice(0, m.index).split("\n").length;
    if (!ids) err('"Decision needed" without a D-id', lineNo);
  }
  const usedIds = new Set(text.match(/\bD-\d+\b/g) || []);
  for (const id of usedIds) if (!decisionIds.has(id)) err(`${id} does not exist in analysis/decisions.md`);
  const sec7 = tables.find((t) => t.header[0] === "ID" && t.header[1] === "Decision");
  if (!sec7) err('section 7 table (ID | Decision | Affects) missing');
  else {
    const listed = new Set(sec7.rows.map((r) => r.cells[0]));
    const inFeatures = new Set((featLines.join("\n").match(/\bD-\d+\b/g)) || []);
    for (const id of inFeatures) if (!listed.has(id)) err(`${id} is used in a feature but missing from section 7`);
    for (const r of sec7.rows) if (!/^D-\d+$/.test(r.cells[0])) err(`section 7 id must be D-nn`, r.line);
  }

  // 5. links
  for (const m of text.matchAll(/\]\((\/[^)\s]+)\)/g)) {
    const href = m[1];
    if (!linkExists(href)) err(`link does not resolve to a file: ${href}`, text.slice(0, m.index).split("\n").length);
  }

  // 6. change log
  const log = tables.find((t) => t.header[0] === "Date" && t.header[1] === "Change");
  if (!log || log.rows.length === 0) err("section 8 change log table (Date | Change) missing or empty");
  else {
    for (const r of log.rows) if (!/^\d{4}-\d{2}-\d{2}$/.test(r.cells[0])) err(`change log date must be YYYY-MM-DD`, r.line);
    const newest = log.rows.map((r) => r.cells[0]).sort().pop();
    if (meta.last_updated && newest !== meta.last_updated) err(`last_updated (${meta.last_updated}) must equal the newest change-log date (${newest})`);
  }

  return { rel, errors };
}

const args = process.argv.slice(2);
const files = (args.length ? args.map((a) => path.resolve(a)) : walk(CONTENT)).sort();
const decisionIds = loadDecisionIds();
if (decisionIds.size === 0) console.warn("warning: analysis/decisions.md not found or has no D-ids; decision checks will fail");
const stats = { files: 0, features: 0, total: 0, rows: { "●": 0, "◐": 0, "○": 0 } };
let failed = 0;
let linted = 0;
for (const f of files) {
  const head = fs.readFileSync(f, "utf8").slice(0, 400);
  const res = lintFile(f, decisionIds, stats);
  linted++;
  stats.files++;
  if (res.errors.length) {
    failed++;
    console.log(`\n${res.rel}  (${res.errors.length} problem${res.errors.length > 1 ? "s" : ""})`);
    res.errors.slice(0, 40).forEach((e) => console.log(`  - ${e}`));
    if (res.errors.length > 40) console.log(`  ... and ${res.errors.length - 40} more`);
  }
}
console.log(`\n${linted} files checked, ${failed} with problems, ${linted - failed} clean.`);
console.log(`features: ${stats.features}; rows by status: ● ${stats.rows["●"]}  ◐ ${stats.rows["◐"]}  ○ ${stats.rows["○"]}  (total ${stats.total})`);
process.exit(failed ? 1 : 0);
