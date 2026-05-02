import { Project } from "../schema";
import { fallback, header } from "./util";

export function generateAIArchitecture(p: Project): string {
  const v = p.ai;
  if (!v.needsAI) {
    return [
      header(p, `AI architecture — ${p.name || "Untitled"}`, "AI architecture"),
      `> This project is **not currently scoped as AI-enabled** (set in the AI/Automation step).`,
      ``,
      `If that changes, the generator will populate: pipeline shape (chatbot / agent / RAG / batch), model provider, evaluation strategy, guardrails, prompt management, audit, privacy filtering, and human-in-the-loop checkpoints.`,
    ].join("\n");
  }

  const out: string[] = [
    header(p, `AI architecture — ${p.name || "Untitled"}`, "AI architecture"),
    `## 1. AI capabilities in scope`,
    ``,
    v.kinds.length === 0 ? "_None selected — pick at least one kind in the AI/Automation step._" : v.kinds.map((k) => `- ${k}`).join("\n"),
    ``,
    `## 2. Model provider and stack`,
    ``,
    `- **Provider.** ${v.modelProvider}`,
    `- **Agent framework.** ${v.agentFramework}`,
    `- **Vector database.** ${v.vectorDb}`,
    `- **Observability / tracing.** ${v.observability}`,
    `- **Approved data sources for grounding.** ${fallback(v.dataSources)}`,
    `- **RAG required.** ${v.ragNeeded ? "Yes" : "No"}`,
    `- **Prompt management.** ${v.promptManagement ? "Versioned prompt store with eval-gated rollouts." : "Inline prompts; consider versioning before scale."}`,
    ``,
    `## 3. Pipeline`,
    ``,
    `\`\`\``,
    `[User]`,
    `  │`,
    `  ▼`,
    `[Input safety] ── reject prompt-injection patterns, PII filtering`,
    `  │`,
    `  ▼`,
    v.ragNeeded
      ? `[Retrieval] ── vector search over approved sources, citation capture`
      : `[Context assembly] ── deterministic context only`,
    `  │`,
    `  ▼`,
    `[Model call] ── ${v.modelProvider} with structured output schemas`,
    `  │`,
    `  ▼`,
    `[Output guardrails] ── schema validation, policy checks, PII redaction`,
    `  │`,
    v.humanInLoop ? `  ▼\n[Human review] ── for high-impact actions only` : `  │`,
    `  ▼`,
    `[Action / response] ── log inputs, outputs, sources, latency, tokens`,
    `\`\`\``,
    ``,
    ...(v.agentFramework === "deepagents"
      ? [
          `## 4. DeepAgents workspace pattern`,
          ``,
          `Use DeepAgents for multi-step content, diagram, and handoff generation when outputs must follow product/architecture standards and can be reviewed before use.`,
          ``,
          `| Primitive | Recommended use in this product |`,
          `|---|---|`,
          `| Memory (\`AGENTS.md\`) | Product voice, PM-quality output bar, architecture principles, security posture, diagram conventions. |`,
          `| Skills (\`skills/*/SKILL.md\`) | Architecture blueprint writing, tradeoff review, diagram generation, coding-agent handoff, launch-readiness review. |`,
          `| Subagents (\`subagents.yaml\`) | Security reviewer, platform architect, PM editor, implementation prompt reviewer. |`,
          `| Tools | Mermaid/SVG/PNG diagram generation, schema validation, artifact export, optional web research with source capture. |`,
          ``,
          `Operational guardrail: run this as a server-side job or CLI with explicit API keys; never expose agent filesystem access or provider keys in the browser.`,
          ``,
        ]
      : []),
    `## ${v.agentFramework === "deepagents" ? "5" : "4"}. Guardrails`,
    ``,
    v.guardrails
      ? [
          `- Prompt-injection defenses on all inputs that include third-party content.`,
          `- Output schema validation — reject or repair non-conforming responses.`,
          `- Tool/function calls with allowlists and per-call cost ceilings.`,
          `- Rate-limited and budgeted per user and tenant.`,
          v.privacyFiltering ? `- PII detection and redaction on inputs and outputs.` : null,
        ].filter(Boolean).join("\n")
      : `_Guardrails toggle is off — turn on for production AI features._`,
    ``,
    `## ${v.agentFramework === "deepagents" ? "6" : "5"}. Evaluation`,
    ``,
    v.evaluation
      ? [
          `- **Offline.** Reference suite of inputs with expected behavior categories — regressions block release.`,
          `- **Online.** Sampled production traces graded by humans on quality, safety, and grounding.`,
          `- **Drift.** Periodic re-grading of cached responses to detect quiet regressions from provider updates.`,
          `- **Cost & latency.** Tracked per-feature; alert on cost-per-request or p95 latency anomalies.`,
        ].join("\n")
      : `_Eval toggle is off — eval-driven development is recommended before launch._`,
    ``,
    `## ${v.agentFramework === "deepagents" ? "7" : "6"}. Audit & privacy`,
    ``,
    v.auditLogs ? `- Append-only audit log of prompt, sources, response, model version, and actor.` : `- Audit logs disabled — required if regulated data is in scope.`,
    v.privacyFiltering ? `- Active PII detection on inputs, outputs, and stored embeddings.` : `- Privacy filtering disabled — review before processing personal or health data.`,
    ``,
    `## ${v.agentFramework === "deepagents" ? "8" : "7"}. Human-in-the-loop`,
    ``,
    v.humanInLoop
      ? `Required for high-impact actions. Default: a reviewer queue with SLA on approval; agents proceed only after explicit accept.`
      : `Not required for current scope. Re-enable for any action that creates legal, financial, or clinical effects.`,
    ``,
    `## ${v.agentFramework === "deepagents" ? "9" : "8"}. NIST AI RMF mapping`,
    ``,
    `- **Govern.** Owners and approvers from project governance section; prompt and policy versions tracked.`,
    `- **Map.** Use cases, data classes (see Compliance), and stakeholder impacts documented in this project.`,
    `- **Measure.** Eval suite (§5) plus cost/latency telemetry.`,
    `- **Manage.** Guardrails (§4), HITL (§7), and rollback through prompt-version pins.`,
    ``,
    `## ${v.agentFramework === "deepagents" ? "10" : "9"}. Notes`,
    ``,
    fallback(v.notes),
  ];
  return out.join("\n");
}
