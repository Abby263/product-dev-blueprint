// Option catalogs with short, opinionated explanations of when each
// choice is preferred. The OptionSelect component renders the active
// option's description below the select so users get guidance inline.

export interface OptionDef {
  value: string;
  label: string;
  hint: string;        // short "best for" description shown below the select
}

export const FRONTEND_OPTIONS: OptionDef[] = [
  { value: "nextjs", label: "Next.js", hint: "Best for: SEO-relevant marketing sites + logged-in app in one codebase. App Router, SSR/ISR, Vercel-native." },
  { value: "react", label: "React (Vite)", hint: "Best for: SPA dashboards behind auth, no SEO need. Lighter than Next.js for purely client-rendered apps." },
  { value: "vue", label: "Vue 3", hint: "Best for: teams with Vue experience or progressive-enhancement of existing pages. Smaller learning curve than React for many." },
  { value: "angular", label: "Angular", hint: "Best for: large enterprise frontends with strong opinions, DI, and long-term maintenance." },
  { value: "svelte", label: "Svelte / SvelteKit", hint: "Best for: small, fast-startup apps where bundle size matters. Less ecosystem than React." },
  { value: "html", label: "Plain HTML / CSS / JS", hint: "Best for: tiny static sites or progressive enhancement of server-rendered HTML." },
  { value: "other", label: "Other", hint: "Anything else — capture the choice in a project ADR." },
];

export const BACKEND_OPTIONS: OptionDef[] = [
  { value: "fastapi", label: "Python FastAPI", hint: "Best for: API-first products, async I/O, typed contracts, strong AI/ML ecosystem integration." },
  { value: "django", label: "Python Django", hint: "Best for: classic CRUD apps with admin UIs, ORM-heavy, batteries-included for content/auth." },
  { value: "express", label: "Node.js Express", hint: "Best for: small services where you want JS end-to-end. Minimal opinions; pick libs yourself." },
  { value: "nestjs", label: "NestJS", hint: "Best for: TypeScript backends that need structure (modules, DI). Angular-style architecture." },
  { value: "spring", label: "Java Spring Boot", hint: "Best for: enterprise Java shops, regulated environments, mature monitoring/security tooling." },
  { value: "dotnet", label: ".NET Core", hint: "Best for: Windows-first enterprises or teams with C# expertise. Strong tooling and performance." },
  { value: "go", label: "Go", hint: "Best for: high-throughput services, simple binaries, low cold starts. Small ecosystem trade-off." },
  { value: "rails", label: "Ruby on Rails", hint: "Best for: rapid CRUD prototypes, founder-led builds, opinionated conventions." },
  { value: "other", label: "Other", hint: "Anything else — capture the choice in a project ADR." },
];

export const API_STYLE_OPTIONS: OptionDef[] = [
  { value: "rest", label: "REST", hint: "Best for: most public APIs. Cacheable, debuggable, well-understood. Default choice." },
  { value: "graphql", label: "GraphQL", hint: "Best for: complex client needs with many shapes of the same data — e.g. dashboards reading 5+ resources per page." },
  { value: "grpc", label: "gRPC", hint: "Best for: internal service-to-service traffic where you control both ends. Binary, fast, schema-first." },
  { value: "mixed", label: "Mixed", hint: "REST for external + gRPC internal is common. Capture the boundary explicitly in an ADR." },
];

export const AUTH_METHOD_OPTIONS: OptionDef[] = [
  { value: "oidc", label: "OIDC / OAuth2", hint: "Best for: enterprise SSO and consumer social login. Use Auth0, Clerk, or Cognito unless you have a strong reason to host." },
  { value: "saml", label: "SAML", hint: "Best for: B2B enterprise where the buyer requires SAML SSO. Pair with OIDC for non-SAML tenants." },
  { value: "jwt", label: "JWT (custom)", hint: "Best for: APIs where you control the issuer and lifecycle. Be careful with revocation and key rotation." },
  { value: "session", label: "Server sessions", hint: "Best for: classic web apps. Simple to invalidate; pair with httpOnly cookies and CSRF protection." },
  { value: "api-key", label: "API keys", hint: "Best for: machine-to-machine calls. Scope keys narrowly; rotate them; never put in client code." },
  { value: "magic-link", label: "Magic link", hint: "Best for: low-friction consumer onboarding. Can replace passwords entirely; pair with rate limiting." },
];

