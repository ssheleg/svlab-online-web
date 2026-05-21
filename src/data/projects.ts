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
  accent: "cyan" | "lime" | "violet";
};

export const projects: Project[] = [
  {
    slug: "prowl",
    name: "Prowl",
    domain: "prowl.chat",
    url: "https://prowl.chat",
    yearStart: 2025,
    yearEnd: "present",
    status: "live",
    category: "Marketing intelligence",
    tagline: "235+ recon tools, orchestrated into one strategy report.",
    description:
      "An AI competitive-intelligence agent that pulls SEO, ads, funnels, reviews, pricing, and market signals across 235+ tools, then synthesizes them into an 8-module strategy report delivered as an interactive brief, infographic, PDF, slide deck, and video.",
    highlights: [
      "235+ orchestrated recon tools across 50+ data sources",
      "8-module intelligence brief with battlecards & 14/30/90 plan",
      "5 deliverables: interactive report, infographic, PDF, PPTX, video",
    ],
    stack: ["TypeScript", "Next.js", "LLM orchestration", "Stripe", "MCP"],
    accent: "cyan",
  },
  {
    slug: "checkmydata",
    name: "CheckMyData",
    domain: "checkmydata.ai",
    url: "https://checkmydata.ai",
    yearStart: 2025,
    yearEnd: "present",
    status: "live",
    category: "Open-source · NL → SQL",
    tagline: "ChatGPT for your database.",
    description:
      "Open-source, MIT-licensed agent that turns plain-English questions into queries, executes them across PostgreSQL, MySQL, ClickHouse, and MongoDB, and explains results with auto-generated charts. Privacy-first by design and fully self-hostable.",
    highlights: [
      "Multi-DB: PostgreSQL · MySQL · ClickHouse · MongoDB",
      "Indexes your codebase so queries match real business logic",
      "MIT-licensed, self-hostable, zero telemetry",
    ],
    stack: ["TypeScript", "Postgres", "Docker", "LLM agents", "Open source"],
    accent: "lime",
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
    tagline: "Your first AI employee, deployed in 60 seconds.",
    description:
      "Managed cloud for OpenClaw AI agents. Each customer gets an isolated VM with browser automation, code execution, multi-channel messaging (Telegram, WhatsApp, Discord, Slack, web), built-in budget guardrails, and prompt-injection defense — no servers, no DevOps.",
    highlights: [
      "60-second deploy on dedicated, isolated VMs — 24/7 uptime",
      "Token caps, loop detection, auto-pause — no runaway bills",
      "Prompt-injection & link-preview exfiltration defense built-in",
    ],
    stack: ["Cloud orchestration", "Docker", "OpenClaw", "Stripe", "Edge"],
    accent: "violet",
  },
];

export function formatYears(p: Project): string {
  if (p.yearEnd === "present") return `${p.yearStart} → Present`;
  if (p.yearStart === p.yearEnd) return `${p.yearStart}`;
  return `${p.yearStart} → ${p.yearEnd}`;
}
