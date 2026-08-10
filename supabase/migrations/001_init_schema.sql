create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.group_members (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(group_id, user_id)
);

create table if not exists public.places (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  place_type text not null,
  street text,
  postal_code text,
  city text,
  state text,
  country text,
  latitude double precision,
  longitude double precision,
  website text,
  phone text,
  email text,
  price_from numeric(10,2) default 0,
  currency text default 'EUR',
  checkin_time text,
  checkout_time text,
  quiet_hours_from text,
  quiet_hours_to text,
  permanent_camper_level text,
  pitch_style text,
  evening_rules text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.features (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.place_features (
  id uuid primary key default uuid_generate_v4(),
  place_id uuid not null references public.places(id) on delete cascade,
  feature_id uuid not null references public.features(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(place_id, feature_id)
);

create table if not exists public.nearby_places (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  description text,
  street text,
  postal_code text,
  city text,
  country text,
  latitude double precision,
  longitude double precision,
  website text,
  maps_url text,
  phone text,
  opening_hours_text text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.place_nearby_places (
  id uuid primary key default uuid_generate_v4(),
  place_id uuid not null references public.places(id) on delete cascade,
  nearby_place_id uuid not null references public.nearby_places(id) on delete cascade,
  distance_meters integer,
  walking_minutes integer,
  driving_minutes integer,
  user_note text,
  rating integer check (rating between 1 and 10),
  favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(place_id, nearby_place_id)
);

create table if not exists public.place_vibe_ratings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  overall integer check (overall between 1 and 10),
  vanlife integer check (vanlife between 1 and 10),
  nature integer check (nature between 1 and 10),
  nightlife integer check (nightlife between 1 and 10),
  beach_bar integer check (beach_bar between 1 and 10),
  international integer check (international between 1 and 10),
  modern integer check (modern between 1 and 10),
  open_space integer check (open_space between 1 and 10),
  privacy integer check (privacy between 1 and 10),
  gastronomy integer check (gastronomy between 1 and 10),
  surroundings integer check (surroundings between 1 and 10),
  value_for_money integer check (value_for_money between 1 and 10),
  atmosphere_score integer check (atmosphere_score between 1 and 10),
  camping_style_score integer check (camping_style_score between 1 and 10),
  audience_vibe_score integer check (audience_vibe_score between 1 and 10),
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, place_id)
);

create table if not exists public.place_environment_ratings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  overall_environment integer check (overall_environment between 1 and 10),
  evening_activity integer check (evening_activity between 1 and 10),
  restaurants integer check (restaurants between 1 and 10),
  bars integer check (bars between 1 and 10),
  shopping integer check (shopping between 1 and 10),
  nature integer check (nature between 1 and 10),
  excursions integer check (excursions between 1 and 10),
  cycling integer check (cycling between 1 and 10),
  hiking integer check (hiking between 1 and 10),
  water_sports integer check (water_sports between 1 and 10),
  town_accessibility integer check (town_accessibility between 1 and 10),
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, place_id)
);

create table if not exists public.visits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  group_id uuid references public.groups(id) on delete set null,
  arrival_date date not null,
  departure_date date,
  pitch_number text,
  price_per_night numeric(10,2),
  total_price numeric(10,2),
  currency text default 'EUR',
  persons integer,
  vehicle text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.visit_ratings (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  overall integer check (overall between 1 and 10),
  vibe integer check (vibe between 1 and 10),
  pitch integer check (pitch between 1 and 10),
  sanitary integer check (sanitary between 1 and 10),
  service integer check (service between 1 and 10),
  environment integer check (environment between 1 and 10),
  gastronomy integer check (gastronomy between 1 and 10),
  value_for_money integer check (value_for_money between 1 and 10),
  return_status text,
  never_again_reasons text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(visit_id)
);

create table if not exists public.place_photos (
  id uuid primary key default uuid_generate_v4(),
  place_id uuid not null references public.places(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.visit_photos (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_place_status (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  visited boolean default false,
  favorite boolean default false,
  wishlist boolean default false,
  planned boolean default false,
  never_again boolean default false,
  personal_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, place_id)
);

create table if not exists public.trips (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  start_date date,
  end_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.trip_places (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  sort_order integer default 0,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(trip_id, place_id)
);

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.places enable row level security;
alter table public.features enable row level security;
alter table public.place_features enable row level security;
alter table public.nearby_places enable row level security;
alter table public.place_nearby_places enable row level security;
alter table public.place_vibe_ratings enable row level security;
alter table public.place_environment_ratings enable row level security;
alter table public.visits enable row level security;
alter table public.visit_ratings enable row level security;
alter table public.place_photos enable row level security;
alter table public.visit_photos enable row level security;
alter table public.user_place_status enable row level security;
alter table public.trips enable row level security;
alter table public.trip_places enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_upsert_own on public.profiles;
create policy profiles_upsert_own on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id);

drop policy if exists places_select_public on public.places;
create policy places_select_public on public.places
  for select using (true);

drop policy if exists places_insert_own on public.places;
create policy places_insert_own on public.places
  for insert with check (auth.uid() = created_by);

drop policy if exists places_update_own on public.places;
create policy places_update_own on public.places
  for update using (auth.uid() = created_by);

drop policy if exists features_select_public on public.features;
create policy features_select_public on public.features
  for select using (true);

drop policy if exists place_features_select_public on public.place_features;
create policy place_features_select_public on public.place_features
  for select using (true);

drop policy if exists nearby_places_select_public on public.nearby_places;
create policy nearby_places_select_public on public.nearby_places
  for select using (true);

drop policy if exists place_nearby_places_select_public on public.place_nearby_places;
create policy place_nearby_places_select_public on public.place_nearby_places
  for select using (true);

drop policy if exists place_vibe_ratings_select_own on public.place_vibe_ratings;
create policy place_vibe_ratings_select_own on public.place_vibe_ratings
  for select using (auth.uid() = user_id);

drop policy if exists place_vibe_ratings_manage_own on public.place_vibe_ratings;
create policy place_vibe_ratings_manage_own on public.place_vibe_ratings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists place_environment_ratings_select_own on public.place_environment_ratings;
create policy place_environment_ratings_select_own on public.place_environment_ratings
  for select using (auth.uid() = user_id);

drop policy if exists place_environment_ratings_manage_own on public.place_environment_ratings;
create policy place_environment_ratings_manage_own on public.place_environment_ratings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists visits_select_own on public.visits;
create policy visits_select_own on public.visits
  for select using (auth.uid() = user_id);

drop policy if exists visits_manage_own on public.visits;
create policy visits_manage_own on public.visits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists visit_ratings_select_own on public.visit_ratings;
create policy visit_ratings_select_own on public.visit_ratings
  for select using (true);

drop policy if exists user_place_status_select_own on public.user_place_status;
create policy user_place_status_select_own on public.user_place_status
  for select using (auth.uid() = user_id);

drop policy if exists user_place_status_manage_own on public.user_place_status;
create policy user_place_status_manage_own on public.user_place_status
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists trips_select_own on public.trips;
create policy trips_select_own on public.trips
  for select using (auth.uid() = user_id);

drop policy if exists trips_manage_own on public.trips;
create policy trips_manage_own on public.trips
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists trip_places_select_own on public.trip_places;
create policy trip_places_select_own on public.trip_places
  for select using (true);