export const DATABASE_OPTIONS: OptionDef[] = [
  { value: "postgres", label: "PostgreSQL", hint: "Best for: most apps. Strong relational + JSONB + full-text search + extensions (pgvector for AI). Default choice." },
  { value: "mysql", label: "MySQL", hint: "Best for: existing MySQL shops or where MySQL replication is already operationalized." },
  { value: "mongodb", label: "MongoDB", hint: "Best for: heavily denormalized document workloads, schema-flexible domains. Trade-off: weaker joins." },
  { value: "cosmosdb", label: "Azure Cosmos DB", hint: "Best for: globally distributed document/key-value workloads in Azure. Design partition keys and RU budgets early." },
  { value: "dynamodb", label: "DynamoDB", hint: "Best for: massive scale with predictable access patterns. AWS-native; expensive if patterns drift." },
  { value: "firebase", label: "Firebase / Firestore", hint: "Best for: mobile-first apps with realtime sync. Vendor-locked; cost can grow fast." },
  { value: "supabase", label: "Supabase", hint: "Best for: small teams that want Postgres + auth + storage + realtime in one managed package." },
  { value: "redis", label: "Redis (primary)", hint: "Rare as primary store. Best for: ephemeral state, queues, real-time leaderboards. Usually a cache." },
  { value: "elasticsearch", label: "Elasticsearch / OpenSearch", hint: "Best for: search-heavy apps, log analytics. Don't make it your primary store." },
  { value: "clickhouse", label: "ClickHouse", hint: "Best for: high-volume analytics, funnels, cohorts, and event queries. Pair with transactional store for app state." },
  { value: "other", label: "Other", hint: "Anything else — capture the choice in a project ADR." },
];

export const DATA_SHAPE_OPTIONS: OptionDef[] = [
  { value: "structured", label: "Structured", hint: "Tables with stable schema, foreign keys, joins. Most business apps." },
  { value: "semi-structured", label: "Semi-structured", hint: "JSON-shaped per-record fields layered on relational core. Mix of stable + flexible." },
  { value: "unstructured", label: "Unstructured", hint: "Documents, blobs, audio/video. Object storage + indexing on metadata." },
  { value: "mixed", label: "Mixed", hint: "Multiple stores — explicit ownership of which data lives where." },
];

export const CLOUD_OPTIONS: OptionDef[] = [
  { value: "vercel", label: "Vercel", hint: "Best for: Next.js apps. Zero-config deploy, preview environments, edge runtime. Pay-per-use." },
  { value: "aws", label: "AWS", hint: "Best for: full control, broadest service catalog, regulated workloads. Highest operational complexity." },
  { value: "azure", label: "Azure", hint: "Best for: Microsoft-heavy enterprises, .NET stacks, AD-integrated identity." },
  { value: "gcp", label: "Google Cloud", hint: "Best for: data/ML workloads (BigQuery, Vertex), Kubernetes (GKE), strong global network." },
  { value: "netlify", label: "Netlify", hint: "Best for: JAMstack and static sites with serverless functions. Similar shape to Vercel." },
  { value: "render", label: "Render", hint: "Best for: small-to-medium apps that want managed services without AWS-level complexity." },
  { value: "railway", label: "Railway", hint: "Best for: side projects and prototypes. Dead-simple deploys; less suited to scale." },
  { value: "heroku", label: "Heroku", hint: "Best for: legacy apps already on Heroku. Newer alternatives generally cheaper." },
  { value: "kubernetes", label: "Kubernetes (any cloud)", hint: "Best for: many services, polyglot teams, multi-cloud strategy. Significant operational overhead." },
  { value: "self-hosted", label: "Self-hosted", hint: "Best for: data residency or compliance requirements that forbid public cloud." },
];

