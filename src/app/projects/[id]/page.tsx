"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { DOMAIN_BLURB, DOMAIN_LABEL, DOMAIN_ORDER } from "@/lib/schema";

export default function ProjectOverview() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const project = useStore((s) => s.projects[id]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;
  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <p className="text-ink-600 mt-2">It may have been deleted in another tab.</p>
        <Link href="/projects">
          <Button className="mt-6">Back to projects</Button>
        </Link>
      </div>
    );
  }

  const completed = DOMAIN_ORDER.filter((d) => project.progress[d] === "complete").length;
  const pct = Math.round((completed / DOMAIN_ORDER.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="min-w-0">
          <Link href="/projects" className="text-xs text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100">← All projects</Link>
          <h1 className="text-3xl font-semibold tracking-tight mt-1 text-ink-900 dark:text-ink-50 break-words">{project.name}</h1>
          <p className="text-ink-700 dark:text-ink-300 mt-1 max-w-2xl break-words">{project.oneLiner || "No one-liner yet."}</p>
        </div>
        <div className="flex w-full sm:w-auto flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:shrink-0">
          <Link href={`/projects/${project.id}/intake`} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full justify-center">Edit intake</Button>
          </Link>
          <Link href={`/projects/${project.id}/artifacts`} className="w-full sm:w-auto">
            <Button className="w-full justify-center">View readiness</Button>
          </Link>
        </div>
      </div>

      <Card className="mt-8 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-ink-900 dark:text-ink-50">Intake progress</div>
            <div className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{completed} of {DOMAIN_ORDER.length} domains complete</div>
          </div>
          <Badge tone={pct === 100 ? "good" : pct > 0 ? "accent" : "neutral"}>{pct}%</Badge>
        </div>
        <div className="mt-4">
          <ProgressBar value={completed} max={DOMAIN_ORDER.length} />
        </div>
      </Card>

      <h2 className="text-lg font-semibold mt-10 mb-3 text-ink-900 dark:text-ink-50">Domains</h2>
      <div className="grid min-w-0 sm:grid-cols-2 gap-3">
        {DOMAIN_ORDER.map((d) => {
          const status = project.progress[d];
          return (
            <button
              key={d}
              onClick={() => router.push(`/projects/${project.id}/intake?step=${d}`)}
              className="min-w-0 text-left border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 rounded-lg p-4 hover:border-ink-300 dark:hover:border-ink-700"
            >
              <div className="flex min-w-0 items-center justify-between gap-2">
                <div className="min-w-0 text-sm font-medium text-ink-900 dark:text-ink-50 break-words">{DOMAIN_LABEL[d]}</div>
                <Badge tone={status === "complete" ? "good" : status === "in-progress" ? "warn" : "neutral"}>
                  {status === "complete" ? "Complete" : status === "in-progress" ? "Draft" : "Empty"}
                </Badge>
              </div>
              <div className="text-xs text-ink-600 dark:text-ink-400 mt-1.5 leading-relaxed break-words">{DOMAIN_BLURB[d]}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
