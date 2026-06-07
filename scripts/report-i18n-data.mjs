import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(rootDir, "src", "data", "content");
const i18nDir = path.join(contentDir, "i18n");
const localesPath = path.join(rootDir, "src", "i18n", "locales.json");

const dataSets = ["fish", "shops", "crops", "gardening", "insects", "recipes", "events", "npcs", "pets", "hobbies", "tools"];
const codesSections = ["activeCandidates", "expiredArchive"];

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, "utf8"));
const percent = (count, total) => (total === 0 ? "0.0%" : `${((count / total) * 100).toFixed(1)}%`);
const exists = async (filePath) => Boolean(await fs.stat(filePath).catch(() => null));

function countPublishedRows(rows) {
  return rows.filter((row) => row.translationStatus !== "draft").length;
}

function countDraftRows(rows) {
  return rows.filter((row) => row.translationStatus === "draft").length;
}

const localesConfig = await readJson(localesPath);
const defaultLocale = localesConfig.defaultLocale;
const localeCodes = Object.keys(localesConfig.locales || {}).filter((locale) => locale !== defaultLocale);
const sourceStaticPages = await readJson(path.join(contentDir, "static-pages.json"));
const sourceCounts = Object.fromEntries(
  await Promise.all(
    dataSets.map(async (name) => {
      const sourceRows = await readJson(path.join(contentDir, `${name}.json`));
      return [name, sourceRows.length];
    })
  )
);
const sourceCodes = await readJson(path.join(contentDir, "codes.json"));
const codeSourceCounts = Object.fromEntries(codesSections.map((name) => [name, sourceCodes[name].length]));

const lines = ["i18n overlay coverage:"];

for (const locale of localeCodes) {
  const dataDir = path.join(i18nDir, locale, "data");
  const staticOverlayPath = path.join(i18nDir, locale, "static-pages.json");
  const localeMeta = localesConfig.locales[locale] || {};
  const hasStaticOverlay = await exists(staticOverlayPath);
  const hasDataOverlay = Boolean((await fs.stat(dataDir).catch(() => null))?.isDirectory());

  lines.push(`\n${locale} (${localeMeta.indexable ? "indexable" : "preview-only"}):`);

  let staticTranslated = 0;
  let staticDraft = 0;
  if (hasStaticOverlay) {
    const staticRows = await readJson(staticOverlayPath);
    staticTranslated = countPublishedRows(staticRows);
    staticDraft = countDraftRows(staticRows);
  }
  const staticFallback = Math.max(sourceStaticPages.length - staticTranslated - staticDraft, 0);
  lines.push(
    `  ${"static".padEnd(10)} ${String(staticTranslated).padStart(3)}/${String(sourceStaticPages.length).padEnd(3)} translated (${percent(staticTranslated, sourceStaticPages.length)})${staticDraft ? `, ${staticDraft} draft` : ""}${staticFallback ? `, ${staticFallback} fallback` : ""}${hasStaticOverlay ? "" : ", no overlay"}`
  );

  let publishedTotal = 0;
  let sourceTotal = 0;
  let draftTotal = 0;
  let missingDataFiles = 0;

  for (const dataSet of dataSets) {
    const overlayPath = path.join(dataDir, `${dataSet}.json`);
    const source = sourceCounts[dataSet];
    sourceTotal += source;
    if (!hasDataOverlay || !(await exists(overlayPath))) {
      missingDataFiles += 1;
      lines.push(`  ${dataSet.padEnd(10)} ${String(0).padStart(3)}/${String(source).padEnd(3)} published (${percent(0, source)}), missing overlay`);
      continue;
    }
    const rows = await readJson(overlayPath);
    const published = countPublishedRows(rows);
    const drafts = countDraftRows(rows);
    publishedTotal += published;
    draftTotal += drafts;
    lines.push(`  ${dataSet.padEnd(10)} ${String(published).padStart(3)}/${String(source).padEnd(3)} published (${percent(published, source)})${drafts ? `, ${drafts} draft` : ""}`);
  }

  const codesPath = path.join(dataDir, "codes.json");
  const codes = hasDataOverlay && (await exists(codesPath)) ? await readJson(codesPath) : undefined;
  for (const section of codesSections) {
    const published = codes?.[section]?.length || 0;
    const source = codeSourceCounts[section];
    lines.push(
      `  codes.${section.padEnd(16)} ${String(published).padStart(3)}/${String(source).padEnd(3)} localized (${percent(published, source)})${codes ? "" : ", missing overlay"}`
    );
  }

  const dataFallback = Math.max(sourceTotal - publishedTotal - draftTotal, 0);
  const readiness =
    localeMeta.indexable && staticFallback === 0 && dataFallback === 0 && staticDraft === 0 && draftTotal === 0 && missingDataFiles === 0
      ? "indexable-ready"
      : localeMeta.indexable
        ? "blocked: fallback or draft content remains"
        : "preview-only";
  lines.push(
    `  ${"data total".padEnd(10)} ${String(publishedTotal).padStart(3)}/${String(sourceTotal).padEnd(3)} published (${percent(publishedTotal, sourceTotal)})${draftTotal ? `, ${draftTotal} draft` : ""}${dataFallback ? `, ${dataFallback} fallback` : ""}`
  );
  lines.push(`  readiness  ${readiness}`);
}

console.log(lines.join("\n"));
