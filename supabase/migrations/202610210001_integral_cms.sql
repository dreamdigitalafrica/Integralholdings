begin;
create schema if not exists cms_private;
revoke all on schema cms_private from public;
grant usage on schema cms_private to anon, authenticated;
create table public.cms_staff (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('admin','editor','recruiter','trainer')),
  active boolean not null default true
);
alter table public.cms_staff enable row level security;

create function cms_private.cms_role() returns text language sql stable security definer set search_path = '' as $$
  select role from public.cms_staff where id = (select auth.uid()) and active = true
$$;
revoke all on function cms_private.cms_role() from public;
grant execute on function cms_private.cms_role() to authenticated, anon;
create function cms_private.cms_can_manage(kind text) returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(cms_private.cms_role() = 'admin' or
    (cms_private.cms_role() = 'editor' and kind in ('articles','media')) or
    (cms_private.cms_role() = 'recruiter' and kind in ('jobs','applications')) or
    (cms_private.cms_role() = 'trainer' and kind in ('courses','enrollments','media')), false)
$$;
revoke all on function cms_private.cms_can_manage(text) from public;
grant execute on function cms_private.cms_can_manage(text) to authenticated, anon;
create policy staff_read on public.cms_staff for select to authenticated using (id = auth.uid() or cms_private.cms_role() = 'admin');
create policy staff_update on public.cms_staff for update to authenticated using (cms_private.cms_role() = 'admin') with check (cms_private.cms_role() = 'admin');

create function cms_private.cms_protect_admin() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.id = auth.uid() and (new.role <> old.role or new.active <> old.active) then
    raise exception 'You cannot change your own access.';
  end if;
  return new;
end $$;
create trigger protect_admin before update on public.cms_staff for each row execute function cms_private.cms_protect_admin();

create table public.cms_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('articles','jobs','courses')),
  title text not null check (length(trim(title)) between 1 and 240),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sector text not null default 'Group',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  image_url text,
  image_alt text,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  version integer not null default 1,
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  updated_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(kind, slug),
  check (status <> 'published' or published_at is not null)
);
create index content_public on public.cms_content(kind, status, published_at);
alter table public.cms_content enable row level security;
create policy content_read on public.cms_content for select using (
  cms_private.cms_can_manage(kind) or (status = 'published' and published_at <= now())
);
create policy content_insert on public.cms_content for insert to authenticated with check (cms_private.cms_can_manage(kind));
create policy content_update on public.cms_content for update to authenticated using (cms_private.cms_can_manage(kind)) with check (cms_private.cms_can_manage(kind));

create table public.cms_revisions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.cms_content(id) on delete cascade,
  snapshot jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index revisions_content on public.cms_revisions(content_id, created_at desc);
alter table public.cms_revisions enable row level security;
create policy revisions_read on public.cms_revisions for select to authenticated using (
  exists (select 1 from public.cms_content c where c.id = content_id and cms_private.cms_can_manage(c.kind))
);

create function public.cms_content_before() returns trigger language plpgsql set search_path = '' as $$
declare required_field text;
begin
  if tg_op = 'UPDATE' then
    if new.kind <> old.kind then raise exception 'Content type cannot be changed.'; end if;
    new.version := old.version + 1;
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  else
    new.version := 1;
    new.created_by := auth.uid();
  end if;
  new.updated_at := now(); new.updated_by := auth.uid();
  if new.status = 'published' then
    foreach required_field in array case new.kind
      when 'articles' then array['summary','category','author','body']
      when 'jobs' then array['department','location','employment','workplace','closing_date','body','requirements']
      else array['summary','instructor','delivery','location','start_date','duration','capacity','fee','body'] end
    loop
      if coalesce(trim(regexp_replace(new.data->>required_field, '<[^>]*>', '', 'g')), '') = '' then
        raise exception 'Required publication field missing: %', required_field;
      end if;
    end loop;
    if new.kind = 'articles' and coalesce(new.image_url, '') = '' then raise exception 'A cover image is required.'; end if;
    if new.kind = 'courses' and ((new.data->>'capacity')::numeric < 0 or (new.data->>'fee')::numeric < 0) then raise exception 'Capacity and fee cannot be negative.'; end if;
  end if;
  return new;
