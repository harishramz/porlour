import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireSupabase, supabase } from '../lib/supabase.js';
import { appointmentsRouter } from './appointments.js';
import { createCatalogRouter } from './catalog.js';
import { profilesRouter } from './profiles.js';
import { reportsRouter } from './reports.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => res.json({ status: 'ok' }));
apiRouter.get('/auth/me', requireSupabase, authenticate, asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, date_of_birth, avatar_url, address, preferences, role')
    .eq('id', req.auth.id)
    .single();
  if (error) throw error;
  res.json({ user: { id: req.auth.id, email: req.auth.email }, profile: data });
}));

apiRouter.use('/services', createCatalogRouter('salon_services'));
apiRouter.use('/staff', createCatalogRouter('staff_members'));
apiRouter.use('/offers', createCatalogRouter('salon_offers'));
apiRouter.use('/reviews', createCatalogRouter('salon_reviews', { customerCanCreate: true }));
apiRouter.use('/gallery', createCatalogRouter('gallery_items'));
apiRouter.use('/appointments', appointmentsRouter);
apiRouter.use('/customers', profilesRouter);
apiRouter.use('/reports', reportsRouter);