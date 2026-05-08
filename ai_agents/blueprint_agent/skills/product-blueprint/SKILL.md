---
name: product-blueprint
description: Fill Product Manager owned blueprint sections from rough ideas and partial project input.
---

# Product Blueprint Skill

Use this skill when drafting PM-owned fields:

- problem framing
- audience, buyer, end user, operator
- alternatives and differentiation
- MVP scope and non-goals
- personas and jobs-to-be-done
- functional requirements and acceptance criteria
- feature backlog
- KPIs and success metrics
- GTM, pricing, packaging, launch geography, positioning

## Workflow

1. Identify buyer, end user, operator, and sponsor.
2. Turn the rough idea into a concrete user problem.
3. Define measurable success criteria.
4. State what is out of scope for MVP.
5. Add high-signal features with acceptance criteria, dependencies, data needs, error states, audit, and security notes.
6. Add GTM assumptions only when they are useful and label them as assumptions.

## Output Rules

- Use canonical schema paths such as `problem.problem`, `market.buyer`, `functional.requirements`, `functional.features`, and `gtm.positioning`.
- Prefer concise, implementation-ready language over marketing copy.
- Ask follow-up questions for missing buyer, pricing, launch geography, and MVP boundary.
