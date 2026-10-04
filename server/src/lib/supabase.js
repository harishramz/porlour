import { createAdminClient } from '@supabase/server/core';
import { config } from '../config.js';

const hasSupabaseConfig = config.supabaseUrl && config.supabasePublishableKey && config.supabaseSecretKey;

export const supabase = hasSupabaseConfig
  ? createAdminClient()
  : null;

export const requireSupabase = (req, res, next) => {
  if (!supabase) {
    return res.status(503).json({
      error: 'Supabase is not configured. Set SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, and SUPABASE_SECRET_KEY.'
    });
  }
  next();
};