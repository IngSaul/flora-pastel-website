# Phase 0 Research: Product Catalog Browsing

No prior implementation exists in this repository, so the technical decisions below establish the foundation this feature (and, by extension, the rest of the site) will build on. Each was chosen against the constitution's constraints (mobile-first, minimal JS, 90+ Lighthouse, static hosting, TypeScript preferred, configuration over hardcoding) and the spec's requirements (multi-category catalog, per-presentation pricing, Sobre Pedido lead-time labeling, no-JS resilience).

## Decision: Static site generator — Astro

**Decision**: Use Astro (static output mode) as the site generator.

**Rationale**: Astro ships zero JavaScript by default and only hydrates interactive "islands" opt-in, which directly satisfies the constitution's "minimize JavaScript" rule and the spec's FR-013 (all catalog content must work with JS disabled) without extra discipline required from the implementer. It has first-class TypeScript support (constitution: "TypeScript preferred"), built-in image optimization (`astro:assets`) covering FR-012 (lazy loading, optimized images) out of the box, and Content Collections — a typed, file-based data layer that is a natural fit for a ~24-item product catalog that the business will edit over time (Constitution V: configuration over hardcoding). It consistently scores 90+ on Lighthouse for content sites like this one with no extra tuning, aligning with SC-007 and the constitution's Performance principle.

**Alternatives considered**:
- **Plain static HTML/CSS (hand-authored, no generator)**: Matches the current `references/design-proposal.html` prototype exactly and has zero build tooling, but 24+ products across 6 categories would mean hand-duplicating markup per product with no schema/validation, directly conflicting with Constitution III ("no duplicated business logic") and V ("configuration over hardcoding") as the catalog grows.
- **Next.js / React-based framework**: Overkill for a fully static, no-backend, no-auth marketing site; ships a React runtime by default which works against the constitution's "minimize JavaScript" rule and adds complexity with no corresponding benefit for this feature.
- **Eleventy (11ty)**: A reasonable alternative static generator with a similar zero-JS-by-default philosophy, but lacks Astro's built-in typed Content Collections and first-party image optimization, both of which map directly onto this feature's needs (typed product/presentation data, optimized product photography).

## Decision: Product data as typed Content Collections

**Decision**: Model products, presentations, and categories as a schema-validated Astro Content Collection under `src/content/products/`, one entry per product, shaped after the fields already present in `cliente/productos.md` (slug, category, description, image, presentaciones).

**Rationale**: The business already maintains its catalog in a structured, per-product format (`cliente/productos.md`). Mirroring that structure as schema-typed content (rather than embedding product data in component markup) keeps content changes (new product, new presentation, price update) as data edits, not code edits — directly satisfying FR-003 ("every product currently defined... no product may be silently omitted") by making omission a visible schema/build error rather than a missed markup edit.

**Alternatives considered**:
- **Hardcoded markup per product**: Rejected — does not scale past a handful of products and violates Constitution III/V.
- **External headless CMS**: Rejected as unnecessary complexity for a static site with no backend and a business owner who already maintains catalog data as plain text/markdown; would also introduce a runtime dependency and a new point of failure for a site whose defining trait is static reliability.
- **Single JSON/YAML file for the whole catalog**: Viable, but one file per product (current choice) gives smaller, independently reviewable diffs when the business updates a single item, and maps cleanly to the one-section-per-product structure already used in `cliente/productos.md`.

## Decision: Category navigation via in-page anchor links, JS-optional enhancement

**Decision**: Implement category navigation (FR-002) as a static list of anchor links to `id`-addressed category sections on a single catalog page. Layer a small, non-essential JS enhancement (e.g., highlighting the active category while scrolling) on top, which is safe to omit entirely.

**Rationale**: Anchor links work with zero JavaScript, satisfying FR-013 without a fallback code path to maintain, and naturally support the "browse everything" (US1) and "jump to one category" (US2/US3 acceptance scenarios) flows in a single, crawlable, SEO-friendly page — reinforcing FR-019/SC-007-style discoverability goals inherited from the parent site spec. A single page also avoids expanding the site's page count beyond what spec 001 scoped (Home, Signature Cakes, Custom Cakes, Contact), consistent with this feature's Assumptions section.

**Alternatives considered**:
- **Client-side tab/filter widget (JS-driven show/hide)**: Rejected as the primary mechanism — would violate FR-013 if it became the only way to reach a category; could still be layered on later as a pure enhancement over the anchor-link baseline, but is not required for this feature.
- **One page per category**: Considered, but fragments a still-small catalog (6 categories, ~24 products) across multiple page loads for no clear user benefit, and complicates "browse everything" (US1) relative to a single grouped page.

## Decision: Testing approach — Playwright + axe-core + Lighthouse CI

**Decision**: Use Playwright for critical-path end-to-end tests (per user story), `@axe-core/playwright` for automated WCAG AA accessibility checks, and Lighthouse CI to enforce the performance/SEO/best-practices budget.

**Rationale**: The site has no backend and no complex application logic to unit test — the highest-value tests are "does the rendered HTML actually satisfy the acceptance scenarios," which is exactly what browser-driven e2e tests verify, including the FR-013 no-JS requirement (Playwright supports disabling JavaScript per test). This directly satisfies Constitution IV ("critical functionality tested before release") and gives an automatable, CI-friendly proxy for the constitution's Lighthouse 90+ and WCAG AA requirements rather than relying on manual spot-checks alone.

**Alternatives considered**:
- **Manual QA only**: Rejected — not repeatable, and the constitution's Definition of Done requires responsive/accessibility/performance verification on every feature, which manual-only testing cannot reliably guarantee over time.
- **Unit tests for component logic only**: Rejected as insufficient on its own — the risk in this feature is almost entirely in rendered output (is every product shown, is every price correct, does the no-JS fallback work), which unit tests of isolated functions would not catch.

## Decision: WhatsApp CTA link construction

**Decision**: Build WhatsApp deep links client-independent (plain `https://wa.me/<number>?text=<url-encoded message>` anchor hrefs, generated at build time), with the message pre-filled per product (and presentation, when applicable) per FR-011.

**Rationale**: `wa.me` links are plain anchor tags — no JavaScript required to construct or use them, satisfying FR-013. Generating them at build time from the same typed product data used for rendering guarantees the product name in the CTA always matches the product name on the page (no duplicated/hand-typed strings to drift out of sync), consistent with Constitution III.

**Alternatives considered**:
- **JS-constructed links on click**: Rejected as the default — would break under FR-013's no-JS requirement; a static `href` is strictly simpler and works everywhere.

## Remaining Unknowns

None. All NEEDS CLARIFICATION items from the Technical Context have been resolved above.
