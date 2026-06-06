import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacyDir = path.join(rootDir, "site");
const publicDir = path.join(rootDir, ".astro-public");
const migratedRoutesPath = path.join(rootDir, "src", "data", "migratedRoutes.json");

const generatedRouteFiles = new Set(JSON.parse(await fs.readFile(migratedRoutesPath, "utf8")));

const toPosix = (value) => value.split(path.sep).join("/");

async function copyLegacyFileTree(sourceDir, targetDir) {
  await fs.mkdir(targetDir, { recursive: true });
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    const relativePath = toPosix(path.relative(legacyDir, sourcePath));

    if (entry.isDirectory()) {
      await copyLegacyFileTree(sourcePath, targetPath);
      continue;
    }

    if (generatedRouteFiles.has(relativePath)) {
      continue;
    }

    await fs.copyFile(sourcePath, targetPath);
  }
}

await fs.rm(publicDir, { recursive: true, force: true });
await copyLegacyFileTree(legacyDir, publicDir);
