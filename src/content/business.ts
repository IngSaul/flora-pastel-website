export interface BusinessProfile {
  name: string;
  tagline: string;
  story: string;
  whatsappNumber: string;
  phone: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    countryCode: string;
  };
  fullAddress: string;
  hours: { days: string; time: string; opens: string; closes: string }[];
  mapsEmbedUrl: string;
  mapsDirectionsUrl: string;
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}

const address = {
  street: "Paseo de los Filósofos #1525",
  neighborhood: "Colinas de la Normal",
  city: "Guadalajara",
  state: "Jalisco",
  country: "México",
  countryCode: "MX",
};

const mapsQuery =
  "Paseo de los Filósofos 1525, Colinas de la Normal, Guadalajara, Jalisco";

export const business: BusinessProfile = {
  name: "Flora Pastel",
  tagline:
    "Pastelería artesanal en Guadalajara especializada en cheesecakes, pasteles, postres y gelatinas para celebrar los momentos importantes.",
  // Factual placeholder only — real brand-story copy is business-supplied and still
  // pending per spec 001's Assumptions ("Final content... will be supplied by Flora
  // Pastel and is not authored as part of this specification").
  story:
    "Flora Pastel es una pastelería artesanal ubicada en Guadalajara, Jalisco. Elabora cheesecakes, gelatinas, panqués, pasteles y postres, además de piezas especiales sobre pedido.",
  whatsappNumber: "523319027014",
  phone: "33 1902 7014",
  address,
  fullAddress: `${address.street}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.country}`,
  hours: [
    {
      days: "Lunes a sábado",
      time: "9:00 a.m. – 8:30 p.m.",
      opens: "09:00",
      closes: "20:30",
    },
    {
      days: "Domingos y días festivos",
      time: "10:00 a.m. – 6:00 p.m.",
      opens: "10:00",
      closes: "18:00",
    },
  ],
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`,
  mapsDirectionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
  social: {
    facebook: "https://facebook.com/florapastelgdl",
    instagram: "https://instagram.com/florapastelgdl",
    tiktok: "https://tiktok.com/@florapastelgdl",
  },
};
