import { siteConfig } from "@data/site";

export function GET() {
  const sitemap = new URL("/sitemap.xml", siteConfig.origin).toString();
  const body = `User-agent: Googlebot
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: *
Allow: /
Disallow: /search-index.json

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
