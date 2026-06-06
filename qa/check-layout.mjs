import { chromium } from "playwright";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const qaDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(qaDir, "..");
const requestedPort = Number(process.env.QA_PORT || 0);
let baseUrl = process.env.QA_BASE_URL || "";
const managedServer = !process.env.QA_BASE_URL;

const paths = [
  "/",
  "/codes/",
  "/guides/",
  "/map/",
  "/tools/",
  "/database/",
  "/characters/",
  "/fish/",
  "/gardening/",
  "/insects/",
  "/recipes/",
  "/crops/",
  "/animal-favorites/",
  "/hobbies/fishing/",
  "/hobbies/cooking/",
  "/hobbies/gardening/",
  "/pets/",
  "/house-designs/",
  "/npcs/",
  "/events/",
  "/download/",
  "/privacy/",
  "/fish/wels-catfish/",
  "/crops/potato/",
  "/recipes/fish-and-chips/",
  "/shops/",
  "/shops/gardening-store/",
  "/tools/profit-calculator/",
  "/search/",
  "/de/",
  "/ja/fish/wels-catfish/",
  "/zh-hans/",
  "/zh-hans/codes/",
  "/zh-hans/tools/",
  "/zh-hans/guides/",
  "/zh-hans/download/"
];
const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1365, height: 900 }
];

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

async function resolveStaticFile(root, requestUrl) {
  const url = new URL(requestUrl, "http://qa.local");
  const pathname = decodeURIComponent(url.pathname);
  const candidate = path.resolve(root, `.${pathname}`);
  if (!candidate.startsWith(root)) return null;

  try {
    const stat = await fs.stat(candidate);
    if (stat.isDirectory()) return path.join(candidate, "index.html");
    return candidate;
  } catch {
    if (!path.extname(candidate)) {
      const indexCandidate = path.join(candidate, "index.html");
      try {
        await fs.stat(indexCandidate);
        return indexCandidate;
      } catch {}
    }
    return path.join(root, "404.html");
  }
}

async function startStaticServer(root, port) {
  const server = createServer(async (request, response) => {
    try {
      const filePath = await resolveStaticFile(root, request.url || "/");
      if (!filePath) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      const body = await fs.readFile(filePath);
      const is404 = path.basename(filePath) === "404.html";
      response.writeHead(is404 ? 404 : 200, {
        "content-type": contentTypes[path.extname(filePath)] || "application/octet-stream"
      });
      response.end(body);
    } catch {
      response.writeHead(500);
      response.end("Internal Server Error");
    }
  });

  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  return server;
}

let server = null;
if (managedServer) {
  server = await startStaticServer(path.join(rootDir, "dist"), requestedPort);
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("QA static server did not expose a port.");
  baseUrl = `http://127.0.0.1:${address.port}`;
}

async function launchBrowser() {
  if (process.env.PLAYWRIGHT_CHANNEL) {
    return chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL, headless: true });
  }

  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    if (!String(error?.message || error).includes("Executable doesn't exist")) {
      throw error;
    }
    return chromium.launch({ channel: "chrome", headless: true });
  }
}

const browser = await launchBrowser();

const findings = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    for (const pagePath of paths) {
      const response = await page.goto(`${baseUrl}${pagePath}`, { waitUntil: "load", timeout: 60_000 });
      await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => {});
      const metrics = await page.evaluate(() => ({
        title: document.title,
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        overflowNodes: Array.from(document.querySelectorAll("*"))
          .filter((node) => node.scrollWidth > node.clientWidth + 1)
          .slice(0, 6)
          .map((node) => ({
            tag: node.tagName,
            className: node.className,
            clientWidth: node.clientWidth,
            scrollWidth: node.scrollWidth
          }))
      }));
      findings.push({ path: pagePath, viewport: viewport.width, status: response?.status() || 0, ...metrics });
    }
    await page.close();
  }

  const failures = findings.filter(
    (item) => item.status >= 400 || item.scrollWidth > item.width + 1 || item.bodyScrollWidth > item.width + 1
  );
  console.log(JSON.stringify(findings, null, 2));
  if (failures.length) {
    console.error(`Layout overflow detected on ${failures.length} viewport/page checks.`);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
}
