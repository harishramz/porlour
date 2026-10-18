import crypto from 'node:crypto';
import { config } from '../config.js';

const razorpayBaseUrl = 'https://api.razorpay.com/v1';

const requireRazorpayConfig = () => {
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    const error = new Error('Online payments are not configured on the server.');
    error.status = 503;
    throw error;
  }
};

const razorpayRequest = async (path, options = {}) => {
  requireRazorpayConfig();
  const response = await fetch(`${razorpayBaseUrl}${path}`, {
    ...options,
    signal: AbortSignal.timeout(10000),
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error?.description || 'Razorpay request failed.');
    error.status = response.status >= 400 && response.status < 500 ? 400 : 502;
    throw error;
  }
  return result;
};

export const createRazorpayOrder = async ({ amount, receipt, notes }) =>
  razorpayRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({ amount, currency: config.razorpayCurrency, receipt, notes })
  });

export const getRazorpayOrder = async (orderId) =>
  razorpayRequest(`/orders/${encodeURIComponent(orderId)}`);

const signaturesMatch = (payload, signature) => {
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = crypto
    .createHmac('sha256', config.razorpayKeySecret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
};

export const verifyRazorpayPayment = async ({
  orderId,
  paymentId,
  signature,
  expectedAmount,
  expectedUserId,
  expectedServiceId
}) => {
  requireRazorpayConfig();
  if (!signaturesMatch(`${orderId}|${paymentId}`, signature)) {
    const error = new Error('Razorpay payment signature verification failed.');
    error.status = 400;
    throw error;
  }

  const [order, payment] = await Promise.all([
    getRazorpayOrder(orderId),
    razorpayRequest(`/payments/${encodeURIComponent(paymentId)}`)
  ]);

  if (
    order.id !== orderId ||
    payment.order_id !== orderId ||
    (expectedUserId && order.notes?.userId !== expectedUserId) ||
    (expectedServiceId && order.notes?.serviceId !== expectedServiceId) ||
    payment.currency !== config.razorpayCurrency ||
    Number(order.amount) !== Number(expectedAmount) ||
    Number(payment.amount) !== Number(expectedAmount) ||
    payment.status !== 'captured'
  ) {
    const error = new Error('Razorpay payment was not captured for the expected order amount.');
    error.status = 400;
    throw error;
  }

  return {
    orderId,
    paymentId,
    amount: Number(payment.amount),
    currency: payment.currency,
    status: payment.status
  };
};
