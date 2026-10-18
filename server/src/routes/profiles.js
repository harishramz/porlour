import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requireSupabase, supabase } from '../lib/supabase.js';
import { config } from '../config.js';

const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  date_of_birth: z.string().date().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  address: z.string().max(500).optional(),
  preferences: z.record(z.unknown()).optional()
}).strict();

const customerCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).default('')
}).strict();

const getAdminPasswordSetupRedirect = (req) => {
  const requestOrigin = req.get('origin');
  const origin = config.clientOrigins.includes(requestOrigin) ? requestOrigin : config.clientOrigins[0];
  const redirect = new URL('/forgot-password', origin);
  redirect.searchParams.set('mode', 'reset');
  redirect.searchParams.set('returnTo', '/admin/login');
  redirect.searchParams.set('setup', 'admin');
  return redirect.toString();
};

export const profilesRouter = Router();
profilesRouter.use(requireSupabase, authenticate);

profilesRouter.post('/', requireRole('admin'), asyncHandler(async (req, res) => {
  const customer = customerCreateSchema.parse(req.body);
  const { data: invitation, error: invitationError } = await supabase.auth.admin.inviteUserByEmail(
    customer.email,
    { data: { full_name: customer.name, phone: customer.phone } }
  );
  if (invitationError) throw invitationError;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, avatar_url, role, created_at')
    .eq('id', invitation.user.id)
    .single();
  if (profileError) throw profileError;

  res.status(201).json({
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    avatar: profile.avatar_url || '',
    role: profile.role,
    totalAppointments: 0,
    totalSpending: 0,
    lastVisit: 'Never',
    status: 'New Customer',
    createdAt: profile.created_at
  });
}));

profilesRouter.get('/admins', requireRole('admin'), asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, created_at')
    .eq('role', 'admin')
    .order('created_at', { ascending: true });
  if (error) throw error;
  res.json((data || []).map((profile) => ({
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    avatar: profile.avatar_url || '',
    createdAt: profile.created_at
  })));
}));

profilesRouter.post('/admins', requireRole('admin'), asyncHandler(async (req, res) => {
  const adminInviteSchema = z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254)
  }).strict();
  const invite = adminInviteSchema.parse(req.body);
  const { data: invitation, error: invitationError } = await supabase.auth.admin.inviteUserByEmail(
    invite.email,
    {
      data: { full_name: invite.name },
      redirectTo: getAdminPasswordSetupRedirect(req)
    }
  );
  if (invitationError) throw invitationError;
  if (!invitation.user) throw new Error('Supabase did not return the invited admin account.');

  const { data: updatedUser, error: roleError } = await supabase.auth.admin.updateUserById(
    invitation.user.id,
    { app_metadata: { ...invitation.user.app_metadata, role: 'admin' } }
  );
  if (roleError) throw roleError;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: updatedUser.user.id,
      email: updatedUser.user.email || invite.email,
      full_name: invite.name,
      role: 'admin'
    }, { onConflict: 'id' })
    .select('id, email, full_name, avatar_url, created_at')
    .single();
  if (profileError) throw profileError;

  res.status(201).json({
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    avatar: profile.avatar_url || '',
    createdAt: profile.created_at
  });
}));

profilesRouter.post('/admins/:id/send-password-setup', requireRole('admin'), asyncHandler(async (req, res) => {
  const adminId = z.string().uuid().parse(req.params.id);
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', adminId)
    .eq('role', 'admin')
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) return res.status(404).json({ error: 'Administrator not found.' });

  const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
    redirectTo: getAdminPasswordSetupRedirect(req)
  });
  if (error) throw error;
  res.json({ success: true });
}));

profilesRouter.delete('/admins/:id', requireRole('admin'), asyncHandler(async (req, res) => {
  const adminId = z.string().uuid().parse(req.params.id);
  if (adminId === req.auth.id) {
    return res.status(400).json({ error: 'You cannot remove your own administrator account.' });
  }

  const { count, error: countError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'admin');
  if (countError) throw countError;
  if ((count || 0) <= 1) {
    return res.status(400).json({ error: 'The last administrator account cannot be removed.' });
  }

  const { data: targetAdmin, error: targetError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', adminId)
    .eq('role', 'admin')
    .maybeSingle();
  if (targetError) throw targetError;
  if (!targetAdmin) return res.status(404).json({ error: 'Administrator not found.' });

  const { error: deletionError } = await supabase.auth.admin.deleteUser(adminId);
  if (deletionError) throw deletionError;
  res.json({ success: true, id: adminId });
}));

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

profilesRouter.delete('/:id', requireRole('admin'), asyncHandler(async (req, res) => {
  const customerId = z.string().uuid().parse(req.params.id);
  const { data: customer, error: customerError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', customerId)
    .maybeSingle();
  if (customerError) throw customerError;
  if (!customer || customer.role !== 'customer') {
    return res.status(404).json({ error: 'Customer not found.' });
  }

  const { error: deletionError } = await supabase.auth.admin.deleteUser(customerId);
  if (deletionError) throw deletionError;
  res.json({ success: true, id: customerId });
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