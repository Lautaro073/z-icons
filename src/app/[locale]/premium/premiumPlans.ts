import type { PremiumPlan } from "./PremiumPlanCard";

export const plans: PremiumPlan[] = [
  {
    id: "pro",
    price: "$29.99",
    badge: "plans.pro.badge",
    summary: "plans.pro.summary",
    features: [
      "plans.pro.features.icons",
      "plans.pro.features.npm",
      "plans.pro.features.updates",
      "plans.pro.features.support",
    ],
    featured: false,
  },
  {
    id: "enterprise",
    price: "$49.99",
    badge: "plans.enterprise.badge",
    summary: "plans.enterprise.summary",
    features: [
      "plans.enterprise.features.everything",
      "plans.enterprise.features.priority",
      "plans.enterprise.features.custom",
      "plans.enterprise.features.team",
    ],
    featured: true,
  },
];
