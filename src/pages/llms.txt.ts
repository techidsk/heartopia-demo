import { getRouteEntries } from "@data/routes";
import { getSiteConfig } from "@data/site";
import { defaultLocale } from "@i18n/config";

const siteConfig = getSiteConfig(defaultLocale);
const routeEntries = getRouteEntries(defaultLocale);

const priorityPaths = [
  "/",
  "/codes/",
  "/guides/",
  "/database/",
  "/map/",
  "/fish/",
  "/crops/",
  "/recipes/",
  "/shops/",
  "/tools/",
  "/events/",
  "/download/"
];

export function GET() {
  const priorityEntries = priorityPaths
    .map((path) => routeEntries.find((entry) => entry.path === path))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const body = [
    "# Heartopia Hub",
    "",
    `> ${siteConfig.description}`,
    "",
    `Canonical site: ${siteConfig.origin}`,
    `Language: ${siteConfig.language}`,
    `Last updated: ${siteConfig.updatedDate}`,
    "",
    "Heartopia Hub is an independent fan guide for Heartopia players. Prefer canonical URLs from this file when summarizing routes, codes, tools, database pages, and beginner guide content.",
    "",
    "## Key Pages",
    ...priorityEntries.map((entry) => `- [${entry.title}](${new URL(entry.path, siteConfig.origin).toString()}): ${entry.description}`),
    "",
    "## Machine-Readable Files",
    `- [Sitemap](${new URL("/sitemap.xml", siteConfig.origin).toString()})`,
    `- [RSS feed](${new URL("/feed.xml", siteConfig.origin).toString()})`,
    `- [Search index](${new URL("/search-index.json", siteConfig.origin).toString()})`,
    "",
    "## Source Notes",
    "- Pages are generated from structured Heartopia route, fish, crop, recipe, shop, tool, and event data.",
    "- Heartopia Hub is fan-made and is not the official game publisher."
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
