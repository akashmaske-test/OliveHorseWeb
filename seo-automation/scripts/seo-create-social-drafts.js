import childProcess from "node:child_process";

// Compatibility entrypoint only. It intentionally detects eligibility and never
// writes captions or creatives before the required human asset decision.
const result = childProcess.spawnSync("node", ["automation/social-media/src/cli.js", "detect"], { encoding: "utf8" });
process.stdout.write(result.stdout || "");
process.stderr.write(result.stderr || "");
process.exit(result.status || 0);
