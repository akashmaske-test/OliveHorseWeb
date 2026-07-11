import fs from "node:fs";
import path from "node:path";
import { dataRoot, generatedRoot, loadJsonArray, now, readJson, seoRoot, writeJson, writeText } from "./lib.js";

const inboxRoot = path.join(seoRoot, "inbox");
const topics = loadJsonArray("blog-ideas.json")
  .filter((idea) => ["pending", "needs_review"].includes(idea.approval_status))
  .map((idea) => ({
    id: idea.id,
    title: idea.title,
    primary_keyword: idea.primary_keyword,
    supporting_keywords: idea.supporting_keywords || [],
    search_intent: idea.search_intent,
    funnel_stage: idea.funnel_stage,
    target_audience: idea.target_audience,
    target_location: idea.target_location,
    why_it_matters: idea.why_it_matters,
    evidence: idea.source_type,
    supporting_gsc_queries: idea.supporting_gsc_queries || [],
    related_existing_pages: idea.related_existing_pages || [],
    approval_status: idea.approval_status,
    requires_human_claim_review: true,
  }));

const drafts = fs.readdirSync(generatedRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => readJson(path.join(generatedRoot, entry.name)))
  .filter((draft) => draft?.workflow_status === "approved_for_publish_pending_user_confirmation")
  .map((draft) => ({
    id: draft.id,
    slug: draft.slug,
    draft_path: draft.draft_path,
    primary_keyword: draft.primary_keyword,
    workflow_status: draft.workflow_status,
    source_type: draft.source_type,
    source_evidence: draft.source_evidence || [],
    claims_requiring_confirmation: draft.claims_requiring_confirmation || [],
    required_action: "user_confirmation_before_publish",
  }));

const queue = {
  generated_at: now(),
  status: "awaiting_human_approval",
  notice: "These are review candidates, not approved business claims. A topic approval permits drafting only. A draft still needs separate user confirmation before it may be published.",
  topics,
  drafts_requiring_publish_confirmation: drafts,
};

const topicMarkdown = topics.length
  ? topics.map((topic) => `## ${topic.id}: ${topic.title}\n\n- Primary keyword: ${topic.primary_keyword}\n- Audience: ${topic.target_audience}\n- Location: ${topic.target_location}\n- Evidence: ${topic.evidence}\n- Suggested action: approve for drafting, reject, or needs review\n`).join("\n")
  : "No topics need a decision.";
const draftMarkdown = drafts.length
  ? drafts.map((draft) => `## ${draft.id}: ${draft.slug}\n\n- Primary keyword: ${draft.primary_keyword}\n- Source evidence: ${draft.source_evidence.join(", ") || "not recorded"}\n- Required action: final user confirmation before publishing\n`).join("\n")
  : "No drafts are waiting for publication confirmation.";

writeJson(path.join(inboxRoot, "approval-queue.json"), queue);
writeText(path.join(inboxRoot, "approval-queue.md"), `# OliveHorse SEO approval queue\n\nGenerated: ${queue.generated_at}\n\n${queue.notice}\n\n## Topics awaiting a decision\n\n${topicMarkdown}\n## Drafts awaiting final publish confirmation\n\n${draftMarkdown}`);
console.log(`Exported ${topics.length} topics and ${drafts.length} drafts for human approval.`);
