export const site = {
  name: "SV Lab",
  legalName: "SV Lab — Siarhei Sheleh",
  // Displayed everywhere. `founderAlternate` is the registered transliteration
  // and stays in schema.org `alternateName` so both spellings resolve in search.
  founder: "Sergey Sheleg",
  founderAlternate: "Siarhei Sheleh",
  role: "Product entrepreneur · hands-on builder",
  tagline: "Products shipped end to end from Warsaw.",
  description:
    "Sergey Sheleg — product entrepreneur in Warsaw, Poland. 13 years turning ideas into shipped products across mobile, desktop, and web. SV Lab is where he ships them: three live AI products and an open-source skill family for coding agents.",
  // Both literals, not derived from the build date: a build-time
  // `getFullYear()` makes the output non-reproducible. Review together yearly.
  shippingSince: 2013,
  yearsExperience: 13,
  // Header status LED. Deliberately date-free so it never goes stale.
  availability: "AVAILABLE",
  availabilityDetail: "Available for consulting",
  url: "https://svlab.online",
  email: "contact@svlab.online",
  location: "Warsaw, Poland",
  country: "PL",
  established: 2024,
  github: "https://github.com/ssheleg",
  skills: {
    name: "sshlg-skills",
    repo: "https://github.com/ssheleg/sshlg-skills",
    install: "npx github:ssheleg/sshlg-skills install",
  },
  social: [] as { label: string; href: string }[],
  // Retained for invoicing and contracts. Nothing renders these — the public
  // site deliberately does not publish the address or tax identifiers.
  legal: {
    entity: "SV Lab — Siarhei Sheleh (Sergey Sheleg)",
    streetAddress: "Rajmunda 35",
    postalCode: "03-606",
    city: "Warsaw",
    country: "Poland",
    countryCode: "PL",
    nip: "5223265821",
    vat: "PL5223265821",
  },
} as const;
