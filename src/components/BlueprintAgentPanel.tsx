"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildAgentProposal, type AgentMode, type AgentProposal } from "@/lib/blueprint-agent";
import { useStore } from "@/lib/store";
import {
  DOMAIN_LABEL,
  DOMAIN_OWNER,
  DOMAIN_OWNER_LABEL,
  type DomainKey,
  type DomainOwner,
  type Project,
} from "@/lib/schema";
import { Badge, Button, Card, Field, Select, Textarea } from "@/components/ui";

const MODES: Array<{ value: AgentMode; label: string; helper: string }> = [
  {
    value: "complete-missing",
    label: "Complete missing fields",
    helper: "Use the full project context and fill empty product, architecture, delivery, and governance fields.",
  },
  {
    value: "product",
    label: "Product manager pass",
    helper: "Focus on problem, market, MVP, personas, requirements, GTM, and KPIs.",
  },
  {
    value: "architecture",
    label: "Solution architect pass",
    helper: "Focus on HLD, LLD, schema, APIs, cloud, security, scaling, data, and AI architecture.",
  },
  {
    value: "review",
    label: "Readiness review",
    helper: "Find gaps and propose schema updates without overwriting user-entered details.",
  },
];

function ownerTone(owner: DomainOwner): "neutral" | "accent" | "warn" {
  if (owner === "technical-solution-architect") return "accent";
  if (owner === "product-manager") return "warn";
  return "neutral";
}

