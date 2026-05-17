import type {
  Assumption,
  Decision,
  DomainKey,
  Entity,
  Feature,
  Geo,
  Integration,
  KPI,
  OpenQuestion,
  Persona,
  Project,
  Requirement,
  Risk,
  SLO,
  SurfaceKind,
  Vertical,
} from "./schema";

export type AgentMode = "complete-missing" | "product" | "architecture" | "review";

export interface AgentChange {
  path: string;
  previous: string;
  next: string;
  reason: string;
}

export interface AgentProposal {
  title: string;
  summary: string;
  mode: AgentMode;
  confidence: "low" | "medium" | "high";
  followUpQuestions: string[];
  assumptions: string[];
  changes: AgentChange[];
  touchedDomains: DomainKey[];
  patch: Partial<Project>;
}

interface Signals {
  text: string;
  title: string;
  isAI: boolean;
  isRag: boolean;
  isMarketplace: boolean;
  isQueue: boolean;
  isInternal: boolean;
  isMobile: boolean;
  isAnalytics: boolean;
  isHealthcare: boolean;
  isFinance: boolean;
  isPublicSector: boolean;
  isEducation: boolean;
  isLogistics: boolean;
  isEnterprise: boolean;
  cloud: Project["platform"]["cloud"];
  vertical: Vertical;
  geos: Geo[];
  audience: string;
  buyer: string;
  operator: string;
  productKind: string;
}

const DOMAIN_FROM_PATH: Array<[string, DomainKey]> = [
  ["problem.", "problem"],
  ["market.", "market"],
  ["experience.", "experience"],
  ["platform.", "platform"],
  ["functional.", "functional"],
  ["nonfunctional.", "nonfunctional"],
  ["systemDesign.", "systemDesign"],
  ["dataTech.", "dataTech"],
  ["ai.", "ai"],
  ["compliance.", "compliance"],
  ["gtm.", "gtm"],
  ["governance.", "governance"],
  ["lifecycle.", "lifecycle"],
  ["stakeholders", "basics"],
  ["decisions", "governance"],
  ["risks", "governance"],
  ["assumptions", "governance"],
  ["openQuestions", "governance"],
];

