export type Capability = {
  title: string;
  description: string;
  icon: "agent" | "data" | "intel" | "cloud" | "shield" | "growth";
};

export const capabilities: Capability[] = [
  {
    title: "Agentic systems",
    description:
      "Multi-tool LLM agents with planners, memory, evaluators, and human-in-the-loop checkpoints — production-grade, not prototypes.",
    icon: "agent",
  },
  {
    title: "Natural-language data",
    description:
      "Conversational interfaces over Postgres, MySQL, ClickHouse, and document stores. Codebase-aware NL-to-SQL that respects your schema.",
    icon: "data",
  },
  {
    title: "Market intelligence",
    description:
      "Pipelines that scrape, normalize, and synthesize SEO, ads, reviews, pricing, and funnel data into board-ready strategy.",
    icon: "intel",
  },
  {
    title: "AI cloud platforms",
    description:
      "Managed runtimes for AI agents: dedicated VMs, instant provisioning, billing, observability, and one-click integrations.",
    icon: "cloud",
  },
  {
    title: "Privacy & guardrails",
    description:
      "Token budgets, loop detection, prompt-injection defense, audit logs. AI you can ship to enterprise without surprises.",
    icon: "shield",
  },
  {
    title: "Growth engineering",
    description:
      "Stripe billing, conversion-tuned funnels, Cloudflare-grade infrastructure, SEO + AI-search optimization wired in from day one.",
    icon: "growth",
  },
];
