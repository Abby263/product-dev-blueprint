# Copilot Instructions

Product Dev Blueprint is a schema-first Next.js application. Keep generated planning files deterministic and traceable.

## Source Of Truth

- Use `src/lib/schema.ts` as the canonical project model.
- Use `src/lib/generators` for artifact generation. Do not create competing document formats inside React components.
- Preserve stable IDs such as `FR-001`, `FEAT-001`, `ADR-001`, `RISK-001`, `ASM-001`, `Q-001`, `ENT-001`, `INT-001`, `SLO-001`, and `KPI-001`.

## Change Discipline

- Branch, PR, review, merge. Do not target direct commits to `main`.
- Run `npm run typecheck` and `npm run build`.
- Keep browser secrets out of the app. Model/provider credentials must be server-only.
- Respect the noncommercial license and do not add commercial usage language that conflicts with it.

## Product Ownership

- Product Manager owns problem, market, requirements, MVP scope, GTM, KPIs, and readiness.
- Technical Solution Architect owns platform, architecture, data model, APIs, AI runtime, security, compliance, infra, scale, and observability.
- Shared sections should make the owner split visible instead of hiding accountability.

