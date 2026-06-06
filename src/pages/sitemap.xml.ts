import { siteConfig } from "@data/site";
import { routeEntries, type RouteEntry } from "@data/routes";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const imageForEntry = (entry: RouteEntry) => {
  if (entry.path.startsWith("/fish/")) return "/assets/asset-fishing.jpg";
  if (entry.path.startsWith("/crops/")) return "/assets/asset-gardening.jpg";
  if (entry.path.startsWith("/recipes/")) return "/assets/asset-events.jpg";
  if (entry.path.startsWith("/shops/") || entry.path === "/map/") return "/assets/asset-map.jpg";
  if (entry.path === "/download/") return "/assets/asset-download.jpg";
  if (entry.path === "/events/") return "/assets/asset-events.jpg";
  if (entry.path === "/pets/" || entry.path === "/animal-favorites/") return "/assets/asset-pets.jpg";
  if (entry.path === "/house-designs/") return "/assets/asset-house.jpg";
  return siteConfig.defaultImage;
};

const changefreqForEntry = (entry: RouteEntry) => {
  if (entry.path === "/" || ["Codes", "Tools", "Events"].includes(entry.section)) return "weekly";
  if (["Fish", "Crops", "Recipes", "Shops"].includes(entry.section)) return "monthly";
  return "monthly";
};

const priorityForEntry = (entry: RouteEntry) => {
  if (entry.path === "/") return "1.0";
  if (entry.path.split("/").filter(Boolean).length === 1) return "0.8";
  if (["Fish", "Crops", "Recipes", "Shops"].includes(entry.section)) return "0.6";
  if (entry.section === "Site") return "0.4";
  return "0.5";
};

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routeEntries
  .map((entry) => {
    const loc = new URL(entry.path, siteConfig.origin).toString();
    const imageLoc = new URL(imageForEntry(entry), siteConfig.origin).toString();
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${entry.updated}</lastmod>
    <changefreq>${changefreqForEntry(entry)}</changefreq>
    <priority>${priorityForEntry(entry)}</priority>
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
