import { escapeHtml, matchesSearchTerms, normalizeText, safeReadJson, safeWriteJson } from "./dom";

export function initCropDatabase() {
  const root = document.querySelector<HTMLElement>("[data-crop-database]");
  if (!root) return;

  const cards = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-crop-db-card]"));
  const detail = root.querySelector<HTMLElement>("[data-crop-db-detail]");
  const searchInput = root.querySelector<HTMLInputElement>("[data-crop-db-search]");
  const filterButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-crop-db-filter]"));
  const countNode = root.querySelector<HTMLElement>("[data-crop-db-count]");
  const storageKey = "heartopia-crop-watchlist";
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0] || null;
  const watchlist = new Set<string>(safeReadJson<string[]>(storageKey, []));

  const cropId = (card: HTMLElement) => card.getAttribute("data-crop-id") || normalizeText(card.getAttribute("data-name"));

  const updateCards = () => {
    cards.forEach((card) => card.classList.toggle("is-watched", watchlist.has(cropId(card))));
  };

  const renderDetail = (card: HTMLButtonElement | null) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    updateCards();

    const id = cropId(card);
    const group = card.getAttribute("data-group") || "active";
    const name = card.getAttribute("data-name") || "Crop";
    const growth = card.getAttribute("data-growth") || "Unknown";
    const seed = card.getAttribute("data-seed") || "Unknown";
    const sell = card.getAttribute("data-sell") || "Unknown";
    const profit = card.getAttribute("data-profit") || "Value pending";
    const unlock = card.getAttribute("data-unlock") || "Lv ?";
    const route = card.getAttribute("data-route") || "Check crop planner.";
    const use = card.getAttribute("data-use") || "Planting route candidate.";
    const shop = card.getAttribute("data-shop") || "/shops/?q=seed";
    const tool = card.getAttribute("data-tool") || "/tools/crop-planner/";
    const related = card.getAttribute("data-related") || "/recipes/";
    const badgeText = card.querySelector<HTMLElement>(".crop-badge")?.textContent || growth;
    const badgeClass = card.querySelector<HTMLElement>(".crop-badge")?.className || "crop-badge";

    detail.innerHTML = `
      <div class="npc-detail-head"><span class="${escapeHtml(badgeClass)}">${escapeHtml(badgeText)}</span><div><h2>${escapeHtml(name)}</h2><p>${escapeHtml(route)}</p></div></div>
      <span class="crop-route-chip">${escapeHtml(group)} route</span>
      <div class="map-meta">
        <span><strong>Growth:</strong> ${escapeHtml(growth)}</span>
        <span><strong>Unlock:</strong> ${escapeHtml(unlock)}</span>
        <span><strong>Seed:</strong> ${escapeHtml(seed)}</span>
        <span><strong>Base sell:</strong> ${escapeHtml(sell)}</span>
        <span><strong>Margin:</strong> ${escapeHtml(profit)}</span>
        <span><strong>Use:</strong> ${escapeHtml(use)}</span>
      </div>
      <label class="crop-watch-toggle"><input type="checkbox" data-crop-db-watch ${watchlist.has(id) ? "checked" : ""}> Add to planting watchlist</label>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${escapeHtml(tool)}">${group === "active" ? "Compare Profit" : "Open Planner"}</a>
        <a class="pastel-button alt" href="${escapeHtml(shop)}">Find Seeds</a>
        <a class="pastel-button alt" href="${escapeHtml(related)}">Related Uses</a>
      </div>
    `;

    detail.querySelector<HTMLInputElement>("[data-crop-db-watch]")?.addEventListener("change", (event) => {
      if (event.currentTarget.checked) watchlist.add(id);
      else watchlist.delete(id);
      safeWriteJson(storageKey, [...watchlist]);
      updateCards();
    });
  };

  const applyFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible: HTMLButtonElement | null = null;

    cards.forEach((card) => {
      const group = card.getAttribute("data-group") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || group === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        firstVisible ||= card;
      }
    });

    const visibleWatched = cards.filter((card) => !card.hidden && watchlist.has(cropId(card))).length;
    if (countNode) countNode.textContent = `${visibleCount} crop${visibleCount === 1 ? "" : "s"} shown · ${visibleWatched} watched`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderDetail(firstVisible);
    if (!firstVisible && detail) detail.innerHTML = `<h2>No Crop Match</h2><p>Try a shorter search like potato, Lv 6, corn, jam, or offline.</p>`;
    updateCards();
  };

  cards.forEach((card) => card.addEventListener("click", () => renderDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-crop-db-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyFilters();
    });
  });
  searchInput?.addEventListener("input", applyFilters);
  renderDetail(selectedCard);
  applyFilters();
}