export const PACKAGING_OPTIONS: OptionDef[] = [
  { value: "saas", label: "SaaS", hint: "Multi-tenant managed service. Recurring revenue; subscription-shaped GTM." },
  { value: "enterprise", label: "Enterprise deployment", hint: "Single-tenant install in customer environment. Long sales cycles, higher ACV, slower iteration." },
  { value: "managed-service", label: "Managed service", hint: "You operate per-customer infrastructure. Hybrid of SaaS pricing and dedicated isolation." },
  { value: "internal-only", label: "Internal-only capability", hint: "Built for your own organization. No external pricing; focus on adoption and change management." },
  { value: "other", label: "Other", hint: "Anything else — capture the choice in a project ADR." },
];

export const TIMING_MODEL_OPTIONS: OptionDef[] = [
  { value: "neither", label: "Neither", hint: "No queue or scheduling primitives needed." },
  { value: "appointment", label: "Appointment", hint: "Customers pick a slot in advance. Reminders, no-shows, reslotting." },
  { value: "real-time-queue", label: "Real-time queue", hint: "Take-a-number with live ETA. Walk-ins, late arrivals, abandonment." },
  { value: "both", label: "Both", hint: "Pre-booked + walk-in merged into one fairness algorithm." },
];

export const AI_PROVIDER_OPTIONS: OptionDef[] = [
  { value: "tbd", label: "TBD", hint: "Decide before MVP — provider choice cascades into prompts, costs, and contracts." },
  { value: "openai", label: "OpenAI", hint: "Best for: broad capability, function calling, structured outputs. Mature SDKs." },
  { value: "anthropic", label: "Anthropic (Claude)", hint: "Best for: long-context reasoning, careful tool use, prompt caching. Strong on coding tasks." },
  { value: "azure-openai", label: "Azure OpenAI", hint: "Best for: enterprise compliance, EU data residency, contracted SLAs on OpenAI models." },
  { value: "vertex", label: "Google Vertex", hint: "Best for: Google Cloud shops, Gemini models, integration with GCP data services." },
  { value: "bedrock", label: "AWS Bedrock", hint: "Best for: AWS-native deployments, multi-model selection (Claude, Llama, Titan, Mistral) under AWS billing." },
  { value: "open-source", label: "Open-source / self-hosted", hint: "Best for: cost control at scale or strict data isolation. Operate vLLM, TGI, Ollama on GPU infra." },
  { value: "mixed", label: "Mixed", hint: "Hot path on hosted, batch on self-hosted; or per-tenant routing." },
];

export const AI_AGENT_FRAMEWORK_OPTIONS: OptionDef[] = [
  { value: "none", label: "None", hint: "Plain SDK calls. Best for: simple chat or single-shot completions." },
  { value: "langgraph", label: "LangGraph", hint: "Best for: stateful agent graphs, branching workflows, human-in-the-loop checkpoints. Strong for multi-step reasoning." },
  { value: "deepagents", label: "LangGraph DeepAgents", hint: "Best for: filesystem-style agent workspaces with memory, on-demand skills, subagents, and generated content/assets." },
  { value: "langchain", label: "LangChain", hint: "Best for: rapid prototyping with many chain primitives. Heavier abstraction; sometimes harder to debug." },
  { value: "llamaindex", label: "LlamaIndex", hint: "Best for: retrieval-heavy apps. Strong indexing, query, and structured-extraction primitives." },
  { value: "crewai", label: "CrewAI", hint: "Best for: multi-agent collaboration patterns (e.g. researcher → critic → writer roles)." },
  { value: "autogen", label: "AutoGen (Microsoft)", hint: "Best for: multi-agent conversation patterns with code execution capabilities." },
  { value: "openai-assistants", label: "OpenAI Assistants API", hint: "Best for: hosted thread + tool execution. Vendor-locked to OpenAI; less code to maintain." },
  { value: "vercel-ai-sdk", label: "Vercel AI SDK", hint: "Best for: Next.js apps. Streaming UI, RSC integration, multi-provider switching." },
  { value: "haystack", label: "Haystack", hint: "Best for: production search + RAG pipelines. Strong on document processing." },
  { value: "custom", label: "Custom", hint: "Direct provider SDK + your own orchestration. Best for: simple needs or strong opinions about control." },
];

