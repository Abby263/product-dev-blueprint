// Rule-based feature suggestions. Each feature includes sensible
// defaults so users can accept them with one click and customize later.

import { Project, Feature } from "./schema";
import { uid } from "./ids";

interface Suggestion {
  name: string;
  description: string;
  userStory: string;
  priority: Feature["priority"];
  complexity: Feature["complexity"];
  businessValue: Feature["businessValue"];
  release: Feature["release"];
}

const COMMON: Suggestion[] = [
  { name: "User registration & login", description: "Account creation, login, password reset, session.", userStory: "As a new user, I can sign up and sign in so I can access my data.", priority: "must", complexity: "M", businessValue: "high", release: "mvp" },
  { name: "Profile & settings", description: "Edit profile, notification preferences, password change.", userStory: "As a user, I can manage my profile and preferences.", priority: "should", complexity: "S", businessValue: "medium", release: "mvp" },
  { name: "Role-based access control", description: "Roles, permissions, scope checks on every protected route.", userStory: "As an admin, I can grant or revoke access by role.", priority: "must", complexity: "M", businessValue: "high", release: "mvp" },
  { name: "Audit logging", description: "Append-only log of sensitive actions with actor, target, time.", userStory: "As a compliance owner, I can review who did what and when.", priority: "should", complexity: "M", businessValue: "high", release: "mvp" },
];

const QUEUE: Suggestion[] = [
  { name: "Business / location registration", description: "Multi-location org with branches, hours, and services.", userStory: "As an operator, I register my locations so customers can choose one.", priority: "must", complexity: "M", businessValue: "high", release: "mvp" },
  { name: "Queue creation", description: "Create queues per service or branch, with capacity rules.", userStory: "As a manager, I create and configure a queue.", priority: "must", complexity: "M", businessValue: "high", release: "mvp" },
  { name: "Customer joins queue", description: "Customer takes a number from web, app, or kiosk.", userStory: "As a customer, I take a number remotely so I don't wait in person.", priority: "must", complexity: "M", businessValue: "high", release: "mvp" },
  { name: "Estimated wait time", description: "Live ETA shown to customers, recomputed as the queue advances.", userStory: "As a customer, I see how long until my turn so I can plan.", priority: "must", complexity: "L", businessValue: "high", release: "mvp" },
  { name: "Real-time queue status", description: "Customer-side and staff-side live status with position updates.", userStory: "As a staff member, I see live queue state so I can route customers.", priority: "must", complexity: "L", businessValue: "high", release: "mvp" },
  { name: "Notifications & reminders", description: "Email/SMS/push when turn is near, plus arrival reminders.", userStory: "As a customer, I get reminded when my turn approaches.", priority: "must", complexity: "M", businessValue: "high", release: "mvp" },
  { name: "Cancel / reschedule", description: "Customer can cancel or pick a new slot before arrival.", userStory: "As a customer, I cancel or move my slot if plans change.", priority: "should", complexity: "S", businessValue: "medium", release: "mvp" },
  { name: "Walk-in vs. pre-booked merge", description: "Single fairness algorithm for walk-ins and bookings.", userStory: "As an operator, I run one merged queue without favouring channels.", priority: "should", complexity: "L", businessValue: "high", release: "v1" },
  { name: "VIP / priority routing", description: "Promote urgent or VIP customers within policy.", userStory: "As an operator, I prioritize urgent customers transparently.", priority: "could", complexity: "M", businessValue: "medium", release: "v1" },
  { name: "Late-arrival policy", description: "Configurable rules for late arrivals — skip, requeue, or hold.", userStory: "As an operator, I enforce a late policy automatically.", priority: "should", complexity: "M", businessValue: "medium", release: "v1" },
  { name: "Staff dashboard", description: "Per-station view with calls, holds, transfers, and notes.", userStory: "As a staff member, I work the queue from a single screen.", priority: "must", complexity: "L", businessValue: "high", release: "mvp" },
  { name: "Analytics dashboard", description: "Volume, ETA accuracy, abandonment, NPS, by location/time.", userStory: "As a manager, I see metrics that drive staffing decisions.", priority: "should", complexity: "L", businessValue: "high", release: "v1" },
  { name: "Multi-location support", description: "Tenant-aware data and per-location settings.", userStory: "As a regional admin, I manage many branches under one account.", priority: "must", complexity: "L", businessValue: "high", release: "mvp" },
  { name: "Feedback & rating", description: "Post-visit rating with optional comment, gated to actual visits.", userStory: "As a customer, I rate my experience after my visit.", priority: "should", complexity: "S", businessValue: "medium", release: "v1" },
  { name: "Kiosk mode", description: "Self-serve in-branch screen with idle timeout and PIN.", userStory: "As a walk-in, I take a number from the kiosk.", priority: "could", complexity: "M", businessValue: "medium", release: "v1" },
];

const PAYMENT: Suggestion = { name: "Payment integration", description: "Pre-authorize or capture for paid services.", userStory: "As a paid customer, I pay before or after the service.", priority: "should", complexity: "L", businessValue: "high", release: "v1" };

