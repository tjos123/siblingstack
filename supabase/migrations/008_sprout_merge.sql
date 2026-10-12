-- supabase/migrations/008_sprout_merge.sql
-- Field-level merge for the Sprout tracker.
--
-- Each client stamps every field it changes with a Hybrid Logical Clock (HLC)
-- string (lexicographically sortable: "<millis>:<counter>:<actor>"). When a
-- row is pushed, the server keeps, for every field, the value whose clock is
-- the greatest. This makes concurrent edits on different fields merge cleanly
-- (unlike a row-level "last write wins").
--
-- Clocks live in sprout_*.clocks as { "<field>": "<hlc>" }. Detail values are
-- tracked per key as "details.<key>".
--
-- These functions are SECURITY INVOKER (the default) on purpose: all access
-- still goes through the RLS policies from 007_sprout_rls.sql, so a caller can
-- only merge rows in households they belong to.

-- ── Babies ────────────────────────────────────────────────────────────
create or replace function public.sprout_merge_baby(p_baby jsonb)
returns jsonb
language plpgsql
as $$
declare
  v_id       text := nullif(p_baby->>'id', '');
  v_existing public.sprout_babies%rowtype;
  v_row      public.sprout_babies%rowtype;
  v_inc      jsonb := coalesce(p_baby->'clocks', '{}'::jsonb);
  v_clocks   jsonb;
  v_household uuid;
  v_name     text;
  v_birth    date;
  v_avatar   text;
  v_color    text;
  v_sex      text;
  v_brand    text;
  v_deleted  boolean;
  v_created  timestamptz;
begin
  if v_id is null then
    raise exception 'sprout_merge_baby: id is required';
  end if;

  select * into v_existing from public.sprout_babies where id = v_id;
  v_clocks := coalesce(v_existing.clocks, '{}'::jsonb);

  if v_inc ? 'name' and coalesce(v_clocks->>'name', '') < (v_inc->>'name') then
    v_name := p_baby->>'name'; v_clocks := jsonb_set(v_clocks, '{name}', v_inc->'name', true);
  else v_name := coalesce(v_existing.name, p_baby->>'name'); end if;

  if v_inc ? 'birth_date' and coalesce(v_clocks->>'birth_date', '') < (v_inc->>'birth_date') then
    v_birth := nullif(p_baby->>'birth_date','')::date; v_clocks := jsonb_set(v_clocks, '{birth_date}', v_inc->'birth_date', true);
  else v_birth := coalesce(v_existing.birth_date, nullif(p_baby->>'birth_date','')::date); end if;

  if v_inc ? 'avatar_emoji' and coalesce(v_clocks->>'avatar_emoji', '') < (v_inc->>'avatar_emoji') then
    v_avatar := p_baby->>'avatar_emoji'; v_clocks := jsonb_set(v_clocks, '{avatar_emoji}', v_inc->'avatar_emoji', true);
  else v_avatar := coalesce(v_existing.avatar_emoji, p_baby->>'avatar_emoji', '🌱'); end if;

  if v_inc ? 'color' and coalesce(v_clocks->>'color', '') < (v_inc->>'color') then
    v_color := p_baby->>'color'; v_clocks := jsonb_set(v_clocks, '{color}', v_inc->'color', true);
  else v_color := coalesce(v_existing.color, p_baby->>'color', 'sage'); end if;

  if v_inc ? 'sex' and coalesce(v_clocks->>'sex', '') < (v_inc->>'sex') then
    v_sex := nullif(p_baby->>'sex',''); v_clocks := jsonb_set(v_clocks, '{sex}', v_inc->'sex', true);
  else v_sex := coalesce(v_existing.sex, nullif(p_baby->>'sex','')); end if;

  if v_inc ? 'default_bottle_brand' and coalesce(v_clocks->>'default_bottle_brand', '') < (v_inc->>'default_bottle_brand') then
    v_brand := p_baby->>'default_bottle_brand'; v_clocks := jsonb_set(v_clocks, '{default_bottle_brand}', v_inc->'default_bottle_brand', true);
  else v_brand := coalesce(v_existing.default_bottle_brand, p_baby->>'default_bottle_brand'); end if;

  if v_inc ? 'deleted' and coalesce(v_clocks->>'deleted', '') < (v_inc->>'deleted') then
    v_deleted := coalesce((p_baby->>'deleted')::boolean, false); v_clocks := jsonb_set(v_clocks, '{deleted}', v_inc->'deleted', true);
  else v_deleted := coalesce(v_existing.deleted, (p_baby->>'deleted')::boolean, false); end if;

  v_household := coalesce(v_existing.household_id, nullif(p_baby->>'household_id','')::uuid);
  if v_household is null then
    raise exception 'sprout_merge_baby: household_id is required';
  end if;

  v_created := coalesce(v_existing.created_at, nullif(p_baby->>'created_at','')::timestamptz, now());

  insert into public.sprout_babies
    (id, household_id, name, birth_date, avatar_emoji, color, sex,
     default_bottle_brand, created_at, updated_at, deleted, clocks, updated_by)
  values
    (v_id, v_household, v_name, v_birth, v_avatar, v_color, v_sex,
     v_brand, v_created, now(), v_deleted, v_clocks, auth.uid())
  on conflict (id) do update set
    name                = excluded.name,
    birth_date          = excluded.birth_date,
    avatar_emoji        = excluded.avatar_emoji,
    color               = excluded.color,
    sex                 = excluded.sex,
    default_bottle_brand = excluded.default_bottle_brand,
    updated_at          = now(),
    deleted             = excluded.deleted,
    clocks              = excluded.clocks,
    updated_by          = auth.uid()
  returning * into v_row;

  return to_jsonb(v_row);
