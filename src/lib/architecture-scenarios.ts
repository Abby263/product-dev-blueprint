import type { Project } from "./schema";

export interface ArchitectureScenario {
  id: string;
  label: string;
  why: string;
  options: string[];
}

export const ARCHITECTURE_SCENARIOS: ArchitectureScenario[] = [
  {
    id: "identity-auth",
    label: "Identity, OAuth, SSO, and session model",
    why: "Authentication choices affect onboarding, enterprise readiness, account recovery, audit, and every API boundary.",
    options: [
      "Managed OIDC/OAuth2 for SaaS and consumer login",
      "Enterprise SAML/OIDC SSO with SCIM for B2B buyers",
      "Server-side sessions with httpOnly cookies for classic web apps",
      "PKCE and refresh-token rotation for native mobile",
      "Scoped API keys or client credentials for machine-to-machine calls",
    ],
  },
  {
    id: "authorization-tenancy",
    label: "Authorization, RBAC/ABAC, and tenant isolation",
    why: "Most serious SaaS incidents come from missing authorization checks or tenant-crossing data access.",
    options: [
      "Simple role-based access control for MVP",
      "Attribute-based policies for enterprise segmentation",
      "Tenant-scoped database rows plus policy checks in service layer",
      "Dedicated tenant resources for regulated or high-ACV customers",
      "Admin impersonation with approval, reason capture, and audit trail",
    ],
  },
  {
    id: "security-baseline",
    label: "Security baseline and threat model",
    why: "A production plan needs explicit controls for secrets, encryption, dependency risk, abuse, and incident response.",
    options: [
      "OWASP ASVS baseline for web/API controls",
      "Secrets manager with rotation and no secrets in client code",
      "Encryption in transit and at rest with managed KMS",
      "Rate limiting, bot protection, abuse detection, and WAF rules",
      "Threat model for top abuse paths and data exposure paths",
    ],
  },
  {
    id: "privacy-compliance",
    label: "Privacy, residency, retention, and compliance",
    why: "Data classes, geography, and retention rules constrain vendors, deployment regions, logs, backups, and analytics.",
    options: [
      "Data minimization with explicit retention by entity",
      "Consent and preference management for personal data",
      "Residency by tenant or market",
      "Audit-ready logs and evidence collection",
      "Framework mapping: SOC 2, ISO 27001, HIPAA, GDPR, PIPEDA/PHIPA, PCI, OSFI as applicable",
    ],
  },
  {
    id: "data-model-consistency",
    label: "Data model and consistency",
    why: "The core domain model decides what can be transacted safely, queried cheaply, and evolved without rewrites.",
    options: [
      "Relational source of truth for transactional domains",
      "Document store for flexible or content-heavy objects",
      "Event log for auditable workflows and replay",
      "Eventually consistent read models for analytics and search",
      "Strict consistency for money, inventory, health, identity, and permissions",
    ],
  },
  {
    id: "api-boundary",
    label: "API contract and versioning",
    why: "API style determines client complexity, partner readiness, testability, and future coding-agent handoff quality.",
    options: [
      "REST for public APIs and straightforward CRUD",
      "GraphQL for complex read composition across many resources",
      "gRPC for internal service-to-service contracts",
      "Webhook callbacks for external lifecycle events",
      "Versioned OpenAPI/AsyncAPI specs with contract tests",
    ],
  },
  {
    id: "integration-failure",
    label: "Integrations and failure isolation",
    why: "External dependencies fail, throttle, change contracts, and leak latency into the user experience unless isolated.",
    options: [
      "Circuit breakers and retry budgets",
      "Idempotency keys on all write integrations",
      "Dead-letter queues and replay tools",
      "Provider abstraction for critical vendors",
      "Degraded UX and partial availability when upstreams fail",
    ],
  },
  {
    id: "async-events",
    label: "Async jobs, events, and workflow orchestration",
    why: "Long-running work should not block request paths; workflow state needs observability and retry semantics.",
    options: [
      "Managed queues for background jobs",
      "Event bus for domain events and integration fan-out",
      "Workflow engine for multi-step, human-approved flows",
      "Outbox pattern to avoid lost events after database commits",
      "Exactly-once user outcome with at-least-once infrastructure",
    ],
  },
  {
    id: "realtime-notifications",
    label: "Realtime updates and notifications",
    why: "Realtime experiences have hidden scaling, delivery, retry, privacy, and offline-recovery requirements.",
    options: [
      "WebSockets for low-latency bi-directional state",
      "Server-sent events for simple one-way updates",
      "Push/SMS/email with user preferences and quiet hours",
      "Polling fallback for restricted networks",
      "Notification audit trail and delivery receipts",
    ],
  },
  {
    id: "scale-cache",
    label: "Scale, caching, and hot paths",
    why: "The highest-read flows need explicit cache ownership, invalidation, and stampede protection.",
    options: [
      "CDN for static and cacheable public reads",
      "Redis or managed cache for hot authenticated reads",
      "Read replicas and materialized views for heavy reporting",
      "Tenant partitioning before full sharding",
      "Backpressure and feature-level rate limits during bursts",
    ],
  },
  {
    id: "resilience-dr",
    label: "Resilience, disaster recovery, and multi-region",
    why: "Availability targets are only credible when failover paths, recovery objectives, and drills are defined.",
    options: [
      "Single-region with backups for MVP",
      "Active/passive standby for regulated or business-critical workloads",
      "Active/active only when latency and uptime justify conflict complexity",
      "Quarterly restore and failover drills",
      "Runbooks tied to SLO error-budget burn",
    ],
  },
  {
    id: "observability-audit",
    label: "Observability, auditability, and support",
    why: "Teams need to diagnose incidents, prove compliance, and support customers without reading raw production data.",
    options: [
      "OpenTelemetry traces, metrics, and structured logs",
      "Per-tenant dashboards and SLO burn alerts",
      "Append-only audit logs for sensitive actions",
      "Privacy-safe support console with break-glass workflow",
      "Cost telemetry per feature, tenant, and integration",
    ],
  },
  {
    id: "ai-agents",
    label: "AI agents, RAG, content, and image generation",
    why: "Agentic features need explicit memory, tools, subagents, evals, guardrails, and human review before output can be trusted.",
    options: [
      "Plain SDK call for single-shot generation",
      "RAG pipeline with citations and approved sources",
      "LangGraph or DeepAgents for multi-step workflows",
      "Filesystem-style memory, skills, and subagents for generated content/assets",
      "Eval suite, prompt versioning, privacy filters, and human-in-the-loop gates",
    ],
  },
  {
    id: "mobile-offline",
    label: "Mobile, responsive web, offline, and accessibility",
    why: "Mobile usability is not a separate app decision; it affects layout, auth, offline recovery, notifications, and accessibility.",
    options: [
      "Responsive web as the default",
      "PWA for installability and limited offline state",
      "Native app only when device APIs, app-store presence, or offline depth require it",
      "WCAG 2.2 AA and keyboard/screen-reader checks",
      "Offline conflict strategy for queued writes",
    ],
  },
  {
    id: "build-buy-lockin",
    label: "Build, buy, vendor lock-in, and migration path",
    why: "Early vendor choices speed up learning but can trap identity, billing, messaging, analytics, and AI workflows.",
    options: [
      "Buy commodity capabilities: auth, payments, notifications, observability",
      "Build differentiating domain logic",
      "Provider abstraction only around high-switching-cost vendors",
      "Export and migration plan for tenant-owned data",
      "ADR for each major dependency with replacement trigger",
    ],
  },
];

