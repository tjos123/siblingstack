-- supabase/migrations/006_sprout_schema.sql
-- Dedicated Sprout baby-tracker tables, scoped to the SAME households as the
-- rest of Sibling Stack (auth, households, caregivers and RLS are reused).
--
-- The tracker stores a much richer record than public.events (categories,
-- subtypes, free-form details jsonb), so it gets its own tables rather than
-- overloading events. Ids are client-generated TEXT so the local-first client
-- can create rows offline and sync them later without id conflicts.

-- ── Babies ────────────────────────────────────────────────────────────
create table if not exists public.sprout_babies (
  id                  text primary key,
  household_id        uuid references public.households(id) on delete cascade not null,
  name                text not null,
  birth_date          date not null,
  avatar_emoji        text not null default '🌱',
  color               text not null default 'sage',
  sex                 text check (sex in ('female', 'male')),
  default_bottle_brand text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted             boolean not null default false,
  -- Field-level hybrid logical clocks: { "<field>": "<hlc string>" }
  clocks              jsonb not null default '{}'::jsonb,
  updated_by          uuid references public.users(id)
);

-- ── Logs ──────────────────────────────────────────────────────────────
create table if not exists public.sprout_logs (
  id            text primary key,
  household_id  uuid references public.households(id) on delete cascade not null,
  baby_id       text references public.sprout_babies(id) on delete cascade not null,
  user_id       uuid references public.users(id),
  category      text not null,
  subtype       text,
  feed_subtype  text,
  diaper_subtype text,
  health_subtype text,
  start_time    timestamptz not null,
  end_time      timestamptz,
  details       jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted       boolean not null default false,
  -- Field-level hybrid logical clocks, including "details.<key>" entries.
  clocks        jsonb not null default '{}'::jsonb,
  updated_by    uuid references public.users(id)
);

-- ── Indexes ───────────────────────────────────────────────────────────
create index if not exists sprout_babies_household
  on public.sprout_babies (household_id, created_at);

create index if not exists sprout_logs_household_start
  on public.sprout_logs (household_id, start_time);

-- Delta pulls / conflict resolution scan by updated_at.
create index if not exists sprout_logs_household_updated
  on public.sprout_logs (household_id, updated_at);

create index if not exists sprout_babies_household_updated
  on public.sprout_babies (household_id, updated_at);

-- ── Realtime ──────────────────────────────────────────────────────────
-- Full replica identity so postgres_changes broadcasts whole rows; add the
-- tables to the realtime publication (idempotent — ignore if already added).
alter table public.sprout_logs   replica identity full;
alter table public.sprout_babies replica identity full;

do $$ begin
  alter publication supabase_realtime add table public.sprout_logs;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.sprout_babies;
exception when duplicate_object then null; end $$;
