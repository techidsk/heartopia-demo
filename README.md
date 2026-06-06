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
npm run validate:data
npm run build
npm run quality
npm run qa
```

The Astro page-factory source lives in `src/` and builds to `dist/`. The existing `site/` directory remains the legacy static site. Before Astro runs, `scripts/prepare-public.mjs` copies legacy files into `.astro-public/` and excludes routes listed in `src/data/migratedRoutes.json`.

Generated sitemap, RSS feed, and static search index are built from `src/data/routes.ts`:

```powershell
dist/sitemap.xml
dist/feed.xml
dist/search-index.json
```

## Deploy

```powershell
npm run deploy
```

The normal deploy command builds `dist/` first, then deploys it to Cloudflare Pages with Wrangler. Legacy deploy is still available with `npm run deploy:legacy`.

See `DOC/astro-page-factory.md` for the scaffold architecture and page migration workflow.

## AdSense Before Submission

- Replace the contact placeholder at `/contact/` with a monitored owner email.
- `ads.txt` is configured for `pub-1476592629109289`.
- The AdSense verification script is injected into indexable page `<head>` output.
- Submit `https://heartopia.blog/sitemap.xml` in Google Search Console.
