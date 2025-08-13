
-- 1) Add a public flag to activities and backfill discovered rows
alter table public.activities
  add column if not exists is_public boolean not null default false;

update public.activities
set is_public = true
where source = 'discovered';

-- 2) Allow authenticated users to read approved, public discovered activities globally
-- (curated already has a public SELECT policy in place)
create policy "Authenticated can read public discovered activities"
on public.activities
for select
to authenticated
using (
  source = 'discovered'
  and approved = true
  and is_public = true
);

-- 3) Ensure legacy discovered_activities are readable (approved only) by authenticated users
--    This keeps compatibility for any items still present in the legacy table
create policy "Authenticated can read approved discovered_activities"
on public.discovered_activities
for select
to authenticated
using (is_approved = true);

-- 4) Optional: index to keep common reads snappy
create index if not exists idx_activities_source_approved_public
  on public.activities (source, approved, is_public);