export function suggestProjectTitle(input: string) {
  const cleaned = input
    .replace(/\s+/g, " ")
    .replace(/^i\s+(want|need|would like)\s+to\s+(build|create|make)\s+/i, "")
    .replace(/^(build|create|make)\s+/i, "")
    .trim();
  const words = cleaned.split(" ").filter(Boolean).slice(0, 5);
  if (words.length === 0) return "AI-assisted blueprint";
  return words
    .join(" ")
    .replace(/[.!?;:,]+$/g, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildAgentProposal(
  project: Project,
  options: {
    prompt?: string;
    mode?: AgentMode;
    focusStep?: DomainKey;
  } = {},
): AgentProposal {
  const mode = options.mode || "complete-missing";
  const combined = [project.name, project.oneLiner, project.ideaDescription, options.prompt]
    .filter(Boolean)
    .join("\n");
  const signals = detectSignals(combined || project.name || "software product");
  const patch: Record<string, unknown> = {};
  const changes: AgentChange[] = [];
  const touched = new Set<DomainKey>();
  const assumptions = new Set<string>();

  function set(path: string, value: unknown, reason: string) {
    if (!isAllowedForMode(path, mode, options.focusStep)) return;

    const previous = getPath(project, path);
    if (!shouldPropose(path, previous, value, mode, signals)) return;
    if (sameValue(previous, value)) return;

    setPath(patch, path, value);
    changes.push({
      path,
      previous: formatValue(previous),
      next: formatValue(value),
      reason,
    });

    touched.add(domainFromPath(path));
  }

  const oneLiner = buildOneLiner(signals);

  set("name", project.name && project.name !== "Untitled project" ? project.name : signals.title, "Create a usable project title from the idea.");
  set("oneLiner", oneLiner, "Summarize the product in one sentence.");
  set("ideaDescription", buildIdeaDescription(signals, combined), "Turn the rough idea into a stakeholder-readable description.");

  set("problem.problem", `The target users need a reliable way to ${primaryOutcome(signals)}, but current workflows are fragmented, manual, slow, or hard to trust.`, "Frame the core problem from the initial idea.");
  set("problem.audience", signals.audience, "Infer the primary audience.");
  set("problem.whyNow", whyNow(signals), "Add timing context for why the idea is worth evaluating now.");
  set("problem.successCriteria", successCriteria(signals), "Define measurable outcomes for build readiness.");
  set("problem.outOfScope", outOfScope(signals), "Constrain the MVP boundary.");
  set("problem.businessCase", businessCase(signals), "Add a first-pass business case.");
  set("problem.priority", signals.isEnterprise || signals.isAI ? "P1" : "P2", "Set a first-pass priority.");

  set("market.buyer", signals.buyer, "Infer the likely buyer.");
  set("market.endUser", signals.audience, "Infer the likely end user.");
  set("market.operator", signals.operator, "Infer who operates the product day-to-day.");
  set("market.alternatives", alternatives(signals), "Capture current alternatives.");
  set("market.differentiation", differentiation(signals), "Capture likely differentiation.");
  set("market.marketSize", marketSize(signals), "Add an order-of-magnitude demand hypothesis.");
  set("market.pricing", pricing(signals), "Add a pricing model hypothesis.");
  set("market.geo", signals.geos, "Infer launch geography from the idea or use a North America default.");
  set("market.vertical", signals.vertical, "Infer the vertical from the idea.");

  set("experience.surfaces", experienceSurfaces(signals), "Infer likely product surfaces.");
  set("experience.authMode", signals.isMarketplace || signals.isEnterprise || signals.isAI ? "mixed" : "authenticated", "Infer authentication mode.");
  set("experience.primaryDevice", signals.isMobile || signals.isMarketplace ? "mobile-first" : "responsive", "Infer primary device posture.");
  set("experience.offline", signals.isMobile && !signals.isAI, "Add offline tolerance when mobile usage is likely.");
  set("experience.localization", localization(signals), "Add first-pass localization expectation.");
  set("experience.accessibility", "WCAG 2.2 AA", "Use a production accessibility baseline.");
  set("experience.notifications", notifications(signals), "Infer notification channels.");
  set("experience.timingModel", signals.isQueue ? "both" : "neither", "Infer timing model.");

  set("platform.kinds", platformKinds(signals), "Infer product surface types.");
  set("platform.webMarketing", !signals.isInternal, "External products usually need a public marketing surface.");
  set("platform.webPortal", !signals.isInternal, "Most customer-facing products need a logged-in portal.");
  set("platform.webAdmin", true, "Production products usually need an admin or operator console.");
  set("platform.webPwa", signals.isQueue || signals.isMarketplace, "Queue and marketplace flows benefit from PWA behavior.");
  set("platform.webEnterprise", signals.isEnterprise || signals.isAI || signals.isInternal, "Enterprise posture is likely for this idea.");
  set("platform.mobileIOS", signals.isMobile || signals.isMarketplace, "Mobile-first products should plan for iOS.");
  set("platform.mobileAndroid", signals.isMobile || signals.isMarketplace, "Mobile-first products should plan for Android.");
  set("platform.mobileFramework", signals.isMobile || signals.isMarketplace ? "react-native" : "none", "Pick a pragmatic cross-platform mobile default.");
  set("platform.frontend", "nextjs", "Use a strong web-app default.");
  set("platform.uiFramework", "shadcn/ui + Tailwind", "Use the current app's production UI default.");
  set("platform.stateMgmt", "Zustand + TanStack Query", "Use local state plus server-state caching for production.");
  set("platform.designSystem", signals.isInternal ? "Internal-tools functional" : "Linear / Stripe-inspired neutral", "Add a restrained product-tool design direction.");
  set("platform.authRequired", true, "Production use requires identity.");
  set("platform.responsiveRequired", true, "Keep the experience usable across desktop and mobile web.");
  set("platform.accessibilityRequired", true, "Use accessibility as a release gate.");
  set("platform.backend", backend(signals), "Infer backend framework.");
  set("platform.apiStyle", "rest", "Use REST/OpenAPI as a contract-first default.");
  set("platform.authMethod", signals.isEnterprise ? "oidc" : "oidc", "Use OIDC as the first-pass identity standard.");
  set("platform.rbacRequired", true, "RBAC is a production default.");
  set("platform.backgroundJobs", signals.isAI || signals.isQueue || signals.isAnalytics, "Async work is likely for this product.");
  set("platform.webhooks", signals.isAI || signals.isMarketplace || signals.isAnalytics, "Integrations likely need webhooks.");
  set("platform.eventDriven", signals.isAI || signals.isQueue || signals.isMarketplace, "Eventing reduces coupling for this workflow.");
  set("platform.rateLimiting", true, "Public and API surfaces need rate limits.");
  set("platform.caching", true, "Caching is a production baseline.");
  set("platform.database", database(signals), "Infer primary data store.");
  set("platform.dataShape", signals.isAI ? "mixed" : signals.isAnalytics ? "mixed" : "structured", "Infer data shape.");
  set("platform.multiTenant", !signals.isInternal, "External SaaS products usually need tenant boundaries.");
  set("platform.searchNeeded", signals.isAI || signals.isMarketplace || signals.isAnalytics, "Search/retrieval is likely.");
  set("platform.realtimeNeeded", signals.isQueue || signals.isMarketplace || signals.isAI, "Realtime state may be required.");
  set("platform.cloud", signals.cloud, "Infer preferred cloud or use a pragmatic default.");
  set("platform.cicd", "GitHub Actions with PR checks and protected production promotion", "Add production CI/CD baseline.");
  set("platform.iac", "Terraform", "Use an IaC baseline.");
  set("platform.observability", signals.isAI ? "OpenTelemetry + LangSmith/Langfuse + Datadog" : "OpenTelemetry + Datadog", "Add observability baseline.");
  set("platform.containerization", "docker", "Use container packaging for backend portability.");
  set("platform.envStrategy", "dev / stage / prod with preview environments per PR", "Add environment strategy.");
  set("platform.deploymentRuntime", deploymentRuntime(signals), "Infer deployment runtime.");
  set("platform.cloudServices", cloudServices(signals), "Infer managed services.");
  set("platform.networking", networking(signals), "Add network/security boundary.");
  set("platform.scalingApproach", scalingApproach(signals), "Add scaling approach.");
  set("platform.cicdDetails", "Every change should go through a branch, pull request, typecheck, build, test review, preview deployment, and protected production promotion.", "Add development and release rules.");
  set("platform.iacDetails", "Terraform owns environments, networking, managed services, secrets references, observability resources, and policy-as-code checks.", "Add IaC ownership guidance.");
  set("platform.enterpriseControls", enterpriseControls(signals), "Add enterprise controls.");

  set("functional.personas", personas(signals), "Seed personas from the idea.");
  set("functional.requirements", requirements(signals), "Seed functional and non-functional requirements.");
  set("functional.features", features(signals), "Seed feature backlog.");
  set("functional.kpis", kpis(signals), "Seed measurable KPIs.");
  set("functional.businessRules", businessRules(signals), "Add business rules.");
  set("functional.edgeCases", edgeCases(signals), "Add edge cases.");

  set("nonfunctional.availabilityTarget", signals.isEnterprise ? "99.9% per tenant" : "99.5%", "Add availability baseline.");
  set("nonfunctional.rto", signals.isEnterprise ? "1 hour" : "4 hours", "Add recovery-time objective.");
  set("nonfunctional.rpo", signals.isEnterprise ? "5 minutes" : "1 hour", "Add recovery-point objective.");
  set("nonfunctional.performance", performance(signals), "Add performance targets.");
  set("nonfunctional.privacyPosture", privacy(signals), "Add privacy posture.");
  set("nonfunctional.auditability", "Every sensitive read/write, admin action, integration event, and generated artifact change should be audit logged.", "Add auditability baseline.");
  set("nonfunctional.costBoundary", costBoundary(signals), "Add cost boundary.");
  set("nonfunctional.supportModel", signals.isEnterprise ? "Business-hours support with P1 on-call and enterprise escalation path." : "Email support during business hours for MVP.", "Add support model.");
  set("nonfunctional.slos", slos(signals), "Seed service-level objectives.");

  set("systemDesign.architecturePattern", architecturePattern(signals), "Infer architecture pattern.");
  set("systemDesign.authArchitecture", signals.isEnterprise ? "enterprise-sso" : "managed-oidc", "Infer auth architecture.");
  set("systemDesign.deploymentTopology", signals.isEnterprise ? "active-passive" : "single-region", "Infer deployment topology.");
  set("systemDesign.tradeoffAreas", tradeoffAreas(signals), "Select architecture tradeoff areas.");
  set("systemDesign.securityReviewAreas", securityReviewAreas(signals), "Select security review areas.");
  set("systemDesign.highLevelArchitectureNotes", hld(signals), "Draft HLD notes.");
  set("systemDesign.lowLevelArchitectureNotes", lld(signals), "Draft LLD notes.");
  set("systemDesign.domainModelNotes", domainModel(signals), "Draft domain model notes.");
  set("systemDesign.schemaDesignNotes", schemaNotes(signals), "Draft schema notes.");
  set("systemDesign.dataLifecycleNotes", dataLifecycle(signals), "Draft data lifecycle notes.");
  set("systemDesign.apiContractNotes", apiContracts(signals), "Draft API contract notes.");
  set("systemDesign.serviceBoundaryNotes", serviceBoundaries(signals), "Draft service boundary notes.");
  set("systemDesign.workflowStateNotes", workflowStates(signals), "Draft workflow state notes.");
  set("systemDesign.integrationContractNotes", integrationContracts(signals), "Draft integration contract notes.");
  set("systemDesign.securityArchitectureNotes", securityArchitecture(signals), "Draft security architecture notes.");
  set("systemDesign.observabilityDesignNotes", observability(signals), "Draft observability design notes.");
  set("systemDesign.infraArchitectureNotes", infra(signals), "Draft infrastructure architecture notes.");
  set("systemDesign.testArchitectureNotes", testArchitecture(signals), "Draft test architecture notes.");
  set("systemDesign.expectedUsersTotal", signals.isEnterprise ? 1_000_000 : 50_000, "Add first-pass capacity assumption.");
  set("systemDesign.dau", signals.isEnterprise ? 100_000 : 5_000, "Add first-pass DAU assumption.");
  set("systemDesign.mau", signals.isEnterprise ? 500_000 : 25_000, "Add first-pass MAU assumption.");
  set("systemDesign.peakConcurrent", signals.isEnterprise ? 10_000 : 500, "Add first-pass concurrency assumption.");
  set("systemDesign.avgRequestsPerUserPerDay", signals.isAI ? 12 : 6, "Add request volume assumption.");
  set("systemDesign.geographicCoverage", geoLabel(signals.geos), "Add geographic coverage.");
  set("systemDesign.multiRegion", signals.isEnterprise, "Add multi-region expectation for enterprise posture.");
  set("systemDesign.drNeeded", signals.isEnterprise, "Add DR expectation.");
  set("systemDesign.cachingStrategy", "Cache read-heavy reference data, rate-limit public endpoints, and keep user-specific sensitive data out of shared caches.", "Add caching strategy.");
  set("systemDesign.dbScalingStrategy", dbScaling(signals), "Add database scaling strategy.");
  set("systemDesign.queueStrategy", queueStrategy(signals), "Add queue strategy.");
  set("systemDesign.notes", "Agent-generated draft. Review assumptions, compliance posture, and cloud/runtime choices before committing engineering effort.", "Mark generated architecture as draft.");

  set("dataTech.entities", entities(signals), "Seed data entities.");
  set("dataTech.integrations", integrations(signals), "Seed integrations.");
  set("dataTech.dataResidency", dataResidency(signals), "Add data residency posture.");
  set("dataTech.buildVsBuy", buildVsBuy(signals), "Add build-vs-buy guidance.");

  if (signals.isAI) {
    set("ai.needsAI", true, "AI is central to the idea.");
    set("ai.kinds", signals.isRag ? ["chatbot", "agent", "rag", "summarizer"] : ["agent", "automation"], "Infer AI use cases.");
    set("ai.ragNeeded", signals.isRag, "Infer RAG need.");
    set("ai.dataSources", signals.isRag ? "Approved knowledge base, support tickets, product docs, policy docs, and curated eval datasets." : "Operational product data and user-provided workflow context.", "Seed AI data sources.");
    set("ai.modelProvider", signals.cloud === "azure" ? "azure-openai" : "openai", "Infer model provider.");
    set("ai.agentFramework", "deepagents", "Use DeepAgents/LangGraph for structured content-writing workflows.");
    set("ai.observability", "langsmith", "Use agent tracing/evaluation baseline.");
    set("ai.vectorDb", signals.cloud === "azure" ? "azure-ai-search" : "pgvector", "Infer vector store.");
    set("ai.humanInLoop", true, "Human approval is required for generated artifacts.");
    set("ai.guardrails", true, "Guardrails are required for production AI.");
    set("ai.evaluation", true, "Evaluation is required before prompt/model promotion.");
    set("ai.promptManagement", true, "Prompt and skill versions need governance.");
    set("ai.auditLogs", true, "Agent decisions and artifact changes should be auditable.");
    set("ai.privacyFiltering", true, "PII and sensitive context should be filtered before traces/model calls.");
    set("ai.notes", "Agent should fill the canonical Project schema, ask follow-up questions when confidence is low, and use deterministic generators for final artifact format.", "Capture agent operating principle.");
  }

  set("compliance.processesPersonalData", true, "Assume identity/profile data until disproven.");
  set("compliance.processesFinancialData", signals.isMarketplace || signals.isFinance, "Infer financial data handling.");
  set("compliance.processesHealthData", signals.isHealthcare, "Infer health data handling.");
  set("compliance.frameworks", complianceFrameworks(signals), "Seed compliance frameworks.");
  set("compliance.consentMgmt", true, "Consent and preference management are production defaults.");
  set("compliance.auditLogs", true, "Audit logs are a production default.");
  set("compliance.encryptionAtRest", true, "Encryption at rest is a production default.");
  set("compliance.encryptionInTransit", true, "Encryption in transit is a production default.");
  set("compliance.rbacRequired", true, "RBAC is a production default.");
  set("compliance.dataResidencyRequired", signals.isHealthcare || signals.isFinance || signals.geos.includes("european-union"), "Infer residency need.");
  set("compliance.incidentResponseRequired", true, "Incident response is a production default.");
  set("compliance.pentestCadence", signals.isEnterprise ? "per major release and annually" : "annual", "Add pentest cadence.");
  set("compliance.threatModel", threatModel(signals), "Seed threat model.");

  set("gtm.packaging", signals.isInternal ? "internal-only" : signals.isEnterprise ? "enterprise" : "saas", "Infer packaging.");
  set("gtm.segments", signals.audience, "Seed customer segments.");
  set("gtm.buyerObjections", buyerObjections(signals), "Seed buyer objections.");
  set("gtm.salesMotion", signals.isEnterprise ? "Founder-led or sales-led enterprise motion with security review." : "Self-serve assisted by product-led onboarding.", "Infer sales motion.");
  set("gtm.channelStrategy", "Founder network, targeted outbound, content around the painful workflow, and integration-marketplace listings where relevant.", "Seed channel strategy.");
  set("gtm.launchGeography", geoLabel(signals.geos), "Seed launch geography.");
  set("gtm.complianceGating", complianceFrameworks(signals).join(", ") || "SOC 2 readiness before enterprise launch.", "Seed compliance gating.");
  set("gtm.pricingModel", pricing(signals), "Seed pricing model.");
  set("gtm.acquisitionChannels", "Targeted outbound, founder-led demos, SEO/use-case content, communities, partner channels, and integration marketplaces.", "Seed acquisition channels.");
  set("gtm.retentionStrategy", "Measure activation, build weekly value loops, expose usage analytics, and review churn reasons monthly.", "Seed retention strategy.");
  set("gtm.partnerships", partnerships(signals), "Seed partnership ideas.");
  set("gtm.competitors", alternatives(signals), "Seed competitor/alternative set.");
  set("gtm.positioning", positioning(signals), "Seed positioning.");
  set("gtm.marketingKpis", "Activation rate, qualified demos, trial-to-paid conversion, payback period, retention, expansion, and win/loss reasons.", "Seed marketing KPIs.");

  if (!combined || combined.trim().split(/\s+/).length < 25) {
    assumptions.add("The initial idea is sparse, so the agent used common product and architecture defaults.");
  }
  if (!signals.text.includes("compliance") && !signals.text.includes("hipaa") && !signals.text.includes("gdpr") && !signals.text.includes("soc")) {
    assumptions.add("Compliance requirements need confirmation with legal/security stakeholders.");
  }
  if (!signals.text.includes("budget") && !signals.text.includes("price") && !signals.text.includes("pricing")) {
    assumptions.add("Pricing and cost boundaries are inferred and need commercial validation.");
  }
  if (!signals.text.includes("scale") && !signals.text.includes("users") && !signals.text.includes("dau")) {
    assumptions.add("Scale assumptions are placeholders until expected user volume is known.");
  }

  const questions = followUpQuestions(project, signals, combined);
  const confidenceLevel = confidence(signals, combined);

  set("governance.owner", "Product Manager owns product definition; Technical Solution Architect owns architecture; Engineering Manager owns delivery plan.", "Add ownership model.");
  set("governance.approvers", "PM, Solution Architect, Engineering Lead, Security/Compliance reviewer, and business sponsor.", "Add approval model.");
  set("governance.dependencies", dependencies(signals), "Seed dependencies.");
  set("governance.thirdParties", integrations(signals).map((i) => i.system).join(", "), "Seed third parties.");
  set("governance.legalReviews", complianceFrameworks(signals).length ? `Review ${complianceFrameworks(signals).join(", ")} obligations before GA.` : "Review privacy policy, terms, data processing, and vendor agreements before launch.", "Seed legal reviews.");
  set("governance.procurementReviews", "Review vendor terms, data processing agreements, security questionnaires, SLAs, pricing limits, and exit plans.", "Seed procurement reviews.");
  set("governance.unvalidatedAssumptions", Array.from(assumptions).join("; ") || "Buyer urgency, pricing, MVP scope, scale assumptions, and compliance requirements need validation.", "Capture assumptions.");
  set("governance.decisionConfidence", confidenceLevel, "Set confidence from input detail level.");

  set("stakeholders", stakeholders(signals), "Seed stakeholders.");
  set("decisions", decisions(signals), "Seed architecture/product decisions.");
  set("risks", risks(signals), "Seed risk register.");
  set("assumptions", assumptionRecords(signals, assumptions), "Seed assumptions.");
  set("openQuestions", openQuestionRecords(questions), "Seed open questions.");

  return {
    title: modeTitle(mode),
    summary: proposalSummary(mode, signals, changes.length, questions.length),
    mode,
    confidence: confidenceLevel,
    followUpQuestions: questions,
    assumptions: Array.from(assumptions),
    changes,
    touchedDomains: Array.from(touched),
    patch: expandProjectPatch(project, patch),
  };
}

function detectSignals(input: string): Signals {
  const text = input.toLowerCase();
  const has = (...words: string[]) => words.some((w) => text.includes(w));
  const isAI = has("ai", "agent", "rag", "llm", "chatbot", "copilot", "model", "prompt");
  const isRag = has("rag", "knowledge base", "retrieval", "vector", "semantic search");
  const isMarketplace = has("marketplace", "two-sided", "buyers and sellers", "providers", "pros bid", "escrow");
  const isQueue = has("queue", "appointment", "wait time", "waiting", "reservation");
  const isInternal = has("internal", "operations console", "admin console", "back office", "ops team");
  const isMobile = has("mobile", "ios", "android", "react native", "flutter");
  const isAnalytics = has("analytics", "dashboard", "funnel", "cohort", "metrics", "reporting");
  const isHealthcare = has("health", "clinic", "patient", "doctor", "medical", "hipaa", "phipa");
  const isFinance = has("finance", "bank", "payment", "loan", "insurance", "fintech", "pci", "osfi");
  const isPublicSector = has("government", "public sector", "municipal", "citizen");
  const isEducation = has("education", "student", "school", "university", "teacher");
  const isLogistics = has("logistics", "delivery", "fleet", "warehouse", "supply chain");
  const isEnterprise = has("enterprise", "b2b", "sso", "soc 2", "iso", "scale", "tenant", "compliance") || isAI || isInternal;

  const cloud: Project["platform"]["cloud"] = has("azure") ? "azure" : has("aws") ? "aws" : has("gcp", "google cloud") ? "gcp" : "vercel";
  const vertical: Vertical = isHealthcare
    ? "healthcare"
    : isFinance
      ? "financial-services"
      : isPublicSector
        ? "public-sector"
        : isEducation
          ? "education"
          : isLogistics
            ? "logistics"
            : isInternal || isAI || isAnalytics
              ? "saas-internal"
              : isMarketplace
                ? "retail"
                : "other";

  const geos: Geo[] = [
    has("canada", "canadian") ? "canada" : null,
    has("united states", "usa", "u.s.") ? "united-states" : null,
    has("europe", "eu", "gdpr") ? "european-union" : null,
    has("uk", "united kingdom") ? "united-kingdom" : null,
    has("global", "worldwide") ? "global" : null,
  ].filter(Boolean) as Geo[];

  const audience = isHealthcare
    ? "Healthcare operators, staff, and patients"
    : isFinance
      ? "Financial-services teams and customers"
      : isMarketplace
        ? "Customers seeking services and vetted providers"
        : isInternal
          ? "Internal operations teams and team leads"
          : isAI
            ? "Support, operations, or knowledge teams using AI-assisted workflows"
            : isAnalytics
              ? "Product teams, analysts, and business leaders"
              : "Target users with a recurring workflow pain";

  const buyer = isInternal
    ? "Internal business sponsor"
    : isAI
      ? "VP Support, Operations, Product, or CIO"
      : isMarketplace
        ? "Marketplace operator and end customer"
        : isAnalytics
          ? "Head of Product or Data"
          : "Business owner for the workflow";

  const operator = isInternal
    ? "Operations lead and platform engineering"
    : isAI
      ? "AI operations owner, support ops, and engineering"
      : isMarketplace
        ? "Trust and safety plus marketplace operations"
        : "Admin users and support operations";

  const productKind = isAI
    ? "AI-assisted product workflow"
    : isMarketplace
      ? "two-sided marketplace"
      : isQueue
        ? "queue and appointment platform"
        : isAnalytics
          ? "analytics platform"
          : isInternal
            ? "internal operations console"
            : "software product";

  return {
    text,
    title: suggestProjectTitle(input),
    isAI,
    isRag,
    isMarketplace,
    isQueue,
    isInternal,
    isMobile,
    isAnalytics,
    isHealthcare,
    isFinance,
    isPublicSector,
    isEducation,
    isLogistics,
    isEnterprise,
    cloud,
    vertical,
    geos: geos.length ? geos : ["united-states", "canada"],
    audience,
    buyer,
    operator,
    productKind,
  };
}

function modeTitle(mode: AgentMode) {
  if (mode === "product") return "Product manager draft";
  if (mode === "architecture") return "Solution architect draft";
  if (mode === "review") return "Blueprint review";
  return "Complete missing blueprint";
}

function proposalSummary(mode: AgentMode, signals: Signals, changes: number, questions: number) {
  const scope =
    mode === "architecture"
      ? "technical architecture, data, security, and delivery"
      : mode === "product"
        ? "product, market, MVP, and GTM"
        : mode === "review"
          ? "readiness, assumptions, and gaps"
          : "missing product and architecture fields";
  return `Drafted ${changes} proposed schema updates for ${scope} using the idea context for a ${signals.productKind}. ${questions ? "Follow-up questions remain before this should be treated as final." : "No blocking follow-up questions were detected."}`;
}

function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cursor = target;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      cursor[part] = value;
      return;
    }
    cursor[part] = cursor[part] && typeof cursor[part] === "object" ? cursor[part] : {};
    cursor = cursor[part] as Record<string, unknown>;
  });
}

