export const site = {
  name: "SV Lab",
  legalName: "SV Lab — Siarhei Sheleh",
  // Displayed everywhere: the registered form, matching the sole proprietorship.
  // `founderAlternate` is the previously published transliteration and lives
  // only in schema.org `alternateName` so the old spelling still resolves in
  // search — it is deliberately absent from visible copy.
  founder: "Siarhei Sheleh",
  founderAlternate: "Sergey Sheleg",
  role: "Technical entrepreneur · products used by millions",
  tagline: "Products shipped end to end from Warsaw.",
  description:
    "Siarhei Sheleh — technical entrepreneur in Warsaw, Poland. 13 years building and launching products used by millions: AI integrations and agent systems, marketing and research tooling, growth and retention mechanics, and the go-to-market that puts them in front of users.",
  // The expertise strip under the hero lede. Order is deliberate: what he
  // builds, what he builds it with, and how it reaches users.
  expertise: [
    "Product engineering",
    "AI integrations",
    "Agent systems",
    "Marketing & research tools",
    "Growth & retention",
    "Go-to-market",
  ],
  // Both literals, not derived from the build date: a build-time
  // `getFullYear()` makes the output non-reproducible. Review together yearly.
  shippingSince: 2013,
  yearsExperience: 13,
  // Mobile apps built across the whole career, Android and iOS, employment
  // included, and how many of them were sold. Owner-stated 2026-10-21 ("20+
  // mobile apps, Android and iOS, and 3 sold"), replacing "3 iOS products built
  // and sold" on sshlg.me the same day. Self-reported: no public list backs the
  // floor, so it prints as a floor ("20+"), never as an exact count. The sold
  // apps are not rows in this site's ledger, so the 3 is a literal here.
  // Source row: sshlg-me docs/brand/facts.md § Person, "Mobile apps built".
  mobileAppsBuilt: "20+",
  mobileAppsSold: 3,
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
    entity: "SV Lab — Siarhei Sheleh",
    streetAddress: "Rajmunda 35",
    postalCode: "03-606",
    city: "Warsaw",
    country: "Poland",
    countryCode: "PL",
    nip: "5223265821",
    vat: "PL5223265821",
  },
} as const;
