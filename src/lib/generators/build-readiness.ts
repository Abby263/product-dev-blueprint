import { Feature, Project, Risk } from "../schema";
import { fallback, header, inferCompliancePacks, inferCornerCases } from "./util";

type Score = {
  label: string;
  value: number;
  reason: string;
};

function has(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}

function pct(points: boolean[]): number {
  if (points.length === 0) return 0;
  return Math.round((points.filter(Boolean).length / points.length) * 100);
}

function riskWeight(r: Risk): number {
  const likelihood = r.likelihood === "high" ? 3 : r.likelihood === "medium" ? 2 : 1;
  const impact = r.impact === "high" ? 3 : r.impact === "medium" ? 2 : 1;
  return likelihood * impact;
}

function topRisks(p: Project): Risk[] {
  return [...p.risks].sort((a, b) => riskWeight(b) - riskWeight(a)).slice(0, 5);
}

function scores(p: Project): Score[] {
  const desirability = pct([
    has(p.problem.problem),
    has(p.problem.audience),
    has(p.problem.successCriteria),
    p.functional.personas.length > 0,
    has(p.market.alternatives),
    has(p.market.differentiation),
    p.functional.kpis.length > 0,
  ]);

  const feasibility = pct([
    p.platform.kinds.length > 0,
    p.functional.requirements.length > 0,
    p.functional.features.length > 0,
    p.dataTech.entities.length > 0,
    p.systemDesign.dau > 0 || p.systemDesign.peakConcurrent > 0,
    has(p.nonfunctional.performance),
    p.decisions.length > 0,
  ]);

  const viability = pct([
    has(p.problem.businessCase),
    has(p.market.marketSize),
    has(p.market.pricing) || has(p.gtm.pricingModel),
    has(p.gtm.segments) || p.gtm.packaging === "internal-only",
    has(p.gtm.buyerObjections) || p.gtm.packaging === "internal-only",
    has(p.nonfunctional.costBoundary),
    has(p.gtm.retentionStrategy) || p.gtm.packaging === "internal-only",
  ]);

  const riskPosture = pct([
    p.risks.length > 0,
    p.assumptions.length > 0,
    p.openQuestions.length > 0,
    has(p.compliance.threatModel),
    p.compliance.encryptionAtRest,
    p.compliance.encryptionInTransit,
    p.compliance.auditLogs || p.nonfunctional.slos.length > 0,
  ]);

  const confidenceBase = p.governance.decisionConfidence === "high" ? 80 : p.governance.decisionConfidence === "medium" ? 55 : 30;
  const validatedAssumptions = p.assumptions.length === 0 ? 0 : Math.round((p.assumptions.filter((a) => a.validated).length / p.assumptions.length) * 20);
  const ownerBonus = has(p.governance.owner) ? 10 : 0;
  const confidence = Math.min(100, confidenceBase + validatedAssumptions + ownerBonus);

  return [
    {
      label: "Desirability",
      value: desirability,
      reason: "Problem clarity, audience, alternatives, differentiation, personas, success metrics.",
    },
    {
      label: "Feasibility",
      value: feasibility,
      reason: "Stack choices, requirements, features, data model, capacity, quality targets, decisions.",
    },
    {
      label: "Viability",
      value: viability,
      reason: "Business case, market size, pricing, GTM, retention, and cost boundary.",
    },
    {
      label: "Risk readiness",
      value: riskPosture,
      reason: "Risks, assumptions, open questions, threat model, controls, SLOs.",
    },
    {
      label: "Decision confidence",
      value: confidence,
      reason: "Declared confidence, validated assumptions, and ownership clarity.",
    },
  ];
}

function verdict(scoreList: Score[], missing: string[]): string {
  const avg = Math.round(scoreList.reduce((sum, s) => sum + s.value, 0) / scoreList.length);
  if (missing.length >= 5 || avg < 45) return "Do not build yet - run focused discovery and fill the critical gaps first.";
  if (avg < 65) return "Promising but not ready for full build - scope a validation sprint and technical spike.";
  if (avg < 80) return "Ready for a constrained MVP - build only the validated core and keep risky items behind gates.";
  return "Ready for implementation planning - proceed with an MVP build plan and explicit launch gates.";
}

