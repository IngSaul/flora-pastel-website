# Contract: Custom Cake Content Schema

The interface between whoever maintains the Custom Cakes gallery content (business owner or developer editing files under `src/content/custom-cakes/`) and the components that render it. Any content entry that doesn't satisfy this contract fails the Astro Content Collection build.

## Schema (Zod shape, added to `src/content.config.ts`)

```ts
const customCakes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/custom-cakes" }),
  schema: ({ image }) =>
    z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      images: z.array(image()).min(1),
      tags: z.array(z.string().min(1)).min(1),
    }),
});
```

## Example entry

```yaml
---
slug: pastel-xv-anos-floral
title: Pastel de XV años — temática floral
description: >
  Tres pisos con flores de azúcar hechas a mano en tonos rosa y durazno,
  diseñado para una celebración de XV años.
images:
  - ../../assets/custom-cakes/pastel-xv-anos-floral.avif
tags:
  - xv-años
  - floral
---
```

## Guarantees this contract makes to consumers (gallery components)

- `images` is never empty — `GalleryItem` never needs an empty-state branch for "no photo."
- `tags` is never empty — every example can be labeled with at least one occasion/style tag, satisfying FR-008's "represent the range of styles and occasions."

## Guarantees this contract requires from content authors

- No pricing field exists on this schema by design (see `research.md`'s Custom Cake gallery decision) — content authors must not attempt to add a price here; custom work is quoted via WhatsApp per FR-026/FR-027.
