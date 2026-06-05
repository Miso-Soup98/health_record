-- Optional cloud sync schema for the Health Record PWA.
-- Run this in the Supabase SQL editor, then paste the project URL and anon key
-- into the app's Settings screen.

create table if not exists public.health_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.health_app_state enable row level security;

drop policy if exists "health_app_state_select_own" on public.health_app_state;
drop policy if exists "health_app_state_insert_own" on public.health_app_state;
drop policy if exists "health_app_state_update_own" on public.health_app_state;

create policy "health_app_state_select_own"
on public.health_app_state
for select
using (auth.uid() = user_id);

create policy "health_app_state_insert_own"
on public.health_app_state
for insert
with check (auth.uid() = user_id);

create policy "health_app_state_update_own"
on public.health_app_state
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.set_health_app_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_health_app_state_updated_at on public.health_app_state;

create trigger set_health_app_state_updated_at
before update on public.health_app_state
for each row
execute function public.set_health_app_state_updated_at();
