import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 4000,
  clientOrigins: (process.env.CLIENT_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  supabaseUrl: process.env.SUPABASE_URL,
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
  supabaseJwksUrl: process.env.SUPABASE_JWKS_URL
};