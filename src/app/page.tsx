import Link from "next/link";

const ARTIFACTS = [
  { title: "Statement of work (SOW)", body: "Scope, deliverables, milestones, acceptance — what gets built and how it's accepted." },
  { title: "Product requirements (PRD)", body: "Goals, personas, requirements, features, KPIs — anchored by stable IDs." },
  { title: "Technical design spec", body: "Stack, contracts, rollout, monitoring, recovery — engineering-ready." },
  { title: "System design", body: "Capacity (DAU, peak RPS), caching, DB scaling, multi-region, DR." },
  { title: "Architecture decisions", body: "ADRs with context, alternatives, consequences — auditable." },
  { title: "Data & interface spec", body: "Canonical entities, integrations, retention, residency." },
  { title: "Test strategy", body: "Coverage targets, scenarios, acceptance gates, accessibility checks." },
  { title: "Launch & operations plan", body: "SLOs, runbook, rollback, on-call posture." },
  { title: "Marketing & GTM brief", body: "Positioning, segments, pricing, channels, launch geography." },
  { title: "Security & compliance checklist", body: "GDPR, HIPAA, PIPEDA, SOC 2, ISO, PCI, OSFI, OWASP, NIST AI RMF." },
  { title: "AI architecture", body: "Pipeline, RAG, evals, guardrails, HITL — when AI is in scope." },
  { title: "Feature spec + roadmap", body: "Per-feature detail with priority, complexity, value, release." },
  { title: "Coding-agent prompt pack", body: "Cursor / Lovable / Replit-ready prompts wired to your bundle's IDs." },
];

const STEPS = [
  {
    n: "01",
    title: "Describe your idea",
    body: "Name the project, write a one-liner, paste a longer description. The wizard adapts to it.",
  },
  {
    n: "02",
    title: "Walk thirteen guided domains",
    body: "Problem, market, surfaces, platform & stack, features, system design, AI, security, GTM, governance — answers branch by your choices.",
  },
  {
    n: "03",
    title: "Get a complete blueprint",
    body: "Seventeen production-grade documents render from one schema. Download as Markdown, DOCX, or a single zipped bundle.",
  },
  {
    n: "04",
    title: "Hand to a coding agent — or your team",
    body: "The bundle includes a prompt pack ready to paste into Cursor, Lovable, or Replit. Or hand the SOW + PRD to a vendor.",
  },
];

