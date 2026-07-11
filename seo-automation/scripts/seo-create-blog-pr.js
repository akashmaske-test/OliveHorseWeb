import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileHash, generatedRoot, hasFlag, loadJsonArray, now, readJson, saveJsonArray, writeJson } from "./lib.js";

const dryRun = !hasFlag("--confirm") || hasFlag("--dry-run");
const metadataFiles = fs.existsSync(generatedRoot) ? fs.readdirSync(generatedRoot).filter((file) => file.endsWith(".json")) : [];
const candidate = metadataFiles.map((file) => readJson(path.join(generatedRoot, file))).find((item) => item.workflow_status === "approved_for_publish");
if (!candidate) {
  console.log("No explicitly approved draft is available for a PR.");
  process.exit(0);
}
const checks = [];
checks.push(candidate.final_file_hash === fileHash(candidate.draft_path) ? "approved file hash matches" : "ERROR: approved file hash differs");
checks.push(fs.existsSync("content/blog") ? "live blog directory exists" : "ERROR: live blog directory is missing");
checks.push(!/placeholder|lorem ipsum/i.test(fs.readFileSync(candidate.draft_path, "utf8")) ? "no placeholder content" : "ERROR: placeholder content found");
console.log(`${dryRun ? "DRY RUN" : "CONFIRMED"}: ${candidate.slug}\n${checks.map((item) => `- ${item}`).join("\n")}`);
if (dryRun || checks.some((item) => item.startsWith("ERROR"))) process.exit(checks.some((item) => item.startsWith("ERROR")) ? 1 : 0);

const branch = `content/${candidate.slug}`;
childProcess.execFileSync("git", ["checkout", "-b", branch], { stdio: "inherit" });
const livePath = path.join("content/blog", `${candidate.slug}.md`);
const source = fs.readFileSync(candidate.draft_path, "utf8").replace(/status:\s*pending_review/, "status: published").replace(/noindex:\s*true/, "noindex: false");
fs.writeFileSync(livePath, source);
childProcess.execFileSync("npm", ["run", "lint"], { stdio: "inherit" });
childProcess.execFileSync("npm", ["test"], { stdio: "inherit" });
childProcess.execFileSync("npm", ["run", "build"], { stdio: "inherit" });
childProcess.execFileSync("npm", ["run", "seo:validate"], { stdio: "inherit" });
childProcess.execFileSync("git", ["add", livePath], { stdio: "inherit" });
childProcess.execFileSync("git", ["commit", "-m", `Publish blog: ${candidate.slug}`], { stdio: "inherit" });
childProcess.execFileSync("git", ["push", "-u", "origin", branch], { stdio: "inherit" });
childProcess.execFileSync("gh", ["pr", "create", "--base", process.env.GITHUB_BRANCH || "master", "--head", branch, "--title", `Publish blog: ${candidate.slug}`, "--body", "Approved blog content. Do not merge automatically."], { stdio: "inherit" });
const log = loadJsonArray("publishing-log.json");
log.push({ slug: candidate.slug, branch, pr_created_at: now() });
saveJsonArray("publishing-log.json", log);
