-- supabase/migrations/20261014000000_fix_sprout_babies_caregiver_write.sql
-- Fix: an invitee joins a household as a *caregiver* (see
-- /api/sprout/invite/join), but sprout_babies only let household *admins*
-- insert/update (007_sprout_rls.sql). Because sprout_merge* are SECURITY
-- INVOKER by design, the invitee's first sync pushed the shared baby through
-- sprout_merge and hit:
--     new row violates row-level security policy for table "sprout_babies"
--
-- The Sprout tracker is a shared family log — caregivers can already write
-- sprout_logs (and public.events) — so let caregivers write the shared baby
-- row too (adopting the baby on join, updating default_bottle_brand when they
-- log a bottle, etc.). Delete stays admin-only: sync only ever soft-deletes,
-- which goes through the update policy.
--
-- Idempotent: safe to re-run.

drop policy if exists "sprout_babies: admins can insert" on public.sprout_babies;
drop policy if exists "sprout_babies: admins can update" on public.sprout_babies;

create policy "sprout_babies: caregivers can insert"
  on public.sprout_babies for insert
  with check (public.is_caregiver(household_id));

create policy "sprout_babies: caregivers can update"
  on public.sprout_babies for update
  using (public.is_caregiver(household_id));
