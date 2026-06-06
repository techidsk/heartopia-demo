import { getSiteConfig } from "@data/site";
import { getStaticPage } from "@data/staticPages";
import { defaultLocale, getLocaleByPathPrefix, getLocaleMeta, supportedLocales, type Locale } from "@i18n/config";

export function getStaticPaths() {
  const localizedLocales = supportedLocales.filter((locale) => locale !== defaultLocale);
  return localizedLocales.map((locale) => ({
    params: { locale: getLocaleMeta(locale).pathPrefix },
    props: { locale }
  }));
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET({ params, props }: { params: { locale?: string }; props: { locale: Locale } }) {
  const locale = getLocaleByPathPrefix(params.locale) || props.locale;
  const meta = getLocaleMeta(locale);
  const siteConfig = getSiteConfig(locale);
  const page = getStaticPage("/404.html", locale);
  const canonical = `${siteConfig.origin}/${meta.pathPrefix}/404.html`;
  const ogImage = new URL(siteConfig.defaultImage, siteConfig.origin).toString();

  return new Response(
    `<!DOCTYPE html><html lang="${escapeHtml(meta.htmlLang)}" dir="${meta.textDirection}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}"><meta name="author" content="${escapeHtml(siteConfig.author)}"><meta name="application-name" content="${escapeHtml(siteConfig.name)}"><meta name="color-scheme" content="light"><meta name="robots" content="noindex,follow"><meta name="theme-color" content="${escapeHtml(siteConfig.themeColor)}"><link rel="canonical" href="${escapeHtml(canonical)}"><link rel="sitemap" type="application/xml" href="/sitemap.xml"><link rel="search" type="application/opensearchdescription+xml" title="${escapeHtml(siteConfig.name)} Search" href="/opensearch.xml"><link rel="alternate" href="/feed.xml" type="application/rss+xml" title="${escapeHtml(siteConfig.name)} RSS"><link rel="alternate" href="/llms.txt" type="text/plain" title="${escapeHtml(siteConfig.name)} LLM guide"><meta property="og:title" content="${escapeHtml(page.title)}"><meta property="og:description" content="${escapeHtml(page.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:image" content="${escapeHtml(ogImage)}"><meta property="og:image:alt" content="${escapeHtml(siteConfig.defaultImageAlt)}"><meta property="og:site_name" content="${escapeHtml(siteConfig.name)}"><meta property="og:locale" content="${escapeHtml(siteConfig.locale)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(page.title)}"><meta name="twitter:description" content="${escapeHtml(page.description)}"><meta name="twitter:image" content="${escapeHtml(ogImage)}"><meta name="twitter:image:alt" content="${escapeHtml(siteConfig.defaultImageAlt)}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="manifest" href="/site.webmanifest"><link rel="stylesheet" href="/assets/styles.css"></head><body class="wiki-body"><main id="main">${page.content}</main></body></html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    }
  );
}
