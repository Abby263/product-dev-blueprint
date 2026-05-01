"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";

const TEMPLATES = [
  {
    id: "blank",
    title: "Blank project",
    body: "Walk through every intake domain and tailor the bundle to your context.",
  },
  {
    id: "queue",
    title: "Virtual queue / appointment platform",
    body: "Multi-vertical queueing with branch picking, ETA, reminders, and walk-in handling.",
    seedName: "Virtual queue platform",
    seedOneLiner:
      "A queue and appointment platform that respects users' time, lets them do other things while they wait, and works for healthcare, banking, and retail variants.",
  },
  {
    id: "internal",
    title: "Internal staff console",
    body: "Authenticated console for operators with role-based access and reporting.",
    seedName: "Operations console",
    seedOneLiner: "An internal console for operators to manage workflows, exceptions, and reporting across branches.",
  },
];

export default function NewProjectPage() {
  const router = useRouter();
  const create = useStore((s) => s.createProject);
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [template, setTemplate] = useState<string>("blank");

  function start() {
    const t = TEMPLATES.find((x) => x.id === template);
    const id = create(name || t?.seedName || "Untitled project", oneLiner || t?.seedOneLiner || "");
    router.push(`/projects/${id}/intake`);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">Start a new project</h1>
      <p className="text-sm text-ink-600 dark:text-ink-400 mt-1">
        Pick a starting point. You can change every answer later.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-200 mb-2">Template</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTemplate(t.id);
                  if (t.seedName && !name) setName(t.seedName);
                  if (t.seedOneLiner && !oneLiner) setOneLiner(t.seedOneLiner);
                }}
                className={
                  "text-left border rounded-lg p-4 transition-colors " +
                  (template === t.id
                    ? "border-accent-500 ring-2 ring-accent-200 dark:ring-accent-700/40 bg-accent-50/40 dark:bg-accent-900/20"
                    : "border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-ink-300 dark:hover:border-ink-700")
                }
              >
                <div className="text-sm font-medium text-ink-900 dark:text-ink-50">{t.title}</div>
                <div className="text-xs text-ink-600 dark:text-ink-400 mt-1 leading-relaxed">{t.body}</div>
              </button>
            ))}
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <Field label="Project name" required>
            <Input
              placeholder="e.g. Virtual queue for clinics"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field
            label="One-liner"
            hint="A single sentence that captures who it's for and what it does."
          >
            <Textarea
              rows={3}
              placeholder="A queueing experience that lets patients hold their place from anywhere and arrive only when their turn is near."
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
            />
          </Field>
          <div className="flex justify-end">
            <Button onClick={start} disabled={!name && !TEMPLATES.find((t) => t.id === template)?.seedName}>
              Start intake
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
