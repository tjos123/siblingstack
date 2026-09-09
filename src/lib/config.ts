// src/lib/config.ts
//
// Single flag controlling whether the subscription paywall is enforced
// at all. Currently false — every premium feature is unlocked for free
// while validating product-market fit. Flipping this to true re-enables
// the Paddle paywall with no rebuild required.
//
// The caregiver invite API route at src/app/api/caregiver/invite/route.ts
// checks this flag server-side too — the UI and backend must agree.
export const SUBSCRIPTION_ENABLED = false;

// Pricing constants (cents)
export const PRO_MONTHLY_PRICE_CENTS = 399;
export const PRO_ANNUAL_PRICE_CENTS = 2999;

// Feature-flag utility — returns true when the household has active
// Pro access. When SUBSCRIPTION_ENABLED is false, every household is
// treated as Pro (free beta). When true, only households with
// plan_tier === 'pro' get premium features.
export type PlanTier = "free" | "pro";

export function isProUser(planTier: PlanTier | null | undefined): boolean {
  if (!SUBSCRIPTION_ENABLED) return true;
  return planTier === "pro";
}
