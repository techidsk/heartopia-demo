import { getIndexableRouteEntries } from "@data/routes";

const routeEntries = getIndexableRouteEntries();

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
