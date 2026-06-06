type ClientI18nPayload = {
  locale?: string;
  messages?: Record<string, unknown>;
};

const readPayload = (): ClientI18nPayload => {
  const node = document.querySelector<HTMLScriptElement>("#site-i18n-messages");
  if (!node?.textContent) return {};
  try {
    return JSON.parse(node.textContent) as ClientI18nPayload;
  } catch {
    return {};
  }
};

export const getClientLocale = () => readPayload().locale || "en";

export const getClientMessage = (path: string, fallback: string) => {
  const segments = path.split(".");
  let value: unknown = readPayload().messages;
  for (const segment of segments) {
    if (!value || typeof value !== "object" || !(segment in value)) return fallback;
    value = (value as Record<string, unknown>)[segment];
  }
  return typeof value === "string" ? value : fallback;
};
