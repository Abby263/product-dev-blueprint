import type { Project } from "../schema";
import { ALL_COMPLETE, TemplateMeta } from "./types";

const payload: Partial<Project> = {
  name: "Two-sided marketplace",
  oneLiner:
    "A consumer-to-pro services marketplace: customers post jobs, vetted pros bid, secure escrow on delivery.",
  ideaDescription:
    "We're building a two-sided services marketplace (think category-specific Thumbtack / TaskRabbit). Customers post a job; vetted professionals bid; both sides communicate in-app; payment goes through escrow with release on completion. Mobile-first for both sides; trust + safety is a first-class concern (verification, ratings, dispute flow).",
  problem: {
    problem:
      "Local services discovery is fragmented (Google + Yelp + word of mouth). Existing marketplaces are saturated, generic, and have weak trust. Pros are unhappy with lead-buying models that don't guarantee paid work.",
    audience: "Customers needing a vetted local pro; pros who want paid jobs (not paid leads).",
    whyNow:
      "Trust signals (ID verification, payment escrow) are now table-stakes; mobile-first UX expectations have raised the floor; AI moderation + matching reduces the cost of running trust + safety.",
    successCriteria:
      "Take rate of 12-15% on completed jobs; <= 3% dispute rate; >= 4.6/5 average rating; >= 60% repeat-customer within 12 months.",
    outOfScope:
      "Embedded marketing services (e.g. Google Ads on behalf of pros); subscriptions for pros in v1; multi-country in v1.",
    businessCase:
      "Initial vertical (e.g. home services) is a $400B/yr NA market. At 0.1% capture and 12% take rate, that's a $50M/yr revenue opportunity.",
    priority: "P1",
  },
  market: {
    buyer: "Customer (pays for the service)",
    endUser: "Customer + Pro",
    operator: "Trust & safety + customer support team",
    alternatives: "Thumbtack, TaskRabbit, Angi, local FB groups, Google + Yelp + DM.",
    differentiation: "Vertical specialization; pay-for-completion (not pay-for-leads); trust-first verification.",
    marketSize: "$400B home + local services NA. Initial SAM $20B in pilot vertical.",
    pricing: "12-15% take rate per completed job; no listing fees.",
    geo: ["united-states", "canada"],
    vertical: "retail",
  },
  experience: {
    surfaces: ["public-website", "cross-platform-mobile", "internal-console"],
    authMode: "mixed",
    primaryDevice: "mobile-first",
    offline: false,
    localization: "en-US, en-CA, fr-CA, es-US",
    accessibility: "WCAG 2.2 AA",
    notifications: ["push", "sms", "email", "in-app"],
    timingModel: "appointment",
  },
  platform: {
    kinds: ["website", "mobile-app", "saas-platform", "marketplace", "admin-dashboard"],
    webMarketing: true,
    webPortal: true,
    webAdmin: true,
    webPwa: false,
    webEnterprise: false,
    mobileIOS: true,
    mobileAndroid: true,
    mobileFramework: "react-native",
    frontend: "nextjs",
    uiFramework: "shadcn/ui + Tailwind",
    stateMgmt: "Zustand + TanStack Query",
    designSystem: "Airbnb-inspired warm",
    authRequired: true,
    responsiveRequired: true,
    accessibilityRequired: true,
    backend: "express",
    apiStyle: "rest",
    authMethod: "oidc",
    rbacRequired: true,
    backgroundJobs: true,
    webhooks: true,
    eventDriven: true,
    rateLimiting: true,
    caching: true,
    database: "postgres",
    dataShape: "structured",
    multiTenant: false,
    searchNeeded: true,
    realtimeNeeded: true,
    cloud: "aws",
    cicd: "GitHub Actions with mobile build lanes and protected prod deploys",
    iac: "Terraform + AWS modules",
    observability: "OpenTelemetry + Datadog + Sentry",
    containerization: "docker",
    envStrategy: "dev / stage / prod with PR previews",
    deploymentRuntime:
      "ECS Fargate for marketplace APIs, chat, matching, and trust-safety workers; Lambda for payment/verification webhooks; managed mobile build pipelines for React Native.",
    cloudServices:
      "Aurora PostgreSQL, OpenSearch, ElastiCache Redis, SQS, EventBridge, S3, CloudFront, WAF, KMS, Secrets Manager, Cognito/Auth0 integration, SNS/Pinpoint.",
    networking:
      "AWS VPC with public ALB/WAF, private app/database/search/cache subnets, VPC endpoints, NAT egress, CloudFront for media/CDN, private connectivity to OpenSearch and Aurora.",
    scalingApproach:
      "Fargate autoscaling by RPS/CPU, SQS worker scaling for verification/T&S/payment events, OpenSearch index partitioning by geo/category, Redis pub/sub for chat fan-out, image/media processing queue.",
    cicdDetails:
      "PR checks run marketplace state-machine tests, payment webhook contract tests, T&S policy tests, mobile smoke builds, and tenant/privacy negative tests; prod deploy requires rollback and migration approval.",
    iacDetails:
      "Terraform owns networking, ECS services, Aurora, Redis, OpenSearch, queues/events, S3 media, KMS, WAF, IAM, monitoring, and environment promotion.",
    enterpriseControls:
      "Stripe-hosted PCI boundary, KMS encryption, Secrets Manager, signed media uploads, audit logs for payments/T&S/disputes, fraud/rate-limit rules, SIEM export.",
  },
  functional: {
    personas: [
      { id: "p1", name: "Customer (job poster)", jtbd: "Get a vetted pro to do the work; pay only when satisfied.", pains: "Pros ghosting; no recourse on bad work.", channel: "any" },
      { id: "p2", name: "Pro (bidder)", jtbd: "Win paid jobs (not paid leads).", pains: "Lead-buying tools that charge per click with no completion guarantee.", channel: "cross-platform-mobile" },
      { id: "p3", name: "T&S operator", jtbd: "Catch scams, fake profiles, payment fraud.", pains: "Disparate signals; manual review queue.", channel: "internal-console" },
      { id: "p4", name: "Support agent", jtbd: "Resolve disputes fast and fairly.", pains: "Lack of context across job + payment + chat.", channel: "internal-console" },
    ],
    requirements: [
      { id: "FR-001", kind: "functional", title: "Customer posts a job", description: "Guided posting wizard with category, scope, budget, location, and photos.", acceptance: "Job goes live within 60s; matched pros notified within 5min.", priority: "must" },
      { id: "FR-002", kind: "functional", title: "Pro bids on a job", description: "Pro sees matched jobs in feed; submits bid + ETA + portfolio link.", acceptance: "Bid submitted in < 30s; customer sees in real time.", priority: "must" },
      { id: "FR-003", kind: "functional", title: "In-app messaging", description: "Realtime chat between matched customer + pro with media + auto-translation.", acceptance: "Sub-second delivery; phone numbers + emails redacted.", priority: "must" },
      { id: "FR-004", kind: "functional", title: "Escrow + payouts (Stripe Connect)", description: "Customer pays into escrow; release on completion or dispute resolution.", acceptance: "Payout to pro within 24h of completion confirmation.", priority: "must" },
      { id: "FR-005", kind: "functional", title: "Reviews + reputation", description: "Two-sided review with moderation.", acceptance: "Reviews visible within 1h; flagged content human-reviewed.", priority: "must" },
      { id: "FR-006", kind: "functional", title: "Pro verification", description: "ID check, license/insurance verification (where applicable), background check.", acceptance: "Pro marked verified within 48h average.", priority: "must" },
      { id: "FR-007", kind: "functional", title: "Search + discovery", description: "Faceted search with category, location radius, rating, availability.", acceptance: "Search p95 < 1s on 1M pro records.", priority: "should" },
      { id: "FR-008", kind: "functional", title: "T&S operator console", description: "Queue of flagged listings, profiles, and chats; bulk actions.", acceptance: "Average review time < 90s/case.", priority: "must" },
      { id: "NFR-001", kind: "nonfunctional", title: "PCI scope minimization", description: "Card data never touches our servers.", acceptance: "Stripe-hosted card capture; PCI SAQ-A scope only.", priority: "must" },
      { id: "NFR-002", kind: "nonfunctional", title: "Mobile p95 cold start", description: "iOS + Android cold start to interactive.", acceptance: "< 3s on mid-tier devices.", priority: "should" },
    ],
    features: [
      { id: "FEAT-001", name: "Customer onboarding + posting wizard", description: "Account + first job in one flow.", userStory: "As a customer, I post my first job in under 5 minutes.", acceptance: "First-job conversion > 60%.", priority: "must", complexity: "M", businessValue: "high", dependencies: "Identity, Maps", apisNeeded: "/jobs/*", dataNeeded: "Job", edgeCases: "Drop-off; abandoned posting recovery", errorStates: "Save draft locally; resume", adminControls: "Per-category required fields", audit: "Post events", security: "Rate-limited", futureEnhancements: "Voice posting", release: "mvp" },
      { id: "FEAT-002", name: "Pro onboarding + verification", description: "ID + license + background check flow.", userStory: "As a pro, I get verified and start bidding in < 48h.", acceptance: "48h SLA on verification turnaround.", priority: "must", complexity: "L", businessValue: "high", dependencies: "Persona / Stripe Identity / Checkr", apisNeeded: "/pros/verify", dataNeeded: "Pro, Verification", edgeCases: "Failed verification; re-submit flow", errorStates: "Clear remediation guidance", adminControls: "Manual override", audit: "Verification events", security: "PII encrypted at rest", futureEnhancements: "Continuous monitoring of license expiry", release: "mvp" },
      { id: "FEAT-003", name: "Job matching + bid feed", description: "Pros see matched jobs; first-N priority routing.", userStory: "As a pro, I see relevant jobs in my feed.", acceptance: "Match relevance > 80% accept rate at top of feed.", priority: "must", complexity: "L", businessValue: "high", dependencies: "Search engine", apisNeeded: "/feeds/pro", dataNeeded: "Match", edgeCases: "Geo edge cases; stale availability", errorStates: "Empty-state with onboarding tip", adminControls: "Boost / suppress signal weights", audit: "Match decisions", security: "—", futureEnhancements: "ML-driven ranking", release: "mvp" },
      { id: "FEAT-004", name: "In-app chat", description: "Realtime chat with media + redaction.", userStory: "As a customer / pro, I message securely without leaving the app.", acceptance: "Sub-second delivery; redaction always on.", priority: "must", complexity: "L", businessValue: "high", dependencies: "WebSocket fan-out", apisNeeded: "WS /chat/stream", dataNeeded: "Message", edgeCases: "Image upload; offline send queue", errorStates: "Show send-pending state", adminControls: "T&S review queue", audit: "Messages stored 13mo", security: "Phone/email redaction; encryption at rest", futureEnhancements: "Auto-translation", release: "mvp" },
      { id: "FEAT-005", name: "Escrow + payouts", description: "Stripe Connect for payment; release on completion or dispute resolution.", userStory: "As a customer, I'm protected by escrow.", acceptance: "Payout in <24h of completion.", priority: "must", complexity: "XL", businessValue: "high", dependencies: "Stripe Connect", apisNeeded: "/payments/*", dataNeeded: "Payment, Payout, Dispute", edgeCases: "Refund; partial refund; dispute", errorStates: "Hold + escalate to T&S", adminControls: "Manual release / refund", audit: "Every payment event", security: "PCI SAQ-A scope", futureEnhancements: "Milestone-based payments", release: "mvp" },
      { id: "FEAT-006", name: "Reviews + reputation", description: "Two-sided review with moderation.", userStory: "As a customer, I trust ratings before I hire.", acceptance: "Flagged content reviewed in <2h.", priority: "must", complexity: "M", businessValue: "high", dependencies: "Moderation queue", apisNeeded: "/reviews/*", dataNeeded: "Review", edgeCases: "Retaliatory reviews; spam", errorStates: "Hidden until reviewed", adminControls: "Edit / hide / restore", audit: "Review actions", security: "—", futureEnhancements: "Verified-purchase only filter", release: "mvp" },
      { id: "FEAT-007", name: "Search + discovery", description: "Faceted search with category, geo, availability, rating.", userStory: "As a customer, I find a pro fast.", acceptance: "Search p95 < 1s on 1M records.", priority: "should", complexity: "L", businessValue: "high", dependencies: "Elasticsearch / OpenSearch", apisNeeded: "/search", dataNeeded: "ProIndex", edgeCases: "Geo edge; spelling errors", errorStates: "Empty-state with broader search hint", adminControls: "Boost local pros", audit: "—", security: "—", futureEnhancements: "Personalized ranking", release: "mvp" },
      { id: "FEAT-008", name: "Dispute flow", description: "Open dispute → evidence intake → T&S review → outcome.", userStory: "As a customer, I open a dispute when work isn't satisfactory.", acceptance: "Outcome within 7 business days.", priority: "must", complexity: "L", businessValue: "high", dependencies: "—", apisNeeded: "/disputes/*", dataNeeded: "Dispute", edgeCases: "Counter-claim; evidence in chat history", errorStates: "Surface clear next steps", adminControls: "Assign reviewer; outcome workflow", audit: "Every state change", security: "—", futureEnhancements: "Mediation chat with both parties", release: "v1" },
      { id: "FEAT-009", name: "T&S operator console", description: "Queue of flagged listings, profiles, chats; bulk actions.", userStory: "As an operator, I keep the marketplace safe.", acceptance: "Avg review time < 90s/case.", priority: "must", complexity: "L", businessValue: "high", dependencies: "—", apisNeeded: "/ts/*", dataNeeded: "Flag, Action", edgeCases: "Bulk-action mistakes", errorStates: "Undo within 5 min", adminControls: "—", audit: "Every action logged", security: "RBAC: T&S role", futureEnhancements: "ML-prioritized queue", release: "mvp" },
    ],
    kpis: [
      { id: "KPI-001", name: "Take rate", definition: "Platform fee / GMV", target: "12-15%", cadence: "monthly" },
      { id: "KPI-002", name: "Dispute rate", definition: "Disputes / completed jobs", target: "<= 3%", cadence: "weekly" },
      { id: "KPI-003", name: "Avg rating", definition: "Mean two-sided rating on completed jobs", target: ">= 4.6 / 5", cadence: "weekly" },
      { id: "KPI-004", name: "Repeat customer rate", definition: "% customers with 2+ jobs in 12 months", target: ">= 60%", cadence: "quarterly" },
    ],
    businessRules:
      "Card data never touches our servers (PCI SAQ-A). Phone + email auto-redacted in chat. Pros must be verified before bidding. Reviews are moderated; flagged content hidden until reviewed.",
    edgeCases:
      "Pros sharing contact info to circumvent platform; chargebacks; verification fraud; chat spam; review retaliation; geo edge cases at city boundaries.",
  },
  nonfunctional: {
    availabilityTarget: "99.95%",
    rto: "1 hour",
    rpo: "5 minutes",
    performance: "Search p95 < 1s; chat sub-second delivery; mobile cold start < 3s",
    privacyPosture: "Customer + pro PII encrypted at rest; chat content retained 13 months; verification docs retained per regulatory minimum.",
    auditability: "Every payment, dispute, T&S action, and verification step in append-only audit log.",
    costBoundary: "Gross margin > 70% after payment processing fees.",
    supportModel: "24/7 chat for active disputes + payments; 9-9 ET email otherwise.",
    slos: [
      { id: "SLO-001", surface: "Search", metric: "p95 latency", target: "< 1s on 1M pro records" },
      { id: "SLO-002", surface: "Chat", metric: "delivery latency", target: "< 1s p95" },
      { id: "SLO-003", surface: "Payment events", metric: "webhook → state update", target: "< 30s p95" },
      { id: "SLO-004", surface: "Verification SLA", metric: "submission → decision", target: "< 48h average" },
    ],
  },
  dataTech: {
    entities: [
      { id: "ENT-001", name: "User (Customer)", description: "Customer account.", sensitive: true, retention: "While active + 7 years post-close" },
      { id: "ENT-002", name: "Pro", description: "Pro profile + verification status.", sensitive: true, retention: "While active + 7 years post-close" },
      { id: "ENT-003", name: "Job", description: "Posted job with category, scope, budget, status.", sensitive: false, retention: "7 years" },
      { id: "ENT-004", name: "Bid", description: "Pro's bid on a job.", sensitive: false, retention: "7 years" },
      { id: "ENT-005", name: "Conversation / Message", description: "In-app chat.", sensitive: true, retention: "13 months default; 7 years if part of dispute" },
      { id: "ENT-006", name: "Payment / Payout", description: "Stripe-tokenized references and amounts.", sensitive: true, retention: "7 years" },
      { id: "ENT-007", name: "Review", description: "Two-sided review.", sensitive: false, retention: "Indefinite" },
      { id: "ENT-008", name: "Dispute", description: "Dispute case + evidence.", sensitive: true, retention: "7 years" },
    ],
    integrations: [
      { id: "INT-001", system: "Stripe Connect", direction: "bidirectional", protocol: "REST + Webhooks", dataClass: "Tokenized payment references", notes: "Card capture is Stripe-hosted; SAQ-A scope." },
      { id: "INT-002", system: "Persona / Stripe Identity", direction: "outbound", protocol: "REST", dataClass: "PII (ID docs)", notes: "Pro identity verification." },
      { id: "INT-003", system: "Checkr", direction: "outbound", protocol: "REST", dataClass: "Background check results", notes: "Where required by category + geo." },
      { id: "INT-004", system: "Twilio + SendGrid", direction: "outbound", protocol: "REST", dataClass: "PII (phone/email)", notes: "Notifications." },
      { id: "INT-005", system: "Mapbox / Google Maps", direction: "outbound", protocol: "REST", dataClass: "Location", notes: "Geocoding + distance." },
      { id: "INT-006", system: "Auth0", direction: "bidirectional", protocol: "OIDC", dataClass: "Identity", notes: "Customer + pro auth." },
    ],
    dataResidency: "us-east-1 default; ca-central-1 for Canadian users.",
    buildVsBuy:
      "Buy: payments (Stripe Connect), identity verification (Persona), background checks (Checkr), notifications, maps, identity (Auth0). Build: marketplace + matching + chat + T&S console + dispute flow.",
  },
  systemDesign: {
    architecturePattern: "service-oriented",
    authArchitecture: "managed-oidc",
    deploymentTopology: "active-passive",
    tradeoffAreas: ["identity-auth", "schema-design-lld", "api-boundary", "integration-failure", "realtime-notifications", "deployment-infra", "testing-release"],
    securityReviewAreas: ["identity", "authorization", "data-protection", "privacy", "secrets", "api-abuse", "audit", "incident-response"],
    highLevelArchitectureNotes:
      "CloudFront/WAF fronts web and API traffic; mobile apps call marketplace APIs through ALB/API gateway. ECS services own jobs, bids, chat, payments, verification, T&S, reviews, and search. Aurora Postgres is the transactional source of truth; OpenSearch powers pro/job discovery; Redis supports chat/session fan-out; SQS/EventBridge isolates external provider workflows.",
    lowLevelArchitectureNotes:
      "Modules: Identity, Customer, Pro, Job, Bid, Match, Chat, Payment, Verification, Review, Dispute, TrustSafety, Audit. Payment and dispute workflows are strict state machines. Search index is a read model generated from Pro/Job changes.",
    domainModelNotes:
      "Customer and Pro are distinct account aggregates. Job owns scope, location, budget, status, winning bid, and completion. Bid belongs to Job and Pro. Conversation belongs to matched Job participants. Payment/Payout and Dispute own regulated state transitions and audit evidence.",
    schemaDesignNotes:
      "Postgres tables for users, pros, verifications, jobs, bids, conversations, messages, payments, payouts, disputes, reviews, flags, moderation_actions, audit_events. Partition messages by month; partial indexes for active jobs and open disputes; OpenSearch indexes pro profiles and active jobs by geo/category.",
    dataLifecycleNotes:
      "Payment/dispute records retain 7 years. Chat retains 13 months unless attached to dispute. Verification docs are stored by provider with tokenized references. Media in S3 uses lifecycle rules and virus scan metadata.",
    apiContractNotes:
      "REST/OpenAPI APIs for job posting, bidding, chat, payments, verification, disputes, and T&S actions. Stripe/verification webhooks are signed, idempotent, and replayable. Mobile APIs include backward-compatible versioned responses.",
    serviceBoundaryNotes:
      "Job service owns posting and lifecycle. Match service owns bid feed/ranking. Chat service owns messages and redaction. Payment service owns Stripe state. T&S service owns flags and moderation actions. Audit service is append-only.",
    workflowStateNotes:
      "Job: draft -> posted -> bidding -> awarded -> in_progress -> completed/disputed/cancelled. Payment: authorized -> held_in_escrow -> released/refunded/disputed. Verification: submitted -> pending_provider -> approved/rejected/manual_review.",
    integrationContractNotes:
      "Stripe Connect webhooks use idempotency and reconciliation jobs. Persona/Checkr failures route to manual review. Twilio/SendGrid retries respect quiet hours. Maps/geocoding failures preserve draft jobs and prompt for manual location entry.",
    securityArchitectureNotes:
      "OIDC with MFA for admins, scoped roles for T&S/support/payments, Stripe-hosted card capture, phone/email redaction in chat, signed media URLs, rate limits on posting/bidding/chat, fraud rules, and full audit of payment/dispute actions.",
    observabilityDesignNotes:
      "Dashboards track search latency, chat delivery, payment webhook lag, verification SLA, SQS depth, fraud/rate-limit blocks, dispute rate, media processing, and mobile API error rates. Sentry captures web/mobile UX regressions.",
    infraArchitectureNotes:
      "Terraform-managed AWS VPC, ECS Fargate services, Lambda webhooks, Aurora, OpenSearch, Redis, SQS/EventBridge, S3 media pipeline, CloudFront/WAF, KMS, Secrets Manager, Datadog/Sentry monitors, and active/passive DR backups.",
    testArchitectureNotes:
      "Payment webhook contract tests, dispute/payment state-machine tests, chat redaction tests, search relevance fixtures, authorization-negative tests for support/T&S roles, mobile smoke builds, and load tests for search/chat bursts.",
    expectedUsersTotal: 10_000_000,
    dau: 80_000,
    mau: 600_000,
    peakConcurrent: 4_000,
    avgRequestsPerUserPerDay: 25,
    readWriteRatio: "75:25",
    dataGrowthGBPerMonth: 800,
    notificationsPerDay: 300_000,
    availabilityTarget: "99.95%",
    latencyTargetMs: 1_000,
    geographicCoverage: "US + Canada",
    multiRegion: false,
    drNeeded: true,
    cachingStrategy: "CDN for static + pro profile pages; Redis for hot match feed and chat session state.",
    dbScalingStrategy: "Postgres + read replicas; partition Message by month; archive cold messages to S3.",
    queueStrategy: "SQS for async jobs (notifications, verification webhook handlers); EventBridge for cross-service events; WebSocket fan-out via Redis for chat.",
    notes: "Chat throughput dominates infra cost — capping multi-media file size and aggressive image compression matter.",
  },
  ai: {
    needsAI: false,
    kinds: [],
    ragNeeded: false,
    dataSources: "",
    modelProvider: "tbd",
    agentFramework: "none",
    observability: "none",
    vectorDb: "none",
    humanInLoop: false,
    guardrails: false,
    evaluation: false,
    promptManagement: false,
    auditLogs: false,
    privacyFiltering: false,
    notes: "AI features (matching ranking, T&S triage, auto-translation) are v1.5+ candidates.",
  },
  compliance: {
    processesPersonalData: true,
    processesFinancialData: true,
    processesHealthData: false,
    frameworks: ["PCI-DSS", "SOC2", "PIPEDA", "OWASP-ASVS"],
    consentMgmt: true,
    auditLogs: true,
    encryptionAtRest: true,
    encryptionInTransit: true,
    rbacRequired: true,
    dataResidencyRequired: true,
    incidentResponseRequired: true,
    pentestCadence: "annual + per-major-release",
    threatModel:
      "Top threats: payment fraud (chargeback abuse), verification fraud, off-platform contact-info sharing, retaliatory reviews. Mitigations: Stripe Radar; multi-source verification; auto-redaction in chat; review moderation.",
  },
  gtm: {
    packaging: "saas",
    segments: "Customers seeking local services + pros looking for paid jobs.",
    buyerObjections: "Trust (will the pro show up?); cost vs. DIY; existing relationships with local pros.",
    salesMotion: "Two-sided supply-then-demand growth; demand-side referral programs; supply-side onboarding partnerships.",
    channelStrategy: "Direct (consumer + pro acquisition).",
    launchGeography: "US (top 5 metros) + Canada (Toronto, Vancouver) Q1; expand to top 20 metros Q3.",
    complianceGating: "PCI SAQ-A scope confirmed; PIPEDA review for Canadian launch.",
    pricingModel: "12-15% take rate per completed job. No listing fees.",
    acquisitionChannels: "Paid social (customer); pro-onboarding partnerships with trade associations; content (cost-of-services calculators).",
    retentionStrategy: "Repeat-customer discounts; pro-of-the-month; referral credits both sides.",
    partnerships: "Trade associations + local trade schools (pro supply); category-specific publishers (demand).",
    competitors: "Thumbtack, Angi, TaskRabbit, local FB groups.",
    positioning:
      "For customers needing a vetted local pro and pros tired of paid-lead marketplaces, ours is pay-for-completion only — pros earn when work is done, customers pay only when satisfied.",
    marketingKpis: "CAC payback < 12 months; pro 90-day retention >= 60%; first-job conversion > 30%.",
  },
  governance: {
    owner: "VP Product (Marketplace)",
    approvers: "VP Eng, Head of T&S, GC, Head of Payments",
    dependencies: "Stripe Connect approval; Persona / Checkr contracts; Twilio + SendGrid; Auth0 enterprise.",
    thirdParties: "Stripe Connect, Persona, Checkr, Twilio, SendGrid, Auth0, Mapbox, AWS, Datadog, Sentry.",
    legalReviews: "Marketplace ToS + Pro Agreement; PCI SAQ-A attestation; PIPEDA review for Canada.",
    procurementReviews: "Stripe Connect commercial terms; Persona / Checkr enterprise tier.",
    unvalidatedAssumptions: "Pros will accept pay-for-completion vs. pay-for-leads; verification turnaround < 48h is achievable consistently.",
    decisionConfidence: "medium",
  },
  stakeholders: [
    { id: "s1", role: "VP Product (Marketplace)", responsibility: "Roadmap + GTM" },
    { id: "s2", role: "VP Engineering", responsibility: "Platform + on-call" },
    { id: "s3", role: "Head of Trust & Safety", responsibility: "Verification + dispute outcomes" },
    { id: "s4", role: "Head of Payments", responsibility: "Stripe Connect + chargeback rate" },
    { id: "s5", role: "GC", responsibility: "Marketplace ToS + regulatory" },
  ],
  decisions: [
    { id: "ADR-001", title: "Stripe Connect (not Adyen / Braintree) for marketplace payments", context: "Need escrow + multi-party payouts.", decision: "Stripe Connect Express accounts.", alternatives: "Adyen MarketPay; Braintree.", consequences: "Operational simplicity; Stripe-hosted card capture keeps PCI scope SAQ-A.", status: "accepted", confidence: "high" },
    { id: "ADR-002", title: "React Native (not native-each) for mobile", context: "Single team velocity matters more than platform-specific polish at MVP.", decision: "React Native; native modules for chat + payments.", alternatives: "Native iOS + Android; Flutter.", consequences: "Some polish trade-offs vs. native; one team, one codebase.", status: "accepted", confidence: "medium" },
    { id: "ADR-003", title: "Chat: build (not buy)", context: "Chat is core to trust + safety; buying loses control of moderation.", decision: "Build chat on top of Postgres + WebSocket fan-out via Redis.", alternatives: "Stream / Sendbird; PubNub.", consequences: "Higher initial eng cost; full control of T&S signals.", status: "accepted", confidence: "high" },
  ],
  risks: [
    { id: "RISK-001", description: "Pros circumvent the platform by sharing contact info — direct erosion of take rate.", likelihood: "high", impact: "high", mitigation: "Aggressive in-chat redaction; in-app payment incentives; trust scores degrade with off-platform behavior signals." },
    { id: "RISK-002", description: "Verification turnaround slips beyond 48h, killing pro onboarding conversion.", likelihood: "medium", impact: "high", mitigation: "Vendor SLA + paid escalation; dual-vendor for redundancy; manual override path." },
    { id: "RISK-003", description: "Chargeback rate exceeds Stripe Radar thresholds.", likelihood: "low", impact: "high", mitigation: "Escrow holds for new pros; manual review of high-value first-job orders; rapid dispute SLA." },
    { id: "RISK-004", description: "Reviews are gamed (retaliation, sock-puppet).", likelihood: "medium", impact: "medium", mitigation: "Verified-purchase only; moderation queue; pattern-detection on rating velocity." },
  ],
  assumptions: [
    { id: "ASM-001", text: "Pay-for-completion (vs. pay-for-leads) is a real differentiator pros will pick.", validated: false },
    { id: "ASM-002", text: "12-15% take rate is the right unit economics floor.", validated: false },
    { id: "ASM-003", text: "Top-5 metros provide enough density for both sides in 6 months.", validated: false },
  ],
  openQuestions: [
    { id: "Q-001", text: "Pick the v1 vertical: home services, beauty, lessons, or events?", owner: "VP Product (Marketplace)" },
    { id: "Q-002", text: "Do we ship dispute flow at MVP or v1?", owner: "Head of T&S" },
  ],
  progress: ALL_COMPLETE,
};

export const MARKETPLACE_TEMPLATE: TemplateMeta = {
  id: "marketplace",
  title: "Two-sided services marketplace",
  blurb:
    "Customers post jobs, vetted pros bid, secure escrow on delivery. Pay-for-completion (not pay-for-leads).",
  vertical: "Local services / consumer marketplace",
  stackChips: ["Next.js", "React Native", "Express", "Postgres", "Stripe Connect"],
  complianceChips: ["PCI SAQ-A", "SOC 2", "PIPEDA"],
  scaleChip: "Two-sided · 80K DAU · escrow + verification",
  payload,
};
