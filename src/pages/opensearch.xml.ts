import { siteConfig } from "@data/site";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const searchTemplate = `${siteConfig.origin}/search/?q={searchTerms}`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${escapeXml(siteConfig.name)}</ShortName>
  <Description>${escapeXml(siteConfig.description)}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url type="text/html" template="${escapeXml(searchTemplate)}" />
</OpenSearchDescription>`;

  return new Response(body, {
    headers: {
      "content-type": "application/opensearchdescription+xml; charset=utf-8"
    }
  });
}
