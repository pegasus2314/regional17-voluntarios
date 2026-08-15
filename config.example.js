// Copy to config.js for static hosting, or inject window.RV_CONFIG before app.js.
// Supabase anon/public key is safe to expose in a browser when RLS is correctly configured.
// NEVER put a service_role key here.
window.RV_CONFIG = {
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_PUBLIC_KEY',
  MAP_DEFAULT_LAT: 18.808,
  MAP_DEFAULT_LNG: -69.784,
  MAP_DEFAULT_ZOOM: 10
};