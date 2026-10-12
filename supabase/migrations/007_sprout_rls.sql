-- supabase/migrations/007_sprout_rls.sql
-- Row Level Security for the Sprout tracker tables. Reuses the existing
-- public.is_caregiver(hid) / public.is_household_admin(hid) helpers from
-- 002/003 so membership checks stay consistent with the rest of the app.
--
--   sprout_babies  — like children: caregivers read, admins manage profiles.
--   sprout_logs    — like events: any caregiver can read/log/edit/delete.

alter table public.sprout_babies enable row level security;
alter table public.sprout_logs   enable row level security;

-- ── Babies ────────────────────────────────────────────────────────────
create policy "sprout_babies: caregivers can read"
  on public.sprout_babies for select
  using (public.is_caregiver(household_id));

create policy "sprout_babies: admins can insert"
  on public.sprout_babies for insert
  with check (public.is_household_admin(household_id));

create policy "sprout_babies: admins can update"
  on public.sprout_babies for update
  using (public.is_household_admin(household_id));

create policy "sprout_babies: admins can delete"
  on public.sprout_babies for delete
  using (public.is_household_admin(household_id));

-- ── Logs ──────────────────────────────────────────────────────────────
create policy "sprout_logs: caregivers can read"
  on public.sprout_logs for select
  using (public.is_caregiver(household_id));

create policy "sprout_logs: caregivers can insert"
  on public.sprout_logs for insert
  with check (public.is_caregiver(household_id));

create policy "sprout_logs: caregivers can update"
  on public.sprout_logs for update
  using (public.is_caregiver(household_id));

create policy "sprout_logs: caregivers can delete"
  on public.sprout_logs for delete
  using (public.is_caregiver(household_id));

-- ── Grants ────────────────────────────────────────────────────────────
-- Supabase normally grants these by default, but make it explicit so the
-- authenticated client can use the tables and the merge RPCs.
grant select, insert, update, delete on public.sprout_babies to authenticated;
grant select, insert, update, delete on public.sprout_logs   to authenticated;
