import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localesPath = path.join(rootDir, "src", "i18n", "locales.json");
const astroConfigPath = path.join(rootDir, "astro.config.mjs");
const tsconfigPath = path.join(rootDir, "tsconfig.json");
const sitePath = path.join(rootDir, "src", "data", "site.ts");
const staticPagesPath = path.join(rootDir, "src", "data", "staticPages.ts");
const staticPagesJsonPath = path.join(rootDir, "src", "data", "content", "static-pages.json");
const staticPagesI18nDir = path.join(rootDir, "src", "data", "content", "i18n");
const localizedIndexPath = path.join(rootDir, "src", "pages", "[locale]", "index.astro");
const localizedSlugPath = path.join(rootDir, "src", "pages", "[locale]", "[...slug].astro");

const failures = [];
const readText = (filePath) => fs.readFile(filePath, "utf8");

const localesConfig = JSON.parse(await readText(localesPath));
const localeCodes = Object.keys(localesConfig.locales || {});
const defaultLocale = localesConfig.defaultLocale;

if (!defaultLocale) failures.push("locales.json: missing defaultLocale");
if (localeCodes.length < 12) failures.push("locales.json: expected the 12 supported in-game language locales");
if (defaultLocale && !localeCodes.includes(defaultLocale)) {
  failures.push(`locales.json: defaultLocale '${defaultLocale}' is not declared in locales`);
}

const prefixes = new Map();
for (const code of localeCodes) {
  const meta = localesConfig.locales[code] || {};
  for (const key of ["label", "htmlLang", "language", "ogLocale", "pathPrefix", "textDirection"]) {
    if (typeof meta[key] !== "string") failures.push(`locales.json: ${code}.${key} must be a string`);
  }

  if (typeof meta.indexable !== "boolean") failures.push(`locales.json: ${code}.indexable must be a boolean`);

  if (meta.textDirection && !["ltr", "rtl"].includes(meta.textDirection)) {
    failures.push(`locales.json: ${code}.textDirection must be ltr or rtl`);
  }

  if (meta.pathPrefix && (meta.pathPrefix.startsWith("/") || meta.pathPrefix.endsWith("/"))) {
    failures.push(`locales.json: ${code}.pathPrefix must not include leading or trailing slashes`);
  }

  if (code !== defaultLocale && !meta.pathPrefix) {
    failures.push(`locales.json: non-default locale '${code}' must define a pathPrefix`);
  }

  if (code !== defaultLocale && meta.indexable) {
    failures.push(`locales.json: non-default locale '${code}' must stay non-indexable until translated content exists`);
  }

  const prefixKey = meta.pathPrefix || "(root)";
  const existing = prefixes.get(prefixKey);
  if (existing) {
    failures.push(`locales.json: ${code}.pathPrefix duplicates ${existing}`);
  }
  prefixes.set(prefixKey, code);
}

const astroConfig = await readText(astroConfigPath);
if (!astroConfig.includes("./src/i18n/locales.json")) {
  failures.push("astro.config.mjs: must read src/i18n/locales.json for i18n configuration");
}

const tsconfig = JSON.parse(await readText(tsconfigPath));
if (!tsconfig.compilerOptions?.paths?.["@i18n/*"]) {
  failures.push("tsconfig.json: missing @i18n/* path alias");
}

const siteSource = await readText(sitePath);
if (!siteSource.includes("satisfies Record<") || !siteSource.includes("Locale")) {
  failures.push("src/data/site.ts: localized site content should be typed against Locale");
}

const staticPagesSource = await readText(staticPagesPath);
if (!staticPagesSource.includes("staticPagesByLocale") || !staticPagesSource.includes("Record<Locale")) {
  failures.push("src/data/staticPages.ts: static pages should be keyed by Locale");
}
if (!staticPagesSource.includes("translationStatus")) {
  failures.push("src/data/staticPages.ts: localized static-page fallback status must be explicit");
}
if (!staticPagesSource.includes("translatedStaticPages")) {
  failures.push("src/data/staticPages.ts: static-page translations should load locale overlay files");
}

const defaultStaticPages = JSON.parse(await readText(staticPagesJsonPath));
const defaultStaticPagePaths = new Set(defaultStaticPages.map((page) => page.path));
try {
  const localeDirs = await fs.readdir(staticPagesI18nDir);
  for (const locale of localeDirs) {
    const localeDir = path.join(staticPagesI18nDir, locale);
    const stat = await fs.stat(localeDir);
    if (!stat.isDirectory()) continue;
    if (!localeCodes.includes(locale)) {
      failures.push(`src/data/content/i18n/${locale}: locale is not declared in locales.json`);
      continue;
    }
    if (locale === defaultLocale) failures.push(`src/data/content/i18n/${locale}: default locale should use static-pages.json directly`);

    const overlayPath = path.join(localeDir, "static-pages.json");
    let overlayPages = [];
    try {
      overlayPages = JSON.parse(await readText(overlayPath));
    } catch {
      failures.push(`src/data/content/i18n/${locale}/static-pages.json: missing or invalid JSON`);
      continue;
    }

    const seenPaths = new Set();
    for (const [index, page] of overlayPages.entries()) {
      const label = `src/data/content/i18n/${locale}/static-pages.json[${index}]`;
      if (!page.path || typeof page.path !== "string") {
        failures.push(`${label}: path must be a string`);
        continue;
      }
      if (!defaultStaticPagePaths.has(page.path)) failures.push(`${label}: path '${page.path}' does not exist in default static pages`);
      if (seenPaths.has(page.path)) failures.push(`${label}: duplicate translation path '${page.path}'`);
      seenPaths.add(page.path);
      for (const key of ["title", "description", "section", "content"]) {
        if (typeof page[key] !== "string" || !page[key].trim()) failures.push(`${label}: ${key} must be a non-empty string`);
      }
      if (!Array.isArray(page.keywords) || !page.keywords.length) failures.push(`${label}: keywords must be a non-empty array`);
    }
  }
} catch {
  failures.push("src/data/content/i18n: missing static-page translation overlay directory");
}

for (const filePath of [localizedIndexPath, localizedSlugPath]) {
  try {
    await fs.stat(filePath);
  } catch {
    failures.push(`${path.relative(rootDir, filePath)}: missing localized page route`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`i18n contract passed for ${localeCodes.length} locale${localeCodes.length === 1 ? "" : "s"}.`);
}
