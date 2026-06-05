import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://heartopia-demo.pages.dev",
  output: "static",
  outDir: "./dist",
  publicDir: "./.astro-public"
});
