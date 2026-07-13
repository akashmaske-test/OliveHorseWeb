import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const stateRoot = fs.mkdtempSync(path.join(os.tmpdir(), "olivehorse-social-"));
const topic = "idea-1783769429369-2705";
const image = path.join("public", "generated-social", "images", `${topic}.png`);
const run = (...args) => childProcess.spawnSync("node", ["automation/social-media/src/cli.js", ...args], { cwd: process.cwd(), env: { ...process.env, SOCIAL_CONTENT_ROOT: stateRoot }, encoding: "utf8" });

afterAll(() => { fs.rmSync(stateRoot, { recursive: true, force: true }); fs.rmSync(image, { force: true }); });

describe("social automation", () => {
  it("uses final-approved metadata and pauses for the asset choice", () => {
    expect(run("detect").status).toBe(0);
    const request = run("request-asset", "--topic", topic);
    expect(request.status).toBe(0);
    expect(request.stdout).toContain("Do you have your own image or video");
  });

  it("completes mock creative review and produces redacted dry-run requests", () => {
    expect(run("respond-asset", "--topic", topic, "--choice", "generate-image").status).toBe(0);
    expect(run("generate-prompts", "--topic", topic, "--provider", "mock").status).toBe(0);
    expect(run("preview", "--topic", topic).status).toBe(0);
    expect(fs.existsSync(image)).toBe(true);
    expect(run("approve", "--topic", topic, "--action", "approve").status).toBe(0);
    const publication = run("publish", "--topic", topic, "--dry-run");
    expect(publication.status).toBe(0);
    expect(publication.stdout).toContain("dry_run");
    expect(publication.stdout).not.toContain("access_token=");
  });

  it("blocks a child asset without consent and refuses traversal", () => {
    const secondRoot = fs.mkdtempSync(path.join(os.tmpdir(), "olivehorse-social-consent-"));
    const runSecond = (...args) => childProcess.spawnSync("node", ["automation/social-media/src/cli.js", ...args], { cwd: process.cwd(), env: { ...process.env, SOCIAL_CONTENT_ROOT: secondRoot }, encoding: "utf8" });
    expect(runSecond("detect").status).toBe(0);
    expect(runSecond("request-asset", "--topic", topic).status).toBe(0);
    const denied = runSecond("respond-asset", "--topic", topic, "--choice", "repository-asset", "--path", "public/images/04-kids-karate-class.png", "--contains-children", "true");
    expect(denied.status).toBe(1);
    expect(denied.stderr).toContain("written consent");
    const traversal = childProcess.spawnSync("node", ["--input-type=module", "--eval", "import { safeRelativeAsset } from './automation/social-media/src/lib.js'; safeRelativeAsset('../outside.png');"], { cwd: process.cwd(), encoding: "utf8" });
    expect(traversal.status).toBe(1);
    expect(traversal.stderr).toContain("safe relative repository path");
    fs.rmSync(secondRoot, { recursive: true, force: true });
  });
});
