"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Card, Field, Textarea } from "@/components/ui";
import type { Project } from "@/lib/schema";

export default function SettingsPage() {
  const { projects, importProject, deleteProject } = useStore();
  const [hydrated, setHydrated] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  useEffect(() => setHydrated(true), []);

  const list = Object.values(projects);

  function exportAll() {
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-dev-blueprint-all-projects.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function tryImport() {
    setImportError(null);
    try {
      const parsed = JSON.parse(importText);
      const arr: Project[] = Array.isArray(parsed) ? parsed : [parsed];
      let count = 0;
      for (const p of arr) {
        if (!p || typeof p !== "object" || !p.name) {
          throw new Error("Each project must be an object with at least a name field.");
        }
        importProject(p);
        count += 1;
      }
      setImportText("");
      alert(`Imported ${count} project${count === 1 ? "" : "s"}.`);
    } catch (e) {
      setImportError(e instanceof Error ? e.message : String(e));
    }
  }

  function clearAll() {
    if (!confirm(`Delete all ${list.length} project${list.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
    list.forEach((p) => deleteProject(p.id));
  }

  if (!hydrated) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/projects" className="text-xs text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100">← Projects</Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-1 text-ink-900 dark:text-ink-50">Settings</h1>
      <p className="text-sm text-ink-600 dark:text-ink-400 mt-1">
        All data is stored locally in your browser. Use the controls below to back up, restore, or wipe your projects.
      </p>

      <div className="mt-8 space-y-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Storage</div>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            {list.length} project{list.length === 1 ? "" : "s"} stored under <code className="text-[11px]">pdb-store-v2</code> in localStorage.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportAll} disabled={list.length === 0}>
              Export all as JSON
            </Button>
            <Button variant="danger" onClick={clearAll} disabled={list.length === 0}>
              Delete all projects
            </Button>
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div>
            <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Import projects</div>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
              Paste a single project JSON or an array of project JSONs (e.g. an export from another browser).
            </p>
          </div>
          <Field label="Project JSON">
            <Textarea rows={10} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder='{"name":"…","oneLiner":"…", …}' />
          </Field>
          {importError && (
            <div className="text-xs text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 px-3 py-2 rounded-md">
              {importError}
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={tryImport} disabled={!importText.trim()}>Import</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-ink-800 dark:text-ink-100">About</div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-2 leading-relaxed">
            Product Dev Blueprint is a schema-first product-definition system. Intake answers populate one canonical{" "}
            <code className="text-[11px]">Project</code> object; every artifact is rendered deterministically from that schema.
            See the README in the repo for architecture details and the future roadmap (LLM orchestration, real-time
            collaboration, hosted backend).
          </p>
        </Card>
      </div>
    </div>
  );
}
