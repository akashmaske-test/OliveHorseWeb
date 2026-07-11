# SEO implementation plan

The implementation creates a static SEO layer around the existing React/Vite site, a Markdown blog pipeline, JSON-based approvals, and safe local/GitHub Actions automation. Source-of-truth approvals stay in `seo-automation/data/*.json`; generated drafts stay outside the live blog directory until explicit approval and a manual PR action.

Build sequence: `npm run lint`, `npm test`, `npm run seo:validate`, then `npm run build`. The build emits prerendered public pages, `dist/robots.txt`, and `dist/sitemap.xml`.
