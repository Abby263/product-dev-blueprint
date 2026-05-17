"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { defaultLifecycleReadiness, type Project, type DomainKey } from "./schema";
import { uid } from "./ids";

interface State {
  projects: Record<string, Project>;
  order: string[];
  createProject: (name: string, oneLiner: string, ideaDescription?: string) => string;
  createDraftProject: (name: string, oneLiner: string, ideaDescription?: string) => string;
  createFromTemplate: (overrides: Partial<Project>) => string;
  createDraftFromTemplate: (overrides: Partial<Project>) => string;
  deleteProject: (id: string) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  patchDomain: <K extends keyof Project>(id: string, key: K, value: Project[K]) => void;
  markStep: (id: string, step: DomainKey, status: "complete" | "in-progress") => void;
  duplicateProject: (id: string) => string | null;
  importProject: (project: Project) => string;
}

export function emptyProject(name: string, oneLiner: string, ideaDescription = ""): Project {
  const now = new Date().toISOString();
  return {
    id: uid(),
    listed: true,
    name,
    oneLiner,
    ideaDescription,
    createdAt: now,
    updatedAt: now,
    problem: {
      problem: "",
      audience: "",
      whyNow: "",
      successCriteria: "",
      outOfScope: "",
      businessCase: "",
      priority: "P2",
    },
    market: {
      buyer: "",
      endUser: "",
      operator: "",
      alternatives: "",
      differentiation: "",
      marketSize: "",
      pricing: "",
      geo: [],
      vertical: "other",
    },
    experience: {
      surfaces: [],
      authMode: "authenticated",
      primaryDevice: "responsive",
      offline: false,
      localization: "",
      accessibility: "WCAG 2.2 AA",
      notifications: [],
      timingModel: "neither",
    },
    platform: {
      kinds: [],
      webMarketing: false,
      webPortal: false,
      webAdmin: false,
      webPwa: false,
      webEnterprise: false,
      mobileIOS: false,
      mobileAndroid: false,
      mobileFramework: "none",
      frontend: "nextjs",
      uiFramework: "shadcn/ui",
      stateMgmt: "Zustand",
      designSystem: "",
      authRequired: true,
      responsiveRequired: true,
      accessibilityRequired: true,
      backend: "fastapi",
      apiStyle: "rest",
      authMethod: "oidc",
      rbacRequired: true,
      backgroundJobs: false,
      webhooks: false,
      eventDriven: false,
      rateLimiting: true,
      caching: true,
      database: "postgres",
      dataShape: "structured",
      multiTenant: false,
      searchNeeded: false,
      realtimeNeeded: false,
      cloud: "vercel",
      cicd: "GitHub Actions",
      iac: "Terraform",
      observability: "OpenTelemetry + Datadog",
      containerization: "docker",
      envStrategy: "dev / stage / prod",
      deploymentRuntime: "",
      cloudServices: "",
      networking: "",
      scalingApproach: "",
      cicdDetails: "",
      iacDetails: "",
      enterpriseControls: "",
    },
    functional: {
      personas: [],
      requirements: [],
      features: [],
      kpis: [],
      businessRules: "",
      edgeCases: "",
    },
    nonfunctional: {
      availabilityTarget: "99.9%",
      rto: "4 hours",
      rpo: "1 hour",
      performance: "p95 < 500ms for read paths",
      privacyPosture: "",
      auditability: "",
      costBoundary: "",
      supportModel: "",
      slos: [],
    },
    dataTech: {
      entities: [],
      integrations: [],
      dataResidency: "",
      buildVsBuy: "",
    },
    systemDesign: {
      architecturePattern: "modular-monolith",
      authArchitecture: "managed-oidc",
      deploymentTopology: "single-region",
      tradeoffAreas: [],
      securityReviewAreas: ["identity", "authorization", "data-protection", "secrets", "audit"],
      highLevelArchitectureNotes: "",
      lowLevelArchitectureNotes: "",
      domainModelNotes: "",
      schemaDesignNotes: "",
      dataLifecycleNotes: "",
      apiContractNotes: "",
      serviceBoundaryNotes: "",
      workflowStateNotes: "",
      integrationContractNotes: "",
      securityArchitectureNotes: "",
      observabilityDesignNotes: "",
      infraArchitectureNotes: "",
      testArchitectureNotes: "",
      expectedUsersTotal: 0,
      dau: 0,
      mau: 0,
      peakConcurrent: 0,
      avgRequestsPerUserPerDay: 0,
      readWriteRatio: "80:20",
      dataGrowthGBPerMonth: 0,
      notificationsPerDay: 0,
      availabilityTarget: "99.9%",
      latencyTargetMs: 300,
      geographicCoverage: "",
      multiRegion: false,
      drNeeded: false,
      cachingStrategy: "",
      dbScalingStrategy: "",
      queueStrategy: "",
      notes: "",
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
      notes: "",
    },
    compliance: {
      processesPersonalData: false,
      processesFinancialData: false,
      processesHealthData: false,
      frameworks: [],
      consentMgmt: false,
      auditLogs: false,
      encryptionAtRest: true,
      encryptionInTransit: true,
      rbacRequired: true,
      dataResidencyRequired: false,
      incidentResponseRequired: true,
      pentestCadence: "annual",
      threatModel: "",
    },
    gtm: {
      packaging: "saas",
      segments: "",
      buyerObjections: "",
      salesMotion: "",
      channelStrategy: "",
      launchGeography: "",
      complianceGating: "",
      pricingModel: "",
      acquisitionChannels: "",
      retentionStrategy: "",
      partnerships: "",
      competitors: "",
      positioning: "",
      marketingKpis: "",
    },
    governance: {
      owner: "",
      approvers: "",
      dependencies: "",
      thirdParties: "",
      legalReviews: "",
      procurementReviews: "",
      unvalidatedAssumptions: "",
      decisionConfidence: "medium",
    },
    lifecycle: defaultLifecycleReadiness(),
    stakeholders: [],
    decisions: [],
    risks: [],
    assumptions: [],
    openQuestions: [],
    progress: {},
  };
}

