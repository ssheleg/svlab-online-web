export type TrackItem = {
  slug: string;
  name: string;
  domain?: string;
  url?: string;
  yearStart: number;
  yearEnd: number | "present";
  role: string;
  blurb: string;
  tags: string[];
};

export const trackRecord: TrackItem[] = [
  {
    slug: "degenphone",
    name: "Degenphone",
    domain: "degenphone.xyz",
    url: "https://degenphone.xyz",
    yearStart: 2025,
    yearEnd: "present",
    role: "Founder · build · GTM",
    blurb: "NFT-backed eSIM phone numbers for Web3 users.",
    tags: ["web3", "esim"],
  },
  {
    slug: "hyperlancer",
    name: "HyperLancer",
    domain: "hyperlancer.ai",
    url: "https://hyperlancer.ai",
    yearStart: 2025,
    yearEnd: "present",
    role: "Founder · product · GTM",
    blurb: "Freelance marketplace for Human + AI agent collaboration.",
    tags: ["marketplace", "ai-agents"],
  },
  {
    slug: "genie-ai",
    name: "Genie AI",
    domain: "genie-ai.xyz",
    url: "https://genie-ai.xyz",
    yearStart: 2023,
    yearEnd: "present",
    role: "Founder · product · ops",
    blurb: "AI assistant for everyday challenges with smart, intuitive solutions.",
    tags: ["consumer-ai"],
  },
  {
    slug: "nicegram",
    name: "Nicegram",
    domain: "nicegram.app",
    url: "https://nicegram.app",
    yearStart: 2021,
    yearEnd: "present",
    role: "Co-creator · growth",
    blurb: "Privacy-first Telegram client with superior UX.",
    tags: ["messaging", "privacy"],
  },
  {
    slug: "whatplantisthis",
    name: "WhatPlantIsThis",
    domain: "whatplantisthis.io",
    url: "https://whatplantisthis.io",
    yearStart: 2021,
    yearEnd: 2025,
    role: "Founder · product",
    blurb: "Botany meets ML — visual plant identification for enthusiasts.",
    tags: ["computer-vision", "consumer"],
  },
  {
    slug: "esimplus",
    name: "ESIMPlus",
    domain: "esimplus.me",
    url: "https://esimplus.me",
    yearStart: 2020,
    yearEnd: "present",
    role: "Co-founder · product",
    blurb: "Global mobile connectivity for travelers.",
    tags: ["esim", "travel"],
  },
  {
    slug: "ultimate-guitar",
    name: "Ultimate Guitar",
    domain: "ultimate-guitar.com",
    url: "https://ultimate-guitar.com",
    yearStart: 2015,
    yearEnd: 2020,
    role: "Product · growth",
    blurb: "Revolutionized how musicians access guitar chords and tabs online.",
    tags: ["consumer", "music"],
  },
  {
    slug: "product-developer",
    name: "Product Developer",
    yearStart: 2013,
    yearEnd: 2015,
    role: "Product developer",
    blurb: "Built products for industry players in tech, agro, AI, and hardware.",
    tags: ["agency", "0-to-1"],
  },
];

export function formatTrackYears(t: TrackItem): string {
  if (t.yearEnd === "present") return `${t.yearStart} → Present`;
  if (t.yearStart === t.yearEnd) return `${t.yearStart}`;
  return `${t.yearStart} → ${t.yearEnd}`;
}
