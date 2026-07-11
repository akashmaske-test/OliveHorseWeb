import path from "node:path";
import { configurationReport, dataRoot, loadBusinessProfile, now, readJson, runOpenRouter, writeJson } from "./lib.js";

const configuration = configurationReport();
const profile = loadBusinessProfile();
const gsc = readJson(path.join(dataRoot, "gsc", "opportunities.json"), { observations: [] });
const prohibitedRecommendationPattern = /community\s+event|local\s+event|success\s+stor|testimonial|review|achievement|award|guarantee|result|price|fee|schedule|qualification|localbusiness\s+schema/i;
function safeRecommendations(content) {
  if (!content || typeof content !== "object") return content;
  if (!Array.isArray(content.recommendations)) return content;
  return {
    ...content,
    recommendations: content.recommendations.filter((item) => !prohibitedRecommendationPattern.test(JSON.stringify(item))),
  };
}
const prompt = `Create a small, qualitative SEO research report for this business using only the supplied facts. Do not state keyword volume, CPC, difficulty, rankings, statistics, prices, reviews or unsupported claims. Separate measured evidence from recommendations.\nBusiness: ${JSON.stringify({ name: profile.business_name, services: profile.verified_services, audience: profile.target_audience, locations: profile.target_locations })}\nGSC observations: ${JSON.stringify(gsc.observations.slice(0, 20))}`;
const result = await runOpenRouter({ model: process.env.OPENROUTER_MODEL_RESEARCH, prompt, temperature: 0.1, json: true, purpose: "seo_research" });
const report = result.ok
  ? { generated_at: now(), source_type: gsc.observations.length ? "gsc_and_ai_recommendation" : "qualitative_ai_recommendation", evidence: gsc.observations, recommendations: safeRecommendations(result.content), usage: result.usage }
  : { generated_at: now(), status: result.status, source_type: "manual_setup_required", evidence: gsc.observations, recommendations: [], note: result.reason };
writeJson(path.join(dataRoot, "keyword-research.json"), report);
console.log(result.ok ? "SEO research saved." : `SEO research skipped: ${result.reason}`);
