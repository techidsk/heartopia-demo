import { collectFormValues, safeReadJson, safeWriteJson, setFormValues } from "./dom";

type ProfitCrop = {
  id: string;
  name: string;
  minutes: number;
  seed: number;
  sell: number;
  use: string;
};

const readCropData = () => {
  const node = document.querySelector<HTMLScriptElement>("#crop-profit-data");
  if (!node?.textContent) return [] as ProfitCrop[];
  try {
    return JSON.parse(node.textContent) as ProfitCrop[];
  } catch {
    return [] as ProfitCrop[];
  }
};

export function initProfitCalculator() {
  const form = document.querySelector<HTMLFormElement>("[data-profit-tool]");
  if (!form) return;

  const crops = readCropData();
  const cropCatalog = Object.fromEntries(crops.map((crop) => [crop.id, crop]));
  const storageKey = "heartopia-profit-tool";
  const resultNode = form.querySelector<HTMLElement>("[data-profit-result]");
  const rankingBody = document.querySelector<HTMLElement>("[data-profit-ranking]");
  const statusNode = document.querySelector<HTMLElement>("[data-tool-save-status]");
  setFormValues(form, safeReadJson<Record<string, unknown>>(storageKey, {}));

  const calculateProfit = (crop: ProfitCrop, plots: number, hours: number, bonus: number) => {
    const cycles = Math.max(0, Math.floor((hours * 60) / crop.minutes));
    const sellWithBonus = crop.sell * (1 + bonus / 100);
    const profit = Math.round((sellWithBonus - crop.seed) * plots * cycles);
    return { cycles, profit };
  };

  const update = (shouldSave = false) => {
    const values = collectFormValues(form);
    const crop = cropCatalog[String(values.crop)] || crops[0];
    if (!crop) return;
    const plots = Math.max(1, Number(values.plots || 1));
    const hours = Math.max(0, Number(values.hours || 0));
    const bonus = Math.max(0, Number(values.bonus || 0));
    const selected = calculateProfit(crop, plots, hours, bonus);

    if (resultNode) {
      resultNode.textContent = `${crop.name}: ${selected.cycles} full harvest cycle${selected.cycles === 1 ? "" : "s"} in ${hours}h, estimated profit ${selected.profit.toLocaleString()} Gold.`;
    }

    if (rankingBody) {
      rankingBody.replaceChildren(
        ...crops
          .map((item) => ({ ...item, ...calculateProfit(item, plots, hours, bonus) }))
          .sort((a, b) => b.profit - a.profit)
          .map((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${item.name}</td><td>${item.cycles}</td><td>${item.profit.toLocaleString()} Gold</td><td>${item.use}</td>`;
            return row;
          })
      );
    }

    if (shouldSave) {
      safeWriteJson(storageKey, values);
      if (statusNode) statusNode.textContent = "Saved locally for this browser.";
    }
  };

  form.addEventListener("input", () => update(true));
  update(false);
}
