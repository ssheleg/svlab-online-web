# Handoff: facts refresh, 2026-10-21

Branch `refresh-1021`, merged into `main` through the pull request that adds
this file.

## Objective

Bring svlab.online in line with the product facts re-verified on sshlg.me the
same day, without changing what svlab.online is: the business card of the
Polish sole proprietorship (registered name Siarhei Sheleh), its consulting
front door and `contact@svlab.online`. No sshlg.me-only content, chat widget or
personal voice was ported, and no company identifier was added.

## Done

- CheckMyData is no longer presented anywhere: removed from `projects.ts` (and
  with it the home card, the track-record row, the `SoftwareApplication`
  JSON-LD entry, the footer link and the Organization `sameAs` URL), from the
  consulting proofs (`consulting.ts`), the About bio, the capabilities tile
  ("NL-to-SQL interfaces") and the marquee ("NL → SQL"), and from the README.
- Prowl and PrivateClawd copy rewritten from the products' own pages (table
  below).
- Mobile count added to the About bio: 20+ mobile apps for Android and iOS, 3
  of them sold (`site.mobileAppsBuilt`, `site.mobileAppsSold`). svlab.online
  never printed "3 iOS products built and sold" or "Head of Android", so there
  was no old line to replace and no role was added.
- Each product now appears once on the home page. The track-record list renders
  `otherLedger` (ledger rows with no card above it: the agent products, the
  `sshlg-skills` card and the two Nicegram platform cards) under the heading
  "Other projects, in order." The section label stays "Track record", which the
  section spine check requires. The counts in that paragraph still cover the
  whole ledger.
- Counts that were literals now derive from data: "N agent products" on the
  home page, the consulting landings and the consulting hub
  (`agentProducts.length`), "prior shipped" on the hub (`trackRecord.length`,
  was "11+"), years on the hub and the landings (`site.yearsExperience`, was
  "12+" and "12-year"). The products grid sizes its columns to the number of
  cards.
- The home OG image label went from "12 PRODUCTS · 9 STILL LIVE" (wrong before
  this change: the page rendered 11 and 7) to "10 PRODUCTS · 6 STILL LIVE".
  `build-og.mjs` runs before the build and cannot import the TypeScript data,
  so `check-site.mjs` now fails the build when that label differs from the hero
  strip the home page renders.
- `check-site.mjs` FORBIDDEN gained the retired strings (`CheckMyData`,
  `checkmydata`, `NL-to-SQL`, `NL → SQL`, `408 tools`, `448 tools` and their
  variants, `12-module`, `$5 starter`, `60 seconds`, `60-second`,
  `dedicated VM`, `3 iOS products`); REQUIRED_HOME gained the current Prowl and
  PrivateClawd strings and "Other projects"; a new REQUIRED_ABOUT holds the
  mobile count.

## Facts and their sources

| Fact | Value on the site | Source | Checked |
|---|---|---|---|
| Prowl tools | 444 market-intelligence tools behind one MCP endpoint | `curl https://prowl.chat`: "444 market data tools across 17 providers". sshlg.me `docs/brand/facts.md` row "Prowl tools" (448 until 2026-10-21) | 2026-10-21 |
| Prowl providers | 17 | prowl.chat: "17 Data providers" | 2026-10-21 |
| Prowl modules | 33 in the catalogue, up to 16 in one report | prowl.chat: "33 modules in the catalogue", "Up to 16 intelligence modules per report" | 2026-10-21 |
| Prowl deep report | about $17 in credits | prowl.chat: "Typical report cost: basic ≈ $12, deep ≈ $17, max ≈ $34 in credits" | 2026-10-21 |
| Prowl starter credit | $15 | prowl.chat: "$15 starter credit, no card required" | 2026-10-21 |
| Prowl key controls | per-key scopes, spend limits, IP allowlists | prowl.chat API key form: "Advanced scopes", "Daily spend limit (USD)", "IP allowlist" | 2026-10-21 |
| PrivateClawd positioning | Managed hosting for an OpenClaw agent, in a private container of its own | `curl https://privateclawd.com`: "Managed hosting for your OpenClaw agent, a private container of its own, always on, no VPS and no Docker" | 2026-10-21 |
| PrivateClawd deploy | Deploy in minutes, with no terminal, VPS or Docker | privateclawd.com: "Deploy OpenClaw agents in minutes, no terminal required" | 2026-10-21 |
| PrivateClawd features | browser automation, code execution, Telegram, WhatsApp, Discord, Slack, web; token caps, loop detection, auto-pause; prompt-injection and link-preview exfiltration defense | privateclawd.com, all named on the page | 2026-10-21 |
| Mobile apps built | 20+ for Android and iOS, 3 sold | Owner-stated 2026-10-21; sshlg.me `docs/brand/facts.md` § Person, row "Mobile apps built". Self-reported, printed as a floor | 2026-10-21 |
| Products shipped, live | 10, 6 | Derived: `ledgerStats.total`, `ledgerStats.live` in `src/data/ledger.ts`, read from the built `dist/index.html` | 2026-10-21 |

Re-read prowl.chat and privateclawd.com before quoting any of these again: the
Prowl figures moved twice between August and October 2026.

## Checks run

- `npm ci && npm run build` (tests, `astro check`, build, `check-site.mjs`):
  green, "7 pages, 6 required routes present".
- The OG label check went red on its first run ("OG label says 12 products · 9
  live, the page renders 10 · 6"), then green after the label was corrected.
- Planted defect: the Prowl tagline changed to "448 tools behind one MCP
  endpoint." gave 6 failures (forbidden "448 tools" on five pages, required
  "444 market-intelligence tools" missing on `/`); restored, green.
- `git diff` added lines contain no U+2014, no spaced hyphen used as a dash and
  none of the words banned in `sshlg-home/brand/terminology.md`.

## Open

- `consulting.ts` proofs for AI advisory list track-record slugs
  `hyperlancer` and `genie-ai`, which no longer exist in `track-record.ts`; the
  helper filters them out silently, so that landing shows one track-record
  proof. Not changed here: choosing replacement proofs is a content decision.
- `docs/superpowers/specs/2026-07-28-person-first-terminal-repositioning-design.md`
  still says "three live AI products". It is a dated design record and was left
  as history.

## Next task

None queued from this change. When either product page changes again, update
`src/data/projects.ts`, the table above and the FORBIDDEN list in one change.