const MARKETPLACE: Suggestion[] = [
  { name: "Listing creation", description: "Sellers create listings with media, pricing, attributes.", userStory: "As a seller, I publish a listing.", priority: "must", complexity: "L", businessValue: "high", release: "mvp" },
  { name: "Search & discovery", description: "Faceted search, filters, sort, and ranking.", userStory: "As a buyer, I find what I want quickly.", priority: "must", complexity: "L", businessValue: "high", release: "mvp" },
  { name: "Checkout & escrow", description: "Order, payment, and seller payout flow.", userStory: "As a buyer, I purchase safely.", priority: "must", complexity: "XL", businessValue: "high", release: "mvp" },
  { name: "Reviews & reputation", description: "Two-sided reviews with moderation.", userStory: "As a buyer, I trust ratings before I buy.", priority: "should", complexity: "M", businessValue: "high", release: "v1" },
];

const AI_AGENT: Suggestion[] = [
  { name: "Conversation interface", description: "Streamed chat UI with thread history and tools panel.", userStory: "As a user, I converse with the agent across sessions.", priority: "must", complexity: "M", businessValue: "high", release: "mvp" },
  { name: "RAG retrieval", description: "Embed, search, and ground answers in approved sources.", userStory: "As a user, I get answers grounded in my company data.", priority: "must", complexity: "L", businessValue: "high", release: "mvp" },
  { name: "Tool/function calling", description: "Agent invokes typed functions to take actions.", userStory: "As a user, the agent does things, not just answers.", priority: "should", complexity: "L", businessValue: "high", release: "mvp" },
  { name: "Eval suite", description: "Offline + online evaluation against reference answers and policies.", userStory: "As a maintainer, I detect regressions before users do.", priority: "must", complexity: "L", businessValue: "high", release: "mvp" },
  { name: "Guardrails", description: "Prompt-injection defenses, output validation, PII filtering.", userStory: "As a security owner, I prevent unsafe outputs and inputs.", priority: "must", complexity: "M", businessValue: "high", release: "mvp" },
];

const ADMIN: Suggestion[] = [
  { name: "Admin dashboard", description: "Operator console with users, tenants, billing, and feature flags.", userStory: "As an admin, I run the platform from a single dashboard.", priority: "must", complexity: "L", businessValue: "high", release: "v1" },
  { name: "Feature flags", description: "Per-tenant, per-user toggles with audit trail.", userStory: "As a PM, I roll features out safely behind flags.", priority: "should", complexity: "M", businessValue: "high", release: "v1" },
];

export function suggestFeatures(p: Project): Feature[] {
  const set = new Map<string, Suggestion>();
  const add = (s: Suggestion) => set.set(s.name, s);

  COMMON.forEach(add);

  const tm = p.experience.timingModel;
  if (tm === "real-time-queue" || tm === "both") QUEUE.forEach(add);
  if (tm === "appointment" || tm === "both") {
    add({ name: "Appointment booking", description: "Slot selection with reminders, holds, and rescheduling.", userStory: "As a customer, I book a slot that fits my day.", priority: "must", complexity: "L", businessValue: "high", release: "mvp" });
  }

  if (p.gtm.packaging !== "internal-only") add(PAYMENT);
  if (p.platform.kinds.includes("marketplace")) MARKETPLACE.forEach(add);
  if (p.platform.kinds.includes("ai-agent") || p.ai.needsAI) AI_AGENT.forEach(add);
  if (p.platform.kinds.includes("admin-dashboard") || p.platform.webAdmin) ADMIN.forEach(add);

  if (p.experience.notifications.length > 0) {
    add({ name: "Notification center", description: "Per-user inbox with read state across channels.", userStory: "As a user, I see all my notifications in one place.", priority: "should", complexity: "M", businessValue: "medium", release: "v1" });
  }
  if (p.experience.localization && p.experience.localization.split(",").length > 1) {
    add({ name: "Internationalization", description: "Locale-aware copy, dates, currencies, and RTL support.", userStory: "As an international user, the product feels native to my locale.", priority: "should", complexity: "M", businessValue: "medium", release: "v1" });
  }

  return Array.from(set.values()).map((s, i) => ({
    id: `FEAT-${String(i + 1).padStart(3, "0")}`,
    name: s.name,
    description: s.description,
    userStory: s.userStory,
    acceptance: "",
    priority: s.priority,
    complexity: s.complexity,
    businessValue: s.businessValue,
    dependencies: "",
    apisNeeded: "",
    dataNeeded: "",
    edgeCases: "",
    errorStates: "",
    adminControls: "",
    audit: "",
    security: "",
    futureEnhancements: "",
    release: s.release,
  }));
}

export function newBlankFeature(existing: Feature[]): Feature {
  const idx = existing.length + 1;
  return {
    id: `FEAT-${String(idx).padStart(3, "0")}`,
    name: "",
    description: "",
    userStory: "",
    acceptance: "",
    priority: "should",
    complexity: "M",
    businessValue: "medium",
    dependencies: "",
    apisNeeded: "",
    dataNeeded: "",
    edgeCases: "",
    errorStates: "",
    adminControls: "",
    audit: "",
    security: "",
    futureEnhancements: "",
    release: "v1",
  };
}
