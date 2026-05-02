"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, Field, Input, Textarea } from "@/components/ui";
import { TEMPLATES, BLANK_TEMPLATE } from "@/lib/templates";
import type { TemplateMeta } from "@/lib/templates/types";

export default function NewProjectPage() {
  const router = useRouter();
  const create = useStore((s) => s.createProject);
  const createFromTemplate = useStore((s) => s.createFromTemplate);

  const [activeId, setActiveId] = useState<string>(TEMPLATES[0]?.id ?? BLANK_TEMPLATE.id);
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");

  const active = TEMPLATES.find((t) => t.id === activeId) ?? BLANK_TEMPLATE;
  const isBlank = active.id === BLANK_TEMPLATE.id;

  function start() {
    if (isBlank) {
      const id = create(name || "Untitled project", oneLiner || "");
      router.push(`/projects/${id}/intake`);
      return;
    }

    if (!active.payload) {
      const id = create(name || active.title, oneLiner || active.blurb);
      router.push(`/projects/${id}/intake`);
      return;
    }

    // Templates ship with their own name + oneLiner, but we let the user
    // optionally override before creating.
    const id = createFromTemplate({
      ...active.payload,
      ...(name ? { name } : {}),
      ...(oneLiner ? { oneLiner } : {}),
    });
    router.push(`/projects/${id}/intake`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
        Start a new blueprint
      </h1>
      <p className="text-sm text-ink-600 dark:text-ink-400 mt-1 max-w-2xl">
        Pick a fully-populated template to use as a reference, or start blank. You can edit every answer afterwards.
      </p>

      <div className="mt-8 grid min-w-0 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100 mb-3">Templates</h2>
          <div className="grid min-w-0 sm:grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                active={t.id === activeId}
                onClick={() => {
                  setActiveId(t.id);
                  if (!name && t.payload) setName("");
                  if (!oneLiner && t.payload) setOneLiner("");
                }}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <Card className="w-full p-5 sm:p-6 space-y-4 lg:sticky lg:top-20">
            <div>
              <div className="text-xs uppercase tracking-wider text-accent-700 dark:text-accent-300">
                Selected template
              </div>
              <div className="mt-1 text-base font-semibold text-ink-900 dark:text-ink-50 break-words">
                {active.title}
              </div>
              <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400 leading-relaxed break-words">{active.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {active.stackChips?.map((c) => (
                  <span key={c} className="max-w-full break-words text-[11px] px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-200">
                    {c}
                  </span>
                ))}
              </div>
              {active.complianceChips && active.complianceChips.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {active.complianceChips.map((c) => (
                    <span key={c} className="max-w-full break-words text-[11px] px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {active.scaleChip && (
                <div className="mt-2 text-xs text-ink-500 dark:text-ink-400 break-words">{active.scaleChip}</div>
              )}
              {!isBlank && (
                <div className="mt-3">
                  <Badge tone="good">All 14 domains pre-filled</Badge>
                </div>
              )}
            </div>

            <div className="border-t border-ink-200 dark:border-ink-800 pt-4 space-y-3">
              <Field
                label="Project name"
                hint={isBlank ? undefined : `Defaults to "${active.title}". Override here if you want a different name.`}
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isBlank ? "e.g. Virtual queue for clinics" : active.title}
                />
              </Field>
              <Field
                label="One-liner"
                hint={isBlank ? "One sentence: who it's for and what it does." : "Override the template's one-liner if you want."}
              >
                <Textarea
                  rows={2}
                  value={oneLiner}
                  onChange={(e) => setOneLiner(e.target.value)}
                  placeholder={isBlank ? "A queueing experience that lets patients hold their place from anywhere…" : active.blurb}
                />
              </Field>
            </div>

            <div className="flex justify-end">
              <Button onClick={start} className="w-full sm:w-auto justify-center">
                {isBlank ? "Start blank intake" : "Use this template"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  active,
  onClick,
}: {
  template: TemplateMeta;
  active: boolean;
  onClick: () => void;
}) {
  const isBlank = template.id === "blank";
  return (
    <button
      onClick={onClick}
      className={
        "w-full max-w-full overflow-hidden text-left border rounded-xl p-4 sm:p-5 transition-colors h-full flex flex-col min-w-0 " +
        (active
          ? "border-accent-500 ring-2 ring-accent-200 dark:ring-accent-700/40 bg-accent-50/40 dark:bg-accent-900/20"
          : "border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-ink-300 dark:hover:border-ink-700")
      }
    >
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0 text-sm font-semibold text-ink-900 dark:text-ink-50 break-words">{template.title}</div>
        {!isBlank && <Badge tone={active ? "accent" : "good"}>Pre-filled</Badge>}
      </div>
      <p className="mt-1.5 text-xs text-ink-600 dark:text-ink-400 leading-relaxed break-words">{template.blurb}</p>

      {template.vertical && (
        <div className="mt-3 text-[11px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
          {template.vertical}
        </div>
      )}

      {template.stackChips && template.stackChips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {template.stackChips.map((c) => (
            <span
              key={c}
              className="max-w-full break-words text-[10px] px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-200"
            >
              {c}
            </span>
          ))}
        </div>
      )}
      {template.complianceChips && template.complianceChips.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {template.complianceChips.map((c) => (
            <span
              key={c}
              className="max-w-full break-words text-[10px] px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
            >
              {c}
            </span>
          ))}
        </div>
      )}
      {template.scaleChip && (
        <div className="mt-auto pt-3 text-[11px] text-ink-500 dark:text-ink-400 break-words">{template.scaleChip}</div>
      )}
    </button>
  );
}
