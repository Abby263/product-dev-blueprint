import { Project } from "../schema";
import { fallback, header } from "./util";

export function generateComplianceChecklist(p: Project): string {
  const v = p.compliance;
  const yn = (b: boolean) => (b ? "✅" : "⬜");
  const out: string[] = [
    header(p, `Security & compliance checklist — ${p.name || "Untitled"}`, "Compliance"),
    `## 1. Data classes processed`,
    ``,
    `- ${yn(v.processesPersonalData)} Personal data`,
    `- ${yn(v.processesFinancialData)} Financial / payment data`,
    `- ${yn(v.processesHealthData)} Health data`,
    ``,
    `## 2. Frameworks in scope`,
    ``,
    v.frameworks.length === 0 ? "_None selected._" : v.frameworks.map((f) => `- ${f}`).join("\n"),
    ``,
    `## 3. Required controls`,
    ``,
    `- ${yn(v.consentMgmt)} Consent management`,
    `- ${yn(v.auditLogs)} Audit logging`,
    `- ${yn(v.encryptionAtRest)} Encryption at rest`,
    `- ${yn(v.encryptionInTransit)} Encryption in transit`,
    `- ${yn(v.rbacRequired)} RBAC enforced on every protected route`,
    `- ${yn(v.dataResidencyRequired)} Data residency enforced`,
    `- ${yn(v.incidentResponseRequired)} Incident response plan and drills`,
    ``,
    `## 4. Pentest cadence and threat model`,
    ``,
    `- **Pentest cadence.** ${fallback(v.pentestCadence)}`,
    `- **Threat model summary.** ${fallback(v.threatModel)}`,
    ``,
    `## 5. Framework-specific reminders`,
    ``,
    frameworkReminders(v.frameworks),
    ``,
    `## 6. Web baseline`,
    ``,
    `- Align with **OWASP ASVS** for verifiable controls (auth, session, access, validation, error handling, logging).`,
    `- Apply **secure SDLC**: dependency scanning, SAST, secret scanning in CI; protected branches with required reviews.`,
    ``,
    `## 7. AI baseline (if AI is in scope)`,
    ``,
    p.ai.needsAI
      ? [
          `- Map to **OWASP LLM Top 10**: prompt injection, insecure output handling, training data poisoning, model DoS, supply chain.`,
          `- Map to **NIST AI RMF** (govern / map / measure / manage) — see AI architecture document.`,
        ].join("\n")
      : `_AI is not in scope — skip._`,
  ];
  return out.join("\n");
}

function frameworkReminders(frameworks: string[]): string {
  const lines: string[] = [];
  if (frameworks.includes("GDPR") || frameworks.includes("UK-GDPR")) {
    lines.push(`- **GDPR / UK GDPR.** Lawful basis documented; DSR workflow; DPIA for high-risk processing; cross-border transfer safeguards.`);
  }
  if (frameworks.includes("CCPA")) {
    lines.push(`- **CCPA / CPRA.** Right-to-know, delete, correct, opt-out of sale/share; privacy policy with required disclosures.`);
  }
  if (frameworks.includes("PIPEDA")) {
    lines.push(`- **PIPEDA.** Accountability and consent for collection/use/disclosure in commercial activity; breach notification thresholds.`);
  }
  if (frameworks.includes("PHIPA")) {
    lines.push(`- **PHIPA.** Health information custodian rules; consent and lockbox; provincial breach reporting.`);
  }
  if (frameworks.includes("HIPAA")) {
    lines.push(`- **HIPAA.** Administrative, physical, and technical safeguards for ePHI; BAAs with subprocessors; audit controls.`);
  }
  if (frameworks.includes("SOC2")) {
    lines.push(`- **SOC 2.** Trust criteria mapping (security, availability, confidentiality at minimum); evidence collection automated where possible.`);
  }
  if (frameworks.includes("ISO27001")) {
    lines.push(`- **ISO 27001.** ISMS scope, statement of applicability, Annex A controls, internal audit cycle.`);
  }
  if (frameworks.includes("PCI-DSS")) {
    lines.push(`- **PCI DSS.** Carve out card data scope; tokenize wherever possible; segment networks; quarterly scans.`);
  }
  if (frameworks.includes("OSFI")) {
    lines.push(`- **OSFI (Canada FI).** Tech & cyber-risk management expectations; incident reporting; resilience and third-party risk.`);
  }
  if (frameworks.includes("OWASP-ASVS")) {
    lines.push(`- **OWASP ASVS.** Pick a verification level and use it as a build-time + audit checklist.`);
  }
  if (frameworks.includes("OWASP-LLM")) {
    lines.push(`- **OWASP LLM Top 10.** Wire to AI architecture and eval suites.`);
  }
  if (frameworks.includes("NIST-AI-RMF")) {
    lines.push(`- **NIST AI RMF.** Use govern / map / measure / manage as the operating model.`);
  }
  return lines.length === 0 ? "_No framework-specific reminders selected._" : lines.join("\n");
}
