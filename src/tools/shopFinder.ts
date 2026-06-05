import { matchesSearchTerms } from "./dom";

export function initShopFinder() {
  const root = document.querySelector<HTMLElement>("[data-shop-system]");
  if (!root) return;

  const cards = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-shop-card]"));
  const detail = root.querySelector<HTMLElement>("[data-shop-detail]");
  const searchInput = root.querySelector<HTMLInputElement>("[data-shop-search]");
  const filterButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-shop-filter]"));
  let activeFilter = "all";
  let selectedCard = cards[0] || null;

  const splitList = (value: string | null) => (value || "").split("|").map((item) => item.trim()).filter(Boolean);

  const renderDetail = (card: HTMLButtonElement | null) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => {
      const isSelected = item === card;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    const type = card.getAttribute("data-type") || "general";
    const icon = card.getAttribute("data-icon") || "SH";
    const name = card.getAttribute("data-name") || "Shop";
    const owner = card.getAttribute("data-owner") || "Route owner";
    const region = card.getAttribute("data-region") || "Heartopia";
    const unlock = card.getAttribute("data-unlock") || "Check the related route.";
    const hours = card.getAttribute("data-hours") || "Confirm in game.";
    const notes = card.getAttribute("data-notes") || "Use this shop as a route stop.";
    const inventory = splitList(card.getAttribute("data-inventory"));
    const map = card.getAttribute("data-map") || "/map/";
    const tool = card.getAttribute("data-tool") || "/database/";

    detail.innerHTML = `
      <div class="shop-detail-head">
        <span class="shop-icon shop-icon-${type}">${icon}</span>
        <div>
          <h2>${name}</h2>
          <p>${owner} · ${region}</p>
        </div>
      </div>
      <div class="shop-route-chip">${type} route · ${unlock}</div>
      <p>${notes}</p>
      <div class="map-meta">
        <span><strong>Hours:</strong> ${hours}</span>
        <span><strong>Owner:</strong> ${owner}</span>
      </div>
      <div class="shop-inventory-grid" aria-label="${name} inventory">${inventory.map((item) => `<span>${item}</span>`).join("")}</div>
      <div class="shop-actions">
        <a class="pastel-button" href="${map}">View On Map</a>
        <a class="pastel-button alt" href="${tool}">Related Guide</a>
      </div>
    `;
  };

  const applyFilters = () => {
    const query = searchInput?.value || "";
    let firstVisible: HTMLButtonElement | null = null;

    cards.forEach((card) => {
      const type = card.getAttribute("data-type") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const matchesType = activeFilter === "all" || type === activeFilter;
      const isVisible = matchesType && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) firstVisible ||= card;
    });

    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderDetail(firstVisible);
    if (!firstVisible && detail) detail.innerHTML = `<h2>No Shop Match</h2><p>Try a shorter search like pet, Bob, furniture, seeds, Doris, or fishing.</p>`;
  };

  cards.forEach((card) => card.addEventListener("click", () => renderDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-shop-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyFilters();
    });
  });
  searchInput?.addEventListener("input", applyFilters);
  renderDetail(selectedCard);
  applyFilters();
}
