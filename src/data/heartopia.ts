import { z } from "zod";
import fishRaw from "./content/fish.json";
import shopsRaw from "./content/shops.json";
import cropsRaw from "./content/crops.json";
import gardeningRaw from "./content/gardening.json";
import insectsRaw from "./content/insects.json";
import recipesRaw from "./content/recipes.json";
import codesRaw from "./content/codes.json";
import eventsRaw from "./content/events.json";
import npcsRaw from "./content/npcs.json";
import petsRaw from "./content/pets.json";
import hobbiesRaw from "./content/hobbies.json";
import toolsRaw from "./content/tools.json";
import zhHansFishOverlay from "./content/i18n/zh-Hans/data/fish.json";
import zhHansShopsOverlay from "./content/i18n/zh-Hans/data/shops.json";
import zhHansCropsOverlay from "./content/i18n/zh-Hans/data/crops.json";
import zhHansGardeningOverlay from "./content/i18n/zh-Hans/data/gardening.json";
import zhHansInsectsOverlay from "./content/i18n/zh-Hans/data/insects.json";
import zhHansRecipesOverlay from "./content/i18n/zh-Hans/data/recipes.json";
import zhHansCodesOverlay from "./content/i18n/zh-Hans/data/codes.json";
import zhHansEventsOverlay from "./content/i18n/zh-Hans/data/events.json";
import zhHansNpcsOverlay from "./content/i18n/zh-Hans/data/npcs.json";
import zhHansPetsOverlay from "./content/i18n/zh-Hans/data/pets.json";
import zhHansHobbiesOverlay from "./content/i18n/zh-Hans/data/hobbies.json";
import zhHansToolsOverlay from "./content/i18n/zh-Hans/data/tools.json";
import { defaultLocale, type Locale } from "@i18n/config";

const pathSchema = z.string().min(1);

export const fishSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["lake", "river", "ocean", "hidden", "event"]),
  spot: z.string().min(1),
  condition: z.string().min(1),
  window: z.string().min(1),
  rarity: z.enum(["common", "uncommon", "rare"]),
  level: z.string().min(1),
  use: z.string().min(1),
  map: pathSchema
});

export const shopSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  icon: z.string().min(1),
  owner: z.string().min(1),
  region: z.string().min(1),
  mapMarkerId: z.string().min(1),
  unlock: z.string().min(1),
  hours: z.string().min(1),
  inventory: z.array(z.string().min(1)),
  notes: z.string().min(1),
  links: z.object({
    map: pathSchema.optional(),
    npc: pathSchema.optional(),
    tool: pathSchema.optional()
  })
});

export const cropSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  group: z.string().min(1),
  growth: z.string().min(1),
  minutes: z.number().positive().nullable(),
  seed: z.number().nonnegative().nullable(),
  sell: z.number().nonnegative().nullable(),
  unlock: z.string().min(1),
  route: z.string().min(1),
  use: z.string().min(1),
  shop: pathSchema,
  tool: pathSchema,
  related: pathSchema,
  nameZh: z.string().min(1).optional(),
  image: pathSchema.optional(),
  wikiUrl: z.string().url().optional(),
  season: z.string().min(1).optional(),
  hobbyLevel: z.string().min(1).optional(),
  lore: z.string().min(1).optional(),
  source: z.string().min(1).optional()
});

export const gardeningSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string(),
  name: z.string().min(1),
  nameZh: z.string().min(1),
  number: z.string().min(1),
  category: z.string().min(1),
  season: z.string().min(1),
  time: z.string().min(1),
  weather: z.string().min(1),
  route: z.string().min(1),
  lore: z.string().min(1),
  hobbyLevel: z.string().min(1),
  iconFile: z.string().min(1),
  wikiUrl: z.string().url(),
  source: z.string().min(1),
  image: pathSchema,
  sourceImageUrl: z.string().url(),
  imageWidth: z.number().positive(),
  imageHeight: z.number().positive()
});

export const insectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameZh: z.string().min(1),
  number: z.string().min(1),
  season: z.string().min(1),
  time: z.string().min(1),
  weather: z.string().min(1),
  route: z.string().min(1),
  lore: z.string().min(1),
  rarity: z.string().min(1),
  hobbyLevel: z.string().min(1),
  iconFile: z.string().min(1),
  wikiUrl: z.string().url(),
  source: z.string().min(1),
  image: pathSchema,
  sourceImageUrl: z.string().url(),
  imageWidth: z.number().positive(),
  imageHeight: z.number().positive()
});

