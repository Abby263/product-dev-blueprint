"use client";

import { useStore } from "@/lib/store";
import { Field, Input, Textarea, Select, MultiCheck, Checkbox, Button, Card, Badge } from "@/components/ui";
import {
  Project,
  Feature,
  KPI,
  PlatformKind,
} from "@/lib/schema";
import { nextId } from "@/lib/ids";
import { suggestFeatures, newBlankFeature } from "@/lib/feature-suggestions";

// ─── Platform & channels ────────────────────────────────────────────────────
export function PlatformStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.platform;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { platform: { ...v, [k]: val } });
  }

  const isWeb = v.kinds.includes("website") || v.kinds.includes("saas-platform") || v.kinds.includes("admin-dashboard") || v.kinds.includes("customer-portal");
  const isMobile = v.kinds.includes("mobile-app");

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <Field label="What are you building?" required hint="Pick everything that applies.">
          <MultiCheck
            value={v.kinds}
            onChange={(k) => set("kinds", k as PlatformKind[])}
            options={[
              { value: "website", label: "Website" },
              { value: "mobile-app", label: "Mobile app" },
              { value: "desktop-app", label: "Desktop app" },
              { value: "saas-platform", label: "SaaS platform" },
              { value: "internal-tool", label: "Internal enterprise tool" },
              { value: "api-only", label: "API-only product" },
              { value: "ai-agent", label: "AI agent / workflow" },
              { value: "marketplace", label: "Marketplace" },
              { value: "admin-dashboard", label: "Admin dashboard" },
              { value: "customer-portal", label: "Customer-facing portal" },
            ]}
          />
        </Field>

        {isWeb && (
          <div className="border-l-2 border-accent-300 pl-4 py-2 space-y-2">
            <div className="text-xs font-medium text-accent-700">Web sub-choices</div>
            <Checkbox label="Public marketing website" checked={v.webMarketing} onChange={(b) => set("webMarketing", b)} />
            <Checkbox label="Logged-in customer portal" checked={v.webPortal} onChange={(b) => set("webPortal", b)} />
            <Checkbox label="Admin dashboard" checked={v.webAdmin} onChange={(b) => set("webAdmin", b)} />
            <Checkbox label="Progressive Web App (PWA)" checked={v.webPwa} onChange={(b) => set("webPwa", b)} />
            <Checkbox label="Enterprise web app" checked={v.webEnterprise} onChange={(b) => set("webEnterprise", b)} />
          </div>
        )}

        {isMobile && (
          <div className="border-l-2 border-accent-300 pl-4 py-2 space-y-3">
            <div className="text-xs font-medium text-accent-700">Mobile sub-choices</div>
            <div className="flex gap-4">
              <Checkbox label="iOS" checked={v.mobileIOS} onChange={(b) => set("mobileIOS", b)} />
              <Checkbox label="Android" checked={v.mobileAndroid} onChange={(b) => set("mobileAndroid", b)} />
            </div>
            <Field label="Mobile framework">
              <Select value={v.mobileFramework} onChange={(e) => set("mobileFramework", e.target.value as typeof v.mobileFramework)}>
                <option value="none">Not decided</option>
                <option value="react-native">React Native</option>
                <option value="flutter">Flutter</option>
                <option value="native-each">Native (Swift + Kotlin)</option>
                <option value="kmp">Kotlin Multiplatform</option>
              </Select>
            </Field>
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-5">
        <div className="text-sm font-medium text-ink-800">Frontend stack</div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Framework">
            <Select value={v.frontend} onChange={(e) => set("frontend", e.target.value as typeof v.frontend)}>
              <option value="nextjs">Next.js</option>
              <option value="react">React (CRA / Vite)</option>
              <option value="vue">Vue</option>
              <option value="angular">Angular</option>
              <option value="svelte">Svelte / SvelteKit</option>
              <option value="html">Plain HTML/CSS/JS</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="UI framework">
            <Input value={v.uiFramework} onChange={(e) => set("uiFramework", e.target.value)} placeholder="shadcn/ui, MUI, Chakra…" />
          </Field>
          <Field label="State management">
            <Input value={v.stateMgmt} onChange={(e) => set("stateMgmt", e.target.value)} placeholder="Zustand, Redux Toolkit, none…" />
          </Field>
          <Field label="Design system reference">
            <Input value={v.designSystem} onChange={(e) => set("designSystem", e.target.value)} placeholder="Material 3, Stripe, custom…" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-4">
          <Checkbox label="Auth required" checked={v.authRequired} onChange={(b) => set("authRequired", b)} />
          <Checkbox label="Responsive required" checked={v.responsiveRequired} onChange={(b) => set("responsiveRequired", b)} />
          <Checkbox label="Accessibility required" checked={v.accessibilityRequired} onChange={(b) => set("accessibilityRequired", b)} />
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <div className="text-sm font-medium text-ink-800">Backend stack</div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Framework">
            <Select value={v.backend} onChange={(e) => set("backend", e.target.value as typeof v.backend)}>
              <option value="fastapi">Python FastAPI</option>
              <option value="django">Python Django</option>
              <option value="express">Node.js Express</option>
              <option value="nestjs">NestJS</option>
              <option value="spring">Java Spring Boot</option>
              <option value="dotnet">.NET Core</option>
              <option value="go">Go</option>
              <option value="rails">Ruby on Rails</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="API style">
            <Select value={v.apiStyle} onChange={(e) => set("apiStyle", e.target.value as typeof v.apiStyle)}>
              <option value="rest">REST</option>
              <option value="graphql">GraphQL</option>
              <option value="grpc">gRPC</option>
              <option value="mixed">Mixed</option>
            </Select>
          </Field>
          <Field label="Auth method">
            <Select value={v.authMethod} onChange={(e) => set("authMethod", e.target.value as typeof v.authMethod)}>
              <option value="oidc">OIDC / OAuth2</option>
              <option value="saml">SAML</option>
              <option value="jwt">JWT</option>
              <option value="session">Server sessions</option>
              <option value="api-key">API keys</option>
              <option value="magic-link">Magic link</option>
            </Select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-4">
          <Checkbox label="RBAC" checked={v.rbacRequired} onChange={(b) => set("rbacRequired", b)} />
          <Checkbox label="Background jobs" checked={v.backgroundJobs} onChange={(b) => set("backgroundJobs", b)} />
          <Checkbox label="Webhooks" checked={v.webhooks} onChange={(b) => set("webhooks", b)} />
          <Checkbox label="Event-driven" checked={v.eventDriven} onChange={(b) => set("eventDriven", b)} />
          <Checkbox label="Rate limiting" checked={v.rateLimiting} onChange={(b) => set("rateLimiting", b)} />
          <Checkbox label="Caching" checked={v.caching} onChange={(b) => set("caching", b)} />
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <div className="text-sm font-medium text-ink-800">Database</div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Primary store">
            <Select value={v.database} onChange={(e) => set("database", e.target.value as typeof v.database)}>
              <option value="postgres">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="mongodb">MongoDB</option>
              <option value="dynamodb">DynamoDB</option>
              <option value="firebase">Firebase</option>
              <option value="supabase">Supabase</option>
              <option value="redis">Redis</option>
              <option value="elasticsearch">Elasticsearch / OpenSearch</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Data shape">
            <Select value={v.dataShape} onChange={(e) => set("dataShape", e.target.value as typeof v.dataShape)}>
              <option value="structured">Structured</option>
              <option value="semi-structured">Semi-structured</option>
              <option value="unstructured">Unstructured</option>
              <option value="mixed">Mixed</option>
            </Select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-4">
          <Checkbox label="Multi-tenant" checked={v.multiTenant} onChange={(b) => set("multiTenant", b)} />
          <Checkbox label="Search needed" checked={v.searchNeeded} onChange={(b) => set("searchNeeded", b)} />
          <Checkbox label="Real-time data" checked={v.realtimeNeeded} onChange={(b) => set("realtimeNeeded", b)} />
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <div className="text-sm font-medium text-ink-800">Cloud & deployment</div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Cloud / host">
            <Select value={v.cloud} onChange={(e) => set("cloud", e.target.value as typeof v.cloud)}>
              <option value="vercel">Vercel</option>
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
              <option value="gcp">Google Cloud</option>
              <option value="netlify">Netlify</option>
              <option value="render">Render</option>
              <option value="railway">Railway</option>
              <option value="heroku">Heroku</option>
              <option value="kubernetes">Kubernetes (any)</option>
              <option value="self-hosted">Self-hosted</option>
            </Select>
          </Field>
          <Field label="CI/CD">
            <Input value={v.cicd} onChange={(e) => set("cicd", e.target.value)} />
          </Field>
          <Field label="Containerization">
            <Select value={v.containerization} onChange={(e) => set("containerization", e.target.value as typeof v.containerization)}>
              <option value="none">None</option>
              <option value="docker">Docker</option>
              <option value="kubernetes">Kubernetes</option>
            </Select>
          </Field>
          <Field label="Environment strategy">
            <Input value={v.envStrategy} onChange={(e) => set("envStrategy", e.target.value)} />
          </Field>
          <Field label="Infrastructure as code">
            <Input value={v.iac} onChange={(e) => set("iac", e.target.value)} />
          </Field>
          <Field label="Observability">
            <Input value={v.observability} onChange={(e) => set("observability", e.target.value)} />
          </Field>
        </div>
      </Card>
    </div>
  );
}

