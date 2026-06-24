// src/lib/config.ts
//
// Single flag controlling whether the subscription paywall is enforced
// at all. Currently false — every premium feature is unlocked for free
// while validating product-market fit, per the "affiliate-first, defer
// subscription" decision. Nothing about the Stripe/billing code was
// removed to get here; flipping this back to true re-enables the
// paywall with no rebuild required.
//
// The caregiver invite API route at src/app/api/caregiver/invite/route.ts
// checks this flag server-side too — the UI and backend must agree.
export const SUBSCRIPTION_ENABLED = false;
