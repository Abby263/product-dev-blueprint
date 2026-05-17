import type { Project } from "../schema";
import { ALL_COMPLETE, TemplateMeta } from "./types";

const payload: Partial<Project> = {
  name: "Google Cloud feedback app",
  oneLiner:
    "A Cloud Run feedback app that collects event feedback, stores operational responses in Firestore, analyzes trends in BigQuery, and summarizes insights with Claude on Google Cloud.",
  ideaDescription:
    "Build a simple but production-shaped feedback application for events, demos, or product launches. Users submit a rating and optional comment from a responsive web page. Operators see live response counts, average score, response-time metrics, and AI-generated summaries. The app is deployed on Google Cloud with clear security review, IAM/service-account boundaries, and analytics feedback loops for PM decisions.",
  problem: {
    problem:
      "Teams often collect qualitative feedback through forms or chat, but the data is disconnected from live dashboards, security review, cloud deployment evidence, and product improvement loops.",
    audience: "Developer advocates, product teams, event teams, and internal platform teams that need fast feedback from users or attendees.",
    whyNow:
      "Coding agents, MCP documentation servers, and cloud-managed services make it feasible to move from idea to deployed feedback loop quickly while keeping review gates explicit.",
    successCriteria:
      "Users can submit feedback in under 30 seconds; operators see live metrics; PM receives weekly insights; security review passes before production exposure.",
    outOfScope:
      "Complex survey branching, account-based respondent identity, paid analytics, and long-term CRM integration are out of scope for MVP.",
    businessCase:
      "A lightweight feedback loop shortens the time between release, user signal, and PM prioritization without requiring a bespoke analytics stack.",
    priority: "P1",
  },
  market: {
    buyer: "Product Manager or Developer Relations lead",
    endUser: "Event attendee, beta user, or internal product user",
    operator: "PM, data/growth analyst, or demo owner",
    alternatives: "Google Forms, Typeform, manual spreadsheets, Slack polls, or no structured feedback loop.",
    differentiation:
      "Combines live product feedback, cloud-native deployment, security review, analytics warehouse, and AI-generated insight summaries in one build-ready blueprint.",
    marketSize: "Useful for any team running demos, launches, pilots, or internal tools that require fast feedback loops.",
    pricing: "Internal tool or lightweight SaaS add-on; charge by event/project volume if commercialized.",
    geo: ["united-states", "canada", "global"],
    vertical: "saas-internal",
  },
  experience: {
    surfaces: ["public-website", "internal-console"],
    authMode: "mixed",
    primaryDevice: "responsive",
    offline: false,
    localization: "English MVP; localization-ready labels for event reuse.",
    accessibility: "WCAG 2.2 AA",
    notifications: ["in-app"],
    timingModel: "neither",
  },
  platform: {
    kinds: ["website", "admin-dashboard", "internal-tool"],
    webMarketing: false,
    webPortal: true,
    webAdmin: true,
    webPwa: false,
    webEnterprise: false,
    mobileIOS: false,
    mobileAndroid: false,
    mobileFramework: "none",
    frontend: "nextjs",
    uiFramework: "Tailwind + shadcn/ui",
    stateMgmt: "React state + server actions or TanStack Query",
    designSystem: "Google Cloud-inspired clean dashboard UI",
    authRequired: true,
    responsiveRequired: true,
    accessibilityRequired: true,
    backend: "fastapi",
    apiStyle: "rest",
    authMethod: "oidc",
    rbacRequired: true,
    backgroundJobs: true,
    webhooks: false,
    eventDriven: true,
    rateLimiting: true,
    caching: true,
    database: "firebase",
    dataShape: "mixed",
    multiTenant: false,
    searchNeeded: false,
    realtimeNeeded: true,
    cloud: "gcp",
    cicd: "GitHub Actions with Cloud Run deployment gate",
    iac: "Terraform",
    observability: "Cloud Logging + Cloud Monitoring + Error Reporting + OpenTelemetry",
    containerization: "docker",
    envStrategy: "dev / stage / prod with preview URLs and protected prod deploy",
    deploymentRuntime:
      "Cloud Run services for frontend/API and dashboard backend; Cloud Scheduler or Cloud Run Jobs for summary refresh; regional deployment in us-central1 by default.",
    cloudServices:
      "Cloud Run, Firestore, BigQuery, Looker Studio or Looker, Cloud Logging, Cloud Monitoring, Secret Manager, Artifact Registry, Cloud Build, Vertex AI / Claude on Google Cloud.",
    networking:
      "HTTPS load-balanced public entry, Cloud Armor/WAF optional, private service access where needed, controlled egress, no public database credentials.",
    scalingApproach:
      "Cloud Run request-based autoscaling with min instances for live demos; Firestore automatic scale; BigQuery batch/stream ingestion; dashboard queries cached when needed.",
    cicdDetails:
      "PR checks run typecheck, build, tests, security review, container build, and Cloud Run deploy dry-run before production approval.",
    iacDetails:
      "Terraform owns Cloud Run services, IAM bindings, service accounts, Firestore, BigQuery dataset/tables, Secret Manager, logging sinks, and deployment outputs.",
    enterpriseControls:
      "Dedicated service accounts per deployable, least-privilege IAM, Secret Manager, audit logs, Cloud Logging retention, no broad owner/editor roles.",
  },
  functional: {
    personas: [
      { id: "p1", name: "Feedback submitter", jtbd: "Rate the session or feature quickly from my phone.", pains: "Long surveys and unclear confirmation pages.", channel: "public-website" },
      { id: "p2", name: "Product Manager", jtbd: "Understand sentiment and improvement opportunities after a launch or event.", pains: "Feedback arrives late and lacks actionable grouping.", channel: "internal-console" },
      { id: "p3", name: "Data / growth analyst", jtbd: "Analyze response time, rating distribution, and comment themes.", pains: "Manual spreadsheet cleanup and no warehouse-ready data.", channel: "internal-console" },
      { id: "p4", name: "Security reviewer", jtbd: "Approve the public collection endpoint before it is exposed.", pains: "Demos skip IAM, rate limits, audit, and abuse controls.", channel: "internal-console" },
    ],
    requirements: [
      { id: "FR-001", kind: "functional", title: "Submit feedback", description: "User submits score and optional comment from a responsive page.", acceptance: "Submission completes in under 2 seconds and shows a thank-you state.", priority: "must" },
      { id: "FR-002", kind: "functional", title: "Live dashboard", description: "Operator sees response count, average score, rating distribution, and latest comments.", acceptance: "Dashboard updates within 10 seconds of submission.", priority: "must" },
      { id: "FR-003", kind: "functional", title: "Analytics export", description: "Feedback events are stored in BigQuery for trend analysis.", acceptance: "Every accepted feedback record has a warehouse event with timestamp and response-time metrics.", priority: "must" },
      { id: "FR-004", kind: "functional", title: "AI feedback analyzer", description: "Claude on Google Cloud summarizes feedback themes and suggested improvements.", acceptance: "Summary includes themes, risks, and next PM actions without exposing secrets.", priority: "should" },
      { id: "NFR-001", kind: "nonfunctional", title: "Public endpoint protection", description: "Rate limits, validation, and abuse controls protect the feedback endpoint.", acceptance: "OWASP/API abuse checks pass before production deployment.", priority: "must" },
    ],
    features: [
      { id: "FEAT-001", name: "Feedback form", description: "Responsive score/comment form with thank-you page.", userStory: "As an attendee, I submit useful feedback quickly.", acceptance: "Keyboard accessible; confirmation page renders after valid submit.", priority: "must", complexity: "S", businessValue: "high", dependencies: "Firestore write API", apisNeeded: "POST /feedback", dataNeeded: "FeedbackResponse", edgeCases: "Duplicate submit; empty comment; mobile network delay", errorStates: "Retry with no duplicate write", adminControls: "Disable collection window", audit: "Submission metadata logged", security: "Input validation and rate limit", futureEnhancements: "QR-code event links", release: "mvp" },
      { id: "FEAT-002", name: "Live dashboard", description: "Score, count, latest comments, and response-time cards.", userStory: "As a PM, I see feedback while the event is happening.", acceptance: "Dashboard refreshes within 10 seconds.", priority: "must", complexity: "M", businessValue: "high", dependencies: "Firestore reads", apisNeeded: "GET /feedback/summary", dataNeeded: "FeedbackResponse", edgeCases: "No responses; high-volume burst", errorStates: "Empty state and stale-data indicator", adminControls: "Filter by event", audit: "Dashboard reads logged for admin roles", security: "OIDC login + admin RBAC", futureEnhancements: "Realtime charts", release: "mvp" },
      { id: "FEAT-003", name: "BigQuery analytics pipeline", description: "Persist normalized feedback events for dashboards and trend analysis.", userStory: "As an analyst, I can query feedback over time.", acceptance: "BigQuery table receives every accepted response.", priority: "must", complexity: "M", businessValue: "high", dependencies: "BigQuery dataset", apisNeeded: "Background writer or streaming insert", dataNeeded: "FeedbackEvent", edgeCases: "BigQuery insert failure", errorStates: "Retry queue and dead-letter log", adminControls: "Replay failed events", audit: "Warehouse insert result logged", security: "Service account scoped to dataset writer", futureEnhancements: "Looker modeled explores", release: "mvp" },
      { id: "FEAT-004", name: "AI summary", description: "Claude on Google Cloud summarizes themes and recommendations.", userStory: "As a PM, I get a quick explanation of what to improve.", acceptance: "Summary references feedback themes and avoids raw PII.", priority: "should", complexity: "M", businessValue: "medium", dependencies: "Vertex AI / Claude access", apisNeeded: "POST /feedback/analyze", dataNeeded: "FeedbackEvent", edgeCases: "Too few comments; unsafe content", errorStates: "Show insufficient data or safe refusal", adminControls: "Refresh summary", audit: "Model call metadata logged", security: "No browser model keys", futureEnhancements: "Weekly digest", release: "v1" },
    ],
    kpis: [
      { id: "KPI-001", name: "Feedback completion rate", definition: "% of visitors who submit feedback", target: ">= 40%", cadence: "per event" },
      { id: "KPI-002", name: "Median response time", definition: "Time from page open to submit", target: "<= 30 seconds", cadence: "per event" },
      { id: "KPI-003", name: "Actionable comments", definition: "% of comments categorized into an improvement theme", target: ">= 70%", cadence: "weekly" },
    ],
    businessRules:
      "Feedback must validate score range, limit comment length, reject obvious abuse, and avoid storing secrets or sensitive personal data in analytics tables.",
    edgeCases:
      "Duplicate submissions, bot traffic, no responses yet, BigQuery insert delay, model unavailable for summary, dashboard opened during high-volume burst.",
  },
  nonfunctional: {
    availabilityTarget: "99.5% for MVP",
    rto: "4 hours",
    rpo: "15 minutes",
    performance: "p95 submit API < 500ms excluding cold start; dashboard summary < 1s for recent event data",
    privacyPosture: "Collect minimal personal data; comments are treated as potentially sensitive and filtered before AI summaries.",
    auditability: "Admin dashboard reads, deploys, service-account actions, and AI summary runs are logged.",
    costBoundary: "Keep MVP under $100/month at normal demo/event traffic; alert on unexpected BigQuery or model usage.",
    supportModel: "Demo owner monitors during event; engineering on-call for public launches.",
    slos: [
      { id: "SLO-001", surface: "Feedback submit", metric: "p95 latency", target: "< 500ms warm" },
      { id: "SLO-002", surface: "Dashboard", metric: "freshness", target: "< 10 seconds" },
      { id: "SLO-003", surface: "Analytics pipeline", metric: "event delivery", target: ">= 99% within 5 minutes" },
    ],
  },
  dataTech: {
    entities: [
      { id: "ENT-001", name: "FeedbackResponse", description: "Score, comment, event id, submit timestamp, client metadata, and processing state.", sensitive: true, retention: "13 months" },
      { id: "ENT-002", name: "FeedbackEvent", description: "Warehouse-normalized event for BigQuery analytics.", sensitive: true, retention: "24 months" },
      { id: "ENT-003", name: "SummaryRun", description: "AI summary request, model metadata, prompt version, and resulting summary.", sensitive: true, retention: "13 months" },
    ],
    integrations: [
      { id: "INT-001", system: "Firestore", direction: "outbound", protocol: "Google SDK", dataClass: "Feedback response data", notes: "Operational store for live dashboard." },
      { id: "INT-002", system: "BigQuery", direction: "outbound", protocol: "Google SDK", dataClass: "Analytics events", notes: "Warehouse for response-time and theme analysis." },
      { id: "INT-003", system: "Looker / Looker Studio", direction: "outbound", protocol: "BI connector", dataClass: "Aggregated analytics", notes: "Dashboard for PM and analyst review." },
      { id: "INT-004", system: "Vertex AI / Claude on Google Cloud", direction: "outbound", protocol: "Google Cloud model endpoint", dataClass: "Aggregated comments and metrics", notes: "Server-side only; no browser model credentials." },
    ],
    dataResidency: "Default us-central1; choose a regional BigQuery dataset and Firestore location aligned to launch geography.",
    buildVsBuy:
      "Buy/use managed: Cloud Run, Firestore, BigQuery, Looker, Cloud Logging/Monitoring, Secret Manager, Vertex AI / Claude. Build: feedback UX, API, analytics schema, security review evidence, and PM insight loop.",
  },
  systemDesign: {
    architecturePattern: "serverless",
    authArchitecture: "managed-oidc",
    deploymentTopology: "single-region",
    tradeoffAreas: ["deployment-infra", "identity-auth", "schema-design-lld", "observability", "testing-release"],
    securityReviewAreas: ["identity", "authorization", "data-protection", "secrets", "api-abuse", "audit", "incident-response"],
    highLevelArchitectureNotes:
      "Responsive web UI submits feedback to Cloud Run API. API validates and writes to Firestore, emits normalized events to BigQuery, and serves dashboard summaries. Looker/Looker Studio reads BigQuery for analytics. AI summary endpoint calls Claude on Google Cloud / Vertex AI with aggregated feedback only.",
    lowLevelArchitectureNotes:
      "Modules: FeedbackSubmission, DashboardSummary, AnalyticsWriter, AISummary, AdminAuth, AuditLog. API validates score/comment, writes idempotently, retries BigQuery delivery, and records model summary metadata.",
    domainModelNotes:
      "Event owns feedback responses and summary runs. FeedbackResponse is operational; FeedbackEvent is warehouse-shaped; SummaryRun stores prompt/model metadata and generated insight.",
    schemaDesignNotes:
      "Firestore collection feedback_responses keyed by event_id + response_id. BigQuery table feedback_events partitioned by submit_date and clustered by event_id. SummaryRun collection keyed by event_id + run timestamp.",
    dataLifecycleNotes:
      "Firestore responses retained 13 months. BigQuery analytics retained 24 months. Summary runs retained 13 months. Delete requests remove direct identifiers and keep anonymous aggregates.",
    apiContractNotes:
      "POST /feedback accepts eventId, score, optional comment, clientTimingMs. GET /dashboard/:eventId returns aggregates. POST /feedback/analyze generates AI summary for authorized admins.",
    serviceBoundaryNotes:
      "Feedback API owns validation and Firestore. Analytics writer owns BigQuery delivery. Dashboard owns aggregate reads. AI summary owns model calls and prompt/version metadata.",
    workflowStateNotes:
      "FeedbackResponse: accepted -> written -> warehouse_synced -> summarized. Failed BigQuery writes retry and then dead-letter for replay.",
    integrationContractNotes:
      "Google SDK calls use service accounts. BigQuery insert failures retry with idempotency key. Model calls use server-side credentials and aggregate input only.",
    securityArchitectureNotes:
      "Public submit endpoint has validation, rate limiting, Cloud Armor optional, and no admin data. Dashboard/admin routes require OIDC and admin role. Runtime uses separate service accounts for API, analytics writer, and summary job.",
    observabilityDesignNotes:
      "Trace feedback submit through Firestore write, BigQuery insert, and dashboard refresh. Track response count, submit latency, BigQuery lag, model summary latency/cost, and error rates.",
    infraArchitectureNotes:
      "Terraform provisions Cloud Run, Firestore, BigQuery dataset/table, service accounts, IAM bindings, Secret Manager, Artifact Registry, logging sink, and dashboard outputs.",
    testArchitectureNotes:
      "CI runs unit tests, API contract tests, authorization negative tests, BigQuery schema tests, dashboard empty-state tests, and security review checklist before deploy.",
    expectedUsersTotal: 25_000,
    dau: 2_000,
    mau: 10_000,
    peakConcurrent: 500,
    avgRequestsPerUserPerDay: 2,
    readWriteRatio: "60:40",
    dataGrowthGBPerMonth: 5,
    notificationsPerDay: 0,
    availabilityTarget: "99.5%",
    latencyTargetMs: 500,
    geographicCoverage: "Initial region: us-central1; choose regional data location per event/customer need.",
    multiRegion: false,
    drNeeded: false,
    cachingStrategy: "Cache dashboard aggregates for 5-15 seconds during live demos; CDN static assets.",
    dbScalingStrategy: "Firestore scales automatically for MVP; BigQuery partitions by date and clusters by event_id.",
    queueStrategy: "Use Cloud Tasks or Pub/Sub if direct BigQuery writes need buffering; idempotent replay required.",
    notes:
      "This is intentionally serverless and low-ops. Promote to stronger multi-region posture only when launch risk or customer commitments require it.",
  },
  ai: {
    needsAI: true,
    kinds: ["summarizer", "analytics"],
    ragNeeded: false,
    dataSources: "Aggregated feedback comments and metrics from Firestore/BigQuery, with PII minimization before model calls.",
    modelProvider: "vertex",
    agentFramework: "custom",
    observability: "openllmetry",
    vectorDb: "none",
    humanInLoop: true,
    guardrails: true,
    evaluation: true,
    promptManagement: true,
    auditLogs: true,
    privacyFiltering: true,
    notes:
      "Use Claude on Google Cloud / Vertex AI for server-side feedback summaries. Store prompt version, model, latency, and cost. Do not expose model access to browsers.",
  },
  compliance: {
    processesPersonalData: true,
    processesFinancialData: false,
    processesHealthData: false,
    frameworks: ["OWASP ASVS", "SOC2-ready controls", "PIPEDA/GDPR review if collecting personal data"],
    consentMgmt: true,
    auditLogs: true,
    encryptionAtRest: true,
    encryptionInTransit: true,
    rbacRequired: true,
    dataResidencyRequired: false,
    incidentResponseRequired: true,
    pentestCadence: "before public production launch",
    threatModel:
      "Public feedback endpoint abuse, stored XSS in comments, over-broad service-account permissions, exposed model credentials, BigQuery data leakage, and dashboard admin bypass.",
  },
  gtm: {
    packaging: "internal-only",
    segments: "Event teams, developer relations, product beta teams, internal platform demos.",
    buyerObjections: "Why not just use a form? How do we know the public endpoint is safe? Who owns the dashboard after the event?",
    salesMotion: "Internal enablement or lightweight product-led demo.",
    channelStrategy: "QR code or link from event/demo, internal launch note, dashboard shared with PM and data/growth.",
    launchGeography: "North America first, regional GCP deployment as needed.",
    complianceGating: "Security review before exposing public endpoint; privacy review before collecting free-text comments.",
    pricingModel: "Internal cost allocation or low-cost SaaS add-on by event/project volume.",
    acquisitionChannels: "Developer relations sessions, internal launches, product beta programs.",
    retentionStrategy: "Reusable project/event templates, weekly insight summaries, dashboard bookmarks.",
    partnerships: "Google Cloud, Anthropic/Claude on Google Cloud, Looker/BigQuery ecosystem.",
    competitors: "Google Forms, Typeform, Slido, manual sheets, custom demo apps.",
    positioning:
      "For teams that need feedback they can act on immediately, this app turns submissions into live dashboards and AI-assisted insights while preserving cloud security review discipline.",
    marketingKpis: "Completion rate, average score, response time, actionable-comment rate, repeat event usage.",
  },
  governance: {
    owner: "Product Manager / demo owner",
    approvers: "Engineering lead, security reviewer, data/growth owner",
    dependencies: "Google Cloud project, billing, IAM permissions, Vertex/Claude access, BigQuery dataset, dashboard ownership.",
    thirdParties: "Google Cloud, Anthropic Claude on Google Cloud / Vertex AI, optional Looker.",
    legalReviews: "Privacy notice if comments may include personal data.",
    procurementReviews: "Not needed for internal GCP usage if already contracted; confirm Claude on Google Cloud availability.",
    unvalidatedAssumptions: "Expected traffic burst, model access in target region, dashboard owner availability, and acceptable comment retention.",
    decisionConfidence: "high",
  },
  lifecycle: {
    productManagerPlan:
      "Define the event/launch objective, target audience, score scale, success thresholds, and weekly insight review cadence.",
    uxDesignerPlan:
      "Start from a simple mobile-first feedback form sketch, then refine responsive form, thank-you page, dashboard cards, and empty/error/loading states.",
    softwareEngineerPlan:
      "Implement frontend form/dashboard, Cloud Run API, Firestore writes, BigQuery analytics delivery, AI summary endpoint, and CI/CD in separate slices.",
    securityEngineerPlan:
      "Review public endpoint abuse controls, OIDC admin access, service-account IAM, Secret Manager, Cloud Logging audit evidence, and OWASP web/API risks before prod.",
    dataGrowthPlan:
      "Define feedback_events schema, BigQuery partitions, Looker dashboard cards, response-time metric, rating distribution, and AI-generated PM insight summary.",
    prototypeSource:
      "Low-fidelity sketch or Figma frame with three screens: feedback form, thank-you page, live dashboard.",
    uxHandoffNotes:
      "Use mobile-first form, large tap targets, accessible radio/slider score input, visible confirmation, dashboard empty state, and live/stale data indicator.",
    cloudDeploymentTarget:
      "Cloud Run for API/frontend container, Firestore for operational records, BigQuery for analytics, Looker/Looker Studio dashboard, Vertex AI / Claude on Google Cloud for summaries.",
    managedServices:
      "Cloud Run, Firestore, BigQuery, Looker/Looker Studio, Cloud Logging, Cloud Monitoring, Secret Manager, Artifact Registry, Cloud Build/GitHub Actions, Vertex AI / Claude on Google Cloud.",
    mcpDocumentationSources:
      "Google Cloud Developer Knowledge MCP for Cloud Run, Firestore, BigQuery, IAM, and deployment guidance; BigQuery MCP for analysis; Looker/DB MCP where dashboard modeling is needed.",
    skillsAndSubagentsPlan:
      "Use UX/front-end skill for screens, Cloud Run skill for API deployment, Firestore/BigQuery skills for persistence and analytics, security-review subagent, and dashboard/analytics subagent.",
    securityReviewChecklist:
      "Validate inputs, rate-limit public submits, enforce OIDC/RBAC for dashboard, use service account per deployable, least-privilege IAM, Secret Manager, no browser model keys, audit logs, and OWASP API checks.",
    deploymentApprovalGate:
      "Production deploy requires typecheck, build, API tests, security checklist approval, Cloud Run smoke test, dashboard verification, rollback notes, and owner sign-off.",
    analyticsFeedbackLoop:
      "Send every accepted response to BigQuery, review Looker dashboard after each event, generate AI theme summary, and feed PM backlog decisions weekly.",
  },
  stakeholders: [
    { id: "s1", role: "Product Manager", responsibility: "Own success criteria, feedback questions, and improvement decisions." },
    { id: "s2", role: "UX Designer", responsibility: "Own form/dashboard usability and accessibility." },
    { id: "s3", role: "Software Engineer", responsibility: "Own Cloud Run app, Firestore, BigQuery integration, and tests." },
    { id: "s4", role: "Security Engineer", responsibility: "Own security review and deploy approval." },
    { id: "s5", role: "Data / Growth Analyst", responsibility: "Own BigQuery/Looker dashboard and insight cadence." },
  ],
  decisions: [
    { id: "ADR-001", title: "Use Cloud Run for deployable services", context: "Need low-ops deployment for a small feedback app with burst traffic.", decision: "Deploy API/frontend container to Cloud Run.", alternatives: "GKE, App Engine, Firebase Hosting + Functions.", consequences: "Simple autoscaling and container portability; still needs IAM and cold-start review.", status: "accepted", confidence: "high" },
    { id: "ADR-002", title: "Use Firestore plus BigQuery", context: "Operational dashboard needs fast recent reads while analytics needs queryable history.", decision: "Firestore stores operational feedback; BigQuery stores analytics events.", alternatives: "Postgres only, BigQuery only, Firestore only.", consequences: "Clear operational/analytics split; dual-write/retry path must be tested.", status: "accepted", confidence: "high" },
  ],
  risks: [
    { id: "RISK-001", description: "Public feedback endpoint receives bot spam or abusive comments.", likelihood: "medium", impact: "medium", mitigation: "Rate limits, validation, optional CAPTCHA/Cloud Armor, moderation, and admin review." },
    { id: "RISK-002", description: "Service account has broader Google Cloud permissions than necessary.", likelihood: "medium", impact: "high", mitigation: "One service account per deployable, least-privilege IAM, and security review gate." },
    { id: "RISK-003", description: "Analytics pipeline silently drops feedback events.", likelihood: "low", impact: "medium", mitigation: "Idempotent event IDs, retry/dead-letter path, and dashboard freshness metric." },
  ],
  assumptions: [
    { id: "ASM-001", text: "Initial launch uses one Google Cloud project and one primary region.", validated: false },
    { id: "ASM-002", text: "Claude on Google Cloud / Vertex access is enabled for the target project before AI summary work starts.", validated: false },
  ],
  openQuestions: [
    { id: "Q-001", text: "Will free-text comments require privacy notice or consent language?", owner: "Security Engineer" },
    { id: "Q-002", text: "Should the dashboard use Looker or Looker Studio for the first version?", owner: "Data / Growth Analyst" },
  ],
  progress: ALL_COMPLETE,
};

export const GCP_FEEDBACK_TEMPLATE: TemplateMeta = {
  id: "gcp-feedback-app",
  title: "Google Cloud feedback app",
  blurb:
    "Cloud Run feedback app with Firestore, BigQuery, Looker dashboards, Claude on Google Cloud summaries, IAM review, and analytics feedback loop.",
  vertical: "GCP / feedback analytics",
  stackChips: ["Next.js", "FastAPI", "Cloud Run", "Firestore", "BigQuery"],
  complianceChips: ["OWASP", "IAM least privilege", "Audit logs"],
  scaleChip: "Event/demo traffic • serverless",
  payload,
};
