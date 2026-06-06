export const normalizeText = (value: unknown) =>
  String(value || "").toLowerCase().replace(/\s+/g, " ").trim();

export const matchesSearchTerms = (haystack: unknown, query: unknown) => {
  const normalizedHaystack = normalizeText(haystack);
  const terms = normalizeText(query).split(" ").filter(Boolean);
  return terms.length === 0 || terms.every((term) => normalizedHaystack.includes(term));
};

export const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const safeReadJson = <T>(key: string, fallback: T): T => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

export const safeWriteJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage can be unavailable in private browsing or locked previews.
  }
};

export const collectFormValues = (form: HTMLFormElement) =>
  Object.fromEntries(new FormData(form).entries()) as Record<string, FormDataEntryValue>;

export const setFormValues = (form: HTMLFormElement, values: Record<string, unknown>) => {
  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
      field.value = String(value ?? "");
    }
  });
};
