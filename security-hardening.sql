-- ============================================================
-- security-hardening.sql — Regional 17 Volunteers
-- Hardening de seguridad para el proyecto Supabase.
-- Ejecutar una vez en el SQL Editor del proyecto.
-- ============================================================

-- 1) Evitar que un usuario no-admin pueda reasignarse a otro
-- voluntario modificando profiles.linked_voluntario_id.
create or replace function public.enforce_profile_protected_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.auth_role() <> 'admin' then
    if new.id <> old.id
       or new.role <> old.role
       or new.email is distinct from old.email
       or new.linked_voluntario_id is distinct from old.linked_voluntario_id then
      raise exception 'Solo un administrador puede modificar identidad, rol, correo o vínculo del perfil.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_protected_fields on public.profiles;
create trigger trg_profiles_protected_fields
  before update on public.profiles
  for each row execute function public.enforce_profile_protected_fields();

-- 2) Mantener explícitamente la protección del rol.
-- El trigger anterior cubre también role; este existente queda como defensa adicional.

-- 3) Storage privado para fotos de perfil.
-- La aplicación usa createSignedUrl(), no URLs públicas.
insert into storage.buckets (id, name, public)
values ('profile-avatars', 'profile-avatars', false)
on conflict (id) do update set public = false;

-- Elimina políticas con estos nombres si una ejecución anterior las creó.
drop policy if exists "profile_avatars_select_own" on storage.objects;
drop policy if exists "profile_avatars_insert_own" on storage.objects;
drop policy if exists "profile_avatars_update_own" on storage.objects;
drop policy if exists "profile_avatars_delete_own" on storage.objects;

create policy "profile_avatars_select_own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "profile_avatars_insert_own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "profile_avatars_update_own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "profile_avatars_delete_own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4) Endurecer perfiles: un usuario normal solo puede cambiar
-- campos no privilegiados. La RLS existente sigue limitando la fila.
-- No se concede ninguna capacidad adicional a través de este script.

-- 5) Recomendación de Auth (configuración de plataforma):
-- activar confirmación de correo si el flujo institucional lo permite;
-- desactivar registros públicos cuando todos los usuarios deban ser
-- creados por coordinación; configurar CAPTCHA/rate limits desde Auth.

-- 6) No ejecutar pruebas de DoS contra producción. Para carga usar
-- un entorno staging y una prueba gradual, autenticada y con límites.
