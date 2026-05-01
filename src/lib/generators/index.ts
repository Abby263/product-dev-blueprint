import { Project } from "../schema";
import { generateExecSummary } from "./exec-summary";
import { generatePRD } from "./prd";
import { generateSOW } from "./sow";
import { generateTechSpec } from "./tech-spec";
import { generateADRPack } from "./adr";
import { generateRTM } from "./rtm";
import { generateTestStrategy } from "./test-strategy";
import { generateLaunchOps } from "./launch-ops";
import { generateMarketingBrief } from "./marketing";
import { generateDataInterfaceSpec } from "./data-interface";
import { generateRiskRegister } from "./risk-register";
import { generateSystemDesign } from "./system-design";
import { generateAIArchitecture } from "./ai-architecture";
import { generateComplianceChecklist } from "./compliance-checklist";
import { generateFeatureSpec } from "./feature-spec";
import { generateRoadmap } from "./roadmap";
import { generateCodingAgentPrompts } from "./coding-agent-prompts";
import { generateCostEstimate } from "./cost-estimate";

export interface Artifact {
  key: string;
  title: string;
  filename: string;
  description: string;
  body: string;
}

export function generateBundle(project: Project): Artifact[] {
  return [
    {
      key: "exec-summary",
      title: "Executive summary",
      filename: "01-executive-summary.md",
      description: "One-page business case, audience, success criteria.",
      body: generateExecSummary(project),
    },
    {
      key: "prd",
      title: "Product requirements (PRD)",
      filename: "02-prd.md",
      description: "Goals, personas, requirements, features, KPIs.",
      body: generatePRD(project),
    },
    {
      key: "sow",
      title: "Statement of work (SOW)",
      filename: "03-sow.md",
      description: "Scope, deliverables, milestones, acceptance.",
      body: generateSOW(project),
    },
    {
      key: "tech-spec",
      title: "Technical design spec",
      filename: "04-tech-spec.md",
      description: "Stack, contracts, rollout, monitoring, recovery.",
      body: generateTechSpec(project),
    },
    {
      key: "adr",
      title: "ADR pack",
      filename: "05-adr-pack.md",
      description: "Decisions with context, alternatives, consequences.",
      body: generateADRPack(project),
    },
    {
      key: "data-interface",
      title: "Data & interface spec",
      filename: "06-data-interface-spec.md",
      description: "Entities, integrations, retention, residency.",
      body: generateDataInterfaceSpec(project),
    },
    {
      key: "rtm",
      title: "Requirements traceability matrix",
      filename: "07-rtm.md",
      description: "Each requirement linked to design and tests.",
      body: generateRTM(project),
    },
    {
      key: "test-strategy",
      title: "Test strategy",
      filename: "08-test-strategy.md",
      description: "Coverage targets, scenarios, acceptance gates.",
      body: generateTestStrategy(project),
    },
    {
      key: "launch-ops",
      title: "Launch & operations plan",
      filename: "09-launch-ops.md",
      description: "SLOs, runbook, rollback, on-call posture.",
      body: generateLaunchOps(project),
    },
    {
      key: "marketing",
      title: "Marketing & GTM brief",
      filename: "10-marketing-brief.md",
      description: "Positioning, segments, pricing, launch geography.",
      body: generateMarketingBrief(project),
    },
    {
      key: "risk-register",
      title: "Risk register & governance",
      filename: "11-risk-register.md",
      description: "Risks, assumptions, open questions, compliance packs.",
      body: generateRiskRegister(project),
    },
    {
      key: "system-design",
      title: "System design",
      filename: "12-system-design.md",
      description: "Capacity estimates, scaling, caching, multi-region, DR.",
      body: generateSystemDesign(project),
    },
    {
      key: "ai-architecture",
      title: "AI architecture",
      filename: "13-ai-architecture.md",
      description: "Pipeline, RAG, evals, guardrails, HITL — when AI is in scope.",
      body: generateAIArchitecture(project),
    },
    {
      key: "compliance",
      title: "Security & compliance checklist",
      filename: "14-compliance-checklist.md",
      description: "Frameworks, controls, framework-specific reminders.",
      body: generateComplianceChecklist(project),
    },
    {
      key: "feature-spec",
      title: "Feature specification",
      filename: "15-feature-spec.md",
      description: "Per-feature details with acceptance, edges, security.",
      body: generateFeatureSpec(project),
    },
    {
      key: "roadmap",
      title: "Implementation roadmap",
      filename: "16-implementation-roadmap.md",
      description: "Features grouped by release with quality gates.",
      body: generateRoadmap(project),
    },
    {
      key: "cost-estimate",
      title: "Cost estimate",
      filename: "17-cost-estimate.md",
      description: "Order-of-magnitude monthly infra cost based on your stack and capacity.",
      body: generateCostEstimate(project),
    },
    {
      key: "coding-agent-prompts",
      title: "Coding-agent prompt pack",
      filename: "18-coding-agent-prompts.md",
      description: "Cursor / Lovable / Replit-ready prompts wired to the bundle.",
      body: generateCodingAgentPrompts(project),
    },
  ];
}
