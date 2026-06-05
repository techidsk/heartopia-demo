# Astro Page Factory Architecture

This project now has two static-site lanes:

- `site/` is the legacy hand-authored publishable site.
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
- `/tools/profit-calculator/` is generated from `site/assets/data/crops.json`.

The legacy `site/` tree still provides the rest of the site while pages are migrated incrementally. When a route moves to Astro, add its legacy `index.html` to `generatedRouteFiles` in `scripts/prepare-public.mjs` so the generated page can own that URL.

## Directory Roles

- `src/layouts/BaseLayout.astro`: shared document shell, SEO tags, header, footer, and global CSS link.
- `src/components/`: reusable page chrome such as navigation, breadcrumbs, metrics, and footer groups.
- `src/data/heartopia.ts`: Zod schemas and validated data exports.
- `src/pages/`: generated URL routes.
- `src/tools/`: small client modules for generated interactive pages.
- `qa/check-layout.mjs`: mobile/desktop overflow QA against `dist/`.

## Adding A Database Page

1. Add or update the JSON data in `site/assets/data/`.
2. Add a Zod schema and parsed export in `src/data/heartopia.ts`.
3. Create `src/pages/<route>/index.astro` for the list page.
4. Add `src/pages/<route>/[id].astro` if the entity needs detail URLs.
5. Reuse `BaseLayout`, `Breadcrumbs`, and `MetricCards`.
6. Run `npm run build` and `npm run qa`.

## Adding A Tool Page

1. Keep the source data in JSON where possible.
2. Render the form and seed data from Astro.
3. Put client logic in `src/tools/<tool-name>.ts`.
4. Store only user state in `localStorage`; do not duplicate canonical data in the script.
5. Run `npm run qa` and manually check the tool at mobile width.

## Commands

```powershell
npm run dev
npm run build
npm run preview
npm run qa
npm run deploy
```

Use `npm run dev:legacy` and `npm run deploy:legacy` only when you need the old `site/` output directly.
