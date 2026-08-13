-- ============================================================
-- schema.sql — Registro de Voluntarios · Regional 17 Monte Plata
-- Esquema PostgreSQL para Supabase: tablas, roles, RLS y Realtime.
-- Ejecutar en el SQL Editor de tu proyecto de Supabase, en orden,
-- de arriba hacia abajo. Requiere el proyecto Supabase estándar
-- (auth.users ya existe por defecto).
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- TABLAS
-- ------------------------------------------------------------

create table if not exists public.distritos (
  id text primary key,                 -- ej. '17-01'
  nombre text not null,                -- ej. 'Yamasá'
  regional text not null default 'Regional 17 Monte Plata'
);

create table if not exists public.centros_educativos (
  id uuid primary key default gen_random_uuid(),
  distrito_id text not null references public.distritos(id) on delete cascade,
  nombre text not null,
  nivel text not null default 'Secundario',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique (distrito_id, nombre)
);

create table if not exists public.voluntarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  distrito_id text not null references public.distritos(id),
  categoria text not null check (categoria in ('Regional','Distrital','Nacional')),
  estatus text not null default 'Sin contactar'
    check (estatus in ('Activo','En espera','Inactivo','Sin contactar')),
  disponibilidad text
    check (disponibilidad is null or disponibilidad in
      ('Tiempo completo','Fines de semana','Solo eventos puntuales','No disponible por ahora')),
  notas text,
  user_id uuid references auth.users(id),   -- opcional: cuenta propia del voluntario
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  updated_by uuid references auth.users(id)
);

create index if not exists idx_voluntarios_distrito on public.voluntarios(distrito_id);

-- Relación muchos-a-muchos: qué centros puede cubrir cada voluntario
create table if not exists public.voluntario_centros (
  voluntario_id uuid not null references public.voluntarios(id) on delete cascade,
  centro_id uuid not null references public.centros_educativos(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (voluntario_id, centro_id)
);

-- Perfiles de usuarios autenticados (rol + vínculo opcional a un voluntario)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'voluntario' check (role in ('admin','coordinador','voluntario')),
  linked_voluntario_id uuid references public.voluntarios(id),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Autocreación de perfil cuando alguien se registra en Supabase Auth
-- (rol por defecto: 'voluntario'; un admin debe promoverlo luego)
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'voluntario')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Funciones auxiliares para RLS (SECURITY DEFINER para evitar
-- recursión de RLS al leer profiles desde dentro de una policy)
-- ------------------------------------------------------------
create or replace function public.auth_role()
returns text
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.auth_linked_voluntario_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select linked_voluntario_id from public.profiles where id = auth.uid();
$$;

-- ------------------------------------------------------------
-- Metadatos de auditoría: updated_at / updated_by en voluntarios
-- ------------------------------------------------------------
create or replace function public.set_updated_meta()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_voluntarios_updated on public.voluntarios;
create trigger trg_voluntarios_updated
  before update on public.voluntarios
  for each row execute function public.set_updated_meta();

-- ------------------------------------------------------------
-- Un voluntario (rol 'voluntario') solo puede tocar SU PROPIO
-- registro y solo estas columnas: estatus, disponibilidad, notas,
-- y (vía voluntario_centros) qué centros puede cubrir. Nombre,
-- distrito y categoría los define coordinación. Esto se aplica
-- aunque la policy de RLS ya permita el UPDATE de la fila (RLS no
-- filtra por columna).
-- ------------------------------------------------------------
create or replace function public.enforce_voluntario_restrictions()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.auth_role() = 'voluntario' then
    if new.nombre      <> old.nombre
       or new.distrito_id <> old.distrito_id
       or new.categoria   <> old.categoria then
      raise exception 'Los voluntarios solo pueden actualizar su estatus, disponibilidad, notas y los centros que pueden cubrir. Nombre, distrito y categoría los asigna el equipo de coordinación.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_voluntarios_restrict on public.voluntarios;
create trigger trg_voluntarios_restrict
  before update on public.voluntarios
  for each row execute function public.enforce_voluntario_restrictions();

-- Solo un admin puede cambiar el rol de un perfil (el propio u otros)
create or replace function public.enforce_profile_role_restriction()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role <> old.role and public.auth_role() <> 'admin' then
    raise exception 'Solo un administrador puede cambiar roles de usuario.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_role_restrict on public.profiles;
create trigger trg_profiles_role_restrict
  before update on public.profiles
  for each row execute function public.enforce_profile_role_restriction();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.distritos           enable row level security;
alter table public.centros_educativos  enable row level security;
alter table public.voluntarios         enable row level security;
alter table public.voluntario_centros  enable row level security;
alter table public.profiles            enable row level security;

-- distritos: lectura para cualquier usuario autenticado; escritura solo admin
create policy "distritos_select" on public.distritos
  for select using (auth.role() = 'authenticated');
create policy "distritos_write_admin" on public.distritos
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- centros_educativos: lectura para autenticados; escritura admin/coordinador
create policy "centros_select" on public.centros_educativos
  for select using (auth.role() = 'authenticated');
create policy "centros_write_admin_coord" on public.centros_educativos
  for all using (public.auth_role() in ('admin','coordinador'))
  with check (public.auth_role() in ('admin','coordinador'));

-- voluntarios
create policy "voluntarios_select" on public.voluntarios
  for select using (auth.role() = 'authenticated');
create policy "voluntarios_insert_admin_coord" on public.voluntarios
  for insert with check (public.auth_role() in ('admin','coordinador'));
create policy "voluntarios_update_admin_coord" on public.voluntarios
  for update using (public.auth_role() in ('admin','coordinador'))
  with check (public.auth_role() in ('admin','coordinador'));
create policy "voluntarios_update_self" on public.voluntarios
  for update using (public.auth_role() = 'voluntario' and id = public.auth_linked_voluntario_id())
  with check (id = public.auth_linked_voluntario_id());
create policy "voluntarios_delete_admin" on public.voluntarios
  for delete using (public.auth_role() = 'admin');

-- voluntario_centros: lectura para autenticados; escritura admin/coordinador
-- o el propio voluntario sobre sus propias asignaciones
create policy "vc_select" on public.voluntario_centros
  for select using (auth.role() = 'authenticated');
create policy "vc_write_admin_coord" on public.voluntario_centros
  for all using (public.auth_role() in ('admin','coordinador'))
  with check (public.auth_role() in ('admin','coordinador'));
create policy "vc_write_self" on public.voluntario_centros
  for all using (public.auth_role() = 'voluntario' and voluntario_id = public.auth_linked_voluntario_id())
  with check (voluntario_id = public.auth_linked_voluntario_id());

-- profiles: cada quien ve su propio perfil; admin ve y administra todos
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_select_admin" on public.profiles
  for select using (public.auth_role() = 'admin');
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_admin_manage" on public.profiles
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- ------------------------------------------------------------
-- REALTIME: publicar las tablas para que Supabase Realtime
-- transmita INSERT/UPDATE/DELETE a los clientes suscritos.
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.voluntarios;
alter publication supabase_realtime add table public.centros_educativos;
alter publication supabase_realtime add table public.voluntario_centros;
alter publication supabase_realtime add table public.distritos;

-- ------------------------------------------------------------
-- Primer administrador (ejecutar manualmente después de que esa
-- persona se registre una vez desde la app con su email/clave):
--
--   update public.profiles set role = 'admin' where email = 'coordinacion@example.org';
--
-- ------------------------------------------------------------
