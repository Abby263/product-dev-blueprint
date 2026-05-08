"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { suggestProjectTitle } from "@/lib/blueprint-agent";
import { Badge, Button, Card, Field, Textarea } from "@/components/ui";
import { TEMPLATES, BLANK_TEMPLATE } from "@/lib/templates";
import type { TemplateMeta } from "@/lib/templates/types";

const OWNER_SECTIONS = [
  {
    owner: "Product Manager",
    title: "Market, scope, and decision quality",
    items: ["Problem and urgency", "Buyer and user", "Success metrics", "MVP boundary", "Validation plan"],
  },
  {
    owner: "Solution Architect",
    title: "Architecture, data, and delivery risk",
    items: ["HLD and LLD", "Schema design", "OAuth / SSO", "Security review", "Infra and scaling"],
  },
  {
    owner: "Engineering",
    title: "Build handoff and execution",
    items: ["Implementation slices", "Acceptance criteria", "Test strategy", "Risk register", "Coding-agent prompts"],
  },
];

const STARTING_PATHS = [
  { label: "Use a realistic template", body: "Prefilled enterprise scenarios with stack, scale, security, and architecture details." },
  { label: "Start blank", body: "Answer every PM and architect section from scratch for a custom idea." },
  { label: "Review before generate", body: "Project details open after selection, so the template card stays focused on choosing the starting point." },
];