export const recipeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  group: z.string().min(1),
  ingredients: z.array(z.string().min(1)),
  route: z.string().min(1),
  use: z.string().min(1),
  risk: z.enum(["low", "medium", "high"]),
  source: z.string().min(1),
  tool: pathSchema,
  primary: pathSchema
});

const codeCandidateSchema = z.object({
  code: z.string().min(1),
  status: z.enum(["priority", "new", "milestone"]),
  rewards: z.array(z.string().min(1)),
  rewardTypes: z.array(z.string().min(1)),
  expiresAt: z.string().min(1).optional(),
  note: z.string().min(1).optional()
});

export const codesSchema = z.object({
  checkedAt: z.string().min(1),
  sourceNote: z.string().min(1),
  activeCandidates: z.array(codeCandidateSchema),
  expiredArchive: z.array(
    z.object({
      code: z.string().min(1),
      reportedReward: z.string().min(1),
      expired: z.string().min(1)
    })
  )
});

export const eventSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["current", "route", "upcoming", "archive"]),
  window: z.string().min(1),
  endAt: z.string(),
  route: z.string().min(1),
  rewards: z.array(z.string().min(1)),
  prep: z.array(z.string().min(1)),
  links: z.object({
    map: pathSchema,
    tool: pathSchema,
    guide: pathSchema
  })
});

export const npcSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  group: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  schedule: z.string().min(1),
  gifts: z.array(z.string().min(1)),
  shop: pathSchema,
  map: pathSchema,
  tool: pathSchema,
  nameZh: z.string().min(1).optional(),
  imageFile: z.string().min(1).optional(),
  image: pathSchema.optional(),
  sourceImageUrl: z.string().url().optional(),
  imageWidth: z.number().positive().optional(),
  imageHeight: z.number().positive().optional(),
  profile: z.string().min(1).optional(),
  wikiUrl: z.string().url().optional(),
  source: z.string().min(1).optional()
});

export const petSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  route: z.string().min(1),
  food: z.array(z.string().min(1)),
  unlock: z.string().min(1),
  source: z.string().min(1),
  map: pathSchema,
  shop: pathSchema,
  guide: pathSchema
});

export const hobbySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  group: z.string().min(1),
  summary: z.string().min(1),
  primary: pathSchema,
  tool: pathSchema,
  database: pathSchema
});

export const toolSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  href: pathSchema,
  image: pathSchema,
  description: z.string().min(1),
  useCase: z.string().min(1),
  linkedData: z.array(z.string().min(1)),
  status: z.string().min(1)
});

const translationStatusSchema = z.enum(["translated", "draft"]);

const localizedArrayOverlay = <T extends z.ZodRawShape>(shape: T) =>
  z.array(z.object({ id: z.string().min(1), translationStatus: translationStatusSchema.optional(), ...shape }).strict());

const fishOverlaySchema = localizedArrayOverlay(fishSchema.pick({
  name: true,
  spot: true,
  condition: true,
  window: true,
  level: true,
  use: true
}).partial().shape);

const shopOverlaySchema = localizedArrayOverlay(shopSchema.pick({
  name: true,
  type: true,
  owner: true,
  region: true,
  unlock: true,
  hours: true,
  inventory: true,
  notes: true
}).partial().shape);

const cropOverlaySchema = localizedArrayOverlay(cropSchema.pick({
  name: true,
  group: true,
  growth: true,
  unlock: true,
  route: true,
  use: true,
  nameZh: true,
  season: true,
  hobbyLevel: true,
  lore: true,
  source: true
}).partial().shape);

const gardeningOverlaySchema = localizedArrayOverlay(gardeningSchema.pick({
  name: true,
  nameZh: true,
  category: true,
  season: true,
  time: true,
  weather: true,
  route: true,
  lore: true,
  hobbyLevel: true,
  source: true
}).partial().shape);

const insectOverlaySchema = localizedArrayOverlay(insectSchema.pick({
  name: true,
  nameZh: true,
  season: true,
  time: true,
  weather: true,
  route: true,
  lore: true,
  rarity: true,
  hobbyLevel: true,
  source: true
}).partial().shape);

