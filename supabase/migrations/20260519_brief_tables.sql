-- 20260519_brief_tables.sql
-- Brief drafts (in-progress) + submissions (completed).
-- Apply via Supabase dashboard SQL editor or `supabase db push`.

create extension if not exists "pgcrypto";

create table if not exists public.brief_drafts (
  id           uuid primary key default gen_random_uuid(),
  token        uuid not null unique default gen_random_uuid(),
  email        text,
  state        jsonb not null default '{}'::jsonb,
  step_index   int  not null default -1,
  visited      int[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists brief_drafts_email_idx on public.brief_drafts (email);
create index if not exists brief_drafts_updated_at_idx on public.brief_drafts (updated_at desc);

create table if not exists public.brief_submissions (
  id           uuid primary key default gen_random_uuid(),
  draft_id     uuid references public.brief_drafts(id) on delete set null,
  state        jsonb not null,
  prompt       text  not null,
  business_name text,
  owner_name   text,
  email        text,
  forwarded    boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists brief_submissions_created_at_idx on public.brief_submissions (created_at desc);
create index if not exists brief_submissions_email_idx on public.brief_submissions (email);

-- RLS locked. Service-role key (server-only) bypasses RLS; anon has no access.
alter table public.brief_drafts     enable row level security;
alter table public.brief_submissions enable row level security;

-- Storage bucket for asset uploads. Private; access via signed URLs only.
insert into storage.buckets (id, name, public)
values ('brief-uploads', 'brief-uploads', false)
on conflict (id) do nothing;
