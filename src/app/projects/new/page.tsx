"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Badge, Button, Card } from "@/components/ui";
import { TEMPLATES, BLANK_TEMPLATE } from "@/lib/templates";
import type { TemplateMeta } from "@/lib/templates/types";

export default function NewProjectPage() {
  const router = useRouter();
  const createDraftProject = useStore((s) => s.createDraftProject);
  const createDraftFromTemplate = useStore((s) => s.createDraftFromTemplate);

  function start(template: TemplateMeta) {
    if (!template.payload) {
      const id = createDraftProject("Untitled project", "");
      router.push(`/projects/${id}/intake`);
      return;
    }

    const id = createDraftFromTemplate(template.payload);
    router.push(`/projects/${id}/intake`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
        Start a new blueprint
      </h1>
      <p className="text-sm text-ink-600 dark:text-ink-400 mt-1 max-w-2xl">
        Choose a starting point. Project details open in the intake flow after selection.
      </p>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100 mb-3">Templates</h2>
        <div className="grid min-w-0 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => start(template)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onSelect,
}: {
  template: TemplateMeta;
  onSelect: () => void;
}) {
  const isBlank = template.id === BLANK_TEMPLATE.id;
  return (
    <Card className="w-full max-w-full overflow-hidden p-4 sm:p-5 h-full flex flex-col min-w-0">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0 text-sm font-semibold text-ink-900 dark:text-ink-50 break-words">
          {template.title}
        </div>
        {!isBlank && <Badge tone="good">Pre-filled</Badge>}
      </div>
      <p className="mt-1.5 text-xs text-ink-600 dark:text-ink-400 leading-relaxed break-words">{template.blurb}</p>

      {template.vertical && (
        <div className="mt-3 text-[11px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
          {template.vertical}
        </div>
      )}

      {template.stackChips && template.stackChips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {template.stackChips.map((chip) => (
            <span
              key={chip}
              className="max-w-full break-words text-[10px] px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-200"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {template.complianceChips && template.complianceChips.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {template.complianceChips.map((chip) => (
            <span
              key={chip}
              className="max-w-full break-words text-[10px] px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {template.scaleChip && (
        <div className="mt-3 text-[11px] text-ink-500 dark:text-ink-400 break-words">{template.scaleChip}</div>
      )}

      <div className="mt-auto pt-4">
        <Button onClick={onSelect} className="w-full justify-center">
          {isBlank ? "Start blank" : "Use template"}
        </Button>
      </div>
    </Card>
  );
}
