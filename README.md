# Sibling Stack

A baby/toddler dual-schedule tracking tool and content site for parents whose children are close enough in age that their routines overlap — not a generic baby tracker.

## Stack

- **Next.js 14** (App Router, MDX blog, API routes)
- **Supabase** (Auth, Postgres, Row Level Security)
- **Tailwind CSS** (custom design system)
- **Vitest** (unit tests for pure logic)
- No Cloud Functions, no Firebase, no separate backend

## Quick start

```bash
# 1. Clone and install
npm install

# 2. Set up Supabase (supabase.com → create project → Settings → API)
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY

# 3. Run the migrations in Supabase SQL editor, in order:
# supabase/migrations/001_schema.sql  (tables + indexes)
# supabase/migrations/002_rls.sql     (Row Level Security policies)
# supabase/migrations/003_pro_tier.sql (plan_tier, caregiver roles, custom tags)
# supabase/migrations/004_realtime_and_roles.sql (realtime publication + admin-only manage policies)
# supabase/migrations/005_paddle_billing.sql (Stripe→Paddle column renames)
# plus the two fix migrations (caregiver RLS policies)

# 4. Start the dev server
npm run dev       # → localhost:3000

# 5. Run tests
npm test
```

## What's built

### Freemium app routes (post-auth)
- **`/app`** — Core dashboard: dual 24-hour timeline lanes, Golden Overlap banner, Quick-Log bars (Sleep/Feed/Diaper), AI Quick Log (Pro), predictions toggle (Pro), event log, conflict bridges
- **`/analytics`** — 7-day trend charts (free), 30/90-day & custom ranges and one-click Pediatrician PDF export (Pro)
- **`/print/routine`** — auto-formatted, printable Daily Routine Fridge Chart (Pro); clean white print stylesheet, one block per child with day summary, `window.print()` export
- **`/settings/household`** — child profiles (3rd+ is Pro), caregiver invite table with role management, custom event tags (Pro), Strike billing section
- Auth: sign-up, sign-in, auth context (Supabase Auth)
- Onboarding: create household + both children in one form (`/api/onboard`)
- **Paywall**: a single `ProUpgradeModal` is triggered across every gated action (invite, 3rd child, PDF export, fridge chart, AI log, predict toggle, range picker)

### Pro subscription (Paddle)
- Checkout: Paddle.js checkout overlay in `src/lib/billing.ts` (`startCheckout`) — prices come from `NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID` / `NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID`, 7-day trial configured on the Paddle price. Household id rides along as `custom_data` and the success URL is `/app?upgraded=1`
- Billing portal: `POST /api/paddle/portal` → returns the subscription's Paddle management URL (cancel / update payment method)
- Webhook: `POST /api/paddle/webhook` → `subscription.created/updated/canceled` (and more) flips `households.plan_tier` to `pro`/`free` based on status (`active`/`trialing` = pro)
- Feature flag in `src/lib/config.ts` (`SUBSCRIPTION_ENABLED`) — currently `false` so every household is treated as Pro during beta; flip to `true` to enforce the paywall

### Real-time caregiver sync (Pro)
- `src/lib/use-realtime-sync.ts` subscribes to Supabase Realtime `events` changes for a household (active when `plan_tier === 'pro'`), with a 10s polling safety net

### AI Natural-Language Log Parser
- `src/lib/nl-log-parser.ts` — parses terse parent-speak (`"Maya napped 2-3pm"`, `"Leo feed 30ml at 9:15"`) into events; voice dictation via Web Speech API in `AiQuickLog`

### DB layer (`src/lib/db/`)
- `users.ts`, `households.ts`, `children.ts`, `events.ts`, `caregivers.ts`, `tags.ts`
- Clean boundary: all Postgres↔epoch-ms conversion happens here; the rest of the app never sees ISO strings

### API routes (`src/app/api/`)
- `waitlist/join`, `waitlist/unsubscribe`, `waitlist/send`
- `caregiver/invite` — auth-required, Pro-checked server-side
- `onboard` — household + children creation
- `pdf` — server-side PDF generation via pdfkit (Pro-gated server-side too)
- `paddle/webhook`, `paddle/portal`

### Pure logic (no DB dependency — fully unit tested)
- `conflicts.ts` — finds overlapping events between two children
- `trends.ts` — rolling trend analysis + predictions
- `nl-log-parser.ts` — natural-language event parsing
- `suggestions.ts` — rule-based nudge generator

### MDX blog
- 6 launch-day posts in `src/content/blog/`
- Add more: drop `.mdx` file + one entry in `src/lib/blog.ts`
- Email capture auto-appended to every post

## Environment variables

| Variable | Where from | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | Yes (server only) |
| `NEXT_PUBLIC_APP_URL` / `APP_URL` | Your domain | Yes |
| `RESEND_API_KEY` | resend.com | For email sends |
| `UNSUBSCRIBE_SECRET` | Generate yourself | For email sends |
| `ADMIN_SECRET` | Generate yourself | For email sends |
| `PADDLE_API_KEY` | Paddle dashboard → Developer Tools | For billing (server only) |
| `PADDLE_WEBHOOK_SECRET` | Paddle dashboard → Developer Tools | For webhook signature |
| `PADDLE_ENVIRONMENT` | `sandbox` or `production` | For billing |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | Paddle dashboard → Developer Tools | Checkout overlay (client) |
| `NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID` / `NEXT_PUBLIC_PADDLE_ANNUAL_PRICE_ID` | Paddle catalog | For checkout |

## Tests

```bash
npm test
```

29 unit tests across `conflicts.test.ts`, `trends.test.ts`, and `nl-log-parser.test.ts`. Pure logic only — no Supabase mocking needed.

## Deployment (Vercel)

```bash
# Push to GitHub, then connect repo to Vercel
# Add all env vars in Vercel dashboard
# Vercel auto-detects Next.js — no config needed
```

## Before going live

1. Set the Paddle env vars (API key, client token, webhook secret, price IDs) and point a subscription webhook at `/api/paddle/webhook` (set `PADDLE_ENVIRONMENT` to match your Paddle environment)
2. Flip `SUBSCRIPTION_ENABLED` to `true` in `src/lib/config.ts` to enforce the paywall
3. Contact email is `contactus@siblingstack.com` — update if needed in `/privacy` and `/terms`
4. Set `NEXT_PUBLIC_APP_URL` to your real domain
5. Apply to Amazon Associates after first week of real traffic
6. Privacy policy and Terms of Use are live at `/privacy` and `/terms` — required for Amazon Associates application
