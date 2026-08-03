// Generate per-page Open Graph PNG previews at 1200x630 using @resvg/resvg-js.
// Templated per page: kicker, headline, subline, accent. Idempotent — only
// regenerates when this script is newer than the target PNG (or the PNG is
// missing). Runs as `prebuild`.
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, statSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const scriptPath = resolve(__dirname, "build-og.mjs");

const accents = {
  brand: { glow1: "#22d3ee", glow2: "#a78bfa", glow3: "#a3e635", chip: "#67e8f9" },
  cyan: { glow1: "#22d3ee", glow2: "#67e8f9", glow3: "#a3e635", chip: "#67e8f9" },
  violet: { glow1: "#a78bfa", glow2: "#22d3ee", glow3: "#a3e635", chip: "#c4b5fd" },
  lime: { glow1: "#a3e635", glow2: "#22d3ee", glow3: "#a78bfa", chip: "#bef264" },
};

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderSvg({ kicker, line1, line2, footerLeft, footerRight, accent }) {
  const a = accents[accent] ?? accents.brand;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#070a12"/>
      <stop offset="100%" stop-color="#0b101c"/>
    </linearGradient>
    <radialGradient id="glow1" cx="180" cy="120" r="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${a.glow1}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${a.glow1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="1080" cy="180" r="420" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${a.glow2}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${a.glow2}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow3" cx="700" cy="640" r="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${a.glow3}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${a.glow3}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#c4f1f9"/>
      <stop offset="70%" stop-color="${a.chip}"/>
      <stop offset="100%" stop-color="#a3e635"/>
    </linearGradient>
    <linearGradient id="markGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="50%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#a3e635"/>
    </linearGradient>
    <pattern id="grid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <rect width="1200" height="630" fill="url(#glow3)"/>

  <g transform="translate(80, 80)">
    <rect x="0" y="0" width="64" height="64" rx="14" fill="#0f1524" stroke="rgba(34,211,238,0.55)" stroke-width="2"/>
    <path d="M18 23L27 32L18 41" stroke="#67e8f9" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M33 42H46" stroke="#a3e635" stroke-width="3.8" stroke-linecap="round" fill="none"/>
    <text x="84" y="32" fill="#ffffff" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="-0.02em">Siarhei Sheleh</text>
    <text x="84" y="56" fill="#5b6577" font-family="ui-monospace, monospace" font-size="14" letter-spacing="0.06em">SV LAB · WARSAW, PL</text>
  </g>

  <text x="80" y="280" fill="#9aa3b2" font-family="ui-monospace, monospace" font-size="20" letter-spacing="0.18em">${escapeXml(kicker)}</text>

  <text x="80" y="370" fill="url(#title)" font-family="ui-sans-serif, system-ui, sans-serif" font-size="78" font-weight="600" letter-spacing="-0.03em">${escapeXml(line1)}</text>
  <text x="80" y="455" fill="#ffffff" font-family="ui-sans-serif, system-ui, sans-serif" font-size="78" font-weight="600" letter-spacing="-0.03em">${escapeXml(line2)}</text>

  <g transform="translate(80, 530)">
    <rect x="0" y="0" width="${footerLeft.width}" height="44" rx="22" fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.28)"/>
    <circle cx="22" cy="22" r="5" fill="#34d399"/>
    <text x="40" y="28" fill="${a.chip}" font-family="ui-monospace, monospace" font-size="13" letter-spacing="0.16em">${escapeXml(footerLeft.label)}</text>
  </g>

  <g transform="translate(${80 + footerLeft.width + 20}, 530)">
    <rect x="0" y="0" width="${footerRight.width}" height="44" rx="22" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)"/>
    <text x="20" y="28" fill="#c9d2e0" font-family="ui-monospace, monospace" font-size="13" letter-spacing="0.12em">${escapeXml(footerRight.label)}</text>
  </g>

  <text x="80" y="600" fill="#5b6577" font-family="ui-monospace, monospace" font-size="14" letter-spacing="0.08em">contact@svlab.online · est. 2024</text>
