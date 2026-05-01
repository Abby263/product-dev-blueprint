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

export default function ArtifactsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const project = useStore((s) => s.projects[id]);
  const [hydrated, setHydrated] = useState(false);
  const [activeKey, setActiveKey] = useState("exec-summary");
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div className="min-w-0">
          <Link href={`/projects/${project.id}`} className="text-xs text-ink-500 hover:text-ink-800">
            ← {project.name || "Project"}
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight mt-1">Artifacts</h1>
          <p className="text-sm text-ink-600 mt-1 max-w-2xl">
            Every document below is generated from this project's canonical schema. Change an answer in intake and the
            relevant sections will update consistently. Bundle includes Markdown + DOCX formats and the raw project.json.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge tone={pct === 100 ? "good" : pct > 0 ? "accent" : "warn"}>{pct}% intake</Badge>
          <Link href={`/projects/${project.id}/intake`}>
            <Button variant="secondary">Edit intake</Button>
          </Link>
          <Button variant="secondary" onClick={() => downloadProjectJSON(project)}>Download JSON</Button>
          <Button onClick={downloadFullBundle} disabled={downloading}>
            {downloading ? "Packing…" : "Download bundle (.zip)"}
          </Button>
        </div>
      </div>

      {pct < 100 && (
        <div className="mb-6 border border-amber-200 bg-amber-50 text-amber-800 rounded-lg p-4 text-sm">
          Intake is not complete ({completed} of {DOMAIN_ORDER.length} domains). Sections will show <em>Not yet captured</em>
          where input is missing. Finish intake to produce a complete bundle.
        </div>
      )}

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-1">
          {bundle.map((b) => {
            const isActive = b.key === active.key;
            return (
              <button
                key={b.key}
                onClick={() => setActiveKey(b.key)}
                className={
                  "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors " +
                  (isActive
                    ? "bg-ink-900 text-white"
                    : "bg-white text-ink-800 hover:bg-ink-100 border border-ink-200")
                }
              >
                <div className="font-medium">{b.title}</div>
                <div className={isActive ? "text-ink-300 text-xs mt-0.5" : "text-ink-500 text-xs mt-0.5"}>
                  {b.description}
                </div>
              </button>
            );
          })}
        </aside>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-500">{active.title}</div>
              <div className="text-sm text-ink-500 mt-1">Source file: <code className="text-xs">{active.filename}</code></div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => downloadFile(active.filename, active.body)}>
                .md
              </Button>
              <Button variant="secondary" onClick={downloadActiveDocx}>.docx</Button>
              <Button
                variant="ghost"
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
