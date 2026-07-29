-- Step 1: Drop all Gemini-created policies that depend on household_members
drop policy if exists "members can read household" on public.households;
drop policy if exists "members can read children" on public.children;
drop policy if exists "members can insert children" on public.children;
drop policy if exists "members can read events" on public.events;
drop policy if exists "members can insert events" on public.events;
drop policy if exists "members can update events" on public.events;

-- Step 2: Drop the household_members table itself
drop table if exists public.household_members;

-- Step 3: Fix the infinite recursion on household_caregivers
drop policy if exists "household_caregivers: caregivers can read"
  on public.household_caregivers;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'household_caregivers: own rows'
      AND tablename = 'household_caregivers'
  ) THEN
    create policy "household_caregivers: own rows"
      on public.household_caregivers for select
      using (user_id = auth.uid());
  END IF;
END $$;

-- Step 4: Verify our original policies still exist on each table.
-- If any are missing (Gemini may have dropped them), recreate them:

-- Households
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'households: caregivers can read'
      AND tablename = 'households'
  ) THEN
    create policy "households: caregivers can read"
      on public.households for select
      using (public.is_caregiver(id) or auth.uid() = owner_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'households: owner can create'
      AND tablename = 'households'
  ) THEN
    create policy "households: owner can create"
      on public.households for insert
      with check (auth.uid() = owner_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'households: owner can read'
      AND tablename = 'households'
  ) THEN
    create policy "households: owner can read"
      on public.households for select
      using (auth.uid() = owner_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'households: caregivers can update'
      AND tablename = 'households'
  ) THEN
    create policy "households: caregivers can update"
      on public.households for update
      using (public.is_caregiver(id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'households: owner can delete'
      AND tablename = 'households'
  ) THEN
    create policy "households: owner can delete"
      on public.households for delete
      using (auth.uid() = owner_id);
  END IF;
END $$;

-- Children
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'children: caregivers can read'
      AND tablename = 'children'
  ) THEN
    create policy "children: caregivers can read"
      on public.children for select
      using (public.is_caregiver(household_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'children: caregivers can insert'
      AND tablename = 'children'
  ) THEN
    create policy "children: caregivers can insert"
      on public.children for insert
      with check (public.is_caregiver(household_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'children: caregivers can update'
      AND tablename = 'children'
  ) THEN
    create policy "children: caregivers can update"
      on public.children for update
      using (public.is_caregiver(household_id));
  END IF;
END $$;

-- Events
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'events: caregivers can read'
      AND tablename = 'events'
  ) THEN
    create policy "events: caregivers can read"
      on public.events for select
      using (public.is_caregiver(household_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'events: caregivers can insert'
      AND tablename = 'events'
  ) THEN
    create policy "events: caregivers can insert"
      on public.events for insert
      with check (public.is_caregiver(household_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'events: caregivers can update'
      AND tablename = 'events'
  ) THEN
    create policy "events: caregivers can update"
      on public.events for update
      using (public.is_caregiver(household_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'events: caregivers can delete'
      AND tablename = 'events'
  ) THEN
    create policy "events: caregivers can delete"
      on public.events for delete
      using (public.is_caregiver(household_id));
  END IF;
END $$;

-- Household caregivers insert policy (for onboarding)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'household_caregivers: owner can insert self'
      AND tablename = 'household_caregivers'
  ) THEN
    create policy "household_caregivers: owner can insert self"
      on public.household_caregivers for insert
      with check (
        user_id = auth.uid() and
        exists (
          select 1 from public.households
          where id = household_id and owner_id = auth.uid()
        )
      );
  END IF;
END $$;
