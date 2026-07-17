import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const categoryId = z.enum([
  "cheesecakes",
  "gelatinas",
  "panques",
  "pasteles",
  "postres",
  "sobre-pedido",
]);

const presentation = z.object({
  label: z.string().min(1),
  portionDescription: z.string().min(1).nullable(),
  priceMXN: z.number().int().positive(),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: ({ image }) =>
    z.object({
      slug: z.string().min(1),
      name: z.string().min(1),
      category: categoryId,
      description: z.string().min(1),
      images: z.array(image()).min(1),
      presentations: z.array(presentation).min(1),
    }),
});

export const collections = { products };
