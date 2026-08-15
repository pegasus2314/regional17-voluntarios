-- Additive compatibility fields used by the upgraded UI.
begin;
alter table public.voluntarios add column if not exists cedula text;
alter table public.voluntarios add column if not exists email text;
alter table public.voluntarios add column if not exists telefono text;
create index if not exists idx_voluntarios_cedula on public.voluntarios(cedula) where cedula is not null;
create index if not exists idx_voluntarios_email on public.voluntarios(lower(email)) where email is not null;
commit;