import { app } from './app.js';
import { config } from './config.js';

app.listen(config.port, () => {
  console.log(`Aura Luxe API listening on http://localhost:${config.port}`);
  if (!config.supabaseUrl || !config.supabasePublishableKey || !config.supabaseSecretKey) {
    console.warn('Supabase DB access is not configured. Set SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, and SUPABASE_SECRET_KEY in server/.env.');
  }
});