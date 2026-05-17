import { Project, defaultLifecycleReadiness } from "../schema";
import { fallback, header, inferCompliancePacks } from "./util";

export function generateLaunchOps(p: Project): string {
  const packs = inferCompliancePacks(p);
  const lifecycle = p.lifecycle ?? defaultLifecycleReadiness();
  const out: string[] = [
    header(p, `Launch and operations plan — ${p.name || "Untitled"}`, "Launch & ops"),
    `## 1. Launch posture`,
    ``,
    `- **Geography.** ${fallback(p.gtm.launchGeography)}`,
    `- **Compliance gating.** ${fallback(p.gtm.complianceGating)}`,
    `- **Packaging.** ${p.gtm.packaging}`,
    ``,
    `## 2. SLOs`,
    ``,
  ];

  if (p.nonfunctional.slos.length === 0) {
    out.push("_No SLOs captured yet._", "");
  } else {
    out.push(`| ID | Surface | Metric | Target |`);
    out.push(`|---|---|---|---|`);
    p.nonfunctional.slos.forEach((s) => out.push(`| ${s.id} | ${s.surface} | ${s.metric} | ${s.target} |`));
    out.push("");
  }

  out.push(
    `## 3. Recovery posture`,
    ``,
    `- **Recovery time objective.** ${p.nonfunctional.rto}`,
    `- **Recovery point objective.** ${p.nonfunctional.rpo}`,
    `- **Availability target.** ${p.nonfunctional.availabilityTarget} — error-budget thinking applied; do not promise 100%.`,
    ``,
    `## 4. On-call and support`,
    ``,
    `- **Support model.** ${fallback(p.nonfunctional.supportModel)}`,
    `- **Owner.** ${fallback(p.governance.owner)}`,
    `- **Approvers.** ${fallback(p.governance.approvers)}`,
    ``,
    `## 5. Runbook starter`,
    ``,
    `1. Check SLO dashboards for the affected surface.`,
    `2. Verify integrations (see Tech §5) for upstream/downstream incidents.`,
    `3. If a recent deploy is implicated, follow the rollback procedure within ${p.nonfunctional.rto}.`,
    `4. Open an incident ticket; record decisions back to the ADR pack as needed.`,
    ``,
    `## 6. Compliance packs activated`,
    ``,
    packs.map((c) => `- ${c}`).join("\n"),
    ``,
    `## 7. Privacy and audit`,
    ``,
    `- **Privacy posture.** ${fallback(p.nonfunctional.privacyPosture)}`,
    `- **Auditability.** ${fallback(p.nonfunctional.auditability)}`,
    `- **Data residency.** ${fallback(p.dataTech.dataResidency)}`,
    ``,
    `## 8. Rollout sequencing`,
    ``,
    `1. **Internal.** Stage with synthetic traffic + dogfooding.`,
    `2. **Canary.** A bounded tenant cohort behind a feature flag.`,
    `3. **General availability.** Widen only when SLOs are green and error budget allows.`,
    `4. **Sunset.** Decommission previous surfaces with explicit migration windows.`,
    ``,
    `## 9. Security review gate`,
    ``,
    `- **Checklist.** ${fallback(lifecycle.securityReviewChecklist, "Minimum: OWASP web/API review, identity/IAM/service-account least privilege, secrets review, audit logging, data classification, abuse/rate-limit controls, and incident-response readiness.")}`,
    `- **Cloud identity.** Runtime services must use scoped service identities. Avoid broad owner/editor roles and long-lived credentials.`,
    `- **Evidence.** Attach security findings, fixes, and residual-risk sign-off to the release PR or launch ticket.`,
    ``,
    `## 10. Deployment approval gate`,
    ``,
    `- **Approval rule.** ${fallback(lifecycle.deploymentApprovalGate, "Promote to production only after CI, build, tests, security review, rollback plan, and product/engineering owner approval pass.")}`,
    `- **Rollback trigger.** Error-budget burn, security finding, failed smoke test, analytics ingestion break, or customer-impacting regression.`,
    ``,
    `## 11. Analytics feedback loop`,
    ``,
    `- **Plan.** ${fallback(lifecycle.analyticsFeedbackLoop, "Capture usage, feedback, response time, conversion, retention, and reliability signals; review with PM and data/growth owner on a fixed cadence.")}`,
    `- **Decision cadence.** Insights should produce backlog decisions, UX changes, reliability fixes, or GTM adjustments.`,
  );

  return out.join("\n");
}
