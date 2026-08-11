drop policy if exists places_delete_own on public.places;
create policy places_delete_own on public.places
  for delete
  using (auth.uid() = created_by);
