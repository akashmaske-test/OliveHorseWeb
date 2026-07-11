import fs from "node:fs";
import path from "node:path";
import { generatedRoot, loadBusinessProfile, loadJsonArray, now, runOpenRouter, writeJson, writeText } from "./lib.js";

const idea = loadJsonArray("blog-ideas.json").find((item) => item.approval_status === "approved");
if (!idea) {
  console.log("No approved topic is available; no blog was generated.");
  process.exit(0);
}
const slug = idea.primary_keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const outputPath = path.join(generatedRoot, `${slug}.md`);
if (fs.existsSync(outputPath)) {
  console.log("A draft already exists for the approved topic.");
  process.exit(0);
}
const profile = loadBusinessProfile();
const prompt = `Write a Markdown article for this approved topic. Use only these verified facts: ${JSON.stringify(profile.verified_claims)}. Do not invent data, schedules, prices, reviews, results, credentials, statistics or images. Use one H1, logical H2/H3s, an honest CTA, and natural links to / and /blog/. Topic: ${JSON.stringify(idea)}`;
const result = await runOpenRouter({ model: process.env.OPENROUTER_MODEL_WRITING, prompt, temperature: 0.35, purpose: "blog_writing" });
if (!result.ok) {
  console.log(`Blog generation skipped: ${result.reason}`);
  process.exit(0);
}
const frontmatter = `---\ntitle: ${idea.title}\ndescription: ${idea.title}\nslug: ${slug}\ndate: ${new Date().toISOString().slice(0, 10)}\nupdated_date: ${new Date().toISOString().slice(0, 10)}\nauthor: OliveHorse Fitness Academy\nprimary_keyword: ${idea.primary_keyword}\nsupporting_keywords: ${JSON.stringify(idea.supporting_keywords || [])}\ncanonical: https://olivehorsefitness.vercel.app/blog/${slug}/\nstatus: pending_review\nfeatured_image: \"\"\nfeatured_image_alt: \"\"\nnoindex: true\n---\n\n`;
writeText(outputPath, frontmatter + result.content);
writeJson(path.join(generatedRoot, `${slug}.json`), {
  id: idea.id,
  title: idea.title,
  slug,
  draft_path: outputPath,
  primary_keyword: idea.primary_keyword,
  supporting_keywords: idea.supporting_keywords || [],
  search_intent: idea.search_intent,
  funnel_stage: idea.funnel_stage,
  target_audience: idea.target_audience,
  target_location: idea.target_location,
  workflow_status: "draft_generated",
  generated_at: now(),
  source_type: idea.source_type,
  source_evidence: ["approved_topic", "verified_business_profile"],
  claims_requiring_confirmation: [],
  model_usage: result.usage || null,
});
console.log(`Generated draft at ${outputPath}`);
