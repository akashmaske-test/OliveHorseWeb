import path from "node:path";
import { configurationReport, dataRoot, ensureDirectories, now, readJson, reportsRoot, writeJson, writeText } from "./lib.js";

const maxPages = 10;

function formatInteger(value) {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

function formatPercent(value) {
  return `${((value || 0) * 100).toFixed(2)}%`;
}

function formatPosition(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "—";
}

ensureDirectories();
const configuration = configurationReport();
const fetch = readJson(path.join(dataRoot, "gsc", "fetch-status.json"), null);
const rows = fetch?.status === "completed" ? readJson(path.join(dataRoot, "gsc", "latest.json"), []) : [];
const reportPath = path.join(reportsRoot, "gsc-performance-report");

if (configuration.gsc_status !== "configured" || fetch?.status === "manual_setup_required") {
  const report = {
    generated_at: now(),
    status: "manual_setup_required",
    note: "Search Console credentials are not configured. No performance data was requested or inferred.",
  };
  writeJson(`${reportPath}.json`, report);
  writeText(`${reportPath}.md`, "# Daily Search Console performance\n\nStatus: manual setup required. Configure the read-only Search Console secrets before this report can show website performance.\n");
  console.log("GSC performance report skipped: manual setup required.");
  process.exit(0);
}

if (fetch?.status !== "completed") {
  const report = {
    generated_at: now(),
    status: "fetch_unavailable",
    requested_date_range: fetch?.startDate && fetch?.endDate ? { startDate: fetch.startDate, endDate: fetch.endDate } : null,
    note: "Search Console fetch did not complete. No stale data was used.",
  };
  writeJson(`${reportPath}.json`, report);
  writeText(`${reportPath}.md`, "# Daily Search Console performance\n\nStatus: fresh data unavailable. The workflow did not use stale Search Console data; check the connection report in the workflow artifact.\n");
  console.log("GSC performance report skipped: fresh data unavailable.");
  process.exit(0);
}

const totals = rows.reduce((summary, row) => ({
  clicks: summary.clicks + (row.clicks || 0),
  impressions: summary.impressions + (row.impressions || 0),
  weightedPosition: summary.weightedPosition + ((row.average_position || 0) * (row.impressions || 0)),
}), { clicks: 0, impressions: 0, weightedPosition: 0 });
const pageTotals = new Map();
for (const row of rows) {
  const current = pageTotals.get(row.page) || { page: row.page, clicks: 0, impressions: 0, weightedPosition: 0 };
  current.clicks += row.clicks || 0;
  current.impressions += row.impressions || 0;
  current.weightedPosition += (row.average_position || 0) * (row.impressions || 0);
  pageTotals.set(row.page, current);
}
const topPages = [...pageTotals.values()]
  .map((page) => ({ ...page, ctr: page.impressions ? page.clicks / page.impressions : 0, average_position: page.impressions ? page.weightedPosition / page.impressions : null }))
  .sort((left, right) => right.impressions - left.impressions || right.clicks - left.clicks)
  .slice(0, maxPages)
  .map(({ weightedPosition, ...page }) => page);
const report = {
  generated_at: now(),
  status: rows.length ? "data_available" : "no_data_yet",
  requested_date_range: { startDate: fetch.startDate, endDate: fetch.endDate },
  data_delay_days: Number(process.env.GSC_DATA_DELAY_DAYS || 2),
  totals: {
    clicks: totals.clicks,
    impressions: totals.impressions,
    ctr: totals.impressions ? totals.clicks / totals.impressions : 0,
    average_position: totals.impressions ? totals.weightedPosition / totals.impressions : null,
  },
  top_pages_by_impressions: topPages,
  note: rows.length
    ? "Search Console reports processed search performance, not real-time visits or causal impact from a single article."
    : "No Search Console rows are available for this processed date range. New pages commonly need time before data appears.",
};
writeJson(`${reportPath}.json`, report);
const pageRows = topPages.length
  ? topPages.map((page) => `| ${page.page} | ${formatInteger(page.clicks)} | ${formatInteger(page.impressions)} | ${formatPercent(page.ctr)} | ${formatPosition(page.average_position)} |`).join("\n")
  : "No public-page performance rows are available yet.";
writeText(`${reportPath}.md`, `# Daily Search Console performance\n\nStatus: ${report.status}\n\nProcessed data range: ${fetch.startDate} to ${fetch.endDate}\n\n- Clicks: ${formatInteger(report.totals.clicks)}\n- Impressions: ${formatInteger(report.totals.impressions)}\n- CTR: ${formatPercent(report.totals.ctr)}\n- Average position: ${formatPosition(report.totals.average_position)}\n\n## Top public pages by impressions\n\n${topPages.length ? "| Page | Clicks | Impressions | CTR | Average position |\n| --- | ---: | ---: | ---: | ---: |\n" : ""}${pageRows}\n\n${report.note}\n`);
console.log(`Recorded daily GSC performance report with ${topPages.length} public pages.`);
