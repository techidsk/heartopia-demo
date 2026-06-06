import { defineConfig } from "astro/config";
import { readFileSync } from "node:fs";

const i18nConfig = JSON.parse(readFileSync(new URL("./src/i18n/locales.json", import.meta.url), "utf8"));

export default defineConfig({
  site: "https://heartopia.blog",
  i18n: {
    defaultLocale: i18nConfig.defaultLocale,
    locales: Object.keys(i18nConfig.locales),
    routing: {
      prefixDefaultLocale: false
    }
  },
  output: "static",
  outDir: "./dist"
});
