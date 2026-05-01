"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui";
import WizardShell from "@/components/wizard/WizardShell";
import {
  BasicsStep,
  ProblemStep,
  MarketStep,
  ExperienceStep,
  FunctionalStep,
  NonFunctionalStep,
  DataTechStep,
  GTMStep,
  GovernanceStep,
} from "@/components/wizard/steps";
import {
  PlatformStep,
  FeaturesStep,
  SystemDesignStep,
  AIStep,
  ComplianceStep,
} from "@/components/wizard/steps-extended";
import { DOMAIN_ORDER, DomainKey } from "@/lib/schema";

export default function IntakePage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const stepParam = search.get("step") as DomainKey | null;
  const id = params.id;
  const project = useStore((s) => s.projects[id]);
  const markStep = useStore((s) => s.markStep);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const step: DomainKey = useMemo(() => {
    if (stepParam && DOMAIN_ORDER.includes(stepParam)) return stepParam;
    return "basics";
  }, [stepParam]);

  if (!hydrated) return null;
  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <Link href="/projects">
          <Button className="mt-6">Back to projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <WizardShell
      project={project}
      step={step}
      onMarkComplete={() => markStep(project.id, step, "complete")}
    >
      {step === "basics" && <BasicsStep project={project} />}
      {step === "problem" && <ProblemStep project={project} />}
      {step === "market" && <MarketStep project={project} />}
      {step === "experience" && <ExperienceStep project={project} />}
      {step === "platform" && <PlatformStep project={project} />}
      {step === "functional" && <FunctionalStep project={project} />}
      {step === "features" && <FeaturesStep project={project} />}
      {step === "nonfunctional" && <NonFunctionalStep project={project} />}
      {step === "systemDesign" && <SystemDesignStep project={project} />}
      {step === "dataTech" && <DataTechStep project={project} />}
      {step === "ai" && <AIStep project={project} />}
      {step === "compliance" && <ComplianceStep project={project} />}
      {step === "gtm" && <GTMStep project={project} />}
      {step === "governance" && <GovernanceStep project={project} />}
    </WizardShell>
  );
}
