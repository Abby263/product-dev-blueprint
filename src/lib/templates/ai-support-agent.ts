import type { Project } from "../schema";
import { ALL_COMPLETE, TemplateMeta } from "./types";

const payload: Partial<Project> = {
  name: "AI customer support agent",
  oneLiner:
    "An RAG-grounded AI agent that answers customer questions from your help centre + ticketing history, with safe escalation to human agents.",
  ideaDescription:
    "We're building a customer-support AI agent for B2B SaaS companies. The agent answers Tier-1 questions in chat (web widget + Slack Connect), grounds every answer in approved docs (help centre, KB, past resolved tickets), and escalates with full context to a human when it can't answer or when policy requires it. Operators get a console to review traces, edit the source corpus, and tune guardrails. Eval-driven development is non-negotiable.",
  problem: {
    problem:
      "Customer support teams are flooded with repeated Tier-1 questions. Existing chatbots either hallucinate (LLM) or fail on anything novel (intent-based). Buyers lose trust after one bad answer and disable the tool.",
    audience: "Heads of Customer Support / CX leaders at mid-market B2B SaaS companies (50-500 support FTE).",
    whyNow:
      "LLMs are now good enough to answer when grounded; observability and eval tooling has matured (LangSmith, Langfuse, Arize); buyers expect AI in support and are budgeting for it.",
    successCriteria:
      "Resolve >= 35% of Tier-1 contacts end-to-end without human; escalation handoffs include full agent reasoning + sources; CSAT on AI-handled tickets >= 4.2/5.",
    outOfScope:
      "Voice support; multi-language beyond English in v1; outbound campaigns; agent-initiated proactive messages.",
    businessCase:
      "A mid-market support team with 100 agents costs ~$10M/yr fully loaded. Resolving 35% of Tier-1 saves ~$2M/yr. Platform pays for itself at $200K ACV.",
    priority: "P0",
  },
  market: {
    buyer: "VP Customer Support / CX",
    endUser: "Customer (end-user of the buyer's product) + the support agent who reviews handoffs",
    operator: "Support operations / KB owner who tunes the agent",
    alternatives:
      "Intercom Fin, Zendesk AI, Ada, Forethought, in-house LangChain prototypes, doing nothing.",
    differentiation:
      "Eval-first posture (regressions block release); transparent source attribution on every answer; safe-by-default escalation policies; multi-provider model routing without vendor lock-in.",
    marketSize:
      "~30K mid-market B2B SaaS companies in NA + EU. SAM ~$3B/yr at average ACV of $100K.",
    pricing: "Per-resolution + platform fee. $0.50/resolution + $2K/mo platform.",
    geo: ["united-states", "canada", "european-union"],
    vertical: "saas-internal",
  },
  experience: {
    surfaces: ["public-website", "internal-console", "api-only"],
    authMode: "mixed",
    primaryDevice: "responsive",
    offline: false,
    localization: "en-US (v1); fr-CA, es-ES, de-DE in v2",
    accessibility: "WCAG 2.2 AA",
    notifications: ["email", "in-app"],
    timingModel: "neither",
  },
  platform: {
    kinds: ["website", "saas-platform", "ai-agent", "admin-dashboard", "api-only"],
    webMarketing: true,
    webPortal: true,
    webAdmin: true,
    webPwa: false,
    webEnterprise: true,
    mobileIOS: false,
    mobileAndroid: false,
    mobileFramework: "none",
    frontend: "nextjs",
    uiFramework: "shadcn/ui + Tailwind",
    stateMgmt: "Zustand",
    designSystem: "Stripe / Linear-inspired neutral",
    authRequired: true,
    responsiveRequired: true,
    accessibilityRequired: true,
    backend: "fastapi",
    apiStyle: "rest",
    authMethod: "oidc",
    rbacRequired: true,
    backgroundJobs: true,
    webhooks: true,
    eventDriven: true,
    rateLimiting: true,
    caching: true,
    database: "cosmosdb",
    dataShape: "mixed",
    multiTenant: true,
    searchNeeded: true,
    realtimeNeeded: true,
    cloud: "azure",
    cicd: "GitHub Actions or Azure DevOps Pipelines",
    iac: "Terraform + Azure Verified Modules",
    observability: "Azure Monitor + Application Insights + OpenTelemetry + LangSmith",
    containerization: "docker",
    envStrategy: "dev / stage / prod with eval suite gating prod releases",
    deploymentRuntime:
      "Azure Container Apps for API and agent workers; Container Apps Jobs for corpus sync, reindexing, and eval runs; optional AKS for dedicated enterprise tenants.",
    cloudServices:
      "Azure OpenAI, Azure AI Search, Azure Cosmos DB, Azure Service Bus, Azure Event Grid, Azure Blob Storage, Azure Key Vault, Azure Monitor, Application Insights.",
    networking:
      "Hub-spoke VNet, private subnets, private endpoints for Azure OpenAI/Search/Cosmos/Storage, private DNS zones, Azure Front Door + WAF, NAT gateway for controlled egress.",
    scalingApproach:
      "KEDA autoscaling on queue depth and CPU, per-tenant throughput budgets, partitioned Azure AI Search indexes for large tenants, Cosmos DB RU autoscale with tenant-aware partition keys.",
    cicdDetails:
      "PR checks run unit, contract, tenant-isolation, prompt-injection, and eval suites; stage deploy runs synthetic conversations before approval to prod.",
    iacDetails:
      "Terraform modules own networking, private endpoints, Container Apps environments, Cosmos/Search/Service Bus, Key Vault, monitoring, and per-environment policy assignments.",
    enterpriseControls:
      "Managed identities, Key Vault-backed secrets, customer-managed keys for regulated tenants, private link-only data services, SIEM export, break-glass admin approvals, immutable audit storage.",
  },
  functional: {
    personas: [
      { id: "p1", name: "Customer (end-user)", jtbd: "Get my question answered in seconds without opening a ticket.", pains: "Bots that hallucinate or send me to wrong articles; long human-agent waits.", channel: "any" },
      { id: "p2", name: "Support agent", jtbd: "Get clean handoffs with reasoning + sources so I can resolve fast.", pains: "Bots dump raw transcripts on me; I have to redo discovery.", channel: "internal-console" },
      { id: "p3", name: "Support operations / KB owner", jtbd: "Keep the agent grounded in current docs; review failures; tune policy.", pains: "Black-box AI tools; can't see what the agent retrieved or said.", channel: "internal-console" },
      { id: "p4", name: "VP Customer Support", jtbd: "Buy a tool that demonstrably reduces volume without bricking trust.", pains: "Bot bad-answer headlines; tool that needs a team of prompt engineers to maintain.", channel: "internal-console" },
    ],
    requirements: [
      { id: "FR-001", kind: "functional", title: "Web chat widget", description: "Embeddable widget on customer-facing site with streaming responses + source citations.", acceptance: "Time-to-first-token < 1.5s; sources visible inline; handoff button always present.", priority: "must" },
      { id: "FR-002", kind: "functional", title: "Slack Connect channel", description: "Tenant can connect a Slack workspace; agent participates in customer Slack channels.", acceptance: "Bot joins on invite; respects channel-level guardrail config.", priority: "should" },
      { id: "FR-003", kind: "functional", title: "RAG over approved corpus", description: "Index help-centre articles + resolved tickets; ground every answer with sources.", acceptance: "Every answer includes >= 1 source citation or explicit \"I don't know\" + escalation.", priority: "must" },
      { id: "FR-004", kind: "functional", title: "Safe escalation", description: "Confidence threshold + topic policy triggers human handoff with full context.", acceptance: "Handoff includes user message, agent reasoning, sources retrieved, and confidence score.", priority: "must" },
      { id: "FR-005", kind: "functional", title: "Operator console — traces", description: "Browse, filter, and replay agent runs; flag issues for eval set.", acceptance: "Trace view shows prompt, retrieved docs, model output, tool calls, latency, cost.", priority: "must" },
      { id: "FR-006", kind: "functional", title: "Eval suite", description: "Reference questions with expected behaviour; offline + sampled-online grading.", acceptance: "Failing eval set blocks deploy; results posted to PR.", priority: "must" },
      { id: "FR-007", kind: "functional", title: "Guardrails", description: "Prompt-injection defenses, output validation, PII redaction, restricted-topic policies.", acceptance: "OWASP LLM Top 10 mitigations active; injection test set runs in CI.", priority: "must" },
      { id: "FR-008", kind: "functional", title: "Source corpus management", description: "Upload, sync, and version source docs; mark approved vs. draft; expire stale.", acceptance: "Source change is reflected in retrievals within 5 minutes.", priority: "should" },
      { id: "NFR-001", kind: "nonfunctional", title: "Per-resolution cost ceiling", description: "Average $/resolution must stay under $0.30 at 1M resolutions/month.", acceptance: "Cost telemetry alarms above $0.40/resolution sustained 24h.", priority: "must" },
      { id: "NFR-002", kind: "nonfunctional", title: "Retrieval recall", description: "Top-5 retrieval recall on labeled eval set.", acceptance: ">= 0.90 on the standing eval set; gating CI.", priority: "must" },
    ],
    features: [
      { id: "FEAT-001", name: "Embeddable web chat widget", description: "Streamed chat UI with citations and a clear handoff button.", userStory: "As a customer, I get answers fast and can escalate to a human if needed.", acceptance: "TTFT < 1.5s; sources rendered inline.", priority: "must", complexity: "M", businessValue: "high", dependencies: "RAG, model provider", apisNeeded: "POST /agent/messages, WS /agent/stream", dataNeeded: "Conversation, Message", edgeCases: "User on slow network; provider rate-limit; user spams long messages", errorStates: "Show last assistant message; offer retry; escalate on repeated failure", adminControls: "Per-tenant theme + welcome message", audit: "Every message logged with model + cost", security: "CSP + iframe sandbox; no PII in URL", futureEnhancements: "Voice input", release: "mvp" },
      { id: "FEAT-002", name: "RAG retrieval pipeline", description: "Embed, search, and ground answers in approved sources.", userStory: "As a KB owner, I publish docs and the agent uses them.", acceptance: "Source change visible to retrievals in <5 min.", priority: "must", complexity: "L", businessValue: "high", dependencies: "Vector DB, embedding model", apisNeeded: "/corpus/*", dataNeeded: "Document, Chunk, Embedding", edgeCases: "Long doc (>50K tokens); image-only doc; deprecated doc", errorStates: "Fall back to general LLM with explicit \"no source found\"", adminControls: "Reindex; archive doc", audit: "Retrieval log per query", security: "Tenant-scoped indexes", futureEnhancements: "Multimodal retrieval (images, tables)", release: "mvp" },
      { id: "FEAT-003", name: "Tool / function calling", description: "Agent can call typed functions to fetch data or take actions.", userStory: "As a customer, the agent looks up my account and answers based on my data.", acceptance: "Tool calls validated against schema; failures surfaced.", priority: "should", complexity: "L", businessValue: "high", dependencies: "Tool registry", apisNeeded: "/tools/*", dataNeeded: "Tool, ToolCall", edgeCases: "Tool times out; tool returns nothing; tool fails after retry", errorStates: "Agent says \"couldn't reach X, try again\"", adminControls: "Per-tenant tool allowlist", audit: "Every tool call logged with args + result", security: "Tool args validated; rate-limited per user", futureEnhancements: "Self-served tool marketplace", release: "v1" },
      { id: "FEAT-004", name: "Safe escalation handoff", description: "Confidence + topic policy triggers human handoff with full context.", userStory: "As a support agent, I receive handoffs with all the context I need.", acceptance: "Handoff includes reasoning + sources + tool calls.", priority: "must", complexity: "M", businessValue: "high", dependencies: "Ticketing integration", apisNeeded: "/handoffs/*", dataNeeded: "Handoff", edgeCases: "Off-hours; no agents available; user disconnects", errorStates: "Schedule callback; queue ticket", adminControls: "Per-tenant SLA + routing rules", audit: "Every handoff with full payload", security: "PII redacted in logs", futureEnhancements: "Auto-summary for the agent inbox", release: "mvp" },
      { id: "FEAT-005", name: "Eval suite", description: "Offline + sampled-online evaluation with gating.", userStory: "As a maintainer, I detect regressions before users do.", acceptance: "Failing evals block deploy; results posted to PR.", priority: "must", complexity: "L", businessValue: "high", dependencies: "Eval framework (LangSmith / custom)", apisNeeded: "/evals/*", dataNeeded: "EvalSet, EvalRun", edgeCases: "Flaky LLM judges; data drift", errorStates: "Halt deploy + page on-call", adminControls: "Add/remove eval cases; threshold tuning", audit: "Every run logged with diffs", security: "Eval data residency tenant-scoped", futureEnhancements: "User-recorded \"my custom eval\"", release: "mvp" },
      { id: "FEAT-006", name: "Guardrails", description: "Prompt-injection defenses, output validation, PII redaction.", userStory: "As a security owner, I prevent unsafe outputs and inputs.", acceptance: "OWASP LLM Top 10 mitigations active.", priority: "must", complexity: "M", businessValue: "high", dependencies: "Guardrail framework", apisNeeded: "—", dataNeeded: "—", edgeCases: "Mixed legitimate + injection input; multi-turn injection across messages", errorStates: "Refuse with neutral message; log to security stream", adminControls: "Per-tenant policy editor (advanced)", audit: "Every block logged with reason", security: "Treat as security event", futureEnhancements: "Adaptive injection signature updates", release: "mvp" },
      { id: "FEAT-007", name: "Operator trace console", description: "Browse, filter, replay agent runs; flag for eval set.", userStory: "As an operator, I review failures and add them to evals.", acceptance: "Trace view shows prompt + retrieval + tools + output + latency + cost.", priority: "must", complexity: "L", businessValue: "high", dependencies: "Observability backend (LangSmith / Langfuse)", apisNeeded: "/traces/*", dataNeeded: "Trace, Span", edgeCases: "Long traces (1000+ spans)", errorStates: "Pagination + summarized view", adminControls: "Trace retention per tenant", audit: "Read access logged", security: "Tenant-scoped + RBAC", futureEnhancements: "Diff two runs; share annotated trace link", release: "mvp" },
      { id: "FEAT-008", name: "Source corpus management", description: "Upload, sync, and version source docs.", userStory: "As a KB owner, I manage what the agent reads from.", acceptance: "Source change visible in <5 min.", priority: "should", complexity: "M", businessValue: "high", dependencies: "—", apisNeeded: "/corpus/*", dataNeeded: "Document, DocumentVersion", edgeCases: "Large doc upload; image-only; broken link", errorStates: "Show parse failures with remediation", adminControls: "Approve / archive workflow", audit: "Every change logged", security: "RBAC: KB editor", futureEnhancements: "Auto-pull from Notion / Confluence / Zendesk", release: "v1" },
      { id: "FEAT-009", name: "Multi-provider model routing", description: "Route by tenant policy: hot path on hosted (Claude / GPT), batch on self-hosted.", userStory: "As ops, I tune cost vs. quality without redeploying.", acceptance: "Provider switch propagates in <5 min.", priority: "should", complexity: "M", businessValue: "high", dependencies: "Multi-provider SDK", apisNeeded: "—", dataNeeded: "RoutingPolicy", edgeCases: "Provider outage; cost ceiling hit", errorStates: "Fail over to next provider; alert on cost burn", adminControls: "Per-tenant policy editor", audit: "Routing decision logged per call", security: "—", futureEnhancements: "Per-question routing based on retrieval confidence", release: "v1" },
      { id: "FEAT-010", name: "Per-resolution cost telemetry", description: "Track cost per conversation + resolution; alarm on burn.", userStory: "As ops, I keep $/resolution under our cap.", acceptance: "Alarm fires within 1h of sustained 24h burn.", priority: "must", complexity: "S", businessValue: "high", dependencies: "Observability", apisNeeded: "/cost/*", dataNeeded: "CostEvent", edgeCases: "Provider price change mid-month", errorStates: "Pause new conversations on budget exhausted (configurable)", adminControls: "Per-tenant budget", audit: "—", security: "—", futureEnhancements: "Predictive budget overrun alerts", release: "mvp" },
      { id: "FEAT-011", name: "Audit log of every interaction", description: "Append-only log of conversations + agent decisions.", userStory: "As a compliance owner, I review what was said and shown.", acceptance: "Logs retained 13 months; tamper-evident.", priority: "must", complexity: "M", businessValue: "high", dependencies: "—", apisNeeded: "/audit/*", dataNeeded: "AuditEvent", edgeCases: "Bulk export request; subject access request", errorStates: "Streaming export to SIEM", adminControls: "Search + export", audit: "—", security: "Immutable storage", futureEnhancements: "—", release: "mvp" },
    ],
    kpis: [
      { id: "KPI-001", name: "Resolution rate", definition: "% of Tier-1 conversations resolved without human", target: ">= 35%", cadence: "weekly" },
      { id: "KPI-002", name: "CSAT (AI-handled)", definition: "Customer satisfaction score on AI-only conversations", target: ">= 4.2 / 5", cadence: "weekly" },
      { id: "KPI-003", name: "Cost per resolution", definition: "Total LLM + tooling cost / resolutions", target: "<= $0.30", cadence: "weekly" },
      { id: "KPI-004", name: "Eval pass rate", definition: "% of standing eval set passing on prod model + prompts", target: ">= 95%", cadence: "per-deploy" },
    ],
    businessRules:
      "Agent never invents sources; if no source found, it says \"I don't have that\" and offers human handoff. Restricted topics (legal, medical, financial advice) auto-escalate. PII is redacted in logs by default; raw stored only with explicit per-tenant opt-in. Eval failures block deploy.",
    edgeCases:
      "Prompt injection in user message; multi-turn injection; provider outage mid-conversation; source corpus stale; user asks for restricted topic; user spams; user demands escalation; tool times out; cost budget exhausted; off-hours handoff.",
  },
  nonfunctional: {
    availabilityTarget: "99.9% per tenant",
    rto: "1 hour",
    rpo: "5 minutes",
    performance: "p95 TTFT < 1.5s; p95 full-response < 6s; tool call median < 500ms",
    privacyPosture:
      "PII redacted at log layer by default; opt-in raw retention per tenant. No customer data sent to a model provider that isn't on the tenant's approved list.",
    auditability:
      "Every conversation, retrieval, tool call, model call, guardrail block, and handoff captured in append-only audit log. 13-month retention default; longer for regulated tenants.",
    costBoundary: "$/resolution under $0.30; $/conversation under $0.15.",
    supportModel: "Email 9-5 ET + on-call for P1; Slack Connect channel for Pro tenants.",
    slos: [
      { id: "SLO-001", surface: "Web widget", metric: "TTFT p95", target: "< 1.5s" },
      { id: "SLO-002", surface: "Eval suite", metric: "pass rate on standing set", target: ">= 95% gating prod" },
      { id: "SLO-003", surface: "Retrieval", metric: "top-5 recall on labeled set", target: ">= 0.90" },
      { id: "SLO-004", surface: "Cost per resolution", metric: "weekly average", target: "<= $0.30" },
      { id: "SLO-005", surface: "Handoff", metric: "context completeness (audited sample)", target: ">= 95%" },
    ],
  },
  dataTech: {
    entities: [
      { id: "ENT-001", name: "Tenant", description: "Buyer org with config, policies, and source corpus.", sensitive: false, retention: "Indefinite while active" },
      { id: "ENT-002", name: "EndUser", description: "Customer of the buyer using the chat widget.", sensitive: true, retention: "13 months" },
      { id: "ENT-003", name: "Conversation", description: "Threaded chat session with messages, retrievals, tool calls, and outcome.", sensitive: true, retention: "13 months" },
      { id: "ENT-004", name: "Document", description: "Source-corpus document with version + approval status.", sensitive: false, retention: "Indefinite while active" },
      { id: "ENT-005", name: "Embedding", description: "Vector for a document chunk, scoped per tenant.", sensitive: false, retention: "Tied to Document version" },
      { id: "ENT-006", name: "Trace", description: "Full agent run log: prompt, retrieval, tools, outputs, latency, cost.", sensitive: true, retention: "13 months" },
      { id: "ENT-007", name: "EvalSet / EvalRun", description: "Reference questions and run results.", sensitive: false, retention: "Indefinite" },
    ],
    integrations: [
      { id: "INT-001", system: "Azure OpenAI", direction: "outbound", protocol: "REST", dataClass: "Prompt + completion (PII risk)", notes: "Private endpoint; per-tenant approved deployment/model policy." },
      { id: "INT-002", system: "Azure AI Search", direction: "outbound", protocol: "REST", dataClass: "Embeddings + chunk metadata", notes: "Hybrid vector/keyword indexes scoped by tenant and data residency." },
      { id: "INT-003", system: "LangSmith or OpenTelemetry collector", direction: "outbound", protocol: "REST/OTLP", dataClass: "Trace data (PII redacted)", notes: "Per-tenant project or App Insights workspace; retention aligned with audit." },
      { id: "INT-004", system: "Zendesk / Intercom / Help Scout", direction: "bidirectional", protocol: "REST + Webhooks", dataClass: "Tickets, KB articles", notes: "Source for KB sync + handoff destination." },
      { id: "INT-005", system: "Slack", direction: "bidirectional", protocol: "Web API + Events API", dataClass: "Messages", notes: "Slack Connect channels for Pro tier." },
      { id: "INT-006", system: "Azure Monitor / Application Insights", direction: "outbound", protocol: "OTLP/HTTPS", dataClass: "Metrics + traces", notes: "Infra observability; no raw conversation content." },
    ],
    dataResidency: "East US by default; Canada Central and West Europe for residency-bound tenants. Cosmos DB, Azure AI Search, Blob, and trace stores remain region-aligned.",
    buildVsBuy:
      "Buy: Azure OpenAI, Azure AI Search, Cosmos DB, Service Bus, Key Vault, LangSmith/OpenTelemetry. Build: DeepAgents/LangGraph orchestration, guardrails, multi-provider policy, operator console, eval gating in CI.",
  },
  systemDesign: {
    architecturePattern: "event-driven",
    authArchitecture: "enterprise-sso",
    deploymentTopology: "hybrid",
    tradeoffAreas: ["identity-auth", "authorization-tenancy", "schema-design-lld", "deployment-infra", "ai-agents", "testing-release"],
    securityReviewAreas: ["identity", "authorization", "data-protection", "privacy", "secrets", "api-abuse", "audit", "incident-response", "ai-safety"],
    highLevelArchitectureNotes:
      "Azure Front Door + WAF fronts the Next.js/admin surfaces and FastAPI agent API. Azure AD B2C/Auth0 handles tenant identity. Azure Container Apps hosts API, agent workers, sync workers, and eval jobs. Azure OpenAI, Azure AI Search, Cosmos DB, Blob Storage, Service Bus, and Key Vault stay behind private endpoints.",
    lowLevelArchitectureNotes:
      "Modules: TenantConfig, Corpus, Retrieval, AgentRun, Conversation, Handoff, Eval, Audit, Billing. DeepAgents workspace writes architecture/content artifacts from validated project input, with architecture/security/content subagents and human approval before artifact publication.",
    domainModelNotes:
      "Tenant owns policies, identity mappings, corpus, routing policy, budgets, and retention. Conversation owns messages, retrievals, tool calls, handoffs, cost events, and trace references. Corpus owns documents, versions, chunks, embeddings, approvals, and index jobs.",
    schemaDesignNotes:
      "Cosmos containers: tenants, conversations, corpus_documents, agent_runs, eval_runs, audit_events. Partition by tenant_id plus hot-path discriminator where needed. Azure AI Search index per tenant tier or shared index with tenant_id filter; chunks include document_version_id, ACL hash, embedding_ref, and retention metadata.",
    dataLifecycleNotes:
      "Document versions are immutable; reindex creates a new active index alias. Conversation and trace data retain 13 months by default. Audit events are append-only and exported to immutable Blob storage. Tenant deletion runs staged purge across Cosmos, Search, Blob, traces, and backups.",
    apiContractNotes:
      "Contract-first REST APIs with OpenAPI. POST /agent/messages uses idempotency keys and streaming response channel. Webhooks to ticketing systems use signed payloads and replay IDs. Tool calls use JSON Schema and tenant-scoped OAuth connections.",
    serviceBoundaryNotes:
      "Corpus module owns ingestion, chunking, approval, and indexing. Retrieval module exposes search/query only. Agent module orchestrates DeepAgents/LangGraph runs. Handoff module owns ticket creation. Eval module owns test datasets and gates. Audit module is append-only.",
    workflowStateNotes:
      "Document: draft -> approved -> indexing -> indexed -> archived. Conversation: open -> answered -> escalated -> resolved. EvalRun: queued -> running -> passed/failed -> approved. Failed jobs land in Service Bus dead-letter queues with replay tooling.",
    integrationContractNotes:
      "Every connector has timeout, retry budget, circuit breaker, idempotent upsert, and per-tenant OAuth secret in Key Vault. Ticketing handoff failures queue for operator replay. Provider outage triggers routing policy fallback or safe escalation.",
    securityArchitectureNotes:
      "Tenant-aware OIDC claims, RBAC for operators, service principals through managed identities, private endpoints for data/AI services, PII redaction before traces leave runtime, prompt-injection test suite, and immutable audit events for sensitive actions.",
    observabilityDesignNotes:
      "OpenTelemetry spans cover request, retrieval, model call, tool call, guardrail decision, handoff, cost, and eval result. SLO dashboards by tenant/surface. Alerts use error-budget burn, retrieval recall, model latency, cost per resolution, and dead-letter depth.",
    infraArchitectureNotes:
      "Terraform provisions VNet, private endpoints, Container Apps environment, Container Apps Jobs, Service Bus, Cosmos DB, Azure AI Search, Blob, Key Vault, Front Door/WAF, App Insights, and role assignments. Prod promotion requires eval pass and approval.",
    testArchitectureNotes:
      "CI runs unit, OpenAPI contract, tenant isolation, authorization-negative, prompt-injection, retrieval recall, and eval regression suites. Load tests validate streaming, search, Service Bus workers, and Cosmos RU budgets. Coding-agent tasks map to module boundaries and fixtures.",
    expectedUsersTotal: 50_000_000,
    dau: 500_000,
    mau: 3_000_000,
    peakConcurrent: 25_000,
    avgRequestsPerUserPerDay: 6,
    readWriteRatio: "70:30",
    dataGrowthGBPerMonth: 500,
    notificationsPerDay: 50_000,
    availabilityTarget: "99.9%",
    latencyTargetMs: 1500,
    geographicCoverage: "NA + EU split by tenant data residency",
    multiRegion: false,
    drNeeded: true,
    cachingStrategy:
      "Azure Cache for Redis for hot session state and prompt/result cache where policy allows; Azure AI Search semantic reranker cache for repeat retrievals; CDN for static.",
    dbScalingStrategy:
      "Cosmos DB for tenant/config/conversation/audit with tenant-aware partition keys and autoscale RU budgets; Azure AI Search for hybrid vector/keyword retrieval; Blob cold tier for old traces and exports.",
    queueStrategy:
      "Azure Service Bus for async tool calls, corpus reindexing, eval jobs, and handoffs; Event Grid for cross-service lifecycle events; dead-letter queues with replay commands.",
    notes:
      "LLM cost is the dominant infra spend; cache hits and routing policy are the levers. Trace storage compresses well in ClickHouse.",
  },
  ai: {
    needsAI: true,
    kinds: ["chatbot", "agent", "summarizer", "search"],
    ragNeeded: true,
    dataSources: "Approved help-centre articles, public docs, resolved tickets, in-product copy.",
    modelProvider: "azure-openai",
    agentFramework: "deepagents",
    observability: "openllmetry",
    vectorDb: "azure-ai-search",
    humanInLoop: true,
    guardrails: true,
    evaluation: true,
    promptManagement: true,
    auditLogs: true,
    privacyFiltering: true,
    notes:
      "Azure OpenAI deployment per model class; DeepAgents/LangGraph workspace with memory, skills, and subagents for architecture/content generation plus explicit retrieval, tool, generate, verify, and handoff nodes. Eval gating in CI is non-negotiable.",
  },
  compliance: {
    processesPersonalData: true,
    processesFinancialData: false,
    processesHealthData: false,
    frameworks: ["SOC2", "ISO27001", "GDPR", "OWASP-LLM", "NIST-AI-RMF", "OWASP-ASVS"],
    consentMgmt: true,
    auditLogs: true,
    encryptionAtRest: true,
    encryptionInTransit: true,
    rbacRequired: true,
    dataResidencyRequired: true,
    incidentResponseRequired: true,
    pentestCadence: "annual + AI red-team per major model swap",
    threatModel:
      "Top threats: prompt injection via user input, source-corpus poisoning, model-provider outage cascading to agent failures, PII leakage via log aggregation. Mitigations: layered guardrails, signed source-corpus changes, multi-provider failover, log scrubbing at exporter.",
  },
  gtm: {
    packaging: "saas",
    segments: "Mid-market B2B SaaS (50-500 support FTE) with mature help centre + ticketing.",
    buyerObjections:
      "Bots hallucinate; lock-in to a model provider; data privacy concerns; replacement vs. augmentation politics on the support team.",
    salesMotion: "Outbound + design-partner pilots; PLG self-serve for the widget tier; assisted enterprise for Slack Connect + custom guardrails.",
    channelStrategy: "Direct in Y1; Zendesk + Intercom marketplace listings in Y1; SI partnerships in Y2.",
    launchGeography: "US + Canada in Y1; EU in Q3 with separate data residency.",
    complianceGating: "SOC 2 Type 1 by month 6; SOC 2 Type 2 by month 18; GDPR DPA + EU residency before EU GA.",
    pricingModel: "Per-resolution ($0.50) + platform ($2K/mo). Pro tier ($5K/mo) adds Slack Connect + custom guardrails + retention controls.",
    acquisitionChannels: "Outbound to VP CX; CX-leader newsletters; conference (Support World, CX Network); referrals from design partners.",
    retentionStrategy: "Weekly digest of resolution rate + cost-per-resolution; monthly trace review with the support ops owner; QBR with the VP.",
    partnerships: "Zendesk, Intercom, Help Scout marketplace integrations; LangSmith / Langfuse co-marketing.",
    competitors: "Intercom Fin, Zendesk AI, Ada, Forethought, in-house LangChain prototypes.",
    positioning:
      "For VP-CX leaders at mid-market B2B SaaS who've been burned by hallucinating chatbots, our agent grounds every answer in your approved corpus, escalates safely when it can't, and gives ops a transparent trace console so you can trust it without becoming a prompt engineer.",
    marketingKpis: "Pipeline / quarter; design-partner conversion to paid; widget activation rate (paid trial → first 10K resolutions).",
  },
  governance: {
    owner: "VP Product",
    approvers: "VP Eng, Head of Privacy, Head of Customer Support (design partner success)",
    dependencies: "Azure OpenAI quota and private endpoint approval; Azure AI Search capacity; Cosmos DB RU budget; LangSmith/OpenTelemetry trace strategy; Zendesk + Intercom partner program access.",
    thirdParties: "Microsoft Azure, Azure OpenAI, Azure AI Search, Cosmos DB, LangSmith, Zendesk, Intercom, Auth0.",
    legalReviews: "DPAs with all model providers; EU data residency contract terms; subprocessor list per tenant.",
    procurementReviews: "Azure consumption commitment, Azure OpenAI capacity reservation, LangSmith enterprise tier sign-off, subprocessor list reviewed quarterly.",
    unvalidatedAssumptions: "Tenants will accept multi-provider routing without provider lock-in concerns; design partners will share traces with us during pilot; eval set per tenant is a meaningful unit (vs. pooled).",
    decisionConfidence: "high",
  },
  stakeholders: [
    { id: "s1", role: "VP Product", responsibility: "Roadmap, scope, design-partner success" },
    { id: "s2", role: "VP Engineering", responsibility: "Agent platform; eval infra; on-call" },
    { id: "s3", role: "Head of Privacy", responsibility: "GDPR + tenant data isolation" },
    { id: "s4", role: "Lead AI Engineer", responsibility: "Agent graph design, model selection, evals" },
    { id: "s5", role: "Head of Customer Success", responsibility: "Pilot success criteria; ops console workflow" },
  ],
  decisions: [
    { id: "ADR-001", title: "Use DeepAgents/LangGraph for agent orchestration", context: "Need stateful, branchable, human-in-the-loop-friendly agent graphs plus filesystem-style memory, skills, and subagents for PM-ready content generation.", decision: "DeepAgents/LangGraph for agent runtime and generated-content workflows; OpenTelemetry/LangSmith-compatible traces.", alternatives: "Plain SDK calls; LangChain-only chains; in-house orchestrator.", consequences: "More explicit agent workspace design; better architecture/content generation and reviewability.", status: "accepted", confidence: "high" },
    { id: "ADR-002", title: "Azure OpenAI first with provider abstraction", context: "Enterprise buyers want private networking, data residency, and contracted Azure controls, but model lock-in remains a risk.", decision: "Azure OpenAI on the hot path with a provider abstraction and per-tenant approved model policy.", alternatives: "Single public OpenAI provider; multi-provider from day 1.", consequences: "Stronger enterprise posture; secondary provider rollout remains possible without rewriting the agent boundary.", status: "accepted", confidence: "high" },
    { id: "ADR-003", title: "Azure AI Search for vectors and hybrid retrieval", context: "Azure-native RAG benefits from private endpoints, hybrid keyword/vector retrieval, semantic ranker, and enterprise access controls.", decision: "Azure AI Search for vector + keyword retrieval; revisit pgvector/Qdrant if cost or portability dominates.", alternatives: "Pinecone, pgvector, Qdrant self-host.", consequences: "Azure coupling; simpler enterprise security and operations.", status: "accepted", confidence: "medium" },
    { id: "ADR-004", title: "Eval gating in CI is mandatory", context: "Eval-driven development is non-negotiable for buyer trust.", decision: "Failing standing eval set blocks deploys; eval results posted to PR.", alternatives: "Manual eval review only.", consequences: "Slower iteration when eval set drifts; much safer trajectory.", status: "accepted", confidence: "high" },
  ],
  risks: [
    { id: "RISK-001", description: "Prompt-injection attack succeeds and produces unsafe output.", likelihood: "medium", impact: "high", mitigation: "Multi-layer guardrails; injection eval set in CI; quarterly red-team." },
    { id: "RISK-002", description: "Cost/resolution exceeds $0.30 cap at scale and erodes margin.", likelihood: "medium", impact: "high", mitigation: "Provider routing policy; embedding + response caching; per-tenant budget caps." },
    { id: "RISK-003", description: "Source corpus rot — agent answers from stale docs.", likelihood: "high", impact: "medium", mitigation: "Sync from upstream KB on a schedule; expire docs not touched in 6mo with KB-owner review." },
    { id: "RISK-004", description: "Model provider outage breaks the platform during business hours.", likelihood: "medium", impact: "high", mitigation: "Multi-provider failover; circuit breakers; degraded mode that escalates to humans." },
  ],
  assumptions: [
    { id: "ASM-001", text: "Mid-market support teams will share traces with us during pilots.", validated: false },
    { id: "ASM-002", text: "Per-resolution pricing aligns with how customers think about value.", validated: false },
    { id: "ASM-003", text: "OWASP LLM Top 10 + NIST AI RMF mapping is sufficient for SOC 2 audit prep.", validated: true },
    { id: "ASM-004", text: "An eval set of 200 cases per tenant is enough signal for gating.", validated: false },
  ],
  openQuestions: [
    { id: "Q-001", text: "Per-tenant eval sets vs. pooled — which gives better gating signal?", owner: "Lead AI Engineer" },
    { id: "Q-002", text: "Do we ship Slack Connect at GA or as a Pro-tier follow-up?", owner: "VP Product" },
    { id: "Q-003", text: "How do we handle a tenant on a deprecated source-corpus version with stale answers?", owner: "Head of Customer Success" },
  ],
  progress: ALL_COMPLETE,
};

export const AI_AGENT_TEMPLATE: TemplateMeta = {
  id: "ai-support-agent",
  title: "AI customer support agent",
  blurb:
    "RAG-grounded support agent with safe escalation, eval-gated deploys, and an operator trace console.",
  vertical: "B2B SaaS support / CX",
  stackChips: ["Next.js", "FastAPI", "DeepAgents", "Azure OpenAI", "Azure AI Search"],
  complianceChips: ["SOC 2", "ISO 27001", "GDPR", "OWASP LLM"],
  scaleChip: "B2B SaaS · 500K DAU · Azure-native RAG",
  payload,
};
