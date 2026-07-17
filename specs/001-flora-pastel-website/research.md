# Phase 0 Research: Flora Pastel Marketing Website

No prior site-wide implementation exists beyond what spec 002 (`002-product-catalog-browsing`) already delivered: the Astro project shell, design tokens applied to real components, `BaseLayout`, and the `WhatsAppCta`/`buildWhatsAppLink` pattern. Each decision below either reuses that proven foundation or resolves a `NEEDS CLARIFICATION` specific to this feature's remaining pages (Home, Custom Cakes, Contact) and site-wide concerns (nav/footer, SEO).

## Decision: Signature Cakes page — do not build a fourth page

**Decision**: Do not build a separate "Signature Cakes" page. The Home page's "introduce Signature Cakes" requirement (FR-005) is satisfied by linking directly to the already-shipped `/catalogo`.

**Rationale**: Spec 002 explicitly recorded this as an assumption ("This feature refines and supersedes the simplified two-gallery product model... replacing it with the business's actual multi-category catalog") and shipped a strictly more complete experience — 6 real categories, per-presentation pricing, Sobre Pedido lead times — than a simple photo gallery would offer. Building a second, simpler Signature Cakes page alongside it would duplicate content and confuse visitors with two different product listings.

**Alternatives considered**: A dedicated `/pasteles-firma` page mirroring the original spec's gallery — rejected as redundant work producing a strictly worse experience than what already exists.

## Decision: Sitemap generation — `@astrojs/sitemap`

**Decision**: Add the official `@astrojs/sitemap` integration to generate `sitemap.xml` at build time.

**Rationale**: First-party, purpose-built for exactly FR-019's requirement, zero runtime cost (build-time only), and it automatically stays correct as pages are added or removed — satisfying Constitution V ("configuration over hardcoding") better than a hand-maintained XML file, without violating "avoid unnecessary dependencies" since it directly implements a stated functional requirement.

**Alternatives considered**: Hand-written static `sitemap.xml` — rejected because it would silently go stale whenever a page is added (e.g., `/catalogo` from spec 002 was never in a sitemap at all today).

## Decision: Google Maps — plain iframe embed, no JS SDK

**Decision**: Embed the business location with a plain `<iframe src="https://www.google.com/maps/embed?...">`, plus a visible text address and a `https://www.google.com/maps/search/?api=1&query=...` directions link as a permanent fallback (not only shown on failure).

**Rationale**: An iframe embed requires no API key, no JavaScript, and keeps the Contact page fully functional with JavaScript disabled (FR-024) — the iframe itself is inert markup from the page's perspective. This directly satisfies FR-014's fallback requirement and the Edge Case ("map fails to load... address and text-based directions link must remain visible") by making the fallback always-present rather than conditionally rendered.

**Alternatives considered**: Google Maps JavaScript SDK (Places/Maps API) — rejected: requires an API key (ongoing cost/config burden for a static site), adds a third-party JS dependency, and violates "minimize JavaScript" for no functional benefit over a static embed at this scale.

## Decision: Custom Cake gallery — Content Collection, no pricing field

**Decision**: Model Custom Cake examples as a new `customCakes` Content Collection (added to the existing `src/content.config.ts`), with `title`, `description`, `images`, and `tags` (occasion/style) — no price field.

**Rationale**: Spec's Key Entities section gives "Custom Cake Example" a title/description/photos/tags shape, deliberately omitting price (unlike "Signature Cake," which explicitly has "an illustrative starting price") — consistent with FR-026/FR-027: custom work is quoted individually via WhatsApp conversation, not priced on the page. Reuses the exact Content Collection + `astro:assets` image pattern spec 002 already validated (glob loader, `image()` schema helper, responsive AVIF widths).

**Alternatives considered**: Reusing the `products` collection with optional fields — rejected: conflates two different entities (a priced menu item vs. an unpriced inspiration gallery), violating Constitution III's "no duplicated business logic" by forcing catalog components to branch on "is this a real product or a gallery example."

## Decision: Site-wide nav/footer — retrofit into `BaseLayout`, applies to `/catalogo` too

**Decision**: Replace `BaseLayout.astro`'s current inline header/footer stub with real `SiteNav`/`SiteFooter` components. Because every page (including the existing `/catalogo`) already renders through `BaseLayout`, this automatically brings the full site-wide nav (FR-001) and footer (FR-002) to the catalog page too, with no catalog-specific changes needed.

**Rationale**: FR-001/FR-002 require the nav and footer "present on every page" — satisfying that by centralizing in the already-shared layout (Constitution III: no duplicated business logic) rather than adding nav/footer markup to each page individually.

**Alternatives considered**: A separate `MarketingLayout` for the new pages, leaving `/catalogo` on its current bare layout — rejected: would leave the catalog without site navigation, directly violating FR-001's "every page" requirement and reintroducing the exact "how do I get back to the rest of the site" dead-end problem this plan exists to fix.

## Decision: Animations — CSS-only

**Decision**: Any hover/transition polish (FR-023) uses CSS `transition`/`transform` only (the same technique already used for `.btn-primary`/`.whatsapp-cta` hover states), never a JS animation library.

**Rationale**: Directly satisfies FR-024 (no-JS resilience — CSS transitions degrade to an instant state change, never to missing/broken content) and Constitution II ("minimize JavaScript"). Matches the pattern already proven and Lighthouse-verified in spec 002.

**Alternatives considered**: A JS scroll-reveal library — rejected as an unnecessary dependency (Constitution II) for a static, content-first marketing site.

## Decision: Testing approach — extend the existing Playwright + axe + Lighthouse CI setup

**Decision**: Add one Playwright spec per new page/concern (`home`, `custom-cakes`, `contact`, `site-chrome`, `not-found`), reusing the `@axe-core/playwright` and Lighthouse CI configuration spec 002 already set up and tuned (including the lesson learned there: Lighthouse's `webServer` must run on a dedicated port to avoid colliding with a locally-running `astro dev`).

**Rationale**: No new testing infrastructure decision is needed — spec 002 already proved this stack works end-to-end (Playwright no-JS variants, axe WCAG AA, Lighthouse ≥ 0.9 in all four categories) and satisfies Constitution IV for this feature too.

**Alternatives considered**: None — reusing proven, already-configured tooling is the only reasonable choice.
