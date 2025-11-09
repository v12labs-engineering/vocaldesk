alter table "public"."phones"
add column is_disabled boolean default false,
add column disabled_mechanism jsonb null;