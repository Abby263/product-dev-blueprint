# Blueprint Agent Runtime

This document describes the current agent-assisted flow and the intended backend path for a real DeepAgents runtime.

## Current Runtime

The shipped app uses a local schema-aware Blueprint Agent helper in `src/lib/blueprint-agent.ts`.

- It runs in the browser and requires no API keys.
- It reads the current `Project` schema plus optional user prompt text.
- It proposes missing PM, architecture, data, AI, compliance, GTM, governance, and delivery fields.
- It returns assumptions, confidence, follow-up questions, touched domains, and a schema patch.
- The user reviews proposed changes before applying them.
- Deterministic generators still render every final artifact.

This is intentionally not a live model integration. It provides the product workflow and review UX without introducing server credentials or background jobs.

## Future DeepAgents Runtime

A real DeepAgents integration should run server-side and preserve the same contract:

1. UI sends project context and user message to a server route.
2. Server creates an `AgentRun` and queues work when the job can be long-running.
3. Worker runs a DeepAgents content-writer workspace with memory, skills, and subagents.
4. Agent produces a structured `Project` schema patch, assumptions, questions, confidence, and review notes.
5. UI displays the proposal and applies it only after user approval.
6. Artifact generators render the final Markdown, DOCX, JSON, and zip outputs.

Suggested workspace shape:

```text
agents/content-writer/
  AGENTS.md
  skills/
    product-blueprint/SKILL.md
    architecture-blueprint/SKILL.md
    artifact-quality/SKILL.md
  subagents.yaml
  content_writer.py
```

## Persistence Model

Future backend tables or collections should include:

- `organizations`
- `users`
- `projects`
- `project_versions`
- `agent_runs`
- `agent_messages`
- `artifact_versions`
- `feedback_events`
- `case_studies`
- `prompt_versions`
- `eval_runs`
- `audit_events`

## Security Rules

- Keep provider keys server-side only.
- Redact secrets and unnecessary PII before model calls and traces.
- Tenant-scope every project, artifact, run, trace, and feedback event.
- Require RBAC for applying agent proposals and exporting bundles.
- Log accepted/rejected changes for audit and future evaluation.
- Make any self-learning loop opt-in and evaluation-gated.

