import { projects } from "./projects";
import { trackRecord } from "./track-record";

export type ConsultingService = {
  slug: "ai-advisory" | "ai-transformation";
  title: string;
  kicker: string;
  hero: { headline: string; sub: string };
  outcomes: { value: string; label: string; blurb: string }[];
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
      },
      {
        value: "3–5",
        label: "USE CASES PRIORITIZED",
        blurb:
          "Ranked by ROI, time-to-value, and risk — so you spend the budget on what compounds, not on demos.",
      },
      {
        value: "60–80%",
        label: "TYPICAL OPS-COST CUT",
        blurb:
          "On routine workflows we automate end-to-end (support triage, data Q&A, reporting, lead qualification).",
      },
      {
        value: "Vendor-free",
        label: "INDEPENDENT POV",
        blurb:
          "I don't resell models, infra, or platforms. Recommendations are picked on merit, not commission.",
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
        a: "Yes. I work under NDA by default, and I'm comfortable with GDPR / data-processing addenda. I'm based in Poland and invoice as a registered EU entity (VAT PL5223265821).",
      },
      {
        q: "What if AI isn't actually the right answer?",
        a: "I'll tell you. Plenty of workflows are better solved with a script, an SQL view, or removing a step entirely. The first deliverable is the honest opportunity map — even if it ends with 'don't ship AI here yet'.",
      },
    ],
    cta: {
      subject: "Consulting · AI advisory · SV Lab",
      body: [
        "Hi Siarhei,",
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
        "Independent AI advisory by Siarhei Sheleh: opportunity mapping, working prototypes, vendor-free recommendations. Apply AI where it moves the business — in weeks, not quarters.",
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
      },
      {
        value: "3 layers",
        label: "PROCESS · DATA · ORG",
        blurb:
          "Process redesign, data infrastructure, and org changes shipped together — that's the only combination that sticks.",
      },
      {
        value: "Real",
        label: "PRODUCTION SYSTEMS",
        blurb:
          "Agents, internal tools, and dashboards running on your stack — with evals, guardrails, observability, and budget caps.",
      },
      {
        value: "Adoption",
        label: "MEASURED, NOT ASSUMED",
        blurb:
          "Every workflow we transform ships with usage telemetry and a 90-day adoption target. If a tool isn't used, it didn't ship.",
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
        a: "I work as a solo operator with selected partners brought in only when the workload demands it (design, specialised data engineering). You stay accountable to one person, not a delivery org.",
      },
      {
        q: "What about change management?",
        a: "Built in. Every transformed process ships with internal docs, training sessions, an adoption metric, and a designated internal owner. A redesign nobody uses is a failed redesign.",
      },
      {
        q: "Where are you based and how do you invoice?",
        a: "Warsaw, Poland. I invoice as a registered EU entity (NIP 5223265821 / VAT PL5223265821). Engagements are remote-first with on-site weeks when useful.",
      },
    ],
    cta: {
      subject: "Consulting · AI transformation · SV Lab",
      body: [
        "Hi Siarhei,",
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
        "End-to-end AI transformation by Siarhei Sheleh: process redesign, data infrastructure, and org rewiring shipped as production systems — not slides.",
    },
  },
};

export const consultingServiceList: ConsultingService[] = [
  consultingServices["ai-advisory"],
  consultingServices["ai-transformation"],
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
