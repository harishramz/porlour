import { fromSupabaseUrl } from '@supabase/server';
import { verifyAuth } from '@supabase/server/core';
import { supabase } from '../lib/supabase.js';
import { config } from '../config.js';
import { asyncHandler } from './asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({ error: 'A valid bearer access token is required.' });
  }

  if (!supabase) {
    return res.status(503).json({ error: 'Supabase is not configured.' });
  }

  const request = new Request('http://localhost/', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const { data: verifiedAuth, error: authError } = await verifyAuth(request, {
    auth: 'user',
    issuer: fromSupabaseUrl(config.supabaseUrl)
  });
  if (authError || !verifiedAuth?.userClaims?.id) {
    return res.status(authError?.status || 401).json({
      error: 'The access token is invalid or expired.',
      code: authError?.code
    });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', verifiedAuth.userClaims.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) return res.status(403).json({ error: 'A user profile is required.' });

  req.auth = {
    id: verifiedAuth.userClaims.id,
    email: verifiedAuth.userClaims.email,
    role: profile.role,
    accessToken: verifiedAuth.token
  };
  next();
});

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.role)) {
    return res.status(403).json({ error: 'You do not have permission to perform this action.' });
  }
  next();
};