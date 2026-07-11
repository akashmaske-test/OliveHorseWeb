import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";

export const root = path.resolve(".");
export const seoRoot = path.join(root, "seo-automation");
export const dataRoot = path.join(seoRoot, "data");
export const reportsRoot = path.join(seoRoot, "reports");
export const generatedRoot = path.join(seoRoot, "generated-blogs");
export const secretsRoot = path.join(seoRoot, ".secrets");
export const productionUrl = "https://olivehorsefitness.vercel.app";

dotenv.config({ path: path.join(root, ".env") });
dotenv.config({ path: path.join(root, ".env.local"), override: false });

export function ensureDirectories() {
  [dataRoot, reportsRoot, generatedRoot, secretsRoot, path.join(dataRoot, "gsc", "raw"), path.join(dataRoot, "gsc", "normalised")].forEach((directory) => fs.mkdirSync(directory, { recursive: true }));
}

export function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

export function now() {
  return new Date().toISOString();
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function fileHash(filePath) {
  return sha256(fs.readFileSync(filePath));
}

export function mask(value) {
  if (!value) return "not configured";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export function requiredEnv(names) {
  return names.filter((name) => !process.env[name]);
}

export function loadBusinessProfile() {
  return readJson(path.join(dataRoot, "business-profile.json"), {});
}

export function loadJsonArray(filename) {
  const value = readJson(path.join(dataRoot, filename), []);
  return Array.isArray(value) ? value : [];
}

export function saveJsonArray(filename, value) {
  writeJson(path.join(dataRoot, filename), value);
}

export function parseArgument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] || null;
}

export function hasFlag(name) {
  return process.argv.includes(name);
}

export function configurationReport() {
  const gsc = requiredEnv(["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GSC_SITE_URL"]);
  const openRouter = requiredEnv(["OPENROUTER_API_KEY", "OPENROUTER_MODEL_RESEARCH", "OPENROUTER_MODEL_WRITING", "OPENROUTER_MODEL_QC"]);
  return {
    checked_at: now(),
    website_url: process.env.WEBSITE_URL || productionUrl,
    gsc_status: gsc.length ? "manual_setup_required" : "configured",
    gsc_missing: gsc,
    openrouter_status: openRouter.length ? "manual_setup_required" : "configured",
    openrouter_missing: openRouter,
  };
}

export async function runOpenRouter({ model, prompt, temperature = 0.2, json = false, purpose }) {
  if (!process.env.OPENROUTER_API_KEY || !model) {
    return { ok: false, status: "manual_setup_required", reason: "OpenRouter credentials or model are not configured." };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature, messages: [{ role: "user", content: prompt }], ...(json ? { response_format: { type: "json_object" } } : {}) }),
    });
    if (!response.ok) return { ok: false, status: "error", reason: `OpenRouter returned HTTP ${response.status}.` };
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content?.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "") || "";
    let parsed = content;
    if (json) {
      try { parsed = JSON.parse(content); } catch { return { ok: false, status: "error", reason: "OpenRouter returned invalid JSON." }; }
    }
    return { ok: true, content: parsed, usage: payload.usage || null, purpose };
  } catch (error) {
    return { ok: false, status: "error", reason: error.name === "AbortError" ? "OpenRouter request timed out." : "OpenRouter request failed." };
  } finally {
    clearTimeout(timer);
  }
}
