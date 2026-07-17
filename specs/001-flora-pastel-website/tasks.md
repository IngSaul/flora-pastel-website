---

description: "Task list for Flora Pastel Marketing Website"
---

# Tasks: Flora Pastel Marketing Website

**Input**: Design documents from `/specs/001-flora-pastel-website/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are included — `plan.md`'s Technical Context and `quickstart.md` explicitly designate Playwright/axe/Lighthouse coverage per user story, and the constitution (Principle IV) requires critical functionality tested before release, matching the precedent set by `specs/002-product-catalog-browsing`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are exact and match `plan.md`'s Project Structure

## Path Conventions

Single static Astro project at the repository root (unchanged from spec 002): `src/`, `public/`, `tests/e2e/` at repository root. This feature extends the existing project — no new project shell.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Site-wide infrastructure this feature adds on top of the existing spec 002 project

- [x] T001 [P] Install and configure `@astrojs/sitemap` in `astro.config.mjs` per `research.md`'s Sitemap decision — FR-019 — `site` set to a placeholder production domain (`https://florapastel.com`) pending the real domain
- [x] T002 [P] Create `public/robots.txt` referencing the generated sitemap — FR-020

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Business Profile data, the Custom Cakes content schema, and the site-wide nav/footer/SEO chrome every page depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Define the Business Profile in `src/content/business.ts` per `contracts/business-profile-contract.md`, transcribed from `cliente/datos.md`
- [ ] T004 Add the `customCakes` Content Collection schema (Zod) to `src/content.config.ts` per `contracts/custom-cake-content-schema.md`
- [ ] T005 [P] Create `SiteNav.astro` (links to Home, Catálogo, Personalizados, Contacto) in `src/components/site/SiteNav.astro` — FR-001, FR-003
- [ ] T006 [P] Create `SiteFooter.astro` (business name, quick links to all four pages, social links, WhatsApp shortcut) in `src/components/site/SiteFooter.astro` — FR-002 (depends on T003)
- [ ] T007 [P] Create `src/utils/seo.ts` (LocalBusiness JSON-LD builder, absolute OG-image URL helper) — FR-018 (depends on T003)
- [ ] T008 [P] Create `Seo.astro` (title/description/canonical/OG tags + LocalBusiness JSON-LD) in `src/components/site/Seo.astro` per `contracts/seo-metadata-contract.md` — FR-016, FR-017, FR-018 (depends on T007)
- [ ] T009 Retrofit `src/layouts/BaseLayout.astro` to mount `SiteNav`/`SiteFooter`/`Seo` in place of the current inline header/footer stub, extending its props (`ogImage`, `path`) per the SEO contract — FR-001, FR-002 (depends on T005, T006, T008); this also brings the site-wide nav/footer to the existing `/catalogo` page with no catalog-specific changes

**Checkpoint**: Business data, content schema, and site-wide chrome are in place. User story implementation can now begin.

---

## Phase 3: User Story 1 - Discover the brand and order a signature cake via WhatsApp (Priority: P1) 🎯 MVP

**Goal**: A visitor lands on the Home page, experiences the brand, and can reach a WhatsApp conversation or browse into the catalog/custom-cakes offerings.

**Independent Test**: Open `/` on a mobile viewport, confirm a hero section and a primary WhatsApp CTA are visible without scrolling, confirm links into `/catalogo` and `/pasteles-personalizados` are present, and confirm the WhatsApp CTA opens a pre-filled conversation — per `quickstart.md`'s US1 walkthrough.

### Tests for User Story 1

- [ ] T010 [P] [US1] Write the E2E test for the Home hero, WhatsApp CTA, and offerings links in `tests/e2e/home.spec.ts`, per `quickstart.md`'s US1 walkthrough — must fail before implementation

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create `Hero.astro` (hero section + primary WhatsApp CTA) in `src/components/home/Hero.astro` — FR-004 (depends on T003)
- [ ] T012 [P] [US1] Create `BrandStory.astro` (brand story / value proposition) in `src/components/home/BrandStory.astro` — FR-006 (depends on T003)
- [ ] T013 [P] [US1] Create `OfferingsIntro.astro` (introduces and links to `/catalogo` and `/pasteles-personalizados`) in `src/components/home/OfferingsIntro.astro` — FR-005
- [ ] T014 [US1] Rebuild `src/pages/index.astro` as the real Home page, composing `Hero`, `BrandStory`, and `OfferingsIntro` through `BaseLayout` (replacing the current ad-hoc catalog-link placeholder) — FR-004, FR-005, FR-006 (depends on T009, T011, T012, T013)

