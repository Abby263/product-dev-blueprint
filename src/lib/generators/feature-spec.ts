import { Project } from "../schema";
import { fallback, header } from "./util";

export function generateFeatureSpec(p: Project): string {
  const features = p.functional.features;
  const out: string[] = [
    header(p, `Feature specification — ${p.name || "Untitled"}`, "Feature spec"),
    `Each feature has a stable ID. The roadmap groups them by release; the test strategy generates scenarios per feature.`,
    ``,
  ];

  if (features.length === 0) {
    out.push("_No features captured yet — visit the Feature Builder step to seed or add._");
    return out.join("\n");
  }

  // Summary table
  out.push(`## Summary`, ``);
  out.push(`| ID | Name | Priority | Complexity | Value | Release |`);
  out.push(`|---|---|---|---|---|---|`);
  features.forEach((f) => {
    out.push(`| ${f.id} | ${f.name || "_untitled_"} | ${f.priority} | ${f.complexity} | ${f.businessValue} | ${f.release} |`);
  });
  out.push("");

  features.forEach((f) => {
    out.push(
      `## ${f.id} — ${f.name || "Untitled feature"}`,
      ``,
      `- **Priority.** ${f.priority.toUpperCase()}    **Complexity.** ${f.complexity}    **Business value.** ${f.businessValue}    **Release.** ${f.release}`,
      ``,
      `### Description`,
      ``,
      fallback(f.description),
      ``,
      `### User story`,
      ``,
      fallback(f.userStory),
      ``,
      `### Acceptance criteria`,
      ``,
      fallback(f.acceptance, "Capture testable conditions before development starts."),
      ``,
      `### Dependencies, APIs, data`,
      ``,
      `- **Dependencies.** ${fallback(f.dependencies)}`,
      `- **APIs needed.** ${fallback(f.apisNeeded)}`,
      `- **Data needed.** ${fallback(f.dataNeeded)}`,
      ``,
      `### Edge cases & error states`,
      ``,
      `- **Edge cases.** ${fallback(f.edgeCases)}`,
      `- **Error states.** ${fallback(f.errorStates)}`,
      ``,
      `### Operations & security`,
      ``,
      `- **Admin controls.** ${fallback(f.adminControls)}`,
      `- **Audit / logging.** ${fallback(f.audit)}`,
      `- **Security considerations.** ${fallback(f.security)}`,
      ``,
      `### Future enhancements`,
      ``,
      fallback(f.futureEnhancements),
      ``,
      `---`,
      ``,
    );
  });

  return out.join("\n");
}
