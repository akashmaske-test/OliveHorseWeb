# SEO approval flow

1. `npm run seo:research` and `npm run seo:ideas` create evidence-labelled recommendations only.
2. Review pending topics with `npm run seo:approve-topic`; use `--id <id> --action approved`, `rejected --reason "..."`, or `needs_review`.
3. `npm run seo:generate-blog` creates one draft in `seo-automation/generated-blogs/`; it never writes to `content/blog/`.
4. Run `npm run seo:qc -- --slug <slug>`. QC can only move a draft to `needs_review` or `approved_for_publish_pending_user_confirmation`.
5. Explicitly approve with `npm run seo:approve-publishing -- --slug <slug> --action approve --notes "..."`.
6. Inspect the default safe check with `npm run seo:create-blog-pr -- --dry-run`. Only `--confirm` can create a separate content branch and pull request. It never merges.
