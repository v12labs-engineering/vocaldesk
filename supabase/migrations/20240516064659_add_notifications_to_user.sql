alter table "public"."users"
add column notify_email text default null,
add column notify_sms text default null;