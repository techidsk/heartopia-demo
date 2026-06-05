import { z } from "zod";
import fishRaw from "../../site/assets/data/fish.json";
import shopsRaw from "../../site/assets/data/shops.json";
import cropsRaw from "../../site/assets/data/crops.json";
import toolsRaw from "../../site/assets/data/tools.json";

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
  related: pathSchema
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
export const tools = z.array(toolSchema).parse(toolsRaw);

export type Fish = z.infer<typeof fishSchema>;
export type Shop = z.infer<typeof shopSchema>;
export type Crop = z.infer<typeof cropSchema>;
export type Tool = z.infer<typeof toolSchema>;

export const profitCrops = crops.filter(
  (crop): crop is Crop & { minutes: number; seed: number; sell: number } =>
    crop.minutes !== null && crop.seed !== null && crop.sell !== null
);