**Checkpoint**: User Story 1 is fully functional and testable independently — the Home page communicates the brand and drives visitors to WhatsApp or into the rest of the site.

---

## Phase 4: User Story 2 - Request a custom cake for a celebration or corporate event (Priority: P2)

**Goal**: A visitor browses past custom cake work and starts a WhatsApp conversation describing their request.

**Independent Test**: Navigate directly to `/pasteles-personalizados`, confirm a gallery of past custom work renders with photo/title/description/tag per item, and confirm an item's WhatsApp CTA opens a conversation that identifies the request context — per `quickstart.md`'s US2 walkthrough.

### Tests for User Story 2

- [ ] T015 [P] [US2] Write the E2E test for the gallery and its WhatsApp CTA in `tests/e2e/custom-cakes.spec.ts`, per `quickstart.md`'s US2 walkthrough — must fail before implementation

### Implementation for User Story 2

- [ ] T016 [P] [US2] Add a Custom-Cakes-context message template to `src/utils/whatsapp.ts` (extends the existing `buildWhatsAppLink` pattern from spec 002) — FR-009, FR-012
- [ ] T017 [P] [US2] Create `GalleryItem.astro` (photo, title, description, tags, WhatsApp CTA) in `src/components/gallery/GalleryItem.astro` — FR-008, FR-009 (depends on T016)
- [ ] T018 [US2] Create `GalleryGrid.astro` (renders every `customCakes` entry via `GalleryItem`) in `src/components/gallery/GalleryGrid.astro` — FR-008 (depends on T017)
- [ ] T019 [P] [US2] Author initial Custom Cake gallery entries in `src/content/custom-cakes/` per `contracts/custom-cake-content-schema.md` (depends on T004)
- [ ] T020 [US2] Create `src/pages/pasteles-personalizados/index.astro`, composing `GalleryGrid` through `BaseLayout` — FR-008, FR-027 (depends on T009, T018, T019)

**Checkpoint**: User Stories 1 AND 2 both work independently — the site communicates the brand and lets visitors browse and request custom work.

---

## Phase 5: User Story 3 - Find business information and location before ordering or visiting (Priority: P3)

**Goal**: A visitor confirms the business's legitimacy and logistics — address, map, hours, phone, social links — before ordering or visiting.

**Independent Test**: Navigate directly to `/contacto` and locate the address, embedded map, hours of operation, phone number, and social links, without needing any other page — per `quickstart.md`'s US3 walkthrough.

### Tests for User Story 3

- [ ] T021 [P] [US3] Write the E2E test for Contact info, map, and social links in `tests/e2e/contact.spec.ts`, per `quickstart.md`'s US3 walkthrough — must fail before implementation

### Implementation for User Story 3

