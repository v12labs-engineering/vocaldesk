alter table "public"."users"
add column whitelabel_admin boolean default false,
add column whitelabel_user boolean default false,
add column domain text default null;