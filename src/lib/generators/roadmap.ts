import { Feature, Project } from "../schema";
import { fallback, header } from "./util";

export function generateRoadmap(p: Project): string {
  const features = p.functional.features;
  const groups = {
    mvp: features.filter((f) => f.release === "mvp"),
    v1: features.filter((f) => f.release === "v1"),
    v2: features.filter((f) => f.release === "v2"),
    future: features.filter((f) => f.release === "future"),
  };

  const out: string[] = [
    header(p, `Implementation roadmap — ${p.name || "Untitled"}`, "Roadmap"),
    `## 1. Phasing`,
    ``,
    `This roadmap groups features by release. Sequencing within a release should respect dependencies and the **must / should / could** priorities surfaced in the feature library.`,
    ``,
    `## 2. MVP — minimum viable product`,
    ``,
    listFeatures(groups.mvp),
    ``,
    `## 3. v1 — first general release`,
    ``,
    listFeatures(groups.v1),
    ``,
    `## 4. v2 — fast-follow`,
    ``,
    listFeatures(groups.v2),
    ``,
    `## 5. Future — beyond v2`,
    ``,
    listFeatures(groups.future),
    ``,
    `## 6. Quality gates between releases`,
    ``,
    `- **MVP → v1.** All MVP must-haves pass acceptance; SLOs green on staging soak; pilot tenant feedback addressed.`,
    `- **v1 → v2.** Error budget healthy across tenants; migration tooling proven; documented operations runbook.`,
    `- **v2 → future.** Strategic review of segments, pricing, and architecture pressure points.`,
    ``,
    `## 7. Dependencies & risks`,
    ``,
    `- **Dependencies.** ${fallback(p.governance.dependencies)}`,
    `- **Third parties.** ${fallback(p.governance.thirdParties)}`,
    `- **Open questions.** ${p.openQuestions.length === 0 ? "_None._" : p.openQuestions.map((q) => `${q.id}`).join(", ")}`,
    `- **Risks.** ${p.risks.length === 0 ? "_None captured._" : p.risks.map((r) => r.id).join(", ")}`,
  ];
  return out.join("\n");
}

function listFeatures(features: Feature[]): string {
  if (features.length === 0) return "_No features in this release._";
  return features
    .map(
      (f) =>
        `- **${f.id}** ${f.name || "_untitled_"} _(priority: ${f.priority}, complexity: ${f.complexity}, value: ${f.businessValue})_`,
    )
    .join("\n");
}
