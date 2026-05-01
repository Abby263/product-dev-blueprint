"use client";

import { useStore } from "@/lib/store";
import { Field, Input, Textarea, Select, MultiCheck, Checkbox, Button, Card, Badge } from "@/components/ui";
import {
  Project,
  Persona,
  Requirement,
  Entity,
  Integration,
  SLO,
  Stakeholder,
  Decision,
  Risk,
  Assumption,
  OpenQuestion,
} from "@/lib/schema";
import { nextId, uid } from "@/lib/ids";

// Helper: write back to project domain
function useDomainPatcher(id: string) {
  const patch = useStore((s) => s.patchDomain);
  const update = useStore((s) => s.updateProject);
  return {
    update: (patchObj: Partial<Project>) => update(id, patchObj),
    patch,
  };
}

// ─── Basics ─────────────────────────────────────────────────────────────────
export function BasicsStep({ project }: { project: Project }) {
  const { update } = useDomainPatcher(project.id);
  return (
    <Card className="p-6 space-y-5">
      <Field label="Project name" required>
        <Input
          value={project.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="e.g. Virtual queue platform"
        />
      </Field>
      <Field label="One-liner" hint="One sentence: who it's for and what it does.">
        <Textarea
          rows={3}
          value={project.oneLiner}
          onChange={(e) => update({ oneLiner: e.target.value })}
          placeholder="A queueing platform that lets users hold their place from anywhere and arrive only when their turn is near."
        />
      </Field>
      <Field label="Detailed idea description" hint="Several sentences: the longer pitch you would tell a stakeholder.">
        <Textarea
          rows={5}
          value={project.ideaDescription}
          onChange={(e) => update({ ideaDescription: e.target.value })}
          placeholder="I want to build a queue-management app for clinics, banks, and restaurants where customers can reserve a queue number and get an estimated waiting time…"
        />
      </Field>
      <StakeholdersEditor project={project} />
    </Card>
  );
}

function StakeholdersEditor({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  function add() {
    const stakeholders: Stakeholder[] = [
      ...project.stakeholders,
      { id: uid(), role: "", responsibility: "" },
    ];
    update(project.id, { stakeholders });
  }
  function patchAt(i: number, p: Partial<Stakeholder>) {
    const stakeholders = project.stakeholders.map((s, idx) => (idx === i ? { ...s, ...p } : s));
    update(project.id, { stakeholders });
  }
  function remove(i: number) {
    const stakeholders = project.stakeholders.filter((_, idx) => idx !== i);
    update(project.id, { stakeholders });
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Stakeholders</div>
        <Button variant="ghost" onClick={add}>+ Add</Button>
      </div>
      <p className="text-xs text-ink-500 mb-3 leading-relaxed">
        Cross-functional definition needs PM, architect, designer, ops, GTM, and approver perspectives.
      </p>
      {project.stakeholders.length === 0 && (
        <div className="text-xs text-ink-500 italic">No stakeholders yet.</div>
      )}
      <div className="space-y-2">
        {project.stakeholders.map((s, i) => (
          <div key={s.id} className="grid grid-cols-12 gap-2 items-start">
            <Input
              className="col-span-3"
              placeholder="Role (e.g. Solution architect)"
              value={s.role}
              onChange={(e) => patchAt(i, { role: e.target.value })}
            />
            <Input
              className="col-span-3"
              placeholder="Name (optional)"
              value={s.name || ""}
              onChange={(e) => patchAt(i, { name: e.target.value })}
            />
            <Input
              className="col-span-5"
              placeholder="Responsibility"
              value={s.responsibility}
              onChange={(e) => patchAt(i, { responsibility: e.target.value })}
            />
            <button onClick={() => remove(i)} className="col-span-1 text-xs text-red-600 self-center">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Problem ────────────────────────────────────────────────────────────────
export function ProblemStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.problem;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { problem: { ...v, [k]: val } });
  }
  return (
    <Card className="p-6 space-y-5">
      <Field label="Problem" required hint="What's broken or missing today.">
        <Textarea rows={3} value={v.problem} onChange={(e) => set("problem", e.target.value)} />
      </Field>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Audience" required hint="Who has this problem.">
          <Textarea rows={3} value={v.audience} onChange={(e) => set("audience", e.target.value)} />
        </Field>
        <Field label="Why now" hint="What changed that makes this urgent.">
          <Textarea rows={3} value={v.whyNow} onChange={(e) => set("whyNow", e.target.value)} />
        </Field>
      </div>
      <Field label="Success criteria" required hint="Measurable outcomes that signal the work was worth it.">
        <Textarea rows={3} value={v.successCriteria} onChange={(e) => set("successCriteria", e.target.value)} />
      </Field>
      <Field label="Out of scope" hint="State explicitly what this initiative will not cover.">
        <Textarea rows={2} value={v.outOfScope} onChange={(e) => set("outOfScope", e.target.value)} />
      </Field>
      <Field label="Business case" hint="Expected value, risk if not built, priority relative to other initiatives.">
        <Textarea rows={3} value={v.businessCase} onChange={(e) => set("businessCase", e.target.value)} />
      </Field>
      <Field label="Priority">
        <Select value={v.priority} onChange={(e) => set("priority", e.target.value as typeof v.priority)}>
          <option value="P0">P0 — must do now</option>
          <option value="P1">P1 — high</option>
          <option value="P2">P2 — medium</option>
          <option value="P3">P3 — low</option>
        </Select>
      </Field>
    </Card>
  );
}

// ─── Market ─────────────────────────────────────────────────────────────────
export function MarketStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.market;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { market: { ...v, [k]: val } });
  }
  return (
    <Card className="p-6 space-y-5">
      <div className="grid md:grid-cols-3 gap-5">
        <Field label="Buyer" hint="Who pays.">
          <Input value={v.buyer} onChange={(e) => set("buyer", e.target.value)} />
        </Field>
        <Field label="End user" hint="Who actually uses it.">
          <Input value={v.endUser} onChange={(e) => set("endUser", e.target.value)} />
        </Field>
        <Field label="Operator" hint="Who runs it day-to-day.">
          <Input value={v.operator} onChange={(e) => set("operator", e.target.value)} />
        </Field>
      </div>
      <Field label="Alternatives today" hint="What buyers and users do now without your product.">
        <Textarea rows={2} value={v.alternatives} onChange={(e) => set("alternatives", e.target.value)} />
      </Field>
      <Field label="Differentiation" hint="What's distinctly true about your approach.">
        <Textarea rows={2} value={v.differentiation} onChange={(e) => set("differentiation", e.target.value)} />
      </Field>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Market size / demand">
          <Input value={v.marketSize} onChange={(e) => set("marketSize", e.target.value)} placeholder="e.g. ~5,000 mid-market clinics in NA" />
        </Field>
        <Field label="Pricing posture">
          <Input value={v.pricing} onChange={(e) => set("pricing", e.target.value)} placeholder="e.g. per-location subscription" />
        </Field>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Vertical">
          <Select value={v.vertical} onChange={(e) => set("vertical", e.target.value as typeof v.vertical)}>
            <option value="other">Other / cross-vertical</option>
            <option value="healthcare">Healthcare</option>
            <option value="financial-services">Financial services</option>
            <option value="retail">Retail</option>
            <option value="hospitality">Hospitality</option>
            <option value="public-sector">Public sector</option>
            <option value="education">Education</option>
            <option value="logistics">Logistics</option>
            <option value="saas-internal">Internal SaaS / platform</option>
          </Select>
        </Field>
        <Field label="Geographies" hint="Where the product will operate first.">
          <MultiCheck
            value={v.geo}
            onChange={(geo) => set("geo", geo as typeof v.geo)}
            options={[
              { value: "canada", label: "Canada" },
              { value: "united-states", label: "United States" },
              { value: "european-union", label: "European Union" },
              { value: "united-kingdom", label: "United Kingdom" },
              { value: "global", label: "Global" },
              { value: "other", label: "Other" },
            ]}
          />
        </Field>
      </div>
    </Card>
  );
}

// ─── Experience ─────────────────────────────────────────────────────────────
export function ExperienceStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.experience;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { experience: { ...v, [k]: val } });
  }
  return (
    <Card className="p-6 space-y-5">
      <Field label="Experience surfaces" hint="The original branching question — pick everything that applies.">
        <MultiCheck
          value={v.surfaces}
          onChange={(s) => set("surfaces", s as typeof v.surfaces)}
          options={[
            { value: "public-website", label: "Public website" },
            { value: "internal-console", label: "Internal console" },
            { value: "native-mobile", label: "Native mobile app" },
            { value: "cross-platform-mobile", label: "Cross-platform mobile" },
            { value: "kiosk", label: "Kiosk / in-branch screen" },
            { value: "partner-portal", label: "Partner portal" },
            { value: "api-only", label: "API only / headless" },
            { value: "other", label: "Other" },
          ]}
        />
      </Field>
      <div className="grid md:grid-cols-3 gap-5">
        <Field label="Auth mode">
          <Select value={v.authMode} onChange={(e) => set("authMode", e.target.value as typeof v.authMode)}>
            <option value="public">Public</option>
            <option value="authenticated">Authenticated</option>
            <option value="mixed">Mixed</option>
          </Select>
        </Field>
        <Field label="Primary device">
          <Select value={v.primaryDevice} onChange={(e) => set("primaryDevice", e.target.value as typeof v.primaryDevice)}>
            <option value="mobile-first">Mobile-first</option>
            <option value="desktop-first">Desktop-first</option>
            <option value="responsive">Responsive</option>
            <option value="kiosk">Kiosk</option>
          </Select>
        </Field>
        <Field label="Timing model" hint="Appointment, real-time queue, both, or neither.">
          <Select value={v.timingModel} onChange={(e) => set("timingModel", e.target.value as typeof v.timingModel)}>
            <option value="neither">Neither</option>
            <option value="appointment">Appointment</option>
            <option value="real-time-queue">Real-time queue</option>
            <option value="both">Both</option>
          </Select>
        </Field>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Localization" hint="Comma-separated locales.">
          <Input value={v.localization} onChange={(e) => set("localization", e.target.value)} placeholder="en-CA, fr-CA" />
        </Field>
        <Field label="Accessibility target">
          <Input value={v.accessibility} onChange={(e) => set("accessibility", e.target.value)} placeholder="WCAG 2.2 AA" />
        </Field>
      </div>
      <Field label="Notification channels">
        <MultiCheck
          value={v.notifications}
          onChange={(n) => set("notifications", n)}
          options={[
            { value: "email", label: "Email" },
            { value: "sms", label: "SMS" },
            { value: "push", label: "Push" },
            { value: "in-app", label: "In-app" },
            { value: "voice", label: "Voice / IVR" },
          ]}
        />
      </Field>
      <Checkbox label="Offline-tolerant experience required" checked={v.offline} onChange={(b) => set("offline", b)} />

      {(v.timingModel === "real-time-queue" || v.timingModel === "both") && (
        <div className="border-l-2 border-accent-300 dark:border-accent-500 pl-4 bg-accent-50/40 dark:bg-accent-900/20 py-3 rounded-r">
          <div className="text-xs font-medium text-accent-700 dark:text-accent-200">Virtual-queue UX considerations</div>
          <p className="text-xs text-ink-700 dark:text-ink-300 mt-1 leading-relaxed">
            Respect users' time, let them do other things while waiting, reduce accidental exits, and design fallbacks for
            users without an app or with intermittent connectivity. We'll seed corner cases for these on the artifacts page.
          </p>
        </div>
      )}
    </Card>
  );
}

