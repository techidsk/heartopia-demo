# Astro Page Factory Architecture

This project now has one deployable Astro lane:

- `src/` is the new Astro page-factory source that builds to `dist/`.
- `src/data/content/` stores canonical JSON data and migrated static page content.
- `public/` stores browser-visible static assets such as images, CSS, favicon, manifest, `ads.txt`, and Cloudflare `_headers`.

## Goals

- Keep current URLs and visual language stable.
- Move repeated header, footer, SEO, and page chrome into shared components.
- Generate database and tool pages from validated JSON instead of hand-maintained HTML rows.
- Keep deployment static for Cloudflare Pages.

## Current Generated Scope

- `/fish/` and `/fish/[id]/` are generated from `src/data/content/fish.json`.
- `/shops/` and `/shops/[id]/` are generated from `src/data/content/shops.json`.
- `/crops/` and `/crops/[id]/` are generated from `src/data/content/crops.json`.
- `/recipes/` and `/recipes/[id]/` are generated from `src/data/content/recipes.json`.
- `/tools/profit-calculator/` is generated from validated crop data.
- Migrated static guide, tool, hobby, legal, home, and 404 pages are generated from `src/data/content/static-pages.json` through `src/pages/[...slug].astro`.
- `/search/`, `/search-index.json`, `/sitemap.xml`, and `/feed.xml` are generated from `src/data/routes.ts`.

## Directory Roles

- `src/layouts/BaseLayout.astro`: shared document shell, SEO tags, header, footer, and global CSS link.
- `src/components/`: reusable page chrome such as navigation, breadcrumbs, metrics, and footer groups.
- `src/data/heartopia.ts`: Zod schemas and validated data exports.
- `src/data/staticPages.ts`: migrated static page registry and lookup helper.
- `src/data/routes.ts`: generated route registry for sitemap, feed, and static search.
- `src/pages/`: generated URL routes.
- `src/tools/`: small client modules for generated interactive pages.
- `scripts/validate-data.mjs`: JSON shape and duplicate-id validation.
- `scripts/quality-gate.mjs`: built-output SEO/artifact checks.
- `qa/check-layout.mjs`: mobile/desktop overflow QA against `dist/`.

## Adding A Database Page

1. Add or update the JSON data in `src/data/content/`.
2. Add a Zod schema and parsed export in `src/data/heartopia.ts`.
3. Create `src/pages/<route>/index.astro` for the list page.
4. Add `src/pages/<route>/[id].astro` if the entity needs detail URLs.
5. Reuse `BaseLayout`, `Breadcrumbs`, and `MetricCards`.
6. Add sitemap/search entries in `src/data/routes.ts`.
7. Run `npm run validate:data`, `npm run build`, and `npm run qa`.

## Adding A Tool Page

1. Keep the source data in JSON where possible.
2. Render the form and seed data from Astro.
3. Put client logic in `src/tools/<tool-name>.ts`.
4. Store only user state in `localStorage`; do not duplicate canonical data in the script.
5. Run `npm run qa` and manually check the tool at mobile width.

## Generated SEO And Search

- `src/pages/sitemap.xml.ts` renders XML from `routeEntries`.
- `src/pages/feed.xml.ts` renders RSS from `feedEntries`.
- `src/pages/search-index.json.ts` exposes the same route registry as JSON.
- `src/pages/search/index.astro` provides the current lightweight static search UI.
- `npm run quality` checks representative HTML routes, sitemap, feed, and search index after build.

## Commands

```powershell
npm run dev
npm run validate:data
npm run build
npm run quality
npm run preview
npm run qa
npm run deploy
```
