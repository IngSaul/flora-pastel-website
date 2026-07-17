import { business } from "../content/business";

const DAY_NAME_MAP: Record<string, string[]> = {
  "Lunes a sábado": [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  "Domingos y días festivos": ["Sunday"],
};

export function buildAbsoluteUrl(
  siteUrl: string | URL | undefined,
  path: string,
): string {
  return new URL(path, siteUrl).toString();
}

export function buildLocalBusinessJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: business.name,
    description: business.tagline,
    telephone: business.phone,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: business.hours.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_NAME_MAP[entry.days] ?? [],
      description: entry.time,
    })),
    sameAs: [
      business.social.facebook,
      business.social.instagram,
      business.social.tiktok,
    ],
  };
}
