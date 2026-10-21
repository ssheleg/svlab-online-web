// Post-build verification of dist/. Zero dependencies, runs as part of
// `npm run build` so CI fails on a regression instead of shipping one.
//
// Checks:
//   1. every expected page was emitted
//   2. retired positioning and private identifiers are absent from the HTML
//   3. required identity strings are present
//   4. every internal link resolves to a real page and a real anchor
//   5. every JSON-LD block parses, and each page carries a Person schema
//   6. exactly one <h1> per page
//   7. the Aptabase client ships with a real App Key, not the placeholder
//   8. the home OG image's "N PRODUCTS · M STILL LIVE" label matches the counts
//      the home page renders (the PNG is generated before the build, so it
//      cannot read the data; this keeps its literal honest)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative, sep } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

const NAME = "Siarhei Sheleh";
// Previously published spelling. Allowed only inside JSON-LD (`alternateName`,
// so the old spelling still resolves in search) — never in rendered copy.
const SCHEMA_ONLY_NAME = "Sergey Sheleg";

const EXPECTED_PAGES = [
  "/",
  "/about",
  "/consulting",
  "/consulting/ai-advisory",
  "/consulting/ai-transformation",
  "/consulting/forward-deployment",
];

// Retired positioning, stale numbers, and identifiers the site deliberately
// does not publish (see `site.legal` — kept for invoicing, never rendered).
const FORBIDDEN = [
  "Solo operator",
  "solo operator",
  "solo AI",
  "Solo AI",
  "solo studio",
  "12+ years",
  "Twelve years",
  "Rajmunda",
  "5223265821",
  // Retired 2026-10-21. CheckMyData is no longer presented anywhere on the
  // site, and these Prowl and PrivateClawd figures were superseded by the
  // products' own pages (sources: docs/handoffs/2026-10-21-facts-refresh.md).
  "CheckMyData",
  "checkmydata",
  "NL-to-SQL",
  "NL → SQL",
  "408 tools",
  "408 market",
  "408 intelligence",
  "448 tools",
  // Retired 2026-10-21: no source for the organic share or for no paid
  // acquisition; Nicegram reports a total (see REQUIRED_HOME).
  "56M+",
  "organic installs",
  "448 market",
  "12-module",
  "$5 starter",
  "60 seconds",
  "60-second",
  "dedicated VM",
  "dedicated, isolated VM",
  "3 iOS products",
];

// Strings that must not survive anywhere a reader can see them — metadata and
// attributes included. Checked against the document with JSON-LD stripped out.
const FORBIDDEN_VISIBLE = [SCHEMA_ONLY_NAME, "Sergey", "sergey"];

const REQUIRED_EVERYWHERE = [NAME];
const REQUIRED_HOME = [
  "sshlg-skills",
  "seo-aeo-audit",
  "agent-sync",
  "13 years",
  "neuroslop",
  "Nicegram",
  "Nicegram Business",
  // Nicegram's own figure (t.me/nicegramapp/973, 2026-06-24), a total. The
  // earlier "56M+ organic installs" had no source for "organic" or for "no
  // paid acquisition", and is forbidden below.
  "61M+",
  "350M+",
  "eSIM Plus",
  // Section spine — the page must read as About me → Open source → products →
  // Track record, in that order (order itself is asserted below).
  "About me",
  "Open source",
  "AI agent products",
  "Track record",
  // Current product facts, re-read from prowl.chat and privateclawd.com on
  // 2026-10-21.
  "444 market-intelligence tools",
  "17 providers",
  "$15 starter credit",
  "private container of its own",
  "Other projects",
];

// Required on /about: the mobile count, owner-stated 2026-10-21.
const REQUIRED_ABOUT = ["20+ mobile apps", "for Android and iOS, and 3 of them were sold"];

// Section labels in the order they must appear on the home page.
const HOME_SECTION_ORDER = [
  "About me",
  "Open source",
  "AI agent products",
  "Track record",
  "Capabilities",
];

const failures = [];
const fail = (where, why) => failures.push(`${where} → ${why}`);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

