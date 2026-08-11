insert into storage.buckets (id, name, public)
values ('place-photos', 'place-photos', false)
on conflict (id) do nothing;

drop policy if exists place_photos_bucket_select on storage.objects;
create policy place_photos_bucket_select on storage.objects
  for select
  using (
    bucket_id = 'place-photos'
    and auth.uid() is not null
  );

drop policy if exists place_photos_bucket_insert on storage.objects;
create policy place_photos_bucket_insert on storage.objects
  for insert
  with check (
    bucket_id = 'place-photos'
    and auth.uid() is not null
  );

drop policy if exists place_photos_bucket_update on storage.objects;
create policy place_photos_bucket_update on storage.objects
  for update
  using (
    bucket_id = 'place-photos'
    and auth.uid() is not null
  )
  with check (
    bucket_id = 'place-photos'
    and auth.uid() is not null
  );

drop policy if exists place_photos_bucket_delete on storage.objects;
create policy place_photos_bucket_delete on storage.objects
  for delete
  using (
    bucket_id = 'place-photos'
    and auth.uid() is not null
  );
