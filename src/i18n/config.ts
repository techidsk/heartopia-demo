import localesConfig from "./locales.json";

export type Locale = keyof typeof localesConfig.locales;

export type LocaleMeta = {
  label: string;
  htmlLang: string;
  language: string;
  ogLocale: string;
  pathPrefix: string;
  textDirection: "ltr" | "rtl";
  indexable: boolean;
};

export const defaultLocale = localesConfig.defaultLocale as Locale;
export const locales = localesConfig.locales as Record<Locale, LocaleMeta>;
export const supportedLocales = Object.keys(locales) as Locale[];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && value in locales;
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getLocaleByPathPrefix(value: unknown) {
  if (typeof value !== "string") return undefined;
  return supportedLocales.find((locale) => getLocaleMeta(locale).pathPrefix === value);
}

export function getLocaleMeta(locale: Locale = defaultLocale) {
  return locales[locale];
}

export function isLocaleIndexable(locale: Locale = defaultLocale) {
  return getLocaleMeta(locale).indexable;
}

export function localizePath(path: string, locale: Locale = defaultLocale) {
  const meta = getLocaleMeta(locale);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!meta.pathPrefix) return normalizedPath;
  if (normalizedPath === "/") return `/${meta.pathPrefix}/`;
  return `/${meta.pathPrefix}${normalizedPath}`;
}

export function getCanonicalPath(path: string, locale: Locale = defaultLocale) {
  return localizePath(path, locale);
}

export function sourcePathFromLocalizedPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const sortedLocales = [...supportedLocales].sort((a, b) => getLocaleMeta(b).pathPrefix.length - getLocaleMeta(a).pathPrefix.length);
  for (const locale of sortedLocales) {
    const prefix = getLocaleMeta(locale).pathPrefix;
    if (!prefix) continue;
    if (normalizedPath === `/${prefix}/` || normalizedPath === `/${prefix}`) return "/";
    if (normalizedPath.startsWith(`/${prefix}/`)) {
      const sourcePath = normalizedPath.slice(prefix.length + 1);
      return sourcePath.startsWith("/") ? sourcePath : `/${sourcePath}`;
    }
  }
  return normalizedPath;
}

export function getAlternateLocalePaths(path: string, options: { includeFallbackLocales?: boolean } = {}) {
  const sourcePath = sourcePathFromLocalizedPath(path);
  const localesForLinks = options.includeFallbackLocales ? supportedLocales : supportedLocales.filter((locale) => isLocaleIndexable(locale));
  return localesForLinks.map((locale) => ({
    locale,
    hrefLang: getLocaleMeta(locale).language,
    path: localizePath(sourcePath, locale)
  }));
}
