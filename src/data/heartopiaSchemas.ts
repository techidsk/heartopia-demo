import { z } from "zod";

export const pathSchema = z.string().min(1);

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

export const staticPageSchema = z.object({
  path: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  section: z.string().min(1),
  keywords: z.array(z.string().min(1)),
  ogImage: pathSchema.optional(),
  content: z.string().min(1)
});

export const translationStatusSchema = z.enum(["translated", "draft"]);

export const localizedArrayOverlay = <T extends z.ZodRawShape>(shape: T) =>
  z.array(z.object({ id: z.string().min(1), translationStatus: translationStatusSchema.optional(), ...shape }).strict());

export const fishOverlaySchema = localizedArrayOverlay(fishSchema.pick({
  name: true,
  spot: true,
  condition: true,
  window: true,
  level: true,
  use: true
}).partial().shape);

export const shopOverlaySchema = localizedArrayOverlay(shopSchema.pick({
  name: true,
  type: true,
  owner: true,
  region: true,
  unlock: true,
  hours: true,
  inventory: true,
  notes: true
}).partial().shape);

export const cropOverlaySchema = localizedArrayOverlay(cropSchema.pick({
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

export const gardeningOverlaySchema = localizedArrayOverlay(gardeningSchema.pick({
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

export const insectOverlaySchema = localizedArrayOverlay(insectSchema.pick({
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

export const recipeOverlaySchema = localizedArrayOverlay(recipeSchema.pick({
  name: true,
  group: true,
  ingredients: true,
  route: true,
  use: true,
  source: true
}).partial().shape);

export const codeCandidateOverlaySchema = z.object({
  code: z.string().min(1),
  rewards: z.array(z.string().min(1)).optional(),
  rewardTypes: z.array(z.string().min(1)).optional(),
  note: z.string().min(1).optional()
}).strict();

export const expiredCodeOverlaySchema = z.object({
  code: z.string().min(1),
  reportedReward: z.string().min(1).optional(),
  expired: z.string().min(1).optional()
}).strict();

export const codesOverlaySchema = z.object({
  sourceNote: z.string().min(1).optional(),
  activeCandidates: z.array(codeCandidateOverlaySchema),
  expiredArchive: z.array(expiredCodeOverlaySchema)
}).strict();

export const eventOverlaySchema = localizedArrayOverlay(eventSchema.pick({
  name: true,
  window: true,
  route: true,
  rewards: true,
  prep: true
}).partial().shape);

export const npcOverlaySchema = localizedArrayOverlay(npcSchema.pick({
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

export const petOverlaySchema = localizedArrayOverlay(petSchema.pick({
  name: true,
  category: true,
  route: true,
  food: true,
  unlock: true,
  source: true
}).partial().shape);

export const hobbyOverlaySchema = localizedArrayOverlay(hobbySchema.pick({
  name: true,
  group: true,
  summary: true
}).partial().shape);

export const toolOverlaySchema = localizedArrayOverlay(toolSchema.pick({
  title: true,
  category: true,
  description: true,
  useCase: true,
  linkedData: true,
  status: true
}).partial().shape);

export const dataOverlaySchema = z.object({
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

