export type Capability = {
  title: string;
  description: string;
  icon: "agent" | "data" | "intel" | "cloud" | "shield" | "growth";
};

export const capabilities: Capability[] = [
  {
    title: "Go-to-market",
    description:
      "Positioning, pricing, launch, distribution, first 1,000 users. I run GTM as the same loop as the build, not a phase after it.",
    icon: "intel",
  },
  {
    title: "Full-stack engineering",
    description:
      "TypeScript end to end: agents, data pipelines, payments, infra. I write the code that ships, not just the spec.",
    icon: "agent",
  },
  {
    title: "Research & discovery",
    description:
      "Customer interviews, competitive teardowns, technical spikes. I validate before I build, then keep validating after.",
    icon: "data",
  },
  {
    title: "Marketing & content",
    description:
      "Landing pages, SEO, AI-search optimization, organic distribution, paid funnels. Every product I run gets its own growth engine.",
    icon: "growth",
  },
  {
    title: "Operations & org",
    description:
      "Stripe billing, support, legal, vendor stack, analytics. The boring infrastructure that keeps a one-person company compounding.",
    icon: "shield",
  },
  {
    title: "AI products",
    description:
      "Agentic systems, NL-to-SQL interfaces, managed cloud for agents — the layer where SV Lab's three live products live today.",
    icon: "cloud",
  },
];
