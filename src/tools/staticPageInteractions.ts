import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

export function initStaticPageInteractions() {
const affinityForm = document.querySelector("[data-affinity-form]");
if (affinityForm) {
  affinityForm.addEventListener("input", () => {
    const days = Number(affinityForm.querySelector("[name='days']").value || 0);
    const gifts = Number(affinityForm.querySelector("[name='gifts']").value || 0);
    const chats = Number(affinityForm.querySelector("[name='chats']").value || 0);
    const result = affinityForm.querySelector("[data-affinity-result]");
    const points = days * 12 + gifts * 28 + chats * 6;
    result.textContent = `${points} estimated affinity points. Prioritize one favorite gift and one daily talk loop to keep progress steady.`;
  });
}

const noteForm = document.querySelector("[data-note-form]");
if (noteForm) {
  noteForm.addEventListener("input", () => {
    const text = noteForm.querySelector("[name='notes']").value.trim();
    const result = noteForm.querySelector("[data-note-result]");
    const tasks = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    result.textContent = tasks.length
      ? `Checklist saved locally for this session: ${tasks.length} item${tasks.length === 1 ? "" : "s"}.`
      : "Add one task per line to build a compact daily checklist.";
  });
}

document.querySelectorAll("[data-copy-code]").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = button.getAttribute("data-copy-code") || "";
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1400);
    } catch {
      button.textContent = code;
    }
  });
});

const codeFilter = document.querySelector("[data-code-filter]");
if (codeFilter) {
  const codeSearch = document.querySelector("[data-code-search]");
  const codeCount = document.querySelector("[data-code-count]");
  let activeCodeFilter = "all";

  const matchesCodeSearch = (haystack, query) => {
    const normalizedHaystack = String(haystack || "").toLowerCase().replace(/\s+/g, " ").trim();
    const terms = String(query || "").toLowerCase().replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
    return terms.length === 0 || terms.every((term) => normalizedHaystack.includes(term));
  };

  const applyCodeFilters = () => {
    let visibleCount = 0;
    const query = codeSearch?.value || "";
    document.querySelectorAll("[data-code-row]").forEach((row) => {
      const status = row.getAttribute("data-status") || "";
      const haystack = row.getAttribute("data-search") || row.textContent;
      const isVisible = (activeCodeFilter === "all" || status === activeCodeFilter) && matchesCodeSearch(haystack, query);
      row.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (codeCount) codeCount.textContent = `${visibleCount} code${visibleCount === 1 ? "" : "s"} shown`;
  };

  codeFilter.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-filter]");
    if (!target) return;
    activeCodeFilter = target.getAttribute("data-filter") || "all";
    codeFilter.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button === target));
    });
    applyCodeFilters();
  });
  codeSearch?.addEventListener("input", applyCodeFilters);
  applyCodeFilters();
}

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const normalizeText = (value) => String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
const matchesSearchTerms = (haystack, query) => {
  const normalizedHaystack = normalizeText(haystack);
  const terms = normalizeText(query).split(" ").filter(Boolean);
  return terms.length === 0 || terms.every((term) => normalizedHaystack.includes(term));
};

