# Setup

This app is currently a client-side Next.js application. It does not call any live LLM, DeepAgents worker, database, auth provider, or third-party API at runtime.

## Required Today

No API keys are required to run the current application locally or on Vercel.

| Area | Required? | Notes |
|---|---:|---|
| OpenAI / Anthropic / other model provider | No | The shipped artifact generation is deterministic TypeScript, not live LLM generation. |
| LangGraph DeepAgents | No | DeepAgents is documented as a future server-side runtime path, but is not wired into the current app. |
| Database | No | Project data is stored in browser `localStorage`. |
| Auth | No | There is no login system yet. |
| Vercel env vars | No | Production deployment works with the linked Vercel project. |

## Local Development

Use Node 20 or newer.

```bash
nvm use
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful checks:

```bash
npm run typecheck
npm run build
```

## Local Environment Files

If future work adds runtime services, create `.env.local` manually from the variables below. Do not commit `.env.local`; it is already ignored by git.

```bash
touch .env.local
```

There is no root `.env.example` today because no runtime variables are required by the current app.

## Future DeepAgents Runtime

To turn the DeepAgents guidance into real-time content generation, add a server-side worker/API route first. Do not expose model keys through `NEXT_PUBLIC_*` variables.

Recommended future variables:

| Variable | Required when | Purpose |
|---|---|---|
| `DEEPAGENTS_ENABLED` | DeepAgents runtime is enabled | Feature flag for server-side agent generation. |
| `MODEL_PROVIDER` | Live LLM generation is enabled | Example values: `openai`, `anthropic`, `azure-openai`, `bedrock`, `vertex`. |
| `OPENAI_API_KEY` | `MODEL_PROVIDER=openai` | Server-side OpenAI model access. |
| `ANTHROPIC_API_KEY` | `MODEL_PROVIDER=anthropic` | Server-side Anthropic model access. |
| `AZURE_OPENAI_API_KEY` | `MODEL_PROVIDER=azure-openai` | Azure OpenAI access. |
| `AZURE_OPENAI_ENDPOINT` | `MODEL_PROVIDER=azure-openai` | Azure OpenAI endpoint URL. |
| `LANGSMITH_API_KEY` | LangSmith tracing is enabled | Optional tracing/evaluation for LangGraph/DeepAgents runs. |
| `LANGCHAIN_TRACING_V2` | LangSmith tracing is enabled | Set to `true` when using LangSmith tracing. |
| `LANGCHAIN_PROJECT` | LangSmith tracing is enabled | Project name for traces. |

Example future `.env.local`:

```bash
DEEPAGENTS_ENABLED=true
MODEL_PROVIDER=openai
OPENAI_API_KEY=sk-...
LANGSMITH_API_KEY=lsv2_...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=product-dev-blueprint
```

## Future Persistence / Collaboration

If the app adds accounts, shared projects, or long-running generation jobs, expect additional server-only variables:

| Variable | Required when | Purpose |
|---|---|---|
| `DATABASE_URL` | Postgres persistence is added | Stores users, projects, generations, and audit records. |
| `REDIS_URL` | Queues/cache are added | Background jobs, rate limits, generation state, or cache. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob exports are added | Persist generated bundles or uploaded documents. |
| `NEXTAUTH_SECRET` or provider-specific auth secret | Auth is added | Session signing or auth provider integration. |
| `NEXTAUTH_URL` | Auth is added | Canonical app URL for auth callbacks. |

## Vercel Deployment

The repository is linked to Vercel. For normal development:

- Pull requests create preview deployments.
- Merges to `main` deploy production.
- Production alias: `https://product-dev-blueprint.vercel.app`

For manual CLI deploys from a logged-in machine:

```bash
npx vercel deploy --prod --yes
```

For CI-driven CLI deploys, Vercel usually needs these CI secrets:

| Variable | Purpose |
|---|---|
| `VERCEL_TOKEN` | Authenticates Vercel CLI in CI. |
| `VERCEL_ORG_ID` | Vercel team/org id. |
| `VERCEL_PROJECT_ID` | Vercel project id. |

These are not app runtime variables and should not be exposed to the browser.

## Preview And Testing

Preferred checks:

```bash
npm run typecheck
npm run build
```

For visual checks, use either:

- Local dev URL: `http://localhost:3000`
- Production URL: `https://product-dev-blueprint.vercel.app`

Inside the Codex app, use the in-app browser preview for local or Vercel URLs. Chrome headless is not required for ordinary UI checks.