- [ ] T022 [P] [US3] Create `BusinessInfo.astro` (address, phone, hours) in `src/components/contact/BusinessInfo.astro` — FR-013 (depends on T003)
- [ ] T023 [P] [US3] Create `MapEmbed.astro` (Google Maps iframe with an always-visible text address + directions fallback link, per `research.md`'s Maps decision) in `src/components/contact/MapEmbed.astro` — FR-014 (depends on T003)
- [ ] T024 [P] [US3] Create `SocialLinks.astro` in `src/components/contact/SocialLinks.astro` — FR-015 (depends on T003)
- [ ] T025 [US3] Create `src/pages/contacto/index.astro`, composing `BusinessInfo`, `MapEmbed`, and `SocialLinks` through `BaseLayout` — FR-013, FR-014, FR-015 (depends on T009, T022, T023, T024)

**Checkpoint**: All three user stories are independently functional — the site communicates the brand, showcases custom work, and provides trustworthy contact/location information.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and quality gates that span all three user stories and the site-wide chrome

- [ ] T026 [P] Create the custom 404 page in `src/pages/404.astro` (link back to Home and a WhatsApp/contact path) — FR-021
- [ ] T027 [P] Write the E2E test confirming `SiteNav`/`SiteFooter` render identically on `/`, `/catalogo`, `/pasteles-personalizados`, and `/contacto` in `tests/e2e/site-chrome.spec.ts` — FR-001, FR-002, FR-003
- [ ] T028 [P] Write the E2E test for the 404 page in `tests/e2e/not-found.spec.ts` — FR-021
- [ ] T029 [P] Add `javaScriptEnabled: false` variants to `home.spec.ts`, `custom-cakes.spec.ts`, `contact.spec.ts`, and `site-chrome.spec.ts`, asserting all business-critical content remains visible — FR-024
- [ ] T030 [P] Run `@axe-core/playwright` against `/`, `/pasteles-personalizados`, and `/contacto` and fix any WCAG AA violations found
- [ ] T031 [P] Run Lighthouse (mobile + desktop) against `/`, `/catalogo`, `/pasteles-personalizados`, and `/contacto`, and tune until Performance/Accessibility/Best Practices/SEO are each ≥ 90 — SC-002, SC-003
- [ ] T032 Reconcile `src/content/business.ts` against `cliente/datos.md` line by line — FR-013, FR-015
- [ ] T033 [P] Verify `sitemap-index.xml` lists all four pages and `robots.txt` references it — FR-019, FR-020
- [ ] T034 [P] Validate the `LocalBusiness` JSON-LD on each page against schema.org — FR-018
- [ ] T035 Run the full `quickstart.md` validation walkthrough end-to-end and record the results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 has no dependency on US2/US3
  - US2 and US3 both only depend on Foundational (T003, T004, T009) — independently testable once integrated
  - Recommended order given priorities: P1 → P2 → P3
- **Polish (Phase 6)**: Depends on all three user stories being complete (site-chrome and 404 checks need every page to exist)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependency on other stories
- **User Story 2 (P2)**: Can start after Foundational — independently testable (a gallery page with no site-wide chrome changes still satisfies US2's acceptance scenarios)
- **User Story 3 (P3)**: Can start after Foundational — independently testable (Contact page is self-contained)

### Within Each User Story

- Tests are written first and must fail before implementation begins
- Components before page/integration wiring
- Story complete and independently checkpointed before moving to the next priority

### Parallel Opportunities

- T001, T002 (Setup) can run in parallel
- Within Foundational, T003, T005, T006, T007 can run in parallel; T008 depends on T007; T009 depends on T005/T006/T008
- Once Foundational completes, US1, US2, and US3 test-writing tasks (T010, T015, T021) can all be written in parallel
- Within each story, [P]-marked component tasks (e.g., T011/T012; T017 before T018; T022/T023/T024) can run in parallel
- Polish tasks T026-T031, T033, T034 can run in parallel; T032 and T035 are sequential verification passes

---

## Parallel Example: Foundational Phase

```bash
# After T003 (Business Profile) is done, build the shared chrome in parallel:
Task: "Create SiteNav.astro in src/components/site/SiteNav.astro"
Task: "Create SiteFooter.astro in src/components/site/SiteFooter.astro"
Task: "Create src/utils/seo.ts"
```

## Parallel Example: User Story 3

```bash
# Launch all three Contact components together (independent files):
Task: "Create BusinessInfo.astro in src/components/contact/BusinessInfo.astro"
Task: "Create MapEmbed.astro in src/components/contact/MapEmbed.astro"
Task: "Create SocialLinks.astro in src/components/contact/SocialLinks.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories; includes Business Profile data and site-wide chrome)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run T010 and the US1 section of `quickstart.md` independently
5. Deploy/demo if ready — a Home page with brand presentation and a working WhatsApp CTA is already a usable MVP, and `/catalogo` now has real site navigation too

### Incremental Delivery

1. Setup + Foundational → Foundation ready (business data, nav/footer/SEO chrome in place, `/catalogo` gets real navigation)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (custom cake requests now possible)
4. Add User Story 3 → Test independently → Deploy/Demo (address/map/hours now discoverable)
5. Polish → 404 page, cross-page chrome consistency, accessibility, performance, SEO, and no-JS verification pass

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests are included per `plan.md`/`quickstart.md`; write and confirm they fail before implementing each story
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- T009 (BaseLayout retrofit) touches the existing `/catalogo` page's chrome — re-run spec 002's `tests/e2e/*.spec.ts` suite after T009 to confirm no regression
- The Signature Cakes page from the original spec is intentionally not built — see `research.md`'s Signature Cakes decision; `/catalogo` (spec 002) already fulfills it