const shopGrid = document.querySelector("[data-shop-grid]");
if (shopGrid) {
  const cards = Array.from(shopGrid.querySelectorAll("[data-shop-card]"));
  const detail = document.querySelector("[data-shop-detail]");
  const searchInput = document.querySelector("[data-shop-search]");
  const filterButtons = Array.from(document.querySelectorAll("[data-shop-filter]"));
  let activeFilter = "all";
  let shops = [];

  const renderShopDetail = (shop) => {
    if (!detail || !shop) return;
    const inventory = (shop.inventory || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    detail.innerHTML = `
      <div class="shop-detail-head">
        <span class="shop-icon shop-icon-${escapeHtml(shop.type)}">${escapeHtml(shop.icon)}</span>
        <div>
          <h2>${escapeHtml(shop.name)}</h2>
          <p>${escapeHtml(shop.owner)} · ${escapeHtml(shop.region)}</p>
        </div>
      </div>
      <div class="shop-route-chip">${escapeHtml(shop.type)} route · ${escapeHtml(shop.unlock)}</div>
      <p>${escapeHtml(shop.notes)}</p>
      <div class="map-meta">
        <span><strong>Hours:</strong> ${escapeHtml(shop.hours)}</span>
        <span><strong>Map marker:</strong> ${escapeHtml(shop.mapMarkerId)}</span>
      </div>
      <div class="shop-inventory-grid" aria-label="${escapeHtml(shop.name)} inventory">${inventory}</div>
      <div class="shop-actions">
        <a class="pastel-button" href="${escapeHtml(shop.links?.map || "/map/")}">View On Map</a>
        <a class="pastel-button alt" href="${escapeHtml(shop.links?.tool || "/database/")}">Related Guide</a>
      </div>
    `;
  };

  const selectShop = (shopId) => {
    const selected = shops.find((shop) => shop.id === shopId) || shops[0];
    cards.forEach((card) => {
      const isSelected = card.getAttribute("data-shop-id") === selected?.id;
      card.classList.toggle("is-selected", isSelected);
      card.setAttribute("aria-pressed", String(isSelected));
    });
    renderShopDetail(selected);
  };

  const applyShopFilters = () => {
    const query = searchInput?.value || "";
    let firstVisible = null;
    cards.forEach((card) => {
      const type = card.getAttribute("data-type") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const matchesType = activeFilter === "all" || type === activeFilter;
      const matchesSearch = matchesSearchTerms(haystack, query);
      const isVisible = matchesType && matchesSearch;
      card.hidden = !isVisible;
      if (isVisible && !firstVisible) firstVisible = card;
    });
    if (firstVisible) selectShop(firstVisible.getAttribute("data-shop-id"));
    if (!firstVisible && detail) {
      detail.innerHTML = `
        <h2>No Shop Match</h2>
        <p>Try a shorter search like pet, Bob, furniture, seeds, Doris, or fishing.</p>
      `;
    }
  };

  cards.forEach((card) => {
    card.setAttribute("aria-pressed", String(card.classList.contains("is-selected")));
    card.addEventListener("click", () => selectShop(card.getAttribute("data-shop-id")));
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-shop-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyShopFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyShopFilters);
  }

  fetch("/assets/data/shops.json")
    .then((response) => response.json())
    .then((data) => {
      shops = data;
      selectShop(cards.find((card) => card.classList.contains("is-selected"))?.getAttribute("data-shop-id"));
    })
    .catch(() => {
      shops = cards.map((card) => ({
        id: card.getAttribute("data-shop-id"),
        type: card.getAttribute("data-type"),
        icon: card.querySelector(".shop-icon")?.textContent || "SH",
        name: card.querySelector("strong")?.textContent || "Shop",
        owner: "Route owner",
        region: "Heartopia",
        unlock: "Check the related route.",
        hours: "Confirm in game.",
        mapMarkerId: card.getAttribute("data-shop-id"),
        inventory: ["Inventory pending"],
        notes: card.getAttribute("data-search") || "Use this shop as a route stop.",
        links: { map: `/map/?marker=${card.getAttribute("data-shop-id")}`, tool: "/database/" }
      }));
      selectShop(cards[0]?.getAttribute("data-shop-id"));
    });
}

const createHeartopiaMapOverlay = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" role="img" aria-label="Heartopia local route map">
      <defs>
        <linearGradient id="sea" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#bdeaf1"/><stop offset="1" stop-color="#8fcbd9"/></linearGradient>
        <linearGradient id="forest" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#caeab9"/><stop offset="1" stop-color="#73b977"/></linearGradient>
        <linearGradient id="town" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff0c9"/><stop offset="1" stop-color="#efbf73"/></linearGradient>
        <linearGradient id="mountain" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e5e0d6"/><stop offset="1" stop-color="#aebbb7"/></linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#5f4a3d" flood-opacity="0.16"/></filter>
      </defs>
      <rect width="1200" height="1200" fill="url(#sea)"/>
      <path d="M44 690 C104 594 188 548 281 600 C364 646 409 806 326 1036 C196 1101 78 1038 38 902 Z" fill="#f4dfa3" filter="url(#softShadow)"/>
      <path d="M108 130 C266 48 450 109 514 254 C535 326 443 466 298 474 C160 485 67 381 70 246 Z" fill="url(#forest)" filter="url(#softShadow)"/>
      <path d="M378 438 C492 333 704 338 810 454 C909 563 840 742 660 794 C514 839 391 726 342 606 Z" fill="url(#town)" filter="url(#softShadow)"/>
      <path d="M666 78 C845 25 1069 135 1146 316 C1093 470 905 537 746 446 C626 378 581 211 666 78 Z" fill="url(#mountain)" filter="url(#softShadow)"/>
      <path d="M142 560 C273 477 433 560 438 733 C357 870 206 858 105 745 Z" fill="#cfedbd" filter="url(#softShadow)"/>
      <path d="M759 684 C899 585 1116 666 1170 829 C1121 1047 922 1167 750 1062 C660 934 668 772 759 684 Z" fill="#f4cea1" filter="url(#softShadow)"/>
      <path d="M206 139 C286 309 414 492 542 625 C659 746 781 882 871 1061" fill="none" stroke="#69b5cc" stroke-width="34" stroke-linecap="round" opacity="0.62"/>
      <path d="M206 139 C286 309 414 492 542 625 C659 746 781 882 871 1061" fill="none" stroke="#f3ffff" stroke-width="8" stroke-linecap="round" opacity="0.62"/>
      <path d="M244 766 C462 650 685 659 910 752" fill="none" stroke="#a8825d" stroke-width="26" stroke-linecap="round" stroke-dasharray="4 34" opacity="0.56"/>
      <path d="M640 598 C735 430 863 369 1032 377" fill="none" stroke="#a8825d" stroke-width="26" stroke-linecap="round" stroke-dasharray="4 34" opacity="0.48"/>
      <g fill="#5a4338" font-family="Georgia, 'Times New Roman', serif" font-weight="900" font-size="40" text-anchor="middle" paint-order="stroke" stroke="#fff7df" stroke-width="9" stroke-linejoin="round">
        <text x="250" y="282">Forest</text><text x="608" y="605">Central Town</text><text x="246" y="695">Flower Field</text><text x="919" y="286">Onsen</text><text x="930" y="878">Fishing Village</text><text x="198" y="950">Home</text>
      </g>
      <g opacity="0.75">
        <circle cx="170" cy="234" r="18" fill="#43814f"/><circle cx="246" cy="188" r="20" fill="#43814f"/><circle cx="333" cy="244" r="24" fill="#43814f"/>
        <circle cx="190" cy="381" r="18" fill="#43814f"/><circle cx="351" cy="410" r="20" fill="#43814f"/>
        <path d="M841 237 l46 -93 l49 93 z" fill="#8a958f"/><path d="M942 276 l62 -124 l64 124 z" fill="#8a958f"/><path d="M730 276 l52 -107 l56 107 z" fill="#8a958f"/>
      </g>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const mapGuideHref = (point) => {
  if (point.category === "shop") return "/shops/";
  if (point.category === "fish") return "/fish/";
  if (point.category === "animal") return "/animal-favorites/";
  if (point.category === "npc") return "/npcs/";
  if (point.category === "home") return "/house-designs/";
  if (point.category === "resource") return "/recipes/";
  return "/map/";
};

const hasCjkText = (value) => /[\u3400-\u9fff]/.test(String(value || ""));

const levelWords = {
  "一级": "Level 1",
  "二级": "Level 2",
  "三级": "Level 3",
  "四级": "Level 4",
  "五级": "Level 5",
  "六级": "Level 6",
  "七级": "Level 7",
  "八级": "Level 8",
  "九级": "Level 9",
  "十级": "Level 10",
  "十一级": "Level 11",
  "十二级": "Level 12"
};

const knownMapTerms = [
  ["心动小镇", "Heartopia"],
  ["城镇设施", "Town facilities"],
  ["小镇居民", "Town residents"],
  ["居民区", "Residential district"],
  ["码头", "Pier"],
  ["城镇", "Central Town"],
  ["渔村", "Fishing Village"],
  ["森林", "Forest"],
  ["花田", "Flower Field"],
  ["温泉山湖", "Onsen Mountain Lake"],
  ["温泉山", "Onsen Mountains"],
  ["湖鱼", "Lake fish"],
  ["海鱼", "Sea fish"],
  ["鱼", "Fish"],
  ["鸟类", "Birds"],
  ["虫类", "Insects"],
  ["每周粉色泡泡", "Weekly pink bubble"],
  ["动物新邻季限定泡泡", "Animal Neighbor season bubble"],
  ["泡泡", "Bubbles"],
  ["采集资源", "Gathering resources"],
  ["限时资源", "Timed resources"],
  ["梦光影", "Dreamlight event"],
  ["冰雪季", "Snow season"],
  ["潮流季限定", "Trend season limited"],
  ["沸雪浴场", "Snow bathhouse"],
  ["巴士站", "Bus stop"],
  ["公交站台", "Bus stop"],
  ["宠物之家", "Pet shop"],
  ["捕虫商店", "Bug-catching shop"],
  ["钓鱼商店", "Fishing shop"],
  ["服装店", "Clothing store"],
  ["家具店", "Furniture workshop"],
  ["音乐广场", "Music plaza"],
  ["烹饪商店", "Cooking shop"],
  ["幸运商店", "Lucky shop"],
  ["海钓", "Sea fishing"],
  ["户外工匠台", "Outdoor crafting bench"],
  ["户外灶台", "Outdoor stove"],
  ["彩蛋", "Easter egg"]
];

const translateMapText = (value, fallback = "Local map marker") => {
  let text = String(value || "").trim();
  if (!text) return fallback;
  Object.entries(levelWords).forEach(([source, target]) => {
    text = text.replace(new RegExp(source, "g"), target);
  });
  knownMapTerms.forEach(([source, target]) => {
    text = text.replace(new RegExp(source, "g"), target);
  });
  text = text.replace(/([a-z])(?=\d)/gi, "$1 ").replace(/[()（）]/g, " ").replace(/\s+/g, " ").trim();
  return hasCjkText(text) ? fallback : text;
};

const mapPointDisplay = (point) => {
  const categoryLabel =
    {
      npc: "Resident marker",
      shop: "Facility marker",
      animal: "Wildlife marker",
      fish: "Fish marker",
      resource: "Resource marker",
      home: "Bubble marker"
    }[point.category] || "Local map marker";
  const title = translateMapText(point.title || point.typeTitle, categoryLabel);
  const type = translateMapText(point.typeTitle || point.title, categoryLabel);
  const groups = Array.isArray(point.groupTitles)
    ? point.groupTitles.map((group) => translateMapText(group, "")).filter(Boolean)
    : [];
  const region = translateMapText(point.regionName, "Global map layer");
  return { title, type, groups, region };
};

const initHeartopiaLeafletMap = async (interactiveMap) => {
  const stage = interactiveMap.querySelector(".map-stage");
  const detail = interactiveMap.querySelector("[data-map-detail]");
  const filters = Array.from(interactiveMap.querySelectorAll("[data-map-filter]"));
  const searchInput = interactiveMap.querySelector("[data-map-search]");
  const resultNode = interactiveMap.querySelector("[data-map-result-count]");
  const fullscreenButton = interactiveMap.querySelector("[data-map-fullscreen]");
  const storageKey = "heartopia-map-completed";
  const labels = {
    all: interactiveMap.getAttribute("data-map-label-all") || "All",
    markerShownSingular: interactiveMap.getAttribute("data-map-label-marker-shown-singular") || "marker shown",
    markerShownPlural: interactiveMap.getAttribute("data-map-label-marker-shown-plural") || "markers shown",
    visibleCompleted: interactiveMap.getAttribute("data-map-label-visible-completed") || "visible markers completed",
    progressSaved: interactiveMap.getAttribute("data-map-label-progress-saved") || "Progress is saved locally in this browser.",
    localRouteMarker: interactiveMap.getAttribute("data-map-label-local-route-marker") || "Local route marker",
    markerBody: interactiveMap.getAttribute("data-map-label-marker-body") || "Use this marker inside the local Heartopia route layer.",
    category: interactiveMap.getAttribute("data-map-label-category") || "Category",
    group: interactiveMap.getAttribute("data-map-label-group") || "Group",
    region: interactiveMap.getAttribute("data-map-label-region") || "Region",
    coords: interactiveMap.getAttribute("data-map-label-coords") || "Coords",
    markComplete: interactiveMap.getAttribute("data-map-label-mark-complete") || "Mark complete",
    markIncomplete: interactiveMap.getAttribute("data-map-label-mark-incomplete") || "Mark incomplete",
    openRelatedGuide: interactiveMap.getAttribute("data-map-label-open-related-guide") || "Open Related Guide",
    fullscreen: interactiveMap.getAttribute("data-map-label-fullscreen") || "Full screen",
    exitFullscreen: interactiveMap.getAttribute("data-map-label-exit-fullscreen") || "Exit full screen",
    noMatchTitle: interactiveMap.getAttribute("data-map-label-no-match-title") || "No Map Match",
    noMatchBody:
      interactiveMap.getAttribute("data-map-label-no-match-body") ||
      "Try a shorter search like Dorothy, gardening store, blueberry, lake fish, bubble, bird, fish, or resource.",
    mapLoadErrorTitle: interactiveMap.getAttribute("data-map-label-load-error-title") || "Map Data Could Not Load",
    mapLoadErrorBody:
      interactiveMap.getAttribute("data-map-label-load-error-body") ||
      "The local Heartopia Leaflet map is unavailable right now. Refresh the page or use the static route notes below.",
    legend: interactiveMap.getAttribute("data-map-label-legend") || "Map legend",
    legendResidents: interactiveMap.getAttribute("data-map-label-legend-residents") || "Residents",
    legendFacilities: interactiveMap.getAttribute("data-map-label-legend-facilities") || "Facilities",
    legendWildlife: interactiveMap.getAttribute("data-map-label-legend-wildlife") || "Wildlife",
    legendFish: interactiveMap.getAttribute("data-map-label-legend-fish") || "Fish",
    legendResources: interactiveMap.getAttribute("data-map-label-legend-resources") || "Resources",
    legendBubbles: interactiveMap.getAttribute("data-map-label-legend-bubbles") || "Bubbles"
  };
  const categoryLabelOverrides = {
    npc: interactiveMap.getAttribute("data-map-category-label-npc"),
    shop: interactiveMap.getAttribute("data-map-category-label-shop"),
    animal: interactiveMap.getAttribute("data-map-category-label-animal"),
    fish: interactiveMap.getAttribute("data-map-category-label-fish"),
    resource: interactiveMap.getAttribute("data-map-category-label-resource"),
    home: interactiveMap.getAttribute("data-map-category-label-home")
  };
  const currentLocalePrefix = window.location.pathname.match(/^\/[a-z]{2}(?:-[a-z]+)?\//i)?.[0]?.replace(/\/$/, "") || "";
  const localizedGuideHref = (href) => {
    if (!currentLocalePrefix || !href.startsWith("/") || href.startsWith(`${currentLocalePrefix}/`)) return href;
    return `${currentLocalePrefix}${href}`;
  };
  if (!stage || !detail) return;

  interactiveMap.classList.add("is-leaflet-loading");
  stage.insertAdjacentHTML("afterbegin", '<div class="heartopia-leaflet-map" data-leaflet-map role="application" aria-label="Heartopia Leaflet route map"></div>');
  const mapNode = stage.querySelector("[data-leaflet-map]");

  try {
    const data = await fetch("/assets/data/heartopia-map.json").then((response) => {
      if (!response.ok) throw new Error(`Heartopia map data returned ${response.status}`);
      return response.json();
    });
    const bounds = [
      [data.map.bounds[1], data.map.bounds[0]],
      [data.map.bounds[3], data.map.bounds[2]]
    ];
    const categoryLabels = Object.fromEntries(
      data.categories.map((category) => [category.id, categoryLabelOverrides[category.id] || category.label])
    );
    const categoryColors = {
      npc: "#d75f82",
      shop: "#3c83b7",
      animal: "#6c8f39",
      fish: "#287f90",
      resource: "#a86f2e",
      home: "#b45ca9"
    };
    const aliasTerms = {
      "gardening-store": ["gardening store", "园艺商店", "布兰克"],
      "furniture-workshop": ["furniture workshop", "波叔", "家具店"],
      "pet-shop": ["pet shop", "宠物之家"],
      "clothing-store": ["clothing store", "服装店", "多萝西"],
      "music-store": ["music store", "音乐商店", "安妮"],
      "general-store": ["general store", "卡清"],
      "sea-fishing-booth": ["sea fishing", "海钓", "比尔"],
      dorothy: ["Dorothy", "多萝西"],
      bob: ["Bob", "波叔"],
      "ka-ching": ["Ka Ching", "卡清"],
      bill: ["Bill", "比尔"],
      "forest-lake": ["forest lake", "森林湖鱼"],
      "meadow-lake": ["meadow lake", "草原湖鱼"],
      "whale-sea": ["whale sea", "鲸鱼海"],
      "onsen-mountain-lake": ["onsen mountain lake", "温泉山湖鱼"],
      bamboo: ["bamboo", "稀有木材"],
      "shiitake-mushrooms": ["shiitake", "香菇"],
      "oyster-mushrooms": ["oyster mushroom", "蘑菇"],
      "central-town": ["gardening store", "园艺商店"],
      forest: ["forest lake", "森林湖鱼"],
      "flower-field": ["meadow lake", "草原湖鱼"],
      "fishing-village": ["sea fishing", "海钓"],
      "onsen-mountains": ["onsen mountain lake", "温泉山湖鱼"],
      panda: ["panda", "熊猫"],
      fox: ["fox", "狐狸"],
      capybara: ["capybara", "水豚"],
      "sea-otter": ["sea otter", "海獭"],
      bubble: ["bubble", "泡泡"]
    };

    filters.forEach((button) => {
      const filter = button.getAttribute("data-map-filter") || "all";
      if (filter === "all") button.textContent = `${labels.all} (${data.points.length})`;
      else if (categoryLabels[filter]) {
        const count = data.categories.find((category) => category.id === filter)?.count || 0;
        button.textContent = `${categoryLabels[filter]} (${count})`;
      }
    });

    const completedMarkers = (() => {
      try {
        return new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
      } catch {
        return new Set();
      }
    })();
    const writeCompleted = () => {
      try {
        localStorage.setItem(storageKey, JSON.stringify([...completedMarkers]));
      } catch {}
    };

    const map = L.map(mapNode, {
      minZoom: data.map.minZoom,
      maxZoom: data.map.maxZoom,
      maxBounds: bounds,
      maxBoundsViscosity: 0.75,
      zoomSnap: 0.25,
      wheelPxPerZoomLevel: 80,
      attributionControl: false
    });
    map.setView([data.map.startLat || 0, data.map.startLng || 0], data.map.initialZoom || 9);
    L.imageOverlay(createHeartopiaMapOverlay(), bounds, {
      opacity: 1,
      interactive: false
    }).addTo(map);

    const regionLayer = L.layerGroup().addTo(map);
    data.regions
      .filter((region) => Array.isArray(region.polygon) && region.polygon.length)
      .forEach((region) => {
        const rings = region.polygon.map((ring) => ring.map(([lng, lat]) => [lat, lng]));
        L.polygon(rings, {
          color: region.parentId ? "rgba(87, 99, 79, 0.35)" : "rgba(87, 99, 79, 0.6)",
          weight: region.parentId ? 1 : 2,
          fillColor: "#f5d8a5",
          fillOpacity: region.parentId ? 0.03 : 0.06,
          interactive: false
        }).addTo(regionLayer);
      });

    const markerLayer = L.layerGroup().addTo(map);
    let activeFilter = "all";
    let selectedPoint = null;
    let visibleEntries = [];
    const markerEntries = data.points.map((point) => {
      const color = categoryColors[point.category] || categoryColors.resource;
      const display = mapPointDisplay(point);
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: point.defaultVisible ? 7 : 5,
        color: "#ffffff",
        weight: point.defaultVisible ? 2 : 1,
        fillColor: color,
        fillOpacity: point.defaultVisible ? 0.95 : 0.72,
        opacity: 1
      });
      marker.on("click", () => selectPoint(point));
      marker.bindTooltip(display.title, { direction: "top", offset: [0, -8], opacity: 0.92 });
      return { point, marker };
    });

    const markerMatches = (point, filter, query) => {
      const matchesFilter = filter === "all" || point.category === filter;
      const display = mapPointDisplay(point);
      const haystack = [
        point.category,
        point.search,
        point.title,
        point.typeTitle,
        display.title,
        display.type,
        display.region,
        display.groups.join(" ")
      ].join(" ");
      return matchesFilter && matchesSearchTerms(haystack, query);
    };

    const styleMarker = (entry) => {
      const isSelected = selectedPoint?.id === entry.point.id;
      const isComplete = completedMarkers.has(entry.point.id);
      const color = categoryColors[entry.point.category] || categoryColors.resource;
      entry.marker.setStyle({
        radius: isSelected ? 10 : entry.point.defaultVisible ? 7 : 5,
        color: isSelected ? "#2f261f" : isComplete ? "#f6fff0" : "#ffffff",
        weight: isSelected ? 3 : isComplete ? 2 : 1,
        fillColor: isComplete ? "#8aa76a" : color,
        fillOpacity: isSelected ? 1 : entry.point.defaultVisible ? 0.95 : 0.72
      });
      if (isSelected) entry.marker.bringToFront();
    };

    const renderProgress = () => {
      const progressNode = interactiveMap.querySelector("[data-map-progress]");
      if (!progressNode) return;
      const completedVisible = visibleEntries.filter(({ point }) => completedMarkers.has(point.id)).length;
      progressNode.textContent = `${completedVisible}/${visibleEntries.length} ${labels.visibleCompleted}`;
    };

    function selectPoint(point, shouldPan = true) {
      selectedPoint = point;
      markerEntries.forEach(styleMarker);
      const categoryLabel = categoryLabels[point.category] || "Point";
      const display = mapPointDisplay(point);
      const groupText = display.groups.length ? display.groups.join(" / ") : labels.localRouteMarker;
      const regionText = display.region;
      const completed = completedMarkers.has(point.id);
      const guideHref = localizedGuideHref(mapGuideHref(point));
      detail.innerHTML = `
        <h2>${escapeHtml(display.title)}</h2>
        <p>${escapeHtml(display.type)} · ${escapeHtml(categoryLabel)}. ${escapeHtml(labels.markerBody)}</p>
        <div class="map-meta">
          <span><strong>${escapeHtml(labels.category)}:</strong> ${escapeHtml(categoryLabel)}</span>
          <span><strong>${escapeHtml(labels.group)}:</strong> ${escapeHtml(groupText)}</span>
          <span><strong>${escapeHtml(labels.region)}:</strong> ${escapeHtml(regionText)}</span>
          <span><strong>${escapeHtml(labels.coords)}:</strong> ${point.lng.toFixed(4)}, ${point.lat.toFixed(4)}</span>
        </div>
        <div class="map-progress-card"><strong data-map-progress>0/0 ${escapeHtml(labels.visibleCompleted)}</strong><span>${escapeHtml(labels.progressSaved)}</span></div>
        <div class="map-action-row">
          <button class="map-state-button" type="button" data-map-toggle-complete="${escapeHtml(point.id)}">${completed ? escapeHtml(labels.markIncomplete) : escapeHtml(labels.markComplete)}</button>
          <a class="map-state-button link" href="${escapeHtml(guideHref)}">${escapeHtml(labels.openRelatedGuide)}</a>
        </div>
        <div class="map-legend" aria-label="${escapeHtml(labels.legend)}">
          <span><i class="legend-dot npc"></i> ${escapeHtml(labels.legendResidents)}</span>
          <span><i class="legend-dot shop"></i> ${escapeHtml(labels.legendFacilities)}</span>
          <span><i class="legend-dot animal"></i> ${escapeHtml(labels.legendWildlife)}</span>
          <span><i class="legend-dot"></i> ${escapeHtml(labels.legendFish)}</span>
          <span><i class="legend-dot resource"></i> ${escapeHtml(labels.legendResources)}</span>
          <span><i class="legend-dot home"></i> ${escapeHtml(labels.legendBubbles)}</span>
        </div>
      `;
      const toggleButton = detail.querySelector("[data-map-toggle-complete]");
      toggleButton?.addEventListener("click", () => {
        if (completedMarkers.has(point.id)) completedMarkers.delete(point.id);
        else completedMarkers.add(point.id);
        writeCompleted();
        selectPoint(point, false);
      });
      renderProgress();
      if (shouldPan) map.panTo([point.lat, point.lng], { animate: true, duration: 0.35 });
    }

    const applyMapFilters = () => {
      const query = searchInput?.value || "";
      markerLayer.clearLayers();
      visibleEntries = markerEntries.filter(({ point }) => markerMatches(point, activeFilter, query));
      visibleEntries.forEach((entry) => {
        styleMarker(entry);
        entry.marker.addTo(markerLayer);
      });
      if (resultNode) {
        resultNode.textContent = `${visibleEntries.length} ${
          visibleEntries.length === 1 ? labels.markerShownSingular : labels.markerShownPlural
        }`;
      }
      if (!visibleEntries.some(({ point }) => point.id === selectedPoint?.id)) {
        if (visibleEntries[0]) selectPoint(visibleEntries[0].point, false);
        else {
          detail.innerHTML = `
            <h2>${escapeHtml(labels.noMatchTitle)}</h2>
            <p>${escapeHtml(labels.noMatchBody)}</p>
          `;
        }
      } else {
        markerEntries.forEach(styleMarker);
        renderProgress();
      }
    };

    filters.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.getAttribute("data-map-filter") || "all";
        filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        applyMapFilters();
      });
    });
    searchInput?.addEventListener("input", applyMapFilters);

    fullscreenButton?.addEventListener("click", () => {
      const isFullscreen = interactiveMap.classList.toggle("is-fullscreen");
      fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
      fullscreenButton.textContent = isFullscreen ? labels.exitFullscreen : labels.fullscreen;
      window.setTimeout(() => map.invalidateSize(), 60);
    });

    const contentSelectionTerms = [
      ["starter loop", "gardening-store"],
      ["animal loop", "fox"],
      ["fishing loop", "meadow-lake"],
      ["central town", "central-town"],
      ["fishing village", "fishing-village"],
      ["flower field", "flower-field"],
      ["onsen mountain", "onsen-mountains"],
      ["forest lake", "forest-lake"],
      ["forest", "forest"],
      ["home", "bubble"],
      ["alpaca", "fox"],
      ["bunny", "pet-shop"],
      ["capybara", "capybara"],
      ["ferret", "fish"],
      ["fox", "fox"],
      ["panda", "panda"],
      ["sea otter", "sea-otter"],
      ["sika deer", "forest"],
      ["dorothy", "dorothy"],
      ["bob", "bob"],
      ["bailey", "pet-shop"],
      ["ka ching", "ka-ching"],
      ["bill", "bill"],
      ["naughty", "onsen-mountains"],
      ["doris", "clothing-store"],
      ["meadow lake", "meadow-lake"],
      ["whale sea", "whale-sea"],
      ["secret pond", "fish"]
    ];

    const findPointForTerms = (terms) => {
      for (const term of terms) {
        if (!term) continue;
        const point =
          data.points.find((candidate) => markerMatches(candidate, "all", term)) ||
          data.points.find((candidate) => matchesSearchTerms(candidate.search, term));
        if (point) return point;
      }
      return null;
    };

    const selectContentTarget = (rawText) => {
      const text = normalizeText(rawText);
      const match = contentSelectionTerms.find(([label]) => text.includes(label));
      const terms = match ? aliasTerms[match[1]] || [match[1]] : [text];
      const point = findPointForTerms(terms);
      if (!point) return false;
      if (searchInput) searchInput.value = "";
      activeFilter = "all";
      filters.forEach((item) => item.setAttribute("aria-pressed", String(item.getAttribute("data-map-filter") === "all")));
      applyMapFilters();
      selectPoint(point, true);
      detail.scrollIntoView({ block: "nearest", behavior: "smooth" });
      return true;
    };

    document.querySelectorAll(".map-route-card, .dense-table tbody tr").forEach((node) => {
      node.addEventListener("click", () => selectContentTarget(node.textContent || ""));
      node.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectContentTarget(node.textContent || "");
      });
      if (!node.hasAttribute("tabindex")) node.setAttribute("tabindex", "0");
      if (!node.hasAttribute("role")) node.setAttribute("role", "button");
    });

    const requestedMarker = new URLSearchParams(window.location.search).get("marker") || "";
    const requestedTerms = aliasTerms[requestedMarker] || [requestedMarker];
    const initialPoint =
      data.points.find((point) => point.id === requestedMarker || String(point.sourceId) === requestedMarker) ||
      data.points.find((point) => requestedTerms.some((term) => term && matchesSearchTerms(point.search, term))) ||
      data.points.find((point) => point.defaultVisible) ||
      data.points[0];

    if (requestedMarker && !searchInput?.value) {
      const alias = aliasTerms[requestedMarker]?.[0];
      if (alias && searchInput) searchInput.value = alias;
    }
    applyMapFilters();
    if (initialPoint) selectPoint(initialPoint, true);
    interactiveMap.classList.remove("is-leaflet-loading");
    interactiveMap.classList.add("is-leaflet-ready");
    window.setTimeout(() => map.invalidateSize(), 100);
  } catch (error) {
    interactiveMap.classList.remove("is-leaflet-loading");
    interactiveMap.classList.add("is-leaflet-error");
    detail.innerHTML = `
      <h2>${escapeHtml(labels.mapLoadErrorTitle)}</h2>
      <p>${escapeHtml(labels.mapLoadErrorBody)}</p>
    `;
    console.error(error);
  }
};

