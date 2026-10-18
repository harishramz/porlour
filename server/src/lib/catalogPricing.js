import { supabase } from './supabase.js';

const normalize = (value) => String(value || '').trim().toLowerCase();

export const resolveServicePricing = async ({ serviceId, serviceOptionId, serviceVariantIds = [] }) => {
  const ids = [...new Set([serviceId, ...serviceVariantIds].filter(Boolean))];
  const { data: rows, error } = await supabase
    .from('salon_services')
    .select('id, data')
    .eq('is_active', true)
    .in('id', ids);
  if (error) throw error;

  const selectedRow = rows?.find((row) => row.id === serviceId) || rows?.[0];
  if (!selectedRow) {
    const error = new Error('The selected service is no longer available.');
    error.status = 400;
    throw error;
  }

  const optionId = normalize(serviceOptionId);
  const optionRows = rows.filter((row) => {
    const name = normalize(row.data?.name);
    return optionId && name.endsWith(optionId);
  });
  const row = optionRows[0] || selectedRow;
  const variants = Array.isArray(row.data?.variants) ? row.data.variants : [];
  const option = variants.find((variant) => (
    normalize(variant.id) === optionId || normalize(variant.name) === optionId
  ));
  const price = option?.price ?? row.data?.price;

  if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
    const error = new Error('This service does not have a payable price.');
    error.status = 400;
    throw error;
  }

  return {
    amount: Math.round(Number(price) * 100),
    price: Number(price),
    service: row.data
  };
};