export const AI_OBSERVABILITY_OPTIONS: OptionDef[] = [
  { value: "none", label: "None", hint: "Not recommended for production AI. At minimum log prompt + completion + tokens to your existing log store." },
  { value: "langsmith", label: "LangSmith", hint: "Best for: LangChain / LangGraph apps. Native traces, eval datasets, prompt versioning." },
  { value: "langfuse", label: "Langfuse", hint: "Best for: open-source-friendly teams. Self-hostable; broad SDK support." },
  { value: "weights-biases", label: "Weights & Biases (Weave)", hint: "Best for: teams already using W&B for ML experimentation. Strong eval workflow." },
  { value: "arize", label: "Arize / Phoenix", hint: "Best for: production observability + drift detection. OpenInference-based, model-agnostic." },
  { value: "openllmetry", label: "OpenLLMetry (Traceloop)", hint: "Best for: standards-based OpenTelemetry tracing. Pipes into Datadog, Honeycomb, Grafana, etc." },
  { value: "datadog-llm", label: "Datadog LLM Observability", hint: "Best for: shops already on Datadog. One pane of glass for LLM + infra." },
  { value: "helicone", label: "Helicone", hint: "Best for: drop-in proxy with caching, rate limiting, cost tracking. Minimal code change." },
  { value: "custom", label: "Custom", hint: "Roll your own using OpenTelemetry. Capture inputs, outputs, costs, latency, evals." },
];

export const VECTOR_DB_OPTIONS: OptionDef[] = [
  { value: "none", label: "None / not needed", hint: "RAG isn't in scope, or context fits in the prompt." },
  { value: "pgvector", label: "pgvector (Postgres)", hint: "Best for: keeping vectors next to your transactional data. No new infra. Works to ~10M vectors comfortably." },
  { value: "pinecone", label: "Pinecone", hint: "Best for: managed scale + low ops. Pay for usage; vendor-locked." },
  { value: "weaviate", label: "Weaviate", hint: "Best for: hybrid search (vector + keyword + filters). Open-source with managed option." },
  { value: "qdrant", label: "Qdrant", hint: "Best for: open-source self-host with strong filtering and on-disk indexes. Rust core, fast." },
  { value: "chroma", label: "Chroma", hint: "Best for: prototypes and small RAG apps. Easy to start; less battle-tested at scale." },
  { value: "milvus", label: "Milvus / Zilliz", hint: "Best for: very large vector workloads (100M+). Heavier ops than pgvector or Qdrant." },
  { value: "elasticsearch", label: "Elasticsearch / OpenSearch", hint: "Best for: shops already running Elastic. Adds vector to existing search infra." },
  { value: "redis-stack", label: "Redis Stack", hint: "Best for: low-latency vector search co-located with caching. Memory cost can grow fast." },
  { value: "azure-ai-search", label: "Azure AI Search", hint: "Best for: Azure-native RAG with hybrid vector + keyword search, private endpoints, and enterprise data controls." },
];

export const CONTAINERIZATION_OPTIONS: OptionDef[] = [
  { value: "none", label: "None", hint: "PaaS deploy (Vercel / Netlify / Heroku). Simpler, less portable." },
  { value: "docker", label: "Docker", hint: "Best for: portable builds, consistent local + CI + prod environments. Default for most apps." },
  { value: "kubernetes", label: "Kubernetes", hint: "Best for: many services, multi-tenant scaling. Significant operational cost — only choose if you need it." },
];

