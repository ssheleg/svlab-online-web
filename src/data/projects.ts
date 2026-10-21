export type Project = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  yearStart: number;
  yearEnd: number | "present";
  status: "live" | "archived" | "in-development";
  category: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  accent: "cyan" | "lime" | "violet" | "amber";
};

export const projects: Project[] = [
  {
    slug: "sshlg-skills",
    name: "sshlg-skills",
    domain: "github.com/ssheleg/sshlg-skills",
    url: "https://github.com/ssheleg/sshlg-skills",
    yearStart: 2026,
    yearEnd: "present",
    status: "live",
    category: "Open source · agent skills",
    tagline: "Thirteen years of product judgement, installed into your coding agent.",
    description:
      "An open-source skill family that teaches coding agents how to take an idea to production the way a product team does — scenario-driven UX, gated delivery stages, product marketing, onboarding and retention baked in. One command installs it into Claude Code, Cursor, Codex, OpenCode, Gemini CLI, Windsurf, Zed and more.",
    highlights: [
      "4 skills: super-ux · task-pipeline · make-skill · sheleg-design",
      "One launcher installs across 12+ agents — no per-agent setup",
      "MIT-licensed, zero-dependency, validated in CI",
    ],
    stack: ["Node.js", "Claude Code", "Cursor", "Codex", "MIT"],
    accent: "amber",
  },
  {
    slug: "prowl",
    name: "Prowl",
    domain: "prowl.chat",
    url: "https://prowl.chat",
    yearStart: 2025,
    yearEnd: "present",
    status: "live",
    category: "Agent intelligence · MCP",
    // Every figure re-read from prowl.chat on 2026-10-21 (curl of the live page):
    // "444 market data tools across 17 providers", "33 modules in the
    // catalogue", "up to 16 intelligence modules per report", "deep ≈ $17",
    // "$15 starter credit". Superseded on this site: 408 tools, 12 modules,
    // 5 formats, a $5 starter credit. sshlg.me moved from 448 to 444 the same
    // day. Sources and dates: docs/handoffs/2026-10-21-facts-refresh.md.
    tagline: "444 market-intelligence tools behind one MCP endpoint.",
    description:
      "The research layer for coding agents. Connect one MCP endpoint to Cursor, Claude Code, Codex or any other MCP client, and the agent can call 444 market data tools across 17 providers (SEO, ads, SERP, app stores, reviews and trends) and get real numbers back. For a bigger question it combines up to 16 of the 33 catalogue modules into one sourced report. Billed per call from a USD wallet: a deep report costs about $17 in credits, and a new account starts with a $15 starter credit.",
    highlights: [
      "444 tools across 17 providers behind one endpoint: SEO, ads, SERP, reviews, trends",
      "33 modules in the catalogue, up to 16 combined in one report",
      "Pay-per-call wallet with per-key scopes, spend limits and IP allowlists",
    ],
    stack: ["MCP", "TypeScript", "Next.js", "LLM orchestration", "Stripe"],
    accent: "cyan",
  },
  {
    slug: "privateclawd",
    name: "PrivateClawd",
    domain: "privateclawd.com",
    url: "https://privateclawd.com",
    yearStart: 2025,
    yearEnd: "present",
    status: "live",
    category: "AI agent cloud",
    // Rewritten 2026-10-21 from privateclawd.com, which no longer says "60
    // seconds" or "dedicated VM": "Managed hosting for your OpenClaw agent, a
    // private container of its own, always on, no VPS and no Docker" and
    // "Deploy OpenClaw agents in minutes, no terminal required".
    tagline: "Managed hosting for an OpenClaw agent, in a private container of its own.",
    description:
      "Managed hosting for OpenClaw AI agents. Each agent runs always on, in a private, isolated container of its own, with browser automation, code execution, messaging channels (Telegram, WhatsApp, Discord, Slack, web), budget guardrails and prompt-injection defense. No servers to run and no DevOps.",
    highlights: [
      "Deploy in minutes, with no terminal, VPS or Docker to set up",
      "Token caps, loop detection, auto-pause: no runaway bills",
      "Prompt-injection and link-preview exfiltration defense built in",
    ],
    stack: ["Cloud orchestration", "Containers", "OpenClaw", "Stripe", "Edge"],
    accent: "violet",
  },
];

/**
 * The agent products shown as cards under "AI agent products". `sshlg-skills`
 * is a live project too, but its card lives in the Open source section. Every
 * "N agent products" figure on the site derives from this list, never a literal.
 */
export const agentProducts: Project[] = projects.filter(
  (p) => p.slug !== "sshlg-skills",
);

export function formatYears(p: Project): string {
  if (p.yearEnd === "present") return `${p.yearStart} → Present`;
  if (p.yearStart === p.yearEnd) return `${p.yearStart}`;
  return `${p.yearStart} → ${p.yearEnd}`;
}
