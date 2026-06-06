import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");

const htmlPaths = [
  "/",
  "/fish/",
  "/fish/wels-catfish/",
  "/shops/",
  "/shops/gardening-store/",
  "/crops/",
  "/crops/potato/",
  "/recipes/",
  "/recipes/fish-and-chips/",
  "/tools/profit-calculator/",
  "/search/"
];

const artifactChecks = [
  { path: "/sitemap.xml", includes: ["<urlset", "https://heartopia-demo.pages.dev/fish/"] },
  { path: "/feed.xml", includes: ["<rss", "<channel>"] },
  { path: "/search-index.json", json: true }
];

const toDistFile = (routePath) => {
  if (routePath.endsWith("/")) return path.join(distDir, routePath, "index.html");
  return path.join(distDir, routePath);
};

const readDist = async (routePath) => fs.readFile(toDistFile(routePath), "utf8");

const failures = [];

for (const routePath of htmlPaths) {
  try {
    const html = await readDist(routePath);
    const checks = [
      ["<title>", /<title>[^<]+<\/title>/i],
      ["meta description", /<meta\s+name="description"\s+content="[^"]+"/i],
      ["canonical", /<link\s+rel="canonical"\s+href="https:\/\/heartopia-demo\.pages\.dev\//i],
      ["main landmark", /<main\s+id="main"/i]
    ];
    for (const [label, pattern] of checks) {
      if (!pattern.test(html)) failures.push(`${routePath}: missing ${label}`);
    }
  } catch (error) {
    failures.push(`${routePath}: ${error.message}`);
  }
}

for (const check of artifactChecks) {
  try {
    const body = await readDist(check.path);
    if (check.json) {
      const parsed = JSON.parse(body);
      if (!Array.isArray(parsed.entries) || parsed.entries.length < 10) {
        failures.push(`${check.path}: expected entries array with at least 10 items`);
      }
      continue;
    }
    for (const text of check.includes) {
      if (!body.includes(text)) failures.push(`${check.path}: missing ${text}`);
    }
  } catch (error) {
    failures.push(`${check.path}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Quality gate passed for ${htmlPaths.length} HTML routes and ${artifactChecks.length} artifacts.`);
}
