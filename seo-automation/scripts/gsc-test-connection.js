import path from "node:path";
import { configuredSiteUrl, searchConsoleClient } from "./gsc-client.js";
import { configurationReport, ensureDirectories, now, reportsRoot, writeJson } from "./lib.js";

ensureDirectories();
const reportPath = path.join(reportsRoot, "gsc-connection-test.json");
const report = { ...configurationReport(), checked_at: now(), site_url: configuredSiteUrl(), status: "manual_setup_required" };
const client = searchConsoleClient();
if (!client) {
  report.message = "OAuth credentials are not configured. Follow docs/google-search-console-setup.md.";
  writeJson(reportPath, report);
  console.log(report.message);
  process.exit(0);
}

try {
  const sites = (await client.api.sites.list()).data.siteEntry || [];
  const site = sites.find((entry) => entry.siteUrl === configuredSiteUrl());
  if (!site) {
    report.status = "incorrect_property_or_insufficient_permission";
    report.accessible_properties = sites.map((entry) => ({ site_url: entry.siteUrl, permission_level: entry.permissionLevel }));
  } else {
    const endDate = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
    const startDate = new Date(Date.now() - 3 * 86_400_000).toISOString().slice(0, 10);
    const response = await client.api.searchanalytics.query({ siteUrl: configuredSiteUrl(), requestBody: { startDate, endDate, rowLimit: 1 } });
    report.status = "connected";
    report.permission_level = site.permissionLevel;
    report.data_status = response.data.rows?.length ? "data_available" : "new_property_or_no_data";
  }
} catch (error) {
  report.status = /invalid_grant|token/i.test(error.message) ? "invalid_or_revoked_token" : "connection_error";
  report.message = "Search Console request failed. Confirm the OAuth token, property URL and permissions.";
}
writeJson(reportPath, report);
console.log(`GSC connection status: ${report.status}`);
