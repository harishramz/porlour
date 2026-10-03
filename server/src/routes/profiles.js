import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireSupabase, supabase } from '../lib/supabase.js';

const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  avatar_url: z.string().url().nullable().optional(),
  address: z.string().max(500).optional(),
  preferences: z.record(z.unknown()).optional()
}).strict();

export const profilesRouter = Router();
profilesRouter.use(requireSupabase, authenticate);

profilesRouter.get('/me', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, avatar_url, address, preferences, role, created_at, updated_at')
    .eq('id', req.auth.id)
    .single();
  if (error) throw error;
  res.json(data);
}));

profilesRouter.patch('/me', asyncHandler(async (req, res) => {
  const updates = profileUpdateSchema.parse(req.body);
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', req.auth.id)
    .select('id, email, full_name, phone, avatar_url, address, preferences, role, created_at, updated_at')
    .single();
  if (error) throw error;
  res.json(data);
}));