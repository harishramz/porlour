export const PAYMENT_METHODS = {
  AFTER_TREATMENT: 'after_treatment',
  ONLINE: 'online'
};

export const getPaymentMethodLabel = (method) =>
  method === PAYMENT_METHODS.ONLINE ? 'Pay online' : 'Pay after treatment';
