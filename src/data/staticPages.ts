import { getCollection } from "astro:content";
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

type StaticPageState = {
  staticPagesByLocale: Record<Locale, StaticPage[]>;
  pagesByLocale: Record<Locale, Map<string, StaticPage>>;
  englishPagesByPath: Map<string, StaticPage>;
  translatedStaticPages: Partial<Record<Locale, StaticPageTranslation[]>>;
};

let statePromise: Promise<StaticPageState> | undefined;

const normalizeStaticPath = (path: string) => (path === "/" || path.endsWith("/") || path.endsWith(".html") ? path : `${path}/`);
const byCollectionOrder = <T extends { path: string }>(entries: Array<{ data: T }>) =>
  entries.map((entry) => entry.data).sort((a, b) => a.path.localeCompare(b.path));

async function buildStaticPageState(): Promise<StaticPageState> {
  const [englishEntries, zhHansEntries] = await Promise.all([getCollection("staticPages"), getCollection("zhHansStaticPages")]);
  const englishPages = byCollectionOrder(englishEntries).map((page) => ({ ...page, translationStatus: "translated" as const }));
  const translatedStaticPages = {
    "zh-Hans": byCollectionOrder(zhHansEntries) as StaticPageTranslation[]
  } satisfies Partial<Record<Locale, StaticPageTranslation[]>>;
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

  return { staticPagesByLocale, pagesByLocale, englishPagesByPath, translatedStaticPages };
}

async function getStaticPageState() {
  statePromise ||= buildStaticPageState();
  return statePromise;
}

export async function getStaticPages(locale: Locale = defaultLocale) {
  return (await getStaticPageState()).staticPagesByLocale[locale];
}

export async function getTranslatedStaticPagePaths(locale: Locale = defaultLocale) {
  const state = await getStaticPageState();
  if (locale === defaultLocale) return [...state.englishPagesByPath.keys()];
  return (state.translatedStaticPages[locale] || []).map((page) => page.path);
}

export async function isStaticPageTranslated(path: string, locale: Locale = defaultLocale) {
  const normalized = normalizeStaticPath(path);
  return (await getTranslatedStaticPagePaths(locale)).includes(normalized);
}

export async function getStaticPageAlternateLocalePaths(path: string) {
  const normalized = normalizeStaticPath(path);
  const translatedLocales = await Promise.all(
    supportedLocales.map(async (locale) => ({
      locale,
      translated: await isStaticPageTranslated(normalized, locale)
    }))
  );
  return translatedLocales
    .filter(({ translated }) => translated)
    .map(({ locale }) => ({
      locale,
      hrefLang: getLocaleMeta(locale).language,
      path: localizePath(normalized, locale)
    }));
}

export async function getStaticPage(path: string, locale: Locale = defaultLocale) {
  const normalized = normalizeStaticPath(path);
  const page = (await getStaticPageState()).pagesByLocale[locale].get(normalized);
  if (!page) throw new Error(`Static page not found for ${locale}: ${path}`);
  return page;
}