function expandProjectPatch(project: Project, patch: Record<string, unknown>): Partial<Project> {
  const expanded: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(patch)) {
    const current = (project as unknown as Record<string, unknown>)[key];
    if (isPlainObject(current) && isPlainObject(value)) {
      expanded[key] = deepMerge(current, value);
    } else {
      expanded[key] = value;
    }
  }

  return expanded as Partial<Project>;
}

function deepMerge(base: unknown, patch: unknown): unknown {
  if (!isPlainObject(base) || !isPlainObject(patch)) return patch;
  const merged: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    const current = merged[key];
    merged[key] = isPlainObject(current) && isPlainObject(value) ? deepMerge(current, value) : value;
  }

  return merged;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function domainFromPath(path: string): DomainKey {
  if (path === "name" || path === "oneLiner" || path === "ideaDescription") return "basics";
  const found = DOMAIN_FROM_PATH.find(([prefix]) => path === prefix || path.startsWith(prefix));
  return found?.[1] || "basics";
}

function isAllowedForMode(path: string, mode: AgentMode, focusStep?: DomainKey) {
  const domain = domainFromPath(path);
  if (focusStep && mode !== "complete-missing") return domain === focusStep || domain === "governance";
  if (mode === "product") return ["basics", "problem", "market", "experience", "functional", "features", "gtm", "governance", "lifecycle"].includes(domain);
  if (mode === "architecture") return ["platform", "nonfunctional", "systemDesign", "dataTech", "ai", "compliance", "governance", "lifecycle"].includes(domain);
  return true;
}