function withTemplateDefaults(base: Project, overrides: Partial<Project>, listed: boolean): Project {
  const lifecycleDefaults = templateLifecycleDefaults(base, overrides);
  // Domain blocks merge over defaults so older templates/projects keep
  // newly-added optional fields without requiring a manual migration.
  return {
    ...base,
    ...overrides,
    platform: { ...base.platform, ...overrides.platform },
    systemDesign: { ...base.systemDesign, ...overrides.systemDesign },
    ai: { ...base.ai, ...overrides.ai },
    lifecycle: { ...base.lifecycle, ...lifecycleDefaults, ...overrides.lifecycle },
    id: base.id,
    listed,
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
  };
}

function templateLifecycleDefaults(base: Project, overrides: Partial<Project>): Project["lifecycle"] {
  const platform = { ...base.platform, ...overrides.platform };
  const name = overrides.name || base.name || "this project";
  const cloud = platform.cloud || "selected cloud";
  const managedServices = platform.cloudServices || `${cloud} runtime, database, observability, secrets, and storage services.`;
  const deployment = platform.deploymentRuntime || `${cloud} deployment runtime with protected promotion to production.`;

  return {
    productManagerPlan: `Review ${name} scope, success metrics, launch criteria, and post-launch improvement cadence before build starts.`,
    uxDesignerPlan: "Create or review wireframes, responsive states, accessibility states, and design-system handoff before implementation.",
    softwareEngineerPlan: `Implement ${platform.frontend} frontend, ${platform.backend} backend, ${platform.database} data layer, CI checks, and release slices from the generated artifacts.`,
    securityEngineerPlan: "Run identity, authorization, data protection, secrets, audit logging, abuse controls, and incident-readiness review before production exposure.",
    dataGrowthPlan: "Define analytics events, dashboard ownership, feedback review cadence, and PM insight loop before launch.",
    prototypeSource: "Template-provided starting point; replace with Figma, sketch, screenshot, or product design doc when available.",
    uxHandoffNotes: "Capture responsive, loading, empty, error, and accessibility states before coding-agent implementation.",
    cloudDeploymentTarget: deployment,
    managedServices,
    mcpDocumentationSources: "Use current provider docs, cloud documentation MCP servers where available, API references, and design docs before implementation.",
    skillsAndSubagentsPlan: `Use specialized coding-agent workstreams for UI, API/backend, data/analytics, security review, and ${cloud} deployment.`,
    securityReviewChecklist: "OWASP web/API review, auth/RBAC, service identity, least privilege, secrets, audit logs, rate limits, data classification, and incident response.",
    deploymentApprovalGate: "Production promotion requires typecheck, build, tests, security review, rollback notes, smoke test, and owner approval.",
    analyticsFeedbackLoop: "Capture usage, reliability, conversion, and qualitative feedback; review insights with PM and data/growth owner on a fixed cadence.",
  };
}

