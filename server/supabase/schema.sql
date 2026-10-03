create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text not null default '',
  avatar_url text,
  address text not null default '',
  preferences jsonb not null default '{}'::jsonb,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_auth_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create table if not exists public.salon_services (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_members (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salon_offers (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salon_reviews (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  time text not null,
  staff_id text,
  status text not null default 'Confirmed'
    check (status in ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_customer_date_idx
  on public.appointments (customer_id, date desc);
create index if not exists appointments_date_staff_idx
  on public.appointments (date, staff_id);
create unique index if not exists appointments_prevent_double_booking_idx
  on public.appointments (date, time, staff_id)
  where staff_id is not null and status <> 'Cancelled';

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'salon_services', 'staff_members', 'salon_offers', 'salon_reviews', 'gallery_items', 'appointments'
  ] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute procedure public.set_updated_at()',
      table_name, table_name
    );
  end loop;
end;
$$;

alter table public.profiles enable row level security;
alter table public.salon_services enable row level security;
alter table public.staff_members enable row level security;
alter table public.salon_offers enable row level security;
alter table public.salon_reviews enable row level security;
alter table public.gallery_items enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

do $$
declare
  table_name text;
begin
  foreach table_name in array array['salon_services', 'staff_members', 'salon_offers', 'salon_reviews', 'gallery_items'] loop
    execute format('drop policy if exists "Public can read active %I" on public.%I', table_name, table_name);
    execute format(
      'create policy "Public can read active %1$s" on public.%1$I for select to anon, authenticated using (is_active)',
      table_name
    );
    execute format('drop policy if exists "Admins manage %I" on public.%I', table_name, table_name);
    execute format(
      'create policy "Admins manage %1$s" on public.%1$I for all to authenticated using ((select role from public.profiles where id = auth.uid()) = ''admin'') with check ((select role from public.profiles where id = auth.uid()) = ''admin'')',
      table_name
    );
  end loop;
end;
$$;

drop policy if exists "Customers read own appointments" on public.appointments;
create policy "Customers read own appointments" on public.appointments
  for select to authenticated
  using (customer_id = auth.uid() or (select role from public.profiles where id = auth.uid()) = 'admin');
drop policy if exists "Customers create own appointments" on public.appointments;
create policy "Customers create own appointments" on public.appointments
  for insert to authenticated with check (
    customer_id = auth.uid() or (select role from public.profiles where id = auth.uid()) = 'admin'
  );
drop policy if exists "Admins update appointments" on public.appointments;
create policy "Admins update appointments" on public.appointments
  for update to authenticated using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

grant usage on schema public to anon, authenticated;
grant select on public.salon_services, public.staff_members, public.salon_offers, public.salon_reviews, public.gallery_items to anon, authenticated;
grant select on public.profiles to authenticated;
revoke update on public.profiles from authenticated;
grant update (full_name, phone, avatar_url, address, preferences) on public.profiles to authenticated;
grant select, insert, update on public.appointments to authenticated;