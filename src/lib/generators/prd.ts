import { Project } from "../schema";
import { fallback, header } from "./util";

export function generatePRD(p: Project): string {
  const personas = p.functional.personas;
  const fr = p.functional.requirements.filter((r) => r.kind === "functional");
  const nfr = p.functional.requirements.filter((r) => r.kind === "nonfunctional");

  const out: string[] = [
    header(p, `Product requirements — ${p.name || "Untitled"}`, "PRD"),
    `## 1. Overview`,
    ``,
    p.oneLiner || "_No one-liner._",
    ``,
    `## 2. Problem and audience`,
    ``,
    `**Problem.** ${fallback(p.problem.problem)}`,
    ``,
    `**Audience.** ${fallback(p.problem.audience)}`,
    ``,
    `**Why now.** ${fallback(p.problem.whyNow)}`,
    ``,
    `## 3. Goals and success criteria`,
    ``,
    fallback(p.problem.successCriteria),
    ``,
    `## 4. Out of scope`,
    ``,
    fallback(p.problem.outOfScope),
    ``,
    `## 5. Personas`,
    ``,
  ];

  if (personas.length === 0) {
    out.push("_No personas captured yet._", "");
  } else {
    personas.forEach((per) => {
      out.push(
        `### ${per.name || "Unnamed persona"}`,
        ``,
        `- **Channel:** ${per.channel}`,
        `- **Top job-to-be-done:** ${fallback(per.jtbd)}`,
        `- **Pains today:** ${fallback(per.pains)}`,
        ``,
      );
    });
  }

  out.push(
    `## 6. Functional requirements`,
    ``,
    `Each requirement has a stable ID that flows into the design spec, traceability matrix, and test strategy.`,
    ``,
  );

  if (fr.length === 0) {
    out.push("_No functional requirements yet._", "");
  } else {
    fr.forEach((r) => {
      out.push(
        `### ${r.id} — ${r.title || "Untitled requirement"}`,
        ``,
        `- **Priority:** ${r.priority.toUpperCase()}`,
        `- **Description.** ${fallback(r.description)}`,
        `- **Acceptance criteria.** ${fallback(r.acceptance, "Capture concise, testable completion conditions.")}`,
        ``,
      );
    });
  }

  out.push(`## 7. Non-functional requirements`, ``);
  if (nfr.length === 0) {
    out.push("_No non-functional requirements yet captured under FR/NFR — see the Quality Attributes section below._", "");
  } else {
    nfr.forEach((r) => {
      out.push(
        `### ${r.id} — ${r.title || "Untitled NFR"}`,
        ``,
        `- **Priority:** ${r.priority.toUpperCase()}`,
        `- **Description.** ${fallback(r.description)}`,
        `- **Acceptance.** ${fallback(r.acceptance)}`,
        ``,
      );
    });
  }

  out.push(
    `## 7a. Features`,
    ``,
    `Each feature has a stable ID. The full per-feature spec lives in document 15; the roadmap (document 16) groups them by release.`,
    ``,
  );

  if (p.functional.features.length === 0) {
    out.push("_No features captured yet — visit the Feature Builder step._", "");
  } else {
    out.push(`| ID | Name | Priority | Complexity | Value | Release |`);
    out.push(`|---|---|---|---|---|---|`);
    p.functional.features.forEach((f) => {
      out.push(`| ${f.id} | ${f.name || "_untitled_"} | ${f.priority} | ${f.complexity} | ${f.businessValue} | ${f.release} |`);
    });
    out.push("");
  }

  out.push(
    `## 7b. KPIs`,
    ``,
  );
  if (p.functional.kpis.length === 0) {
    out.push("_No KPIs captured._", "");
  } else {
    out.push(`| ID | Name | Definition | Target | Cadence |`);
    out.push(`|---|---|---|---|---|`);
    p.functional.kpis.forEach((k) => {
      out.push(`| ${k.id} | ${k.name} | ${k.definition} | ${k.target} | ${k.cadence} |`);
    });
    out.push("");
  }

  out.push(
    `## 8. Quality attributes`,
    ``,
    `- **Availability target:** ${p.nonfunctional.availabilityTarget}`,
    `- **RTO / RPO:** ${p.nonfunctional.rto} / ${p.nonfunctional.rpo}`,
    `- **Performance:** ${p.nonfunctional.performance}`,
    `- **Privacy posture:** ${fallback(p.nonfunctional.privacyPosture)}`,
    `- **Auditability:** ${fallback(p.nonfunctional.auditability)}`,
    `- **Cost boundary:** ${fallback(p.nonfunctional.costBoundary)}`,
    `- **Support model:** ${fallback(p.nonfunctional.supportModel)}`,
    ``,
    `## 9. Business rules`,
    ``,
    fallback(p.functional.businessRules),
    ``,
    `## 10. Edge cases captured`,
    ``,
    fallback(p.functional.edgeCases),
    ``,
    `## 11. Open questions`,
    ``,
    p.openQuestions.length === 0
      ? "_None captured._"
      : p.openQuestions.map((q) => `- **${q.id}** ${q.text}${q.owner ? ` _(owner: ${q.owner})_` : ""}`).join("\n"),
    ``,
    `## 12. Assumptions`,
    ``,
    p.assumptions.length === 0
      ? "_None captured._"
      : p.assumptions.map((a) => `- **${a.id}** ${a.text} ${a.validated ? "✅ validated" : "⚠️ unvalidated"}`).join("\n"),
  );

  return out.join("\n");
}