const interactiveMap = document.querySelector("[data-interactive-map]");
if (interactiveMap) {
  if (interactiveMap.getAttribute("data-map-source") === "leaflet") {
    initHeartopiaLeafletMap(interactiveMap);
  } else {
  const detail = interactiveMap.querySelector("[data-map-detail]");
  const markers = Array.from(interactiveMap.querySelectorAll("[data-map-point]"));
  const filters = Array.from(interactiveMap.querySelectorAll("[data-map-filter]"));
  const searchInput = interactiveMap.querySelector("[data-map-search]");
  const resultNode = interactiveMap.querySelector("[data-map-result-count]");
  const fullscreenButton = interactiveMap.querySelector("[data-map-fullscreen]");
  const mapCanvas = interactiveMap.querySelector("[data-map-canvas]");
  const storageKey = "heartopia-map-completed";
  let activeFilter = "all";
  let selectedMarker = null;
  let mapDrawFrame = 0;

  const drawMapCanvas = () => {
    if (!mapCanvas) return;
    const bounds = mapCanvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const context = mapCanvas.getContext("2d", { alpha: false });
    if (!context || typeof Path2D === "undefined") return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    mapCanvas.width = Math.round(bounds.width * dpr);
    mapCanvas.height = Math.round(bounds.height * dpr);
    context.setTransform(mapCanvas.width / 900, 0, 0, mapCanvas.height / 620, 0, 0);
    context.clearRect(0, 0, 900, 620);

    const linear = (x1, y1, x2, y2, stops) => {
      const gradient = context.createLinearGradient(x1, y1, x2, y2);
      stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
      return gradient;
    };

    const sea = linear(0, 0, 900, 620, [
      [0, "#c9eef5"],
      [0.55, "#b7e4ee"],
      [1, "#8fcddb"]
    ]);
    context.fillStyle = sea;
    context.fillRect(0, 0, 900, 620);

    context.lineCap = "round";
    context.strokeStyle = "rgba(255, 255, 255, 0.42)";
    context.lineWidth = 3;
    for (let y = 62; y < 590; y += 52) {
      context.beginPath();
      context.moveTo(28, y);
      context.bezierCurveTo(150, y - 18, 242, y + 22, 360, y + 2);
      context.bezierCurveTo(515, y - 24, 663, y + 20, 872, y - 10);
      context.stroke();
    }

    const paintRegion = (pathData, fillStyle) => {
      const path = new Path2D(pathData);
      context.fillStyle = fillStyle;
      context.fill(path);
      context.strokeStyle = "rgba(91, 64, 47, 0.34)";
      context.lineWidth = 3;
      context.stroke(path);
    };

    paintRegion("M28 356 C85 292 147 279 211 319 C275 360 304 460 253 557 C155 585 74 554 31 487 Z", "#f3e1a4");
    paintRegion(
      "M70 75 C188 38 313 72 357 162 C381 214 322 283 232 292 C133 302 59 242 49 163 Z",
      linear(70, 75, 357, 292, [
        [0, "#c4e5b5"],
        [1, "#78b87d"]
      ])
    );
    paintRegion(
      "M280 249 C353 201 490 187 574 254 C636 304 607 407 514 445 C422 482 296 447 251 370 Z",
      linear(251, 210, 614, 445, [
        [0, "#fff2cf"],
        [1, "#f7cf8a"]
      ])
    );
    paintRegion(
      "M482 52 C612 28 757 78 832 190 C807 276 710 315 602 282 C506 252 450 158 482 52 Z",
      linear(482, 52, 832, 282, [
        [0, "#e5e1d9"],
        [1, "#b9c4be"]
      ])
    );
    paintRegion(
      "M95 295 C211 257 294 335 303 432 C241 492 147 480 89 416 Z",
      linear(89, 295, 303, 492, [
        [0, "#dff4cf"],
        [1, "#bfe2a8"]
      ])
    );
    paintRegion("M566 346 C650 289 798 299 865 387 C842 492 737 576 602 554 C532 493 525 407 566 346 Z", "#f8d7a9");

    const drawStrokePath = (pathData, color, width, dash = []) => {
      const path = new Path2D(pathData);
      context.save();
      context.strokeStyle = color;
      context.lineWidth = width;
      context.lineCap = "round";
      context.setLineDash(dash);
      context.stroke(path);
      context.restore();
    };

    drawStrokePath("M143 84 C199 153 257 230 328 304 C389 368 486 430 606 518", "rgba(94, 169, 202, 0.78)", 18);
    drawStrokePath("M143 84 C199 153 257 230 328 304 C389 368 486 430 606 518", "rgba(230, 250, 255, 0.55)", 5);
    drawStrokePath("M177 391 C310 342 429 335 611 393", "rgba(171, 132, 93, 0.58)", 18, [2, 22]);
    drawStrokePath("M436 316 C504 235 586 201 705 198", "rgba(171, 132, 93, 0.58)", 18, [2, 22]);

    const drawTree = (x, y, size) => {
      context.fillStyle = "rgba(65, 127, 78, 0.72)";
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "rgba(72, 82, 46, 0.28)";
      context.fillRect(x - 1.5, y + size * 0.55, 3, size * 0.82);
    };
    [
      [116, 121, 9],
      [158, 99, 8],
      [218, 122, 10],
      [286, 163, 9],
      [123, 222, 8],
      [229, 242, 9],
      [174, 184, 7]
    ].forEach(([x, y, size]) => drawTree(x, y, size));

    const drawHouse = (x, y, color) => {
      context.fillStyle = "rgba(96, 70, 54, 0.14)";
      context.fillRect(x - 18, y + 19, 42, 8);
      context.fillStyle = color;
      context.fillRect(x - 15, y - 6, 30, 25);
      context.fillStyle = "#8e6b57";
      context.beginPath();
      context.moveTo(x - 19, y - 6);
      context.lineTo(x, y - 24);
      context.lineTo(x + 19, y - 6);
      context.closePath();
      context.fill();
    };
    [
      [377, 331, "#f4b38c"],
      [435, 286, "#d7a4cf"],
      [502, 335, "#f0ce73"],
      [534, 382, "#8bc8bf"],
      [699, 407, "#eeb884"],
      [754, 455, "#c7b1dd"]
    ].forEach(([x, y, color]) => drawHouse(x, y, color));

    const drawMountain = (x, y, size) => {
      context.fillStyle = "rgba(106, 117, 111, 0.36)";
      context.beginPath();
      context.moveTo(x - size, y + size * 0.7);
      context.lineTo(x, y - size);
      context.lineTo(x + size, y + size * 0.7);
      context.closePath();
      context.fill();
      context.fillStyle = "rgba(255, 255, 255, 0.58)";
      context.beginPath();
      context.moveTo(x - size * 0.3, y - size * 0.35);
      context.lineTo(x, y - size);
      context.lineTo(x + size * 0.34, y - size * 0.28);
      context.closePath();
      context.fill();
    };
    [
      [616, 141, 34],
      [693, 164, 42],
      [760, 203, 32]
    ].forEach(([x, y, size]) => drawMountain(x, y, size));

    context.strokeStyle = "rgba(116, 103, 82, 0.26)";
    context.lineWidth = 2;
    [
      [96, 405, 38],
      [155, 448, 30],
      [227, 510, 42],
      [621, 496, 28],
      [807, 405, 36]
    ].forEach(([x, y, radius]) => {
      context.beginPath();
      context.arc(x, y, radius, 0.18, Math.PI * 1.18);
      context.stroke();
    });

    const drawLabel = (text, x, y) => {
      context.font = "900 22px Georgia, 'Times New Roman', serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.lineWidth = 5;
      context.strokeStyle = "rgba(255, 255, 255, 0.78)";
      context.fillStyle = "#5a4338";
      context.strokeText(text, x, y);
      context.fillText(text, x, y);
    };
    drawLabel("Forest", 168, 143);
    drawLabel("Central Town", 420, 329);
    drawLabel("Flower Field", 190, 384);
    drawLabel("Onsen", 668, 168);
    drawLabel("Fishing Village", 682, 437);
    drawLabel("Home", 145, 492);
  };

  const queueMapCanvasDraw = () => {
    if (!mapCanvas) return;
    window.cancelAnimationFrame(mapDrawFrame);
    mapDrawFrame = window.requestAnimationFrame(drawMapCanvas);
  };

  if (mapCanvas) {
    queueMapCanvasDraw();
    window.addEventListener("resize", queueMapCanvasDraw);
    if ("ResizeObserver" in window) {
      new ResizeObserver(queueMapCanvasDraw).observe(mapCanvas.parentElement || mapCanvas);
    }
  }

  const markerId = (marker) =>
    marker.getAttribute("data-map-id") ||
    normalizeText(marker.getAttribute("data-name")).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const readCompleted = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    } catch {
      return new Set();
    }
  };

  const writeCompleted = (completed) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...completed]));
    } catch {}
  };

  let completedMarkers = readCompleted();

  const renderProgress = () => {
    markers.forEach((marker) => marker.classList.toggle("is-complete", completedMarkers.has(markerId(marker))));
    const progressNode = interactiveMap.querySelector("[data-map-progress]");
    if (!progressNode) return;
    const visible = markers.filter((marker) => !marker.classList.contains("is-hidden"));
    const completedVisible = visible.filter((marker) => completedMarkers.has(markerId(marker))).length;
    progressNode.textContent = `${completedVisible}/${visible.length} visible markers completed`;
  };

  const markerMatches = (marker, filter, query) => {
    const type = marker.getAttribute("data-type") || "";
    const haystack = [
      type,
      marker.getAttribute("data-name"),
      marker.getAttribute("data-region"),
      marker.getAttribute("data-route"),
      marker.getAttribute("data-note"),
      marker.getAttribute("data-search")
    ].join(" ");
    return (filter === "all" || type === filter) && matchesSearchTerms(haystack, query);
  };

  const applyMapFilters = () => {
    const query = normalizeText(searchInput?.value || "");
    let visibleCount = 0;
    let firstVisible = null;
    markers.forEach((marker) => {
      const isVisible = markerMatches(marker, activeFilter, query);
      marker.classList.toggle("is-hidden", !isVisible);
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = marker;
      }
    });
    if (resultNode) {
      resultNode.textContent = `${visibleCount} marker${visibleCount === 1 ? "" : "s"} shown`;
    }
    renderProgress();
    if (firstVisible && (!selectedMarker || selectedMarker.classList.contains("is-hidden"))) {
      showMarker(firstVisible);
    }
  };

  var showMarker = (marker) => {
    selectedMarker = marker;
    markers.forEach((item) => item.classList.toggle("is-selected", item === marker));
    if (!detail) return;
    const id = markerId(marker);
    const type = marker.getAttribute("data-type") || "route";
    const name = marker.getAttribute("data-name") || "Map marker";
    const region = marker.getAttribute("data-region") || "Unknown region";
    const route = marker.getAttribute("data-route") || "Route note";
    const note = marker.getAttribute("data-note") || "Use this marker as a planning stop.";
    const href = marker.getAttribute("data-href") || "";
    const actionLabel = marker.getAttribute("data-action-label") || "Open related guide";
    const isComplete = completedMarkers.has(id);
    detail.innerHTML = `
      <h2>${escapeHtml(name)}</h2>
      <p>${escapeHtml(note)}</p>
      <div class="map-meta">
        <span><strong>Type:</strong> ${escapeHtml(type)}</span>
        <span><strong>Region:</strong> ${escapeHtml(region)}</span>
        <span><strong>Route:</strong> ${escapeHtml(route)}</span>
      </div>
      <div class="map-progress-card"><strong data-map-progress>0/0 visible markers completed</strong><span>Progress is saved locally in this browser.</span></div>
      <div class="map-action-row">
        <button class="map-state-button" type="button" data-map-toggle-complete="${escapeHtml(id)}">${isComplete ? "Mark incomplete" : "Mark complete"}</button>
        ${href ? `<a class="map-state-button link" href="${escapeHtml(href)}">${escapeHtml(actionLabel)}</a>` : ""}
      </div>
      <div class="map-legend" aria-label="Map legend">
        <span><i class="legend-dot home"></i> Home systems</span>
        <span><i class="legend-dot npc"></i> NPCs and services</span>
        <span><i class="legend-dot shop"></i> Shops and stores</span>
        <span><i class="legend-dot animal"></i> Animal troughs</span>
        <span><i class="legend-dot"></i> Fishing spots</span>
        <span><i class="legend-dot resource"></i> Resources</span>
      </div>
    `;
    const toggleButton = detail.querySelector("[data-map-toggle-complete]");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        if (completedMarkers.has(id)) {
          completedMarkers.delete(id);
        } else {
          completedMarkers.add(id);
        }
        writeCompleted(completedMarkers);
        renderProgress();
        showMarker(marker);
      });
    }
    renderProgress();
  };

  markers.forEach((marker) => {
    marker.addEventListener("click", () => showMarker(marker));
    marker.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showMarker(marker);
      }
    });
  });

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-map-filter") || "all";
      filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyMapFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyMapFilters);
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", () => {
      const isFullscreen = interactiveMap.classList.toggle("is-fullscreen");
      fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
      fullscreenButton.textContent = isFullscreen ? "Exit Full Screen" : "Full Screen";
      queueMapCanvasDraw();
    });
  }

  const requestedMarker = new URLSearchParams(window.location.search).get("marker");
  const initialMarker = markers.find((marker) => markerId(marker) === requestedMarker) || markers[0];
  applyMapFilters();
  if (initialMarker) showMarker(initialMarker);
  renderProgress();
  }
}

