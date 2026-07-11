import fs from "node:fs";
import path from "node:path";
import { generatedRoot, loadBusinessProfile, now, parseArgument, readJson, writeJson, writeText } from "./lib.js";

const selected = parseArgument("--slug");
const metadataFiles = fs.existsSync(generatedRoot) ? fs.readdirSync(generatedRoot).filter((file) => file.endsWith(".json")) : [];
const profile = loadBusinessProfile();
for (const file of metadataFiles) {
  const metadataPath = path.join(generatedRoot, file);
  const metadata = readJson(metadataPath);
  if (selected && metadata.slug !== selected) continue;
  const text = fs.readFileSync(metadata.draft_path, "utf8");
  const issues = [];
  if ((text.match(/^# /gm) || []).length !== 1) issues.push("Article must contain exactly one H1.");
  if (!/^## /m.test(text)) issues.push("Article needs H2 sections.");
  if (/\b(\d+%|guarantee|best in|award-winning|trusted by)\b/i.test(text)) issues.push("Potential unsupported claim requires review.");
  if (/featured_image:\s*[^\s"]/i.test(text) && !/featured_image_alt:\s*.+/i.test(text)) issues.push("Image metadata is incomplete.");
  metadata.qc_checked_at = now();
  metadata.qc_issues = issues;
  metadata.workflow_status = issues.length ? "needs_review" : "approved_for_publish_pending_user_confirmation";
  writeJson(metadataPath, metadata);
  writeText(path.join(generatedRoot, `${metadata.slug}.qc.md`), `# QC: ${metadata.slug}\n\nStatus: ${metadata.workflow_status}\n\n${issues.length ? issues.map((issue) => `- ${issue}`).join("\n") : "No deterministic factual, structural, image or metadata blockers found. User confirmation is still required."}\n`);
  console.log(`${metadata.slug}: ${metadata.workflow_status}`);
}
