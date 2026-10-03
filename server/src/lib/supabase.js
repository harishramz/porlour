import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

const hasSupabaseConfig = config.supabaseUrl && config.supabaseServiceRoleKey;

export const supabase = hasSupabaseConfig
  ? createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export const requireSupabase = (req, res, next) => {
  if (!supabase) {
    return res.status(503).json({
      error: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    });
  }
  next();
};