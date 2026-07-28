// One ordered view over everything shipped — SV Lab products and the work that
// came before it. The page renders counts from `ledgerStats`, never from
// hardcoded numbers, so adding an entry can't desync the copy.
import { projects } from "./projects";
import { trackRecord } from "./track-record";
import { site } from "./site";

export type LedgerEntry = {
  slug: string;
  name: string;
  domain?: string;
  url?: string;
  yearStart: number;
  yearEnd: number | "present";
  role: string;
  blurb: string;
  tags: string[];
  /** Live SV Lab work, rendered as a detail card above the table. */
  featured: boolean;
};

const fromProjects: LedgerEntry[] = projects.map((p) => ({
  slug: p.slug,
  name: p.name,
  domain: p.domain,
  url: p.url,
  yearStart: p.yearStart,
  yearEnd: p.yearEnd,
  role: "Build · GTM · ops",
  blurb: p.tagline,
  tags: [p.category],
  featured: true,
}));

const fromTrackRecord: LedgerEntry[] = trackRecord.map((t) => ({
  slug: t.slug,
  name: t.name,
  domain: t.domain,
  url: t.url,
  yearStart: t.yearStart,
  yearEnd: t.yearEnd,
  role: t.role,
  blurb: t.blurb,
  tags: t.tags,
  featured: false,
}));

/** Newest first; ties keep products above earlier career work. */
export const ledger: LedgerEntry[] = [...fromProjects, ...fromTrackRecord].sort(
  (a, b) => {
    if (b.yearStart !== a.yearStart) return b.yearStart - a.yearStart;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  },
);

export const featuredLedger: LedgerEntry[] = ledger.filter((e) => e.featured);

export const ledgerStats = {
  total: ledger.length,
  live: ledger.filter((e) => e.yearEnd === "present").length,
  featured: featuredLedger.length,
  years: site.yearsExperience,
};

export function formatLedgerYears(e: LedgerEntry): string {
  if (e.yearEnd === "present") return `${e.yearStart} → now`;
  if (e.yearStart === e.yearEnd) return `${e.yearStart}`;
  return `${e.yearStart} → ${e.yearEnd}`;
}