function criticalGaps(p: Project): string[] {
  const gaps: string[] = [];
  if (!has(p.problem.problem)) gaps.push("Problem statement is missing.");
  if (!has(p.problem.audience)) gaps.push("Target audience is missing.");
  if (!has(p.problem.successCriteria)) gaps.push("Measurable success criteria are missing.");
  if (p.functional.personas.length === 0) gaps.push("No personas or primary actors are captured.");
  if (p.functional.requirements.length === 0) gaps.push("No functional requirements are captured.");
  if (p.functional.features.length === 0) gaps.push("No MVP feature list is captured.");
  if (p.dataTech.entities.length === 0) gaps.push("No canonical data entities are captured.");
  if (p.systemDesign.dau === 0 && p.systemDesign.peakConcurrent === 0) gaps.push("No capacity estimate is captured.");
  if (p.compliance.processesPersonalData && p.compliance.frameworks.length === 0) gaps.push("Personal data is in scope but compliance frameworks are not selected.");
  if ((p.compliance.processesHealthData || p.market.vertical === "healthcare") && !has(p.compliance.threatModel)) gaps.push("Healthcare/health-data posture needs a threat model before build.");
  if (p.ai.needsAI && !p.ai.evaluation) gaps.push("AI is in scope but no evaluation plan is selected.");
  if (!has(p.governance.owner)) gaps.push("No accountable owner is assigned.");
  return gaps;
}

function recommendedAction(p: Project, scoreList: Score[], gaps: string[]): string {
  const low = [...scoreList].sort((a, b) => a.value - b.value)[0];
  if (gaps.length >= 5) return "Run a two-hour idea shaping session, then complete the required intake inputs before writing more documents.";
  if (low.label === "Desirability") return "Run customer/problem validation before implementation. Capture personas, alternatives, and measurable success criteria.";
  if (low.label === "Feasibility") return "Run a technical spike. Prove data model, core flow, and capacity assumptions before committing to the stack.";
  if (low.label === "Viability") return "Run commercial validation. Test pricing, buyer urgency, distribution, and retention assumptions.";
  if (low.label === "Risk readiness") return "Run a risk and compliance pass. Convert open risks into mitigations and launch gates.";
  if (p.functional.features.some((f) => f.release === "mvp")) return "Proceed with a constrained MVP using only the MVP feature set and the validation gates below.";
  return "Define the MVP feature slice, then proceed with a constrained build plan.";
}

function scenarioChecks(p: Project): string[] {
  const checks: string[] = [];
  const timing = p.experience.timingModel;
  const kinds = p.platform.kinds;

  if (timing === "real-time-queue" || timing === "both") {
    checks.push("Queue fairness: define how walk-ins, appointments, VIPs, late arrivals, cancellations, and staff overrides change ordering.");
    checks.push("ETA trust: decide whether estimates are rule-based or learned, and monitor ETA error, abandonment, and notification delivery.");
  }

  if (timing === "appointment" || timing === "both") {
    checks.push("Scheduling edge cases: time zones, no-shows, rescheduling cutoffs, double booking, and provider/service capacity.");
  }

  if (p.market.vertical === "healthcare" || p.compliance.processesHealthData) {
    checks.push("Health-data boundary: separate queue/product identifiers from PHI and keep sensitive details out of notifications.");
  }

  if (p.market.vertical === "financial-services" || p.compliance.processesFinancialData) {
    checks.push("Financial-services posture: define audit evidence, fraud/abuse signals, operational resilience, and PCI scope if payments touch the system.");
  }

  if (p.ai.needsAI) {
    checks.push("AI quality gate: define eval datasets, refusal/escalation policy, prompt/version tracking, and human review for high-impact actions.");
    if (p.ai.ragNeeded) checks.push("RAG quality: define approved sources, freshness, access control, citation requirements, and retrieval recall targets.");
  }

  if (kinds.includes("marketplace")) {
    checks.push("Marketplace liquidity: validate whether supply or demand must be seeded first, and define trust, dispute, and payout controls.");
  }

  if (p.platform.multiTenant) {
    checks.push("Tenant isolation: define tenant-scoped auth, data partitioning, cache keys, audit logs, and backup/restore boundaries.");
  }

  if (p.experience.offline || p.experience.surfaces.includes("kiosk")) {
    checks.push("Interrupted-use flows: handle offline recovery, kiosk timeout, abandoned sessions, and personal-data wipe.");
  }

  if (checks.length === 0) {
    checks.push("No high-specificity scenario pack triggered yet. Capture vertical, surface, timing model, AI, and data sensitivity to unlock sharper checks.");
  }

  return checks;
}

