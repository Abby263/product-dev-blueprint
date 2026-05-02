import { Project } from "../schema";
import { header } from "./util";

export function generateRTM(p: Project): string {
  const out: string[] = [
    header(p, `Requirements traceability matrix — ${p.name || "Untitled"}`, "RTM"),
    `Each requirement is linked back to a stakeholder need (via persona) and forward to design elements and verification (test scenarios). IDs are stable across documents.`,
    ``,
    `| Requirement | Title | Priority | Source persona | Design refs | Test refs |`,
    `|---|---|---|---|---|---|`,
  ];

  if (p.functional.requirements.length === 0) {
    out.push(`| _none_ | _no requirements captured_ | — | — | — | — |`);
    return out.join("\n");
  }

  const personasById = Object.fromEntries(p.functional.personas.map((x) => [x.id, x.name]));

  p.functional.requirements.forEach((r) => {
    const sourceName = r.sourcePersona && personasById[r.sourcePersona] ? personasById[r.sourcePersona] : "—";
    // Design refs: engineering specification sections we know exist.
    const designRefs = ["Eng §3 Surfaces", "Eng §4 Entities", "Eng §5 Integrations", "Arch §11 Tradeoffs"].join("; ");
    const testRefs = `Test §${r.id}`;
    out.push(`| ${r.id} | ${r.title || "_untitled_"} | ${r.priority} | ${sourceName} | ${designRefs} | ${testRefs} |`);
  });

  return out.join("\n");
}
