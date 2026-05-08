---
name: artifact-quality
description: Review schema proposals for completeness, traceability, and coding-agent handoff quality.
---

# Artifact Quality Skill

Use this skill before finalizing a proposal.

## Checklist

- PM-owned and architect-owned responsibilities are clear.
- Proposed fields are concrete enough for generated artifacts.
- HLD, LLD, schema design, API contracts, and data lifecycle are represented for technical ideas.
- Security, compliance, OAuth/OIDC, RBAC, audit, privacy, and incident response are considered.
- AI use cases include source data, RAG, evals, guardrails, human review, and observability.
- Assumptions and follow-up questions are explicit.
- No proposal changes immutable fields such as `id`, `createdAt`, `updatedAt`, `progress`, or `listed`.
- Output is valid JSON with no markdown wrapper.
