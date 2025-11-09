create table
  public.api_keys (
    id bigserial,
    user_id uuid not null,
    api_key text unique not null,
    created_at timestamp with time zone null default now(),
    constraint api_keys_pkey primary key (id),
    constraint api_keys_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

alter table api_keys enable row level security;
create policy "Enable read access for all users" on "public"."api_keys" as permissive for select to public using (true);
create policy "Enable insert for users based on user_id" on "public"."api_keys" as permissive for insert to public with check ((auth.uid() = user_id));
create policy "Users can update their own api_keys" on "public"."api_keys" as permissive for update to authenticated using ((( SELECT auth.uid() AS uid) = user_id));