import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import {
  codesSchema,
  cropSchema,
  eventSchema,
  fishSchema,
  gardeningSchema,
  hobbySchema,
  insectSchema,
  npcSchema,
  petSchema,
  recipeSchema,
  shopSchema,
  staticPageSchema,
  toolSchema
} from "@data/heartopiaSchemas";

const arrayFile = (path: string) => file(path);
const stripId = <T extends { omit: (shape: { id: true }) => unknown }>(schema: T) => schema.omit({ id: true });
const pageId = (path: string) => (path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/\//g, "--"));
const staticPageLoader = (path: string) =>
  file(path, {
    parser: (text) => JSON.parse(text).map((page: { path: string }) => ({ id: pageId(page.path), ...page }))
  });

const codes = defineCollection({
  loader: file("src/data/content/codes.json", {
    parser: (text) => [{ id: "codes", ...JSON.parse(text) }]
  }),
  schema: codesSchema
});

export const collections = {
  fish: defineCollection({ loader: arrayFile("src/data/content/fish.json"), schema: stripId(fishSchema) }),
  shops: defineCollection({ loader: arrayFile("src/data/content/shops.json"), schema: stripId(shopSchema) }),
  crops: defineCollection({ loader: arrayFile("src/data/content/crops.json"), schema: stripId(cropSchema) }),
  gardening: defineCollection({ loader: arrayFile("src/data/content/gardening.json"), schema: stripId(gardeningSchema) }),
  insects: defineCollection({ loader: arrayFile("src/data/content/insects.json"), schema: stripId(insectSchema) }),
  recipes: defineCollection({ loader: arrayFile("src/data/content/recipes.json"), schema: stripId(recipeSchema) }),
  events: defineCollection({ loader: arrayFile("src/data/content/events.json"), schema: stripId(eventSchema) }),
  npcs: defineCollection({ loader: arrayFile("src/data/content/npcs.json"), schema: stripId(npcSchema) }),
  pets: defineCollection({ loader: arrayFile("src/data/content/pets.json"), schema: stripId(petSchema) }),
  hobbies: defineCollection({ loader: arrayFile("src/data/content/hobbies.json"), schema: stripId(hobbySchema) }),
  tools: defineCollection({ loader: arrayFile("src/data/content/tools.json"), schema: stripId(toolSchema) }),
  codes,
  staticPages: defineCollection({ loader: staticPageLoader("src/data/content/static-pages.json"), schema: staticPageSchema }),
  zhHansStaticPages: defineCollection({
    loader: staticPageLoader("src/data/content/i18n/zh-Hans/static-pages.json"),
    schema: staticPageSchema.partial({ ogImage: true })
  })
};
