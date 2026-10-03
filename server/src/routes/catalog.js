import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requireSupabase, supabase } from '../lib/supabase.js';

const payloadSchema = z.record(z.unknown());

export const createCatalogRouter = (table, { customerCanCreate = false } = {}) => {
  const router = Router();

  router.get('/', requireSupabase, asyncHandler(async (req, res) => {
    const { data, error } = await supabase
      .from(table)
      .select('id, data')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map((item) => ({ ...item.data, id: item.id })));
  }));

  router.get('/:id', requireSupabase, asyncHandler(async (req, res) => {
    const { data, error } = await supabase
      .from(table)
      .select('id, data')
      .eq('id', req.params.id)
      .eq('is_active', true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Record not found.' });
    res.json({ ...data.data, id: data.id });
  }));

  router.post('/', requireSupabase, authenticate, requireRole(...(customerCanCreate ? ['admin', 'customer'] : ['admin'])), asyncHandler(async (req, res) => {
    const body = payloadSchema.parse(req.body);
    const id = typeof body.id === 'string' && body.id ? body.id : randomUUID();
    const data = { ...body, id };
    if (table === 'salon_reviews' && req.auth.role !== 'admin') {
      data.customerId = req.auth.id;
      data.verified = true;
    }

    const { error } = await supabase.from(table).insert({ id, data });
    if (error) throw error;
    res.status(201).json(data);
  }));

  router.put('/:id', requireSupabase, authenticate, requireRole('admin'), asyncHandler(async (req, res) => {
    const body = payloadSchema.parse(req.body);
    const { data: existing, error: readError } = await supabase
      .from(table)
      .select('data')
      .eq('id', req.params.id)
      .maybeSingle();
    if (readError) throw readError;
    if (!existing) return res.status(404).json({ error: 'Record not found.' });

    const updated = { ...existing.data, ...body, id: req.params.id };
    const { error } = await supabase.from(table).update({ data: updated }).eq('id', req.params.id);
    if (error) throw error;
    res.json(updated);
  }));

  router.delete('/:id', requireSupabase, authenticate, requireRole('admin'), asyncHandler(async (req, res) => {
    const { error } = await supabase
      .from(table)
      .update({ is_active: false })
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, id: req.params.id });
  }));

  return router;
};