import { defaultLocale, type Locale } from "./config";

export type UiMessages = {
  common: {
    skipToContent: string;
    search: string;
  };
  navigation: {
    primaryLabel: string;
    menu: string;
    close: string;
  };
  footer: {
    updated: string;
  };
};

const uiMessages = {
  en: {
    common: {
      skipToContent: "Skip to content",
      search: "Search"
    },
    navigation: {
      primaryLabel: "Primary navigation",
      menu: "Menu",
      close: "Close"
    },
    footer: {
      updated: "Independent fan guide. Last updated {updatedLabel}."
    }
  }
} satisfies Record<Locale, UiMessages>;

export function getUiMessages(locale: Locale = defaultLocale) {
  return uiMessages[locale];
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => String(values[key] ?? match));
}