// ─── Feature builder ────────────────────────────────────────────────────────
export function FeaturesStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const features = project.functional.features;

  function setFeatures(features: Feature[]) {
    update(project.id, { functional: { ...project.functional, features } });
  }

  function addBlank() {
    setFeatures([...features, newBlankFeature(features)]);
  }

  function applySuggestions() {
    if (features.length > 0) {
      const ok = confirm("Replace existing features with rule-based suggestions tailored to this project's surface, vertical, and timing model?");
      if (!ok) return;
    }
    setFeatures(suggestFeatures(project));
  }

  function patchFeat(i: number, p: Partial<Feature>) {
    setFeatures(features.map((f, idx) => (idx === i ? { ...f, ...p } : f)));
  }

  function removeFeat(i: number) {
    setFeatures(features.filter((_, idx) => idx !== i));
  }

  const kpis = project.functional.kpis;
  function setKpis(kpis: KPI[]) {
    update(project.id, { functional: { ...project.functional, kpis } });
  }
  function addKpi() {
    setKpis([...kpis, { id: nextId("KPI", kpis), name: "", definition: "", target: "", cadence: "monthly" }]);
  }
  function patchKpi(i: number, p: Partial<KPI>) {
    setKpis(kpis.map((k, idx) => (idx === i ? { ...k, ...p } : k)));
  }
  function removeKpi(i: number) {
    setKpis(kpis.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium text-ink-800">Feature library</div>
            <p className="text-xs text-ink-500 mt-0.5 max-w-2xl">
              Capture each feature with priority, complexity, business value, and release. Suggestions are rule-based — they
              react to your timing model, vertical, and platform choices.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={applySuggestions}>Suggest features</Button>
            <Button variant="ghost" onClick={addBlank}>+ Blank</Button>
          </div>
        </div>
        {features.length === 0 && (
          <div className="text-xs text-ink-500 italic">
            No features yet — click <strong>Suggest features</strong> to seed a tailored list, or add a blank one.
          </div>
        )}
        <div className="space-y-3">
          {features.map((f, i) => (
            <div key={f.id} className="border border-ink-200 rounded-md p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Badge tone="accent">{f.id}</Badge>
                <Input className="flex-1" placeholder="Name" value={f.name} onChange={(e) => patchFeat(i, { name: e.target.value })} />
                <Select value={f.priority} onChange={(e) => patchFeat(i, { priority: e.target.value as Feature["priority"] })}>
                  <option value="must">Must</option>
                  <option value="should">Should</option>
                  <option value="could">Could</option>
                  <option value="wont">Won't (yet)</option>
                </Select>
                <Select value={f.complexity} onChange={(e) => patchFeat(i, { complexity: e.target.value as Feature["complexity"] })}>
                  <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option>
                </Select>
                <Select value={f.businessValue} onChange={(e) => patchFeat(i, { businessValue: e.target.value as Feature["businessValue"] })}>
                  <option value="low">Value: low</option>
                  <option value="medium">Value: medium</option>
                  <option value="high">Value: high</option>
                </Select>
                <Select value={f.release} onChange={(e) => patchFeat(i, { release: e.target.value as Feature["release"] })}>
                  <option value="mvp">MVP</option><option value="v1">v1</option><option value="v2">v2</option><option value="future">Future</option>
                </Select>
                <button onClick={() => removeFeat(i)} className="text-xs text-red-600">Remove</button>
              </div>
              <Textarea rows={2} placeholder="Description" value={f.description} onChange={(e) => patchFeat(i, { description: e.target.value })} />
              <Textarea rows={2} placeholder="User story (As a __, I can __ so that __.)" value={f.userStory} onChange={(e) => patchFeat(i, { userStory: e.target.value })} />
              <Textarea rows={2} placeholder="Acceptance criteria — testable conditions" value={f.acceptance} onChange={(e) => patchFeat(i, { acceptance: e.target.value })} />
              <details className="text-xs">
                <summary className="cursor-pointer text-ink-600 select-none">Advanced (deps, APIs, edge cases, security…)</summary>
                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  <Input placeholder="Dependencies" value={f.dependencies} onChange={(e) => patchFeat(i, { dependencies: e.target.value })} />
                  <Input placeholder="APIs needed" value={f.apisNeeded} onChange={(e) => patchFeat(i, { apisNeeded: e.target.value })} />
                  <Input placeholder="Data needed" value={f.dataNeeded} onChange={(e) => patchFeat(i, { dataNeeded: e.target.value })} />
                  <Input placeholder="Edge cases" value={f.edgeCases} onChange={(e) => patchFeat(i, { edgeCases: e.target.value })} />
                  <Input placeholder="Error states" value={f.errorStates} onChange={(e) => patchFeat(i, { errorStates: e.target.value })} />
                  <Input placeholder="Admin controls" value={f.adminControls} onChange={(e) => patchFeat(i, { adminControls: e.target.value })} />
                  <Input placeholder="Audit / logging" value={f.audit} onChange={(e) => patchFeat(i, { audit: e.target.value })} />
                  <Input placeholder="Security considerations" value={f.security} onChange={(e) => patchFeat(i, { security: e.target.value })} />
                  <Input placeholder="Future enhancements" value={f.futureEnhancements} onChange={(e) => patchFeat(i, { futureEnhancements: e.target.value })} />
                </div>
              </details>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium text-ink-800">KPIs</div>
            <p className="text-xs text-ink-500 mt-0.5">Outcome metrics that prove the work was worth it.</p>
          </div>
          <Button variant="ghost" onClick={addKpi}>+ Add KPI</Button>
        </div>
        {kpis.length === 0 && <div className="text-xs text-ink-500 italic">No KPIs yet.</div>}
        <div className="space-y-2">
          {kpis.map((k, i) => (
            <div key={k.id} className="grid grid-cols-12 gap-2 items-start">
              <Badge tone="neutral">{k.id}</Badge>
              <Input className="col-span-3" placeholder="Name" value={k.name} onChange={(e) => patchKpi(i, { name: e.target.value })} />
              <Input className="col-span-4" placeholder="Definition" value={k.definition} onChange={(e) => patchKpi(i, { definition: e.target.value })} />
              <Input className="col-span-2" placeholder="Target" value={k.target} onChange={(e) => patchKpi(i, { target: e.target.value })} />
              <Input className="col-span-1" placeholder="Cadence" value={k.cadence} onChange={(e) => patchKpi(i, { cadence: e.target.value })} />
              <button onClick={() => removeKpi(i)} className="col-span-1 text-xs text-red-600 self-center">Remove</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── System design ──────────────────────────────────────────────────────────
export function SystemDesignStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.systemDesign;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { systemDesign: { ...v, [k]: val } });
  }

  // Back-of-envelope derived numbers
  const reqsPerDay = v.dau * v.avgRequestsPerUserPerDay;
  const reqsPerSec = reqsPerDay > 0 ? reqsPerDay / 86400 : 0;
  const peakRps = Math.max(reqsPerSec * 5, v.peakConcurrent); // crude burst estimate

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <div className="text-sm font-medium text-ink-800">Capacity expectations</div>
        <div className="grid md:grid-cols-3 gap-5">
          <Field label="Total expected users (lifetime)">
            <Input type="number" min={0} value={v.expectedUsersTotal} onChange={(e) => set("expectedUsersTotal", Number(e.target.value || 0))} />
          </Field>
          <Field label="Daily active users (DAU)">
            <Input type="number" min={0} value={v.dau} onChange={(e) => set("dau", Number(e.target.value || 0))} />
          </Field>
          <Field label="Monthly active users (MAU)">
            <Input type="number" min={0} value={v.mau} onChange={(e) => set("mau", Number(e.target.value || 0))} />
          </Field>
          <Field label="Peak concurrent users">
            <Input type="number" min={0} value={v.peakConcurrent} onChange={(e) => set("peakConcurrent", Number(e.target.value || 0))} />
          </Field>
          <Field label="Average requests / user / day">
            <Input type="number" min={0} value={v.avgRequestsPerUserPerDay} onChange={(e) => set("avgRequestsPerUserPerDay", Number(e.target.value || 0))} />
          </Field>
          <Field label="Read / write ratio">
            <Input value={v.readWriteRatio} onChange={(e) => set("readWriteRatio", e.target.value)} placeholder="e.g. 80:20" />
          </Field>
          <Field label="Data growth (GB / month)">
            <Input type="number" min={0} value={v.dataGrowthGBPerMonth} onChange={(e) => set("dataGrowthGBPerMonth", Number(e.target.value || 0))} />
          </Field>
          <Field label="Notifications / day">
            <Input type="number" min={0} value={v.notificationsPerDay} onChange={(e) => set("notificationsPerDay", Number(e.target.value || 0))} />
          </Field>
          <Field label="Latency target (ms, p95)">
            <Input type="number" min={0} value={v.latencyTargetMs} onChange={(e) => set("latencyTargetMs", Number(e.target.value || 0))} />
          </Field>
        </div>

        <div className="rounded-lg border border-accent-200 bg-accent-50/50 p-4 text-xs text-ink-700 grid sm:grid-cols-3 gap-3">
          <div>
            <div className="uppercase tracking-wider text-accent-700 mb-1">Avg requests / day</div>
            <div className="font-semibold text-base text-ink-900">{reqsPerDay.toLocaleString()}</div>
          </div>
          <div>
            <div className="uppercase tracking-wider text-accent-700 mb-1">Avg requests / sec</div>
            <div className="font-semibold text-base text-ink-900">{reqsPerSec.toFixed(2)}</div>
          </div>
          <div>
            <div className="uppercase tracking-wider text-accent-700 mb-1">Estimated peak RPS</div>
            <div className="font-semibold text-base text-ink-900">{peakRps.toFixed(2)}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <div className="text-sm font-medium text-ink-800">Geographic & resilience</div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Geographic coverage">
            <Input value={v.geographicCoverage} onChange={(e) => set("geographicCoverage", e.target.value)} placeholder="e.g. North America; later EU" />
          </Field>
          <Field label="Availability target">
            <Input value={v.availabilityTarget} onChange={(e) => set("availabilityTarget", e.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-4">
          <Checkbox label="Multi-region" checked={v.multiRegion} onChange={(b) => set("multiRegion", b)} />
          <Checkbox label="DR plan required" checked={v.drNeeded} onChange={(b) => set("drNeeded", b)} />
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <div className="text-sm font-medium text-ink-800">Strategy</div>
        <Field label="Caching strategy">
          <Textarea rows={2} value={v.cachingStrategy} onChange={(e) => set("cachingStrategy", e.target.value)} placeholder="e.g. CDN edge for static, Redis for hot reads, query cache." />
        </Field>
        <Field label="Database scaling strategy">
          <Textarea rows={2} value={v.dbScalingStrategy} onChange={(e) => set("dbScalingStrategy", e.target.value)} placeholder="e.g. read replicas, partitioning by tenant, archiving cold data." />
        </Field>
        <Field label="Queue / event strategy">
          <Textarea rows={2} value={v.queueStrategy} onChange={(e) => set("queueStrategy", e.target.value)} placeholder="e.g. SQS for jobs; Kafka for events." />
        </Field>
        <Field label="Notes">
          <Textarea rows={3} value={v.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </Card>
    </div>
  );
}

// ─── AI / automation ────────────────────────────────────────────────────────
export function AIStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.ai;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { ai: { ...v, [k]: val } });
  }
  return (
    <Card className="p-6 space-y-5">
      <Checkbox label="This product needs AI / automation" checked={v.needsAI} onChange={(b) => set("needsAI", b)} />

      {v.needsAI && (
        <>
          <Field label="What kind?">
            <MultiCheck
              value={v.kinds}
              onChange={(k) => set("kinds", k)}
              options={[
                { value: "chatbot", label: "Chatbot" },
                { value: "agent", label: "Agent / multi-step workflow" },
                { value: "recommender", label: "Recommender" },
                { value: "classifier", label: "Classifier" },
                { value: "summarizer", label: "Summarizer" },
                { value: "automation", label: "Process automation" },
                { value: "vision", label: "Vision" },
                { value: "voice", label: "Voice" },
                { value: "search", label: "Semantic search" },
              ]}
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Model provider">
              <Select value={v.modelProvider} onChange={(e) => set("modelProvider", e.target.value as typeof v.modelProvider)}>
                <option value="tbd">TBD</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="azure-openai">Azure OpenAI</option>
                <option value="vertex">Google Vertex</option>
                <option value="bedrock">AWS Bedrock</option>
                <option value="open-source">Open-source / self-hosted</option>
                <option value="mixed">Mixed</option>
              </Select>
            </Field>
            <Field label="Approved data sources for grounding">
              <Input value={v.dataSources} onChange={(e) => set("dataSources", e.target.value)} placeholder="docs, knowledge base, CRM…" />
            </Field>
          </div>

          <div className="flex flex-wrap gap-4">
            <Checkbox label="RAG needed" checked={v.ragNeeded} onChange={(b) => set("ragNeeded", b)} />
            <Checkbox label="Human-in-the-loop approval" checked={v.humanInLoop} onChange={(b) => set("humanInLoop", b)} />
            <Checkbox label="Guardrails" checked={v.guardrails} onChange={(b) => set("guardrails", b)} />
            <Checkbox label="Evaluation suite" checked={v.evaluation} onChange={(b) => set("evaluation", b)} />
            <Checkbox label="Prompt management" checked={v.promptManagement} onChange={(b) => set("promptManagement", b)} />
            <Checkbox label="Audit logs" checked={v.auditLogs} onChange={(b) => set("auditLogs", b)} />
            <Checkbox label="Privacy filtering / PII" checked={v.privacyFiltering} onChange={(b) => set("privacyFiltering", b)} />
          </div>

          <Field label="Notes" hint="Constraints, agent topology, model size targets, latency budgets.">
            <Textarea rows={3} value={v.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>
        </>
      )}
    </Card>
  );
}

// ─── Compliance ─────────────────────────────────────────────────────────────
export function ComplianceStep({ project }: { project: Project }) {
  const update = useStore((s) => s.updateProject);
  const v = project.compliance;
  function set<K extends keyof typeof v>(k: K, val: (typeof v)[K]) {
    update(project.id, { compliance: { ...v, [k]: val } });
  }
  return (
    <Card className="p-6 space-y-5">
      <div className="text-sm font-medium text-ink-800">Data classes processed</div>
      <div className="flex flex-wrap gap-4">
        <Checkbox label="Personal data" checked={v.processesPersonalData} onChange={(b) => set("processesPersonalData", b)} />
        <Checkbox label="Financial / payment data" checked={v.processesFinancialData} onChange={(b) => set("processesFinancialData", b)} />
        <Checkbox label="Health data" checked={v.processesHealthData} onChange={(b) => set("processesHealthData", b)} />
      </div>

      <Field label="Compliance frameworks required">
        <MultiCheck
          value={v.frameworks}
          onChange={(f) => set("frameworks", f)}
          options={[
            { value: "GDPR", label: "GDPR" },
            { value: "UK-GDPR", label: "UK GDPR" },
            { value: "CCPA", label: "CCPA / CPRA" },
            { value: "PIPEDA", label: "PIPEDA (Canada)" },
            { value: "PHIPA", label: "PHIPA (Ontario)" },
            { value: "HIPAA", label: "HIPAA" },
            { value: "SOC2", label: "SOC 2" },
            { value: "ISO27001", label: "ISO 27001" },
            { value: "PCI-DSS", label: "PCI DSS" },
            { value: "OSFI", label: "OSFI (Canada FI)" },
            { value: "OWASP-ASVS", label: "OWASP ASVS" },
            { value: "OWASP-LLM", label: "OWASP LLM Top 10" },
            { value: "NIST-AI-RMF", label: "NIST AI RMF" },
          ]}
        />
      </Field>

      <div className="text-sm font-medium text-ink-800">Controls required</div>
      <div className="flex flex-wrap gap-4">
        <Checkbox label="Consent management" checked={v.consentMgmt} onChange={(b) => set("consentMgmt", b)} />
        <Checkbox label="Audit logging" checked={v.auditLogs} onChange={(b) => set("auditLogs", b)} />
        <Checkbox label="Encryption at rest" checked={v.encryptionAtRest} onChange={(b) => set("encryptionAtRest", b)} />
        <Checkbox label="Encryption in transit" checked={v.encryptionInTransit} onChange={(b) => set("encryptionInTransit", b)} />
        <Checkbox label="RBAC" checked={v.rbacRequired} onChange={(b) => set("rbacRequired", b)} />
        <Checkbox label="Data residency" checked={v.dataResidencyRequired} onChange={(b) => set("dataResidencyRequired", b)} />
        <Checkbox label="Incident response" checked={v.incidentResponseRequired} onChange={(b) => set("incidentResponseRequired", b)} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Pentest / red-team cadence">
          <Input value={v.pentestCadence} onChange={(e) => set("pentestCadence", e.target.value)} placeholder="annual, per-release…" />
        </Field>
        <Field label="Threat model summary">
          <Textarea rows={3} value={v.threatModel} onChange={(e) => set("threatModel", e.target.value)} placeholder="Top threats and current controls." />
        </Field>
      </div>
    </Card>
  );
}
