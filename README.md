# Heartopia Guidebook

Independent Heartopia fan guide website prepared for Cloudflare Pages and Google AdSense readiness.

## Local Preview

```powershell
npx serve site
```

## Deploy

```powershell
npx wrangler pages deploy site --project-name heartopia-demo
```

## AdSense Before Submission

- Replace the contact placeholder at `/contact/` with a monitored owner email.
- Replace the commented `ads.txt` placeholder with the real AdSense publisher line.
- Add the AdSense verification snippet to the `<head>` after Google issues the publisher ID.
- Submit `https://heartopia-demo.pages.dev/sitemap.xml` in Google Search Console.
