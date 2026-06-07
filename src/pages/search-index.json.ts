import { getIndexableRouteEntries } from "@data/routes";

export async function GET() {
  const routeEntries = await getIndexableRouteEntries();
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