/** dist/about/index.html → /about ; dist/index.html → / ; dist/404.html → /404 */
function routeOf(file) {
  const rel = relative(distDir, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"/index.html".length)}`;
  return `/${rel.slice(0, -".html".length)}`;
}

let files;
try {
  files = walk(distDir);
} catch {
  console.error(`[check-site] dist/ not found at ${distDir} — build first.`);
  process.exit(1);
}

const pages = new Map(); // route -> { file, html, ids:Set }
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const ids = new Set();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
  pages.set(routeOf(file), { file, html, ids });
}

// 1. expected pages
for (const route of EXPECTED_PAGES) {
  if (!pages.has(route)) fail(route, "page missing from dist/");
}

const visibleText = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");

for (const [route, page] of pages) {
  const { html } = page;
  const text = visibleText(html);

  // 2. forbidden strings — checked against the whole document, including
  // metadata and JSON-LD, since those are published too.
  for (const bad of FORBIDDEN) {
    if (html.includes(bad)) fail(route, `contains forbidden string "${bad}"`);
  }
  // ...and the retired spelling, which survives in JSON-LD only.
  for (const bad of FORBIDDEN_VISIBLE) {
    if (text.includes(bad)) fail(route, `renders retired string "${bad}"`);
  }

  // 3. required strings
  for (const need of REQUIRED_EVERYWHERE) {
    if (!html.includes(need)) fail(route, `missing required string "${need}"`);
  }
  if (route === "/about") {
    for (const need of REQUIRED_ABOUT) {
      if (!html.includes(need)) fail(route, `about page missing "${need}"`);
    }
  }
  if (route === "/") {
    for (const need of REQUIRED_HOME) {
      if (!text.includes(need)) fail(route, `home page missing "${need}"`);
    }

    // 8. the home OG label against the rendered hero strip.
    const shipped = text.match(/\/\/ SHIPPED<\/[^>]+>\s*<[^>]+>(\d+) products</);
    const live = text.match(/\/\/ LIVE<\/[^>]+>\s*<[^>]+>(\d+) running</);
    const ogSrc = readFileSync(resolve(__dirname, "build-og.mjs"), "utf8");
    const og = ogSrc.match(/"(\d+) PRODUCTS · (\d+) STILL LIVE"/);
    if (!shipped || !live) {
      fail(route, "hero strip SHIPPED/LIVE values not found");
    } else if (!og) {
      fail("scripts/build-og.mjs", 'no "N PRODUCTS · M STILL LIVE" label found');
    } else if (og[1] !== shipped[1] || og[2] !== live[1]) {
      fail(
        "scripts/build-og.mjs",
        `OG label says ${og[1]} products · ${og[2]} live, the page renders ${shipped[1]} · ${live[1]}`,
      );
    }

    // Section spine, in order. Each label must appear after the previous one.
    let cursor = -1;
    for (const label of HOME_SECTION_ORDER) {
      const at = text.indexOf(`>${label}<`, cursor + 1);
      if (at === -1) {
        fail(route, `section label "${label}" missing or out of order`);
        break;
      }
      cursor = at;
    }

    // Section indices must run 01..05 with no gaps or repeats.
    const nums = [...html.matchAll(/<span class="num"[^>]*>(\d+)<\/span>/g)].map(
      (m) => m[1],
    );
    const expected = HOME_SECTION_ORDER.map((_, i) =>
      String(i + 1).padStart(2, "0"),
    );
    if (nums.join(",") !== expected.join(",")) {
      fail(route, `section numbers are [${nums}], expected [${expected}]`);
    }
  }

  // 5. JSON-LD
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];
  if (blocks.length === 0) fail(route, "no JSON-LD blocks");
  let hasPerson = false;
  for (const [, raw] of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      fail(route, `JSON-LD does not parse: ${err.message}`);
      continue;
    }
    if (parsed["@type"] === "Person") {
      hasPerson = true;
      if (parsed.name !== NAME) {
        fail(route, `Person schema name is "${parsed.name}", expected "${NAME}"`);
      }
      // The retired spelling must stay reachable for search, and only here.
      if (parsed.alternateName !== SCHEMA_ONLY_NAME) {
        fail(
          route,
          `Person alternateName is "${parsed.alternateName}", expected "${SCHEMA_ONLY_NAME}"`,
        );
      }
    }
  }
  if (!hasPerson) fail(route, "no Person JSON-LD block");

  // 6. one h1
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) fail(route, `expected exactly 1 <h1>, found ${h1s}`);
}

// 4. internal links
for (const [route, page] of pages) {
  for (const [, href] of page.html.matchAll(/\shref="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;

    const [rawPath, anchor] = href.split("#");
    let targetRoute = rawPath === "" ? route : rawPath;
    if (targetRoute.length > 1 && targetRoute.endsWith("/")) {
      targetRoute = targetRoute.slice(0, -1);
    }
    if (!targetRoute.startsWith("/")) continue; // relative assets, skip

    const target = pages.get(targetRoute);
    const isAsset = /\.[a-z0-9]{2,4}$/i.test(targetRoute);
    if (!target) {
      if (!isAsset) fail(route, `link "${href}" points to a missing page`);
      continue;
    }
    if (anchor && !target.ids.has(anchor)) {
      fail(route, `link "${href}" points to a missing anchor #${anchor}`);
    }
  }
}

// 7. analytics. The client is bundled into dist/ (inline or as an asset); it
// must carry an App Key in Aptabase's format and never the un-injected
// placeholder, which would silently send nothing. The key is never printed.
{
  const shipped = [];
  const collect = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) collect(full);
      else if (/\.(html|js|mjs)$/.test(entry)) shipped.push(readFileSync(full, "utf8"));
    }
  };
  collect(distDir);
  const all = shipped.join("\n");
  if (!all.includes("https://analytics.sshlg.me")) {
    fail("dist", "Aptabase client is not bundled (no analytics.sshlg.me)");
  }
  if (all.includes("__APTABASE_APP_KEY__")) {
    fail("dist", "Aptabase App Key placeholder was not replaced — run the injection (docs/analytics.md)");
  } else if (!/["']A-[A-Z]{2}-\d{10}["']/.test(all)) {
    fail("dist", "no Aptabase App Key in the expected format");
  }
}

if (failures.length) {
  console.error(`[check-site] ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log(
  `[check-site] ok — ${pages.size} pages, ${EXPECTED_PAGES.length} required routes present`,
);
