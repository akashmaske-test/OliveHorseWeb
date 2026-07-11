# Repository rules

- Preserve the React/Vite architecture, npm package manager and ESM module style.
- Use verified business information only. Do not invent services, prices, locations, reviews, awards, guarantees, customers, results, statistics, keyword metrics or rankings.
- Every indexable page needs unique metadata and an absolute canonical URL; public SEO pages must expose meaningful HTML.
- Drafts, private paths and temporary pages must not enter the sitemap.
- Never expose or commit API keys, OAuth credentials or refresh tokens. OAuth uses the read-only Search Console scope only; service accounts are prohibited.
- Content requires explicit topic and publishing approval. Publishing scripts default to dry-run and never merge pull requests.
- When the user explicitly approves a topic in this Codex task, use the built-in ImageGen tool to create one generic 16:9 editorial cover illustration for the resulting QC-cleared draft. Show the image here for review before publishing; never use it as a GitHub Actions step or an SEO claim. The illustration must not depict real people, students, instructors, facilities, logos, awards, pricing, results, or unverified business facts. Save an approved image into the project only when preparing the final blog publishing pull request.
- Use OpenRouter for AI operations, cheaper models for research/classification, and stronger models only for writing/QC. Cache non-sensitive outputs to avoid repeat work.
- Run lint, tests, SEO validation and production build before a publishing pull request.
