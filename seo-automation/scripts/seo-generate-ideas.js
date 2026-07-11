import path from "node:path";
import { dataRoot, loadJsonArray, now, readJson, runOpenRouter, saveJsonArray } from "./lib.js";

const existing = loadJsonArray("blog-ideas.json");
const research = readJson(path.join(dataRoot, "keyword-research.json"), {});
const prompt = `Return JSON with an ideas array containing at most three relevant blog ideas. Every idea must include title, primary_keyword, supporting_keywords, search_intent, funnel_stage, target_audience, target_location, why_it_matters, confidence, priority_score. Do not invent keyword metrics or business facts. Avoid these existing titles: ${existing.map((idea) => idea.title).join(" | ")}. Research: ${JSON.stringify(research.recommendations || [])}`;
const result = await runOpenRouter({ model: process.env.OPENROUTER_MODEL_RESEARCH, prompt, temperature: 0.2, json: true, purpose: "blog_ideas" });
if (!result.ok) {
  console.log(`Idea generation skipped: ${result.reason}`);
  process.exit(0);
}
const ideas = Array.isArray(result.content.ideas) ? result.content.ideas : [];
const additions = ideas.filter((idea) => !existing.some((item) => item.primary_keyword?.toLowerCase() === idea.primary_keyword?.toLowerCase())).map((idea) => ({ id: `idea-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, ...idea, source_type: research.source_type || "ai_recommendation", supporting_gsc_queries: [], related_existing_pages: ["/"], approval_status: "pending", created_at: now(), rejection_reason: null }));
saveJsonArray("blog-ideas.json", [...existing, ...additions]);
console.log(`Added ${additions.length} blog ideas.`);
