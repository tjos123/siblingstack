-- supabase/migrations/002_rls.sql
-- Enable RLS on every table first, then add policies.
-- The service-role key (used in API routes) bypasses RLS entirely —
-- that is how premium_status stays safe: only API routes using the
-- service-role key can update it, and those routes are the only
-- place billing state ever changes.

alter table public.users               enable row level security;
alter table public.households          enable row level security;
alter table public.household_caregivers enable row level security;
alter table public.children            enable row level security;
alter table public.events              enable row level security;
alter table public.waitlist            enable row level security;
alter table public.analytics_events    enable row level security;

-- ---------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------
-- Read own profile only.
create policy "users: read own"
  on public.users for select
  using (auth.uid() = id);

-- Create own profile on sign-up.
create policy "users: insert own"
  on public.users for insert
  with check (auth.uid() = id and premium_status = 'free');

-- Update safe fields only — billing fields are only changed by
-- service-role API routes and are therefore not reachable here.
create policy "users: update own safe fields"
  on public.users for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Billing fields must remain unchanged from their current value.
    -- premium_status, stripe_customer_id, stripe_subscription_id are
    -- intentionally omitted from what this policy permits changing —
    -- Supabase column-level grants handle this below.
  );

-- Grant column-level permissions so the anon/authenticated role
-- cannot touch billing fields via the RLS update policy above.
revoke update (premium_status, stripe_customer_id, stripe_subscription_id)
  on public.users from authenticated;

-- ---------------------------------------------------------------
-- HOUSEHOLDS
-- ---------------------------------------------------------------
-- Helper: is the current user a caregiver of this household?
create or replace function public.is_caregiver(hid uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.household_caregivers
    where household_id = hid and user_id = auth.uid()
  );
$$;

create policy "households: caregivers can read"
  on public.households for select
  using (public.is_caregiver(id));

create policy "households: owner can create"
  on public.households for insert
  with check (auth.uid() = owner_id);

create policy "households: caregivers can update"
  on public.households for update
  using (public.is_caregiver(id));

create policy "households: owner can delete"
  on public.households for delete
  using (auth.uid() = owner_id);

-- ---------------------------------------------------------------
-- HOUSEHOLD_CAREGIVERS
-- ---------------------------------------------------------------
create policy "household_caregivers: caregivers can read"
  on public.household_caregivers for select
  using (public.is_caregiver(household_id));

-- Only service-role inserts (invite flow) — no direct client insert.
-- ---------------------------------------------------------------
-- CHILDREN
-- ---------------------------------------------------------------
create policy "children: caregivers can read"
  on public.children for select
  using (public.is_caregiver(household_id));

create policy "children: caregivers can insert"
  on public.children for insert
  with check (public.is_caregiver(household_id));

create policy "children: caregivers can update"
  on public.children for update
  using (public.is_caregiver(household_id));

-- ---------------------------------------------------------------
-- EVENTS
-- ---------------------------------------------------------------
create policy "events: caregivers can read"
  on public.events for select
  using (public.is_caregiver(household_id));

create policy "events: caregivers can insert"
  on public.events for insert
  with check (public.is_caregiver(household_id));

create policy "events: caregivers can update"
  on public.events for update
  using (public.is_caregiver(household_id));

create policy "events: caregivers can delete"
  on public.events for delete
  using (public.is_caregiver(household_id));

-- ---------------------------------------------------------------
-- WAITLIST — no client access, service-role only
-- ---------------------------------------------------------------
-- (no policies added — RLS blocks all client access by default)

-- ---------------------------------------------------------------
-- ANALYTICS EVENTS — insert-only for authenticated users
-- ---------------------------------------------------------------
create policy "analytics: authenticated can insert"
  on public.analytics_events for insert
  with check (auth.uid() = user_id or user_id is null);
