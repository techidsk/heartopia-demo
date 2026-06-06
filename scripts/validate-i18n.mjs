import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localesPath = path.join(rootDir, "src", "i18n", "locales.json");
const astroConfigPath = path.join(rootDir, "astro.config.mjs");
const tsconfigPath = path.join(rootDir, "tsconfig.json");
const sitePath = path.join(rootDir, "src", "data", "site.ts");
const staticPagesPath = path.join(rootDir, "src", "data", "staticPages.ts");

const failures = [];
const readText = (filePath) => fs.readFile(filePath, "utf8");

const localesConfig = JSON.parse(await readText(localesPath));
const localeCodes = Object.keys(localesConfig.locales || {});
const defaultLocale = localesConfig.defaultLocale;

if (!defaultLocale) failures.push("locales.json: missing defaultLocale");
if (!localeCodes.length) failures.push("locales.json: must declare at least one locale");
if (defaultLocale && !localeCodes.includes(defaultLocale)) {
  failures.push(`locales.json: defaultLocale '${defaultLocale}' is not declared in locales`);
}

const prefixes = new Map();
for (const code of localeCodes) {
  const meta = localesConfig.locales[code] || {};
  for (const key of ["label", "htmlLang", "language", "ogLocale", "pathPrefix", "textDirection"]) {
    if (typeof meta[key] !== "string") failures.push(`locales.json: ${code}.${key} must be a string`);
  }

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
if (!siteSource.includes("satisfies Record<") || !siteSource.includes("Locale")) {
  failures.push("src/data/site.ts: localized site content should be typed against Locale");
}

const staticPagesSource = await readText(staticPagesPath);
if (!staticPagesSource.includes("staticPagesByLocale") || !staticPagesSource.includes("Record<Locale")) {
  failures.push("src/data/staticPages.ts: static pages should be keyed by Locale");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`i18n contract passed for ${localeCodes.length} locale${localeCodes.length === 1 ? "" : "s"}.`);
}
