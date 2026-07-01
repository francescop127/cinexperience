create table if not exists public.photo_requests (
  id text primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  instagram_handle text,
  setting_id text not null,
  setting_title text not null,
  timestamp text not null,
  privacy_accepted boolean not null default true,
  status text not null default 'da_elaborare'
    check (status in ('da_elaborare', 'in_lavorazione', 'inviato')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.photo_requests
add column if not exists instagram_handle text;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_photo_requests_updated_at on public.photo_requests;

create trigger set_photo_requests_updated_at
before update on public.photo_requests
for each row
execute function public.set_updated_at();

alter table public.photo_requests enable row level security;

drop policy if exists "Allow public insert photo requests" on public.photo_requests;
drop policy if exists "Allow public read photo requests" on public.photo_requests;
drop policy if exists "Allow public update photo requests" on public.photo_requests;
drop policy if exists "Allow public delete photo requests" on public.photo_requests;

create policy "Allow public insert photo requests"
on public.photo_requests
for insert
to anon
with check (true);

create policy "Allow public read photo requests"
on public.photo_requests
for select
to anon
using (true);

create policy "Allow public update photo requests"
on public.photo_requests
for update
to anon
using (true)
with check (true);

create policy "Allow public delete photo requests"
on public.photo_requests
for delete
to anon
using (true);

create table if not exists public.movie_settings (
  id text primary key,
  title text not null,
  genre text not null,
  description text not null,
  image_url text not null,
  overlay_label text not null,
  prompt_hint text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_movie_settings_updated_at on public.movie_settings;

create trigger set_movie_settings_updated_at
before update on public.movie_settings
for each row
execute function public.set_updated_at();

alter table public.movie_settings enable row level security;

drop policy if exists "Allow public insert movie settings" on public.movie_settings;
drop policy if exists "Allow public read movie settings" on public.movie_settings;
drop policy if exists "Allow public update movie settings" on public.movie_settings;
drop policy if exists "Allow public delete movie settings" on public.movie_settings;

create policy "Allow public insert movie settings"
on public.movie_settings
for insert
to anon
with check (true);

create policy "Allow public read movie settings"
on public.movie_settings
for select
to anon
using (true);

create policy "Allow public update movie settings"
on public.movie_settings
for update
to anon
using (true)
with check (true);

create policy "Allow public delete movie settings"
on public.movie_settings
for delete
to anon
using (true);
