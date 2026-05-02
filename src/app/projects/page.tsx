"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, EmptyState, ProgressBar } from "@/components/ui";
import { DOMAIN_ORDER, type Project } from "@/lib/schema";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const { projects, order, deleteProject, duplicateProject } = useStore();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const list = order
    .map((id) => projects[id])
    .filter((project): project is Project => Boolean(project) && project.listed !== false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight break-words">Projects</h1>
          <p className="text-sm text-ink-600 dark:text-ink-400 mt-1 break-words">
            Each project owns a canonical schema. Open it to continue intake or regenerate the readiness report.
          </p>
        </div>
        <Link href="/projects/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto justify-center">New project</Button>
        </Link>
      </div>

      {!hydrated ? null : list.length === 0 ? (
        <EmptyState
          title="No projects yet"
          body="Start a new project to evaluate the idea, identify scenarios, and generate a developer-ready handoff."
          action={
            <Link href="/projects/new">
              <Button>Start a new project</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid min-w-0 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p) => {
            const completed = DOMAIN_ORDER.filter((d) => p.progress[d] === "complete").length;
            const pct = Math.round((completed / DOMAIN_ORDER.length) * 100);
            return (
              <Card key={p.id} className="p-4 sm:p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/projects/${p.id}`} className="block">
                      <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50 truncate hover:underline">{p.name}</h3>
                    </Link>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 line-clamp-2">{p.oneLiner || "No one-liner yet."}</p>
                  </div>
                  <Badge tone={pct === 100 ? "good" : pct > 0 ? "accent" : "neutral"}>{pct}%</Badge>
                </div>

                <div className="mt-4">
                  <ProgressBar value={completed} max={DOMAIN_ORDER.length} />
                  <div className="text-xs text-ink-500 dark:text-ink-400 mt-2">
                    {completed} of {DOMAIN_ORDER.length} domains complete
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
                  <span>Updated {new Date(p.updatedAt).toLocaleString()}</span>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <Link href={`/projects/${p.id}/intake`} className="w-full sm:flex-1">
                    <Button variant="primary" className="w-full justify-center">Continue intake</Button>
                  </Link>
                  <Link href={`/projects/${p.id}/artifacts`} className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full justify-center">Artifacts</Button>
                  </Link>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <button
                    className="text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100"
                    onClick={() => duplicateProject(p.id)}
                  >
                    Duplicate
                  </button>
                  <button
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"? This cannot be undone.`)) deleteProject(p.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
