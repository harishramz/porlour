import { Router } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';
import { requireSupabase } from '../lib/supabase.js';
import { resolveServicePricing } from '../lib/catalogPricing.js';
import { createRazorpayOrder, getRazorpayOrder, verifyRazorpayPayment } from '../lib/razorpay.js';
import { config } from '../config.js';

const orderSchema = z.object({
  serviceId: z.string().min(1),
  serviceOptionId: z.string().optional(),
  serviceVariantIds: z.array(z.string()).max(50).optional()
});

const verifySchema = z.object({
  razorpayOrderId: z.string().regex(/^order_[A-Za-z0-9]+$/),
  razorpayPaymentId: z.string().regex(/^pay_[A-Za-z0-9]+$/),
  razorpaySignature: z.string().regex(/^[a-f0-9]{64}$/i)
});

export const paymentsRouter = Router();
paymentsRouter.use(requireSupabase, authenticate);

paymentsRouter.post('/orders', asyncHandler(async (req, res) => {
  const body = orderSchema.parse(req.body);
  const pricing = await resolveServicePricing(body);
  if (pricing.amount < 100) {
    return res.status(400).json({ error: 'The payment amount must be at least 100 paise.' });
  }
  const order = await createRazorpayOrder({
    amount: pricing.amount,
    receipt: `apt_${crypto.randomUUID().replaceAll('-', '').slice(0, 28)}`,
    notes: { userId: req.auth.id, serviceId: body.serviceId }
  });

  res.status(201).json({
    // The public key is safe to expose to the browser. The secret is never
    // returned from this endpoint.
    key_id: config.razorpayKeyId,
    order_id: order.id,
    amount: pricing.amount,
    currency: config.razorpayCurrency,
    servicePrice: pricing.price
  });
}));

paymentsRouter.post('/verify', asyncHandler(async (req, res) => {
  const body = verifySchema.parse(req.body);
  const order = await getRazorpayOrder(body.razorpayOrderId);
  if (order.notes?.userId !== req.auth.id) {
    return res.status(403).json({ error: 'Payment order does not belong to this account.' });
  }

  const payment = await verifyRazorpayPayment({
    orderId: body.razorpayOrderId,
    paymentId: body.razorpayPaymentId,
    signature: body.razorpaySignature,
    expectedAmount: order.amount,
    expectedUserId: req.auth.id
  });
  res.json({ verified: true, ...payment });
}));