const cropForm = document.querySelector("[data-crop-form]");
if (cropForm) {
  const crops = {
    tomato: { name: "Tomato", minutes: 15, seed: 10, sell: 30 },
    potato: { name: "Potato", minutes: 60, seed: 30, sell: 90 },
    wheat: { name: "Wheat", minutes: 240, seed: 95, sell: 250 },
    lettuce: { name: "Lettuce", minutes: 480, seed: 145, sell: 400 },
    pineapple: { name: "Pineapple", minutes: 30, seed: 15, sell: 45 },
    carrot: { name: "Carrot", minutes: 120, seed: 50, sell: 130 }
  };

  const updateCrop = () => {
    const key = cropForm.querySelector("[name='crop']").value;
    const plots = Number(cropForm.querySelector("[name='plots']").value || 0);
    const hours = Number(cropForm.querySelector("[name='hours']").value || 0);
    const crop = crops[key];
    const cycles = Math.max(1, Math.floor((hours * 60) / crop.minutes));
    const profit = (crop.sell - crop.seed) * plots * cycles;
    const result = cropForm.querySelector("[data-crop-result]");
    result.textContent = `${crop.name}: ${cycles} harvest cycle${cycles === 1 ? "" : "s"} in ${hours}h, estimated profit ${profit.toLocaleString()} Gold before star bonuses.`;
  };

  cropForm.addEventListener("input", updateCrop);
  updateCrop();
}

const safeReadJson = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

const safeWriteJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const setFormValues = (form, values) => {
  Object.entries(values || {}).forEach(([name, value]) => {
    const field = form.querySelector(`[name='${name}']`);
    if (field) field.value = value;
  });
};

const collectFormValues = (form) =>
  Array.from(form.elements).reduce((values, field) => {
    if (field.name) values[field.name] = field.value;
    return values;
  }, {});

const toolCropCatalog = {
  tomato: { name: "Tomato", minutes: 15, seed: 10, sell: 30, use: "Fast active sessions" },
  potato: { name: "Potato", minutes: 60, seed: 30, sell: 90, use: "One-hour loops and Fish and Chips" },
  wheat: { name: "Wheat", minutes: 240, seed: 95, sell: 250, use: "Offline crop and recipe input" },
  lettuce: { name: "Lettuce", minutes: 480, seed: 145, sell: 400, use: "Long route before logout" },
  pineapple: { name: "Pineapple", minutes: 30, seed: 15, sell: 45, use: "Active crop and jam route" },
  carrot: { name: "Carrot", minutes: 120, seed: 50, sell: 130, use: "Balanced session crop" }
};

const toolDirectory = document.querySelector("[data-tool-directory]");
if (toolDirectory) {
  const cards = Array.from(toolDirectory.querySelectorAll("[data-tool-card]"));
  const searchInput = toolDirectory.querySelector("[data-tool-search]");
  const filterButtons = Array.from(toolDirectory.querySelectorAll("[data-tool-filter]"));
  const countNode = toolDirectory.querySelector("[data-tool-count]");
  let activeFilter = "all";

  const applyToolFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    cards.forEach((card) => {
      const category = card.getAttribute("data-category") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || category === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (countNode) countNode.textContent = `${visibleCount} tool${visibleCount === 1 ? "" : "s"} shown`;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-tool-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyToolFilters();
    });
  });
  searchInput?.addEventListener("input", applyToolFilters);
  applyToolFilters();
}

const downloadSelector = document.querySelector("[data-download-selector]");
if (downloadSelector) {
  const cards = Array.from(downloadSelector.querySelectorAll("[data-download-card]"));
  const searchInput = downloadSelector.querySelector("[data-download-search]");
  const filterButtons = Array.from(downloadSelector.querySelectorAll("[data-download-filter]"));
  const countNode = downloadSelector.querySelector("[data-download-count]");
  const labels = {
    shownSingular: downloadSelector.getAttribute("data-download-label-shown-singular") || "route shown",
    shownPlural: downloadSelector.getAttribute("data-download-label-shown-plural") || "routes shown",
    showSteps: downloadSelector.getAttribute("data-download-label-show-steps") || "View Steps",
    hideSteps: downloadSelector.getAttribute("data-download-label-hide-steps") || "Hide Steps"
  };
  let activeFilter = "all";

  const matchesDownloadFilter = (card) => {
    const route = card.getAttribute("data-route") || "";
    const device = card.getAttribute("data-device") || "";
    const risk = card.getAttribute("data-risk") || "";
    if (activeFilter === "all") return true;
    if (activeFilter === "official") return route === "official";
    if (activeFilter === "mobile") return device.includes("mobile");
    if (activeFilter === "pc") return device.includes("pc");
    if (activeFilter === "risk") return risk === "medium" || risk === "high";
    return true;
  };

  const applyDownloadFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    cards.forEach((card) => {
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = matchesDownloadFilter(card) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (countNode) {
      countNode.textContent = `${visibleCount} ${visibleCount === 1 ? labels.shownSingular : labels.shownPlural}`;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-download-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyDownloadFilters();
    });
  });

  downloadSelector.querySelectorAll("[data-platform-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const steps = button.nextElementSibling;
      if (!steps) return;
      const isOpen = steps.hidden;
      steps.hidden = !isOpen;
      button.setAttribute("aria-expanded", String(isOpen));
      button.textContent = isOpen ? labels.hideSteps : labels.showSteps;
    });
  });

  searchInput?.addEventListener("input", applyDownloadFilters);
  applyDownloadFilters();
}

