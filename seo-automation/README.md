# SEO automation

This directory contains local-first, safety-gated SEO automation. JSON files in `data/` are the approval source of truth; generated drafts stay in `generated-blogs/`; only `content/blog/` is deployable.

Run `npm run seo:validate` before automation. `npm run seo:morning` can collect reports and draft review work but always stops before publishing. OAuth tokens belong only in the ignored `.secrets/` directory or GitHub Actions secrets.

The scheduled GitHub workflow exports a redacted human-approval queue to the `seo-automation-state` branch at `seo-automation/inbox/approval-queue.md` and `.json`. This branch is review-only: it contains topic candidates and draft confirmation requests, never credentials or raw GSC data. Approving a topic permits drafting only; publishing a draft always requires a separate explicit confirmation.

Useful commands:

- `npm run seo:profile -- --set brand_tone=clear`
- `npm run seo:gsc-authorize`, `npm run seo:gsc-test`, `npm run seo:gsc-fetch`, `npm run seo:gsc-analyse`
- `npm run seo:research`, `npm run seo:ideas`, `npm run seo:approve-topic`, `npm run seo:approval-queue`
- `npm run seo:generate-blog`, `npm run seo:qc`, `npm run seo:approve-publishing`
- `npm run seo:create-blog-pr -- --dry-run`
