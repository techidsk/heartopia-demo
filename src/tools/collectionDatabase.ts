import { escapeHtml, matchesSearchTerms } from "./dom";

export function initCollectionDatabase() {
  document.querySelectorAll<HTMLElement>("[data-collection-browser]").forEach((root) => {
    const cards = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-collection-card]"));
    const detail = root.querySelector<HTMLElement>("[data-collection-detail]");
    const searchInput = root.querySelector<HTMLInputElement>("[data-collection-search]");
    const filterButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-collection-filter]"));
    const countNode = root.querySelector<HTMLElement>("[data-collection-count]");
    let activeFilter = "all";
    let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0] || null;

    const renderDetail = (card: HTMLButtonElement | null) => {
      if (!detail || !card) return;
      selectedCard = card;
      cards.forEach((item) => item.classList.toggle("is-selected", item === card));

      const name = card.getAttribute("data-name") || "Entry";
      const nameZh = card.getAttribute("data-name-zh") || name;
      const image = card.getAttribute("data-image") || "";
      const imageAlt = card.getAttribute("data-image-alt") || `${name} icon`;
      const season = card.getAttribute("data-season") || "Daily";
      const time = card.getAttribute("data-time") || "Any time";
      const weather = card.getAttribute("data-weather") || "Any weather";
      const route = card.getAttribute("data-route") || "Route pending";
      const level = card.getAttribute("data-level") || "Pending";
      const rarity = card.getAttribute("data-rarity") || "";
      const lore = card.getAttribute("data-lore") || "Source row pending.";
      const wikiUrl = card.getAttribute("data-wiki-url") || "";
      const detailUrl = card.getAttribute("data-detail-url") || "";
      const source = card.getAttribute("data-source") || "Biligame Wiki";

      detail.innerHTML = `
        <div class="collection-detail-head">
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" loading="lazy">` : ""}
          <div>
            <h2>${escapeHtml(name)}</h2>
            <p>${escapeHtml(nameZh)} · ${escapeHtml(source)}</p>
          </div>
        </div>
        <span class="status-chip">${escapeHtml(season)} · Lv ${escapeHtml(level)}${rarity ? ` · Rarity ${escapeHtml(rarity)}` : ""}</span>
        <div class="map-meta">
          <span><strong>Time:</strong> ${escapeHtml(time)}</span>
          <span><strong>Weather:</strong> ${escapeHtml(weather)}</span>
          <span><strong>Route:</strong> ${escapeHtml(route)}</span>
        </div>
        <p>${escapeHtml(lore)}</p>
        <div class="entity-action-grid">
          ${detailUrl ? `<a class="pastel-button" href="${escapeHtml(detailUrl)}">Open Detail</a>` : ""}
          ${wikiUrl ? `<a class="pastel-button alt" href="${escapeHtml(wikiUrl)}" rel="nofollow noopener" target="_blank">Open Wiki Source</a>` : ""}
        </div>
      `;
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

      if (countNode) countNode.textContent = `${visibleCount} item${visibleCount === 1 ? "" : "s"} shown`;
      if (firstVisible && (!selectedCard || selectedCard.hidden)) renderDetail(firstVisible);
      if (!firstVisible && detail) detail.innerHTML = `<h2>No Match</h2><p>Try a shorter search or switch the filter back to All.</p>`;
    };

    cards.forEach((card) => card.addEventListener("click", () => renderDetail(card)));
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.getAttribute("data-collection-filter") || "all";
        filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        applyFilters();
      });
    });
    searchInput?.addEventListener("input", applyFilters);
    renderDetail(selectedCard);
    applyFilters();
  });
}
