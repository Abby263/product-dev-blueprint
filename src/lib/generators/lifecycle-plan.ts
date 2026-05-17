import { Project, defaultLifecycleReadiness } from "../schema";
import { fallback, header } from "./util";

function lifecycle(project: Project) {
  return project.lifecycle ?? defaultLifecycleReadiness();
}

function cloudGuidance(project: Project): string {
  if (project.platform.cloud === "gcp") {
    return [
      `- **Runtime:** Cloud Run for the API/web backend and scheduled/background jobs where possible.`,
      `- **Operational data:** Firestore for low-friction app state and feedback records when relational joins are not central.`,
      `- **Analytics:** BigQuery as the warehouse for event, feedback, funnel, and response-time analysis.`,
      `- **Dashboards:** Looker or Looker Studio for operational and growth dashboards.`,
      `- **Observability:** Cloud Logging, Cloud Monitoring, Error Reporting, and trace correlation from request to analytics event.`,
      `- **Identity and access:** dedicated service accounts per deployable, least-privilege IAM, no broad owner/editor runtime roles.`,
      `- **AI coding/deploy path:** Claude on Google Cloud / Vertex AI where enterprise policy requires project-scoped credentials and regional model access.`,
    ].join("\n");
  }

  return [
    `- **Runtime:** use the selected cloud runtime in the architecture blueprint: ${fallback(project.platform.deploymentRuntime || project.platform.cloud)}.`,
    `- **Operational data:** use the selected primary store: ${project.platform.database}.`,
    `- **Analytics:** define a warehouse or reporting store for product feedback and usage telemetry.`,
    `- **Dashboards:** define a PM/growth dashboard owner and review cadence before launch.`,
    `- **Identity and access:** use least-privilege runtime identities, scoped service accounts, and audited admin access.`,
    `- **AI coding/deploy path:** use the provider-specific docs, MCP servers, and skills approved by the engineering platform team.`,
  ].join("\n");
}

export function generateLifecyclePlan(project: Project): string {
  const v = lifecycle(project);

  return [
    header(project, `Lifecycle execution plan — ${project.name || "Untitled"}`, "Lifecycle execution plan"),
    `## 1. Persona handoff map`,
    ``,
    `| Persona | Responsibilities before build | Current plan |`,
    `|---|---|---|`,
    `| Product Manager | Idea framing, success metrics, MVP boundaries, acceptance gates, and feedback loop ownership. | ${fallback(v.productManagerPlan)} |`,
    `| UX Designer | Wireframe/prototype, design-system alignment, responsive states, accessibility, and developer handoff. | ${fallback(v.uxDesignerPlan)} |`,
    `| Software Engineer | Repo structure, implementation slices, API/data contracts, tests, CI, and coding-agent execution. | ${fallback(v.softwareEngineerPlan)} |`,
    `| Security Engineer | Threat model, IAM/service accounts, OWASP checks, secrets, audit, and deployment approval. | ${fallback(v.securityEngineerPlan)} |`,
    `| Data / Growth Analyst | Event taxonomy, warehouse/dashboard plan, feedback analysis, and PM improvement cadence. | ${fallback(v.dataGrowthPlan)} |`,
    ``,
    `## 2. Prototype and UX handoff`,
    ``,
    `- **Prototype source.** ${fallback(v.prototypeSource, "No sketch, Figma, screenshot, or design doc captured yet.")}`,
    `- **UX handoff notes.** ${fallback(v.uxHandoffNotes, "No UX handoff notes captured yet.")}`,
    `- **Minimum handoff expectation.** Include responsive states, accessibility states, empty/error/loading states, and component naming before coding agents implement UI.`,
    ``,
    `## 3. Cloud deployment path`,
    ``,
    `- **Target.** ${fallback(v.cloudDeploymentTarget || project.platform.deploymentRuntime || project.platform.cloud)}`,
    `- **Managed services.** ${fallback(v.managedServices || project.platform.cloudServices)}`,
    ``,
    cloudGuidance(project),
    ``,
    `## 4. MCP, documentation, skills, and subagents`,
    ``,
    `- **MCP / documentation sources.** ${fallback(v.mcpDocumentationSources, "Add fresh cloud docs, provider API docs, design docs, and analytics docs before implementation.")}`,
    `- **Skills and subagents.** ${fallback(v.skillsAndSubagentsPlan, "Use specialized agents for API/backend, ingestion/analytics, dashboard/UI, security review, and deployment where the work can be split safely.")}`,
    ``,
    `Recommended implementation split:`,
    ``,
    `| Workstream | Suggested agent/skill | Output |`,
    `|---|---|---|`,
    `| UX implementation | UI/design-system skill | Screens, states, accessibility checks, screenshots. |`,
    `| API/backend | Cloud runtime or backend skill | API routes, validation, persistence, integration tests. |`,
    `| Analytics | Warehouse/dashboard skill | Event schema, ingestion path, dashboard queries. |`,
    `| Security review | Security reviewer subagent | Findings, fixes, and deployment approval evidence. |`,
    `| Deployment | Cloud deploy skill | Runtime config, service identity, env vars, rollout notes. |`,
    ``,
    `## 5. Security review and deployment gate`,
    ``,
    `- **Security checklist.** ${fallback(v.securityReviewChecklist, "Minimum: OWASP web/API review, IAM/service-account least privilege, secrets review, rate limiting, audit logging, and data classification.")}`,
    `- **Deployment approval gate.** ${fallback(v.deploymentApprovalGate, "Deploy only after CI, build, tests, security review, rollback plan, and production-owner approval pass.")}`,
    ``,
    `## 6. Analytics feedback loop`,
    ``,
    `- **Feedback loop.** ${fallback(v.analyticsFeedbackLoop, "Capture product events, response times, user feedback, and conversion/retention signals; review weekly with PM and data/growth owner.")}`,
    `- **PM feedback cadence.** The dashboard should produce decisions: improve UX, change scope, tune onboarding, fix reliability, or adjust positioning.`,
    `- **Implementation evidence.** Each analytics event should trace back to a KPI or launch question in the PRD.`,
  ].join("\n");
}
