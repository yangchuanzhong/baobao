create table if not exists public.schedule_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.schedule_state enable row level security;

drop policy if exists "schedule_state_select" on public.schedule_state;
drop policy if exists "schedule_state_insert" on public.schedule_state;
drop policy if exists "schedule_state_update" on public.schedule_state;
drop policy if exists "schedule_state_delete" on public.schedule_state;

create policy "schedule_state_select"
on public.schedule_state for select
using (true);

create policy "schedule_state_insert"
on public.schedule_state for insert
with check (true);

create policy "schedule_state_update"
on public.schedule_state for update
using (true)
with check (true);

insert into public.schedule_state (id, data)
values (
  'main',
  jsonb_build_object(
    'password', '1234',
    'people', jsonb_build_array(
      jsonb_build_object('name', '第一位'),
      jsonb_build_object('name', '第二位')
    ),
    'shifts', jsonb_build_array()
  )
)
on conflict (id) do nothing;
