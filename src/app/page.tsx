import Link from "next/link";

const ROOMS = [
  {
    n: "01",
    title: "Clarify the idea",
    body: "Problem, audience, success metrics, constraints, and current alternatives.",
  },
  {
    n: "02",
    title: "Stress-test scenarios",
    body: "Edge cases, compliance triggers, data sensitivity, operational risks, and failure modes.",
  },
  {
    n: "03",
    title: "Scope the MVP",
    body: "Must-have features, validation experiments, build gates, and release sequencing.",
  },
  {
    n: "04",
    title: "Hand off to build",
    body: "Developer-ready specs, prompts, scaffold, traceability, tests, and launch checks.",
  },
];

const EVALUATION_OUTPUTS = [
  "Build readiness scorecard",
  "Scenario checks",
  "Critical gaps",
  "MVP build slice",
  "Top risks",
  "Validation experiments",
  "Developer guardrails",
  "Exportable handoff",
];

const SUPPORTING_BUNDLE = [
  "PRD",
  "SOW",
  "Technical design",
  "System design",
  "Feature specification",
  "Implementation roadmap",
  "Risk register",
  "Compliance checklist",
  "Test strategy",
  "Cost estimate",
  "Coding-agent prompts",
  "Boilerplate scaffold",
];

export default function Home() {
  return (
    <div>
      <section className="border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-12 sm:pt-16 lg:pt-24 lg:pb-20">
          <div className="grid min-w-0 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-accent-700 dark:text-accent-200 bg-accent-50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-700/40 px-2.5 py-1 rounded-full">
                Focused idea evaluation
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-[1.04] break-words">
                Evaluate the idea before you build it.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-ink-700 dark:text-ink-300 leading-relaxed max-w-2xl break-words">
                Turn a rough app idea into a focused readiness report: what to validate, which scenarios can break it,
                what belongs in the MVP, and what a developer needs to build the first version.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <Link
                  href="/projects/new"
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 rounded-md bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-900 dark:hover:bg-white"
                >
                  Start a focused evaluation
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 rounded-md border border-ink-300 bg-white text-ink-800 text-sm font-medium hover:bg-ink-50 dark:bg-ink-900 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
                >
                  Open a project
                </Link>
              </div>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="rounded-lg border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">Input</div>
                <div className="mt-2 font-mono text-xs sm:text-sm text-ink-700 dark:text-ink-300 leading-relaxed break-words">
                  &quot;A real-time queue app for clinics, banks, and restaurants. Customers reserve a spot from anywhere
                  and arrive when their turn is near.&quot;
                </div>
              </div>
              <div className="flex justify-center text-accent-500" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </div>
              <div className="rounded-lg border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">Output</div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EVALUATION_OUTPUTS.map((d) => (
                    <span
                      key={d}
                      className="inline-flex min-w-0 max-w-full items-center rounded-md border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 px-2.5 py-1.5 text-xs text-ink-700 dark:text-ink-200 break-words"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-xs text-ink-500 dark:text-ink-400 break-words">
            Built for founders, developers, product managers, solution architects, engineering leads, and pre-sales teams.
          </div>
        </div>
      </section>

      <section className="border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              A focused plan, not a pile of documents.
            </h2>
            <p className="mt-3 text-ink-700 dark:text-ink-300">
              The guided intake turns unclear ideas into build decisions, validation checks, and implementation guardrails.
            </p>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROOMS.map((r) => (
              <div key={r.n} className="border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-lg p-5">
                <div className="text-xs font-mono text-accent-600 dark:text-accent-300">{r.n}</div>
                <div className="mt-2 text-base font-semibold text-ink-900 dark:text-ink-50">{r.title}</div>
                <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              Export the full bundle only when it helps.
            </h2>
            <p className="mt-3 text-ink-700 dark:text-ink-300">
              The readiness report is the default. The full bundle remains available as supporting material in Markdown,
              DOCX, JSON, and a starter scaffold.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {SUPPORTING_BUNDLE.map((d) => (
              <span
                key={d}
                className="inline-flex min-w-0 max-w-full items-center px-3 py-1.5 rounded-md border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-sm text-ink-800 dark:text-ink-200 break-words"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="mt-6 text-sm text-ink-600 dark:text-ink-400">
            Stable IDs flow across requirements, risks, decisions, tests, features, entities, SLOs, and KPIs so the
            supporting artifacts stay traceable.
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 lg:py-20">
          <div className="border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-lg p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                  Find the build blockers early.
                </h2>
                <p className="mt-3 text-ink-700 dark:text-ink-300 max-w-2xl">
                  Complete the quick intake, review the readiness report, then decide whether to validate, narrow scope,
                  or start implementation.
                </p>
              </div>
              <Link
                href="/projects/new"
                className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 rounded-md bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-900 dark:hover:bg-white"
              >
                Start a focused evaluation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
