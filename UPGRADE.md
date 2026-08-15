# Regional 17 Volunteers — Upgrade

## Arquitectura

La aplicación conserva el enfoque estático de `index.html`, pero separa la lógica en `app.js`, la configuración en `config.js` y la selección inteligente en `selection.js`. Usa `@supabase/supabase-js@2` por CDN y Leaflet 1.9.4 para el mapa. Supabase recomienda `supabase-js` directamente para una aplicación que maneja Auth en el navegador; la seguridad de las operaciones depende de RLS. Nunca se debe colocar una `service_role`/secret key en el navegador.

## Configuración

`config.js` ya está configurado contra el proyecto Supabase real `Regional17-Voluntarios` usando su URL pública y una clave publishable/publica. No contiene `service_role`.

## Migraciones nuevas

Se aplicaron directamente al proyecto de producción, de forma aditiva:
- `20260815_volunteers_platform.sql`: centros geolocalizables, eventos, actividades, participaciones, roles, vista de desempeño, índices, RLS y Realtime.
- `20260815_compatibility_fields.sql`: cédula, correo y teléfono opcionales en voluntarios para mantener compatibilidad con el buscador/formularios.

Las migraciones son aditivas y no borran datos existentes. La eliminación de voluntarios, centros y eventos desde la UI se implementa como archivado lógico para conservar historial.

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

El proyecto Supabase está activo y las tablas nuevas (`roles_actividad`, `eventos`, `actividades`, `participaciones`) existen después de aplicar las migraciones. Se ejecutó el asesor de rendimiento/seguridad. Quedan advertencias heredadas y algunas recomendaciones de índices/políticas; no se modificaron automáticamente las funciones SECURITY DEFINER existentes porque pueden formar parte de la arquitectura actual de autenticación.

La validación E2E de navegador (login, clicks, responsive y consola) todavía requiere ejecutar el sitio desplegado en un navegador real.
