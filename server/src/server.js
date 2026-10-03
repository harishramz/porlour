import { app } from './app.js';
import { config } from './config.js';

app.listen(config.port, () => {
  console.log(`Aura Luxe API listening on http://localhost:${config.port}`);
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    console.warn('Supabase is not configured. Copy .env.example to .env and add your project credentials.');
  }
});