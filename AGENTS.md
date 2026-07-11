# Repository rules

- Preserve the React/Vite architecture, npm package manager and ESM module style.
- Use verified business information only. Do not invent services, prices, locations, reviews, awards, guarantees, customers, results, statistics, keyword metrics or rankings.
- Every indexable page needs unique metadata and an absolute canonical URL; public SEO pages must expose meaningful HTML.
- Drafts, private paths and temporary pages must not enter the sitemap.
- Never expose or commit API keys, OAuth credentials or refresh tokens. OAuth uses the read-only Search Console scope only; service accounts are prohibited.
- Content requires explicit topic and publishing approval. Publishing scripts default to dry-run and never merge pull requests.
- Use OpenRouter for AI operations, cheaper models for research/classification, and stronger models only for writing/QC. Cache non-sensitive outputs to avoid repeat work.
- Run lint, tests, SEO validation and production build before a publishing pull request.
