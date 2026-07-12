import path from "node:path";
import { configuredSiteUrl, searchConsoleClient } from "./gsc-client.js";
import { configurationReport, dataRoot, ensureDirectories, now, writeJson } from "./lib.js";

ensureDirectories();
const status = configurationReport();
if (status.gsc_status !== "configured" || !searchConsoleClient()) {
  writeJson(path.join(dataRoot, "gsc", "fetch-status.json"), { ...status, fetched_at: now(), status: "manual_setup_required" });
  console.log("GSC fetch skipped: manual setup required.");
  process.exit(0);
}

const lookback = Number(process.env.GSC_LOOKBACK_DAYS || 28);
const delay = Number(process.env.GSC_DATA_DELAY_DAYS || 2);
const end = new Date(Date.now() - delay * 86_400_000);
const start = new Date(end.getTime() - (lookback - 1) * 86_400_000);
const startDate = start.toISOString().slice(0, 10);
const endDate = end.toISOString().slice(0, 10);
const { api } = searchConsoleClient();
const rows = [];
let startRow = 0;
try {
  while (true) {
    const response = await api.searchanalytics.query({ siteUrl: configuredSiteUrl(), requestBody: { startDate, endDate, dimensions: ["date", "query", "page", "country", "device"], rowLimit: 25_000, startRow } });
    const batch = response.data.rows || [];
    rows.push(...batch);
    if (batch.length < 25_000) break;
    startRow += batch.length;
  }
  const normalised = [...new Map(rows.map((row) => {
    const [date, query, page, country, device] = row.keys || [];
    const value = { date, query, page, country, device, clicks: row.clicks || 0, impressions: row.impressions || 0, ctr: row.ctr || 0, average_position: row.position || 0, fetched_at: now(), requested_date_range: { startDate, endDate } };
    return [[date, query, page, country, device].join("|"), value];
  })).values()];
  const stamp = `${startDate}_to_${endDate}`;
  writeJson(path.join(dataRoot, "gsc", "raw", `${stamp}.json`), { fetched_at: now(), startDate, endDate, rows });
  writeJson(path.join(dataRoot, "gsc", "normalised", `${stamp}.json`), normalised);
  writeJson(path.join(dataRoot, "gsc", "latest.json"), normalised);
  writeJson(path.join(dataRoot, "gsc", "fetch-status.json"), { status: "completed", fetched_at: now(), startDate, endDate, row_count: normalised.length });
  console.log(`Saved ${normalised.length} non-duplicated GSC rows.`);
} catch {
  writeJson(path.join(dataRoot, "gsc", "fetch-status.json"), { status: "failed", fetched_at: now(), startDate, endDate, row_count: 0, message: "Search Console fetch failed without exposing credentials." });
  console.log("GSC fetch failed without exposing credentials. Run seo:gsc-test for a safe diagnostic.");
}
