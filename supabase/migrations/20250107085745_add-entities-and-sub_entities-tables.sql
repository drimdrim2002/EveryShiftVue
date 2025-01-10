drop table if exists entities;
drop type if exists current_status;

create type current_status as enum ('todo','in-progress', 'completed');

create table
  entities(
    id bigint primary key generated always as identity not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz null,
    name text unique not null,
    description text null,
    due_date date default null,
    slug text unique not null,
    status current_status default 'todo' not null
  );

  drop table if exists sub_entities;

create table 
  sub_entities (
    id bigint primary key generated always as identity not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz null,
    name text not null,
    status current_status default 'todo' not null,
    description text not null,
    due_date date default null,
    profile_id uuid references profiles (id) on delete cascade not null,
    entity_id bigint references entities (id) on delete cascade default null
  );

alter table "public"."entities" enable row level security;
alter table "public"."sub_entities" enable row level security;

create policy "Enable read access for authenticated users only"
on "public"."entities"
as PERMISSIVE
for SELECT
to authenticated
using (true);

create policy "Enable insert access for authenticated users only"
on "public"."entities"
as PERMISSIVE
for INSERT
to authenticated
with check (true);

create policy "Enable update access for authenticated users only"
on "public"."entities"
as PERMISSIVE
for UPDATE
to authenticated
using (true)
with check (true);

create policy "Enable delete access for authenticated users only"
on "public"."entities"
as PERMISSIVE
for DELETE
to authenticated
using (true);

create policy "Enable read access for authenticated users only"
on "public"."sub_entities"
as PERMISSIVE
for SELECT
to authenticated
using (true);

create policy "Enable insert access for authenticated users only"
on "public"."sub_entities"
as PERMISSIVE
for INSERT
to authenticated
with check (true);

create policy "Enable update access for authenticated users only"
on "public"."sub_entities"
as PERMISSIVE
for UPDATE
to authenticated
using (true)
with check (true);

create policy "Enable delete access for authenticated users only"
on "public"."sub_entities"
as PERMISSIVE
for DELETE
to authenticated
using (true);