---

description: "Task list for Product Catalog Browsing"
---

# Tasks: Product Catalog Browsing

**Input**: Design documents from `/specs/002-product-catalog-browsing/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are included — `plan.md`'s Technical Context and `quickstart.md` explicitly designate Playwright/axe/Lighthouse coverage per user story, and the constitution (Principle IV) requires critical functionality tested before release.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are exact and match `plan.md`'s Project Structure

## Path Conventions

Single static Astro project at the repository root (per `plan.md`): `src/`, `public/`, `tests/e2e/` at repository root. No frontend/backend split.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create the Astro project shell (`package.json`, `astro.config.mjs`, `tsconfig.json`) at the repository root, static output mode, per `plan.md`'s Project Structure
- [x] T002 [P] Configure linting and formatting (ESLint + Prettier, or equivalent) per Constitution IV ("Lint passes", "Formatter passes")
- [x] T003 [P] Install and configure testing tooling: Playwright (`playwright.config.ts`), `@axe-core/playwright`, and Lighthouse CI config, per `plan.md`'s Testing decision
- [x] T004 [P] Port design tokens (colors, fonts, spacing, radii, shadows) from `references/design-proposal.html` into `src/styles/tokens.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer and shared utilities that every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Define the fixed Category data (`id`, `label`, `leadTimeNote`) for the 6 business categories in `src/content/categories.ts`, per `data-model.md`'s Category entity (only `sobre-pedido` has a non-null `leadTimeNote`)
- [x] T006 Define the Product/Presentation Content Collection schema (Zod) in `src/content.config.ts` per `contracts/product-content-schema.md`, referencing the category ids from T005 (depends on T005) — path is `src/content.config.ts`, not `src/content/config.ts`, per Astro 7's Content Layer API requirements
- [x] T007 [P] Implement `buildWhatsAppLink(product, presentation?, isSobrePedido?)` in `src/utils/whatsapp.ts`, covering all three message templates (standard, with-presentation, Sobre Pedido) from `contracts/whatsapp-cta-contract.md`
- [x] T008 [P] Create the shared page shell `src/layouts/BaseLayout.astro` (head/meta, minimal nav/footer stubs)
- [x] T009 [P] Copy and optimize product photography from `cliente/images/products` into `public/images/products`
- [x] T010 [P] Author Cheesecakes product entries (oreo, frutos-rojos, mandarina, manzana, cajeta) as files in `src/content/products/`, transcribed from `cliente/productos.md` (depends on T006)
- [x] T011 [P] Author Gelatinas product entries (fresa, durazno, mosaico) as files in `src/content/products/`, transcribed from `cliente/productos.md` (depends on T006)
- [x] T012 [P] Author Panqués product entries (rosca-de-naranja, barra-de-naranja, panque-individual) as files in `src/content/products/`, transcribed from `cliente/productos.md` (depends on T006)
- [x] T013 [P] Author Pasteles product entries (tres-leches, cafe, hersheys, chorreado-de-chocolate, ferrero, red-velvet, vainilla, zanahoria) as files in `src/content/products/`, transcribed from `cliente/productos.md` (depends on T006)
- [x] T014 [P] Author Postres product entries (cajetoso-de-elote, mostachon-de-frutos-rojos) as files in `src/content/products/`, transcribed from `cliente/productos.md` (depends on T006)
- [x] T015 [P] Author Sobre Pedido product entries (rosca-de-nuez-sin-azucar, mostachon-de-platano, panque-de-platano) as files in `src/content/products/`, transcribed from `cliente/productos.md` (depends on T006)

**Checkpoint**: Foundation ready — category data, product schema, all product content, the WhatsApp utility, base layout, and product images are in place. User story implementation can now begin.

---

## Phase 3: User Story 1 - Browse the full catalog by category (Priority: P1) 🎯 MVP

**Goal**: A visitor can open the catalog, see every product grouped under its real category, and jump directly to a category of interest.

**Independent Test**: Open the catalog entry point, confirm all 6 categories render with their products (name, photo, description), and confirm a category-nav link jumps directly to that category's section without scrolling past the others — per `quickstart.md`'s US1 walkthrough.

### Tests for User Story 1

