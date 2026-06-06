# Astro Page Factory Architecture

This project now has one deployable Astro lane plus a legacy source tree:

- `site/` stores legacy assets, JSON data, and hand-authored pages that have not moved to Astro yet.
- `.astro-public/` is generated before Astro runs. It copies `site/` while excluding migrated routes.
- `src/` is the new Astro page-factory source that builds to `dist/`.

## Goals

- Keep current URLs and visual language stable.
- Move repeated header, footer, SEO, and page chrome into shared components.
- Generate database and tool pages from validated JSON instead of hand-maintained HTML rows.
- Keep deployment static for Cloudflare Pages.

## Current Generated Scope

- `/fish/` and `/fish/[id]/` are generated from `site/assets/data/fish.json`.
- `/shops/` and `/shops/[id]/` are generated from `site/assets/data/shops.json`.
- `/crops/` and `/crops/[id]/` are generated from `site/assets/data/crops.json`.
- `/recipes/` and `/recipes/[id]/` are generated from `site/assets/data/recipes.json`.
- `/tools/profit-calculator/` is generated from validated crop data.
- `/search/`, `/search-index.json`, `/sitemap.xml`, and `/feed.xml` are generated from `src/data/routes.ts`.

The legacy `site/` tree still provides assets, data, and unmigrated pages while pages move to Astro incrementally. When a route moves to Astro, remove the stale legacy output file and add its path to `src/data/migratedRoutes.json` so the generated page owns that URL.

## Directory Roles

- `src/layouts/BaseLayout.astro`: shared document shell, SEO tags, header, footer, and global CSS link.
- `src/components/`: reusable page chrome such as navigation, breadcrumbs, metrics, and footer groups.
- `src/data/heartopia.ts`: Zod schemas and validated data exports.
- `src/data/routes.ts`: generated route registry for sitemap, feed, and static search.
- `src/data/migratedRoutes.json`: route-conflict exclusions for legacy public copying.
- `src/pages/`: generated URL routes.
- `src/tools/`: small client modules for generated interactive pages.
- `scripts/validate-data.mjs`: JSON shape and duplicate-id validation.
- `scripts/quality-gate.mjs`: built-output SEO/artifact checks.
- `qa/check-layout.mjs`: mobile/desktop overflow QA against `dist/`.

## Adding A Database Page

1. Add or update the JSON data in `site/assets/data/`.
2. Add a Zod schema and parsed export in `src/data/heartopia.ts`.
3. Create `src/pages/<route>/index.astro` for the list page.
4. Add `src/pages/<route>/[id].astro` if the entity needs detail URLs.
5. Reuse `BaseLayout`, `Breadcrumbs`, and `MetricCards`.
6. Add the list route to `src/data/migratedRoutes.json` if it replaces a legacy HTML file.
7. Add sitemap/search entries in `src/data/routes.ts`.
8. Run `npm run validate:data`, `npm run build`, and `npm run qa`.

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