end;
$$;

-- ── Logs ──────────────────────────────────────────────────────────────
create or replace function public.sprout_merge_log(p_log jsonb)
returns jsonb
language plpgsql
as $$
declare
  v_id       text := nullif(p_log->>'id', '');
  v_existing public.sprout_logs%rowtype;
  v_row      public.sprout_logs%rowtype;
  v_inc      jsonb := coalesce(p_log->'clocks', '{}'::jsonb);
  v_clocks   jsonb;
  v_details  jsonb;
  v_baby_id  text;
  v_baby_hh  uuid;
  v_household uuid;
  v_user_id  uuid;
  v_category text;
  v_subtype  text;
  v_feed     text;
  v_diaper   text;
  v_health   text;
  v_start    timestamptz;
  v_end      timestamptz;
  v_deleted  boolean;
  v_created  timestamptz;
  v_key      text;
begin
  if v_id is null then
    raise exception 'sprout_merge_log: id is required';
  end if;

  select * into v_existing from public.sprout_logs where id = v_id;
  v_clocks := coalesce(v_existing.clocks, '{}'::jsonb);

  if v_inc ? 'category' and coalesce(v_clocks->>'category', '') < (v_inc->>'category') then
    v_category := p_log->>'category'; v_clocks := jsonb_set(v_clocks, '{category}', v_inc->'category', true);
  else v_category := coalesce(v_existing.category, p_log->>'category'); end if;

  if v_inc ? 'subtype' and coalesce(v_clocks->>'subtype', '') < (v_inc->>'subtype') then
    v_subtype := nullif(p_log->>'subtype',''); v_clocks := jsonb_set(v_clocks, '{subtype}', v_inc->'subtype', true);
  else v_subtype := coalesce(v_existing.subtype, nullif(p_log->>'subtype','')); end if;

  if v_inc ? 'feed_subtype' and coalesce(v_clocks->>'feed_subtype', '') < (v_inc->>'feed_subtype') then
    v_feed := nullif(p_log->>'feed_subtype',''); v_clocks := jsonb_set(v_clocks, '{feed_subtype}', v_inc->'feed_subtype', true);
  else v_feed := coalesce(v_existing.feed_subtype, nullif(p_log->>'feed_subtype','')); end if;

  if v_inc ? 'diaper_subtype' and coalesce(v_clocks->>'diaper_subtype', '') < (v_inc->>'diaper_subtype') then
    v_diaper := nullif(p_log->>'diaper_subtype',''); v_clocks := jsonb_set(v_clocks, '{diaper_subtype}', v_inc->'diaper_subtype', true);
  else v_diaper := coalesce(v_existing.diaper_subtype, nullif(p_log->>'diaper_subtype','')); end if;

  if v_inc ? 'health_subtype' and coalesce(v_clocks->>'health_subtype', '') < (v_inc->>'health_subtype') then
    v_health := nullif(p_log->>'health_subtype',''); v_clocks := jsonb_set(v_clocks, '{health_subtype}', v_inc->'health_subtype', true);
  else v_health := coalesce(v_existing.health_subtype, nullif(p_log->>'health_subtype','')); end if;

  if v_inc ? 'start_time' and coalesce(v_clocks->>'start_time', '') < (v_inc->>'start_time') then
    v_start := nullif(p_log->>'start_time','')::timestamptz; v_clocks := jsonb_set(v_clocks, '{start_time}', v_inc->'start_time', true);
  else v_start := coalesce(v_existing.start_time, nullif(p_log->>'start_time','')::timestamptz); end if;
  if v_start is null then v_start := now(); end if;

  if v_inc ? 'end_time' and coalesce(v_clocks->>'end_time', '') < (v_inc->>'end_time') then
    v_end := nullif(p_log->>'end_time','')::timestamptz; v_clocks := jsonb_set(v_clocks, '{end_time}', v_inc->'end_time', true);
  else v_end := coalesce(v_existing.end_time, nullif(p_log->>'end_time','')::timestamptz); end if;

  if v_inc ? 'deleted' and coalesce(v_clocks->>'deleted', '') < (v_inc->>'deleted') then
    v_deleted := coalesce((p_log->>'deleted')::boolean, false); v_clocks := jsonb_set(v_clocks, '{deleted}', v_inc->'deleted', true);
  else v_deleted := coalesce(v_existing.deleted, (p_log->>'deleted')::boolean, false); end if;

  -- details: merge key by key using "details.<key>" clocks
  v_details := coalesce(v_existing.details, '{}'::jsonb);
  if jsonb_typeof(p_log->'details') = 'object' then
    for v_key in select jsonb_object_keys(p_log->'details') loop
      if v_inc ? ('details.' || v_key)
         and coalesce(v_clocks->>('details.' || v_key), '') < (v_inc->>('details.' || v_key)) then
        v_details := jsonb_set(v_details, array[v_key], p_log->'details'->v_key, true);
        v_clocks  := jsonb_set(v_clocks, array['details.' || v_key], v_inc->('details.' || v_key), true);
      elsif not (v_clocks ? ('details.' || v_key)) then
        v_details := jsonb_set(v_details, array[v_key], p_log->'details'->v_key, true);
      end if;
    end loop;
  end if;

  v_baby_id   := coalesce(v_existing.baby_id, nullif(p_log->>'baby_id',''));
  v_household := coalesce(v_existing.household_id, nullif(p_log->>'household_id','')::uuid);
  if v_baby_id is null or v_household is null then
    raise exception 'sprout_merge_log: baby_id and household_id are required';
  end if;

  -- Guard against cross-household references (RLS would also block the write).
  select household_id into v_baby_hh from public.sprout_babies where id = v_baby_id;
  if v_baby_hh is null then
    raise exception 'sprout_merge_log: baby % not found (sync babies first)', v_baby_id;
  end if;
  if v_baby_hh <> v_household then
    raise exception 'sprout_merge_log: baby/household mismatch';
  end if;

  v_user_id := coalesce(v_existing.user_id, nullif(p_log->>'user_id','')::uuid);
  v_created := coalesce(v_existing.created_at, nullif(p_log->>'created_at','')::timestamptz, now());

  insert into public.sprout_logs
    (id, household_id, baby_id, user_id, category, subtype, feed_subtype,
     diaper_subtype, health_subtype, start_time, end_time, details,
     created_at, updated_at, deleted, clocks, updated_by)
  values
    (v_id, v_household, v_baby_id, v_user_id, v_category, v_subtype, v_feed,
     v_diaper, v_health, v_start, v_end, v_details,
     v_created, now(), v_deleted, v_clocks, auth.uid())
  on conflict (id) do update set
    category       = excluded.category,
    subtype        = excluded.subtype,
    feed_subtype   = excluded.feed_subtype,
    diaper_subtype = excluded.diaper_subtype,
    health_subtype = excluded.health_subtype,
    start_time     = excluded.start_time,
    end_time       = excluded.end_time,
    details        = excluded.details,
    updated_at     = now(),
    deleted        = excluded.deleted,
    clocks         = excluded.clocks,
    updated_by     = auth.uid()
  returning * into v_row;

  return to_jsonb(v_row);
end;
$$;

-- ── Batch merge ───────────────────────────────────────────────────────
-- Accepts { "babies": [...], "logs": [...] } and returns the merged rows.
-- Babies are processed first so logs can reference them.
create or replace function public.sprout_merge(p_payload jsonb)
returns jsonb
language plpgsql
as $$
declare
  v_item     jsonb;
  v_babies   jsonb := '[]'::jsonb;
  v_logs     jsonb := '[]'::jsonb;
begin
  for v_item in select jsonb_array_elements(coalesce(p_payload->'babies', '[]'::jsonb)) loop
    v_babies := v_babies || public.sprout_merge_baby(v_item);
  end loop;

  for v_item in select jsonb_array_elements(coalesce(p_payload->'logs', '[]'::jsonb)) loop
    v_logs := v_logs || public.sprout_merge_log(v_item);
  end loop;

  return jsonb_build_object('babies', v_babies, 'logs', v_logs);
end;
$$;

grant execute on function public.sprout_merge_baby(jsonb) to authenticated;
grant execute on function public.sprout_merge_log(jsonb)  to authenticated;
grant execute on function public.sprout_merge(jsonb)      to authenticated;
