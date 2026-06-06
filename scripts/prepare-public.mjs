import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacyDir = path.join(rootDir, "site");
const publicDir = path.join(rootDir, ".astro-public");
const migratedRoutesPath = path.join(rootDir, "src", "data", "migratedRoutes.json");

const generatedRouteFiles = new Set(JSON.parse(await fs.readFile(migratedRoutesPath, "utf8")));
const oldOrigins = ["https://heartopia-demo.pages.dev"];
const siteOrigin = "https://heartopia.blog";
const siteName = "Heartopia Hub";
const siteAuthor = "Heartopia Hub editorial team";
const adsenseClient = "ca-pub-1476592629109289";
const siteLanguage = "en";
const siteLocale = "en_US";
const themeColor = "#2aa89e";
const defaultImage = `${siteOrigin}/assets/heartopia-guide-hero.png`;
const defaultImageAlt = "Heartopia Hub guide preview for Heartopia maps, codes, tools, and database routes.";
const siteLogo = `${siteOrigin}/assets/heartopia-hub-logo.svg`;
const adsenseSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;
const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt", ".webmanifest", ".xml"]);

const toPosix = (value) => value.split(path.sep).join("/");

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const replaceKnownOrigins = (value) =>
  oldOrigins.reduce((current, origin) => current.split(origin).join(siteOrigin), value);

const firstMatch = (value, pattern) => {
  const match = value.match(pattern);
  return match ? match[1].trim() : "";
};

