import { TemplateMeta } from "./types";
import { QUEUE_TEMPLATE } from "./queue";
import { AI_AGENT_TEMPLATE } from "./ai-support-agent";
import { SAAS_TEMPLATE } from "./saas-analytics";
import { MARKETPLACE_TEMPLATE } from "./marketplace";
import { INTERNAL_CONSOLE_TEMPLATE } from "./internal-console";

export const BLANK_TEMPLATE: TemplateMeta = {
  id: "blank",
  title: "Blank project",
  blurb:
    "Walk through every intake step from scratch. Pick this if your idea doesn't match any of the prefilled templates.",
  vertical: "Any",
  stackChips: [],
  complianceChips: [],
  scaleChip: "You decide everything",
  payload: null,
};

export const TEMPLATES: TemplateMeta[] = [
  QUEUE_TEMPLATE,
  AI_AGENT_TEMPLATE,
  SAAS_TEMPLATE,
  MARKETPLACE_TEMPLATE,
  INTERNAL_CONSOLE_TEMPLATE,
  BLANK_TEMPLATE,
];

export function findTemplate(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export type { TemplateMeta };