const databaseBrowser = document.querySelector("[data-database-browser]");
if (databaseBrowser) {
  const cards = Array.from(databaseBrowser.querySelectorAll("[data-db-card]"));
  const detail = databaseBrowser.querySelector("[data-database-detail]");
  const searchInput = databaseBrowser.querySelector("[data-database-search]");
  const filterButtons = Array.from(databaseBrowser.querySelectorAll("[data-database-filter]"));
  const countNode = databaseBrowser.querySelector("[data-database-count]");
  const labels = {
    openDataPage: databaseBrowser.getAttribute("data-database-label-open-data-page") || "Open Data Page",
    openTool: databaseBrowser.getAttribute("data-database-label-open-tool") || "Open Tool",
    openMap: databaseBrowser.getAttribute("data-database-label-open-map") || "Open Map/Route",
    entityShownSingular: databaseBrowser.getAttribute("data-database-label-entity-shown-singular") || "entity shown",
    entityShownPlural: databaseBrowser.getAttribute("data-database-label-entity-shown-plural") || "entities shown",
    noMatchTitle: databaseBrowser.getAttribute("data-database-label-no-match-title") || "No Entity Match",
    noMatchBody:
      databaseBrowser.getAttribute("data-database-label-no-match-body") ||
      "Try a shorter search like crop, fish, Doris, shop, or Potato."
  };
  let activeFilter = "all";

  const renderDatabaseDetail = (card) => {
    if (!detail || !card) return;
    const name = card.getAttribute("data-name") || "Database entity";
    const category = card.getAttribute("data-category") || "data";
    const summary = card.getAttribute("data-summary") || "";
    const detailText = card.getAttribute("data-detail") || summary;
    const primary = card.getAttribute("data-primary") || "/database/";
    const tool = card.getAttribute("data-tool") || "/tools/";
    const map = card.getAttribute("data-map") || "/map/";
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    detail.innerHTML = `
      <h2>${escapeHtml(name)}</h2>
      <span class="entity-type">${escapeHtml(category)}</span>
      <p>${escapeHtml(detailText)}</p>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${escapeHtml(primary)}">${escapeHtml(labels.openDataPage)}</a>
        <a class="pastel-button alt" href="${escapeHtml(tool)}">${escapeHtml(labels.openTool)}</a>
        <a class="pastel-button alt" href="${escapeHtml(map)}">${escapeHtml(labels.openMap)}</a>
      </div>
    `;
  };

  const applyDatabaseFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const category = card.getAttribute("data-category") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || category === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    if (countNode) {
      countNode.textContent = `${visibleCount} ${visibleCount === 1 ? labels.entityShownSingular : labels.entityShownPlural}`;
    }
    if (firstVisible && !cards.some((card) => card.classList.contains("is-selected") && !card.hidden)) {
      renderDatabaseDetail(firstVisible);
    }
    if (!firstVisible && detail) {
      detail.innerHTML = `<h2>${escapeHtml(labels.noMatchTitle)}</h2><p>${escapeHtml(labels.noMatchBody)}</p>`;
    }
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => renderDatabaseDetail(card));
  });
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-database-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyDatabaseFilters();
    });
  });
  searchInput?.addEventListener("input", applyDatabaseFilters);
  renderDatabaseDetail(cards.find((card) => card.classList.contains("is-selected")) || cards[0]);
  applyDatabaseFilters();
}

const houseGallery = document.querySelector("[data-house-gallery]");
if (houseGallery) {
  const storageKey = "heartopia-house-materials";
  const cards = Array.from(houseGallery.querySelectorAll("[data-house-card]"));
  const detail = houseGallery.querySelector("[data-house-detail]");
  const materialNode = houseGallery.querySelector("[data-house-materials]");
  const progressNode = houseGallery.querySelector("[data-house-progress]");
  const searchInput = houseGallery.querySelector("[data-house-search]");
  const filterButtons = Array.from(houseGallery.querySelectorAll("[data-house-filter]"));
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0];
  let checkedMaterials = new Set(safeReadJson(storageKey, []));

  const materialKey = (designId, material) => `${designId}:${normalizeText(material)}`;

  const updateHouseProgress = (designId, materials) => {
    if (!progressNode) return;
    const collected = materials.filter((material) => checkedMaterials.has(materialKey(designId, material))).length;
    progressNode.textContent = `${collected}/${materials.length} materials collected`;
  };

  const renderHouseDetail = (card) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    const designId = card.getAttribute("data-house-id") || normalizeText(card.getAttribute("data-name"));
    const name = card.getAttribute("data-name") || "House design";
    const image = card.getAttribute("data-image") || "/assets/asset-house.jpg";
    const style = card.getAttribute("data-style") || "style";
    const size = card.getAttribute("data-size") || "size";
    const stage = card.getAttribute("data-stage") || "stage";
    const materials = (card.getAttribute("data-materials") || "").split("|").filter(Boolean);
    const floorPlan = (card.getAttribute("data-plan") || "").split("|").filter(Boolean);
    const shop = card.getAttribute("data-shop") || "/shops/";
    const map = card.getAttribute("data-map") || "/map/";
    detail.querySelector("img")?.setAttribute("src", image);
    detail.querySelector("img")?.setAttribute("alt", `${name} preview`);
    detail.querySelector("h2").textContent = name;
    detail.querySelector(".design-stage").textContent = `${stage} · ${style} · ${size}`;
    const floorNode = detail.querySelector(".floor-plan-list");
    if (floorNode) {
      floorNode.innerHTML = `<strong>Floor Plan</strong>${floorPlan.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}`;
    }
    if (materialNode) {
      materialNode.innerHTML = materials
        .map((material) => {
          const key = materialKey(designId, material);
          return `<label class="material-item"><input type="checkbox" data-house-material="${escapeHtml(key)}" ${checkedMaterials.has(key) ? "checked" : ""}><span>${escapeHtml(material)}</span></label>`;
        })
        .join("");
    }
    const actionLinks = detail.querySelectorAll(".entity-action-grid a");
    if (actionLinks[0]) actionLinks[0].setAttribute("href", shop);
    if (actionLinks[1]) actionLinks[1].setAttribute("href", map);
    updateHouseProgress(designId, materials);
  };

  const applyHouseFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const style = card.getAttribute("data-style") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || style === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    const countNode = houseGallery.querySelector("[data-house-count]");
    if (countNode) countNode.textContent = `${visibleCount} design${visibleCount === 1 ? "" : "s"} shown`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderHouseDetail(firstVisible);
  };

  cards.forEach((card) => card.addEventListener("click", () => renderHouseDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-house-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyHouseFilters();
    });
  });
  searchInput?.addEventListener("input", applyHouseFilters);
  materialNode?.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-house-material]");
    if (!checkbox) return;
    const key = checkbox.getAttribute("data-house-material");
    if (checkbox.checked) checkedMaterials.add(key);
    else checkedMaterials.delete(key);
    safeWriteJson(storageKey, [...checkedMaterials]);
    renderHouseDetail(selectedCard);
  });
  renderHouseDetail(selectedCard);
  applyHouseFilters();
}

const npcHub = document.querySelector("[data-npc-hub]");
if (npcHub) {
  const storageKey = "heartopia-npc-gifted-today";
  const cards = Array.from(npcHub.querySelectorAll("[data-npc-card]"));
  const detail = npcHub.querySelector("[data-npc-detail]");
  const searchInput = npcHub.querySelector("[data-npc-search]");
  const filterButtons = Array.from(npcHub.querySelectorAll("[data-npc-filter]"));
  const countNode = npcHub.querySelector("[data-npc-count]");
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0];
  let gifted = new Set(safeReadJson(storageKey, []));

  const renderNpcDetail = (card) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    const id = card.getAttribute("data-npc-id") || normalizeText(card.getAttribute("data-name"));
    const name = card.getAttribute("data-name") || "NPC";
    const role = card.getAttribute("data-role") || "NPC route";
    const location = card.getAttribute("data-location") || "Check map";
    const schedule = card.getAttribute("data-schedule") || "Check the route before planning gifts.";
    const gifts = (card.getAttribute("data-gifts") || "").split("|").filter(Boolean);
    const shop = card.getAttribute("data-shop") || "/shops/";
    const map = card.getAttribute("data-map") || "/map/";
    const tool = card.getAttribute("data-tool") || "/tools/friendship-tracker/";
    const badgeText = card.querySelector(".npc-badge")?.textContent || name.slice(0, 2).toUpperCase();
    const badgeClass = card.querySelector(".npc-badge")?.className || "npc-badge";
    detail.innerHTML = `
      <div class="npc-detail-head"><span class="${escapeHtml(badgeClass)}">${escapeHtml(badgeText)}</span><div><h2>${escapeHtml(name)}</h2><p>${escapeHtml(role)}</p></div></div>
      <div class="map-meta">
        <span><strong>Location:</strong> ${escapeHtml(location)}</span>
        <span><strong>Schedule:</strong> ${escapeHtml(schedule)}</span>
      </div>
      <div class="gift-list">${gifts.map((gift) => `<span>${escapeHtml(gift)}</span>`).join("")}</div>
      <label class="npc-gift-toggle"><input type="checkbox" data-npc-gifted ${gifted.has(id) ? "checked" : ""}> Gift route done today</label>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${escapeHtml(shop)}">Open Shop</a>
        <a class="pastel-button alt" href="${escapeHtml(map)}">Open Map Marker</a>
        <a class="pastel-button alt" href="${escapeHtml(tool)}">Open Tracker</a>
      </div>
    `;
    detail.querySelector("[data-npc-gifted]")?.addEventListener("change", (event) => {
      if (event.target.checked) gifted.add(id);
      else gifted.delete(id);
      safeWriteJson(storageKey, [...gifted]);
    });
  };

  const applyNpcFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const group = card.getAttribute("data-group") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || group === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    if (countNode) countNode.textContent = `${visibleCount} NPC${visibleCount === 1 ? "" : "s"} shown`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderNpcDetail(firstVisible);
    if (!firstVisible && detail) {
      detail.innerHTML = `<h2>No NPC Match</h2><p>Try a shorter search like pet, Bob, weather, fishing, or shop.</p>`;
    }
  };

  cards.forEach((card) => card.addEventListener("click", () => renderNpcDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-npc-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyNpcFilters();
    });
  });
  searchInput?.addEventListener("input", applyNpcFilters);
  renderNpcDetail(selectedCard);
  applyNpcFilters();
}

const petHub = document.querySelector("[data-pet-hub]");
if (petHub) {
  const storageKey = "heartopia-pet-food-tests";
  const cards = Array.from(petHub.querySelectorAll("[data-pet-card]"));
  const detail = petHub.querySelector("[data-pet-detail]");
  const searchInput = petHub.querySelector("[data-pet-search]");
  const filterButtons = Array.from(petHub.querySelectorAll("[data-pet-filter]"));
  const countNode = petHub.querySelector("[data-pet-count]");
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0];
  let testedFood = new Set(safeReadJson(storageKey, []));

  const renderPetDetail = (card) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    const id = card.getAttribute("data-pet-id") || normalizeText(card.getAttribute("data-name"));
    const category = card.getAttribute("data-category") || "pet";
    const name = card.getAttribute("data-name") || "Animal";
    const route = card.getAttribute("data-route") || "Check the route before planning food.";
    const unlock = card.getAttribute("data-unlock") || "Route pending.";
    const source = card.getAttribute("data-source") || "Check source.";
    const foods = (card.getAttribute("data-food") || "").split("|").filter(Boolean);
    const map = card.getAttribute("data-map") || "/map/";
    const shop = card.getAttribute("data-shop") || "/shops/";
    const guide = card.getAttribute("data-guide") || "/animal-favorites/";
    const badgeText = card.querySelector(".pet-badge")?.textContent || name.slice(0, 3).toUpperCase();
    const badgeClass = card.querySelector(".pet-badge")?.className || "pet-badge";
    detail.innerHTML = `
      <div class="npc-detail-head"><span class="${escapeHtml(badgeClass)}">${escapeHtml(badgeText)}</span><div><h2>${escapeHtml(name)}</h2><p>${escapeHtml(route)}</p></div></div>
      <span class="pet-route-chip">${escapeHtml(category)} route</span>
      <div class="map-meta">
        <span><strong>Unlock:</strong> ${escapeHtml(unlock)}</span>
        <span><strong>Source:</strong> ${escapeHtml(source)}</span>
      </div>
      <div class="pet-food-list">${foods.map((food) => `<span>${escapeHtml(food)}</span>`).join("")}</div>
      <label class="pet-test-toggle"><input type="checkbox" data-pet-tested ${testedFood.has(id) ? "checked" : ""}> Food test recorded</label>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${escapeHtml(shop)}">Open Source</a>
        <a class="pastel-button alt" href="${escapeHtml(map)}">Open Map/Route</a>
        <a class="pastel-button alt" href="${escapeHtml(guide)}">Animal Favorites</a>
      </div>
    `;
    detail.querySelector("[data-pet-tested]")?.addEventListener("change", (event) => {
      if (event.target.checked) testedFood.add(id);
      else testedFood.delete(id);
      safeWriteJson(storageKey, [...testedFood]);
    });
  };

  const applyPetFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const category = card.getAttribute("data-category") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || category === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    if (countNode) countNode.textContent = `${visibleCount} animal${visibleCount === 1 ? "" : "s"} shown`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderPetDetail(firstVisible);
    if (!firstVisible && detail) {
      detail.innerHTML = `<h2>No Animal Match</h2><p>Try a shorter search like dog food, fox, corn, wheat, or Oak-Oak.</p>`;
    }
  };

  cards.forEach((card) => card.addEventListener("click", () => renderPetDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-pet-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyPetFilters();
    });
  });
  searchInput?.addEventListener("input", applyPetFilters);
  renderPetDetail(selectedCard);
  applyPetFilters();
}

