-- supabase/migrations/001_schema.sql
-- Run this in the Supabase SQL editor or via `supabase db push`

-- Users table (mirrors auth.users, stores app-specific fields)
create table if not exists public.users (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text not null,
  display_name text,
  -- Billing fields. Only updated via service-role API routes (stripe webhook).
  -- Regular clients use the anon key which cannot update these via RLS.
  premium_status         text not null default 'free'
                         check (premium_status in ('free', 'premium')),
  stripe_customer_id     text unique,
  stripe_subscription_id text,
  created_at   timestamptz not null default now()
);

-- Households
create table if not exists public.households (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  owner_id   uuid references public.users(id) on delete cascade not null,
  created_at timestamptz not null default now()
);

-- Junction table — who can access which household
create table if not exists public.household_caregivers (
  household_id uuid references public.households(id) on delete cascade,
  user_id      uuid references public.users(id)      on delete cascade,
  primary key (household_id, user_id)
);

-- Children (subcollection equivalent)
create table if not exists public.children (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade not null,
  name         text not null,
  birth_date   date not null,
  color_tag    text not null,
  created_at   timestamptz not null default now()
);

-- Events
create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade not null,
  child_id     uuid references public.children(id)   on delete cascade not null,
  type         text not null check (type in ('sleep','feed','diaper','milestone','note')),
  start_time   timestamptz not null,
  end_time     timestamptz,
  notes        text,
  created_by   uuid references public.users(id),
  created_at   timestamptz not null default now()
);

-- Waitlist (never readable/writable by clients — service role only)
create table if not exists public.waitlist (
  id             uuid primary key default gen_random_uuid(),
  email          text unique not null,
  source         text,
  subscribed_at  timestamptz not null default now(),
  unsubscribed   boolean not null default false
);

-- Analytics events (lightweight replacement for Firebase Analytics)
create table if not exists public.analytics_events (
  id         bigint generated always as identity primary key,
  event_name text not null,
  params     jsonb,
  user_id    uuid,
  created_at timestamptz not null default now()
);

-- Performance indexes
create index if not exists events_household_start
  on public.events (household_id, start_time);

create index if not exists children_household
  on public.children (household_id, birth_date);
