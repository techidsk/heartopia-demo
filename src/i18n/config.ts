import localesConfig from "./locales.json";

export type Locale = keyof typeof localesConfig.locales;

export type LocaleMeta = {
  label: string;
  htmlLang: string;
  language: string;
  ogLocale: string;
  pathPrefix: string;
  textDirection: "ltr" | "rtl";
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

export function getLocaleMeta(locale: Locale = defaultLocale) {
  return locales[locale];
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

export function getAlternateLocalePaths(path: string) {
  return supportedLocales.map((locale) => ({
    locale,
    hrefLang: getLocaleMeta(locale).language,
    path: localizePath(path, locale)
  }));
}
