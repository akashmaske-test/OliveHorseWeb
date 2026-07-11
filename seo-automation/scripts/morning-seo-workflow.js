import childProcess from "node:child_process";
import path from "node:path";
import { configurationReport, now, reportsRoot, writeJson, writeText } from "./lib.js";

function run(script) {
  const result = childProcess.spawnSync("node", [path.join("seo-automation", "scripts", script)], { encoding: "utf8" });
  return { script, exit_code: result.status, output: `${result.stdout || ""}${result.stderr || ""}`.trim() };
}

const steps = [run("seo-validate.js"), run("gsc-test-connection.js")];
const config = configurationReport();
if (config.gsc_status === "configured") steps.push(run("gsc-fetch-performance.js"));
steps.push(run("gsc-analyse-opportunities.js"), run("seo-research.js"), run("seo-generate-ideas.js"), run("seo-generate-blog.js"), run("seo-qc-blog.js"), run("seo-create-social-drafts.js"));
const report = { generated_at: now(), gsc_status: config.gsc_status, publishing: "stopped_before_publishing", steps };
writeJson(path.join(reportsRoot, "morning-seo-report.json"), report);
writeText(path.join(reportsRoot, "morning-seo-report.md"), `# Morning SEO workflow\n\nGSC status: ${config.gsc_status}\nPublishing: stopped before publishing\n\n${steps.map((step) => `- ${step.script}: ${step.exit_code === 0 ? "completed safely" : "needs review"}`).join("\n")}\n`);
console.log("Morning workflow completed without publishing content or social posts.");
