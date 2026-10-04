import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requireSupabase, supabase } from '../lib/supabase.js';

const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  date_of_birth: z.string().date().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  address: z.string().max(500).optional(),
  preferences: z.record(z.unknown()).optional()
}).strict();

export const profilesRouter = Router();
profilesRouter.use(requireSupabase, authenticate);

profilesRouter.get('/', requireRole('admin'), asyncHandler(async (req, res) => {
  const [{ data: profiles, error: profilesError }, { data: appointments, error: appointmentsError }] = await Promise.all([
    supabase.from('profiles').select('id, email, full_name, phone, avatar_url, role, created_at'),
    supabase.from('appointments').select('customer_id, status, data, date')
  ]);
  if (profilesError) throw profilesError;
  if (appointmentsError) throw appointmentsError;

  const customerAppointments = new Map();
  for (const appointment of appointments || []) {
    const entries = customerAppointments.get(appointment.customer_id) || [];
    entries.push(appointment);
    customerAppointments.set(appointment.customer_id, entries);
  }

  res.json((profiles || []).filter((profile) => profile.role === 'customer').map((profile) => {
    const visits = customerAppointments.get(profile.id) || [];
    const completed = visits.filter((appointment) => appointment.status === 'Completed');
    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      avatar: profile.avatar_url,
      role: profile.role,
      totalAppointments: visits.length,
      totalSpending: completed.reduce((sum, appointment) => sum + Number(appointment.data.price || 0), 0),
      lastVisit: completed.map((appointment) => appointment.date).sort().at(-1) || 'Never',
      status: visits.length ? 'Active' : 'New Customer',
      createdAt: profile.created_at
    };
  }));
}));

profilesRouter.get('/me', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, date_of_birth, avatar_url, address, preferences, role, created_at, updated_at')
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
    .select('id, email, full_name, phone, date_of_birth, avatar_url, address, preferences, role, created_at, updated_at')
    .single();
  if (error) throw error;
  res.json(data);
}));