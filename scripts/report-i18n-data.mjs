import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(rootDir, "src", "data", "content");
const i18nDir = path.join(contentDir, "i18n");
const localesPath = path.join(rootDir, "src", "i18n", "locales.json");

const dataSets = ["fish", "shops", "crops", "gardening", "insects", "recipes", "npcs", "pets", "hobbies", "tools"];
const codesSections = ["activeCandidates", "expiredArchive"];

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, "utf8"));
const percent = (count, total) => (total === 0 ? "0.0%" : `${((count / total) * 100).toFixed(1)}%`);

function countPublishedRows(rows) {
  return rows.filter((row) => row.translationStatus !== "draft").length;
}

function countDraftRows(rows) {
  return rows.filter((row) => row.translationStatus === "draft").length;
}

const localesConfig = await readJson(localesPath);
const defaultLocale = localesConfig.defaultLocale;
const localeCodes = Object.keys(localesConfig.locales || {}).filter((locale) => locale !== defaultLocale);
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

let foundDataOverlay = false;
const lines = ["i18n data overlay coverage:"];

for (const locale of localeCodes) {
  const dataDir = path.join(i18nDir, locale, "data");
  const stat = await fs.stat(dataDir).catch(() => null);
  if (!stat?.isDirectory()) continue;
  foundDataOverlay = true;

  lines.push(`\n${locale}:`);
  let publishedTotal = 0;
  let sourceTotal = 0;
  let draftTotal = 0;

  for (const dataSet of dataSets) {
    const rows = await readJson(path.join(dataDir, `${dataSet}.json`));
    const published = countPublishedRows(rows);
    const drafts = countDraftRows(rows);
    const source = sourceCounts[dataSet];
    publishedTotal += published;
    sourceTotal += source;
    draftTotal += drafts;
    lines.push(`  ${dataSet.padEnd(10)} ${String(published).padStart(3)}/${String(source).padEnd(3)} published (${percent(published, source)})${drafts ? `, ${drafts} draft` : ""}`);
  }

  const codes = await readJson(path.join(dataDir, "codes.json"));
  for (const section of codesSections) {
    const published = codes[section].length;
    const source = codeSourceCounts[section];
    lines.push(`  codes.${section.padEnd(16)} ${String(published).padStart(3)}/${String(source).padEnd(3)} localized (${percent(published, source)})`);
  }

  lines.push(`  ${"total".padEnd(10)} ${String(publishedTotal).padStart(3)}/${String(sourceTotal).padEnd(3)} published (${percent(publishedTotal, sourceTotal)})${draftTotal ? `, ${draftTotal} draft` : ""}`);
}

if (!foundDataOverlay) {
  lines.push("  no locale data overlay directories found");
}

console.log(lines.join("\n"));
