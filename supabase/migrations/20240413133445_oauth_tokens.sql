create table
  public.oauth_tokens (
    id bigserial,
    user_id uuid not null,
    service character varying(255) not null,
    access_token text not null,
    refresh_token text null,
    expires_in timestamp with time zone null,
    token_type character varying(50) null,
    scope text null,
    metadata jsonb null,
    created_at timestamp with time zone null default now(),
    constraint oauth_tokens_pkey primary key (id),
    constraint unique_user_service unique (user_id, service),
    constraint oauth_tokens_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

alter table oauth_tokens enable row level security;
create policy "Enable read access for all users" on "public"."oauth_tokens" as permissive for select to public using (true);
create policy "Enable insert for users based on user_id" on "public"."oauth_tokens" as permissive for insert to public with check ((auth.uid() = user_id));
create policy "Users can update their own oauth_tokens" on "public"."oauth_tokens" as permissive for update to authenticated using ((( SELECT auth.uid() AS uid) = user_id));