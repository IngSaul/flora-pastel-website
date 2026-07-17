# Contract: Product Content Schema

This is the interface between whoever maintains the catalog's content (business owner or developer editing files under `src/content/products/`) and the components that render it. Any content entry that doesn't satisfy this contract fails the Astro Content Collection build — the contract is enforced, not just documented.

## Schema (Zod shape, `src/content/config.ts`)

```ts
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

const product = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: categoryId,
  description: z.string().min(1),
  images: z.array(z.string().min(1)).min(1),
  presentations: z.array(presentation).min(1),
});
```

## Example entry

Mirrors `cliente/productos.md`'s "Oreo" entry:

```yaml
slug: oreo
name: Oreo
category: cheesecakes
description: >
  Hecho con base de galleta Oreo, relleno de cheesecake con queso Philadelphia
  y brownie. Decorado con crema de chocolate, frutos rojos, galleta Oreo y
  hoja de chocolate.
images:
  - oreo.jpg
presentations:
  - label: Grande
    portionDescription: 12 porciones
    priceMXN: 540
  - label: Mediano
    portionDescription: 8 porciones
    priceMXN: 340
  - label: Individual
    portionDescription: null
    priceMXN: 75
```

## Guarantees this contract makes to consumers (catalog components)

- `presentations` is never empty — components never need an empty-state branch for "no pricing available."
- `category` is always one of the six known values — components can exhaustively switch/group on it without a default/unknown case.
- `images` always has at least one entry — the `ProductCard` component can always render a photograph.

## Guarantees this contract requires from content authors

- Every product from the business's authoritative list (`cliente/productos.md`) MUST have a corresponding content entry (build-time completeness is not automatically checked against that source file — a manual reconciliation pass is required when the business's list changes; see `quickstart.md`).
- `sobre-pedido` category products rely on the Category-level `leadTimeNote` (see `data-model.md`), not a per-product field — content authors do not repeat the lead-time text on every Sobre Pedido product.
