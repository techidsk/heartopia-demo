import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(rootDir, "src", "data", "content");
const i18nDir = path.join(contentDir, "i18n");
const localesPath = path.join(rootDir, "src", "i18n", "locales.json");

const dataOverlayFiles = [
  "fish",
  "shops",
  "crops",
  "gardening",
  "insects",
  "recipes",
  "codes",
  "events",
  "npcs",
  "pets",
  "hobbies",
  "tools"
];

const emptyPayloadFor = (name) =>
  name === "codes" ? { activeCandidates: [], expiredArchive: [] } : [];

const writeJsonIfMissing = async (filePath, payload) => {
  try {
    await fs.stat(filePath);
    return false;
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    return true;
  }
};

const localesConfig = JSON.parse(await fs.readFile(localesPath, "utf8"));
const defaultLocale = localesConfig.defaultLocale;
const localeCodes = Object.keys(localesConfig.locales || {}).filter((locale) => locale !== defaultLocale);
const created = [];

for (const locale of localeCodes) {
  const localeDir = path.join(i18nDir, locale);
  if (await writeJsonIfMissing(path.join(localeDir, "static-pages.json"), [])) {
    created.push(`src/data/content/i18n/${locale}/static-pages.json`);
  }

  for (const fileName of dataOverlayFiles) {
    const overlayPath = path.join(localeDir, "data", `${fileName}.json`);
    if (await writeJsonIfMissing(overlayPath, emptyPayloadFor(fileName))) {
      created.push(`src/data/content/i18n/${locale}/data/${fileName}.json`);
    }
  }
}

if (created.length) {
  console.log(`Created ${created.length} i18n overlay scaffold file${created.length === 1 ? "" : "s"}:`);
  for (const filePath of created) console.log(`  ${filePath}`);
} else {
  console.log("All locale overlay scaffold files already exist.");
}
