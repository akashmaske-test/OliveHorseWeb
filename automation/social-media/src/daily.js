import fs from "node:fs";
import path from "node:path";
import { contentRoot, now, writeJson } from "./lib.js";

const quotes = [
  ["Discipline Builds Lasting Confidence", "discipline"],
  ["Strength Begins With Consistency", "consistency"],
  ["Train Today. Lead Tomorrow.", "training"],
  ["Focus Turns Effort Into Progress", "focus"],
  ["Strong Mind. Strong Body.", "strength"],
  ["Courage Starts With One Step", "courage"],
  ["Every Class Builds Character", "growth"],
  ["Control Is Greater Than Power", "control"],
  ["Train With Purpose", "mindset"],
  ["Stay Focused. Keep Growing.", "resilience"],
];
const subjects = ["adult female martial artist", "adult male martial artist", "instructor silhouette", "two training partners", "karate stance", "kata movement", "belt-tying moment", "meditation pose"];
const environments = ["dark studio", "dramatic spotlight", "training hall", "outdoor sunrise", "clean architectural space", "backlit silhouette"];
const cameras = ["wide editorial composition", "side profile", "low-angle shot", "full-body action", "strong negative-space composition"];
const date = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
const root = path.join(contentRoot, "daily");
const historyPath = path.join(root, "quotation-history.json");
const read = (file, fallback) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;

export function prepareDailyPost() {
  fs.mkdirSync(root, { recursive: true });
  const today = date();
  const file = path.join(root, `${today}.json`);
  if (fs.existsSync(file)) return { record: read(file, {}), created: false };
  const history = read(historyPath, []);
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90);
  const used = new Set(history.filter((item) => new Date(item.date) >= cutoff).map((item) => item.quote));
  const [quote, theme] = quotes.find(([line]) => !used.has(line)) || quotes[0];
  const index = history.length;
  const record = { id: `daily-${today}`, date: today, workflow_status: "awaiting_user_asset", quote, quote_theme: theme, subject: subjects[index % subjects.length], environment: environments[index % environments.length], camera_angle: cameras[index % cameras.length], visual_tone: "disciplined", format: "image", cta: "Book Your Free Trial Class", instagram_handle: "@akashmaske.test", website: "olive-horse-web.vercel.app", asset_question: "Do you have your own image or video for today’s post?", asset_choices: ["upload-image", "upload-video", "repository-asset", "generate-image", "skip"], created_at: now(), approvals: [], platform_results: {} };
  writeJson(file, record);
  writeJson(historyPath, [...history, { date: today, quote, theme, visual_concept: `${record.subject}, ${record.environment}, ${record.camera_angle}`, subject_type: record.subject, post_format: "image", publishing_status: "awaiting_user_asset" }]);
  return { record, created: true };
}
