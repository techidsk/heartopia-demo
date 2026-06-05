import { matchesSearchTerms, normalizeText, safeReadJson, safeWriteJson } from "./dom";

const badgeText = (type: string, rarity: string) => {
  if (rarity === "rare") return "RAR";
  const labels: Record<string, string> = {
    lake: "LAK",
    river: "RIV",
    ocean: "OCN",
    hidden: "HID",
    event: "EVT"
  };
  return labels[type] || "FSH";
};

export function initFishDatabase() {
  const root = document.querySelector<HTMLElement>("[data-fish-database]");
  if (!root) return;

  const cards = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-fish-db-card]"));
  const detail = root.querySelector<HTMLElement>("[data-fish-db-detail]");
  const searchInput = root.querySelector<HTMLInputElement>("[data-fish-db-search]");
  const filterButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-fish-db-filter]"));
  const countNode = root.querySelector<HTMLElement>("[data-fish-db-count]");
  const storageKey = "heartopia-fish-database";
  let activeFilter = "all";
  let selectedCard = cards[0] || null;
  const caught = new Set<string>(safeReadJson<string[]>(storageKey, []));

  const fishId = (card: HTMLElement) => card.getAttribute("data-fish-id") || normalizeText(card.textContent);

  const updateProgressState = () => {
    cards.forEach((card) => card.classList.toggle("is-complete", caught.has(fishId(card))));
  };

  const renderDetail = (card: HTMLButtonElement | null) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));

    const id = fishId(card);
    const type = card.getAttribute("data-type") || "lake";
    const rarity = card.getAttribute("data-rarity") || "common";
    const name = card.getAttribute("data-name") || "Fish";
    const spot = card.getAttribute("data-spot") || "Check map";
    const condition = card.getAttribute("data-condition") || "Confirm in game";
    const windowText = card.getAttribute("data-window") || "Any time";
    const level = card.getAttribute("data-level") || "Lv ?";
    const use = card.getAttribute("data-use") || "Collection target";
    const map = card.getAttribute("data-map") || "/map/";
    const isCaught = caught.has(id);

    detail.innerHTML = `
      <div class="npc-detail-head"><span class="fish-badge ${rarity === "rare" ? "rare" : type}">${badgeText(type, rarity)}</span><div><h2>${name}</h2><p>${spot}</p></div></div>
      <span class="fish-route-chip">${type} route · ${rarity}</span>
      <div class="map-meta">
        <span><strong>Condition:</strong> ${condition}</span>
        <span><strong>Window:</strong> ${windowText}</span>
        <span><strong>Level:</strong> ${level}</span>
        <span><strong>Use:</strong> ${use}</span>
      </div>
      <label class="fish-catch-toggle"><input type="checkbox" data-fish-db-caught ${isCaught ? "checked" : ""}> Caught in my save</label>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${map}">Open Map Route</a>
        <a class="pastel-button alt" href="/tools/fish-tracker/">Open Tracker</a>
        <a class="pastel-button alt" href="/recipes/">Cooking Uses</a>
      </div>
    `;

    detail.querySelector<HTMLInputElement>("[data-fish-db-caught]")?.addEventListener("change", (event) => {
      if (event.currentTarget.checked) caught.add(id);
      else caught.delete(id);
      safeWriteJson(storageKey, [...caught]);
      updateProgressState();
      renderDetail(card);
    });
  };

  const applyFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible: HTMLButtonElement | null = null;

    cards.forEach((card) => {
      const type = card.getAttribute("data-type") || "";
      const rarity = card.getAttribute("data-rarity") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const matchesFilter = activeFilter === "all" || type === activeFilter || rarity === activeFilter;
      const isVisible = matchesFilter && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        firstVisible ||= card;
      }
    });

    if (countNode) countNode.textContent = `${visibleCount} fish shown`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderDetail(firstVisible);
    if (!firstVisible && detail) detail.innerHTML = `<h2>No Fish Match</h2><p>Try a shorter search like tuna, lake, level 10, rainbow, or river.</p>`;
  };

  cards.forEach((card) => card.addEventListener("click", () => renderDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-fish-db-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyFilters();
    });
  });
  searchInput?.addEventListener("input", applyFilters);
  updateProgressState();
  renderDetail(selectedCard);
  applyFilters();
}
