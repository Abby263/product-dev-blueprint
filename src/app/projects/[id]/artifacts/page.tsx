"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Badge, Button, Card } from "@/components/ui";
import { generateBundle } from "@/lib/generators";
import { downloadFile, downloadProjectBundle, downloadProjectJSON } from "@/lib/export";
import { downloadDocx } from "@/lib/docx";
import { DOMAIN_ORDER } from "@/lib/schema";

const ARTIFACT_GROUPS = [
  { title: "Decision brief", keys: ["build-readiness", "exec-summary", "roadmap", "cost-estimate"] },
  { title: "Product", keys: ["prd", "sow", "feature-spec", "rtm"] },
  { title: "Technical", keys: ["tech-spec", "system-design", "data-interface", "adr"] },
  { title: "Risk & compliance", keys: ["risk-register", "compliance", "launch-ops", "test-strategy"] },
  { title: "Implementation", keys: ["coding-agent-prompts", "ai-architecture"] },
];

export default function ArtifactsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const project = useStore((s) => s.projects[id]);
  const [hydrated, setHydrated] = useState(false);
  const [activeKey, setActiveKey] = useState("build-readiness");
  const [downloading, setDownloading] = useState(false);
  useEffect(() => setHydrated(true), []);

  const bundle = useMemo(() => (project ? generateBundle(project) : []), [project]);
  const active = bundle.find((b) => b.key === activeKey) || bundle[0];

  if (!hydrated) return null;
  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <Link href="/projects">
          <Button className="mt-6">Back to projects</Button>
        </Link>
      </div>
    );
  }

  const completed = DOMAIN_ORDER.filter((d) => project.progress[d] === "complete").length;
  const pct = Math.round((completed / DOMAIN_ORDER.length) * 100);

  async function downloadActiveDocx() {
    if (!active) return;
    await downloadDocx(active.filename.replace(/\.md$/, ".docx"), active.title, active.body);
  }

  async function downloadFullBundle() {
    if (!project) return;
    setDownloading(true);
    try {
      await downloadProjectBundle(project);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div className="min-w-0">
          <Link href={`/projects/${project.id}`} className="text-xs text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100">
            ← {project.name || "Project"}
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight mt-1 text-ink-900 dark:text-ink-50 break-words">Artifacts</h1>
          <p className="text-sm text-ink-600 dark:text-ink-400 mt-1 max-w-2xl break-words">
            Start with the readiness report, then open the supporting artifacts as needed. Every artifact is generated
            from this project's canonical schema and updates when intake changes.
          </p>
        </div>
        <div className="flex w-full lg:w-auto flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 lg:shrink-0">
          <Badge tone={pct === 100 ? "good" : pct > 0 ? "accent" : "warn"}>{pct}% intake</Badge>
          <Link href={`/projects/${project.id}/intake`} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full justify-center">Edit intake</Button>
          </Link>
          <Button variant="secondary" className="w-full sm:w-auto justify-center" onClick={() => downloadProjectJSON(project)}>Download JSON</Button>
          <Button className="w-full sm:w-auto justify-center" onClick={downloadFullBundle} disabled={downloading}>
            {downloading ? "Packing…" : "Download bundle (.zip)"}
          </Button>
        </div>
      </div>

      {pct < 100 && (
        <div className="mb-6 border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg p-4 text-sm">
          Intake is not complete ({completed} of {DOMAIN_ORDER.length} domains). Sections will show <em>Not yet captured</em>
          where input is missing. Finish intake to produce a complete bundle.
        </div>
      )}

      <div className="grid min-w-0 lg:grid-cols-[300px_1fr] gap-6">
        <aside className="min-w-0 space-y-5">
          {ARTIFACT_GROUPS.map((group) => {
            const items = group.keys.map((key) => bundle.find((b) => b.key === key)).filter(Boolean);
            if (items.length === 0) return null;
            return (
              <div key={group.title}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {items.map((b) => {
                    if (!b) return null;
                    const isActive = b.key === active.key;
                    return (
                      <button
                        key={b.key}
                        onClick={() => setActiveKey(b.key)}
                        className={
                          "w-full min-w-0 text-left px-3 py-2.5 rounded-md text-sm transition-colors " +
                          (isActive
                            ? "bg-ink-900 text-white dark:bg-ink-50 dark:text-ink-900"
                            : "bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 border border-ink-200 dark:border-ink-800")
                        }
                      >
                        <div className="font-medium break-words">{b.title}</div>
                        <div className={isActive ? "text-ink-400 dark:text-ink-600 text-xs mt-0.5 break-words" : "text-ink-500 dark:text-ink-400 text-xs mt-0.5 break-words"}>
                          {b.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>

        <Card className="p-4 sm:p-8 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">{active.title}</div>
              <div className="text-sm text-ink-500 dark:text-ink-400 mt-1 break-words">Source file: <code className="text-xs">{active.filename}</code></div>
            </div>
            <div className="flex w-full sm:w-auto flex-wrap items-center gap-2">
              <Button className="flex-1 sm:flex-none justify-center" variant="secondary" onClick={() => downloadFile(active.filename, active.body)}>
                .md
              </Button>
              <Button className="flex-1 sm:flex-none justify-center" variant="secondary" onClick={downloadActiveDocx}>.docx</Button>
              <Button
                variant="ghost"
                className="flex-1 sm:flex-none justify-center"
                onClick={() => navigator.clipboard.writeText(active.body)}
              >
                Copy
              </Button>
            </div>
          </div>
          <div className="prose-doc">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.body}</ReactMarkdown>
          </div>
        </Card>
      </div>
    </div>
  );
}
