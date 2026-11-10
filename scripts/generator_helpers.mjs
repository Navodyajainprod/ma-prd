import fs from "fs";
import path from "path";

// Helper to write a complete markdown PRD
function formatPrd(spec) {
  const channelMeta = spec.channel ? `\n| Channel | ${spec.channel.toUpperCase()} |` : "";
  const channelFrontmatter = spec.channel ? `channel: "${spec.channel}"\n` : "";
  
  let crossProductSection = "";
  if (spec.crossProduct) {
    crossProductSection = `
## Cross-product Summary

| Related product | Feature / change | How it shows up in this product | Link |
| :--- | :--- | :--- | :--- |
| ${spec.crossProduct.related} | ${spec.crossProduct.change} | ${spec.crossProduct.description} | [View in ${spec.crossProduct.related}](${spec.crossProduct.link}) |
`;
  }

  let featuresContent = "";
  spec.features.forEach((f) => {
    featuresContent += `
### ${f.id}: ${f.name}
#### 1. What it does
${f.whatItDoes}

#### 2. What it includes
| Item | Type | What it does | Notes |
| :--- | :--- | :--- | :--- |
${f.includes.map(([item, type, desc, notes]) => `| ${item} | ${type} | ${desc} | ${notes} |`).join("\n")}

#### 3. Worked example
| # | Situation | What the user does | Result |
| :--- | :--- | :--- | :--- |
${f.examples.map(([sit, action, res], idx) => `| ${idx + 1} | ${sit} | ${action} | **${res}** |`).join("\n")}

#### 4. Jobs to be done
| # | User | Job to be done |
| :--- | :--- | :--- |
${f.jobs.map(([id, user, job]) => `| ${id} | ${user} | ${job} |`).join("\n")}

#### 5. Acceptance criteria
| # | Criteria |
| :--- | :--- |
${f.criteria.map(([id, crit]) => `| ${id} | ${crit} |`).join("\n")}
`;
  });

  const summaryRows = spec.features.map((f) => {
    const subList = f.includes.map((i) => i[0].split(":")[0]).join(", ");
    return `| ${f.id} | ${f.name} | ${subList} | ${f.whatItDoes.split(".")[0]}. |`;
  }).join("\n");

  const jobsRows = spec.features.flatMap((f) => f.jobs).map((j, idx) => {
    return `| ${idx + 1} | ${j[1]} | ${j[2]} | ${j[0].split("-")[0]}-${j[0].split("-")[1]} |`;
  }).join("\n");

  return `---
title: "${spec.title}"
product: "${spec.product}"
module: "${spec.module}"
${channelFrontmatter}status: "In Review"
created_date: "2026-11-10"
last_updated: "2026-11-10"
---

| Product | ${spec.product.replace("-", " ").toUpperCase()} |
| Module | ${spec.module.toUpperCase()} |${channelMeta}
| Status | In Review |
| Created | 2026-11-10 |
| Last updated | 2026-11-10 |
${crossProductSection}
## 1. Module Summary
- ${spec.summary}
- Documented directly from MantraAssist figma codebase specifications (src/app/pages, components, and hooks).
- Supports real-time clinical workflows, automated logging, and seamless cross-product synchronization.

## 2. Feature Requests
${featuresContent}
## 3. Comprehensive Summary

### 3.1 Feature Request Summary
| ID | Feature | Sub-features | One-line summary |
| :--- | :--- | :--- | :--- |
${summaryRows}

### 3.2 Jobs to be Done
| # | User | Job to be done | Feature(s) |
| :--- | :--- | :--- | :--- |
${jobsRows}
`;
}

function savePrd(destPath, content) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(destPath, content, "utf-8");
  console.log(`Saved: ${destPath}`);
}

export { formatPrd, savePrd };

