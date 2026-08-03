# SV Lab site — person-first, terminal-grade repositioning

Date: 2026-07-28
Status: approved, shipped (owner: Siarhei Sheleh)

> **Superseded on 2026-08-03 — display name.** This document records the
> original decision to display `Sergey Sheleg` and keep `Siarhei Sheleh` as the
> alternate. That call was reversed: the site now displays the registered form
> `Siarhei Sheleh` everywhere, and `Sergey Sheleg` survives only in schema.org
> `alternateName`. Everything else below still holds. Left unedited as the
> record of what was decided at the time.

## Problem

The site sells a *mode* ("solo AI product lab", "MODE: Solo operator", "one
operator") instead of a *person*. "Solo" reads as capacity-limited to the exact
B2B buyers the consulting pages target, and it buries the actual asset: a named
operator with 13 years of shipped products who is still hands-on in the code.

Visually the site is generic dark-SaaS — gradient mesh, glass cards, cyan/lime
sheen — with monospace used only as decoration. It does not read as built by
someone who writes code.

## Goals

1. **Person first.** `Sergey Sheleg` is the subject; `SV Lab` is the container
   — the name of what he ships, not the actor.
2. **Hands-on, not solo.** Every "solo/one-person" phrasing is replaced with
   hands-on/accountable-operator phrasing. Nothing claims a team that does not
   exist; nothing advertises a capacity ceiling either.
3. **Terminal-grade, not cosplay.** Monospace becomes structural (prompt line,
   ledger, labels, section indices), gradients recede to one accent, layout
   gets denser and more tabular.
4. **Open-source skills are the newest headline.** `sshlg-skills` ships first
   on the page, above the products.
5. No regression in SEO/structured data, accessibility, or build health.

## Non-goals

- No CMS, no framework change, no new dependencies.
- No new top-level routes. `/skills` stays an on-page section (`/#skills`);
  a dedicated route is a later content decision, not part of this change.
- Consulting page structure is unchanged — copy and naming only.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Identity model | Person primary, lab as container | Owner's call; matches how the work is actually sold |
| Display name | `Sergey Sheleg` | Owner's call. `Siarhei Sheleh` stays as `alternateName` + legal entity |
| Aesthetic | Terminal-first, strict | Coder-credible without hurting B2B trust |
| Header | Personal shield + status LED | Name and availability are the two facts worth top-of-page pixels |
| Status LED | `AVAILABLE` (no date) | Drives consulting leads, never goes stale |
| Shipped work | One ledger, two tiers | Featured cards for what is live now; one table for all 11 |

### Name handling

- Displayed everywhere: **Sergey Sheleg**.
- `site.founder = "Sergey Sheleg"`, `site.founderAlternate = "Siarhei Sheleh"`.
- `site.legal.entity` keeps the registered form `SV Lab — Siarhei Sheleh
  (Sergey Sheleg)` — the legal entity is a fact and must not be renamed.
- `schema.org`: `Person.name = "Sergey Sheleg"`,
  `Person.alternateName = "Siarhei Sheleh"` so search resolves both spellings.
- Mailto templates greet "Hi Sergey".

### Privacy correction (in scope)

Commit `2ba4263` removed street address / NIP / VAT from the public footer, but
the same values are still published in:

- `BaseLayout.astro` → `Organization.address`, `taxID`, `vatID` (JSON-LD)
- `about.astro` → `Person.address` (JSON-LD)
- `consulting.ts` → two FAQ answers quoting NIP and VAT numbers

These are removed for consistency with the stated intent. The FAQ keeps the
trust signal without the identifiers: "registered EU entity in Poland; VAT
details on the invoice." `site.legal` retains the values for internal use only
and nothing renders them.

## Content model

### `site.ts`

```ts
export const site = {
  name: "SV Lab",
  founder: "Sergey Sheleg",
  founderAlternate: "Siarhei Sheleh",
  role: "Product entrepreneur · hands-on builder",
  tagline: "Products shipped end to end from Warsaw.",
  description: "Sergey Sheleg — product entrepreneur in Warsaw, Poland. 13 years
    turning ideas into shipped products across mobile, desktop, and web. SV Lab
    is where he ships them: three live AI products and an open-source skill
    family for coding agents.",
  yearsExperience: 13,     // since 2013
  availability: "AVAILABLE",
  skills: { name, repo, install, count },
  ...
}
```

`yearsExperience` is derived-safe: `new Date().getFullYear() - 2013` is NOT
used, because a build-time date makes output non-reproducible. It is a literal,
reviewed yearly.

### `projects.ts`

`sshlg-skills` is added as the first entry, `accent: "amber"` (new accent added
to the union and to `ProjectCard`/global tokens):

- name: `sshlg-skills`, domain `github.com/ssheleg/sshlg-skills`
- category: `Open source · agent skills`
- tagline: "The product playbook, installed into your coding agent."
- highlights: four skills (super-ux, task-pipeline, make-skill, sheleg-design);
  installs across Claude Code, Cursor, Codex, OpenCode, Gemini CLI, Windsurf,
  Zed and more; MIT.

### `ledger.ts` (new)

Single ordered view over `projects` + `trackRecord`:

```ts
export type LedgerEntry = {
  slug, name, domain?, url?, yearStart, yearEnd, role, blurb,
  tags: string[], featured: boolean, kind: "product" | "track",
};
export const ledger: LedgerEntry[];   // newest first, featured flagged
export const ledgerStats: { total, live, years };
```

Counts shown on the page are computed from this array — never hardcoded — so
adding an entry can't desync the copy.

## Components

| File | Change |
|---|---|
| `Logo.astro` | Becomes the personal shield: mark + `Sergey Sheleg` + mono meta `SV LAB · WARSAW, PL`. `variant="compact"` for the footer. |
| `Nav.astro` | 4 links (Skills / Work / Consulting / About), status LED, email CTA. Mobile: shield + LED + `EMAIL →`. |
| `Hero.astro` | Terminal prompt line, `Sergey Sheleg` as H1, lede, thesis line, `ls ./work` + email CTAs, 4-cell stat strip driven by ledger stats. |
| `Skills.astro` (new) | `id="skills"`. Anti-slop thesis, the four skills, copy-ready install command, repo link. |
| `Work.astro` (new) | Replaces `Projects.astro` + `TrackRecord.astro`. Featured product cards (`id="products"` preserved) + full ledger table (`id="track-record"` preserved). |
| `About.astro` | Retitled `// OPERATOR`; hands-on copy; stats from ledger; links to `/about`. |
| `Capabilities.astro` | Copy pass only — no "one operator" framing. |
| `Contact.astro`, `Footer.astro` | Name, greeting, tagline. |
| `AboutPage.astro`, `about.astro` | Person-first hero, 13-year bio, skills paragraph, schema fix. |
| `BaseLayout.astro` | `Person` becomes a first-class schema alongside `Organization`; address/taxID/vatID dropped. |
| `global.css` | `--color-amber`; `.term-line`, `.rule` (ASCII divider), `.section-index`; gradient text limited to one use per page. |
| `build-og.mjs` | Person-first `og.png` and `og-about.png` copy; new `og-skills.png`. |

Anchors `#products` and `#track-record` are preserved so existing inbound and
cross-page links keep resolving.

## Verification

`scripts/check-site.mjs` (new, zero-dep, runs over `dist/` after build, wired
into `npm run build` so CI fails on regression):

1. Every expected page exists in `dist/`.
2. Forbidden strings absent from all HTML: `Solo operator`, `solo AI`,
   `solo studio`, `12+ years`, `Twelve years`, the street address, the NIP, the
   VAT id.
3. Required strings present: `Sergey Sheleg` on every page; `sshlg-skills` and
   `13` (years) on the home page.
4. Every internal `href` (`/...` and `#...`) resolves to an existing page or an
   `id` on the referenced page.
5. Every `application/ld+json` block parses and, per page, contains a `Person`
   with `name: "Sergey Sheleg"`.
6. Exactly one `<h1>` per page.

Failures print `file → reason` and exit non-zero.

## Rollout

Static site, GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.
Definition of done: `npm run build` green (astro check + build + check-site),
visual pass at 1280 and 390 wide, commit, push, deploy run green, live URL
spot-checked.

## Risks

- **Terminal aesthetic vs. B2B trust.** Mitigated: mono is structural, not
  themed; no scanlines, no CRT, no green-on-black. Consulting pages keep their
  current, calmer layout.
- **`yearsExperience` drift.** Literal in `site.ts` with a comment; the
  check-site test asserts the home page and `/about` agree on the number.
- **Anchor breakage.** Mitigated by preserving both legacy ids and by the
  link-resolution check.
