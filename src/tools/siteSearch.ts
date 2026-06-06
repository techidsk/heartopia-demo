import { escapeHtml, matchesSearchTerms } from "./dom";

type SearchEntry = {
  path: string;
  title: string;
  description: string;
  section: string;
  keywords: string[];
};

const readEntries = () => {
  const script = document.querySelector<HTMLScriptElement>("#site-search-data");
  if (!script?.textContent) return [];
  try {
    return JSON.parse(script.textContent) as SearchEntry[];
  } catch {
    return [];
  }
};

const scoreEntry = (entry: SearchEntry, query: string) => {
  const normalizedQuery = query.toLowerCase();
  if (!normalizedQuery) return 0;
  let score = 0;
  if (entry.title.toLowerCase().includes(normalizedQuery)) score += 8;
  if (entry.path.toLowerCase().includes(normalizedQuery)) score += 4;
  if (entry.section.toLowerCase().includes(normalizedQuery)) score += 2;
  if (entry.keywords.join(" ").toLowerCase().includes(normalizedQuery)) score += 2;
  if (entry.description.toLowerCase().includes(normalizedQuery)) score += 1;
  return score;
};

export function initSiteSearch() {
  const root = document.querySelector<HTMLElement>("[data-site-search]");
  if (!root) return;

  const input = root.querySelector<HTMLInputElement>("[data-site-search-input]");
  const results = root.querySelector<HTMLElement>("[data-site-search-results]");
  const count = root.querySelector<HTMLElement>("[data-site-search-count]");
  const entries = readEntries();

  const render = () => {
    if (!results) return;
    const query = input?.value || "";
    const visible = entries
      .filter((entry) =>
        query
          ? matchesSearchTerms([entry.title, entry.description, entry.section, entry.path, ...entry.keywords].join(" "), query)
          : ["Database", "Tools", "Hobbies"].includes(entry.section)
      )
      .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
      .sort((a, b) => b.score - a.score || a.entry.path.localeCompare(b.entry.path))
      .slice(0, 24)
      .map(({ entry }) => entry);

    if (count) count.textContent = `${visible.length} result${visible.length === 1 ? "" : "s"}`;
    results.innerHTML = visible.length
      ? visible
          .map(
            (entry) => `
              <a class="route-card" href="${escapeHtml(entry.path)}">
                <span class="status-chip">${escapeHtml(entry.section)}</span>
                <h3>${escapeHtml(entry.title)}</h3>
                <p>${escapeHtml(entry.description)}</p>
              </a>
            `
          )
          .join("")
      : `<div class="wiki-card"><h2>No Results</h2><p>Try a shorter search like fish, potato, recipe, map, pet, code, or profit.</p></div>`;
  };

  input?.addEventListener("input", render);
  render();
}
