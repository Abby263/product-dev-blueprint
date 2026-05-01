import { Project } from "../schema";
import { fallback, header } from "./util";

export function generateTechSpec(p: Project): string {
  const out: string[] = [
    header(p, `Technical design specification — ${p.name || "Untitled"}`, "Technical design"),
    `## 1. Context`,
    ``,
    fallback(p.oneLiner),
    ``,
    `## 2. Stack`,
    ``,
    `| Layer | Choice |`,
    `|---|---|`,
    `| Frontend framework | ${p.platform.frontend} |`,
    `| UI framework | ${fallback(p.platform.uiFramework)} |`,
    `| State management | ${fallback(p.platform.stateMgmt)} |`,
    `| Backend framework | ${p.platform.backend} |`,
    `| API style | ${p.platform.apiStyle} |`,
    `| Auth method | ${p.platform.authMethod}${p.platform.rbacRequired ? " (with RBAC)" : ""} |`,
    `| Database | ${p.platform.database} (${p.platform.dataShape}) |`,
    `| Cloud / host | ${p.platform.cloud} |`,
    `| Containerization | ${p.platform.containerization} |`,
    `| CI/CD | ${fallback(p.platform.cicd)} |`,
    `| IaC | ${fallback(p.platform.iac)} |`,
    `| Observability | ${fallback(p.platform.observability)} |`,
    `| Environment strategy | ${fallback(p.platform.envStrategy)} |`,
    `| Data residency | ${fallback(p.dataTech.dataResidency)} |`,
    `| Build vs. buy | ${fallback(p.dataTech.buildVsBuy)} |`,
    ``,
    `### Platform features`,
    ``,
    `- Multi-tenant: ${p.platform.multiTenant ? "yes" : "no"}`,
    `- Search needed: ${p.platform.searchNeeded ? "yes" : "no"}`,
    `- Real-time data: ${p.platform.realtimeNeeded ? "yes" : "no"}`,
    `- Background jobs: ${p.platform.backgroundJobs ? "yes" : "no"}`,
    `- Webhooks: ${p.platform.webhooks ? "yes" : "no"}`,
    `- Event-driven: ${p.platform.eventDriven ? "yes" : "no"}`,
    `- Rate limiting: ${p.platform.rateLimiting ? "yes" : "no"}`,
    `- Caching: ${p.platform.caching ? "yes" : "no"}`,
    ``,
    `## 3. Experience surfaces`,
    ``,
    `- **Surfaces.** ${p.experience.surfaces.length === 0 ? "_None selected_" : p.experience.surfaces.join(", ")}`,
    `- **Auth mode.** ${p.experience.authMode}`,
    `- **Primary device.** ${p.experience.primaryDevice}`,
    `- **Offline-tolerant.** ${p.experience.offline ? "Yes" : "No"}`,
    `- **Localization.** ${fallback(p.experience.localization)}`,
    `- **Accessibility.** ${fallback(p.experience.accessibility)}`,
    `- **Notifications.** ${p.experience.notifications.length === 0 ? "_None_" : p.experience.notifications.join(", ")}`,
    `- **Timing model.** ${p.experience.timingModel}`,
    ``,
    `## 4. Canonical entities`,
    ``,
  ];

  if (p.dataTech.entities.length === 0) {
    out.push("_No entities captured yet._", "");
  } else {
    out.push(`| ID | Entity | Description | Sensitive | Retention |`);
    out.push(`|---|---|---|---|---|`);
    p.dataTech.entities.forEach((e) => {
      out.push(`| ${e.id} | ${e.name} | ${e.description || "_TBD_"} | ${e.sensitive ? "Yes" : "No"} | ${e.retention || "_TBD_"} |`);
    });
    out.push("");
  }

  out.push(`## 5. Integrations`, ``);
  if (p.dataTech.integrations.length === 0) {
    out.push("_No integrations captured yet._", "");
  } else {
    out.push(`| ID | System | Direction | Protocol | Data class | Notes |`);
    out.push(`|---|---|---|---|---|---|`);
    p.dataTech.integrations.forEach((i) => {
      out.push(`| ${i.id} | ${i.system} | ${i.direction} | ${i.protocol} | ${i.dataClass} | ${i.notes || ""} |`);
    });
    out.push("");
  }

  out.push(
    `## 6. Quality attributes`,
    ``,
    `- **Availability target.** ${p.nonfunctional.availabilityTarget}`,
    `- **RTO.** ${p.nonfunctional.rto}`,
    `- **RPO.** ${p.nonfunctional.rpo}`,
    `- **Performance.** ${p.nonfunctional.performance}`,
    `- **Privacy posture.** ${fallback(p.nonfunctional.privacyPosture)}`,
    `- **Auditability.** ${fallback(p.nonfunctional.auditability)}`,
    `- **Cost boundary.** ${fallback(p.nonfunctional.costBoundary)}`,
    `- **Support model.** ${fallback(p.nonfunctional.supportModel)}`,
    ``,
    `## 7. Service level objectives`,
    ``,
  );

  if (p.nonfunctional.slos.length === 0) {
    out.push("_No SLOs captured yet — define per surface, not one global number._", "");
  } else {
    out.push(`| ID | Surface | Metric | Target |`);
    out.push(`|---|---|---|---|`);
    p.nonfunctional.slos.forEach((s) => {
      out.push(`| ${s.id} | ${s.surface} | ${s.metric} | ${s.target} |`);
    });
    out.push("");
  }

  out.push(
    `## 8. Rollout and rollback`,
    ``,
    `- **Rollout.** Stage → canary → general availability behind a per-tenant feature flag. Decisions to widen rollout require SLO attainment within error budget for the prior stage.`,
    `- **Rollback.** Each release ships with a documented rollback procedure that fits inside the recovery time objective (${p.nonfunctional.rto}). Database migrations follow a backwards-compatible expand-then-contract pattern.`,
    ``,
    `## 9. Monitoring and alerting`,
    ``,
    `- Per-surface SLO dashboards aligned with section 7.`,
    `- Structured logs with request IDs propagated across services and integrations.`,
    `- Alerts wired to error-budget burn, not raw thresholds.`,
    ``,
    `## 10. Security and privacy`,
    ``,
    `- Web baseline: align with **OWASP ASVS** for verifiable controls.`,
    `- AI features (if any): align with the **OWASP LLM Top 10** — prompt injection, insecure output handling, data poisoning, denial of service, supply-chain risk.`,
    `- Data residency: ${fallback(p.dataTech.dataResidency)}.`,
    `- Sensitive data classes from integrations: ${p.dataTech.integrations.map((i) => i.dataClass).filter(Boolean).join(", ") || "_none flagged_"}.`,
    ``,
    `## 11. Open questions`,
    ``,
    p.openQuestions.length === 0
      ? "_None._"
      : p.openQuestions.map((q) => `- **${q.id}** ${q.text}${q.owner ? ` _(${q.owner})_` : ""}`).join("\n"),
  );

  return out.join("\n");
}