const animalFavorites = document.querySelector("[data-animal-favorites]");
if (animalFavorites) {
  const storageKey = "heartopia-animal-favorite-tests";
  const cards = Array.from(animalFavorites.querySelectorAll("[data-favorite-card]"));
  const detail = animalFavorites.querySelector("[data-favorite-detail]");
  const searchInput = animalFavorites.querySelector("[data-favorite-search]");
  const filterButtons = Array.from(animalFavorites.querySelectorAll("[data-favorite-filter]"));
  const countNode = animalFavorites.querySelector("[data-favorite-count]");
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0];
  let tested = new Set(safeReadJson(storageKey, []));

  const renderFavoriteDetail = (card) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    const id = card.getAttribute("data-favorite-id") || normalizeText(card.getAttribute("data-name"));
    const group = card.getAttribute("data-group") || "wild";
    const name = card.getAttribute("data-name") || "Animal";
    const route = card.getAttribute("data-route") || "Check the route before testing food.";
    const region = card.getAttribute("data-region") || "Route pending.";
    const foods = (card.getAttribute("data-food") || "").split("|").filter(Boolean);
    const notes = card.getAttribute("data-notes") || "Use low-cost foods before spending rare materials.";
    const map = card.getAttribute("data-map") || "/map/";
    const related = card.getAttribute("data-related") || "/pets/";
    const badgeText = card.querySelector(".favorite-badge")?.textContent || name.slice(0, 3).toUpperCase();
    const badgeClass = card.querySelector(".favorite-badge")?.className || "favorite-badge";
    detail.innerHTML = `
      <div class="npc-detail-head"><span class="${escapeHtml(badgeClass)}">${escapeHtml(badgeText)}</span><div><h2>${escapeHtml(name)}</h2><p>${escapeHtml(route)}</p></div></div>
      <span class="pet-route-chip">${escapeHtml(group)} lane</span>
      <div class="map-meta">
        <span><strong>Region:</strong> ${escapeHtml(region)}</span>
        <span><strong>Route:</strong> ${escapeHtml(route)}</span>
      </div>
      <div class="favorite-food-list">${foods.map((food) => `<span>${escapeHtml(food)}</span>`).join("")}</div>
      <p>${escapeHtml(notes)}</p>
      <label class="favorite-test-toggle"><input type="checkbox" data-favorite-tested ${tested.has(id) ? "checked" : ""}> Test recorded</label>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${escapeHtml(map)}">Open Map/Route</a>
        <a class="pastel-button alt" href="${escapeHtml(related)}">Related Guide</a>
        <a class="pastel-button alt" href="/tools/checklist/">Save Checklist</a>
      </div>
    `;
    detail.querySelector("[data-favorite-tested]")?.addEventListener("change", (event) => {
      if (event.target.checked) tested.add(id);
      else tested.delete(id);
      safeWriteJson(storageKey, [...tested]);
    });
  };

  const applyFavoriteFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const group = card.getAttribute("data-group") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || group === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    if (countNode) countNode.textContent = `${visibleCount} animal${visibleCount === 1 ? "" : "s"} shown`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderFavoriteDetail(firstVisible);
    if (!firstVisible && detail) {
      detail.innerHTML = `<h2>No Food Lane Match</h2><p>Try a shorter search like dog food, bamboo, shrimp, corn, or Oak-Oak.</p>`;
    }
  };

  cards.forEach((card) => card.addEventListener("click", () => renderFavoriteDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-favorite-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyFavoriteFilters();
    });
  });
  searchInput?.addEventListener("input", applyFavoriteFilters);
  renderFavoriteDetail(selectedCard);
  applyFavoriteFilters();
}

const cropDatabase = document.querySelector("[data-crop-database]");
if (cropDatabase) {
  const storageKey = "heartopia-crop-watchlist";
  const cards = Array.from(cropDatabase.querySelectorAll("[data-crop-db-card]"));
  const detail = cropDatabase.querySelector("[data-crop-db-detail]");
  const searchInput = cropDatabase.querySelector("[data-crop-db-search]");
  const filterButtons = Array.from(cropDatabase.querySelectorAll("[data-crop-db-filter]"));
  const countNode = cropDatabase.querySelector("[data-crop-db-count]");
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0];
  let watchlist = new Set(safeReadJson(storageKey, []));

  const updateCropCards = () => {
    cards.forEach((card) => {
      const id = card.getAttribute("data-crop-id") || normalizeText(card.getAttribute("data-name"));
      card.classList.toggle("is-watched", watchlist.has(id));
    });
  };

  const renderCropDetail = (card) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    updateCropCards();
    const id = card.getAttribute("data-crop-id") || normalizeText(card.getAttribute("data-name"));
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
    const badgeText = card.querySelector(".crop-badge")?.textContent || growth;
    const badgeClass = card.querySelector(".crop-badge")?.className || "crop-badge";
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
    detail.querySelector("[data-crop-db-watch]")?.addEventListener("change", (event) => {
      if (event.target.checked) watchlist.add(id);
      else watchlist.delete(id);
      safeWriteJson(storageKey, [...watchlist]);
      updateCropCards();
    });
  };

  const applyCropDatabaseFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const group = card.getAttribute("data-group") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || group === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    const visibleWatched = cards.filter((card) => !card.hidden && watchlist.has(card.getAttribute("data-crop-id") || normalizeText(card.getAttribute("data-name")))).length;
    if (countNode) countNode.textContent = `${visibleCount} crop${visibleCount === 1 ? "" : "s"} shown · ${visibleWatched} watched`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderCropDetail(firstVisible);
    if (!firstVisible && detail) {
      detail.innerHTML = `<h2>No Crop Match</h2><p>Try a shorter search like potato, Lv 6, corn, jam, or offline.</p>`;
    }
    updateCropCards();
  };

  cards.forEach((card) => card.addEventListener("click", () => renderCropDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-crop-db-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyCropDatabaseFilters();
    });
  });
  searchInput?.addEventListener("input", applyCropDatabaseFilters);
  renderCropDetail(selectedCard);
  applyCropDatabaseFilters();
}

const recipeDatabase = document.querySelector("[data-recipe-database]");
if (recipeDatabase) {
  const storageKey = "heartopia-recipe-tested";
  const cards = Array.from(recipeDatabase.querySelectorAll("[data-recipe-db-card]"));
  const detail = recipeDatabase.querySelector("[data-recipe-db-detail]");
  const searchInput = recipeDatabase.querySelector("[data-recipe-db-search]");
  const filterButtons = Array.from(recipeDatabase.querySelectorAll("[data-recipe-db-filter]"));
  const countNode = recipeDatabase.querySelector("[data-recipe-db-count]");
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0];
  let tested = new Set(safeReadJson(storageKey, []));

  const recipeMatchesFilter = (group, risk) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "risk") return risk === "high";
    return group.split("-").includes(activeFilter);
  };

  const updateRecipeCards = () => {
    cards.forEach((card) => {
      const id = card.getAttribute("data-recipe-id") || normalizeText(card.getAttribute("data-name"));
      card.classList.toggle("is-tested", tested.has(id));
    });
  };

  const renderRecipeDetail = (card) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    updateRecipeCards();
    const id = card.getAttribute("data-recipe-id") || normalizeText(card.getAttribute("data-name"));
    const group = card.getAttribute("data-group") || "fruit";
    const risk = card.getAttribute("data-risk") || "low";
    const name = card.getAttribute("data-name") || "Recipe";
    const ingredients = (card.getAttribute("data-ingredients") || "").split("|").filter(Boolean);
    const route = card.getAttribute("data-route") || "Recipe route";
    const use = card.getAttribute("data-use") || "Cooking route candidate.";
    const source = card.getAttribute("data-source") || "Ingredient route";
    const tool = card.getAttribute("data-tool") || "/tools/recipe-finder/";
    const primary = card.getAttribute("data-primary") || "/crops/";
    const badgeText = card.querySelector(".recipe-badge")?.textContent || route.slice(0, 3).toUpperCase();
    const badgeClass = card.querySelector(".recipe-badge")?.className || "recipe-badge";
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
    detail.querySelector("[data-recipe-db-tested]")?.addEventListener("change", (event) => {
      if (event.target.checked) tested.add(id);
      else tested.delete(id);
      safeWriteJson(storageKey, [...tested]);
      updateRecipeCards();
    });
  };

  const applyRecipeDatabaseFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const group = card.getAttribute("data-group") || "";
      const risk = card.getAttribute("data-risk") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = recipeMatchesFilter(group, risk) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    const visibleTested = cards.filter((card) => !card.hidden && tested.has(card.getAttribute("data-recipe-id") || normalizeText(card.getAttribute("data-name")))).length;
    if (countNode) countNode.textContent = `${visibleCount} recipe${visibleCount === 1 ? "" : "s"} shown · ${visibleTested} tested`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderRecipeDetail(firstVisible);
    if (!firstVisible && detail) {
      detail.innerHTML = `<h2>No Recipe Match</h2><p>Try a shorter search like potato fish, jam, mushroom, QTE, or event.</p>`;
    }
    updateRecipeCards();
  };

  cards.forEach((card) => card.addEventListener("click", () => renderRecipeDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-recipe-db-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyRecipeDatabaseFilters();
    });
  });
  searchInput?.addEventListener("input", applyRecipeDatabaseFilters);
  renderRecipeDetail(selectedCard);
  applyRecipeDatabaseFilters();
}

