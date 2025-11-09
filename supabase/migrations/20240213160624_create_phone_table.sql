/**
* PHONES
* Note: this is a private table that contains a mapping of user IDs to Phone numbers.
*/
create table phones (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  -- The user's phone number
  number text
);

alter table phones enable row level security;
create policy "Enable insert for authenticated users only" on "public"."phones" as permissive for insert to authenticated with check (true);
create policy "Enable read access for all users" on "public"."phones" as permissive for select to public using (true);