export const ARCHITECTURE_TRADEOFF_OPTIONS = ARCHITECTURE_SCENARIOS.map((scenario) => ({
  value: scenario.id,
  label: scenario.label,
}));

export const SECURITY_REVIEW_OPTIONS = [
  { value: "identity", label: "Identity / OAuth / SSO" },
  { value: "authorization", label: "RBAC / ABAC / tenant isolation" },
  { value: "data-protection", label: "Encryption / KMS / data classification" },
  { value: "privacy", label: "Privacy, consent, retention, residency" },
  { value: "secrets", label: "Secrets, config, credential rotation" },
  { value: "api-abuse", label: "API abuse, rate limits, bot protection" },
  { value: "supply-chain", label: "Dependency and container supply chain" },
  { value: "audit", label: "Audit logs and evidence collection" },
  { value: "incident-response", label: "Incident response and breach workflow" },
  { value: "ai-safety", label: "AI prompt injection, evals, and guardrails" },
];

export function architectureScenarioPriority(project: Project, scenarioId: string): "Review now" | "Monitor" {
  const selected = project.systemDesign.tradeoffAreas ?? [];
  const security = project.systemDesign.securityReviewAreas ?? [];
  if (selected.includes(scenarioId)) return "Review now";
  if (scenarioId === "identity-auth" && (project.platform.authRequired || project.platform.authMethod !== "api-key")) return "Review now";
  if (scenarioId === "authorization-tenancy" && (project.platform.rbacRequired || project.platform.multiTenant)) return "Review now";
  if (scenarioId === "security-baseline" && security.length > 0) return "Review now";
  if (scenarioId === "privacy-compliance" && project.compliance.frameworks.length > 0) return "Review now";
  if (scenarioId === "integration-failure" && project.dataTech.integrations.length > 0) return "Review now";
  if (scenarioId === "async-events" && (project.platform.backgroundJobs || project.platform.eventDriven || project.platform.webhooks)) return "Review now";
  if (scenarioId === "realtime-notifications" && (project.platform.realtimeNeeded || project.systemDesign.notificationsPerDay > 0)) return "Review now";
  if (scenarioId === "scale-cache" && (project.platform.caching || project.systemDesign.peakConcurrent > 1000)) return "Review now";
  if (scenarioId === "resilience-dr" && (project.systemDesign.drNeeded || project.systemDesign.multiRegion)) return "Review now";
  if (scenarioId === "observability-audit" && (project.compliance.auditLogs || project.platform.observability)) return "Review now";
  if (scenarioId === "ai-agents" && project.ai.needsAI) return "Review now";
  if (scenarioId === "mobile-offline" && (project.experience.primaryDevice === "mobile-first" || project.experience.offline || project.platform.responsiveRequired)) return "Review now";
  if (scenarioId === "build-buy-lockin" && project.dataTech.buildVsBuy) return "Review now";
  return "Monitor";
}

