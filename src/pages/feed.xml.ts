import { feedEntries } from "@data/routes";
import { siteConfig } from "@data/site";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const channelUrl = new URL("/feed.xml", siteConfig.origin).toString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(siteConfig.origin)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <lastBuildDate>${new Date("2026-06-06T00:00:00+08:00").toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(channelUrl)}" rel="self" type="application/rss+xml" />
${feedEntries
  .map((entry) => {
    const link = new URL(entry.path, siteConfig.origin).toString();
    return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <description>${escapeXml(entry.description)}</description>
      <pubDate>${new Date(`${entry.updated}T00:00:00+08:00`).toUTCString()}</pubDate>
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8"
    }
  });
}
