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

# 3. Run the migrations in Supabase SQL editor
# supabase/migrations/001_schema.sql  (tables + indexes)
# supabase/migrations/002_rls.sql     (Row Level Security policies)

# 4. Start the dev server
npm run dev       # → localhost:3000

# 5. Run tests
npm test
```

## What's built

### App
- Public landing page (`/`) with email capture
- Blog listing (`/blog`) and MDX post route (`/blog/[slug]`)
- Auth: sign-up, sign-in, auth context (Supabase Auth)
- Onboarding: create household + both children in one form
- Dashboard: dual 24-hour timeline lanes, conflict bridges, date navigation, event log with inline edit/delete, trends & predictions (premium, currently free for all)
- Privacy Policy (`/privacy`) and Terms of Use (`/terms`)

### DB layer (`src/lib/db/`)
- `users.ts`, `households.ts`, `children.ts`, `events.ts`
- Clean boundary: all Postgres↔epoch-ms conversion happens here; the rest of the app never sees ISO strings

### API routes (`src/app/api/`)
- `waitlist/join` — public, writes to waitlist table
- `waitlist/unsubscribe` — token-based, HMAC-signed
- `waitlist/send` — admin-protected, sends via Resend
- `caregiver/invite` — auth-required, premium-checked server-side

### Pure logic (no DB dependency — fully unit tested)
- `conflicts.ts` — finds overlapping events between two children
- `trends.ts` — 14-day rolling trend analysis + predictions
- `suggestions.ts` — rule-based nudge generator

### MDX blog
- 6 launch-day posts in `src/content/blog/`
- Add more: drop `.mdx` file + one entry in `src/lib/blog.ts`
- Email capture auto-appended to every post

### Subscription flag
- `src/lib/config.ts` → `SUBSCRIPTION_ENABLED = false`
- All premium features currently free for everyone
- Flip to `true` (+ wire up Paddle/PayPal in `billing.ts`) to re-enable paywall

## Environment variables

| Variable | Where from | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | Yes (server only) |
| `NEXT_PUBLIC_APP_URL` | Your domain | Yes |
| `RESEND_API_KEY` | resend.com | For email sends |
| `UNSUBSCRIBE_SECRET` | Generate yourself | For email sends |
| `ADMIN_SECRET` | Generate yourself | For email sends |

## Deployment (Vercel)

```bash
# Push to GitHub, then connect repo to Vercel
# Add all env vars in Vercel dashboard
# Vercel auto-detects Next.js — no config needed
```

## Tests

```bash
npm test
```

13 unit tests across `conflicts.test.ts` and `trends.test.ts`. Pure logic only — no Supabase mocking needed.

## Before going live

1. Contact email is `contactus@siblingstack.com` — update if needed in `/privacy` and `/terms`
2. Set `NEXT_PUBLIC_APP_URL` to your real domain
3. Apply to Amazon Associates after first week of real traffic
4. Privacy policy and Terms of Use are live at `/privacy` and `/terms` — required for Amazon Associates application