export const ARCHITECTURE_PATTERN_OPTIONS: OptionDef[] = [
  { value: "modular-monolith", label: "Modular monolith", hint: "Best default for most MVPs: one deployable, clear module boundaries, fewer distributed-systems costs." },
  { value: "service-oriented", label: "Service-oriented", hint: "Best when a few domains need independent ownership or scaling, without full microservice sprawl." },
  { value: "microservices", label: "Microservices", hint: "Best for large teams with mature platform ops and independently scaling domains. Expensive too early." },
  { value: "event-driven", label: "Event-driven", hint: "Best for workflows, integrations, notifications, analytics, and eventual consistency between domains." },
  { value: "serverless", label: "Serverless", hint: "Best for bursty or low-ops workloads. Watch cold starts, provider limits, and local dev complexity." },
  { value: "edge-first", label: "Edge-first", hint: "Best for globally distributed read-heavy experiences. Keep state and writes centralized unless necessary." },
  { value: "hybrid", label: "Hybrid", hint: "Use when the product truly needs multiple patterns. Capture boundaries clearly in ADRs." },
];

export const AUTH_ARCHITECTURE_OPTIONS: OptionDef[] = [
  { value: "managed-oidc", label: "Managed OIDC / OAuth2", hint: "Default for modern SaaS: Auth0, Clerk, Cognito, Azure AD B2C, or similar. Avoid building auth early." },
  { value: "enterprise-sso", label: "Enterprise SSO", hint: "Use for B2B buyers that require SAML/OIDC, SCIM, tenant policies, and IdP-driven lifecycle." },
  { value: "session-cookie", label: "Server session cookies", hint: "Good for classic web apps. Strong logout and revocation; needs CSRF and secure cookie controls." },
  { value: "api-key-m2m", label: "API keys / machine-to-machine", hint: "Use for partners, webhooks, or service accounts. Scope, rotate, audit, and never expose in browsers." },
  { value: "mobile-token", label: "Mobile token flow", hint: "Use for native apps: PKCE, secure storage, refresh-token rotation, biometric re-auth for sensitive actions." },
  { value: "hybrid", label: "Hybrid auth", hint: "Common for platforms: users via OIDC/SSO, services via mTLS or client credentials, partners via scoped API keys." },
];

export const DEPLOYMENT_TOPOLOGY_OPTIONS: OptionDef[] = [
  { value: "single-region", label: "Single region", hint: "Default for MVPs. Lower cost and simpler consistency. Add DR drills before regulated launch." },
  { value: "active-passive", label: "Active/passive multi-region", hint: "Best first DR step: warm standby, documented failover, lower complexity than active/active." },
  { value: "active-active", label: "Active/active multi-region", hint: "Use only when uptime/latency demands justify global consistency and conflict-resolution complexity." },
  { value: "edge-distributed", label: "Edge distributed", hint: "Best for reads, auth gates, personalization, and low-latency static/dynamic composition near users." },
  { value: "customer-hosted", label: "Customer-hosted", hint: "Use when enterprise, public sector, or residency rules force deployment inside customer infrastructure." },
  { value: "hybrid", label: "Hybrid topology", hint: "Use when SaaS, dedicated tenants, edge, and customer-hosted parts coexist. Requires clear support boundaries." },
];

export const VERTICAL_OPTIONS: OptionDef[] = [
  { value: "other", label: "Other / cross-vertical", hint: "Generic compliance baseline applies." },
  { value: "healthcare", label: "Healthcare", hint: "PHI handling: HIPAA (US) or PHIPA (Ontario) + provincial rules. Audit + minimum-necessary access." },
  { value: "financial-services", label: "Financial services", hint: "OSFI (Canada FI) + PCI DSS (if card data). Operational resilience and incident reporting required." },
  { value: "retail", label: "Retail", hint: "PCI DSS in scope if processing payments. Loyalty data carries privacy obligations." },
  { value: "hospitality", label: "Hospitality", hint: "Reservation + payment data; privacy expectations vary by geography." },
  { value: "public-sector", label: "Public sector", hint: "Procurement-driven sales, accessibility (WCAG), often residency requirements." },
  { value: "education", label: "Education", hint: "Student data privacy: FERPA (US), provincial rules in Canada." },
  { value: "logistics", label: "Logistics", hint: "Real-time signal-heavy; integrations with carriers, IoT devices, and ERPs." },
  { value: "saas-internal", label: "Internal SaaS / platform", hint: "Internal-only platform — focus on adoption, RBAC, and audit." },
];