const PERSONAS = [
  "Product Managers",
  "Founders",
  "Business Analysts",
  "Solution Architects",
  "Engineering Managers",
  "Pre-sales Consultants",
  "Innovation Teams",
  "Enterprise Transformation",
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-accent-700 dark:text-accent-200 bg-accent-50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-700/40 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Idea → production-ready blueprint
          </span>
          <h1 className="mt-5 text-4xl lg:text-5xl font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-[1.1]">
            Turn any idea into a production-ready app blueprint.
          </h1>
          <p className="mt-5 text-lg text-ink-700 dark:text-ink-300 leading-relaxed">
            Describe what you want to build. We help you figure out the SOW, PRD, system design, technical stack, security and
            compliance posture, and go-to-market plan — together, in one guided flow. The output is a complete bundle of
            engineering- and exec-ready documents that an agent or team can build from.
          </p>

          <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-ink-700 dark:text-ink-300">
            <li className="flex items-start gap-2"><span className="text-accent-500 mt-0.5">▸</span> Statement of work and scope</li>
            <li className="flex items-start gap-2"><span className="text-accent-500 mt-0.5">▸</span> Product requirements and KPIs</li>
            <li className="flex items-start gap-2"><span className="text-accent-500 mt-0.5">▸</span> System design with capacity math</li>
            <li className="flex items-start gap-2"><span className="text-accent-500 mt-0.5">▸</span> Tech stack and architecture decisions</li>
            <li className="flex items-start gap-2"><span className="text-accent-500 mt-0.5">▸</span> Security and compliance posture</li>
            <li className="flex items-start gap-2"><span className="text-accent-500 mt-0.5">▸</span> Marketing and go-to-market plan</li>
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-900 dark:hover:bg-white"
            >
              Start building your blueprint
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-ink-300 bg-white text-ink-800 text-sm font-medium hover:bg-ink-50 dark:bg-ink-900 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
            >
              See your projects
            </Link>
          </div>
        </div>
      </section>

      {/* Built for */}
      <section className="py-8">
        <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-3">Built for</div>
        <div className="flex flex-wrap gap-2">
          {PERSONAS.map((p) => (
            <span key={p} className="inline-flex items-center px-3 py-1.5 rounded-full border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-xs text-ink-700 dark:text-ink-300">
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 lg:py-16">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">How it works</h2>
          <p className="mt-3 text-ink-700 dark:text-ink-300">
            One canonical schema underneath. Answer once and every artifact stays consistent.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-xl p-5">
              <div className="text-xs font-mono text-accent-600 dark:text-accent-300">{s.n}</div>
              <div className="mt-2 text-sm font-semibold text-ink-900 dark:text-ink-50">{s.title}</div>
              <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Artifacts */}
      <section className="py-12 lg:py-16">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
            What you get back
          </h2>
          <p className="mt-3 text-ink-700 dark:text-ink-300">
            Seventeen production-grade documents, generated from one canonical project schema. Stable IDs flow across every
            document — every requirement traces forward to design and tests, backward to a stakeholder need. Export as
            Markdown, DOCX, JSON, or a single zip.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARTIFACTS.map((a) => (
            <div key={a.title} className="border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-lg p-4">
              <div className="text-sm font-medium text-ink-900 dark:text-ink-50">{a.title}</div>
              <div className="text-xs text-ink-600 dark:text-ink-400 mt-1 leading-relaxed">{a.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="py-12 lg:py-16">
        <div className="border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-2xl p-8 lg:p-12">
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight max-w-2xl text-ink-900 dark:text-ink-50">
            One canonical schema. Every document in lockstep.
          </h2>
          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-ink-900 dark:text-ink-50">Role-aware intake</div>
              <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                PM, architect, designer, ops, security, AI, and commercial perspectives in one flow. Conditional questions
                branch by surface, vertical, and platform choices.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-ink-900 dark:text-ink-50">Stable IDs, end to end</div>
              <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                Requirements, features, ADRs, risks, KPIs, integrations, entities, and SLOs get IDs at creation and keep them
                across every generated document.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-ink-900 dark:text-ink-50">Drafts, not decisions</div>
              <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                Bundles surface what's user-entered vs. inferred, with assumptions and unresolved questions pinned for human
                approval before export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-12 lg:py-16">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">Works for any idea</h2>
          <p className="mt-3 text-ink-700 dark:text-ink-300">
            The wizard adapts to the kind of product you're building. A few examples:
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-2xl p-8">
            <div className="text-xs uppercase tracking-wider text-accent-700 dark:text-accent-300">Use case</div>
            <h3 className="text-xl font-semibold mt-1 text-ink-900 dark:text-ink-50">Virtual queue for clinics, banks, and restaurants</h3>
            <p className="text-sm text-ink-600 dark:text-ink-400 mt-3 leading-relaxed">
              Pick the queue template, set timing to real-time, choose the vertical. The platform suggests features (ETA,
              walk-in vs. booked merge, late-arrival policy, kiosk mode), corner cases (PHI segregation, inaccurate ETA,
              branch outages), and compliance packs (PIPEDA, PHIPA, HIPAA depending on geography).
            </p>
          </div>
          <div className="border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-2xl p-8">
            <div className="text-xs uppercase tracking-wider text-accent-700 dark:text-accent-300">Use case</div>
            <h3 className="text-xl font-semibold mt-1 text-ink-900 dark:text-ink-50">Internal AI agent on enterprise data</h3>
            <p className="text-sm text-ink-600 dark:text-ink-400 mt-3 leading-relaxed">
              Mark the platform as AI agent, enable RAG and guardrails. The bundle includes an AI architecture covering
              pipeline, evals, prompt management, audit logs, HITL, and NIST AI RMF mapping — plus the OWASP LLM Top 10 in
              the compliance checklist.
            </p>
          </div>
          <div className="border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-2xl p-8">
            <div className="text-xs uppercase tracking-wider text-accent-700 dark:text-accent-300">Use case</div>
            <h3 className="text-xl font-semibold mt-1 text-ink-900 dark:text-ink-50">B2B SaaS for mid-market</h3>
            <p className="text-sm text-ink-600 dark:text-ink-400 mt-3 leading-relaxed">
              Capture multi-tenant data, RBAC, pricing, and acquisition channels. Marketing brief, SOW, and roadmap reflect
              packaging and segments; the coding-agent prompt pack is wired to your stack so an agent can scaffold the repo
              end to end.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-20">
        <div className="border border-ink-200 dark:border-ink-800 bg-gradient-to-br from-accent-50 to-white dark:from-accent-900/20 dark:to-ink-900 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
            Stop scattering specs across tools.
          </h2>
          <p className="mt-3 text-ink-700 dark:text-ink-300 max-w-2xl mx-auto">
            One canonical project. Seventeen artifacts. Zero drift.
          </p>
          <div className="mt-6">
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-900 dark:hover:bg-white"
            >
              Start building your blueprint
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
