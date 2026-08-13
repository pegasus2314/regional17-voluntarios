# Registro de Voluntarios · Regional 17 Monte Plata — versión multiusuario (Supabase)

Esta es la migración de la app de un solo usuario (con `window.storage`, tipo
artifact) a una app **multiusuario en tiempo real** con Postgres, Auth y RLS
en Supabase. El diseño visual y las tres vistas originales (Panel de
coordinación, Centros educativos, Actualizar mis datos) se mantienen; se
añadió una cuarta vista, **Usuarios**, visible solo para administradores.

## Novedades de esta versión

- **Buscador de centros educativos**: en la pestaña "Centros educativos" hay
  ahora un campo de búsqueda que filtra por nombre del centro o del
  distrito, en tiempo real, visible para los tres roles.
- **Los voluntarios ahora pueden cambiar su propio estatus**: antes solo
  podían tocar disponibilidad, notas y los centros que cubren; el estatus lo
  asignaba únicamente coordinación. Ahora "Actualizar mis datos" incluye un
  selector de estatus editable por el propio voluntario. Esto se aplicó
  tanto en la interfaz como en el trigger de la base de datos
  (`enforce_voluntario_restrictions` en `schema.sql`); nombre, distrito y
  categoría siguen bloqueados para ese rol. Si ya ejecutaste `schema.sql`
  antes, vuelve a correr solo el bloque de esa función (o el archivo
  completo, es seguro repetirlo) para aplicar el cambio.

## Qué contiene esta carpeta

| Archivo       | Qué hace |
|---------------|----------|
| `schema.sql`  | Crea las tablas, funciones, triggers, políticas de RLS y activa Realtime. |
| `seed.sql`    | Migra los 96 voluntarios y los 25 centros educativos que ya tenías cargados. |
| `index.html`  | La aplicación completa (Auth + CRUD + Realtime), un solo archivo, sin build step. |

## 1. Crear el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**.
2. Guarda la contraseña de la base de datos en un lugar seguro.
3. Cuando el proyecto esté listo, entra a **SQL Editor**.

## 2. Ejecutar el esquema

1. Abre `schema.sql`, cópialo completo y pégalo en el SQL Editor de Supabase.
2. Ejecuta (**Run**). Esto crea las tablas `distritos`, `centros_educativos`,
   `voluntarios`, `voluntario_centros`, `profiles`, las funciones/triggers de
   permisos, y activa Realtime sobre las cuatro primeras tablas.
3. Confirma en **Database → Replication** que las 4 tablas aparecen dentro
   de la publicación `supabase_realtime` con Realtime activado.

## 3. Migrar los datos existentes

1. Abre `seed.sql`, cópialo y pégalo en el SQL Editor.
2. Ejecuta. Esto inserta los 5 distritos, los 25 centros educativos ya
   verificados y los 96 voluntarios del roster original, todos con estatus
   `Sin contactar` (que era su estado en el registro anterior).
3. Este script usa `on conflict do nothing` en distritos/centros, así que es
   seguro volver a correrlo sin duplicar esas dos tablas; los voluntarios
   **sí se duplicarían** si lo corres dos veces (no tienen restricción de
   unicidad por nombre a propósito, porque puede haber homónimos reales).

## 4. Conectar la app a tu proyecto

1. En Supabase, ve a **Project Settings → API**.
2. Copia el **Project URL** y la **anon public key**.
3. Abre `index.html` y reemplaza, cerca del inicio del `<script>`:

   ```js
   const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
   const SUPABASE_ANON_KEY = "TU-ANON-KEY-PUBLICA";
   ```

   La `anon key` es pública por diseño (viaja al navegador de cualquier
   usuario); la seguridad real la dan las políticas de RLS en `schema.sql`,
   no esta clave. Nunca pongas ahí la `service_role key`.

## 5. Crear el primer administrador

1. Abre `index.html` en un navegador (ver sección 6) y crea una cuenta desde
   la pantalla "Regístrate" con tu correo real.
2. Por defecto, toda cuenta nueva entra con rol `voluntario` (lo hace un
   trigger en la base de datos). Para volverte administrador, corre en el
   SQL Editor:

   ```sql
   update public.profiles set role = 'admin' where email = 'tu-correo@ejemplo.org';
   ```
