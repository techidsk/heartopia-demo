import rawPages from "./content/static-pages.json";

export type StaticPage = {
  path: string;
  title: string;
  description: string;
  section: string;
  keywords: string[];
  ogImage?: string;
  content: string;
};

export const staticPages = rawPages as StaticPage[];

const pagesByPath = new Map(staticPages.map((page) => [page.path, page]));

export function getStaticPage(path: string) {
  const normalized = path === "/" || path.endsWith("/") || path.endsWith(".html") ? path : `${path}/`;
  const page = pagesByPath.get(normalized);
  if (!page) throw new Error(`Static page not found: ${path}`);
  return page;
}
