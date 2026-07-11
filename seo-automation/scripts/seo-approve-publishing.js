import fs from "node:fs";
import path from "node:path";
import { fileHash, generatedRoot, loadJsonArray, now, parseArgument, saveJsonArray, writeJson } from "./lib.js";

const slug = parseArgument("--slug");
const action = parseArgument("--action");
const notes = parseArgument("--notes") || "";
const files = fs.existsSync(generatedRoot) ? fs.readdirSync(generatedRoot).filter((file) => file.endsWith(".json")) : [];
const candidates = files.map((file) => ({ path: path.join(generatedRoot, file), value: JSON.parse(fs.readFileSync(path.join(generatedRoot, file), "utf8")) })).filter(({ value }) => value.workflow_status === "approved_for_publish_pending_user_confirmation");
if (!slug || !action) {
  console.log(candidates.length ? candidates.map(({ value }) => `${value.slug}: ${value.workflow_status}`).join("\n") : "No drafts await publishing confirmation.");
  process.exit(0);
}
const candidate = candidates.find(({ value }) => value.slug === slug);
if (!candidate) throw new Error("Only QC-cleared drafts can receive final publishing approval.");
if (!['approve', 'reject', 'needs_review'].includes(action)) throw new Error("Action must be approve, reject, or needs_review.");
candidate.value.workflow_status = action === "approve" ? "approved_for_publish" : action;
candidate.value.approval_date = now();
candidate.value.approval_notes = notes;
candidate.value.final_file_hash = fileHash(candidate.value.draft_path);
writeJson(candidate.path, candidate.value);
const log = loadJsonArray("approval-log.json");
log.push({ type: "publishing", slug, action, notes, final_file_hash: candidate.value.final_file_hash, at: candidate.value.approval_date });
saveJsonArray("approval-log.json", log);
console.log(`Publishing status for ${slug}: ${candidate.value.workflow_status}. No branch, commit, PR, merge, or publish action was taken.`);
