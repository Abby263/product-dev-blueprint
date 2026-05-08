# Setup Guide

This guide reflects the app as it exists today. The current product is a client-side Next.js app that generates planning artifacts from deterministic TypeScript generators and includes a local schema-aware Blueprint Agent proposal flow. It does **not** call DeepAgents, OpenAI, Anthropic, a database, or an auth provider at runtime.

## Current Runtime

| Capability | Current implementation | API keys required today |
|---|---|---:|
| Intake wizard | Next.js App Router pages and React components | No |
| Project storage | Browser `localStorage` via Zustand persist | No |
| Blueprint Agent | Local TypeScript helper that proposes schema updates, assumptions, and follow-up questions | No |
| Document generation | Local TypeScript markdown/DOCX generators in `src/lib/generators` and `src/lib/docx.ts` | No |
| HLD/LLD architecture output | Deterministic generator based on user inputs in `src/lib/generators/system-design.ts` | No |
| DeepAgents content writer | Planned server-side upgrade path; not called by current runtime | No |
| Auth/accounts | Not implemented | No |
| Database/shared projects | Not implemented | No |

Required environment variables for the shipped app: **none**.

## Prerequisites

- Node.js 20 or newer. The repo includes `.nvmrc` with Node 20.
- npm, using the checked-in `package-lock.json`.
- Optional: Vercel CLI for manual deployments.

## Local Development

```bash
nvm use
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The app stores draft projects in the current browser only. Clearing site data or using the app's Settings page can remove local projects.

## Local Checks

Use these before opening a PR:

```bash
npm run typecheck
npm run build
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

No `.env.local` file is needed.

Do **not** add model keys such as `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `LANGSMITH_API_KEY` unless a server-side generation runtime is added. They are not read by the current code.

### Never Expose Server Keys To The Browser

Do not create variables such as:

```bash
NEXT_PUBLIC_OPENAI_API_KEY=
NEXT_PUBLIC_ANTHROPIC_API_KEY=
NEXT_PUBLIC_LANGSMITH_API_KEY=
```

Any `NEXT_PUBLIC_*` variable is bundled for browser access. Model provider keys, tracing keys, database URLs, and deployment tokens must stay server-only.

### Future DeepAgents Runtime Only

If a real-time DeepAgents/content-writer runtime is added later, it should run server-side through an API route, Python worker, or background job. At that point, use server-only variables like these:

| Variable | Required when | Notes |
|---|---|---|
| `DEEPAGENTS_ENABLED` | DeepAgents runtime exists and should be enabled | Feature flag. Example: `true`. |
| `MODEL_PROVIDER` | Live LLM generation is enabled | Example: `openai`, `anthropic`, `azure-openai`, `bedrock`, `vertex`. |
| `OPENAI_API_KEY` | `MODEL_PROVIDER=openai` | Server-side only. |
| `ANTHROPIC_API_KEY` | `MODEL_PROVIDER=anthropic` | Server-side only. |
| `AZURE_OPENAI_API_KEY` | `MODEL_PROVIDER=azure-openai` | Server-side only. |
| `AZURE_OPENAI_ENDPOINT` | `MODEL_PROVIDER=azure-openai` | Server-side only. |
| `LANGSMITH_API_KEY` | LangSmith tracing/evals are enabled | Optional, but useful for agent debugging. |
| `LANGCHAIN_TRACING_V2` | LangSmith tracing is enabled | Usually `true`. |
| `LANGCHAIN_PROJECT` | LangSmith tracing is enabled | Trace grouping name. |

Example future `.env.local`:

```bash
DEEPAGENTS_ENABLED=true
MODEL_PROVIDER=openai
OPENAI_API_KEY=sk-...
LANGSMITH_API_KEY=lsv2_...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=product-dev-blueprint
```

Those variables are intentionally future-facing. Adding them today will not change generated artifacts because the current app does not read them.

## What A Real DeepAgents Integration Would Need

The existing app now has the review UX and schema-patch contract that a DeepAgents runtime can later replace. To make DeepAgents generate HLD, LLD, PRD, and other documents in real time, add these pieces first:

1. A server-side generation endpoint, for example `src/app/api/generate/route.ts`, or a separate backend service.
2. A worker that runs DeepAgents with model credentials on the server, not in browser code.
3. A content-writer workspace such as:

```text
agents/content-writer/
  AGENTS.md
  skills/
    architecture-blueprint/SKILL.md
    product-documents/SKILL.md
    diagram-generation/SKILL.md
  subagents.yaml
  content_writer.py
```

4. Persistence for generation status and outputs if jobs can run longer than a request.
5. Human review UX, because generated documents should stay draft artifacts until approved.

Do not place DeepAgents prompts, memory, or provider keys in client-side bundles.

See [`docs/architecture/agent-runtime.md`](docs/architecture/agent-runtime.md) for the expected server-side flow and persistence model.

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
- No runtime environment variables are required for the current production app.

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

Only do this after code actually reads the variable server-side.

```bash
npx vercel env add OPENAI_API_KEY production
npx vercel env add OPENAI_API_KEY preview
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
| DeepAgents keys do nothing | Expected today. No runtime code reads those keys yet. |
| Build fails after adding a server feature | Re-check that server-only imports are not pulled into client components. |
