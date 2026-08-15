# Regional 17 Volunteers — Upgrade

## Arquitectura

La aplicación conserva el enfoque estático de `index.html`, pero separa la lógica en `app.js`, la configuración en `config.js` y la selección inteligente en `selection.js`. Usa `@supabase/supabase-js@2` por CDN y Leaflet 1.9.4 para el mapa. Supabase recomienda `supabase-js` directamente para una aplicación que maneja Auth en el navegador; la seguridad de las operaciones depende de RLS. Nunca se debe colocar una `service_role`/secret key en el navegador.

## Configuración

1. Copia `config.example.js` como `config.js`.
2. Define `SUPABASE_URL` y la clave pública/anon del proyecto.
3. No cometas una clave secreta.
4. Ejecuta en Supabase, en este orden, el esquema existente `schema.sql` y las migraciones de `migrations/`.

La configuración actual de `config.js` contiene marcadores de posición y por eso la app muestra una pantalla de configuración hasta que se complete.

## Migraciones nuevas

- `20260815_volunteers_platform.sql`: centros geolocalizables, eventos, actividades, participaciones, roles, vista de desempeño, índices, RLS y Realtime.
- `20260815_compatibility_fields.sql`: cédula, correo y teléfono opcionales en voluntarios para mantener compatibilidad con el buscador/formularios.

Las migraciones son aditivas y no borran datos existentes. La eliminación de voluntarios, centros y eventos desde la UI se implementa como archivado lógico (`estatus=Inactivo` o `is_active=false`) para conservar historial.

## Funcionalidades

- Búsqueda continua con debounce.
- Perfil completo y desempeño 0–100.
- CRUD de voluntarios y archivado seguro.
- CRUD de centros educativos con geolocalización.
- CRUD de eventos.
- Actividades y relación normalizada de participaciones.
- Roles de actividad configurables.
- Selección inteligente por experiencia, rol y desempeño.
- Dashboard y estadísticas.
- Mapa de centros/eventos con filtros y rutas externas.
- Realtime para voluntarios, centros, actividades, participaciones y eventos.
- RLS para las nuevas tablas y compatibilidad con las políticas existentes.
- Responsive desktop/tablet/mobile.

## Validación

En este entorno se inspeccionó el árbol y el código de GitHub y se realizaron comprobaciones estructurales de los cambios. No fue posible ejecutar una sesión real contra tu proyecto Supabase ni levantar un navegador conectado a Internet desde el entorno de trabajo, por lo que la prueba E2E de Login/Supabase/Realtime debe hacerse después de aplicar las migraciones y configurar `config.js`.

La CDN de Supabase utilizada es la variante v2 documentada oficialmente. Leaflet 1.9.4 se utiliza para el mapa y OpenStreetMap como fuente de teselas, con atribución visible.
