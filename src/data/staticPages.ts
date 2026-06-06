import rawPages from "./content/static-pages.json";
import { defaultLocale, type Locale } from "@i18n/config";

export type StaticPage = {
  path: string;
  title: string;
  description: string;
  section: string;
  keywords: string[];
  ogImage?: string;
  content: string;
};

const staticPagesByLocale = {
  en: rawPages as StaticPage[]
} satisfies Record<Locale, StaticPage[]>;

const pagesByLocale = Object.fromEntries(
  Object.entries(staticPagesByLocale).map(([locale, pages]) => [locale, new Map(pages.map((page) => [page.path, page]))])
) as Record<Locale, Map<string, StaticPage>>;

export function getStaticPages(locale: Locale = defaultLocale) {
  return staticPagesByLocale[locale];
}

export const staticPages = getStaticPages(defaultLocale);

export function getStaticPage(path: string, locale: Locale = defaultLocale) {
  const normalized = path === "/" || path.endsWith("/") || path.endsWith(".html") ? path : `${path}/`;
  const page = pagesByLocale[locale].get(normalized);
  if (!page) throw new Error(`Static page not found for ${locale}: ${path}`);
  return page;
}