function shouldPropose(path: string, previous: unknown, next: unknown, mode: AgentMode, signals: Signals) {
  if (sameValue(previous, next)) return false;
  if (mode === "review") return isBlank(previous) || isDefaultValue(path, previous, signals);
  if (isBlank(previous)) return true;
  if (Array.isArray(previous) && previous.length === 0) return true;
  if (typeof previous === "boolean") return previous === false && next === true;
  return isDefaultValue(path, previous, signals);
}

function isDefaultValue(path: string, previous: unknown, signals: Signals) {
  const defaults: Record<string, unknown> = {
    name: "Untitled project",
    "platform.cloud": "vercel",
    "platform.backend": "fastapi",
    "platform.database": "postgres",
    "platform.uiFramework": "shadcn/ui",
    "platform.stateMgmt": "Zustand",
    "platform.envStrategy": "dev / stage / prod",
    "systemDesign.architecturePattern": "modular-monolith",
    "systemDesign.authArchitecture": "managed-oidc",
    "systemDesign.deploymentTopology": "single-region",
    "ai.agentFramework": "none",
    "ai.modelProvider": "tbd",
    "ai.observability": "none",
    "ai.vectorDb": "none",
    "market.vertical": "other",
  };
  if (defaults[path] === previous) return true;
  if (path === "platform.cloud" && signals.cloud !== "vercel") return true;
  return false;
}

