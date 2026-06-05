const menuButton = document.querySelector("[data-menu-button]");
const navLinks = document.querySelector("[data-nav-links]");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const yearNode = document.querySelector("[data-year]");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

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
  codeFilter.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-filter]");
    if (!target) return;
    const filter = target.getAttribute("data-filter");
    document.querySelectorAll("[data-code-row]").forEach((row) => {
      const status = row.getAttribute("data-status");
      row.hidden = filter !== "all" && status !== filter;
    });
    codeFilter.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button === target));
    });
  });
}

const interactiveMap = document.querySelector("[data-interactive-map]");
if (interactiveMap) {
  const detail = interactiveMap.querySelector("[data-map-detail]");
  const markers = Array.from(interactiveMap.querySelectorAll("[data-map-point]"));
  const filters = Array.from(interactiveMap.querySelectorAll("[data-map-filter]"));

  const showMarker = (marker) => {
    markers.forEach((item) => item.classList.toggle("is-selected", item === marker));
    if (!detail) return;
    const type = marker.getAttribute("data-type") || "route";
    const name = marker.getAttribute("data-name") || "Map marker";
    const region = marker.getAttribute("data-region") || "Unknown region";
    const route = marker.getAttribute("data-route") || "Route note";
    const note = marker.getAttribute("data-note") || "Use this marker as a planning stop.";
    detail.innerHTML = `
      <h2>${name}</h2>
      <p>${note}</p>
      <div class="map-meta">
        <span><strong>Type:</strong> ${type}</span>
        <span><strong>Region:</strong> ${region}</span>
        <span><strong>Route:</strong> ${route}</span>
      </div>
      <div class="map-legend" aria-label="Map legend">
        <span><i class="legend-dot home"></i> Home systems</span>
        <span><i class="legend-dot npc"></i> NPCs and services</span>
        <span><i class="legend-dot animal"></i> Animal troughs</span>
        <span><i class="legend-dot"></i> Fishing spots</span>
        <span><i class="legend-dot resource"></i> Resources</span>
      </div>
    `;
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
      const filter = button.getAttribute("data-map-filter") || "all";
      filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      markers.forEach((marker) => {
        const matches = filter === "all" || marker.getAttribute("data-type") === filter;
        marker.classList.toggle("is-hidden", !matches);
      });
      const firstVisible = markers.find((marker) => !marker.classList.contains("is-hidden"));
      if (firstVisible) showMarker(firstVisible);
    });
  });
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