function validationExperiments(p: Project): string[] {
  const experiments = [
    "Interview 5 target users and 2 buyers/operators. Validate the problem, current alternatives, urgency, and willingness to change.",
    "Build a no-code or clickable prototype of the core journey. Measure whether users can complete the happy path without explanation.",
    "Create a one-page landing or sales brief. Test whether the value proposition and pricing posture produce qualified conversations.",
    "Run a technical spike for the riskiest system behavior. Prove latency, integration, data model, or AI quality before feature build-out.",
    "Run a pre-mortem with product, engineering, security, and operations. Convert top failure modes into launch gates.",
  ];

  if (p.ai.needsAI) {
    experiments.push("Create a 30-case AI eval set from real or representative inputs. Block implementation until target quality and escalation behavior are measurable.");
  }

  if (p.compliance.processesPersonalData || p.compliance.processesFinancialData || p.compliance.processesHealthData) {
    experiments.push("Run a privacy/compliance triage before design freeze. Confirm data classes, residency, retention, consent, audit, and reviewer sign-off.");
  }

  return experiments;
}

function mvpFeatures(features: Feature[]): Feature[] {
  const explicit = features.filter((f) => f.release === "mvp" && f.priority !== "wont");
  if (explicit.length > 0) return explicit.slice(0, 8);
  return features.filter((f) => f.priority === "must").slice(0, 8);
}

export function generateBuildReadiness(p: Project): string {
  const scoreList = scores(p);
  const gaps = criticalGaps(p);
  const scenarios = scenarioChecks(p);
  const risks = topRisks(p);
  const mvp = mvpFeatures(p.functional.features);

  const out: string[] = [
    header(p, `Build readiness report - ${p.name || "Untitled"}`, "Idea evaluation"),
    `This is the default decision brief. Use it to decide what to validate, what to build first, and which risks must be resolved before implementation.`,
    ``,
    `## 1. Verdict`,
    ``,
    `**Recommendation.** ${verdict(scoreList, gaps)}`,
    ``,
    `**Next action.** ${recommendedAction(p, scoreList, gaps)}`,
    ``,
    `**Idea summary.** ${fallback(p.oneLiner || p.ideaDescription, "Capture a short idea summary before sharing this report.")}`,
    ``,
    `## 2. Readiness scorecard`,
    ``,
    `| Dimension | Score | Why it matters |`,
    `|---|---:|---|`,
    ...scoreList.map((s) => `| ${s.label} | ${s.value}/100 | ${s.reason} |`),
    ``,
    `## 3. Critical gaps before build`,
    ``,
    gaps.length === 0 ? `No critical gaps detected from the current schema. Keep human review before build approval.` : gaps.map((g) => `- ${g}`).join("\n"),
    ``,
    `## 4. Scenario checks to resolve`,
    ``,
    ...scenarios.map((s) => `- ${s}`),
    ``,
    `## 5. MVP build slice`,
    ``,
  ];

  if (mvp.length === 0) {
    out.push(`_No MVP features are captured yet. Define 3-7 must-have features before implementation._`, "");
  } else {
    out.push(`| Feature | Priority | Complexity | Release | Build note |`);
    out.push(`|---|---|---|---|---|`);
    mvp.forEach((f) => {
      out.push(`| ${f.id} - ${f.name || "Untitled"} | ${f.priority} | ${f.complexity} | ${f.release} | ${fallback(f.acceptance || f.edgeCases || f.dependencies, "Add acceptance criteria before coding.")} |`);
    });
    out.push("");
  }

  out.push(
    `## 6. Top risks and mitigations`,
    ``,
  );

  if (risks.length === 0) {
    out.push(`_No risks captured. Add at least product, technical, compliance, delivery, and GTM risks before approving build._`, "");
  } else {
    out.push(`| Risk | Likelihood | Impact | Mitigation |`);
    out.push(`|---|---|---|---|`);
    risks.forEach((r) => {
      out.push(`| ${r.id} - ${fallback(r.description)} | ${r.likelihood} | ${r.impact} | ${fallback(r.mitigation)} |`);
    });
    out.push("");
  }

  out.push(
    `## 7. Validation experiments`,
    ``,
    ...validationExperiments(p).map((e) => `- ${e}`),
    ``,
    `## 8. Compliance and corner-case prompts`,
    ``,
    `**Activated compliance packs.**`,
    ``,
    ...inferCompliancePacks(p).map((pack) => `- ${pack}`),
    ``,
    `**Corner cases to inspect.**`,
    ``,
    ...inferCornerCases(p).slice(0, 14).map((c) => `- ${c}`),
    ``,
    `## 9. Developer handoff guardrails`,
    ``,
    `- Do not start coding features without acceptance criteria for every MVP feature.`,
    `- Treat unanswered critical gaps as blockers, not TODO comments.`,
    `- Keep the first implementation slice small enough to prove the riskiest flow end-to-end.`,
    `- Add tests for the happy path, a negative path, accessibility, and the highest-risk integration.`,
    `- Update ADRs when stack, data, compliance, or rollout decisions change.`,
  );

  return out.join("\n");
}