function isBlank(value: unknown) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "number") return value === 0;
  return false;
}

function sameValue(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function formatValue(value: unknown) {
  if (isBlank(value)) return "Empty";
  if (Array.isArray(value)) return value.length ? value.map((v) => (typeof v === "string" ? v : "item")).join(", ") : "Empty";
  if (typeof value === "object") return "Existing structured value";
  return String(value);
}

function confidence(signals: Signals, input: string): "low" | "medium" | "high" {
  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount > 120 && (signals.isAI || signals.isEnterprise || signals.isMarketplace || signals.isInternal)) return "high";
  if (wordCount > 35) return "medium";
  return "low";
}

function followUpQuestions(project: Project, signals: Signals, input: string) {
  const questions: string[] = [];
  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 35) questions.push("What is the primary buyer, end user, and most painful workflow this idea should solve?");
  if (!project.market.pricing && !signals.text.includes("pricing")) questions.push("What pricing or business model should the draft assume?");
  if (!project.systemDesign.expectedUsersTotal && !signals.text.includes("scale")) questions.push("What first-year usage scale should the architecture plan for?");
  if (!project.compliance.frameworks.length && !signals.text.includes("compliance")) questions.push("Are there required compliance frameworks such as SOC 2, HIPAA, GDPR, PCI, PHIPA, or ISO 27001?");
  if (signals.isAI && !project.ai.dataSources && !signals.text.includes("source")) questions.push("Which source data should the AI agent be allowed to use, and what data is off limits?");
  if (signals.isAI && !signals.text.includes("human")) questions.push("When should the AI agent ask for human review or escalation?");
  return questions.slice(0, 6);
}

function buildOneLiner(signals: Signals) {
  return `A ${signals.productKind} for ${signals.audience.toLowerCase()} that helps them ${primaryOutcome(signals)} with clearer product, architecture, security, and delivery guardrails.`;
}

function buildIdeaDescription(signals: Signals, input: string) {
  const base = input.trim() || signals.title;
  return `${base}\n\nAgent draft: this product should be evaluated through product-market fit, MVP scope, architecture, data, security, compliance, operational readiness, and developer handoff. The agent should fill missing details as assumptions, ask follow-up questions when confidence is low, and keep generated artifacts traceable to the canonical schema.`;
}

function primaryOutcome(signals: Signals) {
  if (signals.isAI) return "answer, automate, or assist complex workflows safely with human review";
  if (signals.isMarketplace) return "match demand and supply with trust, payments, and operational controls";
  if (signals.isQueue) return "reduce waiting friction and coordinate real-time service delivery";
  if (signals.isAnalytics) return "turn product and operational data into trusted decisions";
  if (signals.isInternal) return "complete internal workflows faster with RBAC, approvals, and auditability";
  return "complete the target workflow with less manual effort and clearer accountability";
}

function whyNow(signals: Signals) {
  if (signals.isAI) return "AI workflow tooling, eval practices, and agent orchestration have matured enough to create structured drafts while keeping human approval in the loop.";
  if (signals.isMarketplace) return "Users expect mobile-first trust, payment protection, and transparent service discovery.";
  if (signals.isInternal) return "Internal teams need safer tools, fewer manual workarounds, and better audit evidence as operations scale.";
  return "Users expect faster digital workflows, buyers expect measurable ROI, and delivery teams need clearer requirements before build starts.";
}

function successCriteria(signals: Signals) {
  if (signals.isAI) return "Generate a complete reviewed blueprint from a rough idea; reduce manual intake effort by 60%; keep artifact structure consistent; capture user-approved assumptions and changes.";
  if (signals.isMarketplace) return "Increase completed transactions, reduce dispute rate, and maintain trust signals across both sides of the marketplace.";
  return "Validate user demand, define a constrained MVP, identify high-risk scenarios, and produce a developer-ready build package.";
}

function outOfScope(signals: Signals) {
  if (signals.isAI) return "Autonomous production changes, unreviewed generated artifacts, unbounded model access, and storing sensitive data without approved controls.";
  return "Enterprise customization, unsupported integrations, advanced analytics, and non-MVP automation until validation gates are met.";
}

function businessCase(signals: Signals) {
  if (signals.isAI) return "Reduce time spent turning rough ideas into complete PM/architecture/development artifacts while improving consistency and traceability.";
  if (signals.isInternal) return "Reduce manual operations time, error risk, and audit gaps by consolidating critical workflows.";
  return "Create a faster path from idea validation to build decision while reducing rework caused by unclear requirements.";
}

function alternatives(signals: Signals) {
  if (signals.isAI) return "ChatGPT/Claude free-form prompts, manual PRDs, consultant-written specs, Notion docs, spreadsheets, and ad-hoc architecture docs.";
  if (signals.isMarketplace) return "Generic marketplaces, lead-generation tools, spreadsheets, manual matching, phone/email coordination.";
  if (signals.isInternal) return "Spreadsheets, direct database edits, disconnected internal tools, Retool-style dashboards, and manual approval chains.";
  return "Manual documents, spreadsheets, generic project-management tools, point solutions, and ad-hoc engineering discovery.";
}

function differentiation(signals: Signals) {
  if (signals.isAI) return "Schema-first generation: AI fills structured product and architecture data, while deterministic generators preserve complete artifact format.";
  return "Combines product discovery, architecture, risk, compliance, and developer handoff in one traceable workflow.";
}

function marketSize(signals: Signals) {
  if (signals.isInternal) return "Internal productivity opportunity measured by time saved, risk reduction, and audit readiness.";
  if (signals.isAI) return "Large horizontal market across startups, agencies, product teams, and enterprise innovation groups needing structured build specs.";
  return "Initial market size should be validated through buyer interviews, competitor pricing, and segment-specific adoption signals.";
}

