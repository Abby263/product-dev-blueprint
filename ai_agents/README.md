# AI Agents

This folder contains server-side AI agent runtimes for Product Dev Blueprint.

## Current Agent

`ai_agents/blueprint_agent` is a Python DeepAgents runtime used by the `/api/agent` Vercel function.

It contains:

- `AGENTS.md` - persistent agent memory and output contract
- `skills/*/SKILL.md` - procedural workflows loaded on demand
- `subagents.yaml` - Product Manager, Technical Solution Architect, and artifact quality reviewer subagents
- `blueprint_agent.py` - DeepAgents wiring and JSON response parsing
- `schema_contract.py` - schema-path validation and frontend proposal conversion

The agent returns a proposal for the canonical Project schema. It does not write final Markdown artifacts directly; accepted changes are passed back to the existing TypeScript generators.

## Runtime Contract

The frontend calls:

```text
POST /api/agent
```

Request:

```json
{
  "project": {},
  "mode": "complete-missing",
  "focusStep": null,
  "prompt": "User instruction",
  "threadId": "project-id"
}
```

Response:

```json
{
  "ok": true,
  "source": "deepagents",
  "proposal": {
    "title": "LLM complete blueprint draft",
    "summary": "What changed",
    "mode": "complete-missing",
    "confidence": "medium",
    "followUpQuestions": [],
    "assumptions": [],
    "changes": [],
    "touchedDomains": [],
    "patch": {}
  }
}
```

## Configuration

The runtime requires `AI_AGENT_MODEL` plus the matching server-side provider key. See `SETUP.md`.
