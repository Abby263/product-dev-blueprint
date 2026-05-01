import { Project } from "../schema";
import { fallback, header } from "./util";

export function generateDataInterfaceSpec(p: Project): string {
  const out: string[] = [
    header(p, `Data and interface specification — ${p.name || "Untitled"}`, "Data & interfaces"),
    `## 1. Canonical entities`,
    ``,
  ];

  if (p.dataTech.entities.length === 0) {
    out.push("_No entities captured yet._", "");
  } else {
    p.dataTech.entities.forEach((e) => {
      out.push(
        `### ${e.id} — ${e.name || "Unnamed"}`,
        ``,
        `- **Description.** ${fallback(e.description)}`,
        `- **Sensitive.** ${e.sensitive ? "Yes — handle as PII / restricted." : "No"}`,
        `- **Retention.** ${fallback(e.retention)}`,
        ``,
      );
    });
  }

  out.push(`## 2. Integrations`, ``);
  if (p.dataTech.integrations.length === 0) {
    out.push("_No integrations captured yet._", "");
  } else {
    p.dataTech.integrations.forEach((i) => {
      out.push(
        `### ${i.id} — ${i.system || "Unnamed"}`,
        ``,
        `- **Direction.** ${i.direction}`,
        `- **Protocol.** ${i.protocol}`,
        `- **Data class.** ${i.dataClass}`,
        i.notes ? `- **Notes.** ${i.notes}` : ``,
        ``,
      );
    });
  }

  out.push(
    `## 3. Data residency`,
    ``,
    fallback(p.dataTech.dataResidency),
    ``,
    `## 4. Auth strategy`,
    ``,
    `${p.platform.authMethod}${p.platform.rbacRequired ? " with RBAC" : ""}`,
  );

  return out.join("\n");
}