const guidePlanner = document.querySelector("[data-guide-planner]");
if (guidePlanner) {
  const storageKey = "heartopia-guide-route-progress";
  const cards = Array.from(guidePlanner.querySelectorAll("[data-guide-card]"));
  const detail = guidePlanner.querySelector("[data-guide-detail]");
  const searchInput = guidePlanner.querySelector("[data-guide-search]");
  const filterButtons = Array.from(guidePlanner.querySelectorAll("[data-guide-filter]"));
  const countNode = guidePlanner.querySelector("[data-guide-count]");
  const labels = {
    route: guidePlanner.getAttribute("data-guide-label-route") || "route",
    tasksDone: guidePlanner.getAttribute("data-guide-label-tasks-done") || "route tasks done",
    saved: guidePlanner.getAttribute("data-guide-label-saved") || "Saved locally in this browser.",
    primary: guidePlanner.getAttribute("data-guide-label-primary") || "Open Primary Page",
    tool: guidePlanner.getAttribute("data-guide-label-tool") || "Open Tool",
    secondary: guidePlanner.getAttribute("data-guide-label-secondary") || "Related Route",
    shownSingular: guidePlanner.getAttribute("data-guide-label-shown-singular") || "route shown",
    shownPlural: guidePlanner.getAttribute("data-guide-label-shown-plural") || "routes shown",
    noMatchTitle: guidePlanner.getAttribute("data-guide-label-no-match-title") || "No Guide Match",
    noMatchBody:
      guidePlanner.getAttribute("data-guide-label-no-match-body") ||
      "Try a shorter search like cooking, pet, event, gold, or fishing."
  };
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0];
  let checkedSteps = new Set(safeReadJson(storageKey, []));

  const guideStepKey = (guideId, step) => `${guideId}:${normalizeText(step)}`;

  const updateGuideProgress = (guideId, steps) => {
    const progressNode = detail?.querySelector("[data-guide-progress]");
    if (!progressNode) return;
    const done = steps.filter((step) => checkedSteps.has(guideStepKey(guideId, step))).length;
    progressNode.textContent = `${done}/${steps.length} ${labels.tasksDone}`;
  };

  const renderGuideDetail = (card) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    const id = card.getAttribute("data-guide-id") || normalizeText(card.getAttribute("data-name"));
    const group = card.getAttribute("data-group") || "beginner";
    const name = card.getAttribute("data-name") || "Guide route";
    const priority = card.getAttribute("data-priority") || "Route";
    const summary = card.getAttribute("data-summary") || "Pick a route and complete the checklist.";
    const steps = (card.getAttribute("data-steps") || "").split("|").filter(Boolean);
    const tool = card.getAttribute("data-tool") || "/tools/checklist/";
    const primary = card.getAttribute("data-primary") || "/guides/";
    const secondary = card.getAttribute("data-secondary") || "/map/";
    const badgeText = card.querySelector(".guide-badge")?.textContent || name.slice(0, 4).toUpperCase();
    const badgeClass = card.querySelector(".guide-badge")?.className || "guide-badge";
    detail.innerHTML = `
      <div class="npc-detail-head"><span class="${escapeHtml(badgeClass)}">${escapeHtml(badgeText)}</span><div><h2>${escapeHtml(name)}</h2><p>${escapeHtml(priority)}</p></div></div>
      <span class="guide-route-chip">${escapeHtml(group)} ${escapeHtml(labels.route)}</span>
      <p>${escapeHtml(summary)}</p>
      <div class="guide-step-list">${steps.map((step) => {
        const key = guideStepKey(id, step);
        return `<label class="material-item"><input type="checkbox" data-guide-step="${escapeHtml(key)}" ${checkedSteps.has(key) ? "checked" : ""}><span>${escapeHtml(step)}</span></label>`;
      }).join("")}</div>
      <div class="tracker-progress"><strong data-guide-progress>0/${steps.length} ${escapeHtml(labels.tasksDone)}</strong><span>${escapeHtml(labels.saved)}</span></div>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${escapeHtml(primary)}">${escapeHtml(labels.primary)}</a>
        <a class="pastel-button alt" href="${escapeHtml(tool)}">${escapeHtml(labels.tool)}</a>
        <a class="pastel-button alt" href="${escapeHtml(secondary)}">${escapeHtml(labels.secondary)}</a>
      </div>
    `;
    updateGuideProgress(id, steps);
  };

  const applyGuideFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const group = card.getAttribute("data-group") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || group === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    if (countNode) {
      countNode.textContent = `${visibleCount} ${visibleCount === 1 ? labels.shownSingular : labels.shownPlural}`;
    }
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderGuideDetail(firstVisible);
    if (!firstVisible && detail) {
      detail.innerHTML = `<h2>${escapeHtml(labels.noMatchTitle)}</h2><p>${escapeHtml(labels.noMatchBody)}</p>`;
    }
  };

  cards.forEach((card) => card.addEventListener("click", () => renderGuideDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-guide-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyGuideFilters();
    });
  });
  searchInput?.addEventListener("input", applyGuideFilters);
  detail?.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-guide-step]");
    if (!checkbox) return;
    const key = checkbox.getAttribute("data-guide-step");
    if (checkbox.checked) checkedSteps.add(key);
    else checkedSteps.delete(key);
    safeWriteJson(storageKey, [...checkedSteps]);
    renderGuideDetail(selectedCard);
  });
  renderGuideDetail(selectedCard);
  applyGuideFilters();
}

const fishDatabase = document.querySelector("[data-fish-database]");
if (fishDatabase) {
  const storageKey = "heartopia-fish-tracker";
  const cards = Array.from(fishDatabase.querySelectorAll("[data-fish-db-card]"));
  const detail = fishDatabase.querySelector("[data-fish-db-detail]");
  const searchInput = fishDatabase.querySelector("[data-fish-db-search]");
  const filterButtons = Array.from(fishDatabase.querySelectorAll("[data-fish-db-filter]"));
  const countNode = fishDatabase.querySelector("[data-fish-db-count]");
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0];
  let caught = new Set(safeReadJson(storageKey, []));

  const updateFishCards = () => {
    cards.forEach((card) => {
      const id = card.getAttribute("data-fish-id") || normalizeText(card.getAttribute("data-name"));
      card.classList.toggle("is-caught", caught.has(id));
    });
  };

  const renderFishDetail = (card) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    updateFishCards();
    const id = card.getAttribute("data-fish-id") || normalizeText(card.getAttribute("data-name"));
    const type = card.getAttribute("data-type") || "lake";
    const rarity = card.getAttribute("data-rarity") || "common";
    const name = card.getAttribute("data-name") || "Fish";
    const spot = card.getAttribute("data-spot") || "Check route";
    const condition = card.getAttribute("data-condition") || "Confirm in-game.";
    const windowText = card.getAttribute("data-window") || "Any time";
    const level = card.getAttribute("data-level") || "Lv ?";
    const use = card.getAttribute("data-use") || "Collection route";
    const map = card.getAttribute("data-map") || "/map/";
    const badgeText = card.querySelector(".fish-badge")?.textContent || type.slice(0, 3).toUpperCase();
    const badgeClass = card.querySelector(".fish-badge")?.className || "fish-badge";
    detail.innerHTML = `
      <div class="npc-detail-head"><span class="${escapeHtml(badgeClass)}">${escapeHtml(badgeText)}</span><div><h2>${escapeHtml(name)}</h2><p>${escapeHtml(spot)}</p></div></div>
      <span class="fish-route-chip">${escapeHtml(type)} route · ${escapeHtml(rarity)}</span>
      <div class="map-meta">
        <span><strong>Condition:</strong> ${escapeHtml(condition)}</span>
        <span><strong>Window:</strong> ${escapeHtml(windowText)}</span>
        <span><strong>Level:</strong> ${escapeHtml(level)}</span>
        <span><strong>Use:</strong> ${escapeHtml(use)}</span>
      </div>
      <label class="fish-catch-toggle"><input type="checkbox" data-fish-db-caught ${caught.has(id) ? "checked" : ""}> Caught in my save</label>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${escapeHtml(map)}">Open Map Route</a>
        <a class="pastel-button alt" href="/tools/fish-tracker/">Open Tracker</a>
        <a class="pastel-button alt" href="/recipes/">Cooking Uses</a>
      </div>
    `;
    detail.querySelector("[data-fish-db-caught]")?.addEventListener("change", (event) => {
      if (event.target.checked) caught.add(id);
      else caught.delete(id);
      safeWriteJson(storageKey, [...caught]);
      updateFishCards();
    });
  };

  const applyFishDatabaseFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const type = card.getAttribute("data-type") || "";
      const rarity = card.getAttribute("data-rarity") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const matchesFilter = activeFilter === "all" || type === activeFilter || (activeFilter === "rare" && rarity === "rare");
      const isVisible = matchesFilter && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    const visibleCaught = cards.filter((card) => !card.hidden && caught.has(card.getAttribute("data-fish-id") || normalizeText(card.getAttribute("data-name")))).length;
    if (countNode) countNode.textContent = `${visibleCount} fish shown · ${visibleCaught} caught`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderFishDetail(firstVisible);
    if (!firstVisible && detail) {
      detail.innerHTML = `<h2>No Fish Match</h2><p>Try a shorter search like tuna, lake, level 10, rainbow, or river.</p>`;
    }
    updateFishCards();
  };

  cards.forEach((card) => card.addEventListener("click", () => renderFishDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-fish-db-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyFishDatabaseFilters();
    });
  });
  searchInput?.addEventListener("input", applyFishDatabaseFilters);
  renderFishDetail(selectedCard);
  applyFishDatabaseFilters();
}

const eventHub = document.querySelector("[data-event-hub]");
if (eventHub) {
  const storageKey = "heartopia-event-prep";
  const cards = Array.from(eventHub.querySelectorAll("[data-event-card]"));
  const detail = eventHub.querySelector("[data-event-detail]");
  const searchInput = eventHub.querySelector("[data-event-search]");
  const filterButtons = Array.from(eventHub.querySelectorAll("[data-event-filter]"));
  const countNode = eventHub.querySelector("[data-event-count]");
  let activeFilter = "all";
  let selectedCard = cards.find((card) => card.classList.contains("is-selected")) || cards[0];
  let checkedPrep = new Set(safeReadJson(storageKey, []));
  let countdownTimer = null;

  const prepKey = (eventId, task) => `${eventId}:${normalizeText(task)}`;

  const formatEventCountdown = (endAt) => {
    if (!endAt) return "No fixed countdown. Check the route or announcement before planning.";
    const endTime = new Date(endAt).getTime();
    const remaining = endTime - Date.now();
    if (!Number.isFinite(endTime)) return "Date pending. Confirm the current event source before planning.";
    if (remaining <= 0) return "Window likely ended. Move this event to archive after source review.";
    const totalMinutes = Math.ceil(remaining / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    return days ? `${days}d ${hours}h ${minutes}m left in the reported window` : `${hours}h ${minutes}m left in the reported window`;
  };

  const updateEventProgress = (eventId, prepItems) => {
    const progressNode = detail?.querySelector("[data-event-progress]");
    if (!progressNode) return;
    const done = prepItems.filter((item) => checkedPrep.has(prepKey(eventId, item))).length;
    progressNode.textContent = `${done}/${prepItems.length} prep tasks done`;
  };

  const renderEventDetail = (card) => {
    if (!detail || !card) return;
    selectedCard = card;
    cards.forEach((item) => item.classList.toggle("is-selected", item === card));
    const eventId = card.getAttribute("data-event-id") || normalizeText(card.getAttribute("data-name"));
    const status = card.getAttribute("data-status") || "current";
    const name = card.getAttribute("data-name") || "Event";
    const windowText = card.getAttribute("data-window") || "TBA";
    const endAt = card.getAttribute("data-end-at") || "";
    const route = card.getAttribute("data-route") || "Check the event route before planning.";
    const rewards = (card.getAttribute("data-rewards") || "").split("|").filter(Boolean);
    const prepItems = (card.getAttribute("data-prep") || "").split("|").filter(Boolean);
    const map = card.getAttribute("data-map") || "/map/";
    const tool = card.getAttribute("data-tool") || "/tools/checklist/";
    const guide = card.getAttribute("data-guide") || "/events/";
    detail.innerHTML = `
      <span class="event-status ${escapeHtml(status)}">${escapeHtml(status)}</span>
      <h2>${escapeHtml(name)}</h2>
      <p class="event-window">${escapeHtml(windowText)}</p>
      <div class="event-countdown" data-event-countdown>${escapeHtml(formatEventCountdown(endAt))}</div>
      <p>${escapeHtml(route)}</p>
      <div class="event-reward-grid">${rewards.map((reward) => `<span>${escapeHtml(reward)}</span>`).join("")}</div>
      <div class="material-checklist">${prepItems.map((item) => {
        const key = prepKey(eventId, item);
        return `<label class="material-item"><input type="checkbox" data-event-prep-item="${escapeHtml(key)}" ${checkedPrep.has(key) ? "checked" : ""}><span>${escapeHtml(item)}</span></label>`;
      }).join("")}</div>
      <div class="tracker-progress"><strong data-event-progress>0/${prepItems.length} prep tasks done</strong><span>Saved locally in this browser.</span></div>
      <div class="entity-action-grid">
        <a class="pastel-button" href="${escapeHtml(map)}">Open Route</a>
        <a class="pastel-button alt" href="${escapeHtml(tool)}">Open Checklist</a>
        <a class="pastel-button alt" href="${escapeHtml(guide)}">Related Guide</a>
      </div>
    `;
    updateEventProgress(eventId, prepItems);
    if (countdownTimer) window.clearInterval(countdownTimer);
    if (endAt) {
      countdownTimer = window.setInterval(() => {
        const countdownNode = detail.querySelector("[data-event-countdown]");
        if (countdownNode) countdownNode.textContent = formatEventCountdown(endAt);
      }, 60000);
    }
  };

  const applyEventFilters = () => {
    const query = searchInput?.value || "";
    let visibleCount = 0;
    let firstVisible = null;
    cards.forEach((card) => {
      const status = card.getAttribute("data-status") || "";
      const haystack = card.getAttribute("data-search") || card.textContent;
      const isVisible = (activeFilter === "all" || status === activeFilter) && matchesSearchTerms(haystack, query);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
        if (!firstVisible) firstVisible = card;
      }
    });
    if (countNode) countNode.textContent = `${visibleCount} event${visibleCount === 1 ? "" : "s"} shown`;
    if (firstVisible && (!selectedCard || selectedCard.hidden)) renderEventDetail(firstVisible);
    if (!firstVisible && detail) {
      detail.innerHTML = `<h2>No Event Match</h2><p>Try a shorter search like modular, fishing, current, or archive.</p>`;
    }
  };

  cards.forEach((card) => card.addEventListener("click", () => renderEventDetail(card)));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-event-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyEventFilters();
    });
  });
  searchInput?.addEventListener("input", applyEventFilters);
  detail?.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-event-prep-item]");
    if (!checkbox) return;
    const key = checkbox.getAttribute("data-event-prep-item");
    if (checkbox.checked) checkedPrep.add(key);
    else checkedPrep.delete(key);
    safeWriteJson(storageKey, [...checkedPrep]);
    renderEventDetail(selectedCard);
  });
  renderEventDetail(selectedCard);
  applyEventFilters();
}

