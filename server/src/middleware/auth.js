import { supabase } from '../lib/supabase.js';
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

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    return res.status(401).json({ error: 'The access token is invalid or expired.' });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) return res.status(403).json({ error: 'A user profile is required.' });

  req.auth = {
    id: authData.user.id,
    email: authData.user.email,
    role: profile.role,
    accessToken: token
  };
  next();
});

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.role)) {
    return res.status(403).json({ error: 'You do not have permission to perform this action.' });
  }
  next();
};