-- 20260519_drop_meridian_tables.sql
--
-- Drop pre-existing Meridian Society tables that landed in project
-- xbqlfjhriqycqhuiueug before it was repurposed for Tharros. Meridian
-- data lives in its own Supabase project (dsyiuztquzkcikehkigv).
--
-- CASCADE auto-drops dependent RLS policies. Tables were empty /
-- placeholder only (members: 0 rows, site_stats: 1 row with
-- member_count=0).
--
-- Already applied to the remote DB on 2026-05-19 via apply_migration;
-- this file is the repo-side record so anyone bootstrapping a fresh
-- project picks up a clean schema.

drop table if exists public.members cascade;
drop table if exists public.site_stats cascade;