const TEMPLATE_FILTERS = ["All", "AI", "SaaS", "Marketplace", "Internal", "Blank"];

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useStore((s) => s.createProject);
  const createDraftProject = useStore((s) => s.createDraftProject);
  const createDraftFromTemplate = useStore((s) => s.createDraftFromTemplate);
  const [agentIdea, setAgentIdea] = useState("");

  function start(template: TemplateMeta) {
    if (!template.payload) {
      const id = createDraftProject("Untitled project", "");
      router.push(`/projects/${id}/intake`);
      return;
    }

    const id = createDraftFromTemplate(template.payload);
    router.push(`/projects/${id}/intake`);
  }

  function startWithAgent() {
    const idea = agentIdea.trim();
    if (!idea) return;

    const title = suggestProjectTitle(idea);
    const oneLiner = idea.length > 160 ? `${idea.slice(0, 157).trim()}...` : idea;
    const id = createProject(title, oneLiner, idea);
    router.push(`/projects/${id}/intake?agent=1`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <section className="grid min-w-0 lg:grid-cols-[0.78fr_1.22fr] gap-5 lg:gap-6">
        <div className="rounded-lg border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 sm:p-6">
          <Badge tone="accent">New blueprint</Badge>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
            Choose a starting point
          </h1>
          <p className="mt-3 text-sm sm:text-base text-ink-700 dark:text-ink-300 leading-relaxed max-w-2xl">
            Select a template that matches the product shape. The intake opens after selection, where PM and architect
            answers can be reviewed and changed before generation.
          </p>

          <div className="mt-5 grid gap-2">
            {STARTING_PATHS.map((path, index) => (
              <div key={path.label} className="flex gap-3 rounded-md border border-ink-200 dark:border-ink-800 p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-900 dark:bg-ink-50 text-[11px] font-semibold text-white dark:text-ink-900">
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">{path.label}</div>
                  <p className="mt-1 text-xs sm:text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{path.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-w-0 md:grid-cols-3 gap-3">
          {OWNER_SECTIONS.map((section) => (
            <Card key={section.owner} className="p-4 sm:p-5">
              <div className="text-[11px] uppercase tracking-wider text-accent-600 dark:text-accent-300">
                {section.owner}
              </div>
              <div className="mt-2 text-base font-semibold text-ink-900 dark:text-ink-50">{section.title}</div>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-600 dark:text-ink-400">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <Card className="p-4 sm:p-5 border-accent-200 dark:border-accent-800">
          <div className="grid min-w-0 lg:grid-cols-[0.75fr_1.25fr] gap-4 lg:gap-6">
            <div>
              <Badge tone="accent">Agent-assisted</Badge>
              <h2 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                Start with a rough idea
              </h2>
              <p className="mt-2 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                Share the idea in plain language. The Blueprint Agent can ask follow-up questions, propose missing PM
                and architect inputs, and keep all generated files in the existing format.
              </p>
            </div>
            <div className="min-w-0">
              <Field
                label="Initial idea"
                hint="You can add more details later from any project page. Empty fields will be proposed by the agent."
              >
                <Textarea
                  rows={4}
                  value={agentIdea}
                  onChange={(event) => setAgentIdea(event.target.value)}
                  placeholder="Example: Build an Azure-based RAG chatbot for enterprise support teams with SSO, source citations, admin review, audit logs, and scalable worker jobs..."
                />
              </Field>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <Button onClick={startWithAgent} disabled={!agentIdea.trim()} className="w-full sm:w-auto justify-center">
                  Create with agent
                </Button>
                <span className="text-xs text-ink-500 dark:text-ink-400">
                  You will review changes before applying them.
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-8 grid min-w-0 lg:grid-cols-[260px_1fr] gap-5 lg:gap-6">
        <aside className="space-y-4">
          <Card className="p-4">
            <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">Template library</div>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
              Templates are intentionally different across stack, cloud, data model, compliance posture, and scale.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {TEMPLATE_FILTERS.map((filter) => (
                <span
                  key={filter}
                  className="rounded-md border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 px-2 py-1 text-xs text-ink-700 dark:text-ink-300"
                >
                  {filter}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">Generated output</div>
            <div className="mt-3 space-y-2 text-sm text-ink-600 dark:text-ink-400">
              <OutputRow label="Decision" value="Readiness and gaps" />
              <OutputRow label="Product" value="PRD and MVP scope" />
              <OutputRow label="Architecture" value="HLD, LLD, schema, APIs" />
              <OutputRow label="Build" value="Tasks, tests, prompts" />
            </div>
          </Card>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                Pick the closest scenario
              </h2>
              <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
                Use the Select button on a card to create the project and continue to intake.
              </p>
            </div>
            <div className="text-xs text-ink-500 dark:text-ink-400">
              {TEMPLATES.length} starting points
            </div>
          </div>

          <div className="mt-4 grid min-w-0 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <TemplateCard key={template.id} template={template} onSelect={() => start(template)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function OutputRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b last:border-b-0 border-ink-200 dark:border-ink-800 pb-2 last:pb-0">
      <span className="font-medium text-ink-800 dark:text-ink-200">{label}</span>
      <span className="text-right">{value}</span>
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
  const platform = template.payload?.platform;
  const systemDesign = template.payload?.systemDesign;
  const market = template.payload?.market;

  const stackChips = template.stackChips?.length
    ? template.stackChips
    : compact([platform?.frontend, platform?.backend, platform?.database]);

  const governanceChips = template.complianceChips?.length
    ? template.complianceChips
    : compact([platform?.authMethod, platform?.cloud, systemDesign?.authArchitecture]);

  return (
    <Card className="w-full max-w-full overflow-hidden p-4 sm:p-5 h-full flex flex-col min-w-0">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-ink-900 dark:text-ink-50 break-words">{template.title}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
            {template.vertical || market?.vertical || "Custom"}
          </div>
        </div>
        {isBlank ? <Badge>Blank</Badge> : <Badge tone="good">Prefilled</Badge>}
      </div>

      <p className="mt-3 text-sm text-ink-600 dark:text-ink-400 leading-relaxed break-words">{template.blurb}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Signal label="Cloud" value={platform?.cloud || "Choose"} />
        <Signal label="Pattern" value={systemDesign?.architecturePattern || "Choose"} />
        <Signal label="Auth" value={platform?.authMethod || "Choose"} />
        <Signal label="Data" value={platform?.database || "Choose"} />
      </div>

      {stackChips.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] font-medium text-ink-500 dark:text-ink-400">Stack direction</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {stackChips.slice(0, 5).map((chip) => (
              <Chip key={chip} tone="neutral">
                {chip}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {governanceChips.length > 0 && (
        <div className="mt-3">
          <div className="text-[11px] font-medium text-ink-500 dark:text-ink-400">Governance and scale</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {governanceChips.slice(0, 5).map((chip) => (
              <Chip key={chip} tone="warn">
                {chip}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-md border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 p-3 text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
        {template.scaleChip || "Define audience, stack, architecture, and delivery constraints in the intake."}
      </div>

      <div className="mt-auto pt-4">
        <Button onClick={onSelect} className="w-full justify-center">
          {isBlank ? "Start blank" : "Select template"}
        </Button>
      </div>
    </Card>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-200 dark:border-ink-800 p-2">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">{label}</div>
      <div className="mt-1 font-medium text-ink-900 dark:text-ink-100 break-words">{value}</div>
    </div>
  );
}

function Chip({
  children,
  tone,
}: {
  children: string;
  tone: "neutral" | "warn";
}) {
  const classes =
    tone === "warn"
      ? "border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
      : "border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-200";

  return (
    <span className={`max-w-full break-words text-[11px] px-2 py-1 rounded border ${classes}`}>
      {children}
    </span>
  );
}

function compact(values: Array<string | undefined | null>) {
  return values.filter((value): value is string => Boolean(value));
}
