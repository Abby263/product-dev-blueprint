import { Project } from "../schema";
import { fallback, header } from "./util";

// Rough monthly cost estimate based on platform choices, capacity, and AI
// posture. Units are USD. These are PUBLIC LIST PRICES at standard tiers
// — actual bills vary widely with discounts, reservations, and traffic
// shape. The intent is order-of-magnitude planning, not procurement.

interface LineItem {
  category: string;
  detail: string;
  monthlyLow: number;
  monthlyHigh: number;
  notes: string;
}

function fmt(n: number): string {
  if (n === 0) return "$0";
  if (n < 1) return "<$1";
  return `$${Math.round(n).toLocaleString()}`;
}

function range(low: number, high: number): string {
  if (low === high) return fmt(low);
  return `${fmt(low)} – ${fmt(high)}`;
}

// --- Compute model: very rough $/req at sustained ---
// Vercel: ~$20/mo Pro + ~$0.40 per million function calls (averaged)
// AWS Lambda + ALB: ~$20 base + ~$0.20 per million Lambda + ALB hours
// Container hosts (Render/Railway): tier-priced; we assume $25-$200 by load
// Kubernetes: assume $200+ baseline for control plane + nodes
// Self-hosted/Heroku: similar baseline to Render
function computeCost(p: Project): { low: number; high: number; notes: string } {
  const peakRps = Math.max(
    (p.systemDesign.dau * p.systemDesign.avgRequestsPerUserPerDay) / 86400 * 5,
    p.systemDesign.peakConcurrent,
  );

  switch (p.platform.cloud) {
    case "vercel":
      // Pro starts ~$20; bandwidth and function execution scale by load
      if (peakRps < 5) return { low: 20, high: 60, notes: "Pro tier covers low traffic comfortably." };
      if (peakRps < 50) return { low: 60, high: 250, notes: "Pro + some function and bandwidth overage." };
      return { low: 250, high: 1500, notes: "Higher traffic — consider Enterprise quote." };
    case "netlify":
      if (peakRps < 5) return { low: 19, high: 60, notes: "Pro tier." };
      return { low: 60, high: 500, notes: "Functions + bandwidth overage." };
    case "render":
      if (peakRps < 10) return { low: 25, high: 100, notes: "Standard service tier(s)." };
      return { low: 100, high: 800, notes: "Multiple service instances + worker." };
    case "railway":
      if (peakRps < 10) return { low: 5, high: 50, notes: "Hobby / small project tier." };
      return { low: 50, high: 400, notes: "Production usage." };
    case "heroku":
      if (peakRps < 10) return { low: 25, high: 200, notes: "Hobby and Standard dynos." };
      return { low: 200, high: 1500, notes: "Performance dynos at scale." };
    case "aws":
    case "azure":
    case "gcp":
      if (peakRps < 5) return { low: 50, high: 250, notes: "Small EC2 / App Service / Cloud Run baseline." };
      if (peakRps < 50) return { low: 250, high: 1500, notes: "Multi-AZ + load balancer + autoscaling baseline." };
      return { low: 1500, high: 10000, notes: "Multi-region or large fleet — get a real estimate." };
    case "kubernetes":
      return { low: 300, high: 5000, notes: "Control plane + nodes + load balancer; Add-ons (Datadog, Argo) extra." };
    case "self-hosted":
      return { low: 0, high: 2000, notes: "Hardware/colocation only — operational labor not included." };
    default:
      return { low: 50, high: 500, notes: "Generic baseline." };
  }
}

function databaseCost(p: Project): { low: number; high: number; notes: string } {
  const dauScale = Math.max(1, Math.log10(Math.max(1, p.systemDesign.dau)) - 2); // 100 DAU → ~0; 100K → ~3
  const storage = Math.max(0, p.systemDesign.dataGrowthGBPerMonth * 12);

  switch (p.platform.database) {
    case "postgres":
      if (p.platform.cloud === "vercel" || p.platform.cloud === "netlify")
        return { low: 25, high: 250, notes: "Neon / Supabase / Vercel Postgres pairs well with Vercel-class hosts." };
      return { low: 50 + storage * 0.12, high: 400 + dauScale * 200, notes: "RDS / Cloud SQL / Aurora." };
    case "mysql":
      return { low: 50, high: 400, notes: "RDS / Cloud SQL." };
    case "mongodb":
      return { low: 60, high: 500, notes: "Atlas M10–M30 range." };
    case "dynamodb":
      return { low: 25, high: 1500, notes: "On-demand can balloon — pin RCUs/WCUs at scale." };
    case "firebase":
      return { low: 25, high: 800, notes: "Firestore reads/writes are the cost driver." };
    case "supabase":
      return { low: 25, high: 600, notes: "Supabase Pro + add-ons." };
    case "redis":
      return { low: 30, high: 250, notes: "Managed Redis if used as primary store (rare)." };
    case "elasticsearch":
      return { low: 100, high: 1500, notes: "Managed search clusters get pricey fast." };
    default:
      return { low: 50, high: 400, notes: "Generic managed DB baseline." };
  }
}

