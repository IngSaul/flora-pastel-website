# Phase 1 Data Model: Product Catalog Browsing

Derived from the spec's Key Entities section and grounded in the real shape of `cliente/productos.md`. This is a content data model (build-time, file-based), not a database schema — there is no runtime storage.

## Category

Represents one of the business's product groupings. A fixed, small set — not open user input.

| Field | Type | Notes |
|---|---|---|
| `id` | enum slug | One of: `cheesecakes`, `gelatinas`, `panques`, `pasteles`, `postres`, `sobre-pedido` |
| `label` | string | Display name shown to visitors (e.g., "Cheesecakes", "Sobre Pedido") |
| `leadTimeNote` | string \| null | Required, non-null for `sobre-pedido` (e.g., "Disponible bajo pedido, con 3 días de anticipación"); `null` for all other categories |

**Validation rules**:
- `leadTimeNote` MUST be present and non-empty when `id === 'sobre-pedido'` (enforces spec FR-008/FR-009).
- `leadTimeNote` MUST be absent/null for every other category (avoids implying lead-time restrictions on immediately-available items).

**Relationships**: A Category has many Products (one-to-many). Every Product belongs to exactly one Category (spec Key Entities: "Belongs to exactly one category").

## Product

Represents one catalog item.

| Field | Type | Notes |
|---|---|---|
| `slug` | string (unique) | URL-safe identifier, matches `cliente/productos.md` slugs (e.g., `oreo`, `tres-leches`) |
| `name` | string | Display name (e.g., "Oreo", "Rosca de Naranja") |
| `category` | Category reference (`id`) | Exactly one |
| `description` | string | Short description shown on the catalog (FR-004) |
| `images` | array of image references, min length 1 | At least one photograph required (FR-004) |
| `presentations` | array of Presentation, min length 1 | Every product has ≥ 1 presentation (spec Edge Cases: single-presentation products must render plainly) |

**Validation rules**:
- `presentations` MUST contain at least one entry (a product with zero presentations cannot display a price, violating FR-005).
- `slug` MUST be unique across the collection (prevents ambiguous WhatsApp CTA targets and duplicate content entries).
- `category` MUST reference a defined Category `id` (no orphaned products — supports FR-001's "every product... grouped under their category").

**Relationships**: Belongs to one Category. Has many Presentations (one-to-many, minimum one).

## Presentation

Represents one size/portion option for a Product, with its own price.

| Field | Type | Notes |
|---|---|---|
| `label` | string | Size/portion name as the business describes it (e.g., "Grande", "Individual", "Rosca", "Rebanada") |
| `portionDescription` | string \| null | Optional extra detail (e.g., "12 porciones", "2 litros · 14 porciones", "355 ml") — null when the label is self-explanatory (e.g., single-presentation products like "Rosca") |
| `priceMXN` | positive integer | Price in Mexican pesos for this specific presentation (FR-007) |

**Validation rules**:
- `priceMXN` MUST be a positive integer (no free/zero-priced entries — a catalog item always has a price per spec FR-007).
- Within a single Product's `presentations` array, `label` values SHOULD be unique (avoids two ambiguous "Grande" entries with different prices for the same product).

**Relationships**: Belongs to exactly one Product (composition — a Presentation has no independent existence outside its Product).

## Derived / computed data (not stored, computed at build or render time)

- **WhatsApp CTA message**: Built from `Product.name` and, when a specific presentation is in context, `Presentation.label` (per FR-011 and the `whatsapp-cta-contract.md` contract). Not persisted — generated at build time into the static `href`.
- **Category product listing**: The set of Products where `product.category === category.id`, used to render each `CategorySection` (FR-001). Not a stored field — derived from the Product collection at build time.

## Entity relationship summary

```text
Category (6 fixed) 1 ──── * Product (~24 today) 1 ──── * Presentation (≥1 each)
```

- A Category with zero Products is a valid (if unlikely) state — the catalog must still render the category header without layout breakage (spec Edge Cases).
- A Product always has ≥ 1 Presentation; there is no "presentation-less" product state.
