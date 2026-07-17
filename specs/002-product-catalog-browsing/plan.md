# Implementation Plan: Product Catalog Browsing

**Branch**: `002-product-catalog-browsing` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-product-catalog-browsing/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Give visitors a self-serve way to browse Flora Pastel's full product catalog — grouped into its 6 real business categories (Cheesecakes, Gelatinas, Panqués, Pasteles, Postres, Sobre Pedido) — see every presentation and price for a product without contacting the business first, recognize made-to-order lead times up front, and jump into a WhatsApp conversation pre-filled with the specific product. Technical approach: a statically generated Astro site with the product catalog modeled as typed content data (mirroring `cliente/productos.md`), rendered into category-grouped, server-built HTML with zero required JavaScript, so the catalog matches the site's constitution mandate (mobile-first, minimal JS, 90+ Lighthouse, static hosting).

## Technical Context

**Language/Version**: TypeScript 5.x, HTML5, CSS3

**Primary Dependencies**: Astro 4.x (static output, Content Collections for typed product data, built-in `astro:assets` image optimization); no client-side UI framework — category navigation degrades to plain in-page anchor links, with optional unobtrusive JS enhancement (e.g., active-tab highlighting) layered on top per the site's progressive-enhancement rule (FR-013)

**Storage**: N/A (no database or backend). Product catalog is structured content data (one entry per product, schema-validated), analogous in shape to `cliente/productos.md`, checked into the repository and compiled at build time

**Testing**: Playwright for critical-path end-to-end checks (category navigation, presentation/price rendering, Sobre Pedido lead-time labeling, WhatsApp CTA link correctness, no-JS rendering); `@axe-core/playwright` for automated accessibility checks (WCAG AA); Lighthouse CI to enforce the 90+ performance/accessibility/best-practices/SEO budget from the constitution and spec SC-007

**Target Platform**: Static web hosting (CDN-served static HTML/CSS, no server runtime required); modern evergreen browsers; mobile-first responsive from 320px to 2560px

**Project Type**: Single static website project (no frontend/backend split — there is no backend)

**Performance Goals**: Lighthouse Performance/Accessibility/Best Practices/SEO ≥ 90 on mobile and desktop; catalog primary content (first category, product names) visible in under 2.5s on a simulated mid-range mobile device (spec SC-007)

**Constraints**: Minimal JavaScript — all catalog content (names, descriptions, categories, presentations, prices, Sobre Pedido notices) must render and remain usable with JavaScript disabled (FR-013); product photography must be lazy-loaded and served in optimized formats/sizes (FR-012); no cart, checkout, payment, or order-status logic of any kind (FR-014)

**Scale/Scope**: ~24 products across 6 categories today (per `cliente/productos.md`); catalog structure must accommodate the business adding/editing/removing products and presentations via content data changes, without requiring code changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment |
|---|---|
| I. User Experience First | PASS — mobile-first category navigation, WCAG AA target enforced via automated axe checks, consistent visual hierarchy reused from the site's existing design tokens (`references/design-proposal.html`) |
| II. Performance Is a Feature | PASS — Astro emits static HTML/CSS with zero required JS; images optimized and lazy-loaded via `astro:assets`; no added runtime dependencies; Lighthouse CI enforces the 90+ budget |
| III. Maintainability Over Cleverness | PASS — product data is schema-typed (Content Collections), presentation/price logic is centralized in small reusable components, no business logic duplicated between components |
| IV. Reliability Through Quality | PASS (enforced via tooling) — lint, format, and build gates plus Playwright + axe checks required before the feature is considered done |
| V. Future Growth | PASS — categories/products/presentations are configuration (content data), not hardcoded markup; adding a 7th category or a 25th product requires a content entry, not a code change |

No violations identified. Complexity Tracking is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-product-catalog-browsing/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
├── contracts/            # Phase 1 output (/speckit-plan command)
│   ├── product-content-schema.md
│   └── whatsapp-cta-contract.md
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

No application code exists yet in this repository (spec-first state). This plan scaffolds the minimal Astro project shell needed to host the catalog, plus everything specific to this feature. Pages outside the catalog (Home, Custom Cakes, Contact) belong to `specs/001-flora-pastel-website` and are out of scope here.

```text
astro.config.mjs
package.json
tsconfig.json

src/
├── content/
│   ├── config.ts                    # Content Collection schema (Product, Presentation, Category)
│   └── products/                    # One entry per product; mirrors cliente/productos.md
│       ├── oreo.md
│       ├── tres-leches.md
│       └── ...
├── components/
│   ├── catalog/
│   │   ├── CategoryNav.astro        # In-page category jump links (FR-002)
│   │   ├── CategorySection.astro    # Renders one category's products (FR-001, FR-003)
│   │   ├── ProductCard.astro        # Name, photo, description, category (FR-004)
│   │   ├── PresentationList.astro   # Size/portion + price per presentation (FR-005, FR-006, FR-007)
│   │   └── SobrePedidoNotice.astro  # Lead-time badge/text (FR-008, FR-009)
│   └── shared/
│       └── WhatsAppCta.astro        # Pre-filled WhatsApp link builder (FR-010, FR-011)
├── layouts/
│   └── BaseLayout.astro             # Shared shell (head/meta, nav, footer stubs from spec 001)
├── pages/
│   └── catalogo/
│       └── index.astro              # Catalog entry point
├── styles/
│   └── tokens.css                   # Design tokens ported from references/design-proposal.html
└── utils/
    └── whatsapp.ts                  # buildWhatsAppLink(product, presentation?) helper

public/
└── images/products/                 # Optimized product photography (source: cliente/images/products)

tests/
└── e2e/
    ├── catalog-browsing.spec.ts     # US1
    ├── presentation-pricing.spec.ts # US2
    └── sobre-pedido.spec.ts         # US3
```

**Structure Decision**: Single static Astro project at the repository root (no frontend/backend split — there is no backend). Product data lives in typed Content Collections under `src/content/products/`, decoupling catalog content from presentation markup per Constitution V. The catalog is delivered as a dedicated entry point (`src/pages/catalogo/index.astro`) composed of small, reusable catalog components, consistent with Constitution III's "small reusable components" requirement.

## Complexity Tracking

*No violations — table intentionally omitted.*