const stripHtml = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const buildStructuredData = ({ title, description, canonical, image, imageAlt, routePath }) => {
  const siteRoot = new URL("/", siteOrigin).toString();
  const organizationId = `${siteOrigin}/#organization`;
  const websiteId = `${siteOrigin}/#website`;
  const pageId = `${canonical}#webpage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: siteRoot,
        logo: {
          "@type": "ImageObject",
          url: siteLogo
        }
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteName,
        url: siteRoot,
        description: "Independent Heartopia fan wiki hub with codes, maps, database notes, tools, and guides.",
        inLanguage: siteLanguage,
        publisher: {
          "@id": organizationId
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteOrigin}/search/?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": routePath === "/" ? "CollectionPage" : "WebPage",
        "@id": pageId,
        name: title,
        headline: title,
        description,
        url: canonical,
        inLanguage: siteLanguage,
        datePublished: "2026-06-06",
        dateModified: "2026-06-06",
        isPartOf: {
          "@id": websiteId
        },
        publisher: {
          "@id": organizationId
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: image,
          caption: imageAlt
        },
        image: {
          "@type": "ImageObject",
          url: image,
          caption: imageAlt
        }
      }
    ]
  };
};

const routeFromRelativePath = (relativePath) => {
  if (relativePath === "index.html") return "/";
  if (relativePath === "404.html") return "/404.html";
  if (relativePath.endsWith("/index.html")) return `/${relativePath.replace(/\/index\.html$/, "/")}`;
  return `/${relativePath}`;
};

const hasHeadTag = (html, pattern) => pattern.test(html);

function enhanceLegacyHtml(input, relativePath) {
  let html = replaceKnownOrigins(input);
  const routePath = routeFromRelativePath(relativePath);
  const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/i) || siteName;
  const h1 = stripHtml(firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
  const fallbackDescription =
    routePath === "/404.html"
      ? "The requested Heartopia Hub page was not found. Use the navigation to return to guides, tools, codes, and database pages."
      : `${h1 || title} on Heartopia Hub with practical fan guide notes, tools, routes, and database links.`;
  const description =
    firstMatch(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || fallbackDescription;
  const isNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
  const canonical = new URL(
    firstMatch(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) || routePath,
    siteOrigin
  ).toString();
  const image = new URL(
    firstMatch(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i) || defaultImage,
    siteOrigin
  ).toString();
  const imageAlt =
    firstMatch(html, /<meta\s+property=["']og:image:alt["']\s+content=["']([^"']*)["']/i) ||
    `${h1 || title} Heartopia Hub guide preview.`;
  const schema = buildStructuredData({ title, description, canonical, image, imageAlt, routePath });

  const tags = [];
  if (!hasHeadTag(html, /<meta\s+name=["']description["']/i)) {
    tags.push(`<meta name="description" content="${escapeHtml(description)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']author["']/i)) {
    tags.push(`<meta name="author" content="${siteAuthor}">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']application-name["']/i)) {
    tags.push(`<meta name="application-name" content="${siteName}">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']color-scheme["']/i)) {
    tags.push(`<meta name="color-scheme" content="light">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']robots["']/i)) {
    tags.push(`<meta name="robots" content="index,follow,max-image-preview:large">`);
  }
  if (!isNoindex && !hasHeadTag(html, /<link\s+rel=["']canonical["']/i)) {
    tags.push(`<link rel="canonical" href="${escapeHtml(canonical)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']theme-color["']/i)) {
    tags.push(`<meta name="theme-color" content="${themeColor}">`);
  }
  if (!hasHeadTag(html, /<link\s+rel=["']sitemap["']/i)) {
    tags.push(`<link rel="sitemap" type="application/xml" href="/sitemap.xml">`);
  }
  if (!hasHeadTag(html, /<link\s+rel=["']search["'][^>]+opensearchdescription\+xml/i)) {
    tags.push(`<link rel="search" type="application/opensearchdescription+xml" title="${siteName} Search" href="/opensearch.xml">`);
  }
  if (!hasHeadTag(html, /<link\s+rel=["']alternate["'][^>]+application\/rss\+xml/i)) {
    tags.push(`<link rel="alternate" href="/feed.xml" type="application/rss+xml" title="${siteName} RSS">`);
  }
  if (!hasHeadTag(html, /<link\s+rel=["']alternate["'][^>]+llms\.txt/i)) {
    tags.push(`<link rel="alternate" href="/llms.txt" type="text/plain" title="${siteName} LLM guide">`);
  }
  if (!hasHeadTag(html, /<meta\s+property=["']og:title["']/i)) {
    tags.push(`<meta property="og:title" content="${escapeHtml(title)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+property=["']og:description["']/i)) {
    tags.push(`<meta property="og:description" content="${escapeHtml(description)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+property=["']og:type["']/i)) {
    tags.push(`<meta property="og:type" content="website">`);
  }
  if (!hasHeadTag(html, /<meta\s+property=["']og:url["']/i)) {
    tags.push(`<meta property="og:url" content="${escapeHtml(canonical)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+property=["']og:image["']/i)) {
    tags.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+property=["']og:image:alt["']/i)) {
    tags.push(`<meta property="og:image:alt" content="${escapeHtml(imageAlt)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+property=["']og:site_name["']/i)) {
    tags.push(`<meta property="og:site_name" content="${siteName}">`);
  }
  if (!hasHeadTag(html, /<meta\s+property=["']og:locale["']/i)) {
    tags.push(`<meta property="og:locale" content="${siteLocale}">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']twitter:card["']/i)) {
    tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']twitter:title["']/i)) {
    tags.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']twitter:description["']/i)) {
    tags.push(`<meta name="twitter:description" content="${escapeHtml(description)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']twitter:image["']/i)) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(image)}">`);
  }
  if (!hasHeadTag(html, /<meta\s+name=["']twitter:image:alt["']/i)) {
    tags.push(`<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}">`);
  }
  if (!isNoindex && !hasHeadTag(html, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i)) {
    tags.push(`<script async src="${adsenseSrc}" crossorigin="anonymous"></script>`);
  }
  if (!isNoindex && !/"@id"\s*:\s*"https:\/\/heartopia\.blog\/#website"/i.test(html)) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  }

  if (tags.length) {
    html = html.replace(/(\s*)<\/head>/i, `\n    ${tags.join("\n    ")}$1</head>`);
  }

  return html;
}

async function writePreparedFile(sourcePath, targetPath, relativePath) {
  const extension = path.extname(sourcePath);
  if (!textExtensions.has(extension)) {
    await fs.copyFile(sourcePath, targetPath);
    return;
  }

  const source = await fs.readFile(sourcePath, "utf8");
  const prepared = extension === ".html" ? enhanceLegacyHtml(source, relativePath) : replaceKnownOrigins(source);
  await fs.writeFile(targetPath, prepared);
}

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

    await writePreparedFile(sourcePath, targetPath, relativePath);
  }
}

await fs.rm(publicDir, { recursive: true, force: true });
await copyLegacyFileTree(legacyDir, publicDir);
