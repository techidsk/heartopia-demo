import { getRouteEntries } from "@data/routes";
import { defaultLocale } from "@i18n/config";

const routeEntries = getRouteEntries(defaultLocale);

export function GET() {
  return new Response(
    JSON.stringify(
      {
        generatedAt: "2026-06-06",
        entries: routeEntries
      },
      null,
      2
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    }
  );
}
