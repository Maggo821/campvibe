create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id)
select u.id
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- Keep updated_at consistent on every write.
drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_groups on public.groups;
create trigger set_updated_at_groups
before update on public.groups
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_group_members on public.group_members;
create trigger set_updated_at_group_members
before update on public.group_members
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_places on public.places;
create trigger set_updated_at_places
before update on public.places
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_features on public.features;
create trigger set_updated_at_features
before update on public.features
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_place_features on public.place_features;
create trigger set_updated_at_place_features
before update on public.place_features
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_nearby_places on public.nearby_places;
create trigger set_updated_at_nearby_places
before update on public.nearby_places
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_place_nearby_places on public.place_nearby_places;
create trigger set_updated_at_place_nearby_places
before update on public.place_nearby_places
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_place_vibe_ratings on public.place_vibe_ratings;
create trigger set_updated_at_place_vibe_ratings
before update on public.place_vibe_ratings
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_place_environment_ratings on public.place_environment_ratings;
create trigger set_updated_at_place_environment_ratings
before update on public.place_environment_ratings
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_visits on public.visits;
create trigger set_updated_at_visits
before update on public.visits
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_visit_ratings on public.visit_ratings;
create trigger set_updated_at_visit_ratings
before update on public.visit_ratings
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_place_photos on public.place_photos;
create trigger set_updated_at_place_photos
before update on public.place_photos
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_visit_photos on public.visit_photos;
create trigger set_updated_at_visit_photos
before update on public.visit_photos
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_user_place_status on public.user_place_status;
create trigger set_updated_at_user_place_status
before update on public.user_place_status
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_trips on public.trips;
create trigger set_updated_at_trips
before update on public.trips
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_trip_places on public.trip_places;
create trigger set_updated_at_trip_places
before update on public.trip_places
for each row execute function public.set_updated_at();

alter table public.places
  drop constraint if exists places_place_type_check,
  drop constraint if exists places_latitude_range_check,
  drop constraint if exists places_longitude_range_check,
  drop constraint if exists places_price_from_non_negative_check,
  drop constraint if exists places_permanent_camper_level_check,
  drop constraint if exists places_pitch_style_check,
  drop constraint if exists places_evening_rules_check,
  add constraint places_place_type_check
  check (place_type in (
    'camping',
    'motorhome_pitch',
    'vanlife_camp',
    'nature_camp',
    'farm',
    'winery',
    'glamping',
    'marina',
    'beach_camp',
    'festival_camp',
    'other'
  )),
  add constraint places_latitude_range_check
  check (latitude is null or (latitude >= -90 and latitude <= 90)),
  add constraint places_longitude_range_check
  check (longitude is null or (longitude >= -180 and longitude <= 180)),
  add constraint places_price_from_non_negative_check
  check (price_from is null or price_from >= 0),
  add constraint places_permanent_camper_level_check
  check (permanent_camper_level is null or permanent_camper_level in (
    'none', 'low', 'medium', 'high', 'very_high', 'unknown'
  )),
  add constraint places_pitch_style_check
  check (pitch_style is null or pitch_style in (
    'open_field',
    'natural',
    'large_parcels',
    'standard_parcels',
    'hedges',
    'tight_rows',
    'permanent_camper_style',
    'unknown'
  )),
  add constraint places_evening_rules_check
  check (evening_rules is null or evening_rules in (
    'relaxed', 'normal', 'strict', 'very_strict', 'unknown'
  ));

alter table public.nearby_places
  drop constraint if exists nearby_places_category_check,
  drop constraint if exists nearby_places_latitude_range_check,
  drop constraint if exists nearby_places_longitude_range_check,
  add constraint nearby_places_category_check
  check (category in (
    'bar',
    'beach_bar',
    'restaurant',
    'cafe',
    'bakery',
    'supermarket',
    'beach',
    'lake',
    'spa',
    'sauna',
    'bike_rental',
    'sup_kayak',
    'boat_rental',
    'town',
    'nightlife',
    'winery',
    'hiking',
    'mountain_lift',
    'attraction',
    'sight',
    'other'
  )),
  add constraint nearby_places_latitude_range_check
  check (latitude is null or (latitude >= -90 and latitude <= 90)),
  add constraint nearby_places_longitude_range_check
  check (longitude is null or (longitude >= -180 and longitude <= 180));

alter table public.place_nearby_places
  drop constraint if exists place_nearby_places_distance_non_negative_check,
  drop constraint if exists place_nearby_places_walking_non_negative_check,
  drop constraint if exists place_nearby_places_driving_non_negative_check,
  add constraint place_nearby_places_distance_non_negative_check
  check (distance_meters is null or distance_meters >= 0),
  add constraint place_nearby_places_walking_non_negative_check
  check (walking_minutes is null or walking_minutes >= 0),
  add constraint place_nearby_places_driving_non_negative_check
  check (driving_minutes is null or driving_minutes >= 0);

alter table public.visits
  drop constraint if exists visits_departure_after_arrival_check,
  drop constraint if exists visits_price_per_night_non_negative_check,
  drop constraint if exists visits_total_price_non_negative_check,
  drop constraint if exists visits_persons_positive_check,
  add constraint visits_departure_after_arrival_check
  check (departure_date is null or departure_date >= arrival_date),
  add constraint visits_price_per_night_non_negative_check
  check (price_per_night is null or price_per_night >= 0),
  add constraint visits_total_price_non_negative_check
  check (total_price is null or total_price >= 0),
  add constraint visits_persons_positive_check
  check (persons is null or persons > 0);

