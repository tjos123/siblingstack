-- Fix 1: household_caregivers had no client-side INSERT policy.
-- createHousehold() uses the browser client, so RLS blocked the insert.
-- This policy lets the household owner add themselves as first caregiver.

create policy "household_caregivers: owner can insert self"
  on public.household_caregivers for insert
  with check (
    user_id = auth.uid() and
    exists (
      select 1 from public.households
      where id = household_id and owner_id = auth.uid()
    )
  );

-- Fix 2: The insert policy above has a circular RLS dependency.
-- To evaluate the WITH CHECK clause it SELECTs from households,
-- but the only SELECT policy on households requires is_caregiver(),
-- which fails because the user is not yet a caregiver.
-- Adding owner_id = auth.uid() lets the owner always read their own row.

create policy "households: owner can read"
  on public.households for select
  using (auth.uid() = owner_id);
