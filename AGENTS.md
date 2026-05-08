# Agent Development Guide

These rules apply to coding agents working in this repository.

## Product Contract

- Product Dev Blueprint is schema-first. The canonical `Project` schema in `src/lib/schema.ts` is the source of truth.
- Generated artifacts must come from deterministic generators in `src/lib/generators`. Do not hand-write one-off artifact formats in UI code.
- User-entered data is authoritative. AI or helper logic may propose changes, but product flows must show proposed assumptions and changes before applying them.
- PM-owned sections cover problem, market, experience, requirements, MVP, GTM, and KPIs.
- Technical Solution Architect sections cover platform, HLD, LLD, schema design, APIs, data, AI, security, compliance, infrastructure, scale, and observability.

## Development Workflow

- Create a branch for every change. Do not commit directly to `main`.
- Keep changes scoped to the requested feature or fix.
- Use pull requests for review and deployment. Production changes should land through PR merge.
- Run `npm run typecheck` and `npm run build` before merging.
- If the change affects generated artifacts, check that filenames, stable IDs, headings, and bundle grouping remain consistent.
- If the change affects the UI, verify responsive layouts with normal browser preview or in-app browser. Headless browser testing is not required for routine checks.

## Architecture Rules

- Keep provider secrets server-side only. Never add `NEXT_PUBLIC_*` model, tracing, database, or deployment keys.
- Do not introduce a live model call from a client component.
- The real AI backend lives in Python under `ai_agents/blueprint_agent` and is exposed through `api/agent.py`.
- Keep human approval before applying any AI-generated schema changes.
- Prefer small TypeScript helpers over large UI-only logic. The schema and generators should remain testable without rendering React.
- Preserve local-first behavior unless the feature explicitly adds accounts, shared projects, or backend persistence.

## UX Rules

- The first screen should help users take action, not explain the whole app.
- Mobile web must remain usable. Controls should stack cleanly, text should wrap, and buttons should not overflow.
- Use existing UI primitives from `src/components/ui.tsx`.
- Keep cards for repeated items, panels, and modals. Do not nest cards inside cards.
- Do not show Mermaid source when a diagram can be rendered visually.
