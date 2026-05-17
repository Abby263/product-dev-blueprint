# Setup Guide

This guide reflects the app as it exists today. The product is a Next.js app with deterministic artifact generators and a server-side Python DeepAgents AI Agent for LLM-backed blueprint proposals.

## Current Runtime

| Capability | Current implementation | API keys required today |
|---|---|---:|
| Intake wizard | Next.js App Router pages and React components | No |
| Project storage | Browser `localStorage` via Zustand persist | No |
| Blueprint Agent | Python DeepAgents function at `/api/agent` that proposes schema updates, assumptions, and follow-up questions | Yes |
| Document generation | Local TypeScript markdown/DOCX generators in `src/lib/generators` and `src/lib/docx.ts` | No |
| HLD/LLD architecture output | Deterministic generator based on user inputs in `src/lib/generators/system-design.ts` | No |
| Lifecycle execution plan | Deterministic PM, UX, engineering, security, deployment, and analytics feedback-loop artifact | No |
| DeepAgents content writer | Integrated under `ai_agents/blueprint_agent` with memory, skills, and subagents | Yes |
| Auth/accounts | Not implemented | No |
| Database/shared projects | Not implemented | No |

Required environment variables for the core UI: **none**.

Required environment variables for the AI Agent: `AI_AGENT_MODEL` plus the matching provider key.

Recommended OpenAI agent model:

```bash
AI_AGENT_MODEL=openai:gpt-5.4-mini
OPENAI_API_KEY=sk-...
```

OpenAI's current public docs list `gpt-5.4-mini` as the mini model for high-volume workloads. `gpt-4.5-mini` is not listed in the official model docs at the time this setup guide was updated. If an OpenAI account has private access to another model slug, use the exact LangChain model string accepted by that account.

## Prerequisites

- Node.js 20 or newer. The repo includes `.nvmrc` with Node 20.
- Python 3.12 for the Vercel Python AI Agent runtime. The repo includes `.python-version`.
- npm, using the checked-in `package-lock.json`.
- Optional: Vercel CLI for manual deployments.

## Local Development

```bash
nvm use
npm ci
npm run dev
```

Open:

```text
http://localhost:3000
```

`npm run dev` starts the Next.js UI. It does not run Vercel Python functions locally.

For the full stack, including `/api/agent`, create `.env.local` with the AI Agent variables:

```bash
AI_AGENT_MODEL=openai:gpt-5.4-mini
OPENAI_API_KEY=sk-...
```

Then start Vercel dev:

```bash
npx vercel dev
```

Python dependencies are declared in `requirements.txt`. Vercel installs them for deployments and `npx vercel dev`. If you want to validate Python locally without Vercel, install them first:

```bash
python3 -m pip install -r requirements.txt
python3 -m py_compile api/agent.py ai_agents/blueprint_agent/*.py
```

The app stores draft projects in the current browser only. Clearing site data or using the app's Settings page can remove local projects.

## Local Checks

Use these before opening a PR:

```bash
npm run typecheck
npm run build
python3 -m py_compile api/agent.py ai_agents/blueprint_agent/*.py
```

`npm run lint` exists in `package.json`, but this Next.js version no longer ships the old `next lint` command path in the same way. Treat `typecheck` and `build` as the required checks unless lint tooling is updated separately.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start local Next.js dev server. |
| `npm run build` | Create a production build and catch route/build errors. |
| `npm run start` | Serve an already-built production app locally. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run lint` | Legacy lint script; update before relying on it in CI. |

## Environment Variables

### Required For Current App

No `.env.local` file is needed to load the UI, templates, artifacts, and exports.

The AI Agent requires server-side model configuration:

| Variable | Required when | Notes |
|---|---|---|
| `AI_AGENT_MODEL` | AI Agent generation is enabled | LangChain model string. Recommended OpenAI value: `openai:gpt-5.4-mini`. Other provider examples: `anthropic:claude-sonnet-4-5` or `google_genai:gemini-2.5-pro`. |
| `OPENAI_API_KEY` | `AI_AGENT_MODEL` starts with `openai:` | Server-side only. |
| `ANTHROPIC_API_KEY` | `AI_AGENT_MODEL` starts with `anthropic:` | Server-side only. |
| `GOOGLE_API_KEY` | `AI_AGENT_MODEL` starts with `google_genai:` | Server-side only. |
| `GOOGLE_APPLICATION_CREDENTIALS` | `AI_AGENT_MODEL` starts with `google_vertexai:` | Server-side only. |
| `AZURE_OPENAI_API_KEY` | `AI_AGENT_MODEL` starts with `azure_openai:` | Server-side only. |
| `AZURE_OPENAI_ENDPOINT` | `AI_AGENT_MODEL` starts with `azure_openai:` | Server-side only. |
| `LANGSMITH_API_KEY` | LangSmith tracing/evals are enabled | Optional. |
| `LANGCHAIN_TRACING_V2` | LangSmith tracing is enabled | Optional, usually `true`. |
| `LANGCHAIN_PROJECT` | LangSmith tracing is enabled | Optional trace grouping name. |

Example `.env.local` for Vercel dev with OpenAI:

```bash
AI_AGENT_MODEL=openai:gpt-5.4-mini
OPENAI_API_KEY=sk-...
LANGSMITH_API_KEY=lsv2_...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=product-dev-blueprint
```

### Never Expose Server Keys To The Browser

Do not create variables such as:

```bash
NEXT_PUBLIC_OPENAI_API_KEY=
NEXT_PUBLIC_ANTHROPIC_API_KEY=
NEXT_PUBLIC_LANGSMITH_API_KEY=
```

Any `NEXT_PUBLIC_*` variable is bundled for browser access. Model provider keys, tracing keys, database URLs, and deployment tokens must stay server-only.

## DeepAgents Runtime

```text
api/agent.py
ai_agents/blueprint_agent/
  AGENTS.md
  skills/
    product-blueprint/SKILL.md
    architecture-blueprint/SKILL.md
    artifact-quality/SKILL.md
  subagents.yaml
  blueprint_agent.py
  schema_contract.py