end $$;
create trigger content_before before insert or update on public.cms_content for each row execute function public.cms_content_before();
create function cms_private.cms_record_revision() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.cms_revisions(content_id, snapshot, created_by) values (new.id, to_jsonb(new), auth.uid());
  return new;
end $$;
create trigger content_revision after insert or update on public.cms_content for each row execute function cms_private.cms_record_revision();

create table public.cms_submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('applications','enrollments')),
  content_id uuid not null references public.cms_content(id),
  name text not null, email text not null, phone text,
  stage text not null default 'received', notes text not null default '',
  document_path text, consent_at timestamptz not null,
  retain_until date not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check ((kind = 'applications' and stage in ('received','reviewing','shortlisted','interview','offer','hired','rejected')) or
    (kind = 'enrollments' and stage in ('received','reviewing','accepted','waitlisted','completed','cancelled')))
);
create index submissions_kind_stage on public.cms_submissions(kind, stage);
alter table public.cms_submissions enable row level security;
create policy submission_read on public.cms_submissions for select to authenticated using (cms_private.cms_can_manage(kind));
create policy submission_create on public.cms_submissions for insert to authenticated with check (cms_private.cms_can_manage(kind));
create policy submission_update on public.cms_submissions for update to authenticated using (cms_private.cms_can_manage(kind)) with check (cms_private.cms_can_manage(kind));
create policy submission_delete on public.cms_submissions for delete to authenticated using (cms_private.cms_role() = 'admin');
create function public.cms_submission_before() returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists(select 1 from public.cms_content where id = new.content_id and kind = case new.kind when 'applications' then 'jobs' else 'courses' end) then
    raise exception 'Select a matching job or programme.';
  end if;
  new.updated_at := now(); return new;
end $$;
create trigger submission_before before insert or update on public.cms_submissions for each row execute function public.cms_submission_before();

create table public.cms_media (
  id uuid primary key default gen_random_uuid(), name text not null, alt text not null,
  url text not null, path text unique not null, bytes bigint not null,
  created_at timestamptz not null default now()
);
alter table public.cms_media enable row level security;
create policy media_read on public.cms_media for select to authenticated using (cms_private.cms_role() is not null);
create policy media_insert on public.cms_media for insert to authenticated with check (cms_private.cms_can_manage('media'));
create policy media_update on public.cms_media for update to authenticated using (cms_private.cms_can_manage('media')) with check (cms_private.cms_can_manage('media'));

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values
  ('cms-media','cms-media',true,5242880,array['image/jpeg','image/png','image/webp','image/avif']),
  ('cms-private','cms-private',false,5242880,array['application/pdf']);
create policy media_upload on storage.objects for insert to authenticated with check (bucket_id = 'cms-media' and cms_private.cms_can_manage('media'));
create policy media_cleanup on storage.objects for delete to authenticated using (bucket_id = 'cms-media' and cms_private.cms_can_manage('media') and owner_id = auth.uid()::text);
create policy document_read on storage.objects for select to authenticated using (
  bucket_id = 'cms-private' and exists(select 1 from public.cms_submissions s where s.document_path = name and cms_private.cms_can_manage(s.kind))
);
create policy document_upload on storage.objects for insert to authenticated with check (
  bucket_id = 'cms-private' and ((storage.foldername(name))[1] = 'applications' and cms_private.cms_can_manage('applications') or
  (storage.foldername(name))[1] = 'enrollments' and cms_private.cms_can_manage('enrollments'))
);
grant select on public.cms_content to anon;
grant select, insert, update on public.cms_content, public.cms_media to authenticated;
grant select, insert, update, delete on public.cms_submissions to authenticated;
grant select on public.cms_revisions to authenticated;
grant select, update on public.cms_staff to authenticated;
revoke all on public.cms_staff, public.cms_submissions, public.cms_revisions, public.cms_media from anon;
revoke all on function cms_private.cms_protect_admin() from public;
revoke all on function cms_private.cms_record_revision() from public;
commit;
