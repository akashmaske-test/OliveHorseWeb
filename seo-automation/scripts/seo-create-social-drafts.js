import fs from "node:fs";
import path from "node:path";
import { generatedRoot, loadBusinessProfile, now, runOpenRouter, writeJson } from "./lib.js";

const profiles = fs.existsSync(generatedRoot) ? fs.readdirSync(generatedRoot).filter((file) => file.endsWith(".json")) : [];
const draft = profiles.map((file) => JSON.parse(fs.readFileSync(path.join(generatedRoot, file), "utf8"))).find((item) => ["approved_for_publish", "published"].includes(item.workflow_status));
if (!draft) {
  console.log("No approved or published blog is available for social drafts.");
  process.exit(0);
}
const profile = loadBusinessProfile();
const result = await runOpenRouter({ model: process.env.OPENROUTER_MODEL_WRITING, temperature: 0.4, json: true, purpose: "social_drafts", prompt: `Create 1-2 Instagram and Facebook caption drafts for an approved article. Use only verified business information and no metrics, testimonials, prices or image claims. Business: ${JSON.stringify(profile.verified_claims)}. Article slug: ${draft.slug}` });
const output = { generated_at: now(), blog_slug: draft.slug, status: result.ok ? "pending" : "manual_setup_required", missing_images: true, content: result.ok ? result.content : [], note: result.ok ? "Visual concepts require verified assets before publishing." : result.reason };
writeJson(path.join(generatedRoot, "..", "social-posts", `${draft.slug}.json`), output);
console.log(`Social drafts status: ${output.status}`);
