import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const siteOrigin = "https://heartopia.blog";
const adsenseClient = "ca-pub-1476592629109289";
const adsTxtLine = "google.com, pub-1476592629109289, DIRECT, f08c47fec0942fa0";
const oldOriginPattern = /heartopia-demo\.pages\.dev/i;

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
  { path: "/sitemap.xml", includes: ["<urlset", "xmlns:image", "<image:image>", `${siteOrigin}/fish/`] },
  { path: "/feed.xml", includes: ["<rss", "<channel>", "<language>en</language>", "<atom:link"] },
  { path: "/search-index.json", json: true },
  { path: "/robots.txt", includes: [`Sitemap: ${siteOrigin}/sitemap.xml`, "Disallow: /search-index.json"] },
  { path: "/opensearch.xml", includes: ["OpenSearchDescription", `${siteOrigin}/search/?q={searchTerms}`] },
  { path: "/llms.txt", includes: ["# Heartopia Hub", `${siteOrigin}/sitemap.xml`] },
  { path: "/ads.txt", includes: [adsTxtLine] }
];

const toDistFile = (routePath) => {
  if (routePath.endsWith("/")) return path.join(distDir, routePath, "index.html");
  return path.join(distDir, routePath);
};

const readDist = async (routePath) => fs.readFile(toDistFile(routePath), "utf8");
const toPosix = (value) => value.split(path.sep).join("/");
const has = (html, pattern) => pattern.test(html);

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(filePath)));
    } else {
      files.push(filePath);
    }
  }
  return files;
}

const failures = [];

for (const routePath of htmlPaths) {
  try {
    const html = await readDist(routePath);
    const checks = [
      ["<title>", /<title>[^<]+<\/title>/i],
      ["meta description", /<meta\s+name="description"\s+content="[^"]+"/i],
      ["canonical", /<link\s+rel="canonical"\s+href="https:\/\/heartopia\.blog\//i],
      ["main landmark", /<main\s+id="main"/i]
    ];
    for (const [label, pattern] of checks) {
      if (!pattern.test(html)) failures.push(`${routePath}: missing ${label}`);
    }
  } catch (error) {
    failures.push(`${routePath}: ${error.message}`);
  }
}

const htmlFiles = (await walkFiles(distDir)).filter((filePath) => filePath.endsWith(".html"));
for (const filePath of htmlFiles) {
  const html = await fs.readFile(filePath, "utf8");
  const relative = toPosix(path.relative(distDir, filePath));
  const isNoindex = has(html, /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i);
  const checks = [
    ["<title>", /<title>[^<]+<\/title>/i],
    ["meta description", /<meta\s+name=["']description["']\s+content=["'][^"']+["']/i],
    ["application-name", /<meta\s+name=["']application-name["']\s+content=["'][^"']+["']/i],
    ["main landmark", /<main\b/i],
    ["robots", /<meta\s+name=["']robots["']\s+content=["'][^"']+["']/i],
    ["opensearch", /<link\s+rel=["']search["'][^>]+opensearchdescription\+xml/i],
    ["og:title", /<meta\s+property=["']og:title["']\s+content=["'][^"']+["']/i],
    ["og:description", /<meta\s+property=["']og:description["']\s+content=["'][^"']+["']/i],
    ["og:url", /<meta\s+property=["']og:url["']\s+content=["']https:\/\/heartopia\.blog\//i],
    ["og:image", /<meta\s+property=["']og:image["']\s+content=["']https:\/\/heartopia\.blog\//i],
    ["og:image:alt", /<meta\s+property=["']og:image:alt["']\s+content=["'][^"']+["']/i],
    ["twitter:card", /<meta\s+name=["']twitter:card["']\s+content=["']summary_large_image["']/i],
    ["twitter:title", /<meta\s+name=["']twitter:title["']\s+content=["'][^"']+["']/i],
    ["twitter:description", /<meta\s+name=["']twitter:description["']\s+content=["'][^"']+["']/i],
    ["twitter:image", /<meta\s+name=["']twitter:image["']\s+content=["']https:\/\/heartopia\.blog\//i],
    ["twitter:image:alt", /<meta\s+name=["']twitter:image:alt["']\s+content=["'][^"']+["']/i]
  ];

  if (!isNoindex) {
    checks.push(
      ["canonical", /<link\s+rel=["']canonical["']\s+href=["']https:\/\/heartopia\.blog\//i],
      ["adsense", new RegExp(`pagead2\\.googlesyndication\\.com/pagead/js/adsbygoogle\\.js\\?client=${adsenseClient}`)],
      ["json-ld", /<script\s+type=["']application\/ld\+json["']/i]
    );
  }

  if (oldOriginPattern.test(html)) failures.push(`${relative}: contains old Pages domain`);
  for (const [label, pattern] of checks) {
    if (!pattern.test(html)) failures.push(`${relative}: missing ${label}`);
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
  console.log(
    `Quality gate passed for ${htmlFiles.length} HTML files, ${htmlPaths.length} sampled routes, and ${artifactChecks.length} artifacts.`
  );
}
