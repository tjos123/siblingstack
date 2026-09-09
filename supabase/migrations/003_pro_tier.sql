-- supabase/migrations/003_pro_tier.sql
-- Pro / Freemium architecture:
--   1. households.plan_tier — 'free' | 'pro', driven by Stripe webhook
--   2. household_caregivers.role — 'admin' | 'caregiver'
--   3. custom event_tags table for Pro custom tracking tags

-- Household plan tier (updated by Stripe webhook via service role)
alter table public.households
  add column if not exists plan_tier text not null default 'free'
  check (plan_tier in ('free', 'pro'));

alter table public.households
  add column if not exists stripe_subscription_id text;

-- RLS: billing columns are only mutated server-side (service-role bypasses
-- RLS entirely). Revoke column-level update grants so the authenticated
-- role can never edit plan_tier / stripe_subscription_id via the existing
-- "households: caregivers can update" policy.
revoke update (plan_tier, stripe_subscription_id)
  on public.households from authenticated;

-- Caregiver role (admin = owner + full manage; caregiver = read/log only)
alter table public.household_caregivers
  add column if not exists role text not null default 'caregiver'
  check (role in ('admin', 'caregiver'));

update public.household_caregivers hc
  set role = 'admin'
  from public.households h
  where h.id = hc.household_id and h.owner_id = hc.user_id;

-- Members can see all members of their household (for the invite table),
-- and admins can update member roles.
-- Helper mirrors is_caregiver() but requires role = 'admin'. Security
-- definer avoids RLS recursion (same pattern used for is_caregiver).
create or replace function public.is_household_admin(hid uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.household_caregivers
    where household_id = hid and user_id = auth.uid() and role = 'admin'
  );
$$;

create policy "household_caregivers: members can see household rows"
  on public.household_caregivers for select
  using (public.is_caregiver(household_id));

create policy "household_caregivers: admins can update roles"
  on public.household_caregivers for update
  using (public.is_household_admin(household_id));

-- Custom event tags (Pro feature — 3+ profiles, medications, milestones, tantrums)
create table if not exists public.custom_tags (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade not null,
  label        text not null,
  color        text not null default '#F3ECE0',
  created_at   timestamptz not null default now(),
  unique (household_id, label)
);

-- Tags are a first-class concept on events going forward
alter table public.events
  add column if not exists tag text;

-- RLS for custom tags
alter table public.custom_tags enable row level security;

create policy "custom_tags: caregivers can read"
  on public.custom_tags for select
  using (public.is_caregiver(household_id));

create policy "custom_tags: caregivers can insert"
  on public.custom_tags for insert
  with check (public.is_caregiver(household_id));

create policy "custom_tags: caregivers can update"
  on public.custom_tags for update
  using (public.is_caregiver(household_id));

create policy "custom_tags: caregivers can delete"
  on public.custom_tags for delete
  using (public.is_caregiver(household_id));

-- Index for shared-household realtime + analytics lookups
create index if not exists events_household_start_created
  on public.events (household_id, created_at);

-- Enable replica identity full for realtime events so old/new rows broadcast
alter table public.events replica identity full;
alter table public.household_caregivers replica identity full;