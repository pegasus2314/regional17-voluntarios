-- Regional 17 Volunteers: additive production migration
-- Preserves existing records. Run after schema.sql.
begin;

alter table public.centros_educativos add column if not exists direccion text;
alter table public.centros_educativos add column if not exists municipio text;
alter table public.centros_educativos add column if not exists provincia text default 'Monte Plata';
alter table public.centros_educativos add column if not exists telefono text;
alter table public.centros_educativos add column if not exists correo text;
alter table public.centros_educativos add column if not exists latitud double precision;
alter table public.centros_educativos add column if not exists longitud double precision;
alter table public.centros_educativos add column if not exists informacion_adicional text;
alter table public.centros_educativos add column if not exists is_active boolean not null default true;
alter table public.centros_educativos add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uq_centros_nombre_distrito_lower on public.centros_educativos (distrito_id, lower(nombre));
create index if not exists idx_centros_geo on public.centros_educativos (latitud, longitud) where latitud is not null and longitud is not null;

create table if not exists public.roles_actividad (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  fecha date not null,
  hora time,
  direccion text,
  latitud double precision,
  longitud double precision,
  descripcion text,
  centro_id uuid references public.centros_educativos(id) on delete set null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  is_active boolean not null default true
);
create index if not exists idx_eventos_fecha on public.eventos(fecha desc);
create index if not exists idx_eventos_geo on public.eventos(latitud, longitud) where latitud is not null and longitud is not null;

create table if not exists public.actividades (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  fecha date not null,
  hora time,
  direccion text,
  descripcion text,
  centro_id uuid references public.centros_educativos(id) on delete set null,
  evento_id uuid references public.eventos(id) on delete set null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  is_active boolean not null default true
);
create index if not exists idx_actividades_fecha on public.actividades(fecha desc);

create table if not exists public.participaciones (
  id uuid primary key default gen_random_uuid(),
  voluntario_id uuid not null references public.voluntarios(id) on delete restrict,
  actividad_id uuid not null references public.actividades(id) on delete cascade,
  rol_id uuid references public.roles_actividad(id) on delete set null,
  fecha date,
  horas_colaboradas numeric(6,2) not null default 0 check (horas_colaboradas >= 0 and horas_colaboradas <= 24),
  asistencia boolean not null default true,
  evaluacion numeric(5,2) check (evaluacion is null or (evaluacion >= 0 and evaluacion <= 100)),
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(voluntario_id, actividad_id)
);
create index if not exists idx_part_voluntario on public.participaciones(voluntario_id);
create index if not exists idx_part_actividad on public.participaciones(actividad_id);
create index if not exists idx_part_rol on public.participaciones(rol_id);

insert into public.roles_actividad(nombre) values
('Logística'),('Staff'),('Acreditación'),('Seguridad'),('Juez'),('Coordinación'),('Crisis'),('Protocolo'),('Comunicación'),('Otro')
on conflict (nombre) do nothing;

create or replace view public.voluntario_desempeno as
with stats as (
  select v.id as voluntario_id,
         count(p.id)::int as actividades,
         coalesce(sum(p.horas_colaboradas),0)::numeric as horas,
         coalesce(avg(p.evaluacion) filter (where p.evaluacion is not null),0)::numeric as evaluacion,
         coalesce(avg(case when p.asistencia then 100 else 0 end),0)::numeric as asistencia
  from public.voluntarios v
  left join public.participaciones p on p.voluntario_id=v.id
  group by v.id
), role_exp as (
  select voluntario_id, count(distinct rol_id)::int as roles_experimentados
  from public.participaciones where rol_id is not null group by voluntario_id
)
select s.voluntario_id, s.actividades, s.horas, round(s.evaluacion,2) as evaluacion,
       round(s.asistencia,2) as asistencia,
       coalesce(r.roles_experimentados,0) as roles_experimentados,
       round((s.evaluacion*0.50 + s.asistencia*0.25 + least(s.actividades,20)*2*0.10 + least(s.horas,100)*0.15),2) as indice
from stats s left join role_exp r on r.voluntario_id=s.voluntario_id;

create or replace function public.rv_set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at=now(); return new; end; $$;

drop trigger if exists trg_eventos_updated on public.eventos;
create trigger trg_eventos_updated before update on public.eventos for each row execute function public.rv_set_updated_at();
drop trigger if exists trg_actividades_updated on public.actividades;
create trigger trg_actividades_updated before update on public.actividades for each row execute function public.rv_set_updated_at();
drop trigger if exists trg_participaciones_updated on public.participaciones;
create trigger trg_participaciones_updated before update on public.participaciones for each row execute function public.rv_set_updated_at();

alter table public.roles_actividad enable row level security;
alter table public.eventos enable row level security;
alter table public.actividades enable row level security;
alter table public.participaciones enable row level security;

drop policy if exists roles_select_auth on public.roles_actividad;
create policy roles_select_auth on public.roles_actividad for select using (auth.role()='authenticated');
drop policy if exists roles_write_admin on public.roles_actividad;
create policy roles_write_admin on public.roles_actividad for all using (public.auth_role()='admin') with check (public.auth_role()='admin');

drop policy if exists eventos_select_auth on public.eventos;
create policy eventos_select_auth on public.eventos for select using (auth.role()='authenticated');
drop policy if exists eventos_write_coord on public.eventos;
create policy eventos_write_coord on public.eventos for all using (public.auth_role() in ('admin','coordinador')) with check (public.auth_role() in ('admin','coordinador'));

drop policy if exists actividades_select_auth on public.actividades;
create policy actividades_select_auth on public.actividades for select using (auth.role()='authenticated');
drop policy if exists actividades_write_coord on public.actividades;
create policy actividades_write_coord on public.actividades for all using (public.auth_role() in ('admin','coordinador')) with check (public.auth_role() in ('admin','coordinador'));

drop policy if exists participaciones_select_auth on public.participaciones;
create policy participaciones_select_auth on public.participaciones for select using (auth.role()='authenticated');
drop policy if exists participaciones_write_coord on public.participaciones;
create policy participaciones_write_coord on public.participaciones for all using (public.auth_role() in ('admin','coordinador')) with check (public.auth_role() in ('admin','coordinador'));

drop policy if exists participaciones_self_insert on public.participaciones;
create policy participaciones_self_insert on public.participaciones for insert with check (voluntario_id=public.auth_linked_voluntario_id());
drop policy if exists participaciones_self_update on public.participaciones;
create policy participaciones_self_update on public.participaciones for update using (voluntario_id=public.auth_linked_voluntario_id()) with check (voluntario_id=public.auth_linked_voluntario_id());

-- Performance view inherits source-table RLS through the underlying tables.
-- Realtime is additive and safe to rerun.
do $$ begin
  alter publication supabase_realtime add table public.eventos;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.actividades;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.participaciones;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.roles_actividad;
exception when duplicate_object then null; end $$;

commit;