</svg>`;
}

const pages = [
  {
    out: "og.png",
    kicker: "// PRODUCT ENTREPRENEUR · WARSAW, PL",
    line1: "Siarhei Sheleh.",
    line2: "Still in the code.",
    footerLeft: { label: "13 YEARS SHIPPING", width: 240 },
    footerRight: { label: "12 PRODUCTS · 9 STILL LIVE", width: 360 },
    accent: "brand",
  },
  {
    out: "og-about.png",
    kicker: "// ABOUT · SIARHEI SHELEH · WARSAW, PL",
    line1: "13 years of shipping.",
    line2: "One accountable owner.",
    footerLeft: { label: "WARSAW, PL", width: 190 },
    footerRight: { label: "MOBILE · DESKTOP · WEB · AI", width: 370 },
    accent: "brand",
  },
  {
    out: "og-skills.png",
    kicker: "// OPEN SOURCE · SSHLG-SKILLS",
    line1: "Agents that ship products,",
    line2: "not neuroslop.",
    footerLeft: { label: "4 SKILLS · MIT", width: 220 },
    footerRight: { label: "CLAUDE CODE · CURSOR · CODEX · 12+ AGENTS", width: 520 },
    accent: "lime",
  },
  {
    out: "og-consulting.png",
    kicker: "// CONSULTING · SV LAB",
    line1: "Outside operator on",
    line2: "your AI roadmap.",
    footerLeft: { label: "ADVISORY · TRANSFORMATION · FORWARD DEPLOY", width: 470 },
    footerRight: { label: "BOOK A CONSULTATION → CONTACT@SVLAB.ONLINE", width: 530 },
    accent: "brand",
  },
  {
    out: "og-consulting-ai-advisory.png",
    kicker: "// CONSULTING · AI ADVISORY",
    line1: "Apply AI where it",
    line2: "moves the business.",
    footerLeft: { label: "1-WEEK PROTOTYPE", width: 230 },
    footerRight: { label: "VENDOR-FREE · SHIPS PRODUCTION SYSTEMS", width: 470 },
    accent: "cyan",
  },
  {
    out: "og-consulting-ai-transformation.png",
    kicker: "// CONSULTING · AI TRANSFORMATION",
    line1: "Redesign your business",
    line2: "around AI.",
    footerLeft: { label: "8-12 WEEK CYCLE", width: 220 },
    footerRight: { label: "PROCESS · DATA · ORG · ADOPTION", width: 410 },
    accent: "violet",
  },
  {
    out: "og-consulting-forward-deployment.png",
    kicker: "// CONSULTING · FORWARD DEPLOYMENT",
    line1: "Embed an AI engineer",
    line2: "in your team.",
    footerLeft: { label: "ON-SITE + REMOTE", width: 240 },
    footerRight: { label: "YOUR STACK · PROD DEPLOYS · HANDOFF", width: 450 },
    accent: "lime",
  },
];

if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

const scriptMtime = statSync(scriptPath).mtimeMs;
let regenerated = 0;

for (const page of pages) {
  const target = resolve(publicDir, page.out);
  if (existsSync(target)) {
    const targetMtime = statSync(target).mtimeMs;
    if (targetMtime >= scriptMtime) {
      console.log(`[build-og] ${page.out} is up to date, skipping`);
      continue;
    }
  }
  const svg = renderSvg(page);
  const png = new Resvg(svg, {
    background: "#070A12",
    fitTo: { mode: "width", value: 1200 },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: "Helvetica",
    },
  })
    .render()
    .asPng();
  writeFileSync(target, png);
  console.log(`[build-og] wrote ${page.out} (${png.byteLength} bytes)`);
  regenerated += 1;
}

console.log(`[build-og] done · regenerated ${regenerated}/${pages.length}`);