// ─── Functional ─────────────────────────────────────────────────────────────
export function FunctionalStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.functional;

  function setBlock<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { functional: { ...v, [k]: val } });
  }

  function addPersona() {
    const personas: Persona[] = [...v.personas, { id: uid(), name: "", jtbd: "", pains: "", channel: "any" }];
    setBlock("personas", personas);
  }
  function patchPersona(i: number, p: Partial<Persona>) {
    setBlock("personas", v.personas.map((x, idx) => (idx === i ? { ...x, ...p } : x)));
  }
  function removePersona(i: number) {
    setBlock("personas", v.personas.filter((_, idx) => idx !== i));
  }

  function addReq(kind: "functional" | "nonfunctional") {
    const prefix = kind === "functional" ? "FR" : "NFR";
    const list = v.requirements.filter((r) => r.kind === kind);
    const id = nextId(prefix, list);
    const requirements: Requirement[] = [
      ...v.requirements,
      { id, kind, title: "", description: "", acceptance: "", priority: "should" },
    ];
    setBlock("requirements", requirements);
  }
  function patchReq(idx: number, p: Partial<Requirement>) {
    setBlock("requirements", v.requirements.map((r, i) => (i === idx ? { ...r, ...p } : r)));
  }
  function removeReq(idx: number) {
    setBlock("requirements", v.requirements.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Personas</div>
            <p className="text-xs text-ink-500 mt-0.5">Who initiates flows and what their top job is.</p>
          </div>
          <Button variant="ghost" onClick={addPersona}>+ Add persona</Button>
        </div>
        {v.personas.length === 0 && <div className="text-xs text-ink-500 italic">No personas yet.</div>}
        <div className="space-y-3">
          {v.personas.map((p, i) => (
            <div key={p.id} className="border border-ink-200 dark:border-ink-800 rounded-md p-3 grid md:grid-cols-2 gap-3">
              <Input placeholder="Name (e.g. Branch teller)" value={p.name} onChange={(e) => patchPersona(i, { name: e.target.value })} />
              <Select value={p.channel} onChange={(e) => patchPersona(i, { channel: e.target.value as Persona["channel"] })}>
                <option value="any">Any channel</option>
                <option value="public-website">Public website</option>
                <option value="internal-console">Internal console</option>
                <option value="native-mobile">Native mobile</option>
                <option value="cross-platform-mobile">Cross-platform mobile</option>
                <option value="kiosk">Kiosk</option>
                <option value="partner-portal">Partner portal</option>
              </Select>
              <Textarea
                rows={2}
                placeholder="Top job-to-be-done"
                value={p.jtbd}
                onChange={(e) => patchPersona(i, { jtbd: e.target.value })}
              />
              <Textarea
                rows={2}
                placeholder="Pains / friction today"
                value={p.pains}
                onChange={(e) => patchPersona(i, { pains: e.target.value })}
              />
              <button onClick={() => removePersona(i)} className="md:col-span-2 text-xs text-red-600 text-left">Remove</button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Requirements</div>
            <p className="text-xs text-ink-500 mt-0.5">
              IDs are stable across every generated document — they form the spine of the traceability matrix.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => addReq("functional")}>+ Functional</Button>
            <Button variant="ghost" onClick={() => addReq("nonfunctional")}>+ Non-functional</Button>
          </div>
        </div>
        {v.requirements.length === 0 && <div className="text-xs text-ink-500 italic">No requirements yet.</div>}
        <div className="space-y-3">
          {v.requirements.map((r, i) => (
            <div key={r.id} className="border border-ink-200 dark:border-ink-800 rounded-md p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Badge tone={r.kind === "functional" ? "accent" : "neutral"}>{r.id}</Badge>
                <Input
                  className="flex-1"
                  placeholder="Title (e.g. Customer joins queue from web)"
                  value={r.title}
                  onChange={(e) => patchReq(i, { title: e.target.value })}
                />
                <Select value={r.priority} onChange={(e) => patchReq(i, { priority: e.target.value as Requirement["priority"] })}>
                  <option value="must">Must</option>
                  <option value="should">Should</option>
                  <option value="could">Could</option>
                  <option value="wont">Won't (this release)</option>
                </Select>
                <button onClick={() => removeReq(i)} className="text-xs text-red-600">Remove</button>
              </div>
              <Textarea
                rows={2}
                placeholder="Description"
                value={r.description}
                onChange={(e) => patchReq(i, { description: e.target.value })}
              />
              <Textarea
                rows={2}
                placeholder="Acceptance criteria — concise, testable completion conditions."
                value={r.acceptance}
                onChange={(e) => patchReq(i, { acceptance: e.target.value })}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <Field label="Business rules" hint="Constraints that govern flows (e.g. VIP priority, late-arrival reslotting).">
          <Textarea rows={3} value={v.businessRules} onChange={(e) => setBlock("businessRules", e.target.value)} />
        </Field>
        <Field label="Edge cases" hint="What can fail or surprise — duplicates, no-shows, fallbacks, accessibility cases.">
          <Textarea rows={3} value={v.edgeCases} onChange={(e) => setBlock("edgeCases", e.target.value)} />
        </Field>
      </Card>
    </div>
  );
}

// ─── Non-functional ─────────────────────────────────────────────────────────
export function NonFunctionalStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.nonfunctional;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { nonfunctional: { ...v, [k]: val } });
  }

  function addSlo() {
    const slos: SLO[] = [...v.slos, { id: nextId("SLO", v.slos), surface: "", metric: "", target: "" }];
    set("slos", slos);
  }
  function patchSlo(i: number, p: Partial<SLO>) {
    set("slos", v.slos.map((x, idx) => (idx === i ? { ...x, ...p } : x)));
  }
  function removeSlo(i: number) {
    set("slos", v.slos.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <div className="grid md:grid-cols-3 gap-5">
          <Field label="Availability target" hint="Don't promise 100%. Pick a target users can feel.">
            <Input value={v.availabilityTarget} onChange={(e) => set("availabilityTarget", e.target.value)} />
          </Field>
          <Field label="Recovery time objective (RTO)">
            <Input value={v.rto} onChange={(e) => set("rto", e.target.value)} />
          </Field>
          <Field label="Recovery point objective (RPO)">
            <Input value={v.rpo} onChange={(e) => set("rpo", e.target.value)} />
          </Field>
        </div>
        <Field label="Performance">
          <Input value={v.performance} onChange={(e) => set("performance", e.target.value)} />
        </Field>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Privacy posture" hint="What data is sensitive, who can see it, what's logged.">
            <Textarea rows={2} value={v.privacyPosture} onChange={(e) => set("privacyPosture", e.target.value)} />
          </Field>
          <Field label="Auditability" hint="What must be traceable for compliance or trust.">
            <Textarea rows={2} value={v.auditability} onChange={(e) => set("auditability", e.target.value)} />
          </Field>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Cost boundaries" hint="Per-tenant, per-month, per-request, etc.">
            <Input value={v.costBoundary} onChange={(e) => set("costBoundary", e.target.value)} />
          </Field>
          <Field label="Support model" hint="Hours, escalation, on-call coverage expectations.">
            <Input value={v.supportModel} onChange={(e) => set("supportModel", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Service level objectives</div>
            <p className="text-xs text-ink-500 mt-0.5">Per surface, not one global number.</p>
          </div>
          <Button variant="ghost" onClick={addSlo}>+ Add SLO</Button>
        </div>
        {v.slos.length === 0 && <div className="text-xs text-ink-500 italic">No SLOs yet.</div>}
        <div className="space-y-2">
          {v.slos.map((s, i) => (
            <div key={s.id} className="grid grid-cols-12 gap-2 items-center">
              <Badge tone="neutral">{s.id}</Badge>
              <Input className="col-span-3" placeholder="Surface (e.g. intake save)" value={s.surface} onChange={(e) => patchSlo(i, { surface: e.target.value })} />
              <Input className="col-span-4" placeholder="Metric (e.g. p95 latency)" value={s.metric} onChange={(e) => patchSlo(i, { metric: e.target.value })} />
              <Input className="col-span-3" placeholder="Target (e.g. < 300ms)" value={s.target} onChange={(e) => patchSlo(i, { target: e.target.value })} />
              <button onClick={() => removeSlo(i)} className="col-span-1 text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Data & Tech ────────────────────────────────────────────────────────────
export function DataTechStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.dataTech;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { dataTech: { ...v, [k]: val } });
  }

  function addEntity() {
    const entities: Entity[] = [...v.entities, { id: nextId("ENT", v.entities), name: "", description: "", sensitive: false, retention: "" }];
    set("entities", entities);
  }
  function patchEntity(i: number, p: Partial<Entity>) {
    set("entities", v.entities.map((x, idx) => (idx === i ? { ...x, ...p } : x)));
  }
  function removeEntity(i: number) {
    set("entities", v.entities.filter((_, idx) => idx !== i));
  }

  function addInteg() {
    const integrations: Integration[] = [...v.integrations, { id: nextId("INT", v.integrations), system: "", direction: "outbound", protocol: "REST", dataClass: "" }];
    set("integrations", integrations);
  }
  function patchInteg(i: number, p: Partial<Integration>) {
    set("integrations", v.integrations.map((x, idx) => (idx === i ? { ...x, ...p } : x)));
  }
  function removeInteg(i: number) {
    set("integrations", v.integrations.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <p className="text-xs text-ink-500 dark:text-ink-400">
          Stack picks (frontend, backend, database, cloud, auth method) live in the <strong>Platform &amp; channels</strong> step
          — change them there. This step is the canonical model: entities, integrations, residency, and build-vs-buy.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Data residency" hint="Where data must live to satisfy contracts and regulators.">
            <Input value={v.dataResidency} onChange={(e) => set("dataResidency", e.target.value)} placeholder="e.g. Canadian region only; EU never" />
          </Field>
          <Field label="Build vs. buy decisions" hint="What you'll buy off-the-shelf vs. build in-house, and why.">
            <Input value={v.buildVsBuy} onChange={(e) => set("buildVsBuy", e.target.value)} placeholder="e.g. buy auth (Clerk); build queue engine" />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Canonical entities</div>
          <Button variant="ghost" onClick={addEntity}>+ Add entity</Button>
        </div>
        {v.entities.length === 0 && <div className="text-xs text-ink-500 italic">No entities yet.</div>}
        <div className="space-y-2">
          {v.entities.map((e, i) => (
            <div key={e.id} className="grid grid-cols-12 gap-2 items-center">
              <Badge tone="neutral">{e.id}</Badge>
              <Input className="col-span-3" placeholder="Name (e.g. Booking)" value={e.name} onChange={(ev) => patchEntity(i, { name: ev.target.value })} />
              <Input className="col-span-4" placeholder="Description" value={e.description} onChange={(ev) => patchEntity(i, { description: ev.target.value })} />
              <Input className="col-span-2" placeholder="Retention (e.g. 7 years)" value={e.retention} onChange={(ev) => patchEntity(i, { retention: ev.target.value })} />
              <label className="col-span-1 flex items-center gap-1 text-xs"><input type="checkbox" checked={e.sensitive} onChange={(ev) => patchEntity(i, { sensitive: ev.target.checked })} />PII</label>
              <button onClick={() => removeEntity(i)} className="col-span-1 text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Integrations</div>
          <Button variant="ghost" onClick={addInteg}>+ Add integration</Button>
        </div>
        {v.integrations.length === 0 && <div className="text-xs text-ink-500 italic">No integrations yet.</div>}
        <div className="space-y-2">
          {v.integrations.map((it, i) => (
            <div key={it.id} className="grid grid-cols-12 gap-2 items-center">
              <Badge tone="neutral">{it.id}</Badge>
              <Input className="col-span-3" placeholder="System" value={it.system} onChange={(e) => patchInteg(i, { system: e.target.value })} />
              <Select className="col-span-2" value={it.direction} onChange={(e) => patchInteg(i, { direction: e.target.value as Integration["direction"] })}>
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
                <option value="bidirectional">Bidirectional</option>
              </Select>
              <Input className="col-span-2" placeholder="Protocol" value={it.protocol} onChange={(e) => patchInteg(i, { protocol: e.target.value })} />
              <Input className="col-span-3" placeholder="Data class (e.g. PHI)" value={it.dataClass} onChange={(e) => patchInteg(i, { dataClass: e.target.value })} />
              <button onClick={() => removeInteg(i)} className="col-span-1 text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── GTM ────────────────────────────────────────────────────────────────────
export function GTMStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.gtm;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { gtm: { ...v, [k]: val } });
  }
  return (
    <Card className="p-6 space-y-5">
      <Field label="Packaging">
        <Select value={v.packaging} onChange={(e) => set("packaging", e.target.value as typeof v.packaging)}>
          <option value="saas">SaaS</option>
          <option value="enterprise">Enterprise deployment</option>
          <option value="managed-service">Managed service</option>
          <option value="internal-only">Internal-only capability</option>
          <option value="other">Other</option>
        </Select>
      </Field>
      <Field label="Pricing model" hint="Per-seat, per-location, usage, freemium, hybrid…">
        <Input value={v.pricingModel} onChange={(e) => set("pricingModel", e.target.value)} />
      </Field>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Target segments">
          <Textarea rows={2} value={v.segments} onChange={(e) => set("segments", e.target.value)} />
        </Field>
        <Field label="Positioning statement">
          <Textarea rows={2} value={v.positioning} onChange={(e) => set("positioning", e.target.value)} placeholder="For [audience] who [need], our product is [category] that [value]." />
        </Field>
        <Field label="Top competitors">
          <Textarea rows={2} value={v.competitors} onChange={(e) => set("competitors", e.target.value)} />
        </Field>
        <Field label="Buyer objections to plan for">
          <Textarea rows={2} value={v.buyerObjections} onChange={(e) => set("buyerObjections", e.target.value)} />
        </Field>
        <Field label="Sales motion">
          <Textarea rows={2} value={v.salesMotion} onChange={(e) => set("salesMotion", e.target.value)} placeholder="e.g. PLG with assisted enterprise" />
        </Field>
        <Field label="Channel strategy">
          <Textarea rows={2} value={v.channelStrategy} onChange={(e) => set("channelStrategy", e.target.value)} />
        </Field>
        <Field label="Acquisition channels">
          <Textarea rows={2} value={v.acquisitionChannels} onChange={(e) => set("acquisitionChannels", e.target.value)} placeholder="SEO, partnerships, outbound, paid…" />
        </Field>
        <Field label="Retention strategy">
          <Textarea rows={2} value={v.retentionStrategy} onChange={(e) => set("retentionStrategy", e.target.value)} />
        </Field>
        <Field label="Partnerships">
          <Textarea rows={2} value={v.partnerships} onChange={(e) => set("partnerships", e.target.value)} />
        </Field>
        <Field label="Launch geography">
          <Input value={v.launchGeography} onChange={(e) => set("launchGeography", e.target.value)} placeholder="e.g. Canada first, then US northeast" />
        </Field>
        <Field label="Compliance gating" hint="What must clear before each market opens.">
          <Textarea rows={2} value={v.complianceGating} onChange={(e) => set("complianceGating", e.target.value)} />
        </Field>
        <Field label="Marketing KPIs">
          <Textarea rows={2} value={v.marketingKpis} onChange={(e) => set("marketingKpis", e.target.value)} />
        </Field>
      </div>
    </Card>
  );
}

// ─── Governance ─────────────────────────────────────────────────────────────
export function GovernanceStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const g = project.governance;
  function set<K extends keyof typeof g>(k: K, val: (typeof g)[K]) {
    update(project.id, { governance: { ...g, [k]: val } });
  }

  function addRisk() {
    const risks: Risk[] = [...project.risks, { id: nextId("RISK", project.risks), description: "", likelihood: "medium", impact: "medium", mitigation: "" }];
    update(project.id, { risks });
  }
  function patchRisk(i: number, p: Partial<Risk>) {
    update(project.id, { risks: project.risks.map((r, idx) => (idx === i ? { ...r, ...p } : r)) });
  }
  function removeRisk(i: number) {
    update(project.id, { risks: project.risks.filter((_, idx) => idx !== i) });
  }

  function addAssumption() {
    const assumptions: Assumption[] = [...project.assumptions, { id: nextId("ASM", project.assumptions), text: "", validated: false }];
    update(project.id, { assumptions });
  }
  function patchAssumption(i: number, p: Partial<Assumption>) {
    update(project.id, { assumptions: project.assumptions.map((a, idx) => (idx === i ? { ...a, ...p } : a)) });
  }
  function removeAssumption(i: number) {
    update(project.id, { assumptions: project.assumptions.filter((_, idx) => idx !== i) });
  }

  function addQ() {
    const openQuestions: OpenQuestion[] = [...project.openQuestions, { id: nextId("Q", project.openQuestions), text: "" }];
    update(project.id, { openQuestions });
  }
  function patchQ(i: number, p: Partial<OpenQuestion>) {
    update(project.id, { openQuestions: project.openQuestions.map((q, idx) => (idx === i ? { ...q, ...p } : q)) });
  }
  function removeQ(i: number) {
    update(project.id, { openQuestions: project.openQuestions.filter((_, idx) => idx !== i) });
  }

  function addDecision() {
    const decisions: Decision[] = [
      ...project.decisions,
      {
        id: nextId("ADR", project.decisions),
        title: "",
        context: "",
        decision: "",
        alternatives: "",
        consequences: "",
        status: "proposed",
        confidence: "medium",
      },
    ];
    update(project.id, { decisions });
  }
  function patchDecision(i: number, p: Partial<Decision>) {
    update(project.id, { decisions: project.decisions.map((d, idx) => (idx === i ? { ...d, ...p } : d)) });
  }
  function removeDecision(i: number) {
    update(project.id, { decisions: project.decisions.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Owner" required>
            <Input value={g.owner} onChange={(e) => set("owner", e.target.value)} />
          </Field>
          <Field label="Approvers">
            <Input value={g.approvers} onChange={(e) => set("approvers", e.target.value)} placeholder="e.g. VP Eng, Head of Privacy" />
          </Field>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Dependencies">
            <Textarea rows={2} value={g.dependencies} onChange={(e) => set("dependencies", e.target.value)} />
          </Field>
          <Field label="Third parties">
            <Textarea rows={2} value={g.thirdParties} onChange={(e) => set("thirdParties", e.target.value)} />
          </Field>
          <Field label="Legal reviews required">
            <Textarea rows={2} value={g.legalReviews} onChange={(e) => set("legalReviews", e.target.value)} />
          </Field>
          <Field label="Procurement reviews required">
            <Textarea rows={2} value={g.procurementReviews} onChange={(e) => set("procurementReviews", e.target.value)} />
          </Field>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Unvalidated assumptions">
            <Textarea rows={2} value={g.unvalidatedAssumptions} onChange={(e) => set("unvalidatedAssumptions", e.target.value)} />
          </Field>
          <Field label="Decision confidence">
            <Select value={g.decisionConfidence} onChange={(e) => set("decisionConfidence", e.target.value as typeof g.decisionConfidence)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Architecture decisions (ADRs)</div>
          <Button variant="ghost" onClick={addDecision}>+ Add decision</Button>
        </div>
        {project.decisions.length === 0 && <div className="text-xs text-ink-500 italic">No decisions yet.</div>}
        <div className="space-y-3">
          {project.decisions.map((d, i) => (
            <div key={d.id} className="border border-ink-200 dark:border-ink-800 rounded-md p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Badge tone="accent">{d.id}</Badge>
                <Input className="flex-1" placeholder="Title" value={d.title} onChange={(e) => patchDecision(i, { title: e.target.value })} />
                <Select value={d.status} onChange={(e) => patchDecision(i, { status: e.target.value as Decision["status"] })}>
                  <option value="proposed">Proposed</option>
                  <option value="accepted">Accepted</option>
                  <option value="deprecated">Deprecated</option>
                </Select>
                <Select value={d.confidence} onChange={(e) => patchDecision(i, { confidence: e.target.value as Decision["confidence"] })}>
                  <option value="low">Low confidence</option>
                  <option value="medium">Medium confidence</option>
                  <option value="high">High confidence</option>
                </Select>
                <button onClick={() => removeDecision(i)} className="text-xs text-red-600">Remove</button>
              </div>
              <Textarea rows={2} placeholder="Context" value={d.context} onChange={(e) => patchDecision(i, { context: e.target.value })} />
              <Textarea rows={2} placeholder="Decision" value={d.decision} onChange={(e) => patchDecision(i, { decision: e.target.value })} />
              <Textarea rows={2} placeholder="Alternatives considered" value={d.alternatives} onChange={(e) => patchDecision(i, { alternatives: e.target.value })} />
              <Textarea rows={2} placeholder="Consequences" value={d.consequences} onChange={(e) => patchDecision(i, { consequences: e.target.value })} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Risks</div>
          <Button variant="ghost" onClick={addRisk}>+ Add risk</Button>
        </div>
        {project.risks.length === 0 && <div className="text-xs text-ink-500 italic">No risks yet.</div>}
        <div className="space-y-2">
          {project.risks.map((r, i) => (
            <div key={r.id} className="grid grid-cols-12 gap-2 items-start">
              <Badge tone="warn">{r.id}</Badge>
              <Input className="col-span-4" placeholder="Description" value={r.description} onChange={(e) => patchRisk(i, { description: e.target.value })} />
              <Select className="col-span-2" value={r.likelihood} onChange={(e) => patchRisk(i, { likelihood: e.target.value as Risk["likelihood"] })}>
                <option value="low">Likelihood: low</option>
                <option value="medium">Likelihood: medium</option>
                <option value="high">Likelihood: high</option>
              </Select>
              <Select className="col-span-2" value={r.impact} onChange={(e) => patchRisk(i, { impact: e.target.value as Risk["impact"] })}>
                <option value="low">Impact: low</option>
                <option value="medium">Impact: medium</option>
                <option value="high">Impact: high</option>
              </Select>
              <Input className="col-span-2" placeholder="Mitigation" value={r.mitigation} onChange={(e) => patchRisk(i, { mitigation: e.target.value })} />
              <button onClick={() => removeRisk(i)} className="col-span-1 text-xs text-red-600 self-center">Remove</button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Assumptions</div>
          <Button variant="ghost" onClick={addAssumption}>+ Add assumption</Button>
        </div>
        {project.assumptions.length === 0 && <div className="text-xs text-ink-500 italic">No assumptions yet.</div>}
        <div className="space-y-2">
          {project.assumptions.map((a, i) => (
            <div key={a.id} className="grid grid-cols-12 gap-2 items-center">
              <Badge tone="neutral">{a.id}</Badge>
              <Input className="col-span-9" placeholder="Assumption" value={a.text} onChange={(e) => patchAssumption(i, { text: e.target.value })} />
              <label className="col-span-1 flex items-center gap-1 text-xs">
                <input type="checkbox" checked={a.validated} onChange={(e) => patchAssumption(i, { validated: e.target.checked })} />
                ✓
              </label>
              <button onClick={() => removeAssumption(i)} className="col-span-1 text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-ink-800 dark:text-ink-100">Open questions</div>
          <Button variant="ghost" onClick={addQ}>+ Add question</Button>
        </div>
        {project.openQuestions.length === 0 && <div className="text-xs text-ink-500 italic">No open questions yet.</div>}
        <div className="space-y-2">
          {project.openQuestions.map((q, i) => (
            <div key={q.id} className="grid grid-cols-12 gap-2 items-center">
              <Badge tone="neutral">{q.id}</Badge>
              <Input className="col-span-8" placeholder="Question" value={q.text} onChange={(e) => patchQ(i, { text: e.target.value })} />
              <Input className="col-span-2" placeholder="Owner" value={q.owner || ""} onChange={(e) => patchQ(i, { owner: e.target.value })} />
              <button onClick={() => removeQ(i)} className="col-span-1 text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