```

The Python function returns schema proposals only. The final Markdown, DOCX, JSON, and zip artifacts are still rendered by the TypeScript generators after user approval.

Do not place DeepAgents prompts, memory, or provider keys in client-side bundles.

See [`docs/architecture/agent-runtime.md`](docs/architecture/agent-runtime.md) for the expected server-side flow and persistence model.

## Lifecycle And Cloud Blueprint Outputs

The app includes a lifecycle-readiness domain that captures the handoff from Product Manager to UX Designer, Software Engineer, Security Engineer, Data/Growth Analyst, and Solution Architect.

Generated bundles include:

- `19-lifecycle-execution-plan.md` for the PM → UX → engineering → security → deployment → analytics flow.
- Enhanced `18-coding-agent-prompts.md` with persona-based prompts.
- Static scaffold files for coding agents: `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/development-workflow.mdc`, `.claude/skills/development-workflow/SKILL.md`, and `.github/pull_request_template.md`.

The Google Cloud feedback-app template is a reference scenario for Cloud Run, Firestore, BigQuery, Looker/Looker Studio, Cloud Logging/Monitoring, service-account IAM, security review, and Claude on Google Cloud / Vertex AI summaries. Other templates remain cloud-neutral and keep their selected AWS/Azure/GCP/Vercel service guidance.

## Future Persistence And Auth

These are not part of the current app. Add them only when the product needs accounts, shared projects, collaboration, or background jobs.

| Variable | Required when | Notes |
|---|---|---|
| `DATABASE_URL` | Server-side persistence is added | Postgres or another production database. |
| `REDIS_URL` | Queues/cache/rate limiting are added | Useful for long-running generation jobs. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob export persistence is added | For storing generated bundles or uploaded files. |
| `NEXTAUTH_SECRET` | NextAuth/Auth.js is added | Session signing secret. |
| `NEXTAUTH_URL` | NextAuth/Auth.js is added | Canonical app URL for callbacks. |
| Provider-specific auth vars | OAuth provider is added | Example: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. |

## Vercel Deployment

The repo is linked to Vercel.

Current production URL:

```text
https://product-dev-blueprint.vercel.app
```

Normal flow:

- Pull requests create Vercel preview deployments.
- Merges to `main` create production deployments.
- Runtime environment variables are required for the AI Agent in preview and production.

Manual deploy from a machine already logged into Vercel:

```bash
npx vercel deploy --prod --yes
```

CI-driven deploys through Vercel CLI, instead of the GitHub integration, usually need CI secrets:

| Variable | Purpose |
|---|---|
| `VERCEL_TOKEN` | Authenticates the Vercel CLI in CI. |
| `VERCEL_ORG_ID` | Vercel team or account id. |
| `VERCEL_PROJECT_ID` | Vercel project id. |

These are deployment secrets, not app runtime variables. Never expose them as `NEXT_PUBLIC_*`.

## Adding Environment Variables On Vercel

```bash
npx vercel env add AI_AGENT_MODEL production
npx vercel env add OPENAI_API_KEY production
npx vercel env add AI_AGENT_MODEL preview
npx vercel env add OPENAI_API_KEY preview
```

When prompted for `AI_AGENT_MODEL`, enter:

```text
openai:gpt-5.4-mini
```

After changing production env vars, trigger a new production deployment:

```bash
npx vercel deploy --prod --yes
```

## Data And Reset Notes

- Project data is stored in browser `localStorage` under the app origin.
- Data is not shared across browsers, devices, or users.
- There is no server backup of projects.
- Use the Settings page for export/import/clear flows when available.
- Incognito/private browsing may lose projects when the session ends.

## Visual Preview

Preferred browser preview paths:

- Local: `http://localhost:3000`
- Production: `https://product-dev-blueprint.vercel.app`

In Codex, use the in-app browser preview for UI checks. Chrome headless is not required for normal verification.

## Troubleshooting

| Problem | Check |
|---|---|
| `nvm use` fails | Install `nvm`, or manually use Node 20+. |
| `npm install` differs from CI | Use `npm ci` for a clean install from `package-lock.json`. |
| Local projects disappeared | Check browser/site data; projects live only in localStorage. |
| Vercel deploy succeeds but old UI appears | Confirm the production alias points to the newest deployment in Vercel. |
| AI Agent says it is not configured | Add `AI_AGENT_MODEL=openai:gpt-5.4-mini` and `OPENAI_API_KEY` to the server environment, or use a different supported provider/model pair. |
| AI Agent model is rejected by provider | Confirm the model slug exists for the configured provider/account. Official OpenAI docs currently list `gpt-5.4-mini`; `gpt-4.5-mini` is not listed publicly. |
| `/api/agent` is 404 locally | Use `npx vercel dev`; plain `npm run dev` does not run Vercel Python functions. |
| Build fails after adding a server feature | Re-check that server-only imports are not pulled into client components. |
