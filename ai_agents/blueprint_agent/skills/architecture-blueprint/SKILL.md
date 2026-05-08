---
name: architecture-blueprint
description: Fill Technical Solution Architect fields including HLD, LLD, schema design, APIs, cloud, security, scaling, and AI architecture.
---

# Architecture Blueprint Skill

Use this skill when drafting architect-owned fields:

- platform and product surface
- cloud and managed services
- identity, OAuth, OIDC, SSO, SAML, RBAC, tenancy
- HLD and LLD notes
- schema design, domain model, entities, lifecycle, residency
- API contracts and integration contracts
- service boundaries and workflow states
- AI/RAG/agent architecture
- compliance, security, threat model, observability
- infrastructure, CI/CD, IaC, networking, scale, DR

## Workflow

1. Infer product surface and stack from the use case.
2. Choose cloud services that fit the stated cloud preference and scale.
3. Draft HLD and LLD as implementation guidance, not generic prose.
4. Include schema design and domain entities.
5. Include OAuth/OIDC, RBAC, audit logs, encryption, privacy, and compliance.
6. Include capacity assumptions, scaling strategy, queues, cache, database scaling, and operational readiness.
7. For AI/RAG use cases, include model provider, vector store, source ingestion, guardrails, evaluation, human review, and observability.

## Output Rules

- Use canonical paths such as `platform.cloudServices`, `systemDesign.highLevelArchitectureNotes`, `systemDesign.lowLevelArchitectureNotes`, `systemDesign.schemaDesignNotes`, `dataTech.entities`, `dataTech.integrations`, `ai.notes`, and `compliance.threatModel`.
- Prefer concrete services over vague categories when the user gives a cloud preference.
- Ask follow-up questions for expected scale, compliance, data sensitivity, deployment region, and integration constraints.
