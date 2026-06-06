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

export const profitCrops = crops.filter(
  (crop): crop is Crop & { minutes: number; seed: number; sell: number } =>
    crop.minutes !== null && crop.seed !== null && crop.sell !== null
);