const recipeOverlaySchema = localizedArrayOverlay(recipeSchema.pick({
  name: true,
  group: true,
  ingredients: true,
  route: true,
  use: true,
  source: true
}).partial().shape);

const codeCandidateOverlaySchema = z.object({
  code: z.string().min(1),
  rewards: z.array(z.string().min(1)).optional(),
  rewardTypes: z.array(z.string().min(1)).optional(),
  note: z.string().min(1).optional()
}).strict();

const expiredCodeOverlaySchema = z.object({
  code: z.string().min(1),
  reportedReward: z.string().min(1).optional(),
  expired: z.string().min(1).optional()
}).strict();

const codesOverlaySchema = z.object({
  sourceNote: z.string().min(1).optional(),
  activeCandidates: z.array(codeCandidateOverlaySchema),
  expiredArchive: z.array(expiredCodeOverlaySchema)
}).strict();

const eventOverlaySchema = localizedArrayOverlay(eventSchema.pick({
  name: true,
  window: true,
  route: true,
  rewards: true,
  prep: true
}).partial().shape);

const npcOverlaySchema = localizedArrayOverlay(npcSchema.pick({
  name: true,
  group: true,
  role: true,
  location: true,
  schedule: true,
  gifts: true,
  nameZh: true,
  profile: true,
  source: true
}).partial().shape);

const petOverlaySchema = localizedArrayOverlay(petSchema.pick({
  name: true,
  category: true,
  route: true,
  food: true,
  unlock: true,
  source: true
}).partial().shape);

const hobbyOverlaySchema = localizedArrayOverlay(hobbySchema.pick({
  name: true,
  group: true,
  summary: true
}).partial().shape);

const toolOverlaySchema = localizedArrayOverlay(toolSchema.pick({
  title: true,
  category: true,
  description: true,
  useCase: true,
  linkedData: true,
  status: true
}).partial().shape);

const dataOverlaySchema = z.object({
  fish: fishOverlaySchema,
  shops: shopOverlaySchema,
  crops: cropOverlaySchema,
  gardening: gardeningOverlaySchema,
  insects: insectOverlaySchema,
  recipes: recipeOverlaySchema,
  codes: codesOverlaySchema,
  events: eventOverlaySchema,
  npcs: npcOverlaySchema,
  pets: petOverlaySchema,
  hobbies: hobbyOverlaySchema,
  tools: toolOverlaySchema
});

export const fish = z.array(fishSchema).parse(fishRaw);
export const shops = z.array(shopSchema).parse(shopsRaw);
export const crops = z.array(cropSchema).parse(cropsRaw);
export const gardening = z.array(gardeningSchema).parse(gardeningRaw);
export const insects = z.array(insectSchema).parse(insectsRaw);
export const recipes = z.array(recipeSchema).parse(recipesRaw);
export const codes = codesSchema.parse(codesRaw);
export const events = z.array(eventSchema).parse(eventsRaw);
export const npcs = z.array(npcSchema).parse(npcsRaw);
export const pets = z.array(petSchema).parse(petsRaw);
export const hobbies = z.array(hobbySchema).parse(hobbiesRaw);
export const tools = z.array(toolSchema).parse(toolsRaw);

export type Fish = z.infer<typeof fishSchema>;
export type Shop = z.infer<typeof shopSchema>;
export type Crop = z.infer<typeof cropSchema>;
export type Gardening = z.infer<typeof gardeningSchema>;
export type Insect = z.infer<typeof insectSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type Codes = z.infer<typeof codesSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Npc = z.infer<typeof npcSchema>;
export type Pet = z.infer<typeof petSchema>;
export type Hobby = z.infer<typeof hobbySchema>;
export type Tool = z.infer<typeof toolSchema>;
export type HeartopiaData = {
  fish: Fish[];
  shops: Shop[];
  crops: Crop[];
  gardening: Gardening[];
  insects: Insect[];
  recipes: Recipe[];
  codes: Codes;
  events: Event[];
  npcs: Npc[];
  pets: Pet[];
  hobbies: Hobby[];
  tools: Tool[];
  profitCrops: Array<Crop & { minutes: number; seed: number; sell: number }>;
};
export type DataSetName = Exclude<keyof z.infer<typeof dataOverlaySchema>, "codes">;

