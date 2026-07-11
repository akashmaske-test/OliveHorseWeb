import path from "node:path";
import { dataRoot, ensureDirectories, now, readJson, reportsRoot, writeJson, writeText } from "./lib.js";

ensureDirectories();
const rows = readJson(path.join(dataRoot, "gsc", "latest.json"), []);
const findings = [];
for (const row of rows) {
  const confidence = row.impressions >= 100 ? "medium" : "low";
  if (row.impressions >= 20 && row.clicks === 0) findings.push({ type: "impressions_with_low_clicks", observation: `${row.query} has ${row.impressions} impressions and no clicks.`, recommendation: "Review whether the page title and visible content match the query intent.", evidence: row, confidence });
  if (row.impressions >= 50 && row.ctr < 0.02) findings.push({ type: "weak_ctr", observation: `${row.query} has ${(row.ctr * 100).toFixed(1)}% CTR.`, recommendation: "Consider a title or description improvement after manual review.", evidence: row, confidence });
  if (row.average_position >= 8 && row.average_position <= 20 && row.impressions >= 20) findings.push({ type: "ranking_opportunity", observation: `${row.query} averages position ${row.average_position.toFixed(1)}.`, recommendation: "Assess content completeness and internal-link relevance.", evidence: row, confidence });
}
const output = { generated_at: now(), sample_size: rows.length, confidence_note: rows.length < 100 ? "Low data volume; findings are observations, not causal conclusions." : "Findings are evidence-supported observations, not causal conclusions.", observations: findings };
writeJson(path.join(dataRoot, "gsc", "opportunities.json"), output);
writeText(path.join(reportsRoot, "gsc-opportunity-report.md"), `# Search Console opportunity report\n\nSample size: ${rows.length}\n\n${findings.length ? findings.map((item) => `- **${item.type}** (${item.confidence} confidence): ${item.observation} Recommendation: ${item.recommendation}`).join("\n") : "No opportunities were generated because no Search Console rows are available."}\n`);
console.log(`Recorded ${findings.length} GSC observations.`);
