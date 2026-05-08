# Blueprint Agent Runtime

This document describes the current Python DeepAgents runtime and the backend path for a durable multi-user agent.

## Current Runtime

The shipped app uses a server-side Python DeepAgents runtime:

- API endpoint: `api/agent.py`
- Agent package: `ai_agents/blueprint_agent`
- Memory: `ai_agents/blueprint_agent/AGENTS.md`
- Skills: `ai_agents/blueprint_agent/skills/*/SKILL.md`
- Subagents: `ai_agents/blueprint_agent/subagents.yaml`

The runtime:

- Runs on the server through a Vercel Python Function.
- Requires `AI_AGENT_MODEL` and the matching provider key.
- Reads the current `Project` schema plus optional user prompt text.
- It proposes missing PM, architecture, data, AI, compliance, GTM, governance, and delivery fields.
- It returns assumptions, confidence, follow-up questions, touched domains, and a schema patch.
- The user reviews proposed changes before applying them.
- Deterministic generators still render every final artifact.

The previous local deterministic helper remains in `src/lib/blueprint-agent.ts` as a schema helper, but the UI now calls `/api/agent` for the primary generation path.

## Request Flow

1. UI sends project context and user message to a server route.
2. Python function validates runtime configuration.
3. DeepAgents loads memory, skills, and subagents from `ai_agents/blueprint_agent`.
4. Agent returns JSON with summary, confidence, follow-up questions, assumptions, and schema-path changes.
5. Python schema contract validates allowed paths and converts changes into a frontend proposal patch.
6. UI displays the proposal and applies it only after user approval.
7. Artifact generators render the final Markdown, DOCX, JSON, and zip outputs.

## Current Workspace Shape

```text
ai_agents/blueprint_agent/
  AGENTS.md
  skills/
    product-blueprint/
      SKILL.md
    architecture-blueprint/
      SKILL.md
    artifact-quality/
      SKILL.md
  subagents.yaml
  blueprint_agent.py
  schema_contract.py
```

## Persistence Model

The current version is synchronous and browser-local for project storage. Future backend tables or collections should include:

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