- [x] T016 [P] [US1] Write the E2E test for category browsing (all 6 categories present, category nav jumps to the right section, each product shows name/photo/description) in `tests/e2e/catalog-browsing.spec.ts`, per `quickstart.md`'s US1 walkthrough — must fail before implementation

### Implementation for User Story 1

- [x] T017 [P] [US1] Create `ProductCard.astro` (renders name, photo, description, category) in `src/components/catalog/ProductCard.astro` — FR-004
- [x] T018 [US1] Create `CategorySection.astro` (renders a category heading with an anchor `id` and its `ProductCard`s) in `src/components/catalog/CategorySection.astro` — FR-001, FR-003 (depends on T017)
- [x] T019 [US1] Create `CategoryNav.astro` (anchor links to each category's section `id`, sourced from `src/content/categories.ts`) in `src/components/catalog/CategoryNav.astro` — FR-002 (depends on T005)
- [x] T020 [US1] Create the catalog entry page `src/pages/catalogo/index.astro`: query all products via the Content Collection, group them by category, and render `CategoryNav` followed by one `CategorySection` per category — FR-001, FR-002, FR-003 (depends on T018, T019)

**Checkpoint**: User Story 1 is fully functional and testable independently — the catalog can be browsed category by category.

---

## Phase 4: User Story 2 - Compare presentations and prices before deciding (Priority: P2)

**Goal**: A visitor viewing any product sees every presentation's size/portion and price, and can start a WhatsApp inquiry naming the exact product (and presentation).

**Independent Test**: Open a multi-presentation product and confirm all sizes/prices are visible without interaction; open a single-presentation product and confirm it renders plainly; trigger the WhatsApp CTA and confirm the pre-filled message names the product — per `quickstart.md`'s US2 walkthrough.

### Tests for User Story 2

- [x] T021 [P] [US2] Write the E2E test for presentation/price display and WhatsApp CTA message content in `tests/e2e/presentation-pricing.spec.ts`, per `quickstart.md`'s US2 walkthrough — must fail before implementation

### Implementation for User Story 2

- [x] T022 [P] [US2] Create `PresentationList.astro` (renders each presentation's `label`, `portionDescription`, and `priceMXN`) in `src/components/catalog/PresentationList.astro` — FR-005, FR-006, FR-007
- [x] T023 [P] [US2] Create `WhatsAppCta.astro` (renders a link built via `buildWhatsAppLink(product, presentation?)`) in `src/components/shared/WhatsAppCta.astro` — FR-010, FR-011 (depends on T007)
- [x] T024 [US2] Integrate `PresentationList` and `WhatsAppCta` into `ProductCard.astro` so every product shows all its presentations, each with its own CTA — FR-005, FR-010 (depends on T017, T022, T023)

**Checkpoint**: User Stories 1 AND 2 both work independently — the catalog is browsable and every product's pricing is comparable.

---

## Phase 5: User Story 3 - Recognize made-to-order products and their lead time (Priority: P3)

**Goal**: A visitor browsing or viewing a Sobre Pedido product clearly sees the required advance-notice period before deciding to order.

**Independent Test**: Navigate to the Sobre Pedido category, confirm the category and each of its products display the lead-time note, and confirm the WhatsApp CTA reflects the made-to-order expectation — per `quickstart.md`'s US3 walkthrough.

### Tests for User Story 3

- [x] T025 [P] [US3] Write the E2E test confirming the Sobre Pedido category and its products show the lead-time notice and the CTA message reflects it, in `tests/e2e/sobre-pedido.spec.ts`, per `quickstart.md`'s US3 walkthrough — must fail before implementation

### Implementation for User Story 3

- [x] T026 [P] [US3] Create `SobrePedidoNotice.astro` (renders a category's `leadTimeNote`) in `src/components/catalog/SobrePedidoNotice.astro` — FR-008, FR-009
- [x] T027 [US3] Render `SobrePedidoNotice` inside `CategorySection.astro` (category-level) and inside each of its `ProductCard`s when the category is `sobre-pedido` — FR-008, FR-009 (depends on T018, T026)
- [x] T028 [US3] Pass an `isSobrePedido` flag into `WhatsAppCta.astro` for Sobre Pedido products so `buildWhatsAppLink()` uses the Sobre Pedido message template — FR-011 (depends on T023, T007)

**Checkpoint**: All three user stories are independently functional — the catalog is browsable, comparable, and made-to-order expectations are clear.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and quality gates that span all three user stories

- [ ] T029 [P] Add `javaScriptEnabled: false` variants of all three E2E specs, asserting every product's name, description, presentations, prices, and Sobre Pedido notices remain visible — FR-013, per `quickstart.md`'s Resilience Checks
- [ ] T030 [P] Run `@axe-core/playwright` against the catalog page and fix any WCAG AA violations found
- [ ] T031 [P] Run Lighthouse (mobile + desktop) against the built catalog page and tune until Performance/Accessibility/Best Practices/SEO are each ≥ 90 — SC-007, Constitution II
- [ ] T032 Reconcile every entry in `src/content/products/` against `cliente/productos.md` line by line to confirm all ~24 products, their categories, presentations, and prices are present and correct — FR-003
- [ ] T033 [P] Tune product image delivery (`astro:assets` widths/formats, lazy loading) for mobile performance — FR-012
- [ ] T034 Run the full `quickstart.md` validation walkthrough end-to-end and record the results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 has no dependency on US2/US3
  - US2 builds on US1's `ProductCard.astro` (T017) but is independently testable once integrated
  - US3 builds on US1's `CategorySection.astro` (T018) and US2's `WhatsAppCta.astro` (T023) but is independently testable once integrated
  - Recommended order given these light dependencies: P1 → P2 → P3
- **Polish (Phase 6)**: Depends on all three user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependency on other stories
- **User Story 2 (P2)**: Can start after Foundational; integrates with US1's `ProductCard.astro` but is independently testable (a product with presentations but no category grouping still satisfies US2's acceptance scenarios)
- **User Story 3 (P3)**: Can start after Foundational; integrates with US1's `CategorySection.astro` and US2's `WhatsAppCta.astro` but is independently testable (a Sobre Pedido notice is verifiable on its own)

### Within Each User Story

- Tests are written first and must fail before implementation begins
- Components before page/integration wiring
- Story complete and independently checkpointed before moving to the next priority

### Parallel Opportunities

- All Setup tasks marked [P] (T002-T004) can run in parallel after T001
- Within Foundational, T005, T007, T008, T009 can run in parallel; T010-T015 (product content authoring) can all run in parallel once T006 is done
- Once Foundational completes, US1, US2, and US3 test-writing tasks (T016, T021, T025) can all be written in parallel
- Within each story, [P]-marked component tasks (e.g., T017; T022 and T023) can run in parallel
- Polish tasks T029, T030, T031, T033 can run in parallel; T032 and T034 are sequential verification passes

---

## Parallel Example: Foundational Phase

```bash
# After T006 (schema) is done, author all category content files in parallel:
Task: "Author Cheesecakes product entries in src/content/products/"
Task: "Author Gelatinas product entries in src/content/products/"
Task: "Author Panqués product entries in src/content/products/"
Task: "Author Pasteles product entries in src/content/products/"
Task: "Author Postres product entries in src/content/products/"
Task: "Author Sobre Pedido product entries in src/content/products/"
```

## Parallel Example: User Story 2

```bash
# Launch both new US2 components together (independent files):
Task: "Create PresentationList.astro in src/components/catalog/PresentationList.astro"
Task: "Create WhatsAppCta.astro in src/components/shared/WhatsAppCta.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories; includes all real product content)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run T016 and the US1 section of `quickstart.md` independently
5. Deploy/demo if ready — a browsable, category-grouped catalog is already a usable MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready (real catalog data in place)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (pricing now comparable)
4. Add User Story 3 → Test independently → Deploy/Demo (Sobre Pedido expectations now clear)
5. Polish → accessibility, performance, and no-JS verification pass

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests are included per `plan.md`/`quickstart.md`; write and confirm they fail before implementing each story
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- The Sobre Pedido `leadTimeNote` lives on the Category (T005), not per-product — do not duplicate the lead-time text into individual product entries (T015)
