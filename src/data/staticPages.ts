import rawPages from "./content/static-pages.json";
import zhHansStaticPages from "./content/i18n/zh-Hans/static-pages.json";
import { defaultLocale, getLocaleMeta, localizePath, supportedLocales, type Locale } from "@i18n/config";

export type StaticPage = {
  path: string;
  title: string;
  description: string;
  section: string;
  keywords: string[];
  ogImage?: string;
  content: string;
  translationStatus?: "translated" | "fallback";
};

type StaticPageTranslation = Partial<Omit<StaticPage, "path" | "translationStatus">> & {
  path: string;
};

const translatedStaticPages = {
  "zh-Hans": zhHansStaticPages as StaticPageTranslation[]
} satisfies Partial<Record<Locale, StaticPageTranslation[]>>;

const englishPages = (rawPages as StaticPage[]).map((page) => ({ ...page, translationStatus: "translated" as const }));
const englishPagesByPath = new Map(englishPages.map((page) => [page.path, page]));

const makeLocalizedPages = (locale: Locale) => {
  const translationsByPath = new Map((translatedStaticPages[locale] || []).map((page) => [page.path, page]));
  return englishPages.map((page) => {
    const translation = translationsByPath.get(page.path);
    if (!translation) {
      return {
        ...page,
        keywords: [...page.keywords, locale],
        translationStatus: "fallback" as const
      };
    }

    return {
      ...page,
      ...translation,
      keywords: translation.keywords || [...page.keywords, locale],
      ogImage: translation.ogImage || page.ogImage,
      translationStatus: "translated" as const
    };
  });
};

const staticPagesByLocale = Object.fromEntries(
  supportedLocales.map((locale) => [locale, locale === defaultLocale ? englishPages : makeLocalizedPages(locale)])
) as Record<Locale, StaticPage[]>;

const pagesByLocale = Object.fromEntries(
  Object.entries(staticPagesByLocale).map(([locale, pages]) => [locale, new Map(pages.map((page) => [page.path, page]))])
) as Record<Locale, Map<string, StaticPage>>;

export function getStaticPages(locale: Locale = defaultLocale) {
  return staticPagesByLocale[locale];
}

export const staticPages = getStaticPages(defaultLocale);

const normalizeStaticPath = (path: string) => (path === "/" || path.endsWith("/") || path.endsWith(".html") ? path : `${path}/`);

export function getTranslatedStaticPagePaths(locale: Locale = defaultLocale) {
  if (locale === defaultLocale) return [...englishPagesByPath.keys()];
  return (translatedStaticPages[locale] || []).map((page) => page.path);
}

export function isStaticPageTranslated(path: string, locale: Locale = defaultLocale) {
  const normalized = normalizeStaticPath(path);
  return getTranslatedStaticPagePaths(locale).includes(normalized);
}

export function getStaticPageAlternateLocalePaths(path: string) {
  const normalized = normalizeStaticPath(path);
  return supportedLocales
    .filter((locale) => isStaticPageTranslated(normalized, locale))
    .map((locale) => ({
      locale,
      hrefLang: getLocaleMeta(locale).language,
      path: localizePath(normalized, locale)
    }));
}

export function getStaticPage(path: string, locale: Locale = defaultLocale) {
  const normalized = normalizeStaticPath(path);
  const page = pagesByLocale[locale].get(normalized);
  if (!page) throw new Error(`Static page not found for ${locale}: ${path}`);
  return page;
}
