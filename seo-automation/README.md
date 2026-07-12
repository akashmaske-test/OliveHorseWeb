# SEO automation

This directory contains local-first, safety-gated SEO automation. JSON files in `data/` are the approval source of truth; generated drafts stay in `generated-blogs/`; only `content/blog/` is deployable.

Run `npm run seo:validate` before automation. `npm run seo:morning` can collect reports and draft review work but always stops before publishing. OAuth tokens belong only in the ignored `.secrets/` directory or GitHub Actions secrets.

The scheduled GitHub workflow exports a redacted human-approval queue to the `seo-automation-state` branch at `seo-automation/inbox/approval-queue.md` and `.json`. Generated Markdown, complete review metadata and QC reports are persisted under `seo-automation/review-drafts/` on that same branch so Codex can inspect the real article after the runner exits. This branch is review-only and never contains credentials or raw GSC data. GitHub Actions never publishes by itself; publication requires explicit authorization in the Codex task.

Each weekly run also produces a safe Search Console aggregate report at `seo-automation/performance/gsc-performance-report.md` and `.json` on `seo-automation-state`. It contains the processed date range, aggregate clicks, impressions, CTR, average position and top public pages. It never copies raw Search Console rows or OAuth credentials. Search Console data is delayed and is not real-time analytics. Use manual dispatch only when an extra check is genuinely useful.

After a topic is approved in this Codex task, Codex retrieves and reviews the QC-cleared article, creates one built-in ImageGen editorial illustration, and can publish the validated article and image when the user's authorization includes publication. This is intentionally outside GitHub Actions: it needs no API key, cannot be called by Actions, and is never used as evidence of a real academy, instructor, student, facility, outcome, or offer.

Useful commands:

- `npm run seo:profile -- --set brand_tone=clear`
- `npm run seo:gsc-authorize`, `npm run seo:gsc-test`, `npm run seo:gsc-fetch`, `npm run seo:gsc-analyse`
- `npm run seo:research`, `npm run seo:ideas`, `npm run seo:approve-topic`, `npm run seo:approval-queue`
- `npm run seo:generate-blog`, `npm run seo:qc`, `npm run seo:approve-publishing`
- `npm run seo:create-blog-pr -- --dry-run`