export default function BlueprintAgentPanel({
  project,
  focusStep,
  compact = false,
  autoRun = false,
}: {
  project: Project;
  focusStep?: DomainKey;
  compact?: boolean;
  autoRun?: boolean;
}) {
  const updateProject = useStore((s) => s.updateProject);
  const markStep = useStore((s) => s.markStep);
  const [mode, setMode] = useState<AgentMode>("complete-missing");
  const [prompt, setPrompt] = useState("");
  const [proposal, setProposal] = useState<AgentProposal | null>(null);
  const [applied, setApplied] = useState(false);
  const didAutoRun = useRef(false);

  const selectedMode = useMemo(() => MODES.find((entry) => entry.value === mode) || MODES[0], [mode]);
  const showFocusHint = Boolean(focusStep && mode !== "complete-missing");
  const visibleChanges = proposal?.changes.slice(0, compact ? 5 : 10) || [];

  function generateProposal() {
    const next = buildAgentProposal(project, {
      prompt: prompt.trim() || undefined,
      mode,
      focusStep: mode === "complete-missing" ? undefined : focusStep,
    });
    setProposal(next);
    setApplied(false);
  }

  useEffect(() => {
    if (!autoRun || didAutoRun.current) return;
    didAutoRun.current = true;
    generateProposal();
  }, [autoRun, project.id]);

  function applyProposal() {
    if (!proposal || proposal.changes.length === 0) return;
    updateProject(project.id, proposal.patch);
    proposal.touchedDomains.forEach((domain) => markStep(project.id, domain, "in-progress"));
    setApplied(true);
  }

  return (
    <Card className="p-4 sm:p-5 border-accent-200 dark:border-accent-800">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">Blueprint Agent</Badge>
            <Badge>Review before apply</Badge>
          </div>
          <h2 className="mt-3 text-lg sm:text-xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
            Autogenerate the remaining blueprint
          </h2>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-400 leading-relaxed max-w-3xl">
            Add whatever details you know. The agent proposes schema changes, follow-up questions, and assumptions; the
            existing generators keep the final document format stable.
          </p>
        </div>
        {showFocusHint && focusStep && (
          <div className="lg:max-w-xs rounded-md border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 p-3">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 dark:text-ink-400">Current focus</div>
            <div className="mt-1 text-sm font-medium text-ink-900 dark:text-ink-50">{DOMAIN_LABEL[focusStep]}</div>
            <div className="mt-2">
              <Badge tone={ownerTone(DOMAIN_OWNER[focusStep])}>
                {DOMAIN_OWNER_LABEL[DOMAIN_OWNER[focusStep]]}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid min-w-0 lg:grid-cols-[260px_1fr] gap-3">
        <Field label="Agent mode" hint={selectedMode.helper}>
          <Select value={mode} onChange={(event) => setMode(event.target.value as AgentMode)}>
            {MODES.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Idea details, answers, or requested changes"
          hint="Leave this blank to use the current project fields. Add follow-up answers here and rerun the proposal."
        >
          <Textarea
            rows={compact ? 3 : 4}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: target Azure, enterprise SSO, RAG over product docs, 50k monthly users, SOC 2 needed..."
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <Button onClick={generateProposal} className="w-full sm:w-auto justify-center">
          Generate proposal
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setPrompt("");
            setProposal(null);
            setApplied(false);
          }}
          className="w-full sm:w-auto justify-center"
        >
          Clear
        </Button>
        {applied && <span className="text-sm text-emerald-700 dark:text-emerald-300">Proposal applied as draft.</span>}
      </div>

      {proposal && (
        <div className="mt-5 border-t border-ink-200 dark:border-ink-800 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">{proposal.title}</div>
              <p className="mt-1 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{proposal.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Badge tone={proposal.confidence === "high" ? "good" : proposal.confidence === "medium" ? "accent" : "warn"}>
                {proposal.confidence} confidence
              </Badge>
              <Badge>{proposal.changes.length} changes</Badge>
              <Badge>{proposal.followUpQuestions.length} questions</Badge>
            </div>
          </div>

          {proposal.touchedDomains.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {proposal.touchedDomains.map((domain) => (
                <Badge key={domain} tone={ownerTone(DOMAIN_OWNER[domain])}>
                  {DOMAIN_LABEL[domain]}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-5 grid min-w-0 lg:grid-cols-2 gap-4">
            <ReviewList
              title="Follow-up questions"
              empty="No blocking questions for this pass."
              items={proposal.followUpQuestions}
            />
            <ReviewList title="Assumptions" empty="No new assumptions were added." items={proposal.assumptions} />
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">Proposed schema updates</div>
              {proposal.changes.length > visibleChanges.length && (
                <span className="text-xs text-ink-500 dark:text-ink-400">
                  Showing {visibleChanges.length} of {proposal.changes.length}
                </span>
              )}
            </div>
            <div className="mt-2 divide-y divide-ink-200 dark:divide-ink-800 rounded-md border border-ink-200 dark:border-ink-800 overflow-hidden">
              {visibleChanges.length === 0 ? (
                <div className="p-3 text-sm text-ink-600 dark:text-ink-400">No schema updates proposed.</div>
              ) : (
                visibleChanges.map((change) => (
                  <div key={`${change.path}-${change.reason}`} className="p-3 bg-white dark:bg-ink-900">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <code className="text-xs text-accent-700 dark:text-accent-300 break-words">{change.path}</code>
                      <span className="text-xs text-ink-500 dark:text-ink-400">{change.reason}</span>
                    </div>
                    <div className="mt-2 grid min-w-0 sm:grid-cols-2 gap-2 text-xs">
                      <ValueBox label="Current" value={change.previous} />
                      <ValueBox label="Proposed" value={change.next} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
              User-entered fields are preserved unless they are blank or match known defaults. Accepted updates are
              stored as draft intake fields and regenerate all artifacts.
            </p>
            <Button onClick={applyProposal} disabled={proposal.changes.length === 0} className="w-full sm:w-auto justify-center">
              Apply approved changes
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function ReviewList({ title, empty, items }: { title: string; empty: string; items: string[] }) {
  return (
    <div className="rounded-md border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 p-3">
      <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">{title}</div>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1.5 text-sm text-ink-700 dark:text-ink-300">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
              <span className="break-words">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ValueBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 p-2">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">{label}</div>
      <div className="mt-1 text-ink-700 dark:text-ink-300 break-words">{value}</div>
    </div>
  );
}