function addToOrder(order: string[], id: string) {
  return order.includes(id) ? order : [id, ...order];
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      projects: {},
      order: [],
      createProject: (name, oneLiner, ideaDescription = "") => {
        const project = emptyProject(name || "Untitled project", oneLiner || "", ideaDescription);
        set((s) => ({
          projects: { ...s.projects, [project.id]: project },
          order: [project.id, ...s.order],
        }));
        return project.id;
      },
      createDraftProject: (name, oneLiner, ideaDescription = "") => {
        const project = {
          ...emptyProject(name || "Untitled project", oneLiner || "", ideaDescription),
          listed: false,
        };
        set((s) => ({
          projects: { ...s.projects, [project.id]: project },
        }));
        return project.id;
      },
      createFromTemplate: (overrides) => {
        const base = emptyProject(
          overrides.name || "Untitled project",
          overrides.oneLiner || "",
          overrides.ideaDescription || "",
        );
        const project = withTemplateDefaults(base, overrides, true);
        set((s) => ({
          projects: { ...s.projects, [project.id]: project },
          order: [project.id, ...s.order],
        }));
        return project.id;
      },
      createDraftFromTemplate: (overrides) => {
        const base = emptyProject(
          overrides.name || "Untitled project",
          overrides.oneLiner || "",
          overrides.ideaDescription || "",
        );
        const project = withTemplateDefaults(base, overrides, false);
        set((s) => ({
          projects: { ...s.projects, [project.id]: project },
        }));
        return project.id;
      },
      deleteProject: (id) => {
        set((s) => {
          const { [id]: _, ...rest } = s.projects;
          return { projects: rest, order: s.order.filter((x) => x !== id) };
        });
      },
      updateProject: (id, patch) => {
        set((s) => {
          const cur = s.projects[id];
          if (!cur) return s;
          const isContentEdit = Object.keys(patch).some((key) => key !== "progress");
          const next = {
            ...cur,
            ...patch,
            listed: isContentEdit ? true : cur.listed,
            updatedAt: new Date().toISOString(),
          };
          return {
            projects: { ...s.projects, [id]: next },
            order: isContentEdit ? addToOrder(s.order, id) : s.order,
          };
        });
      },
      patchDomain: (id, key, value) => {
        set((s) => {
          const cur = s.projects[id];
          if (!cur) return s;
          const isContentEdit = key !== "progress";
          const next = {
            ...cur,
            [key]: value,
            listed: isContentEdit ? true : cur.listed,
            updatedAt: new Date().toISOString(),
          } as Project;
          return {
            projects: { ...s.projects, [id]: next },
            order: isContentEdit ? addToOrder(s.order, id) : s.order,
          };
        });
      },
      markStep: (id, step, status) => {
        const cur = get().projects[id];
        if (!cur) return;
        const progress = { ...cur.progress, [step]: status };
        get().updateProject(id, { progress });
      },
      duplicateProject: (id) => {
        const cur = get().projects[id];
        if (!cur) return null;
        const copy: Project = {
          ...cur,
          id: uid(),
          listed: true,
          name: `${cur.name} (copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({
          projects: { ...s.projects, [copy.id]: copy },
          order: [copy.id, ...s.order],
        }));
        return copy.id;
      },
      importProject: (project) => {
        const copy: Project = { ...project, id: uid(), listed: true, updatedAt: new Date().toISOString() };
        set((s) => ({
          projects: { ...s.projects, [copy.id]: copy },
          order: [copy.id, ...s.order],
        }));
        return copy.id;
      },
    }),
    {
      name: "pdb-store-v2",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
