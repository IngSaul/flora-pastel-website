# Implementation Plan: Flora Pastel Marketing Website

**Branch**: `001-flora-pastel-website` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-flora-pastel-website/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Give Flora Pastel a complete, premium static marketing site — Home, Custom Cakes, and Contact — that presents the brand, showcases products, and drives every visitor toward a WhatsApp conversation. **The fourth originally-scoped page, Signature Cakes, is already delivered**: `specs/002-product-catalog-browsing` shipped a fuller multi-category product catalog at `/catalogo` that supersedes the simplified Signature Cakes gallery this spec originally described (see spec 002's Assumptions). This plan therefore scopes the *remaining* gap — Home, Custom Cakes, Contact, the site-wide nav/footer shared across every page (including the catalog), and cross-cutting SEO/structured-data/sitemap/robots/404 infrastructure — reusing the Astro project, design tokens, `BaseLayout`, and `WhatsAppCta` already built and proven by spec 002.

## Technical Context

**Language/Version**: TypeScript 5.x, HTML5, CSS3

**Primary Dependencies**: Astro 7.x (already installed by spec 002; static output, Content Collections, `astro:assets`); `@astrojs/sitemap` (new — official first-party integration, auto-generates `sitemap.xml` for FR-019 with zero hand-maintenance); no client-side UI framework — reuses spec 002's zero-required-JS approach

**Storage**: N/A (no database or backend). Custom Cake gallery examples and the Business Profile are structured content data, following the same Content Collection pattern spec 002 established for products

**Testing**: Playwright for critical-path end-to-end checks per page (Home hero/CTA, Custom Cakes gallery + WhatsApp request, Contact info/map, 404 fallback, nav/footer present on every page); `@axe-core/playwright` for WCAG AA (same pattern as `tests/e2e/accessibility.spec.ts`); Lighthouse CI extended to also audit `/`, `/pasteles-personalizados`, `/contacto`, and a 404 route

**Target Platform**: Static web hosting (CDN-served static HTML/CSS), modern evergreen browsers, mobile-first 320px–2560px — unchanged from spec 002

**Project Type**: Single static website project (no frontend/backend split) — same repository, same Astro project spec 002 scaffolded

**Performance Goals**: Lighthouse Performance/Accessibility/Best Practices/SEO ≥ 90 on mobile and desktop for every page (SC-002); primary content visible in under 2.5s on a simulated mid-range mobile device (SC-003)

**Constraints**: Minimal JavaScript — all business-critical content (branding, photography, descriptions, address, phone, hours, social links) must remain visible and usable with JavaScript disabled (FR-024); the Google Maps embed must degrade to a text address + directions link if it cannot load (FR-014, Edge Cases); no cart, checkout, payment, or structured custom-order intake form (FR-025, FR-027)

**Scale/Scope**: 3 net-new pages (Home, Custom Cakes, Contact) + a 404 page + a shared site-wide nav/footer retrofitted onto every existing and new page (including `/catalogo`); a handful of Custom Cake gallery examples (business-supplied, count TBD by the business — content data, not code); one Business Profile entry

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment |
|---|---|
| I. User Experience First | PASS — mobile-first responsive nav/footer on every page, WCAG AA enforced via automated axe checks (extending spec 002's proven pattern), consistent visual hierarchy reused from the already-applied design tokens and component patterns (`.plate`, `.btn-*`, `.placeholder-note`) |
| II. Performance Is a Feature | PASS — static HTML/CSS, zero required JS, images optimized via `astro:assets` (same pipeline spec 002 tuned), Lighthouse CI enforces the 90+ budget per page |
| III. Maintainability Over Cleverness | PASS — Business Profile and Custom Cake examples are schema-typed content data; nav/footer/SEO metadata centralized in `BaseLayout` and small shared components, not duplicated per page |
| IV. Reliability Through Quality | PASS (enforced via tooling) — lint, format, and build gates plus Playwright + axe checks required before the feature is considered done, matching spec 002's Definition of Done |
| V. Future Growth | PASS — Custom Cake examples and Business Profile fields are configuration (content data), not hardcoded markup; adding a new gallery example or updating hours/social links requires a content entry, not a code change |

No violations identified. Complexity Tracking is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-flora-pastel-website/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
├── contracts/            # Phase 1 output (/speckit-plan command)
│   ├── custom-cake-content-schema.md
│   ├── business-profile-contract.md
│   └── seo-metadata-contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

Extends the existing Astro project from spec 002 — no new project shell, no new tooling. Only additive paths are listed; everything under `src/content/products/`, `src/components/catalog/`, etc. from spec 002 is untouched.

```text
src/
├── content/
│   ├── config.ts is now src/content.config.ts (spec 002) — this feature ADDS
│   │                  the `customCakes` collection to that same file
│   ├── custom-cakes/                 # One entry per gallery example (business-supplied)
│   │   └── ...
│   └── business.ts                   # Business Profile: name, story, address, phone,
│                                      # hours, social links, WhatsApp number (FR-013, FR-015)
├── components/
│   ├── site/
│   │   ├── SiteNav.astro             # Site-wide nav: Home/Catálogo/Personalizados/Contacto — FR-001, FR-003
│   │   ├── SiteFooter.astro          # Site-wide footer: quick links, social, WhatsApp shortcut — FR-002
│   │   └── Seo.astro                 # <head> title/description/OG/structured-data helper — FR-016, FR-017, FR-018
│   ├── home/
│   │   ├── Hero.astro                # Hero section + primary WhatsApp CTA — FR-004
│   │   ├── BrandStory.astro          # Brand story/value proposition — FR-006
│   │   └── OfferingsIntro.astro      # Links into /catalogo and /pasteles-personalizados — FR-005
│   ├── gallery/
│   │   ├── GalleryGrid.astro         # Reusable photo grid (Custom Cakes) — FR-008
│   │   └── GalleryItem.astro         # One example: photo, title, description, tags, WhatsApp CTA — FR-009
│   └── contact/
│       ├── BusinessInfo.astro        # Address, phone, hours — FR-013
│       ├── MapEmbed.astro            # Google Maps iframe + text fallback — FR-014, Edge Cases
│       └── SocialLinks.astro         # Social profile links — FR-015
├── layouts/
│   └── BaseLayout.astro              # MODIFIED (spec 002 file): mounts SiteNav/SiteFooter/Seo instead
│                                      # of the current inline header/footer stub
├── pages/
│   ├── index.astro                   # MODIFIED (currently an ad-hoc placeholder): real Home page
│   ├── pasteles-personalizados/
│   │   └── index.astro               # Custom Cakes page — FR-008, FR-009
│   ├── contacto/
│   │   └── index.astro               # Contact page — FR-013, FR-014, FR-015
│   └── 404.astro                     # Custom 404 — FR-021
└── utils/
    └── seo.ts                        # buildOgImage/structured-data helpers, reused by Seo.astro

public/
├── robots.txt                        # FR-020
└── images/custom-cakes/              # Source photography for the gallery (business-supplied)

tests/e2e/
├── home.spec.ts                      # US1 (Home hero/CTA, offerings links)
├── custom-cakes.spec.ts              # US2 (gallery, request CTA)
├── contact.spec.ts                   # US3 (address/map/hours/social)
├── site-chrome.spec.ts               # Nav/footer present + WhatsApp CTA reachable on every page — FR-001, FR-002, FR-011
└── not-found.spec.ts                 # 404 page — FR-021
```

**Structure Decision**: Same single static Astro project as spec 002 (no frontend/backend split, no new tooling). New pages, components, and content collections are additive; the only modified files from spec 002 are `BaseLayout.astro` (to mount the real site-wide nav/footer/SEO in place of the placeholder stub) and `src/pages/index.astro` (to become the real Home page instead of the ad-hoc catalog-link bridge). The Signature Cakes requirement (FR-005's first offering, spec's original fourth page) is satisfied by linking to the existing `/catalogo` rather than building a redundant page.

## Complexity Tracking

*No violations — table intentionally omitted.*
