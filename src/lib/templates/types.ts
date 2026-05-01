import type { Project, DomainKey } from "../schema";
import { DOMAIN_ORDER } from "../schema";

export interface TemplateMeta {
  id: string;                          // url-safe id used in routing/UI
  title: string;
  blurb: string;                       // one-line description for the card
  vertical?: string;                   // human-readable vertical for the card
  stackChips?: string[];               // small chips on the card (e.g. "Next.js", "FastAPI", "Postgres")
  complianceChips?: string[];          // ["HIPAA", "PIPEDA"]
  scaleChip?: string;                  // e.g. "B2B • 200K DAU peak"
  // The template payload — a Partial<Project> with everything except id/timestamps.
  // Pass null for the blank template.
  payload: Partial<Project> | null;
}

// Mark all wizard steps as complete so users see 100% intake when they
// pick a template. This is the clearest signal that they're working
// from a fully populated reference.
export const ALL_COMPLETE: Record<DomainKey, "complete"> = DOMAIN_ORDER.reduce(
  (acc, k) => ({ ...acc, [k]: "complete" as const }),
  {} as Record<DomainKey, "complete">,
);
