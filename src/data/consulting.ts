import { projects } from "./projects";
import { trackRecord } from "./track-record";

export type ConsultingService = {
  slug: "ai-advisory" | "ai-transformation" | "forward-deployment";
  title: string;
  kicker: string;
  hero: { headline: string; sub: string };
  outcomes: {
    value: string;
    label: string;
    blurb: string;
    icon: "clock" | "target" | "trend-down" | "shield" | "layers" | "cube" | "users" | "spark";
  }[];
  proofs: {
    products: ("prowl" | "checkmydata" | "privateclawd")[];
    trackRecord: string[];
  };
  process: { step: string; title: string; body: string }[];
  faq: { q: string; a: string }[];
  cta: { subject: string; body: string };
  meta: { title: string; description: string };
};

export const consultingServices: Record<
  ConsultingService["slug"],
  ConsultingService
> = {
  "ai-advisory": {
    slug: "ai-advisory",
    title: "AI advisory",
    kicker: "// AI ADVISORY",
    hero: {
      headline: "Apply AI where it actually moves the business.",
      sub: "Most AI projects stall in slide decks. I work shoulder-to-shoulder with founders and ops leads to ship the right AI use cases — agents, copilots, NL-to-data, internal tools — to production in weeks, not quarters.",
    },
    outcomes: [
      {
        value: "1 week",
        label: "TO FIRST WORKING PROTOTYPE",
        blurb:
          "From kickoff to a live, evaluated agent or copilot you can put in front of real users.",
        icon: "clock",
      },
      {
        value: "3–5",
        label: "USE CASES PRIORITIZED",
        blurb:
          "Ranked by ROI, time-to-value, and risk — so you spend the budget on what compounds, not on demos.",
        icon: "target",
      },
      {
        value: "60–80%",
        label: "TYPICAL OPS-COST CUT",
        blurb:
          "On routine workflows we automate end-to-end (support triage, data Q&A, reporting, lead qualification).",
        icon: "trend-down",
      },
      {
        value: "Vendor-free",
        label: "INDEPENDENT POV",
        blurb:
          "I don't resell models, infra, or platforms. Recommendations are picked on merit, not commission.",
        icon: "shield",
      },
    ],
    proofs: {
      products: ["prowl", "checkmydata"],
      trackRecord: ["hyperlancer", "genie-ai", "ultimate-guitar"],
    },
    process: [
      {
        step: "01 · WEEK 1",
        title: "Discovery & opportunity map",
        body: "We map your workflows, data, and tooling, then score 8–12 candidate AI use cases on impact, feasibility, and risk. You leave the week with a ranked roadmap.",
      },
      {
        step: "02 · WEEKS 2–4",
        title: "Working prototype",
        body: "I build the top use case end-to-end — agent, eval harness, guardrails, and a thin UI — running on your data. Not a slide deck, not a demo: a tool your team can use.",
      },
      {
        step: "03 · WEEK 5+",
        title: "Hand-off or scale",
        body: "Either I package the prototype into a shippable internal product, or I hand it to your engineering team with docs, evals, and an upgrade path. Your call.",
      },
    ],
    faq: [
      {
        q: "Do you only work on greenfield projects?",
        a: "No. Most engagements are inside existing companies, on top of existing data and tooling. I'm comfortable joining a stack rather than rebuilding it.",
      },
      {
        q: "Which models / platforms do you recommend?",
        a: "Whichever ones fit. I've shipped on OpenAI, Anthropic, and open-weight models, with and without orchestration frameworks. The choice is driven by latency, cost, privacy, and the eval bar — not by vendor preference.",
      },
      {
        q: "What does engagement look like?",
        a: "Either a fixed-scope advisory sprint (1–4 weeks) or a fractional retainer (1–2 days/week). Output is always a working prototype or a decision memo — never just slides.",
      },
      {
        q: "Do you sign NDAs and DPAs?",
        a: "Yes. I work under NDA by default, and I'm comfortable with GDPR / data-processing addenda. I'm based in Poland and invoice as a registered EU entity; VAT details come with the contract.",
      },
      {
        q: "What if AI isn't actually the right answer?",
        a: "I'll tell you. Plenty of workflows are better solved with a script, an SQL view, or removing a step entirely. The first deliverable is the honest opportunity map — even if it ends with 'don't ship AI here yet'.",
      },
      {
        q: "When is forward deployment a better fit?",
        a: "If you'd rather have an engineer embedded in your team shipping into your own production environment than an outside advisor, look at forward deployment (/consulting/forward-deployment). Advisory often becomes the scoping phase for an embedded engagement.",
      },
    ],
    cta: {
      subject: "Consulting · AI advisory · SV Lab",
      body: [
        "Hi Sergey,",
        "",
        "I'd like to discuss an AI advisory engagement.",
        "",
        "Company:",
        "Role:",
        "What we're trying to solve:",
        "Rough timeline / budget:",
        "",
        "— ",
      ].join("\n"),
    },
    meta: {
      title: "AI advisory · SV Lab",
      description:
        "Independent AI advisory by Sergey Sheleg: opportunity mapping, working prototypes, vendor-free recommendations. Apply AI where it moves the business — in weeks, not quarters.",
    },
  },

  "ai-transformation": {
    slug: "ai-transformation",
    title: "AI transformation",
    kicker: "// AI TRANSFORMATION",
    hero: {
      headline: "Redesign your business around AI — without breaking what works.",
      sub: "I help operators rewire entire processes, teams, and product surfaces around AI: from internal tooling and data infrastructure to customer-facing agents and the org chart that runs them.",
    },
    outcomes: [
      {
        value: "8–12 wk",
        label: "FROM AUDIT TO ROLLOUT",
        blurb:
          "End-to-end transformation cycle: audit, redesign, pilot, rollout, adoption — on a single accountable timeline.",
        icon: "clock",
      },
      {
        value: "3 layers",
        label: "PROCESS · DATA · ORG",
        blurb:
          "Process redesign, data infrastructure, and org changes shipped together — that's the only combination that sticks.",
        icon: "layers",
      },
      {
        value: "Real",
        label: "PRODUCTION SYSTEMS",
        blurb:
          "Agents, internal tools, and dashboards running on your stack — with evals, guardrails, observability, and budget caps.",
        icon: "cube",
      },
      {
        value: "Adoption",
        label: "MEASURED, NOT ASSUMED",
        blurb:
          "Every workflow we transform ships with usage telemetry and a 90-day adoption target. If a tool isn't used, it didn't ship.",
        icon: "users",
      },
    ],
    proofs: {
      products: ["privateclawd", "checkmydata", "prowl"],
      trackRecord: ["esimplus", "nicegram", "ultimate-guitar"],
    },
    process: [
      {
        step: "01 · WEEKS 1–2",
        title: "Process & data audit",
        body: "I shadow your teams, instrument key workflows, and audit the data and tools they actually use. The output is a transformation map: which processes to redesign, automate, kill, or leave alone.",
      },
      {
        step: "02 · WEEKS 3–6",
        title: "Pilot redesign",
        body: "We pick 2–3 high-leverage processes and redesign them around AI: agents, copilots, internal tools, dashboards. I build the systems; we run them in parallel to the legacy flow.",
      },
      {
        step: "03 · WEEKS 7–10",
        title: "Rollout & adoption",
        body: "Migrate the team onto the redesigned flow with training, documentation, and support. Telemetry tracks adoption, time saved, and quality — so we cut what didn't land.",
      },
      {
        step: "04 · WEEK 11+",
        title: "Compounding loop",
        body: "Hand-off to an internal owner with a roadmap of the next 3 processes, a guardrails playbook, and a quarterly review cadence. The transformation keeps shipping after I leave.",
      },
    ],
    faq: [
      {
        q: "Is this a strategy deck or actual systems?",
        a: "Actual systems. I write code, ship agents and tools, and own the production rollout — not just the executive readout. The deliverable is software running in your business.",
      },
      {
        q: "What size of company is this for?",
        a: "Best fit is 10–250 people: small enough that a single operator can move the org, big enough that process redesign + data + tools have real leverage. Larger orgs work too if there's an executive sponsor and a focused unit.",
      },
      {
        q: "How does this differ from AI advisory?",
        a: "Advisory is targeted: pick a use case, ship it, hand off. Transformation is structural: redesign processes and the org around them, then ship the systems and adopt them. Advisory often becomes the first phase of a transformation engagement.",
      },
      {
        q: "Do you bring a team?",
        a: "I do the work myself, with selected partners brought in only when the workload demands it (design, specialised data engineering). You stay accountable to one person, not a delivery org.",
      },
      {
        q: "What about change management?",
        a: "Built in. Every transformed process ships with internal docs, training sessions, an adoption metric, and a designated internal owner. A redesign nobody uses is a failed redesign.",
      },
      {
        q: "Where are you based and how do you invoice?",
        a: "Warsaw, Poland. I invoice as a registered EU entity; the NIP and VAT numbers come with the contract and every invoice. Engagements are remote-first with on-site weeks when useful.",
      },
      {
        q: "Can you embed directly in our team instead?",
        a: "Yes — that's the forward deployment model (/consulting/forward-deployment): I join your team and ship production systems inside your own stack and infrastructure, rather than running a separate transformation track from the outside.",
      },
    ],
    cta: {
      subject: "Consulting · AI transformation · SV Lab",
      body: [
        "Hi Sergey,",
        "",
        "I'd like to discuss an AI transformation engagement.",
        "",
        "Company:",
        "Headcount:",
        "Role:",
        "Processes / org units we want to transform:",
        "Rough timeline / budget:",
        "",
        "— ",
      ].join("\n"),
    },
    meta: {
      title: "AI transformation · SV Lab",
      description:
        "End-to-end AI transformation by Sergey Sheleg: process redesign, data infrastructure, and org rewiring shipped as production systems — not slides.",
    },
  },

  "forward-deployment": {
    slug: "forward-deployment",
    title: "Forward deployment",
    kicker: "// FORWARD DEPLOYMENT",
    hero: {
      headline: "Embed an AI engineer in your team — shipping in your own production environment.",
      sub: "Forward deployed engineering, not slide decks: I join your Slack, your repo, and your CI, then build and deploy AI systems straight into your cloud or VPC. One accountable operator working shoulder-to-shoulder with your team — leaving behind runbooks, evals, and an in-house owner.",
    },
    outcomes: [
      {
        value: "On-site",
        label: "EMBEDDED IN YOUR TEAM",
        blurb:
          "I work inside your rituals — standups, code review, on-call — with on-site weeks when proximity moves things faster than a call.",
        icon: "users",
      },
      {
        value: "Your stack",
        label: "PROD IN YOUR INFRA",
        blurb:
          "Deploys land in your cloud, VPC, and pipelines — not a sandbox you can't keep. Your data never leaves your perimeter.",
        icon: "cube",
      },
      {
        value: "Handoff",
        label: "RUNBOOKS + TEAM UPSKILL",
        blurb:
          "Every system ships with docs, evals, and a designated internal owner trained to run and extend it after I leave.",
        icon: "layers",
      },
      {
        value: "Solo",
        label: "ONE ACCOUNTABLE OPERATOR",
        blurb:
          "Not a staffing agency or a rotating bench. You get one senior engineer who owns the outcome end-to-end.",
        icon: "shield",
      },
    ],
    proofs: {
      products: ["privateclawd", "prowl"],
      trackRecord: ["hyperlancer", "esimplus", "nicegram"],
    },
    process: [
      {
        step: "01 · WEEK 1",
        title: "Embed & access",
        body: "I onboard like a teammate: access to repo, CI, data, and tooling, plus a short security and environment review. We agree on the first thing to ship and how it reaches production.",
      },
      {
        step: "02 · WEEKS 2–6",
        title: "Ship in production",
        body: "I build AI systems — agents, copilots, data pipelines, internal tools — and deploy them into your own infrastructure, with evals, guardrails, and observability wired in from day one.",
      },
      {
        step: "03 · ONGOING",
        title: "Transfer & sustain",
        body: "I pair with your engineers, write the runbooks, and hand ownership to an internal owner. The systems keep running and improving on your stack after the engagement ends.",
      },
    ],
    faq: [
      {
        q: "What is forward deployment exactly?",
        a: "It's the forward deployed engineer (FDE) model: instead of advising from the outside, I embed in your team and ship production software inside your own environment. Think of it as a senior AI engineer on loan — in your repo, your CI, and your cloud — who owns delivery and then hands it off.",
      },
      {
        q: "How is this different from advisory or transformation?",
        a: "Advisory is a targeted sprint that ends in a prototype or decision memo. Transformation rewires whole processes and the org around them. Forward deployment is about where the work happens: deep inside your team and infrastructure, building and operating systems hands-on rather than from the outside.",
      },
      {
        q: "On-site or remote?",
        a: "Remote-first, with on-site weeks when proximity is worth it — kickoff, hard integration work, or training your team. I'm based in Warsaw, Poland and travel within the EU readily, further with notice.",
      },
      {
        q: "Do you bring a team?",
        a: "No. You get one senior operator who owns the outcome, not a rotating bench or a staffing contract. When specialised help is genuinely needed (design, niche data engineering) I bring a trusted partner in — and you stay accountable to one person.",
      },
      {
        q: "What about security and access to our systems?",
        a: "I work under NDA by default and follow your access policy — least-privilege credentials, your devices or VDI if required, deploys into your VPC so data never leaves your perimeter. I invoice as a registered EU entity — NIP and VAT on the contract — and sign DPAs.",
      },
      {
        q: "How long is a typical engagement?",
        a: "Usually 4–12 weeks of focused embedded work, sometimes a longer fractional arrangement (a couple of days a week). The goal is always to make myself unnecessary: working systems plus an internal owner who can carry them.",
      },
    ],
    cta: {
      subject: "Consulting · Forward deployment · SV Lab",
      body: [
        "Hi Sergey,",
        "",
        "I'd like to discuss a forward deployment engagement.",
        "",
        "Company:",
        "Role:",
        "Stack & environment (cloud, repo, CI):",
        "What we want to ship:",
        "On-site availability:",
        "Rough timeline / budget:",
        "",
        "— ",
      ].join("\n"),
    },
    meta: {
      title: "Forward deployment · SV Lab",
      description:
        "Forward deployed engineering by Sergey Sheleg: an embedded AI engineer shipping production systems inside your own team, stack, and infrastructure — with full handoff to an internal owner.",
    },
  },
};

export const consultingServiceList: ConsultingService[] = [
  consultingServices["ai-advisory"],
  consultingServices["ai-transformation"],
  consultingServices["forward-deployment"],
];

export function getProductsForService(service: ConsultingService) {
  return projects.filter((p) =>
    (service.proofs.products as readonly string[]).includes(p.slug),
  );
}

export function getTrackRecordForService(service: ConsultingService) {
  const slugSet = new Set(service.proofs.trackRecord);
  return trackRecord.filter((t) => slugSet.has(t.slug));
}