function cacheCost(p: Project): { low: number; high: number; notes: string } | null {
  if (!p.platform.caching && p.platform.database !== "redis") return null;
  return { low: 30, high: 250, notes: "Managed Redis (Upstash, Elasticache, Memorystore)." };
}

function searchCost(p: Project): { low: number; high: number; notes: string } | null {
  if (!p.platform.searchNeeded) return null;
  return { low: 100, high: 1500, notes: "Algolia, Typesense Cloud, or managed Elastic." };
}

// AI: cost per million input + output tokens, very approximate, for the
// common "business agent" workload mix (mostly input, modest output).
function aiCost(p: Project): { low: number; high: number; notes: string } | null {
  if (!p.ai.needsAI) return null;
  const dau = Math.max(1, p.systemDesign.dau);
  // Assume each active user triggers ~50K tokens of input + ~5K tokens of
  // output per day. That's heavy chat / RAG; tune per actual product.
  const inputPerMonth = (dau * 50_000 * 30) / 1_000_000; // M tokens
  const outputPerMonth = (dau * 5_000 * 30) / 1_000_000; // M tokens

  // Per-million pricing rough envelope:
  let inLow = 1, inHigh = 5, outLow = 5, outHigh = 25, label = "Frontier-tier hosted models";
  if (p.ai.modelProvider === "open-source") {
    inLow = 0; inHigh = 2; outLow = 0; outHigh = 2;
    label = "Self-hosted LLM (compute-only; ignores GPU baseline below)";
  }
  const cost = inputPerMonth * inLow + outputPerMonth * outLow;
  const costHigh = inputPerMonth * inHigh + outputPerMonth * outHigh;

  // Add observability tooling baseline
  let obsLow = 0, obsHigh = 0;
  if (p.ai.observability !== "none" && p.ai.observability !== "custom") {
    obsLow = 0;
    obsHigh = 99; // most have a free tier and a Pro plan around $50–$99
  }

  // Add vector DB baseline
  let vdbLow = 0, vdbHigh = 0;
  if (p.ai.vectorDb !== "none" && p.ai.vectorDb !== "pgvector") {
    vdbLow = 25; vdbHigh = 400;
  }

  return {
    low: cost + obsLow + vdbLow,
    high: costHigh + obsHigh + vdbHigh,
    notes: `${label}. Assumes ~50K in / 5K out tokens per DAU per day. Observability + vector DB tooling included.`,
  };
}

// GPU baseline if open-source model provider
function gpuCost(p: Project): { low: number; high: number; notes: string } | null {
  if (!p.ai.needsAI || p.ai.modelProvider !== "open-source") return null;
  return { low: 800, high: 8000, notes: "1× A10G to 1× H100, 24/7. Drops with batch + spot." };
}

function notificationsCost(p: Project): { low: number; high: number; notes: string } | null {
  if (p.systemDesign.notificationsPerDay === 0) return null;
  const monthly = p.systemDesign.notificationsPerDay * 30;
  // Assume ~25% SMS, ~25% email, ~50% push
  const smsCost = (monthly * 0.25 * 0.0075); // ~$0.0075/SMS in NA
  const emailCost = (monthly * 0.25 * 0.0001); // ~$0.10 per 1K
  const pushCost = (monthly * 0.5 * 0); // free at most volumes
  const low = Math.max(20, smsCost * 0.7 + emailCost + pushCost);
  const high = Math.max(50, smsCost + emailCost * 2 + pushCost);
  return {
    low, high,
    notes: "Rough mix: 25% SMS @ $0.0075, 25% email, 50% push (negligible).",
  };
}

function bandwidthCost(p: Project): { low: number; high: number; notes: string } | null {
  const gb = p.systemDesign.dataGrowthGBPerMonth + p.systemDesign.dau * 30 * 0.005; // ~5MB / DAU / day
  if (gb < 50) return null;
  // CDN egress ~$0.05–$0.12/GB at typical cloud rates
  return {
    low: gb * 0.04,
    high: gb * 0.12,
    notes: `Estimated egress ${Math.round(gb).toLocaleString()} GB/mo. Use CDN tier and committed-use pricing to lower.`,
  };
}

