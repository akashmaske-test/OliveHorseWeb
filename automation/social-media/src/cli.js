import childProcess from "node:child_process";
import path from "node:path";
import { approve, completeInteractiveGeneration, createBrief, createPreview, detect, generateCreative, getRecord, inspectAsset, nextAction, parseArgs, publish, receiveAsset, requestAsset, validation, allRecords, publicRoot } from "./lib.js";
import { prepareDailyPost } from "./daily.js";

const [command] = process.argv.slice(2);
const args = parseArgs();
const topic = args.topic || args.slug;
try {
  if (command === "detect") { const result = detect(); console.log(result.message); if (result.record) console.log(JSON.stringify({ topic_id: result.record.topic_id, workflow_status: result.record.workflow_status, next: nextAction(result.record) }, null, 2)); }
  else if (command === "daily-prepare") { const result = prepareDailyPost(); console.log(JSON.stringify({ created: result.created, id: result.record.id, date: result.record.date, quote: result.record.quote, workflow_status: result.record.workflow_status, question: result.record.asset_question, choices: result.record.asset_choices }, null, 2)); }
  else if (command === "status") { const records = topic ? [getRecord(topic)] : allRecords(); console.log(JSON.stringify(records.map((record) => ({ topic_id: record.topic_id, blog_slug: record.blog_slug, workflow_status: record.workflow_status, next: nextAction(record) })), null, 2)); }
  else if (command === "brief") { const record = createBrief(getRecord(topic), { refresh: Boolean(args.refresh) }); console.log(`Brief ready for ${record.topic_id}.`); }
  else if (command === "request-asset") { const record = requestAsset(getRecord(topic)); console.log(`Do you have your own image or video for today's post? Choices: upload-image, upload-video, repository-asset, generate-image, skip.\nStatus: ${record.workflow_status}`); }
  else if (command === "respond-asset") { const record = await receiveAsset(getRecord(topic), args); console.log(`Asset response saved: ${record.workflow_status}.`); }
  else if (command === "process-asset") { const record = await inspectAsset(getRecord(topic)); console.log(JSON.stringify(record.asset.analysis, null, 2)); }
  else if (command === "generate-prompts") { const record = await generateCreative(getRecord(topic), args); console.log(JSON.stringify(record.creative_manifest, null, 2)); }
  else if (command === "complete-generation") { const record = await completeInteractiveGeneration(getRecord(topic), args); console.log(`Generated image accepted: ${record.workflow_status}.`); }
  else if (command === "preview") { const record = await createPreview(getRecord(topic)); console.log(`Preview created: ${record.preview.image_path}`); }
  else if (command === "validate") { const output = validation(getRecord(topic), { forPublish: Boolean(args.publish) }); console.log(JSON.stringify(output, null, 2)); process.exitCode = output.ok ? 0 : 1; }
  else if (command === "approve") { const record = approve(getRecord(topic), args); console.log(`Approval saved: ${record.workflow_status}.`); }
  else if (command === "publish") { console.log(JSON.stringify(await publish(getRecord(topic), args), null, 2)); }
  else if (command === "resume") { const record = getRecord(topic); console.log(`${record.topic_id}: ${record.workflow_status}; next: ${nextAction(record)}`); }
  else if (command === "run") { const result = detect(); if (!result.record) console.log(result.message); else console.log(`${result.record.topic_id}: ${nextAction(result.record)}`); }
  else if (command === "render-video") { const record = getRecord(topic); if (record.workflow_status !== "creative_approved" && record.workflow_status !== "ready_to_publish") throw new Error("Video rendering requires an approved creative."); const props = { ...record.creative_manifest, imagePath: `generated-social/images/${record.topic_id}.png`, durationSeconds: Number(args.duration || 4) }; const output = path.join(publicRoot, "videos", `${record.topic_id}.mp4`); childProcess.execFileSync("npx", ["remotion", "render", "automation/social-media/remotion/Root.jsx", "SocialImageMotion", output, "--props", JSON.stringify(props)], { stdio: "inherit" }); console.log(`Video created: ${output}`); }
  else throw new Error("Unknown command. Use detect, brief, request-asset, respond-asset, process-asset, generate-prompts, complete-generation, preview, validate, approve, publish, resume, status, run, or render-video.");
} catch (error) { console.error(`Social automation: ${error.message}`); process.exitCode = 1; }
