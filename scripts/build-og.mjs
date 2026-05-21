// Convert public/og.svg → public/og.png at 1200x630 using @resvg/resvg-js.
// Runs as `prebuild`. Idempotent; only regenerates if the SVG is newer than
// the PNG (or the PNG is missing).
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../public/og.svg");
const pngPath = resolve(__dirname, "../public/og.png");

if (!existsSync(svgPath)) {
  console.error(`[build-og] missing ${svgPath}`);
  process.exit(1);
}

if (existsSync(pngPath)) {
  const svgMtime = statSync(svgPath).mtimeMs;
  const pngMtime = statSync(pngPath).mtimeMs;
  if (pngMtime >= svgMtime) {
    console.log("[build-og] og.png is up to date, skipping");
    process.exit(0);
  }
}

const svg = readFileSync(svgPath, "utf-8");
const resvg = new Resvg(svg, {
  background: "#070A12",
  fitTo: { mode: "width", value: 1200 },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: "Helvetica",
  },
});
const png = resvg.render().asPng();
writeFileSync(pngPath, png);
console.log(`[build-og] wrote ${pngPath} (${png.byteLength} bytes)`);
