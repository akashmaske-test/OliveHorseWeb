# GitHub and Vercel SEO flow

- Push the feature branch and open a pull request into `master`. Vercel Git integration creates a preview deployment automatically.
- Validate the preview’s homepage source, `/blog/`, `/robots.txt`, `/sitemap.xml`, canonical URLs, noindex legal routes, and that draft slugs are absent from the sitemap.
- The daily GitHub workflow uploads reports only. It does not commit, create publishing pull requests, merge, deploy directly, or publish social content.
- Required automation secrets are the Google OAuth values, `GSC_SITE_URL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL_RESEARCH`, `OPENROUTER_MODEL_WRITING`, and `OPENROUTER_MODEL_QC`. SerpAPI and DataForSEO values are optional.
