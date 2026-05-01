import Link from "next/link";

const ROOMS = [
  {
    n: "01",
    title: "Product Strategy",
    body: "Problem, audience, success metrics, features, KPIs.",
  },
  {
    n: "02",
    title: "Technical Architecture",
    body: "Stack, system design, capacity, AI, integrations.",
  },
  {
    n: "03",
    title: "Business & Market",
    body: "Personas, pricing, GTM, competitors, channels.",
  },
  {
    n: "04",
    title: "Quality & Compliance",
    body: "Security, privacy, SLOs, frameworks, governance.",
  },
];

const HERO_DOCS = [
  "SOW",
  "PRD",
  "Technical design",
  "System design",
  "Cost estimate",
  "Security & compliance",
  "GTM brief",
  "Coding-agent prompts",
  "Boilerplate scaffold",
];

const FULL_BUNDLE = [
  "Executive summary",
  "PRD",
  "SOW",
  "Technical design spec",
  "ADR pack",
  "Data & interface spec",
  "Requirements traceability matrix",
  "Test strategy",
  "Launch & operations plan",
  "Marketing & GTM brief",
  "Risk register & governance",
  "System design",
  "AI architecture",
  "Security & compliance checklist",
  "Feature specification",
  "Implementation roadmap",
  "Coding-agent prompt pack",
  "Cost estimate",
];

export default function Home() {
  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-20">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-medium text-accent-700 dark:text-accent-200 bg-accent-50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-700/40 px-2.5 py-1 rounded-full">
                Idea → production-ready blueprint
              </span>
              <h1 className="mt-4 text-4xl lg:text-5xl font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-[1.05]">
                Type out your idea.<br />Get the full app blueprint.
              </h1>
              <p className="mt-4 text-lg text-ink-700 dark:text-ink-300 leading-relaxed max-w-xl">
                Answer a structured questionnaire. We generate the SOW, PRD, technical design, system design, security
                posture, GTM plan, and a coding-agent prompt pack — all from one canonical schema.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/projects/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-900 dark:hover:bg-white"
                >
                  Start a blueprint
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-ink-300 bg-white text-ink-800 text-sm font-medium hover:bg-ink-50 dark:bg-ink-900 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
                >
                  Open a project
                </Link>
              </div>
            </div>

            {/* Visual: input → output */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="rounded-xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">You type</div>
                <div className="mt-2 font-mono text-xs text-ink-700 dark:text-ink-300 leading-relaxed">
                  &quot;A real-time queue app for clinics, banks, and restaurants. Customers reserve a spot from anywhere
                  and arrive when their turn is near.&quot;
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500 mx-auto">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              <div className="rounded-xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">You get</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {HERO_DOCS.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center px-2 py-0.5 rounded-full border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-[11px] text-ink-700 dark:text-ink-200"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-ink-500 dark:text-ink-400">
                  …and 10 more, in Markdown + DOCX.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-xs text-ink-500 dark:text-ink-400">
            Built for product managers, founders, business analysts, solution architects, engineering managers, and
            pre-sales consultants.
          </div>
        </div>
      </section>

      {/* ─── Four discovery rooms ─────────────────────────────────────────── */}
      <section className="border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              Four discovery rooms. Thirteen guided steps.
            </h2>
            <p className="mt-3 text-ink-700 dark:text-ink-300">
              Branching questions adapt to your surface, vertical, platform, and timing model. Autosaved.
            </p>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROOMS.map((r) => (
              <div key={r.n} className="border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-xl p-5">
                <div className="text-xs font-mono text-accent-600 dark:text-accent-300">{r.n}</div>
                <div className="mt-2 text-base font-semibold text-ink-900 dark:text-ink-50">{r.title}</div>
                <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The bundle you take away ─────────────────────────────────────── */}
      <section className="border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              17 documents. One canonical schema. Zero drift.
            </h2>
            <p className="mt-3 text-ink-700 dark:text-ink-300">
              Stable IDs flow across every doc. Change one answer in intake; every relevant section updates.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {FULL_BUNDLE.map((d) => (
              <span
                key={d}
                className="inline-flex items-center px-3 py-1.5 rounded-full border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-sm text-ink-800 dark:text-ink-200"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="mt-6 text-sm text-ink-600 dark:text-ink-400">
            Plus a <span className="font-medium text-ink-800 dark:text-ink-100">boilerplate scaffold</span> matched to
            your stack — folder structure, <code className="text-xs">docker-compose</code> for your DB and cache,{" "}
            <code className="text-xs">.env.example</code>, and a CI stub.
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="border border-ink-200 dark:border-ink-800 bg-gradient-to-br from-accent-50 to-white dark:from-accent-900/20 dark:to-ink-900 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              Stop scattering specs across tools.
            </h2>
            <p className="mt-3 text-ink-700 dark:text-ink-300 max-w-xl mx-auto">
              Walk one structured flow. Walk away with everything an agent or a team needs to start building.
            </p>
            <div className="mt-6">
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-900 dark:hover:bg-white"
              >
                Start a blueprint
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
