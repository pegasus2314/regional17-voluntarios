-- Regional 17 Volunteers — core performance indexes
create index if not exists idx_profiles_linked_voluntario_id on public.profiles(linked_voluntario_id);
create index if not exists idx_voluntarios_user_id on public.voluntarios(user_id);
create index if not exists idx_voluntarios_updated_by on public.voluntarios(updated_by);
create index if not exists idx_voluntario_centros_centro_id on public.voluntario_centros(centro_id);