const zhHansOverlay = dataOverlaySchema.parse({
  fish: zhHansFishOverlay,
  shops: zhHansShopsOverlay,
  crops: zhHansCropsOverlay,
  gardening: zhHansGardeningOverlay,
  insects: zhHansInsectsOverlay,
  recipes: zhHansRecipesOverlay,
  codes: zhHansCodesOverlay,
  events: zhHansEventsOverlay,
  npcs: zhHansNpcsOverlay,
  pets: zhHansPetsOverlay,
  hobbies: zhHansHobbiesOverlay,
  tools: zhHansToolsOverlay
});

const dataOverlays: Partial<Record<Locale, z.infer<typeof dataOverlaySchema>>> = {
  "zh-Hans": zhHansOverlay
};

const overlayIdSets: Partial<Record<Locale, Partial<Record<DataSetName, Set<string>>>>> = Object.fromEntries(
  Object.entries(dataOverlays).map(([locale, overlay]) => [
    locale,
    Object.fromEntries(
      (Object.keys(overlay) as Array<keyof typeof overlay>)
        .filter((name): name is DataSetName => name !== "codes")
        .map((name) => [
          name,
          new Set(overlay[name].filter((row) => row.translationStatus !== "draft").map((row) => row.id))
        ])
    )
  ])
) as Partial<Record<Locale, Partial<Record<DataSetName, Set<string>>>>>;

function mergeById<T extends { id: string }>(
  rows: T[],
  overlays: Array<Partial<T> & { id: string; translationStatus?: z.infer<typeof translationStatusSchema> }>
): T[] {
  const overlaysById = new Map(overlays.map((overlay) => [overlay.id, overlay]));
  return rows.map((row) => {
    const overlay = overlaysById.get(row.id);
    if (!overlay) return row;
    const { translationStatus: _translationStatus, ...localizedFields } = overlay;
    return { ...row, ...localizedFields };
  });
}

function mergeCodeCandidates<T extends { code: string }>(rows: T[], overlays: Array<Partial<T> & { code: string }>): T[] {
  const overlaysByCode = new Map(overlays.map((overlay) => [overlay.code, overlay]));
  return rows.map((row) => ({ ...row, ...(overlaysByCode.get(row.code) || {}) }));
}

export function getHeartopiaData(locale: Locale = defaultLocale): HeartopiaData {
  const overlay = dataOverlays[locale];
  const localizedCrops = overlay ? mergeById(crops, overlay.crops) : crops;

  return {
    fish: overlay ? mergeById(fish, overlay.fish) : fish,
    shops: overlay ? mergeById(shops, overlay.shops) : shops,
    crops: localizedCrops,
    gardening: overlay ? mergeById(gardening, overlay.gardening) : gardening,
    insects: overlay ? mergeById(insects, overlay.insects) : insects,
    recipes: overlay ? mergeById(recipes, overlay.recipes) : recipes,
    codes: overlay
      ? {
          ...codes,
          ...("sourceNote" in overlay.codes ? { sourceNote: overlay.codes.sourceNote || codes.sourceNote } : {}),
          activeCandidates: mergeCodeCandidates(codes.activeCandidates, overlay.codes.activeCandidates),
          expiredArchive: mergeCodeCandidates(codes.expiredArchive, overlay.codes.expiredArchive)
        }
      : codes,
    events: overlay ? mergeById(events, overlay.events) : events,
    npcs: overlay ? mergeById(npcs, overlay.npcs) : npcs,
    pets: overlay ? mergeById(pets, overlay.pets) : pets,
    hobbies: overlay ? mergeById(hobbies, overlay.hobbies) : hobbies,
    tools: overlay ? mergeById(tools, overlay.tools) : tools,
    profitCrops: localizedCrops.filter(
      (crop): crop is Crop & { minutes: number; seed: number; sell: number } =>
        crop.minutes !== null && crop.seed !== null && crop.sell !== null
    )
  };
}

export function getTranslatedDataIds(locale: Locale, dataSet: DataSetName) {
  return [...(overlayIdSets[locale]?.[dataSet] || new Set<string>())];
}

export function isDataEntryTranslated(locale: Locale, dataSet: DataSetName, id: string) {
  return overlayIdSets[locale]?.[dataSet]?.has(id) || false;
}

export const profitCrops = crops.filter(
  (crop): crop is Crop & { minutes: number; seed: number; sell: number } =>
    crop.minutes !== null && crop.seed !== null && crop.sell !== null
);
