import { siteConfig } from "@data/site";
import { routeEntries } from "@data/routes";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routeEntries
  .map((entry) => {
    const loc = new URL(entry.path, siteConfig.origin).toString();
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${entry.updated}</lastmod>
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
