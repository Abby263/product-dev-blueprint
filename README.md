# Product Dev Blueprint

> **Live:** [product-dev-blueprint.vercel.app](https://product-dev-blueprint.vercel.app)

Turn any idea into a **focused build-readiness plan**. Describe what you want to build; the platform helps you evaluate the idea, identify risky scenarios, scope the MVP, and produce developer-ready handoff artifacts from one guided flow.

[![CI](https://github.com/Abby263/product-dev-blueprint/actions/workflows/ci.yml/badge.svg)](https://github.com/Abby263/product-dev-blueprint/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Built for **Product Managers, Founders, Business Analysts, Solution Architects, Engineering Managers, Pre-sales Consultants, and Innovation / Enterprise Transformation teams.**

## What you get first

Every project starts with a **Build readiness report**:

- Idea readiness scorecard across desirability, feasibility, viability, risk readiness, and decision confidence
- Scenario checks based on vertical, platform, timing model, AI usage, compliance, and data sensitivity
- Critical gaps that should block build approval
- MVP build slice, top risks, validation experiments, compliance prompts, and developer guardrails

## Supporting bundle

Every project generates a draft bundle of:

| # | Artifact | Description |
|---|---|---|
| 00 | Build readiness report | Scorecard, gaps, scenario checks, validation experiments, MVP guardrails |
| 01 | Executive summary | One-page business case, audience, success criteria |
| 02 | PRD | Goals, personas, requirements, features, KPIs |
| 03 | SOW | Scope, deliverables, milestones, acceptance |
| 04 | Technical design spec | Stack, contracts, rollout, monitoring, recovery |
| 05 | ADR pack | Decisions with context, alternatives, consequences |
| 06 | Data & interface spec | Entities, integrations, retention, residency |
| 07 | Requirements traceability matrix | Each requirement linked to design and tests |
| 08 | Test strategy | Coverage targets, scenarios, acceptance gates |
| 09 | Launch & operations plan | SLOs, runbook, rollback, on-call posture |
| 10 | Marketing & GTM brief | Positioning, segments, pricing, launch geography |
| 11 | Risk register & governance | Risks, assumptions, open questions, compliance packs |
| 12 | System design | Capacity, scaling, caching, multi-region, DR |
| 13 | AI architecture | Pipeline, RAG, evals, guardrails, HITL |
| 14 | Security & compliance checklist | Frameworks, controls, framework-specific reminders |
| 15 | Feature specification | Per-feature acceptance, edge cases, security, ops |
| 16 | Implementation roadmap | Features grouped by release with quality gates |
| 17 | Cost estimate | Order-of-magnitude monthly infra cost based on stack and capacity |
| 18 | Coding-agent prompt pack | Cursor / Lovable / Replit-ready prompts wired to the bundle |

Stable IDs (`FR-001`, `NFR-001`, `FEAT-001`, `ADR-001`, `RISK-001`, `ASM-001`, `Q-001`, `INT-001`, `ENT-001`, `SLO-001`, `KPI-001`) are assigned at creation and persist across every document.

Bundle exports include **Markdown** + **DOCX** for every artifact, the raw `project.json`, and a **`scaffold/` folder** with a starter README, `.env.example`, `docker-compose.yml`, and CI workflow stub matched to your platform stack.

## How it works

1. **Describe your idea** — name the project, write a one-liner, paste a longer description.
2. **Walk thirteen guided domains** — Problem → Market → Experience → Platform & stack → Functional → Features → Quality attributes → System design → Data & tech → AI → Security → GTM → Governance. Conditional questions branch by surface, vertical, platform, and timing model.
3. **One canonical schema** — every answer writes to one `Project` object (see [`src/lib/schema.ts`](src/lib/schema.ts)). Intake autosaves to `localStorage`.
4. **Schema-first generation** — deterministic generators (under [`src/lib/generators/`](src/lib/generators)) read from the schema and render markdown. Change one answer and every relevant document updates consistently.
5. **Decide and hand off** — start with the readiness report, then download the full bundle as Markdown + DOCX in a single zip or paste the coding-agent prompt pack into Cursor / Lovable / Replit.

The platform infers context-specific corner cases (e.g. virtual-queue UX cases when the timing model is real-time) and activates compliance packs (PIPEDA, HIPAA, PHIPA, OSFI, PCI DSS, GDPR, OWASP ASVS, OWASP LLM Top 10, NIST AI RMF) by vertical and geography.

A rule-based **feature suggestion engine** seeds tailored feature lists when the user clicks _Suggest features_ in the Feature Builder — driven by surface, timing model, vertical, AI, and platform choices.

Every dropdown in the wizard ships with **inline "best for" guidance** under the selected option — so you don't need to leave the page to research what each stack/framework choice implies.

The AI step covers more than just provider choice: **agent framework** (LangGraph, LangChain, LlamaIndex, CrewAI, AutoGen, OpenAI Assistants, Vercel AI SDK, Haystack), **observability/tracing** (LangSmith, Langfuse, W&B Weave, Arize, OpenLLMetry, Datadog LLM, Helicone), and **vector database** (pgvector, Pinecone, Weaviate, Qdrant, Chroma, Milvus, etc.) — all with the same inline guidance.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with class-based dark mode (system preference + manual toggle)
- Zustand with `localStorage` persistence (single-user demo — no backend required)
- `react-markdown` + `remark-gfm` for rendering
- `docx` for Word-compatible exports, `jszip` for bundle export

## Run locally

```bash
nvm use            # picks up .nvmrc (Node 20)
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

## Deployment

Production runs on **Vercel** with the GitHub integration:

- Every push to `main` triggers a **production deploy** to [product-dev-blueprint.vercel.app](https://product-dev-blueprint.vercel.app).
- Every pull request triggers a **preview deploy** with its own URL.
- CI (`.github/workflows/ci.yml`) runs `npm run typecheck` and `npm run build` on every PR and push to main.

## Project structure

```
.github/
  workflows/ci.yml                  # type-check + build on every PR + push
  dependabot.yml                    # weekly npm + monthly actions updates
  pull_request_template.md
src/
  app/
    page.tsx                        # Landing
    settings/page.tsx               # Settings (export/import/clear)
    projects/
      page.tsx                      # Dashboard
      new/page.tsx                  # Create
      [id]/page.tsx                 # Overview
      [id]/intake/page.tsx          # Wizard host
      [id]/artifacts/page.tsx       # Generated docs + export
  components/
    ui.tsx                          # Buttons, inputs, cards, badges
    ThemeToggle.tsx                 # Light/dark toggle
    wizard/
      WizardShell.tsx               # Step navigation + progress
      steps.tsx                     # Basics, Problem, Market, Experience,
                                    # Functional, NF, DataTech, GTM, Governance
      steps-extended.tsx            # Platform, Features, SystemDesign, AI, Compliance
  lib/
    schema.ts                       # Canonical Project type
    store.ts                        # Zustand store
    ids.ts                          # Stable ID allocation
    options.ts                      # Dropdown option catalog with "best for" hints
    feature-suggestions.ts          # Rule-based feature seeding
    scaffold.ts                     # Stack-aware boilerplate scaffold
    docx.ts                         # Markdown → DOCX renderer
    export.ts                       # Zip bundle + JSON downloads
    generators/                     # Markdown renderers per artifact (readiness + 18 supporting docs)
```

## Contributing

PRs welcome. The repo uses a standard PR workflow:

1. Branch from `main`.
2. `npm run typecheck && npm run build` locally.
3. Open a PR — CI must pass before merge.
4. Squash-merge into `main`. Vercel auto-deploys.

## Roadmap

This MVP intentionally does **not** include:

- A backend (FastAPI / Postgres / Redis / S3)
- Auth (NextAuth / Clerk)
- Live LLM calls (the bundle is deterministic; the coding-agent prompt pack is meant to be pasted into an external coding agent)
- Real-time collaboration, comments, version history

These are explicit roadmap items documented in [`deep-research-report.md`](deep-research-report.md).

## License

[MIT](LICENSE).