export function scenarioRecommendation(project: Project, scenarioId: string): string {
  switch (scenarioId) {
    case "identity-auth":
      return project.platform.authMethod === "saml"
        ? "Plan enterprise SSO with SAML/OIDC, SCIM, tenant policy controls, and audit-first admin operations."
        : project.platform.authMethod === "api-key"
          ? "Use scoped API keys or client credentials for service access; do not expose secrets in browsers or mobile clients."
          : "Prefer managed OIDC/OAuth2 with PKCE where applicable, RBAC integration, MFA for admins, and tenant-aware claims.";
    case "authorization-tenancy":
      return project.platform.multiTenant
        ? "Make tenant ID part of every data access path; test tenant-crossing denial as a release gate."
        : "Start with explicit roles and permissions, then add ABAC only when customer policy complexity demands it.";
    case "security-baseline":
      return "Use OWASP ASVS as the control checklist, add a threat model for top abuse paths, and wire secrets/KMS/rate limiting before production.";
    case "privacy-compliance":
      return project.compliance.frameworks.length > 0
        ? `Map controls to ${project.compliance.frameworks.join(", ")} and make entity retention/residency explicit.`
        : "Classify data now; even non-regulated products need retention, deletion, and analytics boundaries.";
    case "data-model-consistency":
      return project.platform.database === "postgres"
        ? "Keep Postgres as source of truth; add read models/search/vector stores only for specific access patterns."
        : "Document which store owns each entity and where consistency can be relaxed.";
    case "api-boundary":
      return `Generate contract-first ${project.platform.apiStyle.toUpperCase()} APIs with versioning, auth scopes, idempotency, and test fixtures for coding agents.`;
    case "integration-failure":
      return project.dataTech.integrations.length > 0
        ? "Wrap every integration with timeout, retry budget, circuit breaker, idempotency key, and operator replay path."
        : "No external integrations captured yet; revisit before payments, notifications, CRM, auth, or analytics are added.";
    case "async-events":
      return project.platform.eventDriven
        ? "Use domain events plus an outbox pattern; keep user-facing writes transactionally safe."
        : "Use a managed queue for slow jobs before introducing a broad event bus.";
    case "realtime-notifications":
      return project.platform.realtimeNeeded
        ? "Separate realtime state from notification delivery; use WebSocket/SSE plus delivery receipts and backpressure."
        : "Keep notifications async and preference-aware; avoid adding realtime infrastructure until the UX requires it.";
    case "scale-cache":
      return project.platform.caching
        ? "Define cache owner, TTL, invalidation event, stampede control, and privacy rules for every cached object."
        : "Defer cache until measurements show pressure, except CDN caching for static assets.";
    case "resilience-dr":
      return project.systemDesign.drNeeded
        ? "Set RTO/RPO, backups, restore tests, and active/passive failover before launch."
        : "Single-region is acceptable for MVP, but test backup restore and document the upgrade trigger.";
    case "observability-audit":
      return "Emit traces, metrics, structured logs, and audit events with tenant/user correlation and PII scrubbing.";
    case "ai-agents":
      return project.ai.agentFramework === "deepagents"
        ? "Use DeepAgents-style memory, skills, and subagents for content/architecture generation; require evals and human review before build handoff."
        : "Keep AI calls behind schemas, evals, prompt versions, privacy filtering, and human approval for high-impact actions.";
    case "mobile-offline":
      return project.experience.primaryDevice === "mobile-first" || project.platform.responsiveRequired
        ? "Design responsive first, test on phone widths, and add native/PWA only for offline/device requirements."
        : "Confirm mobile expectations anyway; most stakeholder reviews happen on phones.";
    case "build-buy-lockin":
      return "Buy commodity platforms early, build the differentiating workflow, and record replacement triggers in ADRs.";
    default:
      return "Review this area during architecture sign-off and capture the decision in an ADR.";
  }
}
