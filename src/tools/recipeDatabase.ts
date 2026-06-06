import { escapeHtml, matchesSearchTerms, normalizeText, safeReadJson, safeWriteJson } from "./dom";

const matchesFilter = (activeFilter: string, group: string, risk: string) => {
  if (activeFilter === "all") return true;
  if (activeFilter === "risk") return risk === "high";
  return group.split("-").includes(activeFilter);
};

export function initRecipeDatabase() {
  const root = document.querySelector<HTMLElement>("[data-recipe-database]");
  if (!root) return;

  const cards = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-recipe-db-card]"));
  const detail = root.querySelector<HTMLElement>("[data-recipe-db-detail]");
  const searchInput = root.querySelector<HTMLInputElement>("[data-recipe-db-search]");
  const filterButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-recipe-db-filter]"));
  const countNode = root.querySelector<HTMLElement>("[data-recipe-db-count]");
  const storageKey = "heartopia-recipe-tested";
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0] || null;
  const tested = new Set<string>(safeReadJson<string[]>(storageKey, []));

  const recipeId = (card: HTMLElement) =>
    card.getAttribute("data-recipe-id") || normalizeText(card.getAttribute("data-name"));

  const updateCards = () => {
    cards.forEach((card) => card.classList.toggle("is-tested", tested.has(recipeId(card))));
  };

  const renderDetail = (card: HTMLButtonElement | null) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    updateCards();

    const id = recipeId(card);
    const group = card.getAttribute("data-group") || "fruit";
    const risk = card.getAttribute("data-risk") || "low";
    const name = card.getAttribute("data-name") || "Recipe";
    const ingredients = (card.getAttribute("data-ingredients") || "").split("|").filter(Boolean);
    const route = card.getAttribute("data-route") || "Recipe route";
    const use = card.getAttribute("data-use") || "Cooking route candidate.";
    const source = card.getAttribute("data-source") || "Ingredient route";
    const tool = card.getAttribute("data-tool") || "/tools/recipe-finder/";
    const primary = card.getAttribute("data-primary") || "/crops/";
    const badgeText = card.querySelector<HTMLElement>(".recipe-badge")?.textContent || route.slice(0, 3).toUpperCase();
    const badgeClass = card.querySelector<HTMLElement>(".recipe-badge")?.className || "recipe-badge";

    detail.innerHTML = `
      <div class="npc-detail-head"><span class="${escapeHtml(badgeClass)}">${escapeHtml(badgeText)}</span><div><h2>${escapeHtml(name)}</h2><p>${escapeHtml(route)}</p></div></div>
      <span class="recipe-route-chip ${escapeHtml(risk)}">${escapeHtml(group)} route · ${escapeHtml(risk)} risk</span>
      <div class="recipe-ingredient-list">${ingredients.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      <div class="map-meta">
        <span><strong>Use:</strong> ${escapeHtml(use)}</span>
        <span><strong>Source lane:</strong> ${escapeHtml(source)}</span>
        <span><strong>Risk:</strong> ${escapeHtml(risk)}</span>
      </div>
      <label class="recipe-tested-toggle"><input type="checkbox" data-recipe-db-tested ${tested.has(id) ? "checked" : ""}> Recipe tested in my save</label>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${escapeHtml(tool)}">Open Finder</a>
        <a class="pastel-button alt" href="${escapeHtml(primary)}">Ingredient Source</a>
        <a class="pastel-button alt" href="/tools/checklist/">Save Checklist</a>
      </div>
    `;

    detail.querySelector<HTMLInputElement>("[data-recipe-db-tested]")?.addEventListener("change", (event) => {
      if (event.currentTarget.checked) tested.add(id);
      else tested.delete(id);
      safeWriteJson(storageKey, [...tested]);
      updateCards();
    });
  };

  const applyFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible: HTMLButtonElement | null = null;

    cards.forEach((card) => {
      const group = card.getAttribute("data-group") || "";
      const risk = card.getAttribute("data-risk") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = matchesFilter(activeFilter, group, risk) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        firstVisible ||= card;
      }
    });

    const visibleTested = cards.filter((card) => !card.hidden && tested.has(recipeId(card))).length;
    if (countNode) countNode.textContent = `${visibleCount} recipe${visibleCount === 1 ? "" : "s"} shown · ${visibleTested} tested`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderDetail(firstVisible);
    if (!firstVisible && detail) detail.innerHTML = `<h2>No Recipe Match</h2><p>Try a shorter search like potato fish, jam, mushroom, QTE, or event.</p>`;
    updateCards();
  };

  cards.forEach((card) => card.addEventListener("click", () => renderDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-recipe-db-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyFilters();
    });
  });
  searchInput?.addEventListener("input", applyFilters);
  renderDetail(selectedCard);
  applyFilters();
}
