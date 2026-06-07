import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Converter } from "opencc-js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const i18nDir = path.join(rootDir, "src", "data", "content", "i18n");
const sourceLocale = "zh-Hans";
const targetLocale = "zh-Hant";
const converter = Converter({ from: "cn", to: "tw" });
const structuralKeys = new Set([
  "id",
  "code",
  "path",
  "href",
  "primary",
  "tool",
  "database",
  "shop",
  "map",
  "related",
  "wikiUrl",
  "sourceImageUrl",
  "iconFile",
  "image",
  "imageFile",
  "status",
  "risk",
  "type",
  "translationStatus",
  "endAt"
]);

function convertString(value) {
  return converter(value)
    .replaceAll("/zh-hans/", "/zh-hant/")
    .replaceAll("/zh-hans#", "/zh-hant#")
    .replaceAll("/zh-hans?", "/zh-hant?")
    .replaceAll('"/zh-hans"', '"/zh-hant"');
}

function convertValue(value, key = "") {
  if (typeof value === "string") {
    return structuralKeys.has(key) ? value : convertString(value);
  }
  if (Array.isArray(value)) return value.map((item) => convertValue(item, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, convertValue(childValue, childKey)]));
  }
  return value;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJson(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function listJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listJsonFiles(filePath)));
    if (entry.isFile() && entry.name.endsWith(".json")) files.push(filePath);
  }
  return files;
}

const sourceDir = path.join(i18nDir, sourceLocale);
const targetDir = path.join(i18nDir, targetLocale);
const sourceFiles = await listJsonFiles(sourceDir);
const written = [];

for (const sourceFile of sourceFiles) {
  const relativePath = path.relative(sourceDir, sourceFile);
  const targetFile = path.join(targetDir, relativePath);
  const payload = convertValue(await readJson(sourceFile));
  await writeJson(targetFile, payload);
  written.push(path.join("src", "data", "content", "i18n", targetLocale, relativePath).split(path.sep).join("/"));
}

console.log(`Generated ${written.length} ${targetLocale} overlay file${written.length === 1 ? "" : "s"} from ${sourceLocale}:`);
for (const filePath of written) console.log(`  ${filePath}`);