function pricing(signals: Signals) {
  if (signals.isInternal) return "Internal capability funded by productivity and risk-reduction ROI.";
  if (signals.isMarketplace) return "Take rate or transaction fee with optional subscription for providers.";
  if (signals.isAI) return "Tiered SaaS by project volume, team seats, export bundle volume, and advanced agent features.";
  return "Tiered SaaS subscription with usage-based expansion where applicable.";
}

function experienceSurfaces(signals: Signals): SurfaceKind[] {
  if (signals.isInternal) return ["internal-console"];
  if (signals.isMarketplace || signals.isMobile) return ["public-website", "cross-platform-mobile", "internal-console"];
  if (signals.isAI) return ["public-website", "internal-console", "api-only"];
  return ["public-website", "internal-console"];
}

function localization(signals: Signals) {
  if (signals.geos.includes("canada")) return "en-CA, fr-CA";
  if (signals.geos.includes("european-union")) return "en-US plus EU launch languages after validation";
  return "en-US";
}

function notifications(signals: Signals) {
  if (signals.isQueue || signals.isMarketplace) return ["email", "sms", "push", "in-app"];
  if (signals.isInternal) return ["email", "in-app", "slack"];
  return ["email", "in-app"];
}

function platformKinds(signals: Signals): Project["platform"]["kinds"] {
  if (signals.isInternal) return ["website", "internal-tool", "admin-dashboard"];
  if (signals.isMarketplace) return ["website", "mobile-app", "marketplace", "admin-dashboard"];
  if (signals.isAI) return ["website", "saas-platform", "ai-agent", "admin-dashboard", "api-only"];
  return ["website", "saas-platform", "admin-dashboard"];
}

function backend(signals: Signals): Project["platform"]["backend"] {
  if (signals.isInternal) return "django";
  if (signals.isAnalytics) return "nestjs";
  if (signals.isMarketplace) return "express";
  return "fastapi";
}

function database(signals: Signals): Project["platform"]["database"] {
  if (signals.isAnalytics) return "clickhouse";
  if (signals.isAI && signals.cloud === "azure") return "cosmosdb";
  return "postgres";
}

function deploymentRuntime(signals: Signals) {
  if (signals.cloud === "azure") return "Azure Container Apps for API and agent workers; Container Apps Jobs for generation/eval jobs; Azure Front Door for edge routing.";
  if (signals.cloud === "aws") return "ECS Fargate for APIs and workers; Lambda for lightweight webhooks; CloudFront/WAF for edge protection.";
  if (signals.cloud === "gcp") return "Cloud Run or GKE Autopilot for APIs and workers; Cloud Tasks/Pub/Sub for async jobs.";
  return "Vercel for Next.js web, server routes for lightweight APIs, and a separate worker runtime for long-running agent jobs.";
}

function cloudServices(signals: Signals) {
  if (signals.isAI && signals.cloud === "azure") return "Azure OpenAI, Azure AI Search, Cosmos DB, Blob Storage, Service Bus, Key Vault, Application Insights, Front Door/WAF.";
  if (signals.cloud === "aws") return "Aurora PostgreSQL, S3, SQS, EventBridge, ElastiCache Redis, Secrets Manager, KMS, CloudFront/WAF, CloudWatch.";
  if (signals.cloud === "gcp") return "Cloud SQL, Pub/Sub, Cloud Storage, Secret Manager, Cloud Monitoring, Cloud Armor, BigQuery where analytics is needed.";
  return "Vercel Functions, Vercel Blob for bundles, managed Postgres, Redis/queue provider, observability provider, and model gateway.";
}

function networking(signals: Signals) {
  if (signals.isEnterprise) return "Private network boundary, WAF, private data services, secrets manager, least-privilege service identities, and restricted egress for model/provider calls.";
  return "Public web edge with WAF/rate limiting, private database access, managed secrets, and environment-level isolation.";
}

function scalingApproach(signals: Signals) {
  if (signals.isAI) return "Queue long-running generation jobs, autoscale workers by queue depth, cache reusable reference data, and rate-limit model calls by tenant.";
  if (signals.isQueue) return "Autoscale API by RPS, workers by queue depth, and use realtime fan-out with backpressure controls.";
  return "Autoscale stateless API/web workers, add read replicas/cache for hot reads, and partition high-volume data by tenant/time.";
}

function enterpriseControls(signals: Signals) {
  return [
    "SSO/OIDC",
    "RBAC",
    "audit logs",
    "KMS/Key Vault secrets",
    "encrypted storage",
    signals.isAI ? "prompt/model/version audit" : null,
    signals.isEnterprise ? "SIEM export and break-glass process" : null,
  ].filter(Boolean).join(", ");
}

function personas(signals: Signals): Persona[] {
  return [
    { id: "p1", name: "Primary user", jtbd: `Use the product to ${primaryOutcome(signals)}.`, pains: "Manual work, unclear status, slow decisions, and inconsistent outputs.", channel: "any" },
    { id: "p2", name: "Product owner", jtbd: "Define scope, success metrics, validation gates, and launch readiness.", pains: "Ambiguous ideas and missing requirements.", channel: "internal-console" },
    { id: "p3", name: "Solution architect", jtbd: "Translate product intent into secure, scalable architecture.", pains: "Late architecture discovery and unclear non-functional requirements.", channel: "internal-console" },
    { id: "p4", name: "Delivery lead", jtbd: "Plan implementation slices, quality gates, and rollout.", pains: "Unclear acceptance criteria and missing risks.", channel: "internal-console" },
  ];
}

function requirements(signals: Signals): Requirement[] {
  return [
    { id: "FR-001", kind: "functional", title: "Capture initial idea", description: "User can provide a rough idea and optional detailed context.", acceptance: "System stores idea, one-liner, and generated assumptions in the project schema.", priority: "must" },
    { id: "FR-002", kind: "functional", title: "Ask follow-up questions", description: "Agent asks only high-impact questions when confidence is low.", acceptance: "Questions are stored as open questions and can be answered before applying a draft.", priority: "must" },
    { id: "FR-003", kind: "functional", title: "Generate complete draft blueprint", description: "Agent fills missing schema fields across PM, architecture, delivery, and governance sections.", acceptance: "All artifact generators receive a populated canonical Project object.", priority: "must" },
    { id: "FR-004", kind: "functional", title: "Review and apply proposed changes", description: "User can inspect proposed changes, assumptions, and confidence before applying.", acceptance: "Filled fields are not overwritten unless the user approves proposed changes.", priority: "must" },
    { id: "NFR-001", kind: "nonfunctional", title: "Artifact format consistency", description: "Final documents keep stable filenames, headings, and traceability IDs.", acceptance: "Generated bundle includes every required artifact in the existing format.", priority: "must" },
    { id: "NFR-002", kind: "nonfunctional", title: "Human review required", description: "Agent-generated artifacts remain drafts until approved.", acceptance: "UI clearly labels generated outputs as draft/human-review required.", priority: "must" },
  ];
}

