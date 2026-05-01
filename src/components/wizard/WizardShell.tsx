"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DOMAIN_LABEL, DOMAIN_ORDER, DomainKey, Project } from "@/lib/schema";
import { Badge, Button, ProgressBar } from "@/components/ui";

export default function WizardShell({
  project,
  step,
  children,
  onMarkComplete,
}: {
  project: Project;
  step: DomainKey;
  children: ReactNode;
  onMarkComplete: () => void;
}) {
  const router = useRouter();
  const idx = DOMAIN_ORDER.indexOf(step);
  const completed = DOMAIN_ORDER.filter((d) => project.progress[d] === "complete").length;
  const prev = DOMAIN_ORDER[idx - 1];
  const next = DOMAIN_ORDER[idx + 1];

  function go(d: DomainKey | undefined) {
    if (!d) {
      router.push(`/projects/${project.id}/artifacts`);
      return;
    }
    router.push(`/projects/${project.id}/intake?step=${d}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-20 self-start">
          <Link href={`/projects/${project.id}`} className="text-xs text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100">
            ← {project.name || "Project"}
          </Link>
          <div className="mt-4">
            <ProgressBar value={completed} max={DOMAIN_ORDER.length} />
            <div className="text-xs text-ink-500 dark:text-ink-400 mt-2">
              {completed} of {DOMAIN_ORDER.length} domains complete
            </div>
          </div>
          <nav className="mt-6 space-y-1">
            {DOMAIN_ORDER.map((d) => {
              const status = project.progress[d];
              const active = d === step;
              return (
                <button
                  key={d}
                  onClick={() => go(d)}
                  className={
                    "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between gap-2 " +
                    (active
                      ? "bg-ink-900 text-white dark:bg-ink-50 dark:text-ink-900"
                      : "text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800")
                  }
                >
                  <span className="truncate">{DOMAIN_LABEL[d]}</span>
                  {status === "complete" && (
                    <span className={active ? "text-emerald-600 dark:text-emerald-700" : "text-emerald-600 dark:text-emerald-400"} aria-label="complete">✓</span>
                  )}
                  {status === "in-progress" && !active && (
                    <span className="text-amber-500" aria-label="in progress">●</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">Step {idx + 1} of {DOMAIN_ORDER.length}</div>
              <h1 className="text-2xl font-semibold tracking-tight mt-1 text-ink-900 dark:text-ink-50">{DOMAIN_LABEL[step]}</h1>
            </div>
            <Badge tone={project.progress[step] === "complete" ? "good" : "warn"}>
              {project.progress[step] === "complete" ? "Complete" : "Draft"}
            </Badge>
          </div>

          <div className="space-y-6">{children}</div>

          <div className="mt-10 flex items-center justify-between border-t border-ink-200 dark:border-ink-800 pt-5">
            <Button variant="ghost" onClick={() => go(prev)} disabled={!prev}>
              ← Previous
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  onMarkComplete();
                }}
              >
                Mark complete
              </Button>
              <Button onClick={() => { onMarkComplete(); go(next); }}>
                {next ? "Save and continue →" : "Save and view artifacts →"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
