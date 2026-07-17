# Contract: SEO & Structured Data Metadata

The interface between each page and the `<head>` metadata it emits — title, description, Open Graph tags, and `LocalBusiness` structured data (FR-016, FR-017, FR-018).

## Shape (`Seo.astro` props, built on top of `BaseLayout`'s existing `title`/`description` props)

```ts
interface SeoProps {
  title: string; // unique per page (FR-016)
  description: string; // unique per page (FR-016)
  ogImage: string; // absolute URL, per page — used for FR-017's rich preview
  path: string; // canonical path, e.g. "/pasteles-personalizados" — used for canonical + OG url
}
```

`BaseLayout.astro` (already accepting `title`/`description` since spec 002) is extended to accept `ogImage`/`path` and render, in `<head>`:

- `<title>` and `<meta name="description">` (already present)
- `<link rel="canonical">`
- `<meta property="og:title">`, `og:description`, `og:image`, `og:url`, `og:type`
- A `<script type="application/ld+json">` block with `LocalBusiness` schema, sourced from `business.ts` (Business Profile) — emitted once, site-wide, not per-page, since the business entity doesn't change per page

## Guarantees this contract makes to consumers

- Every page (Home, `/catalogo`, Custom Cakes, Contact) passes its own `title`/`description`/`ogImage` — no two pages can accidentally share identical metadata, satisfying FR-016's "unique, descriptive" requirement structurally (the prop is required, not defaulted).
- The `LocalBusiness` JSON-LD is generated once from the Business Profile contract — it cannot drift from the address/phone/hours shown elsewhere on the page, since both read the same `business.ts` object.

## Guarantees this contract requires from page authors

- Every new page added to the site MUST supply `title`, `description`, `ogImage`, and `path` to `BaseLayout` — there is no silent fallback, so an omitted value is a build-time TypeScript error, not a missing-metadata bug discovered later in a social-share preview.

## Non-goals

- No per-page structured data beyond `LocalBusiness` (e.g., no `Product` schema on `/catalogo` — that page's individual product pricing is not what search engines need to surface; the business's identity/location is the priority per FR-018's literal requirement).
