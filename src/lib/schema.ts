// Canonical project schema. Every artifact is generated from this object.
// IDs assigned at creation time persist across all generated documents so
// requirements, ADRs, risks, and tests can be traced end-to-end.

export type SurfaceKind =
  | "public-website"
  | "internal-console"
  | "native-mobile"
  | "cross-platform-mobile"
  | "kiosk"
  | "partner-portal"
  | "api-only"
  | "other";

export type Vertical =
  | "healthcare"
  | "financial-services"
  | "retail"
  | "hospitality"
  | "public-sector"
  | "education"
  | "logistics"
  | "saas-internal"
  | "other";

export type Geo =
  | "canada"
  | "united-states"
  | "european-union"
  | "united-kingdom"
  | "global"
  | "other";

export type Confidence = "low" | "medium" | "high";

export interface Stakeholder {
  id: string;
  role: string;
  name?: string;
  responsibility: string;
}

export interface Persona {
  id: string;
  name: string;
  jtbd: string;
  pains: string;
  channel: SurfaceKind | "any";
}

export interface Requirement {
  id: string;
  kind: "functional" | "nonfunctional";
  title: string;
  description: string;
  acceptance: string;
  priority: "must" | "should" | "could" | "wont";
  sourcePersona?: string;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  decision: string;
  alternatives: string;
  consequences: string;
  status: "proposed" | "accepted" | "deprecated";
  confidence: Confidence;
}

export interface Risk {
  id: string;
  description: string;
  likelihood: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigation: string;
}

export interface Assumption {
  id: string;
  text: string;
  validated: boolean;
}

export interface OpenQuestion {
  id: string;
  text: string;
  owner?: string;
}

export interface Integration {
  id: string;
  system: string;
  direction: "inbound" | "outbound" | "bidirectional";
  protocol: string;
  dataClass: string;
  notes?: string;
}

export interface Entity {
  id: string;
  name: string;
  description: string;
  sensitive: boolean;
  retention: string;
}

export interface SLO {
  id: string;
  surface: string;
  metric: string;
  target: string;
}

export interface Feature {
  id: string;             // FEAT-001
  name: string;
  description: string;
  userStory: string;
  acceptance: string;
  priority: "must" | "should" | "could" | "wont";
  complexity: "S" | "M" | "L" | "XL";
  businessValue: "low" | "medium" | "high";
  dependencies: string;
  apisNeeded: string;
  dataNeeded: string;
  edgeCases: string;
  errorStates: string;
  adminControls: string;
  audit: string;
  security: string;
  futureEnhancements: string;
  release: "mvp" | "v1" | "v2" | "future";
}

export interface KPI {
  id: string;             // KPI-001
  name: string;
  definition: string;
  target: string;
  cadence: string;        // weekly, monthly, etc.
}

// --- Domain blocks --------------------------------------------------------

export interface ProblemFraming {
  problem: string;
  audience: string;
  whyNow: string;
  successCriteria: string;
  outOfScope: string;
  businessCase: string;
  priority: "P0" | "P1" | "P2" | "P3";
}

export interface MarketContext {
  buyer: string;
  endUser: string;
  operator: string;
  alternatives: string;
  differentiation: string;
  marketSize: string;
  pricing: string;
  geo: Geo[];
  vertical: Vertical;
}

export interface ExperienceSurface {
  surfaces: SurfaceKind[];
  authMode: "public" | "authenticated" | "mixed";
  primaryDevice: "mobile-first" | "desktop-first" | "responsive" | "kiosk";
  offline: boolean;
  localization: string;
  accessibility: string;
  notifications: string[];
  timingModel: "appointment" | "real-time-queue" | "both" | "neither";
}

export type PlatformKind =
  | "website"
  | "mobile-app"
  | "desktop-app"
  | "saas-platform"
  | "internal-tool"
  | "api-only"
  | "ai-agent"
  | "marketplace"
  | "admin-dashboard"
  | "customer-portal";

export interface PlatformChoice {
  kinds: PlatformKind[];

