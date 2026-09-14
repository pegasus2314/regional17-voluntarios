-- Regional 17 Volunteers — production security hardening
-- Applied to Supabase project Regional17-Voluntarios on 2026-09-14.

create or replace function public.enforce_profile_protected_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_master_admin() is not true and public.get_my_role() <> 'admin' then
    if new.id <> old.id
       or new.role <> old.role
       or new.email is distinct from old.email
       or new.linked_voluntario_id is distinct from old.linked_voluntario_id
       or new.distrito_id is distinct from old.distrito_id then
      raise exception 'Solo un administrador puede modificar identidad, rol, correo, vínculo o distrito del perfil.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_protected_fields on public.profiles;
create trigger trg_profiles_protected_fields
before update on public.profiles
for each row execute function public.enforce_profile_protected_fields();

revoke execute on function public.enforce_profile_protected_fields() from public, anon, authenticated;

insert into storage.buckets (id, name, public)
values ('profile-avatars', 'profile-avatars', false)
on conflict (id) do update set public = false;

drop policy if exists "profile_avatars_select_own" on storage.objects;
drop policy if exists "profile_avatars_insert_own" on storage.objects;
drop policy if exists "profile_avatars_update_own" on storage.objects;
drop policy if exists "profile_avatars_delete_own" on storage.objects;

create policy "profile_avatars_select_own"
on storage.objects for select to authenticated
using (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "profile_avatars_insert_own"
on storage.objects for insert to authenticated
with check (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "profile_avatars_update_own"
on storage.objects for update to authenticated
using (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "profile_avatars_delete_own"
on storage.objects for delete to authenticated
using (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
