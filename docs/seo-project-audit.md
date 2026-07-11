# SEO project audit

Audited: 2026-07-11

## Current baseline

- Production deployment: `https://olivehorsefitness.vercel.app/` on Vercel. It responds with HTTP 200 and the built SPA shell, but initial HTML has an empty root and blank title, description and Open Graph values.
- React/Vite source is on `codex/formspree-contact-email`, the base for this feature. The checked-out `master` was the pre-React vanilla JavaScript implementation.
- React is 19.2.7; React DOM is 19.2.7; Vite is 8.1.4; npm is the package manager. The compatible runtime is Node 22.12 through 26.
- Existing routing is a single home route. Footer links to `/privacy-policy` and `/terms` were previously unresolved. No tracked robots, sitemap, blog system, server rendering, SEO test suite or GitHub workflow existed.
- Vercel is configured for Vite and Git deployment. No Vercel token is required for pull-request previews.

## Crawlability and content risks

- Client-side metadata and JSON-LD were injected only after JavaScript execution; canonical URLs were absent.
- The homepage initially exposed no meaningful page content to a non-JavaScript crawler.
- Current image documentation labels all supplied images as AI-generated concepts. The content pack separately identifies phone, timing, maps, qualifications, prices and review consent as needing confirmation.
- The new static renderer, metadata registry and business profile resolve the technical gaps without treating those placeholders as verified facts.

## Selected rendering approach

The project remains React/Vite. After Vite builds the client, a `tsx` static renderer produces meaningful homepage, blog, legal and 404 HTML in `dist`, plus `robots.txt` and `sitemap.xml`. Published Markdown is the only blog content eligible for static routes or the sitemap.
