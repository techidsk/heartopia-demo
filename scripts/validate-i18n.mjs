import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localesPath = path.join(rootDir, "src", "i18n", "locales.json");
const astroConfigPath = path.join(rootDir, "astro.config.mjs");
const tsconfigPath = path.join(rootDir, "tsconfig.json");
const sitePath = path.join(rootDir, "src", "data", "site.ts");
const routesPath = path.join(rootDir, "src", "data", "routes.ts");
const staticPagesPath = path.join(rootDir, "src", "data", "staticPages.ts");
const sitemapPath = path.join(rootDir, "src", "pages", "sitemap.xml.ts");
const searchIndexPath = path.join(rootDir, "src", "pages", "search-index.json.ts");
const staticPagesJsonPath = path.join(rootDir, "src", "data", "content", "static-pages.json");
const contentDir = path.join(rootDir, "src", "data", "content");
const staticPagesI18nDir = path.join(rootDir, "src", "data", "content", "i18n");
const localizedIndexPath = path.join(rootDir, "src", "pages", "[locale]", "index.astro");
const localizedSlugPath = path.join(rootDir, "src", "pages", "[locale]", "[...slug].astro");
const dataOverlayFiles = ["fish", "shops", "crops", "gardening", "insects", "recipes", "events", "npcs", "pets", "hobbies", "tools"];
const codesSections = ["activeCandidates", "expiredArchive"];

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
if (!siteSource.includes("localizedSiteContent") || !siteSource.includes("Locale")) {
  failures.push("src/data/site.ts: localized site content should be typed against Locale");
}
if (!siteSource.includes("localizedSiteContent[defaultLocale]") || !siteSource.includes("localizedSiteContent.en")) {
  failures.push("src/data/site.ts: site chrome should fall back when a locale has no explicit localized copy");
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
if (!staticPagesSource.includes("getStaticPageAlternateLocalePaths")) {
  failures.push("src/data/staticPages.ts: translated static pages should expose page-level alternate locale paths");
}

const routesSource = await readText(routesPath);
if (!routesSource.includes("getIndexableRouteEntries")) {
  failures.push("src/data/routes.ts: missing getIndexableRouteEntries for SEO/search artifacts");
}
if (!routesSource.includes("isLocaleIndexable")) {
  failures.push("src/data/routes.ts: getIndexableRouteEntries should filter localized artifacts by locale indexable status");
}

for (const [filePath, artifact] of [
  [sitemapPath, "sitemap"],
  [searchIndexPath, "search index"]
]) {
  const source = await readText(filePath);
  if (!source.includes("getIndexableRouteEntries")) {
    failures.push(`${path.relative(rootDir, filePath)}: ${artifact} should use getIndexableRouteEntries`);
  }
}

const defaultStaticPages = JSON.parse(await readText(staticPagesJsonPath));
const defaultStaticPagePaths = new Set(defaultStaticPages.map((page) => page.path));
const sourceDataByName = Object.fromEntries(
  await Promise.all(dataOverlayFiles.map(async (name) => [name, JSON.parse(await readText(path.join(contentDir, `${name}.json`)))]))
);
const sourceDataIdsByName = Object.fromEntries(
  Object.entries(sourceDataByName).map(([name, rows]) => [name, new Set(rows.map((row) => row.id))])
);
const sourceCodes = JSON.parse(await readText(path.join(contentDir, "codes.json")));

try {
  const localeDirs = await fs.readdir(staticPagesI18nDir);
  const translatedLocales = new Set();
  const localeCoverage = new Map();
  for (const locale of localeDirs) {
    const localeDir = path.join(staticPagesI18nDir, locale);
    const stat = await fs.stat(localeDir);
    if (!stat.isDirectory()) continue;
    if (!localeCodes.includes(locale)) {
      failures.push(`src/data/content/i18n/${locale}: locale is not declared in locales.json`);
      continue;
    }
    if (locale === defaultLocale) failures.push(`src/data/content/i18n/${locale}: default locale should use static-pages.json directly`);
    translatedLocales.add(locale);
    const coverage = {
      translatedStaticPaths: new Set(),
      translatedDataIdsByName: Object.fromEntries(dataOverlayFiles.map((name) => [name, new Set()])),
      localizedCodeValuesBySection: Object.fromEntries(codesSections.map((name) => [name, new Set()]))
    };
    localeCoverage.set(locale, coverage);

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
      if (page.translationStatus !== "draft") coverage.translatedStaticPaths.add(page.path);
      for (const key of ["title", "description", "section", "content"]) {
        if (typeof page[key] !== "string" || !page[key].trim()) failures.push(`${label}: ${key} must be a non-empty string`);
      }
      if (!Array.isArray(page.keywords) || !page.keywords.length) failures.push(`${label}: keywords must be a non-empty array`);
      if (page.translationStatus && !["translated", "draft"].includes(page.translationStatus)) {
        failures.push(`${label}: translationStatus must be translated or draft`);
      }
    }

    for (const dataSet of dataOverlayFiles) {
      const dataOverlayPath = path.join(localeDir, "data", `${dataSet}.json`);
      let rows = [];
      try {
        rows = JSON.parse(await readText(dataOverlayPath));
      } catch {
        failures.push(`src/data/content/i18n/${locale}/data/${dataSet}.json: missing or invalid JSON`);
        continue;
      }
      if (!Array.isArray(rows)) {
        failures.push(`src/data/content/i18n/${locale}/data/${dataSet}.json: expected an array`);
        continue;
      }
      const sourceIds = sourceDataIdsByName[dataSet];
      const seenIds = new Set();
      for (const [index, row] of rows.entries()) {
        const label = `src/data/content/i18n/${locale}/data/${dataSet}.json[${index}]`;
        if (!row.id || typeof row.id !== "string") {
          failures.push(`${label}: id must be a string`);
          continue;
        }
        if (!sourceIds.has(row.id)) failures.push(`${label}: id '${row.id}' does not exist in default ${dataSet}.json`);
        if (seenIds.has(row.id)) failures.push(`${label}: duplicate translation id '${row.id}'`);
        seenIds.add(row.id);
        if (row.translationStatus && !["translated", "draft"].includes(row.translationStatus)) {
          failures.push(`${label}: translationStatus must be translated or draft`);
        }
        if (row.translationStatus !== "draft") coverage.translatedDataIdsByName[dataSet].add(row.id);
      }
    }

    const codesOverlayPath = path.join(localeDir, "data", "codes.json");
    let codesOverlay;
    try {
      codesOverlay = JSON.parse(await readText(codesOverlayPath));
    } catch {
      failures.push(`src/data/content/i18n/${locale}/data/codes.json: missing or invalid JSON`);
      codesOverlay = {};
    }
    for (const section of codesSections) {
      const rows = codesOverlay?.[section];
      if (!Array.isArray(rows)) {
        failures.push(`src/data/content/i18n/${locale}/data/codes.json: ${section} must be an array`);
        continue;
      }
      const sourceCodesForSection = new Set(sourceCodes[section].map((row) => row.code));
      const seenCodes = new Set();
      for (const [index, row] of rows.entries()) {
        const label = `src/data/content/i18n/${locale}/data/codes.json.${section}[${index}]`;
        if (!row.code || typeof row.code !== "string") {
          failures.push(`${label}: code must be a string`);
          continue;
        }
        if (!sourceCodesForSection.has(row.code)) failures.push(`${label}: code '${row.code}' does not exist in default codes.json`);
        if (seenCodes.has(row.code)) failures.push(`${label}: duplicate code '${row.code}'`);
        seenCodes.add(row.code);
        coverage.localizedCodeValuesBySection[section].add(row.code);
      }
    }
  }

  for (const code of localeCodes) {
    const meta = localesConfig.locales[code] || {};
    if (code !== defaultLocale && meta.indexable && !translatedLocales.has(code)) {
      failures.push(`locales.json: indexable locale '${code}' must have a translation overlay directory`);
    }
    if (code !== defaultLocale && meta.indexable && translatedLocales.has(code)) {
      const coverage = localeCoverage.get(code);
      const missingStaticPages = defaultStaticPages.filter((page) => !coverage.translatedStaticPaths.has(page.path));
      if (missingStaticPages.length) {
        failures.push(`locales.json: indexable locale '${code}' is missing ${missingStaticPages.length} static page translation(s)`);
      }
      for (const dataSet of dataOverlayFiles) {
        const missingRows = sourceDataByName[dataSet].filter((row) => !coverage.translatedDataIdsByName[dataSet].has(row.id));
        if (missingRows.length) failures.push(`locales.json: indexable locale '${code}' is missing ${missingRows.length} ${dataSet} translation row(s)`);
      }
      for (const section of codesSections) {
        const missingCodes = sourceCodes[section].filter((row) => !coverage.localizedCodeValuesBySection[section].has(row.code));
        if (missingCodes.length) failures.push(`locales.json: indexable locale '${code}' is missing ${missingCodes.length} codes.${section} translation row(s)`);
      }
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
