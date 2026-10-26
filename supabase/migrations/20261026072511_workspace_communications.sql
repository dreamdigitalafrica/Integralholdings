begin;
create table public.cms_inquiries (
 id uuid primary key default gen_random_uuid(),
 name text not null check (length(trim(name)) between 1 and 120),
 email text not null check (length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 phone text not null default '' check (length(phone)<=40),
 sector text not null default 'Group' check (sector in ('Group','Energy','Construction','Automobiles','Realty','Agriculture','Engineering')),
 subject text not null default 'Website inquiry' check (length(subject) between 1 and 200),
 message text not null check (length(trim(message)) between 1 and 10000),
 status text not null default 'new' check (status in ('new','in_progress','resolved','spam')),
 read_at timestamptz,
 notes text not null default '' check (length(notes)<=10000),
 created_at timestamptz not null default now()
);
alter table public.cms_inquiries enable row level security;
revoke all on public.cms_inquiries from anon, authenticated;
grant insert(name,email,phone,sector,subject,message) on public.cms_inquiries to anon,authenticated;
grant select,update,delete on public.cms_inquiries to authenticated;
create policy inquiry_intake on public.cms_inquiries for insert to anon,authenticated with check (status='new' and read_at is null and notes='');
create policy inquiry_admin_read on public.cms_inquiries for select to authenticated using ((select cms_private.cms_role())='admin');
create policy inquiry_admin_update on public.cms_inquiries for update to authenticated using ((select cms_private.cms_role())='admin') with check ((select cms_private.cms_role())='admin');
create policy inquiry_admin_delete on public.cms_inquiries for delete to authenticated using ((select cms_private.cms_role())='admin');
create index cms_inquiries_created_idx on public.cms_inquiries(created_at desc);
create index cms_inquiries_email_created_idx on public.cms_inquiries(lower(email),created_at desc);
-- Only invoked by the insert trigger; the public cannot call or read this function.
create function cms_private.limit_inquiries() returns trigger language plpgsql security definer set search_path='' as $$
begin
 perform pg_advisory_xact_lock(824109);
 if (select count(*) from public.cms_inquiries where created_at>now()-interval '1 hour')>=100
 or (select count(*) from public.cms_inquiries where lower(email)=lower(new.email) and created_at>now()-interval '1 hour')>=3 then
 raise exception 'Too many messages. Please try again later.';
 end if;
 return new;
end $$;
revoke all on function cms_private.limit_inquiries() from public,anon,authenticated;
create trigger inquiry_rate_limit before insert on public.cms_inquiries for each row execute function cms_private.limit_inquiries();
create table public.cms_events (
 id uuid primary key default gen_random_uuid(), title text not null check(length(trim(title)) between 1 and 200),
 sector text not null default 'Group', starts_at timestamptz not null, ends_at timestamptz not null,
 location text not null default '', notes text not null default '',
 status text not null default 'scheduled' check(status in ('scheduled','cancelled')),
 created_at timestamptz not null default now(), check(ends_at>starts_at)
);
alter table public.cms_events enable row level security;
revoke all on public.cms_events from anon,authenticated;
grant select,insert,update on public.cms_events to authenticated;
create policy events_admin on public.cms_events for all to authenticated using ((select cms_private.cms_role())='admin') with check ((select cms_private.cms_role())='admin');
create index cms_events_starts_idx on public.cms_events(starts_at);
create table public.cms_notification_reads (
 id uuid primary key default gen_random_uuid(), staff_id uuid not null default auth.uid() references public.cms_staff(id) on delete cascade,
 source_id text not null, created_at timestamptz not null default now(), unique(staff_id,source_id)
);
alter table public.cms_notification_reads enable row level security;
revoke all on public.cms_notification_reads from anon,authenticated;
grant select,insert on public.cms_notification_reads to authenticated;
create policy notification_owner on public.cms_notification_reads for select to authenticated using (staff_id=(select auth.uid()) and (select cms_private.cms_role())='admin');
create policy notification_mark_read on public.cms_notification_reads for insert to authenticated with check(staff_id=(select auth.uid()) and (select cms_private.cms_role())='admin');
commit;
