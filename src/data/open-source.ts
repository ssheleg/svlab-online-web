// Display data for the Open Source section. Products live in `projects.ts`
// and career work in `track-record.ts`; this file only decides what the
// open-source block shows and in what order.

export type SkillEntry = {
  name: string;
  repo: string;
  what: string;
};

export const skillFamily = {
  name: "sshlg-skills",
  repo: "https://github.com/ssheleg/sshlg-skills",
  install: "npx github:ssheleg/sshlg-skills install",
  license: "MIT",
  blurb:
    "The way I take an idea to production — discovery, gated delivery, product marketing, onboarding, retention, search — written down as skills a coding agent follows.",
  skills: [
    {
      name: "task-pipeline",
      repo: "https://github.com/ssheleg/task-pipeline",
      what: "Intake grill that refuses vague work, then nine gated stages from docs and spec to deploy and post-deploy checks.",
    },
    {
      name: "super-ux",
      repo: "https://github.com/ssheleg/super-ux",
      what: "Scenario-driven UX: personas and jobs, flows, screens, scenarios, audits — plus a linter that catches docs drifting from the code.",
    },
    {
      name: "seo-aeo-audit",
      repo: "https://github.com/ssheleg/seo-aeo-audit",
      what: "Evidence-first SEO and AEO/GEO audit: ten tracks, evidence tiers, a dated Google update timeline, and 59 prioritized growth plays.",
      isNew: true,
    },
    {
      name: "make-skill",
      repo: "https://github.com/ssheleg/make-skill",
      what: "Create, retrofit, and ship skills and plugins the proven way, so the toolchain itself stays maintainable.",
    },
    {
      name: "sheleg-design",
      repo: "https://github.com/ssheleg/sheleg-design-skill",
      what: "Cinematic scroll-driven landing and hero design, plus product-UI style packs an agent can apply consistently.",
    },
  ] as (SkillEntry & { isNew?: boolean })[],
  agents: [
    "Claude Code",
    "Cursor",
    "Codex",
    "OpenCode",
    "Gemini CLI",
    "Windsurf",
    "Zed",
    "Kilo",
    "Kimi",
    "Hermes",
    "OpenClaw",
  ],
};

export type OpenSourceProject = {
  slug: string;
  name: string;
  repo: string;
  license: string;
  role: string;
  metric: string;
  metricLabel: string;
  blurb: string;
  platforms: { label: string; repo: string }[];
};

export const openSourceProjects: OpenSourceProject[] = [
  {
    slug: "nicegram",
    name: "Nicegram",
    repo: "https://github.com/nicegram",
    license: "GPL-2.0",
    role: "Co-creator · growth",
    metric: "56M+",
    metricLabel: "organic installs",
    blurb:
      "Privacy-first Telegram client with superior UX, open source on iOS, Android, and desktop. Grown to tens of millions of users organically — no paid acquisition.",
    platforms: [
      { label: "iOS", repo: "https://github.com/nicegram/Nicegram-iOS" },
      { label: "Android", repo: "https://github.com/nicegram/Nicegram-Android" },
      { label: "Desktop", repo: "https://github.com/nicegram/nicegram-desktop" },
    ],
  },
];
