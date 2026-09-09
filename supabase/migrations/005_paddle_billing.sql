-- supabase/migrations/005_paddle_billing.sql
-- Stripe → Paddle billing provider swap.
-- Renames the Stripe-named billing columns to Paddle equivalents using
-- guarded DO blocks so the migration is safe whether 001-004 were
-- already applied or not.

-- ── users ──────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users'
      AND column_name = 'stripe_customer_id')
  THEN
    ALTER TABLE public.users RENAME COLUMN stripe_customer_id TO paddle_customer_id;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users'
      AND column_name = 'stripe_subscription_id')
  THEN
    ALTER TABLE public.users RENAME COLUMN stripe_subscription_id TO paddle_subscription_id;
  END IF;
END $$;

-- Revoke authenticated write on the renamed billing columns so they
-- remain service-role-only.  Safe to run repeatedly.
DO $$ BEGIN
  REVOKE UPDATE (paddle_customer_id, paddle_subscription_id)
    ON public.users FROM authenticated;
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- ── households ─────────────────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'households'
      AND column_name = 'stripe_subscription_id')
  THEN
    ALTER TABLE public.households RENAME COLUMN stripe_subscription_id TO paddle_subscription_id;
  END IF;
END $$;

DO $$ BEGIN
  REVOKE UPDATE (paddle_subscription_id)
    ON public.households FROM authenticated;
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- ── comments ───────────────────────────────────────────────────────────
COMMENT ON TABLE  public.households IS
  'plan_tier + paddle_subscription_id are updated only via the Paddle webhook (service role).';

COMMENT ON COLUMN public.users.paddle_customer_id IS
  'Paddle customer id, set by the subscription webhook after the first transaction.';

COMMENT ON COLUMN public.users.paddle_subscription_id IS
  'Paddle subscription id, active only while status is active or trialing.';