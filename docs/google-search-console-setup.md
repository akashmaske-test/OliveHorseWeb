# Google Search Console and OAuth setup

1. Open Google Search Console and add `olivehorsefitness.vercel.app` as a Domain property.
2. Copy the supplied DNS TXT record, add it at the active DNS provider, and complete verification.
3. Open `https://olivehorsefitness.vercel.app/sitemap.xml` and submit it in Search Console after deployment.
4. In Google Cloud, create a project, enable the Google Search Console API, configure the OAuth consent screen, and add yourself as a test user when Google requires it.
5. Create an **OAuth Desktop App** client. Keep the downloaded credentials outside this repository.
6. Put the client ID and secret in local `.env`, set `GSC_SITE_URL=https://olivehorsefitness.vercel.app/`, then run:

```bash
npm run seo:gsc-authorize
npm run seo:gsc-test
```

7. Add `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, and `GSC_SITE_URL` as GitHub Actions secrets. The refresh token is saved locally only at `seo-automation/.secrets/gsc-oauth.local.json`.

To revoke access, remove the app from your Google Account’s third-party access page, then run `npm run seo:gsc-authorize` again. This system uses only `https://www.googleapis.com/auth/webmasters.readonly` and never uses a service account.
