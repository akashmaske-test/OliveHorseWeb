import path from "node:path";
import { dataRoot, loadJsonArray, now, parseArgument, saveJsonArray, writeJson, writeText } from "./lib.js";

const id = parseArgument("--id");
const action = parseArgument("--action");
const reason = parseArgument("--reason");
const ideas = loadJsonArray("blog-ideas.json");
const log = loadJsonArray("approval-log.json");
if (id && action) {
  const idea = ideas.find((item) => item.id === id);
  if (!idea) throw new Error(`No idea found for ${id}`);
  if (!["approved", "rejected", "needs_review"].includes(action)) throw new Error("Action must be approved, rejected or needs_review.");
  if (action === "rejected" && !reason) throw new Error("Rejected topics require --reason.");
  idea.approval_status = action;
  idea.rejection_reason = action === "rejected" ? reason : null;
  log.push({ type: "topic", id, action, reason: idea.rejection_reason, at: now() });
  saveJsonArray("blog-ideas.json", ideas);
  saveJsonArray("approval-log.json", log);
  console.log(`Topic ${id} marked ${action}.`);
}
const pending = ideas.filter((idea) => idea.approval_status === "pending");
writeText(path.join(dataRoot, "..", "reports", "approval-queue.md"), `# Topic approval queue\n\n${pending.length ? pending.map((idea) => `## ${idea.id}: ${idea.title}\n\n- Evidence: ${idea.source_type}\n- Business relevance: ${idea.why_it_matters}\n- Suggested action: approve, reject, or needs_review\n`).join("\n") : "No pending topics."}\n`);
console.log(`${pending.length} pending topics in the approval queue.`);