alter table public.visit_ratings
  drop constraint if exists visit_ratings_return_status_check,
  drop constraint if exists visit_ratings_never_again_reasons_check,
  add constraint visit_ratings_return_status_check
  check (return_status is null or return_status in ('definitely', 'yes', 'maybe', 'never')),
  add constraint visit_ratings_never_again_reasons_check
  check (
    never_again_reasons is null
    or never_again_reasons <@ array[
      'too_strict',
      'too_quiet',
      'too_many_rules',
      'too_many_permanent_campers',
      'bad_pitch',
      'bad_environment',
      'bad_sanitary',
      'bad_service',
      'too_expensive',
      'too_crowded',
      'other'
    ]::text[]
  );

-- Replace overly broad defaults with ownership-based RLS.
drop policy if exists groups_select_public on public.groups;
drop policy if exists groups_select_member on public.groups;
drop policy if exists groups_insert_own on public.groups;
drop policy if exists groups_update_owner on public.groups;
drop policy if exists groups_delete_owner on public.groups;

create policy groups_select_member on public.groups
  for select
  using (
    auth.uid() = created_by
    or exists (
      select 1
      from public.group_members gm
      where gm.group_id = groups.id
        and gm.user_id = auth.uid()
    )
  );

create policy groups_insert_own on public.groups
  for insert
  with check (auth.uid() = created_by);

create policy groups_update_owner on public.groups
  for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy groups_delete_owner on public.groups
  for delete
  using (auth.uid() = created_by);

drop policy if exists group_members_select_public on public.group_members;
drop policy if exists group_members_manage_public on public.group_members;

create policy group_members_select_related on public.group_members
  for select
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.groups g
      where g.id = group_members.group_id
        and g.created_by = auth.uid()
    )
    or exists (
      select 1
      from public.group_members gm
      where gm.group_id = group_members.group_id
        and gm.user_id = auth.uid()
    )
  );

create policy group_members_insert_owner_or_self on public.group_members
  for insert
  with check (
    auth.uid() = user_id
    or exists (
      select 1
      from public.groups g
      where g.id = group_members.group_id
        and g.created_by = auth.uid()
    )
  );

create policy group_members_update_owner on public.group_members
  for update
  using (
    exists (
      select 1
      from public.groups g
      where g.id = group_members.group_id
        and g.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.groups g
      where g.id = group_members.group_id
        and g.created_by = auth.uid()
    )
  );

create policy group_members_delete_owner_or_self on public.group_members
  for delete
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.groups g
      where g.id = group_members.group_id
        and g.created_by = auth.uid()
    )
  );

drop policy if exists features_insert_authenticated on public.features;
create policy features_insert_authenticated on public.features
  for insert
  with check (auth.uid() is not null);

drop policy if exists place_features_manage_place_owner on public.place_features;
create policy place_features_manage_place_owner on public.place_features
  for all
  using (
    exists (
      select 1
      from public.places p
      where p.id = place_features.place_id
        and p.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.places p
      where p.id = place_features.place_id
        and p.created_by = auth.uid()
    )
  );

drop policy if exists nearby_places_insert_own on public.nearby_places;
create policy nearby_places_insert_own on public.nearby_places
  for insert
  with check (auth.uid() = created_by);

drop policy if exists nearby_places_update_own on public.nearby_places;
create policy nearby_places_update_own on public.nearby_places
  for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

drop policy if exists nearby_places_delete_own on public.nearby_places;
create policy nearby_places_delete_own on public.nearby_places
  for delete
  using (auth.uid() = created_by);

drop policy if exists place_nearby_places_manage_place_owner on public.place_nearby_places;
create policy place_nearby_places_manage_place_owner on public.place_nearby_places
  for all
  using (
    exists (
      select 1
      from public.places p
      where p.id = place_nearby_places.place_id
        and p.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.places p
      where p.id = place_nearby_places.place_id
        and p.created_by = auth.uid()
    )
  );

drop policy if exists visit_ratings_select_own on public.visit_ratings;
drop policy if exists visit_ratings_manage_own on public.visit_ratings;

create policy visit_ratings_select_own on public.visit_ratings
  for select
  using (
    exists (
      select 1
      from public.visits v
      where v.id = visit_ratings.visit_id
        and v.user_id = auth.uid()
    )
  );

create policy visit_ratings_manage_own on public.visit_ratings
  for all
  using (
    exists (
      select 1
      from public.visits v
      where v.id = visit_ratings.visit_id
        and v.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.visits v
      where v.id = visit_ratings.visit_id
        and v.user_id = auth.uid()
    )
  );

drop policy if exists place_photos_select_own on public.place_photos;
create policy place_photos_select_own on public.place_photos
  for select
  using (auth.uid() = user_id);

drop policy if exists place_photos_manage_own on public.place_photos;
create policy place_photos_manage_own on public.place_photos
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists visit_photos_select_own on public.visit_photos;
create policy visit_photos_select_own on public.visit_photos
  for select
  using (auth.uid() = user_id);

drop policy if exists visit_photos_manage_own on public.visit_photos;
create policy visit_photos_manage_own on public.visit_photos
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists trip_places_select_own on public.trip_places;
drop policy if exists trip_places_manage_own on public.trip_places;

create policy trip_places_select_own on public.trip_places
  for select
  using (
    exists (
      select 1
      from public.trips t
      where t.id = trip_places.trip_id
        and t.user_id = auth.uid()
    )
  );

create policy trip_places_manage_own on public.trip_places
  for all
  using (
    exists (
      select 1
      from public.trips t
      where t.id = trip_places.trip_id
        and t.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.trips t
      where t.id = trip_places.trip_id
        and t.user_id = auth.uid()
    )
  );
