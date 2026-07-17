# Phase 1 Data Model: Flora Pastel Marketing Website

Derived from the spec's Key Entities section. Like spec 002, this is content data (build-time, file-based), not a database schema — there is no runtime storage.

## Business Profile

The single business entity represented across every page (Home footer, Contact page, structured data, WhatsApp CTAs).

| Field | Type | Notes |
|---|---|---|
| `name` | string | "Flora Pastel" |
| `tagline` | string | Short value-proposition line for the Home hero (FR-004) |
| `story` | string | Longer brand-story paragraph(s) for the Home page (FR-006) |
| `whatsappNumber` | string | International format, no punctuation — same number/format already used by `buildWhatsAppLink` in spec 002 (`523319027014`) |
| `phone` | string | Display-formatted phone number (FR-013) |
| `address` | object | `{ street, neighborhood, city, state, country }` — matches the shape already present in `cliente/datos.md` |
| `hours` | array of `{ days: string, time: string }` | e.g., `{ days: "Lunes a sábado", time: "9:00 a.m. – 8:30 p.m." }` — mirrors `cliente/datos.md`'s two existing schedule entries |
| `mapsEmbedUrl` | string | Google Maps `embed` iframe `src` URL (FR-014) |
| `mapsDirectionsUrl` | string | Google Maps `search/?api=1&query=...` fallback link (FR-014, Edge Cases) |
| `social` | object | `{ facebook, instagram, tiktok }` URLs (FR-015) — matches `cliente/datos.md` |

**Validation rules**:
- `whatsappNumber` MUST be digits only, already country-coded (consistent with the existing `buildWhatsAppLink` contract).
- `hours` MUST contain at least one entry (a business with zero listed hours cannot satisfy FR-013).
- `mapsDirectionsUrl` MUST always be present, independent of whether `mapsEmbedUrl` loads — it is the required fallback, not an error-only path (Edge Cases).

**Relationships**: Singleton — exactly one Business Profile per site. Referenced by every page's footer, the Contact page, and any structured-data (`LocalBusiness`) output.

## Custom Cake Example

A past custom project shown for inspiration on the Custom Cakes page.

| Field | Type | Notes |
|---|---|---|
| `slug` | string (unique) | URL-safe identifier |
| `title` | string | Short title for the piece (e.g., "Pastel de XV años — temática floral") |
| `description` | string | What makes this example notable (occasion, technique, request) |
| `images` | array of image references, min length 1 | At least one photograph required (FR-008), processed via the same `astro:assets` pipeline as products |
| `tags` | array of string, min length 1 | Occasion/style tags (e.g., "cumpleaños," "corporativo," "boda") — spec's Key Entities example set |

**Validation rules**:
- `images` MUST contain at least one entry (an inspiration gallery with no photo has no purpose).
- `tags` MUST contain at least one entry — the gallery must "represent the range of styles and occasions" (FR-008), which requires each example to be classifiable.
- `slug` MUST be unique across the collection.

**Relationships**: None — a flat gallery of independent examples, unlike the catalog's Category→Product→Presentation hierarchy. No pricing relationship (see `research.md`'s Custom Cake gallery decision).

## Derived / computed data (not stored, computed at build or render time)

- **WhatsApp CTA messages, contextualized by page**: Home hero, a Custom Cakes example, and the Contact page each need a message appropriate to that context (FR-012). Extends spec 002's `buildWhatsAppLink(product, presentation?, isSobrePedido?)` shape with a parallel, page-context-aware variant — documented in `contracts/`.
- **SEO metadata per page**: title/description (FR-016), Open Graph tags (FR-017) — computed from each page's own front-matter/props, not a stored entity.
- **Structured data (`LocalBusiness` JSON-LD)**: Derived entirely from the Business Profile at render time (FR-018); never hand-duplicated per page.
- **Sitemap**: Derived automatically from the set of built pages by `@astrojs/sitemap` (FR-019); not authored content.

## Entity relationship summary

```text
Business Profile (1, singleton) ──── referenced by every page's footer, Contact page, structured data
Custom Cake Example (flat list, business-supplied count) ──── independent gallery items
```

- A Custom Cakes page with zero examples yet supplied is a valid (if unlikely) transitional state — per spec 002's precedent (a Category with zero Products), the page must still render its heading/intro without layout breakage rather than erroring.
