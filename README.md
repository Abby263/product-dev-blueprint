# Product Dev Blueprint

> **Production:** [product-dev-blueprint.vercel.app](https://product-dev-blueprint.vercel.app)

[![CI](https://github.com/Abby263/product-dev-blueprint/actions/workflows/ci.yml/badge.svg)](https://github.com/Abby263/product-dev-blueprint/actions/workflows/ci.yml)
[![License: PolyForm Noncommercial](https://img.shields.io/badge/License-PolyForm%20Noncommercial-blue.svg)](LICENSE)

Product Dev Blueprint is a schema-first product planning application for turning a rough software idea into a focused build-readiness plan. It helps a Product Manager, Solution Architect, founder, or engineering lead pressure-test an idea before development starts, then generates a traceable artifact bundle that can be handed to an engineering team or coding agent.

The application includes a Python DeepAgents AI Agent for LLM-backed blueprint proposals and deterministic TypeScript generators for final artifacts. The core UI can still load without model keys, but the AI Agent requires server-side model configuration.

## UI Demo

There is no recorded demo video checked into the repo yet. Instead, this README includes a screenshot-based demo captured from the current production UI. The assets live in [`docs/assets`](docs/assets) and can be replaced by a real video later.

### 1. Start From The Decision Workspace

The landing page now presents the product as a decision and readiness workspace, not as a large pile of documents. It highlights the scorecard, scenario coverage, product ownership, architecture ownership, and build handoff groups.

![Product Dev Blueprint landing page](docs/assets/ui-demo-landing.jpg)

### 2. Choose A Starting Template

The new-project page separates responsibility between Product Manager, Solution Architect, and Engineering. Template cards show stack direction, cloud, auth, data model, architecture pattern, governance, compliance, and scale signals.

![Template selection page](docs/assets/ui-demo-template-selection.jpg)

### 3. Review Generated Artifacts

After selecting a template, the app creates a project, marks the seeded intake complete, and opens generated artifacts. The readiness report is the default artifact; supporting documents are grouped for product, architecture, delivery, and governance review.

![Generated artifacts page](docs/assets/ui-demo-artifacts.jpg)

## Product Goals

Product Dev Blueprint is designed to answer four questions before a team commits engineering time:

1. **Should we build this?** Validate the problem, market, user, buyer, urgency, and confidence level.
2. **What can break this?** Surface operational, legal, security, data, scale, AI, and adoption risks early.
3. **What should the MVP contain?** Convert the idea into a constrained build slice with validation gates.
4. **How should engineering build it?** Produce HLD, LLD, schema, APIs, security posture, roadmap, tests, and coding-agent prompts.

## Target Users

- Product Managers defining PRDs and MVP scope
- Founders validating a SaaS or marketplace idea
- Business Analysts converting business concepts into implementation-ready detail
- Solution Architects designing HLD, LLD, schema, APIs, auth, and deployment topology
- Engineering Managers estimating risk and sequencing delivery
- Pre-sales and transformation teams creating client-facing solution blueprints
- Developers using Cursor, Codex, or similar tools to build from structured specs

## Current Runtime Status

| Area | Current implementation |
|---|---|
| UI | Next.js 14 App Router, React, TypeScript, Tailwind CSS |
| Persistence | Browser `localStorage` through Zustand |
| Blueprint Agent | Python DeepAgents runtime at `/api/agent` that returns reviewable schema proposals |
| Artifact generation | Deterministic TypeScript generators in `src/lib/generators` |
| HLD / LLD | Generated from user inputs through the system-design generator |
| Mermaid diagrams | Rendered as visual diagrams in generated architecture artifacts |
| Exports | Markdown, DOCX, JSON, and zip bundle |
| Auth | Not implemented |
| Backend database | Not implemented |
| Live LLM calls | Implemented for Blueprint Agent proposals when server model env vars are configured |
| DeepAgents | Integrated in `ai_agents/blueprint_agent` with memory, skills, and subagents |

Required to use the AI Agent: `AI_AGENT_MODEL` and the matching server-side provider key. See [`SETUP.md`](SETUP.md).

## Core Workflow

```mermaid
flowchart LR
  A["Start with blank idea or template"] --> B["Complete PM-owned intake"]
  A --> G["Run Python DeepAgents Blueprint Agent"]
  G --> H["Review questions, assumptions, and proposed schema changes"]
  H --> B
  B --> C["Complete Solution Architect intake"]
  C --> D["Generate readiness report"]
  D --> E["Review product, architecture, risk, and delivery artifacts"]
  E --> F["Export Markdown, DOCX, JSON, and coding-agent prompts"]
```

## Capabilities

### Blueprint Agent

- Start from a rough idea and generate a reviewable LLM-backed schema proposal.
- Trigger the agent from project creation, overview, intake, or artifacts.
- Choose a full completion pass, Product Manager pass, Solution Architect pass, or readiness review.
- Review proposed changes, assumptions, confidence, follow-up questions, and touched domains before applying.
- Preserve the exact artifact bundle format by writing accepted changes back to the canonical `Project` schema.
- Use dedicated Python agent files under `ai_agents/blueprint_agent`, including `AGENTS.md`, skills, and subagents.

### Idea Evaluation

- Problem, audience, buyer, market timing, alternatives, differentiation, pricing, and success criteria
- Build-readiness scorecard across desirability, feasibility, viability, risk readiness, and decision confidence
- Critical gaps and assumptions that should block or narrow implementation
- Validation experiments and MVP guardrails

### PM-Owned Product Planning

- Personas and jobs-to-be-done
- Functional and non-functional requirements
- Feature backlog with acceptance criteria, edge cases, security notes, audit needs, dependencies, and release grouping
- KPI and success-measure definition
- Marketing and GTM brief
- SOW and executive summary outputs

### Solution Architecture Planning

- High-level architecture and low-level architecture
- Schema design and domain modeling
- API contract notes and integration boundaries
- OAuth, SSO, RBAC, authorization, tenancy, and audit posture
- Infra, cloud services, networking, CI/CD, Terraform/IaC, observability, DR, scaling, and release gates
- Architecture tradeoff matrix covering build-vs-buy, events, caching, realtime, privacy, security, data residency, and operational risk

### AI Product Planning

For AI use cases, the app captures:

- Agent framework direction, including LangGraph and DeepAgents
- RAG pipeline, vector database, embeddings, retrieval, evals, and guardrails
- Prompt-injection and AI safety review areas
- Model observability and tracing options
- Human-in-the-loop escalation and approval flows
- DeepAgents content-writer architecture, with server-side memory, skills, and subagents

### Export And Handoff

- Download individual `.md` or `.docx` artifacts
- Download full bundle as `.zip`
- Download raw `project.json`
- Copy markdown directly from the artifact viewer
- Use coding-agent prompts as structured input for Cursor, Codex, Lovable, Replit, or other development tools

## Generated Artifact Bundle

The app does generate a large supporting bundle, but the UI and README intentionally group it by outcome so users do not experience it as a wall of documents.

| Group | Artifacts |
|---|---|
| Decision brief | Build readiness report, executive summary, implementation roadmap, cost estimate |
| Product definition | PRD, SOW, marketing/GTM brief |
| Architecture blueprint | Engineering specification, architecture blueprint, AI architecture, data/interface spec, ADR pack |
| Delivery package | Feature specification, requirements traceability matrix, test strategy, launch/operations plan |
| Governance | Risk register, security/compliance checklist |
| Coding handoff | Coding-agent prompt pack and scaffold bundle |

Stable IDs are assigned across the project schema and reused in generated artifacts:

```text
FR-001, NFR-001, FEAT-001, ADR-001, RISK-001, ASM-001,
Q-001, INT-001, ENT-001, SLO-001, KPI-001
```

## Architecture Overview

The app keeps a schema-first flow: the Python AI Agent proposes schema changes, browser state stores accepted inputs, and deterministic generators render final artifacts.

```mermaid
flowchart TB
  Browser["Browser"]
  UI["Next.js App Router UI"]
  Store["Zustand localStorage store"]
  Schema["Canonical Project schema"]
  Agent["Python DeepAgents /api/agent"]
  AgentFiles["ai_agents memory, skills, subagents"]
  Generators["Deterministic artifact generators"]
  Renderer["Markdown / Mermaid / DOCX renderer"]
  Exporter["Zip, JSON, Markdown, DOCX exports"]

  Browser --> UI
  UI --> Store
  UI --> Agent
  Agent --> AgentFiles
  Agent --> Schema
  Store --> Schema
  Schema --> Generators
  Generators --> Renderer
  Generators --> Exporter
```

Future server-side capabilities such as accounts, shared projects, long-running background generation, and durable agent history should be added behind server APIs or workers. Provider keys must never be exposed to browser bundles. See [`docs/architecture/agent-runtime.md`](docs/architecture/agent-runtime.md) for the agent backend path.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| AI Agent Runtime | Python DeepAgents Vercel Function |
| UI | React, Tailwind CSS |
| State | Zustand with browser persistence |
| Markdown | `react-markdown`, `remark-gfm` |
| DOCX export | `docx` |
| Zip export | `jszip` |
| Deployment | Vercel |
| CI | GitHub Actions |

## Local Development

Prerequisites:

- Node.js 20 or newer
- Python 3.12 for the Vercel Python AI Agent runtime
- npm
- Optional: Vercel CLI for manual deployments

Install and run:

```bash
nvm use
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

For full-stack local development with the Python `/api/agent` function:

```bash
npx vercel dev
```

Run production checks:

```bash
npm run typecheck
npm run build
python3 -m py_compile api/agent.py ai_agents/blueprint_agent/*.py
```

Scripts:

| Script | Purpose |
|---|---|
| `npm run dev` | Start the local Next.js UI server |
| `npm run build` | Build the production app |
| `npm run start` | Serve the built app locally |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run lint` | Legacy lint command; see `SETUP.md` before relying on it |

## Environment Variables

No `.env.local` file is required to load the UI, templates, deterministic artifacts, or exports.

The AI Agent requires server-only model configuration:

```bash
AI_AGENT_MODEL=openai:gpt-4o-mini
OPENAI_API_KEY=sk-...
```

Use the matching provider key for the selected `AI_AGENT_MODEL`. Never expose provider keys through `NEXT_PUBLIC_*`.

See [`SETUP.md`](SETUP.md) for:

- Current runtime requirements
- AI Agent model/provider variables
- Vercel deployment variables
- Auth/database variables for a future multi-user version
- Troubleshooting notes

## Deployment

Production runs on Vercel through the GitHub integration.

| Event | Result |
|---|---|
| Pull request opened | Vercel preview deployment |
| Push to PR branch | Preview redeploy |
| Merge to `main` | Production deployment |
| GitHub Actions | Type-check and production build |

Production URL:

```text
https://product-dev-blueprint.vercel.app
```

Manual production deploy from a linked and authenticated machine:

```bash
npx vercel deploy --prod --yes
```

## Project Structure

```text
.github/
  workflows/ci.yml                  # Type-check and build
  dependabot.yml                    # Dependency update checks
  pull_request_template.md
api/
  agent.py                          # Python Vercel Function for the LLM Blueprint Agent
ai_agents/
  blueprint_agent/                   # DeepAgents memory, skills, subagents, and schema contract
docs/
  assets/                           # README demo screenshots
src/
  app/
    page.tsx                        # Landing page
    settings/page.tsx               # Import/export/clear settings
    projects/
      page.tsx                      # Project dashboard
      new/page.tsx                  # Template selection
      [id]/page.tsx                 # Project overview
      [id]/intake/page.tsx          # Guided intake wizard
      [id]/artifacts/page.tsx       # Generated artifacts and export actions
  components/
    ui.tsx                          # Shared UI primitives
    ThemeToggle.tsx                 # Theme switcher
    MermaidDiagram.tsx              # Mermaid rendering and enlarge view
    wizard/
      WizardShell.tsx               # Wizard layout, progress, navigation
      steps.tsx                     # Core intake steps
      steps-extended.tsx            # Platform, features, system design, AI, compliance
  lib/
    schema.ts                       # Canonical Project type
    store.ts                        # Zustand store and localStorage persistence
    ids.ts                          # Stable ID allocation
    options.ts                      # Intake option catalog and guidance
    architecture-scenarios.ts       # Tradeoff and architecture scenario catalog
    feature-suggestions.ts          # Rule-based feature seeding
    scaffold.ts                     # Stack-aware scaffold export
    docx.ts                         # Markdown to DOCX rendering
    export.ts                       # Zip and JSON export helpers
    generators/                     # Deterministic artifact generators
```

## Data And Privacy Notes

- Projects are stored in the browser only.
- Data is not synchronized across devices or users.
- Clearing browser/site data can delete local projects.
- There is no server-side backup in the current implementation.
- The AI Agent sends the current project context to the configured server-side model provider.
- Model provider keys must stay server-side and must never use `NEXT_PUBLIC_*`.
- Generated artifacts are drafts and should be reviewed before use in production delivery.

For a production multi-user version, add auth, a database, server-side exports, access controls, audit logs, and backup/retention policies before storing real customer or regulated data.

## Quality Gates

Before merging:

```bash
npm run typecheck
npm run build
python3 -m py_compile api/agent.py ai_agents/blueprint_agent/*.py
```

CI runs the same required checks on pull requests and pushes to `main`.

## Roadmap

Near-term product improvements:

- Persist projects server-side with accounts and shared workspaces
- Add version history, comments, and review workflow
- Persist agent runs, messages, feedback, and approved case studies
- Add uploaded context documents for deeper artifact generation
- Add richer diagram export options
- Add Linear/Jira/GitHub issue export
- Add team roles for Product Manager, Solution Architect, Engineering, Security, and Reviewer

The current app keeps these capabilities out of the browser until a secure server-side runtime is introduced.

## Contributing

1. Branch from `main`.
2. Make focused changes.
3. Run `npm run typecheck` and `npm run build`.
4. Open a pull request.
5. Merge after CI and preview deployment pass.

## License

This repository is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).

Commercial use is not permitted under this license. Any commercial use, including resale, SaaS hosting, paid client work, embedding this repository in a paid product, or using it to provide paid services, requires separate written permission from the copyright holder. See [COMMERCIAL.md](COMMERCIAL.md) for the repository's commercial-use notice.

This is a source-available non-commercial license, not an OSI open-source license. AGPL was not used because AGPL permits commercial use when its license conditions are followed.