function buildItems(p: Project): LineItem[] {
  const items: LineItem[] = [];
  const compute = computeCost(p);
  items.push({ category: "Compute / hosting", detail: p.platform.cloud, monthlyLow: compute.low, monthlyHigh: compute.high, notes: compute.notes });

  const db = databaseCost(p);
  items.push({ category: "Database", detail: p.platform.database, monthlyLow: db.low, monthlyHigh: db.high, notes: db.notes });

  const cache = cacheCost(p);
  if (cache) items.push({ category: "Cache", detail: "Redis", monthlyLow: cache.low, monthlyHigh: cache.high, notes: cache.notes });

  const search = searchCost(p);
  if (search) items.push({ category: "Search", detail: "Managed search", monthlyLow: search.low, monthlyHigh: search.high, notes: search.notes });

  const ai = aiCost(p);
  if (ai) items.push({ category: "AI inference + tooling", detail: `${p.ai.modelProvider} + ${p.ai.observability} + ${p.ai.vectorDb}`, monthlyLow: ai.low, monthlyHigh: ai.high, notes: ai.notes });

  const gpu = gpuCost(p);
  if (gpu) items.push({ category: "AI compute (GPU)", detail: "Self-hosted model server", monthlyLow: gpu.low, monthlyHigh: gpu.high, notes: gpu.notes });

  const notif = notificationsCost(p);
  if (notif) items.push({ category: "Notifications", detail: "Email + SMS + push providers", monthlyLow: notif.low, monthlyHigh: notif.high, notes: notif.notes });

  const bw = bandwidthCost(p);
  if (bw) items.push({ category: "Bandwidth / CDN egress", detail: "Egress to internet", monthlyLow: bw.low, monthlyHigh: bw.high, notes: bw.notes });

  // Observability infra (non-AI)
  items.push({ category: "Observability", detail: p.platform.observability || "OpenTelemetry + Datadog", monthlyLow: 30, monthlyHigh: 500, notes: "Logs, metrics, traces, error tracking — varies hugely with volume." });

  // CI / build
  items.push({ category: "CI / CD", detail: p.platform.cicd || "GitHub Actions", monthlyLow: 0, monthlyHigh: 200, notes: "Free for small public repos; private + minutes overage scales fast." });

  return items;
}

export function generateCostEstimate(p: Project): string {
  const items = buildItems(p);
  const totalLow = items.reduce((s, i) => s + i.monthlyLow, 0);
  const totalHigh = items.reduce((s, i) => s + i.monthlyHigh, 0);

  const out: string[] = [
    header(p, `Cost estimate — ${p.name || "Untitled"}`, "Cost estimate"),
    `> **Order-of-magnitude planning estimate, not a quote.** All figures are USD/month at standard public list prices. Real costs vary with discounts, reservations, traffic shape, and your team's choices. Re-run after every material change to capacity or stack.`,
    ``,
    `## Inputs`,
    ``,
    `- **DAU:** ${p.systemDesign.dau.toLocaleString()}`,
    `- **Avg requests / user / day:** ${p.systemDesign.avgRequestsPerUserPerDay.toLocaleString()}`,
    `- **Peak concurrent:** ${p.systemDesign.peakConcurrent.toLocaleString()}`,
    `- **Data growth:** ${p.systemDesign.dataGrowthGBPerMonth} GB / month`,
    `- **Notifications:** ${p.systemDesign.notificationsPerDay.toLocaleString()} / day`,
    `- **Cloud:** ${p.platform.cloud}`,
    `- **Database:** ${p.platform.database}`,
    `- **AI in scope:** ${p.ai.needsAI ? `yes (provider: ${p.ai.modelProvider})` : "no"}`,
    ``,
    `## Estimate by line item`,
    ``,
    `| Category | Choice | Monthly (low) | Monthly (high) | Notes |`,
    `|---|---|---:|---:|---|`,
    ...items.map((i) => `| ${i.category} | ${i.detail} | ${fmt(i.monthlyLow)} | ${fmt(i.monthlyHigh)} | ${i.notes} |`),
    `| **Total (rough)** | | **${fmt(totalLow)}** | **${fmt(totalHigh)}** | |`,
    ``,
    `## Per-DAU sanity check`,
    ``,
    p.systemDesign.dau > 0
      ? `At ${p.systemDesign.dau.toLocaleString()} DAU, the high-end estimate works out to **${range(totalLow / p.systemDesign.dau, totalHigh / p.systemDesign.dau)} per DAU per month**. Compare against your pricing model and unit economics target.`
      : `_Set DAU on the System Design step to compute a per-user cost._`,
    ``,
    `## Levers if costs are too high`,
    ``,
    `1. **Move stateless compute to Vercel / Render / Railway** if currently on Kubernetes or AWS at low scale.`,
    `2. **Add caching** (Redis or CDN) for read-heavy paths — large multiplier on database cost.`,
    `3. **For AI:** route cheap requests to smaller / open-source models; cache LLM responses for repeated queries; trim context with retrieval rather than blasting prompts.`,
    `4. **Notifications:** prefer push over SMS where possible; SMS is the most expensive channel.`,
    `5. **Storage:** archive cold data to object storage (S3 IA / Glacier).`,
    `6. **Reserved capacity / committed use:** AWS / GCP discounts can be 30–60% for predictable baselines.`,
    ``,
    `## What's NOT included`,
    ``,
    `- **People** (dev, on-call, support) — usually 5–20× the infra bill.`,
    `- **Compliance** (SOC 2 audits, pentests, DPO retainers).`,
    `- **One-off** (legal review, design, GTM launch, content).`,
    `- **Reserved infrastructure** (DDoS protection, WAF, premium support tiers).`,
    `- **Marketing tooling** (analytics, CRM, customer support platforms).`,
    `- **Data egress between cloud regions** (cross-region replication can be material).`,
    fallback(p.systemDesign.notes ? `\n## System design notes\n\n${p.systemDesign.notes}` : ""),
  ];
  return out.join("\n");
}
