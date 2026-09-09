-- supabase/migrations/004_realtime_and_roles.sql
-- Two fixes after reviewing the Freemium build against spec:
--
--  1. SUPABASE REALTIME PUBLICATION — the Pro real-time caregiver sync
--     subscribes via postgres_changes, but no migration ever added the
--     events table to the `supabase_realtime` publication. Without this,
--     the WebSocket channel silently never fires and only the 10s polling
--     fallback works. This is the required step.
--
--  2. ROLE-BASED PERMISSIONS — spec: "Admin vs Caregiver Read/Log mode".
--     Caregivers can read + log events, but profile management, member
--     invites and tag management are admin-only. Tighten the permissive
--     caregiver-wide policies from 002/003.

-- ── 1. Real-time publication ──────────────────────────────────────────
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.household_caregivers;

-- ── 2. Children: read stays caregiver-wide, manage becomes admin-only ──
drop policy if exists "children: caregivers can insert" on public.children;
create policy "children: admins can insert"
  on public.children for insert
  with check (public.is_household_admin(household_id));

drop policy if exists "children: caregivers can update" on public.children;
create policy "children: admins can update"
  on public.children for update
  using (public.is_household_admin(household_id));

-- ── 3. Custom tags: manage is admin-only (reading a tag is implicit) ──
drop policy if exists "custom_tags: caregivers can insert" on public.custom_tags;
create policy "custom_tags: admins can insert"
  on public.custom_tags for insert
  with check (public.is_household_admin(household_id));

drop policy if exists "custom_tags: caregivers can update" on public.custom_tags;
create policy "custom_tags: admins can update"
  on public.custom_tags for update
  using (public.is_household_admin(household_id));

drop policy if exists "custom_tags: caregivers can delete" on public.custom_tags;
create policy "custom_tags: admins can delete"
  on public.custom_tags for delete
  using (public.is_household_admin(household_id));

-- ── 4. Owners can never be demoted by another admin ───────────────────
drop policy if exists "household_caregivers: admins can update roles"
  on public.household_caregivers;
create policy "household_caregivers: admins can update roles"
  on public.household_caregivers for update
  using (public.is_household_admin(household_id))
  with check (
    public.is_household_admin(household_id)
    and not exists (
      select 1 from public.households h
      where h.id = household_id and h.owner_id = user_id
    )
  );