const profitForm = document.querySelector("[data-profit-tool]");
if (profitForm) {
  const storageKey = "heartopia-profit-tool";
  const resultNode = profitForm.querySelector("[data-profit-result]");
  const rankingBody = document.querySelector("[data-profit-ranking]");
  const statusNode = document.querySelector("[data-tool-save-status]");
  setFormValues(profitForm, safeReadJson(storageKey, {}));

  const calculateProfit = (crop, plots, hours, bonus) => {
    const cycles = Math.max(0, Math.floor((hours * 60) / crop.minutes));
    const sellWithBonus = crop.sell * (1 + bonus / 100);
    const profit = Math.round((sellWithBonus - crop.seed) * plots * cycles);
    return { cycles, profit };
  };

  const updateProfitTool = (shouldSave = false) => {
    const values = collectFormValues(profitForm);
    const crop = toolCropCatalog[values.crop] || toolCropCatalog.potato;
    const plots = Math.max(1, Number(values.plots || 1));
    const hours = Math.max(0, Number(values.hours || 0));
    const bonus = Math.max(0, Number(values.bonus || 0));
    const selected = calculateProfit(crop, plots, hours, bonus);
    if (resultNode) {
      resultNode.textContent = `${crop.name}: ${selected.cycles} full harvest cycle${selected.cycles === 1 ? "" : "s"} in ${hours}h, estimated profit ${selected.profit.toLocaleString()} Gold.`;
    }
    if (rankingBody) {
      const rows = Object.values(toolCropCatalog)
        .map((item) => ({ ...item, ...calculateProfit(item, plots, hours, bonus) }))
        .sort((a, b) => b.profit - a.profit)
        .map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${item.cycles}</td><td>${item.profit.toLocaleString()} Gold</td><td>${escapeHtml(item.use)}</td></tr>`)
        .join("");
      rankingBody.innerHTML = rows;
    }
    if (shouldSave) {
      safeWriteJson(storageKey, values);
      if (statusNode) statusNode.textContent = "Saved locally for this browser.";
    }
  };

  profitForm.addEventListener("input", () => updateProfitTool(true));
  updateProfitTool(false);
}

const cropPlanner = document.querySelector("[data-crop-planner]");
if (cropPlanner) {
  const storageKey = "heartopia-crop-planner";
  const resultNode = cropPlanner.querySelector("[data-crop-plan-result]");
  const stepsNode = document.querySelector("[data-crop-plan-steps]");
  const statusNode = document.querySelector("[data-tool-save-status]");
  setFormValues(cropPlanner, safeReadJson(storageKey, {}));

  const updateCropPlanner = (shouldSave = false) => {
    const values = collectFormValues(cropPlanner);
    const boxes = Math.max(1, Number(values.boxes || 1));
    const hours = Math.max(0.25, Number(values.hours || 0.25));
    const mode = values.mode || "active";
    const plans = {
      active: {
        title: "Active money loop",
        crops: ["Pineapple", "Tomato", "Potato"],
        steps: [`Plant ${Math.ceil(boxes * 0.55)} boxes of Pineapple for 30-minute turns.`, `Use ${Math.floor(boxes * 0.3)} boxes of Tomato while actively checking the garden.`, "End the session with Potato if you will be away for about an hour."]
      },
      balanced: {
        title: "Balanced route",
        crops: ["Potato", "Carrot", "Pineapple"],
        steps: [`Put ${Math.ceil(boxes * 0.5)} boxes into Potato for stable value.`, `Use ${Math.floor(boxes * 0.3)} boxes for Carrot if your session reaches two hours.`, "Keep a few fast boxes open for Pineapple or Tomato resets."]
      },
      offline: {
        title: "Before logout",
        crops: ["Wheat", "Lettuce", "Carrot"],
        steps: [`Fill ${boxes} boxes with the longest crop unlocked before logging off.`, "Use Wheat as the safe baseline if Lettuce or Corn-style long crops are not unlocked.", "Set a route timer so the next login starts with harvest."]
      }
    };
    const plan = plans[mode] || plans.active;
    if (resultNode) {
      resultNode.textContent = `${plan.title}: for ${boxes} boxes and a ${hours}h window, prioritize ${plan.crops.join(", ")}.`;
    }
    if (stepsNode) {
      stepsNode.innerHTML = plan.steps.map((step, index) => `<article class="plan-step"><strong>Step ${index + 1}</strong><span>${escapeHtml(step)}</span></article>`).join("");
    }
    if (shouldSave) {
      safeWriteJson(storageKey, values);
      if (statusNode) statusNode.textContent = "Saved locally for this browser.";
    }
  };

  cropPlanner.addEventListener("input", () => updateCropPlanner(true));
  updateCropPlanner(false);
}

const fishTracker = document.querySelector("[data-fish-tracker]");
if (fishTracker) {
  const storageKey = "heartopia-fish-tracker";
  const rows = Array.from(fishTracker.querySelectorAll("[data-fish-row]"));
  const searchInput = fishTracker.querySelector("[data-fish-search]");
  const filterButtons = Array.from(fishTracker.querySelectorAll("[data-fish-filter]"));
  const progressNode = fishTracker.querySelector("[data-fish-progress]");
  let activeFilter = "all";
  let caught = new Set(safeReadJson(storageKey, []));

  const fishId = (row) => row.getAttribute("data-fish-id") || normalizeText(row.textContent);
  const updateFishProgress = () => {
    rows.forEach((row) => {
      const checkbox = row.querySelector("[data-fish-catch]");
      const isCaught = caught.has(fishId(row));
      row.classList.toggle("is-complete", isCaught);
      if (checkbox) checkbox.checked = isCaught;
    });
    const visibleRows = rows.filter((row) => !row.hidden);
    const visibleCaught = visibleRows.filter((row) => caught.has(fishId(row))).length;
    if (progressNode) progressNode.textContent = `${visibleCaught}/${visibleRows.length} visible caught`;
  };

  const applyFishFilters = () => {
    const query = searchInput?.value || "";
    rows.forEach((row) => {
      const route = row.getAttribute("data-route") || "";
      const haystack = row.getAttribute("data-search") || row.textContent;
      row.hidden = (activeFilter !== "all" && route !== activeFilter) || !matchesSearchTerms(haystack, query);
    });
    updateFishProgress();
  };

  rows.forEach((row) => {
    row.querySelectorAll("a").forEach((link) => link.addEventListener("click", (event) => event.stopPropagation()));
    row.querySelector("[data-fish-catch]")?.addEventListener("change", (event) => {
      const id = fishId(row);
      if (event.target.checked) caught.add(id);
      else caught.delete(id);
      safeWriteJson(storageKey, [...caught]);
      updateFishProgress();
    });
  });
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-fish-filter") || "all";
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      applyFishFilters();
    });
  });
  searchInput?.addEventListener("input", applyFishFilters);
  applyFishFilters();
}

const friendshipTool = document.querySelector("[data-friendship-tool]");
if (friendshipTool) {
  const storageKey = "heartopia-friendship-tool";
  const resultNode = friendshipTool.querySelector("[data-friendship-result]");
  const statusNode = document.querySelector("[data-tool-save-status]");
  setFormValues(friendshipTool, safeReadJson(storageKey, {}));

  const updateFriendship = (shouldSave = false) => {
    const values = collectFormValues(friendshipTool);
    const points =
      Number(values.favorite || 0) * 28 +
      Number(values.liked || 0) * 14 +
      Number(values.talks || 0) * 6 +
      Number(values.hangouts || 0) * 22;
    const days = Math.max(1, Number(values.days || 1));
    const pace = Math.round(points / days);
    if (resultNode) {
      resultNode.textContent = `${values.npc}: ${points} estimated affinity points over ${days} days, about ${pace} points per day. Keep favorite gifts for the target NPC and use liked gifts as filler.`;
    }
    if (shouldSave) {
      safeWriteJson(storageKey, values);
      if (statusNode) statusNode.textContent = "Saved locally for this browser.";
    }
  };

  friendshipTool.addEventListener("input", () => updateFriendship(true));
  updateFriendship(false);
}

const recipeFinder = document.querySelector("[data-recipe-finder]");
if (recipeFinder) {
  const storageKey = "heartopia-recipe-finder";
  const ingredientInputs = Array.from(recipeFinder.querySelectorAll("[data-recipe-ingredient]"));
  const cards = Array.from(recipeFinder.querySelectorAll("[data-recipe-card]"));
  const countNode = recipeFinder.querySelector("[data-recipe-count]");
  const savedIngredients = new Set(safeReadJson(storageKey, []));
  if (savedIngredients.size) {
    ingredientInputs.forEach((input) => {
      input.checked = savedIngredients.has(input.value);
    });
  }

  const updateRecipeFinder = () => {
    const selected = new Set(ingredientInputs.filter((input) => input.checked).map((input) => input.value));
    let visibleCount = 0;
    cards.forEach((card) => {
      const required = (card.getAttribute("data-ingredients") || "").split(" ").filter(Boolean);
      const isVisible = required.every((item) => selected.has(item));
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (countNode) countNode.textContent = `${visibleCount} recipe${visibleCount === 1 ? "" : "s"} available`;
    safeWriteJson(storageKey, [...selected]);
  };

  ingredientInputs.forEach((input) => input.addEventListener("change", updateRecipeFinder));
  updateRecipeFinder();
}

const checklistTool = document.querySelector("[data-checklist-tool]");
if (checklistTool) {
  const storageKey = "heartopia-daily-checklist";
  const textarea = checklistTool.querySelector("[name='tasks']");
  const resultNode = checklistTool.querySelector("[data-checklist-result]");
  const progressNode = checklistTool.querySelector("[data-checklist-progress]");
  const saved = safeReadJson(storageKey, null);
  let completed = new Set(saved?.completed || []);
  if (saved?.tasks?.length && textarea) textarea.value = saved.tasks.join("\n");

  const getTasks = () => (textarea?.value || "").split("\n").map((task) => task.trim()).filter(Boolean);
  const taskKey = (task) => normalizeText(task);

  const writeChecklist = () => {
    const tasks = getTasks();
    completed = new Set([...completed].filter((key) => tasks.some((task) => taskKey(task) === key)));
    safeWriteJson(storageKey, { tasks, completed: [...completed] });
  };

  const renderChecklist = () => {
    const tasks = getTasks();
    writeChecklist();
    if (progressNode) {
      const done = tasks.filter((task) => completed.has(taskKey(task))).length;
      progressNode.textContent = `${done}/${tasks.length} completed`;
    }
    if (resultNode) {
      resultNode.innerHTML = tasks.length
        ? tasks.map((task) => `<label class="checklist-item"><input type="checkbox" data-checklist-item="${escapeHtml(taskKey(task))}" ${completed.has(taskKey(task)) ? "checked" : ""}><span>${escapeHtml(task)}</span></label>`).join("")
        : "<p>Add one task per line to build a compact route.</p>";
    }
  };

  checklistTool.querySelectorAll("[data-checklist-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      if (textarea) textarea.value = (button.getAttribute("data-checklist-preset") || "").split("|").join("\n");
      completed = new Set();
      renderChecklist();
    });
  });
  textarea?.addEventListener("input", renderChecklist);
  resultNode?.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-checklist-item]");
    if (!checkbox) return;
    const key = checkbox.getAttribute("data-checklist-item");
    if (checkbox.checked) completed.add(key);
    else completed.delete(key);
    renderChecklist();
  });
  renderChecklist();
}

const timerTool = document.querySelector("[data-timer-tool]");
if (timerTool) {
  const storageKey = "heartopia-route-timers";
  const listNode = timerTool.querySelector("[data-timer-list]");
  const countNode = timerTool.querySelector("[data-timer-count]");
  let timers = safeReadJson(storageKey, []);

  const formatRemaining = (ms) => {
    if (ms <= 0) return "Ready now";
    const totalSeconds = Math.ceil(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
  };

  const saveTimers = () => safeWriteJson(storageKey, timers);
  const renderTimers = () => {
    const now = Date.now();
    const activeCount = timers.filter((timer) => timer.endAt > now).length;
    if (countNode) countNode.textContent = `${activeCount} active timer${activeCount === 1 ? "" : "s"}`;
    if (!listNode) return;
    listNode.innerHTML = timers.length
      ? timers
          .map((timer) => `<article class="timer-card ${timer.endAt <= now ? "is-ready" : ""}"><span><strong>${escapeHtml(timer.label)}</strong><small>${formatRemaining(timer.endAt - now)}</small></span><button class="map-state-button" type="button" data-timer-remove="${escapeHtml(timer.id)}">Clear</button></article>`)
          .join("")
      : "<p>No timers yet. Start one from the form above.</p>";
  };

  timerTool.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = collectFormValues(timerTool);
    const minutes = Math.max(1, Number(values.minutes || 1));
    timers.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label: values.label || "Route timer",
      endAt: Date.now() + minutes * 60 * 1000
    });
    saveTimers();
    renderTimers();
  });
  listNode?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-timer-remove]");
    if (!button) return;
    const id = button.getAttribute("data-timer-remove");
    timers = timers.filter((timer) => timer.id !== id);
    saveTimers();
    renderTimers();
  });
  renderTimers();
  window.setInterval(renderTimers, 1000);
}
}
