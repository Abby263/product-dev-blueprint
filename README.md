# Product Dev Blueprint

A schema-first product-definition system. Run a guided, role-aware intake across thirteen domains, build one canonical project schema, and render seventeen artifacts from that single source of truth — all the way to a coding-agent prompt pack you can paste into Cursor, Lovable, or Replit.

Built for **Product Managers, Founders, Business Analysts, Solution Architects, Engineering Managers, Pre-sales Consultants, and Innovation / Enterprise Transformation teams.**

## What it produces

Every project generates a draft bundle of:

| # | Artifact | Description |
|---|---|---|
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
| 17 | Coding-agent prompt pack | Cursor / Lovable / Replit-ready prompts wired to the bundle |

Stable IDs (`FR-001`, `NFR-001`, `FEAT-001`, `ADR-001`, `RISK-001`, `ASM-001`, `Q-001`, `INT-001`, `ENT-001`, `SLO-001`, `KPI-001`) are assigned at creation and persist across every document.

Bundle exports include **Markdown** + **DOCX** for every artifact, plus the raw `project.json`.

## How it works

1. **Guided intake** — thirteen role-aware domains:
   - Project basics → Problem & objectives → Customer & market → Experience surface → Platform & channels → Functional requirements → Feature builder → Quality attributes → System design → Data & tech → AI & automation → Security & compliance → Commercial & GTM → Delivery & governance.
   - Conditional questions branch by surface, vertical, platform, and timing model.
2. **Canonical schema** — every answer writes to one `Project` object (see [`src/lib/schema.ts`](src/lib/schema.ts)). Intake autosaves to `localStorage`.
3. **Schema-first generation** — deterministic generators (under [`src/lib/generators/`](src/lib/generators)) read from the schema and render markdown. Change one answer and every relevant document updates consistently.
4. **Bundle export** — download the full set as Markdown + DOCX in a single zip, plus `project.json`.

The platform infers context-specific corner cases (e.g. virtual-queue UX cases when the timing model is real-time) and activates compliance packs (PIPEDA, HIPAA, PHIPA, OSFI, PCI DSS, GDPR, OWASP ASVS, OWASP LLM Top 10, NIST AI RMF) by vertical and geography.

A rule-based **feature suggestion engine** seeds tailored feature lists when the user clicks _Suggest features_ in the Feature Builder — driven by surface, timing model, vertical, AI, and platform choices.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand with `localStorage` persistence (single-user demo — no backend required)
- `react-markdown` + `remark-gfm` for rendering
- `docx` for Word-compatible exports, `jszip` for bundle export

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Project structure

```
src/
  app/
    page.tsx                              # Landing
    settings/page.tsx                     # Settings (export/import/clear)
    projects/
      page.tsx                            # Dashboard
      new/page.tsx                        # Create
      [id]/page.tsx                       # Overview
      [id]/intake/page.tsx                # Wizard host
      [id]/artifacts/page.tsx             # Generated docs + export
  components/
    ui.tsx                                # Buttons, inputs, cards, badges
    wizard/
      WizardShell.tsx                     # Step navigation + progress
      steps.tsx                           # Basics, Problem, Market, Experience, Functional, NF, DataTech, GTM, Governance
      steps-extended.tsx                  # Platform, Features, SystemDesign, AI, Compliance
  lib/
    schema.ts                             # Canonical Project type
    store.ts                              # Zustand store
    ids.ts                                # Stable ID allocation
    feature-suggestions.ts                # Rule-based feature seeding
    docx.ts                               # Markdown → DOCX renderer
    export.ts                             # Zip bundle + JSON downloads
    generators/                           # Markdown renderers per artifact
```

## Notes

Generated documents are **drafts**. Human review is mandatory for high-consequence outputs — the platform surfaces what was user-entered vs. what was inferred, with assumptions and unresolved questions pinned for approval before export.

This MVP intentionally does **not** include:

- A backend (FastAPI / Postgres / Redis / S3)
- Auth (NextAuth / Clerk)
- Live LLM calls (the bundle is deterministic; the coding-agent prompt pack is meant to be pasted into an external coding agent)
- Real-time collaboration, comments, version history

These are explicit roadmap items documented in [`deep-research-report.md`](deep-research-report.md).
