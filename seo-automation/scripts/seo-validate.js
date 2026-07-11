import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { readBlogPosts, validateBlogPost } from "../../src/blog/content.js";
import { configurationReport, dataRoot, loadBusinessProfile, productionUrl, readJson } from "./lib.js";

const errors = [];
const warnings = [];
const profile = loadBusinessProfile();
if (!profile.business_name || !profile.website_url) errors.push("Business profile is missing name or production URL.");
if (profile.website_url !== `${productionUrl}/`) errors.push("Business profile production URL does not match configured canonical URL.");
const posts = readBlogPosts({ includeNonPublished: true });
const slugs = new Set();
for (const post of posts) {
  validateBlogPost(post).forEach((error) => errors.push(`${post.sourcePath}: ${error}`));
  if (slugs.has(post.slug)) errors.push(`Duplicate blog slug: ${post.slug}`);
  slugs.add(post.slug);
}
const dist = path.resolve("dist");
if (fs.existsSync(dist)) {
  for (const file of ["index.html", "blog/index.html", "robots.txt", "sitemap.xml", "404.html"]) if (!fs.existsSync(path.join(dist, file))) errors.push(`Missing generated file: dist/${file}`);
  const home = fs.existsSync(path.join(dist, "index.html")) ? fs.readFileSync(path.join(dist, "index.html"), "utf8") : "";
  if (!home.includes('rel="canonical" href="https://olivehorsefitness.vercel.app/"')) errors.push("Homepage canonical is missing or invalid.");
  if (!home.includes("OliveHorse Fitness Academy")) errors.push("Homepage is not meaningfully prerendered.");
  const sitemap = fs.existsSync(path.join(dist, "sitemap.xml")) ? fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8") : "";
  if (!sitemap.startsWith("<?xml") || !sitemap.includes("<urlset")) errors.push("Sitemap XML is invalid.");
  if (sitemap.includes("development-markdown-sample")) errors.push("Draft blog appeared in sitemap.");
  const robots = fs.existsSync(path.join(dist, "robots.txt")) ? fs.readFileSync(path.join(dist, "robots.txt"), "utf8") : "";
  if (!robots.includes("Allow: /") || !robots.includes("Sitemap: https://olivehorsefitness.vercel.app/sitemap.xml")) errors.push("robots.txt is unsafe or missing sitemap.");
}
const staged = childProcess.execFileSync("git", ["diff", "--cached", "--", "."], { encoding: "utf8" });
if (/AIza|sk-[A-Za-z0-9]|refresh_token\s*[:=]\s*["'][A-Za-z0-9]/.test(staged)) errors.push("Potential secret detected in staged changes.");
const configuration = configurationReport();
if (configuration.gsc_status !== "configured") warnings.push("GSC OAuth is not configured; this is an expected manual gate.");
if (configuration.openrouter_status !== "configured") warnings.push("OpenRouter is not configured; AI scripts will safely skip.");
const report = { errors, warnings, checked_at: new Date().toISOString() };
fs.mkdirSync(path.join(dataRoot, "..", "reports"), { recursive: true });
fs.writeFileSync(path.join(dataRoot, "..", "reports", "seo-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
warnings.forEach((warning) => console.warn(`WARNING: ${warning}`));
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("SEO validation passed.");