3. Recarga la app: ahora verás la pestaña "Usuarios", donde puedes asignar
   roles (`admin`, `coordinador`, `voluntario`) a las demás cuentas que se
   vayan registrando, sin volver a tocar SQL.

> Si en **Authentication → Providers → Email** tienes activada la
> confirmación por correo, cada cuenta nueva debe confirmar su email antes
> de poder iniciar sesión.

## 6. Cómo abrir/alojar `index.html`

- **Para probarlo rápido**: ábrelo con doble clic en tu navegador (o
  `python3 -m http.server` en esa carpeta y entra a `localhost:8000`).
- **Para producción**: súbelo a cualquier hosting estático (Vercel, Netlify,
  GitHub Pages, un bucket S3, tu propio servidor). No necesita backend
  propio — todo el backend es Supabase.
- Si lo pegas dentro de un artifact de Claude.ai para previsualizarlo, es
  posible que el `<script src="https://cdn.jsdelivr.net/...">` no cargue,
  porque ese entorno solo permite scripts desde `cdnjs.cloudflare.com`.
  Ábrelo fuera de Claude.ai (localmente o ya desplegado) para usarlo de
  verdad.

## Modelo de permisos

| Acción | Admin | Coordinador | Voluntario |
|---|---|---|---|
| Ver voluntarios, centros, distritos | ✅ | ✅ | ✅ |
| Crear/editar/eliminar centros educativos | ✅ | ✅ | ❌ |
| Crear voluntarios, cambiar estatus, notas, disponibilidad y asignaciones de cualquiera | ✅ | ✅ | ❌ |
| Eliminar voluntarios | ✅ | ❌ | ❌ |
| Editar su **propio** estatus, disponibilidad, notas y qué centros puede cubrir | ✅ | ✅ | ✅ (solo su propio registro, vinculado por correo) |
| Cambiar su propia categoría/distrito/nombre | ❌ | ❌ | ❌ (lo bloquea un trigger en la base de datos, no solo la interfaz) |
| Buscar centros educativos por nombre o distrito | ✅ | ✅ | ✅ (pestaña "Centros educativos", con buscador en tiempo real) |
| Asignar roles a otras cuentas | ✅ | ❌ | ❌ |

Estas reglas están implementadas dos veces por seguridad: en la interfaz
(oculta botones que el rol no puede usar) y en la base de datos vía RLS y
triggers (aunque alguien manipule el navegador o llame a la API de Supabase
directamente, la base de datos rechaza la operación).

## Tiempo real

La app se suscribe a cambios en `voluntarios`, `centros_educativos`,
`voluntario_centros` y `distritos` vía `supabase.channel(...).on('postgres_changes', ...)`.
Cuando cualquier usuario autorizado inserta, edita o borra algo, todos los
demás con la pestaña abierta ven el cambio al instante, sin recargar. El
indicador "Conectado en tiempo real" / "Reconectando…" en la parte superior
del panel refleja el estado real de esa conexión.

## Limitaciones conocidas / próximos pasos sugeridos

- **No pude crear ni probar un proyecto de Supabase real** desde este
  entorno (no tengo acceso de red a supabase.com), así que este esquema y
  esta app están escritos siguiendo la documentación oficial de Supabase
  pero **no han sido ejecutados contra una instancia real**. Antes de usarlo
  con datos sensibles de verdad, pruébalo primero en un proyecto de
  Supabase de desarrollo/staging.
- El registro (`signUp`) está abierto a cualquiera que tenga el link de la
  app; si prefieres invitar tú mismo a cada coordinador/voluntario en vez de
  autoregistro abierto, desactiva "Enable email signups" en Supabase Auth y
  usa **Authentication → Users → Invite user** en su lugar.
- La búsqueda de "mi nombre" en Autoservicio hace coincidencia parcial en el
  cliente; con cientos de voluntarios convendría mover ese filtro a una
  consulta `ilike` en Supabase.
- No se implementó borrado/archivo de un voluntario desde la interfaz de
  "Usuarios" ni historial de cambios de estatus; si lo necesitas, es una
  tabla `voluntario_historial` + un trigger adicional.
