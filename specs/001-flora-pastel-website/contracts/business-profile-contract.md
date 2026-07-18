# Contract: Business Profile

The interface between the business's real-world information (`cliente/datos.md`) and every page that displays it (footer, Contact page, structured data, WhatsApp CTAs).

## Shape (`src/content/business.ts`)

```ts
export interface BusinessProfile {
  name: string;
  tagline: string;
  story: string;
  whatsappNumber: string; // e.g. "523319027014" — same format as spec 002's buildWhatsAppLink
  phone: string; // display-formatted, e.g. "33 1902 7014"
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    countryCode: string; // ISO 3166-1 alpha-2, e.g. "MX" — for schema.org addressCountry
  };
  fullAddress: string; // derived once from `address`, so every consumer renders identical text
  hours: { days: string; time: string; opens: string; closes: string }[]; // opens/closes are 24h "HH:MM", for schema.org OpeningHoursSpecification
  mapsEmbedUrl: string;
  mapsDirectionsUrl: string;
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}
```

## Source of truth

Values are transcribed from `cliente/datos.md` (name, hours, contact, address, social) — the same source-of-truth relationship spec 002 established between `cliente/productos.md` and `src/content/products/`. A reconciliation pass (mirroring spec 002's `T032`) confirms the transcription is accurate before the feature is considered done.

## Guarantees this contract makes to consumers

- Every page importing `business` gets the exact same values — the WhatsApp number used by the Home hero CTA, the Contact page, and the footer can never drift out of sync with each other, since all read from this one object (Constitution III: no duplicated business logic).
- `mapsDirectionsUrl` is always present, independent of `mapsEmbedUrl`'s runtime success — `MapEmbed.astro` can render the fallback link unconditionally rather than only on an `onerror` handler (which would require JavaScript and violate FR-024).

## Non-goals

- This is not a CMS-editable entity — updating business info means editing `src/content/business.ts` and redeploying, consistent with the site's fully-static, no-backend scope.
