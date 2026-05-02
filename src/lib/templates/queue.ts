import type { Project } from "../schema";
import { ALL_COMPLETE, TemplateMeta } from "./types";

const payload: Partial<Project> = {
  name: "Virtual queue platform",
  oneLiner:
    "A real-time queue and appointment platform that lets customers hold their place from anywhere and arrive only when their turn is near — for clinics, banks, and restaurants.",
  ideaDescription:
    "We're building a B2B SaaS queue-management platform deployed across multi-location service providers (clinics, retail banks, restaurants, government service offices). Customers join a queue or book an appointment from a public web page, native mobile app, or in-branch kiosk; they receive live ETA updates and reminders, and arrive only when they're called. Operators get a staff console, analytics, and a per-tenant admin to configure services, hours, and policies (late-arrival, VIP, walk-in vs. booked merge).",
  problem: {
    problem:
      "Lobby waiting destroys customer satisfaction and limits revenue per square foot. Operators staff for the worst case to keep wait times bearable, and even then customers walk out.",
    audience:
      "Multi-location service businesses where customers wait for service: outpatient clinics, retail bank branches, casual restaurants, telecom stores, government service centres.",
    whyNow:
      "Mobile penetration is universal; SMS notifications are inexpensive; consumers expect retail-grade wait experiences from healthcare and government. Operators are short-staffed and need to optimize throughput without adding headcount.",
    successCriteria:
      "Reduce average perceived wait time by 40%; reduce walkaways by 30%; achieve 70%+ customer adoption of the digital queue option within 60 days at a launch site.",
    outOfScope:
      "Payments, scheduling for multi-resource appointments (e.g. doctor + room + equipment), integrations with EHRs in v1, full ticketing/CRM features.",
    businessCase:
      "Each branch loses ~8% of walk-ins to long waits. At average ticket of $35 and 200 customers/day, that's ~$200K/year of lost revenue per branch. The platform pays for itself at $499/branch/month after recovering 15 walkaways/month.",
    priority: "P1",
  },
  market: {
    buyer: "VP Operations or Regional Manager at a multi-location service business.",
    endUser: "Customers waiting for service — wide demographic, mobile-first.",
    operator: "Branch managers and front-desk staff running the queue day-to-day.",
    alternatives:
      "Paper tickets, pagers, walkup-only with hope. A few aging vendors (QLess, Waitwhile) and DIY in-house tools. Clinics often use EHR-bundled scheduling that's clinical-only.",
    differentiation:
      "Cross-vertical product with vertical-aware compliance packs; works across walk-in + booked + emergency in one fairness model; consumer-grade UX on the customer side.",
    marketSize:
      "~5,000 mid-market multi-location chains in NA with 5+ locations, plus public-sector service centres. SAM ~$1.5B/yr at average ACV of $30K.",
    pricing: "Per-location subscription, $499/mo Standard / $899/mo Pro.",
    geo: ["canada", "united-states"],
    vertical: "healthcare",
  },
  experience: {
    surfaces: ["public-website", "internal-console", "cross-platform-mobile", "kiosk"],
    authMode: "mixed",
    primaryDevice: "responsive",
    offline: false,
    localization: "en-CA, fr-CA, en-US, es-US",
    accessibility: "WCAG 2.2 AA",
    notifications: ["email", "sms", "push", "in-app"],
    timingModel: "both",
  },
  platform: {
    kinds: ["website", "mobile-app", "saas-platform", "admin-dashboard", "customer-portal", "internal-tool"],
    webMarketing: true,
    webPortal: true,
    webAdmin: true,
    webPwa: true,
    webEnterprise: false,
    mobileIOS: true,
    mobileAndroid: true,
    mobileFramework: "react-native",
    frontend: "nextjs",
    uiFramework: "shadcn/ui + Tailwind",
    stateMgmt: "Zustand",
    designSystem: "Stripe-inspired neutral",
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
    database: "postgres",
    dataShape: "structured",
    multiTenant: true,
    searchNeeded: false,
    realtimeNeeded: true,
    cloud: "aws",
    cicd: "GitHub Actions with protected production promotion",
    iac: "Terraform + AWS provider modules",
    observability: "OpenTelemetry + Datadog",
    containerization: "docker",
    envStrategy: "dev / stage / prod with ephemeral preview envs per PR",
    deploymentRuntime:
      "ECS Fargate for API and workers; AWS Lambda for lightweight webhooks and scheduled maintenance; optional EKS only for very large enterprise tenants.",
    cloudServices:
      "Amazon Aurora PostgreSQL, ElastiCache Redis, SQS, EventBridge, API Gateway/ALB, CloudFront, S3, KMS, Secrets Manager, WAF, SNS/Pinpoint for notification routing.",
    networking:
      "Multi-AZ VPC with public ALB/WAF, private app subnets, private database/cache subnets, VPC endpoints for AWS services, NAT gateway, Route 53 health checks.",
    scalingApproach:
      "Fargate autoscaling by CPU/RPS, worker scaling by SQS queue depth, Aurora read replicas for analytics reads, Redis hot queue state per branch, per-tenant rate limits during surges.",
    cicdDetails:
      "PR checks run queue state-machine tests, contract tests, notification sandbox tests, and tenant-isolation tests; prod deploy requires migration plan and rollback approval.",
    iacDetails:
      "Terraform owns VPC, ECS services, Aurora, Redis, SQS/EventBridge, WAF, KMS, IAM, CloudWatch alarms, and per-environment workspaces.",
    enterpriseControls:
      "KMS encryption, Secrets Manager rotation, WAF/bot rules, tenant-scoped audit logs, PHI-safe notification templates, SIEM export, least-privilege IAM roles.",
  },
  functional: {
    personas: [
      { id: "p1", name: "Patient / Customer", jtbd: "Hold my place from anywhere and arrive only when it's nearly my turn.", pains: "Long lobby waits, no visibility into ETA, fear of losing my spot if I leave.", channel: "any" },
      { id: "p2", name: "Front-desk staff", jtbd: "Run a calm queue; call the next person; handle no-shows and walk-ins fairly.", pains: "Yelling names; messy paper lists; angry customers when ETAs slip.", channel: "internal-console" },
      { id: "p3", name: "Branch manager", jtbd: "See live load, staff to demand, and act on bottlenecks.", pains: "No visibility across branches; can't reason about staffing without data.", channel: "internal-console" },
      { id: "p4", name: "Regional admin", jtbd: "Roll out the platform across locations; maintain consistent policies; report up.", pains: "Per-branch config drift; no consolidated reporting.", channel: "internal-console" },
    ],
    requirements: [
      { id: "FR-001", kind: "functional", title: "Customer joins queue from web", description: "Public web page lets a customer pick a service and join a queue with name + phone (or sign-in).", acceptance: "Customer receives a queue number and ETA within 2 seconds of submission. Confirmation sent via chosen notification channel.", priority: "must" },
      { id: "FR-002", kind: "functional", title: "Customer joins queue from mobile app", description: "Cross-platform app supports queue join, live ETA, and reminders.", acceptance: "Push notification fires when ETA falls below configured threshold (default 10 min). Position updates within 5 seconds of staff actions.", priority: "must" },
      { id: "FR-003", kind: "functional", title: "Estimated wait time", description: "Live ETA displayed on customer surfaces, recomputed continuously based on call rates and service durations.", acceptance: "ETA accuracy within ±20% on the median; surfaces a confidence band, not just a single number.", priority: "must" },
      { id: "FR-004", kind: "functional", title: "Real-time staff console", description: "Per-station view with calls, holds, transfers, notes; updates live across all stations.", acceptance: "All staff see the same queue state within 1 second; conflicts on simultaneous calls resolved deterministically.", priority: "must" },
      { id: "FR-005", kind: "functional", title: "Late-arrival policy", description: "Configurable rules: skip after N minutes, requeue at end, or hold open with notify.", acceptance: "Operator can set policy per service; system enforces it without staff manual action.", priority: "should" },
      { id: "FR-006", kind: "functional", title: "Walk-in vs. booked merge", description: "Single fairness algorithm interleaves walk-ins and pre-booked customers based on configurable weights.", acceptance: "Operator can preview the merged ordering; algorithm respects appointment windows ±5 minutes.", priority: "should" },
      { id: "FR-007", kind: "functional", title: "Multi-location admin", description: "Tenant admin manages many locations, services, hours, and policies from one console.", acceptance: "Changes propagate to all locations within 30 seconds; audit log of every change.", priority: "must" },
      { id: "FR-008", kind: "functional", title: "Analytics dashboard", description: "Volume, ETA accuracy, abandonment, NPS, by location and time-of-day.", acceptance: "Daily roll-ups available within 1 hour of day end; CSV export of every chart.", priority: "should" },
      { id: "NFR-001", kind: "nonfunctional", title: "ETA broadcast latency", description: "Position changes must propagate to all clients within 1 second p95.", acceptance: "Synthetic load test sustains 1s p95 at 5K concurrent customers / branch.", priority: "must" },
      { id: "NFR-002", kind: "nonfunctional", title: "PHI handling for healthcare tenants", description: "Tenant-level isolation between PHI and queue tokens; no PHI in notification content.", acceptance: "Pen test confirms PHI is not exposed via queue tokens; reminders contain only branded notification text.", priority: "must" },
      { id: "NFR-003", kind: "nonfunctional", title: "Availability target", description: "99.9% measured per tenant per surface (customer + staff).", acceptance: "Error budget burn alerts; quarterly attainment reports per tenant.", priority: "must" },
    ],
    features: [
      { id: "FEAT-001", name: "User registration & login", description: "Account creation, social/SSO login, password reset, session.", userStory: "As a customer, I can sign up and sign in to track my visits.", acceptance: "Signup → first queue join within 90 seconds median.", priority: "must", complexity: "M", businessValue: "high", dependencies: "Identity provider (Auth0)", apisNeeded: "/auth/*", dataNeeded: "User", edgeCases: "Phone-only no-email signup; SSO from operator org", errorStates: "Rate limit on OTP; lockout after 5 failed attempts", adminControls: "Force-reset, suspend", audit: "Auth events to audit log", security: "OWASP ASVS L2 controls", futureEnhancements: "Passkeys", release: "mvp" },
      { id: "FEAT-002", name: "Business / location registration", description: "Multi-location org with branches, hours, services, and operators.", userStory: "As a regional admin, I register branches so customers can pick one.", acceptance: "Onboarding wizard creates an org + first branch in <10 min.", priority: "must", complexity: "L", businessValue: "high", dependencies: "Stripe billing", apisNeeded: "/orgs/*, /branches/*", dataNeeded: "Org, Branch, Service, Hours", edgeCases: "Time-zone differences across branches; seasonal hours", errorStates: "Duplicate org name; invalid postal code", adminControls: "Branch enable/disable", audit: "All branch CRUD logged", security: "RBAC: org-admin only", futureEnhancements: "Bulk-import branches via CSV", release: "mvp" },
      { id: "FEAT-003", name: "Customer joins queue", description: "Take-a-number from web, mobile, or kiosk; service selection.", userStory: "As a customer, I take a number remotely so I don't wait in person.", acceptance: "Confirmation in <2s; notification preference captured.", priority: "must", complexity: "M", businessValue: "high", dependencies: "Notifications", apisNeeded: "POST /queue/join", dataNeeded: "Ticket, Customer", edgeCases: "Already in another queue; queue full; branch closed", errorStates: "Show wait if no slots; allow notify-when-open", adminControls: "Suspend joins per service", audit: "Every join logged", security: "Rate-limit by phone+IP", futureEnhancements: "Multi-service bundle", release: "mvp" },
      { id: "FEAT-004", name: "Estimated wait time", description: "Live ETA shown to customers, recomputed as queue advances.", userStory: "As a customer, I see how long until my turn.", acceptance: "Median ±20% accuracy; updates every 30s.", priority: "must", complexity: "L", businessValue: "high", dependencies: "Service-time history per branch", apisNeeded: "GET /queue/eta", dataNeeded: "ServiceTimeStats", edgeCases: "Cold-start branch with no history; staff break", errorStates: "Show \"updating\" rather than incorrect ETA", adminControls: "Configure rolling window for service-time stats", audit: "ETA snapshot per call event", security: "Public-readable for queue's own ticket ID only", futureEnhancements: "Per-customer ETA bands using ML", release: "mvp" },
      { id: "FEAT-005", name: "Real-time queue status", description: "Live status with position updates on customer + staff sides.", userStory: "As a staff member, I see live queue state to route customers.", acceptance: "Sub-second propagation across all stations.", priority: "must", complexity: "L", businessValue: "high", dependencies: "WebSocket fan-out", apisNeeded: "WS /queue/stream", dataNeeded: "Ticket, Station", edgeCases: "Disconnected staff station; reconnection re-syncs state", errorStates: "Staff console shows last-known with stale indicator", adminControls: "Force-refresh", audit: "Every state transition logged", security: "WS auth via short-lived JWT", futureEnhancements: "Optimistic updates with conflict resolution", release: "mvp" },
      { id: "FEAT-006", name: "Notifications & reminders", description: "Email/SMS/push when turn is near, plus arrival reminders.", userStory: "As a customer, I'm reminded when my turn approaches.", acceptance: "Notification fires within 5s of trigger condition.", priority: "must", complexity: "M", businessValue: "high", dependencies: "Twilio + SendGrid + APNs/FCM", apisNeeded: "/notifications/*", dataNeeded: "NotificationPreference", edgeCases: "User opted out; provider down — fall back to next channel", errorStates: "Show last-sent in customer view", adminControls: "Per-template editing with preview", audit: "Every send logged with provider receipt", security: "PII redacted in dev/stage logs", futureEnhancements: "WhatsApp/RCS", release: "mvp" },
      { id: "FEAT-007", name: "Cancel / reschedule", description: "Customer cancels or picks a new slot before arrival.", userStory: "As a customer, I cancel or move my slot if plans change.", acceptance: "Cancel completes in <2s; rebook UI shows next 5 slots.", priority: "should", complexity: "S", businessValue: "medium", dependencies: "—", apisNeeded: "POST /queue/cancel", dataNeeded: "Ticket", edgeCases: "Cancel after called; cancel within 5min of slot", errorStates: "\"Already called\" message", adminControls: "Late-cancel policy config", audit: "Cancel event logged", security: "Owner-only", futureEnhancements: "Smart suggestion of next-best slot", release: "mvp" },
      { id: "FEAT-008", name: "Walk-in vs. booked merge", description: "Fairness algorithm for walk-ins and bookings.", userStory: "As an operator, I run one merged queue without favouring channels.", acceptance: "Operator can simulate merge before applying.", priority: "should", complexity: "L", businessValue: "high", dependencies: "—", apisNeeded: "GET /queue/merged-preview", dataNeeded: "Ticket type discriminator", edgeCases: "VIP override; emergency insertion", errorStates: "Show conflict diff if rules disagree", adminControls: "Per-service weight tuning", audit: "Algorithm decision trace stored 30 days", security: "Operator-only", futureEnhancements: "Self-tuning weights based on outcomes", release: "v1" },
      { id: "FEAT-009", name: "Late-arrival policy", description: "Configurable rules: skip / requeue / hold.", userStory: "As an operator, I enforce a late policy automatically.", acceptance: "Policy applied without staff manual action.", priority: "should", complexity: "M", businessValue: "medium", dependencies: "—", apisNeeded: "—", dataNeeded: "PolicyConfig", edgeCases: "Customer arrives mid-skip", errorStates: "Show \"reslotted\" status to customer", adminControls: "Override per ticket", audit: "Policy enforcement events", security: "Operator-only", futureEnhancements: "Predict no-show probability and pre-skip", release: "v1" },
      { id: "FEAT-010", name: "Staff dashboard", description: "Per-station view with calls, holds, transfers, notes.", userStory: "As a staff member, I work the queue from one screen.", acceptance: "Single-screen workflow for the 80% case.", priority: "must", complexity: "L", businessValue: "high", dependencies: "WebSocket", apisNeeded: "—", dataNeeded: "Station, Note", edgeCases: "Station logout mid-call", errorStates: "Last-state cached", adminControls: "Station-claim overrides", audit: "All actions logged", security: "Operator-only; station-scoped", futureEnhancements: "Voice-call assist", release: "mvp" },
      { id: "FEAT-011", name: "Analytics dashboard", description: "Volume, ETA accuracy, abandonment, NPS, by branch and time.", userStory: "As a manager, I see metrics that drive staffing decisions.", acceptance: "Day-of metrics; weekly roll-ups; CSV export.", priority: "should", complexity: "L", businessValue: "high", dependencies: "Data warehouse", apisNeeded: "—", dataNeeded: "Aggregates", edgeCases: "Branch with no traffic", errorStates: "Empty-state with onboarding hint", adminControls: "Custom dashboards (v2)", audit: "Read access logged", security: "RBAC by branch", futureEnhancements: "Forecasting + scheduling suggestions", release: "v1" },
      { id: "FEAT-012", name: "Multi-location admin", description: "Per-location settings; bulk policy changes.", userStory: "As a regional admin, I manage many branches under one account.", acceptance: "Bulk update propagates in <30s with audit.", priority: "must", complexity: "L", businessValue: "high", dependencies: "—", apisNeeded: "—", dataNeeded: "Org, Branch, Policy", edgeCases: "Branch in maintenance mode", errorStates: "Show partial success on bulk", adminControls: "Approval workflow for bulk changes (v2)", audit: "Every change diffed", security: "Org-admin only", futureEnhancements: "Branch-grouping by region", release: "mvp" },
      { id: "FEAT-013", name: "Feedback & rating", description: "Post-visit rating with optional comment, gated to actual visits.", userStory: "As a customer, I rate my experience after my visit.", acceptance: "Rating prompt fires within 1h of completion.", priority: "should", complexity: "S", businessValue: "medium", dependencies: "Notifications", apisNeeded: "POST /feedback", dataNeeded: "Feedback", edgeCases: "Multiple visits same day", errorStates: "Rating already submitted", adminControls: "Hide spam", audit: "—", security: "One rating per ticket", futureEnhancements: "Sentiment analysis", release: "v1" },
      { id: "FEAT-014", name: "Kiosk mode", description: "Self-serve in-branch screen with idle timeout and PIN reset.", userStory: "As a walk-in, I take a number from the kiosk.", acceptance: "Kiosk screen never exposes another customer's data.", priority: "could", complexity: "M", businessValue: "medium", dependencies: "PWA install", apisNeeded: "—", dataNeeded: "Kiosk", edgeCases: "Tablet offline; print receipt fail", errorStates: "Offline mode shows \"please see staff\"", adminControls: "Kiosk PIN rotation", audit: "Kiosk events logged", security: "Auto-wipe after 30s idle", futureEnhancements: "QR-to-app handoff", release: "v1" },
      { id: "FEAT-015", name: "Audit logging", description: "Append-only log of sensitive actions.", userStory: "As a compliance owner, I review who did what and when.", acceptance: "Logs retained 7 years for healthcare tenants.", priority: "must", complexity: "M", businessValue: "high", dependencies: "—", apisNeeded: "GET /audit", dataNeeded: "AuditEvent", edgeCases: "—", errorStates: "—", adminControls: "Search/export", audit: "—", security: "Tamper-evident; immutable storage", futureEnhancements: "Streaming export to SIEM", release: "mvp" },
    ],
    kpis: [
      { id: "KPI-001", name: "Adoption", definition: "% of customers who use digital queue vs. walk-in only", target: ">= 70% within 60 days at a launch site", cadence: "weekly" },
      { id: "KPI-002", name: "ETA accuracy", definition: "% of completed visits where actual wait was within ±20% of last shown ETA", target: ">= 80%", cadence: "daily" },
      { id: "KPI-003", name: "Abandonment", definition: "% of joined customers who left without being served", target: "<= 5%", cadence: "daily" },
      { id: "KPI-004", name: "NPS", definition: "Customer NPS via post-visit survey", target: ">= 40", cadence: "monthly" },
    ],
    businessRules:
      "VIP/urgent customers are flagged at join and surfaced for staff attention but never silently jumped without operator approval. Walk-ins and booked customers share one fairness algorithm, weighted per policy. Late arrivals are reslotted automatically per the configured policy, never silently skipped without notification.",
    edgeCases:
      "Inaccurate wait estimates degrading user trust; multiple service desks with unequal service times; customers arriving much earlier or later than predicted; branch outages or unscheduled closures; staff overrides; family or group bookings; cancellations and duplicate queue entries; PHI segregation between queue tokens and clinical identifiers; users without an app or with intermittent connectivity; accessibility accommodations; multilingual flows.",
  },
  nonfunctional: {
    availabilityTarget: "99.9% per tenant per surface",
    rto: "1 hour",
    rpo: "5 minutes",
    performance: "p95 < 500ms read paths; p95 < 1s ETA broadcast; p99 < 2s queue join",
    privacyPosture:
      "PHI/PII tokenized at the queue layer; no clinical data in queue tokens; per-tenant encryption keys; reminder content branded only.",
    auditability:
      "Every queue state transition, every operator action, every admin change captured in append-only audit log retained 7 years for healthcare tenants.",
    costBoundary: "Target gross margin > 75% at $499/branch/month.",
    supportModel: "Email support 9-5 ET; emergency on-call for P1 outages; phone for Pro tier.",
    slos: [
      { id: "SLO-001", surface: "Customer queue join", metric: "p95 latency", target: "< 1 second" },
      { id: "SLO-002", surface: "ETA broadcast", metric: "p95 latency", target: "< 1 second from event to client" },
      { id: "SLO-003", surface: "Staff console", metric: "p95 action-to-ack latency", target: "< 500ms" },
      { id: "SLO-004", surface: "Notification dispatch", metric: "delivery within 30s of trigger", target: ">= 99% per channel" },
      { id: "SLO-005", surface: "All write APIs", metric: "error rate (5xx)", target: "< 0.1%" },
    ],
  },
  dataTech: {
    entities: [
      { id: "ENT-001", name: "Org", description: "Top-level tenant — a customer org with one or many branches.", sensitive: false, retention: "Indefinite while active; 3 years post-cancellation" },
      { id: "ENT-002", name: "Branch", description: "A physical location with hours, services, and stations.", sensitive: false, retention: "Indefinite while active" },
      { id: "ENT-003", name: "Customer", description: "End user joining a queue. Contains contact info and (optionally) PHI markers per tenant.", sensitive: true, retention: "Per tenant — 7 years for healthcare; 2 years otherwise" },
      { id: "ENT-004", name: "Ticket", description: "A queue/appointment instance with status, position, ETA, and audit trail.", sensitive: true, retention: "7 years for healthcare; 2 years otherwise" },
      { id: "ENT-005", name: "Service", description: "A type of service offered at a branch (e.g. \"Doctor visit\", \"Account opening\").", sensitive: false, retention: "Indefinite" },
      { id: "ENT-006", name: "Station", description: "A staff workstation handling tickets.", sensitive: false, retention: "Indefinite while active" },
      { id: "ENT-007", name: "AuditEvent", description: "Append-only record of state transitions and admin actions.", sensitive: true, retention: "7 years" },
    ],
    integrations: [
      { id: "INT-001", system: "Twilio", direction: "outbound", protocol: "REST + Webhooks", dataClass: "PII (phone)", notes: "SMS notifications and provider delivery receipts." },
      { id: "INT-002", system: "SendGrid", direction: "outbound", protocol: "REST", dataClass: "PII (email)", notes: "Transactional email." },
      { id: "INT-003", system: "Auth0", direction: "bidirectional", protocol: "OIDC", dataClass: "PII", notes: "Tenant-scoped identity. Operator org SSO supported." },
      { id: "INT-004", system: "Stripe", direction: "outbound", protocol: "REST", dataClass: "Billing (tokenized)", notes: "Subscription billing per branch." },
      { id: "INT-005", system: "Datadog", direction: "outbound", protocol: "OTLP/HTTPS", dataClass: "Metrics + traces", notes: "Observability; PII scrubbed at exporter." },
    ],
    dataResidency: "ca-central-1 for Canadian tenants; us-east-1 for US tenants. Cross-region replication only for explicit DR pairs.",
    buildVsBuy:
      "Buy: identity (Auth0), notifications (Twilio + SendGrid), billing (Stripe), observability (Datadog). Build: queue engine, fairness algorithm, multi-tenant admin, analytics roll-ups.",
  },
  systemDesign: {
    architecturePattern: "event-driven",
    authArchitecture: "enterprise-sso",
    deploymentTopology: "active-passive",
    tradeoffAreas: ["identity-auth", "authorization-tenancy", "schema-design-lld", "async-events", "realtime-notifications", "deployment-infra", "testing-release"],
    securityReviewAreas: ["identity", "authorization", "data-protection", "privacy", "secrets", "api-abuse", "audit", "incident-response"],
    highLevelArchitectureNotes:
      "CloudFront/WAF fronts customer web, mobile APIs, staff console, and kiosk surfaces. ECS Fargate hosts FastAPI services and workers. Aurora Postgres is the transactional source of truth; Redis holds hot per-branch queue state; SQS/EventBridge handles notifications, analytics, archival, and integration events.",
    lowLevelArchitectureNotes:
      "Modules: Org, Branch, Service, Queue, Ticket, Appointment, ETA, Notification, Policy, Audit, Analytics. Queue writes are transactional; events publish through outbox. Staff console reads hot branch state from Redis with database reconciliation.",
    domainModelNotes:
      "Org owns branches, services, hours, policies, operators, and billing. Branch owns queue state, stations, and daily service windows. Ticket is the aggregate for queue/appointment lifecycle and references Customer, Service, ETA snapshots, and AuditEvent.",
    schemaDesignNotes:
      "Postgres tables: orgs, branches, services, operators, customers, tickets, ticket_events, appointments, station_sessions, notification_preferences, notification_attempts, policies, audit_events. Partition tickets and audit_events by tenant and month; unique active ticket per customer/service/branch.",
    dataLifecycleNotes:
      "Healthcare tenants retain tickets and audit events for 7 years; non-healthcare default is 2 years. Redis state is reconstructable from ticket_events. Old audit partitions archive to S3 with Glacier lifecycle and Athena query access.",
    apiContractNotes:
      "REST/OpenAPI contracts for queue join, ticket state changes, staff actions, admin policy changes, and notification callbacks. All write APIs use idempotency keys; WebSocket streams require short-lived JWT and resume cursor.",
    serviceBoundaryNotes:
      "Queue module owns Ticket transitions and fairness rules. ETA module computes predictions from service-time stats. Notification module owns channel preferences and provider calls. Policy module owns late-arrival and merge rules. Audit module records immutable state changes.",
    workflowStateNotes:
      "Ticket: draft -> waiting -> called -> serving -> completed/cancelled/no_show/reslotted. Appointment: booked -> checked_in -> merged -> served/no_show. NotificationAttempt: queued -> sent -> delivered/failed -> retried/dead_letter.",
    integrationContractNotes:
      "Twilio/SendGrid provider calls use retry budgets and delivery webhooks. Auth0/SSO group sync uses SCIM. Stripe billing webhooks are idempotent and replayable. Provider outage degrades to in-app notifications and operator warnings.",
    securityArchitectureNotes:
      "Tenant/branch-scoped RBAC, signed ticket IDs, no PHI in SMS/email bodies, KMS encryption, tenant-scoped Redis keys, audit for every operator action, WAF/rate limits on public join endpoints.",
    observabilityDesignNotes:
      "Traces carry tenant, branch, ticket, and station IDs. Dashboards cover queue join latency, ETA broadcast latency, WebSocket fan-out, notification delivery, SQS depth, Redis hit rate, and branch-level SLO burn.",
    infraArchitectureNotes:
      "Terraform-managed AWS VPC, ECS Fargate, Aurora Multi-AZ, ElastiCache, SQS, EventBridge, CloudFront/WAF, S3 archival, KMS, Secrets Manager, Route 53, and Datadog monitors. Active/passive DR starts with backup restore drills.",
    testArchitectureNotes:
      "State-machine tests for Ticket and Appointment, concurrency tests for simultaneous staff actions, tenant-isolation negative tests, notification sandbox contract tests, load tests for 5K concurrent users per branch, and WebSocket reconnect/resume tests.",
    expectedUsersTotal: 5_000_000,
    dau: 200_000,
    mau: 1_500_000,
    peakConcurrent: 8_000,
    avgRequestsPerUserPerDay: 30,
    readWriteRatio: "85:15",
    dataGrowthGBPerMonth: 200,
    notificationsPerDay: 800_000,
    availabilityTarget: "99.9%",
    latencyTargetMs: 500,
    geographicCoverage: "Canada + US (split by tenant data residency)",
    multiRegion: false,
    drNeeded: true,
    cachingStrategy:
      "CDN edge for static + public ETA endpoints; Redis for hot per-branch queue state with 5-second TTL; query-result cache for analytics aggregates.",
    dbScalingStrategy:
      "Postgres primary + read replicas; partition Ticket and AuditEvent by tenant; archive AuditEvent older than 1 year to S3 + Athena. Avoid sharding until single-tenant pressure forces it.",
    queueStrategy:
      "SQS for jobs (notifications, archival); EventBridge for cross-service events; WebSocket fan-out via Redis pub/sub for sub-second client updates.",
    notes:
      "Most write traffic is queue state; we cap WS broadcast traffic per branch and degrade ETA refresh frequency at sustained 5x peak load.",
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
    notes:
      "AI is not in scope for v1. v2 candidates: per-customer ETA bands using ML; staffing forecasts; no-show probability prediction.",
  },
  compliance: {
    processesPersonalData: true,
    processesFinancialData: false,
    processesHealthData: true,
    frameworks: ["PIPEDA", "PHIPA", "HIPAA", "SOC2", "OWASP-ASVS"],
    consentMgmt: true,
    auditLogs: true,
    encryptionAtRest: true,
    encryptionInTransit: true,
    rbacRequired: true,
    dataResidencyRequired: true,
    incidentResponseRequired: true,
    pentestCadence: "annual + per-major-release",
    threatModel:
      "Top threats: PHI exposure via misrouted notification, tenant-cross-talk via shared cache keys, ticket forgery for queue jumping. Mitigations: tenant-scoped Redis keys, signed ticket IDs, redacted notification payloads, per-tenant audit log review monthly.",
  },
  gtm: {
    packaging: "saas",
    segments: "Multi-location service businesses with 5+ branches: clinics, retail banks, casual restaurants, government service centres.",
    buyerObjections:
      "We already have an EHR/POS that schedules; staff won't use a new tool; SMS costs add up; lock-in.",
    salesMotion: "Outbound + design-partner pilots in Y1; channel partnerships and PLG additions in Y2.",
    channelStrategy: "Direct in Y1; partner with EHR vendors and bank service-software resellers in Y2.",
    launchGeography: "Canada first (Ontario + BC); US northeast in Q3.",
    complianceGating:
      "PIPEDA + Ontario PHIPA cleared before any healthcare tenant in Canada. HIPAA + BAA with all subprocessors before any US healthcare tenant. SOC 2 Type 1 in Y1, Type 2 in Y2.",
    pricingModel: "Per-location subscription. Standard $499/mo, Pro $899/mo (analytics + multi-location admin).",
    acquisitionChannels: "Outbound to ops leaders; conference presence (HFMA, Future Branches); referral from design partners.",
    retentionStrategy: "QBRs with regional admins; usage-based health scores; vertical-specific best-practice playbooks.",
    partnerships: "EHR integrators; bank operations consultancies; government modernization partners.",
    competitors: "QLess, Waitwhile, JRNI; in-house DIY; bundled EHR scheduling for clinical-only.",
    positioning:
      "For multi-location service businesses where customers wait for service, our queue platform gives consumer-grade waiting experiences across walk-in + booked + emergency in one fairness model — without the EHR-bundled clinical-only constraint.",
    marketingKpis: "Pipeline created / quarter; design-partner conversion to paid; gross retention 95%+.",
  },
  governance: {
    owner: "VP Product",
    approvers: "VP Eng, Head of Privacy, GC (for healthcare tenant onboarding)",
    dependencies:
      "Twilio + SendGrid contracts; Auth0 enterprise; Stripe Atlas; Datadog enterprise; AWS commit deal.",
    thirdParties: "Twilio, SendGrid, Auth0, Stripe, Datadog, AWS.",
    legalReviews:
      "BAAs with US healthcare tenants; PHIPA agreements with Ontario tenants; data processing addenda for all subprocessors.",
    procurementReviews:
      "Datadog + Auth0 enterprise tier sign-off; AWS spend commit; subprocessor list reviewed quarterly.",
    unvalidatedAssumptions:
      "Tenants will accept SMS as a primary channel even with cost overrun risk; ETA accuracy will be acceptable to clinical operations users from day 1.",
    decisionConfidence: "high",
  },
  stakeholders: [
    { id: "s1", role: "VP Product", name: "Project owner", responsibility: "Roadmap, scope, approvals" },
    { id: "s2", role: "VP Engineering", responsibility: "Technical strategy, hiring, on-call" },
    { id: "s3", role: "Head of Privacy", responsibility: "PHIPA/HIPAA/PIPEDA compliance posture" },
    { id: "s4", role: "Lead Designer", responsibility: "Customer + staff console UX" },
    { id: "s5", role: "Head of Customer Success", responsibility: "Pilot success criteria; feedback loop into product" },
  ],
  decisions: [
    { id: "ADR-001", title: "Use WebSockets (not polling) for live queue state", context: "Queue state changes ~1/min per branch but propagation latency is the user-perceived metric.", decision: "WebSocket fan-out via Redis pub/sub for both customer and staff surfaces.", alternatives: "Long polling at 5s; SSE; periodic REST refresh.", consequences: "Sub-second propagation; harder reconnect logic; WS infra to operate.", status: "accepted", confidence: "high" },
    { id: "ADR-002", title: "Postgres primary, no early sharding", context: "Multi-tenant SaaS at modest scale.", decision: "Single Postgres primary + read replicas; partition Ticket + AuditEvent by tenant; revisit at $1M ARR or 50K DAU.", alternatives: "Citus; per-tenant DB; DynamoDB.", consequences: "Simpler ops; reaches scale ceiling around 1M DAU without rework.", status: "accepted", confidence: "high" },
    { id: "ADR-003", title: "Twilio + SendGrid (not in-house notifications)", context: "Notification delivery is a critical path with cost implications.", decision: "Buy Twilio (SMS) + SendGrid (email); APNs/FCM directly for push.", alternatives: "AWS SNS for SMS + SES for email; in-house provider relationships.", consequences: "Higher per-unit cost than AWS-direct; dramatically less ops cost; better deliverability and provider features.", status: "accepted", confidence: "high" },
    { id: "ADR-004", title: "Per-tenant data residency, not multi-region active-active", context: "Healthcare data residency requirements vs. complexity.", decision: "Tenants are pinned to a region (ca-central-1 or us-east-1). Cross-region replication only for explicit DR pairs.", alternatives: "Active-active multi-region; DynamoDB Global Tables.", consequences: "Simpler model; operator UX is region-aware; failover is RTO-bounded not zero.", status: "accepted", confidence: "medium" },
  ],
  risks: [
    { id: "RISK-001", description: "Inaccurate ETAs erode trust; customers go back to walking in.", likelihood: "medium", impact: "high", mitigation: "Per-branch service-time stats with confidence bands; show range not single number; iterate on the algorithm with design-partner feedback." },
    { id: "RISK-002", description: "PHI leakage via notification content or shared cache keys.", likelihood: "low", impact: "high", mitigation: "Branded-only notification payloads; tenant-scoped Redis keys; per-tenant encryption keys; quarterly pen test." },
    { id: "RISK-003", description: "SMS cost exceeds margin assumption at scale.", likelihood: "medium", impact: "medium", mitigation: "Channel preference order (push > email > SMS); per-tenant SMS budget caps with alerts." },
    { id: "RISK-004", description: "Vendor lock-in with Twilio/SendGrid.", likelihood: "medium", impact: "low", mitigation: "Wrap providers behind a single notification interface; smoke-test alternates quarterly." },
  ],
  assumptions: [
    { id: "ASM-001", text: "Customers will adopt digital queues within 60 days when staff promote them.", validated: false },
    { id: "ASM-002", text: "ETA accuracy of ±20% on the median is acceptable for clinical operations users.", validated: false },
    { id: "ASM-003", text: "Per-branch pricing is the right unit; chains will not push for per-customer pricing.", validated: true },
    { id: "ASM-004", text: "Pilot tenants will sign a BAA in <30 days when the platform is HIPAA-ready.", validated: false },
  ],
  openQuestions: [
    { id: "Q-001", text: "Do we ship a kiosk app from day 1 or rely on PWA install?", owner: "Lead Designer" },
    { id: "Q-002", text: "What's our policy when SMS provider has a regional outage — fall back to email-only or pause notifications?", owner: "VP Engineering" },
    { id: "Q-003", text: "How aggressive are we on no-show prediction in v2?", owner: "VP Product" },
  ],
  progress: ALL_COMPLETE,
};

export const QUEUE_TEMPLATE: TemplateMeta = {
  id: "queue",
  title: "Virtual queue platform",
  blurb:
    "Real-time queue + appointments for clinics, banks, and restaurants. Live ETA, walk-in vs. booked merge, multi-location admin.",
  vertical: "Healthcare / Financial / Retail",
  stackChips: ["Next.js", "FastAPI", "Postgres", "Redis", "AWS"],
  complianceChips: ["HIPAA", "PHIPA", "PIPEDA", "SOC 2"],
  scaleChip: "B2B SaaS · 200K DAU peak · multi-location",
  payload,
};
