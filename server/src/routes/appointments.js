import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requireSupabase, supabase } from '../lib/supabase.js';

const appointmentSchema = z.object({
  serviceId: z.string().min(1),
  serviceName: z.string().optional(),
  category: z.string().optional(),
  staffId: z.string().optional().nullable(),
  staffName: z.string().optional(),
  date: z.string().date(),
  time: z.string().min(1),
  duration: z.string().optional(),
  price: z.coerce.number().nonnegative(),
  notes: z.string().max(2000).optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional()
});

const statusSchema = z.object({ status: z.enum(['Pending', 'Confirmed', 'Completed', 'Cancelled']) });

const serialize = (row) => ({
  ...row.data,
  id: row.id,
  customerId: row.customer_id,
  date: row.date,
  time: row.time,
  staffId: row.staff_id,
  status: row.status,
  createdAt: row.created_at
});

export const appointmentsRouter = Router();

appointmentsRouter.get('/availability/slots', requireSupabase, asyncHandler(async (req, res) => {
  const date = z.string().date().parse(req.query.date);
  const staffId = typeof req.query.staffId === 'string' ? req.query.staffId : 'any';
  let query = supabase
    .from('appointments')
    .select('time, staff_id')
    .eq('date', date)
    .neq('status', 'Cancelled');
  if (staffId !== 'any') query = query.eq('staff_id', staffId);

  const { data, error } = await query;
  if (error) throw error;

  const times = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  const booked = new Set((data || []).map((appointment) => appointment.time));
  res.json(times.map((time) => ({ time, isAvailable: !booked.has(time) })));
}));

appointmentsRouter.use(requireSupabase, authenticate);

appointmentsRouter.get('/', asyncHandler(async (req, res) => {
  let query = supabase.from('appointments').select('*').order('date', { ascending: false });
  if (req.auth.role !== 'admin') query = query.eq('customer_id', req.auth.id);
  const { data, error } = await query;
  if (error) throw error;
  res.json((data || []).map(serialize));
}));

appointmentsRouter.post('/', asyncHandler(async (req, res) => {
  const body = appointmentSchema.parse(req.body);
  const id = randomUUID();
  const customerId = req.auth.role === 'admin' && typeof req.body.customerId === 'string'
    ? req.body.customerId
    : req.auth.id;
  const data = {
    ...body,
    id,
    customerId,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  const { data: row, error } = await supabase
    .from('appointments')
    .insert({
      id,
      customer_id: customerId,
      date: body.date,
      time: body.time,
      staff_id: body.staffId && body.staffId !== 'any' ? body.staffId : null,
      status: data.status,
      data
    })
    .select('*')
    .single();
  if (error) throw error;
  res.status(201).json(serialize(row));
}));

appointmentsRouter.get('/:id', asyncHandler(async (req, res) => {
  let query = supabase.from('appointments').select('*').eq('id', req.params.id);
  if (req.auth.role !== 'admin') query = query.eq('customer_id', req.auth.id);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  if (!data) return res.status(404).json({ error: 'Appointment not found.' });
  res.json(serialize(data));
}));

appointmentsRouter.patch('/:id/cancel', asyncHandler(async (req, res) => {
  const reason = z.string().max(500).optional().parse(req.body?.reason);
  let query = supabase.from('appointments').select('*').eq('id', req.params.id);
  if (req.auth.role !== 'admin') query = query.eq('customer_id', req.auth.id);
  const { data: appointment, error: readError } = await query.maybeSingle();
  if (readError) throw readError;
  if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

  const data = {
    ...appointment.data,
    status: 'Cancelled',
    cancellationReason: reason || 'Cancelled by client',
    cancelledAt: new Date().toISOString()
  };
  const { data: updated, error } = await supabase
    .from('appointments')
    .update({ status: 'Cancelled', data })
    .eq('id', req.params.id)
    .select('*')
    .single();
  if (error) throw error;
  res.json(serialize(updated));
}));

appointmentsRouter.patch('/:id/status', requireRole('admin'), asyncHandler(async (req, res) => {
  const { status } = statusSchema.parse(req.body);
  const { data: appointment, error: readError } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (readError) throw readError;
  if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

  const data = { ...appointment.data, status };
  const { data: updated, error } = await supabase
    .from('appointments')
    .update({ status, data })
    .eq('id', req.params.id)
    .select('*')
    .single();
  if (error) throw error;
  res.json(serialize(updated));
}));
