# Social-media automation

This is a local-first, approval-gated workflow for creating one Facebook and Instagram post from one final-approved SEO blog. It never publishes by default.

## Workflow

`approved_for_publish` blog metadata → detect → social brief → asset question → creative → preview → final approval → dry-run → separately activated image publishing.

For an independent daily motivational post, run `npm run social:daily-prepare`. It creates one Asia/Kolkata-dated record, chooses a non-repeated 3–9 word line from the local 90-day history, rotates the subject/environment/camera concept, and stops at the same asset question. It never generates or publishes automatically.

The source of truth is a JSON social record under `social-content/`. It stores the topic ID, state history, asset/consent metadata, creative manifest, final approval, idempotency keys, redacted failures, and platform results. A repeated run never republishes a platform with a successful `post_id`.

## Configuration and privacy

Edit the YAML files in `config/`. The current phone/WhatsApp number is deliberately marked `verification_required`; the Vercel media host is `provisional`; and no posting time has been supplied. Those conditions block real publishing.

Assets are preserved before a working copy is made. Only JPEG, PNG, WebP, MP4, and MOV files within the configured size limit are accepted. Repository paths must be relative and cannot escape the project. Set `--contains-children true --consent confirmed` only after retaining written parent/guardian consent; otherwise the asset is rejected. Existing repository imagery is treated as AI concept imagery, not verified documentary photography.

## Local commands

```sh
npm run social:detect
npm run social:request-asset -- --topic <topic-id>
npm run social:respond-asset -- --topic <topic-id> --choice repository-asset --path public/images/example.png --contains-children false
npm run social:respond-asset -- --topic <topic-id> --choice generate-image
npm run social:generate-prompts -- --topic <topic-id>           # creates an interactive ImageGen manifest and pauses
npm run social:complete-generation -- --topic <topic-id> --path public/generated-social/images/saved-background.png
npm run social:generate-prompts -- --topic <topic-id> --provider mock
npm run social:preview -- --topic <topic-id>
npm run social:validate -- --topic <topic-id>
npm run social:approve -- --topic <topic-id> --action approve
npm run social:render-video -- --topic <topic-id> --duration 4
npm run social:publish -- --topic <topic-id> --dry-run
npm run social:resume -- --topic <topic-id>
```

The asset-answer choices are `upload-image`, `upload-video`, `repository-asset`, `generate-image`, and `skip`. Final approval choices are `approve`, `request_changes`, `replace_asset`, `switch_to_image`, `switch_to_video`, and `skip`.

## Creative providers and video

`interactive_manifest` writes a text-free image prompt and pauses for a human to use an approved image tool. `mock` creates a no-cost abstract test background. Final copy, logo, CTA, URL, and handle are added programmatically in the static PNG preview.

Remotion is the optional, silent 1080×1350 / 4-second renderer. Install scripts must be allowed for Sharp/Remotion’s local prerequisites if your package manager requests it. The isolated Codex environment used for this implementation can download, but does not retain, Remotion's headless browser output; validate a final MP4 on a normal local machine or CI runner before enabling motion. HyperFrames is intentionally not installed; the `video_provider` setting reserves it as a future adapter without duplicating workflow logic.

## Meta and hosting

Required GitHub Secrets for a later activated image-publishing test: `META_APP_ID`, `META_APP_SECRET`, `META_USER_ACCESS_TOKEN`, `META_PAGE_ID`, `META_PAGE_ACCESS_TOKEN`, `INSTAGRAM_ACCOUNT_ID`, and `META_API_VERSION`. Never put them in YAML, review state, output, or URLs.

The image flow uses the official Facebook Page photos endpoint, then Instagram media-container creation and publishing. Video publishing remains disabled by `enable_social_video_publishing: false`. Media must first be deployed at a stable public HTTPS URL; local paths, localhost, authenticated previews, and expiring URLs are rejected. The current Vercel base URL must be confirmed before activation.

## GitHub Actions, testing, and rollback

`social-daily-prepare.yml` has a daily schedule but will not run automatically until repository variable `SOCIAL_DAILY_PREPARE_ENABLED=true` is set. It only creates review state. `social-resume-after-asset.yml` and `social-publish-approved.yml` are manual; the latter is dry-run only.

Test locally with `npm run lint`, `npm test`, `npm run social:validate -- --topic <id>`, and `npm run build`. Roll back any pending social item with the final `skip` action; retain its record and original asset for audit rather than deleting it. Failed platform results remain independent so a retry cannot republish a successful platform.