  // Web sub-choices
  webMarketing: boolean;
  webPortal: boolean;
  webAdmin: boolean;
  webPwa: boolean;
  webEnterprise: boolean;

  // Mobile sub-choices
  mobileIOS: boolean;
  mobileAndroid: boolean;
  mobileFramework: "react-native" | "flutter" | "native-each" | "kmp" | "none";

  // Stack preferences
  frontend: "nextjs" | "react" | "vue" | "angular" | "svelte" | "html" | "other";
  uiFramework: string;        // e.g. shadcn/ui, MUI, Chakra
  stateMgmt: string;          // e.g. Zustand, Redux, none
  designSystem: string;       // e.g. Stripe, Material 3
  authRequired: boolean;
  responsiveRequired: boolean;
  accessibilityRequired: boolean;

  backend: "fastapi" | "django" | "express" | "nestjs" | "spring" | "dotnet" | "go" | "rails" | "other";
  apiStyle: "rest" | "graphql" | "grpc" | "mixed";
  authMethod: "oidc" | "saml" | "jwt" | "session" | "api-key" | "magic-link";
  rbacRequired: boolean;
  backgroundJobs: boolean;
  webhooks: boolean;
  eventDriven: boolean;
  rateLimiting: boolean;
  caching: boolean;

  database: "postgres" | "mysql" | "mongodb" | "dynamodb" | "firebase" | "supabase" | "redis" | "elasticsearch" | "other";
  dataShape: "structured" | "semi-structured" | "unstructured" | "mixed";
  multiTenant: boolean;
  searchNeeded: boolean;
  realtimeNeeded: boolean;

  cloud: "aws" | "azure" | "gcp" | "vercel" | "netlify" | "render" | "railway" | "heroku" | "kubernetes" | "self-hosted";
  cicd: string;
  iac: string;
  observability: string;
  containerization: "docker" | "kubernetes" | "none";
  envStrategy: string;        // dev/stage/prod
}

export interface SystemDesign {
  expectedUsersTotal: number;
  dau: number;
  mau: number;
  peakConcurrent: number;
  avgRequestsPerUserPerDay: number;
  readWriteRatio: string;          // "80:20"
  dataGrowthGBPerMonth: number;
  notificationsPerDay: number;
  availabilityTarget: string;      // mirrors NF — overrideable
  latencyTargetMs: number;
  geographicCoverage: string;
  multiRegion: boolean;
  drNeeded: boolean;
  cachingStrategy: string;
  dbScalingStrategy: string;
  queueStrategy: string;
  notes: string;
}

export interface AIAutomation {
  needsAI: boolean;
  kinds: string[];                 // chatbot, agent, recommender, classifier, summarizer, automation, vision, voice
  ragNeeded: boolean;
  dataSources: string;
  modelProvider: "openai" | "anthropic" | "azure-openai" | "vertex" | "bedrock" | "open-source" | "mixed" | "tbd";
  humanInLoop: boolean;
  guardrails: boolean;
  evaluation: boolean;
  promptManagement: boolean;
  auditLogs: boolean;
  privacyFiltering: boolean;
  notes: string;
}

export interface ComplianceSecurity {
  processesPersonalData: boolean;
  processesFinancialData: boolean;
  processesHealthData: boolean;
  frameworks: string[];            // GDPR, HIPAA, SOC2, ISO27001, PCI-DSS, PIPEDA, PHIPA, OSFI
  consentMgmt: boolean;
  auditLogs: boolean;
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
  rbacRequired: boolean;
  dataResidencyRequired: boolean;
  incidentResponseRequired: boolean;
  pentestCadence: string;          // annual, per-release, etc.
  threatModel: string;
}

export interface DataAndTech {
  entities: Entity[];
  integrations: Integration[];
  dataResidency: string;
  frontend: string;
  backend: string;
  database: string;
  authStrategy: string;
  cicd: string;
  hosting: string;
  buildVsBuy: string;
}

export interface Functional {
  personas: Persona[];
  requirements: Requirement[];
  features: Feature[];
  kpis: KPI[];
  businessRules: string;
  edgeCases: string;
}

