import path from "node:path";
import { dataRoot, loadBusinessProfile, now, parseArgument, writeJson } from "./lib.js";

const profilePath = path.join(dataRoot, "business-profile.json");
const update = parseArgument("--set");
const profile = loadBusinessProfile();

if (update) {
  const [field, ...valueParts] = update.split("=");
  if (!field || !valueParts.length) throw new Error("Use --set field=value.");
  if (!Object.hasOwn(profile, field)) throw new Error(`Unknown profile field: ${field}`);
  const value = valueParts.join("=").trim();
  profile[field] = Array.isArray(profile[field]) ? [...profile[field], value] : value;
  profile.last_verified_at = now();
  writeJson(profilePath, profile);
  console.log(`Updated ${field} without removing existing verified information.`);
} else {
  console.log(JSON.stringify(profile, null, 2));
}
