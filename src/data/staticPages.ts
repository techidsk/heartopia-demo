import { getCollection } from "astro:content";
import { staticPageSchema, translationStatusSchema } from "./heartopiaSchemas";
import { defaultLocale, getLocaleMeta, isLocaleIndexable, localizePath, supportedLocales, type Locale } from "@i18n/config";

export type StaticPage = {
  path: string;
  title: string;
  description: string;
  section: string;
  keywords: string[];
  ogImage?: string;
  content: string;
  translationStatus?: "translated" | "fallback" | "draft";
};

type StaticPageTranslation = Partial<Omit<StaticPage, "path" | "translationStatus">> & {
  path: string;
  translationStatus?: "translated" | "draft";
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
const byPathOrder = <T extends { path: string }>(pages: T[]) => [...pages].sort((a, b) => a.path.localeCompare(b.path));

const staticPageOverlayModules = import.meta.glob("./content/i18n/*/static-pages.json", {
  eager: true,
  import: "default"
}) as Record<string, unknown>;

const staticPageTranslationSchema = staticPageSchema
  .extend({ translationStatus: translationStatusSchema.optional() })
  .partial({ ogImage: true })
  .array();

function loadTranslatedStaticPages() {
  const overlays: Partial<Record<Locale, StaticPageTranslation[]>> = {};
  for (const [modulePath, payload] of Object.entries(staticPageOverlayModules)) {
    const match = modulePath.match(/\/i18n\/([^/]+)\/static-pages\.json$/);
    if (!match) continue;
    const locale = match[1] as Locale;
    if (!supportedLocales.includes(locale) || locale === defaultLocale) continue;
    overlays[locale] = byPathOrder(staticPageTranslationSchema.parse(payload));
  }
  return overlays;
}

async function buildStaticPageState(): Promise<StaticPageState> {
  const englishEntries = await getCollection("staticPages");
  const englishPages = byCollectionOrder(englishEntries).map((page) => ({ ...page, translationStatus: "translated" as const }));
  const translatedStaticPages = loadTranslatedStaticPages();
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
        translationStatus: translation.translationStatus || ("translated" as const)
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
  return (state.translatedStaticPages[locale] || [])
    .filter((page) => page.translationStatus !== "draft")
    .map((page) => page.path);
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
    .filter(({ locale, translated }) => translated && isLocaleIndexable(locale))
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