function features(signals: Signals): Feature[] {
  const names = signals.isAI
    ? ["Conversational idea intake", "Follow-up question loop", "Schema completion agent", "Draft review and diff", "Artifact QA", "Feedback learning loop"]
    : ["Guided intake", "Draft generation", "Review workflow", "Export bundle", "Audit trail", "Admin controls"];
  return names.map((name, index) => ({
    id: `FEAT-${String(index + 1).padStart(3, "0")}`,
    name,
    description: `${name} capability for ${signals.productKind}.`,
    userStory: `As a user, I can use ${name.toLowerCase()} so that the blueprint becomes clearer and more complete.`,
    acceptance: "User can complete the workflow, review output, and see updated artifacts.",
    priority: index < 4 ? "must" : "should",
    complexity: index < 2 ? "M" : "L",
    businessValue: "high",
    dependencies: index === 0 ? "Project schema" : "Canonical project schema and artifact generators",
    apisNeeded: signals.isAI ? "/api/agent/*, /api/projects/*" : "/api/projects/*",
    dataNeeded: "Project, Artifact, AgentRun, Feedback",
    edgeCases: "Sparse input, conflicting answers, low confidence, compliance gaps, user rejects assumptions.",
    errorStates: "Show safe failure, preserve user inputs, allow retry and manual edit.",
    adminControls: "Prompt/skill version review, feature flag, model/provider configuration.",
    audit: "Every accepted change and generated artifact version is recorded.",
    security: "No provider keys in browser; redact sensitive context before model calls.",
    futureEnhancements: "Case-study retrieval, eval-driven prompt promotion, collaborative review.",
    release: index < 4 ? "mvp" : "v1",
  })) as Feature[];
}

function kpis(signals: Signals): KPI[] {
  return [
    { id: "KPI-001", name: "Draft completion", definition: "% of projects with all required artifact groups generated", target: ">= 90%", cadence: "weekly" },
    { id: "KPI-002", name: "Manual intake reduction", definition: "Reduction in fields users fill manually before first complete draft", target: ">= 60%", cadence: "monthly" },
    { id: "KPI-003", name: "Accepted agent suggestions", definition: "% of proposed changes accepted by users", target: ">= 70%", cadence: "weekly" },
    { id: "KPI-004", name: signals.isAI ? "Artifact QA pass rate" : "Readiness score", definition: "Generated bundle passes schema and format checks", target: ">= 95%", cadence: "per generation" },
  ];
}

function businessRules(signals: Signals) {
  return signals.isAI
    ? "User-entered inputs are authoritative. The agent proposes changes, asks follow-up questions when confidence is low, and only applies updates after user approval. Existing artifact generators own the final document format."
    : "User-entered inputs remain authoritative. Draft assumptions must be visible and reviewed before implementation starts.";
}

function edgeCases(signals: Signals) {
  const base = "Sparse idea, contradictory user answers, missing compliance needs, unclear buyer, unrealistic scale, unsupported stack, and generated assumptions that require review.";
  return signals.isAI ? `${base} Prompt injection, sensitive data in prompts, stale case-study context, and model/provider outage.` : base;
}

function performance(signals: Signals) {
  return signals.isAI
    ? "p95 UI interactions < 500ms; generation jobs stream progress; long-running agent work runs in background with retry and resume."
    : "p95 read paths < 500ms and p95 write paths < 1s for MVP traffic.";
}

function privacy(signals: Signals) {
  return signals.isAI
    ? "Do not send secrets or unnecessary PII to model providers; redact traces; keep prompt/version/audit history tenant-scoped."
    : "Encrypt sensitive data, minimize collection, and scope access by role.";
}

function costBoundary(signals: Signals) {
  return signals.isAI ? "Track cost per generation, cap model spend per tenant, and alert on budget burn." : "Keep MVP infra cost within an agreed monthly envelope until demand is proven.";
}

function slos(signals: Signals): SLO[] {
  return [
    { id: "SLO-001", surface: "Web app", metric: "p95 page interaction latency", target: "< 500ms" },
    { id: "SLO-002", surface: signals.isAI ? "Agent generation" : "API", metric: signals.isAI ? "job completion" : "p95 response latency", target: signals.isAI ? "< 3 minutes for first draft" : "< 1s" },
    { id: "SLO-003", surface: "Artifact export", metric: "successful export rate", target: ">= 99%" },
  ];
}

function architecturePattern(signals: Signals): Project["systemDesign"]["architecturePattern"] {
  if (signals.isAI || signals.isQueue) return "event-driven";
  if (signals.isInternal) return "modular-monolith";
  return "service-oriented";
}

function tradeoffAreas(signals: Signals) {
  return [
    "identity-auth",
    "authorization-tenancy",
    "schema-design-lld",
    "api-boundary",
    "deployment-infra",
    "observability-audit",
    "testing-release",
    signals.isAI ? "ai-agents" : null,
    signals.isQueue ? "realtime-notifications" : null,
  ].filter(Boolean) as string[];
}

function securityReviewAreas(signals: Signals) {
  return ["identity", "authorization", "data-protection", "privacy", "secrets", "api-abuse", "audit", "incident-response", signals.isAI ? "ai-safety" : null].filter(Boolean) as string[];
}

function hld(signals: Signals) {
  return `${signals.productKind} uses a web/app frontend, authenticated API, project/schema store, async worker lane, artifact generation layer, export service, observability, and security/audit controls.`;
}

function lld(signals: Signals) {
  return `Modules: IdeaIntake, AgentRun, ProjectSchema, ArtifactGenerator, ReviewDiff, Feedback, ExportBundle, AuditLog, UserSettings, and AdminControls.`;
}

function domainModel(signals: Signals) {
  return "Project owns idea, answers, assumptions, open questions, generated artifacts, feedback, versions, and approval state. AgentRun owns prompt context, questions, proposed schema patch, confidence, and user decision.";
}

function schemaNotes(signals: Signals) {
  return "Core tables/collections: projects, project_versions, agent_runs, agent_messages, artifact_versions, feedback_events, case_studies, prompt_versions, eval_runs, audit_events, users, organizations.";
}

function dataLifecycle(signals: Signals) {
  return "Keep draft projects until user deletion, version accepted schema changes, retain audit events, and purge/redact model context according to tenant privacy policy.";
}

function apiContracts(signals: Signals) {
  return "REST/OpenAPI endpoints for project CRUD, agent draft runs, follow-up answers, proposal apply/reject, artifact generation, export, feedback, and prompt/eval admin.";
}

function serviceBoundaries(signals: Signals) {
  return "UI never calls model providers directly. API validates requests and queues agent work. Worker fills schema. Generators render artifacts. Exporter packages files.";
}

function workflowStates(signals: Signals) {
  return "AgentRun: created -> analyzing -> waiting_for_user -> proposing -> accepted/rejected -> applied -> artifact_qa_passed/failed.";
}

function integrationContracts(signals: Signals) {
  return "Model provider calls require timeouts, retry budgets, tenant-scoped policy, redaction, trace IDs, and stored prompt/response metadata for evals.";
}

function securityArchitecture(signals: Signals) {
  return "Use server-only provider credentials, RBAC, audit logs, tenant scoping, encrypted storage, rate limits, prompt-injection filters, and approval before applying generated changes.";
}

function observability(signals: Signals) {
  return "Trace request -> agent planning -> model/tool calls -> schema patch -> artifact generation -> export. Track latency, token/model cost, acceptance rate, QA failures, and user edits.";
}

function infra(signals: Signals) {
  return `${deploymentRuntime(signals)} Managed database, queue, object storage, secrets manager, observability, WAF/rate limiting, and preview environments per PR.`;
}

function testArchitecture(signals: Signals) {
  return "Unit tests for schema helpers, generator snapshot/format tests, API contract tests, authorization tests, prompt/eval regression tests, export tests, and end-to-end smoke checks.";
}

