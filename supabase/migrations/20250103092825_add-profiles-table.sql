drop table if exists profiles;
TRUNCATE auth.users cascade;

create table 
  profiles (
    id uuid references auth.users on delete cascade not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz null,
    username text unique not null,
    full_name text not null,
    bio text default null,
    mode text default 'dark' not null,
    avatar_url text default null,
    
    primary key (id)
  );

-- This allows to enable row level security on your tables.
-- See https://supabase.com/docs/guides/database/postgres/row-level-security#enabling-row-level-security
alter table "public"."profiles" enable row level security;

-- The following create row level access policies to protect the data to
--        viewed or altered from outside.  
-- You can visit this link on your account.
-- Replace {project_id} and {table_id} with your account's data.
-- https://supabase.com/dashboard/project/{project_id}/auth/policies?search={table_id}&schema=public
create policy "Enable read access for authenticated users only"
on "public"."profiles"
as PERMISSIVE
for SELECT
to authenticated
using (true);

create policy "Enable insert access for authenticated users only"
on "public"."profiles"
as PERMISSIVE
for INSERT
to authenticated
with check (true);
