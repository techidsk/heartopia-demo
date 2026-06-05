# Heartopia Guidebook

Independent Heartopia fan guide website prepared for Cloudflare Pages and Google AdSense readiness.

## Local Preview

```powershell
npm run dev
```

Legacy static preview:

```powershell
npm run dev:legacy
```

## Build And QA

```powershell
npm run build
npm run qa
```

The Astro page-factory source lives in `src/` and builds to `dist/`. The existing `site/` directory remains the legacy static site. Before Astro runs, `scripts/prepare-public.mjs` copies legacy files into `.astro-public/` and excludes routes now owned by Astro.

## Deploy

```powershell
npm run deploy
```

Legacy deploy is still available with `npm run deploy:legacy`.

See `DOC/astro-page-factory.md` for the scaffold architecture and page migration workflow.

## AdSense Before Submission

- Replace the contact placeholder at `/contact/` with a monitored owner email.
- Replace the commented `ads.txt` placeholder with the real AdSense publisher line.
- Add the AdSense verification snippet to the `<head>` after Google issues the publisher ID.
- Submit `https://heartopia-demo.pages.dev/sitemap.xml` in Google Search Console.
