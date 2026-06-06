import { siteConfig } from "@data/site";
import { routeEntries, type RouteEntry } from "@data/routes";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const imageForEntry = (entry: RouteEntry) => {
  if (entry.image) return entry.image;
  if (entry.path.startsWith("/fish/")) return "/assets/asset-fishing.jpg";
  if (entry.path.startsWith("/characters/")) return "/assets/wiki/characters/blanc.png";
  if (entry.path.startsWith("/crops/")) return "/assets/asset-gardening.jpg";
  if (entry.path.startsWith("/gardening/")) return "/assets/wiki/gardening/tomato.png";
  if (entry.path.startsWith("/insects/")) return "/assets/wiki/insects/insect-001.png";
  if (entry.path.startsWith("/recipes/")) return "/assets/asset-events.jpg";
  if (entry.path.startsWith("/shops/") || entry.path === "/map/") return "/assets/asset-map.jpg";
  if (entry.path === "/download/") return "/assets/asset-download.jpg";
  if (entry.path === "/events/") return "/assets/asset-events.jpg";
  if (entry.path === "/pets/" || entry.path === "/animal-favorites/") return "/assets/asset-pets.jpg";
  if (entry.path === "/house-designs/") return "/assets/asset-house.jpg";
  return siteConfig.defaultImage;
};

const sitemapEntries = routeEntries.filter((entry) => !entry.path.includes("?") && !entry.path.includes("#"));

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries
  .map((entry) => {
    const loc = new URL(entry.path, siteConfig.origin).toString();
    const imageLoc = new URL(imageForEntry(entry), siteConfig.origin).toString();
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${entry.updated}</lastmod>
    <image:image>
      <image:loc>${escapeXml(imageLoc)}</image:loc>
      <image:title>${escapeXml(entry.title)}</image:title>
    </image:image>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
}
