# Agent Notes

## I18n Contract

- Keep the English site as the default, unprefixed locale. New locales must be added through `src/i18n/locales.json` with a non-empty `pathPrefix`.
- Do not hardcode new site-level copy in layouts, shared components, route indexes, or browser scripts when it should vary by language. Put shared UI strings in `src/i18n/messages.ts`, site chrome in `src/data/site.ts`, and static page content behind `getStaticPages(locale)` / `getStaticPage(path, locale)`.
- Route, feed, sitemap, search-index, OpenSearch, and `llms.txt` data must be produced through the locale-aware helpers in `src/data/routes.ts` and `src/data/site.ts`.
- Client-side labels and state text should read from the injected `#site-i18n-messages` payload through `src/tools/i18n.ts` when they are part of reusable UI behavior.
- When adding a locale, avoid publishing indexable fallback pages that still contain default-language body content. Missing translations should be explicit and caught before they enter locale sitemaps.
- Run `npm run validate:i18n` after changing locale metadata, site chrome, static-page wiring, route generation, or i18n message contracts. Run full `npm run qa` before release-oriented changes.