export interface NonFunctional {
  availabilityTarget: string;
  rto: string;
  rpo: string;
  performance: string;
  privacyPosture: string;
  auditability: string;
  costBoundary: string;
  supportModel: string;
  slos: SLO[];
}

export interface GoToMarket {
  packaging: "saas" | "enterprise" | "managed-service" | "internal-only" | "other";
  segments: string;
  buyerObjections: string;
  salesMotion: string;
  channelStrategy: string;
  launchGeography: string;
  complianceGating: string;
  pricingModel: string;
  acquisitionChannels: string;
  retentionStrategy: string;
  partnerships: string;
  competitors: string;
  positioning: string;
  marketingKpis: string;
}

export interface Governance {
  owner: string;
  approvers: string;
  dependencies: string;
  thirdParties: string;
  legalReviews: string;
  procurementReviews: string;
  unvalidatedAssumptions: string;
  decisionConfidence: Confidence;
}

// --- Top-level project ----------------------------------------------------

export interface Project {
  id: string;
  name: string;
  oneLiner: string;
  ideaDescription: string;        // longer "Detailed idea description"
  createdAt: string;
  updatedAt: string;

  problem: ProblemFraming;
  market: MarketContext;
  experience: ExperienceSurface;
  platform: PlatformChoice;
  functional: Functional;
  nonfunctional: NonFunctional;
  dataTech: DataAndTech;
  systemDesign: SystemDesign;
  ai: AIAutomation;
  compliance: ComplianceSecurity;
  gtm: GoToMarket;
  governance: Governance;

  stakeholders: Stakeholder[];
  decisions: Decision[];
  risks: Risk[];
  assumptions: Assumption[];
  openQuestions: OpenQuestion[];

  progress: Record<string, "complete" | "in-progress">;
}

export type DomainKey =
  | "basics"
  | "problem"
  | "market"
  | "experience"
  | "platform"
  | "functional"
  | "features"
  | "nonfunctional"
  | "systemDesign"
  | "dataTech"
  | "ai"
  | "compliance"
  | "gtm"
  | "governance";

export const DOMAIN_ORDER: DomainKey[] = [
  "basics",
  "problem",
  "market",
  "experience",
  "platform",
  "functional",
  "features",
  "nonfunctional",
  "systemDesign",
  "dataTech",
  "ai",
  "compliance",
  "gtm",
  "governance",
];

export const DOMAIN_LABEL: Record<DomainKey, string> = {
  basics: "Project basics",
  problem: "Problem & objectives",
  market: "Customer & market",
  experience: "Experience surface",
  platform: "Platform & channels",
  functional: "Functional requirements",
  features: "Feature builder",
  nonfunctional: "Quality attributes",
  systemDesign: "System design",
  dataTech: "Data & tech stack",
  ai: "AI & automation",
  compliance: "Security & compliance",
  gtm: "Commercial & GTM",
  governance: "Delivery & governance",
};

export const DOMAIN_BLURB: Record<DomainKey, string> = {
  basics: "Name the initiative, capture the idea, and list stakeholders.",
  problem: "What problem, for whom, why now, what success looks like.",
  market: "Buyers, end users, alternatives, differentiation, pricing context.",
  experience: "Surfaces, devices, channels, timing model, accessibility.",
  platform: "What you're building (web, mobile, desktop, SaaS, AI agent…) and the stack.",
  functional: "Personas, requirements with acceptance criteria, edge cases.",
  features: "Feature library with user stories, priority, complexity, value.",
  nonfunctional: "Availability, recovery, performance, privacy, SLOs.",
  systemDesign: "Capacity estimates, scaling, caching, multi-region, DR.",
  dataTech: "Canonical entities, integrations, residency, build vs. buy.",
  ai: "AI/automation needs, RAG, evals, guardrails, model provider.",
  compliance: "Regulatory frameworks, encryption, RBAC, residency, audit.",
  gtm: "Packaging, pricing, segments, channels, competitors, KPIs.",
  governance: "Owners, approvers, dependencies, decisions, confidence.",
};