function dbScaling(signals: Signals) {
  return signals.isAI ? "Partition agent runs/artifact versions by tenant and time; archive old traces; index projects by owner, status, and updated time." : "Use tenant/time partitioning for high-volume data and read replicas when query load grows.";
}

function queueStrategy(signals: Signals) {
  return signals.isAI ? "Queue long-running generation, artifact QA, export packaging, and feedback/eval processing with idempotent job IDs." : "Queue background notifications, exports, integration syncs, and retryable external calls.";
}

function entities(signals: Signals): Entity[] {
  return [
    { id: "ENT-001", name: "Project", description: "Canonical product blueprint with structured schema fields.", sensitive: true, retention: "Until user deletion or workspace retention policy" },
    { id: "ENT-002", name: "AgentRun", description: "Conversation, follow-up questions, proposed patch, confidence, and status.", sensitive: true, retention: "13 months default" },
    { id: "ENT-003", name: "ArtifactVersion", description: "Generated artifact metadata and body snapshot.", sensitive: true, retention: "Versioned while project exists" },
    { id: "ENT-004", name: "FeedbackEvent", description: "User acceptance, rejection, edits, and quality feedback.", sensitive: false, retention: "Aggregated/anonymized for learning loop" },
    { id: "ENT-005", name: "CaseStudy", description: "Approved reusable example for future retrieval and evaluation.", sensitive: true, retention: "Explicit opt-in only" },
  ];
}

function integrations(signals: Signals): Integration[] {
  return [
    { id: "INT-001", system: "Model provider", direction: "outbound", protocol: "HTTPS", dataClass: "Prompt context and generated schema patch", notes: "Server-side only; no browser API keys." },
    { id: "INT-002", system: "Object storage", direction: "outbound", protocol: "SDK/API", dataClass: "Generated bundles and exports", notes: "Encrypt and scope per workspace." },
    { id: "INT-003", system: "GitHub", direction: "outbound", protocol: "REST", dataClass: "Development tasks and PR metadata", notes: "Future issue/PR export." },
    { id: "INT-004", system: "Observability/tracing", direction: "outbound", protocol: "OTLP/HTTPS", dataClass: "Redacted traces and metrics", notes: "No secrets or unnecessary PII." },
  ];
}

function dataResidency(signals: Signals) {
  if (signals.geos.includes("canada")) return "Canada region for Canadian tenants where required; avoid cross-border transfer without approval.";
  if (signals.geos.includes("european-union")) return "EU region for EU tenants with GDPR-aligned processing and DPA controls.";
  return "Region pinning should follow customer contract and regulatory requirements.";
}

function buildVsBuy(signals: Signals) {
  return "Buy: identity, model provider, object storage, queue, observability, and payments where needed. Build: schema workflow, review UX, artifact generators, evaluation, and domain-specific blueprint logic.";
}

function complianceFrameworks(signals: Signals) {
  const frameworks = new Set<string>(["SOC 2", "OWASP ASVS"]);
  if (signals.isAI) frameworks.add("OWASP LLM Top 10");
  if (signals.isHealthcare) {
    frameworks.add("HIPAA");
    frameworks.add("PHIPA");
  }
  if (signals.isFinance || signals.isMarketplace) frameworks.add("PCI DSS");
  if (signals.geos.includes("canada")) frameworks.add("PIPEDA");
  if (signals.geos.includes("european-union")) frameworks.add("GDPR");
  if (signals.isEnterprise) frameworks.add("ISO 27001");
  return Array.from(frameworks);
}

function threatModel(signals: Signals) {
  return "Review account takeover, unauthorized project access, prompt injection, sensitive data leakage, malicious uploaded context, model/provider outage, export leakage, and supply-chain compromise.";
}

function buyerObjections(signals: Signals) {
  return "Accuracy, trust, implementation effort, security review, data privacy, switching cost, ROI proof, team adoption, and vendor lock-in.";
}

function partnerships(signals: Signals) {
  if (signals.isAI) return "Model providers, observability/eval platforms, GitHub/Cursor/Codex workflows, and product-management tool integrations.";
  return "Cloud provider, implementation partners, identity provider, and domain-specific integration partners.";
}

function positioning(signals: Signals) {
  return signals.isAI
    ? "Structured AI blueprint generation that preserves complete artifact format and turns rough ideas into reviewable build packages."
    : `A ${signals.productKind} that turns a painful workflow into a measurable, secure, implementation-ready product experience.`;
}

function dependencies(signals: Signals) {
  return "Model/provider policy, schema validation, artifact generator contracts, storage, auth, audit logging, CI/CD, design review, and security review.";
}

function stakeholders(signals: Signals) {
  return [
    { id: "st1", role: "Product Manager", responsibility: "Own problem framing, market, MVP, KPIs, and acceptance criteria." },
    { id: "st2", role: "Technical Solution Architect", responsibility: "Own HLD, LLD, schema, APIs, infra, security, and tradeoffs." },
    { id: "st3", role: "Engineering Lead", responsibility: "Own implementation plan, quality gates, CI/CD, and delivery sequencing." },
    { id: "st4", role: "Security/Compliance Reviewer", responsibility: "Review identity, data, privacy, audit, and compliance posture." },
  ];
}

function decisions(signals: Signals): Decision[] {
  return [
    { id: "ADR-001", title: "Use canonical schema as source of truth", context: "Free-form generated docs drift and become hard to validate.", decision: "Agent fills Project schema; deterministic generators render final artifacts.", alternatives: "Direct LLM document generation; manual-only intake.", consequences: "Stable file format and traceability, with schema maintenance required.", status: "proposed", confidence: "high" },
    { id: "ADR-002", title: "Require user approval before applying agent changes", context: "Generated assumptions can be wrong.", decision: "Show proposed changes and assumptions before updating the project.", alternatives: "Auto-apply every generated answer.", consequences: "Safer workflow with one extra review step.", status: "proposed", confidence: "high" },
  ];
}

function risks(signals: Signals): Risk[] {
  return [
    { id: "RISK-001", description: "Agent fills incorrect assumptions that look authoritative.", likelihood: "medium", impact: "high", mitigation: "Show assumptions, confidence, diffs, and require user approval before applying." },
    { id: "RISK-002", description: "Generated artifact format drifts from expected developer handoff.", likelihood: "low", impact: "high", mitigation: "Keep deterministic generators as final artifact renderer and add format tests." },
    { id: "RISK-003", description: "Sensitive data is included in model prompts or traces.", likelihood: "medium", impact: "high", mitigation: "Use server-side redaction, tenant policy, and no browser-side provider keys." },
    { id: "RISK-004", description: "Self-learning loop promotes bad examples.", likelihood: "medium", impact: "medium", mitigation: "Use opt-in case studies, eval gates, prompt versioning, and human approval." },
  ];
}

function assumptionRecords(signals: Signals, extra: Set<string>): Assumption[] {
  const base = [
    "User wants complete artifact generation from a rough idea.",
    "Existing artifact format must remain stable.",
    "Agent changes require user review before apply.",
    ...Array.from(extra),
  ];
  return base.map((text, index) => ({ id: `ASM-${String(index + 1).padStart(3, "0")}`, text, validated: false }));
}

function openQuestionRecords(questions: string[]): OpenQuestion[] {
  return questions.map((text, index) => ({ id: `Q-${String(index + 1).padStart(3, "0")}`, text, owner: "Product Manager / Solution Architect" }));
}

function geoLabel(geos: Geo[]) {
  return geos.map((g) => g.replace(/-/g, " ")).join(", ");
}
